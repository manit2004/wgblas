#include <stdio.h>
#include <cublas_v2.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    cublasCreate(&handle);

    int bench_ns[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216 };
    int num_ns = (int)(sizeof(bench_ns) / sizeof(bench_ns[0]));

    float med_times[num_ns];
    float gbs_vals[num_ns];

    printf("%-10s  %-12s  %-12s\n", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

    // flag=-1: full 2x2 H matrix [[0.6, 0.8], [-0.8, 0.6]]
    // cublasSrotm with CUBLAS_POINTER_MODE_HOST (default) reads param from host memory
    float param[5] = { -1.0f, 0.6f, -0.8f, 0.8f, 0.6f };

    for (int si = 0; si < num_ns; si++) {
        int n = bench_ns[si];

        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_y = random_float_array(n, -1.0f, 1.0f);

        float *d_x, *d_y;
        cudaMalloc((void **)&d_x, n * sizeof(float));
        cudaMalloc((void **)&d_y, n * sizeof(float));
        cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice);
        cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice);

        cudaEvent_t start, stop;
        cudaEventCreate(&start);
        cudaEventCreate(&stop);

        // warm up
        for (int i = 0; i < WARMUP_ITERS; i++) {
            cublasSrotm(handle, n, d_x, 1, d_y, 1, param);
        }
        cudaDeviceSynchronize();

        // compute-only: data already on GPU
        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            cudaEventRecord(start, 0);
            cublasSrotm(handle, n, d_x, 1, d_y, 1, param);
            cudaEventRecord(stop, 0);
            cudaEventSynchronize(stop);
            cudaEventElapsedTime(&compute_times[i], start, stop);
        }

        float med_compute = median(compute_times, BENCH_ITERS);

        // throughput: x read + x written + y read + y written = 4 * n * 4 bytes
        // (param is 5 floats, negligible vs n up to 16M)
        float bytes = 4.0f * n * sizeof(float);
        float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

        printf("%-10d  %-12.4f  %-12.4f\n", n, med_compute, compute_gbs);
        med_times[si] = med_compute;
        gbs_vals[si]  = compute_gbs;

        cudaEventDestroy(start);
        cudaEventDestroy(stop);
        cudaFree(d_x);
        cudaFree(d_y);
        free(h_x);
        free(h_y);
    }

    cublasDestroy(handle);

    save_results("srotm", gpu_model, bench_ns, med_times, gbs_vals, num_ns);

    return 0;
}
