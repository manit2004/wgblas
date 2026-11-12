// drot: cuBLAS twin of benchmarks/drot/wgblas/drot.js.
#include "../../utils/harness.h"

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = vector(DT_F64, (size_t)p->n * p->inc); // x
    o[1] = vector(DT_F64, (size_t)p->n * p->inc); // y
    return 2;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDrot(device, p->n, o[0].ptr, p->inc, o[1].ptr, p->inc, &p->c, &p->s));
}

// x, y each read + written, 8 B each (hi + lo)
static double bytes(const bench_params *p) { return 4.0 * p->n * 8; }

static const bench_spec spec = {
    .routine = "drot",
    .warmup = 5,
    .iters = 100,
    .defaults = { .c = COS_PI_4, .s = COS_PI_4, .inc = 1 },
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

        // Vary c with s pinned; no branch on c, so expect a flat row.
        { .name = "cosine", .axes = { AXIS(c, ROT_VALUES), AXIS(n, L1_SWEEP_SIZES) } },

        // Vary s with c pinned; s = 0 still runs in full, so expect a flat row.
        { .name = "sine", .axes = { AXIS(s, ROT_VALUES), AXIS(n, L1_SWEEP_SIZES) } },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
