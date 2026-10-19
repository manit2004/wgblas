var wgblas = (() => {
  var ti = Object.create;
  var he = Object.defineProperty;
  var oi = Object.getOwnPropertyDescriptor;
  var ai = Object.getOwnPropertyNames;
  var ii = Object.getPrototypeOf,
    si = Object.prototype.hasOwnProperty;
  var be = ((r) =>
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
  var J = (r, o, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (o = r((r = 0))), o);
    } catch (a) {
      throw ((e = [a]), a);
    }
  };
  var Re = (r, o) => {
      for (var e in o) he(r, e, { get: o[e], enumerable: !0 });
    },
    He = (r, o, e, a) => {
      if ((o && typeof o == "object") || typeof o == "function")
        for (let t of ai(o))
          !si.call(r, t) &&
            t !== e &&
            he(r, t, {
              get: () => o[t],
              enumerable: !(a = oi(o, t)) || a.enumerable,
            });
      return r;
    };
  var ye = (r, o, e) => (
      (e = r != null ? ti(ii(r)) : {}),
      He(
        o || !r || !r.__esModule
          ? he(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    ni = (r) => He(he({}, "__esModule", { value: !0 }), r);
  var Xe,
    Ye = J(() => {
      Xe = `// sscal: x = alpha * x

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
  var Je,
    $e = J(() => {
      Je = `// cscal: x := alpha * x, complex. x is one interleaved f32 array
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
    Qe = J(() => {
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
    et = J(() => {
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
    ot = J(() => {
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
    it = J(() => {
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
    nt = J(() => {
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
  var dt,
    ut = J(() => {
      dt = `// sdot: result = sum(x[i] * y[i])
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
  var Ee,
    ft = J(() => {
      Ee = `// sum reduction: collapses 2*WGS partials into one scalar.
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
    mt = J(() => {
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
  var wt,
    pt = J(() => {
      wt = `// snrm2: result = sqrt(sum(x[i] * x[i])), computed via scaled accumulation
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
    gt = J(() => {
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
    bt = J(() => {
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
    xt = J(() => {
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
  var Pr,
    Bt = J(() => {
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
  var Be,
    _t = J(() => {
      Be = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var Tr,
    kt = J(() => {
      Tr = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
// Sized for the largest DD workgroup (dgemm_small, 256 threads).
var<workgroup> dekkerScratch: array<f32, 256>;

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
  var St,
    At = J(() => {
      St = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
  var Ge,
    Et = J(() => {
      Ge = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
    Gt = J(() => {
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
  var Dt,
    Lt = J(() => {
      Dt = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
    Nt = J(() => {
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
    Mt = J(() => {
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
  var Le,
    Rt = J(() => {
      Le = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
    Ht = J(() => {
      Tt = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var jt,
    Ct = J(() => {
      jt = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
  var Ft,
    qt = J(() => {
      Ft = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
    Wt = J(() => {
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
  var Vt,
    Kt = J(() => {
      Vt = `// drot: x = c*x + s*y, y = -s*x + c*y \u2014 double-double (Dekker) f64 emulation
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
  var zt,
    Ut = J(() => {
      zt = `// srotm: applies modified Givens rotation H to vectors x and y.
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
  var Yt,
    Zt = J(() => {
      Yt = `// drotm: applies a modified Givens rotation H to vectors x and y \u2014 double-
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
  var De,
    Xt = J(() => {
      De = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
    $t = J(() => {
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
  var ro,
    Qt = J(() => {
      ro = `// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
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
  var to,
    eo = J(() => {
      to = `// scaledSum reduction (f64, double-double): collapses 2*WGS (scale, ssq) DD
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
  var _e,
    oo = J(() => {
      _e = `// reduce_partials: y[i] = alpha * \u03A3_c partial[c*n + i] + beta * y[i]
// Second pass for the split-row (split-K) Level 2 kernels (strmv_t,
// sgemv_t): they spread one output's dot product across \`chunks\`
// workgroups for memory parallelism, each writing its share to its own
// partial slot (WGSL has no f32 atomics). Reads are coalesced across i.

@group(0) @binding(0) var<storage, read>       partial: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:      u32,
  chunks: u32,
  incy:   u32,
  alpha:  f32,
  beta:   f32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  for (var i = gid.x; i < params.n; i += nwg.x * WGS) {
    var s = 0.0f;
    for (var c = 0u; c < params.chunks; c++) {
      s += partial[c * params.n + i];
    }
    let yi = i * params.incy;
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
    let acc = params.alpha * s;
    y[yi] = select(acc, acc + params.beta * y[yi], params.beta != 0.0);
  }
}
`;
    });
  var io,
    ao = J(() => {
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
    so = J(() => {
      no = `// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
// One thread per column of A (one element of y, length n): at each row j the
// 64 lanes of a workgroup read A[j*lda + col..col+63] \u2014 contiguous, coalesced.
//
// Rows (length m) are split into chunks along wid.y (split-K): with only one
// thread per output, n=4096 is just 4096 threads each walking every row \u2014
// too few memory requests in flight to saturate bandwidth. Each chunk writes
// its share to partial[chunk*n + col] and reduce_partials.wgsl sums them and
// applies alpha/beta. A single chunk (\`direct\` = 1) skips the second pass and
// writes y here instead. Four independent accumulators keep A reads
// pipelined within a thread (ILP=4).

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> out: array<f32>; // y, or partials

struct Params {
  m:         u32,
  n:         u32,
  alpha:     f32,
  beta:      f32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  chunkRows: u32,
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let col = wid.x * WGS + lid.x;
  if (col >= params.n) { return; } // no barriers below, so an early exit is safe

  let jStart = wid.y * params.chunkRows;
  let jEnd = min(jStart + params.chunkRows, params.m);

  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;
  var j = jStart;
  while (j + 3u < jEnd) {
    acc0 += A[ j       * params.lda + col] * x[ j       * params.incx];
    acc1 += A[(j + 1u) * params.lda + col] * x[(j + 1u) * params.incx];
    acc2 += A[(j + 2u) * params.lda + col] * x[(j + 2u) * params.incx];
    acc3 += A[(j + 3u) * params.lda + col] * x[(j + 3u) * params.incx];
    j += 4u;
  }
  while (j < jEnd) {
    acc0 += A[j * params.lda + col] * x[j * params.incx];
    j += 1u;
  }
  let sum = (acc0 + acc1) + (acc2 + acc3);

  if (params.direct == 1u) {
    let yi = col * params.incy;
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
    let acc = params.alpha * sum;
    out[yi] = select(acc, acc + params.beta * out[yi], params.beta != 0.0);
  } else {
    out[wid.y * params.n + col] = sum;
  }
}
`;
    });
  var me,
    lo = J(() => {
      me = `// gather_strided: dst[i] = src[i * inc], i < n
// Packs a strided vector into a contiguous scratch buffer once, so an O(n\xB2)
// Level 2 kernel that re-reads the vector for every row reads it at unit
// stride instead of re-doing the scattered gather n times (see
// util/strided.mjs).

@group(0) @binding(0) var<storage, read>       src: array<f32>;
@group(0) @binding(1) var<storage, read_write> dst: array<f32>;

struct Params {
  n:   u32,
  inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  for (var i = gid.x; i < params.n; i += nwg.x * WGS) {
    dst[i] = src[i * params.inc];
  }
}
`;
    });
  var fo,
    uo = J(() => {
      fo = `// ssymv (pass 1 of 2): y = alpha * A * x + beta * y, A n\xD7n symmetric with only
// its lower (uplo=0) or upper (uplo=1) triangle stored.
//
// Tiled over the stored triangle: one workgroup per TILE\xD7TILE tile, read once
// with coalesced loads into registers, then applied twice \u2014 as tile\xB7x (to the
// tile's rows) and, for off-diagonal tiles, as tile\u1D40\xB7x (to its columns: the
// mirrored half A[j,i] = A[i,j]). So A is read once, half of n\xB2, and never
// through a strided column walk. (The per-row kernel this replaced read all
// n\xB2 elements, the mirrored half lda-strided.)
//
// Several tiles feed the same rows, and WGSL has no f32 atomics, so each
// contribution goes to its own partial slot and reduce_partials.wgsl sums
// them and applies alpha/beta. With p >= q the stored-block pair of a tile:
// the tile adds slot q to block p's rows and slot p to block q's rows (one
// slot only, p, when p == q). Every (block, slot) pair is written exactly
// once, so \`partial\` needs no clearing.
//
// x must be unit-stride (ssymv.mjs packs a strided x first).

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> partial: array<f32>;

struct Params {
  n:         u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  numBlocks: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const TILE: u32 = 32u;
const ROWS_PER_THREAD: u32 = 4u; // TILE / workgroup height (8)

var<workgroup> xr: array<f32, 32>;       // x over the tile's rows
var<workgroup> xc: array<f32, 32>;       // x over the tile's columns
var<workgroup> rowRed: array<f32, 1056>; // TILE x (TILE+1): per-element row products
var<workgroup> rowRed2: array<f32, 256>; // TILE x 8: row partials, 4 columns each
var<workgroup> colRed: array<f32, 256>;  // 8 x TILE: column partials, 4 rows each

@compute @workgroup_size(32, 8)
fn main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(num_workgroups)         nwg: vec3u,
  @builtin(local_invocation_index) tid: u32,
  @builtin(local_invocation_id)    lid: vec3u,
) {
  // Only the stored triangle's tiles are dispatched: linear tile index t over
  // T(T+1)/2 tiles (laid out 2D to stay under the per-dimension limit) \u2192 the
  // block pair (p, q), q <= p, row by row: t = p(p+1)/2 + q.
  let t = wid.y * nwg.x + wid.x;
  if (t >= params.numBlocks * (params.numBlocks + 1u) / 2u) { return; } // whole workgroup: uniform
  var p = u32((sqrt(8.0 * f32(t) + 1.0) - 1.0) * 0.5);
  // f32 sqrt can land one off near a row boundary \u2014 correct it exactly.
  if (p * (p + 1u) / 2u > t) { p -= 1u; }
  if ((p + 1u) * (p + 2u) / 2u <= t) { p += 1u; }
  let q = t - p * (p + 1u) / 2u;

  let n = params.n;
  let lower = params.uplo == 0u;
  let diag = p == q;
  // Stored tile at block (p, q) for lower, (q, p) for upper.
  let rb = select(q, p, lower);
  let cb = select(p, q, lower);
  let r0 = rb * TILE;
  let c0 = cb * TILE;
  let tx = lid.x;
  let ty = lid.y;

  if (ty == 0u) { xr[tx] = select(0.0, x[min(r0 + tx, n - 1u)], r0 + tx < n); }
  if (ty == 1u) { xc[tx] = select(0.0, x[min(c0 + tx, n - 1u)], c0 + tx < n); }
  workgroupBarrier();

  // Each thread loads rows ty, ty+8, ty+16, ty+24 of column tx \u2014 32 lanes per
  // row, so each warp reads one contiguous 128-byte row segment \u2014 and keeps
  // them in registers. A diagonal tile has only one triangle stored: a stored
  // element feeds its own row, a strictly-stored one also feeds its mirror
  // (column) \u2014 the same two sums as an off-diagonal tile, just masked.
  var colPart = 0.0f;
  for (var k = 0u; k < ROWS_PER_THREAD; k++) {
    let r = ty + 8u * k;
    let gr = r0 + r;
    let gc = c0 + tx;
    let a = select(0.0, A[min(gr, n - 1u) * params.lda + min(gc, n - 1u)], gr < n && gc < n);
    let stored = !diag || select(tx >= r, tx <= r, lower);
    let strict = !diag || select(tx > r, tx < r, lower);
    rowRed[r * (TILE + 1u) + tx] = select(0.0, a, stored) * xc[tx];
    colPart += select(0.0, a, strict) * xr[r];
  }
  colRed[ty * TILE + tx] = colPart;
  workgroupBarrier();

  // Row sums: 8 lanes per row each add 4 columns, then one lane adds the 8.
  let row = tid / 8u;
  let seg = tid % 8u;
  let base = row * (TILE + 1u) + seg * 4u;
  rowRed2[row * 8u + seg] = (rowRed[base] + rowRed[base + 1u]) + (rowRed[base + 2u] + rowRed[base + 3u]);
  workgroupBarrier();

  if (ty == 0u) {
    var rs = 0.0f;
    var cs = 0.0f;
    for (var k = 0u; k < 8u; k++) {
      rs += rowRed2[tx * 8u + k];
      cs += colRed[k * TILE + tx];
    }
    if (diag) {
      // Both sums land on the same rows (and slot) for a diagonal tile.
      if (r0 + tx < n) { partial[p * n + r0 + tx] = rs + cs; }
    } else {
      // tile \xB7 x \u2192 the tile's rows (block rb), slot cb
      if (r0 + tx < n) { partial[cb * n + r0 + tx] = rs; }
      // tile\u1D40 \xB7 x \u2192 the tile's columns (block cb), slot rb
      if (c0 + tx < n) { partial[rb * n + c0 + tx] = cs; }
    }
  }
}
`;
    });
  var co,
    mo = J(() => {
      co = `// strmv: y = A * x \u2014 strmv's no-transpose path (transpose runs strmv_t.wgsl).
// A is n\xD7n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
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
  trans: u32,  // unused \u2014 always 0 here; kept so the Params layout is unchanged
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;
const ALIGN_MASK: u32 = ~31u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var i = wgid.x; i < params.n; i += nwg.x) {
    var acc = 0.0f;

    // y[i] = \u03A3_j A[i,j] * x[j] over the stored range: lower j <= i, upper j >= i.
    // Walked in aligned absolute indices \u2014 see ssyr.wgsl for why.
    let row_base = i * params.lda;
    let first = row_base + select(i, 0u, params.uplo == 0u);
    let last = row_base + select(params.n, i + 1u, params.uplo == 0u);
    for (var idx = (first & ALIGN_MASK) + lid.x; idx < last; idx += WGS) {
      if (idx >= first) {
        let j = idx - row_base;
        // unit diagonal: use 1 instead of A's actual diagonal value
        let aVal = select(A[idx], 1.0, params.diag == 1u && j == i);
        acc += aVal * x[j * params.incx];
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
  var wo,
    po = J(() => {
      wo = `// strmv_t: y = A^T * x for triangular A \u2014 strmv's transpose path, in the
// kernel's row-major frame (strmv.mjs has already folded layout into
// uplo/trans). y[i] = \u03A3_j A[j,i] * x[j] over the stored range: j >= i for
// lower, j <= i for upper.
//
// One thread per output i (a column of A), so at each step j the 64 lanes
// of a workgroup read A[j*lda + i..i+63] \u2014 contiguous, coalesced. strmv.wgsl
// used one workgroup per i with lanes walking j, which strided every lane by
// lda (one memory transaction per element).
//
// Rows are split into chunks along wid.y (split-K) so there are enough
// workgroups in flight to saturate memory; each chunk writes its share to
// partial[chunk*n + i] and reduce_partials.wgsl sums them. With a single
// chunk (\`direct\` = 1) the result goes straight to y and no second pass runs.
//
// Lanes outside a column's stored range (or past n) keep loading \u2014 their
// term is selected to 0 \u2014 so the warp stays converged and coalesced.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> out: array<f32>; // y, or partials

struct Params {
  n:         u32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  diag:      u32,  // 0 = non-unit, 1 = unit
  chunkRows: u32,
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;

fn term(j: u32, i: u32, ic: u32, iOK: bool) -> f32 {
  let inRange = select(j <= i, j >= i, params.uplo == 0u);
  var a = A[j * params.lda + ic];
  if (params.diag == 1u && j == i) { a = 1.0; }
  return select(0.0, a * x[j * params.incx], inRange && iOK);
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let tileStart = wid.x * WGS;
  let i = tileStart + lid.x;
  let iOK = i < params.n;
  let ic = min(i, params.n - 1u); // in-bounds column for masked lanes

  // Rows this chunk covers, narrowed to what any column in the tile can use.
  let chunkStart = wid.y * params.chunkRows;
  var jStart = chunkStart;
  var jEnd = min(chunkStart + params.chunkRows, params.n);
  if (params.uplo == 0u) {
    jStart = max(jStart, tileStart);
  } else {
    jEnd = min(jEnd, tileStart + WGS);
  }

  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var j = jStart;
  while (j + 3u < jEnd) {
    acc0 += term(j,      i, ic, iOK);
    acc1 += term(j + 1u, i, ic, iOK);
    acc2 += term(j + 2u, i, ic, iOK);
    acc3 += term(j + 3u, i, ic, iOK);
    j += 4u;
  }
  while (j < jEnd) {
    acc0 += term(j, i, ic, iOK);
    j += 1u;
  }

  if (iOK) {
    let acc = (acc0 + acc1) + (acc2 + acc3);
    if (params.direct == 1u) {
      out[i * params.incy] = acc;
    } else {
      out[wid.y * params.n + i] = acc;
    }
  }
}
`;
    });
  var Ne,
    go = J(() => {
      Ne = `// strsv_invert_block: computes the explicit inverse of every BLOCK_SIZE \xD7
// BLOCK_SIZE diagonal block of op(A), one workgroup per block (dispatch
// x = numBlocks), writing each to a dense COLUMN-major scratch region of
// Ainv (inv[r][c] at c*64 + r) \u2014 strsv_step.wgsl's matvec then reads each
// column coalesced across its lanes.
// Shared by strsv and strsm.
//
// Blocked inversion inside the workgroup, LAPACK trtri-style. The block is
// staged once into workgroup memory as a LOWER triangle L (an effectively-
// upper block U is reversed into one: J\xB7U\xB7J is lower and inv(U) = J\xB7inv(L)\xB7J),
// then:
//   1. the four 16\xD716 diagonal sub-blocks are inverted by column
//      substitution, one thread per column \u2014 serial chains of \u2264 16 rows;
//   2. the off-diagonal sub-blocks follow by distance d from the diagonal,
//      all blocks at one distance in parallel:
//        inv(L)_ij = -inv(L)_ii \xB7 \u03A3_{k=j}^{i-1} L_ik \xB7 inv(L)_kj.
// (The version this replaced had each thread solve a whole 64-row column
// serially \u2014 ~2000 dependent FMAs per thread, ~85 \xB5s even for one block.)
//
// Workgroup memory holds exactly one 64\xD764 block (16 KB, the WebGPU default
// limit), so inv(L) is built in place: its strict lower part goes into the
// unused upper half of \`blk\`, transposed (inv(L)[r][c] at blk(c, r)), and
// its diagonal overwrites L's once step 1 no longer needs it. Indices are
// XOR-swizzled (see \`at\`) so both row and column walks are conflict-free.
//
// Every row of a column is written, the structural zeros as literal 0 \u2014
// strsv_step.wgsl's and strsm's dense matvecs depend on that.

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

const BLOCK_SIZE: u32 = 64u;
const SUB: u32 = 16u;          // diagonal sub-block size
const NUM_THREADS: u32 = 256u;
var<workgroup> blk: array<f32, 4096>;

// Element (r, c) of the 64\xD764 block. Column c is XOR-swizzled by the row so
// a warp walking down a column hits 32 distinct banks, not one.
fn at(r: u32, c: u32) -> u32 {
  return r * BLOCK_SIZE + (c ^ (r & 31u));
}

// inv(L)[r][c] for r >= c, from where it's built in place.
fn linv(r: u32, c: u32) -> f32 {
  return select(blk[at(c, r)], blk[at(r, r)], r == c);
}

// \u03A3_{k in [k0,k1)} blk(r1, k) \xB7 blk(r2, k) \u2014 two row walks. Four independent
// accumulators so the workgroup-memory loads overlap instead of forming one
// serial latency chain (every dot here sits on a dependency chain).
fn rowRowDot(r1: u32, r2: u32, k0: u32, k1: u32) -> f32 {
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  var k = k0;
  while (k + 3u < k1) {
    a0 += blk[at(r1, k)]      * blk[at(r2, k)];
    a1 += blk[at(r1, k + 1u)] * blk[at(r2, k + 1u)];
    a2 += blk[at(r1, k + 2u)] * blk[at(r2, k + 2u)];
    a3 += blk[at(r1, k + 3u)] * blk[at(r2, k + 3u)];
    k += 4u;
  }
  while (k < k1) {
    a0 += blk[at(r1, k)] * blk[at(r2, k)];
    k += 1u;
  }
  return (a0 + a1) + (a2 + a3);
}

// \u03A3_{k in [k0,k1)} blk(k, c) \xB7 blk(r, k) \u2014 a column walk against a row walk.
fn colRowDot(c: u32, r: u32, k0: u32, k1: u32) -> f32 {
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  var k = k0;
  while (k + 3u < k1) {
    a0 += blk[at(k, c)]      * blk[at(r, k)];
    a1 += blk[at(k + 1u, c)] * blk[at(r, k + 1u)];
    a2 += blk[at(k + 2u, c)] * blk[at(r, k + 2u)];
    a3 += blk[at(k + 3u, c)] * blk[at(r, k + 3u)];
    k += 4u;
  }
  while (k < k1) {
    a0 += blk[at(k, c)] * blk[at(r, k)];
    k += 1u;
  }
  return (a0 + a1) + (a2 + a3);
}

@compute @workgroup_size(256)
fn strsv_invert_block_main(
  @builtin(workgroup_id)          wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockIndex = wid.x;
  let blockStart = blockIndex * BLOCK_SIZE;
  let blockLen = min(blockStart + BLOCK_SIZE, params.n) - blockStart;
  let forward = (params.trans == 0u) == (params.uplo == 0u);
  let unit = params.diag == 1u;
  // Sub-blocks a partial last block actually touches \u2014 the rest is padding
  // nothing reads. Uniform (workgroup id + params), so barriers stay legal.
  let numSub = (blockLen + SUB - 1u) / SUB;

  // Stage op(A_block) as L. Reads walk stored rows (coalesced); transpose
  // and reversal are applied on the workgroup-memory side. Rows/cols past a
  // partial block stay zero with a unit diagonal, keeping L invertible \u2014
  // they only ever feed padding entries, which are never written out.
  // All 16 of a thread's loads are issued before any store, so they overlap
  // instead of each waiting out a full global-memory round trip.
  const PER_THREAD: u32 = BLOCK_SIZE * BLOCK_SIZE / NUM_THREADS; // 16
  var vals: array<f32, PER_THREAD>;
  for (var u = 0u; u < PER_THREAD; u++) {
    let e = tid + u * NUM_THREADS;
    let sr = min(e / BLOCK_SIZE, blockLen - 1u);
    let sc = min(e % BLOCK_SIZE, blockLen - 1u);
    vals[u] = A[(blockStart + sr) * params.lda + blockStart + sc];
  }
  for (var u = 0u; u < PER_THREAD; u++) {
    let e = tid + u * NUM_THREADS;
    let sr = e / BLOCK_SIZE;
    let sc = e % BLOCK_SIZE;
    if (sr < blockLen && sc < blockLen) {
      let R = select(sr, sc, params.trans != 0u);
      let C = select(sc, sr, params.trans != 0u);
      let r = select(blockLen - 1u - R, R, forward);
      let c = select(blockLen - 1u - C, C, forward);
      // The diagonal is stored as its reciprocal: that is inv(L)'s diagonal
      // outright, and step 1 multiplies by it instead of dividing.
      let v = vals[u];
      blk[at(r, c)] = select(v, select(1.0 / v, 1.0, unit), r == c);
    }
  }
  if (tid >= blockLen && tid < BLOCK_SIZE) { blk[at(tid, tid)] = 1.0; }
  workgroupBarrier();

  // 1) Diagonal sub-blocks, one thread per column (global column gc, its
  // sub-block starting at o). x_r for r > c goes to its in-place slot
  // blk(gc, gr) \u2014 strictly upper, which nothing else reads during this step
  // \u2014 and is read back from there; the diagonal (1/L_cc) is already final.
  if (tid < numSub * SUB) {
    let gc = tid;
    let o = (tid / SUB) * SUB;
    let dinv = blk[at(gc, gc)];
    for (var gr = gc + 1u; gr < o + SUB; gr++) {
      let s = -blk[at(gr, gc)] * dinv - rowRowDot(gr, gc, gc + 1u, gr);
      blk[at(gc, gr)] = s * blk[at(gr, gr)];
    }
  }
  workgroupBarrier();

  // 2) Off-diagonal sub-blocks (i, j = i - d), one distance at a time.
  // Thread e owns element (q, c) of block j: q fastest, so a warp walks
  // L's rows and the in-place slots down columns (conflict-free via \`at\`).
  for (var d = 1u; d < numSub; d++) {
    let total = (numSub - d) * SUB * SUB;

    // T := \u03A3_g L[row][g] \xB7 inv(L)[g][col] over the already-known blocks
    // (g from col, where inv(L)'s column starts, to block i's first row),
    // parked in inv(L)_ij's own slot until the next phase consumes it.
    for (var e = tid; e < total; e += NUM_THREADS) {
      let j = e / (SUB * SUB);
      let i = j + d;
      let row = i * SUB + e % SUB;
      let col = j * SUB + (e / SUB) % SUB;
      // g = col is inv(L)'s diagonal; past it, inv(L)[g][col] is the row
      // walk blk(col, g).
      blk[at(col, row)] = blk[at(row, col)] * blk[at(col, col)]
        + rowRowDot(row, col, col + 1u, i * SUB);
    }
    workgroupBarrier();

    // inv(L)_ij := -inv(L)_ii \xB7 T \u2014 every thread reads all it needs, then a
    // barrier, then the writes (they overwrite T in place).
    var acc: array<f32, 3>; // total <= 3 * NUM_THREADS
    for (var n = 0u; n < 3u; n++) {
      let e = tid + n * NUM_THREADS;
      if (e < total) {
        let i = e / (SUB * SUB) + d;
        let q = e % SUB;
        let col = (e / (SUB * SUB)) * SUB + (e / SUB) % SUB;
        // inv(L)_ii[q][p] for p < q is blk(i\xB716+p, i\xB716+q) \u2014 a column walk;
        // p = q is the diagonal. T[p] is the row walk blk(col, i\xB716+p).
        let iq = i * SUB + q;
        acc[n] = -(blk[at(iq, iq)] * blk[at(col, iq)]
          + colRowDot(iq, col, i * SUB, iq));
      }
    }
    workgroupBarrier();
    for (var n = 0u; n < 3u; n++) {
      let e = tid + n * NUM_THREADS;
      if (e < total) {
        let i = e / (SUB * SUB) + d;
        let col = (e / (SUB * SUB)) * SUB + (e / SUB) % SUB;
        blk[at(col, i * SUB + e % SUB)] = acc[n];
      }
    }
    workgroupBarrier();
  }

  // Write the block's inverse out column-major (coalesced along R), undoing
  // the reversal for an effectively-upper block; structural zeros included.
  let base = blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  for (var e = tid; e < BLOCK_SIZE * BLOCK_SIZE; e += NUM_THREADS) {
    let R = e % BLOCK_SIZE;
    let C = e / BLOCK_SIZE;
    if (R < blockLen && C < blockLen) {
      let r = select(blockLen - 1u - R, R, forward);
      let c = select(blockLen - 1u - C, C, forward);
      Ainv[base + C * BLOCK_SIZE + R] = select(0.0, linv(r, c), r >= c);
    }
  }
}
`;
    });
  var bo,
    ho = J(() => {
      bo = `// strsv_step: one block of the blocked triangular solve, in a single
// dispatch \u2014 replaces the strsv_apply_inverse + strsv_update pair, halving
// the number of sequential dispatches the solve is limited by.
//
// The old apply pass solved the block (Ainv \xB7 x_block) in one workgroup and
// the update pass then read the solution back from x. Here every workgroup
// solves the block itself (a 64\xD764 matvec against the inverse from
// strsv_invert_block.wgsl), then subtracts its contribution from its own
// tile of TILE_ROWS remaining rows. The solution is written to \`sol\`, not x:
// other workgroups are still reading this block's unsolved values from x in
// the same dispatch. strsv.mjs copies sol into x after the last block.
//
// Workgroup 0 writes \`sol\`; when no rows remain (the last block) a single
// workgroup runs just the solve.
//
// Four threads per row (256 per workgroup, TILE_ROWS rows): each covers 16
// of the block's 64 columns in both the solve and the update, and the four
// partial sums meet in workgroup memory. Every phase is one round of
// independent loads plus one barrier \u2014 with one thread per row, a thread
// walked all 64 columns and the no-transpose update needed four staged
// rounds, and the step's dependency chain set the pace of the whole solve.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       Ainv: array<f32>;
@group(0) @binding(2) var<storage, read_write> x: array<f32>;
@group(0) @binding(3) var<storage, read_write> sol: array<f32>;

struct Params {
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,  // exclusive
  rangeStart: u32,  // first remaining row this block updates
  rowCount:   u32,  // number of remaining rows (0 for the last block)
  presolved:  u32,  // 1 = block already solved into sol (strsm_small.wgsl): update only
}

@group(0) @binding(4) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const TILE_ROWS: u32 = 64u;  // remaining rows per workgroup
const SPLIT: u32 = 4u;       // threads per row
const SPAN: u32 = BLOCK_SIZE / SPLIT; // columns per thread

var<workgroup> xr: array<f32, 64>;          // this block's unsolved x
var<workgroup> xs: array<f32, 64>;          // this block's solution
var<workgroup> part: array<f32, 256>;       // partial sums, [quarter][row]

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockLen = params.blockEnd - params.blockStart;

  if (params.presolved == 1u) {
    // Few-block strsv solves each block by substitution first (in place on
    // x, packed copy in sol); only the update below is left. Uniform branch.
    if (tid < BLOCK_SIZE) {
      xs[tid] = select(0.0, sol[min(params.blockStart + tid, params.blockEnd - 1u)], tid < blockLen);
    }
    workgroupBarrier();
  } else {
    if (tid < BLOCK_SIZE) {
      xr[tid] = select(0.0, x[min(params.blockStart + tid, params.blockEnd - 1u) * params.incx], tid < blockLen);
    }
    workgroupBarrier();

    // Solve the block: xs = Ainv \xB7 xr. Thread (r, q) sums columns
    // [q\xB716, q\xB716+16) of row r. Ainv is column-major, so at each column the
    // lanes (consecutive r) read consecutive floats. Rows/cols past blockLen
    // are zero in Ainv (never written; buffers start zeroed) and in xr.
    let r = tid % BLOCK_SIZE;
    let q = tid / BLOCK_SIZE;
    let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE;
    var a0 = 0.0f;
    var a1 = 0.0f;
    var a2 = 0.0f;
    var a3 = 0.0f;
    for (var u = 0u; u < SPAN; u += 4u) {
      let c = q * SPAN + u;
      a0 += Ainv[ainvBase + c * BLOCK_SIZE + r]        * xr[c];
      a1 += Ainv[ainvBase + (c + 1u) * BLOCK_SIZE + r] * xr[c + 1u];
      a2 += Ainv[ainvBase + (c + 2u) * BLOCK_SIZE + r] * xr[c + 2u];
      a3 += Ainv[ainvBase + (c + 3u) * BLOCK_SIZE + r] * xr[c + 3u];
    }
    part[q * BLOCK_SIZE + r] = (a0 + a1) + (a2 + a3);
    workgroupBarrier();
    if (tid < BLOCK_SIZE) {
      let v = (part[tid] + part[BLOCK_SIZE + tid])
        + (part[2u * BLOCK_SIZE + tid] + part[3u * BLOCK_SIZE + tid]);
      xs[tid] = v;
      if (wid.x == 0u && tid < blockLen) { sol[params.blockStart + tid] = v; }
    }
    workgroupBarrier();
  }

  // Update this workgroup's tile of remaining rows: x[i] -= op(A)[i, block] \xB7 xs.
  // rowCount is dispatch-uniform, so the barrier below stays uniform.
  if (params.rowCount == 0u) { return; }
  let lastRow = params.rowCount - 1u;
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  if (params.trans != 0u) {
    // A[j,i]: rows fastest across lanes, so at each j consecutive lanes read
    // consecutive i \u2014 coalesced.
    let r = tid % TILE_ROWS;
    let q = tid / TILE_ROWS;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let col = params.blockStart * params.lda + i;
    for (var u = 0u; u < SPAN; u += 4u) {
      let j = q * SPAN + u;
      a0 += select(0.0, A[col + min(j,      blockLen - 1u) * params.lda], j      < blockLen) * xs[j];
      a1 += select(0.0, A[col + min(j + 1u, blockLen - 1u) * params.lda], j + 1u < blockLen) * xs[j + 1u];
      a2 += select(0.0, A[col + min(j + 2u, blockLen - 1u) * params.lda], j + 2u < blockLen) * xs[j + 2u];
      a3 += select(0.0, A[col + min(j + 3u, blockLen - 1u) * params.lda], j + 3u < blockLen) * xs[j + 3u];
    }
    part[q * TILE_ROWS + r] = (a0 + a1) + (a2 + a3);
  } else {
    // A[i,j]: quarters fastest across lanes, interleaved \u2014 lane q takes
    // columns q, q+4, q+8, \u2026 \u2014 so at each step a row's four lanes read 16
    // contiguous bytes.
    let r = tid / SPLIT;
    let q = tid % SPLIT;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let rowBase = i * params.lda + params.blockStart;
    for (var u = 0u; u < SPAN; u += 4u) {
      let j0 = q + u * SPLIT;
      let j1 = j0 + SPLIT;
      let j2 = j1 + SPLIT;
      let j3 = j2 + SPLIT;
      a0 += select(0.0, A[rowBase + min(j0, blockLen - 1u)], j0 < blockLen) * xs[j0];
      a1 += select(0.0, A[rowBase + min(j1, blockLen - 1u)], j1 < blockLen) * xs[j1];
      a2 += select(0.0, A[rowBase + min(j2, blockLen - 1u)], j2 < blockLen) * xs[j2];
      a3 += select(0.0, A[rowBase + min(j3, blockLen - 1u)], j3 < blockLen) * xs[j3];
    }
    part[q * TILE_ROWS + r] = (a0 + a1) + (a2 + a3);
  }
  workgroupBarrier();
  if (tid < TILE_ROWS) {
    let local = wid.x * TILE_ROWS + tid;
    if (local < params.rowCount) {
      let acc = (part[tid] + part[TILE_ROWS + tid])
        + (part[2u * TILE_ROWS + tid] + part[3u * TILE_ROWS + tid]);
      x[(params.rangeStart + local) * params.incx] -= acc;
    }
  }
}
`;
    });
  var xo,
    yo = J(() => {
      xo = `// scatter_strided: dst[i * inc] = src[i], i < n \u2014 the inverse of
// gather_strided.wgsl. strsv uses it to copy the contiguous solution
// buffer back into a possibly strided x, leaving the stride gaps untouched.

@group(0) @binding(0) var<storage, read>       src: array<f32>;
@group(0) @binding(1) var<storage, read_write> dst: array<f32>;

struct Params {
  n:   u32,
  inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  for (var i = gid.x; i < params.n; i += nwg.x * WGS) {
    dst[i * params.inc] = src[i];
  }
}
`;
    });
  var Pe,
    vo = J(() => {
      Pe = `// strsm_small: the whole triangular solve in one dispatch when the order
// fits one block (n <= 64) \u2014 strsv (one right-hand side) and strsm (many) \u2014
// and each diagonal block of strsm's blocked solve (through offset views).
// No explicit inverse: plain column-oriented substitution, backward stable
// and, at this size, much shorter than the inverse-then-apply chain (which
// is three dependent dispatches plus a 64\xD764 inversion).
//
// Each workgroup solves RHS_PER_WG right-hand sides: thread (i, r) owns row
// i of right-hand side r in a register. Rows go in chunks of CHUNK: the
// chunk's owners publish their (fully updated) values, one barrier, then
// every thread solves the tiny CHUNK\xD7CHUNK diagonal system itself, in
// registers, and folds the whole chunk into its own row \u2014 one barrier per
// chunk instead of per row (each barrier step cost ~0.2 \xB5s, the rows'
// dependency chain dominated).
// An effectively-upper system is reversed into a lower one first (J\xB7U\xB7J,
// as in strsv_invert_block.wgsl), so the loop always runs forward.
//
// op(A) is staged as a column-packed lower triangle, so step j's reads \u2014
// column j, rows below it, one per lane \u2014 are contiguous and conflict-free.
// A and B are addressed through strided views in the solve frame (element
// (i, j) at off + i*rs + j*cs), so strided x, either layout, and either
// side need no gather or scatter.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> B: array<f32>;
// Optional packed copy of the solution (row i of the block at i * xLd): the
// blocked strsm's trailing update reads it, since that dispatch can't bind
// B read-only while it writes B.
@group(0) @binding(3) var<storage, read_write> X: array<f32>;

struct Params {
  n:        u32, // order, <= BLOCK_SIZE
  nrhs:     u32,
  aOff:     u32,
  aRs:      u32,
  aCs:      u32,
  bOff:     u32,
  bRs:      u32,
  bCs:      u32,
  backward: u32, // 1 = effectively upper: solve on the reversed system
  unit:     u32, // 1 = unit diagonal (not read)
  alpha:    f32, // applied as B is read in (alpha = 0 never reaches here)
  xLd:      u32, // 0 = no packed copy
}

@group(0) @binding(2) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const RHS_PER_WG: u32 = 4u;
const NUM_THREADS: u32 = BLOCK_SIZE * RHS_PER_WG; // 256
const CHUNK: u32 = 4u;
const PACKED: u32 = BLOCK_SIZE * (BLOCK_SIZE + 1u) / 2u;

var<workgroup> L: array<f32, PACKED>; // column-packed lower triangle
// Published chunk values per RHS, double-buffered: a chunk's writers can't
// pass the next barrier until every reader of the previous chunk has.
var<workgroup> chunkVals: array<f32, 2u * RHS_PER_WG * CHUNK>;

// Start of column j in the packed triangle: columns 0..j-1 hold 64, 63, ... entries.
fn colStart(j: u32) -> u32 {
  return j * BLOCK_SIZE - j * (j - 1u) / 2u;
}

// Solve-frame index -> original index (identity, or reversed for backward).
fn orig(i: u32) -> u32 {
  return select(i, params.n - 1u - i, params.backward == 1u);
}

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let n = params.n;

  // Stage the lower triangle (diagonal included) of the solve-frame matrix.
  for (var e = tid; e < BLOCK_SIZE * BLOCK_SIZE; e += NUM_THREADS) {
    let i = e % BLOCK_SIZE;
    let j = e / BLOCK_SIZE;
    if (j <= i && i < n) {
      var v = A[params.aOff + orig(i) * params.aRs + orig(j) * params.aCs];
      if (i == j && params.unit == 1u) { v = 1.0; }
      L[colStart(j) + i - j] = v;
    }
  }
  // Rows past n get a unit diagonal, so the last chunk's padding solves
  // cleanly (it only ever feeds other padding rows).
  if (tid >= n && tid < BLOCK_SIZE) { L[colStart(tid)] = 1.0; }

  let i = tid % BLOCK_SIZE;
  let r = tid / BLOCK_SIZE;
  let rhs = wid.x * RHS_PER_WG + r;
  let live = i < n && rhs < params.nrhs;
  let bIdx = params.bOff + orig(min(i, n - 1u)) * params.bRs + rhs * params.bCs;
  var b = 0.0f;
  if (live) { b = params.alpha * B[bIdx]; }
  var xi = 0.0f;
  workgroupBarrier();

  for (var j = 0u; j < n; j += CHUNK) {
    let slot = ((j / CHUNK) % 2u) * RHS_PER_WG * CHUNK + r * CHUNK;
    if (i >= j && i < j + CHUNK) { chunkVals[slot + i - j] = b; }
    workgroupBarrier();
    // The chunk's 4\xD74 forward solve, unrolled so x0..x3 stay in registers.
    let c0 = colStart(j);
    let c1 = colStart(j + 1u);
    let c2 = colStart(j + 2u);
    let c3 = colStart(j + 3u);
    let x0 = chunkVals[slot] / L[c0];
    let x1 = (chunkVals[slot + 1u] - L[c0 + 1u] * x0) / L[c1];
    let x2 = (chunkVals[slot + 2u] - L[c0 + 2u] * x0 - L[c1 + 1u] * x1) / L[c2];
    let x3 = (chunkVals[slot + 3u] - L[c0 + 3u] * x0 - L[c1 + 2u] * x1 - L[c2 + 1u] * x2) / L[c3];
    if (i >= j && i < j + CHUNK) {
      xi = select(select(x3, x2, i == j + 2u), select(x1, x0, i == j), i < j + 2u);
    } else if (i >= j + CHUNK) {
      let d = i - j;
      b = b - L[c0 + d] * x0 - L[c1 + d - 1u] * x1 - L[c2 + d - 2u] * x2 - L[c3 + d - 3u] * x3;
    }
  }

  if (live) {
    B[bIdx] = xi;
    if (params.xLd != 0u) { X[orig(i) * params.xLd + rhs] = xi; }
  }
}
`;
    });
  var _o,
    Bo = J(() => {
      _o = `// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
// Aligned row walk \u2014 see ssyr.wgsl for why. Here it's lda padding that
// knocks row starts off the 128-byte boundary.
const ALIGN_MASK: u32 = ~31u;

fn update(idx: u32, xi: f32, col: u32) {
  A[idx] = xi * y[col * params.incy] + A[idx];
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    let row_base = row * params.lda;

    // 4-unrolled loop: each iteration issues 4 independent A/y accesses,
    // in aligned absolute indices.
    let first = row_base;
    let last = row_base + params.n;
    let aligned = first & ALIGN_MASK;
    let floor4 = aligned + ((last - aligned) / (4u * WGS)) * (4u * WGS);
    for (var base = aligned; base < floor4; base += 4u * WGS) {
      for (var k = 0u; k < 4u; k++) {
        let idx = base + k * WGS + lid.x;
        if (idx >= first) { update(idx, xi, idx - row_base); }
      }
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var idx = floor4 + lid.x; idx < last; idx += WGS) {
      if (idx >= first) { update(idx, xi, idx - row_base); }
    }
  }
}
`;
    });
  var Ao,
    ko = J(() => {
      Ao = `// dger: A := alpha * x * y^T + A, double-double (Dekker) f64 emulation of
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
  var Eo,
    So = J(() => {
      Eo = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
// Rows are walked in absolute index space starting from the row's first
// stored element rounded down to a 128-byte (32-float) boundary, so each
// warp's 32 lanes land in exactly one cache line whatever the row offset
// (upper starts at column \`row\`) or lda padding. Lanes before the true start
// are masked off. Unaligned starts measured ~1.8x slower than aligned ones.
const ALIGN_MASK: u32 = ~31u;

fn update(idx: u32, xi: f32, col: u32) {
  A[idx] = xi * x[col * params.incx] + A[idx];
}

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

    // 4-unrolled loop over the stored range, in aligned absolute indices.
    let first = row_base + colStart;
    let last = row_base + colEnd;
    let aligned = first & ALIGN_MASK;
    let floor4 = aligned + ((last - aligned) / (4u * WGS)) * (4u * WGS);
    for (var base = aligned; base < floor4; base += 4u * WGS) {
      for (var k = 0u; k < 4u; k++) {
        let idx = base + k * WGS + lid.x;
        if (idx >= first) { update(idx, xi, idx - row_base); }
      }
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var idx = floor4 + lid.x; idx < last; idx += WGS) {
      if (idx >= first) { update(idx, xi, idx - row_base); }
    }
  }
}
`;
    });
  var Lo,
    Go = J(() => {
      Lo = `// dsyr: A := alpha * x * x^T + A, double-double (Dekker) f64 emulation of
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
  var No,
    Do = J(() => {
      No = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
// Aligned row walk \u2014 see ssyr.wgsl for why.
const ALIGN_MASK: u32 = ~31u;

fn update(idx: u32, xi: f32, yi: f32, col: u32) {
  A[idx] = xi * y[col * params.incy] + yi * x[col * params.incx] + A[idx];
}

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

    // 4-unrolled loop over the stored range, in aligned absolute indices.
    let first = row_base + colStart;
    let last = row_base + colEnd;
    let aligned = first & ALIGN_MASK;
    let floor4 = aligned + ((last - aligned) / (4u * WGS)) * (4u * WGS);
    for (var base = aligned; base < floor4; base += 4u * WGS) {
      for (var k = 0u; k < 4u; k++) {
        let idx = base + k * WGS + lid.x;
        if (idx >= first) { update(idx, xi, yi, idx - row_base); }
      }
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var idx = floor4 + lid.x; idx < last; idx += WGS) {
      if (idx >= first) { update(idx, xi, yi, idx - row_base); }
    }
  }
}
`;
    });
  var Mo,
    Po = J(() => {
      Mo = `// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
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
  var Ro,
    Io = J(() => {
      Ro = `// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
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
  var To,
    Ho = J(() => {
      To = `// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
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
  var jo,
    Co = J(() => {
      jo = `// dsymv: y := alpha * A * x + beta * y, double-double (Dekker) f64 emulation
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
    qo = J(() => {
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
  var Oo,
    Wo = J(() => {
      Oo = `// dtrsv_invert_block: double-double (Dekker) f64 emulation of
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
  var Vo,
    Ko = J(() => {
      Vo = `// dtrsv_apply_inverse: double-double (Dekker) f64 emulation of
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
  var zo,
    Uo = J(() => {
      zo = `// dtrsv_update: double-double (Dekker) f64 emulation of strsv_update.wgsl \u2014
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
  var Yo,
    Zo = J(() => {
      Yo = `// dgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 double-double (Dekker)
// f64 emulation of sgemm_small.wgsl, same tile config and structure:
// BM=BN=32, BK=8, TM=TN=2, 256 threads. Paired with dgemm_large.wgsl in the
// same two-tier dispatch sgemm uses (see dgemm.mjs).
//
// Two unavoidable differences from sgemm_small.wgsl:
//   1. Only the Hi halves get vec4 views (AHi4/BHi4). Vectorizing Lo too
//      would need 10 storage buffers; maxStorageBuffersPerShaderStage is 8.
//      Lo loads stay scalar, at the same indices the Hi vec4 covers.
//   2. The multiply-accumulate uses ddMulProtected/ddAddProtected, which
//      barrier internally, so every thread runs the same number of them \u2014
//      the final write computes against a clamped in-bounds index and gates
//      only the store (sgemm skips out-of-range rows/cols with an \`if\`).

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

@group(0) @binding(0) var<storage, read>       AHi:  array<f32>;
@group(0) @binding(1) var<storage, read>       AHi4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       ALo:  array<f32>;
@group(0) @binding(3) var<storage, read>       BHi:  array<f32>;
@group(0) @binding(4) var<storage, read>       BHi4: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read>       BLo:  array<f32>;
@group(0) @binding(6) var<storage, read_write> CHi:  array<f32>;
@group(0) @binding(7) var<storage, read_write> CLo:  array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  k:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  lda:     u32,
  ldb:     u32,
  ldc:     u32,
  transA:  u32, // 0 = no-transpose, 1 = transpose
  transB:  u32,
  useVecA: u32, // 1 = AHi's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = BHi's vec4 view covers every in-bounds element
}

@group(0) @binding(8) var<uniform> params: Params;

var<workgroup> AsHi: array<f32, BM * BK>;
var<workgroup> AsLo: array<f32, BM * BK>;
var<workgroup> BsHi: array<f32, BK * BN>;
var<workgroup> BsLo: array<f32, BK * BN>;

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

  var threadResults: array<DD, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = DD(0.0, 0.0);
  }
  var regM: array<DD, TM>;
  var regN: array<DD, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    // \u2500\u2500 Load the BM\xD7BK A tile into As (every branch here is dispatch-uniform) \u2500\u2500
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // spans BM/4\xD7(BK/4) several times over \u2014 guard the store.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      if (r4 < BM) {
        let gRow = blockRow + r4;
        let gCol = t * BK + c4 * 4u;
        let base = gRow * params.lda + gCol;
        let rowOK = gRow < params.m;
        let ok0 = rowOK &&  gCol        < params.k;
        let ok1 = rowOK && (gCol + 1u) < params.k;
        let ok2 = rowOK && (gCol + 2u) < params.k;
        let ok3 = rowOK && (gCol + 3u) < params.k;
        let v = AHi4[base / 4u];
        let dst = r4 * BK + c4 * 4u;
        AsHi[dst]      = select(0.0, v.x, ok0);
        AsHi[dst + 1u] = select(0.0, v.y, ok1);
        AsHi[dst + 2u] = select(0.0, v.z, ok2);
        AsHi[dst + 3u] = select(0.0, v.w, ok3);
        AsLo[dst]      = select(0.0, ALo[base],      ok0);
        AsLo[dst + 1u] = select(0.0, ALo[base + 1u], ok1);
        AsLo[dst + 2u] = select(0.0, ALo[base + 2u], ok2);
        AsLo[dst + 3u] = select(0.0, ALo[base + 3u], ok3);
      }
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. NUM_THREADS over-spans
      // the BK-column tile \u2014 guard the store.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      if (c < BK) {
        let gRow = blockRow + r4 * 4u;
        let gCol = t * BK + c;
        let base = gCol * params.lda + gRow;
        let colOK = gCol < params.k;
        let ok0 = colOK &&  gRow        < params.m;
        let ok1 = colOK && (gRow + 1u) < params.m;
        let ok2 = colOK && (gRow + 2u) < params.m;
        let ok3 = colOK && (gRow + 3u) < params.m;
        let v = AHi4[base / 4u];
        AsHi[(r4 * 4u) * BK + c]      = select(0.0, v.x, ok0);
        AsHi[(r4 * 4u + 1u) * BK + c] = select(0.0, v.y, ok1);
        AsHi[(r4 * 4u + 2u) * BK + c] = select(0.0, v.z, ok2);
        AsHi[(r4 * 4u + 3u) * BK + c] = select(0.0, v.w, ok3);
        AsLo[(r4 * 4u) * BK + c]      = select(0.0, ALo[base],      ok0);
        AsLo[(r4 * 4u + 1u) * BK + c] = select(0.0, ALo[base + 1u], ok1);
        AsLo[(r4 * 4u + 2u) * BK + c] = select(0.0, ALo[base + 2u], ok2);
        AsLo[(r4 * 4u + 3u) * BK + c] = select(0.0, ALo[base + 3u], ok3);
      }
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        let inA = gRowA < params.m && gColA < params.k;
        let dst = (innerRowA + loadOffset) * BK + innerColA;
        AsHi[dst] = select(0.0, AHi[aIdx], inA);
        AsLo[dst] = select(0.0, ALo[aIdx], inA);
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
        let base = gRow * params.ldb + gCol;
        let rowOK = gRow < params.k;
        let ok0 = rowOK &&  gCol        < params.n;
        let ok1 = rowOK && (gCol + 1u) < params.n;
        let ok2 = rowOK && (gCol + 2u) < params.n;
        let ok3 = rowOK && (gCol + 3u) < params.n;
        let v = BHi4[base / 4u];
        let dst = r * BN + c4 * 4u;
        BsHi[dst]      = select(0.0, v.x, ok0);
        BsHi[dst + 1u] = select(0.0, v.y, ok1);
        BsHi[dst + 2u] = select(0.0, v.z, ok2);
        BsHi[dst + 3u] = select(0.0, v.w, ok3);
        BsLo[dst]      = select(0.0, BLo[base],      ok0);
        BsLo[dst + 1u] = select(0.0, BLo[base + 1u], ok1);
        BsLo[dst + 2u] = select(0.0, BLo[base + 2u], ok2);
        BsLo[dst + 3u] = select(0.0, BLo[base + 3u], ok3);
      }
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column, one vec4 per thread \u2014
      // NUM_THREADS over-spans the 32-column tile, so guard the store.
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      if (c < BN) {
        let gRow = t * BK + r4 * 4u;
        let gCol = blockCol + c;
        let base = gCol * params.ldb + gRow;
        let colOK = gCol < params.n;
        let ok0 = colOK &&  gRow        < params.k;
        let ok1 = colOK && (gRow + 1u) < params.k;
        let ok2 = colOK && (gRow + 2u) < params.k;
        let ok3 = colOK && (gRow + 3u) < params.k;
        let v = BHi4[base / 4u];
        BsHi[(r4 * 4u) * BN + c]      = select(0.0, v.x, ok0);
        BsHi[(r4 * 4u + 1u) * BN + c] = select(0.0, v.y, ok1);
        BsHi[(r4 * 4u + 2u) * BN + c] = select(0.0, v.z, ok2);
        BsHi[(r4 * 4u + 3u) * BN + c] = select(0.0, v.w, ok3);
        BsLo[(r4 * 4u) * BN + c]      = select(0.0, BLo[base],      ok0);
        BsLo[(r4 * 4u + 1u) * BN + c] = select(0.0, BLo[base + 1u], ok1);
        BsLo[(r4 * 4u + 2u) * BN + c] = select(0.0, BLo[base + 2u], ok2);
        BsLo[(r4 * 4u + 3u) * BN + c] = select(0.0, BLo[base + 3u], ok3);
      }
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        let inB = gRowB < params.k && gColB < params.n;
        let dst = (innerRowB + loadOffset) * BN + innerColB;
        BsHi[dst] = select(0.0, BHi[bIdx], inB);
        BsLo[dst] = select(0.0, BLo[bIdx], inB);
      }
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        let idx = (threadRow * TM + i) * BK + dotIdx;
        regM[i] = DD(AsHi[idx], AsLo[idx]);
      }
      for (var i = 0u; i < TN; i++) {
        let idx = dotIdx * BN + threadCol * TN + i;
        regN[i] = DD(BsHi[idx], BsLo[idx]);
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          let ri = resIdxM * TN + resIdxN;
          let prod = ddMulProtected(regM[resIdxM], regN[resIdxN], tid);
          threadResults[ri] = ddAddProtected(threadResults[ri], prod, tid);
        }
      }
    }

    workgroupBarrier();
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta = DD(params.betaHi, params.betaLo);
  let betaIsZero = params.betaHi == 0.0 && params.betaLo == 0.0;

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
      let row = blockRow + threadRow * TM + resIdxM;
      let col = blockCol + threadCol * TN + resIdxN;
      let inBounds = row < params.m && col < params.n;
      let cIdx = min(row, params.m - 1u) * params.ldc + min(col, params.n - 1u);

      let acc = ddMulProtected(alpha, threadResults[resIdxM * TN + resIdxN], tid);
      // BLAS beta==0 semantics: C is written, not accumulated \u2014 select rather
      // than multiply so stale NaN/Inf in C can't survive as 0 * NaN.
      let betaTerm = ddMulProtected(beta, DD(CHi[cIdx], CLo[cIdx]), tid);
      let withBeta = ddAddProtected(acc, betaTerm, tid);
      if (inBounds) {
        CHi[cIdx] = select(withBeta.hi, acc.hi, betaIsZero);
        CLo[cIdx] = select(withBeta.lo, acc.lo, betaIsZero);
      }
    }
  }
}
`;
    });
  var $o,
    Xo = J(() => {
      $o = `// dgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 double-double (Dekker)
// f64 emulation of sgemm_large.wgsl, same tile config and structure:
// BM=BN=64, BK=8, TM=8, TN=4, 128 threads. Paired with dgemm_small.wgsl in
// the same two-tier dispatch sgemm uses (see dgemm.mjs).
//
// Same two unavoidable differences from sgemm_large.wgsl as dgemm_small.wgsl
// has from sgemm_small.wgsl: vec4 views on the Hi halves only (Lo too would
// exceed maxStorageBuffersPerShaderStage = 8), and protected multiply-
// accumulate with a clamped-index final write for barrier uniformity.

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

@group(0) @binding(0) var<storage, read>       AHi:  array<f32>;
@group(0) @binding(1) var<storage, read>       AHi4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       ALo:  array<f32>;
@group(0) @binding(3) var<storage, read>       BHi:  array<f32>;
@group(0) @binding(4) var<storage, read>       BHi4: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read>       BLo:  array<f32>;
@group(0) @binding(6) var<storage, read_write> CHi:  array<f32>;
@group(0) @binding(7) var<storage, read_write> CLo:  array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  k:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  lda:     u32,
  ldb:     u32,
  ldc:     u32,
  transA:  u32, // 0 = no-transpose, 1 = transpose
  transB:  u32,
  useVecA: u32, // 1 = AHi's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = BHi's vec4 view covers every in-bounds element
}

@group(0) @binding(8) var<uniform> params: Params;

var<workgroup> AsHi: array<f32, BM * BK>;
var<workgroup> AsLo: array<f32, BM * BK>;
var<workgroup> BsHi: array<f32, BK * BN>;
var<workgroup> BsLo: array<f32, BK * BN>;

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

  var threadResults: array<DD, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = DD(0.0, 0.0);
  }
  var regM: array<DD, TM>;
  var regN: array<DD, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    // \u2500\u2500 Load the BM\xD7BK A tile into As (every branch here is dispatch-uniform) \u2500\u2500
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous. Each thread loads one vec4 of 4
      // columns; 64 rows \xD7 2 column-lanes = NUM_THREADS exactly, single pass.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      let gRow = blockRow + r4;
      let gCol = t * BK + c4 * 4u;
      let base = gRow * params.lda + gCol;
      let rowOK = gRow < params.m;
      let ok0 = rowOK &&  gCol        < params.k;
      let ok1 = rowOK && (gCol + 1u) < params.k;
      let ok2 = rowOK && (gCol + 2u) < params.k;
      let ok3 = rowOK && (gCol + 3u) < params.k;
      let v = AHi4[base / 4u];
      let dst = r4 * BK + c4 * 4u;
      AsHi[dst]      = select(0.0, v.x, ok0);
      AsHi[dst + 1u] = select(0.0, v.y, ok1);
      AsHi[dst + 2u] = select(0.0, v.z, ok2);
      AsHi[dst + 3u] = select(0.0, v.w, ok3);
      AsLo[dst]      = select(0.0, ALo[base],      ok0);
      AsLo[dst + 1u] = select(0.0, ALo[base + 1u], ok1);
      AsLo[dst + 2u] = select(0.0, ALo[base + 2u], ok2);
      AsLo[dst + 3u] = select(0.0, ALo[base + 3u], ok3);
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. Each thread loads one
      // vec4 of 4 rows; 16 row-lanes \xD7 8 columns = NUM_THREADS, single pass.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      let gRow = blockRow + r4 * 4u;
      let gCol = t * BK + c;
      let base = gCol * params.lda + gRow;
      let colOK = gCol < params.k;
      let ok0 = colOK &&  gRow        < params.m;
      let ok1 = colOK && (gRow + 1u) < params.m;
      let ok2 = colOK && (gRow + 2u) < params.m;
      let ok3 = colOK && (gRow + 3u) < params.m;
      let v = AHi4[base / 4u];
      AsHi[(r4 * 4u) * BK + c]      = select(0.0, v.x, ok0);
      AsHi[(r4 * 4u + 1u) * BK + c] = select(0.0, v.y, ok1);
      AsHi[(r4 * 4u + 2u) * BK + c] = select(0.0, v.z, ok2);
      AsHi[(r4 * 4u + 3u) * BK + c] = select(0.0, v.w, ok3);
      AsLo[(r4 * 4u) * BK + c]      = select(0.0, ALo[base],      ok0);
      AsLo[(r4 * 4u + 1u) * BK + c] = select(0.0, ALo[base + 1u], ok1);
      AsLo[(r4 * 4u + 2u) * BK + c] = select(0.0, ALo[base + 2u], ok2);
      AsLo[(r4 * 4u + 3u) * BK + c] = select(0.0, ALo[base + 3u], ok3);
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        let inA = gRowA < params.m && gColA < params.k;
        let dst = (innerRowA + loadOffset) * BK + innerColA;
        AsHi[dst] = select(0.0, AHi[aIdx], inA);
        AsLo[dst] = select(0.0, ALo[aIdx], inA);
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
      let base = gRow * params.ldb + gCol;
      let rowOK = gRow < params.k;
      let ok0 = rowOK &&  gCol        < params.n;
      let ok1 = rowOK && (gCol + 1u) < params.n;
      let ok2 = rowOK && (gCol + 2u) < params.n;
      let ok3 = rowOK && (gCol + 3u) < params.n;
      let v = BHi4[base / 4u];
      let dst = r * BN + c4 * 4u;
      BsHi[dst]      = select(0.0, v.x, ok0);
      BsHi[dst + 1u] = select(0.0, v.y, ok1);
      BsHi[dst + 2u] = select(0.0, v.z, ok2);
      BsHi[dst + 3u] = select(0.0, v.w, ok3);
      BsLo[dst]      = select(0.0, BLo[base],      ok0);
      BsLo[dst + 1u] = select(0.0, BLo[base + 1u], ok1);
      BsLo[dst + 2u] = select(0.0, BLo[base + 2u], ok2);
      BsLo[dst + 3u] = select(0.0, BLo[base + 3u], ok3);
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column. 2 row-lanes \xD7 64 columns
      // cover the tile in one pass (BN = NUM_THREADS / (BK/4)).
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      let gRow = t * BK + r4 * 4u;
      let gCol = blockCol + c;
      let base = gCol * params.ldb + gRow;
      let colOK = gCol < params.n;
      let ok0 = colOK &&  gRow        < params.k;
      let ok1 = colOK && (gRow + 1u) < params.k;
      let ok2 = colOK && (gRow + 2u) < params.k;
      let ok3 = colOK && (gRow + 3u) < params.k;
      let v = BHi4[base / 4u];
      BsHi[(r4 * 4u) * BN + c]      = select(0.0, v.x, ok0);
      BsHi[(r4 * 4u + 1u) * BN + c] = select(0.0, v.y, ok1);
      BsHi[(r4 * 4u + 2u) * BN + c] = select(0.0, v.z, ok2);
      BsHi[(r4 * 4u + 3u) * BN + c] = select(0.0, v.w, ok3);
      BsLo[(r4 * 4u) * BN + c]      = select(0.0, BLo[base],      ok0);
      BsLo[(r4 * 4u + 1u) * BN + c] = select(0.0, BLo[base + 1u], ok1);
      BsLo[(r4 * 4u + 2u) * BN + c] = select(0.0, BLo[base + 2u], ok2);
      BsLo[(r4 * 4u + 3u) * BN + c] = select(0.0, BLo[base + 3u], ok3);
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        let inB = gRowB < params.k && gColB < params.n;
        let dst = (innerRowB + loadOffset) * BN + innerColB;
        BsHi[dst] = select(0.0, BHi[bIdx], inB);
        BsLo[dst] = select(0.0, BLo[bIdx], inB);
      }
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        let idx = (threadRow * TM + i) * BK + dotIdx;
        regM[i] = DD(AsHi[idx], AsLo[idx]);
      }
      for (var i = 0u; i < TN; i++) {
        let idx = dotIdx * BN + threadCol * TN + i;
        regN[i] = DD(BsHi[idx], BsLo[idx]);
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          let ri = resIdxM * TN + resIdxN;
          let prod = ddMulProtected(regM[resIdxM], regN[resIdxN], tid);
          threadResults[ri] = ddAddProtected(threadResults[ri], prod, tid);
        }
      }
    }

    workgroupBarrier();
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta = DD(params.betaHi, params.betaLo);
  let betaIsZero = params.betaHi == 0.0 && params.betaLo == 0.0;

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
      let row = blockRow + threadRow * TM + resIdxM;
      let col = blockCol + threadCol * TN + resIdxN;
      let inBounds = row < params.m && col < params.n;
      let cIdx = min(row, params.m - 1u) * params.ldc + min(col, params.n - 1u);

      let acc = ddMulProtected(alpha, threadResults[resIdxM * TN + resIdxN], tid);
      // BLAS beta==0 semantics: C is written, not accumulated \u2014 select rather
      // than multiply so stale NaN/Inf in C can't survive as 0 * NaN.
      let betaTerm = ddMulProtected(beta, DD(CHi[cIdx], CLo[cIdx]), tid);
      let withBeta = ddAddProtected(acc, betaTerm, tid);
      if (inBounds) {
        CHi[cIdx] = select(withBeta.hi, acc.hi, betaIsZero);
        CLo[cIdx] = select(withBeta.lo, acc.lo, betaIsZero);
      }
    }
  }
}
`;
    });
  var ee,
    Jo = J(() => {
      ee = `// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
  uplo:    u32, // 0 = full C; gemmtr masks: 1 = lower (col <= row), 2 = upper (col >= row)
  offA:    u32, // element offsets into A/B/C \u2014 strsm addresses sub-blocks in place
  offB:    u32, // (vec4 paths need offset % 4 == 0, checked host-side)
  offC:    u32,
  kTri:    u32, // strmm: 0 = dense; 1/2 = op(A) lower/upper, 3/4 = op(B) lower/upper
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
  // gemmtr (sgemmtr/ssyrk/ssyr2k): a tile entirely outside the requested
  // triangle writes nothing, so skip it outright \u2014 about half the grid. The
  // test depends only on the workgroup id and a uniform, so the early exit
  // is uniform and comes before any barrier.
  if (params.uplo == 1u && blockCol > blockRow + BM - 1u) { return; }
  if (params.uplo == 2u && blockCol + BN - 1u < blockRow) { return; }
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

  // strmm: one operand is triangular (its other half zero-filled), so only
  // a band of k reaches this tile \u2014 the rest multiplies zeros. Lower op(A)
  // rows stop at k <= row, upper start at k >= row; op(B) likewise by
  // column. Uniform (workgroup id + params), so the barriers stay legal.
  var kLo = 0u;
  var kHi = params.k;
  if (params.kTri == 1u) { kHi = min(kHi, blockRow + BM); }
  if (params.kTri == 2u) { kLo = blockRow; }
  if (params.kTri == 3u) { kLo = blockCol; }
  if (params.kTri == 4u) { kHi = min(kHi, blockCol + BN); }
  let tEnd = (kHi + BK - 1u) / BK;
  for (var t = kLo / BK; t < tEnd; t++) {
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
        var v = A4[(params.offA + gRow * params.lda + gCol) / 4u];
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
      // the BK-column tile \u2014 guard the store. Stored k-major, so a warp's
      // stores land on consecutive words.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      if (c < BK) {
        let gRow = blockRow + r4 * 4u;
        let gCol = t * BK + c;
        var v = A4[(params.offA + gCol * params.lda + gRow) / 4u];
        let colOK = gCol < params.k;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
        As[c * BM + r4 * 4u] = v.x;
        As[c * BM + r4 * 4u + 1u] = v.y;
        As[c * BM + r4 * 4u + 2u] = v.z;
        As[c * BM + r4 * 4u + 3u] = v.w;
      }
    } else if (params.transA == 0u) {
      // Scalar fallback, no-transpose: odd stride.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[params.offA + gRowA * params.lda + gColA], gRowA < params.m && gColA < params.k);
      }
    } else {
      // Scalar fallback, transpose: one m per thread, so a warp reads a
      // contiguous run of a stored row and writes As k-major without conflicts.
      for (var kOff = 0u; kOff < BK; kOff += NUM_THREADS / BM) {
        let mA = tid % BM;
        let kA = tid / BM + kOff;
        let gRowA = blockRow + mA;
        let gColA = t * BK + kA;
        As[kA * BM + mA] = select(0.0, A[params.offA + gColA * params.lda + gRowA], gRowA < params.m && gColA < params.k);
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
        var v = B4[(params.offB + gRow * params.ldb + gCol) / 4u];
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
        var v = B4[(params.offB + gCol * params.ldb + gRow) / 4u];
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
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[params.offB + bIdx], gRowB < params.k && gColB < params.n);
      }
    }

    workgroupBarrier();

    // As is m-major ([BM][BK]) for no-transpose A, k-major ([BK][BM]) for
    // transposed A \u2014 see the tile loads. The uniform branch sits outside the
    // dot loop: inside it, it kept the compiler from unrolling the hot path.
    if (params.transA == 0u) {
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
    } else {
      for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
        for (var i = 0u; i < TM; i++) {
          regM[i] = As[dotIdx * BM + threadRow * TM + i];
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
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        // gemmtr: tiles straddling the diagonal write only their triangle.
        let inTriangle = params.uplo == 0u
          || (params.uplo == 1u && col <= row)
          || (params.uplo == 2u && col >= row);
        if (col < params.n && inTriangle) {
          let cIdx = params.offC + row * params.ldc + col;
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
  var te,
    Qo = J(() => {
      te = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
// Odd-stride operands take the scalar path; both paths zero-fill
// out-of-bounds components identically. Transposed A is staged k-major
// in As ([BK][BM]) so its loads coalesce and its stores don't bank-conflict.

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
  uplo:    u32, // 0 = full C; gemmtr masks: 1 = lower (col <= row), 2 = upper (col >= row)
  offA:    u32, // element offsets into A/B/C \u2014 strsm addresses sub-blocks in place
  offB:    u32, // (vec4 paths need offset % 4 == 0, checked host-side)
  offC:    u32,
  kTri:    u32, // strmm: 0 = dense; 1/2 = op(A) lower/upper, 3/4 = op(B) lower/upper
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
  // gemmtr (sgemmtr/ssyrk/ssyr2k): a tile entirely outside the requested
  // triangle writes nothing, so skip it outright \u2014 about half the grid. The
  // test depends only on the workgroup id and a uniform, so the early exit
  // is uniform and comes before any barrier.
  if (params.uplo == 1u && blockCol > blockRow + BM - 1u) { return; }
  if (params.uplo == 2u && blockCol + BN - 1u < blockRow) { return; }
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

  // strmm: one operand is triangular (its other half zero-filled), so only
  // a band of k reaches this tile \u2014 the rest multiplies zeros. Lower op(A)
  // rows stop at k <= row, upper start at k >= row; op(B) likewise by
  // column. Uniform (workgroup id + params), so the barriers stay legal.
  var kLo = 0u;
  var kHi = params.k;
  if (params.kTri == 1u) { kHi = min(kHi, blockRow + BM); }
  if (params.kTri == 2u) { kLo = blockRow; }
  if (params.kTri == 3u) { kLo = blockCol; }
  if (params.kTri == 4u) { kHi = min(kHi, blockCol + BN); }
  let tEnd = (kHi + BK - 1u) / BK;
  for (var t = kLo / BK; t < tEnd; t++) {
    // \u2500\u2500 Load the BM\xD7BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) \u2500\u2500
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous. Each thread loads one vec4 of 4
      // columns; 64 rows \xD7 2 column-lanes = NUM_THREADS exactly, single pass.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      let gRow = blockRow + r4;
      let gCol = t * BK + c4 * 4u;
      var v = A4[(params.offA + gRow * params.lda + gCol) / 4u];
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
      // Stored k-major, so a warp's stores land on consecutive words.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      let gRow = blockRow + r4 * 4u;
      let gCol = t * BK + c;
      var v = A4[(params.offA + gCol * params.lda + gRow) / 4u];
      let colOK = gCol < params.k;
      v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
      v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
      v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
      v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
      As[c * BM + r4 * 4u] = v.x;
      As[c * BM + r4 * 4u + 1u] = v.y;
      As[c * BM + r4 * 4u + 2u] = v.z;
      As[c * BM + r4 * 4u + 3u] = v.w;
    } else if (params.transA == 0u) {
      // Scalar fallback, no-transpose: odd stride.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[params.offA + gRowA * params.lda + gColA], gRowA < params.m && gColA < params.k);
      }
    } else {
      // Scalar fallback, transpose: one m per thread, so a warp reads a
      // contiguous run of a stored row and writes As k-major without conflicts.
      for (var kOff = 0u; kOff < BK; kOff += NUM_THREADS / BM) {
        let mA = tid % BM;
        let kA = tid / BM + kOff;
        let gRowA = blockRow + mA;
        let gColA = t * BK + kA;
        As[kA * BM + mA] = select(0.0, A[params.offA + gColA * params.lda + gRowA], gRowA < params.m && gColA < params.k);
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
      var v = B4[(params.offB + gRow * params.ldb + gCol) / 4u];
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
      var v = B4[(params.offB + gCol * params.ldb + gRow) / 4u];
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
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[params.offB + bIdx], gRowB < params.k && gColB < params.n);
      }
    }

    workgroupBarrier();

    // As is m-major ([BM][BK]) for no-transpose A, k-major ([BK][BM]) for
    // transposed A \u2014 see the tile loads. The uniform branch sits outside the
    // dot loop: inside it, it kept the compiler from unrolling the hot path.
    if (params.transA == 0u) {
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
    } else {
      for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
        for (var i = 0u; i < TM; i++) {
          regM[i] = As[dotIdx * BM + threadRow * TM + i];
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
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        // gemmtr: tiles straddling the diagonal write only their triangle.
        let inTriangle = params.uplo == 0u
          || (params.uplo == 1u && col <= row)
          || (params.uplo == 2u && col >= row);
        if (col < params.n && inTriangle) {
          let cIdx = params.offC + row * params.ldc + col;
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
  var ea,
    ra = J(() => {
      ea = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var oa,
    ta = J(() => {
      oa = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
  var ia,
    aa = J(() => {
      ia = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var sa = {};
  Re(sa, { routineShaders: () => mr, shaderSources: () => vs });
  var mr,
    vs,
    na = J(() => {
      Ye();
      $e();
      Qe();
      et();
      ot();
      it();
      nt();
      ut();
      ft();
      mt();
      pt();
      gt();
      bt();
      xt();
      Bt();
      _t();
      kt();
      At();
      Et();
      Gt();
      Lt();
      Nt();
      Mt();
      Rt();
      Ht();
      Ct();
      qt();
      Wt();
      Kt();
      Ut();
      Zt();
      Xt();
      $t();
      Qt();
      eo();
      oo();
      ao();
      so();
      lo();
      uo();
      mo();
      po();
      go();
      ho();
      yo();
      vo();
      Bo();
      ko();
      So();
      Go();
      Do();
      Po();
      Io();
      Ho();
      Co();
      qo();
      Wo();
      Ko();
      Uo();
      Zo();
      Xo();
      Jo();
      Qo();
      ra();
      ta();
      aa();
      mr = {};
      mr.sscal = { sscal: Xe };
      mr.cscal = { cscal: Je };
      mr.sswap = { sswap: rt };
      mr.dswap = { dswap: tt };
      mr.saxpy = { saxpy: at };
      mr.scopy = { scopy: st };
      mr.dcopy = { dcopy: lt };
      mr.sdot = { sdot: dt, "reduction/sum": Ee };
      mr.sasum = { sasum: ct, "reduction/sum": Ee };
      mr.snrm2 = { snrm2: wt, "reduction/scaledSum": ht };
      mr.isamax = { isamax: yt, "reduction/argmax": vt };
      mr.dasum = {
        "f64/dekker": Pr,
        "f64/utils/abs": Be,
        "f64/utils/add": Tr,
        dasum: St,
        "reduction/sumF64": Ge,
      };
      mr.ddot = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        ddot: Dt,
        "reduction/sumF64": Ge,
      };
      mr.dscal = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dscal: Pt,
      };
      mr.daxpy = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        daxpy: It,
      };
      mr.idamax = {
        "f64/dekker": Pr,
        "f64/utils/abs": Be,
        "f64/utils/greater": Le,
        "f64/utils/equal": Tt,
        idamax: jt,
        "reduction/argmaxF64": Ft,
      };
      mr.srot = { srot: Ot };
      mr.drot = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        drot: Vt,
      };
      mr.srotm = { srotm: zt };
      mr.drotm = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        drotm: Yt,
      };
      mr.dnrm2 = {
        "f64/dekker": Pr,
        "f64/utils/abs": Be,
        "f64/utils/greater": Le,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        "f64/utils/divide": De,
        "f64/utils/sqrt": Jt,
        dnrm2: ro,
        "reduction/scaledSumF64": to,
      };
      mr.sgemv = { sgemv_n: io, sgemv_t: no, reduce_partials: _e };
      mr.ssymv = { ssymv: fo, reduce_partials: _e, gather_strided: me };
      mr.strmv = {
        strmv: co,
        strmv_t: wo,
        reduce_partials: _e,
        gather_strided: me,
      };
      mr.strsv = {
        strsv_invert_block: Ne,
        strsv_step: bo,
        scatter_strided: xo,
        strsm_small: Pe,
      };
      mr.sger = { sger: _o, gather_strided: me };
      mr.dger = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dger: Ao,
      };
      mr.ssyr = { ssyr: Eo, gather_strided: me };
      mr.dsyr = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dsyr: Lo,
      };
      mr.ssyr2 = { ssyr2: No, gather_strided: me };
      mr.dsyr2 = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dsyr2: Mo,
      };
      mr.dgemv = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dgemv_n: Ro,
        dgemv_t: To,
      };
      mr.dsymv = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dsymv: jo,
      };
      mr.dtrmv = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dtrmv: Fo,
      };
      mr.dtrsv = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        "f64/utils/divide": De,
        dtrsv_invert_block: Oo,
        dtrsv_apply_inverse: Vo,
        dtrsv_update: zo,
      };
      mr.dgemm = {
        "f64/dekker": Pr,
        "f64/utils/add": Tr,
        "f64/utils/multiply": jr,
        dgemm_small: Yo,
        dgemm_large: $o,
      };
      mr.sgemm = { sgemm_small: ee, sgemm_large: te };
      mr.sgemmtr = { sgemm_small: ee, sgemm_large: te };
      mr.ssyrk = { sgemm_small: ee, sgemm_large: te };
      mr.ssyr2k = { sgemm_small: ee, sgemm_large: te };
      mr.ssymm = { sgemm_small: ee, sgemm_large: te, symmetrize: ea };
      mr.strmm = { sgemm_small: ee, sgemm_large: te, triangularize: oa };
      mr.strsm = {
        strsv_invert_block: Ne,
        strsm_small: Pe,
        block_transfer: ia,
        sgemm_small: ee,
        sgemm_large: te,
      };
      vs = Object.assign({}, ...Object.values(mr));
    });
  var Ps = {};
  Re(Ps, {
    Complex32: () => Jr,
    Complex32Array: () => Er,
    Complex64: () => $r,
    Complex64Array: () => Rr,
    GpuMatrix: () => Q,
    GpuVector: () => H,
    cleanup: () => We,
    cscal: () => ua,
    dasum: () => ya,
    daxpy: () => pa,
    dcopy: () => ga,
    ddot: () => xa,
    dgemm: () => Za,
    dgemv: () => Wa,
    dger: () => Ta,
    dnrm2: () => Ba,
    drot: () => Sa,
    drotm: () => Ga,
    dscal: () => da,
    dswap: () => ma,
    dsymv: () => Oa,
    dsyr: () => ja,
    dsyr2: () => Fa,
    dtrmv: () => Ka,
    dtrsv: () => za,
    gpuName: () => Oe,
    idamax: () => ka,
    init: () => Fe,
    isamax: () => _a,
    randomFloat32Array: () => Ue,
    randomFloat64Array: () => ze,
    randomTriangularFloat32Array: () => Ze,
    sasum: () => ba,
    saxpy: () => ca,
    scopy: () => wa,
    sdot: () => ha,
    sgemm: () => Ya,
    sgemmtr: () => Xa,
    sgemv: () => La,
    sger: () => Ha,
    snrm2: () => va,
    srot: () => Aa,
    srotm: () => Ea,
    sscal: () => la,
    sswap: () => fa,
    ssymm: () => Qa,
    ssymv: () => Da,
    ssyr: () => Ca,
    ssyr2: () => qa,
    ssyr2k: () => Ja,
    ssyrk: () => $a,
    strmm: () => ri,
    strmv: () => Na,
    strsm: () => ei,
    strsv: () => Ra,
  });
  function Te(r, o) {
    return o
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function Ce(r) {
    if (!je(r)) return { querySet: null, passDescriptor: void 0 };
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
  function Dr(r, o, e) {
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
  async function C(r) {
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
  var ne = null,
    Ae = !1,
    le = new Map(),
    ce = new WeakMap(),
    re = null,
    qe = ({ powerPreference: r, benchmark: o }) => `${r}::${o}`;
  async function Fe({
    powerPreference: r = "high-performance",
    benchmark: o = !1,
    dumpShaders: e = !1,
  } = {}) {
    let a = { powerPreference: r, benchmark: o, dumpShaders: e },
      t = qe(a),
      i = le.get(t);
    if (i) return i;
    if (ne)
      e !== Ae &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Ae}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: m, globals: w } = await import("webgpu");
      (Object.assign(globalThis, w),
        (ne = m(
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
        (ne = navigator.gpu));
    if (!ne) throw new Error("WebGPU not supported in this environment.");
    let s =
      (await ne.requestAdapter({ powerPreference: r })) ??
      (await ne.requestAdapter());
    if (!s) throw new Error("No WebGPU adapter found.");
    let n = [...(Te(s, o).requiredFeatures ?? [])],
      d = await s.requestDevice({ requiredFeatures: n });
    d.addEventListener("uncapturederror", (m) => {
      console.error("Uncaptured GPU error:", m.error.message);
    });
    let u = n.includes("timestamp-query");
    return (
      ce.set(d, { adapter: s, benchmark: u, options: a }),
      le.set(t, d),
      re || (re = d),
      d
    );
  }
  function We(r) {
    if (r === void 0) {
      for (let e of le.values()) e.destroy();
      (le.clear(), (re = null));
      return;
    }
    let o = ce.get(r);
    o &&
      (le.delete(qe(o.options)),
      ce.delete(r),
      r.destroy(),
      re === r && (re = le.values().next().value ?? null));
  }
  function Oe(r = re) {
    let o = r && ce.get(r);
    if (!o)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: a } = o.adapter.info;
    return { description: a || "unknown", device: e || "unknown" };
  }
  function je(r = re) {
    return ce.get(r)?.benchmark ?? !1;
  }
  function ue() {
    if (!re)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return re;
  }
  function f(...r) {
    r.flat().forEach((o) => o.destroy());
  }
  function Se(r, o, e) {
    let a = r.limits.maxStorageBufferBindingSize;
    if (o > a)
      throw new Error(
        `Buffer "${e}" needs ${o} bytes, exceeding this device's maxStorageBufferBindingSize (${a} bytes). The operands are too large for this device.`,
      );
  }
  function b(r, o, e = "blas-input", a = !1) {
    let t = o.byteLength;
    Se(r, t, e);
    let i = a
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE,
      s = r.createBuffer({ label: e, size: t, usage: i, mappedAtCreation: !0 }),
      l = o.constructor;
    return (new l(s.getMappedRange()).set(o), s.unmap(), s);
  }
  function lr(r, o, e = "blas-storage", a = 0) {
    return (
      Se(r, o, e),
      r.createBuffer({ label: e, size: o, usage: GPUBufferUsage.STORAGE | a })
    );
  }
  function Lr(r, o, e = "blas-result") {
    return (
      Se(r, o, e),
      r.createBuffer({
        label: e,
        size: o,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  function D(r, o, e) {
    let a = r.createBuffer({
      label: "blas-readback",
      size: e.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (o.copyBufferToBuffer(e, 0, a, 0, e.size), a);
  }
  var de = 16,
    Ke = new WeakMap();
  function li(r) {
    let o = Ke.get(r);
    return (
      o ||
        ((o = r.createBuffer({
          label: "blas-vec4-fallback",
          size: de,
          usage: GPUBufferUsage.STORAGE,
        })),
        Ke.set(r, o)),
      o
    );
  }
  function Br(r, o) {
    let e = o instanceof GPUBuffer ? o : o.buffer,
      a = o instanceof GPUBuffer ? 0 : (o.offset ?? 0),
      t = o instanceof GPUBuffer ? o.size : (o.size ?? e.size - a),
      i = Math.floor(t / de) * de;
    return i < de
      ? { buffer: li(r), offset: 0, size: de }
      : { buffer: e, offset: a, size: i };
  }
  function Ar(r, o, e, a, t = 0) {
    if (o % 4 !== 0 || t % 4 !== 0) return !1;
    let i = r instanceof GPUBuffer ? r : r.buffer,
      s = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      l = r instanceof GPUBuffer ? i.size : (r.size ?? i.size - s),
      n = Math.floor(l / de) * 4;
    if (n <= 0) return !1;
    let d = t + (Math.max(e, 1) - 1) * o + (Math.max(a, 1) - 1);
    return Math.floor(d / 4) * 4 + 4 <= n;
  }
  function T(r, o, e = "blas-params") {
    let a = o.length * 4,
      t = Math.ceil(a / 16) * 16,
      i = new ArrayBuffer(t),
      s = new DataView(i);
    o.forEach(({ value: n, type: d }, u) => {
      let m = u * 4;
      if (d === "u32") s.setUint32(m, n, !0);
      else if (d === "i32") s.setInt32(m, n, !0);
      else if (d === "f32") s.setFloat32(m, n, !0);
      else
        throw new Error(
          `Unknown param type "${d}". Use "f32", "u32", or "i32".`,
        );
    });
    let l = r.createBuffer({
      label: e,
      size: t,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(l, 0, i), l);
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
  function z(r) {
    let o = r.length,
      e = new Float32Array(o),
      a = new Float32Array(o);
    for (let t = 0; t < o; t++) {
      let i = Math.fround(r[t]);
      ((e[t] = i), (a[t] = Math.fround(r[t] - i)));
    }
    return { hi: e, lo: a };
  }
  function cr(r, o) {
    let e = r.length,
      a = new Float64Array(e);
    for (let t = 0; t < e; t++) a[t] = r[t] + o[t];
    return a;
  }
  var $r = class {
      constructor(o, e) {
        ((this.re = o), (this.im = e));
      }
    },
    Rr = class extends Array {
      constructor(o) {
        if (o === void 0) {
          super();
          return;
        }
        if (typeof o == "number") {
          super(o);
          for (let a = 0; a < o; a++) this[a] = new $r(0, 0);
          return;
        }
        let e = Array.from(o);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof $r) {
            for (let a of e) {
              if (!(a instanceof $r))
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
            this.push(new $r(e[a], e[a + 1]));
          }
        }
      }
    };
  function fe(r, o = r.length) {
    let e = new Float32Array(o * 2);
    for (let a = 0; a < o; a++)
      ((e[a * 2] = r[a].re), (e[a * 2 + 1] = r[a].im));
    return e;
  }
  function xe(r, o = r.length) {
    let e = new Float64Array(o),
      a = new Float64Array(o);
    for (let u = 0; u < o; u++) ((e[u] = r[u].re), (a[u] = r[u].im));
    let { hi: t, lo: i } = z(e),
      { hi: s, lo: l } = z(a),
      n = new Float32Array(o * 2),
      d = new Float32Array(o * 2);
    for (let u = 0; u < o; u++)
      ((n[u * 2] = t[u]),
        (n[u * 2 + 1] = s[u]),
        (d[u * 2] = i[u]),
        (d[u * 2 + 1] = l[u]));
    return { hi: n, lo: d };
  }
  function ve(r, o) {
    let e = r.length / 2,
      a = new Float32Array(e),
      t = new Float32Array(e),
      i = new Float32Array(e),
      s = new Float32Array(e);
    for (let u = 0; u < e; u++)
      ((a[u] = r[u * 2]),
        (i[u] = r[u * 2 + 1]),
        (t[u] = o[u * 2]),
        (s[u] = o[u * 2 + 1]));
    let l = cr(a, t),
      n = cr(i, s),
      d = new Rr(e);
    for (let u = 0; u < e; u++) d[u] = new $r(l[u], n[u]);
    return d;
  }
  var Jr = class {
      constructor(o, e) {
        ((this.re = Math.fround(o)), (this.im = Math.fround(e)));
      }
    },
    Er = class extends Array {
      constructor(o) {
        if (o === void 0) {
          super();
          return;
        }
        if (typeof o == "number") {
          super(o);
          for (let a = 0; a < o; a++) this[a] = new Jr(0, 0);
          return;
        }
        let e = Array.from(o);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof Jr) {
            for (let a of e) {
              if (!(a instanceof Jr))
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
            this.push(new Jr(e[a], e[a + 1]));
          }
        }
      }
    };
  var H = class r {
    constructor(o, e, a = Float32Array, t = null, i = null) {
      ((this._buf = o),
        (this._loBuf = t),
        (this.length = e),
        (this.dtype = a),
        (this.device = i ?? ue()));
    }
    static from(o, e) {
      let a = o instanceof GPUDevice,
        t = a ? o : ue(),
        i = a ? e : o;
      if (i instanceof Float64Array) {
        let { hi: l, lo: n } = z(i),
          d = b(t, l, "gpu-vector-f64-hi", !0),
          u = b(t, n, "gpu-vector-f64-lo", !0);
        return new r(d, i.length, Float64Array, u, t);
      }
      if (i instanceof Er) {
        let l = b(t, fe(i), "gpu-vector-complex32", !0);
        return new r(l, i.length, Er, null, t);
      }
      if (i instanceof Rr) {
        let { hi: l, lo: n } = xe(i),
          d = b(t, l, "gpu-vector-complex64-hi", !0),
          u = b(t, n, "gpu-vector-complex64-lo", !0);
        return new r(d, i.length, Rr, u, t);
      }
      if (!(i instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let s = b(t, i, "gpu-vector", !0);
      return new r(s, i.length, i.constructor, null, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = D(o, e, this._buf);
      if ((o.queue.submit([e.finish()]), this.dtype === Er))
        return new Er(await G(a, Float32Array));
      if (!this._loBuf) return G(a, this.dtype);
      let t = o.createCommandEncoder(),
        i = D(o, t, this._loBuf);
      o.queue.submit([t.finish()]);
      let [s, l] = await Promise.all([G(a, Float32Array), G(i, Float32Array)]);
      return this.dtype === Rr ? ve(s, l) : cr(s, l);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var Q = class r {
    constructor(
      o,
      e,
      a,
      t,
      i = null,
      s = "row-major",
      l = null,
      n = Float32Array,
    ) {
      ((this._buf = o),
        (this._loBuf = i),
        (this.rows = e),
        (this.cols = a),
        (this.lda = t),
        (this.layout = s),
        (this.dtype = n),
        (this.device = l ?? ue()));
    }
    static from(o, ...e) {
      let a = o instanceof GPUDevice,
        t = a ? o : ue(),
        i = a ? e.shift() : o,
        [s, l, n, d = "row-major"] = e;
      if (d !== "row-major" && d !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let u = d === "row-major";
      if (
        (n === void 0 && (n = u ? l : s),
        !(i instanceof Float32Array) &&
          !(i instanceof Float64Array) &&
          !(i instanceof Er) &&
          !(i instanceof Rr))
      )
        throw new Error(
          "GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      if (!Number.isInteger(s) || s <= 0)
        throw new Error("rows must be a positive integer.");
      if (!Number.isInteger(l) || l <= 0)
        throw new Error("cols must be a positive integer.");
      let m = u ? l : s;
      if (!Number.isInteger(n) || n < m)
        throw new Error(`lda must be an integer >= ${u ? "cols" : "rows"}.`);
      let w = u ? s : l;
      if (i.length < w * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (i instanceof Float64Array) {
        let p = w * n,
          { hi: g, lo: y } = z(i.subarray(0, p)),
          h = b(t, g, "gpu-matrix-f64-hi", !0),
          x = b(t, y, "gpu-matrix-f64-lo", !0);
        return new r(h, s, l, n, x, d, t, Float64Array);
      }
      if (i instanceof Er) {
        let p = b(t, fe(i, w * n), "gpu-matrix-complex32", !0);
        return new r(p, s, l, n, null, d, t, Er);
      }
      if (i instanceof Rr) {
        let { hi: p, lo: g } = xe(i, w * n),
          y = b(t, p, "gpu-matrix-complex64-hi", !0),
          h = b(t, g, "gpu-matrix-complex64-lo", !0);
        return new r(y, s, l, n, h, d, t, Rr);
      }
      let c = b(t, i.subarray(0, w * n), "gpu-matrix", !0);
      return new r(c, s, l, n, null, d, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = D(o, e, this._buf);
      o.queue.submit([e.finish()]);
      let t = this.layout !== "column-major",
        i = t ? this.rows : this.cols,
        s = t ? this.cols : this.rows;
      if (this.dtype === Er) {
        let d = new Er(await G(a, Float32Array));
        if (this.lda === s) return d;
        let u = new Er(i * s);
        for (let m = 0; m < i; m++)
          for (let w = 0; w < s; w++) u[m * s + w] = d[m * this.lda + w];
        return u;
      }
      if (this._loBuf) {
        let d = o.createCommandEncoder(),
          u = D(o, d, this._loBuf);
        o.queue.submit([d.finish()]);
        let [m, w] = await Promise.all([
          G(a, Float32Array),
          G(u, Float32Array),
        ]);
        if (this.dtype === Rr) {
          let g = ve(m, w);
          if (this.lda === s) return g;
          let y = new Rr(i * s);
          for (let h = 0; h < i; h++)
            for (let x = 0; x < s; x++) y[h * s + x] = g[h * this.lda + x];
          return y;
        }
        let c = cr(m, w);
        if (this.lda === s) return c;
        let p = new Float64Array(i * s);
        for (let g = 0; g < i; g++)
          p.set(c.subarray(g * this.lda, g * this.lda + s), g * s);
        return p;
      }
      let l = await G(a, Float32Array);
      if (this.lda === s) return l;
      let n = new Float32Array(i * s);
      for (let d = 0; d < i; d++)
        n.set(l.subarray(d * this.lda, d * this.lda + s), d * s);
      return n;
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  function Ve(r) {
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
  function Ue(r, o = -1, e = 1, a) {
    let t = new Float32Array(r),
      i = a === void 0 ? Math.random : Ve(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function ze(r, o = -1, e = 1, a) {
    let t = new Float64Array(r),
      i = a === void 0 ? Math.random : Ve(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function Ze(
    r,
    o,
    e = "lower",
    a = -1,
    t = 1,
    i = 5,
    s = 15,
    l = "row-major",
  ) {
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (o < r) throw new Error("lda must be >= n.");
    let n = l === "column-major",
      d = (m, w) => (n ? w * o + m : m * o + w),
      u = new Float32Array(r * o);
    for (let m = 0; m < r; m++) {
      for (let w = 0; w < r; w++) {
        if (m === w) continue;
        (e === "lower" ? w < m : w > m) &&
          (u[d(m, w)] = a + Math.random() * (t - a));
      }
      u[d(m, m)] = i + Math.random() * (s - i);
    }
    return u;
  }
  function N(r, o, e, a = 0) {
    let t = e.map((i, s) => ({
      binding: a + s,
      resource: i instanceof GPUBuffer ? { buffer: i } : i,
    }));
    return r.createBindGroup({ layout: o, entries: t });
  }
  function j(r, o) {
    r.queue.submit([o.finish()]);
  }
  function Hr(r) {
    let { querySet: o, passDescriptor: e } = Ce(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: o,
      passDescriptor: e,
    };
  }
  function Nr(r, o, e, a, t) {
    let i = r.beginComputePass(t);
    (i.setPipeline(o),
      i.setBindGroup(0, e),
      typeof a == "number"
        ? i.dispatchWorkgroups(a)
        : i.dispatchWorkgroups(a.x, a.y, a.z ?? 1),
      i.end());
  }
  function zr(r, o) {
    if (o.length === 1) {
      let [i] = o;
      return $(r, i.pipeline, i.bindGroup, i.workgroups);
    }
    let { commandEncoder: e, querySet: a } = Hr(r);
    o.forEach((i, s) => {
      let l;
      (a && s === 0
        ? (l = {
            timestampWrites: { querySet: a, beginningOfPassWriteIndex: 0 },
          })
        : a &&
          s === o.length - 1 &&
          (l = { timestampWrites: { querySet: a, endOfPassWriteIndex: 1 } }),
        Nr(e, i.pipeline, i.bindGroup, i.workgroups, l));
    });
    let t = Dr(r, e, a);
    return { commandEncoder: e, ts: t };
  }
  function $(r, o, e, a) {
    let { commandEncoder: t, querySet: i, passDescriptor: s } = Hr(r);
    Nr(t, o, e, a, s);
    let l = Dr(r, t, i);
    return { commandEncoder: t, ts: l };
  }
  var ks = {},
    Me = new WeakMap();
  async function P(r, o, e = "main") {
    Me.has(r) || Me.set(r, new Map());
    let a = Me.get(r),
      t = Array.isArray(o) ? o : [o],
      i = `${t.join("+")}::${e}`;
    if (!a.has(i)) {
      let s = _s(r, t, e).catch((l) => {
        throw (a.delete(i), l);
      });
      a.set(i, s);
    }
    return a.get(i);
  }
  async function Bs(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: o } = await Promise.resolve().then(() => (na(), sa)),
        e = o[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: o } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: a, join: t } = await import("path"),
        i = a(e(ks.url));
      return o(t(i, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function _s(r, o, e = "main") {
    let a = o.join("+"),
      t = await Promise.all(o.map(Bs)),
      i = 0,
      s = t.map((p, g) => {
        let y = p.split(`
`).length,
          h = { name: o[g], startLine: i + 1, endLine: i + y };
        return ((i += y), h);
      }),
      l = (p) => {
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
${m.map((p) => `  ${l(p.lineNum)}: ${p.message}`).join(`
`)}`);
    let w = e === "main" ? { module: d } : { module: d, entryPoint: e },
      c = r.createComputePipeline({ label: a, layout: "auto", compute: w });
    return ((c._shaderModule = d), c);
  }
  function _r(r, o, e) {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(o / 64), a)
      : { x: Math.min(Math.ceil(e / 8), a), y: Math.min(Math.ceil(o / 8), a) };
  }
  function sr(r, o, e, a = "x") {
    let t = r.limits.maxComputeWorkgroupsPerDimension;
    if (o > t)
      throw new Error(
        `${e}: this problem needs ${o} workgroups in ${a}, but the device allows ${t} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return o;
  }
  function ke(r, o, e, a) {
    return a === void 0
      ? sr(r, Math.ceil(e / 64), o)
      : {
          x: sr(r, Math.ceil(a / 8), o, "x"),
          y: sr(r, Math.ceil(e / 8), o, "y"),
        };
  }
  function F(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function W(r, o, e) {
    for (let [a, t] of Object.entries(e))
      if (!(!(t instanceof H) && !(t instanceof Q)) && t.device !== r)
        throw new Error(
          `${o}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function la(r, o, e, a, t) {
    let i = a instanceof H;
    if (
      (F(r),
      W(r, "sscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Float32Array) && !(a instanceof H))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (o <= 0) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await P(r, "sscal"),
      l = null,
      n = null,
      d = null;
    try {
      ((l = i ? a._buf : b(r, a, "sscal-x", !0)),
        (n = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
          ],
          "sscal-params",
        )));
      let u = N(r, s.getBindGroupLayout(0), [l, n]),
        { commandEncoder: m, ts: w } = $(r, s, u, _r(r, o));
      ((d = i ? null : D(r, m, l)), j(r, m));
      let c = await C(w);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await G(d, Float32Array);
      return ((d = null), c !== void 0 ? { x: p, gpuTimeMs: c } : { x: p });
    } finally {
      (!i && l && f(l), n && f(n), d && f(d));
    }
  }
  async function ua(r, o, e, a, t) {
    let i = a instanceof H;
    if (
      (F(r),
      W(r, "cscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof Jr)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Er) && !i)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (i && a.dtype !== Er)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (o <= 0) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await P(r, "cscal"),
      l = null,
      n = null,
      d = null;
    try {
      ((l = i ? a._buf : b(r, fe(a), "cscal-x", !0)),
        (n = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: t, type: "u32" },
          ],
          "cscal-params",
        )));
      let u = N(r, s.getBindGroupLayout(0), [l, n]),
        { commandEncoder: m, ts: w } = $(r, s, u, _r(r, o));
      ((d = i ? null : D(r, m, l)), j(r, m));
      let c = await C(w);
      if (i) return c !== void 0 ? { gpuTimeMs: c } : {};
      let p = await G(d, Float32Array);
      d = null;
      let g = new Er(p);
      return c !== void 0 ? { x: g, gpuTimeMs: c } : { x: g };
    } finally {
      (!i && l && f(l), n && f(n), d && f(d));
    }
  }
  async function da(r, o, e, a, t) {
    let i = a instanceof H;
    if ((F(r), !Number.isInteger(o) || !Number.isInteger(t)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (i && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) throw new Error("incx must be positive.");
    if ((W(r, "dscal", { x: a }), o <= 0)) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let l = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: d } = z(new Float64Array([e])),
      u = null,
      m = null,
      w = null,
      c = null,
      p = null;
    try {
      if (i) ((u = a._buf), (m = a._loBuf));
      else {
        let { hi: A, lo: k } = z(a);
        ((u = b(r, A, "dscal-xHi", !0)), (m = b(r, k, "dscal-xLo", !0)));
      }
      w = T(
        r,
        [
          { value: o, type: "u32" },
          { value: n[0], type: "f32" },
          { value: d[0], type: "f32" },
          { value: t, type: "u32" },
        ],
        "dscal-params",
      );
      let g = N(r, l.getBindGroupLayout(0), [u, m, w]),
        { commandEncoder: y, ts: h } = $(r, l, g, _r(r, o));
      ((c = i ? null : D(r, y, u)), (p = i ? null : D(r, y, m)), j(r, y));
      let x = await C(h);
      if (i) return x !== void 0 ? { gpuTimeMs: x } : {};
      let _ = await G(c, Float32Array);
      c = null;
      let v = await G(p, Float32Array);
      p = null;
      let B = cr(_, v);
      return x !== void 0 ? { x: B, gpuTimeMs: x } : { x: B };
    } finally {
      (!i && u && f(u), !i && m && f(m), w && f(w), c && f(c), p && f(p));
    }
  }
  async function fa(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "sswap", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof H))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(t instanceof Float32Array) && !(t instanceof H))
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
      u = null,
      m = null,
      w = null,
      c = null;
    try {
      ((d = s ? e._buf : b(r, e, "sswap-x", !0)),
        (u = l ? t._buf : b(r, t, "sswap-y", !0)),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sswap-params",
        )));
      let p = N(r, n.getBindGroupLayout(0), [d, u, m]),
        { commandEncoder: g, ts: y } = $(r, n, p, _r(r, o));
      ((w = s ? null : D(r, g, d)), (c = l ? null : D(r, g, u)), j(r, g));
      let h = await C(y);
      if (s) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await G(w, Float32Array);
      w = null;
      let _ = await G(c, Float32Array);
      return (
        (c = null),
        h !== void 0 ? { x, y: _, gpuTimeMs: h } : { x, y: _ }
      );
    } finally {
      (!s && d && f(d), !l && u && f(u), m && f(m), w && f(w), c && f(c));
    }
  }
  async function ma(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "dswap", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !l)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (l && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== l)
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
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      h = null;
    try {
      if (s) ((d = e._buf), (u = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let L = z(e),
          R = z(t);
        ((d = b(r, L.hi, "dswap-xHi", !0)),
          (u = b(r, L.lo, "dswap-xLo", !0)),
          (m = b(r, R.hi, "dswap-yHi", !0)),
          (w = b(r, R.lo, "dswap-yLo", !0)));
      }
      c = T(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dswap-params",
      );
      let x = N(r, n.getBindGroupLayout(0), [d, u, m, w, c]),
        { commandEncoder: _, ts: v } = $(r, n, x, _r(r, o));
      ((p = s ? null : D(r, _, d)),
        (g = s ? null : D(r, _, u)),
        (y = l ? null : D(r, _, m)),
        (h = l ? null : D(r, _, w)),
        j(r, _));
      let B = await C(v);
      if (s) return B !== void 0 ? { gpuTimeMs: B } : {};
      let A = await G(p, Float32Array);
      p = null;
      let k = await G(g, Float32Array);
      g = null;
      let I = await G(y, Float32Array);
      y = null;
      let M = await G(h, Float32Array);
      h = null;
      let S = cr(A, k),
        E = cr(I, M);
      return B !== void 0 ? { x: S, y: E, gpuTimeMs: B } : { x: S, y: E };
    } finally {
      (!s && d && f(d),
        !s && u && f(u),
        !l && m && f(m),
        !l && w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y),
        h && f(h));
    }
  }
  async function ca(r, o, e, a, t, i, s) {
    let l = a instanceof H,
      n = i instanceof H;
    if (
      (F(r),
      W(r, "saxpy", { x: a, y: i }),
      !Number.isInteger(o) || !Number.isInteger(t) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!l && !(a instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(i instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (l !== n)
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
      u = null,
      m = null,
      w = null,
      c = null;
    try {
      ((u = l ? a._buf : b(r, a, "saxpy-x", !1)),
        (m = n ? i._buf : b(r, i, "saxpy-y", !0)),
        (w = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
            { value: s, type: "u32" },
          ],
          "saxpy-params",
        )));
      let p = N(r, d.getBindGroupLayout(0), [u, m, w]),
        { commandEncoder: g, ts: y } = $(r, d, p, _r(r, o));
      ((c = n ? null : D(r, g, m)), j(r, g));
      let h = await C(y);
      if (n) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await G(c, Float32Array);
      return ((c = null), h !== void 0 ? { y: x, gpuTimeMs: h } : { y: x });
    } finally {
      (!l && u && f(u), !n && m && f(m), w && f(w), c && f(c));
    }
  }
  async function pa(r, o, e, a, t, i, s) {
    let l = a instanceof H,
      n = i instanceof H;
    if (
      (F(r),
      !Number.isInteger(o) || !Number.isInteger(t) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !l)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(i instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (l && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && i.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (l !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if ((W(r, "daxpy", { x: a, y: i }), o <= 0)) return n ? {} : { y: i };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (o - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let u = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: m, lo: w } = z(new Float64Array([e])),
      c = null,
      p = null,
      g = null,
      y = null,
      h = null,
      x = null,
      _ = null;
    try {
      if (l) ((c = a._buf), (p = a._loBuf), (g = i._buf), (y = i._loBuf));
      else {
        let E = z(a),
          L = z(i);
        ((c = b(r, E.hi, "daxpy-xHi", !1)),
          (p = b(r, E.lo, "daxpy-xLo", !1)),
          (g = b(r, L.hi, "daxpy-yHi", !0)),
          (y = b(r, L.lo, "daxpy-yLo", !0)));
      }
      h = T(
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
      let v = N(r, u.getBindGroupLayout(0), [c, p, g, y, h]),
        { commandEncoder: B, ts: A } = $(r, u, v, _r(r, o));
      ((x = n ? null : D(r, B, g)), (_ = n ? null : D(r, B, y)), j(r, B));
      let k = await C(A);
      if (n) return k !== void 0 ? { gpuTimeMs: k } : {};
      let I = await G(x, Float32Array);
      x = null;
      let M = await G(_, Float32Array);
      _ = null;
      let S = cr(I, M);
      return k !== void 0 ? { y: S, gpuTimeMs: k } : { y: S };
    } finally {
      (!l && c && f(c),
        !l && p && f(p),
        !n && g && f(g),
        !n && y && f(y),
        h && f(h),
        x && f(x),
        _ && f(_));
    }
  }
  async function wa(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "scopy", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!l && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== l)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0) return l ? {} : { y: t };
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
      u = null,
      m = null,
      w = null;
    try {
      ((d = s ? e._buf : b(r, e, "scopy-x", !1)),
        (u = l ? t._buf : b(r, t, "scopy-y", !0)),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "scopy-params",
        )));
      let c = N(r, n.getBindGroupLayout(0), [d, u, m]),
        { commandEncoder: p, ts: g } = $(r, n, c, _r(r, o));
      ((w = l ? null : D(r, p, u)), j(r, p));
      let y = await C(g);
      if (l) return y !== void 0 ? { gpuTimeMs: y } : {};
      let h = await G(w, Float32Array);
      return ((w = null), y !== void 0 ? { y: h, gpuTimeMs: y } : { y: h });
    } finally {
      (!s && d && f(d), !l && u && f(u), m && f(m), w && f(w));
    }
  }
  async function ga(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "dcopy", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !l)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (l && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== l)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0) return l ? {} : { y: t };
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
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      if (s) ((d = e._buf), (u = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let k = z(e),
          I = z(t);
        ((d = b(r, k.hi, "dcopy-xHi", !1)),
          (u = b(r, k.lo, "dcopy-xLo", !1)),
          (m = b(r, I.hi, "dcopy-yHi", !0)),
          (w = b(r, I.lo, "dcopy-yLo", !0)));
      }
      c = T(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dcopy-params",
      );
      let y = N(r, n.getBindGroupLayout(0), [d, u, m, w, c]),
        { commandEncoder: h, ts: x } = $(r, n, y, _r(r, o));
      ((p = l ? null : D(r, h, m)), (g = l ? null : D(r, h, w)), j(r, h));
      let _ = await C(x);
      if (l) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = await G(p, Float32Array);
      p = null;
      let B = await G(g, Float32Array);
      g = null;
      let A = cr(v, B);
      return _ !== void 0 ? { y: A, gpuTimeMs: _ } : { y: A };
    } finally {
      (!s && d && f(d),
        !s && u && f(u),
        !l && m && f(m),
        !l && w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function ha(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "sdot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!l && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (s !== l)
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
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((u = s ? e._buf : b(r, e, "sdot-x", !1)),
        (m = l ? t._buf : b(r, t, "sdot-y", !1)),
        (w = lr(r, 512, "sdot-partials")),
        (c = Lr(r, 4, "sdot-result")),
        (p = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sdot-params",
        )));
      let y = N(r, n.getBindGroupLayout(0), [u, m, w, p]),
        { commandEncoder: h, ts: x } = $(r, n, y, 128);
      j(r, h);
      let _ = N(r, d.getBindGroupLayout(0), [w, c]),
        { commandEncoder: v, ts: B } = $(r, d, _, 1);
      ((g = D(r, v, c)), j(r, v));
      let A = G(g, Float32Array);
      g = null;
      let [k, I, M] = await Promise.all([C(x), C(B), A]);
      return k !== void 0 && I !== void 0
        ? { dot: M[0], gpuTimeMs: k + I }
        : { dot: M[0] };
    } finally {
      (!s && u && f(u),
        !l && m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function ba(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "sasum", { x: e }),
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
      l = null,
      n = null,
      d = null,
      u = null,
      m = null;
    try {
      ((l = t ? e._buf : b(r, e, "sasum-x", !1)),
        (n = lr(r, 512, "sasum-partials")),
        (d = Lr(r, 4, "sasum-result")),
        (u = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "sasum-params",
        )));
      let w = N(r, i.getBindGroupLayout(0), [l, n, u]),
        { commandEncoder: c, ts: p } = $(r, i, w, 128);
      j(r, c);
      let g = N(r, s.getBindGroupLayout(0), [n, d]),
        { commandEncoder: y, ts: h } = $(r, s, g, 1);
      ((m = D(r, y, d)), j(r, y));
      let x = G(m, Float32Array);
      m = null;
      let [_, v, B] = await Promise.all([C(p), C(h), x]);
      return _ !== void 0 && v !== void 0
        ? { asum: B[0], gpuTimeMs: _ + v }
        : { asum: B[0] };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m));
    }
  }
  async function ya(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "dasum", { x: e }),
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
      l = await P(r, [...i, "reduction/sumF64"]),
      n = null,
      d = null,
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: q, lo: O } = z(e.map(Math.abs));
        ((n = b(r, q, "dasum-xHi", !1)), (d = b(r, O, "dasum-xLo", !1)));
      }
      ((u = lr(r, 512, "dasum-partialsHi")),
        (m = lr(r, 512, "dasum-partialsLo")),
        (w = Lr(r, 4, "dasum-result-hi")),
        (c = Lr(r, 4, "dasum-result-lo")),
        (p = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dasum-params",
        )));
      let h = N(r, s.getBindGroupLayout(0), [n, d, u, m, p]),
        { commandEncoder: x, ts: _ } = $(r, s, h, 128);
      j(r, x);
      let v = N(r, l.getBindGroupLayout(0), [u, m, w, c]),
        { commandEncoder: B, ts: A } = $(r, l, v, 1);
      ((g = D(r, B, w)), (y = D(r, B, c)), j(r, B));
      let k = G(g, Float32Array),
        I = G(y, Float32Array);
      ((g = null), (y = null));
      let [M, S, E, L] = await Promise.all([C(_), C(A), k, I]),
        R = cr(E, L)[0];
      return M !== void 0 && S !== void 0
        ? { asum: R, gpuTimeMs: M + S }
        : { asum: R };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y));
    }
  }
  async function xa(r, o, e, a, t, i) {
    let s = e instanceof H,
      l = t instanceof H;
    if (
      (F(r),
      W(r, "ddot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!s && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!l && !(t instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (s && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (l && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (s !== l)
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
      u = await P(r, [...n, "reduction/sumF64"]),
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null;
    try {
      if (s) ((m = e._buf), (w = e._loBuf), (c = t._buf), (p = t._loBuf));
      else {
        let V = z(e),
          K = z(t);
        ((m = b(r, V.hi, "ddot-xHi", !1)),
          (w = b(r, V.lo, "ddot-xLo", !1)),
          (c = b(r, K.hi, "ddot-yHi", !1)),
          (p = b(r, K.lo, "ddot-yLo", !1)));
      }
      ((g = lr(r, 512, "ddot-partialsHi")),
        (y = lr(r, 512, "ddot-partialsLo")),
        (h = Lr(r, 4, "ddot-result-hi")),
        (x = Lr(r, 4, "ddot-result-lo")),
        (_ = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "ddot-params",
        )));
      let A = N(r, d.getBindGroupLayout(0), [m, w, c, p, g, y, _]),
        { commandEncoder: k, ts: I } = $(r, d, A, 128);
      j(r, k);
      let M = N(r, u.getBindGroupLayout(0), [g, y, h, x]),
        { commandEncoder: S, ts: E } = $(r, u, M, 1);
      ((v = D(r, S, h)), (B = D(r, S, x)), j(r, S));
      let L = G(v, Float32Array),
        R = G(B, Float32Array);
      ((v = null), (B = null));
      let [q, O, Z, X] = await Promise.all([C(I), C(E), L, R]),
        Y = cr(Z, X)[0];
      return q !== void 0 && O !== void 0
        ? { dot: Y, gpuTimeMs: q + O }
        : { dot: Y };
    } finally {
      (!s && m && f(m),
        !s && w && f(w),
        !l && c && f(c),
        !l && p && f(p),
        g && f(g),
        y && f(y),
        h && f(h),
        x && f(x),
        _ && f(_),
        v && f(v),
        B && f(B));
    }
  }
  async function va(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "snrm2", { x: e }),
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
      l = null,
      n = null,
      d = null,
      u = null,
      m = null,
      w = null;
    try {
      ((l = t ? e._buf : b(r, e, "snrm2-x", !1)),
        (n = lr(r, 512, "snrm2-partials-scale")),
        (d = lr(r, 512, "snrm2-partials-ssq")),
        (u = Lr(r, 4, "snrm2-result")),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "snrm2-params",
        )));
      let c = N(r, i.getBindGroupLayout(0), [l, n, d, m]),
        { commandEncoder: p, ts: g } = $(r, i, c, 128);
      j(r, p);
      let y = N(r, s.getBindGroupLayout(0), [n, d, u]),
        { commandEncoder: h, ts: x } = $(r, s, y, 1);
      ((w = D(r, h, u)), j(r, h));
      let _ = G(w, Float32Array);
      w = null;
      let [v, B, A] = await Promise.all([C(g), C(x), _]),
        k = A[0];
      return v !== void 0 && B !== void 0
        ? { nrm2: k, gpuTimeMs: v + B }
        : { nrm2: k };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m), w && f(w));
    }
  }
  async function Ba(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "dnrm2", { x: e }),
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
      l = await P(r, [...i, "reduction/scaledSumF64"]),
      n = null,
      d = null,
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null,
      y = null,
      h = null,
      x = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: Z, lo: X } = z(e);
        ((n = b(r, Z, "dnrm2-xHi", !1)), (d = b(r, X, "dnrm2-xLo", !1)));
      }
      ((u = lr(r, 512, "dnrm2-partials-scaleHi")),
        (m = lr(r, 512, "dnrm2-partials-scaleLo")),
        (w = lr(r, 512, "dnrm2-partials-ssqHi")),
        (c = lr(r, 512, "dnrm2-partials-ssqLo")),
        (p = Lr(r, 4, "dnrm2-result-hi")),
        (g = Lr(r, 4, "dnrm2-result-lo")),
        (y = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let _ = N(r, s.getBindGroupLayout(0), [n, d, u, m, w, c, y]),
        { commandEncoder: v, ts: B } = $(r, s, _, 128);
      j(r, v);
      let A = N(r, l.getBindGroupLayout(0), [u, m, w, c, p, g]),
        { commandEncoder: k, ts: I } = $(r, l, A, 1);
      ((h = D(r, k, p)), (x = D(r, k, g)), j(r, k));
      let M = G(h, Float32Array),
        S = G(x, Float32Array);
      ((h = null), (x = null));
      let [E, L, R, q] = await Promise.all([C(B), C(I), M, S]),
        O = cr(R, q)[0];
      return E !== void 0 && L !== void 0
        ? { nrm2: O, gpuTimeMs: E + L }
        : { nrm2: O };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g),
        y && f(y),
        h && f(h),
        x && f(x));
    }
  }
  async function _a(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "isamax", { x: e }),
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
      l = null,
      n = null,
      d = null,
      u = null,
      m = null,
      w = null;
    try {
      ((l = t ? e._buf : b(r, e, "isamax-x", !1)),
        (n = lr(r, 512, "isamax-partials-val")),
        (d = lr(r, 512, "isamax-partials-idx")),
        (u = Lr(r, 4, "isamax-result")),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "isamax-params",
        )));
      let c = N(r, i.getBindGroupLayout(0), [l, n, d, m]),
        { commandEncoder: p, ts: g } = $(r, i, c, 128);
      j(r, p);
      let y = N(r, s.getBindGroupLayout(0), [n, d, u]),
        { commandEncoder: h, ts: x } = $(r, s, y, 1);
      ((w = D(r, h, u)), j(r, h));
      let _ = G(w, Uint32Array);
      w = null;
      let [v, B, A] = await Promise.all([C(g), C(x), _]),
        k = A[0];
      return v !== void 0 && B !== void 0
        ? { index: k, gpuTimeMs: v + B }
        : { index: k };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m), w && f(w));
    }
  }
  async function ka(r, o, e, a) {
    let t = e instanceof H;
    if (
      (F(r),
      W(r, "idamax", { x: e }),
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
      l = await P(r, [...i, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      d = null,
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: E, lo: L } = z(e);
        ((n = b(r, E, "idamax-xHi", !1)), (d = b(r, L, "idamax-xLo", !1)));
      }
      ((u = lr(r, 512, "idamax-partials-val-hi")),
        (m = lr(r, 512, "idamax-partials-val-lo")),
        (w = lr(r, 512, "idamax-partials-idx")),
        (c = Lr(r, 4, "idamax-result")),
        (p = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "idamax-params",
        )));
      let y = N(r, s.getBindGroupLayout(0), [n, d, u, m, w, p]),
        { commandEncoder: h, ts: x } = $(r, s, y, 128);
      j(r, h);
      let _ = N(r, l.getBindGroupLayout(0), [u, m, w, c]),
        { commandEncoder: v, ts: B } = $(r, l, _, 1);
      ((g = D(r, v, c)), j(r, v));
      let A = G(g, Uint32Array);
      g = null;
      let [k, I, M] = await Promise.all([C(x), C(B), A]),
        S = M[0];
      return k !== void 0 && I !== void 0
        ? { index: S, gpuTimeMs: k + I }
        : { index: S };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function Aa(r, o, e, a, t, i, s, l) {
    let n = e instanceof H,
      d = t instanceof H;
    if (
      (F(r),
      W(r, "srot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof l != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(l))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(l)) throw new Error("s must be finite.");
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
    let u = await P(r, "srot"),
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((m = n ? e._buf : b(r, e, "srot-x", !0)),
        (w = d ? t._buf : b(r, t, "srot-y", !0)),
        (c = T(
          r,
          [
            { value: o, type: "u32" },
            { value: s, type: "f32" },
            { value: l, type: "f32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srot-params",
        )));
      let y = N(r, u.getBindGroupLayout(0), [m, w, c]),
        { commandEncoder: h, ts: x } = $(r, u, y, _r(r, o));
      ((p = n ? null : D(r, h, m)), (g = d ? null : D(r, h, w)), j(r, h));
      let _ = await C(x);
      if (n) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = G(p, Float32Array),
        B = G(g, Float32Array);
      ((p = null), (g = null));
      let [A, k] = await Promise.all([v, B]);
      return _ !== void 0 ? { x: A, y: k, gpuTimeMs: _ } : { x: A, y: k };
    } finally {
      (!n && m && f(m), !d && w && f(w), c && f(c), p && f(p), g && f(g));
    }
  }
  async function Sa(r, o, e, a, t, i, s, l) {
    let n = e instanceof H,
      d = t instanceof H;
    if (
      (F(r),
      W(r, "drot", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof s != "number") throw new Error("c must be a number.");
    if (typeof l != "number") throw new Error("s must be a number.");
    if (Number.isNaN(s) || Number.isNaN(l))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("c must be finite.");
    if (!Number.isFinite(l)) throw new Error("s must be finite.");
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
      { hi: w, lo: c } = z(new Float64Array([s])),
      { hi: p, lo: g } = z(new Float64Array([l])),
      y = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      A = null,
      k = null,
      I = null;
    try {
      if (n) ((y = e._buf), (h = e._loBuf), (x = t._buf), (_ = t._loBuf));
      else {
        let V = z(e),
          K = z(t);
        ((y = b(r, V.hi, "drot-xHi", !0)),
          (h = b(r, V.lo, "drot-xLo", !0)),
          (x = b(r, K.hi, "drot-yHi", !0)),
          (_ = b(r, K.lo, "drot-yLo", !0)));
      }
      v = T(
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
      let M = N(r, m.getBindGroupLayout(0), [y, h, x, _, v]),
        { commandEncoder: S, ts: E } = $(r, m, M, _r(r, o));
      ((B = n ? null : D(r, S, y)),
        (A = n ? null : D(r, S, h)),
        (k = d ? null : D(r, S, x)),
        (I = d ? null : D(r, S, _)),
        j(r, S));
      let L = await C(E);
      if (n) return L !== void 0 ? { gpuTimeMs: L } : {};
      let R = await G(B, Float32Array);
      B = null;
      let q = await G(A, Float32Array);
      A = null;
      let O = await G(k, Float32Array);
      k = null;
      let Z = await G(I, Float32Array);
      I = null;
      let X = cr(R, q),
        Y = cr(O, Z);
      return L !== void 0 ? { x: X, y: Y, gpuTimeMs: L } : { x: X, y: Y };
    } finally {
      (!n && y && f(y),
        !n && h && f(h),
        !d && x && f(x),
        !d && _ && f(_),
        v && f(v),
        B && f(B),
        A && f(A),
        k && f(k),
        I && f(I));
    }
  }
  async function Ea(r, o, e, a, t, i, s) {
    let l = e instanceof H,
      n = t instanceof H;
    if (
      (F(r),
      W(r, "srotm", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float32Array) || s.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!l && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (l !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (o <= 0 || s[0] === -2) return l ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let d = await P(r, "srotm"),
      u = null,
      m = null,
      w = null,
      c = null,
      p = null,
      g = null;
    try {
      ((u = l ? e._buf : b(r, e, "srotm-x", !0)),
        (m = n ? t._buf : b(r, t, "srotm-y", !0)),
        (w = b(r, s, "srotm-param", !1)),
        (c = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srotm-params",
        )));
      let y = N(r, d.getBindGroupLayout(0), [u, m, w, c]),
        { commandEncoder: h, ts: x } = $(r, d, y, _r(r, o));
      ((p = l ? null : D(r, h, u)), (g = n ? null : D(r, h, m)), j(r, h));
      let _ = await C(x);
      if (l) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = G(p, Float32Array),
        B = G(g, Float32Array);
      ((p = null), (g = null));
      let [A, k] = await Promise.all([v, B]);
      return _ !== void 0 ? { x: A, y: k, gpuTimeMs: _ } : { x: A, y: k };
    } finally {
      (!l && u && f(u),
        !n && m && f(m),
        w && f(w),
        c && f(c),
        p && f(p),
        g && f(g));
    }
  }
  async function Ga(r, o, e, a, t, i, s) {
    let l = e instanceof H,
      n = t instanceof H;
    if (
      (F(r),
      W(r, "drotm", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(s instanceof Float64Array) || s.length !== 5)
      throw new Error("param must be a Float64Array of length 5.");
    if (s[0] !== -2 && s[0] !== -1 && s[0] !== 0 && s[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !l)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (l && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (l !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (o <= 0 || s[0] === -2) return l ? {} : { x: e, y: t };
    if (e.length < (o - 1) * a + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (o - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let u = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drotm",
      ]),
      { hi: m, lo: w } = z(s),
      c = null,
      p = null,
      g = null,
      y = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      A = null,
      k = null;
    try {
      if (l) ((c = e._buf), (p = e._loBuf), (g = t._buf), (y = t._loBuf));
      else {
        let Y = z(e),
          V = z(t);
        ((c = b(r, Y.hi, "drotm-xHi", !0)),
          (p = b(r, Y.lo, "drotm-xLo", !0)),
          (g = b(r, V.hi, "drotm-yHi", !0)),
          (y = b(r, V.lo, "drotm-yLo", !0)));
      }
      ((h = b(r, m, "drotm-paramHi", !1)),
        (x = b(r, w, "drotm-paramLo", !1)),
        (_ = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "drotm-params",
        )));
      let I = N(r, u.getBindGroupLayout(0), [c, p, g, y, h, x, _]),
        { commandEncoder: M, ts: S } = $(r, u, I, _r(r, o));
      ((v = l ? null : D(r, M, c)),
        (B = l ? null : D(r, M, p)),
        (A = n ? null : D(r, M, g)),
        (k = n ? null : D(r, M, y)),
        j(r, M));
      let E = await C(S);
      if (l) return E !== void 0 ? { gpuTimeMs: E } : {};
      let L = await G(v, Float32Array);
      v = null;
      let R = await G(B, Float32Array);
      B = null;
      let q = await G(A, Float32Array);
      A = null;
      let O = await G(k, Float32Array);
      k = null;
      let Z = cr(L, R),
        X = cr(q, O);
      return E !== void 0 ? { x: Z, y: X, gpuTimeMs: E } : { x: Z, y: X };
    } finally {
      (!l && c && f(c),
        !l && p && f(p),
        !n && g && f(g),
        !n && y && f(y),
        h && f(h),
        x && f(x),
        _ && f(_),
        v && f(v),
        B && f(B),
        A && f(A),
        k && f(k));
    }
  }
  async function La(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let c = i instanceof Q,
      p = l instanceof H,
      g = u instanceof H;
    if (
      (F(r),
      W(r, "sgemv", { A: i, x: l, y: u }),
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
    if (!p && !(l instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (p && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && l._buf === u._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && g && i._buf === u._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: u };
    (c ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let h = o === "no-transpose",
      x = h ? a : e,
      _ = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (l.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (u.length < (_ - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let B = await P(r, h ? "sgemv_n" : "sgemv_t"),
      A = h ? 1 : Math.ceil(e / 256),
      k = A > 1 ? await P(r, "reduce_partials") : null,
      I = null,
      M = null,
      S = null,
      E = null,
      L = null,
      R = null;
    try {
      ((I = c ? i._buf : b(r, i, "sgemv-A", !1)),
        (M = p ? l._buf : b(r, l, "sgemv-x", !1)),
        (S = g ? u._buf : b(r, u, "sgemv-y", !0)));
      let q;
      h
        ? ((E = T(
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
          )),
          (q = [
            {
              pipeline: B,
              bindGroup: N(r, B.getBindGroupLayout(0), [I, M, S, E]),
              workgroups: Math.min(
                e,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ]))
        : (A > 1 &&
            ((L = lr(r, A * a * 4, "sgemv-partials")),
            (R = T(
              r,
              [
                { value: a, type: "u32" },
                { value: A, type: "u32" },
                { value: m, type: "u32" },
                { value: t, type: "f32" },
                { value: d, type: "f32" },
              ],
              "sgemv-reduce-params",
            ))),
          (E = T(
            r,
            [
              { value: e, type: "u32" },
              { value: a, type: "u32" },
              { value: t, type: "f32" },
              { value: d, type: "f32" },
              { value: n, type: "u32" },
              { value: m, type: "u32" },
              { value: s, type: "u32" },
              { value: 256, type: "u32" },
              { value: A > 1 ? 0 : 1, type: "u32" },
            ],
            "sgemv-t-params",
          )),
          (q = [
            {
              pipeline: B,
              bindGroup: N(r, B.getBindGroupLayout(0), [I, M, L ?? S, E]),
              workgroups: {
                x: sr(r, Math.ceil(a / 64), "sgemv", "x"),
                y: sr(r, A, "sgemv", "y"),
              },
            },
          ]),
          A > 1 &&
            q.push({
              pipeline: k,
              bindGroup: N(r, k.getBindGroupLayout(0), [L, S, R]),
              workgroups: Math.min(
                Math.ceil(a / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }));
      let { commandEncoder: O, ts: Z } = zr(r, q),
        X = g ? null : D(r, O, S);
      j(r, O);
      let Y = await C(Z);
      if (g) return Y !== void 0 ? { gpuTimeMs: Y } : {};
      let V = await G(X, Float32Array);
      return Y !== void 0 ? { y: V, gpuTimeMs: Y } : { y: V };
    } finally {
      (!c && I && f(I),
        !p && M && f(M),
        !g && S && f(S),
        E && f(E),
        L && f(L),
        R && f(R));
    }
  }
  async function Yr(r, o, e, a, t) {
    let i = await P(r, "gather_strided"),
      s = lr(r, e * 4, t),
      l = T(
        r,
        [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
        ],
        `${t}-params`,
      ),
      n = N(r, i.getBindGroupLayout(0), [o, s, l]),
      d = Math.min(
        Math.ceil(e / 64),
        r.limits.maxComputeWorkgroupsPerDimension,
      );
    return {
      buffer: s,
      params: l,
      pass: { pipeline: i, bindGroup: n, workgroups: d },
    };
  }
  async function Da(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof H,
      c = d instanceof H,
      p = t instanceof Q;
    if (
      (F(r),
      W(r, "ssymv", { A: t, x: s, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(l) ||
      !Number.isInteger(u) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (l <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let y =
        (p ? t.layout : m) === "column-major" ? o === "upper" : o === "lower",
      h = await P(r, "ssymv"),
      x = await P(r, "reduce_partials"),
      _ = Math.ceil(e / 32),
      v = null,
      B = null,
      A = null,
      k = null,
      I = null,
      M = null,
      S = null;
    try {
      ((v = p ? t._buf : b(r, t, "ssymv-A", !1)),
        (B = w ? s._buf : b(r, s, "ssymv-x", !1)),
        (A = c ? d._buf : b(r, d, "ssymv-y", !0)),
        l > 1 && (S = await Yr(r, B, e, l, "ssymv-x-packed")),
        (I = lr(r, _ * e * 4, "ssymv-partials")),
        (k = T(
          r,
          [
            { value: e, type: "u32" },
            { value: i, type: "u32" },
            { value: y ? 0 : 1, type: "u32" },
            { value: _, type: "u32" },
          ],
          "ssymv-params",
        )),
        (M = T(
          r,
          [
            { value: e, type: "u32" },
            { value: _, type: "u32" },
            { value: u, type: "u32" },
            { value: a, type: "f32" },
            { value: n, type: "f32" },
          ],
          "ssymv-reduce-params",
        )));
      let E = (_ * (_ + 1)) / 2,
        L = r.limits.maxComputeWorkgroupsPerDimension,
        R = Math.min(E, L),
        q = sr(r, Math.ceil(E / R), "ssymv", "y"),
        O = [
          ...(S ? [S.pass] : []),
          {
            pipeline: h,
            bindGroup: N(r, h.getBindGroupLayout(0), [
              v,
              S ? S.buffer : B,
              I,
              k,
            ]),
            workgroups: { x: R, y: q },
          },
          {
            pipeline: x,
            bindGroup: N(r, x.getBindGroupLayout(0), [I, A, M]),
            workgroups: Math.min(
              Math.ceil(e / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          },
        ],
        { commandEncoder: Z, ts: X } = zr(r, O),
        Y = c ? null : D(r, Z, A);
      j(r, Z);
      let V = await C(X);
      if (c) return V !== void 0 ? { gpuTimeMs: V } : {};
      let K = await G(Y, Float32Array);
      return V !== void 0 ? { y: K, gpuTimeMs: V } : { y: K };
    } finally {
      (!p && v && f(v),
        !w && B && f(B),
        !c && A && f(A),
        k && f(k),
        I && f(I),
        M && f(M),
        S && f(S.buffer, S.params));
    }
  }
  async function Na(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = l instanceof H,
      c = d instanceof H,
      p = i instanceof Q,
      g = a === "unit";
    if (
      (F(r),
      W(r, "strmv", { A: i, x: l, y: d }),
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
      !Number.isInteger(u) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!p && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(l instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && l._buf === d._buf)
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
    if (l.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (t - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h = (p ? i.layout : m) === "column-major",
      x = h ? o === "upper" : o === "lower",
      v = !(h ? e === "transpose" : e === "no-transpose"),
      B = v ? Math.ceil(t / 256) : 1,
      A = await P(r, v ? "strmv_t" : "strmv"),
      k = B > 1 ? await P(r, "reduce_partials") : null,
      I = null,
      M = null,
      S = null,
      E = null,
      L = null,
      R = null,
      q = null;
    try {
      ((I = p ? i._buf : b(r, i, "strmv-A", !1)),
        (M = w ? l._buf : b(r, l, "strmv-x", !1)),
        (S = c ? d._buf : b(r, d, "strmv-y", !0)),
        n > 1 && (q = await Yr(r, M, t, n, "strmv-x-packed")));
      let O = q ? q.buffer : M,
        Z = q ? 1 : n,
        X;
      (v
        ? (B > 1 &&
            ((L = lr(r, B * t * 4, "strmv-partials")),
            (R = T(
              r,
              [
                { value: t, type: "u32" },
                { value: B, type: "u32" },
                { value: u, type: "u32" },
                { value: 1, type: "f32" },
                { value: 0, type: "f32" },
              ],
              "strmv-reduce-params",
            ))),
          (E = T(
            r,
            [
              { value: t, type: "u32" },
              { value: Z, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
              { value: 256, type: "u32" },
              { value: B > 1 ? 0 : 1, type: "u32" },
            ],
            "strmv-t-params",
          )),
          (X = [
            {
              pipeline: A,
              bindGroup: N(r, A.getBindGroupLayout(0), [I, O, L ?? S, E]),
              workgroups: {
                x: sr(r, Math.ceil(t / 64), "strmv", "x"),
                y: sr(r, B, "strmv", "y"),
              },
            },
          ]),
          B > 1 &&
            X.push({
              pipeline: k,
              bindGroup: N(r, k.getBindGroupLayout(0), [L, S, R]),
              workgroups: Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }))
        : ((E = T(
            r,
            [
              { value: t, type: "u32" },
              { value: Z, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: 0, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
            ],
            "strmv-params",
          )),
          (X = [
            {
              pipeline: A,
              bindGroup: N(r, A.getBindGroupLayout(0), [I, O, S, E]),
              workgroups: Math.min(
                t,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ])),
        q && X.unshift(q.pass));
      let { commandEncoder: Y, ts: V } = zr(r, X),
        K = c ? null : D(r, Y, S);
      j(r, Y);
      let U = await C(V);
      if (c) return U !== void 0 ? { gpuTimeMs: U } : {};
      let tr = await G(K, Float32Array);
      return U !== void 0 ? { y: tr, gpuTimeMs: U } : { y: tr };
    } finally {
      (!p && I && f(I),
        !w && M && f(M),
        !c && S && f(S),
        E && f(E),
        L && f(L),
        R && f(R),
        q && f(q.buffer, q.params));
    }
  }
  function Ss(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        l = i * o;
      s.forEach((n, d) => t.setUint32(l + d * 4, n, !0));
    }
    return a;
  }
  var Ma = 48,
    Es = 2;
  function Ia(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function Ra(r, o, e, a, t, i, s, l, n, d = "row-major") {
    let u = l instanceof H,
      m = i instanceof Q,
      w = a === "unit";
    if ((F(r), W(r, "strsv", { A: i, x: l }), o !== "lower" && o !== "upper"))
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
    if (!u && !(l instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (u && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !u)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && u && i._buf === l._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return u ? {} : { x: l };
    if (!m && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (l.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p = (m ? i.layout : d) === "column-major",
      g = p ? o === "upper" : o === "lower",
      y = p ? e === "transpose" : e === "no-transpose",
      h = await P(r, "strsv_invert_block"),
      x = await P(r, "strsv_step"),
      _ = await P(r, "scatter_strided"),
      v = y === g,
      B = [];
    for (let Y = 0; Y < t; Y += 64) B.push(Y);
    v || B.reverse();
    let A = B.length,
      k = r.limits.minUniformBufferOffsetAlignment,
      I = A <= Es,
      M = (Y) =>
        Ss(A, k, (V) => {
          let K = V * 64,
            U = Math.min(K + 64, t),
            tr = v ? U : 0,
            rr = v ? t - U : K;
          return [n, s, y ? 0 : 1, V, K, U, tr, rr, Y];
        }),
      S = null,
      E = null,
      L = null,
      R = null,
      q = null,
      O = null,
      Z = null,
      X = [];
    try {
      ((S = m ? i._buf : b(r, i, "strsv-A", !1)),
        (E = u ? l._buf : b(r, l, "strsv-x", !0)));
      let { commandEncoder: Y, querySet: V, passDescriptor: K } = Hr(r),
        U = Y.beginComputePass(K);
      if (I) {
        let ur = await P(r, "strsm_small");
        ((R = lr(r, t * 4, "strsv-sol")),
          A > 1 && (q = Ia(r, M(1), "strsv-step-params")));
        let ar = y ? s : 1,
          er = y ? 1 : s;
        for (let ir of B) {
          let gr = ir / 64,
            xr = Math.min(ir + 64, t),
            wr = xr - ir,
            nr = v ? t - xr : ir,
            hr = T(
              r,
              [
                { value: wr, type: "u32" },
                { value: 1, type: "u32" },
                { value: ir * (ar + er), type: "u32" },
                { value: ar, type: "u32" },
                { value: er, type: "u32" },
                { value: ir * n, type: "u32" },
                { value: n, type: "u32" },
                { value: 0, type: "u32" },
                { value: v ? 0 : 1, type: "u32" },
                { value: w ? 1 : 0, type: "u32" },
                { value: 1, type: "f32" },
                { value: nr > 0 ? 1 : 0, type: "u32" },
              ],
              "strsv-solve-params",
            );
          (X.push(hr),
            U.setPipeline(ur),
            U.setBindGroup(
              0,
              N(r, ur.getBindGroupLayout(0), [
                S,
                E,
                hr,
                { buffer: R, offset: ir * 4, size: wr * 4 },
              ]),
            ),
            U.dispatchWorkgroups(1),
            nr !== 0 &&
              (U.setPipeline(x),
              U.setBindGroup(
                0,
                N(r, x.getBindGroupLayout(0), [
                  S,
                  S,
                  E,
                  R,
                  { buffer: q, offset: gr * k, size: Ma },
                ]),
              ),
              U.dispatchWorkgroups(sr(r, Math.ceil(nr / 64), "strsv"))));
        }
      } else {
        ((L = lr(r, A * 64 * 64 * 4, "strsv-Ainv")),
          (R = lr(r, t * 4, "strsv-sol")),
          (q = Ia(r, M(0), "strsv-step-params")),
          (O = T(
            r,
            [
              { value: t, type: "u32" },
              { value: s, type: "u32" },
              { value: y ? 0 : 1, type: "u32" },
              { value: g ? 0 : 1, type: "u32" },
              { value: w ? 1 : 0, type: "u32" },
            ],
            "strsv-invert-params",
          )),
          (Z = T(
            r,
            [
              { value: t, type: "u32" },
              { value: n, type: "u32" },
            ],
            "strsv-scatter-params",
          )),
          U.setPipeline(h),
          U.setBindGroup(0, N(r, h.getBindGroupLayout(0), [S, L, O])),
          U.dispatchWorkgroups(A),
          U.setPipeline(x));
        for (let ur of B) {
          let ar = ur / 64,
            er = Math.min(ur + 64, t),
            ir = v ? t - er : ur;
          (U.setBindGroup(
            0,
            N(r, x.getBindGroupLayout(0), [
              S,
              L,
              E,
              R,
              { buffer: q, offset: ar * k, size: Ma },
            ]),
          ),
            U.dispatchWorkgroups(
              sr(r, Math.max(1, Math.ceil(ir / 64)), "strsv"),
            ));
        }
        (U.setPipeline(_),
          U.setBindGroup(0, N(r, _.getBindGroupLayout(0), [R, E, Z])),
          U.dispatchWorkgroups(
            Math.min(
              Math.ceil(t / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          ));
      }
      U.end();
      let tr = Dr(r, Y, V),
        rr = u ? null : D(r, Y, E);
      j(r, Y);
      let or = await C(tr);
      if (u) return or !== void 0 ? { gpuTimeMs: or } : {};
      let fr = await G(rr, Float32Array);
      return or !== void 0 ? { x: fr, gpuTimeMs: or } : { x: fr };
    } finally {
      (!m && S && f(S),
        !u && E && f(E),
        L && f(L),
        R && f(R),
        q && f(q),
        O && f(O),
        Z && f(Z),
        f(X));
    }
  }
  async function Ha(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = n instanceof Q;
    if (
      (F(r),
      W(r, "sger", { A: n, x: t, y: s }),
      u !== "row-major" && u !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < o || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : u) === "column-major" &&
      (([o, e] = [e, o]), ([t, s] = [s, t]), ([i, l] = [l, i]));
    let c = t instanceof H,
      p = s instanceof H;
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g = await P(r, "sger"),
      y = null,
      h = null,
      x = null,
      _ = null,
      v = null;
    try {
      ((y = c ? t._buf : b(r, t, "sger-x", !1)),
        (h = p ? s._buf : b(r, s, "sger-y", !1)),
        (x = m ? n._buf : b(r, n, "sger-A", !0)),
        l > 1 && (v = await Yr(r, h, e, l, "sger-y-packed")),
        (_ = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: i, type: "u32" },
            { value: v ? 1 : l, type: "u32" },
            { value: d, type: "u32" },
          ],
          "sger-params",
        )));
      let B = N(r, g.getBindGroupLayout(0), [y, v ? v.buffer : h, x, _]),
        A = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: k, ts: I } = zr(r, [
          ...(v ? [v.pass] : []),
          { pipeline: g, bindGroup: B, workgroups: A },
        ]),
        M = m ? null : D(r, k, x);
      j(r, k);
      let S = await C(I);
      if (m) return S !== void 0 ? { gpuTimeMs: S } : {};
      let E = await G(M, Float32Array);
      return S !== void 0 ? { A: E, gpuTimeMs: S } : { A: E };
    } finally {
      (!c && y && f(y),
        !p && h && f(h),
        !m && x && f(x),
        _ && f(_),
        v && f(v.buffer, v.params));
    }
  }
  async function Ta(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = n instanceof Q;
    if (
      (F(r),
      W(r, "dger", { A: n, x: t, y: s }),
      u !== "row-major" && u !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (i <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (m && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < o || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : u) === "column-major" &&
      (([o, e] = [e, o]), ([t, s] = [s, t]), ([i, l] = [l, i]));
    let c = t instanceof H,
      p = s instanceof H;
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let y = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dger"],
        "dger_main",
      ),
      { hi: h, lo: x } = z(new Float64Array([a])),
      _ = null,
      v = null,
      B = null,
      A = null,
      k = null,
      I = null,
      M = null,
      S = null,
      E = null;
    try {
      if (c)
        ((_ = t._buf),
          (v = t._loBuf),
          (B = s._buf),
          (A = s._loBuf),
          (k = n._buf),
          (I = n._loBuf));
      else {
        let K = z(t),
          U = z(s),
          tr = z(n);
        ((_ = b(r, K.hi, "dger-xHi", !1)),
          (v = b(r, K.lo, "dger-xLo", !1)),
          (B = b(r, U.hi, "dger-yHi", !1)),
          (A = b(r, U.lo, "dger-yLo", !1)),
          (k = b(r, tr.hi, "dger-AHi", !0)),
          (I = b(r, tr.lo, "dger-ALo", !0)));
      }
      M = T(
        r,
        [
          { value: o, type: "u32" },
          { value: e, type: "u32" },
          { value: h[0], type: "f32" },
          { value: x[0], type: "f32" },
          { value: i, type: "u32" },
          { value: l, type: "u32" },
          { value: d, type: "u32" },
        ],
        "dger-params",
      );
      let L = N(r, y.getBindGroupLayout(0), [_, v, B, A, k, I, M]),
        R = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: q, ts: O } = $(r, y, L, R);
      ((S = m ? null : D(r, q, k)), (E = m ? null : D(r, q, I)), j(r, q));
      let Z = await C(O);
      if (m) return Z !== void 0 ? { gpuTimeMs: Z } : {};
      let X = await G(S, Float32Array);
      S = null;
      let Y = await G(E, Float32Array);
      E = null;
      let V = cr(X, Y);
      return Z !== void 0 ? { A: V, gpuTimeMs: Z } : { A: V };
    } finally {
      (!c && _ && f(_),
        !c && v && f(v),
        !p && B && f(B),
        !p && A && f(A),
        !m && k && f(k),
        !m && I && f(I),
        M && f(M),
        S && f(S),
        E && f(E));
    }
  }
  async function Ca(r, o, e, a, t, i, s, l, n = "row-major") {
    let d = t instanceof H,
      u = s instanceof Q;
    if ((F(r), W(r, "ssyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(i) || !Number.isInteger(l))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0) throw new Error("incx must be positive.");
    if (l < e) throw new Error("lda must be >= n.");
    if (!u && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (d && !u)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (u && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (u && d && s._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (u && l !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (u && (s.rows < e || s.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return u ? {} : { A: s };
    if (!u && s.length < (e - 1) * l + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
        (u ? s.layout : n) === "column-major" ? o === "upper" : o === "lower",
      c = await P(r, "ssyr"),
      p = null,
      g = null,
      y = null,
      h = null;
    try {
      ((p = d ? t._buf : b(r, t, "ssyr-x", !1)),
        (g = u ? s._buf : b(r, s, "ssyr-A", !0)),
        i > 1 && (h = await Yr(r, p, e, i, "ssyr-x-packed")),
        (y = T(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: h ? 1 : i, type: "u32" },
            { value: l, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let x = N(r, c.getBindGroupLayout(0), [h ? h.buffer : p, g, y]),
        _ = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: B } = zr(r, [
          ...(h ? [h.pass] : []),
          { pipeline: c, bindGroup: x, workgroups: _ },
        ]),
        A = u ? null : D(r, v, g);
      j(r, v);
      let k = await C(B);
      if (u) return k !== void 0 ? { gpuTimeMs: k } : {};
      let I = await G(A, Float32Array);
      return k !== void 0 ? { A: I, gpuTimeMs: k } : { A: I };
    } finally {
      (!d && p && f(p), !u && g && f(g), y && f(y), h && f(h.buffer, h.params));
    }
  }
  async function ja(r, o, e, a, t, i, s, l, n = "row-major") {
    let d = t instanceof H,
      u = s instanceof Q;
    if ((F(r), W(r, "dsyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(i) || !Number.isInteger(l))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0) throw new Error("incx must be positive.");
    if (l < e) throw new Error("lda must be >= n.");
    if (!u && !(s instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (u && s.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!d && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (d && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (d && !u)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (u && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (u && d && s._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (u && l !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (u && (s.rows < e || s.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return u ? {} : { A: s };
    if (!u && s.length < (e - 1) * l + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * i + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
        (u ? s.layout : n) === "column-major" ? o === "upper" : o === "lower",
      p = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr"],
        "dsyr_main",
      ),
      { hi: g, lo: y } = z(new Float64Array([a])),
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      A = null,
      k = null;
    try {
      if (d) ((h = t._buf), (x = t._loBuf), (_ = s._buf), (v = s._loBuf));
      else {
        let Z = z(t),
          X = z(s);
        ((h = b(r, Z.hi, "dsyr-xHi", !1)),
          (x = b(r, Z.lo, "dsyr-xLo", !1)),
          (_ = b(r, X.hi, "dsyr-AHi", !0)),
          (v = b(r, X.lo, "dsyr-ALo", !0)));
      }
      B = T(
        r,
        [
          { value: e, type: "u32" },
          { value: g[0], type: "f32" },
          { value: y[0], type: "f32" },
          { value: i, type: "u32" },
          { value: l, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
        ],
        "dsyr-params",
      );
      let I = N(r, p.getBindGroupLayout(0), [h, x, _, v, B]),
        M = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: S, ts: E } = $(r, p, I, M);
      ((A = u ? null : D(r, S, _)), (k = u ? null : D(r, S, v)), j(r, S));
      let L = await C(E);
      if (u) return L !== void 0 ? { gpuTimeMs: L } : {};
      let R = await G(A, Float32Array);
      A = null;
      let q = await G(k, Float32Array);
      k = null;
      let O = cr(R, q);
      return L !== void 0 ? { A: O, gpuTimeMs: L } : { A: O };
    } finally {
      (!d && h && f(h),
        !d && x && f(x),
        !u && _ && f(_),
        !u && v && f(v),
        B && f(B),
        A && f(A),
        k && f(k));
    }
  }
  async function qa(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = t instanceof H,
      w = s instanceof H,
      c = n instanceof Q;
    if (
      (F(r),
      W(r, "ssyr2", { A: n, x: t, y: s }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? n.layout : u) === "column-major" ? o === "upper" : o === "lower",
      y = await P(r, "ssyr2"),
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      A = null;
    try {
      ((h = m ? t._buf : b(r, t, "ssyr2-x", !1)),
        (x = w ? s._buf : b(r, s, "ssyr2-y", !1)),
        (_ = c ? n._buf : b(r, n, "ssyr2-A", !0)),
        i > 1 && (B = await Yr(r, h, e, i, "ssyr2-x-packed")),
        l > 1 && (A = await Yr(r, x, e, l, "ssyr2-y-packed")),
        (v = T(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: B ? 1 : i, type: "u32" },
            { value: A ? 1 : l, type: "u32" },
            { value: d, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let k = N(r, y.getBindGroupLayout(0), [
          B ? B.buffer : h,
          A ? A.buffer : x,
          _,
          v,
        ]),
        I = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: M, ts: S } = zr(r, [
          ...(B ? [B.pass] : []),
          ...(A ? [A.pass] : []),
          { pipeline: y, bindGroup: k, workgroups: I },
        ]),
        E = c ? null : D(r, M, _);
      j(r, M);
      let L = await C(S);
      if (c) return L !== void 0 ? { gpuTimeMs: L } : {};
      let R = await G(E, Float32Array);
      return L !== void 0 ? { A: R, gpuTimeMs: L } : { A: R };
    } finally {
      (!m && h && f(h),
        !w && x && f(x),
        !c && _ && f(_),
        v && f(v),
        B && f(B.buffer, B.params),
        A && f(A.buffer, A.params));
    }
  }
  async function Fa(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = t instanceof H,
      w = s instanceof H,
      c = n instanceof Q;
    if (
      (F(r),
      W(r, "dsyr2", { A: n, x: t, y: s }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(i) ||
      !Number.isInteger(l) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (i <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? n.layout : u) === "column-major" ? o === "upper" : o === "lower",
      h = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr2"],
        "dsyr2_main",
      ),
      { hi: x, lo: _ } = z(new Float64Array([a])),
      v = null,
      B = null,
      A = null,
      k = null,
      I = null,
      M = null,
      S = null,
      E = null,
      L = null;
    try {
      if (m)
        ((v = t._buf),
          (B = t._loBuf),
          (A = s._buf),
          (k = s._loBuf),
          (I = n._buf),
          (M = n._loBuf));
      else {
        let U = z(t),
          tr = z(s),
          rr = z(n);
        ((v = b(r, U.hi, "dsyr2-xHi", !1)),
          (B = b(r, U.lo, "dsyr2-xLo", !1)),
          (A = b(r, tr.hi, "dsyr2-yHi", !1)),
          (k = b(r, tr.lo, "dsyr2-yLo", !1)),
          (I = b(r, rr.hi, "dsyr2-AHi", !0)),
          (M = b(r, rr.lo, "dsyr2-ALo", !0)));
      }
      S = T(
        r,
        [
          { value: e, type: "u32" },
          { value: x[0], type: "f32" },
          { value: _[0], type: "f32" },
          { value: i, type: "u32" },
          { value: l, type: "u32" },
          { value: d, type: "u32" },
          { value: g ? 0 : 1, type: "u32" },
        ],
        "dsyr2-params",
      );
      let R = N(r, h.getBindGroupLayout(0), [v, B, A, k, I, M, S]),
        q = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: O, ts: Z } = $(r, h, R, q);
      ((E = c ? null : D(r, O, I)), (L = c ? null : D(r, O, M)), j(r, O));
      let X = await C(Z);
      if (c) return X !== void 0 ? { gpuTimeMs: X } : {};
      let Y = await G(E, Float32Array);
      E = null;
      let V = await G(L, Float32Array);
      L = null;
      let K = cr(Y, V);
      return X !== void 0 ? { A: K, gpuTimeMs: X } : { A: K };
    } finally {
      (!m && v && f(v),
        !m && B && f(B),
        !w && A && f(A),
        !w && k && f(k),
        !c && I && f(I),
        !c && M && f(M),
        S && f(S),
        E && f(E),
        L && f(L));
    }
  }
  async function Wa(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let c = i instanceof Q,
      p = l instanceof H,
      g = u instanceof H;
    if (
      (F(r),
      W(r, "dgemv", { A: i, x: l, y: u }),
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
    if (!p && !(l instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!g && !(u instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (p && l.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (g && u.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (p !== g)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (p && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && l._buf === u._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && g && i._buf === u._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: u };
    (c ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let h = o === "no-transpose",
      x = h ? a : e,
      _ = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!c && i.length < (e - 1) * s + a)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (l.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (u.length < (_ - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let v = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      B = h ? "dgemv_n" : "dgemv_t",
      A = h ? "dgemv_n_main" : "dgemv_t_main",
      k = await P(r, [...v, B], A),
      { hi: I, lo: M } = z(new Float64Array([t])),
      { hi: S, lo: E } = z(new Float64Array([d])),
      L = null,
      R = null,
      q = null,
      O = null,
      Z = null,
      X = null,
      Y = null,
      V = null,
      K = null;
    try {
      if (c) ((L = i._buf), (R = i._loBuf));
      else {
        let ir = z(i);
        ((L = b(r, ir.hi, "dgemv-AHi", !1)),
          (R = b(r, ir.lo, "dgemv-ALo", !1)));
      }
      if (p) ((q = l._buf), (O = l._loBuf));
      else {
        let ir = z(l);
        ((q = b(r, ir.hi, "dgemv-xHi", !1)),
          (O = b(r, ir.lo, "dgemv-xLo", !1)));
      }
      if (g) ((Z = u._buf), (X = u._loBuf));
      else {
        let ir = z(u);
        ((Z = b(r, ir.hi, "dgemv-yHi", !0)),
          (X = b(r, ir.lo, "dgemv-yLo", !0)));
      }
      Y = T(
        r,
        [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
          { value: I[0], type: "f32" },
          { value: M[0], type: "f32" },
          { value: S[0], type: "f32" },
          { value: E[0], type: "f32" },
          { value: n, type: "u32" },
          { value: m, type: "u32" },
          { value: s, type: "u32" },
        ],
        "dgemv-params",
      );
      let U = N(r, k.getBindGroupLayout(0), [L, R, q, O, Z, X, Y]),
        tr = h
          ? Math.min(e, r.limits.maxComputeWorkgroupsPerDimension)
          : ke(r, "dgemv", _),
        { commandEncoder: rr, ts: or } = $(r, k, U, tr);
      ((V = g ? null : D(r, rr, Z)), (K = g ? null : D(r, rr, X)), j(r, rr));
      let fr = await C(or);
      if (g) return fr !== void 0 ? { gpuTimeMs: fr } : {};
      let ur = await G(V, Float32Array);
      V = null;
      let ar = await G(K, Float32Array);
      K = null;
      let er = cr(ur, ar);
      return fr !== void 0 ? { y: er, gpuTimeMs: fr } : { y: er };
    } finally {
      (!c && L && f(L),
        !c && R && f(R),
        !p && q && f(q),
        !p && O && f(O),
        !g && Z && f(Z),
        !g && X && f(X),
        Y && f(Y),
        V && f(V),
        K && f(K));
    }
  }
  async function Oa(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof H,
      c = d instanceof H,
      p = t instanceof Q;
    if (
      (F(r),
      W(r, "dsymv", { A: t, x: s, y: d }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(l) ||
      !Number.isInteger(u) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof a != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(a)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(a)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (l <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
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
    if (s.length < (e - 1) * l + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * u + 1)
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
      { hi: _, lo: v } = z(new Float64Array([a])),
      { hi: B, lo: A } = z(new Float64Array([n])),
      k = null,
      I = null,
      M = null,
      S = null,
      E = null,
      L = null,
      R = null,
      q = null,
      O = null;
    try {
      if (p) ((k = t._buf), (I = t._loBuf));
      else {
        let or = z(t);
        ((k = b(r, or.hi, "dsymv-AHi", !1)),
          (I = b(r, or.lo, "dsymv-ALo", !1)));
      }
      if (w) ((M = s._buf), (S = s._loBuf));
      else {
        let or = z(s);
        ((M = b(r, or.hi, "dsymv-xHi", !1)),
          (S = b(r, or.lo, "dsymv-xLo", !1)));
      }
      if (c) ((E = d._buf), (L = d._loBuf));
      else {
        let or = z(d);
        ((E = b(r, or.hi, "dsymv-yHi", !0)),
          (L = b(r, or.lo, "dsymv-yLo", !0)));
      }
      R = T(
        r,
        [
          { value: e, type: "u32" },
          { value: _[0], type: "f32" },
          { value: v[0], type: "f32" },
          { value: B[0], type: "f32" },
          { value: A[0], type: "f32" },
          { value: l, type: "u32" },
          { value: u, type: "u32" },
          { value: i, type: "u32" },
          { value: y ? 0 : 1, type: "u32" },
        ],
        "dsymv-params",
      );
      let Z = N(r, x.getBindGroupLayout(0), [k, I, M, S, E, L, R]),
        X = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: Y, ts: V } = $(r, x, Z, X);
      ((q = c ? null : D(r, Y, E)), (O = c ? null : D(r, Y, L)), j(r, Y));
      let K = await C(V);
      if (c) return K !== void 0 ? { gpuTimeMs: K } : {};
      let U = await G(q, Float32Array);
      q = null;
      let tr = await G(O, Float32Array);
      O = null;
      let rr = cr(U, tr);
      return K !== void 0 ? { y: rr, gpuTimeMs: K } : { y: rr };
    } finally {
      (!p && k && f(k),
        !p && I && f(I),
        !w && M && f(M),
        !w && S && f(S),
        !c && E && f(E),
        !c && L && f(L),
        R && f(R),
        q && f(q),
        O && f(O));
    }
  }
  async function Ka(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = l instanceof H,
      c = d instanceof H,
      p = i instanceof Q,
      g = a === "unit";
    if (
      (F(r),
      W(r, "dtrmv", { A: i, x: l, y: d }),
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
      !Number.isInteger(u) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (s < t) throw new Error("lda must be >= n.");
    if (!p && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(l instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!c && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && l.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (c && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== c)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && l._buf === d._buf)
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
    if (l.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (t - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h = (p ? i.layout : m) === "column-major",
      x = h ? o === "upper" : o === "lower",
      _ = h ? e === "transpose" : e === "no-transpose",
      B = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dtrmv"],
        "dtrmv_main",
      ),
      A = null,
      k = null,
      I = null,
      M = null,
      S = null,
      E = null,
      L = null,
      R = null,
      q = null;
    try {
      if (p) ((A = i._buf), (k = i._loBuf));
      else {
        let rr = z(i);
        ((A = b(r, rr.hi, "dtrmv-AHi", !1)),
          (k = b(r, rr.lo, "dtrmv-ALo", !1)));
      }
      if (w) ((I = l._buf), (M = l._loBuf));
      else {
        let rr = z(l);
        ((I = b(r, rr.hi, "dtrmv-xHi", !1)),
          (M = b(r, rr.lo, "dtrmv-xLo", !1)));
      }
      if (c) ((S = d._buf), (E = d._loBuf));
      else {
        let rr = z(d);
        ((S = b(r, rr.hi, "dtrmv-yHi", !0)),
          (E = b(r, rr.lo, "dtrmv-yLo", !0)));
      }
      L = T(
        r,
        [
          { value: t, type: "u32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: s, type: "u32" },
          { value: _ ? 0 : 1, type: "u32" },
          { value: x ? 0 : 1, type: "u32" },
          { value: g ? 1 : 0, type: "u32" },
        ],
        "dtrmv-params",
      );
      let O = N(r, B.getBindGroupLayout(0), [A, k, I, M, S, E, L]),
        Z = Math.min(t, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: X, ts: Y } = $(r, B, O, Z);
      ((R = c ? null : D(r, X, S)), (q = c ? null : D(r, X, E)), j(r, X));
      let V = await C(Y);
      if (c) return V !== void 0 ? { gpuTimeMs: V } : {};
      let K = await G(R, Float32Array);
      R = null;
      let U = await G(q, Float32Array);
      q = null;
      let tr = cr(K, U);
      return V !== void 0 ? { y: tr, gpuTimeMs: V } : { y: tr };
    } finally {
      (!p && A && f(A),
        !p && k && f(k),
        !w && I && f(I),
        !w && M && f(M),
        !c && S && f(S),
        !c && E && f(E),
        L && f(L),
        R && f(R),
        q && f(q));
    }
  }
  function Va(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        l = i * o;
      s.forEach((n, d) => t.setUint32(l + d * 4, n, !0));
    }
    return a;
  }
  function Ua(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function za(r, o, e, a, t, i, s, l, n, d = "row-major") {
    let u = l instanceof H,
      m = i instanceof Q,
      w = a === "unit";
    if ((F(r), W(r, "dtrsv", { A: i, x: l }), o !== "lower" && o !== "upper"))
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
    if (!u && !(l instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (u && l.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !u)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && u && i._buf === l._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return u ? {} : { x: l };
    if (!m && i.length < (t - 1) * s + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (l.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let p = (m ? i.layout : d) === "column-major",
      g = p ? o === "upper" : o === "lower",
      y = p ? e === "transpose" : e === "no-transpose",
      h = [
        "f64/dekker",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
      ],
      x = await P(r, [...h, "dtrsv_invert_block"], "dtrsv_invert_block_main"),
      _ = await P(r, [...h, "dtrsv_apply_inverse"], "dtrsv_apply_inverse_main"),
      v = await P(r, [...h, "dtrsv_update"], "dtrsv_update_main"),
      B = y === g,
      A = [];
    for (let U = 0; U < t; U += 64) A.push(U);
    B || A.reverse();
    let k = A.length,
      I = r.limits.maxComputeWorkgroupsPerDimension,
      M = r.limits.minUniformBufferOffsetAlignment,
      S = null,
      E = null,
      L = null,
      R = null,
      q = null,
      O = null,
      Z = null,
      X = null,
      Y = null,
      V = null,
      K = null;
    try {
      if (m) ((S = i._buf), (E = i._loBuf));
      else {
        let wr = z(i);
        ((S = b(r, wr.hi, "dtrsv-AHi", !1)),
          (E = b(r, wr.lo, "dtrsv-ALo", !1)));
      }
      if (u) ((L = l._buf), (R = l._loBuf));
      else {
        let wr = z(l);
        ((L = b(r, wr.hi, "dtrsv-xHi", !0)),
          (R = b(r, wr.lo, "dtrsv-xLo", !0)));
      }
      ((q = lr(r, k * 64 * 64 * 4, "dtrsv-AinvHi")),
        (O = lr(r, k * 64 * 64 * 4, "dtrsv-AinvLo")));
      let U = Va(k, M, (wr) => {
        let nr = wr * 64,
          hr = Math.min(nr + 64, t);
        return [n, wr, nr, hr];
      });
      Z = Ua(r, U, "dtrsv-apply-params");
      let tr = Va(k, M, (wr) => {
        let nr = wr * 64,
          hr = Math.min(nr + 64, t);
        return [t, n, s, y ? 0 : 1, g ? 0 : 1, nr, hr];
      });
      X = Ua(r, tr, "dtrsv-update-params");
      let { commandEncoder: rr, querySet: or } = Hr(r);
      Y = T(
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
      let fr = N(r, x.getBindGroupLayout(0), [S, E, q, O, Y]);
      Nr(
        rr,
        x,
        fr,
        { x: 64, y: k },
        or
          ? { timestampWrites: { querySet: or, beginningOfPassWriteIndex: 0 } }
          : void 0,
      );
      for (let wr = 0; wr < A.length; wr++) {
        let nr = A[wr],
          hr = Math.min(nr + 64, t),
          Mr = nr / 64,
          Vr = wr === A.length - 1,
          Ur = Mr * M,
          Cr = N(r, _.getBindGroupLayout(0), [
            q,
            O,
            L,
            R,
            { buffer: Z, offset: Ur, size: 16 },
          ]);
        Nr(
          rr,
          _,
          Cr,
          1,
          Vr && or
            ? { timestampWrites: { querySet: or, endOfPassWriteIndex: 1 } }
            : void 0,
        );
        let br = B ? t - hr : nr;
        if (br === 0) continue;
        let pr = N(r, v.getBindGroupLayout(0), [
            S,
            E,
            L,
            R,
            { buffer: X, offset: Ur, size: 32 },
          ]),
          kr = Math.min(br, I);
        Nr(rr, v, pr, kr);
      }
      let ar = Dr(r, rr, or);
      ((V = u ? null : D(r, rr, L)), (K = u ? null : D(r, rr, R)), j(r, rr));
      let er = await C(ar);
      if (u) return er !== void 0 ? { gpuTimeMs: er } : {};
      let ir = await G(V, Float32Array);
      V = null;
      let gr = await G(K, Float32Array);
      K = null;
      let xr = cr(ir, gr);
      return er !== void 0 ? { x: xr, gpuTimeMs: er } : { x: xr };
    } finally {
      (!m && S && f(S),
        !m && E && f(E),
        !u && L && f(L),
        !u && R && f(R),
        q && f(q),
        O && f(O),
        Z && f(Z),
        X && f(X),
        Y && f(Y),
        V && f(V),
        K && f(K));
    }
  }
  async function Za(r, o, e, a, t, i, s, l, n, d, u, m, w, c, p = "row-major") {
    let g = l instanceof Q,
      y = d instanceof Q,
      h = w instanceof Q;
    if (
      (F(r),
      W(r, "dgemm", { A: l, B: d, C: w }),
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
      !Number.isInteger(u) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(l instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!y && !(d instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!h && !(w instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (g && l.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (y && d.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (h && w.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((g || y) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !y))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || u <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || t === 0) return h ? {} : { C: w };
    let x = g ? l.layout : p,
      _ = y ? d.layout : p,
      v = h ? w.layout : p,
      B = x === "column-major" ? i : a,
      A = x === "column-major" ? a : i,
      k = o === "no-transpose" ? B : A,
      I = o === "no-transpose" ? A : B;
    if (n < I)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== l.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ir, gr] = o === "no-transpose" ? [a, i] : [i, a];
      if (l.rows < ir || l.cols < gr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (l.length < (k - 1) * n + I)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let M = _ === "column-major" ? t : i,
      S = _ === "column-major" ? i : t,
      E = e === "no-transpose" ? M : S,
      L = e === "no-transpose" ? S : M;
    if (u < L)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (y) {
      if (u !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ir, gr] = e === "no-transpose" ? [i, t] : [t, i];
      if (d.rows < ir || d.cols < gr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (E - 1) * u + L)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let R = v === "column-major" ? t : a,
      q = v === "column-major" ? a : t;
    if (c < q)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (c !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < a || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (R - 1) * c + q)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([l, d] = [d, l]),
        ([g, y] = [y, g]),
        ([n, u] = [u, n]),
        ([o, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          o === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, t] = [t, a])));
    let O = Math.ceil(t / 64),
      Z = Math.ceil(a / 64),
      X = O * Z >= 36,
      V = await P(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          X ? "dgemm_large" : "dgemm_small",
        ],
        "main",
      ),
      K = null,
      U = null,
      tr = null,
      rr = null,
      or = null,
      fr = null,
      ur = null,
      ar = null,
      er = null;
    try {
      if (g) ((K = l._buf), (U = l._loBuf));
      else {
        let Sr = z(l);
        ((K = b(r, Sr.hi, "dgemm-AHi", !1)),
          (U = b(r, Sr.lo, "dgemm-ALo", !1)));
      }
      if (y) ((tr = d._buf), (rr = d._loBuf));
      else {
        let Sr = z(d);
        ((tr = b(r, Sr.hi, "dgemm-BHi", !1)),
          (rr = b(r, Sr.lo, "dgemm-BLo", !1)));
      }
      if (h) ((or = w._buf), (fr = w._loBuf));
      else {
        let Sr = z(w);
        ((or = b(r, Sr.hi, "dgemm-CHi", !0)),
          (fr = b(r, Sr.lo, "dgemm-CLo", !0)));
      }
      let ir = o === "no-transpose",
        gr = e === "no-transpose",
        xr = ir && Ar(K, n, a, i),
        wr = Ar(tr, u, gr ? i : t, gr ? t : i),
        { hi: nr, lo: hr } = z(new Float64Array([s])),
        { hi: Mr, lo: Vr } = z(new Float64Array([m]));
      ur = T(
        r,
        [
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: nr[0], type: "f32" },
          { value: hr[0], type: "f32" },
          { value: Mr[0], type: "f32" },
          { value: Vr[0], type: "f32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: c, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: xr ? 1 : 0, type: "u32" },
          { value: wr ? 1 : 0, type: "u32" },
        ],
        "dgemm-params",
      );
      let Ur = N(r, V.getBindGroupLayout(0), [
          K,
          Br(r, K),
          U,
          tr,
          Br(r, tr),
          rr,
          or,
          fr,
          ur,
        ]),
        Cr = X
          ? { x: sr(r, O, "dgemm", "x"), y: sr(r, Z, "dgemm", "y") }
          : {
              x: sr(r, Math.ceil(t / 32), "dgemm", "x"),
              y: sr(r, Math.ceil(a / 32), "dgemm", "y"),
            },
        { commandEncoder: Ir, ts: br } = $(r, V, Ur, Cr);
      ((ar = h ? null : D(r, Ir, or)),
        (er = h ? null : D(r, Ir, fr)),
        j(r, Ir));
      let pr = await C(br);
      if (h) return pr !== void 0 ? { gpuTimeMs: pr } : {};
      let kr = await G(ar, Float32Array);
      ar = null;
      let vr = await G(er, Float32Array);
      er = null;
      let Gr = cr(kr, vr);
      return pr !== void 0 ? { C: Gr, gpuTimeMs: pr } : { C: Gr };
    } finally {
      (!g && K && f(K),
        !g && U && f(U),
        !y && tr && f(tr),
        !y && rr && f(rr),
        !h && or && f(or),
        !h && fr && f(fr),
        ur && f(ur),
        ar && f(ar),
        er && f(er));
    }
  }
  async function Ya(r, o, e, a, t, i, s, l, n, d, u, m, w, c, p = "row-major") {
    let g = l instanceof Q,
      y = d instanceof Q,
      h = w instanceof Q;
    if (
      (F(r),
      W(r, "sgemm", { A: l, B: d, C: w }),
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
      !Number.isInteger(u) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(l instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!y && !(d instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(w instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || y) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !y))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || u <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || t === 0) return h ? {} : { C: w };
    let x = g ? l.layout : p,
      _ = y ? d.layout : p,
      v = h ? w.layout : p,
      B = x === "column-major" ? i : a,
      A = x === "column-major" ? a : i,
      k = o === "no-transpose" ? B : A,
      I = o === "no-transpose" ? A : B;
    if (n < I)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== l.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ar, er] = o === "no-transpose" ? [a, i] : [i, a];
      if (l.rows < ar || l.cols < er)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (l.length < (k - 1) * n + I)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let M = _ === "column-major" ? t : i,
      S = _ === "column-major" ? i : t,
      E = e === "no-transpose" ? M : S,
      L = e === "no-transpose" ? S : M;
    if (u < L)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (y) {
      if (u !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ar, er] = e === "no-transpose" ? [i, t] : [t, i];
      if (d.rows < ar || d.cols < er)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (E - 1) * u + L)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let R = v === "column-major" ? t : a,
      q = v === "column-major" ? a : t;
    if (c < q)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (c !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < a || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (R - 1) * c + q)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([l, d] = [d, l]),
        ([g, y] = [y, g]),
        ([n, u] = [u, n]),
        ([o, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          o === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, t] = [t, a])));
    let O = Math.ceil(t / 64),
      Z = Math.ceil(a / 64),
      X = O * Z >= 36,
      Y = await P(r, X ? "sgemm_large" : "sgemm_small"),
      V = g ? l._buf : b(r, l, "sgemm-A", !1),
      K = y ? d._buf : b(r, d, "sgemm-B", !1),
      U = h ? w._buf : b(r, w, "sgemm-C", !0),
      tr = o === "no-transpose",
      rr = e === "no-transpose",
      or = Ar(V, n, tr ? a : i, tr ? i : a),
      fr = Ar(K, u, rr ? i : t, rr ? t : i),
      ur = T(
        r,
        [
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "f32" },
          { value: m, type: "f32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: c, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: or ? 1 : 0, type: "u32" },
          { value: fr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let ar = N(r, Y.getBindGroupLayout(0), [V, Br(r, V), K, Br(r, K), U, ur]),
        er = X
          ? { x: sr(r, O, "sgemm", "x"), y: sr(r, Z, "sgemm", "y") }
          : {
              x: sr(r, Math.ceil(t / 32), "sgemm", "x"),
              y: sr(r, Math.ceil(a / 32), "sgemm", "y"),
            },
        { commandEncoder: ir, ts: gr } = $(r, Y, ar, er),
        xr = h ? null : D(r, ir, U);
      j(r, ir);
      let wr = await C(gr);
      if (h) return wr !== void 0 ? { gpuTimeMs: wr } : {};
      let nr = await G(xr, Float32Array);
      return wr !== void 0 ? { C: nr, gpuTimeMs: wr } : { C: nr };
    } finally {
      (g || f(V), y || f(K), h || f(U), f(ur));
    }
  }
  async function Xa(
    r,
    o,
    e,
    a,
    t,
    i,
    s,
    l,
    n,
    d,
    u,
    m,
    w,
    c,
    p,
    g = "row-major",
  ) {
    let y = n instanceof Q,
      h = u instanceof Q,
      x = c instanceof Q;
    if (
      (F(r),
      W(r, "sgemmtr", { A: n, B: u, C: c }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (g !== "row-major" && g !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof l != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(l)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("alpha must be finite.");
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
    if (!h && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!x && !(c instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((y || h) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!y || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || i === 0) return x ? {} : { C: c };
    let _ = y ? n.layout : g,
      v = h ? u.layout : g,
      B = x ? c.layout : g,
      A = _ === "column-major" ? s : t,
      k = _ === "column-major" ? t : s,
      I = e === "no-transpose" ? A : k,
      M = e === "no-transpose" ? k : A;
    if (d < M)
      throw new Error(
        `lda must be >= ${_ === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (y) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [er, ir] = e === "no-transpose" ? [t, s] : [s, t];
      if (n.rows < er || n.cols < ir)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (I - 1) * d + M)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let S = v === "column-major" ? i : s,
      E = v === "column-major" ? s : i,
      L = a === "no-transpose" ? S : E,
      R = a === "no-transpose" ? E : S;
    if (m < R)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [er, ir] = a === "no-transpose" ? [s, i] : [i, s];
      if (u.rows < er || u.cols < ir)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (u.length < (L - 1) * m + R)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let q = B === "column-major" ? i : t,
      O = B === "column-major" ? t : i;
    if (p < O)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (p !== c.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (c.rows < t || c.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (c.length < (q - 1) * p + O)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (_ === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (([n, u] = [u, n]),
        ([y, h] = [h, y]),
        ([d, m] = [m, d]),
        ([e, a] = [
          a === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, i] = [i, t]),
        (o = o === "lower" ? "upper" : "lower")));
    let Z = Math.ceil(i / 64),
      X = Math.ceil(t / 64),
      Y = Z * X >= 36,
      V = await P(r, Y ? "sgemm_large" : "sgemm_small"),
      K = y ? n._buf : b(r, n, "sgemmtr-A", !1),
      U = h ? u._buf : b(r, u, "sgemmtr-B", !1),
      tr = x ? c._buf : b(r, c, "sgemmtr-C", !0),
      rr = e === "no-transpose",
      or = a === "no-transpose",
      fr = Ar(K, d, rr ? t : s, rr ? s : t),
      ur = Ar(U, m, or ? s : i, or ? i : s),
      ar = T(
        r,
        [
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: l, type: "f32" },
          { value: w, type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: p, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: fr ? 1 : 0, type: "u32" },
          { value: ur ? 1 : 0, type: "u32" },
          { value: o === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let er = N(r, V.getBindGroupLayout(0), [
          K,
          Br(r, K),
          U,
          Br(r, U),
          tr,
          ar,
        ]),
        ir = Y
          ? { x: sr(r, Z, "sgemmtr", "x"), y: sr(r, X, "sgemmtr", "y") }
          : {
              x: sr(r, Math.ceil(i / 32), "sgemmtr", "x"),
              y: sr(r, Math.ceil(t / 32), "sgemmtr", "y"),
            },
        { commandEncoder: gr, ts: xr } = $(r, V, er, ir),
        wr = x ? null : D(r, gr, tr);
      j(r, gr);
      let nr = await C(xr);
      if (x) return nr !== void 0 ? { gpuTimeMs: nr } : {};
      let hr = await G(wr, Float32Array);
      return nr !== void 0 ? { C: hr, gpuTimeMs: nr } : { C: hr };
    } finally {
      (y || f(K), h || f(U), x || f(tr), f(ar));
    }
  }
  async function $a(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof Q,
      c = d instanceof Q;
    if ((F(r), W(r, "ssyrk", { A: s, C: d }), o !== "lower" && o !== "upper"))
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
      !Number.isInteger(l) ||
      !Number.isInteger(u)
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
    if (l <= 0 || u <= 0) throw new Error("lda and ldc must be positive.");
    if (a === 0) return c ? {} : { C: d };
    let p = w ? s.layout : m,
      g = c ? d.layout : m,
      y = p === "column-major" ? t : a,
      h = p === "column-major" ? a : t,
      x = e === "no-transpose" ? y : h,
      _ = e === "no-transpose" ? h : y;
    if (l < _)
      throw new Error(
        `lda must be >= ${p === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [V, K] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < V || s.cols < K)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (x - 1) * l + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (u < a) throw new Error("ldc must be >= n.");
    if (c) {
      if (u !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < a || d.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (a - 1) * u + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let v = e;
    p === "column-major" &&
      (v = v === "no-transpose" ? "transpose" : "no-transpose");
    let B = v === "no-transpose" ? "transpose" : "no-transpose",
      A = o;
    g === "column-major" &&
      (([v, B] = [
        B === "no-transpose" ? "transpose" : "no-transpose",
        v === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (A = A === "lower" ? "upper" : "lower"));
    let k = Math.ceil(a / 64),
      I = Math.ceil(a / 64),
      M = k * I >= 36,
      S = await P(r, M ? "sgemm_large" : "sgemm_small"),
      E = w ? s._buf : b(r, s, "ssyrk-A", !1),
      L = c ? d._buf : b(r, d, "ssyrk-C", !0),
      R = w
        ? lr(r, E.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : b(r, s, "ssyrk-B", !1),
      q = v === "no-transpose",
      O = B === "no-transpose",
      Z = Ar(E, l, q ? a : t, q ? t : a),
      X = Ar(R, l, O ? t : a, O ? a : t),
      Y = T(
        r,
        [
          { value: a, type: "u32" },
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "f32" },
          { value: n, type: "f32" },
          { value: l, type: "u32" },
          { value: l, type: "u32" },
          { value: u, type: "u32" },
          { value: v === "transpose" ? 1 : 0, type: "u32" },
          { value: B === "transpose" ? 1 : 0, type: "u32" },
          { value: Z ? 1 : 0, type: "u32" },
          { value: X ? 1 : 0, type: "u32" },
          { value: A === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let V = N(r, S.getBindGroupLayout(0), [E, Br(r, E), R, Br(r, R), L, Y]),
        K = M
          ? { x: sr(r, k, "ssyrk", "x"), y: sr(r, I, "ssyrk", "y") }
          : {
              x: sr(r, Math.ceil(a / 32), "ssyrk", "x"),
              y: sr(r, Math.ceil(a / 32), "ssyrk", "y"),
            },
        { commandEncoder: U, querySet: tr, passDescriptor: rr } = Hr(r);
      (w && U.copyBufferToBuffer(E, 0, R, 0, E.size), Nr(U, S, V, K, rr));
      let or = Dr(r, U, tr),
        fr = c ? null : D(r, U, L);
      j(r, U);
      let ur = await C(or);
      if (c) return ur !== void 0 ? { gpuTimeMs: ur } : {};
      let ar = await G(fr, Float32Array);
      return ur !== void 0 ? { C: ar, gpuTimeMs: ur } : { C: ar };
    } finally {
      (w || f(E), f(R), c || f(L), f(Y));
    }
  }
  async function Ja(r, o, e, a, t, i, s, l, n, d, u, m, w, c = "row-major") {
    let p = s instanceof Q,
      g = n instanceof Q,
      y = m instanceof Q;
    if (
      (F(r),
      W(r, "ssyr2k", { A: s, B: n, C: m }),
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
    if (typeof u != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(u)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(l) ||
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
    if (l <= 0 || d <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0) return y ? {} : { C: m };
    let h = p ? s.layout : c,
      x = g ? n.layout : c,
      _ = y ? m.layout : c,
      v = h === "column-major" ? t : a,
      B = h === "column-major" ? a : t,
      A = e === "no-transpose" ? v : B,
      k = e === "no-transpose" ? B : v;
    if (l < k)
      throw new Error(
        `lda must be >= ${h === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (p) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ar, er] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < ar || s.cols < er)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (A - 1) * l + k)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let I = x === "column-major" ? t : a,
      M = x === "column-major" ? a : t,
      S = e === "no-transpose" ? I : M,
      E = e === "no-transpose" ? M : I;
    if (d < E)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ar, er] = e === "no-transpose" ? [a, t] : [t, a];
      if (n.rows < ar || n.cols < er)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (S - 1) * d + E)
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
    let L = e;
    h === "column-major" &&
      (L = L === "no-transpose" ? "transpose" : "no-transpose");
    let R = e;
    x === "column-major" &&
      (R = R === "no-transpose" ? "transpose" : "no-transpose");
    let q = _ === "column-major" ? (o === "lower" ? "upper" : "lower") : o,
      O = (ar) => (ar === "no-transpose" ? "transpose" : "no-transpose");
    function Z(ar, er, ir, gr, xr, wr) {
      let nr = ar,
        hr = O(gr);
      return _ !== "column-major"
        ? { transX: nr, X: er, ldX: ir, transY: hr, Y: xr, ldY: wr }
        : { transX: O(hr), X: xr, ldX: wr, transY: O(nr), Y: er, ldY: ir };
    }
    let X = Math.ceil(a / 64),
      Y = Math.ceil(a / 64),
      V = X * Y >= 36,
      K = await P(r, V ? "sgemm_large" : "sgemm_small"),
      U = V
        ? { x: sr(r, X, "ssyr2k", "x"), y: sr(r, Y, "ssyr2k", "y") }
        : {
            x: sr(r, Math.ceil(a / 32), "ssyr2k", "x"),
            y: sr(r, Math.ceil(a / 32), "ssyr2k", "y"),
          },
      tr = p ? s._buf : b(r, s, "ssyr2k-A", !1),
      rr = g ? n._buf : b(r, n, "ssyr2k-B", !1),
      or = y ? m._buf : b(r, m, "ssyr2k-C", !0),
      fr = null,
      ur = null;
    try {
      let ar = Z(L, tr, l, R, rr, d),
        er = Z(R, rr, d, L, tr, l),
        ir = (pr) => {
          let kr = pr.transX === "no-transpose",
            vr = pr.transY === "no-transpose";
          return [
            Ar(pr.X, pr.ldX, kr ? a : t, kr ? t : a),
            Ar(pr.Y, pr.ldY, vr ? t : a, vr ? a : t),
          ];
        },
        gr = (pr, kr) =>
          T(
            r,
            [
              { value: a, type: "u32" },
              { value: a, type: "u32" },
              { value: t, type: "u32" },
              { value: i, type: "f32" },
              { value: kr, type: "f32" },
              { value: pr.ldX, type: "u32" },
              { value: pr.ldY, type: "u32" },
              { value: w, type: "u32" },
              { value: pr.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: pr.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: ir(pr)[0] ? 1 : 0, type: "u32" },
              { value: ir(pr)[1] ? 1 : 0, type: "u32" },
              { value: q === "lower" ? 1 : 2, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((fr = gr(ar, u)), (ur = gr(er, 1)));
      let xr = N(r, K.getBindGroupLayout(0), [
          ar.X,
          Br(r, ar.X),
          ar.Y,
          Br(r, ar.Y),
          or,
          fr,
        ]),
        wr = N(r, K.getBindGroupLayout(0), [
          er.X,
          Br(r, er.X),
          er.Y,
          Br(r, er.Y),
          or,
          ur,
        ]),
        { commandEncoder: nr, querySet: hr } = Hr(r),
        Mr = hr
          ? { timestampWrites: { querySet: hr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Vr = hr
          ? { timestampWrites: { querySet: hr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Nr(nr, K, xr, U, Mr), Nr(nr, K, wr, U, Vr));
      let Ur = Dr(r, nr, hr),
        Cr = y ? null : D(r, nr, or);
      j(r, nr);
      let Ir = await C(Ur);
      if (y) return Ir !== void 0 ? { gpuTimeMs: Ir } : {};
      let br = await G(Cr, Float32Array);
      return Ir !== void 0 ? { C: br, gpuTimeMs: Ir } : { C: br };
    } finally {
      (p || f(tr), g || f(rr), y || f(or), fr && f(fr), ur && f(ur));
    }
  }
  async function Qa(r, o, e, a, t, i, s, l, n, d, u, m, w, c = "row-major") {
    let p = s instanceof Q,
      g = n instanceof Q,
      y = m instanceof Q;
    if (
      (F(r), W(r, "ssymm", { A: s, B: n, C: m }), o !== "left" && o !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof u != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(u)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(t) ||
      !Number.isInteger(l) ||
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
    let h = p ? s.layout : c,
      x = g ? n.layout : c,
      _ = y ? m.layout : c,
      v = o === "left" ? a : t;
    if (l < v)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (p) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (s.rows < v || s.cols < v)
        throw new Error("A is too small for the given m/n and side.");
    } else if (s.length < (v - 1) * l + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let B = x === "column-major" ? t : a,
      A = x === "column-major" ? a : t;
    if (d < A)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < a || n.cols < t)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (B - 1) * d + A)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let k = _ === "column-major" ? t : a,
      I = _ === "column-major" ? a : t;
    if (w < I)
      throw new Error(
        `ldc must be >= ${_ === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (y) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < a || m.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (k - 1) * w + I)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let M = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      S = x === "column-major" ? "transpose" : "no-transpose",
      E = "no-transpose",
      L = a,
      R = t,
      q = v,
      O = o === "left" ? E : S,
      Z = o === "left" ? S : E,
      X = (wr) => (wr === "no-transpose" ? "transpose" : "no-transpose"),
      Y = o === "right";
    _ === "column-major" &&
      (([O, Z] = [X(Z), X(O)]), (Y = !Y), ([L, R] = [R, L]));
    let V = v,
      K = Math.ceil(R / 64),
      U = Math.ceil(L / 64),
      tr = K * U >= 36,
      rr = await P(r, tr ? "sgemm_large" : "sgemm_small"),
      or = await P(r, "symmetrize"),
      fr = tr
        ? { x: sr(r, K, "ssymm", "x"), y: sr(r, U, "ssymm", "y") }
        : {
            x: sr(r, Math.ceil(R / 32), "ssymm", "x"),
            y: sr(r, Math.ceil(L / 32), "ssymm", "y"),
          },
      ur = p ? s._buf : b(r, s, "ssymm-A", !1),
      ar = g ? n._buf : b(r, n, "ssymm-B", !1),
      er = y ? m._buf : b(r, m, "ssymm-C", !0),
      ir = lr(r, v * V * 4, "ssymm-Adense"),
      gr = null,
      xr = null;
    try {
      gr = T(
        r,
        [
          { value: v, type: "u32" },
          { value: l, type: "u32" },
          { value: V, type: "u32" },
          { value: M === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let wr = N(r, or.getBindGroupLayout(0), [ur, ir, gr]),
        nr = Y ? ar : ir,
        hr = Y ? d : V,
        Mr = Y ? ir : ar,
        Vr = Y ? V : d,
        Ur = O === "no-transpose",
        Cr = Z === "no-transpose",
        Ir = Ar(nr, hr, Ur ? L : q, Ur ? q : L),
        br = Ar(Mr, Vr, Cr ? q : R, Cr ? R : q);
      xr = T(
        r,
        [
          { value: L, type: "u32" },
          { value: R, type: "u32" },
          { value: q, type: "u32" },
          { value: i, type: "f32" },
          { value: u, type: "f32" },
          { value: hr, type: "u32" },
          { value: Vr, type: "u32" },
          { value: w, type: "u32" },
          { value: O === "transpose" ? 1 : 0, type: "u32" },
          { value: Z === "transpose" ? 1 : 0, type: "u32" },
          { value: Ir ? 1 : 0, type: "u32" },
          { value: br ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let pr = N(r, rr.getBindGroupLayout(0), [
          nr,
          Br(r, nr),
          Mr,
          Br(r, Mr),
          er,
          xr,
        ]),
        { commandEncoder: kr, querySet: vr } = Hr(r),
        Gr = vr
          ? { timestampWrites: { querySet: vr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Sr = vr
          ? { timestampWrites: { querySet: vr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Nr(kr, or, wr, { x: Math.ceil(v / 8), y: Math.ceil(v / 8) }, Gr),
        Nr(kr, rr, pr, fr, Sr));
      let oe = Dr(r, kr, vr),
        ae = y ? null : D(r, kr, er);
      j(r, kr);
      let Zr = await C(oe);
      if (y) return Zr !== void 0 ? { gpuTimeMs: Zr } : {};
      let ie = await G(ae, Float32Array);
      return Zr !== void 0 ? { C: ie, gpuTimeMs: Zr } : { C: ie };
    } finally {
      (p || f(ur), g || f(ar), y || f(er), f(ir), gr && f(gr), xr && f(xr));
    }
  }
  async function ri(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let c = n instanceof Q,
      p = u instanceof Q,
      g = t === "unit";
    if ((F(r), W(r, "strmm", { A: n, B: u }), o !== "left" && o !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof l != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(l)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== p)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return p ? {} : { B: u };
    let y = c ? n.layout : w,
      h = p ? u.layout : w,
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
    let _ = h === "column-major" ? s : i,
      v = h === "column-major" ? i : s;
    if (m < v)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < i || u.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (_ - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = y === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      A =
        y === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      k = h === "column-major" ? "transpose" : "no-transpose",
      I = "no-transpose",
      M = i,
      S = s,
      E = x,
      L = o === "left" ? I : k,
      R = o === "left" ? k : I,
      q = (gr) => (gr === "no-transpose" ? "transpose" : "no-transpose"),
      O = o === "right";
    h === "column-major" &&
      (([L, R] = [q(R), q(L)]), (O = !O), ([M, S] = [S, M]));
    let Z = x,
      X = Math.ceil(S / 64),
      Y = Math.ceil(M / 64),
      V = X * Y >= 36,
      K = await P(r, V ? "sgemm_large" : "sgemm_small"),
      U = await P(r, "triangularize"),
      tr = V
        ? { x: sr(r, X, "strmm", "x"), y: sr(r, Y, "strmm", "y") }
        : {
            x: sr(r, Math.ceil(S / 32), "strmm", "x"),
            y: sr(r, Math.ceil(M / 32), "strmm", "y"),
          },
      rr = null,
      or = null,
      fr = null,
      ur = null,
      ar = null,
      er = null,
      ir = !1;
    try {
      ((rr = c ? n._buf : b(r, n, "strmm-A", !1)),
        (or = p ? u._buf : b(r, u, "strmm-B", !0)),
        (fr = lr(r, x * Z * 4, "strmm-Adense")),
        (ur = lr(
          r,
          _ * m * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (ar = T(
          r,
          [
            { value: x, type: "u32" },
            { value: d, type: "u32" },
            { value: Z, type: "u32" },
            { value: B === "upper" ? 1 : 0, type: "u32" },
            { value: A === "transpose" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let gr = N(r, U.getBindGroupLayout(0), [rr, fr, ar]),
        xr = O ? or : fr,
        wr = O ? m : Z,
        nr = O ? fr : or,
        hr = O ? Z : m,
        Mr = L === "no-transpose",
        Vr = R === "no-transpose",
        Ur = Ar(xr, wr, Mr ? M : E, Mr ? E : M),
        Cr = Ar(nr, hr, Vr ? E : S, Vr ? S : E),
        Ir = (A === "no-transpose") == (B === "lower"),
        br = !O,
        pr = Ir !== (br ? !Mr : !Vr);
      er = T(
        r,
        [
          { value: M, type: "u32" },
          { value: S, type: "u32" },
          { value: E, type: "u32" },
          { value: l, type: "f32" },
          { value: 0, type: "f32" },
          { value: wr, type: "u32" },
          { value: hr, type: "u32" },
          { value: m, type: "u32" },
          { value: L === "transpose" ? 1 : 0, type: "u32" },
          { value: R === "transpose" ? 1 : 0, type: "u32" },
          { value: Ur ? 1 : 0, type: "u32" },
          { value: Cr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: br ? (pr ? 1 : 2) : pr ? 3 : 4, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let vr = N(r, K.getBindGroupLayout(0), [
          xr,
          Br(r, xr),
          nr,
          Br(r, nr),
          ur,
          er,
        ]),
        { commandEncoder: Gr, querySet: Sr } = Hr(r);
      Gr.copyBufferToBuffer(or, 0, ur, 0, Math.min(or.size, ur.size));
      let oe = Sr
          ? { timestampWrites: { querySet: Sr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        ae = Sr
          ? { timestampWrites: { querySet: Sr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Nr(Gr, U, gr, { x: Math.ceil(x / 8), y: Math.ceil(x / 8) }, oe),
        Nr(Gr, K, vr, tr, ae));
      let Zr = Dr(r, Gr, Sr),
        ie = p ? null : D(r, Gr, ur);
      j(r, Gr);
      let ge = await C(Zr);
      if (p)
        return (
          f(u._buf),
          (u._buf = ur),
          (ir = !0),
          ge !== void 0 ? { gpuTimeMs: ge } : {}
        );
      let Ie = await G(ie, Float32Array);
      return ge !== void 0 ? { B: Ie, gpuTimeMs: ge } : { B: Ie };
    } finally {
      (!c && rr && f(rr),
        !p && or && f(or),
        fr && f(fr),
        ur && !ir && f(ur),
        ar && f(ar),
        er && f(er));
    }
  }
  var Xr = (r, o, e, a) => ({ buffer: r, off: o, rs: e, cs: a }),
    we = (r) => ({ ...r, rs: r.cs, cs: r.rs }),
    se = (r, o, e) => ({ ...r, off: r.off + o * r.rs + e * r.cs });
  function Ls(r, o) {
    typeof o == "number"
      ? r.dispatchWorkgroups(o)
      : r.dispatchWorkgroups(o.x, o.y, o.z ?? 1);
  }
  var Ds = 8;
  function Ns(r, o, e, a, t, i, s, l, n, d, u, m) {
    s.cs !== 1 && (([t, i, s] = [we(i), we(t), we(s)]), ([l, n] = [n, l]));
    let w = t.cs === 1,
      c = i.cs === 1,
      p = w ? t.rs : t.cs,
      g = c ? i.rs : i.cs,
      y = Ar(t.buffer, p, w ? l : d, w ? d : l, t.off),
      h = Ar(i.buffer, g, c ? d : n, c ? n : d, i.off),
      x = Math.ceil(n / 64),
      _ = Math.ceil(l / 64),
      v = x * _ >= 36,
      B = v ? e.large : e.small,
      A = a(
        [
          { value: l, type: "u32" },
          { value: n, type: "u32" },
          { value: d, type: "u32" },
          { value: u, type: "f32" },
          { value: m, type: "f32" },
          { value: p, type: "u32" },
          { value: g, type: "u32" },
          { value: s.rs, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
          { value: c ? 0 : 1, type: "u32" },
          { value: y ? 1 : 0, type: "u32" },
          { value: h ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: t.off, type: "u32" },
          { value: i.off, type: "u32" },
          { value: s.off, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "strsm-gemm-params",
      );
    (o.setPipeline(B),
      o.setBindGroup(
        0,
        N(r, B.getBindGroupLayout(0), [
          t.buffer,
          Br(r, t.buffer),
          i.buffer,
          Br(r, i.buffer),
          s.buffer,
          A,
        ]),
      ),
      o.dispatchWorkgroups(
        sr(r, v ? x : Math.ceil(n / 32), "strsm", "x"),
        sr(r, v ? _ : Math.ceil(l / 32), "strsm", "y"),
      ));
  }
  async function ei(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let c = n instanceof Q,
      p = u instanceof Q,
      g = t === "unit";
    if ((F(r), W(r, "strsm", { A: n, B: u }), o !== "left" && o !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (a !== "no-transpose" && a !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!g && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof l != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(l)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(i) ||
      !Number.isInteger(s) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!c && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (c !== p)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return p ? {} : { B: u };
    let y = c ? n.layout : w,
      h = p ? u.layout : w,
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
    let _ = h === "column-major" ? s : i,
      v = h === "column-major" ? i : s;
    if (m < v)
      throw new Error(
        `ldb must be >= ${h === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (p) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < i || u.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (_ - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = y === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      A =
        y === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      k = o === "left" ? s : i,
      I = o === "left",
      M = (A === "no-transpose") == (B === "lower"),
      S = o === "left" ? M : !M,
      E = [];
    for (let fr = 0; fr < x; fr += 64) E.push(fr);
    S || E.reverse();
    let L = E.length,
      R = await P(r, "strsm_small"),
      q = L > Ds,
      O = q ? await P(r, "strsv_invert_block") : null,
      Z = q ? await P(r, "block_transfer") : null,
      X = sr(r, Math.ceil(k / 4), "strsm"),
      Y = {
        small: await P(r, "sgemm_small"),
        large: await P(r, "sgemm_large"),
      },
      V = null,
      K = null,
      U = null,
      tr = null,
      rr = [];
    function or(fr, ur) {
      let ar = T(r, fr, ur);
      return (rr.push(ar), ar);
    }
    try {
      ((V = c ? n._buf : b(r, n, "strsm-A", !1)),
        (K = p ? u._buf : b(r, u, "strsm-B", !0)),
        q && (U = lr(r, L * 64 * 64 * 4, "strsm-Ainv")),
        (tr = lr(r, (L > 1 ? 64 * k : 4) * 4, "strsm-Xblock")));
      let fr = h === "column-major" ? Xr(K, 0, 1, m) : Xr(K, 0, m, 1),
        ur = o === "left" ? fr : we(fr),
        ar = A === "transpose" ? Xr(V, 0, 1, d) : Xr(V, 0, d, 1),
        er = o === "left" ? ar : we(ar),
        ir = Xr(tr, 0, k, 1),
        { commandEncoder: gr, querySet: xr, passDescriptor: wr } = Hr(r),
        nr = gr.beginComputePass(wr),
        hr = (br, pr, kr, vr, Gr, Sr, oe, ae) =>
          Ns(r, nr, Y, or, br, pr, kr, vr, Gr, Sr, oe, ae),
        Mr = (br, pr, kr, vr, Gr) => {
          let Sr = or(
            [
              { value: kr, type: "u32" },
              { value: k, type: "u32" },
              { value: br.off, type: "u32" },
              { value: br.rs, type: "u32" },
              { value: br.cs, type: "u32" },
              { value: pr.off, type: "u32" },
              { value: pr.rs, type: "u32" },
              { value: pr.cs, type: "u32" },
              { value: S ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
              { value: vr, type: "f32" },
              { value: Gr, type: "u32" },
            ],
            "strsm-solve-params",
          );
          (nr.setPipeline(R),
            nr.setBindGroup(0, N(r, R.getBindGroupLayout(0), [V, K, Sr, tr])),
            nr.dispatchWorkgroups(X));
        };
      if (l === 0) {
        let br = Xr(tr, 0, 1, 1);
        hr(br, br, Xr(K, 0, m, 1), _, v, 0, 0, 0);
      } else if (L === 1) Mr(er, ur, x, l, 0);
      else {
        if (l !== 1) {
          let br = Xr(tr, 0, 1, 1);
          hr(br, br, Xr(K, 0, m, 1), _, v, 0, 0, l);
        }
        if (q) {
          let br = or(
            [
              { value: x, type: "u32" },
              { value: d, type: "u32" },
              { value: A === "transpose" ? 1 : 0, type: "u32" },
              { value: B === "upper" ? 1 : 0, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
            ],
            "strsm-invert-params",
          );
          (nr.setPipeline(O),
            nr.setBindGroup(0, N(r, O.getBindGroupLayout(0), [V, U, br])),
            nr.dispatchWorkgroups(L));
          for (let pr of E) {
            let kr = Math.min(pr + 64, x),
              vr = kr - pr,
              Sr = (pr / 64) * 64 * 64,
              oe = o === "left" ? Xr(U, Sr, 1, 64) : Xr(U, Sr, 64, 1);
            hr(oe, se(ur, pr, 0), ir, vr, k, vr, 1, 0);
            let ae = or(
              [
                { value: pr, type: "u32" },
                { value: vr, type: "u32" },
                { value: 0, type: "u32" },
                { value: k, type: "u32" },
                { value: m, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: I ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            );
            (nr.setPipeline(Z),
              nr.setBindGroup(0, N(r, Z.getBindGroupLayout(0), [tr, K, ae])),
              Ls(nr, ke(r, "strsm", vr, k)));
            let Zr = S ? kr : 0,
              ie = S ? x : pr;
            Zr >= ie ||
              hr(se(er, Zr, pr), ir, se(ur, Zr, 0), ie - Zr, k, vr, -1, 1);
          }
        } else
          for (let br of E) {
            let pr = Math.min(br + 64, x),
              kr = pr - br;
            Mr(se(er, br, br), se(ur, br, 0), kr, 1, k);
            let vr = S ? pr : 0,
              Gr = S ? x : br;
            vr >= Gr ||
              hr(se(er, vr, br), ir, se(ur, vr, 0), Gr - vr, k, kr, -1, 1);
          }
      }
      nr.end();
      let Vr = Dr(r, gr, xr),
        Ur = p ? null : D(r, gr, K);
      j(r, gr);
      let Cr = await C(Vr);
      if (p) return Cr !== void 0 ? { gpuTimeMs: Cr } : {};
      let Ir = await G(Ur, Float32Array);
      return Cr !== void 0 ? { B: Ir, gpuTimeMs: Cr } : { B: Ir };
    } finally {
      (!c && V && f(V), !p && K && f(K), tr && f(tr), U && f(U), f(rr));
    }
  }
  return ni(Ps);
})();
