// strmm: cuBLAS twin of benchmarks/strmm/wgblas/strmm.js. cuBLAS's strmm
// takes a separate output (C := alpha·op(A)·B) and runs in place when C is
// B. The base run is in place — BLAS's own B := alpha·op(A)·B, the
// operation wgblas performs — and the sweeps write a separate C, as these
// benchmarks always have. cuBLAS takes a different path for each.
#include "../../utils/harness.h"

// Square m = n, column-major: A is aOrder×aOrder, B and C m×n, all tight.
static void derive(bench_params *p) {
    if (!p->m) p->m = p->n;
    p->lda = strcmp(p->side, "left") == 0 ? p->m : p->n;
    p->ldb = p->ldc = p->m;
}

static int a_order(const bench_params *p) { return strcmp(p->side, "left") == 0 ? p->m : p->n; }

static int operands(const bench_params *p, bench_operand *o) {
    o[0] = matrix(DT_F32, a_order(p), a_order(p), p->lda, FILL_TRIANGULAR); // A
    o[1] = matrix(DT_F32, p->m, p->n, p->ldb, FILL_RANDOM);                 // B
    o[2] = matrix(DT_F32, p->m, p->n, p->ldc, FILL_RANDOM);                 // C
    return 3;
}

static void call(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha;
    CUBLAS_CHECK(cublasStrmm(device, side_of(p->side), fill_of(p->uplo), op_of(p->transA), diag_of(p->diag), p->m, p->n, &alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb, o[2].ptr, p->ldc));
}

// In place: A and B only, B is also the output.
static int operands_in_place(const bench_params *p, bench_operand *o) { return operands(p, o) - 1; }

static void call_in_place(cublasHandle_t device, const bench_params *p, bench_operand *o) {
    float alpha = (float)p->alpha;
    CUBLAS_CHECK(cublasStrmm(device, side_of(p->side), fill_of(p->uplo), op_of(p->transA), diag_of(p->diag), p->m, p->n, &alpha, o[0].ptr, p->lda, o[1].ptr, p->ldb, o[1].ptr, p->ldb));
}

// Same counts as the wgblas file: gemm-shaped 2·m·n·aOrder multiply-adds
// plus m·n for the alpha scale.
static double flops(const bench_params *p) { return 2.0 * p->m * p->n * a_order(p) + (double)p->m * p->n; }

static double bytes(const bench_params *p) { return (3.0 * a_order(p) * a_order(p) + 5.0 * p->m * p->n) * 4; }

static void pad_lda(bench_params *p) { p->lda += p->pad; }
static void pad_ldb(bench_params *p) { p->ldb += p->pad; }

static const bench_spec spec = {
    .routine = "strmm",
    .warmup = 5,
    .iters = 50,
    .defaults = { .side = "left", .uplo = "lower", .transA = "no-transpose", .diag = "non-unit", .alpha = 1.0 },
    .derive = derive,
    .operands = operands,
    .call = call,
    .bytes = bytes,
    .flops = flops,
    .sweeps = {
        // Column-major (cuBLAS's native layout), m = n.
        { .name = "base", .axes = { AXIS(n, L3_SIZES) }, .record = { "m", "n" }, .warmup = 3, .iters = 20, .operands = operands_in_place, .call = call_in_place },

        // alpha values, including 0 and 1, which a kernel could special-case.
        { .name = "alpha", .axes = { AXIS(alpha, ALPHAS), AXIS(n, L3_SWEEP_SIZES) } },

        // Unit vs non-unit diagonal.
        { .name = "diag", .axes = { AXIS(diag, DIAGS), AXIS(n, L3_SWEEP_SIZES) } },

        // Padding on A's leading dimension.
        { .name = "lda", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_lda },

        // Padding on B's leading dimension.
        { .name = "ldb", .axes = { AXIS(pad, PADS), AXIS(n, L3_SWEEP_SIZES) }, .derive = pad_ldb },

        // A on the left or the right.
        { .name = "side", .axes = { AXIS(side, SIDES), AXIS(n, L3_SWEEP_SIZES) } },

        // op(A) = A vs Aᵀ.
        { .name = "transA", .axes = { AXIS(transA, TRANSES), AXIS(n, L3_SWEEP_SIZES) } },

        // Lower vs upper triangle of A.
        { .name = "uplo", .axes = { AXIS(uplo, UPLOS), AXIS(n, L3_SWEEP_SIZES) } },
    },
};

int main(int argc, char **argv) { return run_benchmark(argc, argv, &spec); }
