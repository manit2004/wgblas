// wgblas's own strsm.js has a dispatch-count/numBlocks story (see that
// file); cublasStrsm is an opaque single call with no equivalent
// block-dispatch decomposition to characterize the same way, so this stays
// a plain order sweep — no numBlocks/ms_per_block columns here, matching
// strsv.c's own precedent.

#include <stdio.h>
#include <stdlib.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  30

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int sizes[] = { 64, 128, 256, 512, 1024, 2048, 4096 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));
    const int n = 64; // representative matrix-RHS width, matches strsm.js's OTHER_LEN

    float med_times[num_sizes];
    float gbs_vals[num_sizes];

    printf("%-10s  %-12s  %-12s\n", "order", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

    const float alpha = 1.0f;

    for (int si = 0; si < num_sizes; si++) {
        int order = sizes[si];
        int lda = order, ldb = order;

        float *h_A = random_float_array((size_t)order * lda, -1.0f, 1.0f);
        float *h_B = random_float_array((size_t)order * n, -1.0f, 1.0f);

        float *d_A, *d_B;
        CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)order * lda * sizeof(float)));
        CUDA_CHECK(cudaMalloc((void **)&d_B, (size_t)order * n * sizeof(float)));
        CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)order * lda * sizeof(float), cudaMemcpyHostToDevice));

        cudaEvent_t start, stop;
        CUDA_CHECK(cudaEventCreate(&start));
        CUDA_CHECK(cudaEventCreate(&stop));

        // cublasStrsm solves op(A)*X = alpha*B in place (B on input, X on
        // output). d_A is column-major — cuBLAS's native layout, so
        // FILL_MODE_LOWER + OP_N read the same op(A) wgblas's
        // "lower"/"no-transpose" reads.
        for (int i = 0; i < WARMUP_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)order * n * sizeof(float), cudaMemcpyHostToDevice));
            CUBLAS_CHECK(cublasStrsm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT,
                                      order, n, &alpha, d_A, lda, d_B, ldb));
        }
        CUDA_CHECK(cudaDeviceSynchronize());

        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            CUDA_CHECK(cudaMemcpy(d_B, h_B, (size_t)order * n * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaEventRecord(start, 0));
            CUBLAS_CHECK(cublasStrsm(handle, CUBLAS_SIDE_LEFT, CUBLAS_FILL_MODE_LOWER, CUBLAS_OP_N, CUBLAS_DIAG_NON_UNIT,
                                      order, n, &alpha, d_A, lda, d_B, ldb));
            CUDA_CHECK(cudaEventRecord(stop, 0));
            CUDA_CHECK(cudaEventSynchronize(stop));
            CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
        }

        float med = median(compute_times, BENCH_ITERS);
        // lower triangle A read + B read + B write (in place) — same coarse
        // approximation strsv.c/strsm.js use.
        float bytes = (float)((size_t)(order * (order + 1) / 2 + 2 * order * n)) * 4.0f;
        float gbs = (bytes / 1e9f) / (med / 1e3f);

        med_times[si] = med;
        gbs_vals[si]  = gbs;

        printf("%-10d  %-12.4f  %-12.4f\n", order, med, gbs);

        CUDA_CHECK(cudaEventDestroy(start));
        CUDA_CHECK(cudaEventDestroy(stop));
        cudaFree(d_A);
        cudaFree(d_B);
        free(h_A);
        free(h_B);
    }

    // write JSON results
    char *gpu_dir, *base_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,   "benchmarks/results/%s", gpu_model);
    asprintf(&base_dir,  "%s/cuda",               gpu_dir);
    asprintf(&out_dir,   "%s/strsm",              base_dir);
    asprintf(&file_path, "%s/strsm.json",         out_dir);
    mkdir("benchmarks/results", 0755);
    mkdir(gpu_dir, 0755);
    mkdir(base_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    if (!fp) { perror(file_path); return 1; }
    fprintf(fp, "[\n");
    for (int i = 0; i < num_sizes; i++) {
        fprintf(fp,
            "  { \"order\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], med_times[i], gbs_vals[i],
            i < num_sizes - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(base_dir);
    free(out_dir);
    free(file_path);

    cublasDestroy(handle);
    return 0;
}
