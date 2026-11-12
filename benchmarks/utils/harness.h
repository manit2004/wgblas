#pragma once
/*
 * Shared cuBLAS benchmark runner — the C twin of harness.mjs, with the same
 * spec shape. Each `benchmarks/<routine>/cuda/<routine>.c` passes a spec to
 * `run_benchmark()`, which handles the points, memory skips, operands,
 * clock warming, timing, table and results JSON.
 *
 *   static const bench_spec spec = {
 *       .routine = "saxpy", .warmup = 5, .iters = 100,
 *       .defaults = { .alpha = 2.0, .inc = 1 },
 *       .operands = operands, // o[0] = vector(DT_F32, p->n * p->inc), ...
 *       .call = call,         // cublasSaxpy(device, p->n, ..., o[0].ptr, p->inc, ...)
 *       .bytes = bytes,       // → compute_GBs
 *       .flops = NULL,        // optional → compute_GFLOPs
 *       .sweeps = {
 *           { .name = "base",   .axes = { AXIS(n, L1_SIZES) } },             // → saxpy.json
 *           { .name = "stride", .axes = { AXIS(stride, STRIDES), AXIS(n, L1_SIZES) },
 *             .skip = stride_exceeds_n, .derive = inc_from_stride },       // → stride.saxpy.json
 *       },
 *   };
 *
 * Each point is `defaults`, then the sweep's `fixed` (its non-zero / non-NULL
 * fields — C can't tell "unset" from zero), then the axis values (outermost
 * first), then the spec's `derive`, then the sweep's; `skip` drops it
 * silently. Optional sweep fields: `fixed`, `derive`, `skip`, `record` (JSON
 * keys if not the axes'), `format` (display per key), `before_each`
 * (untimed, per call — e.g. `bench_refresh(&o[1])`), `warmup`/`iters`, and
 * `bytes`/`flops` to override the spec's. Operands are `vector()`,
 * `matrix()` (column-major) or `device_result()`. Points that won't fit in
 * free device memory or host RAM are skipped. A `device_result()` operand
 * gets no data and runs the timed calls in device pointer mode, so no result
 * copy is timed.
 *
 * Flags: `--sweeps=a,b` (subset), `--plan` (list points, no GPU),
 * `--check[=<gpu-slug>]` (diff points against committed results),
 * `--out=<dir>` (other results root).
 */
#include <stdbool.h>
#include <stddef.h>
#include "helpers.h"
#include "params.h"

/* ── Points ─────────────────────────────────────────────────────────────── */

/** A point's parameters — the fields a spec's axes, defaults and calls use. */
typedef struct {
    int n, m, inc, stride, lda, pad;
    int x_len, y_len;                /* derived vector lengths (gemv) */
    double alpha, beta, c, s;
    cuComplex calpha;                /* complex alpha (cscal) */
    const char *trans, *uplo, *diag; /* "no-transpose" / "lower" / "non-unit" style */
} bench_params;

typedef enum { K_INT, K_REAL, K_COMPLEX, K_STRING } bench_kind;

static const struct { const char *name; size_t off; bench_kind kind; } BENCH_FIELDS[] = {
    { "n", offsetof(bench_params, n), K_INT },
    { "m", offsetof(bench_params, m), K_INT },
    { "inc", offsetof(bench_params, inc), K_INT },
    { "stride", offsetof(bench_params, stride), K_INT },
    { "lda", offsetof(bench_params, lda), K_INT },
    { "pad", offsetof(bench_params, pad), K_INT },
    { "x_len", offsetof(bench_params, x_len), K_INT },
    { "y_len", offsetof(bench_params, y_len), K_INT },
    { "alpha", offsetof(bench_params, alpha), K_REAL },
    { "beta", offsetof(bench_params, beta), K_REAL },
    { "c", offsetof(bench_params, c), K_REAL },
    { "s", offsetof(bench_params, s), K_REAL },
    { "calpha", offsetof(bench_params, calpha), K_COMPLEX },
    { "trans", offsetof(bench_params, trans), K_STRING },
    { "uplo", offsetof(bench_params, uplo), K_STRING },
    { "diag", offsetof(bench_params, diag), K_STRING },
};
#define BENCH_N_FIELDS ((int)(sizeof BENCH_FIELDS / sizeof BENCH_FIELDS[0]))

