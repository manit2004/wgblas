// lda sweep — strmv.c is entirely tight lda (lda = n). See lda.strmv.js for
// the mechanism — lda only matters for transpose (no-transpose is flat,
// swept at both trans values below so that's visible in the data). This is
// a third distinct alignment pattern, not matching ssymv's or ssyr's — see
// lda.strmv.js for details.

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
    cublasOperation_t transes[] = { CUBLAS_OP_N, CUBLAS_OP_T };
    int num_trans = (int)(sizeof(transes) / sizeof(transes[0]));

    int num_recs = num_sizes * num_pads * num_trans;
    const char **rec_trans = malloc(num_recs * sizeof(char *));
    int *rec_pad = malloc(num_recs * sizeof(int));
    int *rec_n = malloc(num_recs * sizeof(int));
    float *med_times = malloc(num_recs * sizeof(float));
    float *gbs_vals = malloc(num_recs * sizeof(float));
    int ri = 0;

    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n", "trans", "pad", "n", "compute_ms", "compute_GBs");
    printf("%-14s  %-10s  %-10s  %-12s  %-12s\n", "--------------", "----------", "----------", "------------", "------------");

    for (int ti = 0; ti < num_trans; ti++) {
        cublasOperation_t trans = transes[ti];
        const char *trans_name = (trans == CUBLAS_OP_N) ? "no-transpose" : "transpose";

        for (int pi = 0; pi < num_pads; pi++) {
            int pad = pads[pi];
            for (int si = 0; si < num_sizes; si++) {
                int n = sizes[si];
                int lda = n + pad;

                float *h_A = random_float_array((size_t)n * lda, -1.0f, 1.0f);
                float *h_x = random_float_array(n, -1.0f, 1.0f);

                float *d_A, *d_x;
                CUDA_CHECK(cudaMalloc((void **)&d_A, (size_t)n * lda * sizeof(float)));
                CUDA_CHECK(cudaMalloc((void **)&d_x, n * sizeof(float)));
                CUDA_CHECK(cudaMemcpy(d_A, h_A, (size_t)n * lda * sizeof(float), cudaMemcpyHostToDevice));

                cudaEvent_t start, stop;
                CUDA_CHECK(cudaEventCreate(&start));
                CUDA_CHECK(cudaEventCreate(&stop));

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

                printf("%-14s  %-10d  %-10d  %-12.4f  %-12.4f\n", trans_name, pad, n, med, gbs);

                rec_trans[ri] = trans_name;
                rec_pad[ri] = pad;
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
    }

    // write JSON results — three-key shape (trans, pad, n).
    record_field fields[] = {
        { "trans", FIELD_STRING, rec_trans },
        { "pad", FIELD_INT, rec_pad },
        { "n", FIELD_INT, rec_n },
    };
    save_results(gpu_model, "strmv", "lda.strmv", fields, 3, med_times, gbs_vals, NULL, ri);
    free(rec_trans);
    free(rec_pad);
    free(rec_n);
    free(med_times);
    free(gbs_vals);

    CUBLAS_CHECK(cublasDestroy(handle));
    return 0;
}
