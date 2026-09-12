#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/stat.h>
#include <cuda_runtime.h>
#include <cublas_v2.h>

#define CUDA_CHECK(call) do { \
    cudaError_t _e = (call); \
    if (_e != cudaSuccess) { \
        fprintf(stderr, "CUDA error at %s:%d — %s\n", \
                __FILE__, __LINE__, cudaGetErrorString(_e)); \
        exit(1); \
    } \
} while (0)

#define CUBLAS_CHECK(call) do { \
    cublasStatus_t _s = (call); \
    if (_s != CUBLAS_STATUS_SUCCESS) { \
        fprintf(stderr, "cuBLAS error at %s:%d — status %d\n", \
                __FILE__, __LINE__, (int)_s); \
        exit(1); \
    } \
} while (0)

/**
 * Fills `dst` with the current device's name normalised to a filesystem-safe
 * slug: lowercase, non-alphanumeric characters replaced with '-'.
 * Matches the slug format produced by `getGpuModel()` in helpers.mjs so that
 * wgblas and CUDA results land in the same `benchmarks/results/<gpu>/` folder.
 *
 * @param dst    output buffer to receive the slug
 * @param maxlen size of `dst` in bytes (cudaDeviceProp.name is char[256])
 */
static void get_gpu_model(char *dst, int maxlen) {
    struct cudaDeviceProp prop;
    cudaGetDeviceProperties(&prop, 0);
    int j = 0;
    for (int i = 0; prop.name[i] && j < maxlen - 1; i++) {
        char c = prop.name[i];
        if (c >= 'A' && c <= 'Z') c += 32;
        dst[j++] = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ? c : '-';
    }
    dst[j] = '\0';
}

/**
 * Allocates and returns a float array of length `n` filled with uniform
 * random values in `[low, high]`. Seeds `srand` once on first call.
 * Caller is responsible for `free()`-ing the returned pointer.
 *
 * @param n    number of elements
 * @param low  lower bound (inclusive)
 * @param high upper bound (inclusive)
 * @returns heap-allocated float array of length `n`
 */
static float *random_float_array(int n, float low, float high) {
    static int seeded = 0;
    if (!seeded) { srand((unsigned)time(NULL)); seeded = 1; }
    float *arr = malloc(n * sizeof(float));
    for (int i = 0; i < n; i++)
        arr[i] = low + (high - low) * ((float)rand() / RAND_MAX);
    return arr;
}

/** Comparator for qsort over float arrays. */
static int cmp_float(const void *a, const void *b) {
    float fa = *(const float *)a;
    float fb = *(const float *)b;
    return (fa > fb) - (fa < fb);
}

/** Tag for one JSON record field's value type in `record_field`. */
typedef enum { FIELD_INT, FIELD_FLOAT, FIELD_STRING } field_type;

/**
 * One JSON key written by `save_results`: `name` is the literal JSON key,
 * `type` says how to read `values`, and `values` points to an array with one
 * entry per record — `int*`, `float*`, or `const char**` matching `type`.
 * A float field is written with `%g` (not `%.4f`) so 0, 1, and denormals
 * like `1e-38` all round-trip as valid JSON numbers instead of collapsing to
 * `"0.0000"`.
 */
typedef struct {
    const char *name;
    field_type type;
    const void *values;
} record_field;

/**
 * Writes one JSON record per index in `[0, n)` to
 * `benchmarks/results/<gpu_model>/cuda/<folder>/<file_name>.json`, creating
 * directories as needed:
 * `{ <fields[0].name>: ..., ..., "compute_ms": ..., ["compute_GFLOPs": ...,] "compute_GBs": ... }`
 *
 * This is the one writer behind every benchmark's results file. Previously
 * each swept-parameter shape (a stride sweep, an lda-padding sweep, a uplo
 * sweep, two or three keys swept at once, ...) had its own hand-copied
 * path-construction-plus-printf-loop — nine near-identical `save_results_*`
 * variants in this header, plus several routines' own `.c` files hand-rolling
 * a tenth copy because none of the nine supported more than one swept key.
 * A record shape is now just an array of `record_field`s (empty for a plain
 * `{n, compute_ms, compute_GBs}` shape), so a new sweep — single-key,
 * multi-key, or a mix of int/float/string keys — needs no new function.
 *
 * @param gpu_model   slug from `get_gpu_model()`
 * @param folder      subfolder under `cuda/` to nest the file in, e.g. `"saxpy"`
 * @param file_name   file name without `.json`, e.g. `"stride.saxpy"`
 * @param fields      swept key(s), in the order they should appear before
 *                    the fixed trailing fields; NULL/0 for none
 * @param n_fields    number of entries in `fields`
 * @param med_times   median compute time in ms, one per record
 * @param gbs_vals    throughput in GB/s, one per record
 * @param gflops_vals throughput in GFLOP/s, one per record, or NULL to omit
 *                    the `compute_GFLOPs` key entirely
 * @param n           number of records (length of every per-record array above)
 */
