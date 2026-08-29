// stride sweep — strmv.c pins stride to its baseline.
//
// Non-unit stride breaks coalescing on the vector operands. {4, 32, 256} are the same
// representative points the Level 1 stride sweeps use; stride=1 is the baseline file.

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
    int strides[] = { 4, 32, 256 };
    int num_stride = (int)(sizeof(strides) / sizeof(strides[0]));

    int num_recs = num_sizes * num_stride;
    int *rec_key = (int *)malloc(num_recs * sizeof(int));
    int *rec_n = (int *)malloc(num_recs * sizeof(int));
    float *med_times = (float *)malloc(num_recs * sizeof(float));
    float *gbs_vals = (float *)malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "stride", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int vi = 0; vi < num_stride; vi++) {
        int stride = strides[vi];
        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = (size_t)(n * lda) * sizeof(float);
            if (bytes_needed > free_mem * 9 / 10) {
                printf("  (skipped stride, n=%d: buffers would exceed available device memory)\n", n);
                continue;
            }

            float *h_A = random_float_array(n * lda, -1.0f, 1.0f);
            for (int i = 0; i < n; i++) h_A[i * lda + i] = 8.0f + n; // diagonally dominant
            float *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(float), cudaMemcpyHostToDevice));
            float *h_x = random_float_array(n * stride, -1.0f, 1.0f);
            float *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)(n * stride) * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n * stride) * sizeof(float), cudaMemcpyHostToDevice));



            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, stride));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                // in-place on x — re-seed so every iteration does identical work
                CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)(n * stride) * sizeof(float), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, stride));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);
            // stored triangle + x — logical elements touched, same for every stride
            float bytes = ((float)n * (n + 1) / 2 + 2.0f * n) * sizeof(float);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-12d  %-10d  %-12.4f  %-12.4f\n", stride, n, med_compute, compute_gbs);
            rec_key[ri] = stride;
            rec_n[ri] = n;
            med_times[ri] = med_compute;
            gbs_vals[ri] = compute_gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            free(h_A);
            cudaFree(d_x);
            free(h_x);
        }
    }

    cublasDestroy(handle);

    save_results_stride(gpu_model, "strmv", "stride.strmv",
                        rec_key, rec_n, med_times, gbs_vals, ri);

    free(rec_key);
    free(rec_n);
    free(med_times);
    free(gbs_vals);
    return 0;
}
