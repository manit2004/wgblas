// strsv_block: solves diagonal block [blockStart, blockEnd) sequentially —
// rows outside the block already had their contribution subtracted by
// strsv_update.wgsl, so dot products here only sum within the block.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> x: array<f32>;

struct Params {
  n:          u32,
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  uplo:       u32,  // 0 = lower, 1 = upper
  diag:       u32,  // 0 = non-unit, 1 = unit
  blockStart: u32,
  blockEnd:   u32,  // exclusive
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn strsv_block_main(@builtin(local_invocation_id) lid: vec3u) {
  let forward = (params.trans == 0u) == (params.uplo == 0u);
  let blockLen = params.blockEnd - params.blockStart;

  for (var step = 0u; step < blockLen; step++) {
    var i: u32;
    if forward {
      i = params.blockStart + step;
    } else {
      i = params.blockEnd - 1u - step;
    }

    // Dot product bounded to this block; outside rows already subtracted.
    var acc = 0.0f;
    if params.trans == 0u {
      if params.uplo == 0u {
        for (var j = params.blockStart + lid.x; j < i; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      } else {
        for (var j = i + 1u + lid.x; j < params.blockEnd; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      }
    } else {
      if params.uplo == 0u {
        for (var j = i + 1u + lid.x; j < params.blockEnd; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
        }
      } else {
        for (var j = params.blockStart + lid.x; j < i; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
        }
      }
    }

    // Parallel reduction: 64 → 1
    scratch[lid.x] = acc;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let rhs = x[i * params.incx] - scratch[0];
      if params.diag == 1u {
        x[i * params.incx] = rhs;
      } else {
        x[i * params.incx] = rhs / A[i * params.lda + i];
      }
    }
    // x is storage, not workgroup, address space — workgroupBarrier() alone
    // doesn't guarantee lane 0's write above is visible to other lanes'
    // x[j] reads in the next iteration; storageBarrier() does.
    storageBarrier();
    workgroupBarrier();
  }
}
