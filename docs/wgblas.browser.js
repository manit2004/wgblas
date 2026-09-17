var wgblas = (() => {
  var ka = Object.create;
  var pe = Object.defineProperty;
  var Da = Object.getOwnPropertyDescriptor;
  var Na = Object.getOwnPropertyNames;
  var Pa = Object.getPrototypeOf,
    Ma = Object.prototype.hasOwnProperty;
  var ge = ((r) =>
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
  var O = (r, t, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (t = r((r = 0))), t);
    } catch (o) {
      throw ((e = [o]), o);
    }
  };
  var qe = (r, t) => {
      for (var e in t) pe(r, e, { get: t[e], enumerable: !0 });
    },
    Te = (r, t, e, o) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let a of Na(t))
          !Ma.call(r, a) &&
            a !== e &&
            pe(r, a, {
              get: () => t[a],
              enumerable: !(o = Da(t, a)) || o.enumerable,
            });
      return r;
    };
  var we = (r, t, e) => (
      (e = r != null ? ka(Pa(r)) : {}),
      Te(
        t || !r || !r.__esModule
          ? pe(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    Ia = (r) => Te(pe({}, "__esModule", { value: !0 }), r);
  var ke,
    $e = O(() => {
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
    Ze = O(() => {
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
  var rt,
    Je = O(() => {
      rt = `// sswap: x <-> y

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
  var tt,
    et = O(() => {
      tt = `// dswap: x <-> y, double-double (Dekker) f64 emulation of sswap. A swap is
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
  var at,
    ot = O(() => {
      at = `// saxpy: y = alpha * x + y

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
  var st,
    it = O(() => {
      st = `// scopy: y = x

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
  var lt,
    nt = O(() => {
      lt = `// dcopy: y = x, double-double (Dekker) f64 emulation of scopy. A copy is
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
    ut = O(() => {
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
    mt = O(() => {
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
  var ct,
    dt = O(() => {
      ct = `// sasum: result = sum(|x[i]|)
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
    pt = O(() => {
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
  var ht,
    wt = O(() => {
      ht = `// scaledSum reduction: collapses 2*WGS (scale, ssq) partials from
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
  var yt,
    bt = O(() => {
      yt = `// isamax: returns index of element with largest absolute value
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
  var vt,
    xt = O(() => {
      vt = `// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
  var Kr,
    _t = O(() => {
      Kr = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
    Bt = O(() => {
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
  var zr,
    At = O(() => {
      zr = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var Gt,
    St = O(() => {
      Gt = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
  var Ne,
    Et = O(() => {
      Ne = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
  var $r,
    kt = O(() => {
      $r = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var Nt,
    Dt = O(() => {
      Nt = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
    Pt = O(() => {
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
  var Lt,
    It = O(() => {
      Lt = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
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
    Rt = O(() => {
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
  var Tt,
    qt = O(() => {
      Tt = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var Ft,
    Ct = O(() => {
      Ft = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
    jt = O(() => {
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
    Ht = O(() => {
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
  var Kt,
    Vt = O(() => {
      Kt = `// drot: x = c*x + s*y, y = -s*x + c*y \u2014 double-double (Dekker) f64 emulation
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
  var Ut,
    zt = O(() => {
      Ut = `// srotm: applies modified Givens rotation H to vectors x and y.
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
    Yt = O(() => {
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
  var Zt,
    $t = O(() => {
      Zt = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var Jt,
    Qt = O(() => {
      Jt = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
    ro = O(() => {
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
    to = O(() => {
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
    ao = O(() => {
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
    so = O(() => {
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
    lo = O(() => {
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
    fo = O(() => {
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
    co = O(() => {
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
  var go,
    po = O(() => {
      go = `// strsv_apply_inverse: given a precomputed block inverse (from
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
    wo = O(() => {
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
    bo = O(() => {
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
    xo = O(() => {
      vo = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
  var Bo,
    _o = O(() => {
      Bo = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
    Ao = O(() => {
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
  var fe,
    So = O(() => {
      fe = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
    Go = O(() => {
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
    Eo = O(() => {
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
  var Do,
    ko = O(() => {
      Do = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var Po,
    No = O(() => {
      Po = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
  var Io,
    Mo = O(() => {
      Io = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var Lo = {};
  qe(Lo, { routineShaders: () => or, shaderSources: () => Ii });
  var or,
    Ii,
    Ro = O(() => {
      $e();
      Ze();
      Je();
      et();
      ot();
      it();
      nt();
      ut();
      mt();
      dt();
      pt();
      wt();
      bt();
      xt();
      _t();
      Bt();
      At();
      St();
      Et();
      kt();
      Dt();
      Pt();
      It();
      Rt();
      qt();
      Ct();
      jt();
      Ht();
      Vt();
      zt();
      Yt();
      $t();
      Qt();
      ro();
      to();
      ao();
      so();
      lo();
      fo();
      co();
      po();
      wo();
      bo();
      xo();
      _o();
      Ao();
      So();
      Go();
      Eo();
      ko();
      No();
      Mo();
      or = {};
      or.sscal = { sscal: ke };
      or.cscal = { cscal: Qe };
      or.sswap = { sswap: rt };
      or.dswap = { dswap: tt };
      or.saxpy = { saxpy: at };
      or.scopy = { scopy: st };
      or.dcopy = { dcopy: lt };
      or.sdot = { sdot: ft, "reduction/sum": De };
      or.sasum = { sasum: ct, "reduction/sum": De };
      or.snrm2 = { snrm2: gt, "reduction/scaledSum": ht };
      or.isamax = { isamax: yt, "reduction/argmax": vt };
      or.dasum = {
        "f64/dekker": Kr,
        "f64/utils/abs": ye,
        "f64/utils/add": zr,
        dasum: Gt,
        "reduction/sumF64": Ne,
      };
      or.ddot = {
        "f64/dekker": Kr,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        ddot: Nt,
        "reduction/sumF64": Ne,
      };
      or.dscal = {
        "f64/dekker": Kr,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        dscal: Mt,
      };
      or.daxpy = {
        "f64/dekker": Kr,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        daxpy: Lt,
      };
      or.idamax = {
        "f64/dekker": Kr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Pe,
        "f64/utils/equal": Tt,
        idamax: Ft,
        "reduction/argmaxF64": Wt,
      };
      or.srot = { srot: Ot };
      or.drot = {
        "f64/dekker": Kr,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        drot: Kt,
      };
      or.srotm = { srotm: Ut };
      or.drotm = {
        "f64/dekker": Kr,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        drotm: Xt,
      };
      or.dnrm2 = {
        "f64/dekker": Kr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Pe,
        "f64/utils/add": zr,
        "f64/utils/multiply": $r,
        "f64/utils/divide": Zt,
        "f64/utils/sqrt": Jt,
        dnrm2: eo,
        "reduction/scaledSumF64": oo,
      };
      or.sgemv = { sgemv_n: io, sgemv_t: no };
      or.ssymv = { ssymv: uo };
      or.strmv = { strmv: mo };
      or.strsv = {
        strsv_invert_block: Me,
        strsv_apply_inverse: go,
        strsv_update: ho,
      };
      or.sger = { sger: yo };
      or.ssyr = { ssyr: vo };
      or.ssyr2 = { ssyr2: Bo };
      or.sgemm = { sgemm_small: ue, sgemm_large: fe };
      or.sgemmtr = { sgemmtr_small: xe, sgemmtr_large: ve };
      or.ssyrk = { sgemmtr_small: xe, sgemmtr_large: ve };
      or.ssyr2k = { sgemmtr_small: xe, sgemmtr_large: ve };
      or.ssymm = { sgemm_small: ue, sgemm_large: fe, symmetrize: Do };
      or.strmm = { sgemm_small: ue, sgemm_large: fe, triangularize: Po };
      or.strsm = {
        strsv_invert_block: Me,
        block_transfer: Io,
        sscal: ke,
        sgemm_small: ue,
        sgemm_large: fe,
      };
      Ii = Object.assign({}, ...Object.values(or));
    });
  var Ti = {};
  qe(Ti, {
    Complex32: () => Wr,
    Complex32Array: () => _r,
    Complex64: () => jr,
    Complex64Array: () => Gr,
    GpuMatrix: () => X,
    GpuVector: () => N,
    cleanup: () => Oe,
    cscal: () => To,
    dasum: () => Uo,
    daxpy: () => Ho,
    dcopy: () => Vo,
    ddot: () => Yo,
    dnrm2: () => $o,
    drot: () => ra,
    drotm: () => ta,
    dscal: () => Co,
    dswap: () => jo,
    gpuName: () => Ve,
    idamax: () => Qo,
    init: () => He,
    isamax: () => Zo,
    randomFloat32Array: () => Ue,
    randomFloat64Array: () => Ye,
    randomTriangularFloat32Array: () => Xe,
    sasum: () => zo,
    saxpy: () => Wo,
    scopy: () => Oo,
    sdot: () => Ko,
    sgemm: () => da,
    sgemmtr: () => ca,
    sgemv: () => oa,
    sger: () => ua,
    snrm2: () => Xo,
    srot: () => Jo,
    srotm: () => ea,
    sscal: () => qo,
    sswap: () => Fo,
    ssymm: () => wa,
    ssymv: () => aa,
    ssyr: () => fa,
    ssyr2: () => ma,
    ssyr2k: () => ga,
    ssyrk: () => pa,
    strmm: () => ha,
    strmv: () => ia,
    strsm: () => ba,
    strsv: () => la,
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
  function Fe(r) {
    if (!je(r)) return { querySet: null, passDescriptor: void 0 };
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
  function Lr(r, t, e) {
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
  async function P(r) {
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
  var Qr = null,
    Se = !1,
    Jr = new Map(),
    le = new WeakMap(),
    Vr = null,
    We = ({ powerPreference: r, benchmark: t }) => `${r}::${t}`;
  async function He({
    powerPreference: r = "high-performance",
    benchmark: t = !1,
    dumpShaders: e = !1,
  } = {}) {
    let o = { powerPreference: r, benchmark: t, dumpShaders: e },
      a = We(o),
      i = Jr.get(a);
    if (i) return i;
    if (Qr)
      e !== Se &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Se}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: m, globals: p } = await import("webgpu");
      (Object.assign(globalThis, p),
        (Qr = m(
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
        (Qr = navigator.gpu));
    if (!Qr) throw new Error("WebGPU not supported in this environment.");
    let s =
      (await Qr.requestAdapter({ powerPreference: r })) ??
      (await Qr.requestAdapter());
    if (!s) throw new Error("No WebGPU adapter found.");
    let n = [...(Ce(s, t).requiredFeatures ?? [])],
      f = await s.requestDevice({ requiredFeatures: n });
    f.addEventListener("uncapturederror", (m) => {
      console.error("Uncaptured GPU error:", m.error.message);
    });
    let l = n.includes("timestamp-query");
    return (
      le.set(f, { adapter: s, benchmark: l, options: o }),
      Jr.set(a, f),
      Vr || (Vr = f),
      f
    );
  }
  function Oe(r) {
    if (r === void 0) {
      for (let e of Jr.values()) e.destroy();
      (Jr.clear(), (Vr = null));
      return;
    }
    let t = le.get(r);
    t &&
      (Jr.delete(We(t.options)),
      le.delete(r),
      r.destroy(),
      Vr === r && (Vr = Jr.values().next().value ?? null));
  }
  function Ve(r = Vr) {
    let t = r && le.get(r);
    if (!t)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: o } = t.adapter.info;
    return { description: o || "unknown", device: e || "unknown" };
  }
  function je(r = Vr) {
    return le.get(r)?.benchmark ?? !1;
  }
  function re() {
    if (!Vr)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return Vr;
  }
  function d(...r) {
    r.flat().forEach((t) => t.destroy());
  }
  function Ge(r, t, e) {
    let o = r.limits.maxStorageBufferBindingSize;
    if (t > o)
      throw new Error(
        `Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${o} bytes). The operands are too large for this device.`,
      );
  }
  function x(r, t, e = "blas-input", o = !1) {
    let a = t.byteLength;
    Ge(r, a, e);
    let i = o
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE,
      s = r.createBuffer({ label: e, size: a, usage: i, mappedAtCreation: !0 }),
      u = t.constructor;
    return (new u(s.getMappedRange()).set(t), s.unmap(), s);
  }
  function tr(r, t, e = "blas-storage", o = 0) {
    return (
      Ge(r, t, e),
      r.createBuffer({ label: e, size: t, usage: GPUBufferUsage.STORAGE | o })
    );
  }
  function Br(r, t, e = "blas-result") {
    return (
      Ge(r, t, e),
      r.createBuffer({
        label: e,
        size: t,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  function G(r, t, e) {
    let o = r.createBuffer({
      label: "blas-readback",
      size: e.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (t.copyBufferToBuffer(e, 0, o, 0, e.size), o);
  }
  var ee = 16,
    Ke = new WeakMap();
  function La(r) {
    let t = Ke.get(r);
    return (
      t ||
        ((t = r.createBuffer({
          label: "blas-vec4-fallback",
          size: ee,
          usage: GPUBufferUsage.STORAGE,
        })),
        Ke.set(r, t)),
      t
    );
  }
  function Sr(r, t) {
    let e = t instanceof GPUBuffer ? t : t.buffer,
      o = t instanceof GPUBuffer ? 0 : (t.offset ?? 0),
      a = t instanceof GPUBuffer ? t.size : (t.size ?? e.size - o),
      i = Math.floor(a / ee) * ee;
    return i < ee
      ? { buffer: La(r), offset: 0, size: ee }
      : { buffer: e, offset: o, size: i };
  }
  function Ee(r, t, e, o) {
    if (t % 4 !== 0) return !1;
    let a = r instanceof GPUBuffer ? r : r.buffer,
      i = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      s = r instanceof GPUBuffer ? a.size : (r.size ?? a.size - i),
      u = Math.floor(s / ee) * 4;
    if (u <= 0) return !1;
    let n = (Math.max(e, 1) - 1) * t + (Math.max(o, 1) - 1);
    return Math.floor(n / 4) * 4 + 4 <= u;
  }
  function I(r, t, e = "blas-params") {
    let o = t.length * 4,
      a = Math.ceil(o / 16) * 16,
      i = new ArrayBuffer(a),
      s = new DataView(i);
    t.forEach(({ value: n, type: f }, l) => {
      let m = l * 4;
      if (f === "u32") s.setUint32(m, n, !0);
      else if (f === "i32") s.setInt32(m, n, !0);
      else if (f === "f32") s.setFloat32(m, n, !0);
      else
        throw new Error(
          `Unknown param type "${f}". Use "f32", "u32", or "i32".`,
        );
    });
    let u = r.createBuffer({
      label: e,
      size: a,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(u, 0, i), u);
  }
  async function S(r, t = Float32Array) {
    try {
      await r.mapAsync(GPUMapMode.READ);
      let e = new t(r.getMappedRange().slice());
      return (r.unmap(), e);
    } finally {
      r.destroy();
    }
  }
  function rr(r) {
    let t = r.length,
      e = new Float32Array(t),
      o = new Float32Array(t);
    for (let a = 0; a < t; a++) {
      let i = Math.fround(r[a]);
      ((e[a] = i), (o[a] = Math.fround(r[a] - i)));
    }
    return { hi: e, lo: o };
  }
  function dr(r, t) {
    let e = r.length,
      o = new Float64Array(e);
    for (let a = 0; a < e; a++) o[a] = r[a] + t[a];
    return o;
  }
  var jr = class {
      constructor(t, e) {
        ((this.re = t), (this.im = e));
      }
    },
    Gr = class extends Array {
      constructor(t) {
        if (t === void 0) {
          super();
          return;
        }
        if (typeof t == "number") {
          super(t);
          for (let o = 0; o < t; o++) this[o] = new jr(0, 0);
          return;
        }
        let e = Array.from(t);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof jr) {
            for (let o of e) {
              if (!(o instanceof jr))
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
            this.push(new jr(e[o], e[o + 1]));
          }
        }
      }
    };
  function te(r, t = r.length) {
    let e = new Float32Array(t * 2);
    for (let o = 0; o < t; o++)
      ((e[o * 2] = r[o].re), (e[o * 2 + 1] = r[o].im));
    return e;
  }
  function he(r, t = r.length) {
    let e = new Float64Array(t),
      o = new Float64Array(t);
    for (let l = 0; l < t; l++) ((e[l] = r[l].re), (o[l] = r[l].im));
    let { hi: a, lo: i } = rr(e),
      { hi: s, lo: u } = rr(o),
      n = new Float32Array(t * 2),
      f = new Float32Array(t * 2);
    for (let l = 0; l < t; l++)
      ((n[l * 2] = a[l]),
        (n[l * 2 + 1] = s[l]),
        (f[l * 2] = i[l]),
        (f[l * 2 + 1] = u[l]));
    return { hi: n, lo: f };
  }
  function be(r, t) {
    let e = r.length / 2,
      o = new Float32Array(e),
      a = new Float32Array(e),
      i = new Float32Array(e),
      s = new Float32Array(e);
    for (let l = 0; l < e; l++)
      ((o[l] = r[l * 2]),
        (i[l] = r[l * 2 + 1]),
        (a[l] = t[l * 2]),
        (s[l] = t[l * 2 + 1]));
    let u = dr(o, a),
      n = dr(i, s),
      f = new Gr(e);
    for (let l = 0; l < e; l++) f[l] = new jr(u[l], n[l]);
    return f;
  }
  var Wr = class {
      constructor(t, e) {
        ((this.re = Math.fround(t)), (this.im = Math.fround(e)));
      }
    },
    _r = class extends Array {
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
            this.push(new Wr(e[o], e[o + 1]));
          }
        }
      }
    };
  var N = class r {
    constructor(t, e, o = Float32Array, a = null, i = null) {
      ((this._buf = t),
        (this._loBuf = a),
        (this.length = e),
        (this.dtype = o),
        (this.device = i ?? re()));
    }
    static from(t, e) {
      let o = t instanceof GPUDevice,
        a = o ? t : re(),
        i = o ? e : t;
      if (i instanceof Float64Array) {
        let { hi: u, lo: n } = rr(i),
          f = x(a, u, "gpu-vector-f64-hi", !0),
          l = x(a, n, "gpu-vector-f64-lo", !0);
        return new r(f, i.length, Float64Array, l, a);
      }
      if (i instanceof _r) {
        let u = x(a, te(i), "gpu-vector-complex32", !0);
        return new r(u, i.length, _r, null, a);
      }
      if (i instanceof Gr) {
        let { hi: u, lo: n } = he(i),
          f = x(a, u, "gpu-vector-complex64-hi", !0),
          l = x(a, n, "gpu-vector-complex64-lo", !0);
        return new r(f, i.length, Gr, l, a);
      }
      if (!(i instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let s = x(a, i, "gpu-vector", !0);
      return new r(s, i.length, i.constructor, null, a);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        o = G(t, e, this._buf);
      if ((t.queue.submit([e.finish()]), this.dtype === _r))
        return new _r(await S(o, Float32Array));
      if (!this._loBuf) return S(o, this.dtype);
      let a = t.createCommandEncoder(),
        i = G(t, a, this._loBuf);
      t.queue.submit([a.finish()]);
      let [s, u] = await Promise.all([S(o, Float32Array), S(i, Float32Array)]);
      return this.dtype === Gr ? be(s, u) : dr(s, u);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var X = class r {
    constructor(
      t,
      e,
      o,
      a,
      i = null,
      s = "row-major",
      u = null,
      n = Float32Array,
    ) {
      ((this._buf = t),
        (this._loBuf = i),
        (this.rows = e),
        (this.cols = o),
        (this.lda = a),
        (this.layout = s),
        (this.dtype = n),
        (this.device = u ?? re()));
    }
    static from(t, ...e) {
      let o = t instanceof GPUDevice,
        a = o ? t : re(),
        i = o ? e.shift() : t,
        [s, u, n, f = "row-major"] = e;
      if (f !== "row-major" && f !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let l = f === "row-major";
      if (
        (n === void 0 && (n = l ? u : s),
        !(i instanceof Float32Array) &&
          !(i instanceof Float64Array) &&
          !(i instanceof _r) &&
          !(i instanceof Gr))
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
      let p = l ? s : u;
      if (i.length < p * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (i instanceof Float64Array) {
        let g = p * n,
          { hi: w, lo: h } = rr(i.subarray(0, g)),
          b = x(a, w, "gpu-matrix-f64-hi", !0),
          y = x(a, h, "gpu-matrix-f64-lo", !0);
        return new r(b, s, u, n, y, f, a, Float64Array);
      }
      if (i instanceof _r) {
        let g = x(a, te(i, p * n), "gpu-matrix-complex32", !0);
        return new r(g, s, u, n, null, f, a, _r);
      }
      if (i instanceof Gr) {
        let { hi: g, lo: w } = he(i, p * n),
          h = x(a, g, "gpu-matrix-complex64-hi", !0),
          b = x(a, w, "gpu-matrix-complex64-lo", !0);
        return new r(h, s, u, n, b, f, a, Gr);
      }
      let c = x(a, i.subarray(0, p * n), "gpu-matrix", !0);
      return new r(c, s, u, n, null, f, a);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        o = G(t, e, this._buf);
      t.queue.submit([e.finish()]);
      let a = this.layout !== "column-major",
        i = a ? this.rows : this.cols,
        s = a ? this.cols : this.rows;
      if (this.dtype === _r) {
        let f = new _r(await S(o, Float32Array));
        if (this.lda === s) return f;
        let l = new _r(i * s);
        for (let m = 0; m < i; m++)
          for (let p = 0; p < s; p++) l[m * s + p] = f[m * this.lda + p];
        return l;
      }
      if (this._loBuf) {
        let f = t.createCommandEncoder(),
          l = G(t, f, this._loBuf);
        t.queue.submit([f.finish()]);
        let [m, p] = await Promise.all([
          S(o, Float32Array),
          S(l, Float32Array),
        ]);
        if (this.dtype === Gr) {
          let w = be(m, p);
          if (this.lda === s) return w;
          let h = new Gr(i * s);
          for (let b = 0; b < i; b++)
            for (let y = 0; y < s; y++) h[b * s + y] = w[b * this.lda + y];
          return h;
        }
        let c = dr(m, p);
        if (this.lda === s) return c;
        let g = new Float64Array(i * s);
        for (let w = 0; w < i; w++)
          g.set(c.subarray(w * this.lda, w * this.lda + s), w * s);
        return g;
      }
      let u = await S(o, Float32Array);
      if (this.lda === s) return u;
      let n = new Float32Array(i * s);
      for (let f = 0; f < i; f++)
        n.set(u.subarray(f * this.lda, f * this.lda + s), f * s);
      return n;
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  function ze(r) {
    let t = r >>> 0;
    return function () {
      t = (t + 1831565813) | 0;
      let e = Math.imul(t ^ (t >>> 15), 1 | t);
      return (
        (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
        ((e ^ (e >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function Ue(r, t = -1, e = 1, o) {
    let a = new Float32Array(r),
      i = o === void 0 ? Math.random : ze(o);
    for (let s = 0; s < r; s++) a[s] = t + i() * (e - t);
    return a;
  }
  function Ye(r, t = -1, e = 1, o) {
    let a = new Float64Array(r),
      i = o === void 0 ? Math.random : ze(o);
    for (let s = 0; s < r; s++) a[s] = t + i() * (e - t);
    return a;
  }
  function Xe(
    r,
    t,
    e = "lower",
    o = -1,
    a = 1,
    i = 5,
    s = 15,
    u = "row-major",
  ) {
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (t < r) throw new Error("lda must be >= n.");
    let n = u === "column-major",
      f = (m, p) => (n ? p * t + m : m * t + p),
      l = new Float32Array(r * t);
    for (let m = 0; m < r; m++) {
      for (let p = 0; p < r; p++) {
        if (m === p) continue;
        (e === "lower" ? p < m : p > m) &&
          (l[f(m, p)] = o + Math.random() * (a - o));
      }
      l[f(m, m)] = i + Math.random() * (s - i);
    }
    return l;
  }
  function E(r, t, e, o = 0) {
    let a = e.map((i, s) => ({
      binding: o + s,
      resource: i instanceof GPUBuffer ? { buffer: i } : i,
    }));
    return r.createBindGroup({ layout: t, entries: a });
  }
  function M(r, t) {
    r.queue.submit([t.finish()]);
  }
  function qr(r) {
    let { querySet: t, passDescriptor: e } = Fe(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: t,
      passDescriptor: e,
    };
  }
  function gr(r, t, e, o, a) {
    let i = r.beginComputePass(a);
    (i.setPipeline(t),
      i.setBindGroup(0, e),
      typeof o == "number"
        ? i.dispatchWorkgroups(o)
        : i.dispatchWorkgroups(o.x, o.y, o.z ?? 1),
      i.end());
  }
  function j(r, t, e, o) {
    let { commandEncoder: a, querySet: i, passDescriptor: s } = qr(r);
    gr(a, t, e, o, s);
    let u = Lr(r, a, i);
    return { commandEncoder: a, ts: u };
  }
  var qi = {},
    Ie = new WeakMap();
  async function D(r, t, e = "main") {
    Ie.has(r) || Ie.set(r, new Map());
    let o = Ie.get(r),
      a = Array.isArray(t) ? t : [t],
      i = `${a.join("+")}::${e}`;
    if (!o.has(i)) {
      let s = Ri(r, a, e).catch((u) => {
        throw (o.delete(i), u);
      });
      o.set(i, s);
    }
    return o.get(i);
  }
  async function Li(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: t } = await Promise.resolve().then(() => (Ro(), Lo)),
        e = t[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: t } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: o, join: a } = await import("path"),
        i = o(e(qi.url));
      return t(a(i, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function Ri(r, t, e = "main") {
    let o = t.join("+"),
      a = await Promise.all(t.map(Li)),
      i = 0,
      s = a.map((g, w) => {
        let h = g.split(`
`).length,
          b = { name: t[w], startLine: i + 1, endLine: i + h };
        return ((i += h), b);
      }),
      u = (g) => {
        let w = g && s.find((h) => g >= h.startLine && g <= h.endLine);
        return w ? `${w.name}.wgsl:${g - w.startLine + 1}` : `line ${g}`;
      },
      n = a.join(`
`),
      f = r.createShaderModule({ label: o, code: n }),
      m = (await f.getCompilationInfo()).messages.filter(
        (g) => g.type === "error",
      );
    if (m.length > 0)
      throw new Error(`Shader "${o}" compilation failed:
${m.map((g) => `  ${u(g.lineNum)}: ${g.message}`).join(`
`)}`);
    let p = e === "main" ? { module: f } : { module: f, entryPoint: e },
      c = r.createComputePipeline({ label: o, layout: "auto", compute: p });
    return ((c._shaderModule = f), c);
  }
  function cr(r, t, e) {
    let o = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(t / 64), o)
      : { x: Math.min(Math.ceil(e / 8), o), y: Math.min(Math.ceil(t / 8), o) };
  }
  function U(r, t, e, o = "x") {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    if (t > a)
      throw new Error(
        `${e}: this problem needs ${t} workgroups in ${o}, but the device allows ${a} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return t;
  }
  function Zr(r, t, e, o) {
    return o === void 0
      ? U(r, Math.ceil(e / 64), t)
      : {
          x: U(r, Math.ceil(o / 8), t, "x"),
          y: U(r, Math.ceil(e / 8), t, "y"),
        };
  }
  function q(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function T(r, t, e) {
    for (let [o, a] of Object.entries(e))
      if (!(!(a instanceof N) && !(a instanceof X)) && a.device !== r)
        throw new Error(
          `${t}: ${o} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function qo(r, t, e, o, a) {
    let i = o instanceof N;
    if (
      (q(r),
      T(r, "sscal", { x: o }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof Float32Array) && !(o instanceof N))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return i ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await D(r, "sscal"),
      u = null,
      n = null,
      f = null;
    try {
      ((u = i ? o._buf : x(r, o, "sscal-x", !0)),
        (n = I(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: a, type: "u32" },
          ],
          "sscal-params",
        )));
      let l = E(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: p } = j(r, s, l, cr(r, t));
      ((f = i ? null : G(r, m, u)), M(r, m));
      let c = await P(p);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let g = await S(f, Float32Array);
      return ((f = null), c !== void 0 ? { x: g, gpuTimeMs: c } : { x: g });
    } finally {
      (!i && u && d(u), n && d(n), f && d(f));
    }
  }
  async function To(r, t, e, o, a) {
    let i = o instanceof N;
    if (
      (q(r),
      T(r, "cscal", { x: o }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof Wr)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof _r) && !i)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (i && o.dtype !== _r)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (t <= 0) return i ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await D(r, "cscal"),
      u = null,
      n = null,
      f = null;
    try {
      ((u = i ? o._buf : x(r, te(o), "cscal-x", !0)),
        (n = I(
          r,
          [
            { value: t, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: a, type: "u32" },
          ],
          "cscal-params",
        )));
      let l = E(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: p } = j(r, s, l, cr(r, t));
      ((f = i ? null : G(r, m, u)), M(r, m));
      let c = await P(p);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let g = await S(f, Float32Array);
      f = null;
      let w = new _r(g);
      return c !== void 0 ? { x: w, gpuTimeMs: c } : { x: w };
    } finally {
      (!i && u && d(u), n && d(n), f && d(f));
    }
  }
  async function Co(r, t, e, o, a) {
    let i = o instanceof N;
    if ((q(r), !Number.isInteger(t) || !Number.isInteger(a)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (i && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (a <= 0) throw new Error("incx must be positive.");
    if ((T(r, "dscal", { x: o }), t <= 0)) return i ? {} : { x: o };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let u = await D(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: f } = rr(new Float64Array([e])),
      l = null,
      m = null,
      p = null,
      c = null,
      g = null;
    try {
      if (i) ((l = o._buf), (m = o._loBuf));
      else {
        let { hi: k, lo: B } = rr(o);
        ((l = x(r, k, "dscal-xHi", !0)), (m = x(r, B, "dscal-xLo", !0)));
      }
      p = I(
        r,
        [
          { value: t, type: "u32" },
          { value: n[0], type: "f32" },
          { value: f[0], type: "f32" },
          { value: a, type: "u32" },
        ],
        "dscal-params",
      );
      let w = E(r, u.getBindGroupLayout(0), [l, m, p]),
        { commandEncoder: h, ts: b } = j(r, u, w, cr(r, t));
      ((c = i ? null : G(r, h, l)), (g = i ? null : G(r, h, m)), M(r, h));
      let y = await P(b);
      if (i) return y !== void 0 ? { gpuTimeMs: y } : {};
      let v = await S(c, Float32Array);
      c = null;
      let _ = await S(g, Float32Array);
      g = null;
      let A = dr(v, _);
      return y !== void 0 ? { x: A, gpuTimeMs: y } : { x: A };
    } finally {
      (!i && l && d(l), !i && m && d(m), p && d(p), c && d(c), g && d(g));
    }
  }
  async function Fo(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "sswap", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof N))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(a instanceof Float32Array) && !(a instanceof N))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (e.constructor !== a.constructor)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return s ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await D(r, "sswap"),
      f = null,
      l = null,
      m = null,
      p = null,
      c = null;
    try {
      ((f = s ? e._buf : x(r, e, "sswap-x", !0)),
        (l = u ? a._buf : x(r, a, "sswap-y", !0)),
        (m = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sswap-params",
        )));
      let g = E(r, n.getBindGroupLayout(0), [f, l, m]),
        { commandEncoder: w, ts: h } = j(r, n, g, cr(r, t));
      ((p = s ? null : G(r, w, f)), (c = u ? null : G(r, w, l)), M(r, w));
      let b = await P(h);
      if (s) return b !== void 0 ? { gpuTimeMs: b } : {};
      let y = await S(p, Float32Array);
      p = null;
      let v = await S(c, Float32Array);
      return (
        (c = null),
        b !== void 0 ? { x: y, y: v, gpuTimeMs: b } : { x: y, y: v }
      );
    } finally {
      (!s && f && d(f), !u && l && d(l), m && d(m), p && d(p), c && d(c));
    }
  }
  async function jo(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "dswap", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(a instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return s ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await D(r, "dswap"),
      f = null,
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null,
      h = null,
      b = null;
    try {
      if (s) ((f = e._buf), (l = e._loBuf), (m = a._buf), (p = a._loBuf));
      else {
        let W = rr(e),
          V = rr(a);
        ((f = x(r, W.hi, "dswap-xHi", !0)),
          (l = x(r, W.lo, "dswap-xLo", !0)),
          (m = x(r, V.hi, "dswap-yHi", !0)),
          (p = x(r, V.lo, "dswap-yLo", !0)));
      }
      c = I(
        r,
        [
          { value: t, type: "u32" },
          { value: o, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dswap-params",
      );
      let y = E(r, n.getBindGroupLayout(0), [f, l, m, p, c]),
        { commandEncoder: v, ts: _ } = j(r, n, y, cr(r, t));
      ((g = s ? null : G(r, v, f)),
        (w = s ? null : G(r, v, l)),
        (h = u ? null : G(r, v, m)),
        (b = u ? null : G(r, v, p)),
        M(r, v));
      let A = await P(_);
      if (s) return A !== void 0 ? { gpuTimeMs: A } : {};
      let k = await S(g, Float32Array);
      g = null;
      let B = await S(w, Float32Array);
      w = null;
      let L = await S(h, Float32Array);
      h = null;
      let C = await S(b, Float32Array);
      b = null;
      let R = dr(k, B),
        F = dr(L, C);
      return A !== void 0 ? { x: R, y: F, gpuTimeMs: A } : { x: R, y: F };
    } finally {
      (!s && f && d(f),
        !s && l && d(l),
        !u && m && d(m),
        !u && p && d(p),
        c && d(c),
        g && d(g),
        w && d(w),
        h && d(h),
        b && d(b));
    }
  }
  async function Wo(r, t, e, o, a, i, s) {
    let u = o instanceof N,
      n = i instanceof N;
    if (
      (q(r),
      T(r, "saxpy", { x: o, y: i }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (a <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { y: i };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let f = await D(r, "saxpy"),
      l = null,
      m = null,
      p = null,
      c = null;
    try {
      ((l = u ? o._buf : x(r, o, "saxpy-x", !1)),
        (m = n ? i._buf : x(r, i, "saxpy-y", !0)),
        (p = I(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: a, type: "u32" },
            { value: s, type: "u32" },
          ],
          "saxpy-params",
        )));
      let g = E(r, f.getBindGroupLayout(0), [l, m, p]),
        { commandEncoder: w, ts: h } = j(r, f, g, cr(r, t));
      ((c = n ? null : G(r, w, m)), M(r, w));
      let b = await P(h);
      if (n) return b !== void 0 ? { gpuTimeMs: b } : {};
      let y = await S(c, Float32Array);
      return ((c = null), b !== void 0 ? { y, gpuTimeMs: b } : { y });
    } finally {
      (!u && l && d(l), !n && m && d(m), p && d(p), c && d(c));
    }
  }
  async function Ho(r, t, e, o, a, i, s) {
    let u = o instanceof N,
      n = i instanceof N;
    if (
      (q(r),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(i instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && i.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (a <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if ((T(r, "daxpy", { x: o, y: i }), t <= 0)) return n ? {} : { y: i };
    if (o.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await D(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: m, lo: p } = rr(new Float64Array([e])),
      c = null,
      g = null,
      w = null,
      h = null,
      b = null,
      y = null,
      v = null;
    try {
      if (u) ((c = o._buf), (g = o._loBuf), (w = i._buf), (h = i._loBuf));
      else {
        let F = rr(o),
          W = rr(i);
        ((c = x(r, F.hi, "daxpy-xHi", !1)),
          (g = x(r, F.lo, "daxpy-xLo", !1)),
          (w = x(r, W.hi, "daxpy-yHi", !0)),
          (h = x(r, W.lo, "daxpy-yLo", !0)));
      }
      b = I(
        r,
        [
          { value: t, type: "u32" },
          { value: m[0], type: "f32" },
          { value: p[0], type: "f32" },
          { value: a, type: "u32" },
          { value: s, type: "u32" },
        ],
        "daxpy-params",
      );
      let _ = E(r, l.getBindGroupLayout(0), [c, g, w, h, b]),
        { commandEncoder: A, ts: k } = j(r, l, _, cr(r, t));
      ((y = n ? null : G(r, A, w)), (v = n ? null : G(r, A, h)), M(r, A));
      let B = await P(k);
      if (n) return B !== void 0 ? { gpuTimeMs: B } : {};
      let L = await S(y, Float32Array);
      y = null;
      let C = await S(v, Float32Array);
      v = null;
      let R = dr(L, C);
      return B !== void 0 ? { y: R, gpuTimeMs: B } : { y: R };
    } finally {
      (!u && c && d(c),
        !u && g && d(g),
        !n && w && d(w),
        !n && h && d(h),
        b && d(b),
        y && d(y),
        v && d(v));
    }
  }
  async function Oo(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "scopy", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return u ? {} : { y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await D(r, "scopy"),
      f = null,
      l = null,
      m = null,
      p = null;
    try {
      ((f = s ? e._buf : x(r, e, "scopy-x", !1)),
        (l = u ? a._buf : x(r, a, "scopy-y", !0)),
        (m = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "scopy-params",
        )));
      let c = E(r, n.getBindGroupLayout(0), [f, l, m]),
        { commandEncoder: g, ts: w } = j(r, n, c, cr(r, t));
      ((p = u ? null : G(r, g, l)), M(r, g));
      let h = await P(w);
      if (u) return h !== void 0 ? { gpuTimeMs: h } : {};
      let b = await S(p, Float32Array);
      return ((p = null), h !== void 0 ? { y: b, gpuTimeMs: h } : { y: b });
    } finally {
      (!s && f && d(f), !u && l && d(l), m && d(m), p && d(p));
    }
  }
  async function Vo(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "dcopy", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(a instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return u ? {} : { y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await D(r, "dcopy"),
      f = null,
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null;
    try {
      if (s) ((f = e._buf), (l = e._loBuf), (m = a._buf), (p = a._loBuf));
      else {
        let B = rr(e),
          L = rr(a);
        ((f = x(r, B.hi, "dcopy-xHi", !1)),
          (l = x(r, B.lo, "dcopy-xLo", !1)),
          (m = x(r, L.hi, "dcopy-yHi", !0)),
          (p = x(r, L.lo, "dcopy-yLo", !0)));
      }
      c = I(
        r,
        [
          { value: t, type: "u32" },
          { value: o, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dcopy-params",
      );
      let h = E(r, n.getBindGroupLayout(0), [f, l, m, p, c]),
        { commandEncoder: b, ts: y } = j(r, n, h, cr(r, t));
      ((g = u ? null : G(r, b, m)), (w = u ? null : G(r, b, p)), M(r, b));
      let v = await P(y);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = await S(g, Float32Array);
      g = null;
      let A = await S(w, Float32Array);
      w = null;
      let k = dr(_, A);
      return v !== void 0 ? { y: k, gpuTimeMs: v } : { y: k };
    } finally {
      (!s && f && d(f),
        !s && l && d(l),
        !u && m && d(m),
        !u && p && d(p),
        c && d(c),
        g && d(g),
        w && d(w));
    }
  }
  async function Ko(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "sdot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await D(r, "sdot"),
      f = await D(r, "reduction/sum"),
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null;
    try {
      ((l = s ? e._buf : x(r, e, "sdot-x", !1)),
        (m = u ? a._buf : x(r, a, "sdot-y", !1)),
        (p = tr(r, 512, "sdot-partials")),
        (c = Br(r, 4, "sdot-result")),
        (g = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sdot-params",
        )));
      let h = E(r, n.getBindGroupLayout(0), [l, m, p, g]),
        { commandEncoder: b, ts: y } = j(r, n, h, 128);
      M(r, b);
      let v = E(r, f.getBindGroupLayout(0), [p, c]),
        { commandEncoder: _, ts: A } = j(r, f, v, 1);
      ((w = G(r, _, c)), M(r, _));
      let k = S(w, Float32Array);
      w = null;
      let [B, L, C] = await Promise.all([P(y), P(A), k]);
      return B !== void 0 && L !== void 0
        ? { dot: C[0], gpuTimeMs: B + L }
        : { dot: C[0] };
    } finally {
      (!s && l && d(l),
        !u && m && d(m),
        p && d(p),
        c && d(c),
        g && d(g),
        w && d(w));
    }
  }
  async function zo(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "sasum", { x: e }),
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
    let i = await D(r, "sasum"),
      s = await D(r, "reduction/sum"),
      u = null,
      n = null,
      f = null,
      l = null,
      m = null;
    try {
      ((u = a ? e._buf : x(r, e, "sasum-x", !1)),
        (n = tr(r, 512, "sasum-partials")),
        (f = Br(r, 4, "sasum-result")),
        (l = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "sasum-params",
        )));
      let p = E(r, i.getBindGroupLayout(0), [u, n, l]),
        { commandEncoder: c, ts: g } = j(r, i, p, 128);
      M(r, c);
      let w = E(r, s.getBindGroupLayout(0), [n, f]),
        { commandEncoder: h, ts: b } = j(r, s, w, 1);
      ((m = G(r, h, f)), M(r, h));
      let y = S(m, Float32Array);
      m = null;
      let [v, _, A] = await Promise.all([P(g), P(b), y]);
      return v !== void 0 && _ !== void 0
        ? { asum: A[0], gpuTimeMs: v + _ }
        : { asum: A[0] };
    } finally {
      (!a && u && d(u), n && d(n), f && d(f), l && d(l), m && d(m));
    }
  }
  async function Uo(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "dasum", { x: e }),
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
    let i = ["f64/dekker", "f64/utils/abs", "f64/utils/add"],
      s = await D(r, [...i, "dasum"]),
      u = await D(r, [...i, "reduction/sumF64"]),
      n = null,
      f = null,
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null,
      h = null;
    try {
      if (a) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: z, lo: H } = rr(e.map(Math.abs));
        ((n = x(r, z, "dasum-xHi", !1)), (f = x(r, H, "dasum-xLo", !1)));
      }
      ((l = tr(r, 512, "dasum-partialsHi")),
        (m = tr(r, 512, "dasum-partialsLo")),
        (p = Br(r, 4, "dasum-result-hi")),
        (c = Br(r, 4, "dasum-result-lo")),
        (g = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "dasum-params",
        )));
      let b = E(r, s.getBindGroupLayout(0), [n, f, l, m, g]),
        { commandEncoder: y, ts: v } = j(r, s, b, 128);
      M(r, y);
      let _ = E(r, u.getBindGroupLayout(0), [l, m, p, c]),
        { commandEncoder: A, ts: k } = j(r, u, _, 1);
      ((w = G(r, A, p)), (h = G(r, A, c)), M(r, A));
      let B = S(w, Float32Array),
        L = S(h, Float32Array);
      ((w = null), (h = null));
      let [C, R, F, W] = await Promise.all([P(v), P(k), B, L]),
        V = dr(F, W)[0];
      return C !== void 0 && R !== void 0
        ? { asum: V, gpuTimeMs: C + R }
        : { asum: V };
    } finally {
      (!a && n && d(n),
        !a && f && d(f),
        l && d(l),
        m && d(m),
        p && d(p),
        c && d(c),
        g && d(g),
        w && d(w),
        h && d(h));
    }
  }
  async function Yo(r, t, e, o, a, i) {
    let s = e instanceof N,
      u = a instanceof N;
    if (
      (q(r),
      T(r, "ddot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!u && !(a instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = ["f64/dekker", "f64/utils/add"],
      f = await D(r, [...n, "f64/utils/multiply", "ddot"]),
      l = await D(r, [...n, "reduction/sumF64"]),
      m = null,
      p = null,
      c = null,
      g = null,
      w = null,
      h = null,
      b = null,
      y = null,
      v = null,
      _ = null,
      A = null;
    try {
      if (s) ((m = e._buf), (p = e._loBuf), (c = a._buf), (g = a._loBuf));
      else {
        let ir = rr(e),
          lr = rr(a);
        ((m = x(r, ir.hi, "ddot-xHi", !1)),
          (p = x(r, ir.lo, "ddot-xLo", !1)),
          (c = x(r, lr.hi, "ddot-yHi", !1)),
          (g = x(r, lr.lo, "ddot-yLo", !1)));
      }
      ((w = tr(r, 512, "ddot-partialsHi")),
        (h = tr(r, 512, "ddot-partialsLo")),
        (b = Br(r, 4, "ddot-result-hi")),
        (y = Br(r, 4, "ddot-result-lo")),
        (v = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "ddot-params",
        )));
      let k = E(r, f.getBindGroupLayout(0), [m, p, c, g, w, h, v]),
        { commandEncoder: B, ts: L } = j(r, f, k, 128);
      M(r, B);
      let C = E(r, l.getBindGroupLayout(0), [w, h, b, y]),
        { commandEncoder: R, ts: F } = j(r, l, C, 1);
      ((_ = G(r, R, b)), (A = G(r, R, y)), M(r, R));
      let W = S(_, Float32Array),
        V = S(A, Float32Array);
      ((_ = null), (A = null));
      let [z, H, $, K] = await Promise.all([P(L), P(F), W, V]),
        Y = dr($, K)[0];
      return z !== void 0 && H !== void 0
        ? { dot: Y, gpuTimeMs: z + H }
        : { dot: Y };
    } finally {
      (!s && m && d(m),
        !s && p && d(p),
        !u && c && d(c),
        !u && g && d(g),
        w && d(w),
        h && d(h),
        b && d(b),
        y && d(y),
        v && d(v),
        _ && d(_),
        A && d(A));
    }
  }
  async function Xo(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "snrm2", { x: e }),
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
    let i = await D(r, "snrm2"),
      s = await D(r, "reduction/scaledSum"),
      u = null,
      n = null,
      f = null,
      l = null,
      m = null,
      p = null;
    try {
      ((u = a ? e._buf : x(r, e, "snrm2-x", !1)),
        (n = tr(r, 512, "snrm2-partials-scale")),
        (f = tr(r, 512, "snrm2-partials-ssq")),
        (l = Br(r, 4, "snrm2-result")),
        (m = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "snrm2-params",
        )));
      let c = E(r, i.getBindGroupLayout(0), [u, n, f, m]),
        { commandEncoder: g, ts: w } = j(r, i, c, 128);
      M(r, g);
      let h = E(r, s.getBindGroupLayout(0), [n, f, l]),
        { commandEncoder: b, ts: y } = j(r, s, h, 1);
      ((p = G(r, b, l)), M(r, b));
      let v = S(p, Float32Array);
      p = null;
      let [_, A, k] = await Promise.all([P(w), P(y), v]),
        B = k[0];
      return _ !== void 0 && A !== void 0
        ? { nrm2: B, gpuTimeMs: _ + A }
        : { nrm2: B };
    } finally {
      (!a && u && d(u), n && d(n), f && d(f), l && d(l), m && d(m), p && d(p));
    }
  }
  async function $o(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "dnrm2", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!a && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (a && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { nrm2: 0 };
    if (e.length < (t - 1) * o + 1)
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
      s = await D(r, [...i, "dnrm2"]),
      u = await D(r, [...i, "reduction/scaledSumF64"]),
      n = null,
      f = null,
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null,
      h = null,
      b = null,
      y = null;
    try {
      if (a) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: $, lo: K } = rr(e);
        ((n = x(r, $, "dnrm2-xHi", !1)), (f = x(r, K, "dnrm2-xLo", !1)));
      }
      ((l = tr(r, 512, "dnrm2-partials-scaleHi")),
        (m = tr(r, 512, "dnrm2-partials-scaleLo")),
        (p = tr(r, 512, "dnrm2-partials-ssqHi")),
        (c = tr(r, 512, "dnrm2-partials-ssqLo")),
        (g = Br(r, 4, "dnrm2-result-hi")),
        (w = Br(r, 4, "dnrm2-result-lo")),
        (h = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let v = E(r, s.getBindGroupLayout(0), [n, f, l, m, p, c, h]),
        { commandEncoder: _, ts: A } = j(r, s, v, 128);
      M(r, _);
      let k = E(r, u.getBindGroupLayout(0), [l, m, p, c, g, w]),
        { commandEncoder: B, ts: L } = j(r, u, k, 1);
      ((b = G(r, B, g)), (y = G(r, B, w)), M(r, B));
      let C = S(b, Float32Array),
        R = S(y, Float32Array);
      ((b = null), (y = null));
      let [F, W, V, z] = await Promise.all([P(A), P(L), C, R]),
        H = dr(V, z)[0];
      return F !== void 0 && W !== void 0
        ? { nrm2: H, gpuTimeMs: F + W }
        : { nrm2: H };
    } finally {
      (!a && n && d(n),
        !a && f && d(f),
        l && d(l),
        m && d(m),
        p && d(p),
        c && d(c),
        g && d(g),
        w && d(w),
        h && d(h),
        b && d(b),
        y && d(y));
    }
  }
  async function Zo(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "isamax", { x: e }),
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
    let i = await D(r, "isamax"),
      s = await D(r, "reduction/argmax"),
      u = null,
      n = null,
      f = null,
      l = null,
      m = null,
      p = null;
    try {
      ((u = a ? e._buf : x(r, e, "isamax-x", !1)),
        (n = tr(r, 512, "isamax-partials-val")),
        (f = tr(r, 512, "isamax-partials-idx")),
        (l = Br(r, 4, "isamax-result")),
        (m = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "isamax-params",
        )));
      let c = E(r, i.getBindGroupLayout(0), [u, n, f, m]),
        { commandEncoder: g, ts: w } = j(r, i, c, 128);
      M(r, g);
      let h = E(r, s.getBindGroupLayout(0), [n, f, l]),
        { commandEncoder: b, ts: y } = j(r, s, h, 1);
      ((p = G(r, b, l)), M(r, b));
      let v = S(p, Uint32Array);
      p = null;
      let [_, A, k] = await Promise.all([P(w), P(y), v]),
        B = k[0];
      return _ !== void 0 && A !== void 0
        ? { index: B, gpuTimeMs: _ + A }
        : { index: B };
    } finally {
      (!a && u && d(u), n && d(n), f && d(f), l && d(l), m && d(m), p && d(p));
    }
  }
  async function Qo(r, t, e, o) {
    let a = e instanceof N;
    if (
      (q(r),
      T(r, "idamax", { x: e }),
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
    let i = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/equal",
      ],
      s = await D(r, [...i, "idamax"], "idamax_main"),
      u = await D(r, [...i, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      f = null,
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null;
    try {
      if (a) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: F, lo: W } = rr(e);
        ((n = x(r, F, "idamax-xHi", !1)), (f = x(r, W, "idamax-xLo", !1)));
      }
      ((l = tr(r, 512, "idamax-partials-val-hi")),
        (m = tr(r, 512, "idamax-partials-val-lo")),
        (p = tr(r, 512, "idamax-partials-idx")),
        (c = Br(r, 4, "idamax-result")),
        (g = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
          ],
          "idamax-params",
        )));
      let h = E(r, s.getBindGroupLayout(0), [n, f, l, m, p, g]),
        { commandEncoder: b, ts: y } = j(r, s, h, 128);
      M(r, b);
      let v = E(r, u.getBindGroupLayout(0), [l, m, p, c]),
        { commandEncoder: _, ts: A } = j(r, u, v, 1);
      ((w = G(r, _, c)), M(r, _));
      let k = S(w, Uint32Array);
      w = null;
      let [B, L, C] = await Promise.all([P(y), P(A), k]),
        R = C[0];
      return B !== void 0 && L !== void 0
        ? { index: R, gpuTimeMs: B + L }
        : { index: R };
    } finally {
      (!a && n && d(n),
        !a && f && d(f),
        l && d(l),
        m && d(m),
        p && d(p),
        c && d(c),
        g && d(g),
        w && d(w));
    }
  }
  async function Jo(r, t, e, o, a, i, s, u) {
    let n = e instanceof N,
      f = a instanceof N;
    if (
      (q(r),
      T(r, "srot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!n && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!f && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (n !== f)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await D(r, "srot"),
      m = null,
      p = null,
      c = null,
      g = null,
      w = null;
    try {
      ((m = n ? e._buf : x(r, e, "srot-x", !0)),
        (p = f ? a._buf : x(r, a, "srot-y", !0)),
        (c = I(
          r,
          [
            { value: t, type: "u32" },
            { value: s, type: "f32" },
            { value: u, type: "f32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srot-params",
        )));
      let h = E(r, l.getBindGroupLayout(0), [m, p, c]),
        { commandEncoder: b, ts: y } = j(r, l, h, cr(r, t));
      ((g = n ? null : G(r, b, m)), (w = f ? null : G(r, b, p)), M(r, b));
      let v = await P(y);
      if (n) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = S(g, Float32Array),
        A = S(w, Float32Array);
      ((g = null), (w = null));
      let [k, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: k, y: B, gpuTimeMs: v } : { x: k, y: B };
    } finally {
      (!n && m && d(m), !f && p && d(p), c && d(c), g && d(g), w && d(w));
    }
  }
  async function ra(r, t, e, o, a, i, s, u) {
    let n = e instanceof N,
      f = a instanceof N;
    if (
      (q(r),
      T(r, "drot", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !n)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(a instanceof Float64Array) && !f)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (n && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (f && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (n !== f)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let m = await D(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drot",
      ]),
      { hi: p, lo: c } = rr(new Float64Array([s])),
      { hi: g, lo: w } = rr(new Float64Array([u])),
      h = null,
      b = null,
      y = null,
      v = null,
      _ = null,
      A = null,
      k = null,
      B = null,
      L = null;
    try {
      if (n) ((h = e._buf), (b = e._loBuf), (y = a._buf), (v = a._loBuf));
      else {
        let ir = rr(e),
          lr = rr(a);
        ((h = x(r, ir.hi, "drot-xHi", !0)),
          (b = x(r, ir.lo, "drot-xLo", !0)),
          (y = x(r, lr.hi, "drot-yHi", !0)),
          (v = x(r, lr.lo, "drot-yLo", !0)));
      }
      _ = I(
        r,
        [
          { value: t, type: "u32" },
          { value: p[0], type: "f32" },
          { value: c[0], type: "f32" },
          { value: g[0], type: "f32" },
          { value: w[0], type: "f32" },
          { value: o, type: "u32" },
          { value: i, type: "u32" },
        ],
        "drot-params",
      );
      let C = E(r, m.getBindGroupLayout(0), [h, b, y, v, _]),
        { commandEncoder: R, ts: F } = j(r, m, C, cr(r, t));
      ((A = n ? null : G(r, R, h)),
        (k = n ? null : G(r, R, b)),
        (B = f ? null : G(r, R, y)),
        (L = f ? null : G(r, R, v)),
        M(r, R));
      let W = await P(F);
      if (n) return W !== void 0 ? { gpuTimeMs: W } : {};
      let V = await S(A, Float32Array);
      A = null;
      let z = await S(k, Float32Array);
      k = null;
      let H = await S(B, Float32Array);
      B = null;
      let $ = await S(L, Float32Array);
      L = null;
      let K = dr(V, z),
        Y = dr(H, $);
      return W !== void 0 ? { x: K, y: Y, gpuTimeMs: W } : { x: K, y: Y };
    } finally {
      (!n && h && d(h),
        !n && b && d(b),
        !f && y && d(y),
        !f && v && d(v),
        _ && d(_),
        A && d(A),
        k && d(k),
        B && d(B),
        L && d(L));
    }
  }
  async function ea(r, t, e, o, a, i, s) {
    let u = e instanceof N,
      n = a instanceof N;
    if (
      (q(r),
      T(r, "srotm", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float32Array) || s.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(a instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0 || s[0] === -2) return u ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let f = await D(r, "srotm"),
      l = null,
      m = null,
      p = null,
      c = null,
      g = null,
      w = null;
    try {
      ((l = u ? e._buf : x(r, e, "srotm-x", !0)),
        (m = n ? a._buf : x(r, a, "srotm-y", !0)),
        (p = x(r, s, "srotm-param", !1)),
        (c = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srotm-params",
        )));
      let h = E(r, f.getBindGroupLayout(0), [l, m, p, c]),
        { commandEncoder: b, ts: y } = j(r, f, h, cr(r, t));
      ((g = u ? null : G(r, b, l)), (w = n ? null : G(r, b, m)), M(r, b));
      let v = await P(y);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = S(g, Float32Array),
        A = S(w, Float32Array);
      ((g = null), (w = null));
      let [k, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: k, y: B, gpuTimeMs: v } : { x: k, y: B };
    } finally {
      (!u && l && d(l),
        !n && m && d(m),
        p && d(p),
        c && d(c),
        g && d(g),
        w && d(w));
    }
  }
  async function ta(r, t, e, o, a, i, s) {
    let u = e instanceof N,
      n = a instanceof N;
    if (
      (q(r),
      T(r, "drotm", { x: e, y: a }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float64Array) || s.length !== 5)
      throw new Error("param must be a Float64Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (o <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(a instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && a.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0 || s[0] === -2) return u ? {} : { x: e, y: a };
    if (e.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await D(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drotm",
      ]),
      { hi: m, lo: p } = rr(s),
      c = null,
      g = null,
      w = null,
      h = null,
      b = null,
      y = null,
      v = null,
      _ = null,
      A = null,
      k = null,
      B = null;
    try {
      if (u) ((c = e._buf), (g = e._loBuf), (w = a._buf), (h = a._loBuf));
      else {
        let Y = rr(e),
          ir = rr(a);
        ((c = x(r, Y.hi, "drotm-xHi", !0)),
          (g = x(r, Y.lo, "drotm-xLo", !0)),
          (w = x(r, ir.hi, "drotm-yHi", !0)),
          (h = x(r, ir.lo, "drotm-yLo", !0)));
      }
      ((b = x(r, m, "drotm-paramHi", !1)),
        (y = x(r, p, "drotm-paramLo", !1)),
        (v = I(
          r,
          [
            { value: t, type: "u32" },
            { value: o, type: "u32" },
            { value: i, type: "u32" },
          ],
          "drotm-params",
        )));
      let L = E(r, l.getBindGroupLayout(0), [c, g, w, h, b, y, v]),
        { commandEncoder: C, ts: R } = j(r, l, L, cr(r, t));
      ((_ = u ? null : G(r, C, c)),
        (A = u ? null : G(r, C, g)),
        (k = n ? null : G(r, C, w)),
        (B = n ? null : G(r, C, h)),
        M(r, C));
      let F = await P(R);
      if (u) return F !== void 0 ? { gpuTimeMs: F } : {};
      let W = await S(_, Float32Array);
      _ = null;
      let V = await S(A, Float32Array);
      A = null;
      let z = await S(k, Float32Array);
      k = null;
      let H = await S(B, Float32Array);
      B = null;
      let $ = dr(W, V),
        K = dr(z, H);
      return F !== void 0 ? { x: $, y: K, gpuTimeMs: F } : { x: $, y: K };
    } finally {
      (!u && c && d(c),
        !u && g && d(g),
        !n && w && d(w),
        !n && h && d(h),
        b && d(b),
        y && d(y),
        v && d(v),
        _ && d(_),
        A && d(A),
        k && d(k),
        B && d(B));
    }
  }
  async function oa(r, t, e, o, a, i, s, u, n, f, l, m, p = "row-major") {
    let c = i instanceof X,
      g = u instanceof N,
      w = l instanceof N;
    if (
      (q(r),
      T(r, "sgemv", { A: i, x: u, y: l }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof f != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(f)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(f)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      !Number.isInteger(m) ||
      !Number.isInteger(s)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (g !== w)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (g && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !g)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (g && u._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && w && i._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < o))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || o < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || o === 0) return w ? {} : { y: l };
    (c ? i.layout : p) === "column-major" &&
      (([e, o] = [o, e]),
      (t = t === "no-transpose" ? "transpose" : "no-transpose"));
    let b = t === "no-transpose",
      y = b ? o : e,
      v = b ? e : o;
    if (s < o) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + o)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (y - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (v - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let A = await D(r, b ? "sgemv_n" : "sgemv_t"),
      k = null,
      B = null,
      L = null,
      C = null;
    try {
      ((k = c ? i._buf : x(r, i, "sgemv-A", !1)),
        (B = g ? u._buf : x(r, u, "sgemv-x", !1)),
        (L = w ? l._buf : x(r, l, "sgemv-y", !0)),
        (C = I(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "u32" },
            { value: a, type: "f32" },
            { value: f, type: "f32" },
            { value: n, type: "u32" },
            { value: m, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sgemv-params",
        )));
      let R = E(r, A.getBindGroupLayout(0), [k, B, L, C]),
        F = b
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Zr(r, "sgemv", v),
        { commandEncoder: W, ts: V } = j(r, A, R, F),
        z = w ? null : G(r, W, L);
      M(r, W);
      let H = await P(V);
      if (w) return H !== void 0 ? { gpuTimeMs: H } : {};
      let $ = await S(z, Float32Array);
      return H !== void 0 ? { y: $, gpuTimeMs: H } : { y: $ };
    } finally {
      (!c && k && d(k), !g && B && d(B), !w && L && d(L), C && d(C));
    }
  }
  async function aa(r, t, e, o, a, i, s, u, n, f, l, m = "row-major") {
    let p = s instanceof N,
      c = f instanceof N,
      g = a instanceof X;
    if (
      (q(r),
      T(r, "ssymv", { A: a, x: s, y: f }),
      t !== "lower" && t !== "upper")
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
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (u <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (i < e) throw new Error("lda must be >= n.");
    if (!g && !(a instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (p && !g)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (g && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && s._buf === f._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (g && i !== a.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (g && (a.rows < e || a.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { y: f };
    if (!g && a.length < (e - 1) * i + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (f.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h =
        (g ? a.layout : m) === "column-major" ? t === "upper" : t === "lower",
      b = await D(r, "ssymv"),
      y = null,
      v = null,
      _ = null,
      A = null;
    try {
      ((y = g ? a._buf : x(r, a, "ssymv-A", !1)),
        (v = p ? s._buf : x(r, s, "ssymv-x", !1)),
        (_ = c ? f._buf : x(r, f, "ssymv-y", !0)),
        (A = I(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: n, type: "f32" },
            { value: u, type: "u32" },
            { value: l, type: "u32" },
            { value: i, type: "u32" },
            { value: h ? 0 : 1, type: "u32" },
          ],
          "ssymv-params",
        )));
      let k = E(r, b.getBindGroupLayout(0), [y, v, _, A]),
        B = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: L, ts: C } = j(r, b, k, B),
        R = c ? null : G(r, L, _);
      M(r, L);
      let F = await P(C);
      if (c) return F !== void 0 ? { gpuTimeMs: F } : {};
      let W = await S(R, Float32Array);
      return F !== void 0 ? { y: W, gpuTimeMs: F } : { y: W };
    } finally {
      (!g && y && d(y), !p && v && d(v), !c && _ && d(_), A && d(A));
    }
  }
  async function ia(r, t, e, o, a, i, s, u, n, f, l, m = "row-major") {
    let p = u instanceof N,
      c = f instanceof N,
      g = i instanceof X,
      w = o === "unit";
    if (
      (q(r),
      T(r, "strmv", { A: i, x: u, y: f }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < a) throw new Error("lda must be >= n.");
    if (!g && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (p && u._buf === f._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && !g)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (g && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (g && c && i._buf === f._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (g && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (g && (i.rows < a || i.cols < a))
      throw new Error("A is too small for the given n.");
    if (a < 0) throw new Error("n must be non-negative.");
    if (a === 0) return c ? {} : { y: f };
    if (!g && i.length < (a - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (a - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (f.length < (a - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let b = (g ? i.layout : m) === "column-major",
      y = b ? t === "upper" : t === "lower",
      v = b ? e === "transpose" : e === "no-transpose",
      _ = await D(r, "strmv"),
      A = null,
      k = null,
      B = null,
      L = null;
    try {
      ((A = g ? i._buf : x(r, i, "strmv-A", !1)),
        (k = p ? u._buf : x(r, u, "strmv-x", !1)),
        (B = c ? f._buf : x(r, f, "strmv-y", !0)),
        (L = I(
          r,
          [
            { value: a, type: "u32" },
            { value: n, type: "u32" },
            { value: l, type: "u32" },
            { value: s, type: "u32" },
            { value: v ? 0 : 1, type: "u32" },
            { value: y ? 0 : 1, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strmv-params",
        )));
      let C = E(r, _.getBindGroupLayout(0), [A, k, B, L]),
        R = Math.min(a, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: F, ts: W } = j(r, _, C, R),
        V = c ? null : G(r, F, B);
      M(r, F);
      let z = await P(W);
      if (c) return z !== void 0 ? { gpuTimeMs: z } : {};
      let H = await S(V, Float32Array);
      return z !== void 0 ? { y: H, gpuTimeMs: z } : { y: H };
    } finally {
      (!g && A && d(A), !p && k && d(k), !c && B && d(B), L && d(L));
    }
  }
  function sa(r, t, e) {
    let o = new ArrayBuffer(r * t),
      a = new DataView(o);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        u = i * t;
      s.forEach((n, f) => a.setUint32(u + f * 4, n, !0));
    }
    return o;
  }
  function na(r, t, e) {
    let o = r.createBuffer({
      label: e,
      size: t.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(o, 0, t), o);
  }
  async function la(r, t, e, o, a, i, s, u, n, f = "row-major") {
    let l = u instanceof N,
      m = i instanceof X,
      p = o === "unit";
    if ((q(r), T(r, "strsv", { A: i, x: u }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!p && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (f !== "row-major" && f !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(a) || !Number.isInteger(n) || !Number.isInteger(s))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (s < a) throw new Error("lda must be >= n.");
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
    if (m && (i.rows < a || i.cols < a))
      throw new Error("A is too small for the given n.");
    if (a < 0) throw new Error("n must be non-negative.");
    if (a === 0) return l ? {} : { x: u };
    if (!m && i.length < (a - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (a - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let g = (m ? i.layout : f) === "column-major",
      w = g ? t === "upper" : t === "lower",
      h = g ? e === "transpose" : e === "no-transpose",
      b = await D(r, "strsv_invert_block"),
      y = await D(r, "strsv_apply_inverse"),
      v = await D(r, "strsv_update"),
      _ = h === w,
      A = [];
    for (let H = 0; H < a; H += 64) A.push(H);
    _ || A.reverse();
    let k = A.length,
      B = r.limits.maxComputeWorkgroupsPerDimension,
      L = r.limits.minUniformBufferOffsetAlignment,
      C = null,
      R = null,
      F = null,
      W = null,
      V = null,
      z = null;
    try {
      ((C = m ? i._buf : x(r, i, "strsv-A", !1)),
        (R = l ? u._buf : x(r, u, "strsv-x", !0)),
        (F = tr(r, k * 64 * 64 * 4, "strsv-Ainv")));
      let H = sa(k, L, (er) => {
        let Z = er * 64,
          J = Math.min(Z + 64, a);
        return [n, er, Z, J];
      });
      W = na(r, H, "strsv-apply-params");
      let $ = sa(k, L, (er) => {
        let Z = er * 64,
          J = Math.min(Z + 64, a);
        return [a, n, s, h ? 0 : 1, w ? 0 : 1, Z, J];
      });
      V = na(r, $, "strsv-update-params");
      let { commandEncoder: K, querySet: Y } = qr(r);
      z = I(
        r,
        [
          { value: a, type: "u32" },
          { value: s, type: "u32" },
          { value: h ? 0 : 1, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
          { value: p ? 1 : 0, type: "u32" },
        ],
        "strsv-invert-params",
      );
      let ir = E(r, b.getBindGroupLayout(0), [C, F, z]);
      gr(
        K,
        b,
        ir,
        { x: 64, y: k },
        Y
          ? { timestampWrites: { querySet: Y, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let er = 0; er < A.length; er++) {
        let Z = A[er],
          J = Math.min(Z + 64, a),
          sr = Z / 64,
          pr = er === A.length - 1,
          br = sr * L,
          fr = E(r, y.getBindGroupLayout(0), [
            F,
            R,
            { buffer: W, offset: br, size: 16 },
          ]);
        gr(
          K,
          y,
          fr,
          1,
          pr && Y
            ? { timestampWrites: { querySet: Y, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let yr = _ ? a - J : Z;
        if (yr === 0) continue;
        let Cr = E(r, v.getBindGroupLayout(0), [
            C,
            R,
            { buffer: V, offset: br, size: 32 },
          ]),
          Rr = Math.min(yr, B);
        gr(K, v, Cr, Rr);
      }
      let hr = Lr(r, K, Y),
        nr = l ? null : G(r, K, R);
      M(r, K);
      let mr = await P(hr);
      if (l) return mr !== void 0 ? { gpuTimeMs: mr } : {};
      let Q = await S(nr, Float32Array);
      return mr !== void 0 ? { x: Q, gpuTimeMs: mr } : { x: Q };
    } finally {
      (!m && C && d(C),
        !l && R && d(R),
        F && d(F),
        W && d(W),
        V && d(V),
        z && d(z));
    }
  }
  async function ua(r, t, e, o, a, i, s, u, n, f, l = "row-major") {
    let m = n instanceof X;
    if (
      (q(r),
      T(r, "sger", { A: n, x: a, y: s }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (m && f !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < t || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : l) === "column-major" &&
      (([t, e] = [e, t]), ([a, s] = [s, a]), ([i, u] = [u, i]));
    let c = a instanceof N,
      g = s instanceof N;
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !m)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (m && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (m && c && n._buf === a._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && g && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (t < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (t === 0 || e === 0) return m ? {} : { A: n };
    if (!m && n.length < (t - 1) * f + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (a.length < (t - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let w = await D(r, "sger"),
      h = null,
      b = null,
      y = null,
      v = null;
    try {
      ((h = c ? a._buf : x(r, a, "sger-x", !1)),
        (b = g ? s._buf : x(r, s, "sger-y", !1)),
        (y = m ? n._buf : x(r, n, "sger-A", !0)),
        (v = I(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: f, type: "u32" },
          ],
          "sger-params",
        )));
      let _ = E(r, w.getBindGroupLayout(0), [h, b, y, v]),
        A = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: k, ts: B } = j(r, w, _, A),
        L = m ? null : G(r, k, y);
      M(r, k);
      let C = await P(B);
      if (m) return C !== void 0 ? { gpuTimeMs: C } : {};
      let R = await S(L, Float32Array);
      return C !== void 0 ? { A: R, gpuTimeMs: C } : { A: R };
    } finally {
      (!c && h && d(h), !g && b && d(b), !m && y && d(y), v && d(v));
    }
  }
  async function fa(r, t, e, o, a, i, s, u, n = "row-major") {
    let f = a instanceof N,
      l = s instanceof X;
    if ((q(r), T(r, "ssyr", { A: s, x: a }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(i) || !Number.isInteger(u))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (i <= 0) throw new Error("incx must be positive.");
    if (u < e) throw new Error("lda must be >= n.");
    if (!l && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!f && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (f && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !f)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && f && s._buf === a._buf)
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
    if (a.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p =
        (l ? s.layout : n) === "column-major" ? t === "upper" : t === "lower",
      c = await D(r, "ssyr"),
      g = null,
      w = null,
      h = null;
    try {
      ((g = f ? a._buf : x(r, a, "ssyr-x", !1)),
        (w = l ? s._buf : x(r, s, "ssyr-A", !0)),
        (h = I(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: p ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let b = E(r, c.getBindGroupLayout(0), [g, w, h]),
        y = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: _ } = j(r, c, b, y),
        A = l ? null : G(r, v, w);
      M(r, v);
      let k = await P(_);
      if (l) return k !== void 0 ? { gpuTimeMs: k } : {};
      let B = await S(A, Float32Array);
      return k !== void 0 ? { A: B, gpuTimeMs: k } : { A: B };
    } finally {
      (!f && g && d(g), !l && w && d(w), h && d(h));
    }
  }
  async function ma(r, t, e, o, a, i, s, u, n, f, l = "row-major") {
    let m = a instanceof N,
      p = s instanceof N,
      c = n instanceof X;
    if (
      (q(r),
      T(r, "ssyr2", { A: n, x: a, y: s }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!m && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (m !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (m && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !m)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && m && n._buf === a._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && p && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && a._buf === s._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && f !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { A: n };
    if (!c && n.length < (e - 1) * f + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (a.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let w =
        (c ? n.layout : l) === "column-major" ? t === "upper" : t === "lower",
      h = await D(r, "ssyr2"),
      b = null,
      y = null,
      v = null,
      _ = null;
    try {
      ((b = m ? a._buf : x(r, a, "ssyr2-x", !1)),
        (y = p ? s._buf : x(r, s, "ssyr2-y", !1)),
        (v = c ? n._buf : x(r, n, "ssyr2-A", !0)),
        (_ = I(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: f, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let A = E(r, h.getBindGroupLayout(0), [b, y, v, _]),
        k = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: B, ts: L } = j(r, h, A, k),
        C = c ? null : G(r, B, v);
      M(r, B);
      let R = await P(L);
      if (c) return R !== void 0 ? { gpuTimeMs: R } : {};
      let F = await S(C, Float32Array);
      return R !== void 0 ? { A: F, gpuTimeMs: R } : { A: F };
    } finally {
      (!m && b && d(b), !p && y && d(y), !c && v && d(v), _ && d(_));
    }
  }
  async function da(r, t, e, o, a, i, s, u, n, f, l, m, p, c, g = "row-major") {
    let w = u instanceof X,
      h = f instanceof X,
      b = p instanceof X;
    if (
      (q(r),
      T(r, "sgemm", { A: u, B: f, C: p }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof m != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(m)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(i) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(f instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(p instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((w || h) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!w || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || l <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0 || a === 0) return b ? {} : { C: p };
    let y = w ? u.layout : g,
      v = h ? f.layout : g,
      _ = b ? p.layout : g,
      A = y === "column-major" ? i : o,
      k = y === "column-major" ? o : i,
      B = t === "no-transpose" ? A : k,
      L = t === "no-transpose" ? k : A;
    if (n < L)
      throw new Error(
        `lda must be >= ${y === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (n !== u.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [J, sr] = t === "no-transpose" ? [o, i] : [i, o];
      if (u.rows < J || u.cols < sr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (u.length < (B - 1) * n + L)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let C = v === "column-major" ? a : i,
      R = v === "column-major" ? i : a,
      F = e === "no-transpose" ? C : R,
      W = e === "no-transpose" ? R : C;
    if (l < W)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (l !== f.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [J, sr] = e === "no-transpose" ? [i, a] : [a, i];
      if (f.rows < J || f.cols < sr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (f.length < (F - 1) * l + W)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let V = _ === "column-major" ? a : o,
      z = _ === "column-major" ? o : a;
    if (c < z)
      throw new Error(
        `ldc must be >= ${_ === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (c !== p.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (p.rows < o || p.cols < a)
        throw new Error("C is too small for the given m and n.");
    } else if (p.length < (V - 1) * c + z)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (y === "column-major" &&
      (t = t === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (([u, f] = [f, u]),
        ([w, h] = [h, w]),
        ([n, l] = [l, n]),
        ([t, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          t === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([o, a] = [a, o])));
    let H = Math.ceil(a / 64),
      $ = Math.ceil(o / 64),
      K = H * $ >= 36,
      Y = await D(r, K ? "sgemm_large" : "sgemm_small"),
      ir = w ? u._buf : x(r, u, "sgemm-A", !1),
      lr = h ? f._buf : x(r, f, "sgemm-B", !1),
      hr = b ? p._buf : x(r, p, "sgemm-C", !0),
      nr = t === "no-transpose",
      mr = e === "no-transpose",
      Q = nr && Ee(ir, n, o, i),
      er = Ee(lr, l, mr ? i : a, mr ? a : i),
      Z = I(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "f32" },
          { value: m, type: "f32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: c, type: "u32" },
          { value: t === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: Q ? 1 : 0, type: "u32" },
          { value: er ? 1 : 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let J = E(r, Y.getBindGroupLayout(0), [
          ir,
          Sr(r, ir),
          lr,
          Sr(r, lr),
          hr,
          Z,
        ]),
        sr = K
          ? { x: U(r, H, "sgemm", "x"), y: U(r, $, "sgemm", "y") }
          : {
              x: U(r, Math.ceil(a / 32), "sgemm", "x"),
              y: U(r, Math.ceil(o / 32), "sgemm", "y"),
            },
        { commandEncoder: pr, ts: br } = j(r, Y, J, sr),
        fr = b ? null : G(r, pr, hr);
      M(r, pr);
      let ur = await P(br);
      if (b) return ur !== void 0 ? { gpuTimeMs: ur } : {};
      let yr = await S(fr, Float32Array);
      return ur !== void 0 ? { C: yr, gpuTimeMs: ur } : { C: yr };
    } finally {
      (w || d(ir), h || d(lr), b || d(hr), d(Z));
    }
  }
  async function ca(
    r,
    t,
    e,
    o,
    a,
    i,
    s,
    u,
    n,
    f,
    l,
    m,
    p,
    c,
    g,
    w = "row-major",
  ) {
    let h = n instanceof X,
      b = l instanceof X,
      y = c instanceof X;
    if (
      (q(r),
      T(r, "sgemmtr", { A: n, B: l, C: c }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (typeof p != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(p)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(p)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(m) ||
      !Number.isInteger(g)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!h && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!y && !(c instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((h || b) && !y)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (y && (!h || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (f <= 0 || m <= 0 || g <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || i === 0) return y ? {} : { C: c };
    let v = h ? n.layout : w,
      _ = b ? l.layout : w,
      A = y ? c.layout : w,
      k = v === "column-major" ? s : a,
      B = v === "column-major" ? a : s,
      L = e === "no-transpose" ? k : B,
      C = e === "no-transpose" ? B : k;
    if (f < C)
      throw new Error(
        `lda must be >= ${v === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (h) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [Q, er] = e === "no-transpose" ? [a, s] : [s, a];
      if (n.rows < Q || n.cols < er)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (L - 1) * f + C)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let R = _ === "column-major" ? i : s,
      F = _ === "column-major" ? s : i,
      W = o === "no-transpose" ? R : F,
      V = o === "no-transpose" ? F : R;
    if (m < V)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [Q, er] = o === "no-transpose" ? [s, i] : [i, s];
      if (l.rows < Q || l.cols < er)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (W - 1) * m + V)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let z = A === "column-major" ? i : a,
      H = A === "column-major" ? a : i;
    if (g < H)
      throw new Error(
        `ldc must be >= ${A === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (y) {
      if (g !== c.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (c.rows < a || c.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (c.length < (z - 1) * g + H)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (v === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      A === "column-major" &&
        (([n, l] = [l, n]),
        ([h, b] = [b, h]),
        ([f, m] = [m, f]),
        ([e, o] = [
          o === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, i] = [i, a]),
        (t = t === "lower" ? "upper" : "lower")));
    let $ = Math.ceil(i / 64),
      K = Math.ceil(a / 64),
      Y = $ * K >= 36,
      ir = await D(r, Y ? "sgemmtr_large" : "sgemmtr_small"),
      lr = h ? n._buf : x(r, n, "sgemmtr-A", !1),
      hr = b ? l._buf : x(r, l, "sgemmtr-B", !1),
      nr = y ? c._buf : x(r, c, "sgemmtr-C", !0),
      mr = I(
        r,
        [
          { value: a, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: u, type: "f32" },
          { value: p, type: "f32" },
          { value: f, type: "u32" },
          { value: m, type: "u32" },
          { value: g, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: t === "upper" ? 1 : 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let Q = E(r, ir.getBindGroupLayout(0), [lr, hr, nr, mr]),
        er = Y
          ? { x: U(r, $, "sgemmtr", "x"), y: U(r, K, "sgemmtr", "y") }
          : {
              x: U(r, Math.ceil(i / 32), "sgemmtr", "x"),
              y: U(r, Math.ceil(a / 32), "sgemmtr", "y"),
            },
        { commandEncoder: Z, ts: J } = j(r, ir, Q, er),
        sr = y ? null : G(r, Z, nr);
      M(r, Z);
      let pr = await P(J);
      if (y) return pr !== void 0 ? { gpuTimeMs: pr } : {};
      let br = await S(sr, Float32Array);
      return pr !== void 0 ? { C: br, gpuTimeMs: pr } : { C: br };
    } finally {
      (h || d(lr), b || d(hr), y || d(nr), d(mr));
    }
  }
  async function pa(r, t, e, o, a, i, s, u, n, f, l, m = "row-major") {
    let p = s instanceof X,
      c = f instanceof X;
    if ((q(r), T(r, "ssyrk", { A: s, C: f }), t !== "lower" && t !== "upper"))
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
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (p && !c)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (c && !p)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || l <= 0) throw new Error("lda and ldc must be positive.");
    if (o === 0) return c ? {} : { C: f };
    let g = p ? s.layout : m,
      w = c ? f.layout : m,
      h = g === "column-major" ? a : o,
      b = g === "column-major" ? o : a,
      y = e === "no-transpose" ? h : b,
      v = e === "no-transpose" ? b : h;
    if (u < v)
      throw new Error(
        `lda must be >= ${g === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (p) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [H, $] = e === "no-transpose" ? [o, a] : [a, o];
      if (s.rows < H || s.cols < $)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (y - 1) * u + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (l < o) throw new Error("ldc must be >= n.");
    if (c) {
      if (l !== f.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (f.rows < o || f.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (f.length < (o - 1) * l + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let _ = e;
    g === "column-major" &&
      (_ = _ === "no-transpose" ? "transpose" : "no-transpose");
    let A = _ === "no-transpose" ? "transpose" : "no-transpose",
      k = t;
    w === "column-major" &&
      (([_, A] = [
        A === "no-transpose" ? "transpose" : "no-transpose",
        _ === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (k = k === "lower" ? "upper" : "lower"));
    let B = Math.ceil(o / 64),
      L = Math.ceil(o / 64),
      C = B * L >= 36,
      R = await D(r, C ? "sgemmtr_large" : "sgemmtr_small"),
      F = p ? s._buf : x(r, s, "ssyrk-A", !1),
      W = c ? f._buf : x(r, f, "ssyrk-C", !0),
      V = p
        ? tr(r, F.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : x(r, s, "ssyrk-B", !1),
      z = I(
        r,
        [
          { value: o, type: "u32" },
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "f32" },
          { value: n, type: "f32" },
          { value: u, type: "u32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: _ === "transpose" ? 1 : 0, type: "u32" },
          { value: A === "transpose" ? 1 : 0, type: "u32" },
          { value: k === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let H = E(r, R.getBindGroupLayout(0), [F, V, W, z]),
        $ = C
          ? { x: U(r, B, "ssyrk", "x"), y: U(r, L, "ssyrk", "y") }
          : {
              x: U(r, Math.ceil(o / 32), "ssyrk", "x"),
              y: U(r, Math.ceil(o / 32), "ssyrk", "y"),
            },
        { commandEncoder: K, querySet: Y, passDescriptor: ir } = qr(r);
      (p && K.copyBufferToBuffer(F, 0, V, 0, F.size), gr(K, R, H, $, ir));
      let lr = Lr(r, K, Y),
        hr = c ? null : G(r, K, W);
      M(r, K);
      let nr = await P(lr);
      if (c) return nr !== void 0 ? { gpuTimeMs: nr } : {};
      let mr = await S(hr, Float32Array);
      return nr !== void 0 ? { C: mr, gpuTimeMs: nr } : { C: mr };
    } finally {
      (p || d(F), d(V), c || d(W), d(z));
    }
  }
  async function ga(r, t, e, o, a, i, s, u, n, f, l, m, p, c = "row-major") {
    let g = s instanceof X,
      w = n instanceof X,
      h = m instanceof X;
    if (
      (q(r),
      T(r, "ssyr2k", { A: s, B: n, C: m }),
      t !== "lower" && t !== "upper")
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
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f) ||
      !Number.isInteger(p)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || w) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !w))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || f <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0) return h ? {} : { C: m };
    let b = g ? s.layout : c,
      y = w ? n.layout : c,
      v = h ? m.layout : c,
      _ = b === "column-major" ? a : o,
      A = b === "column-major" ? o : a,
      k = e === "no-transpose" ? _ : A,
      B = e === "no-transpose" ? A : _;
    if (u < B)
      throw new Error(
        `lda must be >= ${b === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [J, sr] = e === "no-transpose" ? [o, a] : [a, o];
      if (s.rows < J || s.cols < sr)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (k - 1) * u + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let L = y === "column-major" ? a : o,
      C = y === "column-major" ? o : a,
      R = e === "no-transpose" ? L : C,
      F = e === "no-transpose" ? C : L;
    if (f < F)
      throw new Error(
        `ldb must be >= ${y === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [J, sr] = e === "no-transpose" ? [o, a] : [a, o];
      if (n.rows < J || n.cols < sr)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (R - 1) * f + F)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (p < o) throw new Error("ldc must be >= n.");
    if (h) {
      if (p !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (m.length < (o - 1) * p + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let W = e;
    b === "column-major" &&
      (W = W === "no-transpose" ? "transpose" : "no-transpose");
    let V = e;
    y === "column-major" &&
      (V = V === "no-transpose" ? "transpose" : "no-transpose");
    let z = v === "column-major" ? (t === "lower" ? "upper" : "lower") : t,
      H = (J) => (J === "no-transpose" ? "transpose" : "no-transpose");
    function $(J, sr, pr, br, fr, ur) {
      let yr = J,
        Cr = H(br);
      return v !== "column-major"
        ? { transX: yr, X: sr, ldX: pr, transY: Cr, Y: fr, ldY: ur }
        : { transX: H(Cr), X: fr, ldX: ur, transY: H(yr), Y: sr, ldY: pr };
    }
    let K = Math.ceil(o / 64),
      Y = Math.ceil(o / 64),
      ir = K * Y >= 36,
      lr = await D(r, ir ? "sgemmtr_large" : "sgemmtr_small"),
      hr = ir
        ? { x: U(r, K, "ssyr2k", "x"), y: U(r, Y, "ssyr2k", "y") }
        : {
            x: U(r, Math.ceil(o / 32), "ssyr2k", "x"),
            y: U(r, Math.ceil(o / 32), "ssyr2k", "y"),
          },
      nr = g ? s._buf : x(r, s, "ssyr2k-A", !1),
      mr = w ? n._buf : x(r, n, "ssyr2k-B", !1),
      Q = h ? m._buf : x(r, m, "ssyr2k-C", !0),
      er = null,
      Z = null;
    try {
      let J = $(W, nr, u, V, mr, f),
        sr = $(V, mr, f, W, nr, u),
        pr = (Ir, Ar) =>
          I(
            r,
            [
              { value: o, type: "u32" },
              { value: o, type: "u32" },
              { value: a, type: "u32" },
              { value: i, type: "f32" },
              { value: Ar, type: "f32" },
              { value: Ir.ldX, type: "u32" },
              { value: Ir.ldY, type: "u32" },
              { value: p, type: "u32" },
              { value: Ir.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: Ir.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: z === "upper" ? 1 : 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((er = pr(J, l)), (Z = pr(sr, 1)));
      let br = E(r, lr.getBindGroupLayout(0), [J.X, J.Y, Q, er]),
        fr = E(r, lr.getBindGroupLayout(0), [sr.X, sr.Y, Q, Z]),
        { commandEncoder: ur, querySet: yr } = qr(r),
        Cr = yr
          ? { timestampWrites: { querySet: yr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Rr = yr
          ? { timestampWrites: { querySet: yr, endOfPassWriteIndex: 1 } }
          : void 0;
      (gr(ur, lr, br, hr, Cr), gr(ur, lr, fr, hr, Rr));
      let Tr = Lr(r, ur, yr),
        Er = h ? null : G(r, ur, Q);
      M(r, ur);
      let vr = await P(Tr);
      if (h) return vr !== void 0 ? { gpuTimeMs: vr } : {};
      let xr = await S(Er, Float32Array);
      return vr !== void 0 ? { C: xr, gpuTimeMs: vr } : { C: xr };
    } finally {
      (g || d(nr), w || d(mr), h || d(Q), er && d(er), Z && d(Z));
    }
  }
  async function wa(r, t, e, o, a, i, s, u, n, f, l, m, p, c = "row-major") {
    let g = s instanceof X,
      w = n instanceof X,
      h = m instanceof X;
    if (
      (q(r), T(r, "ssymm", { A: s, B: n, C: m }), t !== "left" && t !== "right")
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
      !Number.isInteger(o) ||
      !Number.isInteger(a) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f) ||
      !Number.isInteger(p)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || w) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !w))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || a === 0) return h ? {} : { C: m };
    let b = g ? s.layout : c,
      y = w ? n.layout : c,
      v = h ? m.layout : c,
      _ = t === "left" ? o : a;
    if (u < _)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (g) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (s.rows < _ || s.cols < _)
        throw new Error("A is too small for the given m/n and side.");
    } else if (s.length < (_ - 1) * u + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = y === "column-major" ? a : o,
      k = y === "column-major" ? o : a;
    if (f < k)
      throw new Error(
        `ldb must be >= ${y === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < o || n.cols < a)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (A - 1) * f + k)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = v === "column-major" ? a : o,
      L = v === "column-major" ? o : a;
    if (p < L)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (p !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < a)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (B - 1) * p + L)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let C = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      R = y === "column-major" ? "transpose" : "no-transpose",
      F = "no-transpose",
      W = o,
      V = a,
      z = _,
      H = t === "left" ? F : R,
      $ = t === "left" ? R : F,
      K = (ur) => (ur === "no-transpose" ? "transpose" : "no-transpose"),
      Y = t === "right";
    v === "column-major" &&
      (([H, $] = [K($), K(H)]), (Y = !Y), ([W, V] = [V, W]));
    let ir = _,
      lr = Math.ceil(V / 64),
      hr = Math.ceil(W / 64),
      nr = lr * hr >= 36,
      mr = await D(r, nr ? "sgemm_large" : "sgemm_small"),
      Q = await D(r, "symmetrize"),
      er = nr
        ? { x: U(r, lr, "ssymm", "x"), y: U(r, hr, "ssymm", "y") }
        : {
            x: U(r, Math.ceil(V / 32), "ssymm", "x"),
            y: U(r, Math.ceil(W / 32), "ssymm", "y"),
          },
      Z = g ? s._buf : x(r, s, "ssymm-A", !1),
      J = w ? n._buf : x(r, n, "ssymm-B", !1),
      sr = h ? m._buf : x(r, m, "ssymm-C", !0),
      pr = tr(r, _ * ir * 4, "ssymm-Adense"),
      br = null,
      fr = null;
    try {
      br = I(
        r,
        [
          { value: _, type: "u32" },
          { value: u, type: "u32" },
          { value: ir, type: "u32" },
          { value: C === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let ur = E(r, Q.getBindGroupLayout(0), [Z, pr, br]),
        yr = Y ? J : pr,
        Cr = Y ? f : ir,
        Rr = Y ? pr : J;
      fr = I(
        r,
        [
          { value: W, type: "u32" },
          { value: V, type: "u32" },
          { value: z, type: "u32" },
          { value: i, type: "f32" },
          { value: l, type: "f32" },
          { value: Cr, type: "u32" },
          { value: Y ? ir : f, type: "u32" },
          { value: p, type: "u32" },
          { value: H === "transpose" ? 1 : 0, type: "u32" },
          { value: $ === "transpose" ? 1 : 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let Er = E(r, mr.getBindGroupLayout(0), [
          yr,
          Sr(r, yr),
          Rr,
          Sr(r, Rr),
          sr,
          fr,
        ]),
        { commandEncoder: vr, querySet: xr } = qr(r),
        Ir = xr
          ? { timestampWrites: { querySet: xr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Ar = xr
          ? { timestampWrites: { querySet: xr, endOfPassWriteIndex: 1 } }
          : void 0;
      (gr(vr, Q, ur, { x: Math.ceil(_ / 8), y: Math.ceil(_ / 8) }, Ir),
        gr(vr, mr, Er, er, Ar));
      let Fr = Lr(r, vr, xr),
        Or = h ? null : G(r, vr, sr);
      M(r, vr);
      let Ur = await P(Fr);
      if (h) return Ur !== void 0 ? { gpuTimeMs: Ur } : {};
      let me = await S(Or, Float32Array);
      return Ur !== void 0 ? { C: me, gpuTimeMs: Ur } : { C: me };
    } finally {
      (g || d(Z), w || d(J), h || d(sr), d(pr), br && d(br), fr && d(fr));
    }
  }
  async function ha(r, t, e, o, a, i, s, u, n, f, l, m, p = "row-major") {
    let c = n instanceof X,
      g = l instanceof X,
      w = a === "unit";
    if ((q(r), T(r, "strmm", { A: n, B: l }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!w && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== g)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return g ? {} : { B: l };
    let h = c ? n.layout : p,
      b = g ? l.layout : p,
      y = t === "left" ? i : s;
    if (f < y)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < y || n.cols < y)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (y - 1) * f + y)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = b === "column-major" ? s : i,
      _ = b === "column-major" ? i : s;
    if (m < _)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * m + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      k =
        h === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      B = b === "column-major" ? "transpose" : "no-transpose",
      L = "no-transpose",
      C = i,
      R = s,
      F = y,
      W = t === "left" ? L : B,
      V = t === "left" ? B : L,
      z = (br) => (br === "no-transpose" ? "transpose" : "no-transpose"),
      H = t === "right";
    b === "column-major" &&
      (([W, V] = [z(V), z(W)]), (H = !H), ([C, R] = [R, C]));
    let $ = y,
      K = Math.ceil(R / 64),
      Y = Math.ceil(C / 64),
      ir = K * Y >= 36,
      lr = await D(r, ir ? "sgemm_large" : "sgemm_small"),
      hr = await D(r, "triangularize"),
      nr = ir
        ? { x: U(r, K, "strmm", "x"), y: U(r, Y, "strmm", "y") }
        : {
            x: U(r, Math.ceil(R / 32), "strmm", "x"),
            y: U(r, Math.ceil(C / 32), "strmm", "y"),
          },
      mr = null,
      Q = null,
      er = null,
      Z = null,
      J = null,
      sr = null,
      pr = !1;
    try {
      ((mr = c ? n._buf : x(r, n, "strmm-A", !1)),
        (Q = g ? l._buf : x(r, l, "strmm-B", !0)),
        (er = tr(r, y * $ * 4, "strmm-Adense")),
        (Z = tr(
          r,
          v * m * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (J = I(
          r,
          [
            { value: y, type: "u32" },
            { value: f, type: "u32" },
            { value: $, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: k === "transpose" ? 1 : 0, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let br = E(r, hr.getBindGroupLayout(0), [mr, er, J]),
        fr = H ? Q : er,
        ur = H ? m : $,
        yr = H ? er : Q;
      sr = I(
        r,
        [
          { value: C, type: "u32" },
          { value: R, type: "u32" },
          { value: F, type: "u32" },
          { value: u, type: "f32" },
          { value: 0, type: "f32" },
          { value: ur, type: "u32" },
          { value: H ? $ : m, type: "u32" },
          { value: m, type: "u32" },
          { value: W === "transpose" ? 1 : 0, type: "u32" },
          { value: V === "transpose" ? 1 : 0, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let Rr = E(r, lr.getBindGroupLayout(0), [
          fr,
          Sr(r, fr),
          yr,
          Sr(r, yr),
          Z,
          sr,
        ]),
        { commandEncoder: Tr, querySet: Er } = qr(r);
      Tr.copyBufferToBuffer(Q, 0, Z, 0, Math.min(Q.size, Z.size));
      let vr = Er
          ? { timestampWrites: { querySet: Er, beginningOfPassWriteIndex: 0 } }
          : void 0,
        xr = Er
          ? { timestampWrites: { querySet: Er, endOfPassWriteIndex: 1 } }
          : void 0;
      (gr(Tr, hr, br, { x: Math.ceil(y / 8), y: Math.ceil(y / 8) }, vr),
        gr(Tr, lr, Rr, nr, xr));
      let Ir = Lr(r, Tr, Er),
        Ar = g ? null : G(r, Tr, Z);
      M(r, Tr);
      let Fr = await P(Ir);
      if (g)
        return (
          d(l._buf),
          (l._buf = Z),
          (pr = !0),
          Fr !== void 0 ? { gpuTimeMs: Fr } : {}
        );
      let Or = await S(Ar, Float32Array);
      return Fr !== void 0 ? { B: Or, gpuTimeMs: Fr } : { B: Or };
    } finally {
      (!c && mr && d(mr),
        !g && Q && d(Q),
        er && d(er),
        Z && !pr && d(Z),
        J && d(J),
        sr && d(sr));
    }
  }
  async function ba(r, t, e, o, a, i, s, u, n, f, l, m, p = "row-major") {
    let c = n instanceof X,
      g = l instanceof X,
      w = a === "unit";
    if ((q(r), T(r, "strsm", { A: n, B: l }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!w && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== g)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return g ? {} : { B: l };
    let h = c ? n.layout : p,
      b = g ? l.layout : p,
      y = t === "left" ? i : s;
    if (f < y)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < y || n.cols < y)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (y - 1) * f + y)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = b === "column-major" ? s : i,
      _ = b === "column-major" ? i : s;
    if (m < _)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * m + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      k =
        h === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      B = t === "left" ? s : i,
      L = t === "left",
      C = (k === "no-transpose") == (A === "lower"),
      R = t === "left" ? C : !C,
      F = [];
    for (let Q = 0; Q < y; Q += 64) F.push(Q);
    R || F.reverse();
    let W = F.length,
      V = await D(r, "strsv_invert_block"),
      z = await D(r, "block_transfer"),
      H = await D(r, "sscal"),
      $ = null,
      K = null,
      Y = null,
      ir = [],
      lr = [];
    function hr(Q, er) {
      let Z = tr(r, Q, er);
      return (lr.push(Z), Z);
    }
    function nr(Q, er) {
      let Z = I(r, Q, er);
      return (ir.push(Z), Z);
    }
    let mr = (v - 1) * m + _;
    try {
      (($ = c ? n._buf : x(r, n, "strsm-A", !1)),
        (K = g ? l._buf : x(r, l, "strsm-B", !0)),
        (Y = tr(r, W * 64 * 64 * 4, "strsm-Ainv")));
      let Q = null;
      if (u !== 1 && u !== 0) {
        let Er = nr(
          [
            { value: mr, type: "u32" },
            { value: u, type: "f32" },
            { value: 1, type: "u32" },
          ],
          "strsm-scale-params",
        );
        Q = E(r, H.getBindGroupLayout(0), [K, Er]);
      }
      let er = nr(
          [
            { value: y, type: "u32" },
            { value: f, type: "u32" },
            { value: k === "transpose" ? 1 : 0, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strsm-invert-params",
        ),
        Z = E(r, V.getBindGroupLayout(0), [$, Y, er]),
        J = hr(64 * B * 4, "strsm-Bblock"),
        sr = hr(64 * B * 4, "strsm-Xblock"),
        pr = hr(y * 64 * 4, "strsm-Aoff"),
        br = hr(y * B * 4, "strsm-delta"),
        { commandEncoder: fr, querySet: ur } = qr(r);
      if (u === 0) {
        let Er = Math.ceil(_ / 64),
          vr = Math.ceil(v / 64),
          xr = Er * vr >= 36,
          Ir = await D(r, xr ? "sgemm_large" : "sgemm_small"),
          Ar = nr(
            [
              { value: v, type: "u32" },
              { value: _, type: "u32" },
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
          Fr = E(r, Ir.getBindGroupLayout(0), [
            Y,
            Sr(r, Y),
            Y,
            Sr(r, Y),
            K,
            Ar,
          ]),
          Or = xr
            ? { x: U(r, Er, "strsm", "x"), y: U(r, vr, "strsm", "y") }
            : {
                x: U(r, Math.ceil(_ / 32), "strsm", "x"),
                y: U(r, Math.ceil(v / 32), "strsm", "y"),
              };
        gr(
          fr,
          Ir,
          Fr,
          Or,
          ur
            ? {
                timestampWrites: {
                  querySet: ur,
                  beginningOfPassWriteIndex: 0,
                  endOfPassWriteIndex: 1,
                },
              }
            : void 0,
        );
      } else {
        (Q && gr(fr, H, Q, cr(r, mr)),
          gr(
            fr,
            V,
            Z,
            { x: 64, y: W },
            ur
              ? {
                  timestampWrites: {
                    querySet: ur,
                    beginningOfPassWriteIndex: 0,
                  },
                }
              : void 0,
          ));
        for (let vr = 0; vr < F.length; vr++) {
          let xr = F[vr],
            Ir = Math.min(xr + 64, y),
            Ar = Ir - xr,
            Fr = xr / 64,
            Or = vr === F.length - 1,
            Ur = nr(
              [
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: L ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-B-params",
            ),
            me = E(r, z.getBindGroupLayout(0), [J, K, Ur]);
          gr(fr, z, me, Zr(r, "strsm", Ar, B));
          {
            let Yr = Ar,
              Xr = B,
              _e = Ar,
              ae = Math.ceil(Xr / 64),
              ie = Math.ceil(Yr / 64),
              se = ae * ie >= 36,
              ne = await D(r, se ? "sgemm_large" : "sgemm_small"),
              Be = nr(
                [
                  { value: Yr, type: "u32" },
                  { value: Xr, type: "u32" },
                  { value: _e, type: "u32" },
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
              ce = { buffer: Y, offset: Fr * 64 * 64 * 4, size: 4096 * 4 },
              Ae = E(r, ne.getBindGroupLayout(0), [
                ce,
                Sr(r, ce),
                J,
                Sr(r, J),
                sr,
                Be,
              ]),
              Ea = se
                ? { x: U(r, ae, "strsm", "x"), y: U(r, ie, "strsm", "y") }
                : {
                    x: U(r, Math.ceil(Xr / 32), "strsm", "x"),
                    y: U(r, Math.ceil(Yr / 32), "strsm", "y"),
                  };
            gr(fr, ne, Ae, Ea);
          }
          let de = R ? Ir : 0,
            Le = R ? y : xr,
            Re = de < Le,
            ya = nr(
              [
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: L ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            ),
            xa = E(r, z.getBindGroupLayout(0), [sr, K, ya]),
            va =
              Or && !Re && ur
                ? { timestampWrites: { querySet: ur, endOfPassWriteIndex: 1 } }
                : void 0;
          if ((gr(fr, z, xa, Zr(r, "strsm", Ar, B), va), !Re)) continue;
          let oe = Le - de,
            _a = nr(
              [
                { value: de, type: "u32" },
                { value: oe, type: "u32" },
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: f, type: "u32" },
                { value: k === "transpose" ? 1 : 0, type: "u32" },
                { value: L ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-A-params",
            ),
            Ba = E(r, z.getBindGroupLayout(0), [pr, $, _a]);
          gr(fr, z, Ba, Zr(r, "strsm", oe, Ar));
          {
            let Yr = oe,
              Xr = B,
              _e = Ar,
              ae = Math.ceil(Xr / 64),
              ie = Math.ceil(Yr / 64),
              se = ae * ie >= 36,
              ne = await D(r, se ? "sgemm_large" : "sgemm_small"),
              Be = nr(
                [
                  { value: Yr, type: "u32" },
                  { value: Xr, type: "u32" },
                  { value: _e, type: "u32" },
                  { value: 1, type: "f32" },
                  { value: 0, type: "f32" },
                  { value: Ar, type: "u32" },
                  { value: B, type: "u32" },
                  { value: B, type: "u32" },
                  { value: 0, type: "u32" },
                  { value: 0, type: "u32" },
                ],
                "strsm-update-params",
              ),
              ce = E(r, ne.getBindGroupLayout(0), [
                pr,
                Sr(r, pr),
                sr,
                Sr(r, sr),
                br,
                Be,
              ]),
              Ae = se
                ? { x: U(r, ae, "strsm", "x"), y: U(r, ie, "strsm", "y") }
                : {
                    x: U(r, Math.ceil(Xr / 32), "strsm", "x"),
                    y: U(r, Math.ceil(Yr / 32), "strsm", "y"),
                  };
            gr(fr, ne, ce, Ae);
          }
          let Aa = nr(
              [
                { value: de, type: "u32" },
                { value: oe, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: L ? 1 : 0, type: "u32" },
                { value: 1, type: "u32" },
              ],
              "strsm-scatter-sub-params",
            ),
            Sa = E(r, z.getBindGroupLayout(0), [br, K, Aa]),
            Ga =
              Or && ur
                ? { timestampWrites: { querySet: ur, endOfPassWriteIndex: 1 } }
                : void 0;
          gr(fr, z, Sa, Zr(r, "strsm", oe, B), Ga);
        }
      }
      let yr = Lr(r, fr, ur),
        Cr = g ? null : G(r, fr, K);
      M(r, fr);
      let Rr = await P(yr);
      if (g) return Rr !== void 0 ? { gpuTimeMs: Rr } : {};
      let Tr = await S(Cr, Float32Array);
      return Rr !== void 0 ? { B: Tr, gpuTimeMs: Rr } : { B: Tr };
    } finally {
      (!c && $ && d($), !g && K && d(K), Y && d(Y), d(lr), d(ir));
    }
  }
  return Ia(Ti);
})();
