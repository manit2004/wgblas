// trans sweep — strmv.c is entirely CUBLAS_OP_N. See trans.strmv.js for the
// mechanism (coalescing, dominant, grows with n) — measured ratio grew from
// ~2.3x at n=1024 to ~4.2x at n=4096.

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
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-12s  %-12s\n", "trans", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-12s  %-12s\n", "--------------", "----------", "------------", "------------");

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int si = 0; si < num_sizes; si++) {
            int n = sizes[si];
            int lda = n;

            float *h_A = random_float_array(n * n, -1.0f, 1.0f);
            float *h_x = random_float_array(n, -1.0f, 1.0f);

            float *d_A, *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * n * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * n * sizeof(float), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            // cublasStrmv computes x := op(A)*x in place, so re-seed d_x before
            // every call (matches the pattern strmv.c already uses).
            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
                CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_LOWER, trans, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice));
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasStrmv(handle, CUBLAS_FILL_MODE_LOWER, trans, CUBLAS_DIAG_NON_UNIT, n, d_A, lda, d_x, 1));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med = median(compute_times, BENCH_ITERS);
            // lower triangle A read + x read + x write (in place)
            float bytes = ((float)(n * (n + 1) / 2) + 2.0f * n) * 4.0f;
            float gbs = (bytes / 1e9f) / (med / 1e3f);

            printf("%-14s  %-10d  %-12.4f  %-12.4f\n", trans_name, n, med, gbs);

            rec_trans[ri] = trans_name;
            rec_n[ri] = n;
            med_times[ri] = med;
            gbs_vals[ri] = gbs;
            ri++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            CUDA_CHECK(cudaFree(d_A));
            CUDA_CHECK(cudaFree(d_x));
            free(h_A);
            free(h_x);
        }
    }

    // write JSON results — manual, "trans" isn't one of the shared helper's
    // field names (those cover stride/pad/uplo).
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda",               gpu_dir);
    asprintf(&out_dir,   "%s/strmv",              base_dir);
    asprintf(&file_path, "%s/trans.strmv.json",   out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < ri; i++) {
        fprintf(fp,
            "  { \"trans\": \"%s\", \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            rec_trans[i], rec_n[i], med_times[i], gbs_vals[i],
            i < ri - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);
    free(rec_trans);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
