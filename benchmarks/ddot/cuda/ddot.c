#include <stdio.h>
#include "../../utils/helpers.h"

#define STRIDE 1 // unit stride — coalesced, best case. See stride.ddot.c for incx/incy > 1.
#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int bench_ns[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216 };
    int num_ns = (int)(sizeof(bench_ns) / sizeof(bench_ns[0]));

    float med_times[num_ns];
    float gbs_vals[num_ns];

    printf("%-10s  %-12s  %-12s\n", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

    for (int si = 0; si < num_ns; si++) {
        int n = bench_ns[si];

        float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
        float *h_y_f32 = random_float_array(n, -1.0f, 1.0f);
        double *h_x = malloc((size_t)n * sizeof(double));
        double *h_y = malloc((size_t)n * sizeof(double));
        for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];
        for (int i = 0; i < n; i++) h_y[i] = (double)h_y_f32[i];

        double *d_x;
        double *d_y;
        CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)n * sizeof(double)));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // warm up
        double dot_result;
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasDdot(handle, n, d_x, STRIDE, d_y, STRIDE, &dot_result));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasDdot(handle, n, d_x, STRIDE, d_y, STRIDE, &dot_result));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med_compute = median(compute_times, BENCH_ITERS);

        // throughput: x read + y read
        float bytes = 2.0f * n * sizeof(double);
        float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

        printf("%-10d  %-12.4f  %-12.4f\n", n, med_compute, compute_gbs);
        med_times[si] = med_compute;
        gbs_vals[si]  = compute_gbs;

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        cudaFree(d_x);
        cudaFree(d_y);
        free(h_x);
        free(h_y);
        free(h_x_f32);
        free(h_y_f32);
    }

    cublasDestroy(handle);

    save_results_ex("ddot", gpu_model, "ddot", "ddot", bench_ns, med_times, gbs_vals, num_ns);

    return 0;
}
