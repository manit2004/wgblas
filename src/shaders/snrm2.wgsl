// snrm2: result = sqrt(sum(x[i] * x[i])), overflow- and underflow-safe via
// Blue's algorithm with fixed scaling (Anderson 2017, "Algorithm 978: Safe
// Scaling in the Level 1 BLAS" — what LAPACK 3.10's snrm2 uses). Naive
// `sum += x_i * x_i` overflows to inf for |x_i| ≳ 1.8e19 (f32's squaring
// range is only sqrt(f32_max)) and loses precision on tiny magnitudes
// squaring into the denormal range. Instead every |x_i| lands in one of
// three accumulators by magnitude:
//   big:    |x| > TBIG  → (|x| · SBIG)²   (scaled down, can't overflow)
//   medium: in between  → |x|²            (squares safely as-is)
//   small:  |x| < TSML  → (|x| · SSML)²   (scaled up, keeps precision)
// The scales are constant powers of two, so there's no per-element division
// or data-dependent rescaling (the running-max SLASSQ update this replaced
// divided on every element and made the kernel compute-bound), and partials
// merge by plain addition — the same 4-way-ILP + tree-reduction shape as
// sasum. reduction/scaledSum.wgsl adds the partials and combines the three
// sums into the norm.
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/scaledSum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>; // 3 per workgroup: big, medium, small
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

// Thresholds and scales (powers of two, exact to apply). LAPACK's f32
// constants, except TBIG = 2^50 rather than 2^52: medium squares are then
// < 2^100, so the medium sum can't overflow below n = 2^28 elements.
const TSML: f32 = 0x1p-63f;
const TBIG: f32 = 0x1p50f;
const SSML: f32 = 0x1p75f;
const SBIG: f32 = 0x1p-76f;

// Adds |xi|'s contribution to (big, medium, small). NaN fails both
// comparisons and lands in medium, which the final combine propagates.
fn accum(s: vec3f, xi: f32) -> vec3f {
  let ax = abs(xi);
  let big = ax > TBIG;
  let sml = ax < TSML;
  let yb = ax * SBIG;
  let ys = ax * SSML;
  return s + vec3f(
    select(0.0, yb * yb, big),
    select(ax * ax, 0.0, big || sml),
    select(0.0, ys * ys, sml),
  );
}

var<workgroup> tile: array<vec3f, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = vec3f(0.0);
  var acc1 = vec3f(0.0);
  var acc2 = vec3f(0.0);
  var acc3 = vec3f(0.0);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = accum(acc0, x[ id                * params.x_inc]);
    acc1 = accum(acc1, x[(id +      stride) * params.x_inc]);
    acc2 = accum(acc2, x[(id + 2u * stride) * params.x_inc]);
    acc3 = accum(acc3, x[(id + 3u * stride) * params.x_inc]);
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = accum(acc0, x[id * params.x_inc]);
  }

  tile[lid.x] = (acc0 + acc1) + (acc2 + acc3);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      tile[lid.x] = tile[lid.x] + tile[lid.x + s];
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partials[3u * wgid.x]      = tile[0].x;
    partials[3u * wgid.x + 1u] = tile[0].y;
    partials[3u * wgid.x + 2u] = tile[0].z;
  }
}
