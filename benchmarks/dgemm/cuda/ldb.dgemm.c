// ldb sweep — dgemm.c is entirely tight lda/ldb/ldc. Swept at both transB
// values, same as ldb.sgemm.c. transA stays CUBLAS_OP_N throughout.

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

    int sizes[] = { 32, 64, 128, 256, 512, 1024 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    int pads[] = { 0, 1, 8, 16, 32, 64 };
    int num_pads = (int)(sizeof(pads) / sizeof(pads[0]));
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_pads * num_trans;
    const char **rec_tb = malloc(num_recs * sizeof(char *));
    int *rec_pad = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gflops_vals = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-10s  %-12s  %-14s  %-12s\n",
           "transB", "pad", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-14s  %-10s  %-10s  %-12s  %-14s  %-12s\n",
           "--------------", "----------", "----------", "------------", "--------------", "------------");

    const double alpha = 1.0;
    const double beta  = 0.0;

    for (int tbi = 0; tbi < num_trans; tbi++) {
        cublasOperation_t transB = transes[tbi];
        const char *tb_name = (transB == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int pi = 0; pi < num_pads; pi++) {
            int pad = pads[pi];
            for (int si = 0; si < num_sizes; si++) {
                int m = sizes[si], n = sizes[si], k = sizes[si];
                int lda = m; // column-major, dense, transA=N throughout
                // B stored as k×n (no-transpose) or n×k (transpose); column-major, so ldb >= rows.
                int bRows = (transB == CUBLAS_OP_N) ? k : n;
                int bCols = (transB == CUBLAS_OP_N) ? n : k;
                int ldb = bRows + pad;
                int ldc = m;
                size_t aLen = (size_t)m * k, bLen = (size_t)ldb * bCols, cLen = (size_t)m * n;

                float *h_A_f32 = random_float_array(aLen, -1.0f, 1.0f);
                float *h_B_f32 = random_float_array(bLen, -1.0f, 1.0f);
                float *h_C_f32 = random_float_array(cLen, -1.0f, 1.0f);
                double *h_A = malloc(aLen * sizeof(double));
                double *h_B = malloc(bLen * sizeof(double));
                double *h_C = malloc(cLen * sizeof(double));
                for (size_t i = 0; i < aLen; i++) h_A[i] = (double)h_A_f32[i];
                for (size_t i = 0; i < bLen; i++) h_B[i] = (double)h_B_f32[i];
                for (size_t i = 0; i < cLen; i++) h_C[i] = (double)h_C_f32[i];

                double *d_A, *d_B, *d_C;
                CUDA_CHECK(cudaMalloc((void **)&d_A, aLen * sizeof(double)));
                CUDA_CHECK(cudaMalloc((void **)&d_B, bLen * sizeof(double)));
                CUDA_CHECK(cudaMalloc((void **)&d_C, cLen * sizeof(double)));
                CUDA_CHECK(cudaMemcpy(d_A, h_A, aLen * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaMemcpy(d_B, h_B, bLen * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaMemcpy(d_C, h_C, cLen * sizeof(double), cudaMemcpyHostToDevice));

                cudaEvent_t start, stop;
                CUDA_CHECK(cudaEventCreate(&start));
                CUDA_CHECK(cudaEventCreate(&stop));

                warm_clocks(handle); /* full clocks first — see helpers.h */

                for (int i = 0; i < WARMUP_ITERS; i++) {
                    CUBLAS_CHECK(cublasDgemm(handle, CUBLAS_OP_N, transB, m, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
                }
                CUDA_CHECK(cudaDeviceSynchronize());

                float compute_times[BENCH_ITERS];
                for (int i = 0; i < BENCH_ITERS; i++) {
                    CUDA_CHECK(cudaEventRecord(start, 0));
                    CUBLAS_CHECK(cublasDgemm(handle, CUBLAS_OP_N, transB, m, n, k, &alpha, d_A, lda, d_B, ldb, &beta, d_C, ldc));
                    CUDA_CHECK(cudaEventRecord(stop, 0));
                    CUDA_CHECK(cudaEventSynchronize(stop));
                    CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
                }

                float med = median(compute_times, BENCH_ITERS);
                float flops = 2.0f * m * n * k + 2.0f * m * n;
                float bytes = (float)((size_t)(m * k + k * n + 2 * m * n)) * (float)sizeof(double);
                float gflops = (flops / 1e9f) / (med / 1e3f);
                float gbs = (bytes / 1e9f) / (med / 1e3f);

                printf("%-14s  %-10d  %-10d  %-12.4f  %-14.4f  %-12.4f\n", tb_name, pad, n, med, gflops, gbs);

                rec_tb[ri] = tb_name;
                rec_pad[ri] = pad;
                rec_n[ri] = n;
                med_times[ri] = med;
                gflops_vals[ri] = gflops;
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
                free(h_A_f32);
                free(h_B_f32);
                free(h_C_f32);
            }
        }
    }

    // write JSON results — three-key shape (transB, pad, n).
    record_field fields[] = {
        { "transB", FIELD_STRING, rec_tb },
        { "pad", FIELD_INT, rec_pad },
        { "n", FIELD_INT, rec_n },
    };
    save_results(gpu_model, "dgemm", "ldb.dgemm", fields, 3, med_times, gbs_vals, gflops_vals, ri);
    free(rec_tb);
    free(rec_pad);
    free(rec_n);
    free(med_times);
    free(gflops_vals);
    free(gbs_vals);

    cublasDestroy(handle);
    return 0;
}
