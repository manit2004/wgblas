// trans sweep — ssyr2k.c is entirely CUBLAS_OP_N. See trans.ssyr2k.js for
// the mechanism (wgblas-side coupling of both internal passes; cuBLAS's own
// cublasSsyr2k has no such internal duplication, measured here purely for
// comparison against wgblas).

#include <stdio.h>
#include <stdlib.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  30

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 256, 512, 1024, 2048 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    const float alpha = 1.0f;
    const float beta  = 0.0f;

    printf("%-14s  %-10s  %-12s  %-12s\n", "trans", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int k = n;
            int lda = k, ldb = k, ldc = n;

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
                CUBLAS_CHECK(cublasSsyr2k(handle, CUBLAS_FILL_MODE_LOWER, trans, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasSsyr2k(handle, CUBLAS_FILL_MODE_LOWER, trans, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            float bytes = (float)((size_t)(n * k + n * k + n * n)) * 4.0f;
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-14s  %-10d  %-12.4f  %-12.4f\n", trans_name, n, med, gbs);

            rec_trans[ri] = trans_name;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            cudaFree(d_B);
            cudaFree(d_C);
            free(h_A);
            free(h_B);
            free(h_C);
        }
    }

    save_results_trans(gpu_model, "ssyr2k", "trans.ssyr2k", rec_trans, rec_n, med_times, gbs_vals, ri);
    free(rec_trans);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    cublasDestroy(handle);
    return 0;
}
