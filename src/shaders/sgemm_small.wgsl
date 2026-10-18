// sgemm_small: C = alpha * op(A) * op(B) + beta * C — small-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_large.wgsl).
// BM=BN=32, BK=8, TM=TN=2 — wins over the large tile below a 6x6=36
// workgroup grid of 64-tiles, where the large tile doesn't have enough
// workgroups to fill the GPU. Same structure as sgemm_large.wgsl (2D
// register-blocked, shared-memory-tiled), just smaller.
//
// A and B are bound twice — scalar array<f32> and array<vec4<f32>> views of
// the same GPUBuffer (see vec4ViewBinding) — so each tile load can issue
// 16-byte vector reads along op(A)/op(B)'s contiguous dimension when the
// stride allows it (stride % 4 == 0 keeps every row base 16-byte aligned).
// NUM_THREADS (256) exceeds some small-tile load shapes, so the vectorized
// paths whose lane count doesn't tile exactly guard their As/Bs stores.
//
// col mapped to gid.x for coalesced B/C access (row-major: col contiguous).

const BM: u32 = 32u;
const BN: u32 = 32u;
const BK: u32 = 8u;
const TM: u32 = 2u;
const TN: u32 = 2u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 256
const STRIDE_A: u32 = NUM_THREADS / BK;
const STRIDE_B: u32 = NUM_THREADS / BN;

@group(0) @binding(0) var<storage, read>       A:  array<f32>;
@group(0) @binding(1) var<storage, read>       A4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       B:  array<f32>;
@group(0) @binding(3) var<storage, read>       B4: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> C:  array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
  useVecA: u32, // 1 = A's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = B's vec4 view covers every in-bounds element
  uplo:    u32, // 0 = full C; gemmtr masks: 1 = lower (col <= row), 2 = upper (col >= row)
  offA:    u32, // element offsets into A/B/C — strsm addresses sub-blocks in place
  offB:    u32, // (vec4 paths need offset % 4 == 0, checked host-side)
  offC:    u32,
  kTri:    u32, // strmm: 0 = dense; 1/2 = op(A) lower/upper, 3/4 = op(B) lower/upper
}

