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

// ±0 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like `v == 0.0` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

fn isZero4(v: vec4<f32>) -> vec4<bool> {
  return (bitcast<vec4<u32>>(v) & vec4<u32>(0x7fffffffu)) == vec4<u32>(0u);
}

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

  // Four rows per batched op (f64/utils/batch.wgsl): lane l sums rows
  // j ≡ l (mod 4) of each tile, one barrier per four products.
  var acc4 = DD4(vec4<f32>(0.0), vec4<f32>(0.0));

  let tiles = (jEnd - jStart) / WGS;
  for (var t = 0u; t < tiles; t++) {
    let base = jStart + t * WGS;
    // Cooperative load: all 64 threads fill xTile with x[base..base+WGS),
    // independent of col — safe regardless of whether this thread's column
    // is in range.
    let ix = (base + lid.x) * params.incx;
    xTile[lid.x] = DD(xHi[ix], xLo[ix]);
    workgroupBarrier();

    for (var j = 0u; j < WGS; j += 4u) {
      let ia = (base + j) * params.lda + safeCol;
      let a = dd4Of(
        DD(AHi[ia], ALo[ia]),
        DD(AHi[ia + params.lda], ALo[ia + params.lda]),
        DD(AHi[ia + 2u * params.lda], ALo[ia + 2u * params.lda]),
        DD(AHi[ia + 3u * params.lda], ALo[ia + 3u * params.lda]),
      );
      let xv = dd4Of(xTile[j], xTile[j + 1u], xTile[j + 2u], xTile[j + 3u]);
      // Reference BLAS (and stdlib) runs this transposed product column by column
      // and skips a column whose x entry is 0, so 0 · Infinity or 0 · NaN in that
      // column of A never happens: a term with x = ±0 is exactly 0 here.
      // A is zeroed where x is, so the product is 0 · 0.
      let xZero = isZero4(xv.hi) & isZero4(xv.lo);
      let aKept = DD4(select(a.hi, vec4<f32>(0.0), xZero), select(a.lo, vec4<f32>(0.0), xZero));
      acc4 = ddAdd4Protected(acc4, ddMul4Protected(aKept, xv, lid.x), lid.x);
    }
    workgroupBarrier();
  }
  var acc = dd4Sum(acc4, lid.x);

  // Remainder rows (only the last chunk, when m isn't a multiple of WGS):
  // the count is the same for every thread regardless of col, so this loop
  // is already barrier-safe without a second tiling pass.
  for (var row = jStart + tiles * WGS; row < jEnd; row++) {
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let xZero = isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]); // see the tiled loop
    let a = DD(select(AHi[ia], 0.0, xZero), select(ALo[ia], 0.0, xZero));
    let prod = ddMulProtected(a, DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  // `direct` is uniform, but the protected ops still run on both paths (a
  // barrier under a uniform branch is legal; this keeps the write the only
  // divergent part).
  if (params.direct == 1u) {
    let alpha = DD(params.alphaHi, params.alphaLo);
    let beta  = DD(params.betaHi, params.betaLo);
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then — so NaN or ±Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, acc, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));

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
