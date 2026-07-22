var wgblas=(()=>{var me=Object.create;var X=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var de=Object.getPrototypeOf,ge=Object.prototype.hasOwnProperty;var H=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var I=(t,e,r)=>()=>{if(r)throw r[0];try{return t&&(e=t(t=0)),e}catch(o){throw r=[o],o}};var tr=(t,e)=>{for(var r in e)X(t,r,{get:e[r],enumerable:!0})},ar=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of pe(e))!ge.call(t,a)&&a!==r&&X(t,a,{get:()=>e[a],enumerable:!(o=le(e,a))||o.enumerable});return t};var K=(t,e,r)=>(r=t!=null?me(de(t)):{},ar(e||!t||!t.__esModule?X(r,"default",{value:t,enumerable:!0}):r,t)),we=t=>ar(X({},"__esModule",{value:!0}),t);var gr,dr=I(()=>{gr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
// dispatch: 1 workgroup of WGS threads.
// partials_val and partials_idx must have exactly 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials_val: array<f32>;
@group(0) @binding(1) var<storage, read>       partials_idx: array<u32>;
@group(0) @binding(2) var<storage, read_write> result:       array<u32>;

const WGS: u32 = 64;

var<workgroup> tile_val: array<f32, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn reduce(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a_val = partials_val[i];
  let b_val = partials_val[i + WGS];
  if (b_val > a_val || (b_val == a_val && partials_idx[i + WGS] < partials_idx[i])) {
    tile_val[i] = b_val;
    tile_idx[i] = partials_idx[i + WGS];
  } else {
    tile_val[i] = a_val;
    tile_idx[i] = partials_idx[i];
  }
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) {
      let c_val = tile_val[i];
      let d_val = tile_val[i + s];
      if (d_val > c_val || (d_val == c_val && tile_idx[i + s] < tile_idx[i])) {
        tile_val[i] = d_val;
        tile_idx[i] = tile_idx[i + s];
      }
    }
    workgroupBarrier();
  }

  if (i == 0u) { result[0] = tile_idx[0]; }
}
`});var br,wr=I(()=>{br=`// sum reduction: collapses 2*WGS partials into one scalar.
// dispatch: 1 workgroup of WGS threads.
// partials must have exactly 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials: array<f32>;
@group(0) @binding(1) var<storage, read_write> result:   array<f32>;

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn reduce(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  tile[i] = partials[i] + partials[i + WGS];
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) { tile[i] += tile[i + s]; }
    workgroupBarrier();
  }

  if (i == 0u) { result[0] = tile[0]; }
}
`});var hr,vr=I(()=>{hr=`// sscal: x = alpha * x

@group(0) @binding(0) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  x_inc: u32,
}

@group(0) @binding(1) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    x[id * params.x_inc] = params.alpha * x[id * params.x_inc];
  }
}
`});var xr,yr=I(()=>{xr=`// sswap: x <-> y

@group(0) @binding(0) var<storage, read_write> x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let temp = x[id * params.x_inc];
    x[id * params.x_inc] = y[id * params.y_inc];
    y[id * params.y_inc] = temp;
  }
}
`});var Gr,_r=I(()=>{Gr=`// saxpy: y = alpha * x + y

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    y[id * params.y_inc] = params.alpha * x[id * params.x_inc] + y[id * params.y_inc];
  }
}
`});var Er,Br=I(()=>{Er=`// scopy: y = x

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    y[id * params.y_inc] = x[id * params.x_inc];
  }
}
`});var Pr,Ar=I(()=>{Pr=`// sdot: result = sum(x[i] * y[i])
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read>       y:        array<f32>;
@group(0) @binding(2) var<storage, read_write> partials: array<f32>;
@group(0) @binding(3) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 += x[ id                * params.x_inc] * y[ id                * params.y_inc];
    acc1 += x[(id +      stride) * params.x_inc] * y[(id +      stride) * params.y_inc];
    acc2 += x[(id + 2u * stride) * params.x_inc] * y[(id + 2u * stride) * params.y_inc];
    acc3 += x[(id + 3u * stride) * params.x_inc] * y[(id + 3u * stride) * params.y_inc];
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 += x[id * params.x_inc] * y[id * params.y_inc];
  }

  tile[lid.x] = acc0 + acc1 + acc2 + acc3;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var Sr,kr=I(()=>{Sr=`// sasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/abssum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>;
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 += abs(x[ id                * params.x_inc]);
    acc1 += abs(x[(id +      stride) * params.x_inc]);
    acc2 += abs(x[(id + 2u * stride) * params.x_inc]);
    acc3 += abs(x[(id + 3u * stride) * params.x_inc]);
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 += abs(x[id * params.x_inc]);
  }

  tile[lid.x] = acc0 + acc1 + acc2 + acc3;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var Wr,Fr=I(()=>{Wr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sqsum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>;
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    let v0 = x[ id                * params.x_inc];
    let v1 = x[(id +      stride) * params.x_inc];
    let v2 = x[(id + 2u * stride) * params.x_inc];
    let v3 = x[(id + 3u * stride) * params.x_inc];
    acc0 += v0 * v0;
    acc1 += v1 * v1;
    acc2 += v2 * v2;
    acc3 += v3 * v3;
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    let v = x[id * params.x_inc];
    acc0 += v * v;
  }

  tile[lid.x] = acc0 + acc1 + acc2 + acc3;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var Nr,jr=I(()=>{Nr=`// srot: x = c*x + s*y,  y = -s*x + c*y

@group(0) @binding(0) var<storage, read_write> x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  c:     f32,
  s:     f32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let xi = x[id * params.x_inc];
    let yi = y[id * params.y_inc];
    x[id * params.x_inc] =  params.c * xi + params.s * yi;
    y[id * params.y_inc] = -params.s * xi + params.c * yi;
  }
}
`});var Ir,Ur=I(()=>{Ir=`// srotm: applies modified Givens rotation H to vectors x and y.
// param[0] = flag: -1 (full H), 0 (unit diagonal), 1 (unit off-diagonal)
// param = [ flag, h11, h21, h12, h22 ]
// flag == -2 (identity/no-op) is handled in JS before dispatch reaches here.

