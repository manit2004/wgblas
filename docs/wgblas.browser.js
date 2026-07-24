var wgblas=(()=>{var gr=Object.create;var Z=Object.defineProperty;var br=Object.getOwnPropertyDescriptor;var xr=Object.getOwnPropertyNames;var wr=Object.getPrototypeOf,hr=Object.prototype.hasOwnProperty;var Y=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var F=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(i){throw e=[i],i}};var te=(t,r)=>{for(var e in r)Z(t,e,{get:r[e],enumerable:!0})},ae=(t,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of xr(r))!hr.call(t,a)&&a!==e&&Z(t,a,{get:()=>r[a],enumerable:!(i=br(r,a))||i.enumerable});return t};var $=(t,r,e)=>(e=t!=null?gr(wr(t)):{},ae(r||!t||!t.__esModule?Z(e,"default",{value:t,enumerable:!0}):e,t)),vr=t=>ae(Z({},"__esModule",{value:!0}),t);var ge,de=F(()=>{ge=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var xe,be=F(()=>{xe=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var he,we=F(()=>{he=`// sscal: x = alpha * x

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
`});var ye,ve=F(()=>{ye=`// sswap: x <-> y

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
`});var Ee,_e=F(()=>{Ee=`// saxpy: y = alpha * x + y

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
`});var Ae,Be=F(()=>{Ae=`// scopy: y = x

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
`});var Pe,Ge=F(()=>{Pe=`// sdot: result = sum(x[i] * y[i])
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
`});var ke,Le=F(()=>{ke=`// sasum: result = sum(|x[i]|)
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
`});var He,Se=F(()=>{He=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Ne,Ie=F(()=>{Ne=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var je,Fe=F(()=>{je=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var We,Me=F(()=>{We=`// isamax: returns index of element with largest absolute value
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
`});var Ue,Te=F(()=>{Ue=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Re,Ve=F(()=>{Re=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var De,Qe=F(()=>{De=`// ssymv: y = alpha * A * x + beta * y
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
`});var Ce,Oe=F(()=>{Ce=`// strmv: y = op(A) * x
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
`});var qe,ze=F(()=>{qe=`// f64add: adds two doubles, each packed as a [main, aux] f32 pair (see
// src/util/f64pack.mjs \u2014 decode()/encode() below are the WGSL mirror of that
// file's packedToFields()/fieldsToPacked()), producing the sum as another
// [main, aux] pair.
//
// Implements IEEE-754 binary64 addition (align, add/subtract significands,
// normalize, round-to-nearest-even) using only u32 bitwise/integer
// arithmetic \u2014 WGSL has no 64-bit integer type or arbitrary-precision
// integers, so each operand's 53-bit significand is carried as a two-word
// (hi, lo) pair, widened by 3 bits at the bottom to hold guard/round/sticky
// information while aligning exponents.

@group(0) @binding(0) var<storage, read> input: array<f32, 4>; // [mainA, auxA, mainB, auxB]
@group(0) @binding(1) var<storage, read_write> output: array<f32, 2>; // [mainSum, auxSum]

const EXP_ALL_ONES: u32 = 0x7ffu;
const BIAS: i32 = 1023;
const QUIET_NAN_MANTISSA_HI: u32 = 1u << 19u; // bit51 of the 52-bit mantissa -> canonical quiet NaN

struct Fields {
  sign: u32,
  rawExp: u32,
  mantissaHi: u32, // 20 bits
  lo: u32,         // 32 bits
}

// Mirrors packedToFields() in f64pack.mjs.
fn decode(mainBits: u32, auxBits: u32) -> Fields {
  let sign = mainBits >> 31u;
  let expMain = (mainBits >> 23u) & 0xffu;
  let mantMain = mainBits & 0x7fffffu;

  let auxSign = auxBits >> 31u;
  let auxExp8 = (auxBits >> 23u) & 0xffu;
  let auxMant23 = auxBits & 0x7fffffu;

  let expExtra = (auxSign << 2u) | (auxExp8 >> 6u);
  let mantExtra29 = ((auxExp8 & 0x3fu) << 23u) | auxMant23;

  let rawExp = (expMain << 3u) | expExtra;
  let mantissaHi = mantMain >> 3u;
  let mantTop3 = mantMain & 0x7u;
  let lo = (mantTop3 << 29u) | mantExtra29;

  return Fields(sign, rawExp, mantissaHi, lo);
}

// Mirrors fieldsToPacked() in f64pack.mjs.
fn encode(sign: u32, rawExp: u32, mantissaHi: u32, lo: u32) -> vec2<f32> {
  let expMain = rawExp >> 3u;
  let expExtra = rawExp & 0x7u;

  let mantTop3 = lo >> 29u;
  let mantMain = (mantissaHi << 3u) | mantTop3;
  let mantExtra29 = lo & 0x1fffffffu;

  let mainBits = (sign << 31u) | (expMain << 23u) | mantMain;

  let auxSign = (expExtra >> 2u) & 0x1u;
  let auxExpTop2 = expExtra & 0x3u;
  let auxExpBot6 = mantExtra29 >> 23u;
  let auxMant23 = mantExtra29 & 0x7fffffu;
  let auxExp8 = (auxExpTop2 << 6u) | auxExpBot6;

  let auxBits = (auxSign << 31u) | (auxExp8 << 23u) | auxMant23;

  return vec2<f32>(bitcast<f32>(mainBits), bitcast<f32>(auxBits));
}

struct Pair { hi: u32, lo: u32 }
struct Shifted { hi: u32, lo: u32, sticky: u32 }

// Two-word right shift by 0..64+ bits, folding every shifted-out 1 bit into
// a returned sticky flag \u2014 used only for the (potentially huge) exponent
// alignment shift, where exact bits can't all be kept.
fn shr_sticky(hi: u32, lo: u32, n: u32) -> Shifted {
  if (n == 0u) {
    return Shifted(hi, lo, 0u);
  }
  if (n >= 64u) {
    return Shifted(0u, 0u, select(0u, 1u, hi != 0u || lo != 0u));
  }
  if (n < 32u) {
    let stickyBits = lo & ((1u << n) - 1u);
    let newLo = (lo >> n) | (hi << (32u - n));
    let newHi = hi >> n;
    return Shifted(newHi, newLo, select(0u, 1u, stickyBits != 0u));
  }
  if (n == 32u) {
    return Shifted(0u, hi, select(0u, 1u, lo != 0u));
  }
  let m = n - 32u;
  let stickyBits = lo | (hi & ((1u << m) - 1u));
  let newLo = hi >> m;
  return Shifted(0u, newLo, select(0u, 1u, stickyBits != 0u));
}

// Two-word left shift by 0..63 bits \u2014 used only to renormalize after
// cancellation, by an amount that exactly matches the leading-zero count,
// so nothing meaningful is ever lost off the top.
fn shl(hi: u32, lo: u32, n: u32) -> Pair {
  if (n == 0u) {
    return Pair(hi, lo);
  }
  if (n < 32u) {
    let newHi = (hi << n) | (lo >> (32u - n));
    let newLo = lo << n;
    return Pair(newHi, newLo);
  }
  if (n == 32u) {
    return Pair(lo, 0u);
  }
  let m = n - 32u;
  return Pair(lo << m, 0u);
}

fn add64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> Pair {
  let sumLo = aLo + bLo;
  let carry = select(0u, 1u, sumLo < aLo); // wrapped around -> there was a carry
  let sumHi = aHi + bHi + carry;
  return Pair(sumHi, sumLo);
}

// Assumes (aHi:aLo) >= (bHi:bLo) \u2014 callers guarantee this so no sign handling is needed.
fn sub64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> Pair {
  let borrow = select(0u, 1u, aLo < bLo);
  let diffLo = aLo - bLo;
  let diffHi = aHi - bHi - borrow;
  return Pair(diffHi, diffLo);
}

fn ge64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> bool {
  return aHi > bHi || (aHi == bHi && aLo >= bLo);
}

fn computeSum(a: Fields, b: Fields) -> vec2<f32> {
  let aIsNaN = a.rawExp == EXP_ALL_ONES && (a.mantissaHi != 0u || a.lo != 0u);
  let bIsNaN = b.rawExp == EXP_ALL_ONES && (b.mantissaHi != 0u || b.lo != 0u);
  if (aIsNaN || bIsNaN) {
    return encode(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
  }

  let aIsInf = a.rawExp == EXP_ALL_ONES; // mantissa==0 here since NaN is excluded above
  let bIsInf = b.rawExp == EXP_ALL_ONES;
  if (aIsInf && bIsInf) {
    if (a.sign != b.sign) {
      return encode(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
    }
    return encode(a.sign, EXP_ALL_ONES, 0u, 0u);
  }
  if (aIsInf) { return encode(a.sign, EXP_ALL_ONES, 0u, 0u); }
  if (bIsInf) { return encode(b.sign, EXP_ALL_ONES, 0u, 0u); }

  let aIsZero = a.rawExp == 0u && a.mantissaHi == 0u && a.lo == 0u;
  let bIsZero = b.rawExp == 0u && b.mantissaHi == 0u && b.lo == 0u;
  if (aIsZero && bIsZero) {
    return encode(a.sign & b.sign, 0u, 0u, 0u);
  }
  if (aIsZero) { return encode(b.sign, b.rawExp, b.mantissaHi, b.lo); }
  if (bIsZero) { return encode(a.sign, a.rawExp, a.mantissaHi, a.lo); }

  // Effective (unbiased) exponent \u2014 subnormals share the smallest normal
  // exponent for alignment purposes and have no implicit leading 1.
  var expA = i32(a.rawExp) - BIAS;
  if (a.rawExp == 0u) { expA = 1 - BIAS; }
  var expB = i32(b.rawExp) - BIAS;
  if (b.rawExp == 0u) { expB = 1 - BIAS; }

  let implicitA = select(0u, 1u, a.rawExp != 0u);
  let implicitB = select(0u, 1u, b.rawExp != 0u);

  // Widen each 53-bit significand (implicit + 52-bit mantissa) by 3 zero
  // bits at the bottom \u2014 room for guard/round/sticky once alignment shifts happen.
  let sigHiA = (implicitA << 23u) | (a.mantissaHi << 3u) | (a.lo >> 29u);
  let sigLoA = a.lo << 3u;
  let sigHiB = (implicitB << 23u) | (b.mantissaHi << 3u) | (b.lo >> 29u);
  let sigLoB = b.lo << 3u;

  // P = the operand with the larger exponent (Q = the other); on a tie, P =
  // whichever has the larger significand \u2014 keeps subtraction below always
  // non-negative without needing signed magnitudes.
  var signP: u32; var expP: i32; var sigHiP: u32; var sigLoP: u32;
  var signQ: u32; var expQ: i32; var sigHiQ: u32; var sigLoQ: u32;
  if (expA > expB || (expA == expB && ge64(sigHiA, sigLoA, sigHiB, sigLoB))) {
    signP = a.sign; expP = expA; sigHiP = sigHiA; sigLoP = sigLoA;
    signQ = b.sign; expQ = expB; sigHiQ = sigHiB; sigLoQ = sigLoB;
  } else {
    signP = b.sign; expP = expB; sigHiP = sigHiB; sigLoP = sigLoB;
    signQ = a.sign; expQ = expA; sigHiQ = sigHiA; sigLoQ = sigLoA;
  }

  let diff = u32(expP - expQ);
  let shiftedQ = shr_sticky(sigHiQ, sigLoQ, diff);
  let alignedHiQ = shiftedQ.hi;
  let alignedLoQ = shiftedQ.lo | shiftedQ.sticky; // fold sticky into bit0

  var sumHi: u32; var sumLo: u32;
  if (signP == signQ) {
    let s = add64(sigHiP, sigLoP, alignedHiQ, alignedLoQ);
    sumHi = s.hi; sumLo = s.lo;
  } else {
    let s = sub64(sigHiP, sigLoP, alignedHiQ, alignedLoQ); // P >= Q(aligned) by construction
    sumHi = s.hi; sumLo = s.lo;
  }

  if (sumHi == 0u && sumLo == 0u) {
    return encode(0u, 0u, 0u, 0u); // exact cancellation -> +0
  }

  // commonExp2: per-bit scale of sumLo's bit0 in the widened representation.
  let commonExp2 = expP - 55;

  var leadPos: i32;
  if (sumHi != 0u) {
    leadPos = 32 + i32(31u - countLeadingZeros(sumHi));
  } else {
    leadPos = i32(31u - countLeadingZeros(sumLo));
  }
  let tentativeExp = leadPos + commonExp2;
  var targetLSBScale = tentativeExp - 52;
  if (tentativeExp < -1022) { targetLSBScale = -1074; }
  let shiftAmt = targetLSBScale - commonExp2;

  var keepHi: u32; var keepLo: u32;
  if (shiftAmt <= 0) {
    let sh = shl(sumHi, sumLo, u32(-shiftAmt)); // exact \u2014 cancellation only, never loses bits
    keepHi = sh.hi; keepLo = sh.lo;
  } else {
    // Only reached without cancellation (same-sign add, or a tied-exponent
    // subtract with no shrinkage) \u2014 shiftAmt here is always exactly 3 or 4,
    // so the dropped bits are fully known from sumLo directly (no sticky
    // approximation needed, unlike the Q-alignment shift above).
    let n = u32(shiftAmt);
    let remainder = sumLo & ((1u << n) - 1u);
    let halfway = 1u << (n - 1u);
    let sh = shr_sticky(sumHi, sumLo, n);
    keepHi = sh.hi; keepLo = sh.lo;
    if (remainder > halfway || (remainder == halfway && (keepLo & 1u) != 0u)) {
      let inc = add64(keepHi, keepLo, 0u, 1u);
      keepHi = inc.hi; keepLo = inc.lo;
    }
  }

  var resultExpBase = targetLSBScale;
  if ((keepHi & (1u << 21u)) != 0u) { // rounding carried past the 53-bit budget
    let sh = shr_sticky(keepHi, keepLo, 1u); // dropped bit is guaranteed 0 here
    keepHi = sh.hi; keepLo = sh.lo;
    resultExpBase = resultExpBase + 1;
  }

  let resultSign = signP;
  if ((keepHi & (1u << 20u)) != 0u) { // normal-shaped result
    let unbiasedExp = 52 + resultExpBase;
    let rawExpFinal = unbiasedExp + BIAS;
    if (rawExpFinal >= 2047) {
      return encode(resultSign, EXP_ALL_ONES, 0u, 0u); // overflow -> Infinity
    }
    return encode(resultSign, u32(rawExpFinal), keepHi & 0xfffffu, keepLo);
  }
  return encode(resultSign, 0u, keepHi & 0xfffffu, keepLo); // subnormal result
}

@compute @workgroup_size(1)
fn main() {
  let a = decode(bitcast<u32>(input[0]), bitcast<u32>(input[1]));
  let b = decode(bitcast<u32>(input[2]), bitcast<u32>(input[3]));
  let result = computeSum(a, b);
  output[0] = result.x;
  output[1] = result.y;
}
`});var Ze,Xe=F(()=>{Ze=`// dasum: result = sum(|x[i]|) computed in double precision, for a vector of
// doubles each packed as a [main, aux] f32 pair (see src/util/f64pack.mjs).
// Test/demo shader only \u2014 single-threaded, sequential accumulation, not a
// parallel-reduction production routine like sasum.wgsl.
//
// decode()/encode()/computeSum() below are copied verbatim from
// f64add.wgsl \u2014 WGSL has no #include (see TODO.md's "WGSL Preprocessor"
// entry), so every shader must be self-contained until that's built.
//
// |x| for a packed double is just abs(main) with aux left untouched: only
// main's sign bit carries the double's actual sign (aux's sign bit is part
// of the packed exponent overflow, unrelated to the value's sign) \u2014 see
// fieldsToPacked()/packedToFields() in f64pack.mjs.

@group(0) @binding(0) var<storage, read> mainArr: array<f32>;
@group(0) @binding(1) var<storage, read> auxArr: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32, 2>; // [main, aux] of the sum

struct Params {
  n: u32,
}
@group(0) @binding(3) var<uniform> params: Params;

const EXP_ALL_ONES: u32 = 0x7ffu;
const BIAS: i32 = 1023;
const QUIET_NAN_MANTISSA_HI: u32 = 1u << 19u; // bit51 of the 52-bit mantissa -> canonical quiet NaN

struct Fields {
  sign: u32,
  rawExp: u32,
  mantissaHi: u32, // 20 bits
  lo: u32,         // 32 bits
}

fn decode(mainBits: u32, auxBits: u32) -> Fields {
  let sign = mainBits >> 31u;
  let expMain = (mainBits >> 23u) & 0xffu;
  let mantMain = mainBits & 0x7fffffu;

  let auxSign = auxBits >> 31u;
  let auxExp8 = (auxBits >> 23u) & 0xffu;
  let auxMant23 = auxBits & 0x7fffffu;

  let expExtra = (auxSign << 2u) | (auxExp8 >> 6u);
  let mantExtra29 = ((auxExp8 & 0x3fu) << 23u) | auxMant23;

  let rawExp = (expMain << 3u) | expExtra;
  let mantissaHi = mantMain >> 3u;
  let mantTop3 = mantMain & 0x7u;
  let lo = (mantTop3 << 29u) | mantExtra29;

  return Fields(sign, rawExp, mantissaHi, lo);
}

fn encode(sign: u32, rawExp: u32, mantissaHi: u32, lo: u32) -> vec2<f32> {
  let expMain = rawExp >> 3u;
  let expExtra = rawExp & 0x7u;

  let mantTop3 = lo >> 29u;
  let mantMain = (mantissaHi << 3u) | mantTop3;
  let mantExtra29 = lo & 0x1fffffffu;

  let mainBits = (sign << 31u) | (expMain << 23u) | mantMain;

  let auxSign = (expExtra >> 2u) & 0x1u;
  let auxExpTop2 = expExtra & 0x3u;
  let auxExpBot6 = mantExtra29 >> 23u;
  let auxMant23 = mantExtra29 & 0x7fffffu;
  let auxExp8 = (auxExpTop2 << 6u) | auxExpBot6;

  let auxBits = (auxSign << 31u) | (auxExp8 << 23u) | auxMant23;

  return vec2<f32>(bitcast<f32>(mainBits), bitcast<f32>(auxBits));
}

struct Pair { hi: u32, lo: u32 }
struct Shifted { hi: u32, lo: u32, sticky: u32 }

fn shr_sticky(hi: u32, lo: u32, n: u32) -> Shifted {
  if (n == 0u) {
    return Shifted(hi, lo, 0u);
  }
  if (n >= 64u) {
    return Shifted(0u, 0u, select(0u, 1u, hi != 0u || lo != 0u));
  }
  if (n < 32u) {
    let stickyBits = lo & ((1u << n) - 1u);
    let newLo = (lo >> n) | (hi << (32u - n));
    let newHi = hi >> n;
    return Shifted(newHi, newLo, select(0u, 1u, stickyBits != 0u));
  }
  if (n == 32u) {
    return Shifted(0u, hi, select(0u, 1u, lo != 0u));
  }
  let m = n - 32u;
  let stickyBits = lo | (hi & ((1u << m) - 1u));
  let newLo = hi >> m;
  return Shifted(0u, newLo, select(0u, 1u, stickyBits != 0u));
}

fn shl(hi: u32, lo: u32, n: u32) -> Pair {
  if (n == 0u) {
    return Pair(hi, lo);
  }
  if (n < 32u) {
    let newHi = (hi << n) | (lo >> (32u - n));
    let newLo = lo << n;
    return Pair(newHi, newLo);
  }
  if (n == 32u) {
    return Pair(lo, 0u);
  }
  let m = n - 32u;
  return Pair(lo << m, 0u);
}

fn add64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> Pair {
  let sumLo = aLo + bLo;
  let carry = select(0u, 1u, sumLo < aLo);
  let sumHi = aHi + bHi + carry;
  return Pair(sumHi, sumLo);
}

fn sub64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> Pair {
  let borrow = select(0u, 1u, aLo < bLo);
  let diffLo = aLo - bLo;
  let diffHi = aHi - bHi - borrow;
  return Pair(diffHi, diffLo);
}

fn ge64(aHi: u32, aLo: u32, bHi: u32, bLo: u32) -> bool {
  return aHi > bHi || (aHi == bHi && aLo >= bLo);
}

fn computeSum(a: Fields, b: Fields) -> vec2<f32> {
  let aIsNaN = a.rawExp == EXP_ALL_ONES && (a.mantissaHi != 0u || a.lo != 0u);
  let bIsNaN = b.rawExp == EXP_ALL_ONES && (b.mantissaHi != 0u || b.lo != 0u);
  if (aIsNaN || bIsNaN) {
    return encode(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
  }

  let aIsInf = a.rawExp == EXP_ALL_ONES;
  let bIsInf = b.rawExp == EXP_ALL_ONES;
  if (aIsInf && bIsInf) {
    if (a.sign != b.sign) {
      return encode(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
    }
    return encode(a.sign, EXP_ALL_ONES, 0u, 0u);
  }
  if (aIsInf) { return encode(a.sign, EXP_ALL_ONES, 0u, 0u); }
  if (bIsInf) { return encode(b.sign, EXP_ALL_ONES, 0u, 0u); }

  let aIsZero = a.rawExp == 0u && a.mantissaHi == 0u && a.lo == 0u;
  let bIsZero = b.rawExp == 0u && b.mantissaHi == 0u && b.lo == 0u;
  if (aIsZero && bIsZero) {
    return encode(a.sign & b.sign, 0u, 0u, 0u);
  }
  if (aIsZero) { return encode(b.sign, b.rawExp, b.mantissaHi, b.lo); }
  if (bIsZero) { return encode(a.sign, a.rawExp, a.mantissaHi, a.lo); }

  var expA = i32(a.rawExp) - BIAS;
  if (a.rawExp == 0u) { expA = 1 - BIAS; }
  var expB = i32(b.rawExp) - BIAS;
  if (b.rawExp == 0u) { expB = 1 - BIAS; }

  let implicitA = select(0u, 1u, a.rawExp != 0u);
  let implicitB = select(0u, 1u, b.rawExp != 0u);

  let sigHiA = (implicitA << 23u) | (a.mantissaHi << 3u) | (a.lo >> 29u);
  let sigLoA = a.lo << 3u;
  let sigHiB = (implicitB << 23u) | (b.mantissaHi << 3u) | (b.lo >> 29u);
  let sigLoB = b.lo << 3u;

  var signP: u32; var expP: i32; var sigHiP: u32; var sigLoP: u32;
  var signQ: u32; var expQ: i32; var sigHiQ: u32; var sigLoQ: u32;
  if (expA > expB || (expA == expB && ge64(sigHiA, sigLoA, sigHiB, sigLoB))) {
    signP = a.sign; expP = expA; sigHiP = sigHiA; sigLoP = sigLoA;
    signQ = b.sign; expQ = expB; sigHiQ = sigHiB; sigLoQ = sigLoB;
  } else {
    signP = b.sign; expP = expB; sigHiP = sigHiB; sigLoP = sigLoB;
    signQ = a.sign; expQ = expA; sigHiQ = sigHiA; sigLoQ = sigLoA;
  }

  let diff = u32(expP - expQ);
  let shiftedQ = shr_sticky(sigHiQ, sigLoQ, diff);
  let alignedHiQ = shiftedQ.hi;
  let alignedLoQ = shiftedQ.lo | shiftedQ.sticky;

  var sumHi: u32; var sumLo: u32;
  if (signP == signQ) {
    let s = add64(sigHiP, sigLoP, alignedHiQ, alignedLoQ);
    sumHi = s.hi; sumLo = s.lo;
  } else {
    let s = sub64(sigHiP, sigLoP, alignedHiQ, alignedLoQ);
    sumHi = s.hi; sumLo = s.lo;
  }

  if (sumHi == 0u && sumLo == 0u) {
    return encode(0u, 0u, 0u, 0u);
  }

  let commonExp2 = expP - 55;

  var leadPos: i32;
  if (sumHi != 0u) {
    leadPos = 32 + i32(31u - countLeadingZeros(sumHi));
  } else {
    leadPos = i32(31u - countLeadingZeros(sumLo));
  }
  let tentativeExp = leadPos + commonExp2;
  var targetLSBScale = tentativeExp - 52;
  if (tentativeExp < -1022) { targetLSBScale = -1074; }
  let shiftAmt = targetLSBScale - commonExp2;

  var keepHi: u32; var keepLo: u32;
  if (shiftAmt <= 0) {
    let sh = shl(sumHi, sumLo, u32(-shiftAmt));
    keepHi = sh.hi; keepLo = sh.lo;
  } else {
    let n = u32(shiftAmt);
    let remainder = sumLo & ((1u << n) - 1u);
    let halfway = 1u << (n - 1u);
    let sh = shr_sticky(sumHi, sumLo, n);
    keepHi = sh.hi; keepLo = sh.lo;
    if (remainder > halfway || (remainder == halfway && (keepLo & 1u) != 0u)) {
      let inc = add64(keepHi, keepLo, 0u, 1u);
      keepHi = inc.hi; keepLo = inc.lo;
    }
  }

  var resultExpBase = targetLSBScale;
  if ((keepHi & (1u << 21u)) != 0u) {
    let sh = shr_sticky(keepHi, keepLo, 1u);
    keepHi = sh.hi; keepLo = sh.lo;
    resultExpBase = resultExpBase + 1;
  }

  let resultSign = signP;
  if ((keepHi & (1u << 20u)) != 0u) {
    let unbiasedExp = 52 + resultExpBase;
    let rawExpFinal = unbiasedExp + BIAS;
    if (rawExpFinal >= 2047) {
      return encode(resultSign, EXP_ALL_ONES, 0u, 0u);
    }
    return encode(resultSign, u32(rawExpFinal), keepHi & 0xfffffu, keepLo);
  }
  return encode(resultSign, 0u, keepHi & 0xfffffu, keepLo);
}

fn accumulateAbs(sumMain: f32, sumAux: f32, mainBits: u32, auxBits: u32) -> vec2<f32> {
  let absMain = abs(bitcast<f32>(mainBits));
  let elem = decode(bitcast<u32>(absMain), auxBits);
  let sum = decode(bitcast<u32>(sumMain), bitcast<u32>(sumAux));
  return computeSum(sum, elem);
}

@compute @workgroup_size(1)
fn main() {
  var sumMain: f32 = 0.0;
  var sumAux: f32 = 0.0;

  for (var i = 0u; i < params.n; i++) {
    let r = accumulateAbs(sumMain, sumAux, bitcast<u32>(mainArr[i]), bitcast<u32>(auxArr[i]));
    sumMain = r.x;
    sumAux = r.y;
  }

  output[0] = sumMain;
  output[1] = sumAux;
}
`});var Ye={};te(Ye,{shaderSources:()=>Vr});var Vr,$e=F(()=>{de();be();we();ve();_e();Be();Ge();Le();Se();Ie();Fe();Me();Te();Ve();Qe();Oe();ze();Xe();Vr={"reduction/argmax":ge,"reduction/sum":xe,sscal:he,sswap:ye,saxpy:Ee,scopy:Ae,sdot:Pe,sasum:ke,snrm2:He,srot:Ne,srotm:je,isamax:We,sgemv_n:Ue,sgemv_t:Re,ssymv:De,strmv:Ce,f64add:qe,dasum:Ze}});var Cr={};te(Cr,{GpuMatrix:()=>T,GpuVector:()=>b,cleanup:()=>fe,gpuName:()=>me,init:()=>le,isamax:()=>lr,randomFloat32Array:()=>pe,randomFloat64Array:()=>ce,sasum:()=>nr,saxpy:()=>rr,scopy:()=>tr,sdot:()=>ir,sgemv:()=>pr,snrm2:()=>ur,srot:()=>fr,srotm:()=>mr,sscal:()=>Je,sswap:()=>er,ssymv:()=>cr,strmv:()=>dr});function ie(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function oe(){if(!se())return{querySet:null,passDescriptor:void 0};let r=N().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function ne(t,r){if(!r)return null;let e=N(),i=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,i,0);let a=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(i,0,a,0,16),{tsReadBuffer:a,resolveBuffer:i,querySet:r}}async function A(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:i}=t;await r.mapAsync(GPUMapMode.READ);let a=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),i.destroy(),Math.max(0,Number(a[1]-a[0]))/1e6}var W=null,C=null,ue=null,K=!1;async function le({powerPreference:t="high-performance",benchmark:r=!1}={}){if(W)return W;let e;if(typeof window>"u"){let{create:o,globals:s}=await import("webgpu");Object.assign(globalThis,s),e=o([]),ue=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(C=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!C)throw new Error("No WebGPU adapter found.");K=r;let a=[...ie(C,r).requiredFeatures??[]];return W=await C.requestDevice({requiredFeatures:a}),W.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),W}function fe(){W&&(W.destroy(),W=null),C=null,ue=null,K=!1}function me(){if(!C)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=C.info;return{description:r||"unknown",device:t||"unknown"}}function se(){return K}function N(){if(!W)throw new Error("WebGPU device not initialized \u2014 call init() first.");return W}function p(...t){t.flat().forEach(r=>r.destroy())}function g(t,r="blas-input",e=!1){let i=N(),a=i.limits.maxStorageBufferBindingSize,o=t.byteLength;if(o>a)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${a} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=i.createBuffer({label:r,size:o,usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}function R(t,r="blas-storage"){return N().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function D(t,r="blas-result"){return N().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function y(t,r){let i=N().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,i,0,r.size),i}function H(t,r="blas-params"){let e=N(),i=t.length*4,a=Math.ceil(i/16)*16,o=new ArrayBuffer(a),s=new DataView(o);t.forEach(({value:u,type:l},f)=>{let m=f*4;if(l==="u32")s.setUint32(m,u,!0);else if(l==="i32")s.setInt32(m,u,!0);else if(l==="f32")s.setFloat32(m,u,!0);else throw new Error(`Unknown param type "${l}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,o),n}async function _(t,r=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}finally{t.destroy()}}var b=class t{constructor(r,e,i=Float32Array){this._buf=r,this.length=e,this.dtype=i}static from(r){if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let e=g(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=N(),e=r.createCommandEncoder(),i=y(e,this._buf);return r.queue.submit([e.finish()]),_(i,this.dtype)}destroy(){this._buf.destroy()}};var T=class t{constructor(r,e,i,a){this._buf=r,this.rows=e,this.cols=i,this.lda=a}static from(r,e,i,a=i){if(!(r instanceof Float32Array))throw new Error("GpuMatrix.from expects a Float32Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(a)||a<i)throw new Error("lda must be an integer >= cols.");if(r.length<e*a)throw new Error("data does not have enough elements for the given rows and lda.");let o=g(r.subarray(0,e*a),"gpu-matrix",!0);return new t(o,e,i,a)}async read(){let r=N(),e=r.createCommandEncoder(),i=y(e,this._buf);r.queue.submit([e.finish()]);let a=await _(i,Float32Array);if(this.lda===this.cols)return a;let o=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)o.set(a.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return o}destroy(){this._buf.destroy()}};function pe(t,r=-1,e=1){let i=new Float32Array(t);for(let a=0;a<t;a++)i[a]=r+Math.random()*(e-r);return i}function ce(t,r=-1,e=1){let i=new Float64Array(t);for(let a=0;a<t;a++)i[a]=r+Math.random()*(e-r);return i}function G(t,r){let e=N(),i=r.map((a,o)=>({binding:o,resource:{buffer:a}}));return e.createBindGroup({layout:t,entries:i})}var yr=new WeakMap;function P(t){N().queue.submit([t.finish()])}function L(t,r,e){let i=N(),{querySet:a,passDescriptor:o}=oe(),s=i.createCommandEncoder(),n=s.beginComputePass(o);n.setPipeline(t),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let u=ne(s,a);return yr.set(s,n),{commandEncoder:s,ts:u}}var Dr={},J=new WeakMap;async function k(t,r){J.has(t)||J.set(t,new Map);let e=J.get(t);return e.has(r)||e.set(r,await Qr(r)),e.get(r)}async function Rr(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>($e(),Ye)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:i,join:a}=await import("path"),o=i(e(Dr.url));return r(a(o,`../shaders/${t}.wgsl`),"utf8")}}async function Qr(t){let r=N(),e=await Rr(t),i=r.createShaderModule({label:t,code:e}),o=(await i.getCompilationInfo()).messages.filter(n=>n.type==="error");if(o.length>0)throw new Error(`Shader "${t}" compilation failed:
${o.map(n=>`  line ${n.lineNum}: ${n.message}`).join(`
`)}`);let s=r.createComputePipeline({label:t,layout:"auto",compute:{module:i}});return s._shaderModule=i,s}var Or=64,Ke=8;function M(t,r){let e=N().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/Or),e):{x:Math.min(Math.ceil(r/Ke),e),y:Math.min(Math.ceil(t/Ke),e)}}async function Je(t,r,e,i,a){let o=i instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return o?{}:i;if(i.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await k(t,"sscal"),n=null,u=null;try{n=o?i._buf:g(i,"sscal-x",!0),u=H([{value:r,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"}],"sscal-params");let l=G(s.getBindGroupLayout(0),[n,u]),{commandEncoder:f,ts:m}=L(s,l,M(r)),d=o?null:y(f,n);P(f);let c=await A(m);if(o)return c!==void 0?{gpuTimeMs:c}:{};let x=await _(d,Float32Array);return c!==void 0?{x,gpuTimeMs:c}:x}finally{!o&&n&&p(n),u&&p(u)}}async function er(t,r,e,i,a,o){let s=e instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof b))throw new Error("x must be a Float32Array or GpuVector.");if(!(a instanceof Float32Array)&&!(a instanceof b))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==a.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(t,"sswap"),l=null,f=null,m=null;try{l=s?e._buf:g(e,"sswap-x",!0),f=n?a._buf:g(a,"sswap-y",!0),m=H([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let d=G(u.getBindGroupLayout(0),[l,f,m]),{commandEncoder:c,ts:x}=L(u,d,M(r)),h=s?null:y(c,l),E=n?null:y(c,f);P(c);let v=await A(x);if(s&&n)return v!==void 0?{gpuTimeMs:v}:{};let B=await _(h,Float32Array),w=await _(E,Float32Array);return v!==void 0?{x:B,y:w,gpuTimeMs:v}:{x:B,y:w}}finally{!s&&l&&p(l),!n&&f&&p(f),m&&p(m)}}async function rr(t,r,e,i,a,o,s){let n=i instanceof b,u=o instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:o};if(i.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await k(t,"saxpy"),f=null,m=null,d=null;try{f=n?i._buf:g(i,"saxpy-x",!1),m=u?o._buf:g(o,"saxpy-y",!0),d=H([{value:r,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let c=G(l.getBindGroupLayout(0),[f,m,d]),{commandEncoder:x,ts:h}=L(l,c,M(r)),E=u?null:y(x,m);P(x);let v=await A(h);if(u&&n)return v!==void 0?{gpuTimeMs:v}:{};let B=await _(E,Float32Array);return v!==void 0?{y:B,gpuTimeMs:v}:{y:B}}finally{!n&&f&&p(f),!u&&m&&p(m),d&&p(d)}}async function tr(t,r,e,i,a,o){let s=e instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(t,"scopy"),l=null,f=null,m=null;try{l=s?e._buf:g(e,"scopy-x",!1),f=n?a._buf:g(a,"scopy-y",!0),m=H([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let d=G(u.getBindGroupLayout(0),[l,f,m]),{commandEncoder:c,ts:x}=L(u,d,M(r)),h=n?null:y(c,f);P(c);let E=await A(x);if(n&&s)return E!==void 0?{gpuTimeMs:E}:{};let v=await _(h,Float32Array);return E!==void 0?{y:v,gpuTimeMs:E}:{y:v}}finally{!s&&l&&p(l),!n&&f&&p(f),m&&p(m)}}var ar=64;async function ir(t,r,e,i,a,o){let s=e instanceof b,n=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(t,"sdot"),l=await k(t,"reduction/sum"),f=null,m=null,d=null,c=null,x=null;try{f=s?e._buf:g(e,"sdot-x",!1),m=n?a._buf:g(a,"sdot-y",!1),d=R(2*ar*4,"sdot-partials"),c=D(4,"sdot-result"),x=H([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let h=G(u.getBindGroupLayout(0),[f,m,d,x]),{commandEncoder:E,ts:v}=L(u,h,2*ar);P(E);let B=G(l.getBindGroupLayout(0),[d,c]),{commandEncoder:w,ts:S}=L(l,B,1),I=y(w,c);P(w);let[j,U,V]=await Promise.all([A(v),A(S),_(I,Float32Array)]);return j!==void 0&&U!==void 0?{dot:V[0],gpuTimeMs:j+U}:{dot:V[0]}}finally{!s&&f&&p(f),!n&&m&&p(m),d&&p(d),c&&p(c),x&&p(x)}}var or=64;async function nr(t,r,e,i){let a=e instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(t,"sasum"),s=await k(t,"reduction/sum"),n=null,u=null,l=null,f=null;try{n=a?e._buf:g(e,"sasum-x",!1),u=R(2*or*4,"sasum-partials"),l=D(4,"sasum-result"),f=H([{value:r,type:"u32"},{value:i,type:"u32"}],"sasum-params");let m=G(o.getBindGroupLayout(0),[n,u,f]),{commandEncoder:d,ts:c}=L(o,m,2*or);P(d);let x=G(s.getBindGroupLayout(0),[u,l]),{commandEncoder:h,ts:E}=L(s,x,1),v=y(h,l);P(h);let[B,w,S]=await Promise.all([A(c),A(E),_(v,Float32Array)]);return B!==void 0&&w!==void 0?{asum:S[0],gpuTimeMs:B+w}:{asum:S[0]}}finally{!a&&n&&p(n),u&&p(u),l&&p(l),f&&p(f)}}var sr=64;async function ur(t,r,e,i){let a=e instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(t,"snrm2"),s=await k(t,"reduction/sum"),n=null,u=null,l=null,f=null;try{n=a?e._buf:g(e,"snrm2-x",!1),u=R(2*sr*4,"snrm2-partials"),l=D(4,"snrm2-result"),f=H([{value:r,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let m=G(o.getBindGroupLayout(0),[n,u,f]),{commandEncoder:d,ts:c}=L(o,m,2*sr);P(d);let x=G(s.getBindGroupLayout(0),[u,l]),{commandEncoder:h,ts:E}=L(s,x,1),v=y(h,l);P(h);let[B,w,S]=await Promise.all([A(c),A(E),_(v,Float32Array)]),I=Math.sqrt(S[0]);return B!==void 0&&w!==void 0?{nrm2:I,gpuTimeMs:B+w}:{nrm2:I}}finally{!a&&n&&p(n),u&&p(u),l&&p(l),f&&p(f)}}var ee=64;async function lr(t,r,e,i){let a=e instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(t,"isamax"),s=await k(t,"reduction/argmax"),n=null,u=null,l=null,f=null,m=null;try{n=a?e._buf:g(e,"isamax-x",!1),u=R(2*ee*4,"isamax-partials-val"),l=R(2*ee*4,"isamax-partials-idx"),f=D(4,"isamax-result"),m=H([{value:r,type:"u32"},{value:i,type:"u32"}],"isamax-params");let d=G(o.getBindGroupLayout(0),[n,u,l,m]),{commandEncoder:c,ts:x}=L(o,d,2*ee);P(c);let h=G(s.getBindGroupLayout(0),[u,l,f]),{commandEncoder:E,ts:v}=L(s,h,1),B=y(E,f);P(E);let[w,S,I]=await Promise.all([A(x),A(v),_(B,Uint32Array)]),j=I[0];return w!==void 0&&S!==void 0?{index:j,gpuTimeMs:w+S}:{index:j}}finally{!a&&n&&p(n),u&&p(u),l&&p(l),f&&p(f),m&&p(m)}}async function fr(t,r,e,i,a,o,s,n){let u=e instanceof b,l=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await k(t,"srot"),m=null,d=null,c=null;try{m=u?e._buf:g(e,"srot-x",!0),d=l?a._buf:g(a,"srot-y",!0),c=H([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let x=G(f.getBindGroupLayout(0),[m,d,c]),{commandEncoder:h,ts:E}=L(f,x,M(r)),v=u?null:y(h,m),B=l?null:y(h,d);P(h);let w=await A(E);if(u&&l)return w!==void 0?{gpuTimeMs:w}:{};let[S,I]=await Promise.all([_(v,Float32Array),_(B,Float32Array)]);return w!==void 0?{x:S,y:I,gpuTimeMs:w}:{x:S,y:I}}finally{!u&&m&&p(m),!l&&d&&p(d),c&&p(c)}}async function mr(t,r,e,i,a,o,s){let n=e instanceof b,u=a instanceof b;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await k(t,"srotm"),f=null,m=null,d=null,c=null;try{f=n?e._buf:g(e,"srotm-x",!0),m=u?a._buf:g(a,"srotm-y",!0),d=g(s,"srotm-param",!1),c=H([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let x=G(l.getBindGroupLayout(0),[f,m,d,c]),{commandEncoder:h,ts:E}=L(l,x,M(r)),v=n?null:y(h,f),B=u?null:y(h,m);P(h);let w=await A(E);if(n&&u)return w!==void 0?{gpuTimeMs:w}:{};let[S,I]=await Promise.all([_(v,Float32Array),_(B,Float32Array)]);return w!==void 0?{x:S,y:I,gpuTimeMs:w}:{x:S,y:I}}finally{!n&&f&&p(f),!u&&m&&p(m),d&&p(d),c&&p(c)}}async function pr(t,r,e,i,a,o,s,n,u,l,f,m){let d=n instanceof b,c=f instanceof b,x=o instanceof T,h=r==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!h&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(u<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<i)throw new Error("lda must be >= n.");if(!x&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!x)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(x&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(x&&(o.rows<e||o.cols<i))throw new Error("A is too small for the given m and n.");if(e<0||i<0)throw new Error("m and n must be non-negative.");if(e===0||i===0)return c?{}:{y:f};let E=h?i:e,v=h?e:i;if(!x&&o.length<(e-1)*s+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(E-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(v-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let w=await k(t,h?"sgemv_n":"sgemv_t"),S=x?o._buf:g(o,"sgemv-A",!1),I=d?n._buf:g(n,"sgemv-x",!1),j=c?f._buf:g(f,"sgemv-y",!0),U=H([{value:e,type:"u32"},{value:i,type:"u32"},{value:a,type:"f32"},{value:l,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let V=G(w.getBindGroupLayout(0),[S,I,j,U]),Q=h?Math.min(e,t.limits.maxComputeWorkgroupsPerDimension):M(v),{commandEncoder:O,ts:z}=L(w,V,Q),q=c?null:y(O,j);P(O);let X=await A(z);if(c)return X!==void 0?{gpuTimeMs:X}:{};let re=await _(q,Float32Array);return X!==void 0?{y:re,gpuTimeMs:X}:{y:re}}finally{x||p(S),d||p(I),c||p(j),p(U)}}async function cr(t,r,e,i,a,o,s,n,u,l,f){let m=s instanceof b,d=l instanceof b,c=a instanceof T,x=r==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!x&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(o<e)throw new Error("lda must be >= n.");if(!c&&!(a instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&s._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&o!==a.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(a.rows<e||a.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return d?{}:{y:l};if(!c&&a.length<(e-1)*o+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=await k(t,"ssymv"),E=null,v=null,B=null,w=null;try{E=c?a._buf:g(a,"ssymv-A",!1),v=m?s._buf:g(s,"ssymv-x",!1),B=d?l._buf:g(l,"ssymv-y",!0),w=H([{value:e,type:"u32"},{value:i,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:o,type:"u32"},{value:x?0:1,type:"u32"}],"ssymv-params");let S=G(h.getBindGroupLayout(0),[E,v,B,w]),I=Math.min(e,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:U}=L(h,S,I),V=d?null:y(j,B);P(j);let Q=await A(U);if(d)return Q!==void 0?{gpuTimeMs:Q}:{};let O=await _(V,Float32Array);return Q!==void 0?{y:O,gpuTimeMs:Q}:{y:O}}finally{!c&&E&&p(E),!m&&v&&p(v),!d&&B&&p(B),w&&p(w)}}async function dr(t,r,e,i,a,o,s,n,u,l,f){let m=n instanceof b,d=l instanceof b,c=o instanceof T,x=r==="lower",h=e==="no-transpose",E=i==="unit";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!x&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!h&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!E&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(u<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!c&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&n._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&d&&o._buf===l._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(o.rows<a||o.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return d?{}:{y:l};if(!c&&o.length<(a-1)*s+a)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(a-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(a-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let v=await k(t,"strmv"),B=null,w=null,S=null,I=null;try{B=c?o._buf:g(o,"strmv-A",!1),w=m?n._buf:g(n,"strmv-x",!1),S=d?l._buf:g(l,"strmv-y",!0),I=H([{value:a,type:"u32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"},{value:x?0:1,type:"u32"},{value:E?1:0,type:"u32"}],"strmv-params");let j=G(v.getBindGroupLayout(0),[B,w,S,I]),U=Math.min(a,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:V,ts:Q}=L(v,j,U),O=d?null:y(V,S);P(V);let z=await A(Q);if(d)return z!==void 0?{gpuTimeMs:z}:{};let q=await _(O,Float32Array);return z!==void 0?{y:q,gpuTimeMs:z}:{y:q}}finally{!c&&B&&p(B),!m&&w&&p(w),!d&&S&&p(S),I&&p(I)}}return vr(Cr);})();