/* cuBLAS enums from a point's string parameters. */
static cublasOperation_t op_of(const char *t) { return strcmp(t, "transpose") == 0 ? CUBLAS_OP_T : CUBLAS_OP_N; }
static cublasFillMode_t fill_of(const char *u) { return strcmp(u, "upper") == 0 ? CUBLAS_FILL_MODE_UPPER : CUBLAS_FILL_MODE_LOWER; }
static cublasDiagType_t diag_of(const char *d) { return strcmp(d, "unit") == 0 ? CUBLAS_DIAG_UNIT : CUBLAS_DIAG_NON_UNIT; }

static int bench_field(const char *name) {
    for (int i = 0; i < BENCH_N_FIELDS; i++)
        if (strcmp(BENCH_FIELDS[i].name, name) == 0) return i;
    fprintf(stderr, "harness.h: no bench_params field \"%s\"\n", name);
    exit(2);
}

/* ── Operands ───────────────────────────────────────────────────────────── */

typedef enum { DT_F32, DT_F64, DT_C32 } bench_dtype;

typedef struct {
    bool is_result;  /* device_result(): no data, enables device pointer mode */
    bench_dtype dtype;
    size_t length;   /* elements (vector / matrix) or bytes (result) */
    void *ptr;       /* device pointer, filled by the runner */
    int rows, ld;    /* matrix only; 0 for vectors */
    bool triangular; /* matrix only: diagonal set to 8 + rows */
} bench_operand;

#define BENCH_MAX_OPERANDS 4

/** A device vector of `length` random [-1, 1] elements. */
static bench_operand vector(bench_dtype dtype, size_t length) {
    return (bench_operand){ false, dtype, length, NULL, 0, 0, false };
}

typedef enum { FILL_RANDOM, FILL_TRIANGULAR } bench_fill;

/**
 * A column-major `rows`×`cols` device matrix with leading dimension `ld`,
 * random [-1, 1] — `FILL_TRIANGULAR` sets the diagonal to `8 + rows`, keeping
 * triangular solves well conditioned.
 */
static bench_operand matrix(bench_dtype dtype, int rows, int cols, int ld, bench_fill fill) {
    return (bench_operand){ false, dtype, (size_t)cols * ld, NULL, rows, ld, fill == FILL_TRIANGULAR };
}

/** A `bytes`-sized device buffer the call writes its scalar result to. */
static bench_operand device_result(size_t bytes) {
    return (bench_operand){ true, DT_F32, bytes, NULL, 0, 0, false };
}

static size_t bench_elem_size(bench_dtype dt) { return dt == DT_F32 ? sizeof(float) : 8; }

/* ── Specs ──────────────────────────────────────────────────────────────── */

typedef struct {
    const char *key;    /* JSON key / column */
    const char *field;  /* bench_params field it sets */
    const void *values; /* int[] / double[] / cuComplex[] matching the field */
    int count;
} bench_axis;

#define BENCH_COUNT(a) ((int)(sizeof(a) / sizeof((a)[0])))
/** Axis over `field` (also its JSON key), e.g. `AXIS(n, L1_SIZES)`. */
#define AXIS(field, arr) { #field, #field, (arr), BENCH_COUNT(arr) }
/** Axis whose JSON key differs from its field, e.g. `AXIS_AS("alpha", calpha, ...)`. */
#define AXIS_AS(key, field, arr) { key, #field, (arr), BENCH_COUNT(arr) }

typedef void (*bench_format_fn)(const bench_params *p, char *buf, size_t len);

