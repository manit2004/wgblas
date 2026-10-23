// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_t (matrix-vector product, transposed). A, x, y, alpha,
// and beta are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
// Same one-thread-per-output-column shape as sgemv_t.wgsl, tiling over x
// (length m) via shared memory, and the same split-K: rows are split into
// chunks along wid.y, each chunk writing its share to
// partialHi/Lo[chunk*n + col] for reduce_partials_f64.wgsl to sum and scale
// by alpha/beta. With one thread per output, n=4096 is only 64 workgroups —
// too few to hide the protected ops' barrier latency. A single chunk
// (`direct` = 1) skips the second pass and writes y here instead.
//
// Because ddMulProtected/ddAddProtected each carry a workgroupBarrier(),
// every thread in the workgroup — including ones whose column is out of
// range (n not a multiple of WGS) — must call them the same number of
// times: unlike sgemv_t.wgsl's early return for `col >= n`, out-of-range
// threads here compute against a clamped dummy column unconditionally and
// simply never write their result (same technique dger.wgsl/ddot.wgsl use
// for their ragged tails). The chunk's row range depends only on wid.y, so
// the loop bounds are workgroup-uniform.

@group(0) @binding(0) var<storage, read>       AHi:   array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:   array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> outHi: array<f32>; // y, or partials
@group(0) @binding(5) var<storage, read_write> outLo: array<f32>;

struct Params {
  m:         u32,
  n:         u32,
  alphaHi:   f32,
  alphaLo:   f32,
  betaHi:    f32,
  betaLo:    f32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  chunkRows: u32,  // a multiple of WGS
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> xTile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_t_main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let col      = wid.x * WGS + lid.x;
  let colValid = col < params.n;
  // Clamp so out-of-range threads still index safely — their contribution
  // is computed but never written back.
  let safeCol  = select(0u, col, colValid);

  let jStart = wid.y * params.chunkRows;
  let jEnd   = min(jStart + params.chunkRows, params.m);

  var acc = DD(0.0, 0.0);

  let tiles = (jEnd - jStart) / WGS;
  for (var t = 0u; t < tiles; t++) {
    let base = jStart + t * WGS;
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

  // Remainder rows (only the last chunk, when m isn't a multiple of WGS):
  // the count is the same for every thread regardless of col, so this loop
  // is already barrier-safe without a second tiling pass.
  for (var row = jStart + tiles * WGS; row < jEnd; row++) {
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  // `direct` is uniform, but the protected ops still run on both paths (a
  // barrier under a uniform branch is legal; this keeps the write the only
  // divergent part).
  if (params.direct == 1u) {
    let alpha = DD(params.alphaHi, params.alphaLo);
    let beta  = DD(params.betaHi, params.betaLo);
    let scaled = ddMulProtected(alpha, acc, lid.x);

    let iy = safeCol * params.incy;
    let yVal = DD(outHi[iy], outLo[iy]);
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
      outHi[iy] = result.hi;
      outLo[iy] = result.lo;
    }
  } else if (colValid) {
    outHi[wid.y * params.n + col] = acc.hi;
    outLo[wid.y * params.n + col] = acc.lo;
  }
}
