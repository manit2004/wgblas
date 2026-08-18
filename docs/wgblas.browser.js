var wgblas=(()=>{var Do=Object.create;var Hr=Object.defineProperty;var Ro=Object.getOwnPropertyDescriptor;var To=Object.getOwnPropertyNames;var jo=Object.getPrototypeOf,Co=Object.prototype.hasOwnProperty;var Ur=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var V=(a,e,r)=>()=>{if(r)throw r[0];try{return a&&(e=a(a=0)),e}catch(o){throw r=[o],o}};var te=(a,e)=>{for(var r in e)Hr(a,r,{get:e[r],enumerable:!0})},oe=(a,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of To(e))!Co.call(a,t)&&t!==r&&Hr(a,t,{get:()=>e[t],enumerable:!(o=Ro(e,t))||o.enumerable});return a};var Or=(a,e,r)=>(r=a!=null?Do(jo(a)):{},oe(e||!a||!a.__esModule?Hr(r,"default",{value:a,enumerable:!0}):r,a)),Wo=a=>oe(Hr({},"__esModule",{value:!0}),a);var we,pe=V(()=>{we=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var be,ge=V(()=>{be=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var xe,he=V(()=>{xe=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var ye,ve=V(()=>{ye=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var Be,_e=V(()=>{Be=`// sscal: x = alpha * x

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
`});var Ae,Ee=V(()=>{Ae=`// sswap: x <-> y

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
`});var ke,Ge=V(()=>{ke=`// saxpy: y = alpha * x + y

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
`});var Ne,Pe=V(()=>{Ne=`// scopy: y = x

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
`});var Me,Se=V(()=>{Me=`// sdot: result = sum(x[i] * y[i])
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
`});var Le,Ie=V(()=>{Le=`// sasum: result = sum(|x[i]|)
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
`});var Re,De=V(()=>{Re=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var je,Te=V(()=>{je=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var We,Ce=V(()=>{We=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var He,Fe=V(()=>{He=`// isamax: returns index of element with largest absolute value
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
`});var Oe,Ue=V(()=>{Oe=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Ke,Ve=V(()=>{Ke=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var qe,ze=V(()=>{qe=`// ssymv: y = alpha * A * x + beta * y
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
`});var Xe,Ye=V(()=>{Xe=`// strmv: y = op(A) * x
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
`});var Ze,Qe=V(()=>{Ze=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Je,$e=V(()=>{Je=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var et,rt=V(()=>{et=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var ot,tt=V(()=>{ot=`// f64add: adds two doubles, each packed as a [main, aux] pair (main: f32
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
`});var it,at=V(()=>{it=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var nt,st=V(()=>{nt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var lt,ut=V(()=>{lt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var mt,ft=V(()=>{mt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var dt,ct=V(()=>{dt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var wt,pt=V(()=>{wt=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var bt,gt=V(()=>{bt=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var xt,ht=V(()=>{xt=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var yt,vt=V(()=>{yt=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Bt,_t=V(()=>{Bt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var At,Et=V(()=>{At=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var kt,Gt=V(()=>{kt=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var Nt,Pt=V(()=>{Nt=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var Mt,St=V(()=>{Mt=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var Lt,It=V(()=>{Lt=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var Rt,Dt=V(()=>{Rt=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`});var jt,Tt=V(()=>{jt=`// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
// x otherLen) block and a sub-range of a strided (any ld, row/col-major)
// buffer \u2014 needed since block offsets aren't 256-byte-aligned and block
// rows/cols aren't always one contiguous range for copyBufferToBuffer.

@group(0) @binding(0) var<storage, read_write> block:   array<f32>; // blockLen x otherLen, block[i*otherLen+j]
@group(0) @binding(1) var<storage, read_write> strided: array<f32>; // B's or A's own buffer

struct Params {
  blockStart: u32,
  blockLen:   u32,
  otherStart: u32,
  otherLen:   u32,
  ld:         u32,
  isColMajor: u32, // 0 = row-major addressing, 1 = column-major (row/col swapped)
  blockIsRow: u32, // 1 = blockStart indexes strided's rows, 0 = its columns
  mode:       u32, // 0 = scatter (strided := block), 1 = scatter_sub (strided -= block), 2 = gather (block := strided)
}

@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.y; // index along the blocked axis, within the block
  let j = gid.x; // index along the other axis, within the block
  if (i >= params.blockLen || j >= params.otherLen) {
    return;
  }

  let row = select(params.otherStart + j, params.blockStart + i, params.blockIsRow == 1u);
  let col = select(params.blockStart + i, params.otherStart + j, params.blockIsRow == 1u);
  let stridedIdx = select(row * params.ld + col, col * params.ld + row, params.isColMajor == 1u);
  let blockIdx = i * params.otherLen + j;

  if (params.mode == 2u) {
    block[blockIdx] = strided[stridedIdx];
  } else if (params.mode == 1u) {
    strided[stridedIdx] -= block[blockIdx];
  } else {
    strided[stridedIdx] = block[blockIdx];
  }
}
`});var Ct={};te(Ct,{shaderSources:()=>Ga});var Ga,Wt=V(()=>{pe();ge();he();ve();_e();Ee();Ge();Pe();Se();Ie();De();Te();Ce();Fe();Ue();Ve();ze();Ye();Qe();$e();rt();tt();at();st();ut();ft();ct();pt();gt();ht();vt();_t();Et();Gt();Pt();St();It();Dt();Tt();Ga={"reduction/argmax":we,"reduction/argmaxF64":be,"reduction/sum":xe,"reduction/sumF64":ye,sscal:Be,sswap:Ae,saxpy:ke,scopy:Ne,sdot:Me,sasum:Le,snrm2:Re,srot:je,srotm:We,isamax:He,sgemv_n:Oe,sgemv_t:Ke,ssymv:qe,strmv:Xe,sger:Ze,ssyr:Je,ssyr2:et,f64add:ot,"f64/dekker":it,"f64/utils/abs":nt,"f64/utils/add":lt,"f64/utils/greater":mt,"f64/utils/equal":dt,dasum:wt,idamax:bt,strsv_invert_block:xt,strsv_apply_inverse:yt,strsv_update:Bt,sgemm_small:At,sgemm_large:kt,sgemmtr_small:Nt,sgemmtr_large:Mt,symmetrize:Lt,triangularize:Rt,block_transfer:jt}});var ni={};te(ni,{GpuMatrix:()=>H,GpuVector:()=>I,cleanup:()=>le,dasum:()=>Xt,gpuName:()=>fe,idamax:()=>Jt,init:()=>ue,isamax:()=>$t,randomFloat32Array:()=>me,randomFloat64Array:()=>ce,randomTriangularFloat32Array:()=>de,sasum:()=>Yt,saxpy:()=>Ot,scopy:()=>Vt,sdot:()=>zt,sgemm:()=>mo,sgemmtr:()=>co,sgemv:()=>to,sger:()=>uo,snrm2:()=>Zt,srot:()=>ro,srotm:()=>eo,sscal:()=>Ht,sswap:()=>Ut,ssymm:()=>bo,ssymv:()=>oo,ssyr:()=>lo,ssyr2:()=>fo,ssyr2k:()=>wo,ssyrk:()=>po,strmm:()=>xo,strmv:()=>ao,strsm:()=>Ao,strsv:()=>no});function ae(a,e){return e?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ie(){if(!se())return{querySet:null,passDescriptor:void 0};let e=ur().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function br(a,e){if(!e)return null;let r=ur(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(e,0,2,o,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,t,0,16),{tsReadBuffer:t,resolveBuffer:o,querySet:e}}async function S(a){if(!a)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=a;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Er=null,Dr=null,ne=null,Xr=!1;async function ue({powerPreference:a="high-performance",benchmark:e=!1,dumpShaders:r=!1}={}){if(Er)return Er;let o;if(typeof window>"u"){let{create:s,globals:f}=await import("webgpu");Object.assign(globalThis,f),o=s(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),ne=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(Dr=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!Dr)throw new Error("No WebGPU adapter found.");Xr=e;let i=[...ae(Dr,e).requiredFeatures??[]];return Er=await Dr.requestDevice({requiredFeatures:i}),Er.addEventListener("uncapturederror",s=>{console.error("Uncaptured GPU error:",s.error.message)}),Er}function le(){Er&&(Er.destroy(),Er=null),Dr=null,ne=null,Xr=!1}function fe(){if(!Dr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:e}=Dr.info;return{description:e||"unknown",device:a||"unknown"}}function se(){return Xr}function ur(){if(!Er)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Er}function d(...a){a.flat().forEach(e=>e.destroy())}function v(a,e="blas-input",r=!1){let o=ur(),t=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,f=o.createBuffer({label:e,size:i,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(f.getMappedRange()).set(a),f.unmap(),f}function er(a,e="blas-storage",r=0){return ur().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|r})}function xr(a,e="blas-result"){return ur().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function N(a,e){let o=ur().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(e,0,o,0,e.size),o}function L(a,e="blas-params"){let r=ur(),o=a.length*4,t=Math.ceil(o/16)*16,i=new ArrayBuffer(t),s=new DataView(i);a.forEach(({value:n,type:u},l)=>{let m=l*4;if(u==="u32")s.setUint32(m,n,!0);else if(u==="i32")s.setInt32(m,n,!0);else if(u==="f32")s.setFloat32(m,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let f=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(f,0,i),f}async function k(a,e=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new e(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function Nr(a){let e=a.length,r=new Float32Array(e),o=new Float32Array(e);for(let t=0;t<e;t++){let i=Math.fround(a[t]);r[t]=i,o[t]=Math.fround(a[t]-i)}return{hi:r,lo:o}}function Rr(a,e){let r=a.length,o=new Float64Array(r);for(let t=0;t<r;t++)o[t]=a[t]+e[t];return o}var I=class a{constructor(e,r,o=Float32Array,t=null){this._buf=e,this._loBuf=t,this.length=r,this.dtype=o}static from(e){if(e instanceof Float64Array){let{hi:o,lo:t}=Nr(e),i=v(o,"gpu-vector-f64-hi",!0),s=v(t,"gpu-vector-f64-lo",!0);return new a(i,e.length,Float64Array,s)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=v(e,"gpu-vector",!0);return new a(r,e.length,e.constructor)}async read(){let e=ur(),r=e.createCommandEncoder(),o=N(r,this._buf);if(e.queue.submit([r.finish()]),!this._loBuf)return k(o,this.dtype);let t=e.createCommandEncoder(),i=N(t,this._loBuf);e.queue.submit([t.finish()]);let[s,f]=await Promise.all([k(o,Float32Array),k(i,Float32Array)]);return Rr(s,f)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var H=class a{constructor(e,r,o,t,i=null,s="row-major"){this._buf=e,this._loBuf=i,this.rows=r,this.cols=o,this.lda=t,this.layout=s}static from(e,r,o,t,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(t===void 0&&(t=s?o:r),!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let f=s?o:r;if(!Number.isInteger(t)||t<f)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?r:o;if(e.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(e instanceof Float64Array){let l=n*t,{hi:m,lo:w}=Nr(e.subarray(0,l)),c=v(m,"gpu-matrix-f64-hi",!0),p=v(w,"gpu-matrix-f64-lo",!0);return new a(c,r,o,t,p,i)}let u=v(e.subarray(0,n*t),"gpu-matrix",!0);return new a(u,r,o,t,null,i)}async read(){let e=ur(),r=e.createCommandEncoder(),o=N(r,this._buf);e.queue.submit([r.finish()]);let t=this.layout!=="column-major",i=t?this.rows:this.cols,s=t?this.cols:this.rows;if(this._loBuf){let u=e.createCommandEncoder(),l=N(u,this._loBuf);e.queue.submit([u.finish()]);let[m,w]=await Promise.all([k(o,Float32Array),k(l,Float32Array)]),c=Rr(m,w);if(this.lda===s)return c;let p=new Float64Array(i*s);for(let g=0;g<i;g++)p.set(c.subarray(g*this.lda,g*this.lda+s),g*s);return p}let f=await k(o,Float32Array);if(this.lda===s)return f;let n=new Float32Array(i*s);for(let u=0;u<i;u++)n.set(f.subarray(u*this.lda,u*this.lda+s),u*s);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function me(a,e=-1,r=1){let o=new Float32Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function ce(a,e=-1,r=1){let o=new Float64Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function de(a,e,r="lower",o=-1,t=1,i=5,s=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e<a)throw new Error("lda must be >= n.");let f=new Float32Array(a*e);for(let n=0;n<a;n++){for(let u=0;u<a;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(f[n*e+u]=o+Math.random()*(t-o))}f[n*e+n]=i+Math.random()*(s-i)}return f}function B(a,e,r=0){let o=ur(),t=e.map((i,s)=>({binding:r+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:t})}var Fo=new WeakMap;function M(a){ur().queue.submit([a.finish()])}function vr(){let a=ur(),{querySet:e,passDescriptor:r}=ie();return{commandEncoder:a.createCommandEncoder(),querySet:e,passDescriptor:r}}function tr(a,e,r,o,t){let i=a.beginComputePass(t);i.setPipeline(e),i.setBindGroup(0,r),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y,o.z??1),i.end(),Fo.set(a,i)}function C(a,e,r){let{commandEncoder:o,querySet:t,passDescriptor:i}=vr();tr(o,a,e,r,i);let s=br(o,t);return{commandEncoder:o,ts:s}}var Na={},Qr=new WeakMap;async function G(a,e,r="main"){Qr.has(a)||Qr.set(a,new Map);let o=Qr.get(a),t=Array.isArray(e)?e:[e],i=`${t.join("+")}::${r}`;return o.has(i)||o.set(i,await Pa(t,r)),o.get(i)}async function ka(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(Wt(),Ct)),r=e[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:t}=await import("path"),i=o(r(Na.url));return e(t(i,`../shaders/${a}.wgsl`),"utf8")}}async function Pa(a,e="main"){let r=ur(),o=a.join("+"),t=(await Promise.all(a.map(ka))).join(`
`),i=r.createShaderModule({label:o,code:t}),f=(await i.getCompilationInfo()).messages.filter(l=>l.type==="error");if(f.length>0)throw new Error(`Shader "${o}" compilation failed:
${f.map(l=>`  line ${l.lineNum}: ${l.message}`).join(`
`)}`);let n=e==="main"?{module:i}:{module:i,entryPoint:e},u=r.createComputePipeline({label:o,layout:"auto",compute:n});return u._shaderModule=i,u}var Sa=64,Ft=8;function mr(a,e){let r=ur().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(a/Sa),r):{x:Math.min(Math.ceil(e/Ft),r),y:Math.min(Math.ceil(a/Ft),r)}}async function Ht(a,e,r,o,t){let i=o instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:o;if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(a,"sscal"),f=null,n=null,u=null;try{f=i?o._buf:v(o,"sscal-x",!0),n=L([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let l=B(s.getBindGroupLayout(0),[f,n]),{commandEncoder:m,ts:w}=C(s,l,mr(e));u=i?null:N(m,f),M(m);let c=await S(w);if(i)return c!==void 0?{gpuTimeMs:c}:{};let p=await k(u,Float32Array);return u=null,c!==void 0?{x:p,gpuTimeMs:c}:p}finally{!i&&f&&d(f),n&&d(n),u&&d(u)}}async function Ut(a,e,r,o,t,i){let s=r instanceof I,f=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof I))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(a,"sswap"),u=null,l=null,m=null,w=null,c=null;try{u=s?r._buf:v(r,"sswap-x",!0),l=f?t._buf:v(t,"sswap-y",!0),m=L([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let p=B(n.getBindGroupLayout(0),[u,l,m]),{commandEncoder:g,ts:h}=C(n,p,mr(e));w=s?null:N(g,u),c=f?null:N(g,l),M(g);let b=await S(h);if(s&&f)return b!==void 0?{gpuTimeMs:b}:{};let x=await k(w,Float32Array);w=null;let y=await k(c,Float32Array);return c=null,b!==void 0?{x,y,gpuTimeMs:b}:{x,y}}finally{!s&&u&&d(u),!f&&l&&d(l),m&&d(m),w&&d(w),c&&d(c)}}async function Ot(a,e,r,o,t,i,s){let f=o instanceof I,n=i instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!f&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:i};if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(a,"saxpy"),l=null,m=null,w=null,c=null;try{l=f?o._buf:v(o,"saxpy-x",!1),m=n?i._buf:v(i,"saxpy-y",!0),w=L([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let p=B(u.getBindGroupLayout(0),[l,m,w]),{commandEncoder:g,ts:h}=C(u,p,mr(e));c=n?null:N(g,m),M(g);let b=await S(h);if(n&&f)return b!==void 0?{gpuTimeMs:b}:{};let x=await k(c,Float32Array);return c=null,b!==void 0?{y:x,gpuTimeMs:b}:{y:x}}finally{!f&&l&&d(l),!n&&m&&d(m),w&&d(w),c&&d(c)}}async function Vt(a,e,r,o,t,i){let s=r instanceof I,f=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return f?{}:{y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(a,"scopy"),u=null,l=null,m=null,w=null;try{u=s?r._buf:v(r,"scopy-x",!1),l=f?t._buf:v(t,"scopy-y",!0),m=L([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let c=B(n.getBindGroupLayout(0),[u,l,m]),{commandEncoder:p,ts:g}=C(n,c,mr(e));w=f?null:N(p,l),M(p);let h=await S(g);if(f&&s)return h!==void 0?{gpuTimeMs:h}:{};let b=await k(w,Float32Array);return w=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!s&&u&&d(u),!f&&l&&d(l),m&&d(m),w&&d(w)}}var Kt=64;async function zt(a,e,r,o,t,i){let s=r instanceof I,f=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(a,"sdot"),u=await G(a,"reduction/sum"),l=null,m=null,w=null,c=null,p=null,g=null;try{l=s?r._buf:v(r,"sdot-x",!1),m=f?t._buf:v(t,"sdot-y",!1),w=er(2*Kt*4,"sdot-partials"),c=xr(4,"sdot-result"),p=L([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let h=B(n.getBindGroupLayout(0),[l,m,w,p]),{commandEncoder:b,ts:x}=C(n,h,2*Kt);M(b);let y=B(u.getBindGroupLayout(0),[w,c]),{commandEncoder:_,ts:A}=C(u,y,1);g=N(_,c),M(_);let P=k(g,Float32Array);g=null;let[E,T,D]=await Promise.all([S(x),S(A),P]);return E!==void 0&&T!==void 0?{dot:D[0],gpuTimeMs:E+T}:{dot:D[0]}}finally{!s&&l&&d(l),!f&&m&&d(m),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}var qt=64;async function Yt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(a,"sasum"),s=await G(a,"reduction/sum"),f=null,n=null,u=null,l=null,m=null;try{f=t?r._buf:v(r,"sasum-x",!1),n=er(2*qt*4,"sasum-partials"),u=xr(4,"sasum-result"),l=L([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params");let w=B(i.getBindGroupLayout(0),[f,n,l]),{commandEncoder:c,ts:p}=C(i,w,2*qt);M(c);let g=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=C(s,g,1);m=N(h,u),M(h);let x=k(m,Float32Array);m=null;let[y,_,A]=await Promise.all([S(p),S(b),x]);return y!==void 0&&_!==void 0?{asum:A[0],gpuTimeMs:y+_}:{asum:A[0]}}finally{!t&&f&&d(f),n&&d(n),u&&d(u),l&&d(l),m&&d(m)}}var Zr=64;async function Xt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],s=await G(a,[...i,"dasum"]),f=await G(a,[...i,"reduction/sumF64"]),n=null,u=null,l=null,m=null,w=null,c=null,p=null,g=null,h=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:z,lo:F}=Nr(r.map(Math.abs));n=v(z,"dasum-xHi",!1),u=v(F,"dasum-xLo",!1)}l=er(2*Zr*4,"dasum-partialsHi"),m=er(2*Zr*4,"dasum-partialsLo"),w=xr(4,"dasum-result-hi"),c=xr(4,"dasum-result-lo"),p=L([{value:e,type:"u32"},{value:o,type:"u32"}],"dasum-params");let b=B(s.getBindGroupLayout(0),[n,u,l,m,p]),{commandEncoder:x,ts:y}=C(s,b,2*Zr);M(x);let _=B(f.getBindGroupLayout(0),[l,m,w,c]),{commandEncoder:A,ts:P}=C(f,_,1);g=N(A,w),h=N(A,c),M(A);let E=k(g,Float32Array),T=k(h,Float32Array);g=null,h=null;let[D,R,j,W]=await Promise.all([S(y),S(P),E,T]),K=Rr(j,W)[0];return D!==void 0&&R!==void 0?{asum:K,gpuTimeMs:D+R}:{asum:K}}finally{!t&&n&&d(n),!t&&u&&d(u),l&&d(l),m&&d(m),w&&d(w),c&&d(c),p&&d(p),g&&d(g),h&&d(h)}}var Qt=64;async function Zt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(a,"snrm2"),s=await G(a,"reduction/sum"),f=null,n=null,u=null,l=null,m=null;try{f=t?r._buf:v(r,"snrm2-x",!1),n=er(2*Qt*4,"snrm2-partials"),u=xr(4,"snrm2-result"),l=L([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let w=B(i.getBindGroupLayout(0),[f,n,l]),{commandEncoder:c,ts:p}=C(i,w,2*Qt);M(c);let g=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=C(s,g,1);m=N(h,u),M(h);let x=k(m,Float32Array);m=null;let[y,_,A]=await Promise.all([S(p),S(b),x]),P=Math.sqrt(A[0]);return y!==void 0&&_!==void 0?{nrm2:P,gpuTimeMs:y+_}:{nrm2:P}}finally{!t&&f&&d(f),n&&d(n),u&&d(u),l&&d(l),m&&d(m)}}var $r=64;async function $t(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(a,"isamax"),s=await G(a,"reduction/argmax"),f=null,n=null,u=null,l=null,m=null,w=null;try{f=t?r._buf:v(r,"isamax-x",!1),n=er(2*$r*4,"isamax-partials-val"),u=er(2*$r*4,"isamax-partials-idx"),l=xr(4,"isamax-result"),m=L([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params");let c=B(i.getBindGroupLayout(0),[f,n,u,m]),{commandEncoder:p,ts:g}=C(i,c,2*$r);M(p);let h=B(s.getBindGroupLayout(0),[n,u,l]),{commandEncoder:b,ts:x}=C(s,h,1);w=N(b,l),M(b);let y=k(w,Uint32Array);w=null;let[_,A,P]=await Promise.all([S(g),S(x),y]),E=P[0];return _!==void 0&&A!==void 0?{index:E,gpuTimeMs:_+A}:{index:E}}finally{!t&&f&&d(f),n&&d(n),u&&d(u),l&&d(l),m&&d(m),w&&d(w)}}var Vr=64;async function Jt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],s=await G(a,[...i,"idamax"],"idamax_main"),f=await G(a,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,l=null,m=null,w=null,c=null,p=null,g=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:j,lo:W}=Nr(r);n=v(j,"idamax-xHi",!1),u=v(W,"idamax-xLo",!1)}l=er(2*Vr*4,"idamax-partials-val-hi"),m=er(2*Vr*4,"idamax-partials-val-lo"),w=er(2*Vr*4,"idamax-partials-idx"),c=xr(4,"idamax-result"),p=L([{value:e,type:"u32"},{value:o,type:"u32"}],"idamax-params");let h=B(s.getBindGroupLayout(0),[n,u,l,m,w,p]),{commandEncoder:b,ts:x}=C(s,h,2*Vr);M(b);let y=B(f.getBindGroupLayout(0),[l,m,w,c]),{commandEncoder:_,ts:A}=C(f,y,1);g=N(_,c),M(_);let P=k(g,Uint32Array);g=null;let[E,T,D]=await Promise.all([S(x),S(A),P]),R=D[0];return E!==void 0&&T!==void 0?{index:R,gpuTimeMs:E+T}:{index:R}}finally{!t&&n&&d(n),!t&&u&&d(u),l&&d(l),m&&d(m),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function ro(a,e,r,o,t,i,s,f){let n=r instanceof I,u=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof f!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(f))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(f))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await G(a,"srot"),m=null,w=null,c=null,p=null,g=null;try{m=n?r._buf:v(r,"srot-x",!0),w=u?t._buf:v(t,"srot-y",!0),c=L([{value:e,type:"u32"},{value:s,type:"f32"},{value:f,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let h=B(l.getBindGroupLayout(0),[m,w,c]),{commandEncoder:b,ts:x}=C(l,h,mr(e));p=n?null:N(b,m),g=u?null:N(b,w),M(b);let y=await S(x);if(n&&u)return y!==void 0?{gpuTimeMs:y}:{};let _=k(p,Float32Array),A=k(g,Float32Array);p=null,g=null;let[P,E]=await Promise.all([_,A]);return y!==void 0?{x:P,y:E,gpuTimeMs:y}:{x:P,y:E}}finally{!n&&m&&d(m),!u&&w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function eo(a,e,r,o,t,i,s){let f=r instanceof I,n=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!f&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return f?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(a,"srotm"),l=null,m=null,w=null,c=null,p=null,g=null;try{l=f?r._buf:v(r,"srotm-x",!0),m=n?t._buf:v(t,"srotm-y",!0),w=v(s,"srotm-param",!1),c=L([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let h=B(u.getBindGroupLayout(0),[l,m,w,c]),{commandEncoder:b,ts:x}=C(u,h,mr(e));p=f?null:N(b,l),g=n?null:N(b,m),M(b);let y=await S(x);if(f&&n)return y!==void 0?{gpuTimeMs:y}:{};let _=k(p,Float32Array),A=k(g,Float32Array);p=null,g=null;let[P,E]=await Promise.all([_,A]);return y!==void 0?{x:P,y:E,gpuTimeMs:y}:{x:P,y:E}}finally{!f&&l&&d(l),!n&&m&&d(m),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function to(a,e,r,o,t,i,s,f,n,u,l,m,w="row-major"){let c=i instanceof H,p=f instanceof I,g=l instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(f instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&f._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:l};(c?i.layout:w)==="column-major"&&([r,o]=[o,r],e=e==="no-transpose"?"transpose":"no-transpose");let b=e==="no-transpose",x=b?o:r,y=b?r:o;if(s<o)throw new Error("lda must be >= n.");if(!c&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(f.length<(x-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(l.length<(y-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let A=await G(a,b?"sgemv_n":"sgemv_t"),P=c?i._buf:v(i,"sgemv-A",!1),E=p?f._buf:v(f,"sgemv-x",!1),T=g?l._buf:v(l,"sgemv-y",!0),D=L([{value:r,type:"u32"},{value:o,type:"u32"},{value:t,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let R=B(A.getBindGroupLayout(0),[P,E,T,D]),j=b?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):mr(y),{commandEncoder:W,ts:K}=C(A,R,j),z=g?null:N(W,T);M(W);let F=await S(K);if(g)return F!==void 0?{gpuTimeMs:F}:{};let $=await k(z,Float32Array);return F!==void 0?{y:$,gpuTimeMs:F}:{y:$}}finally{c||d(P),p||d(E),g||d(T),d(D)}}async function oo(a,e,r,o,t,i,s,f,n,u,l,m="row-major"){let w=s instanceof I,c=u instanceof I,p=t instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(f)||!Number.isInteger(l)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(f<=0||l<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{y:u};if(!p&&t.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*f+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(p?t.layout:m)==="column-major"?e==="upper":e==="lower",b=await G(a,"ssymv"),x=null,y=null,_=null,A=null;try{x=p?t._buf:v(t,"ssymv-A",!1),y=w?s._buf:v(s,"ssymv-x",!1),_=c?u._buf:v(u,"ssymv-y",!0),A=L([{value:r,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:f,type:"u32"},{value:l,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let P=B(b.getBindGroupLayout(0),[x,y,_,A]),E=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:T,ts:D}=C(b,P,E),R=c?null:N(T,_);M(T);let j=await S(D);if(c)return j!==void 0?{gpuTimeMs:j}:{};let W=await k(R,Float32Array);return j!==void 0?{y:W,gpuTimeMs:j}:{y:W}}finally{!p&&x&&d(x),!w&&y&&d(y),!c&&_&&d(_),A&&d(A)}}async function ao(a,e,r,o,t,i,s,f,n,u,l,m="row-major"){let w=f instanceof I,c=u instanceof I,p=i instanceof H,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||l<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!p&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(f instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&f._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&c&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return c?{}:{y:u};if(!p&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(f.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(t-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(p?i.layout:m)==="column-major",x=b?e==="upper":e==="lower",y=b?r==="transpose":r==="no-transpose",_=await G(a,"strmv"),A=null,P=null,E=null,T=null;try{A=p?i._buf:v(i,"strmv-A",!1),P=w?f._buf:v(f,"strmv-x",!1),E=c?u._buf:v(u,"strmv-y",!0),T=L([{value:t,type:"u32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"},{value:y?0:1,type:"u32"},{value:x?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let D=B(_.getBindGroupLayout(0),[A,P,E,T]),R=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:W}=C(_,D,R),K=c?null:N(j,E);M(j);let z=await S(W);if(c)return z!==void 0?{gpuTimeMs:z}:{};let F=await k(K,Float32Array);return z!==void 0?{y:F,gpuTimeMs:z}:{y:F}}finally{!p&&A&&d(A),!w&&P&&d(P),!c&&E&&d(E),T&&d(T)}}var Ar=64;function io(a,e,r){let o=new ArrayBuffer(a*e),t=new DataView(o);for(let i=0;i<a;i++){let s=r(i),f=i*e;s.forEach((n,u)=>t.setUint32(f+u*4,n,!0))}return o}function so(a,e,r){let o=a.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,e),o}async function no(a,e,r,o,t,i,s,f,n,u="row-major"){let l=f instanceof I,m=i instanceof H,w=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!w&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!m&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(f instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!l)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return l?{}:{x:f};if(!m&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(f.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(m?i.layout:u)==="column-major",g=p?e==="upper":e==="lower",h=p?r==="transpose":r==="no-transpose",b=await G(a,"strsv_invert_block"),x=await G(a,"strsv_apply_inverse"),y=await G(a,"strsv_update"),_=h===g,A=[];for(let F=0;F<t;F+=Ar)A.push(F);_||A.reverse();let P=A.length,E=a.limits.maxComputeWorkgroupsPerDimension,T=a.limits.minUniformBufferOffsetAlignment,D=null,R=null,j=null,W=null,K=null,z=null;try{D=m?i._buf:v(i,"strsv-A",!1),R=l?f._buf:v(f,"strsv-x",!0),j=er(P*Ar*Ar*4,"strsv-Ainv");let F=io(P,T,Y=>{let q=Y*Ar,U=Math.min(q+Ar,t);return[n,Y,q,U]});W=so(a,F,"strsv-apply-params");let $=io(P,T,Y=>{let q=Y*Ar,U=Math.min(q+Ar,t);return[t,n,s,h?0:1,g?0:1,q,U]});K=so(a,$,"strsv-update-params");let{commandEncoder:Q,querySet:J}=vr();z=L([{value:t,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:w?1:0,type:"u32"}],"strsv-invert-params");let ir=B(b.getBindGroupLayout(0),[D,j,z]);tr(Q,b,ir,{x:Ar,y:P},J?{timestampWrites:{querySet:J,beginningOfPassWriteIndex:0}}:void 0);for(let Y=0;Y<A.length;Y++){let q=A[Y],U=Math.min(q+Ar,t),X=q/Ar,ar=Y===A.length-1,lr=X*T,pr=B(x.getBindGroupLayout(0),[j,R,{buffer:W,offset:lr,size:16}]);tr(Q,x,pr,1,ar&&J?{timestampWrites:{querySet:J,endOfPassWriteIndex:1}}:void 0);let cr=_?t-U:q;if(cr===0)continue;let dr=B(y.getBindGroupLayout(0),[D,R,{buffer:K,offset:lr,size:32}]),wr=Math.min(cr,E);tr(Q,y,dr,wr)}let or=br(Q,J),Z=l?null:N(Q,R);M(Q);let rr=await S(or);if(l)return rr!==void 0?{gpuTimeMs:rr}:{};let O=await k(Z,Float32Array);return rr!==void 0?{x:O,gpuTimeMs:rr}:{x:O}}finally{!m&&D&&d(D),!l&&R&&d(R),j&&d(j),W&&d(W),K&&d(K),z&&d(z)}}async function uo(a,e,r,o,t,i,s,f,n,u,l="row-major"){let m=n instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(f)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||f<=0)throw new Error("incx and incy must be positive.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(m&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");(m?n.layout:l)==="column-major"&&([e,r]=[r,e],[t,s]=[s,t],[i,f]=[f,i]);let c=t instanceof I,p=s instanceof I;if(u<r)throw new Error("lda must be >= n.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(m&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return m?{}:{A:n};if(!m&&n.length<(e-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await G(a,"sger"),h=null,b=null,x=null,y=null;try{h=c?t._buf:v(t,"sger-x",!1),b=p?s._buf:v(s,"sger-y",!1),x=m?n._buf:v(n,"sger-A",!0),y=L([{value:e,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:f,type:"u32"},{value:u,type:"u32"}],"sger-params");let _=B(g.getBindGroupLayout(0),[h,b,x,y]),A=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:P,ts:E}=C(g,_,A),T=m?null:N(P,x);M(P);let D=await S(E);if(m)return D!==void 0?{gpuTimeMs:D}:{};let R=await k(T,Float32Array);return D!==void 0?{A:R,gpuTimeMs:D}:{A:R}}finally{!c&&h&&d(h),!p&&b&&d(b),!m&&x&&d(x),y&&d(y)}}async function lo(a,e,r,o,t,i,s,f,n="row-major"){let u=t instanceof I,l=s instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(f))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(f<r)throw new Error("lda must be >= n.");if(!l&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!l)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(l&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(l&&u&&s._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(l&&f!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return l?{}:{A:s};if(!l&&s.length<(r-1)*f+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(l?s.layout:n)==="column-major"?e==="upper":e==="lower",c=await G(a,"ssyr"),p=null,g=null,h=null;try{p=u?t._buf:v(t,"ssyr-x",!1),g=l?s._buf:v(s,"ssyr-A",!0),h=L([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:f,type:"u32"},{value:w?0:1,type:"u32"}],"ssyr-params");let b=B(c.getBindGroupLayout(0),[p,g,h]),x=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:y,ts:_}=C(c,b,x),A=l?null:N(y,g);M(y);let P=await S(_);if(l)return P!==void 0?{gpuTimeMs:P}:{};let E=await k(A,Float32Array);return P!==void 0?{A:E,gpuTimeMs:P}:{A:E}}finally{!u&&p&&d(p),!l&&g&&d(g),h&&d(h)}}async function fo(a,e,r,o,t,i,s,f,n,u,l="row-major"){let m=t instanceof I,w=s instanceof I,c=n instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(f)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||f<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!m)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&m&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&w&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(m&&t._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{A:n};if(!c&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?n.layout:l)==="column-major"?e==="upper":e==="lower",h=await G(a,"ssyr2"),b=null,x=null,y=null,_=null;try{b=m?t._buf:v(t,"ssyr2-x",!1),x=w?s._buf:v(s,"ssyr2-y",!1),y=c?n._buf:v(n,"ssyr2-A",!0),_=L([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:f,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let A=B(h.getBindGroupLayout(0),[b,x,y,_]),P=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:E,ts:T}=C(h,A,P),D=c?null:N(E,y);M(E);let R=await S(T);if(c)return R!==void 0?{gpuTimeMs:R}:{};let j=await k(D,Float32Array);return R!==void 0?{A:j,gpuTimeMs:R}:{A:j}}finally{!m&&b&&d(b),!w&&x&&d(x),!c&&y&&d(y),_&&d(_)}}var Ma=32,Ia=32,La=64,Da=64,Ra=36;async function mo(a,e,r,o,t,i,s,f,n,u,l,m,w,c,p="row-major"){let g=f instanceof H,h=u instanceof H,b=w instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(f instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(w instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||t===0)return b?{}:{C:w};let x=g?f.layout:p,y=h?u.layout:p,_=b?w.layout:p,A=x==="column-major"?i:o,P=x==="column-major"?o:i,E=e==="no-transpose"?A:P,T=e==="no-transpose"?P:A;if(n<T)throw new Error(`lda must be >= ${x==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==f.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[rr,O]=e==="no-transpose"?[o,i]:[i,o];if(f.rows<rr||f.cols<O)throw new Error("A is too small for the given m, k, and transA.")}else if(f.length<(E-1)*n+T)throw new Error("A does not have enough elements for the given dimensions and lda.");let D=y==="column-major"?t:i,R=y==="column-major"?i:t,j=r==="no-transpose"?D:R,W=r==="no-transpose"?R:D;if(l<W)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(l!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[rr,O]=r==="no-transpose"?[i,t]:[t,i];if(u.rows<rr||u.cols<O)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(j-1)*l+W)throw new Error("B does not have enough elements for the given dimensions and ldb.");let K=_==="column-major"?t:o,z=_==="column-major"?o:t;if(c<z)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==w.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(w.rows<o||w.cols<t)throw new Error("C is too small for the given m and n.")}else if(w.length<(K-1)*c+z)throw new Error("C does not have enough elements for the given dimensions and ldc.");x==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&([f,u]=[u,f],[g,h]=[h,g],[n,l]=[l,n],[e,r]=[r==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[o,t]=[t,o]);let F=Math.ceil(t/Da),$=Math.ceil(o/La),Q=F*$>=Ra,J=await G(a,Q?"sgemm_large":"sgemm_small"),ir=g?f._buf:v(f,"sgemm-A",!1),nr=h?u._buf:v(u,"sgemm-B",!1),or=b?w._buf:v(w,"sgemm-C",!0),Z=L([{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"f32"},{value:m,type:"f32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:c,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let rr=B(J.getBindGroupLayout(0),[ir,nr,or,Z]),O=Q?{x:Math.min(F,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min($,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(t/Ia),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Ma),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Y,ts:q}=C(J,rr,O),U=b?null:N(Y,or);M(Y);let X=await S(q);if(b)return X!==void 0?{gpuTimeMs:X}:{};let ar=await k(U,Float32Array);return X!==void 0?{C:ar,gpuTimeMs:X}:{C:ar}}finally{g||d(ir),h||d(nr),b||d(or),d(Z)}}var Ta=32,ja=32,Ca=64,Wa=64,Fa=36;async function co(a,e,r,o,t,i,s,f,n,u,l,m,w,c,p,g="row-major"){let h=n instanceof H,b=l instanceof H,x=c instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof f!="number")throw new Error("alpha must be a number.");if(Number.isNaN(f))throw new Error("alpha must not be NaN.");if(!Number.isFinite(f))throw new Error("alpha must be finite.");if(typeof w!="number")throw new Error("beta must be a number.");if(Number.isNaN(w))throw new Error("beta must not be NaN.");if(!Number.isFinite(w))throw new Error("beta must be finite.");if(!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(p))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!x&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!x)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(x&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(t<0||i<0||s<0)throw new Error("m, n, and k must be non-negative.");if(t===0||i===0)return x?{}:{C:c};let y=h?n.layout:g,_=b?l.layout:g,A=x?c.layout:g,P=y==="column-major"?s:t,E=y==="column-major"?t:s,T=r==="no-transpose"?P:E,D=r==="no-transpose"?E:P;if(u<D)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[O,Y]=r==="no-transpose"?[t,s]:[s,t];if(n.rows<O||n.cols<Y)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(T-1)*u+D)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=_==="column-major"?i:s,j=_==="column-major"?s:i,W=o==="no-transpose"?R:j,K=o==="no-transpose"?j:R;if(m<K)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(m!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[O,Y]=o==="no-transpose"?[s,i]:[i,s];if(l.rows<O||l.cols<Y)throw new Error("B is too small for the given n, k, and transB.")}else if(l.length<(W-1)*m+K)throw new Error("B does not have enough elements for the given dimensions and ldb.");let z=A==="column-major"?i:t,F=A==="column-major"?t:i;if(p<F)throw new Error(`ldc must be >= ${A==="column-major"?"rows":"cols"} of C as stored.`);if(x){if(p!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<t||c.cols<i)throw new Error("C is too small for the given m and n.")}else if(c.length<(z-1)*p+F)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),A==="column-major"&&([n,l]=[l,n],[h,b]=[b,h],[u,m]=[m,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[t,i]=[i,t],e=e==="lower"?"upper":"lower");let $=Math.ceil(i/Wa),Q=Math.ceil(t/Ca),J=$*Q>=Fa,ir=await G(a,J?"sgemmtr_large":"sgemmtr_small"),nr=h?n._buf:v(n,"sgemmtr-A",!1),or=b?l._buf:v(l,"sgemmtr-B",!1),Z=x?c._buf:v(c,"sgemmtr-C",!0),rr=L([{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"u32"},{value:f,type:"f32"},{value:w,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:p,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:e==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let O=B(ir.getBindGroupLayout(0),[nr,or,Z,rr]),Y=J?{x:Math.min($,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/ja),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(t/Ta),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:q,ts:U}=C(ir,O,Y),X=x?null:N(q,Z);M(q);let ar=await S(U);if(x)return ar!==void 0?{gpuTimeMs:ar}:{};let lr=await k(X,Float32Array);return ar!==void 0?{C:lr,gpuTimeMs:ar}:{C:lr}}finally{h||d(nr),b||d(or),x||d(Z),d(rr)}}var Ha=32,Ua=32,Oa=64,Va=64,Ka=36;async function po(a,e,r,o,t,i,s,f,n,u,l,m="row-major"){let w=s instanceof H,c=u instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(f)||!Number.isInteger(l))throw new Error("n, k, lda, and ldc must be integers.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(w&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!w)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return c?{}:{C:u};let p=w?s.layout:m,g=c?u.layout:m,h=p==="column-major"?t:o,b=p==="column-major"?o:t,x=r==="no-transpose"?h:b,y=r==="no-transpose"?b:h;if(f<y)throw new Error(`lda must be >= ${p==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(f!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[F,$]=r==="no-transpose"?[o,t]:[t,o];if(s.rows<F||s.cols<$)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(x-1)*f+y)throw new Error("A does not have enough elements for the given dimensions and lda.");if(l<o)throw new Error("ldc must be >= n.");if(c){if(l!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*l+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let _=r;p==="column-major"&&(_=_==="no-transpose"?"transpose":"no-transpose");let A=_==="no-transpose"?"transpose":"no-transpose",P=e;g==="column-major"&&([_,A]=[A==="no-transpose"?"transpose":"no-transpose",_==="no-transpose"?"transpose":"no-transpose"],P=P==="lower"?"upper":"lower");let E=Math.ceil(o/Va),T=Math.ceil(o/Oa),D=E*T>=Ka,R=await G(a,D?"sgemmtr_large":"sgemmtr_small"),j=w?s._buf:v(s,"ssyrk-A",!1),W=c?u._buf:v(u,"ssyrk-C",!0),K=w?er(j.size,"ssyrk-B",GPUBufferUsage.COPY_DST):v(s,"ssyrk-B",!1),z=L([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"f32"},{value:n,type:"f32"},{value:f,type:"u32"},{value:f,type:"u32"},{value:l,type:"u32"},{value:_==="transpose"?1:0,type:"u32"},{value:A==="transpose"?1:0,type:"u32"},{value:P==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let F=B(R.getBindGroupLayout(0),[j,K,W,z]),$=D?{x:Math.min(E,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(T,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Ua),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Ha),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Q,querySet:J,passDescriptor:ir}=vr();w&&Q.copyBufferToBuffer(j,0,K,0,j.size),tr(Q,R,F,$,ir);let nr=br(Q,J),or=c?null:N(Q,W);M(Q);let Z=await S(nr);if(c)return Z!==void 0?{gpuTimeMs:Z}:{};let rr=await k(or,Float32Array);return Z!==void 0?{C:rr,gpuTimeMs:Z}:{C:rr}}finally{w||d(j),d(K),c||d(W),d(z)}}var za=32,qa=32,Ya=64,Xa=64,Qa=36;async function wo(a,e,r,o,t,i,s,f,n,u,l,m,w,c="row-major"){let p=s instanceof H,g=n instanceof H,h=m instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(f)||!Number.isInteger(u)||!Number.isInteger(w))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((p||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!p||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return h?{}:{C:m};let b=p?s.layout:c,x=g?n.layout:c,y=h?m.layout:c,_=b==="column-major"?t:o,A=b==="column-major"?o:t,P=r==="no-transpose"?_:A,E=r==="no-transpose"?A:_;if(f<E)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(f!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[U,X]=r==="no-transpose"?[o,t]:[t,o];if(s.rows<U||s.cols<X)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(P-1)*f+E)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=x==="column-major"?t:o,D=x==="column-major"?o:t,R=r==="no-transpose"?T:D,j=r==="no-transpose"?D:T;if(u<j)throw new Error(`ldb must be >= ${x==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[U,X]=r==="no-transpose"?[o,t]:[t,o];if(n.rows<U||n.cols<X)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(R-1)*u+j)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(w<o)throw new Error("ldc must be >= n.");if(h){if(w!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<o||m.cols<o)throw new Error("C is too small for the given n.")}else if(m.length<(o-1)*w+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let W=r;b==="column-major"&&(W=W==="no-transpose"?"transpose":"no-transpose");let K=r;x==="column-major"&&(K=K==="no-transpose"?"transpose":"no-transpose");let z=y==="column-major"?e==="lower"?"upper":"lower":e,F=U=>U==="no-transpose"?"transpose":"no-transpose";function $(U,X,ar,lr,pr,fr){let cr=U,dr=F(lr);return y!=="column-major"?{transX:cr,X,ldX:ar,transY:dr,Y:pr,ldY:fr}:{transX:F(dr),X:pr,ldX:fr,transY:F(cr),Y:X,ldY:ar}}let Q=Math.ceil(o/Xa),J=Math.ceil(o/Ya),ir=Q*J>=Qa,nr=await G(a,ir?"sgemmtr_large":"sgemmtr_small"),or=ir?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/qa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/za),a.limits.maxComputeWorkgroupsPerDimension)},Z=p?s._buf:v(s,"ssyr2k-A",!1),rr=g?n._buf:v(n,"ssyr2k-B",!1),O=h?m._buf:v(m,"ssyr2k-C",!0),Y=null,q=null;try{let U=$(W,Z,f,K,rr,u),X=$(K,rr,u,W,Z,f),ar=(_r,Sr)=>L([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"f32"},{value:Sr,type:"f32"},{value:_r.ldX,type:"u32"},{value:_r.ldY,type:"u32"},{value:w,type:"u32"},{value:_r.transX==="transpose"?1:0,type:"u32"},{value:_r.transY==="transpose"?1:0,type:"u32"},{value:z==="upper"?1:0,type:"u32"}],"ssyr2k-params");Y=ar(U,l),q=ar(X,1);let lr=B(nr.getBindGroupLayout(0),[U.X,U.Y,O,Y]),pr=B(nr.getBindGroupLayout(0),[X.X,X.Y,O,q]),{commandEncoder:fr,querySet:cr}=vr(),dr=cr?{timestampWrites:{querySet:cr,beginningOfPassWriteIndex:0}}:void 0,wr=cr?{timestampWrites:{querySet:cr,endOfPassWriteIndex:1}}:void 0;tr(fr,nr,lr,or,dr),tr(fr,nr,pr,or,wr);let yr=br(fr,cr),sr=h?null:N(fr,O);M(fr);let gr=await S(yr);if(h)return gr!==void 0?{gpuTimeMs:gr}:{};let hr=await k(sr,Float32Array);return gr!==void 0?{C:hr,gpuTimeMs:gr}:{C:hr}}finally{p||d(Z),g||d(rr),h||d(O),Y&&d(Y),q&&d(q)}}var Za=32,$a=32,Ja=64,ri=64,ei=36,go=8;async function bo(a,e,r,o,t,i,s,f,n,u,l,m,w,c="row-major"){let p=s instanceof H,g=n instanceof H,h=m instanceof H;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(f)||!Number.isInteger(u)||!Number.isInteger(w))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((p||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!p||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("m and n must be non-negative.");if(o===0||t===0)return h?{}:{C:m};let b=p?s.layout:c,x=g?n.layout:c,y=h?m.layout:c,_=e==="left"?o:t;if(f<_)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(p){if(f!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(s.rows<_||s.cols<_)throw new Error("A is too small for the given m/n and side.")}else if(s.length<(_-1)*f+_)throw new Error("A does not have enough elements for the given dimensions and lda.");let A=x==="column-major"?t:o,P=x==="column-major"?o:t;if(u<P)throw new Error(`ldb must be >= ${x==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<o||n.cols<t)throw new Error("B is too small for the given m and n.")}else if(n.length<(A-1)*u+P)throw new Error("B does not have enough elements for the given dimensions and ldb.");let E=y==="column-major"?t:o,T=y==="column-major"?o:t;if(w<T)throw new Error(`ldc must be >= ${y==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(w!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<o||m.cols<t)throw new Error("C is too small for the given m and n.")}else if(m.length<(E-1)*w+T)throw new Error("C does not have enough elements for the given dimensions and ldc.");let D=b==="column-major"?r==="lower"?"upper":"lower":r,R=x==="column-major"?"transpose":"no-transpose",j="no-transpose",W=o,K=t,z=_,F=e==="left"?j:R,$=e==="left"?R:j,Q=fr=>fr==="no-transpose"?"transpose":"no-transpose",J=e==="right";y==="column-major"&&([F,$]=[Q($),Q(F)],J=!J,[W,K]=[K,W]);let ir=_,nr=Math.ceil(K/ri),or=Math.ceil(W/Ja),Z=nr*or>=ei,rr=await G(a,Z?"sgemm_large":"sgemm_small"),O=await G(a,"symmetrize"),Y=Z?{x:Math.min(nr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(or,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(K/$a),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(W/Za),a.limits.maxComputeWorkgroupsPerDimension)},q=p?s._buf:v(s,"ssymm-A",!1),U=g?n._buf:v(n,"ssymm-B",!1),X=h?m._buf:v(m,"ssymm-C",!0),ar=er(_*ir*4,"ssymm-Adense"),lr=null,pr=null;try{lr=L([{value:_,type:"u32"},{value:f,type:"u32"},{value:ir,type:"u32"},{value:D==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let fr=B(O.getBindGroupLayout(0),[q,ar,lr]),cr=J?U:ar,dr=J?u:ir,wr=J?ar:U;pr=L([{value:W,type:"u32"},{value:K,type:"u32"},{value:z,type:"u32"},{value:i,type:"f32"},{value:l,type:"f32"},{value:dr,type:"u32"},{value:J?ir:u,type:"u32"},{value:w,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:$==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let sr=B(rr.getBindGroupLayout(0),[cr,wr,X,pr]),{commandEncoder:gr,querySet:hr}=vr(),_r=hr?{timestampWrites:{querySet:hr,beginningOfPassWriteIndex:0}}:void 0,Sr=hr?{timestampWrites:{querySet:hr,endOfPassWriteIndex:1}}:void 0;tr(gr,O,fr,{x:Math.ceil(_/go),y:Math.ceil(_/go)},_r),tr(gr,rr,sr,Y,Sr);let kr=br(gr,hr),Pr=h?null:N(gr,X);M(gr);let Gr=await S(kr);if(h)return Gr!==void 0?{gpuTimeMs:Gr}:{};let Tr=await k(Pr,Float32Array);return Gr!==void 0?{C:Tr,gpuTimeMs:Gr}:{C:Tr}}finally{p||d(q),g||d(U),h||d(X),d(ar),lr&&d(lr),pr&&d(pr)}}var ti=32,oi=32,ai=64,ii=64,si=36,ho=8;async function xo(a,e,r,o,t,i,s,f,n,u,l,m,w="row-major"){let c=n instanceof H,p=l instanceof H,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof f!="number")throw new Error("alpha must be a number.");if(Number.isNaN(f))throw new Error("alpha must not be NaN.");if(!Number.isFinite(f))throw new Error("alpha must be finite.");if(!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(m))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==p)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(i<0||s<0)throw new Error("m and n must be non-negative.");if(i===0||s===0)return p?{}:{B:l};let h=c?n.layout:w,b=p?l.layout:w,x=e==="left"?i:s;if(u<x)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<x||n.cols<x)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(x-1)*u+x)throw new Error("A does not have enough elements for the given dimensions and lda.");let y=b==="column-major"?s:i,_=b==="column-major"?i:s;if(m<_)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(p){if(m!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(l.rows<i||l.cols<s)throw new Error("B is too small for the given m and n.")}else if(l.length<(y-1)*m+_)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?r==="lower"?"upper":"lower":r,P=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,E=b==="column-major"?"transpose":"no-transpose",T="no-transpose",D=i,R=s,j=x,W=e==="left"?T:E,K=e==="left"?E:T,z=lr=>lr==="no-transpose"?"transpose":"no-transpose",F=e==="right";b==="column-major"&&([W,K]=[z(K),z(W)],F=!F,[D,R]=[R,D]);let $=x,Q=Math.ceil(R/ii),J=Math.ceil(D/ai),ir=Q*J>=si,nr=await G(a,ir?"sgemm_large":"sgemm_small"),or=await G(a,"triangularize"),Z=ir?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(R/oi),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(D/ti),a.limits.maxComputeWorkgroupsPerDimension)},rr=c?n._buf:v(n,"strmm-A",!1),O=p?l._buf:v(l,"strmm-B",!0),Y=er(x*$*4,"strmm-Adense"),q=er(y*m*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),U=null,X=null,ar=!1;try{U=L([{value:x,type:"u32"},{value:u,type:"u32"},{value:$,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:P==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let lr=B(or.getBindGroupLayout(0),[rr,Y,U]),pr=F?O:Y,fr=F?m:$,cr=F?Y:O;X=L([{value:D,type:"u32"},{value:R,type:"u32"},{value:j,type:"u32"},{value:f,type:"f32"},{value:0,type:"f32"},{value:fr,type:"u32"},{value:F?$:m,type:"u32"},{value:m,type:"u32"},{value:W==="transpose"?1:0,type:"u32"},{value:K==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let wr=B(nr.getBindGroupLayout(0),[pr,cr,q,X]),{commandEncoder:yr,querySet:sr}=vr();yr.copyBufferToBuffer(O,0,q,0,Math.min(O.size,q.size));let gr=sr?{timestampWrites:{querySet:sr,beginningOfPassWriteIndex:0}}:void 0,hr=sr?{timestampWrites:{querySet:sr,endOfPassWriteIndex:1}}:void 0;tr(yr,or,lr,{x:Math.ceil(x/ho),y:Math.ceil(x/ho)},gr),tr(yr,nr,wr,Z,hr);let _r=br(yr,sr),Sr=p?null:N(yr,q);M(yr);let kr=await S(_r);if(p)return d(l._buf),l._buf=q,ar=!0,kr!==void 0?{gpuTimeMs:kr}:{};let Pr=await k(Sr,Float32Array);return kr!==void 0?{B:Pr,gpuTimeMs:kr}:{B:Pr}}finally{c||d(rr),p||d(O),d(Y),ar||d(q),U&&d(U),X&&d(X)}}var Br=64,vo=32,yo=32,_o=64,Bo=64,Eo=36;async function Ao(a,e,r,o,t,i,s,f,n,u,l,m,w="row-major"){let c=n instanceof H,p=l instanceof H,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof f!="number")throw new Error("alpha must be a number.");if(Number.isNaN(f))throw new Error("alpha must not be NaN.");if(!Number.isFinite(f))throw new Error("alpha must be finite.");if(!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(m))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==p)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(i<0||s<0)throw new Error("m and n must be non-negative.");if(i===0||s===0)return p?{}:{B:l};let h=c?n.layout:w,b=p?l.layout:w,x=e==="left"?i:s;if(u<x)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<x||n.cols<x)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(x-1)*u+x)throw new Error("A does not have enough elements for the given dimensions and lda.");let y=b==="column-major"?s:i,_=b==="column-major"?i:s;if(m<_)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(p){if(m!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(l.rows<i||l.cols<s)throw new Error("B is too small for the given m and n.")}else if(l.length<(y-1)*m+_)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?r==="lower"?"upper":"lower":r,P=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,E=e==="left"?s:i,T=e==="left",D=P==="no-transpose"==(A==="lower"),R=e==="left"?D:!D,j=[];for(let O=0;O<x;O+=Br)j.push(O);R||j.reverse();let W=j.length,K=await G(a,"strsv_invert_block"),z=await G(a,"block_transfer"),F=await G(a,"sscal"),$=c?n._buf:v(n,"strsm-A",!1),Q=p?l._buf:v(l,"strsm-B",!0),J=er(W*Br*Br*4,"strsm-Ainv"),ir=[],nr=[];function or(O,Y){let q=er(O,Y);return nr.push(q),q}function Z(O,Y){let q=L(O,Y);return ir.push(q),q}let rr=(y-1)*m+_;try{let O=null;if(f!==1){let dr=Z([{value:rr,type:"u32"},{value:f,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");O=B(F.getBindGroupLayout(0),[Q,dr])}let Y=Z([{value:x,type:"u32"},{value:u,type:"u32"},{value:P==="transpose"?1:0,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),q=B(K.getBindGroupLayout(0),[$,J,Y]),{commandEncoder:U,querySet:X}=vr();O&&tr(U,F,O,mr(y*m)),tr(U,K,q,{x:Br,y:W},X?{timestampWrites:{querySet:X,beginningOfPassWriteIndex:0}}:void 0);for(let dr=0;dr<j.length;dr++){let wr=j[dr],yr=Math.min(wr+Br,x),sr=yr-wr,gr=wr/Br,hr=dr===j.length-1,_r=or(sr*E*4,"strsm-Bblock"),Sr=Z([{value:wr,type:"u32"},{value:sr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:T?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),kr=B(z.getBindGroupLayout(0),[_r,Q,Sr]);tr(U,z,kr,mr(sr,E));let Pr=or(sr*E*4,"strsm-Xblock");{let Ir=sr,Lr=E,Kr=sr,jr=Math.ceil(Lr/Bo),Cr=Math.ceil(Ir/_o),Wr=jr*Cr>=Eo,Fr=await G(a,Wr?"sgemm_large":"sgemm_small"),zr=Z([{value:Ir,type:"u32"},{value:Lr,type:"u32"},{value:Kr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:Br,type:"u32"},{value:E,type:"u32"},{value:E,type:"u32"},{value:e==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),qr=B(Fr.getBindGroupLayout(0),[{buffer:J,offset:gr*Br*Br*4,size:Br*Br*4},_r,Pr,zr]),Yr=Wr?{x:Math.min(jr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Lr/yo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Ir/vo),a.limits.maxComputeWorkgroupsPerDimension)};tr(U,Fr,qr,Yr)}let Gr=R?yr:0,Tr=R?x:wr,Jr=Gr<Tr,Go=Z([{value:wr,type:"u32"},{value:sr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:T?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),ko=B(z.getBindGroupLayout(0),[Pr,Q,Go]),Po=hr&&!Jr&&X?{timestampWrites:{querySet:X,endOfPassWriteIndex:1}}:void 0;if(tr(U,z,ko,mr(sr,E),Po),!Jr)continue;let Mr=Tr-Gr,re=or(Mr*sr*4,"strsm-Aoff"),No=Z([{value:Gr,type:"u32"},{value:Mr,type:"u32"},{value:wr,type:"u32"},{value:sr,type:"u32"},{value:u,type:"u32"},{value:P==="transpose"?1:0,type:"u32"},{value:T?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),So=B(z.getBindGroupLayout(0),[re,$,No]);tr(U,z,So,mr(Mr,sr));let ee=or(Mr*E*4,"strsm-delta");{let Ir=Mr,Lr=E,Kr=sr,jr=Math.ceil(Lr/Bo),Cr=Math.ceil(Ir/_o),Wr=jr*Cr>=Eo,Fr=await G(a,Wr?"sgemm_large":"sgemm_small"),zr=Z([{value:Ir,type:"u32"},{value:Lr,type:"u32"},{value:Kr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:sr,type:"u32"},{value:E,type:"u32"},{value:E,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),qr=B(Fr.getBindGroupLayout(0),[re,Pr,ee,zr]),Yr=Wr?{x:Math.min(jr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Lr/yo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Ir/vo),a.limits.maxComputeWorkgroupsPerDimension)};tr(U,Fr,qr,Yr)}let Mo=Z([{value:Gr,type:"u32"},{value:Mr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:T?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),Io=B(z.getBindGroupLayout(0),[ee,Q,Mo]),Lo=hr&&X?{timestampWrites:{querySet:X,endOfPassWriteIndex:1}}:void 0;tr(U,z,Io,mr(Mr,E),Lo)}let lr=br(U,X),pr=p?null:N(U,Q);M(U);let fr=await S(lr);if(p)return fr!==void 0?{gpuTimeMs:fr}:{};let cr=await k(pr,Float32Array);return fr!==void 0?{B:cr,gpuTimeMs:fr}:{B:cr}}finally{c||d($),p||d(Q),d(J),d(nr),d(ir)}}return Wo(ni);})();
