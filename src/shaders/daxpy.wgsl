// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
// Each element costs one ddMulProtected (alpha*x[i]) then one ddAddProtected
// (+ y[i]) — the same two-protected-op shape ddot spends per term, applied
// straight to the output instead of folded into a reduction. See dscal.wgsl
// for why this is a uniform main pass plus a ragged, select-masked tail
// rather than a plain `id < params.n` grid-stride loop.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;
@group(0) @binding(4) var<uniform> params: Params;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  x_inc:   u32,
  y_inc:   u32,
}

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn daxpy_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    let prod = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let result = ddAddProtected(prod, DD(yHi[iy], yLo[iy]), lid.x);
    yHi[iy] = result.hi;
    yLo[iy] = result.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) — pad to this workgroup's worst
  // case so every thread still calls ddMulProtected/ddAddProtected the same
  // number of times (their barriers need that), masking only the write.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id = n_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let ix = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let iy = select(0u, id * params.y_inc, valid);
    let prod = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let result = ddAddProtected(prod, DD(yHi[iy], yLo[iy]), lid.x);
    if (valid) {
      yHi[iy] = result.hi;
      yLo[iy] = result.lo;
    }
  }
}
