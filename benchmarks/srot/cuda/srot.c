#include <stdio.h>
#include <math.h>
#include "../../utils/helpers.h"

#define STRIDE 1 // unit stride — coalesced, best case. See stride.srot.c for incx/incy > 1.
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

    // 45° rotation
    float c = (float)cos(M_PI / 4.0);
    float s = (float)sin(M_PI / 4.0);

    for (int si = 0; si < num_ns; si++) {
        int n = bench_ns[si];

        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_y = random_float_array(n, -1.0f, 1.0f);

        float *d_x;
        float *d_y;
        CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_y, n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // warm up
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasSrot(handle, n, d_x, STRIDE, d_y, STRIDE, &c, &s));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasSrot(handle, n, d_x, STRIDE, d_y, STRIDE, &c, &s));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med_compute = median(compute_times, BENCH_ITERS);

        // throughput: x read + x written + y read + y written
        float bytes = 4.0f * n * sizeof(float);
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
    }

    cublasDestroy(handle);

    save_results_ex("srot", gpu_model, "srot", "srot", bench_ns, med_times, gbs_vals, num_ns);

    return 0;
}
