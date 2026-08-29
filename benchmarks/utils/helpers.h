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

/**
 * Writes benchmark results to
 * `benchmarks/results/<gpu_model>/cuda/<routine>.json`, creating directories
 * as needed. Output format matches the wgblas JSON schema so that
 * `gen-bench-tables.py` can consume both backends uniformly.
 *
 * @param routine   routine name, e.g. `"saxpy"`
 * @param gpu_model slug from `get_gpu_model()`
 * @param sizes     array of `n` values used in the benchmark
 * @param med_times median compute times in milliseconds, one per size
 * @param gbs_vals  throughput in GB/s, one per size
 * @param n         number of entries in `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results(const char *routine, const char *gpu_model,
                         int *sizes, float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,  "benchmarks/results/%s", gpu_model);
    asprintf(&out_dir,  "%s/cuda", gpu_dir);
    asprintf(&file_path, "benchmarks/results/%s/cuda/%s.json", gpu_model, routine);
    mkdir("benchmarks/results", 0755); // 0755: owner rwx
    mkdir(gpu_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results`, but writes to `benchmarks/results/<gpu_model>/cuda/<folder>/<file_name>.json`
 * instead of the flat `cuda/<routine>.json` layout — for routines with more
 * than one benchmark variant (e.g. a stride sweep alongside the main
 * unit-stride one), mirroring `saveResults`'s `{ folder, fileName }` option
 * in `helpers.mjs`.
 *
 * @param routine   routine name, e.g. `"saxpy"` (unused in the output path here, kept for signature symmetry with `save_results`)
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/` to nest the file in, e.g. `"saxpy"`
 * @param file_name file name without `.json`, e.g. `"saxpy"`
 * @param sizes     array of `n` values used in the benchmark
 * @param med_times median compute times in milliseconds, one per size
 * @param gbs_vals  throughput in GB/s, one per size
 * @param n         number of entries in `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results_ex(const char *routine, const char *gpu_model,
                             const char *folder, const char *file_name,
                             int *sizes, float *med_times, float *gbs_vals, int n) {
    (void)routine; // kept for signature symmetry with save_results, unused here
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
        fprintf(fp, "  { \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results_ex`, but each record also carries a `stride` field —
 * for stride-sweep benchmarks (e.g. `stride.saxpy.c`), matching the record
 * shape `saveResults` writes for `stride.saxpy.js` in `helpers.mjs`.
 *
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/` to nest the file in, e.g. `"saxpy"`
 * @param file_name file name without `.json`, e.g. `"stride.saxpy"`
 * @param strides   array of `incx`/`incy` values used, one per record
 * @param sizes     array of `n` values used, one per record
 * @param med_times median compute times in milliseconds, one per record
 * @param gbs_vals  throughput in GB/s, one per record
 * @param n         number of entries in `strides`, `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results_stride(const char *gpu_model, const char *folder, const char *file_name,
                                 int *strides, int *sizes, float *med_times, float *gbs_vals, int n) {
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
        fprintf(fp, "  { \"stride\": %d, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            strides[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results_stride`, but for an `lda`-padding sweep — each record
 * carries `pad` (the number of elements added to a tight `lda`) instead of
 * `stride`. Used by `lda.<routine>.c` benchmarks (e.g. ssymv, ssyr, ssyr2,
 * sger), whose lda-sensitivity mechanisms were confirmed empirically to
 * differ per routine — see .md.
 *
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/` to nest the file in, e.g. `"ssymv"`
 * @param file_name file name without `.json`, e.g. `"lda.ssymv"`
 * @param pads      array of lda-padding amounts (elements) used, one per record
 * @param sizes     array of `n` values used, one per record
 * @param med_times median compute times in milliseconds, one per record
 * @param gbs_vals  throughput in GB/s, one per record
 * @param n         number of entries in `pads`, `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results_pad(const char *gpu_model, const char *folder, const char *file_name,
                              int *pads, int *sizes, float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"pad\": %d, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            pads[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results_stride`, but for a `uplo` sweep — each record carries
 * `uplo` (`"lower"` or `"upper"`) instead of `stride`. Used by
 * `uplo.<routine>.c` benchmarks (e.g. ssyr, ssyr2), whose uplo-sensitivity
 * was confirmed empirically to be real (~1.7-1.8x, dispatch-order workload
 * imbalance) — see .md.
 *
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/` to nest the file in, e.g. `"ssyr"`
 * @param file_name file name without `.json`, e.g. `"uplo.ssyr"`
 * @param uplos     array of `"lower"`/`"upper"` strings, one per record
 * @param sizes     array of `n` values used, one per record
 * @param med_times median compute times in milliseconds, one per record
 * @param gbs_vals  throughput in GB/s, one per record
 * @param n         number of entries in `uplos`, `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results_uplo(const char *gpu_model, const char *folder, const char *file_name,
                               const char **uplos, int *sizes, float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"uplo\": \"%s\", \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            uplos[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results_uplo`, but for a `trans` sweep — each record carries
 * `trans` (`"no-transpose"` or `"transpose"`) instead of `uplo`. Used by
 * `trans.<routine>.c` single-axis trans benchmarks (e.g. strmv, ssyrk).
 *
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/` to nest the file in, e.g. `"ssyrk"`
 * @param file_name file name without `.json`, e.g. `"trans.ssyrk"`
 * @param transes   array of `"no-transpose"`/`"transpose"` strings, one per record
 * @param sizes     array of `n` values used, one per record
 * @param med_times median compute times in milliseconds, one per record
 * @param gbs_vals  throughput in GB/s, one per record
 * @param n         number of entries in `transes`, `sizes`, `med_times`, and `gbs_vals`
 */
