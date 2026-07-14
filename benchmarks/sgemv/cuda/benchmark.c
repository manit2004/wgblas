#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <cublas_v2.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    cublasCreate(&handle);

    int sizes[] = { 32, 64, 128, 256, 512, 1024, 1280 , 2048, 4096 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    float med_times[num_sizes];
    float gflops_vals[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "m", "n", "compute_ms", "compute_GFLOPs", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-14s  %-12s\n",
           "----------", "----------", "------------", "--------------", "------------");

    const float alpha = 1.0f;
    const float beta  = 0.0f;

    for (int si = 0; si < num_sizes; si++) {
        int m = sizes[si];
        int n = sizes[si];
        int lda = n; // row-major, dense

        float *h_A = random_float_array(m * n, -1.0f, 1.0f);
        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_y = random_float_array(m, -1.0f, 1.0f);

        float *d_A, *d_x, *d_y;
        cudaMalloc((void **)&d_A, (size_t)m * n * sizeof(float));
        cudaMalloc((void **)&d_x, n * sizeof(float));
        cudaMalloc((void **)&d_y, m * sizeof(float));
        cudaMemcpy(d_A, h_A, (size_t)m * n * sizeof(float), cudaMemcpyHostToDevice);
        cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice);
        cudaMemcpy(d_y, h_y, m * sizeof(float), cudaMemcpyHostToDevice);

        cudaEvent_t start, stop;
        cudaEventCreate(&start);
        cudaEventCreate(&stop);

        // warm up
        for (int i = 0; i < WARMUP_ITERS; i++) {
            // h_A is row-major m×n; CUBLAS is column-major, so pass as column-major
            // n×m with CUBLAS_OP_T to compute y = alpha * A_rowmajor * x + beta * y.
            cublasSgemv(handle, CUBLAS_OP_T, n, m, &alpha, d_A, n, d_x, 1, &beta, d_y, 1);
        }
        cudaDeviceSynchronize();

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            cudaEventRecord(start, 0);
            cublasSgemv(handle, CUBLAS_OP_T, n, m, &alpha, d_A, n, d_x, 1, &beta, d_y, 1);
            cudaEventRecord(stop, 0);
            cudaEventSynchronize(stop);
            cudaEventElapsedTime(&compute_times[i], start, stop);
        }

        float med = median(compute_times, BENCH_ITERS);
        // 2*m*n multiply-adds for the dot products, plus 2*m for the alpha/beta step
        float flops = 2.0f * m * n + 2.0f * m;
        // A read + x read + y read + y write
        float bytes = (float)((size_t)(m * n + n + 2 * m)) * 4.0f;
        float gflops = (flops / 1e9f) / (med / 1e3f);
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si]  = med;
        gflops_vals[si] = gflops;
        gbs_vals[si]   = gbs;

        printf("%-10d  %-10d  %-12.4f  %-14.4f  %-12.4f\n",
               m, n, med, gflops, gbs);

        cudaEventDestroy(start);
        cudaEventDestroy(stop);
        cudaFree(d_A);
        cudaFree(d_x);
        cudaFree(d_y);
        free(h_A);
        free(h_x);
        free(h_y);
    }

    // write JSON results
    char *gpu_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s",       gpu_model);
    asprintf(&out_dir,   "%s/cuda",                      gpu_dir);
    asprintf(&file_path, "%s/sgemv.json",                out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < num_sizes; i++) {
        fprintf(fp,
            "  { \"m\": %d, \"n\": %d, \"compute_ms\": %.4f, "
            "\"compute_GFLOPs\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], sizes[i], med_times[i], gflops_vals[i], gbs_vals[i],
            i < num_sizes - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(out_dir);
    free(file_path);

    cublasDestroy(handle);
    return 0;
}