typedef struct {
    const char *name;      /* "base" → <routine>.json, else <name>.<routine>.json */
    bench_axis axes[4];    /* outermost first; ends at the first without a key */
    bench_params fixed;    /* its non-zero / non-NULL fields override defaults */
    bool (*skip)(const bench_params *p);
    void (*derive)(bench_params *p);
    const char *record[4]; /* JSON keys (field names) if not the axes'; NULL-ended */
    struct { const char *key; bench_format_fn fn; } format[2];
    void (*before_each)(const bench_params *p, bench_operand *o);
    int warmup, iters;     /* 0: the spec's */
    double (*bytes)(const bench_params *p); /* override the spec's */
    double (*flops)(const bench_params *p); /* override the spec's */
} bench_sweep;

#define BENCH_MAX_SWEEPS 8

typedef struct {
    const char *routine;
    int warmup, iters;
    bench_params defaults;
    void (*derive)(bench_params *p); /* every point, before the sweep's */
    int (*operands)(const bench_params *p, bench_operand *o); /* fills o[], returns count */
    void (*call)(cublasHandle_t device, const bench_params *p, bench_operand *o);
    double (*bytes)(const bench_params *p);
    double (*flops)(const bench_params *p); /* optional */
    bench_sweep sweeps[BENCH_MAX_SWEEPS];   /* ends at the first without a name */
} bench_spec;

/* Shared stride-sweep hooks (the JS specs write these inline). */
static bool stride_exceeds_n(const bench_params *p) { return p->stride > p->n; }
static void inc_from_stride(bench_params *p) { p->inc = p->stride; }

/* ── Internals ──────────────────────────────────────────────────────────── */

static int bench_n_axes(const bench_sweep *sw) {
    int k = 0;
    while (k < 4 && sw->axes[k].key) k++;
    return k;
}

/* Record keys as (JSON key, field) pairs: `record` if given, else the axes. */
static int bench_record_keys(const bench_sweep *sw, const char **keys, const char **fields) {
    int k = 0;
    if (sw->record[0]) {
        for (; k < 4 && sw->record[k]; k++) keys[k] = fields[k] = sw->record[k];
    } else {
        for (; k < bench_n_axes(sw); k++) { keys[k] = sw->axes[k].key; fields[k] = sw->axes[k].field; }
    }
    return k;
}

static bench_format_fn bench_format_of(const bench_sweep *sw, const char *key) {
    for (int i = 0; i < 2; i++)
        if (sw->format[i].key && strcmp(sw->format[i].key, key) == 0) return sw->format[i].fn;
    return NULL;
}

static bool bench_is_string(const bench_sweep *sw, const char *key, int f) {
    return bench_format_of(sw, key) || BENCH_FIELDS[f].kind == K_COMPLEX ||
           BENCH_FIELDS[f].kind == K_STRING;
}

/* One key's value: display text, and its JSON fragment as save_results writes it. */
static void bench_value(const bench_sweep *sw, const char *key, const char *field,
                        const bench_params *p, char *shown, size_t slen, char *json, size_t jlen) {
    int f = bench_field(field);
    const char *base = (const char *)p + BENCH_FIELDS[f].off;
    bench_format_fn fmt = bench_format_of(sw, key);
    if (!fmt && BENCH_FIELDS[f].kind == K_STRING) {
        snprintf(shown, slen, "%s", *(const char *const *)base);
        snprintf(json, jlen, "\"%s\": \"%s\", ", key, shown);
    } else if (bench_is_string(sw, key, f)) {
        if (fmt) fmt(p, shown, slen);
        else snprintf(shown, slen, "%g%+gi", ((const cuComplex *)base)->x, ((const cuComplex *)base)->y);
        snprintf(json, jlen, "\"%s\": \"%s\", ", key, shown);
    } else if (BENCH_FIELDS[f].kind == K_INT) {
        snprintf(shown, slen, "%d", *(const int *)base);
        snprintf(json, jlen, "\"%s\": %d, ", key, *(const int *)base);
    } else {
        snprintf(shown, slen, "%g", (float)*(const double *)base);
        snprintf(json, jlen, "\"%s\": %g, ", key, (float)*(const double *)base);
    }
}

