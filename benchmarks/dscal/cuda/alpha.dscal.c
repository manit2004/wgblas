// alpha sweep — dscal.c pins alpha to its baseline.
//
// cuBLAS takes alpha by pointer and applies it unconditionally, so a flat sweep is the
// expected result — recorded as a measured null against the wgblas side, which is flat
// for the same reason. 0, 1 and a denormal 1e-38 are the values an implementation could
// special-case if it chose to.

#include <stdio.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    double alphas[] = { 0.0, 1.0, 2.5, -3.75, 1e-38 };
    int num_alpha = (int)(sizeof(alphas) / sizeof(alphas[0]));

    int num_recs = num_sizes * num_alpha;
    float *rec_key = (float *)malloc(num_recs * sizeof(float));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "alpha", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int vi = 0; vi < num_alpha; vi++) {
        double alpha_v = alphas[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];

            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_x = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];

            double *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));

            double alpha = alpha_v;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDscal(handle, n, &alpha, d_x, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDscal(handle, n, &alpha, d_x, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // x read + write — logical elements touched, same for every alpha
            float bytes = 2.0f * n * sizeof(double);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-12g  %-10d  %-12.4f  %-12.4f\n", alpha_v, n, med_compute, compute_gbs);
            rec_key[ri] = (float)alpha_v;
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_x);
            free(h_x);
            free(h_x_f32);
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "dscal", "alpha.dscal", "alpha",
                        rec_key, rec_n, med_times, gbs_vals, NULL, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