static void save_results(const char *gpu_model, const char *folder, const char *file_name,
                          const record_field *fields, int n_fields,
                          float *med_times, float *gbs_vals, float *gflops_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755); // 0755: owner rwx
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { ");
        for (int j = 0; j < n_fields; j++) {
            switch (fields[j].type) {
                case FIELD_INT:
                    fprintf(fp, "\"%s\": %d, ", fields[j].name, ((const int *)fields[j].values)[i]);
                    break;
                case FIELD_FLOAT:
                    fprintf(fp, "\"%s\": %g, ", fields[j].name, ((const float *)fields[j].values)[i]);
                    break;
                case FIELD_STRING:
                    fprintf(fp, "\"%s\": \"%s\", ", fields[j].name, ((const char **)fields[j].values)[i]);
                    break;
            }
        }
        fprintf(fp, "\"compute_ms\": %.4f, ", med_times[i]);
        if (gflops_vals) fprintf(fp, "\"compute_GFLOPs\": %.4f, ", gflops_vals[i]);
        fprintf(fp, "\"compute_GBs\": %.4f }%s\n", gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

// The eight functions below are back-compat shims over `save_results` above,
// kept so the ~100 existing call sites across the individual routine
// benchmarks (`save_results_ex`/`_stride`/`_pad`/`_uplo`/`_trans`/`_flag`/
// `_scalar`/`_pad_ex`) need no changes — each just builds the `record_field`
// array its own record shape needs and delegates. `routine` in
// `save_results_ex` is unused, kept only for call-site compatibility.

static void save_results_ex(const char *routine, const char *gpu_model,
                             const char *folder, const char *file_name,
                             int *sizes, float *med_times, float *gbs_vals, int n) {
    (void)routine;
    record_field fields[] = { { "n", FIELD_INT, sizes } };
    save_results(gpu_model, folder, file_name, fields, 1, med_times, gbs_vals, NULL, n);
}

static void save_results_stride(const char *gpu_model, const char *folder, const char *file_name,
                                 int *strides, int *sizes, float *med_times, float *gbs_vals, int n) {
    record_field fields[] = {
        { "stride", FIELD_INT, strides },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, NULL, n);
}

static void save_results_pad(const char *gpu_model, const char *folder, const char *file_name,
                              int *pads, int *sizes, float *med_times, float *gbs_vals, int n) {
    record_field fields[] = {
        { "pad", FIELD_INT, pads },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, NULL, n);
}

static void save_results_uplo(const char *gpu_model, const char *folder, const char *file_name,
                               const char **uplos, int *sizes, float *med_times, float *gbs_vals, int n) {
    record_field fields[] = {
        { "uplo", FIELD_STRING, uplos },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, NULL, n);
}

static void save_results_trans(const char *gpu_model, const char *folder, const char *file_name,
                                const char **transes, int *sizes, float *med_times, float *gbs_vals, int n) {
    record_field fields[] = {
        { "trans", FIELD_STRING, transes },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, NULL, n);
}

static void save_results_flag(const char *gpu_model, const char *folder, const char *file_name,
                              const char *key_name, const char **values, int *sizes,
                              float *med_times, float *gbs_vals, float *gflops_vals, int n) {
    record_field fields[] = {
        { key_name, FIELD_STRING, values },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, gflops_vals, n);
}

static void save_results_scalar(const char *gpu_model, const char *folder, const char *file_name,
                                const char *key_name, float *values, int *sizes,
                                float *med_times, float *gbs_vals, float *gflops_vals, int n) {
    record_field fields[] = {
        { key_name, FIELD_FLOAT, values },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, gflops_vals, n);
}

static void save_results_pad_ex(const char *gpu_model, const char *folder, const char *file_name,
                                int *pads, int *sizes, float *med_times, float *gbs_vals,
                                float *gflops_vals, int n) {
    record_field fields[] = {
        { "pad", FIELD_INT, pads },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, folder, file_name, fields, 2, med_times, gbs_vals, gflops_vals, n);
}

/**
 * Bytes of host RAM currently available, from /proc/meminfo's MemAvailable.
 *
 * The device-memory guards in these benchmarks check `cudaMemGetInfo` only,
 * which is not the binding constraint for the f64 routines: dasum and idamax
 * stage a float array *and* a double array on the host before uploading, so
 * they need roughly 1.5x the device figure in RAM. On a machine with a large
 * GPU and a busy host that passes the device check and then gets OOM-killed
 * mid-run, which looks like a hang rather than a skip.
 *
 * Returns 0 if MemAvailable cannot be read, which callers treat as "unknown,
 * do not block" so this can never wrongly skip a config it cannot measure.
 */
static size_t host_bytes_available(void) {
    FILE *fp = fopen("/proc/meminfo", "r");
    if (!fp) return 0;
    char key[64];
    unsigned long kb;
    size_t avail = 0;
    while (fscanf(fp, "%63s %lu kB\n", key, &kb) == 2) {
        if (strcmp(key, "MemAvailable:") == 0) { avail = (size_t)kb * 1024; break; }
    }
    fclose(fp);
    return avail;
}

/**
 * Returns the median of `arr[0..n-1]`. Copies the array before sorting so
 * the original is not mutated.
 *
 * @param arr array of floats
 * @param n   array length
 * @returns median value
 */
static float median(float *arr, int n) {
    float *tmp = malloc(n * sizeof(float));
    memcpy(tmp, arr, n * sizeof(float));
    qsort(tmp, n, sizeof(float), cmp_float);
    float m = (n % 2 == 0) ? (tmp[n / 2 - 1] + tmp[n / 2]) / 2.0f : tmp[n / 2];
    free(tmp);
    return m;
}
