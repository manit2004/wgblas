var wgblas=(()=>{var Do=Object.create;var Kr=Object.defineProperty;var Ro=Object.getOwnPropertyDescriptor;var To=Object.getOwnPropertyNames;var jo=Object.getPrototypeOf,Co=Object.prototype.hasOwnProperty;var zr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var V=(a,e,r)=>()=>{if(r)throw r[0];try{return a&&(e=a(a=0)),e}catch(o){throw r=[o],o}};var ce=(a,e)=>{for(var r in e)Kr(a,r,{get:e[r],enumerable:!0})},de=(a,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of To(e))!Co.call(a,t)&&t!==r&&Kr(a,t,{get:()=>e[t],enumerable:!(o=Ro(e,t))||o.enumerable});return a};var qr=(a,e,r)=>(r=a!=null?Do(jo(a)):{},de(e||!a||!a.__esModule?Kr(r,"default",{value:a,enumerable:!0}):r,a)),Lo=a=>de(Kr({},"__esModule",{value:!0}),a);var oe,Ee=V(()=>{oe=`// sscal: x = alpha * x

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
`});var Ae,Ge=V(()=>{Ae=`// sswap: x <-> y

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
`});var Me,ke=V(()=>{Me=`// saxpy: y = alpha * x + y

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
`});var Pe,Ne=V(()=>{Pe=`// scopy: y = x

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
`});var Ie,Se=V(()=>{Ie=`// sdot: result = sum(x[i] * y[i])
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
`});var Yr,De=V(()=>{Yr=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Te,Re=V(()=>{Te=`// sasum: result = sum(|x[i]|)
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
`});var Ce,je=V(()=>{Ce=`// snrm2: result = sqrt(sum(x[i] * x[i]))
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
`});var We,Le=V(()=>{We=`// isamax: returns index of element with largest absolute value
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
`});var Ue,Fe=V(()=>{Ue=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var ae,Oe=V(()=>{ae=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var ie,Ve=V(()=>{ie=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Ke,He=V(()=>{Ke=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var qe,ze=V(()=>{qe=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var Xe,Ye=V(()=>{Xe=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var Ze,$e=V(()=>{Ze=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var Je,Qe=V(()=>{Je=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var et,rt=V(()=>{et=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var ot,tt=V(()=>{ot=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var it,at=V(()=>{it=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var nt,st=V(()=>{nt=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var lt,ut=V(()=>{lt=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var ft,mt=V(()=>{ft=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var dt,ct=V(()=>{dt=`// ssymv: y = alpha * A * x + beta * y
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
`});var wt,pt=V(()=>{wt=`// strmv: y = op(A) * x
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
`});var se,gt=V(()=>{se=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var ht,bt=V(()=>{ht=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var xt,vt=V(()=>{xt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var _t,yt=V(()=>{_t=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Et,Bt=V(()=>{Et=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var At,Gt=V(()=>{At=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var Ur,kt=V(()=>{Ur=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var Or,Mt=V(()=>{Or=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var Xr,Nt=V(()=>{Xr=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var $r,Pt=V(()=>{$r=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var It,St=V(()=>{It=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var Ct={};ce(Ct,{routineShaders:()=>tr,shaderSources:()=>Ea});var tr,Ea,Lt=V(()=>{Ee();Ge();ke();Ne();Se();De();Re();je();Le();Fe();Oe();Ve();He();ze();Ye();$e();Qe();rt();tt();at();st();ut();mt();ct();pt();gt();bt();vt();yt();Bt();Gt();kt();Mt();Nt();Pt();St();Dt();Tt();tr={};tr.sscal={sscal:oe};tr.sswap={sswap:Ae};tr.saxpy={saxpy:Me};tr.scopy={scopy:Pe};tr.sdot={sdot:Ie,"reduction/sum":Yr};tr.sasum={sasum:Te,"reduction/sum":Yr};tr.snrm2={snrm2:Ce,"reduction/sum":Yr};tr.isamax={isamax:We,"reduction/argmax":Ue};tr.dasum={"f64/dekker":ae,"f64/utils/abs":ie,"f64/utils/add":Ke,dasum:qe,"reduction/sumF64":Xe};tr.idamax={"f64/dekker":ae,"f64/utils/abs":ie,"f64/utils/greater":Ze,"f64/utils/equal":Je,idamax:et,"reduction/argmaxF64":ot};tr.srot={srot:it};tr.srotm={srotm:nt};tr.sgemv={sgemv_n:lt,sgemv_t:ft};tr.ssymv={ssymv:dt};tr.strmv={strmv:wt};tr.strsv={strsv_invert_block:se,strsv_apply_inverse:ht,strsv_update:xt};tr.sger={sger:_t};tr.ssyr={ssyr:Et};tr.ssyr2={ssyr2:At};tr.sgemm={sgemm_small:Ur,sgemm_large:Or};tr.sgemmtr={sgemmtr_small:Xr,sgemmtr_large:$r};tr.ssyrk={sgemmtr_small:Xr,sgemmtr_large:$r};tr.ssyr2k={sgemmtr_small:Xr,sgemmtr_large:$r};tr.ssymm={sgemm_small:Ur,sgemm_large:Or,symmetrize:It};tr.strmm={sgemm_small:Ur,sgemm_large:Or,triangularize:Rt};tr.strsm={strsv_invert_block:se,block_transfer:jt,sscal:oe,sgemm_small:Ur,sgemm_large:Or};Ea=Object.assign({},...Object.values(tr))});var ii={};ce(ii,{GpuMatrix:()=>U,GpuVector:()=>I,cleanup:()=>ve,dasum:()=>Yt,gpuName:()=>xe,idamax:()=>Qt,init:()=>he,isamax:()=>Zt,randomFloat32Array:()=>ye,randomFloat64Array:()=>_e,randomTriangularFloat32Array:()=>Be,sasum:()=>qt,saxpy:()=>Ot,scopy:()=>Vt,sdot:()=>Kt,sgemm:()=>mo,sgemmtr:()=>fo,sgemv:()=>eo,sger:()=>no,snrm2:()=>$t,srot:()=>Jt,srotm:()=>ro,sscal:()=>Ft,sswap:()=>Ut,ssymm:()=>go,ssymv:()=>to,ssyr:()=>uo,ssyr2:()=>lo,ssyr2k:()=>po,ssyrk:()=>co,strmm:()=>ho,strmv:()=>oo,strsm:()=>Eo,strsv:()=>so});function pe(a,e){return e?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function we(){if(!ge())return{querySet:null,passDescriptor:void 0};let e=mr().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function hr(a,e){if(!e)return null;let r=mr(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(e,0,2,o,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,t,0,16),{tsReadBuffer:t,resolveBuffer:o,querySet:e}}async function P(a){if(!a)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=a;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Ar=null,Dr=null,be=null,te=!1;async function he({powerPreference:a="high-performance",benchmark:e=!1,dumpShaders:r=!1}={}){if(Ar)return Ar;let o;if(typeof window>"u"){let{create:s,globals:l}=await import("webgpu");Object.assign(globalThis,l),o=s(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),be=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(Dr=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!Dr)throw new Error("No WebGPU adapter found.");te=e;let i=[...pe(Dr,e).requiredFeatures??[]];return Ar=await Dr.requestDevice({requiredFeatures:i}),Ar.addEventListener("uncapturederror",s=>{console.error("Uncaptured GPU error:",s.error.message)}),Ar}function ve(){Ar&&(Ar.destroy(),Ar=null),Dr=null,be=null,te=!1}function xe(){if(!Dr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:e}=Dr.info;return{description:e||"unknown",device:a||"unknown"}}function ge(){return te}function mr(){if(!Ar)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Ar}function d(...a){a.flat().forEach(e=>e.destroy())}function x(a,e="blas-input",r=!1){let o=mr(),t=o.limits.maxStorageBufferBindingSize,i=a.byteLength;if(i>t)throw new Error(`Buffer size ${i} bytes exceeds device limit of ${t} bytes.`);let s=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,l=o.createBuffer({label:e,size:i,usage:s,mappedAtCreation:!0}),n=a.constructor;return new n(l.getMappedRange()).set(a),l.unmap(),l}function er(a,e="blas-storage",r=0){return mr().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|r})}function xr(a,e="blas-result"){return mr().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function N(a,e){let o=mr().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(e,0,o,0,e.size),o}function D(a,e="blas-params"){let r=mr(),o=a.length*4,t=Math.ceil(o/16)*16,i=new ArrayBuffer(t),s=new DataView(i);a.forEach(({value:n,type:u},m)=>{let f=m*4;if(u==="u32")s.setUint32(f,n,!0);else if(u==="i32")s.setInt32(f,n,!0);else if(u==="f32")s.setFloat32(f,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,i),l}async function k(a,e=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new e(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function Nr(a){let e=a.length,r=new Float32Array(e),o=new Float32Array(e);for(let t=0;t<e;t++){let i=Math.fround(a[t]);r[t]=i,o[t]=Math.fround(a[t]-i)}return{hi:r,lo:o}}function Tr(a,e){let r=a.length,o=new Float64Array(r);for(let t=0;t<r;t++)o[t]=a[t]+e[t];return o}var I=class a{constructor(e,r,o=Float32Array,t=null){this._buf=e,this._loBuf=t,this.length=r,this.dtype=o}static from(e){if(e instanceof Float64Array){let{hi:o,lo:t}=Nr(e),i=x(o,"gpu-vector-f64-hi",!0),s=x(t,"gpu-vector-f64-lo",!0);return new a(i,e.length,Float64Array,s)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=x(e,"gpu-vector",!0);return new a(r,e.length,e.constructor)}async read(){let e=mr(),r=e.createCommandEncoder(),o=N(r,this._buf);if(e.queue.submit([r.finish()]),!this._loBuf)return k(o,this.dtype);let t=e.createCommandEncoder(),i=N(t,this._loBuf);e.queue.submit([t.finish()]);let[s,l]=await Promise.all([k(o,Float32Array),k(i,Float32Array)]);return Tr(s,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var U=class a{constructor(e,r,o,t,i=null,s="row-major"){this._buf=e,this._loBuf=i,this.rows=r,this.cols=o,this.lda=t,this.layout=s}static from(e,r,o,t,i="row-major"){if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let s=i==="row-major";if(t===void 0&&(t=s?o:r),!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let l=s?o:r;if(!Number.isInteger(t)||t<l)throw new Error(`lda must be an integer >= ${s?"cols":"rows"}.`);let n=s?r:o;if(e.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(e instanceof Float64Array){let m=n*t,{hi:f,lo:w}=Nr(e.subarray(0,m)),c=x(f,"gpu-matrix-f64-hi",!0),p=x(w,"gpu-matrix-f64-lo",!0);return new a(c,r,o,t,p,i)}let u=x(e.subarray(0,n*t),"gpu-matrix",!0);return new a(u,r,o,t,null,i)}async read(){let e=mr(),r=e.createCommandEncoder(),o=N(r,this._buf);e.queue.submit([r.finish()]);let t=this.layout!=="column-major",i=t?this.rows:this.cols,s=t?this.cols:this.rows;if(this._loBuf){let u=e.createCommandEncoder(),m=N(u,this._loBuf);e.queue.submit([u.finish()]);let[f,w]=await Promise.all([k(o,Float32Array),k(m,Float32Array)]),c=Tr(f,w);if(this.lda===s)return c;let p=new Float64Array(i*s);for(let g=0;g<i;g++)p.set(c.subarray(g*this.lda,g*this.lda+s),g*s);return p}let l=await k(o,Float32Array);if(this.lda===s)return l;let n=new Float32Array(i*s);for(let u=0;u<i;u++)n.set(l.subarray(u*this.lda,u*this.lda+s),u*s);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function ye(a,e=-1,r=1){let o=new Float32Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function _e(a,e=-1,r=1){let o=new Float64Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function Be(a,e,r="lower",o=-1,t=1,i=5,s=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e<a)throw new Error("lda must be >= n.");let l=new Float32Array(a*e);for(let n=0;n<a;n++){for(let u=0;u<a;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(l[n*e+u]=o+Math.random()*(t-o))}l[n*e+n]=i+Math.random()*(s-i)}return l}function B(a,e,r=0){let o=mr(),t=e.map((i,s)=>({binding:r+s,resource:i instanceof GPUBuffer?{buffer:i}:i}));return o.createBindGroup({layout:a,entries:t})}var Wo=new WeakMap;function S(a){mr().queue.submit([a.finish()])}function yr(){let a=mr(),{querySet:e,passDescriptor:r}=we();return{commandEncoder:a.createCommandEncoder(),querySet:e,passDescriptor:r}}function ir(a,e,r,o,t){let i=a.beginComputePass(t);i.setPipeline(e),i.setBindGroup(0,r),typeof o=="number"?i.dispatchWorkgroups(o):i.dispatchWorkgroups(o.x,o.y,o.z??1),i.end(),Wo.set(a,i)}function L(a,e,r){let{commandEncoder:o,querySet:t,passDescriptor:i}=yr();ir(o,a,e,r,i);let s=hr(o,t);return{commandEncoder:o,ts:s}}var ka={},ne=new WeakMap;async function A(a,e,r="main"){ne.has(a)||ne.set(a,new Map);let o=ne.get(a),t=Array.isArray(e)?e:[e],i=`${t.join("+")}::${r}`;return o.has(i)||o.set(i,await Aa(t,r)),o.get(i)}async function Ga(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(Lt(),Ct)),r=e[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:t}=await import("path"),i=o(r(ka.url));return e(t(i,`../shaders/${a}.wgsl`),"utf8")}}async function Aa(a,e="main"){let r=mr(),o=a.join("+"),t=(await Promise.all(a.map(Ga))).join(`
`),i=r.createShaderModule({label:o,code:t}),l=(await i.getCompilationInfo()).messages.filter(m=>m.type==="error");if(l.length>0)throw new Error(`Shader "${o}" compilation failed:
${l.map(m=>`  line ${m.lineNum}: ${m.message}`).join(`
`)}`);let n=e==="main"?{module:i}:{module:i,entryPoint:e},u=r.createComputePipeline({label:o,layout:"auto",compute:n});return u._shaderModule=i,u}var Ma=64,Wt=8;function cr(a,e){let r=mr().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(a/Ma),r):{x:Math.min(Math.ceil(e/Wt),r),y:Math.min(Math.ceil(a/Wt),r)}}async function Ft(a,e,r,o,t){let i=o instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return i?{}:o;if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(a,"sscal"),l=null,n=null,u=null;try{l=i?o._buf:x(o,"sscal-x",!0),n=D([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let m=B(s.getBindGroupLayout(0),[l,n]),{commandEncoder:f,ts:w}=L(s,m,cr(e));u=i?null:N(f,l),S(f);let c=await P(w);if(i)return c!==void 0?{gpuTimeMs:c}:{};let p=await k(u,Float32Array);return u=null,c!==void 0?{x:p,gpuTimeMs:c}:p}finally{!i&&l&&d(l),n&&d(n),u&&d(u)}}async function Ut(a,e,r,o,t,i){let s=r instanceof I,l=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof I))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return s?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"sswap"),u=null,m=null,f=null,w=null,c=null;try{u=s?r._buf:x(r,"sswap-x",!0),m=l?t._buf:x(t,"sswap-y",!0),f=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sswap-params");let p=B(n.getBindGroupLayout(0),[u,m,f]),{commandEncoder:g,ts:h}=L(n,p,cr(e));w=s?null:N(g,u),c=l?null:N(g,m),S(g);let b=await P(h);if(s&&l)return b!==void 0?{gpuTimeMs:b}:{};let v=await k(w,Float32Array);w=null;let _=await k(c,Float32Array);return c=null,b!==void 0?{x:v,y:_,gpuTimeMs:b}:{x:v,y:_}}finally{!s&&u&&d(u),!l&&m&&d(m),f&&d(f),w&&d(w),c&&d(c)}}async function Ot(a,e,r,o,t,i,s){let l=o instanceof I,n=i instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:i};if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(a,"saxpy"),m=null,f=null,w=null,c=null;try{m=l?o._buf:x(o,"saxpy-x",!1),f=n?i._buf:x(i,"saxpy-y",!0),w=D([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:s,type:"u32"}],"saxpy-params");let p=B(u.getBindGroupLayout(0),[m,f,w]),{commandEncoder:g,ts:h}=L(u,p,cr(e));c=n?null:N(g,f),S(g);let b=await P(h);if(n&&l)return b!==void 0?{gpuTimeMs:b}:{};let v=await k(c,Float32Array);return c=null,b!==void 0?{y:v,gpuTimeMs:b}:{y:v}}finally{!l&&m&&d(m),!n&&f&&d(f),w&&d(w),c&&d(c)}}async function Vt(a,e,r,o,t,i){let s=r instanceof I,l=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return l?{}:{y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"scopy"),u=null,m=null,f=null,w=null;try{u=s?r._buf:x(r,"scopy-x",!1),m=l?t._buf:x(t,"scopy-y",!0),f=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"scopy-params");let c=B(n.getBindGroupLayout(0),[u,m,f]),{commandEncoder:p,ts:g}=L(n,c,cr(e));w=l?null:N(p,m),S(p);let h=await P(g);if(l&&s)return h!==void 0?{gpuTimeMs:h}:{};let b=await k(w,Float32Array);return w=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!s&&u&&d(u),!l&&m&&d(m),f&&d(f),w&&d(w)}}var Ht=64;async function Kt(a,e,r,o,t,i){let s=r instanceof I,l=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!s&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"sdot"),u=await A(a,"reduction/sum"),m=null,f=null,w=null,c=null,p=null,g=null;try{m=s?r._buf:x(r,"sdot-x",!1),f=l?t._buf:x(t,"sdot-y",!1),w=er(2*Ht*4,"sdot-partials"),c=xr(4,"sdot-result"),p=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"sdot-params");let h=B(n.getBindGroupLayout(0),[m,f,w,p]),{commandEncoder:b,ts:v}=L(n,h,2*Ht);S(b);let _=B(u.getBindGroupLayout(0),[w,c]),{commandEncoder:y,ts:G}=L(u,_,1);g=N(y,c),S(y);let M=k(g,Float32Array);g=null;let[E,j,R]=await Promise.all([P(v),P(G),M]);return E!==void 0&&j!==void 0?{dot:R[0],gpuTimeMs:E+j}:{dot:R[0]}}finally{!s&&m&&d(m),!l&&f&&d(f),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}var zt=64;async function qt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(a,"sasum"),s=await A(a,"reduction/sum"),l=null,n=null,u=null,m=null,f=null;try{l=t?r._buf:x(r,"sasum-x",!1),n=er(2*zt*4,"sasum-partials"),u=xr(4,"sasum-result"),m=D([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params");let w=B(i.getBindGroupLayout(0),[l,n,m]),{commandEncoder:c,ts:p}=L(i,w,2*zt);S(c);let g=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=L(s,g,1);f=N(h,u),S(h);let v=k(f,Float32Array);f=null;let[_,y,G]=await Promise.all([P(p),P(b),v]);return _!==void 0&&y!==void 0?{asum:G[0],gpuTimeMs:_+y}:{asum:G[0]}}finally{!t&&l&&d(l),n&&d(n),u&&d(u),m&&d(m),f&&d(f)}}var ue=64;async function Yt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/add"],s=await A(a,[...i,"dasum"]),l=await A(a,[...i,"reduction/sumF64"]),n=null,u=null,m=null,f=null,w=null,c=null,p=null,g=null,h=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:K,lo:W}=Nr(r.map(Math.abs));n=x(K,"dasum-xHi",!1),u=x(W,"dasum-xLo",!1)}m=er(2*ue*4,"dasum-partialsHi"),f=er(2*ue*4,"dasum-partialsLo"),w=xr(4,"dasum-result-hi"),c=xr(4,"dasum-result-lo"),p=D([{value:e,type:"u32"},{value:o,type:"u32"}],"dasum-params");let b=B(s.getBindGroupLayout(0),[n,u,m,f,p]),{commandEncoder:v,ts:_}=L(s,b,2*ue);S(v);let y=B(l.getBindGroupLayout(0),[m,f,w,c]),{commandEncoder:G,ts:M}=L(l,y,1);g=N(G,w),h=N(G,c),S(G);let E=k(g,Float32Array),j=k(h,Float32Array);g=null,h=null;let[R,T,C,F]=await Promise.all([P(_),P(M),E,j]),H=Tr(C,F)[0];return R!==void 0&&T!==void 0?{asum:H,gpuTimeMs:R+T}:{asum:H}}finally{!t&&n&&d(n),!t&&u&&d(u),m&&d(m),f&&d(f),w&&d(w),c&&d(c),p&&d(p),g&&d(g),h&&d(h)}}var Xt=64;async function $t(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(a,"snrm2"),s=await A(a,"reduction/sum"),l=null,n=null,u=null,m=null,f=null;try{l=t?r._buf:x(r,"snrm2-x",!1),n=er(2*Xt*4,"snrm2-partials"),u=xr(4,"snrm2-result"),m=D([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let w=B(i.getBindGroupLayout(0),[l,n,m]),{commandEncoder:c,ts:p}=L(i,w,2*Xt);S(c);let g=B(s.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=L(s,g,1);f=N(h,u),S(h);let v=k(f,Float32Array);f=null;let[_,y,G]=await Promise.all([P(p),P(b),v]),M=Math.sqrt(G[0]);return _!==void 0&&y!==void 0?{nrm2:M,gpuTimeMs:_+y}:{nrm2:M}}finally{!t&&l&&d(l),n&&d(n),u&&d(u),m&&d(m),f&&d(f)}}var le=64;async function Zt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(a,"isamax"),s=await A(a,"reduction/argmax"),l=null,n=null,u=null,m=null,f=null,w=null;try{l=t?r._buf:x(r,"isamax-x",!1),n=er(2*le*4,"isamax-partials-val"),u=er(2*le*4,"isamax-partials-idx"),m=xr(4,"isamax-result"),f=D([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params");let c=B(i.getBindGroupLayout(0),[l,n,u,f]),{commandEncoder:p,ts:g}=L(i,c,2*le);S(p);let h=B(s.getBindGroupLayout(0),[n,u,m]),{commandEncoder:b,ts:v}=L(s,h,1);w=N(b,m),S(b);let _=k(w,Uint32Array);w=null;let[y,G,M]=await Promise.all([P(g),P(v),_]),E=M[0];return y!==void 0&&G!==void 0?{index:E,gpuTimeMs:y+G}:{index:E}}finally{!t&&l&&d(l),n&&d(n),u&&d(u),m&&d(m),f&&d(f),w&&d(w)}}var Zr=64;async function Qt(a,e,r,o){let t=r instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],s=await A(a,[...i,"idamax"],"idamax_main"),l=await A(a,[...i,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,m=null,f=null,w=null,c=null,p=null,g=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:C,lo:F}=Nr(r);n=x(C,"idamax-xHi",!1),u=x(F,"idamax-xLo",!1)}m=er(2*Zr*4,"idamax-partials-val-hi"),f=er(2*Zr*4,"idamax-partials-val-lo"),w=er(2*Zr*4,"idamax-partials-idx"),c=xr(4,"idamax-result"),p=D([{value:e,type:"u32"},{value:o,type:"u32"}],"idamax-params");let h=B(s.getBindGroupLayout(0),[n,u,m,f,w,p]),{commandEncoder:b,ts:v}=L(s,h,2*Zr);S(b);let _=B(l.getBindGroupLayout(0),[m,f,w,c]),{commandEncoder:y,ts:G}=L(l,_,1);g=N(y,c),S(y);let M=k(g,Uint32Array);g=null;let[E,j,R]=await Promise.all([P(v),P(G),M]),T=R[0];return E!==void 0&&j!==void 0?{index:T,gpuTimeMs:E+j}:{index:T}}finally{!t&&n&&d(n),!t&&u&&d(u),m&&d(m),f&&d(f),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function Jt(a,e,r,o,t,i,s,l){let n=r instanceof I,u=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof s!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(s)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(s))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let m=await A(a,"srot"),f=null,w=null,c=null,p=null,g=null;try{f=n?r._buf:x(r,"srot-x",!0),w=u?t._buf:x(t,"srot-y",!0),c=D([{value:e,type:"u32"},{value:s,type:"f32"},{value:l,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srot-params");let h=B(m.getBindGroupLayout(0),[f,w,c]),{commandEncoder:b,ts:v}=L(m,h,cr(e));p=n?null:N(b,f),g=u?null:N(b,w),S(b);let _=await P(v);if(n&&u)return _!==void 0?{gpuTimeMs:_}:{};let y=k(p,Float32Array),G=k(g,Float32Array);p=null,g=null;let[M,E]=await Promise.all([y,G]);return _!==void 0?{x:M,y:E,gpuTimeMs:_}:{x:M,y:E}}finally{!n&&f&&d(f),!u&&w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function ro(a,e,r,o,t,i,s){let l=r instanceof I,n=t instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||s[0]===-2)return l?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(a,"srotm"),m=null,f=null,w=null,c=null,p=null,g=null;try{m=l?r._buf:x(r,"srotm-x",!0),f=n?t._buf:x(t,"srotm-y",!0),w=x(s,"srotm-param",!1),c=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:i,type:"u32"}],"srotm-params");let h=B(u.getBindGroupLayout(0),[m,f,w,c]),{commandEncoder:b,ts:v}=L(u,h,cr(e));p=l?null:N(b,m),g=n?null:N(b,f),S(b);let _=await P(v);if(l&&n)return _!==void 0?{gpuTimeMs:_}:{};let y=k(p,Float32Array),G=k(g,Float32Array);p=null,g=null;let[M,E]=await Promise.all([y,G]);return _!==void 0?{x:M,y:E,gpuTimeMs:_}:{x:M,y:E}}finally{!l&&m&&d(m),!n&&f&&d(f),w&&d(w),c&&d(c),p&&d(p),g&&d(g)}}async function eo(a,e,r,o,t,i,s,l,n,u,m,f,w="row-major"){let c=i instanceof U,p=l instanceof I,g=m instanceof I;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(m instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&l._buf===m._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<r||i.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:m};(c?i.layout:w)==="column-major"&&([r,o]=[o,r],e=e==="no-transpose"?"transpose":"no-transpose");let b=e==="no-transpose",v=b?o:r,_=b?r:o;if(s<o)throw new Error("lda must be >= n.");if(!c&&i.length<(r-1)*s+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(v-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(m.length<(_-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let G=await A(a,b?"sgemv_n":"sgemv_t"),M=c?i._buf:x(i,"sgemv-A",!1),E=p?l._buf:x(l,"sgemv-x",!1),j=g?m._buf:x(m,"sgemv-y",!0),R=D([{value:r,type:"u32"},{value:o,type:"u32"},{value:t,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"}],"sgemv-params");try{let T=B(G.getBindGroupLayout(0),[M,E,j,R]),C=b?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):cr(_),{commandEncoder:F,ts:H}=L(G,T,C),K=g?null:N(F,j);S(F);let W=await P(H);if(g)return W!==void 0?{gpuTimeMs:W}:{};let Q=await k(K,Float32Array);return W!==void 0?{y:Q,gpuTimeMs:W}:{y:Q}}finally{c||d(M),p||d(E),g||d(j),d(R)}}async function to(a,e,r,o,t,i,s,l,n,u,m,f="row-major"){let w=s instanceof I,c=u instanceof I,p=t instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(l)||!Number.isInteger(m)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||m<=0)throw new Error("incx and incy must be positive.");if(i<r)throw new Error("lda must be >= n.");if(!p&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(s instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&s._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&i!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{y:u};if(!p&&t.length<(r-1)*i+r)throw new Error("A does not have enough elements for the given n and lda.");if(s.length<(r-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(p?t.layout:f)==="column-major"?e==="upper":e==="lower",b=await A(a,"ssymv"),v=null,_=null,y=null,G=null;try{v=p?t._buf:x(t,"ssymv-A",!1),_=w?s._buf:x(s,"ssymv-x",!1),y=c?u._buf:x(u,"ssymv-y",!0),G=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let M=B(b.getBindGroupLayout(0),[v,_,y,G]),E=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:R}=L(b,M,E),T=c?null:N(j,y);S(j);let C=await P(R);if(c)return C!==void 0?{gpuTimeMs:C}:{};let F=await k(T,Float32Array);return C!==void 0?{y:F,gpuTimeMs:C}:{y:F}}finally{!p&&v&&d(v),!w&&_&&d(_),!c&&y&&d(y),G&&d(G)}}async function oo(a,e,r,o,t,i,s,l,n,u,m,f="row-major"){let w=l instanceof I,c=u instanceof I,p=i instanceof U,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!p&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&!p)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(p&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&c&&i._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(p&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(p&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return c?{}:{y:u};if(!p&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(t-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(p?i.layout:f)==="column-major",v=b?e==="upper":e==="lower",_=b?r==="transpose":r==="no-transpose",y=await A(a,"strmv"),G=null,M=null,E=null,j=null;try{G=p?i._buf:x(i,"strmv-A",!1),M=w?l._buf:x(l,"strmv-x",!1),E=c?u._buf:x(u,"strmv-y",!0),j=D([{value:t,type:"u32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"},{value:_?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let R=B(y.getBindGroupLayout(0),[G,M,E,j]),T=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:C,ts:F}=L(y,R,T),H=c?null:N(C,E);S(C);let K=await P(F);if(c)return K!==void 0?{gpuTimeMs:K}:{};let W=await k(H,Float32Array);return K!==void 0?{y:W,gpuTimeMs:K}:{y:W}}finally{!p&&G&&d(G),!w&&M&&d(M),!c&&E&&d(E),j&&d(j)}}var kr=64;function ao(a,e,r){let o=new ArrayBuffer(a*e),t=new DataView(o);for(let i=0;i<a;i++){let s=r(i),l=i*e;s.forEach((n,u)=>t.setUint32(l+u*4,n,!0))}return o}function io(a,e,r){let o=a.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,e),o}async function so(a,e,r,o,t,i,s,l,n,u="row-major"){let m=l instanceof I,f=i instanceof U,w=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!w&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(s))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(s<t)throw new Error("lda must be >= n.");if(!f&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(m&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!m)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&s!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(i.rows<t||i.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return m?{}:{x:l};if(!f&&i.length<(t-1)*s+t)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(f?i.layout:u)==="column-major",g=p?e==="upper":e==="lower",h=p?r==="transpose":r==="no-transpose",b=await A(a,"strsv_invert_block"),v=await A(a,"strsv_apply_inverse"),_=await A(a,"strsv_update"),y=h===g,G=[];for(let W=0;W<t;W+=kr)G.push(W);y||G.reverse();let M=G.length,E=a.limits.maxComputeWorkgroupsPerDimension,j=a.limits.minUniformBufferOffsetAlignment,R=null,T=null,C=null,F=null,H=null,K=null;try{R=f?i._buf:x(i,"strsv-A",!1),T=m?l._buf:x(l,"strsv-x",!0),C=er(M*kr*kr*4,"strsv-Ainv");let W=ao(M,j,q=>{let z=q*kr,X=Math.min(z+kr,t);return[n,q,z,X]});F=io(a,W,"strsv-apply-params");let Q=ao(M,j,q=>{let z=q*kr,X=Math.min(z+kr,t);return[t,n,s,h?0:1,g?0:1,z,X]});H=io(a,Q,"strsv-update-params");let{commandEncoder:Y,querySet:J}=yr();K=D([{value:t,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:w?1:0,type:"u32"}],"strsv-invert-params");let ur=B(b.getBindGroupLayout(0),[R,C,K]);ir(Y,b,ur,{x:kr,y:M},J?{timestampWrites:{querySet:J,beginningOfPassWriteIndex:0}}:void 0);for(let q=0;q<G.length;q++){let z=G[q],X=Math.min(z+kr,t),$=z/kr,or=q===G.length-1,fr=$*j,ar=B(v.getBindGroupLayout(0),[C,T,{buffer:F,offset:fr,size:16}]);ir(Y,v,ar,1,or&&J?{timestampWrites:{querySet:J,endOfPassWriteIndex:1}}:void 0);let pr=y?t-X:z;if(pr===0)continue;let Er=B(_.getBindGroupLayout(0),[R,T,{buffer:H,offset:fr,size:32}]),_r=Math.min(pr,E);ir(Y,_,Er,_r)}let nr=hr(Y,J),Z=m?null:N(Y,T);S(Y);let rr=await P(nr);if(m)return rr!==void 0?{gpuTimeMs:rr}:{};let O=await k(Z,Float32Array);return rr!==void 0?{x:O,gpuTimeMs:rr}:{x:O}}finally{!f&&R&&d(R),!m&&T&&d(T),C&&d(C),F&&d(F),H&&d(H),K&&d(K)}}async function no(a,e,r,o,t,i,s,l,n,u,m="row-major"){let f=n instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(f&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");(f?n.layout:m)==="column-major"&&([e,r]=[r,e],[t,s]=[s,t],[i,l]=[l,i]);let c=t instanceof I,p=s instanceof I;if(u<r)throw new Error("lda must be >= n.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(f&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&p&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return f?{}:{A:n};if(!f&&n.length<(e-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*i+1)throw new Error("x does not have enough elements for the given m and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await A(a,"sger"),h=null,b=null,v=null,_=null;try{h=c?t._buf:x(t,"sger-x",!1),b=p?s._buf:x(s,"sger-y",!1),v=f?n._buf:x(n,"sger-A",!0),_=D([{value:e,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let y=B(g.getBindGroupLayout(0),[h,b,v,_]),G=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:E}=L(g,y,G),j=f?null:N(M,v);S(M);let R=await P(E);if(f)return R!==void 0?{gpuTimeMs:R}:{};let T=await k(j,Float32Array);return R!==void 0?{A:T,gpuTimeMs:R}:{A:T}}finally{!c&&h&&d(h),!p&&b&&d(b),!f&&v&&d(v),_&&d(_)}}async function uo(a,e,r,o,t,i,s,l,n="row-major"){let u=t instanceof I,m=s instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0)throw new Error("incx must be positive.");if(l<r)throw new Error("lda must be >= n.");if(!m&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&u&&s._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(s.rows<r||s.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return m?{}:{A:s};if(!m&&s.length<(r-1)*l+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(m?s.layout:n)==="column-major"?e==="upper":e==="lower",c=await A(a,"ssyr"),p=null,g=null,h=null;try{p=u?t._buf:x(t,"ssyr-x",!1),g=m?s._buf:x(s,"ssyr-A",!0),h=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:w?0:1,type:"u32"}],"ssyr-params");let b=B(c.getBindGroupLayout(0),[p,g,h]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:_,ts:y}=L(c,b,v),G=m?null:N(_,g);S(_);let M=await P(y);if(m)return M!==void 0?{gpuTimeMs:M}:{};let E=await k(G,Float32Array);return M!==void 0?{A:E,gpuTimeMs:M}:{A:E}}finally{!u&&p&&d(p),!m&&g&&d(g),h&&d(h)}}async function lo(a,e,r,o,t,i,s,l,n,u,m="row-major"){let f=t instanceof I,w=s instanceof I,c=n instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(i<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!f)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&f&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&w&&n._buf===s._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&t._buf===s._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{A:n};if(!c&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?n.layout:m)==="column-major"?e==="upper":e==="lower",h=await A(a,"ssyr2"),b=null,v=null,_=null,y=null;try{b=f?t._buf:x(t,"ssyr2-x",!1),v=w?s._buf:x(s,"ssyr2-y",!1),_=c?n._buf:x(n,"ssyr2-A",!0),y=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:i,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let G=B(h.getBindGroupLayout(0),[b,v,_,y]),M=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:E,ts:j}=L(h,G,M),R=c?null:N(E,_);S(E);let T=await P(j);if(c)return T!==void 0?{gpuTimeMs:T}:{};let C=await k(R,Float32Array);return T!==void 0?{A:C,gpuTimeMs:T}:{A:C}}finally{!f&&b&&d(b),!w&&v&&d(v),!c&&_&&d(_),y&&d(y)}}var Na=32,Pa=32,Sa=64,Ia=64,Da=36;async function mo(a,e,r,o,t,i,s,l,n,u,m,f,w,c,p="row-major"){let g=l instanceof U,h=u instanceof U,b=w instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(w instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||t===0)return b?{}:{C:w};let v=g?l.layout:p,_=h?u.layout:p,y=b?w.layout:p,G=v==="column-major"?i:o,M=v==="column-major"?o:i,E=e==="no-transpose"?G:M,j=e==="no-transpose"?M:G;if(n<j)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[rr,O]=e==="no-transpose"?[o,i]:[i,o];if(l.rows<rr||l.cols<O)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(E-1)*n+j)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=_==="column-major"?t:i,T=_==="column-major"?i:t,C=r==="no-transpose"?R:T,F=r==="no-transpose"?T:R;if(m<F)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(m!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[rr,O]=r==="no-transpose"?[i,t]:[t,i];if(u.rows<rr||u.cols<O)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(C-1)*m+F)throw new Error("B does not have enough elements for the given dimensions and ldb.");let H=y==="column-major"?t:o,K=y==="column-major"?o:t;if(c<K)throw new Error(`ldc must be >= ${y==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==w.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(w.rows<o||w.cols<t)throw new Error("C is too small for the given m and n.")}else if(w.length<(H-1)*c+K)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&([l,u]=[u,l],[g,h]=[h,g],[n,m]=[m,n],[e,r]=[r==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[o,t]=[t,o]);let W=Math.ceil(t/Ia),Q=Math.ceil(o/Sa),Y=W*Q>=Da,J=await A(a,Y?"sgemm_large":"sgemm_small"),ur=g?l._buf:x(l,"sgemm-A",!1),lr=h?u._buf:x(u,"sgemm-B",!1),nr=b?w._buf:x(w,"sgemm-C",!0),Z=D([{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"f32"},{value:f,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:c,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let rr=B(J.getBindGroupLayout(0),[ur,lr,nr,Z]),O=Y?{x:Math.min(W,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(t/Pa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Na),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:q,ts:z}=L(J,rr,O),X=b?null:N(q,nr);S(q);let $=await P(z);if(b)return $!==void 0?{gpuTimeMs:$}:{};let or=await k(X,Float32Array);return $!==void 0?{C:or,gpuTimeMs:$}:{C:or}}finally{g||d(ur),h||d(lr),b||d(nr),d(Z)}}var Ra=32,Ta=32,ja=64,Ca=64,La=36;async function fo(a,e,r,o,t,i,s,l,n,u,m,f,w,c,p,g="row-major"){let h=n instanceof U,b=m instanceof U,v=c instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof w!="number")throw new Error("beta must be a number.");if(Number.isNaN(w))throw new Error("beta must not be NaN.");if(!Number.isFinite(w))throw new Error("beta must be finite.");if(!Number.isInteger(t)||!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(p))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!v&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!v)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(v&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(t<0||i<0||s<0)throw new Error("m, n, and k must be non-negative.");if(t===0||i===0)return v?{}:{C:c};let _=h?n.layout:g,y=b?m.layout:g,G=v?c.layout:g,M=_==="column-major"?s:t,E=_==="column-major"?t:s,j=r==="no-transpose"?M:E,R=r==="no-transpose"?E:M;if(u<R)throw new Error(`lda must be >= ${_==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[O,q]=r==="no-transpose"?[t,s]:[s,t];if(n.rows<O||n.cols<q)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(j-1)*u+R)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=y==="column-major"?i:s,C=y==="column-major"?s:i,F=o==="no-transpose"?T:C,H=o==="no-transpose"?C:T;if(f<H)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[O,q]=o==="no-transpose"?[s,i]:[i,s];if(m.rows<O||m.cols<q)throw new Error("B is too small for the given n, k, and transB.")}else if(m.length<(F-1)*f+H)throw new Error("B does not have enough elements for the given dimensions and ldb.");let K=G==="column-major"?i:t,W=G==="column-major"?t:i;if(p<W)throw new Error(`ldc must be >= ${G==="column-major"?"rows":"cols"} of C as stored.`);if(v){if(p!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<t||c.cols<i)throw new Error("C is too small for the given m and n.")}else if(c.length<(K-1)*p+W)throw new Error("C does not have enough elements for the given dimensions and ldc.");_==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),G==="column-major"&&([n,m]=[m,n],[h,b]=[b,h],[u,f]=[f,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[t,i]=[i,t],e=e==="lower"?"upper":"lower");let Q=Math.ceil(i/Ca),Y=Math.ceil(t/ja),J=Q*Y>=La,ur=await A(a,J?"sgemmtr_large":"sgemmtr_small"),lr=h?n._buf:x(n,"sgemmtr-A",!1),nr=b?m._buf:x(m,"sgemmtr-B",!1),Z=v?c._buf:x(c,"sgemmtr-C",!0),rr=D([{value:t,type:"u32"},{value:i,type:"u32"},{value:s,type:"u32"},{value:l,type:"f32"},{value:w,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:p,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:e==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let O=B(ur.getBindGroupLayout(0),[lr,nr,Z,rr]),q=J?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(i/Ta),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(t/Ra),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:z,ts:X}=L(ur,O,q),$=v?null:N(z,Z);S(z);let or=await P(X);if(v)return or!==void 0?{gpuTimeMs:or}:{};let fr=await k($,Float32Array);return or!==void 0?{C:fr,gpuTimeMs:or}:{C:fr}}finally{h||d(lr),b||d(nr),v||d(Z),d(rr)}}var Wa=32,Fa=32,Ua=64,Oa=64,Va=36;async function co(a,e,r,o,t,i,s,l,n,u,m,f="row-major"){let w=s instanceof U,c=u instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(m))throw new Error("n, k, lda, and ldc must be integers.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(w&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!w)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return c?{}:{C:u};let p=w?s.layout:f,g=c?u.layout:f,h=p==="column-major"?t:o,b=p==="column-major"?o:t,v=r==="no-transpose"?h:b,_=r==="no-transpose"?b:h;if(l<_)throw new Error(`lda must be >= ${p==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[W,Q]=r==="no-transpose"?[o,t]:[t,o];if(s.rows<W||s.cols<Q)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(v-1)*l+_)throw new Error("A does not have enough elements for the given dimensions and lda.");if(m<o)throw new Error("ldc must be >= n.");if(c){if(m!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*m+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let y=r;p==="column-major"&&(y=y==="no-transpose"?"transpose":"no-transpose");let G=y==="no-transpose"?"transpose":"no-transpose",M=e;g==="column-major"&&([y,G]=[G==="no-transpose"?"transpose":"no-transpose",y==="no-transpose"?"transpose":"no-transpose"],M=M==="lower"?"upper":"lower");let E=Math.ceil(o/Oa),j=Math.ceil(o/Ua),R=E*j>=Va,T=await A(a,R?"sgemmtr_large":"sgemmtr_small"),C=w?s._buf:x(s,"ssyrk-A",!1),F=c?u._buf:x(u,"ssyrk-C",!0),H=w?er(C.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(s,"ssyrk-B",!1),K=D([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:y==="transpose"?1:0,type:"u32"},{value:G==="transpose"?1:0,type:"u32"},{value:M==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let W=B(T.getBindGroupLayout(0),[C,H,F,K]),Q=R?{x:Math.min(E,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(j,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Fa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Wa),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Y,querySet:J,passDescriptor:ur}=yr();w&&Y.copyBufferToBuffer(C,0,H,0,C.size),ir(Y,T,W,Q,ur);let lr=hr(Y,J),nr=c?null:N(Y,F);S(Y);let Z=await P(lr);if(c)return Z!==void 0?{gpuTimeMs:Z}:{};let rr=await k(nr,Float32Array);return Z!==void 0?{C:rr,gpuTimeMs:Z}:{C:rr}}finally{w||d(C),d(H),c||d(F),d(K)}}var Ha=32,Ka=32,za=64,qa=64,Ya=36;async function po(a,e,r,o,t,i,s,l,n,u,m,f,w,c="row-major"){let p=s instanceof U,g=n instanceof U,h=f instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(w))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((p||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!p||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return h?{}:{C:f};let b=p?s.layout:c,v=g?n.layout:c,_=h?f.layout:c,y=b==="column-major"?t:o,G=b==="column-major"?o:t,M=r==="no-transpose"?y:G,E=r==="no-transpose"?G:y;if(l<E)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[X,$]=r==="no-transpose"?[o,t]:[t,o];if(s.rows<X||s.cols<$)throw new Error("A is too small for the given n, k, and trans.")}else if(s.length<(M-1)*l+E)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=v==="column-major"?t:o,R=v==="column-major"?o:t,T=r==="no-transpose"?j:R,C=r==="no-transpose"?R:j;if(u<C)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[X,$]=r==="no-transpose"?[o,t]:[t,o];if(n.rows<X||n.cols<$)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(T-1)*u+C)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(w<o)throw new Error("ldc must be >= n.");if(h){if(w!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<o)throw new Error("C is too small for the given n.")}else if(f.length<(o-1)*w+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let F=r;b==="column-major"&&(F=F==="no-transpose"?"transpose":"no-transpose");let H=r;v==="column-major"&&(H=H==="no-transpose"?"transpose":"no-transpose");let K=_==="column-major"?e==="lower"?"upper":"lower":e,W=X=>X==="no-transpose"?"transpose":"no-transpose";function Q(X,$,or,fr,ar,sr){let pr=X,Er=W(fr);return _!=="column-major"?{transX:pr,X:$,ldX:or,transY:Er,Y:ar,ldY:sr}:{transX:W(Er),X:ar,ldX:sr,transY:W(pr),Y:$,ldY:or}}let Y=Math.ceil(o/qa),J=Math.ceil(o/za),ur=Y*J>=Ya,lr=await A(a,ur?"sgemmtr_large":"sgemmtr_small"),nr=ur?{x:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Ka),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Ha),a.limits.maxComputeWorkgroupsPerDimension)},Z=p?s._buf:x(s,"ssyr2k-A",!1),rr=g?n._buf:x(n,"ssyr2k-B",!1),O=h?f._buf:x(f,"ssyr2k-C",!0),q=null,z=null;try{let X=Q(F,Z,l,H,rr,u),$=Q(H,rr,u,F,Z,l),or=(Gr,gr)=>D([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:i,type:"f32"},{value:gr,type:"f32"},{value:Gr.ldX,type:"u32"},{value:Gr.ldY,type:"u32"},{value:w,type:"u32"},{value:Gr.transX==="transpose"?1:0,type:"u32"},{value:Gr.transY==="transpose"?1:0,type:"u32"},{value:K==="upper"?1:0,type:"u32"}],"ssyr2k-params");q=or(X,m),z=or($,1);let fr=B(lr.getBindGroupLayout(0),[X.X,X.Y,O,q]),ar=B(lr.getBindGroupLayout(0),[$.X,$.Y,O,z]),{commandEncoder:sr,querySet:pr}=yr(),Er=pr?{timestampWrites:{querySet:pr,beginningOfPassWriteIndex:0}}:void 0,_r=pr?{timestampWrites:{querySet:pr,endOfPassWriteIndex:1}}:void 0;ir(sr,lr,fr,nr,Er),ir(sr,lr,ar,nr,_r);let Br=hr(sr,pr),br=h?null:N(sr,O);S(sr);let wr=await P(Br);if(h)return wr!==void 0?{gpuTimeMs:wr}:{};let dr=await k(br,Float32Array);return wr!==void 0?{C:dr,gpuTimeMs:wr}:{C:dr}}finally{p||d(Z),g||d(rr),h||d(O),q&&d(q),z&&d(z)}}var Xa=32,$a=32,Za=64,Qa=64,Ja=36,wo=8;async function go(a,e,r,o,t,i,s,l,n,u,m,f,w,c="row-major"){let p=s instanceof U,g=n instanceof U,h=f instanceof U;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(w))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!p&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((p||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!p||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("m and n must be non-negative.");if(o===0||t===0)return h?{}:{C:f};let b=p?s.layout:c,v=g?n.layout:c,_=h?f.layout:c,y=e==="left"?o:t;if(l<y)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(p){if(l!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(s.rows<y||s.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(s.length<(y-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let G=v==="column-major"?t:o,M=v==="column-major"?o:t;if(u<M)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<o||n.cols<t)throw new Error("B is too small for the given m and n.")}else if(n.length<(G-1)*u+M)throw new Error("B does not have enough elements for the given dimensions and ldb.");let E=_==="column-major"?t:o,j=_==="column-major"?o:t;if(w<j)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(w!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<t)throw new Error("C is too small for the given m and n.")}else if(f.length<(E-1)*w+j)throw new Error("C does not have enough elements for the given dimensions and ldc.");let R=b==="column-major"?r==="lower"?"upper":"lower":r,T=v==="column-major"?"transpose":"no-transpose",C="no-transpose",F=o,H=t,K=y,W=e==="left"?C:T,Q=e==="left"?T:C,Y=sr=>sr==="no-transpose"?"transpose":"no-transpose",J=e==="right";_==="column-major"&&([W,Q]=[Y(Q),Y(W)],J=!J,[F,H]=[H,F]);let ur=y,lr=Math.ceil(H/Qa),nr=Math.ceil(F/Za),Z=lr*nr>=Ja,rr=await A(a,Z?"sgemm_large":"sgemm_small"),O=await A(a,"symmetrize"),q=Z?{x:Math.min(lr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(nr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(H/$a),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(F/Xa),a.limits.maxComputeWorkgroupsPerDimension)},z=p?s._buf:x(s,"ssymm-A",!1),X=g?n._buf:x(n,"ssymm-B",!1),$=h?f._buf:x(f,"ssymm-C",!0),or=er(y*ur*4,"ssymm-Adense"),fr=null,ar=null;try{fr=D([{value:y,type:"u32"},{value:l,type:"u32"},{value:ur,type:"u32"},{value:R==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let sr=B(O.getBindGroupLayout(0),[z,or,fr]),pr=J?X:or,Er=J?u:ur,_r=J?or:X;ar=D([{value:F,type:"u32"},{value:H,type:"u32"},{value:K,type:"u32"},{value:i,type:"f32"},{value:m,type:"f32"},{value:Er,type:"u32"},{value:J?ur:u,type:"u32"},{value:w,type:"u32"},{value:W==="transpose"?1:0,type:"u32"},{value:Q==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let br=B(rr.getBindGroupLayout(0),[pr,_r,$,ar]),{commandEncoder:wr,querySet:dr}=yr(),Gr=dr?{timestampWrites:{querySet:dr,beginningOfPassWriteIndex:0}}:void 0,gr=dr?{timestampWrites:{querySet:dr,endOfPassWriteIndex:1}}:void 0;ir(wr,O,sr,{x:Math.ceil(y/wo),y:Math.ceil(y/wo)},Gr),ir(wr,rr,br,q,gr);let Mr=hr(wr,dr),Pr=h?null:N(wr,$);S(wr);let Rr=await P(Mr);if(h)return Rr!==void 0?{gpuTimeMs:Rr}:{};let Vr=await k(Pr,Float32Array);return Rr!==void 0?{C:Vr,gpuTimeMs:Rr}:{C:Vr}}finally{p||d(z),g||d(X),h||d($),d(or),fr&&d(fr),ar&&d(ar)}}var ri=32,ei=32,ti=64,oi=64,ai=36,bo=8;async function ho(a,e,r,o,t,i,s,l,n,u,m,f,w="row-major"){let c=n instanceof U,p=m instanceof U,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==p)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(i<0||s<0)throw new Error("m and n must be non-negative.");if(i===0||s===0)return p?{}:{B:m};let h=c?n.layout:w,b=p?m.layout:w,v=e==="left"?i:s;if(u<v)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<v||n.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(v-1)*u+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?s:i,y=b==="column-major"?i:s;if(f<y)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(p){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(m.rows<i||m.cols<s)throw new Error("B is too small for the given m and n.")}else if(m.length<(_-1)*f+y)throw new Error("B does not have enough elements for the given dimensions and ldb.");let G=h==="column-major"?r==="lower"?"upper":"lower":r,M=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,E=b==="column-major"?"transpose":"no-transpose",j="no-transpose",R=i,T=s,C=v,F=e==="left"?j:E,H=e==="left"?E:j,K=fr=>fr==="no-transpose"?"transpose":"no-transpose",W=e==="right";b==="column-major"&&([F,H]=[K(H),K(F)],W=!W,[R,T]=[T,R]);let Q=v,Y=Math.ceil(T/oi),J=Math.ceil(R/ti),ur=Y*J>=ai,lr=await A(a,ur?"sgemm_large":"sgemm_small"),nr=await A(a,"triangularize"),Z=ur?{x:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(T/ei),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(R/ri),a.limits.maxComputeWorkgroupsPerDimension)},rr=c?n._buf:x(n,"strmm-A",!1),O=p?m._buf:x(m,"strmm-B",!0),q=er(v*Q*4,"strmm-Adense"),z=er(_*f*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),X=null,$=null,or=!1;try{X=D([{value:v,type:"u32"},{value:u,type:"u32"},{value:Q,type:"u32"},{value:G==="upper"?1:0,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let fr=B(nr.getBindGroupLayout(0),[rr,q,X]),ar=W?O:q,sr=W?f:Q,pr=W?q:O;$=D([{value:R,type:"u32"},{value:T,type:"u32"},{value:C,type:"u32"},{value:l,type:"f32"},{value:0,type:"f32"},{value:sr,type:"u32"},{value:W?Q:f,type:"u32"},{value:f,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:H==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let _r=B(lr.getBindGroupLayout(0),[ar,pr,z,$]),{commandEncoder:Br,querySet:br}=yr();Br.copyBufferToBuffer(O,0,z,0,Math.min(O.size,z.size));let wr=br?{timestampWrites:{querySet:br,beginningOfPassWriteIndex:0}}:void 0,dr=br?{timestampWrites:{querySet:br,endOfPassWriteIndex:1}}:void 0;ir(Br,nr,fr,{x:Math.ceil(v/bo),y:Math.ceil(v/bo)},wr),ir(Br,lr,_r,Z,dr);let Gr=hr(Br,br),gr=p?null:N(Br,z);S(Br);let Mr=await P(Gr);if(p)return d(m._buf),m._buf=z,or=!0,Mr!==void 0?{gpuTimeMs:Mr}:{};let Pr=await k(gr,Float32Array);return Mr!==void 0?{B:Pr,gpuTimeMs:Mr}:{B:Pr}}finally{c||d(rr),p||d(O),d(q),or||d(z),X&&d(X),$&&d($)}}var vr=64,vo=32,xo=32,yo=64,_o=64,Bo=36;async function Eo(a,e,r,o,t,i,s,l,n,u,m,f,w="row-major"){let c=n instanceof U,p=m instanceof U,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(i)||!Number.isInteger(s)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==p)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(i<0||s<0)throw new Error("m and n must be non-negative.");if(i===0||s===0)return p?{}:{B:m};let h=c?n.layout:w,b=p?m.layout:w,v=e==="left"?i:s;if(u<v)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<v||n.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(v-1)*u+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?s:i,y=b==="column-major"?i:s;if(f<y)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(p){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(m.rows<i||m.cols<s)throw new Error("B is too small for the given m and n.")}else if(m.length<(_-1)*f+y)throw new Error("B does not have enough elements for the given dimensions and ldb.");let G=h==="column-major"?r==="lower"?"upper":"lower":r,M=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,E=e==="left"?s:i,j=e==="left",R=M==="no-transpose"==(G==="lower"),T=e==="left"?R:!R,C=[];for(let O=0;O<v;O+=vr)C.push(O);T||C.reverse();let F=C.length,H=await A(a,"strsv_invert_block"),K=await A(a,"block_transfer"),W=await A(a,"sscal"),Q=c?n._buf:x(n,"strsm-A",!1),Y=p?m._buf:x(m,"strsm-B",!0),J=er(F*vr*vr*4,"strsm-Ainv"),ur=[],lr=[];function nr(O,q){let z=er(O,q);return lr.push(z),z}function Z(O,q){let z=D(O,q);return ur.push(z),z}let rr=(_-1)*f+y;try{let O=null;if(l!==1){let br=Z([{value:rr,type:"u32"},{value:l,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");O=B(W.getBindGroupLayout(0),[Y,br])}let q=Z([{value:v,type:"u32"},{value:u,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:G==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),z=B(H.getBindGroupLayout(0),[Q,J,q]),X=nr(vr*E*4,"strsm-Bblock"),$=nr(vr*E*4,"strsm-Xblock"),or=nr(v*vr*4,"strsm-Aoff"),fr=nr(v*E*4,"strsm-delta"),{commandEncoder:ar,querySet:sr}=yr();if(l===0){let br=sr?{timestampWrites:{querySet:sr,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0;ir(ar,W,O,cr(rr),br)}else{O&&ir(ar,W,O,cr(rr)),ir(ar,H,z,{x:vr,y:F},sr?{timestampWrites:{querySet:sr,beginningOfPassWriteIndex:0}}:void 0);for(let wr=0;wr<C.length;wr++){let dr=C[wr],Gr=Math.min(dr+vr,v),gr=Gr-dr,Mr=dr/vr,Pr=wr===C.length-1,Rr=Z([{value:dr,type:"u32"},{value:gr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),Vr=B(K.getBindGroupLayout(0),[X,Y,Rr]);ir(ar,K,Vr,cr(gr,E));{let Sr=gr,Ir=E,Qr=gr,Cr=Math.ceil(Ir/_o),Lr=Math.ceil(Sr/yo),Wr=Cr*Lr>=Bo,Fr=await A(a,Wr?"sgemm_large":"sgemm_small"),Jr=Z([{value:Sr,type:"u32"},{value:Ir,type:"u32"},{value:Qr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:vr,type:"u32"},{value:E,type:"u32"},{value:E,type:"u32"},{value:e==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),re=B(Fr.getBindGroupLayout(0),[{buffer:J,offset:Mr*vr*vr*4,size:vr*vr*4},X,$,Jr]),ee=Wr?{x:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Lr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Ir/xo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Sr/vo),a.limits.maxComputeWorkgroupsPerDimension)};ir(ar,Fr,re,ee)}let Hr=T?Gr:0,me=T?v:dr,fe=Hr<me,Go=Z([{value:dr,type:"u32"},{value:gr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),Ao=B(K.getBindGroupLayout(0),[$,Y,Go]),ko=Pr&&!fe&&sr?{timestampWrites:{querySet:sr,endOfPassWriteIndex:1}}:void 0;if(ir(ar,K,Ao,cr(gr,E),ko),!fe)continue;let jr=me-Hr,Mo=Z([{value:Hr,type:"u32"},{value:jr,type:"u32"},{value:dr,type:"u32"},{value:gr,type:"u32"},{value:u,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),No=B(K.getBindGroupLayout(0),[or,Q,Mo]);ir(ar,K,No,cr(jr,gr));{let Sr=jr,Ir=E,Qr=gr,Cr=Math.ceil(Ir/_o),Lr=Math.ceil(Sr/yo),Wr=Cr*Lr>=Bo,Fr=await A(a,Wr?"sgemm_large":"sgemm_small"),Jr=Z([{value:Sr,type:"u32"},{value:Ir,type:"u32"},{value:Qr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:gr,type:"u32"},{value:E,type:"u32"},{value:E,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),re=B(Fr.getBindGroupLayout(0),[or,$,fr,Jr]),ee=Wr?{x:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Lr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Ir/xo),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Sr/vo),a.limits.maxComputeWorkgroupsPerDimension)};ir(ar,Fr,re,ee)}let Po=Z([{value:Hr,type:"u32"},{value:jr,type:"u32"},{value:0,type:"u32"},{value:E,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),So=B(K.getBindGroupLayout(0),[fr,Y,Po]),Io=Pr&&sr?{timestampWrites:{querySet:sr,endOfPassWriteIndex:1}}:void 0;ir(ar,K,So,cr(jr,E),Io)}}let pr=hr(ar,sr),Er=p?null:N(ar,Y);S(ar);let _r=await P(pr);if(p)return _r!==void 0?{gpuTimeMs:_r}:{};let Br=await k(Er,Float32Array);return _r!==void 0?{B:Br,gpuTimeMs:_r}:{B:Br}}finally{c||d(Q),p||d(Y),d(J),d(lr),d(ur)}}return Lo(ii);})();
