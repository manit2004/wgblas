var wgblas=(()=>{var ue=Object.create;var $=Object.defineProperty;var ce=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var me=Object.getPrototypeOf,pe=Object.prototype.hasOwnProperty;var Q=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var I=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(a){throw e=[a],a}};var rr=(t,r)=>{for(var e in r)$(t,e,{get:r[e],enumerable:!0})},er=(t,r,e,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of fe(r))!pe.call(t,o)&&o!==e&&$(t,o,{get:()=>r[o],enumerable:!(a=ce(r,o))||a.enumerable});return t};var X=(t,r,e)=>(e=t!=null?ue(me(t)):{},er(r||!t||!t.__esModule?$(e,"default",{value:t,enumerable:!0}):e,t)),le=t=>er($({},"__esModule",{value:!0}),t);var lr,pr=I(()=>{lr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var gr,dr=I(()=>{gr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var vr,wr=I(()=>{vr=`// sscal: x = alpha * x

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
`});var xr,br=I(()=>{xr=`// sswap: x <-> y

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
`});var hr,yr=I(()=>{hr=`// saxpy: y = alpha * x + y

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
`});var Gr,_r=I(()=>{Gr=`// scopy: y = x

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
`});var Er,Br=I(()=>{Er=`// sdot: result = sum(x[i] * y[i])
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
`});var Pr,Ar=I(()=>{Pr=`// sasum: result = sum(|x[i]|)
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
`});var Wr,Sr=I(()=>{Wr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var jr,kr=I(()=>{jr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Rr,Fr=I(()=>{Rr=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Ir,Ur=I(()=>{Ir=`// isamax: returns index of element with largest absolute value
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
`});var Cr,Vr=I(()=>{Cr=`// ssymv: y = alpha * A * x + beta * y
// A is n\xD7n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
// One workgroup per row, grid-stride outer loop. ILP=4 on each sub-range.

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
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let rb = row * params.lda;
    var acc0 = 0.0f; var acc1 = 0.0f; var acc2 = 0.0f; var acc3 = 0.0f;

    if params.uplo == 0u {
      // Row part (j = 0..row): sequential reads along stored lower triangle.
      let rfloor = (row + 1u) / (4u * WGS) * (4u * WGS);
      for (var j = lid.x; j < rfloor; j += 4u * WGS) {
        acc0 += A[rb + j          ] * x[ j           * params.incx];
        acc1 += A[rb + j +    WGS ] * x[(j +    WGS) * params.incx];
        acc2 += A[rb + j + 2u*WGS ] * x[(j + 2u*WGS) * params.incx];
        acc3 += A[rb + j + 3u*WGS ] * x[(j + 3u*WGS) * params.incx];
      }
      for (var j = rfloor + lid.x; j <= row; j += WGS) {
        acc0 += A[rb + j] * x[j * params.incx];
      }

      // Column part (j = row+1..n-1): A[i,j] = A[j,i] \u2192 strided column reads.
      let cs = row + 1u;
      if cs < params.n {
        let cfloor = cs + (params.n - cs) / (4u * WGS) * (4u * WGS);
        for (var j = cs + lid.x; j < cfloor; j += 4u * WGS) {
          acc0 += A[ j           * params.lda + row] * x[ j           * params.incx];
          acc1 += A[(j +    WGS) * params.lda + row] * x[(j +    WGS) * params.incx];
          acc2 += A[(j + 2u*WGS) * params.lda + row] * x[(j + 2u*WGS) * params.incx];
          acc3 += A[(j + 3u*WGS) * params.lda + row] * x[(j + 3u*WGS) * params.incx];
        }
        for (var j = cfloor + lid.x; j < params.n; j += WGS) {
          acc0 += A[j * params.lda + row] * x[j * params.incx];
        }
      }
    } else {
      // Row part (j = row..n-1): sequential reads along stored upper triangle.
      let rfloor = row + (params.n - row) / (4u * WGS) * (4u * WGS);
      for (var j = row + lid.x; j < rfloor; j += 4u * WGS) {
        acc0 += A[rb + j          ] * x[ j           * params.incx];
        acc1 += A[rb + j +    WGS ] * x[(j +    WGS) * params.incx];
        acc2 += A[rb + j + 2u*WGS ] * x[(j + 2u*WGS) * params.incx];
        acc3 += A[rb + j + 3u*WGS ] * x[(j + 3u*WGS) * params.incx];
      }
      for (var j = rfloor + lid.x; j < params.n; j += WGS) {
        acc0 += A[rb + j] * x[j * params.incx];
      }

      // Column part (j = 0..row-1): A[i,j] = A[j,i] \u2192 strided column reads.
      if row > 0u {
        let cfloor = row / (4u * WGS) * (4u * WGS);
        for (var j = lid.x; j < cfloor; j += 4u * WGS) {
          acc0 += A[ j           * params.lda + row] * x[ j           * params.incx];
          acc1 += A[(j +    WGS) * params.lda + row] * x[(j +    WGS) * params.incx];
          acc2 += A[(j + 2u*WGS) * params.lda + row] * x[(j + 2u*WGS) * params.incx];
          acc3 += A[(j + 3u*WGS) * params.lda + row] * x[(j + 3u*WGS) * params.incx];
        }
        for (var j = cfloor + lid.x; j < row; j += WGS) {
          acc0 += A[j * params.lda + row] * x[j * params.incx];
        }
      }
    }

    // Parallel reduction: 64 \u2192 1
    scratch[lid.x] = acc0 + acc1 + acc2 + acc3;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let yi = row * params.incy;
      y[yi] = params.alpha * scratch[0] + params.beta * y[yi];
    }
    workgroupBarrier();
  }
}`});var zr={};rr(zr,{shaderSources:()=>ke});var ke,Lr=I(()=>{pr();dr();wr();br();yr();_r();Br();Ar();Sr();kr();Fr();Ur();Nr();Tr();Vr();ke={"reduction/argmax":lr,"reduction/sum":gr,sscal:vr,sswap:xr,saxpy:hr,scopy:Gr,sdot:Er,sasum:Pr,snrm2:Wr,srot:jr,srotm:Rr,isamax:Ir,sgemv_n:Mr,sgemv_t:Dr,ssymv:Cr}});var Ie={};rr(Ie,{GpuMatrix:()=>z,GpuVector:()=>w,cleanup:()=>ur,gpuName:()=>cr,init:()=>sr,isamax:()=>ee,randomFloat32Array:()=>fr,randomFloat64Array:()=>mr,sasum:()=>Zr,saxpy:()=>$r,scopy:()=>Qr,sdot:()=>Hr,sgemv:()=>oe,snrm2:()=>re,srot:()=>te,srotm:()=>ae,sscal:()=>Or,sswap:()=>Yr,ssymv:()=>ie});function tr(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ar(){if(!ir())return{querySet:null,passDescriptor:void 0};let r=F().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function or(t,r){if(!r)return null;let e=F(),a=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,a,0);let o=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:r}}async function E(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:a}=t;await r.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),a.destroy(),Math.max(0,Number(o[1]-o[0]))/1e6}var M=null,L=null,nr=null,H=!1;async function sr({powerPreference:t="high-performance",benchmark:r=!1}={}){if(M)return M;let e;if(typeof window>"u"){let{create:a,globals:o}=await import("webgpu");Object.assign(globalThis,o),e=a([]),nr=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(L=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!L)throw new Error("No WebGPU adapter found.");return H=r,M=await L.requestDevice(tr(L,r)),M.addEventListener("uncapturederror",a=>{console.error("Uncaptured GPU error:",a.error.message)}),M}function ur(){M&&(M.destroy(),M=null),L=null,nr=null,H=!1}function cr(){if(!L)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=L.info;return{description:r||"unknown",device:t||"unknown"}}function ir(){return H}function F(){if(!M)throw new Error("WebGPU device not initialized \u2014 call init() first.");return M}function d(...t){t.flat().forEach(r=>r.destroy())}function g(t,r="blas-input",e=!1){let a=F(),o=a.limits.maxStorageBufferBindingSize,i=t.byteLength;if(i>o)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${o} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=a.createBuffer({label:r,size:i,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}function D(t,r="blas-storage"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function C(t,r="blas-result"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function _(t,r){let a=F().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,a,0,r.size),a}function j(t,r="blas-params"){let e=F(),a=t.length*4,o=Math.ceil(a/16)*16,i=new ArrayBuffer(o),s=new DataView(i);t.forEach(({value:u,type:c},f)=>{let p=f*4;if(c==="u32")s.setUint32(p,u,!0);else if(c==="i32")s.setInt32(p,u,!0);else if(c==="f32")s.setFloat32(p,u,!0);else throw new Error(`Unknown param type "${c}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,i),n}async function G(t,r=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}finally{t.destroy()}}var w=class t{constructor(r,e,a=Float32Array){this._buf=r,this.length=e,this.dtype=a}static from(r){if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let e=g(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=F(),e=r.createCommandEncoder(),a=_(e,this._buf);return r.queue.submit([e.finish()]),G(a,this.dtype)}destroy(){this._buf.destroy()}};var z=class t{constructor(r,e,a,o){this._buf=r,this.rows=e,this.cols=a,this.lda=o}static from(r,e,a,o=a){if(!(r instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(a)||a<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(o)||o<a)throw new Error("lda must be an integer >= cols.");if(r.length<e*o)throw new Error("data does not have enough elements for the given rows and lda.");let i=g(r.subarray(0,e*o),"gpu-matrix",!0);return new t(i,e,a,o)}async read(){let r=F(),e=r.createCommandEncoder(),a=_(e,this._buf);r.queue.submit([e.finish()]);let o=await G(a,Float32Array);if(this.lda===this.cols)return o;let i=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)i.set(o.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return i}destroy(){this._buf.destroy()}};function fr(t,r=-1,e=1){let a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function mr(t,r=-1,e=1){let a=new Float64Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function A(t,r){let e=F(),a=r.map((o,i)=>({binding:i,resource:{buffer:o}}));return e.createBindGroup({layout:t,entries:a})}var de=new WeakMap;function P(t){F().queue.submit([t.finish()])}function S(t,r,e){let a=F(),{querySet:o,passDescriptor:i}=ar(),s=a.createCommandEncoder(),n=s.beginComputePass(i);n.setPipeline(t),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let u=or(s,o);return de.set(s,n),{commandEncoder:s,ts:u}}var Re={},K=new WeakMap;async function W(t,r){K.has(t)||K.set(t,new Map);let e=K.get(t);return e.has(r)||e.set(r,await Fe(r)),e.get(r)}async function je(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(Lr(),zr)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),i=a(e(Re.url));return r(o(i,`../shaders/${t}.wgsl`),"utf8")}}async function Fe(t){let r=F(),e=await je(t),a=r.createShaderModule({label:t,code:e}),i=(await a.getCompilationInfo()).messages.filter(n=>n.type==="error");if(i.length>0)throw new Error(`Shader "${t}" compilation failed:
${i.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=r.createComputePipeline({label:t,layout:"auto",compute:{module:a}});return s._shaderModule=a,s}var Ue=64,qr=8;function N(t,r){let e=F().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/Ue),e):{x:Math.min(Math.ceil(r/qr),e),y:Math.min(Math.ceil(t/qr),e)}}async function Or(t,r,e,a,o){let i=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return i?{}:a;if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await W(t,"sscal"),n=i?a._buf:g(a,"sscal-x",!0),u=j([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params"),c=A(s.getBindGroupLayout(0),[n,u]),{commandEncoder:f,ts:p}=S(s,c,N(r)),l=i?null:_(f,n);P(f);let m=await E(p);if(i)return d(u),m!==void 0?{gpuTimeMs:m}:{};let b=await G(l,Float32Array);return d(n,u),m!==void 0?{x:b,gpuTimeMs:m}:b}async function Yr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof w))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await W(t,"sswap"),c=s?e._buf:g(e,"sswap-x",!0),f=n?o._buf:g(o,"sswap-y",!0),p=j([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sswap-params"),l=A(u.getBindGroupLayout(0),[c,f,p]),{commandEncoder:m,ts:b}=S(u,l,N(r)),y=s?null:_(m,c),B=n?null:_(m,f);P(m);let x=await E(b);if(s&&n)return d(p),x!==void 0?{gpuTimeMs:x}:{};let h=await G(y,Float32Array),v=await G(B,Float32Array);return d(c,f,p),x!==void 0?{x:h,y:v,gpuTimeMs:x}:{x:h,y:v}}async function $r(t,r,e,a,o,i,s){let n=a instanceof w,u=i instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(!isFinite(e))throw new Error("alpha must be finite.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:i};if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await W(t,"saxpy"),f=n?a._buf:g(a,"saxpy-x",!1),p=u?i._buf:g(i,"saxpy-y",!0),l=j([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"saxpy-params"),m=A(c.getBindGroupLayout(0),[f,p,l]),{commandEncoder:b,ts:y}=S(c,m,N(r)),B=u?null:_(b,p);P(b);let x=await E(y);if(u&&n)return d(l),x!==void 0?{gpuTimeMs:x}:{};let h=await G(B,Float32Array);return d(f,p,l),x!==void 0?{y:h,gpuTimeMs:x}:{y:h}}async function Qr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await W(t,"scopy"),c=s?e._buf:g(e,"scopy-x",!1),f=n?o._buf:g(o,"scopy-y",!0),p=j([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"scopy-params"),l=A(u.getBindGroupLayout(0),[c,f,p]),{commandEncoder:m,ts:b}=S(u,l,N(r)),y=n?null:_(m,f);P(m);let B=await E(b);if(n&&s)return d(p),B!==void 0?{gpuTimeMs:B}:{};let x=await G(y,Float32Array);return d(c,f,p),B!==void 0?{y:x,gpuTimeMs:B}:{y:x}}var Xr=64;async function Hr(t,r,e,a,o,i){let s=e instanceof w,n=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await W(t,"sdot"),c=await W(t,"reduction/sum"),f=s?e._buf:g(e,"sdot-x",!1),p=n?o._buf:g(o,"sdot-y",!1),l=D(2*Xr*4,"sdot-partials"),m=C(4,"sdot-result"),b=j([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sdot-params"),y=A(u.getBindGroupLayout(0),[f,p,l,b]),{commandEncoder:B,ts:x}=S(u,y,2*Xr);P(B);let h=A(c.getBindGroupLayout(0),[l,m]),{commandEncoder:v,ts:k}=S(c,h,1),R=_(v,m);P(v);let[U,T,V]=await Promise.all([E(x),E(k),G(R,Float32Array)]);return s&&n?(d(l,m,b),U!==void 0&&T!==void 0?{dot:V[0],gpuTimeMs:U+T}:{dot:V[0]}):(d(f,p,l,m,b,R),U!==void 0&&T!==void 0?{dot:V[0],gpuTimeMs:U+T}:{dot:V[0]})}var Kr=64;async function Zr(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await W(t,"sasum"),s=await W(t,"reduction/sum"),n=o?e._buf:g(e,"sasum-x",!1),u=D(2*Kr*4,"sasum-partials"),c=C(4,"sasum-result"),f=j([{value:r,type:"u32"},{value:a,type:"u32"}],"sasum-params"),p=A(i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:l,ts:m}=S(i,p,2*Kr);P(l);let b=A(s.getBindGroupLayout(0),[u,c]),{commandEncoder:y,ts:B}=S(s,b,1),x=_(y,c);P(y);let[h,v,k]=await Promise.all([E(m),E(B),G(x,Float32Array)]);return o?(d(u,c,f),h!==void 0&&v!==void 0?{asum:k[0],gpuTimeMs:h+v}:{asum:k[0]}):(d(n,u,c,f,x),h!==void 0&&v!==void 0?{asum:k[0],gpuTimeMs:h+v}:{asum:k[0]})}var Jr=64;async function re(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await W(t,"snrm2"),s=await W(t,"reduction/sum"),n=o?e._buf:g(e,"snrm2-x",!1),u=D(2*Jr*4,"snrm2-partials"),c=C(4,"snrm2-result"),f=j([{value:r,type:"u32"},{value:a,type:"u32"}],"snrm2-params"),p=A(i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:l,ts:m}=S(i,p,2*Jr);P(l);let b=A(s.getBindGroupLayout(0),[u,c]),{commandEncoder:y,ts:B}=S(s,b,1),x=_(y,c);P(y);let[h,v,k]=await Promise.all([E(m),E(B),G(x,Float32Array)]),R=Math.sqrt(k[0]);return o?(d(u,c,f),h!==void 0&&v!==void 0?{nrm2:R,gpuTimeMs:h+v}:{nrm2:R}):(d(n,u,c,f,x),h!==void 0&&v!==void 0?{nrm2:R,gpuTimeMs:h+v}:{nrm2:R})}var Z=64;async function ee(t,r,e,a){let o=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await W(t,"isamax"),s=await W(t,"reduction/argmax"),n=o?e._buf:g(e,"isamax-x",!1),u=D(2*Z*4,"isamax-partials-val"),c=D(2*Z*4,"isamax-partials-idx"),f=C(4,"isamax-result"),p=j([{value:r,type:"u32"},{value:a,type:"u32"}],"isamax-params"),l=A(i.getBindGroupLayout(0),[n,u,c,p]),{commandEncoder:m,ts:b}=S(i,l,2*Z);P(m);let y=A(s.getBindGroupLayout(0),[u,c,f]),{commandEncoder:B,ts:x}=S(s,y,1),h=_(B,f);P(B);let[v,k,R]=await Promise.all([E(b),E(x),G(h,Uint32Array)]),U=R[0];return o?(d(u,c,f,p),v!==void 0&&k!==void 0?{index:U,gpuTimeMs:v+k}:{index:U}):(d(n,u,c,f,p,h),v!==void 0&&k!==void 0?{index:U,gpuTimeMs:v+k}:{index:U})}async function te(t,r,e,a,o,i,s,n){let u=e instanceof w,c=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(isNaN(s)||isNaN(n))throw new Error("c and s must not be NaN.");if(!isFinite(s))throw new Error("c must be finite.");if(!isFinite(n))throw new Error("s must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await W(t,"srot"),p=u?e._buf:g(e,"srot-x",!0),l=c?o._buf:g(o,"srot-y",!0),m=j([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srot-params"),b=A(f.getBindGroupLayout(0),[p,l,m]),{commandEncoder:y,ts:B}=S(f,b,N(r)),x=u?null:_(y,p),h=c?null:_(y,l);P(y);let v=await E(B);if(u&&c)return d(m),v!==void 0?{gpuTimeMs:v}:{};let[k,R]=await Promise.all([G(x,Float32Array),G(h,Float32Array)]);return d(p,l,m),v!==void 0?{x:k,y:R,gpuTimeMs:v}:{x:k,y:R}}async function ae(t,r,e,a,o,i,s){let n=e instanceof w,u=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await W(t,"srotm"),f=n?e._buf:g(e,"srotm-x",!0),p=u?o._buf:g(o,"srotm-y",!0),l=g(s,"srotm-param",!1),m=j([{value:r,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srotm-params"),b=A(c.getBindGroupLayout(0),[f,p,l,m]),{commandEncoder:y,ts:B}=S(c,b,N(r)),x=n?null:_(y,f),h=u?null:_(y,p);P(y);let v=await E(B);if(n&&u)return d(l,m),v!==void 0?{gpuTimeMs:v}:{};let[k,R]=await Promise.all([G(x,Float32Array),G(h,Float32Array)]);return d(f,p,l,m),v!==void 0?{x:k,y:R,gpuTimeMs:v}:{x:k,y:R}}async function oe(t,r,e,a,o,i,s,n,u,c,f,p){let l=n instanceof w,m=f instanceof w,b=i instanceof z,y=r==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!y&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(p)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(isNaN(o))throw new Error("alpha must not be NaN.");if(!isFinite(o))throw new Error("alpha must be finite.");if(isNaN(c))throw new Error("beta must not be NaN.");if(!isFinite(c))throw new Error("beta must be finite.");if(u<=0||p<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!b&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(l&&!b)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(b&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(b&&(i.rows<e||i.cols<a))throw new Error("A is too small for the given m and n.");if(e<=0||a<=0)return m?{}:{y:f};let B=y?a:e,x=y?e:a;if(!b&&i.length<(e-1)*s+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(B-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(x-1)*p+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let v=await W(t,y?"sgemv_n":"sgemv_t"),k=b?i._buf:g(i,"sgemv-A",!1),R=l?n._buf:g(n,"sgemv-x",!1),U=m?f._buf:g(f,"sgemv-y",!0),T=j([{value:e,type:"u32"},{value:a,type:"u32"},{value:o,type:"f32"},{value:c,type:"f32"},{value:u,type:"u32"},{value:p,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let V=A(v.getBindGroupLayout(0),[k,R,U,T]),q=y?Math.min(e,t.limits.maxComputeWorkgroupsPerDimension):N(x),{commandEncoder:O,ts:ne}=S(v,V,q),se=m?null:_(O,U);P(O);let Y=await E(ne);if(m)return Y!==void 0?{gpuTimeMs:Y}:{};let J=await G(se,Float32Array);return Y!==void 0?{y:J,gpuTimeMs:Y}:{y:J}}finally{b||d(k),l||d(R),m||d(U),d(T)}}async function ie(t,r,e,a,o,i,s,n,u,c,f){let p=s instanceof w,l=c instanceof w,m=o instanceof z,b=r==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!b&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(isNaN(a))throw new Error("alpha must not be NaN.");if(!isFinite(a))throw new Error("alpha must be finite.");if(isNaN(u))throw new Error("beta must not be NaN.");if(!isFinite(u))throw new Error("beta must be finite.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<e)throw new Error("lda must be >= n.");if(!m&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&i!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(o.rows<e||o.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return l?{}:{y:c};if(!m&&o.length<(e-1)*i+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(c.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let y=await W(t,"ssymv"),B=null,x=null,h=null,v=null;try{B=m?o._buf:g(o,"ssymv-A",!1),x=p?s._buf:g(s,"ssymv-x",!1),h=l?c._buf:g(c,"ssymv-y",!0),v=j([{value:e,type:"u32"},{value:a,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:b?0:1,type:"u32"}],"ssymv-params");let k=A(y.getBindGroupLayout(0),[B,x,h,v]),R=Math.min(e,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:U,ts:T}=S(y,k,R),V=l?null:_(U,h);P(U);let q=await E(T);if(l)return q!==void 0?{gpuTimeMs:q}:{};let O=await G(V,Float32Array);return q!==void 0?{y:O,gpuTimeMs:q}:{y:O}}finally{!m&&B&&d(B),!p&&x&&d(x),!l&&h&&d(h),v&&d(v)}}return le(Ie);})();
