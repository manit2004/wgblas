var wgblas=(()=>{var Uo=Object.create;var se=Object.defineProperty;var Ko=Object.getOwnPropertyDescriptor;var Vo=Object.getOwnPropertyNames;var zo=Object.getPrototypeOf,Ho=Object.prototype.hasOwnProperty;var ie=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var U=(r,t,e)=>()=>{if(e)throw e[0];try{return r&&(t=r(r=0)),t}catch(a){throw e=[a],a}};var Ge=(r,t)=>{for(var e in t)se(r,e,{get:t[e],enumerable:!0})},Se=(r,t,e,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Vo(t))!Ho.call(r,o)&&o!==e&&se(r,o,{get:()=>t[o],enumerable:!(a=Ko(t,o))||a.enumerable});return r};var ne=(r,t,e)=>(e=r!=null?Uo(zo(r)):{},Se(t||!r||!r.__esModule?se(e,"default",{value:r,enumerable:!0}):e,r)),Yo=r=>Se(se({},"__esModule",{value:!0}),r);var be,We=U(()=>{be=`// sscal: x = alpha * x

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
`});var qe,Fe=U(()=>{qe=`// sswap: x <-> y

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
`});var Ue,Oe=U(()=>{Ue=`// saxpy: y = alpha * x + y

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
`});var Ve,Ke=U(()=>{Ve=`// scopy: y = x

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
`});var He,ze=U(()=>{He=`// sdot: result = sum(x[i] * y[i])
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
`});var he,Ye=U(()=>{he=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var $e,Xe=U(()=>{$e=`// sasum: result = sum(|x[i]|)
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
`});var Qe,Ze=U(()=>{Qe=`// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
`});var rt,Je=U(()=>{rt=`// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
`});var tt,et=U(()=>{tt=`// isamax: returns index of element with largest absolute value
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
`});var at,ot=U(()=>{at=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var ue,st=U(()=>{ue=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var ye,it=U(()=>{ye=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var xe,nt=U(()=>{xe=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var lt,ut=U(()=>{lt=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var ve,ft=U(()=>{ve=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var ct,mt=U(()=>{ct=`// Requires f64/dekker.wgsl concatenated first for the DD struct, and
// f64/utils/add.wgsl for fsub/negf (bitcast-based subtraction/negation) and,
// for ddMulProtected at the bottom, fastTwoSumProtected.
//
// Use twoProdBit \u2014 verified universal (0 corrupting failures across 3000+
// random trials on NVIDIA/Intel-Mesa-ANV/llvmpipe), no barrier protection
// needed. The classic approaches below (twoProd, twoProdFma) each fail on
// one backend in a way barrier materialization doesn't fix; twoProdBit
// sidesteps the bug instead by deriving the split via bitcast+bitmask
// rather than an arithmetic identity, leaving nothing for a reassociating
// compiler to fold. Intel Mesa ANV shows frequent last-bit-only diffs from
// strict ground truth (never data-corrupting) \u2014 consistent with the driver
// legitimately auto-fusing \`x - y*z\` into hardware FMA.
const SPLIT_CONST: f32 = 4097.0;

fn bitSplit(a: f32) -> DD {
  let bits = bitcast<u32>(a);
  // Top 11 mantissa bits, so hi carries 12 significant bits with the implicit
  // leading 1 \u2014 the halves are multiplied pairwise and f32 holds 24, so a
  // wider split rounds those products and the "exact" error term goes wrong.
  // Matches SPLIT_CONST = 2^12+1 used by the Veltkamp path below.
  let hiBits = bits & 0xFFFFF000u;
  let hi = bitcast<f32>(hiBits);
  let lo = fsub(a, hi); // exact by Sterbenz's lemma (hi, a share an exponent, are close)
  return DD(hi, lo);
}

fn twoProdBit(a: f32, b: f32) -> DD {
  let s = a * b;
  let aSplit = bitSplit(a);
  let bSplit = bitSplit(b);
  let e = fsub(fsub(fsub(fsub(s, aSplit.hi * bSplit.hi), aSplit.lo * bSplit.hi), aSplit.hi * bSplit.lo), aSplit.lo * bSplit.lo);
  return DD(s, negf(e));
}

// \u2500\u2500 Unsafe historical reference \u2014 do not use \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Both broken on one backend, confirmed via isolated cross-driver testing,
// NOT fixed by barrier materialization (unlike addition's bug):
//   - veltkampSplit/twoProd (Dekker's original): fails on NVIDIA \u2014 compiler
//     folds \`hi = c - (c - a)\` to \`= a\` straight through fsub/negf, even
//     with every intermediate barrier-materialized (11/11 fail, worse than
//     unprotected's 6/11).
//   - twoProdFma (Ogita/Rump/Oishi): fails on llvmpipe \u2014 its software fma()
//     likely isn't genuinely fused, making \`fma(a,b,-(a*b))\` correctly (not
//     buggily) zero. Materializing \`s\` doesn't change this.
fn veltkampSplit(a: f32) -> DD {
  let c = SPLIT_CONST * a;
  let big = fsub(c, a);
  let hi = fsub(c, big);
  let lo = fsub(a, hi);
  return DD(hi, lo);
}

fn twoProd(a: f32, b: f32) -> DD {
  let s = a * b;
  let aSplit = veltkampSplit(a);
  let bSplit = veltkampSplit(b);
  let e = fsub(fsub(fsub(fsub(s, aSplit.hi * bSplit.hi), aSplit.lo * bSplit.hi), aSplit.hi * bSplit.lo), aSplit.lo * bSplit.lo);
  return DD(s, negf(e));
}

fn twoProdFma(a: f32, b: f32) -> DD {
  let s = a * b;
  let e = fma(a, b, negf(s));
  return DD(s, e);
}

// DD \xD7 DD product (Dekker/Bailey): twoProdBit(a.hi, b.hi) already captures
// the dominant term to full DD precision, and the cross terms are below the
// ~48-bit floor anyway, so folding them in with plain f32 loses nothing \u2014
// only the final renormalization needs barrier protection. Split into
// ddMulRaw (unprotected) and ddMulProtected (renormalizes via
// fastTwoSumProtected) so callers with several products can batch them
// through one shared barrier. ddMulRaw's result isn't a valid DD pair on
// its own \u2014 it must be renormalized before use.
fn ddMulRaw(a: DD, b: DD) -> DD {
  let p = twoProdBit(a.hi, b.hi);
  let crossAndLo = p.lo + (a.hi * b.lo + a.lo * b.hi);
  return DD(p.hi, crossAndLo);
}

fn ddMulProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let raw = ddMulRaw(a, b);
  return fastTwoSumProtected(raw.hi, raw.lo, threadSlot);
}
`});var dt,pt=U(()=>{dt=`// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
// dasum.wgsl, which this mirrors closely \u2014 the only structural difference is
// a second input vector and a product where dasum takes an absolute value.
//
// See f64/utils/add.wgsl for ddAddProtected and why plain ddAdd isn't safe,
// and f64/utils/multiply.wgsl for ddMulProtected. The multiply itself
// (twoProdBit) needs no barrier; only its final renormalisation does, which
// is why each element costs two protected ops here against dasum's one.

@group(0) @binding(0) var<storage, read>       xHi:        array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:        array<f32>;
@group(0) @binding(2) var<storage, read>       yHi:        array<f32>;
@group(0) @binding(3) var<storage, read>       yLo:        array<f32>;
@group(0) @binding(4) var<storage, read_write> partialsHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> partialsLo: array<f32>;
@group(0) @binding(6) var<uniform>             params:     Params;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn ddot_main(
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
  // itself (the protected ops' barriers need a provably-uniform loop bound).
  let mainIters = n4_floor / (4u * stride);
  for (var iter = 0u; iter < mainIters; iter++) {
    let id =  gid.x + iter * 4u * stride;
    let d0 =  id;
    let d1 =  id +      stride;
    let d2 =  id + 2u * stride;
    let d3 =  id + 3u * stride;

    let p0 = ddMulProtected(DD(xHi[d0 * params.x_inc], xLo[d0 * params.x_inc]),
                            DD(yHi[d0 * params.y_inc], yLo[d0 * params.y_inc]), lid.x);
    let p1 = ddMulProtected(DD(xHi[d1 * params.x_inc], xLo[d1 * params.x_inc]),
                            DD(yHi[d1 * params.y_inc], yLo[d1 * params.y_inc]), lid.x);
    let p2 = ddMulProtected(DD(xHi[d2 * params.x_inc], xLo[d2 * params.x_inc]),
                            DD(yHi[d2 * params.y_inc], yLo[d2 * params.y_inc]), lid.x);
    let p3 = ddMulProtected(DD(xHi[d3 * params.x_inc], xLo[d3 * params.x_inc]),
                            DD(yHi[d3 * params.y_inc], yLo[d3 * params.y_inc]), lid.x);

    acc0 = ddAddProtected(acc0, p0, lid.x);
    acc1 = ddAddProtected(acc1, p1, lid.x);
    acc2 = ddAddProtected(acc2, p2, lid.x);
    acc3 = ddAddProtected(acc3, p3, lid.x);
  }

  // Tail is ragged (0-3 extra per thread) \u2014 pad to this workgroup's worst case.
  // Out-of-range lanes still run the multiply (it carries a barrier, so every
  // thread must reach it) against index 0, then mask the result to zero.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n4_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n4_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id    = n4_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let ix    = select(0u, id * params.x_inc, valid);
    let iy    = select(0u, id * params.y_inc, valid);
    let prod  = ddMulProtected(DD(xHi[ix], xLo[ix]), DD(yHi[iy], yLo[iy]), lid.x);
    // select() has no DD overload
    let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
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
`});var gt,wt=U(()=>{gt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var ht,bt=U(()=>{ht=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var xt,yt=U(()=>{xt=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var _t,vt=U(()=>{_t=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var At,Bt=U(()=>{At=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Gt,Et=U(()=>{Gt=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var kt,St=U(()=>{kt=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Mt,Nt=U(()=>{Mt=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var Pt,Dt=U(()=>{Pt=`// ssymv: y = alpha * A * x + beta * y
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
`});var Rt,It=U(()=>{Rt=`// strmv: y = op(A) * x
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
`});var _e,Tt=U(()=>{_e=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var Ct,Lt=U(()=>{Ct=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Wt,jt=U(()=>{Wt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var qt,Ft=U(()=>{qt=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Ut,Ot=U(()=>{Ut=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var Vt,Kt=U(()=>{Vt=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var re,zt=U(()=>{re=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_large.wgsl).
// BM=BN=32, BK=8, TM=TN=2 \u2014 wins over the large tile below a 6x6=36
// workgroup grid of 64-tiles, where the large tile doesn't have enough
// workgroups to fill the GPU. Same structure as sgemm_large.wgsl (2D
// register-blocked, shared-memory-tiled), just smaller.
//
// A and B are bound twice \u2014 scalar array<f32> and array<vec4<f32>> views of
// the same GPUBuffer (see vec4ViewBinding) \u2014 so each tile load can issue
// 16-byte vector reads along op(A)/op(B)'s contiguous dimension when the
// stride allows it (stride % 4 == 0 keeps every row base 16-byte aligned).
// NUM_THREADS (256) exceeds some small-tile load shapes, so the vectorized
// paths whose lane count doesn't tile exactly guard their As/Bs stores.
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

@group(0) @binding(0) var<storage, read>       A:  array<f32>;
@group(0) @binding(1) var<storage, read>       A4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       B:  array<f32>;
@group(0) @binding(3) var<storage, read>       B4: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> C:  array<f32>;

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
  useVecA: u32, // 1 = A's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = B's vec4 view covers every in-bounds element
}

@group(0) @binding(5) var<uniform> params: Params;

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
    // \u2500\u2500 Load the BM\xD7BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) \u2500\u2500
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // spans BM/4\xD7(BK/4) several times over \u2014 guard the store.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      if (r4 < BM) {
        let gRow = blockRow + r4;
        let gCol = t * BK + c4 * 4u;
        var v = A4[(gRow * params.lda + gCol) / 4u];
        let rowOK = gRow < params.m;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.k);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.k);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.k);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.k);
        As[r4 * BK + c4 * 4u]      = v.x;
        As[r4 * BK + c4 * 4u + 1u] = v.y;
        As[r4 * BK + c4 * 4u + 2u] = v.z;
        As[r4 * BK + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. NUM_THREADS over-spans
      // the BK-column tile \u2014 guard the store.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      if (c < BK) {
        let gRow = blockRow + r4 * 4u;
        let gCol = t * BK + c;
        var v = A4[(gCol * params.lda + gRow) / 4u];
        let colOK = gCol < params.k;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
        As[(r4 * 4u) * BK + c]      = v.x;
        As[(r4 * 4u + 1u) * BK + c] = v.y;
        As[(r4 * 4u + 2u) * BK + c] = v.z;
        As[(r4 * 4u + 3u) * BK + c] = v.w;
      }
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
      }
    }

    // \u2500\u2500 Load the BK\xD7BN B tile into Bs \u2500\u2500
    if (params.useVecB == 1u && params.transB == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // over-spans the BK-row tile \u2014 guard the store.
      let r  = tid / (BN / 4u);
      let c4 = tid % (BN / 4u);
      if (r < BK) {
        let gRow = t * BK + r;
        let gCol = blockCol + c4 * 4u;
        var v = B4[(gRow * params.ldb + gCol) / 4u];
        let rowOK = gRow < params.k;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.n);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.n);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.n);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.n);
        Bs[r * BN + c4 * 4u]      = v.x;
        Bs[r * BN + c4 * 4u + 1u] = v.y;
        Bs[r * BN + c4 * 4u + 2u] = v.z;
        Bs[r * BN + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column, one vec4 per thread \u2014
      // NUM_THREADS over-spans the 32-column tile, so guard the store.
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      if (c < BN) {
        let gRow = t * BK + r4 * 4u;
        let gCol = blockCol + c;
        var v = B4[(gCol * params.ldb + gRow) / 4u];
        let colOK = gCol < params.n;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.k);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.k);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.k);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.k);
        Bs[(r4 * 4u) * BN + c]     = v.x;
        Bs[(r4 * 4u + 1u) * BN + c] = v.y;
        Bs[(r4 * 4u + 2u) * BN + c] = v.z;
        Bs[(r4 * 4u + 3u) * BN + c] = v.w;
      }
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
      }
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
`});var ee,Ht=U(()=>{ee=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_small.wgsl).
// BM=BN=64, BK=8, TM=8, TN=4 (128 threads/workgroup) \u2014 the kernel 9
// autotuning winner (temp/autotune_sweep.mjs, temp/gen_sweep_kernel.mjs,
// swept BM/BN/BK/TM/TN and warp-tiled variants), +69% over the old BM=32
// single-tier baseline at n=512, +84% at n=1024. But BM=64 loses to BM=32
// below a 6x6=36 workgroup grid (not enough workgroups to fill the GPU at
// that tile size), hence the two-tier split rather than one global config.
//
// A and B are bound twice \u2014 scalar array<f32> and array<vec4<f32>> views of
// the same GPUBuffer (see vec4ViewBinding) \u2014 so each tile load can issue
// 16-byte vector reads along op(A)/op(B)'s contiguous dimension when the
// stride allows it (stride % 4 == 0 keeps every row base 16-byte aligned).
// Transposed or odd-stride operands take the scalar path; both paths
// zero-fill out-of-bounds components identically.

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

@group(0) @binding(0) var<storage, read>       A:  array<f32>;
@group(0) @binding(1) var<storage, read>       A4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       B:  array<f32>;
@group(0) @binding(3) var<storage, read>       B4: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> C:  array<f32>;

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
  useVecA: u32, // 1 = A's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = B's vec4 view covers every in-bounds element
}

@group(0) @binding(5) var<uniform> params: Params;

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
    // \u2500\u2500 Load the BM\xD7BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) \u2500\u2500
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous. Each thread loads one vec4 of 4
      // columns; 64 rows \xD7 2 column-lanes = NUM_THREADS exactly, single pass.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      let gRow = blockRow + r4;
      let gCol = t * BK + c4 * 4u;
      var v = A4[(gRow * params.lda + gCol) / 4u];
      let rowOK = gRow < params.m;
      v.x = select(0.0, v.x, rowOK &&  gCol            < params.k);
      v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.k);
      v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.k);
      v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.k);
      As[r4 * BK + c4 * 4u]      = v.x;
      As[r4 * BK + c4 * 4u + 1u] = v.y;
      As[r4 * BK + c4 * 4u + 2u] = v.z;
      As[r4 * BK + c4 * 4u + 3u] = v.w;
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. Each thread loads one
      // vec4 of 4 rows; 16 row-lanes \xD7 8 columns = NUM_THREADS, single pass.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      let gRow = blockRow + r4 * 4u;
      let gCol = t * BK + c;
      var v = A4[(gCol * params.lda + gRow) / 4u];
      let colOK = gCol < params.k;
      v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
      v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
      v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
      v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
      As[(r4 * 4u) * BK + c]      = v.x;
      As[(r4 * 4u + 1u) * BK + c] = v.y;
      As[(r4 * 4u + 2u) * BK + c] = v.z;
      As[(r4 * 4u + 3u) * BK + c] = v.w;
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
      }
    }

    // \u2500\u2500 Load the BK\xD7BN B tile into Bs \u2500\u2500
    if (params.useVecB == 1u && params.transB == 0u) {
      // No-transpose: columns contiguous. 8 rows \xD7 16 column-lanes cover the
      // tile in one pass (BK = NUM_THREADS / (BN/4)).
      let r  = tid / (BN / 4u);
      let c4 = tid % (BN / 4u);
      let gRow = t * BK + r;
      let gCol = blockCol + c4 * 4u;
      var v = B4[(gRow * params.ldb + gCol) / 4u];
      let rowOK = gRow < params.k;
      v.x = select(0.0, v.x, rowOK &&  gCol            < params.n);
      v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.n);
      v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.n);
      v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.n);
      Bs[r * BN + c4 * 4u]      = v.x;
      Bs[r * BN + c4 * 4u + 1u] = v.y;
      Bs[r * BN + c4 * 4u + 2u] = v.z;
      Bs[r * BN + c4 * 4u + 3u] = v.w;
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column. 2 row-lanes \xD7 64 columns
      // cover the tile in one pass (BN = NUM_THREADS / (BK/4)).
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      let gRow = t * BK + r4 * 4u;
      let gCol = blockCol + c;
      var v = B4[(gCol * params.ldb + gRow) / 4u];
      let colOK = gCol < params.n;
      v.x = select(0.0, v.x, colOK &&  gRow            < params.k);
      v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.k);
      v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.k);
      v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.k);
      Bs[(r4 * 4u) * BN + c]     = v.x;
      Bs[(r4 * 4u + 1u) * BN + c] = v.y;
      Bs[(r4 * 4u + 2u) * BN + c] = v.z;
      Bs[(r4 * 4u + 3u) * BN + c] = v.w;
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
      }
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
`});var le,Yt=U(()=>{le=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var fe,Xt=U(()=>{fe=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var Zt,$t=U(()=>{Zt=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var Jt,Qt=U(()=>{Jt=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`});var eo,ro=U(()=>{eo=`// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
`});var to={};Ge(to,{routineShaders:()=>ir,shaderSources:()=>ja});var ir,ja,oo=U(()=>{We();Fe();Oe();Ke();ze();Ye();Xe();Ze();Je();et();ot();st();it();nt();ut();ft();mt();pt();wt();bt();yt();vt();Bt();Et();St();Nt();Dt();It();Tt();Lt();jt();Ft();Ot();Kt();zt();Ht();Yt();Xt();$t();Qt();ro();ir={};ir.sscal={sscal:be};ir.sswap={sswap:qe};ir.saxpy={saxpy:Ue};ir.scopy={scopy:Ve};ir.sdot={sdot:He,"reduction/sum":he};ir.sasum={sasum:$e,"reduction/sum":he};ir.snrm2={snrm2:Qe,"reduction/scaledSum":rt};ir.isamax={isamax:tt,"reduction/argmax":at};ir.dasum={"f64/dekker":ue,"f64/utils/abs":ye,"f64/utils/add":xe,dasum:lt,"reduction/sumF64":ve};ir.ddot={"f64/dekker":ue,"f64/utils/add":xe,"f64/utils/multiply":ct,ddot:dt,"reduction/sumF64":ve};ir.idamax={"f64/dekker":ue,"f64/utils/abs":ye,"f64/utils/greater":gt,"f64/utils/equal":ht,idamax:xt,"reduction/argmaxF64":_t};ir.srot={srot:At};ir.srotm={srotm:Gt};ir.sgemv={sgemv_n:kt,sgemv_t:Mt};ir.ssymv={ssymv:Pt};ir.strmv={strmv:Rt};ir.strsv={strsv_invert_block:_e,strsv_apply_inverse:Ct,strsv_update:Wt};ir.sger={sger:qt};ir.ssyr={ssyr:Ut};ir.ssyr2={ssyr2:Vt};ir.sgemm={sgemm_small:re,sgemm_large:ee};ir.sgemmtr={sgemmtr_small:le,sgemmtr_large:fe};ir.ssyrk={sgemmtr_small:le,sgemmtr_large:fe};ir.ssyr2k={sgemmtr_small:le,sgemmtr_large:fe};ir.ssymm={sgemm_small:re,sgemm_large:ee,symmetrize:Zt};ir.strmm={sgemm_small:re,sgemm_large:ee,triangularize:Jt};ir.strsm={strsv_invert_block:_e,block_transfer:eo,sscal:be,sgemm_small:re,sgemm_large:ee};ja=Object.assign({},...Object.values(ir))});var Oa={};Ge(Oa,{GpuMatrix:()=>O,GpuVector:()=>D,cleanup:()=>Ie,dasum:()=>fo,ddot:()=>mo,gpuName:()=>Re,idamax:()=>wo,init:()=>Pe,isamax:()=>po,randomFloat32Array:()=>Le,randomFloat64Array:()=>Ce,randomTriangularFloat32Array:()=>je,sasum:()=>lo,saxpy:()=>io,scopy:()=>no,sdot:()=>uo,sgemm:()=>So,sgemmtr:()=>ko,sgemv:()=>ho,sger:()=>Ao,snrm2:()=>co,srot:()=>go,srotm:()=>bo,sscal:()=>ao,sswap:()=>so,ssymm:()=>Do,ssymv:()=>yo,ssyr:()=>Eo,ssyr2:()=>Go,ssyr2k:()=>Mo,ssyrk:()=>No,strmm:()=>Po,strmv:()=>xo,strsm:()=>Io,strsv:()=>Bo});function ke(r,t){return t?r.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Ne(r){if(!Me(r))return{querySet:null,passDescriptor:void 0};let t=r.createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function _r(r,t,e){if(!e)return null;let a=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(e,0,2,a,0);let o=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:e}}async function M(r){if(!r)return;let{tsReadBuffer:t,resolveBuffer:e,querySet:a}=r;await t.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),e.destroy(),a.destroy(),Math.max(0,Number(o[1]-o[0]))/1e6}var Kr=null,de=!1,Vr=new Map,Jr=new WeakMap,Lr=null,De=({powerPreference:r,benchmark:t})=>`${r}::${t}`;async function Pe({powerPreference:r="high-performance",benchmark:t=!1,dumpShaders:e=!1}={}){let a={powerPreference:r,benchmark:t,dumpShaders:e},o=De(a),s=Vr.get(o);if(s)return s;if(Kr)e!==de&&typeof window>"u"&&console.warn(`dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${de}. The first init() call fixes this for the process.`);else if(typeof window>"u"){let{create:m,globals:d}=await import("webgpu");Object.assign(globalThis,d),Kr=m(e?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),de=e}else e&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),Kr=navigator.gpu;if(!Kr)throw new Error("WebGPU not supported in this environment.");let i=await Kr.requestAdapter({powerPreference:r})??await Kr.requestAdapter();if(!i)throw new Error("No WebGPU adapter found.");let n=[...ke(i,t).requiredFeatures??[]],u=await i.requestDevice({requiredFeatures:n});u.addEventListener("uncapturederror",m=>{console.error("Uncaptured GPU error:",m.error.message)});let f=n.includes("timestamp-query");return Jr.set(u,{adapter:i,benchmark:f,options:a}),Vr.set(o,u),Lr||(Lr=u),u}function Ie(r){if(r===void 0){for(let e of Vr.values())e.destroy();Vr.clear(),Lr=null;return}let t=Jr.get(r);t&&(Vr.delete(De(t.options)),Jr.delete(r),r.destroy(),Lr===r&&(Lr=Vr.values().next().value??null))}function Re(r=Lr){let t=r&&Jr.get(r);if(!t)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:e,description:a}=t.adapter.info;return{description:a||"unknown",device:e||"unknown"}}function Me(r=Lr){return Jr.get(r)?.benchmark??!1}function zr(){if(!Lr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Lr}function p(...r){r.flat().forEach(t=>t.destroy())}function we(r,t,e){let a=r.limits.maxStorageBufferBindingSize;if(t>a)throw new Error(`Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${a} bytes). The operands are too large for this device.`)}function x(r,t,e="blas-input",a=!1){let o=t.byteLength;we(r,o,e);let s=a?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,i=r.createBuffer({label:e,size:o,usage:s,mappedAtCreation:!0}),l=t.constructor;return new l(i.getMappedRange()).set(t),i.unmap(),i}function er(r,t,e="blas-storage",a=0){return we(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|a})}function yr(r,t,e="blas-result"){return we(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function N(r,t,e){let a=r.createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(e,0,a,0,e.size),a}var Hr=16,Te=new WeakMap;function Xo(r){let t=Te.get(r);return t||(t=r.createBuffer({label:"blas-vec4-fallback",size:Hr,usage:GPUBufferUsage.STORAGE}),Te.set(r,t)),t}function Br(r,t){let e=t instanceof GPUBuffer?t:t.buffer,a=t instanceof GPUBuffer?0:t.offset??0,o=t instanceof GPUBuffer?t.size:t.size??e.size-a,s=Math.floor(o/Hr)*Hr;return s<Hr?{buffer:Xo(r),offset:0,size:Hr}:{buffer:e,offset:a,size:s}}function ge(r,t,e,a){if(t%4!==0)return!1;let o=r instanceof GPUBuffer?r:r.buffer,s=r instanceof GPUBuffer?0:r.offset??0,i=r instanceof GPUBuffer?o.size:r.size??o.size-s,l=Math.floor(i/Hr)*4;if(l<=0)return!1;let n=(Math.max(e,1)-1)*t+(Math.max(a,1)-1);return Math.floor(n/4)*4+4<=l}function I(r,t,e="blas-params"){let a=t.length*4,o=Math.ceil(a/16)*16,s=new ArrayBuffer(o),i=new DataView(s);t.forEach(({value:n,type:u},f)=>{let m=f*4;if(u==="u32")i.setUint32(m,n,!0);else if(u==="i32")i.setInt32(m,n,!0);else if(u==="f32")i.setFloat32(m,n,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:e,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,s),l}async function S(r,t=Float32Array){try{await r.mapAsync(GPUMapMode.READ);let e=new t(r.getMappedRange().slice());return r.unmap(),e}finally{r.destroy()}}function Rr(r){let t=r.length,e=new Float32Array(t),a=new Float32Array(t);for(let o=0;o<t;o++){let s=Math.fround(r[o]);e[o]=s,a[o]=Math.fround(r[o]-s)}return{hi:e,lo:a}}function jr(r,t){let e=r.length,a=new Float64Array(e);for(let o=0;o<e;o++)a[o]=r[o]+t[o];return a}var D=class r{constructor(t,e,a=Float32Array,o=null,s=null){this._buf=t,this._loBuf=o,this.length=e,this.dtype=a,this.device=s??zr()}static from(t,e){let a=t instanceof GPUDevice,o=a?t:zr(),s=a?e:t;if(s instanceof Float64Array){let{hi:l,lo:n}=Rr(s),u=x(o,l,"gpu-vector-f64-hi",!0),f=x(o,n,"gpu-vector-f64-lo",!0);return new r(u,s.length,Float64Array,f,o)}if(!(s instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let i=x(o,s,"gpu-vector",!0);return new r(i,s.length,s.constructor,null,o)}async read(){let t=this.device,e=t.createCommandEncoder(),a=N(t,e,this._buf);if(t.queue.submit([e.finish()]),!this._loBuf)return S(a,this.dtype);let o=t.createCommandEncoder(),s=N(t,o,this._loBuf);t.queue.submit([o.finish()]);let[i,l]=await Promise.all([S(a,Float32Array),S(s,Float32Array)]);return jr(i,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var O=class r{constructor(t,e,a,o,s=null,i="row-major",l=null){this._buf=t,this._loBuf=s,this.rows=e,this.cols=a,this.lda=o,this.layout=i,this.device=l??zr()}static from(t,...e){let a=t instanceof GPUDevice,o=a?t:zr(),s=a?e.shift():t,[i,l,n,u="row-major"]=e;if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let f=u==="row-major";if(n===void 0&&(n=f?l:i),!(s instanceof Float32Array)&&!(s instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(i)||i<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(l)||l<=0)throw new Error("cols must be a positive integer.");let m=f?l:i;if(!Number.isInteger(n)||n<m)throw new Error(`lda must be an integer >= ${f?"cols":"rows"}.`);let d=f?i:l;if(s.length<d*n)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(s instanceof Float64Array){let w=d*n,{hi:g,lo:h}=Rr(s.subarray(0,w)),b=x(o,g,"gpu-matrix-f64-hi",!0),y=x(o,h,"gpu-matrix-f64-lo",!0);return new r(b,i,l,n,y,u,o)}let c=x(o,s.subarray(0,d*n),"gpu-matrix",!0);return new r(c,i,l,n,null,u,o)}async read(){let t=this.device,e=t.createCommandEncoder(),a=N(t,e,this._buf);t.queue.submit([e.finish()]);let o=this.layout!=="column-major",s=o?this.rows:this.cols,i=o?this.cols:this.rows;if(this._loBuf){let u=t.createCommandEncoder(),f=N(t,u,this._loBuf);t.queue.submit([u.finish()]);let[m,d]=await Promise.all([S(a,Float32Array),S(f,Float32Array)]),c=jr(m,d);if(this.lda===i)return c;let w=new Float64Array(s*i);for(let g=0;g<s;g++)w.set(c.subarray(g*this.lda,g*this.lda+i),g*i);return w}let l=await S(a,Float32Array);if(this.lda===i)return l;let n=new Float32Array(s*i);for(let u=0;u<s;u++)n.set(l.subarray(u*this.lda,u*this.lda+i),u*i);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Le(r,t=-1,e=1){let a=new Float32Array(r);for(let o=0;o<r;o++)a[o]=t+Math.random()*(e-t);return a}function Ce(r,t=-1,e=1){let a=new Float64Array(r);for(let o=0;o<r;o++)a[o]=t+Math.random()*(e-t);return a}function je(r,t,e="lower",a=-1,o=1,s=5,i=15){if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(t<r)throw new Error("lda must be >= n.");let l=new Float32Array(r*t);for(let n=0;n<r;n++){for(let u=0;u<r;u++){if(n===u)continue;(e==="lower"?u<n:u>n)&&(l[n*t+u]=a+Math.random()*(o-a))}l[n*t+n]=s+Math.random()*(i-s)}return l}function E(r,t,e,a=0){let o=e.map((s,i)=>({binding:a+i,resource:s instanceof GPUBuffer?{buffer:s}:s}));return r.createBindGroup({layout:t,entries:o})}var $o=new WeakMap;function P(r,t){r.queue.submit([t.finish()])}function Mr(r){let{querySet:t,passDescriptor:e}=Ne(r);return{commandEncoder:r.createCommandEncoder(),querySet:t,passDescriptor:e}}function mr(r,t,e,a,o){let s=r.beginComputePass(o);s.setPipeline(t),s.setBindGroup(0,e),typeof a=="number"?s.dispatchWorkgroups(a):s.dispatchWorkgroups(a.x,a.y,a.z??1),s.end(),$o.set(r,s)}function W(r,t,e,a){let{commandEncoder:o,querySet:s,passDescriptor:i}=Mr(r);mr(o,t,e,a,i);let l=_r(r,o,s);return{commandEncoder:o,ts:l}}var qa={},Be=new WeakMap;async function G(r,t,e="main"){Be.has(r)||Be.set(r,new Map);let a=Be.get(r),o=Array.isArray(t)?t:[t],s=`${o.join("+")}::${e}`;return a.has(s)||a.set(s,await Fa(r,o,e)),a.get(s)}async function Wa(r){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(oo(),to)),e=t[r];if(!e)throw new Error(`Shader "${r}" not found in browser bundle.`);return e}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),s=a(e(qa.url));return t(o(s,`../shaders/${r}.wgsl`),"utf8")}}async function Fa(r,t,e="main"){let a=t.join("+"),o=(await Promise.all(t.map(Wa))).join(`
`),s=r.createShaderModule({label:a,code:o}),l=(await s.getCompilationInfo()).messages.filter(f=>f.type==="error");if(l.length>0)throw new Error(`Shader "${a}" compilation failed:
${l.map(f=>`  line ${f.lineNum}: ${f.message}`).join(`
`)}`);let n=e==="main"?{module:s}:{module:s,entryPoint:e},u=r.createComputePipeline({label:a,layout:"auto",compute:n});return u._shaderModule=s,u}function xr(r,t,e){let a=r.limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(t/64),a):{x:Math.min(Math.ceil(e/8),a),y:Math.min(Math.ceil(t/8),a)}}function K(r,t,e,a="x"){let o=r.limits.maxComputeWorkgroupsPerDimension;if(t>o)throw new Error(`${e}: this problem needs ${t} workgroups in ${a}, but the device allows ${o} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`);return t}function Or(r,t,e,a){return a===void 0?K(r,Math.ceil(e/64),t):{x:K(r,Math.ceil(a/8),t,"x"),y:K(r,Math.ceil(e/8),t,"y")}}function L(r,t,e){for(let[a,o]of Object.entries(e))if(!(!(o instanceof D)&&!(o instanceof O))&&o.device!==r)throw new Error(`${t}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`)}async function ao(r,t,e,a,o){let s=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sscal",{x:a}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof D))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return s?{}:{x:a};if(a.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(r,"sscal"),l=null,n=null,u=null;try{l=s?a._buf:x(r,a,"sscal-x",!0),n=I(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params");let f=E(r,i.getBindGroupLayout(0),[l,n]),{commandEncoder:m,ts:d}=W(r,i,f,xr(r,t));u=s?null:N(r,m,l),P(r,m);let c=await M(d);if(s)return c!==void 0?{gpuTimeMs:c}:{};let w=await S(u,Float32Array);return u=null,c!==void 0?{x:w,gpuTimeMs:c}:{x:w}}finally{!s&&l&&p(l),n&&p(n),u&&p(u)}}async function so(r,t,e,a,o,s){let i=e instanceof D,l=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sswap",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof D))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof D))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return i?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"sswap"),u=null,f=null,m=null,d=null,c=null;try{u=i?e._buf:x(r,e,"sswap-x",!0),f=l?o._buf:x(r,o,"sswap-y",!0),m=I(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"sswap-params");let w=E(r,n.getBindGroupLayout(0),[u,f,m]),{commandEncoder:g,ts:h}=W(r,n,w,xr(r,t));d=i?null:N(r,g,u),c=l?null:N(r,g,f),P(r,g);let b=await M(h);if(i&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(d,Float32Array);d=null;let _=await S(c,Float32Array);return c=null,b!==void 0?{x:y,y:_,gpuTimeMs:b}:{x:y,y:_}}finally{!i&&u&&p(u),!l&&f&&p(f),m&&p(m),d&&p(d),c&&p(c)}}async function io(r,t,e,a,o,s,i){let l=a instanceof D,n=s instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"saxpy",{x:a,y:s}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(o<=0||i<=0)throw new Error("incx and incy must be positive.");if(!l&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{y:s};if(a.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(r,"saxpy"),f=null,m=null,d=null,c=null;try{f=l?a._buf:x(r,a,"saxpy-x",!1),m=n?s._buf:x(r,s,"saxpy-y",!0),d=I(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:i,type:"u32"}],"saxpy-params");let w=E(r,u.getBindGroupLayout(0),[f,m,d]),{commandEncoder:g,ts:h}=W(r,u,w,xr(r,t));c=n?null:N(r,g,m),P(r,g);let b=await M(h);if(n&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(c,Float32Array);return c=null,b!==void 0?{y,gpuTimeMs:b}:{y}}finally{!l&&f&&p(f),!n&&m&&p(m),d&&p(d),c&&p(c)}}async function no(r,t,e,a,o,s){let i=e instanceof D,l=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"scopy",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return l?{}:{y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"scopy"),u=null,f=null,m=null,d=null;try{u=i?e._buf:x(r,e,"scopy-x",!1),f=l?o._buf:x(r,o,"scopy-y",!0),m=I(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"scopy-params");let c=E(r,n.getBindGroupLayout(0),[u,f,m]),{commandEncoder:w,ts:g}=W(r,n,c,xr(r,t));d=l?null:N(r,w,f),P(r,w);let h=await M(g);if(l&&i)return h!==void 0?{gpuTimeMs:h}:{};let b=await S(d,Float32Array);return d=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!i&&u&&p(u),!l&&f&&p(f),m&&p(m),d&&p(d)}}async function uo(r,t,e,a,o,s){let i=e instanceof D,l=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sdot",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"sdot"),u=await G(r,"reduction/sum"),f=null,m=null,d=null,c=null,w=null,g=null;try{f=i?e._buf:x(r,e,"sdot-x",!1),m=l?o._buf:x(r,o,"sdot-y",!1),d=er(r,512,"sdot-partials"),c=yr(r,4,"sdot-result"),w=I(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"sdot-params");let h=E(r,n.getBindGroupLayout(0),[f,m,d,w]),{commandEncoder:b,ts:y}=W(r,n,h,128);P(r,b);let _=E(r,u.getBindGroupLayout(0),[d,c]),{commandEncoder:v,ts:A}=W(r,u,_,1);g=N(r,v,c),P(r,v);let k=S(g,Float32Array);g=null;let[B,C,R]=await Promise.all([M(y),M(A),k]);return B!==void 0&&C!==void 0?{dot:R[0],gpuTimeMs:B+C}:{dot:R[0]}}finally{!i&&f&&p(f),!l&&m&&p(m),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function lo(r,t,e,a){let o=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"sasum"),i=await G(r,"reduction/sum"),l=null,n=null,u=null,f=null,m=null;try{l=o?e._buf:x(r,e,"sasum-x",!1),n=er(r,512,"sasum-partials"),u=yr(r,4,"sasum-result"),f=I(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"sasum-params");let d=E(r,s.getBindGroupLayout(0),[l,n,f]),{commandEncoder:c,ts:w}=W(r,s,d,128);P(r,c);let g=E(r,i.getBindGroupLayout(0),[n,u]),{commandEncoder:h,ts:b}=W(r,i,g,1);m=N(r,h,u),P(r,h);let y=S(m,Float32Array);m=null;let[_,v,A]=await Promise.all([M(w),M(b),y]);return _!==void 0&&v!==void 0?{asum:A[0],gpuTimeMs:_+v}:{asum:A[0]}}finally{!o&&l&&p(l),n&&p(n),u&&p(u),f&&p(f),m&&p(m)}}async function fo(r,t,e,a){let o=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"dasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(o&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/add"],i=await G(r,[...s,"dasum"]),l=await G(r,[...s,"reduction/sumF64"]),n=null,u=null,f=null,m=null,d=null,c=null,w=null,g=null,h=null;try{if(o)n=e._buf,u=e._loBuf;else{let{hi:z,lo:F}=Rr(e.map(Math.abs));n=x(r,z,"dasum-xHi",!1),u=x(r,F,"dasum-xLo",!1)}f=er(r,512,"dasum-partialsHi"),m=er(r,512,"dasum-partialsLo"),d=yr(r,4,"dasum-result-hi"),c=yr(r,4,"dasum-result-lo"),w=I(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"dasum-params");let b=E(r,i.getBindGroupLayout(0),[n,u,f,m,w]),{commandEncoder:y,ts:_}=W(r,i,b,128);P(r,y);let v=E(r,l.getBindGroupLayout(0),[f,m,d,c]),{commandEncoder:A,ts:k}=W(r,l,v,1);g=N(r,A,d),h=N(r,A,c),P(r,A);let B=S(g,Float32Array),C=S(h,Float32Array);g=null,h=null;let[R,T,j,q]=await Promise.all([M(_),M(k),B,C]),V=jr(j,q)[0];return R!==void 0&&T!==void 0?{asum:V,gpuTimeMs:R+T}:{asum:V}}finally{!o&&n&&p(n),!o&&u&&p(u),f&&p(f),m&&p(m),d&&p(d),c&&p(c),w&&p(w),g&&p(g),h&&p(h)}}async function mo(r,t,e,a,o,s){let i=e instanceof D,l=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ddot",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(!l&&!(o instanceof Float64Array))throw new Error("y must be a Float64Array or GpuVector.");if(i&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(l&&o.dtype!==Float64Array)throw new Error("y must be a Float64Array-backed GpuVector.");if(i!==l)throw new Error("x and y must be the same type (both Float64Array or both GpuVector).");if(t<=0)return{dot:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=["f64/dekker","f64/utils/add"],u=await G(r,[...n,"f64/utils/multiply","ddot"]),f=await G(r,[...n,"reduction/sumF64"]),m=null,d=null,c=null,w=null,g=null,h=null,b=null,y=null,_=null,v=null,A=null;try{if(i)m=e._buf,d=e._loBuf,c=o._buf,w=o._loBuf;else{let ur=Rr(e),lr=Rr(o);m=x(r,ur.hi,"ddot-xHi",!1),d=x(r,ur.lo,"ddot-xLo",!1),c=x(r,lr.hi,"ddot-yHi",!1),w=x(r,lr.lo,"ddot-yLo",!1)}g=er(r,512,"ddot-partialsHi"),h=er(r,512,"ddot-partialsLo"),b=yr(r,4,"ddot-result-hi"),y=yr(r,4,"ddot-result-lo"),_=I(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"ddot-params");let k=E(r,u.getBindGroupLayout(0),[m,d,c,w,g,h,_]),{commandEncoder:B,ts:C}=W(r,u,k,128);P(r,B);let R=E(r,f.getBindGroupLayout(0),[g,h,b,y]),{commandEncoder:T,ts:j}=W(r,f,R,1);v=N(r,T,b),A=N(r,T,y),P(r,T);let q=S(v,Float32Array),V=S(A,Float32Array);v=null,A=null;let[z,F,J,X]=await Promise.all([M(C),M(j),q,V]),Q=jr(J,X)[0];return z!==void 0&&F!==void 0?{dot:Q,gpuTimeMs:z+F}:{dot:Q}}finally{!i&&m&&p(m),!i&&d&&p(d),!l&&c&&p(c),!l&&w&&p(w),g&&p(g),h&&p(h),b&&p(b),y&&p(y),_&&p(_),v&&p(v),A&&p(A)}}async function co(r,t,e,a){let o=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"snrm2",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"snrm2"),i=await G(r,"reduction/scaledSum"),l=null,n=null,u=null,f=null,m=null,d=null;try{l=o?e._buf:x(r,e,"snrm2-x",!1),n=er(r,512,"snrm2-partials-scale"),u=er(r,512,"snrm2-partials-ssq"),f=yr(r,4,"snrm2-result"),m=I(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"snrm2-params");let c=E(r,s.getBindGroupLayout(0),[l,n,u,m]),{commandEncoder:w,ts:g}=W(r,s,c,128);P(r,w);let h=E(r,i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:b,ts:y}=W(r,i,h,1);d=N(r,b,f),P(r,b);let _=S(d,Float32Array);d=null;let[v,A,k]=await Promise.all([M(g),M(y),_]),B=k[0];return v!==void 0&&A!==void 0?{nrm2:B,gpuTimeMs:v+A}:{nrm2:B}}finally{!o&&l&&p(l),n&&p(n),u&&p(u),f&&p(f),m&&p(m),d&&p(d)}}async function po(r,t,e,a){let o=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"isamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"isamax"),i=await G(r,"reduction/argmax"),l=null,n=null,u=null,f=null,m=null,d=null;try{l=o?e._buf:x(r,e,"isamax-x",!1),n=er(r,512,"isamax-partials-val"),u=er(r,512,"isamax-partials-idx"),f=yr(r,4,"isamax-result"),m=I(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"isamax-params");let c=E(r,s.getBindGroupLayout(0),[l,n,u,m]),{commandEncoder:w,ts:g}=W(r,s,c,128);P(r,w);let h=E(r,i.getBindGroupLayout(0),[n,u,f]),{commandEncoder:b,ts:y}=W(r,i,h,1);d=N(r,b,f),P(r,b);let _=S(d,Uint32Array);d=null;let[v,A,k]=await Promise.all([M(g),M(y),_]),B=k[0];return v!==void 0&&A!==void 0?{index:B,gpuTimeMs:v+A}:{index:B}}finally{!o&&l&&p(l),n&&p(n),u&&p(u),f&&p(f),m&&p(m),d&&p(d)}}async function wo(r,t,e,a){let o=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"idamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(o&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],i=await G(r,[...s,"idamax"],"idamax_main"),l=await G(r,[...s,"reduction/argmaxF64"],"reduce_f64"),n=null,u=null,f=null,m=null,d=null,c=null,w=null,g=null;try{if(o)n=e._buf,u=e._loBuf;else{let{hi:j,lo:q}=Rr(e);n=x(r,j,"idamax-xHi",!1),u=x(r,q,"idamax-xLo",!1)}f=er(r,512,"idamax-partials-val-hi"),m=er(r,512,"idamax-partials-val-lo"),d=er(r,512,"idamax-partials-idx"),c=yr(r,4,"idamax-result"),w=I(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"idamax-params");let h=E(r,i.getBindGroupLayout(0),[n,u,f,m,d,w]),{commandEncoder:b,ts:y}=W(r,i,h,128);P(r,b);let _=E(r,l.getBindGroupLayout(0),[f,m,d,c]),{commandEncoder:v,ts:A}=W(r,l,_,1);g=N(r,v,c),P(r,v);let k=S(g,Uint32Array);g=null;let[B,C,R]=await Promise.all([M(y),M(A),k]),T=R[0];return B!==void 0&&C!==void 0?{index:T,gpuTimeMs:B+C}:{index:T}}finally{!o&&n&&p(n),!o&&u&&p(u),f&&p(f),m&&p(m),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function go(r,t,e,a,o,s,i,l){let n=e instanceof D,u=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"srot",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof i!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(i)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(i))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await G(r,"srot"),m=null,d=null,c=null,w=null,g=null;try{m=n?e._buf:x(r,e,"srot-x",!0),d=u?o._buf:x(r,o,"srot-y",!0),c=I(r,[{value:t,type:"u32"},{value:i,type:"f32"},{value:l,type:"f32"},{value:a,type:"u32"},{value:s,type:"u32"}],"srot-params");let h=E(r,f.getBindGroupLayout(0),[m,d,c]),{commandEncoder:b,ts:y}=W(r,f,h,xr(r,t));w=n?null:N(r,b,m),g=u?null:N(r,b,d),P(r,b);let _=await M(y);if(n&&u)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),A=S(g,Float32Array);w=null,g=null;let[k,B]=await Promise.all([v,A]);return _!==void 0?{x:k,y:B,gpuTimeMs:_}:{x:k,y:B}}finally{!n&&m&&p(m),!u&&d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function bo(r,t,e,a,o,s,i){let l=e instanceof D,n=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"srotm",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(!(i instanceof Float32Array)||i.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i[0]!==-2&&i[0]!==-1&&i[0]!==0&&i[0]!==1)throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||i[0]===-2)return l?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(r,"srotm"),f=null,m=null,d=null,c=null,w=null,g=null;try{f=l?e._buf:x(r,e,"srotm-x",!0),m=n?o._buf:x(r,o,"srotm-y",!0),d=x(r,i,"srotm-param",!1),c=I(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"srotm-params");let h=E(r,u.getBindGroupLayout(0),[f,m,d,c]),{commandEncoder:b,ts:y}=W(r,u,h,xr(r,t));w=l?null:N(r,b,f),g=n?null:N(r,b,m),P(r,b);let _=await M(y);if(l&&n)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),A=S(g,Float32Array);w=null,g=null;let[k,B]=await Promise.all([v,A]);return _!==void 0?{x:k,y:B,gpuTimeMs:_}:{x:k,y:B}}finally{!l&&f&&p(f),!n&&m&&p(m),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function ho(r,t,e,a,o,s,i,l,n,u,f,m,d="row-major"){let c=s instanceof O,w=l instanceof D,g=f instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sgemv",{A:s,x:l,y:f}),t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(n)||!Number.isInteger(m)||!Number.isInteger(i))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||m<=0)throw new Error("incx and incy must be positive.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(f instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&l._buf===f._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&g&&s._buf===f._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(s.rows<e||s.cols<a))throw new Error("A is too small for the given m and n.");if(e<0||a<0)throw new Error("m and n must be non-negative.");if(e===0||a===0)return g?{}:{y:f};(c?s.layout:d)==="column-major"&&([e,a]=[a,e],t=t==="no-transpose"?"transpose":"no-transpose");let b=t==="no-transpose",y=b?a:e,_=b?e:a;if(i<a)throw new Error("lda must be >= n.");if(!c&&s.length<(e-1)*i+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(y-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(f.length<(_-1)*m+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let A=await G(r,b?"sgemv_n":"sgemv_t"),k=null,B=null,C=null,R=null;try{k=c?s._buf:x(r,s,"sgemv-A",!1),B=w?l._buf:x(r,l,"sgemv-x",!1),C=g?f._buf:x(r,f,"sgemv-y",!0),R=I(r,[{value:e,type:"u32"},{value:a,type:"u32"},{value:o,type:"f32"},{value:u,type:"f32"},{value:n,type:"u32"},{value:m,type:"u32"},{value:i,type:"u32"}],"sgemv-params");let T=E(r,A.getBindGroupLayout(0),[k,B,C,R]),j=b?Math.min(e,r.limits.maxComputeWorkgroupsPerDimension):Or(r,"sgemv",_),{commandEncoder:q,ts:V}=W(r,A,T,j),z=g?null:N(r,q,C);P(r,q);let F=await M(V);if(g)return F!==void 0?{gpuTimeMs:F}:{};let J=await S(z,Float32Array);return F!==void 0?{y:J,gpuTimeMs:F}:{y:J}}finally{!c&&k&&p(k),!w&&B&&p(B),!g&&C&&p(C),R&&p(R)}}async function yo(r,t,e,a,o,s,i,l,n,u,f,m="row-major"){let d=i instanceof D,c=u instanceof D,w=o instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssymv",{A:o,x:i,y:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(l<=0||f<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!w&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(d&&i._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(o.rows<e||o.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{y:u};if(!w&&o.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(i.length<(e-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?o.layout:m)==="column-major"?t==="upper":t==="lower",b=await G(r,"ssymv"),y=null,_=null,v=null,A=null;try{y=w?o._buf:x(r,o,"ssymv-A",!1),_=d?i._buf:x(r,i,"ssymv-x",!1),v=c?u._buf:x(r,u,"ssymv-y",!0),A=I(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let k=E(r,b.getBindGroupLayout(0),[y,_,v,A]),B=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:C,ts:R}=W(r,b,k,B),T=c?null:N(r,C,v);P(r,C);let j=await M(R);if(c)return j!==void 0?{gpuTimeMs:j}:{};let q=await S(T,Float32Array);return j!==void 0?{y:q,gpuTimeMs:j}:{y:q}}finally{!w&&y&&p(y),!d&&_&&p(_),!c&&v&&p(v),A&&p(A)}}async function xo(r,t,e,a,o,s,i,l,n,u,f,m="row-major"){let d=l instanceof D,c=u instanceof D,w=s instanceof O,g=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"strmv",{A:s,x:l,y:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(i<o)throw new Error("lda must be >= n.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&c&&s._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(s.rows<o||s.cols<o))throw new Error("A is too small for the given n.");if(o<0)throw new Error("n must be non-negative.");if(o===0)return c?{}:{y:u};if(!w&&s.length<(o-1)*i+o)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(o-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(o-1)*f+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?s.layout:m)==="column-major",y=b?t==="upper":t==="lower",_=b?e==="transpose":e==="no-transpose",v=await G(r,"strmv"),A=null,k=null,B=null,C=null;try{A=w?s._buf:x(r,s,"strmv-A",!1),k=d?l._buf:x(r,l,"strmv-x",!1),B=c?u._buf:x(r,u,"strmv-y",!0),C=I(r,[{value:o,type:"u32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"},{value:_?0:1,type:"u32"},{value:y?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let R=E(r,v.getBindGroupLayout(0),[A,k,B,C]),T=Math.min(o,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:q}=W(r,v,R,T),V=c?null:N(r,j,B);P(r,j);let z=await M(q);if(c)return z!==void 0?{gpuTimeMs:z}:{};let F=await S(V,Float32Array);return z!==void 0?{y:F,gpuTimeMs:z}:{y:F}}finally{!w&&A&&p(A),!d&&k&&p(k),!c&&B&&p(B),C&&p(C)}}function vo(r,t,e){let a=new ArrayBuffer(r*t),o=new DataView(a);for(let s=0;s<r;s++){let i=e(s),l=s*t;i.forEach((n,u)=>o.setUint32(l+u*4,n,!0))}return a}function _o(r,t,e){let a=r.createBuffer({label:e,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(a,0,t),a}async function Bo(r,t,e,a,o,s,i,l,n,u="row-major"){let f=l instanceof D,m=s instanceof O,d=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"strsv",{A:s,x:l}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!d&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(i))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(i<o)throw new Error("lda must be >= n.");if(!m&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(f&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!f)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&f&&s._buf===l._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(s.rows<o||s.cols<o))throw new Error("A is too small for the given n.");if(o<0)throw new Error("n must be non-negative.");if(o===0)return f?{}:{x:l};if(!m&&s.length<(o-1)*i+o)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(o-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(m?s.layout:u)==="column-major",g=w?t==="upper":t==="lower",h=w?e==="transpose":e==="no-transpose",b=await G(r,"strsv_invert_block"),y=await G(r,"strsv_apply_inverse"),_=await G(r,"strsv_update"),v=h===g,A=[];for(let F=0;F<o;F+=64)A.push(F);v||A.reverse();let k=A.length,B=r.limits.maxComputeWorkgroupsPerDimension,C=r.limits.minUniformBufferOffsetAlignment,R=null,T=null,j=null,q=null,V=null,z=null;try{R=m?s._buf:x(r,s,"strsv-A",!1),T=f?l._buf:x(r,l,"strsv-x",!0),j=er(r,k*64*64*4,"strsv-Ainv");let F=vo(k,C,Z=>{let H=Z*64,$=Math.min(H+64,o);return[n,Z,H,$]});q=_o(r,F,"strsv-apply-params");let J=vo(k,C,Z=>{let H=Z*64,$=Math.min(H+64,o);return[o,n,i,h?0:1,g?0:1,H,$]});V=_o(r,J,"strsv-update-params");let{commandEncoder:X,querySet:Q}=Mr(r);z=I(r,[{value:o,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:d?1:0,type:"u32"}],"strsv-invert-params");let ur=E(r,b.getBindGroupLayout(0),[R,j,z]);mr(X,b,ur,{x:64,y:k},Q?{timestampWrites:{querySet:Q,beginningOfPassWriteIndex:0}}:void 0);for(let Z=0;Z<A.length;Z++){let H=A[Z],$=Math.min(H+64,o),rr=H/64,fr=Z===A.length-1,dr=rr*C,sr=E(r,y.getBindGroupLayout(0),[j,T,{buffer:q,offset:dr,size:16}]);mr(X,y,sr,1,fr&&Q?{timestampWrites:{querySet:Q,endOfPassWriteIndex:1}}:void 0);let wr=v?o-$:H;if(wr===0)continue;let Pr=E(r,_.getBindGroupLayout(0),[R,T,{buffer:V,offset:dr,size:32}]),Nr=Math.min(wr,B);mr(X,_,Pr,Nr)}let pr=_r(r,X,Q),tr=f?null:N(r,X,T);P(r,X);let ar=await M(pr);if(f)return ar!==void 0?{gpuTimeMs:ar}:{};let Y=await S(tr,Float32Array);return ar!==void 0?{x:Y,gpuTimeMs:ar}:{x:Y}}finally{!m&&R&&p(R),!f&&T&&p(T),j&&p(j),q&&p(q),V&&p(V),z&&p(z)}}async function Ao(r,t,e,a,o,s,i,l,n,u,f="row-major"){let m=n instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sger",{A:n,x:o,y:i}),f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(s<=0||l<=0)throw new Error("incx and incy must be positive.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(m&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<t||n.cols<e))throw new Error("A is too small for the given m and n.");(m?n.layout:f)==="column-major"&&([t,e]=[e,t],[o,i]=[i,o],[s,l]=[l,s]);let c=o instanceof D,w=i instanceof D;if(u<e)throw new Error("lda must be >= n.");if(!c&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!m)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(m&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(m&&c&&n._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&w&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||e<0)throw new Error("m and n must be non-negative.");if(t===0||e===0)return m?{}:{A:n};if(!m&&n.length<(t-1)*u+e)throw new Error("A does not have enough elements for the given m, n, and lda.");if(o.length<(t-1)*s+1)throw new Error("x does not have enough elements for the given m and incx.");if(i.length<(e-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await G(r,"sger"),h=null,b=null,y=null,_=null;try{h=c?o._buf:x(r,o,"sger-x",!1),b=w?i._buf:x(r,i,"sger-y",!1),y=m?n._buf:x(r,n,"sger-A",!0),_=I(r,[{value:t,type:"u32"},{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let v=E(r,g.getBindGroupLayout(0),[h,b,y,_]),A=Math.min(t,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:k,ts:B}=W(r,g,v,A),C=m?null:N(r,k,y);P(r,k);let R=await M(B);if(m)return R!==void 0?{gpuTimeMs:R}:{};let T=await S(C,Float32Array);return R!==void 0?{A:T,gpuTimeMs:R}:{A:T}}finally{!c&&h&&p(h),!w&&b&&p(b),!m&&y&&p(y),_&&p(_)}}async function Eo(r,t,e,a,o,s,i,l,n="row-major"){let u=o instanceof D,f=i instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssyr",{A:i,x:o}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(s<=0)throw new Error("incx must be positive.");if(l<e)throw new Error("lda must be >= n.");if(!f&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&u&&i._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&l!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return f?{}:{A:i};if(!f&&i.length<(e-1)*l+e)throw new Error("A does not have enough elements for the given n and lda.");if(o.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");let d=(f?i.layout:n)==="column-major"?t==="upper":t==="lower",c=await G(r,"ssyr"),w=null,g=null,h=null;try{w=u?o._buf:x(r,o,"ssyr-x",!1),g=f?i._buf:x(r,i,"ssyr-A",!0),h=I(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:d?0:1,type:"u32"}],"ssyr-params");let b=E(r,c.getBindGroupLayout(0),[w,g,h]),y=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:_,ts:v}=W(r,c,b,y),A=f?null:N(r,_,g);P(r,_);let k=await M(v);if(f)return k!==void 0?{gpuTimeMs:k}:{};let B=await S(A,Float32Array);return k!==void 0?{A:B,gpuTimeMs:k}:{A:B}}finally{!u&&w&&p(w),!f&&g&&p(g),h&&p(h)}}async function Go(r,t,e,a,o,s,i,l,n,u,f="row-major"){let m=o instanceof D,d=i instanceof D,c=n instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssyr2",{A:n,x:o,y:i}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(s<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<e)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(m&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!m)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&m&&n._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&d&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(m&&o._buf===i._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<e||n.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{A:n};if(!c&&n.length<(e-1)*u+e)throw new Error("A does not have enough elements for the given n and lda.");if(o.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?n.layout:f)==="column-major"?t==="upper":t==="lower",h=await G(r,"ssyr2"),b=null,y=null,_=null,v=null;try{b=m?o._buf:x(r,o,"ssyr2-x",!1),y=d?i._buf:x(r,i,"ssyr2-y",!1),_=c?n._buf:x(r,n,"ssyr2-A",!0),v=I(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let A=E(r,h.getBindGroupLayout(0),[b,y,_,v]),k=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:B,ts:C}=W(r,h,A,k),R=c?null:N(r,B,_);P(r,B);let T=await M(C);if(c)return T!==void 0?{gpuTimeMs:T}:{};let j=await S(R,Float32Array);return T!==void 0?{A:j,gpuTimeMs:T}:{A:j}}finally{!m&&b&&p(b),!d&&y&&p(y),!c&&_&&p(_),v&&p(v)}}async function So(r,t,e,a,o,s,i,l,n,u,f,m,d,c,w="row-major"){let g=l instanceof O,h=u instanceof O,b=d instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sgemm",{A:l,B:u,C:d}),t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(d instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0||s<0)throw new Error("m, n, and k must be non-negative.");if(a===0||o===0)return b?{}:{C:d};let y=g?l.layout:w,_=h?u.layout:w,v=b?d.layout:w,A=y==="column-major"?s:a,k=y==="column-major"?a:s,B=t==="no-transpose"?A:k,C=t==="no-transpose"?k:A;if(n<C)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[$,rr]=t==="no-transpose"?[a,s]:[s,a];if(l.rows<$||l.cols<rr)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(B-1)*n+C)throw new Error("A does not have enough elements for the given dimensions and lda.");let R=_==="column-major"?o:s,T=_==="column-major"?s:o,j=e==="no-transpose"?R:T,q=e==="no-transpose"?T:R;if(f<q)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[$,rr]=e==="no-transpose"?[s,o]:[o,s];if(u.rows<$||u.cols<rr)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(j-1)*f+q)throw new Error("B does not have enough elements for the given dimensions and ldb.");let V=v==="column-major"?o:a,z=v==="column-major"?a:o;if(c<z)throw new Error(`ldc must be >= ${v==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==d.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(d.rows<a||d.cols<o)throw new Error("C is too small for the given m and n.")}else if(d.length<(V-1)*c+z)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&([l,u]=[u,l],[g,h]=[h,g],[n,f]=[f,n],[t,e]=[e==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[a,o]=[o,a]);let F=Math.ceil(o/64),J=Math.ceil(a/64),X=F*J>=36,Q=await G(r,X?"sgemm_large":"sgemm_small"),ur=g?l._buf:x(r,l,"sgemm-A",!1),lr=h?u._buf:x(r,u,"sgemm-B",!1),pr=b?d._buf:x(r,d,"sgemm-C",!0),tr=t==="no-transpose",ar=e==="no-transpose",Y=tr&&ge(ur,n,a,s),Z=ge(lr,f,ar?s:o,ar?o:s),H=I(r,[{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"},{value:i,type:"f32"},{value:m,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:c,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:Y?1:0,type:"u32"},{value:Z?1:0,type:"u32"}],"sgemm-params");try{let $=E(r,Q.getBindGroupLayout(0),[ur,Br(r,ur),lr,Br(r,lr),pr,H]),rr=X?{x:K(r,F,"sgemm","x"),y:K(r,J,"sgemm","y")}:{x:K(r,Math.ceil(o/32),"sgemm","x"),y:K(r,Math.ceil(a/32),"sgemm","y")},{commandEncoder:fr,ts:dr}=W(r,Q,$,rr),sr=b?null:N(r,fr,pr);P(r,fr);let or=await M(dr);if(b)return or!==void 0?{gpuTimeMs:or}:{};let wr=await S(sr,Float32Array);return or!==void 0?{C:wr,gpuTimeMs:or}:{C:wr}}finally{g||p(ur),h||p(lr),b||p(pr),p(H)}}async function ko(r,t,e,a,o,s,i,l,n,u,f,m,d,c,w,g="row-major"){let h=n instanceof O,b=f instanceof O,y=c instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"sgemmtr",{A:n,B:f,C:c}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof d!="number")throw new Error("beta must be a number.");if(Number.isNaN(d))throw new Error("beta must not be NaN.");if(!Number.isFinite(d))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(m)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!y&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!y)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(y&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||s<0||i<0)throw new Error("m, n, and k must be non-negative.");if(o===0||s===0)return y?{}:{C:c};let _=h?n.layout:g,v=b?f.layout:g,A=y?c.layout:g,k=_==="column-major"?i:o,B=_==="column-major"?o:i,C=e==="no-transpose"?k:B,R=e==="no-transpose"?B:k;if(u<R)throw new Error(`lda must be >= ${_==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,Z]=e==="no-transpose"?[o,i]:[i,o];if(n.rows<Y||n.cols<Z)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(C-1)*u+R)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=v==="column-major"?s:i,j=v==="column-major"?i:s,q=a==="no-transpose"?T:j,V=a==="no-transpose"?j:T;if(m<V)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,Z]=a==="no-transpose"?[i,s]:[s,i];if(f.rows<Y||f.cols<Z)throw new Error("B is too small for the given n, k, and transB.")}else if(f.length<(q-1)*m+V)throw new Error("B does not have enough elements for the given dimensions and ldb.");let z=A==="column-major"?s:o,F=A==="column-major"?o:s;if(w<F)throw new Error(`ldc must be >= ${A==="column-major"?"rows":"cols"} of C as stored.`);if(y){if(w!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<o||c.cols<s)throw new Error("C is too small for the given m and n.")}else if(c.length<(z-1)*w+F)throw new Error("C does not have enough elements for the given dimensions and ldc.");_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&(a=a==="no-transpose"?"transpose":"no-transpose"),A==="column-major"&&([n,f]=[f,n],[h,b]=[b,h],[u,m]=[m,u],[e,a]=[a==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[o,s]=[s,o],t=t==="lower"?"upper":"lower");let J=Math.ceil(s/64),X=Math.ceil(o/64),Q=J*X>=36,ur=await G(r,Q?"sgemmtr_large":"sgemmtr_small"),lr=h?n._buf:x(r,n,"sgemmtr-A",!1),pr=b?f._buf:x(r,f,"sgemmtr-B",!1),tr=y?c._buf:x(r,c,"sgemmtr-C",!0),ar=I(r,[{value:o,type:"u32"},{value:s,type:"u32"},{value:i,type:"u32"},{value:l,type:"f32"},{value:d,type:"f32"},{value:u,type:"u32"},{value:m,type:"u32"},{value:w,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:a==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let Y=E(r,ur.getBindGroupLayout(0),[lr,pr,tr,ar]),Z=Q?{x:K(r,J,"sgemmtr","x"),y:K(r,X,"sgemmtr","y")}:{x:K(r,Math.ceil(s/32),"sgemmtr","x"),y:K(r,Math.ceil(o/32),"sgemmtr","y")},{commandEncoder:H,ts:$}=W(r,ur,Y,Z),rr=y?null:N(r,H,tr);P(r,H);let fr=await M($);if(y)return fr!==void 0?{gpuTimeMs:fr}:{};let dr=await S(rr,Float32Array);return fr!==void 0?{C:dr,gpuTimeMs:fr}:{C:dr}}finally{h||p(lr),b||p(pr),y||p(tr),p(ar)}}async function No(r,t,e,a,o,s,i,l,n,u,f,m="row-major"){let d=i instanceof O,c=u instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssyrk",{A:i,C:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(f))throw new Error("n, k, lda, and ldc must be integers.");if(!d&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(d&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!d)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("n and k must be non-negative.");if(a===0)return c?{}:{C:u};let w=d?i.layout:m,g=c?u.layout:m,h=w==="column-major"?o:a,b=w==="column-major"?a:o,y=e==="no-transpose"?h:b,_=e==="no-transpose"?b:h;if(l<_)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(d){if(l!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[F,J]=e==="no-transpose"?[a,o]:[o,a];if(i.rows<F||i.cols<J)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(y-1)*l+_)throw new Error("A does not have enough elements for the given dimensions and lda.");if(f<a)throw new Error("ldc must be >= n.");if(c){if(f!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<a||u.cols<a)throw new Error("C is too small for the given n.")}else if(u.length<(a-1)*f+a)throw new Error("C does not have enough elements for the given dimensions and ldc.");let v=e;w==="column-major"&&(v=v==="no-transpose"?"transpose":"no-transpose");let A=v==="no-transpose"?"transpose":"no-transpose",k=t;g==="column-major"&&([v,A]=[A==="no-transpose"?"transpose":"no-transpose",v==="no-transpose"?"transpose":"no-transpose"],k=k==="lower"?"upper":"lower");let B=Math.ceil(a/64),C=Math.ceil(a/64),R=B*C>=36,T=await G(r,R?"sgemmtr_large":"sgemmtr_small"),j=d?i._buf:x(r,i,"ssyrk-A",!1),q=c?u._buf:x(r,u,"ssyrk-C",!0),V=d?er(r,j.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(r,i,"ssyrk-B",!1),z=I(r,[{value:a,type:"u32"},{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:v==="transpose"?1:0,type:"u32"},{value:A==="transpose"?1:0,type:"u32"},{value:k==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let F=E(r,T.getBindGroupLayout(0),[j,V,q,z]),J=R?{x:K(r,B,"ssyrk","x"),y:K(r,C,"ssyrk","y")}:{x:K(r,Math.ceil(a/32),"ssyrk","x"),y:K(r,Math.ceil(a/32),"ssyrk","y")},{commandEncoder:X,querySet:Q,passDescriptor:ur}=Mr(r);d&&X.copyBufferToBuffer(j,0,V,0,j.size),mr(X,T,F,J,ur);let lr=_r(r,X,Q),pr=c?null:N(r,X,q);P(r,X);let tr=await M(lr);if(c)return tr!==void 0?{gpuTimeMs:tr}:{};let ar=await S(pr,Float32Array);return tr!==void 0?{C:ar,gpuTimeMs:tr}:{C:ar}}finally{d||p(j),p(V),c||p(q),p(z)}}async function Mo(r,t,e,a,o,s,i,l,n,u,f,m,d,c="row-major"){let w=i instanceof O,g=n instanceof O,h=m instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssyr2k",{A:i,B:n,C:m}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(d))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("n and k must be non-negative.");if(a===0)return h?{}:{C:m};let b=w?i.layout:c,y=g?n.layout:c,_=h?m.layout:c,v=b==="column-major"?o:a,A=b==="column-major"?a:o,k=e==="no-transpose"?v:A,B=e==="no-transpose"?A:v;if(l<B)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[$,rr]=e==="no-transpose"?[a,o]:[o,a];if(i.rows<$||i.cols<rr)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(k-1)*l+B)throw new Error("A does not have enough elements for the given dimensions and lda.");let C=y==="column-major"?o:a,R=y==="column-major"?a:o,T=e==="no-transpose"?C:R,j=e==="no-transpose"?R:C;if(u<j)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[$,rr]=e==="no-transpose"?[a,o]:[o,a];if(n.rows<$||n.cols<rr)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(T-1)*u+j)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(d<a)throw new Error("ldc must be >= n.");if(h){if(d!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<a||m.cols<a)throw new Error("C is too small for the given n.")}else if(m.length<(a-1)*d+a)throw new Error("C does not have enough elements for the given dimensions and ldc.");let q=e;b==="column-major"&&(q=q==="no-transpose"?"transpose":"no-transpose");let V=e;y==="column-major"&&(V=V==="no-transpose"?"transpose":"no-transpose");let z=_==="column-major"?t==="lower"?"upper":"lower":t,F=$=>$==="no-transpose"?"transpose":"no-transpose";function J($,rr,fr,dr,sr,or){let wr=$,Pr=F(dr);return _!=="column-major"?{transX:wr,X:rr,ldX:fr,transY:Pr,Y:sr,ldY:or}:{transX:F(Pr),X:sr,ldX:or,transY:F(wr),Y:rr,ldY:fr}}let X=Math.ceil(a/64),Q=Math.ceil(a/64),ur=X*Q>=36,lr=await G(r,ur?"sgemmtr_large":"sgemmtr_small"),pr=ur?{x:K(r,X,"ssyr2k","x"),y:K(r,Q,"ssyr2k","y")}:{x:K(r,Math.ceil(a/32),"ssyr2k","x"),y:K(r,Math.ceil(a/32),"ssyr2k","y")},tr=w?i._buf:x(r,i,"ssyr2k-A",!1),ar=g?n._buf:x(r,n,"ssyr2k-B",!1),Y=h?m._buf:x(r,m,"ssyr2k-C",!0),Z=null,H=null;try{let $=J(q,tr,l,V,ar,u),rr=J(V,ar,u,q,tr,l),fr=(Ir,hr)=>I(r,[{value:a,type:"u32"},{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"f32"},{value:hr,type:"f32"},{value:Ir.ldX,type:"u32"},{value:Ir.ldY,type:"u32"},{value:d,type:"u32"},{value:Ir.transX==="transpose"?1:0,type:"u32"},{value:Ir.transY==="transpose"?1:0,type:"u32"},{value:z==="upper"?1:0,type:"u32"}],"ssyr2k-params");Z=fr($,f),H=fr(rr,1);let dr=E(r,lr.getBindGroupLayout(0),[$.X,$.Y,Y,Z]),sr=E(r,lr.getBindGroupLayout(0),[rr.X,rr.Y,Y,H]),{commandEncoder:or,querySet:wr}=Mr(r),Pr=wr?{timestampWrites:{querySet:wr,beginningOfPassWriteIndex:0}}:void 0,Nr=wr?{timestampWrites:{querySet:wr,endOfPassWriteIndex:1}}:void 0;mr(or,lr,dr,pr,Pr),mr(or,lr,sr,pr,Nr);let Dr=_r(r,or,wr),vr=h?null:N(r,or,Y);P(r,or);let br=await M(Dr);if(h)return br!==void 0?{gpuTimeMs:br}:{};let gr=await S(vr,Float32Array);return br!==void 0?{C:gr,gpuTimeMs:br}:{C:gr}}finally{w||p(tr),g||p(ar),h||p(Y),Z&&p(Z),H&&p(H)}}async function Do(r,t,e,a,o,s,i,l,n,u,f,m,d,c="row-major"){let w=i instanceof O,g=n instanceof O,h=m instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"ssymm",{A:i,B:n,C:m}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(d))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(m instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("m and n must be non-negative.");if(a===0||o===0)return h?{}:{C:m};let b=w?i.layout:c,y=g?n.layout:c,_=h?m.layout:c,v=t==="left"?a:o;if(l<v)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(w){if(l!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(i.rows<v||i.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(i.length<(v-1)*l+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let A=y==="column-major"?o:a,k=y==="column-major"?a:o;if(u<k)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<a||n.cols<o)throw new Error("B is too small for the given m and n.")}else if(n.length<(A-1)*u+k)throw new Error("B does not have enough elements for the given dimensions and ldb.");let B=_==="column-major"?o:a,C=_==="column-major"?a:o;if(d<C)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(d!==m.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(m.rows<a||m.cols<o)throw new Error("C is too small for the given m and n.")}else if(m.length<(B-1)*d+C)throw new Error("C does not have enough elements for the given dimensions and ldc.");let R=b==="column-major"?e==="lower"?"upper":"lower":e,T=y==="column-major"?"transpose":"no-transpose",j="no-transpose",q=a,V=o,z=v,F=t==="left"?j:T,J=t==="left"?T:j,X=or=>or==="no-transpose"?"transpose":"no-transpose",Q=t==="right";_==="column-major"&&([F,J]=[X(J),X(F)],Q=!Q,[q,V]=[V,q]);let ur=v,lr=Math.ceil(V/64),pr=Math.ceil(q/64),tr=lr*pr>=36,ar=await G(r,tr?"sgemm_large":"sgemm_small"),Y=await G(r,"symmetrize"),Z=tr?{x:K(r,lr,"ssymm","x"),y:K(r,pr,"ssymm","y")}:{x:K(r,Math.ceil(V/32),"ssymm","x"),y:K(r,Math.ceil(q/32),"ssymm","y")},H=w?i._buf:x(r,i,"ssymm-A",!1),$=g?n._buf:x(r,n,"ssymm-B",!1),rr=h?m._buf:x(r,m,"ssymm-C",!0),fr=er(r,v*ur*4,"ssymm-Adense"),dr=null,sr=null;try{dr=I(r,[{value:v,type:"u32"},{value:l,type:"u32"},{value:ur,type:"u32"},{value:R==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let or=E(r,Y.getBindGroupLayout(0),[H,fr,dr]),wr=Q?$:fr,Pr=Q?u:ur,Nr=Q?fr:$;sr=I(r,[{value:q,type:"u32"},{value:V,type:"u32"},{value:z,type:"u32"},{value:s,type:"f32"},{value:f,type:"f32"},{value:Pr,type:"u32"},{value:Q?ur:u,type:"u32"},{value:d,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:J==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let vr=E(r,ar.getBindGroupLayout(0),[wr,Br(r,wr),Nr,Br(r,Nr),rr,sr]),{commandEncoder:br,querySet:gr}=Mr(r),Ir=gr?{timestampWrites:{querySet:gr,beginningOfPassWriteIndex:0}}:void 0,hr=gr?{timestampWrites:{querySet:gr,endOfPassWriteIndex:1}}:void 0;mr(br,Y,or,{x:Math.ceil(v/8),y:Math.ceil(v/8)},Ir),mr(br,ar,vr,Z,hr);let Cr=_r(r,br,gr),Wr=h?null:N(r,br,rr);P(r,br);let Ur=await M(Cr);if(h)return Ur!==void 0?{gpuTimeMs:Ur}:{};let te=await S(Wr,Float32Array);return Ur!==void 0?{C:te,gpuTimeMs:Ur}:{C:te}}finally{w||p(H),g||p($),h||p(rr),p(fr),dr&&p(dr),sr&&p(sr)}}async function Po(r,t,e,a,o,s,i,l,n,u,f,m,d="row-major"){let c=n instanceof O,w=f instanceof O,g=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"strmm",{A:n,B:f}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(m))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:f};let h=c?n.layout:d,b=w?f.layout:d,y=t==="left"?s:i;if(u<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<y||n.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(y-1)*u+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,v=b==="column-major"?s:i;if(m<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(f.rows<s||f.cols<i)throw new Error("B is too small for the given m and n.")}else if(f.length<(_-1)*m+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?e==="lower"?"upper":"lower":e,k=h==="column-major"?a==="no-transpose"?"transpose":"no-transpose":a,B=b==="column-major"?"transpose":"no-transpose",C="no-transpose",R=s,T=i,j=y,q=t==="left"?C:B,V=t==="left"?B:C,z=dr=>dr==="no-transpose"?"transpose":"no-transpose",F=t==="right";b==="column-major"&&([q,V]=[z(V),z(q)],F=!F,[R,T]=[T,R]);let J=y,X=Math.ceil(T/64),Q=Math.ceil(R/64),ur=X*Q>=36,lr=await G(r,ur?"sgemm_large":"sgemm_small"),pr=await G(r,"triangularize"),tr=ur?{x:K(r,X,"strmm","x"),y:K(r,Q,"strmm","y")}:{x:K(r,Math.ceil(T/32),"strmm","x"),y:K(r,Math.ceil(R/32),"strmm","y")},ar=null,Y=null,Z=null,H=null,$=null,rr=null,fr=!1;try{ar=c?n._buf:x(r,n,"strmm-A",!1),Y=w?f._buf:x(r,f,"strmm-B",!0),Z=er(r,y*J*4,"strmm-Adense"),H=er(r,_*m*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),$=I(r,[{value:y,type:"u32"},{value:u,type:"u32"},{value:J,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let dr=E(r,pr.getBindGroupLayout(0),[ar,Z,$]),sr=F?Y:Z,or=F?m:J,wr=F?Z:Y;rr=I(r,[{value:R,type:"u32"},{value:T,type:"u32"},{value:j,type:"u32"},{value:l,type:"f32"},{value:0,type:"f32"},{value:or,type:"u32"},{value:F?J:m,type:"u32"},{value:m,type:"u32"},{value:q==="transpose"?1:0,type:"u32"},{value:V==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let Nr=E(r,lr.getBindGroupLayout(0),[sr,Br(r,sr),wr,Br(r,wr),H,rr]),{commandEncoder:Dr,querySet:vr}=Mr(r);Dr.copyBufferToBuffer(Y,0,H,0,Math.min(Y.size,H.size));let br=vr?{timestampWrites:{querySet:vr,beginningOfPassWriteIndex:0}}:void 0,gr=vr?{timestampWrites:{querySet:vr,endOfPassWriteIndex:1}}:void 0;mr(Dr,pr,dr,{x:Math.ceil(y/8),y:Math.ceil(y/8)},br),mr(Dr,lr,Nr,tr,gr);let Ir=_r(r,Dr,vr),hr=w?null:N(r,Dr,H);P(r,Dr);let Cr=await M(Ir);if(w)return p(f._buf),f._buf=H,fr=!0,Cr!==void 0?{gpuTimeMs:Cr}:{};let Wr=await S(hr,Float32Array);return Cr!==void 0?{B:Wr,gpuTimeMs:Cr}:{B:Wr}}finally{!c&&ar&&p(ar),!w&&Y&&p(Y),Z&&p(Z),H&&!fr&&p(H),$&&p($),rr&&p(rr)}}async function Io(r,t,e,a,o,s,i,l,n,u,f,m,d="row-major"){let c=n instanceof O,w=f instanceof O,g=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(L(r,"strsm",{A:n,B:f}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(u)||!Number.isInteger(m))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(f instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:f};let h=c?n.layout:d,b=w?f.layout:d,y=t==="left"?s:i;if(u<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(u!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<y||n.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(y-1)*u+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,v=b==="column-major"?s:i;if(m<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(m!==f.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(f.rows<s||f.cols<i)throw new Error("B is too small for the given m and n.")}else if(f.length<(_-1)*m+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?e==="lower"?"upper":"lower":e,k=h==="column-major"?a==="no-transpose"?"transpose":"no-transpose":a,B=t==="left"?i:s,C=t==="left",R=k==="no-transpose"==(A==="lower"),T=t==="left"?R:!R,j=[];for(let Y=0;Y<y;Y+=64)j.push(Y);T||j.reverse();let q=j.length,V=await G(r,"strsv_invert_block"),z=await G(r,"block_transfer"),F=await G(r,"sscal"),J=null,X=null,Q=null,ur=[],lr=[];function pr(Y,Z){let H=er(r,Y,Z);return lr.push(H),H}function tr(Y,Z){let H=I(r,Y,Z);return ur.push(H),H}let ar=(_-1)*m+v;try{J=c?n._buf:x(r,n,"strsm-A",!1),X=w?f._buf:x(r,f,"strsm-B",!0),Q=er(r,q*64*64*4,"strsm-Ainv");let Y=null;if(l!==1){let vr=tr([{value:ar,type:"u32"},{value:l,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");Y=E(r,F.getBindGroupLayout(0),[X,vr])}let Z=tr([{value:y,type:"u32"},{value:u,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),H=E(r,V.getBindGroupLayout(0),[J,Q,Z]),$=pr(64*B*4,"strsm-Bblock"),rr=pr(64*B*4,"strsm-Xblock"),fr=pr(y*64*4,"strsm-Aoff"),dr=pr(y*B*4,"strsm-delta"),{commandEncoder:sr,querySet:or}=Mr(r);if(l===0){let vr=or?{timestampWrites:{querySet:or,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0;mr(sr,F,Y,xr(r,ar),vr)}else{Y&&mr(sr,F,Y,xr(r,ar)),mr(sr,V,H,{x:64,y:q},or?{timestampWrites:{querySet:or,beginningOfPassWriteIndex:0}}:void 0);for(let br=0;br<j.length;br++){let gr=j[br],Ir=Math.min(gr+64,y),hr=Ir-gr,Cr=gr/64,Wr=br===j.length-1,Ur=tr([{value:gr,type:"u32"},{value:hr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:C?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),te=E(r,z.getBindGroupLayout(0),[$,X,Ur]);mr(sr,z,te,Or(r,"strsm",hr,B));{let Fr=hr,qr=B,me=hr,Xr=Math.ceil(qr/64),$r=Math.ceil(Fr/64),Zr=Xr*$r>=36,Qr=await G(r,Zr?"sgemm_large":"sgemm_small"),ce=tr([{value:Fr,type:"u32"},{value:qr,type:"u32"},{value:me,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:64,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:t==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),ae={buffer:Q,offset:Cr*64*64*4,size:4096*4},pe=E(r,Qr.getBindGroupLayout(0),[ae,Br(r,ae),$,Br(r,$),rr,ce]),Oo=Zr?{x:K(r,Xr,"strsm","x"),y:K(r,$r,"strsm","y")}:{x:K(r,Math.ceil(qr/32),"strsm","x"),y:K(r,Math.ceil(Fr/32),"strsm","y")};mr(sr,Qr,pe,Oo)}let oe=T?Ir:0,Ae=T?y:gr,Ee=oe<Ae,Ro=tr([{value:gr,type:"u32"},{value:hr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:C?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),To=E(r,z.getBindGroupLayout(0),[rr,X,Ro]),Lo=Wr&&!Ee&&or?{timestampWrites:{querySet:or,endOfPassWriteIndex:1}}:void 0;if(mr(sr,z,To,Or(r,"strsm",hr,B),Lo),!Ee)continue;let Yr=Ae-oe,Co=tr([{value:oe,type:"u32"},{value:Yr,type:"u32"},{value:gr,type:"u32"},{value:hr,type:"u32"},{value:u,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:C?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),jo=E(r,z.getBindGroupLayout(0),[fr,J,Co]);mr(sr,z,jo,Or(r,"strsm",Yr,hr));{let Fr=Yr,qr=B,me=hr,Xr=Math.ceil(qr/64),$r=Math.ceil(Fr/64),Zr=Xr*$r>=36,Qr=await G(r,Zr?"sgemm_large":"sgemm_small"),ce=tr([{value:Fr,type:"u32"},{value:qr,type:"u32"},{value:me,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:hr,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),ae=E(r,Qr.getBindGroupLayout(0),[fr,Br(r,fr),rr,Br(r,rr),dr,ce]),pe=Zr?{x:K(r,Xr,"strsm","x"),y:K(r,$r,"strsm","y")}:{x:K(r,Math.ceil(qr/32),"strsm","x"),y:K(r,Math.ceil(Fr/32),"strsm","y")};mr(sr,Qr,ae,pe)}let Wo=tr([{value:oe,type:"u32"},{value:Yr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:m,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:C?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),Fo=E(r,z.getBindGroupLayout(0),[dr,X,Wo]),qo=Wr&&or?{timestampWrites:{querySet:or,endOfPassWriteIndex:1}}:void 0;mr(sr,z,Fo,Or(r,"strsm",Yr,B),qo)}}let wr=_r(r,sr,or),Pr=w?null:N(r,sr,X);P(r,sr);let Nr=await M(wr);if(w)return Nr!==void 0?{gpuTimeMs:Nr}:{};let Dr=await S(Pr,Float32Array);return Nr!==void 0?{B:Dr,gpuTimeMs:Nr}:{B:Dr}}finally{!c&&J&&p(J),!w&&X&&p(X),Q&&p(Q),p(lr),p(ur)}}return Yo(Oa);})();
