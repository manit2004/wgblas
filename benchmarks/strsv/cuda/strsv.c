// strsv: cuBLAS twin of benchmarks/strsv/wgblas/strsv.js.
#include "../../utils/harness.h"

static const int TRSV_SIZES[] = { 32, 64, 128, 256, 512, 1024, 2048, 4096 }; // base: no 1280

static void derive(bench_params *p) { p->lda = p->n + p->pad; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F32, p->n, p->n, p->lda, FILL_TRIANGULAR); // A
    o[1] = vector(DT_F32, (size_t)p->n * p->inc);               // x, in place
    return 2;
}

// In place: a fresh x (untimed) before every call.
static void refresh_x(const bench_params *p, bench_operand *o) {
    (void)p;
    bench_refresh(&o[1]);
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasStrsv(device, fill_of(p->uplo), op_of(p->trans), diag_of(p->diag), p->n, o[0].ptr, p->lda, o[1].ptr, p->inc));
}

// One triangle of A + x read + x written
static double bytes(const bench_params *p) { return ((double)p->n * (p->n + 1) / 2 + 2.0 * p->n) * 4; }

static const bench_spec spec = {
    .routine = "strsv",
    .warmup = 5,
    .iters = 100,
    .defaults = { .uplo = "lower", .trans = "no-transpose", .diag = "non-unit", .inc = 1 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .sweeps = {
        // Column-major A (cuBLAS's native layout), unit stride.
        { .name = "base", .axes = { AXIS(n, TRSV_SIZES) }, .before_each = refresh_x },

        // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
        { .name = "stride", .axes = { AXIS(stride, STRIDES), AXIS(n, L2_SIZES) }, .derive = inc_from_stride, .before_each = refresh_x },

        // Padding on A's leading dimension; same logical work.
        { .name = "lda", .axes = { AXIS(pad, PADS), AXIS(n, L2_SIZES) }, .before_each = refresh_x },

        // op(A) = A vs Aᵀ.
        { .name = "trans", .axes = { AXIS(trans, TRANSES), AXIS(n, L2_SIZES) }, .before_each = refresh_x },

        // Lower vs upper triangle of A.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L2_SIZES) }, .before_each = refresh_x },

        // Non-unit vs unit diagonal.
        { .name = "diag", .axes = { AXIS(diag, DIAGS), AXIS(n, L2_SIZES) }, .before_each = refresh_x },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
