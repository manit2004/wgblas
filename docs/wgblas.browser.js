var wgblas = (() => {
  var oi = Object.create;
  var pe = Object.defineProperty;
  var ai = Object.getOwnPropertyDescriptor;
  var ii = Object.getOwnPropertyNames;
  var si = Object.getPrototypeOf,
    ni = Object.prototype.hasOwnProperty;
  var we = ((r) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
        ? new Proxy(r, {
            get: (o, e) => (typeof require < "u" ? require : o)[e],
          })
        : r)(function (r) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + r + '" is not supported');
  });
  var Z = (r, o, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (o = r((r = 0))), o);
    } catch (a) {
      throw ((e = [a]), a);
    }
  };
  var Fe = (r, o) => {
      for (var e in o) pe(r, e, { get: o[e], enumerable: !0 });
    },
    qe = (r, o, e, a) => {
      if ((o && typeof o == "object") || typeof o == "function")
        for (let t of ii(o))
          !ni.call(r, t) &&
            t !== e &&
            pe(r, t, {
              get: () => o[t],
              enumerable: !(a = ai(o, t)) || a.enumerable,
            });
      return r;
    };
  var ge = (r, o, e) => (
      (e = r != null ? oi(si(r)) : {}),
      qe(
        o || !r || !r.__esModule
          ? pe(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    li = (r) => qe(pe({}, "__esModule", { value: !0 }), r);
  var ke,
    $e = Z(() => {
      ke = `// sscal: x = alpha * x

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
  var Qe,
    Je = Z(() => {
      Qe = `// cscal: x := alpha * x, complex. x is one interleaved f32 array
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
  var et,
    rt = Z(() => {
      et = `// sswap: x <-> y

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
  var ot,
    tt = Z(() => {
      ot = `// dswap: x <-> y, double-double (Dekker) f64 emulation of sswap. A swap is
// pure data movement \u2014 hi and lo are exchanged verbatim, with no arithmetic
// at all \u2014 so (unlike dscal/daxpy/ddot) this needs no
// ddMulProtected/ddAddProtected renormalizing barrier, and so no
// ragged-tail-with-barrier split; a plain grid-stride loop is safe, same
// shape as sswap.wgsl itself.

@group(0) @binding(0) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(1) var<storage, read_write> xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    let tempHi = xHi[ix];
    let tempLo = xLo[ix];
    xHi[ix] = yHi[iy];
    xLo[ix] = yLo[iy];
    yHi[iy] = tempHi;
    yLo[iy] = tempLo;
  }
}
`;
    });
  var it,
    at = Z(() => {
      it = `// saxpy: y = alpha * x + y

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
  var nt,
    st = Z(() => {
      nt = `// scopy: y = x

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
  var ut,
    lt = Z(() => {
      ut = `// dcopy: y = x, double-double (Dekker) f64 emulation of scopy. A copy is
// pure data movement \u2014 hi and lo are transferred verbatim, with no
// arithmetic at all \u2014 so (unlike dscal/daxpy/ddot) this needs no
// ddMulProtected/ddAddProtected renormalizing barrier, and so no
// ragged-tail-with-barrier split; a plain grid-stride loop is safe, same
// shape as scopy.wgsl itself.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    yHi[iy] = xHi[ix];
    yLo[iy] = xLo[ix];
  }
}
`;
    });
  var ft,
    dt = Z(() => {
      ft = `// sdot: result = sum(x[i] * y[i])
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
  var De,
    mt = Z(() => {
      De = `// sum reduction: collapses 2*WGS partials into one scalar.
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
  var pt,
    ct = Z(() => {
      pt = `// sasum: result = sum(|x[i]|)
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
  var gt,
    wt = Z(() => {
      gt = `// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
  var bt,
    ht = Z(() => {
      bt = `// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
  var xt,
    yt = Z(() => {
      xt = `// isamax: returns index of element with largest absolute value
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
  var _t,
    vt = Z(() => {
      _t = `// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
  var Pr,
    Bt = Z(() => {
      Pr = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
  var ye,
    At = Z(() => {
      ye = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var Ir,
    St = Z(() => {
      Ir = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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

// Double-double subtraction \u2014 a - b, via exact negation (a sign-bit flip,
// no rounding) then ddAddProtected. Same protection contract.
fn ddSubProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  return ddAddProtected(a, DD(negf(b.hi), negf(b.lo)), threadSlot);
}
`;
    });
  var Et,
    Gt = Z(() => {
      Et = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
  var Le,
    kt = Z(() => {
      Le = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
  var Cr,
    Dt = Z(() => {
      Cr = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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

// A third compiler bug (Intel Mesa ANV, via NIR dump): raw.hi never gets
// materialized as one rounded value \u2014 the driver re-fuses a.hi*b.hi with
// ffma at every use site instead, breaking the a+b == s+e identity
// TwoSum-style algorithms depend on. Same fix as ddMulRaw's p.lo: force it
// through workgroup memory + a barrier. (Verified: max forward-error factor
// over 20000 trials dropped from >1e5 to ~3-4, Intel Mesa Iris Xe + NVIDIA GTX 1650.)
fn ddMulProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let raw = ddMulRaw(a, b, threadSlot);
  dekkerScratch[threadSlot] = raw.hi;
  workgroupBarrier();
  let rawHi = dekkerScratch[threadSlot];
  return fastTwoSumProtected(rawHi, raw.lo, threadSlot);
}
`;
    });
  var Pt,
    Lt = Z(() => {
      Pt = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
  var Mt,
    Nt = Z(() => {
      Mt = `// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
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
  var Rt,
    It = Z(() => {
      Rt = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
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
  var Pe,
    jt = Z(() => {
      Pe = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var qt,
    Ft = Z(() => {
      qt = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var Tt,
    Ht = Z(() => {
      Tt = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
  var Wt,
    Ct = Z(() => {
      Wt = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
  var Ot,
    Vt = Z(() => {
      Ot = `// srot: x = c*x + s*y,  y = -s*x + c*y

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
  var Ut,
    Kt = Z(() => {
      Ut = `// drot: x = c*x + s*y, y = -s*x + c*y \u2014 double-double (Dekker) f64 emulation
// of srot. c, s, x, and y are each split into an f32 (hi, lo) pair. Each
// element costs four ddMulProtected (c*x, s*y, -s*x, c*y) then two
// ddAddProtected (the two sums) \u2014 negS is computed once outside the loop
// via bitcast negation (exact, no rounding, so no barrier needed there)
// rather than adding a DD-subtract helper. See dscal.wgsl for why this is a
// uniform main pass plus a ragged, select-masked tail rather than a plain
// \`id < params.n\` grid-stride loop.

@group(0) @binding(0) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(1) var<storage, read_write> xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;
@group(0) @binding(4) var<uniform> params: Params;

struct Params {
  n:     u32,
  cHi:   f32,
  cLo:   f32,
  sHi:   f32,
  sLo:   f32,
  x_inc: u32,
  y_inc: u32,
}

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn drot_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let c = DD(params.cHi, params.cLo);
  let s = DD(params.sHi, params.sLo);
  let negS = DD(negf(params.sHi), negf(params.sLo));
  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    let xi = DD(xHi[ix], xLo[ix]);
    let yi = DD(yHi[iy], yLo[iy]);
    let xNew = ddAddProtected(ddMulProtected(c, xi, lid.x), ddMulProtected(s, yi, lid.x), lid.x);
    let yNew = ddAddProtected(ddMulProtected(negS, xi, lid.x), ddMulProtected(c, yi, lid.x), lid.x);
    xHi[ix] = xNew.hi;
    xLo[ix] = xNew.lo;
    yHi[iy] = yNew.hi;
    yLo[iy] = yNew.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) \u2014 pad to this workgroup's worst
  // case so every thread in the workgroup still calls ddMulProtected/
  // ddAddProtected the same number of times (their barriers need that),
  // masking only the write.
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
    let xi = DD(xHi[ix], xLo[ix]);
    let yi = DD(yHi[iy], yLo[iy]);
    let xNew = ddAddProtected(ddMulProtected(c, xi, lid.x), ddMulProtected(s, yi, lid.x), lid.x);
    let yNew = ddAddProtected(ddMulProtected(negS, xi, lid.x), ddMulProtected(c, yi, lid.x), lid.x);
    if (valid) {
      xHi[ix] = xNew.hi;
      xLo[ix] = xNew.lo;
      yHi[iy] = yNew.hi;
      yLo[iy] = yNew.lo;
    }
  }
}
`;
    });
  var Yt,
    zt = Z(() => {
      Yt = `// srotm: applies modified Givens rotation H to vectors x and y.
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
  var Xt,
    Zt = Z(() => {
      Xt = `// drotm: applies a modified Givens rotation H to vectors x and y \u2014 double-
// double (Dekker) f64 emulation of srotm. paramHi/paramLo[0] = flag: -1
// (full H), 0 (unit diagonal), 1 (unit off-diagonal). param = [ flag, h11,
// h21, h12, h22 ], each entry an f32 (hi, lo) pair.
// flag == -2 (identity/no-op) is handled in JS before dispatch reaches here.
//
// h11/h12/h21/h22 are resolved once, outside the loop, from the (uniform
// across every thread) flag \u2014 same shape as srot's c/s, so no barrier is
// needed for that selection itself. Each element then costs four
// ddMulProtected + two ddAddProtected, same as drot.

@group(0) @binding(0) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(1) var<storage, read_write> xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo: array<f32>;
@group(0) @binding(4) var<storage, read> paramHi: array<f32>;
@group(0) @binding(5) var<storage, read> paramLo: array<f32>;
@group(0) @binding(6) var<uniform> params: Params;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

const WGS: u32 = 64;
const ONE: DD = DD(1.0, 0.0);
const NEG_ONE: DD = DD(-1.0, 0.0);

@compute @workgroup_size(64)
fn drotm_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let flag = paramHi[0]; // exact small integer (-1, 0, or 1) \u2014 lo is always 0

  var h11: DD; var h12: DD;
  var h21: DD; var h22: DD;

  if (flag == -1.0) {
    // full 2x2 matrix
    h11 = DD(paramHi[1], paramLo[1]); h21 = DD(paramHi[2], paramLo[2]);
    h12 = DD(paramHi[3], paramLo[3]); h22 = DD(paramHi[4], paramLo[4]);
  } else if (flag == 0.0) {
    // diagonal fixed at 1
    h11 = ONE;                        h21 = DD(paramHi[2], paramLo[2]);
    h12 = DD(paramHi[3], paramLo[3]); h22 = ONE;
  } else {
    // flag == 1.0: off-diagonal fixed at +1 / -1
    h11 = DD(paramHi[1], paramLo[1]); h21 = NEG_ONE;
    h12 = ONE;                        h22 = DD(paramHi[4], paramLo[4]);
  }

  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let ix = id * params.x_inc;
    let iy = id * params.y_inc;
    let xi = DD(xHi[ix], xLo[ix]);
    let yi = DD(yHi[iy], yLo[iy]);
    let xNew = ddAddProtected(ddMulProtected(h11, xi, lid.x), ddMulProtected(h12, yi, lid.x), lid.x);
    let yNew = ddAddProtected(ddMulProtected(h21, xi, lid.x), ddMulProtected(h22, yi, lid.x), lid.x);
    xHi[ix] = xNew.hi;
    xLo[ix] = xNew.lo;
    yHi[iy] = yNew.hi;
    yLo[iy] = yNew.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) \u2014 pad to this workgroup's worst
  // case so every thread in the workgroup still calls ddMulProtected/
  // ddAddProtected the same number of times (their barriers need that),
  // masking only the write.
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
    let xi = DD(xHi[ix], xLo[ix]);
    let yi = DD(yHi[iy], yLo[iy]);
    let xNew = ddAddProtected(ddMulProtected(h11, xi, lid.x), ddMulProtected(h12, yi, lid.x), lid.x);
    let yNew = ddAddProtected(ddMulProtected(h21, xi, lid.x), ddMulProtected(h22, yi, lid.x), lid.x);
    if (valid) {
      xHi[ix] = xNew.hi;
      xLo[ix] = xNew.lo;
      yHi[iy] = yNew.hi;
      yLo[iy] = yNew.lo;
    }
  }
}
`;
    });
  var Ne,
    $t = Z(() => {
      Ne = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
// f64/utils/add.wgsl (ddSubProtected/ddAddProtected/negf) and
// f64/utils/multiply.wgsl (ddMulProtected).
//
// Verified empirically on real hardware (NVIDIA GTX 1650 + Intel Mesa
// integrated GPU, ~8000 random trials each plus explicit edge cases): no
// compiler-reassociation-style corruption of the kind that broke twoSum/
// twoProd (see add.wgsl's/multiply.wgsl's own headers) \u2014 every failure
// found was a genuine algorithm gap, not a driver miscompile, and both are
// fixed below (the b.hi==0.0 guard). One real, expected-shape difference
// from every other protected op here: the low-power backend's observed
// forward-error factor for this op specifically runs noticeably higher
// (~7-14000x eps, vs ~3-9x on high-performance) than ddSqrtProtected's
// (~3-4x on both) \u2014 division inherently amplifies input imprecision more
// than a sum/product does, so a real routine built on this needs its own
// backend-calibrated threshold, same as every other f64 arithmetic routine
// in this codebase (see e.g. tests/drot/src/test.drot.js's THRESHOLDS).
//
// One Newton-style long-division refinement (Bailey/QD-style): q1 = a.hi /
// b.hi is a plain f32 quotient, accurate to ~24 bits. Computing the residual
// a - q1*b in DD arithmetic (not f32) recovers the bits q1 lost, and a
// second plain division of that residual resolves them into a correction
// term \u2014 combining q1 + q2 gives roughly double a lone f32 divide's
// precision, matching this scheme's ~48-bit double-double target (already
// short of real f64's 52 bits, so a second refinement step would chase
// precision this representation has no room for).
// b.hi == 0.0 makes q1 = a.hi/0.0 already the IEEE-754-correct answer
// (\xB1Infinity, or NaN for 0/0) via plain float division, but the refinement
// below would corrupt it: p1 = q1*b multiplies that Infinity by a zero
// divisor, and Infinity*0 is NaN by definition, poisoning everything after.
// Substituting a safe non-zero denominator via select() \u2014 rather than
// branching/returning early \u2014 keeps every thread calling ddMulProtected/
// ddSubProtected/ddAddProtected unconditionally, which their internal
// workgroupBarrier() requires; only the final result is selected between
// the refined value and q1's own already-correct answer.
fn ddDivProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let bIsZero = b.hi == 0.0;
  let q1 = a.hi / b.hi;
  let safeB = DD(select(b.hi, 1.0, bIsZero), select(b.lo, 0.0, bIsZero));
  let p1 = ddMulProtected(DD(q1, 0.0), safeB, threadSlot);
  let r1 = ddSubProtected(a, p1, threadSlot);
  let q2 = r1.hi / safeB.hi;
  let refined = ddAddProtected(DD(q1, 0.0), DD(q2, 0.0), threadSlot);
  return DD(select(refined.hi, q1, bIsZero), select(refined.lo, 0.0, bIsZero));
}
`;
    });
  var Qt,
    Jt = Z(() => {
      Qt = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
// f64/utils/add.wgsl (ddSubProtected/ddAddProtected) and
// f64/utils/multiply.wgsl (twoProdBit \u2014 squaring a plain f32 needs no
// barrier, per multiply.wgsl's own note that twoProdBit is universally safe
// unprotected).
//
// Verified empirically on real hardware (NVIDIA GTX 1650 + Intel Mesa
// integrated GPU, ~8000 random trials each plus explicit edge cases): no
// compiler-reassociation-style corruption of the kind that broke twoSum/
// twoProd (see add.wgsl's/multiply.wgsl's own headers) \u2014 every failure
// found was a genuine algorithm gap (the a.hi==0.0 case below), not a
// driver miscompile, and is fixed. Observed forward-error factor against a
// true f64 reference stayed ~3-4x eps on both backends across every random
// trial \u2014 noticeably tighter than ddDivProtected's own low-power spread
// (see divide.wgsl's header), since sqrt has no denominator to be unlucky
// about.
//
// One Newton refinement step (the classic extended-precision sqrt trick):
// x0 = sqrt(a.hi) is a plain f32 approximation; the residual a - x0^2,
// computed in DD arithmetic, recovers what x0 lost, and linearizing sqrt
// around x0 (dividing that residual by 2*x0) gives a correction term
// roughly doubling the precision \u2014 same ~48-bit target as ddDivProtected,
// so one step is enough.
//
// Undefined for a.hi < 0.0, same as plain sqrt() \u2014 callers must guard
// themselves; this never checks.
//
// a.hi == 0.0 (a genuinely zero input, not an underflowed one \u2014 zero is
// exactly representable in f32, unlike this scheme's real range limits;
// see splitDoubleDouble's own doc comment) makes x0 = sqrt(0) = 0, and the
// correction step would divide by 2*x0 = 0. Substituting a safe non-zero
// denominator via select() \u2014 rather than branching/returning early \u2014 keeps
// every thread calling ddSubProtected/ddAddProtected unconditionally, which
// their internal workgroupBarrier() requires; only the final result is
// selected between the computed value and the exact DD(0,0) answer.
fn ddSqrtProtected(a: DD, threadSlot: u32) -> DD {
  let isZero = a.hi == 0.0;
  let x0 = sqrt(a.hi);
  let x0sq = twoProdBit(x0, x0);
  let r = ddSubProtected(a, x0sq, threadSlot);
  let safeDenom = select(2.0 * x0, 1.0, isZero);
  let correction = r.hi / safeDenom;
  let result = ddAddProtected(DD(x0, 0.0), DD(correction, 0.0), threadSlot);
  return DD(select(result.hi, 0.0, isZero), select(result.lo, 0.0, isZero));
}
`;
    });
  var eo,
    ro = Z(() => {
      eo = `// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
// emulation of snrm2 \u2014 same scaled accumulation (Blue's algorithm), just
// with \`scale\`/\`ssq\` as DD pairs (via ddDivProtected/ddMulProtected/
// ddAddProtected/ddSqrtProtected) instead of plain f32. Squaring still
// saturates an f32 hi component above ~1.8e19 regardless of DD precision
// (DD widens the mantissa, not the exponent range), so the scaling is
// still needed here for the same reason it was in snrm2.
//
// snrm2.wgsl's ssqAccum/ssqMerge each branch on which operand is bigger \u2014
// can't carry over directly, since a protected op's workgroupBarrier()
// needs every thread to reach the same call site, and here different
// threads could take different branches. Both formulas are computed
// unconditionally below; only the final combine (\`ddSelect\`) differs per
// thread \u2014 same fix shape as drot's/drotm's own per-dispatch flags, just
// applied to a per-element branch instead.
//
// pass 1 dispatches 2*WGS workgroups; pass 2 (reduction/scaledSumF64.wgsl)
// duplicates ssqAccumProtected/ssqMergeProtected rather than sharing them,
// same as the plain-f32 pair already does.

@group(0) @binding(0) var<storage, read>       xHi:           array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:           array<f32>;
@group(0) @binding(2) var<storage, read_write> partialsScaleHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsScaleLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> partialsSsqHi:   array<f32>;
@group(0) @binding(5) var<storage, read_write> partialsSsqLo:   array<f32>;
@group(0) @binding(6) var<uniform>             params:        Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

struct ScaleSsq {
  scale: DD,
  ssq:   DD,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Folds one more |value| (DD) into a running (scale, ssq) pair \u2014 branch-free,
// see file header. \`bigger\`/\`smaller\` name the two operands by magnitude
// (not by which one was "acc" vs "new"), and biggerIsZero==true only when
// both scale and absxi are still exactly zero (the very first zero
// elements, before any nonzero value has been seen) \u2014 substituting a safe
// denominator there avoids a 0/0 without needing a separate branch/return;
// the arithmetic already reduces to a correct no-op in that case.
fn ssqAccumProtected(acc: ScaleSsq, absxi: DD, threadSlot: u32) -> ScaleSsq {
  let isBigger = ddGreater(absxi, acc.scale);
  let bigger = ddSelect(acc.scale, absxi, isBigger);
  let smaller = ddSelect(absxi, acc.scale, isBigger);
  let biggerIsZero = bigger.hi == 0.0;
  let safeBigger = ddSelect(bigger, DD(1.0, 0.0), biggerIsZero);
  let r = ddDivProtected(smaller, safeBigger, threadSlot);
  let rsq = ddMulProtected(r, r, threadSlot);
  let ssqTimesRsq = ddMulProtected(acc.ssq, rsq, threadSlot);
  let sumIfBigger = ddAddProtected(DD(1.0, 0.0), ssqTimesRsq, threadSlot);
  let sumIfNotBigger = ddAddProtected(acc.ssq, rsq, threadSlot);
  let newSsq = ddSelect(sumIfNotBigger, sumIfBigger, isBigger);
  return ScaleSsq(bigger, newSsq);
}

// Associative merge of two independent (scale, ssq) partials \u2014 same
// branch-free shape, for combining ILP lanes and the tree reduction.
fn ssqMergeProtected(a: ScaleSsq, b: ScaleSsq, threadSlot: u32) -> ScaleSsq {
  let isBigger = !ddGreater(b.scale, a.scale); // a.scale >= b.scale
  let bigger = ddSelect(b.scale, a.scale, isBigger);
  let smaller = ddSelect(a.scale, b.scale, isBigger);
  let biggerSsq = ddSelect(b.ssq, a.ssq, isBigger);
  let smallerSsq = ddSelect(a.ssq, b.ssq, isBigger);
  let biggerIsZero = bigger.hi == 0.0;
  let safeBigger = ddSelect(bigger, DD(1.0, 0.0), biggerIsZero);
  let r = ddDivProtected(smaller, safeBigger, threadSlot);
  let rsq = ddMulProtected(r, r, threadSlot);
  let smallerSsqTimesRsq = ddMulProtected(smallerSsq, rsq, threadSlot);
  let newSsq = ddAddProtected(biggerSsq, smallerSsqTimesRsq, threadSlot);
  return ScaleSsq(bigger, newSsq);
}

var<workgroup> tileScaleHi: array<f32, 64>;
var<workgroup> tileScaleLo: array<f32, 64>;
var<workgroup> tileSsqHi:   array<f32, 64>;
var<workgroup> tileSsqLo:   array<f32, 64>;

@compute @workgroup_size(64)
fn dnrm2_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc1 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc2 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc3 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  // Same trip count for every thread, driven by a counter (protected ops'
  // barriers need a provably-uniform loop bound) \u2014 see dasum.wgsl.
  let mainIters = n4_floor / (4u * stride);
  for (var iter = 0u; iter < mainIters; iter++) {
    let id =  gid.x + iter * 4u * stride;
    let i0 =  id                * params.x_inc;
    let i1 = (id +      stride) * params.x_inc;
    let i2 = (id + 2u * stride) * params.x_inc;
    let i3 = (id + 3u * stride) * params.x_inc;
    acc0 = ssqAccumProtected(acc0, ddAbs(DD(xHi[i0], xLo[i0])), lid.x);
    acc1 = ssqAccumProtected(acc1, ddAbs(DD(xHi[i1], xLo[i1])), lid.x);
    acc2 = ssqAccumProtected(acc2, ddAbs(DD(xHi[i2], xLo[i2])), lid.x);
    acc3 = ssqAccumProtected(acc3, ddAbs(DD(xHi[i3], xLo[i3])), lid.x);
  }

  // Tail is ragged (0-3 extra per thread) \u2014 pad to this workgroup's worst
  // case, masking an invalid element to exactly 0 (contributes nothing).
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n4_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n4_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id    = n4_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let i     = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let loaded = ddAbs(DD(xHi[i], xLo[i]));
    let contribution = DD(select(0.0, loaded.hi, valid), select(0.0, loaded.lo, valid));
    acc0 = ssqAccumProtected(acc0, contribution, lid.x);
  }

  let combined01 = ssqMergeProtected(acc0, acc1, lid.x);
  let combined23 = ssqMergeProtected(acc2, acc3, lid.x);
  let combined = ssqMergeProtected(combined01, combined23, lid.x);
  tileScaleHi[lid.x] = combined.scale.hi;
  tileScaleLo[lid.x] = combined.scale.lo;
  tileSsqHi[lid.x]   = combined.ssq.hi;
  tileSsqLo[lid.x]   = combined.ssq.lo;
  workgroupBarrier();

  // Inactive threads merge against a throwaway partner and discard it
  // (ssqMergeProtected must be called unconditionally by every thread).
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(lid.x, lid.x + s, lid.x < s);
    let a = ScaleSsq(DD(tileScaleHi[lid.x], tileScaleLo[lid.x]), DD(tileSsqHi[lid.x], tileSsqLo[lid.x]));
    let b = ScaleSsq(DD(tileScaleHi[partner], tileScaleLo[partner]), DD(tileSsqHi[partner], tileSsqLo[partner]));
    let merged = ssqMergeProtected(a, b, lid.x);
    workgroupBarrier(); // all threads must read tile[] above before any write below
    if (lid.x < s) {
      tileScaleHi[lid.x] = merged.scale.hi;
      tileScaleLo[lid.x] = merged.scale.lo;
      tileSsqHi[lid.x]   = merged.ssq.hi;
      tileSsqLo[lid.x]   = merged.ssq.lo;
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsScaleHi[wgid.x] = tileScaleHi[0];
    partialsScaleLo[wgid.x] = tileScaleLo[0];
    partialsSsqHi[wgid.x]   = tileSsqHi[0];
    partialsSsqLo[wgid.x]   = tileSsqLo[0];
  }
}
`;
    });
  var oo,
    to = Z(() => {
      oo = `// scaledSum reduction (f64, double-double): collapses 2*WGS (scale, ssq) DD
// partials from dnrm2.wgsl into the final norm \u2014 sqrt(scale\xB2 \xB7 ssq) ==
// scale \xB7 sqrt(ssq), via ddMulProtected/ddSqrtProtected. Mirrors
// reduction/scaledSum.wgsl's shape exactly; ssqMergeProtected is duplicated
// from dnrm2.wgsl rather than shared via f64/utils/ \u2014 see that file's own
// header for why (same convention the f32 pair already uses).
// dispatch: 1 workgroup of WGS threads.
// partialsScale*/partialsSsq* must have exactly 2*WGS entries each.

@group(0) @binding(0) var<storage, read>       partialsScaleHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsScaleLo: array<f32>;
@group(0) @binding(2) var<storage, read>       partialsSsqHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       partialsSsqLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> resultHi:        array<f32, 1>;
@group(0) @binding(5) var<storage, read_write> resultLo:        array<f32, 1>;

const WGS: u32 = 64;

struct ScaleSsq {
  scale: DD,
  ssq:   DD,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Associative merge of two independent (scale, ssq) partials \u2014 see
// dnrm2.wgsl for the derivation and why this is branch-free.
fn ssqMergeProtected(a: ScaleSsq, b: ScaleSsq, threadSlot: u32) -> ScaleSsq {
  let isBigger = !ddGreater(b.scale, a.scale); // a.scale >= b.scale
  let bigger = ddSelect(b.scale, a.scale, isBigger);
  let smaller = ddSelect(a.scale, b.scale, isBigger);
  let biggerSsq = ddSelect(b.ssq, a.ssq, isBigger);
  let smallerSsq = ddSelect(a.ssq, b.ssq, isBigger);
  let biggerIsZero = bigger.hi == 0.0;
  let safeBigger = ddSelect(bigger, DD(1.0, 0.0), biggerIsZero);
  let r = ddDivProtected(smaller, safeBigger, threadSlot);
  let rsq = ddMulProtected(r, r, threadSlot);
  let smallerSsqTimesRsq = ddMulProtected(smallerSsq, rsq, threadSlot);
  let newSsq = ddAddProtected(biggerSsq, smallerSsqTimesRsq, threadSlot);
  return ScaleSsq(bigger, newSsq);
}

var<workgroup> tileScaleHi: array<f32, 64>;
var<workgroup> tileScaleLo: array<f32, 64>;
var<workgroup> tileSsqHi:   array<f32, 64>;
var<workgroup> tileSsqLo:   array<f32, 64>;

@compute @workgroup_size(64)
fn reduce_scaled_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = ScaleSsq(DD(partialsScaleHi[i], partialsScaleLo[i]), DD(partialsSsqHi[i], partialsSsqLo[i]));
  let b = ScaleSsq(DD(partialsScaleHi[i + WGS], partialsScaleLo[i + WGS]), DD(partialsSsqHi[i + WGS], partialsSsqLo[i + WGS]));
  let merged0 = ssqMergeProtected(a, b, i);
  tileScaleHi[i] = merged0.scale.hi;
  tileScaleLo[i] = merged0.scale.lo;
  tileSsqHi[i]   = merged0.ssq.hi;
  tileSsqLo[i]   = merged0.ssq.lo;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(i, i + s, i < s);
    let ai = ScaleSsq(DD(tileScaleHi[i], tileScaleLo[i]), DD(tileSsqHi[i], tileSsqLo[i]));
    let bi = ScaleSsq(DD(tileScaleHi[partner], tileScaleLo[partner]), DD(tileSsqHi[partner], tileSsqLo[partner]));
    let merged = ssqMergeProtected(ai, bi, i);
    workgroupBarrier();
    if (i < s) {
      tileScaleHi[i] = merged.scale.hi;
      tileScaleLo[i] = merged.scale.lo;
      tileSsqHi[i]   = merged.ssq.hi;
      tileSsqLo[i]   = merged.ssq.lo;
    }
    workgroupBarrier();
  }

  // ddSqrtProtected/ddMulProtected's own workgroupBarrier()s need every
  // thread to call them \u2014 every thread redundantly computes the same final
  // scale\xB7sqrt(ssq) from tile[0] (still visible to all after the reduction
  // above), and only the write-back is conditional. Guarding the calls
  // themselves behind \`if (i == 0u)\` (as the plain-f32 original safely
  // does with its unprotected \`sqrt()\`) would leave 63 threads never
  // reaching a barrier the one remaining thread still needs.
  let scale = DD(tileScaleHi[0], tileScaleLo[0]);
  let ssq = DD(tileSsqHi[0], tileSsqLo[0]);
  let result = ddMulProtected(scale, ddSqrtProtected(ssq, i), i);
  if (i == 0u) {
    resultHi[0] = result.hi;
    resultLo[0] = result.lo;
  }
}
`;
    });
  var io,
    ao = Z(() => {
      io = `// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
  var no,
    so = Z(() => {
      no = `// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
  var uo,
    lo = Z(() => {
      uo = `// ssymv: y = alpha * A * x + beta * y
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
  var mo,
    fo = Z(() => {
      mo = `// strmv: y = op(A) * x
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
  var Me,
    co = Z(() => {
      Me = `// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
  var wo,
    po = Z(() => {
      wo = `// strsv_apply_inverse: given a precomputed block inverse (from
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
  var ho,
    go = Z(() => {
      ho = `// strsv_update: subtracts a solved block's contribution from every
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
  var yo,
    bo = Z(() => {
      yo = `// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
  var vo,
    xo = Z(() => {
      vo = `// dger: A := alpha * x * y^T + A, double-double (Dekker) f64 emulation of
// sger (rank-1 update). x, y, A, and alpha are each split into an f32
// (hi, lo) pair; WGSL has no f64 type. One workgroup per row of A
// (grid-stride over rows); within a row, ddMulProtected/ddAddProtected each
// carry a workgroupBarrier(), so the column loop uses the same
// uniform-main + ragged-tail split dscal.wgsl uses, rather than sger.wgsl's
// 4-way ILP unroll \u2014 unrolling would pay the barrier round-trip four times
// over per iteration for no benefit here.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read>       yHi: array<f32>;
@group(0) @binding(3) var<storage, read>       yLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> AHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> ALo: array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  x_inc:   u32,
  y_inc:   u32,
  lda:     u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dger_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);

  // Column loop's trip count depends only on n and WGS, not on row \u2014 the
  // same main/tail split applies uniformly to every row, so every thread
  // reaches each protected call the same number of times overall.
  let n_floor = (params.n / WGS) * WGS;
  let mainIters = n_floor / WGS;
  let hasTail = select(0u, 1u, n_floor < params.n);

  for (var row = wgid.x; row < params.m; row += nwg.x) {
    // Every thread in the workgroup redundantly computes the same alpha*x[row]
    // \u2014 wasteful but harmless, and keeps the per-row protected-call count
    // trivially identical across threads.
    let ix = row * params.x_inc;
    let xi = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let row_base = row * params.lda;

    for (var iter = 0u; iter < mainIters; iter++) {
      let col = lid.x + iter * WGS;
      let idx = row_base + col;
      let iy = col * params.y_inc;
      let prod = ddMulProtected(xi, DD(yHi[iy], yLo[iy]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      AHi[idx] = result.hi;
      ALo[idx] = result.lo;
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = n_floor + lid.x;
      let valid = col < params.n;
      let idx = select(0u, row_base + col, valid);
      let iy = select(0u, col * params.y_inc, valid);
      let prod = ddMulProtected(xi, DD(yHi[iy], yLo[iy]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var Bo,
    _o = Z(() => {
      Bo = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
  var So,
    Ao = Z(() => {
      So = `// dsyr: A := alpha * x * x^T + A, double-double (Dekker) f64 emulation of
// ssyr (symmetric rank-1 update). x, A, and alpha are each split into an f32
// (hi, lo) pair; WGSL has no f64 type. Only the triangle specified by uplo
// is referenced/updated. One workgroup per row of A (grid-stride over
// rows); within a row, ddMulProtected/ddAddProtected each carry a
// workgroupBarrier(), so the column loop uses the same uniform-main +
// ragged-tail split dger.wgsl uses over its *stored* range, rather than
// ssyr.wgsl's 4-way ILP unroll.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> AHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> ALo: array<f32>;

struct Params {
  n:     u32,
  alphaHi: f32,
  alphaLo: f32,
  incx:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dsyr_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);

  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let ix = row * params.incx;
    let xi = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
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

    // Range length varies per row, but every thread in the workgroup runs
    // the SAME row at the same time (the outer loop is shared), so the
    // main/tail split computed from colStart/colEnd is already uniform
    // across threads for this row \u2014 just not the same across different rows.
    let rangeLen = colEnd - colStart;
    let range_floor = colStart + (rangeLen / WGS) * WGS;
    let mainIters = (range_floor - colStart) / WGS;
    let hasTail = select(0u, 1u, range_floor < colEnd);

    for (var iter = 0u; iter < mainIters; iter++) {
      let col = colStart + lid.x + iter * WGS;
      let idx = row_base + col;
      let ic = col * params.incx;
      let prod = ddMulProtected(xi, DD(xHi[ic], xLo[ic]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      AHi[idx] = result.hi;
      ALo[idx] = result.lo;
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = range_floor + lid.x;
      let valid = col < colEnd;
      let idx = select(0u, row_base + col, valid);
      let ic = select(0u, col * params.incx, valid);
      let prod = ddMulProtected(xi, DD(xHi[ic], xLo[ic]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var Eo,
    Go = Z(() => {
      Eo = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
  var Do,
    ko = Z(() => {
      Do = `// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
// f64 emulation of ssyr2 (symmetric rank-2 update). x, y, A, and alpha are
// each split into an f32 (hi, lo) pair; WGSL has no f64 type. Only the
// triangle specified by uplo is referenced/updated. One workgroup per row
// of A (grid-stride over rows); within a row, ddMulProtected/ddAddProtected
// each carry a workgroupBarrier(), so the column loop uses the same
// uniform-main + ragged-tail split dsyr.wgsl uses over its *stored* range,
// rather than ssyr2.wgsl's 4-way ILP unroll.

@group(0) @binding(0) var<storage, read>       xHi: array<f32>;
@group(0) @binding(1) var<storage, read>       xLo: array<f32>;
@group(0) @binding(2) var<storage, read>       yHi: array<f32>;
@group(0) @binding(3) var<storage, read>       yLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> AHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> ALo: array<f32>;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
  uplo:    u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dsyr2_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);

  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let ix = row * params.incx;
    let iy = row * params.incy;
    let xi = ddMulProtected(alpha, DD(xHi[ix], xLo[ix]), lid.x);
    let yi = ddMulProtected(alpha, DD(yHi[iy], yLo[iy]), lid.x);
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

    // Range length varies per row, but every thread in the workgroup runs
    // the SAME row at the same time (the outer loop is shared), so the
    // main/tail split computed from colStart/colEnd is already uniform
    // across threads for this row \u2014 just not the same across different rows.
    let rangeLen = colEnd - colStart;
    let range_floor = colStart + (rangeLen / WGS) * WGS;
    let mainIters = (range_floor - colStart) / WGS;
    let hasTail = select(0u, 1u, range_floor < colEnd);

    for (var iter = 0u; iter < mainIters; iter++) {
      let col = colStart + lid.x + iter * WGS;
      let idx = row_base + col;
      let jc_x = col * params.incx;
      let jc_y = col * params.incy;
      let prod1 = ddMulProtected(xi, DD(yHi[jc_y], yLo[jc_y]), lid.x);
      let prod2 = ddMulProtected(yi, DD(xHi[jc_x], xLo[jc_x]), lid.x);
      let sum1 = ddAddProtected(prod1, prod2, lid.x);
      let result = ddAddProtected(sum1, DD(AHi[idx], ALo[idx]), lid.x);
      AHi[idx] = result.hi;
      ALo[idx] = result.lo;
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = range_floor + lid.x;
      let valid = col < colEnd;
      let idx = select(0u, row_base + col, valid);
      let jc_x = select(0u, col * params.incx, valid);
      let jc_y = select(0u, col * params.incy, valid);
      let prod1 = ddMulProtected(xi, DD(yHi[jc_y], yLo[jc_y]), lid.x);
      let prod2 = ddMulProtected(yi, DD(xHi[jc_x], xLo[jc_x]), lid.x);
      let sum1 = ddAddProtected(prod1, prod2, lid.x);
      let result = ddAddProtected(sum1, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var Po,
    Lo = Z(() => {
      Po = `// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_n (matrix-vector product, no transpose). A, x, y,
// alpha, and beta are each split into an f32 (hi, lo) pair; WGSL has no f64
// type. Same one-workgroup-per-output-row shape as sgemv_n.wgsl (grid-stride
// over rows), but the per-row dot product is reduced via a full
// within-workgroup DD tree reduction \u2014 the same reduction ddot.wgsl uses to
// combine 64 lanes down to one \u2014 rather than sgemv_n.wgsl's 4-way ILP
// unroll + shared-memory tree (ddMulProtected/ddAddProtected each carry a
// workgroupBarrier(), so unrolling would pay that barrier four times over
// per iteration for no benefit). Since each row is handled by exactly one
// workgroup, no separate cross-workgroup reduction pass (ddot's reduce_f64)
// is needed here \u2014 the tree reduction alone finishes the row.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read>       xHi: array<f32>;
@group(0) @binding(3) var<storage, read>       xLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> yLo: array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_n_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;

  // Column loop's trip count depends only on n and WGS, not on row \u2014 same
  // main/tail split applies uniformly to every row (see dger.wgsl).
  let n_floor   = (params.n / WGS) * WGS;
  let mainIters = n_floor / WGS;
  let hasTail   = select(0u, 1u, n_floor < params.n);

  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let row_base = row * params.lda;
    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let j  = lid.x + iter * WGS;
      let ia = row_base + j;
      let ix = j * params.incx;
      let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = n_floor + lid.x;
      let valid = j < params.n;
      let ia    = select(0u, row_base + j, valid);
      let ix    = select(0u, j * params.incx, valid);
      let prod  = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
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

    // tile[0] now holds the full row dot product, visible to every lane \u2014
    // every thread redundantly finishes the O(1) alpha/beta combine so the
    // protected ops below stay uniformly called (only the write is gated).
    let dot = tile[0];
    let scaled = ddMulProtected(alpha, dot, lid.x);
    let iy = row * params.incy;
    let yVal = DD(yHi[iy], yLo[iy]);
    let betaTimesY = ddMulProtected(beta, yVal, lid.x);
    let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 the result
    // must not depend on y's prior value (though it is still read above).
    let result = DD(
      select(scaled.hi, withBeta.hi, isBetaNonzero),
      select(scaled.lo, withBeta.lo, isBetaNonzero),
    );

    if (lid.x == 0u) {
      yHi[iy] = result.hi;
      yLo[iy] = result.lo;
    }
    // All 64 threads must agree before the next row reuses tile[].
    workgroupBarrier();
  }
}
`;
    });
  var Mo,
    No = Z(() => {
      Mo = `// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_t (matrix-vector product, transposed). A, x, y, alpha,
// and beta are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
// Same one-thread-per-output-column shape as sgemv_t.wgsl, tiling over x
// (length m) via shared memory. Because ddMulProtected/ddAddProtected each
// carry a workgroupBarrier(), every thread in the workgroup \u2014 including ones
// whose column is out of range (n not a multiple of WGS) \u2014 must call them
// the same number of times: unlike sgemv_t.wgsl's \`if (col < n)\` guard
// around the whole accumulation, out-of-range threads here compute against
// a clamped dummy column unconditionally and simply never write their
// result (same technique dger.wgsl/ddot.wgsl use for their ragged tails).

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read>       xHi: array<f32>;
@group(0) @binding(3) var<storage, read>       xLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> yLo: array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> xTile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_t_main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
) {
  let col      = gid.x;
  let colValid = col < params.n;
  // Clamp so out-of-range threads still index safely \u2014 their contribution
  // is computed but never written back.
  let safeCol  = select(0u, col, colValid);

  var acc = DD(0.0, 0.0);

  let m_floor   = (params.m / WGS) * WGS;
  let mainIters = m_floor / WGS;

  for (var iter = 0u; iter < mainIters; iter++) {
    let base = iter * WGS;
    // Cooperative load: all 64 threads fill xTile with x[base..base+WGS),
    // independent of col \u2014 safe regardless of whether this thread's column
    // is in range.
    let ix = (base + lid.x) * params.incx;
    xTile[lid.x] = DD(xHi[ix], xLo[ix]);
    workgroupBarrier();

    for (var j = 0u; j < WGS; j++) {
      let ia = (base + j) * params.lda + safeCol;
      let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), xTile[j], lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }
    workgroupBarrier();
  }

  // Remainder rows (m not a multiple of WGS): the count is the same for
  // every thread regardless of col, so this loop is already barrier-safe
  // without needing a second tiling pass.
  let remCount = params.m - m_floor;
  for (var k = 0u; k < remCount; k++) {
    let row = m_floor + k;
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let scaled = ddMulProtected(alpha, acc, lid.x);

  let iy = safeCol * params.incy;
  let yVal = DD(yHi[iy], yLo[iy]);
  let betaTimesY = ddMulProtected(beta, yVal, lid.x);
  let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;
  // BLAS beta==0 semantics: y is written, not accumulated \u2014 the result
  // must not depend on y's prior value (though it is still read above).
  let result = DD(
    select(scaled.hi, withBeta.hi, isBetaNonzero),
    select(scaled.lo, withBeta.lo, isBetaNonzero),
  );

  if (colValid) {
    yHi[iy] = result.hi;
    yLo[iy] = result.lo;
  }
}
`;
    });
  var Ro,
    Io = Z(() => {
      Ro = `// dsymv: y := alpha * A * x + beta * y, double-double (Dekker) f64 emulation
// of ssymv (symmetric matrix-vector product). A, x, y, alpha, and beta are
// each split into an f32 (hi, lo) pair; WGSL has no f64 type. A is n\xD7n
// symmetric \u2014 only the triangle specified by uplo is physically stored, so
// entries on the unstored side of the diagonal are fetched from their
// mirror position (A[i,j] == A[j,i]), same as ssymv.wgsl. Same
// one-workgroup-per-row + full within-workgroup DD tree reduction shape as
// dgemv_n.wgsl (every row sums over all n columns here, unlike dsyr's
// triangle-restricted range, since the logical matrix is fully dense).

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read>       xHi: array<f32>;
@group(0) @binding(3) var<storage, read>       xLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> yLo: array<f32>;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  incx:    u32,
  incy:    u32,
  lda:     u32,
  uplo:    u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

// A[i,j] flat index for the symmetric matrix \u2014 stored position if (i,j) is
// on the uplo side of the diagonal, mirrored from (j,i) otherwise. Pure
// addressing (no protected op inside), so branching here is safe.
fn symIdx(i: u32, j: u32) -> u32 {
  var row: u32;
  var col: u32;
  if params.uplo == 0u {
    // Lower: stored at (i,j) for j <= i, mirrored from (j,i) otherwise.
    if j <= i { row = i; col = j; } else { row = j; col = i; }
  } else {
    // Upper: stored at (i,j) for j >= i, mirrored from (j,i) otherwise.
    if j >= i { row = i; col = j; } else { row = j; col = i; }
  }
  return row * params.lda + col;
}

@compute @workgroup_size(64)
fn dsymv_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;

  // Column loop's trip count depends only on n and WGS, not on row \u2014 same
  // main/tail split applies uniformly to every row (see dger.wgsl).
  let n_floor   = (params.n / WGS) * WGS;
  let mainIters = n_floor / WGS;
  let hasTail   = select(0u, 1u, n_floor < params.n);

  for (var i = wgid.x; i < params.n; i += nwg.x) {
    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let j   = lid.x + iter * WGS;
      let idx = symIdx(i, j);
      let ix  = j * params.incx;
      let prod = ddMulProtected(DD(AHi[idx], ALo[idx]), DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = n_floor + lid.x;
      let valid = j < params.n;
      let safeJ = select(0u, j, valid);
      let idx   = symIdx(i, safeJ);
      let ix    = safeJ * params.incx;
      let prod  = ddMulProtected(DD(AHi[idx], ALo[idx]), DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
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

    // tile[0] now holds the full row dot product, visible to every lane \u2014
    // every thread redundantly finishes the O(1) alpha/beta combine so the
    // protected ops below stay uniformly called (only the write is gated).
    let dot = tile[0];
    let scaled = ddMulProtected(alpha, dot, lid.x);
    let iy = i * params.incy;
    let yVal = DD(yHi[iy], yLo[iy]);
    let betaTimesY = ddMulProtected(beta, yVal, lid.x);
    let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 the result
    // must not depend on y's prior value (though it is still read above).
    let result = DD(
      select(scaled.hi, withBeta.hi, isBetaNonzero),
      select(scaled.lo, withBeta.lo, isBetaNonzero),
    );

    if (lid.x == 0u) {
      yHi[iy] = result.hi;
      yLo[iy] = result.lo;
    }
    // All 64 threads must agree before the next row reuses tile[].
    workgroupBarrier();
  }
}
`;
    });
  var Fo,
    jo = Z(() => {
      Fo = `// dtrmv: y := op(A) * x, double-double (Dekker) f64 emulation of strmv
// (triangular matrix-vector product). A, x, and y are each split into an f32
// (hi, lo) pair; WGSL has no f64 type. A is n\xD7n triangular \u2014 only the
// triangle specified by uplo is referenced. Like strmv.wgsl, wgblas's trmv
// takes a separate output vector y rather than overwriting x in place (the
// standard BLAS signature is in-place), so there is no aliasing/read-write-
// ordering concern the way real in-place trmv would have \u2014 this is
// structurally just dsymv.wgsl's per-row DD tree reduction with a triangular
// (not full-n, not mirrored) column range per row, same shape as dsyr.wgsl's
// per-row-varying range (main/tail split computed inside the row loop, since
// range length depends on i).

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read>       xHi: array<f32>;
@group(0) @binding(3) var<storage, read>       xLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> yHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> yLo: array<f32>;

struct Params {
  n:     u32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dtrmv_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  // Effective "upper" range for row i: op(A)[i,j] is stored at A[i,j] for
  // no-transpose+upper or transpose+lower (range [i, n)); at A[j,i] for
  // no-transpose+lower or transpose+upper (range [0, i]).
  let isUpperRange = (params.trans == 0u) == (params.uplo == 1u);

  for (var i = wgid.x; i < params.n; i += nwg.x) {
    let rangeStart = select(0u, i, isUpperRange);
    let rangeEnd   = select(i + 1u, params.n, isUpperRange);

    // Range length varies per row, but every thread in the workgroup runs
    // the SAME row at the same time, so the main/tail split computed from
    // rangeStart/rangeEnd is already uniform across threads for this row \u2014
    // just not the same across different rows (see dsyr.wgsl).
    let rangeLen    = rangeEnd - rangeStart;
    let range_floor = rangeStart + (rangeLen / WGS) * WGS;
    let mainIters   = (range_floor - rangeStart) / WGS;
    let hasTail     = select(0u, 1u, range_floor < rangeEnd);

    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let j    = rangeStart + lid.x + iter * WGS;
      let addr = select(j * params.lda + i, i * params.lda + j, params.trans == 0u);
      let isUnitDiag = params.diag == 1u && j == i;
      let aVal = DD(
        select(AHi[addr], 1.0, isUnitDiag),
        select(ALo[addr], 0.0, isUnitDiag),
      );
      let ix = j * params.incx;
      let prod = ddMulProtected(aVal, DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = range_floor + lid.x;
      let valid = j < rangeEnd;
      let safeJ = select(rangeStart, j, valid); // rangeLen is always >= 1, so rangeStart is a safe in-range fallback
      let addr  = select(safeJ * params.lda + i, i * params.lda + safeJ, params.trans == 0u);
      let isUnitDiag = params.diag == 1u && safeJ == i;
      let aVal = DD(
        select(AHi[addr], 1.0, isUnitDiag),
        select(ALo[addr], 0.0, isUnitDiag),
      );
      let ix = safeJ * params.incx;
      let prod = ddMulProtected(aVal, DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
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
      let iy = i * params.incy;
      yHi[iy] = tile[0].hi;
      yLo[iy] = tile[0].lo;
    }
    // All 64 threads must agree before the next row reuses tile[].
    workgroupBarrier();
  }
}
`;
    });
  var Ho,
    qo = Z(() => {
      Ho = `// dtrsv_invert_block: double-double (Dekker) f64 emulation of
// strsv_invert_block.wgsl \u2014 computes ONE column (workgroup_id.x) of ONE
// block's (workgroup_id.y) explicit inverse, via the same one-row-at-a-time
// substitution, solving against a unit basis vector e_col. A, Ainv, and the
// running accumulation are each split into an f32 (hi, lo) pair; WGSL has no
// f64 type.
//
// This is the first routine in the f64 port order to use ddDivProtected (the
// non-unit-diagonal division) \u2014 deliberately last per TODO.md, since
// division is where dnrm2 found real double-double edge-case bugs during
// the L1 port. The division only runs once per (column, step) \u2014 same
// barrier-uniformity requirement as every other protected op here \u2014 so
// every thread in the workgroup computes it redundantly from the
// already-shared \`tile[0]\` reduction result (same pattern dgemv_n uses for
// its O(1) alpha/beta combine after the per-row reduction), with only
// \`lid.x==0\` writing the result. \`params.diag\` is uniform across the whole
// dispatch (not per-thread), so branching on it to skip the division
// entirely for a unit diagonal is safe \u2014 unlike dtrmv.wgsl's per-element
// diag check, which varies per thread and needed select() instead.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> AinvHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> AinvLo: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;
const BLOCK_SIZE: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

fn readA(i: u32, j: u32) -> DD {
  let idx = select(j * params.lda + i, i * params.lda + j, params.trans == 0u);
  return DD(AHi[idx], ALo[idx]);
}

@compute @workgroup_size(64)
fn dtrsv_invert_block_main(
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
      AinvHi[ainvBase + r * BLOCK_SIZE + col] = 0.0;
      AinvLo[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  } else {
    for (var r = col + 1u + lid.x; r < blockLen; r += WGS) {
      AinvHi[ainvBase + r * BLOCK_SIZE + col] = 0.0;
      AinvLo[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  }
  storageBarrier();
  workgroupBarrier();

  let numSteps = select(col + 1u, blockLen - col, forward);
  for (var step = 0u; step < numSteps; step++) {
    let localRow = select(col - step, col + step, forward);
    let i = blockStart + localRow;

    // Accumulation range over lj: [col, localRow) forward, [localRow+1, col+1) backward.
    // Range length varies per step, but every thread runs the SAME step at
    // the same time, so the main/tail split is already uniform for this
    // step \u2014 just not the same across different steps (see dsyr.wgsl).
    let ljStart = select(localRow + 1u, col, forward);
    let ljEnd   = select(col + 1u, localRow, forward);
    let rangeLen    = ljEnd - ljStart;
    let range_floor = ljStart + (rangeLen / WGS) * WGS;
    let mainIters   = (range_floor - ljStart) / WGS;
    let hasTail     = select(0u, 1u, range_floor < ljEnd);

    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let lj = ljStart + lid.x + iter * WGS;
      let aij = readA(i, blockStart + lj);
      let aidx = ainvBase + lj * BLOCK_SIZE + col;
      let ainv = DD(AinvHi[aidx], AinvLo[aidx]);
      let prod = ddMulProtected(aij, ainv, lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let lj    = range_floor + lid.x;
      let valid = lj < ljEnd;
      let safeLj = select(ljStart, lj, valid); // ljStart is always in-range when rangeLen > 0, the only case hasTail can be 1
      let aij = readA(i, blockStart + safeLj);
      let aidx = ainvBase + safeLj * BLOCK_SIZE + col;
      let ainv = DD(AinvHi[aidx], AinvLo[aidx]);
      let prod = ddMulProtected(aij, ainv, lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
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

    // tile[0] now holds the full accumulation, visible to every lane \u2014 every
    // thread redundantly finishes the O(1) rhs/division so the protected
    // ops below stay uniformly called (only the write is gated).
    let e = DD(select(0.0, 1.0, localRow == col), 0.0);
    let rhs = ddSubProtected(e, tile[0], lid.x);

    var val: DD;
    if params.diag == 1u {
      val = rhs;
    } else {
      val = ddDivProtected(rhs, readA(i, i), lid.x);
    }

    if (lid.x == 0u) {
      AinvHi[ainvBase + localRow * BLOCK_SIZE + col] = val.hi;
      AinvLo[ainvBase + localRow * BLOCK_SIZE + col] = val.lo;
    }
    storageBarrier();
    workgroupBarrier();
  }
}
`;
    });
  var Co,
    To = Z(() => {
      Co = `// dtrsv_apply_inverse: double-double (Dekker) f64 emulation of
// strsv_apply_inverse.wgsl \u2014 given a precomputed block inverse (from
// dtrsv_invert_block.wgsl), computes this block's solution as a dense
// matrix-vector multiply against the block's current remainder in x.
// Ainv, x, and the per-row accumulation are each split into an f32 (hi, lo)
// pair; WGSL has no f64 type.
//
// Unlike dsymv/dtrmv's per-row reduction across 64 threads, each thread here
// owns one whole row's dot product independently (blockLen <= WGS, so one
// thread per row already covers it, no tree reduction needed) \u2014 same shape
// as dgemv_t.wgsl's per-thread accumulation. The f32 original early-returns
// threads with \`lid.x >= blockLen\` (the last, possibly-short block); DD
// can't do that, since every thread must call ddMulProtected/ddAddProtected
// the same number of times. Instead every thread runs the identical
// \`blockLen\`-iteration loop (reading past-blockLen rows of Ainv, which the
// zero-initialized, never-written buffer backing them makes safe garbage \u2014
// see dgemv_t.wgsl's clamped-dummy-index technique) and only the final
// write is gated.

@group(0) @binding(0) var<storage, read>       AinvHi: array<f32>;
@group(0) @binding(1) var<storage, read>       AinvLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> xLo: array<f32>;

struct Params {
  incx:       u32,
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,
}

@group(0) @binding(4) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
var<workgroup> xLocal: array<DD, 64>;

@compute @workgroup_size(64)
fn dtrsv_apply_inverse_main(@builtin(local_invocation_id) lid: vec3u) {
  let blockLen = params.blockEnd - params.blockStart;

  if (lid.x < blockLen) {
    let ix = (params.blockStart + lid.x) * params.incx;
    xLocal[lid.x] = DD(xHi[ix], xLo[ix]);
  }
  workgroupBarrier();

  let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  var acc = DD(0.0, 0.0);
  for (var j = 0u; j < blockLen; j++) {
    let aidx = ainvBase + lid.x * BLOCK_SIZE + j;
    let prod = ddMulProtected(DD(AinvHi[aidx], AinvLo[aidx]), xLocal[j], lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  if (lid.x < blockLen) {
    let ix = (params.blockStart + lid.x) * params.incx;
    xHi[ix] = acc.hi;
    xLo[ix] = acc.lo;
  }
}
`;
    });
  var Vo,
    Wo = Z(() => {
      Vo = `// dtrsv_update: double-double (Dekker) f64 emulation of strsv_update.wgsl \u2014
// subtracts a solved block's contribution from every remaining row in
// parallel (one workgroup per row, like dtrmv.wgsl). A, x, and the per-row
// accumulation are each split into an f32 (hi, lo) pair; WGSL has no f64
// type. No diag/masking needed: this region never touches the diagonal.
//
// The column range [blockStart, blockEnd) is the same fixed width for every
// row in a dispatch (not per-row-varying the way dtrmv's triangular range
// is), so the main/tail split is computed once, outside the row loop \u2014 same
// shape as dger.wgsl's column loop.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> xLo: array<f32>;

struct Params {
  n:          u32,
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  uplo:       u32,  // 0 = lower, 1 = upper
  blockStart: u32,
  blockEnd:   u32,  // exclusive
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dtrsv_update_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  // forward: remaining rows are [blockEnd,n); backward: [0,blockStart).
  // Uniform across the whole dispatch (derived from params only), so an
  // early return here is safe \u2014 never a partial-workgroup divergence.
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

  let colCount    = params.blockEnd - params.blockStart;
  let col_floor   = (colCount / WGS) * WGS;
  let mainIters   = col_floor / WGS;
  let hasTail     = select(0u, 1u, col_floor < colCount);

  for (var idx = wgid.x; idx < count; idx += nwg.x) {
    let i = rangeStart + idx;
    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let j = params.blockStart + lid.x + iter * WGS;
      let aidx = select(j * params.lda + i, i * params.lda + j, params.trans == 0u);
      let ix = j * params.incx;
      let prod = ddMulProtected(DD(AHi[aidx], ALo[aidx]), DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = params.blockStart + col_floor + lid.x;
      let valid = j < params.blockEnd;
      let safeJ = select(params.blockStart, j, valid);
      let aidx  = select(safeJ * params.lda + i, i * params.lda + safeJ, params.trans == 0u);
      let ix    = safeJ * params.incx;
      let prod  = ddMulProtected(DD(AHi[aidx], ALo[aidx]), DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
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

    let ix_i = i * params.incx;
    let xVal = DD(xHi[ix_i], xLo[ix_i]);
    // tile[0] now holds the full subtracted term, visible to every lane \u2014
    // every thread redundantly finishes the O(1) subtraction so the
    // protected op below stays uniformly called (only the write is gated).
    let result = ddSubProtected(xVal, tile[0], lid.x);

    if (lid.x == 0u) {
      xHi[ix_i] = result.hi;
      xLo[ix_i] = result.lo;
    }
    // All 64 threads must agree before the next row (grid-stride) reuses tile[].
    workgroupBarrier();
  }
}
`;
    });
  var ue,
    Oo = Z(() => {
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
  var de,
    Ko = Z(() => {
      de = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
  var xe,
    Uo = Z(() => {
      xe = `// sgemmtr_small: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 small-tile
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
  var ve,
    zo = Z(() => {
      ve = `// sgemmtr_large: C := uplo(alpha * op(A) * op(B) + beta * C) \u2014 large-tile
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
  var Zo,
    Yo = Z(() => {
      Zo = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var $o,
    Xo = Z(() => {
      $o = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
  var Qo,
    Jo = Z(() => {
      Qo = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var ra = {};
  Fe(ra, { routineShaders: () => ir, shaderSources: () => bs });
  var ir,
    bs,
    ea = Z(() => {
      $e();
      Je();
      rt();
      tt();
      at();
      st();
      lt();
      dt();
      mt();
      ct();
      wt();
      ht();
      yt();
      vt();
      Bt();
      At();
      St();
      Gt();
      kt();
      Dt();
      Lt();
      Nt();
      It();
      jt();
      Ft();
      Ht();
      Ct();
      Vt();
      Kt();
      zt();
      Zt();
      $t();
      Jt();
      ro();
      to();
      ao();
      so();
      lo();
      fo();
      co();
      po();
      go();
      bo();
      xo();
      _o();
      Ao();
      Go();
      ko();
      Lo();
      No();
      Io();
      jo();
      qo();
      To();
      Wo();
      Oo();
      Ko();
      Uo();
      zo();
      Yo();
      Xo();
      Jo();
      ir = {};
      ir.sscal = { sscal: ke };
      ir.cscal = { cscal: Qe };
      ir.sswap = { sswap: et };
      ir.dswap = { dswap: ot };
      ir.saxpy = { saxpy: it };
      ir.scopy = { scopy: nt };
      ir.dcopy = { dcopy: ut };
      ir.sdot = { sdot: ft, "reduction/sum": De };
      ir.sasum = { sasum: pt, "reduction/sum": De };
      ir.snrm2 = { snrm2: gt, "reduction/scaledSum": bt };
      ir.isamax = { isamax: xt, "reduction/argmax": _t };
      ir.dasum = {
        "f64/dekker": Pr,
        "f64/utils/abs": ye,
        "f64/utils/add": Ir,
        dasum: Et,
        "reduction/sumF64": Le,
      };
      ir.ddot = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        ddot: Pt,
        "reduction/sumF64": Le,
      };
      ir.dscal = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dscal: Mt,
      };
      ir.daxpy = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        daxpy: Rt,
      };
      ir.idamax = {
        "f64/dekker": Pr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Pe,
        "f64/utils/equal": qt,
        idamax: Tt,
        "reduction/argmaxF64": Wt,
      };
      ir.srot = { srot: Ot };
      ir.drot = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        drot: Ut,
      };
      ir.srotm = { srotm: Yt };
      ir.drotm = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        drotm: Xt,
      };
      ir.dnrm2 = {
        "f64/dekker": Pr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Pe,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        "f64/utils/divide": Ne,
        "f64/utils/sqrt": Qt,
        dnrm2: eo,
        "reduction/scaledSumF64": oo,
      };
      ir.sgemv = { sgemv_n: io, sgemv_t: no };
      ir.ssymv = { ssymv: uo };
      ir.strmv = { strmv: mo };
      ir.strsv = {
        strsv_invert_block: Me,
        strsv_apply_inverse: wo,
        strsv_update: ho,
      };
      ir.sger = { sger: yo };
      ir.dger = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dger: vo,
      };
      ir.ssyr = { ssyr: Bo };
      ir.dsyr = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dsyr: So,
      };
      ir.ssyr2 = { ssyr2: Eo };
      ir.dsyr2 = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dsyr2: Do,
      };
      ir.dgemv = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dgemv_n: Po,
        dgemv_t: Mo,
      };
      ir.dsymv = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dsymv: Ro,
      };
      ir.dtrmv = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        dtrmv: Fo,
      };
      ir.dtrsv = {
        "f64/dekker": Pr,
        "f64/utils/add": Ir,
        "f64/utils/multiply": Cr,
        "f64/utils/divide": Ne,
        dtrsv_invert_block: Ho,
        dtrsv_apply_inverse: Co,
        dtrsv_update: Vo,
      };
      ir.sgemm = { sgemm_small: ue, sgemm_large: de };
      ir.sgemmtr = { sgemmtr_small: xe, sgemmtr_large: ve };
      ir.ssyrk = { sgemmtr_small: xe, sgemmtr_large: ve };
      ir.ssyr2k = { sgemmtr_small: xe, sgemmtr_large: ve };
      ir.ssymm = { sgemm_small: ue, sgemm_large: de, symmetrize: Zo };
      ir.strmm = { sgemm_small: ue, sgemm_large: de, triangularize: $o };
      ir.strsm = {
        strsv_invert_block: Me,
        block_transfer: Qo,
        sscal: ke,
        sgemm_small: ue,
        sgemm_large: de,
      };
      bs = Object.assign({}, ...Object.values(ir));
    });
  var _s = {};
  Fe(_s, {
    Complex32: () => Or,
    Complex32Array: () => Br,
    Complex64: () => Vr,
    Complex64Array: () => Lr,
    GpuMatrix: () => X,
    GpuVector: () => M,
    cleanup: () => Oe,
    cscal: () => oa,
    dasum: () => ca,
    daxpy: () => la,
    dcopy: () => da,
    ddot: () => pa,
    dgemv: () => Ra,
    dger: () => La,
    dnrm2: () => ga,
    drot: () => xa,
    drotm: () => _a,
    dscal: () => aa,
    dswap: () => sa,
    dsymv: () => ja,
    dsyr: () => Na,
    dsyr2: () => Ia,
    dtrmv: () => Fa,
    dtrsv: () => Ta,
    gpuName: () => Ke,
    idamax: () => ba,
    init: () => Ve,
    isamax: () => ha,
    randomFloat32Array: () => Ye,
    randomFloat64Array: () => Ze,
    randomTriangularFloat32Array: () => Xe,
    sasum: () => ma,
    saxpy: () => na,
    scopy: () => ua,
    sdot: () => fa,
    sgemm: () => Ca,
    sgemmtr: () => Wa,
    sgemv: () => Ba,
    sger: () => Da,
    snrm2: () => wa,
    srot: () => ya,
    srotm: () => va,
    sscal: () => ta,
    sswap: () => ia,
    ssymm: () => Ka,
    ssymv: () => Aa,
    ssyr: () => Pa,
    ssyr2: () => Ma,
    ssyr2k: () => Oa,
    ssyrk: () => Va,
    strmm: () => Ua,
    strmv: () => Sa,
    strsm: () => za,
    strsv: () => ka,
  });
  function He(r, o) {
    return o
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function Te(r) {
    if (!Ce(r)) return { querySet: null, passDescriptor: void 0 };
    let o = r.createQuerySet({ type: "timestamp", count: 2 });
    return {
      querySet: o,
      passDescriptor: {
        timestampWrites: {
          querySet: o,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      },
    };
  }
  function kr(r, o, e) {
    if (!e) return null;
    let a = r.createBuffer({
      label: "timestamp-resolve",
      size: 16,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    o.resolveQuerySet(e, 0, 2, a, 0);
    let t = r.createBuffer({
      label: "timestamp-readback",
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (
      o.copyBufferToBuffer(a, 0, t, 0, 16),
      { tsReadBuffer: t, resolveBuffer: a, querySet: e }
    );
  }
  async function j(r) {
    if (!r) return;
    let { tsReadBuffer: o, resolveBuffer: e, querySet: a } = r;
    await o.mapAsync(GPUMapMode.READ);
    let t = new BigInt64Array(o.getMappedRange().slice());
    return (
      o.unmap(),
      o.destroy(),
      e.destroy(),
      a.destroy(),
      Math.max(0, Number(t[1] - t[0])) / 1e6
    );
  }
  var Jr = null,
    Se = !1,
    Qr = new Map(),
    le = new WeakMap(),
    zr = null,
    We = ({ powerPreference: r, benchmark: o }) => `${r}::${o}`;
  async function Ve({
    powerPreference: r = "high-performance",
    benchmark: o = !1,
    dumpShaders: e = !1,
  } = {}) {
    let a = { powerPreference: r, benchmark: o, dumpShaders: e },
      t = We(a),
      i = Qr.get(t);
    if (i) return i;
    if (Jr)
      e !== Se &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Se}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: m, globals: w } = await import("webgpu");
      (Object.assign(globalThis, w),
        (Jr = m(
          e
            ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
            : [],
        )),
        (Se = e));
    } else
      (e &&
        console.warn(
          "dumpShaders has no effect in the browser \u2014 see init()'s docs.",
        ),
        (Jr = navigator.gpu));
    if (!Jr) throw new Error("WebGPU not supported in this environment.");
    let s =
      (await Jr.requestAdapter({ powerPreference: r })) ??
      (await Jr.requestAdapter());
    if (!s) throw new Error("No WebGPU adapter found.");
    let n = [...(He(s, o).requiredFeatures ?? [])],
      d = await s.requestDevice({ requiredFeatures: n });
    d.addEventListener("uncapturederror", (m) => {
      console.error("Uncaptured GPU error:", m.error.message);
    });
    let l = n.includes("timestamp-query");
    return (
      le.set(d, { adapter: s, benchmark: l, options: a }),
      Qr.set(t, d),
      zr || (zr = d),
      d
    );
  }
  function Oe(r) {
    if (r === void 0) {
      for (let e of Qr.values()) e.destroy();
      (Qr.clear(), (zr = null));
      return;
    }
    let o = le.get(r);
    o &&
      (Qr.delete(We(o.options)),
      le.delete(r),
      r.destroy(),
      zr === r && (zr = Qr.values().next().value ?? null));
  }
  function Ke(r = zr) {
    let o = r && le.get(r);
    if (!o)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: a } = o.adapter.info;
    return { description: a || "unknown", device: e || "unknown" };
  }
  function Ce(r = zr) {
    return le.get(r)?.benchmark ?? !1;
  }
  function re() {
    if (!zr)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return zr;
  }
  function f(...r) {
    r.flat().forEach((o) => o.destroy());
  }
  function Ge(r, o, e) {
    let a = r.limits.maxStorageBufferBindingSize;
    if (o > a)
      throw new Error(
        `Buffer "${e}" needs ${o} bytes, exceeding this device's maxStorageBufferBindingSize (${a} bytes). The operands are too large for this device.`,
      );
  }
  function h(r, o, e = "blas-input", a = !1) {
    let t = o.byteLength;
    Ge(r, t, e);
    let i = a
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE,
      s = r.createBuffer({ label: e, size: t, usage: i, mappedAtCreation: !0 }),
      u = o.constructor;
    return (new u(s.getMappedRange()).set(o), s.unmap(), s);
  }
  function fr(r, o, e = "blas-storage", a = 0) {
    return (
      Ge(r, o, e),
      r.createBuffer({ label: e, size: o, usage: GPUBufferUsage.STORAGE | a })
    );
  }
  function Ar(r, o, e = "blas-result") {
    return (
      Ge(r, o, e),
      r.createBuffer({
        label: e,
        size: o,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  function E(r, o, e) {
    let a = r.createBuffer({
      label: "blas-readback",
      size: e.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (o.copyBufferToBuffer(e, 0, a, 0, e.size), a);
  }
  var ee = 16,
    Ue = new WeakMap();
  function ui(r) {
    let o = Ue.get(r);
    return (
      o ||
        ((o = r.createBuffer({
          label: "blas-vec4-fallback",
          size: ee,
          usage: GPUBufferUsage.STORAGE,
        })),
        Ue.set(r, o)),
      o
    );
  }
  function Dr(r, o) {
    let e = o instanceof GPUBuffer ? o : o.buffer,
      a = o instanceof GPUBuffer ? 0 : (o.offset ?? 0),
      t = o instanceof GPUBuffer ? o.size : (o.size ?? e.size - a),
      i = Math.floor(t / ee) * ee;
    return i < ee
      ? { buffer: ui(r), offset: 0, size: ee }
      : { buffer: e, offset: a, size: i };
  }
  function Ee(r, o, e, a) {
    if (o % 4 !== 0) return !1;
    let t = r instanceof GPUBuffer ? r : r.buffer,
      i = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      s = r instanceof GPUBuffer ? t.size : (r.size ?? t.size - i),
      u = Math.floor(s / ee) * 4;
    if (u <= 0) return !1;
    let n = (Math.max(e, 1) - 1) * o + (Math.max(a, 1) - 1);
    return Math.floor(n / 4) * 4 + 4 <= u;
  }
  function q(r, o, e = "blas-params") {
    let a = o.length * 4,
      t = Math.ceil(a / 16) * 16,
      i = new ArrayBuffer(t),
      s = new DataView(i);
    o.forEach(({ value: n, type: d }, l) => {
      let m = l * 4;
      if (d === "u32") s.setUint32(m, n, !0);
      else if (d === "i32") s.setInt32(m, n, !0);
      else if (d === "f32") s.setFloat32(m, n, !0);
      else
        throw new Error(
          `Unknown param type "${d}". Use "f32", "u32", or "i32".`,
        );
    });
    let u = r.createBuffer({
      label: e,
      size: t,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(u, 0, i), u);
  }
  async function G(r, o = Float32Array) {
    try {
      await r.mapAsync(GPUMapMode.READ);
      let e = new o(r.getMappedRange().slice());
      return (r.unmap(), e);
    } finally {
      r.destroy();
    }
  }
  function U(r) {
    let o = r.length,
      e = new Float32Array(o),
      a = new Float32Array(o);
    for (let t = 0; t < o; t++) {
      let i = Math.fround(r[t]);
      ((e[t] = i), (a[t] = Math.fround(r[t] - i)));
    }
    return { hi: e, lo: a };
  }
  function dr(r, o) {
    let e = r.length,
      a = new Float64Array(e);
    for (let t = 0; t < e; t++) a[t] = r[t] + o[t];
    return a;
  }
  var Vr = class {
      constructor(o, e) {
        ((this.re = o), (this.im = e));
      }
    },
    Lr = class extends Array {
      constructor(o) {
        if (o === void 0) {
          super();
          return;
        }
        if (typeof o == "number") {
          super(o);
          for (let a = 0; a < o; a++) this[a] = new Vr(0, 0);
          return;
        }
        let e = Array.from(o);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof Vr) {
            for (let a of e) {
              if (!(a instanceof Vr))
                throw new Error(
                  "Complex64Array expects every element to be a Complex64.",
                );
              this.push(a);
            }
            return;
          }
          if (e.length % 2 !== 0)
            throw new Error(
              "Complex64Array expects an even number of interleaved [re, im, ...] values.",
            );
          for (let a = 0; a < e.length; a += 2) {
            if (typeof e[a] != "number" || typeof e[a + 1] != "number")
              throw new Error(
                "Complex64Array expects interleaved [re, im, ...] values to be numbers.",
              );
            this.push(new Vr(e[a], e[a + 1]));
          }
        }
      }
    };
  function te(r, o = r.length) {
    let e = new Float32Array(o * 2);
    for (let a = 0; a < o; a++)
      ((e[a * 2] = r[a].re), (e[a * 2 + 1] = r[a].im));
    return e;
  }
  function he(r, o = r.length) {
    let e = new Float64Array(o),
      a = new Float64Array(o);
    for (let l = 0; l < o; l++) ((e[l] = r[l].re), (a[l] = r[l].im));
    let { hi: t, lo: i } = U(e),
      { hi: s, lo: u } = U(a),
      n = new Float32Array(o * 2),
      d = new Float32Array(o * 2);
    for (let l = 0; l < o; l++)
      ((n[l * 2] = t[l]),
        (n[l * 2 + 1] = s[l]),
        (d[l * 2] = i[l]),
        (d[l * 2 + 1] = u[l]));
    return { hi: n, lo: d };
  }
  function be(r, o) {
    let e = r.length / 2,
      a = new Float32Array(e),
      t = new Float32Array(e),
      i = new Float32Array(e),
      s = new Float32Array(e);
    for (let l = 0; l < e; l++)
      ((a[l] = r[l * 2]),
        (i[l] = r[l * 2 + 1]),
        (t[l] = o[l * 2]),
        (s[l] = o[l * 2 + 1]));
    let u = dr(a, t),
      n = dr(i, s),
      d = new Lr(e);
    for (let l = 0; l < e; l++) d[l] = new Vr(u[l], n[l]);
    return d;
  }
  var Or = class {
      constructor(o, e) {
        ((this.re = Math.fround(o)), (this.im = Math.fround(e)));
      }
    },
    Br = class extends Array {
      constructor(o) {
        if (o === void 0) {
          super();
          return;
        }
        if (typeof o == "number") {
          super(o);
          for (let a = 0; a < o; a++) this[a] = new Or(0, 0);
          return;
        }
        let e = Array.from(o);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof Or) {
            for (let a of e) {
              if (!(a instanceof Or))
                throw new Error(
                  "Complex32Array expects every element to be a Complex32.",
                );
              this.push(a);
            }
            return;
          }
          if (e.length % 2 !== 0)
            throw new Error(
              "Complex32Array expects an even number of interleaved [re, im, ...] values.",
            );
          for (let a = 0; a < e.length; a += 2) {
            if (typeof e[a] != "number" || typeof e[a + 1] != "number")
              throw new Error(
                "Complex32Array expects interleaved [re, im, ...] values to be numbers.",
              );
            this.push(new Or(e[a], e[a + 1]));
          }
        }
      }
    };
  var M = class r {
    constructor(o, e, a = Float32Array, t = null, i = null) {
      ((this._buf = o),
        (this._loBuf = t),
        (this.length = e),
        (this.dtype = a),
        (this.device = i ?? re()));
    }
    static from(o, e) {
      let a = o instanceof GPUDevice,
        t = a ? o : re(),
        i = a ? e : o;
      if (i instanceof Float64Array) {
        let { hi: u, lo: n } = U(i),
          d = h(t, u, "gpu-vector-f64-hi", !0),
          l = h(t, n, "gpu-vector-f64-lo", !0);
        return new r(d, i.length, Float64Array, l, t);
      }
      if (i instanceof Br) {
        let u = h(t, te(i), "gpu-vector-complex32", !0);
        return new r(u, i.length, Br, null, t);
      }
      if (i instanceof Lr) {
        let { hi: u, lo: n } = he(i),
          d = h(t, u, "gpu-vector-complex64-hi", !0),
          l = h(t, n, "gpu-vector-complex64-lo", !0);
        return new r(d, i.length, Lr, l, t);
      }
      if (!(i instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let s = h(t, i, "gpu-vector", !0);
      return new r(s, i.length, i.constructor, null, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = E(o, e, this._buf);
      if ((o.queue.submit([e.finish()]), this.dtype === Br))
        return new Br(await G(a, Float32Array));
      if (!this._loBuf) return G(a, this.dtype);
      let t = o.createCommandEncoder(),
        i = E(o, t, this._loBuf);
      o.queue.submit([t.finish()]);
      let [s, u] = await Promise.all([G(a, Float32Array), G(i, Float32Array)]);
      return this.dtype === Lr ? be(s, u) : dr(s, u);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var X = class r {
    constructor(
      o,
      e,
      a,
      t,
      i = null,
      s = "row-major",
      u = null,
      n = Float32Array,
    ) {
      ((this._buf = o),
        (this._loBuf = i),
        (this.rows = e),
        (this.cols = a),
        (this.lda = t),
        (this.layout = s),
        (this.dtype = n),
        (this.device = u ?? re()));
    }
    static from(o, ...e) {
      let a = o instanceof GPUDevice,
        t = a ? o : re(),
        i = a ? e.shift() : o,
        [s, u, n, d = "row-major"] = e;
      if (d !== "row-major" && d !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let l = d === "row-major";
      if (
        (n === void 0 && (n = l ? u : s),
        !(i instanceof Float32Array) &&
          !(i instanceof Float64Array) &&
          !(i instanceof Br) &&
          !(i instanceof Lr))
      )
        throw new Error(
          "GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      if (!Number.isInteger(s) || s <= 0)
        throw new Error("rows must be a positive integer.");
      if (!Number.isInteger(u) || u <= 0)
        throw new Error("cols must be a positive integer.");
      let m = l ? u : s;
      if (!Number.isInteger(n) || n < m)
        throw new Error(`lda must be an integer >= ${l ? "cols" : "rows"}.`);
      let w = l ? s : u;
      if (i.length < w * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (i instanceof Float64Array) {
        let p = w * n,
          { hi: g, lo: y } = U(i.subarray(0, p)),
          b = h(t, g, "gpu-matrix-f64-hi", !0),
          x = h(t, y, "gpu-matrix-f64-lo", !0);
        return new r(b, s, u, n, x, d, t, Float64Array);
      }
      if (i instanceof Br) {
        let p = h(t, te(i, w * n), "gpu-matrix-complex32", !0);
        return new r(p, s, u, n, null, d, t, Br);
      }
      if (i instanceof Lr) {
        let { hi: p, lo: g } = he(i, w * n),
          y = h(t, p, "gpu-matrix-complex64-hi", !0),
          b = h(t, g, "gpu-matrix-complex64-lo", !0);
        return new r(y, s, u, n, b, d, t, Lr);
      }
      let c = h(t, i.subarray(0, w * n), "gpu-matrix", !0);
      return new r(c, s, u, n, null, d, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = E(o, e, this._buf);
      o.queue.submit([e.finish()]);
      let t = this.layout !== "column-major",
        i = t ? this.rows : this.cols,
        s = t ? this.cols : this.rows;
      if (this.dtype === Br) {
        let d = new Br(await G(a, Float32Array));
        if (this.lda === s) return d;
        let l = new Br(i * s);
        for (let m = 0; m < i; m++)
          for (let w = 0; w < s; w++) l[m * s + w] = d[m * this.lda + w];
        return l;
      }
      if (this._loBuf) {
        let d = o.createCommandEncoder(),
          l = E(o, d, this._loBuf);
        o.queue.submit([d.finish()]);
        let [m, w] = await Promise.all([
          G(a, Float32Array),
          G(l, Float32Array),
        ]);
        if (this.dtype === Lr) {
          let g = be(m, w);
          if (this.lda === s) return g;
          let y = new Lr(i * s);
          for (let b = 0; b < i; b++)
            for (let x = 0; x < s; x++) y[b * s + x] = g[b * this.lda + x];
          return y;
        }
        let c = dr(m, w);
        if (this.lda === s) return c;
        let p = new Float64Array(i * s);
        for (let g = 0; g < i; g++)
          p.set(c.subarray(g * this.lda, g * this.lda + s), g * s);
        return p;
      }
      let u = await G(a, Float32Array);
      if (this.lda === s) return u;
      let n = new Float32Array(i * s);
      for (let d = 0; d < i; d++)
        n.set(u.subarray(d * this.lda, d * this.lda + s), d * s);
      return n;
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  function ze(r) {
    let o = r >>> 0;
    return function () {
      o = (o + 1831565813) | 0;
      let e = Math.imul(o ^ (o >>> 15), 1 | o);
      return (
        (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
        ((e ^ (e >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function Ye(r, o = -1, e = 1, a) {
    let t = new Float32Array(r),
      i = a === void 0 ? Math.random : ze(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function Ze(r, o = -1, e = 1, a) {
    let t = new Float64Array(r),
      i = a === void 0 ? Math.random : ze(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function Xe(
    r,
    o,
    e = "lower",
    a = -1,
    t = 1,
    i = 5,
    s = 15,
    u = "row-major",
  ) {
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (o < r) throw new Error("lda must be >= n.");
    let n = u === "column-major",
      d = (m, w) => (n ? w * o + m : m * o + w),
      l = new Float32Array(r * o);
    for (let m = 0; m < r; m++) {
      for (let w = 0; w < r; w++) {
        if (m === w) continue;
        (e === "lower" ? w < m : w > m) &&
          (l[d(m, w)] = a + Math.random() * (t - a));
      }
      l[d(m, m)] = i + Math.random() * (s - i);
    }
    return l;
  }
  function D(r, o, e, a = 0) {
    let t = e.map((i, s) => ({
      binding: a + s,
      resource: i instanceof GPUBuffer ? { buffer: i } : i,
    }));
    return r.createBindGroup({ layout: o, entries: t });
  }
  function F(r, o) {
    r.queue.submit([o.finish()]);
  }
  function Mr(r) {
    let { querySet: o, passDescriptor: e } = Te(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: o,
      passDescriptor: e,
    };
  }
  function hr(r, o, e, a, t) {
    let i = r.beginComputePass(t);
    (i.setPipeline(o),
      i.setBindGroup(0, e),
      typeof a == "number"
        ? i.dispatchWorkgroups(a)
        : i.dispatchWorkgroups(a.x, a.y, a.z ?? 1),
      i.end());
  }
  function O(r, o, e, a) {
    let { commandEncoder: t, querySet: i, passDescriptor: s } = Mr(r);
    hr(t, o, e, a, s);
    let u = kr(r, t, i);
    return { commandEncoder: t, ts: u };
  }
  var vs = {},
    Ie = new WeakMap();
  async function P(r, o, e = "main") {
    Ie.has(r) || Ie.set(r, new Map());
    let a = Ie.get(r),
      t = Array.isArray(o) ? o : [o],
      i = `${t.join("+")}::${e}`;
    if (!a.has(i)) {
      let s = xs(r, t, e).catch((u) => {
        throw (a.delete(i), u);
      });
      a.set(i, s);
    }
    return a.get(i);
  }
  async function ys(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: o } = await Promise.resolve().then(() => (ea(), ra)),
        e = o[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: o } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: a, join: t } = await import("path"),
        i = a(e(vs.url));
      return o(t(i, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function xs(r, o, e = "main") {
    let a = o.join("+"),
      t = await Promise.all(o.map(ys)),
      i = 0,
      s = t.map((p, g) => {
        let y = p.split(`
`).length,
          b = { name: o[g], startLine: i + 1, endLine: i + y };
        return ((i += y), b);
      }),
      u = (p) => {
        let g = p && s.find((y) => p >= y.startLine && p <= y.endLine);
        return g ? `${g.name}.wgsl:${p - g.startLine + 1}` : `line ${p}`;
      },
      n = t.join(`
`),
      d = r.createShaderModule({ label: a, code: n }),
      m = (await d.getCompilationInfo()).messages.filter(
        (p) => p.type === "error",
      );
    if (m.length > 0)
      throw new Error(`Shader "${a}" compilation failed:
${m.map((p) => `  ${u(p.lineNum)}: ${p.message}`).join(`
`)}`);
    let w = e === "main" ? { module: d } : { module: d, entryPoint: e },
      c = r.createComputePipeline({ label: a, layout: "auto", compute: w });
    return ((c._shaderModule = d), c);
  }
  function br(r, o, e) {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(o / 64), a)
      : { x: Math.min(Math.ceil(e / 8), a), y: Math.min(Math.ceil(o / 8), a) };
  }
  function or(r, o, e, a = "x") {
    let t = r.limits.maxComputeWorkgroupsPerDimension;
    if (o > t)
      throw new Error(
        `${e}: this problem needs ${o} workgroups in ${a}, but the device allows ${t} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return o;
  }
  function Yr(r, o, e, a) {
    return a === void 0
      ? or(r, Math.ceil(e / 64), o)
      : {
          x: or(r, Math.ceil(a / 8), o, "x"),
          y: or(r, Math.ceil(e / 8), o, "y"),
        };
  }
  function H(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function T(r, o, e) {
    for (let [a, t] of Object.entries(e))
      if (!(!(t instanceof M) && !(t instanceof X)) && t.device !== r)
        throw new Error(
          `${o}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function ta(r, o, e, a, t) {
    let i = a instanceof M;
    if (
      (H(r),
      T(r, "sscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Float32Array) && !(a instanceof M))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (o <= 0) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await P(r, "sscal"),
      u = null,
      n = null,
      d = null;
    try {
      ((u = i ? a._buf : h(r, a, "sscal-x", !0)),
        (n = q(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
          ],
          "sscal-params",
        )));
      let l = D(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: w } = O(r, s, l, br(r, o));
      ((d = i ? null : E(r, m, u)), F(r, m));
      let c = await j(w);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await G(d, Float32Array);
      return ((d = null), c !== void 0 ? { x: p, gpuTimeMs: c } : { x: p });
    } finally {
      (!i && u && f(u), n && f(n), d && f(d));
    }
  }
  async function oa(r, o, e, a, t) {
    let i = a instanceof M;
    if (
      (H(r),
      T(r, "cscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof Or)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Br) && !i)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (i && a.dtype !== Br)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (o <= 0) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await P(r, "cscal"),
      u = null,
      n = null,
      d = null;
    try {
      ((u = i ? a._buf : h(r, te(a), "cscal-x", !0)),
        (n = q(
          r,
          [
            { value: o, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: t, type: "u32" },
          ],
          "cscal-params",
        )));
      let l = D(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: w } = O(r, s, l, br(r, o));
      ((d = i ? null : E(r, m, u)), F(r, m));
      let c = await j(w);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await G(d, Float32Array);
      d = null;
      let g = new Br(p);
      return c !== void 0 ? { x: g, gpuTimeMs: c } : { x: g };
    } finally {
      (!i && u && f(u), n && f(n), d && f(d));
    }
  }
  async function aa(r, o, e, a, t) {
    let i = a instanceof M;
    if ((H(r), !Number.isInteger(o) || !Number.isInteger(t)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (i && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) throw new Error("incx must be positive.");
    if ((T(r, "dscal", { x: a }), o <= 0)) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let u = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: d } = U(new Float64Array([e])),
      l = null,
      m = null,
      w = null,
      c = null,
      p = null;
    try {
      if (i) ((l = a._buf), (m = a._loBuf));
      else {
        let { hi: S, lo: _ } = U(a);
        ((l = h(r, S, "dscal-xHi", !0)), (m = h(r, _, "dscal-xLo", !0)));
      }
      w = q(
        r,
        [
          { value: o, type: "u32" },
          { value: n[0], type: "f32" },
          { value: d[0], type: "f32" },
          { value: t, type: "u32" },
        ],
        "dscal-params",
      );
      let g = D(r, u.getBindGroupLayout(0), [l, m, w]),
        { commandEncoder: y, ts: b } = O(r, u, g, br(r, o));
      ((c = i ? null : E(r, y, l)), (p = i ? null : E(r, y, m)), F(r, y));
      let x = await j(b);
      if (i) return x !== void 0 ? { gpuTimeMs: x } : {};
      let v = await G(c, Float32Array);
      c = null;
      let B = await G(p, Float32Array);
      p = null;
      let A = dr(v, B);
      return x !== void 0 ? { x: A, gpuTimeMs: x } : { x: A };
    } finally {
      (!i && l && f(l), !i && m && f(m), w && f(w), c && f(c), p && f(p));
    }
  }
  async function ia(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "sswap", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof M))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(t instanceof Float32Array) && !(t instanceof M))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (e.constructor !== t.constructor)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return s ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await P(r, "sswap"),
      d = null,
      l = null,
      m = null,
      w = null,
      c = null;
    try {
      ((d = s ? e._buf : h(r, e, "sswap-x", !0)),
        (l = u ? t._buf : h(r, t, "sswap-y", !0)),
        (m = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sswap-params",
        )));
      let p = D(r, n.getBindGroupLayout(0), [d, l, m]),
        { commandEncoder: g, ts: y } = O(r, n, p, br(r, o));
      ((w = s ? null : E(r, g, d)), (c = u ? null : E(r, g, l)), F(r, g));
      let b = await j(y);
      if (s) return b !== void 0 ? { gpuTimeMs: b } : {};
      let x = await G(w, Float32Array);
      w = null;
      let v = await G(c, Float32Array);
      return (
        (c = null),
        b !== void 0 ? { x, y: v, gpuTimeMs: b } : { x, y: v }
      );
    } finally {
      (!s && d && f(d), !u && l && f(l), m && f(m), w && f(w), c && f(c));
    }
  }
  async function sa(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "dswap", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0) return s ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await P(r, "dswap"),
      d = null,
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      b = null;
    try {
      if (s) ((d = e._buf), (l = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let R = U(e),
          W = U(t);
        ((d = h(r, R.hi, "dswap-xHi", !0)),
          (l = h(r, R.lo, "dswap-xLo", !0)),
          (m = h(r, W.hi, "dswap-yHi", !0)),
          (w = h(r, W.lo, "dswap-yLo", !0)));
      }
      c = q(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dswap-params",
      );
      let x = D(r, n.getBindGroupLayout(0), [d, l, m, w, c]),
        { commandEncoder: v, ts: B } = O(r, n, x, br(r, o));
      ((p = s ? null : E(r, v, d)),
        (g = s ? null : E(r, v, l)),
        (y = u ? null : E(r, v, m)),
        (b = u ? null : E(r, v, w)),
        F(r, v));
      let A = await j(B);
      if (s) return A !== void 0 ? { gpuTimeMs: A } : {};
      let S = await G(p, Float32Array);
      p = null;
      let _ = await G(g, Float32Array);
      g = null;
      let N = await G(y, Float32Array);
      y = null;
      let I = await G(b, Float32Array);
      b = null;
      let k = dr(S, _),
        L = dr(N, I);
      return A !== void 0 ? { x: k, y: L, gpuTimeMs: A } : { x: k, y: L };
    } finally {
      (!s && d && f(d),
        !s && l && f(l),
        !u && m && f(m),
        !u && w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y),
        b && f(b));
    }
  }
  async function na(r, o, e, a, t, i, s) {
    let u = a instanceof M,
      n = i instanceof M;
    if (
      (H(r),
      T(r, "saxpy", { x: a, y: i }),
      !Number.isInteger(o) || !Number.isInteger(t) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return n ? {} : { y: i };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (o - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let d = await P(r, "saxpy"),
      l = null,
      m = null,
      w = null,
      c = null;
    try {
      ((l = u ? a._buf : h(r, a, "saxpy-x", !1)),
        (m = n ? i._buf : h(r, i, "saxpy-y", !0)),
        (w = q(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
            { value: s, type: "u32" },
          ],
          "saxpy-params",
        )));
      let p = D(r, d.getBindGroupLayout(0), [l, m, w]),
        { commandEncoder: g, ts: y } = O(r, d, p, br(r, o));
      ((c = n ? null : E(r, g, m)), F(r, g));
      let b = await j(y);
      if (n) return b !== void 0 ? { gpuTimeMs: b } : {};
      let x = await G(c, Float32Array);
      return ((c = null), b !== void 0 ? { y: x, gpuTimeMs: b } : { y: x });
    } finally {
      (!u && l && f(l), !n && m && f(m), w && f(w), c && f(c));
    }
  }
  async function la(r, o, e, a, t, i, s) {
    let u = a instanceof M,
      n = i instanceof M;
    if (
      (H(r),
      !Number.isInteger(o) || !Number.isInteger(t) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(i instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && i.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if ((T(r, "daxpy", { x: a, y: i }), o <= 0)) return n ? {} : { y: i };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (o - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: m, lo: w } = U(new Float64Array([e])),
      c = null,
      p = null,
      g = null,
      y = null,
      b = null,
      x = null,
      v = null;
    try {
      if (u) ((c = a._buf), (p = a._loBuf), (g = i._buf), (y = i._loBuf));
      else {
        let L = U(a),
          R = U(i);
        ((c = h(r, L.hi, "daxpy-xHi", !1)),
          (p = h(r, L.lo, "daxpy-xLo", !1)),
          (g = h(r, R.hi, "daxpy-yHi", !0)),
          (y = h(r, R.lo, "daxpy-yLo", !0)));
      }
      b = q(
        r,
        [
          { value: o, type: "u32" },
          { value: m[0], type: "f32" },
          { value: w[0], type: "f32" },
          { value: t, type: "u32" },
          { value: s, type: "u32" },
        ],
        "daxpy-params",
      );
      let B = D(r, l.getBindGroupLayout(0), [c, p, g, y, b]),
        { commandEncoder: A, ts: S } = O(r, l, B, br(r, o));
      ((x = n ? null : E(r, A, g)), (v = n ? null : E(r, A, y)), F(r, A));
      let _ = await j(S);
      if (n) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let N = await G(x, Float32Array);
      x = null;
      let I = await G(v, Float32Array);
      v = null;
      let k = dr(N, I);
      return _ !== void 0 ? { y: k, gpuTimeMs: _ } : { y: k };
    } finally {
      (!u && c && f(c),
        !u && p && f(p),
        !n && g && f(g),
        !n && y && f(y),
        b && f(b),
        x && f(x),
        v && f(v));
    }
  }
  async function ua(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "scopy", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return u ? {} : { y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await P(r, "scopy"),
      d = null,
      l = null,
      m = null,
      w = null;
    try {
      ((d = s ? e._buf : h(r, e, "scopy-x", !1)),
        (l = u ? t._buf : h(r, t, "scopy-y", !0)),
        (m = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "scopy-params",
        )));
      let c = D(r, n.getBindGroupLayout(0), [d, l, m]),
        { commandEncoder: p, ts: g } = O(r, n, c, br(r, o));
      ((w = u ? null : E(r, p, l)), F(r, p));
      let y = await j(g);
      if (u) return y !== void 0 ? { gpuTimeMs: y } : {};
      let b = await G(w, Float32Array);
      return ((w = null), y !== void 0 ? { y: b, gpuTimeMs: y } : { y: b });
    } finally {
      (!s && d && f(d), !u && l && f(l), m && f(m), w && f(w));
    }
  }
  async function da(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "dcopy", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0) return u ? {} : { y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await P(r, "dcopy"),
      d = null,
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      if (s) ((d = e._buf), (l = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let _ = U(e),
          N = U(t);
        ((d = h(r, _.hi, "dcopy-xHi", !1)),
          (l = h(r, _.lo, "dcopy-xLo", !1)),
          (m = h(r, N.hi, "dcopy-yHi", !0)),
          (w = h(r, N.lo, "dcopy-yLo", !0)));
      }
      c = q(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dcopy-params",
      );
      let y = D(r, n.getBindGroupLayout(0), [d, l, m, w, c]),
        { commandEncoder: b, ts: x } = O(r, n, y, br(r, o));
      ((p = u ? null : E(r, b, m)), (g = u ? null : E(r, b, w)), F(r, b));
      let v = await j(x);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let B = await G(p, Float32Array);
      p = null;
      let A = await G(g, Float32Array);
      g = null;
      let S = dr(B, A);
      return v !== void 0 ? { y: S, gpuTimeMs: v } : { y: S };
    } finally {
      (!s && d && f(d),
        !s && l && f(l),
        !u && m && f(m),
        !u && w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function fa(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "sdot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return { dot: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await P(r, "sdot"),
      d = await P(r, "reduction/sum"),
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((l = s ? e._buf : h(r, e, "sdot-x", !1)),
        (m = u ? t._buf : h(r, t, "sdot-y", !1)),
        (w = fr(r, 512, "sdot-partials")),
        (c = Ar(r, 4, "sdot-result")),
        (p = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sdot-params",
        )));
      let y = D(r, n.getBindGroupLayout(0), [l, m, w, p]),
        { commandEncoder: b, ts: x } = O(r, n, y, 128);
      F(r, b);
      let v = D(r, d.getBindGroupLayout(0), [w, c]),
        { commandEncoder: B, ts: A } = O(r, d, v, 1);
      ((g = E(r, B, c)), F(r, B));
      let S = G(g, Float32Array);
      g = null;
      let [_, N, I] = await Promise.all([j(x), j(A), S]);
      return _ !== void 0 && N !== void 0
        ? { dot: I[0], gpuTimeMs: _ + N }
        : { dot: I[0] };
    } finally {
      (!s && l && f(l),
        !u && m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function ma(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "sasum", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (o <= 0) return { asum: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await P(r, "sasum"),
      s = await P(r, "reduction/sum"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null;
    try {
      ((u = t ? e._buf : h(r, e, "sasum-x", !1)),
        (n = fr(r, 512, "sasum-partials")),
        (d = Ar(r, 4, "sasum-result")),
        (l = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "sasum-params",
        )));
      let w = D(r, i.getBindGroupLayout(0), [u, n, l]),
        { commandEncoder: c, ts: p } = O(r, i, w, 128);
      F(r, c);
      let g = D(r, s.getBindGroupLayout(0), [n, d]),
        { commandEncoder: y, ts: b } = O(r, s, g, 1);
      ((m = E(r, y, d)), F(r, y));
      let x = G(m, Float32Array);
      m = null;
      let [v, B, A] = await Promise.all([j(p), j(b), x]);
      return v !== void 0 && B !== void 0
        ? { asum: A[0], gpuTimeMs: v + B }
        : { asum: A[0] };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m));
    }
  }
  async function ca(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "dasum", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (o <= 0) return { asum: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = ["f64/dekker", "f64/utils/abs", "f64/utils/add"],
      s = await P(r, [...i, "dasum"]),
      u = await P(r, [...i, "reduction/sumF64"]),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: V, lo: C } = U(e.map(Math.abs));
        ((n = h(r, V, "dasum-xHi", !1)), (d = h(r, C, "dasum-xLo", !1)));
      }
      ((l = fr(r, 512, "dasum-partialsHi")),
        (m = fr(r, 512, "dasum-partialsLo")),
        (w = Ar(r, 4, "dasum-result-hi")),
        (c = Ar(r, 4, "dasum-result-lo")),
        (p = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dasum-params",
        )));
      let b = D(r, s.getBindGroupLayout(0), [n, d, l, m, p]),
        { commandEncoder: x, ts: v } = O(r, s, b, 128);
      F(r, x);
      let B = D(r, u.getBindGroupLayout(0), [l, m, w, c]),
        { commandEncoder: A, ts: S } = O(r, u, B, 1);
      ((g = E(r, A, w)), (y = E(r, A, c)), F(r, A));
      let _ = G(g, Float32Array),
        N = G(y, Float32Array);
      ((g = null), (y = null));
      let [I, k, L, R] = await Promise.all([j(v), j(S), _, N]),
        W = dr(L, R)[0];
      return I !== void 0 && k !== void 0
        ? { asum: W, gpuTimeMs: I + k }
        : { asum: W };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y));
    }
  }
  async function pa(r, o, e, a, t, i) {
    let s = e instanceof M,
      u = t instanceof M;
    if (
      (H(r),
      T(r, "ddot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!u && !(t instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0) return { dot: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = ["f64/dekker", "f64/utils/add"],
      d = await P(r, [...n, "f64/utils/multiply", "ddot"]),
      l = await P(r, [...n, "reduction/sumF64"]),
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      b = null,
      x = null,
      v = null,
      B = null,
      A = null;
    try {
      if (s) ((m = e._buf), (w = e._loBuf), (c = t._buf), (p = t._loBuf));
      else {
        let $ = U(e),
          J = U(t);
        ((m = h(r, $.hi, "ddot-xHi", !1)),
          (w = h(r, $.lo, "ddot-xLo", !1)),
          (c = h(r, J.hi, "ddot-yHi", !1)),
          (p = h(r, J.lo, "ddot-yLo", !1)));
      }
      ((g = fr(r, 512, "ddot-partialsHi")),
        (y = fr(r, 512, "ddot-partialsLo")),
        (b = Ar(r, 4, "ddot-result-hi")),
        (x = Ar(r, 4, "ddot-result-lo")),
        (v = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "ddot-params",
        )));
      let S = D(r, d.getBindGroupLayout(0), [m, w, c, p, g, y, v]),
        { commandEncoder: _, ts: N } = O(r, d, S, 128);
      F(r, _);
      let I = D(r, l.getBindGroupLayout(0), [g, y, b, x]),
        { commandEncoder: k, ts: L } = O(r, l, I, 1);
      ((B = E(r, k, b)), (A = E(r, k, x)), F(r, k));
      let R = G(B, Float32Array),
        W = G(A, Float32Array);
      ((B = null), (A = null));
      let [V, C, z, K] = await Promise.all([j(N), j(L), R, W]),
        Y = dr(z, K)[0];
      return V !== void 0 && C !== void 0
        ? { dot: Y, gpuTimeMs: V + C }
        : { dot: Y };
    } finally {
      (!s && m && f(m),
        !s && w && f(w),
        !u && c && f(c),
        !u && p && f(p),
        g && f(g),
        y && f(y),
        b && f(b),
        x && f(x),
        v && f(v),
        B && f(B),
        A && f(A));
    }
  }
  async function wa(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "snrm2", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (o <= 0) return { nrm2: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await P(r, "snrm2"),
      s = await P(r, "reduction/scaledSum"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null,
      w = null;
    try {
      ((u = t ? e._buf : h(r, e, "snrm2-x", !1)),
        (n = fr(r, 512, "snrm2-partials-scale")),
        (d = fr(r, 512, "snrm2-partials-ssq")),
        (l = Ar(r, 4, "snrm2-result")),
        (m = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "snrm2-params",
        )));
      let c = D(r, i.getBindGroupLayout(0), [u, n, d, m]),
        { commandEncoder: p, ts: g } = O(r, i, c, 128);
      F(r, p);
      let y = D(r, s.getBindGroupLayout(0), [n, d, l]),
        { commandEncoder: b, ts: x } = O(r, s, y, 1);
      ((w = E(r, b, l)), F(r, b));
      let v = G(w, Float32Array);
      w = null;
      let [B, A, S] = await Promise.all([j(g), j(x), v]),
        _ = S[0];
      return B !== void 0 && A !== void 0
        ? { nrm2: _, gpuTimeMs: B + A }
        : { nrm2: _ };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m), w && f(w));
    }
  }
  async function ga(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "dnrm2", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (o <= 0) return { nrm2: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
        "f64/utils/sqrt",
      ],
      s = await P(r, [...i, "dnrm2"]),
      u = await P(r, [...i, "reduction/scaledSumF64"]),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      b = null,
      x = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: z, lo: K } = U(e);
        ((n = h(r, z, "dnrm2-xHi", !1)), (d = h(r, K, "dnrm2-xLo", !1)));
      }
      ((l = fr(r, 512, "dnrm2-partials-scaleHi")),
        (m = fr(r, 512, "dnrm2-partials-scaleLo")),
        (w = fr(r, 512, "dnrm2-partials-ssqHi")),
        (c = fr(r, 512, "dnrm2-partials-ssqLo")),
        (p = Ar(r, 4, "dnrm2-result-hi")),
        (g = Ar(r, 4, "dnrm2-result-lo")),
        (y = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let v = D(r, s.getBindGroupLayout(0), [n, d, l, m, w, c, y]),
        { commandEncoder: B, ts: A } = O(r, s, v, 128);
      F(r, B);
      let S = D(r, u.getBindGroupLayout(0), [l, m, w, c, p, g]),
        { commandEncoder: _, ts: N } = O(r, u, S, 1);
      ((b = E(r, _, p)), (x = E(r, _, g)), F(r, _));
      let I = G(b, Float32Array),
        k = G(x, Float32Array);
      ((b = null), (x = null));
      let [L, R, W, V] = await Promise.all([j(A), j(N), I, k]),
        C = dr(W, V)[0];
      return L !== void 0 && R !== void 0
        ? { nrm2: C, gpuTimeMs: L + R }
        : { nrm2: C };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y),
        b && f(b),
        x && f(x));
    }
  }
  async function ha(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "isamax", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (o <= 0) return { index: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await P(r, "isamax"),
      s = await P(r, "reduction/argmax"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null,
      w = null;
    try {
      ((u = t ? e._buf : h(r, e, "isamax-x", !1)),
        (n = fr(r, 512, "isamax-partials-val")),
        (d = fr(r, 512, "isamax-partials-idx")),
        (l = Ar(r, 4, "isamax-result")),
        (m = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "isamax-params",
        )));
      let c = D(r, i.getBindGroupLayout(0), [u, n, d, m]),
        { commandEncoder: p, ts: g } = O(r, i, c, 128);
      F(r, p);
      let y = D(r, s.getBindGroupLayout(0), [n, d, l]),
        { commandEncoder: b, ts: x } = O(r, s, y, 1);
      ((w = E(r, b, l)), F(r, b));
      let v = G(w, Uint32Array);
      w = null;
      let [B, A, S] = await Promise.all([j(g), j(x), v]),
        _ = S[0];
      return B !== void 0 && A !== void 0
        ? { index: _, gpuTimeMs: B + A }
        : { index: _ };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m), w && f(w));
    }
  }
  async function ba(r, o, e, a) {
    let t = e instanceof M;
    if (
      (H(r),
      T(r, "idamax", { x: e }),
      !Number.isInteger(o) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (o <= 0) return { index: 0 };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/equal",
      ],
      s = await P(r, [...i, "idamax"], "idamax_main"),
      u = await P(r, [...i, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: L, lo: R } = U(e);
        ((n = h(r, L, "idamax-xHi", !1)), (d = h(r, R, "idamax-xLo", !1)));
      }
      ((l = fr(r, 512, "idamax-partials-val-hi")),
        (m = fr(r, 512, "idamax-partials-val-lo")),
        (w = fr(r, 512, "idamax-partials-idx")),
        (c = Ar(r, 4, "idamax-result")),
        (p = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "idamax-params",
        )));
      let y = D(r, s.getBindGroupLayout(0), [n, d, l, m, w, p]),
        { commandEncoder: b, ts: x } = O(r, s, y, 128);
      F(r, b);
      let v = D(r, u.getBindGroupLayout(0), [l, m, w, c]),
        { commandEncoder: B, ts: A } = O(r, u, v, 1);
      ((g = E(r, B, c)), F(r, B));
      let S = G(g, Uint32Array);
      g = null;
      let [_, N, I] = await Promise.all([j(x), j(A), S]),
        k = I[0];
      return _ !== void 0 && N !== void 0
        ? { index: k, gpuTimeMs: _ + N }
        : { index: k };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function ya(r, o, e, a, t, i, s, u) {
    let n = e instanceof M,
      d = t instanceof M;
    if (
      (H(r),
      T(r, "srot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!n && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!d && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (n !== d)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return n ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await P(r, "srot"),
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((m = n ? e._buf : h(r, e, "srot-x", !0)),
        (w = d ? t._buf : h(r, t, "srot-y", !0)),
        (c = q(
          r,
          [
            { value: o, type: "u32" },
            { value: s, type: "f32" },
            { value: u, type: "f32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srot-params",
        )));
      let y = D(r, l.getBindGroupLayout(0), [m, w, c]),
        { commandEncoder: b, ts: x } = O(r, l, y, br(r, o));
      ((p = n ? null : E(r, b, m)), (g = d ? null : E(r, b, w)), F(r, b));
      let v = await j(x);
      if (n) return v !== void 0 ? { gpuTimeMs: v } : {};
      let B = G(p, Float32Array),
        A = G(g, Float32Array);
      ((p = null), (g = null));
      let [S, _] = await Promise.all([B, A]);
      return v !== void 0 ? { x: S, y: _, gpuTimeMs: v } : { x: S, y: _ };
    } finally {
      (!n && m && f(m), !d && w && f(w), c && f(c), p && f(p), g && f(g));
    }
  }
  async function xa(r, o, e, a, t, i, s, u) {
    let n = e instanceof M,
      d = t instanceof M;
    if (
      (H(r),
      T(r, "drot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !n)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !d)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (n && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (d && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (n !== d)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0) return n ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let m = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drot",
      ]),
      { hi: w, lo: c } = U(new Float64Array([s])),
      { hi: p, lo: g } = U(new Float64Array([u])),
      y = null,
      b = null,
      x = null,
      v = null,
      B = null,
      A = null,
      S = null,
      _ = null,
      N = null;
    try {
      if (n) ((y = e._buf), (b = e._loBuf), (x = t._buf), (v = t._loBuf));
      else {
        let $ = U(e),
          J = U(t);
        ((y = h(r, $.hi, "drot-xHi", !0)),
          (b = h(r, $.lo, "drot-xLo", !0)),
          (x = h(r, J.hi, "drot-yHi", !0)),
          (v = h(r, J.lo, "drot-yLo", !0)));
      }
      B = q(
        r,
        [
          { value: o, type: "u32" },
          { value: w[0], type: "f32" },
          { value: c[0], type: "f32" },
          { value: p[0], type: "f32" },
          { value: g[0], type: "f32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "drot-params",
      );
      let I = D(r, m.getBindGroupLayout(0), [y, b, x, v, B]),
        { commandEncoder: k, ts: L } = O(r, m, I, br(r, o));
      ((A = n ? null : E(r, k, y)),
        (S = n ? null : E(r, k, b)),
        (_ = d ? null : E(r, k, x)),
        (N = d ? null : E(r, k, v)),
        F(r, k));
      let R = await j(L);
      if (n) return R !== void 0 ? { gpuTimeMs: R } : {};
      let W = await G(A, Float32Array);
      A = null;
      let V = await G(S, Float32Array);
      S = null;
      let C = await G(_, Float32Array);
      _ = null;
      let z = await G(N, Float32Array);
      N = null;
      let K = dr(W, V),
        Y = dr(C, z);
      return R !== void 0 ? { x: K, y: Y, gpuTimeMs: R } : { x: K, y: Y };
    } finally {
      (!n && y && f(y),
        !n && b && f(b),
        !d && x && f(x),
        !d && v && f(v),
        B && f(B),
        A && f(A),
        S && f(S),
        _ && f(_),
        N && f(N));
    }
  }
  async function va(r, o, e, a, t, i, s) {
    let u = e instanceof M,
      n = t instanceof M;
    if (
      (H(r),
      T(r, "srotm", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float32Array) || s.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0 || s[0] === -2) return u ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let d = await P(r, "srotm"),
      l = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((l = u ? e._buf : h(r, e, "srotm-x", !0)),
        (m = n ? t._buf : h(r, t, "srotm-y", !0)),
        (w = h(r, s, "srotm-param", !1)),
        (c = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srotm-params",
        )));
      let y = D(r, d.getBindGroupLayout(0), [l, m, w, c]),
        { commandEncoder: b, ts: x } = O(r, d, y, br(r, o));
      ((p = u ? null : E(r, b, l)), (g = n ? null : E(r, b, m)), F(r, b));
      let v = await j(x);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let B = G(p, Float32Array),
        A = G(g, Float32Array);
      ((p = null), (g = null));
      let [S, _] = await Promise.all([B, A]);
      return v !== void 0 ? { x: S, y: _, gpuTimeMs: v } : { x: S, y: _ };
    } finally {
      (!u && l && f(l),
        !n && m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function _a(r, o, e, a, t, i, s) {
    let u = e instanceof M,
      n = t instanceof M;
    if (
      (H(r),
      T(r, "drotm", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float64Array) || s.length !== 5)
      throw new Error("param must be a Float64Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0 || s[0] === -2) return u ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drotm",
      ]),
      { hi: m, lo: w } = U(s),
      c = null,
      p = null,
      g = null,
      y = null,
      b = null,
      x = null,
      v = null,
      B = null,
      A = null,
      S = null,
      _ = null;
    try {
      if (u) ((c = e._buf), (p = e._loBuf), (g = t._buf), (y = t._loBuf));
      else {
        let Y = U(e),
          $ = U(t);
        ((c = h(r, Y.hi, "drotm-xHi", !0)),
          (p = h(r, Y.lo, "drotm-xLo", !0)),
          (g = h(r, $.hi, "drotm-yHi", !0)),
          (y = h(r, $.lo, "drotm-yLo", !0)));
      }
      ((b = h(r, m, "drotm-paramHi", !1)),
        (x = h(r, w, "drotm-paramLo", !1)),
        (v = q(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "drotm-params",
        )));
      let N = D(r, l.getBindGroupLayout(0), [c, p, g, y, b, x, v]),
        { commandEncoder: I, ts: k } = O(r, l, N, br(r, o));
      ((B = u ? null : E(r, I, c)),
        (A = u ? null : E(r, I, p)),
        (S = n ? null : E(r, I, g)),
        (_ = n ? null : E(r, I, y)),
        F(r, I));
      let L = await j(k);
      if (u) return L !== void 0 ? { gpuTimeMs: L } : {};
      let R = await G(B, Float32Array);
      B = null;
      let W = await G(A, Float32Array);
      A = null;
      let V = await G(S, Float32Array);
      S = null;
      let C = await G(_, Float32Array);
      _ = null;
      let z = dr(R, W),
        K = dr(V, C);
      return L !== void 0 ? { x: z, y: K, gpuTimeMs: L } : { x: z, y: K };
    } finally {
      (!u && c && f(c),
        !u && p && f(p),
        !n && g && f(g),
        !n && y && f(y),
        b && f(b),
        x && f(x),
        v && f(v),
        B && f(B),
        A && f(A),
        S && f(S),
        _ && f(_));
    }
  }
  async function Ba(r, o, e, a, t, i, s, u, n, d, l, m, w = "row-major") {
    let c = i instanceof X,
      p = u instanceof M,
      g = l instanceof M;
    if (
      (H(r),
      T(r, "sgemv", { A: i, x: u, y: l }),
      o !== "no-transpose" && o !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof t != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(t)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(t)) throw new Error("alpha must be finite.");
    if (typeof d != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(d)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(d)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(m) ||
      !Number.isInteger(s)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (p && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && u._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && g && i._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: l };
    (c ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let b = o === "no-transpose",
      x = b ? a : e,
      v = b ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (v - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let A = await P(r, b ? "sgemv_n" : "sgemv_t"),
      S = null,
      _ = null,
      N = null,
      I = null;
    try {
      ((S = c ? i._buf : h(r, i, "sgemv-A", !1)),
        (_ = p ? u._buf : h(r, u, "sgemv-x", !1)),
        (N = g ? l._buf : h(r, l, "sgemv-y", !0)),
        (I = q(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "u32" },
            { value: t, type: "f32" },
            { value: d, type: "f32" },
            { value: n, type: "u32" },
            { value: m, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sgemv-params",
        )));
      let k = D(r, A.getBindGroupLayout(0), [S, _, N, I]),
        L = b
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Yr(r, "sgemv", v),
        { commandEncoder: R, ts: W } = O(r, A, k, L),
        V = g ? null : E(r, R, N);
      F(r, R);
      let C = await j(W);
      if (g) return C !== void 0 ? { gpuTimeMs: C } : {};
      let z = await G(V, Float32Array);
      return C !== void 0 ? { y: z, gpuTimeMs: C } : { y: z };
    } finally {
      (!c && S && f(S), !p && _ && f(_), !g && N && f(N), I && f(I));
    }
  }
  async function Aa(r, o, e, a, t, i, s, u, n, d, l, m = "row-major") {
    let w = s instanceof M,
      c = d instanceof M,
      p = t instanceof X;
    if (
      (H(r),
      T(r, "ssymv", { A: t, x: s, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (u <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (i < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && s._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && i !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { y: d };
    if (!p && t.length < (e - 1) * i + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let y =
        (p ? t.layout : m) === "column-major" ? o === "upper" : o === "lower",
      b = await P(r, "ssymv"),
      x = null,
      v = null,
      B = null,
      A = null;
    try {
      ((x = p ? t._buf : h(r, t, "ssymv-A", !1)),
        (v = w ? s._buf : h(r, s, "ssymv-x", !1)),
        (B = c ? d._buf : h(r, d, "ssymv-y", !0)),
        (A = q(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: n, type: "f32" },
            { value: u, type: "u32" },
            { value: l, type: "u32" },
            { value: i, type: "u32" },
            { value: y ? 0 : 1, type: "u32" },
          ],
          "ssymv-params",
        )));
      let S = D(r, b.getBindGroupLayout(0), [x, v, B, A]),
        _ = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: N, ts: I } = O(r, b, S, _),
        k = c ? null : E(r, N, B);
      F(r, N);
      let L = await j(I);
      if (c) return L !== void 0 ? { gpuTimeMs: L } : {};
      let R = await G(k, Float32Array);
      return L !== void 0 ? { y: R, gpuTimeMs: L } : { y: R };
    } finally {
      (!p && x && f(x), !w && v && f(v), !c && B && f(B), A && f(A));
    }
  }
  async function Sa(r, o, e, a, t, i, s, u, n, d, l, m = "row-major") {
    let w = u instanceof M,
      c = d instanceof M,
      p = i instanceof X,
      g = a === "unit";
    if (
      (H(r),
      T(r, "strmv", { A: i, x: u, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!g && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!p && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && u._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && c && i._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return c ? {} : { y: d };
    if (!p && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (t - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let b = (p ? i.layout : m) === "column-major",
      x = b ? o === "upper" : o === "lower",
      v = b ? e === "transpose" : e === "no-transpose",
      B = await P(r, "strmv"),
      A = null,
      S = null,
      _ = null,
      N = null;
    try {
      ((A = p ? i._buf : h(r, i, "strmv-A", !1)),
        (S = w ? u._buf : h(r, u, "strmv-x", !1)),
        (_ = c ? d._buf : h(r, d, "strmv-y", !0)),
        (N = q(
          r,
          [
            { value: t, type: "u32" },
            { value: n, type: "u32" },
            { value: l, type: "u32" },
            { value: s, type: "u32" },
            { value: v ? 0 : 1, type: "u32" },
            { value: x ? 0 : 1, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmv-params",
        )));
      let I = D(r, B.getBindGroupLayout(0), [A, S, _, N]),
        k = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: L, ts: R } = O(r, B, I, k),
        W = c ? null : E(r, L, _);
      F(r, L);
      let V = await j(R);
      if (c) return V !== void 0 ? { gpuTimeMs: V } : {};
      let C = await G(W, Float32Array);
      return V !== void 0 ? { y: C, gpuTimeMs: V } : { y: C };
    } finally {
      (!p && A && f(A), !w && S && f(S), !c && _ && f(_), N && f(N));
    }
  }
  function Ga(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        u = i * o;
      s.forEach((n, d) => t.setUint32(u + d * 4, n, !0));
    }
    return a;
  }
  function Ea(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function ka(r, o, e, a, t, i, s, u, n, d = "row-major") {
    let l = u instanceof M,
      m = i instanceof X,
      w = a === "unit";
    if ((H(r), T(r, "strsv", { A: i, x: u }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(t) || !Number.isInteger(n) || !Number.isInteger(s))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!m && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!l && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (l && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && l && i._buf === u._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return l ? {} : { x: u };
    if (!m && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p = (m ? i.layout : d) === "column-major",
      g = p ? o === "upper" : o === "lower",
      y = p ? e === "transpose" : e === "no-transpose",
      b = await P(r, "strsv_invert_block"),
      x = await P(r, "strsv_apply_inverse"),
      v = await P(r, "strsv_update"),
      B = y === g,
      A = [];
    for (let C = 0; C < t; C += 64) A.push(C);
    B || A.reverse();
    let S = A.length,
      _ = r.limits.maxComputeWorkgroupsPerDimension,
      N = r.limits.minUniformBufferOffsetAlignment,
      I = null,
      k = null,
      L = null,
      R = null,
      W = null,
      V = null;
    try {
      ((I = m ? i._buf : h(r, i, "strsv-A", !1)),
        (k = l ? u._buf : h(r, u, "strsv-x", !0)),
        (L = fr(r, S * 64 * 64 * 4, "strsv-Ainv")));
      let C = Ga(S, N, (ar) => {
        let sr = ar * 64,
          lr = Math.min(sr + 64, t);
        return [n, ar, sr, lr];
      });
      R = Ea(r, C, "strsv-apply-params");
      let z = Ga(S, N, (ar) => {
        let sr = ar * 64,
          lr = Math.min(sr + 64, t);
        return [t, n, s, y ? 0 : 1, g ? 0 : 1, sr, lr];
      });
      W = Ea(r, z, "strsv-update-params");
      let { commandEncoder: K, querySet: Y } = Mr(r);
      V = q(
        r,
        [
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: y ? 0 : 1, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
          { value: w ? 1 : 0, type: "u32" },
        ],
        "strsv-invert-params",
      );
      let $ = D(r, b.getBindGroupLayout(0), [I, L, V]);
      hr(
        K,
        b,
        $,
        { x: 64, y: S },
        Y
          ? { timestampWrites: { querySet: Y, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let ar = 0; ar < A.length; ar++) {
        let sr = A[ar],
          lr = Math.min(sr + 64, t),
          ur = sr / 64,
          mr = ar === A.length - 1,
          yr = ur * N,
          wr = D(r, x.getBindGroupLayout(0), [
            L,
            k,
            { buffer: R, offset: yr, size: 16 },
          ]);
        hr(
          K,
          x,
          wr,
          1,
          mr && Y
            ? { timestampWrites: { querySet: Y, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let gr = B ? t - lr : sr;
        if (gr === 0) continue;
        let Gr = D(r, v.getBindGroupLayout(0), [
            I,
            k,
            { buffer: W, offset: yr, size: 32 },
          ]),
          Nr = Math.min(gr, _);
        hr(K, v, Gr, Nr);
      }
      let nr = kr(r, K, Y),
        er = l ? null : E(r, K, k);
      F(r, K);
      let Q = await j(nr);
      if (l) return Q !== void 0 ? { gpuTimeMs: Q } : {};
      let rr = await G(er, Float32Array);
      return Q !== void 0 ? { x: rr, gpuTimeMs: Q } : { x: rr };
    } finally {
      (!m && I && f(I),
        !l && k && f(k),
        L && f(L),
        R && f(R),
        W && f(W),
        V && f(V));
    }
  }
  async function Da(r, o, e, a, t, i, s, u, n, d, l = "row-major") {
    let m = n instanceof X;
    if (
      (H(r),
      T(r, "sger", { A: n, x: t, y: s }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < o || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : l) === "column-major" &&
      (([o, e] = [e, o]), ([t, s] = [s, t]), ([i, u] = [u, i]));
    let c = t instanceof M,
      p = s instanceof M;
    if (d < e) throw new Error("lda must be >= n.");
    if (!c && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !m)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (m && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (m && c && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && p && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (o < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || e === 0) return m ? {} : { A: n };
    if (!m && n.length < (o - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g = await P(r, "sger"),
      y = null,
      b = null,
      x = null,
      v = null;
    try {
      ((y = c ? t._buf : h(r, t, "sger-x", !1)),
        (b = p ? s._buf : h(r, s, "sger-y", !1)),
        (x = m ? n._buf : h(r, n, "sger-A", !0)),
        (v = q(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: d, type: "u32" },
          ],
          "sger-params",
        )));
      let B = D(r, g.getBindGroupLayout(0), [y, b, x, v]),
        A = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: S, ts: _ } = O(r, g, B, A),
        N = m ? null : E(r, S, x);
      F(r, S);
      let I = await j(_);
      if (m) return I !== void 0 ? { gpuTimeMs: I } : {};
      let k = await G(N, Float32Array);
      return I !== void 0 ? { A: k, gpuTimeMs: I } : { A: k };
    } finally {
      (!c && y && f(y), !p && b && f(b), !m && x && f(x), v && f(v));
    }
  }
  async function La(r, o, e, a, t, i, s, u, n, d, l = "row-major") {
    let m = n instanceof X;
    if (
      (H(r),
      T(r, "dger", { A: n, x: t, y: s }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (m && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < o || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : l) === "column-major" &&
      (([o, e] = [e, o]), ([t, s] = [s, t]), ([i, u] = [u, i]));
    let c = t instanceof M,
      p = s instanceof M;
    if (d < e) throw new Error("lda must be >= n.");
    if (!c && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(s instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (c && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (p && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (c !== p)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (c && !m)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (m && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (m && c && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && p && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (o < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || e === 0) return m ? {} : { A: n };
    if (!m && n.length < (o - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let y = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dger"],
        "dger_main",
      ),
      { hi: b, lo: x } = U(new Float64Array([a])),
      v = null,
      B = null,
      A = null,
      S = null,
      _ = null,
      N = null,
      I = null,
      k = null,
      L = null;
    try {
      if (c)
        ((v = t._buf),
          (B = t._loBuf),
          (A = s._buf),
          (S = s._loBuf),
          (_ = n._buf),
          (N = n._loBuf));
      else {
        let J = U(t),
          nr = U(s),
          er = U(n);
        ((v = h(r, J.hi, "dger-xHi", !1)),
          (B = h(r, J.lo, "dger-xLo", !1)),
          (A = h(r, nr.hi, "dger-yHi", !1)),
          (S = h(r, nr.lo, "dger-yLo", !1)),
          (_ = h(r, er.hi, "dger-AHi", !0)),
          (N = h(r, er.lo, "dger-ALo", !0)));
      }
      I = q(
        r,
        [
          { value: o, type: "u32" },
          { value: e, type: "u32" },
          { value: b[0], type: "f32" },
          { value: x[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: d, type: "u32" },
        ],
        "dger-params",
      );
      let R = D(r, y.getBindGroupLayout(0), [v, B, A, S, _, N, I]),
        W = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: V, ts: C } = O(r, y, R, W);
      ((k = m ? null : E(r, V, _)), (L = m ? null : E(r, V, N)), F(r, V));
      let z = await j(C);
      if (m) return z !== void 0 ? { gpuTimeMs: z } : {};
      let K = await G(k, Float32Array);
      k = null;
      let Y = await G(L, Float32Array);
      L = null;
      let $ = dr(K, Y);
      return z !== void 0 ? { A: $, gpuTimeMs: z } : { A: $ };
    } finally {
      (!c && v && f(v),
        !c && B && f(B),
        !p && A && f(A),
        !p && S && f(S),
        !m && _ && f(_),
        !m && N && f(N),
        I && f(I),
        k && f(k),
        L && f(L));
    }
  }
  async function Pa(r, o, e, a, t, i, s, u, n = "row-major") {
    let d = t instanceof M,
      l = s instanceof X;
    if ((H(r), T(r, "ssyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(i) || !Number.isInteger(u))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0) throw new Error("incx must be positive.");
    if (u < e) throw new Error("lda must be >= n.");
    if (!l && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (d && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && d && s._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (l && u !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (l && (s.rows < e || s.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return l ? {} : { A: s };
    if (!l && s.length < (e - 1) * u + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
        (l ? s.layout : n) === "column-major" ? o === "upper" : o === "lower",
      c = await P(r, "ssyr"),
      p = null,
      g = null,
      y = null;
    try {
      ((p = d ? t._buf : h(r, t, "ssyr-x", !1)),
        (g = l ? s._buf : h(r, s, "ssyr-A", !0)),
        (y = q(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let b = D(r, c.getBindGroupLayout(0), [p, g, y]),
        x = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: B } = O(r, c, b, x),
        A = l ? null : E(r, v, g);
      F(r, v);
      let S = await j(B);
      if (l) return S !== void 0 ? { gpuTimeMs: S } : {};
      let _ = await G(A, Float32Array);
      return S !== void 0 ? { A: _, gpuTimeMs: S } : { A: _ };
    } finally {
      (!d && p && f(p), !l && g && f(g), y && f(y));
    }
  }
  async function Na(r, o, e, a, t, i, s, u, n = "row-major") {
    let d = t instanceof M,
      l = s instanceof X;
    if ((H(r), T(r, "dsyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(i) || !Number.isInteger(u))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0) throw new Error("incx must be positive.");
    if (u < e) throw new Error("lda must be >= n.");
    if (!l && !(s instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (l && s.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!d && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (d && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (d && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && d && s._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (l && u !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (l && (s.rows < e || s.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return l ? {} : { A: s };
    if (!l && s.length < (e - 1) * u + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
        (l ? s.layout : n) === "column-major" ? o === "upper" : o === "lower",
      p = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr"],
        "dsyr_main",
      ),
      { hi: g, lo: y } = U(new Float64Array([a])),
      b = null,
      x = null,
      v = null,
      B = null,
      A = null,
      S = null,
      _ = null;
    try {
      if (d) ((b = t._buf), (x = t._loBuf), (v = s._buf), (B = s._loBuf));
      else {
        let z = U(t),
          K = U(s);
        ((b = h(r, z.hi, "dsyr-xHi", !1)),
          (x = h(r, z.lo, "dsyr-xLo", !1)),
          (v = h(r, K.hi, "dsyr-AHi", !0)),
          (B = h(r, K.lo, "dsyr-ALo", !0)));
      }
      A = q(
        r,
        [
          { value: e, type: "u32" },
          { value: g[0], type: "f32" },
          { value: y[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
        ],
        "dsyr-params",
      );
      let N = D(r, p.getBindGroupLayout(0), [b, x, v, B, A]),
        I = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: k, ts: L } = O(r, p, N, I);
      ((S = l ? null : E(r, k, v)), (_ = l ? null : E(r, k, B)), F(r, k));
      let R = await j(L);
      if (l) return R !== void 0 ? { gpuTimeMs: R } : {};
      let W = await G(S, Float32Array);
      S = null;
      let V = await G(_, Float32Array);
      _ = null;
      let C = dr(W, V);
      return R !== void 0 ? { A: C, gpuTimeMs: R } : { A: C };
    } finally {
      (!d && b && f(b),
        !d && x && f(x),
        !l && v && f(v),
        !l && B && f(B),
        A && f(A),
        S && f(S),
        _ && f(_));
    }
  }
  async function Ma(r, o, e, a, t, i, s, u, n, d, l = "row-major") {
    let m = t instanceof M,
      w = s instanceof M,
      c = n instanceof X;
    if (
      (H(r),
      T(r, "ssyr2", { A: n, x: t, y: s }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (d < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!m && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (m !== w)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (m && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !m)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && m && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && w && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === s._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { A: n };
    if (!c && n.length < (e - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? n.layout : l) === "column-major" ? o === "upper" : o === "lower",
      y = await P(r, "ssyr2"),
      b = null,
      x = null,
      v = null,
      B = null;
    try {
      ((b = m ? t._buf : h(r, t, "ssyr2-x", !1)),
        (x = w ? s._buf : h(r, s, "ssyr2-y", !1)),
        (v = c ? n._buf : h(r, n, "ssyr2-A", !0)),
        (B = q(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: d, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let A = D(r, y.getBindGroupLayout(0), [b, x, v, B]),
        S = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: _, ts: N } = O(r, y, A, S),
        I = c ? null : E(r, _, v);
      F(r, _);
      let k = await j(N);
      if (c) return k !== void 0 ? { gpuTimeMs: k } : {};
      let L = await G(I, Float32Array);
      return k !== void 0 ? { A: L, gpuTimeMs: k } : { A: L };
    } finally {
      (!m && b && f(b), !w && x && f(x), !c && v && f(v), B && f(B));
    }
  }
  async function Ia(r, o, e, a, t, i, s, u, n, d, l = "row-major") {
    let m = t instanceof M,
      w = s instanceof M,
      c = n instanceof X;
    if (
      (H(r),
      T(r, "dsyr2", { A: n, x: t, y: s }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (d < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!m && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!w && !(s instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (m && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (w && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (m !== w)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (m && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !m)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && m && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && w && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === s._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { A: n };
    if (!c && n.length < (e - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? n.layout : l) === "column-major" ? o === "upper" : o === "lower",
      b = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr2"],
        "dsyr2_main",
      ),
      { hi: x, lo: v } = U(new Float64Array([a])),
      B = null,
      A = null,
      S = null,
      _ = null,
      N = null,
      I = null,
      k = null,
      L = null,
      R = null;
    try {
      if (m)
        ((B = t._buf),
          (A = t._loBuf),
          (S = s._buf),
          (_ = s._loBuf),
          (N = n._buf),
          (I = n._loBuf));
      else {
        let nr = U(t),
          er = U(s),
          Q = U(n);
        ((B = h(r, nr.hi, "dsyr2-xHi", !1)),
          (A = h(r, nr.lo, "dsyr2-xLo", !1)),
          (S = h(r, er.hi, "dsyr2-yHi", !1)),
          (_ = h(r, er.lo, "dsyr2-yLo", !1)),
          (N = h(r, Q.hi, "dsyr2-AHi", !0)),
          (I = h(r, Q.lo, "dsyr2-ALo", !0)));
      }
      k = q(
        r,
        [
          { value: e, type: "u32" },
          { value: x[0], type: "f32" },
          { value: v[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: d, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
        ],
        "dsyr2-params",
      );
      let W = D(r, b.getBindGroupLayout(0), [B, A, S, _, N, I, k]),
        V = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: C, ts: z } = O(r, b, W, V);
      ((L = c ? null : E(r, C, N)), (R = c ? null : E(r, C, I)), F(r, C));
      let K = await j(z);
      if (c) return K !== void 0 ? { gpuTimeMs: K } : {};
      let Y = await G(L, Float32Array);
      L = null;
      let $ = await G(R, Float32Array);
      R = null;
      let J = dr(Y, $);
      return K !== void 0 ? { A: J, gpuTimeMs: K } : { A: J };
    } finally {
      (!m && B && f(B),
        !m && A && f(A),
        !w && S && f(S),
        !w && _ && f(_),
        !c && N && f(N),
        !c && I && f(I),
        k && f(k),
        L && f(L),
        R && f(R));
    }
  }
  async function Ra(r, o, e, a, t, i, s, u, n, d, l, m, w = "row-major") {
    let c = i instanceof X,
      p = u instanceof M,
      g = l instanceof M;
    if (
      (H(r),
      T(r, "dgemv", { A: i, x: u, y: l }),
      o !== "no-transpose" && o !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof t != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(t)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(t)) throw new Error("alpha must be finite.");
    if (typeof d != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(d)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(d)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(m) ||
      !Number.isInteger(s)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!p && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!g && !(l instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (p && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (g && l.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (p !== g)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (p && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && u._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && g && i._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: l };
    (c ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let b = o === "no-transpose",
      x = b ? a : e,
      v = b ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (v - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let B = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      A = b ? "dgemv_n" : "dgemv_t",
      S = b ? "dgemv_n_main" : "dgemv_t_main",
      _ = await P(r, [...B, A], S),
      { hi: N, lo: I } = U(new Float64Array([t])),
      { hi: k, lo: L } = U(new Float64Array([d])),
      R = null,
      W = null,
      V = null,
      C = null,
      z = null,
      K = null,
      Y = null,
      $ = null,
      J = null;
    try {
      if (c) ((R = i._buf), (W = i._loBuf));
      else {
        let mr = U(i);
        ((R = h(r, mr.hi, "dgemv-AHi", !1)),
          (W = h(r, mr.lo, "dgemv-ALo", !1)));
      }
      if (p) ((V = u._buf), (C = u._loBuf));
      else {
        let mr = U(u);
        ((V = h(r, mr.hi, "dgemv-xHi", !1)),
          (C = h(r, mr.lo, "dgemv-xLo", !1)));
      }
      if (g) ((z = l._buf), (K = l._loBuf));
      else {
        let mr = U(l);
        ((z = h(r, mr.hi, "dgemv-yHi", !0)),
          (K = h(r, mr.lo, "dgemv-yLo", !0)));
      }
      Y = q(
        r,
        [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
          { value: N[0], type: "f32" },
          { value: I[0], type: "f32" },
          { value: k[0], type: "f32" },
          { value: L[0], type: "f32" },
          { value: n, type: "u32" },
          { value: m, type: "u32" },
          { value: s, type: "u32" },
        ],
        "dgemv-params",
      );
      let nr = D(r, _.getBindGroupLayout(0), [R, W, V, C, z, K, Y]),
        er = b
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Yr(r, "dgemv", v),
        { commandEncoder: Q, ts: rr } = O(r, _, nr, er);
      (($ = g ? null : E(r, Q, z)), (J = g ? null : E(r, Q, K)), F(r, Q));
      let ar = await j(rr);
      if (g) return ar !== void 0 ? { gpuTimeMs: ar } : {};
      let sr = await G($, Float32Array);
      $ = null;
      let lr = await G(J, Float32Array);
      J = null;
      let ur = dr(sr, lr);
      return ar !== void 0 ? { y: ur, gpuTimeMs: ar } : { y: ur };
    } finally {
      (!c && R && f(R),
        !c && W && f(W),
        !p && V && f(V),
        !p && C && f(C),
        !g && z && f(z),
        !g && K && f(K),
        Y && f(Y),
        $ && f($),
        J && f(J));
    }
  }
  async function ja(r, o, e, a, t, i, s, u, n, d, l, m = "row-major") {
    let w = s instanceof M,
      c = d instanceof M,
      p = t instanceof X;
    if (
      (H(r),
      T(r, "dsymv", { A: t, x: s, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (u <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (i < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && t.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(s instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!c && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && s.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (c && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && s._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && c && t._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && i !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { y: d };
    if (!p && t.length < (e - 1) * i + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let y =
        (p ? t.layout : m) === "column-major" ? o === "upper" : o === "lower",
      x = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsymv"],
        "dsymv_main",
      ),
      { hi: v, lo: B } = U(new Float64Array([a])),
      { hi: A, lo: S } = U(new Float64Array([n])),
      _ = null,
      N = null,
      I = null,
      k = null,
      L = null,
      R = null,
      W = null,
      V = null,
      C = null;
    try {
      if (p) ((_ = t._buf), (N = t._loBuf));
      else {
        let rr = U(t);
        ((_ = h(r, rr.hi, "dsymv-AHi", !1)),
          (N = h(r, rr.lo, "dsymv-ALo", !1)));
      }
      if (w) ((I = s._buf), (k = s._loBuf));
      else {
        let rr = U(s);
        ((I = h(r, rr.hi, "dsymv-xHi", !1)),
          (k = h(r, rr.lo, "dsymv-xLo", !1)));
      }
      if (c) ((L = d._buf), (R = d._loBuf));
      else {
        let rr = U(d);
        ((L = h(r, rr.hi, "dsymv-yHi", !0)),
          (R = h(r, rr.lo, "dsymv-yLo", !0)));
      }
      W = q(
        r,
        [
          { value: e, type: "u32" },
          { value: v[0], type: "f32" },
          { value: B[0], type: "f32" },
          { value: A[0], type: "f32" },
          { value: S[0], type: "f32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: i, type: "u32" },
          { value: y ? 0 : 1, type: "u32" },
        ],
        "dsymv-params",
      );
      let z = D(r, x.getBindGroupLayout(0), [_, N, I, k, L, R, W]),
        K = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: Y, ts: $ } = O(r, x, z, K);
      ((V = c ? null : E(r, Y, L)), (C = c ? null : E(r, Y, R)), F(r, Y));
      let J = await j($);
      if (c) return J !== void 0 ? { gpuTimeMs: J } : {};
      let nr = await G(V, Float32Array);
      V = null;
      let er = await G(C, Float32Array);
      C = null;
      let Q = dr(nr, er);
      return J !== void 0 ? { y: Q, gpuTimeMs: J } : { y: Q };
    } finally {
      (!p && _ && f(_),
        !p && N && f(N),
        !w && I && f(I),
        !w && k && f(k),
        !c && L && f(L),
        !c && R && f(R),
        W && f(W),
        V && f(V),
        C && f(C));
    }
  }
  async function Fa(r, o, e, a, t, i, s, u, n, d, l, m = "row-major") {
    let w = u instanceof M,
      c = d instanceof M,
      p = i instanceof X,
      g = a === "unit";
    if (
      (H(r),
      T(r, "dtrmv", { A: i, x: u, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!g && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!p && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!c && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (c && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && u._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && c && i._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return c ? {} : { y: d };
    if (!p && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (t - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let b = (p ? i.layout : m) === "column-major",
      x = b ? o === "upper" : o === "lower",
      v = b ? e === "transpose" : e === "no-transpose",
      A = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dtrmv"],
        "dtrmv_main",
      ),
      S = null,
      _ = null,
      N = null,
      I = null,
      k = null,
      L = null,
      R = null,
      W = null,
      V = null;
    try {
      if (p) ((S = i._buf), (_ = i._loBuf));
      else {
        let Q = U(i);
        ((S = h(r, Q.hi, "dtrmv-AHi", !1)), (_ = h(r, Q.lo, "dtrmv-ALo", !1)));
      }
      if (w) ((N = u._buf), (I = u._loBuf));
      else {
        let Q = U(u);
        ((N = h(r, Q.hi, "dtrmv-xHi", !1)), (I = h(r, Q.lo, "dtrmv-xLo", !1)));
      }
      if (c) ((k = d._buf), (L = d._loBuf));
      else {
        let Q = U(d);
        ((k = h(r, Q.hi, "dtrmv-yHi", !0)), (L = h(r, Q.lo, "dtrmv-yLo", !0)));
      }
      R = q(
        r,
        [
          { value: t, type: "u32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: s, type: "u32" },
          { value: v ? 0 : 1, type: "u32" },
          { value: x ? 0 : 1, type: "u32" },
          { value: g ? 1 : 0, type: "u32" },
        ],
        "dtrmv-params",
      );
      let C = D(r, A.getBindGroupLayout(0), [S, _, N, I, k, L, R]),
        z = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: K, ts: Y } = O(r, A, C, z);
      ((W = c ? null : E(r, K, k)), (V = c ? null : E(r, K, L)), F(r, K));
      let $ = await j(Y);
      if (c) return $ !== void 0 ? { gpuTimeMs: $ } : {};
      let J = await G(W, Float32Array);
      W = null;
      let nr = await G(V, Float32Array);
      V = null;
      let er = dr(J, nr);
      return $ !== void 0 ? { y: er, gpuTimeMs: $ } : { y: er };
    } finally {
      (!p && S && f(S),
        !p && _ && f(_),
        !w && N && f(N),
        !w && I && f(I),
        !c && k && f(k),
        !c && L && f(L),
        R && f(R),
        W && f(W),
        V && f(V));
    }
  }
  function qa(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        u = i * o;
      s.forEach((n, d) => t.setUint32(u + d * 4, n, !0));
    }
    return a;
  }
  function Ha(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function Ta(r, o, e, a, t, i, s, u, n, d = "row-major") {
    let l = u instanceof M,
      m = i instanceof X,
      w = a === "unit";
    if ((H(r), T(r, "dtrsv", { A: i, x: u }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(t) || !Number.isInteger(n) || !Number.isInteger(s))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!m && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (m && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!l && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (l && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (l && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && l && i._buf === u._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return l ? {} : { x: u };
    if (!m && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p = (m ? i.layout : d) === "column-major",
      g = p ? o === "upper" : o === "lower",
      y = p ? e === "transpose" : e === "no-transpose",
      b = [
        "f64/dekker",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
      ],
      x = await P(r, [...b, "dtrsv_invert_block"], "dtrsv_invert_block_main"),
      v = await P(r, [...b, "dtrsv_apply_inverse"], "dtrsv_apply_inverse_main"),
      B = await P(r, [...b, "dtrsv_update"], "dtrsv_update_main"),
      A = y === g,
      S = [];
    for (let nr = 0; nr < t; nr += 64) S.push(nr);
    A || S.reverse();
    let _ = S.length,
      N = r.limits.maxComputeWorkgroupsPerDimension,
      I = r.limits.minUniformBufferOffsetAlignment,
      k = null,
      L = null,
      R = null,
      W = null,
      V = null,
      C = null,
      z = null,
      K = null,
      Y = null,
      $ = null,
      J = null;
    try {
      if (m) ((k = i._buf), (L = i._loBuf));
      else {
        let tr = U(i);
        ((k = h(r, tr.hi, "dtrsv-AHi", !1)),
          (L = h(r, tr.lo, "dtrsv-ALo", !1)));
      }
      if (l) ((R = u._buf), (W = u._loBuf));
      else {
        let tr = U(u);
        ((R = h(r, tr.hi, "dtrsv-xHi", !0)),
          (W = h(r, tr.lo, "dtrsv-xLo", !0)));
      }
      ((V = fr(r, _ * 64 * 64 * 4, "dtrsv-AinvHi")),
        (C = fr(r, _ * 64 * 64 * 4, "dtrsv-AinvLo")));
      let nr = qa(_, I, (tr) => {
        let gr = tr * 64,
          Gr = Math.min(gr + 64, t);
        return [n, tr, gr, Gr];
      });
      z = Ha(r, nr, "dtrsv-apply-params");
      let er = qa(_, I, (tr) => {
        let gr = tr * 64,
          Gr = Math.min(gr + 64, t);
        return [t, n, s, y ? 0 : 1, g ? 0 : 1, gr, Gr];
      });
      K = Ha(r, er, "dtrsv-update-params");
      let { commandEncoder: Q, querySet: rr } = Mr(r);
      Y = q(
        r,
        [
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: y ? 0 : 1, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
          { value: w ? 1 : 0, type: "u32" },
        ],
        "dtrsv-invert-params",
      );
      let ar = D(r, x.getBindGroupLayout(0), [k, L, V, C, Y]);
      hr(
        Q,
        x,
        ar,
        { x: 64, y: _ },
        rr
          ? { timestampWrites: { querySet: rr, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let tr = 0; tr < S.length; tr++) {
        let gr = S[tr],
          Gr = Math.min(gr + 64, t),
          Nr = gr / 64,
          Tr = tr === S.length - 1,
          Sr = Nr * I,
          xr = D(r, v.getBindGroupLayout(0), [
            V,
            C,
            R,
            W,
            { buffer: z, offset: Sr, size: 16 },
          ]);
        hr(
          Q,
          v,
          xr,
          1,
          Tr && rr
            ? { timestampWrites: { querySet: rr, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let Er = A ? t - Gr : gr;
        if (Er === 0) continue;
        let _r = D(r, B.getBindGroupLayout(0), [
            k,
            L,
            R,
            W,
            { buffer: K, offset: Sr, size: 32 },
          ]),
          Wr = Math.min(Er, N);
        hr(Q, B, _r, Wr);
      }
      let lr = kr(r, Q, rr);
      (($ = l ? null : E(r, Q, R)), (J = l ? null : E(r, Q, W)), F(r, Q));
      let ur = await j(lr);
      if (l) return ur !== void 0 ? { gpuTimeMs: ur } : {};
      let mr = await G($, Float32Array);
      $ = null;
      let yr = await G(J, Float32Array);
      J = null;
      let wr = dr(mr, yr);
      return ur !== void 0 ? { x: wr, gpuTimeMs: ur } : { x: wr };
    } finally {
      (!m && k && f(k),
        !m && L && f(L),
        !l && R && f(R),
        !l && W && f(W),
        V && f(V),
        C && f(C),
        z && f(z),
        K && f(K),
        Y && f(Y),
        $ && f($),
        J && f(J));
    }
  }
  async function Ca(r, o, e, a, t, i, s, u, n, d, l, m, w, c, p = "row-major") {
    let g = u instanceof X,
      y = d instanceof X,
      b = w instanceof X;
    if (
      (H(r),
      T(r, "sgemm", { A: u, B: d, C: w }),
      o !== "no-transpose" && o !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof m != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(m)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(i) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!y && !(d instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(w instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || y) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!g || !y))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || l <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || t === 0) return b ? {} : { C: w };
    let x = g ? u.layout : p,
      v = y ? d.layout : p,
      B = b ? w.layout : p,
      A = x === "column-major" ? i : a,
      S = x === "column-major" ? a : i,
      _ = o === "no-transpose" ? A : S,
      N = o === "no-transpose" ? S : A;
    if (n < N)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== u.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [lr, ur] = o === "no-transpose" ? [a, i] : [i, a];
      if (u.rows < lr || u.cols < ur)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (u.length < (_ - 1) * n + N)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let I = v === "column-major" ? t : i,
      k = v === "column-major" ? i : t,
      L = e === "no-transpose" ? I : k,
      R = e === "no-transpose" ? k : I;
    if (l < R)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (y) {
      if (l !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [lr, ur] = e === "no-transpose" ? [i, t] : [t, i];
      if (d.rows < lr || d.cols < ur)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (L - 1) * l + R)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let W = B === "column-major" ? t : a,
      V = B === "column-major" ? a : t;
    if (c < V)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (c !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < a || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (W - 1) * c + V)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (([u, d] = [d, u]),
        ([g, y] = [y, g]),
        ([n, l] = [l, n]),
        ([o, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          o === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, t] = [t, a])));
    let C = Math.ceil(t / 64),
      z = Math.ceil(a / 64),
      K = C * z >= 36,
      Y = await P(r, K ? "sgemm_large" : "sgemm_small"),
      $ = g ? u._buf : h(r, u, "sgemm-A", !1),
      J = y ? d._buf : h(r, d, "sgemm-B", !1),
      nr = b ? w._buf : h(r, w, "sgemm-C", !0),
      er = o === "no-transpose",
      Q = e === "no-transpose",
      rr = er && Ee($, n, a, i),
      ar = Ee(J, l, Q ? i : t, Q ? t : i),
      sr = q(
        r,
        [
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "f32" },
          { value: m, type: "f32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: c, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: rr ? 1 : 0, type: "u32" },
          { value: ar ? 1 : 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let lr = D(r, Y.getBindGroupLayout(0), [
          $,
          Dr(r, $),
          J,
          Dr(r, J),
          nr,
          sr,
        ]),
        ur = K
          ? { x: or(r, C, "sgemm", "x"), y: or(r, z, "sgemm", "y") }
          : {
              x: or(r, Math.ceil(t / 32), "sgemm", "x"),
              y: or(r, Math.ceil(a / 32), "sgemm", "y"),
            },
        { commandEncoder: mr, ts: yr } = O(r, Y, lr, ur),
        wr = b ? null : E(r, mr, nr);
      F(r, mr);
      let tr = await j(yr);
      if (b) return tr !== void 0 ? { gpuTimeMs: tr } : {};
      let gr = await G(wr, Float32Array);
      return tr !== void 0 ? { C: gr, gpuTimeMs: tr } : { C: gr };
    } finally {
      (g || f($), y || f(J), b || f(nr), f(sr));
    }
  }
  async function Wa(
    r,
    o,
    e,
    a,
    t,
    i,
    s,
    u,
    n,
    d,
    l,
    m,
    w,
    c,
    p,
    g = "row-major",
  ) {
    let y = n instanceof X,
      b = l instanceof X,
      x = c instanceof X;
    if (
      (H(r),
      T(r, "sgemmtr", { A: n, B: l, C: c }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (typeof w != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(w)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(w)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m) ||
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!y && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!x && !(c instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((y || b) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!y || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || i === 0) return x ? {} : { C: c };
    let v = y ? n.layout : g,
      B = b ? l.layout : g,
      A = x ? c.layout : g,
      S = v === "column-major" ? s : t,
      _ = v === "column-major" ? t : s,
      N = e === "no-transpose" ? S : _,
      I = e === "no-transpose" ? _ : S;
    if (d < I)
      throw new Error(
        `lda must be >= ${v === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (y) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [rr, ar] = e === "no-transpose" ? [t, s] : [s, t];
      if (n.rows < rr || n.cols < ar)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (N - 1) * d + I)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let k = B === "column-major" ? i : s,
      L = B === "column-major" ? s : i,
      R = a === "no-transpose" ? k : L,
      W = a === "no-transpose" ? L : k;
    if (m < W)
      throw new Error(
        `ldb must be >= ${B === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [rr, ar] = a === "no-transpose" ? [s, i] : [i, s];
      if (l.rows < rr || l.cols < ar)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (R - 1) * m + W)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let V = A === "column-major" ? i : t,
      C = A === "column-major" ? t : i;
    if (p < C)
      throw new Error(
        `ldc must be >= ${A === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (p !== c.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (c.rows < t || c.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (c.length < (V - 1) * p + C)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (v === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      A === "column-major" &&
        (([n, l] = [l, n]),
        ([y, b] = [b, y]),
        ([d, m] = [m, d]),
        ([e, a] = [
          a === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, i] = [i, t]),
        (o = o === "lower" ? "upper" : "lower")));
    let z = Math.ceil(i / 64),
      K = Math.ceil(t / 64),
      Y = z * K >= 36,
      $ = await P(r, Y ? "sgemmtr_large" : "sgemmtr_small"),
      J = y ? n._buf : h(r, n, "sgemmtr-A", !1),
      nr = b ? l._buf : h(r, l, "sgemmtr-B", !1),
      er = x ? c._buf : h(r, c, "sgemmtr-C", !0),
      Q = q(
        r,
        [
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: u, type: "f32" },
          { value: w, type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: p, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: o === "upper" ? 1 : 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let rr = D(r, $.getBindGroupLayout(0), [J, nr, er, Q]),
        ar = Y
          ? { x: or(r, z, "sgemmtr", "x"), y: or(r, K, "sgemmtr", "y") }
          : {
              x: or(r, Math.ceil(i / 32), "sgemmtr", "x"),
              y: or(r, Math.ceil(t / 32), "sgemmtr", "y"),
            },
        { commandEncoder: sr, ts: lr } = O(r, $, rr, ar),
        ur = x ? null : E(r, sr, er);
      F(r, sr);
      let mr = await j(lr);
      if (x) return mr !== void 0 ? { gpuTimeMs: mr } : {};
      let yr = await G(ur, Float32Array);
      return mr !== void 0 ? { C: yr, gpuTimeMs: mr } : { C: yr };
    } finally {
      (y || f(J), b || f(nr), x || f(er), f(Q));
    }
  }
  async function Va(r, o, e, a, t, i, s, u, n, d, l, m = "row-major") {
    let w = s instanceof X,
      c = d instanceof X;
    if ((H(r), T(r, "ssyrk", { A: s, C: d }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (w && !c)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (c && !w)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || l <= 0) throw new Error("lda and ldc must be positive.");
    if (a === 0) return c ? {} : { C: d };
    let p = w ? s.layout : m,
      g = c ? d.layout : m,
      y = p === "column-major" ? t : a,
      b = p === "column-major" ? a : t,
      x = e === "no-transpose" ? y : b,
      v = e === "no-transpose" ? b : y;
    if (u < v)
      throw new Error(
        `lda must be >= ${p === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [C, z] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < C || s.cols < z)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (x - 1) * u + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (l < a) throw new Error("ldc must be >= n.");
    if (c) {
      if (l !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < a || d.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (a - 1) * l + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let B = e;
    p === "column-major" &&
      (B = B === "no-transpose" ? "transpose" : "no-transpose");
    let A = B === "no-transpose" ? "transpose" : "no-transpose",
      S = o;
    g === "column-major" &&
      (([B, A] = [
        A === "no-transpose" ? "transpose" : "no-transpose",
        B === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (S = S === "lower" ? "upper" : "lower"));
    let _ = Math.ceil(a / 64),
      N = Math.ceil(a / 64),
      I = _ * N >= 36,
      k = await P(r, I ? "sgemmtr_large" : "sgemmtr_small"),
      L = w ? s._buf : h(r, s, "ssyrk-A", !1),
      R = c ? d._buf : h(r, d, "ssyrk-C", !0),
      W = w
        ? fr(r, L.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : h(r, s, "ssyrk-B", !1),
      V = q(
        r,
        [
          { value: a, type: "u32" },
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "f32" },
          { value: n, type: "f32" },
          { value: u, type: "u32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: B === "transpose" ? 1 : 0, type: "u32" },
          { value: A === "transpose" ? 1 : 0, type: "u32" },
          { value: S === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let C = D(r, k.getBindGroupLayout(0), [L, W, R, V]),
        z = I
          ? { x: or(r, _, "ssyrk", "x"), y: or(r, N, "ssyrk", "y") }
          : {
              x: or(r, Math.ceil(a / 32), "ssyrk", "x"),
              y: or(r, Math.ceil(a / 32), "ssyrk", "y"),
            },
        { commandEncoder: K, querySet: Y, passDescriptor: $ } = Mr(r);
      (w && K.copyBufferToBuffer(L, 0, W, 0, L.size), hr(K, k, C, z, $));
      let J = kr(r, K, Y),
        nr = c ? null : E(r, K, R);
      F(r, K);
      let er = await j(J);
      if (c) return er !== void 0 ? { gpuTimeMs: er } : {};
      let Q = await G(nr, Float32Array);
      return er !== void 0 ? { C: Q, gpuTimeMs: er } : { C: Q };
    } finally {
      (w || f(L), f(W), c || f(R), f(V));
    }
  }
  async function Oa(r, o, e, a, t, i, s, u, n, d, l, m, w, c = "row-major") {
    let p = s instanceof X,
      g = n instanceof X,
      y = m instanceof X;
    if (
      (H(r),
      T(r, "ssyr2k", { A: s, B: n, C: m }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!y && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((p || g) && !y)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (y && (!p || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || d <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0) return y ? {} : { C: m };
    let b = p ? s.layout : c,
      x = g ? n.layout : c,
      v = y ? m.layout : c,
      B = b === "column-major" ? t : a,
      A = b === "column-major" ? a : t,
      S = e === "no-transpose" ? B : A,
      _ = e === "no-transpose" ? A : B;
    if (u < _)
      throw new Error(
        `lda must be >= ${b === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (p) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [lr, ur] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < lr || s.cols < ur)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (S - 1) * u + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let N = x === "column-major" ? t : a,
      I = x === "column-major" ? a : t,
      k = e === "no-transpose" ? N : I,
      L = e === "no-transpose" ? I : N;
    if (d < L)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [lr, ur] = e === "no-transpose" ? [a, t] : [t, a];
      if (n.rows < lr || n.cols < ur)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (k - 1) * d + L)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (w < a) throw new Error("ldc must be >= n.");
    if (y) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < a || m.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (m.length < (a - 1) * w + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let R = e;
    b === "column-major" &&
      (R = R === "no-transpose" ? "transpose" : "no-transpose");
    let W = e;
    x === "column-major" &&
      (W = W === "no-transpose" ? "transpose" : "no-transpose");
    let V = v === "column-major" ? (o === "lower" ? "upper" : "lower") : o,
      C = (lr) => (lr === "no-transpose" ? "transpose" : "no-transpose");
    function z(lr, ur, mr, yr, wr, tr) {
      let gr = lr,
        Gr = C(yr);
      return v !== "column-major"
        ? { transX: gr, X: ur, ldX: mr, transY: Gr, Y: wr, ldY: tr }
        : { transX: C(Gr), X: wr, ldX: tr, transY: C(gr), Y: ur, ldY: mr };
    }
    let K = Math.ceil(a / 64),
      Y = Math.ceil(a / 64),
      $ = K * Y >= 36,
      J = await P(r, $ ? "sgemmtr_large" : "sgemmtr_small"),
      nr = $
        ? { x: or(r, K, "ssyr2k", "x"), y: or(r, Y, "ssyr2k", "y") }
        : {
            x: or(r, Math.ceil(a / 32), "ssyr2k", "x"),
            y: or(r, Math.ceil(a / 32), "ssyr2k", "y"),
          },
      er = p ? s._buf : h(r, s, "ssyr2k-A", !1),
      Q = g ? n._buf : h(r, n, "ssyr2k-B", !1),
      rr = y ? m._buf : h(r, m, "ssyr2k-C", !0),
      ar = null,
      sr = null;
    try {
      let lr = z(R, er, u, W, Q, d),
        ur = z(W, Q, d, R, er, u),
        mr = (Er, _r) =>
          q(
            r,
            [
              { value: a, type: "u32" },
              { value: a, type: "u32" },
              { value: t, type: "u32" },
              { value: i, type: "f32" },
              { value: _r, type: "f32" },
              { value: Er.ldX, type: "u32" },
              { value: Er.ldY, type: "u32" },
              { value: w, type: "u32" },
              { value: Er.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: Er.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: V === "upper" ? 1 : 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((ar = mr(lr, l)), (sr = mr(ur, 1)));
      let yr = D(r, J.getBindGroupLayout(0), [lr.X, lr.Y, rr, ar]),
        wr = D(r, J.getBindGroupLayout(0), [ur.X, ur.Y, rr, sr]),
        { commandEncoder: tr, querySet: gr } = Mr(r),
        Gr = gr
          ? { timestampWrites: { querySet: gr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Nr = gr
          ? { timestampWrites: { querySet: gr, endOfPassWriteIndex: 1 } }
          : void 0;
      (hr(tr, J, yr, nr, Gr), hr(tr, J, wr, nr, Nr));
      let Tr = kr(r, tr, gr),
        Sr = y ? null : E(r, tr, rr);
      F(r, tr);
      let xr = await j(Tr);
      if (y) return xr !== void 0 ? { gpuTimeMs: xr } : {};
      let vr = await G(Sr, Float32Array);
      return xr !== void 0 ? { C: vr, gpuTimeMs: xr } : { C: vr };
    } finally {
      (p || f(er), g || f(Q), y || f(rr), ar && f(ar), sr && f(sr));
    }
  }
  async function Ka(r, o, e, a, t, i, s, u, n, d, l, m, w, c = "row-major") {
    let p = s instanceof X,
      g = n instanceof X,
      y = m instanceof X;
    if (
      (H(r), T(r, "ssymm", { A: s, B: n, C: m }), o !== "left" && o !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!y && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((p || g) && !y)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (y && (!p || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("m and n must be non-negative.");
    if (a === 0 || t === 0) return y ? {} : { C: m };
    let b = p ? s.layout : c,
      x = g ? n.layout : c,
      v = y ? m.layout : c,
      B = o === "left" ? a : t;
    if (u < B)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (p) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (s.rows < B || s.cols < B)
        throw new Error("A is too small for the given m/n and side.");
    } else if (s.length < (B - 1) * u + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = x === "column-major" ? t : a,
      S = x === "column-major" ? a : t;
    if (d < S)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < a || n.cols < t)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (A - 1) * d + S)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let _ = v === "column-major" ? t : a,
      N = v === "column-major" ? a : t;
    if (w < N)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (y) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < a || m.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (_ - 1) * w + N)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let I = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      k = x === "column-major" ? "transpose" : "no-transpose",
      L = "no-transpose",
      R = a,
      W = t,
      V = B,
      C = o === "left" ? L : k,
      z = o === "left" ? k : L,
      K = (tr) => (tr === "no-transpose" ? "transpose" : "no-transpose"),
      Y = o === "right";
    v === "column-major" &&
      (([C, z] = [K(z), K(C)]), (Y = !Y), ([R, W] = [W, R]));
    let $ = B,
      J = Math.ceil(W / 64),
      nr = Math.ceil(R / 64),
      er = J * nr >= 36,
      Q = await P(r, er ? "sgemm_large" : "sgemm_small"),
      rr = await P(r, "symmetrize"),
      ar = er
        ? { x: or(r, J, "ssymm", "x"), y: or(r, nr, "ssymm", "y") }
        : {
            x: or(r, Math.ceil(W / 32), "ssymm", "x"),
            y: or(r, Math.ceil(R / 32), "ssymm", "y"),
          },
      sr = p ? s._buf : h(r, s, "ssymm-A", !1),
      lr = g ? n._buf : h(r, n, "ssymm-B", !1),
      ur = y ? m._buf : h(r, m, "ssymm-C", !0),
      mr = fr(r, B * $ * 4, "ssymm-Adense"),
      yr = null,
      wr = null;
    try {
      yr = q(
        r,
        [
          { value: B, type: "u32" },
          { value: u, type: "u32" },
          { value: $, type: "u32" },
          { value: I === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let tr = D(r, rr.getBindGroupLayout(0), [sr, mr, yr]),
        gr = Y ? lr : mr,
        Gr = Y ? d : $,
        Nr = Y ? mr : lr;
      wr = q(
        r,
        [
          { value: R, type: "u32" },
          { value: W, type: "u32" },
          { value: V, type: "u32" },
          { value: i, type: "f32" },
          { value: l, type: "f32" },
          { value: Gr, type: "u32" },
          { value: Y ? $ : d, type: "u32" },
          { value: w, type: "u32" },
          { value: C === "transpose" ? 1 : 0, type: "u32" },
          { value: z === "transpose" ? 1 : 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let Sr = D(r, Q.getBindGroupLayout(0), [
          gr,
          Dr(r, gr),
          Nr,
          Dr(r, Nr),
          ur,
          wr,
        ]),
        { commandEncoder: xr, querySet: vr } = Mr(r),
        Er = vr
          ? { timestampWrites: { querySet: vr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        _r = vr
          ? { timestampWrites: { querySet: vr, endOfPassWriteIndex: 1 } }
          : void 0;
      (hr(xr, rr, tr, { x: Math.ceil(B / 8), y: Math.ceil(B / 8) }, Er),
        hr(xr, Q, Sr, ar, _r));
      let Wr = kr(r, xr, vr),
        Ur = y ? null : E(r, xr, ur);
      F(r, xr);
      let Zr = await j(Wr);
      if (y) return Zr !== void 0 ? { gpuTimeMs: Zr } : {};
      let fe = await G(Ur, Float32Array);
      return Zr !== void 0 ? { C: fe, gpuTimeMs: Zr } : { C: fe };
    } finally {
      (p || f(sr), g || f(lr), y || f(ur), f(mr), yr && f(yr), wr && f(wr));
    }
  }
  async function Ua(r, o, e, a, t, i, s, u, n, d, l, m, w = "row-major") {
    let c = n instanceof X,
      p = l instanceof X,
      g = t === "unit";
    if ((H(r), T(r, "strmm", { A: n, B: l }), o !== "left" && o !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== p)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return p ? {} : { B: l };
    let y = c ? n.layout : w,
      b = p ? l.layout : w,
      x = o === "left" ? i : s;
    if (d < x)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (c) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * d + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = b === "column-major" ? s : i,
      B = b === "column-major" ? i : s;
    if (m < B)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * m + B)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = y === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      S =
        y === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      _ = b === "column-major" ? "transpose" : "no-transpose",
      N = "no-transpose",
      I = i,
      k = s,
      L = x,
      R = o === "left" ? N : _,
      W = o === "left" ? _ : N,
      V = (yr) => (yr === "no-transpose" ? "transpose" : "no-transpose"),
      C = o === "right";
    b === "column-major" &&
      (([R, W] = [V(W), V(R)]), (C = !C), ([I, k] = [k, I]));
    let z = x,
      K = Math.ceil(k / 64),
      Y = Math.ceil(I / 64),
      $ = K * Y >= 36,
      J = await P(r, $ ? "sgemm_large" : "sgemm_small"),
      nr = await P(r, "triangularize"),
      er = $
        ? { x: or(r, K, "strmm", "x"), y: or(r, Y, "strmm", "y") }
        : {
            x: or(r, Math.ceil(k / 32), "strmm", "x"),
            y: or(r, Math.ceil(I / 32), "strmm", "y"),
          },
      Q = null,
      rr = null,
      ar = null,
      sr = null,
      lr = null,
      ur = null,
      mr = !1;
    try {
      ((Q = c ? n._buf : h(r, n, "strmm-A", !1)),
        (rr = p ? l._buf : h(r, l, "strmm-B", !0)),
        (ar = fr(r, x * z * 4, "strmm-Adense")),
        (sr = fr(
          r,
          v * m * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (lr = q(
          r,
          [
            { value: x, type: "u32" },
            { value: d, type: "u32" },
            { value: z, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: S === "transpose" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let yr = D(r, nr.getBindGroupLayout(0), [Q, ar, lr]),
        wr = C ? rr : ar,
        tr = C ? m : z,
        gr = C ? ar : rr;
      ur = q(
        r,
        [
          { value: I, type: "u32" },
          { value: k, type: "u32" },
          { value: L, type: "u32" },
          { value: u, type: "f32" },
          { value: 0, type: "f32" },
          { value: tr, type: "u32" },
          { value: C ? z : m, type: "u32" },
          { value: m, type: "u32" },
          { value: R === "transpose" ? 1 : 0, type: "u32" },
          { value: W === "transpose" ? 1 : 0, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let Nr = D(r, J.getBindGroupLayout(0), [
          wr,
          Dr(r, wr),
          gr,
          Dr(r, gr),
          sr,
          ur,
        ]),
        { commandEncoder: Tr, querySet: Sr } = Mr(r);
      Tr.copyBufferToBuffer(rr, 0, sr, 0, Math.min(rr.size, sr.size));
      let xr = Sr
          ? { timestampWrites: { querySet: Sr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        vr = Sr
          ? { timestampWrites: { querySet: Sr, endOfPassWriteIndex: 1 } }
          : void 0;
      (hr(Tr, nr, yr, { x: Math.ceil(x / 8), y: Math.ceil(x / 8) }, xr),
        hr(Tr, J, Nr, er, vr));
      let Er = kr(r, Tr, Sr),
        _r = p ? null : E(r, Tr, sr);
      F(r, Tr);
      let Wr = await j(Er);
      if (p)
        return (
          f(l._buf),
          (l._buf = sr),
          (mr = !0),
          Wr !== void 0 ? { gpuTimeMs: Wr } : {}
        );
      let Ur = await G(_r, Float32Array);
      return Wr !== void 0 ? { B: Ur, gpuTimeMs: Wr } : { B: Ur };
    } finally {
      (!c && Q && f(Q),
        !p && rr && f(rr),
        ar && f(ar),
        sr && !mr && f(sr),
        lr && f(lr),
        ur && f(ur));
    }
  }
  async function za(r, o, e, a, t, i, s, u, n, d, l, m, w = "row-major") {
    let c = n instanceof X,
      p = l instanceof X,
      g = t === "unit";
    if ((H(r), T(r, "strsm", { A: n, B: l }), o !== "left" && o !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== p)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return p ? {} : { B: l };
    let y = c ? n.layout : w,
      b = p ? l.layout : w,
      x = o === "left" ? i : s;
    if (d < x)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (c) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * d + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = b === "column-major" ? s : i,
      B = b === "column-major" ? i : s;
    if (m < B)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * m + B)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = y === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      S =
        y === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      _ = o === "left" ? s : i,
      N = o === "left",
      I = (S === "no-transpose") == (A === "lower"),
      k = o === "left" ? I : !I,
      L = [];
    for (let rr = 0; rr < x; rr += 64) L.push(rr);
    k || L.reverse();
    let R = L.length,
      W = await P(r, "strsv_invert_block"),
      V = await P(r, "block_transfer"),
      C = await P(r, "sscal"),
      z = null,
      K = null,
      Y = null,
      $ = [],
      J = [];
    function nr(rr, ar) {
      let sr = fr(r, rr, ar);
      return (J.push(sr), sr);
    }
    function er(rr, ar) {
      let sr = q(r, rr, ar);
      return ($.push(sr), sr);
    }
    let Q = (v - 1) * m + B;
    try {
      ((z = c ? n._buf : h(r, n, "strsm-A", !1)),
        (K = p ? l._buf : h(r, l, "strsm-B", !0)),
        (Y = fr(r, R * 64 * 64 * 4, "strsm-Ainv")));
      let rr = null;
      if (u !== 1 && u !== 0) {
        let Sr = er(
          [
            { value: Q, type: "u32" },
            { value: u, type: "f32" },
            { value: 1, type: "u32" },
          ],
          "strsm-scale-params",
        );
        rr = D(r, C.getBindGroupLayout(0), [K, Sr]);
      }
      let ar = er(
          [
            { value: x, type: "u32" },
            { value: d, type: "u32" },
            { value: S === "transpose" ? 1 : 0, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strsm-invert-params",
        ),
        sr = D(r, W.getBindGroupLayout(0), [z, Y, ar]),
        lr = nr(64 * _ * 4, "strsm-Bblock"),
        ur = nr(64 * _ * 4, "strsm-Xblock"),
        mr = nr(x * 64 * 4, "strsm-Aoff"),
        yr = nr(x * _ * 4, "strsm-delta"),
        { commandEncoder: wr, querySet: tr } = Mr(r);
      if (u === 0) {
        let Sr = Math.ceil(B / 64),
          xr = Math.ceil(v / 64),
          vr = Sr * xr >= 36,
          Er = await P(r, vr ? "sgemm_large" : "sgemm_small"),
          _r = er(
            [
              { value: v, type: "u32" },
              { value: B, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "f32" },
              { value: 0, type: "f32" },
              { value: 1, type: "u32" },
              { value: 1, type: "u32" },
              { value: m, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "strsm-zero-params",
          ),
          Wr = D(r, Er.getBindGroupLayout(0), [
            Y,
            Dr(r, Y),
            Y,
            Dr(r, Y),
            K,
            _r,
          ]),
          Ur = vr
            ? { x: or(r, Sr, "strsm", "x"), y: or(r, xr, "strsm", "y") }
            : {
                x: or(r, Math.ceil(B / 32), "strsm", "x"),
                y: or(r, Math.ceil(v / 32), "strsm", "y"),
              };
        hr(
          wr,
          Er,
          Wr,
          Ur,
          tr
            ? {
                timestampWrites: {
                  querySet: tr,
                  beginningOfPassWriteIndex: 0,
                  endOfPassWriteIndex: 1,
                },
              }
            : void 0,
        );
      } else {
        (rr && hr(wr, C, rr, br(r, Q)),
          hr(
            wr,
            W,
            sr,
            { x: 64, y: R },
            tr
              ? {
                  timestampWrites: {
                    querySet: tr,
                    beginningOfPassWriteIndex: 0,
                  },
                }
              : void 0,
          ));
        for (let xr = 0; xr < L.length; xr++) {
          let vr = L[xr],
            Er = Math.min(vr + 64, x),
            _r = Er - vr,
            Wr = vr / 64,
            Ur = xr === L.length - 1,
            Zr = er(
              [
                { value: vr, type: "u32" },
                { value: _r, type: "u32" },
                { value: 0, type: "u32" },
                { value: _, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-B-params",
            ),
            fe = D(r, V.getBindGroupLayout(0), [lr, K, Zr]);
          hr(wr, V, fe, Yr(r, "strsm", _r, _));
          {
            let Xr = _r,
              $r = _,
              _e = _r,
              ae = Math.ceil($r / 64),
              ie = Math.ceil(Xr / 64),
              se = ae * ie >= 36,
              ne = await P(r, se ? "sgemm_large" : "sgemm_small"),
              Be = er(
                [
                  { value: Xr, type: "u32" },
                  { value: $r, type: "u32" },
                  { value: _e, type: "u32" },
                  { value: 1, type: "f32" },
                  { value: 0, type: "f32" },
                  { value: 64, type: "u32" },
                  { value: _, type: "u32" },
                  { value: _, type: "u32" },
                  { value: o === "right" ? 1 : 0, type: "u32" },
                  { value: 0, type: "u32" },
                ],
                "strsm-apply-params",
              ),
              ce = { buffer: Y, offset: Wr * 64 * 64 * 4, size: 4096 * 4 },
              Ae = D(r, ne.getBindGroupLayout(0), [
                ce,
                Dr(r, ce),
                lr,
                Dr(r, lr),
                ur,
                Be,
              ]),
              ti = se
                ? { x: or(r, ae, "strsm", "x"), y: or(r, ie, "strsm", "y") }
                : {
                    x: or(r, Math.ceil($r / 32), "strsm", "x"),
                    y: or(r, Math.ceil(Xr / 32), "strsm", "y"),
                  };
            hr(wr, ne, Ae, ti);
          }
          let me = k ? Er : 0,
            Re = k ? x : vr,
            je = me < Re,
            Ya = er(
              [
                { value: vr, type: "u32" },
                { value: _r, type: "u32" },
                { value: 0, type: "u32" },
                { value: _, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            ),
            Za = D(r, V.getBindGroupLayout(0), [ur, K, Ya]),
            Xa =
              Ur && !je && tr
                ? { timestampWrites: { querySet: tr, endOfPassWriteIndex: 1 } }
                : void 0;
          if ((hr(wr, V, Za, Yr(r, "strsm", _r, _), Xa), !je)) continue;
          let oe = Re - me,
            $a = er(
              [
                { value: me, type: "u32" },
                { value: oe, type: "u32" },
                { value: vr, type: "u32" },
                { value: _r, type: "u32" },
                { value: d, type: "u32" },
                { value: S === "transpose" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-A-params",
            ),
            Ja = D(r, V.getBindGroupLayout(0), [mr, z, $a]);
          hr(wr, V, Ja, Yr(r, "strsm", oe, _r));
          {
            let Xr = oe,
              $r = _,
              _e = _r,
              ae = Math.ceil($r / 64),
              ie = Math.ceil(Xr / 64),
              se = ae * ie >= 36,
              ne = await P(r, se ? "sgemm_large" : "sgemm_small"),
              Be = er(
                [
                  { value: Xr, type: "u32" },
                  { value: $r, type: "u32" },
                  { value: _e, type: "u32" },
                  { value: 1, type: "f32" },
                  { value: 0, type: "f32" },
                  { value: _r, type: "u32" },
                  { value: _, type: "u32" },
                  { value: _, type: "u32" },
                  { value: 0, type: "u32" },
                  { value: 0, type: "u32" },
                ],
                "strsm-update-params",
              ),
              ce = D(r, ne.getBindGroupLayout(0), [
                mr,
                Dr(r, mr),
                ur,
                Dr(r, ur),
                yr,
                Be,
              ]),
              Ae = se
                ? { x: or(r, ae, "strsm", "x"), y: or(r, ie, "strsm", "y") }
                : {
                    x: or(r, Math.ceil($r / 32), "strsm", "x"),
                    y: or(r, Math.ceil(Xr / 32), "strsm", "y"),
                  };
            hr(wr, ne, ce, Ae);
          }
          let Qa = er(
              [
                { value: me, type: "u32" },
                { value: oe, type: "u32" },
                { value: 0, type: "u32" },
                { value: _, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 1, type: "u32" },
              ],
              "strsm-scatter-sub-params",
            ),
            ri = D(r, V.getBindGroupLayout(0), [yr, K, Qa]),
            ei =
              Ur && tr
                ? { timestampWrites: { querySet: tr, endOfPassWriteIndex: 1 } }
                : void 0;
          hr(wr, V, ri, Yr(r, "strsm", oe, _), ei);
        }
      }
      let gr = kr(r, wr, tr),
        Gr = p ? null : E(r, wr, K);
      F(r, wr);
      let Nr = await j(gr);
      if (p) return Nr !== void 0 ? { gpuTimeMs: Nr } : {};
      let Tr = await G(Gr, Float32Array);
      return Nr !== void 0 ? { B: Tr, gpuTimeMs: Nr } : { B: Tr };
    } finally {
      (!c && z && f(z), !p && K && f(K), Y && f(Y), f(J), f($));
    }
  }
  return li(_s);
})();
