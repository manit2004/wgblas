var wgblas=(()=>{var To=Object.create;var Hr=Object.defineProperty;var jo=Object.getOwnPropertyDescriptor;var Co=Object.getOwnPropertyNames;var Lo=Object.getPrototypeOf,Wo=Object.prototype.hasOwnProperty;var Kr=(a=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(a,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):a)(function(a){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var O=(a,e,r)=>()=>{if(r)throw r[0];try{return a&&(e=a(a=0)),e}catch(o){throw r=[o],o}};var de=(a,e)=>{for(var r in e)Hr(a,r,{get:e[r],enumerable:!0})},pe=(a,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of Co(e))!Wo.call(a,t)&&t!==r&&Hr(a,t,{get:()=>e[t],enumerable:!(o=jo(e,t))||o.enumerable});return a};var zr=(a,e,r)=>(r=a!=null?To(Lo(a)):{},pe(e||!a||!a.__esModule?Hr(r,"default",{value:a,enumerable:!0}):r,a)),Fo=a=>pe(Hr({},"__esModule",{value:!0}),a);var te,Ge=O(()=>{te=`// sscal: x = alpha * x

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
`});var Se,Ae=O(()=>{Se=`// sswap: x <-> y

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
`});var Me,ke=O(()=>{Me=`// saxpy: y = alpha * x + y

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
`});var Ie,Ne=O(()=>{Ie=`// scopy: y = x

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
`});var De,Pe=O(()=>{De=`// sdot: result = sum(x[i] * y[i])
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
`});var oe,Re=O(()=>{oe=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var je,Te=O(()=>{je=`// sasum: result = sum(|x[i]|)
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
`});var Le,Ce=O(()=>{Le=`// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
// (Blue's algorithm / reference BLAS's SLASSQ) rather than naive squaring \u2014
// naive \`sum += x_i * x_i\` overflows to inf for |x_i| \u2273 1.8e19 (f32's
// squaring range is only sqrt(f32_max)) and loses precision on tiny
// magnitudes squaring into the denormal range. Running state is (scale,
// ssq) with true-sum-of-squares == scale\xB2 \xB7 ssq: scale tracks the largest
// |x_i| seen so far, and every other contribution is expressed *relative
// to* scale (never squared in absolute terms), so ssq stays near 1
// regardless of x's magnitude range. Merging two independent partials
// (ssqMerge) is associative, so this composes with the same 4-way-ILP +
// tree-reduction shape every other Level 1 reduction here uses \u2014 see
// reduction/scaledSum.wgsl for the pass-2 counterpart, which finishes with
// scale\xB7sqrt(ssq).
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/scaledSum.wgsl.

@group(0) @binding(0) var<storage, read>       x:             array<f32>;
@group(0) @binding(1) var<storage, read_write> partialsScale: array<f32>;
@group(0) @binding(2) var<storage, read_write> partialsSsq:   array<f32>;
@group(0) @binding(3) var<uniform>             params:        Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

struct ScaleSsq {
  scale: f32,
  ssq:   f32,
}

// Folds one more |value| into a running (scale, ssq) pair.
fn ssqAccum(acc: ScaleSsq, absxi: f32) -> ScaleSsq {
  if (absxi == 0.0) { return acc; }
  if (absxi > acc.scale) {
    let r = acc.scale / absxi; // 0/absxi == 0 on the first nonzero value \u2014 safe
    return ScaleSsq(absxi, 1.0 + acc.ssq * r * r);
  }
  let r = absxi / acc.scale; // reached only once acc.scale > 0 (absxi <= acc.scale and absxi > 0)
  return ScaleSsq(acc.scale, acc.ssq + r * r);
}

// Associative merge of two independent (scale, ssq) partials \u2014 lets this
// compose with a tree reduction exactly like a plain sum would.
fn ssqMerge(a: ScaleSsq, b: ScaleSsq) -> ScaleSsq {
  if (a.scale == 0.0 && b.scale == 0.0) { return ScaleSsq(0.0, 1.0); }
  if (a.scale >= b.scale) {
    let r = b.scale / a.scale;
    return ScaleSsq(a.scale, a.ssq + b.ssq * r * r);
  }
  let r = a.scale / b.scale;
  return ScaleSsq(b.scale, b.ssq + a.ssq * r * r);
}

var<workgroup> tileScale: array<f32, 64>;
var<workgroup> tileSsq:   array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = ScaleSsq(0.0, 1.0);
  var acc1 = ScaleSsq(0.0, 1.0);
  var acc2 = ScaleSsq(0.0, 1.0);
  var acc3 = ScaleSsq(0.0, 1.0);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = ssqAccum(acc0, abs(x[ id                * params.x_inc]));
    acc1 = ssqAccum(acc1, abs(x[(id +      stride) * params.x_inc]));
    acc2 = ssqAccum(acc2, abs(x[(id + 2u * stride) * params.x_inc]));
    acc3 = ssqAccum(acc3, abs(x[(id + 3u * stride) * params.x_inc]));
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = ssqAccum(acc0, abs(x[id * params.x_inc]));
  }

  let combined = ssqMerge(ssqMerge(acc0, acc1), ssqMerge(acc2, acc3));
  tileScale[lid.x] = combined.scale;
  tileSsq[lid.x]   = combined.ssq;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      let merged = ssqMerge(
        ScaleSsq(tileScale[lid.x], tileSsq[lid.x]),
        ScaleSsq(tileScale[lid.x + s], tileSsq[lid.x + s]),
      );
      tileScale[lid.x] = merged.scale;
      tileSsq[lid.x]   = merged.ssq;
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsScale[wgid.x] = tileScale[0];
    partialsSsq[wgid.x]   = tileSsq[0];
  }
}
`});var Fe,We=O(()=>{Fe=`// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
// snrm2.wgsl into the final norm \u2014 sqrt(scale\xB2 \xB7 ssq) == scale \xB7 sqrt(ssq).
// Mirrors reduction/sum.wgsl's shape exactly, merging via ssqMerge (see
// snrm2.wgsl for the derivation) instead of plain \`+\`, and taking the final
// sqrt here rather than on the CPU \u2014 unlike sasum/sdot's plain sum, "sum of
// squares" isn't a meaningful standalone value to hand back, only
// scale\xB7sqrt(ssq) is.
// dispatch: 1 workgroup of WGS threads.
// partialsScale/partialsSsq must have exactly 2*WGS entries each.

@group(0) @binding(0) var<storage, read>       partialsScale: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsSsq:   array<f32>;
@group(0) @binding(2) var<storage, read_write> result:        array<f32>;

const WGS: u32 = 64;

// True sum-of-squares represented so far == scale\xB2 \xB7 ssq \u2014 see snrm2.wgsl.
struct ScaleSsq {
  scale: f32,
  ssq:   f32,
}

// Associative merge of two independent (scale, ssq) partials.
fn ssqMerge(a: ScaleSsq, b: ScaleSsq) -> ScaleSsq {
  if (a.scale == 0.0 && b.scale == 0.0) { return ScaleSsq(0.0, 1.0); }
  if (a.scale >= b.scale) {
    let r = b.scale / a.scale;
    return ScaleSsq(a.scale, a.ssq + b.ssq * r * r);
  }
  let r = a.scale / b.scale;
  return ScaleSsq(b.scale, b.ssq + a.ssq * r * r);
}

var<workgroup> tileScale: array<f32, 64>;
var<workgroup> tileSsq:   array<f32, 64>;

@compute @workgroup_size(64)
fn reduce_scaled(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let merged0 = ssqMerge(
    ScaleSsq(partialsScale[i], partialsSsq[i]),
    ScaleSsq(partialsScale[i + WGS], partialsSsq[i + WGS]),
  );
  tileScale[i] = merged0.scale;
  tileSsq[i]   = merged0.ssq;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) {
      let merged = ssqMerge(
        ScaleSsq(tileScale[i], tileSsq[i]),
        ScaleSsq(tileScale[i + s], tileSsq[i + s]),
      );
      tileScale[i] = merged.scale;
      tileSsq[i]   = merged.ssq;
    }
    workgroupBarrier();
  }

  if (i == 0u) {
    result[0] = tileScale[0] * sqrt(tileSsq[0]);
  }
}
`});var Ue,qe=O(()=>{Ue=`// isamax: returns index of element with largest absolute value
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
`});var Ve,Oe=O(()=>{Ve=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var ae,He=O(()=>{ae=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var se,Ke=O(()=>{se=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Ye,ze=O(()=>{Ye=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var $e,Xe=O(()=>{$e=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var Qe,Ze=O(()=>{Qe=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var rt,Je=O(()=>{rt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var tt,et=O(()=>{tt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var at,ot=O(()=>{at=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var it,st=O(()=>{it=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var ut,nt=O(()=>{ut=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var mt,lt=O(()=>{mt=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var ct,ft=O(()=>{ct=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
      // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
      let acc = params.alpha * scratch[0];
      y[yi] = select(acc, acc + params.beta * y[yi], params.beta != 0.0);
    }
    // All 64 threads must agree before the next row reuses scratch[].
    workgroupBarrier();
  }
}
`});var pt,dt=O(()=>{pt=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
    let acc = params.alpha * (acc0 + acc1 + acc2 + acc3);
    y[yi] = select(acc, acc + params.beta * y[yi], params.beta != 0.0);
  }
}
`});var gt,wt=O(()=>{gt=`// ssymv: y = alpha * A * x + beta * y
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
      // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
      let acc = params.alpha * scratch[0];
      y[i * params.incy] = select(acc, acc + params.beta * y[i * params.incy], params.beta != 0.0);
    }
  }
}
`});var ht,bt=O(()=>{ht=`// strmv: y = op(A) * x
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
`});var ie,vt=O(()=>{ie=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var yt,xt=O(()=>{yt=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Bt,_t=O(()=>{Bt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Gt,Et=O(()=>{Gt=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var St,At=O(()=>{St=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var Mt,kt=O(()=>{Mt=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var qr,Nt=O(()=>{qr=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
          // BLAS beta==0 semantics: C is written, not accumulated \u2014 must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`});var Ur,It=O(()=>{Ur=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
          // BLAS beta==0 semantics: C is written, not accumulated \u2014 must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`});var Yr,Pt=O(()=>{Yr=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
          // BLAS beta==0 semantics: C is written, not accumulated \u2014 must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`});var Xr,Dt=O(()=>{Xr=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
          // BLAS beta==0 semantics: C is written, not accumulated \u2014 must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`});var Tt,Rt=O(()=>{Tt=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var Ct,jt=O(()=>{Ct=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`});var Wt,Lt=O(()=>{Wt=`// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
`});var Ft={};de(Ft,{routineShaders:()=>tr,shaderSources:()=>Sa});var tr,Sa,qt=O(()=>{Ge();Ae();ke();Ne();Pe();Re();Te();Ce();We();qe();Oe();He();Ke();ze();Xe();Ze();Je();et();ot();st();nt();lt();ft();dt();wt();bt();vt();xt();_t();Et();At();kt();Nt();It();Pt();Dt();Rt();jt();Lt();tr={};tr.sscal={sscal:te};tr.sswap={sswap:Se};tr.saxpy={saxpy:Me};tr.scopy={scopy:Ie};tr.sdot={sdot:De,"reduction/sum":oe};tr.sasum={sasum:je,"reduction/sum":oe};tr.snrm2={snrm2:Le,"reduction/scaledSum":Fe};tr.isamax={isamax:Ue,"reduction/argmax":Ve};tr.dasum={"f64/dekker":ae,"f64/utils/abs":se,"f64/utils/add":Ye,dasum:$e,"reduction/sumF64":Qe};tr.idamax={"f64/dekker":ae,"f64/utils/abs":se,"f64/utils/greater":rt,"f64/utils/equal":tt,idamax:at,"reduction/argmaxF64":it};tr.srot={srot:ut};tr.srotm={srotm:mt};tr.sgemv={sgemv_n:ct,sgemv_t:pt};tr.ssymv={ssymv:gt};tr.strmv={strmv:ht};tr.strsv={strsv_invert_block:ie,strsv_apply_inverse:yt,strsv_update:Bt};tr.sger={sger:Gt};tr.ssyr={ssyr:St};tr.ssyr2={ssyr2:Mt};tr.sgemm={sgemm_small:qr,sgemm_large:Ur};tr.sgemmtr={sgemmtr_small:Yr,sgemmtr_large:Xr};tr.ssyrk={sgemmtr_small:Yr,sgemmtr_large:Xr};tr.ssyr2k={sgemmtr_small:Yr,sgemmtr_large:Xr};tr.ssymm={sgemm_small:qr,sgemm_large:Ur,symmetrize:Tt};tr.strmm={sgemm_small:qr,sgemm_large:Ur,triangularize:Ct};tr.strsm={strsv_invert_block:ie,block_transfer:Wt,sscal:te,sgemm_small:qr,sgemm_large:Ur};Sa=Object.assign({},...Object.values(tr))});var us={};de(us,{GpuMatrix:()=>q,GpuVector:()=>P,cleanup:()=>xe,dasum:()=>Zt,gpuName:()=>ye,idamax:()=>ro,init:()=>ve,isamax:()=>Jt,randomFloat32Array:()=>_e,randomFloat64Array:()=>Be,randomTriangularFloat32Array:()=>Ee,sasum:()=>$t,saxpy:()=>Ht,scopy:()=>Kt,sdot:()=>Yt,sgemm:()=>co,sgemmtr:()=>po,sgemv:()=>oo,sger:()=>lo,snrm2:()=>Qt,srot:()=>eo,srotm:()=>to,sscal:()=>Ot,sswap:()=>Vt,ssymm:()=>ho,ssymv:()=>ao,ssyr:()=>mo,ssyr2:()=>fo,ssyr2k:()=>go,ssyrk:()=>wo,strmm:()=>xo,strmv:()=>so,strsm:()=>Ao,strsv:()=>uo});function we(a,e){return e?a.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function ge(){if(!be())return{querySet:null,passDescriptor:void 0};let e=mr().createQuerySet({type:"timestamp",count:2});return{querySet:e,passDescriptor:{timestampWrites:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function hr(a,e){if(!e)return null;let r=mr(),o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});a.resolveQuerySet(e,0,2,o,0);let t=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(o,0,t,0,16),{tsReadBuffer:t,resolveBuffer:o,querySet:e}}async function N(a){if(!a)return;let{tsReadBuffer:e,resolveBuffer:r,querySet:o}=a;await e.mapAsync(GPUMapMode.READ);let t=new BigInt64Array(e.getMappedRange().slice());return e.unmap(),e.destroy(),r.destroy(),o.destroy(),Math.max(0,Number(t[1]-t[0]))/1e6}var Ar=null,Dr=null,he=null,ee=!1;async function ve({powerPreference:a="high-performance",benchmark:e=!1,dumpShaders:r=!1}={}){if(Ar)return Ar;let o;if(typeof window>"u"){let{create:i,globals:m}=await import("webgpu");Object.assign(globalThis,m),o=i(r?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),he=o}else r&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),o=navigator.gpu;if(!o)throw new Error("WebGPU not supported in this environment.");if(Dr=await o.requestAdapter({powerPreference:a})??await o.requestAdapter(),!Dr)throw new Error("No WebGPU adapter found.");ee=e;let s=[...we(Dr,e).requiredFeatures??[]];return Ar=await Dr.requestDevice({requiredFeatures:s}),Ar.addEventListener("uncapturederror",i=>{console.error("Uncaptured GPU error:",i.error.message)}),Ar}function xe(){Ar&&(Ar.destroy(),Ar=null),Dr=null,he=null,ee=!1}function ye(){if(!Dr)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:a,description:e}=Dr.info;return{description:e||"unknown",device:a||"unknown"}}function be(){return ee}function mr(){if(!Ar)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Ar}function d(...a){a.flat().forEach(e=>e.destroy())}function x(a,e="blas-input",r=!1){let o=mr(),t=o.limits.maxStorageBufferBindingSize,s=a.byteLength;if(s>t)throw new Error(`Buffer size ${s} bytes exceeds device limit of ${t} bytes.`);let i=r?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,m=o.createBuffer({label:e,size:s,usage:i,mappedAtCreation:!0}),n=a.constructor;return new n(m.getMappedRange()).set(a),m.unmap(),m}function er(a,e="blas-storage",r=0){return mr().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|r})}function xr(a,e="blas-result"){return mr().createBuffer({label:e,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function k(a,e){let o=mr().createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return a.copyBufferToBuffer(e,0,o,0,e.size),o}function D(a,e="blas-params"){let r=mr(),o=a.length*4,t=Math.ceil(o/16)*16,s=new ArrayBuffer(t),i=new DataView(s);a.forEach(({value:n,type:u},l)=>{let f=l*4;if(u==="u32")i.setUint32(f,n,!0);else if(u==="i32")i.setInt32(f,n,!0);else if(u==="f32")i.setFloat32(f,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let m=r.createBuffer({label:e,size:t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(m,0,s),m}async function S(a,e=Float32Array){try{await a.mapAsync(GPUMapMode.READ);let r=new e(a.getMappedRange().slice());return a.unmap(),r}finally{a.destroy()}}function Mr(a){let e=a.length,r=new Float32Array(e),o=new Float32Array(e);for(let t=0;t<e;t++){let s=Math.fround(a[t]);r[t]=s,o[t]=Math.fround(a[t]-s)}return{hi:r,lo:o}}function Tr(a,e){let r=a.length,o=new Float64Array(r);for(let t=0;t<r;t++)o[t]=a[t]+e[t];return o}var P=class a{constructor(e,r,o=Float32Array,t=null){this._buf=e,this._loBuf=t,this.length=r,this.dtype=o}static from(e){if(e instanceof Float64Array){let{hi:o,lo:t}=Mr(e),s=x(o,"gpu-vector-f64-hi",!0),i=x(t,"gpu-vector-f64-lo",!0);return new a(s,e.length,Float64Array,i)}if(!(e instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let r=x(e,"gpu-vector",!0);return new a(r,e.length,e.constructor)}async read(){let e=mr(),r=e.createCommandEncoder(),o=k(r,this._buf);if(e.queue.submit([r.finish()]),!this._loBuf)return S(o,this.dtype);let t=e.createCommandEncoder(),s=k(t,this._loBuf);e.queue.submit([t.finish()]);let[i,m]=await Promise.all([S(o,Float32Array),S(s,Float32Array)]);return Tr(i,m)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var q=class a{constructor(e,r,o,t,s=null,i="row-major"){this._buf=e,this._loBuf=s,this.rows=r,this.cols=o,this.lda=t,this.layout=i}static from(e,r,o,t,s="row-major"){if(s!=="row-major"&&s!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let i=s==="row-major";if(t===void 0&&(t=i?o:r),!(e instanceof Float32Array)&&!(e instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(r)||r<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(o)||o<=0)throw new Error("cols must be a positive integer.");let m=i?o:r;if(!Number.isInteger(t)||t<m)throw new Error(`lda must be an integer >= ${i?"cols":"rows"}.`);let n=i?r:o;if(e.length<n*t)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(e instanceof Float64Array){let l=n*t,{hi:f,lo:p}=Mr(e.subarray(0,l)),c=x(f,"gpu-matrix-f64-hi",!0),w=x(p,"gpu-matrix-f64-lo",!0);return new a(c,r,o,t,w,s)}let u=x(e.subarray(0,n*t),"gpu-matrix",!0);return new a(u,r,o,t,null,s)}async read(){let e=mr(),r=e.createCommandEncoder(),o=k(r,this._buf);e.queue.submit([r.finish()]);let t=this.layout!=="column-major",s=t?this.rows:this.cols,i=t?this.cols:this.rows;if(this._loBuf){let u=e.createCommandEncoder(),l=k(u,this._loBuf);e.queue.submit([u.finish()]);let[f,p]=await Promise.all([S(o,Float32Array),S(l,Float32Array)]),c=Tr(f,p);if(this.lda===i)return c;let w=new Float64Array(s*i);for(let g=0;g<s;g++)w.set(c.subarray(g*this.lda,g*this.lda+i),g*i);return w}let m=await S(o,Float32Array);if(this.lda===i)return m;let n=new Float32Array(s*i);for(let u=0;u<s;u++)n.set(m.subarray(u*this.lda,u*this.lda+i),u*i);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function _e(a,e=-1,r=1){let o=new Float32Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function Be(a,e=-1,r=1){let o=new Float64Array(a);for(let t=0;t<a;t++)o[t]=e+Math.random()*(r-e);return o}function Ee(a,e,r="lower",o=-1,t=1,s=5,i=15){if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e<a)throw new Error("lda must be >= n.");let m=new Float32Array(a*e);for(let n=0;n<a;n++){for(let u=0;u<a;u++){if(n===u)continue;(r==="lower"?u<n:u>n)&&(m[n*e+u]=o+Math.random()*(t-o))}m[n*e+n]=s+Math.random()*(i-s)}return m}function E(a,e,r=0){let o=mr(),t=e.map((s,i)=>({binding:r+i,resource:s instanceof GPUBuffer?{buffer:s}:s}));return o.createBindGroup({layout:a,entries:t})}var qo=new WeakMap;function I(a){mr().queue.submit([a.finish()])}function yr(){let a=mr(),{querySet:e,passDescriptor:r}=ge();return{commandEncoder:a.createCommandEncoder(),querySet:e,passDescriptor:r}}function sr(a,e,r,o,t){let s=a.beginComputePass(t);s.setPipeline(e),s.setBindGroup(0,r),typeof o=="number"?s.dispatchWorkgroups(o):s.dispatchWorkgroups(o.x,o.y,o.z??1),s.end(),qo.set(a,s)}function L(a,e,r){let{commandEncoder:o,querySet:t,passDescriptor:s}=yr();sr(o,a,e,r,s);let i=hr(o,t);return{commandEncoder:o,ts:i}}var Na={},ne=new WeakMap;async function A(a,e,r="main"){ne.has(a)||ne.set(a,new Map);let o=ne.get(a),t=Array.isArray(e)?e:[e],s=`${t.join("+")}::${r}`;return o.has(s)||o.set(s,await Ma(t,r)),o.get(s)}async function ka(a){if(typeof process>"u"||!process.versions?.node){let{shaderSources:e}=await Promise.resolve().then(()=>(qt(),Ft)),r=e[a];if(!r)throw new Error(`Shader "${a}" not found in browser bundle.`);return r}else{let{readFileSync:e}=await import("fs"),{fileURLToPath:r}=await import("url"),{dirname:o,join:t}=await import("path"),s=o(r(Na.url));return e(t(s,`../shaders/${a}.wgsl`),"utf8")}}async function Ma(a,e="main"){let r=mr(),o=a.join("+"),t=(await Promise.all(a.map(ka))).join(`
`),s=r.createShaderModule({label:o,code:t}),m=(await s.getCompilationInfo()).messages.filter(l=>l.type==="error");if(m.length>0)throw new Error(`Shader "${o}" compilation failed:
${m.map(l=>`  line ${l.lineNum}: ${l.message}`).join(`
`)}`);let n=e==="main"?{module:s}:{module:s,entryPoint:e},u=r.createComputePipeline({label:o,layout:"auto",compute:n});return u._shaderModule=s,u}var Ia=64,Ut=8;function cr(a,e){let r=mr().limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(a/Ia),r):{x:Math.min(Math.ceil(e/Ut),r),y:Math.min(Math.ceil(a/Ut),r)}}async function Ot(a,e,r,o,t){let s=o instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t))throw new Error("n and incx must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof P))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return s?{}:{x:o};if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await A(a,"sscal"),m=null,n=null,u=null;try{m=s?o._buf:x(o,"sscal-x",!0),n=D([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"}],"sscal-params");let l=E(i.getBindGroupLayout(0),[m,n]),{commandEncoder:f,ts:p}=L(i,l,cr(e));u=s?null:k(f,m),I(f);let c=await N(p);if(s)return c!==void 0?{gpuTimeMs:c}:{};let w=await S(u,Float32Array);return u=null,c!==void 0?{x:w,gpuTimeMs:c}:{x:w}}finally{!s&&m&&d(m),n&&d(n),u&&d(u)}}async function Vt(a,e,r,o,t,s){let i=r instanceof P,m=t instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!(r instanceof Float32Array)&&!(r instanceof P))throw new Error("x must be a Float32Array or GpuVector.");if(!(t instanceof Float32Array)&&!(t instanceof P))throw new Error("y must be a Float32Array or GpuVector.");if(r.constructor!==t.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return i?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"sswap"),u=null,l=null,f=null,p=null,c=null;try{u=i?r._buf:x(r,"sswap-x",!0),l=m?t._buf:x(t,"sswap-y",!0),f=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"sswap-params");let w=E(n.getBindGroupLayout(0),[u,l,f]),{commandEncoder:g,ts:h}=L(n,w,cr(e));p=i?null:k(g,u),c=m?null:k(g,l),I(g);let b=await N(h);if(i&&m)return b!==void 0?{gpuTimeMs:b}:{};let v=await S(p,Float32Array);p=null;let _=await S(c,Float32Array);return c=null,b!==void 0?{x:v,y:_,gpuTimeMs:b}:{x:v,y:_}}finally{!i&&u&&d(u),!m&&l&&d(l),f&&d(f),p&&d(p),c&&d(c)}}async function Ht(a,e,r,o,t,s,i){let m=o instanceof P,n=s instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof r!="number")throw new Error("alpha must be a number.");if(Number.isNaN(r))throw new Error("alpha must not be NaN.");if(!Number.isFinite(r))throw new Error("alpha must be finite.");if(t<=0||i<=0)throw new Error("incx and incy must be positive.");if(!m&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{y:s};if(o.length<(e-1)*t+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(e-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(a,"saxpy"),l=null,f=null,p=null,c=null;try{l=m?o._buf:x(o,"saxpy-x",!1),f=n?s._buf:x(s,"saxpy-y",!0),p=D([{value:e,type:"u32"},{value:r,type:"f32"},{value:t,type:"u32"},{value:i,type:"u32"}],"saxpy-params");let w=E(u.getBindGroupLayout(0),[l,f,p]),{commandEncoder:g,ts:h}=L(u,w,cr(e));c=n?null:k(g,f),I(g);let b=await N(h);if(n&&m)return b!==void 0?{gpuTimeMs:b}:{};let v=await S(c,Float32Array);return c=null,b!==void 0?{y:v,gpuTimeMs:b}:{y:v}}finally{!m&&l&&d(l),!n&&f&&d(f),p&&d(p),c&&d(c)}}async function Kt(a,e,r,o,t,s){let i=r instanceof P,m=t instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return m?{}:{y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"scopy"),u=null,l=null,f=null,p=null;try{u=i?r._buf:x(r,"scopy-x",!1),l=m?t._buf:x(t,"scopy-y",!0),f=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"scopy-params");let c=E(n.getBindGroupLayout(0),[u,l,f]),{commandEncoder:w,ts:g}=L(n,c,cr(e));p=m?null:k(w,l),I(w);let h=await N(g);if(m&&i)return h!==void 0?{gpuTimeMs:h}:{};let b=await S(p,Float32Array);return p=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!i&&u&&d(u),!m&&l&&d(l),f&&d(f),p&&d(p)}}var zt=64;async function Yt(a,e,r,o,t,s){let i=r instanceof P,m=t instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return{dot:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await A(a,"sdot"),u=await A(a,"reduction/sum"),l=null,f=null,p=null,c=null,w=null,g=null;try{l=i?r._buf:x(r,"sdot-x",!1),f=m?t._buf:x(t,"sdot-y",!1),p=er(2*zt*4,"sdot-partials"),c=xr(4,"sdot-result"),w=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"sdot-params");let h=E(n.getBindGroupLayout(0),[l,f,p,w]),{commandEncoder:b,ts:v}=L(n,h,2*zt);I(b);let _=E(u.getBindGroupLayout(0),[p,c]),{commandEncoder:y,ts:G}=L(u,_,1);g=k(y,c),I(y);let M=S(g,Float32Array);g=null;let[B,j,R]=await Promise.all([N(v),N(G),M]);return B!==void 0&&j!==void 0?{dot:R[0],gpuTimeMs:B+j}:{dot:R[0]}}finally{!i&&l&&d(l),!m&&f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}var Xt=64;async function $t(a,e,r,o){let t=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(a,"sasum"),i=await A(a,"reduction/sum"),m=null,n=null,u=null,l=null,f=null;try{m=t?r._buf:x(r,"sasum-x",!1),n=er(2*Xt*4,"sasum-partials"),u=xr(4,"sasum-result"),l=D([{value:e,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=E(s.getBindGroupLayout(0),[m,n,l]),{commandEncoder:c,ts:w}=L(s,p,2*Xt);I(c);let g=E(i.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=L(i,g,1);f=k(h,u),I(h);let v=S(f,Float32Array);f=null;let[_,y,G]=await Promise.all([N(w),N(b),v]);return _!==void 0&&y!==void 0?{asum:G[0],gpuTimeMs:_+y}:{asum:G[0]}}finally{!t&&m&&d(m),n&&d(n),u&&d(u),l&&d(l),f&&d(f)}}var ue=64;async function Zt(a,e,r,o){let t=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{asum:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/add"],i=await A(a,[...s,"dasum"]),m=await A(a,[...s,"reduction/sumF64"]),n=null,u=null,l=null,f=null,p=null,c=null,w=null,g=null,h=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:H,lo:W}=Mr(r.map(Math.abs));n=x(H,"dasum-xHi",!1),u=x(W,"dasum-xLo",!1)}l=er(2*ue*4,"dasum-partialsHi"),f=er(2*ue*4,"dasum-partialsLo"),p=xr(4,"dasum-result-hi"),c=xr(4,"dasum-result-lo"),w=D([{value:e,type:"u32"},{value:o,type:"u32"}],"dasum-params");let b=E(i.getBindGroupLayout(0),[n,u,l,f,w]),{commandEncoder:v,ts:_}=L(i,b,2*ue);I(v);let y=E(m.getBindGroupLayout(0),[l,f,p,c]),{commandEncoder:G,ts:M}=L(m,y,1);g=k(G,p),h=k(G,c),I(G);let B=S(g,Float32Array),j=S(h,Float32Array);g=null,h=null;let[R,T,C,F]=await Promise.all([N(_),N(M),B,j]),V=Tr(C,F)[0];return R!==void 0&&T!==void 0?{asum:V,gpuTimeMs:R+T}:{asum:V}}finally{!t&&n&&d(n),!t&&u&&d(u),l&&d(l),f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g),h&&d(h)}}var le=64;async function Qt(a,e,r,o){let t=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{nrm2:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(a,"snrm2"),i=await A(a,"reduction/scaledSum"),m=null,n=null,u=null,l=null,f=null,p=null;try{m=t?r._buf:x(r,"snrm2-x",!1),n=er(2*le*4,"snrm2-partials-scale"),u=er(2*le*4,"snrm2-partials-ssq"),l=xr(4,"snrm2-result"),f=D([{value:e,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let c=E(s.getBindGroupLayout(0),[m,n,u,f]),{commandEncoder:w,ts:g}=L(s,c,2*le);I(w);let h=E(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:b,ts:v}=L(i,h,1);p=k(b,l),I(b);let _=S(p,Float32Array);p=null;let[y,G,M]=await Promise.all([N(g),N(v),_]),B=M[0];return y!==void 0&&G!==void 0?{nrm2:B,gpuTimeMs:y+G}:{nrm2:B}}finally{!t&&m&&d(m),n&&d(n),u&&d(u),l&&d(l),f&&d(f),p&&d(p)}}var me=64;async function Jt(a,e,r,o){let t=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(a,"isamax"),i=await A(a,"reduction/argmax"),m=null,n=null,u=null,l=null,f=null,p=null;try{m=t?r._buf:x(r,"isamax-x",!1),n=er(2*me*4,"isamax-partials-val"),u=er(2*me*4,"isamax-partials-idx"),l=xr(4,"isamax-result"),f=D([{value:e,type:"u32"},{value:o,type:"u32"}],"isamax-params");let c=E(s.getBindGroupLayout(0),[m,n,u,f]),{commandEncoder:w,ts:g}=L(s,c,2*me);I(w);let h=E(i.getBindGroupLayout(0),[n,u,l]),{commandEncoder:b,ts:v}=L(i,h,1);p=k(b,l),I(b);let _=S(p,Uint32Array);p=null;let[y,G,M]=await Promise.all([N(g),N(v),_]),B=M[0];return y!==void 0&&G!==void 0?{index:B,gpuTimeMs:y+G}:{index:B}}finally{!t&&m&&d(m),n&&d(n),u&&d(u),l&&d(l),f&&d(f),p&&d(p)}}var $r=64;async function ro(a,e,r,o){let t=r instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!t&&!(r instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(t&&r.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(e<=0)return{index:0};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],i=await A(a,[...s,"idamax"],"idamax_main"),m=await A(a,[...s,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,l=null,f=null,p=null,c=null,w=null,g=null;try{if(t)n=r._buf,u=r._loBuf;else{let{hi:C,lo:F}=Mr(r);n=x(C,"idamax-xHi",!1),u=x(F,"idamax-xLo",!1)}l=er(2*$r*4,"idamax-partials-val-hi"),f=er(2*$r*4,"idamax-partials-val-lo"),p=er(2*$r*4,"idamax-partials-idx"),c=xr(4,"idamax-result"),w=D([{value:e,type:"u32"},{value:o,type:"u32"}],"idamax-params");let h=E(i.getBindGroupLayout(0),[n,u,l,f,p,w]),{commandEncoder:b,ts:v}=L(i,h,2*$r);I(b);let _=E(m.getBindGroupLayout(0),[l,f,p,c]),{commandEncoder:y,ts:G}=L(m,_,1);g=k(y,c),I(y);let M=S(g,Uint32Array);g=null;let[B,j,R]=await Promise.all([N(v),N(G),M]),T=R[0];return B!==void 0&&j!==void 0?{index:T,gpuTimeMs:B+j}:{index:T}}finally{!t&&n&&d(n),!t&&u&&d(u),l&&d(l),f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function eo(a,e,r,o,t,s,i,m){let n=r instanceof P,u=t instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof i!="number")throw new Error("c must be a number.");if(typeof m!="number")throw new Error("s must be a number.");if(Number.isNaN(i)||Number.isNaN(m))throw new Error("c and s must not be NaN.");if(!Number.isFinite(i))throw new Error("c must be finite.");if(!Number.isFinite(m))throw new Error("s must be finite.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0)return n?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await A(a,"srot"),f=null,p=null,c=null,w=null,g=null;try{f=n?r._buf:x(r,"srot-x",!0),p=u?t._buf:x(t,"srot-y",!0),c=D([{value:e,type:"u32"},{value:i,type:"f32"},{value:m,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"srot-params");let h=E(l.getBindGroupLayout(0),[f,p,c]),{commandEncoder:b,ts:v}=L(l,h,cr(e));w=n?null:k(b,f),g=u?null:k(b,p),I(b);let _=await N(v);if(n&&u)return _!==void 0?{gpuTimeMs:_}:{};let y=S(w,Float32Array),G=S(g,Float32Array);w=null,g=null;let[M,B]=await Promise.all([y,G]);return _!==void 0?{x:M,y:B,gpuTimeMs:_}:{x:M,y:B}}finally{!n&&f&&d(f),!u&&p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function to(a,e,r,o,t,s,i){let m=r instanceof P,n=t instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(!(i instanceof Float32Array)||i.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i[0]!==-2&&i[0]!==-1&&i[0]!==0&&i[0]!==1)throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!m&&!(r instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(t instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(e<=0||i[0]===-2)return m?{}:{x:r,y:t};if(r.length<(e-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(t.length<(e-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(a,"srotm"),l=null,f=null,p=null,c=null,w=null,g=null;try{l=m?r._buf:x(r,"srotm-x",!0),f=n?t._buf:x(t,"srotm-y",!0),p=x(i,"srotm-param",!1),c=D([{value:e,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"srotm-params");let h=E(u.getBindGroupLayout(0),[l,f,p,c]),{commandEncoder:b,ts:v}=L(u,h,cr(e));w=m?null:k(b,l),g=n?null:k(b,f),I(b);let _=await N(v);if(m&&n)return _!==void 0?{gpuTimeMs:_}:{};let y=S(w,Float32Array),G=S(g,Float32Array);w=null,g=null;let[M,B]=await Promise.all([y,G]);return _!==void 0?{x:M,y:B,gpuTimeMs:_}:{x:M,y:B}}finally{!m&&l&&d(l),!n&&f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function oo(a,e,r,o,t,s,i,m,n,u,l,f,p="row-major"){let c=s instanceof q,w=m instanceof P,g=l instanceof P;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof t!="number")throw new Error("alpha must be a number.");if(Number.isNaN(t))throw new Error("alpha must not be NaN.");if(!Number.isFinite(t))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&m._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(s.rows<r||s.cols<o))throw new Error("A is too small for the given m and n.");if(r<0||o<0)throw new Error("m and n must be non-negative.");if(r===0||o===0)return g?{}:{y:l};(c?s.layout:p)==="column-major"&&([r,o]=[o,r],e=e==="no-transpose"?"transpose":"no-transpose");let b=e==="no-transpose",v=b?o:r,_=b?r:o;if(i<o)throw new Error("lda must be >= n.");if(!c&&s.length<(r-1)*i+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(m.length<(v-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(l.length<(_-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let G=await A(a,b?"sgemv_n":"sgemv_t"),M=c?s._buf:x(s,"sgemv-A",!1),B=w?m._buf:x(m,"sgemv-x",!1),j=g?l._buf:x(l,"sgemv-y",!0),R=D([{value:r,type:"u32"},{value:o,type:"u32"},{value:t,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"}],"sgemv-params");try{let T=E(G.getBindGroupLayout(0),[M,B,j,R]),C=b?Math.min(r,a.limits.maxComputeWorkgroupsPerDimension):cr(_),{commandEncoder:F,ts:V}=L(G,T,C),H=g?null:k(F,j);I(F);let W=await N(V);if(g)return W!==void 0?{gpuTimeMs:W}:{};let Q=await S(H,Float32Array);return W!==void 0?{y:Q,gpuTimeMs:W}:{y:Q}}finally{c||d(M),w||d(B),g||d(j),d(R)}}async function ao(a,e,r,o,t,s,i,m,n,u,l,f="row-major"){let p=i instanceof P,c=u instanceof P,w=t instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(m)||!Number.isInteger(l)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(m<=0||l<=0)throw new Error("incx and incy must be positive.");if(s<r)throw new Error("lda must be >= n.");if(!w&&!(t instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&i._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&s!==t.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(t.rows<r||t.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{y:u};if(!w&&t.length<(r-1)*s+r)throw new Error("A does not have enough elements for the given n and lda.");if(i.length<(r-1)*m+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(r-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?t.layout:f)==="column-major"?e==="upper":e==="lower",b=await A(a,"ssymv"),v=null,_=null,y=null,G=null;try{v=w?t._buf:x(t,"ssymv-A",!1),_=p?i._buf:x(i,"ssymv-x",!1),y=c?u._buf:x(u,"ssymv-y",!0),G=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:m,type:"u32"},{value:l,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let M=E(b.getBindGroupLayout(0),[v,_,y,G]),B=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:R}=L(b,M,B),T=c?null:k(j,y);I(j);let C=await N(R);if(c)return C!==void 0?{gpuTimeMs:C}:{};let F=await S(T,Float32Array);return C!==void 0?{y:F,gpuTimeMs:C}:{y:F}}finally{!w&&v&&d(v),!p&&_&&d(_),!c&&y&&d(y),G&&d(G)}}async function so(a,e,r,o,t,s,i,m,n,u,l,f="row-major"){let p=m instanceof P,c=u instanceof P,w=s instanceof q,g=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||l<=0)throw new Error("incx and incy must be positive.");if(i<t)throw new Error("lda must be >= n.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&m._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&c&&s._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(s.rows<t||s.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return c?{}:{y:u};if(!w&&s.length<(t-1)*i+t)throw new Error("A does not have enough elements for the given n and lda.");if(m.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(t-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?s.layout:f)==="column-major",v=b?e==="upper":e==="lower",_=b?r==="transpose":r==="no-transpose",y=await A(a,"strmv"),G=null,M=null,B=null,j=null;try{G=w?s._buf:x(s,"strmv-A",!1),M=p?m._buf:x(m,"strmv-x",!1),B=c?u._buf:x(u,"strmv-y",!0),j=D([{value:t,type:"u32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:i,type:"u32"},{value:_?0:1,type:"u32"},{value:v?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let R=E(y.getBindGroupLayout(0),[G,M,B,j]),T=Math.min(t,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:C,ts:F}=L(y,R,T),V=c?null:k(C,B);I(C);let H=await N(F);if(c)return H!==void 0?{gpuTimeMs:H}:{};let W=await S(V,Float32Array);return H!==void 0?{y:W,gpuTimeMs:H}:{y:W}}finally{!w&&G&&d(G),!p&&M&&d(M),!c&&B&&d(B),j&&d(j)}}var Sr=64;function io(a,e,r){let o=new ArrayBuffer(a*e),t=new DataView(o);for(let s=0;s<a;s++){let i=r(s),m=s*e;i.forEach((n,u)=>t.setUint32(m+u*4,n,!0))}return o}function no(a,e,r){let o=a.createBuffer({label:r,size:e.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return a.queue.writeBuffer(o,0,e),o}async function uo(a,e,r,o,t,s,i,m,n,u="row-major"){let l=m instanceof P,f=s instanceof q,p=o==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(i))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(i<t)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!l)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<t||s.cols<t))throw new Error("A is too small for the given n.");if(t<0)throw new Error("n must be non-negative.");if(t===0)return l?{}:{x:m};if(!f&&s.length<(t-1)*i+t)throw new Error("A does not have enough elements for the given n and lda.");if(m.length<(t-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(f?s.layout:u)==="column-major",g=w?e==="upper":e==="lower",h=w?r==="transpose":r==="no-transpose",b=await A(a,"strsv_invert_block"),v=await A(a,"strsv_apply_inverse"),_=await A(a,"strsv_update"),y=h===g,G=[];for(let W=0;W<t;W+=Sr)G.push(W);y||G.reverse();let M=G.length,B=a.limits.maxComputeWorkgroupsPerDimension,j=a.limits.minUniformBufferOffsetAlignment,R=null,T=null,C=null,F=null,V=null,H=null;try{R=f?s._buf:x(s,"strsv-A",!1),T=l?m._buf:x(m,"strsv-x",!0),C=er(M*Sr*Sr*4,"strsv-Ainv");let W=io(M,j,z=>{let K=z*Sr,X=Math.min(K+Sr,t);return[n,z,K,X]});F=no(a,W,"strsv-apply-params");let Q=io(M,j,z=>{let K=z*Sr,X=Math.min(K+Sr,t);return[t,n,i,h?0:1,g?0:1,K,X]});V=no(a,Q,"strsv-update-params");let{commandEncoder:Y,querySet:J}=yr();H=D([{value:t,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let ur=E(b.getBindGroupLayout(0),[R,C,H]);sr(Y,b,ur,{x:Sr,y:M},J?{timestampWrites:{querySet:J,beginningOfPassWriteIndex:0}}:void 0);for(let z=0;z<G.length;z++){let K=G[z],X=Math.min(K+Sr,t),$=K/Sr,or=z===G.length-1,fr=$*j,ar=E(v.getBindGroupLayout(0),[C,T,{buffer:F,offset:fr,size:16}]);sr(Y,v,ar,1,or&&J?{timestampWrites:{querySet:J,endOfPassWriteIndex:1}}:void 0);let pr=y?t-X:K;if(pr===0)continue;let Er=E(_.getBindGroupLayout(0),[R,T,{buffer:V,offset:fr,size:32}]),_r=Math.min(pr,B);sr(Y,_,Er,_r)}let nr=hr(Y,J),Z=l?null:k(Y,T);I(Y);let rr=await N(nr);if(l)return rr!==void 0?{gpuTimeMs:rr}:{};let U=await S(Z,Float32Array);return rr!==void 0?{x:U,gpuTimeMs:rr}:{x:U}}finally{!f&&R&&d(R),!l&&T&&d(T),C&&d(C),F&&d(F),V&&d(V),H&&d(H)}}async function lo(a,e,r,o,t,s,i,m,n,u,l="row-major"){let f=n instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(e)||!Number.isInteger(r)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(f&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<e||n.cols<r))throw new Error("A is too small for the given m and n.");(f?n.layout:l)==="column-major"&&([e,r]=[r,e],[t,i]=[i,t],[s,m]=[m,s]);let c=t instanceof P,w=i instanceof P;if(u<r)throw new Error("lda must be >= n.");if(!c&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(f&&c&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&w&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(e<0||r<0)throw new Error("m and n must be non-negative.");if(e===0||r===0)return f?{}:{A:n};if(!f&&n.length<(e-1)*u+r)throw new Error("A does not have enough elements for the given m, n, and lda.");if(t.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given m and incx.");if(i.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await A(a,"sger"),h=null,b=null,v=null,_=null;try{h=c?t._buf:x(t,"sger-x",!1),b=w?i._buf:x(i,"sger-y",!1),v=f?n._buf:x(n,"sger-A",!0),_=D([{value:e,type:"u32"},{value:r,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:u,type:"u32"}],"sger-params");let y=E(g.getBindGroupLayout(0),[h,b,v,_]),G=Math.min(e,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:M,ts:B}=L(g,y,G),j=f?null:k(M,v);I(M);let R=await N(B);if(f)return R!==void 0?{gpuTimeMs:R}:{};let T=await S(j,Float32Array);return R!==void 0?{A:T,gpuTimeMs:R}:{A:T}}finally{!c&&h&&d(h),!w&&b&&d(b),!f&&v&&d(v),_&&d(_)}}async function mo(a,e,r,o,t,s,i,m,n="row-major"){let u=t instanceof P,l=i instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(s)||!Number.isInteger(m))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(s<=0)throw new Error("incx must be positive.");if(m<r)throw new Error("lda must be >= n.");if(!l&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!l)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(l&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(l&&u&&i._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(l&&m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(l&&(i.rows<r||i.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return l?{}:{A:i};if(!l&&i.length<(r-1)*m+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(l?i.layout:n)==="column-major"?e==="upper":e==="lower",c=await A(a,"ssyr"),w=null,g=null,h=null;try{w=u?t._buf:x(t,"ssyr-x",!1),g=l?i._buf:x(i,"ssyr-A",!0),h=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let b=E(c.getBindGroupLayout(0),[w,g,h]),v=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:_,ts:y}=L(c,b,v),G=l?null:k(_,g);I(_);let M=await N(y);if(l)return M!==void 0?{gpuTimeMs:M}:{};let B=await S(G,Float32Array);return M!==void 0?{A:B,gpuTimeMs:M}:{A:B}}finally{!u&&w&&d(w),!l&&g&&d(g),h&&d(h)}}async function fo(a,e,r,o,t,s,i,m,n,u,l="row-major"){let f=t instanceof P,p=i instanceof P,c=n instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(r)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(u<r)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(t instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!f)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&f&&n._buf===t._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&p&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&t._buf===i._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<r||n.cols<r))throw new Error("A is too small for the given n.");if(r<0)throw new Error("n must be non-negative.");if(r===0)return c?{}:{A:n};if(!c&&n.length<(r-1)*u+r)throw new Error("A does not have enough elements for the given n and lda.");if(t.length<(r-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(r-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?n.layout:l)==="column-major"?e==="upper":e==="lower",h=await A(a,"ssyr2"),b=null,v=null,_=null,y=null;try{b=f?t._buf:x(t,"ssyr2-x",!1),v=p?i._buf:x(i,"ssyr2-y",!1),_=c?n._buf:x(n,"ssyr2-A",!0),y=D([{value:r,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let G=E(h.getBindGroupLayout(0),[b,v,_,y]),M=Math.min(r,a.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:B,ts:j}=L(h,G,M),R=c?null:k(B,_);I(B);let T=await N(j);if(c)return T!==void 0?{gpuTimeMs:T}:{};let C=await S(R,Float32Array);return T!==void 0?{A:C,gpuTimeMs:T}:{A:C}}finally{!f&&b&&d(b),!p&&v&&d(v),!c&&_&&d(_),y&&d(y)}}var Pa=32,Da=32,Ra=64,Ta=64,ja=36;async function co(a,e,r,o,t,s,i,m,n,u,l,f,p,c,w="row-major"){let g=m instanceof q,h=u instanceof q,b=p instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(l)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(m instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0||s<0)throw new Error("m, n, and k must be non-negative.");if(o===0||t===0)return b?{}:{C:p};let v=g?m.layout:w,_=h?u.layout:w,y=b?p.layout:w,G=v==="column-major"?s:o,M=v==="column-major"?o:s,B=e==="no-transpose"?G:M,j=e==="no-transpose"?M:G;if(n<j)throw new Error(`lda must be >= ${v==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==m.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[rr,U]=e==="no-transpose"?[o,s]:[s,o];if(m.rows<rr||m.cols<U)throw new Error("A is too small for the given m, k, and transA.")}else if(m.length<(B-1)*n+j)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=_==="column-major"?t:s,T=_==="column-major"?s:t,C=r==="no-transpose"?R:T,F=r==="no-transpose"?T:R;if(l<F)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(l!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[rr,U]=r==="no-transpose"?[s,t]:[t,s];if(u.rows<rr||u.cols<U)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(C-1)*l+F)throw new Error("B does not have enough elements for the given dimensions and ldb.");let V=y==="column-major"?t:o,H=y==="column-major"?o:t;if(c<H)throw new Error(`ldc must be >= ${y==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<o||p.cols<t)throw new Error("C is too small for the given m and n.")}else if(p.length<(V-1)*c+H)throw new Error("C does not have enough elements for the given dimensions and ldc.");v==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&([m,u]=[u,m],[g,h]=[h,g],[n,l]=[l,n],[e,r]=[r==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[o,t]=[t,o]);let W=Math.ceil(t/Ta),Q=Math.ceil(o/Ra),Y=W*Q>=ja,J=await A(a,Y?"sgemm_large":"sgemm_small"),ur=g?m._buf:x(m,"sgemm-A",!1),lr=h?u._buf:x(u,"sgemm-B",!1),nr=b?p._buf:x(p,"sgemm-C",!0),Z=D([{value:o,type:"u32"},{value:t,type:"u32"},{value:s,type:"u32"},{value:i,type:"f32"},{value:f,type:"f32"},{value:n,type:"u32"},{value:l,type:"u32"},{value:c,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:r==="transpose"?1:0,type:"u32"}],"sgemm-params");try{let rr=E(J.getBindGroupLayout(0),[ur,lr,nr,Z]),U=Y?{x:Math.min(W,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(t/Da),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Pa),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:z,ts:K}=L(J,rr,U),X=b?null:k(z,nr);I(z);let $=await N(K);if(b)return $!==void 0?{gpuTimeMs:$}:{};let or=await S(X,Float32Array);return $!==void 0?{C:or,gpuTimeMs:$}:{C:or}}finally{g||d(ur),h||d(lr),b||d(nr),d(Z)}}var Ca=32,La=32,Wa=64,Fa=64,qa=36;async function po(a,e,r,o,t,s,i,m,n,u,l,f,p,c,w,g="row-major"){let h=n instanceof q,b=l instanceof q,v=c instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(t)||!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!v&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!v)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(v&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(t<0||s<0||i<0)throw new Error("m, n, and k must be non-negative.");if(t===0||s===0)return v?{}:{C:c};let _=h?n.layout:g,y=b?l.layout:g,G=v?c.layout:g,M=_==="column-major"?i:t,B=_==="column-major"?t:i,j=r==="no-transpose"?M:B,R=r==="no-transpose"?B:M;if(u<R)throw new Error(`lda must be >= ${_==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[U,z]=r==="no-transpose"?[t,i]:[i,t];if(n.rows<U||n.cols<z)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(j-1)*u+R)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=y==="column-major"?s:i,C=y==="column-major"?i:s,F=o==="no-transpose"?T:C,V=o==="no-transpose"?C:T;if(f<V)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(f!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[U,z]=o==="no-transpose"?[i,s]:[s,i];if(l.rows<U||l.cols<z)throw new Error("B is too small for the given n, k, and transB.")}else if(l.length<(F-1)*f+V)throw new Error("B does not have enough elements for the given dimensions and ldb.");let H=G==="column-major"?s:t,W=G==="column-major"?t:s;if(w<W)throw new Error(`ldc must be >= ${G==="column-major"?"rows":"cols"} of C as stored.`);if(v){if(w!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<t||c.cols<s)throw new Error("C is too small for the given m and n.")}else if(c.length<(H-1)*w+W)throw new Error("C does not have enough elements for the given dimensions and ldc.");_==="column-major"&&(r=r==="no-transpose"?"transpose":"no-transpose"),y==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),G==="column-major"&&([n,l]=[l,n],[h,b]=[b,h],[u,f]=[f,u],[r,o]=[o==="no-transpose"?"transpose":"no-transpose",r==="no-transpose"?"transpose":"no-transpose"],[t,s]=[s,t],e=e==="lower"?"upper":"lower");let Q=Math.ceil(s/Fa),Y=Math.ceil(t/Wa),J=Q*Y>=qa,ur=await A(a,J?"sgemmtr_large":"sgemmtr_small"),lr=h?n._buf:x(n,"sgemmtr-A",!1),nr=b?l._buf:x(l,"sgemmtr-B",!1),Z=v?c._buf:x(c,"sgemmtr-C",!0),rr=D([{value:t,type:"u32"},{value:s,type:"u32"},{value:i,type:"u32"},{value:m,type:"f32"},{value:p,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:w,type:"u32"},{value:r==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:e==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let U=E(ur.getBindGroupLayout(0),[lr,nr,Z,rr]),z=J?{x:Math.min(Q,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(s/La),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(t/Ca),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:K,ts:X}=L(ur,U,z),$=v?null:k(K,Z);I(K);let or=await N(X);if(v)return or!==void 0?{gpuTimeMs:or}:{};let fr=await S($,Float32Array);return or!==void 0?{C:fr,gpuTimeMs:or}:{C:fr}}finally{h||d(lr),b||d(nr),v||d(Z),d(rr)}}var Ua=32,Oa=32,Va=64,Ha=64,Ka=36;async function wo(a,e,r,o,t,s,i,m,n,u,l,f="row-major"){let p=i instanceof q,c=u instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(m)||!Number.isInteger(l))throw new Error("n, k, lda, and ldc must be integers.");if(!p&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(p&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!p)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return c?{}:{C:u};let w=p?i.layout:f,g=c?u.layout:f,h=w==="column-major"?t:o,b=w==="column-major"?o:t,v=r==="no-transpose"?h:b,_=r==="no-transpose"?b:h;if(m<_)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[W,Q]=r==="no-transpose"?[o,t]:[t,o];if(i.rows<W||i.cols<Q)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(v-1)*m+_)throw new Error("A does not have enough elements for the given dimensions and lda.");if(l<o)throw new Error("ldc must be >= n.");if(c){if(l!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<o||u.cols<o)throw new Error("C is too small for the given n.")}else if(u.length<(o-1)*l+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let y=r;w==="column-major"&&(y=y==="no-transpose"?"transpose":"no-transpose");let G=y==="no-transpose"?"transpose":"no-transpose",M=e;g==="column-major"&&([y,G]=[G==="no-transpose"?"transpose":"no-transpose",y==="no-transpose"?"transpose":"no-transpose"],M=M==="lower"?"upper":"lower");let B=Math.ceil(o/Ha),j=Math.ceil(o/Va),R=B*j>=Ka,T=await A(a,R?"sgemmtr_large":"sgemmtr_small"),C=p?i._buf:x(i,"ssyrk-A",!1),F=c?u._buf:x(u,"ssyrk-C",!0),V=p?er(C.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(i,"ssyrk-B",!1),H=D([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:m,type:"u32"},{value:m,type:"u32"},{value:l,type:"u32"},{value:y==="transpose"?1:0,type:"u32"},{value:G==="transpose"?1:0,type:"u32"},{value:M==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let W=E(T.getBindGroupLayout(0),[C,V,F,H]),Q=R?{x:Math.min(B,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(j,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Oa),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/Ua),a.limits.maxComputeWorkgroupsPerDimension)},{commandEncoder:Y,querySet:J,passDescriptor:ur}=yr();p&&Y.copyBufferToBuffer(C,0,V,0,C.size),sr(Y,T,W,Q,ur);let lr=hr(Y,J),nr=c?null:k(Y,F);I(Y);let Z=await N(lr);if(c)return Z!==void 0?{gpuTimeMs:Z}:{};let rr=await S(nr,Float32Array);return Z!==void 0?{C:rr,gpuTimeMs:Z}:{C:rr}}finally{p||d(C),d(V),c||d(F),d(H)}}var za=32,Ya=32,Xa=64,$a=64,Za=36;async function go(a,e,r,o,t,s,i,m,n,u,l,f,p,c="row-major"){let w=i instanceof q,g=n instanceof q,h=f instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(r!=="no-transpose"&&r!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(m)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("n and k must be non-negative.");if(o===0)return h?{}:{C:f};let b=w?i.layout:c,v=g?n.layout:c,_=h?f.layout:c,y=b==="column-major"?t:o,G=b==="column-major"?o:t,M=r==="no-transpose"?y:G,B=r==="no-transpose"?G:y;if(m<B)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[X,$]=r==="no-transpose"?[o,t]:[t,o];if(i.rows<X||i.cols<$)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(M-1)*m+B)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=v==="column-major"?t:o,R=v==="column-major"?o:t,T=r==="no-transpose"?j:R,C=r==="no-transpose"?R:j;if(u<C)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[X,$]=r==="no-transpose"?[o,t]:[t,o];if(n.rows<X||n.cols<$)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(T-1)*u+C)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(p<o)throw new Error("ldc must be >= n.");if(h){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<o)throw new Error("C is too small for the given n.")}else if(f.length<(o-1)*p+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let F=r;b==="column-major"&&(F=F==="no-transpose"?"transpose":"no-transpose");let V=r;v==="column-major"&&(V=V==="no-transpose"?"transpose":"no-transpose");let H=_==="column-major"?e==="lower"?"upper":"lower":e,W=X=>X==="no-transpose"?"transpose":"no-transpose";function Q(X,$,or,fr,ar,ir){let pr=X,Er=W(fr);return _!=="column-major"?{transX:pr,X:$,ldX:or,transY:Er,Y:ar,ldY:ir}:{transX:W(Er),X:ar,ldX:ir,transY:W(pr),Y:$,ldY:or}}let Y=Math.ceil(o/$a),J=Math.ceil(o/Xa),ur=Y*J>=Za,lr=await A(a,ur?"sgemmtr_large":"sgemmtr_small"),nr=ur?{x:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(o/Ya),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(o/za),a.limits.maxComputeWorkgroupsPerDimension)},Z=w?i._buf:x(i,"ssyr2k-A",!1),rr=g?n._buf:x(n,"ssyr2k-B",!1),U=h?f._buf:x(f,"ssyr2k-C",!0),z=null,K=null;try{let X=Q(F,Z,m,V,rr,u),$=Q(V,rr,u,F,Z,m),or=(Gr,gr)=>D([{value:o,type:"u32"},{value:o,type:"u32"},{value:t,type:"u32"},{value:s,type:"f32"},{value:gr,type:"f32"},{value:Gr.ldX,type:"u32"},{value:Gr.ldY,type:"u32"},{value:p,type:"u32"},{value:Gr.transX==="transpose"?1:0,type:"u32"},{value:Gr.transY==="transpose"?1:0,type:"u32"},{value:H==="upper"?1:0,type:"u32"}],"ssyr2k-params");z=or(X,l),K=or($,1);let fr=E(lr.getBindGroupLayout(0),[X.X,X.Y,U,z]),ar=E(lr.getBindGroupLayout(0),[$.X,$.Y,U,K]),{commandEncoder:ir,querySet:pr}=yr(),Er=pr?{timestampWrites:{querySet:pr,beginningOfPassWriteIndex:0}}:void 0,_r=pr?{timestampWrites:{querySet:pr,endOfPassWriteIndex:1}}:void 0;sr(ir,lr,fr,nr,Er),sr(ir,lr,ar,nr,_r);let Br=hr(ir,pr),br=h?null:k(ir,U);I(ir);let wr=await N(Br);if(h)return wr!==void 0?{gpuTimeMs:wr}:{};let dr=await S(br,Float32Array);return wr!==void 0?{C:dr,gpuTimeMs:wr}:{C:dr}}finally{w||d(Z),g||d(rr),h||d(U),z&&d(z),K&&d(K)}}var Qa=32,Ja=32,rs=64,es=64,ts=36,bo=8;async function ho(a,e,r,o,t,s,i,m,n,u,l,f,p,c="row-major"){let w=i instanceof q,g=n instanceof q,h=f instanceof q;if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(t)||!Number.isInteger(m)||!Number.isInteger(u)||!Number.isInteger(p))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||t<0)throw new Error("m and n must be non-negative.");if(o===0||t===0)return h?{}:{C:f};let b=w?i.layout:c,v=g?n.layout:c,_=h?f.layout:c,y=e==="left"?o:t;if(m<y)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(w){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(i.rows<y||i.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(i.length<(y-1)*m+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let G=v==="column-major"?t:o,M=v==="column-major"?o:t;if(u<M)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<o||n.cols<t)throw new Error("B is too small for the given m and n.")}else if(n.length<(G-1)*u+M)throw new Error("B does not have enough elements for the given dimensions and ldb.");let B=_==="column-major"?t:o,j=_==="column-major"?o:t;if(p<j)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<t)throw new Error("C is too small for the given m and n.")}else if(f.length<(B-1)*p+j)throw new Error("C does not have enough elements for the given dimensions and ldc.");let R=b==="column-major"?r==="lower"?"upper":"lower":r,T=v==="column-major"?"transpose":"no-transpose",C="no-transpose",F=o,V=t,H=y,W=e==="left"?C:T,Q=e==="left"?T:C,Y=ir=>ir==="no-transpose"?"transpose":"no-transpose",J=e==="right";_==="column-major"&&([W,Q]=[Y(Q),Y(W)],J=!J,[F,V]=[V,F]);let ur=y,lr=Math.ceil(V/es),nr=Math.ceil(F/rs),Z=lr*nr>=ts,rr=await A(a,Z?"sgemm_large":"sgemm_small"),U=await A(a,"symmetrize"),z=Z?{x:Math.min(lr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(nr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(V/Ja),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(F/Qa),a.limits.maxComputeWorkgroupsPerDimension)},K=w?i._buf:x(i,"ssymm-A",!1),X=g?n._buf:x(n,"ssymm-B",!1),$=h?f._buf:x(f,"ssymm-C",!0),or=er(y*ur*4,"ssymm-Adense"),fr=null,ar=null;try{fr=D([{value:y,type:"u32"},{value:m,type:"u32"},{value:ur,type:"u32"},{value:R==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let ir=E(U.getBindGroupLayout(0),[K,or,fr]),pr=J?X:or,Er=J?u:ur,_r=J?or:X;ar=D([{value:F,type:"u32"},{value:V,type:"u32"},{value:H,type:"u32"},{value:s,type:"f32"},{value:l,type:"f32"},{value:Er,type:"u32"},{value:J?ur:u,type:"u32"},{value:p,type:"u32"},{value:W==="transpose"?1:0,type:"u32"},{value:Q==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let br=E(rr.getBindGroupLayout(0),[pr,_r,$,ar]),{commandEncoder:wr,querySet:dr}=yr(),Gr=dr?{timestampWrites:{querySet:dr,beginningOfPassWriteIndex:0}}:void 0,gr=dr?{timestampWrites:{querySet:dr,endOfPassWriteIndex:1}}:void 0;sr(wr,U,ir,{x:Math.ceil(y/bo),y:Math.ceil(y/bo)},Gr),sr(wr,rr,br,z,gr);let kr=hr(wr,dr),Nr=h?null:k(wr,$);I(wr);let Rr=await N(kr);if(h)return Rr!==void 0?{gpuTimeMs:Rr}:{};let Or=await S(Nr,Float32Array);return Rr!==void 0?{C:Or,gpuTimeMs:Rr}:{C:Or}}finally{w||d(K),g||d(X),h||d($),d(or),fr&&d(fr),ar&&d(ar)}}var os=32,as=32,ss=64,is=64,ns=36,vo=8;async function xo(a,e,r,o,t,s,i,m,n,u,l,f,p="row-major"){let c=n instanceof q,w=l instanceof q,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:l};let h=c?n.layout:p,b=w?l.layout:p,v=e==="left"?s:i;if(u<v)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<v||n.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(v-1)*u+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,y=b==="column-major"?s:i;if(f<y)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(l.rows<s||l.cols<i)throw new Error("B is too small for the given m and n.")}else if(l.length<(_-1)*f+y)throw new Error("B does not have enough elements for the given dimensions and ldb.");let G=h==="column-major"?r==="lower"?"upper":"lower":r,M=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,B=b==="column-major"?"transpose":"no-transpose",j="no-transpose",R=s,T=i,C=v,F=e==="left"?j:B,V=e==="left"?B:j,H=fr=>fr==="no-transpose"?"transpose":"no-transpose",W=e==="right";b==="column-major"&&([F,V]=[H(V),H(F)],W=!W,[R,T]=[T,R]);let Q=v,Y=Math.ceil(T/is),J=Math.ceil(R/ss),ur=Y*J>=ns,lr=await A(a,ur?"sgemm_large":"sgemm_small"),nr=await A(a,"triangularize"),Z=ur?{x:Math.min(Y,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(J,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(T/as),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(R/os),a.limits.maxComputeWorkgroupsPerDimension)},rr=c?n._buf:x(n,"strmm-A",!1),U=w?l._buf:x(l,"strmm-B",!0),z=er(v*Q*4,"strmm-Adense"),K=er(_*f*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),X=null,$=null,or=!1;try{X=D([{value:v,type:"u32"},{value:u,type:"u32"},{value:Q,type:"u32"},{value:G==="upper"?1:0,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let fr=E(nr.getBindGroupLayout(0),[rr,z,X]),ar=W?U:z,ir=W?f:Q,pr=W?z:U;$=D([{value:R,type:"u32"},{value:T,type:"u32"},{value:C,type:"u32"},{value:m,type:"f32"},{value:0,type:"f32"},{value:ir,type:"u32"},{value:W?Q:f,type:"u32"},{value:f,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:V==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let _r=E(lr.getBindGroupLayout(0),[ar,pr,K,$]),{commandEncoder:Br,querySet:br}=yr();Br.copyBufferToBuffer(U,0,K,0,Math.min(U.size,K.size));let wr=br?{timestampWrites:{querySet:br,beginningOfPassWriteIndex:0}}:void 0,dr=br?{timestampWrites:{querySet:br,endOfPassWriteIndex:1}}:void 0;sr(Br,nr,fr,{x:Math.ceil(v/vo),y:Math.ceil(v/vo)},wr),sr(Br,lr,_r,Z,dr);let Gr=hr(Br,br),gr=w?null:k(Br,K);I(Br);let kr=await N(Gr);if(w)return d(l._buf),l._buf=K,or=!0,kr!==void 0?{gpuTimeMs:kr}:{};let Nr=await S(gr,Float32Array);return kr!==void 0?{B:Nr,gpuTimeMs:kr}:{B:Nr}}finally{c||d(rr),w||d(U),d(z),or||d(K),X&&d(X),$&&d($)}}var vr=64,yo=32,_o=32,Bo=64,Eo=64,Go=36;async function Ao(a,e,r,o,t,s,i,m,n,u,l,f,p="row-major"){let c=n instanceof q,w=l instanceof q,g=t==="unit";if(!(a instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(e!=="left"&&e!=="right")throw new Error("side must be 'left' or 'right'.");if(r!=="lower"&&r!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&t!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:l};let h=c?n.layout:p,b=w?l.layout:p,v=e==="left"?s:i;if(u<v)throw new Error("lda must be >= "+(e==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<v||n.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(v-1)*u+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,y=b==="column-major"?s:i;if(f<y)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(l.rows<s||l.cols<i)throw new Error("B is too small for the given m and n.")}else if(l.length<(_-1)*f+y)throw new Error("B does not have enough elements for the given dimensions and ldb.");let G=h==="column-major"?r==="lower"?"upper":"lower":r,M=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,B=e==="left"?i:s,j=e==="left",R=M==="no-transpose"==(G==="lower"),T=e==="left"?R:!R,C=[];for(let U=0;U<v;U+=vr)C.push(U);T||C.reverse();let F=C.length,V=await A(a,"strsv_invert_block"),H=await A(a,"block_transfer"),W=await A(a,"sscal"),Q=c?n._buf:x(n,"strsm-A",!1),Y=w?l._buf:x(l,"strsm-B",!0),J=er(F*vr*vr*4,"strsm-Ainv"),ur=[],lr=[];function nr(U,z){let K=er(U,z);return lr.push(K),K}function Z(U,z){let K=D(U,z);return ur.push(K),K}let rr=(_-1)*f+y;try{let U=null;if(m!==1){let br=Z([{value:rr,type:"u32"},{value:m,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");U=E(W.getBindGroupLayout(0),[Y,br])}let z=Z([{value:v,type:"u32"},{value:u,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:G==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),K=E(V.getBindGroupLayout(0),[Q,J,z]),X=nr(vr*B*4,"strsm-Bblock"),$=nr(vr*B*4,"strsm-Xblock"),or=nr(v*vr*4,"strsm-Aoff"),fr=nr(v*B*4,"strsm-delta"),{commandEncoder:ar,querySet:ir}=yr();if(m===0){let br=ir?{timestampWrites:{querySet:ir,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0;sr(ar,W,U,cr(rr),br)}else{U&&sr(ar,W,U,cr(rr)),sr(ar,V,K,{x:vr,y:F},ir?{timestampWrites:{querySet:ir,beginningOfPassWriteIndex:0}}:void 0);for(let wr=0;wr<C.length;wr++){let dr=C[wr],Gr=Math.min(dr+vr,v),gr=Gr-dr,kr=dr/vr,Nr=wr===C.length-1,Rr=Z([{value:dr,type:"u32"},{value:gr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),Or=E(H.getBindGroupLayout(0),[X,Y,Rr]);sr(ar,H,Or,cr(gr,B));{let Ir=gr,Pr=B,Zr=gr,Cr=Math.ceil(Pr/Eo),Lr=Math.ceil(Ir/Bo),Wr=Cr*Lr>=Go,Fr=await A(a,Wr?"sgemm_large":"sgemm_small"),Qr=Z([{value:Ir,type:"u32"},{value:Pr,type:"u32"},{value:Zr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:vr,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:e==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),Jr=E(Fr.getBindGroupLayout(0),[{buffer:J,offset:kr*vr*vr*4,size:vr*vr*4},X,$,Qr]),re=Wr?{x:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Lr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Pr/_o),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Ir/yo),a.limits.maxComputeWorkgroupsPerDimension)};sr(ar,Fr,Jr,re)}let Vr=T?Gr:0,fe=T?v:dr,ce=Vr<fe,So=Z([{value:dr,type:"u32"},{value:gr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),ko=E(H.getBindGroupLayout(0),[$,Y,So]),Mo=Nr&&!ce&&ir?{timestampWrites:{querySet:ir,endOfPassWriteIndex:1}}:void 0;if(sr(ar,H,ko,cr(gr,B),Mo),!ce)continue;let jr=fe-Vr,No=Z([{value:Vr,type:"u32"},{value:jr,type:"u32"},{value:dr,type:"u32"},{value:gr,type:"u32"},{value:u,type:"u32"},{value:M==="transpose"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),Io=E(H.getBindGroupLayout(0),[or,Q,No]);sr(ar,H,Io,cr(jr,gr));{let Ir=jr,Pr=B,Zr=gr,Cr=Math.ceil(Pr/Eo),Lr=Math.ceil(Ir/Bo),Wr=Cr*Lr>=Go,Fr=await A(a,Wr?"sgemm_large":"sgemm_small"),Qr=Z([{value:Ir,type:"u32"},{value:Pr,type:"u32"},{value:Zr,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:gr,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),Jr=E(Fr.getBindGroupLayout(0),[or,$,fr,Qr]),re=Wr?{x:Math.min(Cr,a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Lr,a.limits.maxComputeWorkgroupsPerDimension)}:{x:Math.min(Math.ceil(Pr/_o),a.limits.maxComputeWorkgroupsPerDimension),y:Math.min(Math.ceil(Ir/yo),a.limits.maxComputeWorkgroupsPerDimension)};sr(ar,Fr,Jr,re)}let Po=Z([{value:Vr,type:"u32"},{value:jr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),Do=E(H.getBindGroupLayout(0),[fr,Y,Po]),Ro=Nr&&ir?{timestampWrites:{querySet:ir,endOfPassWriteIndex:1}}:void 0;sr(ar,H,Do,cr(jr,B),Ro)}}let pr=hr(ar,ir),Er=w?null:k(ar,Y);I(ar);let _r=await N(pr);if(w)return _r!==void 0?{gpuTimeMs:_r}:{};let Br=await S(Er,Float32Array);return _r!==void 0?{B:Br,gpuTimeMs:_r}:{B:Br}}finally{c||d(Q),w||d(Y),d(J),d(lr),d(ur)}}return Fo(us);})();
