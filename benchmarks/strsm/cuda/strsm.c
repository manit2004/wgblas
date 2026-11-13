// strsm: cuBLAS twin of benchmarks/strsm/wgblas/strsm.js.
#include "../../utils/harness.h"

// Base orders: L3_SWEEP_SIZES plus 4096, as this benchmark has always run.
static const int TRSM_SIZES[] = { 64, 128, 256, 512, 1024, 2048, 4096 };

// m = order (base) or n; A's order follows side; column-major, tight.
static void derive(bench_params *p) {
    if (!p->m) p->m = p->n;
    p->lda = strcmp(p->side, "left") == 0 ? p->m : p->n;
    p->ldb = p->m;
}

static int a_order(const bench_params *p) { return strcmp(p->side, "left") == 0 ? p->m : p->n; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F32, a_order(p), a_order(p), p->lda, FILL_TRIANGULAR); // A
    o[1] = matrix(DT_F32, p->m, p->n, p->ldb, FILL_RANDOM);                 // B
    return 2;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha;
    CUBLAS_CHECK(cublasStrsm(device, side_of(p->side), fill_of(p->uplo), op_of(p->transA), diag_of(p->diag), p->m, p->n, &alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb));
}

// Solves in place, so B is refreshed (untimed) before every call.
static void refresh_b(const bench_params *p, bench_operand *o) { (void)p; bench_refresh(&o[1]); }

// m·n·aOrder multiply-adds.
static double flops(const bench_params *p) { return (double)p->m * p->n * a_order(p); }

// The triangle of A read + B read and written in place — coarse, as
// strsv.c counts it, without internal scratch traffic.
static double bytes(const bench_params *p) {
    return ((double)a_order(p) * (a_order(p) + 1) / 2 + 2.0 * p->m * p->n) * 4;
}

// alpha = 0 only zeroes B.
static double alpha_flops(const bench_params *p) { return p->alpha == 0 ? 0 : flops(p); }
static double alpha_bytes(const bench_params *p) { return p->alpha == 0 ? (double)p->m * p->n * 4 : bytes(p); }

static void pad_lda(bench_params *p) { p->lda += p->pad; }
static void pad_ldb(bench_params *p) { p->ldb += p->pad; }

static const bench_spec spec = {
    .routine = "strsm",
    .warmup = 5,
    .iters = 50,
    .defaults = { .side = "left", .uplo = "lower", .transA = "no-transpose", .diag = "non-unit", .alpha = 1.0 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .flops = flops,
    .sweeps = {
        // Column-major (cuBLAS's native layout), a 64-column right-hand side.
        { .name = "base", .axes = { AXIS_AS("order", m, TRSM_SIZES) }, .fixed = { .n = 64 }, .before_each = refresh_b, .iters = 30 },

        // alpha values, including 0 (no solve) and 1 (no pre-scale).
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L3_SWEEP_SIZES) }, .before_each = refresh_b, .flops = alpha_flops, .bytes = alpha_bytes },

        // Unit vs non-unit diagonal.
        { .name = "diag", .axes = { AXIS(diag, DIAGS), AXIS(n, L3_SWEEP_SIZES) }, .before_each = refresh_b },

        // Padding on A's leading dimension.
        { .name = "lda", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_lda, .before_each = refresh_b },

        // Padding on B's leading dimension.
        { .name = "ldb", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldb, .before_each = refresh_b },

        // A on the left or the right.
        { .name = "side", .axes = { AXIS(side, SIDES), AXIS(n, L3_SWEEP_SIZES) }, .before_each = refresh_b },

        // op(A) = A vs Aᵀ.
        { .name = "transA", .axes = { AXIS(transA, TRANSES), AXIS(n, L3_SWEEP_SIZES) }, .before_each = refresh_b },

        // Lower vs upper triangle of A.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L3_SWEEP_SIZES) }, .before_each = refresh_b },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
