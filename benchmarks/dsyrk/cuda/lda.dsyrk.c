// lda sweep — dsyrk.c is entirely tight lda. Swept at both trans values,
// as in lda.ssyrk.c, purely for comparison against lda.dsyrk.js.

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

    int sizes[] = { 512, 1024, 2048 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    int pads[] = { 0, 1, 8, 16, 32, 64 };
    int num_pads = (int)(sizeof(pads) / sizeof(pads[0]));
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_pads * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_pad = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    const double alpha = 1.0;
    const double beta  = 0.0;

    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n", "trans", "pad", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n", "--------------", "----------", "----------", "------------", "------------");

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int pi = 0; pi < num_pads; pi++) {
            int pad = pads[pi];

            for (int si = 0; si < num_sizes; si++) {
                int n = sizes[si];
                int k = n;
                int lda = k + pad, ldc = n;

                float *h_A_f32 = random_float_array((size_t)n * lda, -1.0f, 1.0f);
                double *h_A = malloc((size_t)n * lda * sizeof(double));
                for (size_t i = 0; i < (size_t)n * lda; i++) h_A[i] = (double)h_A_f32[i];
                float *h_C_f32 = random_float_array((size_t)n * n, -1.0f, 1.0f);
                double *h_C = malloc((size_t)n * n * sizeof(double));
                for (size_t i = 0; i < (size_t)n * n; i++) h_C[i] = (double)h_C_f32[i];

                double *d_A, *d_C;
                CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(double)));
                CUDA_CHECK(cudaMalloc((void **)&d_C, (size_t)n * n * sizeof(double)));
                CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaMemcpy(d_C, h_C, (size_t)n * n * sizeof(double), cudaMemcpyHostToDevice));

                cudaEvent_t start, stop;
                CUDA_CHECK(cudaEventCreate(&start));
                CUDA_CHECK(cudaEventCreate(&stop));

                warm_clocks(handle); /* full clocks first — see helpers.h */

                for (int i = 0; i < WARMUP_ITERS; i++) {
                    CUBLAS_CHECK(cublasDsyrk(handle, CUBLAS_FILL_MODE_LOWER, trans, n, k, &alpha, d_A, lda, &beta, d_C, ldc));
                }
                CUDA_CHECK(cudaDeviceSynchronize());

                float compute_times[BENCH_ITERS];
                for (int i = 0; i < BENCH_ITERS; i++) {
                    CUDA_CHECK(cudaEventRecord(start, 0));
                    CUBLAS_CHECK(cublasDsyrk(handle, CUBLAS_FILL_MODE_LOWER, trans, n, k, &alpha, d_A, lda, &beta, d_C, ldc));
                    CUDA_CHECK(cudaEventRecord(stop, 0));
                    CUDA_CHECK(cudaEventSynchronize(stop));
                    CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
                }

                float med = median(compute_times, BENCH_ITERS);
                float bytes = (float)((size_t)(n * k + n * n)) * (float)sizeof(double);
                float gbs = (bytes / 1e9f) / (med / 1e3f);

                printf("%-14s  %-10d  %-10d  %-12.4f  %-12.4f\n", trans_name, pad, n, med, gbs);

                rec_trans[ri] = trans_name;
                rec_pad[ri] = pad;
                rec_n[ri] = n;
                med_times[ri] = med;
                gbs_vals[ri] = gbs;
                ri++;

                CUDA_CHECK(cudaEventDestroy(start));
                CUDA_CHECK(cudaEventDestroy(stop));
                cudaFree(d_A);
                cudaFree(d_C);
                free(h_A);
                free(h_A_f32);
                free(h_C);
                free(h_C_f32);
            }
        }
    }

    // write JSON results — records carry both "trans" and "pad".
    record_field fields[] = {
        { "trans", FIELD_STRING, rec_trans },
        { "pad", FIELD_INT, rec_pad },
        { "n", FIELD_INT, rec_n },
    };
    save_results(gpu_model, "dsyrk", "lda.dsyrk", fields, 3, med_times, gbs_vals, NULL, ri);
    free(rec_trans);
    free(rec_pad);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    cublasDestroy(handle);
    return 0;
}
