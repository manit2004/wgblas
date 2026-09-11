var wgblas = (() => {
  var ia = Object.create;
  var pe = Object.defineProperty;
  var na = Object.getOwnPropertyDescriptor;
  var ua = Object.getOwnPropertyNames;
  var la = Object.getPrototypeOf,
    ma = Object.prototype.hasOwnProperty;
  var de = ((r) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
        ? new Proxy(r, {
            get: (t, e) => (typeof require < "u" ? require : t)[e],
          })
        : r)(function (r) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + r + '" is not supported');
  });
  var V = (r, t, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (t = r((r = 0))), t);
    } catch (o) {
      throw ((e = [o]), o);
    }
  };
  var Le = (r, t) => {
      for (var e in t) pe(r, e, { get: t[e], enumerable: !0 });
    },
    Te = (r, t, e, o) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let a of ua(t))
          !ma.call(r, a) &&
            a !== e &&
            pe(r, a, {
              get: () => t[a],
              enumerable: !(o = na(t, a)) || o.enumerable,
            });
      return r;
    };
  var we = (r, t, e) => (
      (e = r != null ? ia(la(r)) : {}),
      Te(
        t || !r || !r.__esModule
          ? pe(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    fa = (r) => Te(pe({}, "__esModule", { value: !0 }), r);
  var Se,
    Ye = V(() => {
      Se = `// sscal: x = alpha * x

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
`;
    });
  var $e,
    Xe = V(() => {
      $e = `// cscal: x := alpha * x, complex. x is one interleaved f32 array
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
`;
    });
  var Qe,
    Ze = V(() => {
      Qe = `// sswap: x <-> y

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
`;
    });
  var rt,
    Je = V(() => {
      rt = `// saxpy: y = alpha * x + y

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
`;
    });
  var tt,
    et = V(() => {
      tt = `// scopy: y = x

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
`;
    });
  var at,
    ot = V(() => {
      at = `// sdot: result = sum(x[i] * y[i])
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
`;
    });
  var ke,
    st = V(() => {
      ke = `// sum reduction: collapses 2*WGS partials into one scalar.
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
`;
    });
  var nt,
    it = V(() => {
      nt = `// sasum: result = sum(|x[i]|)
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
`;
    });
  var lt,
    ut = V(() => {
      lt = `// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
`;
    });
  var ft,
    mt = V(() => {
      ft = `// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
`;
    });
  var pt,
    ct = V(() => {
      pt = `// isamax: returns index of element with largest absolute value
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
`;
    });
  var wt,
    dt = V(() => {
      wt = `// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
`;
    });
  var re,
    gt = V(() => {
      re = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
`;
    });
  var Ne,
    bt = V(() => {
      Ne = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// |a| for a double-double pair. Negation is exact (no rounding), so this is
// just a sign flip on both components \u2014 hi alone determines the pair's sign.
fn ddAbs(a: DD) -> DD {
  if (a.hi < 0.0) {
    return DD(-a.hi, -a.lo);
  }
  return a;
}
`;
    });
  var ne,
    ht = V(() => {
      ne = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`;
    });
  var xt,
    yt = V(() => {
      xt = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
`;
    });
  var Me,
    vt = V(() => {
      Me = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
`;
    });
  var he,
    _t = V(() => {
      he = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
// ~48-bit floor anyway, so folding them in with plain f32 loses nothing.
//
// Another real compiler bug, distinct from add.wgsl's twoSum one \u2014 confirmed
// on Intel Mesa ANV: when p.lo feeds straight into \`crossAndLo\` unobserved,
// the compiler folds it away entirely. Materializing p.lo itself through
// workgroup memory + workgroupBarrier() (like twoSumProtected does for its
// sum) is what fixes it, so ddMulRaw now takes threadSlot and always pays
// that barrier \u2014 no longer a plain unprotected batchable helper.
fn ddMulRaw(a: DD, b: DD, threadSlot: u32) -> DD {
  let p = twoProdBit(a.hi, b.hi);
  dekkerScratch[threadSlot] = p.lo;
  workgroupBarrier();
  let pLo = dekkerScratch[threadSlot];
  let crossAndLo = pLo + (a.hi * b.lo + a.lo * b.hi);
  return DD(p.hi, crossAndLo);
}

fn ddMulProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let raw = ddMulRaw(a, b, threadSlot);
  return fastTwoSumProtected(raw.hi, raw.lo, threadSlot);
}
`;
    });
  var At,
    Bt = V(() => {
      At = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
`;
    });
  var Gt,
    Et = V(() => {
      Gt = `// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
// alpha and x are each an f32 (hi, lo) pair. See f64/utils/multiply.wgsl for
// ddMulProtected and why plain ddMulRaw isn't safe without a renormalizing
// barrier \u2014 that barrier needs a provably uniform loop trip count across
// every thread in the workgroup, so (like dasum.wgsl's reduction loop) this
// splits into a uniform main pass plus a ragged, select-masked tail rather
// than a plain \`id < params.n\` grid-stride loop.

@group(0) @binding(0) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(1) var<storage, read_write> xLo: array<f32>;
@group(0) @binding(2) var<uniform> params: Params;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  x_inc:   u32,
}

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn dscal_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let i = id * params.x_inc;
    let result = ddMulProtected(alpha, DD(xHi[i], xLo[i]), lid.x);
    xHi[i] = result.hi;
    xLo[i] = result.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) \u2014 pad to this workgroup's worst
  // case so every thread in the workgroup still calls ddMulProtected the
  // same number of times (its barrier needs that), masking only the write.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id = n_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let i = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let result = ddMulProtected(alpha, DD(xHi[i], xLo[i]), lid.x);
    if (valid) {
      xHi[i] = result.hi;
      xLo[i] = result.lo;
    }
  }
}
`;
    });
  var kt,
    St = V(() => {
      kt = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
// Each element costs one ddMulProtected (alpha*x[i]) then one ddAddProtected
// (+ y[i]) \u2014 the same two-protected-op shape ddot spends per term, applied
// straight to the output instead of folded into a reduction. See dscal.wgsl
// for why this is a uniform main pass plus a ragged, select-masked tail
// rather than a plain \`id < params.n\` grid-stride loop.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;
@group(0) @binding(4) var<uniform> params: Params;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  x_inc:   u32,
  y_inc:   u32,
}

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn daxpy_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    let prod = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let result = ddAddProtected(prod, DD(yHi[iy], yLo[iy]), lid.x);
    yHi[iy] = result.hi;
    yLo[iy] = result.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) \u2014 pad to this workgroup's worst
  // case so every thread still calls ddMulProtected/ddAddProtected the same
  // number of times (their barriers need that), masking only the write.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id = n_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let ix = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let iy = select(0u, id * params.y_inc, valid);
    let prod = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let result = ddAddProtected(prod, DD(yHi[iy], yLo[iy]), lid.x);
    if (valid) {
      yHi[iy] = result.hi;
      yLo[iy] = result.lo;
    }
  }
}
`;
    });
  var Mt,
    Nt = V(() => {
      Mt = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
`;
    });
  var It,
    Dt = V(() => {
      It = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var Pt,
    Rt = V(() => {
      Pt = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
`;
    });
  var Tt,
    Lt = V(() => {
      Tt = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
`;
    });
  var jt,
    Ct = V(() => {
      jt = `// srot: x = c*x + s*y,  y = -s*x + c*y

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
`;
    });
  var Wt,
    Ft = V(() => {
      Wt = `// srotm: applies modified Givens rotation H to vectors x and y.
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
`;
    });
  var Ot,
    qt = V(() => {
      Ot = `// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
`;
    });
  var Vt,
    Kt = V(() => {
      Vt = `// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
`;
    });
  var Ut,
    Ht = V(() => {
      Ut = `// ssymv: y = alpha * A * x + beta * y
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
`;
    });
  var Yt,
    zt = V(() => {
      Yt = `// strmv: y = op(A) * x
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
`;
    });
  var De,
    Xt = V(() => {
      De = `// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
`;
    });
  var Zt,
    $t = V(() => {
      Zt = `// strsv_apply_inverse: given a precomputed block inverse (from
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
`;
    });
  var Jt,
    Qt = V(() => {
      Jt = `// strsv_update: subtracts a solved block's contribution from every
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
`;
    });
  var eo,
    ro = V(() => {
      eo = `// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
`;
    });
  var oo,
    to = V(() => {
      oo = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
`;
    });
  var so,
    ao = V(() => {
      so = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
`;
    });
  var ue,
    io = V(() => {
      ue = `// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
`;
    });
  var le,
    no = V(() => {
      le = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
`;
    });
  var ye,
    uo = V(() => {
      ye = `// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
`;
    });
  var xe,
    lo = V(() => {
      xe = `// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
`;
    });
  var fo,
    mo = V(() => {
      fo = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
`;
    });
  var po,
    co = V(() => {
      po = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
`;
    });
  var go,
    wo = V(() => {
      go = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
`;
    });
  var bo = {};
  Le(bo, { routineShaders: () => or, shaderSources: () => os });
  var or,
    os,
    ho = V(() => {
      Ye();
      Xe();
      Ze();
      Je();
      et();
      ot();
      st();
      it();
      ut();
      mt();
      ct();
      dt();
      gt();
      bt();
      ht();
      yt();
      vt();
      _t();
      Bt();
      Et();
      St();
      Nt();
      Dt();
      Rt();
      Lt();
      Ct();
      Ft();
      qt();
      Kt();
      Ht();
      zt();
      Xt();
      $t();
      Qt();
      ro();
      to();
      ao();
      io();
      no();
      uo();
      lo();
      mo();
      co();
      wo();
      or = {};
      or.sscal = { sscal: Se };
      or.cscal = { cscal: $e };
      or.sswap = { sswap: Qe };
      or.saxpy = { saxpy: rt };
      or.scopy = { scopy: tt };
      or.sdot = { sdot: at, "reduction/sum": ke };
      or.sasum = { sasum: nt, "reduction/sum": ke };
      or.snrm2 = { snrm2: lt, "reduction/scaledSum": ft };
      or.isamax = { isamax: pt, "reduction/argmax": wt };
      or.dasum = {
        "f64/dekker": re,
        "f64/utils/abs": Ne,
        "f64/utils/add": ne,
        dasum: xt,
        "reduction/sumF64": Me,
      };
      or.ddot = {
        "f64/dekker": re,
        "f64/utils/add": ne,
        "f64/utils/multiply": he,
        ddot: At,
        "reduction/sumF64": Me,
      };
      or.dscal = {
        "f64/dekker": re,
        "f64/utils/add": ne,
        "f64/utils/multiply": he,
        dscal: Gt,
      };
      or.daxpy = {
        "f64/dekker": re,
        "f64/utils/add": ne,
        "f64/utils/multiply": he,
        daxpy: kt,
      };
      or.idamax = {
        "f64/dekker": re,
        "f64/utils/abs": Ne,
        "f64/utils/greater": Mt,
        "f64/utils/equal": It,
        idamax: Pt,
        "reduction/argmaxF64": Tt,
      };
      or.srot = { srot: jt };
      or.srotm = { srotm: Wt };
      or.sgemv = { sgemv_n: Ot, sgemv_t: Vt };
      or.ssymv = { ssymv: Ut };
      or.strmv = { strmv: Yt };
      or.strsv = {
        strsv_invert_block: De,
        strsv_apply_inverse: Zt,
        strsv_update: Jt,
      };
      or.sger = { sger: eo };
      or.ssyr = { ssyr: oo };
      or.ssyr2 = { ssyr2: so };
      or.sgemm = { sgemm_small: ue, sgemm_large: le };
      or.sgemmtr = { sgemmtr_small: ye, sgemmtr_large: xe };
      or.ssyrk = { sgemmtr_small: ye, sgemmtr_large: xe };
      or.ssyr2k = { sgemmtr_small: ye, sgemmtr_large: xe };
      or.ssymm = { sgemm_small: ue, sgemm_large: le, symmetrize: fo };
      or.strmm = { sgemm_small: ue, sgemm_large: le, triangularize: po };
      or.strsm = {
        strsv_invert_block: De,
        block_transfer: go,
        sscal: Se,
        sgemm_small: ue,
        sgemm_large: le,
      };
      os = Object.assign({}, ...Object.values(or));
    });
  var ns = {};
  Le(ns, {
    Complex32: () => qr,
    Complex32Array: () => xr,
    Complex64: () => Wr,
    Complex64Array: () => Er,
    GpuMatrix: () => H,
    GpuVector: () => M,
    cleanup: () => Oe,
    cscal: () => xo,
    dasum: () => ko,
    daxpy: () => Ao,
    ddot: () => No,
    dscal: () => vo,
    gpuName: () => Ke,
    idamax: () => Io,
    init: () => qe,
    isamax: () => Do,
    randomFloat32Array: () => He,
    randomFloat64Array: () => Ue,
    randomTriangularFloat32Array: () => ze,
    sasum: () => So,
    saxpy: () => Bo,
    scopy: () => Eo,
    sdot: () => Go,
    sgemm: () => Vo,
    sgemmtr: () => Ho,
    sgemv: () => Lo,
    sger: () => qo,
    snrm2: () => Mo,
    srot: () => Ro,
    srotm: () => Po,
    sscal: () => yo,
    sswap: () => _o,
    ssymm: () => Yo,
    ssymv: () => To,
    ssyr: () => Oo,
    ssyr2: () => Ko,
    ssyr2k: () => zo,
    ssyrk: () => Uo,
    strmm: () => Xo,
    strmv: () => Co,
    strsm: () => $o,
    strsv: () => Wo,
  });
  function Ce(r, t) {
    return t
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function je(r) {
    if (!Fe(r)) return { querySet: null, passDescriptor: void 0 };
    let t = r.createQuerySet({ type: "timestamp", count: 2 });
    return {
      querySet: t,
      passDescriptor: {
        timestampWrites: {
          querySet: t,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      },
    };
  }
  function Pr(r, t, e) {
    if (!e) return null;
    let o = r.createBuffer({
      label: "timestamp-resolve",
      size: 16,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    t.resolveQuerySet(e, 0, 2, o, 0);
    let a = r.createBuffer({
      label: "timestamp-readback",
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (
      t.copyBufferToBuffer(o, 0, a, 0, 16),
      { tsReadBuffer: a, resolveBuffer: o, querySet: e }
    );
  }
  async function D(r) {
    if (!r) return;
    let { tsReadBuffer: t, resolveBuffer: e, querySet: o } = r;
    await t.mapAsync(GPUMapMode.READ);
    let a = new BigInt64Array(t.getMappedRange().slice());
    return (
      t.unmap(),
      t.destroy(),
      e.destroy(),
      o.destroy(),
      Math.max(0, Number(a[1] - a[0])) / 1e6
    );
  }
  var Xr = null,
    Ae = !1,
    $r = new Map(),
    ie = new WeakMap(),
    Vr = null,
    We = ({ powerPreference: r, benchmark: t }) => `${r}::${t}`;
  async function qe({
    powerPreference: r = "high-performance",
    benchmark: t = !1,
    dumpShaders: e = !1,
  } = {}) {
    let o = { powerPreference: r, benchmark: t, dumpShaders: e },
      a = We(o),
      s = $r.get(a);
    if (s) return s;
    if (Xr)
      e !== Ae &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Ae}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: f, globals: d } = await import("webgpu");
      (Object.assign(globalThis, d),
        (Xr = f(
          e
            ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
            : [],
        )),
        (Ae = e));
    } else
      (e &&
        console.warn(
          "dumpShaders has no effect in the browser \u2014 see init()'s docs.",
        ),
        (Xr = navigator.gpu));
    if (!Xr) throw new Error("WebGPU not supported in this environment.");
    let i =
      (await Xr.requestAdapter({ powerPreference: r })) ??
      (await Xr.requestAdapter());
    if (!i) throw new Error("No WebGPU adapter found.");
    let n = [...(Ce(i, t).requiredFeatures ?? [])],
      l = await i.requestDevice({ requiredFeatures: n });
    l.addEventListener("uncapturederror", (f) => {
      console.error("Uncaptured GPU error:", f.error.message);
    });
    let u = n.includes("timestamp-query");
    return (
      ie.set(l, { adapter: i, benchmark: u, options: o }),
      $r.set(a, l),
      Vr || (Vr = l),
      l
    );
  }
  function Oe(r) {
    if (r === void 0) {
      for (let e of $r.values()) e.destroy();
      ($r.clear(), (Vr = null));
      return;
    }
    let t = ie.get(r);
    t &&
      ($r.delete(We(t.options)),
      ie.delete(r),
      r.destroy(),
      Vr === r && (Vr = $r.values().next().value ?? null));
  }
  function Ke(r = Vr) {
    let t = r && ie.get(r);
    if (!t)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: o } = t.adapter.info;
    return { description: o || "unknown", device: e || "unknown" };
  }
  function Fe(r = Vr) {
    return ie.get(r)?.benchmark ?? !1;
  }
  function Zr() {
    if (!Vr)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return Vr;
  }
  function p(...r) {
    r.flat().forEach((t) => t.destroy());
  }
  function Ee(r, t, e) {
    let o = r.limits.maxStorageBufferBindingSize;
    if (t > o)
      throw new Error(
        `Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${o} bytes). The operands are too large for this device.`,
      );
  }
  function x(r, t, e = "blas-input", o = !1) {
    let a = t.byteLength;
    Ee(r, a, e);
    let s = o
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE,
      i = r.createBuffer({ label: e, size: a, usage: s, mappedAtCreation: !0 }),
      m = t.constructor;
    return (new m(i.getMappedRange()).set(t), i.unmap(), i);
  }
  function tr(r, t, e = "blas-storage", o = 0) {
    return (
      Ee(r, t, e),
      r.createBuffer({ label: e, size: t, usage: GPUBufferUsage.STORAGE | o })
    );
  }
  function Br(r, t, e = "blas-result") {
    return (
      Ee(r, t, e),
      r.createBuffer({
        label: e,
        size: t,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  function k(r, t, e) {
    let o = r.createBuffer({
      label: "blas-readback",
      size: e.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (t.copyBufferToBuffer(e, 0, o, 0, e.size), o);
  }
  var Qr = 16,
    Ve = new WeakMap();
  function ca(r) {
    let t = Ve.get(r);
    return (
      t ||
        ((t = r.createBuffer({
          label: "blas-vec4-fallback",
          size: Qr,
          usage: GPUBufferUsage.STORAGE,
        })),
        Ve.set(r, t)),
      t
    );
  }
  function Ar(r, t) {
    let e = t instanceof GPUBuffer ? t : t.buffer,
      o = t instanceof GPUBuffer ? 0 : (t.offset ?? 0),
      a = t instanceof GPUBuffer ? t.size : (t.size ?? e.size - o),
      s = Math.floor(a / Qr) * Qr;
    return s < Qr
      ? { buffer: ca(r), offset: 0, size: Qr }
      : { buffer: e, offset: o, size: s };
  }
  function Ge(r, t, e, o) {
    if (t % 4 !== 0) return !1;
    let a = r instanceof GPUBuffer ? r : r.buffer,
      s = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      i = r instanceof GPUBuffer ? a.size : (r.size ?? a.size - s),
      m = Math.floor(i / Qr) * 4;
    if (m <= 0) return !1;
    let n = (Math.max(e, 1) - 1) * t + (Math.max(o, 1) - 1);
    return Math.floor(n / 4) * 4 + 4 <= m;
  }
  function R(r, t, e = "blas-params") {
    let o = t.length * 4,
      a = Math.ceil(o / 16) * 16,
      s = new ArrayBuffer(a),
      i = new DataView(s);
    t.forEach(({ value: n, type: l }, u) => {
      let f = u * 4;
      if (l === "u32") i.setUint32(f, n, !0);
      else if (l === "i32") i.setInt32(f, n, !0);
      else if (l === "f32") i.setFloat32(f, n, !0);
      else
        throw new Error(
          `Unknown param type "${l}". Use "f32", "u32", or "i32".`,
        );
    });
    let m = r.createBuffer({
      label: e,
      size: a,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(m, 0, s), m);
  }
  async function G(r, t = Float32Array) {
    try {
      await r.mapAsync(GPUMapMode.READ);
      let e = new t(r.getMappedRange().slice());
      return (r.unmap(), e);
    } finally {
      r.destroy();
    }
  }
  function hr(r) {
    let t = r.length,
      e = new Float32Array(t),
      o = new Float32Array(t);
    for (let a = 0; a < t; a++) {
      let s = Math.fround(r[a]);
      ((e[a] = s), (o[a] = Math.fround(r[a] - s)));
    }
    return { hi: e, lo: o };
  }
  function Sr(r, t) {
    let e = r.length,
      o = new Float64Array(e);
    for (let a = 0; a < e; a++) o[a] = r[a] + t[a];
    return o;
  }
  var Wr = class {
      constructor(t, e) {
        ((this.re = t), (this.im = e));
      }
    },
    Er = class extends Array {
      constructor(t) {
        if (t === void 0) {
          super();
          return;
        }
        if (typeof t == "number") {
          super(t);
          for (let o = 0; o < t; o++) this[o] = new Wr(0, 0);
          return;
        }
        let e = Array.from(t);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof Wr) {
            for (let o of e) {
              if (!(o instanceof Wr))
                throw new Error(
                  "Complex64Array expects every element to be a Complex64.",
                );
              this.push(o);
            }
            return;
          }
          if (e.length % 2 !== 0)
            throw new Error(
              "Complex64Array expects an even number of interleaved [re, im, ...] values.",
            );
          for (let o = 0; o < e.length; o += 2) {
            if (typeof e[o] != "number" || typeof e[o + 1] != "number")
              throw new Error(
                "Complex64Array expects interleaved [re, im, ...] values to be numbers.",
              );
            this.push(new Wr(e[o], e[o + 1]));
          }
        }
      }
    };
  function Jr(r, t = r.length) {
    let e = new Float32Array(t * 2);
    for (let o = 0; o < t; o++)
      ((e[o * 2] = r[o].re), (e[o * 2 + 1] = r[o].im));
    return e;
  }
  function ge(r, t = r.length) {
    let e = new Float64Array(t),
      o = new Float64Array(t);
    for (let u = 0; u < t; u++) ((e[u] = r[u].re), (o[u] = r[u].im));
    let { hi: a, lo: s } = hr(e),
      { hi: i, lo: m } = hr(o),
      n = new Float32Array(t * 2),
      l = new Float32Array(t * 2);
    for (let u = 0; u < t; u++)
      ((n[u * 2] = a[u]),
        (n[u * 2 + 1] = i[u]),
        (l[u * 2] = s[u]),
        (l[u * 2 + 1] = m[u]));
    return { hi: n, lo: l };
  }
  function be(r, t) {
    let e = r.length / 2,
      o = new Float32Array(e),
      a = new Float32Array(e),
      s = new Float32Array(e),
      i = new Float32Array(e);
    for (let u = 0; u < e; u++)
      ((o[u] = r[u * 2]),
        (s[u] = r[u * 2 + 1]),
        (a[u] = t[u * 2]),
        (i[u] = t[u * 2 + 1]));
    let m = Sr(o, a),
      n = Sr(s, i),
      l = new Er(e);
    for (let u = 0; u < e; u++) l[u] = new Wr(m[u], n[u]);
    return l;
  }
  var qr = class {
      constructor(t, e) {
        ((this.re = Math.fround(t)), (this.im = Math.fround(e)));
      }
    },
    xr = class extends Array {
      constructor(t) {
        if (t === void 0) {
          super();
          return;
        }
        if (typeof t == "number") {
          super(t);
          for (let o = 0; o < t; o++) this[o] = new qr(0, 0);
          return;
        }
        let e = Array.from(t);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof qr) {
            for (let o of e) {
              if (!(o instanceof qr))
                throw new Error(
                  "Complex32Array expects every element to be a Complex32.",
                );
              this.push(o);
            }
            return;
          }
          if (e.length % 2 !== 0)
            throw new Error(
              "Complex32Array expects an even number of interleaved [re, im, ...] values.",
            );
          for (let o = 0; o < e.length; o += 2) {
            if (typeof e[o] != "number" || typeof e[o + 1] != "number")
              throw new Error(
                "Complex32Array expects interleaved [re, im, ...] values to be numbers.",
              );
            this.push(new qr(e[o], e[o + 1]));
          }
        }
      }
    };
  var M = class r {
    constructor(t, e, o = Float32Array, a = null, s = null) {
      ((this._buf = t),
        (this._loBuf = a),
        (this.length = e),
        (this.dtype = o),
        (this.device = s ?? Zr()));
    }
    static from(t, e) {
      let o = t instanceof GPUDevice,
        a = o ? t : Zr(),
        s = o ? e : t;
      if (s instanceof Float64Array) {
        let { hi: m, lo: n } = hr(s),
          l = x(a, m, "gpu-vector-f64-hi", !0),
          u = x(a, n, "gpu-vector-f64-lo", !0);
        return new r(l, s.length, Float64Array, u, a);
      }
      if (s instanceof xr) {
        let m = x(a, Jr(s), "gpu-vector-complex32", !0);
        return new r(m, s.length, xr, null, a);
      }
      if (s instanceof Er) {
        let { hi: m, lo: n } = ge(s),
          l = x(a, m, "gpu-vector-complex64-hi", !0),
          u = x(a, n, "gpu-vector-complex64-lo", !0);
        return new r(l, s.length, Er, u, a);
      }
      if (!(s instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let i = x(a, s, "gpu-vector", !0);
      return new r(i, s.length, s.constructor, null, a);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        o = k(t, e, this._buf);
      if ((t.queue.submit([e.finish()]), this.dtype === xr))
        return new xr(await G(o, Float32Array));
      if (!this._loBuf) return G(o, this.dtype);
      let a = t.createCommandEncoder(),
        s = k(t, a, this._loBuf);
      t.queue.submit([a.finish()]);
      let [i, m] = await Promise.all([G(o, Float32Array), G(s, Float32Array)]);
      return this.dtype === Er ? be(i, m) : Sr(i, m);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var H = class r {
    constructor(
      t,
      e,
      o,
      a,
      s = null,
      i = "row-major",
      m = null,
      n = Float32Array,
    ) {
      ((this._buf = t),
        (this._loBuf = s),
        (this.rows = e),
        (this.cols = o),
        (this.lda = a),
        (this.layout = i),
        (this.dtype = n),
        (this.device = m ?? Zr()));
    }
    static from(t, ...e) {
      let o = t instanceof GPUDevice,
        a = o ? t : Zr(),
        s = o ? e.shift() : t,
        [i, m, n, l = "row-major"] = e;
      if (l !== "row-major" && l !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let u = l === "row-major";
      if (
        (n === void 0 && (n = u ? m : i),
        !(s instanceof Float32Array) &&
          !(s instanceof Float64Array) &&
          !(s instanceof xr) &&
          !(s instanceof Er))
      )
        throw new Error(
          "GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      if (!Number.isInteger(i) || i <= 0)
        throw new Error("rows must be a positive integer.");
      if (!Number.isInteger(m) || m <= 0)
        throw new Error("cols must be a positive integer.");
      let f = u ? m : i;
      if (!Number.isInteger(n) || n < f)
        throw new Error(`lda must be an integer >= ${u ? "cols" : "rows"}.`);
      let d = u ? i : m;
      if (s.length < d * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (s instanceof Float64Array) {
        let w = d * n,
          { hi: g, lo: b } = hr(s.subarray(0, w)),
          h = x(a, g, "gpu-matrix-f64-hi", !0),
          y = x(a, b, "gpu-matrix-f64-lo", !0);
        return new r(h, i, m, n, y, l, a, Float64Array);
      }
      if (s instanceof xr) {
        let w = x(a, Jr(s, d * n), "gpu-matrix-complex32", !0);
        return new r(w, i, m, n, null, l, a, xr);
      }
      if (s instanceof Er) {
        let { hi: w, lo: g } = ge(s, d * n),
          b = x(a, w, "gpu-matrix-complex64-hi", !0),
          h = x(a, g, "gpu-matrix-complex64-lo", !0);
        return new r(b, i, m, n, h, l, a, Er);
      }
      let c = x(a, s.subarray(0, d * n), "gpu-matrix", !0);
      return new r(c, i, m, n, null, l, a);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        o = k(t, e, this._buf);
      t.queue.submit([e.finish()]);
      let a = this.layout !== "column-major",
        s = a ? this.rows : this.cols,
        i = a ? this.cols : this.rows;
      if (this.dtype === xr) {
        let l = new xr(await G(o, Float32Array));
        if (this.lda === i) return l;
        let u = new xr(s * i);
        for (let f = 0; f < s; f++)
          for (let d = 0; d < i; d++) u[f * i + d] = l[f * this.lda + d];
        return u;
      }
      if (this._loBuf) {
        let l = t.createCommandEncoder(),
          u = k(t, l, this._loBuf);
        t.queue.submit([l.finish()]);
        let [f, d] = await Promise.all([
          G(o, Float32Array),
          G(u, Float32Array),
        ]);
        if (this.dtype === Er) {
          let g = be(f, d);
          if (this.lda === i) return g;
          let b = new Er(s * i);
          for (let h = 0; h < s; h++)
            for (let y = 0; y < i; y++) b[h * i + y] = g[h * this.lda + y];
          return b;
        }
        let c = Sr(f, d);
        if (this.lda === i) return c;
        let w = new Float64Array(s * i);
        for (let g = 0; g < s; g++)
          w.set(c.subarray(g * this.lda, g * this.lda + i), g * i);
        return w;
      }
      let m = await G(o, Float32Array);
      if (this.lda === i) return m;
      let n = new Float32Array(s * i);
      for (let l = 0; l < s; l++)
        n.set(m.subarray(l * this.lda, l * this.lda + i), l * i);
      return n;
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  function He(r, t = -1, e = 1) {
    let o = new Float32Array(r);
    for (let a = 0; a < r; a++) o[a] = t + Math.random() * (e - t);
    return o;
  }
  function Ue(r, t = -1, e = 1) {
    let o = new Float64Array(r);
    for (let a = 0; a < r; a++) o[a] = t + Math.random() * (e - t);
    return o;
  }
  function ze(
    r,
    t,
    e = "lower",
    o = -1,
    a = 1,
    s = 5,
    i = 15,
    m = "row-major",
  ) {
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (t < r) throw new Error("lda must be >= n.");
    let n = m === "column-major",
      l = (f, d) => (n ? d * t + f : f * t + d),
      u = new Float32Array(r * t);
    for (let f = 0; f < r; f++) {
      for (let d = 0; d < r; d++) {
        if (f === d) continue;
        (e === "lower" ? d < f : d > f) &&
          (u[l(f, d)] = o + Math.random() * (a - o));
      }
      u[l(f, f)] = s + Math.random() * (i - s);
    }
    return u;
  }
  function E(r, t, e, o = 0) {
    let a = e.map((s, i) => ({
      binding: o + i,
      resource: s instanceof GPUBuffer ? { buffer: s } : s,
    }));
    return r.createBindGroup({ layout: t, entries: a });
  }
  function I(r, t) {
    r.queue.submit([t.finish()]);
  }
  function Tr(r) {
    let { querySet: t, passDescriptor: e } = je(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: t,
      passDescriptor: e,
    };
  }
  function cr(r, t, e, o, a) {
    let s = r.beginComputePass(a);
    (s.setPipeline(t),
      s.setBindGroup(0, e),
      typeof o == "number"
        ? s.dispatchWorkgroups(o)
        : s.dispatchWorkgroups(o.x, o.y, o.z ?? 1),
      s.end());
  }
  function F(r, t, e, o) {
    let { commandEncoder: a, querySet: s, passDescriptor: i } = Tr(r);
    cr(a, t, e, o, i);
    let m = Pr(r, a, s);
    return { commandEncoder: a, ts: m };
  }
  var is = {},
    Ie = new WeakMap();
  async function S(r, t, e = "main") {
    Ie.has(r) || Ie.set(r, new Map());
    let o = Ie.get(r),
      a = Array.isArray(t) ? t : [t],
      s = `${a.join("+")}::${e}`;
    if (!o.has(s)) {
      let i = ss(r, a, e).catch((m) => {
        throw (o.delete(s), m);
      });
      o.set(s, i);
    }
    return o.get(s);
  }
  async function as(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: t } = await Promise.resolve().then(() => (ho(), bo)),
        e = t[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: t } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: o, join: a } = await import("path"),
        s = o(e(is.url));
      return t(a(s, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function ss(r, t, e = "main") {
    let o = t.join("+"),
      a = await Promise.all(t.map(as)),
      s = 0,
      i = a.map((w, g) => {
        let b = w.split(`
`).length,
          h = { name: t[g], startLine: s + 1, endLine: s + b };
        return ((s += b), h);
      }),
      m = (w) => {
        let g = w && i.find((b) => w >= b.startLine && w <= b.endLine);
        return g ? `${g.name}.wgsl:${w - g.startLine + 1}` : `line ${w}`;
      },
      n = a.join(`
`),
      l = r.createShaderModule({ label: o, code: n }),
      f = (await l.getCompilationInfo()).messages.filter(
        (w) => w.type === "error",
      );
    if (f.length > 0)
      throw new Error(`Shader "${o}" compilation failed:
${f.map((w) => `  ${m(w.lineNum)}: ${w.message}`).join(`
`)}`);
    let d = e === "main" ? { module: l } : { module: l, entryPoint: e },
      c = r.createComputePipeline({ label: o, layout: "auto", compute: d });
    return ((c._shaderModule = l), c);
  }
  function vr(r, t, e) {
    let o = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(t / 64), o)
      : { x: Math.min(Math.ceil(e / 8), o), y: Math.min(Math.ceil(t / 8), o) };
  }
  function K(r, t, e, o = "x") {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    if (t > a)
      throw new Error(
        `${e}: this problem needs ${t} workgroups in ${o}, but the device allows ${a} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return t;
  }
  function Yr(r, t, e, o) {
    return o === void 0
      ? K(r, Math.ceil(e / 64), t)
      : {
          x: K(r, Math.ceil(o / 8), t, "x"),
          y: K(r, Math.ceil(e / 8), t, "y"),
        };
  }
  function P(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function L(r, t, e) {
    for (let [o, a] of Object.entries(e))
      if (!(!(a instanceof M) && !(a instanceof H)) && a.device !== r)
        throw new Error(
          `${t}: ${o} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function yo(r, t, e, o, a) {
    let s = o instanceof M;
    if (
      (P(r),
      L(r, "sscal", { x: o }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof Float32Array) && !(o instanceof M))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return s ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await S(r, "sscal"),
      m = null,
      n = null,
      l = null;
    try {
      ((m = s ? o._buf : x(r, o, "sscal-x", !0)),
        (n = R(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: a, type: "u32" },
          ],
          "sscal-params",
        )));
      let u = E(r, i.getBindGroupLayout(0), [m, n]),
        { commandEncoder: f, ts: d } = F(r, i, u, vr(r, t));
      ((l = s ? null : k(r, f, m)), I(r, f));
      let c = await D(d);
      if (s) return c !== void 0 ? { gpuTimeMs: c } : {};
      let w = await G(l, Float32Array);
      return ((l = null), c !== void 0 ? { x: w, gpuTimeMs: c } : { x: w });
    } finally {
      (!s && m && p(m), n && p(n), l && p(l));
    }
  }
  async function xo(r, t, e, o, a) {
    let s = o instanceof M;
    if (
      (P(r),
      L(r, "cscal", { x: o }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof qr)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof xr) && !s)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (s && o.dtype !== xr)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (t <= 0) return s ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await S(r, "cscal"),
      m = null,
      n = null,
      l = null;
    try {
      ((m = s ? o._buf : x(r, Jr(o), "cscal-x", !0)),
        (n = R(
          r,
          [
            { value: t, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: a, type: "u32" },
          ],
          "cscal-params",
        )));
      let u = E(r, i.getBindGroupLayout(0), [m, n]),
        { commandEncoder: f, ts: d } = F(r, i, u, vr(r, t));
      ((l = s ? null : k(r, f, m)), I(r, f));
      let c = await D(d);
      if (s) return c !== void 0 ? { gpuTimeMs: c } : {};
      let w = await G(l, Float32Array);
      l = null;
      let g = new xr(w);
      return c !== void 0 ? { x: g, gpuTimeMs: c } : { x: g };
    } finally {
      (!s && m && p(m), n && p(n), l && p(l));
    }
  }
  async function vo(r, t, e, o, a) {
    let s = o instanceof M;
    if ((P(r), !Number.isInteger(t) || !Number.isInteger(a)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (s && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (a <= 0) throw new Error("incx must be positive.");
    if ((L(r, "dscal", { x: o }), t <= 0)) return s ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let m = await S(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: l } = hr(new Float64Array([e])),
      u = null,
      f = null,
      d = null,
      c = null,
      w = null;
    try {
      if (s) ((u = o._buf), (f = o._loBuf));
      else {
        let { hi: N, lo: B } = hr(o);
        ((u = x(r, N, "dscal-xHi", !0)), (f = x(r, B, "dscal-xLo", !0)));
      }
      d = R(
        r,
        [
          { value: t, type: "u32" },
          { value: n[0], type: "f32" },
          { value: l[0], type: "f32" },
          { value: a, type: "u32" },
        ],
        "dscal-params",
      );
      let g = E(r, m.getBindGroupLayout(0), [u, f, d]),
        { commandEncoder: b, ts: h } = F(r, m, g, vr(r, t));
      ((c = s ? null : k(r, b, u)), (w = s ? null : k(r, b, f)), I(r, b));
      let y = await D(h);
      if (s) return y !== void 0 ? { gpuTimeMs: y } : {};
      let v = await G(c, Float32Array);
      c = null;
      let _ = await G(w, Float32Array);
      w = null;
      let A = Sr(v, _);
      return y !== void 0 ? { x: A, gpuTimeMs: y } : { x: A };
    } finally {
      (!s && u && p(u), !s && f && p(f), d && p(d), c && p(c), w && p(w));
    }
  }
  async function _o(r, t, e, o, a, s) {
    let i = e instanceof M,
      m = a instanceof M;
    if (
      (P(r),
      L(r, "sswap", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof M))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(a instanceof Float32Array) && !(a instanceof M))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (e.constructor !== a.constructor)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return i ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await S(r, "sswap"),
      l = null,
      u = null,
      f = null,
      d = null,
      c = null;
    try {
      ((l = i ? e._buf : x(r, e, "sswap-x", !0)),
        (u = m ? a._buf : x(r, a, "sswap-y", !0)),
        (f = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sswap-params",
        )));
      let w = E(r, n.getBindGroupLayout(0), [l, u, f]),
        { commandEncoder: g, ts: b } = F(r, n, w, vr(r, t));
      ((d = i ? null : k(r, g, l)), (c = m ? null : k(r, g, u)), I(r, g));
      let h = await D(b);
      if (i) return h !== void 0 ? { gpuTimeMs: h } : {};
      let y = await G(d, Float32Array);
      d = null;
      let v = await G(c, Float32Array);
      return (
        (c = null),
        h !== void 0 ? { x: y, y: v, gpuTimeMs: h } : { x: y, y: v }
      );
    } finally {
      (!i && l && p(l), !m && u && p(u), f && p(f), d && p(d), c && p(c));
    }
  }
  async function Bo(r, t, e, o, a, s, i) {
    let m = o instanceof M,
      n = s instanceof M;
    if (
      (P(r),
      L(r, "saxpy", { x: o, y: s }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (m !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { y: s };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await S(r, "saxpy"),
      u = null,
      f = null,
      d = null,
      c = null;
    try {
      ((u = m ? o._buf : x(r, o, "saxpy-x", !1)),
        (f = n ? s._buf : x(r, s, "saxpy-y", !0)),
        (d = R(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "saxpy-params",
        )));
      let w = E(r, l.getBindGroupLayout(0), [u, f, d]),
        { commandEncoder: g, ts: b } = F(r, l, w, vr(r, t));
      ((c = n ? null : k(r, g, f)), I(r, g));
      let h = await D(b);
      if (n) return h !== void 0 ? { gpuTimeMs: h } : {};
      let y = await G(c, Float32Array);
      return ((c = null), h !== void 0 ? { y, gpuTimeMs: h } : { y });
    } finally {
      (!m && u && p(u), !n && f && p(f), d && p(d), c && p(c));
    }
  }
  async function Ao(r, t, e, o, a, s, i) {
    let m = o instanceof M,
      n = s instanceof M;
    if (
      (P(r),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !m)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(s instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (m && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (m !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if ((L(r, "daxpy", { x: o, y: s }), t <= 0)) return n ? {} : { y: s };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let u = await S(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: f, lo: d } = hr(new Float64Array([e])),
      c = null,
      w = null,
      g = null,
      b = null,
      h = null,
      y = null,
      v = null;
    try {
      if (m) ((c = o._buf), (w = o._loBuf), (g = s._buf), (b = s._loBuf));
      else {
        let W = hr(o),
          q = hr(s);
        ((c = x(r, W.hi, "daxpy-xHi", !1)),
          (w = x(r, W.lo, "daxpy-xLo", !1)),
          (g = x(r, q.hi, "daxpy-yHi", !0)),
          (b = x(r, q.lo, "daxpy-yLo", !0)));
      }
      h = R(
        r,
        [
          { value: t, type: "u32" },
          { value: f[0], type: "f32" },
          { value: d[0], type: "f32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "daxpy-params",
      );
      let _ = E(r, u.getBindGroupLayout(0), [c, w, g, b, h]),
        { commandEncoder: A, ts: N } = F(r, u, _, vr(r, t));
      ((y = n ? null : k(r, A, g)), (v = n ? null : k(r, A, b)), I(r, A));
      let B = await D(N);
      if (n) return B !== void 0 ? { gpuTimeMs: B } : {};
      let j = await G(y, Float32Array);
      y = null;
      let C = await G(v, Float32Array);
      v = null;
      let T = Sr(j, C);
      return B !== void 0 ? { y: T, gpuTimeMs: B } : { y: T };
    } finally {
      (!m && c && p(c),
        !m && w && p(w),
        !n && g && p(g),
        !n && b && p(b),
        h && p(h),
        y && p(y),
        v && p(v));
    }
  }
  async function Eo(r, t, e, o, a, s) {
    let i = e instanceof M,
      m = a instanceof M;
    if (
      (P(r),
      L(r, "scopy", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!m && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (i !== m)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return m ? {} : { y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await S(r, "scopy"),
      l = null,
      u = null,
      f = null,
      d = null;
    try {
      ((l = i ? e._buf : x(r, e, "scopy-x", !1)),
        (u = m ? a._buf : x(r, a, "scopy-y", !0)),
        (f = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "scopy-params",
        )));
      let c = E(r, n.getBindGroupLayout(0), [l, u, f]),
        { commandEncoder: w, ts: g } = F(r, n, c, vr(r, t));
      ((d = m ? null : k(r, w, u)), I(r, w));
      let b = await D(g);
      if (m) return b !== void 0 ? { gpuTimeMs: b } : {};
      let h = await G(d, Float32Array);
      return ((d = null), b !== void 0 ? { y: h, gpuTimeMs: b } : { y: h });
    } finally {
      (!i && l && p(l), !m && u && p(u), f && p(f), d && p(d));
    }
  }
  async function Go(r, t, e, o, a, s) {
    let i = e instanceof M,
      m = a instanceof M;
    if (
      (P(r),
      L(r, "sdot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!m && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (i !== m)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await S(r, "sdot"),
      l = await S(r, "reduction/sum"),
      u = null,
      f = null,
      d = null,
      c = null,
      w = null,
      g = null;
    try {
      ((u = i ? e._buf : x(r, e, "sdot-x", !1)),
        (f = m ? a._buf : x(r, a, "sdot-y", !1)),
        (d = tr(r, 512, "sdot-partials")),
        (c = Br(r, 4, "sdot-result")),
        (w = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sdot-params",
        )));
      let b = E(r, n.getBindGroupLayout(0), [u, f, d, w]),
        { commandEncoder: h, ts: y } = F(r, n, b, 128);
      I(r, h);
      let v = E(r, l.getBindGroupLayout(0), [d, c]),
        { commandEncoder: _, ts: A } = F(r, l, v, 1);
      ((g = k(r, _, c)), I(r, _));
      let N = G(g, Float32Array);
      g = null;
      let [B, j, C] = await Promise.all([D(y), D(A), N]);
      return B !== void 0 && j !== void 0
        ? { dot: C[0], gpuTimeMs: B + j }
        : { dot: C[0] };
    } finally {
      (!i && u && p(u),
        !m && f && p(f),
        d && p(d),
        c && p(c),
        w && p(w),
        g && p(g));
    }
  }
  async function So(r, t, e, o) {
    let a = e instanceof M;
    if (
      (P(r),
      L(r, "sasum", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { asum: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await S(r, "sasum"),
      i = await S(r, "reduction/sum"),
      m = null,
      n = null,
      l = null,
      u = null,
      f = null;
    try {
      ((m = a ? e._buf : x(r, e, "sasum-x", !1)),
        (n = tr(r, 512, "sasum-partials")),
        (l = Br(r, 4, "sasum-result")),
        (u = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "sasum-params",
        )));
      let d = E(r, s.getBindGroupLayout(0), [m, n, u]),
        { commandEncoder: c, ts: w } = F(r, s, d, 128);
      I(r, c);
      let g = E(r, i.getBindGroupLayout(0), [n, l]),
        { commandEncoder: b, ts: h } = F(r, i, g, 1);
      ((f = k(r, b, l)), I(r, b));
      let y = G(f, Float32Array);
      f = null;
      let [v, _, A] = await Promise.all([D(w), D(h), y]);
      return v !== void 0 && _ !== void 0
        ? { asum: A[0], gpuTimeMs: v + _ }
        : { asum: A[0] };
    } finally {
      (!a && m && p(m), n && p(n), l && p(l), u && p(u), f && p(f));
    }
  }
  async function ko(r, t, e, o) {
    let a = e instanceof M;
    if (
      (P(r),
      L(r, "dasum", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (a && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { asum: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = ["f64/dekker", "f64/utils/abs", "f64/utils/add"],
      i = await S(r, [...s, "dasum"]),
      m = await S(r, [...s, "reduction/sumF64"]),
      n = null,
      l = null,
      u = null,
      f = null,
      d = null,
      c = null,
      w = null,
      g = null,
      b = null;
    try {
      if (a) ((n = e._buf), (l = e._loBuf));
      else {
        let { hi: z, lo: O } = hr(e.map(Math.abs));
        ((n = x(r, z, "dasum-xHi", !1)), (l = x(r, O, "dasum-xLo", !1)));
      }
      ((u = tr(r, 512, "dasum-partialsHi")),
        (f = tr(r, 512, "dasum-partialsLo")),
        (d = Br(r, 4, "dasum-result-hi")),
        (c = Br(r, 4, "dasum-result-lo")),
        (w = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "dasum-params",
        )));
      let h = E(r, i.getBindGroupLayout(0), [n, l, u, f, w]),
        { commandEncoder: y, ts: v } = F(r, i, h, 128);
      I(r, y);
      let _ = E(r, m.getBindGroupLayout(0), [u, f, d, c]),
        { commandEncoder: A, ts: N } = F(r, m, _, 1);
      ((g = k(r, A, d)), (b = k(r, A, c)), I(r, A));
      let B = G(g, Float32Array),
        j = G(b, Float32Array);
      ((g = null), (b = null));
      let [C, T, W, q] = await Promise.all([D(v), D(N), B, j]),
        U = Sr(W, q)[0];
      return C !== void 0 && T !== void 0
        ? { asum: U, gpuTimeMs: C + T }
        : { asum: U };
    } finally {
      (!a && n && p(n),
        !a && l && p(l),
        u && p(u),
        f && p(f),
        d && p(d),
        c && p(c),
        w && p(w),
        g && p(g),
        b && p(b));
    }
  }
  async function No(r, t, e, o, a, s) {
    let i = e instanceof M,
      m = a instanceof M;
    if (
      (P(r),
      L(r, "ddot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!m && !(a instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (i && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (m && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (i !== m)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = ["f64/dekker", "f64/utils/add"],
      l = await S(r, [...n, "f64/utils/multiply", "ddot"]),
      u = await S(r, [...n, "reduction/sumF64"]),
      f = null,
      d = null,
      c = null,
      w = null,
      g = null,
      b = null,
      h = null,
      y = null,
      v = null,
      _ = null,
      A = null;
    try {
      if (i) ((f = e._buf), (d = e._loBuf), (c = a._buf), (w = a._loBuf));
      else {
        let ur = hr(e),
          mr = hr(a);
        ((f = x(r, ur.hi, "ddot-xHi", !1)),
          (d = x(r, ur.lo, "ddot-xLo", !1)),
          (c = x(r, mr.hi, "ddot-yHi", !1)),
          (w = x(r, mr.lo, "ddot-yLo", !1)));
      }
      ((g = tr(r, 512, "ddot-partialsHi")),
        (b = tr(r, 512, "ddot-partialsLo")),
        (h = Br(r, 4, "ddot-result-hi")),
        (y = Br(r, 4, "ddot-result-lo")),
        (v = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "ddot-params",
        )));
      let N = E(r, l.getBindGroupLayout(0), [f, d, c, w, g, b, v]),
        { commandEncoder: B, ts: j } = F(r, l, N, 128);
      I(r, B);
      let C = E(r, u.getBindGroupLayout(0), [g, b, h, y]),
        { commandEncoder: T, ts: W } = F(r, u, C, 1);
      ((_ = k(r, T, h)), (A = k(r, T, y)), I(r, T));
      let q = G(_, Float32Array),
        U = G(A, Float32Array);
      ((_ = null), (A = null));
      let [z, O, rr, X] = await Promise.all([D(j), D(W), q, U]),
        $ = Sr(rr, X)[0];
      return z !== void 0 && O !== void 0
        ? { dot: $, gpuTimeMs: z + O }
        : { dot: $ };
    } finally {
      (!i && f && p(f),
        !i && d && p(d),
        !m && c && p(c),
        !m && w && p(w),
        g && p(g),
        b && p(b),
        h && p(h),
        y && p(y),
        v && p(v),
        _ && p(_),
        A && p(A));
    }
  }
  async function Mo(r, t, e, o) {
    let a = e instanceof M;
    if (
      (P(r),
      L(r, "snrm2", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { nrm2: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await S(r, "snrm2"),
      i = await S(r, "reduction/scaledSum"),
      m = null,
      n = null,
      l = null,
      u = null,
      f = null,
      d = null;
    try {
      ((m = a ? e._buf : x(r, e, "snrm2-x", !1)),
        (n = tr(r, 512, "snrm2-partials-scale")),
        (l = tr(r, 512, "snrm2-partials-ssq")),
        (u = Br(r, 4, "snrm2-result")),
        (f = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "snrm2-params",
        )));
      let c = E(r, s.getBindGroupLayout(0), [m, n, l, f]),
        { commandEncoder: w, ts: g } = F(r, s, c, 128);
      I(r, w);
      let b = E(r, i.getBindGroupLayout(0), [n, l, u]),
        { commandEncoder: h, ts: y } = F(r, i, b, 1);
      ((d = k(r, h, u)), I(r, h));
      let v = G(d, Float32Array);
      d = null;
      let [_, A, N] = await Promise.all([D(g), D(y), v]),
        B = N[0];
      return _ !== void 0 && A !== void 0
        ? { nrm2: B, gpuTimeMs: _ + A }
        : { nrm2: B };
    } finally {
      (!a && m && p(m), n && p(n), l && p(l), u && p(u), f && p(f), d && p(d));
    }
  }
  async function Do(r, t, e, o) {
    let a = e instanceof M;
    if (
      (P(r),
      L(r, "isamax", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { index: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await S(r, "isamax"),
      i = await S(r, "reduction/argmax"),
      m = null,
      n = null,
      l = null,
      u = null,
      f = null,
      d = null;
    try {
      ((m = a ? e._buf : x(r, e, "isamax-x", !1)),
        (n = tr(r, 512, "isamax-partials-val")),
        (l = tr(r, 512, "isamax-partials-idx")),
        (u = Br(r, 4, "isamax-result")),
        (f = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "isamax-params",
        )));
      let c = E(r, s.getBindGroupLayout(0), [m, n, l, f]),
        { commandEncoder: w, ts: g } = F(r, s, c, 128);
      I(r, w);
      let b = E(r, i.getBindGroupLayout(0), [n, l, u]),
        { commandEncoder: h, ts: y } = F(r, i, b, 1);
      ((d = k(r, h, u)), I(r, h));
      let v = G(d, Uint32Array);
      d = null;
      let [_, A, N] = await Promise.all([D(g), D(y), v]),
        B = N[0];
      return _ !== void 0 && A !== void 0
        ? { index: B, gpuTimeMs: _ + A }
        : { index: B };
    } finally {
      (!a && m && p(m), n && p(n), l && p(l), u && p(u), f && p(f), d && p(d));
    }
  }
  async function Io(r, t, e, o) {
    let a = e instanceof M;
    if (
      (P(r),
      L(r, "idamax", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (a && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { index: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/equal",
      ],
      i = await S(r, [...s, "idamax"], "idamax_main"),
      m = await S(r, [...s, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      l = null,
      u = null,
      f = null,
      d = null,
      c = null,
      w = null,
      g = null;
    try {
      if (a) ((n = e._buf), (l = e._loBuf));
      else {
        let { hi: W, lo: q } = hr(e);
        ((n = x(r, W, "idamax-xHi", !1)), (l = x(r, q, "idamax-xLo", !1)));
      }
      ((u = tr(r, 512, "idamax-partials-val-hi")),
        (f = tr(r, 512, "idamax-partials-val-lo")),
        (d = tr(r, 512, "idamax-partials-idx")),
        (c = Br(r, 4, "idamax-result")),
        (w = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "idamax-params",
        )));
      let b = E(r, i.getBindGroupLayout(0), [n, l, u, f, d, w]),
        { commandEncoder: h, ts: y } = F(r, i, b, 128);
      I(r, h);
      let v = E(r, m.getBindGroupLayout(0), [u, f, d, c]),
        { commandEncoder: _, ts: A } = F(r, m, v, 1);
      ((g = k(r, _, c)), I(r, _));
      let N = G(g, Uint32Array);
      g = null;
      let [B, j, C] = await Promise.all([D(y), D(A), N]),
        T = C[0];
      return B !== void 0 && j !== void 0
        ? { index: T, gpuTimeMs: B + j }
        : { index: T };
    } finally {
      (!a && n && p(n),
        !a && l && p(l),
        u && p(u),
        f && p(f),
        d && p(d),
        c && p(c),
        w && p(w),
        g && p(g));
    }
  }
  async function Ro(r, t, e, o, a, s, i, m) {
    let n = e instanceof M,
      l = a instanceof M;
    if (
      (P(r),
      L(r, "srot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof i != "number") throw new Error("c must be a number.");
    if (typeof m != "number") throw new Error("s must be a number.");
    if (Number.isNaN(i) || Number.isNaN(m))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("c must be finite.");
    if (!Number.isFinite(m)) throw new Error("s must be finite.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!n && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!l && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (n !== l)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let u = await S(r, "srot"),
      f = null,
      d = null,
      c = null,
      w = null,
      g = null;
    try {
      ((f = n ? e._buf : x(r, e, "srot-x", !0)),
        (d = l ? a._buf : x(r, a, "srot-y", !0)),
        (c = R(
          r,
          [
            { value: t, type: "u32" },
            { value: i, type: "f32" },
            { value: m, type: "f32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "srot-params",
        )));
      let b = E(r, u.getBindGroupLayout(0), [f, d, c]),
        { commandEncoder: h, ts: y } = F(r, u, b, vr(r, t));
      ((w = n ? null : k(r, h, f)), (g = l ? null : k(r, h, d)), I(r, h));
      let v = await D(y);
      if (n) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = G(w, Float32Array),
        A = G(g, Float32Array);
      ((w = null), (g = null));
      let [N, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: N, y: B, gpuTimeMs: v } : { x: N, y: B };
    } finally {
      (!n && f && p(f), !l && d && p(d), c && p(c), w && p(w), g && p(g));
    }
  }
  async function Po(r, t, e, o, a, s, i) {
    let m = e instanceof M,
      n = a instanceof M;
    if (
      (P(r),
      L(r, "srotm", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(i instanceof Float32Array) || i.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (i[0] !== -2 && i[0] !== -1 && i[0] !== 0 && i[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (m !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0 || i[0] === -2) return m ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await S(r, "srotm"),
      u = null,
      f = null,
      d = null,
      c = null,
      w = null,
      g = null;
    try {
      ((u = m ? e._buf : x(r, e, "srotm-x", !0)),
        (f = n ? a._buf : x(r, a, "srotm-y", !0)),
        (d = x(r, i, "srotm-param", !1)),
        (c = R(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "srotm-params",
        )));
      let b = E(r, l.getBindGroupLayout(0), [u, f, d, c]),
        { commandEncoder: h, ts: y } = F(r, l, b, vr(r, t));
      ((w = m ? null : k(r, h, u)), (g = n ? null : k(r, h, f)), I(r, h));
      let v = await D(y);
      if (m) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = G(w, Float32Array),
        A = G(g, Float32Array);
      ((w = null), (g = null));
      let [N, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: N, y: B, gpuTimeMs: v } : { x: N, y: B };
    } finally {
      (!m && u && p(u),
        !n && f && p(f),
        d && p(d),
        c && p(c),
        w && p(w),
        g && p(g));
    }
  }
  async function Lo(r, t, e, o, a, s, i, m, n, l, u, f, d = "row-major") {
    let c = s instanceof H,
      w = m instanceof M,
      g = u instanceof M;
    if (
      (P(r),
      L(r, "sgemv", { A: s, x: m, y: u }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      !Number.isInteger(f) ||
      !Number.isInteger(i)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || f <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(m instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && m._buf === u._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && g && s._buf === u._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (s.rows < e || s.cols < o))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || o < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || o === 0) return g ? {} : { y: u };
    (c ? s.layout : d) === "column-major" &&
      (([e, o] = [o, e]),
      (t = t === "no-transpose" ? "transpose" : "no-transpose"));
    let h = t === "no-transpose",
      y = h ? o : e,
      v = h ? e : o;
    if (i < o) throw new Error("lda must be >= n.");
    if (!c && s.length < (e - 1) * i + o)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (m.length < (y - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (u.length < (v - 1) * f + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let A = await S(r, h ? "sgemv_n" : "sgemv_t"),
      N = null,
      B = null,
      j = null,
      C = null;
    try {
      ((N = c ? s._buf : x(r, s, "sgemv-A", !1)),
        (B = w ? m._buf : x(r, m, "sgemv-x", !1)),
        (j = g ? u._buf : x(r, u, "sgemv-y", !0)),
        (C = R(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "u32" },
            { value: a, type: "f32" },
            { value: l, type: "f32" },
            { value: n, type: "u32" },
            { value: f, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sgemv-params",
        )));
      let T = E(r, A.getBindGroupLayout(0), [N, B, j, C]),
        W = h
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Yr(r, "sgemv", v),
        { commandEncoder: q, ts: U } = F(r, A, T, W),
        z = g ? null : k(r, q, j);
      I(r, q);
      let O = await D(U);
      if (g) return O !== void 0 ? { gpuTimeMs: O } : {};
      let rr = await G(z, Float32Array);
      return O !== void 0 ? { y: rr, gpuTimeMs: O } : { y: rr };
    } finally {
      (!c && N && p(N), !w && B && p(B), !g && j && p(j), C && p(C));
    }
  }
  async function To(r, t, e, o, a, s, i, m, n, l, u, f = "row-major") {
    let d = i instanceof M,
      c = l instanceof M,
      w = a instanceof H;
    if (
      (P(r),
      L(r, "ssymv", { A: a, x: i, y: l }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (f !== "row-major" && f !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(m) ||
      !Number.isInteger(u) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (m <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (s < e) throw new Error("lda must be >= n.");
    if (!w && !(a instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(i instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (d !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (d && !w)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (w && !d)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (d && i._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && s !== a.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (w && (a.rows < e || a.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { y: l };
    if (!w && a.length < (e - 1) * s + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (i.length < (e - 1) * m + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (l.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let b =
        (w ? a.layout : f) === "column-major" ? t === "upper" : t === "lower",
      h = await S(r, "ssymv"),
      y = null,
      v = null,
      _ = null,
      A = null;
    try {
      ((y = w ? a._buf : x(r, a, "ssymv-A", !1)),
        (v = d ? i._buf : x(r, i, "ssymv-x", !1)),
        (_ = c ? l._buf : x(r, l, "ssymv-y", !0)),
        (A = R(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: n, type: "f32" },
            { value: m, type: "u32" },
            { value: u, type: "u32" },
            { value: s, type: "u32" },
            { value: b ? 0 : 1, type: "u32" },
          ],
          "ssymv-params",
        )));
      let N = E(r, h.getBindGroupLayout(0), [y, v, _, A]),
        B = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: j, ts: C } = F(r, h, N, B),
        T = c ? null : k(r, j, _);
      I(r, j);
      let W = await D(C);
      if (c) return W !== void 0 ? { gpuTimeMs: W } : {};
      let q = await G(T, Float32Array);
      return W !== void 0 ? { y: q, gpuTimeMs: W } : { y: q };
    } finally {
      (!w && y && p(y), !d && v && p(v), !c && _ && p(_), A && p(A));
    }
  }
  async function Co(r, t, e, o, a, s, i, m, n, l, u, f = "row-major") {
    let d = m instanceof M,
      c = l instanceof M,
      w = s instanceof H,
      g = o === "unit";
    if (
      (P(r),
      L(r, "strmv", { A: s, x: m, y: l }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!g && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (f !== "row-major" && f !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(u) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (i < a) throw new Error("lda must be >= n.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(m instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (d !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (d && m._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (d && !w)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (w && !d)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && c && s._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (w && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (w && (s.rows < a || s.cols < a))
      throw new Error("A is too small for the given n.");
    if (a < 0) throw new Error("n must be non-negative.");
    if (a === 0) return c ? {} : { y: l };
    if (!w && s.length < (a - 1) * i + a)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (m.length < (a - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (l.length < (a - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h = (w ? s.layout : f) === "column-major",
      y = h ? t === "upper" : t === "lower",
      v = h ? e === "transpose" : e === "no-transpose",
      _ = await S(r, "strmv"),
      A = null,
      N = null,
      B = null,
      j = null;
    try {
      ((A = w ? s._buf : x(r, s, "strmv-A", !1)),
        (N = d ? m._buf : x(r, m, "strmv-x", !1)),
        (B = c ? l._buf : x(r, l, "strmv-y", !0)),
        (j = R(
          r,
          [
            { value: a, type: "u32" },
            { value: n, type: "u32" },
            { value: u, type: "u32" },
            { value: i, type: "u32" },
            { value: v ? 0 : 1, type: "u32" },
            { value: y ? 0 : 1, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmv-params",
        )));
      let C = E(r, _.getBindGroupLayout(0), [A, N, B, j]),
        T = Math.min(a, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: W, ts: q } = F(r, _, C, T),
        U = c ? null : k(r, W, B);
      I(r, W);
      let z = await D(q);
      if (c) return z !== void 0 ? { gpuTimeMs: z } : {};
      let O = await G(U, Float32Array);
      return z !== void 0 ? { y: O, gpuTimeMs: z } : { y: O };
    } finally {
      (!w && A && p(A), !d && N && p(N), !c && B && p(B), j && p(j));
    }
  }
  function jo(r, t, e) {
    let o = new ArrayBuffer(r * t),
      a = new DataView(o);
    for (let s = 0; s < r; s++) {
      let i = e(s),
        m = s * t;
      i.forEach((n, l) => a.setUint32(m + l * 4, n, !0));
    }
    return o;
  }
  function Fo(r, t, e) {
    let o = r.createBuffer({
      label: e,
      size: t.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(o, 0, t), o);
  }
  async function Wo(r, t, e, o, a, s, i, m, n, l = "row-major") {
    let u = m instanceof M,
      f = s instanceof H,
      d = o === "unit";
    if ((P(r), L(r, "strsv", { A: s, x: m }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!d && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(a) || !Number.isInteger(n) || !Number.isInteger(i))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (i < a) throw new Error("lda must be >= n.");
    if (!f && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!u && !(m instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (u && !f)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (f && !u)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (f && u && s._buf === m._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (f && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (f && (s.rows < a || s.cols < a))
      throw new Error("A is too small for the given n.");
    if (a < 0) throw new Error("n must be non-negative.");
    if (a === 0) return u ? {} : { x: m };
    if (!f && s.length < (a - 1) * i + a)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (m.length < (a - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w = (f ? s.layout : l) === "column-major",
      g = w ? t === "upper" : t === "lower",
      b = w ? e === "transpose" : e === "no-transpose",
      h = await S(r, "strsv_invert_block"),
      y = await S(r, "strsv_apply_inverse"),
      v = await S(r, "strsv_update"),
      _ = b === g,
      A = [];
    for (let O = 0; O < a; O += 64) A.push(O);
    _ || A.reverse();
    let N = A.length,
      B = r.limits.maxComputeWorkgroupsPerDimension,
      j = r.limits.minUniformBufferOffsetAlignment,
      C = null,
      T = null,
      W = null,
      q = null,
      U = null,
      z = null;
    try {
      ((C = f ? s._buf : x(r, s, "strsv-A", !1)),
        (T = u ? m._buf : x(r, m, "strsv-x", !0)),
        (W = tr(r, N * 64 * 64 * 4, "strsv-Ainv")));
      let O = jo(N, j, (J) => {
        let Y = J * 64,
          Q = Math.min(Y + 64, a);
        return [n, J, Y, Q];
      });
      q = Fo(r, O, "strsv-apply-params");
      let rr = jo(N, j, (J) => {
        let Y = J * 64,
          Q = Math.min(Y + 64, a);
        return [a, n, i, b ? 0 : 1, g ? 0 : 1, Y, Q];
      });
      U = Fo(r, rr, "strsv-update-params");
      let { commandEncoder: X, querySet: $ } = Tr(r);
      z = R(
        r,
        [
          { value: a, type: "u32" },
          { value: i, type: "u32" },
          { value: b ? 0 : 1, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
          { value: d ? 1 : 0, type: "u32" },
        ],
        "strsv-invert-params",
      );
      let ur = E(r, h.getBindGroupLayout(0), [C, W, z]);
      cr(
        X,
        h,
        ur,
        { x: 64, y: N },
        $
          ? { timestampWrites: { querySet: $, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let J = 0; J < A.length; J++) {
        let Y = A[J],
          Q = Math.min(Y + 64, a),
          er = Y / 64,
          fr = J === A.length - 1,
          wr = er * j,
          ir = E(r, y.getBindGroupLayout(0), [
            W,
            T,
            { buffer: q, offset: wr, size: 16 },
          ]);
        cr(
          X,
          y,
          ir,
          1,
          fr && $
            ? { timestampWrites: { querySet: $, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let gr = _ ? a - Q : Y;
        if (gr === 0) continue;
        let jr = E(r, v.getBindGroupLayout(0), [
            C,
            T,
            { buffer: U, offset: wr, size: 32 },
          ]),
          Lr = Math.min(gr, B);
        cr(X, v, jr, Lr);
      }
      let dr = Pr(r, X, $),
        ar = u ? null : k(r, X, T);
      I(r, X);
      let lr = await D(dr);
      if (u) return lr !== void 0 ? { gpuTimeMs: lr } : {};
      let Z = await G(ar, Float32Array);
      return lr !== void 0 ? { x: Z, gpuTimeMs: lr } : { x: Z };
    } finally {
      (!f && C && p(C),
        !u && T && p(T),
        W && p(W),
        q && p(q),
        U && p(U),
        z && p(z));
    }
  }
  async function qo(r, t, e, o, a, s, i, m, n, l, u = "row-major") {
    let f = n instanceof H;
    if (
      (P(r),
      L(r, "sger", { A: n, x: a, y: i }),
      u !== "row-major" && u !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(m) ||
      !Number.isInteger(l)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (s <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!f && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (f && l !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (f && (n.rows < t || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (f ? n.layout : u) === "column-major" &&
      (([t, e] = [e, t]), ([a, i] = [i, a]), ([s, m] = [m, s]));
    let c = a instanceof M,
      w = i instanceof M;
    if (l < e) throw new Error("lda must be >= n.");
    if (!c && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== w)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !f)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (f && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (f && c && n._buf === a._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (f && w && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (t < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (t === 0 || e === 0) return f ? {} : { A: n };
    if (!f && n.length < (t - 1) * l + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (a.length < (t - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (i.length < (e - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g = await S(r, "sger"),
      b = null,
      h = null,
      y = null,
      v = null;
    try {
      ((b = c ? a._buf : x(r, a, "sger-x", !1)),
        (h = w ? i._buf : x(r, i, "sger-y", !1)),
        (y = f ? n._buf : x(r, n, "sger-A", !0)),
        (v = R(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: s, type: "u32" },
            { value: m, type: "u32" },
            { value: l, type: "u32" },
          ],
          "sger-params",
        )));
      let _ = E(r, g.getBindGroupLayout(0), [b, h, y, v]),
        A = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: N, ts: B } = F(r, g, _, A),
        j = f ? null : k(r, N, y);
      I(r, N);
      let C = await D(B);
      if (f) return C !== void 0 ? { gpuTimeMs: C } : {};
      let T = await G(j, Float32Array);
      return C !== void 0 ? { A: T, gpuTimeMs: C } : { A: T };
    } finally {
      (!c && b && p(b), !w && h && p(h), !f && y && p(y), v && p(v));
    }
  }
  async function Oo(r, t, e, o, a, s, i, m, n = "row-major") {
    let l = a instanceof M,
      u = i instanceof H;
    if ((P(r), L(r, "ssyr", { A: i, x: a }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(s) || !Number.isInteger(m))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0) throw new Error("incx must be positive.");
    if (m < e) throw new Error("lda must be >= n.");
    if (!u && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!l && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (l && !u)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (u && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (u && l && i._buf === a._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (u && m !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (u && (i.rows < e || i.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return u ? {} : { A: i };
    if (!u && i.length < (e - 1) * m + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (a.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let d =
        (u ? i.layout : n) === "column-major" ? t === "upper" : t === "lower",
      c = await S(r, "ssyr"),
      w = null,
      g = null,
      b = null;
    try {
      ((w = l ? a._buf : x(r, a, "ssyr-x", !1)),
        (g = u ? i._buf : x(r, i, "ssyr-A", !0)),
        (b = R(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: s, type: "u32" },
            { value: m, type: "u32" },
            { value: d ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let h = E(r, c.getBindGroupLayout(0), [w, g, b]),
        y = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: _ } = F(r, c, h, y),
        A = u ? null : k(r, v, g);
      I(r, v);
      let N = await D(_);
      if (u) return N !== void 0 ? { gpuTimeMs: N } : {};
      let B = await G(A, Float32Array);
      return N !== void 0 ? { A: B, gpuTimeMs: N } : { A: B };
    } finally {
      (!l && w && p(w), !u && g && p(g), b && p(b));
    }
  }
  async function Ko(r, t, e, o, a, s, i, m, n, l, u = "row-major") {
    let f = a instanceof M,
      d = i instanceof M,
      c = n instanceof H;
    if (
      (P(r),
      L(r, "ssyr2", { A: n, x: a, y: i }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(m) ||
      !Number.isInteger(l)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (l < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!f && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!d && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (f !== d)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (f && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !f)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && f && n._buf === a._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && d && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (f && a._buf === i._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && l !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { A: n };
    if (!c && n.length < (e - 1) * l + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (a.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (e - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? n.layout : u) === "column-major" ? t === "upper" : t === "lower",
      b = await S(r, "ssyr2"),
      h = null,
      y = null,
      v = null,
      _ = null;
    try {
      ((h = f ? a._buf : x(r, a, "ssyr2-x", !1)),
        (y = d ? i._buf : x(r, i, "ssyr2-y", !1)),
        (v = c ? n._buf : x(r, n, "ssyr2-A", !0)),
        (_ = R(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: s, type: "u32" },
            { value: m, type: "u32" },
            { value: l, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let A = E(r, b.getBindGroupLayout(0), [h, y, v, _]),
        N = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: B, ts: j } = F(r, b, A, N),
        C = c ? null : k(r, B, v);
      I(r, B);
      let T = await D(j);
      if (c) return T !== void 0 ? { gpuTimeMs: T } : {};
      let W = await G(C, Float32Array);
      return T !== void 0 ? { A: W, gpuTimeMs: T } : { A: W };
    } finally {
      (!f && h && p(h), !d && y && p(y), !c && v && p(v), _ && p(_));
    }
  }
  async function Vo(r, t, e, o, a, s, i, m, n, l, u, f, d, c, w = "row-major") {
    let g = m instanceof H,
      b = l instanceof H,
      h = d instanceof H;
    if (
      (P(r),
      L(r, "sgemm", { A: m, B: l, C: d }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof f != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(f)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(f)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(s) ||
      !Number.isInteger(n) ||
      !Number.isInteger(u) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(m instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || b) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || u <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0 || a === 0) return h ? {} : { C: d };
    let y = g ? m.layout : w,
      v = b ? l.layout : w,
      _ = h ? d.layout : w,
      A = y === "column-major" ? s : o,
      N = y === "column-major" ? o : s,
      B = t === "no-transpose" ? A : N,
      j = t === "no-transpose" ? N : A;
    if (n < j)
      throw new Error(
        `lda must be >= ${y === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== m.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [Q, er] = t === "no-transpose" ? [o, s] : [s, o];
      if (m.rows < Q || m.cols < er)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (m.length < (B - 1) * n + j)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let C = v === "column-major" ? a : s,
      T = v === "column-major" ? s : a,
      W = e === "no-transpose" ? C : T,
      q = e === "no-transpose" ? T : C;
    if (u < q)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (u !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [Q, er] = e === "no-transpose" ? [s, a] : [a, s];
      if (l.rows < Q || l.cols < er)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (W - 1) * u + q)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let U = _ === "column-major" ? a : o,
      z = _ === "column-major" ? o : a;
    if (c < z)
      throw new Error(
        `ldc must be >= ${_ === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (c !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < o || d.cols < a)
        throw new Error("C is too small for the given m and n.");
    } else if (d.length < (U - 1) * c + z)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (y === "column-major" &&
      (t = t === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (([m, l] = [l, m]),
        ([g, b] = [b, g]),
        ([n, u] = [u, n]),
        ([t, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          t === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([o, a] = [a, o])));
    let O = Math.ceil(a / 64),
      rr = Math.ceil(o / 64),
      X = O * rr >= 36,
      $ = await S(r, X ? "sgemm_large" : "sgemm_small"),
      ur = g ? m._buf : x(r, m, "sgemm-A", !1),
      mr = b ? l._buf : x(r, l, "sgemm-B", !1),
      dr = h ? d._buf : x(r, d, "sgemm-C", !0),
      ar = t === "no-transpose",
      lr = e === "no-transpose",
      Z = ar && Ge(ur, n, o, s),
      J = Ge(mr, u, lr ? s : a, lr ? a : s),
      Y = R(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: s, type: "u32" },
          { value: i, type: "f32" },
          { value: f, type: "f32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: c, type: "u32" },
          { value: t === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: Z ? 1 : 0, type: "u32" },
          { value: J ? 1 : 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let Q = E(r, $.getBindGroupLayout(0), [
          ur,
          Ar(r, ur),
          mr,
          Ar(r, mr),
          dr,
          Y,
        ]),
        er = X
          ? { x: K(r, O, "sgemm", "x"), y: K(r, rr, "sgemm", "y") }
          : {
              x: K(r, Math.ceil(a / 32), "sgemm", "x"),
              y: K(r, Math.ceil(o / 32), "sgemm", "y"),
            },
        { commandEncoder: fr, ts: wr } = F(r, $, Q, er),
        ir = h ? null : k(r, fr, dr);
      I(r, fr);
      let sr = await D(wr);
      if (h) return sr !== void 0 ? { gpuTimeMs: sr } : {};
      let gr = await G(ir, Float32Array);
      return sr !== void 0 ? { C: gr, gpuTimeMs: sr } : { C: gr };
    } finally {
      (g || p(ur), b || p(mr), h || p(dr), p(Y));
    }
  }
  async function Ho(
    r,
    t,
    e,
    o,
    a,
    s,
    i,
    m,
    n,
    l,
    u,
    f,
    d,
    c,
    w,
    g = "row-major",
  ) {
    let b = n instanceof H,
      h = u instanceof H,
      y = c instanceof H;
    if (
      (P(r),
      L(r, "sgemmtr", { A: n, B: u, C: c }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof m != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(m)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("alpha must be finite.");
    if (typeof d != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(d)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(d)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(f) ||
      !Number.isInteger(w)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!b && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!y && !(c instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((b || h) && !y)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (y && (!b || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || s < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (l <= 0 || f <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || s === 0) return y ? {} : { C: c };
    let v = b ? n.layout : g,
      _ = h ? u.layout : g,
      A = y ? c.layout : g,
      N = v === "column-major" ? i : a,
      B = v === "column-major" ? a : i,
      j = e === "no-transpose" ? N : B,
      C = e === "no-transpose" ? B : N;
    if (l < C)
      throw new Error(
        `lda must be >= ${v === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (b) {
      if (l !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [Z, J] = e === "no-transpose" ? [a, i] : [i, a];
      if (n.rows < Z || n.cols < J)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (j - 1) * l + C)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let T = _ === "column-major" ? s : i,
      W = _ === "column-major" ? i : s,
      q = o === "no-transpose" ? T : W,
      U = o === "no-transpose" ? W : T;
    if (f < U)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (f !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [Z, J] = o === "no-transpose" ? [i, s] : [s, i];
      if (u.rows < Z || u.cols < J)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (u.length < (q - 1) * f + U)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let z = A === "column-major" ? s : a,
      O = A === "column-major" ? a : s;
    if (w < O)
      throw new Error(
        `ldc must be >= ${A === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (y) {
      if (w !== c.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (c.rows < a || c.cols < s)
        throw new Error("C is too small for the given m and n.");
    } else if (c.length < (z - 1) * w + O)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (v === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      A === "column-major" &&
        (([n, u] = [u, n]),
        ([b, h] = [h, b]),
        ([l, f] = [f, l]),
        ([e, o] = [
          o === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, s] = [s, a]),
        (t = t === "lower" ? "upper" : "lower")));
    let rr = Math.ceil(s / 64),
      X = Math.ceil(a / 64),
      $ = rr * X >= 36,
      ur = await S(r, $ ? "sgemmtr_large" : "sgemmtr_small"),
      mr = b ? n._buf : x(r, n, "sgemmtr-A", !1),
      dr = h ? u._buf : x(r, u, "sgemmtr-B", !1),
      ar = y ? c._buf : x(r, c, "sgemmtr-C", !0),
      lr = R(
        r,
        [
          { value: a, type: "u32" },
          { value: s, type: "u32" },
          { value: i, type: "u32" },
          { value: m, type: "f32" },
          { value: d, type: "f32" },
          { value: l, type: "u32" },
          { value: f, type: "u32" },
          { value: w, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: t === "upper" ? 1 : 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let Z = E(r, ur.getBindGroupLayout(0), [mr, dr, ar, lr]),
        J = $
          ? { x: K(r, rr, "sgemmtr", "x"), y: K(r, X, "sgemmtr", "y") }
          : {
              x: K(r, Math.ceil(s / 32), "sgemmtr", "x"),
              y: K(r, Math.ceil(a / 32), "sgemmtr", "y"),
            },
        { commandEncoder: Y, ts: Q } = F(r, ur, Z, J),
        er = y ? null : k(r, Y, ar);
      I(r, Y);
      let fr = await D(Q);
      if (y) return fr !== void 0 ? { gpuTimeMs: fr } : {};
      let wr = await G(er, Float32Array);
      return fr !== void 0 ? { C: wr, gpuTimeMs: fr } : { C: wr };
    } finally {
      (b || p(mr), h || p(dr), y || p(ar), p(lr));
    }
  }
  async function Uo(r, t, e, o, a, s, i, m, n, l, u, f = "row-major") {
    let d = i instanceof H,
      c = l instanceof H;
    if ((P(r), L(r, "ssyrk", { A: i, C: l }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (f !== "row-major" && f !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(m) ||
      !Number.isInteger(u)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!d && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (d && !c)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (c && !d)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("n and k must be non-negative.");
    if (m <= 0 || u <= 0) throw new Error("lda and ldc must be positive.");
    if (o === 0) return c ? {} : { C: l };
    let w = d ? i.layout : f,
      g = c ? l.layout : f,
      b = w === "column-major" ? a : o,
      h = w === "column-major" ? o : a,
      y = e === "no-transpose" ? b : h,
      v = e === "no-transpose" ? h : b;
    if (m < v)
      throw new Error(
        `lda must be >= ${w === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (d) {
      if (m !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [O, rr] = e === "no-transpose" ? [o, a] : [a, o];
      if (i.rows < O || i.cols < rr)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (y - 1) * m + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (u < o) throw new Error("ldc must be >= n.");
    if (c) {
      if (u !== l.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (l.rows < o || l.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (l.length < (o - 1) * u + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let _ = e;
    w === "column-major" &&
      (_ = _ === "no-transpose" ? "transpose" : "no-transpose");
    let A = _ === "no-transpose" ? "transpose" : "no-transpose",
      N = t;
    g === "column-major" &&
      (([_, A] = [
        A === "no-transpose" ? "transpose" : "no-transpose",
        _ === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (N = N === "lower" ? "upper" : "lower"));
    let B = Math.ceil(o / 64),
      j = Math.ceil(o / 64),
      C = B * j >= 36,
      T = await S(r, C ? "sgemmtr_large" : "sgemmtr_small"),
      W = d ? i._buf : x(r, i, "ssyrk-A", !1),
      q = c ? l._buf : x(r, l, "ssyrk-C", !0),
      U = d
        ? tr(r, W.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : x(r, i, "ssyrk-B", !1),
      z = R(
        r,
        [
          { value: o, type: "u32" },
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: s, type: "f32" },
          { value: n, type: "f32" },
          { value: m, type: "u32" },
          { value: m, type: "u32" },
          { value: u, type: "u32" },
          { value: _ === "transpose" ? 1 : 0, type: "u32" },
          { value: A === "transpose" ? 1 : 0, type: "u32" },
          { value: N === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let O = E(r, T.getBindGroupLayout(0), [W, U, q, z]),
        rr = C
          ? { x: K(r, B, "ssyrk", "x"), y: K(r, j, "ssyrk", "y") }
          : {
              x: K(r, Math.ceil(o / 32), "ssyrk", "x"),
              y: K(r, Math.ceil(o / 32), "ssyrk", "y"),
            },
        { commandEncoder: X, querySet: $, passDescriptor: ur } = Tr(r);
      (d && X.copyBufferToBuffer(W, 0, U, 0, W.size), cr(X, T, O, rr, ur));
      let mr = Pr(r, X, $),
        dr = c ? null : k(r, X, q);
      I(r, X);
      let ar = await D(mr);
      if (c) return ar !== void 0 ? { gpuTimeMs: ar } : {};
      let lr = await G(dr, Float32Array);
      return ar !== void 0 ? { C: lr, gpuTimeMs: ar } : { C: lr };
    } finally {
      (d || p(W), p(U), c || p(q), p(z));
    }
  }
  async function zo(r, t, e, o, a, s, i, m, n, l, u, f, d, c = "row-major") {
    let w = i instanceof H,
      g = n instanceof H,
      b = f instanceof H;
    if (
      (P(r),
      L(r, "ssyr2k", { A: i, B: n, C: f }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof u != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(u)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(m) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!w && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(f instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((w || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!w || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("n and k must be non-negative.");
    if (m <= 0 || l <= 0 || d <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0) return b ? {} : { C: f };
    let h = w ? i.layout : c,
      y = g ? n.layout : c,
      v = b ? f.layout : c,
      _ = h === "column-major" ? a : o,
      A = h === "column-major" ? o : a,
      N = e === "no-transpose" ? _ : A,
      B = e === "no-transpose" ? A : _;
    if (m < B)
      throw new Error(
        `lda must be >= ${h === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (m !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [Q, er] = e === "no-transpose" ? [o, a] : [a, o];
      if (i.rows < Q || i.cols < er)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (N - 1) * m + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let j = y === "column-major" ? a : o,
      C = y === "column-major" ? o : a,
      T = e === "no-transpose" ? j : C,
      W = e === "no-transpose" ? C : j;
    if (l < W)
      throw new Error(
        `ldb must be >= ${y === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (l !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [Q, er] = e === "no-transpose" ? [o, a] : [a, o];
      if (n.rows < Q || n.cols < er)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (T - 1) * l + W)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (d < o) throw new Error("ldc must be >= n.");
    if (b) {
      if (d !== f.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (f.rows < o || f.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (f.length < (o - 1) * d + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let q = e;
    h === "column-major" &&
      (q = q === "no-transpose" ? "transpose" : "no-transpose");
    let U = e;
    y === "column-major" &&
      (U = U === "no-transpose" ? "transpose" : "no-transpose");
    let z = v === "column-major" ? (t === "lower" ? "upper" : "lower") : t,
      O = (Q) => (Q === "no-transpose" ? "transpose" : "no-transpose");
    function rr(Q, er, fr, wr, ir, sr) {
      let gr = Q,
        jr = O(wr);
      return v !== "column-major"
        ? { transX: gr, X: er, ldX: fr, transY: jr, Y: ir, ldY: sr }
        : { transX: O(jr), X: ir, ldX: sr, transY: O(gr), Y: er, ldY: fr };
    }
    let X = Math.ceil(o / 64),
      $ = Math.ceil(o / 64),
      ur = X * $ >= 36,
      mr = await S(r, ur ? "sgemmtr_large" : "sgemmtr_small"),
      dr = ur
        ? { x: K(r, X, "ssyr2k", "x"), y: K(r, $, "ssyr2k", "y") }
        : {
            x: K(r, Math.ceil(o / 32), "ssyr2k", "x"),
            y: K(r, Math.ceil(o / 32), "ssyr2k", "y"),
          },
      ar = w ? i._buf : x(r, i, "ssyr2k-A", !1),
      lr = g ? n._buf : x(r, n, "ssyr2k-B", !1),
      Z = b ? f._buf : x(r, f, "ssyr2k-C", !0),
      J = null,
      Y = null;
    try {
      let Q = rr(q, ar, m, U, lr, l),
        er = rr(U, lr, l, q, ar, m),
        fr = (Rr, _r) =>
          R(
            r,
            [
              { value: o, type: "u32" },
              { value: o, type: "u32" },
              { value: a, type: "u32" },
              { value: s, type: "f32" },
              { value: _r, type: "f32" },
              { value: Rr.ldX, type: "u32" },
              { value: Rr.ldY, type: "u32" },
              { value: d, type: "u32" },
              { value: Rr.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: Rr.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: z === "upper" ? 1 : 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((J = fr(Q, u)), (Y = fr(er, 1)));
      let wr = E(r, mr.getBindGroupLayout(0), [Q.X, Q.Y, Z, J]),
        ir = E(r, mr.getBindGroupLayout(0), [er.X, er.Y, Z, Y]),
        { commandEncoder: sr, querySet: gr } = Tr(r),
        jr = gr
          ? { timestampWrites: { querySet: gr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Lr = gr
          ? { timestampWrites: { querySet: gr, endOfPassWriteIndex: 1 } }
          : void 0;
      (cr(sr, mr, wr, dr, jr), cr(sr, mr, ir, dr, Lr));
      let Cr = Pr(r, sr, gr),
        Gr = b ? null : k(r, sr, Z);
      I(r, sr);
      let yr = await D(Cr);
      if (b) return yr !== void 0 ? { gpuTimeMs: yr } : {};
      let br = await G(Gr, Float32Array);
      return yr !== void 0 ? { C: br, gpuTimeMs: yr } : { C: br };
    } finally {
      (w || p(ar), g || p(lr), b || p(Z), J && p(J), Y && p(Y));
    }
  }
  async function Yo(r, t, e, o, a, s, i, m, n, l, u, f, d, c = "row-major") {
    let w = i instanceof H,
      g = n instanceof H,
      b = f instanceof H;
    if (
      (P(r), L(r, "ssymm", { A: i, B: n, C: f }), t !== "left" && t !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof u != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(u)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(m) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!w && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(f instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((w || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!w || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || a === 0) return b ? {} : { C: f };
    let h = w ? i.layout : c,
      y = g ? n.layout : c,
      v = b ? f.layout : c,
      _ = t === "left" ? o : a;
    if (m < _)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (w) {
      if (m !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (i.rows < _ || i.cols < _)
        throw new Error("A is too small for the given m/n and side.");
    } else if (i.length < (_ - 1) * m + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = y === "column-major" ? a : o,
      N = y === "column-major" ? o : a;
    if (l < N)
      throw new Error(
        `ldb must be >= ${y === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (l !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < o || n.cols < a)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (A - 1) * l + N)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = v === "column-major" ? a : o,
      j = v === "column-major" ? o : a;
    if (d < j)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (d !== f.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (f.rows < o || f.cols < a)
        throw new Error("C is too small for the given m and n.");
    } else if (f.length < (B - 1) * d + j)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let C = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      T = y === "column-major" ? "transpose" : "no-transpose",
      W = "no-transpose",
      q = o,
      U = a,
      z = _,
      O = t === "left" ? W : T,
      rr = t === "left" ? T : W,
      X = (sr) => (sr === "no-transpose" ? "transpose" : "no-transpose"),
      $ = t === "right";
    v === "column-major" &&
      (([O, rr] = [X(rr), X(O)]), ($ = !$), ([q, U] = [U, q]));
    let ur = _,
      mr = Math.ceil(U / 64),
      dr = Math.ceil(q / 64),
      ar = mr * dr >= 36,
      lr = await S(r, ar ? "sgemm_large" : "sgemm_small"),
      Z = await S(r, "symmetrize"),
      J = ar
        ? { x: K(r, mr, "ssymm", "x"), y: K(r, dr, "ssymm", "y") }
        : {
            x: K(r, Math.ceil(U / 32), "ssymm", "x"),
            y: K(r, Math.ceil(q / 32), "ssymm", "y"),
          },
      Y = w ? i._buf : x(r, i, "ssymm-A", !1),
      Q = g ? n._buf : x(r, n, "ssymm-B", !1),
      er = b ? f._buf : x(r, f, "ssymm-C", !0),
      fr = tr(r, _ * ur * 4, "ssymm-Adense"),
      wr = null,
      ir = null;
    try {
      wr = R(
        r,
        [
          { value: _, type: "u32" },
          { value: m, type: "u32" },
          { value: ur, type: "u32" },
          { value: C === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let sr = E(r, Z.getBindGroupLayout(0), [Y, fr, wr]),
        gr = $ ? Q : fr,
        jr = $ ? l : ur,
        Lr = $ ? fr : Q;
      ir = R(
        r,
        [
          { value: q, type: "u32" },
          { value: U, type: "u32" },
          { value: z, type: "u32" },
          { value: s, type: "f32" },
          { value: u, type: "f32" },
          { value: jr, type: "u32" },
          { value: $ ? ur : l, type: "u32" },
          { value: d, type: "u32" },
          { value: O === "transpose" ? 1 : 0, type: "u32" },
          { value: rr === "transpose" ? 1 : 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let Gr = E(r, lr.getBindGroupLayout(0), [
          gr,
          Ar(r, gr),
          Lr,
          Ar(r, Lr),
          er,
          ir,
        ]),
        { commandEncoder: yr, querySet: br } = Tr(r),
        Rr = br
          ? { timestampWrites: { querySet: br, beginningOfPassWriteIndex: 0 } }
          : void 0,
        _r = br
          ? { timestampWrites: { querySet: br, endOfPassWriteIndex: 1 } }
          : void 0;
      (cr(yr, Z, sr, { x: Math.ceil(_ / 8), y: Math.ceil(_ / 8) }, Rr),
        cr(yr, lr, Gr, J, _r));
      let Fr = Pr(r, yr, br),
        Kr = b ? null : k(r, yr, er);
      I(r, yr);
      let Hr = await D(Fr);
      if (b) return Hr !== void 0 ? { gpuTimeMs: Hr } : {};
      let me = await G(Kr, Float32Array);
      return Hr !== void 0 ? { C: me, gpuTimeMs: Hr } : { C: me };
    } finally {
      (w || p(Y), g || p(Q), b || p(er), p(fr), wr && p(wr), ir && p(ir));
    }
  }
  async function Xo(r, t, e, o, a, s, i, m, n, l, u, f, d = "row-major") {
    let c = n instanceof H,
      w = u instanceof H,
      g = a === "unit";
    if ((P(r), L(r, "strmm", { A: n, B: u }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof m != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(m)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(f)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== w)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (s < 0 || i < 0) throw new Error("m and n must be non-negative.");
    if (s === 0 || i === 0) return w ? {} : { B: u };
    let b = c ? n.layout : d,
      h = w ? u.layout : d,
      y = t === "left" ? s : i;
    if (l < y)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (l !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < y || n.cols < y)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (y - 1) * l + y)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = h === "column-major" ? i : s,
      _ = h === "column-major" ? s : i;
    if (f < _)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < s || u.cols < i)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (v - 1) * f + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      N =
        b === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      B = h === "column-major" ? "transpose" : "no-transpose",
      j = "no-transpose",
      C = s,
      T = i,
      W = y,
      q = t === "left" ? j : B,
      U = t === "left" ? B : j,
      z = (wr) => (wr === "no-transpose" ? "transpose" : "no-transpose"),
      O = t === "right";
    h === "column-major" &&
      (([q, U] = [z(U), z(q)]), (O = !O), ([C, T] = [T, C]));
    let rr = y,
      X = Math.ceil(T / 64),
      $ = Math.ceil(C / 64),
      ur = X * $ >= 36,
      mr = await S(r, ur ? "sgemm_large" : "sgemm_small"),
      dr = await S(r, "triangularize"),
      ar = ur
        ? { x: K(r, X, "strmm", "x"), y: K(r, $, "strmm", "y") }
        : {
            x: K(r, Math.ceil(T / 32), "strmm", "x"),
            y: K(r, Math.ceil(C / 32), "strmm", "y"),
          },
      lr = null,
      Z = null,
      J = null,
      Y = null,
      Q = null,
      er = null,
      fr = !1;
    try {
      ((lr = c ? n._buf : x(r, n, "strmm-A", !1)),
        (Z = w ? u._buf : x(r, u, "strmm-B", !0)),
        (J = tr(r, y * rr * 4, "strmm-Adense")),
        (Y = tr(
          r,
          v * f * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (Q = R(
          r,
          [
            { value: y, type: "u32" },
            { value: l, type: "u32" },
            { value: rr, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: N === "transpose" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let wr = E(r, dr.getBindGroupLayout(0), [lr, J, Q]),
        ir = O ? Z : J,
        sr = O ? f : rr,
        gr = O ? J : Z;
      er = R(
        r,
        [
          { value: C, type: "u32" },
          { value: T, type: "u32" },
          { value: W, type: "u32" },
          { value: m, type: "f32" },
          { value: 0, type: "f32" },
          { value: sr, type: "u32" },
          { value: O ? rr : f, type: "u32" },
          { value: f, type: "u32" },
          { value: q === "transpose" ? 1 : 0, type: "u32" },
          { value: U === "transpose" ? 1 : 0, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let Lr = E(r, mr.getBindGroupLayout(0), [
          ir,
          Ar(r, ir),
          gr,
          Ar(r, gr),
          Y,
          er,
        ]),
        { commandEncoder: Cr, querySet: Gr } = Tr(r);
      Cr.copyBufferToBuffer(Z, 0, Y, 0, Math.min(Z.size, Y.size));
      let yr = Gr
          ? { timestampWrites: { querySet: Gr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        br = Gr
          ? { timestampWrites: { querySet: Gr, endOfPassWriteIndex: 1 } }
          : void 0;
      (cr(Cr, dr, wr, { x: Math.ceil(y / 8), y: Math.ceil(y / 8) }, yr),
        cr(Cr, mr, Lr, ar, br));
      let Rr = Pr(r, Cr, Gr),
        _r = w ? null : k(r, Cr, Y);
      I(r, Cr);
      let Fr = await D(Rr);
      if (w)
        return (
          p(u._buf),
          (u._buf = Y),
          (fr = !0),
          Fr !== void 0 ? { gpuTimeMs: Fr } : {}
        );
      let Kr = await G(_r, Float32Array);
      return Fr !== void 0 ? { B: Kr, gpuTimeMs: Fr } : { B: Kr };
    } finally {
      (!c && lr && p(lr),
        !w && Z && p(Z),
        J && p(J),
        Y && !fr && p(Y),
        Q && p(Q),
        er && p(er));
    }
  }
  async function $o(r, t, e, o, a, s, i, m, n, l, u, f, d = "row-major") {
    let c = n instanceof H,
      w = u instanceof H,
      g = a === "unit";
    if ((P(r), L(r, "strsm", { A: n, B: u }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof m != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(m)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(f)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== w)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (s < 0 || i < 0) throw new Error("m and n must be non-negative.");
    if (s === 0 || i === 0) return w ? {} : { B: u };
    let b = c ? n.layout : d,
      h = w ? u.layout : d,
      y = t === "left" ? s : i;
    if (l < y)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (l !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < y || n.cols < y)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (y - 1) * l + y)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = h === "column-major" ? i : s,
      _ = h === "column-major" ? s : i;
    if (f < _)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < s || u.cols < i)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (v - 1) * f + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      N =
        b === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      B = t === "left" ? i : s,
      j = t === "left",
      C = (N === "no-transpose") == (A === "lower"),
      T = t === "left" ? C : !C,
      W = [];
    for (let Z = 0; Z < y; Z += 64) W.push(Z);
    T || W.reverse();
    let q = W.length,
      U = await S(r, "strsv_invert_block"),
      z = await S(r, "block_transfer"),
      O = await S(r, "sscal"),
      rr = null,
      X = null,
      $ = null,
      ur = [],
      mr = [];
    function dr(Z, J) {
      let Y = tr(r, Z, J);
      return (mr.push(Y), Y);
    }
    function ar(Z, J) {
      let Y = R(r, Z, J);
      return (ur.push(Y), Y);
    }
    let lr = (v - 1) * f + _;
    try {
      ((rr = c ? n._buf : x(r, n, "strsm-A", !1)),
        (X = w ? u._buf : x(r, u, "strsm-B", !0)),
        ($ = tr(r, q * 64 * 64 * 4, "strsm-Ainv")));
      let Z = null;
      if (m !== 1 && m !== 0) {
        let Gr = ar(
          [
            { value: lr, type: "u32" },
            { value: m, type: "f32" },
            { value: 1, type: "u32" },
          ],
          "strsm-scale-params",
        );
        Z = E(r, O.getBindGroupLayout(0), [X, Gr]);
      }
      let J = ar(
          [
            { value: y, type: "u32" },
            { value: l, type: "u32" },
            { value: N === "transpose" ? 1 : 0, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strsm-invert-params",
        ),
        Y = E(r, U.getBindGroupLayout(0), [rr, $, J]),
        Q = dr(64 * B * 4, "strsm-Bblock"),
        er = dr(64 * B * 4, "strsm-Xblock"),
        fr = dr(y * 64 * 4, "strsm-Aoff"),
        wr = dr(y * B * 4, "strsm-delta"),
        { commandEncoder: ir, querySet: sr } = Tr(r);
      if (m === 0) {
        let Gr = Math.ceil(_ / 64),
          yr = Math.ceil(v / 64),
          br = Gr * yr >= 36,
          Rr = await S(r, br ? "sgemm_large" : "sgemm_small"),
          _r = ar(
            [
              { value: v, type: "u32" },
              { value: _, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "f32" },
              { value: 0, type: "f32" },
              { value: 1, type: "u32" },
              { value: 1, type: "u32" },
              { value: f, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "strsm-zero-params",
          ),
          Fr = E(r, Rr.getBindGroupLayout(0), [
            $,
            Ar(r, $),
            $,
            Ar(r, $),
            X,
            _r,
          ]),
          Kr = br
            ? { x: K(r, Gr, "strsm", "x"), y: K(r, yr, "strsm", "y") }
            : {
                x: K(r, Math.ceil(_ / 32), "strsm", "x"),
                y: K(r, Math.ceil(v / 32), "strsm", "y"),
              };
        cr(
          ir,
          Rr,
          Fr,
          Kr,
          sr
            ? {
                timestampWrites: {
                  querySet: sr,
                  beginningOfPassWriteIndex: 0,
                  endOfPassWriteIndex: 1,
                },
              }
            : void 0,
        );
      } else {
        (Z && cr(ir, O, Z, vr(r, lr)),
          cr(
            ir,
            U,
            Y,
            { x: 64, y: q },
            sr
              ? {
                  timestampWrites: {
                    querySet: sr,
                    beginningOfPassWriteIndex: 0,
                  },
                }
              : void 0,
          ));
        for (let yr = 0; yr < W.length; yr++) {
          let br = W[yr],
            Rr = Math.min(br + 64, y),
            _r = Rr - br,
            Fr = br / 64,
            Kr = yr === W.length - 1,
            Hr = ar(
              [
                { value: br, type: "u32" },
                { value: _r, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: f, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: j ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-B-params",
            ),
            me = E(r, z.getBindGroupLayout(0), [Q, X, Hr]);
          cr(ir, z, me, Yr(r, "strsm", _r, B));
          {
            let Ur = _r,
              zr = B,
              ve = _r,
              te = Math.ceil(zr / 64),
              oe = Math.ceil(Ur / 64),
              ae = te * oe >= 36,
              se = await S(r, ae ? "sgemm_large" : "sgemm_small"),
              _e = ar(
                [
                  { value: Ur, type: "u32" },
                  { value: zr, type: "u32" },
                  { value: ve, type: "u32" },
                  { value: 1, type: "f32" },
                  { value: 0, type: "f32" },
                  { value: 64, type: "u32" },
                  { value: B, type: "u32" },
                  { value: B, type: "u32" },
                  { value: t === "right" ? 1 : 0, type: "u32" },
                  { value: 0, type: "u32" },
                ],
                "strsm-apply-params",
              ),
              ce = { buffer: $, offset: Fr * 64 * 64 * 4, size: 4096 * 4 },
              Be = E(r, se.getBindGroupLayout(0), [
                ce,
                Ar(r, ce),
                Q,
                Ar(r, Q),
                er,
                _e,
              ]),
              sa = ae
                ? { x: K(r, te, "strsm", "x"), y: K(r, oe, "strsm", "y") }
                : {
                    x: K(r, Math.ceil(zr / 32), "strsm", "x"),
                    y: K(r, Math.ceil(Ur / 32), "strsm", "y"),
                  };
            cr(ir, se, Be, sa);
          }
          let fe = T ? Rr : 0,
            Re = T ? y : br,
            Pe = fe < Re,
            Zo = ar(
              [
                { value: br, type: "u32" },
                { value: _r, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: f, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: j ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            ),
            Qo = E(r, z.getBindGroupLayout(0), [er, X, Zo]),
            Jo =
              Kr && !Pe && sr
                ? { timestampWrites: { querySet: sr, endOfPassWriteIndex: 1 } }
                : void 0;
          if ((cr(ir, z, Qo, Yr(r, "strsm", _r, B), Jo), !Pe)) continue;
          let ee = Re - fe,
            ra = ar(
              [
                { value: fe, type: "u32" },
                { value: ee, type: "u32" },
                { value: br, type: "u32" },
                { value: _r, type: "u32" },
                { value: l, type: "u32" },
                { value: N === "transpose" ? 1 : 0, type: "u32" },
                { value: j ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-A-params",
            ),
            ea = E(r, z.getBindGroupLayout(0), [fr, rr, ra]);
          cr(ir, z, ea, Yr(r, "strsm", ee, _r));
          {
            let Ur = ee,
              zr = B,
              ve = _r,
              te = Math.ceil(zr / 64),
              oe = Math.ceil(Ur / 64),
              ae = te * oe >= 36,
              se = await S(r, ae ? "sgemm_large" : "sgemm_small"),
              _e = ar(
                [
                  { value: Ur, type: "u32" },
                  { value: zr, type: "u32" },
                  { value: ve, type: "u32" },
                  { value: 1, type: "f32" },
                  { value: 0, type: "f32" },
                  { value: _r, type: "u32" },
                  { value: B, type: "u32" },
                  { value: B, type: "u32" },
                  { value: 0, type: "u32" },
                  { value: 0, type: "u32" },
                ],
                "strsm-update-params",
              ),
              ce = E(r, se.getBindGroupLayout(0), [
                fr,
                Ar(r, fr),
                er,
                Ar(r, er),
                wr,
                _e,
              ]),
              Be = ae
                ? { x: K(r, te, "strsm", "x"), y: K(r, oe, "strsm", "y") }
                : {
                    x: K(r, Math.ceil(zr / 32), "strsm", "x"),
                    y: K(r, Math.ceil(Ur / 32), "strsm", "y"),
                  };
            cr(ir, se, ce, Be);
          }
          let ta = ar(
              [
                { value: fe, type: "u32" },
                { value: ee, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: f, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: j ? 1 : 0, type: "u32" },
                { value: 1, type: "u32" },
              ],
              "strsm-scatter-sub-params",
            ),
            oa = E(r, z.getBindGroupLayout(0), [wr, X, ta]),
            aa =
              Kr && sr
                ? { timestampWrites: { querySet: sr, endOfPassWriteIndex: 1 } }
                : void 0;
          cr(ir, z, oa, Yr(r, "strsm", ee, B), aa);
        }
      }
      let gr = Pr(r, ir, sr),
        jr = w ? null : k(r, ir, X);
      I(r, ir);
      let Lr = await D(gr);
      if (w) return Lr !== void 0 ? { gpuTimeMs: Lr } : {};
      let Cr = await G(jr, Float32Array);
      return Lr !== void 0 ? { B: Cr, gpuTimeMs: Lr } : { B: Cr };
    } finally {
      (!c && rr && p(rr), !w && X && p(X), $ && p($), p(mr), p(ur));
    }
  }
  return fa(ns);
})();
