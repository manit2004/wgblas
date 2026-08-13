// uplo sweep — ssyr.c is entirely CUBLAS_FILL_MODE_LOWER. See uplo.ssyr.js
// for the mechanism (dispatch-order workload imbalance) — measured ~1.7-1.8x
// slower for upper at n>=2048.

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
    cublasFillMode_t uplos[] = { CUBLAS_FILL_MODE_LOWER, CUBLAS_FILL_MODE_UPPER };
    int num_uplos = (int)(sizeof(uplos) / sizeof(uplos[0]));

    int num_recs = num_sizes * num_uplos;
    const char **rec_uplo = malloc(num_recs * sizeof(char *));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "uplo", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    const float alpha = 1.0f;

    for (int ui = 0; ui < num_uplos; ui++) {
        cublasFillMode_t uplo = uplos[ui];
        const char *uplo_name = (uplo == CUBLAS_FILL_MODE_LOWER) ? "lower" : "upper";

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

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasSsyr(handle, uplo, n, &alpha, d_x, 1, d_A, lda));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasSsyr(handle, uplo, n, &alpha, d_x, 1, d_A, lda));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // lower/upper triangle A read + A write + x read — same element count either way
            float bytes = ((float)(n * (n + 1)) + (float)n) * 4.0f;
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-10s  %-10d  %-12.4f  %-12.4f\n", uplo_name, n, med, gbs);

            rec_uplo[ri] = uplo_name;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            CUDA_CHECK(cudaFree(d_x));
            CUDA_CHECK(cudaFree(d_A));
            free(h_x);
            free(h_A);
        }
    }

    save_results_uplo(gpu_model, "ssyr", "uplo.ssyr", rec_uplo, rec_n, med_times, gbs_vals, ri);
    free(rec_uplo);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
