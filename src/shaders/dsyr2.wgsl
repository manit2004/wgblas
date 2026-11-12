// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
// f64 emulation of ssyr2 (symmetric rank-2 update). x, y, A, and alpha are
// each split into an f32 (hi, lo) pair; WGSL has no f64 type. Only the
// triangle specified by uplo is referenced/updated. One workgroup per row
// of A (grid-stride over rows); within a row, ddMulProtected/ddAddProtected
// each carry a workgroupBarrier(), so the column loop uses the same
// uniform-main + ragged-tail split dsyr.wgsl uses over its *stored* range,
// rather than ssyr2.wgsl's 4-way ILP unroll.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read>       yHi: array<f32>;
@group(0) @binding(3) var<storage, read>       yLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> AHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> ALo: array<f32>;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
  uplo:    u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dsyr2_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);

  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let ix = row * params.incx;
    let iy = row * params.incy;
    let xi = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let yi = ddMulProtected(alpha, DD(yHi[iy], yLo[iy]), lid.x);
    let row_base = row * params.lda;

    // Stored-triangle column range for this row: lower [0,row], upper [row,n).
    var colStart: u32;
    var colEnd: u32;
    if params.uplo == 1u {
      colStart = row;
      colEnd = params.n;
    } else {
      colStart = 0u;
      colEnd = row + 1u;
    }

    // Range length varies per row, but every thread in the workgroup runs
    // the SAME row at the same time (the outer loop is shared), so the
    // main/tail split computed from colStart/colEnd is already uniform
    // across threads for this row — just not the same across different rows.
    let rangeLen = colEnd - colStart;
    let range_floor = colStart + (rangeLen / WGS) * WGS;
    let mainIters = (range_floor - colStart) / WGS;
    let hasTail = select(0u, 1u, range_floor < colEnd);

    // Four column strides per batched op (f64/utils/batch.wgsl): lane l
    // takes iteration 4g + l — 10 barriers per four elements, not one.
    for (var g = 0u; g < mainIters / 4u; g++) {
      let col = colStart + lid.x + g * 4u * WGS;
      let idx = row_base + col;
      let jx = col * params.incx;
      let jy = col * params.incy;
      let sx = WGS * params.incx;
      let sy = WGS * params.incy;
      let yv = dd4Of(
        DD(yHi[jy], yLo[jy]),
        DD(yHi[jy + sy], yLo[jy + sy]),
        DD(yHi[jy + 2u * sy], yLo[jy + 2u * sy]),
        DD(yHi[jy + 3u * sy], yLo[jy + 3u * sy]),
      );
      let xv = dd4Of(
        DD(xHi[jx], xLo[jx]),
        DD(xHi[jx + sx], xLo[jx + sx]),
        DD(xHi[jx + 2u * sx], xLo[jx + 2u * sx]),
        DD(xHi[jx + 3u * sx], xLo[jx + 3u * sx]),
      );
      let av = dd4Of(
        DD(AHi[idx], ALo[idx]),
        DD(AHi[idx + WGS], ALo[idx + WGS]),
        DD(AHi[idx + 2u * WGS], ALo[idx + 2u * WGS]),
        DD(AHi[idx + 3u * WGS], ALo[idx + 3u * WGS]),
      );
      let prod1 = ddMul4Protected(dd4Splat(xi), yv, lid.x);
      let prod2 = ddMul4Protected(dd4Splat(yi), xv, lid.x);
      let result = ddAdd4Protected(ddAdd4Protected(prod1, prod2, lid.x), av, lid.x);
      AHi[idx] = result.hi.x;
      ALo[idx] = result.lo.x;
      AHi[idx + WGS] = result.hi.y;
      ALo[idx + WGS] = result.lo.y;
      AHi[idx + 2u * WGS] = result.hi.z;
      ALo[idx + 2u * WGS] = result.lo.z;
      AHi[idx + 3u * WGS] = result.hi.w;
      ALo[idx + 3u * WGS] = result.lo.w;
    }

    // The last mainIters % 4 full iterations, one at a time.
    for (var iter = mainIters / 4u * 4u; iter < mainIters; iter++) {
      let col = colStart + lid.x + iter * WGS;
      let idx = row_base + col;
      let jc_x = col * params.incx;
      let jc_y = col * params.incy;
      let prod1 = ddMulProtected(xi, DD(yHi[jc_y], yLo[jc_y]), lid.x);
      let prod2 = ddMulProtected(yi, DD(xHi[jc_x], xLo[jc_x]), lid.x);
      let sum1 = ddAddProtected(prod1, prod2, lid.x);
      let result = ddAddProtected(sum1, DD(AHi[idx], ALo[idx]), lid.x);
      AHi[idx] = result.hi;
      ALo[idx] = result.lo;
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = range_floor + lid.x;
      let valid = col < colEnd;
      let idx = select(0u, row_base + col, valid);
      let jc_x = select(0u, col * params.incx, valid);
      let jc_y = select(0u, col * params.incy, valid);
      let prod1 = ddMulProtected(xi, DD(yHi[jc_y], yLo[jc_y]), lid.x);
      let prod2 = ddMulProtected(yi, DD(xHi[jc_x], xLo[jc_x]), lid.x);
      let sum1 = ddAddProtected(prod1, prod2, lid.x);
      let result = ddAddProtected(sum1, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