static int bench_point_cap(const bench_sweep *sw) {
    int cap = 1;
    for (int a = 0; a < bench_n_axes(sw); a++) cap *= sw->axes[a].count;
    return cap;
}

/* Every point of a sweep, in run order; returns the count. */
static int bench_points(const bench_spec *spec, const bench_sweep *sw, bench_params *out, int cap) {
    int na = bench_n_axes(sw), idx[4] = { 0, 0, 0, 0 }, n = 0;
    for (;;) {
        bench_params p = spec->defaults;
        for (int f = 0; f < BENCH_N_FIELDS; f++) { /* sweep.fixed: set fields only */
            const char *src = (const char *)&sw->fixed + BENCH_FIELDS[f].off;
            char *dst = (char *)&p + BENCH_FIELDS[f].off;
            switch (BENCH_FIELDS[f].kind) {
                case K_INT: if (*(const int *)src) *(int *)dst = *(const int *)src; break;
                case K_REAL: if (*(const double *)src) *(double *)dst = *(const double *)src; break;
                case K_STRING: if (*(const char *const *)src) *(const char **)dst = *(const char *const *)src; break;
                case K_COMPLEX: {
                    const cuComplex *z = (const cuComplex *)src;
                    if (z->x || z->y) *(cuComplex *)dst = *z;
                } break;
            }
        }
        for (int a = 0; a < na; a++) {
            const bench_axis *ax = &sw->axes[a];
            int f = bench_field(ax->field);
            char *dst = (char *)&p + BENCH_FIELDS[f].off;
            if (BENCH_FIELDS[f].kind == K_INT) *(int *)dst = ((const int *)ax->values)[idx[a]];
            else if (BENCH_FIELDS[f].kind == K_REAL) *(double *)dst = ((const double *)ax->values)[idx[a]];
            else if (BENCH_FIELDS[f].kind == K_STRING) *(const char **)dst = ((const char *const *)ax->values)[idx[a]];
            else *(cuComplex *)dst = ((const cuComplex *)ax->values)[idx[a]];
        }
        if (spec->derive) spec->derive(&p);
        if (sw->derive) sw->derive(&p);
        if (!(sw->skip && sw->skip(&p)) && n < cap) out[n++] = p;
        int a = na - 1; /* odometer: innermost axis fastest */
        while (a >= 0 && ++idx[a] == sw->axes[a].count) idx[a--] = 0;
        if (a < 0) return n;
    }
}

static void bench_key_text(const bench_sweep *sw, const bench_params *p, char *buf, size_t len) {
    const char *keys[4], *fields[4];
    char shown[64], json[96];
    buf[0] = '\0';
    int nk = bench_record_keys(sw, keys, fields);
    for (int k = 0; k < nk; k++) {
        bench_value(sw, keys[k], fields[k], p, shown, sizeof shown, json, sizeof json);
        strncat(buf, json, len - strlen(buf) - 1);
    }
}

static void bench_file_name(const bench_spec *spec, const bench_sweep *sw, char *buf, size_t len) {
    if (strcmp(sw->name, "base") == 0) snprintf(buf, len, "%s", spec->routine);
    else snprintf(buf, len, "%s.%s", sw->name, spec->routine);
}

static bool bench_selected(const char *only, const char *name) {
    if (!only) return true;
    size_t len = strlen(name);
    for (const char *s = only; *s;) {
        const char *end = strchr(s, ',');
        size_t n = end ? (size_t)(end - s) : strlen(s);
        if (n == len && strncmp(s, name, n) == 0) return true;
        if (!end) break;
        s = end + 1;
    }
    return false;
}

