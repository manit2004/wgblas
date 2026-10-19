// alpha sweep — dgemm.c pins alpha to its baseline.
//
// cuBLAS takes alpha by pointer and applies it unconditionally, so a flat sweep is the
// expected result — the reference point for the wgblas side.

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
    double alphas[] = { 0.0, 1.0, 2.5, -3.75, 1e-38 };
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
        double alpha = alphas[vi];
        double beta = 0.0;
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n, ldb = n, ldc = n;
            size_t len = (size_t)n * n;

            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = 3 * len * sizeof(double);
            // Host RAM, not device memory, is the tighter limit here: this configuration
            // stages 3 buffer(s) of comparable size in RAM before uploading. Passing the
            // device check and then being OOM-killed mid-run looks like a hang rather
            // than a skip, so check both.
            size_t host_needed = bytes_needed * 3;
            size_t host_avail = host_bytes_available();
            if (host_avail && host_needed > host_avail * 8 / 10) {
                printf("  (skipped n=%d: needs %.1f GB host RAM, %.1f GB available)\n",
                       n, host_needed / 1e9, host_avail / 1e9);
                continue;
            }
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped n=%d: matrices would exceed available device memory)\n", n);
                continue;
            }

            float *h_f32 = random_float_array(3 * len, -1.0f, 1.0f);
            double *h = malloc(3 * len * sizeof(double));
            for (size_t i = 0; i < 3 * len; i++) h[i] = (double)h_f32[i];
            double *d_A, *d_B, *d_C;
            CUDA_CHECK(cudaMalloc((void **)&d_A, len * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_B, len * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_C, len * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_A, h, len * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_B, h + len, len * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_C, h + 2 * len, len * sizeof(double), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            warm_clocks(handle); /* full clocks first — see helpers.h */

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDgemm(handle, CUBLAS_OP_N, CUBLAS_OP_N, n, n, n, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDgemm(handle, CUBLAS_OP_N, CUBLAS_OP_N, n, n, n, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            float compute_gflops = ((2.0f * n * n * n) / 1e9f) / (med_compute / 1e3f);
            // Both metrics — see the .js counterpart.
            float bytes = ((float)n * n + (float)n * n + 2.0f * n * n) * (float)sizeof(double);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-14g  %-10d  %-12.4f  %-16.4f  %-12.4f\n", alpha, n, med_compute, compute_gflops, compute_gbs);
            rec_key[ri] = (float)alpha; // JSON key only — the call itself used the double
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gflops_vals[ri] = compute_gflops;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            cudaFree(d_B);
            cudaFree(d_C);
            free(h);
            free(h_f32);
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "dgemm", "alpha.dgemm", "alpha",
                        rec_key, rec_n, med_times, gbs_vals, gflops_vals, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gflops_vals);
    free(gbs_vals);
    return 0;
}
