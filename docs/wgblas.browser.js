var wgblas=(()=>{var Jo=Object.create;var me=Object.defineProperty;var ra=Object.getOwnPropertyDescriptor;var ea=Object.getOwnPropertyNames;var ta=Object.getPrototypeOf,oa=Object.prototype.hasOwnProperty;var fe=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var K=(r,t,e)=>()=>{if(e)throw e[0];try{return r&&(t=r(r=0)),t}catch(o){throw e=[o],o}};var Ie=(r,t)=>{for(var e in t)me(r,e,{get:t[e],enumerable:!0})},Re=(r,t,e,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of ea(t))!oa.call(r,a)&&a!==e&&me(r,a,{get:()=>t[a],enumerable:!(o=ra(t,a))||o.enumerable});return r};var ce=(r,t,e)=>(e=r!=null?Jo(ta(r)):{},Re(t||!r||!r.__esModule?me(e,"default",{value:r,enumerable:!0}):e,r)),aa=r=>Re(me({},"__esModule",{value:!0}),r);var Ae,ze=K(()=>{Ae=`// sscal: x = alpha * x

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
`});var Ye,He=K(()=>{Ye=`// cscal: x := alpha * x, complex. x is one interleaved f32 array
// (re0, im0, re1, im1, ...), matching Complex32Array/GpuVector's storage
// (and cuBLAS's cuComplex / stdlib's Complex64Array) \u2014 no repacking needed
// between JS and GPU.
//   (alphaRe + i*alphaIm)(re + i*im) = (alphaRe*re - alphaIm*im) + i*(alphaRe*im + alphaIm*re)

@group(0) @binding(0) var<storage, read_write> x: array<f32>;

struct Params {
  n:       u32,
  alphaRe: f32,
  alphaIm: f32,
  x_inc:   u32,
}

@group(0) @binding(1) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let base = 2u * id * params.x_inc;
    // Both new parts need both old parts, so capture them before either write.
    let re = x[base];
    let im = x[base + 1u];
    x[base]      = params.alphaRe * re - params.alphaIm * im;
    x[base + 1u] = params.alphaRe * im + params.alphaIm * re;
  }
}
`});var $e,Xe=K(()=>{$e=`// sswap: x <-> y

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
`});var Qe,Ze=K(()=>{Qe=`// saxpy: y = alpha * x + y

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
`});var rt,Je=K(()=>{rt=`// scopy: y = x

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
`});var tt,et=K(()=>{tt=`// sdot: result = sum(x[i] * y[i])
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
`});var Ee,ot=K(()=>{Ee=`// sum reduction: collapses 2*WGS partials into one scalar.
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
`});var st,at=K(()=>{st=`// sasum: result = sum(|x[i]|)
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
`});var nt,it=K(()=>{nt=`// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
`});var lt,ut=K(()=>{lt=`// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
`});var ft,mt=K(()=>{ft=`// isamax: returns index of element with largest absolute value
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
`});var pt,ct=K(()=>{pt=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`});var we,dt=K(()=>{we=`// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`});var Ge,wt=K(()=>{Ge=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`});var Se,gt=K(()=>{Se=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var ht,bt=K(()=>{ht=`// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`});var ke,yt=K(()=>{ke=`// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`});var vt,xt=K(()=>{vt=`// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
`});var Bt,_t=K(()=>{Bt=`// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
`});var Et,At=K(()=>{Et=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`});var St,Gt=K(()=>{St=`// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`});var Nt,kt=K(()=>{Nt=`// idamax: returns index of element with largest absolute value (f64, double-double)
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
`});var Dt,Mt=K(()=>{Dt=`// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`});var It,Pt=K(()=>{It=`// srot: x = c*x + s*y,  y = -s*x + c*y

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
`});var Tt,Rt=K(()=>{Tt=`// srotm: applies modified Givens rotation H to vectors x and y.
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
`});var Lt,Ct=K(()=>{Lt=`// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`});var Wt,jt=K(()=>{Wt=`// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`});var qt,Ft=K(()=>{qt=`// ssymv: y = alpha * A * x + beta * y
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
`});var Ot,Ut=K(()=>{Ot=`// strmv: y = op(A) * x
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
`});var Ne,Kt=K(()=>{Ne=`// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`});var zt,Vt=K(()=>{zt=`// strsv_apply_inverse: given a precomputed block inverse (from
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
`});var Yt,Ht=K(()=>{Yt=`// strsv_update: subtracts a solved block's contribution from every
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
`});var $t,Xt=K(()=>{$t=`// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`});var Qt,Zt=K(()=>{Qt=`// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`});var ro,Jt=K(()=>{ro=`// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`});var se,eo=K(()=>{se=`// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`});var ie,to=K(()=>{ie=`// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`});var ge,oo=K(()=>{ge=`// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`});var be,ao=K(()=>{be=`// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`});var io,so=K(()=>{io=`// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`});var uo,no=K(()=>{uo=`// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`});var mo,lo=K(()=>{mo=`// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
`});var fo={};Ie(fo,{routineShaders:()=>ar,shaderSources:()=>Ya});var ar,Ya,co=K(()=>{ze();He();Xe();Ze();Je();et();ot();at();it();ut();mt();ct();dt();wt();gt();bt();yt();xt();_t();At();Gt();kt();Mt();Pt();Rt();Ct();jt();Ft();Ut();Kt();Vt();Ht();Xt();Zt();Jt();eo();to();oo();ao();so();no();lo();ar={};ar.sscal={sscal:Ae};ar.cscal={cscal:Ye};ar.sswap={sswap:$e};ar.saxpy={saxpy:Qe};ar.scopy={scopy:rt};ar.sdot={sdot:tt,"reduction/sum":Ee};ar.sasum={sasum:st,"reduction/sum":Ee};ar.snrm2={snrm2:nt,"reduction/scaledSum":lt};ar.isamax={isamax:ft,"reduction/argmax":pt};ar.dasum={"f64/dekker":we,"f64/utils/abs":Ge,"f64/utils/add":Se,dasum:ht,"reduction/sumF64":ke};ar.ddot={"f64/dekker":we,"f64/utils/add":Se,"f64/utils/multiply":vt,ddot:Bt,"reduction/sumF64":ke};ar.idamax={"f64/dekker":we,"f64/utils/abs":Ge,"f64/utils/greater":Et,"f64/utils/equal":St,idamax:Nt,"reduction/argmaxF64":Dt};ar.srot={srot:It};ar.srotm={srotm:Tt};ar.sgemv={sgemv_n:Lt,sgemv_t:Wt};ar.ssymv={ssymv:qt};ar.strmv={strmv:Ot};ar.strsv={strsv_invert_block:Ne,strsv_apply_inverse:zt,strsv_update:Yt};ar.sger={sger:$t};ar.ssyr={ssyr:Qt};ar.ssyr2={ssyr2:ro};ar.sgemm={sgemm_small:se,sgemm_large:ie};ar.sgemmtr={sgemmtr_small:ge,sgemmtr_large:be};ar.ssyrk={sgemmtr_small:ge,sgemmtr_large:be};ar.ssyr2k={sgemmtr_small:ge,sgemmtr_large:be};ar.ssymm={sgemm_small:se,sgemm_large:ie,symmetrize:io};ar.strmm={sgemm_small:se,sgemm_large:ie,triangularize:uo};ar.strsm={strsv_invert_block:Ne,block_transfer:mo,sscal:Ae,sgemm_small:se,sgemm_large:ie};Ya=Object.assign({},...Object.values(ar))});var Qa={};Ie(Qa,{Complex32:()=>Fr,Complex32Array:()=>hr,Complex64:()=>Wr,Complex64Array:()=>_r,GpuMatrix:()=>O,GpuVector:()=>D,cleanup:()=>Fe,cscal:()=>wo,dasum:()=>vo,ddot:()=>_o,gpuName:()=>qe,idamax:()=>Eo,init:()=>We,isamax:()=>Ao,randomFloat32Array:()=>Oe,randomFloat64Array:()=>Ke,randomTriangularFloat32Array:()=>Ve,sasum:()=>xo,saxpy:()=>bo,scopy:()=>ho,sdot:()=>yo,sgemm:()=>Lo,sgemmtr:()=>jo,sgemv:()=>ko,sger:()=>Ro,snrm2:()=>Bo,srot:()=>Go,srotm:()=>So,sscal:()=>po,sswap:()=>go,ssymm:()=>qo,ssymv:()=>No,ssyr:()=>To,ssyr2:()=>Co,ssyr2k:()=>Fo,ssyrk:()=>Wo,strmm:()=>Uo,strmv:()=>Mo,strsm:()=>Oo,strsv:()=>Io});function Te(r,t){return t?r.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Ce(r){if(!Le(r))return{querySet:null,passDescriptor:void 0};let t=r.createQuerySet({type:"timestamp",count:2});return{querySet:t,passDescriptor:{timestampWrites:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function Dr(r,t,e){if(!e)return null;let o=r.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(e,0,2,o,0);let a=r.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(o,0,a,0,16),{tsReadBuffer:a,resolveBuffer:o,querySet:e}}async function M(r){if(!r)return;let{tsReadBuffer:t,resolveBuffer:e,querySet:o}=r;await t.mapAsync(GPUMapMode.READ);let a=new BigInt64Array(t.getMappedRange().slice());return t.unmap(),t.destroy(),e.destroy(),o.destroy(),Math.max(0,Number(a[1]-a[0]))/1e6}var Yr=null,ve=!1,Xr=new Map,ae=new WeakMap,Or=null,je=({powerPreference:r,benchmark:t})=>`${r}::${t}`;async function We({powerPreference:r="high-performance",benchmark:t=!1,dumpShaders:e=!1}={}){let o={powerPreference:r,benchmark:t,dumpShaders:e},a=je(o),s=Xr.get(a);if(s)return s;if(Yr)e!==ve&&typeof window>"u"&&console.warn(`dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${ve}. The first init() call fixes this for the process.`);else if(typeof window>"u"){let{create:f,globals:p}=await import("webgpu");Object.assign(globalThis,p),Yr=f(e?["enable-dawn-features=dump_shaders,disable_symbol_renaming"]:[]),ve=e}else e&&console.warn("dumpShaders has no effect in the browser \u2014 see init()'s docs."),Yr=navigator.gpu;if(!Yr)throw new Error("WebGPU not supported in this environment.");let i=await Yr.requestAdapter({powerPreference:r})??await Yr.requestAdapter();if(!i)throw new Error("No WebGPU adapter found.");let n=[...Te(i,t).requiredFeatures??[]],l=await i.requestDevice({requiredFeatures:n});l.addEventListener("uncapturederror",f=>{console.error("Uncaptured GPU error:",f.error.message)});let u=n.includes("timestamp-query");return ae.set(l,{adapter:i,benchmark:u,options:o}),Xr.set(a,l),Or||(Or=l),l}function Fe(r){if(r===void 0){for(let e of Xr.values())e.destroy();Xr.clear(),Or=null;return}let t=ae.get(r);t&&(Xr.delete(je(t.options)),ae.delete(r),r.destroy(),Or===r&&(Or=Xr.values().next().value??null))}function qe(r=Or){let t=r&&ae.get(r);if(!t)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:e,description:o}=t.adapter.info;return{description:o||"unknown",device:e||"unknown"}}function Le(r=Or){return ae.get(r)?.benchmark??!1}function $r(){if(!Or)throw new Error("WebGPU device not initialized \u2014 call init() first.");return Or}function d(...r){r.flat().forEach(t=>t.destroy())}function _e(r,t,e){let o=r.limits.maxStorageBufferBindingSize;if(t>o)throw new Error(`Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${o} bytes). The operands are too large for this device.`)}function x(r,t,e="blas-input",o=!1){let a=t.byteLength;_e(r,a,e);let s=o?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,i=r.createBuffer({label:e,size:a,usage:s,mappedAtCreation:!0}),m=t.constructor;return new m(i.getMappedRange()).set(t),i.unmap(),i}function er(r,t,e="blas-storage",o=0){return _e(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|o})}function xr(r,t,e="blas-result"){return _e(r,t,e),r.createBuffer({label:e,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function k(r,t,e){let o=r.createBuffer({label:"blas-readback",size:e.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(e,0,o,0,e.size),o}var Zr=16,Ue=new WeakMap;function sa(r){let t=Ue.get(r);return t||(t=r.createBuffer({label:"blas-vec4-fallback",size:Zr,usage:GPUBufferUsage.STORAGE}),Ue.set(r,t)),t}function vr(r,t){let e=t instanceof GPUBuffer?t:t.buffer,o=t instanceof GPUBuffer?0:t.offset??0,a=t instanceof GPUBuffer?t.size:t.size??e.size-o,s=Math.floor(a/Zr)*Zr;return s<Zr?{buffer:sa(r),offset:0,size:Zr}:{buffer:e,offset:o,size:s}}function Be(r,t,e,o){if(t%4!==0)return!1;let a=r instanceof GPUBuffer?r:r.buffer,s=r instanceof GPUBuffer?0:r.offset??0,i=r instanceof GPUBuffer?a.size:r.size??a.size-s,m=Math.floor(i/Zr)*4;if(m<=0)return!1;let n=(Math.max(e,1)-1)*t+(Math.max(o,1)-1);return Math.floor(n/4)*4+4<=m}function I(r,t,e="blas-params"){let o=t.length*4,a=Math.ceil(o/16)*16,s=new ArrayBuffer(a),i=new DataView(s);t.forEach(({value:n,type:l},u)=>{let f=u*4;if(l==="u32")i.setUint32(f,n,!0);else if(l==="i32")i.setInt32(f,n,!0);else if(l==="f32")i.setFloat32(f,n,!0);else throw new Error(`Unknown param type "${l}". Use "f32", "u32", or "i32".`)});let m=r.createBuffer({label:e,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(m,0,s),m}async function S(r,t=Float32Array){try{await r.mapAsync(GPUMapMode.READ);let e=new t(r.getMappedRange().slice());return r.unmap(),e}finally{r.destroy()}}function Pr(r){let t=r.length,e=new Float32Array(t),o=new Float32Array(t);for(let a=0;a<t;a++){let s=Math.fround(r[a]);e[a]=s,o[a]=Math.fround(r[a]-s)}return{hi:e,lo:o}}function Lr(r,t){let e=r.length,o=new Float64Array(e);for(let a=0;a<e;a++)o[a]=r[a]+t[a];return o}var Wr=class{constructor(t,e){this.re=t,this.im=e}},_r=class extends Array{constructor(t){if(t===void 0){super();return}if(typeof t=="number"){super(t);for(let o=0;o<t;o++)this[o]=new Wr(0,0);return}let e=Array.from(t);if(super(),e.length!==0){if(e[0]instanceof Wr){for(let o of e){if(!(o instanceof Wr))throw new Error("Complex64Array expects every element to be a Complex64.");this.push(o)}return}if(e.length%2!==0)throw new Error("Complex64Array expects an even number of interleaved [re, im, ...] values.");for(let o=0;o<e.length;o+=2){if(typeof e[o]!="number"||typeof e[o+1]!="number")throw new Error("Complex64Array expects interleaved [re, im, ...] values to be numbers.");this.push(new Wr(e[o],e[o+1]))}}}};function Qr(r,t=r.length){let e=new Float32Array(t*2);for(let o=0;o<t;o++)e[o*2]=r[o].re,e[o*2+1]=r[o].im;return e}function pe(r,t=r.length){let e=new Float64Array(t),o=new Float64Array(t);for(let u=0;u<t;u++)e[u]=r[u].re,o[u]=r[u].im;let{hi:a,lo:s}=Pr(e),{hi:i,lo:m}=Pr(o),n=new Float32Array(t*2),l=new Float32Array(t*2);for(let u=0;u<t;u++)n[u*2]=a[u],n[u*2+1]=i[u],l[u*2]=s[u],l[u*2+1]=m[u];return{hi:n,lo:l}}function de(r,t){let e=r.length/2,o=new Float32Array(e),a=new Float32Array(e),s=new Float32Array(e),i=new Float32Array(e);for(let u=0;u<e;u++)o[u]=r[u*2],s[u]=r[u*2+1],a[u]=t[u*2],i[u]=t[u*2+1];let m=Lr(o,a),n=Lr(s,i),l=new _r(e);for(let u=0;u<e;u++)l[u]=new Wr(m[u],n[u]);return l}var Fr=class{constructor(t,e){this.re=Math.fround(t),this.im=Math.fround(e)}},hr=class extends Array{constructor(t){if(t===void 0){super();return}if(typeof t=="number"){super(t);for(let o=0;o<t;o++)this[o]=new Fr(0,0);return}let e=Array.from(t);if(super(),e.length!==0){if(e[0]instanceof Fr){for(let o of e){if(!(o instanceof Fr))throw new Error("Complex32Array expects every element to be a Complex32.");this.push(o)}return}if(e.length%2!==0)throw new Error("Complex32Array expects an even number of interleaved [re, im, ...] values.");for(let o=0;o<e.length;o+=2){if(typeof e[o]!="number"||typeof e[o+1]!="number")throw new Error("Complex32Array expects interleaved [re, im, ...] values to be numbers.");this.push(new Fr(e[o],e[o+1]))}}}};var D=class r{constructor(t,e,o=Float32Array,a=null,s=null){this._buf=t,this._loBuf=a,this.length=e,this.dtype=o,this.device=s??$r()}static from(t,e){let o=t instanceof GPUDevice,a=o?t:$r(),s=o?e:t;if(s instanceof Float64Array){let{hi:m,lo:n}=Pr(s),l=x(a,m,"gpu-vector-f64-hi",!0),u=x(a,n,"gpu-vector-f64-lo",!0);return new r(l,s.length,Float64Array,u,a)}if(s instanceof hr){let m=x(a,Qr(s),"gpu-vector-complex32",!0);return new r(m,s.length,hr,null,a)}if(s instanceof _r){let{hi:m,lo:n}=pe(s),l=x(a,m,"gpu-vector-complex64-hi",!0),u=x(a,n,"gpu-vector-complex64-lo",!0);return new r(l,s.length,_r,u,a)}if(!(s instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.");let i=x(a,s,"gpu-vector",!0);return new r(i,s.length,s.constructor,null,a)}async read(){let t=this.device,e=t.createCommandEncoder(),o=k(t,e,this._buf);if(t.queue.submit([e.finish()]),this.dtype===hr)return new hr(await S(o,Float32Array));if(!this._loBuf)return S(o,this.dtype);let a=t.createCommandEncoder(),s=k(t,a,this._loBuf);t.queue.submit([a.finish()]);let[i,m]=await Promise.all([S(o,Float32Array),S(s,Float32Array)]);return this.dtype===_r?de(i,m):Lr(i,m)}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};var O=class r{constructor(t,e,o,a,s=null,i="row-major",m=null,n=Float32Array){this._buf=t,this._loBuf=s,this.rows=e,this.cols=o,this.lda=a,this.layout=i,this.dtype=n,this.device=m??$r()}static from(t,...e){let o=t instanceof GPUDevice,a=o?t:$r(),s=o?e.shift():t,[i,m,n,l="row-major"]=e;if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");let u=l==="row-major";if(n===void 0&&(n=u?m:i),!(s instanceof Float32Array)&&!(s instanceof Float64Array)&&!(s instanceof hr)&&!(s instanceof _r))throw new Error("GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.");if(!Number.isInteger(i)||i<=0)throw new Error("rows must be a positive integer.");if(!Number.isInteger(m)||m<=0)throw new Error("cols must be a positive integer.");let f=u?m:i;if(!Number.isInteger(n)||n<f)throw new Error(`lda must be an integer >= ${u?"cols":"rows"}.`);let p=u?i:m;if(s.length<p*n)throw new Error("data does not have enough elements for the given rows, cols, and lda.");if(s instanceof Float64Array){let w=p*n,{hi:g,lo:h}=Pr(s.subarray(0,w)),b=x(a,g,"gpu-matrix-f64-hi",!0),y=x(a,h,"gpu-matrix-f64-lo",!0);return new r(b,i,m,n,y,l,a,Float64Array)}if(s instanceof hr){let w=x(a,Qr(s,p*n),"gpu-matrix-complex32",!0);return new r(w,i,m,n,null,l,a,hr)}if(s instanceof _r){let{hi:w,lo:g}=pe(s,p*n),h=x(a,w,"gpu-matrix-complex64-hi",!0),b=x(a,g,"gpu-matrix-complex64-lo",!0);return new r(h,i,m,n,b,l,a,_r)}let c=x(a,s.subarray(0,p*n),"gpu-matrix",!0);return new r(c,i,m,n,null,l,a)}async read(){let t=this.device,e=t.createCommandEncoder(),o=k(t,e,this._buf);t.queue.submit([e.finish()]);let a=this.layout!=="column-major",s=a?this.rows:this.cols,i=a?this.cols:this.rows;if(this.dtype===hr){let l=new hr(await S(o,Float32Array));if(this.lda===i)return l;let u=new hr(s*i);for(let f=0;f<s;f++)for(let p=0;p<i;p++)u[f*i+p]=l[f*this.lda+p];return u}if(this._loBuf){let l=t.createCommandEncoder(),u=k(t,l,this._loBuf);t.queue.submit([l.finish()]);let[f,p]=await Promise.all([S(o,Float32Array),S(u,Float32Array)]);if(this.dtype===_r){let g=de(f,p);if(this.lda===i)return g;let h=new _r(s*i);for(let b=0;b<s;b++)for(let y=0;y<i;y++)h[b*i+y]=g[b*this.lda+y];return h}let c=Lr(f,p);if(this.lda===i)return c;let w=new Float64Array(s*i);for(let g=0;g<s;g++)w.set(c.subarray(g*this.lda,g*this.lda+i),g*i);return w}let m=await S(o,Float32Array);if(this.lda===i)return m;let n=new Float32Array(s*i);for(let l=0;l<s;l++)n.set(m.subarray(l*this.lda,l*this.lda+i),l*i);return n}destroy(){this._buf.destroy(),this._loBuf&&this._loBuf.destroy()}};function Oe(r,t=-1,e=1){let o=new Float32Array(r);for(let a=0;a<r;a++)o[a]=t+Math.random()*(e-t);return o}function Ke(r,t=-1,e=1){let o=new Float64Array(r);for(let a=0;a<r;a++)o[a]=t+Math.random()*(e-t);return o}function Ve(r,t,e="lower",o=-1,a=1,s=5,i=15,m="row-major"){if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(m!=="row-major"&&m!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(t<r)throw new Error("lda must be >= n.");let n=m==="column-major",l=(f,p)=>n?p*t+f:f*t+p,u=new Float32Array(r*t);for(let f=0;f<r;f++){for(let p=0;p<r;p++){if(f===p)continue;(e==="lower"?p<f:p>f)&&(u[l(f,p)]=o+Math.random()*(a-o))}u[l(f,f)]=s+Math.random()*(i-s)}return u}function A(r,t,e,o=0){let a=e.map((s,i)=>({binding:o+i,resource:s instanceof GPUBuffer?{buffer:s}:s}));return r.createBindGroup({layout:t,entries:a})}function P(r,t){r.queue.submit([t.finish()])}function Rr(r){let{querySet:t,passDescriptor:e}=Ce(r);return{commandEncoder:r.createCommandEncoder(),querySet:t,passDescriptor:e}}function fr(r,t,e,o,a){let s=r.beginComputePass(a);s.setPipeline(t),s.setBindGroup(0,e),typeof o=="number"?s.dispatchWorkgroups(o):s.dispatchWorkgroups(o.x,o.y,o.z??1),s.end()}function j(r,t,e,o){let{commandEncoder:a,querySet:s,passDescriptor:i}=Rr(r);fr(a,t,e,o,i);let m=Dr(r,a,s);return{commandEncoder:a,ts:m}}var Za={},Me=new WeakMap;async function G(r,t,e="main"){Me.has(r)||Me.set(r,new Map);let o=Me.get(r),a=Array.isArray(t)?t:[t],s=`${a.join("+")}::${e}`;if(!o.has(s)){let i=$a(r,a,e).catch(m=>{throw o.delete(s),m});o.set(s,i)}return o.get(s)}async function Xa(r){if(typeof process>"u"||!process.versions?.node){let{shaderSources:t}=await Promise.resolve().then(()=>(co(),fo)),e=t[r];if(!e)throw new Error(`Shader "${r}" not found in browser bundle.`);return e}else{let{readFileSync:t}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:o,join:a}=await import("path"),s=o(e(Za.url));return t(a(s,`../shaders/${r}.wgsl`),"utf8")}}async function $a(r,t,e="main"){let o=t.join("+"),a=await Promise.all(t.map(Xa)),s=0,i=a.map((w,g)=>{let h=w.split(`
`).length,b={name:t[g],startLine:s+1,endLine:s+h};return s+=h,b}),m=w=>{let g=w&&i.find(h=>w>=h.startLine&&w<=h.endLine);return g?`${g.name}.wgsl:${w-g.startLine+1}`:`line ${w}`},n=a.join(`
`),l=r.createShaderModule({label:o,code:n}),f=(await l.getCompilationInfo()).messages.filter(w=>w.type==="error");if(f.length>0)throw new Error(`Shader "${o}" compilation failed:
${f.map(w=>`  ${m(w.lineNum)}: ${w.message}`).join(`
`)}`);let p=e==="main"?{module:l}:{module:l,entryPoint:e},c=r.createComputePipeline({label:o,layout:"auto",compute:p});return c._shaderModule=l,c}function Br(r,t,e){let o=r.limits.maxComputeWorkgroupsPerDimension;return e===void 0?Math.min(Math.ceil(t/64),o):{x:Math.min(Math.ceil(e/8),o),y:Math.min(Math.ceil(t/8),o)}}function q(r,t,e,o="x"){let a=r.limits.maxComputeWorkgroupsPerDimension;if(t>a)throw new Error(`${e}: this problem needs ${t} workgroups in ${o}, but the device allows ${a} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`);return t}function Hr(r,t,e,o){return o===void 0?q(r,Math.ceil(e/64),t):{x:q(r,Math.ceil(o/8),t,"x"),y:q(r,Math.ceil(e/8),t,"y")}}function R(r,t,e){for(let[o,a]of Object.entries(e))if(!(!(a instanceof D)&&!(a instanceof O))&&a.device!==r)throw new Error(`${t}: ${o} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`)}async function po(r,t,e,o,a){let s=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sscal",{x:o}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(o instanceof Float32Array)&&!(o instanceof D))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return s?{}:{x:o};if(o.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(r,"sscal"),m=null,n=null,l=null;try{m=s?o._buf:x(r,o,"sscal-x",!0),n=I(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"}],"sscal-params");let u=A(r,i.getBindGroupLayout(0),[m,n]),{commandEncoder:f,ts:p}=j(r,i,u,Br(r,t));l=s?null:k(r,f,m),P(r,f);let c=await M(p);if(s)return c!==void 0?{gpuTimeMs:c}:{};let w=await S(l,Float32Array);return l=null,c!==void 0?{x:w,gpuTimeMs:c}:{x:w}}finally{!s&&m&&d(m),n&&d(n),l&&d(l)}}async function wo(r,t,e,o,a){let s=o instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"cscal",{x:o}),!Number.isInteger(t)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(!(e instanceof Fr))throw new Error("alpha must be a Complex32.");if(Number.isNaN(e.re)||Number.isNaN(e.im))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e.re)||!Number.isFinite(e.im))throw new Error("alpha must be finite.");if(a<=0)throw new Error("incx must be positive.");if(!(o instanceof hr)&&!s)throw new Error("x must be a Complex32Array or GpuVector.");if(s&&o.dtype!==hr)throw new Error("x must be a Complex32Array-backed GpuVector.");if(t<=0)return s?{}:{x:o};if(o.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let i=await G(r,"cscal"),m=null,n=null,l=null;try{m=s?o._buf:x(r,Qr(o),"cscal-x",!0),n=I(r,[{value:t,type:"u32"},{value:e.re,type:"f32"},{value:e.im,type:"f32"},{value:a,type:"u32"}],"cscal-params");let u=A(r,i.getBindGroupLayout(0),[m,n]),{commandEncoder:f,ts:p}=j(r,i,u,Br(r,t));l=s?null:k(r,f,m),P(r,f);let c=await M(p);if(s)return c!==void 0?{gpuTimeMs:c}:{};let w=await S(l,Float32Array);l=null;let g=new hr(w);return c!==void 0?{x:g,gpuTimeMs:c}:{x:g}}finally{!s&&m&&d(m),n&&d(n),l&&d(l)}}async function go(r,t,e,o,a,s){let i=e instanceof D,m=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sswap",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof D))throw new Error("x must be a Float32Array or GpuVector.");if(!(a instanceof Float32Array)&&!(a instanceof D))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==a.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return i?{}:{x:e,y:a};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"sswap"),l=null,u=null,f=null,p=null,c=null;try{l=i?e._buf:x(r,e,"sswap-x",!0),u=m?a._buf:x(r,a,"sswap-y",!0),f=I(r,[{value:t,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"sswap-params");let w=A(r,n.getBindGroupLayout(0),[l,u,f]),{commandEncoder:g,ts:h}=j(r,n,w,Br(r,t));p=i?null:k(r,g,l),c=m?null:k(r,g,u),P(r,g);let b=await M(h);if(i)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(p,Float32Array);p=null;let _=await S(c,Float32Array);return c=null,b!==void 0?{x:y,y:_,gpuTimeMs:b}:{x:y,y:_}}finally{!i&&l&&d(l),!m&&u&&d(u),f&&d(f),p&&d(p),c&&d(c)}}async function bo(r,t,e,o,a,s,i){let m=o instanceof D,n=s instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"saxpy",{x:o,y:s}),!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(i))throw new Error("n, incx, and incy must be integers.");if(typeof e!="number")throw new Error("alpha must be a number.");if(Number.isNaN(e))throw new Error("alpha must not be NaN.");if(!Number.isFinite(e))throw new Error("alpha must be finite.");if(a<=0||i<=0)throw new Error("incx and incy must be positive.");if(!m&&!(o instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(s instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{y:s};if(o.length<(t-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(s.length<(t-1)*i+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await G(r,"saxpy"),u=null,f=null,p=null,c=null;try{u=m?o._buf:x(r,o,"saxpy-x",!1),f=n?s._buf:x(r,s,"saxpy-y",!0),p=I(r,[{value:t,type:"u32"},{value:e,type:"f32"},{value:a,type:"u32"},{value:i,type:"u32"}],"saxpy-params");let w=A(r,l.getBindGroupLayout(0),[u,f,p]),{commandEncoder:g,ts:h}=j(r,l,w,Br(r,t));c=n?null:k(r,g,f),P(r,g);let b=await M(h);if(n)return b!==void 0?{gpuTimeMs:b}:{};let y=await S(c,Float32Array);return c=null,b!==void 0?{y,gpuTimeMs:b}:{y}}finally{!m&&u&&d(u),!n&&f&&d(f),p&&d(p),c&&d(c)}}async function ho(r,t,e,o,a,s){let i=e instanceof D,m=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"scopy",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return m?{}:{y:a};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"scopy"),l=null,u=null,f=null,p=null;try{l=i?e._buf:x(r,e,"scopy-x",!1),u=m?a._buf:x(r,a,"scopy-y",!0),f=I(r,[{value:t,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"scopy-params");let c=A(r,n.getBindGroupLayout(0),[l,u,f]),{commandEncoder:w,ts:g}=j(r,n,c,Br(r,t));p=m?null:k(r,w,u),P(r,w);let h=await M(g);if(m)return h!==void 0?{gpuTimeMs:h}:{};let b=await S(p,Float32Array);return p=null,h!==void 0?{y:b,gpuTimeMs:h}:{y:b}}finally{!i&&l&&d(l),!m&&u&&d(u),f&&d(f),p&&d(p)}}async function yo(r,t,e,o,a,s){let i=e instanceof D,m=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sdot",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!m&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==m)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return{dot:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=await G(r,"sdot"),l=await G(r,"reduction/sum"),u=null,f=null,p=null,c=null,w=null,g=null;try{u=i?e._buf:x(r,e,"sdot-x",!1),f=m?a._buf:x(r,a,"sdot-y",!1),p=er(r,512,"sdot-partials"),c=xr(r,4,"sdot-result"),w=I(r,[{value:t,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"sdot-params");let h=A(r,n.getBindGroupLayout(0),[u,f,p,w]),{commandEncoder:b,ts:y}=j(r,n,h,128);P(r,b);let _=A(r,l.getBindGroupLayout(0),[p,c]),{commandEncoder:v,ts:E}=j(r,l,_,1);g=k(r,v,c),P(r,v);let N=S(g,Float32Array);g=null;let[B,L,T]=await Promise.all([M(y),M(E),N]);return B!==void 0&&L!==void 0?{dot:T[0],gpuTimeMs:B+L}:{dot:T[0]}}finally{!i&&u&&d(u),!m&&f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function xo(r,t,e,o){let a=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"sasum"),i=await G(r,"reduction/sum"),m=null,n=null,l=null,u=null,f=null;try{m=a?e._buf:x(r,e,"sasum-x",!1),n=er(r,512,"sasum-partials"),l=xr(r,4,"sasum-result"),u=I(r,[{value:t,type:"u32"},{value:o,type:"u32"}],"sasum-params");let p=A(r,s.getBindGroupLayout(0),[m,n,u]),{commandEncoder:c,ts:w}=j(r,s,p,128);P(r,c);let g=A(r,i.getBindGroupLayout(0),[n,l]),{commandEncoder:h,ts:b}=j(r,i,g,1);f=k(r,h,l),P(r,h);let y=S(f,Float32Array);f=null;let[_,v,E]=await Promise.all([M(w),M(b),y]);return _!==void 0&&v!==void 0?{asum:E[0],gpuTimeMs:_+v}:{asum:E[0]}}finally{!a&&m&&d(m),n&&d(n),l&&d(l),u&&d(u),f&&d(f)}}async function vo(r,t,e,o){let a=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"dasum",{x:e}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(a&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{asum:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/add"],i=await G(r,[...s,"dasum"]),m=await G(r,[...s,"reduction/sumF64"]),n=null,l=null,u=null,f=null,p=null,c=null,w=null,g=null,h=null;try{if(a)n=e._buf,l=e._loBuf;else{let{hi:z,lo:F}=Pr(e.map(Math.abs));n=x(r,z,"dasum-xHi",!1),l=x(r,F,"dasum-xLo",!1)}u=er(r,512,"dasum-partialsHi"),f=er(r,512,"dasum-partialsLo"),p=xr(r,4,"dasum-result-hi"),c=xr(r,4,"dasum-result-lo"),w=I(r,[{value:t,type:"u32"},{value:o,type:"u32"}],"dasum-params");let b=A(r,i.getBindGroupLayout(0),[n,l,u,f,w]),{commandEncoder:y,ts:_}=j(r,i,b,128);P(r,y);let v=A(r,m.getBindGroupLayout(0),[u,f,p,c]),{commandEncoder:E,ts:N}=j(r,m,v,1);g=k(r,E,p),h=k(r,E,c),P(r,E);let B=S(g,Float32Array),L=S(h,Float32Array);g=null,h=null;let[T,C,W,U]=await Promise.all([M(_),M(N),B,L]),V=Lr(W,U)[0];return T!==void 0&&C!==void 0?{asum:V,gpuTimeMs:T+C}:{asum:V}}finally{!a&&n&&d(n),!a&&l&&d(l),u&&d(u),f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g),h&&d(h)}}async function _o(r,t,e,o,a,s){let i=e instanceof D,m=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ddot",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(!m&&!(a instanceof Float64Array))throw new Error("y must be a Float64Array or GpuVector.");if(i&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(m&&a.dtype!==Float64Array)throw new Error("y must be a Float64Array-backed GpuVector.");if(i!==m)throw new Error("x and y must be the same type (both Float64Array or both GpuVector).");if(t<=0)return{dot:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let n=["f64/dekker","f64/utils/add"],l=await G(r,[...n,"f64/utils/multiply","ddot"]),u=await G(r,[...n,"reduction/sumF64"]),f=null,p=null,c=null,w=null,g=null,h=null,b=null,y=null,_=null,v=null,E=null;try{if(i)f=e._buf,p=e._loBuf,c=a._buf,w=a._loBuf;else{let nr=Pr(e),lr=Pr(a);f=x(r,nr.hi,"ddot-xHi",!1),p=x(r,nr.lo,"ddot-xLo",!1),c=x(r,lr.hi,"ddot-yHi",!1),w=x(r,lr.lo,"ddot-yLo",!1)}g=er(r,512,"ddot-partialsHi"),h=er(r,512,"ddot-partialsLo"),b=xr(r,4,"ddot-result-hi"),y=xr(r,4,"ddot-result-lo"),_=I(r,[{value:t,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"ddot-params");let N=A(r,l.getBindGroupLayout(0),[f,p,c,w,g,h,_]),{commandEncoder:B,ts:L}=j(r,l,N,128);P(r,B);let T=A(r,u.getBindGroupLayout(0),[g,h,b,y]),{commandEncoder:C,ts:W}=j(r,u,T,1);v=k(r,C,b),E=k(r,C,y),P(r,C);let U=S(v,Float32Array),V=S(E,Float32Array);v=null,E=null;let[z,F,J,Y]=await Promise.all([M(L),M(W),U,V]),X=Lr(J,Y)[0];return z!==void 0&&F!==void 0?{dot:X,gpuTimeMs:z+F}:{dot:X}}finally{!i&&f&&d(f),!i&&p&&d(p),!m&&c&&d(c),!m&&w&&d(w),g&&d(g),h&&d(h),b&&d(b),y&&d(y),_&&d(_),v&&d(v),E&&d(E)}}async function Bo(r,t,e,o){let a=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"snrm2",{x:e}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{nrm2:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"snrm2"),i=await G(r,"reduction/scaledSum"),m=null,n=null,l=null,u=null,f=null,p=null;try{m=a?e._buf:x(r,e,"snrm2-x",!1),n=er(r,512,"snrm2-partials-scale"),l=er(r,512,"snrm2-partials-ssq"),u=xr(r,4,"snrm2-result"),f=I(r,[{value:t,type:"u32"},{value:o,type:"u32"}],"snrm2-params");let c=A(r,s.getBindGroupLayout(0),[m,n,l,f]),{commandEncoder:w,ts:g}=j(r,s,c,128);P(r,w);let h=A(r,i.getBindGroupLayout(0),[n,l,u]),{commandEncoder:b,ts:y}=j(r,i,h,1);p=k(r,b,u),P(r,b);let _=S(p,Float32Array);p=null;let[v,E,N]=await Promise.all([M(g),M(y),_]),B=N[0];return v!==void 0&&E!==void 0?{nrm2:B,gpuTimeMs:v+E}:{nrm2:B}}finally{!a&&m&&d(m),n&&d(n),l&&d(l),u&&d(u),f&&d(f),p&&d(p)}}async function Ao(r,t,e,o){let a=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"isamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await G(r,"isamax"),i=await G(r,"reduction/argmax"),m=null,n=null,l=null,u=null,f=null,p=null;try{m=a?e._buf:x(r,e,"isamax-x",!1),n=er(r,512,"isamax-partials-val"),l=er(r,512,"isamax-partials-idx"),u=xr(r,4,"isamax-result"),f=I(r,[{value:t,type:"u32"},{value:o,type:"u32"}],"isamax-params");let c=A(r,s.getBindGroupLayout(0),[m,n,l,f]),{commandEncoder:w,ts:g}=j(r,s,c,128);P(r,w);let h=A(r,i.getBindGroupLayout(0),[n,l,u]),{commandEncoder:b,ts:y}=j(r,i,h,1);p=k(r,b,u),P(r,b);let _=S(p,Uint32Array);p=null;let[v,E,N]=await Promise.all([M(g),M(y),_]),B=N[0];return v!==void 0&&E!==void 0?{index:B,gpuTimeMs:v+E}:{index:B}}finally{!a&&m&&d(m),n&&d(n),l&&d(l),u&&d(u),f&&d(f),p&&d(p)}}async function Eo(r,t,e,o){let a=e instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"idamax",{x:e}),!Number.isInteger(t)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(o<=0)throw new Error("incx must be positive.");if(!a&&!(e instanceof Float64Array))throw new Error("x must be a Float64Array or GpuVector.");if(a&&e.dtype!==Float64Array)throw new Error("x must be a Float64Array-backed GpuVector.");if(t<=0)return{index:0};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=["f64/dekker","f64/utils/abs","f64/utils/greater","f64/utils/equal"],i=await G(r,[...s,"idamax"],"idamax_main"),m=await G(r,[...s,"reduction/argmaxF64"],"reduce_f64"),n=null,l=null,u=null,f=null,p=null,c=null,w=null,g=null;try{if(a)n=e._buf,l=e._loBuf;else{let{hi:W,lo:U}=Pr(e);n=x(r,W,"idamax-xHi",!1),l=x(r,U,"idamax-xLo",!1)}u=er(r,512,"idamax-partials-val-hi"),f=er(r,512,"idamax-partials-val-lo"),p=er(r,512,"idamax-partials-idx"),c=xr(r,4,"idamax-result"),w=I(r,[{value:t,type:"u32"},{value:o,type:"u32"}],"idamax-params");let h=A(r,i.getBindGroupLayout(0),[n,l,u,f,p,w]),{commandEncoder:b,ts:y}=j(r,i,h,128);P(r,b);let _=A(r,m.getBindGroupLayout(0),[u,f,p,c]),{commandEncoder:v,ts:E}=j(r,m,_,1);g=k(r,v,c),P(r,v);let N=S(g,Uint32Array);g=null;let[B,L,T]=await Promise.all([M(y),M(E),N]),C=T[0];return B!==void 0&&L!==void 0?{index:C,gpuTimeMs:B+L}:{index:C}}finally{!a&&n&&d(n),!a&&l&&d(l),u&&d(u),f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function Go(r,t,e,o,a,s,i,m){let n=e instanceof D,l=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"srot",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(typeof i!="number")throw new Error("c must be a number.");if(typeof m!="number")throw new Error("s must be a number.");if(Number.isNaN(i)||Number.isNaN(m))throw new Error("c and s must not be NaN.");if(!Number.isFinite(i))throw new Error("c must be finite.");if(!Number.isFinite(m))throw new Error("s must be finite.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!n&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!l&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(n!==l)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0)return n?{}:{x:e,y:a};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await G(r,"srot"),f=null,p=null,c=null,w=null,g=null;try{f=n?e._buf:x(r,e,"srot-x",!0),p=l?a._buf:x(r,a,"srot-y",!0),c=I(r,[{value:t,type:"u32"},{value:i,type:"f32"},{value:m,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"srot-params");let h=A(r,u.getBindGroupLayout(0),[f,p,c]),{commandEncoder:b,ts:y}=j(r,u,h,Br(r,t));w=n?null:k(r,b,f),g=l?null:k(r,b,p),P(r,b);let _=await M(y);if(n)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),E=S(g,Float32Array);w=null,g=null;let[N,B]=await Promise.all([v,E]);return _!==void 0?{x:N,y:B,gpuTimeMs:_}:{x:N,y:B}}finally{!n&&f&&d(f),!l&&p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function So(r,t,e,o,a,s,i){let m=e instanceof D,n=a instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"srotm",{x:e,y:a}),!Number.isInteger(t)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(!(i instanceof Float32Array)||i.length!==5)throw new Error("param must be a Float32Array of length 5.");if(i[0]!==-2&&i[0]!==-1&&i[0]!==0&&i[0]!==1)throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!m&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!n&&!(a instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(m!==n)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(t<=0||i[0]===-2)return m?{}:{x:e,y:a};if(e.length<(t-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(a.length<(t-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let l=await G(r,"srotm"),u=null,f=null,p=null,c=null,w=null,g=null;try{u=m?e._buf:x(r,e,"srotm-x",!0),f=n?a._buf:x(r,a,"srotm-y",!0),p=x(r,i,"srotm-param",!1),c=I(r,[{value:t,type:"u32"},{value:o,type:"u32"},{value:s,type:"u32"}],"srotm-params");let h=A(r,l.getBindGroupLayout(0),[u,f,p,c]),{commandEncoder:b,ts:y}=j(r,l,h,Br(r,t));w=m?null:k(r,b,u),g=n?null:k(r,b,f),P(r,b);let _=await M(y);if(m)return _!==void 0?{gpuTimeMs:_}:{};let v=S(w,Float32Array),E=S(g,Float32Array);w=null,g=null;let[N,B]=await Promise.all([v,E]);return _!==void 0?{x:N,y:B,gpuTimeMs:_}:{x:N,y:B}}finally{!m&&u&&d(u),!n&&f&&d(f),p&&d(p),c&&d(c),w&&d(w),g&&d(g)}}async function ko(r,t,e,o,a,s,i,m,n,l,u,f,p="row-major"){let c=s instanceof O,w=m instanceof D,g=u instanceof D;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sgemv",{A:s,x:m,y:u}),t!=="no-transpose"&&t!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof a!="number")throw new Error("alpha must be a number.");if(Number.isNaN(a))throw new Error("alpha must not be NaN.");if(!Number.isFinite(a))throw new Error("alpha must be finite.");if(typeof l!="number")throw new Error("beta must be a number.");if(Number.isNaN(l))throw new Error("beta must not be NaN.");if(!Number.isFinite(l))throw new Error("beta must be finite.");if(!Number.isInteger(e)||!Number.isInteger(o)||!Number.isInteger(n)||!Number.isInteger(f)||!Number.isInteger(i))throw new Error("m, n, incx, incy, and lda must be integers.");if(n<=0||f<=0)throw new Error("incx and incy must be positive.");if(!c&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!g&&!(u instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(w!==g)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(w&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!w)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&m._buf===u._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&g&&s._buf===u._buf)throw new Error("A and y must not reference the same GPU buffer.");if(c&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(s.rows<e||s.cols<o))throw new Error("A is too small for the given m and n.");if(e<0||o<0)throw new Error("m and n must be non-negative.");if(e===0||o===0)return g?{}:{y:u};(c?s.layout:p)==="column-major"&&([e,o]=[o,e],t=t==="no-transpose"?"transpose":"no-transpose");let b=t==="no-transpose",y=b?o:e,_=b?e:o;if(i<o)throw new Error("lda must be >= n.");if(!c&&s.length<(e-1)*i+o)throw new Error("A does not have enough elements for the given m, n, and lda.");if(m.length<(y-1)*n+1)throw new Error("x does not have enough elements for the given dimensions and incx.");if(u.length<(_-1)*f+1)throw new Error("y does not have enough elements for the given dimensions and incy.");let E=await G(r,b?"sgemv_n":"sgemv_t"),N=null,B=null,L=null,T=null;try{N=c?s._buf:x(r,s,"sgemv-A",!1),B=w?m._buf:x(r,m,"sgemv-x",!1),L=g?u._buf:x(r,u,"sgemv-y",!0),T=I(r,[{value:e,type:"u32"},{value:o,type:"u32"},{value:a,type:"f32"},{value:l,type:"f32"},{value:n,type:"u32"},{value:f,type:"u32"},{value:i,type:"u32"}],"sgemv-params");let C=A(r,E.getBindGroupLayout(0),[N,B,L,T]),W=b?Math.min(e,r.limits.maxComputeWorkgroupsPerDimension):Hr(r,"sgemv",_),{commandEncoder:U,ts:V}=j(r,E,C,W),z=g?null:k(r,U,L);P(r,U);let F=await M(V);if(g)return F!==void 0?{gpuTimeMs:F}:{};let J=await S(z,Float32Array);return F!==void 0?{y:J,gpuTimeMs:F}:{y:J}}finally{!c&&N&&d(N),!w&&B&&d(B),!g&&L&&d(L),T&&d(T)}}async function No(r,t,e,o,a,s,i,m,n,l,u,f="row-major"){let p=i instanceof D,c=l instanceof D,w=a instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssymv",{A:a,x:i,y:l}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(m)||!Number.isInteger(u)||!Number.isInteger(s))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(m<=0||u<=0)throw new Error("incx and incy must be positive.");if(s<e)throw new Error("lda must be >= n.");if(!w&&!(a instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(i instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(p&&i._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(w&&s!==a.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(a.rows<e||a.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{y:l};if(!w&&a.length<(e-1)*s+e)throw new Error("A does not have enough elements for the given n and lda.");if(i.length<(e-1)*m+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(e-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let h=(w?a.layout:f)==="column-major"?t==="upper":t==="lower",b=await G(r,"ssymv"),y=null,_=null,v=null,E=null;try{y=w?a._buf:x(r,a,"ssymv-A",!1),_=p?i._buf:x(r,i,"ssymv-x",!1),v=c?l._buf:x(r,l,"ssymv-y",!0),E=I(r,[{value:e,type:"u32"},{value:o,type:"f32"},{value:n,type:"f32"},{value:m,type:"u32"},{value:u,type:"u32"},{value:s,type:"u32"},{value:h?0:1,type:"u32"}],"ssymv-params");let N=A(r,b.getBindGroupLayout(0),[y,_,v,E]),B=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:L,ts:T}=j(r,b,N,B),C=c?null:k(r,L,v);P(r,L);let W=await M(T);if(c)return W!==void 0?{gpuTimeMs:W}:{};let U=await S(C,Float32Array);return W!==void 0?{y:U,gpuTimeMs:W}:{y:U}}finally{!w&&y&&d(y),!p&&_&&d(_),!c&&v&&d(v),E&&d(E)}}async function Mo(r,t,e,o,a,s,i,m,n,l,u,f="row-major"){let p=m instanceof D,c=l instanceof D,w=s instanceof O,g=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"strmv",{A:s,x:m,y:l}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!g&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(a)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(i))throw new Error("n, incx, incy, and lda must be integers.");if(n<=0||u<=0)throw new Error("incx and incy must be positive.");if(i<a)throw new Error("lda must be >= n.");if(!w&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!p&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!c&&!(l instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(p!==c)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(p&&m._buf===l._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(p&&!w)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(w&&!p)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(w&&c&&s._buf===l._buf)throw new Error("A and y must not reference the same GPU buffer.");if(w&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(w&&(s.rows<a||s.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return c?{}:{y:l};if(!w&&s.length<(a-1)*i+a)throw new Error("A does not have enough elements for the given n and lda.");if(m.length<(a-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");if(l.length<(a-1)*u+1)throw new Error("y does not have enough elements for the given n and incy.");let b=(w?s.layout:f)==="column-major",y=b?t==="upper":t==="lower",_=b?e==="transpose":e==="no-transpose",v=await G(r,"strmv"),E=null,N=null,B=null,L=null;try{E=w?s._buf:x(r,s,"strmv-A",!1),N=p?m._buf:x(r,m,"strmv-x",!1),B=c?l._buf:x(r,l,"strmv-y",!0),L=I(r,[{value:a,type:"u32"},{value:n,type:"u32"},{value:u,type:"u32"},{value:i,type:"u32"},{value:_?0:1,type:"u32"},{value:y?0:1,type:"u32"},{value:g?1:0,type:"u32"}],"strmv-params");let T=A(r,v.getBindGroupLayout(0),[E,N,B,L]),C=Math.min(a,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:W,ts:U}=j(r,v,T,C),V=c?null:k(r,W,B);P(r,W);let z=await M(U);if(c)return z!==void 0?{gpuTimeMs:z}:{};let F=await S(V,Float32Array);return z!==void 0?{y:F,gpuTimeMs:z}:{y:F}}finally{!w&&E&&d(E),!p&&N&&d(N),!c&&B&&d(B),L&&d(L)}}function Do(r,t,e){let o=new ArrayBuffer(r*t),a=new DataView(o);for(let s=0;s<r;s++){let i=e(s),m=s*t;i.forEach((n,l)=>a.setUint32(m+l*4,n,!0))}return o}function Po(r,t,e){let o=r.createBuffer({label:e,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(o,0,t),o}async function Io(r,t,e,o,a,s,i,m,n,l="row-major"){let u=m instanceof D,f=s instanceof O,p=o==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"strsv",{A:s,x:m}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(!p&&o!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(l!=="row-major"&&l!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(a)||!Number.isInteger(n)||!Number.isInteger(i))throw new Error("n, incx, and lda must be integers.");if(n<=0)throw new Error("incx must be positive.");if(i<a)throw new Error("lda must be >= n.");if(!f&&!(s instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!u&&!(m instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(u&&!f)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(f&&!u)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(f&&u&&s._buf===m._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&i!==s.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(s.rows<a||s.cols<a))throw new Error("A is too small for the given n.");if(a<0)throw new Error("n must be non-negative.");if(a===0)return u?{}:{x:m};if(!f&&s.length<(a-1)*i+a)throw new Error("A does not have enough elements for the given n and lda.");if(m.length<(a-1)*n+1)throw new Error("x does not have enough elements for the given n and incx.");let w=(f?s.layout:l)==="column-major",g=w?t==="upper":t==="lower",h=w?e==="transpose":e==="no-transpose",b=await G(r,"strsv_invert_block"),y=await G(r,"strsv_apply_inverse"),_=await G(r,"strsv_update"),v=h===g,E=[];for(let F=0;F<a;F+=64)E.push(F);v||E.reverse();let N=E.length,B=r.limits.maxComputeWorkgroupsPerDimension,L=r.limits.minUniformBufferOffsetAlignment,T=null,C=null,W=null,U=null,V=null,z=null;try{T=f?s._buf:x(r,s,"strsv-A",!1),C=u?m._buf:x(r,m,"strsv-x",!0),W=er(r,N*64*64*4,"strsv-Ainv");let F=Do(N,L,Q=>{let H=Q*64,Z=Math.min(H+64,a);return[n,Q,H,Z]});U=Po(r,F,"strsv-apply-params");let J=Do(N,L,Q=>{let H=Q*64,Z=Math.min(H+64,a);return[a,n,i,h?0:1,g?0:1,H,Z]});V=Po(r,J,"strsv-update-params");let{commandEncoder:Y,querySet:X}=Rr(r);z=I(r,[{value:a,type:"u32"},{value:i,type:"u32"},{value:h?0:1,type:"u32"},{value:g?0:1,type:"u32"},{value:p?1:0,type:"u32"}],"strsv-invert-params");let nr=A(r,b.getBindGroupLayout(0),[T,W,z]);fr(Y,b,nr,{x:64,y:N},X?{timestampWrites:{querySet:X,beginningOfPassWriteIndex:0}}:void 0);for(let Q=0;Q<E.length;Q++){let H=E[Q],Z=Math.min(H+64,a),rr=H/64,mr=Q===E.length-1,dr=rr*L,sr=A(r,y.getBindGroupLayout(0),[W,C,{buffer:U,offset:dr,size:16}]);fr(Y,y,sr,1,mr&&X?{timestampWrites:{querySet:X,endOfPassWriteIndex:1}}:void 0);let wr=v?a-Z:H;if(wr===0)continue;let Cr=A(r,_.getBindGroupLayout(0),[T,C,{buffer:V,offset:dr,size:32}]),Ir=Math.min(wr,B);fr(Y,_,Cr,Ir)}let pr=Dr(r,Y,X),tr=u?null:k(r,Y,C);P(r,Y);let ur=await M(pr);if(u)return ur!==void 0?{gpuTimeMs:ur}:{};let $=await S(tr,Float32Array);return ur!==void 0?{x:$,gpuTimeMs:ur}:{x:$}}finally{!f&&T&&d(T),!u&&C&&d(C),W&&d(W),U&&d(U),V&&d(V),z&&d(z)}}async function Ro(r,t,e,o,a,s,i,m,n,l,u="row-major"){let f=n instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sger",{A:n,x:a,y:i}),u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(!Number.isInteger(t)||!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(l))throw new Error("m, n, incx, incy, and lda must be integers.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(!f&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(f&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(f&&(n.rows<t||n.cols<e))throw new Error("A is too small for the given m and n.");(f?n.layout:u)==="column-major"&&([t,e]=[e,t],[a,i]=[i,a],[s,m]=[m,s]);let c=a instanceof D,w=i instanceof D;if(l<e)throw new Error("lda must be >= n.");if(!c&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!w&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(c!==w)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(c&&!f)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(f&&!c)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(f&&c&&n._buf===a._buf)throw new Error("A and x must not reference the same GPU buffer.");if(f&&w&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(t<0||e<0)throw new Error("m and n must be non-negative.");if(t===0||e===0)return f?{}:{A:n};if(!f&&n.length<(t-1)*l+e)throw new Error("A does not have enough elements for the given m, n, and lda.");if(a.length<(t-1)*s+1)throw new Error("x does not have enough elements for the given m and incx.");if(i.length<(e-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let g=await G(r,"sger"),h=null,b=null,y=null,_=null;try{h=c?a._buf:x(r,a,"sger-x",!1),b=w?i._buf:x(r,i,"sger-y",!1),y=f?n._buf:x(r,n,"sger-A",!0),_=I(r,[{value:t,type:"u32"},{value:e,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:l,type:"u32"}],"sger-params");let v=A(r,g.getBindGroupLayout(0),[h,b,y,_]),E=Math.min(t,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:N,ts:B}=j(r,g,v,E),L=f?null:k(r,N,y);P(r,N);let T=await M(B);if(f)return T!==void 0?{gpuTimeMs:T}:{};let C=await S(L,Float32Array);return T!==void 0?{A:C,gpuTimeMs:T}:{A:C}}finally{!c&&h&&d(h),!w&&b&&d(b),!f&&y&&d(y),_&&d(_)}}async function To(r,t,e,o,a,s,i,m,n="row-major"){let l=a instanceof D,u=i instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssyr",{A:i,x:a}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(n!=="row-major"&&n!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(m))throw new Error("n, incx, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(s<=0)throw new Error("incx must be positive.");if(m<e)throw new Error("lda must be >= n.");if(!u&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!l&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(l&&!u)throw new Error("A must be a GpuMatrix when x is a GpuVector.");if(u&&!l)throw new Error("x must be a GpuVector when A is a GpuMatrix.");if(u&&l&&i._buf===a._buf)throw new Error("A and x must not reference the same GPU buffer.");if(u&&m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(u&&(i.rows<e||i.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return u?{}:{A:i};if(!u&&i.length<(e-1)*m+e)throw new Error("A does not have enough elements for the given n and lda.");if(a.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");let p=(u?i.layout:n)==="column-major"?t==="upper":t==="lower",c=await G(r,"ssyr"),w=null,g=null,h=null;try{w=l?a._buf:x(r,a,"ssyr-x",!1),g=u?i._buf:x(r,i,"ssyr-A",!0),h=I(r,[{value:e,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:p?0:1,type:"u32"}],"ssyr-params");let b=A(r,c.getBindGroupLayout(0),[w,g,h]),y=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:_,ts:v}=j(r,c,b,y),E=u?null:k(r,_,g);P(r,_);let N=await M(v);if(u)return N!==void 0?{gpuTimeMs:N}:{};let B=await S(E,Float32Array);return N!==void 0?{A:B,gpuTimeMs:N}:{A:B}}finally{!l&&w&&d(w),!u&&g&&d(g),h&&d(h)}}async function Co(r,t,e,o,a,s,i,m,n,l,u="row-major"){let f=a instanceof D,p=i instanceof D,c=n instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssyr2",{A:n,x:a,y:i}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(u!=="row-major"&&u!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(!Number.isInteger(e)||!Number.isInteger(s)||!Number.isInteger(m)||!Number.isInteger(l))throw new Error("n, incx, incy, and lda must be integers.");if(typeof o!="number")throw new Error("alpha must be a number.");if(Number.isNaN(o))throw new Error("alpha must not be NaN.");if(!Number.isFinite(o))throw new Error("alpha must be finite.");if(s<=0||m<=0)throw new Error("incx and incy must be positive.");if(l<e)throw new Error("lda must be >= n.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!f&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!p&&!(i instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(f!==p)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(f&&!c)throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");if(c&&!f)throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");if(c&&f&&n._buf===a._buf)throw new Error("A and x must not reference the same GPU buffer.");if(c&&p&&n._buf===i._buf)throw new Error("A and y must not reference the same GPU buffer.");if(f&&a._buf===i._buf)throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");if(c&&l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(c&&(n.rows<e||n.cols<e))throw new Error("A is too small for the given n.");if(e<0)throw new Error("n must be non-negative.");if(e===0)return c?{}:{A:n};if(!c&&n.length<(e-1)*l+e)throw new Error("A does not have enough elements for the given n and lda.");if(a.length<(e-1)*s+1)throw new Error("x does not have enough elements for the given n and incx.");if(i.length<(e-1)*m+1)throw new Error("y does not have enough elements for the given n and incy.");let g=(c?n.layout:u)==="column-major"?t==="upper":t==="lower",h=await G(r,"ssyr2"),b=null,y=null,_=null,v=null;try{b=f?a._buf:x(r,a,"ssyr2-x",!1),y=p?i._buf:x(r,i,"ssyr2-y",!1),_=c?n._buf:x(r,n,"ssyr2-A",!0),v=I(r,[{value:e,type:"u32"},{value:o,type:"f32"},{value:s,type:"u32"},{value:m,type:"u32"},{value:l,type:"u32"},{value:g?0:1,type:"u32"}],"ssyr2-params");let E=A(r,h.getBindGroupLayout(0),[b,y,_,v]),N=Math.min(e,r.limits.maxComputeWorkgroupsPerDimension),{commandEncoder:B,ts:L}=j(r,h,E,N),T=c?null:k(r,B,_);P(r,B);let C=await M(L);if(c)return C!==void 0?{gpuTimeMs:C}:{};let W=await S(T,Float32Array);return C!==void 0?{A:W,gpuTimeMs:C}:{A:W}}finally{!f&&b&&d(b),!p&&y&&d(y),!c&&_&&d(_),v&&d(v)}}async function Lo(r,t,e,o,a,s,i,m,n,l,u,f,p,c,w="row-major"){let g=m instanceof O,h=l instanceof O,b=p instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sgemm",{A:m,B:l,C:p}),t!=="no-transpose"&&t!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(w!=="row-major"&&w!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof i!="number")throw new Error("alpha must be a number.");if(Number.isNaN(i))throw new Error("alpha must not be NaN.");if(!Number.isFinite(i))throw new Error("alpha must be finite.");if(typeof f!="number")throw new Error("beta must be a number.");if(Number.isNaN(f))throw new Error("beta must not be NaN.");if(!Number.isFinite(f))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(a)||!Number.isInteger(s)||!Number.isInteger(n)||!Number.isInteger(u)||!Number.isInteger(c))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!g&&!(m instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!h&&!(l instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!b&&!(p instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((g||h)&&!b)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(b&&(!g||!h))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||a<0||s<0)throw new Error("m, n, and k must be non-negative.");if(n<=0||u<=0||c<=0)throw new Error("lda, ldb, and ldc must be positive.");if(o===0||a===0)return b?{}:{C:p};let y=g?m.layout:w,_=h?l.layout:w,v=b?p.layout:w,E=y==="column-major"?s:o,N=y==="column-major"?o:s,B=t==="no-transpose"?E:N,L=t==="no-transpose"?N:E;if(n<L)throw new Error(`lda must be >= ${y==="column-major"?"rows":"cols"} of A as stored.`);if(g){if(n!==m.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Z,rr]=t==="no-transpose"?[o,s]:[s,o];if(m.rows<Z||m.cols<rr)throw new Error("A is too small for the given m, k, and transA.")}else if(m.length<(B-1)*n+L)throw new Error("A does not have enough elements for the given dimensions and lda.");let T=_==="column-major"?a:s,C=_==="column-major"?s:a,W=e==="no-transpose"?T:C,U=e==="no-transpose"?C:T;if(u<U)throw new Error(`ldb must be >= ${_==="column-major"?"rows":"cols"} of B as stored.`);if(h){if(u!==l.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Z,rr]=e==="no-transpose"?[s,a]:[a,s];if(l.rows<Z||l.cols<rr)throw new Error("B is too small for the given n, k, and transB.")}else if(l.length<(W-1)*u+U)throw new Error("B does not have enough elements for the given dimensions and ldb.");let V=v==="column-major"?a:o,z=v==="column-major"?o:a;if(c<z)throw new Error(`ldc must be >= ${v==="column-major"?"rows":"cols"} of C as stored.`);if(b){if(c!==p.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(p.rows<o||p.cols<a)throw new Error("C is too small for the given m and n.")}else if(p.length<(V-1)*c+z)throw new Error("C does not have enough elements for the given dimensions and ldc.");y==="column-major"&&(t=t==="no-transpose"?"transpose":"no-transpose"),_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&([m,l]=[l,m],[g,h]=[h,g],[n,u]=[u,n],[t,e]=[e==="no-transpose"?"transpose":"no-transpose",t==="no-transpose"?"transpose":"no-transpose"],[o,a]=[a,o]);let F=Math.ceil(a/64),J=Math.ceil(o/64),Y=F*J>=36,X=await G(r,Y?"sgemm_large":"sgemm_small"),nr=g?m._buf:x(r,m,"sgemm-A",!1),lr=h?l._buf:x(r,l,"sgemm-B",!1),pr=b?p._buf:x(r,p,"sgemm-C",!0),tr=t==="no-transpose",ur=e==="no-transpose",$=tr&&Be(nr,n,o,s),Q=Be(lr,u,ur?s:a,ur?a:s),H=I(r,[{value:o,type:"u32"},{value:a,type:"u32"},{value:s,type:"u32"},{value:i,type:"f32"},{value:f,type:"f32"},{value:n,type:"u32"},{value:u,type:"u32"},{value:c,type:"u32"},{value:t==="transpose"?1:0,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:$?1:0,type:"u32"},{value:Q?1:0,type:"u32"}],"sgemm-params");try{let Z=A(r,X.getBindGroupLayout(0),[nr,vr(r,nr),lr,vr(r,lr),pr,H]),rr=Y?{x:q(r,F,"sgemm","x"),y:q(r,J,"sgemm","y")}:{x:q(r,Math.ceil(a/32),"sgemm","x"),y:q(r,Math.ceil(o/32),"sgemm","y")},{commandEncoder:mr,ts:dr}=j(r,X,Z,rr),sr=b?null:k(r,mr,pr);P(r,mr);let or=await M(dr);if(b)return or!==void 0?{gpuTimeMs:or}:{};let wr=await S(sr,Float32Array);return or!==void 0?{C:wr,gpuTimeMs:or}:{C:wr}}finally{g||d(nr),h||d(lr),b||d(pr),d(H)}}async function jo(r,t,e,o,a,s,i,m,n,l,u,f,p,c,w,g="row-major"){let h=n instanceof O,b=u instanceof O,y=c instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"sgemmtr",{A:n,B:u,C:c}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transB must be 'no-transpose' or 'transpose'.");if(g!=="row-major"&&g!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(typeof p!="number")throw new Error("beta must be a number.");if(Number.isNaN(p))throw new Error("beta must not be NaN.");if(!Number.isFinite(p))throw new Error("beta must be finite.");if(!Number.isInteger(a)||!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(f)||!Number.isInteger(w))throw new Error("m, n, k, lda, ldb, and ldc must be integers.");if(!h&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!b&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!y&&!(c instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((h||b)&&!y)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(y&&(!h||!b))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(a<0||s<0||i<0)throw new Error("m, n, and k must be non-negative.");if(l<=0||f<=0||w<=0)throw new Error("lda, ldb, and ldc must be positive.");if(a===0||s===0)return y?{}:{C:c};let _=h?n.layout:g,v=b?u.layout:g,E=y?c.layout:g,N=_==="column-major"?i:a,B=_==="column-major"?a:i,L=e==="no-transpose"?N:B,T=e==="no-transpose"?B:N;if(l<T)throw new Error(`lda must be >= ${_==="column-major"?"rows":"cols"} of A as stored.`);if(h){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[$,Q]=e==="no-transpose"?[a,i]:[i,a];if(n.rows<$||n.cols<Q)throw new Error("A is too small for the given m, k, and transA.")}else if(n.length<(L-1)*l+T)throw new Error("A does not have enough elements for the given dimensions and lda.");let C=v==="column-major"?s:i,W=v==="column-major"?i:s,U=o==="no-transpose"?C:W,V=o==="no-transpose"?W:C;if(f<V)throw new Error(`ldb must be >= ${v==="column-major"?"rows":"cols"} of B as stored.`);if(b){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[$,Q]=o==="no-transpose"?[i,s]:[s,i];if(u.rows<$||u.cols<Q)throw new Error("B is too small for the given n, k, and transB.")}else if(u.length<(U-1)*f+V)throw new Error("B does not have enough elements for the given dimensions and ldb.");let z=E==="column-major"?s:a,F=E==="column-major"?a:s;if(w<F)throw new Error(`ldc must be >= ${E==="column-major"?"rows":"cols"} of C as stored.`);if(y){if(w!==c.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(c.rows<a||c.cols<s)throw new Error("C is too small for the given m and n.")}else if(c.length<(z-1)*w+F)throw new Error("C does not have enough elements for the given dimensions and ldc.");_==="column-major"&&(e=e==="no-transpose"?"transpose":"no-transpose"),v==="column-major"&&(o=o==="no-transpose"?"transpose":"no-transpose"),E==="column-major"&&([n,u]=[u,n],[h,b]=[b,h],[l,f]=[f,l],[e,o]=[o==="no-transpose"?"transpose":"no-transpose",e==="no-transpose"?"transpose":"no-transpose"],[a,s]=[s,a],t=t==="lower"?"upper":"lower");let J=Math.ceil(s/64),Y=Math.ceil(a/64),X=J*Y>=36,nr=await G(r,X?"sgemmtr_large":"sgemmtr_small"),lr=h?n._buf:x(r,n,"sgemmtr-A",!1),pr=b?u._buf:x(r,u,"sgemmtr-B",!1),tr=y?c._buf:x(r,c,"sgemmtr-C",!0),ur=I(r,[{value:a,type:"u32"},{value:s,type:"u32"},{value:i,type:"u32"},{value:m,type:"f32"},{value:p,type:"f32"},{value:l,type:"u32"},{value:f,type:"u32"},{value:w,type:"u32"},{value:e==="transpose"?1:0,type:"u32"},{value:o==="transpose"?1:0,type:"u32"},{value:t==="upper"?1:0,type:"u32"}],"sgemmtr-params");try{let $=A(r,nr.getBindGroupLayout(0),[lr,pr,tr,ur]),Q=X?{x:q(r,J,"sgemmtr","x"),y:q(r,Y,"sgemmtr","y")}:{x:q(r,Math.ceil(s/32),"sgemmtr","x"),y:q(r,Math.ceil(a/32),"sgemmtr","y")},{commandEncoder:H,ts:Z}=j(r,nr,$,Q),rr=y?null:k(r,H,tr);P(r,H);let mr=await M(Z);if(y)return mr!==void 0?{gpuTimeMs:mr}:{};let dr=await S(rr,Float32Array);return mr!==void 0?{C:dr,gpuTimeMs:mr}:{C:dr}}finally{h||d(lr),b||d(pr),y||d(tr),d(ur)}}async function Wo(r,t,e,o,a,s,i,m,n,l,u,f="row-major"){let p=i instanceof O,c=l instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssyrk",{A:i,C:l}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(f!=="row-major"&&f!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof n!="number")throw new Error("beta must be a number.");if(Number.isNaN(n))throw new Error("beta must not be NaN.");if(!Number.isFinite(n))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(a)||!Number.isInteger(m)||!Number.isInteger(u))throw new Error("n, k, lda, and ldc must be integers.");if(!p&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!c&&!(l instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if(p&&!c)throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");if(c&&!p)throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");if(o<0||a<0)throw new Error("n and k must be non-negative.");if(m<=0||u<=0)throw new Error("lda and ldc must be positive.");if(o===0)return c?{}:{C:l};let w=p?i.layout:f,g=c?l.layout:f,h=w==="column-major"?a:o,b=w==="column-major"?o:a,y=e==="no-transpose"?h:b,_=e==="no-transpose"?b:h;if(m<_)throw new Error(`lda must be >= ${w==="column-major"?"rows":"cols"} of A as stored.`);if(p){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[F,J]=e==="no-transpose"?[o,a]:[a,o];if(i.rows<F||i.cols<J)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(y-1)*m+_)throw new Error("A does not have enough elements for the given dimensions and lda.");if(u<o)throw new Error("ldc must be >= n.");if(c){if(u!==l.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(l.rows<o||l.cols<o)throw new Error("C is too small for the given n.")}else if(l.length<(o-1)*u+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let v=e;w==="column-major"&&(v=v==="no-transpose"?"transpose":"no-transpose");let E=v==="no-transpose"?"transpose":"no-transpose",N=t;g==="column-major"&&([v,E]=[E==="no-transpose"?"transpose":"no-transpose",v==="no-transpose"?"transpose":"no-transpose"],N=N==="lower"?"upper":"lower");let B=Math.ceil(o/64),L=Math.ceil(o/64),T=B*L>=36,C=await G(r,T?"sgemmtr_large":"sgemmtr_small"),W=p?i._buf:x(r,i,"ssyrk-A",!1),U=c?l._buf:x(r,l,"ssyrk-C",!0),V=p?er(r,W.size,"ssyrk-B",GPUBufferUsage.COPY_DST):x(r,i,"ssyrk-B",!1),z=I(r,[{value:o,type:"u32"},{value:o,type:"u32"},{value:a,type:"u32"},{value:s,type:"f32"},{value:n,type:"f32"},{value:m,type:"u32"},{value:m,type:"u32"},{value:u,type:"u32"},{value:v==="transpose"?1:0,type:"u32"},{value:E==="transpose"?1:0,type:"u32"},{value:N==="upper"?1:0,type:"u32"}],"ssyrk-params");try{let F=A(r,C.getBindGroupLayout(0),[W,V,U,z]),J=T?{x:q(r,B,"ssyrk","x"),y:q(r,L,"ssyrk","y")}:{x:q(r,Math.ceil(o/32),"ssyrk","x"),y:q(r,Math.ceil(o/32),"ssyrk","y")},{commandEncoder:Y,querySet:X,passDescriptor:nr}=Rr(r);p&&Y.copyBufferToBuffer(W,0,V,0,W.size),fr(Y,C,F,J,nr);let lr=Dr(r,Y,X),pr=c?null:k(r,Y,U);P(r,Y);let tr=await M(lr);if(c)return tr!==void 0?{gpuTimeMs:tr}:{};let ur=await S(pr,Float32Array);return tr!==void 0?{C:ur,gpuTimeMs:tr}:{C:ur}}finally{p||d(W),d(V),c||d(U),d(z)}}async function Fo(r,t,e,o,a,s,i,m,n,l,u,f,p,c="row-major"){let w=i instanceof O,g=n instanceof O,h=f instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssyr2k",{A:i,B:n,C:f}),t!=="lower"&&t!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(e!=="no-transpose"&&e!=="transpose")throw new Error("trans must be 'no-transpose' or 'transpose'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(a)||!Number.isInteger(m)||!Number.isInteger(l)||!Number.isInteger(p))throw new Error("n, k, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||a<0)throw new Error("n and k must be non-negative.");if(m<=0||l<=0||p<=0)throw new Error("lda, ldb, and ldc must be positive.");if(o===0)return h?{}:{C:f};let b=w?i.layout:c,y=g?n.layout:c,_=h?f.layout:c,v=b==="column-major"?a:o,E=b==="column-major"?o:a,N=e==="no-transpose"?v:E,B=e==="no-transpose"?E:v;if(m<B)throw new Error(`lda must be >= ${b==="column-major"?"rows":"cols"} of A as stored.`);if(w){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");let[Z,rr]=e==="no-transpose"?[o,a]:[a,o];if(i.rows<Z||i.cols<rr)throw new Error("A is too small for the given n, k, and trans.")}else if(i.length<(N-1)*m+B)throw new Error("A does not have enough elements for the given dimensions and lda.");let L=y==="column-major"?a:o,T=y==="column-major"?o:a,C=e==="no-transpose"?L:T,W=e==="no-transpose"?T:L;if(l<W)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(l!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");let[Z,rr]=e==="no-transpose"?[o,a]:[a,o];if(n.rows<Z||n.cols<rr)throw new Error("B is too small for the given n, k, and trans.")}else if(n.length<(C-1)*l+W)throw new Error("B does not have enough elements for the given dimensions and ldb.");if(p<o)throw new Error("ldc must be >= n.");if(h){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<o)throw new Error("C is too small for the given n.")}else if(f.length<(o-1)*p+o)throw new Error("C does not have enough elements for the given dimensions and ldc.");let U=e;b==="column-major"&&(U=U==="no-transpose"?"transpose":"no-transpose");let V=e;y==="column-major"&&(V=V==="no-transpose"?"transpose":"no-transpose");let z=_==="column-major"?t==="lower"?"upper":"lower":t,F=Z=>Z==="no-transpose"?"transpose":"no-transpose";function J(Z,rr,mr,dr,sr,or){let wr=Z,Cr=F(dr);return _!=="column-major"?{transX:wr,X:rr,ldX:mr,transY:Cr,Y:sr,ldY:or}:{transX:F(Cr),X:sr,ldX:or,transY:F(wr),Y:rr,ldY:mr}}let Y=Math.ceil(o/64),X=Math.ceil(o/64),nr=Y*X>=36,lr=await G(r,nr?"sgemmtr_large":"sgemmtr_small"),pr=nr?{x:q(r,Y,"ssyr2k","x"),y:q(r,X,"ssyr2k","y")}:{x:q(r,Math.ceil(o/32),"ssyr2k","x"),y:q(r,Math.ceil(o/32),"ssyr2k","y")},tr=w?i._buf:x(r,i,"ssyr2k-A",!1),ur=g?n._buf:x(r,n,"ssyr2k-B",!1),$=h?f._buf:x(r,f,"ssyr2k-C",!0),Q=null,H=null;try{let Z=J(U,tr,m,V,ur,l),rr=J(V,ur,l,U,tr,m),mr=(Mr,yr)=>I(r,[{value:o,type:"u32"},{value:o,type:"u32"},{value:a,type:"u32"},{value:s,type:"f32"},{value:yr,type:"f32"},{value:Mr.ldX,type:"u32"},{value:Mr.ldY,type:"u32"},{value:p,type:"u32"},{value:Mr.transX==="transpose"?1:0,type:"u32"},{value:Mr.transY==="transpose"?1:0,type:"u32"},{value:z==="upper"?1:0,type:"u32"}],"ssyr2k-params");Q=mr(Z,u),H=mr(rr,1);let dr=A(r,lr.getBindGroupLayout(0),[Z.X,Z.Y,$,Q]),sr=A(r,lr.getBindGroupLayout(0),[rr.X,rr.Y,$,H]),{commandEncoder:or,querySet:wr}=Rr(r),Cr=wr?{timestampWrites:{querySet:wr,beginningOfPassWriteIndex:0}}:void 0,Ir=wr?{timestampWrites:{querySet:wr,endOfPassWriteIndex:1}}:void 0;fr(or,lr,dr,pr,Cr),fr(or,lr,sr,pr,Ir);let Tr=Dr(r,or,wr),Ar=h?null:k(r,or,$);P(r,or);let br=await M(Tr);if(h)return br!==void 0?{gpuTimeMs:br}:{};let gr=await S(Ar,Float32Array);return br!==void 0?{C:gr,gpuTimeMs:br}:{C:gr}}finally{w||d(tr),g||d(ur),h||d($),Q&&d(Q),H&&d(H)}}async function qo(r,t,e,o,a,s,i,m,n,l,u,f,p,c="row-major"){let w=i instanceof O,g=n instanceof O,h=f instanceof O;if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"ssymm",{A:i,B:n,C:f}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(c!=="row-major"&&c!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof s!="number")throw new Error("alpha must be a number.");if(Number.isNaN(s))throw new Error("alpha must not be NaN.");if(!Number.isFinite(s))throw new Error("alpha must be finite.");if(typeof u!="number")throw new Error("beta must be a number.");if(Number.isNaN(u))throw new Error("beta must not be NaN.");if(!Number.isFinite(u))throw new Error("beta must be finite.");if(!Number.isInteger(o)||!Number.isInteger(a)||!Number.isInteger(m)||!Number.isInteger(l)||!Number.isInteger(p))throw new Error("m, n, lda, ldb, and ldc must be integers.");if(!w&&!(i instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!g&&!(n instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(!h&&!(f instanceof Float32Array))throw new Error("C must be a Float32Array or GpuMatrix.");if((w||g)&&!h)throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");if(h&&(!w||!g))throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");if(o<0||a<0)throw new Error("m and n must be non-negative.");if(o===0||a===0)return h?{}:{C:f};let b=w?i.layout:c,y=g?n.layout:c,_=h?f.layout:c,v=t==="left"?o:a;if(m<v)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(w){if(m!==i.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(i.rows<v||i.cols<v)throw new Error("A is too small for the given m/n and side.")}else if(i.length<(v-1)*m+v)throw new Error("A does not have enough elements for the given dimensions and lda.");let E=y==="column-major"?a:o,N=y==="column-major"?o:a;if(l<N)throw new Error(`ldb must be >= ${y==="column-major"?"rows":"cols"} of B as stored.`);if(g){if(l!==n.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(n.rows<o||n.cols<a)throw new Error("B is too small for the given m and n.")}else if(n.length<(E-1)*l+N)throw new Error("B does not have enough elements for the given dimensions and ldb.");let B=_==="column-major"?a:o,L=_==="column-major"?o:a;if(p<L)throw new Error(`ldc must be >= ${_==="column-major"?"rows":"cols"} of C as stored.`);if(h){if(p!==f.lda)throw new Error("ldc must match C.lda when C is a GpuMatrix.");if(f.rows<o||f.cols<a)throw new Error("C is too small for the given m and n.")}else if(f.length<(B-1)*p+L)throw new Error("C does not have enough elements for the given dimensions and ldc.");let T=b==="column-major"?e==="lower"?"upper":"lower":e,C=y==="column-major"?"transpose":"no-transpose",W="no-transpose",U=o,V=a,z=v,F=t==="left"?W:C,J=t==="left"?C:W,Y=or=>or==="no-transpose"?"transpose":"no-transpose",X=t==="right";_==="column-major"&&([F,J]=[Y(J),Y(F)],X=!X,[U,V]=[V,U]);let nr=v,lr=Math.ceil(V/64),pr=Math.ceil(U/64),tr=lr*pr>=36,ur=await G(r,tr?"sgemm_large":"sgemm_small"),$=await G(r,"symmetrize"),Q=tr?{x:q(r,lr,"ssymm","x"),y:q(r,pr,"ssymm","y")}:{x:q(r,Math.ceil(V/32),"ssymm","x"),y:q(r,Math.ceil(U/32),"ssymm","y")},H=w?i._buf:x(r,i,"ssymm-A",!1),Z=g?n._buf:x(r,n,"ssymm-B",!1),rr=h?f._buf:x(r,f,"ssymm-C",!0),mr=er(r,v*nr*4,"ssymm-Adense"),dr=null,sr=null;try{dr=I(r,[{value:v,type:"u32"},{value:m,type:"u32"},{value:nr,type:"u32"},{value:T==="upper"?1:0,type:"u32"}],"ssymm-sym-params");let or=A(r,$.getBindGroupLayout(0),[H,mr,dr]),wr=X?Z:mr,Cr=X?l:nr,Ir=X?mr:Z;sr=I(r,[{value:U,type:"u32"},{value:V,type:"u32"},{value:z,type:"u32"},{value:s,type:"f32"},{value:u,type:"f32"},{value:Cr,type:"u32"},{value:X?nr:l,type:"u32"},{value:p,type:"u32"},{value:F==="transpose"?1:0,type:"u32"},{value:J==="transpose"?1:0,type:"u32"}],"ssymm-gemm-params");let Ar=A(r,ur.getBindGroupLayout(0),[wr,vr(r,wr),Ir,vr(r,Ir),rr,sr]),{commandEncoder:br,querySet:gr}=Rr(r),Mr=gr?{timestampWrites:{querySet:gr,beginningOfPassWriteIndex:0}}:void 0,yr=gr?{timestampWrites:{querySet:gr,endOfPassWriteIndex:1}}:void 0;fr(br,$,or,{x:Math.ceil(v/8),y:Math.ceil(v/8)},Mr),fr(br,ur,Ar,Q,yr);let jr=Dr(r,br,gr),Ur=h?null:k(r,br,rr);P(r,br);let Kr=await M(jr);if(h)return Kr!==void 0?{gpuTimeMs:Kr}:{};let ne=await S(Ur,Float32Array);return Kr!==void 0?{C:ne,gpuTimeMs:Kr}:{C:ne}}finally{w||d(H),g||d(Z),h||d(rr),d(mr),dr&&d(dr),sr&&d(sr)}}async function Uo(r,t,e,o,a,s,i,m,n,l,u,f,p="row-major"){let c=n instanceof O,w=u instanceof O,g=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"strmm",{A:n,B:u}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:u};let h=c?n.layout:p,b=w?u.layout:p,y=t==="left"?s:i;if(l<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<y||n.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(y-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,v=b==="column-major"?s:i;if(f<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(u.rows<s||u.cols<i)throw new Error("B is too small for the given m and n.")}else if(u.length<(_-1)*f+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let E=h==="column-major"?e==="lower"?"upper":"lower":e,N=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,B=b==="column-major"?"transpose":"no-transpose",L="no-transpose",T=s,C=i,W=y,U=t==="left"?L:B,V=t==="left"?B:L,z=dr=>dr==="no-transpose"?"transpose":"no-transpose",F=t==="right";b==="column-major"&&([U,V]=[z(V),z(U)],F=!F,[T,C]=[C,T]);let J=y,Y=Math.ceil(C/64),X=Math.ceil(T/64),nr=Y*X>=36,lr=await G(r,nr?"sgemm_large":"sgemm_small"),pr=await G(r,"triangularize"),tr=nr?{x:q(r,Y,"strmm","x"),y:q(r,X,"strmm","y")}:{x:q(r,Math.ceil(C/32),"strmm","x"),y:q(r,Math.ceil(T/32),"strmm","y")},ur=null,$=null,Q=null,H=null,Z=null,rr=null,mr=!1;try{ur=c?n._buf:x(r,n,"strmm-A",!1),$=w?u._buf:x(r,u,"strmm-B",!0),Q=er(r,y*J*4,"strmm-Adense"),H=er(r,_*f*4,"strmm-out",GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST),Z=I(r,[{value:y,type:"u32"},{value:l,type:"u32"},{value:J,type:"u32"},{value:E==="upper"?1:0,type:"u32"},{value:N==="transpose"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strmm-tri-params");let dr=A(r,pr.getBindGroupLayout(0),[ur,Q,Z]),sr=F?$:Q,or=F?f:J,wr=F?Q:$;rr=I(r,[{value:T,type:"u32"},{value:C,type:"u32"},{value:W,type:"u32"},{value:m,type:"f32"},{value:0,type:"f32"},{value:or,type:"u32"},{value:F?J:f,type:"u32"},{value:f,type:"u32"},{value:U==="transpose"?1:0,type:"u32"},{value:V==="transpose"?1:0,type:"u32"}],"strmm-gemm-params");let Ir=A(r,lr.getBindGroupLayout(0),[sr,vr(r,sr),wr,vr(r,wr),H,rr]),{commandEncoder:Tr,querySet:Ar}=Rr(r);Tr.copyBufferToBuffer($,0,H,0,Math.min($.size,H.size));let br=Ar?{timestampWrites:{querySet:Ar,beginningOfPassWriteIndex:0}}:void 0,gr=Ar?{timestampWrites:{querySet:Ar,endOfPassWriteIndex:1}}:void 0;fr(Tr,pr,dr,{x:Math.ceil(y/8),y:Math.ceil(y/8)},br),fr(Tr,lr,Ir,tr,gr);let Mr=Dr(r,Tr,Ar),yr=w?null:k(r,Tr,H);P(r,Tr);let jr=await M(Mr);if(w)return d(u._buf),u._buf=H,mr=!0,jr!==void 0?{gpuTimeMs:jr}:{};let Ur=await S(yr,Float32Array);return jr!==void 0?{B:Ur,gpuTimeMs:jr}:{B:Ur}}finally{!c&&ur&&d(ur),!w&&$&&d($),Q&&d(Q),H&&!mr&&d(H),Z&&d(Z),rr&&d(rr)}}async function Oo(r,t,e,o,a,s,i,m,n,l,u,f,p="row-major"){let c=n instanceof O,w=u instanceof O,g=a==="unit";if(!(r instanceof GPUDevice))throw new Error("device must be a GPUDevice.");if(R(r,"strsm",{A:n,B:u}),t!=="left"&&t!=="right")throw new Error("side must be 'left' or 'right'.");if(e!=="lower"&&e!=="upper")throw new Error("uplo must be 'lower' or 'upper'.");if(o!=="no-transpose"&&o!=="transpose")throw new Error("transA must be 'no-transpose' or 'transpose'.");if(!g&&a!=="non-unit")throw new Error("diag must be 'unit' or 'non-unit'.");if(p!=="row-major"&&p!=="column-major")throw new Error("layout must be 'row-major' or 'column-major'.");if(typeof m!="number")throw new Error("alpha must be a number.");if(Number.isNaN(m))throw new Error("alpha must not be NaN.");if(!Number.isFinite(m))throw new Error("alpha must be finite.");if(!Number.isInteger(s)||!Number.isInteger(i)||!Number.isInteger(l)||!Number.isInteger(f))throw new Error("m, n, lda, and ldb must be integers.");if(!c&&!(n instanceof Float32Array))throw new Error("A must be a Float32Array or GpuMatrix.");if(!w&&!(u instanceof Float32Array))throw new Error("B must be a Float32Array or GpuMatrix.");if(c!==w)throw new Error("A and B must both be GpuMatrix or both be Float32Array.");if(s<0||i<0)throw new Error("m and n must be non-negative.");if(s===0||i===0)return w?{}:{B:u};let h=c?n.layout:p,b=w?u.layout:p,y=t==="left"?s:i;if(l<y)throw new Error("lda must be >= "+(t==="left"?"m":"n")+".");if(c){if(l!==n.lda)throw new Error("lda must match A.lda when A is a GpuMatrix.");if(n.rows<y||n.cols<y)throw new Error("A is too small for the given m/n and side.")}else if(n.length<(y-1)*l+y)throw new Error("A does not have enough elements for the given dimensions and lda.");let _=b==="column-major"?i:s,v=b==="column-major"?s:i;if(f<v)throw new Error(`ldb must be >= ${b==="column-major"?"rows":"cols"} of B as stored.`);if(w){if(f!==u.lda)throw new Error("ldb must match B.lda when B is a GpuMatrix.");if(u.rows<s||u.cols<i)throw new Error("B is too small for the given m and n.")}else if(u.length<(_-1)*f+v)throw new Error("B does not have enough elements for the given dimensions and ldb.");let E=h==="column-major"?e==="lower"?"upper":"lower":e,N=h==="column-major"?o==="no-transpose"?"transpose":"no-transpose":o,B=t==="left"?i:s,L=t==="left",T=N==="no-transpose"==(E==="lower"),C=t==="left"?T:!T,W=[];for(let $=0;$<y;$+=64)W.push($);C||W.reverse();let U=W.length,V=await G(r,"strsv_invert_block"),z=await G(r,"block_transfer"),F=await G(r,"sscal"),J=null,Y=null,X=null,nr=[],lr=[];function pr($,Q){let H=er(r,$,Q);return lr.push(H),H}function tr($,Q){let H=I(r,$,Q);return nr.push(H),H}let ur=(_-1)*f+v;try{J=c?n._buf:x(r,n,"strsm-A",!1),Y=w?u._buf:x(r,u,"strsm-B",!0),X=er(r,U*64*64*4,"strsm-Ainv");let $=null;if(m!==1&&m!==0){let Ar=tr([{value:ur,type:"u32"},{value:m,type:"f32"},{value:1,type:"u32"}],"strsm-scale-params");$=A(r,F.getBindGroupLayout(0),[Y,Ar])}let Q=tr([{value:y,type:"u32"},{value:l,type:"u32"},{value:N==="transpose"?1:0,type:"u32"},{value:E==="upper"?1:0,type:"u32"},{value:g?1:0,type:"u32"}],"strsm-invert-params"),H=A(r,V.getBindGroupLayout(0),[J,X,Q]),Z=pr(64*B*4,"strsm-Bblock"),rr=pr(64*B*4,"strsm-Xblock"),mr=pr(y*64*4,"strsm-Aoff"),dr=pr(y*B*4,"strsm-delta"),{commandEncoder:sr,querySet:or}=Rr(r);if(m===0){let Ar=Math.ceil(v/64),br=Math.ceil(_/64),gr=Ar*br>=36,Mr=await G(r,gr?"sgemm_large":"sgemm_small"),yr=tr([{value:_,type:"u32"},{value:v,type:"u32"},{value:0,type:"u32"},{value:0,type:"f32"},{value:0,type:"f32"},{value:1,type:"u32"},{value:1,type:"u32"},{value:f,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-zero-params"),jr=A(r,Mr.getBindGroupLayout(0),[X,vr(r,X),X,vr(r,X),Y,yr]),Ur=gr?{x:q(r,Ar,"strsm","x"),y:q(r,br,"strsm","y")}:{x:q(r,Math.ceil(v/32),"strsm","x"),y:q(r,Math.ceil(_/32),"strsm","y")};fr(sr,Mr,jr,Ur,or?{timestampWrites:{querySet:or,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0)}else{$&&fr(sr,F,$,Br(r,ur)),fr(sr,V,H,{x:64,y:U},or?{timestampWrites:{querySet:or,beginningOfPassWriteIndex:0}}:void 0);for(let br=0;br<W.length;br++){let gr=W[br],Mr=Math.min(gr+64,y),yr=Mr-gr,jr=gr/64,Ur=br===W.length-1,Kr=tr([{value:gr,type:"u32"},{value:yr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:L?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-B-params"),ne=A(r,z.getBindGroupLayout(0),[Z,Y,Kr]);fr(sr,z,ne,Hr(r,"strsm",yr,B));{let Vr=yr,zr=B,he=yr,re=Math.ceil(zr/64),ee=Math.ceil(Vr/64),te=re*ee>=36,oe=await G(r,te?"sgemm_large":"sgemm_small"),ye=tr([{value:Vr,type:"u32"},{value:zr,type:"u32"},{value:he,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:64,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:t==="right"?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-apply-params"),le={buffer:X,offset:jr*64*64*4,size:4096*4},xe=A(r,oe.getBindGroupLayout(0),[le,vr(r,le),Z,vr(r,Z),rr,ye]),Qo=te?{x:q(r,re,"strsm","x"),y:q(r,ee,"strsm","y")}:{x:q(r,Math.ceil(zr/32),"strsm","x"),y:q(r,Math.ceil(Vr/32),"strsm","y")};fr(sr,oe,xe,Qo)}let ue=C?Mr:0,De=C?y:gr,Pe=ue<De,Ko=tr([{value:gr,type:"u32"},{value:yr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:L?1:0,type:"u32"},{value:0,type:"u32"}],"strsm-scatter-params"),Vo=A(r,z.getBindGroupLayout(0),[rr,Y,Ko]),zo=Ur&&!Pe&&or?{timestampWrites:{querySet:or,endOfPassWriteIndex:1}}:void 0;if(fr(sr,z,Vo,Hr(r,"strsm",yr,B),zo),!Pe)continue;let Jr=De-ue,Ho=tr([{value:ue,type:"u32"},{value:Jr,type:"u32"},{value:gr,type:"u32"},{value:yr,type:"u32"},{value:l,type:"u32"},{value:N==="transpose"?1:0,type:"u32"},{value:L?1:0,type:"u32"},{value:2,type:"u32"}],"strsm-gather-A-params"),Yo=A(r,z.getBindGroupLayout(0),[mr,J,Ho]);fr(sr,z,Yo,Hr(r,"strsm",Jr,yr));{let Vr=Jr,zr=B,he=yr,re=Math.ceil(zr/64),ee=Math.ceil(Vr/64),te=re*ee>=36,oe=await G(r,te?"sgemm_large":"sgemm_small"),ye=tr([{value:Vr,type:"u32"},{value:zr,type:"u32"},{value:he,type:"u32"},{value:1,type:"f32"},{value:0,type:"f32"},{value:yr,type:"u32"},{value:B,type:"u32"},{value:B,type:"u32"},{value:0,type:"u32"},{value:0,type:"u32"}],"strsm-update-params"),le=A(r,oe.getBindGroupLayout(0),[mr,vr(r,mr),rr,vr(r,rr),dr,ye]),xe=te?{x:q(r,re,"strsm","x"),y:q(r,ee,"strsm","y")}:{x:q(r,Math.ceil(zr/32),"strsm","x"),y:q(r,Math.ceil(Vr/32),"strsm","y")};fr(sr,oe,le,xe)}let Xo=tr([{value:ue,type:"u32"},{value:Jr,type:"u32"},{value:0,type:"u32"},{value:B,type:"u32"},{value:f,type:"u32"},{value:b==="column-major"?1:0,type:"u32"},{value:L?1:0,type:"u32"},{value:1,type:"u32"}],"strsm-scatter-sub-params"),$o=A(r,z.getBindGroupLayout(0),[dr,Y,Xo]),Zo=Ur&&or?{timestampWrites:{querySet:or,endOfPassWriteIndex:1}}:void 0;fr(sr,z,$o,Hr(r,"strsm",Jr,B),Zo)}}let wr=Dr(r,sr,or),Cr=w?null:k(r,sr,Y);P(r,sr);let Ir=await M(wr);if(w)return Ir!==void 0?{gpuTimeMs:Ir}:{};let Tr=await S(Cr,Float32Array);return Ir!==void 0?{B:Tr,gpuTimeMs:Ir}:{B:Tr}}finally{!c&&J&&d(J),!w&&Y&&d(Y),X&&d(X),d(lr),d(nr)}}return aa(Qa);})();
