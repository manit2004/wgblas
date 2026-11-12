// dsymv: cuBLAS twin of benchmarks/dsymv/wgblas/dsymv.js.
#include "../../utils/harness.h"

static const int SYMV_PADS[] = { 0, 1, 8, 32, 64, 128 }; // fewer pads than the other lda sweeps

static void derive(bench_params *p) { p->lda = p->n + p->pad; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F64, p->n, p->n, p->lda, FILL_RANDOM); // A
    o[1] = vector(DT_F64, (size_t)p->n * p->inc);           // x
    o[2] = vector(DT_F64, (size_t)p->n * p->inc);           // y
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDsymv(device, fill_of(p->uplo), p->n, &p->alpha, o[0].ptr, p->lda, o[1].ptr, p->inc, &p->beta, o[2].ptr, p->inc));
}

// One triangle of A + x read + y read + y written
static double bytes(const bench_params *p) { return ((double)(p->n * (p->n + 1) / 2) + 3.0 * p->n) * 8; }

// These sweeps count y once.
static double bytes_y_once(const bench_params *p) { return ((double)p->n * (p->n + 1) / 2 + 2.0 * p->n) * 8; }

static const bench_spec spec = {
    .routine = "dsymv",
    .warmup = 5,
    .iters = 100,
    .defaults = { .uplo = "lower", .alpha = 1.0, .inc = 1 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .sweeps = {
        // Column-major A (cuBLAS's native layout), unit stride, every size.
        { .name = "base", .axes = { AXIS(n, L2_SIZES) } },

        // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
        { .name = "stride", .axes = { AXIS(stride, STRIDES), AXIS(n, L2_SIZES) }, .derive = inc_from_stride, .fixed = { .alpha = 2.0 }, .bytes = bytes_y_once },

        // Padding on A's leading dimension; same logical work.
        { .name = "lda", .axes = { AXIS(pad, SYMV_PADS), AXIS(n, L2_SIZES) } },

        // Lower vs upper triangle of A.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L2_SIZES) }, .fixed = { .alpha = 2.0 }, .bytes = bytes_y_once },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L2_SIZES) }, .bytes = bytes_y_once },

        // beta = 0 lets a kernel skip reading y; a step at 0 is that shortcut.
        { .name = "beta", .axes = { AXIS(beta, BETAS), AXIS(n, L2_SIZES) }, .fixed = { .alpha = 2.0 }, .bytes = bytes_y_once },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
