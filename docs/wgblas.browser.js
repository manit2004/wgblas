var wgblas=(()=>{var ie=Object.create;var q=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var se=Object.getOwnPropertyNames;var ue=Object.getPrototypeOf,ce=Object.prototype.hasOwnProperty;var $=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var I=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(a){throw e=[a],a}};var J=(t,r)=>{for(var e in r)q(t,e,{get:r[e],enumerable:!0})},rr=(t,r,e,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of se(r))!ce.call(t,o)&&o!==e&&q(t,o,{get:()=>r[o],enumerable:!(a=ne(r,o))||a.enumerable});return t};var Y=(t,r,e)=>(e=t!=null?ie(ue(t)):{},rr(r||!t||!t.__esModule?q(e,"default",{value:t,enumerable:!0}):e,t)),fe=t=>rr(q({},"__esModule",{value:!0}),t);var pr,mr=I(()=>{pr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var dr,lr=I(()=>{dr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var wr,gr=I(()=>{wr=`// sscal: x = alpha * x

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
`});var br,vr=I(()=>{br=`// sswap: x <-> y

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
`});var yr,xr=I(()=>{yr=`// saxpy: y = alpha * x + y

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
`});var _r,hr=I(()=>{_r=`// scopy: y = x

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
`});var Br,Gr=I(()=>{Br=`// sdot: result = sum(x[i] * y[i])
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
`});var Pr,Er=I(()=>{Pr=`// sasum: result = sum(|x[i]|)
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
`});var kr,Ar=I(()=>{kr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Wr,Sr=I(()=>{Wr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Ur,Fr=I(()=>{Ur=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Ir,Rr=I(()=>{Ir=`// isamax: returns index of element with largest absolute value
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
`});var Mr,Nr=I(()=>{Mr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Dr,Tr=I(()=>{Dr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Vr={};J(Vr,{shaderSources:()=>Pe});var Pe,Cr=I(()=>{mr();lr();gr();vr();xr();hr();Gr();Er();Ar();Sr();Fr();Rr();Nr();Tr();Pe={"reduction/argmax":pr,"reduction/sum":dr,sscal:wr,sswap:br,saxpy:yr,scopy:_r,sdot:Br,sasum:Pr,snrm2:kr,srot:Wr,srotm:Ur,isamax:Ir,sgemv_n:Mr,sgemv_t:Dr}});var Fe={};J(Fe,{GpuMatrix:()=>L,GpuVector:()=>l,cleanup:()=>sr,gpuName:()=>ur,init:()=>nr,isamax:()=>Zr,randomFloat32Array:()=>cr,randomFloat64Array:()=>fr,sasum:()=>Xr,saxpy:()=>Or,scopy:()=>qr,sdot:()=>Yr,sgemv:()=>ee,snrm2:()=>Kr,srot:()=>Jr,srotm:()=>re,sscal:()=>zr,sswap:()=>Lr});function er(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function tr(){if(!or())return{querySet:null,passDescriptor:void 0};let r=U().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function ar(t,r){if(!r)return null;let e=U(),a=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,a,0);let o=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:r}}async function G(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:a}=t;await r.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),a.destroy(),Math.max(0,Number(o[1]-o[0]))/1e6}var T=null,j=null,ir=null,Q=!1;async function nr({powerPreference:t="high-performance",benchmark:r=!1}={}){if(T)return T;let e;if(typeof window>"u"){let{create:a,globals:o}=await import("webgpu");Object.assign(globalThis,o),e=a([]),ir=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(j=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!j)throw new Error("No WebGPU adapter found.");return Q=r,T=await j.requestDevice(er(j,r)),T.addEventListener("uncapturederror",a=>{console.error("Uncaptured GPU error:",a.error.message)}),T}function sr(){T&&(T.destroy(),T=null),j=null,ir=null,Q=!1}function ur(){if(!j)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=j.info;return{description:r||"unknown",device:t||"unknown"}}function or(){return Q}function U(){if(!T)throw new Error("WebGPU device not initialized \u2014 call init() first.");return T}function d(...t){t.flat().forEach(r=>r.destroy())}function g(t,r="blas-input",e=!1){let a=U(),o=a.limits.maxStorageBufferBindingSize,i=t.byteLength;if(i>o)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${o} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=a.createBuffer({label:r,size:i,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}function D(t,r="blas-storage"){return U().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function V(t,r="blas-result"){return U().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function h(t,r){let a=U().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,a,0,r.size),a}function F(t,r="blas-params"){let e=U(),a=t.length*4,o=Math.ceil(a/16)*16,i=new ArrayBuffer(o),s=new DataView(i);t.forEach(({value:u,type:c},f)=>{let m=f*4;if(c==="u32")s.setUint32(m,u,!0);else if(c==="i32")s.setInt32(m,u,!0);else if(c==="f32")s.setFloat32(m,u,!0);else throw new Error(`Unknown param type "${c}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,i),n}async function _(t,r=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}finally{t.destroy()}}var l=class t{constructor(r,e,a=Float32Array){this._buf=r,this.length=e,this.dtype=a}static from(r){if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let e=g(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=U(),e=r.createCommandEncoder(),a=h(e,this._buf);return r.queue.submit([e.finish()]),_(a,this.dtype)}destroy(){this._buf.destroy()}};var L=class t{constructor(r,e,a,o){this._buf=r,this.rows=e,this.cols=a,this.lda=o}static from(r,e,a,o=a){if(!(r instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(a)||a<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(o)||o<a)throw new Error("lda must be an integer >= cols.");if(r.length<e*o)throw new Error("data does not have enough elements for the given rows and lda.");let i=g(r.subarray(0,e*o),"gpu-matrix",!1);return new t(i,e,a,o)}destroy(){this._buf.destroy()}};function cr(t,r=-1,e=1){let a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function fr(t,r=-1,e=1){let a=new Float64Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function B(t,r){let e=U(),a=r.map((o,i)=>({binding:i,resource:{buffer:o}}));return e.createBindGroup({layout:t,entries:a})}var me=new WeakMap;function E(t){U().queue.submit([t.finish()])}function P(t,r,e){let a=U(),{querySet:o,passDescriptor:i}=tr(),s=a.createCommandEncoder(),n=s.beginComputePass(i);n.setPipeline(t),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let u=ar(s,o);return me.set(s,n),{commandEncoder:s,ts:u}}var Se={},X=new WeakMap;async function A(t,r){X.has(t)||X.set(t,new Map);let e=X.get(t);return e.has(r)||e.set(r,await ke(r)),e.get(r)}async function Ae(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(Cr(),Vr)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),i=a(e(Se.url));return r(o(i,`../shaders/${t}.wgsl`),"utf8")}}async function ke(t){let r=U(),e=await Ae(t),a=r.createShaderModule({label:t,code:e}),i=(await a.getCompilationInfo()).messages.filter(n=>n.type==="error");if(i.length>0)throw new Error(`Shader "${t}" compilation failed:
${i.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=r.createComputePipeline({label:t,layout:"auto",compute:{module:a}});return s._shaderModule=a,s}var We=64,jr=8;function N(t,r){let e=U().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/We),e):{x:Math.min(Math.ceil(r/jr),e),y:Math.min(Math.ceil(t/jr),e)}}async function zr(t,r,e,a,o){let i=a instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof l))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return i?{}:a;if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(t,"sscal"),n=i?a._buf:g(a,"sscal-x",!0),u=F([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params"),c=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:f,ts:m}=P(s,c,N(r)),w=i?null:h(f,n);E(f);let p=await G(m);if(i)return d(u),p!==void 0?{gpuTimeMs:p}:{};let b=await _(w,Float32Array);return d(n,u),p!==void 0?{result:b,gpuTimeMs:p}:b}async function Lr(t,r,e,a,o,i){let s=e instanceof l,n=o instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof l))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof l))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"sswap"),c=s?e._buf:g(e,"sswap-x",!0),f=n?o._buf:g(o,"sswap-y",!0),m=F([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sswap-params"),w=B(u.getBindGroupLayout(0),[c,f,m]),{commandEncoder:p,ts:b}=P(u,w,N(r)),x=s?null:h(p,c),S=n?null:h(p,f);E(p);let y=await G(b);if(s&&n)return d(m),y!==void 0?{gpuTimeMs:y}:{};let k=await _(x,Float32Array),v=await _(S,Float32Array);return d(c,f,m),y!==void 0?{x:k,y:v,gpuTimeMs:y}:{x:k,y:v}}async function Or(t,r,e,a,o,i,s){let n=a instanceof l,u=i instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:i};if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await A(t,"saxpy"),f=n?a._buf:g(a,"saxpy-x",!1),m=u?i._buf:g(i,"saxpy-y",!0),w=F([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"saxpy-params"),p=B(c.getBindGroupLayout(0),[f,m,w]),{commandEncoder:b,ts:x}=P(c,p,N(r)),S=u?null:h(b,m);E(b);let y=await G(x);if(u&&n)return d(w),y!==void 0?{gpuTimeMs:y}:{};let k=await _(S,Float32Array);return d(f,m,w),y!==void 0?{y:k,gpuTimeMs:y}:{y:k}}async function qr(t,r,e,a,o,i){let s=e instanceof l,n=o instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"scopy"),c=s?e._buf:g(e,"scopy-x",!1),f=n?o._buf:g(o,"scopy-y",!0),m=F([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"scopy-params"),w=B(u.getBindGroupLayout(0),[c,f,m]),{commandEncoder:p,ts:b}=P(u,w,N(r)),x=n?null:h(p,f);E(p);let S=await G(b);if(n&&s)return d(m),S!==void 0?{gpuTimeMs:S}:{};let y=await _(x,Float32Array);return d(c,f,m),S!==void 0?{y,gpuTimeMs:S}:{y}}var $r=64;async function Yr(t,r,e,a,o,i){let s=e instanceof l,n=o instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"sdot"),c=await A(t,"reduction/sum"),f=s?e._buf:g(e,"sdot-x",!1),m=n?o._buf:g(o,"sdot-y",!1),w=D(2*$r*4,"sdot-partials"),p=V(4,"sdot-result"),b=F([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sdot-params"),x=B(u.getBindGroupLayout(0),[f,m,w,b]),{commandEncoder:S,ts:y}=P(u,x,2*$r);E(S);let k=B(c.getBindGroupLayout(0),[w,p]),{commandEncoder:v,ts:W}=P(c,k,1),R=h(v,p);E(v);let[M,C,z]=await Promise.all([G(y),G(W),_(R,Float32Array)]);return s&&n?(d(w,p,b),M!==void 0&&C!==void 0?{dot:z[0],gpuTimeMs:M+C}:{dot:z[0]}):(d(f,m,w,p,b,R),M!==void 0&&C!==void 0?{dot:z[0],gpuTimeMs:M+C}:{dot:z[0]})}var Qr=64;async function Xr(t,r,e,a){let o=e instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(t,"sasum"),s=await A(t,"reduction/sum"),n=o?e._buf:g(e,"sasum-x",!1),u=D(2*Qr*4,"sasum-partials"),c=V(4,"sasum-result"),f=F([{value:r,type:"u32"},{value:a,type:"u32"}],"sasum-params"),m=B(i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:w,ts:p}=P(i,m,2*Qr);E(w);let b=B(s.getBindGroupLayout(0),[u,c]),{commandEncoder:x,ts:S}=P(s,b,1),y=h(x,c);E(x);let[k,v,W]=await Promise.all([G(p),G(S),_(y,Float32Array)]);return o?(d(u,c,f),k!==void 0&&v!==void 0?{asum:W[0],gpuTimeMs:k+v}:{asum:W[0]}):(d(n,u,c,f,y),k!==void 0&&v!==void 0?{asum:W[0],gpuTimeMs:k+v}:{asum:W[0]})}var Hr=64;async function Kr(t,r,e,a){let o=e instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(t,"snrm2"),s=await A(t,"reduction/sum"),n=o?e._buf:g(e,"snrm2-x",!1),u=D(2*Hr*4,"snrm2-partials"),c=V(4,"snrm2-result"),f=F([{value:r,type:"u32"},{value:a,type:"u32"}],"snrm2-params"),m=B(i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:w,ts:p}=P(i,m,2*Hr);E(w);let b=B(s.getBindGroupLayout(0),[u,c]),{commandEncoder:x,ts:S}=P(s,b,1),y=h(x,c);E(x);let[k,v,W]=await Promise.all([G(p),G(S),_(y,Float32Array)]),R=Math.sqrt(W[0]);return o?(d(u,c,f),k!==void 0&&v!==void 0?{nrm2:R,gpuTimeMs:k+v}:{nrm2:R}):(d(n,u,c,f,y),k!==void 0&&v!==void 0?{nrm2:R,gpuTimeMs:k+v}:{nrm2:R})}var H=64;async function Zr(t,r,e,a){let o=e instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(t,"isamax"),s=await A(t,"reduction/argmax"),n=o?e._buf:g(e,"isamax-x",!1),u=D(2*H*4,"isamax-partials-val"),c=D(2*H*4,"isamax-partials-idx"),f=V(4,"isamax-result"),m=F([{value:r,type:"u32"},{value:a,type:"u32"}],"isamax-params"),w=B(i.getBindGroupLayout(0),[n,u,c,m]),{commandEncoder:p,ts:b}=P(i,w,2*H);E(p);let x=B(s.getBindGroupLayout(0),[u,c,f]),{commandEncoder:S,ts:y}=P(s,x,1),k=h(S,f);E(S);let[v,W,R]=await Promise.all([G(b),G(y),_(k,Uint32Array)]),M=R[0];return o?(d(u,c,f,m),v!==void 0&&W!==void 0?{index:M,gpuTimeMs:v+W}:{index:M}):(d(n,u,c,f,m,k),v!==void 0&&W!==void 0?{index:M,gpuTimeMs:v+W}:{index:M})}async function Jr(t,r,e,a,o,i,s,n){let u=e instanceof l,c=o instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(isNaN(s)||isNaN(n))throw new Error("c and s must not be NaN.");if(!isFinite(s))throw new Error("c must be finite.");if(!isFinite(n))throw new Error("s must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await A(t,"srot"),m=u?e._buf:g(e,"srot-x",!0),w=c?o._buf:g(o,"srot-y",!0),p=F([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srot-params"),b=B(f.getBindGroupLayout(0),[m,w,p]),{commandEncoder:x,ts:S}=P(f,b,N(r)),y=u?null:h(x,m),k=c?null:h(x,w);E(x);let v=await G(S);if(u&&c)return d(p),v!==void 0?{gpuTimeMs:v}:{};let[W,R]=await Promise.all([_(y,Float32Array),_(k,Float32Array)]);return d(m,w,p),v!==void 0?{x:W,y:R,gpuTimeMs:v}:{x:W,y:R}}async function re(t,r,e,a,o,i,s){let n=e instanceof l,u=o instanceof l;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await A(t,"srotm"),f=n?e._buf:g(e,"srotm-x",!0),m=u?o._buf:g(o,"srotm-y",!0),w=g(s,"srotm-param",!1),p=F([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srotm-params"),b=B(c.getBindGroupLayout(0),[f,m,w,p]),{commandEncoder:x,ts:S}=P(c,b,N(r)),y=n?null:h(x,f),k=u?null:h(x,m);E(x);let v=await G(S);if(n&&u)return d(w,p),v!==void 0?{gpuTimeMs:v}:{};let[W,R]=await Promise.all([_(y,Float32Array),_(k,Float32Array)]);return d(f,m,w,p),v!==void 0?{x:W,y:R,gpuTimeMs:v}:{x:W,y:R}}async function ee(t,r,e,a,o,i,s,n,u,c,f,m){let w=n instanceof l,p=f instanceof l,b=i instanceof L,x=r==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!x&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(isNaN(o))throw new Error("alpha must not be NaN.");if(!isFinite(o))throw new Error("alpha must be finite.");if(isNaN(c))throw new Error("beta must not be NaN.");if(!isFinite(c))throw new Error("beta must be finite.");if(u<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!b&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!b)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(b&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(b&&(i.rows<e||i.cols<a))throw new Error("A is too small for the given m and n.");if(e<=0||a<=0)return p?{}:{y:f};let S=x?a:e,y=x?e:a;if(!b&&i.length<(e-1)*s+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(S-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(y-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let v=await A(t,x?"sgemv_n":"sgemv_t"),W=b?i._buf:g(i,"sgemv-A",!1),R=w?n._buf:g(n,"sgemv-x",!1),M=p?f._buf:g(f,"sgemv-y",!0),C=F([{value:e,type:"u32"},{value:a,type:"u32"},{value:o,type:"f32"},{value:c,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let z=B(v.getBindGroupLayout(0),[W,R,M,C]);if(x&&e>t.limits.maxComputeWorkgroupsPerDimension)throw new Error(`m (${e}) exceeds device limit maxComputeWorkgroupsPerDimension (${t.limits.maxComputeWorkgroupsPerDimension}).`);let te=x?e:N(y),{commandEncoder:K,ts:ae}=P(v,z,te),oe=p?null:h(K,M);E(K);let O=await G(ae);if(p)return O!==void 0?{gpuTimeMs:O}:{};let Z=await _(oe,Float32Array);return O!==void 0?{y:Z,gpuTimeMs:O}:{y:Z}}finally{b||d(W),w||d(R),p||d(M),d(C)}}return fe(Fe);})();