/* --check: every planned point's keys must appear in the committed JSON, and vice versa. */
static bool bench_check_sweep(const bench_spec *spec, const bench_sweep *sw, const char *gpu) {
    char file[128], path[512], line[512], text[256];
    bench_file_name(spec, sw, file, sizeof file);
    snprintf(path, sizeof path, "benchmarks/results/%s/cuda/%s/%s.json", gpu, spec->routine, file);
    FILE *fp = fopen(path, "r");
    if (!fp) { printf("MISSING  %s\n", path); return false; }

    int cap = 4096, n_committed = 0;
    char **committed = malloc(cap * sizeof(char *));
    while (fgets(line, sizeof line, fp)) {
        char *open = strstr(line, "{ "), *ms = strstr(line, "\"compute_ms\"");
        if (!open || !ms || n_committed == cap) continue;
        committed[n_committed++] = strndup(open + 2, (size_t)(ms - open - 2));
    }
    fclose(fp);

    int pcap = bench_point_cap(sw);
    bench_params *pts = malloc(pcap * sizeof(bench_params));
    int planned = bench_points(spec, sw, pts, pcap), only_plan = 0, only_committed = 0;
    bool *seen = calloc(n_committed ? n_committed : 1, sizeof(bool));
    for (int i = 0; i < planned; i++) {
        bench_key_text(sw, &pts[i], text, sizeof text);
        bool found = false;
        for (int j = 0; j < n_committed; j++)
            if (strcmp(committed[j], text) == 0) seen[j] = found = true;
        if (!found) {
            if (!only_plan++) printf("DIFFERS  %s\n", file);
            printf("           + planned only:   %s\n", text);
        }
    }
    for (int j = 0; j < n_committed; j++)
        if (!seen[j]) {
            if (!only_plan && !only_committed) printf("DIFFERS  %s\n", file);
            only_committed++;
            printf("           - committed only: %s\n", committed[j]);
        }
    bool ok = !only_plan && !only_committed;
    if (ok) printf("OK       %s (%d planned, %d committed)\n", file, planned, n_committed);
    for (int j = 0; j < n_committed; j++) free(committed[j]);
    free(committed);
    free(seen);
    free(pts);
    return ok;
}

/* Fills an operand's device buffer (allocating it if needed) with random
 * [-1, 1] data — plus the triangular diagonal for such matrices. Host copies
 * are freed before returning. */
static void bench_fill_operand(bench_operand *o) {
    size_t floats = o->dtype == DT_C32 ? 2 * o->length : o->length; /* cuComplex = 2 floats */
    float *h = random_float_array((int)floats, -1.0f, 1.0f);
    void *src = h;
    size_t bytes = floats * sizeof(float);
    if (o->dtype == DT_F64) {
        double *hd = malloc(o->length * sizeof(double));
        for (size_t i = 0; i < o->length; i++) hd[i] = (double)h[i];
        if (o->triangular) for (int i = 0; i < o->rows; i++) hd[(size_t)i * o->ld + i] = 8.0 + o->rows;
        src = hd;
        bytes = o->length * sizeof(double);
    } else if (o->triangular) {
        for (int i = 0; i < o->rows; i++) h[(size_t)i * o->ld + i] = 8.0f + o->rows;
    }
    if (!o->ptr) CUDA_CHECK(cudaMalloc(&o->ptr, bytes));
    CUDA_CHECK(cudaMemcpy(o->ptr, src, bytes, cudaMemcpyHostToDevice));
    if (src != h) free(src);
    free(h);
}

/** Refills an operand with fresh data — for `before_each` in in-place routines. */
static void bench_refresh(bench_operand *o) { bench_fill_operand(o); }

