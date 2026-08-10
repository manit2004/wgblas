var wgblas=(()=>{var It=Object.create;var pr=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var Dt=Object.getOwnPropertyNames;var Lt=Object.getPrototypeOf,Mt=Object.prototype.hasOwnProperty;var gr=(o=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(o,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):o)(function(o){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+o+'" is not supported')});var j=(o,e,r)=>()=>{if(r)throw r[0];try{return o&&(e=o(o=0)),e}catch(a){throw r=[a],a}};var kr=(o,e)=>{for(var r in e)pr(o,r,{get:e[r],enumerable:!0})},Sr=(o,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of Dt(e))!Mt.call(o,t)&&t!==r&&pr(o,t,{get:()=>e[t],enumerable:!(a=Nt(e,t))||a.enumerable});return o};var wr=(o,e,r)=>(r=o!=null?It(Lt(o)):{},Sr(e||!o||!o.__esModule?pr(r,"default",{value:o,enumerable:!0}):r,o)),jt=o=>Sr(pr({},"__esModule",{value:!0}),o);var Cr,Rr=j(()=>{Cr=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var Ur,Hr=j(()=>{Ur=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var Or,Vr=j(()=>{Or=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var qr,zr=j(()=>{qr=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var Qr,Kr=j(()=>{Qr=`// sscal: x = alpha * x

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
`});var Xr,Zr=j(()=>{Xr=`// sswap: x <-> y

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
`});var $r,Yr=j(()=>{$r=`// saxpy: y = alpha * x + y

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
`});var re,Jr=j(()=>{re=`// scopy: y = x

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
`});var te,ee=j(()=>{te=`// sdot: result = sum(x[i] * y[i])
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
`});var oe,ae=j(()=>{oe=`// sasum: result = sum(|x[i]|)
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
`});var ne,ie=j(()=>{ne=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var ue,se=j(()=>{ue=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var fe,le=j(()=>{fe=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ce,de=j(()=>{ce=`// isamax: returns index of element with largest absolute value
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
`});var pe,me=j(()=>{pe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var we,ge=j(()=>{we=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var he,be=j(()=>{he=`// ssymv: y = alpha * A * x + beta * y
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
`});var ve,xe=j(()=>{ve=`// strmv: y = op(A) * x
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
`});var _e,ye=j(()=>{_e=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Ee,Be=j(()=>{Ee=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var Ge,Ae=j(()=>{Ge=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var Se,ke=j(()=>{Se=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var Ie,Pe=j(()=>{Ie=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var De,Ne=j(()=>{De=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Me,Le=j(()=>{Me=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Fe,je=j(()=>{Fe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var We,Te=j(()=>{We=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var Ce,Re=j(()=>{Ce=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var Ue,He=j(()=>{Ue=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var Oe,Ve=j(()=>{Oe=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var qe,ze=j(()=>{qe=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Qe,Ke=j(()=>{Qe=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Xe,Ze=j(()=>{Xe=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var $e,Ye=j(()=>{$e=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var Je={};kr(Je,{shaderSources:()=>ba});var ba,rt=j(()=>{Rr();Hr();Vr();zr();Kr();Zr();Yr();Jr();ee();ae();ie();se();le();de();me();ge();be();xe();ye();Be();Ae();ke();Pe();Ne();Le();je();Te();Re();He();Ve();ze();Ke();Ze();Ye();ba={"reduction/argmax":Cr,"reduction/argmaxF64":Ur,"reduction/sum":Or,"reduction/sumF64":qr,sscal:Qr,sswap:Xr,saxpy:$r,scopy:re,sdot:te,sasum:oe,snrm2:ne,srot:ue,srotm:fe,isamax:ce,sgemv_n:pe,sgemv_t:we,ssymv:he,strmv:ve,sger:_e,ssyr:Ee,ssyr2:Ge,f64add:Se,"f64/dekker":Ie,"f64/utils/abs":De,"f64/utils/add":Me,"f64/utils/greater":Fe,"f64/utils/equal":We,dasum:Ce,idamax:Ue,strsv_invert_block:Oe,strsv_apply_inverse:qe,strsv_update:Qe,sgemm_small:Xe,sgemm_large:$e}});var ka={};kr(ka,{GpuMatrix:()=>H,GpuVector:()=>y,cleanup:()=>Mr,dasum:()=>ft,gpuName:()=>jr,idamax:()=>pt,init:()=>Lr,isamax:()=>mt,randomFloat32Array:()=>Fr,randomFloat64Array:()=>Tr,randomTriangularFloat32Array:()=>Wr,sasum:()=>lt,saxpy:()=>ot,scopy:()=>it,sdot:()=>st,sgemm:()=>Gt,sgemv:()=>bt,sger:()=>Bt,snrm2:()=>ct,srot:()=>gt,srotm:()=>wt,sscal:()=>tt,sswap:()=>at,ssymv:()=>ht,ssyr:()=>Et,ssyr2:()=>At,strmv:()=>xt,strsv:()=>_t});function Pr(o,e){return e?o.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Ir(){if(!Nr())return{querySet:null,passDescriptor:void 0};let e=C().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function br(o,e){if(!e)return null;let r=C(),a=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});o.resolveQuerySet(e,0,2,a,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return o.copyBufferToBuffer(a,0,t,0,16),{tsReadBuffer:t,resolveBuffer:a,querySet:e}}async function P(o){if(!o)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:a}=o;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),a.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var $=null,nr=null,Dr=null,vr=!1;async function Lr({powerPreference:o="high-performance",benchmark:e=!1}={}){if($)return $;let r;if(typeof window>"u"){let{create:i,globals:u}=await import("webgpu");Object.assign(globalThis,u),r=i([]),Dr=r}else r=navigator.gpu;if(!r)throw new Error("WebGPU not supported in this environment.");if(nr=await r.requestAdapter({powerPreference:o})??await r.requestAdapter(),!nr)throw new Error("No WebGPU adapter found.");vr=e;let t=[...Pr(nr,e).requiredFeatures??[]];return $=await nr.requestDevice({requiredFeatures:t}),$.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),$}function Mr(){$&&($.destroy(),$=null),nr=null,Dr=null,vr=!1}function jr(){if(!nr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:o,description:e}=nr.info;return{description:e||"unknown",device:o||"unknown"}}function Nr(){return vr}function C(){if(!$)throw new Error("WebGPU device not initialized \u2014 call init() first.");return $}function c(...o){o.flat().forEach(e=>e.destroy())}function b(o,e="blas-input",r=!1){let a=C(),t=a.limits.maxStorageBufferBindingSize,i=o.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let u=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=a.createBuffer({label:e,size:i,usage:u,mappedAtCreation:!0}),n=o.constructor;return new n(l.getMappedRange()).set(o),l.unmap(),l}function O(o,e="blas-storage"){return C().createBuffer({label:e,size:o,usage:GPUBufferUsage.STORAGE})}function Q(o,e="blas-result"){return C().createBuffer({label:e,size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function E(o,e){let a=C().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return o.copyBufferToBuffer(e,0,a,0,e.size),a}function L(o,e="blas-params"){let r=C(),a=o.length*4,t=Math.ceil(a/16)*16,i=new ArrayBuffer(t),u=new DataView(i);o.forEach(({value:n,type:s},f)=>{let d=f*4;if(s==="u32")u.setUint32(d,n,!0);else if(s==="i32")u.setInt32(d,n,!0);else if(s==="f32")u.setFloat32(d,n,!0);else throw new Error(`Unknown param type "${s}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function _(o,e=Float32Array){try{await o.mapAsync(GPUMapMode.READ);let r=new e(o.getMappedRange().slice());return o.unmap(),r}finally{o.destroy()}}function ar(o){let e=o.length,r=new Float32Array(e),a=new Float32Array(e);for(let t=0;t<e;t++){let i=Math.fround(o[t]);r[t]=i,a[t]=Math.fround(o[t]-i)}return{hi:r,lo:a}}function ur(o,e){let r=o.length,a=new Float64Array(r);for(let t=0;t<r;t++)a[t]=o[t]+e[t];return a}var y=class o{constructor(e,r,a=Float32Array,t=null){this._buf=e,this._loBuf=t,this.length=r,this.dtype=a}static from(e){if(e instanceof Float64Array){let{hi:a,lo:t}=ar(e),i=b(a,"gpu-vector-f64-hi",!0),u=b(t,"gpu-vector-f64-lo",!0);return new o(i,e.length,Float64Array,u)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=b(e,"gpu-vector",!0);return new o(r,e.length,e.constructor)}async read(){let e=C(),r=e.createCommandEncoder(),a=E(r,this._buf);if(e.queue.submit([r.finish()]),!this._loBuf)return _(a,this.dtype);let t=e.createCommandEncoder(),i=E(t,this._loBuf);e.queue.submit([t.finish()]);let[u,l]=await Promise.all([_(a,Float32Array),_(i,Float32Array)]);return ur(u,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var H=class o{constructor(e,r,a,t,i=null,u="row-major"){this._buf=e,this._loBuf=i,this.rows=r,this.cols=a,this.lda=t,this.layout=u}static from(e,r,a,t,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let u=i==="row-major";if(t===void 0&&(t=u?a:r),!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(a)||a<=0)throw new Error("cols must be a positive integer.");let l=u?a:r;if(!Number.isInteger(t)||t<l)throw new Error(`lda must be an integer >= ${u?"cols":"rows"}.`);let n=u?r:a;if(e.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(e instanceof Float64Array){let f=n*t,{hi:d,lo:p}=ar(e.subarray(0,f)),m=b(d,"gpu-matrix-f64-hi",!0),g=b(p,"gpu-matrix-f64-lo",!0);return new o(m,r,a,t,g,i)}let s=b(e.subarray(0,n*t),"gpu-matrix",!0);return new o(s,r,a,t,null,i)}async read(){let e=C(),r=e.createCommandEncoder(),a=E(r,this._buf);e.queue.submit([r.finish()]);let t=this.layout!=="column-major",i=t?this.rows:this.cols,u=t?this.cols:this.rows;if(this._loBuf){let s=e.createCommandEncoder(),f=E(s,this._loBuf);e.queue.submit([s.finish()]);let[d,p]=await Promise.all([_(a,Float32Array),_(f,Float32Array)]),m=ur(d,p);if(this.lda===u)return m;let g=new Float64Array(i*u);for(let w=0;w<i;w++)g.set(m.subarray(w*this.lda,w*this.lda+u),w*u);return g}let l=await _(a,Float32Array);if(this.lda===u)return l;let n=new Float32Array(i*u);for(let s=0;s<i;s++)n.set(l.subarray(s*this.lda,s*this.lda+u),s*u);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Fr(o,e=-1,r=1){let a=new Float32Array(o);for(let t=0;t<o;t++)a[t]=e+Math.random()*(r-e);return a}function Tr(o,e=-1,r=1){let a=new Float64Array(o);for(let t=0;t<o;t++)a[t]=e+Math.random()*(r-e);return a}function Wr(o,e,r="lower",a=-1,t=1,i=5,u=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e<o)throw new Error("lda must be >= n.");let l=new Float32Array(o*e);for(let n=0;n<o;n++){for(let s=0;s<o;s++){if(n===s)continue;(r==="lower"?s<n:s>n)&&(l[n*e+s]=a+Math.random()*(t-a))}l[n*e+n]=i+Math.random()*(u-i)}return l}function G(o,e,r=0){let a=C(),t=e.map((i,u)=>({binding:r+u,resource:i instanceof GPUBuffer?{buffer:i}:i}));return a.createBindGroup({layout:o,entries:t})}var Ft=new WeakMap;function I(o){C().queue.submit([o.finish()])}function yr(){let o=C(),{querySet:e,passDescriptor:r}=Ir();return{commandEncoder:o.createCommandEncoder(),querySet:e,passDescriptor:r}}function fr(o,e,r,a,t){let i=o.beginComputePass(t);i.setPipeline(e),i.setBindGroup(0,r),typeof a=="number"?i.dispatchWorkgroups(a):i.dispatchWorkgroups(a.x,a.y,a.z??1),i.end(),Ft.set(o,i)}function D(o,e,r){let{commandEncoder:a,querySet:t,passDescriptor:i}=yr();fr(a,o,e,r,i);let u=br(a,t);return{commandEncoder:a,ts:u}}var va={},_r=new WeakMap;async function k(o,e,r="main"){_r.has(o)||_r.set(o,new Map);let a=_r.get(o),t=Array.isArray(e)?e:[e],i=`${t.join("+")}::${r}`;return a.has(i)||a.set(i,await xa(t,r)),a.get(i)}async function ha(o){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(rt(),Je)),r=e[o];if(!r)throw new Error(`Shader "${o}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:a,join:t}=await import("path"),i=a(r(va.url));return e(t(i,`../shaders/${o}.wgsl`),"utf8")}}async function xa(o,e="main"){let r=C(),a=o.join("+"),t=(await Promise.all(o.map(ha))).join(`
`),i=r.createShaderModule({label:a,code:t}),l=(await i.getCompilationInfo()).messages.filter(f=>f.type==="error");if(l.length>0)throw new Error(`Shader "${a}" compilation failed:
${l.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let n=e==="main"?{module:i}:{module:i,entryPoint:e},s=r.createComputePipeline({label:a,layout:"auto",compute:n});return s._shaderModule=i,s}var ya=64,et=8;function q(o,e){let r=C().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(o/ya),r):{x:Math.min(Math.ceil(e/et),r),y:Math.min(Math.ceil(o/et),r)}}async function tt(o,e,r,a,t){let i=a instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof y))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:a;if(a.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let u=await k(o,"sscal"),l=null,n=null,s=null;try{l=i?a._buf:b(a,"sscal-x",!0),n=L([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let f=G(u.getBindGroupLayout(0),[l,n]),{commandEncoder:d,ts:p}=D(u,f,q(e));s=i?null:E(d,l),I(d);let m=await P(p);if(i)return m!==void 0?{gpuTimeMs:m}:{};let g=await _(s,Float32Array);return s=null,m!==void 0?{x:g,gpuTimeMs:m}:g}finally{!i&&l&&c(l),n&&c(n),s&&c(s)}}async function at(o,e,r,a,t,i){let u=r instanceof y,l=t instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof y))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof y))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return u?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(o,"sswap"),s=null,f=null,d=null,p=null,m=null;try{s=u?r._buf:b(r,"sswap-x",!0),f=l?t._buf:b(t,"sswap-y",!0),d=L([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sswap-params");let g=G(n.getBindGroupLayout(0),[s,f,d]),{commandEncoder:w,ts:x}=D(n,g,q(e));p=u?null:E(w,s),m=l?null:E(w,f),I(w);let h=await P(x);if(u&&l)return h!==void 0?{gpuTimeMs:h}:{};let B=await _(p,Float32Array);p=null;let v=await _(m,Float32Array);return m=null,h!==void 0?{x:B,y:v,gpuTimeMs:h}:{x:B,y:v}}finally{!u&&s&&c(s),!l&&f&&c(f),d&&c(d),p&&c(p),m&&c(m)}}async function ot(o,e,r,a,t,i,u){let l=a instanceof y,n=i instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(u))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||u<=0)throw new Error("incx and incy must be positive.");if(!l&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:i};if(a.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await k(o,"saxpy"),f=null,d=null,p=null,m=null;try{f=l?a._buf:b(a,"saxpy-x",!1),d=n?i._buf:b(i,"saxpy-y",!0),p=L([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:u,type:"u32"}],"saxpy-params");let g=G(s.getBindGroupLayout(0),[f,d,p]),{commandEncoder:w,ts:x}=D(s,g,q(e));m=n?null:E(w,d),I(w);let h=await P(x);if(n&&l)return h!==void 0?{gpuTimeMs:h}:{};let B=await _(m,Float32Array);return m=null,h!==void 0?{y:B,gpuTimeMs:h}:{y:B}}finally{!l&&f&&c(f),!n&&d&&c(d),p&&c(p),m&&c(m)}}async function it(o,e,r,a,t,i){let u=r instanceof y,l=t instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return l?{}:{y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(o,"scopy"),s=null,f=null,d=null,p=null;try{s=u?r._buf:b(r,"scopy-x",!1),f=l?t._buf:b(t,"scopy-y",!0),d=L([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"scopy-params");let m=G(n.getBindGroupLayout(0),[s,f,d]),{commandEncoder:g,ts:w}=D(n,m,q(e));p=l?null:E(g,f),I(g);let x=await P(w);if(l&&u)return x!==void 0?{gpuTimeMs:x}:{};let h=await _(p,Float32Array);return p=null,x!==void 0?{y:h,gpuTimeMs:x}:{y:h}}finally{!u&&s&&c(s),!l&&f&&c(f),d&&c(d),p&&c(p)}}var nt=64;async function st(o,e,r,a,t,i){let u=r instanceof y,l=t instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!u&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(o,"sdot"),s=await k(o,"reduction/sum"),f=null,d=null,p=null,m=null,g=null,w=null;try{f=u?r._buf:b(r,"sdot-x",!1),d=l?t._buf:b(t,"sdot-y",!1),p=O(2*nt*4,"sdot-partials"),m=Q(4,"sdot-result"),g=L([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"sdot-params");let x=G(n.getBindGroupLayout(0),[f,d,p,g]),{commandEncoder:h,ts:B}=D(n,x,2*nt);I(h);let v=G(s.getBindGroupLayout(0),[p,m]),{commandEncoder:S,ts:A}=D(s,v,1);w=E(S,m),I(S);let N=_(w,Float32Array);w=null;let[M,F,T]=await Promise.all([P(B),P(A),N]);return M!==void 0&&F!==void 0?{dot:T[0],gpuTimeMs:M+F}:{dot:T[0]}}finally{!u&&f&&c(f),!l&&d&&c(d),p&&c(p),m&&c(m),g&&c(g),w&&c(w)}}var ut=64;async function lt(o,e,r,a){let t=r instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(o,"sasum"),u=await k(o,"reduction/sum"),l=null,n=null,s=null,f=null,d=null;try{l=t?r._buf:b(r,"sasum-x",!1),n=O(2*ut*4,"sasum-partials"),s=Q(4,"sasum-result"),f=L([{value:e,type:"u32"},{value:a,type:"u32"}],"sasum-params");let p=G(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:m,ts:g}=D(i,p,2*ut);I(m);let w=G(u.getBindGroupLayout(0),[n,s]),{commandEncoder:x,ts:h}=D(u,w,1);d=E(x,s),I(x);let B=_(d,Float32Array);d=null;let[v,S,A]=await Promise.all([P(g),P(h),B]);return v!==void 0&&S!==void 0?{asum:A[0],gpuTimeMs:v+S}:{asum:A[0]}}finally{!t&&l&&c(l),n&&c(n),s&&c(s),f&&c(f),d&&c(d)}}var Br=64;async function ft(o,e,r,a){let t=r instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],u=await k(o,[...i,"dasum"]),l=await k(o,[...i,"reduction/sumF64"]),n=null,s=null,f=null,d=null,p=null,m=null,g=null,w=null,x=null;try{if(t)n=r._buf,s=r._loBuf;else{let{hi:z,lo:V}=ar(r.map(Math.abs));n=b(z,"dasum-xHi",!1),s=b(V,"dasum-xLo",!1)}f=O(2*Br*4,"dasum-partialsHi"),d=O(2*Br*4,"dasum-partialsLo"),p=Q(4,"dasum-result-hi"),m=Q(4,"dasum-result-lo"),g=L([{value:e,type:"u32"},{value:a,type:"u32"}],"dasum-params");let h=G(u.getBindGroupLayout(0),[n,s,f,d,g]),{commandEncoder:B,ts:v}=D(u,h,2*Br);I(B);let S=G(l.getBindGroupLayout(0),[f,d,p,m]),{commandEncoder:A,ts:N}=D(l,S,1);w=E(A,p),x=E(A,m),I(A);let M=_(w,Float32Array),F=_(x,Float32Array);w=null,x=null;let[T,W,R,U]=await Promise.all([P(v),P(N),M,F]),K=ur(R,U)[0];return T!==void 0&&W!==void 0?{asum:K,gpuTimeMs:T+W}:{asum:K}}finally{!t&&n&&c(n),!t&&s&&c(s),f&&c(f),d&&c(d),p&&c(p),m&&c(m),g&&c(g),w&&c(w),x&&c(x)}}var dt=64;async function ct(o,e,r,a){let t=r instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(o,"snrm2"),u=await k(o,"reduction/sum"),l=null,n=null,s=null,f=null,d=null;try{l=t?r._buf:b(r,"snrm2-x",!1),n=O(2*dt*4,"snrm2-partials"),s=Q(4,"snrm2-result"),f=L([{value:e,type:"u32"},{value:a,type:"u32"}],"snrm2-params");let p=G(i.getBindGroupLayout(0),[l,n,f]),{commandEncoder:m,ts:g}=D(i,p,2*dt);I(m);let w=G(u.getBindGroupLayout(0),[n,s]),{commandEncoder:x,ts:h}=D(u,w,1);d=E(x,s),I(x);let B=_(d,Float32Array);d=null;let[v,S,A]=await Promise.all([P(g),P(h),B]),N=Math.sqrt(A[0]);return v!==void 0&&S!==void 0?{nrm2:N,gpuTimeMs:v+S}:{nrm2:N}}finally{!t&&l&&c(l),n&&c(n),s&&c(s),f&&c(f),d&&c(d)}}var Er=64;async function mt(o,e,r,a){let t=r instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(o,"isamax"),u=await k(o,"reduction/argmax"),l=null,n=null,s=null,f=null,d=null,p=null;try{l=t?r._buf:b(r,"isamax-x",!1),n=O(2*Er*4,"isamax-partials-val"),s=O(2*Er*4,"isamax-partials-idx"),f=Q(4,"isamax-result"),d=L([{value:e,type:"u32"},{value:a,type:"u32"}],"isamax-params");let m=G(i.getBindGroupLayout(0),[l,n,s,d]),{commandEncoder:g,ts:w}=D(i,m,2*Er);I(g);let x=G(u.getBindGroupLayout(0),[n,s,f]),{commandEncoder:h,ts:B}=D(u,x,1);p=E(h,f),I(h);let v=_(p,Uint32Array);p=null;let[S,A,N]=await Promise.all([P(w),P(B),v]),M=N[0];return S!==void 0&&A!==void 0?{index:M,gpuTimeMs:S+A}:{index:M}}finally{!t&&l&&c(l),n&&c(n),s&&c(s),f&&c(f),d&&c(d),p&&c(p)}}var hr=64;async function pt(o,e,r,a){let t=r instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],u=await k(o,[...i,"idamax"],"idamax_main"),l=await k(o,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,s=null,f=null,d=null,p=null,m=null,g=null,w=null;try{if(t)n=r._buf,s=r._loBuf;else{let{hi:R,lo:U}=ar(r);n=b(R,"idamax-xHi",!1),s=b(U,"idamax-xLo",!1)}f=O(2*hr*4,"idamax-partials-val-hi"),d=O(2*hr*4,"idamax-partials-val-lo"),p=O(2*hr*4,"idamax-partials-idx"),m=Q(4,"idamax-result"),g=L([{value:e,type:"u32"},{value:a,type:"u32"}],"idamax-params");let x=G(u.getBindGroupLayout(0),[n,s,f,d,p,g]),{commandEncoder:h,ts:B}=D(u,x,2*hr);I(h);let v=G(l.getBindGroupLayout(0),[f,d,p,m]),{commandEncoder:S,ts:A}=D(l,v,1);w=E(S,m),I(S);let N=_(w,Uint32Array);w=null;let[M,F,T]=await Promise.all([P(B),P(A),N]),W=T[0];return M!==void 0&&F!==void 0?{index:W,gpuTimeMs:M+F}:{index:W}}finally{!t&&n&&c(n),!t&&s&&c(s),f&&c(f),d&&c(d),p&&c(p),m&&c(m),g&&c(g),w&&c(w)}}async function gt(o,e,r,a,t,i,u,l){let n=r instanceof y,s=t instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof u!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(u)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(u))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!s&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==s)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await k(o,"srot"),d=null,p=null,m=null,g=null,w=null;try{d=n?r._buf:b(r,"srot-x",!0),p=s?t._buf:b(t,"srot-y",!0),m=L([{value:e,type:"u32"},{value:u,type:"f32"},{value:l,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srot-params");let x=G(f.getBindGroupLayout(0),[d,p,m]),{commandEncoder:h,ts:B}=D(f,x,q(e));g=n?null:E(h,d),w=s?null:E(h,p),I(h);let v=await P(B);if(n&&s)return v!==void 0?{gpuTimeMs:v}:{};let S=_(g,Float32Array),A=_(w,Float32Array);g=null,w=null;let[N,M]=await Promise.all([S,A]);return v!==void 0?{x:N,y:M,gpuTimeMs:v}:{x:N,y:M}}finally{!n&&d&&c(d),!s&&p&&c(p),m&&c(m),g&&c(g),w&&c(w)}}async function wt(o,e,r,a,t,i,u){let l=r instanceof y,n=t instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(u instanceof Float32Array)||u.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||u[0]===-2)return l?{}:{x:r,y:t};if(r.length<(e-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let s=await k(o,"srotm"),f=null,d=null,p=null,m=null,g=null,w=null;try{f=l?r._buf:b(r,"srotm-x",!0),d=n?t._buf:b(t,"srotm-y",!0),p=b(u,"srotm-param",!1),m=L([{value:e,type:"u32"},{value:a,type:"u32"},{value:i,type:"u32"}],"srotm-params");let x=G(s.getBindGroupLayout(0),[f,d,p,m]),{commandEncoder:h,ts:B}=D(s,x,q(e));g=l?null:E(h,f),w=n?null:E(h,d),I(h);let v=await P(B);if(l&&n)return v!==void 0?{gpuTimeMs:v}:{};let S=_(g,Float32Array),A=_(w,Float32Array);g=null,w=null;let[N,M]=await Promise.all([S,A]);return v!==void 0?{x:N,y:M,gpuTimeMs:v}:{x:N,y:M}}finally{!l&&f&&c(f),!n&&d&&c(d),p&&c(p),m&&c(m),g&&c(g),w&&c(w)}}async function bt(o,e,r,a,t,i,u,l,n,s,f,d,p="row-major"){let m=i instanceof H,g=l instanceof y,w=f instanceof y;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof s!="number")throw new Error("beta must be a number.");if(Number.isNaN(s))throw new Error("beta must not be NaN.");if(!Number.isFinite(s))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n)||!Number.isInteger(d)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||d<=0)throw new Error("incx and incy must be positive.");if(!m&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(g!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(g&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&l._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(i.rows<r||i.cols<a))throw new Error("A is too small for the given m and n.");if(r<0||a<0)throw new Error("m and n must be non-negative.");if(r===0||a===0)return w?{}:{y:f};(m?i.layout:p)==="column-major"&&([r,a]=[a,r],e=e==="no-transpose"?"transpose":"no-transpose");let h=e==="no-transpose",B=h?a:r,v=h?r:a;if(u<a)throw new Error("lda must be >= n.");if(!m&&i.length<(r-1)*u+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(B-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(v-1)*d+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let A=await k(o,h?"sgemv_n":"sgemv_t"),N=m?i._buf:b(i,"sgemv-A",!1),M=g?l._buf:b(l,"sgemv-x",!1),F=w?f._buf:b(f,"sgemv-y",!0),T=L([{value:r,type:"u32"},{value:a,type:"u32"},{value:t,type:"f32"},{value:s,type:"f32"},{value:n,type:"u32"},{value:d,type:"u32"},{value:u,type:"u32"}],"sgemv-params");try{let W=G(A.getBindGroupLayout(0),[N,M,F,T]),R=h?Math.min(r,o.limits.maxComputeWorkgroupsPerDimension):q(v),{commandEncoder:U,ts:K}=D(A,W,R),z=w?null:E(U,F);I(U);let V=await P(K);if(w)return V!==void 0?{gpuTimeMs:V}:{};let or=await _(z,Float32Array);return V!==void 0?{y:or,gpuTimeMs:V}:{y:or}}finally{m||c(N),g||c(M),w||c(F),c(T)}}async function ht(o,e,r,a,t,i,u,l,n,s,f,d="row-major"){let p=u instanceof y,m=s instanceof y,g=t instanceof H;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!g&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(u instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&u._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(g&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return m?{}:{y:s};if(!g&&t.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(u.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let x=(g?t.layout:d)==="column-major"?e==="upper":e==="lower",h=await k(o,"ssymv"),B=null,v=null,S=null,A=null;try{B=g?t._buf:b(t,"ssymv-A",!1),v=p?u._buf:b(u,"ssymv-x",!1),S=m?s._buf:b(s,"ssymv-y",!0),A=L([{value:r,type:"u32"},{value:a,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:x?0:1,type:"u32"}],"ssymv-params");let N=G(h.getBindGroupLayout(0),[B,v,S,A]),M=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:F,ts:T}=D(h,N,M),W=m?null:E(F,S);I(F);let R=await P(T);if(m)return R!==void 0?{gpuTimeMs:R}:{};let U=await _(W,Float32Array);return R!==void 0?{y:U,gpuTimeMs:R}:{y:U}}finally{!g&&B&&c(B),!p&&v&&c(v),!m&&S&&c(S),A&&c(A)}}async function xt(o,e,r,a,t,i,u,l,n,s,f,d="row-major"){let p=l instanceof y,m=s instanceof y,g=i instanceof H,w=a==="unit";if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!w&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!g&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&l._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!g)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(g&&m&&i._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(g&&u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(g&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return m?{}:{y:s};if(!g&&i.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(g?i.layout:d)==="column-major",B=h?e==="upper":e==="lower",v=h?r==="transpose":r==="no-transpose",S=await k(o,"strmv"),A=null,N=null,M=null,F=null;try{A=g?i._buf:b(i,"strmv-A",!1),N=p?l._buf:b(l,"strmv-x",!1),M=m?s._buf:b(s,"strmv-y",!0),F=L([{value:t,type:"u32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:u,type:"u32"},{value:v?0:1,type:"u32"},{value:B?0:1,type:"u32"},{value:w?1:0,type:"u32"}],"strmv-params");let T=G(S.getBindGroupLayout(0),[A,N,M,F]),W=Math.min(t,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:R,ts:U}=D(S,T,W),K=m?null:E(R,M);I(R);let z=await P(U);if(m)return z!==void 0?{gpuTimeMs:z}:{};let V=await _(K,Float32Array);return z!==void 0?{y:V,gpuTimeMs:z}:{y:V}}finally{!g&&A&&c(A),!p&&N&&c(N),!m&&M&&c(M),F&&c(F)}}var J=64;function vt(o,e,r){let a=new ArrayBuffer(o*e),t=new DataView(a);for(let i=0;i<o;i++){let u=r(i),l=i*e;u.forEach((n,s)=>t.setUint32(l+s*4,n,!0))}return a}function yt(o,e,r){let a=o.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return o.queue.writeBuffer(a,0,e),a}async function _t(o,e,r,a,t,i,u,l,n,s="row-major"){let f=l instanceof y,d=i instanceof H,p=a==="unit";if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(s!=="row-major"&&s!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(u))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(u<t)throw new Error("lda must be >= n.");if(!d&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!d)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(d&&u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return f?{}:{x:l};if(!d&&i.length<(t-1)*u+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let g=(d?i.layout:s)==="column-major",w=g?e==="upper":e==="lower",x=g?r==="transpose":r==="no-transpose",h=await k(o,"strsv_invert_block"),B=await k(o,"strsv_apply_inverse"),v=await k(o,"strsv_update"),S=x===w,A=[];for(let V=0;V<t;V+=J)A.push(V);S||A.reverse();let N=A.length,M=o.limits.maxComputeWorkgroupsPerDimension,F=o.limits.minUniformBufferOffsetAlignment,T=null,W=null,R=null,U=null,K=null,z=null;try{T=d?i._buf:b(i,"strsv-A",!1),W=f?l._buf:b(l,"strsv-x",!0),R=O(N*J*J*4,"strsv-Ainv");let V=vt(N,F,Z=>{let X=Z*J,ir=Math.min(X+J,t);return[n,Z,X,ir]});U=yt(o,V,"strsv-apply-params");let or=vt(N,F,Z=>{let X=Z*J,ir=Math.min(X+J,t);return[t,n,u,x?0:1,w?0:1,X,ir]});K=yt(o,or,"strsv-update-params");let{commandEncoder:rr,querySet:er}=yr();z=L([{value:t,type:"u32"},{value:u,type:"u32"},{value:x?0:1,type:"u32"},{value:w?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let dr=G(h.getBindGroupLayout(0),[T,R,z]);fr(rr,h,dr,{x:J,y:N},er?{timestampWrites:{querySet:er,beginningOfPassWriteIndex:0}}:void 0);for(let Z=0;Z<A.length;Z++){let X=A[Z],ir=Math.min(X+J,t),sr=X/J,mr=Z===A.length-1,Ar=sr*F,kt=G(B.getBindGroupLayout(0),[R,W,{buffer:U,offset:Ar,size:16}]);fr(rr,B,kt,1,mr&&er?{timestampWrites:{querySet:er,endOfPassWriteIndex:1}}:void 0);let Gr=S?t-ir:X;if(Gr===0)continue;let St=G(v.getBindGroupLayout(0),[T,W,{buffer:K,offset:Ar,size:32}]),Pt=Math.min(Gr,M);fr(rr,v,St,Pt)}let lr=br(rr,er),cr=f?null:E(rr,W);I(rr);let Y=await P(lr);if(f)return Y!==void 0?{gpuTimeMs:Y}:{};let tr=await _(cr,Float32Array);return Y!==void 0?{x:tr,gpuTimeMs:Y}:{x:tr}}finally{!d&&T&&c(T),!f&&W&&c(W),R&&c(R),U&&c(U),K&&c(K),z&&c(z)}}async function Bt(o,e,r,a,t,i,u,l,n,s,f="row-major"){let d=n instanceof H;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!d&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(d&&s!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");(d?n.layout:f)==="column-major"&&([e,r]=[r,e],[t,u]=[u,t],[i,l]=[l,i]);let m=t instanceof y,g=u instanceof y;if(s<r)throw new Error("lda must be >= n.");if(!m&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&m&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(d&&g&&n._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return d?{}:{A:n};if(!d&&n.length<(e-1)*s+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(u.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let w=await k(o,"sger"),x=null,h=null,B=null,v=null;try{x=m?t._buf:b(t,"sger-x",!1),h=g?u._buf:b(u,"sger-y",!1),B=d?n._buf:b(n,"sger-A",!0),v=L([{value:e,type:"u32"},{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"}],"sger-params");let S=G(w.getBindGroupLayout(0),[x,h,B,v]),A=Math.min(e,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:M}=D(w,S,A),F=d?null:E(N,B);I(N);let T=await P(M);if(d)return T!==void 0?{gpuTimeMs:T}:{};let W=await _(F,Float32Array);return T!==void 0?{A:W,gpuTimeMs:T}:{A:W}}finally{!m&&x&&c(x),!g&&h&&c(h),!d&&B&&c(B),v&&c(v)}}async function Et(o,e,r,a,t,i,u,l,n="row-major"){let s=t instanceof y,f=u instanceof H;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!f&&!(u instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!s&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(s&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&s&&u._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&l!==u.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(u.rows<r||u.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return f?{}:{A:u};if(!f&&u.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?u.layout:n)==="column-major"?e==="upper":e==="lower",m=await k(o,"ssyr"),g=null,w=null,x=null;try{g=s?t._buf:b(t,"ssyr-x",!1),w=f?u._buf:b(u,"ssyr-A",!0),x=L([{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let h=G(m.getBindGroupLayout(0),[g,w,x]),B=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:v,ts:S}=D(m,h,B),A=f?null:E(v,w);I(v);let N=await P(S);if(f)return N!==void 0?{gpuTimeMs:N}:{};let M=await _(A,Float32Array);return N!==void 0?{A:M,gpuTimeMs:N}:{A:M}}finally{!s&&g&&c(g),!f&&w&&c(w),x&&c(x)}}async function At(o,e,r,a,t,i,u,l,n,s,f="row-major"){let d=t instanceof y,p=u instanceof y,m=n instanceof H;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(s<r)throw new Error("lda must be >= n.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&d&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&p&&n._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(d&&t._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(m&&s!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return m?{}:{A:n};if(!m&&n.length<(r-1)*s+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let w=(m?n.layout:f)==="column-major"?e==="upper":e==="lower",x=await k(o,"ssyr2"),h=null,B=null,v=null,S=null;try{h=d?t._buf:b(t,"ssyr2-x",!1),B=p?u._buf:b(u,"ssyr2-y",!1),v=m?n._buf:b(n,"ssyr2-A",!0),S=L([{value:r,type:"u32"},{value:a,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"},{value:w?0:1,type:"u32"}],"ssyr2-params");let A=G(x.getBindGroupLayout(0),[h,B,v,S]),N=Math.min(r,o.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:F}=D(x,A,N),T=m?null:E(M,v);I(M);let W=await P(F);if(m)return W!==void 0?{gpuTimeMs:W}:{};let R=await _(T,Float32Array);return W!==void 0?{A:R,gpuTimeMs:W}:{A:R}}finally{!d&&h&&c(h),!p&&B&&c(B),!m&&v&&c(v),S&&c(S)}}var _a=32,Ba=32,Ea=64,Aa=64,Ga=36;async function Gt(o,e,r,a,t,i,u,l,n,s,f,d,p,m,g="row-major"){let w=l instanceof H,x=s instanceof H,h=p instanceof H;if(!(o instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof u!="number")throw new Error("alpha must be a number.");if(Number.isNaN(u))throw new Error("alpha must not be NaN.");if(!Number.isFinite(u))throw new Error("alpha must be finite.");if(typeof d!="number")throw new Error("beta must be a number.");if(Number.isNaN(d))throw new Error("beta must not be NaN.");if(!Number.isFinite(d))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(m))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!w&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!x&&!(s instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||x)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!x))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||t<0||i<0)throw new Error("m, n, and k must be non-negative.");if(a===0||t===0)return h?{}:{C:p};let B=w?l.layout:g,v=x?s.layout:g,S=h?p.layout:g,A=B==="column-major"?i:a,N=B==="column-major"?a:i,M=e==="no-transpose"?A:N,F=e==="no-transpose"?N:A;if(n<F)throw new Error(`lda must be >= ${B==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,tr]=e==="no-transpose"?[a,i]:[i,a];if(l.rows<Y||l.cols<tr)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(M-1)*n+F)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=v==="column-major"?t:i,W=v==="column-major"?i:t,R=r==="no-transpose"?T:W,U=r==="no-transpose"?W:T;if(f<U)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(x){if(f!==s.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,tr]=r==="no-transpose"?[i,t]:[t,i];if(s.rows<Y||s.cols<tr)throw new Error("B is too small for the given n, k, and transB.")}else if(s.length<(R-1)*f+U)throw new Error("B does not have enough elements for the given dimensions and ldb.");let K=S==="column-major"?t:a,z=S==="column-major"?a:t;if(m<z)throw new Error(`ldc must be >= ${S==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(m!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<a||p.cols<t)throw new Error("C is too small for the given m and n.")}else if(p.length<(K-1)*m+z)throw new Error("C does not have enough elements for the given dimensions and ldc.");B==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),S==="column-major"&&([l,s]=[s,l],[w,x]=[x,w],[n,f]=[f,n],[e,r]=[r==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[a,t]=[t,a]);let V=Math.ceil(t/Aa),or=Math.ceil(a/Ea),rr=V*or>=Ga,er=await k(o,rr?"sgemm_large":"sgemm_small"),dr=w?l._buf:b(l,"sgemm-A",!1),xr=x?s._buf:b(s,"sgemm-B",!1),lr=h?p._buf:b(p,"sgemm-C",!0),cr=L([{value:a,type:"u32"},{value:t,type:"u32"},{value:i,type:"u32"},{value:u,type:"f32"},{value:d,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:m,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let Y=G(er.getBindGroupLayout(0),[dr,xr,lr,cr]),tr=rr?{x:Math.min(V,o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(or,o.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(t/Ba),o.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(a/_a),o.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Z,ts:X}=D(er,Y,tr),ir=h?null:E(Z,lr);I(Z);let sr=await P(X);if(h)return sr!==void 0?{gpuTimeMs:sr}:{};let mr=await _(ir,Float32Array);return sr!==void 0?{C:mr,gpuTimeMs:sr}:{C:mr}}finally{w||c(dr),x||c(xr),h||c(lr),c(cr)}}return jt(ka);})();
