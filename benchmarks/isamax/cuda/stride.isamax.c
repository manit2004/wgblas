// Stride sweep — isamax.c is entirely incx=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever a Level 1 op runs on a
// row/column of a larger matrix (incx = lda), so this characterizes that
// cost separately rather than folding it into the main sweep and
// multiplying its already-large runtime by every stride value.
//
// 4/32/256 are one representative point from each distinct regime of the
// coalescing-breakdown curve (steep 1/stride falloff, transition, plateau);
// 5/33/255 pair each of those with an odd neighbour, isolating the cost of
// misalignment from the cost of stride magnitude.
//
// stride=1 itself is covered by isamax.c, not repeated here.

#include <stdio.h>
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
    // Three magnitudes, each paired with an odd neighbour: the gap inside a pair is
    // misalignment alone (~0% at 4, ~9% by 32). 255 not 257, to fit where 256 fits.
    int strides[] = { 4, 5, 32, 33, 255, 256 };
    int num_strides = (int)(sizeof(strides) / sizeof(strides[0]));

    int rec_strides[num_ns * num_strides];
    int rec_ns[num_ns * num_strides];
    float med_times[num_ns * num_strides];
    float gbs_vals[num_ns * num_strides];
    int num_recs = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "stride", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

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
            size_t bytes_needed = 1ull * (size_t)n * (size_t)stride * sizeof(float);
            // Host RAM, not device memory, is the tighter limit here: this configuration
            // stages 1 buffer(s) of comparable size in RAM before uploading. Passing the
            // device check and then being OOM-killed mid-run looks like a hang rather
            // than a skip, so check both.
            size_t host_needed = bytes_needed * 1;
            size_t host_avail = host_bytes_available();
            if (host_avail && host_needed > host_avail * 8 / 10) {
                printf("  (skipped n=%d: needs %.1f GB host RAM, %.1f GB available)\n",
                       n, host_needed / 1e9, host_avail / 1e9);
                continue;
            }
            if (bytes_needed > free_mem * 9 / 10) { // leave 10% headroom
                printf("  (skipped stride=%d, n=%d: buffers would exceed available device memory)\n", stride, n);
                continue;
            }

            float *h_x = random_float_array(n * stride, -1.0f, 1.0f);

            float *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * stride * sizeof(float)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * stride * sizeof(float), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            // warm up
            int imax_result;
            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasIsamax(handle, n, d_x, stride, &imax_result));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasIsamax(handle, n, d_x, stride, &imax_result));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);

            // throughput: logical elements touched, same regardless of stride
            float bytes = (float)n * sizeof(float);
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
            free(h_x);
        }
    }

    cublasDestroy(handle);

    save_results_stride(gpu_model, "isamax", "stride.isamax", rec_strides, rec_ns, med_times, gbs_vals, num_recs);

    return 0;
}
