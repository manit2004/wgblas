// ssyr: cuBLAS twin of benchmarks/ssyr/wgblas/ssyr.js.
#include "../../utils/harness.h"

static void derive(bench_params *p) { p->lda = p->n + p->pad; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F32, p->n, p->n, p->lda, FILL_RANDOM); // A
    o[1] = vector(DT_F32, (size_t)p->n * p->inc);           // x
    return 2;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha;
    CUBLAS_CHECK(cublasSsyr(device, fill_of(p->uplo), p->n, &alpha, o[1].ptr, p->inc, o[0].ptr, p->lda));
}

// One triangle of A read + written + x read
static double bytes(const bench_params *p) { return ((double)p->n * (p->n + 1) + p->n) * 4; }

static const bench_spec spec = {
    .routine = "ssyr",
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
        { .name = "stride", .axes = { AXIS(stride, STRIDES), AXIS(n, L2_SIZES) }, .derive = inc_from_stride, .fixed = { .alpha = 2.0 } },

        // Padding on A's leading dimension; same logical work.
        { .name = "lda", .axes = { AXIS(pad, PADS), AXIS(n, L2_SIZES) } },

        // Lower vs upper triangle of A.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L2_SIZES) } },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L2_SIZES) } },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
