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

    printf("%-10s  %-12s  %-12s\n", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];
        int lda = n;

        float *h_A = random_float_array(n * n, -1.0f, 1.0f);
        float *h_x = random_float_array(n, -1.0f, 1.0f);

        float *d_A, *d_x;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // cublasStrmv computes x := op(A)*x in place.
        // h_A is row-major lower triangular; cuBLAS is column-major, so row-major
        // lower = column-major upper → use CUBLAS_FILL_MODE_UPPER. That same
        // reinterpretation also transposes the logical matrix, so CUBLAS_OP_T
        // undoes it and yields the requested no-transpose op(A) = A.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
            CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_UPPER, CUBLAS_OP_T, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_UPPER, CUBLAS_OP_T, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // lower triangle A read + x read + x write (in place)
        float bytes = ((float)(n * (n + 1) / 2) + 2.0f * n) * 4.0f;
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
    }

    save_results("strmv", gpu_model, sizes, med_times, gbs_vals, num_sizes);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
