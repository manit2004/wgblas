// daxpy: cuBLAS twin of benchmarks/daxpy/wgblas/daxpy.js.
#include "../../utils/harness.h"

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = vector(DT_F64, (size_t)p->n * p->inc); // x
    o[1] = vector(DT_F64, (size_t)p->n * p->inc); // y
    return 2;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDaxpy(device, p->n, &p->alpha, o[0].ptr, p->inc, o[1].ptr, p->inc));
}

// x read + y read + y written, 8 B each (hi + lo)
static double bytes(const bench_params *p) { return 3.0 * p->n * 8; }

static const bench_spec spec = {
    .routine = "daxpy",
    .warmup = 5,
    .iters = 100,
    .defaults = { .alpha = 2.0, .inc = 1 },
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .sweeps = {
        // Unit stride (coalesced, best case) at every size.
        { .name = "base", .axes = { AXIS(n, L1_SIZES) } },

        // Non-unit stride, as when the op runs on a matrix row/column (inc = lda).
        // 4/32/256 sample each coalescing regime; 5/33/255 isolate misalignment.
        {
            .name = "stride",
            .axes = { AXIS(stride, STRIDES), AXIS(n, L1_SIZES) },
            .skip = stride_exceeds_n, // not meaningful
            .derive = inc_from_stride,
        },

        // No branch on alpha in the kernel, so expect a flat row.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L1_SWEEP_SIZES) } },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
