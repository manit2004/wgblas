// cosine sweep — drot.c pins cosine to its baseline.
//
// The cosine half of the plane rotation, swept with s fixed so the two halves are
// attributed separately. cublasDrot computes both outputs unconditionally.

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
    float cs[] = { 0.0f, 0.5f, 0.70710678f, 1.0f, -0.75f };
    int num_c = (int)(sizeof(cs) / sizeof(cs[0]));

    int num_recs = num_sizes * num_c;
    float *rec_key = (float *)malloc(num_recs * sizeof(float));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "c", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int vi = 0; vi < num_c; vi++) {
        float c_v = cs[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = (size_t)(n) * sizeof(double);
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
                printf("  (skipped c, n=%d: buffers would exceed available device memory)\n", n);
                continue;
            }

            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            float *h_y_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_x = malloc((size_t)n * sizeof(double));
            double *h_y = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n; i++) { h_x[i] = (double)h_x_f32[i]; h_y[i] = (double)h_y_f32[i]; }

            double *d_x, *d_y;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)n * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)n * sizeof(double), cudaMemcpyHostToDevice));

            double c = (double)c_v;
            double s = 0.70710678;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDrot(handle, n, d_x, 1, d_y, 1, &c, &s));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDrot(handle, n, d_x, 1, d_y, 1, &c, &s));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // x/y read + write — logical elements touched, same for every c
            float bytes = 4.0f * n * sizeof(double);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-12g  %-10d  %-12.4f  %-12.4f\n", c_v, n, med_compute, compute_gbs);
            rec_key[ri] = c_v;
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_x);
            free(h_x);
            free(h_x_f32);
            cudaFree(d_y);
            free(h_y);
            free(h_y_f32);
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "drot", "cosine.drot", "c",
                        rec_key, rec_n, med_times, gbs_vals, NULL, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
