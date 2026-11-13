// sgemm: cuBLAS twin of benchmarks/sgemm/wgblas/sgemm.js.
// The ldb and trans sweeps run at L3_SIZES with 3/20 iterations, as
// sgemm.js's do; the rest at L3_SWEEP_SIZES.
#include "../../utils/harness.h"

// Square m = n = k, column-major, tight: A is m×k as stored (k×m when
// transposed), B k×n (n×k), C m×n.
static void derive(bench_params *p) {
    p->m = p->k = p->n;
    p->lda = strcmp(p->transA, "no-transpose") == 0 ? p->m : p->k;
    p->ldb = strcmp(p->transB, "no-transpose") == 0 ? p->k : p->n;
    p->ldc = p->m;
}

static int operands(const bench_params *p, bench_operand *o) {
    bool a_no = strcmp(p->transA, "no-transpose") == 0, b_no = strcmp(p->transB, "no-transpose") == 0;
    o[0] = matrix(DT_F32, a_no ? p->m : p->k, a_no ? p->k : p->m, p->lda, FILL_RANDOM); // A
    o[1] = matrix(DT_F32, b_no ? p->k : p->n, b_no ? p->n : p->k, p->ldb, FILL_RANDOM); // B
    o[2] = matrix(DT_F32, p->m, p->n, p->ldc, FILL_RANDOM);                               // C
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha, beta = (float)p->beta;
    CUBLAS_CHECK(cublasSgemm(device, op_of(p->transA), op_of(p->transB), p->m, p->n, p->k, &alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb, &beta, o[2].ptr, p->ldc));
}

// 2·m·n·k multiply-adds, plus 2·m·n for the alpha/beta step.
static double flops(const bench_params *p) { return 2.0 * p->m * p->n * p->k + 2.0 * p->m * p->n; }

// A read + B read + C read + C write
static double bytes(const bench_params *p) { return ((double)p->m * p->k + (double)p->k * p->n + 2.0 * p->m * p->n) * 4; }

static void pad_ldb(bench_params *p) { p->ldb += p->pad; }
static void pad_ldc(bench_params *p) { p->ldc += p->pad; }

static const bench_spec spec = {
    .routine = "sgemm",
    .warmup = 5,
    .iters = 50,
    .defaults = { .transA = "no-transpose", .transB = "no-transpose", .alpha = 1.0 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .flops = flops,
    .sweeps = {
        // Column-major (cuBLAS's native layout), m = n = k.
        { .name = "base", .axes = { AXIS(n, L3_SIZES) }, .record = { "m", "n", "k" }, .warmup = 3, .iters = 20 },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L3_SWEEP_SIZES) } },

        // beta = 0 could skip reading C; a step at 0 is that shortcut.
        { .name = "beta", .axes = { AXIS(beta, BETAS), AXIS(n, L3_SWEEP_SIZES) } },

        // Padding on B's leading dimension, both ways of transB.
        { .name = "ldb", .axes = { AXIS(transB, TRANSES), AXIS(pad, L3_LDA_PADS), AXIS(n, L3_SIZES) }, .derive = pad_ldb, .warmup = 3, .iters = 20 },

        // Padding on C's leading dimension: write coalescing.
        { .name = "ldc", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldc },

        // All four transA × transB combinations.
        { .name = "trans", .axes = { AXIS(transA, TRANSES), AXIS(transB, TRANSES), AXIS(n, L3_SIZES) }, .warmup = 3, .iters = 20 },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
