// dtrmv_t: y = A^T * x for triangular A, double-double (Dekker) f64
// emulation of strmv_t — dtrmv's transpose path, in the kernel's row-major
// frame (dtrmv.mjs has already folded layout into uplo/trans).
// y[i] = Σ_j A[j,i] * x[j] over the stored range: j >= i for lower, j <= i
// for upper.
//
// One thread per output i (a column of A), so at each step j the 64 lanes
// of a workgroup read A[j*lda + i..i+63] — contiguous, coalesced. dtrmv.wgsl
// used one workgroup per i with lanes walking j, which strided every lane by
// lda.
//
// Rows are split into chunks along wid.y (split-K) so there are enough
// workgroups in flight to hide the protected ops' barrier latency; each
// chunk writes its share to partialHi/Lo[chunk*n + i] and
// reduce_partials_f64.wgsl sums them (alpha = 1, beta = 0). With a single
// chunk (`direct` = 1) the result goes straight to y and no second pass runs.
//
// The protected ops carry a workgroupBarrier(), so every lane makes the same
// calls: the row range depends only on the workgroup, and lanes outside a
// column's stored range (or past n) compute against an in-bounds column and
// have their term selected to 0.

@group(0) @binding(0) var<storage, read>       AHi:   array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:   array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> outHi: array<f32>; // y, or partials
@group(0) @binding(5) var<storage, read_write> outLo: array<f32>;

struct Params {
  n:         u32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  diag:      u32,  // 0 = non-unit, 1 = unit
  chunkRows: u32,
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dtrmv_t_main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let tileStart = wid.x * WGS;
  let i = tileStart + lid.x;
  let iOK = i < params.n;
  let ic = min(i, params.n - 1u); // in-bounds column for masked lanes

  // Rows this chunk covers, narrowed to what any column in the tile can use.
  let chunkStart = wid.y * params.chunkRows;
  var jStart = chunkStart;
  var jEnd = min(chunkStart + params.chunkRows, params.n);
  if (params.uplo == 0u) {
    jStart = max(jStart, tileStart);
  } else {
    jEnd = min(jEnd, tileStart + WGS);
  }
  jEnd = max(jEnd, jStart); // an empty range must not wrap below

  var acc = DD(0.0, 0.0);
  for (var j = jStart; j < jEnd; j++) {
    let inRange = select(j <= i, j >= i, params.uplo == 0u) && iOK;
    let isUnitDiag = params.diag == 1u && j == i;
    let ia = j * params.lda + ic;
    let a = DD(select(AHi[ia], 1.0, isUnitDiag), select(ALo[ia], 0.0, isUnitDiag));
    let ix = j * params.incx; // same for every lane: a broadcast read
    let prod = ddMulProtected(a, DD(xHi[ix], xLo[ix]), lid.x);
    let term = DD(select(0.0, prod.hi, inRange), select(0.0, prod.lo, inRange));
    acc = ddAddProtected(acc, term, lid.x);
  }

  if (iOK) {
    if (params.direct == 1u) {
      outHi[i * params.incy] = acc.hi;
      outLo[i * params.incy] = acc.lo;
    } else {
      outHi[wid.y * params.n + i] = acc.hi;
      outLo[wid.y * params.n + i] = acc.lo;
    }
  }
}