@group(0) @binding(0) var<storage, read_write> x:     array<f32>;
@group(0) @binding(1) var<storage, read_write> y:     array<f32>;
@group(0) @binding(2) var<storage, read>       param: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  let flag = param[0];

  var h11: f32; var h12: f32;
  var h21: f32; var h22: f32;

  if (flag == -1.0) {
    // full 2x2 matrix
    h11 = param[1]; h21 = param[2];
    h12 = param[3]; h22 = param[4];
  } else if (flag == 0.0) {
    // diagonal fixed at 1
    h11 = 1.0;      h21 = param[2];
    h12 = param[3]; h22 = 1.0;
  } else if (flag == 1.0) {
    // flag == 1.0: off-diagonal fixed at +1 / -1
    h11 = param[1]; h21 = -1.0;
    h12 = 1.0;      h22 = param[4];
  }

  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let xi = x[id * params.x_inc];
    let yi = y[id * params.y_inc];
    x[id * params.x_inc] = h11 * xi + h12 * yi;
    y[id * params.y_inc] = h21 * xi + h22 * yi;
  }
}
`});var Vr,Rr=I(()=>{Vr=`// isamax: returns index of element with largest absolute value
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/argmax.wgsl.

@group(0) @binding(0) var<storage, read>       x:            array<f32>;
@group(0) @binding(1) var<storage, read_write> partials_val: array<f32>;
@group(0) @binding(2) var<storage, read_write> partials_idx: array<u32>;
@group(0) @binding(3) var<uniform>             params:       Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile_val: array<f32, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  // -1.0 is a safe sentinel: any |x[i]| >= 0 beats it,
  // so workgroups with no elements lose gracefully in the epilogue.
  var best_val0: f32 = -1.0; var best_idx0: u32 = 0u;
  var best_val1: f32 = -1.0; var best_idx1: u32 = 0u;
  var best_val2: f32 = -1.0; var best_idx2: u32 = 0u;
  var best_val3: f32 = -1.0; var best_idx3: u32 = 0u;

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    let v0 = abs(x[ id                * params.x_inc]);
    let v1 = abs(x[(id +      stride) * params.x_inc]);
    let v2 = abs(x[(id + 2u * stride) * params.x_inc]);
    let v3 = abs(x[(id + 3u * stride) * params.x_inc]);
    if (v0 > best_val0) { best_val0 = v0; best_idx0 = id; }
    if (v1 > best_val1) { best_val1 = v1; best_idx1 = id +      stride; }
    if (v2 > best_val2) { best_val2 = v2; best_idx2 = id + 2u * stride; }
    if (v3 > best_val3) { best_val3 = v3; best_idx3 = id + 3u * stride; }
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    let v = abs(x[id * params.x_inc]);
    if (v > best_val0) { best_val0 = v; best_idx0 = id; }
  }

  // merge 4 independent lanes; prefer lower index on tie (first occurrence wins)
  if (best_val1 > best_val0 || (best_val1 == best_val0 && best_idx1 < best_idx0)) {
    best_val0 = best_val1; best_idx0 = best_idx1;
  }
  if (best_val2 > best_val0 || (best_val2 == best_val0 && best_idx2 < best_idx0)) {
    best_val0 = best_val2; best_idx0 = best_idx2;
  }
  if (best_val3 > best_val0 || (best_val3 == best_val0 && best_idx3 < best_idx0)) {
    best_val0 = best_val3; best_idx0 = best_idx3;
  }

  tile_val[lid.x] = best_val0;
  tile_idx[lid.x] = best_idx0;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      let a_val = tile_val[lid.x];
      let b_val = tile_val[lid.x + s];
      if (b_val > a_val || (b_val == a_val && tile_idx[lid.x + s] < tile_idx[lid.x])) {
        tile_val[lid.x] = b_val;
        tile_idx[lid.x] = tile_idx[lid.x + s];
      }
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partials_val[wgid.x] = tile_val[0];
    partials_idx[wgid.x] = tile_idx[0];
  }
}
`});var Tr,Mr=I(()=>{Tr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
//
// One workgroup per output row, with a grid-stride outer loop so the shader
// still covers all rows when m exceeds maxComputeWorkgroupsPerDimension.
// Threads stride through A[row, :] and x with coalesced reads (consecutive
// threads \u2192 consecutive addresses). Four independent accumulators let the GPU
// pipeline memory requests across iterations (ILP=4), hiding the
// global-memory latency.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  m:     u32,
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  // Grid-stride loop: each workgroup handles ceil(m / nwg.x) rows.
  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let row_base = row * params.lda;
    var acc0: f32 = 0.0;
    var acc1: f32 = 0.0;
    var acc2: f32 = 0.0;
    var acc3: f32 = 0.0;

    // 4-unrolled loop: each iteration issues 4 independent loads for A and x.
    // The accumulators are independent so the GPU can overlap the memory
    // requests rather than serialising them behind a dependency chain.
    let n4_floor = (params.n / (4u * WGS)) * (4u * WGS);
    for (var j: u32 = lid.x; j < n4_floor; j += 4u * WGS) {
      acc0 += A[row_base + j            ] * x[ j             * params.incx];
      acc1 += A[row_base + j +     WGS  ] * x[(j +     WGS)  * params.incx];
      acc2 += A[row_base + j + 2u * WGS ] * x[(j + 2u * WGS) * params.incx];
      acc3 += A[row_base + j + 3u * WGS ] * x[(j + 3u * WGS) * params.incx];
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var j: u32 = n4_floor + lid.x; j < params.n; j += WGS) {
      acc0 += A[row_base + j] * x[j * params.incx];
    }

    // Parallel reduction: 64 \u2192 32 \u2192 16 \u2192 8 \u2192 4 \u2192 2 \u2192 1
    scratch[lid.x] = acc0 + acc1 + acc2 + acc3;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride {
        scratch[lid.x] += scratch[lid.x + stride];
      }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let yi = row * params.incy;
      y[yi] = params.alpha * scratch[0] + params.beta * y[yi];
    }
    // All 64 threads must agree before the next row reuses scratch[].
    workgroupBarrier();
  }
}
`});var Cr,Dr=I(()=>{Cr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
// each thread owns one column of A \u2192 one element of y (length n)
// tiles over x (length m) using shared memory; four independent accumulators
// let the GPU pipeline A reads across j within each tile (ILP=4)

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  m:     u32,
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> x_tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
) {
  // each thread owns column col of A \u2192 output y[col]
  let col     = gid.x;
  // tile over x (length m, the rows of A)
  let m_floor = (params.m / WGS) * WGS;
  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;

  for (var base = 0u; base < m_floor; base += WGS) {
    // cooperative load: all 64 threads fill x_tile with x[base..base+WGS]
    x_tile[lid.x] = x[(base + lid.x) * params.incx];
    workgroupBarrier();

    // 4-unrolled inner loop: 4 independent A reads let the GPU pipeline
    // global-memory requests within each tile. WGS=64 divides by 4 exactly.
    if (col < params.n) {
      for (var j = 0u; j < WGS; j += 4u) {
        acc0 += A[(base + j    ) * params.lda + col] * x_tile[j    ];
        acc1 += A[(base + j + 1) * params.lda + col] * x_tile[j + 1];
        acc2 += A[(base + j + 2) * params.lda + col] * x_tile[j + 2];
        acc3 += A[(base + j + 3) * params.lda + col] * x_tile[j + 3];
      }
    }
    workgroupBarrier();
  }

  if (col < params.n) {
    // remainder: m not divisible by WGS \u2014 short loop, single accumulator fine
    for (var k = m_floor; k < params.m; k++) {
      acc0 += A[k * params.lda + col] * x[k * params.incx];
    }
    let yi = col * params.incy;
    y[yi] = params.alpha * (acc0 + acc1 + acc2 + acc3) + params.beta * y[yi];
  }
}
`});var Lr,zr=I(()=>{Lr=`// ssymv: y = alpha * A * x + beta * y
// A is n\xD7n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
// The logical matrix is fully dense (symmetric), so each row's dot product
// sums over all n columns; entries on the unstored side of the diagonal are
// fetched from their mirror position (A[i,j] == A[j,i]).
// One workgroup per row, grid-stride outer loop.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var i = wgid.x; i < params.n; i += nwg.x) {
    var acc = 0.0f;

    // y[i] = \u03A3_j A[i,j] * x[j]
    for (var j = lid.x; j < params.n; j += WGS) {
      var aVal: f32;
      if params.uplo == 0u {
        // Lower: A[i,j] stored at A[i*lda+j] for j \u2264 i, mirrored from A[j*lda+i] otherwise
        if j <= i {
          aVal = A[i * params.lda + j];
        } else {
          aVal = A[j * params.lda + i];
        }
      } else {
        // Upper: A[i,j] stored at A[i*lda+j] for j \u2265 i, mirrored from A[j*lda+i] otherwise
        if j >= i {
          aVal = A[i * params.lda + j];
        } else {
          aVal = A[j * params.lda + i];
        }
      }
      acc += aVal * x[j * params.incx];
    }

    // Parallel reduction: 64 \u2192 1
    scratch[lid.x] = acc;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      y[i * params.incy] = params.alpha * scratch[0] + params.beta * y[i * params.incy];
    }
  }
}
`});var Or,qr=I(()=>{Or=`// strmv: y = op(A) * x
// A is n\xD7n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
// op(A) is A (trans=0) or A^T (trans=1).
// diag=1 (unit) treats the diagonal as 1 without reading A's diagonal values.
// One workgroup per row, grid-stride outer loop.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var i = wgid.x; i < params.n; i += nwg.x) {
    var acc = 0.0f;

    if params.trans == 0u {
      // No-transpose: y[i] = \u03A3_j A[i,j] * x[j]
      if params.uplo == 0u {
        // Lower: A[i,j] stored at A[i*lda+j] for j \u2264 i
        for (var j = lid.x; j <= i; j += WGS) {
          var aVal: f32;
          // unit diagonal: use 1 instead of A's actual diagonal value
          if params.diag == 1u && j == i {
            aVal = 1.0;
          } else if ( j <= i ) {
            aVal = A[i * params.lda + j];
          }
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[i,j] stored at A[i*lda+j] for j \u2265 i
        for (var j = i + lid.x; j < params.n; j += WGS) {
          var aVal: f32;
          // unit diagonal: use 1 instead of A's actual diagonal value
          if params.diag == 1u && j == i {
            aVal = 1.0;
          } else if ( j >= i ) {
            aVal = A[i * params.lda + j];
          }
          acc += aVal * x[j * params.incx];
        }
      }
    } else {
      // Transpose: y[i] = \u03A3_j A[j,i] * x[j]
      if params.uplo == 0u {
        // Lower: A[j,i] stored at A[j*lda+i] for j \u2265 i
        for (var j = i + lid.x; j < params.n; j += WGS) {
          var aVal: f32;
          // unit diagonal: use 1 instead of A's actual diagonal value
          if params.diag == 1u && j == i {
            aVal = 1.0;
          } else if ( j >= i ) {
            aVal = A[j * params.lda + i];
          }
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[j,i] stored at A[j*lda+i] for j \u2264 i
        for (var j = lid.x; j <= i; j += WGS) {
          var aVal: f32;
          // unit diagonal: use 1 instead of A's actual diagonal value
          if params.diag == 1u && j == i {
            aVal = 1.0;
          } else if ( j <= i ) {
            aVal = A[j * params.lda + i];
          }
          acc += aVal * x[j * params.incx];
        }
      }
    }

    // Parallel reduction: 64 \u2192 1
    scratch[lid.x] = acc;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      y[ i * params.incy ] = scratch[0];
    }
  }
}
`});var Yr={};tr(Yr,{shaderSources:()=>Ue});var Ue,$r=I(()=>{dr();wr();vr();yr();_r();Br();Ar();kr();Fr();jr();Ur();Rr();Mr();Dr();zr();qr();Ue={"reduction/argmax":gr,"reduction/sum":br,sscal:hr,sswap:xr,saxpy:Gr,scopy:Er,sdot:Pr,sasum:Sr,snrm2:Wr,srot:Nr,srotm:Ir,isamax:Vr,sgemv_n:Tr,sgemv_t:Cr,ssymv:Lr,strmv:Or}});var Te={};tr(Te,{GpuMatrix:()=>D,GpuVector:()=>b,cleanup:()=>cr,gpuName:()=>mr,init:()=>fr,isamax:()=>ie,randomFloat32Array:()=>lr,randomFloat64Array:()=>pr,sasum:()=>te,saxpy:()=>Kr,scopy:()=>Zr,sdot:()=>re,sgemv:()=>ue,snrm2:()=>oe,srot:()=>ne,srotm:()=>se,sscal:()=>Xr,sswap:()=>Hr,ssymv:()=>fe,strmv:()=>ce});function or(t,e){return e?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ir(){if(!sr())return{querySet:null,passDescriptor:void 0};let e=N().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function nr(t,e){if(!e)return null;let r=N(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(e,0,2,o,0);let a=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(o,0,a,0,16),{tsReadBuffer:a,resolveBuffer:o,querySet:e}}async function A(t){if(!t)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=t;await e.mapAsync(GPUMapMode.READ);let a=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(a[1]-a[0]))/1e6}var T=null,O=null,ur=null,Z=!1;async function fr({powerPreference:t="high-performance",benchmark:e=!1}={}){if(T)return T;let r;if(typeof window>"u"){let{create:i,globals:n}=await import("webgpu");Object.assign(globalThis,n),r=i([]),ur=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if(O=await r.requestAdapter({powerPreference:t})??await r.requestAdapter(),!O)throw new Error("No WebGPU adapter found.");Z=e;let a=[...or(O,e).requiredFeatures??[]];return T=await O.requestDevice({requiredFeatures:a}),T.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),T}function cr(){T&&(T.destroy(),T=null),O=null,ur=null,Z=!1}function mr(){if(!O)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:e}=O.info;return{description:e||"unknown",device:t||"unknown"}}function sr(){return Z}function N(){if(!T)throw new Error("WebGPU device not initialized \u2014 call init() first.");return T}function d(...t){t.flat().forEach(e=>e.destroy())}function w(t,e="blas-input",r=!1){let o=N(),a=o.limits.maxStorageBufferBindingSize,i=t.byteLength;if(i>a)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${a} bytes.`);let n=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,s=o.createBuffer({label:e,size:i,usage:n,mappedAtCreation:!0});return new Float32Array(s.getMappedRange()).set(t),s.unmap(),s}function C(t,e="blas-storage"){return N().createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE})}function L(t,e="blas-result"){return N().createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function _(t,e){let o=N().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(e,0,o,0,e.size),o}function W(t,e="blas-params"){let r=N(),o=t.length*4,a=Math.ceil(o/16)*16,i=new ArrayBuffer(a),n=new DataView(i);t.forEach(({value:u,type:f},m)=>{let l=m*4;if(f==="u32")n.setUint32(l,u,!0);else if(f==="i32")n.setInt32(l,u,!0);else if(f==="f32")n.setFloat32(l,u,!0);else throw new Error(`Unknown param type "${f}". Use "f32", "u32", or "i32".`)});let s=r.createBuffer({label:e,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(s,0,i),s}async function G(t,e=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let r=new e(t.getMappedRange().slice());return t.unmap(),r}finally{t.destroy()}}var b=class t{constructor(e,r,o=Float32Array){this._buf=e,this.length=r,this.dtype=o}static from(e){if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let r=w(e,"gpu-vector",!0);return new t(r,e.length,e.constructor)}async read(){let e=N(),r=e.createCommandEncoder(),o=_(r,this._buf);return e.queue.submit([r.finish()]),G(o,this.dtype)}destroy(){this._buf.destroy()}};var D=class t{constructor(e,r,o,a){this._buf=e,this.rows=r,this.cols=o,this.lda=a}static from(e,r,o,a=o){if(!(e instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(a)||a<o)throw new Error("lda must be an integer >= cols.");if(e.length<r*a)throw new Error("data does not have enough elements for the given rows and lda.");let i=w(e.subarray(0,r*a),"gpu-matrix",!0);return new t(i,r,o,a)}async read(){let e=N(),r=e.createCommandEncoder(),o=_(r,this._buf);e.queue.submit([r.finish()]);let a=await G(o,Float32Array);if(this.lda===this.cols)return a;let i=new Float32Array(this.rows*this.cols);for(let n=0;n<this.rows;n++)i.set(a.subarray(n*this.lda,n*this.lda+this.cols),n*this.cols);return i}destroy(){this._buf.destroy()}};function lr(t,e=-1,r=1){let o=new Float32Array(t);for(let a=0;a<t;a++)o[a]=e+Math.random()*(r-e);return o}function pr(t,e=-1,r=1){let o=new Float64Array(t);for(let a=0;a<t;a++)o[a]=e+Math.random()*(r-e);return o}function P(t,e){let r=N(),o=e.map((a,i)=>({binding:i,resource:{buffer:a}}));return r.createBindGroup({layout:t,entries:o})}var be=new WeakMap;function k(t){N().queue.submit([t.finish()])}function S(t,e,r){let o=N(),{querySet:a,passDescriptor:i}=ir(),n=o.createCommandEncoder(),s=n.beginComputePass(i);s.setPipeline(t),s.setBindGroup(0,e),typeof r=="number"?s.dispatchWorkgroups(r):s.dispatchWorkgroups(r.x,r.y),s.end();let u=nr(n,a);return be.set(n,s),{commandEncoder:n,ts:u}}var Ve={},J=new WeakMap;async function F(t,e){J.has(t)||J.set(t,new Map);let r=J.get(t);return r.has(e)||r.set(e,await Re(e)),r.get(e)}async function Ie(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>($r(),Yr)),r=e[t];if(!r)throw new Error(`Shader "${t}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:a}=await import("path"),i=o(r(Ve.url));return e(a(i,`../shaders/${t}.wgsl`),"utf8")}}async function Re(t){let e=N(),r=await Ie(t),o=e.createShaderModule({label:t,code:r}),i=(await o.getCompilationInfo()).messages.filter(s=>s.type==="error");if(i.length>0)throw new Error(`Shader "${t}" compilation failed:
${i.map(s=>`  line ${s.lineNum}: ${s.message}`).join(`
`)}`);let n=e.createComputePipeline({label:t,layout:"auto",compute:{module:o}});return n._shaderModule=o,n}var Me=64,Qr=8;function R(t,e){let r=N().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(t/Me),r):{x:Math.min(Math.ceil(e/Qr),r),y:Math.min(Math.ceil(t/Qr),r)}}async function Xr(t,e,r,o,a){let i=o instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:o;if(o.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await F(t,"sscal"),s=i?o._buf:w(o,"sscal-x",!0),u=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:a,type:"u32"}],"sscal-params"),f=P(n.getBindGroupLayout(0),[s,u]),{commandEncoder:m,ts:l}=S(n,f,R(e)),p=i?null:_(m,s);k(m);let c=await A(l);if(i)return d(u),c!==void 0?{gpuTimeMs:c}:{};let v=await G(p,Float32Array);return d(s,u),c!==void 0?{x:v,gpuTimeMs:c}:v}async function Hr(t,e,r,o,a,i){let n=r instanceof b,s=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(!(a instanceof Float32Array)&&!(a instanceof b))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==a.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"sswap"),f=n?r._buf:w(r,"sswap-x",!0),m=s?a._buf:w(a,"sswap-y",!0),l=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params"),p=P(u.getBindGroupLayout(0),[f,m,l]),{commandEncoder:c,ts:v}=S(u,p,R(e)),x=n?null:_(c,f),B=s?null:_(c,m);k(c);let h=await A(v);if(n&&s)return d(l),h!==void 0?{gpuTimeMs:h}:{};let y=await G(x,Float32Array),g=await G(B,Float32Array);return d(f,m,l),h!==void 0?{x:y,y:g,gpuTimeMs:h}:{x:y,y:g}}async function Kr(t,e,r,o,a,i,n){let s=o instanceof b,u=i instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!s&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{y:i};if(o.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await F(t,"saxpy"),m=s?o._buf:w(o,"saxpy-x",!1),l=u?i._buf:w(i,"saxpy-y",!0),p=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:a,type:"u32"},{value:n,type:"u32"}],"saxpy-params"),c=P(f.getBindGroupLayout(0),[m,l,p]),{commandEncoder:v,ts:x}=S(f,c,R(e)),B=u?null:_(v,l);k(v);let h=await A(x);if(u&&s)return d(p),h!==void 0?{gpuTimeMs:h}:{};let y=await G(B,Float32Array);return d(m,l,p),h!==void 0?{y,gpuTimeMs:h}:{y}}async function Zr(t,e,r,o,a,i){let n=r instanceof b,s=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"scopy"),f=n?r._buf:w(r,"scopy-x",!1),m=s?a._buf:w(a,"scopy-y",!0),l=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params"),p=P(u.getBindGroupLayout(0),[f,m,l]),{commandEncoder:c,ts:v}=S(u,p,R(e)),x=s?null:_(c,m);k(c);let B=await A(v);if(s&&n)return d(l),B!==void 0?{gpuTimeMs:B}:{};let h=await G(x,Float32Array);return d(f,m,l),B!==void 0?{y:h,gpuTimeMs:B}:{y:h}}var Jr=64;async function re(t,e,r,o,a,i){let n=r instanceof b,s=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"sdot"),f=await F(t,"reduction/sum"),m=n?r._buf:w(r,"sdot-x",!1),l=s?a._buf:w(a,"sdot-y",!1),p=C(2*Jr*4,"sdot-partials"),c=L(4,"sdot-result"),v=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params"),x=P(u.getBindGroupLayout(0),[m,l,p,v]),{commandEncoder:B,ts:h}=S(u,x,2*Jr);k(B);let y=P(f.getBindGroupLayout(0),[p,c]),{commandEncoder:g,ts:E}=S(f,y,1),j=_(g,c);k(g);let[U,V,M]=await Promise.all([A(h),A(E),G(j,Float32Array)]);return n&&s?(d(p,c,v),U!==void 0&&V!==void 0?{dot:M[0],gpuTimeMs:U+V}:{dot:M[0]}):(d(m,l,p,c,v,j),U!==void 0&&V!==void 0?{dot:M[0],gpuTimeMs:U+V}:{dot:M[0]})}var ee=64;async function te(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"sasum"),n=await F(t,"reduction/sum"),s=a?r._buf:w(r,"sasum-x",!1),u=C(2*ee*4,"sasum-partials"),f=L(4,"sasum-result"),m=W([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params"),l=P(i.getBindGroupLayout(0),[s,u,m]),{commandEncoder:p,ts:c}=S(i,l,2*ee);k(p);let v=P(n.getBindGroupLayout(0),[u,f]),{commandEncoder:x,ts:B}=S(n,v,1),h=_(x,f);k(x);let[y,g,E]=await Promise.all([A(c),A(B),G(h,Float32Array)]);return a?(d(u,f,m),y!==void 0&&g!==void 0?{asum:E[0],gpuTimeMs:y+g}:{asum:E[0]}):(d(s,u,f,m,h),y!==void 0&&g!==void 0?{asum:E[0],gpuTimeMs:y+g}:{asum:E[0]})}var ae=64;async function oe(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"snrm2"),n=await F(t,"reduction/sum"),s=a?r._buf:w(r,"snrm2-x",!1),u=C(2*ae*4,"snrm2-partials"),f=L(4,"snrm2-result"),m=W([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params"),l=P(i.getBindGroupLayout(0),[s,u,m]),{commandEncoder:p,ts:c}=S(i,l,2*ae);k(p);let v=P(n.getBindGroupLayout(0),[u,f]),{commandEncoder:x,ts:B}=S(n,v,1),h=_(x,f);k(x);let[y,g,E]=await Promise.all([A(c),A(B),G(h,Float32Array)]),j=Math.sqrt(E[0]);return a?(d(u,f,m),y!==void 0&&g!==void 0?{nrm2:j,gpuTimeMs:y+g}:{nrm2:j}):(d(s,u,f,m,h),y!==void 0&&g!==void 0?{nrm2:j,gpuTimeMs:y+g}:{nrm2:j})}var rr=64;async function ie(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"isamax"),n=await F(t,"reduction/argmax"),s=a?r._buf:w(r,"isamax-x",!1),u=C(2*rr*4,"isamax-partials-val"),f=C(2*rr*4,"isamax-partials-idx"),m=L(4,"isamax-result"),l=W([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params"),p=P(i.getBindGroupLayout(0),[s,u,f,l]),{commandEncoder:c,ts:v}=S(i,p,2*rr);k(c);let x=P(n.getBindGroupLayout(0),[u,f,m]),{commandEncoder:B,ts:h}=S(n,x,1),y=_(B,m);k(B);let[g,E,j]=await Promise.all([A(v),A(h),G(y,Uint32Array)]),U=j[0];return a?(d(u,f,m,l),g!==void 0&&E!==void 0?{index:U,gpuTimeMs:g+E}:{index:U}):(d(s,u,f,m,l,y),g!==void 0&&E!==void 0?{index:U,gpuTimeMs:g+E}:{index:U})}async function ne(t,e,r,o,a,i,n,s){let u=r instanceof b,f=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof n!="number")throw new Error("c must be a number.");if(typeof s!="number")throw new Error("s must be a number.");if(Number.isNaN(n)||Number.isNaN(s))throw new Error("c and s must not be NaN.");if(!Number.isFinite(n))throw new Error("c must be finite.");if(!Number.isFinite(s))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let m=await F(t,"srot"),l=u?r._buf:w(r,"srot-x",!0),p=f?a._buf:w(a,"srot-y",!0),c=W([{value:e,type:"u32"},{value:n,type:"f32"},{value:s,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params"),v=P(m.getBindGroupLayout(0),[l,p,c]),{commandEncoder:x,ts:B}=S(m,v,R(e)),h=u?null:_(x,l),y=f?null:_(x,p);k(x);let g=await A(B);if(u&&f)return d(c),g!==void 0?{gpuTimeMs:g}:{};let[E,j]=await Promise.all([G(h,Float32Array),G(y,Float32Array)]);return d(l,p,c),g!==void 0?{x:E,y:j,gpuTimeMs:g}:{x:E,y:j}}async function se(t,e,r,o,a,i,n){let s=r instanceof b,u=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(n instanceof Float32Array)||n.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||n[0]===-2)return s?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await F(t,"srotm"),m=s?r._buf:w(r,"srotm-x",!0),l=u?a._buf:w(a,"srotm-y",!0),p=w(n,"srotm-param",!1),c=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params"),v=P(f.getBindGroupLayout(0),[m,l,p,c]),{commandEncoder:x,ts:B}=S(f,v,R(e)),h=s?null:_(x,m),y=u?null:_(x,l);k(x);let g=await A(B);if(s&&u)return d(p,c),g!==void 0?{gpuTimeMs:g}:{};let[E,j]=await Promise.all([G(h,Float32Array),G(y,Float32Array)]);return d(m,l,p,c),g!==void 0?{x:E,y:j,gpuTimeMs:g}:{x:E,y:j}}async function ue(t,e,r,o,a,i,n,s,u,f,m,l){let p=s instanceof b,c=m instanceof b,v=i instanceof D,x=e==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!x&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u)||!Number.isInteger(l)||!Number.isInteger(n))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(u<=0||l<=0)throw new Error("incx and incy must be positive.");if(n<o)throw new Error("lda must be >= n.");if(!v&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(m instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!v)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(v&&n!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(v&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<=0||o<=0)return c?{}:{y:m};let B=x?o:r,h=x?r:o;if(!v&&i.length<(r-1)*n+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(s.length<(B-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(m.length<(h-1)*l+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let g=await F(t,x?"sgemv_n":"sgemv_t"),E=v?i._buf:w(i,"sgemv-A",!1),j=p?s._buf:w(s,"sgemv-x",!1),U=c?m._buf:w(m,"sgemv-y",!0),V=W([{value:r,type:"u32"},{value:o,type:"u32"},{value:a,type:"f32"},{value:f,type:"f32"},{value:u,type:"u32"},{value:l,type:"u32"},{value:n,type:"u32"}],"sgemv-params");try{let M=P(g.getBindGroupLayout(0),[E,j,U,V]),z=x?Math.min(r,t.limits.maxComputeWorkgroupsPerDimension):R(h),{commandEncoder:q,ts:Y}=S(g,M,z),$=c?null:_(q,U);k(q);let Q=await A(Y);if(c)return Q!==void 0?{gpuTimeMs:Q}:{};let er=await G($,Float32Array);return Q!==void 0?{y:er,gpuTimeMs:Q}:{y:er}}finally{v||d(E),p||d(j),c||d(U),d(V)}}async function fe(t,e,r,o,a,i,n,s,u,f,m){let l=n instanceof b,p=f instanceof b,c=a instanceof D,v=e==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!v&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!c&&!(a instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(l&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(l&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&i!==a.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(a.rows<r||a.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return p?{}:{y:f};if(!c&&a.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(r-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(f.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let x=await F(t,"ssymv"),B=null,h=null,y=null,g=null;try{B=c?a._buf:w(a,"ssymv-A",!1),h=l?n._buf:w(n,"ssymv-x",!1),y=p?f._buf:w(f,"ssymv-y",!0),g=W([{value:r,type:"u32"},{value:o,type:"f32"},{value:u,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:i,type:"u32"},{value:v?0:1,type:"u32"}],"ssymv-params");let E=P(x.getBindGroupLayout(0),[B,h,y,g]),j=Math.min(r,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:U,ts:V}=S(x,E,j),M=p?null:_(U,y);k(U);let z=await A(V);if(p)return z!==void 0?{gpuTimeMs:z}:{};let q=await G(M,Float32Array);return z!==void 0?{y:q,gpuTimeMs:z}:{y:q}}finally{!c&&B&&d(B),!l&&h&&d(h),!p&&y&&d(y),g&&d(g)}}async function ce(t,e,r,o,a,i,n,s,u,f,m){let l=s instanceof b,p=f instanceof b,c=i instanceof D,v=e==="lower",x=r==="no-transpose",B=o==="unit";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!v&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!x&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!B&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(n))throw new Error("n, incx, incy, and lda must be integers.");if(u<=0||m<=0)throw new Error("incx and incy must be positive.");if(n<a)throw new Error("lda must be >= n.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(l&&s._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(l&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&p&&i._buf===f._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&n!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<a||i.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return p?{}:{y:f};if(!c&&i.length<(a-1)*n+a)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(a-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(f.length<(a-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let h=await F(t,"strmv"),y=null,g=null,E=null,j=null;try{y=c?i._buf:w(i,"strmv-A",!1),g=l?s._buf:w(s,"strmv-x",!1),E=p?f._buf:w(f,"strmv-y",!0),j=W([{value:a,type:"u32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:n,type:"u32"},{value:x?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:B?1:0,type:"u32"}],"strmv-params");let U=P(h.getBindGroupLayout(0),[y,g,E,j]),V=Math.min(a,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:z}=S(h,U,V),q=p?null:_(M,E);k(M);let Y=await A(z);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let $=await G(q,Float32Array);return Y!==void 0?{y:$,gpuTimeMs:Y}:{y:$}}finally{!c&&y&&d(y),!l&&g&&d(g),!p&&E&&d(E),j&&d(j)}}return we(Te);})();
