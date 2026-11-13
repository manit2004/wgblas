#pragma once
/*
 * Sizes and swept values shared by the cuBLAS benchmarks — the C
 * twin of params.mjs. Keep the two identical so wgblas and cuBLAS results
 * cover the same points (`--check` on either side verifies against the
 * committed results).
 */

/** Base-benchmark sizes: 12 element counts, 32 to 16777216. */
static const int L1_SIZES[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536,
                                262144, 1048576, 4194304, 16777216 };

/** Sizes for the parameter sweeps (alpha, c, s). */
static const int L1_SWEEP_SIZES[] = { 1024, 65536, 1048576, 16777216 };

/** Three stride magnitudes, each paired with an odd neighbour. */
static const int STRIDES[] = { 4, 5, 32, 33, 255, 256 };

/** Real alpha values: 0 and 1, two ordinary values, a denormal-producing 1e-38. */
static const double ALPHAS[] = { 0.0, 1.0, 2.5, -3.75, 1e-38 };

/** cos(pi/4) = sin(pi/4): the rotation benchmarks' 45° default for c and s. */
#define COS_PI_4 0.70710678118654752440

/** Rotation c / s sweep values; 0.70710678 is cos(pi/4). */
static const double ROT_VALUES[] = { 0.0, 0.5, 0.70710678, 1.0, -0.75 };

/** Level 2 sizes: square m = n, 32 to 4096, plus 1280. */
static const int L2_SIZES[] = { 32, 64, 128, 256, 512, 1024, 1280, 2048, 4096 };

/** Leading-dimension padding for the `lda` sweeps (lda = n + pad). */
static const int PADS[] = { 0, 1, 8, 16, 32, 48, 64, 128 };

/** Real beta values: 0 (lets a kernel skip reading y), 1, two ordinary values. */
static const double BETAS[] = { 0.0, 1.0, 2.5, -3.75 };

/** String-valued axes, recorded as JSON strings. */
static const char *const TRANSES[] = { "no-transpose", "transpose" };
static const char *const UPLOS[] = { "lower", "upper" };
static const char *const DIAGS[] = { "non-unit", "unit" };
static const char *const SIDES[] = { "left", "right" };

/** Level 3 base sizes: square n = k, 32 to 1024. */
static const int L3_SIZES[] = { 32, 64, 128, 256, 512, 1024 };

/** Level 3 parameter-sweep sizes (alpha, beta, uplo, ldb, ldc): 64 to 2048. */
static const int L3_SWEEP_SIZES[] = { 64, 128, 256, 512, 1024, 2048 };

/** Level 3 `trans` sweep sizes: the larger half, where operand reads dominate. */
static const int L3_TRANS_SIZES[] = { 256, 512, 1024, 2048 };

/** Level 3 `lda` sweep (trans × size × pad): three sizes, six pads. */
static const int L3_LDA_SIZES[] = { 512, 1024, 2048 };
static const int L3_LDA_PADS[] = { 0, 1, 8, 16, 32, 64 };
