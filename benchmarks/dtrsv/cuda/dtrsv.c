// Unlike every other Level 2 routine here, strsv/dtrsv's dominant
// performance story (in the wgblas implementation) isn't uplo/trans/lda —
// it's dispatch-count overhead from its blocked/sequential solve (see
// dtrsv.js). cuBLAS's cublasDtrsv is an opaque single call with no
// equivalent block-dispatch decomposition to characterize the same way,
// so this stays a plain n sweep — no numBlocks/ms_per_block columns here.

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

    int sizes[] = { 32, 64, 128, 256, 512, 1024, 2048, 4096 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-12s  %-12s\n", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

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

        // cublasDtrsv solves op(A)*x = b in place (b on input, x on output).
        // d_A is genuinely column-major — cuBLAS's native layout, so
        // FILL_MODE_LOWER + OP_N read the same op(A) = A wgblas's
        // "lower"/"no-transpose" reads, no reinterpretation trick needed.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(double), cudaMemcpyHostToDevice));
            CUBLAS_CHECK(cublasDtrsv(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasDtrsv(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // lower triangle A read + x read + x write (in place)
        float bytes = ((float)(n * (n + 1) / 2) + 2.0f * n) * (float)sizeof(double);
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-12.4f  %-12.4f\n", n, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        CUDA_CHECK(cudaFree(d_A));
        CUDA_CHECK(cudaFree(d_x));
        free(h_A);
        free(h_x);
        free(h_A_f32);
        free(h_x_f32);
    }

    save_results_ex("dtrsv", gpu_model, "dtrsv", "dtrsv", sizes, med_times, gbs_vals, num_sizes);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
