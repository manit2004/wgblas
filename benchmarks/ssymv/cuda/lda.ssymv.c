// lda sweep — ssymv.c is entirely tight lda (lda = n). uplo was scoped and
// found to be a non-effect; not swept here. lda IS a real lever: the
// mirror-read path has cross-thread lda-strided addressing, which hits
// DRAM bank conflicts at power-of-2 lda — measured ~1.4x slower than
// lda+1 at matched n. {0, 1, 8, 32, 64, 128} are the pad amounts verified
// during scoping.

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
    int pads[] = { 0, 1, 8, 32, 64, 128 };
    int num_pads = (int)(sizeof(pads) / sizeof(pads[0]));

    int num_recs = num_sizes * num_pads;
    int *rec_pad = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "pad", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    const float alpha = 1.0f;
    const float beta  = 0.0f;

    for (int pi = 0; pi < num_pads; pi++) {
        int pad = pads[pi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n + pad;

            float *h_A = random_float_array((size_t)n * lda, -1.0f, 1.0f);
            float *h_x = random_float_array(n, -1.0f, 1.0f);
            float *h_y = random_float_array(n, -1.0f, 1.0f);

            float *d_A, *d_x, *d_y;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_y, n * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

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

            printf("%-10d  %-10d  %-12.4f  %-12.4f\n", pad, n, med, gbs);

            rec_pad[ri] = pad;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            CUDA_CHECK(cudaFree(d_A));
            CUDA_CHECK(cudaFree(d_x));
            CUDA_CHECK(cudaFree(d_y));
            free(h_A);
            free(h_x);
            free(h_y);
        }
    }

    save_results_pad(gpu_model, "ssymv", "lda.ssymv", rec_pad, rec_n, med_times, gbs_vals, ri);
    free(rec_pad);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
