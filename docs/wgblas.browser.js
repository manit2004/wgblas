var wgblas=(()=>{var ut=Object.create;var or=Object.defineProperty;var lt=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var ct=Object.getPrototypeOf,mt=Object.prototype.hasOwnProperty;var nr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var M=(a,e,r)=>()=>{if(r)throw r[0];try{return a&&(e=a(a=0)),e}catch(i){throw r=[i],i}};var hr=(a,e)=>{for(var r in e)or(a,r,{get:e[r],enumerable:!0})},xr=(a,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of ft(e))!mt.call(a,t)&&t!==r&&or(a,t,{get:()=>e[t],enumerable:!(i=lt(e,t))||i.enumerable});return a};var sr=(a,e,r)=>(r=a!=null?ut(ct(a)):{},xr(e||!a||!a.__esModule?or(r,"default",{value:a,enumerable:!0}):r,a)),dt=a=>xr(or({},"__esModule",{value:!0}),a);var Ir,Wr=M(()=>{Ir=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var jr,Lr=M(()=>{jr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Ur,Mr=M(()=>{Ur=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
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
`});var Vr,Tr=M(()=>{Vr=`// sscal: x = alpha * x

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
`});var Hr,Rr=M(()=>{Hr=`// sswap: x <-> y

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
`});var Cr,Dr=M(()=>{Cr=`// saxpy: y = alpha * x + y

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
`});var zr,Or=M(()=>{zr=`// scopy: y = x

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
`});var qr,Qr=M(()=>{qr=`// sdot: result = sum(x[i] * y[i])
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
`});var Kr,Zr=M(()=>{Kr=`// sasum: result = sum(|x[i]|)
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
`});var $r,Xr=M(()=>{$r=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Jr,Yr=M(()=>{Jr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var ee,re=M(()=>{ee=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ae,te=M(()=>{ae=`// isamax: returns index of element with largest absolute value
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
`});var oe,ie=M(()=>{oe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var se,ne=M(()=>{se=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var le,ue=M(()=>{le=`// ssymv: y = alpha * A * x + beta * y
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
`});var ce,fe=M(()=>{ce=`// strmv: y = op(A) * x
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
`});var de,me=M(()=>{de=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var ge,pe=M(()=>{ge=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var be,we=M(()=>{be=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var xe,he=M(()=>{xe=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var ye,ve=M(()=>{ye=`// dasum: result = sum(|x[i]|)
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
`});var Ee,_e=M(()=>{Ee=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var Ae,Ge=M(()=>{Ae=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var ke,Be=M(()=>{ke=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Pe={};hr(Pe,{shaderSources:()=>Qt});var Qt,Se=M(()=>{Wr();Lr();Mr();Tr();Rr();Dr();Or();Qr();Zr();Xr();Yr();re();te();ie();ne();ue();fe();me();pe();we();he();ve();_e();Ge();Be();Qt={"reduction/argmax":Ir,"reduction/sum":jr,"reduction/sumF64":Ur,sscal:Vr,sswap:Hr,saxpy:Cr,scopy:zr,sdot:qr,sasum:Kr,snrm2:$r,srot:Jr,srotm:ee,isamax:ae,sgemv_n:oe,sgemv_t:se,ssymv:le,strmv:ce,sger:de,ssyr:ge,ssyr2:be,f64add:xe,dasum:ye,strsv_invert_block:Ee,strsv_apply_inverse:Ae,strsv_update:ke}});var $t={};hr($t,{GpuMatrix:()=>V,GpuVector:()=>x,cleanup:()=>Ar,dasum:()=>Ve,gpuName:()=>Br,init:()=>Gr,isamax:()=>De,randomFloat32Array:()=>Fr,randomFloat64Array:()=>Nr,sasum:()=>Te,saxpy:()=>Ie,scopy:()=>Le,sdot:()=>Me,sgemv:()=>ze,sger:()=>$e,snrm2:()=>He,srot:()=>Ce,srotm:()=>Oe,sscal:()=>Ne,sswap:()=>We,ssymv:()=>Qe,ssyr:()=>Ye,ssyr2:()=>Je,strmv:()=>qe,strsv:()=>Xe});function vr(a,e){return e?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function yr(){if(!_r())return{querySet:null,passDescriptor:void 0};let e=U().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function ur(a,e){if(!e)return null;let r=U(),i=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(e,0,2,i,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(i,0,t,0,16),{tsReadBuffer:t,resolveBuffer:i,querySet:e}}async function k(a){if(!a)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:i}=a;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),i.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Q=null,$=null,Er=null,fr=!1;async function Gr({powerPreference:a="high-performance",benchmark:e=!1}={}){if(Q)return Q;let r;if(typeof window>"u"){let{create:o,globals:s}=await import("webgpu");Object.assign(globalThis,s),r=o([]),Er=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if($=await r.requestAdapter({powerPreference:a})??await r.requestAdapter(),!$)throw new Error("No WebGPU adapter found.");fr=e;let t=[...vr($,e).requiredFeatures??[]];return Q=await $.requestDevice({requiredFeatures:t}),Q.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),Q}function Ar(){Q&&(Q.destroy(),Q=null),$=null,Er=null,fr=!1}function Br(){if(!$)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:e}=$.info;return{description:e||"unknown",device:a||"unknown"}}function _r(){return fr}function U(){if(!Q)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Q}function d(...a){a.flat().forEach(e=>e.destroy())}function b(a,e="blas-input",r=!1){let i=U(),t=i.limits.maxStorageBufferBindingSize,o=a.byteLength;if(o>t)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${t} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,u=i.createBuffer({label:e,size:o,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(u.getMappedRange()).set(a),u.unmap(),u}function D(a,e="blas-storage"){return U().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE})}function O(a,e="blas-result"){return U().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function G(a,e){let i=U().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(e,0,i,0,e.size),i}function W(a,e="blas-params"){let r=U(),i=a.length*4,t=Math.ceil(i/16)*16,o=new ArrayBuffer(t),s=new DataView(o);a.forEach(({value:n,type:l},c)=>{let m=c*4;if(l==="u32")s.setUint32(m,n,!0);else if(l==="i32")s.setInt32(m,n,!0);else if(l==="f32")s.setFloat32(m,n,!0);else throw new Error(`Unknown param type "${l}". Use "f32", "u32", or "i32".`)});let u=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(u,0,o),u}async function _(a,e=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new e(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}var pt=new ArrayBuffer(8),J=new DataView(pt),kr=new ArrayBuffer(4),Pr=new Uint32Array(kr),Sr=new Float32Array(kr);function gt(a){return Pr[0]=a>>>0,Sr[0]}function wt(a){return Sr[0]=a,Pr[0]}function bt(a,e,r,i){let t=e>>>3,o=e&7,s=i>>>29,u=r<<3|s,n=i&536870911,l=a<<31|t<<23|u,c=o>>>2&1,m=o&3,f=n>>>23,p=n&8388607,g=m<<6|f,w=(c<<31|g<<23|p)>>>0;return[gt(l),w]}function ht(a,e){let r=wt(a);e=e>>>0;let i=r>>>31,t=r>>>23&255,o=r&8388607,s=e>>>31,u=e>>>23&255,n=e&8388607,l=s<<2|u>>>6,c=(u&63)<<23|n,m=t<<3|l,f=o>>>3,g=((o&7)<<29|c)>>>0;return{sign:i,rawExp:m,mantissaHi:f,lo:g}}var xt=2040;function lr(a){J.setFloat64(0,a,!1);let e=J.getUint32(0,!1),r=J.getUint32(4,!1),i=e>>>31,t=e>>>20&2047,o=e&1048575;if(t>=xt)throw new RangeError(`packF64: |${a}| is too large to pack safely (must be finite with magnitude below ~1.4e306); main's bit pattern would itself be NaN/Infinity-shaped and get silently corrupted by any real float32 round-trip`);return bt(i,t,o,r)}function rr(a,e){let{sign:r,rawExp:i,mantissaHi:t,lo:o}=ht(a,e),s=(r<<31|i<<20|t)>>>0;return J.setUint32(0,s,!1),J.setUint32(4,o,!1),J.getFloat64(0,!1)}var x=class a{constructor(e,r,i=Float32Array,t=null){this._buf=e,this._auxBuf=t,this.length=r,this.dtype=i}static from(e){if(e instanceof Float64Array){let i=new Float32Array(e.length),t=new Uint32Array(e.length);for(let u=0;u<e.length;u++){let n=lr(e[u]);i[u]=n[0],t[u]=n[1]}let o=b(i,"gpu-vector-f64-main",!0),s=b(t,"gpu-vector-f64-aux",!0);return new a(o,e.length,Float64Array,s)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=b(e,"gpu-vector",!0);return new a(r,e.length,e.constructor)}async read(){let e=U(),r=e.createCommandEncoder(),i=G(r,this._buf);if(e.queue.submit([r.finish()]),!this._auxBuf)return _(i,this.dtype);let t=e.createCommandEncoder(),o=G(t,this._auxBuf);e.queue.submit([t.finish()]);let[s,u]=await Promise.all([_(i,Float32Array),_(o,Uint32Array)]),n=new Float64Array(this.length);for(let l=0;l<this.length;l++)n[l]=rr(s[l],u[l]);return n}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var V=class a{constructor(e,r,i,t,o=null){this._buf=e,this._auxBuf=o,this.rows=r,this.cols=i,this.lda=t}static from(e,r,i,t=i){if(!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(t)||t<i)throw new Error("lda must be an integer >= cols.");if(e.length<r*t)throw new Error("data does not have enough elements for the given rows and lda.");if(e instanceof Float64Array){let s=r*t,u=new Float32Array(s),n=new Uint32Array(s);for(let m=0;m<s;m++){let f=lr(e[m]);u[m]=f[0],n[m]=f[1]}let l=b(u,"gpu-matrix-f64-main",!0),c=b(n,"gpu-matrix-f64-aux",!0);return new a(l,r,i,t,c)}let o=b(e.subarray(0,r*t),"gpu-matrix",!0);return new a(o,r,i,t)}async read(){let e=U(),r=e.createCommandEncoder(),i=G(r,this._buf);if(e.queue.submit([r.finish()]),this._auxBuf){let s=e.createCommandEncoder(),u=G(s,this._auxBuf);e.queue.submit([s.finish()]);let[n,l]=await Promise.all([_(i,Float32Array),_(u,Uint32Array)]),c=new Float64Array(this.rows*this.lda);for(let f=0;f<c.length;f++)c[f]=rr(n[f],l[f]);if(this.lda===this.cols)return c;let m=new Float64Array(this.rows*this.cols);for(let f=0;f<this.rows;f++)m.set(c.subarray(f*this.lda,f*this.lda+this.cols),f*this.cols);return m}let t=await _(i,Float32Array);if(this.lda===this.cols)return t;let o=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)o.set(t.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return o}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function Fr(a,e=-1,r=1){let i=new Float32Array(a);for(let t=0;t<a;t++)i[t]=e+Math.random()*(r-e);return i}function Nr(a,e=-1,r=1){let i=new Float64Array(a);for(let t=0;t<a;t++)i[t]=e+Math.random()*(r-e);return i}function A(a,e,r=0){let i=U(),t=e.map((o,s)=>({binding:r+s,resource:o instanceof GPUBuffer?{buffer:o}:o}));return i.createBindGroup({layout:a,entries:t})}var vt=new WeakMap;function P(a){U().queue.submit([a.finish()])}function cr(){let a=U(),{querySet:e,passDescriptor:r}=yr();return{commandEncoder:a.createCommandEncoder(),querySet:e,passDescriptor:r}}function ar(a,e,r,i,t){let o=a.beginComputePass(t);o.setPipeline(e),o.setBindGroup(0,r),typeof i=="number"?o.dispatchWorkgroups(i):o.dispatchWorkgroups(i.x,i.y),o.end(),vt.set(a,o)}function F(a,e,r){let{commandEncoder:i,querySet:t,passDescriptor:o}=cr();ar(i,a,e,r,o);let s=ur(i,t);return{commandEncoder:i,ts:s}}var Kt={},mr=new WeakMap;async function B(a,e,r="main"){mr.has(a)||mr.set(a,new Map);let i=mr.get(a),t=Array.isArray(e)?e:[e],o=`${t.join("+")}::${r}`;return i.has(o)||i.set(o,await Zt(t,r)),i.get(o)}async function qt(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(Se(),Pe)),r=e[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:i,join:t}=await import("path"),o=i(r(Kt.url));return e(t(o,`../shaders/${a}.wgsl`),"utf8")}}async function Zt(a,e="main"){let r=U(),i=a.join("+"),t=(await Promise.all(a.map(qt))).join(`
`),o=r.createShaderModule({label:i,code:t}),u=(await o.getCompilationInfo()).messages.filter(c=>c.type==="error");if(u.length>0)throw new Error(`Shader "${i}" compilation failed:
${u.map(c=>`  line ${c.lineNum}: ${c.message}`).join(`
`)}`);let n=e==="main"?{module:o}:{module:o,entryPoint:e},l=r.createComputePipeline({label:i,layout:"auto",compute:n});return l._shaderModule=o,l}var Xt=64,Fe=8;function C(a,e){let r=U().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(a/Xt),r):{x:Math.min(Math.ceil(e/Fe),r),y:Math.min(Math.ceil(a/Fe),r)}}async function Ne(a,e,r,i,t){let o=i instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof x))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return o?{}:i;if(i.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await B(a,"sscal"),u=null,n=null,l=null;try{u=o?i._buf:b(i,"sscal-x",!0),n=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let c=A(s.getBindGroupLayout(0),[u,n]),{commandEncoder:m,ts:f}=F(s,c,C(e));l=o?null:G(m,u),P(m);let p=await k(f);if(o)return p!==void 0?{gpuTimeMs:p}:{};let g=await _(l,Float32Array);return l=null,p!==void 0?{x:g,gpuTimeMs:p}:g}finally{!o&&u&&d(u),n&&d(n),l&&d(l)}}async function We(a,e,r,i,t,o){let s=r instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof x))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof x))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:t};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"sswap"),l=null,c=null,m=null,f=null,p=null;try{l=s?r._buf:b(r,"sswap-x",!0),c=u?t._buf:b(t,"sswap-y",!0),m=W([{value:e,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let g=A(n.getBindGroupLayout(0),[l,c,m]),{commandEncoder:w,ts:v}=F(n,g,C(e));f=s?null:G(w,l),p=u?null:G(w,c),P(w);let h=await k(v);if(s&&u)return h!==void 0?{gpuTimeMs:h}:{};let E=await _(f,Float32Array);f=null;let y=await _(p,Float32Array);return p=null,h!==void 0?{x:E,y,gpuTimeMs:h}:{x:E,y}}finally{!s&&l&&d(l),!u&&c&&d(c),m&&d(m),f&&d(f),p&&d(p)}}async function Ie(a,e,r,i,t,o,s){let u=i instanceof x,n=o instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!u&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:o};if(i.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"saxpy"),c=null,m=null,f=null,p=null;try{c=u?i._buf:b(i,"saxpy-x",!1),m=n?o._buf:b(o,"saxpy-y",!0),f=W([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let g=A(l.getBindGroupLayout(0),[c,m,f]),{commandEncoder:w,ts:v}=F(l,g,C(e));p=n?null:G(w,m),P(w);let h=await k(v);if(n&&u)return h!==void 0?{gpuTimeMs:h}:{};let E=await _(p,Float32Array);return p=null,h!==void 0?{y:E,gpuTimeMs:h}:{y:E}}finally{!u&&c&&d(c),!n&&m&&d(m),f&&d(f),p&&d(p)}}async function Le(a,e,r,i,t,o){let s=r instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{y:t};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"scopy"),l=null,c=null,m=null,f=null;try{l=s?r._buf:b(r,"scopy-x",!1),c=u?t._buf:b(t,"scopy-y",!0),m=W([{value:e,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let p=A(n.getBindGroupLayout(0),[l,c,m]),{commandEncoder:g,ts:w}=F(n,p,C(e));f=u?null:G(g,c),P(g);let v=await k(w);if(u&&s)return v!==void 0?{gpuTimeMs:v}:{};let h=await _(f,Float32Array);return f=null,v!==void 0?{y:h,gpuTimeMs:v}:{y:h}}finally{!s&&l&&d(l),!u&&c&&d(c),m&&d(m),f&&d(f)}}var je=64;async function Me(a,e,r,i,t,o){let s=r instanceof x,u=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await B(a,"sdot"),l=await B(a,"reduction/sum"),c=null,m=null,f=null,p=null,g=null,w=null;try{c=s?r._buf:b(r,"sdot-x",!1),m=u?t._buf:b(t,"sdot-y",!1),f=D(2*je*4,"sdot-partials"),p=O(4,"sdot-result"),g=W([{value:e,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let v=A(n.getBindGroupLayout(0),[c,m,f,g]),{commandEncoder:h,ts:E}=F(n,v,2*je);P(h);let y=A(l.getBindGroupLayout(0),[f,p]),{commandEncoder:S,ts:N}=F(l,y,1);w=G(S,p),P(S);let L=_(w,Float32Array);w=null;let[I,j,T]=await Promise.all([k(E),k(N),L]);return I!==void 0&&j!==void 0?{dot:T[0],gpuTimeMs:I+j}:{dot:T[0]}}finally{!s&&c&&d(c),!u&&m&&d(m),f&&d(f),p&&d(p),g&&d(g),w&&d(w)}}var Ue=64;async function Te(a,e,r,i){let t=r instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"sasum"),s=await B(a,"reduction/sum"),u=null,n=null,l=null,c=null,m=null;try{u=t?r._buf:b(r,"sasum-x",!1),n=D(2*Ue*4,"sasum-partials"),l=O(4,"sasum-result"),c=W([{value:e,type:"u32"},{value:i,type:"u32"}],"sasum-params");let f=A(o.getBindGroupLayout(0),[u,n,c]),{commandEncoder:p,ts:g}=F(o,f,2*Ue);P(p);let w=A(s.getBindGroupLayout(0),[n,l]),{commandEncoder:v,ts:h}=F(s,w,1);m=G(v,l),P(v);let E=_(m,Float32Array);m=null;let[y,S,N]=await Promise.all([k(g),k(h),E]);return y!==void 0&&S!==void 0?{asum:N[0],gpuTimeMs:y+S}:{asum:N[0]}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),c&&d(c),m&&d(m)}}var dr=64;async function Ve(a,e,r,i){let t=r instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,["f64add","dasum"]),s=await B(a,["f64add","reduction/sumF64"]),u=null,n=null,l=null,c=null,m=null,f=null,p=null,g=null;try{u=t?r:x.from(r),n=D(2*dr*4,"dasum-partialsMain"),l=D(2*dr*4,"dasum-partialsAux"),c=O(4,"dasum-result-main"),m=O(4,"dasum-result-aux"),f=W([{value:e,type:"u32"},{value:i,type:"u32"}],"dasum-params");let w=A(o.getBindGroupLayout(0),[u._buf,u._auxBuf,n,l,f]),{commandEncoder:v,ts:h}=F(o,w,2*dr);P(v);let E=A(s.getBindGroupLayout(0),[n,l,c,m]),{commandEncoder:y,ts:S}=F(s,E,1);p=G(y,c),g=G(y,m),P(y);let N=_(p,Float32Array),L=_(g,Uint32Array);p=null,g=null;let[I,j,T,R]=await Promise.all([k(h),k(S),N,L]),H=rr(T[0],R[0]);return I!==void 0&&j!==void 0?{asum:H,gpuTimeMs:I+j}:{asum:H}}finally{!t&&u&&u.destroy(),n&&d(n),l&&d(l),c&&d(c),m&&d(m),f&&d(f),p&&d(p),g&&d(g)}}var Re=64;async function He(a,e,r,i){let t=r instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"snrm2"),s=await B(a,"reduction/sum"),u=null,n=null,l=null,c=null,m=null;try{u=t?r._buf:b(r,"snrm2-x",!1),n=D(2*Re*4,"snrm2-partials"),l=O(4,"snrm2-result"),c=W([{value:e,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let f=A(o.getBindGroupLayout(0),[u,n,c]),{commandEncoder:p,ts:g}=F(o,f,2*Re);P(p);let w=A(s.getBindGroupLayout(0),[n,l]),{commandEncoder:v,ts:h}=F(s,w,1);m=G(v,l),P(v);let E=_(m,Float32Array);m=null;let[y,S,N]=await Promise.all([k(g),k(h),E]),L=Math.sqrt(N[0]);return y!==void 0&&S!==void 0?{nrm2:L,gpuTimeMs:y+S}:{nrm2:L}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),c&&d(c),m&&d(m)}}var pr=64;async function De(a,e,r,i){let t=r instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"isamax"),s=await B(a,"reduction/argmax"),u=null,n=null,l=null,c=null,m=null,f=null;try{u=t?r._buf:b(r,"isamax-x",!1),n=D(2*pr*4,"isamax-partials-val"),l=D(2*pr*4,"isamax-partials-idx"),c=O(4,"isamax-result"),m=W([{value:e,type:"u32"},{value:i,type:"u32"}],"isamax-params");let p=A(o.getBindGroupLayout(0),[u,n,l,m]),{commandEncoder:g,ts:w}=F(o,p,2*pr);P(g);let v=A(s.getBindGroupLayout(0),[n,l,c]),{commandEncoder:h,ts:E}=F(s,v,1);f=G(h,c),P(h);let y=_(f,Uint32Array);f=null;let[S,N,L]=await Promise.all([k(w),k(E),y]),I=L[0];return S!==void 0&&N!==void 0?{index:I,gpuTimeMs:S+N}:{index:I}}finally{!t&&u&&d(u),n&&d(n),l&&d(l),c&&d(c),m&&d(m),f&&d(f)}}async function Ce(a,e,r,i,t,o,s,u){let n=r instanceof x,l=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof u!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(u))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(u))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await B(a,"srot"),m=null,f=null,p=null,g=null,w=null;try{m=n?r._buf:b(r,"srot-x",!0),f=l?t._buf:b(t,"srot-y",!0),p=W([{value:e,type:"u32"},{value:s,type:"f32"},{value:u,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let v=A(c.getBindGroupLayout(0),[m,f,p]),{commandEncoder:h,ts:E}=F(c,v,C(e));g=n?null:G(h,m),w=l?null:G(h,f),P(h);let y=await k(E);if(n&&l)return y!==void 0?{gpuTimeMs:y}:{};let S=_(g,Float32Array),N=_(w,Float32Array);g=null,w=null;let[L,I]=await Promise.all([S,N]);return y!==void 0?{x:L,y:I,gpuTimeMs:y}:{x:L,y:I}}finally{!n&&m&&d(m),!l&&f&&d(f),p&&d(p),g&&d(g),w&&d(w)}}async function Oe(a,e,r,i,t,o,s){let u=r instanceof x,n=t instanceof x;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return u?{}:{x:r,y:t};if(r.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"srotm"),c=null,m=null,f=null,p=null,g=null,w=null;try{c=u?r._buf:b(r,"srotm-x",!0),m=n?t._buf:b(t,"srotm-y",!0),f=b(s,"srotm-param",!1),p=W([{value:e,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let v=A(l.getBindGroupLayout(0),[c,m,f,p]),{commandEncoder:h,ts:E}=F(l,v,C(e));g=u?null:G(h,c),w=n?null:G(h,m),P(h);let y=await k(E);if(u&&n)return y!==void 0?{gpuTimeMs:y}:{};let S=_(g,Float32Array),N=_(w,Float32Array);g=null,w=null;let[L,I]=await Promise.all([S,N]);return y!==void 0?{x:L,y:I,gpuTimeMs:y}:{x:L,y:I}}finally{!u&&c&&d(c),!n&&m&&d(m),f&&d(f),p&&d(p),g&&d(g),w&&d(w)}}async function ze(a,e,r,i,t,o,s,u,n,l,c,m){let f=u instanceof x,p=c instanceof x,g=o instanceof V,w=e==="no-transpose";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!w&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<i)throw new Error("lda must be >= n.");if(!g&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&u._buf===c._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(o.rows<r||o.cols<i))throw new Error("A is too small for the given m and n.");if(r<0||i<0)throw new Error("m and n must be non-negative.");if(r===0||i===0)return p?{}:{y:c};let v=w?i:r,h=w?r:i;if(!g&&o.length<(r-1)*s+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(u.length<(v-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(c.length<(h-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let y=await B(a,w?"sgemv_n":"sgemv_t"),S=g?o._buf:b(o,"sgemv-A",!1),N=f?u._buf:b(u,"sgemv-x",!1),L=p?c._buf:b(c,"sgemv-y",!0),I=W([{value:r,type:"u32"},{value:i,type:"u32"},{value:t,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let j=A(y.getBindGroupLayout(0),[S,N,L,I]),T=w?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):C(h),{commandEncoder:R,ts:H}=F(y,j,T),z=p?null:G(R,L);P(R);let Y=await k(H);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let Z=await _(z,Float32Array);return Y!==void 0?{y:Z,gpuTimeMs:Y}:{y:Z}}finally{g||d(S),f||d(N),p||d(L),d(I)}}async function Qe(a,e,r,i,t,o,s,u,n,l,c){let m=s instanceof x,f=l instanceof x,p=t instanceof V,g=e==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(u)||!Number.isInteger(c)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(u<=0||c<=0)throw new Error("incx and incy must be positive.");if(o<r)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&s._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&o!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{y:l};if(!p&&t.length<(r-1)*o+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(r-1)*c+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await B(a,"ssymv"),v=null,h=null,E=null,y=null;try{v=p?t._buf:b(t,"ssymv-A",!1),h=m?s._buf:b(s,"ssymv-x",!1),E=f?l._buf:b(l,"ssymv-y",!0),y=W([{value:r,type:"u32"},{value:i,type:"f32"},{value:n,type:"f32"},{value:u,type:"u32"},{value:c,type:"u32"},{value:o,type:"u32"},{value:g?0:1,type:"u32"}],"ssymv-params");let S=A(w.getBindGroupLayout(0),[v,h,E,y]),N=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:L,ts:I}=F(w,S,N),j=f?null:G(L,E);P(L);let T=await k(I);if(f)return T!==void 0?{gpuTimeMs:T}:{};let R=await _(j,Float32Array);return T!==void 0?{y:R,gpuTimeMs:T}:{y:R}}finally{!p&&v&&d(v),!m&&h&&d(h),!f&&E&&d(E),y&&d(y)}}async function qe(a,e,r,i,t,o,s,u,n,l,c){let m=u instanceof x,f=l instanceof x,p=o instanceof V,g=e==="lower",w=r==="no-transpose",v=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!w&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!v&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(c)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||c<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!p&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&u._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&f&&o._buf===l._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{y:l};if(!p&&o.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(t-1)*c+1)throw new Error("y does not have enough elements for the given n and incy.");let h=await B(a,"strmv"),E=null,y=null,S=null,N=null;try{E=p?o._buf:b(o,"strmv-A",!1),y=m?u._buf:b(u,"strmv-x",!1),S=f?l._buf:b(l,"strmv-y",!0),N=W([{value:t,type:"u32"},{value:n,type:"u32"},{value:c,type:"u32"},{value:s,type:"u32"},{value:w?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:v?1:0,type:"u32"}],"strmv-params");let L=A(h.getBindGroupLayout(0),[E,y,S,N]),I=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:T}=F(h,L,I),R=f?null:G(j,S);P(j);let H=await k(T);if(f)return H!==void 0?{gpuTimeMs:H}:{};let z=await _(R,Float32Array);return H!==void 0?{y:z,gpuTimeMs:H}:{y:z}}finally{!p&&E&&d(E),!m&&y&&d(y),!f&&S&&d(S),N&&d(N)}}var q=64;function Ze(a,e,r){let i=new ArrayBuffer(a*e),t=new DataView(i);for(let o=0;o<a;o++){let s=r(o),u=o*e;s.forEach((n,l)=>t.setUint32(u+l*4,n,!0))}return i}function Ke(a,e,r){let i=a.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(i,0,e),i}async function Xe(a,e,r,i,t,o,s,u,n){let l=u instanceof x,c=o instanceof V,m=e==="lower",f=r==="no-transpose",p=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!m&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!f&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!c&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!c)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(c&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return l?{}:{x:u};if(!c&&o.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let g=await B(a,"strsv_invert_block"),w=await B(a,"strsv_apply_inverse"),v=await B(a,"strsv_update"),h=f===m,E=[];for(let z=0;z<t;z+=q)E.push(z);h||E.reverse();let y=E.length,S=a.limits.maxComputeWorkgroupsPerDimension,N=a.limits.minUniformBufferOffsetAlignment,L=null,I=null,j=null,T=null,R=null,H=null;try{L=c?o._buf:b(o,"strsv-A",!1),I=l?u._buf:b(u,"strsv-x",!0),j=D(y*q*q*4,"strsv-Ainv");let z=Ze(y,N,K=>{let X=K*q,tr=Math.min(X+q,t);return[n,K,X,tr]});T=Ke(a,z,"strsv-apply-params");let Y=Ze(y,N,K=>{let X=K*q,tr=Math.min(X+q,t);return[t,n,s,f?0:1,m?0:1,X,tr]});R=Ke(a,Y,"strsv-update-params");let{commandEncoder:Z,querySet:er}=cr();H=W([{value:t,type:"u32"},{value:s,type:"u32"},{value:f?0:1,type:"u32"},{value:m?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let rt=A(g.getBindGroupLayout(0),[L,j,H]);ar(Z,g,rt,{x:q,y},er?{timestampWrites:{querySet:er,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<E.length;K++){let X=E[K],tr=Math.min(X+q,t),at=X/q,it=K===E.length-1,wr=at*N,ot=A(w.getBindGroupLayout(0),[j,I,{buffer:T,offset:wr,size:16}]);ar(Z,w,ot,1,it&&er?{timestampWrites:{querySet:er,endOfPassWriteIndex:1}}:void 0);let br=h?t-tr:X;if(br===0)continue;let nt=A(v.getBindGroupLayout(0),[L,I,{buffer:R,offset:wr,size:32}]),st=Math.min(br,S);ar(Z,v,nt,st)}let et=ur(Z,er),tt=l?null:G(Z,I);P(Z);let ir=await k(et);if(l)return ir!==void 0?{gpuTimeMs:ir}:{};let gr=await _(tt,Float32Array);return ir!==void 0?{x:gr,gpuTimeMs:ir}:{x:gr}}finally{!c&&L&&d(L),!l&&I&&d(I),j&&d(j),T&&d(T),R&&d(R),H&&d(H)}}async function $e(a,e,r,i,t,o,s,u,n,l){let c=t instanceof x,m=s instanceof x,f=n instanceof V;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u)||!Number.isInteger(l))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(o<=0||u<=0)throw new Error("incx and incy must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&m&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return f?{}:{A:n};if(!f&&n.length<(e-1)*l+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let p=await B(a,"sger"),g=null,w=null,v=null,h=null;try{g=c?t._buf:b(t,"sger-x",!1),w=m?s._buf:b(s,"sger-y",!1),v=f?n._buf:b(n,"sger-A",!0),h=W([{value:e,type:"u32"},{value:r,type:"u32"},{value:i,type:"f32"},{value:o,type:"u32"},{value:u,type:"u32"},{value:l,type:"u32"}],"sger-params");let E=A(p.getBindGroupLayout(0),[g,w,v,h]),y=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:S,ts:N}=F(p,E,y),L=f?null:G(S,v);P(S);let I=await k(N);if(f)return I!==void 0?{gpuTimeMs:I}:{};let j=await _(L,Float32Array);return I!==void 0?{A:j,gpuTimeMs:I}:{A:j}}finally{!c&&g&&d(g),!m&&w&&d(w),!f&&v&&d(v),h&&d(h)}}async function Ye(a,e,r,i,t,o,s,u){let n=t instanceof x,l=s instanceof V,c=e==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!c&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u))throw new Error("n, incx, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!l&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!n&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(n&&!l)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(l&&n&&s._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(l&&u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return l?{}:{A:s};if(!l&&s.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let m=await B(a,"ssyr"),f=null,p=null,g=null;try{f=n?t._buf:b(t,"ssyr-x",!1),p=l?s._buf:b(s,"ssyr-A",!0),g=W([{value:r,type:"u32"},{value:i,type:"f32"},{value:o,type:"u32"},{value:u,type:"u32"},{value:c?0:1,type:"u32"}],"ssyr-params");let w=A(m.getBindGroupLayout(0),[f,p,g]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:h,ts:E}=F(m,w,v),y=l?null:G(h,p);P(h);let S=await k(E);if(l)return S!==void 0?{gpuTimeMs:S}:{};let N=await _(y,Float32Array);return S!==void 0?{A:N,gpuTimeMs:S}:{A:N}}finally{!n&&f&&d(f),!l&&p&&d(p),g&&d(g)}}async function Je(a,e,r,i,t,o,s,u,n,l){let c=t instanceof x,m=s instanceof x,f=n instanceof V,p=e==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!p&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(u)||!Number.isInteger(l))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(o<=0||u<=0)throw new Error("incx and incy must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&m&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&t._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(f&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{A:n};if(!f&&n.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await B(a,"ssyr2"),w=null,v=null,h=null,E=null;try{w=c?t._buf:b(t,"ssyr2-x",!1),v=m?s._buf:b(s,"ssyr2-y",!1),h=f?n._buf:b(n,"ssyr2-A",!0),E=W([{value:r,type:"u32"},{value:i,type:"f32"},{value:o,type:"u32"},{value:u,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr2-params");let y=A(g.getBindGroupLayout(0),[w,v,h,E]),S=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:L}=F(g,y,S),I=f?null:G(N,h);P(N);let j=await k(L);if(f)return j!==void 0?{gpuTimeMs:j}:{};let T=await _(I,Float32Array);return j!==void 0?{A:T,gpuTimeMs:j}:{A:T}}finally{!c&&w&&d(w),!m&&v&&d(v),!f&&h&&d(h),E&&d(E)}}return dt($t);})();
