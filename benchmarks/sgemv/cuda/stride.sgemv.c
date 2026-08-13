// Stride sweep — sgemv.c is entirely incx=incy=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever x/y are rows/columns of a
// larger matrix, so this characterizes that cost separately, at the same
// square shapes sgemv.c uses. trans stays CUBLAS_OP_N and lda stays tight —
// trans is covered by trans.sgemv.c.
//
// {4, 32, 256} are the same representative strides used across the Level 1
// sweeps — stride=1 itself is covered by sgemv.c, not repeated here.

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
    int strides[] = { 4, 32, 256 };
    int num_strides = (int)(sizeof(strides) / sizeof(strides[0]));

    int num_recs = num_sizes * num_strides;
    int *rec_stride = malloc(num_recs * sizeof(int));
    int *rec_m = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-10s  %-10s  %-10s  %-12s  %-12s\n",
           "stride", "m", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-10s  %-12s  %-12s\n",
           "----------", "----------", "----------", "------------", "------------");

    const float alpha = 1.0f;
    const float beta  = 0.0f;

    for (int ki = 0; ki < num_strides; ki++) {
        int stride = strides[ki];
        for (int si = 0; si < num_sizes; si++) {
            int m = sizes[si];
            int n = sizes[si];
            int lda = m; // column-major, dense — cuBLAS's native layout

            float *h_A = random_float_array(m * n, -1.0f, 1.0f);
            float *h_x = random_float_array(n * stride, -1.0f, 1.0f);
            float *h_y = random_float_array(m * stride, -1.0f, 1.0f);

            float *d_A, *d_x, *d_y;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)m * n * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * stride * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)m * stride * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)m * n * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * stride * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)m * stride * sizeof(float), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasSgemv(handle, CUBLAS_OP_N, m, n, &alpha, d_A, lda, d_x, stride, &beta, d_y, stride));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasSgemv(handle, CUBLAS_OP_N, m, n, &alpha, d_A, lda, d_x, stride, &beta, d_y, stride));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // A read + x read + y read + y write — logical elements touched, same regardless of stride
            float bytes = (float)((size_t)(m * n + n + 2 * m)) * 4.0f;
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-10d  %-10d  %-10d  %-12.4f  %-12.4f\n", stride, m, n, med, gbs);

            rec_stride[ri] = stride;
            rec_m[ri] = m;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_A);
            cudaFree(d_x);
            cudaFree(d_y);
            free(h_A);
            free(h_x);
            free(h_y);
        }
    }

    // write JSON results
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s",     gpu_model);
    asprintf(&base_dir,  "%s/cuda",                   gpu_dir);
    asprintf(&out_dir,   "%s/sgemv",                  base_dir);
    asprintf(&file_path, "%s/stride.sgemv.json",      out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < ri; i++) {
        fprintf(fp,
            "  { \"stride\": %d, \"m\": %d, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            rec_stride[i], rec_m[i], rec_n[i], med_times[i], gbs_vals[i],
            i < ri - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
    free(rec_stride);
    free(rec_m);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    cublasDestroy(handle);
    return 0;
}
