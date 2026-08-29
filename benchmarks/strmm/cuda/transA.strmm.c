// transA sweep — strmm.c pins transA to its baseline.
//
// op(A) decides whether the kernel walks A down columns or across rows.

#include <stdio.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  50

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 64, 128, 256, 512, 1024, 2048 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    cublasOperation_t transAs[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    const char *transA_names[] = { "no-transpose", "transpose" };
    int num_v = (int)(sizeof(transAs) / sizeof(transAs[0]));

    int num_recs = num_sizes * num_v;
    const char **rec_key = (const char **)malloc(num_recs * sizeof(char *));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gflops_vals = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "transA", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "--------------", "----------", "------------", "----------------", "------------");

    for (int vi = 0; vi < num_v; vi++) {
        cublasOperation_t transA = transAs[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;
            int ldb = n;
            int ldc = n;

            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = ((size_t)n * lda + (size_t)n * ldb + (size_t)n * ldc) * sizeof(float);
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped n=%d: matrices would exceed available device memory)\n", n);
                continue;
            }

            float *h_A = random_float_array(n * lda, -1.0f, 1.0f);
            for (int i = 0; i < n; i++) h_A[i * lda + i] = 8.0f + n; // diagonally dominant
            float *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(float), cudaMemcpyHostToDevice));
            float *h_B = random_float_array(n * ldb, -1.0f, 1.0f);
            float *d_B;
            CUDA_CHECK(cudaMalloc((void **)&d_B, (size_t)n * ldb * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)n * ldb * sizeof(float), cudaMemcpyHostToDevice));
            float *h_C = random_float_array(n * ldc, -1.0f, 1.0f);
            float *d_C;
            CUDA_CHECK(cudaMalloc((void **)&d_C, (size_t)n * ldc * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_C, h_C, (size_t)n * ldc * sizeof(float), cudaMemcpyHostToDevice));

    float alpha = 1.0f;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasStrmm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, transA, CUBLAS_DIAG_NON_UNIT, n, n, &alpha, d_A, lda, d_B, ldb, d_C, ldc));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasStrmm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, transA, CUBLAS_DIAG_NON_UNIT, n, n, &alpha, d_A, lda, d_B, ldb, d_C, ldc));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            float compute_gflops = (((float)n * n * n) / 1e9f) / (med_compute / 1e3f);
            // Both metrics — see the .js counterpart.
            float bytes = (3.0f * n * n + 5.0f * n * n) * sizeof(float);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-14s  %-10d  %-12.4f  %-16.4f  %-12.4f\n", transA_names[vi], n, med_compute, compute_gflops, compute_gbs);
            rec_key[ri] = transA_names[vi];
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gflops_vals[ri] = compute_gflops;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            free(h_A);
            cudaFree(d_B);
            free(h_B);
            cudaFree(d_C);
            free(h_C);
        }
    }

    cublasDestroy(handle);

    save_results_flag(gpu_model, "strmm", "transA.strmm", "transA",
                      rec_key, rec_n, med_times, gbs_vals, gflops_vals, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gflops_vals);
    free(gbs_vals);
    return 0;
}
