var wgblas=(()=>{var $t=Object.create;var kr=Object.defineProperty;var Jt=Object.getOwnPropertyDescriptor;var ro=Object.getOwnPropertyNames;var eo=Object.getPrototypeOf,to=Object.prototype.hasOwnProperty;var Nr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var F=(a,t,r)=>()=>{if(r)throw r[0];try{return a&&(t=a(a=0)),t}catch(o){throw r=[o],o}};var Fr=(a,t)=>{for(var r in t)kr(a,r,{get:t[r],enumerable:!0})},Wr=(a,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of ro(t))!to.call(a,e)&&e!==r&&kr(a,e,{get:()=>t[e],enumerable:!(o=Jt(t,e))||o.enumerable});return a};var Sr=(a,t,r)=>(r=a!=null?$t(eo(a)):{},Wr(t||!a||!a.__esModule?kr(r,"default",{value:a,enumerable:!0}):r,a)),oo=a=>Wr(kr({},"__esModule",{value:!0}),a);var $r,Zr=F(()=>{$r=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var re,Jr=F(()=>{re=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var te,ee=F(()=>{te=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var ae,oe=F(()=>{ae=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var se,ie=F(()=>{se=`// sscal: x = alpha * x

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
`});var ue,ne=F(()=>{ue=`// sswap: x <-> y

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
`});var fe,le=F(()=>{fe=`// saxpy: y = alpha * x + y

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
`});var de,me=F(()=>{de=`// scopy: y = x

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
`});var pe,ce=F(()=>{pe=`// sdot: result = sum(x[i] * y[i])
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
`});var ge,we=F(()=>{ge=`// sasum: result = sum(|x[i]|)
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
`});var he,be=F(()=>{he=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var ve,xe=F(()=>{ve=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var _e,ye=F(()=>{_e=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Ee,Be=F(()=>{Ee=`// isamax: returns index of element with largest absolute value
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
`});var Ge,Ae=F(()=>{Ge=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Ne,ke=F(()=>{Ne=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Pe,Se=F(()=>{Pe=`// ssymv: y = alpha * A * x + beta * y
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
`});var Me,Ie=F(()=>{Me=`// strmv: y = op(A) * x
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
`});var Le,De=F(()=>{Le=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Re,Te=F(()=>{Re=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var Ce,je=F(()=>{Ce=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var We,Fe=F(()=>{We=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var Ue,He=F(()=>{Ue=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var Ve,Oe=F(()=>{Ve=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var ze,Ke=F(()=>{ze=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Xe,qe=F(()=>{Xe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Qe,Ye=F(()=>{Qe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var $e,Ze=F(()=>{$e=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var rt,Je=F(()=>{rt=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var tt,et=F(()=>{tt=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var at,ot=F(()=>{at=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var st,it=F(()=>{st=`// strsv_update: subtracts a solved block's contribution from every
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
`});var ut,nt=F(()=>{ut=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var ft,lt=F(()=>{ft=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var dt,mt=F(()=>{dt=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var pt,ct=F(()=>{pt=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var gt,wt=F(()=>{gt=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var bt={};Fr(bt,{shaderSources:()=>Oo});var Oo,ht=F(()=>{Zr();Jr();ee();oe();ie();ne();le();me();ce();we();be();xe();ye();Be();Ae();ke();Se();Ie();De();Te();je();Fe();He();Oe();Ke();qe();Ye();Ze();Je();et();ot();it();nt();lt();mt();ct();wt();Oo={"reduction/argmax":$r,"reduction/argmaxF64":re,"reduction/sum":te,"reduction/sumF64":ae,sscal:se,sswap:ue,saxpy:fe,scopy:de,sdot:pe,sasum:ge,snrm2:he,srot:ve,srotm:_e,isamax:Ee,sgemv_n:Ge,sgemv_t:Ne,ssymv:Pe,strmv:Me,sger:Le,ssyr:Re,ssyr2:Ce,f64add:We,"f64/dekker":Ue,"f64/utils/abs":Ve,"f64/utils/add":ze,"f64/utils/greater":Xe,"f64/utils/equal":Qe,dasum:$e,idamax:rt,strsv_invert_block:tt,strsv_apply_inverse:at,strsv_update:st,sgemm_small:ut,sgemm_large:ft,sgemmtr_small:dt,sgemmtr_large:pt,symmetrize:gt}});var xa={};Fr(xa,{GpuMatrix:()=>W,GpuVector:()=>S,cleanup:()=>zr,dasum:()=>Nt,gpuName:()=>qr,idamax:()=>Mt,init:()=>Kr,isamax:()=>It,randomFloat32Array:()=>Xr,randomFloat64Array:()=>Yr,randomTriangularFloat32Array:()=>Qr,sasum:()=>kt,saxpy:()=>_t,scopy:()=>Bt,sdot:()=>At,sgemm:()=>Vt,sgemmtr:()=>Kt,sgemv:()=>Tt,sger:()=>Ht,snrm2:()=>Pt,srot:()=>Dt,srotm:()=>Lt,sscal:()=>vt,sswap:()=>yt,ssymm:()=>Yt,ssymv:()=>Rt,ssyr:()=>Ut,ssyr2:()=>Ot,ssyr2k:()=>qt,ssyrk:()=>zt,strmv:()=>jt,strsv:()=>Wt});function Hr(a,t){return t?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Ur(){if(!Or())return{querySet:null,passDescriptor:void 0};let t=J().createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function wr(a,t){if(!t)return null;let r=J(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(t,0,2,o,0);let e=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,e,0,16),{tsReadBuffer:e,resolveBuffer:o,querySet:t}}async function P(a){if(!a)return;let{tsReadBuffer:t,resolveBuffer:r,querySet:o}=a;await t.mapAsync(GPUMapMode.READ);let e=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(e[1]-e[0]))/1e6}var gr=null,_r=null,Vr=null,Dr=!1;async function Kr({powerPreference:a="high-performance",benchmark:t=!1,dumpShaders:r=!1}={}){if(gr)return gr;let o;if(typeof window>"u"){let{create:s,globals:l}=await import("webgpu");Object.assign(globalThis,l),o=s(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),Vr=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(_r=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!_r)throw new Error("No WebGPU adapter found.");Dr=t;let i=[...Hr(_r,t).requiredFeatures??[]];return gr=await _r.requestDevice({requiredFeatures:i}),gr.addEventListener("uncapturederror",s=>{console.error("Uncaptured GPU error:",s.error.message)}),gr}function zr(){gr&&(gr.destroy(),gr=null),_r=null,Vr=null,Dr=!1}function qr(){if(!_r)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:t}=_r.info;return{description:t||"unknown",device:a||"unknown"}}function Or(){return Dr}function J(){if(!gr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return gr}function c(...a){a.flat().forEach(t=>t.destroy())}function x(a,t="blas-input",r=!1){let o=J(),e=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>e)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${e} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=o.createBuffer({label:t,size:i,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(l.getMappedRange()).set(a),l.unmap(),l}function rr(a,t="blas-storage",r=0){return J().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|r})}function mr(a,t="blas-result"){return J().createBuffer({label:t,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function A(a,t){let o=J().createBuffer({label:"blas-readback",size:t.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(t,0,o,0,t.size),o}function D(a,t="blas-params"){let r=J(),o=a.length*4,e=Math.ceil(o/16)*16,i=new ArrayBuffer(e),s=new DataView(i);a.forEach(({value:n,type:u},m)=>{let f=m*4;if(u==="u32")s.setUint32(f,n,!0);else if(u==="i32")s.setInt32(f,n,!0);else if(u==="f32")s.setFloat32(f,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:t,size:e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function E(a,t=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new t(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function yr(a){let t=a.length,r=new Float32Array(t),o=new Float32Array(t);for(let e=0;e<t;e++){let i=Math.fround(a[e]);r[e]=i,o[e]=Math.fround(a[e]-i)}return{hi:r,lo:o}}function Er(a,t){let r=a.length,o=new Float64Array(r);for(let e=0;e<r;e++)o[e]=a[e]+t[e];return o}var S=class a{constructor(t,r,o=Float32Array,e=null){this._buf=t,this._loBuf=e,this.length=r,this.dtype=o}static from(t){if(t instanceof Float64Array){let{hi:o,lo:e}=yr(t),i=x(o,"gpu-vector-f64-hi",!0),s=x(e,"gpu-vector-f64-lo",!0);return new a(i,t.length,Float64Array,s)}if(!(t instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=x(t,"gpu-vector",!0);return new a(r,t.length,t.constructor)}async read(){let t=J(),r=t.createCommandEncoder(),o=A(r,this._buf);if(t.queue.submit([r.finish()]),!this._loBuf)return E(o,this.dtype);let e=t.createCommandEncoder(),i=A(e,this._loBuf);t.queue.submit([e.finish()]);let[s,l]=await Promise.all([E(o,Float32Array),E(i,Float32Array)]);return Er(s,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var W=class a{constructor(t,r,o,e,i=null,s="row-major"){this._buf=t,this._loBuf=i,this.rows=r,this.cols=o,this.lda=e,this.layout=s}static from(t,r,o,e,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(e===void 0&&(e=s?o:r),!(t instanceof Float32Array)&&!(t instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let l=s?o:r;if(!Number.isInteger(e)||e<l)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?r:o;if(t.length<n*e)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(t instanceof Float64Array){let m=n*e,{hi:f,lo:p}=yr(t.subarray(0,m)),d=x(f,"gpu-matrix-f64-hi",!0),w=x(p,"gpu-matrix-f64-lo",!0);return new a(d,r,o,e,w,i)}let u=x(t.subarray(0,n*e),"gpu-matrix",!0);return new a(u,r,o,e,null,i)}async read(){let t=J(),r=t.createCommandEncoder(),o=A(r,this._buf);t.queue.submit([r.finish()]);let e=this.layout!=="column-major",i=e?this.rows:this.cols,s=e?this.cols:this.rows;if(this._loBuf){let u=t.createCommandEncoder(),m=A(u,this._loBuf);t.queue.submit([u.finish()]);let[f,p]=await Promise.all([E(o,Float32Array),E(m,Float32Array)]),d=Er(f,p);if(this.lda===s)return d;let w=new Float64Array(i*s);for(let g=0;g<i;g++)w.set(d.subarray(g*this.lda,g*this.lda+s),g*s);return w}let l=await E(o,Float32Array);if(this.lda===s)return l;let n=new Float32Array(i*s);for(let u=0;u<i;u++)n.set(l.subarray(u*this.lda,u*this.lda+s),u*s);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Xr(a,t=-1,r=1){let o=new Float32Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function Yr(a,t=-1,r=1){let o=new Float64Array(a);for(let e=0;e<a;e++)o[e]=t+Math.random()*(r-t);return o}function Qr(a,t,r="lower",o=-1,e=1,i=5,s=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(t<a)throw new Error("lda must be >= n.");let l=new Float32Array(a*t);for(let n=0;n<a;n++){for(let u=0;u<a;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(l[n*t+u]=o+Math.random()*(e-o))}l[n*t+n]=i+Math.random()*(s-i)}return l}function G(a,t,r=0){let o=J(),e=t.map((i,s)=>({binding:r+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:e})}var ao=new WeakMap;function I(a){J().queue.submit([a.finish()])}function hr(){let a=J(),{querySet:t,passDescriptor:r}=Ur();return{commandEncoder:a.createCommandEncoder(),querySet:t,passDescriptor:r}}function dr(a,t,r,o,e){let i=a.beginComputePass(e);i.setPipeline(t),i.setBindGroup(0,r),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y,o.z??1),i.end(),ao.set(a,i)}function L(a,t,r){let{commandEncoder:o,querySet:e,passDescriptor:i}=hr();dr(o,a,t,r,i);let s=wr(o,e);return{commandEncoder:o,ts:s}}var zo={},Lr=new WeakMap;async function k(a,t,r="main"){Lr.has(a)||Lr.set(a,new Map);let o=Lr.get(a),e=Array.isArray(t)?t:[t],i=`${e.join("+")}::${r}`;return o.has(i)||o.set(i,await Ko(e,r)),o.get(i)}async function Vo(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(ht(),bt)),r=t[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:e}=await import("path"),i=o(r(zo.url));return t(e(i,`../shaders/${a}.wgsl`),"utf8")}}async function Ko(a,t="main"){let r=J(),o=a.join("+"),e=(await Promise.all(a.map(Vo))).join(`
`),i=r.createShaderModule({label:o,code:e}),l=(await i.getCompilationInfo()).messages.filter(m=>m.type==="error");if(l.length>0)throw new Error(`Shader "${o}" compilation failed:
${l.map(m=>`  line ${m.lineNum}: ${m.message}`).join(`
`)}`);let n=t==="main"?{module:i}:{module:i,entryPoint:t},u=r.createComputePipeline({label:o,layout:"auto",compute:n});return u._shaderModule=i,u}var qo=64,xt=8;function ur(a,t){let r=J().limits.maxComputeWorkgroupsPerDimension;return t===void 0?Math.min(Math.ceil(a/qo),r):{x:Math.min(Math.ceil(t/xt),r),y:Math.min(Math.ceil(a/xt),r)}}async function vt(a,t,r,o,e){let i=o instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof S))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return i?{}:o;if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await k(a,"sscal"),l=null,n=null,u=null;try{l=i?o._buf:x(o,"sscal-x",!0),n=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"}],"sscal-params");let m=G(s.getBindGroupLayout(0),[l,n]),{commandEncoder:f,ts:p}=L(s,m,ur(t));u=i?null:A(f,l),I(f);let d=await P(p);if(i)return d!==void 0?{gpuTimeMs:d}:{};let w=await E(u,Float32Array);return u=null,d!==void 0?{x:w,gpuTimeMs:d}:w}finally{!i&&l&&c(l),n&&c(n),u&&c(u)}}async function yt(a,t,r,o,e,i){let s=r instanceof S,l=e instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof S))throw new Error("x must be a Float32Array or GpuVector.");if(!(e instanceof Float32Array)&&!(e instanceof S))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==e.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return s?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(a,"sswap"),u=null,m=null,f=null,p=null,d=null;try{u=s?r._buf:x(r,"sswap-x",!0),m=l?e._buf:x(e,"sswap-y",!0),f=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let w=G(n.getBindGroupLayout(0),[u,m,f]),{commandEncoder:g,ts:b}=L(n,w,ur(t));p=s?null:A(g,u),d=l?null:A(g,m),I(g);let h=await P(b);if(s&&l)return h!==void 0?{gpuTimeMs:h}:{};let v=await E(p,Float32Array);p=null;let y=await E(d,Float32Array);return d=null,h!==void 0?{x:v,y,gpuTimeMs:h}:{x:v,y}}finally{!s&&u&&c(u),!l&&m&&c(m),f&&c(f),p&&c(p),d&&c(d)}}async function _t(a,t,r,o,e,i,s){let l=o instanceof S,n=i instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(e<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{y:i};if(o.length<(t-1)*e+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"saxpy"),m=null,f=null,p=null,d=null;try{m=l?o._buf:x(o,"saxpy-x",!1),f=n?i._buf:x(i,"saxpy-y",!0),p=D([{value:t,type:"u32"},{value:r,type:"f32"},{value:e,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let w=G(u.getBindGroupLayout(0),[m,f,p]),{commandEncoder:g,ts:b}=L(u,w,ur(t));d=n?null:A(g,f),I(g);let h=await P(b);if(n&&l)return h!==void 0?{gpuTimeMs:h}:{};let v=await E(d,Float32Array);return d=null,h!==void 0?{y:v,gpuTimeMs:h}:{y:v}}finally{!l&&m&&c(m),!n&&f&&c(f),p&&c(p),d&&c(d)}}async function Bt(a,t,r,o,e,i){let s=r instanceof S,l=e instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return l?{}:{y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(a,"scopy"),u=null,m=null,f=null,p=null;try{u=s?r._buf:x(r,"scopy-x",!1),m=l?e._buf:x(e,"scopy-y",!0),f=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let d=G(n.getBindGroupLayout(0),[u,m,f]),{commandEncoder:w,ts:g}=L(n,d,ur(t));p=l?null:A(w,m),I(w);let b=await P(g);if(l&&s)return b!==void 0?{gpuTimeMs:b}:{};let h=await E(p,Float32Array);return p=null,b!==void 0?{y:h,gpuTimeMs:b}:{y:h}}finally{!s&&u&&c(u),!l&&m&&c(m),f&&c(f),p&&c(p)}}var Et=64;async function At(a,t,r,o,e,i){let s=r instanceof S,l=e instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await k(a,"sdot"),u=await k(a,"reduction/sum"),m=null,f=null,p=null,d=null,w=null,g=null;try{m=s?r._buf:x(r,"sdot-x",!1),f=l?e._buf:x(e,"sdot-y",!1),p=rr(2*Et*4,"sdot-partials"),d=mr(4,"sdot-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let b=G(n.getBindGroupLayout(0),[m,f,p,w]),{commandEncoder:h,ts:v}=L(n,b,2*Et);I(h);let y=G(u.getBindGroupLayout(0),[p,d]),{commandEncoder:_,ts:B}=L(u,y,1);g=A(_,d),I(_);let N=E(g,Float32Array);g=null;let[M,T,R]=await Promise.all([P(v),P(B),N]);return M!==void 0&&T!==void 0?{dot:R[0],gpuTimeMs:M+T}:{dot:R[0]}}finally{!s&&m&&c(m),!l&&f&&c(f),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}var Gt=64;async function kt(a,t,r,o){let e=r instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"sasum"),s=await k(a,"reduction/sum"),l=null,n=null,u=null,m=null,f=null;try{l=e?r._buf:x(r,"sasum-x",!1),n=rr(2*Gt*4,"sasum-partials"),u=mr(4,"sasum-result"),m=D([{value:t,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=G(i.getBindGroupLayout(0),[l,n,m]),{commandEncoder:d,ts:w}=L(i,p,2*Gt);I(d);let g=G(s.getBindGroupLayout(0),[n,u]),{commandEncoder:b,ts:h}=L(s,g,1);f=A(b,u),I(b);let v=E(f,Float32Array);f=null;let[y,_,B]=await Promise.all([P(w),P(h),v]);return y!==void 0&&_!==void 0?{asum:B[0],gpuTimeMs:y+_}:{asum:B[0]}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),m&&c(m),f&&c(f)}}var Tr=64;async function Nt(a,t,r,o){let e=r instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],s=await k(a,[...i,"dasum"]),l=await k(a,[...i,"reduction/sumF64"]),n=null,u=null,m=null,f=null,p=null,d=null,w=null,g=null,b=null;try{if(e)n=r._buf,u=r._loBuf;else{let{hi:V,lo:U}=yr(r.map(Math.abs));n=x(V,"dasum-xHi",!1),u=x(U,"dasum-xLo",!1)}m=rr(2*Tr*4,"dasum-partialsHi"),f=rr(2*Tr*4,"dasum-partialsLo"),p=mr(4,"dasum-result-hi"),d=mr(4,"dasum-result-lo"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"dasum-params");let h=G(s.getBindGroupLayout(0),[n,u,m,f,w]),{commandEncoder:v,ts:y}=L(s,h,2*Tr);I(v);let _=G(l.getBindGroupLayout(0),[m,f,p,d]),{commandEncoder:B,ts:N}=L(l,_,1);g=A(B,p),b=A(B,d),I(B);let M=E(g,Float32Array),T=E(b,Float32Array);g=null,b=null;let[R,j,C,H]=await Promise.all([P(y),P(N),M,T]),O=Er(C,H)[0];return R!==void 0&&j!==void 0?{asum:O,gpuTimeMs:R+j}:{asum:O}}finally{!e&&n&&c(n),!e&&u&&c(u),m&&c(m),f&&c(f),p&&c(p),d&&c(d),w&&c(w),g&&c(g),b&&c(b)}}var St=64;async function Pt(a,t,r,o){let e=r instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"snrm2"),s=await k(a,"reduction/sum"),l=null,n=null,u=null,m=null,f=null;try{l=e?r._buf:x(r,"snrm2-x",!1),n=rr(2*St*4,"snrm2-partials"),u=mr(4,"snrm2-result"),m=D([{value:t,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let p=G(i.getBindGroupLayout(0),[l,n,m]),{commandEncoder:d,ts:w}=L(i,p,2*St);I(d);let g=G(s.getBindGroupLayout(0),[n,u]),{commandEncoder:b,ts:h}=L(s,g,1);f=A(b,u),I(b);let v=E(f,Float32Array);f=null;let[y,_,B]=await Promise.all([P(w),P(h),v]),N=Math.sqrt(B[0]);return y!==void 0&&_!==void 0?{nrm2:N,gpuTimeMs:y+_}:{nrm2:N}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),m&&c(m),f&&c(f)}}var Rr=64;async function It(a,t,r,o){let e=r instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await k(a,"isamax"),s=await k(a,"reduction/argmax"),l=null,n=null,u=null,m=null,f=null,p=null;try{l=e?r._buf:x(r,"isamax-x",!1),n=rr(2*Rr*4,"isamax-partials-val"),u=rr(2*Rr*4,"isamax-partials-idx"),m=mr(4,"isamax-result"),f=D([{value:t,type:"u32"},{value:o,type:"u32"}],"isamax-params");let d=G(i.getBindGroupLayout(0),[l,n,u,f]),{commandEncoder:w,ts:g}=L(i,d,2*Rr);I(w);let b=G(s.getBindGroupLayout(0),[n,u,m]),{commandEncoder:h,ts:v}=L(s,b,1);p=A(h,m),I(h);let y=E(p,Uint32Array);p=null;let[_,B,N]=await Promise.all([P(g),P(v),y]),M=N[0];return _!==void 0&&B!==void 0?{index:M,gpuTimeMs:_+B}:{index:M}}finally{!e&&l&&c(l),n&&c(n),u&&c(u),m&&c(m),f&&c(f),p&&c(p)}}var Pr=64;async function Mt(a,t,r,o){let e=r instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!e&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(e&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],s=await k(a,[...i,"idamax"],"idamax_main"),l=await k(a,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,m=null,f=null,p=null,d=null,w=null,g=null;try{if(e)n=r._buf,u=r._loBuf;else{let{hi:C,lo:H}=yr(r);n=x(C,"idamax-xHi",!1),u=x(H,"idamax-xLo",!1)}m=rr(2*Pr*4,"idamax-partials-val-hi"),f=rr(2*Pr*4,"idamax-partials-val-lo"),p=rr(2*Pr*4,"idamax-partials-idx"),d=mr(4,"idamax-result"),w=D([{value:t,type:"u32"},{value:o,type:"u32"}],"idamax-params");let b=G(s.getBindGroupLayout(0),[n,u,m,f,p,w]),{commandEncoder:h,ts:v}=L(s,b,2*Pr);I(h);let y=G(l.getBindGroupLayout(0),[m,f,p,d]),{commandEncoder:_,ts:B}=L(l,y,1);g=A(_,d),I(_);let N=E(g,Uint32Array);g=null;let[M,T,R]=await Promise.all([P(v),P(B),N]),j=R[0];return M!==void 0&&T!==void 0?{index:j,gpuTimeMs:M+T}:{index:j}}finally{!e&&n&&c(n),!e&&u&&c(u),m&&c(m),f&&c(f),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function Dt(a,t,r,o,e,i,s,l){let n=r instanceof S,u=e instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let m=await k(a,"srot"),f=null,p=null,d=null,w=null,g=null;try{f=n?r._buf:x(r,"srot-x",!0),p=u?e._buf:x(e,"srot-y",!0),d=D([{value:t,type:"u32"},{value:s,type:"f32"},{value:l,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let b=G(m.getBindGroupLayout(0),[f,p,d]),{commandEncoder:h,ts:v}=L(m,b,ur(t));w=n?null:A(h,f),g=u?null:A(h,p),I(h);let y=await P(v);if(n&&u)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,M]=await Promise.all([_,B]);return y!==void 0?{x:N,y:M,gpuTimeMs:y}:{x:N,y:M}}finally{!n&&f&&c(f),!u&&p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function Lt(a,t,r,o,e,i,s){let l=r instanceof S,n=e instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(e instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||s[0]===-2)return l?{}:{x:r,y:e};if(r.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(e.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await k(a,"srotm"),m=null,f=null,p=null,d=null,w=null,g=null;try{m=l?r._buf:x(r,"srotm-x",!0),f=n?e._buf:x(e,"srotm-y",!0),p=x(s,"srotm-param",!1),d=D([{value:t,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let b=G(u.getBindGroupLayout(0),[m,f,p,d]),{commandEncoder:h,ts:v}=L(u,b,ur(t));w=l?null:A(h,m),g=n?null:A(h,f),I(h);let y=await P(v);if(l&&n)return y!==void 0?{gpuTimeMs:y}:{};let _=E(w,Float32Array),B=E(g,Float32Array);w=null,g=null;let[N,M]=await Promise.all([_,B]);return y!==void 0?{x:N,y:M,gpuTimeMs:y}:{x:N,y:M}}finally{!l&&m&&c(m),!n&&f&&c(f),p&&c(p),d&&c(d),w&&c(w),g&&c(g)}}async function Tt(a,t,r,o,e,i,s,l,n,u,m,f,p="row-major"){let d=i instanceof W,w=l instanceof S,g=m instanceof S;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(!d&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(m instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&l._buf===m._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:m};(d?i.layout:p)==="column-major"&&([r,o]=[o,r],t=t==="no-transpose"?"transpose":"no-transpose");let h=t==="no-transpose",v=h?o:r,y=h?r:o;if(s<o)throw new Error("lda must be >= n.");if(!d&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(v-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(m.length<(y-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let B=await k(a,h?"sgemv_n":"sgemv_t"),N=d?i._buf:x(i,"sgemv-A",!1),M=w?l._buf:x(l,"sgemv-x",!1),T=g?m._buf:x(m,"sgemv-y",!0),R=D([{value:r,type:"u32"},{value:o,type:"u32"},{value:e,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let j=G(B.getBindGroupLayout(0),[N,M,T,R]),C=h?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):ur(y),{commandEncoder:H,ts:O}=L(B,j,C),V=g?null:A(H,T);I(H);let U=await P(O);if(g)return U!==void 0?{gpuTimeMs:U}:{};let er=await E(V,Float32Array);return U!==void 0?{y:er,gpuTimeMs:U}:{y:er}}finally{d||c(N),w||c(M),g||c(T),c(R)}}async function Rt(a,t,r,o,e,i,s,l,n,u,m,f="row-major"){let p=s instanceof S,d=u instanceof S,w=e instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(m)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||m<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!w&&!(e instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&i!==e.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(e.rows<r||e.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return d?{}:{y:u};if(!w&&e.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?e.layout:f)==="column-major"?t==="upper":t==="lower",h=await k(a,"ssymv"),v=null,y=null,_=null,B=null;try{v=w?e._buf:x(e,"ssymv-A",!1),y=p?s._buf:x(s,"ssymv-x",!1),_=d?u._buf:x(u,"ssymv-y",!0),B=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:i,type:"u32"},{value:b?0:1,type:"u32"}],"ssymv-params");let N=G(h.getBindGroupLayout(0),[v,y,_,B]),M=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:T,ts:R}=L(h,N,M),j=d?null:A(T,_);I(T);let C=await P(R);if(d)return C!==void 0?{gpuTimeMs:C}:{};let H=await E(j,Float32Array);return C!==void 0?{y:H,gpuTimeMs:C}:{y:H}}finally{!w&&v&&c(v),!p&&y&&c(y),!d&&_&&c(_),B&&c(B)}}async function jt(a,t,r,o,e,i,s,l,n,u,m,f="row-major"){let p=l instanceof S,d=u instanceof S,w=i instanceof W,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&d&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return d?{}:{y:u};if(!w&&i.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?i.layout:f)==="column-major",v=h?t==="upper":t==="lower",y=h?r==="transpose":r==="no-transpose",_=await k(a,"strmv"),B=null,N=null,M=null,T=null;try{B=w?i._buf:x(i,"strmv-A",!1),N=p?l._buf:x(l,"strmv-x",!1),M=d?u._buf:x(u,"strmv-y",!0),T=D([{value:e,type:"u32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let R=G(_.getBindGroupLayout(0),[B,N,M,T]),j=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:C,ts:H}=L(_,R,j),O=d?null:A(C,M);I(C);let V=await P(H);if(d)return V!==void 0?{gpuTimeMs:V}:{};let U=await E(O,Float32Array);return V!==void 0?{y:U,gpuTimeMs:V}:{y:U}}finally{!w&&B&&c(B),!p&&N&&c(N),!d&&M&&c(M),T&&c(T)}}var br=64;function Ct(a,t,r){let o=new ArrayBuffer(a*t),e=new DataView(o);for(let i=0;i<a;i++){let s=r(i),l=i*t;s.forEach((n,u)=>e.setUint32(l+u*4,n,!0))}return o}function Ft(a,t,r){let o=a.createBuffer({label:r,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,t),o}async function Wt(a,t,r,o,e,i,s,l,n,u="row-major"){let m=l instanceof S,f=i instanceof W,p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!f&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(m&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!m)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return m?{}:{x:l};if(!f&&i.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(e-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(f?i.layout:u)==="column-major",g=w?t==="upper":t==="lower",b=w?r==="transpose":r==="no-transpose",h=await k(a,"strsv_invert_block"),v=await k(a,"strsv_apply_inverse"),y=await k(a,"strsv_update"),_=b===g,B=[];for(let U=0;U<e;U+=br)B.push(U);_||B.reverse();let N=B.length,M=a.limits.maxComputeWorkgroupsPerDimension,T=a.limits.minUniformBufferOffsetAlignment,R=null,j=null,C=null,H=null,O=null,V=null;try{R=f?i._buf:x(i,"strsv-A",!1),j=m?l._buf:x(l,"strsv-x",!0),C=rr(N*br*br*4,"strsv-Ainv");let U=Ct(N,T,K=>{let $=K*br,z=Math.min($+br,e);return[n,K,$,z]});H=Ft(a,U,"strsv-apply-params");let er=Ct(N,T,K=>{let $=K*br,z=Math.min($+br,e);return[e,n,s,b?0:1,g?0:1,$,z]});O=Ft(a,er,"strsv-update-params");let{commandEncoder:q,querySet:X}=hr();V=D([{value:e,type:"u32"},{value:s,type:"u32"},{value:b?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ar=G(h.getBindGroupLayout(0),[R,C,V]);dr(q,h,ar,{x:br,y:N},X?{timestampWrites:{querySet:X,beginningOfPassWriteIndex:0}}:void 0);for(let K=0;K<B.length;K++){let $=B[K],z=Math.min($+br,e),Q=$/br,or=K===B.length-1,nr=Q*T,cr=G(v.getBindGroupLayout(0),[C,j,{buffer:H,offset:nr,size:16}]);dr(q,v,cr,1,or&&X?{timestampWrites:{querySet:X,endOfPassWriteIndex:1}}:void 0);let fr=_?e-z:$;if(fr===0)continue;let xr=G(y.getBindGroupLayout(0),[R,j,{buffer:O,offset:nr,size:32}]),Ar=Math.min(fr,M);dr(q,y,xr,Ar)}let sr=wr(q,X),tr=m?null:A(q,j);I(q);let Y=await P(sr);if(m)return Y!==void 0?{gpuTimeMs:Y}:{};let Z=await E(tr,Float32Array);return Y!==void 0?{x:Z,gpuTimeMs:Y}:{x:Z}}finally{!f&&R&&c(R),!m&&j&&c(j),C&&c(C),H&&c(H),O&&c(O),V&&c(V)}}async function Ht(a,t,r,o,e,i,s,l,n,u,m="row-major"){let f=n instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(f&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<t||n.cols<r))throw new Error("A is too small for the given m and n.");(f?n.layout:m)==="column-major"&&([t,r]=[r,t],[e,s]=[s,e],[i,l]=[l,i]);let d=e instanceof S,w=s instanceof S;if(u<r)throw new Error("lda must be >= n.");if(!d&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(f&&d&&n._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&w&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||r<0)throw new Error("m and n must be non-negative.");if(t===0||r===0)return f?{}:{A:n};if(!f&&n.length<(t-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(e.length<(t-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await k(a,"sger"),b=null,h=null,v=null,y=null;try{b=d?e._buf:x(e,"sger-x",!1),h=w?s._buf:x(s,"sger-y",!1),v=f?n._buf:x(n,"sger-A",!0),y=D([{value:t,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let _=G(g.getBindGroupLayout(0),[b,h,v,y]),B=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:M}=L(g,_,B),T=f?null:A(N,v);I(N);let R=await P(M);if(f)return R!==void 0?{gpuTimeMs:R}:{};let j=await E(T,Float32Array);return R!==void 0?{A:j,gpuTimeMs:R}:{A:j}}finally{!d&&b&&c(b),!w&&h&&c(h),!f&&v&&c(v),y&&c(y)}}async function Ut(a,t,r,o,e,i,s,l,n="row-major"){let u=e instanceof S,m=s instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!m&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&u&&s._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return m?{}:{A:s};if(!m&&s.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(m?s.layout:n)==="column-major"?t==="upper":t==="lower",d=await k(a,"ssyr"),w=null,g=null,b=null;try{w=u?e._buf:x(e,"ssyr-x",!1),g=m?s._buf:x(s,"ssyr-A",!0),b=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let h=G(d.getBindGroupLayout(0),[w,g,b]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:y,ts:_}=L(d,h,v),B=m?null:A(y,g);I(y);let N=await P(_);if(m)return N!==void 0?{gpuTimeMs:N}:{};let M=await E(B,Float32Array);return N!==void 0?{A:M,gpuTimeMs:N}:{A:M}}finally{!u&&w&&c(w),!m&&g&&c(g),b&&c(b)}}async function Ot(a,t,r,o,e,i,s,l,n,u,m="row-major"){let f=e instanceof S,p=s instanceof S,d=n instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!d&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!d)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(d&&!f)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(d&&f&&n._buf===e._buf)throw new Error("A and x must not reference the same GPU buffer.");if(d&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&e._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(d&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return d?{}:{A:n};if(!d&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(e.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(d?n.layout:m)==="column-major"?t==="upper":t==="lower",b=await k(a,"ssyr2"),h=null,v=null,y=null,_=null;try{h=f?e._buf:x(e,"ssyr2-x",!1),v=p?s._buf:x(s,"ssyr2-y",!1),y=d?n._buf:x(n,"ssyr2-A",!0),_=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let B=G(b.getBindGroupLayout(0),[h,v,y,_]),N=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:T}=L(b,B,N),R=d?null:A(M,y);I(M);let j=await P(T);if(d)return j!==void 0?{gpuTimeMs:j}:{};let C=await E(R,Float32Array);return j!==void 0?{A:C,gpuTimeMs:j}:{A:C}}finally{!f&&h&&c(h),!p&&v&&c(v),!d&&y&&c(y),_&&c(_)}}var Xo=32,Yo=32,Qo=64,Zo=64,$o=36;async function Vt(a,t,r,o,e,i,s,l,n,u,m,f,p,d,w="row-major"){let g=l instanceof W,b=u instanceof W,h=p instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(d))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||b)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!g||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||e===0)return h?{}:{C:p};let v=g?l.layout:w,y=b?u.layout:w,_=h?p.layout:w,B=v==="column-major"?i:o,N=v==="column-major"?o:i,M=t==="no-transpose"?B:N,T=t==="no-transpose"?N:B;if(n<T)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,Z]=t==="no-transpose"?[o,i]:[i,o];if(l.rows<Y||l.cols<Z)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(M-1)*n+T)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=y==="column-major"?e:i,j=y==="column-major"?i:e,C=r==="no-transpose"?R:j,H=r==="no-transpose"?j:R;if(m<H)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(m!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,Z]=r==="no-transpose"?[i,e]:[e,i];if(u.rows<Y||u.cols<Z)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(C-1)*m+H)throw new Error("B does not have enough elements for the given dimensions and ldb.");let O=_==="column-major"?e:o,V=_==="column-major"?o:e;if(d<V)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(d!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<o||p.cols<e)throw new Error("C is too small for the given m and n.")}else if(p.length<(O-1)*d+V)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&([l,u]=[u,l],[g,b]=[b,g],[n,m]=[m,n],[t,r]=[r==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[o,e]=[e,o]);let U=Math.ceil(e/Zo),er=Math.ceil(o/Qo),q=U*er>=$o,X=await k(a,q?"sgemm_large":"sgemm_small"),ar=g?l._buf:x(l,"sgemm-A",!1),ir=b?u._buf:x(u,"sgemm-B",!1),sr=h?p._buf:x(p,"sgemm-C",!0),tr=D([{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"u32"},{value:s,type:"f32"},{value:f,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:d,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let Y=G(X.getBindGroupLayout(0),[ar,ir,sr,tr]),Z=q?{x:Math.min(U,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(er,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(e/Yo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Xo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:K,ts:$}=L(X,Y,Z),z=h?null:A(K,sr);I(K);let Q=await P($);if(h)return Q!==void 0?{gpuTimeMs:Q}:{};let or=await E(z,Float32Array);return Q!==void 0?{C:or,gpuTimeMs:Q}:{C:or}}finally{g||c(ar),b||c(ir),h||c(sr),c(tr)}}var Jo=32,ra=32,ea=64,ta=64,oa=36;async function Kt(a,t,r,o,e,i,s,l,n,u,m,f,p,d,w,g="row-major"){let b=n instanceof W,h=m instanceof W,v=d instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!b&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!v&&!(d instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((b||h)&&!v)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(v&&(!b||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(e<0||i<0||s<0)throw new Error("m, n, and k must be non-negative.");if(e===0||i===0)return v?{}:{C:d};let y=b?n.layout:g,_=h?m.layout:g,B=v?d.layout:g,N=y==="column-major"?s:e,M=y==="column-major"?e:s,T=r==="no-transpose"?N:M,R=r==="no-transpose"?M:N;if(u<R)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(b){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Z,K]=r==="no-transpose"?[e,s]:[s,e];if(n.rows<Z||n.cols<K)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(T-1)*u+R)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=_==="column-major"?i:s,C=_==="column-major"?s:i,H=o==="no-transpose"?j:C,O=o==="no-transpose"?C:j;if(f<O)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Z,K]=o==="no-transpose"?[s,i]:[i,s];if(m.rows<Z||m.cols<K)throw new Error("B is too small for the given n, k, and transB.")}else if(m.length<(H-1)*f+O)throw new Error("B does not have enough elements for the given dimensions and ldb.");let V=B==="column-major"?i:e,U=B==="column-major"?e:i;if(w<U)throw new Error(`ldc must be >= ${B==="column-major"?"rows":"cols"} of C as stored.`);if(v){if(w!==d.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(d.rows<e||d.cols<i)throw new Error("C is too small for the given m and n.")}else if(d.length<(V-1)*w+U)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),B==="column-major"&&([n,m]=[m,n],[b,h]=[h,b],[u,f]=[f,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[e,i]=[i,e],t=t==="lower"?"upper":"lower");let er=Math.ceil(i/ta),q=Math.ceil(e/ea),X=er*q>=oa,ar=await k(a,X?"sgemmtr_large":"sgemmtr_small"),ir=b?n._buf:x(n,"sgemmtr-A",!1),sr=h?m._buf:x(m,"sgemmtr-B",!1),tr=v?d._buf:x(d,"sgemmtr-C",!0),Y=D([{value:e,type:"u32"},{value:i,type:"u32"},{value:s,type:"u32"},{value:l,type:"f32"},{value:p,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:w,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let Z=G(ar.getBindGroupLayout(0),[ir,sr,tr,Y]),K=X?{x:Math.min(er,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/ra),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(e/Jo),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:$,ts:z}=L(ar,Z,K),Q=v?null:A($,tr);I($);let or=await P(z);if(v)return or!==void 0?{gpuTimeMs:or}:{};let nr=await E(Q,Float32Array);return or!==void 0?{C:nr,gpuTimeMs:or}:{C:nr}}finally{b||c(ir),h||c(sr),v||c(tr),c(Y)}}var aa=32,ia=32,sa=64,na=64,ua=36;async function zt(a,t,r,o,e,i,s,l,n,u,m,f="row-major"){let p=s instanceof W,d=u instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(m))throw new Error("n, k, lda, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(p&&!d)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(d&&!p)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return d?{}:{C:u};let w=p?s.layout:f,g=d?u.layout:f,b=w==="column-major"?e:o,h=w==="column-major"?o:e,v=r==="no-transpose"?b:h,y=r==="no-transpose"?h:b;if(l<y)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[U,er]=r==="no-transpose"?[o,e]:[e,o];if(s.rows<U||s.cols<er)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(v-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");if(m<o)throw new Error("ldc must be >= n.");if(d){if(m!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*m+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let _=r;w==="column-major"&&(_=_==="no-transpose"?"transpose":"no-transpose");let B=_==="no-transpose"?"transpose":"no-transpose",N=t;g==="column-major"&&([_,B]=[B==="no-transpose"?"transpose":"no-transpose",_==="no-transpose"?"transpose":"no-transpose"],N=N==="lower"?"upper":"lower");let M=Math.ceil(o/na),T=Math.ceil(o/sa),R=M*T>=ua,j=await k(a,R?"sgemmtr_large":"sgemmtr_small"),C=p?s._buf:x(s,"ssyrk-A",!1),H=d?u._buf:x(u,"ssyrk-C",!0),O=p?rr(C.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(s,"ssyrk-B",!1),V=D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:_==="transpose"?1:0,type:"u32"},{value:B==="transpose"?1:0,type:"u32"},{value:N==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let U=G(j.getBindGroupLayout(0),[C,O,H,V]),er=R?{x:Math.min(M,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(T,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/ia),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/aa),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:q,querySet:X,passDescriptor:ar}=hr();p&&q.copyBufferToBuffer(C,0,O,0,C.size),dr(q,j,U,er,ar);let ir=wr(q,X),sr=d?null:A(q,H);I(q);let tr=await P(ir);if(d)return tr!==void 0?{gpuTimeMs:tr}:{};let Y=await E(sr,Float32Array);return tr!==void 0?{C:Y,gpuTimeMs:tr}:{C:Y}}finally{p||c(C),c(O),d||c(H),c(V)}}var la=32,fa=32,ma=64,da=64,ca=36;async function qt(a,t,r,o,e,i,s,l,n,u,m,f,p,d="row-major"){let w=s instanceof W,g=n instanceof W,b=f instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("n and k must be non-negative.");if(o===0)return b?{}:{C:f};let h=w?s.layout:d,v=g?n.layout:d,y=b?f.layout:d,_=h==="column-major"?e:o,B=h==="column-major"?o:e,N=r==="no-transpose"?_:B,M=r==="no-transpose"?B:_;if(l<M)throw new Error(`lda must be >= ${h==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[z,Q]=r==="no-transpose"?[o,e]:[e,o];if(s.rows<z||s.cols<Q)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(N-1)*l+M)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=v==="column-major"?e:o,R=v==="column-major"?o:e,j=r==="no-transpose"?T:R,C=r==="no-transpose"?R:T;if(u<C)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[z,Q]=r==="no-transpose"?[o,e]:[e,o];if(n.rows<z||n.cols<Q)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(j-1)*u+C)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(p<o)throw new Error("ldc must be >= n.");if(b){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<o)throw new Error("C is too small for the given n.")}else if(f.length<(o-1)*p+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let H=r;h==="column-major"&&(H=H==="no-transpose"?"transpose":"no-transpose");let O=r;v==="column-major"&&(O=O==="no-transpose"?"transpose":"no-transpose");let V=y==="column-major"?t==="lower"?"upper":"lower":t,U=z=>z==="no-transpose"?"transpose":"no-transpose";function er(z,Q,or,nr,cr,lr){let fr=z,xr=U(nr);return y!=="column-major"?{transX:fr,X:Q,ldX:or,transY:xr,Y:cr,ldY:lr}:{transX:U(xr),X:cr,ldX:lr,transY:U(fr),Y:Q,ldY:or}}let q=Math.ceil(o/da),X=Math.ceil(o/ma),ar=q*X>=ca,ir=await k(a,ar?"sgemmtr_large":"sgemmtr_small"),sr=ar?{x:Math.min(q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(X,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/fa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/la),a.limits.maxComputeWorkgroupsPerDimension)},tr=w?s._buf:x(s,"ssyr2k-A",!1),Y=g?n._buf:x(n,"ssyr2k-B",!1),Z=b?f._buf:x(f,"ssyr2k-C",!0),K=null,$=null;try{let z=er(H,tr,l,O,Y,u),Q=er(O,Y,u,H,tr,l),or=(Br,Mr)=>D([{value:o,type:"u32"},{value:o,type:"u32"},{value:e,type:"u32"},{value:i,type:"f32"},{value:Mr,type:"f32"},{value:Br.ldX,type:"u32"},{value:Br.ldY,type:"u32"},{value:p,type:"u32"},{value:Br.transX==="transpose"?1:0,type:"u32"},{value:Br.transY==="transpose"?1:0,type:"u32"},{value:V==="upper"?1:0,type:"u32"}],"ssyr2k-params");K=or(z,m),$=or(Q,1);let nr=G(ir.getBindGroupLayout(0),[z.X,z.Y,Z,K]),cr=G(ir.getBindGroupLayout(0),[Q.X,Q.Y,Z,$]),{commandEncoder:lr,querySet:fr}=hr(),xr=fr?{timestampWrites:{querySet:fr,beginningOfPassWriteIndex:0}}:void 0,Ar=fr?{timestampWrites:{querySet:fr,endOfPassWriteIndex:1}}:void 0;dr(lr,ir,nr,sr,xr),dr(lr,ir,cr,sr,Ar);let jr=wr(lr,fr),Ir=b?null:A(lr,Z);I(lr);let pr=await P(jr);if(b)return pr!==void 0?{gpuTimeMs:pr}:{};let vr=await E(Ir,Float32Array);return pr!==void 0?{C:vr,gpuTimeMs:pr}:{C:vr}}finally{w||c(tr),g||c(Y),b||c(Z),K&&c(K),$&&c($)}}var pa=32,wa=32,ga=64,ba=64,ha=36,Xt=8;async function Yt(a,t,r,o,e,i,s,l,n,u,m,f,p,d="row-major"){let w=s instanceof W,g=n instanceof W,b=f instanceof W;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||e<0)throw new Error("m and n must be non-negative.");if(o===0||e===0)return b?{}:{C:f};let h=w?s.layout:d,v=g?n.layout:d,y=b?f.layout:d,_=t==="left"?o:e;if(l<_)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(w){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(s.rows<_||s.cols<_)throw new Error("A is too small for the given m/n and side.")}else if(s.length<(_-1)*l+_)throw new Error("A does not have enough elements for the given dimensions and lda.");let B=v==="column-major"?e:o,N=v==="column-major"?o:e;if(u<N)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<o||n.cols<e)throw new Error("B is too small for the given m and n.")}else if(n.length<(B-1)*u+N)throw new Error("B does not have enough elements for the given dimensions and ldb.");let M=y==="column-major"?e:o,T=y==="column-major"?o:e;if(p<T)throw new Error(`ldc must be >= ${y==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<e)throw new Error("C is too small for the given m and n.")}else if(f.length<(M-1)*p+T)throw new Error("C does not have enough elements for the given dimensions and ldc.");let R=h==="column-major"?r==="lower"?"upper":"lower":r,j=v==="column-major"?"transpose":"no-transpose",C="no-transpose",H=o,O=e,V=_,U=t==="left"?C:j,er=t==="left"?j:C,q=lr=>lr==="no-transpose"?"transpose":"no-transpose",X=t==="right";y==="column-major"&&([U,er]=[q(er),q(U)],X=!X,[H,O]=[O,H]);let ar=_,ir=Math.ceil(O/ba),sr=Math.ceil(H/ga),tr=ir*sr>=ha,Y=await k(a,tr?"sgemm_large":"sgemm_small"),Z=await k(a,"symmetrize"),K=tr?{x:Math.min(ir,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(sr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(O/wa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(H/pa),a.limits.maxComputeWorkgroupsPerDimension)},$=w?s._buf:x(s,"ssymm-A",!1),z=g?n._buf:x(n,"ssymm-B",!1),Q=b?f._buf:x(f,"ssymm-C",!0),or=rr(_*ar*4,"ssymm-Adense"),nr=null,cr=null;try{nr=D([{value:_,type:"u32"},{value:l,type:"u32"},{value:ar,type:"u32"},{value:R==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let lr=G(Z.getBindGroupLayout(0),[$,or,nr]),fr=X?z:or,xr=X?u:ar,Ar=X?or:z;cr=D([{value:H,type:"u32"},{value:O,type:"u32"},{value:V,type:"u32"},{value:i,type:"f32"},{value:m,type:"f32"},{value:xr,type:"u32"},{value:X?ar:u,type:"u32"},{value:p,type:"u32"},{value:U==="transpose"?1:0,type:"u32"},{value:er==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let Ir=G(Y.getBindGroupLayout(0),[fr,Ar,Q,cr]),{commandEncoder:pr,querySet:vr}=hr(),Br=vr?{timestampWrites:{querySet:vr,beginningOfPassWriteIndex:0}}:void 0,Mr=vr?{timestampWrites:{querySet:vr,endOfPassWriteIndex:1}}:void 0;dr(pr,Z,lr,{x:Math.ceil(_/Xt),y:Math.ceil(_/Xt)},Br),dr(pr,Y,Ir,K,Mr);let Qt=wr(pr,vr),Zt=b?null:A(pr,Q);I(pr);let Gr=await P(Qt);if(b)return Gr!==void 0?{gpuTimeMs:Gr}:{};let Cr=await E(Zt,Float32Array);return Gr!==void 0?{C:Cr,gpuTimeMs:Gr}:{C:Cr}}finally{w||c($),g||c(z),b||c(Q),c(or),nr&&c(nr),cr&&c(cr)}}return oo(xa);})();