static void bench_run_sweep(cublasHandle_t device, const char *gpu_model,
                            const bench_spec *spec, const bench_sweep *sw) {
    const char *keys[4], *fields[4];
    int nk = bench_record_keys(sw, keys, fields);
    int warmup = sw->warmup ? sw->warmup : spec->warmup;
    int iters = sw->iters ? sw->iters : spec->iters;
    int cap = bench_point_cap(sw), nrec = 0;
    bench_params *pts = malloc(cap * sizeof(bench_params));
    int npts = bench_points(spec, sw, pts, cap);

    /* Per-key record columns: ints, floats or strings, by the key's kind. */
    int *col_int[4];
    float *col_real[4];
    char **col_str[4];
    for (int k = 0; k < nk; k++) {
        col_int[k] = malloc(cap * sizeof(int));
        col_real[k] = malloc(cap * sizeof(float));
        col_str[k] = calloc(cap, sizeof(char *));
    }
    float *med_times = malloc(cap * sizeof(float)), *gbs_vals = malloc(cap * sizeof(float));
    double (*bytes_fn)(const bench_params *) = sw->bytes ? sw->bytes : spec->bytes;
    double (*flops_fn)(const bench_params *) = sw->flops ? sw->flops : spec->flops;
    float *gflops_vals = flops_fn ? malloc(cap * sizeof(float)) : NULL;
    float *times = malloc(iters * sizeof(float));
    char file[128], text[256], shown[64], json[96];
    bench_file_name(spec, sw, file, sizeof file);

    printf("\n=== %s ===\n", file);
    for (int k = 0; k < nk; k++) printf("%-16s  ", keys[k]);
    printf("%-12s  %s%-12s\n", "compute_ms", flops_fn ? "compute_GFLOPs  " : "", "compute_GBs");

    for (int i = 0; i < npts; i++) {
        bench_params *p = &pts[i];
        bench_operand o[BENCH_MAX_OPERANDS];
        int no = spec->operands(p, o);
        bench_key_text(sw, p, text, sizeof text);
        text[strlen(text) - 2] = '\0'; /* drop the trailing ", " for messages */

        /* Device memory for every operand; host RAM for staging one vector at
         * a time: its f32 data, plus the f64 copy for double precision. */
        size_t dev_bytes = 0, host_peak = 0;
        for (int j = 0; j < no; j++) {
            if (o[j].is_result) { dev_bytes += o[j].length; continue; }
            dev_bytes += o[j].length * bench_elem_size(o[j].dtype);
            size_t staging = o[j].length * (o[j].dtype == DT_F64 ? 12 : o[j].dtype == DT_C32 ? 8 : 4);
            if (staging > host_peak) host_peak = staging;
        }
        size_t free_mem, total_mem, host_avail = host_bytes_available();
        CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
        if (host_avail && host_peak > host_avail * 8 / 10) {
            printf("  (skipped %s: needs %.1f GB host RAM)\n", text, host_peak / 1e9);
            continue;
        }
        if (dev_bytes > free_mem * 9 / 10) {
            printf("  (skipped %s: would exceed free device memory)\n", text);
            continue;
        }

        bool device_mode = false;
        for (int j = 0; j < no; j++) {
            if (o[j].is_result) { CUDA_CHECK(cudaMalloc(&o[j].ptr, o[j].length)); device_mode = true; }
            else { o[j].ptr = NULL; bench_fill_operand(&o[j]); }
        }
        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        warm_clocks(device); /* passes a host scalar — before any pointer-mode switch */
        if (device_mode) CUBLAS_CHECK(cublasSetPointerMode(device, CUBLAS_POINTER_MODE_DEVICE));
        for (int it = 0; it < warmup; it++) {
            if (sw->before_each) sw->before_each(p, o);
            spec->call(device, p, o);
        }
        CUDA_CHECK(cudaDeviceSynchronize());
        for (int it = 0; it < iters; it++) {
            if (sw->before_each) sw->before_each(p, o);
            CUDA_CHECK(cudaEventRecord(start, 0));
            spec->call(device, p, o);
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&times[it], start, stop));
        }
        if (device_mode) CUBLAS_CHECK(cublasSetPointerMode(device, CUBLAS_POINTER_MODE_HOST));

        float med = median(times, iters);
        float gbs = ((float)bytes_fn(p) / 1e9f) / (med / 1e3f);
        for (int k = 0; k < nk; k++) {
            bench_value(sw, keys[k], fields[k], p, shown, sizeof shown, json, sizeof json);
            printf("%-16s  ", shown);
            int f = bench_field(fields[k]);
            const char *base = (const char *)p + BENCH_FIELDS[f].off;
            if (bench_is_string(sw, keys[k], f)) col_str[k][nrec] = strdup(shown);
            else if (BENCH_FIELDS[f].kind == K_INT) col_int[k][nrec] = *(const int *)base;
            else col_real[k][nrec] = (float)*(const double *)base;
        }
        med_times[nrec] = med;
        gbs_vals[nrec] = gbs;
        if (gflops_vals) {
            gflops_vals[nrec] = ((float)flops_fn(p) / 1e9f) / (med / 1e3f);
            printf("%-12.4f  %-14.4f  %-12.4f\n", med, gflops_vals[nrec], gbs);
        } else {
            printf("%-12.4f  %-12.4f\n", med, gbs);
        }
        nrec++;

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        for (int j = 0; j < no; j++) cudaFree(o[j].ptr);
    }

    record_field rec[4];
    for (int k = 0; k < nk; k++) {
        int f = bench_field(fields[k]);
        if (bench_is_string(sw, keys[k], f)) rec[k] = (record_field){ keys[k], FIELD_STRING, col_str[k] };
        else if (BENCH_FIELDS[f].kind == K_INT) rec[k] = (record_field){ keys[k], FIELD_INT, col_int[k] };
        else rec[k] = (record_field){ keys[k], FIELD_FLOAT, col_real[k] };
    }
    save_results(gpu_model, spec->routine, file, rec, nk, med_times, gbs_vals, gflops_vals, nrec);

    for (int k = 0; k < nk; k++) {
        for (int i = 0; i < nrec; i++) free(col_str[k][i]);
        free(col_int[k]); free(col_real[k]); free(col_str[k]);
    }
    free(pts); free(med_times); free(gbs_vals); free(gflops_vals); free(times);
}

