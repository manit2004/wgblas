// alpha sweep — strsm.c pins alpha to its baseline.
//
// cuBLAS takes alpha by pointer and applies it unconditionally, so a flat sweep is the
// expected result — the reference point for the wgblas side, which is flat for the same
// reason everywhere except strsm.

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
    float alphas[] = { 0.0f, 1.0f, 2.5f, -3.75f, 1e-38f };
    int num_v = (int)(sizeof(alphas) / sizeof(alphas[0]));

    int num_recs = num_sizes * num_v;
    float *rec_key = (float *)malloc(num_recs * sizeof(float));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gflops_vals = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "alpha", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "--------------", "----------", "------------", "----------------", "------------");

    for (int vi = 0; vi < num_v; vi++) {
        float alpha_v = alphas[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;
            int ldb = n;

            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = ((size_t)n * lda + (size_t)n * ldb) * sizeof(float);
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

    float alpha = alpha_v;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasStrsm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, n, &alpha, d_A, lda, d_B, ldb));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                // cublasStrsm overwrites B with X — re-seed so every iteration is identical
                CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)n * ldb * sizeof(float), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasStrsm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, n, &alpha, d_A, lda, d_B, ldb));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            float compute_gflops = (((float)n * n * n) / 1e9f) / (med_compute / 1e3f);
            // Both metrics — see the .js counterpart.
            float bytes = (3.0f * n * n + 5.0f * n * n) * sizeof(float);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-14g  %-10d  %-12.4f  %-16.4f  %-12.4f\n", alpha_v, n, med_compute, compute_gflops, compute_gbs);
            rec_key[ri] = alpha_v;
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
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "strsm", "alpha.strsm", "alpha",
                        rec_key, rec_n, med_times, gbs_vals, gflops_vals, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gflops_vals);
    free(gbs_vals);
    return 0;
}
