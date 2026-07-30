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

    const float alpha = 1.0f;

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];
        int lda = n;

        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_A = random_float_array(n * n, -1.0f, 1.0f);

        float *d_x, *d_A;
        CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // h_A is row-major lower triangular; cuBLAS is column-major. ssyr's update
        // is symmetric (x*x^T), so the same buffer reinterpreted column-major
        // (ld=lda) stores identical values as an upper triangle — no transpose
        // needed (ssyr has no trans parameter), FILL_MODE_UPPER alone suffices.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasSsyr(handle, CUBLAS_FILL_MODE_UPPER, n, &alpha, d_x, 1, d_A, lda));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasSsyr(handle, CUBLAS_FILL_MODE_UPPER, n, &alpha, d_x, 1, d_A, lda));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // lower triangle A read + A write + x read
        float bytes = ((float)(n * (n + 1)) + (float)n) * 4.0f;
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-12.4f  %-12.4f\n", n, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        CUDA_CHECK(cudaFree(d_x));
        CUDA_CHECK(cudaFree(d_A));
        free(h_x);
        free(h_A);
    }

    save_results("ssyr", gpu_model, sizes, med_times, gbs_vals, num_sizes);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
