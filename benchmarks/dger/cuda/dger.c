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

    float med_times[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-12s\n", "m", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    const double alpha = 1.0;

    for (int si = 0; si < num_sizes; si++) {
        int m = sizes[si];
        int n = sizes[si];
        int lda = m; // column-major, dense — cuBLAS's native layout

        float *h_x_f32 = random_float_array(m, -1.0f, 1.0f);
        float *h_y_f32 = random_float_array(n, -1.0f, 1.0f);
        float *h_A_f32 = random_float_array(m * n, -1.0f, 1.0f);
        double *h_x = malloc((size_t)m * sizeof(double));
        double *h_y = malloc((size_t)n * sizeof(double));
        double *h_A = malloc((size_t)m * n * sizeof(double));
        for (int i = 0; i < m; i++) h_x[i] = (double)h_x_f32[i];
        for (int i = 0; i < n; i++) h_y[i] = (double)h_y_f32[i];
        for (int i = 0; i < m * n; i++) h_A[i] = (double)h_A_f32[i];

        double *d_x, *d_y, *d_A;
        CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)m * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)n * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)m * n * sizeof(double)));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)m * sizeof(double), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)m * n * sizeof(double), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // d_A is genuinely column-major m×n (lda=m) — cuBLAS's native layout,
        // so a plain call computes A += alpha*x*y^T directly, no swap needed.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasDger(handle, m, n, &alpha, d_x, 1, d_y, 1, d_A, lda));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasDger(handle, m, n, &alpha, d_x, 1, d_y, 1, d_A, lda));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // A read + A write + x read + y read
        float bytes = (float)((size_t)(2 * m * n + m + n)) * (float)sizeof(double);
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-10d  %-12.4f  %-12.4f\n", m, n, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        CUDA_CHECK(cudaFree(d_x));
        CUDA_CHECK(cudaFree(d_y));
        CUDA_CHECK(cudaFree(d_A));
        free(h_x);
        free(h_y);
        free(h_A);
        free(h_x_f32);
        free(h_y_f32);
        free(h_A_f32);
    }

    // write JSON results — m and n are both recorded (unlike ssymv/strmv's
    // square-only "n") since dger's shape genuinely has independent
    // dimensions, matching the JS benchmark's schema.
    record_field fields[] = {
        { "m", FIELD_INT, sizes },
        { "n", FIELD_INT, sizes },
    };
    save_results(gpu_model, "dger", "dger", fields, 2, med_times, gbs_vals, NULL, num_sizes);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
