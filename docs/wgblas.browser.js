var wgblas=(()=>{var Rt=Object.create;var wr=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var jt=Object.getOwnPropertyNames;var Ct=Object.getPrototypeOf,Ft=Object.prototype.hasOwnProperty;var br=(o=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(o,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):o)(function(o){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+o+'" is not supported')});var R=(o,e,r)=>()=>{if(r)throw r[0];try{return o&&(e=o(o=0)),e}catch(a){throw r=[a],a}};var kr=(o,e)=>{for(var r in e)wr(o,r,{get:e[r],enumerable:!0})},Sr=(o,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of jt(e))!Ft.call(o,t)&&t!==r&&wr(o,t,{get:()=>e[t],enumerable:!(a=Lt(e,t))||a.enumerable});return o};var hr=(o,e,r)=>(r=o!=null?Rt(Ct(o)):{},Sr(e||!o||!o.__esModule?wr(r,"default",{value:o,enumerable:!0}):r,o)),Wt=o=>Sr(wr({},"__esModule",{value:!0}),o);var Wr,Fr=R(()=>{Wr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Ur,Hr=R(()=>{Ur=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var Or,Vr=R(()=>{Or=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var zr,Kr=R(()=>{zr=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var Qr,qr=R(()=>{Qr=`// sscal: x = alpha * x

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
`});var Zr,Xr=R(()=>{Zr=`// sswap: x <-> y

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
`});var $r,Yr=R(()=>{$r=`// saxpy: y = alpha * x + y

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
`});var re,Jr=R(()=>{re=`// scopy: y = x

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
`});var te,ee=R(()=>{te=`// sdot: result = sum(x[i] * y[i])
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
`});var oe,ae=R(()=>{oe=`// sasum: result = sum(|x[i]|)
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
`});var ne,ie=R(()=>{ne=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var ue,se=R(()=>{ue=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var fe,le=R(()=>{fe=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ce,de=R(()=>{ce=`// isamax: returns index of element with largest absolute value
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
`});var pe,me=R(()=>{pe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var we,ge=R(()=>{we=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var he,be=R(()=>{he=`// ssymv: y = alpha * A * x + beta * y
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
`});var ve,xe=R(()=>{ve=`// strmv: y = op(A) * x
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
`});var _e,ye=R(()=>{_e=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Ee,Be=R(()=>{Ee=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var Ge,Ae=R(()=>{Ge=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var Se,ke=R(()=>{Se=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var Ie,Ne=R(()=>{Ie=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var Me,Pe=R(()=>{Me=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Te,De=R(()=>{Te=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Le,Re=R(()=>{Le=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Ce,je=R(()=>{Ce=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var We,Fe=R(()=>{We=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var Ue,He=R(()=>{Ue=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var Oe,Ve=R(()=>{Oe=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var ze,Ke=R(()=>{ze=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Qe,qe=R(()=>{Qe=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Ze,Xe=R(()=>{Ze=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var $e,Ye=R(()=>{$e=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var rt,Je=R(()=>{rt=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var tt,et=R(()=>{tt=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var at={};kr(at,{shaderSources:()=>Ea});var Ea,ot=R(()=>{Fr();Hr();Vr();Kr();qr();Xr();Yr();Jr();ee();ae();ie();se();le();de();me();ge();be();xe();ye();Be();Ae();ke();Ne();Pe();De();Re();je();Fe();He();Ve();Ke();qe();Xe();Ye();Je();et();Ea={"reduction/argmax":Wr,"reduction/argmaxF64":Ur,"reduction/sum":Or,"reduction/sumF64":zr,sscal:Qr,sswap:Zr,saxpy:$r,scopy:re,sdot:te,sasum:oe,snrm2:ne,srot:ue,srotm:fe,isamax:ce,sgemv_n:pe,sgemv_t:we,ssymv:he,strmv:ve,sger:_e,ssyr:Ee,ssyr2:Ge,f64add:Se,"f64/dekker":Ie,"f64/utils/abs":Me,"f64/utils/add":Te,"f64/utils/greater":Le,"f64/utils/equal":Ce,dasum:We,idamax:Ue,strsv_invert_block:Oe,strsv_apply_inverse:ze,strsv_update:Qe,sgemm_small:Ze,sgemm_large:$e,sgemmtr_small:rt,sgemmtr_large:tt}});var Fa={};kr(Fa,{GpuMatrix:()=>W,GpuVector:()=>_,cleanup:()=>Tr,dasum:()=>pt,gpuName:()=>Rr,idamax:()=>ht,init:()=>Dr,isamax:()=>bt,randomFloat32Array:()=>Lr,randomFloat64Array:()=>jr,randomTriangularFloat32Array:()=>Cr,sasum:()=>mt,saxpy:()=>ut,scopy:()=>lt,sdot:()=>dt,sgemm:()=>It,sgemmtr:()=>Pt,sgemv:()=>yt,sger:()=>kt,snrm2:()=>wt,srot:()=>xt,srotm:()=>vt,sscal:()=>nt,sswap:()=>st,ssymv:()=>_t,ssyr:()=>St,ssyr2:()=>Nt,strmv:()=>Bt,strsv:()=>Gt});function Nr(o,e){return e?o.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Ir(){if(!Pr())return{querySet:null,passDescriptor:void 0};let e=H().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function xr(o,e){if(!e)return null;let r=H(),a=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});o.resolveQuerySet(e,0,2,a,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return o.copyBufferToBuffer(a,0,t,0,16),{tsReadBuffer:t,resolveBuffer:a,querySet:e}}async function N(o){if(!o)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:a}=o;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),a.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var tr=null,dr=null,Mr=null,yr=!1;async function Dr({powerPreference:o="high-performance",benchmark:e=!1}={}){if(tr)return tr;let r;if(typeof window>"u"){let{create:i,globals:s}=await import("webgpu");Object.assign(globalThis,s),r=i([]),Mr=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if(dr=await r.requestAdapter({powerPreference:o})??await r.requestAdapter(),!dr)throw new Error("No WebGPU adapter found.");yr=e;let t=[...Nr(dr,e).requiredFeatures??[]];return tr=await dr.requestDevice({requiredFeatures:t}),tr.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),tr}function Tr(){tr&&(tr.destroy(),tr=null),dr=null,Mr=null,yr=!1}function Rr(){if(!dr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:o,description:e}=dr.info;return{description:e||"unknown",device:o||"unknown"}}function Pr(){return yr}function H(){if(!tr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return tr}function m(...o){o.flat().forEach(e=>e.destroy())}function h(o,e="blas-input",r=!1){let a=H(),t=a.limits.maxStorageBufferBindingSize,i=o.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=a.createBuffer({label:e,size:i,usage:s,mappedAtCreation:!0}),n=o.constructor;return new n(l.getMappedRange()).set(o),l.unmap(),l}function z(o,e="blas-storage"){return H().createBuffer({label:e,size:o,usage:GPUBufferUsage.STORAGE})}function $(o,e="blas-result"){return H().createBuffer({label:e,size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function G(o,e){let a=H().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return o.copyBufferToBuffer(e,0,a,0,e.size),a}function T(o,e="blas-params"){let r=H(),a=o.length*4,t=Math.ceil(a/16)*16,i=new ArrayBuffer(t),s=new DataView(i);o.forEach(({value:n,type:u},f)=>{let d=f*4;if(u==="u32")s.setUint32(d,n,!0);else if(u==="i32")s.setInt32(d,n,!0);else if(u==="f32")s.setFloat32(d,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function B(o,e=Float32Array){try{await o.mapAsync(GPUMapMode.READ);let r=new e(o.getMappedRange().slice());return o.unmap(),r}finally{o.destroy()}}function lr(o){let e=o.length,r=new Float32Array(e),a=new Float32Array(e);for(let t=0;t<e;t++){let i=Math.fround(o[t]);r[t]=i,a[t]=Math.fround(o[t]-i)}return{hi:r,lo:a}}function mr(o,e){let r=o.length,a=new Float64Array(r);for(let t=0;t<r;t++)a[t]=o[t]+e[t];return a}var _=class o{constructor(e,r,a=Float32Array,t=null){this._buf=e,this._loBuf=t,this.length=r,this.dtype=a}static from(e){if(e instanceof Float64Array){let{hi:a,lo:t}=lr(e),i=h(a,"gpu-vector-f64-hi",!0),s=h(t,"gpu-vector-f64-lo",!0);return new o(i,e.length,Float64Array,s)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=h(e,"gpu-vector",!0);return new o(r,e.length,e.constructor)}async read(){let e=H(),r=e.createCommandEncoder(),a=G(r,this._buf);if(e.queue.submit([r.finish()]),!this._loBuf)return B(a,this.dtype);let t=e.createCommandEncoder(),i=G(t,this._loBuf);e.queue.submit([t.finish()]);let[s,l]=await Promise.all([B(a,Float32Array),B(i,Float32Array)]);return mr(s,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var W=class o{constructor(e,r,a,t,i=null,s="row-major"){this._buf=e,this._loBuf=i,this.rows=r,this.cols=a,this.lda=t,this.layout=s}static from(e,r,a,t,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(t===void 0&&(t=s?a:r),!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(a)||a<=0)throw new Error("cols must be a positive integer.");let l=s?a:r;if(!Number.isInteger(t)||t<l)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?r:a;if(e.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(e instanceof Float64Array){let f=n*t,{hi:d,lo:p}=lr(e.subarray(0,f)),c=h(d,"gpu-matrix-f64-hi",!0),g=h(p,"gpu-matrix-f64-lo",!0);return new o(c,r,a,t,g,i)}let u=h(e.subarray(0,n*t),"gpu-matrix",!0);return new o(u,r,a,t,null,i)}async read(){let e=H(),r=e.createCommandEncoder(),a=G(r,this._buf);e.queue.submit([r.finish()]);let t=this.layout!=="column-major",i=t?this.rows:this.cols,s=t?this.cols:this.rows;if(this._loBuf){let u=e.createCommandEncoder(),f=G(u,this._loBuf);e.queue.submit([u.finish()]);let[d,p]=await Promise.all([B(a,Float32Array),B(f,Float32Array)]),c=mr(d,p);if(this.lda===s)return c;let g=new Float64Array(i*s);for(let w=0;w<i;w++)g.set(c.subarray(w*this.lda,w*this.lda+s),w*s);return g}let l=await B(a,Float32Array);if(this.lda===s)return l;let n=new Float32Array(i*s);for(let u=0;u<i;u++)n.set(l.subarray(u*this.lda,u*this.lda+s),u*s);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Lr(o,e=-1,r=1){let a=new Float32Array(o);for(let t=0;t<o;t++)a[t]=e+Math.random()*(r-e);return a}function jr(o,e=-1,r=1){let a=new Float64Array(o);for(let t=0;t<o;t++)a[t]=e+Math.random()*(r-e);return a}function Cr(o,e,r="lower",a=-1,t=1,i=5,s=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e<o)throw new Error("lda must be >= n.");let l=new Float32Array(o*e);for(let n=0;n<o;n++){for(let u=0;u<o;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(l[n*e+u]=a+Math.random()*(t-a))}l[n*e+n]=i+Math.random()*(s-i)}return l}function k(o,e,r=0){let a=H(),t=e.map((i,s)=>({binding:r+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return a.createBindGroup({layout:o,entries:t})}var Ht=new WeakMap;function I(o){H().queue.submit([o.finish()])}function _r(){let o=H(),{querySet:e,passDescriptor:r}=Ir();return{commandEncoder:o.createCommandEncoder(),querySet:e,passDescriptor:r}}function gr(o,e,r,a,t){let i=o.beginComputePass(t);i.setPipeline(e),i.setBindGroup(0,r),typeof a=="number"?i.dispatchWorkgroups(a):i.dispatchWorkgroups(a.x,a.y,a.z??1),i.end(),Ht.set(o,i)}function M(o,e,r){let{commandEncoder:a,querySet:t,passDescriptor:i}=_r();gr(a,o,e,r,i);let s=xr(a,t);return{commandEncoder:a,ts:s}}var ka={},Br=new WeakMap;async function S(o,e,r="main"){Br.has(o)||Br.set(o,new Map);let a=Br.get(o),t=Array.isArray(e)?e:[e],i=`${t.join("+")}::${r}`;return a.has(i)||a.set(i,await Ga(t,r)),a.get(i)}async function Aa(o){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(ot(),at)),r=e[o];if(!r)throw new Error(`Shader "${o}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:a,join:t}=await import("path"),i=a(r(ka.url));return e(t(i,`../shaders/${o}.wgsl`),"utf8")}}async function Ga(o,e="main"){let r=H(),a=o.join("+"),t=(await Promise.all(o.map(Aa))).join(`
`),i=r.createShaderModule({label:a,code:t}),l=(await i.getCompilationInfo()).messages.filter(f=>f.type==="error");if(l.length>0)throw new Error(`Shader "${a}" compilation failed:
${l.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let n=e==="main"?{module:i}:{module:i,entryPoint:e},u=r.createComputePipeline({label:a,layout:"auto",compute:n});return u._shaderModule=i,u}var Sa=64,it=8;function Z(o,e){let r=H().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(o/Sa),r):{x:Math.min(Math.ceil(e/it),r),y:Math.min(Math.ceil(o/it),r)}}async function nt(o,e,r,a,t){let i=a instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof _))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:a;if(a.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await S(o,"sscal"),l=null,n=null,u=null;try{l=i?a._buf:h(a,"sscal-x",!0),n=T([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=k(s.getBindGroupLayout(0),[l,n]),{commandEncoder:d,ts:p}=M(s,f,Z(e));u=i?null:G(d,l),I(d);let c=await N(p);if(i)return c!==void 0?{gpuTimeMs:c}:{};let g=await B(u,Float32Array);return u=null,c!==void 0?{x:g,gpuTimeMs:c}:g}finally{!i&&l&&m(l),n&&m(n),u&&m(u)}}async function st(o,e,r,a,t,i){let s=r instanceof _,l=t instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof _))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof _))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(o,"sswap"),u=null,f=null,d=null,p=null,c=null;try{u=s?r._buf:h(r,"sswap-x",!0),f=l?t._buf:h(t,"sswap-y",!0),d=T([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sswap-params");let g=k(n.getBindGroupLayout(0),[u,f,d]),{commandEncoder:w,ts:x}=M(n,g,Z(e));p=s?null:G(w,u),c=l?null:G(w,f),I(w);let b=await N(x);if(s&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await B(p,Float32Array);p=null;let v=await B(c,Float32Array);return c=null,b!==void 0?{x:y,y:v,gpuTimeMs:b}:{x:y,y:v}}finally{!s&&u&&m(u),!l&&f&&m(f),d&&m(d),p&&m(p),c&&m(c)}}async function ut(o,e,r,a,t,i,s){let l=a instanceof _,n=i instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:i};if(a.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(o,"saxpy"),f=null,d=null,p=null,c=null;try{f=l?a._buf:h(a,"saxpy-x",!1),d=n?i._buf:h(i,"saxpy-y",!0),p=T([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let g=k(u.getBindGroupLayout(0),[f,d,p]),{commandEncoder:w,ts:x}=M(u,g,Z(e));c=n?null:G(w,d),I(w);let b=await N(x);if(n&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await B(c,Float32Array);return c=null,b!==void 0?{y,gpuTimeMs:b}:{y}}finally{!l&&f&&m(f),!n&&d&&m(d),p&&m(p),c&&m(c)}}async function lt(o,e,r,a,t,i){let s=r instanceof _,l=t instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return l?{}:{y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(o,"scopy"),u=null,f=null,d=null,p=null;try{u=s?r._buf:h(r,"scopy-x",!1),f=l?t._buf:h(t,"scopy-y",!0),d=T([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"scopy-params");let c=k(n.getBindGroupLayout(0),[u,f,d]),{commandEncoder:g,ts:w}=M(n,c,Z(e));p=l?null:G(g,f),I(g);let x=await N(w);if(l&&s)return x!==void 0?{gpuTimeMs:x}:{};let b=await B(p,Float32Array);return p=null,x!==void 0?{y:b,gpuTimeMs:x}:{y:b}}finally{!s&&u&&m(u),!l&&f&&m(f),d&&m(d),p&&m(p)}}var ft=64;async function dt(o,e,r,a,t,i){let s=r instanceof _,l=t instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await S(o,"sdot"),u=await S(o,"reduction/sum"),f=null,d=null,p=null,c=null,g=null,w=null;try{f=s?r._buf:h(r,"sdot-x",!1),d=l?t._buf:h(t,"sdot-y",!1),p=z(2*ft*4,"sdot-partials"),c=$(4,"sdot-result"),g=T([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sdot-params");let x=k(n.getBindGroupLayout(0),[f,d,p,g]),{commandEncoder:b,ts:y}=M(n,x,2*ft);I(b);let v=k(u.getBindGroupLayout(0),[p,c]),{commandEncoder:A,ts:E}=M(u,v,1);w=G(A,c),I(A);let P=B(w,Float32Array);w=null;let[D,j,L]=await Promise.all([N(y),N(E),P]);return D!==void 0&&j!==void 0?{dot:L[0],gpuTimeMs:D+j}:{dot:L[0]}}finally{!s&&f&&m(f),!l&&d&&m(d),p&&m(p),c&&m(c),g&&m(g),w&&m(w)}}var ct=64;async function mt(o,e,r,a){let t=r instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(o,"sasum"),s=await S(o,"reduction/sum"),l=null,n=null,u=null,f=null,d=null;try{l=t?r._buf:h(r,"sasum-x",!1),n=z(2*ct*4,"sasum-partials"),u=$(4,"sasum-result"),f=T([{value:e,type:"u32"},{value:a,type:"u32"}],"sasum-params");let p=k(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:c,ts:g}=M(i,p,2*ct);I(c);let w=k(s.getBindGroupLayout(0),[n,u]),{commandEncoder:x,ts:b}=M(s,w,1);d=G(x,u),I(x);let y=B(d,Float32Array);d=null;let[v,A,E]=await Promise.all([N(g),N(b),y]);return v!==void 0&&A!==void 0?{asum:E[0],gpuTimeMs:v+A}:{asum:E[0]}}finally{!t&&l&&m(l),n&&m(n),u&&m(u),f&&m(f),d&&m(d)}}var Er=64;async function pt(o,e,r,a){let t=r instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],s=await S(o,[...i,"dasum"]),l=await S(o,[...i,"reduction/sumF64"]),n=null,u=null,f=null,d=null,p=null,c=null,g=null,w=null,x=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:O,lo:V}=lr(r.map(Math.abs));n=h(O,"dasum-xHi",!1),u=h(V,"dasum-xLo",!1)}f=z(2*Er*4,"dasum-partialsHi"),d=z(2*Er*4,"dasum-partialsLo"),p=$(4,"dasum-result-hi"),c=$(4,"dasum-result-lo"),g=T([{value:e,type:"u32"},{value:a,type:"u32"}],"dasum-params");let b=k(s.getBindGroupLayout(0),[n,u,f,d,g]),{commandEncoder:y,ts:v}=M(s,b,2*Er);I(y);let A=k(l.getBindGroupLayout(0),[f,d,p,c]),{commandEncoder:E,ts:P}=M(l,A,1);w=G(E,p),x=G(E,c),I(E);let D=B(w,Float32Array),j=B(x,Float32Array);w=null,x=null;let[L,C,F,U]=await Promise.all([N(v),N(P),D,j]),q=mr(F,U)[0];return L!==void 0&&C!==void 0?{asum:q,gpuTimeMs:L+C}:{asum:q}}finally{!t&&n&&m(n),!t&&u&&m(u),f&&m(f),d&&m(d),p&&m(p),c&&m(c),g&&m(g),w&&m(w),x&&m(x)}}var gt=64;async function wt(o,e,r,a){let t=r instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(o,"snrm2"),s=await S(o,"reduction/sum"),l=null,n=null,u=null,f=null,d=null;try{l=t?r._buf:h(r,"snrm2-x",!1),n=z(2*gt*4,"snrm2-partials"),u=$(4,"snrm2-result"),f=T([{value:e,type:"u32"},{value:a,type:"u32"}],"snrm2-params");let p=k(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:c,ts:g}=M(i,p,2*gt);I(c);let w=k(s.getBindGroupLayout(0),[n,u]),{commandEncoder:x,ts:b}=M(s,w,1);d=G(x,u),I(x);let y=B(d,Float32Array);d=null;let[v,A,E]=await Promise.all([N(g),N(b),y]),P=Math.sqrt(E[0]);return v!==void 0&&A!==void 0?{nrm2:P,gpuTimeMs:v+A}:{nrm2:P}}finally{!t&&l&&m(l),n&&m(n),u&&m(u),f&&m(f),d&&m(d)}}var Ar=64;async function bt(o,e,r,a){let t=r instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await S(o,"isamax"),s=await S(o,"reduction/argmax"),l=null,n=null,u=null,f=null,d=null,p=null;try{l=t?r._buf:h(r,"isamax-x",!1),n=z(2*Ar*4,"isamax-partials-val"),u=z(2*Ar*4,"isamax-partials-idx"),f=$(4,"isamax-result"),d=T([{value:e,type:"u32"},{value:a,type:"u32"}],"isamax-params");let c=k(i.getBindGroupLayout(0),[l,n,u,d]),{commandEncoder:g,ts:w}=M(i,c,2*Ar);I(g);let x=k(s.getBindGroupLayout(0),[n,u,f]),{commandEncoder:b,ts:y}=M(s,x,1);p=G(b,f),I(b);let v=B(p,Uint32Array);p=null;let[A,E,P]=await Promise.all([N(w),N(y),v]),D=P[0];return A!==void 0&&E!==void 0?{index:D,gpuTimeMs:A+E}:{index:D}}finally{!t&&l&&m(l),n&&m(n),u&&m(u),f&&m(f),d&&m(d),p&&m(p)}}var vr=64;async function ht(o,e,r,a){let t=r instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],s=await S(o,[...i,"idamax"],"idamax_main"),l=await S(o,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,f=null,d=null,p=null,c=null,g=null,w=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:F,lo:U}=lr(r);n=h(F,"idamax-xHi",!1),u=h(U,"idamax-xLo",!1)}f=z(2*vr*4,"idamax-partials-val-hi"),d=z(2*vr*4,"idamax-partials-val-lo"),p=z(2*vr*4,"idamax-partials-idx"),c=$(4,"idamax-result"),g=T([{value:e,type:"u32"},{value:a,type:"u32"}],"idamax-params");let x=k(s.getBindGroupLayout(0),[n,u,f,d,p,g]),{commandEncoder:b,ts:y}=M(s,x,2*vr);I(b);let v=k(l.getBindGroupLayout(0),[f,d,p,c]),{commandEncoder:A,ts:E}=M(l,v,1);w=G(A,c),I(A);let P=B(w,Uint32Array);w=null;let[D,j,L]=await Promise.all([N(y),N(E),P]),C=L[0];return D!==void 0&&j!==void 0?{index:C,gpuTimeMs:D+j}:{index:C}}finally{!t&&n&&m(n),!t&&u&&m(u),f&&m(f),d&&m(d),p&&m(p),c&&m(c),g&&m(g),w&&m(w)}}async function xt(o,e,r,a,t,i,s,l){let n=r instanceof _,u=t instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await S(o,"srot"),d=null,p=null,c=null,g=null,w=null;try{d=n?r._buf:h(r,"srot-x",!0),p=u?t._buf:h(t,"srot-y",!0),c=T([{value:e,type:"u32"},{value:s,type:"f32"},{value:l,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srot-params");let x=k(f.getBindGroupLayout(0),[d,p,c]),{commandEncoder:b,ts:y}=M(f,x,Z(e));g=n?null:G(b,d),w=u?null:G(b,p),I(b);let v=await N(y);if(n&&u)return v!==void 0?{gpuTimeMs:v}:{};let A=B(g,Float32Array),E=B(w,Float32Array);g=null,w=null;let[P,D]=await Promise.all([A,E]);return v!==void 0?{x:P,y:D,gpuTimeMs:v}:{x:P,y:D}}finally{!n&&d&&m(d),!u&&p&&m(p),c&&m(c),g&&m(g),w&&m(w)}}async function vt(o,e,r,a,t,i,s){let l=r instanceof _,n=t instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return l?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await S(o,"srotm"),f=null,d=null,p=null,c=null,g=null,w=null;try{f=l?r._buf:h(r,"srotm-x",!0),d=n?t._buf:h(t,"srotm-y",!0),p=h(s,"srotm-param",!1),c=T([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srotm-params");let x=k(u.getBindGroupLayout(0),[f,d,p,c]),{commandEncoder:b,ts:y}=M(u,x,Z(e));g=l?null:G(b,f),w=n?null:G(b,d),I(b);let v=await N(y);if(l&&n)return v!==void 0?{gpuTimeMs:v}:{};let A=B(g,Float32Array),E=B(w,Float32Array);g=null,w=null;let[P,D]=await Promise.all([A,E]);return v!==void 0?{x:P,y:D,gpuTimeMs:v}:{x:P,y:D}}finally{!l&&f&&m(f),!n&&d&&m(d),p&&m(p),c&&m(c),g&&m(g),w&&m(w)}}async function yt(o,e,r,a,t,i,s,l,n,u,f,d,p="row-major"){let c=i instanceof W,g=l instanceof _,w=f instanceof _;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n)||!Number.isInteger(d)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||d<=0)throw new Error("incx and incy must be positive.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(g!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(g&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!g)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(g&&l._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<r||i.cols<a))throw new Error("A is too small for the given m and n.");if(r<0||a<0)throw new Error("m and n must be non-negative.");if(r===0||a===0)return w?{}:{y:f};(c?i.layout:p)==="column-major"&&([r,a]=[a,r],e=e==="no-transpose"?"transpose":"no-transpose");let b=e==="no-transpose",y=b?a:r,v=b?r:a;if(s<a)throw new Error("lda must be >= n.");if(!c&&i.length<(r-1)*s+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(y-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(v-1)*d+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let E=await S(o,b?"sgemv_n":"sgemv_t"),P=c?i._buf:h(i,"sgemv-A",!1),D=g?l._buf:h(l,"sgemv-x",!1),j=w?f._buf:h(f,"sgemv-y",!0),L=T([{value:r,type:"u32"},{value:a,type:"u32"},{value:t,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:d,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let C=k(E.getBindGroupLayout(0),[P,D,j,L]),F=b?Math.min(r,o.limits.maxComputeWorkgroupsPerDimension):Z(v),{commandEncoder:U,ts:q}=M(E,C,F),O=w?null:G(U,j);I(U);let V=await N(q);if(w)return V!==void 0?{gpuTimeMs:V}:{};let er=await B(O,Float32Array);return V!==void 0?{y:er,gpuTimeMs:V}:{y:er}}finally{c||m(P),g||m(D),w||m(j),m(L)}}async function _t(o,e,r,a,t,i,s,l,n,u,f,d="row-major"){let p=s instanceof _,c=u instanceof _,g=t instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!g&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{y:u};if(!g&&t.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let x=(g?t.layout:d)==="column-major"?e==="upper":e==="lower",b=await S(o,"ssymv"),y=null,v=null,A=null,E=null;try{y=g?t._buf:h(t,"ssymv-A",!1),v=p?s._buf:h(s,"ssymv-x",!1),A=c?u._buf:h(u,"ssymv-y",!0),E=T([{value:r,type:"u32"},{value:a,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:x?0:1,type:"u32"}],"ssymv-params");let P=k(b.getBindGroupLayout(0),[y,v,A,E]),D=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:L}=M(b,P,D),C=c?null:G(j,A);I(j);let F=await N(L);if(c)return F!==void 0?{gpuTimeMs:F}:{};let U=await B(C,Float32Array);return F!==void 0?{y:U,gpuTimeMs:F}:{y:U}}finally{!g&&y&&m(y),!p&&v&&m(v),!c&&A&&m(A),E&&m(E)}}async function Bt(o,e,r,a,t,i,s,l,n,u,f,d="row-major"){let p=l instanceof _,c=u instanceof _,g=i instanceof W,w=a==="unit";if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!w&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!g&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(g&&c&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(g&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return c?{}:{y:u};if(!g&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(t-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(g?i.layout:d)==="column-major",y=b?e==="upper":e==="lower",v=b?r==="transpose":r==="no-transpose",A=await S(o,"strmv"),E=null,P=null,D=null,j=null;try{E=g?i._buf:h(i,"strmv-A",!1),P=p?l._buf:h(l,"strmv-x",!1),D=c?u._buf:h(u,"strmv-y",!0),j=T([{value:t,type:"u32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:v?0:1,type:"u32"},{value:y?0:1,type:"u32"},{value:w?1:0,type:"u32"}],"strmv-params");let L=k(A.getBindGroupLayout(0),[E,P,D,j]),C=Math.min(t,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:F,ts:U}=M(A,L,C),q=c?null:G(F,D);I(F);let O=await N(U);if(c)return O!==void 0?{gpuTimeMs:O}:{};let V=await B(q,Float32Array);return O!==void 0?{y:V,gpuTimeMs:O}:{y:V}}finally{!g&&E&&m(E),!p&&P&&m(P),!c&&D&&m(D),j&&m(j)}}var ar=64;function Et(o,e,r){let a=new ArrayBuffer(o*e),t=new DataView(a);for(let i=0;i<o;i++){let s=r(i),l=i*e;s.forEach((n,u)=>t.setUint32(l+u*4,n,!0))}return a}function At(o,e,r){let a=o.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return o.queue.writeBuffer(a,0,e),a}async function Gt(o,e,r,a,t,i,s,l,n,u="row-major"){let f=l instanceof _,d=i instanceof W,p=a==="unit";if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!d&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!d)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(d&&!f)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(d&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{x:l};if(!d&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let g=(d?i.layout:u)==="column-major",w=g?e==="upper":e==="lower",x=g?r==="transpose":r==="no-transpose",b=await S(o,"strsv_invert_block"),y=await S(o,"strsv_apply_inverse"),v=await S(o,"strsv_update"),A=x===w,E=[];for(let V=0;V<t;V+=ar)E.push(V);A||E.reverse();let P=E.length,D=o.limits.maxComputeWorkgroupsPerDimension,j=o.limits.minUniformBufferOffsetAlignment,L=null,C=null,F=null,U=null,q=null,O=null;try{L=d?i._buf:h(i,"strsv-A",!1),C=f?l._buf:h(l,"strsv-x",!0),F=z(P*ar*ar*4,"strsv-Ainv");let V=Et(P,j,K=>{let X=K*ar,or=Math.min(X+ar,t);return[n,K,X,or]});U=At(o,V,"strsv-apply-params");let er=Et(P,j,K=>{let X=K*ar,or=Math.min(X+ar,t);return[t,n,s,x?0:1,w?0:1,X,or]});q=At(o,er,"strsv-update-params");let{commandEncoder:J,querySet:rr}=_r();O=T([{value:t,type:"u32"},{value:s,type:"u32"},{value:x?0:1,type:"u32"},{value:w?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let fr=k(b.getBindGroupLayout(0),[L,F,O]);gr(J,b,fr,{x:ar,y:P},rr?{timestampWrites:{querySet:rr,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<E.length;K++){let X=E[K],or=Math.min(X+ar,t),ur=X/ar,ir=K===E.length-1,pr=ur*j,Mt=k(y.getBindGroupLayout(0),[F,C,{buffer:U,offset:pr,size:16}]);gr(J,y,Mt,1,ir&&rr?{timestampWrites:{querySet:rr,endOfPassWriteIndex:1}}:void 0);let Gr=A?t-or:X;if(Gr===0)continue;let Dt=k(v.getBindGroupLayout(0),[L,C,{buffer:q,offset:pr,size:32}]),Tt=Math.min(Gr,D);gr(J,v,Dt,Tt)}let nr=xr(J,rr),sr=f?null:G(J,C);I(J);let Y=await N(nr);if(f)return Y!==void 0?{gpuTimeMs:Y}:{};let Q=await B(sr,Float32Array);return Y!==void 0?{x:Q,gpuTimeMs:Y}:{x:Q}}finally{!d&&L&&m(L),!f&&C&&m(C),F&&m(F),U&&m(U),q&&m(q),O&&m(O)}}async function kt(o,e,r,a,t,i,s,l,n,u,f="row-major"){let d=n instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!d&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(d&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");(d?n.layout:f)==="column-major"&&([e,r]=[r,e],[t,s]=[s,t],[i,l]=[l,i]);let c=t instanceof _,g=s instanceof _;if(u<r)throw new Error("lda must be >= n.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(d&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(d&&g&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return d?{}:{A:n};if(!d&&n.length<(e-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await S(o,"sger"),x=null,b=null,y=null,v=null;try{x=c?t._buf:h(t,"sger-x",!1),b=g?s._buf:h(s,"sger-y",!1),y=d?n._buf:h(n,"sger-A",!0),v=T([{value:e,type:"u32"},{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let A=k(w.getBindGroupLayout(0),[x,b,y,v]),E=Math.min(e,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:P,ts:D}=M(w,A,E),j=d?null:G(P,y);I(P);let L=await N(D);if(d)return L!==void 0?{gpuTimeMs:L}:{};let C=await B(j,Float32Array);return L!==void 0?{A:C,gpuTimeMs:L}:{A:C}}finally{!c&&x&&m(x),!g&&b&&m(b),!d&&y&&m(y),v&&m(v)}}async function St(o,e,r,a,t,i,s,l,n="row-major"){let u=t instanceof _,f=s instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&u&&s._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{A:s};if(!f&&s.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?s.layout:n)==="column-major"?e==="upper":e==="lower",c=await S(o,"ssyr"),g=null,w=null,x=null;try{g=u?t._buf:h(t,"ssyr-x",!1),w=f?s._buf:h(s,"ssyr-A",!0),x=T([{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let b=k(c.getBindGroupLayout(0),[g,w,x]),y=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:v,ts:A}=M(c,b,y),E=f?null:G(v,w);I(v);let P=await N(A);if(f)return P!==void 0?{gpuTimeMs:P}:{};let D=await B(E,Float32Array);return P!==void 0?{A:D,gpuTimeMs:P}:{A:D}}finally{!u&&g&&m(g),!f&&w&&m(w),x&&m(x)}}async function Nt(o,e,r,a,t,i,s,l,n,u,f="row-major"){let d=t instanceof _,p=s instanceof _,c=n instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&d&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(d&&t._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{A:n};if(!c&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let w=(c?n.layout:f)==="column-major"?e==="upper":e==="lower",x=await S(o,"ssyr2"),b=null,y=null,v=null,A=null;try{b=d?t._buf:h(t,"ssyr2-x",!1),y=p?s._buf:h(s,"ssyr2-y",!1),v=c?n._buf:h(n,"ssyr2-A",!0),A=T([{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:w?0:1,type:"u32"}],"ssyr2-params");let E=k(x.getBindGroupLayout(0),[b,y,v,A]),P=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:D,ts:j}=M(x,E,P),L=c?null:G(D,v);I(D);let C=await N(j);if(c)return C!==void 0?{gpuTimeMs:C}:{};let F=await B(L,Float32Array);return C!==void 0?{A:F,gpuTimeMs:C}:{A:F}}finally{!d&&b&&m(b),!p&&y&&m(y),!c&&v&&m(v),A&&m(A)}}var Na=32,Ia=32,Pa=64,Ma=64,Da=36;async function It(o,e,r,a,t,i,s,l,n,u,f,d,p,c,g="row-major"){let w=l instanceof W,x=u instanceof W,b=p instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof d!="number")throw new Error("beta must be a number.");if(Number.isNaN(d))throw new Error("beta must not be NaN.");if(!Number.isFinite(d))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!w&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!x&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||x)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!w||!x))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||t<0||i<0)throw new Error("m, n, and k must be non-negative.");if(a===0||t===0)return b?{}:{C:p};let y=w?l.layout:g,v=x?u.layout:g,A=b?p.layout:g,E=y==="column-major"?i:a,P=y==="column-major"?a:i,D=e==="no-transpose"?E:P,j=e==="no-transpose"?P:E;if(n<j)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,Q]=e==="no-transpose"?[a,i]:[i,a];if(l.rows<Y||l.cols<Q)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(D-1)*n+j)throw new Error("A does not have enough elements for the given dimensions and lda.");let L=v==="column-major"?t:i,C=v==="column-major"?i:t,F=r==="no-transpose"?L:C,U=r==="no-transpose"?C:L;if(f<U)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(x){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,Q]=r==="no-transpose"?[i,t]:[t,i];if(u.rows<Y||u.cols<Q)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(F-1)*f+U)throw new Error("B does not have enough elements for the given dimensions and ldb.");let q=A==="column-major"?t:a,O=A==="column-major"?a:t;if(c<O)throw new Error(`ldc must be >= ${A==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<a||p.cols<t)throw new Error("C is too small for the given m and n.")}else if(p.length<(q-1)*c+O)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),A==="column-major"&&([l,u]=[u,l],[w,x]=[x,w],[n,f]=[f,n],[e,r]=[r==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[a,t]=[t,a]);let V=Math.ceil(t/Ma),er=Math.ceil(a/Pa),J=V*er>=Da,rr=await S(o,J?"sgemm_large":"sgemm_small"),fr=w?l._buf:h(l,"sgemm-A",!1),cr=x?u._buf:h(u,"sgemm-B",!1),nr=b?p._buf:h(p,"sgemm-C",!0),sr=T([{value:a,type:"u32"},{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"f32"},{value:d,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:c,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let Y=k(rr.getBindGroupLayout(0),[fr,cr,nr,sr]),Q=J?{x:Math.min(V,o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(er,o.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(t/Ia),o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(a/Na),o.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:K,ts:X}=M(rr,Y,Q),or=b?null:G(K,nr);I(K);let ur=await N(X);if(b)return ur!==void 0?{gpuTimeMs:ur}:{};let ir=await B(or,Float32Array);return ur!==void 0?{C:ir,gpuTimeMs:ur}:{C:ir}}finally{w||m(fr),x||m(cr),b||m(nr),m(sr)}}var Ta=32,Ra=32,La=64,ja=64,Ca=36;async function Pt(o,e,r,a,t,i,s,l,n,u,f,d,p,c,g,w="row-major"){let x=n instanceof W,b=f instanceof W,y=c instanceof W;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(d)||!Number.isInteger(g))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!x&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!y&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((x||b)&&!y)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(y&&(!x||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(t<0||i<0||s<0)throw new Error("m, n, and k must be non-negative.");if(t===0||i===0)return y?{}:{C:c};let v=x?n.layout:w,A=b?f.layout:w,E=y?c.layout:w,P=v==="column-major"?s:t,D=v==="column-major"?t:s,j=r==="no-transpose"?P:D,L=r==="no-transpose"?D:P;if(u<L)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(x){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Q,K]=r==="no-transpose"?[t,s]:[s,t];if(n.rows<Q||n.cols<K)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(j-1)*u+L)throw new Error("A does not have enough elements for the given dimensions and lda.");let C=A==="column-major"?i:s,F=A==="column-major"?s:i,U=a==="no-transpose"?C:F,q=a==="no-transpose"?F:C;if(d<q)throw new Error(`ldb must be >= ${A==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(d!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Q,K]=a==="no-transpose"?[s,i]:[i,s];if(f.rows<Q||f.cols<K)throw new Error("B is too small for the given n, k, and transB.")}else if(f.length<(U-1)*d+q)throw new Error("B does not have enough elements for the given dimensions and ldb.");let O=E==="column-major"?i:t,V=E==="column-major"?t:i;if(g<V)throw new Error(`ldc must be >= ${E==="column-major"?"rows":"cols"} of C as stored.`);if(y){if(g!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<t||c.cols<i)throw new Error("C is too small for the given m and n.")}else if(c.length<(O-1)*g+V)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),A==="column-major"&&(a=a==="no-transpose"?"transpose":"no-transpose"),E==="column-major"&&([n,f]=[f,n],[x,b]=[b,x],[u,d]=[d,u],[r,a]=[a==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[t,i]=[i,t],e=e==="lower"?"upper":"lower");let er=Math.ceil(i/ja),J=Math.ceil(t/La),rr=er*J>=Ca,fr=await S(o,rr?"sgemmtr_large":"sgemmtr_small"),cr=x?n._buf:h(n,"sgemmtr-A",!1),nr=b?f._buf:h(f,"sgemmtr-B",!1),sr=y?c._buf:h(c,"sgemmtr-C",!0),Y=T([{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"u32"},{value:l,type:"f32"},{value:p,type:"f32"},{value:u,type:"u32"},{value:d,type:"u32"},{value:g,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:a==="transpose"?1:0,type:"u32"},{value:e==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let Q=k(fr.getBindGroupLayout(0),[cr,nr,sr,Y]),K=rr?{x:Math.min(er,o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,o.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/Ra),o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(t/Ta),o.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:X,ts:or}=M(fr,Q,K),ur=y?null:G(X,sr);I(X);let ir=await N(or);if(y)return ir!==void 0?{gpuTimeMs:ir}:{};let pr=await B(ur,Float32Array);return ir!==void 0?{C:pr,gpuTimeMs:ir}:{C:pr}}finally{x||m(cr),b||m(nr),y||m(sr),m(Y)}}return Wt(Fa);})();
