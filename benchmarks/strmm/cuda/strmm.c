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

    // Matches benchmark strmm.js: side=left, uplo=lower, trans=no-transpose,
    // diag=non-unit, tight lda/ldb, square m=n (so A's order equals m).
    // cuBLAS's strmm takes a separate C — pass d_C = d_B for the same
    // in-place semantics wgblas's strmm has (B overwritten).
    int sizes[] = { 32, 64, 128, 256, 512, 1024 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gflops_vals[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "m", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "----------", "----------", "------------", "--------------", "------------");

    const float alpha = 1.0f;

    for (int si = 0; si < num_sizes; si++) {
        int m = sizes[si];
        int n = sizes[si];
        int lda = m, ldb = m;

        float *h_A = random_float_array((size_t)m * lda, -1.0f, 1.0f);
        float *h_B = random_float_array((size_t)m * n, -1.0f, 1.0f);

        float *d_A, *d_B;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)m * lda * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_B, (size_t)m * n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)m * lda * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)m * n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasStrmm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT,
                                      m, n, &alpha, d_A, lda, d_B, ldb, d_B, ldb));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasStrmm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT,
                                      m, n, &alpha, d_A, lda, d_B, ldb, d_B, ldb));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        int a_order = m; // side=left
        float flops = 2.0f * m * n * a_order + (float)m * n;
        float bytes = (float)((size_t)(3 * a_order * a_order + 5 * m * n)) * 4.0f;
        float gflops = (flops / 1e9f) / (med / 1e3f);
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si]   = med;
        gflops_vals[si] = gflops;
        gbs_vals[si]    = gbs;

        printf("%-10d  %-10d  %-12.4f  %-14.4f  %-12.4f\n",
               m, n, med, gflops, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        cudaFree(d_A);
        cudaFree(d_B);
        free(h_A);
        free(h_B);
    }

    // write JSON results
    record_field fields[] = {
        { "m", FIELD_INT, sizes },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, "strmm", "strmm", fields, 2, med_times, gbs_vals, gflops_vals, num_sizes);

    cublasDestroy(handle);
    return 0;
}
