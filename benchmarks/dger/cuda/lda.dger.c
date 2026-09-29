// lda sweep — dger.c is entirely tight lda (lda = m, cuBLAS's native
// column-major convention). See lda.dger.js for the mechanism — reproduces
// sger's own row-stride alignment finding almost exactly.

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
    int *rec_m = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-10s  %-10s  %-10s  %-12s  %-12s\n", "pad", "m", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "----------", "------------", "------------");

    const double alpha = 1.0;

    for (int pi = 0; pi < num_pads; pi++) {
        int pad = pads[pi];
        for (int si = 0; si < num_sizes; si++) {
            int m = sizes[si];
            int n = sizes[si];
            int lda = m + pad; // column-major: lda >= m (row count)

            float *h_x_f32 = random_float_array(m, -1.0f, 1.0f);
            float *h_y_f32 = random_float_array(n, -1.0f, 1.0f);
            float *h_A_f32 = random_float_array((size_t)lda * n, -1.0f, 1.0f);
            double *h_x = malloc((size_t)m * sizeof(double));
            double *h_y = malloc((size_t)n * sizeof(double));
            double *h_A = malloc((size_t)lda * n * sizeof(double));
            for (int i = 0; i < m; i++) h_x[i] = (double)h_x_f32[i];
            for (int i = 0; i < n; i++) h_y[i] = (double)h_y_f32[i];
            for (int i = 0; i < lda * n; i++) h_A[i] = (double)h_A_f32[i];

            double *d_x, *d_y, *d_A;
            CUDA_CHECK(cudaMalloc((void **)&d_x, m * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_y, n * sizeof(double)));
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)lda * n * sizeof(double)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, m * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, n * sizeof(double), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)lda * n * sizeof(double), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasDger(handle, m, n, &alpha, d_x, 1, d_y, 1, d_A, lda));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasDger(handle, m, n, &alpha, d_x, 1, d_y, 1, d_A, lda));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // A read + A write + x read + y read
            float bytes = (float)((size_t)(2 * m * n + m + n)) * (float)sizeof(double);
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-10d  %-10d  %-10d  %-12.4f  %-12.4f\n", pad, m, n, med, gbs);

            rec_pad[ri] = pad;
            rec_m[ri] = m;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            CUDA_CHECK(cudaFree(d_x));
            CUDA_CHECK(cudaFree(d_y));
            CUDA_CHECK(cudaFree(d_A));
            free(h_x);
            free(h_y);
            free(h_A);
            free(h_x_f32);
            free(h_y_f32);
            free(h_A_f32);
        }
    }

    // write JSON results — manual, not save_results_pad, since dger's
    // records need both m and n (matches lda.dger.js's schema).
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda",               gpu_dir);
    asprintf(&out_dir,   "%s/dger",               base_dir);
    asprintf(&file_path, "%s/lda.dger.json",      out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < ri; i++) {
        fprintf(fp,
            "  { \"pad\": %d, \"m\": %d, \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            rec_pad[i], rec_m[i], rec_n[i], med_times[i], gbs_vals[i],
            i < ri - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
    free(rec_pad);
    free(rec_m);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
