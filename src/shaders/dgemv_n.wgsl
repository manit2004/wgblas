// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_n (matrix-vector product, no transpose). A, x, y,
// alpha, and beta are each split into an f32 (hi, lo) pair; WGSL has no f64
// type. Same one-workgroup-per-output-row shape as sgemv_n.wgsl (grid-stride
// over rows), but the per-row dot product is reduced via a full
// within-workgroup DD tree reduction — the same reduction ddot.wgsl uses to
// combine 64 lanes down to one. The column loop runs four strides per
// batched op (ddMul4Protected/ddAdd4Protected), since the protected ops'
// barriers, not memory, bound it. Since each row is handled by exactly one
// workgroup, no separate cross-workgroup reduction pass (ddot's reduce_f64)
// is needed here — the tree reduction alone finishes the row.

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
var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_n_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;

  // Column loop's trip count depends only on n and WGS, not on row — same
  // main/tail split applies uniformly to every row (see dger.wgsl).
  let n_floor   = (params.n / WGS) * WGS;
  let mainIters = n_floor / WGS;
  let hasTail   = select(0u, 1u, n_floor < params.n);

  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let row_base = row * params.lda;
    // Four column strides per batched op (f64/utils/batch.wgsl): lane l
    // takes iteration 4g + l, one barrier per four products.
    var acc4 = DD4(vec4<f32>(0.0), vec4<f32>(0.0));
    for (var g = 0u; g < mainIters / 4u; g++) {
      let j = lid.x + g * 4u * WGS;
      let ia = row_base + j;
      let ix = j * params.incx;
      let xs = WGS * params.incx;
      let a = dd4Of(
        DD(AHi[ia], ALo[ia]),
        DD(AHi[ia + WGS], ALo[ia + WGS]),
        DD(AHi[ia + 2u * WGS], ALo[ia + 2u * WGS]),
        DD(AHi[ia + 3u * WGS], ALo[ia + 3u * WGS]),
      );
      let xv = dd4Of(
        DD(xHi[ix], xLo[ix]),
        DD(xHi[ix + xs], xLo[ix + xs]),
        DD(xHi[ix + 2u * xs], xLo[ix + 2u * xs]),
        DD(xHi[ix + 3u * xs], xLo[ix + 3u * xs]),
      );
      acc4 = ddAdd4Protected(acc4, ddMul4Protected(a, xv, lid.x), lid.x);
    }
    var acc = DD(0.0, 0.0);
    // Uniform (params only), so the barriers inside stay legal; skipped
    // when there was no batch, where it would only add barriers.
    if (mainIters >= 4u) { acc = dd4Sum(acc4, lid.x); }

    // The last mainIters % 4 full iterations, one at a time.
    for (var iter = mainIters / 4u * 4u; iter < mainIters; iter++) {
      let j  = lid.x + iter * WGS;
      let ia = row_base + j;
      let ix = j * params.incx;
      let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = n_floor + lid.x;
      let valid = j < params.n;
      let ia    = select(0u, row_base + j, valid);
      let ix    = select(0u, j * params.incx, valid);
      let prod  = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
    workgroupBarrier();

    // Inactive threads combine against a throwaway partner and discard it
    // (ddAddProtected must be called unconditionally by every thread).
    for (var s = WGS / 2u; s > 0u; s >>= 1u) {
      let partner = select(lid.x, lid.x + s, lid.x < s);
      let combined = ddAddProtected(tile[lid.x], tile[partner], lid.x);
      workgroupBarrier(); // all threads must read tile[] above before any write below
      if (lid.x < s) { tile[lid.x] = combined; }
      workgroupBarrier();
    }

    // tile[0] now holds the full row dot product, visible to every lane —
    // every thread redundantly finishes the O(1) alpha/beta combine so the
    // protected ops below stay uniformly called (only the write is gated).
    let dot = tile[0];
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then — so NaN or ±Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, dot, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));
    let iy = row * params.incy;
    let yVal = DD(yHi[iy], yLo[iy]);
    let betaTimesY = ddMulProtected(beta, yVal, lid.x);
    let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
    // BLAS beta==0 semantics: y is written, not accumulated — the result
    // must not depend on y's prior value (though it is still read above).
    let result = DD(
      select(scaled.hi, withBeta.hi, isBetaNonzero),
      select(scaled.lo, withBeta.lo, isBetaNonzero),
    );

    if (lid.x == 0u) {
      yHi[iy] = result.hi;
      yLo[iy] = result.lo;
    }
    // All 64 threads must agree before the next row reuses tile[].
    workgroupBarrier();
  }
}
