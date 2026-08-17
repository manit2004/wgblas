var wgblas=(()=>{var to=Object.create;var Ir=Object.defineProperty;var oo=Object.getOwnPropertyDescriptor;var ao=Object.getOwnPropertyNames;var io=Object.getPrototypeOf,no=Object.prototype.hasOwnProperty;var Dr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var U=(a,t,r)=>()=>{if(r)throw r[0];try{return a&&(t=a(a=0)),t}catch(o){throw r=[o],o}};var Hr=(a,t)=>{for(var r in t)Ir(a,r,{get:t[r],enumerable:!0})},Ur=(a,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of ao(t))!no.call(a,e)&&e!==r&&Ir(a,e,{get:()=>t[e],enumerable:!(o=oo(t,e))||o.enumerable});return a};var Lr=(a,t,r)=>(r=a!=null?to(io(a)):{},Ur(t||!a||!a.__esModule?Ir(r,"default",{value:a,enumerable:!0}):r,a)),so=a=>Ur(Ir({},"__esModule",{value:!0}),a);var re,Jr=U(()=>{re=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var te,ee=U(()=>{te=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
// into one index, using ddGreater/ddEqual instead of plain f32 \`>\`/\`==\` (see
// reduction/argmax.wgsl for the f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsValHi/partialsValLo/
// partialsIdx must have exactly 2*WGS entries each. Concatenated after
// f64/dekker.wgsl (DD struct), f64/utils/greater.wgsl (ddGreater), and
// f64/utils/equal.wgsl (ddEqual).

@group(0) @binding(0) var<storage, read>       partialsValHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsValLo: array<f32>;
@group(0) @binding(2) var<storage, read>       partialsIdx:   array<u32>;
@group(0) @binding(3) var<storage, read_write> result:        array<u32>;

const WGS: u32 = 64;

var<workgroup> tile_val: array<DD, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn reduce_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a_val = DD(partialsValHi[i], partialsValLo[i]);
  let b_val = DD(partialsValHi[i + WGS], partialsValLo[i + WGS]);
  if (ddGreater(b_val, a_val) ||
      (ddEqual(b_val, a_val) && partialsIdx[i + WGS] < partialsIdx[i])) {
    tile_val[i] = b_val;
    tile_idx[i] = partialsIdx[i + WGS];
  } else {
    tile_val[i] = a_val;
    tile_idx[i] = partialsIdx[i];
  }
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) {
      let c_val = tile_val[i];
      let d_val = tile_val[i + s];
      if (ddGreater(d_val, c_val) ||
          (ddEqual(d_val, c_val) && tile_idx[i + s] < tile_idx[i])) {
        tile_val[i] = d_val;
        tile_idx[i] = tile_idx[i + s];
      }
    }
    workgroupBarrier();
  }

  if (i == 0u) { result[0] = tile_idx[0]; }
}
`});var ae,oe=U(()=>{ae=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var ne,ie=U(()=>{ne=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
// into one, using ddAddProtected instead of plain f32 \`+\` (see
// reduction/sum.wgsl for the f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsHi/partialsLo must have
// exactly 2*WGS entries each. Concatenated after f64/dekker.wgsl (DD struct)
// and f64/utils/add.wgsl (ddAddProtected \u2014 see it for why plain ddAdd isn't safe).

@group(0) @binding(0) var<storage, read>       partialsHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> resultHi:   array<f32, 1>;
@group(0) @binding(3) var<storage, read_write> resultLo:   array<f32, 1>;

const WGS: u32 = 64;

var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn reduce_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = DD(partialsHi[i], partialsLo[i]);
  let b = DD(partialsHi[i + WGS], partialsLo[i + WGS]);
  tile[i] = ddAddProtected(a, b, i);
  workgroupBarrier();

  // ddAddProtected must be called unconditionally by every thread.
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(i, i + s, i < s);
    let combined = ddAddProtected(tile[i], tile[partner], i);
    workgroupBarrier();
    if (i < s) { tile[i] = combined; }
    workgroupBarrier();
  }

  if (i == 0u) {
    resultHi[0] = tile[0].hi;
    resultLo[0] = tile[0].lo;
  }
}
`});var ue,se=U(()=>{ue=`// sscal: x = alpha * x

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
`});var fe,le=U(()=>{fe=`// sswap: x <-> y

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
`});var ce,me=U(()=>{ce=`// saxpy: y = alpha * x + y

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
`});var pe,de=U(()=>{pe=`// scopy: y = x

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
`});var ge,we=U(()=>{ge=`// sdot: result = sum(x[i] * y[i])
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
`});var he,be=U(()=>{he=`// sasum: result = sum(|x[i]|)
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
`});var ve,xe=U(()=>{ve=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var _e,ye=U(()=>{_e=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Ee,Be=U(()=>{Ee=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Ge,Ae=U(()=>{Ge=`// isamax: returns index of element with largest absolute value
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
`});var Ne,ke=U(()=>{Ne=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Pe,Se=U(()=>{Pe=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Ie,Me=U(()=>{Ie=`// ssymv: y = alpha * A * x + beta * y
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
`});var Le,De=U(()=>{Le=`// strmv: y = op(A) * x
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
`});var Re,Te=U(()=>{Re=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Ce,je=U(()=>{Ce=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var We,Fe=U(()=>{We=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var Ue,He=U(()=>{Ue=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var Ve,Oe=U(()=>{Ve=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
// f64add.wgsl's bit-exact IEEE-754 emulation. Doesn't touch that path.
//
// A double-double number is a pair (hi, lo) of f32 with hi+lo approximating
// a higher-precision value, hi holding the leading bits and lo the rounding
// error hi lost. ~48 bits of mantissa vs f32's 24, less than real f64's 52.
//
// No bindings, no entry point \u2014 a helper library, concatenated with a
// consumer's own bindings/entry point by getPipeline (WGSL has no #include).
// The DD struct lives here \u2014 abs.wgsl/add.wgsl/greater.wgsl/equal.wgsl all
// use it but don't redefine it (WGSL errors on duplicate struct definitions
// once concatenated), so any consumer using those must concatenate this
// file too, first.

struct DD {
  hi: f32,
  lo: f32,
}
`});var ze,Ke=U(()=>{ze=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Ye,qe=U(()=>{Ye=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// \u2500\u2500 A real compiler bug \u2014 read before touching anything below \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
//
// twoSum/fastTwoSum's error term \`e\` should be nonzero (that's the point \u2014
// \`s\` is rounded). A front-end-optimizer bug zeros it anyway, on both NVIDIA
// and Mesa (ANV + llvmpipe), via two different mechanisms needing two fixes:
// bitcast-based subtraction (\`fsub\`/\`negf\`, fixes NVIDIA) and materializing
// the sum through workgroup memory + workgroupBarrier() (fixes Mesa). Only
// both together (ddAddProtected) is verified correct everywhere \u2014 the plain
// twoSum/fastTwoSum/ddAdd below are reference-only, not safe to use.
fn negf(x: f32) -> f32 {
  return bitcast<f32>(bitcast<u32>(x) ^ 0x80000000u);
}
fn fsub(a: f32, b: f32) -> f32 {
  return a + negf(b);
}

// Knuth/M\xF8ller's TwoSum: s = fl(a+b), e = exact rounding error, a+b == s+e.
// Works for any a, b. UNPROTECTED \u2014 see header above.
fn twoSum(a: f32, b: f32) -> DD {
  let s = a + b;
  let v = s - a;
  let e = (a - (s - v)) + (b - v);
  return DD(s, e);
}

// Dekker's Fast-Two-Sum: same contract, but only correct when |a| >= |b|.
// UNPROTECTED \u2014 see header above.
fn fastTwoSum(a: f32, b: f32) -> DD {
  let s = a + b;
  let e = b - (s - a);
  return DD(s, e);
}

// Double-double addition (Dekker's Add2). UNPROTECTED \u2014 see header above.
fn ddAdd(a: DD, b: DD) -> DD {
  let s = twoSum(a.hi, b.hi);
  let loSum = a.lo + b.lo;
  return fastTwoSum(s.hi, s.lo + loSum);
}

// \u2500\u2500 Protected variants \u2014 use these \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
//
// Bitcast subtraction + workgroup-barrier materialization, verified correct
// on all three backends tested. Costs a real barrier: fine for O(1)-per-
// thread or O(log n) reduction use, not a long per-element loop. A
// workgroupBarrier() requires uniform control flow, so:
//   - \`threadSlot\` must be unique per concurrent caller (e.g. local_invocation_index).
//   - Every thread in the workgroup must call this the same number of times
//     \u2014 including ones whose result gets discarded. Compute unconditionally;
//     only the write-back should be conditional.
var<workgroup> dekkerScratch: array<f32, 64>;

fn twoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  dekkerScratch[threadSlot] = a + b;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let v = fsub(s, a);
  let e = fsub(a, fsub(s, v)) + fsub(b, v);
  return DD(s, e);
}

fn fastTwoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  dekkerScratch[threadSlot] = a + b;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let e = fsub(b, fsub(s, a));
  return DD(s, e);
}

// Protected double-double addition \u2014 same contract as ddAdd, but exact.
fn ddAddProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let s = twoSumProtected(a.hi, b.hi, threadSlot);
  let loSum = a.lo + b.lo;
  return fastTwoSumProtected(s.hi, s.lo + loSum, threadSlot);
}
`});var Qe,Xe=U(()=>{Qe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a > b for double-double pairs. hi dominates (|lo| <= ulp(hi)/2 always), so
// comparing hi alone is correct except on an exact hi tie, when lo breaks it.
// A plain comparison, not a rounding-identity subtraction \u2014 no reassociation
// risk, so unlike twoSum/fastTwoSum this needs no protection.
fn ddGreater(a: DD, b: DD) -> bool {
  if (a.hi != b.hi) {
    return a.hi > b.hi;
  }
  return a.lo > b.lo;
}
`});var $e,Ze=U(()=>{$e=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var rt,Je=U(()=>{rt=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
// see f64/utils/add.wgsl for ddAddProtected and why plain ddAdd isn't safe.
// GpuVector input isn't pre-abs'd, so ddAbs() (f64/utils/abs.wgsl) applies
// unconditionally below.

@group(0) @binding(0) var<storage, read>       xHi:        array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:        array<f32>;
@group(0) @binding(2) var<storage, read_write> partialsHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsLo: array<f32>;
@group(0) @binding(4) var<uniform>             params:     Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dasum_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = DD(0.0, 0.0);
  var acc1 = DD(0.0, 0.0);
  var acc2 = DD(0.0, 0.0);
  var acc3 = DD(0.0, 0.0);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  // Same trip count for every thread, but driven by a counter, not \`id\`
  // itself (ddAddProtected's barrier needs a provably-uniform loop bound).
  let mainIters = n4_floor / (4u * stride);
  for (var iter = 0u; iter < mainIters; iter++) {
    let id =  gid.x + iter * 4u * stride;
    let i0 =  id                * params.x_inc;
    let i1 = (id +      stride) * params.x_inc;
    let i2 = (id + 2u * stride) * params.x_inc;
    let i3 = (id + 3u * stride) * params.x_inc;
    acc0 = ddAddProtected(acc0, ddAbs(DD(xHi[i0], xLo[i0])), lid.x);
    acc1 = ddAddProtected(acc1, ddAbs(DD(xHi[i1], xLo[i1])), lid.x);
    acc2 = ddAddProtected(acc2, ddAbs(DD(xHi[i2], xLo[i2])), lid.x);
    acc3 = ddAddProtected(acc3, ddAbs(DD(xHi[i3], xLo[i3])), lid.x);
  }

  // Tail is ragged (0-3 extra per thread) \u2014 pad to this workgroup's worst case.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n4_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n4_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id    = n4_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let i     = select(0u, id * params.x_inc, valid);
    let loaded = ddAbs(DD(xHi[i], xLo[i])); // select() has no DD overload
    let contribution = DD(select(0.0, loaded.hi, valid), select(0.0, loaded.lo, valid));
    acc0 = ddAddProtected(acc0, contribution, lid.x);
  }

  let combined01 = ddAddProtected(acc0, acc1, lid.x);
  let combined23 = ddAddProtected(acc2, acc3, lid.x);
  tile[lid.x] = ddAddProtected(combined01, combined23, lid.x);
  workgroupBarrier();

  // Inactive threads combine against a throwaway partner and discard it
  // (ddAddProtected must be called unconditionally by every thread).
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(lid.x, lid.x + s, lid.x < s);
    let combined = ddAddProtected(tile[lid.x], tile[partner], lid.x);
    workgroupBarrier(); // all threads must read tile[] above before any write below
    if (lid.x < s) { tile[lid.x] = combined; }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsHi[wgid.x] = tile[0].hi;
    partialsLo[wgid.x] = tile[0].lo;
  }
}
`});var tt,et=U(()=>{tt=`// idamax: returns index of element with largest absolute value (f64, double-double)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/argmaxF64.wgsl.
// Concatenated after f64/dekker.wgsl (DD struct), f64/utils/abs.wgsl (ddAbs),
// f64/utils/greater.wgsl (ddGreater), and f64/utils/equal.wgsl (ddEqual).

@group(0) @binding(0) var<storage, read>       xHi:            array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:            array<f32>;
@group(0) @binding(2) var<storage, read_write> partialsValHi:  array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsValLo:  array<f32>;
@group(0) @binding(4) var<storage, read_write> partialsIdx:    array<u32>;
@group(0) @binding(5) var<uniform>             params:         Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile_val: array<DD, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn idamax_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  // DD(-1.0, 0.0) is a safe sentinel: any |x[i]| >= 0 beats it,
  // so workgroups with no elements lose gracefully in the epilogue.
  var best_val0 = DD(-1.0, 0.0); var best_idx0: u32 = 0u;
  var best_val1 = DD(-1.0, 0.0); var best_idx1: u32 = 0u;
  var best_val2 = DD(-1.0, 0.0); var best_idx2: u32 = 0u;
  var best_val3 = DD(-1.0, 0.0); var best_idx3: u32 = 0u;

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    let i0 =  id                * params.x_inc;
    let i1 = (id +      stride) * params.x_inc;
    let i2 = (id + 2u * stride) * params.x_inc;
    let i3 = (id + 3u * stride) * params.x_inc;
    let v0 = ddAbs(DD(xHi[i0], xLo[i0]));
    let v1 = ddAbs(DD(xHi[i1], xLo[i1]));
    let v2 = ddAbs(DD(xHi[i2], xLo[i2]));
    let v3 = ddAbs(DD(xHi[i3], xLo[i3]));
    if (ddGreater(v0, best_val0)) { best_val0 = v0; best_idx0 = id; }
    if (ddGreater(v1, best_val1)) { best_val1 = v1; best_idx1 = id +      stride; }
    if (ddGreater(v2, best_val2)) { best_val2 = v2; best_idx2 = id + 2u * stride; }
    if (ddGreater(v3, best_val3)) { best_val3 = v3; best_idx3 = id + 3u * stride; }
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    let i = id * params.x_inc;
    let v = ddAbs(DD(xHi[i], xLo[i]));
    if (ddGreater(v, best_val0)) { best_val0 = v; best_idx0 = id; }
  }

  // merge 4 independent lanes; prefer lower index on tie (first occurrence wins)
  if (ddGreater(best_val1, best_val0) ||
      (ddEqual(best_val1, best_val0) && best_idx1 < best_idx0)) {
    best_val0 = best_val1; best_idx0 = best_idx1;
  }
  if (ddGreater(best_val2, best_val0) ||
      (ddEqual(best_val2, best_val0) && best_idx2 < best_idx0)) {
    best_val0 = best_val2; best_idx0 = best_idx2;
  }
  if (ddGreater(best_val3, best_val0) ||
      (ddEqual(best_val3, best_val0) && best_idx3 < best_idx0)) {
    best_val0 = best_val3; best_idx0 = best_idx3;
  }

  tile_val[lid.x] = best_val0;
  tile_idx[lid.x] = best_idx0;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      let a_val = tile_val[lid.x];
      let b_val = tile_val[lid.x + s];
      if (ddGreater(b_val, a_val) ||
          (ddEqual(b_val, a_val) && tile_idx[lid.x + s] < tile_idx[lid.x])) {
        tile_val[lid.x] = b_val;
        tile_idx[lid.x] = tile_idx[lid.x + s];
      }
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsValHi[wgid.x] = tile_val[0].hi;
    partialsValLo[wgid.x] = tile_val[0].lo;
    partialsIdx[wgid.x]   = tile_idx[0];
  }
}
`});var at,ot=U(()=>{at=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var nt,it=U(()=>{nt=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var ut,st=U(()=>{ut=`// strsv_update: subtracts a solved block's contribution from every
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
`});var ft,lt=U(()=>{ft=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_large.wgsl).
// BM=BN=32, BK=8, TM=TN=2 \u2014 wins over the large tile below a 6x6=36
// workgroup grid of 64-tiles, where the large tile doesn't have enough
// workgroups to fill the GPU. Same structure as sgemm_large.wgsl (2D
// register-blocked, shared-memory-tiled), just smaller.
//
// col mapped to gid.x for coalesced B/C access (row-major: col contiguous).

const BM: u32 = 32u;
const BN: u32 = 32u;
const BK: u32 = 8u;
const TM: u32 = 2u;
const TN: u32 = 2u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 256
const STRIDE_A: u32 = NUM_THREADS / BK;
const STRIDE_B: u32 = NUM_THREADS / BN;

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
      let gRowA = blockRow + innerRowA + loadOffset;
      let gColA = t * BK + innerColA;
      let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
      As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
    }
    for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
      let gRowB = t * BK + innerRowB + loadOffset;
      let gColB = blockCol + innerColB;
      let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
      Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        if (col < params.n) {
          let cIdx = row * params.ldc + col;
          C[cIdx] = params.alpha * threadResults[resIdxM * TN + resIdxN] + params.beta * C[cIdx];
        }
      }
    }
  }
}
`});var ct,mt=U(()=>{ct=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_small.wgsl).
// BM=BN=64, BK=8, TM=8, TN=4 (128 threads/workgroup) \u2014 the kernel 9
// autotuning winner (temp/autotune_sweep.mjs, temp/gen_sweep_kernel.mjs,
// swept BM/BN/BK/TM/TN and warp-tiled variants), +69% over the old BM=32
// single-tier baseline at n=512, +84% at n=1024. But BM=64 loses to BM=32
// below a 6x6=36 workgroup grid (not enough workgroups to fill the GPU at
// that tile size), hence the two-tier split rather than one global config.
// Neither vectorized loads (kernel 6) nor warp-tiling (kernel 10) beat this
// at the sizes tried, including warp-tiled variants in the same sweep at
// BM=64/128.

const BM: u32 = 64u;
const BN: u32 = 64u;
const BK: u32 = 8u;
const TM: u32 = 8u;
const TN: u32 = 4u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 128
const STRIDE_A: u32 = NUM_THREADS / BK; // rows of As covered per load-loop step
const STRIDE_B: u32 = NUM_THREADS / BN; // rows of Bs covered per load-loop step

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  // Load indices, independent of the compute thread shape \u2014 a loop since
  // NUM_THREADS doesn't match the tile size 1:1 at this config.
  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
      let gRowA = blockRow + innerRowA + loadOffset;
      let gColA = t * BK + innerColA;
      let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
      As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
    }
    for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
      let gRowB = t * BK + innerRowB + loadOffset;
      let gColB = blockCol + innerColB;
      let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
      Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        if (col < params.n) {
          let cIdx = row * params.ldc + col;
          C[cIdx] = params.alpha * threadResults[resIdxM * TN + resIdxN] + params.beta * C[cIdx];
        }
      }
    }
  }
}
`});var pt,dt=U(()=>{pt=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
// half of a two-tier dispatch, identical to sgemm_small.wgsl except the
// final output write is gated to one triangle of C by \`uplo\` \u2014 see
// sgemmtr_large.wgsl for the full rationale (shared by both tiers).

const BM: u32 = 32u;
const BN: u32 = 32u;
const BK: u32 = 8u;
const TM: u32 = 2u;
const TN: u32 = 2u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 256
const STRIDE_A: u32 = NUM_THREADS / BK;
const STRIDE_B: u32 = NUM_THREADS / BN;

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
  uplo:   u32, // 0 = lower (col <= row), 1 = upper (col >= row)
}

@group(0) @binding(3) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
      let gRowA = blockRow + innerRowA + loadOffset;
      let gColA = t * BK + innerColA;
      let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
      As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
    }
    for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
      let gRowB = t * BK + innerRowB + loadOffset;
      let gColB = blockCol + innerColB;
      let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
      Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        let inTriangle = select(col >= row, col <= row, params.uplo == 0u);
        if (col < params.n && inTriangle) {
          let cIdx = row * params.ldc + col;
          C[cIdx] = params.alpha * threadResults[resIdxM * TN + resIdxN] + params.beta * C[cIdx];
        }
      }
    }
  }
}
`});var gt,wt=U(()=>{gt=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
// half of a two-tier dispatch, identical to sgemm_large.wgsl (see that file
// for the BM/BN/BK/TM/TN autotuning rationale) except the final output write
// is gated to one triangle of C by \`uplo\`, the same convention ssyr/ssyr2
// use (0 = lower: col <= row, 1 = upper: col >= row). Every other element of
// C \u2014 including inside the compute loop, where the full tile is still
// computed regardless of uplo, only the write is masked \u2014 is left untouched.
// gemmtr's uplo(C) test is a plain row/col comparison over the full m\xD7n
// grid, well-defined even when m != n (not restricted to square C).

const BM: u32 = 64u;
const BN: u32 = 64u;
const BK: u32 = 8u;
const TM: u32 = 8u;
const TN: u32 = 4u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 128
const STRIDE_A: u32 = NUM_THREADS / BK; // rows of As covered per load-loop step
const STRIDE_B: u32 = NUM_THREADS / BN; // rows of Bs covered per load-loop step

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
  uplo:   u32, // 0 = lower (col <= row), 1 = upper (col >= row)
}

@group(0) @binding(3) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  // Load indices, independent of the compute thread shape \u2014 a loop since
  // NUM_THREADS doesn't match the tile size 1:1 at this config.
  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
      let gRowA = blockRow + innerRowA + loadOffset;
      let gColA = t * BK + innerColA;
      let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
      As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
    }
    for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
      let gRowB = t * BK + innerRowB + loadOffset;
      let gColB = blockCol + innerColB;
      let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
      Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        let inTriangle = select(col >= row, col <= row, params.uplo == 0u);
        if (col < params.n && inTriangle) {
          let cIdx = row * params.ldc + col;
          C[cIdx] = params.alpha * threadResults[resIdxM * TN + resIdxN] + params.beta * C[cIdx];
        }
      }
    }
  }
}
`});var ht,bt=U(()=>{ht=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
// with only its \`uplo\` triangle meaningful (the other triangle is implied
// by symmetry: A[i,j] = A[j,i]). A plain element-wise pass, no tiling or
// shared memory needed \u2014 used to materialize a dense operand for routines
// that read a symmetric matrix as a normal dense gemm input (e.g. ssymm),
// rather than teaching the tiled gemm kernel itself to mirror-read.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> Adense: array<f32>;

struct Params {
  n:    u32,
  lda:  u32,
  ldd:  u32, // leading dimension of Adense
  uplo: u32, // 0 = lower (stored where col <= row), 1 = upper (col >= row)
}

@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.y;
  let col = gid.x;
  if (row >= params.n || col >= params.n) {
    return;
  }

  let isStored = select(col >= row, col <= row, params.uplo == 0u);
  let srcIdx = select(col * params.lda + row, row * params.lda + col, isStored);
  Adense[row * params.ldd + col] = A[srcIdx];
}
`});var vt,xt=U(()=>{vt=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
// zero-filling the unstored triangle (exact for a matmul) so strmm can reuse
// sgemm's kernel unchanged. \`diag=1\` substitutes 1.0 on the diagonal.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> Adense: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  ldd:   u32, // leading dimension of Adense
  uplo:  u32, // 0 = lower, 1 = upper
  trans: u32, // 0 = no-transpose (op(A) = A), 1 = transpose (op(A) = A^T)
  diag:  u32, // 0 = non-unit, 1 = unit
}

@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.y;
  let col = gid.x;
  if (row >= params.n || col >= params.n) {
    return;
  }

  if (row == col) {
    Adense[row * params.ldd + col] = select(A[row * params.lda + row], 1.0, params.diag == 1u);
    return;
  }

  var isMeaningful: bool;
  var srcRow: u32;
  var srcCol: u32;
  if (params.trans == 0u) {
    isMeaningful = select(col >= row, col <= row, params.uplo == 0u);
    srcRow = row; srcCol = col;
  } else {
    isMeaningful = select(col <= row, col >= row, params.uplo == 0u);
    srcRow = col; srcCol = row;
  }

  Adense[row * params.ldd + col] = select(0.0, A[srcRow * params.lda + srcCol], isMeaningful);
}
`});var yt={};Hr(yt,{shaderSources:()=>Yo});var Yo,_t=U(()=>{Jr();ee();oe();ie();se();le();me();de();we();be();xe();ye();Be();Ae();ke();Se();Me();De();Te();je();Fe();He();Oe();Ke();qe();Xe();Ze();Je();et();ot();it();st();lt();mt();dt();wt();bt();xt();Yo={"reduction/argmax":re,"reduction/argmaxF64":te,"reduction/sum":ae,"reduction/sumF64":ne,sscal:ue,sswap:fe,saxpy:ce,scopy:pe,sdot:ge,sasum:he,snrm2:ve,srot:_e,srotm:Ee,isamax:Ge,sgemv_n:Ne,sgemv_t:Pe,ssymv:Ie,strmv:Le,sger:Re,ssyr:Ce,ssyr2:We,f64add:Ue,"f64/dekker":Ve,"f64/utils/abs":ze,"f64/utils/add":Ye,"f64/utils/greater":Qe,"f64/utils/equal":$e,dasum:rt,idamax:tt,strsv_invert_block:at,strsv_apply_inverse:nt,strsv_update:ut,sgemm_small:ft,sgemm_large:ct,sgemmtr_small:pt,sgemmtr_large:gt,symmetrize:ht,triangularize:vt}});var Sa={};Hr(Sa,{GpuMatrix:()=>H,GpuVector:()=>P,cleanup:()=>Yr,dasum:()=>It,gpuName:()=>Xr,idamax:()=>Rt,init:()=>qr,isamax:()=>Tt,randomFloat32Array:()=>Qr,randomFloat64Array:()=>Zr,randomTriangularFloat32Array:()=>$r,sasum:()=>Mt,saxpy:()=>Gt,scopy:()=>kt,sdot:()=>St,sgemm:()=>Yt,sgemmtr:()=>Xt,sgemv:()=>Ft,sger:()=>Kt,snrm2:()=>Lt,srot:()=>jt,srotm:()=>Ct,sscal:()=>Et,sswap:()=>At,ssymm:()=>Jt,ssymv:()=>Wt,ssyr:()=>zt,ssyr2:()=>qt,ssyr2k:()=>Zt,ssyrk:()=>Qt,strmm:()=>eo,strmv:()=>Ht,strsv:()=>Vt});function Or(a,t){return t?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Vr(){if(!Kr())return{querySet:null,passDescriptor:void 0};let t=or().createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function wr(a,t){if(!t)return null;let r=or(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(t,0,2,o,0);let e=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,e,0,16),{tsReadBuffer:e,resolveBuffer:o,querySet:t}}async function S(a){if(!a)return;let{tsReadBuffer:t,resolveBuffer:r,querySet:o}=a;await t.mapAsync(GPUMapMode.READ);let e=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(e[1]-e[0]))/1e6}var hr=null,Gr=null,zr=null,Rr=!1;async function qr({powerPreference:a="high-performance",benchmark:t=!1,dumpShaders:r=!1}={}){if(hr)return hr;let o;if(typeof window>"u"){let{create:n,globals:l}=await import("webgpu");Object.assign(globalThis,l),o=n(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),zr=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(Gr=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!Gr)throw new Error("No WebGPU adapter found.");Rr=t;let i=[...Or(Gr,t).requiredFeatures??[]];return hr=await Gr.requestDevice({requiredFeatures:i}),hr.addEventListener("uncapturederror",n=>{console.error("Uncaptured GPU error:",n.error.message)}),hr}function Yr(){hr&&(hr.destroy(),hr=null),Gr=null,zr=null,Rr=!1}function Xr(){if(!Gr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:t}=Gr.info;return{description:t||"unknown",device:a||"unknown"}}function Kr(){return Rr}function or(){if(!hr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return hr}function d(...a){a.flat().forEach(t=>t.destroy())}function x(a,t="blas-input",r=!1){let o=or(),e=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>e)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${e} bytes.`);let n=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=o.createBuffer({label:t,size:i,usage:n,mappedAtCreation:!0}),s=a.constructor;return new s(l.getMappedRange()).set(a),l.unmap(),l}function rr(a,t="blas-storage",r=0){return or().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|r})}function dr(a,t="blas-result"){return or().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function G(a,t){let o=or().createBuffer({label:"blas-readback",size:t.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(t,0,o,0,t.size),o}function D(a,t="blas-params"){let r=or(),o=a.length*4,e=Math.ceil(o/16)*16,i=new ArrayBuffer(e),n=new DataView(i);a.forEach(({value:s,type:u},f)=>{let m=f*4;if(u==="u32")n.setUint32(m,s,!0);else if(u==="i32")n.setInt32(m,s,!0);else if(u==="f32")n.setFloat32(m,s,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:t,size:e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function E(a,t=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new t(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function Er(a){let t=a.length,r=new Float32Array(t),o=new Float32Array(t);for(let e=0;e<t;e++){let i=Math.fround(a[e]);r[e]=i,o[e]=Math.fround(a[e]-i)}return{hi:r,lo:o}}function Nr(a,t){let r=a.length,o=new Float64Array(r);for(let e=0;e<r;e++)o[e]=a[e]+t[e];return o}var P=class a{constructor(t,r,o=Float32Array,e=null){this._buf=t,this._loBuf=e,this.length=r,this.dtype=o}static from(t){if(t instanceof Float64Array){let{hi:o,lo:e}=Er(t),i=x(o,"gpu-vector-f64-hi",!0),n=x(e,"gpu-vector-f64-lo",!0);return new a(i,t.length,Float64Array,n)}if(!(t instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=x(t,"gpu-vector",!0);return new a(r,t.length,t.constructor)}async read(){let t=or(),r=t.createCommandEncoder(),o=G(r,this._buf);if(t.queue.submit([r.finish()]),!this._loBuf)return E(o,this.dtype);let e=t.createCommandEncoder(),i=G(e,this._loBuf);t.queue.submit([e.finish()]);let[n,l]=await Promise.all([E(o,Float32Array),E(i,Float32Array)]);return Nr(n,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var H=class a{constructor(t,r,o,e,i=null,n="row-major"){this._buf=t,this._loBuf=i,this.rows=r,this.cols=o,this.lda=e,this.layout=n}static from(t,r,o,e,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let n=i==="row-major";if(e===void 0&&(e=n?o:r),!(t instanceof Float32Array)&&!(t instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let l=n?o:r;if(!Number.isInteger(e)||e<l)throw new Error(`lda must be an integer >= ${n?"cols":"rows"}.`);let s=n?r:o;if(t.length<s*e)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(t instanceof Float64Array){let f=s*e,{hi:m,lo:p}=Er(t.subarray(0,f)),c=x(m,"gpu-matrix-f64-hi",!0),w=x(p,"gpu-matrix-f64-lo",!0);return new a(c,r,o,e,w,i)}let u=x(t.subarray(0,s*e),"gpu-matrix",!0);return new a(u,r,o,e,null,i)}async read(){let t=or(),r=t.createCommandEncoder(),o=G(r,this._buf);t.queue.submit([r.finish()]);let e=this.layout!=="column-major",i=e?this.rows:this.cols,n=e?this.cols:this.rows;if(this._loBuf){let u=t.createCommandEncoder(),f=G(u,this._loBuf);t.queue.submit([u.finish()]);let[m,p]=await Promise.all([E(o,Float32Array),E(f,Float32Array)]),c=Nr(m,p);if(this.lda===n)return c;let w=new Float64Array(i*n);for(let g=0;g<i;g++)w.set(c.subarray(g*this.lda,g*this.lda+n),g*n);return w}let l=await E(o,Float32Array);if(this.lda===n)return l;let s=new Float32Array(i*n);for(let u=0;u<i;u++)s.set(l.subarray(u*this.lda,u*this.lda+n),u*n);return s}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Qr(a,t=-1,r=1){let o=new Float32Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function Zr(a,t=-1,r=1){let o=new Float64Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function $r(a,t,r="lower",o=-1,e=1,i=5,n=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(t<a)throw new Error("lda must be >= n.");let l=new Float32Array(a*t);for(let s=0;s<a;s++){for(let u=0;u<a;u++){if(s===u)continue;(r==="lower"?u<s:u>s)&&(l[s*t+u]=o+Math.random()*(e-o))}l[s*t+s]=i+Math.random()*(n-i)}return l}function A(a,t,r=0){let o=or(),e=t.map((i,n)=>({binding:r+n,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:e})}var uo=new WeakMap;function M(a){or().queue.submit([a.finish()])}function gr(){let a=or(),{querySet:t,passDescriptor:r}=Vr();return{commandEncoder:a.createCommandEncoder(),querySet:t,passDescriptor:r}}function ur(a,t,r,o,e){let i=a.beginComputePass(e);i.setPipeline(t),i.setBindGroup(0,r),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y,o.z??1),i.end(),uo.set(a,i)}function R(a,t,r){let{commandEncoder:o,querySet:e,passDescriptor:i}=gr();ur(o,a,t,r,i);let n=wr(o,e);return{commandEncoder:o,ts:n}}var Zo={},jr=new WeakMap;async function k(a,t,r="main"){jr.has(a)||jr.set(a,new Map);let o=jr.get(a),e=Array.isArray(t)?t:[t],i=`${e.join("+")}::${r}`;return o.has(i)||o.set(i,await Qo(e,r)),o.get(i)}async function Xo(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(_t(),yt)),r=t[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:e}=await import("path"),i=o(r(Zo.url));return t(e(i,`../shaders/${a}.wgsl`),"utf8")}}async function Qo(a,t="main"){let r=or(),o=a.join("+"),e=(await Promise.all(a.map(Xo))).join(`
`),i=r.createShaderModule({label:o,code:e}),l=(await i.getCompilationInfo()).messages.filter(f=>f.type==="error");if(l.length>0)throw new Error(`Shader "${o}" compilation failed:
${l.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let s=t==="main"?{module:i}:{module:i,entryPoint:t},u=r.createComputePipeline({label:o,layout:"auto",compute:s});return u._shaderModule=i,u}var $o=64,Bt=8;function mr(a,t){let r=or().limits.maxComputeWorkgroupsPerDimension;return t===void 0?Math.min(Math.ceil(a/$o),r):{x:Math.min(Math.ceil(t/Bt),r),y:Math.min(Math.ceil(a/Bt),r)}}async function Et(a,t,r,o,e){let i=o instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof P))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return i?{}:o;if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await k(a,"sscal"),l=null,s=null,u=null;try{l=i?o._buf:x(o,"sscal-x",!0),s=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"}],"sscal-params");let f=A(n.getBindGroupLayout(0),[l,s]),{commandEncoder:m,ts:p}=R(n,f,mr(t));u=i?null:G(m,l),M(m);let c=await S(p);if(i)return c!==void 0?{gpuTimeMs:c}:{};let w=await E(u,Float32Array);return u=null,c!==void 0?{x:w,gpuTimeMs:c}:w}finally{!i&&l&&d(l),s&&d(s),u&&d(u)}}async function At(a,t,r,o,e,i){let n=r instanceof P,l=e instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof P))throw new Error("x must be a Float32Array or GpuVector.");if(!(e instanceof Float32Array)&&!(e instanceof P))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==e.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await k(a,"sswap"),u=null,f=null,m=null,p=null,c=null;try{u=n?r._buf:x(r,"sswap-x",!0),f=l?e._buf:x(e,"sswap-y",!0),m=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let w=A(s.getBindGroupLayout(0),[u,f,m]),{commandEncoder:g,ts:b}=R(s,w,mr(t));p=n?null:G(g,u),c=l?null:G(g,f),M(g);let h=await S(b);if(n&&l)return h!==void 0?{gpuTimeMs:h}:{};let v=await E(p,Float32Array);p=null;let y=await E(c,Float32Array);return c=null,h!==void 0?{x:v,y,gpuTimeMs:h}:{x:v,y}}finally{!n&&u&&d(u),!l&&f&&d(f),m&&d(m),p&&d(p),c&&d(c)}}async function Gt(a,t,r,o,e,i,n){let l=o instanceof P,s=i instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0||n<=0)throw new Error("incx and incy must be positive.");if(!l&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return s?{}:{y:i};if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(t-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"saxpy"),f=null,m=null,p=null,c=null;try{f=l?o._buf:x(o,"saxpy-x",!1),m=s?i._buf:x(i,"saxpy-y",!0),p=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"},{value:n,type:"u32"}],"saxpy-params");let w=A(u.getBindGroupLayout(0),[f,m,p]),{commandEncoder:g,ts:b}=R(u,w,mr(t));c=s?null:G(g,m),M(g);let h=await S(b);if(s&&l)return h!==void 0?{gpuTimeMs:h}:{};let v=await E(c,Float32Array);return c=null,h!==void 0?{y:v,gpuTimeMs:h}:{y:v}}finally{!l&&f&&d(f),!s&&m&&d(m),p&&d(p),c&&d(c)}}async function kt(a,t,r,o,e,i){let n=r instanceof P,l=e instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return l?{}:{y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await k(a,"scopy"),u=null,f=null,m=null,p=null;try{u=n?r._buf:x(r,"scopy-x",!1),f=l?e._buf:x(e,"scopy-y",!0),m=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let c=A(s.getBindGroupLayout(0),[u,f,m]),{commandEncoder:w,ts:g}=R(s,c,mr(t));p=l?null:G(w,f),M(w);let b=await S(g);if(l&&n)return b!==void 0?{gpuTimeMs:b}:{};let h=await E(p,Float32Array);return p=null,b!==void 0?{y:h,gpuTimeMs:b}:{y:h}}finally{!n&&u&&d(u),!l&&f&&d(f),m&&d(m),p&&d(p)}}var Nt=64;async function St(a,t,r,o,e,i){let n=r instanceof P,l=e instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await k(a,"sdot"),u=await k(a,"reduction/sum"),f=null,m=null,p=null,c=null,w=null,g=null;try{f=n?r._buf:x(r,"sdot-x",!1),m=l?e._buf:x(e,"sdot-y",!1),p=rr(2*Nt*4,"sdot-partials"),c=dr(4,"sdot-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let b=A(s.getBindGroupLayout(0),[f,m,p,w]),{commandEncoder:h,ts:v}=R(s,b,2*Nt);M(h);let y=A(u.getBindGroupLayout(0),[p,c]),{commandEncoder:_,ts:B}=R(u,y,1);g=G(_,c),M(_);let N=E(g,Float32Array);g=null;let[I,j,L]=await Promise.all([S(v),S(B),N]);return I!==void 0&&j!==void 0?{dot:L[0],gpuTimeMs:I+j}:{dot:L[0]}}finally{!n&&f&&d(f),!l&&m&&d(m),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}var Pt=64;async function Mt(a,t,r,o){let e=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"sasum"),n=await k(a,"reduction/sum"),l=null,s=null,u=null,f=null,m=null;try{l=e?r._buf:x(r,"sasum-x",!1),s=rr(2*Pt*4,"sasum-partials"),u=dr(4,"sasum-result"),f=D([{value:t,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=A(i.getBindGroupLayout(0),[l,s,f]),{commandEncoder:c,ts:w}=R(i,p,2*Pt);M(c);let g=A(n.getBindGroupLayout(0),[s,u]),{commandEncoder:b,ts:h}=R(n,g,1);m=G(b,u),M(b);let v=E(m,Float32Array);m=null;let[y,_,B]=await Promise.all([S(w),S(h),v]);return y!==void 0&&_!==void 0?{asum:B[0],gpuTimeMs:y+_}:{asum:B[0]}}finally{!e&&l&&d(l),s&&d(s),u&&d(u),f&&d(f),m&&d(m)}}var Cr=64;async function It(a,t,r,o){let e=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],n=await k(a,[...i,"dasum"]),l=await k(a,[...i,"reduction/sumF64"]),s=null,u=null,f=null,m=null,p=null,c=null,w=null,g=null,b=null;try{if(e)s=r._buf,u=r._loBuf;else{let{hi:q,lo:W}=Er(r.map(Math.abs));s=x(q,"dasum-xHi",!1),u=x(W,"dasum-xLo",!1)}f=rr(2*Cr*4,"dasum-partialsHi"),m=rr(2*Cr*4,"dasum-partialsLo"),p=dr(4,"dasum-result-hi"),c=dr(4,"dasum-result-lo"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"dasum-params");let h=A(n.getBindGroupLayout(0),[s,u,f,m,w]),{commandEncoder:v,ts:y}=R(n,h,2*Cr);M(v);let _=A(l.getBindGroupLayout(0),[f,m,p,c]),{commandEncoder:B,ts:N}=R(l,_,1);g=G(B,p),b=G(B,c),M(B);let I=E(g,Float32Array),j=E(b,Float32Array);g=null,b=null;let[L,T,C,F]=await Promise.all([S(y),S(N),I,j]),O=Nr(C,F)[0];return L!==void 0&&T!==void 0?{asum:O,gpuTimeMs:L+T}:{asum:O}}finally{!e&&s&&d(s),!e&&u&&d(u),f&&d(f),m&&d(m),p&&d(p),c&&d(c),w&&d(w),g&&d(g),b&&d(b)}}var Dt=64;async function Lt(a,t,r,o){let e=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"snrm2"),n=await k(a,"reduction/sum"),l=null,s=null,u=null,f=null,m=null;try{l=e?r._buf:x(r,"snrm2-x",!1),s=rr(2*Dt*4,"snrm2-partials"),u=dr(4,"snrm2-result"),f=D([{value:t,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let p=A(i.getBindGroupLayout(0),[l,s,f]),{commandEncoder:c,ts:w}=R(i,p,2*Dt);M(c);let g=A(n.getBindGroupLayout(0),[s,u]),{commandEncoder:b,ts:h}=R(n,g,1);m=G(b,u),M(b);let v=E(m,Float32Array);m=null;let[y,_,B]=await Promise.all([S(w),S(h),v]),N=Math.sqrt(B[0]);return y!==void 0&&_!==void 0?{nrm2:N,gpuTimeMs:y+_}:{nrm2:N}}finally{!e&&l&&d(l),s&&d(s),u&&d(u),f&&d(f),m&&d(m)}}var Fr=64;async function Tt(a,t,r,o){let e=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"isamax"),n=await k(a,"reduction/argmax"),l=null,s=null,u=null,f=null,m=null,p=null;try{l=e?r._buf:x(r,"isamax-x",!1),s=rr(2*Fr*4,"isamax-partials-val"),u=rr(2*Fr*4,"isamax-partials-idx"),f=dr(4,"isamax-result"),m=D([{value:t,type:"u32"},{value:o,type:"u32"}],"isamax-params");let c=A(i.getBindGroupLayout(0),[l,s,u,m]),{commandEncoder:w,ts:g}=R(i,c,2*Fr);M(w);let b=A(n.getBindGroupLayout(0),[s,u,f]),{commandEncoder:h,ts:v}=R(n,b,1);p=G(h,f),M(h);let y=E(p,Uint32Array);p=null;let[_,B,N]=await Promise.all([S(g),S(v),y]),I=N[0];return _!==void 0&&B!==void 0?{index:I,gpuTimeMs:_+B}:{index:I}}finally{!e&&l&&d(l),s&&d(s),u&&d(u),f&&d(f),m&&d(m),p&&d(p)}}var Tr=64;async function Rt(a,t,r,o){let e=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],n=await k(a,[...i,"idamax"],"idamax_main"),l=await k(a,[...i,"reduction/argmaxF64"],"reduce_f64"),s=null,u=null,f=null,m=null,p=null,c=null,w=null,g=null;try{if(e)s=r._buf,u=r._loBuf;else{let{hi:C,lo:F}=Er(r);s=x(C,"idamax-xHi",!1),u=x(F,"idamax-xLo",!1)}f=rr(2*Tr*4,"idamax-partials-val-hi"),m=rr(2*Tr*4,"idamax-partials-val-lo"),p=rr(2*Tr*4,"idamax-partials-idx"),c=dr(4,"idamax-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"idamax-params");let b=A(n.getBindGroupLayout(0),[s,u,f,m,p,w]),{commandEncoder:h,ts:v}=R(n,b,2*Tr);M(h);let y=A(l.getBindGroupLayout(0),[f,m,p,c]),{commandEncoder:_,ts:B}=R(l,y,1);g=G(_,c),M(_);let N=E(g,Uint32Array);g=null;let[I,j,L]=await Promise.all([S(v),S(B),N]),T=L[0];return I!==void 0&&j!==void 0?{index:T,gpuTimeMs:I+j}:{index:T}}finally{!e&&s&&d(s),!e&&u&&d(u),f&&d(f),m&&d(m),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function jt(a,t,r,o,e,i,n,l){let s=r instanceof P,u=e instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof n!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(n)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(n))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return s?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await k(a,"srot"),m=null,p=null,c=null,w=null,g=null;try{m=s?r._buf:x(r,"srot-x",!0),p=u?e._buf:x(e,"srot-y",!0),c=D([{value:t,type:"u32"},{value:n,type:"f32"},{value:l,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let b=A(f.getBindGroupLayout(0),[m,p,c]),{commandEncoder:h,ts:v}=R(f,b,mr(t));w=s?null:G(h,m),g=u?null:G(h,p),M(h);let y=await S(v);if(s&&u)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,I]=await Promise.all([_,B]);return y!==void 0?{x:N,y:I,gpuTimeMs:y}:{x:N,y:I}}finally{!s&&m&&d(m),!u&&p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function Ct(a,t,r,o,e,i,n){let l=r instanceof P,s=e instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(n instanceof Float32Array)||n.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||n[0]===-2)return l?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"srotm"),f=null,m=null,p=null,c=null,w=null,g=null;try{f=l?r._buf:x(r,"srotm-x",!0),m=s?e._buf:x(e,"srotm-y",!0),p=x(n,"srotm-param",!1),c=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let b=A(u.getBindGroupLayout(0),[f,m,p,c]),{commandEncoder:h,ts:v}=R(u,b,mr(t));w=l?null:G(h,f),g=s?null:G(h,m),M(h);let y=await S(v);if(l&&s)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,I]=await Promise.all([_,B]);return y!==void 0?{x:N,y:I,gpuTimeMs:y}:{x:N,y:I}}finally{!l&&f&&d(f),!s&&m&&d(m),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function Ft(a,t,r,o,e,i,n,l,s,u,f,m,p="row-major"){let c=i instanceof H,w=l instanceof P,g=f instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(n))throw new Error("m, n, incx, incy, and lda must be integers.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&l._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&n!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:f};(c?i.layout:p)==="column-major"&&([r,o]=[o,r],t=t==="no-transpose"?"transpose":"no-transpose");let h=t==="no-transpose",v=h?o:r,y=h?r:o;if(n<o)throw new Error("lda must be >= n.");if(!c&&i.length<(r-1)*n+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(v-1)*s+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(y-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let B=await k(a,h?"sgemv_n":"sgemv_t"),N=c?i._buf:x(i,"sgemv-A",!1),I=w?l._buf:x(l,"sgemv-x",!1),j=g?f._buf:x(f,"sgemv-y",!0),L=D([{value:r,type:"u32"},{value:o,type:"u32"},{value:e,type:"f32"},{value:u,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:n,type:"u32"}],"sgemv-params");try{let T=A(B.getBindGroupLayout(0),[N,I,j,L]),C=h?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):mr(y),{commandEncoder:F,ts:O}=R(B,T,C),q=g?null:G(F,j);M(F);let W=await S(O);if(g)return W!==void 0?{gpuTimeMs:W}:{};let Z=await E(q,Float32Array);return W!==void 0?{y:Z,gpuTimeMs:W}:{y:Z}}finally{c||d(N),w||d(I),g||d(j),d(L)}}async function Wt(a,t,r,o,e,i,n,l,s,u,f,m="row-major"){let p=n instanceof P,c=u instanceof P,w=e instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof s!="number")throw new Error("beta must be a number.");if(Number.isNaN(s))throw new Error("beta must not be NaN.");if(!Number.isFinite(s))throw new Error("beta must be finite.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!w&&!(e instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&n._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&i!==e.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(e.rows<r||e.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{y:u};if(!w&&e.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?e.layout:m)==="column-major"?t==="upper":t==="lower",h=await k(a,"ssymv"),v=null,y=null,_=null,B=null;try{v=w?e._buf:x(e,"ssymv-A",!1),y=p?n._buf:x(n,"ssymv-x",!1),_=c?u._buf:x(u,"ssymv-y",!0),B=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:s,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:b?0:1,type:"u32"}],"ssymv-params");let N=A(h.getBindGroupLayout(0),[v,y,_,B]),I=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:L}=R(h,N,I),T=c?null:G(j,_);M(j);let C=await S(L);if(c)return C!==void 0?{gpuTimeMs:C}:{};let F=await E(T,Float32Array);return C!==void 0?{y:F,gpuTimeMs:C}:{y:F}}finally{!w&&v&&d(v),!p&&y&&d(y),!c&&_&&d(_),B&&d(B)}}async function Ht(a,t,r,o,e,i,n,l,s,u,f,m="row-major"){let p=l instanceof P,c=u instanceof P,w=i instanceof H,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(f)||!Number.isInteger(n))throw new Error("n, incx, incy, and lda must be integers.");if(s<=0||f<=0)throw new Error("incx and incy must be positive.");if(n<e)throw new Error("lda must be >= n.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&c&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&n!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{y:u};if(!w&&i.length<(e-1)*n+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?i.layout:m)==="column-major",v=h?t==="upper":t==="lower",y=h?r==="transpose":r==="no-transpose",_=await k(a,"strmv"),B=null,N=null,I=null,j=null;try{B=w?i._buf:x(i,"strmv-A",!1),N=p?l._buf:x(l,"strmv-x",!1),I=c?u._buf:x(u,"strmv-y",!0),j=D([{value:e,type:"u32"},{value:s,type:"u32"},{value:f,type:"u32"},{value:n,type:"u32"},{value:y?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let L=A(_.getBindGroupLayout(0),[B,N,I,j]),T=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:C,ts:F}=R(_,L,T),O=c?null:G(C,I);M(C);let q=await S(F);if(c)return q!==void 0?{gpuTimeMs:q}:{};let W=await E(O,Float32Array);return q!==void 0?{y:W,gpuTimeMs:q}:{y:W}}finally{!w&&B&&d(B),!p&&N&&d(N),!c&&I&&d(I),j&&d(j)}}var xr=64;function Ut(a,t,r){let o=new ArrayBuffer(a*t),e=new DataView(o);for(let i=0;i<a;i++){let n=r(i),l=i*t;n.forEach((s,u)=>e.setUint32(l+u*4,s,!0))}return o}function Ot(a,t,r){let o=a.createBuffer({label:r,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,t),o}async function Vt(a,t,r,o,e,i,n,l,s,u="row-major"){let f=l instanceof P,m=i instanceof H,p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(n))throw new Error("n, incx, and lda must be integers.");if(s<=0)throw new Error("incx must be positive.");if(n<e)throw new Error("lda must be >= n.");if(!m&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!f)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&n!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return f?{}:{x:l};if(!m&&i.length<(e-1)*n+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(m?i.layout:u)==="column-major",g=w?t==="upper":t==="lower",b=w?r==="transpose":r==="no-transpose",h=await k(a,"strsv_invert_block"),v=await k(a,"strsv_apply_inverse"),y=await k(a,"strsv_update"),_=b===g,B=[];for(let W=0;W<e;W+=xr)B.push(W);_||B.reverse();let N=B.length,I=a.limits.maxComputeWorkgroupsPerDimension,j=a.limits.minUniformBufferOffsetAlignment,L=null,T=null,C=null,F=null,O=null,q=null;try{L=m?i._buf:x(i,"strsv-A",!1),T=f?l._buf:x(l,"strsv-x",!0),C=rr(N*xr*xr*4,"strsv-Ainv");let W=Ut(N,j,V=>{let z=V*xr,K=Math.min(z+xr,e);return[s,V,z,K]});F=Ot(a,W,"strsv-apply-params");let Z=Ut(N,j,V=>{let z=V*xr,K=Math.min(z+xr,e);return[e,s,n,b?0:1,g?0:1,z,K]});O=Ot(a,Z,"strsv-update-params");let{commandEncoder:Q,querySet:$}=gr();q=D([{value:e,type:"u32"},{value:n,type:"u32"},{value:b?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ar=A(h.getBindGroupLayout(0),[L,C,q]);ur(Q,h,ar,{x:xr,y:N},$?{timestampWrites:{querySet:$,beginningOfPassWriteIndex:0}}:void 0);for(let V=0;V<B.length;V++){let z=B[V],K=Math.min(z+xr,e),X=z/xr,er=V===B.length-1,sr=X*j,cr=A(v.getBindGroupLayout(0),[C,T,{buffer:F,offset:sr,size:16}]);ur(Q,v,cr,1,er&&$?{timestampWrites:{querySet:$,endOfPassWriteIndex:1}}:void 0);let fr=_?e-K:z;if(fr===0)continue;let vr=A(y.getBindGroupLayout(0),[L,T,{buffer:O,offset:sr,size:32}]),Ar=Math.min(fr,I);ur(Q,y,vr,Ar)}let nr=wr(Q,$),tr=f?null:G(Q,T);M(Q);let J=await S(nr);if(f)return J!==void 0?{gpuTimeMs:J}:{};let Y=await E(tr,Float32Array);return J!==void 0?{x:Y,gpuTimeMs:J}:{x:Y}}finally{!m&&L&&d(L),!f&&T&&d(T),C&&d(C),F&&d(F),O&&d(O),q&&d(q)}}async function Kt(a,t,r,o,e,i,n,l,s,u,f="row-major"){let m=s instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!m&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(m&&u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(s.rows<t||s.cols<r))throw new Error("A is too small for the given m and n.");(m?s.layout:f)==="column-major"&&([t,r]=[r,t],[e,n]=[n,e],[i,l]=[l,i]);let c=e instanceof P,w=n instanceof P;if(u<r)throw new Error("lda must be >= n.");if(!c&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(n instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(m&&c&&s._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&w&&s._buf===n._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||r<0)throw new Error("m and n must be non-negative.");if(t===0||r===0)return m?{}:{A:s};if(!m&&s.length<(t-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(e.length<(t-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(n.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await k(a,"sger"),b=null,h=null,v=null,y=null;try{b=c?e._buf:x(e,"sger-x",!1),h=w?n._buf:x(n,"sger-y",!1),v=m?s._buf:x(s,"sger-A",!0),y=D([{value:t,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let _=A(g.getBindGroupLayout(0),[b,h,v,y]),B=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:I}=R(g,_,B),j=m?null:G(N,v);M(N);let L=await S(I);if(m)return L!==void 0?{gpuTimeMs:L}:{};let T=await E(j,Float32Array);return L!==void 0?{A:T,gpuTimeMs:L}:{A:T}}finally{!c&&b&&d(b),!w&&h&&d(h),!m&&v&&d(v),y&&d(y)}}async function zt(a,t,r,o,e,i,n,l,s="row-major"){let u=e instanceof P,f=n instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(s!=="row-major"&&s!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&u&&n._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{A:n};if(!f&&n.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?n.layout:s)==="column-major"?t==="upper":t==="lower",c=await k(a,"ssyr"),w=null,g=null,b=null;try{w=u?e._buf:x(e,"ssyr-x",!1),g=f?n._buf:x(n,"ssyr-A",!0),b=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let h=A(c.getBindGroupLayout(0),[w,g,b]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:y,ts:_}=R(c,h,v),B=f?null:G(y,g);M(y);let N=await S(_);if(f)return N!==void 0?{gpuTimeMs:N}:{};let I=await E(B,Float32Array);return N!==void 0?{A:I,gpuTimeMs:N}:{A:I}}finally{!u&&w&&d(w),!f&&g&&d(g),b&&d(b)}}async function qt(a,t,r,o,e,i,n,l,s,u,f="row-major"){let m=e instanceof P,p=n instanceof P,c=s instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(n instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!m)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&m&&s._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&p&&s._buf===n._buf)throw new Error("A and y must not reference the same GPU buffer.");if(m&&e._buf===n._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{A:s};if(!c&&s.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(n.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?s.layout:f)==="column-major"?t==="upper":t==="lower",b=await k(a,"ssyr2"),h=null,v=null,y=null,_=null;try{h=m?e._buf:x(e,"ssyr2-x",!1),v=p?n._buf:x(n,"ssyr2-y",!1),y=c?s._buf:x(s,"ssyr2-A",!0),_=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let B=A(b.getBindGroupLayout(0),[h,v,y,_]),N=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:I,ts:j}=R(b,B,N),L=c?null:G(I,y);M(I);let T=await S(j);if(c)return T!==void 0?{gpuTimeMs:T}:{};let C=await E(L,Float32Array);return T!==void 0?{A:C,gpuTimeMs:T}:{A:C}}finally{!m&&h&&d(h),!p&&v&&d(v),!c&&y&&d(y),_&&d(_)}}var Jo=32,ra=32,ea=64,ta=64,oa=36;async function Yt(a,t,r,o,e,i,n,l,s,u,f,m,p,c,w="row-major"){let g=l instanceof H,b=u instanceof H,h=p instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof n!="number")throw new Error("alpha must be a number.");if(Number.isNaN(n))throw new Error("alpha must not be NaN.");if(!Number.isFinite(n))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(f)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||b)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!g||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||e===0)return h?{}:{C:p};let v=g?l.layout:w,y=b?u.layout:w,_=h?p.layout:w,B=v==="column-major"?i:o,N=v==="column-major"?o:i,I=t==="no-transpose"?B:N,j=t==="no-transpose"?N:B;if(s<j)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(s!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[J,Y]=t==="no-transpose"?[o,i]:[i,o];if(l.rows<J||l.cols<Y)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(I-1)*s+j)throw new Error("A does not have enough elements for the given dimensions and lda.");let L=y==="column-major"?e:i,T=y==="column-major"?i:e,C=r==="no-transpose"?L:T,F=r==="no-transpose"?T:L;if(f<F)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[J,Y]=r==="no-transpose"?[i,e]:[e,i];if(u.rows<J||u.cols<Y)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(C-1)*f+F)throw new Error("B does not have enough elements for the given dimensions and ldb.");let O=_==="column-major"?e:o,q=_==="column-major"?o:e;if(c<q)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(c!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<o||p.cols<e)throw new Error("C is too small for the given m and n.")}else if(p.length<(O-1)*c+q)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&([l,u]=[u,l],[g,b]=[b,g],[s,f]=[f,s],[t,r]=[r==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[o,e]=[e,o]);let W=Math.ceil(e/ta),Z=Math.ceil(o/ea),Q=W*Z>=oa,$=await k(a,Q?"sgemm_large":"sgemm_small"),ar=g?l._buf:x(l,"sgemm-A",!1),ir=b?u._buf:x(u,"sgemm-B",!1),nr=h?p._buf:x(p,"sgemm-C",!0),tr=D([{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"u32"},{value:n,type:"f32"},{value:m,type:"f32"},{value:s,type:"u32"},{value:f,type:"u32"},{value:c,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let J=A($.getBindGroupLayout(0),[ar,ir,nr,tr]),Y=Q?{x:Math.min(W,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Z,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(e/ra),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Jo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:V,ts:z}=R($,J,Y),K=h?null:G(V,nr);M(V);let X=await S(z);if(h)return X!==void 0?{gpuTimeMs:X}:{};let er=await E(K,Float32Array);return X!==void 0?{C:er,gpuTimeMs:X}:{C:er}}finally{g||d(ar),b||d(ir),h||d(nr),d(tr)}}var aa=32,ia=32,na=64,sa=64,ua=36;async function Xt(a,t,r,o,e,i,n,l,s,u,f,m,p,c,w,g="row-major"){let b=s instanceof H,h=f instanceof H,v=c instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!b&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!v&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((b||h)&&!v)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(v&&(!b||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(e<0||i<0||n<0)throw new Error("m, n, and k must be non-negative.");if(e===0||i===0)return v?{}:{C:c};let y=b?s.layout:g,_=h?f.layout:g,B=v?c.layout:g,N=y==="column-major"?n:e,I=y==="column-major"?e:n,j=r==="no-transpose"?N:I,L=r==="no-transpose"?I:N;if(u<L)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(b){if(u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,V]=r==="no-transpose"?[e,n]:[n,e];if(s.rows<Y||s.cols<V)throw new Error("A is too small for the given m, k, and transA.")}else if(s.length<(j-1)*u+L)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=_==="column-major"?i:n,C=_==="column-major"?n:i,F=o==="no-transpose"?T:C,O=o==="no-transpose"?C:T;if(m<O)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,V]=o==="no-transpose"?[n,i]:[i,n];if(f.rows<Y||f.cols<V)throw new Error("B is too small for the given n, k, and transB.")}else if(f.length<(F-1)*m+O)throw new Error("B does not have enough elements for the given dimensions and ldb.");let q=B==="column-major"?i:e,W=B==="column-major"?e:i;if(w<W)throw new Error(`ldc must be >= ${B==="column-major"?"rows":"cols"} of C as stored.`);if(v){if(w!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<e||c.cols<i)throw new Error("C is too small for the given m and n.")}else if(c.length<(q-1)*w+W)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),B==="column-major"&&([s,f]=[f,s],[b,h]=[h,b],[u,m]=[m,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[e,i]=[i,e],t=t==="lower"?"upper":"lower");let Z=Math.ceil(i/sa),Q=Math.ceil(e/na),$=Z*Q>=ua,ar=await k(a,$?"sgemmtr_large":"sgemmtr_small"),ir=b?s._buf:x(s,"sgemmtr-A",!1),nr=h?f._buf:x(f,"sgemmtr-B",!1),tr=v?c._buf:x(c,"sgemmtr-C",!0),J=D([{value:e,type:"u32"},{value:i,type:"u32"},{value:n,type:"u32"},{value:l,type:"f32"},{value:p,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:w,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let Y=A(ar.getBindGroupLayout(0),[ir,nr,tr,J]),V=$?{x:Math.min(Z,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/ia),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(e/aa),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:z,ts:K}=R(ar,Y,V),X=v?null:G(z,tr);M(z);let er=await S(K);if(v)return er!==void 0?{gpuTimeMs:er}:{};let sr=await E(X,Float32Array);return er!==void 0?{C:sr,gpuTimeMs:er}:{C:sr}}finally{b||d(ir),h||d(nr),v||d(tr),d(J)}}var la=32,fa=32,ma=64,ca=64,da=36;async function Qt(a,t,r,o,e,i,n,l,s,u,f,m="row-major"){let p=n instanceof H,c=u instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof s!="number")throw new Error("beta must be a number.");if(Number.isNaN(s))throw new Error("beta must not be NaN.");if(!Number.isFinite(s))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(f))throw new Error("n, k, lda, and ldc must be integers.");if(!p&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(p&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!p)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return c?{}:{C:u};let w=p?n.layout:m,g=c?u.layout:m,b=w==="column-major"?e:o,h=w==="column-major"?o:e,v=r==="no-transpose"?b:h,y=r==="no-transpose"?h:b;if(l<y)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[W,Z]=r==="no-transpose"?[o,e]:[e,o];if(n.rows<W||n.cols<Z)throw new Error("A is too small for the given n, k, and trans.")}else if(n.length<(v-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");if(f<o)throw new Error("ldc must be >= n.");if(c){if(f!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*f+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let _=r;w==="column-major"&&(_=_==="no-transpose"?"transpose":"no-transpose");let B=_==="no-transpose"?"transpose":"no-transpose",N=t;g==="column-major"&&([_,B]=[B==="no-transpose"?"transpose":"no-transpose",_==="no-transpose"?"transpose":"no-transpose"],N=N==="lower"?"upper":"lower");let I=Math.ceil(o/ca),j=Math.ceil(o/ma),L=I*j>=da,T=await k(a,L?"sgemmtr_large":"sgemmtr_small"),C=p?n._buf:x(n,"ssyrk-A",!1),F=c?u._buf:x(u,"ssyrk-C",!0),O=p?rr(C.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(n,"ssyrk-B",!1),q=D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:s,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:_==="transpose"?1:0,type:"u32"},{value:B==="transpose"?1:0,type:"u32"},{value:N==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let W=A(T.getBindGroupLayout(0),[C,O,F,q]),Z=L?{x:Math.min(I,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(j,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/fa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/la),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Q,querySet:$,passDescriptor:ar}=gr();p&&Q.copyBufferToBuffer(C,0,O,0,C.size),ur(Q,T,W,Z,ar);let ir=wr(Q,$),nr=c?null:G(Q,F);M(Q);let tr=await S(ir);if(c)return tr!==void 0?{gpuTimeMs:tr}:{};let J=await E(nr,Float32Array);return tr!==void 0?{C:J,gpuTimeMs:tr}:{C:J}}finally{p||d(C),d(O),c||d(F),d(q)}}var pa=32,wa=32,ga=64,ba=64,ha=36;async function Zt(a,t,r,o,e,i,n,l,s,u,f,m,p,c="row-major"){let w=n instanceof H,g=s instanceof H,b=m instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(s instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return b?{}:{C:m};let h=w?n.layout:c,v=g?s.layout:c,y=b?m.layout:c,_=h==="column-major"?e:o,B=h==="column-major"?o:e,N=r==="no-transpose"?_:B,I=r==="no-transpose"?B:_;if(l<I)throw new Error(`lda must be >= ${h==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[K,X]=r==="no-transpose"?[o,e]:[e,o];if(n.rows<K||n.cols<X)throw new Error("A is too small for the given n, k, and trans.")}else if(n.length<(N-1)*l+I)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=v==="column-major"?e:o,L=v==="column-major"?o:e,T=r==="no-transpose"?j:L,C=r==="no-transpose"?L:j;if(u<C)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==s.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[K,X]=r==="no-transpose"?[o,e]:[e,o];if(s.rows<K||s.cols<X)throw new Error("B is too small for the given n, k, and trans.")}else if(s.length<(T-1)*u+C)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(p<o)throw new Error("ldc must be >= n.");if(b){if(p!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<o||m.cols<o)throw new Error("C is too small for the given n.")}else if(m.length<(o-1)*p+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let F=r;h==="column-major"&&(F=F==="no-transpose"?"transpose":"no-transpose");let O=r;v==="column-major"&&(O=O==="no-transpose"?"transpose":"no-transpose");let q=y==="column-major"?t==="lower"?"upper":"lower":t,W=K=>K==="no-transpose"?"transpose":"no-transpose";function Z(K,X,er,sr,cr,lr){let fr=K,vr=W(sr);return y!=="column-major"?{transX:fr,X,ldX:er,transY:vr,Y:cr,ldY:lr}:{transX:W(vr),X:cr,ldX:lr,transY:W(fr),Y:X,ldY:er}}let Q=Math.ceil(o/ba),$=Math.ceil(o/ga),ar=Q*$>=ha,ir=await k(a,ar?"sgemmtr_large":"sgemmtr_small"),nr=ar?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min($,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/wa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/pa),a.limits.maxComputeWorkgroupsPerDimension)},tr=w?n._buf:x(n,"ssyr2k-A",!1),J=g?s._buf:x(s,"ssyr2k-B",!1),Y=b?m._buf:x(m,"ssyr2k-C",!0),V=null,z=null;try{let K=Z(F,tr,l,O,J,u),X=Z(O,J,u,F,tr,l),er=(Br,Sr)=>D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:Sr,type:"f32"},{value:Br.ldX,type:"u32"},{value:Br.ldY,type:"u32"},{value:p,type:"u32"},{value:Br.transX==="transpose"?1:0,type:"u32"},{value:Br.transY==="transpose"?1:0,type:"u32"},{value:q==="upper"?1:0,type:"u32"}],"ssyr2k-params");V=er(K,f),z=er(X,1);let sr=A(ir.getBindGroupLayout(0),[K.X,K.Y,Y,V]),cr=A(ir.getBindGroupLayout(0),[X.X,X.Y,Y,z]),{commandEncoder:lr,querySet:fr}=gr(),vr=fr?{timestampWrites:{querySet:fr,beginningOfPassWriteIndex:0}}:void 0,Ar=fr?{timestampWrites:{querySet:fr,endOfPassWriteIndex:1}}:void 0;ur(lr,ir,sr,nr,vr),ur(lr,ir,cr,nr,Ar);let yr=wr(lr,fr),_r=b?null:G(lr,Y);M(lr);let pr=await S(yr);if(b)return pr!==void 0?{gpuTimeMs:pr}:{};let br=await E(_r,Float32Array);return pr!==void 0?{C:br,gpuTimeMs:pr}:{C:br}}finally{w||d(tr),g||d(J),b||d(Y),V&&d(V),z&&d(z)}}var xa=32,va=32,ya=64,_a=64,Ba=36,$t=8;async function Jt(a,t,r,o,e,i,n,l,s,u,f,m,p,c="row-major"){let w=n instanceof H,g=s instanceof H,b=m instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(s instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("m and n must be non-negative.");if(o===0||e===0)return b?{}:{C:m};let h=w?n.layout:c,v=g?s.layout:c,y=b?m.layout:c,_=t==="left"?o:e;if(l<_)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(w){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<_||n.cols<_)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(_-1)*l+_)throw new Error("A does not have enough elements for the given dimensions and lda.");let B=v==="column-major"?e:o,N=v==="column-major"?o:e;if(u<N)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==s.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(s.rows<o||s.cols<e)throw new Error("B is too small for the given m and n.")}else if(s.length<(B-1)*u+N)throw new Error("B does not have enough elements for the given dimensions and ldb.");let I=y==="column-major"?e:o,j=y==="column-major"?o:e;if(p<j)throw new Error(`ldc must be >= ${y==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(p!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<o||m.cols<e)throw new Error("C is too small for the given m and n.")}else if(m.length<(I-1)*p+j)throw new Error("C does not have enough elements for the given dimensions and ldc.");let L=h==="column-major"?r==="lower"?"upper":"lower":r,T=v==="column-major"?"transpose":"no-transpose",C="no-transpose",F=o,O=e,q=_,W=t==="left"?C:T,Z=t==="left"?T:C,Q=lr=>lr==="no-transpose"?"transpose":"no-transpose",$=t==="right";y==="column-major"&&([W,Z]=[Q(Z),Q(W)],$=!$,[F,O]=[O,F]);let ar=_,ir=Math.ceil(O/_a),nr=Math.ceil(F/ya),tr=ir*nr>=Ba,J=await k(a,tr?"sgemm_large":"sgemm_small"),Y=await k(a,"symmetrize"),V=tr?{x:Math.min(ir,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(nr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(O/va),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(F/xa),a.limits.maxComputeWorkgroupsPerDimension)},z=w?n._buf:x(n,"ssymm-A",!1),K=g?s._buf:x(s,"ssymm-B",!1),X=b?m._buf:x(m,"ssymm-C",!0),er=rr(_*ar*4,"ssymm-Adense"),sr=null,cr=null;try{sr=D([{value:_,type:"u32"},{value:l,type:"u32"},{value:ar,type:"u32"},{value:L==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let lr=A(Y.getBindGroupLayout(0),[z,er,sr]),fr=$?K:er,vr=$?u:ar,Ar=$?er:K;cr=D([{value:F,type:"u32"},{value:O,type:"u32"},{value:q,type:"u32"},{value:i,type:"f32"},{value:f,type:"f32"},{value:vr,type:"u32"},{value:$?ar:u,type:"u32"},{value:p,type:"u32"},{value:W==="transpose"?1:0,type:"u32"},{value:Z==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let _r=A(J.getBindGroupLayout(0),[fr,Ar,X,cr]),{commandEncoder:pr,querySet:br}=gr(),Br=br?{timestampWrites:{querySet:br,beginningOfPassWriteIndex:0}}:void 0,Sr=br?{timestampWrites:{querySet:br,endOfPassWriteIndex:1}}:void 0;ur(pr,Y,lr,{x:Math.ceil(_/$t),y:Math.ceil(_/$t)},Br),ur(pr,J,_r,V,Sr);let kr=wr(pr,br),Pr=b?null:G(pr,X);M(pr);let Mr=await S(kr);if(b)return Mr!==void 0?{gpuTimeMs:Mr}:{};let Wr=await E(Pr,Float32Array);return Mr!==void 0?{C:Wr,gpuTimeMs:Mr}:{C:Wr}}finally{w||d(z),g||d(K),b||d(X),d(er),sr&&d(sr),cr&&d(cr)}}var Ea=32,Aa=32,Ga=64,ka=64,Na=36,ro=8;async function eo(a,t,r,o,e,i,n,l,s,u,f,m,p="row-major"){let c=s instanceof H,w=f instanceof H,g=e==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&e!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(m))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(i<0||n<0)throw new Error("m and n must be non-negative.");if(i===0||n===0)return w?{}:{B:f};let b=c?s.layout:p,h=w?f.layout:p,v=t==="left"?i:n;if(u<v)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(u!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(s.rows<v||s.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(s.length<(v-1)*u+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let y=h==="column-major"?n:i,_=h==="column-major"?i:n;if(m<_)throw new Error(`ldb must be >= ${h==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(f.rows<i||f.cols<n)throw new Error("B is too small for the given m and n.")}else if(f.length<(y-1)*m+_)throw new Error("B does not have enough elements for the given dimensions and ldb.");let B=b==="column-major"?r==="lower"?"upper":"lower":r,N=b==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,I=h==="column-major"?"transpose":"no-transpose",j="no-transpose",L=i,T=n,C=v,F=t==="left"?j:I,O=t==="left"?I:j,q=sr=>sr==="no-transpose"?"transpose":"no-transpose",W=t==="right";h==="column-major"&&([F,O]=[q(O),q(F)],W=!W,[L,T]=[T,L]);let Z=v,Q=Math.ceil(T/ka),$=Math.ceil(L/Ga),ar=Q*$>=Na,ir=await k(a,ar?"sgemm_large":"sgemm_small"),nr=await k(a,"triangularize"),tr=ar?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min($,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(T/Aa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(L/Ea),a.limits.maxComputeWorkgroupsPerDimension)},J=c?s._buf:x(s,"strmm-A",!1),Y=w?f._buf:x(f,"strmm-B",!0),V=rr(v*Z*4,"strmm-Adense"),z=rr(y*m*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),K=null,X=null,er=!1;try{K=D([{value:v,type:"u32"},{value:u,type:"u32"},{value:Z,type:"u32"},{value:B==="upper"?1:0,type:"u32"},{value:N==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let sr=A(nr.getBindGroupLayout(0),[J,V,K]),cr=W?Y:V,lr=W?m:Z,fr=W?V:Y;X=D([{value:L,type:"u32"},{value:T,type:"u32"},{value:C,type:"u32"},{value:l,type:"f32"},{value:0,type:"f32"},{value:lr,type:"u32"},{value:W?Z:m,type:"u32"},{value:m,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:O==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let Ar=A(ir.getBindGroupLayout(0),[cr,fr,z,X]),{commandEncoder:yr,querySet:_r}=gr();yr.copyBufferToBuffer(Y,0,z,0,Math.min(Y.size,z.size));let pr=_r?{timestampWrites:{querySet:_r,beginningOfPassWriteIndex:0}}:void 0,br=_r?{timestampWrites:{querySet:_r,endOfPassWriteIndex:1}}:void 0;ur(yr,nr,sr,{x:Math.ceil(v/ro),y:Math.ceil(v/ro)},pr),ur(yr,ir,Ar,tr,br);let Br=wr(yr,_r),Sr=w?null:G(yr,z);M(yr);let kr=await S(Br);if(w)return d(f._buf),f._buf=z,er=!0,kr!==void 0?{gpuTimeMs:kr}:{};let Pr=await E(Sr,Float32Array);return kr!==void 0?{B:Pr,gpuTimeMs:kr}:{B:Pr}}finally{c||d(J),w||d(Y),d(V),er||d(z),K&&d(K),X&&d(X)}}return so(Sa);})();
