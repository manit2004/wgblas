// dgemv: cuBLAS twin of benchmarks/dgemv/wgblas/dgemv.js.
#include "../../utils/harness.h"

static void derive(bench_params *p) {
    if (!p->m) p->m = p->n;
    p->lda = p->m + p->pad; // column-major: lda >= m
    bool no_trans = strcmp(p->trans, "no-transpose") == 0;
    p->x_len = no_trans ? p->n : p->m;
    p->y_len = no_trans ? p->m : p->n;
}

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F64, p->m, p->n, p->lda, FILL_RANDOM); // A
    o[1] = vector(DT_F64, (size_t)p->x_len * p->inc);     // x
    o[2] = vector(DT_F64, (size_t)p->y_len * p->inc);     // y
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDgemv(device, op_of(p->trans), p->m, p->n, &p->alpha, o[0].ptr, p->lda, o[1].ptr, p->inc, &p->beta, o[2].ptr, p->inc));
}

// A read + x read + y read + y written
static double bytes(const bench_params *p) { return ((double)p->m * p->n + p->x_len + 2.0 * p->y_len) * 8; }

// These sweeps count A + x + y once.
static double bytes_square(const bench_params *p) { return ((double)p->n * p->n + 2.0 * p->n) * 8; }

// The base sweep also records GFLOP/s: 2mn multiply-adds + 2m for the scaling.
static double flops(const bench_params *p) { return 2.0 * p->m * p->n + 2.0 * p->m; }

static const bench_spec spec = {
    .routine = "dgemv",
    .warmup = 5,
    .iters = 100,
    .defaults = { .trans = "no-transpose", .alpha = 1.0, .inc = 1 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .sweeps = {
        // Column-major A (cuBLAS's native layout), unit stride, every size.
        { .name = "base", .axes = { AXIS(n, L2_SIZES) }, .record = { "m", "n" }, .flops = flops },

        // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
        { .name = "stride", .axes = { AXIS(stride, STRIDES), AXIS(n, L2_SIZES) }, .derive = inc_from_stride, .record = { "stride", "m", "n" } },

        // Padding on A's leading dimension; same logical work.
        { .name = "lda", .axes = { AXIS(pad, PADS), AXIS(n, L2_SIZES) }, .fixed = { .alpha = 2.0 }, .bytes = bytes_square },

        // Every (m, n) pair both ways: transposed reads depend on aspect ratio.
        { .name = "trans", .axes = { AXIS(trans, TRANSES), AXIS(m, L2_SIZES), AXIS(n, L2_SIZES) } },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L2_SIZES) }, .bytes = bytes_square },

        // beta = 0 lets a kernel skip reading y; a step at 0 is that shortcut.
        { .name = "beta", .axes = { AXIS(beta, BETAS), AXIS(n, L2_SIZES) }, .fixed = { .alpha = 2.0 }, .bytes = bytes_square },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
