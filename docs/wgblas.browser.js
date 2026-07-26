var wgblas=(()=>{var Ae=Object.create;var Z=Object.defineProperty;var Be=Object.getOwnPropertyDescriptor;var Pe=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,Se=Object.prototype.hasOwnProperty;var K=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var W=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(i){throw e=[i],i}};var nr=(t,r)=>{for(var e in r)Z(t,e,{get:r[e],enumerable:!0})},sr=(t,r,e,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of Pe(r))!Se.call(t,a)&&a!==e&&Z(t,a,{get:()=>r[a],enumerable:!(i=Be(r,a))||i.enumerable});return t};var J=(t,r,e)=>(e=t!=null?Ae(ke(t)):{},sr(r||!t||!t.__esModule?Z(e,"default",{value:t,enumerable:!0}):e,t)),Fe=t=>sr(Z({},"__esModule",{value:!0}),t);var _r,vr=W(()=>{_r=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Gr,Er=W(()=>{Gr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Br,Ar=W(()=>{Br=`// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
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
`});var kr,Pr=W(()=>{kr=`// sscal: x = alpha * x

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
`});var Fr,Sr=W(()=>{Fr=`// sswap: x <-> y

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
`});var Lr,Nr=W(()=>{Lr=`// saxpy: y = alpha * x + y

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
`});var Wr,Ir=W(()=>{Wr=`// scopy: y = x

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
`});var Mr,jr=W(()=>{Mr=`// sdot: result = sum(x[i] * y[i])
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
`});var Tr,Ur=W(()=>{Tr=`// sasum: result = sum(|x[i]|)
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
`});var Hr,Vr=W(()=>{Hr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var Dr,Rr=W(()=>{Dr=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Or,Cr=W(()=>{Or=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Qr,zr=W(()=>{Qr=`// isamax: returns index of element with largest absolute value
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
`});var Xr,qr=W(()=>{Xr=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Yr,$r=W(()=>{Yr=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Kr,Zr=W(()=>{Kr=`// ssymv: y = alpha * A * x + beta * y
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
`});var re,Jr=W(()=>{re=`// strmv: y = op(A) * x
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
`});var ae,ee=W(()=>{ae=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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

fn computeSum(a: Fields, b: Fields) -> Packed {
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
  let a = decode(bitcast<u32>(mainInput[0]), auxInput[0]);
  let b = decode(bitcast<u32>(mainInput[1]), auxInput[1]);
  let result = computeSum(a, b);
  mainOutput[0] = result.main;
  auxOutput[0] = result.aux;
}
`});var ie,te=W(()=>{ie=`// dasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sumF64.wgsl.
// Same structure as sasum.wgsl \u2014 every value is now a [main, aux] pair
// (see src/util/f64pack.mjs) and every \`+\`/\`+=\` is computeSum via addPair
// instead of plain f32 addition. Concatenated after f64add.wgsl by
// getPipeline (WGSL has no #include), reusing its decode/encode/computeSum
// and Packed struct \u2014 so bindings here start at 4 (f64add.wgsl already has
// 0-3) and the entry point is \`dasum_main\` (f64add.wgsl already has \`fn main\`).
//
// xAux/partialsAux are array<u32>, not array<f32> \u2014 aux's bits must never
// pass through an f32-typed storage slot (NaN-bit-pattern corruption risk,
// see f64pack.mjs and f64add.wgsl's binding comment); Packed (from
// f64add.wgsl) keeps aux as u32 in registers/workgroup memory too.

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
fn addPair(a: Packed, b: Packed) -> Packed {
  return computeSum(decode(bitcast<u32>(a.main), a.aux), decode(bitcast<u32>(b.main), b.aux));
}

// |x| for a packed double is abs(main) with aux untouched \u2014 only main's
// sign bit carries the double's sign (see fieldsToPacked() in f64pack.mjs).
fn absPair(idx: u32) -> Packed {
  return Packed(abs(xMain[idx]), xAux[idx]);
}

@compute @workgroup_size(64)
fn dasum_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: Packed = Packed(0.0, 0u);
  var acc1: Packed = Packed(0.0, 0u);
  var acc2: Packed = Packed(0.0, 0u);
  var acc3: Packed = Packed(0.0, 0u);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = addPair(acc0, absPair( id                * params.x_inc));
    acc1 = addPair(acc1, absPair((id +      stride) * params.x_inc));
    acc2 = addPair(acc2, absPair((id + 2u * stride) * params.x_inc));
    acc3 = addPair(acc3, absPair((id + 3u * stride) * params.x_inc));
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = addPair(acc0, absPair(id * params.x_inc));
  }

  tile[lid.x] = addPair(addPair(acc0, acc1), addPair(acc2, acc3));
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
`});var oe={};nr(oe,{shaderSources:()=>aa});var aa,ne=W(()=>{vr();Er();Ar();Pr();Sr();Nr();Ir();jr();Ur();Vr();Rr();Cr();zr();qr();$r();Zr();Jr();ee();te();aa={"reduction/argmax":_r,"reduction/sum":Gr,"reduction/sumF64":Br,sscal:kr,sswap:Fr,saxpy:Lr,scopy:Wr,sdot:Mr,sasum:Tr,snrm2:Hr,srot:Dr,srotm:Or,isamax:Qr,sgemv_n:Xr,sgemv_t:Yr,ssymv:Kr,strmv:re,f64add:ae,dasum:ie}});var sa={};nr(sa,{GpuMatrix:()=>C,GpuVector:()=>w,cleanup:()=>dr,dasum:()=>xe,gpuName:()=>gr,init:()=>pr,isamax:()=>he,randomFloat32Array:()=>hr,randomFloat64Array:()=>yr,sasum:()=>ge,saxpy:()=>fe,scopy:()=>ce,sdot:()=>pe,sgemv:()=>_e,snrm2:()=>be,srot:()=>ye,srotm:()=>ve,sscal:()=>ue,sswap:()=>le,ssymv:()=>Ee,strmv:()=>Ge});function ur(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function lr(){if(!cr())return{querySet:null,passDescriptor:void 0};let r=I().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function fr(t,r){if(!r)return null;let e=I(),i=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,i,0);let a=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(i,0,a,0,16),{tsReadBuffer:a,resolveBuffer:i,querySet:r}}async function A(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:i}=t;await r.mapAsync(GPUMapMode.READ);let a=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),i.destroy(),Math.max(0,Number(a[1]-a[0]))/1e6}var D=null,Q=null,mr=null,er=!1;async function pr({powerPreference:t="high-performance",benchmark:r=!1}={}){if(D)return D;let e;if(typeof window>"u"){let{create:o,globals:s}=await import("webgpu");Object.assign(globalThis,s),e=o([]),mr=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(Q=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!Q)throw new Error("No WebGPU adapter found.");er=r;let a=[...ur(Q,r).requiredFeatures??[]];return D=await Q.requestDevice({requiredFeatures:a}),D.addEventListener("uncapturederror",o=>{console.error("Uncaptured GPU error:",o.error.message)}),D}function dr(){D&&(D.destroy(),D=null),Q=null,mr=null,er=!1}function gr(){if(!Q)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=Q.info;return{description:r||"unknown",device:t||"unknown"}}function cr(){return er}function I(){if(!D)throw new Error("WebGPU device not initialized \u2014 call init() first.");return D}function d(...t){t.flat().forEach(r=>r.destroy())}function x(t,r="blas-input",e=!1){let i=I(),a=i.limits.maxStorageBufferBindingSize,o=t.byteLength;if(o>a)throw new Error(`Buffer size ${o} bytes exceeds device limit of ${a} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=i.createBuffer({label:r,size:o,usage:s,mappedAtCreation:!0}),u=t.constructor;return new u(n.getMappedRange()).set(t),n.unmap(),n}function V(t,r="blas-storage"){return I().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function H(t,r="blas-result"){return I().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function v(t,r){let i=I().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,i,0,r.size),i}function N(t,r="blas-params"){let e=I(),i=t.length*4,a=Math.ceil(i/16)*16,o=new ArrayBuffer(a),s=new DataView(o);t.forEach(({value:u,type:l},f)=>{let c=f*4;if(l==="u32")s.setUint32(c,u,!0);else if(l==="i32")s.setInt32(c,u,!0);else if(l==="f32")s.setFloat32(c,u,!0);else throw new Error(`Unknown param type "${l}". Use "f32", "u32", or "i32".`)});let n=e.createBuffer({label:r,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,o),n}async function h(t,r=Float32Array){try{await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}finally{t.destroy()}}var Ne=new ArrayBuffer(8),q=new DataView(Ne),xr=new ArrayBuffer(4),wr=new Uint32Array(xr),br=new Float32Array(xr);function Le(t){return wr[0]=t>>>0,br[0]}function Ie(t){return br[0]=t,wr[0]}function We(t,r,e,i){let a=r>>>3,o=r&7,s=i>>>29,n=e<<3|s,u=i&536870911,l=t<<31|a<<23|n,f=o>>>2&1,c=o&3,m=u>>>23,p=u&8388607,g=c<<6|m,y=(f<<31|g<<23|p)>>>0;return[Le(l),y]}function je(t,r){let e=Ie(t);r=r>>>0;let i=e>>>31,a=e>>>23&255,o=e&8388607,s=r>>>31,n=r>>>23&255,u=r&8388607,l=s<<2|n>>>6,f=(n&63)<<23|u,c=a<<3|l,m=o>>>3,g=((o&7)<<29|f)>>>0;return{sign:i,rawExp:c,mantissaHi:m,lo:g}}function rr(t){q.setFloat64(0,t,!1);let r=q.getUint32(0,!1),e=q.getUint32(4,!1),i=r>>>31,a=r>>>20&2047,o=r&1048575;return We(i,a,o,e)}function X(t,r){let{sign:e,rawExp:i,mantissaHi:a,lo:o}=je(t,r),s=(e<<31|i<<20|a)>>>0;return q.setUint32(0,s,!1),q.setUint32(4,o,!1),q.getFloat64(0,!1)}var w=class t{constructor(r,e,i=Float32Array,a=null){this._buf=r,this._auxBuf=a,this.length=e,this.dtype=i}static from(r){if(r instanceof Float64Array){let i=new Float32Array(r.length),a=new Uint32Array(r.length);for(let n=0;n<r.length;n++){let u=rr(r[n]);i[n]=u[0],a[n]=u[1]}let o=x(i,"gpu-vector-f64-main",!0),s=x(a,"gpu-vector-f64-aux",!0);return new t(o,r.length,Float64Array,s)}if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let e=x(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=I(),e=r.createCommandEncoder(),i=v(e,this._buf);if(r.queue.submit([e.finish()]),!this._auxBuf)return h(i,this.dtype);let a=r.createCommandEncoder(),o=v(a,this._auxBuf);r.queue.submit([a.finish()]);let[s,n]=await Promise.all([h(i,Float32Array),h(o,Uint32Array)]),u=new Float64Array(this.length);for(let l=0;l<this.length;l++)u[l]=X(s[l],n[l]);return u}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};var C=class t{constructor(r,e,i,a,o=null){this._buf=r,this._auxBuf=o,this.rows=e,this.cols=i,this.lda=a}static from(r,e,i,a=i){if(!(r instanceof Float32Array)&&!(r instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(e)||e<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(i)||i<=0)throw new Error("cols must be a positive integer.");if(!Number.isInteger(a)||a<i)throw new Error("lda must be an integer >= cols.");if(r.length<e*a)throw new Error("data does not have enough elements for the given rows and lda.");if(r instanceof Float64Array){let s=e*a,n=new Float32Array(s),u=new Uint32Array(s);for(let c=0;c<s;c++){let m=rr(r[c]);n[c]=m[0],u[c]=m[1]}let l=x(n,"gpu-matrix-f64-main",!0),f=x(u,"gpu-matrix-f64-aux",!0);return new t(l,e,i,a,f)}let o=x(r.subarray(0,e*a),"gpu-matrix",!0);return new t(o,e,i,a)}async read(){let r=I(),e=r.createCommandEncoder(),i=v(e,this._buf);if(r.queue.submit([e.finish()]),this._auxBuf){let s=r.createCommandEncoder(),n=v(s,this._auxBuf);r.queue.submit([s.finish()]);let[u,l]=await Promise.all([h(i,Float32Array),h(n,Uint32Array)]),f=new Float64Array(this.rows*this.lda);for(let m=0;m<f.length;m++)f[m]=X(u[m],l[m]);if(this.lda===this.cols)return f;let c=new Float64Array(this.rows*this.cols);for(let m=0;m<this.rows;m++)c.set(f.subarray(m*this.lda,m*this.lda+this.cols),m*this.cols);return c}let a=await h(i,Float32Array);if(this.lda===this.cols)return a;let o=new Float32Array(this.rows*this.cols);for(let s=0;s<this.rows;s++)o.set(a.subarray(s*this.lda,s*this.lda+this.cols),s*this.cols);return o}destroy(){this._buf.destroy(),this._auxBuf&&this._auxBuf.destroy()}};function hr(t,r=-1,e=1){let i=new Float32Array(t);for(let a=0;a<t;a++)i[a]=r+Math.random()*(e-r);return i}function yr(t,r=-1,e=1){let i=new Float64Array(t);for(let a=0;a<t;a++)i[a]=r+Math.random()*(e-r);return i}function B(t,r,e=0){let i=I(),a=r.map((o,s)=>({binding:e+s,resource:{buffer:o}}));return i.createBindGroup({layout:t,entries:a})}var Me=new WeakMap;function P(t){I().queue.submit([t.finish()])}function k(t,r,e){let i=I(),{querySet:a,passDescriptor:o}=lr(),s=i.createCommandEncoder(),n=s.beginComputePass(o);n.setPipeline(t),n.setBindGroup(0,r),typeof e=="number"?n.dispatchWorkgroups(e):n.dispatchWorkgroups(e.x,e.y),n.end();let u=fr(s,a);return Me.set(s,n),{commandEncoder:s,ts:u}}var oa={},ar=new WeakMap;async function S(t,r,e="main"){ar.has(t)||ar.set(t,new Map);let i=ar.get(t),a=Array.isArray(r)?r:[r],o=`${a.join("+")}::${e}`;return i.has(o)||i.set(o,await ia(a,e)),i.get(o)}async function ta(t){if(typeof process>"u"||!process.versions?.node){let{shaderSources:r}=await Promise.resolve().then(()=>(ne(),oe)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:i,join:a}=await import("path"),o=i(e(oa.url));return r(a(o,`../shaders/${t}.wgsl`),"utf8")}}async function ia(t,r="main"){let e=I(),i=t.join("+"),a=(await Promise.all(t.map(ta))).join(`
`),o=e.createShaderModule({label:i,code:a}),n=(await o.getCompilationInfo()).messages.filter(f=>f.type==="error");if(n.length>0)throw new Error(`Shader "${i}" compilation failed:
${n.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let u=r==="main"?{module:o}:{module:o,entryPoint:r},l=e.createComputePipeline({label:i,layout:"auto",compute:u});return l._shaderModule=o,l}var na=64,se=8;function M(t,r){let e=I().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/na),e):{x:Math.min(Math.ceil(r/se),e),y:Math.min(Math.ceil(t/se),e)}}async function ue(t,r,e,i,a){let o=i instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(i instanceof Float32Array)&&!(i instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return o?{}:i;if(i.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await S(t,"sscal"),n=null,u=null;try{n=o?i._buf:x(i,"sscal-x",!0),u=N([{value:r,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"}],"sscal-params");let l=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:f,ts:c}=k(s,l,M(r)),m=o?null:v(f,n);P(f);let p=await A(c);if(o)return p!==void 0?{gpuTimeMs:p}:{};let g=await h(m,Float32Array);return p!==void 0?{x:g,gpuTimeMs:p}:g}finally{!o&&n&&d(n),u&&d(u)}}async function le(t,r,e,i,a,o){let s=e instanceof w,n=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof w))throw new Error("x must be a Float32Array or GpuVector.");if(!(a instanceof Float32Array)&&!(a instanceof w))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==a.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(t,"sswap"),l=null,f=null,c=null;try{l=s?e._buf:x(e,"sswap-x",!0),f=n?a._buf:x(a,"sswap-y",!0),c=N([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sswap-params");let m=B(u.getBindGroupLayout(0),[l,f,c]),{commandEncoder:p,ts:g}=k(u,m,M(r)),y=s?null:v(p,l),E=n?null:v(p,f);P(p);let _=await A(g);if(s&&n)return _!==void 0?{gpuTimeMs:_}:{};let G=await h(y,Float32Array),b=await h(E,Float32Array);return _!==void 0?{x:G,y:b,gpuTimeMs:_}:{x:G,y:b}}finally{!s&&l&&d(l),!n&&f&&d(f),c&&d(c)}}async function fe(t,r,e,i,a,o,s){let n=i instanceof w,u=o instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:o};if(i.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await S(t,"saxpy"),f=null,c=null,m=null;try{f=n?i._buf:x(i,"saxpy-x",!1),c=u?o._buf:x(o,"saxpy-y",!0),m=N([{value:r,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let p=B(l.getBindGroupLayout(0),[f,c,m]),{commandEncoder:g,ts:y}=k(l,p,M(r)),E=u?null:v(g,c);P(g);let _=await A(y);if(u&&n)return _!==void 0?{gpuTimeMs:_}:{};let G=await h(E,Float32Array);return _!==void 0?{y:G,gpuTimeMs:_}:{y:G}}finally{!n&&f&&d(f),!u&&c&&d(c),m&&d(m)}}async function ce(t,r,e,i,a,o){let s=e instanceof w,n=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return n?{}:{y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(t,"scopy"),l=null,f=null,c=null;try{l=s?e._buf:x(e,"scopy-x",!1),f=n?a._buf:x(a,"scopy-y",!0),c=N([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"scopy-params");let m=B(u.getBindGroupLayout(0),[l,f,c]),{commandEncoder:p,ts:g}=k(u,m,M(r)),y=n?null:v(p,f);P(p);let E=await A(g);if(n&&s)return E!==void 0?{gpuTimeMs:E}:{};let _=await h(y,Float32Array);return E!==void 0?{y:_,gpuTimeMs:E}:{y:_}}finally{!s&&l&&d(l),!n&&f&&d(f),c&&d(c)}}var me=64;async function pe(t,r,e,i,a,o){let s=e instanceof w,n=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(t,"sdot"),l=await S(t,"reduction/sum"),f=null,c=null,m=null,p=null,g=null;try{f=s?e._buf:x(e,"sdot-x",!1),c=n?a._buf:x(a,"sdot-y",!1),m=V(2*me*4,"sdot-partials"),p=H(4,"sdot-result"),g=N([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"sdot-params");let y=B(u.getBindGroupLayout(0),[f,c,m,g]),{commandEncoder:E,ts:_}=k(u,y,2*me);P(E);let G=B(l.getBindGroupLayout(0),[m,p]),{commandEncoder:b,ts:F}=k(l,G,1),L=v(b,p);P(b);let[j,U,T]=await Promise.all([A(_),A(F),h(L,Float32Array)]);return j!==void 0&&U!==void 0?{dot:T[0],gpuTimeMs:j+U}:{dot:T[0]}}finally{!s&&f&&d(f),!n&&c&&d(c),m&&d(m),p&&d(p),g&&d(g)}}var de=64;async function ge(t,r,e,i){let a=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await S(t,"sasum"),s=await S(t,"reduction/sum"),n=null,u=null,l=null,f=null;try{n=a?e._buf:x(e,"sasum-x",!1),u=V(2*de*4,"sasum-partials"),l=H(4,"sasum-result"),f=N([{value:r,type:"u32"},{value:i,type:"u32"}],"sasum-params");let c=B(o.getBindGroupLayout(0),[n,u,f]),{commandEncoder:m,ts:p}=k(o,c,2*de);P(m);let g=B(s.getBindGroupLayout(0),[u,l]),{commandEncoder:y,ts:E}=k(s,g,1),_=v(y,l);P(y);let[G,b,F]=await Promise.all([A(p),A(E),h(_,Float32Array)]);return G!==void 0&&b!==void 0?{asum:F[0],gpuTimeMs:G+b}:{asum:F[0]}}finally{!a&&n&&d(n),u&&d(u),l&&d(l),f&&d(f)}}var tr=64;async function xe(t,r,e,i){let a=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(a&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await S(t,["f64add","dasum"],"dasum_main"),s=await S(t,["f64add","reduction/sumF64"],"reduce_f64"),n=null,u=null,l=null,f=null,c=null,m=null,p=null,g=null;try{n=a?e:w.from(e),u=V(2*tr*4,"dasum-partialsMain"),l=V(2*tr*4,"dasum-partialsAux"),f=H(4,"dasum-result-main"),c=H(4,"dasum-result-aux"),m=N([{value:r,type:"u32"},{value:i,type:"u32"}],"dasum-params");let y=B(o.getBindGroupLayout(0),[n._buf,n._auxBuf,u,l,m],4),{commandEncoder:E,ts:_}=k(o,y,2*tr);P(E);let G=B(s.getBindGroupLayout(0),[u,l,f,c],4),{commandEncoder:b,ts:F}=k(s,G,1);p=v(b,f),g=v(b,c),P(b);let L=h(p,Float32Array),j=h(g,Uint32Array);p=null,g=null;let[U,T,R,O]=await Promise.all([A(_),A(F),L,j]),z=X(R[0],O[0]);return U!==void 0&&T!==void 0?{asum:z,gpuTimeMs:U+T}:{asum:z}}finally{!a&&n&&n.destroy(),u&&d(u),l&&d(l),f&&d(f),c&&d(c),m&&d(m),p&&d(p),g&&d(g)}}var we=64;async function be(t,r,e,i){let a=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await S(t,"snrm2"),s=await S(t,"reduction/sum"),n=null,u=null,l=null,f=null;try{n=a?e._buf:x(e,"snrm2-x",!1),u=V(2*we*4,"snrm2-partials"),l=H(4,"snrm2-result"),f=N([{value:r,type:"u32"},{value:i,type:"u32"}],"snrm2-params");let c=B(o.getBindGroupLayout(0),[n,u,f]),{commandEncoder:m,ts:p}=k(o,c,2*we);P(m);let g=B(s.getBindGroupLayout(0),[u,l]),{commandEncoder:y,ts:E}=k(s,g,1),_=v(y,l);P(y);let[G,b,F]=await Promise.all([A(p),A(E),h(_,Float32Array)]),L=Math.sqrt(F[0]);return G!==void 0&&b!==void 0?{nrm2:L,gpuTimeMs:G+b}:{nrm2:L}}finally{!a&&n&&d(n),u&&d(u),l&&d(l),f&&d(f)}}var ir=64;async function he(t,r,e,i){let a=e instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i))throw new Error("n and incx must be integers.");if(i<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let o=await S(t,"isamax"),s=await S(t,"reduction/argmax"),n=null,u=null,l=null,f=null,c=null;try{n=a?e._buf:x(e,"isamax-x",!1),u=V(2*ir*4,"isamax-partials-val"),l=V(2*ir*4,"isamax-partials-idx"),f=H(4,"isamax-result"),c=N([{value:r,type:"u32"},{value:i,type:"u32"}],"isamax-params");let m=B(o.getBindGroupLayout(0),[n,u,l,c]),{commandEncoder:p,ts:g}=k(o,m,2*ir);P(p);let y=B(s.getBindGroupLayout(0),[u,l,f]),{commandEncoder:E,ts:_}=k(s,y,1),G=v(E,f);P(E);let[b,F,L]=await Promise.all([A(g),A(_),h(G,Uint32Array)]),j=L[0];return b!==void 0&&F!==void 0?{index:j,gpuTimeMs:b+F}:{index:j}}finally{!a&&n&&d(n),u&&d(u),l&&d(l),f&&d(f),c&&d(c)}}async function ye(t,r,e,i,a,o,s,n){let u=e instanceof w,l=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof n!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(n))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(n))throw new Error("s must be finite.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await S(t,"srot"),c=null,m=null,p=null;try{c=u?e._buf:x(e,"srot-x",!0),m=l?a._buf:x(a,"srot-y",!0),p=N([{value:r,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srot-params");let g=B(f.getBindGroupLayout(0),[c,m,p]),{commandEncoder:y,ts:E}=k(f,g,M(r)),_=u?null:v(y,c),G=l?null:v(y,m);P(y);let b=await A(E);if(u&&l)return b!==void 0?{gpuTimeMs:b}:{};let[F,L]=await Promise.all([h(_,Float32Array),h(G,Float32Array)]);return b!==void 0?{x:F,y:L,gpuTimeMs:b}:{x:F,y:L}}finally{!u&&c&&d(c),!l&&m&&d(m),p&&d(p)}}async function ve(t,r,e,i,a,o,s){let n=e instanceof w,u=a instanceof w;if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(o))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i<=0||o<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return n?{}:{x:e,y:a};if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(r-1)*o+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await S(t,"srotm"),f=null,c=null,m=null,p=null;try{f=n?e._buf:x(e,"srotm-x",!0),c=u?a._buf:x(a,"srotm-y",!0),m=x(s,"srotm-param",!1),p=N([{value:r,type:"u32"},{value:i,type:"u32"},{value:o,type:"u32"}],"srotm-params");let g=B(l.getBindGroupLayout(0),[f,c,m,p]),{commandEncoder:y,ts:E}=k(l,g,M(r)),_=n?null:v(y,f),G=u?null:v(y,c);P(y);let b=await A(E);if(n&&u)return b!==void 0?{gpuTimeMs:b}:{};let[F,L]=await Promise.all([h(_,Float32Array),h(G,Float32Array)]);return b!==void 0?{x:F,y:L,gpuTimeMs:b}:{x:F,y:L}}finally{!n&&f&&d(f),!u&&c&&d(c),m&&d(m),p&&d(p)}}async function _e(t,r,e,i,a,o,s,n,u,l,f,c){let m=n instanceof w,p=f instanceof w,g=o instanceof C,y=r==="no-transpose";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!y&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(c)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(u<=0||c<=0)throw new Error("incx and incy must be positive.");if(s<i)throw new Error("lda must be >= n.");if(!g&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&n._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(o.rows<e||o.cols<i))throw new Error("A is too small for the given m and n.");if(e<0||i<0)throw new Error("m and n must be non-negative.");if(e===0||i===0)return p?{}:{y:f};let E=y?i:e,_=y?e:i;if(!g&&o.length<(e-1)*s+i)throw new Error("A does not have enough elements for the given m, n, and lda.");if(n.length<(E-1)*u+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(_-1)*c+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let b=await S(t,y?"sgemv_n":"sgemv_t"),F=g?o._buf:x(o,"sgemv-A",!1),L=m?n._buf:x(n,"sgemv-x",!1),j=p?f._buf:x(f,"sgemv-y",!0),U=N([{value:e,type:"u32"},{value:i,type:"u32"},{value:a,type:"f32"},{value:l,type:"f32"},{value:u,type:"u32"},{value:c,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let T=B(b.getBindGroupLayout(0),[F,L,j,U]),R=y?Math.min(e,t.limits.maxComputeWorkgroupsPerDimension):M(_),{commandEncoder:O,ts:z}=k(b,T,R),$=p?null:v(O,j);P(O);let Y=await A(z);if(p)return Y!==void 0?{gpuTimeMs:Y}:{};let or=await h($,Float32Array);return Y!==void 0?{y:or,gpuTimeMs:Y}:{y:or}}finally{g||d(F),m||d(L),p||d(j),d(U)}}async function Ee(t,r,e,i,a,o,s,n,u,l,f){let c=s instanceof w,m=l instanceof w,p=a instanceof C,g=r==="lower";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(o))throw new Error("n, incx, incy, and lda must be integers.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(o<e)throw new Error("lda must be >= n.");if(!p&&!(a instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&s._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&o!==a.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(a.rows<e||a.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return m?{}:{y:l};if(!p&&a.length<(e-1)*o+e)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let y=await S(t,"ssymv"),E=null,_=null,G=null,b=null;try{E=p?a._buf:x(a,"ssymv-A",!1),_=c?s._buf:x(s,"ssymv-x",!1),G=m?l._buf:x(l,"ssymv-y",!0),b=N([{value:e,type:"u32"},{value:i,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:o,type:"u32"},{value:g?0:1,type:"u32"}],"ssymv-params");let F=B(y.getBindGroupLayout(0),[E,_,G,b]),L=Math.min(e,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:U}=k(y,F,L),T=m?null:v(j,G);P(j);let R=await A(U);if(m)return R!==void 0?{gpuTimeMs:R}:{};let O=await h(T,Float32Array);return R!==void 0?{y:O,gpuTimeMs:R}:{y:O}}finally{!p&&E&&d(E),!c&&_&&d(_),!m&&G&&d(G),b&&d(b)}}async function Ge(t,r,e,i,a,o,s,n,u,l,f){let c=n instanceof w,m=l instanceof w,p=o instanceof C,g=r==="lower",y=e==="no-transpose",E=i==="unit";if(!(t instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!g&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(!y&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!E&&i!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(!Number.isInteger(a)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(u<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<a)throw new Error("lda must be >= n.");if(!p&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&n._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&m&&o._buf===l._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(o.rows<a||o.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return m?{}:{y:l};if(!p&&o.length<(a-1)*s+a)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(a-1)*u+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(a-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let _=await S(t,"strmv"),G=null,b=null,F=null,L=null;try{G=p?o._buf:x(o,"strmv-A",!1),b=c?n._buf:x(n,"strmv-x",!1),F=m?l._buf:x(l,"strmv-y",!0),L=N([{value:a,type:"u32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:E?1:0,type:"u32"}],"strmv-params");let j=B(_.getBindGroupLayout(0),[G,b,F,L]),U=Math.min(a,t.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:T,ts:R}=k(_,j,U),O=m?null:v(T,F);P(T);let z=await A(R);if(m)return z!==void 0?{gpuTimeMs:z}:{};let $=await h(O,Float32Array);return z!==void 0?{y:$,gpuTimeMs:z}:{y:$}}finally{!p&&G&&d(G),!c&&b&&d(b),!m&&F&&d(F),L&&d(L)}}return Fe(sa);})();
