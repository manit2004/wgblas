var wgblas=(()=>{var mt=Object.create;var ur=Object.defineProperty;var dt=Object.getOwnPropertyDescriptor;var pt=Object.getOwnPropertyNames;var gt=Object.getPrototypeOf,wt=Object.prototype.hasOwnProperty;var lr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var I=(a,r,e)=>()=>{if(e)throw e[0];try{return a&&(r=a(a=0)),r}catch(o){throw e=[o],o}};var yr=(a,r)=>{for(var e in r)ur(a,e,{get:r[e],enumerable:!0})},_r=(a,r,e,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of pt(r))!wt.call(a,t)&&t!==e&&ur(a,t,{get:()=>r[t],enumerable:!(o=dt(r,t))||o.enumerable});return a};var fr=(a,r,e)=>(e=a!=null?mt(gt(a)):{},_r(r||!a||!a.__esModule?ur(e,"default",{value:a,enumerable:!0}):e,a)),bt=a=>_r(ur({},"__esModule",{value:!0}),a);var Ur,Mr=I(()=>{Ur=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Vr,Tr=I(()=>{Vr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Hr,Rr=I(()=>{Hr=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
// using computeSum instead of plain f32 \`+\` (see reduction/sum.wgsl for the
// f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsMain/partialsAux must have
// exactly 2*WGS entries each.
//
// Concatenated after f64add.wgsl by getPipeline (WGSL has no #include),
// reusing its decode/encode/computeSum and Packed struct \u2014 f64add.wgsl
// declares no bindings and no entry point of its own (just helper functions),
// so bindings here start at 0 and the entry point is simply \`reduce_f64\`.
//
// partialsAux/result's aux slot are array<u32>, not array<f32> \u2014 aux's bits
// must never pass through an f32-typed storage slot (NaN-bit-pattern
// corruption risk, see f64pack.mjs and the Packed struct comment above
// decode()/encode() in f64add.wgsl).

@group(0) @binding(0) var<storage, read>       partialsMain: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsAux:  array<u32>;
@group(0) @binding(2) var<storage, read_write> resultMain:   array<f32, 1>;
@group(0) @binding(3) var<storage, read_write> resultAux:    array<u32, 1>;

const WGS: u32 = 64;

var<workgroup> tile: array<Packed, 64>;

fn addPair(a: Packed, b: Packed) -> Packed {
  return computeSum(decode(bitcast<u32>(a.main), a.aux), decode(bitcast<u32>(b.main), b.aux));
}

@compute @workgroup_size(64)
fn reduce_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = Packed(partialsMain[i], partialsAux[i]);
  let b = Packed(partialsMain[i + WGS], partialsAux[i + WGS]);
  tile[i] = addPair(a, b);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) { tile[i] = addPair(tile[i], tile[i + s]); }
    workgroupBarrier();
  }

  if (i == 0u) {
    resultMain[0] = tile[0].main;
    resultAux[0] = tile[0].aux;
  }
}
`});var Cr,Dr=I(()=>{Cr=`// sscal: x = alpha * x

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
`});var zr,Or=I(()=>{zr=`// sswap: x <-> y

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
`});var qr,Qr=I(()=>{qr=`// saxpy: y = alpha * x + y

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
`});var Kr,Zr=I(()=>{Kr=`// scopy: y = x

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
`});var $r,Xr=I(()=>{$r=`// sdot: result = sum(x[i] * y[i])
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
`});var Jr,Yr=I(()=>{Jr=`// sasum: result = sum(|x[i]|)
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
`});var ee,re=I(()=>{ee=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var ae,te=I(()=>{ae=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var ie,oe=I(()=>{ie=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var se,ne=I(()=>{se=`// isamax: returns index of element with largest absolute value
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
`});var le,ue=I(()=>{le=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var ce,fe=I(()=>{ce=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var de,me=I(()=>{de=`// ssymv: y = alpha * A * x + beta * y
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
`});var ge,pe=I(()=>{ge=`// strmv: y = op(A) * x
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
`});var be,we=I(()=>{be=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read>       y: array<f32>;
@group(0) @binding(2) var<storage, read_write> A: array<f32>;

struct Params {
  m:     u32,
  n:     u32,
  alpha: f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    let row_base = row * params.lda;

    // 4-unrolled loop: each iteration issues 4 independent A/y accesses.
    let n4_floor = (params.n / (4u * WGS)) * (4u * WGS);
    for (var col: u32 = lid.x; col < n4_floor; col += 4u * WGS) {
      let idx0 = row_base + col;
      let idx1 = row_base + col + WGS;
      let idx2 = row_base + col + 2u * WGS;
      let idx3 = row_base + col + 3u * WGS;
      A[idx0] = xi * y[ col            * params.incy] + A[idx0];
      A[idx1] = xi * y[(col +     WGS) * params.incy] + A[idx1];
      A[idx2] = xi * y[(col + 2u * WGS) * params.incy] + A[idx2];
      A[idx3] = xi * y[(col + 3u * WGS) * params.incy] + A[idx3];
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var col: u32 = n4_floor + lid.x; col < params.n; col += WGS) {
      let idx = row_base + col;
      A[idx] = xi * y[col * params.incy] + A[idx];
    }
  }
}
`});var xe,he=I(()=>{xe=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
// A is n\xD7n symmetric; only the triangle specified by uplo is referenced/updated,
// the other triangle is implied by symmetry (not touched).

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read_write> A: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  incx:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    let row_base = row * params.lda;

    // Stored-triangle column range for this row: lower [0,row], upper [row,n).
    var colStart: u32;
    var colEnd: u32;
    if params.uplo == 1u {
      colStart = row;
      colEnd = params.n;
    } else {
      colStart = 0u;
      colEnd = row + 1u;
    }

    // 4-unrolled loop over the stored range.
    let rangeLen = colEnd - colStart;
    let n4_floor = colStart + (rangeLen / (4u * WGS)) * (4u * WGS);
    for (var col: u32 = colStart + lid.x; col < n4_floor; col += 4u * WGS) {
      let idx0 = row_base + col;
      let idx1 = row_base + col + WGS;
      let idx2 = row_base + col + 2u * WGS;
      let idx3 = row_base + col + 3u * WGS;
      A[idx0] = xi * x[ col             * params.incx] + A[idx0];
      A[idx1] = xi * x[(col +     WGS)  * params.incx] + A[idx1];
      A[idx2] = xi * x[(col + 2u * WGS) * params.incx] + A[idx2];
      A[idx3] = xi * x[(col + 3u * WGS) * params.incx] + A[idx3];
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var col: u32 = n4_floor + lid.x; col < colEnd; col += WGS) {
      let idx = row_base + col;
      A[idx] = xi * x[col * params.incx] + A[idx];
    }
  }
}
`});var ye,ve=I(()=>{ye=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
// A is n\xD7n symmetric; only the triangle specified by uplo is referenced/updated,
// the other triangle is implied by symmetry (not touched).

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read>       y: array<f32>;
@group(0) @binding(2) var<storage, read_write> A: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    let yi = params.alpha * y[row * params.incy];
    let row_base = row * params.lda;

    // Stored-triangle column range for this row: lower [0,row], upper [row,n).
    var colStart: u32;
    var colEnd: u32;
    if params.uplo == 1u {
      colStart = row;
      colEnd = params.n;
    } else {
      colStart = 0u;
      colEnd = row + 1u;
    }

    // 4-unrolled loop over the stored range.
    let rangeLen = colEnd - colStart;
    let n4_floor = colStart + (rangeLen / (4u * WGS)) * (4u * WGS);
    for (var col: u32 = colStart + lid.x; col < n4_floor; col += 4u * WGS) {
      let idx0 = row_base + col;
      let idx1 = row_base + col + WGS;
      let idx2 = row_base + col + 2u * WGS;
      let idx3 = row_base + col + 3u * WGS;
      A[idx0] = xi * y[ col             * params.incy] + yi * x[ col             * params.incx] + A[idx0];
      A[idx1] = xi * y[(col +     WGS)  * params.incy] + yi * x[(col +     WGS)  * params.incx] + A[idx1];
      A[idx2] = xi * y[(col + 2u * WGS) * params.incy] + yi * x[(col + 2u * WGS) * params.incx] + A[idx2];
      A[idx3] = xi * y[(col + 3u * WGS) * params.incy] + yi * x[(col + 3u * WGS) * params.incx] + A[idx3];
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var col: u32 = n4_floor + lid.x; col < colEnd; col += WGS) {
      let idx = row_base + col;
      A[idx] = xi * y[col * params.incy] + yi * x[col * params.incx] + A[idx];
    }
  }
}
`});var Ee,_e=I(()=>{Ee=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
// value, aux: raw u32 bits \u2014 see src/util/f64pack.mjs; decode()/encode()
// below are the WGSL mirror of that file's packedToFields()/fieldsToPacked()),
// producing the sum as another [main, aux] pair.
//
// Implements IEEE-754 binary64 addition (align, add/subtract significands,
// normalize, round-to-nearest-even) using only u32 bitwise/integer
// arithmetic \u2014 WGSL has no 64-bit integer type or arbitrary-precision
// integers, so each operand's 53-bit significand is carried as a two-word
// (hi, lo) pair, widened by 3 bits at the bottom to hold guard/round/sticky
// information while aligning exponents.

const EXP_ALL_ONES: u32 = 0x7ffu;
const BIAS: i32 = 1023;
const QUIET_NAN_MANTISSA_HI: u32 = 1u << 19u; // bit51 of the 52-bit mantissa -> canonical quiet NaN

struct Fields {
  sign: u32,
  rawExp: u32,
  mantissaHi: u32, // 20 bits
  lo: u32,         // 32 bits
}

// A packed [main, aux] result \u2014 aux stays a raw u32; it must never be stored
// as an array<f32>/treated as a real float (bit pattern can land on a NaN/
// Infinity exponent for perfectly ordinary doubles \u2014 an f32-typed storage
// slot canonicalizes/corrupts that on any round-trip). See f64pack.mjs's
// comment above fieldsToPacked, and dasum.wgsl's xAux/partialsAux bindings.
struct Packed {
  main: f32,
  aux:  u32,
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
fn encode(sign: u32, rawExp: u32, mantissaHi: u32, lo: u32) -> Packed {
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

  return Packed(bitcast<f32>(mainBits), auxBits);
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

// The actual IEEE-754 addition, returning decoded Fields rather than an
// encoded Packed pair \u2014 lets a caller that's accumulating many values in a
// row (e.g. dasum.wgsl's per-thread reduction loop) keep the running total
// in Fields form the whole time, only encoding once at the very end, instead
// of paying a decode+encode round-trip on every single addition. computeSum
// (below) is the Packed-in/Packed-out convenience wrapper around this.
fn addFields(a: Fields, b: Fields) -> Fields {
  let aIsNaN = a.rawExp == EXP_ALL_ONES && (a.mantissaHi != 0u || a.lo != 0u);
  let bIsNaN = b.rawExp == EXP_ALL_ONES && (b.mantissaHi != 0u || b.lo != 0u);
  if (aIsNaN || bIsNaN) {
    return Fields(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
  }

  let aIsInf = a.rawExp == EXP_ALL_ONES; // mantissa==0 here since NaN is excluded above
  let bIsInf = b.rawExp == EXP_ALL_ONES;
  if (aIsInf && bIsInf) {
    if (a.sign != b.sign) {
      return Fields(0u, EXP_ALL_ONES, QUIET_NAN_MANTISSA_HI, 0u);
    }
    return Fields(a.sign, EXP_ALL_ONES, 0u, 0u);
  }
  if (aIsInf) { return Fields(a.sign, EXP_ALL_ONES, 0u, 0u); }
  if (bIsInf) { return Fields(b.sign, EXP_ALL_ONES, 0u, 0u); }

  let aIsZero = a.rawExp == 0u && a.mantissaHi == 0u && a.lo == 0u;
  let bIsZero = b.rawExp == 0u && b.mantissaHi == 0u && b.lo == 0u;
  if (aIsZero && bIsZero) {
    return Fields(a.sign & b.sign, 0u, 0u, 0u);
  }
  if (aIsZero) { return Fields(b.sign, b.rawExp, b.mantissaHi, b.lo); }
  if (bIsZero) { return Fields(a.sign, a.rawExp, a.mantissaHi, a.lo); }

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
    return Fields(0u, 0u, 0u, 0u); // exact cancellation -> +0
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
      return Fields(resultSign, EXP_ALL_ONES, 0u, 0u); // overflow -> Infinity
    }
    return Fields(resultSign, u32(rawExpFinal), keepHi & 0xfffffu, keepLo);
  }
  return Fields(resultSign, 0u, keepHi & 0xfffffu, keepLo); // subnormal result
}

// Packed-in/Packed-out convenience wrapper around addFields \u2014 encodes once,
// after the math, rather than addFields itself needing to know about Packed.
fn computeSum(a: Fields, b: Fields) -> Packed {
  let f = addFields(a, b);
  return encode(f.sign, f.rawExp, f.mantissaHi, f.lo);
}
`});var Ae,Ge=I(()=>{Ae=`// dasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sumF64.wgsl.
// Same structure as sasum.wgsl \u2014 every value is now a [main, aux] pair
// (see src/util/f64pack.mjs) and every \`+\`/\`+=\` is computeSum via addPair
// instead of plain f32 addition. Concatenated after f64add.wgsl by
// getPipeline (WGSL has no #include), reusing its decode/encode/computeSum/
// addFields and Packed struct \u2014 f64add.wgsl declares no bindings and no entry
// point of its own (just helper functions), so bindings here start at 0 and
// the entry point is simply \`dasum_main\`.
//
// xAux/partialsAux are array<u32>, not array<f32> \u2014 aux's bits must never
// pass through an f32-typed storage slot (NaN-bit-pattern corruption risk,
// see f64pack.mjs and the Packed struct comment above decode()/encode() in
// f64add.wgsl); Packed (from f64add.wgsl) keeps aux as u32 in registers/
// workgroup memory too.
//
// Per-thread accumulation (acc0..acc3) stays in DECODED Fields form for the
// entire strided loop below, via addFields \u2014 not re-encoded to Packed and
// re-decoded on every single element like a naive version would. Only the
// freshly-loaded x[idx] needs decoding each iteration (unavoidable, it's new
// data every time); the running total never leaves Fields form until the
// four accumulators are combined and encoded exactly once, right before
// writing into workgroup-shared \`tile\`. The cross-thread reduction tree
// after that still goes through Packed per level (unavoidable \u2014 each level
// combines values that live in different threads' registers via shared
// memory), but that's a fixed 6 levels regardless of n, unlike the strided
// loop above whose iteration count scales with n.

@group(0) @binding(0) var<storage, read>       xMain:        array<f32>;
@group(0) @binding(1) var<storage, read>       xAux:         array<u32>;
@group(0) @binding(2) var<storage, read_write> partialsMain: array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsAux:  array<u32>;
@group(0) @binding(4) var<uniform>             params:       Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<Packed, 64>;

// a + b, where a/b are [main, aux] pairs \u2014 computeSum takes decoded Fields.
// Only used for the cross-thread reduction tree below; the per-thread
// strided loop uses addFields directly instead (see module comment).
fn addPair(a: Packed, b: Packed) -> Packed {
  return computeSum(decode(bitcast<u32>(a.main), a.aux), decode(bitcast<u32>(b.main), b.aux));
}

// |x| for a packed double is abs(main) with aux untouched \u2014 only main's
// sign bit carries the double's sign (see fieldsToPacked() in f64pack.mjs).
// Returns decoded Fields directly (not Packed) for the per-thread loop.
fn absFields(idx: u32) -> Fields {
  return decode(bitcast<u32>(abs(xMain[idx])), xAux[idx]);
}

@compute @workgroup_size(64)
fn dasum_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: Fields = Fields(0u, 0u, 0u, 0u);
  var acc1: Fields = Fields(0u, 0u, 0u, 0u);
  var acc2: Fields = Fields(0u, 0u, 0u, 0u);
  var acc3: Fields = Fields(0u, 0u, 0u, 0u);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = addFields(acc0, absFields( id                * params.x_inc));
    acc1 = addFields(acc1, absFields((id +      stride) * params.x_inc));
    acc2 = addFields(acc2, absFields((id + 2u * stride) * params.x_inc));
    acc3 = addFields(acc3, absFields((id + 3u * stride) * params.x_inc));
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = addFields(acc0, absFields(id * params.x_inc));
  }

  // Combine the 4 per-thread accumulators in Fields form too \u2014 still no
  // encode/decode needed, since none of them have touched Packed yet.
  let combined = addFields(addFields(acc0, acc1), addFields(acc2, acc3));
  tile[lid.x] = encode(combined.sign, combined.rawExp, combined.mantissaHi, combined.lo);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] = addPair(tile[lid.x], tile[lid.x + s]); }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsMain[wgid.x] = tile[0].main;
    partialsAux[wgid.x] = tile[0].aux;
  }
}
`});var ke,Be=I(()=>{ke=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
// (workgroup_id.y) explicit inverse, via the same one-row-at-a-time
// substitution as strsv_block.wgsl, but solving against a unit basis vector
// e_col instead of the real right-hand side, and writing to a dense
// (BLOCK_SIZE x BLOCK_SIZE, row-major) scratch buffer per block instead of
// mutating x. Dispatched once for the whole matrix (2D: BLOCK_SIZE columns x
// numBlocks), fully in parallel -- unlike the sequential per-block main
// loop in strsv.mjs, no block's inverse depends on any other block or on x.
//
// A triangular block's inverse is itself triangular: forward (effectively-
// lower, e.g. no-trans+lower) blocks have inverse column col nonzero only
// for row>=col, solved in increasing row order; backward (effectively-
// upper) blocks have it nonzero only for row<=col, solved in decreasing
// order. Rows outside a column's nonzero range are written as literal 0 \u2014
// strsv_apply_inverse.wgsl's dense matvec depends on that, not just on
// those entries being mathematically implied zero.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> Ainv: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;
const BLOCK_SIZE: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

fn readA(i: u32, j: u32) -> f32 {
  if params.trans == 0u {
    return A[i * params.lda + j];
  } else {
    return A[j * params.lda + i];
  }
}

@compute @workgroup_size(64)
fn strsv_invert_block_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
) {
  let col = wgid.x;
  let blockIndex = wgid.y;
  let blockStart = blockIndex * BLOCK_SIZE;
  var blockEnd = blockStart + BLOCK_SIZE;
  if (blockEnd > params.n) { blockEnd = params.n; }
  let blockLen = blockEnd - blockStart;

  if (col >= blockLen) { return; }

  let ainvBase = blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  if forward {
    for (var r = lid.x; r < col; r += WGS) {
      Ainv[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  } else {
    for (var r = col + 1u + lid.x; r < blockLen; r += WGS) {
      Ainv[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  }
  storageBarrier();
  workgroupBarrier();

  let numSteps = select(col + 1u, blockLen - col, forward);
  for (var step = 0u; step < numSteps; step++) {
    let localRow = select(col - step, col + step, forward);
    let i = blockStart + localRow;

    var acc = 0.0f;
    if forward {
      for (var lj = col + lid.x; lj < localRow; lj += WGS) {
        acc += readA(i, blockStart + lj) * Ainv[ainvBase + lj * BLOCK_SIZE + col];
      }
    } else {
      for (var lj = localRow + 1u + lid.x; lj <= col; lj += WGS) {
        acc += readA(i, blockStart + lj) * Ainv[ainvBase + lj * BLOCK_SIZE + col];
      }
    }

    scratch[lid.x] = acc;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let e = select(0.0, 1.0, localRow == col);
      let rhs = e - scratch[0];
      var val: f32;
      if params.diag == 1u {
        val = rhs;
      } else {
        val = rhs / A[i * params.lda + i];
      }
      Ainv[ainvBase + localRow * BLOCK_SIZE + col] = val;
    }
    storageBarrier();
    workgroupBarrier();
  }
}
`});var Se,Pe=I(()=>{Se=`// strsv_apply_inverse: given a precomputed block inverse (from
// strsv_invert_block.wgsl), computes this block's solution as a dense
// matrix-vector multiply against the block's current remainder in x \u2014
// replacing what the old strsv_block.wgsl did via a genuinely sequential,
// barrier-per-row substitution.
//
// All blockLen rows are computed in parallel within a single workgroup: the
// remainder is loaded into workgroup-shared memory once, then each thread
// independently computes one full row's dot product from that shared copy.
// No further synchronization is needed after the load \u2014 every thread only
// reads shared memory from then on (never written again within this call)
// and writes a distinct element of x, so there's no cross-thread hazard to
// guard against.

@group(0) @binding(0) var<storage, read>       Ainv: array<f32>;
@group(0) @binding(1) var<storage, read_write> x: array<f32>;

struct Params {
  incx:       u32,
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
var<workgroup> xLocal: array<f32, 64>;

@compute @workgroup_size(64)
fn strsv_apply_inverse_main(@builtin(local_invocation_id) lid: vec3u) {
  let blockLen = params.blockEnd - params.blockStart;

  if (lid.x < blockLen) {
    xLocal[lid.x] = x[(params.blockStart + lid.x) * params.incx];
  }
  workgroupBarrier();

  if (lid.x >= blockLen) { return; }

  let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  var acc = 0.0f;
  for (var j = 0u; j < blockLen; j++) {
    acc += Ainv[ainvBase + lid.x * BLOCK_SIZE + j] * xLocal[j];
  }
  x[(params.blockStart + lid.x) * params.incx] = acc;
}
`});var je,Fe=I(()=>{je=`// strsv_update: subtracts a solved block's contribution from every
// remaining row in parallel (one workgroup per row, like strmv.wgsl) \u2014
// this is what turns strsv's O(n) sequential stages into O(n/blockSize).
// No diag/masking needed: this region never touches the diagonal.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> x: array<f32>;

struct Params {
  n:          u32,
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  uplo:       u32,  // 0 = lower, 1 = upper
  blockStart: u32,
  blockEnd:   u32,  // exclusive
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn strsv_update_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  // forward: remaining rows are [blockEnd,n); backward: [0,blockStart).
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  var rangeStart: u32;
  var rangeEnd: u32;

  if forward {
    rangeStart = params.blockEnd;
    rangeEnd = params.n;
  } else {
    rangeStart = 0u;
    rangeEnd = params.blockStart;
  }
  
  if (rangeStart >= rangeEnd) { return; }
  let count = rangeEnd - rangeStart;

  for (var idx = wgid.x; idx < count; idx += nwg.x) {
    let i = rangeStart + idx;

    // No-trans reads A[i,j]; transpose reads A[j,i] \u2014 uplo only sets the range above.
    var acc = 0.0f;
    if params.trans == 0u {
      for (var j = params.blockStart + lid.x; j < params.blockEnd; j += WGS) {
        acc += A[i * params.lda + j] * x[j * params.incx];
      }
    } else {
      for (var j = params.blockStart + lid.x; j < params.blockEnd; j += WGS) {
        acc += A[j * params.lda + i] * x[j * params.incx];
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
      x[i * params.incx] -= scratch[0];
    }
    workgroupBarrier();
  }
}
`});var Le={};yr(Le,{shaderSources:()=>Xt});var Xt,Ne=I(()=>{Mr();Tr();Rr();Dr();Or();Qr();Zr();Xr();Yr();re();te();oe();ne();ue();fe();me();pe();we();he();ve();_e();Ge();Be();Pe();Fe();Xt={"reduction/argmax":Ur,"reduction/sum":Vr,"reduction/sumF64":Hr,sscal:Cr,sswap:zr,saxpy:qr,scopy:Kr,sdot:$r,sasum:Jr,snrm2:ee,srot:ae,srotm:ie,isamax:se,sgemv_n:le,sgemv_t:ce,ssymv:de,strmv:ge,sger:be,ssyr:xe,ssyr2:ye,f64add:Ee,dasum:Ae,strsv_invert_block:ke,strsv_apply_inverse:Se,strsv_update:je}});var ea={};yr(ea,{GpuMatrix:()=>H,GpuVector:()=>x,cleanup:()=>Pr,dasum:()=>Ce,gpuName:()=>Sr,init:()=>kr,isamax:()=>Qe,randomFloat32Array:()=>Nr,randomFloat64Array:()=>Wr,randomTriangularFloat32Array:()=>Ir,sasum:()=>De,saxpy:()=>Ue,scopy:()=>Te,sdot:()=>Re,sgemv:()=>Ke,sger:()=>et,snrm2:()=>ze,srot:()=>qe,srotm:()=>Ze,sscal:()=>Ie,sswap:()=>Me,ssymv:()=>Xe,ssyr:()=>tt,ssyr2:()=>at,strmv:()=>$e,strsv:()=>rt});function Er(a,r){return r?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Gr(){if(!Ar())return{querySet:null,passDescriptor:void 0};let r=V().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function cr(a,r){if(!r)return null;let e=V(),o=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(r,0,2,o,0);let t=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,t,0,16),{tsReadBuffer:t,resolveBuffer:o,querySet:r}}async function P(a){if(!a)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:o}=a;await r.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),o.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Z=null,J=null,Br=null,dr=!1;async function kr({powerPreference:a="high-performance",benchmark:r=!1}={}){if(Z)return Z;let e;if(typeof window>"u"){let{create:i,globals:s}=await import("webgpu");Object.assign(globalThis,s),e=i([]),Br=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(J=await e.requestAdapter({powerPreference:a})??await e.requestAdapter(),!J)throw new Error("No WebGPU adapter found.");dr=r;let t=[...Er(J,r).requiredFeatures??[]];return Z=await J.requestDevice({requiredFeatures:t}),Z.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),Z}function Pr(){Z&&(Z.destroy(),Z=null),J=null,Br=null,dr=!1}function Sr(){if(!J)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:r}=J.info;return{description:r||"unknown",device:a||"unknown"}}function Ar(){return dr}function V(){if(!Z)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Z}function d(...a){a.flat().forEach(r=>r.destroy())}function b(a,r="blas-input",e=!1){let o=V(),t=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,u=o.createBuffer({label:r,size:i,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(u.getMappedRange()).set(a),u.unmap(),u}function D(a,r="blas-storage"){return V().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE})}function q(a,r="blas-result"){return V().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function E(a,r){let o=V().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(r,0,o,0,r.size),o}function N(a,r="blas-params"){let e=V(),o=a.length*4,t=Math.ceil(o/16)*16,i=new ArrayBuffer(t),s=new DataView(i);a.forEach(({value:n,type:l},f)=>{let c=f*4;if(l==="u32")s.setUint32(c,n,!0);else if(l==="i32")s.setInt32(c,n,!0);else if(l==="f32")s.setFloat32(c,n,!0);else throw new Error(`Unknown param type "${l}". Use "f32", "u32", or "i32".`)});let u=e.createBuffer({label:r,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(u,0,i),u}async function _(a,r=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let e=new r(a.getMappedRange().slice());return a.unmap(),e}finally{a.destroy()}}var ht=new ArrayBuffer(8),er=new DataView(ht),Fr=new ArrayBuffer(4),jr=new Uint32Array(Fr),Lr=new Float32Array(Fr);function xt(a){return jr[0]=a>>>0,Lr[0]}function vt(a){return Lr[0]=a,jr[0]}function yt(a,r,e,o){let t=r>>>3,i=r&7,s=o>>>29,u=e<<3|s,n=o&536870911,l=a<<31|t<<23|u,f=i>>>2&1,c=i&3,p=n>>>23,m=n&8388607,g=c<<6|p,w=(f<<31|g<<23|m)>>>0;return[xt(l),w]}function _t(a,r){let e=vt(a);r=r>>>0;let o=e>>>31,t=e>>>23&255,i=e&8388607,s=r>>>31,u=r>>>23&255,n=r&8388607,l=s<<2|u>>>6,f=(u&63)<<23|n,c=t<<3|l,p=i>>>3,g=((i&7)<<29|f)>>>0;return{sign:o,rawExp:c,mantissaHi:p,lo:g}}var Et=2040;function mr(a){er.setFloat64(0,a,!1);let r=er.getUint32(0,!1),e=er.getUint32(4,!1),o=r>>>31,t=r>>>20&2047,i=r&1048575;if(t>=Et)throw new RangeError(`packF64: |${a}| is too large to pack safely (must be finite with magnitude below ~1.4e306); main's bit pattern would itself be NaN/Infinity-shaped and get silently corrupted by any real float32 round-trip`);return yt(o,t,i,e)}function tr(a,r){let{sign:e,rawExp:o,mantissaHi:t,lo:i}=_t(a,r),s=(e<<31|o<<20|t)>>>0;return er.setUint32(0,s,!1),er.setUint32(4,i,!1),er.getFloat64(0,!1)}var x=class a{constructor(r,e,o=Float32Array,t=null){this._buf=r,this._auxBuf=t,this.length=e,this.dtype=o}static from(r){if(r instanceof Float64Array){let o=new Float32Array(r.length),t=new Uint32Array(r.length);for(let u=0;u<r.length;u++){let n=mr(r[u]);o[u]=n[0],t[u]=n[1]}let i=b(o,"gpu-vector-f64-main",!0),s=b(t,"gpu-vector-f64-aux",!0);return new a(i,r.length,Float64Array,s)}if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let e=b(r,"gpu-vector",!0);return new a(e,r.length,r.constructor)}async read(){let r=V(),e=r.createCommandEncoder(),o=E(e,this._buf);if(r.queue.submit([e.finish()]),!this._auxBuf)return _(o,this.dtype);let t=r.createCommandEncoder(),i=E(t,this._auxBuf);r.queue.submit([t.finish()]);let[s,u]=await Promise.all([_(o,Float32Array),_(i,Uint32Array)]),n=new Float64Array(this.length);for(let l=0;l<this.length;l++)n[l]=tr(s[l],u[l]);return n}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var H=class a{constructor(r,e,o,t,i=null,s="row-major"){this._buf=r,this._auxBuf=i,this.rows=e,this.cols=o,this.lda=t,this.layout=s}static from(r,e,o,t,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(t===void 0&&(t=s?o:e),!(r instanceof Float32Array)&&!(r instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let u=s?o:e;if(!Number.isInteger(t)||t<u)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?e:o;if(r.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(r instanceof Float64Array){let f=n*t,c=new Float32Array(f),p=new Uint32Array(f);for(let w=0;w<f;w++){let y=mr(r[w]);c[w]=y[0],p[w]=y[1]}let m=b(c,"gpu-matrix-f64-main",!0),g=b(p,"gpu-matrix-f64-aux",!0);return new a(m,e,o,t,g,i)}let l=b(r.subarray(0,n*t),"gpu-matrix",!0);return new a(l,e,o,t,null,i)}async read(){let r=V(),e=r.createCommandEncoder(),o=E(e,this._buf);r.queue.submit([e.finish()]);let t=this.layout!=="column-major",i=t?this.rows:this.cols,s=t?this.cols:this.rows;if(this._auxBuf){let l=r.createCommandEncoder(),f=E(l,this._auxBuf);r.queue.submit([l.finish()]);let[c,p]=await Promise.all([_(o,Float32Array),_(f,Uint32Array)]),m=new Float64Array(i*this.lda);for(let w=0;w<m.length;w++)m[w]=tr(c[w],p[w]);if(this.lda===s)return m;let g=new Float64Array(i*s);for(let w=0;w<i;w++)g.set(m.subarray(w*this.lda,w*this.lda+s),w*s);return g}let u=await _(o,Float32Array);if(this.lda===s)return u;let n=new Float32Array(i*s);for(let l=0;l<i;l++)n.set(u.subarray(l*this.lda,l*this.lda+s),l*s);return n}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function Nr(a,r=-1,e=1){let o=new Float32Array(a);for(let t=0;t<a;t++)o[t]=r+Math.random()*(e-r);return o}function Wr(a,r=-1,e=1){let o=new Float64Array(a);for(let t=0;t<a;t++)o[t]=r+Math.random()*(e-r);return o}function Ir(a,r,e="lower",o=-1,t=1,i=5,s=15){if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r<a)throw new Error("lda must be >= n.");let u=new Float32Array(a*r);for(let n=0;n<a;n++){for(let l=0;l<a;l++){if(n===l)continue;(e==="lower"?l<n:l>n)&&(u[n*r+l]=o+Math.random()*(t-o))}u[n*r+n]=i+Math.random()*(s-i)}return u}function A(a,r,e=0){let o=V(),t=r.map((i,s)=>({binding:e+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:t})}var Gt=new WeakMap;function S(a){V().queue.submit([a.finish()])}function pr(){let a=V(),{querySet:r,passDescriptor:e}=Gr();return{commandEncoder:a.createCommandEncoder(),querySet:r,passDescriptor:e}}function ir(a,r,e,o,t){let i=a.beginComputePass(t);i.setPipeline(r),i.setBindGroup(0,e),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y),i.end(),Gt.set(a,i)}function L(a,r,e){let{commandEncoder:o,querySet:t,passDescriptor:i}=pr();ir(o,a,r,e,i);let s=cr(o,t);return{commandEncoder:o,ts:s}}var Jt={},gr=new WeakMap;async function B(a,r,e="main"){gr.has(a)||gr.set(a,new Map);let o=gr.get(a),t=Array.isArray(r)?r:[r],i=`${t.join("+")}::${e}`;return o.has(i)||o.set(i,await Yt(t,e)),o.get(i)}async function $t(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(Ne(),Le)),e=r[a];if(!e)throw new Error(`Shader "${a}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:o,join:t}=await import("path"),i=o(e(Jt.url));return r(t(i,`../shaders/${a}.wgsl`),"utf8")}}async function Yt(a,r="main"){let e=V(),o=a.join("+"),t=(await Promise.all(a.map($t))).join(`
`),i=e.createShaderModule({label:o,code:t}),u=(await i.getCompilationInfo()).messages.filter(f=>f.type==="error");if(u.length>0)throw new Error(`Shader "${o}" compilation failed:
${u.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let n=r==="main"?{module:i}:{module:i,entryPoint:r},l=e.createComputePipeline({label:o,layout:"auto",compute:n});return l._shaderModule=i,l}var ra=64,We=8;function C(a,r){let e=V().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(a/ra),e):{x:Math.min(Math.ceil(r/We),e),y:Math.min(Math.ceil(a/We),e)}}async function Ie(a,r,e,o,t){let i=o instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof x))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return i?{}:o;if(o.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await B(a,"sscal"),u=null,n=null,l=null;try{u=i?o._buf:b(o,"sscal-x",!0),n=N([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=A(s.getBindGroupLayout(0),[u,n]),{commandEncoder:c,ts:p}=L(s,f,C(r));l=i?null:E(c,u),S(c);let m=await P(p);if(i)return m!==void 0?{gpuTimeMs:m}:{};let g=await _(l,Float32Array);return l=null,m!==void 0?{x:g,gpuTimeMs:m}:g}finally{!i&&u&&d(u),n&&d(n),l&&d(l)}}async function Me(a,r,e,o,t,i){let s=e instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof x))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof x))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:t};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"sswap"),l=null,f=null,c=null,p=null,m=null;try{l=s?e._buf:b(e,"sswap-x",!0),f=u?t._buf:b(t,"sswap-y",!0),c=N([{value:r,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let g=A(n.getBindGroupLayout(0),[l,f,c]),{commandEncoder:w,ts:y}=L(n,g,C(r));p=s?null:E(w,l),m=u?null:E(w,f),S(w);let h=await P(y);if(s&&u)return h!==void 0?{gpuTimeMs:h}:{};let G=await _(p,Float32Array);p=null;let v=await _(m,Float32Array);return m=null,h!==void 0?{x:G,y:v,gpuTimeMs:h}:{x:G,y:v}}finally{!s&&l&&d(l),!u&&f&&d(f),c&&d(c),p&&d(p),m&&d(m)}}async function Ue(a,r,e,o,t,i,s){let u=o instanceof x,n=i instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!u&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:i};if(o.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"saxpy"),f=null,c=null,p=null,m=null;try{f=u?o._buf:b(o,"saxpy-x",!1),c=n?i._buf:b(i,"saxpy-y",!0),p=N([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let g=A(l.getBindGroupLayout(0),[f,c,p]),{commandEncoder:w,ts:y}=L(l,g,C(r));m=n?null:E(w,c),S(w);let h=await P(y);if(n&&u)return h!==void 0?{gpuTimeMs:h}:{};let G=await _(m,Float32Array);return m=null,h!==void 0?{y:G,gpuTimeMs:h}:{y:G}}finally{!u&&f&&d(f),!n&&c&&d(c),p&&d(p),m&&d(m)}}async function Te(a,r,e,o,t,i){let s=e instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:t};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"scopy"),l=null,f=null,c=null,p=null;try{l=s?e._buf:b(e,"scopy-x",!1),f=u?t._buf:b(t,"scopy-y",!0),c=N([{value:r,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let m=A(n.getBindGroupLayout(0),[l,f,c]),{commandEncoder:g,ts:w}=L(n,m,C(r));p=u?null:E(g,f),S(g);let y=await P(w);if(u&&s)return y!==void 0?{gpuTimeMs:y}:{};let h=await _(p,Float32Array);return p=null,y!==void 0?{y:h,gpuTimeMs:y}:{y:h}}finally{!s&&l&&d(l),!u&&f&&d(f),c&&d(c),p&&d(p)}}var Ve=64;async function Re(a,r,e,o,t,i){let s=e instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"sdot"),l=await B(a,"reduction/sum"),f=null,c=null,p=null,m=null,g=null,w=null;try{f=s?e._buf:b(e,"sdot-x",!1),c=u?t._buf:b(t,"sdot-y",!1),p=D(2*Ve*4,"sdot-partials"),m=q(4,"sdot-result"),g=N([{value:r,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let y=A(n.getBindGroupLayout(0),[f,c,p,g]),{commandEncoder:h,ts:G}=L(n,y,2*Ve);S(h);let v=A(l.getBindGroupLayout(0),[p,m]),{commandEncoder:F,ts:k}=L(l,v,1);w=E(F,m),S(F);let j=_(w,Float32Array);w=null;let[W,M,U]=await Promise.all([P(G),P(k),j]);return W!==void 0&&M!==void 0?{dot:U[0],gpuTimeMs:W+M}:{dot:U[0]}}finally{!s&&f&&d(f),!u&&c&&d(c),p&&d(p),m&&d(m),g&&d(g),w&&d(w)}}var He=64;async function De(a,r,e,o){let t=e instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await B(a,"sasum"),s=await B(a,"reduction/sum"),u=null,n=null,l=null,f=null,c=null;try{u=t?e._buf:b(e,"sasum-x",!1),n=D(2*He*4,"sasum-partials"),l=q(4,"sasum-result"),f=N([{value:r,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=A(i.getBindGroupLayout(0),[u,n,f]),{commandEncoder:m,ts:g}=L(i,p,2*He);S(m);let w=A(s.getBindGroupLayout(0),[n,l]),{commandEncoder:y,ts:h}=L(s,w,1);c=E(y,l),S(y);let G=_(c,Float32Array);c=null;let[v,F,k]=await Promise.all([P(g),P(h),G]);return v!==void 0&&F!==void 0?{asum:k[0],gpuTimeMs:v+F}:{asum:k[0]}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),f&&d(f),c&&d(c)}}var wr=64;async function Ce(a,r,e,o){let t=e instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await B(a,["f64add","dasum"]),s=await B(a,["f64add","reduction/sumF64"]),u=null,n=null,l=null,f=null,c=null,p=null,m=null,g=null;try{u=t?e:x.from(e),n=D(2*wr*4,"dasum-partialsMain"),l=D(2*wr*4,"dasum-partialsAux"),f=q(4,"dasum-result-main"),c=q(4,"dasum-result-aux"),p=N([{value:r,type:"u32"},{value:o,type:"u32"}],"dasum-params");let w=A(i.getBindGroupLayout(0),[u._buf,u._auxBuf,n,l,p]),{commandEncoder:y,ts:h}=L(i,w,2*wr);S(y);let G=A(s.getBindGroupLayout(0),[n,l,f,c]),{commandEncoder:v,ts:F}=L(s,G,1);m=E(v,f),g=E(v,c),S(v);let k=_(m,Float32Array),j=_(g,Uint32Array);m=null,g=null;let[W,M,U,T]=await Promise.all([P(h),P(F),k,j]),R=tr(U[0],T[0]);return W!==void 0&&M!==void 0?{asum:R,gpuTimeMs:W+M}:{asum:R}}finally{!t&&u&&u.destroy(),n&&d(n),l&&d(l),f&&d(f),c&&d(c),p&&d(p),m&&d(m),g&&d(g)}}var Oe=64;async function ze(a,r,e,o){let t=e instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await B(a,"snrm2"),s=await B(a,"reduction/sum"),u=null,n=null,l=null,f=null,c=null;try{u=t?e._buf:b(e,"snrm2-x",!1),n=D(2*Oe*4,"snrm2-partials"),l=q(4,"snrm2-result"),f=N([{value:r,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let p=A(i.getBindGroupLayout(0),[u,n,f]),{commandEncoder:m,ts:g}=L(i,p,2*Oe);S(m);let w=A(s.getBindGroupLayout(0),[n,l]),{commandEncoder:y,ts:h}=L(s,w,1);c=E(y,l),S(y);let G=_(c,Float32Array);c=null;let[v,F,k]=await Promise.all([P(g),P(h),G]),j=Math.sqrt(k[0]);return v!==void 0&&F!==void 0?{nrm2:j,gpuTimeMs:v+F}:{nrm2:j}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),f&&d(f),c&&d(c)}}var br=64;async function Qe(a,r,e,o){let t=e instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await B(a,"isamax"),s=await B(a,"reduction/argmax"),u=null,n=null,l=null,f=null,c=null,p=null;try{u=t?e._buf:b(e,"isamax-x",!1),n=D(2*br*4,"isamax-partials-val"),l=D(2*br*4,"isamax-partials-idx"),f=q(4,"isamax-result"),c=N([{value:r,type:"u32"},{value:o,type:"u32"}],"isamax-params");let m=A(i.getBindGroupLayout(0),[u,n,l,c]),{commandEncoder:g,ts:w}=L(i,m,2*br);S(g);let y=A(s.getBindGroupLayout(0),[n,l,f]),{commandEncoder:h,ts:G}=L(s,y,1);p=E(h,f),S(h);let v=_(p,Uint32Array);p=null;let[F,k,j]=await Promise.all([P(w),P(G),v]),W=j[0];return F!==void 0&&k!==void 0?{index:W,gpuTimeMs:F+k}:{index:W}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),f&&d(f),c&&d(c),p&&d(p)}}async function qe(a,r,e,o,t,i,s,u){let n=e instanceof x,l=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof u!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(u))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(u))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{x:e,y:t};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await B(a,"srot"),c=null,p=null,m=null,g=null,w=null;try{c=n?e._buf:b(e,"srot-x",!0),p=l?t._buf:b(t,"srot-y",!0),m=N([{value:r,type:"u32"},{value:s,type:"f32"},{value:u,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let y=A(f.getBindGroupLayout(0),[c,p,m]),{commandEncoder:h,ts:G}=L(f,y,C(r));g=n?null:E(h,c),w=l?null:E(h,p),S(h);let v=await P(G);if(n&&l)return v!==void 0?{gpuTimeMs:v}:{};let F=_(g,Float32Array),k=_(w,Float32Array);g=null,w=null;let[j,W]=await Promise.all([F,k]);return v!==void 0?{x:j,y:W,gpuTimeMs:v}:{x:j,y:W}}finally{!n&&c&&d(c),!l&&p&&d(p),m&&d(m),g&&d(g),w&&d(w)}}async function Ze(a,r,e,o,t,i,s){let u=e instanceof x,n=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return u?{}:{x:e,y:t};if(e.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"srotm"),f=null,c=null,p=null,m=null,g=null,w=null;try{f=u?e._buf:b(e,"srotm-x",!0),c=n?t._buf:b(t,"srotm-y",!0),p=b(s,"srotm-param",!1),m=N([{value:r,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let y=A(l.getBindGroupLayout(0),[f,c,p,m]),{commandEncoder:h,ts:G}=L(l,y,C(r));g=u?null:E(h,f),w=n?null:E(h,c),S(h);let v=await P(G);if(u&&n)return v!==void 0?{gpuTimeMs:v}:{};let F=_(g,Float32Array),k=_(w,Float32Array);g=null,w=null;let[j,W]=await Promise.all([F,k]);return v!==void 0?{x:j,y:W,gpuTimeMs:v}:{x:j,y:W}}finally{!u&&f&&d(f),!n&&c&&d(c),p&&d(p),m&&d(m),g&&d(g),w&&d(w)}}async function Ke(a,r,e,o,t,i,s,u,n,l,f,c,p="row-major"){let m=i instanceof H,g=u instanceof x,w=f instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(c)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||c<=0)throw new Error("incx and incy must be positive.");if(!m&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(g!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(g&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&u._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(i.rows<e||i.cols<o))throw new Error("A is too small for the given m and n.");if(e<0||o<0)throw new Error("m and n must be non-negative.");if(e===0||o===0)return w?{}:{y:f};(m?i.layout:p)==="column-major"&&([e,o]=[o,e],r=r==="no-transpose"?"transpose":"no-transpose");let h=r==="no-transpose",G=h?o:e,v=h?e:o;if(s<o)throw new Error("lda must be >= n.");if(!m&&i.length<(e-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(u.length<(G-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(v-1)*c+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let k=await B(a,h?"sgemv_n":"sgemv_t"),j=m?i._buf:b(i,"sgemv-A",!1),W=g?u._buf:b(u,"sgemv-x",!1),M=w?f._buf:b(f,"sgemv-y",!0),U=N([{value:e,type:"u32"},{value:o,type:"u32"},{value:t,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:c,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let T=A(k.getBindGroupLayout(0),[j,W,M,U]),R=h?Math.min(e,a.limits.maxComputeWorkgroupsPerDimension):C(v),{commandEncoder:z,ts:Y}=L(k,T,R),Q=w?null:E(z,M);S(z);let O=await P(Y);if(w)return O!==void 0?{gpuTimeMs:O}:{};let nr=await _(Q,Float32Array);return O!==void 0?{y:nr,gpuTimeMs:O}:{y:nr}}finally{m||d(j),g||d(W),w||d(M),d(U)}}async function Xe(a,r,e,o,t,i,s,u,n,l,f,c="row-major"){let p=s instanceof x,m=l instanceof x,g=t instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(u<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<e)throw new Error("lda must be >= n.");if(!g&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&s._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(t.rows<e||t.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return m?{}:{y:l};if(!g&&t.length<(e-1)*i+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let y=(g?t.layout:c)==="column-major"?r==="upper":r==="lower",h=await B(a,"ssymv"),G=null,v=null,F=null,k=null;try{G=g?t._buf:b(t,"ssymv-A",!1),v=p?s._buf:b(s,"ssymv-x",!1),F=m?l._buf:b(l,"ssymv-y",!0),k=N([{value:e,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:y?0:1,type:"u32"}],"ssymv-params");let j=A(h.getBindGroupLayout(0),[G,v,F,k]),W=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:U}=L(h,j,W),T=m?null:E(M,F);S(M);let R=await P(U);if(m)return R!==void 0?{gpuTimeMs:R}:{};let z=await _(T,Float32Array);return R!==void 0?{y:z,gpuTimeMs:R}:{y:z}}finally{!g&&G&&d(G),!p&&v&&d(v),!m&&F&&d(F),k&&d(k)}}async function $e(a,r,e,o,t,i,s,u,n,l,f,c="row-major"){let p=u instanceof x,m=l instanceof x,g=i instanceof H,w=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!w&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!g&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&u._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&m&&i._buf===l._buf)throw new Error("A and y must not reference the same GPU buffer.");if(g&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return m?{}:{y:l};if(!g&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(t-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(g?i.layout:c)==="column-major",G=h?r==="upper":r==="lower",v=h?e==="transpose":e==="no-transpose",F=await B(a,"strmv"),k=null,j=null,W=null,M=null;try{k=g?i._buf:b(i,"strmv-A",!1),j=p?u._buf:b(u,"strmv-x",!1),W=m?l._buf:b(l,"strmv-y",!0),M=N([{value:t,type:"u32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:v?0:1,type:"u32"},{value:G?0:1,type:"u32"},{value:w?1:0,type:"u32"}],"strmv-params");let U=A(F.getBindGroupLayout(0),[k,j,W,M]),T=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:R,ts:z}=L(F,U,T),Y=m?null:E(R,W);S(R);let Q=await P(z);if(m)return Q!==void 0?{gpuTimeMs:Q}:{};let O=await _(Y,Float32Array);return Q!==void 0?{y:O,gpuTimeMs:Q}:{y:O}}finally{!g&&k&&d(k),!p&&j&&d(j),!m&&W&&d(W),M&&d(M)}}var K=64;function Ye(a,r,e){let o=new ArrayBuffer(a*r),t=new DataView(o);for(let i=0;i<a;i++){let s=e(i),u=i*r;s.forEach((n,l)=>t.setUint32(u+l*4,n,!0))}return o}function Je(a,r,e){let o=a.createBuffer({label:e,size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,r),o}async function rt(a,r,e,o,t,i,s,u,n,l="row-major"){let f=u instanceof x,c=i instanceof H,p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!c)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(c&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{x:u};if(!c&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let g=(c?i.layout:l)==="column-major",w=g?r==="upper":r==="lower",y=g?e==="transpose":e==="no-transpose",h=await B(a,"strsv_invert_block"),G=await B(a,"strsv_apply_inverse"),v=await B(a,"strsv_update"),F=y===w,k=[];for(let O=0;O<t;O+=K)k.push(O);F||k.reverse();let j=k.length,W=a.limits.maxComputeWorkgroupsPerDimension,M=a.limits.minUniformBufferOffsetAlignment,U=null,T=null,R=null,z=null,Y=null,Q=null;try{U=c?i._buf:b(i,"strsv-A",!1),T=f?u._buf:b(u,"strsv-x",!0),R=D(j*K*K*4,"strsv-Ainv");let O=Ye(j,M,X=>{let $=X*K,or=Math.min($+K,t);return[n,X,$,or]});z=Je(a,O,"strsv-apply-params");let nr=Ye(j,M,X=>{let $=X*K,or=Math.min($+K,t);return[t,n,s,y?0:1,w?0:1,$,or]});Y=Je(a,nr,"strsv-update-params");let{commandEncoder:rr,querySet:ar}=pr();Q=N([{value:t,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:w?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ot=A(h.getBindGroupLayout(0),[U,R,Q]);ir(rr,h,ot,{x:K,y:j},ar?{timestampWrites:{querySet:ar,beginningOfPassWriteIndex:0}}:void 0);for(let X=0;X<k.length;X++){let $=k[X],or=Math.min($+K,t),st=$/K,ut=X===k.length-1,xr=st*M,lt=A(G.getBindGroupLayout(0),[R,T,{buffer:z,offset:xr,size:16}]);ir(rr,G,lt,1,ut&&ar?{timestampWrites:{querySet:ar,endOfPassWriteIndex:1}}:void 0);let vr=F?t-or:$;if(vr===0)continue;let ft=A(v.getBindGroupLayout(0),[U,T,{buffer:Y,offset:xr,size:32}]),ct=Math.min(vr,W);ir(rr,v,ft,ct)}let it=cr(rr,ar),nt=f?null:E(rr,T);S(rr);let sr=await P(it);if(f)return sr!==void 0?{gpuTimeMs:sr}:{};let hr=await _(nt,Float32Array);return sr!==void 0?{x:hr,gpuTimeMs:sr}:{x:hr}}finally{!c&&U&&d(U),!f&&T&&d(T),R&&d(R),z&&d(z),Y&&d(Y),Q&&d(Q)}}async function et(a,r,e,o,t,i,s,u,n,l,f="row-major"){let c=n instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(r)||!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(l))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||u<=0)throw new Error("incx and incy must be positive.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(c&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<r||n.cols<e))throw new Error("A is too small for the given m and n.");(c?n.layout:f)==="column-major"&&([r,e]=[e,r],[t,s]=[s,t],[i,u]=[u,i]);let m=t instanceof x,g=s instanceof x;if(l<e)throw new Error("lda must be >= n.");if(!m&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&m&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&g&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(r<0||e<0)throw new Error("m and n must be non-negative.");if(r===0||e===0)return c?{}:{A:n};if(!c&&n.length<(r-1)*l+e)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(e-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await B(a,"sger"),y=null,h=null,G=null,v=null;try{y=m?t._buf:b(t,"sger-x",!1),h=g?s._buf:b(s,"sger-y",!1),G=c?n._buf:b(n,"sger-A",!0),v=N([{value:r,type:"u32"},{value:e,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:u,type:"u32"},{value:l,type:"u32"}],"sger-params");let F=A(w.getBindGroupLayout(0),[y,h,G,v]),k=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:W}=L(w,F,k),M=c?null:E(j,G);S(j);let U=await P(W);if(c)return U!==void 0?{gpuTimeMs:U}:{};let T=await _(M,Float32Array);return U!==void 0?{A:T,gpuTimeMs:U}:{A:T}}finally{!m&&y&&d(y),!g&&h&&d(h),!c&&G&&d(G),v&&d(v)}}async function tt(a,r,e,o,t,i,s,u,n="row-major"){let l=t instanceof x,f=s instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(u))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(u<e)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&l&&s._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<e||s.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return f?{}:{A:s};if(!f&&s.length<(e-1)*u+e)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?s.layout:n)==="column-major"?r==="upper":r==="lower",m=await B(a,"ssyr"),g=null,w=null,y=null;try{g=l?t._buf:b(t,"ssyr-x",!1),w=f?s._buf:b(s,"ssyr-A",!0),y=N([{value:e,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:u,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let h=A(m.getBindGroupLayout(0),[g,w,y]),G=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:v,ts:F}=L(m,h,G),k=f?null:E(v,w);S(v);let j=await P(F);if(f)return j!==void 0?{gpuTimeMs:j}:{};let W=await _(k,Float32Array);return j!==void 0?{A:W,gpuTimeMs:j}:{A:W}}finally{!l&&g&&d(g),!f&&w&&d(w),y&&d(y)}}async function at(a,r,e,o,t,i,s,u,n,l,f="row-major"){let c=t instanceof x,p=s instanceof x,m=n instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(l))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||u<=0)throw new Error("incx and incy must be positive.");if(l<e)throw new Error("lda must be >= n.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&t._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<e||n.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return m?{}:{A:n};if(!m&&n.length<(e-1)*l+e)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(e-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let w=(m?n.layout:f)==="column-major"?r==="upper":r==="lower",y=await B(a,"ssyr2"),h=null,G=null,v=null,F=null;try{h=c?t._buf:b(t,"ssyr2-x",!1),G=p?s._buf:b(s,"ssyr2-y",!1),v=m?n._buf:b(n,"ssyr2-A",!0),F=N([{value:e,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:u,type:"u32"},{value:l,type:"u32"},{value:w?0:1,type:"u32"}],"ssyr2-params");let k=A(y.getBindGroupLayout(0),[h,G,v,F]),j=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:W,ts:M}=L(y,k,j),U=m?null:E(W,v);S(W);let T=await P(M);if(m)return T!==void 0?{gpuTimeMs:T}:{};let R=await _(U,Float32Array);return T!==void 0?{A:R,gpuTimeMs:T}:{A:R}}finally{!c&&h&&d(h),!p&&G&&d(G),!m&&v&&d(v),F&&d(F)}}return bt(ea);})();
