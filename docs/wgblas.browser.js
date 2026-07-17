var wgblas=(()=>{var me=Object.create;var X=Object.defineProperty;var fe=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var de=Object.getPrototypeOf,ge=Object.prototype.hasOwnProperty;var H=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var U=(t,e,r)=>()=>{if(r)throw r[0];try{return t&&(e=t(t=0)),e}catch(o){throw r=[o],o}};var tr=(t,e)=>{for(var r in e)X(t,r,{get:e[r],enumerable:!0})},ar=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of pe(e))!ge.call(t,a)&&a!==r&&X(t,a,{get:()=>e[a],enumerable:!(o=fe(e,a))||o.enumerable});return t};var K=(t,e,r)=>(r=t!=null?me(de(t)):{},ar(e||!t||!t.__esModule?X(r,"default",{value:t,enumerable:!0}):r,t)),we=t=>ar(X({},"__esModule",{value:!0}),t);var gr,dr=U(()=>{gr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var br,wr=U(()=>{br=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var hr,vr=U(()=>{hr=`// sscal: x = alpha * x

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
`});var yr,xr=U(()=>{yr=`// sswap: x <-> y

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
`});var Gr,_r=U(()=>{Gr=`// saxpy: y = alpha * x + y

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
`});var Er,Br=U(()=>{Er=`// scopy: y = x

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
`});var Pr,Ar=U(()=>{Pr=`// sdot: result = sum(x[i] * y[i])
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
`});var Sr,kr=U(()=>{Sr=`// sasum: result = sum(|x[i]|)
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
`});var Wr,Fr=U(()=>{Wr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Ir,Nr=U(()=>{Ir=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Ur,Tr=U(()=>{Ur=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var jr,Rr=U(()=>{jr=`// isamax: returns index of element with largest absolute value
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
`});var Dr,Mr=U(()=>{Dr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Lr,Vr=U(()=>{Lr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var zr,Cr=U(()=>{zr=`// ssymv: y = alpha * A * x + beta * y
// A is n\xD7n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
//
// Tiled: TILE=16 rows and cols per tile, WGS=256.
// Shared memory: smem_A (row contribs), smem_B (column contribs via transposed read).
// smem_B uses padded stride TPAD=17 so transposed reads avoid bank conflicts.
// Split loop: pure-lower tiles load smem_A only, diagonal tile loads both,
// pure-upper tiles load smem_B only. ~halves A reads vs monolithic tiling.
// Reduction: horizontal per-row, 4-level barrier tree within each row.

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

const TILE: u32 = 16u;
const WGS:  u32 = 256u;
const TPAD: u32 = 17u;

var<workgroup> smem_A:  array<f32, 256>;
var<workgroup> smem_B:  array<f32, 272>;
var<workgroup> smem_x:  array<f32, 16>;
var<workgroup> scratch: array<f32, 256>;

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let lr = lid.x >> 4u;   // row within tile  [0, TILE)
  let lc = lid.x & 15u;   // col within tile  [0, TILE)

  for (var r0 = wgid.x * TILE; r0 < params.n; r0 += nwg.x * TILE) {
    let global_row = r0 + lr;
    var acc = 0.0f;

    let c0_diag = r0;

    if params.uplo == 0u {
      // \u2500\u2500 lower stored \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

      // Pure lower tiles: c0 \u2208 [0, c0_diag).
      for (var c0 = 0u; c0 < c0_diag; c0 += TILE) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               global_row < params.n);
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Diagonal tile: c0 = c0_diag.
      {
        let col   = c0_diag + lc;
        let B_row = c0_diag + lr;
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
            acc += smem_B[lc * TPAD + lr] * smem_x[lc];
          }
        }
        workgroupBarrier();
      }

      // Pure upper tiles: c0 \u2208 [c0_diag+TILE, n).
      for (var c0 = c0_diag + TILE; c0 < params.n; c0 += TILE) {
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

      // Pure lower tiles.
      for (var c0 = 0u; c0 < c0_diag; c0 += TILE) {
        let col = c0 + lc;
        smem_B[lr * TPAD + lc] = select(0.0f, A[(c0 + lr) * params.lda + r0 + lc],
                                        ((c0 + lr) < params.n) & ((r0 + lc) < params.n));
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_B[lc * TPAD + lr] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Diagonal tile.
      {
        let col   = c0_diag + lc;
        let B_row = c0_diag + lr;
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

      // Pure upper tiles.
      for (var c0 = c0_diag + TILE; c0 < params.n; c0 += TILE) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }
    }

    // \u2500\u2500 horizontal reduction within each row \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    // Each row has 16 threads (lc in [0, 16)), sum horizontally to thread lc=0.
    scratch[lid.x] = acc;
    workgroupBarrier();

    // Level 1: threads (lr, 0-7) += (lr, 8-15)
    if lc < 8u { scratch[lid.x] += scratch[lr * 16u + (lc + 8u)]; }
    workgroupBarrier();

    // Level 2: threads (lr, 0-3) += (lr, 4-7)
    if lc < 4u { scratch[lid.x] += scratch[lr * 16u + (lc + 4u)]; }
    workgroupBarrier();

    // Level 3: threads (lr, 0-1) += (lr, 2-3)
    if lc < 2u { scratch[lid.x] += scratch[lr * 16u + (lc + 2u)]; }
    workgroupBarrier();

    // Level 4: thread (lr, 0) += (lr, 1)
    if lc < 1u { scratch[lid.x] += scratch[lr * 16u + 1u]; }
    workgroupBarrier();

    // Write result: thread (lr, 0) for each row writes y[r0+lr].
    if (lc == 0u) & (global_row < params.n) {
      let yi = global_row * params.incy;
      let A_contrib = select(0.0f, params.alpha * scratch[lid.x], params.alpha != 0.0f);
      let B_contrib = select(0.0f, params.beta * y[yi], params.beta != 0.0f);
      y[yi] = A_contrib + B_contrib;
    }
  }
}
`});var Or,qr=U(()=>{Or=`// strmv: y = op(A) * x
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
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let rb = row * params.lda;
    var acc = 0.0f;

    if params.trans == 0u {
      // No-transpose: y[i] = \u03A3_j A[i,j] * x[j]
      if params.uplo == 0u {
        // Lower: A[i,j] stored at A[i*lda+j] for j \u2264 i
        for (var j = lid.x; j <= row; j += WGS) {
          let aVal = select(A[rb + j], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[i,j] stored at A[i*lda+j] for j \u2265 i
        for (var j = row + lid.x; j < params.n; j += WGS) {
          let aVal = select(A[rb + j], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      }
    } else {
      // Transpose: y[i] = \u03A3_j A[j,i] * x[j]
      if params.uplo == 0u {
        // Lower: A[j,i] stored at A[j*lda+i] for j \u2265 i
        for (var j = row + lid.x; j < params.n; j += WGS) {
          let aVal = select(A[j * params.lda + row], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[j,i] stored at A[j*lda+i] for j \u2264 i
        for (var j = lid.x; j <= row; j += WGS) {
          let aVal = select(A[j * params.lda + row], 1.0, params.diag == 1u && j == row);
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
      let yi = row * params.incy;
      y[yi] = scratch[0];
    }
    workgroupBarrier();
  }
}
`});var Yr={};tr(Yr,{shaderSources:()=>Te});var Te,$r=U(()=>{dr();wr();vr();xr();_r();Br();Ar();kr();Fr();Nr();Tr();Rr();Mr();Vr();Cr();qr();Te={"reduction/argmax":gr,"reduction/sum":br,sscal:hr,sswap:yr,saxpy:Gr,scopy:Er,sdot:Pr,sasum:Sr,snrm2:Wr,srot:Ir,srotm:Ur,isamax:jr,sgemv_n:Dr,sgemv_t:Lr,ssymv:zr,strmv:Or}});var De={};tr(De,{GpuMatrix:()=>V,GpuVector:()=>b,cleanup:()=>lr,gpuName:()=>mr,init:()=>cr,isamax:()=>ie,randomFloat32Array:()=>fr,randomFloat64Array:()=>pr,sasum:()=>te,saxpy:()=>Kr,scopy:()=>Zr,sdot:()=>re,sgemv:()=>ue,snrm2:()=>oe,srot:()=>se,srotm:()=>ne,sscal:()=>Xr,sswap:()=>Hr,ssymv:()=>ce,strmv:()=>le});function or(t,e){return e?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ir(){if(!nr())return{querySet:null,passDescriptor:void 0};let e=I().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function sr(t,e){if(!e)return null;let r=I(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(e,0,2,o,0);let a=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(o,0,a,0,16),{tsReadBuffer:a,resolveBuffer:o,querySet:e}}async function A(t){if(!t)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=t;await e.mapAsync(GPUMapMode.READ);let a=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(a[1]-a[0]))/1e6}var D=null,O=null,ur=null,Z=!1;async function cr({powerPreference:t="high-performance",benchmark:e=!1}={}){if(D)return D;let r;if(typeof window>"u"){let{create:i,globals:s}=await import("webgpu");Object.assign(globalThis,s),r=i([]),ur=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if(O=await r.requestAdapter({powerPreference:t})??await r.requestAdapter(),!O)throw new Error("No WebGPU adapter found.");Z=e;let a=[...or(O,e).requiredFeatures??[]];return D=await O.requestDevice({requiredFeatures:a}),D.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),D}function lr(){D&&(D.destroy(),D=null),O=null,ur=null,Z=!1}function mr(){if(!O)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:e}=O.info;return{description:e||"unknown",device:t||"unknown"}}function nr(){return Z}function I(){if(!D)throw new Error("WebGPU device not initialized \u2014 call init() first.");return D}function d(...t){t.flat().forEach(e=>e.destroy())}function w(t,e="blas-input",r=!1){let o=I(),a=o.limits.maxStorageBufferBindingSize,i=t.byteLength;if(i>a)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${a} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=o.createBuffer({label:e,size:i,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}function L(t,e="blas-storage"){return I().createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE})}function z(t,e="blas-result"){return I().createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function _(t,e){let o=I().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(e,0,o,0,e.size),o}function W(t,e="blas-params"){let r=I(),o=t.length*4,a=Math.ceil(o/16)*16,i=new ArrayBuffer(a),s=new DataView(i);t.forEach(({value:u,type:c},m)=>{let f=m*4;if(c==="u32")s.setUint32(f,u,!0);else if(c==="i32")s.setInt32(f,u,!0);else if(c==="f32")s.setFloat32(f,u,!0);else throw new Error(`Unknown param type "${c}". Use "f32", "u32", or "i32".`)});let n=r.createBuffer({label:e,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(n,0,i),n}async function G(t,e=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let r=new e(t.getMappedRange().slice());return t.unmap(),r}finally{t.destroy()}}var b=class t{constructor(e,r,o=Float32Array){this._buf=e,this.length=r,this.dtype=o}static from(e){if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let r=w(e,"gpu-vector",!0);return new t(r,e.length,e.constructor)}async read(){let e=I(),r=e.createCommandEncoder(),o=_(r,this._buf);return e.queue.submit([r.finish()]),G(o,this.dtype)}destroy(){this._buf.destroy()}};var V=class t{constructor(e,r,o,a){this._buf=e,this.rows=r,this.cols=o,this.lda=a}static from(e,r,o,a=o){if(!(e instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(a)||a<o)throw new Error("lda must be an integer >= cols.");if(e.length<r*a)throw new Error("data does not have enough elements for the given rows and lda.");let i=w(e.subarray(0,r*a),"gpu-matrix",!0);return new t(i,r,o,a)}async read(){let e=I(),r=e.createCommandEncoder(),o=_(r,this._buf);e.queue.submit([r.finish()]);let a=await G(o,Float32Array);if(this.lda===this.cols)return a;let i=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)i.set(a.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return i}destroy(){this._buf.destroy()}};function fr(t,e=-1,r=1){let o=new Float32Array(t);for(let a=0;a<t;a++)o[a]=e+Math.random()*(r-e);return o}function pr(t,e=-1,r=1){let o=new Float64Array(t);for(let a=0;a<t;a++)o[a]=e+Math.random()*(r-e);return o}function P(t,e){let r=I(),o=e.map((a,i)=>({binding:i,resource:{buffer:a}}));return r.createBindGroup({layout:t,entries:o})}var be=new WeakMap;function k(t){I().queue.submit([t.finish()])}function S(t,e,r){let o=I(),{querySet:a,passDescriptor:i}=ir(),s=o.createCommandEncoder(),n=s.beginComputePass(i);n.setPipeline(t),n.setBindGroup(0,e),typeof r=="number"?n.dispatchWorkgroups(r):n.dispatchWorkgroups(r.x,r.y),n.end();let u=sr(s,a);return be.set(s,n),{commandEncoder:s,ts:u}}var je={},J=new WeakMap;async function F(t,e){J.has(t)||J.set(t,new Map);let r=J.get(t);return r.has(e)||r.set(e,await Re(e)),r.get(e)}async function Ue(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>($r(),Yr)),r=e[t];if(!r)throw new Error(`Shader "${t}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:a}=await import("path"),i=o(r(je.url));return e(a(i,`../shaders/${t}.wgsl`),"utf8")}}async function Re(t){let e=I(),r=await Ue(t),o=e.createShaderModule({label:t,code:r}),i=(await o.getCompilationInfo()).messages.filter(n=>n.type==="error");if(i.length>0)throw new Error(`Shader "${t}" compilation failed:
${i.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=e.createComputePipeline({label:t,layout:"auto",compute:{module:o}});return s._shaderModule=o,s}var Me=64,Qr=8;function R(t,e){let r=I().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(t/Me),r):{x:Math.min(Math.ceil(e/Qr),r),y:Math.min(Math.ceil(t/Qr),r)}}async function Xr(t,e,r,o,a){let i=o instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:o;if(o.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await F(t,"sscal"),n=i?o._buf:w(o,"sscal-x",!0),u=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:a,type:"u32"}],"sscal-params"),c=P(s.getBindGroupLayout(0),[n,u]),{commandEncoder:m,ts:f}=S(s,c,R(e)),p=i?null:_(m,n);k(m);let l=await A(f);if(i)return d(u),l!==void 0?{gpuTimeMs:l}:{};let v=await G(p,Float32Array);return d(n,u),l!==void 0?{x:v,gpuTimeMs:l}:v}async function Hr(t,e,r,o,a,i){let s=r instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(!(a instanceof Float32Array)&&!(a instanceof b))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==a.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"sswap"),c=s?r._buf:w(r,"sswap-x",!0),m=n?a._buf:w(a,"sswap-y",!0),f=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params"),p=P(u.getBindGroupLayout(0),[c,m,f]),{commandEncoder:l,ts:v}=S(u,p,R(e)),y=s?null:_(l,c),B=n?null:_(l,m);k(l);let h=await A(v);if(s&&n)return d(f),h!==void 0?{gpuTimeMs:h}:{};let x=await G(y,Float32Array),g=await G(B,Float32Array);return d(c,m,f),h!==void 0?{x,y:g,gpuTimeMs:h}:{x,y:g}}async function Kr(t,e,r,o,a,i,s){let n=o instanceof b,u=i instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{y:i};if(o.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await F(t,"saxpy"),m=n?o._buf:w(o,"saxpy-x",!1),f=u?i._buf:w(i,"saxpy-y",!0),p=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:a,type:"u32"},{value:s,type:"u32"}],"saxpy-params"),l=P(c.getBindGroupLayout(0),[m,f,p]),{commandEncoder:v,ts:y}=S(c,l,R(e)),B=u?null:_(v,f);k(v);let h=await A(y);if(u&&n)return d(p),h!==void 0?{gpuTimeMs:h}:{};let x=await G(B,Float32Array);return d(m,f,p),h!==void 0?{y:x,gpuTimeMs:h}:{y:x}}async function Zr(t,e,r,o,a,i){let s=r instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"scopy"),c=s?r._buf:w(r,"scopy-x",!1),m=n?a._buf:w(a,"scopy-y",!0),f=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params"),p=P(u.getBindGroupLayout(0),[c,m,f]),{commandEncoder:l,ts:v}=S(u,p,R(e)),y=n?null:_(l,m);k(l);let B=await A(v);if(n&&s)return d(f),B!==void 0?{gpuTimeMs:B}:{};let h=await G(y,Float32Array);return d(c,m,f),B!==void 0?{y:h,gpuTimeMs:B}:{y:h}}var Jr=64;async function re(t,e,r,o,a,i){let s=r instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await F(t,"sdot"),c=await F(t,"reduction/sum"),m=s?r._buf:w(r,"sdot-x",!1),f=n?a._buf:w(a,"sdot-y",!1),p=L(2*Jr*4,"sdot-partials"),l=z(4,"sdot-result"),v=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params"),y=P(u.getBindGroupLayout(0),[m,f,p,v]),{commandEncoder:B,ts:h}=S(u,y,2*Jr);k(B);let x=P(c.getBindGroupLayout(0),[p,l]),{commandEncoder:g,ts:E}=S(c,x,1),N=_(g,l);k(g);let[T,j,M]=await Promise.all([A(h),A(E),G(N,Float32Array)]);return s&&n?(d(p,l,v),T!==void 0&&j!==void 0?{dot:M[0],gpuTimeMs:T+j}:{dot:M[0]}):(d(m,f,p,l,v,N),T!==void 0&&j!==void 0?{dot:M[0],gpuTimeMs:T+j}:{dot:M[0]})}var ee=64;async function te(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"sasum"),s=await F(t,"reduction/sum"),n=a?r._buf:w(r,"sasum-x",!1),u=L(2*ee*4,"sasum-partials"),c=z(4,"sasum-result"),m=W([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params"),f=P(i.getBindGroupLayout(0),[n,u,m]),{commandEncoder:p,ts:l}=S(i,f,2*ee);k(p);let v=P(s.getBindGroupLayout(0),[u,c]),{commandEncoder:y,ts:B}=S(s,v,1),h=_(y,c);k(y);let[x,g,E]=await Promise.all([A(l),A(B),G(h,Float32Array)]);return a?(d(u,c,m),x!==void 0&&g!==void 0?{asum:E[0],gpuTimeMs:x+g}:{asum:E[0]}):(d(n,u,c,m,h),x!==void 0&&g!==void 0?{asum:E[0],gpuTimeMs:x+g}:{asum:E[0]})}var ae=64;async function oe(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"snrm2"),s=await F(t,"reduction/sum"),n=a?r._buf:w(r,"snrm2-x",!1),u=L(2*ae*4,"snrm2-partials"),c=z(4,"snrm2-result"),m=W([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params"),f=P(i.getBindGroupLayout(0),[n,u,m]),{commandEncoder:p,ts:l}=S(i,f,2*ae);k(p);let v=P(s.getBindGroupLayout(0),[u,c]),{commandEncoder:y,ts:B}=S(s,v,1),h=_(y,c);k(y);let[x,g,E]=await Promise.all([A(l),A(B),G(h,Float32Array)]),N=Math.sqrt(E[0]);return a?(d(u,c,m),x!==void 0&&g!==void 0?{nrm2:N,gpuTimeMs:x+g}:{nrm2:N}):(d(n,u,c,m,h),x!==void 0&&g!==void 0?{nrm2:N,gpuTimeMs:x+g}:{nrm2:N})}var rr=64;async function ie(t,e,r,o){let a=r instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await F(t,"isamax"),s=await F(t,"reduction/argmax"),n=a?r._buf:w(r,"isamax-x",!1),u=L(2*rr*4,"isamax-partials-val"),c=L(2*rr*4,"isamax-partials-idx"),m=z(4,"isamax-result"),f=W([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params"),p=P(i.getBindGroupLayout(0),[n,u,c,f]),{commandEncoder:l,ts:v}=S(i,p,2*rr);k(l);let y=P(s.getBindGroupLayout(0),[u,c,m]),{commandEncoder:B,ts:h}=S(s,y,1),x=_(B,m);k(B);let[g,E,N]=await Promise.all([A(v),A(h),G(x,Uint32Array)]),T=N[0];return a?(d(u,c,m,f),g!==void 0&&E!==void 0?{index:T,gpuTimeMs:g+E}:{index:T}):(d(n,u,c,m,f,x),g!==void 0&&E!==void 0?{index:T,gpuTimeMs:g+E}:{index:T})}async function se(t,e,r,o,a,i,s,n){let u=r instanceof b,c=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(Number.isNaN(s)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let m=await F(t,"srot"),f=u?r._buf:w(r,"srot-x",!0),p=c?a._buf:w(a,"srot-y",!0),l=W([{value:e,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params"),v=P(m.getBindGroupLayout(0),[f,p,l]),{commandEncoder:y,ts:B}=S(m,v,R(e)),h=u?null:_(y,f),x=c?null:_(y,p);k(y);let g=await A(B);if(u&&c)return d(l),g!==void 0?{gpuTimeMs:g}:{};let[E,N]=await Promise.all([G(h,Float32Array),G(x,Float32Array)]);return d(f,p,l),g!==void 0?{x:E,y:N,gpuTimeMs:g}:{x:E,y:N}}async function ne(t,e,r,o,a,i,s){let n=r instanceof b,u=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return n?{}:{x:r,y:a};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await F(t,"srotm"),m=n?r._buf:w(r,"srotm-x",!0),f=u?a._buf:w(a,"srotm-y",!0),p=w(s,"srotm-param",!1),l=W([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params"),v=P(c.getBindGroupLayout(0),[m,f,p,l]),{commandEncoder:y,ts:B}=S(c,v,R(e)),h=n?null:_(y,m),x=u?null:_(y,f);k(y);let g=await A(B);if(n&&u)return d(p,l),g!==void 0?{gpuTimeMs:g}:{};let[E,N]=await Promise.all([G(h,Float32Array),G(x,Float32Array)]);return d(m,f,p,l),g!==void 0?{x:E,y:N,gpuTimeMs:g}:{x:E,y:N}}async function ue(t,e,r,o,a,i,s,n,u,c,m,f){let p=n instanceof b,l=m instanceof b,v=i instanceof V,y=e==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!y&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof c!="number")throw new Error("beta must be a number.");if(Number.isNaN(c))throw new Error("beta must not be NaN.");if(!Number.isFinite(c))throw new Error("beta must be finite.");if(u<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<o)throw new Error("lda must be >= n.");if(!v&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(m instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!v)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(v&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(v&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<=0||o<=0)return l?{}:{y:m};let B=y?o:r,h=y?r:o;if(!v&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(B-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(m.length<(h-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let g=await F(t,y?"sgemv_n":"sgemv_t"),E=v?i._buf:w(i,"sgemv-A",!1),N=p?n._buf:w(n,"sgemv-x",!1),T=l?m._buf:w(m,"sgemv-y",!0),j=W([{value:r,type:"u32"},{value:o,type:"u32"},{value:a,type:"f32"},{value:c,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let M=P(g.getBindGroupLayout(0),[E,N,T,j]),C=y?Math.min(r,t.limits.maxComputeWorkgroupsPerDimension):R(h),{commandEncoder:q,ts:Y}=S(g,M,C),$=l?null:_(q,T);k(q);let Q=await A(Y);if(l)return Q!==void 0?{gpuTimeMs:Q}:{};let er=await G($,Float32Array);return Q!==void 0?{y:er,gpuTimeMs:Q}:{y:er}}finally{v||d(E),p||d(N),l||d(T),d(j)}}async function ce(t,e,r,o,a,i,s,n,u,c,m){let f=s instanceof b,p=c instanceof b,l=a instanceof V,v=e==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!v&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!l&&!(a instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!l)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&s._buf===c._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(l&&i!==a.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(a.rows<r||a.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return p?{}:{y:c};if(!l&&a.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(c.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let y=await F(t,"ssymv"),B=null,h=null,x=null,g=null;try{B=l?a._buf:w(a,"ssymv-A",!1),h=f?s._buf:w(s,"ssymv-x",!1),x=p?c._buf:w(c,"ssymv-y",!0),g=W([{value:r,type:"u32"},{value:o,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:i,type:"u32"},{value:v?0:1,type:"u32"}],"ssymv-params");let E=P(y.getBindGroupLayout(0),[B,h,x,g]),N=Math.min(Math.ceil(r/16),t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:T,ts:j}=S(y,E,N),M=p?null:_(T,x);k(T);let C=await A(j);if(p)return C!==void 0?{gpuTimeMs:C}:{};let q=await G(M,Float32Array);return C!==void 0?{y:q,gpuTimeMs:C}:{y:q}}finally{!l&&B&&d(B),!f&&h&&d(h),!p&&x&&d(x),g&&d(g)}}async function le(t,e,r,o,a,i,s,n,u,c,m){let f=n instanceof b,p=c instanceof b,l=i instanceof V,v=e==="lower",y=r==="no-transpose",B=o==="unit";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!v&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!y&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!B&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(u<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!l&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&n._buf===c._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(f&&!l)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(l&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(i.rows<a||i.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return p?{}:{y:c};if(!l&&i.length<(a-1)*s+a)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(a-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(c.length<(a-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let h=await F(t,"strmv"),x=null,g=null,E=null,N=null;try{x=l?i._buf:w(i,"strmv-A",!1),g=f?n._buf:w(n,"strmv-x",!1),E=p?c._buf:w(c,"strmv-y",!0),N=W([{value:a,type:"u32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:B?1:0,type:"u32"}],"strmv-params");let T=P(h.getBindGroupLayout(0),[x,g,E,N]),j=Math.min(a,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:C}=S(h,T,j),q=p?null:_(M,E);k(M);let Y=await A(C);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let $=await G(q,Float32Array);return Y!==void 0?{y:$,gpuTimeMs:Y}:{y:$}}finally{!l&&x&&d(x),!f&&g&&d(g),!p&&E&&d(E),N&&d(N)}}return we(De);})();
