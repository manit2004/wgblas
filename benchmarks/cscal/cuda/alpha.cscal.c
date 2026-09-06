// alpha sweep — cscal.c pins alpha to its baseline (2+3i).
//
// cublasCscal takes alpha by pointer and applies it unconditionally, so a
// flat sweep is the expected result — recorded as a measured null against
// the wgblas side, which is flat for the same reason (see alpha.cscal.js).
// 0+0i, 1+0i and a denormal 1e-38+0i are the values an implementation could
// special-case if it chose to; 2.5-3.75i and 0+1i exercise genuinely mixed
// and pure-imaginary alpha.
//
// alpha is complex, so the swept key is a formatted string (via
// save_results_flag) rather than a bare float (save_results_scalar).

#include <stdio.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 1024, 65536, 1048576, 16777216 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    cuComplex alphas[] = {
        { 0.0f, 0.0f },
        { 1.0f, 0.0f },
        { 2.5f, -3.75f },
        { 0.0f, 1.0f },
        { 1e-38f, 0.0f },
    };
    int num_alpha = (int)(sizeof(alphas) / sizeof(alphas[0]));

    int num_recs = num_sizes * num_alpha;
    char **rec_key = (char **)malloc(num_recs * sizeof(char *));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-16s  %-10s  %-12s  %-12s\n", "alpha", "n", "compute_ms", "compute_GBs");
    printf("%-16s  %-10s  %-12s  %-12s\n", "----------------", "----------", "------------", "------------");

    for (int vi = 0; vi < num_alpha; vi++) {
        cuComplex alpha = alphas[vi];

        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = (size_t)(n) * sizeof(cuComplex);
            size_t host_needed = bytes_needed * 1;
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

            float *re = random_float_array(n, -1.0f, 1.0f);
            float *im = random_float_array(n, -1.0f, 1.0f);
            cuComplex *h_x = (cuComplex *)malloc((size_t)n * sizeof(cuComplex));
            for (int i = 0; i < n; i++) h_x[i] = make_cuComplex(re[i], im[i]);
            free(re);
            free(im);

            cuComplex *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)(n) * sizeof(cuComplex)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n) * sizeof(cuComplex), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasCscal(handle, n, &alpha, d_x, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasCscal(handle, n, &alpha, d_x, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // x read + write — logical elements touched, same for every alpha
            float bytes = 2.0f * n * sizeof(cuComplex);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            char *label;
            asprintf(&label, "%g%+gi", alpha.x, alpha.y);
            printf("%-16s  %-10d  %-12.4f  %-12.4f\n", label, n, med_compute, compute_gbs);
            rec_key[ri] = label;
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_x);
            free(h_x);
        }
    }

    cublasDestroy(handle);

    save_results_flag(gpu_model, "cscal", "alpha.cscal", "alpha",
                       (const char **)rec_key, rec_n, med_times, gbs_vals, NULL, ri);

    for (int i = 0; i < ri; i++) free(rec_key[i]);
    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
