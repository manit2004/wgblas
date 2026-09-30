// trans sweep — dgemv.c is entirely CUBLAS_OP_N. This sweeps every (m, n)
// pair in SIZES against both CUBLAS_OP_N and CUBLAS_OP_T (full cross-product,
// mirroring trans.dgemv.js). Measured (not assumed): cuBLAS's own native
// double-precision path shows NONE of wgblas's dramatic tall-narrow
// transpose penalty — at m=4096, n=32, OP_N reaches 92.5 GB/s and OP_T 66.0
// GB/s (~1.4x, not wgblas's ~8.5x), and at square 4096×4096 OP_T is actually
// faster than OP_N (182 vs 158 GB/s). So dgemv_t.wgsl's one-thread-per-
// column parallelism bound (see trans.dgemv.js) is a wgblas-specific
// architectural cost, not something inherent to computing A^T*x at double
// precision.

#include <stdio.h>
#include <stdlib.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 32, 64, 128, 256, 512, 1024, 1280, 2048, 4096 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_sizes * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_m = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n",
           "trans", "m", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n",
           "--------------", "----------", "----------", "------------", "------------");

    const double alpha = 1.0;
    const double beta  = 0.0;

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int mi = 0; mi < num_sizes; mi++) {
            for (int ni = 0; ni < num_sizes; ni++) {
                int m = sizes[mi];
                int n = sizes[ni];
                int lda = m; // column-major, dense — cuBLAS's native layout

                // OP_N: x has n elements, y has m; OP_T: x has m elements, y has n.
                int xLen = (trans == CUBLAS_OP_N) ? n : m;
                int yLen = (trans == CUBLAS_OP_N) ? m : n;

                float *h_A_f32 = random_float_array(m * n, -1.0f, 1.0f);
                float *h_x_f32 = random_float_array(xLen, -1.0f, 1.0f);
                float *h_y_f32 = random_float_array(yLen, -1.0f, 1.0f);
                double *h_A = malloc((size_t)m * n * sizeof(double));
                double *h_x = malloc((size_t)xLen * sizeof(double));
                double *h_y = malloc((size_t)yLen * sizeof(double));
                for (int i = 0; i < m * n; i++) h_A[i] = (double)h_A_f32[i];
                for (int i = 0; i < xLen; i++) h_x[i] = (double)h_x_f32[i];
                for (int i = 0; i < yLen; i++) h_y[i] = (double)h_y_f32[i];

                double *d_A, *d_x, *d_y;
                CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)m * n * sizeof(double)));
                CUDA_CHECK(cudaMalloc((void **)&d_x, xLen * sizeof(double)));
                CUDA_CHECK(cudaMalloc((void **)&d_y, yLen * sizeof(double)));
                CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)m * n * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaMemcpy(d_x, h_x, xLen * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaMemcpy(d_y, h_y, yLen * sizeof(double), cudaMemcpyHostToDevice));

                cudaEvent_t start, stop;
                CUDA_CHECK(cudaEventCreate(&start));
                CUDA_CHECK(cudaEventCreate(&stop));

                for (int i = 0; i < WARMUP_ITERS; i++) {
                    CUBLAS_CHECK(cublasDgemv(handle, trans, m, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
                }
                CUDA_CHECK(cudaDeviceSynchronize());

                float compute_times[BENCH_ITERS];
                for (int i = 0; i < BENCH_ITERS; i++) {
                    CUDA_CHECK(cudaEventRecord(start, 0));
                    CUBLAS_CHECK(cublasDgemv(handle, trans, m, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
                    CUDA_CHECK(cudaEventRecord(stop, 0));
                    CUDA_CHECK(cudaEventSynchronize(stop));
                    CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
                }

                float med = median(compute_times, BENCH_ITERS);
                // A read + x read + y read + y write
                float bytes = (float)((size_t)(m * n + xLen + 2 * yLen)) * (float)sizeof(double);
                float gbs = (bytes / 1e9f) / (med / 1e3f);

                printf("%-14s  %-10d  %-10d  %-12.4f  %-12.4f\n", trans_name, m, n, med, gbs);

                rec_trans[ri] = trans_name;
                rec_m[ri] = m;
                rec_n[ri] = n;
                med_times[ri] = med;
                gbs_vals[ri] = gbs;
                ri++;

                CUDA_CHECK(cudaEventDestroy(start));
                CUDA_CHECK(cudaEventDestroy(stop));
                cudaFree(d_A);
                cudaFree(d_x);
                cudaFree(d_y);
                free(h_A);
                free(h_x);
                free(h_y);
                free(h_A_f32);
                free(h_x_f32);
                free(h_y_f32);
            }
        }
    }

    // write JSON results
    record_field fields[] = {
        { "trans", FIELD_STRING, rec_trans },
        { "m", FIELD_INT, rec_m },
        { "n", FIELD_INT, rec_n },
    };
    save_results(gpu_model, "dgemv", "trans.dgemv", fields, 3, med_times, gbs_vals, NULL, ri);
    free((void *)rec_trans);
    free(rec_m);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    cublasDestroy(handle);
    return 0;
}
