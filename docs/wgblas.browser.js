var wgblas=(()=>{var ot=Object.create;var or=Object.defineProperty;var nt=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var ut=Object.getPrototypeOf,lt=Object.prototype.hasOwnProperty;var nr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var j=(a,r,e)=>()=>{if(e)throw e[0];try{return a&&(r=a(a=0)),r}catch(i){throw e=[i],i}};var xr=(a,r)=>{for(var e in r)or(a,e,{get:r[e],enumerable:!0})},hr=(a,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of st(r))!lt.call(a,t)&&t!==e&&or(a,t,{get:()=>r[t],enumerable:!(i=nt(r,t))||i.enumerable});return a};var sr=(a,r,e)=>(e=a!=null?ot(ut(a)):{},hr(r||!a||!a.__esModule?or(e,"default",{value:a,enumerable:!0}):e,a)),ft=a=>hr(or({},"__esModule",{value:!0}),a);var Nr,Ir=j(()=>{Nr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var jr,Wr=j(()=>{jr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Ur,Mr=j(()=>{Ur=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
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
`});var Rr,Tr=j(()=>{Rr=`// sscal: x = alpha * x

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
`});var Hr,Vr=j(()=>{Hr=`// sswap: x <-> y

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
`});var Cr,Dr=j(()=>{Cr=`// saxpy: y = alpha * x + y

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
`});var zr,Or=j(()=>{zr=`// scopy: y = x

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
`});var qr,Qr=j(()=>{qr=`// sdot: result = sum(x[i] * y[i])
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
`});var Kr,Zr=j(()=>{Kr=`// sasum: result = sum(|x[i]|)
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
`});var $r,Xr=j(()=>{$r=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Jr,Yr=j(()=>{Jr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var ee,re=j(()=>{ee=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ae,te=j(()=>{ae=`// isamax: returns index of element with largest absolute value
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
`});var oe,ie=j(()=>{oe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var se,ne=j(()=>{se=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var le,ue=j(()=>{le=`// ssymv: y = alpha * A * x + beta * y
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
`});var ce,fe=j(()=>{ce=`// strmv: y = op(A) * x
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
`});var me,de=j(()=>{me=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var ge,pe=j(()=>{ge=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var be,we=j(()=>{be=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var he,xe=j(()=>{he=`// dasum: result = sum(|x[i]|)
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
`});var ye,ve=j(()=>{ye=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var Ee,_e=j(()=>{Ee=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Ae,Ge=j(()=>{Ae=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Be={};xr(Be,{shaderSources:()=>Dt});var Dt,ke=j(()=>{Ir();Wr();Mr();Tr();Vr();Dr();Or();Qr();Zr();Xr();Yr();re();te();ie();ne();ue();fe();de();pe();we();xe();ve();_e();Ge();Dt={"reduction/argmax":Nr,"reduction/sum":jr,"reduction/sumF64":Ur,sscal:Rr,sswap:Hr,saxpy:Cr,scopy:zr,sdot:qr,sasum:Kr,snrm2:$r,srot:Jr,srotm:ee,isamax:ae,sgemv_n:oe,sgemv_t:se,ssymv:le,strmv:ce,sger:me,ssyr:ge,f64add:be,dasum:he,strsv_invert_block:ye,strsv_apply_inverse:Ee,strsv_update:Ae}});var qt={};xr(qt,{GpuMatrix:()=>R,GpuVector:()=>h,cleanup:()=>Ar,dasum:()=>Ue,gpuName:()=>Br,init:()=>Gr,isamax:()=>Ve,randomFloat32Array:()=>Fr,randomFloat64Array:()=>Lr,sasum:()=>Me,saxpy:()=>Le,scopy:()=>Ie,sdot:()=>We,sgemv:()=>Ce,sger:()=>Ke,snrm2:()=>Re,srot:()=>He,srotm:()=>De,sscal:()=>Se,sswap:()=>Fe,ssymv:()=>Oe,ssyr:()=>Xe,strmv:()=>ze,strsv:()=>Ze});function vr(a,r){return r?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function yr(){if(!_r())return{querySet:null,passDescriptor:void 0};let r=M().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function ur(a,r){if(!r)return null;let e=M(),i=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(r,0,2,i,0);let t=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(i,0,t,0,16),{tsReadBuffer:t,resolveBuffer:i,querySet:r}}async function k(a){if(!a)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:i}=a;await r.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),i.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Q=null,$=null,Er=null,fr=!1;async function Gr({powerPreference:a="high-performance",benchmark:r=!1}={}){if(Q)return Q;let e;if(typeof window>"u"){let{create:o,globals:u}=await import("webgpu");Object.assign(globalThis,u),e=o([]),Er=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if($=await e.requestAdapter({powerPreference:a})??await e.requestAdapter(),!$)throw new Error("No WebGPU adapter found.");fr=r;let t=[...vr($,r).requiredFeatures??[]];return Q=await $.requestDevice({requiredFeatures:t}),Q.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),Q}function Ar(){Q&&(Q.destroy(),Q=null),$=null,Er=null,fr=!1}function Br(){if(!$)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:r}=$.info;return{description:r||"unknown",device:a||"unknown"}}function _r(){return fr}function M(){if(!Q)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Q}function m(...a){a.flat().forEach(r=>r.destroy())}function b(a,r="blas-input",e=!1){let i=M(),t=i.limits.maxStorageBufferBindingSize,o=a.byteLength;if(o>t)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${t} bytes.`);let u=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=i.createBuffer({label:r,size:o,usage:u,mappedAtCreation:!0}),l=a.constructor;return new l(n.getMappedRange()).set(a),n.unmap(),n}function D(a,r="blas-storage"){return M().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE})}function O(a,r="blas-result"){return M().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function E(a,r){let i=M().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(r,0,i,0,r.size),i}function I(a,r="blas-params"){let e=M(),i=a.length*4,t=Math.ceil(i/16)*16,o=new ArrayBuffer(t),u=new DataView(o);a.forEach(({value:l,type:s},c)=>{let d=c*4;if(s==="u32")u.setUint32(d,l,!0);else if(s==="i32")u.setInt32(d,l,!0);else if(s==="f32")u.setFloat32(d,l,!0);else throw new Error(`Unknown param type "${s}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,o),n}async function y(a,r=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let e=new r(a.getMappedRange().slice());return a.unmap(),e}finally{a.destroy()}}var ct=new ArrayBuffer(8),J=new DataView(ct),kr=new ArrayBuffer(4),Pr=new Uint32Array(kr),Sr=new Float32Array(kr);function dt(a){return Pr[0]=a>>>0,Sr[0]}function mt(a){return Sr[0]=a,Pr[0]}function pt(a,r,e,i){let t=r>>>3,o=r&7,u=i>>>29,n=e<<3|u,l=i&536870911,s=a<<31|t<<23|n,c=o>>>2&1,d=o&3,f=l>>>23,p=l&8388607,g=d<<6|f,w=(c<<31|g<<23|p)>>>0;return[dt(s),w]}function gt(a,r){let e=mt(a);r=r>>>0;let i=e>>>31,t=e>>>23&255,o=e&8388607,u=r>>>31,n=r>>>23&255,l=r&8388607,s=u<<2|n>>>6,c=(n&63)<<23|l,d=t<<3|s,f=o>>>3,g=((o&7)<<29|c)>>>0;return{sign:i,rawExp:d,mantissaHi:f,lo:g}}var wt=2040;function lr(a){J.setFloat64(0,a,!1);let r=J.getUint32(0,!1),e=J.getUint32(4,!1),i=r>>>31,t=r>>>20&2047,o=r&1048575;if(t>=wt)throw new RangeError(`packF64: |${a}| is too large to pack safely (must be finite with magnitude below ~1.4e306); main's bit pattern would itself be NaN/Infinity-shaped and get silently corrupted by any real float32 round-trip`);return pt(i,t,o,e)}function rr(a,r){let{sign:e,rawExp:i,mantissaHi:t,lo:o}=gt(a,r),u=(e<<31|i<<20|t)>>>0;return J.setUint32(0,u,!1),J.setUint32(4,o,!1),J.getFloat64(0,!1)}var h=class a{constructor(r,e,i=Float32Array,t=null){this._buf=r,this._auxBuf=t,this.length=e,this.dtype=i}static from(r){if(r instanceof Float64Array){let i=new Float32Array(r.length),t=new Uint32Array(r.length);for(let n=0;n<r.length;n++){let l=lr(r[n]);i[n]=l[0],t[n]=l[1]}let o=b(i,"gpu-vector-f64-main",!0),u=b(t,"gpu-vector-f64-aux",!0);return new a(o,r.length,Float64Array,u)}if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let e=b(r,"gpu-vector",!0);return new a(e,r.length,r.constructor)}async read(){let r=M(),e=r.createCommandEncoder(),i=E(e,this._buf);if(r.queue.submit([e.finish()]),!this._auxBuf)return y(i,this.dtype);let t=r.createCommandEncoder(),o=E(t,this._auxBuf);r.queue.submit([t.finish()]);let[u,n]=await Promise.all([y(i,Float32Array),y(o,Uint32Array)]),l=new Float64Array(this.length);for(let s=0;s<this.length;s++)l[s]=rr(u[s],n[s]);return l}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var R=class a{constructor(r,e,i,t,o=null){this._buf=r,this._auxBuf=o,this.rows=e,this.cols=i,this.lda=t}static from(r,e,i,t=i){if(!(r instanceof Float32Array)&&!(r instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(t)||t<i)throw new Error("lda must be an integer >= cols.");if(r.length<e*t)throw new Error("data does not have enough elements for the given rows and lda.");if(r instanceof Float64Array){let u=e*t,n=new Float32Array(u),l=new Uint32Array(u);for(let d=0;d<u;d++){let f=lr(r[d]);n[d]=f[0],l[d]=f[1]}let s=b(n,"gpu-matrix-f64-main",!0),c=b(l,"gpu-matrix-f64-aux",!0);return new a(s,e,i,t,c)}let o=b(r.subarray(0,e*t),"gpu-matrix",!0);return new a(o,e,i,t)}async read(){let r=M(),e=r.createCommandEncoder(),i=E(e,this._buf);if(r.queue.submit([e.finish()]),this._auxBuf){let u=r.createCommandEncoder(),n=E(u,this._auxBuf);r.queue.submit([u.finish()]);let[l,s]=await Promise.all([y(i,Float32Array),y(n,Uint32Array)]),c=new Float64Array(this.rows*this.lda);for(let f=0;f<c.length;f++)c[f]=rr(l[f],s[f]);if(this.lda===this.cols)return c;let d=new Float64Array(this.rows*this.cols);for(let f=0;f<this.rows;f++)d.set(c.subarray(f*this.lda,f*this.lda+this.cols),f*this.cols);return d}let t=await y(i,Float32Array);if(this.lda===this.cols)return t;let o=new Float32Array(this.rows*this.cols);for(let u=0;u<this.rows;u++)o.set(t.subarray(u*this.lda,u*this.lda+this.cols),u*this.cols);return o}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function Fr(a,r=-1,e=1){let i=new Float32Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function Lr(a,r=-1,e=1){let i=new Float64Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function A(a,r,e=0){let i=M(),t=r.map((o,u)=>({binding:e+u,resource:o instanceof GPUBuffer?{buffer:o}:o}));return i.createBindGroup({layout:a,entries:t})}var bt=new WeakMap;function P(a){M().queue.submit([a.finish()])}function cr(){let a=M(),{querySet:r,passDescriptor:e}=yr();return{commandEncoder:a.createCommandEncoder(),querySet:r,passDescriptor:e}}function ar(a,r,e,i,t){let o=a.beginComputePass(t);o.setPipeline(r),o.setBindGroup(0,e),typeof i=="number"?o.dispatchWorkgroups(i):o.dispatchWorkgroups(i.x,i.y),o.end(),bt.set(a,o)}function F(a,r,e){let{commandEncoder:i,querySet:t,passDescriptor:o}=cr();ar(i,a,r,e,o);let u=ur(i,t);return{commandEncoder:i,ts:u}}var zt={},dr=new WeakMap;async function B(a,r,e="main"){dr.has(a)||dr.set(a,new Map);let i=dr.get(a),t=Array.isArray(r)?r:[r],o=`${t.join("+")}::${e}`;return i.has(o)||i.set(o,await Ot(t,e)),i.get(o)}async function Ct(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(ke(),Be)),e=r[a];if(!e)throw new Error(`Shader "${a}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:i,join:t}=await import("path"),o=i(e(zt.url));return r(t(o,`../shaders/${a}.wgsl`),"utf8")}}async function Ot(a,r="main"){let e=M(),i=a.join("+"),t=(await Promise.all(a.map(Ct))).join(`
`),o=e.createShaderModule({label:i,code:t}),n=(await o.getCompilationInfo()).messages.filter(c=>c.type==="error");if(n.length>0)throw new Error(`Shader "${i}" compilation failed:
${n.map(c=>`  line ${c.lineNum}: ${c.message}`).join(`
`)}`);let l=r==="main"?{module:o}:{module:o,entryPoint:r},s=e.createComputePipeline({label:i,layout:"auto",compute:l});return s._shaderModule=o,s}var Qt=64,Pe=8;function C(a,r){let e=M().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(a/Qt),e):{x:Math.min(Math.ceil(r/Pe),e),y:Math.min(Math.ceil(a/Pe),e)}}async function Se(a,r,e,i,t){let o=i instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return o?{}:i;if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let u=await B(a,"sscal"),n=null,l=null,s=null;try{n=o?i._buf:b(i,"sscal-x",!0),l=I([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"}],"sscal-params");let c=A(u.getBindGroupLayout(0),[n,l]),{commandEncoder:d,ts:f}=F(u,c,C(r));s=o?null:E(d,n),P(d);let p=await k(f);if(o)return p!==void 0?{gpuTimeMs:p}:{};let g=await y(s,Float32Array);return s=null,p!==void 0?{x:g,gpuTimeMs:p}:g}finally{!o&&n&&m(n),l&&m(l),s&&m(s)}}async function Fe(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof h))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"sswap"),s=null,c=null,d=null,f=null,p=null;try{s=u?e._buf:b(e,"sswap-x",!0),c=n?t._buf:b(t,"sswap-y",!0),d=I([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let g=A(l.getBindGroupLayout(0),[s,c,d]),{commandEncoder:w,ts:_}=F(l,g,C(r));f=u?null:E(w,s),p=n?null:E(w,c),P(w);let x=await k(_);if(u&&n)return x!==void 0?{gpuTimeMs:x}:{};let G=await y(f,Float32Array);f=null;let v=await y(p,Float32Array);return p=null,x!==void 0?{x:G,y:v,gpuTimeMs:x}:{x:G,y:v}}finally{!u&&s&&m(s),!n&&c&&m(c),d&&m(d),f&&m(f),p&&m(p)}}async function Le(a,r,e,i,t,o,u){let n=i instanceof h,l=o instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t)||!Number.isInteger(u))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0||u<=0)throw new Error("incx and incy must be positive.");if(!n&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{y:o};if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await B(a,"saxpy"),c=null,d=null,f=null,p=null;try{c=n?i._buf:b(i,"saxpy-x",!1),d=l?o._buf:b(o,"saxpy-y",!0),f=I([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"},{value:u,type:"u32"}],"saxpy-params");let g=A(s.getBindGroupLayout(0),[c,d,f]),{commandEncoder:w,ts:_}=F(s,g,C(r));p=l?null:E(w,d),P(w);let x=await k(_);if(l&&n)return x!==void 0?{gpuTimeMs:x}:{};let G=await y(p,Float32Array);return p=null,x!==void 0?{y:G,gpuTimeMs:x}:{y:G}}finally{!n&&c&&m(c),!l&&d&&m(d),f&&m(f),p&&m(p)}}async function Ie(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"scopy"),s=null,c=null,d=null,f=null;try{s=u?e._buf:b(e,"scopy-x",!1),c=n?t._buf:b(t,"scopy-y",!0),d=I([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let p=A(l.getBindGroupLayout(0),[s,c,d]),{commandEncoder:g,ts:w}=F(l,p,C(r));f=n?null:E(g,c),P(g);let _=await k(w);if(n&&u)return _!==void 0?{gpuTimeMs:_}:{};let x=await y(f,Float32Array);return f=null,_!==void 0?{y:x,gpuTimeMs:_}:{y:x}}finally{!u&&s&&m(s),!n&&c&&m(c),d&&m(d),f&&m(f)}}var Ne=64;async function We(a,r,e,i,t,o){let u=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await B(a,"sdot"),s=await B(a,"reduction/sum"),c=null,d=null,f=null,p=null,g=null,w=null;try{c=u?e._buf:b(e,"sdot-x",!1),d=n?t._buf:b(t,"sdot-y",!1),f=D(2*Ne*4,"sdot-partials"),p=O(4,"sdot-result"),g=I([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let _=A(l.getBindGroupLayout(0),[c,d,f,g]),{commandEncoder:x,ts:G}=F(l,_,2*Ne);P(x);let v=A(s.getBindGroupLayout(0),[f,p]),{commandEncoder:S,ts:L}=F(s,v,1);w=E(S,p),P(S);let W=y(w,Float32Array);w=null;let[N,U,T]=await Promise.all([k(G),k(L),W]);return N!==void 0&&U!==void 0?{dot:T[0],gpuTimeMs:N+U}:{dot:T[0]}}finally{!u&&c&&m(c),!n&&d&&m(d),f&&m(f),p&&m(p),g&&m(g),w&&m(w)}}var je=64;async function Me(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"sasum"),u=await B(a,"reduction/sum"),n=null,l=null,s=null,c=null,d=null;try{n=t?e._buf:b(e,"sasum-x",!1),l=D(2*je*4,"sasum-partials"),s=O(4,"sasum-result"),c=I([{value:r,type:"u32"},{value:i,type:"u32"}],"sasum-params");let f=A(o.getBindGroupLayout(0),[n,l,c]),{commandEncoder:p,ts:g}=F(o,f,2*je);P(p);let w=A(u.getBindGroupLayout(0),[l,s]),{commandEncoder:_,ts:x}=F(u,w,1);d=E(_,s),P(_);let G=y(d,Float32Array);d=null;let[v,S,L]=await Promise.all([k(g),k(x),G]);return v!==void 0&&S!==void 0?{asum:L[0],gpuTimeMs:v+S}:{asum:L[0]}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),c&&m(c),d&&m(d)}}var mr=64;async function Ue(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,["f64add","dasum"]),u=await B(a,["f64add","reduction/sumF64"]),n=null,l=null,s=null,c=null,d=null,f=null,p=null,g=null;try{n=t?e:h.from(e),l=D(2*mr*4,"dasum-partialsMain"),s=D(2*mr*4,"dasum-partialsAux"),c=O(4,"dasum-result-main"),d=O(4,"dasum-result-aux"),f=I([{value:r,type:"u32"},{value:i,type:"u32"}],"dasum-params");let w=A(o.getBindGroupLayout(0),[n._buf,n._auxBuf,l,s,f]),{commandEncoder:_,ts:x}=F(o,w,2*mr);P(_);let G=A(u.getBindGroupLayout(0),[l,s,c,d]),{commandEncoder:v,ts:S}=F(u,G,1);p=E(v,c),g=E(v,d),P(v);let L=y(p,Float32Array),W=y(g,Uint32Array);p=null,g=null;let[N,U,T,V]=await Promise.all([k(x),k(S),L,W]),H=rr(T[0],V[0]);return N!==void 0&&U!==void 0?{asum:H,gpuTimeMs:N+U}:{asum:H}}finally{!t&&n&&n.destroy(),l&&m(l),s&&m(s),c&&m(c),d&&m(d),f&&m(f),p&&m(p),g&&m(g)}}var Te=64;async function Re(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"snrm2"),u=await B(a,"reduction/sum"),n=null,l=null,s=null,c=null,d=null;try{n=t?e._buf:b(e,"snrm2-x",!1),l=D(2*Te*4,"snrm2-partials"),s=O(4,"snrm2-result"),c=I([{value:r,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let f=A(o.getBindGroupLayout(0),[n,l,c]),{commandEncoder:p,ts:g}=F(o,f,2*Te);P(p);let w=A(u.getBindGroupLayout(0),[l,s]),{commandEncoder:_,ts:x}=F(u,w,1);d=E(_,s),P(_);let G=y(d,Float32Array);d=null;let[v,S,L]=await Promise.all([k(g),k(x),G]),W=Math.sqrt(L[0]);return v!==void 0&&S!==void 0?{nrm2:W,gpuTimeMs:v+S}:{nrm2:W}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),c&&m(c),d&&m(d)}}var pr=64;async function Ve(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await B(a,"isamax"),u=await B(a,"reduction/argmax"),n=null,l=null,s=null,c=null,d=null,f=null;try{n=t?e._buf:b(e,"isamax-x",!1),l=D(2*pr*4,"isamax-partials-val"),s=D(2*pr*4,"isamax-partials-idx"),c=O(4,"isamax-result"),d=I([{value:r,type:"u32"},{value:i,type:"u32"}],"isamax-params");let p=A(o.getBindGroupLayout(0),[n,l,s,d]),{commandEncoder:g,ts:w}=F(o,p,2*pr);P(g);let _=A(u.getBindGroupLayout(0),[l,s,c]),{commandEncoder:x,ts:G}=F(u,_,1);f=E(x,c),P(x);let v=y(f,Uint32Array);f=null;let[S,L,W]=await Promise.all([k(w),k(G),v]),N=W[0];return S!==void 0&&L!==void 0?{index:N,gpuTimeMs:S+L}:{index:N}}finally{!t&&n&&m(n),l&&m(l),s&&m(s),c&&m(c),d&&m(d),f&&m(f)}}async function He(a,r,e,i,t,o,u,n){let l=e instanceof h,s=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof u!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(u)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(u))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!l&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let c=await B(a,"srot"),d=null,f=null,p=null,g=null,w=null;try{d=l?e._buf:b(e,"srot-x",!0),f=s?t._buf:b(t,"srot-y",!0),p=I([{value:r,type:"u32"},{value:u,type:"f32"},{value:n,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let _=A(c.getBindGroupLayout(0),[d,f,p]),{commandEncoder:x,ts:G}=F(c,_,C(r));g=l?null:E(x,d),w=s?null:E(x,f),P(x);let v=await k(G);if(l&&s)return v!==void 0?{gpuTimeMs:v}:{};let S=y(g,Float32Array),L=y(w,Float32Array);g=null,w=null;let[W,N]=await Promise.all([S,L]);return v!==void 0?{x:W,y:N,gpuTimeMs:v}:{x:W,y:N}}finally{!l&&d&&m(d),!s&&f&&m(f),p&&m(p),g&&m(g),w&&m(w)}}async function De(a,r,e,i,t,o,u){let n=e instanceof h,l=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(u instanceof Float32Array)||u.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||u[0]===-2)return n?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await B(a,"srotm"),c=null,d=null,f=null,p=null,g=null,w=null;try{c=n?e._buf:b(e,"srotm-x",!0),d=l?t._buf:b(t,"srotm-y",!0),f=b(u,"srotm-param",!1),p=I([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let _=A(s.getBindGroupLayout(0),[c,d,f,p]),{commandEncoder:x,ts:G}=F(s,_,C(r));g=n?null:E(x,c),w=l?null:E(x,d),P(x);let v=await k(G);if(n&&l)return v!==void 0?{gpuTimeMs:v}:{};let S=y(g,Float32Array),L=y(w,Float32Array);g=null,w=null;let[W,N]=await Promise.all([S,L]);return v!==void 0?{x:W,y:N,gpuTimeMs:v}:{x:W,y:N}}finally{!n&&c&&m(c),!l&&d&&m(d),f&&m(f),p&&m(p),g&&m(g),w&&m(w)}}async function Ce(a,r,e,i,t,o,u,n,l,s,c,d){let f=n instanceof h,p=c instanceof h,g=o instanceof R,w=r==="no-transpose";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!w&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(d)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof s!="number")throw new Error("beta must be a number.");if(Number.isNaN(s))throw new Error("beta must not be NaN.");if(!Number.isFinite(s))throw new Error("beta must be finite.");if(l<=0||d<=0)throw new Error("incx and incy must be positive.");if(u<i)throw new Error("lda must be >= n.");if(!g&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(c instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&n._buf===c._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(o.rows<e||o.cols<i))throw new Error("A is too small for the given m and n.");if(e<0||i<0)throw new Error("m and n must be non-negative.");if(e===0||i===0)return p?{}:{y:c};let _=w?i:e,x=w?e:i;if(!g&&o.length<(e-1)*u+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(_-1)*l+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(c.length<(x-1)*d+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let v=await B(a,w?"sgemv_n":"sgemv_t"),S=g?o._buf:b(o,"sgemv-A",!1),L=f?n._buf:b(n,"sgemv-x",!1),W=p?c._buf:b(c,"sgemv-y",!0),N=I([{value:e,type:"u32"},{value:i,type:"u32"},{value:t,type:"f32"},{value:s,type:"f32"},{value:l,type:"u32"},{value:d,type:"u32"},{value:u,type:"u32"}],"sgemv-params");try{let U=A(v.getBindGroupLayout(0),[S,L,W,N]),T=w?Math.min(e,a.limits.maxComputeWorkgroupsPerDimension):C(x),{commandEncoder:V,ts:H}=F(v,U,T),z=p?null:E(V,W);P(V);let Y=await k(H);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let Z=await y(z,Float32Array);return Y!==void 0?{y:Z,gpuTimeMs:Y}:{y:Z}}finally{g||m(S),f||m(L),p||m(W),m(N)}}async function Oe(a,r,e,i,t,o,u,n,l,s,c){let d=u instanceof h,f=s instanceof h,p=t instanceof R,g=r==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(c)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(n<=0||c<=0)throw new Error("incx and incy must be positive.");if(o<e)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&u._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&o!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<e||t.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return f?{}:{y:s};if(!p&&t.length<(e-1)*o+e)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(e-1)*c+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await B(a,"ssymv"),_=null,x=null,G=null,v=null;try{_=p?t._buf:b(t,"ssymv-A",!1),x=d?u._buf:b(u,"ssymv-x",!1),G=f?s._buf:b(s,"ssymv-y",!0),v=I([{value:e,type:"u32"},{value:i,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:c,type:"u32"},{value:o,type:"u32"},{value:g?0:1,type:"u32"}],"ssymv-params");let S=A(w.getBindGroupLayout(0),[_,x,G,v]),L=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:W,ts:N}=F(w,S,L),U=f?null:E(W,G);P(W);let T=await k(N);if(f)return T!==void 0?{gpuTimeMs:T}:{};let V=await y(U,Float32Array);return T!==void 0?{y:V,gpuTimeMs:T}:{y:V}}finally{!p&&_&&m(_),!d&&x&&m(x),!f&&G&&m(G),v&&m(v)}}async function ze(a,r,e,i,t,o,u,n,l,s,c){let d=n instanceof h,f=s instanceof h,p=o instanceof R,g=r==="lower",w=e==="no-transpose",_=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!w&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!_&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(c)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(l<=0||c<=0)throw new Error("incx and incy must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!p&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&n._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&f&&o._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{y:s};if(!p&&o.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*c+1)throw new Error("y does not have enough elements for the given n and incy.");let x=await B(a,"strmv"),G=null,v=null,S=null,L=null;try{G=p?o._buf:b(o,"strmv-A",!1),v=d?n._buf:b(n,"strmv-x",!1),S=f?s._buf:b(s,"strmv-y",!0),L=I([{value:t,type:"u32"},{value:l,type:"u32"},{value:c,type:"u32"},{value:u,type:"u32"},{value:w?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:_?1:0,type:"u32"}],"strmv-params");let W=A(x.getBindGroupLayout(0),[G,v,S,L]),N=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:U,ts:T}=F(x,W,N),V=f?null:E(U,S);P(U);let H=await k(T);if(f)return H!==void 0?{gpuTimeMs:H}:{};let z=await y(V,Float32Array);return H!==void 0?{y:z,gpuTimeMs:H}:{y:z}}finally{!p&&G&&m(G),!d&&v&&m(v),!f&&S&&m(S),L&&m(L)}}var q=64;function Qe(a,r,e){let i=new ArrayBuffer(a*r),t=new DataView(i);for(let o=0;o<a;o++){let u=e(o),n=o*r;u.forEach((l,s)=>t.setUint32(n+s*4,l,!0))}return i}function qe(a,r,e){let i=a.createBuffer({label:e,size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(i,0,r),i}async function Ze(a,r,e,i,t,o,u,n,l){let s=n instanceof h,c=o instanceof R,d=r==="lower",f=e==="no-transpose",p=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!d&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!f&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, and lda must be integers.");if(l<=0)throw new Error("incx must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!c&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!s&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(s&&!c)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(c&&u!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return s?{}:{x:n};if(!c&&o.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");let g=await B(a,"strsv_invert_block"),w=await B(a,"strsv_apply_inverse"),_=await B(a,"strsv_update"),x=f===d,G=[];for(let z=0;z<t;z+=q)G.push(z);x||G.reverse();let v=G.length,S=a.limits.maxComputeWorkgroupsPerDimension,L=a.limits.minUniformBufferOffsetAlignment,W=null,N=null,U=null,T=null,V=null,H=null;try{W=c?o._buf:b(o,"strsv-A",!1),N=s?n._buf:b(n,"strsv-x",!0),U=D(v*q*q*4,"strsv-Ainv");let z=Qe(v,L,K=>{let X=K*q,tr=Math.min(X+q,t);return[l,K,X,tr]});T=qe(a,z,"strsv-apply-params");let Y=Qe(v,L,K=>{let X=K*q,tr=Math.min(X+q,t);return[t,l,u,f?0:1,d?0:1,X,tr]});V=qe(a,Y,"strsv-update-params");let{commandEncoder:Z,querySet:er}=cr();H=I([{value:t,type:"u32"},{value:u,type:"u32"},{value:f?0:1,type:"u32"},{value:d?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let $e=A(g.getBindGroupLayout(0),[W,U,H]);ar(Z,g,$e,{x:q,y:v},er?{timestampWrites:{querySet:er,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<G.length;K++){let X=G[K],tr=Math.min(X+q,t),rt=X/q,et=K===G.length-1,wr=rt*L,tt=A(w.getBindGroupLayout(0),[U,N,{buffer:T,offset:wr,size:16}]);ar(Z,w,tt,1,et&&er?{timestampWrites:{querySet:er,endOfPassWriteIndex:1}}:void 0);let br=x?t-tr:X;if(br===0)continue;let at=A(_.getBindGroupLayout(0),[W,N,{buffer:V,offset:wr,size:32}]),it=Math.min(br,S);ar(Z,_,at,it)}let Ye=ur(Z,er),Je=s?null:E(Z,N);P(Z);let ir=await k(Ye);if(s)return ir!==void 0?{gpuTimeMs:ir}:{};let gr=await y(Je,Float32Array);return ir!==void 0?{x:gr,gpuTimeMs:ir}:{x:gr}}finally{!c&&W&&m(W),!s&&N&&m(N),U&&m(U),T&&m(T),V&&m(V),H&&m(H)}}async function Ke(a,r,e,i,t,o,u,n,l,s){let c=t instanceof h,d=u instanceof h,f=l instanceof R;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(o<=0||n<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!f&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&c&&l._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&d&&l._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&s!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(l.rows<r||l.cols<e))throw new Error("A is too small for the given m and n.");if(r<0||e<0)throw new Error("m and n must be non-negative.");if(r===0||e===0)return f?{}:{A:l};if(!f&&l.length<(r-1)*s+e)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given m and incx.");if(u.length<(e-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let p=await B(a,"sger"),g=null,w=null,_=null,x=null;try{g=c?t._buf:b(t,"sger-x",!1),w=d?u._buf:b(u,"sger-y",!1),_=f?l._buf:b(l,"sger-A",!0),x=I([{value:r,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:o,type:"u32"},{value:n,type:"u32"},{value:s,type:"u32"}],"sger-params");let G=A(p.getBindGroupLayout(0),[g,w,_,x]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:S,ts:L}=F(p,G,v),W=f?null:E(S,_);P(S);let N=await k(L);if(f)return N!==void 0?{gpuTimeMs:N}:{};let U=await y(W,Float32Array);return N!==void 0?{A:U,gpuTimeMs:N}:{A:U}}finally{!c&&g&&m(g),!d&&w&&m(w),!f&&_&&m(_),x&&m(x)}}async function Xe(a,r,e,i,t,o,u,n){let l=t instanceof h,s=u instanceof R,c=r==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!c&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(n))throw new Error("n, incx, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(n<e)throw new Error("lda must be >= n.");if(!s&&!(u instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!s)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(s&&l&&u._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(s&&n!==u.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(s&&(u.rows<e||u.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return s?{}:{A:u};if(!s&&u.length<(e-1)*n+e)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let d=await B(a,"ssyr"),f=null,p=null,g=null;try{f=l?t._buf:b(t,"ssyr-x",!1),p=s?u._buf:b(u,"ssyr-A",!0),g=I([{value:e,type:"u32"},{value:i,type:"f32"},{value:o,type:"u32"},{value:n,type:"u32"},{value:c?0:1,type:"u32"}],"ssyr-params");let w=A(d.getBindGroupLayout(0),[f,p,g]),_=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:x,ts:G}=F(d,w,_),v=s?null:E(x,p);P(x);let S=await k(G);if(s)return S!==void 0?{gpuTimeMs:S}:{};let L=await y(v,Float32Array);return S!==void 0?{A:L,gpuTimeMs:S}:{A:L}}finally{!l&&f&&m(f),!s&&p&&m(p),g&&m(g)}}return ft(qt);})();
