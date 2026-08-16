var wgblas=(()=>{var Vt=Object.create;var Er=Object.defineProperty;var Kt=Object.getOwnPropertyDescriptor;var zt=Object.getOwnPropertyNames;var qt=Object.getPrototypeOf,Xt=Object.prototype.hasOwnProperty;var Ar=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var C=(a,t,r)=>()=>{if(r)throw r[0];try{return a&&(t=a(a=0)),t}catch(o){throw r=[o],o}};var Tr=(a,t)=>{for(var r in t)Er(a,r,{get:t[r],enumerable:!0})},Lr=(a,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of zt(t))!Xt.call(a,e)&&e!==r&&Er(a,e,{get:()=>t[e],enumerable:!(o=Kt(t,e))||o.enumerable});return a};var Gr=(a,t,r)=>(r=a!=null?Vt(qt(a)):{},Lr(t||!a||!a.__esModule?Er(r,"default",{value:a,enumerable:!0}):r,a)),Qt=a=>Lr(Er({},"__esModule",{value:!0}),a);var qr,zr=C(()=>{qr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Qr,Xr=C(()=>{Qr=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var Zr,Yr=C(()=>{Zr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Jr,$r=C(()=>{Jr=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var ee,re=C(()=>{ee=`// sscal: x = alpha * x

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
`});var oe,te=C(()=>{oe=`// sswap: x <-> y

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
`});var ie,ae=C(()=>{ie=`// saxpy: y = alpha * x + y

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
`});var ne,se=C(()=>{ne=`// scopy: y = x

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
`});var le,ue=C(()=>{le=`// sdot: result = sum(x[i] * y[i])
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
`});var me,fe=C(()=>{me=`// sasum: result = sum(|x[i]|)
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
`});var ce,de=C(()=>{ce=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var we,pe=C(()=>{we=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var be,ge=C(()=>{be=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var xe,he=C(()=>{xe=`// isamax: returns index of element with largest absolute value
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
`});var ye,ve=C(()=>{ye=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Be,_e=C(()=>{Be=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Ae,Ee=C(()=>{Ae=`// ssymv: y = alpha * A * x + beta * y
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
`});var ke,Ge=C(()=>{ke=`// strmv: y = op(A) * x
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
`});var Ne,Se=C(()=>{Ne=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Ie,Pe=C(()=>{Ie=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var De,Me=C(()=>{De=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var Le,Te=C(()=>{Le=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var je,Re=C(()=>{je=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var Fe,Ce=C(()=>{Fe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var He,We=C(()=>{He=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Oe,Ue=C(()=>{Oe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Ke,Ve=C(()=>{Ke=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var qe,ze=C(()=>{qe=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var Qe,Xe=C(()=>{Qe=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var Ze,Ye=C(()=>{Ze=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var Je,$e=C(()=>{Je=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var et,rt=C(()=>{et=`// strsv_update: subtracts a solved block's contribution from every
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
`});var ot,tt=C(()=>{ot=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var it,at=C(()=>{it=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var nt,st=C(()=>{nt=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var lt,ut=C(()=>{lt=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var ft={};Tr(ft,{shaderSources:()=>To});var To,mt=C(()=>{zr();Xr();Yr();$r();re();te();ae();se();ue();fe();de();pe();ge();he();ve();_e();Ee();Ge();Se();Pe();Me();Te();Re();Ce();We();Ue();Ve();ze();Xe();Ye();$e();rt();tt();at();st();ut();To={"reduction/argmax":qr,"reduction/argmaxF64":Qr,"reduction/sum":Zr,"reduction/sumF64":Jr,sscal:ee,sswap:oe,saxpy:ie,scopy:ne,sdot:le,sasum:me,snrm2:ce,srot:we,srotm:be,isamax:xe,sgemv_n:ye,sgemv_t:Be,ssymv:Ae,strmv:ke,sger:Ne,ssyr:Ie,ssyr2:De,f64add:Le,"f64/dekker":je,"f64/utils/abs":Fe,"f64/utils/add":He,"f64/utils/greater":Oe,"f64/utils/equal":Ke,dasum:qe,idamax:Qe,strsv_invert_block:Ze,strsv_apply_inverse:Je,strsv_update:et,sgemm_small:ot,sgemm_large:it,sgemmtr_small:nt,sgemmtr_large:lt}});var ia={};Tr(ia,{GpuMatrix:()=>W,GpuVector:()=>G,cleanup:()=>Hr,dasum:()=>yt,gpuName:()=>Ur,idamax:()=>At,init:()=>Wr,isamax:()=>Et,randomFloat32Array:()=>Or,randomFloat64Array:()=>Vr,randomTriangularFloat32Array:()=>Kr,sasum:()=>vt,saxpy:()=>wt,scopy:()=>gt,sdot:()=>ht,sgemm:()=>jt,sgemmtr:()=>Ct,sgemv:()=>St,sger:()=>Tt,snrm2:()=>Bt,srot:()=>Gt,srotm:()=>kt,sscal:()=>ct,sswap:()=>pt,ssymv:()=>Nt,ssyr:()=>Lt,ssyr2:()=>Rt,ssyr2k:()=>Wt,ssyrk:()=>Ft,strmv:()=>Pt,strsv:()=>Dt});function Rr(a,t){return t?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function jr(){if(!Cr())return{querySet:null,passDescriptor:void 0};let t=z().createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function wr(a,t){if(!t)return null;let r=z(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(t,0,2,o,0);let e=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,e,0,16),{tsReadBuffer:e,resolveBuffer:o,querySet:t}}async function P(a){if(!a)return;let{tsReadBuffer:t,resolveBuffer:r,querySet:o}=a;await t.mapAsync(GPUMapMode.READ);let e=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(e[1]-e[0]))/1e6}var fr=null,br=null,Fr=null,Nr=!1;async function Wr({powerPreference:a="high-performance",benchmark:t=!1,dumpShaders:r=!1}={}){if(fr)return fr;let o;if(typeof window>"u"){let{create:s,globals:l}=await import("webgpu");Object.assign(globalThis,l),o=s(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),Fr=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(br=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!br)throw new Error("No WebGPU adapter found.");Nr=t;let i=[...Rr(br,t).requiredFeatures??[]];return fr=await br.requestDevice({requiredFeatures:i}),fr.addEventListener("uncapturederror",s=>{console.error("Uncaptured GPU error:",s.error.message)}),fr}function Hr(){fr&&(fr.destroy(),fr=null),br=null,Fr=null,Nr=!1}function Ur(){if(!br)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:t}=br.info;return{description:t||"unknown",device:a||"unknown"}}function Cr(){return Nr}function z(){if(!fr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return fr}function c(...a){a.flat().forEach(t=>t.destroy())}function x(a,t="blas-input",r=!1){let o=z(),e=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>e)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${e} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=o.createBuffer({label:t,size:i,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(l.getMappedRange()).set(a),l.unmap(),l}function Y(a,t="blas-storage",r=0){return z().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|r})}function nr(a,t="blas-result"){return z().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function A(a,t){let o=z().createBuffer({label:"blas-readback",size:t.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(t,0,o,0,t.size),o}function D(a,t="blas-params"){let r=z(),o=a.length*4,e=Math.ceil(o/16)*16,i=new ArrayBuffer(e),s=new DataView(i);a.forEach(({value:n,type:u},f)=>{let m=f*4;if(u==="u32")s.setUint32(m,n,!0);else if(u==="i32")s.setInt32(m,n,!0);else if(u==="f32")s.setFloat32(m,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:t,size:e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function E(a,t=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new t(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function gr(a){let t=a.length,r=new Float32Array(t),o=new Float32Array(t);for(let e=0;e<t;e++){let i=Math.fround(a[e]);r[e]=i,o[e]=Math.fround(a[e]-i)}return{hi:r,lo:o}}function yr(a,t){let r=a.length,o=new Float64Array(r);for(let e=0;e<r;e++)o[e]=a[e]+t[e];return o}var G=class a{constructor(t,r,o=Float32Array,e=null){this._buf=t,this._loBuf=e,this.length=r,this.dtype=o}static from(t){if(t instanceof Float64Array){let{hi:o,lo:e}=gr(t),i=x(o,"gpu-vector-f64-hi",!0),s=x(e,"gpu-vector-f64-lo",!0);return new a(i,t.length,Float64Array,s)}if(!(t instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=x(t,"gpu-vector",!0);return new a(r,t.length,t.constructor)}async read(){let t=z(),r=t.createCommandEncoder(),o=A(r,this._buf);if(t.queue.submit([r.finish()]),!this._loBuf)return E(o,this.dtype);let e=t.createCommandEncoder(),i=A(e,this._loBuf);t.queue.submit([e.finish()]);let[s,l]=await Promise.all([E(o,Float32Array),E(i,Float32Array)]);return yr(s,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var W=class a{constructor(t,r,o,e,i=null,s="row-major"){this._buf=t,this._loBuf=i,this.rows=r,this.cols=o,this.lda=e,this.layout=s}static from(t,r,o,e,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(e===void 0&&(e=s?o:r),!(t instanceof Float32Array)&&!(t instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let l=s?o:r;if(!Number.isInteger(e)||e<l)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?r:o;if(t.length<n*e)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(t instanceof Float64Array){let f=n*e,{hi:m,lo:p}=gr(t.subarray(0,f)),d=x(m,"gpu-matrix-f64-hi",!0),w=x(p,"gpu-matrix-f64-lo",!0);return new a(d,r,o,e,w,i)}let u=x(t.subarray(0,n*e),"gpu-matrix",!0);return new a(u,r,o,e,null,i)}async read(){let t=z(),r=t.createCommandEncoder(),o=A(r,this._buf);t.queue.submit([r.finish()]);let e=this.layout!=="column-major",i=e?this.rows:this.cols,s=e?this.cols:this.rows;if(this._loBuf){let u=t.createCommandEncoder(),f=A(u,this._loBuf);t.queue.submit([u.finish()]);let[m,p]=await Promise.all([E(o,Float32Array),E(f,Float32Array)]),d=yr(m,p);if(this.lda===s)return d;let w=new Float64Array(i*s);for(let g=0;g<i;g++)w.set(d.subarray(g*this.lda,g*this.lda+s),g*s);return w}let l=await E(o,Float32Array);if(this.lda===s)return l;let n=new Float32Array(i*s);for(let u=0;u<i;u++)n.set(l.subarray(u*this.lda,u*this.lda+s),u*s);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Or(a,t=-1,r=1){let o=new Float32Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function Vr(a,t=-1,r=1){let o=new Float64Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function Kr(a,t,r="lower",o=-1,e=1,i=5,s=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(t<a)throw new Error("lda must be >= n.");let l=new Float32Array(a*t);for(let n=0;n<a;n++){for(let u=0;u<a;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(l[n*t+u]=o+Math.random()*(e-o))}l[n*t+n]=i+Math.random()*(s-i)}return l}function k(a,t,r=0){let o=z(),e=t.map((i,s)=>({binding:r+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:e})}var Yt=new WeakMap;function I(a){z().queue.submit([a.finish()])}function hr(){let a=z(),{querySet:t,passDescriptor:r}=jr();return{commandEncoder:a.createCommandEncoder(),querySet:t,passDescriptor:r}}function mr(a,t,r,o,e){let i=a.beginComputePass(e);i.setPipeline(t),i.setBindGroup(0,r),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y,o.z??1),i.end(),Yt.set(a,i)}function T(a,t,r){let{commandEncoder:o,querySet:e,passDescriptor:i}=hr();mr(o,a,t,r,i);let s=wr(o,e);return{commandEncoder:o,ts:s}}var jo={},Pr=new WeakMap;async function S(a,t,r="main"){Pr.has(a)||Pr.set(a,new Map);let o=Pr.get(a),e=Array.isArray(t)?t:[t],i=`${e.join("+")}::${r}`;return o.has(i)||o.set(i,await Ro(e,r)),o.get(i)}async function Lo(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(mt(),ft)),r=t[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:e}=await import("path"),i=o(r(jo.url));return t(e(i,`../shaders/${a}.wgsl`),"utf8")}}async function Ro(a,t="main"){let r=z(),o=a.join("+"),e=(await Promise.all(a.map(Lo))).join(`
`),i=r.createShaderModule({label:o,code:e}),l=(await i.getCompilationInfo()).messages.filter(f=>f.type==="error");if(l.length>0)throw new Error(`Shader "${o}" compilation failed:
${l.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let n=t==="main"?{module:i}:{module:i,entryPoint:t},u=r.createComputePipeline({label:o,layout:"auto",compute:n});return u._shaderModule=i,u}var Co=64,dt=8;function ar(a,t){let r=z().limits.maxComputeWorkgroupsPerDimension;return t===void 0?Math.min(Math.ceil(a/Co),r):{x:Math.min(Math.ceil(t/dt),r),y:Math.min(Math.ceil(a/dt),r)}}async function ct(a,t,r,o,e){let i=o instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof G))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return i?{}:o;if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await S(a,"sscal"),l=null,n=null,u=null;try{l=i?o._buf:x(o,"sscal-x",!0),n=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"}],"sscal-params");let f=k(s.getBindGroupLayout(0),[l,n]),{commandEncoder:m,ts:p}=T(s,f,ar(t));u=i?null:A(m,l),I(m);let d=await P(p);if(i)return d!==void 0?{gpuTimeMs:d}:{};let w=await E(u,Float32Array);return u=null,d!==void 0?{x:w,gpuTimeMs:d}:w}finally{!i&&l&&c(l),n&&c(n),u&&c(u)}}async function pt(a,t,r,o,e,i){let s=r instanceof G,l=e instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof G))throw new Error("x must be a Float32Array or GpuVector.");if(!(e instanceof Float32Array)&&!(e instanceof G))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==e.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return s?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(a,"sswap"),u=null,f=null,m=null,p=null,d=null;try{u=s?r._buf:x(r,"sswap-x",!0),f=l?e._buf:x(e,"sswap-y",!0),m=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let w=k(n.getBindGroupLayout(0),[u,f,m]),{commandEncoder:g,ts:h}=T(n,w,ar(t));p=s?null:A(g,u),d=l?null:A(g,f),I(g);let b=await P(h);if(s&&l)return b!==void 0?{gpuTimeMs:b}:{};let v=await E(p,Float32Array);p=null;let y=await E(d,Float32Array);return d=null,b!==void 0?{x:v,y,gpuTimeMs:b}:{x:v,y}}finally{!s&&u&&c(u),!l&&f&&c(f),m&&c(m),p&&c(p),d&&c(d)}}async function wt(a,t,r,o,e,i,s){let l=o instanceof G,n=i instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{y:i};if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(a,"saxpy"),f=null,m=null,p=null,d=null;try{f=l?o._buf:x(o,"saxpy-x",!1),m=n?i._buf:x(i,"saxpy-y",!0),p=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let w=k(u.getBindGroupLayout(0),[f,m,p]),{commandEncoder:g,ts:h}=T(u,w,ar(t));d=n?null:A(g,m),I(g);let b=await P(h);if(n&&l)return b!==void 0?{gpuTimeMs:b}:{};let v=await E(d,Float32Array);return d=null,b!==void 0?{y:v,gpuTimeMs:b}:{y:v}}finally{!l&&f&&c(f),!n&&m&&c(m),p&&c(p),d&&c(d)}}async function gt(a,t,r,o,e,i){let s=r instanceof G,l=e instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return l?{}:{y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(a,"scopy"),u=null,f=null,m=null,p=null;try{u=s?r._buf:x(r,"scopy-x",!1),f=l?e._buf:x(e,"scopy-y",!0),m=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let d=k(n.getBindGroupLayout(0),[u,f,m]),{commandEncoder:w,ts:g}=T(n,d,ar(t));p=l?null:A(w,f),I(w);let h=await P(g);if(l&&s)return h!==void 0?{gpuTimeMs:h}:{};let b=await E(p,Float32Array);return p=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!s&&u&&c(u),!l&&f&&c(f),m&&c(m),p&&c(p)}}var bt=64;async function ht(a,t,r,o,e,i){let s=r instanceof G,l=e instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(a,"sdot"),u=await S(a,"reduction/sum"),f=null,m=null,p=null,d=null,w=null,g=null;try{f=s?r._buf:x(r,"sdot-x",!1),m=l?e._buf:x(e,"sdot-y",!1),p=Y(2*bt*4,"sdot-partials"),d=nr(4,"sdot-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let h=k(n.getBindGroupLayout(0),[f,m,p,w]),{commandEncoder:b,ts:v}=T(n,h,2*bt);I(b);let y=k(u.getBindGroupLayout(0),[p,d]),{commandEncoder:_,ts:B}=T(u,y,1);g=A(_,d),I(_);let N=E(g,Float32Array);g=null;let[M,R,L]=await Promise.all([P(v),P(B),N]);return M!==void 0&&R!==void 0?{dot:L[0],gpuTimeMs:M+R}:{dot:L[0]}}finally{!s&&f&&c(f),!l&&m&&c(m),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}var xt=64;async function vt(a,t,r,o){let e=r instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(a,"sasum"),s=await S(a,"reduction/sum"),l=null,n=null,u=null,f=null,m=null;try{l=e?r._buf:x(r,"sasum-x",!1),n=Y(2*xt*4,"sasum-partials"),u=nr(4,"sasum-result"),f=D([{value:t,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=k(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:d,ts:w}=T(i,p,2*xt);I(d);let g=k(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=T(s,g,1);m=A(h,u),I(h);let v=E(m,Float32Array);m=null;let[y,_,B]=await Promise.all([P(w),P(b),v]);return y!==void 0&&_!==void 0?{asum:B[0],gpuTimeMs:y+_}:{asum:B[0]}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),f&&c(f),m&&c(m)}}var Ir=64;async function yt(a,t,r,o){let e=r instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],s=await S(a,[...i,"dasum"]),l=await S(a,[...i,"reduction/sumF64"]),n=null,u=null,f=null,m=null,p=null,d=null,w=null,g=null,h=null;try{if(e)n=r._buf,u=r._loBuf;else{let{hi:V,lo:U}=gr(r.map(Math.abs));n=x(V,"dasum-xHi",!1),u=x(U,"dasum-xLo",!1)}f=Y(2*Ir*4,"dasum-partialsHi"),m=Y(2*Ir*4,"dasum-partialsLo"),p=nr(4,"dasum-result-hi"),d=nr(4,"dasum-result-lo"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"dasum-params");let b=k(s.getBindGroupLayout(0),[n,u,f,m,w]),{commandEncoder:v,ts:y}=T(s,b,2*Ir);I(v);let _=k(l.getBindGroupLayout(0),[f,m,p,d]),{commandEncoder:B,ts:N}=T(l,_,1);g=A(B,p),h=A(B,d),I(B);let M=E(g,Float32Array),R=E(h,Float32Array);g=null,h=null;let[L,j,F,H]=await Promise.all([P(y),P(N),M,R]),O=yr(F,H)[0];return L!==void 0&&j!==void 0?{asum:O,gpuTimeMs:L+j}:{asum:O}}finally{!e&&n&&c(n),!e&&u&&c(u),f&&c(f),m&&c(m),p&&c(p),d&&c(d),w&&c(w),g&&c(g),h&&c(h)}}var _t=64;async function Bt(a,t,r,o){let e=r instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(a,"snrm2"),s=await S(a,"reduction/sum"),l=null,n=null,u=null,f=null,m=null;try{l=e?r._buf:x(r,"snrm2-x",!1),n=Y(2*_t*4,"snrm2-partials"),u=nr(4,"snrm2-result"),f=D([{value:t,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let p=k(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:d,ts:w}=T(i,p,2*_t);I(d);let g=k(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=T(s,g,1);m=A(h,u),I(h);let v=E(m,Float32Array);m=null;let[y,_,B]=await Promise.all([P(w),P(b),v]),N=Math.sqrt(B[0]);return y!==void 0&&_!==void 0?{nrm2:N,gpuTimeMs:y+_}:{nrm2:N}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),f&&c(f),m&&c(m)}}var Mr=64;async function Et(a,t,r,o){let e=r instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(a,"isamax"),s=await S(a,"reduction/argmax"),l=null,n=null,u=null,f=null,m=null,p=null;try{l=e?r._buf:x(r,"isamax-x",!1),n=Y(2*Mr*4,"isamax-partials-val"),u=Y(2*Mr*4,"isamax-partials-idx"),f=nr(4,"isamax-result"),m=D([{value:t,type:"u32"},{value:o,type:"u32"}],"isamax-params");let d=k(i.getBindGroupLayout(0),[l,n,u,m]),{commandEncoder:w,ts:g}=T(i,d,2*Mr);I(w);let h=k(s.getBindGroupLayout(0),[n,u,f]),{commandEncoder:b,ts:v}=T(s,h,1);p=A(b,f),I(b);let y=E(p,Uint32Array);p=null;let[_,B,N]=await Promise.all([P(g),P(v),y]),M=N[0];return _!==void 0&&B!==void 0?{index:M,gpuTimeMs:_+B}:{index:M}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),f&&c(f),m&&c(m),p&&c(p)}}var kr=64;async function At(a,t,r,o){let e=r instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],s=await S(a,[...i,"idamax"],"idamax_main"),l=await S(a,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,f=null,m=null,p=null,d=null,w=null,g=null;try{if(e)n=r._buf,u=r._loBuf;else{let{hi:F,lo:H}=gr(r);n=x(F,"idamax-xHi",!1),u=x(H,"idamax-xLo",!1)}f=Y(2*kr*4,"idamax-partials-val-hi"),m=Y(2*kr*4,"idamax-partials-val-lo"),p=Y(2*kr*4,"idamax-partials-idx"),d=nr(4,"idamax-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"idamax-params");let h=k(s.getBindGroupLayout(0),[n,u,f,m,p,w]),{commandEncoder:b,ts:v}=T(s,h,2*kr);I(b);let y=k(l.getBindGroupLayout(0),[f,m,p,d]),{commandEncoder:_,ts:B}=T(l,y,1);g=A(_,d),I(_);let N=E(g,Uint32Array);g=null;let[M,R,L]=await Promise.all([P(v),P(B),N]),j=L[0];return M!==void 0&&R!==void 0?{index:j,gpuTimeMs:M+R}:{index:j}}finally{!e&&n&&c(n),!e&&u&&c(u),f&&c(f),m&&c(m),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function Gt(a,t,r,o,e,i,s,l){let n=r instanceof G,u=e instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await S(a,"srot"),m=null,p=null,d=null,w=null,g=null;try{m=n?r._buf:x(r,"srot-x",!0),p=u?e._buf:x(e,"srot-y",!0),d=D([{value:t,type:"u32"},{value:s,type:"f32"},{value:l,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let h=k(f.getBindGroupLayout(0),[m,p,d]),{commandEncoder:b,ts:v}=T(f,h,ar(t));w=n?null:A(b,m),g=u?null:A(b,p),I(b);let y=await P(v);if(n&&u)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,M]=await Promise.all([_,B]);return y!==void 0?{x:N,y:M,gpuTimeMs:y}:{x:N,y:M}}finally{!n&&m&&c(m),!u&&p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function kt(a,t,r,o,e,i,s){let l=r instanceof G,n=e instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||s[0]===-2)return l?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(a,"srotm"),f=null,m=null,p=null,d=null,w=null,g=null;try{f=l?r._buf:x(r,"srotm-x",!0),m=n?e._buf:x(e,"srotm-y",!0),p=x(s,"srotm-param",!1),d=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let h=k(u.getBindGroupLayout(0),[f,m,p,d]),{commandEncoder:b,ts:v}=T(u,h,ar(t));w=l?null:A(b,f),g=n?null:A(b,m),I(b);let y=await P(v);if(l&&n)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,M]=await Promise.all([_,B]);return y!==void 0?{x:N,y:M,gpuTimeMs:y}:{x:N,y:M}}finally{!l&&f&&c(f),!n&&m&&c(m),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function St(a,t,r,o,e,i,s,l,n,u,f,m,p="row-major"){let d=i instanceof W,w=l instanceof G,g=f instanceof G;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(!d&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&l._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:f};(d?i.layout:p)==="column-major"&&([r,o]=[o,r],t=t==="no-transpose"?"transpose":"no-transpose");let b=t==="no-transpose",v=b?o:r,y=b?r:o;if(s<o)throw new Error("lda must be >= n.");if(!d&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(v-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(y-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let B=await S(a,b?"sgemv_n":"sgemv_t"),N=d?i._buf:x(i,"sgemv-A",!1),M=w?l._buf:x(l,"sgemv-x",!1),R=g?f._buf:x(f,"sgemv-y",!0),L=D([{value:r,type:"u32"},{value:o,type:"u32"},{value:e,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let j=k(B.getBindGroupLayout(0),[N,M,R,L]),F=b?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):ar(y),{commandEncoder:H,ts:O}=T(B,j,F),V=g?null:A(H,R);I(H);let U=await P(O);if(g)return U!==void 0?{gpuTimeMs:U}:{};let rr=await E(V,Float32Array);return U!==void 0?{y:rr,gpuTimeMs:U}:{y:rr}}finally{d||c(N),w||c(M),g||c(R),c(L)}}async function Nt(a,t,r,o,e,i,s,l,n,u,f,m="row-major"){let p=s instanceof G,d=u instanceof G,w=e instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!w&&!(e instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&i!==e.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(e.rows<r||e.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return d?{}:{y:u};if(!w&&e.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?e.layout:m)==="column-major"?t==="upper":t==="lower",b=await S(a,"ssymv"),v=null,y=null,_=null,B=null;try{v=w?e._buf:x(e,"ssymv-A",!1),y=p?s._buf:x(s,"ssymv-x",!1),_=d?u._buf:x(u,"ssymv-y",!0),B=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let N=k(b.getBindGroupLayout(0),[v,y,_,B]),M=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:R,ts:L}=T(b,N,M),j=d?null:A(R,_);I(R);let F=await P(L);if(d)return F!==void 0?{gpuTimeMs:F}:{};let H=await E(j,Float32Array);return F!==void 0?{y:H,gpuTimeMs:F}:{y:H}}finally{!w&&v&&c(v),!p&&y&&c(y),!d&&_&&c(_),B&&c(B)}}async function Pt(a,t,r,o,e,i,s,l,n,u,f,m="row-major"){let p=l instanceof G,d=u instanceof G,w=i instanceof W,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&d&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return d?{}:{y:u};if(!w&&i.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?i.layout:m)==="column-major",v=b?t==="upper":t==="lower",y=b?r==="transpose":r==="no-transpose",_=await S(a,"strmv"),B=null,N=null,M=null,R=null;try{B=w?i._buf:x(i,"strmv-A",!1),N=p?l._buf:x(l,"strmv-x",!1),M=d?u._buf:x(u,"strmv-y",!0),R=D([{value:e,type:"u32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let L=k(_.getBindGroupLayout(0),[B,N,M,R]),j=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:F,ts:H}=T(_,L,j),O=d?null:A(F,M);I(F);let V=await P(H);if(d)return V!==void 0?{gpuTimeMs:V}:{};let U=await E(O,Float32Array);return V!==void 0?{y:U,gpuTimeMs:V}:{y:U}}finally{!w&&B&&c(B),!p&&N&&c(N),!d&&M&&c(M),R&&c(R)}}var dr=64;function It(a,t,r){let o=new ArrayBuffer(a*t),e=new DataView(o);for(let i=0;i<a;i++){let s=r(i),l=i*t;s.forEach((n,u)=>e.setUint32(l+u*4,n,!0))}return o}function Mt(a,t,r){let o=a.createBuffer({label:r,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,t),o}async function Dt(a,t,r,o,e,i,s,l,n,u="row-major"){let f=l instanceof G,m=i instanceof W,p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!m&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!f)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return f?{}:{x:l};if(!m&&i.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(m?i.layout:u)==="column-major",g=w?t==="upper":t==="lower",h=w?r==="transpose":r==="no-transpose",b=await S(a,"strsv_invert_block"),v=await S(a,"strsv_apply_inverse"),y=await S(a,"strsv_update"),_=h===g,B=[];for(let U=0;U<e;U+=dr)B.push(U);_||B.reverse();let N=B.length,M=a.limits.maxComputeWorkgroupsPerDimension,R=a.limits.minUniformBufferOffsetAlignment,L=null,j=null,F=null,H=null,O=null,V=null;try{L=m?i._buf:x(i,"strsv-A",!1),j=f?l._buf:x(l,"strsv-x",!0),F=Y(N*dr*dr*4,"strsv-Ainv");let U=It(N,R,K=>{let $=K*dr,X=Math.min($+dr,e);return[n,K,$,X]});H=Mt(a,U,"strsv-apply-params");let rr=It(N,R,K=>{let $=K*dr,X=Math.min($+dr,e);return[e,n,s,h?0:1,g?0:1,$,X]});O=Mt(a,rr,"strsv-update-params");let{commandEncoder:q,querySet:tr}=hr();V=D([{value:e,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ur=k(b.getBindGroupLayout(0),[L,F,V]);mr(q,b,ur,{x:dr,y:N},tr?{timestampWrites:{querySet:tr,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<B.length;K++){let $=B[K],X=Math.min($+dr,e),J=$/dr,or=K===B.length-1,cr=J*R,xr=k(v.getBindGroupLayout(0),[F,j,{buffer:H,offset:cr,size:16}]);mr(q,v,xr,1,or&&tr?{timestampWrites:{querySet:tr,endOfPassWriteIndex:1}}:void 0);let lr=_?e-X:$;if(lr===0)continue;let vr=k(y.getBindGroupLayout(0),[L,j,{buffer:O,offset:cr,size:32}]),Sr=Math.min(lr,M);mr(q,y,vr,Sr)}let sr=wr(q,tr),er=f?null:A(q,j);I(q);let Q=await P(sr);if(f)return Q!==void 0?{gpuTimeMs:Q}:{};let Z=await E(er,Float32Array);return Q!==void 0?{x:Z,gpuTimeMs:Q}:{x:Z}}finally{!m&&L&&c(L),!f&&j&&c(j),F&&c(F),H&&c(H),O&&c(O),V&&c(V)}}async function Tt(a,t,r,o,e,i,s,l,n,u,f="row-major"){let m=n instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(m&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<t||n.cols<r))throw new Error("A is too small for the given m and n.");(m?n.layout:f)==="column-major"&&([t,r]=[r,t],[e,s]=[s,e],[i,l]=[l,i]);let d=e instanceof G,w=s instanceof G;if(u<r)throw new Error("lda must be >= n.");if(!d&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(m&&d&&n._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&w&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||r<0)throw new Error("m and n must be non-negative.");if(t===0||r===0)return m?{}:{A:n};if(!m&&n.length<(t-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(e.length<(t-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await S(a,"sger"),h=null,b=null,v=null,y=null;try{h=d?e._buf:x(e,"sger-x",!1),b=w?s._buf:x(s,"sger-y",!1),v=m?n._buf:x(n,"sger-A",!0),y=D([{value:t,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let _=k(g.getBindGroupLayout(0),[h,b,v,y]),B=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:M}=T(g,_,B),R=m?null:A(N,v);I(N);let L=await P(M);if(m)return L!==void 0?{gpuTimeMs:L}:{};let j=await E(R,Float32Array);return L!==void 0?{A:j,gpuTimeMs:L}:{A:j}}finally{!d&&h&&c(h),!w&&b&&c(b),!m&&v&&c(v),y&&c(y)}}async function Lt(a,t,r,o,e,i,s,l,n="row-major"){let u=e instanceof G,f=s instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&u&&s._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{A:s};if(!f&&s.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?s.layout:n)==="column-major"?t==="upper":t==="lower",d=await S(a,"ssyr"),w=null,g=null,h=null;try{w=u?e._buf:x(e,"ssyr-x",!1),g=f?s._buf:x(s,"ssyr-A",!0),h=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let b=k(d.getBindGroupLayout(0),[w,g,h]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:y,ts:_}=T(d,b,v),B=f?null:A(y,g);I(y);let N=await P(_);if(f)return N!==void 0?{gpuTimeMs:N}:{};let M=await E(B,Float32Array);return N!==void 0?{A:M,gpuTimeMs:N}:{A:M}}finally{!u&&w&&c(w),!f&&g&&c(g),h&&c(h)}}async function Rt(a,t,r,o,e,i,s,l,n,u,f="row-major"){let m=e instanceof G,p=s instanceof G,d=n instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!d&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&!m)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(d&&m&&n._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(d&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(m&&e._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return d?{}:{A:n};if(!d&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(d?n.layout:f)==="column-major"?t==="upper":t==="lower",h=await S(a,"ssyr2"),b=null,v=null,y=null,_=null;try{b=m?e._buf:x(e,"ssyr2-x",!1),v=p?s._buf:x(s,"ssyr2-y",!1),y=d?n._buf:x(n,"ssyr2-A",!0),_=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let B=k(h.getBindGroupLayout(0),[b,v,y,_]),N=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:R}=T(h,B,N),L=d?null:A(M,y);I(M);let j=await P(R);if(d)return j!==void 0?{gpuTimeMs:j}:{};let F=await E(L,Float32Array);return j!==void 0?{A:F,gpuTimeMs:j}:{A:F}}finally{!m&&b&&c(b),!p&&v&&c(v),!d&&y&&c(y),_&&c(_)}}var Fo=32,Wo=32,Ho=64,Uo=64,Oo=36;async function jt(a,t,r,o,e,i,s,l,n,u,f,m,p,d,w="row-major"){let g=l instanceof W,h=u instanceof W,b=p instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(d))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||e===0)return b?{}:{C:p};let v=g?l.layout:w,y=h?u.layout:w,_=b?p.layout:w,B=v==="column-major"?i:o,N=v==="column-major"?o:i,M=t==="no-transpose"?B:N,R=t==="no-transpose"?N:B;if(n<R)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Q,Z]=t==="no-transpose"?[o,i]:[i,o];if(l.rows<Q||l.cols<Z)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(M-1)*n+R)throw new Error("A does not have enough elements for the given dimensions and lda.");let L=y==="column-major"?e:i,j=y==="column-major"?i:e,F=r==="no-transpose"?L:j,H=r==="no-transpose"?j:L;if(f<H)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Q,Z]=r==="no-transpose"?[i,e]:[e,i];if(u.rows<Q||u.cols<Z)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(F-1)*f+H)throw new Error("B does not have enough elements for the given dimensions and ldb.");let O=_==="column-major"?e:o,V=_==="column-major"?o:e;if(d<V)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(d!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<o||p.cols<e)throw new Error("C is too small for the given m and n.")}else if(p.length<(O-1)*d+V)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&([l,u]=[u,l],[g,h]=[h,g],[n,f]=[f,n],[t,r]=[r==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[o,e]=[e,o]);let U=Math.ceil(e/Uo),rr=Math.ceil(o/Ho),q=U*rr>=Oo,tr=await S(a,q?"sgemm_large":"sgemm_small"),ur=g?l._buf:x(l,"sgemm-A",!1),ir=h?u._buf:x(u,"sgemm-B",!1),sr=b?p._buf:x(p,"sgemm-C",!0),er=D([{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"u32"},{value:s,type:"f32"},{value:m,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:d,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let Q=k(tr.getBindGroupLayout(0),[ur,ir,sr,er]),Z=q?{x:Math.min(U,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(rr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(e/Wo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Fo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:K,ts:$}=T(tr,Q,Z),X=b?null:A(K,sr);I(K);let J=await P($);if(b)return J!==void 0?{gpuTimeMs:J}:{};let or=await E(X,Float32Array);return J!==void 0?{C:or,gpuTimeMs:J}:{C:or}}finally{g||c(ur),h||c(ir),b||c(sr),c(er)}}var Vo=32,Ko=32,zo=64,qo=64,Xo=36;async function Ct(a,t,r,o,e,i,s,l,n,u,f,m,p,d,w,g="row-major"){let h=n instanceof W,b=f instanceof W,v=d instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!v&&!(d instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!v)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(v&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(e<0||i<0||s<0)throw new Error("m, n, and k must be non-negative.");if(e===0||i===0)return v?{}:{C:d};let y=h?n.layout:g,_=b?f.layout:g,B=v?d.layout:g,N=y==="column-major"?s:e,M=y==="column-major"?e:s,R=r==="no-transpose"?N:M,L=r==="no-transpose"?M:N;if(u<L)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Z,K]=r==="no-transpose"?[e,s]:[s,e];if(n.rows<Z||n.cols<K)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(R-1)*u+L)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=_==="column-major"?i:s,F=_==="column-major"?s:i,H=o==="no-transpose"?j:F,O=o==="no-transpose"?F:j;if(m<O)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Z,K]=o==="no-transpose"?[s,i]:[i,s];if(f.rows<Z||f.cols<K)throw new Error("B is too small for the given n, k, and transB.")}else if(f.length<(H-1)*m+O)throw new Error("B does not have enough elements for the given dimensions and ldb.");let V=B==="column-major"?i:e,U=B==="column-major"?e:i;if(w<U)throw new Error(`ldc must be >= ${B==="column-major"?"rows":"cols"} of C as stored.`);if(v){if(w!==d.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(d.rows<e||d.cols<i)throw new Error("C is too small for the given m and n.")}else if(d.length<(V-1)*w+U)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),B==="column-major"&&([n,f]=[f,n],[h,b]=[b,h],[u,m]=[m,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[e,i]=[i,e],t=t==="lower"?"upper":"lower");let rr=Math.ceil(i/qo),q=Math.ceil(e/zo),tr=rr*q>=Xo,ur=await S(a,tr?"sgemmtr_large":"sgemmtr_small"),ir=h?n._buf:x(n,"sgemmtr-A",!1),sr=b?f._buf:x(f,"sgemmtr-B",!1),er=v?d._buf:x(d,"sgemmtr-C",!0),Q=D([{value:e,type:"u32"},{value:i,type:"u32"},{value:s,type:"u32"},{value:l,type:"f32"},{value:p,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:w,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let Z=k(ur.getBindGroupLayout(0),[ir,sr,er,Q]),K=tr?{x:Math.min(rr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/Ko),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(e/Vo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:$,ts:X}=T(ur,Z,K),J=v?null:A($,er);I($);let or=await P(X);if(v)return or!==void 0?{gpuTimeMs:or}:{};let cr=await E(J,Float32Array);return or!==void 0?{C:cr,gpuTimeMs:or}:{C:cr}}finally{h||c(ir),b||c(sr),v||c(er),c(Q)}}var Qo=32,Yo=32,Zo=64,$o=64,Jo=36;async function Ft(a,t,r,o,e,i,s,l,n,u,f,m="row-major"){let p=s instanceof W,d=u instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(f))throw new Error("n, k, lda, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(p&&!d)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(d&&!p)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return d?{}:{C:u};let w=p?s.layout:m,g=d?u.layout:m,h=w==="column-major"?e:o,b=w==="column-major"?o:e,v=r==="no-transpose"?h:b,y=r==="no-transpose"?b:h;if(l<y)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[U,rr]=r==="no-transpose"?[o,e]:[e,o];if(s.rows<U||s.cols<rr)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(v-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");if(f<o)throw new Error("ldc must be >= n.");if(d){if(f!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*f+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let _=r;w==="column-major"&&(_=_==="no-transpose"?"transpose":"no-transpose");let B=_==="no-transpose"?"transpose":"no-transpose",N=t;g==="column-major"&&([_,B]=[B==="no-transpose"?"transpose":"no-transpose",_==="no-transpose"?"transpose":"no-transpose"],N=N==="lower"?"upper":"lower");let M=Math.ceil(o/$o),R=Math.ceil(o/Zo),L=M*R>=Jo,j=await S(a,L?"sgemmtr_large":"sgemmtr_small"),F=p?s._buf:x(s,"ssyrk-A",!1),H=d?u._buf:x(u,"ssyrk-C",!0),O=p?Y(F.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(s,"ssyrk-B",!1),V=D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:_==="transpose"?1:0,type:"u32"},{value:B==="transpose"?1:0,type:"u32"},{value:N==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let U=k(j.getBindGroupLayout(0),[F,O,H,V]),rr=L?{x:Math.min(M,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(R,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Yo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Qo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:q,querySet:tr,passDescriptor:ur}=hr();p&&q.copyBufferToBuffer(F,0,O,0,F.size),mr(q,j,U,rr,ur);let ir=wr(q,tr),sr=d?null:A(q,H);I(q);let er=await P(ir);if(d)return er!==void 0?{gpuTimeMs:er}:{};let Q=await E(sr,Float32Array);return er!==void 0?{C:Q,gpuTimeMs:er}:{C:Q}}finally{p||c(F),c(O),d||c(H),c(V)}}var ra=32,ea=32,ta=64,oa=64,aa=36;async function Wt(a,t,r,o,e,i,s,l,n,u,f,m,p,d="row-major"){let w=s instanceof W,g=n instanceof W,h=m instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return h?{}:{C:m};let b=w?s.layout:d,v=g?n.layout:d,y=h?m.layout:d,_=b==="column-major"?e:o,B=b==="column-major"?o:e,N=r==="no-transpose"?_:B,M=r==="no-transpose"?B:_;if(l<M)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[X,J]=r==="no-transpose"?[o,e]:[e,o];if(s.rows<X||s.cols<J)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(N-1)*l+M)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=v==="column-major"?e:o,L=v==="column-major"?o:e,j=r==="no-transpose"?R:L,F=r==="no-transpose"?L:R;if(u<F)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[X,J]=r==="no-transpose"?[o,e]:[e,o];if(n.rows<X||n.cols<J)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(j-1)*u+F)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(p<o)throw new Error("ldc must be >= n.");if(h){if(p!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<o||m.cols<o)throw new Error("C is too small for the given n.")}else if(m.length<(o-1)*p+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let H=r;b==="column-major"&&(H=H==="no-transpose"?"transpose":"no-transpose");let O=r;v==="column-major"&&(O=O==="no-transpose"?"transpose":"no-transpose");let V=y==="column-major"?t==="lower"?"upper":"lower":t,U=X=>X==="no-transpose"?"transpose":"no-transpose";function rr(X,J,or,cr,xr,pr){let lr=X,vr=U(cr);return y!=="column-major"?{transX:lr,X:J,ldX:or,transY:vr,Y:xr,ldY:pr}:{transX:U(vr),X:xr,ldX:pr,transY:U(lr),Y:J,ldY:or}}let q=Math.ceil(o/oa),tr=Math.ceil(o/ta),ur=q*tr>=aa,ir=await S(a,ur?"sgemmtr_large":"sgemmtr_small"),sr=ur?{x:Math.min(q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(tr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/ea),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/ra),a.limits.maxComputeWorkgroupsPerDimension)},er=w?s._buf:x(s,"ssyr2k-A",!1),Q=g?n._buf:x(n,"ssyr2k-B",!1),Z=h?m._buf:x(m,"ssyr2k-C",!0),K=null,$=null;try{let X=rr(H,er,l,O,Q,u),J=rr(O,Q,u,H,er,l),or=(Br,Ot)=>D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:Ot,type:"f32"},{value:Br.ldX,type:"u32"},{value:Br.ldY,type:"u32"},{value:p,type:"u32"},{value:Br.transX==="transpose"?1:0,type:"u32"},{value:Br.transY==="transpose"?1:0,type:"u32"},{value:V==="upper"?1:0,type:"u32"}],"ssyr2k-params");K=or(X,f),$=or(J,1);let cr=k(ir.getBindGroupLayout(0),[X.X,X.Y,Z,K]),xr=k(ir.getBindGroupLayout(0),[J.X,J.Y,Z,$]),{commandEncoder:pr,querySet:lr}=hr(),vr=lr?{timestampWrites:{querySet:lr,beginningOfPassWriteIndex:0}}:void 0,Sr=lr?{timestampWrites:{querySet:lr,endOfPassWriteIndex:1}}:void 0;mr(pr,ir,cr,sr,vr),mr(pr,ir,xr,sr,Sr);let Ht=wr(pr,lr),Ut=h?null:A(pr,Z);I(pr);let _r=await P(Ht);if(h)return _r!==void 0?{gpuTimeMs:_r}:{};let Dr=await E(Ut,Float32Array);return _r!==void 0?{C:Dr,gpuTimeMs:_r}:{C:Dr}}finally{w||c(er),g||c(Q),h||c(Z),K&&c(K),$&&c($)}}return Qt(ia);})();
