// beta sweep — ssyrk.c pins beta to its baseline.
//
// beta=0 lets an implementation skip reading C entirely. This shows whether cuBLAS takes
// that shortcut and what it is worth.

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
    float betas[] = { 0.0f, 1.0f, 2.5f, -3.75f };
    int num_v = (int)(sizeof(betas) / sizeof(betas[0]));

    int num_recs = num_sizes * num_v;
    float *rec_key = (float *)malloc(num_recs * sizeof(float));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gflops_vals = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "beta", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-16s  %-12s\n", "--------------", "----------", "------------", "----------------", "------------");

    for (int vi = 0; vi < num_v; vi++) {
        float beta_v = betas[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;
            int ldc = n;

            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = ((size_t)n * lda + (size_t)n * ldc) * sizeof(float);
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped n=%d: matrices would exceed available device memory)\n", n);
                continue;
            }

            float *h_A = random_float_array(n * lda, -1.0f, 1.0f);
            float *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(float), cudaMemcpyHostToDevice));
            float *h_C = random_float_array(n * ldc, -1.0f, 1.0f);
            float *d_C;
            CUDA_CHECK(cudaMalloc((void **)&d_C, (size_t)n * ldc * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_C, h_C, (size_t)n * ldc * sizeof(float), cudaMemcpyHostToDevice));

    float alpha = 1.0f;
    float beta = beta_v;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasSsyrk(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, n, &alpha, d_A, lda, &beta, d_C, ldc));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasSsyrk(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, n, n, &alpha, d_A, lda, &beta, d_C, ldc));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            float compute_gflops = (((float)n * n * n) / 1e9f) / (med_compute / 1e3f);
            // Both metrics — see the .js counterpart.
            float bytes = ((float)n * n + 2.0f * n * n) * sizeof(float);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-14g  %-10d  %-12.4f  %-16.4f  %-12.4f\n", beta_v, n, med_compute, compute_gflops, compute_gbs);
            rec_key[ri] = beta_v;
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gflops_vals[ri] = compute_gflops;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            free(h_A);
            cudaFree(d_C);
            free(h_C);
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "ssyrk", "beta.ssyrk", "beta",
                        rec_key, rec_n, med_times, gbs_vals, gflops_vals, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gflops_vals);
    free(gbs_vals);
    return 0;
}
