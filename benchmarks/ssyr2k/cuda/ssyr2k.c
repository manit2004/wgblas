#include <stdio.h>
#include <stdlib.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 3
#define BENCH_ITERS  20

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    // Matches benchmark.ssyr2k.js: uplo=lower, trans=no-transpose, tight lda/ldb/ldc.
    int sizes[] = { 32, 64, 128, 256, 512, 1024 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gflops_vals[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "n", "k", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "----------", "----------", "------------", "--------------", "------------");

    const float alpha = 1.0f;
    const float beta  = 0.0f;

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];
        int k = sizes[si];
        // column-major, dense — cuBLAS's native layout
        int lda = n, ldb = n, ldc = n;

        float *h_A = random_float_array((size_t)n * k, -1.0f, 1.0f);
        float *h_B = random_float_array((size_t)n * k, -1.0f, 1.0f);
        float *h_C = random_float_array((size_t)n * n, -1.0f, 1.0f);

        float *d_A, *d_B, *d_C;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * k * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_B, (size_t)n * k * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_C, (size_t)n * n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * k * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)n * k * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_C, h_C, (size_t)n * n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasSsyr2k(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasSsyr2k(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // cuBLAS's own internal accounting: 2x full n*n*k FMA cost (two rank-k
        // terms) + n*n/2 for the alpha/beta step.
        float flops = 2.0f * (2.0f * n * n * k) + (float)n * n;
        // A read + B read (both full) + touched-half-of-C read + write
        float bytes = (float)((size_t)(n * k + n * k + n * n)) * 4.0f;
        float gflops = (flops / 1e9f) / (med / 1e3f);
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si]   = med;
        gflops_vals[si] = gflops;
        gbs_vals[si]    = gbs;

        printf("%-10d  %-10d  %-12.4f  %-14.4f  %-12.4f\n",
               n, k, med, gflops, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        cudaFree(d_A);
        cudaFree(d_B);
        cudaFree(d_C);
        free(h_A);
        free(h_B);
        free(h_C);
    }

    // write JSON results
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda",                gpu_dir);
    asprintf(&out_dir,   "%s/ssyr2k",              base_dir);
    asprintf(&file_path, "%s/ssyr2k.json",         out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < num_sizes; i++) {
        fprintf(fp,
            "  { \"n\": %d, \"k\": %d, \"compute_ms\": %.4f, "
            "\"compute_GFLOPs\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], sizes[i], med_times[i], gflops_vals[i], gbs_vals[i],
            i < num_sizes - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);

    cublasDestroy(handle);
    return 0;
}