static void save_results_trans(const char *gpu_model, const char *folder, const char *file_name,
                                const char **transes, int *sizes, float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"trans\": \"%s\", \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            transes[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Returns the median of `arr[0..n-1]`. Copies the array before sorting so
 * the original is not mutated.
 *
 * @param arr array of floats
 * @param n   array length
 * @returns median value
 */
/**
 * Like `save_results_uplo`, but the record's key name is a parameter rather
 * than baked in. Added so a flag sweep over a *new* parameter (`diag`, and
 * whatever comes next) needs no further copy of this function — the earlier
 * `save_results_uplo`/`save_results_trans` are left as they are so existing
 * benchmarks keep compiling unchanged.
 *
 * @param gpu_model slug from `get_gpu_model()`
 * @param folder    subfolder under `cuda/`, e.g. `"strsv"`
 * @param file_name file name without `.json`, e.g. `"diag.strsv"`
 * @param key_name  JSON field name for the swept value, e.g. `"diag"`
 * @param values    swept value per record, e.g. `"unit"`/`"non-unit"`
 * @param sizes     `n` per record
 * @param med_times median compute time in ms per record
 * @param gbs_vals  throughput in GB/s per record
 * @param n         number of records
 */
static void save_results_flag(const char *gpu_model, const char *folder, const char *file_name,
                              const char *key_name, const char **values, int *sizes,
                              float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"%s\": \"%s\", \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            key_name, values[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

/**
 * Like `save_results_flag`, but the swept value is a float — for scalar sweeps
 * (`alpha`, `beta`, and srot's `c`/`s`). Written with `%g` so 0, 1 and 1e-38
 * all round-trip as valid JSON numbers rather than as `0.0000`, which would
 * collapse a denormal level onto zero.
 */
static void save_results_scalar(const char *gpu_model, const char *folder, const char *file_name,
                                const char *key_name, float *values, int *sizes,
                                float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda", gpu_dir);
    asprintf(&out_dir,   "%s/%s", base_dir, folder);
    asprintf(&file_path, "%s/%s.json", out_dir, file_name);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"%s\": %g, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            key_name, values[i], sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
}

static float median(float *arr, int n) {
    float *tmp = malloc(n * sizeof(float));
    memcpy(tmp, arr, n * sizeof(float));
    qsort(tmp, n, sizeof(float), cmp_float);
    float m = (n % 2 == 0) ? (tmp[n / 2 - 1] + tmp[n / 2]) / 2.0f : tmp[n / 2];
    free(tmp);
    return m;
}
