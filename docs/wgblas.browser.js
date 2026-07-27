var wgblas=(()=>{var Je=Object.create;var or=Object.defineProperty;var rt=Object.getOwnPropertyDescriptor;var et=Object.getOwnPropertyNames;var tt=Object.getPrototypeOf,at=Object.prototype.hasOwnProperty;var nr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var W=(a,r,e)=>()=>{if(e)throw e[0];try{return a&&(r=a(a=0)),r}catch(i){throw e=[i],i}};var hr=(a,r)=>{for(var e in r)or(a,e,{get:r[e],enumerable:!0})},xr=(a,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of et(r))!at.call(a,t)&&t!==e&&or(a,t,{get:()=>r[t],enumerable:!(i=rt(r,t))||i.enumerable});return a};var sr=(a,r,e)=>(e=a!=null?Je(tt(a)):{},xr(r||!a||!a.__esModule?or(e,"default",{value:a,enumerable:!0}):e,a)),it=a=>xr(or({},"__esModule",{value:!0}),a);var jr,Ir=W(()=>{jr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Wr,Nr=W(()=>{Wr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Ur,Mr=W(()=>{Ur=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
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
`});var Rr,Tr=W(()=>{Rr=`// sscal: x = alpha * x

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
`});var Hr,Vr=W(()=>{Hr=`// sswap: x <-> y

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
`});var Cr,Dr=W(()=>{Cr=`// saxpy: y = alpha * x + y

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
`});var zr,Or=W(()=>{zr=`// scopy: y = x

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
`});var qr,Qr=W(()=>{qr=`// sdot: result = sum(x[i] * y[i])
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
`});var Kr,Zr=W(()=>{Kr=`// sasum: result = sum(|x[i]|)
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
`});var $r,Xr=W(()=>{$r=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Jr,Yr=W(()=>{Jr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var ee,re=W(()=>{ee=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ae,te=W(()=>{ae=`// isamax: returns index of element with largest absolute value
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
`});var oe,ie=W(()=>{oe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var se,ne=W(()=>{se=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var le,ue=W(()=>{le=`// ssymv: y = alpha * A * x + beta * y
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
`});var fe,ce=W(()=>{fe=`// strmv: y = op(A) * x
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
`});var me,de=W(()=>{me=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var ge,pe=W(()=>{ge=`// dasum: result = sum(|x[i]|)
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
`});var be,we=W(()=>{be=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var xe,he=W(()=>{xe=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var ye,ve=W(()=>{ye=`// strsv_update: subtracts a solved block's contribution from every
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
`});var _e={};hr(_e,{shaderSources:()=>Nt});var Nt,Ee=W(()=>{Ir();Nr();Mr();Tr();Vr();Dr();Or();Qr();Zr();Xr();Yr();re();te();ie();ne();ue();ce();de();pe();we();he();ve();Nt={"reduction/argmax":jr,"reduction/sum":Wr,"reduction/sumF64":Ur,sscal:Rr,sswap:Hr,saxpy:Cr,scopy:zr,sdot:qr,sasum:Kr,snrm2:$r,srot:Jr,srotm:ee,isamax:ae,sgemv_n:oe,sgemv_t:se,ssymv:le,strmv:fe,f64add:me,dasum:ge,strsv_invert_block:be,strsv_apply_inverse:xe,strsv_update:ye}});var Rt={};hr(Rt,{GpuMatrix:()=>C,GpuVector:()=>h,cleanup:()=>Br,dasum:()=>je,gpuName:()=>Ar,init:()=>kr,isamax:()=>Me,randomFloat32Array:()=>Fr,randomFloat64Array:()=>Lr,sasum:()=>Ie,saxpy:()=>Ge,scopy:()=>Pe,sdot:()=>Fe,sgemv:()=>Re,snrm2:()=>We,srot:()=>Ue,srotm:()=>Te,sscal:()=>Be,sswap:()=>Ae,ssymv:()=>Ve,strmv:()=>He,strsv:()=>Oe});function vr(a,r){return r?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function yr(){if(!_r())return{querySet:null,passDescriptor:void 0};let r=M().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function ur(a,r){if(!r)return null;let e=M(),i=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(r,0,2,i,0);let t=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(i,0,t,0,16),{tsReadBuffer:t,resolveBuffer:i,querySet:r}}async function G(a){if(!a)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:i}=a;await r.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),i.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Q=null,$=null,Er=null,cr=!1;async function kr({powerPreference:a="high-performance",benchmark:r=!1}={}){if(Q)return Q;let e;if(typeof window>"u"){let{create:o,globals:u}=await import("webgpu");Object.assign(globalThis,u),e=o([]),Er=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if($=await e.requestAdapter({powerPreference:a})??await e.requestAdapter(),!$)throw new Error("No WebGPU adapter found.");cr=r;let t=[...vr($,r).requiredFeatures??[]];return Q=await $.requestDevice({requiredFeatures:t}),Q.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),Q}function Br(){Q&&(Q.destroy(),Q=null),$=null,Er=null,cr=!1}function Ar(){if(!$)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:r}=$.info;return{description:r||"unknown",device:a||"unknown"}}function _r(){return cr}function M(){if(!Q)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Q}function m(...a){a.flat().forEach(r=>r.destroy())}function b(a,r="blas-input",e=!1){let i=M(),t=i.limits.maxStorageBufferBindingSize,o=a.byteLength;if(o>t)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${t} bytes.`);let u=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=i.createBuffer({label:r,size:o,usage:u,mappedAtCreation:!0}),l=a.constructor;return new l(n.getMappedRange()).set(a),n.unmap(),n}function H(a,r="blas-storage"){return M().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE})}function O(a,r="blas-result"){return M().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function _(a,r){let i=M().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(r,0,i,0,r.size),i}function L(a,r="blas-params"){let e=M(),i=a.length*4,t=Math.ceil(i/16)*16,o=new ArrayBuffer(t),u=new DataView(o);a.forEach(({value:l,type:s},f)=>{let c=f*4;if(s==="u32")u.setUint32(c,l,!0);else if(s==="i32")u.setInt32(c,l,!0);else if(s==="f32")u.setFloat32(c,l,!0);else throw new Error(`Unknown param type "${s}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,o),n}async function y(a,r=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let e=new r(a.getMappedRange().slice());return a.unmap(),e}finally{a.destroy()}}var ot=new ArrayBuffer(8),J=new DataView(ot),Gr=new ArrayBuffer(4),Pr=new Uint32Array(Gr),Sr=new Float32Array(Gr);function nt(a){return Pr[0]=a>>>0,Sr[0]}function st(a){return Sr[0]=a,Pr[0]}function ut(a,r,e,i){let t=r>>>3,o=r&7,u=i>>>29,n=e<<3|u,l=i&536870911,s=a<<31|t<<23|n,f=o>>>2&1,c=o&3,d=l>>>23,p=l&8388607,g=c<<6|d,w=(f<<31|g<<23|p)>>>0;return[nt(s),w]}function lt(a,r){let e=st(a);r=r>>>0;let i=e>>>31,t=e>>>23&255,o=e&8388607,u=r>>>31,n=r>>>23&255,l=r&8388607,s=u<<2|n>>>6,f=(n&63)<<23|l,c=t<<3|s,d=o>>>3,g=((o&7)<<29|f)>>>0;return{sign:i,rawExp:c,mantissaHi:d,lo:g}}var ct=2040;function lr(a){J.setFloat64(0,a,!1);let r=J.getUint32(0,!1),e=J.getUint32(4,!1),i=r>>>31,t=r>>>20&2047,o=r&1048575;if(t>=ct)throw new RangeError(`packF64: |${a}| is too large to pack safely (must be finite with magnitude below ~1.4e306); main's bit pattern would itself be NaN/Infinity-shaped and get silently corrupted by any real float32 round-trip`);return ut(i,t,o,e)}function rr(a,r){let{sign:e,rawExp:i,mantissaHi:t,lo:o}=lt(a,r),u=(e<<31|i<<20|t)>>>0;return J.setUint32(0,u,!1),J.setUint32(4,o,!1),J.getFloat64(0,!1)}var h=class a{constructor(r,e,i=Float32Array,t=null){this._buf=r,this._auxBuf=t,this.length=e,this.dtype=i}static from(r){if(r instanceof Float64Array){let i=new Float32Array(r.length),t=new Uint32Array(r.length);for(let n=0;n<r.length;n++){let l=lr(r[n]);i[n]=l[0],t[n]=l[1]}let o=b(i,"gpu-vector-f64-main",!0),u=b(t,"gpu-vector-f64-aux",!0);return new a(o,r.length,Float64Array,u)}if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let e=b(r,"gpu-vector",!0);return new a(e,r.length,r.constructor)}async read(){let r=M(),e=r.createCommandEncoder(),i=_(e,this._buf);if(r.queue.submit([e.finish()]),!this._auxBuf)return y(i,this.dtype);let t=r.createCommandEncoder(),o=_(t,this._auxBuf);r.queue.submit([t.finish()]);let[u,n]=await Promise.all([y(i,Float32Array),y(o,Uint32Array)]),l=new Float64Array(this.length);for(let s=0;s<this.length;s++)l[s]=rr(u[s],n[s]);return l}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var C=class a{constructor(r,e,i,t,o=null){this._buf=r,this._auxBuf=o,this.rows=e,this.cols=i,this.lda=t}static from(r,e,i,t=i){if(!(r instanceof Float32Array)&&!(r instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(t)||t<i)throw new Error("lda must be an integer >= cols.");if(r.length<e*t)throw new Error("data does not have enough elements for the given rows and lda.");if(r instanceof Float64Array){let u=e*t,n=new Float32Array(u),l=new Uint32Array(u);for(let c=0;c<u;c++){let d=lr(r[c]);n[c]=d[0],l[c]=d[1]}let s=b(n,"gpu-matrix-f64-main",!0),f=b(l,"gpu-matrix-f64-aux",!0);return new a(s,e,i,t,f)}let o=b(r.subarray(0,e*t),"gpu-matrix",!0);return new a(o,e,i,t)}async read(){let r=M(),e=r.createCommandEncoder(),i=_(e,this._buf);if(r.queue.submit([e.finish()]),this._auxBuf){let u=r.createCommandEncoder(),n=_(u,this._auxBuf);r.queue.submit([u.finish()]);let[l,s]=await Promise.all([y(i,Float32Array),y(n,Uint32Array)]),f=new Float64Array(this.rows*this.lda);for(let d=0;d<f.length;d++)f[d]=rr(l[d],s[d]);if(this.lda===this.cols)return f;let c=new Float64Array(this.rows*this.cols);for(let d=0;d<this.rows;d++)c.set(f.subarray(d*this.lda,d*this.lda+this.cols),d*this.cols);return c}let t=await y(i,Float32Array);if(this.lda===this.cols)return t;let o=new Float32Array(this.rows*this.cols);for(let u=0;u<this.rows;u++)o.set(t.subarray(u*this.lda,u*this.lda+this.cols),u*this.cols);return o}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function Fr(a,r=-1,e=1){let i=new Float32Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function Lr(a,r=-1,e=1){let i=new Float64Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function B(a,r,e=0){let i=M(),t=r.map((o,u)=>({binding:e+u,resource:o instanceof GPUBuffer?{buffer:o}:o}));return i.createBindGroup({layout:a,entries:t})}var ft=new WeakMap;function P(a){M().queue.submit([a.finish()])}function fr(){let a=M(),{querySet:r,passDescriptor:e}=yr();return{commandEncoder:a.createCommandEncoder(),querySet:r,passDescriptor:e}}function ar(a,r,e,i,t){let o=a.beginComputePass(t);o.setPipeline(r),o.setBindGroup(0,e),typeof i=="number"?o.dispatchWorkgroups(i):o.dispatchWorkgroups(i.x,i.y),o.end(),ft.set(a,o)}function S(a,r,e){let{commandEncoder:i,querySet:t,passDescriptor:o}=fr();ar(i,a,r,e,o);let u=ur(i,t);return{commandEncoder:i,ts:u}}var Ut={},dr=new WeakMap;async function A(a,r,e="main"){dr.has(a)||dr.set(a,new Map);let i=dr.get(a),t=Array.isArray(r)?r:[r],o=`${t.join("+")}::${e}`;return i.has(o)||i.set(o,await Mt(t,e)),i.get(o)}async function Wt(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(Ee(),_e)),e=r[a];if(!e)throw new Error(`Shader "${a}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:i,join:t}=await import("path"),o=i(e(Ut.url));return r(t(o,`../shaders/${a}.wgsl`),"utf8")}}async function Mt(a,r="main"){let e=M(),i=a.join("+"),t=(await Promise.all(a.map(Wt))).join(`
`),o=e.createShaderModule({label:i,code:t}),n=(await o.getCompilationInfo()).messages.filter(f=>f.type==="error");if(n.length>0)throw new Error(`Shader "${i}" compilation failed:
${n.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let l=r==="main"?{module:o}:{module:o,entryPoint:r},s=e.createComputePipeline({label:i,layout:"auto",compute:l});return s._shaderModule=o,s}var Tt=64,ke=8;function D(a,r){let e=M().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(a/Tt),e):{x:Math.min(Math.ceil(r/ke),e),y:Math.min(Math.ceil(a/ke),e)}}async function Be(a,r,e,i,t){let o=i instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return o?{}:i;if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let u=await A(a,"sscal"),n=null,l=null,s=null;try{n=o?i._buf:b(i,"sscal-x",!0),l=L([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=B(u.getBindGroupLayout(0),[n,l]),{commandEncoder:c,ts:d}=S(u,f,D(r));s=o?null:_(c,n),P(c);let p=await G(d);if(o)return p!==void 0?{gpuTimeMs:p}:{};let g=await y(s,Float32Array);return s=null,p!==void 0?{x:g,gpuTimeMs:p}:g}finally{!o&&n&&m(n),l&&m(l),s&&m(s)}}async function Ae(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof h))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await A(a,"sswap"),s=null,f=null,c=null,d=null,p=null;try{s=u?e._buf:b(e,"sswap-x",!0),f=n?t._buf:b(t,"sswap-y",!0),c=L([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let g=B(l.getBindGroupLayout(0),[s,f,c]),{commandEncoder:w,ts:k}=S(l,g,D(r));d=u?null:_(w,s),p=n?null:_(w,f),P(w);let x=await G(k);if(u&&n)return x!==void 0?{gpuTimeMs:x}:{};let E=await y(d,Float32Array);d=null;let v=await y(p,Float32Array);return p=null,x!==void 0?{x:E,y:v,gpuTimeMs:x}:{x:E,y:v}}finally{!u&&s&&m(s),!n&&f&&m(f),c&&m(c),d&&m(d),p&&m(p)}}async function Ge(a,r,e,i,t,o,u){let n=i instanceof h,l=o instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t)||!Number.isInteger(u))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0||u<=0)throw new Error("incx and incy must be positive.");if(!n&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{y:o};if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await A(a,"saxpy"),f=null,c=null,d=null,p=null;try{f=n?i._buf:b(i,"saxpy-x",!1),c=l?o._buf:b(o,"saxpy-y",!0),d=L([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"},{value:u,type:"u32"}],"saxpy-params");let g=B(s.getBindGroupLayout(0),[f,c,d]),{commandEncoder:w,ts:k}=S(s,g,D(r));p=l?null:_(w,c),P(w);let x=await G(k);if(l&&n)return x!==void 0?{gpuTimeMs:x}:{};let E=await y(p,Float32Array);return p=null,x!==void 0?{y:E,gpuTimeMs:x}:{y:E}}finally{!n&&f&&m(f),!l&&c&&m(c),d&&m(d),p&&m(p)}}async function Pe(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await A(a,"scopy"),s=null,f=null,c=null,d=null;try{s=u?e._buf:b(e,"scopy-x",!1),f=n?t._buf:b(t,"scopy-y",!0),c=L([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let p=B(l.getBindGroupLayout(0),[s,f,c]),{commandEncoder:g,ts:w}=S(l,p,D(r));d=n?null:_(g,f),P(g);let k=await G(w);if(n&&u)return k!==void 0?{gpuTimeMs:k}:{};let x=await y(d,Float32Array);return d=null,k!==void 0?{y:x,gpuTimeMs:k}:{y:x}}finally{!u&&s&&m(s),!n&&f&&m(f),c&&m(c),d&&m(d)}}var Se=64;async function Fe(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await A(a,"sdot"),s=await A(a,"reduction/sum"),f=null,c=null,d=null,p=null,g=null,w=null;try{f=u?e._buf:b(e,"sdot-x",!1),c=n?t._buf:b(t,"sdot-y",!1),d=H(2*Se*4,"sdot-partials"),p=O(4,"sdot-result"),g=L([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let k=B(l.getBindGroupLayout(0),[f,c,d,g]),{commandEncoder:x,ts:E}=S(l,k,2*Se);P(x);let v=B(s.getBindGroupLayout(0),[d,p]),{commandEncoder:F,ts:I}=S(s,v,1);w=_(F,p),P(F);let j=y(w,Float32Array);w=null;let[N,U,T]=await Promise.all([G(E),G(I),j]);return N!==void 0&&U!==void 0?{dot:T[0],gpuTimeMs:N+U}:{dot:T[0]}}finally{!u&&f&&m(f),!n&&c&&m(c),d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}var Le=64;async function Ie(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await A(a,"sasum"),u=await A(a,"reduction/sum"),n=null,l=null,s=null,f=null,c=null;try{n=t?e._buf:b(e,"sasum-x",!1),l=H(2*Le*4,"sasum-partials"),s=O(4,"sasum-result"),f=L([{value:r,type:"u32"},{value:i,type:"u32"}],"sasum-params");let d=B(o.getBindGroupLayout(0),[n,l,f]),{commandEncoder:p,ts:g}=S(o,d,2*Le);P(p);let w=B(u.getBindGroupLayout(0),[l,s]),{commandEncoder:k,ts:x}=S(u,w,1);c=_(k,s),P(k);let E=y(c,Float32Array);c=null;let[v,F,I]=await Promise.all([G(g),G(x),E]);return v!==void 0&&F!==void 0?{asum:I[0],gpuTimeMs:v+F}:{asum:I[0]}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),f&&m(f),c&&m(c)}}var mr=64;async function je(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await A(a,["f64add","dasum"]),u=await A(a,["f64add","reduction/sumF64"]),n=null,l=null,s=null,f=null,c=null,d=null,p=null,g=null;try{n=t?e:h.from(e),l=H(2*mr*4,"dasum-partialsMain"),s=H(2*mr*4,"dasum-partialsAux"),f=O(4,"dasum-result-main"),c=O(4,"dasum-result-aux"),d=L([{value:r,type:"u32"},{value:i,type:"u32"}],"dasum-params");let w=B(o.getBindGroupLayout(0),[n._buf,n._auxBuf,l,s,d]),{commandEncoder:k,ts:x}=S(o,w,2*mr);P(k);let E=B(u.getBindGroupLayout(0),[l,s,f,c]),{commandEncoder:v,ts:F}=S(u,E,1);p=_(v,f),g=_(v,c),P(v);let I=y(p,Float32Array),j=y(g,Uint32Array);p=null,g=null;let[N,U,T,R]=await Promise.all([G(x),G(F),I,j]),V=rr(T[0],R[0]);return N!==void 0&&U!==void 0?{asum:V,gpuTimeMs:N+U}:{asum:V}}finally{!t&&n&&n.destroy(),l&&m(l),s&&m(s),f&&m(f),c&&m(c),d&&m(d),p&&m(p),g&&m(g)}}var Ne=64;async function We(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await A(a,"snrm2"),u=await A(a,"reduction/sum"),n=null,l=null,s=null,f=null,c=null;try{n=t?e._buf:b(e,"snrm2-x",!1),l=H(2*Ne*4,"snrm2-partials"),s=O(4,"snrm2-result"),f=L([{value:r,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let d=B(o.getBindGroupLayout(0),[n,l,f]),{commandEncoder:p,ts:g}=S(o,d,2*Ne);P(p);let w=B(u.getBindGroupLayout(0),[l,s]),{commandEncoder:k,ts:x}=S(u,w,1);c=_(k,s),P(k);let E=y(c,Float32Array);c=null;let[v,F,I]=await Promise.all([G(g),G(x),E]),j=Math.sqrt(I[0]);return v!==void 0&&F!==void 0?{nrm2:j,gpuTimeMs:v+F}:{nrm2:j}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),f&&m(f),c&&m(c)}}var pr=64;async function Me(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await A(a,"isamax"),u=await A(a,"reduction/argmax"),n=null,l=null,s=null,f=null,c=null,d=null;try{n=t?e._buf:b(e,"isamax-x",!1),l=H(2*pr*4,"isamax-partials-val"),s=H(2*pr*4,"isamax-partials-idx"),f=O(4,"isamax-result"),c=L([{value:r,type:"u32"},{value:i,type:"u32"}],"isamax-params");let p=B(o.getBindGroupLayout(0),[n,l,s,c]),{commandEncoder:g,ts:w}=S(o,p,2*pr);P(g);let k=B(u.getBindGroupLayout(0),[l,s,f]),{commandEncoder:x,ts:E}=S(u,k,1);d=_(x,f),P(x);let v=y(d,Uint32Array);d=null;let[F,I,j]=await Promise.all([G(w),G(E),v]),N=j[0];return F!==void 0&&I!==void 0?{index:N,gpuTimeMs:F+I}:{index:N}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),f&&m(f),c&&m(c),d&&m(d)}}async function Ue(a,r,e,i,t,o,u,n){let l=e instanceof h,s=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof u!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(u)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(u))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!l&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await A(a,"srot"),c=null,d=null,p=null,g=null,w=null;try{c=l?e._buf:b(e,"srot-x",!0),d=s?t._buf:b(t,"srot-y",!0),p=L([{value:r,type:"u32"},{value:u,type:"f32"},{value:n,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let k=B(f.getBindGroupLayout(0),[c,d,p]),{commandEncoder:x,ts:E}=S(f,k,D(r));g=l?null:_(x,c),w=s?null:_(x,d),P(x);let v=await G(E);if(l&&s)return v!==void 0?{gpuTimeMs:v}:{};let F=y(g,Float32Array),I=y(w,Float32Array);g=null,w=null;let[j,N]=await Promise.all([F,I]);return v!==void 0?{x:j,y:N,gpuTimeMs:v}:{x:j,y:N}}finally{!l&&c&&m(c),!s&&d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}async function Te(a,r,e,i,t,o,u){let n=e instanceof h,l=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(u instanceof Float32Array)||u.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||u[0]===-2)return n?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await A(a,"srotm"),f=null,c=null,d=null,p=null,g=null,w=null;try{f=n?e._buf:b(e,"srotm-x",!0),c=l?t._buf:b(t,"srotm-y",!0),d=b(u,"srotm-param",!1),p=L([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let k=B(s.getBindGroupLayout(0),[f,c,d,p]),{commandEncoder:x,ts:E}=S(s,k,D(r));g=n?null:_(x,f),w=l?null:_(x,c),P(x);let v=await G(E);if(n&&l)return v!==void 0?{gpuTimeMs:v}:{};let F=y(g,Float32Array),I=y(w,Float32Array);g=null,w=null;let[j,N]=await Promise.all([F,I]);return v!==void 0?{x:j,y:N,gpuTimeMs:v}:{x:j,y:N}}finally{!n&&f&&m(f),!l&&c&&m(c),d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}async function Re(a,r,e,i,t,o,u,n,l,s,f,c){let d=n instanceof h,p=f instanceof h,g=o instanceof C,w=r==="no-transpose";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!w&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(c)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof s!="number")throw new Error("beta must be a number.");if(Number.isNaN(s))throw new Error("beta must not be NaN.");if(!Number.isFinite(s))throw new Error("beta must be finite.");if(l<=0||c<=0)throw new Error("incx and incy must be positive.");if(u<i)throw new Error("lda must be >= n.");if(!g&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(o.rows<e||o.cols<i))throw new Error("A is too small for the given m and n.");if(e<0||i<0)throw new Error("m and n must be non-negative.");if(e===0||i===0)return p?{}:{y:f};let k=w?i:e,x=w?e:i;if(!g&&o.length<(e-1)*u+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(k-1)*l+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(x-1)*c+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let v=await A(a,w?"sgemv_n":"sgemv_t"),F=g?o._buf:b(o,"sgemv-A",!1),I=d?n._buf:b(n,"sgemv-x",!1),j=p?f._buf:b(f,"sgemv-y",!0),N=L([{value:e,type:"u32"},{value:i,type:"u32"},{value:t,type:"f32"},{value:s,type:"f32"},{value:l,type:"u32"},{value:c,type:"u32"},{value:u,type:"u32"}],"sgemv-params");try{let U=B(v.getBindGroupLayout(0),[F,I,j,N]),T=w?Math.min(e,a.limits.maxComputeWorkgroupsPerDimension):D(x),{commandEncoder:R,ts:V}=S(v,U,T),z=p?null:_(R,j);P(R);let Y=await G(V);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let Z=await y(z,Float32Array);return Y!==void 0?{y:Z,gpuTimeMs:Y}:{y:Z}}finally{g||m(F),d||m(I),p||m(j),m(N)}}async function Ve(a,r,e,i,t,o,u,n,l,s,f){let c=u instanceof h,d=s instanceof h,p=t instanceof C,g=r==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(o<e)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&u._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&o!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<e||t.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return d?{}:{y:s};if(!p&&t.length<(e-1)*o+e)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await A(a,"ssymv"),k=null,x=null,E=null,v=null;try{k=p?t._buf:b(t,"ssymv-A",!1),x=c?u._buf:b(u,"ssymv-x",!1),E=d?s._buf:b(s,"ssymv-y",!0),v=L([{value:e,type:"u32"},{value:i,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:o,type:"u32"},{value:g?0:1,type:"u32"}],"ssymv-params");let F=B(w.getBindGroupLayout(0),[k,x,E,v]),I=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:N}=S(w,F,I),U=d?null:_(j,E);P(j);let T=await G(N);if(d)return T!==void 0?{gpuTimeMs:T}:{};let R=await y(U,Float32Array);return T!==void 0?{y:R,gpuTimeMs:T}:{y:R}}finally{!p&&k&&m(k),!c&&x&&m(x),!d&&E&&m(E),v&&m(v)}}async function He(a,r,e,i,t,o,u,n,l,s,f){let c=n instanceof h,d=s instanceof h,p=o instanceof C,g=r==="lower",w=e==="no-transpose",k=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!w&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!k&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!p&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&n._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&d&&o._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return d?{}:{y:s};if(!p&&o.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let x=await A(a,"strmv"),E=null,v=null,F=null,I=null;try{E=p?o._buf:b(o,"strmv-A",!1),v=c?n._buf:b(n,"strmv-x",!1),F=d?s._buf:b(s,"strmv-y",!0),I=L([{value:t,type:"u32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:u,type:"u32"},{value:w?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:k?1:0,type:"u32"}],"strmv-params");let j=B(x.getBindGroupLayout(0),[E,v,F,I]),N=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:U,ts:T}=S(x,j,N),R=d?null:_(U,F);P(U);let V=await G(T);if(d)return V!==void 0?{gpuTimeMs:V}:{};let z=await y(R,Float32Array);return V!==void 0?{y:z,gpuTimeMs:V}:{y:z}}finally{!p&&E&&m(E),!c&&v&&m(v),!d&&F&&m(F),I&&m(I)}}var q=64;function De(a,r,e){let i=new ArrayBuffer(a*r),t=new DataView(i);for(let o=0;o<a;o++){let u=e(o),n=o*r;u.forEach((l,s)=>t.setUint32(n+s*4,l,!0))}return i}function Ce(a,r,e){let i=a.createBuffer({label:e,size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(i,0,r),i}async function Oe(a,r,e,i,t,o,u,n,l){let s=n instanceof h,f=o instanceof C,c=r==="lower",d=e==="no-transpose",p=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!c&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!d&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, and lda must be integers.");if(l<=0)throw new Error("incx must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!f&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!s&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(s&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return s?{}:{x:n};if(!f&&o.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");let g=await A(a,"strsv_invert_block"),w=await A(a,"strsv_apply_inverse"),k=await A(a,"strsv_update"),x=d===c,E=[];for(let z=0;z<t;z+=q)E.push(z);x||E.reverse();let v=E.length,F=a.limits.maxComputeWorkgroupsPerDimension,I=a.limits.minUniformBufferOffsetAlignment,j=null,N=null,U=null,T=null,R=null,V=null;try{j=f?o._buf:b(o,"strsv-A",!1),N=s?n._buf:b(n,"strsv-x",!0),U=H(v*q*q*4,"strsv-Ainv");let z=De(v,I,K=>{let X=K*q,tr=Math.min(X+q,t);return[l,K,X,tr]});T=Ce(a,z,"strsv-apply-params");let Y=De(v,I,K=>{let X=K*q,tr=Math.min(X+q,t);return[t,l,u,d?0:1,c?0:1,X,tr]});R=Ce(a,Y,"strsv-update-params");let{commandEncoder:Z,querySet:er}=fr();V=L([{value:t,type:"u32"},{value:u,type:"u32"},{value:d?0:1,type:"u32"},{value:c?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ze=B(g.getBindGroupLayout(0),[j,U,V]);ar(Z,g,ze,{x:q,y:v},er?{timestampWrites:{querySet:er,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<E.length;K++){let X=E[K],tr=Math.min(X+q,t),Ze=X/q,Ke=K===E.length-1,wr=Ze*I,Xe=B(w.getBindGroupLayout(0),[U,N,{buffer:T,offset:wr,size:16}]);ar(Z,w,Xe,1,Ke&&er?{timestampWrites:{querySet:er,endOfPassWriteIndex:1}}:void 0);let br=x?t-tr:X;if(br===0)continue;let $e=B(k.getBindGroupLayout(0),[j,N,{buffer:R,offset:wr,size:32}]),Ye=Math.min(br,F);ar(Z,k,$e,Ye)}let Qe=ur(Z,er),qe=s?null:_(Z,N);P(Z);let ir=await G(Qe);if(s)return ir!==void 0?{gpuTimeMs:ir}:{};let gr=await y(qe,Float32Array);return ir!==void 0?{x:gr,gpuTimeMs:ir}:{x:gr}}finally{!f&&j&&m(j),!s&&N&&m(N),U&&m(U),T&&m(T),R&&m(R),V&&m(V)}}return it(Rt);})();
