// Stride sweep — cscal.c is entirely incx=1 (coalesced, best case).
// Same rationale as sscal's stride.sscal.c. stride=1 itself is covered by
// cscal.c, not repeated here.

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
    // Same three magnitudes + odd-neighbour pairing as sscal's own stride sweep.
    int strides[] = { 4, 5, 32, 33, 255, 256 };
    int num_strides = (int)(sizeof(strides) / sizeof(strides[0]));

    int rec_strides[num_ns * num_strides];
    int rec_ns[num_ns * num_strides];
    float med_times[num_ns * num_strides];
    float gbs_vals[num_ns * num_strides];
    int num_recs = 0;

    printf("%-10s  %-10s  %-12s  %-12s\n", "stride", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-10s  %-12s  %-12s\n", "----------", "----------", "------------", "------------");

    cuComplex alpha = make_cuComplex(2.0f, 3.0f);

    for (int ki = 0; ki < num_strides; ki++) {
        int stride = strides[ki];
        for (int si = 0; si < num_ns; si++) {
            int n = bench_ns[si];
            if (stride > n) continue; // stride itself already exceeds n — not a meaningful case

            // Strided buffers span n*stride elements, not n — see sscal's own
            // stride sweep for why both device and host memory are checked.
            size_t free_mem, total_mem;
            CUDA_CHECK(cudaMemGetInfo(&free_mem, &total_mem));
            size_t bytes_needed = 1ull * (size_t)n * (size_t)stride * sizeof(cuComplex);
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

            float *re = random_float_array(n * stride, -1.0f, 1.0f);
            float *im = random_float_array(n * stride, -1.0f, 1.0f);
            cuComplex *h_x = (cuComplex *)malloc((size_t)n * stride * sizeof(cuComplex));
            for (int i = 0; i < n * stride; i++) h_x[i] = make_cuComplex(re[i], im[i]);
            free(re);
            free(im);

            cuComplex *d_x;
            CUDA_CHECK(cudaMalloc((void **)&d_x, (size_t)n * stride * sizeof(cuComplex)));
            CUDA_CHECK(cudaMemcpy(d_x, h_x, (size_t)n * stride * sizeof(cuComplex), cudaMemcpyHostToDevice));

            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            // warm up
            for (int i = 0; i < WARMUP_ITERS; i++) {
                CUBLAS_CHECK(cublasCscal(handle, n, &alpha, d_x, stride));
            }
            CUDA_CHECK(cudaDeviceSynchronize());

            float compute_times[BENCH_ITERS];
            for (int i = 0; i < BENCH_ITERS; i++) {
                CUDA_CHECK(cudaEventRecord(start, 0));
                CUBLAS_CHECK(cublasCscal(handle, n, &alpha, d_x, stride));
                CUDA_CHECK(cudaEventRecord(stop, 0));
                CUDA_CHECK(cudaEventSynchronize(stop));
                CUDA_CHECK(cudaEventElapsedTime(&compute_times[i], start, stop));
            }

            float med_compute = median(compute_times, BENCH_ITERS);

            // throughput: logical elements touched, same regardless of stride
            float bytes = 2.0f * n * sizeof(cuComplex);
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

    save_results_stride(gpu_model, "cscal", "stride.cscal", rec_strides, rec_ns, med_times, gbs_vals, num_recs);

    return 0;
}
