// trans sweep — dtrmv.c is entirely CUBLAS_OP_N. See trans.dtrmv.js for the
// wgblas-side mechanism and measurement (coalescing, dominant, grows with n,
// ~2.4x at n=1024 to ~4.6x at n=4096, matching strmv's own f32 finding
// closely). Measured (not assumed) here: cuBLAS's own native double path
// shows the same effect in the same direction, but smaller — ~1.8x at
// n=4096 (106.5 vs 58.4 GB/s), not wgblas's ~4.6x.

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

    int num_recs = num_sizes * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "trans", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;

            float *h_A_f32 = random_float_array(n * n, -1.0f, 1.0f);
            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_A = malloc((size_t)n * n * sizeof(double));
            double *h_x = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n * n; i++) h_A[i] = (double)h_A_f32[i];
            for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];

            double *d_A, *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * n * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * n * sizeof(double), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            // cublasDtrmv computes x := op(A)*x in place, so re-seed d_x before
            // every call (matches the pattern dtrmv.c already uses).
            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(double), cudaMemcpyHostToDevice));
                CUBLAS_CHECK(cublasDtrmv(handle, CUBLAS_FILL_MODE_LOWER, trans, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDtrmv(handle, CUBLAS_FILL_MODE_LOWER, trans, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // lower triangle A read + x read + x write (in place)
            float bytes = ((float)(n * (n + 1) / 2) + 2.0f * n) * (float)sizeof(double);
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-14s  %-10d  %-12.4f  %-12.4f\n", trans_name, n, med, gbs);

            rec_trans[ri] = trans_name;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            CUDA_CHECK(cudaFree(d_A));
            CUDA_CHECK(cudaFree(d_x));
            free(h_A);
            free(h_x);
            free(h_A_f32);
            free(h_x_f32);
        }
    }

    // write JSON results — {trans, n} is exactly what save_results_trans covers.
    save_results_trans(gpu_model, "dtrmv", "trans.dtrmv", rec_trans, rec_n, med_times, gbs_vals, ri);
    free(rec_trans);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
