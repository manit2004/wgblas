// alpha sweep — dsymv.c pins alpha to its baseline.
//
// Measured (not assumed) — and genuinely different from dger/dsyr2/dgemv's own alpha
// sweeps (see alpha.dgemv.c): cuBLAS's dsymv does NOT take the dramatic alpha=0 no-op
// shortcut those routines do. alpha=0 here is only modestly slower than the rest (76.8
// vs ~86-87 GB/s at n=4096, ~12%), not the ~100x+ skip seen elsewhere — so whatever
// internal fast path those routines hit, this cuBLAS version's dsymv kernel evidently
// doesn't share it. Interestingly, wgblas's own shader — which has no alpha-dependent
// branch at all — shows a comparable-sized (~20%) alpha=0 slowdown of its own, by a
// completely different and still-unexplained mechanism (see alpha.dsymv.js). The two
// slowdowns are not the same phenomenon (one's cuBLAS-internal, one's wgblas-internal)
// but it's a notable coincidence that both land in the same rough magnitude for this
// routine specifically.

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
            int lda = n;
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = (size_t)(n * lda) * sizeof(double);
            // Host RAM, not device memory, is the tighter limit here: this configuration
            // stages 3 buffer(s) of comparable size in RAM before uploading. Passing the
            // device check and then being OOM-killed mid-run looks like a hang rather
            // than a skip, so check both.
            size_t host_needed = bytes_needed * 3;
            size_t host_avail = host_bytes_available();
            if (host_avail && host_needed > host_avail * 8 / 10) {
                printf("  (skipped n=%d: needs %.1f GB host RAM, %.1f GB available)\n",
                       n, host_needed / 1e9, host_avail / 1e9);
                continue;
            }
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped alpha, n=%d: buffers would exceed available device memory)\n", n);
                continue;
            }

            float *h_A_f32 = random_float_array(n * lda, -1.0f, 1.0f);
            double *h_A = malloc((size_t)n * lda * sizeof(double));
            for (int i = 0; i < n * lda; i++) h_A[i] = (double)h_A_f32[i];
            double *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(double), cudaMemcpyHostToDevice));

            float *h_x_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_x = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n; i++) h_x[i] = (double)h_x_f32[i];
            double *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)(n) * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n) * sizeof(double), cudaMemcpyHostToDevice));

            float *h_y_f32 = random_float_array(n, -1.0f, 1.0f);
            double *h_y = malloc((size_t)n * sizeof(double));
            for (int i = 0; i < n; i++) h_y[i] = (double)h_y_f32[i];
            double *d_y;
            CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)(n) * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)(n) * sizeof(double), cudaMemcpyHostToDevice));

    double alpha = alpha_v;
    double beta = 0.0;

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDsymv(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDsymv(handle, CUBLAS_FILL_MODE_LOWER, n, &alpha, d_A, lda, d_x, 1, &beta, d_y, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // stored triangle + x + y — logical elements touched, same for every alpha
            float bytes = ((float)n * (n + 1) / 2 + 2.0f * n) * sizeof(double);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-12g  %-10d  %-12.4f  %-12.4f\n", alpha_v, n, med_compute, compute_gbs);
            rec_key[ri] = (float)alpha_v;
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
            cudaFree(d_y);
            free(h_y);
            free(h_y_f32);
        }
    }

    cublasDestroy(handle);

    save_results_scalar(gpu_model, "dsymv", "alpha.dsymv", "alpha",
                        rec_key, rec_n, med_times, gbs_vals, NULL, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