@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  // gemmtr (sgemmtr/ssyrk/ssyr2k): a tile entirely outside the requested
  // triangle writes nothing, so skip it outright — about half the grid. The
  // test depends only on the workgroup id and a uniform, so the early exit
  // is uniform and comes before any barrier.
  if (params.uplo == 1u && blockCol > blockRow + BM - 1u) { return; }
  if (params.uplo == 2u && blockCol + BN - 1u < blockRow) { return; }
  let threadCol = lid.x;
  let threadRow = lid.y;

  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  // strmm: one operand is triangular (its other half zero-filled), so only
  // a band of k reaches this tile — the rest multiplies zeros. Lower op(A)
  // rows stop at k <= row, upper start at k >= row; op(B) likewise by
  // column. Uniform (workgroup id + params), so the barriers stay legal.
  var kLo = 0u;
  var kHi = params.k;
  if (params.kTri == 1u) { kHi = min(kHi, blockRow + BM); }
  if (params.kTri == 2u) { kLo = blockRow; }
  if (params.kTri == 3u) { kLo = blockCol; }
  if (params.kTri == 4u) { kHi = min(kHi, blockCol + BN); }
  let tEnd = (kHi + BK - 1u) / BK;
  for (var t = kLo / BK; t < tEnd; t++) {
    // ── Load the BM×BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) ──
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // spans BM/4×(BK/4) several times over — guard the store.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      if (r4 < BM) {
        let gRow = blockRow + r4;
        let gCol = t * BK + c4 * 4u;
        var v = A4[(params.offA + gRow * params.lda + gCol) / 4u];
        let rowOK = gRow < params.m;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.k);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.k);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.k);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.k);
        As[r4 * BK + c4 * 4u]      = v.x;
        As[r4 * BK + c4 * 4u + 1u] = v.y;
        As[r4 * BK + c4 * 4u + 2u] = v.z;
        As[r4 * BK + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. NUM_THREADS over-spans
      // the BK-column tile — guard the store. Stored k-major, so a warp's
      // stores land on consecutive words.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      if (c < BK) {
        let gRow = blockRow + r4 * 4u;
        let gCol = t * BK + c;
        var v = A4[(params.offA + gCol * params.lda + gRow) / 4u];
        let colOK = gCol < params.k;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
        As[c * BM + r4 * 4u] = v.x;
        As[c * BM + r4 * 4u + 1u] = v.y;
        As[c * BM + r4 * 4u + 2u] = v.z;
        As[c * BM + r4 * 4u + 3u] = v.w;
      }
    } else if (params.transA == 0u) {
      // Scalar fallback, no-transpose: odd stride.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[params.offA + gRowA * params.lda + gColA], gRowA < params.m && gColA < params.k);
      }
    } else {
      // Scalar fallback, transpose: one m per thread, so a warp reads a
      // contiguous run of a stored row and writes As k-major without conflicts.
      for (var kOff = 0u; kOff < BK; kOff += NUM_THREADS / BM) {
        let mA = tid % BM;
        let kA = tid / BM + kOff;
        let gRowA = blockRow + mA;
        let gColA = t * BK + kA;
        As[kA * BM + mA] = select(0.0, A[params.offA + gColA * params.lda + gRowA], gRowA < params.m && gColA < params.k);
      }
    }

    // ── Load the BK×BN B tile into Bs ──
    if (params.useVecB == 1u && params.transB == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // over-spans the BK-row tile — guard the store.
      let r  = tid / (BN / 4u);
      let c4 = tid % (BN / 4u);
      if (r < BK) {
        let gRow = t * BK + r;
        let gCol = blockCol + c4 * 4u;
        var v = B4[(params.offB + gRow * params.ldb + gCol) / 4u];
        let rowOK = gRow < params.k;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.n);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.n);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.n);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.n);
        Bs[r * BN + c4 * 4u]      = v.x;
        Bs[r * BN + c4 * 4u + 1u] = v.y;
        Bs[r * BN + c4 * 4u + 2u] = v.z;
        Bs[r * BN + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column, one vec4 per thread —
      // NUM_THREADS over-spans the 32-column tile, so guard the store.
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      if (c < BN) {
        let gRow = t * BK + r4 * 4u;
        let gCol = blockCol + c;
        var v = B4[(params.offB + gCol * params.ldb + gRow) / 4u];
        let colOK = gCol < params.n;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.k);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.k);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.k);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.k);
        Bs[(r4 * 4u) * BN + c]     = v.x;
        Bs[(r4 * 4u + 1u) * BN + c] = v.y;
        Bs[(r4 * 4u + 2u) * BN + c] = v.z;
        Bs[(r4 * 4u + 3u) * BN + c] = v.w;
      }
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[params.offB + bIdx], gRowB < params.k && gColB < params.n);
      }
    }

    workgroupBarrier();

    // As is m-major ([BM][BK]) for no-transpose A, k-major ([BK][BM]) for
    // transposed A — see the tile loads. The uniform branch sits outside the
    // dot loop: inside it, it kept the compiler from unrolling the hot path.
    if (params.transA == 0u) {
      for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
        for (var i = 0u; i < TM; i++) {
          regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
        }
        for (var i = 0u; i < TN; i++) {
          regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
        }
        for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
          for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
            threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
          }
        }
      }
    } else {
      for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
        for (var i = 0u; i < TM; i++) {
          regM[i] = As[dotIdx * BM + threadRow * TM + i];
        }
        for (var i = 0u; i < TN; i++) {
          regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
        }
        for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
          for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
            threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
          }
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        // gemmtr: tiles straddling the diagonal write only their triangle.
        let inTriangle = params.uplo == 0u
          || (params.uplo == 1u && col <= row)
          || (params.uplo == 2u && col >= row);
        if (col < params.n && inTriangle) {
          let cIdx = params.offC + row * params.ldc + col;
          // BLAS beta==0 semantics: C is written, not accumulated — must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
