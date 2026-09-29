// lda sweep — dsyr.c is entirely tight lda (lda = n). This is cuBLAS's own
// native double-precision path (no DD emulation) — measured (not assumed):
// a real pad effect exists (~76-104 GB/s spread), but it doesn't cleanly
// match ssyr.c's "0/32/64/128 fast, else slow" 128-byte-boundary split —
// pad=16 (also a multiple of 16 doubles = 128 bytes) lands in between
// rather than clearly fast. Real effect, unclear exact rule at this
// sample size; not worth a stronger claim than that.

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
    int pads[] = { 0, 1, 8, 16, 32, 48, 64, 128 };
    int num_pads = (int)(sizeof(pads) / sizeof(pads[0]));

    int num_recs = num_sizes * num_pads;
    int *rec_pad = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "pad", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    const double alpha = 1.0;

    for (int pi = 0; pi < num_pads; pi++) {
        int pad = pads[pi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n + pad;

            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            float *h_A_f32 = random_float_array((size_t)n * lda, -1.0f, 1.0f);
            double *h_x = malloc((size_t)n * sizeof(double));
            double *h_A = malloc((size_t)n * lda * sizeof(double));
            for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];
            for (int i = 0; i < n * lda; i++) h_A[i] = (double)h_A_f32[i];

            double *d_x, *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(double), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDsyr(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_x, 1, d_A, lda));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDsyr(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_x, 1, d_A, lda));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // lower triangle A read + A write + x read
            float bytes = ((float)(n * (n + 1)) + (float)n) * (float)sizeof(double);
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-10d  %-10d  %-12.4f  %-12.4f\n", pad, n, med, gbs);

            rec_pad[ri] = pad;
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
            free(h_x_f32);
            free(h_A_f32);
        }
    }

    save_results_pad(gpu_model, "dsyr", "lda.dsyr", rec_pad, rec_n, med_times, gbs_vals, ri);
    free(rec_pad);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
