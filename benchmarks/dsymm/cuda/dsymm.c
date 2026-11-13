// dsymm: cuBLAS twin of benchmarks/dsymm/wgblas/dsymm.js.
#include "../../utils/harness.h"

// Square m = n, column-major: A is aOrder×aOrder, B and C m×n, all tight.
static void derive(bench_params *p) {
    if (!p->m) p->m = p->n;
    p->lda = strcmp(p->side, "left") == 0 ? p->m : p->n;
    p->ldb = p->ldc = p->m;
}

static int a_order(const bench_params *p) { return strcmp(p->side, "left") == 0 ? p->m : p->n; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F64, a_order(p), a_order(p), p->lda, FILL_RANDOM); // A
    o[1] = matrix(DT_F64, p->m, p->n, p->ldb, FILL_RANDOM);             // B
    o[2] = matrix(DT_F64, p->m, p->n, p->ldc, FILL_RANDOM);             // C
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    CUBLAS_CHECK(cublasDsymm(device, side_of(p->side), fill_of(p->uplo), p->m, p->n, &p->alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb, &p->beta, o[2].ptr, p->ldc));
}

// m·n dot products of length aOrder, plus the beta·C update — as ssymm.
static double flops(const bench_params *p) { return 2.0 * p->m * p->n * a_order(p) + 2.0 * p->m * p->n; }

// Same count as the wgblas file (ssymm's, at 8 B per element).
static double bytes(const bench_params *p) { return (3.0 * a_order(p) * a_order(p) + 3.0 * p->m * p->n) * 8; }

static void pad_lda(bench_params *p) { p->lda += p->pad; }
static void pad_ldb(bench_params *p) { p->ldb += p->pad; }
static void pad_ldc(bench_params *p) { p->ldc += p->pad; }

static const bench_spec spec = {
    .routine = "dsymm",
    .warmup = 5,
    .iters = 50,
    .defaults = { .side = "left", .uplo = "lower", .alpha = 1.0 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .flops = flops,
    .sweeps = {
        // Column-major (cuBLAS's native layout), m = n.
        { .name = "base", .axes = { AXIS(n, L3_SIZES) }, .record = { "m", "n" }, .warmup = 3, .iters = 20 },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L3_SWEEP_SIZES) } },

        // beta = 0 could skip reading C; a step at 0 is that shortcut.
        { .name = "beta", .axes = { AXIS(beta, BETAS), AXIS(n, L3_SWEEP_SIZES) } },

        // A on the left or the right.
        { .name = "side", .axes = { AXIS(side, SIDES), AXIS(n, L3_SWEEP_SIZES) } },

        // Which triangle A is read from.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L3_SWEEP_SIZES) } },

        // Padding on A's leading dimension.
        { .name = "lda", .axes = { AXIS(n, L3_LDA_SIZES), AXIS(pad, L3_LDA_PADS) }, .derive = pad_lda, .record = { "pad", "n" }, .iters = 30 },

        // Padding on B's leading dimension.
        { .name = "ldb", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldb },

        // Padding on C's leading dimension: write coalescing.
        { .name = "ldc", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldc },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
