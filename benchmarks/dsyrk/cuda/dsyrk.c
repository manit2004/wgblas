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

    // Matches dsyrk.js: uplo=lower, trans=no-transpose, tight lda/ldc.
    int sizes[] = { 32, 64, 128, 256, 512, 1024 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gflops_vals[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "n", "k", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "----------", "----------", "------------", "--------------", "------------");

    const double alpha = 1.0;
    const double beta  = 0.0;

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];
        int k = sizes[si];
        // column-major, dense — cuBLAS's native layout
        int lda = n, ldc = n;

        float *h_A_f32 = random_float_array((size_t)n * k, -1.0f, 1.0f);
        double *h_A = malloc((size_t)n * k * sizeof(double));
        for (size_t i = 0; i < (size_t)n * k; i++) h_A[i] = (double)h_A_f32[i];
        float *h_C_f32 = random_float_array((size_t)n * n, -1.0f, 1.0f);
        double *h_C = malloc((size_t)n * n * sizeof(double));
        for (size_t i = 0; i < (size_t)n * n; i++) h_C[i] = (double)h_C_f32[i];

        double *d_A, *d_C;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * k * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void **)&d_C, (size_t)n * n * sizeof(double)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * k * sizeof(double), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_C, h_C, (size_t)n * n * sizeof(double), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        warm_clocks(handle); /* full clocks first — see helpers.h */

        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasDsyrk(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, k, &alpha, d_A, lda, &beta, d_C, ldc));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasDsyrk(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, k, &alpha, d_A, lda, &beta, d_C, ldc));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // Useful work, the BLAS/LAPACK convention: k multiply-adds for each
        // of the n(n+1)/2 elements of the triangle written — a rank-k update
        // computes only that triangle. Same count as the .js counterpart.
        float flops = (float)n * (n + 1) * k;
        // A read (full n*k) + touched-half-of-C read + touched-half-of-C write
        float bytes = (float)((size_t)(n * k + n * n)) * (float)sizeof(double);
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
        cudaFree(d_C);
        free(h_A);
        free(h_A_f32);
        free(h_C);
        free(h_C_f32);
    }

    // write JSON results — n and k sweep together with `sizes`.
    record_field fields[] = {
        { "n", FIELD_INT, sizes },
        { "k", FIELD_INT, sizes },
    };
    save_results(gpu_model, "dsyrk", "dsyrk", fields, 2, med_times, gbs_vals, gflops_vals, num_sizes);

    cublasDestroy(handle);
    return 0;
}
