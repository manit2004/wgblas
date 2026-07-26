var wgblas=(()=>{var ke=Object.create;var Z=Object.defineProperty;var Fe=Object.getOwnPropertyDescriptor;var Se=Object.getOwnPropertyNames;var je=Object.getPrototypeOf,Ne=Object.prototype.hasOwnProperty;var K=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var M=(a,r,e)=>()=>{if(e)throw e[0];try{return a&&(r=a(a=0)),r}catch(i){throw e=[i],i}};var nr=(a,r)=>{for(var e in r)Z(a,e,{get:r[e],enumerable:!0})},sr=(a,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of Se(r))!Ne.call(a,t)&&t!==e&&Z(a,t,{get:()=>r[t],enumerable:!(i=Fe(r,t))||i.enumerable});return a};var J=(a,r,e)=>(e=a!=null?ke(je(a)):{},sr(r||!a||!a.__esModule?Z(e,"default",{value:a,enumerable:!0}):e,a)),Ie=a=>sr(Z({},"__esModule",{value:!0}),a);var _r,yr=M(()=>{_r=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Ar,Er=M(()=>{Ar=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Br,Gr=M(()=>{Br=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
// using computeSum instead of plain f32 \`+\` (see reduction/sum.wgsl for the
// f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsMain/partialsAux must have
// exactly 2*WGS entries each.
//
// Concatenated after f64add.wgsl by getPipeline (WGSL has no #include),
// reusing its decode/encode/computeSum and Packed struct \u2014 bindings here
// start at 4 (f64add.wgsl already has 0-3) and the entry point is
// \`reduce_f64\` (f64add.wgsl already has \`fn main\`).
//
// partialsAux/result's aux slot are array<u32>, not array<f32> \u2014 aux's bits
// must never pass through an f32-typed storage slot (NaN-bit-pattern
// corruption risk, see f64pack.mjs and f64add.wgsl's binding comment).

@group(0) @binding(4) var<storage, read>       partialsMain: array<f32>;
@group(0) @binding(5) var<storage, read>       partialsAux:  array<u32>;
@group(0) @binding(6) var<storage, read_write> resultMain:   array<f32, 1>;
@group(0) @binding(7) var<storage, read_write> resultAux:    array<u32, 1>;

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
`});var kr,Pr=M(()=>{kr=`// sscal: x = alpha * x

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
`});var Sr,Fr=M(()=>{Sr=`// sswap: x <-> y

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
`});var Nr,jr=M(()=>{Nr=`// saxpy: y = alpha * x + y

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
`});var Lr,Ir=M(()=>{Lr=`// scopy: y = x

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
`});var Mr,Wr=M(()=>{Mr=`// sdot: result = sum(x[i] * y[i])
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
`});var Tr,Ur=M(()=>{Tr=`// sasum: result = sum(|x[i]|)
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
`});var Hr,Vr=M(()=>{Hr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Dr,Rr=M(()=>{Dr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Or,Cr=M(()=>{Or=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Qr,zr=M(()=>{Qr=`// isamax: returns index of element with largest absolute value
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
`});var Xr,qr=M(()=>{Xr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Yr,$r=M(()=>{Yr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Kr,Zr=M(()=>{Kr=`// ssymv: y = alpha * A * x + beta * y
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
`});var re,Jr=M(()=>{re=`// strmv: y = op(A) * x
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
`});var te,ee=M(()=>{te=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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

// mainInput/mainOutput hold real f32 values; auxInput/auxOutput hold raw u32
// bits and must NEVER be declared as array<f32> \u2014 aux's bit pattern can land
// on a NaN/Infinity exponent for perfectly ordinary doubles (not just unusual
// inputs \u2014 see f64pack.mjs's comment above fieldsToPacked), and an f32-typed
// storage slot canonicalizes (quiets) a NaN bit pattern on any round trip,
// silently corrupting it. aux is only ever bitcast, never used as a float.
@group(0) @binding(0) var<storage, read>       mainInput:  array<f32, 2>; // [mainA, mainB]
@group(0) @binding(1) var<storage, read>       auxInput:   array<u32, 2>; // [auxA, auxB]
@group(0) @binding(2) var<storage, read_write> mainOutput: array<f32, 1>; // [mainSum]
@group(0) @binding(3) var<storage, read_write> auxOutput:  array<u32, 1>; // [auxSum]

const EXP_ALL_ONES: u32 = 0x7ffu;
const BIAS: i32 = 1023;
const QUIET_NAN_MANTISSA_HI: u32 = 1u << 19u; // bit51 of the 52-bit mantissa -> canonical quiet NaN

struct Fields {
  sign: u32,
  rawExp: u32,
  mantissaHi: u32, // 20 bits
  lo: u32,         // 32 bits
}

// A packed [main, aux] result \u2014 aux stays a raw u32 (see binding comment above).
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

@compute @workgroup_size(1)
fn main() {
  let a = decode(bitcast<u32>(mainInput[0]), auxInput[0]);
  let b = decode(bitcast<u32>(mainInput[1]), auxInput[1]);
  let result = computeSum(a, b);
  mainOutput[0] = result.main;
  auxOutput[0] = result.aux;
}
`});var ie,ae=M(()=>{ie=`// dasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sumF64.wgsl.
// Same structure as sasum.wgsl \u2014 every value is now a [main, aux] pair
// (see src/util/f64pack.mjs) and every \`+\`/\`+=\` is computeSum via addPair
// instead of plain f32 addition. Concatenated after f64add.wgsl by
// getPipeline (WGSL has no #include), reusing its decode/encode/computeSum/
// addFields and Packed struct \u2014 so bindings here start at 4 (f64add.wgsl
// already has 0-3) and the entry point is \`dasum_main\` (f64add.wgsl already
// has \`fn main\`).
//
// xAux/partialsAux are array<u32>, not array<f32> \u2014 aux's bits must never
// pass through an f32-typed storage slot (NaN-bit-pattern corruption risk,
// see f64pack.mjs and f64add.wgsl's binding comment); Packed (from
// f64add.wgsl) keeps aux as u32 in registers/workgroup memory too.
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

@group(0) @binding(4) var<storage, read>       xMain:        array<f32>;
@group(0) @binding(5) var<storage, read>       xAux:         array<u32>;
@group(0) @binding(6) var<storage, read_write> partialsMain: array<f32>;
@group(0) @binding(7) var<storage, read_write> partialsAux:  array<u32>;
@group(0) @binding(8) var<uniform>             params:       Params;

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
`});var ne,oe=M(()=>{ne=`// strsv: solve op(A) * x = b for x, in place (x holds b on input, the
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
`});var se={};nr(se,{shaderSources:()=>nt});var nt,ue=M(()=>{yr();Er();Gr();Pr();Fr();jr();Ir();Wr();Ur();Vr();Rr();Cr();zr();qr();$r();Zr();Jr();ee();ae();oe();nt={"reduction/argmax":_r,"reduction/sum":Ar,"reduction/sumF64":Br,sscal:kr,sswap:Sr,saxpy:Nr,scopy:Lr,sdot:Mr,sasum:Tr,snrm2:Hr,srot:Dr,srotm:Or,isamax:Qr,sgemv_n:Xr,sgemv_t:Yr,ssymv:Kr,strmv:re,f64add:te,dasum:ie,strsv:ne}});var ct={};nr(ct,{GpuMatrix:()=>R,GpuVector:()=>h,cleanup:()=>pr,dasum:()=>be,gpuName:()=>gr,init:()=>mr,isamax:()=>ye,randomFloat32Array:()=>hr,randomFloat64Array:()=>vr,sasum:()=>xe,saxpy:()=>de,scopy:()=>me,sdot:()=>ge,sgemv:()=>Ae,snrm2:()=>ve,srot:()=>_e,srotm:()=>Ee,sscal:()=>fe,sswap:()=>ce,ssymv:()=>Ge,strmv:()=>Be,strsv:()=>Pe});function ur(a,r){return r?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function lr(){if(!cr())return{querySet:null,passDescriptor:void 0};let r=W().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function fr(a,r){if(!r)return null;let e=W(),i=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(r,0,2,i,0);let t=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(i,0,t,0,16),{tsReadBuffer:t,resolveBuffer:i,querySet:r}}async function A(a){if(!a)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:i}=a;await r.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),i.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var C=null,Q=null,dr=null,er=!1;async function mr({powerPreference:a="high-performance",benchmark:r=!1}={}){if(C)return C;let e;if(typeof window>"u"){let{create:o,globals:s}=await import("webgpu");Object.assign(globalThis,s),e=o([]),dr=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(Q=await e.requestAdapter({powerPreference:a})??await e.requestAdapter(),!Q)throw new Error("No WebGPU adapter found.");er=r;let t=[...ur(Q,r).requiredFeatures??[]];return C=await Q.requestDevice({requiredFeatures:t}),C.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),C}function pr(){C&&(C.destroy(),C=null),Q=null,dr=null,er=!1}function gr(){if(!Q)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:r}=Q.info;return{description:r||"unknown",device:a||"unknown"}}function cr(){return er}function W(){if(!C)throw new Error("WebGPU device not initialized \u2014 call init() first.");return C}function m(...a){a.flat().forEach(r=>r.destroy())}function x(a,r="blas-input",e=!1){let i=W(),t=i.limits.maxStorageBufferBindingSize,o=a.byteLength;if(o>t)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${t} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=i.createBuffer({label:r,size:o,usage:s,mappedAtCreation:!0}),l=a.constructor;return new l(n.getMappedRange()).set(a),n.unmap(),n}function H(a,r="blas-storage"){return W().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE})}function D(a,r="blas-result"){return W().createBuffer({label:r,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function E(a,r){let i=W().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(r,0,i,0,r.size),i}function j(a,r="blas-params"){let e=W(),i=a.length*4,t=Math.ceil(i/16)*16,o=new ArrayBuffer(t),s=new DataView(o);a.forEach(({value:l,type:u},f)=>{let c=f*4;if(u==="u32")s.setUint32(c,l,!0);else if(u==="i32")s.setInt32(c,l,!0);else if(u==="f32")s.setFloat32(c,l,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,o),n}async function y(a,r=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let e=new r(a.getMappedRange().slice());return a.unmap(),e}finally{a.destroy()}}var Le=new ArrayBuffer(8),q=new DataView(Le),wr=new ArrayBuffer(4),xr=new Uint32Array(wr),br=new Float32Array(wr);function We(a){return xr[0]=a>>>0,br[0]}function Me(a){return br[0]=a,xr[0]}function Ue(a,r,e,i){let t=r>>>3,o=r&7,s=i>>>29,n=e<<3|s,l=i&536870911,u=a<<31|t<<23|n,f=o>>>2&1,c=o&3,d=l>>>23,p=l&8388607,g=c<<6|d,w=(f<<31|g<<23|p)>>>0;return[We(u),w]}function Te(a,r){let e=Me(a);r=r>>>0;let i=e>>>31,t=e>>>23&255,o=e&8388607,s=r>>>31,n=r>>>23&255,l=r&8388607,u=s<<2|n>>>6,f=(n&63)<<23|l,c=t<<3|u,d=o>>>3,g=((o&7)<<29|f)>>>0;return{sign:i,rawExp:c,mantissaHi:d,lo:g}}function rr(a){q.setFloat64(0,a,!1);let r=q.getUint32(0,!1),e=q.getUint32(4,!1),i=r>>>31,t=r>>>20&2047,o=r&1048575;return Ue(i,t,o,e)}function X(a,r){let{sign:e,rawExp:i,mantissaHi:t,lo:o}=Te(a,r),s=(e<<31|i<<20|t)>>>0;return q.setUint32(0,s,!1),q.setUint32(4,o,!1),q.getFloat64(0,!1)}var h=class a{constructor(r,e,i=Float32Array,t=null){this._buf=r,this._auxBuf=t,this.length=e,this.dtype=i}static from(r){if(r instanceof Float64Array){let i=new Float32Array(r.length),t=new Uint32Array(r.length);for(let n=0;n<r.length;n++){let l=rr(r[n]);i[n]=l[0],t[n]=l[1]}let o=x(i,"gpu-vector-f64-main",!0),s=x(t,"gpu-vector-f64-aux",!0);return new a(o,r.length,Float64Array,s)}if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let e=x(r,"gpu-vector",!0);return new a(e,r.length,r.constructor)}async read(){let r=W(),e=r.createCommandEncoder(),i=E(e,this._buf);if(r.queue.submit([e.finish()]),!this._auxBuf)return y(i,this.dtype);let t=r.createCommandEncoder(),o=E(t,this._auxBuf);r.queue.submit([t.finish()]);let[s,n]=await Promise.all([y(i,Float32Array),y(o,Uint32Array)]),l=new Float64Array(this.length);for(let u=0;u<this.length;u++)l[u]=X(s[u],n[u]);return l}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var R=class a{constructor(r,e,i,t,o=null){this._buf=r,this._auxBuf=o,this.rows=e,this.cols=i,this.lda=t}static from(r,e,i,t=i){if(!(r instanceof Float32Array)&&!(r instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(t)||t<i)throw new Error("lda must be an integer >= cols.");if(r.length<e*t)throw new Error("data does not have enough elements for the given rows and lda.");if(r instanceof Float64Array){let s=e*t,n=new Float32Array(s),l=new Uint32Array(s);for(let c=0;c<s;c++){let d=rr(r[c]);n[c]=d[0],l[c]=d[1]}let u=x(n,"gpu-matrix-f64-main",!0),f=x(l,"gpu-matrix-f64-aux",!0);return new a(u,e,i,t,f)}let o=x(r.subarray(0,e*t),"gpu-matrix",!0);return new a(o,e,i,t)}async read(){let r=W(),e=r.createCommandEncoder(),i=E(e,this._buf);if(r.queue.submit([e.finish()]),this._auxBuf){let s=r.createCommandEncoder(),n=E(s,this._auxBuf);r.queue.submit([s.finish()]);let[l,u]=await Promise.all([y(i,Float32Array),y(n,Uint32Array)]),f=new Float64Array(this.rows*this.lda);for(let d=0;d<f.length;d++)f[d]=X(l[d],u[d]);if(this.lda===this.cols)return f;let c=new Float64Array(this.rows*this.cols);for(let d=0;d<this.rows;d++)c.set(f.subarray(d*this.lda,d*this.lda+this.cols),d*this.cols);return c}let t=await y(i,Float32Array);if(this.lda===this.cols)return t;let o=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)o.set(t.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return o}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function hr(a,r=-1,e=1){let i=new Float32Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function vr(a,r=-1,e=1){let i=new Float64Array(a);for(let t=0;t<a;t++)i[t]=r+Math.random()*(e-r);return i}function G(a,r,e=0){let i=W(),t=r.map((o,s)=>({binding:e+s,resource:{buffer:o}}));return i.createBindGroup({layout:a,entries:t})}var Ve=new WeakMap;function B(a){W().queue.submit([a.finish()])}function P(a,r,e){let i=W(),{querySet:t,passDescriptor:o}=lr(),s=i.createCommandEncoder(),n=s.beginComputePass(o);n.setPipeline(a),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let l=fr(s,t);return Ve.set(s,n),{commandEncoder:s,ts:l}}var lt={},tr=new WeakMap;async function k(a,r,e="main"){tr.has(a)||tr.set(a,new Map);let i=tr.get(a),t=Array.isArray(r)?r:[r],o=`${t.join("+")}::${e}`;return i.has(o)||i.set(o,await ut(t,e)),i.get(o)}async function st(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(ue(),se)),e=r[a];if(!e)throw new Error(`Shader "${a}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:i,join:t}=await import("path"),o=i(e(lt.url));return r(t(o,`../shaders/${a}.wgsl`),"utf8")}}async function ut(a,r="main"){let e=W(),i=a.join("+"),t=(await Promise.all(a.map(st))).join(`
`),o=e.createShaderModule({label:i,code:t}),n=(await o.getCompilationInfo()).messages.filter(f=>f.type==="error");if(n.length>0)throw new Error(`Shader "${i}" compilation failed:
${n.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let l=r==="main"?{module:o}:{module:o,entryPoint:r},u=e.createComputePipeline({label:i,layout:"auto",compute:l});return u._shaderModule=o,u}var ft=64,le=8;function U(a,r){let e=W().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(a/ft),e):{x:Math.min(Math.ceil(r/le),e),y:Math.min(Math.ceil(a/le),e)}}async function fe(a,r,e,i,t){let o=i instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return o?{}:i;if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await k(a,"sscal"),n=null,l=null,u=null;try{n=o?i._buf:x(i,"sscal-x",!0),l=j([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=G(s.getBindGroupLayout(0),[n,l]),{commandEncoder:c,ts:d}=P(s,f,U(r));u=o?null:E(c,n),B(c);let p=await A(d);if(o)return p!==void 0?{gpuTimeMs:p}:{};let g=await y(u,Float32Array);return u=null,p!==void 0?{x:g,gpuTimeMs:p}:g}finally{!o&&n&&m(n),l&&m(l),u&&m(u)}}async function ce(a,r,e,i,t,o){let s=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof h))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof h))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await k(a,"sswap"),u=null,f=null,c=null,d=null,p=null;try{u=s?e._buf:x(e,"sswap-x",!0),f=n?t._buf:x(t,"sswap-y",!0),c=j([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let g=G(l.getBindGroupLayout(0),[u,f,c]),{commandEncoder:w,ts:_}=P(l,g,U(r));d=s?null:E(w,u),p=n?null:E(w,f),B(w);let b=await A(_);if(s&&n)return b!==void 0?{gpuTimeMs:b}:{};let F=await y(d,Float32Array);d=null;let v=await y(p,Float32Array);return p=null,b!==void 0?{x:F,y:v,gpuTimeMs:b}:{x:F,y:v}}finally{!s&&u&&m(u),!n&&f&&m(f),c&&m(c),d&&m(d),p&&m(p)}}async function de(a,r,e,i,t,o,s){let n=i instanceof h,l=o instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{y:o};if(i.length<(r-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"saxpy"),f=null,c=null,d=null,p=null;try{f=n?i._buf:x(i,"saxpy-x",!1),c=l?o._buf:x(o,"saxpy-y",!0),d=j([{value:r,type:"u32"},{value:e,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let g=G(u.getBindGroupLayout(0),[f,c,d]),{commandEncoder:w,ts:_}=P(u,g,U(r));p=l?null:E(w,c),B(w);let b=await A(_);if(l&&n)return b!==void 0?{gpuTimeMs:b}:{};let F=await y(p,Float32Array);return p=null,b!==void 0?{y:F,gpuTimeMs:b}:{y:F}}finally{!n&&f&&m(f),!l&&c&&m(c),d&&m(d),p&&m(p)}}async function me(a,r,e,i,t,o){let s=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await k(a,"scopy"),u=null,f=null,c=null,d=null;try{u=s?e._buf:x(e,"scopy-x",!1),f=n?t._buf:x(t,"scopy-y",!0),c=j([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let p=G(l.getBindGroupLayout(0),[u,f,c]),{commandEncoder:g,ts:w}=P(l,p,U(r));d=n?null:E(g,f),B(g);let _=await A(w);if(n&&s)return _!==void 0?{gpuTimeMs:_}:{};let b=await y(d,Float32Array);return d=null,_!==void 0?{y:b,gpuTimeMs:_}:{y:b}}finally{!s&&u&&m(u),!n&&f&&m(f),c&&m(c),d&&m(d)}}var pe=64;async function ge(a,r,e,i,t,o){let s=e instanceof h,n=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await k(a,"sdot"),u=await k(a,"reduction/sum"),f=null,c=null,d=null,p=null,g=null,w=null;try{f=s?e._buf:x(e,"sdot-x",!1),c=n?t._buf:x(t,"sdot-y",!1),d=H(2*pe*4,"sdot-partials"),p=D(4,"sdot-result"),g=j([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let _=G(l.getBindGroupLayout(0),[f,c,d,g]),{commandEncoder:b,ts:F}=P(l,_,2*pe);B(b);let v=G(u.getBindGroupLayout(0),[d,p]),{commandEncoder:S,ts:I}=P(u,v,1);w=E(S,p),B(S);let N=y(w,Float32Array);w=null;let[L,V,T]=await Promise.all([A(F),A(I),N]);return L!==void 0&&V!==void 0?{dot:T[0],gpuTimeMs:L+V}:{dot:T[0]}}finally{!s&&f&&m(f),!n&&c&&m(c),d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}var we=64;async function xe(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(a,"sasum"),s=await k(a,"reduction/sum"),n=null,l=null,u=null,f=null,c=null;try{n=t?e._buf:x(e,"sasum-x",!1),l=H(2*we*4,"sasum-partials"),u=D(4,"sasum-result"),f=j([{value:r,type:"u32"},{value:i,type:"u32"}],"sasum-params");let d=G(o.getBindGroupLayout(0),[n,l,f]),{commandEncoder:p,ts:g}=P(o,d,2*we);B(p);let w=G(s.getBindGroupLayout(0),[l,u]),{commandEncoder:_,ts:b}=P(s,w,1);c=E(_,u),B(_);let F=y(c,Float32Array);c=null;let[v,S,I]=await Promise.all([A(g),A(b),F]);return v!==void 0&&S!==void 0?{asum:I[0],gpuTimeMs:v+S}:{asum:I[0]}}finally{!t&&n&&m(n),l&&m(l),u&&m(u),f&&m(f),c&&m(c)}}var ar=64;async function be(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(a,["f64add","dasum"],"dasum_main"),s=await k(a,["f64add","reduction/sumF64"],"reduce_f64"),n=null,l=null,u=null,f=null,c=null,d=null,p=null,g=null;try{n=t?e:h.from(e),l=H(2*ar*4,"dasum-partialsMain"),u=H(2*ar*4,"dasum-partialsAux"),f=D(4,"dasum-result-main"),c=D(4,"dasum-result-aux"),d=j([{value:r,type:"u32"},{value:i,type:"u32"}],"dasum-params");let w=G(o.getBindGroupLayout(0),[n._buf,n._auxBuf,l,u,d],4),{commandEncoder:_,ts:b}=P(o,w,2*ar);B(_);let F=G(s.getBindGroupLayout(0),[l,u,f,c],4),{commandEncoder:v,ts:S}=P(s,F,1);p=E(v,f),g=E(v,c),B(v);let I=y(p,Float32Array),N=y(g,Uint32Array);p=null,g=null;let[L,V,T,O]=await Promise.all([A(b),A(S),I,N]),z=X(T[0],O[0]);return L!==void 0&&V!==void 0?{asum:z,gpuTimeMs:L+V}:{asum:z}}finally{!t&&n&&n.destroy(),l&&m(l),u&&m(u),f&&m(f),c&&m(c),d&&m(d),p&&m(p),g&&m(g)}}var he=64;async function ve(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(a,"snrm2"),s=await k(a,"reduction/sum"),n=null,l=null,u=null,f=null,c=null;try{n=t?e._buf:x(e,"snrm2-x",!1),l=H(2*he*4,"snrm2-partials"),u=D(4,"snrm2-result"),f=j([{value:r,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let d=G(o.getBindGroupLayout(0),[n,l,f]),{commandEncoder:p,ts:g}=P(o,d,2*he);B(p);let w=G(s.getBindGroupLayout(0),[l,u]),{commandEncoder:_,ts:b}=P(s,w,1);c=E(_,u),B(_);let F=y(c,Float32Array);c=null;let[v,S,I]=await Promise.all([A(g),A(b),F]),N=Math.sqrt(I[0]);return v!==void 0&&S!==void 0?{nrm2:N,gpuTimeMs:v+S}:{nrm2:N}}finally{!t&&n&&m(n),l&&m(l),u&&m(u),f&&m(f),c&&m(c)}}var ir=64;async function ye(a,r,e,i){let t=e instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!t&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await k(a,"isamax"),s=await k(a,"reduction/argmax"),n=null,l=null,u=null,f=null,c=null,d=null;try{n=t?e._buf:x(e,"isamax-x",!1),l=H(2*ir*4,"isamax-partials-val"),u=H(2*ir*4,"isamax-partials-idx"),f=D(4,"isamax-result"),c=j([{value:r,type:"u32"},{value:i,type:"u32"}],"isamax-params");let p=G(o.getBindGroupLayout(0),[n,l,u,c]),{commandEncoder:g,ts:w}=P(o,p,2*ir);B(g);let _=G(s.getBindGroupLayout(0),[l,u,f]),{commandEncoder:b,ts:F}=P(s,_,1);d=E(b,f),B(b);let v=y(d,Uint32Array);d=null;let[S,I,N]=await Promise.all([A(w),A(F),v]),L=N[0];return S!==void 0&&I!==void 0?{index:L,gpuTimeMs:S+I}:{index:L}}finally{!t&&n&&m(n),l&&m(l),u&&m(u),f&&m(f),c&&m(c),d&&m(d)}}async function _e(a,r,e,i,t,o,s,n){let l=e instanceof h,u=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!l&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return l?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await k(a,"srot"),c=null,d=null,p=null,g=null,w=null;try{c=l?e._buf:x(e,"srot-x",!0),d=u?t._buf:x(t,"srot-y",!0),p=j([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let _=G(f.getBindGroupLayout(0),[c,d,p]),{commandEncoder:b,ts:F}=P(f,_,U(r));g=l?null:E(b,c),w=u?null:E(b,d),B(b);let v=await A(F);if(l&&u)return v!==void 0?{gpuTimeMs:v}:{};let S=y(g,Float32Array),I=y(w,Float32Array);g=null,w=null;let[N,L]=await Promise.all([S,I]);return v!==void 0?{x:N,y:L,gpuTimeMs:v}:{x:N,y:L}}finally{!l&&c&&m(c),!u&&d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}async function Ee(a,r,e,i,t,o,s){let n=e instanceof h,l=t instanceof h;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:t};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"srotm"),f=null,c=null,d=null,p=null,g=null,w=null;try{f=n?e._buf:x(e,"srotm-x",!0),c=l?t._buf:x(t,"srotm-y",!0),d=x(s,"srotm-param",!1),p=j([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let _=G(u.getBindGroupLayout(0),[f,c,d,p]),{commandEncoder:b,ts:F}=P(u,_,U(r));g=n?null:E(b,f),w=l?null:E(b,c),B(b);let v=await A(F);if(n&&l)return v!==void 0?{gpuTimeMs:v}:{};let S=y(g,Float32Array),I=y(w,Float32Array);g=null,w=null;let[N,L]=await Promise.all([S,I]);return v!==void 0?{x:N,y:L,gpuTimeMs:v}:{x:N,y:L}}finally{!n&&f&&m(f),!l&&c&&m(c),d&&m(d),p&&m(p),g&&m(g),w&&m(w)}}async function Ae(a,r,e,i,t,o,s,n,l,u,f,c){let d=n instanceof h,p=f instanceof h,g=o instanceof R,w=r==="no-transpose";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!w&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(c)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(l<=0||c<=0)throw new Error("incx and incy must be positive.");if(s<i)throw new Error("lda must be >= n.");if(!g&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(o.rows<e||o.cols<i))throw new Error("A is too small for the given m and n.");if(e<0||i<0)throw new Error("m and n must be non-negative.");if(e===0||i===0)return p?{}:{y:f};let _=w?i:e,b=w?e:i;if(!g&&o.length<(e-1)*s+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(_-1)*l+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(b-1)*c+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let v=await k(a,w?"sgemv_n":"sgemv_t"),S=g?o._buf:x(o,"sgemv-A",!1),I=d?n._buf:x(n,"sgemv-x",!1),N=p?f._buf:x(f,"sgemv-y",!0),L=j([{value:e,type:"u32"},{value:i,type:"u32"},{value:t,type:"f32"},{value:u,type:"f32"},{value:l,type:"u32"},{value:c,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let V=G(v.getBindGroupLayout(0),[S,I,N,L]),T=w?Math.min(e,a.limits.maxComputeWorkgroupsPerDimension):U(b),{commandEncoder:O,ts:z}=P(v,V,T),$=p?null:E(O,N);B(O);let Y=await A(z);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let or=await y($,Float32Array);return Y!==void 0?{y:or,gpuTimeMs:Y}:{y:or}}finally{g||m(S),d||m(I),p||m(N),m(L)}}async function Ge(a,r,e,i,t,o,s,n,l,u,f){let c=s instanceof h,d=u instanceof h,p=t instanceof R,g=r==="lower";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(o<e)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&o!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<e||t.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return d?{}:{y:u};if(!p&&t.length<(e-1)*o+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await k(a,"ssymv"),_=null,b=null,F=null,v=null;try{_=p?t._buf:x(t,"ssymv-A",!1),b=c?s._buf:x(s,"ssymv-x",!1),F=d?u._buf:x(u,"ssymv-y",!0),v=j([{value:e,type:"u32"},{value:i,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:o,type:"u32"},{value:g?0:1,type:"u32"}],"ssymv-params");let S=G(w.getBindGroupLayout(0),[_,b,F,v]),I=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:L}=P(w,S,I),V=d?null:E(N,F);B(N);let T=await A(L);if(d)return T!==void 0?{gpuTimeMs:T}:{};let O=await y(V,Float32Array);return T!==void 0?{y:O,gpuTimeMs:T}:{y:O}}finally{!p&&_&&m(_),!c&&b&&m(b),!d&&F&&m(F),v&&m(v)}}async function Be(a,r,e,i,t,o,s,n,l,u,f){let c=n instanceof h,d=u instanceof h,p=o instanceof R,g=r==="lower",w=e==="no-transpose",_=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!w&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!_&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!p&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&n._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&d&&o._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return d?{}:{y:u};if(!p&&o.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(t-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let b=await k(a,"strmv"),F=null,v=null,S=null,I=null;try{F=p?o._buf:x(o,"strmv-A",!1),v=c?n._buf:x(n,"strmv-x",!1),S=d?u._buf:x(u,"strmv-y",!0),I=j([{value:t,type:"u32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:w?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:_?1:0,type:"u32"}],"strmv-params");let N=G(b.getBindGroupLayout(0),[F,v,S,I]),L=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:V,ts:T}=P(b,N,L),O=d?null:E(V,S);B(V);let z=await A(T);if(d)return z!==void 0?{gpuTimeMs:z}:{};let $=await y(O,Float32Array);return z!==void 0?{y:$,gpuTimeMs:z}:{y:$}}finally{!p&&F&&m(F),!c&&v&&m(v),!d&&S&&m(S),I&&m(I)}}async function Pe(a,r,e,i,t,o,s,n,l){let u=n instanceof h,f=o instanceof R,c=r==="lower",d=e==="no-transpose",p=i==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!c&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!d&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(l<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!f&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(o.rows<t||o.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return u?{}:{x:n};if(!f&&o.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(t-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");let g=await k(a,"strsv"),w=null,_=null,b=null;try{w=f?o._buf:x(o,"strsv-A",!1),_=u?n._buf:x(n,"strsv-x",!0),b=j([{value:t,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"},{value:d?0:1,type:"u32"},{value:c?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-params");let F=G(g.getBindGroupLayout(0),[w,_,b]),{commandEncoder:v,ts:S}=P(g,F,1),I=u?null:E(v,_);B(v);let N=await A(S);if(u)return N!==void 0?{gpuTimeMs:N}:{};let L=await y(I,Float32Array);return N!==void 0?{x:L,gpuTimeMs:N}:{x:L}}finally{!f&&w&&m(w),!u&&_&&m(_),b&&m(b)}}return Ie(ct);})();
