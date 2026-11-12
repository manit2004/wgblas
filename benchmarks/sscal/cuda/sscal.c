// sscal: cuBLAS twin of benchmarks/sscal/wgblas/sscal.js.
#include "../../utils/harness.h"

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = vector(DT_F32, (size_t)p->n * p->inc); // x
    return 1;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha;
    CUBLAS_CHECK(cublasSscal(device, p->n, &alpha, o[0].ptr, p->inc));
}

// x read + written in place
static double bytes(const bench_params *p) { return 2.0 * p->n * 4; }

static const bench_spec spec = {
    .routine = "sscal",
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
