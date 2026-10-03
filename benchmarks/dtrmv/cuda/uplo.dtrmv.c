// uplo sweep — dtrmv.c pins uplo to its baseline.

#include <stdio.h>
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
    const char *uplo_names[] = { "lower", "upper" };
    int num_uplo = (int)(sizeof(uplos) / sizeof(uplos[0]));

    int num_recs = num_sizes * num_uplo;
    const char **rec_key = (const char **)malloc(num_recs * sizeof(char *));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "uplo", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int vi = 0; vi < num_uplo; vi++) {
        cublasFillMode_t uplo = uplos[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = (size_t)(n * lda) * sizeof(double);
            // Host RAM, not device memory, is the tighter limit here: this configuration
            // stages 2 buffer(s) of comparable size in RAM before uploading. Passing the
            // device check and then being OOM-killed mid-run looks like a hang rather
            // than a skip, so check both.
            size_t host_needed = bytes_needed * 2;
            size_t host_avail = host_bytes_available();
            if (host_avail && host_needed > host_avail * 8 / 10) {
                printf("  (skipped n=%d: needs %.1f GB host RAM, %.1f GB available)\n",
                       n, host_needed / 1e9, host_avail / 1e9);
                continue;
            }
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped uplo, n=%d: buffers would exceed available device memory)\n", n);
                continue;
            }

            float *h_A_f32 = random_float_array(n * lda, -1.0f, 1.0f);
            double *h_A = malloc((size_t)n * lda * sizeof(double));
            for (int i = 0; i < n * lda; i++) h_A[i] = (double)h_A_f32[i];
            for (int i = 0; i < n; i++) h_A[i * lda + i] = 8.0 + n; // diagonally dominant
            double *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(double), cudaMemcpyHostToDevice));

            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_x = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];
            double *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)(n) * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n) * sizeof(double), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDtrmv(handle, uplo, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                // in-place on x — re-seed so every iteration does identical work
                CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n) * sizeof(double), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDtrmv(handle, uplo, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // stored triangle + x — logical elements touched, same for every uplo
            float bytes = ((float)n * (n + 1) / 2 + 2.0f * n) * sizeof(double);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-14s  %-10d  %-12.4f  %-12.4f\n", uplo_names[vi], n, med_compute, compute_gbs);
            rec_key[ri] = uplo_names[vi];
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            free(h_A);
            free(h_A_f32);
            cudaFree(d_x);
            free(h_x);
            free(h_x_f32);
        }
    }

    cublasDestroy(handle);

    save_results_flag(gpu_model, "dtrmv", "uplo.dtrmv", "uplo",
                      rec_key, rec_n, med_times, gbs_vals, NULL, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