/** Entry point of a benchmark file: runs (or plans / checks) every selected sweep. */
static int run_benchmark(int argc, char **argv, const bench_spec *spec) {
    const char *only = NULL, *check = NULL;
    bool plan = false;
    for (int i = 1; i < argc; i++) {
        if (strncmp(argv[i], "--sweeps=", 9) == 0) only = argv[i] + 9;
        else if (strcmp(argv[i], "--plan") == 0) plan = true;
        else if (strcmp(argv[i], "--check") == 0) check = "nvidia-geforce-gtx-1650";
        else if (strncmp(argv[i], "--check=", 8) == 0) check = argv[i] + 8;
        else if (strncmp(argv[i], "--out=", 6) == 0) bench_results_root = argv[i] + 6;
    }

    int matched = 0;
    for (const bench_sweep *sw = spec->sweeps; sw->name; sw++) matched += bench_selected(only, sw->name);
    if (!matched) { fprintf(stderr, "%s: no sweep matches --sweeps=%s\n", spec->routine, only); return 2; }

    if (plan || check) {
        bool ok = true;
        char file[128], text[256];
        for (const bench_sweep *sw = spec->sweeps; sw->name; sw++) {
            if (!bench_selected(only, sw->name)) continue;
            if (check) { ok &= bench_check_sweep(spec, sw, check); continue; }
            int cap = bench_point_cap(sw);
            bench_params *pts = malloc(cap * sizeof(bench_params));
            int n = bench_points(spec, sw, pts, cap);
            bench_file_name(spec, sw, file, sizeof file);
            printf("%s — %d points\n", file, n);
            for (int i = 0; i < n; i++) {
                bench_key_text(sw, &pts[i], text, sizeof text);
                printf("  %s\n", text);
            }
            free(pts);
        }
        return ok ? 0 : 1;
    }

    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));
    cublasHandle_t device;
    CUBLAS_CHECK(cublasCreate(&device));
    for (const bench_sweep *sw = spec->sweeps; sw->name; sw++)
        if (bench_selected(only, sw->name)) bench_run_sweep(device, gpu_model, spec, sw);
    cublasDestroy(device);
    return 0;
}
