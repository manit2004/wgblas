var wgblas=(()=>{var de=Object.create;var X=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var we=Object.getOwnPropertyNames;var be=Object.getPrototypeOf,ve=Object.prototype.hasOwnProperty;var H=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var I=(a,e,r)=>()=>{if(r)throw r[0];try{return a&&(e=a(a=0)),e}catch(o){throw r=[o],o}};var tr=(a,e)=>{for(var r in e)X(a,r,{get:e[r],enumerable:!0})},ar=(a,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of we(e))!ve.call(a,t)&&t!==r&&X(a,t,{get:()=>e[t],enumerable:!(o=ge(e,t))||o.enumerable});return a};var K=(a,e,r)=>(r=a!=null?de(be(a)):{},ar(e||!a||!a.__esModule?X(r,"default",{value:a,enumerable:!0}):r,a)),he=a=>ar(X({},"__esModule",{value:!0}),a);var gr,dr=I(()=>{gr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Er,Ar=I(()=>{Er=`// scopy: y = x

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
`});var Pr,Br=I(()=>{Pr=`// sdot: result = sum(x[i] * y[i])
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
`});var jr,kr=I(()=>{jr=`// sasum: result = sum(|x[i]|)
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
`});var Fr,Sr=I(()=>{Fr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Nr,Wr=I(()=>{Nr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Rr,Vr=I(()=>{Rr=`// isamax: returns index of element with largest absolute value
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
`});var zr,Lr=I(()=>{zr=`// ssymv: y = alpha * A * x + beta * y
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
`});var $r,Yr=I(()=>{$r=`// strsv: solve op(A) * x = b for x, in place (x holds b on input, the
// solution on output).
// A is n\xD7n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
// op(A) is A (trans=0) or A^T (trans=1).
// diag=1 (unit) treats the diagonal as 1 without reading A's diagonal values.
//
// Unlike strmv (one workgroup per row, rows fully independent), each row's
// solution here depends on every previously-solved row, so this dispatches
// as a SINGLE workgroup that walks the rows in the order each triangular
// case requires (forward or backward substitution), with a barrier after
// each row so x[i] is fully written before any thread reads it while
// solving row i\xB11. This caps available parallelism at one workgroup's
// threads (WGS, used for each row's dot-product reduction) regardless of
// n \u2014 an inherent property of triangular solve (each row is a real
// dependency, not something to parallelize away), not an oversight.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  incx:  u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(@builtin(local_invocation_id) lid: vec3u) {
  // Forward substitution (i = 0..n-1) solves no-trans+lower and trans+upper;
  // backward substitution (i = n-1..0) solves no-trans+upper and trans+lower
  // \u2014 same pairing strmv uses to decide which off-diagonal half to read.
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  for (var step = 0u; step < params.n; step++) {
    var i: u32;
    if forward {
      i = step;
    } else {
      i = params.n - 1u - step;
    }

    // Dot product against the already-solved x[j] this row depends on.
    var acc = 0.0f;
    if params.trans == 0u {
      if params.uplo == 0u {
        // Lower, no-trans: row i = \u03A3_{j<i} A[i,j]*x[j] + A[i,i]*x[i]
        for (var j = lid.x; j < i; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      } else {
        // Upper, no-trans: row i = A[i,i]*x[i] + \u03A3_{j>i} A[i,j]*x[j]
        for (var j = i + 1u + lid.x; j < params.n; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      }
    } else {
      if params.uplo == 0u {
        // Lower, trans (== upper A^T): A[i,i]*x[i] + \u03A3_{j>i} A[j,i]*x[j]
        for (var j = i + 1u + lid.x; j < params.n; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
        }
      } else {
        // Upper, trans (== lower A^T): \u03A3_{j<i} A[j,i]*x[j] + A[i,i]*x[i]
        for (var j = lid.x; j < i; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
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
      let rhs = x[i * params.incx] - scratch[0];
      // A[i,i] is unaffected by transpose, so both op(A) cases divide by the same element.
      if params.diag == 1u {
        x[i * params.incx] = rhs;
      } else {
        x[i * params.incx] = rhs / A[i * params.lda + i];
      }
    }
    workgroupBarrier(); // x[i] must be visible to every thread before the next row reads it
  }
}
`});var Qr={};tr(Qr,{shaderSources:()=>Me});var Me,Xr=I(()=>{dr();wr();vr();yr();_r();Ar();Br();kr();Sr();Wr();Ur();Vr();Mr();Dr();Lr();qr();Yr();Me={"reduction/argmax":gr,"reduction/sum":br,sscal:hr,sswap:xr,saxpy:Gr,scopy:Er,sdot:Pr,sasum:jr,snrm2:Fr,srot:Nr,srotm:Ir,isamax:Rr,sgemv_n:Tr,sgemv_t:Cr,ssymv:zr,strmv:Or,strsv:$r}});var ze={};tr(ze,{GpuMatrix:()=>M,GpuVector:()=>w,cleanup:()=>lr,gpuName:()=>cr,init:()=>fr,isamax:()=>se,randomFloat32Array:()=>mr,randomFloat64Array:()=>pr,sasum:()=>oe,saxpy:()=>Jr,scopy:()=>re,sdot:()=>te,sgemv:()=>le,snrm2:()=>ne,srot:()=>ue,srotm:()=>fe,sscal:()=>Kr,sswap:()=>Zr,ssymv:()=>ce,strmv:()=>me,strsv:()=>pe});function or(a,e){return e?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ir(){if(!sr())return{querySet:null,passDescriptor:void 0};let e=N().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function nr(a,e){if(!e)return null;let r=N(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(e,0,2,o,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,t,0,16),{tsReadBuffer:t,resolveBuffer:o,querySet:e}}async function E(a){if(!a)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=a;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var T=null,O=null,ur=null,Z=!1;async function fr({powerPreference:a="high-performance",benchmark:e=!1}={}){if(T)return T;let r;if(typeof window>"u"){let{create:i,globals:s}=await import("webgpu");Object.assign(globalThis,s),r=i([]),ur=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if(O=await r.requestAdapter({powerPreference:a})??await r.requestAdapter(),!O)throw new Error("No WebGPU adapter found.");Z=e;let t=[...or(O,e).requiredFeatures??[]];return T=await O.requestDevice({requiredFeatures:t}),T.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),T}function lr(){T&&(T.destroy(),T=null),O=null,ur=null,Z=!1}function cr(){if(!O)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:e}=O.info;return{description:e||"unknown",device:a||"unknown"}}function sr(){return Z}function N(){if(!T)throw new Error("WebGPU device not initialized \u2014 call init() first.");return T}function m(...a){a.flat().forEach(e=>e.destroy())}function g(a,e="blas-input",r=!1){let o=N(),t=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=o.createBuffer({label:e,size:i,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(a),n.unmap(),n}function C(a,e="blas-storage"){return N().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE})}function z(a,e="blas-result"){return N().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function _(a,e){let o=N().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(e,0,o,0,e.size),o}function F(a,e="blas-params"){let r=N(),o=a.length*4,t=Math.ceil(o/16)*16,i=new ArrayBuffer(t),s=new DataView(i);a.forEach(({value:u,type:f},l)=>{let c=l*4;if(f==="u32")s.setUint32(c,u,!0);else if(f==="i32")s.setInt32(c,u,!0);else if(f==="f32")s.setFloat32(c,u,!0);else throw new Error(`Unknown param type "${f}". Use "f32", "u32", or "i32".`)});let n=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(n,0,i),n}async function G(a,e=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new e(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}var w=class a{constructor(e,r,o=Float32Array){this._buf=e,this.length=r,this.dtype=o}static from(e){if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let r=g(e,"gpu-vector",!0);return new a(r,e.length,e.constructor)}async read(){let e=N(),r=e.createCommandEncoder(),o=_(r,this._buf);return e.queue.submit([r.finish()]),G(o,this.dtype)}destroy(){this._buf.destroy()}};var M=class a{constructor(e,r,o,t){this._buf=e,this.rows=r,this.cols=o,this.lda=t}static from(e,r,o,t=o){if(!(e instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(t)||t<o)throw new Error("lda must be an integer >= cols.");if(e.length<r*t)throw new Error("data does not have enough elements for the given rows and lda.");let i=g(e.subarray(0,r*t),"gpu-matrix",!0);return new a(i,r,o,t)}async read(){let e=N(),r=e.createCommandEncoder(),o=_(r,this._buf);e.queue.submit([r.finish()]);let t=await G(o,Float32Array);if(this.lda===this.cols)return t;let i=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)i.set(t.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return i}destroy(){this._buf.destroy()}};function mr(a,e=-1,r=1){let o=new Float32Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function pr(a,e=-1,r=1){let o=new Float64Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function B(a,e){let r=N(),o=e.map((t,i)=>({binding:i,resource:{buffer:t}}));return r.createBindGroup({layout:a,entries:o})}var ye=new WeakMap;function P(a){N().queue.submit([a.finish()])}function k(a,e,r){let o=N(),{querySet:t,passDescriptor:i}=ir(),s=o.createCommandEncoder(),n=s.beginComputePass(i);n.setPipeline(a),n.setBindGroup(0,e),typeof r=="number"?n.dispatchWorkgroups(r):n.dispatchWorkgroups(r.x,r.y),n.end();let u=nr(s,t);return ye.set(s,n),{commandEncoder:s,ts:u}}var Ce={},J=new WeakMap;async function j(a,e){J.has(a)||J.set(a,new Map);let r=J.get(a);return r.has(e)||r.set(e,await De(e)),r.get(e)}async function Te(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(Xr(),Qr)),r=e[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:t}=await import("path"),i=o(r(Ce.url));return e(t(i,`../shaders/${a}.wgsl`),"utf8")}}async function De(a){let e=N(),r=await Te(a),o=e.createShaderModule({label:a,code:r}),i=(await o.getCompilationInfo()).messages.filter(n=>n.type==="error");if(i.length>0)throw new Error(`Shader "${a}" compilation failed:
${i.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=e.createComputePipeline({label:a,layout:"auto",compute:{module:o}});return s._shaderModule=o,s}var Le=64,Hr=8;function V(a,e){let r=N().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(a/Le),r):{x:Math.min(Math.ceil(e/Hr),r),y:Math.min(Math.ceil(a/Hr),r)}}async function Kr(a,e,r,o,t){let i=o instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:o;if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await j(a,"sscal"),n=null,u=null;try{n=i?o._buf:g(o,"sscal-x",!0),u=F([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:l,ts:c}=k(s,f,V(e)),d=i?null:_(l,n);P(l);let p=await E(c);if(i)return p!==void 0?{gpuTimeMs:p}:{};let b=await G(d,Float32Array);return p!==void 0?{x:b,gpuTimeMs:p}:b}finally{!i&&n&&m(n),u&&m(u)}}async function Zr(a,e,r,o,t,i){let s=r instanceof w,n=t instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof w))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await j(a,"sswap"),f=null,l=null,c=null;try{f=s?r._buf:g(r,"sswap-x",!0),l=n?t._buf:g(t,"sswap-y",!0),c=F([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let d=B(u.getBindGroupLayout(0),[f,l,c]),{commandEncoder:p,ts:b}=k(u,d,V(e)),v=s?null:_(p,f),x=n?null:_(p,l);P(p);let h=await E(b);if(s&&n)return h!==void 0?{gpuTimeMs:h}:{};let A=await G(v,Float32Array),y=await G(x,Float32Array);return h!==void 0?{x:A,y,gpuTimeMs:h}:{x:A,y}}finally{!s&&f&&m(f),!n&&l&&m(l),c&&m(c)}}async function Jr(a,e,r,o,t,i,s){let n=o instanceof w,u=i instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{y:i};if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await j(a,"saxpy"),l=null,c=null,d=null;try{l=n?o._buf:g(o,"saxpy-x",!1),c=u?i._buf:g(i,"saxpy-y",!0),d=F([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let p=B(f.getBindGroupLayout(0),[l,c,d]),{commandEncoder:b,ts:v}=k(f,p,V(e)),x=u?null:_(b,c);P(b);let h=await E(v);if(u&&n)return h!==void 0?{gpuTimeMs:h}:{};let A=await G(x,Float32Array);return h!==void 0?{y:A,gpuTimeMs:h}:{y:A}}finally{!n&&l&&m(l),!u&&c&&m(c),d&&m(d)}}async function re(a,e,r,o,t,i){let s=r instanceof w,n=t instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await j(a,"scopy"),f=null,l=null,c=null;try{f=s?r._buf:g(r,"scopy-x",!1),l=n?t._buf:g(t,"scopy-y",!0),c=F([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let d=B(u.getBindGroupLayout(0),[f,l,c]),{commandEncoder:p,ts:b}=k(u,d,V(e)),v=n?null:_(p,l);P(p);let x=await E(b);if(n&&s)return x!==void 0?{gpuTimeMs:x}:{};let h=await G(v,Float32Array);return x!==void 0?{y:h,gpuTimeMs:x}:{y:h}}finally{!s&&f&&m(f),!n&&l&&m(l),c&&m(c)}}var ee=64;async function te(a,e,r,o,t,i){let s=r instanceof w,n=t instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await j(a,"sdot"),f=await j(a,"reduction/sum"),l=null,c=null,d=null,p=null,b=null;try{l=s?r._buf:g(r,"sdot-x",!1),c=n?t._buf:g(t,"sdot-y",!1),d=C(2*ee*4,"sdot-partials"),p=z(4,"sdot-result"),b=F([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let v=B(u.getBindGroupLayout(0),[l,c,d,b]),{commandEncoder:x,ts:h}=k(u,v,2*ee);P(x);let A=B(f.getBindGroupLayout(0),[d,p]),{commandEncoder:y,ts:S}=k(f,A,1),W=_(y,p);P(y);let[U,R,D]=await Promise.all([E(h),E(S),G(W,Float32Array)]);return U!==void 0&&R!==void 0?{dot:D[0],gpuTimeMs:U+R}:{dot:D[0]}}finally{!s&&l&&m(l),!n&&c&&m(c),d&&m(d),p&&m(p),b&&m(b)}}var ae=64;async function oe(a,e,r,o){let t=r instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await j(a,"sasum"),s=await j(a,"reduction/sum"),n=null,u=null,f=null,l=null;try{n=t?r._buf:g(r,"sasum-x",!1),u=C(2*ae*4,"sasum-partials"),f=z(4,"sasum-result"),l=F([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params");let c=B(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:d,ts:p}=k(i,c,2*ae);P(d);let b=B(s.getBindGroupLayout(0),[u,f]),{commandEncoder:v,ts:x}=k(s,b,1),h=_(v,f);P(v);let[A,y,S]=await Promise.all([E(p),E(x),G(h,Float32Array)]);return A!==void 0&&y!==void 0?{asum:S[0],gpuTimeMs:A+y}:{asum:S[0]}}finally{!t&&n&&m(n),u&&m(u),f&&m(f),l&&m(l)}}var ie=64;async function ne(a,e,r,o){let t=r instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await j(a,"snrm2"),s=await j(a,"reduction/sum"),n=null,u=null,f=null,l=null;try{n=t?r._buf:g(r,"snrm2-x",!1),u=C(2*ie*4,"snrm2-partials"),f=z(4,"snrm2-result"),l=F([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let c=B(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:d,ts:p}=k(i,c,2*ie);P(d);let b=B(s.getBindGroupLayout(0),[u,f]),{commandEncoder:v,ts:x}=k(s,b,1),h=_(v,f);P(v);let[A,y,S]=await Promise.all([E(p),E(x),G(h,Float32Array)]),W=Math.sqrt(S[0]);return A!==void 0&&y!==void 0?{nrm2:W,gpuTimeMs:A+y}:{nrm2:W}}finally{!t&&n&&m(n),u&&m(u),f&&m(f),l&&m(l)}}var rr=64;async function se(a,e,r,o){let t=r instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await j(a,"isamax"),s=await j(a,"reduction/argmax"),n=null,u=null,f=null,l=null,c=null;try{n=t?r._buf:g(r,"isamax-x",!1),u=C(2*rr*4,"isamax-partials-val"),f=C(2*rr*4,"isamax-partials-idx"),l=z(4,"isamax-result"),c=F([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params");let d=B(i.getBindGroupLayout(0),[n,u,f,c]),{commandEncoder:p,ts:b}=k(i,d,2*rr);P(p);let v=B(s.getBindGroupLayout(0),[u,f,l]),{commandEncoder:x,ts:h}=k(s,v,1),A=_(x,l);P(x);let[y,S,W]=await Promise.all([E(b),E(h),G(A,Uint32Array)]),U=W[0];return y!==void 0&&S!==void 0?{index:U,gpuTimeMs:y+S}:{index:U}}finally{!t&&n&&m(n),u&&m(u),f&&m(f),l&&m(l),c&&m(c)}}async function ue(a,e,r,o,t,i,s,n){let u=r instanceof w,f=t instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await j(a,"srot"),c=null,d=null,p=null;try{c=u?r._buf:g(r,"srot-x",!0),d=f?t._buf:g(t,"srot-y",!0),p=F([{value:e,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let b=B(l.getBindGroupLayout(0),[c,d,p]),{commandEncoder:v,ts:x}=k(l,b,V(e)),h=u?null:_(v,c),A=f?null:_(v,d);P(v);let y=await E(x);if(u&&f)return y!==void 0?{gpuTimeMs:y}:{};let[S,W]=await Promise.all([G(h,Float32Array),G(A,Float32Array)]);return y!==void 0?{x:S,y:W,gpuTimeMs:y}:{x:S,y:W}}finally{!u&&c&&m(c),!f&&d&&m(d),p&&m(p)}}async function fe(a,e,r,o,t,i,s){let n=r instanceof w,u=t instanceof w;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return n?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await j(a,"srotm"),l=null,c=null,d=null,p=null;try{l=n?r._buf:g(r,"srotm-x",!0),c=u?t._buf:g(t,"srotm-y",!0),d=g(s,"srotm-param",!1),p=F([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let b=B(f.getBindGroupLayout(0),[l,c,d,p]),{commandEncoder:v,ts:x}=k(f,b,V(e)),h=n?null:_(v,l),A=u?null:_(v,c);P(v);let y=await E(x);if(n&&u)return y!==void 0?{gpuTimeMs:y}:{};let[S,W]=await Promise.all([G(h,Float32Array),G(A,Float32Array)]);return y!==void 0?{x:S,y:W,gpuTimeMs:y}:{x:S,y:W}}finally{!n&&l&&m(l),!u&&c&&m(c),d&&m(d),p&&m(p)}}async function le(a,e,r,o,t,i,s,n,u,f,l,c){let d=n instanceof w,p=l instanceof w,b=i instanceof M,v=e==="no-transpose";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!v&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u)||!Number.isInteger(c)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(u<=0||c<=0)throw new Error("incx and incy must be positive.");if(s<o)throw new Error("lda must be >= n.");if(!b&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!b)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&n._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(b&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(b&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return p?{}:{y:l};let x=v?o:r,h=v?r:o;if(!b&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(x-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(l.length<(h-1)*c+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let y=await j(a,v?"sgemv_n":"sgemv_t"),S=b?i._buf:g(i,"sgemv-A",!1),W=d?n._buf:g(n,"sgemv-x",!1),U=p?l._buf:g(l,"sgemv-y",!0),R=F([{value:r,type:"u32"},{value:o,type:"u32"},{value:t,type:"f32"},{value:f,type:"f32"},{value:u,type:"u32"},{value:c,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let D=B(y.getBindGroupLayout(0),[S,W,U,R]),L=v?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):V(h),{commandEncoder:q,ts:Y}=k(y,D,L),$=p?null:_(q,U);P(q);let Q=await E(Y);if(p)return Q!==void 0?{gpuTimeMs:Q}:{};let er=await G($,Float32Array);return Q!==void 0?{y:er,gpuTimeMs:Q}:{y:er}}finally{b||m(S),d||m(W),p||m(U),m(R)}}async function ce(a,e,r,o,t,i,s,n,u,f,l){let c=s instanceof w,d=f instanceof w,p=t instanceof M,b=e==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!b&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(n<=0||l<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&s._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return d?{}:{y:f};if(!p&&t.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(f.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let v=await j(a,"ssymv"),x=null,h=null,A=null,y=null;try{x=p?t._buf:g(t,"ssymv-A",!1),h=c?s._buf:g(s,"ssymv-x",!1),A=d?f._buf:g(f,"ssymv-y",!0),y=F([{value:r,type:"u32"},{value:o,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:i,type:"u32"},{value:b?0:1,type:"u32"}],"ssymv-params");let S=B(v.getBindGroupLayout(0),[x,h,A,y]),W=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:U,ts:R}=k(v,S,W),D=d?null:_(U,A);P(U);let L=await E(R);if(d)return L!==void 0?{gpuTimeMs:L}:{};let q=await G(D,Float32Array);return L!==void 0?{y:q,gpuTimeMs:L}:{y:q}}finally{!p&&x&&m(x),!c&&h&&m(h),!d&&A&&m(A),y&&m(y)}}async function me(a,e,r,o,t,i,s,n,u,f,l){let c=n instanceof w,d=f instanceof w,p=i instanceof M,b=e==="lower",v=r==="no-transpose",x=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!b&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!v&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!x&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(u)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(u<=0||l<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!p&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&d&&i._buf===f._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return d?{}:{y:f};if(!p&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(f.length<(t-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let h=await j(a,"strmv"),A=null,y=null,S=null,W=null;try{A=p?i._buf:g(i,"strmv-A",!1),y=c?n._buf:g(n,"strmv-x",!1),S=d?f._buf:g(f,"strmv-y",!0),W=F([{value:t,type:"u32"},{value:u,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"},{value:v?0:1,type:"u32"},{value:b?0:1,type:"u32"},{value:x?1:0,type:"u32"}],"strmv-params");let U=B(h.getBindGroupLayout(0),[A,y,S,W]),R=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:D,ts:L}=k(h,U,R),q=d?null:_(D,S);P(D);let Y=await E(L);if(d)return Y!==void 0?{gpuTimeMs:Y}:{};let $=await G(q,Float32Array);return Y!==void 0?{y:$,gpuTimeMs:Y}:{y:$}}finally{!p&&A&&m(A),!c&&y&&m(y),!d&&S&&m(S),W&&m(W)}}async function pe(a,e,r,o,t,i,s,n,u){let f=n instanceof w,l=i instanceof M,c=e==="lower",d=r==="no-transpose",p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!c&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!d&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(u)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(u<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!l&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!l)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(l&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{x:n};if(!l&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");let b=await j(a,"strsv"),v=null,x=null,h=null;try{v=l?i._buf:g(i,"strsv-A",!1),x=f?n._buf:g(n,"strsv-x",!0),h=F([{value:t,type:"u32"},{value:u,type:"u32"},{value:s,type:"u32"},{value:d?0:1,type:"u32"},{value:c?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-params");let A=B(b.getBindGroupLayout(0),[v,x,h]),{commandEncoder:y,ts:S}=k(b,A,1),W=f?null:_(y,x);P(y);let U=await E(S);if(f)return U!==void 0?{gpuTimeMs:U}:{};let R=await G(W,Float32Array);return U!==void 0?{x:R,gpuTimeMs:U}:{x:R}}finally{!l&&v&&m(v),!f&&x&&m(x),h&&m(h)}}return he(ze);})();
