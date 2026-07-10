#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/stat.h>
#include <cuda_runtime.h>

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
