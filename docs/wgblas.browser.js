var wgblas=(()=>{var ue=Object.create;var $=Object.defineProperty;var ce=Object.getOwnPropertyDescriptor;var le=Object.getOwnPropertyNames;var me=Object.getPrototypeOf,fe=Object.prototype.hasOwnProperty;var Q=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var N=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(a){throw e=[a],a}};var rr=(t,r)=>{for(var e in r)$(t,e,{get:r[e],enumerable:!0})},er=(t,r,e,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of le(r))!fe.call(t,o)&&o!==e&&$(t,o,{get:()=>r[o],enumerable:!(a=ce(r,o))||a.enumerable});return t};var X=(t,r,e)=>(e=t!=null?ue(me(t)):{},er(r||!t||!t.__esModule?$(e,"default",{value:t,enumerable:!0}):e,t)),pe=t=>er($({},"__esModule",{value:!0}),t);var pr,fr=N(()=>{pr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var gr,dr=N(()=>{gr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var br,wr=N(()=>{br=`// sscal: x = alpha * x

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
`});var vr,_r=N(()=>{vr=`// sswap: x <-> y

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
`});var yr,xr=N(()=>{yr=`// saxpy: y = alpha * x + y

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
`});var Gr,hr=N(()=>{Gr=`// scopy: y = x

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
`});var Er,Br=N(()=>{Er=`// sdot: result = sum(x[i] * y[i])
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
`});var Pr,Ar=N(()=>{Pr=`// sasum: result = sum(|x[i]|)
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
`});var Ir,kr=N(()=>{Ir=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Tr,Sr=N(()=>{Tr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Wr,Fr=N(()=>{Wr=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Nr,Rr=N(()=>{Nr=`// isamax: returns index of element with largest absolute value
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
`});var Mr,Ur=N(()=>{Mr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Cr,Dr=N(()=>{Cr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Vr,Lr=N(()=>{Vr=`// ssymv: y = alpha * A * x + beta * y
// A is n\xD7n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
//
// Tiled: TILE_R=8 rows per workgroup, TILE_C=32 cols per tile, WGS=256.
//
// Column tiles are 32 wide; the diagonal region for 8 rows is only 8 cols wide,
// so exactly ONE tile per workgroup straddles the diagonal ("mixed tile").
// All other tiles are purely below or above \u2192 load only smem_A or smem_B,
// halving global A reads vs loading both every tile.
//
// subgroupAdd: each subgroup of 32 threads = one full row (lc=0..31) on
// NVIDIA/Vulkan (subgroup_size=32). Replaces the 5-barrier tree reduction.
//
// smem_B uses padded stride TPAD=33 so the transposed read smem_B[lc*33+lr]
// maps 32 consecutive lc values to 32 distinct banks (gcd(33,32)=1).

enable subgroups;

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

const TILE_R: u32 = 8u;    // rows per workgroup
const TILE_C: u32 = 32u;   // cols per tile  (= expected subgroup size)
const WGS:    u32 = 256u;  // TILE_R \xD7 TILE_C
const TPAD:   u32 = 33u;   // TILE_C + 1 \u2014 bank-conflict-free stride for smem_B

var<workgroup> smem_A: array<f32, 256>;  // [TILE_R][TILE_C]
var<workgroup> smem_B: array<f32, 264>;  // [TILE_R][TPAD]
var<workgroup> smem_x: array<f32, 32>;   // [TILE_C]

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let lr = lid.x >> 5u;   // row within tile  [0, TILE_R)
  let lc = lid.x & 31u;   // col within tile  [0, TILE_C)

  for (var r0 = wgid.x * TILE_R; r0 < params.n; r0 += nwg.x * TILE_R) {
    let global_row = r0 + lr;
    var acc = 0.0f;

    // The single mixed tile that straddles the diagonal for rows [r0, r0+TILE_R).
    // Its column base is floor(r0 / TILE_C) * TILE_C.
    let mixed_c0 = r0 - r0 % TILE_C;

    if params.uplo == 0u {
      // \u2500\u2500 lower stored \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

      // Pure lower tiles: c0 \u2208 [0, mixed_c0).
      // Every col in [c0, c0+TILE_C) < r0 \u2264 global_row \u2192 row contribution only.
      // All col values guaranteed < n; load smem_A only.
      for (var c0 = 0u; c0 < mixed_c0; c0 += TILE_C) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               global_row < params.n);
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Mixed tile: c0 = mixed_c0.  Cols straddle the diagonal; some go to
      // smem_A (col \u2264 global_row, row contrib), rest to smem_B (col contrib).
      {
        let col   = mixed_c0 + lc;
        let B_row = mixed_c0 + lr;
        let B_col = r0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        smem_B[lr * TPAD + lc] = select(0.0f, A[B_row * params.lda + B_col],
                                        (B_row < params.n) & (B_col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          if col <= global_row {
            acc += smem_A[lid.x] * smem_x[lc];
          } else {
            // smem_B[lc*TPAD+lr] = A[(mixed_c0+lc)*lda + r0+lr] = A[col][global_row]
            acc += smem_B[lc * TPAD + lr] * smem_x[lc];
          }
        }
        workgroupBarrier();
      }

      // Pure upper tiles: c0 \u2208 [mixed_c0+TILE_C, n).
      // Every col \u2265 mixed_c0+TILE_C \u2265 r0+TILE_R > global_row \u2192 col contribution only.
      // Load smem_B only.
      for (var c0 = mixed_c0 + TILE_C; c0 < params.n; c0 += TILE_C) {
        let col = c0 + lc;
        smem_B[lr * TPAD + lc] = select(0.0f, A[(c0 + lr) * params.lda + r0 + lc],
                                        ((c0 + lr) < params.n) & ((r0 + lc) < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          acc += smem_B[lc * TPAD + lr] * smem_x[lc];
        }
        workgroupBarrier();
      }

    } else {
      // \u2500\u2500 upper stored \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

      // Pure lower tiles: every col < r0 \u2264 global_row \u2192 column contribution.
      // A[col][global_row] is in upper triangle (col \u2264 global_row) \u2192 stored.
      // Load smem_B only.
      for (var c0 = 0u; c0 < mixed_c0; c0 += TILE_C) {
        let col = c0 + lc;
        smem_B[lr * TPAD + lc] = select(0.0f, A[(c0 + lr) * params.lda + r0 + lc],
                                        ((c0 + lr) < params.n) & ((r0 + lc) < params.n));
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_B[lc * TPAD + lr] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Mixed tile.
      {
        let col   = mixed_c0 + lc;
        let B_row = mixed_c0 + lr;
        let B_col = r0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        smem_B[lr * TPAD + lc] = select(0.0f, A[B_row * params.lda + B_col],
                                        (B_row < params.n) & (B_col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          if col >= global_row {
            acc += smem_A[lid.x] * smem_x[lc];
          } else {
            acc += smem_B[lc * TPAD + lr] * smem_x[lc];
          }
        }
        workgroupBarrier();
      }

      // Pure upper tiles: every col \u2265 mixed_c0+TILE_C > global_row \u2192 row contribution.
      // Load smem_A only.
      for (var c0 = mixed_c0 + TILE_C; c0 < params.n; c0 += TILE_C) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }
    }

    // \u2500\u2500 reduction via subgroupAdd \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    // Each subgroup of 32 threads spans exactly one row (lc = 0..31).
    // Assumes subgroup_size == TILE_C == 32 (NVIDIA/Vulkan).
    let row_sum = subgroupAdd(acc);

    if (lc == 0u) & (global_row < params.n) {
      let yi = global_row * params.incy;
      y[yi] = params.alpha * row_sum + params.beta * y[yi];
    }
    // No workgroupBarrier needed: next r0 iteration's inner-loop barriers
    // protect all smem before any thread reads from it again.
  }
}`});var jr={};rr(jr,{shaderSources:()=>Se});var Se,zr=N(()=>{fr();dr();wr();_r();xr();hr();Br();Ar();kr();Sr();Fr();Rr();Ur();Dr();Lr();Se={"reduction/argmax":pr,"reduction/sum":gr,sscal:br,sswap:vr,saxpy:yr,scopy:Gr,sdot:Er,sasum:Pr,snrm2:Ir,srot:Tr,srotm:Wr,isamax:Nr,sgemv_n:Mr,sgemv_t:Cr,ssymv:Vr}});var Ne={};rr(Ne,{GpuMatrix:()=>z,GpuVector:()=>w,cleanup:()=>ur,gpuName:()=>cr,init:()=>nr,isamax:()=>ee,randomFloat32Array:()=>lr,randomFloat64Array:()=>mr,sasum:()=>Zr,saxpy:()=>$r,scopy:()=>Qr,sdot:()=>Hr,sgemv:()=>oe,snrm2:()=>re,srot:()=>te,srotm:()=>ae,sscal:()=>Or,sswap:()=>Yr,ssymv:()=>ie});function tr(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ar(){if(!ir())return{querySet:null,passDescriptor:void 0};let r=F().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function or(t,r){if(!r)return null;let e=F(),a=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,a,0);let o=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:r}}async function E(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:a}=t;await r.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),a.destroy(),Math.max(0,Number(o[1]-o[0]))/1e6}var M=null,V=null,sr=null,H=!1;async function nr({powerPreference:t="high-performance",benchmark:r=!1}={}){if(M)return M;let e;if(typeof window>"u"){let{create:i,globals:s}=await import("webgpu");Object.assign(globalThis,s),e=i([]),sr=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(V=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!V)throw new Error("No WebGPU adapter found.");H=r;let o=[...tr(V,r).requiredFeatures??[]];return V.features.has("subgroups")&&o.push("subgroups"),M=await V.requestDevice({requiredFeatures:o}),M.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),M}function ur(){M&&(M.destroy(),M=null),V=null,sr=null,H=!1}function cr(){if(!V)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=V.info;return{description:r||"unknown",device:t||"unknown"}}function ir(){return H}function F(){if(!M)throw new Error("WebGPU device not initialized \u2014 call init() first.");return M}function d(...t){t.flat().forEach(r=>r.destroy())}function g(t,r="blas-input",e=!1){let a=F(),o=a.limits.maxStorageBufferBindingSize,i=t.byteLength;if(i>o)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${o} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=a.createBuffer({label:r,size:i,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}function C(t,r="blas-storage"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function j(t,r="blas-result"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function h(t,r){let a=F().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,a,0,r.size),a}function T(t,r="blas-params"){let e=F(),a=t.length*4,o=Math.ceil(a/16)*16,i=new ArrayBuffer(o),s=new DataView(i);t.forEach(({value:u,type:c},l)=>{let f=l*4;if(c==="u32")s.setUint32(f,u,!0);else if(c==="i32")s.setInt32(f,u,!0);else if(c==="f32")s.setFloat32(f,u,!0);else throw new Error(`Unknown param type "${c}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,i),n}async function G(t,r=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}finally{t.destroy()}}var w=class t{constructor(r,e,a=Float32Array){this._buf=r,this.length=e,this.dtype=a}static from(r){if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let e=g(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=F(),e=r.createCommandEncoder(),a=h(e,this._buf);return r.queue.submit([e.finish()]),G(a,this.dtype)}destroy(){this._buf.destroy()}};var z=class t{constructor(r,e,a,o){this._buf=r,this.rows=e,this.cols=a,this.lda=o}static from(r,e,a,o=a){if(!(r instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(a)||a<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(o)||o<a)throw new Error("lda must be an integer >= cols.");if(r.length<e*o)throw new Error("data does not have enough elements for the given rows and lda.");let i=g(r.subarray(0,e*o),"gpu-matrix",!0);return new t(i,e,a,o)}async read(){let r=F(),e=r.createCommandEncoder(),a=h(e,this._buf);r.queue.submit([e.finish()]);let o=await G(a,Float32Array);if(this.lda===this.cols)return o;let i=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)i.set(o.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return i}destroy(){this._buf.destroy()}};function lr(t,r=-1,e=1){let a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function mr(t,r=-1,e=1){let a=new Float64Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function A(t,r){let e=F(),a=r.map((o,i)=>({binding:i,resource:{buffer:o}}));return e.createBindGroup({layout:t,entries:a})}var de=new WeakMap;function P(t){F().queue.submit([t.finish()])}function k(t,r,e){let a=F(),{querySet:o,passDescriptor:i}=ar(),s=a.createCommandEncoder(),n=s.beginComputePass(i);n.setPipeline(t),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let u=or(s,o);return de.set(s,n),{commandEncoder:s,ts:u}}var We={},K=new WeakMap;async function I(t,r){K.has(t)||K.set(t,new Map);let e=K.get(t);return e.has(r)||e.set(r,await Fe(r)),e.get(r)}async function Te(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(zr(),jr)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),i=a(e(We.url));return r(o(i,`../shaders/${t}.wgsl`),"utf8")}}async function Fe(t){let r=F(),e=await Te(t),a=r.createShaderModule({label:t,code:e}),i=(await a.getCompilationInfo()).messages.filter(n=>n.type==="error");if(i.length>0)throw new Error(`Shader "${t}" compilation failed:
${i.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=r.createComputePipeline({label:t,layout:"auto",compute:{module:a}});return s._shaderModule=a,s}var Re=64,qr=8;function U(t,r){let e=F().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/Re),e):{x:Math.min(Math.ceil(r/qr),e),y:Math.min(Math.ceil(t/qr),e)}}async function Or(t,r,e,a,o){let i=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return i?{}:a;if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await I(t,"sscal"),n=i?a._buf:g(a,"sscal-x",!0),u=T([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params"),c=A(s.getBindGroupLayout(0),[n,u]),{commandEncoder:l,ts:f}=k(s,c,U(r)),p=i?null:h(l,n);P(l);let m=await E(f);if(i)return d(u),m!==void 0?{gpuTimeMs:m}:{};let _=await G(p,Float32Array);return d(n,u),m!==void 0?{x:_,gpuTimeMs:m}:_}async function Yr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof w))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await I(t,"sswap"),c=s?e._buf:g(e,"sswap-x",!0),l=n?o._buf:g(o,"sswap-y",!0),f=T([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sswap-params"),p=A(u.getBindGroupLayout(0),[c,l,f]),{commandEncoder:m,ts:_}=k(u,p,U(r)),x=s?null:h(m,c),B=n?null:h(m,l);P(m);let v=await E(_);if(s&&n)return d(f),v!==void 0?{gpuTimeMs:v}:{};let y=await G(x,Float32Array),b=await G(B,Float32Array);return d(c,l,f),v!==void 0?{x:y,y:b,gpuTimeMs:v}:{x:y,y:b}}async function $r(t,r,e,a,o,i,s){let n=a instanceof w,u=i instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:i};if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await I(t,"saxpy"),l=n?a._buf:g(a,"saxpy-x",!1),f=u?i._buf:g(i,"saxpy-y",!0),p=T([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"saxpy-params"),m=A(c.getBindGroupLayout(0),[l,f,p]),{commandEncoder:_,ts:x}=k(c,m,U(r)),B=u?null:h(_,f);P(_);let v=await E(x);if(u&&n)return d(p),v!==void 0?{gpuTimeMs:v}:{};let y=await G(B,Float32Array);return d(l,f,p),v!==void 0?{y,gpuTimeMs:v}:{y}}async function Qr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await I(t,"scopy"),c=s?e._buf:g(e,"scopy-x",!1),l=n?o._buf:g(o,"scopy-y",!0),f=T([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"scopy-params"),p=A(u.getBindGroupLayout(0),[c,l,f]),{commandEncoder:m,ts:_}=k(u,p,U(r)),x=n?null:h(m,l);P(m);let B=await E(_);if(n&&s)return d(f),B!==void 0?{gpuTimeMs:B}:{};let v=await G(x,Float32Array);return d(c,l,f),B!==void 0?{y:v,gpuTimeMs:B}:{y:v}}var Xr=64;async function Hr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await I(t,"sdot"),c=await I(t,"reduction/sum"),l=s?e._buf:g(e,"sdot-x",!1),f=n?o._buf:g(o,"sdot-y",!1),p=C(2*Xr*4,"sdot-partials"),m=j(4,"sdot-result"),_=T([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sdot-params"),x=A(u.getBindGroupLayout(0),[l,f,p,_]),{commandEncoder:B,ts:v}=k(u,x,2*Xr);P(B);let y=A(c.getBindGroupLayout(0),[p,m]),{commandEncoder:b,ts:S}=k(c,y,1),W=h(b,m);P(b);let[R,D,L]=await Promise.all([E(v),E(S),G(W,Float32Array)]);return s&&n?(d(p,m,_),R!==void 0&&D!==void 0?{dot:L[0],gpuTimeMs:R+D}:{dot:L[0]}):(d(l,f,p,m,_,W),R!==void 0&&D!==void 0?{dot:L[0],gpuTimeMs:R+D}:{dot:L[0]})}var Kr=64;async function Zr(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await I(t,"sasum"),s=await I(t,"reduction/sum"),n=o?e._buf:g(e,"sasum-x",!1),u=C(2*Kr*4,"sasum-partials"),c=j(4,"sasum-result"),l=T([{value:r,type:"u32"},{value:a,type:"u32"}],"sasum-params"),f=A(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:p,ts:m}=k(i,f,2*Kr);P(p);let _=A(s.getBindGroupLayout(0),[u,c]),{commandEncoder:x,ts:B}=k(s,_,1),v=h(x,c);P(x);let[y,b,S]=await Promise.all([E(m),E(B),G(v,Float32Array)]);return o?(d(u,c,l),y!==void 0&&b!==void 0?{asum:S[0],gpuTimeMs:y+b}:{asum:S[0]}):(d(n,u,c,l,v),y!==void 0&&b!==void 0?{asum:S[0],gpuTimeMs:y+b}:{asum:S[0]})}var Jr=64;async function re(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await I(t,"snrm2"),s=await I(t,"reduction/sum"),n=o?e._buf:g(e,"snrm2-x",!1),u=C(2*Jr*4,"snrm2-partials"),c=j(4,"snrm2-result"),l=T([{value:r,type:"u32"},{value:a,type:"u32"}],"snrm2-params"),f=A(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:p,ts:m}=k(i,f,2*Jr);P(p);let _=A(s.getBindGroupLayout(0),[u,c]),{commandEncoder:x,ts:B}=k(s,_,1),v=h(x,c);P(x);let[y,b,S]=await Promise.all([E(m),E(B),G(v,Float32Array)]),W=Math.sqrt(S[0]);return o?(d(u,c,l),y!==void 0&&b!==void 0?{nrm2:W,gpuTimeMs:y+b}:{nrm2:W}):(d(n,u,c,l,v),y!==void 0&&b!==void 0?{nrm2:W,gpuTimeMs:y+b}:{nrm2:W})}var Z=64;async function ee(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await I(t,"isamax"),s=await I(t,"reduction/argmax"),n=o?e._buf:g(e,"isamax-x",!1),u=C(2*Z*4,"isamax-partials-val"),c=C(2*Z*4,"isamax-partials-idx"),l=j(4,"isamax-result"),f=T([{value:r,type:"u32"},{value:a,type:"u32"}],"isamax-params"),p=A(i.getBindGroupLayout(0),[n,u,c,f]),{commandEncoder:m,ts:_}=k(i,p,2*Z);P(m);let x=A(s.getBindGroupLayout(0),[u,c,l]),{commandEncoder:B,ts:v}=k(s,x,1),y=h(B,l);P(B);let[b,S,W]=await Promise.all([E(_),E(v),G(y,Uint32Array)]),R=W[0];return o?(d(u,c,l,f),b!==void 0&&S!==void 0?{index:R,gpuTimeMs:b+S}:{index:R}):(d(n,u,c,l,f,y),b!==void 0&&S!==void 0?{index:R,gpuTimeMs:b+S}:{index:R})}async function te(t,r,e,a,o,i,s,n){let u=e instanceof w,c=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(isNaN(s)||isNaN(n))throw new Error("c and s must not be NaN.");if(!isFinite(s))throw new Error("c must be finite.");if(!isFinite(n))throw new Error("s must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await I(t,"srot"),f=u?e._buf:g(e,"srot-x",!0),p=c?o._buf:g(o,"srot-y",!0),m=T([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srot-params"),_=A(l.getBindGroupLayout(0),[f,p,m]),{commandEncoder:x,ts:B}=k(l,_,U(r)),v=u?null:h(x,f),y=c?null:h(x,p);P(x);let b=await E(B);if(u&&c)return d(m),b!==void 0?{gpuTimeMs:b}:{};let[S,W]=await Promise.all([G(v,Float32Array),G(y,Float32Array)]);return d(f,p,m),b!==void 0?{x:S,y:W,gpuTimeMs:b}:{x:S,y:W}}async function ae(t,r,e,a,o,i,s){let n=e instanceof w,u=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await I(t,"srotm"),l=n?e._buf:g(e,"srotm-x",!0),f=u?o._buf:g(o,"srotm-y",!0),p=g(s,"srotm-param",!1),m=T([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srotm-params"),_=A(c.getBindGroupLayout(0),[l,f,p,m]),{commandEncoder:x,ts:B}=k(c,_,U(r)),v=n?null:h(x,l),y=u?null:h(x,f);P(x);let b=await E(B);if(n&&u)return d(p,m),b!==void 0?{gpuTimeMs:b}:{};let[S,W]=await Promise.all([G(v,Float32Array),G(y,Float32Array)]);return d(l,f,p,m),b!==void 0?{x:S,y:W,gpuTimeMs:b}:{x:S,y:W}}async function oe(t,r,e,a,o,i,s,n,u,c,l,f){let p=n instanceof w,m=l instanceof w,_=i instanceof z,x=r==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!x&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(isNaN(o))throw new Error("alpha must not be NaN.");if(!isFinite(o))throw new Error("alpha must be finite.");if(isNaN(c))throw new Error("beta must not be NaN.");if(!isFinite(c))throw new Error("beta must be finite.");if(u<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!_&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!_)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(_&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(_&&(i.rows<e||i.cols<a))throw new Error("A is too small for the given m and n.");if(e<=0||a<=0)return m?{}:{y:l};let B=x?a:e,v=x?e:a;if(!_&&i.length<(e-1)*s+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(B-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(l.length<(v-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let b=await I(t,x?"sgemv_n":"sgemv_t"),S=_?i._buf:g(i,"sgemv-A",!1),W=p?n._buf:g(n,"sgemv-x",!1),R=m?l._buf:g(l,"sgemv-y",!0),D=T([{value:e,type:"u32"},{value:a,type:"u32"},{value:o,type:"f32"},{value:c,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let L=A(b.getBindGroupLayout(0),[S,W,R,D]),q=x?Math.min(e,t.limits.maxComputeWorkgroupsPerDimension):U(v),{commandEncoder:O,ts:se}=k(b,L,q),ne=m?null:h(O,R);P(O);let Y=await E(se);if(m)return Y!==void 0?{gpuTimeMs:Y}:{};let J=await G(ne,Float32Array);return Y!==void 0?{y:J,gpuTimeMs:Y}:{y:J}}finally{_||d(S),p||d(W),m||d(R),d(D)}}async function ie(t,r,e,a,o,i,s,n,u,c,l){let f=s instanceof w,p=c instanceof w,m=o instanceof z,_=r==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!_&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(isNaN(a))throw new Error("alpha must not be NaN.");if(!isFinite(a))throw new Error("alpha must be finite.");if(isNaN(u))throw new Error("beta must not be NaN.");if(!isFinite(u))throw new Error("beta must be finite.");if(n<=0||l<=0)throw new Error("incx and incy must be positive.");if(i<e)throw new Error("lda must be >= n.");if(!m&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&i!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(o.rows<e||o.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return p?{}:{y:c};if(!m&&o.length<(e-1)*i+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(c.length<(e-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let x=await I(t,"ssymv"),B=null,v=null,y=null,b=null;try{B=m?o._buf:g(o,"ssymv-A",!1),v=f?s._buf:g(s,"ssymv-x",!1),y=p?c._buf:g(c,"ssymv-y",!0),b=T([{value:e,type:"u32"},{value:a,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:i,type:"u32"},{value:_?0:1,type:"u32"}],"ssymv-params");let S=A(x.getBindGroupLayout(0),[B,v,y,b]),W=Math.min(Math.ceil(e/8),t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:R,ts:D}=k(x,S,W),L=p?null:h(R,y);P(R);let q=await E(D);if(p)return q!==void 0?{gpuTimeMs:q}:{};let O=await G(L,Float32Array);return q!==void 0?{y:O,gpuTimeMs:q}:{y:O}}finally{!m&&B&&d(B),!f&&v&&d(v),!p&&y&&d(y),b&&d(b)}}return pe(Ne);})();
