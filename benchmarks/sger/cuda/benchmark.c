#include <stdio.h>
#include <stdlib.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 32, 64, 128, 256, 512, 1024, 1280, 2048, 4096 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-12s\n", "m", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    const float alpha = 1.0f;

    for (int si = 0; si < num_sizes; si++) {
        int m = sizes[si];
        int n = sizes[si];
        int lda = n; // row-major, dense

        float *h_x = random_float_array(m, -1.0f, 1.0f);
        float *h_y = random_float_array(n, -1.0f, 1.0f);
        float *h_A = random_float_array(m * n, -1.0f, 1.0f);

        float *d_x, *d_y, *d_A;
        CUDA_CHECK(cudaMalloc((void **)&d_x, m * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_y, n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)m * n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, m * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)m * n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // h_A is row-major m×n; cuBLAS is column-major, so the same buffer (ld=lda)
        // reinterpreted column-major is A^T (n×m). Since (A += alpha*x*y^T)^T is
        // (A^T += alpha*y*x^T), swapping x/y and m/n reproduces the row-major
        // update directly — sger has no transpose flag to juggle, unlike
        // strmv/ssymv/sgemv.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasSger(handle, n, m, &alpha, d_y, 1, d_x, 1, d_A, lda));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasSger(handle, n, m, &alpha, d_y, 1, d_x, 1, d_A, lda));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // A read + A write + x read + y read
        float bytes = (float)((size_t)(2 * m * n + m + n)) * 4.0f;
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-10d  %-12.4f  %-12.4f\n", m, n, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        CUDA_CHECK(cudaFree(d_x));
        CUDA_CHECK(cudaFree(d_y));
        CUDA_CHECK(cudaFree(d_A));
        free(h_x);
        free(h_y);
        free(h_A);
    }

    // write JSON results — m and n are both recorded (unlike ssymv/strmv's
    // square-only "n") since sger's shape genuinely has independent
    // dimensions, matching the JS benchmark's schema.
    char *gpu_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&out_dir,   "%s/cuda",               gpu_dir);
    asprintf(&file_path, "%s/sger.json",          out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < num_sizes; i++) {
        fprintf(fp,
            "  { \"m\": %d, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], sizes[i], med_times[i], gbs_vals[i],
            i < num_sizes - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(out_dir);
    free(file_path);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
