// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_t (matrix-vector product, transposed). A, x, y, alpha,
// and beta are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
// Same one-thread-per-output-column shape as sgemv_t.wgsl, tiling over x
// (length m) via shared memory. Because ddMulProtected/ddAddProtected each
// carry a workgroupBarrier(), every thread in the workgroup — including ones
// whose column is out of range (n not a multiple of WGS) — must call them
// the same number of times: unlike sgemv_t.wgsl's `if (col < n)` guard
// around the whole accumulation, out-of-range threads here compute against
// a clamped dummy column unconditionally and simply never write their
// result (same technique dger.wgsl/ddot.wgsl use for their ragged tails).

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read>       xHi: array<f32>;
@group(0) @binding(3) var<storage, read>       xLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> yLo: array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> xTile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_t_main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
) {
  let col      = gid.x;
  let colValid = col < params.n;
  // Clamp so out-of-range threads still index safely — their contribution
  // is computed but never written back.
  let safeCol  = select(0u, col, colValid);

  var acc = DD(0.0, 0.0);

  let m_floor   = (params.m / WGS) * WGS;
  let mainIters = m_floor / WGS;

  for (var iter = 0u; iter < mainIters; iter++) {
    let base = iter * WGS;
    // Cooperative load: all 64 threads fill xTile with x[base..base+WGS),
    // independent of col — safe regardless of whether this thread's column
    // is in range.
    let ix = (base + lid.x) * params.incx;
    xTile[lid.x] = DD(xHi[ix], xLo[ix]);
    workgroupBarrier();

    for (var j = 0u; j < WGS; j++) {
      let ia = (base + j) * params.lda + safeCol;
      let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), xTile[j], lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }
    workgroupBarrier();
  }

  // Remainder rows (m not a multiple of WGS): the count is the same for
  // every thread regardless of col, so this loop is already barrier-safe
  // without needing a second tiling pass.
  let remCount = params.m - m_floor;
  for (var k = 0u; k < remCount; k++) {
    let row = m_floor + k;
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let scaled = ddMulProtected(alpha, acc, lid.x);

  let iy = safeCol * params.incy;
  let yVal = DD(yHi[iy], yLo[iy]);
  let betaTimesY = ddMulProtected(beta, yVal, lid.x);
  let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;
  // BLAS beta==0 semantics: y is written, not accumulated — the result
  // must not depend on y's prior value (though it is still read above).
  let result = DD(
    select(scaled.hi, withBeta.hi, isBetaNonzero),
    select(scaled.lo, withBeta.lo, isBetaNonzero),
  );

  if (colValid) {
    yHi[iy] = result.hi;
    yLo[iy] = result.lo;
  }
}
