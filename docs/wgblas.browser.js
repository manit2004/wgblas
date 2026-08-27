var wgblas=(()=>{var Lo=Object.create;var se=Object.defineProperty;var Wo=Object.getOwnPropertyDescriptor;var Fo=Object.getOwnPropertyNames;var qo=Object.getPrototypeOf,Uo=Object.prototype.hasOwnProperty;var ne=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var V=(r,t,e)=>()=>{if(e)throw e[0];try{return r&&(t=r(r=0)),t}catch(a){throw e=[a],a}};var Ee=(r,t)=>{for(var e in t)se(r,e,{get:t[e],enumerable:!0})},Ae=(r,t,e,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Fo(t))!Uo.call(r,o)&&o!==e&&se(r,o,{get:()=>t[o],enumerable:!(a=Wo(t,o))||a.enumerable});return r};var ie=(r,t,e)=>(e=r!=null?Lo(qo(r)):{},Ae(t||!r||!r.__esModule?se(e,"default",{value:r,enumerable:!0}):e,r)),Oo=r=>Ae(se({},"__esModule",{value:!0}),r);var ge,Ce=V(()=>{ge=`// sscal: x = alpha * x

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
`});var We,Le=V(()=>{We=`// sswap: x <-> y

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
`});var qe,Fe=V(()=>{qe=`// saxpy: y = alpha * x + y

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
`});var Oe,Ue=V(()=>{Oe=`// scopy: y = x

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
`});var Ve,Ke=V(()=>{Ve=`// sdot: result = sum(x[i] * y[i])
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
`});var be,ze=V(()=>{be=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var Ye,He=V(()=>{Ye=`// sasum: result = sum(|x[i]|)
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
`});var $e,Xe=V(()=>{$e=`// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
`});var Qe,Ze=V(()=>{Qe=`// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
`});var rt,Je=V(()=>{rt=`// isamax: returns index of element with largest absolute value
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
`});var tt,et=V(()=>{tt=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var he,ot=V(()=>{he=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var ye,at=V(()=>{ye=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var nt,st=V(()=>{nt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var ut,it=V(()=>{ut=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var mt,lt=V(()=>{mt=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var ct,ft=V(()=>{ct=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var dt,pt=V(()=>{dt=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var gt,wt=V(()=>{gt=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var ht,bt=V(()=>{ht=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var xt,yt=V(()=>{xt=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var _t,vt=V(()=>{_t=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Et,Bt=V(()=>{Et=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Gt,At=V(()=>{Gt=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var kt,St=V(()=>{kt=`// ssymv: y = alpha * A * x + beta * y
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
`});var Mt,Nt=V(()=>{Mt=`// strmv: y = op(A) * x
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
`});var xe,It=V(()=>{xe=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var Pt,Rt=V(()=>{Pt=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Tt,Dt=V(()=>{Tt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var Ct,jt=V(()=>{Ct=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Wt,Lt=V(()=>{Wt=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var qt,Ft=V(()=>{qt=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var re,Ut=V(()=>{re=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var ee,Ot=V(()=>{ee=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var ue,Kt=V(()=>{ue=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var le,Vt=V(()=>{le=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var Ht,zt=V(()=>{Ht=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var Xt,Yt=V(()=>{Xt=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`});var Zt,$t=V(()=>{Zt=`// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
`});var Qt={};Ee(Qt,{routineShaders:()=>nr,shaderSources:()=>Ia});var nr,Ia,Jt=V(()=>{Ce();Le();Fe();Ue();Ke();ze();He();Xe();Ze();Je();et();ot();at();st();it();lt();ft();pt();wt();bt();yt();vt();Bt();At();St();Nt();It();Rt();Dt();jt();Lt();Ft();Ut();Ot();Kt();Vt();zt();Yt();$t();nr={};nr.sscal={sscal:ge};nr.sswap={sswap:We};nr.saxpy={saxpy:qe};nr.scopy={scopy:Oe};nr.sdot={sdot:Ve,"reduction/sum":be};nr.sasum={sasum:Ye,"reduction/sum":be};nr.snrm2={snrm2:$e,"reduction/scaledSum":Qe};nr.isamax={isamax:rt,"reduction/argmax":tt};nr.dasum={"f64/dekker":he,"f64/utils/abs":ye,"f64/utils/add":nt,dasum:ut,"reduction/sumF64":mt};nr.idamax={"f64/dekker":he,"f64/utils/abs":ye,"f64/utils/greater":ct,"f64/utils/equal":dt,idamax:gt,"reduction/argmaxF64":ht};nr.srot={srot:xt};nr.srotm={srotm:_t};nr.sgemv={sgemv_n:Et,sgemv_t:Gt};nr.ssymv={ssymv:kt};nr.strmv={strmv:Mt};nr.strsv={strsv_invert_block:xe,strsv_apply_inverse:Pt,strsv_update:Tt};nr.sger={sger:Ct};nr.ssyr={ssyr:Wt};nr.ssyr2={ssyr2:qt};nr.sgemm={sgemm_small:re,sgemm_large:ee};nr.sgemmtr={sgemmtr_small:ue,sgemmtr_large:le};nr.ssyrk={sgemmtr_small:ue,sgemmtr_large:le};nr.ssyr2k={sgemmtr_small:ue,sgemmtr_large:le};nr.ssymm={sgemm_small:re,sgemm_large:ee,symmetrize:Ht};nr.strmm={sgemm_small:re,sgemm_large:ee,triangularize:Xt};nr.strsm={strsv_invert_block:xe,block_transfer:Zt,sscal:ge,sgemm_small:re,sgemm_large:ee};Ia=Object.assign({},...Object.values(nr))});var Ta={};Ee(Ta,{GpuMatrix:()=>F,GpuVector:()=>I,cleanup:()=>Ie,dasum:()=>no,gpuName:()=>Re,idamax:()=>lo,init:()=>Me,isamax:()=>uo,randomFloat32Array:()=>De,randomFloat64Array:()=>Te,randomTriangularFloat32Array:()=>je,sasum:()=>so,saxpy:()=>to,scopy:()=>oo,sdot:()=>ao,sgemm:()=>_o,sgemmtr:()=>Bo,sgemv:()=>co,sger:()=>yo,snrm2:()=>io,srot:()=>mo,srotm:()=>fo,sscal:()=>ro,sswap:()=>eo,ssymm:()=>Go,ssymv:()=>po,ssyr:()=>xo,ssyr2:()=>vo,ssyr2k:()=>Ao,ssyrk:()=>Eo,strmm:()=>So,strmv:()=>wo,strsm:()=>ko,strsv:()=>ho});function Ge(r,t){return t?r.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Se(r){if(!ke(r))return{querySet:null,passDescriptor:void 0};let t=r.createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function vr(r,t,e){if(!e)return null;let a=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(e,0,2,a,0);let o=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:e}}async function M(r){if(!r)return;let{tsReadBuffer:t,resolveBuffer:e,querySet:a}=r;await t.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),e.destroy(),a.destroy(),Math.max(0,Number(o[1]-o[0]))/1e6}var Or=null,pe=!1,Kr=new Map,Jr=new WeakMap,Tr=null,Ne=({powerPreference:r,benchmark:t})=>`${r}::${t}`;async function Me({powerPreference:r="high-performance",benchmark:t=!1,dumpShaders:e=!1}={}){let a={powerPreference:r,benchmark:t,dumpShaders:e},o=Ne(a),s=Kr.get(o);if(s)return s;if(Or)e!==pe&&typeof window>"u"&&console.warn(`dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${pe}. The first init() call fixes this for the process.`);else if(typeof window>"u"){let{create:f,globals:d}=await import("webgpu");Object.assign(globalThis,d),Or=f(e?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),pe=e}else e&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),Or=navigator.gpu;if(!Or)throw new Error("WebGPU not supported in this environment.");let n=await Or.requestAdapter({powerPreference:r})??await Or.requestAdapter();if(!n)throw new Error("No WebGPU adapter found.");let i=[...Ge(n,t).requiredFeatures??[]],u=await n.requestDevice({requiredFeatures:i});u.addEventListener("uncapturederror",f=>{console.error("Uncaptured GPU error:",f.error.message)});let m=i.includes("timestamp-query");return Jr.set(u,{adapter:n,benchmark:m,options:a}),Kr.set(o,u),Tr||(Tr=u),u}function Ie(r){if(r===void 0){for(let e of Kr.values())e.destroy();Kr.clear(),Tr=null;return}let t=Jr.get(r);t&&(Kr.delete(Ne(t.options)),Jr.delete(r),r.destroy(),Tr===r&&(Tr=Kr.values().next().value??null))}function Re(r=Tr){let t=r&&Jr.get(r);if(!t)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:e,description:a}=t.adapter.info;return{description:a||"unknown",device:e||"unknown"}}function ke(r=Tr){return Jr.get(r)?.benchmark??!1}function Vr(){if(!Tr)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Tr}function p(...r){r.flat().forEach(t=>t.destroy())}function de(r,t,e){let a=r.limits.maxStorageBufferBindingSize;if(t>a)throw new Error(`Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${a} bytes). The operands are too large for this device.`)}function x(r,t,e="blas-input",a=!1){let o=t.byteLength;de(r,o,e);let s=a?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,n=r.createBuffer({label:e,size:o,usage:s,mappedAtCreation:!0}),l=t.constructor;return new l(n.getMappedRange()).set(t),n.unmap(),n}function sr(r,t,e="blas-storage",a=0){return de(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|a})}function Nr(r,t,e="blas-result"){return de(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function N(r,t,e){let a=r.createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(e,0,a,0,e.size),a}var zr=16,Pe=new WeakMap;function Ko(r){let t=Pe.get(r);return t||(t=r.createBuffer({label:"blas-vec4-fallback",size:zr,usage:GPUBufferUsage.STORAGE}),Pe.set(r,t)),t}function _r(r,t){let e=t instanceof GPUBuffer?t:t.buffer,a=t instanceof GPUBuffer?0:t.offset??0,o=t instanceof GPUBuffer?t.size:t.size??e.size-a,s=Math.floor(o/zr)*zr;return s<zr?{buffer:Ko(r),offset:0,size:zr}:{buffer:e,offset:a,size:s}}function we(r,t,e,a){if(t%4!==0)return!1;let o=r instanceof GPUBuffer?r:r.buffer,s=r instanceof GPUBuffer?0:r.offset??0,n=r instanceof GPUBuffer?o.size:r.size??o.size-s,l=Math.floor(n/zr)*4;if(l<=0)return!1;let i=(Math.max(e,1)-1)*t+(Math.max(a,1)-1);return Math.floor(i/4)*4+4<=l}function P(r,t,e="blas-params"){let a=t.length*4,o=Math.ceil(a/16)*16,s=new ArrayBuffer(o),n=new DataView(s);t.forEach(({value:i,type:u},m)=>{let f=m*4;if(u==="u32")n.setUint32(f,i,!0);else if(u==="i32")n.setInt32(f,i,!0);else if(u==="f32")n.setFloat32(f,i,!0);else throw new Error(`Unknown param type "${u}". Use "f32", "u32", or "i32".`)});let l=r.createBuffer({label:e,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(l,0,s),l}async function S(r,t=Float32Array){try{await r.mapAsync(GPUMapMode.READ);let e=new t(r.getMappedRange().slice());return r.unmap(),e}finally{r.destroy()}}function Cr(r){let t=r.length,e=new Float32Array(t),a=new Float32Array(t);for(let o=0;o<t;o++){let s=Math.fround(r[o]);e[o]=s,a[o]=Math.fround(r[o]-s)}return{hi:e,lo:a}}function Hr(r,t){let e=r.length,a=new Float64Array(e);for(let o=0;o<e;o++)a[o]=r[o]+t[o];return a}var I=class r{constructor(t,e,a=Float32Array,o=null,s=null){this._buf=t,this._loBuf=o,this.length=e,this.dtype=a,this.device=s??Vr()}static from(t,e){let a=t instanceof GPUDevice,o=a?t:Vr(),s=a?e:t;if(s instanceof Float64Array){let{hi:l,lo:i}=Cr(s),u=x(o,l,"gpu-vector-f64-hi",!0),m=x(o,i,"gpu-vector-f64-lo",!0);return new r(u,s.length,Float64Array,m,o)}if(!(s instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array or Float64Array.");let n=x(o,s,"gpu-vector",!0);return new r(n,s.length,s.constructor,null,o)}async read(){let t=this.device,e=t.createCommandEncoder(),a=N(t,e,this._buf);if(t.queue.submit([e.finish()]),!this._loBuf)return S(a,this.dtype);let o=t.createCommandEncoder(),s=N(t,o,this._loBuf);t.queue.submit([o.finish()]);let[n,l]=await Promise.all([S(a,Float32Array),S(s,Float32Array)]);return Hr(n,l)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var F=class r{constructor(t,e,a,o,s=null,n="row-major",l=null){this._buf=t,this._loBuf=s,this.rows=e,this.cols=a,this.lda=o,this.layout=n,this.device=l??Vr()}static from(t,...e){let a=t instanceof GPUDevice,o=a?t:Vr(),s=a?e.shift():t,[n,l,i,u="row-major"]=e;if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let m=u==="row-major";if(i===void 0&&(i=m?l:n),!(s instanceof Float32Array)&&!(s instanceof Float64Array))throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");if(!Number.isInteger(n)||n<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(l)||l<=0)throw new Error("cols must be a positive integer.");let f=m?l:n;if(!Number.isInteger(i)||i<f)throw new Error(`lda must be an integer >= ${m?"cols":"rows"}.`);let d=m?n:l;if(s.length<d*i)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(s instanceof Float64Array){let w=d*i,{hi:g,lo:h}=Cr(s.subarray(0,w)),b=x(o,g,"gpu-matrix-f64-hi",!0),y=x(o,h,"gpu-matrix-f64-lo",!0);return new r(b,n,l,i,y,u,o)}let c=x(o,s.subarray(0,d*i),"gpu-matrix",!0);return new r(c,n,l,i,null,u,o)}async read(){let t=this.device,e=t.createCommandEncoder(),a=N(t,e,this._buf);t.queue.submit([e.finish()]);let o=this.layout!=="column-major",s=o?this.rows:this.cols,n=o?this.cols:this.rows;if(this._loBuf){let u=t.createCommandEncoder(),m=N(t,u,this._loBuf);t.queue.submit([u.finish()]);let[f,d]=await Promise.all([S(a,Float32Array),S(m,Float32Array)]),c=Hr(f,d);if(this.lda===n)return c;let w=new Float64Array(s*n);for(let g=0;g<s;g++)w.set(c.subarray(g*this.lda,g*this.lda+n),g*n);return w}let l=await S(a,Float32Array);if(this.lda===n)return l;let i=new Float32Array(s*n);for(let u=0;u<s;u++)i.set(l.subarray(u*this.lda,u*this.lda+n),u*n);return i}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function De(r,t=-1,e=1){let a=new Float32Array(r);for(let o=0;o<r;o++)a[o]=t+Math.random()*(e-t);return a}function Te(r,t=-1,e=1){let a=new Float64Array(r);for(let o=0;o<r;o++)a[o]=t+Math.random()*(e-t);return a}function je(r,t,e="lower",a=-1,o=1,s=5,n=15){if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(t<r)throw new Error("lda must be >= n.");let l=new Float32Array(r*t);for(let i=0;i<r;i++){for(let u=0;u<r;u++){if(i===u)continue;(e==="lower"?u<i:u>i)&&(l[i*t+u]=a+Math.random()*(o-a))}l[i*t+i]=s+Math.random()*(n-s)}return l}function E(r,t,e,a=0){let o=e.map((s,n)=>({binding:a+n,resource:s instanceof GPUBuffer?{buffer:s}:s}));return r.createBindGroup({layout:t,entries:o})}var Vo=new WeakMap;function R(r,t){r.queue.submit([t.finish()])}function Mr(r){let{querySet:t,passDescriptor:e}=Se(r);return{commandEncoder:r.createCommandEncoder(),querySet:t,passDescriptor:e}}function ur(r,t,e,a,o){let s=r.beginComputePass(o);s.setPipeline(t),s.setBindGroup(0,e),typeof a=="number"?s.dispatchWorkgroups(a):s.dispatchWorkgroups(a.x,a.y,a.z??1),s.end(),Vo.set(r,s)}function W(r,t,e,a){let{commandEncoder:o,querySet:s,passDescriptor:n}=Mr(r);ur(o,t,e,a,n);let l=vr(r,o,s);return{commandEncoder:o,ts:l}}var Da={},ve=new WeakMap;async function G(r,t,e="main"){ve.has(r)||ve.set(r,new Map);let a=ve.get(r),o=Array.isArray(t)?t:[t],s=`${o.join("+")}::${e}`;return a.has(s)||a.set(s,await Pa(r,o,e)),a.get(s)}async function Ra(r){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(Jt(),Qt)),e=t[r];if(!e)throw new Error(`Shader "${r}" not found in browser bundle.`);return e}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),s=a(e(Da.url));return t(o(s,`../shaders/${r}.wgsl`),"utf8")}}async function Pa(r,t,e="main"){let a=t.join("+"),o=(await Promise.all(t.map(Ra))).join(`
`),s=r.createShaderModule({label:a,code:o}),l=(await s.getCompilationInfo()).messages.filter(m=>m.type==="error");if(l.length>0)throw new Error(`Shader "${a}" compilation failed:
${l.map(m=>`  line ${m.lineNum}: ${m.message}`).join(`
`)}`);let i=e==="main"?{module:s}:{module:s,entryPoint:e},u=r.createComputePipeline({label:a,layout:"auto",compute:i});return u._shaderModule=s,u}function yr(r,t,e){let a=r.limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(t/64),a):{x:Math.min(Math.ceil(e/8),a),y:Math.min(Math.ceil(t/8),a)}}function O(r,t,e,a="x"){let o=r.limits.maxComputeWorkgroupsPerDimension;if(t>o)throw new Error(`${e}: this problem needs ${t} workgroups in ${a}, but the device allows ${o} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`);return t}function qr(r,t,e,a){return a===void 0?O(r,Math.ceil(e/64),t):{x:O(r,Math.ceil(a/8),t,"x"),y:O(r,Math.ceil(e/8),t,"y")}}function T(r,t,e){for(let[a,o]of Object.entries(e))if(!(!(o instanceof I)&&!(o instanceof F))&&o.device!==r)throw new Error(`${t}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`)}async function ro(r,t,e,a,o){let s=a instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sscal",{x:a}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return s?{}:{x:a};if(a.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await G(r,"sscal"),l=null,i=null,u=null;try{l=s?a._buf:x(r,a,"sscal-x",!0),i=P(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params");let m=E(r,n.getBindGroupLayout(0),[l,i]),{commandEncoder:f,ts:d}=W(r,n,m,yr(r,t));u=s?null:N(r,f,l),R(r,f);let c=await M(d);if(s)return c!==void 0?{gpuTimeMs:c}:{};let w=await S(u,Float32Array);return u=null,c!==void 0?{x:w,gpuTimeMs:c}:{x:w}}finally{!s&&l&&p(l),i&&p(i),u&&p(u)}}async function eo(r,t,e,a,o,s){let n=e instanceof I,l=o instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sswap",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof I))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof I))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let i=await G(r,"sswap"),u=null,m=null,f=null,d=null,c=null;try{u=n?e._buf:x(r,e,"sswap-x",!0),m=l?o._buf:x(r,o,"sswap-y",!0),f=P(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"sswap-params");let w=E(r,i.getBindGroupLayout(0),[u,m,f]),{commandEncoder:g,ts:h}=W(r,i,w,yr(r,t));d=n?null:N(r,g,u),c=l?null:N(r,g,m),R(r,g);let b=await M(h);if(n&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(d,Float32Array);d=null;let _=await S(c,Float32Array);return c=null,b!==void 0?{x:y,y:_,gpuTimeMs:b}:{x:y,y:_}}finally{!n&&u&&p(u),!l&&m&&p(m),f&&p(f),d&&p(d),c&&p(c)}}async function to(r,t,e,a,o,s,n){let l=a instanceof I,i=s instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"saxpy",{x:a,y:s}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(o<=0||n<=0)throw new Error("incx and incy must be positive.");if(!l&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!i&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==i)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return i?{}:{y:s};if(a.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(r,"saxpy"),m=null,f=null,d=null,c=null;try{m=l?a._buf:x(r,a,"saxpy-x",!1),f=i?s._buf:x(r,s,"saxpy-y",!0),d=P(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:n,type:"u32"}],"saxpy-params");let w=E(r,u.getBindGroupLayout(0),[m,f,d]),{commandEncoder:g,ts:h}=W(r,u,w,yr(r,t));c=i?null:N(r,g,f),R(r,g);let b=await M(h);if(i&&l)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(c,Float32Array);return c=null,b!==void 0?{y,gpuTimeMs:b}:{y}}finally{!l&&m&&p(m),!i&&f&&p(f),d&&p(d),c&&p(c)}}async function oo(r,t,e,a,o,s){let n=e instanceof I,l=o instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"scopy",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return l?{}:{y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let i=await G(r,"scopy"),u=null,m=null,f=null,d=null;try{u=n?e._buf:x(r,e,"scopy-x",!1),m=l?o._buf:x(r,o,"scopy-y",!0),f=P(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"scopy-params");let c=E(r,i.getBindGroupLayout(0),[u,m,f]),{commandEncoder:w,ts:g}=W(r,i,c,yr(r,t));d=l?null:N(r,w,m),R(r,w);let h=await M(g);if(l&&n)return h!==void 0?{gpuTimeMs:h}:{};let b=await S(d,Float32Array);return d=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!n&&u&&p(u),!l&&m&&p(m),f&&p(f),d&&p(d)}}async function ao(r,t,e,a,o,s){let n=e instanceof I,l=o instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sdot",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let i=await G(r,"sdot"),u=await G(r,"reduction/sum"),m=null,f=null,d=null,c=null,w=null,g=null;try{m=n?e._buf:x(r,e,"sdot-x",!1),f=l?o._buf:x(r,o,"sdot-y",!1),d=sr(r,512,"sdot-partials"),c=Nr(r,4,"sdot-result"),w=P(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"sdot-params");let h=E(r,i.getBindGroupLayout(0),[m,f,d,w]),{commandEncoder:b,ts:y}=W(r,i,h,128);R(r,b);let _=E(r,u.getBindGroupLayout(0),[d,c]),{commandEncoder:v,ts:A}=W(r,u,_,1);g=N(r,v,c),R(r,v);let k=S(g,Float32Array);g=null;let[B,j,D]=await Promise.all([M(y),M(A),k]);return B!==void 0&&j!==void 0?{dot:D[0],gpuTimeMs:B+j}:{dot:D[0]}}finally{!n&&m&&p(m),!l&&f&&p(f),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function so(r,t,e,a){let o=e instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"sasum"),n=await G(r,"reduction/sum"),l=null,i=null,u=null,m=null,f=null;try{l=o?e._buf:x(r,e,"sasum-x",!1),i=sr(r,512,"sasum-partials"),u=Nr(r,4,"sasum-result"),m=P(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"sasum-params");let d=E(r,s.getBindGroupLayout(0),[l,i,m]),{commandEncoder:c,ts:w}=W(r,s,d,128);R(r,c);let g=E(r,n.getBindGroupLayout(0),[i,u]),{commandEncoder:h,ts:b}=W(r,n,g,1);f=N(r,h,u),R(r,h);let y=S(f,Float32Array);f=null;let[_,v,A]=await Promise.all([M(w),M(b),y]);return _!==void 0&&v!==void 0?{asum:A[0],gpuTimeMs:_+v}:{asum:A[0]}}finally{!o&&l&&p(l),i&&p(i),u&&p(u),m&&p(m),f&&p(f)}}async function no(r,t,e,a){let o=e instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"dasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(o&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/add"],n=await G(r,[...s,"dasum"]),l=await G(r,[...s,"reduction/sumF64"]),i=null,u=null,m=null,f=null,d=null,c=null,w=null,g=null,h=null;try{if(o)i=e._buf,u=e._loBuf;else{let{hi:X,lo:q}=Cr(e.map(Math.abs));i=x(r,X,"dasum-xHi",!1),u=x(r,q,"dasum-xLo",!1)}m=sr(r,512,"dasum-partialsHi"),f=sr(r,512,"dasum-partialsLo"),d=Nr(r,4,"dasum-result-hi"),c=Nr(r,4,"dasum-result-lo"),w=P(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"dasum-params");let b=E(r,n.getBindGroupLayout(0),[i,u,m,f,w]),{commandEncoder:y,ts:_}=W(r,n,b,128);R(r,y);let v=E(r,l.getBindGroupLayout(0),[m,f,d,c]),{commandEncoder:A,ts:k}=W(r,l,v,1);g=N(r,A,d),h=N(r,A,c),R(r,A);let B=S(g,Float32Array),j=S(h,Float32Array);g=null,h=null;let[D,C,L,U]=await Promise.all([M(_),M(k),B,j]),H=Hr(L,U)[0];return D!==void 0&&C!==void 0?{asum:H,gpuTimeMs:D+C}:{asum:H}}finally{!o&&i&&p(i),!o&&u&&p(u),m&&p(m),f&&p(f),d&&p(d),c&&p(c),w&&p(w),g&&p(g),h&&p(h)}}async function io(r,t,e,a){let o=e instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"snrm2",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"snrm2"),n=await G(r,"reduction/scaledSum"),l=null,i=null,u=null,m=null,f=null,d=null;try{l=o?e._buf:x(r,e,"snrm2-x",!1),i=sr(r,512,"snrm2-partials-scale"),u=sr(r,512,"snrm2-partials-ssq"),m=Nr(r,4,"snrm2-result"),f=P(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"snrm2-params");let c=E(r,s.getBindGroupLayout(0),[l,i,u,f]),{commandEncoder:w,ts:g}=W(r,s,c,128);R(r,w);let h=E(r,n.getBindGroupLayout(0),[i,u,m]),{commandEncoder:b,ts:y}=W(r,n,h,1);d=N(r,b,m),R(r,b);let _=S(d,Float32Array);d=null;let[v,A,k]=await Promise.all([M(g),M(y),_]),B=k[0];return v!==void 0&&A!==void 0?{nrm2:B,gpuTimeMs:v+A}:{nrm2:B}}finally{!o&&l&&p(l),i&&p(i),u&&p(u),m&&p(m),f&&p(f),d&&p(d)}}async function uo(r,t,e,a){let o=e instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"isamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"isamax"),n=await G(r,"reduction/argmax"),l=null,i=null,u=null,m=null,f=null,d=null;try{l=o?e._buf:x(r,e,"isamax-x",!1),i=sr(r,512,"isamax-partials-val"),u=sr(r,512,"isamax-partials-idx"),m=Nr(r,4,"isamax-result"),f=P(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"isamax-params");let c=E(r,s.getBindGroupLayout(0),[l,i,u,f]),{commandEncoder:w,ts:g}=W(r,s,c,128);R(r,w);let h=E(r,n.getBindGroupLayout(0),[i,u,m]),{commandEncoder:b,ts:y}=W(r,n,h,1);d=N(r,b,m),R(r,b);let _=S(d,Uint32Array);d=null;let[v,A,k]=await Promise.all([M(g),M(y),_]),B=k[0];return v!==void 0&&A!==void 0?{index:B,gpuTimeMs:v+A}:{index:B}}finally{!o&&l&&p(l),i&&p(i),u&&p(u),m&&p(m),f&&p(f),d&&p(d)}}async function lo(r,t,e,a){let o=e instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"idamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(o&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],n=await G(r,[...s,"idamax"],"idamax_main"),l=await G(r,[...s,"reduction/argmaxF64"],"reduce_f64"),i=null,u=null,m=null,f=null,d=null,c=null,w=null,g=null;try{if(o)i=e._buf,u=e._loBuf;else{let{hi:L,lo:U}=Cr(e);i=x(r,L,"idamax-xHi",!1),u=x(r,U,"idamax-xLo",!1)}m=sr(r,512,"idamax-partials-val-hi"),f=sr(r,512,"idamax-partials-val-lo"),d=sr(r,512,"idamax-partials-idx"),c=Nr(r,4,"idamax-result"),w=P(r,[{value:t,type:"u32"},{value:a,type:"u32"}],"idamax-params");let h=E(r,n.getBindGroupLayout(0),[i,u,m,f,d,w]),{commandEncoder:b,ts:y}=W(r,n,h,128);R(r,b);let _=E(r,l.getBindGroupLayout(0),[m,f,d,c]),{commandEncoder:v,ts:A}=W(r,l,_,1);g=N(r,v,c),R(r,v);let k=S(g,Uint32Array);g=null;let[B,j,D]=await Promise.all([M(y),M(A),k]),C=D[0];return B!==void 0&&j!==void 0?{index:C,gpuTimeMs:B+j}:{index:C}}finally{!o&&i&&p(i),!o&&u&&p(u),m&&p(m),f&&p(f),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function mo(r,t,e,a,o,s,n,l){let i=e instanceof I,u=o instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"srot",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof n!="number")throw new Error("c must be a number.");if(typeof l!="number")throw new Error("s must be a number.");if(Number.isNaN(n)||Number.isNaN(l))throw new Error("c and s must not be NaN.");if(!Number.isFinite(n))throw new Error("c must be finite.");if(!Number.isFinite(l))throw new Error("s must be finite.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return i?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let m=await G(r,"srot"),f=null,d=null,c=null,w=null,g=null;try{f=i?e._buf:x(r,e,"srot-x",!0),d=u?o._buf:x(r,o,"srot-y",!0),c=P(r,[{value:t,type:"u32"},{value:n,type:"f32"},{value:l,type:"f32"},{value:a,type:"u32"},{value:s,type:"u32"}],"srot-params");let h=E(r,m.getBindGroupLayout(0),[f,d,c]),{commandEncoder:b,ts:y}=W(r,m,h,yr(r,t));w=i?null:N(r,b,f),g=u?null:N(r,b,d),R(r,b);let _=await M(y);if(i&&u)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),A=S(g,Float32Array);w=null,g=null;let[k,B]=await Promise.all([v,A]);return _!==void 0?{x:k,y:B,gpuTimeMs:_}:{x:k,y:B}}finally{!i&&f&&p(f),!u&&d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function fo(r,t,e,a,o,s,n){let l=e instanceof I,i=o instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"srotm",{x:e,y:o}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(!(n instanceof Float32Array)||n.length!==5)throw new Error("param must be a Float32Array of length 5.");if(n[0]!==-2&&n[0]!==-1&&n[0]!==0&&n[0]!==1)throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");if(a<=0||s<=0)throw new Error("incx and incy must be positive.");if(!l&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!i&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(l!==i)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||n[0]===-2)return l?{}:{x:e,y:o};if(e.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(r,"srotm"),m=null,f=null,d=null,c=null,w=null,g=null;try{m=l?e._buf:x(r,e,"srotm-x",!0),f=i?o._buf:x(r,o,"srotm-y",!0),d=x(r,n,"srotm-param",!1),c=P(r,[{value:t,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"}],"srotm-params");let h=E(r,u.getBindGroupLayout(0),[m,f,d,c]),{commandEncoder:b,ts:y}=W(r,u,h,yr(r,t));w=l?null:N(r,b,m),g=i?null:N(r,b,f),R(r,b);let _=await M(y);if(l&&i)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),A=S(g,Float32Array);w=null,g=null;let[k,B]=await Promise.all([v,A]);return _!==void 0?{x:k,y:B,gpuTimeMs:_}:{x:k,y:B}}finally{!l&&m&&p(m),!i&&f&&p(f),d&&p(d),c&&p(c),w&&p(w),g&&p(g)}}async function co(r,t,e,a,o,s,n,l,i,u,m,f,d="row-major"){let c=s instanceof F,w=l instanceof I,g=m instanceof I;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sgemv",{A:s,x:l,y:m}),t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(a)||!Number.isInteger(i)||!Number.isInteger(f)||!Number.isInteger(n))throw new Error("m, n, incx, incy, and lda must be integers.");if(i<=0||f<=0)throw new Error("incx and incy must be positive.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(m instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&l._buf===m._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&g&&s._buf===m._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&n!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(s.rows<e||s.cols<a))throw new Error("A is too small for the given m and n.");if(e<0||a<0)throw new Error("m and n must be non-negative.");if(e===0||a===0)return g?{}:{y:m};(c?s.layout:d)==="column-major"&&([e,a]=[a,e],t=t==="no-transpose"?"transpose":"no-transpose");let b=t==="no-transpose",y=b?a:e,_=b?e:a;if(n<a)throw new Error("lda must be >= n.");if(!c&&s.length<(e-1)*n+a)throw new Error("A does not have enough elements for the given m, n, and lda.");if(l.length<(y-1)*i+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(m.length<(_-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let A=await G(r,b?"sgemv_n":"sgemv_t"),k=null,B=null,j=null,D=null;try{k=c?s._buf:x(r,s,"sgemv-A",!1),B=w?l._buf:x(r,l,"sgemv-x",!1),j=g?m._buf:x(r,m,"sgemv-y",!0),D=P(r,[{value:e,type:"u32"},{value:a,type:"u32"},{value:o,type:"f32"},{value:u,type:"f32"},{value:i,type:"u32"},{value:f,type:"u32"},{value:n,type:"u32"}],"sgemv-params");let C=E(r,A.getBindGroupLayout(0),[k,B,j,D]),L=b?Math.min(e,r.limits.maxComputeWorkgroupsPerDimension):qr(r,"sgemv",_),{commandEncoder:U,ts:H}=W(r,A,C,L),X=g?null:N(r,U,j);R(r,U);let q=await M(H);if(g)return q!==void 0?{gpuTimeMs:q}:{};let J=await S(X,Float32Array);return q!==void 0?{y:J,gpuTimeMs:q}:{y:J}}finally{!c&&k&&p(k),!w&&B&&p(B),!g&&j&&p(j),D&&p(D)}}async function po(r,t,e,a,o,s,n,l,i,u,m,f="row-major"){let d=n instanceof I,c=u instanceof I,w=o instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssymv",{A:o,x:n,y:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(l)||!Number.isInteger(m)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof i!="number")throw new Error("beta must be a number.");if(Number.isNaN(i))throw new Error("beta must not be NaN.");if(!Number.isFinite(i))throw new Error("beta must be finite.");if(l<=0||m<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!w&&!(o instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(n instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(d&&n._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&s!==o.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(o.rows<e||o.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{y:u};if(!w&&o.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(n.length<(e-1)*l+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(e-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?o.layout:f)==="column-major"?t==="upper":t==="lower",b=await G(r,"ssymv"),y=null,_=null,v=null,A=null;try{y=w?o._buf:x(r,o,"ssymv-A",!1),_=d?n._buf:x(r,n,"ssymv-x",!1),v=c?u._buf:x(r,u,"ssymv-y",!0),A=P(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:i,type:"f32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let k=E(r,b.getBindGroupLayout(0),[y,_,v,A]),B=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:j,ts:D}=W(r,b,k,B),C=c?null:N(r,j,v);R(r,j);let L=await M(D);if(c)return L!==void 0?{gpuTimeMs:L}:{};let U=await S(C,Float32Array);return L!==void 0?{y:U,gpuTimeMs:L}:{y:U}}finally{!w&&y&&p(y),!d&&_&&p(_),!c&&v&&p(v),A&&p(A)}}async function wo(r,t,e,a,o,s,n,l,i,u,m,f="row-major"){let d=l instanceof I,c=u instanceof I,w=s instanceof F,g=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"strmv",{A:s,x:l,y:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(o)||!Number.isInteger(i)||!Number.isInteger(m)||!Number.isInteger(n))throw new Error("n, incx, incy, and lda must be integers.");if(i<=0||m<=0)throw new Error("incx and incy must be positive.");if(n<o)throw new Error("lda must be >= n.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!d&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(d!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(d&&l._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(d&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!d)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&c&&s._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&n!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(s.rows<o||s.cols<o))throw new Error("A is too small for the given n.");if(o<0)throw new Error("n must be non-negative.");if(o===0)return c?{}:{y:u};if(!w&&s.length<(o-1)*n+o)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(o-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");if(u.length<(o-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?s.layout:f)==="column-major",y=b?t==="upper":t==="lower",_=b?e==="transpose":e==="no-transpose",v=await G(r,"strmv"),A=null,k=null,B=null,j=null;try{A=w?s._buf:x(r,s,"strmv-A",!1),k=d?l._buf:x(r,l,"strmv-x",!1),B=c?u._buf:x(r,u,"strmv-y",!0),j=P(r,[{value:o,type:"u32"},{value:i,type:"u32"},{value:m,type:"u32"},{value:n,type:"u32"},{value:_?0:1,type:"u32"},{value:y?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let D=E(r,v.getBindGroupLayout(0),[A,k,B,j]),C=Math.min(o,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:L,ts:U}=W(r,v,D,C),H=c?null:N(r,L,B);R(r,L);let X=await M(U);if(c)return X!==void 0?{gpuTimeMs:X}:{};let q=await S(H,Float32Array);return X!==void 0?{y:q,gpuTimeMs:X}:{y:q}}finally{!w&&A&&p(A),!d&&k&&p(k),!c&&B&&p(B),j&&p(j)}}function go(r,t,e){let a=new ArrayBuffer(r*t),o=new DataView(a);for(let s=0;s<r;s++){let n=e(s),l=s*t;n.forEach((i,u)=>o.setUint32(l+u*4,i,!0))}return a}function bo(r,t,e){let a=r.createBuffer({label:e,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(a,0,t),a}async function ho(r,t,e,a,o,s,n,l,i,u="row-major"){let m=l instanceof I,f=s instanceof F,d=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"strsv",{A:s,x:l}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!d&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(o)||!Number.isInteger(i)||!Number.isInteger(n))throw new Error("n, incx, and lda must be integers.");if(i<=0)throw new Error("incx must be positive.");if(n<o)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!m&&!(l instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(m&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!m)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&m&&s._buf===l._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&n!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<o||s.cols<o))throw new Error("A is too small for the given n.");if(o<0)throw new Error("n must be non-negative.");if(o===0)return m?{}:{x:l};if(!f&&s.length<(o-1)*n+o)throw new Error("A does not have enough elements for the given n and lda.");if(l.length<(o-1)*i+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(f?s.layout:u)==="column-major",g=w?t==="upper":t==="lower",h=w?e==="transpose":e==="no-transpose",b=await G(r,"strsv_invert_block"),y=await G(r,"strsv_apply_inverse"),_=await G(r,"strsv_update"),v=h===g,A=[];for(let q=0;q<o;q+=64)A.push(q);v||A.reverse();let k=A.length,B=r.limits.maxComputeWorkgroupsPerDimension,j=r.limits.minUniformBufferOffsetAlignment,D=null,C=null,L=null,U=null,H=null,X=null;try{D=f?s._buf:x(r,s,"strsv-A",!1),C=m?l._buf:x(r,l,"strsv-x",!0),L=sr(r,k*64*64*4,"strsv-Ainv");let q=go(k,j,$=>{let K=$*64,Y=Math.min(K+64,o);return[i,$,K,Y]});U=bo(r,q,"strsv-apply-params");let J=go(k,j,$=>{let K=$*64,Y=Math.min(K+64,o);return[o,i,n,h?0:1,g?0:1,K,Y]});H=bo(r,J,"strsv-update-params");let{commandEncoder:Z,querySet:rr}=Mr(r);X=P(r,[{value:o,type:"u32"},{value:n,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:d?1:0,type:"u32"}],"strsv-invert-params");let lr=E(r,b.getBindGroupLayout(0),[D,L,X]);ur(Z,b,lr,{x:64,y:k},rr?{timestampWrites:{querySet:rr,beginningOfPassWriteIndex:0}}:void 0);for(let $=0;$<A.length;$++){let K=A[$],Y=Math.min(K+64,o),Q=K/64,ir=$===A.length-1,dr=Q*j,ar=E(r,y.getBindGroupLayout(0),[L,C,{buffer:U,offset:dr,size:16}]);ur(Z,y,ar,1,ir&&rr?{timestampWrites:{querySet:rr,endOfPassWriteIndex:1}}:void 0);let wr=v?o-Y:K;if(wr===0)continue;let Rr=E(r,_.getBindGroupLayout(0),[D,C,{buffer:H,offset:dr,size:32}]),kr=Math.min(wr,B);ur(Z,_,Rr,kr)}let pr=vr(r,Z,rr),er=m?null:N(r,Z,C);R(r,Z);let or=await M(pr);if(m)return or!==void 0?{gpuTimeMs:or}:{};let z=await S(er,Float32Array);return or!==void 0?{x:z,gpuTimeMs:or}:{x:z}}finally{!f&&D&&p(D),!m&&C&&p(C),L&&p(L),U&&p(U),H&&p(H),X&&p(X)}}async function yo(r,t,e,a,o,s,n,l,i,u,m="row-major"){let f=i instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sger",{A:i,x:o,y:n}),m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("m, n, incx, incy, and lda must be integers.");if(s<=0||l<=0)throw new Error("incx and incy must be positive.");if(!f&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(f&&u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(i.rows<t||i.cols<e))throw new Error("A is too small for the given m and n.");(f?i.layout:m)==="column-major"&&([t,e]=[e,t],[o,n]=[n,o],[s,l]=[l,s]);let c=o instanceof I,w=n instanceof I;if(u<e)throw new Error("lda must be >= n.");if(!c&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(n instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(f&&c&&i._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&w&&i._buf===n._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||e<0)throw new Error("m and n must be non-negative.");if(t===0||e===0)return f?{}:{A:i};if(!f&&i.length<(t-1)*u+e)throw new Error("A does not have enough elements for the given m, n, and lda.");if(o.length<(t-1)*s+1)throw new Error("x does not have enough elements for the given m and incx.");if(n.length<(e-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await G(r,"sger"),h=null,b=null,y=null,_=null;try{h=c?o._buf:x(r,o,"sger-x",!1),b=w?n._buf:x(r,n,"sger-y",!1),y=f?i._buf:x(r,i,"sger-A",!0),_=P(r,[{value:t,type:"u32"},{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"}],"sger-params");let v=E(r,g.getBindGroupLayout(0),[h,b,y,_]),A=Math.min(t,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:k,ts:B}=W(r,g,v,A),j=f?null:N(r,k,y);R(r,k);let D=await M(B);if(f)return D!==void 0?{gpuTimeMs:D}:{};let C=await S(j,Float32Array);return D!==void 0?{A:C,gpuTimeMs:D}:{A:C}}finally{!c&&h&&p(h),!w&&b&&p(b),!f&&y&&p(y),_&&p(_)}}async function xo(r,t,e,a,o,s,n,l,i="row-major"){let u=o instanceof I,m=n instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssyr",{A:n,x:o}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(i!=="row-major"&&i!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l))throw new Error("n, incx, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(s<=0)throw new Error("incx must be positive.");if(l<e)throw new Error("lda must be >= n.");if(!m&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!m)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(m&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(m&&u&&n._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(m&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(m&&(n.rows<e||n.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return m?{}:{A:n};if(!m&&n.length<(e-1)*l+e)throw new Error("A does not have enough elements for the given n and lda.");if(o.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");let d=(m?n.layout:i)==="column-major"?t==="upper":t==="lower",c=await G(r,"ssyr"),w=null,g=null,h=null;try{w=u?o._buf:x(r,o,"ssyr-x",!1),g=m?n._buf:x(r,n,"ssyr-A",!0),h=P(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:d?0:1,type:"u32"}],"ssyr-params");let b=E(r,c.getBindGroupLayout(0),[w,g,h]),y=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:_,ts:v}=W(r,c,b,y),A=m?null:N(r,_,g);R(r,_);let k=await M(v);if(m)return k!==void 0?{gpuTimeMs:k}:{};let B=await S(A,Float32Array);return k!==void 0?{A:B,gpuTimeMs:k}:{A:B}}finally{!u&&w&&p(w),!m&&g&&p(g),h&&p(h)}}async function vo(r,t,e,a,o,s,n,l,i,u,m="row-major"){let f=o instanceof I,d=n instanceof I,c=i instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssyr2",{A:i,x:o,y:n}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(l)||!Number.isInteger(u))throw new Error("n, incx, incy, and lda must be integers.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(s<=0||l<=0)throw new Error("incx and incy must be positive.");if(u<e)throw new Error("lda must be >= n.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!d&&!(n instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==d)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!f)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&f&&i._buf===o._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&d&&i._buf===n._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&o._buf===n._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{A:i};if(!c&&i.length<(e-1)*u+e)throw new Error("A does not have enough elements for the given n and lda.");if(o.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(n.length<(e-1)*l+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?i.layout:m)==="column-major"?t==="upper":t==="lower",h=await G(r,"ssyr2"),b=null,y=null,_=null,v=null;try{b=f?o._buf:x(r,o,"ssyr2-x",!1),y=d?n._buf:x(r,n,"ssyr2-y",!1),_=c?i._buf:x(r,i,"ssyr2-A",!0),v=P(r,[{value:e,type:"u32"},{value:a,type:"f32"},{value:s,type:"u32"},{value:l,type:"u32"},{value:u,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let A=E(r,h.getBindGroupLayout(0),[b,y,_,v]),k=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:B,ts:j}=W(r,h,A,k),D=c?null:N(r,B,_);R(r,B);let C=await M(j);if(c)return C!==void 0?{gpuTimeMs:C}:{};let L=await S(D,Float32Array);return C!==void 0?{A:L,gpuTimeMs:C}:{A:L}}finally{!f&&b&&p(b),!d&&y&&p(y),!c&&_&&p(_),v&&p(v)}}async function _o(r,t,e,a,o,s,n,l,i,u,m,f,d,c,w="row-major"){let g=l instanceof F,h=u instanceof F,b=d instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sgemm",{A:l,B:u,C:d}),t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof n!="number")throw new Error("alpha must be a number.");if(Number.isNaN(n))throw new Error("alpha must not be NaN.");if(!Number.isFinite(n))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(m)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(l instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(d instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0||s<0)throw new Error("m, n, and k must be non-negative.");if(a===0||o===0)return b?{}:{C:d};let y=g?l.layout:w,_=h?u.layout:w,v=b?d.layout:w,A=y==="column-major"?s:a,k=y==="column-major"?a:s,B=t==="no-transpose"?A:k,j=t==="no-transpose"?k:A;if(i<j)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(i!==l.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,Q]=t==="no-transpose"?[a,s]:[s,a];if(l.rows<Y||l.cols<Q)throw new Error("A is too small for the given m, k, and transA.")}else if(l.length<(B-1)*i+j)throw new Error("A does not have enough elements for the given dimensions and lda.");let D=_==="column-major"?o:s,C=_==="column-major"?s:o,L=e==="no-transpose"?D:C,U=e==="no-transpose"?C:D;if(m<U)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(m!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,Q]=e==="no-transpose"?[s,o]:[o,s];if(u.rows<Y||u.cols<Q)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(L-1)*m+U)throw new Error("B does not have enough elements for the given dimensions and ldb.");let H=v==="column-major"?o:a,X=v==="column-major"?a:o;if(c<X)throw new Error(`ldc must be >= ${v==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==d.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(d.rows<a||d.cols<o)throw new Error("C is too small for the given m and n.")}else if(d.length<(H-1)*c+X)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&([l,u]=[u,l],[g,h]=[h,g],[i,m]=[m,i],[t,e]=[e==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[a,o]=[o,a]);let q=Math.ceil(o/64),J=Math.ceil(a/64),Z=q*J>=36,rr=await G(r,Z?"sgemm_large":"sgemm_small"),lr=g?l._buf:x(r,l,"sgemm-A",!1),cr=h?u._buf:x(r,u,"sgemm-B",!1),pr=b?d._buf:x(r,d,"sgemm-C",!0),er=t==="no-transpose",or=e==="no-transpose",z=er&&we(lr,i,a,s),$=we(cr,m,or?s:o,or?o:s),K=P(r,[{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"},{value:n,type:"f32"},{value:f,type:"f32"},{value:i,type:"u32"},{value:m,type:"u32"},{value:c,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:z?1:0,type:"u32"},{value:$?1:0,type:"u32"}],"sgemm-params");try{let Y=E(r,rr.getBindGroupLayout(0),[lr,_r(r,lr),cr,_r(r,cr),pr,K]),Q=Z?{x:O(r,q,"sgemm","x"),y:O(r,J,"sgemm","y")}:{x:O(r,Math.ceil(o/32),"sgemm","x"),y:O(r,Math.ceil(a/32),"sgemm","y")},{commandEncoder:ir,ts:dr}=W(r,rr,Y,Q),ar=b?null:N(r,ir,pr);R(r,ir);let tr=await M(dr);if(b)return tr!==void 0?{gpuTimeMs:tr}:{};let wr=await S(ar,Float32Array);return tr!==void 0?{C:wr,gpuTimeMs:tr}:{C:wr}}finally{g||p(lr),h||p(cr),b||p(pr),p(K)}}async function Bo(r,t,e,a,o,s,n,l,i,u,m,f,d,c,w,g="row-major"){let h=i instanceof F,b=m instanceof F,y=c instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"sgemmtr",{A:i,B:m,C:c}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(typeof d!="number")throw new Error("beta must be a number.");if(Number.isNaN(d))throw new Error("beta must not be NaN.");if(!Number.isFinite(d))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(f)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!y&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!y)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(y&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||s<0||n<0)throw new Error("m, n, and k must be non-negative.");if(o===0||s===0)return y?{}:{C:c};let _=h?i.layout:g,v=b?m.layout:g,A=y?c.layout:g,k=_==="column-major"?n:o,B=_==="column-major"?o:n,j=e==="no-transpose"?k:B,D=e==="no-transpose"?B:k;if(u<D)throw new Error(`lda must be >= ${_==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[z,$]=e==="no-transpose"?[o,n]:[n,o];if(i.rows<z||i.cols<$)throw new Error("A is too small for the given m, k, and transA.")}else if(i.length<(j-1)*u+D)throw new Error("A does not have enough elements for the given dimensions and lda.");let C=v==="column-major"?s:n,L=v==="column-major"?n:s,U=a==="no-transpose"?C:L,H=a==="no-transpose"?L:C;if(f<H)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[z,$]=a==="no-transpose"?[n,s]:[s,n];if(m.rows<z||m.cols<$)throw new Error("B is too small for the given n, k, and transB.")}else if(m.length<(U-1)*f+H)throw new Error("B does not have enough elements for the given dimensions and ldb.");let X=A==="column-major"?s:o,q=A==="column-major"?o:s;if(w<q)throw new Error(`ldc must be >= ${A==="column-major"?"rows":"cols"} of C as stored.`);if(y){if(w!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<o||c.cols<s)throw new Error("C is too small for the given m and n.")}else if(c.length<(X-1)*w+q)throw new Error("C does not have enough elements for the given dimensions and ldc.");_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&(a=a==="no-transpose"?"transpose":"no-transpose"),A==="column-major"&&([i,m]=[m,i],[h,b]=[b,h],[u,f]=[f,u],[e,a]=[a==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[o,s]=[s,o],t=t==="lower"?"upper":"lower");let J=Math.ceil(s/64),Z=Math.ceil(o/64),rr=J*Z>=36,lr=await G(r,rr?"sgemmtr_large":"sgemmtr_small"),cr=h?i._buf:x(r,i,"sgemmtr-A",!1),pr=b?m._buf:x(r,m,"sgemmtr-B",!1),er=y?c._buf:x(r,c,"sgemmtr-C",!0),or=P(r,[{value:o,type:"u32"},{value:s,type:"u32"},{value:n,type:"u32"},{value:l,type:"f32"},{value:d,type:"f32"},{value:u,type:"u32"},{value:f,type:"u32"},{value:w,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:a==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let z=E(r,lr.getBindGroupLayout(0),[cr,pr,er,or]),$=rr?{x:O(r,J,"sgemmtr","x"),y:O(r,Z,"sgemmtr","y")}:{x:O(r,Math.ceil(s/32),"sgemmtr","x"),y:O(r,Math.ceil(o/32),"sgemmtr","y")},{commandEncoder:K,ts:Y}=W(r,lr,z,$),Q=y?null:N(r,K,er);R(r,K);let ir=await M(Y);if(y)return ir!==void 0?{gpuTimeMs:ir}:{};let dr=await S(Q,Float32Array);return ir!==void 0?{C:dr,gpuTimeMs:ir}:{C:dr}}finally{h||p(cr),b||p(pr),y||p(er),p(or)}}async function Eo(r,t,e,a,o,s,n,l,i,u,m,f="row-major"){let d=n instanceof F,c=u instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssyrk",{A:n,C:u}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof i!="number")throw new Error("beta must be a number.");if(Number.isNaN(i))throw new Error("beta must not be NaN.");if(!Number.isFinite(i))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(m))throw new Error("n, k, lda, and ldc must be integers.");if(!d&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(u instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(d&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!d)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("n and k must be non-negative.");if(a===0)return c?{}:{C:u};let w=d?n.layout:f,g=c?u.layout:f,h=w==="column-major"?o:a,b=w==="column-major"?a:o,y=e==="no-transpose"?h:b,_=e==="no-transpose"?b:h;if(l<_)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(d){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[q,J]=e==="no-transpose"?[a,o]:[o,a];if(n.rows<q||n.cols<J)throw new Error("A is too small for the given n, k, and trans.")}else if(n.length<(y-1)*l+_)throw new Error("A does not have enough elements for the given dimensions and lda.");if(m<a)throw new Error("ldc must be >= n.");if(c){if(m!==u.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(u.rows<a||u.cols<a)throw new Error("C is too small for the given n.")}else if(u.length<(a-1)*m+a)throw new Error("C does not have enough elements for the given dimensions and ldc.");let v=e;w==="column-major"&&(v=v==="no-transpose"?"transpose":"no-transpose");let A=v==="no-transpose"?"transpose":"no-transpose",k=t;g==="column-major"&&([v,A]=[A==="no-transpose"?"transpose":"no-transpose",v==="no-transpose"?"transpose":"no-transpose"],k=k==="lower"?"upper":"lower");let B=Math.ceil(a/64),j=Math.ceil(a/64),D=B*j>=36,C=await G(r,D?"sgemmtr_large":"sgemmtr_small"),L=d?n._buf:x(r,n,"ssyrk-A",!1),U=c?u._buf:x(r,u,"ssyrk-C",!0),H=d?sr(r,L.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(r,n,"ssyrk-B",!1),X=P(r,[{value:a,type:"u32"},{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"f32"},{value:i,type:"f32"},{value:l,type:"u32"},{value:l,type:"u32"},{value:m,type:"u32"},{value:v==="transpose"?1:0,type:"u32"},{value:A==="transpose"?1:0,type:"u32"},{value:k==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let q=E(r,C.getBindGroupLayout(0),[L,H,U,X]),J=D?{x:O(r,B,"ssyrk","x"),y:O(r,j,"ssyrk","y")}:{x:O(r,Math.ceil(a/32),"ssyrk","x"),y:O(r,Math.ceil(a/32),"ssyrk","y")},{commandEncoder:Z,querySet:rr,passDescriptor:lr}=Mr(r);d&&Z.copyBufferToBuffer(L,0,H,0,L.size),ur(Z,C,q,J,lr);let cr=vr(r,Z,rr),pr=c?null:N(r,Z,U);R(r,Z);let er=await M(cr);if(c)return er!==void 0?{gpuTimeMs:er}:{};let or=await S(pr,Float32Array);return er!==void 0?{C:or,gpuTimeMs:er}:{C:or}}finally{d||p(L),p(H),c||p(U),p(X)}}async function Ao(r,t,e,a,o,s,n,l,i,u,m,f,d,c="row-major"){let w=n instanceof F,g=i instanceof F,h=f instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssyr2k",{A:n,B:i,C:f}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(d))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(i instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("n and k must be non-negative.");if(a===0)return h?{}:{C:f};let b=w?n.layout:c,y=g?i.layout:c,_=h?f.layout:c,v=b==="column-major"?o:a,A=b==="column-major"?a:o,k=e==="no-transpose"?v:A,B=e==="no-transpose"?A:v;if(l<B)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Y,Q]=e==="no-transpose"?[a,o]:[o,a];if(n.rows<Y||n.cols<Q)throw new Error("A is too small for the given n, k, and trans.")}else if(n.length<(k-1)*l+B)throw new Error("A does not have enough elements for the given dimensions and lda.");let j=y==="column-major"?o:a,D=y==="column-major"?a:o,C=e==="no-transpose"?j:D,L=e==="no-transpose"?D:j;if(u<L)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==i.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Y,Q]=e==="no-transpose"?[a,o]:[o,a];if(i.rows<Y||i.cols<Q)throw new Error("B is too small for the given n, k, and trans.")}else if(i.length<(C-1)*u+L)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(d<a)throw new Error("ldc must be >= n.");if(h){if(d!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<a||f.cols<a)throw new Error("C is too small for the given n.")}else if(f.length<(a-1)*d+a)throw new Error("C does not have enough elements for the given dimensions and ldc.");let U=e;b==="column-major"&&(U=U==="no-transpose"?"transpose":"no-transpose");let H=e;y==="column-major"&&(H=H==="no-transpose"?"transpose":"no-transpose");let X=_==="column-major"?t==="lower"?"upper":"lower":t,q=Y=>Y==="no-transpose"?"transpose":"no-transpose";function J(Y,Q,ir,dr,ar,tr){let wr=Y,Rr=q(dr);return _!=="column-major"?{transX:wr,X:Q,ldX:ir,transY:Rr,Y:ar,ldY:tr}:{transX:q(Rr),X:ar,ldX:tr,transY:q(wr),Y:Q,ldY:ir}}let Z=Math.ceil(a/64),rr=Math.ceil(a/64),lr=Z*rr>=36,cr=await G(r,lr?"sgemmtr_large":"sgemmtr_small"),pr=lr?{x:O(r,Z,"ssyr2k","x"),y:O(r,rr,"ssyr2k","y")}:{x:O(r,Math.ceil(a/32),"ssyr2k","x"),y:O(r,Math.ceil(a/32),"ssyr2k","y")},er=w?n._buf:x(r,n,"ssyr2k-A",!1),or=g?i._buf:x(r,i,"ssyr2k-B",!1),z=h?f._buf:x(r,f,"ssyr2k-C",!0),$=null,K=null;try{let Y=J(U,er,l,H,or,u),Q=J(H,or,u,U,er,l),ir=(Pr,hr)=>P(r,[{value:a,type:"u32"},{value:a,type:"u32"},{value:o,type:"u32"},{value:s,type:"f32"},{value:hr,type:"f32"},{value:Pr.ldX,type:"u32"},{value:Pr.ldY,type:"u32"},{value:d,type:"u32"},{value:Pr.transX==="transpose"?1:0,type:"u32"},{value:Pr.transY==="transpose"?1:0,type:"u32"},{value:X==="upper"?1:0,type:"u32"}],"ssyr2k-params");$=ir(Y,m),K=ir(Q,1);let dr=E(r,cr.getBindGroupLayout(0),[Y.X,Y.Y,z,$]),ar=E(r,cr.getBindGroupLayout(0),[Q.X,Q.Y,z,K]),{commandEncoder:tr,querySet:wr}=Mr(r),Rr=wr?{timestampWrites:{querySet:wr,beginningOfPassWriteIndex:0}}:void 0,kr=wr?{timestampWrites:{querySet:wr,endOfPassWriteIndex:1}}:void 0;ur(tr,cr,dr,pr,Rr),ur(tr,cr,ar,pr,kr);let Ir=vr(r,tr,wr),xr=h?null:N(r,tr,z);R(r,tr);let br=await M(Ir);if(h)return br!==void 0?{gpuTimeMs:br}:{};let gr=await S(xr,Float32Array);return br!==void 0?{C:gr,gpuTimeMs:br}:{C:gr}}finally{w||p(er),g||p(or),h||p(z),$&&p($),K&&p(K)}}async function Go(r,t,e,a,o,s,n,l,i,u,m,f,d,c="row-major"){let w=n instanceof F,g=i instanceof F,h=f instanceof F;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"ssymm",{A:n,B:i,C:f}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof m!="number")throw new Error("beta must be a number.");if(Number.isNaN(m))throw new Error("beta must not be NaN.");if(!Number.isFinite(m))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(o)||!Number.isInteger(l)||!Number.isInteger(u)||!Number.isInteger(d))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(i instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||o<0)throw new Error("m and n must be non-negative.");if(a===0||o===0)return h?{}:{C:f};let b=w?n.layout:c,y=g?i.layout:c,_=h?f.layout:c,v=t==="left"?a:o;if(l<v)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(w){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<v||n.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(v-1)*l+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let A=y==="column-major"?o:a,k=y==="column-major"?a:o;if(u<k)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(u!==i.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(i.rows<a||i.cols<o)throw new Error("B is too small for the given m and n.")}else if(i.length<(A-1)*u+k)throw new Error("B does not have enough elements for the given dimensions and ldb.");let B=_==="column-major"?o:a,j=_==="column-major"?a:o;if(d<j)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(d!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<a||f.cols<o)throw new Error("C is too small for the given m and n.")}else if(f.length<(B-1)*d+j)throw new Error("C does not have enough elements for the given dimensions and ldc.");let D=b==="column-major"?e==="lower"?"upper":"lower":e,C=y==="column-major"?"transpose":"no-transpose",L="no-transpose",U=a,H=o,X=v,q=t==="left"?L:C,J=t==="left"?C:L,Z=tr=>tr==="no-transpose"?"transpose":"no-transpose",rr=t==="right";_==="column-major"&&([q,J]=[Z(J),Z(q)],rr=!rr,[U,H]=[H,U]);let lr=v,cr=Math.ceil(H/64),pr=Math.ceil(U/64),er=cr*pr>=36,or=await G(r,er?"sgemm_large":"sgemm_small"),z=await G(r,"symmetrize"),$=er?{x:O(r,cr,"ssymm","x"),y:O(r,pr,"ssymm","y")}:{x:O(r,Math.ceil(H/32),"ssymm","x"),y:O(r,Math.ceil(U/32),"ssymm","y")},K=w?n._buf:x(r,n,"ssymm-A",!1),Y=g?i._buf:x(r,i,"ssymm-B",!1),Q=h?f._buf:x(r,f,"ssymm-C",!0),ir=sr(r,v*lr*4,"ssymm-Adense"),dr=null,ar=null;try{dr=P(r,[{value:v,type:"u32"},{value:l,type:"u32"},{value:lr,type:"u32"},{value:D==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let tr=E(r,z.getBindGroupLayout(0),[K,ir,dr]),wr=rr?Y:ir,Rr=rr?u:lr,kr=rr?ir:Y;ar=P(r,[{value:U,type:"u32"},{value:H,type:"u32"},{value:X,type:"u32"},{value:s,type:"f32"},{value:m,type:"f32"},{value:Rr,type:"u32"},{value:rr?lr:u,type:"u32"},{value:d,type:"u32"},{value:q==="transpose"?1:0,type:"u32"},{value:J==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let xr=E(r,or.getBindGroupLayout(0),[wr,_r(r,wr),kr,_r(r,kr),Q,ar]),{commandEncoder:br,querySet:gr}=Mr(r),Pr=gr?{timestampWrites:{querySet:gr,beginningOfPassWriteIndex:0}}:void 0,hr=gr?{timestampWrites:{querySet:gr,endOfPassWriteIndex:1}}:void 0;ur(br,z,tr,{x:Math.ceil(v/8),y:Math.ceil(v/8)},Pr),ur(br,or,xr,$,hr);let jr=vr(r,br,gr),Lr=h?null:N(r,br,Q);R(r,br);let Ur=await M(jr);if(h)return Ur!==void 0?{gpuTimeMs:Ur}:{};let te=await S(Lr,Float32Array);return Ur!==void 0?{C:te,gpuTimeMs:Ur}:{C:te}}finally{w||p(K),g||p(Y),h||p(Q),p(ir),dr&&p(dr),ar&&p(ar)}}async function So(r,t,e,a,o,s,n,l,i,u,m,f,d="row-major"){let c=i instanceof F,w=m instanceof F,g=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"strmm",{A:i,B:m}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||n<0)throw new Error("m and n must be non-negative.");if(s===0||n===0)return w?{}:{B:m};let h=c?i.layout:d,b=w?m.layout:d,y=t==="left"?s:n;if(u<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(i.rows<y||i.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(i.length<(y-1)*u+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?n:s,v=b==="column-major"?s:n;if(f<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(m.rows<s||m.cols<n)throw new Error("B is too small for the given m and n.")}else if(m.length<(_-1)*f+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?e==="lower"?"upper":"lower":e,k=h==="column-major"?a==="no-transpose"?"transpose":"no-transpose":a,B=b==="column-major"?"transpose":"no-transpose",j="no-transpose",D=s,C=n,L=y,U=t==="left"?j:B,H=t==="left"?B:j,X=dr=>dr==="no-transpose"?"transpose":"no-transpose",q=t==="right";b==="column-major"&&([U,H]=[X(H),X(U)],q=!q,[D,C]=[C,D]);let J=y,Z=Math.ceil(C/64),rr=Math.ceil(D/64),lr=Z*rr>=36,cr=await G(r,lr?"sgemm_large":"sgemm_small"),pr=await G(r,"triangularize"),er=lr?{x:O(r,Z,"strmm","x"),y:O(r,rr,"strmm","y")}:{x:O(r,Math.ceil(C/32),"strmm","x"),y:O(r,Math.ceil(D/32),"strmm","y")},or=null,z=null,$=null,K=null,Y=null,Q=null,ir=!1;try{or=c?i._buf:x(r,i,"strmm-A",!1),z=w?m._buf:x(r,m,"strmm-B",!0),$=sr(r,y*J*4,"strmm-Adense"),K=sr(r,_*f*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),Y=P(r,[{value:y,type:"u32"},{value:u,type:"u32"},{value:J,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let dr=E(r,pr.getBindGroupLayout(0),[or,$,Y]),ar=q?z:$,tr=q?f:J,wr=q?$:z;Q=P(r,[{value:D,type:"u32"},{value:C,type:"u32"},{value:L,type:"u32"},{value:l,type:"f32"},{value:0,type:"f32"},{value:tr,type:"u32"},{value:q?J:f,type:"u32"},{value:f,type:"u32"},{value:U==="transpose"?1:0,type:"u32"},{value:H==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let kr=E(r,cr.getBindGroupLayout(0),[ar,_r(r,ar),wr,_r(r,wr),K,Q]),{commandEncoder:Ir,querySet:xr}=Mr(r);Ir.copyBufferToBuffer(z,0,K,0,Math.min(z.size,K.size));let br=xr?{timestampWrites:{querySet:xr,beginningOfPassWriteIndex:0}}:void 0,gr=xr?{timestampWrites:{querySet:xr,endOfPassWriteIndex:1}}:void 0;ur(Ir,pr,dr,{x:Math.ceil(y/8),y:Math.ceil(y/8)},br),ur(Ir,cr,kr,er,gr);let Pr=vr(r,Ir,xr),hr=w?null:N(r,Ir,K);R(r,Ir);let jr=await M(Pr);if(w)return p(m._buf),m._buf=K,ir=!0,jr!==void 0?{gpuTimeMs:jr}:{};let Lr=await S(hr,Float32Array);return jr!==void 0?{B:Lr,gpuTimeMs:jr}:{B:Lr}}finally{!c&&or&&p(or),!w&&z&&p(z),$&&p($),K&&!ir&&p(K),Y&&p(Y),Q&&p(Q)}}async function ko(r,t,e,a,o,s,n,l,i,u,m,f,d="row-major"){let c=i instanceof F,w=m instanceof F,g=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(T(r,"strsm",{A:i,B:m}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(a!=="no-transpose"&&a!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(d!=="row-major"&&d!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof l!="number")throw new Error("alpha must be a number.");if(Number.isNaN(l))throw new Error("alpha must not be NaN.");if(!Number.isFinite(l))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(m instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||n<0)throw new Error("m and n must be non-negative.");if(s===0||n===0)return w?{}:{B:m};let h=c?i.layout:d,b=w?m.layout:d,y=t==="left"?s:n;if(u<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(u!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(i.rows<y||i.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(i.length<(y-1)*u+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?n:s,v=b==="column-major"?s:n;if(f<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==m.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(m.rows<s||m.cols<n)throw new Error("B is too small for the given m and n.")}else if(m.length<(_-1)*f+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let A=h==="column-major"?e==="lower"?"upper":"lower":e,k=h==="column-major"?a==="no-transpose"?"transpose":"no-transpose":a,B=t==="left"?n:s,j=t==="left",D=k==="no-transpose"==(A==="lower"),C=t==="left"?D:!D,L=[];for(let z=0;z<y;z+=64)L.push(z);C||L.reverse();let U=L.length,H=await G(r,"strsv_invert_block"),X=await G(r,"block_transfer"),q=await G(r,"sscal"),J=null,Z=null,rr=null,lr=[],cr=[];function pr(z,$){let K=sr(r,z,$);return cr.push(K),K}function er(z,$){let K=P(r,z,$);return lr.push(K),K}let or=(_-1)*f+v;try{J=c?i._buf:x(r,i,"strsm-A",!1),Z=w?m._buf:x(r,m,"strsm-B",!0),rr=sr(r,U*64*64*4,"strsm-Ainv");let z=null;if(l!==1){let xr=er([{value:or,type:"u32"},{value:l,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");z=E(r,q.getBindGroupLayout(0),[Z,xr])}let $=er([{value:y,type:"u32"},{value:u,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:A==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),K=E(r,H.getBindGroupLayout(0),[J,rr,$]),Y=pr(64*B*4,"strsm-Bblock"),Q=pr(64*B*4,"strsm-Xblock"),ir=pr(y*64*4,"strsm-Aoff"),dr=pr(y*B*4,"strsm-delta"),{commandEncoder:ar,querySet:tr}=Mr(r);if(l===0){let xr=tr?{timestampWrites:{querySet:tr,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0;ur(ar,q,z,yr(r,or),xr)}else{z&&ur(ar,q,z,yr(r,or)),ur(ar,H,K,{x:64,y:U},tr?{timestampWrites:{querySet:tr,beginningOfPassWriteIndex:0}}:void 0);for(let br=0;br<L.length;br++){let gr=L[br],Pr=Math.min(gr+64,y),hr=Pr-gr,jr=gr/64,Lr=br===L.length-1,Ur=er([{value:gr,type:"u32"},{value:hr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),te=E(r,X.getBindGroupLayout(0),[Y,Z,Ur]);ur(ar,X,te,qr(r,"strsm",hr,B));{let Wr=hr,Fr=B,me=hr,Xr=Math.ceil(Fr/64),$r=Math.ceil(Wr/64),Zr=Xr*$r>=36,Qr=await G(r,Zr?"sgemm_large":"sgemm_small"),fe=er([{value:Wr,type:"u32"},{value:Fr,type:"u32"},{value:me,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:64,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:t==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),ae={buffer:rr,offset:jr*64*64*4,size:4096*4},ce=E(r,Qr.getBindGroupLayout(0),[ae,_r(r,ae),Y,_r(r,Y),Q,fe]),Co=Zr?{x:O(r,Xr,"strsm","x"),y:O(r,$r,"strsm","y")}:{x:O(r,Math.ceil(Fr/32),"strsm","x"),y:O(r,Math.ceil(Wr/32),"strsm","y")};ur(ar,Qr,ce,Co)}let oe=C?Pr:0,_e=C?y:gr,Be=oe<_e,No=er([{value:gr,type:"u32"},{value:hr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),Mo=E(r,X.getBindGroupLayout(0),[Q,Z,No]),Io=Lr&&!Be&&tr?{timestampWrites:{querySet:tr,endOfPassWriteIndex:1}}:void 0;if(ur(ar,X,Mo,qr(r,"strsm",hr,B),Io),!Be)continue;let Yr=_e-oe,Ro=er([{value:oe,type:"u32"},{value:Yr,type:"u32"},{value:gr,type:"u32"},{value:hr,type:"u32"},{value:u,type:"u32"},{value:k==="transpose"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),Po=E(r,X.getBindGroupLayout(0),[ir,J,Ro]);ur(ar,X,Po,qr(r,"strsm",Yr,hr));{let Wr=Yr,Fr=B,me=hr,Xr=Math.ceil(Fr/64),$r=Math.ceil(Wr/64),Zr=Xr*$r>=36,Qr=await G(r,Zr?"sgemm_large":"sgemm_small"),fe=er([{value:Wr,type:"u32"},{value:Fr,type:"u32"},{value:me,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:hr,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),ae=E(r,Qr.getBindGroupLayout(0),[ir,_r(r,ir),Q,_r(r,Q),dr,fe]),ce=Zr?{x:O(r,Xr,"strsm","x"),y:O(r,$r,"strsm","y")}:{x:O(r,Math.ceil(Fr/32),"strsm","x"),y:O(r,Math.ceil(Wr/32),"strsm","y")};ur(ar,Qr,ae,ce)}let Do=er([{value:oe,type:"u32"},{value:Yr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:j?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),To=E(r,X.getBindGroupLayout(0),[dr,Z,Do]),jo=Lr&&tr?{timestampWrites:{querySet:tr,endOfPassWriteIndex:1}}:void 0;ur(ar,X,To,qr(r,"strsm",Yr,B),jo)}}let wr=vr(r,ar,tr),Rr=w?null:N(r,ar,Z);R(r,ar);let kr=await M(wr);if(w)return kr!==void 0?{gpuTimeMs:kr}:{};let Ir=await S(Rr,Float32Array);return kr!==void 0?{B:Ir,gpuTimeMs:kr}:{B:Ir}}finally{!c&&J&&p(J),!w&&Z&&p(Z),rr&&p(rr),p(cr),p(lr)}}return Oo(Ta);})();
