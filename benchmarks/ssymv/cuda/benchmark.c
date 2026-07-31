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
    const float beta  = 0.0f;

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];
        int lda = n;

        float *h_A = random_float_array(n * n, -1.0f, 1.0f);
        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_y = random_float_array(n, -1.0f, 1.0f);

        float *d_A, *d_x, *d_y;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_y, n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * n * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // warm up
        // d_A is genuinely column-major — cuBLAS's native layout, so
        // FILL_MODE_LOWER reads the same triangle wgblas's "lower" reads.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUBLAS_CHECK(cublasSsymv(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasSsymv(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // lower triangle A read + x read + y read + y write
        float bytes = ((float)(n * (n + 1) / 2) + 3.0f * n) * 4.0f;
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-12.4f  %-12.4f\n", n, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        CUDA_CHECK(cudaFree(d_A));
        CUDA_CHECK(cudaFree(d_x));
        CUDA_CHECK(cudaFree(d_y));
        free(h_A);
        free(h_x);
        free(h_y);
    }

    // write JSON results
    char *gpu_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&out_dir,   "%s/cuda",               gpu_dir);
    asprintf(&file_path, "%s/ssymv.json",          out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < num_sizes; i++) {
        fprintf(fp,
            "  { \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], med_times[i], gbs_vals[i],
            i < num_sizes - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(out_dir);
    free(file_path);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
