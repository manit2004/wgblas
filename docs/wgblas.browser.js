var wgblas = (() => {
  var Wa = Object.create;
  var pe = Object.defineProperty;
  var Va = Object.getOwnPropertyDescriptor;
  var Oa = Object.getOwnPropertyNames;
  var Ka = Object.getPrototypeOf,
    za = Object.prototype.hasOwnProperty;
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
  var U = (r, t, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (t = r((r = 0))), t);
    } catch (a) {
      throw ((e = [a]), a);
    }
  };
  var qe = (r, t) => {
      for (var e in t) pe(r, e, { get: t[e], enumerable: !0 });
    },
    Te = (r, t, e, a) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let o of Oa(t))
          !za.call(r, o) &&
            o !== e &&
            pe(r, o, {
              get: () => t[o],
              enumerable: !(a = Va(t, o)) || a.enumerable,
            });
      return r;
    };
  var we = (r, t, e) => (
      (e = r != null ? Wa(Ka(r)) : {}),
      Te(
        t || !r || !r.__esModule
          ? pe(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    Ua = (r) => Te(pe({}, "__esModule", { value: !0 }), r);
  var De,
    $e = U(() => {
      De = `// sscal: x = alpha * x

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
    Ze = U(() => {
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
    Je = U(() => {
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
    et = U(() => {
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
    ot = U(() => {
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
    it = U(() => {
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
    nt = U(() => {
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
    ut = U(() => {
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
  var ke,
    dt = U(() => {
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
  var ct,
    mt = U(() => {
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
    pt = U(() => {
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
    wt = U(() => {
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
    bt = U(() => {
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
    xt = U(() => {
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
  var Tr,
    _t = U(() => {
      Tr = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
    Bt = U(() => {
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
  var Hr,
    At = U(() => {
      Hr = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
    St = U(() => {
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
  var Le,
    Et = U(() => {
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
  var jr,
    Dt = U(() => {
      jr = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var Lt,
    kt = U(() => {
      Lt = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
  var Pt,
    Nt = U(() => {
      Pt = `// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
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
  var It,
    Mt = U(() => {
      It = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
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
  var Ne,
    Rt = U(() => {
      Ne = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
    qt = U(() => {
      Tt = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var Ht,
    Ft = U(() => {
      Ht = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
  var jt,
    Ct = U(() => {
      jt = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
  var Vt,
    Wt = U(() => {
      Vt = `// srot: x = c*x + s*y,  y = -s*x + c*y

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
    Ot = U(() => {
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
    zt = U(() => {
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
    Yt = U(() => {
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
    $t = U(() => {
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
    Qt = U(() => {
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
    ro = U(() => {
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
    to = U(() => {
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
    ao = U(() => {
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
    so = U(() => {
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
    lo = U(() => {
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
    fo = U(() => {
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
  var Pe,
    co = U(() => {
      Pe = `// strsv_invert_block: computes ONE column (workgroup_id.x) of ONE block's
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
    po = U(() => {
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
    wo = U(() => {
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
    bo = U(() => {
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
    xo = U(() => {
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
    _o = U(() => {
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
    Ao = U(() => {
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
    Go = U(() => {
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
  var ko,
    Do = U(() => {
      ko = `// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
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
  var No,
    Lo = U(() => {
      No = `// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
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
    Po = U(() => {
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
  var ue,
    Io = U(() => {
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
    Ro = U(() => {
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
    qo = U(() => {
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
    To = U(() => {
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
  var Ho,
    Fo = U(() => {
      Ho = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var jo,
    Co = U(() => {
      jo = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
  var Vo,
    Wo = U(() => {
      Vo = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var Oo = {};
  qe(Oo, { routineShaders: () => tr, shaderSources: () => Qi });
  var tr,
    Qi,
    Ko = U(() => {
      $e();
      Ze();
      Je();
      et();
      ot();
      it();
      nt();
      ut();
      dt();
      mt();
      pt();
      wt();
      bt();
      xt();
      _t();
      Bt();
      At();
      St();
      Et();
      Dt();
      kt();
      Nt();
      Mt();
      Rt();
      qt();
      Ft();
      Ct();
      Wt();
      Ot();
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
      Go();
      Do();
      Lo();
      Po();
      Io();
      Ro();
      qo();
      To();
      Fo();
      Co();
      Wo();
      tr = {};
      tr.sscal = { sscal: De };
      tr.cscal = { cscal: Qe };
      tr.sswap = { sswap: rt };
      tr.dswap = { dswap: tt };
      tr.saxpy = { saxpy: at };
      tr.scopy = { scopy: st };
      tr.dcopy = { dcopy: lt };
      tr.sdot = { sdot: ft, "reduction/sum": ke };
      tr.sasum = { sasum: ct, "reduction/sum": ke };
      tr.snrm2 = { snrm2: gt, "reduction/scaledSum": ht };
      tr.isamax = { isamax: yt, "reduction/argmax": vt };
      tr.dasum = {
        "f64/dekker": Tr,
        "f64/utils/abs": ye,
        "f64/utils/add": Hr,
        dasum: Gt,
        "reduction/sumF64": Le,
      };
      tr.ddot = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        ddot: Lt,
        "reduction/sumF64": Le,
      };
      tr.dscal = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        dscal: Pt,
      };
      tr.daxpy = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        daxpy: It,
      };
      tr.idamax = {
        "f64/dekker": Tr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Ne,
        "f64/utils/equal": Tt,
        idamax: Ht,
        "reduction/argmaxF64": jt,
      };
      tr.srot = { srot: Vt };
      tr.drot = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        drot: Kt,
      };
      tr.srotm = { srotm: Ut };
      tr.drotm = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        drotm: Xt,
      };
      tr.dnrm2 = {
        "f64/dekker": Tr,
        "f64/utils/abs": ye,
        "f64/utils/greater": Ne,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        "f64/utils/divide": Zt,
        "f64/utils/sqrt": Jt,
        dnrm2: eo,
        "reduction/scaledSumF64": oo,
      };
      tr.sgemv = { sgemv_n: io, sgemv_t: no };
      tr.ssymv = { ssymv: uo };
      tr.strmv = { strmv: mo };
      tr.strsv = {
        strsv_invert_block: Pe,
        strsv_apply_inverse: go,
        strsv_update: ho,
      };
      tr.sger = { sger: yo };
      tr.dger = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        dger: vo,
      };
      tr.ssyr = { ssyr: Bo };
      tr.dsyr = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        dsyr: So,
      };
      tr.ssyr2 = { ssyr2: Eo };
      tr.dsyr2 = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        dsyr2: ko,
      };
      tr.dgemv = {
        "f64/dekker": Tr,
        "f64/utils/add": Hr,
        "f64/utils/multiply": jr,
        dgemv_n: No,
        dgemv_t: Mo,
      };
      tr.sgemm = { sgemm_small: ue, sgemm_large: fe };
      tr.sgemmtr = { sgemmtr_small: xe, sgemmtr_large: ve };
      tr.ssyrk = { sgemmtr_small: xe, sgemmtr_large: ve };
      tr.ssyr2k = { sgemmtr_small: xe, sgemmtr_large: ve };
      tr.ssymm = { sgemm_small: ue, sgemm_large: fe, symmetrize: Ho };
      tr.strmm = { sgemm_small: ue, sgemm_large: fe, triangularize: jo };
      tr.strsm = {
        strsv_invert_block: Pe,
        block_transfer: Vo,
        sscal: De,
        sgemm_small: ue,
        sgemm_large: fe,
      };
      Qi = Object.assign({}, ...Object.values(tr));
    });
  var ts = {};
  qe(ts, {
    Complex32: () => Or,
    Complex32Array: () => _r,
    Complex64: () => Vr,
    Complex64Array: () => Gr,
    GpuMatrix: () => $,
    GpuVector: () => L,
    cleanup: () => Ve,
    cscal: () => Uo,
    dasum: () => oa,
    daxpy: () => Qo,
    dcopy: () => ra,
    ddot: () => aa,
    dgemv: () => Sa,
    dger: () => xa,
    dnrm2: () => sa,
    drot: () => fa,
    drotm: () => ma,
    dscal: () => Yo,
    dswap: () => $o,
    dsyr: () => _a,
    dsyr2: () => Aa,
    gpuName: () => Oe,
    idamax: () => la,
    init: () => We,
    isamax: () => na,
    randomFloat32Array: () => Ue,
    randomFloat64Array: () => Ye,
    randomTriangularFloat32Array: () => Xe,
    sasum: () => ta,
    saxpy: () => Zo,
    scopy: () => Jo,
    sdot: () => ea,
    sgemm: () => Ga,
    sgemmtr: () => Ea,
    sgemv: () => ca,
    sger: () => ya,
    snrm2: () => ia,
    srot: () => ua,
    srotm: () => da,
    sscal: () => zo,
    sswap: () => Xo,
    ssymm: () => La,
    ssymv: () => pa,
    ssyr: () => va,
    ssyr2: () => Ba,
    ssyr2k: () => ka,
    ssyrk: () => Da,
    strmm: () => Na,
    strmv: () => ga,
    strsm: () => Pa,
    strsv: () => ba,
  });
  function Fe(r, t) {
    return t
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function He(r) {
    if (!Ce(r)) return { querySet: null, passDescriptor: void 0 };
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
  function Ir(r, t, e) {
    if (!e) return null;
    let a = r.createBuffer({
      label: "timestamp-resolve",
      size: 16,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    t.resolveQuerySet(e, 0, 2, a, 0);
    let o = r.createBuffer({
      label: "timestamp-readback",
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (
      t.copyBufferToBuffer(a, 0, o, 0, 16),
      { tsReadBuffer: o, resolveBuffer: a, querySet: e }
    );
  }
  async function M(r) {
    if (!r) return;
    let { tsReadBuffer: t, resolveBuffer: e, querySet: a } = r;
    await t.mapAsync(GPUMapMode.READ);
    let o = new BigInt64Array(t.getMappedRange().slice());
    return (
      t.unmap(),
      t.destroy(),
      e.destroy(),
      a.destroy(),
      Math.max(0, Number(o[1] - o[0])) / 1e6
    );
  }
  var Qr = null,
    Se = !1,
    Jr = new Map(),
    le = new WeakMap(),
    Ur = null,
    je = ({ powerPreference: r, benchmark: t }) => `${r}::${t}`;
  async function We({
    powerPreference: r = "high-performance",
    benchmark: t = !1,
    dumpShaders: e = !1,
  } = {}) {
    let a = { powerPreference: r, benchmark: t, dumpShaders: e },
      o = je(a),
      i = Jr.get(o);
    if (i) return i;
    if (Qr)
      e !== Se &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Se}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: d, globals: g } = await import("webgpu");
      (Object.assign(globalThis, g),
        (Qr = d(
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
    let n = [...(Fe(s, t).requiredFeatures ?? [])],
      f = await s.requestDevice({ requiredFeatures: n });
    f.addEventListener("uncapturederror", (d) => {
      console.error("Uncaptured GPU error:", d.error.message);
    });
    let l = n.includes("timestamp-query");
    return (
      le.set(f, { adapter: s, benchmark: l, options: a }),
      Jr.set(o, f),
      Ur || (Ur = f),
      f
    );
  }
  function Ve(r) {
    if (r === void 0) {
      for (let e of Jr.values()) e.destroy();
      (Jr.clear(), (Ur = null));
      return;
    }
    let t = le.get(r);
    t &&
      (Jr.delete(je(t.options)),
      le.delete(r),
      r.destroy(),
      Ur === r && (Ur = Jr.values().next().value ?? null));
  }
  function Oe(r = Ur) {
    let t = r && le.get(r);
    if (!t)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: a } = t.adapter.info;
    return { description: a || "unknown", device: e || "unknown" };
  }
  function Ce(r = Ur) {
    return le.get(r)?.benchmark ?? !1;
  }
  function re() {
    if (!Ur)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return Ur;
  }
  function m(...r) {
    r.flat().forEach((t) => t.destroy());
  }
  function Ge(r, t, e) {
    let a = r.limits.maxStorageBufferBindingSize;
    if (t > a)
      throw new Error(
        `Buffer "${e}" needs ${t} bytes, exceeding this device's maxStorageBufferBindingSize (${a} bytes). The operands are too large for this device.`,
      );
  }
  function y(r, t, e = "blas-input", a = !1) {
    let o = t.byteLength;
    Ge(r, o, e);
    let i = a
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE,
      s = r.createBuffer({ label: e, size: o, usage: i, mappedAtCreation: !0 }),
      u = t.constructor;
    return (new u(s.getMappedRange()).set(t), s.unmap(), s);
  }
  function nr(r, t, e = "blas-storage", a = 0) {
    return (
      Ge(r, t, e),
      r.createBuffer({ label: e, size: t, usage: GPUBufferUsage.STORAGE | a })
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
  function E(r, t, e) {
    let a = r.createBuffer({
      label: "blas-readback",
      size: e.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (t.copyBufferToBuffer(e, 0, a, 0, e.size), a);
  }
  var ee = 16,
    Ke = new WeakMap();
  function Ya(r) {
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
      a = t instanceof GPUBuffer ? 0 : (t.offset ?? 0),
      o = t instanceof GPUBuffer ? t.size : (t.size ?? e.size - a),
      i = Math.floor(o / ee) * ee;
    return i < ee
      ? { buffer: Ya(r), offset: 0, size: ee }
      : { buffer: e, offset: a, size: i };
  }
  function Ee(r, t, e, a) {
    if (t % 4 !== 0) return !1;
    let o = r instanceof GPUBuffer ? r : r.buffer,
      i = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      s = r instanceof GPUBuffer ? o.size : (r.size ?? o.size - i),
      u = Math.floor(s / ee) * 4;
    if (u <= 0) return !1;
    let n = (Math.max(e, 1) - 1) * t + (Math.max(a, 1) - 1);
    return Math.floor(n / 4) * 4 + 4 <= u;
  }
  function F(r, t, e = "blas-params") {
    let a = t.length * 4,
      o = Math.ceil(a / 16) * 16,
      i = new ArrayBuffer(o),
      s = new DataView(i);
    t.forEach(({ value: n, type: f }, l) => {
      let d = l * 4;
      if (f === "u32") s.setUint32(d, n, !0);
      else if (f === "i32") s.setInt32(d, n, !0);
      else if (f === "f32") s.setFloat32(d, n, !0);
      else
        throw new Error(
          `Unknown param type "${f}". Use "f32", "u32", or "i32".`,
        );
    });
    let u = r.createBuffer({
      label: e,
      size: o,
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
  function Y(r) {
    let t = r.length,
      e = new Float32Array(t),
      a = new Float32Array(t);
    for (let o = 0; o < t; o++) {
      let i = Math.fround(r[o]);
      ((e[o] = i), (a[o] = Math.fround(r[o] - i)));
    }
    return { hi: e, lo: a };
  }
  function ur(r, t) {
    let e = r.length,
      a = new Float64Array(e);
    for (let o = 0; o < e; o++) a[o] = r[o] + t[o];
    return a;
  }
  var Vr = class {
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
          for (let a = 0; a < t; a++) this[a] = new Vr(0, 0);
          return;
        }
        let e = Array.from(t);
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
  function te(r, t = r.length) {
    let e = new Float32Array(t * 2);
    for (let a = 0; a < t; a++)
      ((e[a * 2] = r[a].re), (e[a * 2 + 1] = r[a].im));
    return e;
  }
  function he(r, t = r.length) {
    let e = new Float64Array(t),
      a = new Float64Array(t);
    for (let l = 0; l < t; l++) ((e[l] = r[l].re), (a[l] = r[l].im));
    let { hi: o, lo: i } = Y(e),
      { hi: s, lo: u } = Y(a),
      n = new Float32Array(t * 2),
      f = new Float32Array(t * 2);
    for (let l = 0; l < t; l++)
      ((n[l * 2] = o[l]),
        (n[l * 2 + 1] = s[l]),
        (f[l * 2] = i[l]),
        (f[l * 2 + 1] = u[l]));
    return { hi: n, lo: f };
  }
  function be(r, t) {
    let e = r.length / 2,
      a = new Float32Array(e),
      o = new Float32Array(e),
      i = new Float32Array(e),
      s = new Float32Array(e);
    for (let l = 0; l < e; l++)
      ((a[l] = r[l * 2]),
        (i[l] = r[l * 2 + 1]),
        (o[l] = t[l * 2]),
        (s[l] = t[l * 2 + 1]));
    let u = ur(a, o),
      n = ur(i, s),
      f = new Gr(e);
    for (let l = 0; l < e; l++) f[l] = new Vr(u[l], n[l]);
    return f;
  }
  var Or = class {
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
          for (let a = 0; a < t; a++) this[a] = new Or(0, 0);
          return;
        }
        let e = Array.from(t);
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
  var L = class r {
    constructor(t, e, a = Float32Array, o = null, i = null) {
      ((this._buf = t),
        (this._loBuf = o),
        (this.length = e),
        (this.dtype = a),
        (this.device = i ?? re()));
    }
    static from(t, e) {
      let a = t instanceof GPUDevice,
        o = a ? t : re(),
        i = a ? e : t;
      if (i instanceof Float64Array) {
        let { hi: u, lo: n } = Y(i),
          f = y(o, u, "gpu-vector-f64-hi", !0),
          l = y(o, n, "gpu-vector-f64-lo", !0);
        return new r(f, i.length, Float64Array, l, o);
      }
      if (i instanceof _r) {
        let u = y(o, te(i), "gpu-vector-complex32", !0);
        return new r(u, i.length, _r, null, o);
      }
      if (i instanceof Gr) {
        let { hi: u, lo: n } = he(i),
          f = y(o, u, "gpu-vector-complex64-hi", !0),
          l = y(o, n, "gpu-vector-complex64-lo", !0);
        return new r(f, i.length, Gr, l, o);
      }
      if (!(i instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let s = y(o, i, "gpu-vector", !0);
      return new r(s, i.length, i.constructor, null, o);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        a = E(t, e, this._buf);
      if ((t.queue.submit([e.finish()]), this.dtype === _r))
        return new _r(await S(a, Float32Array));
      if (!this._loBuf) return S(a, this.dtype);
      let o = t.createCommandEncoder(),
        i = E(t, o, this._loBuf);
      t.queue.submit([o.finish()]);
      let [s, u] = await Promise.all([S(a, Float32Array), S(i, Float32Array)]);
      return this.dtype === Gr ? be(s, u) : ur(s, u);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var $ = class r {
    constructor(
      t,
      e,
      a,
      o,
      i = null,
      s = "row-major",
      u = null,
      n = Float32Array,
    ) {
      ((this._buf = t),
        (this._loBuf = i),
        (this.rows = e),
        (this.cols = a),
        (this.lda = o),
        (this.layout = s),
        (this.dtype = n),
        (this.device = u ?? re()));
    }
    static from(t, ...e) {
      let a = t instanceof GPUDevice,
        o = a ? t : re(),
        i = a ? e.shift() : t,
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
      let d = l ? u : s;
      if (!Number.isInteger(n) || n < d)
        throw new Error(`lda must be an integer >= ${l ? "cols" : "rows"}.`);
      let g = l ? s : u;
      if (i.length < g * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (i instanceof Float64Array) {
        let p = g * n,
          { hi: w, lo: b } = Y(i.subarray(0, p)),
          h = y(o, w, "gpu-matrix-f64-hi", !0),
          x = y(o, b, "gpu-matrix-f64-lo", !0);
        return new r(h, s, u, n, x, f, o, Float64Array);
      }
      if (i instanceof _r) {
        let p = y(o, te(i, g * n), "gpu-matrix-complex32", !0);
        return new r(p, s, u, n, null, f, o, _r);
      }
      if (i instanceof Gr) {
        let { hi: p, lo: w } = he(i, g * n),
          b = y(o, p, "gpu-matrix-complex64-hi", !0),
          h = y(o, w, "gpu-matrix-complex64-lo", !0);
        return new r(b, s, u, n, h, f, o, Gr);
      }
      let c = y(o, i.subarray(0, g * n), "gpu-matrix", !0);
      return new r(c, s, u, n, null, f, o);
    }
    async read() {
      let t = this.device,
        e = t.createCommandEncoder(),
        a = E(t, e, this._buf);
      t.queue.submit([e.finish()]);
      let o = this.layout !== "column-major",
        i = o ? this.rows : this.cols,
        s = o ? this.cols : this.rows;
      if (this.dtype === _r) {
        let f = new _r(await S(a, Float32Array));
        if (this.lda === s) return f;
        let l = new _r(i * s);
        for (let d = 0; d < i; d++)
          for (let g = 0; g < s; g++) l[d * s + g] = f[d * this.lda + g];
        return l;
      }
      if (this._loBuf) {
        let f = t.createCommandEncoder(),
          l = E(t, f, this._loBuf);
        t.queue.submit([f.finish()]);
        let [d, g] = await Promise.all([
          S(a, Float32Array),
          S(l, Float32Array),
        ]);
        if (this.dtype === Gr) {
          let w = be(d, g);
          if (this.lda === s) return w;
          let b = new Gr(i * s);
          for (let h = 0; h < i; h++)
            for (let x = 0; x < s; x++) b[h * s + x] = w[h * this.lda + x];
          return b;
        }
        let c = ur(d, g);
        if (this.lda === s) return c;
        let p = new Float64Array(i * s);
        for (let w = 0; w < i; w++)
          p.set(c.subarray(w * this.lda, w * this.lda + s), w * s);
        return p;
      }
      let u = await S(a, Float32Array);
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
  function Ue(r, t = -1, e = 1, a) {
    let o = new Float32Array(r),
      i = a === void 0 ? Math.random : ze(a);
    for (let s = 0; s < r; s++) o[s] = t + i() * (e - t);
    return o;
  }
  function Ye(r, t = -1, e = 1, a) {
    let o = new Float64Array(r),
      i = a === void 0 ? Math.random : ze(a);
    for (let s = 0; s < r; s++) o[s] = t + i() * (e - t);
    return o;
  }
  function Xe(
    r,
    t,
    e = "lower",
    a = -1,
    o = 1,
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
      f = (d, g) => (n ? g * t + d : d * t + g),
      l = new Float32Array(r * t);
    for (let d = 0; d < r; d++) {
      for (let g = 0; g < r; g++) {
        if (d === g) continue;
        (e === "lower" ? g < d : g > d) &&
          (l[f(d, g)] = a + Math.random() * (o - a));
      }
      l[f(d, d)] = i + Math.random() * (s - i);
    }
    return l;
  }
  function D(r, t, e, a = 0) {
    let o = e.map((i, s) => ({
      binding: a + s,
      resource: i instanceof GPUBuffer ? { buffer: i } : i,
    }));
    return r.createBindGroup({ layout: t, entries: o });
  }
  function I(r, t) {
    r.queue.submit([t.finish()]);
  }
  function qr(r) {
    let { querySet: t, passDescriptor: e } = He(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: t,
      passDescriptor: e,
    };
  }
  function wr(r, t, e, a, o) {
    let i = r.beginComputePass(o);
    (i.setPipeline(t),
      i.setBindGroup(0, e),
      typeof a == "number"
        ? i.dispatchWorkgroups(a)
        : i.dispatchWorkgroups(a.x, a.y, a.z ?? 1),
      i.end());
  }
  function j(r, t, e, a) {
    let { commandEncoder: o, querySet: i, passDescriptor: s } = qr(r);
    wr(o, t, e, a, s);
    let u = Ir(r, o, i);
    return { commandEncoder: o, ts: u };
  }
  var es = {},
    Me = new WeakMap();
  async function k(r, t, e = "main") {
    Me.has(r) || Me.set(r, new Map());
    let a = Me.get(r),
      o = Array.isArray(t) ? t : [t],
      i = `${o.join("+")}::${e}`;
    if (!a.has(i)) {
      let s = rs(r, o, e).catch((u) => {
        throw (a.delete(i), u);
      });
      a.set(i, s);
    }
    return a.get(i);
  }
  async function Ji(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: t } = await Promise.resolve().then(() => (Ko(), Oo)),
        e = t[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: t } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: a, join: o } = await import("path"),
        i = a(e(es.url));
      return t(o(i, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function rs(r, t, e = "main") {
    let a = t.join("+"),
      o = await Promise.all(t.map(Ji)),
      i = 0,
      s = o.map((p, w) => {
        let b = p.split(`
`).length,
          h = { name: t[w], startLine: i + 1, endLine: i + b };
        return ((i += b), h);
      }),
      u = (p) => {
        let w = p && s.find((b) => p >= b.startLine && p <= b.endLine);
        return w ? `${w.name}.wgsl:${p - w.startLine + 1}` : `line ${p}`;
      },
      n = o.join(`
`),
      f = r.createShaderModule({ label: a, code: n }),
      d = (await f.getCompilationInfo()).messages.filter(
        (p) => p.type === "error",
      );
    if (d.length > 0)
      throw new Error(`Shader "${a}" compilation failed:
${d.map((p) => `  ${u(p.lineNum)}: ${p.message}`).join(`
`)}`);
    let g = e === "main" ? { module: f } : { module: f, entryPoint: e },
      c = r.createComputePipeline({ label: a, layout: "auto", compute: g });
    return ((c._shaderModule = f), c);
  }
  function gr(r, t, e) {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(t / 64), a)
      : { x: Math.min(Math.ceil(e / 8), a), y: Math.min(Math.ceil(t / 8), a) };
  }
  function Z(r, t, e, a = "x") {
    let o = r.limits.maxComputeWorkgroupsPerDimension;
    if (t > o)
      throw new Error(
        `${e}: this problem needs ${t} workgroups in ${a}, but the device allows ${o} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return t;
  }
  function Yr(r, t, e, a) {
    return a === void 0
      ? Z(r, Math.ceil(e / 64), t)
      : {
          x: Z(r, Math.ceil(a / 8), t, "x"),
          y: Z(r, Math.ceil(e / 8), t, "y"),
        };
  }
  function H(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function C(r, t, e) {
    for (let [a, o] of Object.entries(e))
      if (!(!(o instanceof L) && !(o instanceof $)) && o.device !== r)
        throw new Error(
          `${t}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function zo(r, t, e, a, o) {
    let i = a instanceof L;
    if (
      (H(r),
      C(r, "sscal", { x: a }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Float32Array) && !(a instanceof L))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return i ? {} : { x: a };
    if (a.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await k(r, "sscal"),
      u = null,
      n = null,
      f = null;
    try {
      ((u = i ? a._buf : y(r, a, "sscal-x", !0)),
        (n = F(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: o, type: "u32" },
          ],
          "sscal-params",
        )));
      let l = D(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: d, ts: g } = j(r, s, l, gr(r, t));
      ((f = i ? null : E(r, d, u)), I(r, d));
      let c = await M(g);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await S(f, Float32Array);
      return ((f = null), c !== void 0 ? { x: p, gpuTimeMs: c } : { x: p });
    } finally {
      (!i && u && m(u), n && m(n), f && m(f));
    }
  }
  async function Uo(r, t, e, a, o) {
    let i = a instanceof L;
    if (
      (H(r),
      C(r, "cscal", { x: a }),
      !Number.isInteger(t) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof Or)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof _r) && !i)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (i && a.dtype !== _r)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (t <= 0) return i ? {} : { x: a };
    if (a.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await k(r, "cscal"),
      u = null,
      n = null,
      f = null;
    try {
      ((u = i ? a._buf : y(r, te(a), "cscal-x", !0)),
        (n = F(
          r,
          [
            { value: t, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: o, type: "u32" },
          ],
          "cscal-params",
        )));
      let l = D(r, s.getBindGroupLayout(0), [u, n]),
        { commandEncoder: d, ts: g } = j(r, s, l, gr(r, t));
      ((f = i ? null : E(r, d, u)), I(r, d));
      let c = await M(g);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await S(f, Float32Array);
      f = null;
      let w = new _r(p);
      return c !== void 0 ? { x: w, gpuTimeMs: c } : { x: w };
    } finally {
      (!i && u && m(u), n && m(n), f && m(f));
    }
  }
  async function Yo(r, t, e, a, o) {
    let i = a instanceof L;
    if ((H(r), !Number.isInteger(t) || !Number.isInteger(o)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (i && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (o <= 0) throw new Error("incx must be positive.");
    if ((C(r, "dscal", { x: a }), t <= 0)) return i ? {} : { x: a };
    if (a.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let u = await k(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: f } = Y(new Float64Array([e])),
      l = null,
      d = null,
      g = null,
      c = null,
      p = null;
    try {
      if (i) ((l = a._buf), (d = a._loBuf));
      else {
        let { hi: G, lo: B } = Y(a);
        ((l = y(r, G, "dscal-xHi", !0)), (d = y(r, B, "dscal-xLo", !0)));
      }
      g = F(
        r,
        [
          { value: t, type: "u32" },
          { value: n[0], type: "f32" },
          { value: f[0], type: "f32" },
          { value: o, type: "u32" },
        ],
        "dscal-params",
      );
      let w = D(r, u.getBindGroupLayout(0), [l, d, g]),
        { commandEncoder: b, ts: h } = j(r, u, w, gr(r, t));
      ((c = i ? null : E(r, b, l)), (p = i ? null : E(r, b, d)), I(r, b));
      let x = await M(h);
      if (i) return x !== void 0 ? { gpuTimeMs: x } : {};
      let v = await S(c, Float32Array);
      c = null;
      let _ = await S(p, Float32Array);
      p = null;
      let A = ur(v, _);
      return x !== void 0 ? { x: A, gpuTimeMs: x } : { x: A };
    } finally {
      (!i && l && m(l), !i && d && m(d), g && m(g), c && m(c), p && m(p));
    }
  }
  async function Xo(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "sswap", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof L))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(o instanceof Float32Array) && !(o instanceof L))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (e.constructor !== o.constructor)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return s ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await k(r, "sswap"),
      f = null,
      l = null,
      d = null,
      g = null,
      c = null;
    try {
      ((f = s ? e._buf : y(r, e, "sswap-x", !0)),
        (l = u ? o._buf : y(r, o, "sswap-y", !0)),
        (d = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sswap-params",
        )));
      let p = D(r, n.getBindGroupLayout(0), [f, l, d]),
        { commandEncoder: w, ts: b } = j(r, n, p, gr(r, t));
      ((g = s ? null : E(r, w, f)), (c = u ? null : E(r, w, l)), I(r, w));
      let h = await M(b);
      if (s) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await S(g, Float32Array);
      g = null;
      let v = await S(c, Float32Array);
      return (
        (c = null),
        h !== void 0 ? { x, y: v, gpuTimeMs: h } : { x, y: v }
      );
    } finally {
      (!s && f && m(f), !u && l && m(l), d && m(d), g && m(g), c && m(c));
    }
  }
  async function $o(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "dswap", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(o instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && o.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return s ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await k(r, "dswap"),
      f = null,
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null,
      b = null,
      h = null;
    try {
      if (s) ((f = e._buf), (l = e._loBuf), (d = o._buf), (g = o._loBuf));
      else {
        let T = Y(e),
          O = Y(o);
        ((f = y(r, T.hi, "dswap-xHi", !0)),
          (l = y(r, T.lo, "dswap-xLo", !0)),
          (d = y(r, O.hi, "dswap-yHi", !0)),
          (g = y(r, O.lo, "dswap-yLo", !0)));
      }
      c = F(
        r,
        [
          { value: t, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dswap-params",
      );
      let x = D(r, n.getBindGroupLayout(0), [f, l, d, g, c]),
        { commandEncoder: v, ts: _ } = j(r, n, x, gr(r, t));
      ((p = s ? null : E(r, v, f)),
        (w = s ? null : E(r, v, l)),
        (b = u ? null : E(r, v, d)),
        (h = u ? null : E(r, v, g)),
        I(r, v));
      let A = await M(_);
      if (s) return A !== void 0 ? { gpuTimeMs: A } : {};
      let G = await S(p, Float32Array);
      p = null;
      let B = await S(w, Float32Array);
      w = null;
      let N = await S(b, Float32Array);
      b = null;
      let R = await S(h, Float32Array);
      h = null;
      let P = ur(G, B),
        q = ur(N, R);
      return A !== void 0 ? { x: P, y: q, gpuTimeMs: A } : { x: P, y: q };
    } finally {
      (!s && f && m(f),
        !s && l && m(l),
        !u && d && m(d),
        !u && g && m(g),
        c && m(c),
        p && m(p),
        w && m(w),
        b && m(b),
        h && m(h));
    }
  }
  async function Zo(r, t, e, a, o, i, s) {
    let u = a instanceof L,
      n = i instanceof L;
    if (
      (H(r),
      C(r, "saxpy", { x: a, y: i }),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { y: i };
    if (a.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let f = await k(r, "saxpy"),
      l = null,
      d = null,
      g = null,
      c = null;
    try {
      ((l = u ? a._buf : y(r, a, "saxpy-x", !1)),
        (d = n ? i._buf : y(r, i, "saxpy-y", !0)),
        (g = F(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "f32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "saxpy-params",
        )));
      let p = D(r, f.getBindGroupLayout(0), [l, d, g]),
        { commandEncoder: w, ts: b } = j(r, f, p, gr(r, t));
      ((c = n ? null : E(r, w, d)), I(r, w));
      let h = await M(b);
      if (n) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await S(c, Float32Array);
      return ((c = null), h !== void 0 ? { y: x, gpuTimeMs: h } : { y: x });
    } finally {
      (!u && l && m(l), !n && d && m(d), g && m(g), c && m(c));
    }
  }
  async function Qo(r, t, e, a, o, i, s) {
    let u = a instanceof L,
      n = i instanceof L;
    if (
      (H(r),
      !Number.isInteger(t) || !Number.isInteger(o) || !Number.isInteger(s))
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
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if ((C(r, "daxpy", { x: a, y: i }), t <= 0)) return n ? {} : { y: i };
    if (a.length < (t - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (t - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await k(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: d, lo: g } = Y(new Float64Array([e])),
      c = null,
      p = null,
      w = null,
      b = null,
      h = null,
      x = null,
      v = null;
    try {
      if (u) ((c = a._buf), (p = a._loBuf), (w = i._buf), (b = i._loBuf));
      else {
        let q = Y(a),
          T = Y(i);
        ((c = y(r, q.hi, "daxpy-xHi", !1)),
          (p = y(r, q.lo, "daxpy-xLo", !1)),
          (w = y(r, T.hi, "daxpy-yHi", !0)),
          (b = y(r, T.lo, "daxpy-yLo", !0)));
      }
      h = F(
        r,
        [
          { value: t, type: "u32" },
          { value: d[0], type: "f32" },
          { value: g[0], type: "f32" },
          { value: o, type: "u32" },
          { value: s, type: "u32" },
        ],
        "daxpy-params",
      );
      let _ = D(r, l.getBindGroupLayout(0), [c, p, w, b, h]),
        { commandEncoder: A, ts: G } = j(r, l, _, gr(r, t));
      ((x = n ? null : E(r, A, w)), (v = n ? null : E(r, A, b)), I(r, A));
      let B = await M(G);
      if (n) return B !== void 0 ? { gpuTimeMs: B } : {};
      let N = await S(x, Float32Array);
      x = null;
      let R = await S(v, Float32Array);
      v = null;
      let P = ur(N, R);
      return B !== void 0 ? { y: P, gpuTimeMs: B } : { y: P };
    } finally {
      (!u && c && m(c),
        !u && p && m(p),
        !n && w && m(w),
        !n && b && m(b),
        h && m(h),
        x && m(x),
        v && m(v));
    }
  }
  async function Jo(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "scopy", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(o instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return u ? {} : { y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await k(r, "scopy"),
      f = null,
      l = null,
      d = null,
      g = null;
    try {
      ((f = s ? e._buf : y(r, e, "scopy-x", !1)),
        (l = u ? o._buf : y(r, o, "scopy-y", !0)),
        (d = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "scopy-params",
        )));
      let c = D(r, n.getBindGroupLayout(0), [f, l, d]),
        { commandEncoder: p, ts: w } = j(r, n, c, gr(r, t));
      ((g = u ? null : E(r, p, l)), I(r, p));
      let b = await M(w);
      if (u) return b !== void 0 ? { gpuTimeMs: b } : {};
      let h = await S(g, Float32Array);
      return ((g = null), b !== void 0 ? { y: h, gpuTimeMs: b } : { y: h });
    } finally {
      (!s && f && m(f), !u && l && m(l), d && m(d), g && m(g));
    }
  }
  async function ra(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "dcopy", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(o instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && o.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return u ? {} : { y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await k(r, "dcopy"),
      f = null,
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null;
    try {
      if (s) ((f = e._buf), (l = e._loBuf), (d = o._buf), (g = o._loBuf));
      else {
        let B = Y(e),
          N = Y(o);
        ((f = y(r, B.hi, "dcopy-xHi", !1)),
          (l = y(r, B.lo, "dcopy-xLo", !1)),
          (d = y(r, N.hi, "dcopy-yHi", !0)),
          (g = y(r, N.lo, "dcopy-yLo", !0)));
      }
      c = F(
        r,
        [
          { value: t, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dcopy-params",
      );
      let b = D(r, n.getBindGroupLayout(0), [f, l, d, g, c]),
        { commandEncoder: h, ts: x } = j(r, n, b, gr(r, t));
      ((p = u ? null : E(r, h, d)), (w = u ? null : E(r, h, g)), I(r, h));
      let v = await M(x);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = await S(p, Float32Array);
      p = null;
      let A = await S(w, Float32Array);
      w = null;
      let G = ur(_, A);
      return v !== void 0 ? { y: G, gpuTimeMs: v } : { y: G };
    } finally {
      (!s && f && m(f),
        !s && l && m(l),
        !u && d && m(d),
        !u && g && m(g),
        c && m(c),
        p && m(p),
        w && m(w));
    }
  }
  async function ea(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "sdot", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(o instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await k(r, "sdot"),
      f = await k(r, "reduction/sum"),
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null;
    try {
      ((l = s ? e._buf : y(r, e, "sdot-x", !1)),
        (d = u ? o._buf : y(r, o, "sdot-y", !1)),
        (g = nr(r, 512, "sdot-partials")),
        (c = Br(r, 4, "sdot-result")),
        (p = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sdot-params",
        )));
      let b = D(r, n.getBindGroupLayout(0), [l, d, g, p]),
        { commandEncoder: h, ts: x } = j(r, n, b, 128);
      I(r, h);
      let v = D(r, f.getBindGroupLayout(0), [g, c]),
        { commandEncoder: _, ts: A } = j(r, f, v, 1);
      ((w = E(r, _, c)), I(r, _));
      let G = S(w, Float32Array);
      w = null;
      let [B, N, R] = await Promise.all([M(x), M(A), G]);
      return B !== void 0 && N !== void 0
        ? { dot: R[0], gpuTimeMs: B + N }
        : { dot: R[0] };
    } finally {
      (!s && l && m(l),
        !u && d && m(d),
        g && m(g),
        c && m(c),
        p && m(p),
        w && m(w));
    }
  }
  async function ta(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "sasum", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { asum: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await k(r, "sasum"),
      s = await k(r, "reduction/sum"),
      u = null,
      n = null,
      f = null,
      l = null,
      d = null;
    try {
      ((u = o ? e._buf : y(r, e, "sasum-x", !1)),
        (n = nr(r, 512, "sasum-partials")),
        (f = Br(r, 4, "sasum-result")),
        (l = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "sasum-params",
        )));
      let g = D(r, i.getBindGroupLayout(0), [u, n, l]),
        { commandEncoder: c, ts: p } = j(r, i, g, 128);
      I(r, c);
      let w = D(r, s.getBindGroupLayout(0), [n, f]),
        { commandEncoder: b, ts: h } = j(r, s, w, 1);
      ((d = E(r, b, f)), I(r, b));
      let x = S(d, Float32Array);
      d = null;
      let [v, _, A] = await Promise.all([M(p), M(h), x]);
      return v !== void 0 && _ !== void 0
        ? { asum: A[0], gpuTimeMs: v + _ }
        : { asum: A[0] };
    } finally {
      (!o && u && m(u), n && m(n), f && m(f), l && m(l), d && m(d));
    }
  }
  async function oa(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "dasum", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (o && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { asum: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = ["f64/dekker", "f64/utils/abs", "f64/utils/add"],
      s = await k(r, [...i, "dasum"]),
      u = await k(r, [...i, "reduction/sumF64"]),
      n = null,
      f = null,
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null,
      b = null;
    try {
      if (o) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: K, lo: W } = Y(e.map(Math.abs));
        ((n = y(r, K, "dasum-xHi", !1)), (f = y(r, W, "dasum-xLo", !1)));
      }
      ((l = nr(r, 512, "dasum-partialsHi")),
        (d = nr(r, 512, "dasum-partialsLo")),
        (g = Br(r, 4, "dasum-result-hi")),
        (c = Br(r, 4, "dasum-result-lo")),
        (p = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dasum-params",
        )));
      let h = D(r, s.getBindGroupLayout(0), [n, f, l, d, p]),
        { commandEncoder: x, ts: v } = j(r, s, h, 128);
      I(r, x);
      let _ = D(r, u.getBindGroupLayout(0), [l, d, g, c]),
        { commandEncoder: A, ts: G } = j(r, u, _, 1);
      ((w = E(r, A, g)), (b = E(r, A, c)), I(r, A));
      let B = S(w, Float32Array),
        N = S(b, Float32Array);
      ((w = null), (b = null));
      let [R, P, q, T] = await Promise.all([M(v), M(G), B, N]),
        O = ur(q, T)[0];
      return R !== void 0 && P !== void 0
        ? { asum: O, gpuTimeMs: R + P }
        : { asum: O };
    } finally {
      (!o && n && m(n),
        !o && f && m(f),
        l && m(l),
        d && m(d),
        g && m(g),
        c && m(c),
        p && m(p),
        w && m(w),
        b && m(b));
    }
  }
  async function aa(r, t, e, a, o, i) {
    let s = e instanceof L,
      u = o instanceof L;
    if (
      (H(r),
      C(r, "ddot", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!u && !(o instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && o.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return { dot: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = ["f64/dekker", "f64/utils/add"],
      f = await k(r, [...n, "f64/utils/multiply", "ddot"]),
      l = await k(r, [...n, "reduction/sumF64"]),
      d = null,
      g = null,
      c = null,
      p = null,
      w = null,
      b = null,
      h = null,
      x = null,
      v = null,
      _ = null,
      A = null;
    try {
      if (s) ((d = e._buf), (g = e._loBuf), (c = o._buf), (p = o._loBuf));
      else {
        let Q = Y(e),
          J = Y(o);
        ((d = y(r, Q.hi, "ddot-xHi", !1)),
          (g = y(r, Q.lo, "ddot-xLo", !1)),
          (c = y(r, J.hi, "ddot-yHi", !1)),
          (p = y(r, J.lo, "ddot-yLo", !1)));
      }
      ((w = nr(r, 512, "ddot-partialsHi")),
        (b = nr(r, 512, "ddot-partialsLo")),
        (h = Br(r, 4, "ddot-result-hi")),
        (x = Br(r, 4, "ddot-result-lo")),
        (v = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "ddot-params",
        )));
      let G = D(r, f.getBindGroupLayout(0), [d, g, c, p, w, b, v]),
        { commandEncoder: B, ts: N } = j(r, f, G, 128);
      I(r, B);
      let R = D(r, l.getBindGroupLayout(0), [w, b, h, x]),
        { commandEncoder: P, ts: q } = j(r, l, R, 1);
      ((_ = E(r, P, h)), (A = E(r, P, x)), I(r, P));
      let T = S(_, Float32Array),
        O = S(A, Float32Array);
      ((_ = null), (A = null));
      let [K, W, z, V] = await Promise.all([M(N), M(q), T, O]),
        X = ur(z, V)[0];
      return K !== void 0 && W !== void 0
        ? { dot: X, gpuTimeMs: K + W }
        : { dot: X };
    } finally {
      (!s && d && m(d),
        !s && g && m(g),
        !u && c && m(c),
        !u && p && m(p),
        w && m(w),
        b && m(b),
        h && m(h),
        x && m(x),
        v && m(v),
        _ && m(_),
        A && m(A));
    }
  }
  async function ia(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "snrm2", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { nrm2: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await k(r, "snrm2"),
      s = await k(r, "reduction/scaledSum"),
      u = null,
      n = null,
      f = null,
      l = null,
      d = null,
      g = null;
    try {
      ((u = o ? e._buf : y(r, e, "snrm2-x", !1)),
        (n = nr(r, 512, "snrm2-partials-scale")),
        (f = nr(r, 512, "snrm2-partials-ssq")),
        (l = Br(r, 4, "snrm2-result")),
        (d = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "snrm2-params",
        )));
      let c = D(r, i.getBindGroupLayout(0), [u, n, f, d]),
        { commandEncoder: p, ts: w } = j(r, i, c, 128);
      I(r, p);
      let b = D(r, s.getBindGroupLayout(0), [n, f, l]),
        { commandEncoder: h, ts: x } = j(r, s, b, 1);
      ((g = E(r, h, l)), I(r, h));
      let v = S(g, Float32Array);
      g = null;
      let [_, A, G] = await Promise.all([M(w), M(x), v]),
        B = G[0];
      return _ !== void 0 && A !== void 0
        ? { nrm2: B, gpuTimeMs: _ + A }
        : { nrm2: B };
    } finally {
      (!o && u && m(u), n && m(n), f && m(f), l && m(l), d && m(d), g && m(g));
    }
  }
  async function sa(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "dnrm2", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (o && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { nrm2: 0 };
    if (e.length < (t - 1) * a + 1)
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
      s = await k(r, [...i, "dnrm2"]),
      u = await k(r, [...i, "reduction/scaledSumF64"]),
      n = null,
      f = null,
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null,
      b = null,
      h = null,
      x = null;
    try {
      if (o) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: z, lo: V } = Y(e);
        ((n = y(r, z, "dnrm2-xHi", !1)), (f = y(r, V, "dnrm2-xLo", !1)));
      }
      ((l = nr(r, 512, "dnrm2-partials-scaleHi")),
        (d = nr(r, 512, "dnrm2-partials-scaleLo")),
        (g = nr(r, 512, "dnrm2-partials-ssqHi")),
        (c = nr(r, 512, "dnrm2-partials-ssqLo")),
        (p = Br(r, 4, "dnrm2-result-hi")),
        (w = Br(r, 4, "dnrm2-result-lo")),
        (b = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let v = D(r, s.getBindGroupLayout(0), [n, f, l, d, g, c, b]),
        { commandEncoder: _, ts: A } = j(r, s, v, 128);
      I(r, _);
      let G = D(r, u.getBindGroupLayout(0), [l, d, g, c, p, w]),
        { commandEncoder: B, ts: N } = j(r, u, G, 1);
      ((h = E(r, B, p)), (x = E(r, B, w)), I(r, B));
      let R = S(h, Float32Array),
        P = S(x, Float32Array);
      ((h = null), (x = null));
      let [q, T, O, K] = await Promise.all([M(A), M(N), R, P]),
        W = ur(O, K)[0];
      return q !== void 0 && T !== void 0
        ? { nrm2: W, gpuTimeMs: q + T }
        : { nrm2: W };
    } finally {
      (!o && n && m(n),
        !o && f && m(f),
        l && m(l),
        d && m(d),
        g && m(g),
        c && m(c),
        p && m(p),
        w && m(w),
        b && m(b),
        h && m(h),
        x && m(x));
    }
  }
  async function na(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "isamax", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (t <= 0) return { index: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await k(r, "isamax"),
      s = await k(r, "reduction/argmax"),
      u = null,
      n = null,
      f = null,
      l = null,
      d = null,
      g = null;
    try {
      ((u = o ? e._buf : y(r, e, "isamax-x", !1)),
        (n = nr(r, 512, "isamax-partials-val")),
        (f = nr(r, 512, "isamax-partials-idx")),
        (l = Br(r, 4, "isamax-result")),
        (d = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "isamax-params",
        )));
      let c = D(r, i.getBindGroupLayout(0), [u, n, f, d]),
        { commandEncoder: p, ts: w } = j(r, i, c, 128);
      I(r, p);
      let b = D(r, s.getBindGroupLayout(0), [n, f, l]),
        { commandEncoder: h, ts: x } = j(r, s, b, 1);
      ((g = E(r, h, l)), I(r, h));
      let v = S(g, Uint32Array);
      g = null;
      let [_, A, G] = await Promise.all([M(w), M(x), v]),
        B = G[0];
      return _ !== void 0 && A !== void 0
        ? { index: B, gpuTimeMs: _ + A }
        : { index: B };
    } finally {
      (!o && u && m(u), n && m(n), f && m(f), l && m(l), d && m(d), g && m(g));
    }
  }
  async function la(r, t, e, a) {
    let o = e instanceof L;
    if (
      (H(r),
      C(r, "idamax", { x: e }),
      !Number.isInteger(t) || !Number.isInteger(a))
    )
      throw new Error("n and incx must be integers.");
    if (a <= 0) throw new Error("incx must be positive.");
    if (!o && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (o && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) return { index: 0 };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/equal",
      ],
      s = await k(r, [...i, "idamax"], "idamax_main"),
      u = await k(r, [...i, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      f = null,
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null;
    try {
      if (o) ((n = e._buf), (f = e._loBuf));
      else {
        let { hi: q, lo: T } = Y(e);
        ((n = y(r, q, "idamax-xHi", !1)), (f = y(r, T, "idamax-xLo", !1)));
      }
      ((l = nr(r, 512, "idamax-partials-val-hi")),
        (d = nr(r, 512, "idamax-partials-val-lo")),
        (g = nr(r, 512, "idamax-partials-idx")),
        (c = Br(r, 4, "idamax-result")),
        (p = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
          ],
          "idamax-params",
        )));
      let b = D(r, s.getBindGroupLayout(0), [n, f, l, d, g, p]),
        { commandEncoder: h, ts: x } = j(r, s, b, 128);
      I(r, h);
      let v = D(r, u.getBindGroupLayout(0), [l, d, g, c]),
        { commandEncoder: _, ts: A } = j(r, u, v, 1);
      ((w = E(r, _, c)), I(r, _));
      let G = S(w, Uint32Array);
      w = null;
      let [B, N, R] = await Promise.all([M(x), M(A), G]),
        P = R[0];
      return B !== void 0 && N !== void 0
        ? { index: P, gpuTimeMs: B + N }
        : { index: P };
    } finally {
      (!o && n && m(n),
        !o && f && m(f),
        l && m(l),
        d && m(d),
        g && m(g),
        c && m(c),
        p && m(p),
        w && m(w));
    }
  }
  async function ua(r, t, e, a, o, i, s, u) {
    let n = e instanceof L,
      f = o instanceof L;
    if (
      (H(r),
      C(r, "srot", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
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
    if (!f && !(o instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (n !== f)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await k(r, "srot"),
      d = null,
      g = null,
      c = null,
      p = null,
      w = null;
    try {
      ((d = n ? e._buf : y(r, e, "srot-x", !0)),
        (g = f ? o._buf : y(r, o, "srot-y", !0)),
        (c = F(
          r,
          [
            { value: t, type: "u32" },
            { value: s, type: "f32" },
            { value: u, type: "f32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srot-params",
        )));
      let b = D(r, l.getBindGroupLayout(0), [d, g, c]),
        { commandEncoder: h, ts: x } = j(r, l, b, gr(r, t));
      ((p = n ? null : E(r, h, d)), (w = f ? null : E(r, h, g)), I(r, h));
      let v = await M(x);
      if (n) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = S(p, Float32Array),
        A = S(w, Float32Array);
      ((p = null), (w = null));
      let [G, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: G, y: B, gpuTimeMs: v } : { x: G, y: B };
    } finally {
      (!n && d && m(d), !f && g && m(g), c && m(c), p && m(p), w && m(w));
    }
  }
  async function fa(r, t, e, a, o, i, s, u) {
    let n = e instanceof L,
      f = o instanceof L;
    if (
      (H(r),
      C(r, "drot", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
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
    if (!(o instanceof Float64Array) && !f)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (n && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (f && o.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (n !== f)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0) return n ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let d = await k(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drot",
      ]),
      { hi: g, lo: c } = Y(new Float64Array([s])),
      { hi: p, lo: w } = Y(new Float64Array([u])),
      b = null,
      h = null,
      x = null,
      v = null,
      _ = null,
      A = null,
      G = null,
      B = null,
      N = null;
    try {
      if (n) ((b = e._buf), (h = e._loBuf), (x = o._buf), (v = o._loBuf));
      else {
        let Q = Y(e),
          J = Y(o);
        ((b = y(r, Q.hi, "drot-xHi", !0)),
          (h = y(r, Q.lo, "drot-xLo", !0)),
          (x = y(r, J.hi, "drot-yHi", !0)),
          (v = y(r, J.lo, "drot-yLo", !0)));
      }
      _ = F(
        r,
        [
          { value: t, type: "u32" },
          { value: g[0], type: "f32" },
          { value: c[0], type: "f32" },
          { value: p[0], type: "f32" },
          { value: w[0], type: "f32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "drot-params",
      );
      let R = D(r, d.getBindGroupLayout(0), [b, h, x, v, _]),
        { commandEncoder: P, ts: q } = j(r, d, R, gr(r, t));
      ((A = n ? null : E(r, P, b)),
        (G = n ? null : E(r, P, h)),
        (B = f ? null : E(r, P, x)),
        (N = f ? null : E(r, P, v)),
        I(r, P));
      let T = await M(q);
      if (n) return T !== void 0 ? { gpuTimeMs: T } : {};
      let O = await S(A, Float32Array);
      A = null;
      let K = await S(G, Float32Array);
      G = null;
      let W = await S(B, Float32Array);
      B = null;
      let z = await S(N, Float32Array);
      N = null;
      let V = ur(O, K),
        X = ur(W, z);
      return T !== void 0 ? { x: V, y: X, gpuTimeMs: T } : { x: V, y: X };
    } finally {
      (!n && b && m(b),
        !n && h && m(h),
        !f && x && m(x),
        !f && v && m(v),
        _ && m(_),
        A && m(A),
        G && m(G),
        B && m(B),
        N && m(N));
    }
  }
  async function da(r, t, e, a, o, i, s) {
    let u = e instanceof L,
      n = o instanceof L;
    if (
      (H(r),
      C(r, "srotm", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float32Array) || s.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(o instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (t <= 0 || s[0] === -2) return u ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let f = await k(r, "srotm"),
      l = null,
      d = null,
      g = null,
      c = null,
      p = null,
      w = null;
    try {
      ((l = u ? e._buf : y(r, e, "srotm-x", !0)),
        (d = n ? o._buf : y(r, o, "srotm-y", !0)),
        (g = y(r, s, "srotm-param", !1)),
        (c = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srotm-params",
        )));
      let b = D(r, f.getBindGroupLayout(0), [l, d, g, c]),
        { commandEncoder: h, ts: x } = j(r, f, b, gr(r, t));
      ((p = u ? null : E(r, h, l)), (w = n ? null : E(r, h, d)), I(r, h));
      let v = await M(x);
      if (u) return v !== void 0 ? { gpuTimeMs: v } : {};
      let _ = S(p, Float32Array),
        A = S(w, Float32Array);
      ((p = null), (w = null));
      let [G, B] = await Promise.all([_, A]);
      return v !== void 0 ? { x: G, y: B, gpuTimeMs: v } : { x: G, y: B };
    } finally {
      (!u && l && m(l),
        !n && d && m(d),
        g && m(g),
        c && m(c),
        p && m(p),
        w && m(w));
    }
  }
  async function ma(r, t, e, a, o, i, s) {
    let u = e instanceof L,
      n = o instanceof L;
    if (
      (H(r),
      C(r, "drotm", { x: e, y: o }),
      !Number.isInteger(t) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float64Array) || s.length !== 5)
      throw new Error("param must be a Float64Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(o instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && o.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0 || s[0] === -2) return u ? {} : { x: e, y: o };
    if (e.length < (t - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await k(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drotm",
      ]),
      { hi: d, lo: g } = Y(s),
      c = null,
      p = null,
      w = null,
      b = null,
      h = null,
      x = null,
      v = null,
      _ = null,
      A = null,
      G = null,
      B = null;
    try {
      if (u) ((c = e._buf), (p = e._loBuf), (w = o._buf), (b = o._loBuf));
      else {
        let X = Y(e),
          Q = Y(o);
        ((c = y(r, X.hi, "drotm-xHi", !0)),
          (p = y(r, X.lo, "drotm-xLo", !0)),
          (w = y(r, Q.hi, "drotm-yHi", !0)),
          (b = y(r, Q.lo, "drotm-yLo", !0)));
      }
      ((h = y(r, d, "drotm-paramHi", !1)),
        (x = y(r, g, "drotm-paramLo", !1)),
        (v = F(
          r,
          [
            { value: t, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "drotm-params",
        )));
      let N = D(r, l.getBindGroupLayout(0), [c, p, w, b, h, x, v]),
        { commandEncoder: R, ts: P } = j(r, l, N, gr(r, t));
      ((_ = u ? null : E(r, R, c)),
        (A = u ? null : E(r, R, p)),
        (G = n ? null : E(r, R, w)),
        (B = n ? null : E(r, R, b)),
        I(r, R));
      let q = await M(P);
      if (u) return q !== void 0 ? { gpuTimeMs: q } : {};
      let T = await S(_, Float32Array);
      _ = null;
      let O = await S(A, Float32Array);
      A = null;
      let K = await S(G, Float32Array);
      G = null;
      let W = await S(B, Float32Array);
      B = null;
      let z = ur(T, O),
        V = ur(K, W);
      return q !== void 0 ? { x: z, y: V, gpuTimeMs: q } : { x: z, y: V };
    } finally {
      (!u && c && m(c),
        !u && p && m(p),
        !n && w && m(w),
        !n && b && m(b),
        h && m(h),
        x && m(x),
        v && m(v),
        _ && m(_),
        A && m(A),
        G && m(G),
        B && m(B));
    }
  }
  async function ca(r, t, e, a, o, i, s, u, n, f, l, d, g = "row-major") {
    let c = i instanceof $,
      p = u instanceof L,
      w = l instanceof L;
    if (
      (H(r),
      C(r, "sgemv", { A: i, x: u, y: l }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof f != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(f)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(f)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(d) ||
      !Number.isInteger(s)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || d <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== w)
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
    if (c && w && i._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return w ? {} : { y: l };
    (c ? i.layout : g) === "column-major" &&
      (([e, a] = [a, e]),
      (t = t === "no-transpose" ? "transpose" : "no-transpose"));
    let h = t === "no-transpose",
      x = h ? a : e,
      v = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (v - 1) * d + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let A = await k(r, h ? "sgemv_n" : "sgemv_t"),
      G = null,
      B = null,
      N = null,
      R = null;
    try {
      ((G = c ? i._buf : y(r, i, "sgemv-A", !1)),
        (B = p ? u._buf : y(r, u, "sgemv-x", !1)),
        (N = w ? l._buf : y(r, l, "sgemv-y", !0)),
        (R = F(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "u32" },
            { value: o, type: "f32" },
            { value: f, type: "f32" },
            { value: n, type: "u32" },
            { value: d, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sgemv-params",
        )));
      let P = D(r, A.getBindGroupLayout(0), [G, B, N, R]),
        q = h
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Yr(r, "sgemv", v),
        { commandEncoder: T, ts: O } = j(r, A, P, q),
        K = w ? null : E(r, T, N);
      I(r, T);
      let W = await M(O);
      if (w) return W !== void 0 ? { gpuTimeMs: W } : {};
      let z = await S(K, Float32Array);
      return W !== void 0 ? { y: z, gpuTimeMs: W } : { y: z };
    } finally {
      (!c && G && m(G), !p && B && m(B), !w && N && m(N), R && m(R));
    }
  }
  async function pa(r, t, e, a, o, i, s, u, n, f, l, d = "row-major") {
    let g = s instanceof L,
      c = f instanceof L,
      p = o instanceof $;
    if (
      (H(r),
      C(r, "ssymv", { A: o, x: s, y: f }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (d !== "row-major" && d !== "column-major")
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
    if (!p && !(o instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (g !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (g && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !g)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (g && s._buf === f._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && i !== o.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (o.rows < e || o.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return c ? {} : { y: f };
    if (!p && o.length < (e - 1) * i + e)
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
    let b =
        (p ? o.layout : d) === "column-major" ? t === "upper" : t === "lower",
      h = await k(r, "ssymv"),
      x = null,
      v = null,
      _ = null,
      A = null;
    try {
      ((x = p ? o._buf : y(r, o, "ssymv-A", !1)),
        (v = g ? s._buf : y(r, s, "ssymv-x", !1)),
        (_ = c ? f._buf : y(r, f, "ssymv-y", !0)),
        (A = F(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: n, type: "f32" },
            { value: u, type: "u32" },
            { value: l, type: "u32" },
            { value: i, type: "u32" },
            { value: b ? 0 : 1, type: "u32" },
          ],
          "ssymv-params",
        )));
      let G = D(r, h.getBindGroupLayout(0), [x, v, _, A]),
        B = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: N, ts: R } = j(r, h, G, B),
        P = c ? null : E(r, N, _);
      I(r, N);
      let q = await M(R);
      if (c) return q !== void 0 ? { gpuTimeMs: q } : {};
      let T = await S(P, Float32Array);
      return q !== void 0 ? { y: T, gpuTimeMs: q } : { y: T };
    } finally {
      (!p && x && m(x), !g && v && m(v), !c && _ && m(_), A && m(A));
    }
  }
  async function ga(r, t, e, a, o, i, s, u, n, f, l, d = "row-major") {
    let g = u instanceof L,
      c = f instanceof L,
      p = i instanceof $,
      w = a === "unit";
    if (
      (H(r),
      C(r, "strmv", { A: i, x: u, y: f }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < o) throw new Error("lda must be >= n.");
    if (!p && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (g !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (g && u._buf === f._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (g && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !g)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && c && i._buf === f._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (i.rows < o || i.cols < o))
      throw new Error("A is too small for the given n.");
    if (o < 0) throw new Error("n must be non-negative.");
    if (o === 0) return c ? {} : { y: f };
    if (!p && i.length < (o - 1) * s + o)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (o - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (f.length < (o - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h = (p ? i.layout : d) === "column-major",
      x = h ? t === "upper" : t === "lower",
      v = h ? e === "transpose" : e === "no-transpose",
      _ = await k(r, "strmv"),
      A = null,
      G = null,
      B = null,
      N = null;
    try {
      ((A = p ? i._buf : y(r, i, "strmv-A", !1)),
        (G = g ? u._buf : y(r, u, "strmv-x", !1)),
        (B = c ? f._buf : y(r, f, "strmv-y", !0)),
        (N = F(
          r,
          [
            { value: o, type: "u32" },
            { value: n, type: "u32" },
            { value: l, type: "u32" },
            { value: s, type: "u32" },
            { value: v ? 0 : 1, type: "u32" },
            { value: x ? 0 : 1, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strmv-params",
        )));
      let R = D(r, _.getBindGroupLayout(0), [A, G, B, N]),
        P = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: q, ts: T } = j(r, _, R, P),
        O = c ? null : E(r, q, B);
      I(r, q);
      let K = await M(T);
      if (c) return K !== void 0 ? { gpuTimeMs: K } : {};
      let W = await S(O, Float32Array);
      return K !== void 0 ? { y: W, gpuTimeMs: K } : { y: W };
    } finally {
      (!p && A && m(A), !g && G && m(G), !c && B && m(B), N && m(N));
    }
  }
  function wa(r, t, e) {
    let a = new ArrayBuffer(r * t),
      o = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        u = i * t;
      s.forEach((n, f) => o.setUint32(u + f * 4, n, !0));
    }
    return a;
  }
  function ha(r, t, e) {
    let a = r.createBuffer({
      label: e,
      size: t.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, t), a);
  }
  async function ba(r, t, e, a, o, i, s, u, n, f = "row-major") {
    let l = u instanceof L,
      d = i instanceof $,
      g = a === "unit";
    if ((H(r), C(r, "strsv", { A: i, x: u }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!g && a !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (f !== "row-major" && f !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(o) || !Number.isInteger(n) || !Number.isInteger(s))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (s < o) throw new Error("lda must be >= n.");
    if (!d && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!l && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (l && !d)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (d && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (d && l && i._buf === u._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (d && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (d && (i.rows < o || i.cols < o))
      throw new Error("A is too small for the given n.");
    if (o < 0) throw new Error("n must be non-negative.");
    if (o === 0) return l ? {} : { x: u };
    if (!d && i.length < (o - 1) * s + o)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (o - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p = (d ? i.layout : f) === "column-major",
      w = p ? t === "upper" : t === "lower",
      b = p ? e === "transpose" : e === "no-transpose",
      h = await k(r, "strsv_invert_block"),
      x = await k(r, "strsv_apply_inverse"),
      v = await k(r, "strsv_update"),
      _ = b === w,
      A = [];
    for (let W = 0; W < o; W += 64) A.push(W);
    _ || A.reverse();
    let G = A.length,
      B = r.limits.maxComputeWorkgroupsPerDimension,
      N = r.limits.minUniformBufferOffsetAlignment,
      R = null,
      P = null,
      q = null,
      T = null,
      O = null,
      K = null;
    try {
      ((R = d ? i._buf : y(r, i, "strsv-A", !1)),
        (P = l ? u._buf : y(r, u, "strsv-x", !0)),
        (q = nr(r, G * 64 * 64 * 4, "strsv-Ainv")));
      let W = wa(G, N, (rr) => {
        let er = rr * 64,
          ar = Math.min(er + 64, o);
        return [n, rr, er, ar];
      });
      T = ha(r, W, "strsv-apply-params");
      let z = wa(G, N, (rr) => {
        let er = rr * 64,
          ar = Math.min(er + 64, o);
        return [o, n, s, b ? 0 : 1, w ? 0 : 1, er, ar];
      });
      O = ha(r, z, "strsv-update-params");
      let { commandEncoder: V, querySet: X } = qr(r);
      K = F(
        r,
        [
          { value: o, type: "u32" },
          { value: s, type: "u32" },
          { value: b ? 0 : 1, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
          { value: g ? 1 : 0, type: "u32" },
        ],
        "strsv-invert-params",
      );
      let Q = D(r, h.getBindGroupLayout(0), [R, q, K]);
      wr(
        V,
        h,
        Q,
        { x: 64, y: G },
        X
          ? { timestampWrites: { querySet: X, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let rr = 0; rr < A.length; rr++) {
        let er = A[rr],
          ar = Math.min(er + 64, o),
          sr = er / 64,
          lr = rr === A.length - 1,
          br = sr * N,
          pr = D(r, x.getBindGroupLayout(0), [
            q,
            P,
            { buffer: T, offset: br, size: 16 },
          ]);
        wr(
          V,
          x,
          pr,
          1,
          lr && X
            ? { timestampWrites: { querySet: X, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let yr = _ ? o - ar : er;
        if (yr === 0) continue;
        let Cr = D(r, v.getBindGroupLayout(0), [
            R,
            P,
            { buffer: O, offset: br, size: 32 },
          ]),
          Rr = Math.min(yr, B);
        wr(V, v, Cr, Rr);
      }
      let mr = Ir(r, V, X),
        ir = l ? null : E(r, V, P);
      I(r, V);
      let fr = await M(mr);
      if (l) return fr !== void 0 ? { gpuTimeMs: fr } : {};
      let or = await S(ir, Float32Array);
      return fr !== void 0 ? { x: or, gpuTimeMs: fr } : { x: or };
    } finally {
      (!d && R && m(R),
        !l && P && m(P),
        q && m(q),
        T && m(T),
        O && m(O),
        K && m(K));
    }
  }
  async function ya(r, t, e, a, o, i, s, u, n, f, l = "row-major") {
    let d = n instanceof $;
    if (
      (H(r),
      C(r, "sger", { A: n, x: o, y: s }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!d && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (d && f !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (d && (n.rows < t || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (d ? n.layout : l) === "column-major" &&
      (([t, e] = [e, t]), ([o, s] = [s, o]), ([i, u] = [u, i]));
    let c = o instanceof L,
      p = s instanceof L;
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !d)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (d && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (d && c && n._buf === o._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (d && p && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (t < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (t === 0 || e === 0) return d ? {} : { A: n };
    if (!d && n.length < (t - 1) * f + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let w = await k(r, "sger"),
      b = null,
      h = null,
      x = null,
      v = null;
    try {
      ((b = c ? o._buf : y(r, o, "sger-x", !1)),
        (h = p ? s._buf : y(r, s, "sger-y", !1)),
        (x = d ? n._buf : y(r, n, "sger-A", !0)),
        (v = F(
          r,
          [
            { value: t, type: "u32" },
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: f, type: "u32" },
          ],
          "sger-params",
        )));
      let _ = D(r, w.getBindGroupLayout(0), [b, h, x, v]),
        A = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: G, ts: B } = j(r, w, _, A),
        N = d ? null : E(r, G, x);
      I(r, G);
      let R = await M(B);
      if (d) return R !== void 0 ? { gpuTimeMs: R } : {};
      let P = await S(N, Float32Array);
      return R !== void 0 ? { A: P, gpuTimeMs: R } : { A: P };
    } finally {
      (!c && b && m(b), !p && h && m(h), !d && x && m(x), v && m(v));
    }
  }
  async function xa(r, t, e, a, o, i, s, u, n, f, l = "row-major") {
    let d = n instanceof $;
    if (
      (H(r),
      C(r, "dger", { A: n, x: o, y: s }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!d && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (d && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (d && f !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (d && (n.rows < t || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (d ? n.layout : l) === "column-major" &&
      (([t, e] = [e, t]), ([o, s] = [s, o]), ([i, u] = [u, i]));
    let c = o instanceof L,
      p = s instanceof L;
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(o instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(s instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (c && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (p && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (c !== p)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (c && !d)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (d && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (d && c && n._buf === o._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (d && p && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (t < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (t === 0 || e === 0) return d ? {} : { A: n };
    if (!d && n.length < (t - 1) * f + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (o.length < (t - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let b = await k(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dger"],
        "dger_main",
      ),
      { hi: h, lo: x } = Y(new Float64Array([a])),
      v = null,
      _ = null,
      A = null,
      G = null,
      B = null,
      N = null,
      R = null,
      P = null,
      q = null;
    try {
      if (c)
        ((v = o._buf),
          (_ = o._loBuf),
          (A = s._buf),
          (G = s._loBuf),
          (B = n._buf),
          (N = n._loBuf));
      else {
        let J = Y(o),
          mr = Y(s),
          ir = Y(n);
        ((v = y(r, J.hi, "dger-xHi", !1)),
          (_ = y(r, J.lo, "dger-xLo", !1)),
          (A = y(r, mr.hi, "dger-yHi", !1)),
          (G = y(r, mr.lo, "dger-yLo", !1)),
          (B = y(r, ir.hi, "dger-AHi", !0)),
          (N = y(r, ir.lo, "dger-ALo", !0)));
      }
      R = F(
        r,
        [
          { value: t, type: "u32" },
          { value: e, type: "u32" },
          { value: h[0], type: "f32" },
          { value: x[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: f, type: "u32" },
        ],
        "dger-params",
      );
      let T = D(r, b.getBindGroupLayout(0), [v, _, A, G, B, N, R]),
        O = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: K, ts: W } = j(r, b, T, O);
      ((P = d ? null : E(r, K, B)), (q = d ? null : E(r, K, N)), I(r, K));
      let z = await M(W);
      if (d) return z !== void 0 ? { gpuTimeMs: z } : {};
      let V = await S(P, Float32Array);
      P = null;
      let X = await S(q, Float32Array);
      q = null;
      let Q = ur(V, X);
      return z !== void 0 ? { A: Q, gpuTimeMs: z } : { A: Q };
    } finally {
      (!c && v && m(v),
        !c && _ && m(_),
        !p && A && m(A),
        !p && G && m(G),
        !d && B && m(B),
        !d && N && m(N),
        R && m(R),
        P && m(P),
        q && m(q));
    }
  }
  async function va(r, t, e, a, o, i, s, u, n = "row-major") {
    let f = o instanceof L,
      l = s instanceof $;
    if ((H(r), C(r, "ssyr", { A: s, x: o }), t !== "lower" && t !== "upper"))
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
    if (!f && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (f && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !f)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && f && s._buf === o._buf)
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
    if (o.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let g =
        (l ? s.layout : n) === "column-major" ? t === "upper" : t === "lower",
      c = await k(r, "ssyr"),
      p = null,
      w = null,
      b = null;
    try {
      ((p = f ? o._buf : y(r, o, "ssyr-x", !1)),
        (w = l ? s._buf : y(r, s, "ssyr-A", !0)),
        (b = F(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let h = D(r, c.getBindGroupLayout(0), [p, w, b]),
        x = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: _ } = j(r, c, h, x),
        A = l ? null : E(r, v, w);
      I(r, v);
      let G = await M(_);
      if (l) return G !== void 0 ? { gpuTimeMs: G } : {};
      let B = await S(A, Float32Array);
      return G !== void 0 ? { A: B, gpuTimeMs: G } : { A: B };
    } finally {
      (!f && p && m(p), !l && w && m(w), b && m(b));
    }
  }
  async function _a(r, t, e, a, o, i, s, u, n = "row-major") {
    let f = o instanceof L,
      l = s instanceof $;
    if ((H(r), C(r, "dsyr", { A: s, x: o }), t !== "lower" && t !== "upper"))
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
    if (!f && !(o instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (f && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (f && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !f)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && f && s._buf === o._buf)
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
    if (o.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let g =
        (l ? s.layout : n) === "column-major" ? t === "upper" : t === "lower",
      p = await k(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr"],
        "dsyr_main",
      ),
      { hi: w, lo: b } = Y(new Float64Array([a])),
      h = null,
      x = null,
      v = null,
      _ = null,
      A = null,
      G = null,
      B = null;
    try {
      if (f) ((h = o._buf), (x = o._loBuf), (v = s._buf), (_ = s._loBuf));
      else {
        let z = Y(o),
          V = Y(s);
        ((h = y(r, z.hi, "dsyr-xHi", !1)),
          (x = y(r, z.lo, "dsyr-xLo", !1)),
          (v = y(r, V.hi, "dsyr-AHi", !0)),
          (_ = y(r, V.lo, "dsyr-ALo", !0)));
      }
      A = F(
        r,
        [
          { value: e, type: "u32" },
          { value: w[0], type: "f32" },
          { value: b[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
        ],
        "dsyr-params",
      );
      let N = D(r, p.getBindGroupLayout(0), [h, x, v, _, A]),
        R = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: P, ts: q } = j(r, p, N, R);
      ((G = l ? null : E(r, P, v)), (B = l ? null : E(r, P, _)), I(r, P));
      let T = await M(q);
      if (l) return T !== void 0 ? { gpuTimeMs: T } : {};
      let O = await S(G, Float32Array);
      G = null;
      let K = await S(B, Float32Array);
      B = null;
      let W = ur(O, K);
      return T !== void 0 ? { A: W, gpuTimeMs: T } : { A: W };
    } finally {
      (!f && h && m(h),
        !f && x && m(x),
        !l && v && m(v),
        !l && _ && m(_),
        A && m(A),
        G && m(G),
        B && m(B));
    }
  }
  async function Ba(r, t, e, a, o, i, s, u, n, f, l = "row-major") {
    let d = o instanceof L,
      g = s instanceof L,
      c = n instanceof $;
    if (
      (H(r),
      C(r, "ssyr2", { A: n, x: o, y: s }),
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
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (d !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (d && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !d)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && d && n._buf === o._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && g && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (d && o._buf === s._buf)
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
    if (o.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let w =
        (c ? n.layout : l) === "column-major" ? t === "upper" : t === "lower",
      b = await k(r, "ssyr2"),
      h = null,
      x = null,
      v = null,
      _ = null;
    try {
      ((h = d ? o._buf : y(r, o, "ssyr2-x", !1)),
        (x = g ? s._buf : y(r, s, "ssyr2-y", !1)),
        (v = c ? n._buf : y(r, n, "ssyr2-A", !0)),
        (_ = F(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: u, type: "u32" },
            { value: f, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let A = D(r, b.getBindGroupLayout(0), [h, x, v, _]),
        G = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: B, ts: N } = j(r, b, A, G),
        R = c ? null : E(r, B, v);
      I(r, B);
      let P = await M(N);
      if (c) return P !== void 0 ? { gpuTimeMs: P } : {};
      let q = await S(R, Float32Array);
      return P !== void 0 ? { A: q, gpuTimeMs: P } : { A: q };
    } finally {
      (!d && h && m(h), !g && x && m(x), !c && v && m(v), _ && m(_));
    }
  }
  async function Aa(r, t, e, a, o, i, s, u, n, f, l = "row-major") {
    let d = o instanceof L,
      g = s instanceof L,
      c = n instanceof $;
    if (
      (H(r),
      C(r, "dsyr2", { A: n, x: o, y: s }),
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
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (f < e) throw new Error("lda must be >= n.");
    if (!c && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!d && !(o instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!g && !(s instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (d && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (g && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (d !== g)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (d && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !d)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && d && n._buf === o._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (c && g && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (d && o._buf === s._buf)
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
    if (o.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let w =
        (c ? n.layout : l) === "column-major" ? t === "upper" : t === "lower",
      h = await k(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr2"],
        "dsyr2_main",
      ),
      { hi: x, lo: v } = Y(new Float64Array([a])),
      _ = null,
      A = null,
      G = null,
      B = null,
      N = null,
      R = null,
      P = null,
      q = null,
      T = null;
    try {
      if (d)
        ((_ = o._buf),
          (A = o._loBuf),
          (G = s._buf),
          (B = s._loBuf),
          (N = n._buf),
          (R = n._loBuf));
      else {
        let mr = Y(o),
          ir = Y(s),
          fr = Y(n);
        ((_ = y(r, mr.hi, "dsyr2-xHi", !1)),
          (A = y(r, mr.lo, "dsyr2-xLo", !1)),
          (G = y(r, ir.hi, "dsyr2-yHi", !1)),
          (B = y(r, ir.lo, "dsyr2-yLo", !1)),
          (N = y(r, fr.hi, "dsyr2-AHi", !0)),
          (R = y(r, fr.lo, "dsyr2-ALo", !0)));
      }
      P = F(
        r,
        [
          { value: e, type: "u32" },
          { value: x[0], type: "f32" },
          { value: v[0], type: "f32" },
          { value: i, type: "u32" },
          { value: u, type: "u32" },
          { value: f, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
        ],
        "dsyr2-params",
      );
      let O = D(r, h.getBindGroupLayout(0), [_, A, G, B, N, R, P]),
        K = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: W, ts: z } = j(r, h, O, K);
      ((q = c ? null : E(r, W, N)), (T = c ? null : E(r, W, R)), I(r, W));
      let V = await M(z);
      if (c) return V !== void 0 ? { gpuTimeMs: V } : {};
      let X = await S(q, Float32Array);
      q = null;
      let Q = await S(T, Float32Array);
      T = null;
      let J = ur(X, Q);
      return V !== void 0 ? { A: J, gpuTimeMs: V } : { A: J };
    } finally {
      (!d && _ && m(_),
        !d && A && m(A),
        !g && G && m(G),
        !g && B && m(B),
        !c && N && m(N),
        !c && R && m(R),
        P && m(P),
        q && m(q),
        T && m(T));
    }
  }
  async function Sa(r, t, e, a, o, i, s, u, n, f, l, d, g = "row-major") {
    let c = i instanceof $,
      p = u instanceof L,
      w = l instanceof L;
    if (
      (H(r),
      C(r, "dgemv", { A: i, x: u, y: l }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof f != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(f)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(f)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(a) ||
      !Number.isInteger(n) ||
      !Number.isInteger(d) ||
      !Number.isInteger(s)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || d <= 0) throw new Error("incx and incy must be positive.");
    if (!c && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!p && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!w && !(l instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (p && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (w && l.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (p !== w)
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
    if (c && w && i._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return w ? {} : { y: l };
    (c ? i.layout : g) === "column-major" &&
      (([e, a] = [a, e]),
      (t = t === "no-transpose" ? "transpose" : "no-transpose"));
    let h = t === "no-transpose",
      x = h ? a : e,
      v = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (v - 1) * d + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let _ = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      A = h ? "dgemv_n" : "dgemv_t",
      G = h ? "dgemv_n_main" : "dgemv_t_main",
      B = await k(r, [..._, A], G),
      { hi: N, lo: R } = Y(new Float64Array([o])),
      { hi: P, lo: q } = Y(new Float64Array([f])),
      T = null,
      O = null,
      K = null,
      W = null,
      z = null,
      V = null,
      X = null,
      Q = null,
      J = null;
    try {
      if (c) ((T = i._buf), (O = i._loBuf));
      else {
        let lr = Y(i);
        ((T = y(r, lr.hi, "dgemv-AHi", !1)),
          (O = y(r, lr.lo, "dgemv-ALo", !1)));
      }
      if (p) ((K = u._buf), (W = u._loBuf));
      else {
        let lr = Y(u);
        ((K = y(r, lr.hi, "dgemv-xHi", !1)),
          (W = y(r, lr.lo, "dgemv-xLo", !1)));
      }
      if (w) ((z = l._buf), (V = l._loBuf));
      else {
        let lr = Y(l);
        ((z = y(r, lr.hi, "dgemv-yHi", !0)),
          (V = y(r, lr.lo, "dgemv-yLo", !0)));
      }
      X = F(
        r,
        [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
          { value: N[0], type: "f32" },
          { value: R[0], type: "f32" },
          { value: P[0], type: "f32" },
          { value: q[0], type: "f32" },
          { value: n, type: "u32" },
          { value: d, type: "u32" },
          { value: s, type: "u32" },
        ],
        "dgemv-params",
      );
      let mr = D(r, B.getBindGroupLayout(0), [T, O, K, W, z, V, X]),
        ir = h
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : Yr(r, "dgemv", v),
        { commandEncoder: fr, ts: or } = j(r, B, mr, ir);
      ((Q = w ? null : E(r, fr, z)), (J = w ? null : E(r, fr, V)), I(r, fr));
      let rr = await M(or);
      if (w) return rr !== void 0 ? { gpuTimeMs: rr } : {};
      let er = await S(Q, Float32Array);
      Q = null;
      let ar = await S(J, Float32Array);
      J = null;
      let sr = ur(er, ar);
      return rr !== void 0 ? { y: sr, gpuTimeMs: rr } : { y: sr };
    } finally {
      (!c && T && m(T),
        !c && O && m(O),
        !p && K && m(K),
        !p && W && m(W),
        !w && z && m(z),
        !w && V && m(V),
        X && m(X),
        Q && m(Q),
        J && m(J));
    }
  }
  async function Ga(r, t, e, a, o, i, s, u, n, f, l, d, g, c, p = "row-major") {
    let w = u instanceof $,
      b = f instanceof $,
      h = g instanceof $;
    if (
      (H(r),
      C(r, "sgemm", { A: u, B: f, C: g }),
      t !== "no-transpose" && t !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof d != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(d)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(d)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(o) ||
      !Number.isInteger(i) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(f instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(g instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((w || b) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!w || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || o < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || l <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || o === 0) return h ? {} : { C: g };
    let x = w ? u.layout : p,
      v = b ? f.layout : p,
      _ = h ? g.layout : p,
      A = x === "column-major" ? i : a,
      G = x === "column-major" ? a : i,
      B = t === "no-transpose" ? A : G,
      N = t === "no-transpose" ? G : A;
    if (n < N)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (n !== u.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ar, sr] = t === "no-transpose" ? [a, i] : [i, a];
      if (u.rows < ar || u.cols < sr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (u.length < (B - 1) * n + N)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let R = v === "column-major" ? o : i,
      P = v === "column-major" ? i : o,
      q = e === "no-transpose" ? R : P,
      T = e === "no-transpose" ? P : R;
    if (l < T)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (l !== f.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ar, sr] = e === "no-transpose" ? [i, o] : [o, i];
      if (f.rows < ar || f.cols < sr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (f.length < (q - 1) * l + T)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let O = _ === "column-major" ? o : a,
      K = _ === "column-major" ? a : o;
    if (c < K)
      throw new Error(
        `ldc must be >= ${_ === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (c !== g.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (g.rows < a || g.cols < o)
        throw new Error("C is too small for the given m and n.");
    } else if (g.length < (O - 1) * c + K)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (t = t === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (([u, f] = [f, u]),
        ([w, b] = [b, w]),
        ([n, l] = [l, n]),
        ([t, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          t === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, o] = [o, a])));
    let W = Math.ceil(o / 64),
      z = Math.ceil(a / 64),
      V = W * z >= 36,
      X = await k(r, V ? "sgemm_large" : "sgemm_small"),
      Q = w ? u._buf : y(r, u, "sgemm-A", !1),
      J = b ? f._buf : y(r, f, "sgemm-B", !1),
      mr = h ? g._buf : y(r, g, "sgemm-C", !0),
      ir = t === "no-transpose",
      fr = e === "no-transpose",
      or = ir && Ee(Q, n, a, i),
      rr = Ee(J, l, fr ? i : o, fr ? o : i),
      er = F(
        r,
        [
          { value: a, type: "u32" },
          { value: o, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "f32" },
          { value: d, type: "f32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: c, type: "u32" },
          { value: t === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: or ? 1 : 0, type: "u32" },
          { value: rr ? 1 : 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let ar = D(r, X.getBindGroupLayout(0), [
          Q,
          Sr(r, Q),
          J,
          Sr(r, J),
          mr,
          er,
        ]),
        sr = V
          ? { x: Z(r, W, "sgemm", "x"), y: Z(r, z, "sgemm", "y") }
          : {
              x: Z(r, Math.ceil(o / 32), "sgemm", "x"),
              y: Z(r, Math.ceil(a / 32), "sgemm", "y"),
            },
        { commandEncoder: lr, ts: br } = j(r, X, ar, sr),
        pr = h ? null : E(r, lr, mr);
      I(r, lr);
      let cr = await M(br);
      if (h) return cr !== void 0 ? { gpuTimeMs: cr } : {};
      let yr = await S(pr, Float32Array);
      return cr !== void 0 ? { C: yr, gpuTimeMs: cr } : { C: yr };
    } finally {
      (w || m(Q), b || m(J), h || m(mr), m(er));
    }
  }
  async function Ea(
    r,
    t,
    e,
    a,
    o,
    i,
    s,
    u,
    n,
    f,
    l,
    d,
    g,
    c,
    p,
    w = "row-major",
  ) {
    let b = n instanceof $,
      h = l instanceof $,
      x = c instanceof $;
    if (
      (H(r),
      C(r, "sgemmtr", { A: n, B: l, C: c }),
      t !== "lower" && t !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (typeof g != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(g)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(g)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(d) ||
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!b && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!x && !(c instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((b || h) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!b || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (f <= 0 || d <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0 || i === 0) return x ? {} : { C: c };
    let v = b ? n.layout : w,
      _ = h ? l.layout : w,
      A = x ? c.layout : w,
      G = v === "column-major" ? s : o,
      B = v === "column-major" ? o : s,
      N = e === "no-transpose" ? G : B,
      R = e === "no-transpose" ? B : G;
    if (f < R)
      throw new Error(
        `lda must be >= ${v === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (b) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [or, rr] = e === "no-transpose" ? [o, s] : [s, o];
      if (n.rows < or || n.cols < rr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (N - 1) * f + R)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let P = _ === "column-major" ? i : s,
      q = _ === "column-major" ? s : i,
      T = a === "no-transpose" ? P : q,
      O = a === "no-transpose" ? q : P;
    if (d < O)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (d !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [or, rr] = a === "no-transpose" ? [s, i] : [i, s];
      if (l.rows < or || l.cols < rr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (T - 1) * d + O)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let K = A === "column-major" ? i : o,
      W = A === "column-major" ? o : i;
    if (p < W)
      throw new Error(
        `ldc must be >= ${A === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (p !== c.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (c.rows < o || c.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (c.length < (K - 1) * p + W)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (v === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      A === "column-major" &&
        (([n, l] = [l, n]),
        ([b, h] = [h, b]),
        ([f, d] = [d, f]),
        ([e, a] = [
          a === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([o, i] = [i, o]),
        (t = t === "lower" ? "upper" : "lower")));
    let z = Math.ceil(i / 64),
      V = Math.ceil(o / 64),
      X = z * V >= 36,
      Q = await k(r, X ? "sgemmtr_large" : "sgemmtr_small"),
      J = b ? n._buf : y(r, n, "sgemmtr-A", !1),
      mr = h ? l._buf : y(r, l, "sgemmtr-B", !1),
      ir = x ? c._buf : y(r, c, "sgemmtr-C", !0),
      fr = F(
        r,
        [
          { value: o, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: u, type: "f32" },
          { value: g, type: "f32" },
          { value: f, type: "u32" },
          { value: d, type: "u32" },
          { value: p, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: t === "upper" ? 1 : 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let or = D(r, Q.getBindGroupLayout(0), [J, mr, ir, fr]),
        rr = X
          ? { x: Z(r, z, "sgemmtr", "x"), y: Z(r, V, "sgemmtr", "y") }
          : {
              x: Z(r, Math.ceil(i / 32), "sgemmtr", "x"),
              y: Z(r, Math.ceil(o / 32), "sgemmtr", "y"),
            },
        { commandEncoder: er, ts: ar } = j(r, Q, or, rr),
        sr = x ? null : E(r, er, ir);
      I(r, er);
      let lr = await M(ar);
      if (x) return lr !== void 0 ? { gpuTimeMs: lr } : {};
      let br = await S(sr, Float32Array);
      return lr !== void 0 ? { C: br, gpuTimeMs: lr } : { C: br };
    } finally {
      (b || m(J), h || m(mr), x || m(ir), m(fr));
    }
  }
  async function Da(r, t, e, a, o, i, s, u, n, f, l, d = "row-major") {
    let g = s instanceof $,
      c = f instanceof $;
    if ((H(r), C(r, "ssyrk", { A: s, C: f }), t !== "lower" && t !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(o) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!g && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(f instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (g && !c)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (c && !g)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || o < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || l <= 0) throw new Error("lda and ldc must be positive.");
    if (a === 0) return c ? {} : { C: f };
    let p = g ? s.layout : d,
      w = c ? f.layout : d,
      b = p === "column-major" ? o : a,
      h = p === "column-major" ? a : o,
      x = e === "no-transpose" ? b : h,
      v = e === "no-transpose" ? h : b;
    if (u < v)
      throw new Error(
        `lda must be >= ${p === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [W, z] = e === "no-transpose" ? [a, o] : [o, a];
      if (s.rows < W || s.cols < z)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (x - 1) * u + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (l < a) throw new Error("ldc must be >= n.");
    if (c) {
      if (l !== f.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (f.rows < a || f.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (f.length < (a - 1) * l + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let _ = e;
    p === "column-major" &&
      (_ = _ === "no-transpose" ? "transpose" : "no-transpose");
    let A = _ === "no-transpose" ? "transpose" : "no-transpose",
      G = t;
    w === "column-major" &&
      (([_, A] = [
        A === "no-transpose" ? "transpose" : "no-transpose",
        _ === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (G = G === "lower" ? "upper" : "lower"));
    let B = Math.ceil(a / 64),
      N = Math.ceil(a / 64),
      R = B * N >= 36,
      P = await k(r, R ? "sgemmtr_large" : "sgemmtr_small"),
      q = g ? s._buf : y(r, s, "ssyrk-A", !1),
      T = c ? f._buf : y(r, f, "ssyrk-C", !0),
      O = g
        ? nr(r, q.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : y(r, s, "ssyrk-B", !1),
      K = F(
        r,
        [
          { value: a, type: "u32" },
          { value: a, type: "u32" },
          { value: o, type: "u32" },
          { value: i, type: "f32" },
          { value: n, type: "f32" },
          { value: u, type: "u32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: _ === "transpose" ? 1 : 0, type: "u32" },
          { value: A === "transpose" ? 1 : 0, type: "u32" },
          { value: G === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let W = D(r, P.getBindGroupLayout(0), [q, O, T, K]),
        z = R
          ? { x: Z(r, B, "ssyrk", "x"), y: Z(r, N, "ssyrk", "y") }
          : {
              x: Z(r, Math.ceil(a / 32), "ssyrk", "x"),
              y: Z(r, Math.ceil(a / 32), "ssyrk", "y"),
            },
        { commandEncoder: V, querySet: X, passDescriptor: Q } = qr(r);
      (g && V.copyBufferToBuffer(q, 0, O, 0, q.size), wr(V, P, W, z, Q));
      let J = Ir(r, V, X),
        mr = c ? null : E(r, V, T);
      I(r, V);
      let ir = await M(J);
      if (c) return ir !== void 0 ? { gpuTimeMs: ir } : {};
      let fr = await S(mr, Float32Array);
      return ir !== void 0 ? { C: fr, gpuTimeMs: ir } : { C: fr };
    } finally {
      (g || m(q), m(O), c || m(T), m(K));
    }
  }
  async function ka(r, t, e, a, o, i, s, u, n, f, l, d, g, c = "row-major") {
    let p = s instanceof $,
      w = n instanceof $,
      b = d instanceof $;
    if (
      (H(r),
      C(r, "ssyr2k", { A: s, B: n, C: d }),
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
      !Number.isInteger(a) ||
      !Number.isInteger(o) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f) ||
      !Number.isInteger(g)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((p || w) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!p || !w))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || o < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || f <= 0 || g <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0) return b ? {} : { C: d };
    let h = p ? s.layout : c,
      x = w ? n.layout : c,
      v = b ? d.layout : c,
      _ = h === "column-major" ? o : a,
      A = h === "column-major" ? a : o,
      G = e === "no-transpose" ? _ : A,
      B = e === "no-transpose" ? A : _;
    if (u < B)
      throw new Error(
        `lda must be >= ${h === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (p) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ar, sr] = e === "no-transpose" ? [a, o] : [o, a];
      if (s.rows < ar || s.cols < sr)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (G - 1) * u + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let N = x === "column-major" ? o : a,
      R = x === "column-major" ? a : o,
      P = e === "no-transpose" ? N : R,
      q = e === "no-transpose" ? R : N;
    if (f < q)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ar, sr] = e === "no-transpose" ? [a, o] : [o, a];
      if (n.rows < ar || n.cols < sr)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (P - 1) * f + q)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (g < a) throw new Error("ldc must be >= n.");
    if (b) {
      if (g !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < a || d.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (a - 1) * g + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let T = e;
    h === "column-major" &&
      (T = T === "no-transpose" ? "transpose" : "no-transpose");
    let O = e;
    x === "column-major" &&
      (O = O === "no-transpose" ? "transpose" : "no-transpose");
    let K = v === "column-major" ? (t === "lower" ? "upper" : "lower") : t,
      W = (ar) => (ar === "no-transpose" ? "transpose" : "no-transpose");
    function z(ar, sr, lr, br, pr, cr) {
      let yr = ar,
        Cr = W(br);
      return v !== "column-major"
        ? { transX: yr, X: sr, ldX: lr, transY: Cr, Y: pr, ldY: cr }
        : { transX: W(Cr), X: pr, ldX: cr, transY: W(yr), Y: sr, ldY: lr };
    }
    let V = Math.ceil(a / 64),
      X = Math.ceil(a / 64),
      Q = V * X >= 36,
      J = await k(r, Q ? "sgemmtr_large" : "sgemmtr_small"),
      mr = Q
        ? { x: Z(r, V, "ssyr2k", "x"), y: Z(r, X, "ssyr2k", "y") }
        : {
            x: Z(r, Math.ceil(a / 32), "ssyr2k", "x"),
            y: Z(r, Math.ceil(a / 32), "ssyr2k", "y"),
          },
      ir = p ? s._buf : y(r, s, "ssyr2k-A", !1),
      fr = w ? n._buf : y(r, n, "ssyr2k-B", !1),
      or = b ? d._buf : y(r, d, "ssyr2k-C", !0),
      rr = null,
      er = null;
    try {
      let ar = z(T, ir, u, O, fr, f),
        sr = z(O, fr, f, T, ir, u),
        lr = (Mr, Ar) =>
          F(
            r,
            [
              { value: a, type: "u32" },
              { value: a, type: "u32" },
              { value: o, type: "u32" },
              { value: i, type: "f32" },
              { value: Ar, type: "f32" },
              { value: Mr.ldX, type: "u32" },
              { value: Mr.ldY, type: "u32" },
              { value: g, type: "u32" },
              { value: Mr.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: Mr.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: K === "upper" ? 1 : 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((rr = lr(ar, l)), (er = lr(sr, 1)));
      let br = D(r, J.getBindGroupLayout(0), [ar.X, ar.Y, or, rr]),
        pr = D(r, J.getBindGroupLayout(0), [sr.X, sr.Y, or, er]),
        { commandEncoder: cr, querySet: yr } = qr(r),
        Cr = yr
          ? { timestampWrites: { querySet: yr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Rr = yr
          ? { timestampWrites: { querySet: yr, endOfPassWriteIndex: 1 } }
          : void 0;
      (wr(cr, J, br, mr, Cr), wr(cr, J, pr, mr, Rr));
      let Fr = Ir(r, cr, yr),
        Er = b ? null : E(r, cr, or);
      I(r, cr);
      let vr = await M(Fr);
      if (b) return vr !== void 0 ? { gpuTimeMs: vr } : {};
      let xr = await S(Er, Float32Array);
      return vr !== void 0 ? { C: xr, gpuTimeMs: vr } : { C: xr };
    } finally {
      (p || m(ir), w || m(fr), b || m(or), rr && m(rr), er && m(er));
    }
  }
  async function La(r, t, e, a, o, i, s, u, n, f, l, d, g, c = "row-major") {
    let p = s instanceof $,
      w = n instanceof $,
      b = d instanceof $;
    if (
      (H(r), C(r, "ssymm", { A: s, B: n, C: d }), t !== "left" && t !== "right")
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
      !Number.isInteger(o) ||
      !Number.isInteger(u) ||
      !Number.isInteger(f) ||
      !Number.isInteger(g)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((p || w) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!p || !w))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || o < 0) throw new Error("m and n must be non-negative.");
    if (a === 0 || o === 0) return b ? {} : { C: d };
    let h = p ? s.layout : c,
      x = w ? n.layout : c,
      v = b ? d.layout : c,
      _ = t === "left" ? a : o;
    if (u < _)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (p) {
      if (u !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (s.rows < _ || s.cols < _)
        throw new Error("A is too small for the given m/n and side.");
    } else if (s.length < (_ - 1) * u + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = x === "column-major" ? o : a,
      G = x === "column-major" ? a : o;
    if (f < G)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (w) {
      if (f !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < a || n.cols < o)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (A - 1) * f + G)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = v === "column-major" ? o : a,
      N = v === "column-major" ? a : o;
    if (g < N)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (g !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < a || d.cols < o)
        throw new Error("C is too small for the given m and n.");
    } else if (d.length < (B - 1) * g + N)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let R = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      P = x === "column-major" ? "transpose" : "no-transpose",
      q = "no-transpose",
      T = a,
      O = o,
      K = _,
      W = t === "left" ? q : P,
      z = t === "left" ? P : q,
      V = (cr) => (cr === "no-transpose" ? "transpose" : "no-transpose"),
      X = t === "right";
    v === "column-major" &&
      (([W, z] = [V(z), V(W)]), (X = !X), ([T, O] = [O, T]));
    let Q = _,
      J = Math.ceil(O / 64),
      mr = Math.ceil(T / 64),
      ir = J * mr >= 36,
      fr = await k(r, ir ? "sgemm_large" : "sgemm_small"),
      or = await k(r, "symmetrize"),
      rr = ir
        ? { x: Z(r, J, "ssymm", "x"), y: Z(r, mr, "ssymm", "y") }
        : {
            x: Z(r, Math.ceil(O / 32), "ssymm", "x"),
            y: Z(r, Math.ceil(T / 32), "ssymm", "y"),
          },
      er = p ? s._buf : y(r, s, "ssymm-A", !1),
      ar = w ? n._buf : y(r, n, "ssymm-B", !1),
      sr = b ? d._buf : y(r, d, "ssymm-C", !0),
      lr = nr(r, _ * Q * 4, "ssymm-Adense"),
      br = null,
      pr = null;
    try {
      br = F(
        r,
        [
          { value: _, type: "u32" },
          { value: u, type: "u32" },
          { value: Q, type: "u32" },
          { value: R === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let cr = D(r, or.getBindGroupLayout(0), [er, lr, br]),
        yr = X ? ar : lr,
        Cr = X ? f : Q,
        Rr = X ? lr : ar;
      pr = F(
        r,
        [
          { value: T, type: "u32" },
          { value: O, type: "u32" },
          { value: K, type: "u32" },
          { value: i, type: "f32" },
          { value: l, type: "f32" },
          { value: Cr, type: "u32" },
          { value: X ? Q : f, type: "u32" },
          { value: g, type: "u32" },
          { value: W === "transpose" ? 1 : 0, type: "u32" },
          { value: z === "transpose" ? 1 : 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let Er = D(r, fr.getBindGroupLayout(0), [
          yr,
          Sr(r, yr),
          Rr,
          Sr(r, Rr),
          sr,
          pr,
        ]),
        { commandEncoder: vr, querySet: xr } = qr(r),
        Mr = xr
          ? { timestampWrites: { querySet: xr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Ar = xr
          ? { timestampWrites: { querySet: xr, endOfPassWriteIndex: 1 } }
          : void 0;
      (wr(vr, or, cr, { x: Math.ceil(_ / 8), y: Math.ceil(_ / 8) }, Mr),
        wr(vr, fr, Er, rr, Ar));
      let Wr = Ir(r, vr, xr),
        zr = b ? null : E(r, vr, sr);
      I(r, vr);
      let Xr = await M(Wr);
      if (b) return Xr !== void 0 ? { gpuTimeMs: Xr } : {};
      let de = await S(zr, Float32Array);
      return Xr !== void 0 ? { C: de, gpuTimeMs: Xr } : { C: de };
    } finally {
      (p || m(er), w || m(ar), b || m(sr), m(lr), br && m(br), pr && m(pr));
    }
  }
  async function Na(r, t, e, a, o, i, s, u, n, f, l, d, g = "row-major") {
    let c = n instanceof $,
      p = l instanceof $,
      w = o === "unit";
    if ((H(r), C(r, "strmm", { A: n, B: l }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!w && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(d)
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
    let b = c ? n.layout : g,
      h = p ? l.layout : g,
      x = t === "left" ? i : s;
    if (f < x)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * f + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = h === "column-major" ? s : i,
      _ = h === "column-major" ? i : s;
    if (d < _)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (d !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * d + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      G =
        b === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      B = h === "column-major" ? "transpose" : "no-transpose",
      N = "no-transpose",
      R = i,
      P = s,
      q = x,
      T = t === "left" ? N : B,
      O = t === "left" ? B : N,
      K = (br) => (br === "no-transpose" ? "transpose" : "no-transpose"),
      W = t === "right";
    h === "column-major" &&
      (([T, O] = [K(O), K(T)]), (W = !W), ([R, P] = [P, R]));
    let z = x,
      V = Math.ceil(P / 64),
      X = Math.ceil(R / 64),
      Q = V * X >= 36,
      J = await k(r, Q ? "sgemm_large" : "sgemm_small"),
      mr = await k(r, "triangularize"),
      ir = Q
        ? { x: Z(r, V, "strmm", "x"), y: Z(r, X, "strmm", "y") }
        : {
            x: Z(r, Math.ceil(P / 32), "strmm", "x"),
            y: Z(r, Math.ceil(R / 32), "strmm", "y"),
          },
      fr = null,
      or = null,
      rr = null,
      er = null,
      ar = null,
      sr = null,
      lr = !1;
    try {
      ((fr = c ? n._buf : y(r, n, "strmm-A", !1)),
        (or = p ? l._buf : y(r, l, "strmm-B", !0)),
        (rr = nr(r, x * z * 4, "strmm-Adense")),
        (er = nr(
          r,
          v * d * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (ar = F(
          r,
          [
            { value: x, type: "u32" },
            { value: f, type: "u32" },
            { value: z, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: G === "transpose" ? 1 : 0, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let br = D(r, mr.getBindGroupLayout(0), [fr, rr, ar]),
        pr = W ? or : rr,
        cr = W ? d : z,
        yr = W ? rr : or;
      sr = F(
        r,
        [
          { value: R, type: "u32" },
          { value: P, type: "u32" },
          { value: q, type: "u32" },
          { value: u, type: "f32" },
          { value: 0, type: "f32" },
          { value: cr, type: "u32" },
          { value: W ? z : d, type: "u32" },
          { value: d, type: "u32" },
          { value: T === "transpose" ? 1 : 0, type: "u32" },
          { value: O === "transpose" ? 1 : 0, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let Rr = D(r, J.getBindGroupLayout(0), [
          pr,
          Sr(r, pr),
          yr,
          Sr(r, yr),
          er,
          sr,
        ]),
        { commandEncoder: Fr, querySet: Er } = qr(r);
      Fr.copyBufferToBuffer(or, 0, er, 0, Math.min(or.size, er.size));
      let vr = Er
          ? { timestampWrites: { querySet: Er, beginningOfPassWriteIndex: 0 } }
          : void 0,
        xr = Er
          ? { timestampWrites: { querySet: Er, endOfPassWriteIndex: 1 } }
          : void 0;
      (wr(Fr, mr, br, { x: Math.ceil(x / 8), y: Math.ceil(x / 8) }, vr),
        wr(Fr, J, Rr, ir, xr));
      let Mr = Ir(r, Fr, Er),
        Ar = p ? null : E(r, Fr, er);
      I(r, Fr);
      let Wr = await M(Mr);
      if (p)
        return (
          m(l._buf),
          (l._buf = er),
          (lr = !0),
          Wr !== void 0 ? { gpuTimeMs: Wr } : {}
        );
      let zr = await S(Ar, Float32Array);
      return Wr !== void 0 ? { B: zr, gpuTimeMs: Wr } : { B: zr };
    } finally {
      (!c && fr && m(fr),
        !p && or && m(or),
        rr && m(rr),
        er && !lr && m(er),
        ar && m(ar),
        sr && m(sr));
    }
  }
  async function Pa(r, t, e, a, o, i, s, u, n, f, l, d, g = "row-major") {
    let c = n instanceof $,
      p = l instanceof $,
      w = o === "unit";
    if ((H(r), C(r, "strsm", { A: n, B: l }), t !== "left" && t !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!w && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(f) ||
      !Number.isInteger(d)
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
    let b = c ? n.layout : g,
      h = p ? l.layout : g,
      x = t === "left" ? i : s;
    if (f < x)
      throw new Error("lda must be >= " + (t === "left" ? "m" : "n") + ".");
    if (c) {
      if (f !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * f + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let v = h === "column-major" ? s : i,
      _ = h === "column-major" ? i : s;
    if (d < _)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (d !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < i || l.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (v - 1) * d + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let A = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      G =
        b === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      B = t === "left" ? s : i,
      N = t === "left",
      R = (G === "no-transpose") == (A === "lower"),
      P = t === "left" ? R : !R,
      q = [];
    for (let or = 0; or < x; or += 64) q.push(or);
    P || q.reverse();
    let T = q.length,
      O = await k(r, "strsv_invert_block"),
      K = await k(r, "block_transfer"),
      W = await k(r, "sscal"),
      z = null,
      V = null,
      X = null,
      Q = [],
      J = [];
    function mr(or, rr) {
      let er = nr(r, or, rr);
      return (J.push(er), er);
    }
    function ir(or, rr) {
      let er = F(r, or, rr);
      return (Q.push(er), er);
    }
    let fr = (v - 1) * d + _;
    try {
      ((z = c ? n._buf : y(r, n, "strsm-A", !1)),
        (V = p ? l._buf : y(r, l, "strsm-B", !0)),
        (X = nr(r, T * 64 * 64 * 4, "strsm-Ainv")));
      let or = null;
      if (u !== 1 && u !== 0) {
        let Er = ir(
          [
            { value: fr, type: "u32" },
            { value: u, type: "f32" },
            { value: 1, type: "u32" },
          ],
          "strsm-scale-params",
        );
        or = D(r, W.getBindGroupLayout(0), [V, Er]);
      }
      let rr = ir(
          [
            { value: x, type: "u32" },
            { value: f, type: "u32" },
            { value: G === "transpose" ? 1 : 0, type: "u32" },
            { value: A === "upper" ? 1 : 0, type: "u32" },
            { value: w ? 1 : 0, type: "u32" },
          ],
          "strsm-invert-params",
        ),
        er = D(r, O.getBindGroupLayout(0), [z, X, rr]),
        ar = mr(64 * B * 4, "strsm-Bblock"),
        sr = mr(64 * B * 4, "strsm-Xblock"),
        lr = mr(x * 64 * 4, "strsm-Aoff"),
        br = mr(x * B * 4, "strsm-delta"),
        { commandEncoder: pr, querySet: cr } = qr(r);
      if (u === 0) {
        let Er = Math.ceil(_ / 64),
          vr = Math.ceil(v / 64),
          xr = Er * vr >= 36,
          Mr = await k(r, xr ? "sgemm_large" : "sgemm_small"),
          Ar = ir(
            [
              { value: v, type: "u32" },
              { value: _, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "f32" },
              { value: 0, type: "f32" },
              { value: 1, type: "u32" },
              { value: 1, type: "u32" },
              { value: d, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "strsm-zero-params",
          ),
          Wr = D(r, Mr.getBindGroupLayout(0), [
            X,
            Sr(r, X),
            X,
            Sr(r, X),
            V,
            Ar,
          ]),
          zr = xr
            ? { x: Z(r, Er, "strsm", "x"), y: Z(r, vr, "strsm", "y") }
            : {
                x: Z(r, Math.ceil(_ / 32), "strsm", "x"),
                y: Z(r, Math.ceil(v / 32), "strsm", "y"),
              };
        wr(
          pr,
          Mr,
          Wr,
          zr,
          cr
            ? {
                timestampWrites: {
                  querySet: cr,
                  beginningOfPassWriteIndex: 0,
                  endOfPassWriteIndex: 1,
                },
              }
            : void 0,
        );
      } else {
        (or && wr(pr, W, or, gr(r, fr)),
          wr(
            pr,
            O,
            er,
            { x: 64, y: T },
            cr
              ? {
                  timestampWrites: {
                    querySet: cr,
                    beginningOfPassWriteIndex: 0,
                  },
                }
              : void 0,
          ));
        for (let vr = 0; vr < q.length; vr++) {
          let xr = q[vr],
            Mr = Math.min(xr + 64, x),
            Ar = Mr - xr,
            Wr = xr / 64,
            zr = vr === q.length - 1,
            Xr = ir(
              [
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: d, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-B-params",
            ),
            de = D(r, K.getBindGroupLayout(0), [ar, V, Xr]);
          wr(pr, K, de, Yr(r, "strsm", Ar, B));
          {
            let $r = Ar,
              Zr = B,
              _e = Ar,
              ae = Math.ceil(Zr / 64),
              ie = Math.ceil($r / 64),
              se = ae * ie >= 36,
              ne = await k(r, se ? "sgemm_large" : "sgemm_small"),
              Be = ir(
                [
                  { value: $r, type: "u32" },
                  { value: Zr, type: "u32" },
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
              ce = { buffer: X, offset: Wr * 64 * 64 * 4, size: 4096 * 4 },
              Ae = D(r, ne.getBindGroupLayout(0), [
                ce,
                Sr(r, ce),
                ar,
                Sr(r, ar),
                sr,
                Be,
              ]),
              ja = se
                ? { x: Z(r, ae, "strsm", "x"), y: Z(r, ie, "strsm", "y") }
                : {
                    x: Z(r, Math.ceil(Zr / 32), "strsm", "x"),
                    y: Z(r, Math.ceil($r / 32), "strsm", "y"),
                  };
            wr(pr, ne, Ae, ja);
          }
          let me = P ? Mr : 0,
            Ie = P ? x : xr,
            Re = me < Ie,
            Ma = ir(
              [
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: d, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            ),
            Ia = D(r, K.getBindGroupLayout(0), [sr, V, Ma]),
            Ra =
              zr && !Re && cr
                ? { timestampWrites: { querySet: cr, endOfPassWriteIndex: 1 } }
                : void 0;
          if ((wr(pr, K, Ia, Yr(r, "strsm", Ar, B), Ra), !Re)) continue;
          let oe = Ie - me,
            qa = ir(
              [
                { value: me, type: "u32" },
                { value: oe, type: "u32" },
                { value: xr, type: "u32" },
                { value: Ar, type: "u32" },
                { value: f, type: "u32" },
                { value: G === "transpose" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 2, type: "u32" },
              ],
              "strsm-gather-A-params",
            ),
            Ta = D(r, K.getBindGroupLayout(0), [lr, z, qa]);
          wr(pr, K, Ta, Yr(r, "strsm", oe, Ar));
          {
            let $r = oe,
              Zr = B,
              _e = Ar,
              ae = Math.ceil(Zr / 64),
              ie = Math.ceil($r / 64),
              se = ae * ie >= 36,
              ne = await k(r, se ? "sgemm_large" : "sgemm_small"),
              Be = ir(
                [
                  { value: $r, type: "u32" },
                  { value: Zr, type: "u32" },
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
              ce = D(r, ne.getBindGroupLayout(0), [
                lr,
                Sr(r, lr),
                sr,
                Sr(r, sr),
                br,
                Be,
              ]),
              Ae = se
                ? { x: Z(r, ae, "strsm", "x"), y: Z(r, ie, "strsm", "y") }
                : {
                    x: Z(r, Math.ceil(Zr / 32), "strsm", "x"),
                    y: Z(r, Math.ceil($r / 32), "strsm", "y"),
                  };
            wr(pr, ne, ce, Ae);
          }
          let Fa = ir(
              [
                { value: me, type: "u32" },
                { value: oe, type: "u32" },
                { value: 0, type: "u32" },
                { value: B, type: "u32" },
                { value: d, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: N ? 1 : 0, type: "u32" },
                { value: 1, type: "u32" },
              ],
              "strsm-scatter-sub-params",
            ),
            Ha = D(r, K.getBindGroupLayout(0), [br, V, Fa]),
            Ca =
              zr && cr
                ? { timestampWrites: { querySet: cr, endOfPassWriteIndex: 1 } }
                : void 0;
          wr(pr, K, Ha, Yr(r, "strsm", oe, B), Ca);
        }
      }
      let yr = Ir(r, pr, cr),
        Cr = p ? null : E(r, pr, V);
      I(r, pr);
      let Rr = await M(yr);
      if (p) return Rr !== void 0 ? { gpuTimeMs: Rr } : {};
      let Fr = await S(Cr, Float32Array);
      return Rr !== void 0 ? { B: Fr, gpuTimeMs: Rr } : { B: Fr };
    } finally {
      (!c && z && m(z), !p && V && m(V), X && m(X), m(J), m(Q));
    }
  }
  return Ua(ts);
})();
