// Stride sweep — srot.c is entirely incx=incy=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever a Level 1 op runs on a
// row/column of a larger matrix (incx = lda), so this characterizes that
// cost separately rather than folding it into the main sweep and
// multiplying its already-large runtime by every stride value.
//
// {4, 32, 256} are one representative point from each distinct regime of
// the coalescing-breakdown curve (steep 1/stride falloff, transition,
// plateau) — stride=1 itself is covered by srot.c, not repeated here.

#include <stdio.h>
#include <math.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    char gpu_model[256];
    get_gpu_model(gpu_model, sizeof(gpu_model));

    cublasHandle_t handle;
    CUBLAS_CHECK(cublasCreate(&handle));

    int bench_ns[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216 };
    int num_ns = (int)(sizeof(bench_ns) / sizeof(bench_ns[0]));
    int strides[] = { 4, 32, 256 };
    int num_strides = (int)(sizeof(strides) / sizeof(strides[0]));

    int rec_strides[num_ns * num_strides];
    int rec_ns[num_ns * num_strides];
    float med_times[num_ns * num_strides];
    float gbs_vals[num_ns * num_strides];
    int num_recs = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "stride", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    // 45° rotation
    float c = (float)cos(M_PI / 4.0);
    float s = (float)sin(M_PI / 4.0);

    for (int ki = 0; ki < num_strides; ki++) {
        int stride = strides[ki];
        for (int si = 0; si < num_ns; si++) {
            int n = bench_ns[si];
            if (stride > n) continue; // stride itself already exceeds n — not a meaningful case

            // Strided buffers span n*stride elements, not n — guard against
            // asking for more than the device actually has (CUDA has no
            // fixed per-binding cap like WebGPU's maxStorageBufferBindingSize,
            // so check against actual free device memory instead).
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = 2ull * (size_t)n * (size_t)stride * sizeof(float);
            if (bytes_needed > free_mem * 9 / 10) { // leave 10% headroom
                printf("  (skipped stride=%d, n=%d: buffers would exceed available device memory)\n", stride, n);
                continue;
            }

            float *h_x = random_float_array(n * stride, -1.0f, 1.0f);
            float *h_y = random_float_array(n * stride, -1.0f, 1.0f);

            float *d_x;
            float *d_y;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * stride * sizeof(float)));
            CUDA_CHECK(cudaMalloc((void **)&d_y, (size_t)n * stride * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * stride * sizeof(float), cudaMemcpyHostToDevice));
            CUDA_CHECK(cudaMemcpy(d_y, h_y, (size_t)n * stride * sizeof(float), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            // warm up
            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasSrot(handle, n, d_x, stride, d_y, stride, &c, &s));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasSrot(handle, n, d_x, stride, d_y, stride, &c, &s));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);

            // throughput: logical elements touched, same regardless of stride
            float bytes = 4.0f * n * sizeof(float);
            float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

            printf("%-10d  %-10d  %-12.4f  %-12.4f\n", stride, n, med_compute, compute_gbs);
            rec_strides[num_recs] = stride;
            rec_ns[num_recs] = n;
            med_times[num_recs] = med_compute;
            gbs_vals[num_recs] = compute_gbs;
            num_recs++;

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
            cudaFree(d_x);
            cudaFree(d_y);
            free(h_x);
            free(h_y);
        }
    }

    cublasDestroy(handle);

    save_results_stride(gpu_model, "srot", "stride.srot", rec_strides, rec_ns, med_times, gbs_vals, num_recs);

    return 0;
}
