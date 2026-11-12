// cscal: cuBLAS twin of benchmarks/cscal/wgblas/cscal.js.
#include "../../utils/harness.h"

static const cuComplex ALPHAS_C[] = { { 0, 0 }, { 1, 0 }, { 2.5f, -3.75f }, { 0, 1 }, { 1e-38f, 0 } };

// %g%+gi label, matching the wgblas side's alpha keys.
static void label(const bench_params *p, char *buf, size_t len) {
    snprintf(buf, len, "%g%+gi", p->calpha.x, p->calpha.y);
}

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = vector(DT_C32, (size_t)p->n * p->inc); // x
    return 1;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasCscal(device, p->n, &p->calpha, o[0].ptr, p->inc));
}

// x read + written in place, 8 B each (re + im)
static double bytes(const bench_params *p) { return 2.0 * p->n * 8; }

static const bench_spec spec = {
    .routine = "cscal",
    .warmup = 5,
    .iters = 100,
    .defaults = { .calpha = { 2.0f, 3.0f }, .inc = 1 },
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

        // Values a kernel could special-case: 0, 1, general, imaginary, denormal.
        {
            .name = "alpha",
            .axes = { AXIS_AS("alpha", calpha, ALPHAS_C), AXIS(n, L1_SWEEP_SIZES) },
            .format = { { "alpha", label } },
        },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
