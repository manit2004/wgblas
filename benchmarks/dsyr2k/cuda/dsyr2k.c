// dsyr2k: cuBLAS twin of benchmarks/dsyr2k/wgblas/dsyr2k.js.
#include "../../utils/harness.h"

// Tight lda/ldb/ldc, column-major: A and B are n×k (k×n when transposed).
static void derive(bench_params *p) {
    if (!p->k) p->k = p->n;
    p->lda = p->ldb = strcmp(p->trans, "no-transpose") == 0 ? p->n : p->k;
    p->ldc = p->n;
}

static int operands(const bench_params *p, bench_operand *o) {
    bool no_trans = strcmp(p->trans, "no-transpose") == 0;
    int rows = no_trans ? p->n : p->k, cols = no_trans ? p->k : p->n;
    o[0] = matrix(DT_F64, rows, cols, p->lda, FILL_RANDOM); // A
    o[1] = matrix(DT_F64, rows, cols, p->ldb, FILL_RANDOM); // B
    o[2] = matrix(DT_F64, p->n, p->n, p->ldc, FILL_RANDOM); // C
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDsyr2k(device, fill_of(p->uplo), op_of(p->trans), p->n, p->k, &p->alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb, &p->beta, o[2].ptr, p->ldc));
}

// Two rank-k terms, k multiply-adds each per element of the n(n+1)/2 triangle.
static double flops(const bench_params *p) { return 2.0 * p->n * (p->n + 1.0) * p->k; }

// A + B read + the touched half of C read and written
static double bytes(const bench_params *p) { return (2.0 * p->n * p->k + (double)p->n * p->n) * 8; }

static void pad_lda_ldb(bench_params *p) { p->lda += p->pad; p->ldb += p->pad; }
static void pad_ldb(bench_params *p) { p->ldb += p->pad; }
static void pad_ldc(bench_params *p) { p->ldc += p->pad; }

static const bench_spec spec = {
    .routine = "dsyr2k",
    .warmup = 5,
    .iters = 50,
    .defaults = { .uplo = "lower", .trans = "no-transpose", .alpha = 1.0 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .flops = flops,
    .sweeps = {
        // Column-major (cuBLAS's native layout), n = k.
        { .name = "base", .axes = { AXIS(n, L3_SIZES) }, .record = { "n", "k" }, .warmup = 3, .iters = 20 },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L3_SWEEP_SIZES) } },

        // beta = 0 could skip reading C; a step at 0 is that shortcut.
        { .name = "beta", .axes = { AXIS(beta, BETAS), AXIS(n, L3_SWEEP_SIZES) } },

        // Padding on lda and ldb together, both ways of trans.
        { .name = "lda", .axes = { AXIS(trans, TRANSES), AXIS(n, L3_LDA_SIZES), AXIS(pad, L3_LDA_PADS) }, .derive = pad_lda_ldb, .record = { "trans", "pad", "n" }, .iters = 30 },

        // Padding on ldb alone.
        { .name = "ldb", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldb },

        // Padding on C's leading dimension: write coalescing.
        { .name = "ldc", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldc },

        // trans flips both operands' read direction at once.
        { .name = "trans", .axes = { AXIS(trans, TRANSES), AXIS(n, L3_TRANS_SIZES) }, .iters = 30 },

        // Which triangle: whether the heavy tiles dispatch first or last.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L3_SWEEP_SIZES) } },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
