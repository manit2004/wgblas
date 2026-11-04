var wgblas = (() => {
  var pi = Object.create;
  var ve = Object.defineProperty;
  var ci = Object.getOwnPropertyDescriptor;
  var wi = Object.getOwnPropertyNames;
  var gi = Object.getPrototypeOf,
    hi = Object.prototype.hasOwnProperty;
  var _e = ((r) =>
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
  var ir = (r, o, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (o = r((r = 0))), o);
    } catch (a) {
      throw ((e = [a]), a);
    }
  };
  var Oe = (r, o) => {
      for (var e in o) ve(r, e, { get: o[e], enumerable: !0 });
    },
    Ke = (r, o, e, a) => {
      if ((o && typeof o == "object") || typeof o == "function")
        for (let t of wi(o))
          !hi.call(r, t) &&
            t !== e &&
            ve(r, t, {
              get: () => o[t],
              enumerable: !(a = ci(o, t)) || a.enumerable,
            });
      return r;
    };
  var Be = (r, o, e) => (
      (e = r != null ? pi(gi(r)) : {}),
      Ke(
        o || !r || !r.__esModule
          ? ve(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    bi = (r) => Ke(ve({}, "__esModule", { value: !0 }), r);
  var it,
    at = ir(() => {
      it = `// sscal: x = alpha * x

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
  var nt,
    st = ir(() => {
      nt = `// cscal: x := alpha * x, complex. x is one interleaved f32 array
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
  var ut,
    lt = ir(() => {
      ut = `// sswap: x <-> y

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
  var ft,
    dt = ir(() => {
      ft = `// dswap: x <-> y, double-double (Dekker) f64 emulation of sswap. A swap is
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
  var pt,
    mt = ir(() => {
      pt = `// saxpy: y = alpha * x + y

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
  var wt,
    ct = ir(() => {
      wt = `// scopy: y = x

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
  var ht,
    gt = ir(() => {
      ht = `// dcopy: y = x, double-double (Dekker) f64 emulation of scopy. A copy is
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
  var yt,
    bt = ir(() => {
      yt = `// sdot: result = sum(x[i] * y[i])
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
  var Pe,
    xt = ir(() => {
      Pe = `// sum reduction: collapses 2*WGS partials into one scalar.
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
  var _t,
    vt = ir(() => {
      _t = `// sasum: result = sum(|x[i]|)
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
  var kt,
    Bt = ir(() => {
      kt = `// snrm2: result = sqrt(sum(x[i] * x[i])), overflow- and underflow-safe via
// Blue's algorithm with fixed scaling (Anderson 2017, "Algorithm 978: Safe
// Scaling in the Level 1 BLAS" \u2014 what LAPACK 3.10's snrm2 uses). Naive
// \`sum += x_i * x_i\` overflows to inf for |x_i| \u2273 1.8e19 (f32's squaring
// range is only sqrt(f32_max)) and loses precision on tiny magnitudes
// squaring into the denormal range. Instead every |x_i| lands in one of
// three accumulators by magnitude:
//   big:    |x| > TBIG  \u2192 (|x| \xB7 SBIG)\xB2   (scaled down, can't overflow)
//   medium: in between  \u2192 |x|\xB2            (squares safely as-is)
//   small:  |x| < TSML  \u2192 (|x| \xB7 SSML)\xB2   (scaled up, keeps precision)
// The scales are constant powers of two, so there's no per-element division
// or data-dependent rescaling (the running-max SLASSQ update this replaced
// divided on every element and made the kernel compute-bound), and partials
// merge by plain addition \u2014 the same 4-way-ILP + tree-reduction shape as
// sasum. reduction/scaledSum.wgsl adds the partials and combines the three
// sums into the norm.
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/scaledSum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>; // 3 per workgroup: big, medium, small
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

// Thresholds and scales (powers of two, exact to apply). LAPACK's f32
// constants, except TBIG = 2^50 rather than 2^52: medium squares are then
// < 2^100, so the medium sum can't overflow below n = 2^28 elements.
const TSML: f32 = 0x1p-63f;
const TBIG: f32 = 0x1p50f;
const SSML: f32 = 0x1p75f;
const SBIG: f32 = 0x1p-76f;

// Adds |xi|'s contribution to (big, medium, small). NaN fails both
// comparisons and lands in medium, which the final combine propagates.
fn accum(s: vec3f, xi: f32) -> vec3f {
  let ax = abs(xi);
  let big = ax > TBIG;
  let sml = ax < TSML;
  let yb = ax * SBIG;
  let ys = ax * SSML;
  return s + vec3f(
    select(0.0, yb * yb, big),
    select(ax * ax, 0.0, big || sml),
    select(0.0, ys * ys, sml),
  );
}

var<workgroup> tile: array<vec3f, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = vec3f(0.0);
  var acc1 = vec3f(0.0);
  var acc2 = vec3f(0.0);
  var acc3 = vec3f(0.0);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = accum(acc0, x[ id                * params.x_inc]);
    acc1 = accum(acc1, x[(id +      stride) * params.x_inc]);
    acc2 = accum(acc2, x[(id + 2u * stride) * params.x_inc]);
    acc3 = accum(acc3, x[(id + 3u * stride) * params.x_inc]);
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = accum(acc0, x[id * params.x_inc]);
  }

  tile[lid.x] = (acc0 + acc1) + (acc2 + acc3);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      tile[lid.x] = tile[lid.x] + tile[lid.x + s];
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partials[3u * wgid.x]      = tile[0].x;
    partials[3u * wgid.x + 1u] = tile[0].y;
    partials[3u * wgid.x + 2u] = tile[0].z;
  }
}
`;
    });
  var Et,
    At = ir(() => {
      Et = `// scaledSum reduction: collapses snrm2.wgsl's 2*WGS (big, medium, small)
// partials into the final norm. The partials merge by plain addition (their
// scales are fixed powers of two \u2014 see snrm2.wgsl), then the three sums are
// combined exactly as LAPACK 3.10's snrm2 does: big dominates if present
// (medium folded in at big's scale); otherwise small and medium meet
// through their square roots, so neither has to be rescaled into the
// other's range; otherwise it's medium alone.
// dispatch: 1 workgroup of WGS threads.
// partials must hold exactly 3 * 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials: array<f32>;
@group(0) @binding(1) var<storage, read_write> result:   array<f32>;

const WGS: u32 = 64;

const SSML: f32 = 0x1p75f;  // must match snrm2.wgsl
const SBIG: f32 = 0x1p-76f; // must match snrm2.wgsl
const SBIG_SQ_EXP: i32 = -152; // log2(SBIG\xB2)

// NaN test on the bit pattern: \`v != v\` can be folded away by a shader
// compiler that assumes no NaNs (measured: it was, on NVIDIA/Vulkan).
fn isNan(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) > 0x7f800000u;
}

fn partial(i: u32) -> vec3f {
  return vec3f(partials[3u * i], partials[3u * i + 1u], partials[3u * i + 2u]);
}

var<workgroup> tile: array<vec3f, 64>;

@compute @workgroup_size(64)
fn reduce_scaled(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  tile[i] = partial(i) + partial(i + WGS);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) {
      tile[i] = tile[i] + tile[i + s];
    }
    workgroupBarrier();
  }

  if (i == 0u) {
    var abig = tile[0].x;
    var amed = tile[0].y;
    var asml = tile[0].z;
    // A NaN anywhere in x landed in the medium sum: the norm is NaN (min/max
    // below don't propagate NaN reliably, so return it outright).
    if (isNan(amed)) {
      result[0] = amed;
      return;
    }
    let medLive = amed > 0.0;
    var scl = 1.0;
    var sumsq = amed;
    if (abig > 0.0) {
      // Medium in big's units is amed\xB7SBIG\xB2 = amed\xB72^-152 \u2014 one exact ldexp.
      // Never as (amed\xB7SBIG)\xB7SBIG: a compiler may fold that into
      // amed\xB7(SBIG\xB7SBIG), and the constant 2^-152 underflows f32 to 0 (it
      // did, on NVIDIA/Vulkan). If the scaled value underflows, medium was
      // below big's rounding anyway (big's smallest square is 2^-52).
      if (medLive) { abig = abig + ldexp(amed, SBIG_SQ_EXP); }
      scl = 1.0 / SBIG;
      sumsq = abig;
    } else if (asml > 0.0) {
      if (medLive) {
        amed = sqrt(amed);
        asml = sqrt(asml) / SSML;
        let ymax = max(asml, amed);
        let ymin = min(asml, amed);
        let q = ymin / ymax;
        sumsq = ymax * ymax * (1.0 + q * q);
      } else {
        scl = 1.0 / SSML;
        sumsq = asml;
      }
    }
    result[0] = scl * sqrt(sumsq);
  }
}
`;
    });
  var St,
    Lt = ir(() => {
      St = `// isamax: returns index of element with largest absolute value
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
  var Dt,
    Gt = ir(() => {
      Dt = `// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
  var Cr,
    Nt = ir(() => {
      Cr = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
  var Ee,
    Pt = ir(() => {
      Ee = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
    It = ir(() => {
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
  var Rt,
    Mt = ir(() => {
      Rt = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
  var Ie,
    Tt = ir(() => {
      Ie = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
  var Zr,
    Ht = ir(() => {
      Zr = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var jt,
    Ct = ir(() => {
      jt = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
  var Wt,
    Ft = ir(() => {
      Wt = `// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
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
  var Kt,
    Ot = ir(() => {
      Kt = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
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
  var Me,
    qt = ir(() => {
      Me = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var Ut,
    Vt = ir(() => {
      Ut = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var Zt,
    zt = ir(() => {
      Zt = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
  var Yt,
    Xt = ir(() => {
      Yt = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
  var Jt,
    $t = ir(() => {
      Jt = `// srot: x = c*x + s*y,  y = -s*x + c*y

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
  var ro,
    Qt = ir(() => {
      ro = `// drot: x = c*x + s*y, y = -s*x + c*y \u2014 double-double (Dekker) f64 emulation
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
  var to,
    eo = ir(() => {
      to = `// srotm: applies modified Givens rotation H to vectors x and y.
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
  var ao,
    oo = ir(() => {
      ao = `// drotm: applies a modified Givens rotation H to vectors x and y \u2014 double-
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
  var Re,
    io = ir(() => {
      Re = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var no,
    so = ir(() => {
      no = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  var uo,
    lo = ir(() => {
      uo = `// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
// emulation of snrm2 \u2014 the same fixed-scale Blue's algorithm (Anderson
// 2017; LAPACK 3.10's dnrm2), with each accumulator a DD pair. DD widens the
// mantissa, not the exponent range, so the scaling is still needed:
//   big:    |x| > TBIG  \u2192 (|x| \xB7 SBIG)\xB2
//   medium: in between  \u2192 |x|\xB2
//   small:  |x| < TSML  \u2192 (|x| \xB7 SSML)\xB2
// The big side matches snrm2. The small side doesn't: a square's lo half is
// ~2^-48 below it, and the GPU flushes denormals, so every square must stay
// >= 2^-78 to keep its full DD precision (with snrm2's TSML = 2^-63, medium
// inputs near 1e-15 lost ~17 bits). Here medium starts at 2^-38 (squares
// >= 2^-76), and SSML = 2^64 maps small inputs down to 2^-102 into
// [2^-38, 2^26). Below 2^-102 an input's own lo half is already a denormal
// (flushed on load), so no scaling can recover it.
// Scaling by a power of two is exact on both DD halves, so each element
// costs one protected square and one protected add (into whichever
// accumulator its magnitude picks, via select \u2014 protected ops' barriers need
// every thread at the same call site). The running-max (scale, ssq) update
// this replaced cost a protected divide, three multiplies and two adds per
// element.
//
// Inf and NaN would turn into NaN inside the DD error terms (inf - inf), so
// they're kept out of the sums and tracked in a flag instead (0 = none,
// 1 = Inf seen, 2 = NaN seen; merged by max) \u2014 reduction/scaledSumF64.wgsl
// returns NaN, else Inf, if set.
//
// pass 1 dispatches 2*WGS workgroups; pass 2 is reduction/scaledSumF64.wgsl.

@group(0) @binding(0) var<storage, read>       xHi:      array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:      array<f32>;
@group(0) @binding(2) var<storage, read_write> partials: array<f32>; // PARTIAL_LEN per workgroup
@group(0) @binding(3) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;
// Per-workgroup partial: big.hi, big.lo, med.hi, med.lo, sml.hi, sml.lo, flag.
const PARTIAL_LEN: u32 = 7;

// Thresholds and scales (powers of two) \u2014 see the header for the DD-specific
// small side; TBIG/SBIG are snrm2.wgsl's.
const TSML: f32 = 0x1p-38f;
const TBIG: f32 = 0x1p50f;
const SSML: f32 = 0x1p64f;
const SBIG: f32 = 0x1p-76f;

struct Acc3 {
  big:  DD,
  med:  DD,
  sml:  DD,
  flag: f32,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Bit-pattern tests: \`v != v\` style checks can be folded away by a shader
// compiler that assumes no NaNs (it was, for snrm2, on NVIDIA/Vulkan).
fn isNan(v: f32) -> bool { return (bitcast<u32>(v) & 0x7fffffffu) > 0x7f800000u; }
fn isInf(v: f32) -> bool { return (bitcast<u32>(v) & 0x7fffffffu) == 0x7f800000u; }

// Adds one element to the accumulators. Every thread makes the same two
// protected calls whatever the element's magnitude.
fn accumProtected(acc: Acc3, xi: DD, threadSlot: u32) -> Acc3 {
  let ax = ddAbs(xi);
  let nan = isNan(ax.hi);
  let inf = isInf(ax.hi);
  let finite = !(nan || inf);
  let big = finite && ax.hi > TBIG;
  let sml = finite && ax.hi < TSML;
  let med = finite && !big && !sml;
  let s = select(select(1.0, SSML, sml), SBIG, big);
  let y = DD(select(0.0, ax.hi * s, finite), select(0.0, ax.lo * s, finite));
  let sq = ddMulProtected(y, y, threadSlot);
  let dest = ddSelect(ddSelect(acc.med, acc.sml, sml), acc.big, big);
  let sum = ddAddProtected(dest, sq, threadSlot);
  return Acc3(
    ddSelect(acc.big, sum, big),
    ddSelect(acc.med, sum, med),
    ddSelect(acc.sml, sum, sml),
    max(acc.flag, select(select(0.0, 1.0, inf), 2.0, nan)),
  );
}

// Partials merge by addition \u2014 their scales are fixed powers of two.
fn mergeProtected(a: Acc3, b: Acc3, threadSlot: u32) -> Acc3 {
  return Acc3(
    ddAddProtected(a.big, b.big, threadSlot),
    ddAddProtected(a.med, b.med, threadSlot),
    ddAddProtected(a.sml, b.sml, threadSlot),
    max(a.flag, b.flag),
  );
}

const ZERO3 = Acc3(DD(0.0, 0.0), DD(0.0, 0.0), DD(0.0, 0.0), 0.0);

var<workgroup> tile: array<f32, 448>; // WGS \xD7 PARTIAL_LEN

fn tileLoad(i: u32) -> Acc3 {
  let b = i * PARTIAL_LEN;
  return Acc3(DD(tile[b], tile[b + 1u]), DD(tile[b + 2u], tile[b + 3u]),
              DD(tile[b + 4u], tile[b + 5u]), tile[b + 6u]);
}

fn tileStore(i: u32, v: Acc3) {
  let b = i * PARTIAL_LEN;
  tile[b] = v.big.hi;
  tile[b + 1u] = v.big.lo;
  tile[b + 2u] = v.med.hi;
  tile[b + 3u] = v.med.lo;
  tile[b + 4u] = v.sml.hi;
  tile[b + 5u] = v.sml.lo;
  tile[b + 6u] = v.flag;
}

@compute @workgroup_size(64)
fn dnrm2_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = ZERO3;
  var acc1 = ZERO3;
  var acc2 = ZERO3;
  var acc3 = ZERO3;

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
    acc0 = accumProtected(acc0, DD(xHi[i0], xLo[i0]), lid.x);
    acc1 = accumProtected(acc1, DD(xHi[i1], xLo[i1]), lid.x);
    acc2 = accumProtected(acc2, DD(xHi[i2], xLo[i2]), lid.x);
    acc3 = accumProtected(acc3, DD(xHi[i3], xLo[i3]), lid.x);
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
    let v = DD(select(0.0, xHi[i], valid), select(0.0, xLo[i], valid));
    acc0 = accumProtected(acc0, v, lid.x);
  }

  let combined = mergeProtected(
    mergeProtected(acc0, acc1, lid.x),
    mergeProtected(acc2, acc3, lid.x),
    lid.x,
  );
  tileStore(lid.x, combined);
  workgroupBarrier();

  // Inactive threads merge against a throwaway partner and discard it
  // (mergeProtected must be called unconditionally by every thread).
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(lid.x, lid.x + s, lid.x < s);
    let merged = mergeProtected(tileLoad(lid.x), tileLoad(partner), lid.x);
    workgroupBarrier(); // all threads must read tile[] above before any write below
    if (lid.x < s) { tileStore(lid.x, merged); }
    workgroupBarrier();
  }

  if (lid.x < PARTIAL_LEN) {
    partials[wgid.x * PARTIAL_LEN + lid.x] = tile[lid.x];
  }
}
`;
    });
  var mo,
    fo = ir(() => {
      mo = `// scaledSumF64 reduction: collapses dnrm2.wgsl's 2*WGS (big, medium, small,
// flag) DD partials into the final norm \u2014 the double-double counterpart of
// reduction/scaledSum.wgsl. Partials merge by DD addition (fixed power-of-
// two scales), then the three sums combine as in LAPACK 3.10's dnrm2: big
// dominates if present (medium folded in at big's scale); otherwise small
// and medium meet through their square roots; otherwise medium alone. A
// NaN seen anywhere gives NaN, else an Inf gives Inf (see dnrm2.wgsl).
//
// Protected ops need every thread at the same call site, so every thread
// evaluates all three cases and select() picks \u2014 only thread 0 writes.
// dispatch: 1 workgroup of WGS threads.
// partials must hold exactly PARTIAL_LEN * 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials: array<f32>;
@group(0) @binding(1) var<storage, read_write> resultHi: array<f32, 1>;
@group(0) @binding(2) var<storage, read_write> resultLo: array<f32, 1>;

const WGS: u32 = 64;
const PARTIAL_LEN: u32 = 7; // must match dnrm2.wgsl

const SSML: f32 = 0x1p64f;  // must match dnrm2.wgsl
const SBIG: f32 = 0x1p-76f; // must match dnrm2.wgsl
const SBIG_SQ_EXP: i32 = -152; // log2(SBIG\xB2)

struct Acc3 {
  big:  DD,
  med:  DD,
  sml:  DD,
  flag: f32,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Exact scaling of a DD value by a power of two.
fn ddScale(a: DD, s: f32) -> DD {
  return DD(a.hi * s, a.lo * s);
}

fn mergeProtected(a: Acc3, b: Acc3, threadSlot: u32) -> Acc3 {
  return Acc3(
    ddAddProtected(a.big, b.big, threadSlot),
    ddAddProtected(a.med, b.med, threadSlot),
    ddAddProtected(a.sml, b.sml, threadSlot),
    max(a.flag, b.flag),
  );
}

fn partialAt(i: u32) -> Acc3 {
  let b = i * PARTIAL_LEN;
  return Acc3(DD(partials[b], partials[b + 1u]), DD(partials[b + 2u], partials[b + 3u]),
              DD(partials[b + 4u], partials[b + 5u]), partials[b + 6u]);
}

var<workgroup> tile: array<f32, 448>; // WGS \xD7 PARTIAL_LEN

fn tileLoad(i: u32) -> Acc3 {
  let b = i * PARTIAL_LEN;
  return Acc3(DD(tile[b], tile[b + 1u]), DD(tile[b + 2u], tile[b + 3u]),
              DD(tile[b + 4u], tile[b + 5u]), tile[b + 6u]);
}

fn tileStore(i: u32, v: Acc3) {
  let b = i * PARTIAL_LEN;
  tile[b] = v.big.hi;
  tile[b + 1u] = v.big.lo;
  tile[b + 2u] = v.med.hi;
  tile[b + 3u] = v.med.lo;
  tile[b + 4u] = v.sml.hi;
  tile[b + 5u] = v.sml.lo;
  tile[b + 6u] = v.flag;
}

@compute @workgroup_size(64)
fn reduce_scaled_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  tileStore(i, mergeProtected(partialAt(i), partialAt(i + WGS), i));
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(i, i + s, i < s);
    let merged = mergeProtected(tileLoad(i), tileLoad(partner), i);
    workgroupBarrier();
    if (i < s) { tileStore(i, merged); }
    workgroupBarrier();
  }

  // Final combine \u2014 every thread computes it (protected ops), thread 0 writes.
  let t = tileLoad(0u);
  let medLive = t.med.hi > 0.0;
  let one = DD(1.0, 0.0);

  // Medium's norm (0 if empty; ddSqrtProtected handles 0 exactly).
  let rMed = ddSqrtProtected(t.med, i);

  // Case big: medium in big's units is amed\xB7SBIG\xB2 = amed\xB72^-152 \u2014 one exact
  // ldexp. Never as (amed\xB7SBIG)\xB7SBIG: a compiler may fold that into
  // amed\xB7(SBIG\xB7SBIG), and the constant 2^-152 underflows f32 to 0 (it did,
  // on NVIDIA/Vulkan). Not via sqrt(amed) squared either: the DD sqrt is
  // markedly less accurate on some backends. If the scaled value underflows,
  // medium was below big's rounding anyway (big's smallest square is 2^-52).
  let medInBig = DD(ldexp(t.med.hi, SBIG_SQ_EXP), ldexp(t.med.lo, SBIG_SQ_EXP));
  let bigTotal = ddAddProtected(t.big, medInBig, i);
  let resBig = ddScale(ddSqrtProtected(bigTotal, i), 1.0 / SBIG);

  // Case small: with medium present, the two meet through their roots,
  // ymax\xB7sqrt(1 + (ymin/ymax)\xB2); alone, small's root scaled back down.
  let rSml = ddScale(ddSqrtProtected(t.sml, i), 1.0 / SSML);
  let smlBigger = ddGreater(rSml, rMed);
  let ymax = ddSelect(rMed, rSml, smlBigger);
  let ymin = ddSelect(rSml, rMed, smlBigger);
  let q = ddDivProtected(ymin, ddSelect(ymax, one, ymax.hi == 0.0), i);
  let q2 = ddMulProtected(q, q, i);
  let resMix = ddMulProtected(ymax, ddSqrtProtected(ddAddProtected(one, q2, i), i), i);
  let resSml = ddSelect(rSml, resMix, medLive);

  var res = ddSelect(ddSelect(rMed, resSml, t.sml.hi > 0.0), resBig, t.big.hi > 0.0);
  // Built from a runtime value: a const-expression that evaluates to Inf or
  // NaN is a shader-creation error in WGSL.
  let rt = i & 0u;
  let inf = bitcast<f32>(0x7f800000u | rt);
  let nan = bitcast<f32>(0x7fc00000u | rt);
  res = ddSelect(res, DD(inf, 0.0), t.flag >= 1.0);
  res = ddSelect(res, DD(nan, 0.0), t.flag >= 2.0);

  if (i == 0u) {
    resultHi[0] = res.hi;
    resultLo[0] = res.lo;
  }
}
`;
    });
  var Le,
    po = ir(() => {
      Le = `// reduce_partials: y[i] = alpha * \u03A3_c partial[c*n + i] + beta * y[i]
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
  var wo,
    co = ir(() => {
      wo = `// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
  var ho,
    go = ir(() => {
      ho = `// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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
  var re,
    bo = ir(() => {
      re = `// gather_strided: dst[i] = src[i * inc], i < n
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
  var xo,
    yo = ir(() => {
      xo = `// ssymv (pass 1 of 2): y = alpha * A * x + beta * y, A n\xD7n symmetric with only
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
  var _o,
    vo = ir(() => {
      _o = `// strmv: y = A * x \u2014 strmv's no-transpose path (transpose runs strmv_t.wgsl).
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
  var ko,
    Bo = ir(() => {
      ko = `// strmv_t: y = A^T * x for triangular A \u2014 strmv's transpose path, in the
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
  var Te,
    Ao = ir(() => {
      Te = `// strsv_invert_block: computes the explicit inverse of every BLOCK_SIZE \xD7
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
  var Lo,
    Eo = ir(() => {
      Lo = `// strsv_step: one block of the blocked triangular solve, in a single
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
  var He,
    So = ir(() => {
      He = `// scatter_strided: dst[i * inc] = src[i], i < n \u2014 the inverse of
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
  var Ce,
    Go = ir(() => {
      Ce = `// strsm_small: the whole triangular solve in one dispatch when the order
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
  var No,
    Do = ir(() => {
      No = `// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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
  var Io,
    Po = ir(() => {
      Io = `// dger: A := alpha * x * y^T + A, double-double (Dekker) f64 emulation of
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
  var Ro,
    Mo = ir(() => {
      Ro = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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
  var Ho,
    To = ir(() => {
      Ho = `// dsyr: A := alpha * x * x^T + A, double-double (Dekker) f64 emulation of
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
  var jo,
    Co = ir(() => {
      jo = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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
  var Wo,
    Fo = ir(() => {
      Wo = `// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
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
  var Ko,
    Oo = ir(() => {
      Ko = `// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
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
  var Vo,
    qo = ir(() => {
      Vo = `// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_t (matrix-vector product, transposed). A, x, y, alpha,
// and beta are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
// Same one-thread-per-output-column shape as sgemv_t.wgsl, tiling over x
// (length m) via shared memory, and the same split-K: rows are split into
// chunks along wid.y, each chunk writing its share to
// partialHi/Lo[chunk*n + col] for reduce_partials_f64.wgsl to sum and scale
// by alpha/beta. With one thread per output, n=4096 is only 64 workgroups \u2014
// too few to hide the protected ops' barrier latency. A single chunk
// (\`direct\` = 1) skips the second pass and writes y here instead.
//
// Because ddMulProtected/ddAddProtected each carry a workgroupBarrier(),
// every thread in the workgroup \u2014 including ones whose column is out of
// range (n not a multiple of WGS) \u2014 must call them the same number of
// times: unlike sgemv_t.wgsl's early return for \`col >= n\`, out-of-range
// threads here compute against a clamped dummy column unconditionally and
// simply never write their result (same technique dger.wgsl/ddot.wgsl use
// for their ragged tails). The chunk's row range depends only on wid.y, so
// the loop bounds are workgroup-uniform.

@group(0) @binding(0) var<storage, read>       AHi:   array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:   array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> outHi: array<f32>; // y, or partials
@group(0) @binding(5) var<storage, read_write> outLo: array<f32>;

struct Params {
  m:         u32,
  n:         u32,
  alphaHi:   f32,
  alphaLo:   f32,
  betaHi:    f32,
  betaLo:    f32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  chunkRows: u32,  // a multiple of WGS
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> xTile: array<DD, 64>;

@compute @workgroup_size(64)
fn dgemv_t_main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let col      = wid.x * WGS + lid.x;
  let colValid = col < params.n;
  // Clamp so out-of-range threads still index safely \u2014 their contribution
  // is computed but never written back.
  let safeCol  = select(0u, col, colValid);

  let jStart = wid.y * params.chunkRows;
  let jEnd   = min(jStart + params.chunkRows, params.m);

  var acc = DD(0.0, 0.0);

  let tiles = (jEnd - jStart) / WGS;
  for (var t = 0u; t < tiles; t++) {
    let base = jStart + t * WGS;
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

  // Remainder rows (only the last chunk, when m isn't a multiple of WGS):
  // the count is the same for every thread regardless of col, so this loop
  // is already barrier-safe without a second tiling pass.
  for (var row = jStart + tiles * WGS; row < jEnd; row++) {
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let prod = ddMulProtected(DD(AHi[ia], ALo[ia]), DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  // \`direct\` is uniform, but the protected ops still run on both paths (a
  // barrier under a uniform branch is legal; this keeps the write the only
  // divergent part).
  if (params.direct == 1u) {
    let alpha = DD(params.alphaHi, params.alphaLo);
    let beta  = DD(params.betaHi, params.betaLo);
    let scaled = ddMulProtected(alpha, acc, lid.x);

    let iy = safeCol * params.incy;
    let yVal = DD(outHi[iy], outLo[iy]);
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
      outHi[iy] = result.hi;
      outLo[iy] = result.lo;
    }
  } else if (colValid) {
    outHi[wid.y * params.n + col] = acc.hi;
    outLo[wid.y * params.n + col] = acc.lo;
  }
}
`;
    });
  var Se,
    Uo = ir(() => {
      Se = `// reduce_partials_f64: y[i] = alpha * \u03A3_c partial[c*n + i] + beta * y[i],
// double-double (Dekker) f64 emulation of reduce_partials.wgsl \u2014 the second
// pass for the split-K f64 Level 2 kernels (dgemv_t). Partials and y are
// (hi, lo) f32 pairs; reads are coalesced across i.
//
// The protected ops carry a workgroupBarrier(), so the grid-stride and
// chunk loops run a workgroup-uniform trip count, and lanes past n compute
// against a clamped index and skip only the write.

@group(0) @binding(0) var<storage, read>       partialHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi:       array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo:       array<f32>;

struct Params {
  n:       u32,
  chunks:  u32,
  incy:    u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn reduce_partials_f64(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;

  let stride = nwg.x * WGS;
  let iters  = (params.n + stride - 1u) / stride;
  for (var it = 0u; it < iters; it++) {
    let i     = gid.x + it * stride;
    let valid = i < params.n;
    let si    = select(0u, i, valid);

    var s = DD(0.0, 0.0);
    for (var c = 0u; c < params.chunks; c++) {
      let pi = c * params.n + si;
      s = ddAddProtected(s, DD(partialHi[pi], partialLo[pi]), lid.x);
    }

    let yi = si * params.incy;
    let scaled = ddMulProtected(alpha, s, lid.x);
    let betaTimesY = ddMulProtected(beta, DD(yHi[yi], yLo[yi]), lid.x);
    let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 the result
    // must not depend on y's prior value (though it is still read above).
    let result = DD(
      select(scaled.hi, withBeta.hi, isBetaNonzero),
      select(scaled.lo, withBeta.lo, isBetaNonzero),
    );
    if (valid) {
      yHi[yi] = result.hi;
      yLo[yi] = result.lo;
    }
  }
}
`;
    });
  var Zo,
    zo = ir(() => {
      Zo = `// dsymv: y := alpha * A * x + beta * y, double-double (Dekker) f64 emulation
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
  var Yo,
    Xo = ir(() => {
      Yo = `// dsymv_tile (pass 1 of 2): y = alpha * A * x + beta * y, double-double
// (Dekker) f64 emulation of ssymv.wgsl \u2014 A n\xD7n symmetric with only its lower
// (uplo=0) or upper (uplo=1) triangle stored; A and x are (hi, lo) f32 pairs.
//
// Same tiling as ssymv.wgsl: one workgroup per TILE\xD7TILE tile of the stored
// triangle, read once with coalesced loads, applied as tile\xB7x (to the tile's
// rows) and, off the diagonal, as tile\u1D40\xB7x (to its columns: the mirrored half
// A[j,i] = A[i,j]). So A is read once, half of n\xB2, and never through a
// strided column walk. Each contribution goes to its own partial slot \u2014
// with p >= q the stored-block pair of a tile, slot q of block p's rows and
// slot p of block q's rows (only slot p when p == q) \u2014 and
// reduce_partials_f64.wgsl sums them and applies alpha/beta. Every
// (block, slot) pair is written exactly once, so the partials need no
// clearing.
//
// The protected ops carry a workgroupBarrier(), so every thread makes the
// same calls (threadSlot = local_invocation_index, 256 threads \u2014 the size
// of dekkerScratch): out-of-range and off-triangle elements are masked to 0,
// and the final 8-way row/column sums are a tree every thread steps through
// (ssymv.wgsl's \`ty == 0\` loop would be divergent), with only the writes
// conditional.

@group(0) @binding(0) var<storage, read>       AHi:       array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:       array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:       array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:       array<f32>;
@group(0) @binding(4) var<storage, read_write> partialHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> partialLo: array<f32>;

struct Params {
  n:         u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  numBlocks: u32,
  incx:      u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const TILE: u32 = 32u;
const ROWS_PER_THREAD: u32 = 4u; // TILE / workgroup height (8)

var<workgroup> xr: array<DD, 32>;       // x over the tile's rows
var<workgroup> xc: array<DD, 32>;       // x over the tile's columns
var<workgroup> rowRed: array<DD, 1056>; // TILE x (TILE+1): per-element row products
// 64 groups of 8: groups 0..31 are row r's partials (4 columns each), groups
// 32..63 column c's partials (4 rows each); the tree sums each group to its
// first element.
var<workgroup> red: array<DD, 512>;

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

fn xAt(i: u32) -> DD {
  let n = params.n;
  let ix = min(i, n - 1u) * params.incx;
  return ddMask(DD(xHi[ix], xLo[ix]), i < n);
}

@compute @workgroup_size(32, 8)
fn dsymv_tile_main(
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

  if (ty == 0u) { xr[tx] = xAt(r0 + tx); }
  if (ty == 1u) { xc[tx] = xAt(c0 + tx); }
  workgroupBarrier();

  // Each thread takes rows ty, ty+8, ty+16, ty+24 of column tx \u2014 32 lanes per
  // row, so each warp reads one contiguous 128-byte segment per half. A
  // diagonal tile has only one triangle stored: a stored element feeds its
  // own row, a strictly-stored one also feeds its mirror (column) \u2014 the same
  // two sums as an off-diagonal tile, just masked.
  var colPart = DD(0.0, 0.0);
  let gc = c0 + tx;
  for (var k = 0u; k < ROWS_PER_THREAD; k++) {
    let r = ty + 8u * k;
    let gr = r0 + r;
    let ia = min(gr, n - 1u) * params.lda + min(gc, n - 1u);
    let a = ddMask(DD(AHi[ia], ALo[ia]), gr < n && gc < n);
    let stored = !diag || select(tx >= r, tx <= r, lower);
    let strict = !diag || select(tx > r, tx < r, lower);
    rowRed[r * (TILE + 1u) + tx] = ddMulProtected(ddMask(a, stored), xc[tx], tid);
    colPart = ddAddProtected(colPart, ddMulProtected(ddMask(a, strict), xr[r], tid), tid);
  }
  red[256u + tx * 8u + ty] = colPart;
  workgroupBarrier();

  // Row sums: 8 lanes per row each add 4 columns.
  let row = tid / 8u;
  let seg = tid % 8u;
  let base = row * (TILE + 1u) + seg * 4u;
  red[row * 8u + seg] = ddAddProtected(
    ddAddProtected(rowRed[base], rowRed[base + 1u], tid),
    ddAddProtected(rowRed[base + 2u], rowRed[base + 3u], tid),
    tid,
  );
  workgroupBarrier();

  // Tree over each group of 8: width 4, 2, 1 \u2014 256, 128, then 64 live
  // pairs; idle threads add a throwaway pair and discard it.
  for (var w = 4u; w > 0u; w >>= 1u) {
    let live = tid < 64u * w;
    let g = min(tid / w, 63u);
    let i = g * 8u + tid % w;
    let s = ddAddProtected(red[i], red[i + w], tid);
    workgroupBarrier();
    if (live) { red[i] = s; }
    workgroupBarrier();
  }

  // Lanes tx of row ty == 0 write row tx's and column tx's sums.
  let rs = red[tx * 8u];
  let cs = red[(32u + tx) * 8u];
  let both = ddAddProtected(rs, cs, tid);
  if (ty == 0u) {
    if (diag) {
      // Both sums land on the same rows (and slot) for a diagonal tile.
      if (r0 + tx < n) {
        partialHi[p * n + r0 + tx] = both.hi;
        partialLo[p * n + r0 + tx] = both.lo;
      }
    } else {
      // tile \xB7 x \u2192 the tile's rows (block rb), slot cb
      if (r0 + tx < n) {
        partialHi[cb * n + r0 + tx] = rs.hi;
        partialLo[cb * n + r0 + tx] = rs.lo;
      }
      // tile\u1D40 \xB7 x \u2192 the tile's columns (block cb), slot rb
      if (c0 + tx < n) {
        partialHi[rb * n + c0 + tx] = cs.hi;
        partialLo[rb * n + c0 + tx] = cs.lo;
      }
    }
  }
}
`;
    });
  var Jo,
    $o = ir(() => {
      Jo = `// dtrmv: y := op(A) * x, double-double (Dekker) f64 emulation of strmv
// (triangular matrix-vector product). dtrmv.mjs runs this for no-transpose,
// and for transpose below COLUMN_KERNEL_MIN_N (above it, dtrmv_t.wgsl). A, x, and y are each split into an f32
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
  var ra,
    Qo = ir(() => {
      ra = `// dtrmv_t: y = A^T * x for triangular A, double-double (Dekker) f64
// emulation of strmv_t \u2014 dtrmv's transpose path, in the kernel's row-major
// frame (dtrmv.mjs has already folded layout into uplo/trans).
// y[i] = \u03A3_j A[j,i] * x[j] over the stored range: j >= i for lower, j <= i
// for upper.
//
// One thread per output i (a column of A), so at each step j the 64 lanes
// of a workgroup read A[j*lda + i..i+63] \u2014 contiguous, coalesced. dtrmv.wgsl
// used one workgroup per i with lanes walking j, which strided every lane by
// lda.
//
// Rows are split into chunks along wid.y (split-K) so there are enough
// workgroups in flight to hide the protected ops' barrier latency; each
// chunk writes its share to partialHi/Lo[chunk*n + i] and
// reduce_partials_f64.wgsl sums them (alpha = 1, beta = 0). With a single
// chunk (\`direct\` = 1) the result goes straight to y and no second pass runs.
//
// The protected ops carry a workgroupBarrier(), so every lane makes the same
// calls: the row range depends only on the workgroup, and lanes outside a
// column's stored range (or past n) compute against an in-bounds column and
// have their term selected to 0.

@group(0) @binding(0) var<storage, read>       AHi:   array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:   array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> outHi: array<f32>; // y, or partials
@group(0) @binding(5) var<storage, read_write> outLo: array<f32>;

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

@group(0) @binding(6) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn dtrmv_t_main(
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
  jEnd = max(jEnd, jStart); // an empty range must not wrap below

  var acc = DD(0.0, 0.0);
  for (var j = jStart; j < jEnd; j++) {
    let inRange = select(j <= i, j >= i, params.uplo == 0u) && iOK;
    let isUnitDiag = params.diag == 1u && j == i;
    let ia = j * params.lda + ic;
    let a = DD(select(AHi[ia], 1.0, isUnitDiag), select(ALo[ia], 0.0, isUnitDiag));
    let ix = j * params.incx; // same for every lane: a broadcast read
    let prod = ddMulProtected(a, DD(xHi[ix], xLo[ix]), lid.x);
    let term = DD(select(0.0, prod.hi, inRange), select(0.0, prod.lo, inRange));
    acc = ddAddProtected(acc, term, lid.x);
  }

  if (iOK) {
    if (params.direct == 1u) {
      outHi[i * params.incy] = acc.hi;
      outLo[i * params.incy] = acc.lo;
    } else {
      outHi[wid.y * params.n + i] = acc.hi;
      outLo[wid.y * params.n + i] = acc.lo;
    }
  }
}
`;
    });
  var ta,
    ea = ir(() => {
      ta = `// dtrsv_small: substitution over one 64-row diagonal block, double-double
// (Dekker) f64 \u2014 the f64 counterpart of strsm_small.wgsl as strsv uses it.
// Two modes, picked by the uniform \`invert\` param:
//   solve  (invert = 0): one block of the system, in place on x through a
//          strided view (dtrsv's whole solve when n <= 64, and each diagonal
//          block of the few-block path), optionally leaving a packed copy of
//          the solution in X for the presolved dtrsv_step update.
//   invert (invert = 1): every block's explicit inverse at once (dispatch
//          y = numBlocks), solving op(A_block)\xB7X = I four columns per
//          workgroup, written COLUMN-major (inv[r][c] at c*64 + r) for
//          dtrsv_step.wgsl's coalesced matvec. Rows above a column's
//          diagonal are structural zeros, so a workgroup's steps start at
//          its first column \u2014 and every row is written, zeros included.
// An effectively-upper block is reversed into a lower one first (J\xB7U\xB7J, as
// in strsv_invert_block.wgsl), so the loop always runs forward.
//
// Thread (i, r) owns row i of right-hand side r. Step j: every thread forms
// b_i / L_ii (as b_i times the reciprocal it computed up front), row j's
// owner publishes it as x_j, and every row below folds it in,
// b_i -= L_ij\xB7x_j. The protected ops carry a workgroupBarrier(), so every
// thread makes the same calls and selects \u2014 strsm_small.wgsl's 4\xD74 chunking
// would add protected ops, not save barriers. Each step's L_ij load is
// issued a step ahead, off the dependency chain. (The per-column inversion
// this replaced ran a 64-lane tree reduction plus a division per step:
// ~38 barriers per step against ~9 here.)

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> BHi: array<f32>; // x (solve) or Ainv (invert)
@group(0) @binding(3) var<storage, read_write> BLo: array<f32>;
// Packed copy of the solution (row i at i), solve mode with xLd = 1: the
// presolved dtrsv_step reads the block's solution from there, contiguous \u2014
// where the inverse path's step leaves it too. Unused when inverting.
@group(0) @binding(4) var<storage, read_write> XHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> XLo: array<f32>;

struct Params {
  n:        u32, // solve: the block's order (<= BLOCK_SIZE); invert: the full order
  aOff:     u32, // solve: the block's A offset (invert derives it per block)
  aRs:      u32, // op(A) element (i, j) at off + i*aRs + j*aCs
  aCs:      u32,
  bOff:     u32, // solve: x's view
  bInc:     u32,
  backward: u32, // 1 = effectively upper: solve on the reversed system
  unit:     u32, // 1 = unit diagonal (not read)
  invert:   u32,
  xLd:      u32, // solve: 1 = also write the packed copy to X
}

@group(0) @binding(6) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const RHS_PER_WG: u32 = 4u;

var<workgroup> published: array<DD, 4>; // x_j per right-hand side

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

fn loadA(idx: u32) -> DD {
  return DD(AHi[idx], ALo[idx]);
}

@compute @workgroup_size(256)
fn dtrsv_small_main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let inv = params.invert == 1u;
  let blockStart = wid.y * BLOCK_SIZE;
  let len = select(params.n, min(BLOCK_SIZE, params.n - blockStart), inv);
  // Invert: this workgroup's columns are [c0, c0+4); past the block it has
  // none. Uniform (workgroup id + params), so the barriers below stay legal.
  let c0 = wid.x * RHS_PER_WG;
  if (inv && c0 >= len) { return; }
  let aBase = select(params.aOff, blockStart * (params.aRs + params.aCs), inv);
  let back = params.backward == 1u;

  let i = tid % BLOCK_SIZE;
  let r = tid / BLOCK_SIZE;
  let rhs = c0 + r; // invert: this thread's column of the frame
  let live = i < len && select(r == 0u, rhs < len, inv);
  let li = min(i, len - 1u);
  let oi = select(li, len - 1u - li, back); // frame row -> block row
  let rowBase = aBase + oi * params.aRs;

  let one = DD(1.0, 0.0);
  let rinv = ddDivProtected(one, ddSelect(loadA(rowBase + oi * params.aCs), one, params.unit == 1u), tid);

  var b = DD(0.0, 0.0);
  if (inv) {
    b = ddSelect(b, one, i == rhs);
  } else if (live) {
    let bi = params.bOff + oi * params.bInc;
    b = DD(BHi[bi], BLo[bi]);
  }
  var xi = DD(0.0, 0.0); // rows above jStart are structural zeros

  let jStart = select(0u, c0, inv);
  var aNext = loadA(rowBase + select(jStart, len - 1u - jStart, back) * params.aCs);
  for (var j = jStart; j < len; j++) {
    let a = aNext;
    let jn = min(j + 1u, len - 1u);
    aNext = loadA(rowBase + select(jn, len - 1u - jn, back) * params.aCs);

    let cand = ddMulProtected(b, rinv, tid);
    if (i == j) {
      published[r] = cand;
      xi = cand;
    }
    workgroupBarrier();
    // The next write to published[r] comes after the barriers in the ops below,
    // so every thread has read this one by then.
    let xj = published[r];
    // a is L_ij only below the diagonal (above it, the unstored triangle \u2014
    // possibly anything, even NaN); select() keeps it out of b.
    let nb = ddSubProtected(b, ddMulProtected(a, xj, tid), tid);
    b = ddSelect(b, nb, i > j);
  }

  if (live) {
    if (inv) {
      let oc = select(rhs, len - 1u - rhs, back);
      let idx = wid.y * BLOCK_SIZE * BLOCK_SIZE + oc * BLOCK_SIZE + oi;
      BHi[idx] = xi.hi;
      BLo[idx] = xi.lo;
    } else {
      let bi = params.bOff + oi * params.bInc;
      BHi[bi] = xi.hi;
      BLo[bi] = xi.lo;
      if (params.xLd != 0u) {
        XHi[oi] = xi.hi;
        XLo[oi] = xi.lo;
      }
    }
  }
}
`;
    });
  var aa,
    oa = ir(() => {
      aa = `// dtrsv_step: one block of the blocked triangular solve in a single
// dispatch, double-double (Dekker) f64 emulation of strsv_step.wgsl \u2014
// replaces the dtrsv_apply_inverse + dtrsv_update pair, halving the number
// of sequential dispatches the solve is limited by.
//
// Every workgroup solves the block itself (a 64\xD764 matvec against the
// column-major inverse from dtrsv_small.wgsl's invert mode), then subtracts
// its contribution from its own tile of TILE_ROWS remaining rows. The
// solution goes to \`sol\`, not x: other workgroups are still reading this
// block's unsolved values from x in the same dispatch. dtrsv.mjs copies sol
// into x after the last block. Workgroup 0 writes \`sol\`; when no rows remain
// (the last block) a single workgroup runs just the solve. Presolved
// (few-block path): the block is already solved into sol by dtrsv_small.wgsl,
// and only the update runs.
//
// Four threads per row (256 per workgroup): each covers 16 of the block's 64
// columns in both the solve and the update, and the four partial sums meet
// in workgroup memory \u2014 a 16-term serial chain per thread instead of 64
// (dtrsv_apply_inverse) or a 64-lane tree per row (dtrsv_update). The
// protected ops carry a workgroupBarrier(), so every thread runs the same
// calls on clamped indices with masked terms; only writes are conditional.
// A thread's 16 loads are issued before its chain starts.

@group(0) @binding(0) var<storage, read>       AHi:    array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:    array<f32>;
@group(0) @binding(2) var<storage, read>       AinvHi: array<f32>;
@group(0) @binding(3) var<storage, read>       AinvLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> xHi:    array<f32>;
@group(0) @binding(5) var<storage, read_write> xLo:    array<f32>;
@group(0) @binding(6) var<storage, read_write> solHi:  array<f32>;
@group(0) @binding(7) var<storage, read_write> solLo:  array<f32>;

struct Params {
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,  // exclusive
  rangeStart: u32,  // first remaining row this block updates
  rowCount:   u32,  // number of remaining rows (0 for the last block)
  presolved:  u32,  // 1 = block already solved into sol: update only
}

@group(0) @binding(8) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const TILE_ROWS: u32 = 64u;  // remaining rows per workgroup
const SPLIT: u32 = 4u;       // threads per row
const SPAN: u32 = BLOCK_SIZE / SPLIT; // columns per thread

var<workgroup> xr: array<DD, 64>;    // this block's unsolved x
var<workgroup> xs: array<DD, 64>;    // this block's solution
var<workgroup> part: array<DD, 256>; // partial sums, [quarter][row]

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

// Row r's four quarter sums, every thread (the protected adds need it).
fn sumParts(r: u32, tid: u32) -> DD {
  return ddAddProtected(
    ddAddProtected(part[r], part[BLOCK_SIZE + r], tid),
    ddAddProtected(part[2u * BLOCK_SIZE + r], part[3u * BLOCK_SIZE + r], tid),
    tid,
  );
}

@compute @workgroup_size(256)
fn dtrsv_step_main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockLen = params.blockEnd - params.blockStart;
  let lane = tid % BLOCK_SIZE;
  let laneOK = lane < blockLen;
  let laneIdx = params.blockStart + min(lane, blockLen - 1u);

  if (params.presolved == 1u) {
    // Uniform branch.
    if (tid < BLOCK_SIZE) {
      xs[tid] = ddMask(DD(solHi[laneIdx], solLo[laneIdx]), laneOK);
    }
    workgroupBarrier();
  } else {
    if (tid < BLOCK_SIZE) {
      let ix = laneIdx * params.incx;
      xr[tid] = ddMask(DD(xHi[ix], xLo[ix]), laneOK);
    }
    workgroupBarrier();

    // Solve the block: xs = Ainv \xB7 xr. Thread (r, q) sums columns
    // [q\xB716, q\xB716+16) of row r. Ainv is column-major, so at each column the
    // lanes (consecutive r) read consecutive floats. Rows/cols past blockLen
    // are zero in Ainv (never written; buffers start zeroed) and in xr.
    let r = lane;
    let q = tid / BLOCK_SIZE;
    let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE + r;
    var av: array<DD, SPAN>;
    for (var u = 0u; u < SPAN; u++) {
      let ia = ainvBase + (q * SPAN + u) * BLOCK_SIZE;
      av[u] = DD(AinvHi[ia], AinvLo[ia]);
    }
    var acc = DD(0.0, 0.0);
    for (var u = 0u; u < SPAN; u++) {
      acc = ddAddProtected(acc, ddMulProtected(av[u], xr[q * SPAN + u], tid), tid);
    }
    part[q * BLOCK_SIZE + r] = acc;
    workgroupBarrier();
    let v = sumParts(lane, tid);
    if (tid < BLOCK_SIZE) {
      xs[tid] = v;
      if (wid.x == 0u && laneOK) {
        solHi[params.blockStart + tid] = v.hi;
        solLo[params.blockStart + tid] = v.lo;
      }
    }
    workgroupBarrier();
  }

  // Update this workgroup's tile of remaining rows: x[i] -= op(A)[i, block] \xB7 xs.
  // rowCount is dispatch-uniform, so the barriers below stay uniform.
  if (params.rowCount == 0u) { return; }
  let lastRow = params.rowCount - 1u;
  var av: array<DD, SPAN>;
  var q: u32;
  var r: u32;
  if (params.trans != 0u) {
    // A[j,i]: rows fastest across lanes, so at each j consecutive lanes read
    // consecutive i \u2014 coalesced.
    r = tid % TILE_ROWS;
    q = tid / TILE_ROWS;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let col = params.blockStart * params.lda + i;
    for (var u = 0u; u < SPAN; u++) {
      let j = q * SPAN + u;
      let ia = col + min(j, blockLen - 1u) * params.lda;
      av[u] = ddMask(DD(AHi[ia], ALo[ia]), j < blockLen);
    }
  } else {
    // A[i,j]: quarters fastest across lanes, interleaved \u2014 lane q takes
    // columns q, q+4, q+8, \u2026 \u2014 so at each step a row's four lanes read 16
    // contiguous bytes per half.
    r = tid / SPLIT;
    q = tid % SPLIT;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let rowBase = i * params.lda + params.blockStart;
    for (var u = 0u; u < SPAN; u++) {
      let j = q + u * SPLIT;
      let ia = rowBase + min(j, blockLen - 1u);
      av[u] = ddMask(DD(AHi[ia], ALo[ia]), j < blockLen);
    }
  }
  var acc = DD(0.0, 0.0);
  for (var u = 0u; u < SPAN; u++) {
    let j = select(q + u * SPLIT, q * SPAN + u, params.trans != 0u);
    acc = ddAddProtected(acc, ddMulProtected(av[u], xs[j], tid), tid);
  }
  part[q * TILE_ROWS + r] = acc;
  workgroupBarrier();

  let local = wid.x * TILE_ROWS + lane;
  let ix = (params.rangeStart + min(local, lastRow)) * params.incx;
  let updated = ddSubProtected(DD(xHi[ix], xLo[ix]), sumParts(lane, tid), tid);
  if (tid < TILE_ROWS && local < params.rowCount) {
    xHi[ix] = updated.hi;
    xLo[ix] = updated.lo;
  }
}
`;
    });
  var sa,
    ia = ir(() => {
      sa = `// dgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 double-double (Dekker)
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
  uplo:    u32, // 0 = full C; dgemmtr masks: 1 = lower (col <= row), 2 = upper (col >= row)
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
  // dgemmtr: a tile entirely outside the requested triangle writes nothing,
  // so skip it outright \u2014 about half the grid. The test depends only on the
  // workgroup id and a uniform, so the whole workgroup exits together: no
  // thread is left waiting at the protected ops' barriers.
  if (params.uplo == 1u && blockCol > blockRow + BM - 1u) { return; }
  if (params.uplo == 2u && blockCol + BN - 1u < blockRow) { return; }
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
      // dgemmtr: tiles straddling the diagonal write only their triangle.
      // Gates the store only \u2014 the protected ops above still run for every
      // thread, keeping their barrier counts uniform.
      let inTriangle = params.uplo == 0u
        || (params.uplo == 1u && col <= row)
        || (params.uplo == 2u && col >= row);
      let inBounds = row < params.m && col < params.n && inTriangle;
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
  var la,
    na = ir(() => {
      la = `// dgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 double-double (Dekker)
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
  uplo:    u32, // 0 = full C; dgemmtr masks: 1 = lower (col <= row), 2 = upper (col >= row)
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
  // dgemmtr: a tile entirely outside the requested triangle writes nothing,
  // so skip it outright \u2014 about half the grid. The test depends only on the
  // workgroup id and a uniform, so the whole workgroup exits together: no
  // thread is left waiting at the protected ops' barriers.
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
      // dgemmtr: tiles straddling the diagonal write only their triangle.
      // Gates the store only \u2014 the protected ops above still run for every
      // thread, keeping their barrier counts uniform.
      let inTriangle = params.uplo == 0u
        || (params.uplo == 1u && col <= row)
        || (params.uplo == 2u && col >= row);
      let inBounds = row < params.m && col < params.n && inTriangle;
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
  var ae,
    ua = ir(() => {
      ae = `// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
  var ie,
    da = ir(() => {
      ie = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
  var ma,
    fa = ir(() => {
      ma = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var ca,
    pa = ir(() => {
      ca = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
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
  var ga,
    wa = ir(() => {
      ga = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var ha = {};
  Oe(ha, { routineShaders: () => mr, shaderSources: () => Cs });
  var mr,
    Cs,
    ba = ir(() => {
      at();
      st();
      lt();
      dt();
      mt();
      ct();
      gt();
      bt();
      xt();
      vt();
      Bt();
      At();
      Lt();
      Gt();
      Nt();
      Pt();
      It();
      Mt();
      Tt();
      Ht();
      Ct();
      Ft();
      Ot();
      qt();
      Vt();
      zt();
      Xt();
      $t();
      Qt();
      eo();
      oo();
      io();
      so();
      lo();
      fo();
      po();
      co();
      go();
      bo();
      yo();
      vo();
      Bo();
      Ao();
      Eo();
      So();
      Go();
      Do();
      Po();
      Mo();
      To();
      Co();
      Fo();
      Oo();
      qo();
      Uo();
      zo();
      Xo();
      $o();
      Qo();
      ea();
      oa();
      ia();
      na();
      ua();
      da();
      fa();
      pa();
      wa();
      mr = {};
      mr.sscal = { sscal: it };
      mr.cscal = { cscal: nt };
      mr.sswap = { sswap: ut };
      mr.dswap = { dswap: ft };
      mr.saxpy = { saxpy: pt };
      mr.scopy = { scopy: wt };
      mr.dcopy = { dcopy: ht };
      mr.sdot = { sdot: yt, "reduction/sum": Pe };
      mr.sasum = { sasum: _t, "reduction/sum": Pe };
      mr.snrm2 = { snrm2: kt, "reduction/scaledSum": Et };
      mr.isamax = { isamax: St, "reduction/argmax": Dt };
      mr.dasum = {
        "f64/dekker": Cr,
        "f64/utils/abs": Ee,
        "f64/utils/add": zr,
        dasum: Rt,
        "reduction/sumF64": Ie,
      };
      mr.ddot = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        ddot: jt,
        "reduction/sumF64": Ie,
      };
      mr.dscal = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dscal: Wt,
      };
      mr.daxpy = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        daxpy: Kt,
      };
      mr.idamax = {
        "f64/dekker": Cr,
        "f64/utils/abs": Ee,
        "f64/utils/greater": Me,
        "f64/utils/equal": Ut,
        idamax: Zt,
        "reduction/argmaxF64": Yt,
      };
      mr.srot = { srot: Jt };
      mr.drot = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        drot: ro,
      };
      mr.srotm = { srotm: to };
      mr.drotm = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        drotm: ao,
      };
      mr.dnrm2 = {
        "f64/dekker": Cr,
        "f64/utils/abs": Ee,
        "f64/utils/greater": Me,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        "f64/utils/divide": Re,
        "f64/utils/sqrt": no,
        dnrm2: uo,
        "reduction/scaledSumF64": mo,
      };
      mr.sgemv = { sgemv_n: wo, sgemv_t: ho, reduce_partials: Le };
      mr.ssymv = { ssymv: xo, reduce_partials: Le, gather_strided: re };
      mr.strmv = {
        strmv: _o,
        strmv_t: ko,
        reduce_partials: Le,
        gather_strided: re,
      };
      mr.strsv = {
        strsv_invert_block: Te,
        strsv_step: Lo,
        scatter_strided: He,
        strsm_small: Ce,
      };
      mr.sger = { sger: No, gather_strided: re };
      mr.dger = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dger: Io,
        gather_strided: re,
      };
      mr.ssyr = { ssyr: Ro, gather_strided: re };
      mr.dsyr = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dsyr: Ho,
        gather_strided: re,
      };
      mr.ssyr2 = { ssyr2: jo, gather_strided: re };
      mr.dsyr2 = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dsyr2: Wo,
        gather_strided: re,
      };
      mr.dgemv = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dgemv_n: Ko,
        dgemv_t: Vo,
        reduce_partials_f64: Se,
      };
      mr.dsymv = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dsymv: Zo,
        dsymv_tile: Yo,
        reduce_partials_f64: Se,
      };
      mr.dtrmv = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dtrmv: Jo,
        dtrmv_t: ra,
        reduce_partials_f64: Se,
        gather_strided: re,
      };
      mr.dtrsv = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        "f64/utils/divide": Re,
        dtrsv_small: ta,
        dtrsv_step: aa,
        scatter_strided: He,
      };
      mr.dgemm = {
        "f64/dekker": Cr,
        "f64/utils/add": zr,
        "f64/utils/multiply": Zr,
        dgemm_small: sa,
        dgemm_large: la,
      };
      mr.dgemmtr = mr.dgemm;
      mr.sgemm = { sgemm_small: ae, sgemm_large: ie };
      mr.sgemmtr = { sgemm_small: ae, sgemm_large: ie };
      mr.ssyrk = { sgemm_small: ae, sgemm_large: ie };
      mr.ssyr2k = { sgemm_small: ae, sgemm_large: ie };
      mr.ssymm = { sgemm_small: ae, sgemm_large: ie, symmetrize: ma };
      mr.strmm = { sgemm_small: ae, sgemm_large: ie, triangularize: ca };
      mr.strsm = {
        strsv_invert_block: Te,
        strsm_small: Ce,
        block_transfer: ga,
        sgemm_small: ae,
        sgemm_large: ie,
      };
      Cs = Object.assign({}, ...Object.values(mr));
    });
  var rn = {};
  Oe(rn, {
    Complex32: () => Qr,
    Complex32Array: () => Ir,
    Complex64: () => Jr,
    Complex64Array: () => Vr,
    GpuMatrix: () => sr,
    GpuVector: () => j,
    cleanup: () => Je,
    cscal: () => va,
    dasum: () => Na,
    daxpy: () => Ea,
    dcopy: () => Sa,
    ddot: () => Pa,
    dgemm: () => ai,
    dgemmtr: () => ii,
    dgemv: () => Qa,
    dger: () => Za,
    dnrm2: () => Ma,
    drot: () => Ca,
    drotm: () => Fa,
    dscal: () => _a,
    dswap: () => ka,
    dsymv: () => ri,
    dsyr: () => Ya,
    dsyr2: () => Ja,
    dtrmv: () => ei,
    dtrsv: () => oi,
    gpuName: () => Qe,
    idamax: () => Ta,
    init: () => $e,
    isamax: () => Ra,
    randomFloat32Array: () => et,
    randomFloat64Array: () => tt,
    randomTriangularFloat32Array: () => ot,
    sasum: () => Da,
    saxpy: () => Aa,
    scopy: () => La,
    sdot: () => Ga,
    sgemm: () => si,
    sgemmtr: () => ni,
    sgemv: () => Wa,
    sger: () => za,
    snrm2: () => Ia,
    srot: () => Ha,
    srotm: () => ja,
    sscal: () => xa,
    sswap: () => Ba,
    ssymm: () => di,
    ssymv: () => Oa,
    ssyr: () => Xa,
    ssyr2: () => $a,
    ssyr2k: () => ui,
    ssyrk: () => li,
    strmm: () => fi,
    strmv: () => Ka,
    strsm: () => mi,
    strsv: () => Ua,
  });
  function qe(r, o) {
    return o
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function Ve(r) {
    if (!Ue(r)) return { querySet: null, passDescriptor: void 0 };
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
  function Hr(r, o, e) {
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
  async function V(r) {
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
  function y(r, o, e = "blas-input", a = !1) {
    let t = o.byteLength;
    Ge(r, t, e);
    let i = a
        ? GPUBufferUsage.STORAGE |
          GPUBufferUsage.COPY_DST |
          GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      s = r.createBuffer({ label: e, size: t, usage: i });
    return (r.queue.writeBuffer(s, 0, o), s);
  }
  function dr(r, o, e = "blas-storage", a = 0) {
    return (
      Ge(r, o, e),
      r.createBuffer({ label: e, size: o, usage: GPUBufferUsage.STORAGE | a })
    );
  }
  function Mr(r, o, e = "blas-result") {
    return (
      Ge(r, o, e),
      r.createBuffer({
        label: e,
        size: o,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  var yi = 4,
    xi = 4 * 1024 * 1024,
    vi = 32 * 1024 * 1024,
    de = new Map(),
    Ze = new WeakMap();
  function _i(r) {
    let o = de.get(r);
    return (o || ((o = { bySize: new Map(), bytes: 0 }), de.set(r, o)), o);
  }
  function D(r, o, e) {
    let a = e.size,
      t = _i(r),
      i = t.bySize.get(a)?.pop();
    return (
      i
        ? (t.bytes -= a)
        : ((i = r.createBuffer({
            label: "blas-readback",
            size: a,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
          })),
          Ze.set(i, r)),
      o.copyBufferToBuffer(e, 0, i, 0, a),
      i
    );
  }
  function Xe(r) {
    let o = Ze.get(r),
      e = o && de.get(o),
      a = r.size,
      t = e?.bySize.get(a) ?? [];
    if (!e || a > xi || t.length >= yi || e.bytes + a > vi) {
      r.destroy();
      return;
    }
    (t.push(r), e.bySize.set(a, t), (e.bytes += a));
  }
  function De(r) {
    let o = r === void 0 ? [...de.keys()] : [r];
    for (let e of o) {
      let a = de.get(e);
      if (a) {
        for (let t of a.bySize.values()) t.forEach((i) => i.destroy());
        de.delete(e);
      }
    }
  }
  var ue = 16,
    ze = new WeakMap();
  function Bi(r) {
    let o = ze.get(r);
    return (
      o ||
        ((o = r.createBuffer({
          label: "blas-vec4-fallback",
          size: ue,
          usage: GPUBufferUsage.STORAGE,
        })),
        ze.set(r, o)),
      o
    );
  }
  function Ar(r, o) {
    let e = o instanceof GPUBuffer ? o : o.buffer,
      a = o instanceof GPUBuffer ? 0 : (o.offset ?? 0),
      t = o instanceof GPUBuffer ? o.size : (o.size ?? e.size - a),
      i = Math.floor(t / ue) * ue;
    return i < ue
      ? { buffer: Bi(r), offset: 0, size: ue }
      : { buffer: e, offset: a, size: i };
  }
  function Er(r, o, e, a, t = 0) {
    if (o % 4 !== 0 || t % 4 !== 0) return !1;
    let i = r instanceof GPUBuffer ? r : r.buffer,
      s = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      l = r instanceof GPUBuffer ? i.size : (r.size ?? i.size - s),
      n = Math.floor(l / ue) * 4;
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
  var fe = null,
    Ne = !1,
    me = new Map(),
    we = new WeakMap(),
    te = null,
    Ye = ({ powerPreference: r, benchmark: o }) => `${r}::${o}`;
  async function $e({
    powerPreference: r = "high-performance",
    benchmark: o = !1,
    dumpShaders: e = !1,
  } = {}) {
    let a = { powerPreference: r, benchmark: o, dumpShaders: e },
      t = Ye(a),
      i = me.get(t);
    if (i) return i;
    if (fe)
      e !== Ne &&
        typeof window > "u" &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Ne}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u") {
      let { create: m, globals: w } = await import("webgpu");
      (Object.assign(globalThis, w),
        (fe = m(
          e
            ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
            : [],
        )),
        (Ne = e));
    } else
      (e &&
        console.warn(
          "dumpShaders has no effect in the browser \u2014 see init()'s docs.",
        ),
        (fe = navigator.gpu));
    if (!fe) throw new Error("WebGPU not supported in this environment.");
    let s =
      (await fe.requestAdapter({ powerPreference: r })) ??
      (await fe.requestAdapter());
    if (!s) throw new Error("No WebGPU adapter found.");
    let n = [...(qe(s, o).requiredFeatures ?? [])],
      d = await s.requestDevice({ requiredFeatures: n });
    d.addEventListener("uncapturederror", (m) => {
      console.error("Uncaptured GPU error:", m.error.message);
    });
    let u = n.includes("timestamp-query");
    return (
      we.set(d, { adapter: s, benchmark: u, options: a }),
      me.set(t, d),
      te || (te = d),
      d
    );
  }
  function Je(r) {
    if (r === void 0) {
      De();
      for (let e of me.values()) e.destroy();
      (me.clear(), (te = null));
      return;
    }
    let o = we.get(r);
    o &&
      (me.delete(Ye(o.options)),
      we.delete(r),
      De(r),
      r.destroy(),
      te === r && (te = me.values().next().value ?? null));
  }
  function Qe(r = te) {
    let o = r && we.get(r);
    if (!o)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: a } = o.adapter.info;
    return { description: a || "unknown", device: e || "unknown" };
  }
  function Ue(r = te) {
    return we.get(r)?.benchmark ?? !1;
  }
  function pe() {
    if (!te)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return te;
  }
  async function L(r, o = Float32Array) {
    let e = !1;
    try {
      await r.mapAsync(GPUMapMode.READ);
      let a = new o(r.getMappedRange().slice());
      return (r.unmap(), (e = !0), a);
    } finally {
      e ? Xe(r) : r.destroy();
    }
  }
  function X(r) {
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
  var Jr = class {
      constructor(o, e) {
        ((this.re = o), (this.im = e));
      }
    },
    Vr = class extends Array {
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
            this.push(new Jr(e[a], e[a + 1]));
          }
        }
      }
    };
  function ce(r, o = r.length) {
    let e = new Float32Array(o * 2);
    for (let a = 0; a < o; a++)
      ((e[a * 2] = r[a].re), (e[a * 2 + 1] = r[a].im));
    return e;
  }
  function ke(r, o = r.length) {
    let e = new Float64Array(o),
      a = new Float64Array(o);
    for (let u = 0; u < o; u++) ((e[u] = r[u].re), (a[u] = r[u].im));
    let { hi: t, lo: i } = X(e),
      { hi: s, lo: l } = X(a),
      n = new Float32Array(o * 2),
      d = new Float32Array(o * 2);
    for (let u = 0; u < o; u++)
      ((n[u * 2] = t[u]),
        (n[u * 2 + 1] = s[u]),
        (d[u * 2] = i[u]),
        (d[u * 2 + 1] = l[u]));
    return { hi: n, lo: d };
  }
  function Ae(r, o) {
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
      d = new Vr(e);
    for (let u = 0; u < e; u++) d[u] = new Jr(l[u], n[u]);
    return d;
  }
  var Qr = class {
      constructor(o, e) {
        ((this.re = Math.fround(o)), (this.im = Math.fround(e)));
      }
    },
    Ir = class extends Array {
      constructor(o) {
        if (o === void 0) {
          super();
          return;
        }
        if (typeof o == "number") {
          super(o);
          for (let a = 0; a < o; a++) this[a] = new Qr(0, 0);
          return;
        }
        let e = Array.from(o);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof Qr) {
            for (let a of e) {
              if (!(a instanceof Qr))
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
            this.push(new Qr(e[a], e[a + 1]));
          }
        }
      }
    };
  var j = class r {
    constructor(o, e, a = Float32Array, t = null, i = null) {
      ((this._buf = o),
        (this._loBuf = t),
        (this.length = e),
        (this.dtype = a),
        (this.device = i ?? pe()));
    }
    static from(o, e) {
      let a = o instanceof GPUDevice,
        t = a ? o : pe(),
        i = a ? e : o;
      if (i instanceof Float64Array) {
        let { hi: l, lo: n } = X(i),
          d = y(t, l, "gpu-vector-f64-hi", !0),
          u = y(t, n, "gpu-vector-f64-lo", !0);
        return new r(d, i.length, Float64Array, u, t);
      }
      if (i instanceof Ir) {
        let l = y(t, ce(i), "gpu-vector-complex32", !0);
        return new r(l, i.length, Ir, null, t);
      }
      if (i instanceof Vr) {
        let { hi: l, lo: n } = ke(i),
          d = y(t, l, "gpu-vector-complex64-hi", !0),
          u = y(t, n, "gpu-vector-complex64-lo", !0);
        return new r(d, i.length, Vr, u, t);
      }
      if (!(i instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let s = y(t, i, "gpu-vector", !0);
      return new r(s, i.length, i.constructor, null, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = D(o, e, this._buf);
      if ((o.queue.submit([e.finish()]), this.dtype === Ir))
        return new Ir(await L(a, Float32Array));
      if (!this._loBuf) return L(a, this.dtype);
      let t = o.createCommandEncoder(),
        i = D(o, t, this._loBuf);
      o.queue.submit([t.finish()]);
      let [s, l] = await Promise.all([L(a, Float32Array), L(i, Float32Array)]);
      return this.dtype === Vr ? Ae(s, l) : cr(s, l);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var sr = class r {
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
        (this.device = l ?? pe()));
    }
    static from(o, ...e) {
      let a = o instanceof GPUDevice,
        t = a ? o : pe(),
        i = a ? e.shift() : o,
        [s, l, n, d = "row-major"] = e;
      if (d !== "row-major" && d !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let u = d === "row-major";
      if (
        (n === void 0 && (n = u ? l : s),
        !(i instanceof Float32Array) &&
          !(i instanceof Float64Array) &&
          !(i instanceof Ir) &&
          !(i instanceof Vr))
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
        let c = w * n,
          { hi: g, lo: b } = X(i.subarray(0, c)),
          h = y(t, g, "gpu-matrix-f64-hi", !0),
          x = y(t, b, "gpu-matrix-f64-lo", !0);
        return new r(h, s, l, n, x, d, t, Float64Array);
      }
      if (i instanceof Ir) {
        let c = y(t, ce(i, w * n), "gpu-matrix-complex32", !0);
        return new r(c, s, l, n, null, d, t, Ir);
      }
      if (i instanceof Vr) {
        let { hi: c, lo: g } = ke(i, w * n),
          b = y(t, c, "gpu-matrix-complex64-hi", !0),
          h = y(t, g, "gpu-matrix-complex64-lo", !0);
        return new r(b, s, l, n, h, d, t, Vr);
      }
      let p = y(t, i.subarray(0, w * n), "gpu-matrix", !0);
      return new r(p, s, l, n, null, d, t);
    }
    async read() {
      let o = this.device,
        e = o.createCommandEncoder(),
        a = D(o, e, this._buf);
      o.queue.submit([e.finish()]);
      let t = this.layout !== "column-major",
        i = t ? this.rows : this.cols,
        s = t ? this.cols : this.rows;
      if (this.dtype === Ir) {
        let d = new Ir(await L(a, Float32Array));
        if (this.lda === s) return d;
        let u = new Ir(i * s);
        for (let m = 0; m < i; m++)
          for (let w = 0; w < s; w++) u[m * s + w] = d[m * this.lda + w];
        return u;
      }
      if (this._loBuf) {
        let d = o.createCommandEncoder(),
          u = D(o, d, this._loBuf);
        o.queue.submit([d.finish()]);
        let [m, w] = await Promise.all([
          L(a, Float32Array),
          L(u, Float32Array),
        ]);
        if (this.dtype === Vr) {
          let g = Ae(m, w);
          if (this.lda === s) return g;
          let b = new Vr(i * s);
          for (let h = 0; h < i; h++)
            for (let x = 0; x < s; x++) b[h * s + x] = g[h * this.lda + x];
          return b;
        }
        let p = cr(m, w);
        if (this.lda === s) return p;
        let c = new Float64Array(i * s);
        for (let g = 0; g < i; g++)
          c.set(p.subarray(g * this.lda, g * this.lda + s), g * s);
        return c;
      }
      let l = await L(a, Float32Array);
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
  function rt(r) {
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
  function et(r, o = -1, e = 1, a) {
    let t = new Float32Array(r),
      i = a === void 0 ? Math.random : rt(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function tt(r, o = -1, e = 1, a) {
    let t = new Float64Array(r),
      i = a === void 0 ? Math.random : rt(a);
    for (let s = 0; s < r; s++) t[s] = o + i() * (e - o);
    return t;
  }
  function ot(
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
  function G(r, o, e, a = 0) {
    let t = e.map((i, s) => ({
      binding: a + s,
      resource: i instanceof GPUBuffer ? { buffer: i } : i,
    }));
    return r.createBindGroup({ layout: o, entries: t });
  }
  function U(r, o) {
    r.queue.submit([o.finish()]);
  }
  function Ur(r) {
    let { querySet: o, passDescriptor: e } = Ve(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: o,
      passDescriptor: e,
    };
  }
  function Xr(r, o, e, a, t) {
    let i = r.beginComputePass(t);
    (i.setPipeline(o),
      i.setBindGroup(0, e),
      typeof a == "number"
        ? i.dispatchWorkgroups(a)
        : i.dispatchWorkgroups(a.x, a.y, a.z ?? 1),
      i.end());
  }
  function br(r, o) {
    if (o.length === 1) {
      let [i] = o;
      return xr(r, i.pipeline, i.bindGroup, i.workgroups);
    }
    let { commandEncoder: e, querySet: a } = Ur(r);
    o.forEach((i, s) => {
      let l;
      (a && s === 0
        ? (l = {
            timestampWrites: { querySet: a, beginningOfPassWriteIndex: 0 },
          })
        : a &&
          s === o.length - 1 &&
          (l = { timestampWrites: { querySet: a, endOfPassWriteIndex: 1 } }),
        Xr(e, i.pipeline, i.bindGroup, i.workgroups, l));
    });
    let t = Hr(r, e, a);
    return { commandEncoder: e, ts: t };
  }
  function xr(r, o, e, a) {
    let { commandEncoder: t, querySet: i, passDescriptor: s } = Ur(r);
    Xr(t, o, e, a, s);
    let l = Hr(r, t, i);
    return { commandEncoder: t, ts: l };
  }
  var Ws = {},
    je = new WeakMap();
  async function P(r, o, e = "main") {
    je.has(r) || je.set(r, new Map());
    let a = je.get(r),
      t = Array.isArray(o) ? o : [o],
      i = `${t.join("+")}::${e}`;
    if (!a.has(i)) {
      let s = Fs(r, t, e).catch((l) => {
        throw (a.delete(i), l);
      });
      a.set(i, s);
    }
    return a.get(i);
  }
  async function js(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: o } = await Promise.resolve().then(() => (ba(), ha)),
        e = o[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: o } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: a, join: t } = await import("path"),
        i = a(e(Ws.url));
      return o(t(i, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function Fs(r, o, e = "main") {
    let a = o.join("+"),
      t = await Promise.all(o.map(js)),
      i = 0,
      s = t.map((c, g) => {
        let b = c.split(`
`).length,
          h = { name: o[g], startLine: i + 1, endLine: i + b };
        return ((i += b), h);
      }),
      l = (c) => {
        let g = c && s.find((b) => c >= b.startLine && c <= b.endLine);
        return g ? `${g.name}.wgsl:${c - g.startLine + 1}` : `line ${c}`;
      },
      n = t.join(`
`),
      d = r.createShaderModule({ label: a, code: n }),
      m = (await d.getCompilationInfo()).messages.filter(
        (c) => c.type === "error",
      );
    if (m.length > 0)
      throw new Error(`Shader "${a}" compilation failed:
${m.map((c) => `  ${l(c.lineNum)}: ${c.message}`).join(`
`)}`);
    let w = e === "main" ? { module: d } : { module: d, entryPoint: e },
      p = r.createComputePipeline({ label: a, layout: "auto", compute: w });
    return ((p._shaderModule = d), p);
  }
  function Sr(r, o, e) {
    let a = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(o / 64), a)
      : { x: Math.min(Math.ceil(e / 8), a), y: Math.min(Math.ceil(o / 8), a) };
  }
  function tr(r, o, e, a = "x") {
    let t = r.limits.maxComputeWorkgroupsPerDimension;
    if (o > t)
      throw new Error(
        `${e}: this problem needs ${o} workgroups in ${a}, but the device allows ${t} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return o;
  }
  function ya(r, o, e, a) {
    return a === void 0
      ? tr(r, Math.ceil(e / 64), o)
      : {
          x: tr(r, Math.ceil(a / 8), o, "x"),
          y: tr(r, Math.ceil(e / 8), o, "y"),
        };
  }
  function z(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function Z(r, o, e) {
    for (let [a, t] of Object.entries(e))
      if (!(!(t instanceof j) && !(t instanceof sr)) && t.device !== r)
        throw new Error(
          `${o}: ${a} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function xa(r, o, e, a, t) {
    let i = a instanceof j;
    if (
      (z(r),
      Z(r, "sscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Float32Array) && !(a instanceof j))
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
      ((l = i ? a._buf : y(r, a, "sscal-x", !0)),
        (n = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
          ],
          "sscal-params",
        )));
      let u = G(r, s.getBindGroupLayout(0), [l, n]),
        { commandEncoder: m, ts: w } = xr(r, s, u, Sr(r, o));
      ((d = i ? null : D(r, m, l)), U(r, m));
      let p = await V(w);
      if (i) return p !== void 0 ? { gpuTimeMs: p } : {};
      let c = await L(d, Float32Array);
      return ((d = null), p !== void 0 ? { x: c, gpuTimeMs: p } : { x: c });
    } finally {
      (!i && l && f(l), n && f(n), d && f(d));
    }
  }
  async function va(r, o, e, a, t) {
    let i = a instanceof j;
    if (
      (z(r),
      Z(r, "cscal", { x: a }),
      !Number.isInteger(o) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof Qr)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(a instanceof Ir) && !i)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (i && a.dtype !== Ir)
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
      ((l = i ? a._buf : y(r, ce(a), "cscal-x", !0)),
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
      let u = G(r, s.getBindGroupLayout(0), [l, n]),
        { commandEncoder: m, ts: w } = xr(r, s, u, Sr(r, o));
      ((d = i ? null : D(r, m, l)), U(r, m));
      let p = await V(w);
      if (i) return p !== void 0 ? { gpuTimeMs: p } : {};
      let c = await L(d, Float32Array);
      d = null;
      let g = new Ir(c);
      return p !== void 0 ? { x: g, gpuTimeMs: p } : { x: g };
    } finally {
      (!i && l && f(l), n && f(n), d && f(d));
    }
  }
  async function _a(r, o, e, a, t) {
    let i = a instanceof j;
    if ((z(r), !Number.isInteger(o) || !Number.isInteger(t)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(a instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (i && a.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) throw new Error("incx must be positive.");
    if ((Z(r, "dscal", { x: a }), o <= 0)) return i ? {} : { x: a };
    if (a.length < (o - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let l = await P(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: d } = X(new Float64Array([e])),
      u = null,
      m = null,
      w = null,
      p = null,
      c = null;
    try {
      if (i) ((u = a._buf), (m = a._loBuf));
      else {
        let { hi: k, lo: E } = X(a);
        ((u = y(r, k, "dscal-xHi", !0)), (m = y(r, E, "dscal-xLo", !0)));
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
      let g = G(r, l.getBindGroupLayout(0), [u, m, w]),
        { commandEncoder: b, ts: h } = xr(r, l, g, Sr(r, o));
      ((p = i ? null : D(r, b, u)), (c = i ? null : D(r, b, m)), U(r, b));
      let x = await V(h);
      if (i) return x !== void 0 ? { gpuTimeMs: x } : {};
      let _ = await L(p, Float32Array);
      p = null;
      let v = await L(c, Float32Array);
      c = null;
      let B = cr(_, v);
      return x !== void 0 ? { x: B, gpuTimeMs: x } : { x: B };
    } finally {
      (!i && u && f(u), !i && m && f(m), w && f(w), p && f(p), c && f(c));
    }
  }
  async function Ba(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "sswap", { x: e, y: t }),
      !Number.isInteger(o) || !Number.isInteger(a) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (a <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof j))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(t instanceof Float32Array) && !(t instanceof j))
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
      p = null;
    try {
      ((d = s ? e._buf : y(r, e, "sswap-x", !0)),
        (u = l ? t._buf : y(r, t, "sswap-y", !0)),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sswap-params",
        )));
      let c = G(r, n.getBindGroupLayout(0), [d, u, m]),
        { commandEncoder: g, ts: b } = xr(r, n, c, Sr(r, o));
      ((w = s ? null : D(r, g, d)), (p = l ? null : D(r, g, u)), U(r, g));
      let h = await V(b);
      if (s) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await L(w, Float32Array);
      w = null;
      let _ = await L(p, Float32Array);
      return (
        (p = null),
        h !== void 0 ? { x, y: _, gpuTimeMs: h } : { x, y: _ }
      );
    } finally {
      (!s && d && f(d), !l && u && f(u), m && f(m), w && f(w), p && f(p));
    }
  }
  async function ka(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "dswap", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null,
      b = null,
      h = null;
    try {
      if (s) ((d = e._buf), (u = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let N = X(e),
          M = X(t);
        ((d = y(r, N.hi, "dswap-xHi", !0)),
          (u = y(r, N.lo, "dswap-xLo", !0)),
          (m = y(r, M.hi, "dswap-yHi", !0)),
          (w = y(r, M.lo, "dswap-yLo", !0)));
      }
      p = T(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dswap-params",
      );
      let x = G(r, n.getBindGroupLayout(0), [d, u, m, w, p]),
        { commandEncoder: _, ts: v } = xr(r, n, x, Sr(r, o));
      ((c = s ? null : D(r, _, d)),
        (g = s ? null : D(r, _, u)),
        (b = l ? null : D(r, _, m)),
        (h = l ? null : D(r, _, w)),
        U(r, _));
      let B = await V(v);
      if (s) return B !== void 0 ? { gpuTimeMs: B } : {};
      let k = await L(c, Float32Array);
      c = null;
      let E = await L(g, Float32Array);
      g = null;
      let I = await L(b, Float32Array);
      b = null;
      let R = await L(h, Float32Array);
      h = null;
      let A = cr(k, E),
        S = cr(I, R);
      return B !== void 0 ? { x: A, y: S, gpuTimeMs: B } : { x: A, y: S };
    } finally {
      (!s && d && f(d),
        !s && u && f(u),
        !l && m && f(m),
        !l && w && f(w),
        p && f(p),
        c && f(c),
        g && f(g),
        b && f(b),
        h && f(h));
    }
  }
  async function Aa(r, o, e, a, t, i, s) {
    let l = a instanceof j,
      n = i instanceof j;
    if (
      (z(r),
      Z(r, "saxpy", { x: a, y: i }),
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
      p = null;
    try {
      ((u = l ? a._buf : y(r, a, "saxpy-x", !1)),
        (m = n ? i._buf : y(r, i, "saxpy-y", !0)),
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
      let c = G(r, d.getBindGroupLayout(0), [u, m, w]),
        { commandEncoder: g, ts: b } = xr(r, d, c, Sr(r, o));
      ((p = n ? null : D(r, g, m)), U(r, g));
      let h = await V(b);
      if (n) return h !== void 0 ? { gpuTimeMs: h } : {};
      let x = await L(p, Float32Array);
      return ((p = null), h !== void 0 ? { y: x, gpuTimeMs: h } : { y: x });
    } finally {
      (!l && u && f(u), !n && m && f(m), w && f(w), p && f(p));
    }
  }
  async function Ea(r, o, e, a, t, i, s) {
    let l = a instanceof j,
      n = i instanceof j;
    if (
      (z(r),
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
    if ((Z(r, "daxpy", { x: a, y: i }), o <= 0)) return n ? {} : { y: i };
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
      { hi: m, lo: w } = X(new Float64Array([e])),
      p = null,
      c = null,
      g = null,
      b = null,
      h = null,
      x = null,
      _ = null;
    try {
      if (l) ((p = a._buf), (c = a._loBuf), (g = i._buf), (b = i._loBuf));
      else {
        let S = X(a),
          N = X(i);
        ((p = y(r, S.hi, "daxpy-xHi", !1)),
          (c = y(r, S.lo, "daxpy-xLo", !1)),
          (g = y(r, N.hi, "daxpy-yHi", !0)),
          (b = y(r, N.lo, "daxpy-yLo", !0)));
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
      let v = G(r, u.getBindGroupLayout(0), [p, c, g, b, h]),
        { commandEncoder: B, ts: k } = xr(r, u, v, Sr(r, o));
      ((x = n ? null : D(r, B, g)), (_ = n ? null : D(r, B, b)), U(r, B));
      let E = await V(k);
      if (n) return E !== void 0 ? { gpuTimeMs: E } : {};
      let I = await L(x, Float32Array);
      x = null;
      let R = await L(_, Float32Array);
      _ = null;
      let A = cr(I, R);
      return E !== void 0 ? { y: A, gpuTimeMs: E } : { y: A };
    } finally {
      (!l && p && f(p),
        !l && c && f(c),
        !n && g && f(g),
        !n && b && f(b),
        h && f(h),
        x && f(x),
        _ && f(_));
    }
  }
  async function La(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "scopy", { x: e, y: t }),
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
      ((d = s ? e._buf : y(r, e, "scopy-x", !1)),
        (u = l ? t._buf : y(r, t, "scopy-y", !0)),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "scopy-params",
        )));
      let p = G(r, n.getBindGroupLayout(0), [d, u, m]),
        { commandEncoder: c, ts: g } = xr(r, n, p, Sr(r, o));
      ((w = l ? null : D(r, c, u)), U(r, c));
      let b = await V(g);
      if (l) return b !== void 0 ? { gpuTimeMs: b } : {};
      let h = await L(w, Float32Array);
      return ((w = null), b !== void 0 ? { y: h, gpuTimeMs: b } : { y: h });
    } finally {
      (!s && d && f(d), !l && u && f(u), m && f(m), w && f(w));
    }
  }
  async function Sa(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "dcopy", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null;
    try {
      if (s) ((d = e._buf), (u = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let E = X(e),
          I = X(t);
        ((d = y(r, E.hi, "dcopy-xHi", !1)),
          (u = y(r, E.lo, "dcopy-xLo", !1)),
          (m = y(r, I.hi, "dcopy-yHi", !0)),
          (w = y(r, I.lo, "dcopy-yLo", !0)));
      }
      p = T(
        r,
        [
          { value: o, type: "u32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "dcopy-params",
      );
      let b = G(r, n.getBindGroupLayout(0), [d, u, m, w, p]),
        { commandEncoder: h, ts: x } = xr(r, n, b, Sr(r, o));
      ((c = l ? null : D(r, h, m)), (g = l ? null : D(r, h, w)), U(r, h));
      let _ = await V(x);
      if (l) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = await L(c, Float32Array);
      c = null;
      let B = await L(g, Float32Array);
      g = null;
      let k = cr(v, B);
      return _ !== void 0 ? { y: k, gpuTimeMs: _ } : { y: k };
    } finally {
      (!s && d && f(d),
        !s && u && f(u),
        !l && m && f(m),
        !l && w && f(w),
        p && f(p),
        c && f(c),
        g && f(g));
    }
  }
  async function Ga(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "sdot", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null;
    try {
      ((u = s ? e._buf : y(r, e, "sdot-x", !1)),
        (m = l ? t._buf : y(r, t, "sdot-y", !1)),
        (w = dr(r, 512, "sdot-partials")),
        (p = Mr(r, 4, "sdot-result")),
        (c = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "sdot-params",
        )));
      let b = G(r, n.getBindGroupLayout(0), [u, m, w, c]),
        h = G(r, d.getBindGroupLayout(0), [w, p]),
        { commandEncoder: x, ts: _ } = br(r, [
          { pipeline: n, bindGroup: b, workgroups: 128 },
          { pipeline: d, bindGroup: h, workgroups: 1 },
        ]);
      ((g = D(r, x, p)), U(r, x));
      let v = L(g, Float32Array);
      g = null;
      let [B, k] = await Promise.all([V(_), v]);
      return B !== void 0 ? { dot: k[0], gpuTimeMs: B } : { dot: k[0] };
    } finally {
      (!s && u && f(u),
        !l && m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        g && f(g));
    }
  }
  async function Da(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "sasum", { x: e }),
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
      ((l = t ? e._buf : y(r, e, "sasum-x", !1)),
        (n = dr(r, 512, "sasum-partials")),
        (d = Mr(r, 4, "sasum-result")),
        (u = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "sasum-params",
        )));
      let w = G(r, i.getBindGroupLayout(0), [l, n, u]),
        p = G(r, s.getBindGroupLayout(0), [n, d]),
        { commandEncoder: c, ts: g } = br(r, [
          { pipeline: i, bindGroup: w, workgroups: 128 },
          { pipeline: s, bindGroup: p, workgroups: 1 },
        ]);
      ((m = D(r, c, d)), U(r, c));
      let b = L(m, Float32Array);
      m = null;
      let [h, x] = await Promise.all([V(g), b]);
      return h !== void 0 ? { asum: x[0], gpuTimeMs: h } : { asum: x[0] };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m));
    }
  }
  async function Na(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "dasum", { x: e }),
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
      p = null,
      c = null,
      g = null,
      b = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: S, lo: N } = X(e.map(Math.abs));
        ((n = y(r, S, "dasum-xHi", !1)), (d = y(r, N, "dasum-xLo", !1)));
      }
      ((u = dr(r, 512, "dasum-partialsHi")),
        (m = dr(r, 512, "dasum-partialsLo")),
        (w = Mr(r, 4, "dasum-result-hi")),
        (p = Mr(r, 4, "dasum-result-lo")),
        (c = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dasum-params",
        )));
      let h = G(r, s.getBindGroupLayout(0), [n, d, u, m, c]),
        x = G(r, l.getBindGroupLayout(0), [u, m, w, p]),
        { commandEncoder: _, ts: v } = br(r, [
          { pipeline: s, bindGroup: h, workgroups: 128 },
          { pipeline: l, bindGroup: x, workgroups: 1 },
        ]);
      ((g = D(r, _, w)), (b = D(r, _, p)), U(r, _));
      let B = L(g, Float32Array),
        k = L(b, Float32Array);
      ((g = null), (b = null));
      let [E, I, R] = await Promise.all([V(v), B, k]),
        A = cr(I, R)[0];
      return E !== void 0 ? { asum: A, gpuTimeMs: E } : { asum: A };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        g && f(g),
        b && f(b));
    }
  }
  async function Pa(r, o, e, a, t, i) {
    let s = e instanceof j,
      l = t instanceof j;
    if (
      (z(r),
      Z(r, "ddot", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null,
      b = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null;
    try {
      if (s) ((m = e._buf), (w = e._loBuf), (p = t._buf), (c = t._loBuf));
      else {
        let K = X(e),
          Y = X(t);
        ((m = y(r, K.hi, "ddot-xHi", !1)),
          (w = y(r, K.lo, "ddot-xLo", !1)),
          (p = y(r, Y.hi, "ddot-yHi", !1)),
          (c = y(r, Y.lo, "ddot-yLo", !1)));
      }
      ((g = dr(r, 512, "ddot-partialsHi")),
        (b = dr(r, 512, "ddot-partialsLo")),
        (h = Mr(r, 4, "ddot-result-hi")),
        (x = Mr(r, 4, "ddot-result-lo")),
        (_ = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "ddot-params",
        )));
      let k = G(r, d.getBindGroupLayout(0), [m, w, p, c, g, b, _]),
        E = G(r, u.getBindGroupLayout(0), [g, b, h, x]),
        { commandEncoder: I, ts: R } = br(r, [
          { pipeline: d, bindGroup: k, workgroups: 128 },
          { pipeline: u, bindGroup: E, workgroups: 1 },
        ]);
      ((v = D(r, I, h)), (B = D(r, I, x)), U(r, I));
      let A = L(v, Float32Array),
        S = L(B, Float32Array);
      ((v = null), (B = null));
      let [N, M, H] = await Promise.all([V(R), A, S]),
        F = cr(M, H)[0];
      return N !== void 0 ? { dot: F, gpuTimeMs: N } : { dot: F };
    } finally {
      (!s && m && f(m),
        !s && w && f(w),
        !l && p && f(p),
        !l && c && f(c),
        g && f(g),
        b && f(b),
        h && f(h),
        x && f(x),
        _ && f(_),
        v && f(v),
        B && f(B));
    }
  }
  async function Ia(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "snrm2", { x: e }),
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
      m = null;
    try {
      ((l = t ? e._buf : y(r, e, "snrm2-x", !1)),
        (n = dr(r, 384 * 4, "snrm2-partials")),
        (d = Mr(r, 4, "snrm2-result")),
        (u = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "snrm2-params",
        )));
      let w = G(r, i.getBindGroupLayout(0), [l, n, u]),
        p = G(r, s.getBindGroupLayout(0), [n, d]),
        { commandEncoder: c, ts: g } = br(r, [
          { pipeline: i, bindGroup: w, workgroups: 128 },
          { pipeline: s, bindGroup: p, workgroups: 1 },
        ]);
      ((m = D(r, c, d)), U(r, c));
      let b = L(m, Float32Array);
      m = null;
      let [h, x] = await Promise.all([V(g), b]),
        _ = x[0];
      return h !== void 0 ? { nrm2: _, gpuTimeMs: h } : { nrm2: _ };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m));
    }
  }
  async function Ma(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "dnrm2", { x: e }),
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
      p = null,
      c = null,
      g = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: A, lo: S } = X(e);
        ((n = y(r, A, "dnrm2-xHi", !1)), (d = y(r, S, "dnrm2-xLo", !1)));
      }
      ((u = dr(r, 896 * 4, "dnrm2-partials")),
        (m = Mr(r, 4, "dnrm2-result-hi")),
        (w = Mr(r, 4, "dnrm2-result-lo")),
        (p = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let b = G(r, s.getBindGroupLayout(0), [n, d, u, p]),
        h = G(r, l.getBindGroupLayout(0), [u, m, w]),
        { commandEncoder: x, ts: _ } = br(r, [
          { pipeline: s, bindGroup: b, workgroups: 128 },
          { pipeline: l, bindGroup: h, workgroups: 1 },
        ]);
      ((c = D(r, x, m)), (g = D(r, x, w)), U(r, x));
      let v = L(c, Float32Array),
        B = L(g, Float32Array);
      ((c = null), (g = null));
      let [k, E, I] = await Promise.all([V(_), v, B]),
        R = cr(E, I)[0];
      return k !== void 0 ? { nrm2: R, gpuTimeMs: k } : { nrm2: R };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        g && f(g));
    }
  }
  async function Ra(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "isamax", { x: e }),
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
      ((l = t ? e._buf : y(r, e, "isamax-x", !1)),
        (n = dr(r, 512, "isamax-partials-val")),
        (d = dr(r, 512, "isamax-partials-idx")),
        (u = Mr(r, 4, "isamax-result")),
        (m = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "isamax-params",
        )));
      let p = G(r, i.getBindGroupLayout(0), [l, n, d, m]),
        c = G(r, s.getBindGroupLayout(0), [n, d, u]),
        { commandEncoder: g, ts: b } = br(r, [
          { pipeline: i, bindGroup: p, workgroups: 128 },
          { pipeline: s, bindGroup: c, workgroups: 1 },
        ]);
      ((w = D(r, g, u)), U(r, g));
      let h = L(w, Uint32Array);
      w = null;
      let [x, _] = await Promise.all([V(b), h]),
        v = _[0];
      return x !== void 0 ? { index: v, gpuTimeMs: x } : { index: v };
    } finally {
      (!t && l && f(l), n && f(n), d && f(d), u && f(u), m && f(m), w && f(w));
    }
  }
  async function Ta(r, o, e, a) {
    let t = e instanceof j;
    if (
      (z(r),
      Z(r, "idamax", { x: e }),
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
      p = null,
      c = null,
      g = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: I, lo: R } = X(e);
        ((n = y(r, I, "idamax-xHi", !1)), (d = y(r, R, "idamax-xLo", !1)));
      }
      ((u = dr(r, 512, "idamax-partials-val-hi")),
        (m = dr(r, 512, "idamax-partials-val-lo")),
        (w = dr(r, 512, "idamax-partials-idx")),
        (p = Mr(r, 4, "idamax-result")),
        (c = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
          ],
          "idamax-params",
        )));
      let b = G(r, s.getBindGroupLayout(0), [n, d, u, m, w, c]),
        h = G(r, l.getBindGroupLayout(0), [u, m, w, p]),
        { commandEncoder: x, ts: _ } = br(r, [
          { pipeline: s, bindGroup: b, workgroups: 128 },
          { pipeline: l, bindGroup: h, workgroups: 1 },
        ]);
      ((g = D(r, x, p)), U(r, x));
      let v = L(g, Uint32Array);
      g = null;
      let [B, k] = await Promise.all([V(_), v]),
        E = k[0];
      return B !== void 0 ? { index: E, gpuTimeMs: B } : { index: E };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        u && f(u),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        g && f(g));
    }
  }
  async function Ha(r, o, e, a, t, i, s, l) {
    let n = e instanceof j,
      d = t instanceof j;
    if (
      (z(r),
      Z(r, "srot", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null;
    try {
      ((m = n ? e._buf : y(r, e, "srot-x", !0)),
        (w = d ? t._buf : y(r, t, "srot-y", !0)),
        (p = T(
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
      let b = G(r, u.getBindGroupLayout(0), [m, w, p]),
        { commandEncoder: h, ts: x } = xr(r, u, b, Sr(r, o));
      ((c = n ? null : D(r, h, m)), (g = d ? null : D(r, h, w)), U(r, h));
      let _ = await V(x);
      if (n) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = L(c, Float32Array),
        B = L(g, Float32Array);
      ((c = null), (g = null));
      let [k, E] = await Promise.all([v, B]);
      return _ !== void 0 ? { x: k, y: E, gpuTimeMs: _ } : { x: k, y: E };
    } finally {
      (!n && m && f(m), !d && w && f(w), p && f(p), c && f(c), g && f(g));
    }
  }
  async function Ca(r, o, e, a, t, i, s, l) {
    let n = e instanceof j,
      d = t instanceof j;
    if (
      (z(r),
      Z(r, "drot", { x: e, y: t }),
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
      { hi: w, lo: p } = X(new Float64Array([s])),
      { hi: c, lo: g } = X(new Float64Array([l])),
      b = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      k = null,
      E = null,
      I = null;
    try {
      if (n) ((b = e._buf), (h = e._loBuf), (x = t._buf), (_ = t._loBuf));
      else {
        let W = X(e),
          q = X(t);
        ((b = y(r, W.hi, "drot-xHi", !0)),
          (h = y(r, W.lo, "drot-xLo", !0)),
          (x = y(r, q.hi, "drot-yHi", !0)),
          (_ = y(r, q.lo, "drot-yLo", !0)));
      }
      v = T(
        r,
        [
          { value: o, type: "u32" },
          { value: w[0], type: "f32" },
          { value: p[0], type: "f32" },
          { value: c[0], type: "f32" },
          { value: g[0], type: "f32" },
          { value: a, type: "u32" },
          { value: i, type: "u32" },
        ],
        "drot-params",
      );
      let R = G(r, m.getBindGroupLayout(0), [b, h, x, _, v]),
        { commandEncoder: A, ts: S } = xr(r, m, R, Sr(r, o));
      ((B = n ? null : D(r, A, b)),
        (k = n ? null : D(r, A, h)),
        (E = d ? null : D(r, A, x)),
        (I = d ? null : D(r, A, _)),
        U(r, A));
      let N = await V(S);
      if (n) return N !== void 0 ? { gpuTimeMs: N } : {};
      let M = await L(B, Float32Array);
      B = null;
      let H = await L(k, Float32Array);
      k = null;
      let F = await L(E, Float32Array);
      E = null;
      let K = await L(I, Float32Array);
      I = null;
      let Y = cr(M, H),
        O = cr(F, K);
      return N !== void 0 ? { x: Y, y: O, gpuTimeMs: N } : { x: Y, y: O };
    } finally {
      (!n && b && f(b),
        !n && h && f(h),
        !d && x && f(x),
        !d && _ && f(_),
        v && f(v),
        B && f(B),
        k && f(k),
        E && f(E),
        I && f(I));
    }
  }
  async function ja(r, o, e, a, t, i, s) {
    let l = e instanceof j,
      n = t instanceof j;
    if (
      (z(r),
      Z(r, "srotm", { x: e, y: t }),
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
      p = null,
      c = null,
      g = null;
    try {
      ((u = l ? e._buf : y(r, e, "srotm-x", !0)),
        (m = n ? t._buf : y(r, t, "srotm-y", !0)),
        (w = y(r, s, "srotm-param", !1)),
        (p = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "srotm-params",
        )));
      let b = G(r, d.getBindGroupLayout(0), [u, m, w, p]),
        { commandEncoder: h, ts: x } = xr(r, d, b, Sr(r, o));
      ((c = l ? null : D(r, h, u)), (g = n ? null : D(r, h, m)), U(r, h));
      let _ = await V(x);
      if (l) return _ !== void 0 ? { gpuTimeMs: _ } : {};
      let v = L(c, Float32Array),
        B = L(g, Float32Array);
      ((c = null), (g = null));
      let [k, E] = await Promise.all([v, B]);
      return _ !== void 0 ? { x: k, y: E, gpuTimeMs: _ } : { x: k, y: E };
    } finally {
      (!l && u && f(u),
        !n && m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        g && f(g));
    }
  }
  async function Fa(r, o, e, a, t, i, s) {
    let l = e instanceof j,
      n = t instanceof j;
    if (
      (z(r),
      Z(r, "drotm", { x: e, y: t }),
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
      { hi: m, lo: w } = X(s),
      p = null,
      c = null,
      g = null,
      b = null,
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      k = null,
      E = null;
    try {
      if (l) ((p = e._buf), (c = e._loBuf), (g = t._buf), (b = t._loBuf));
      else {
        let O = X(e),
          W = X(t);
        ((p = y(r, O.hi, "drotm-xHi", !0)),
          (c = y(r, O.lo, "drotm-xLo", !0)),
          (g = y(r, W.hi, "drotm-yHi", !0)),
          (b = y(r, W.lo, "drotm-yLo", !0)));
      }
      ((h = y(r, m, "drotm-paramHi", !1)),
        (x = y(r, w, "drotm-paramLo", !1)),
        (_ = T(
          r,
          [
            { value: o, type: "u32" },
            { value: a, type: "u32" },
            { value: i, type: "u32" },
          ],
          "drotm-params",
        )));
      let I = G(r, u.getBindGroupLayout(0), [p, c, g, b, h, x, _]),
        { commandEncoder: R, ts: A } = xr(r, u, I, Sr(r, o));
      ((v = l ? null : D(r, R, p)),
        (B = l ? null : D(r, R, c)),
        (k = n ? null : D(r, R, g)),
        (E = n ? null : D(r, R, b)),
        U(r, R));
      let S = await V(A);
      if (l) return S !== void 0 ? { gpuTimeMs: S } : {};
      let N = await L(v, Float32Array);
      v = null;
      let M = await L(B, Float32Array);
      B = null;
      let H = await L(k, Float32Array);
      k = null;
      let F = await L(E, Float32Array);
      E = null;
      let K = cr(N, M),
        Y = cr(H, F);
      return S !== void 0 ? { x: K, y: Y, gpuTimeMs: S } : { x: K, y: Y };
    } finally {
      (!l && p && f(p),
        !l && c && f(c),
        !n && g && f(g),
        !n && b && f(b),
        h && f(h),
        x && f(x),
        _ && f(_),
        v && f(v),
        B && f(B),
        k && f(k),
        E && f(E));
    }
  }
  async function Wa(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let p = i instanceof sr,
      c = l instanceof j,
      g = u instanceof j;
    if (
      (z(r),
      Z(r, "sgemv", { A: i, x: l, y: u }),
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
    if (!p && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!g && !(u instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== g)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && l._buf === u._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && g && i._buf === u._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: u };
    (p ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let h = o === "no-transpose",
      x = h ? a : e,
      _ = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!p && i.length < (e - 1) * s + a)
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
      k = h ? 1 : Math.ceil(e / 256),
      E = k > 1 ? await P(r, "reduce_partials") : null,
      I = null,
      R = null,
      A = null,
      S = null,
      N = null,
      M = null;
    try {
      ((I = p ? i._buf : y(r, i, "sgemv-A", !1)),
        (R = c ? l._buf : y(r, l, "sgemv-x", !1)),
        (A = g ? u._buf : y(r, u, "sgemv-y", !0)));
      let H;
      h
        ? ((S = T(
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
          (H = [
            {
              pipeline: B,
              bindGroup: G(r, B.getBindGroupLayout(0), [I, R, A, S]),
              workgroups: Math.min(
                e,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ]))
        : (k > 1 &&
            ((N = dr(r, k * a * 4, "sgemv-partials")),
            (M = T(
              r,
              [
                { value: a, type: "u32" },
                { value: k, type: "u32" },
                { value: m, type: "u32" },
                { value: t, type: "f32" },
                { value: d, type: "f32" },
              ],
              "sgemv-reduce-params",
            ))),
          (S = T(
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
              { value: k > 1 ? 0 : 1, type: "u32" },
            ],
            "sgemv-t-params",
          )),
          (H = [
            {
              pipeline: B,
              bindGroup: G(r, B.getBindGroupLayout(0), [I, R, N ?? A, S]),
              workgroups: {
                x: tr(r, Math.ceil(a / 64), "sgemv", "x"),
                y: tr(r, k, "sgemv", "y"),
              },
            },
          ]),
          k > 1 &&
            H.push({
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [N, A, M]),
              workgroups: Math.min(
                Math.ceil(a / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }));
      let { commandEncoder: F, ts: K } = br(r, H),
        Y = g ? null : D(r, F, A);
      U(r, F);
      let O = await V(K);
      if (g) return O !== void 0 ? { gpuTimeMs: O } : {};
      let W = await L(Y, Float32Array);
      return O !== void 0 ? { y: W, gpuTimeMs: O } : { y: W };
    } finally {
      (!p && I && f(I),
        !c && R && f(R),
        !g && A && f(A),
        S && f(S),
        N && f(N),
        M && f(M));
    }
  }
  async function Gr(r, o, e, a, t) {
    let i = await P(r, "gather_strided"),
      s = dr(r, e * 4, t),
      l = T(
        r,
        [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
        ],
        `${t}-params`,
      ),
      n = G(r, i.getBindGroupLayout(0), [o, s, l]),
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
  function oe(r, o) {
    return r > 1 && (o >= 2048 || (o >= 1024 && r >= 8));
  }
  async function Oa(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof j,
      p = d instanceof j,
      c = t instanceof sr;
    if (
      (z(r),
      Z(r, "ssymv", { A: t, x: s, y: d }),
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
    if (!c && !(t instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && s._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && i !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { y: d };
    if (!c && t.length < (e - 1) * i + e)
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
    let b =
        (c ? t.layout : m) === "column-major" ? o === "upper" : o === "lower",
      h = await P(r, "ssymv"),
      x = await P(r, "reduce_partials"),
      _ = Math.ceil(e / 32),
      v = null,
      B = null,
      k = null,
      E = null,
      I = null,
      R = null,
      A = null;
    try {
      ((v = c ? t._buf : y(r, t, "ssymv-A", !1)),
        (B = w ? s._buf : y(r, s, "ssymv-x", !1)),
        (k = p ? d._buf : y(r, d, "ssymv-y", !0)),
        l > 1 && (A = await Gr(r, B, e, l, "ssymv-x-packed")),
        (I = dr(r, _ * e * 4, "ssymv-partials")),
        (E = T(
          r,
          [
            { value: e, type: "u32" },
            { value: i, type: "u32" },
            { value: b ? 0 : 1, type: "u32" },
            { value: _, type: "u32" },
          ],
          "ssymv-params",
        )),
        (R = T(
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
      let S = (_ * (_ + 1)) / 2,
        N = r.limits.maxComputeWorkgroupsPerDimension,
        M = Math.min(S, N),
        H = tr(r, Math.ceil(S / M), "ssymv", "y"),
        F = [
          ...(A ? [A.pass] : []),
          {
            pipeline: h,
            bindGroup: G(r, h.getBindGroupLayout(0), [
              v,
              A ? A.buffer : B,
              I,
              E,
            ]),
            workgroups: { x: M, y: H },
          },
          {
            pipeline: x,
            bindGroup: G(r, x.getBindGroupLayout(0), [I, k, R]),
            workgroups: Math.min(
              Math.ceil(e / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          },
        ],
        { commandEncoder: K, ts: Y } = br(r, F),
        O = p ? null : D(r, K, k);
      U(r, K);
      let W = await V(Y);
      if (p) return W !== void 0 ? { gpuTimeMs: W } : {};
      let q = await L(O, Float32Array);
      return W !== void 0 ? { y: q, gpuTimeMs: W } : { y: q };
    } finally {
      (!c && v && f(v),
        !w && B && f(B),
        !p && k && f(k),
        E && f(E),
        I && f(I),
        R && f(R),
        A && f(A.buffer, A.params));
    }
  }
  async function Ka(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = l instanceof j,
      p = d instanceof j,
      c = i instanceof sr,
      g = a === "unit";
    if (
      (z(r),
      Z(r, "strmv", { A: i, x: l, y: d }),
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
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(l instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && l._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && p && i._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return p ? {} : { y: d };
    if (!c && i.length < (t - 1) * s + t)
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
    let h = (c ? i.layout : m) === "column-major",
      x = h ? o === "upper" : o === "lower",
      v = !(h ? e === "transpose" : e === "no-transpose"),
      B = v ? Math.ceil(t / 256) : 1,
      k = await P(r, v ? "strmv_t" : "strmv"),
      E = B > 1 ? await P(r, "reduce_partials") : null,
      I = null,
      R = null,
      A = null,
      S = null,
      N = null,
      M = null,
      H = null;
    try {
      ((I = c ? i._buf : y(r, i, "strmv-A", !1)),
        (R = w ? l._buf : y(r, l, "strmv-x", !1)),
        (A = p ? d._buf : y(r, d, "strmv-y", !0)),
        n > 1 && (H = await Gr(r, R, t, n, "strmv-x-packed")));
      let F = H ? H.buffer : R,
        K = H ? 1 : n,
        Y;
      (v
        ? (B > 1 &&
            ((N = dr(r, B * t * 4, "strmv-partials")),
            (M = T(
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
          (S = T(
            r,
            [
              { value: t, type: "u32" },
              { value: K, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
              { value: 256, type: "u32" },
              { value: B > 1 ? 0 : 1, type: "u32" },
            ],
            "strmv-t-params",
          )),
          (Y = [
            {
              pipeline: k,
              bindGroup: G(r, k.getBindGroupLayout(0), [I, F, N ?? A, S]),
              workgroups: {
                x: tr(r, Math.ceil(t / 64), "strmv", "x"),
                y: tr(r, B, "strmv", "y"),
              },
            },
          ]),
          B > 1 &&
            Y.push({
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [N, A, M]),
              workgroups: Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }))
        : ((S = T(
            r,
            [
              { value: t, type: "u32" },
              { value: K, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: 0, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
            ],
            "strmv-params",
          )),
          (Y = [
            {
              pipeline: k,
              bindGroup: G(r, k.getBindGroupLayout(0), [I, F, A, S]),
              workgroups: Math.min(
                t,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ])),
        H && Y.unshift(H.pass));
      let { commandEncoder: O, ts: W } = br(r, Y),
        q = p ? null : D(r, O, A);
      U(r, O);
      let C = await V(W);
      if (p) return C !== void 0 ? { gpuTimeMs: C } : {};
      let J = await L(q, Float32Array);
      return C !== void 0 ? { y: J, gpuTimeMs: C } : { y: J };
    } finally {
      (!c && I && f(I),
        !w && R && f(R),
        !p && A && f(A),
        S && f(S),
        N && f(N),
        M && f(M),
        H && f(H.buffer, H.params));
    }
  }
  function Ks(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        l = i * o;
      s.forEach((n, d) => t.setUint32(l + d * 4, n, !0));
    }
    return a;
  }
  var qa = 48,
    qs = 2;
  function Va(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function Ua(r, o, e, a, t, i, s, l, n, d = "row-major") {
    let u = l instanceof j,
      m = i instanceof sr,
      w = a === "unit";
    if ((z(r), Z(r, "strsv", { A: i, x: l }), o !== "lower" && o !== "upper"))
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
    let c = (m ? i.layout : d) === "column-major",
      g = c ? o === "upper" : o === "lower",
      b = c ? e === "transpose" : e === "no-transpose",
      h = await P(r, "strsv_invert_block"),
      x = await P(r, "strsv_step"),
      _ = await P(r, "scatter_strided"),
      v = b === g,
      B = [];
    for (let O = 0; O < t; O += 64) B.push(O);
    v || B.reverse();
    let k = B.length,
      E = r.limits.minUniformBufferOffsetAlignment,
      I = k <= qs,
      R = (O) =>
        Ks(k, E, (W) => {
          let q = W * 64,
            C = Math.min(q + 64, t),
            J = v ? C : 0,
            nr = v ? t - C : q;
          return [n, s, b ? 0 : 1, W, q, C, J, nr, O];
        }),
      A = null,
      S = null,
      N = null,
      M = null,
      H = null,
      F = null,
      K = null,
      Y = [];
    try {
      ((A = m ? i._buf : y(r, i, "strsv-A", !1)),
        (S = u ? l._buf : y(r, l, "strsv-x", !0)));
      let { commandEncoder: O, querySet: W, passDescriptor: q } = Ur(r),
        C = O.beginComputePass(q);
      if (I) {
        let Q = await P(r, "strsm_small");
        ((M = dr(r, t * 4, "strsv-sol")),
          k > 1 && (H = Va(r, R(1), "strsv-step-params")));
        let $ = b ? s : 1,
          or = b ? 1 : s;
        for (let rr of B) {
          let ar = rr / 64,
            wr = Math.min(rr + 64, t),
            yr = wr - rr,
            ur = v ? t - wr : rr,
            gr = T(
              r,
              [
                { value: yr, type: "u32" },
                { value: 1, type: "u32" },
                { value: rr * ($ + or), type: "u32" },
                { value: $, type: "u32" },
                { value: or, type: "u32" },
                { value: rr * n, type: "u32" },
                { value: n, type: "u32" },
                { value: 0, type: "u32" },
                { value: v ? 0 : 1, type: "u32" },
                { value: w ? 1 : 0, type: "u32" },
                { value: 1, type: "f32" },
                { value: ur > 0 ? 1 : 0, type: "u32" },
              ],
              "strsv-solve-params",
            );
          (Y.push(gr),
            C.setPipeline(Q),
            C.setBindGroup(
              0,
              G(r, Q.getBindGroupLayout(0), [
                A,
                S,
                gr,
                { buffer: M, offset: rr * 4, size: yr * 4 },
              ]),
            ),
            C.dispatchWorkgroups(1),
            ur !== 0 &&
              (C.setPipeline(x),
              C.setBindGroup(
                0,
                G(r, x.getBindGroupLayout(0), [
                  A,
                  A,
                  S,
                  M,
                  { buffer: H, offset: ar * E, size: qa },
                ]),
              ),
              C.dispatchWorkgroups(tr(r, Math.ceil(ur / 64), "strsv"))));
        }
      } else {
        ((N = dr(r, k * 64 * 64 * 4, "strsv-Ainv")),
          (M = dr(r, t * 4, "strsv-sol")),
          (H = Va(r, R(0), "strsv-step-params")),
          (F = T(
            r,
            [
              { value: t, type: "u32" },
              { value: s, type: "u32" },
              { value: b ? 0 : 1, type: "u32" },
              { value: g ? 0 : 1, type: "u32" },
              { value: w ? 1 : 0, type: "u32" },
            ],
            "strsv-invert-params",
          )),
          (K = T(
            r,
            [
              { value: t, type: "u32" },
              { value: n, type: "u32" },
            ],
            "strsv-scatter-params",
          )),
          C.setPipeline(h),
          C.setBindGroup(0, G(r, h.getBindGroupLayout(0), [A, N, F])),
          C.dispatchWorkgroups(k),
          C.setPipeline(x));
        for (let Q of B) {
          let $ = Q / 64,
            or = Math.min(Q + 64, t),
            rr = v ? t - or : Q;
          (C.setBindGroup(
            0,
            G(r, x.getBindGroupLayout(0), [
              A,
              N,
              S,
              M,
              { buffer: H, offset: $ * E, size: qa },
            ]),
          ),
            C.dispatchWorkgroups(
              tr(r, Math.max(1, Math.ceil(rr / 64)), "strsv"),
            ));
        }
        (C.setPipeline(_),
          C.setBindGroup(0, G(r, _.getBindGroupLayout(0), [M, S, K])),
          C.dispatchWorkgroups(
            Math.min(
              Math.ceil(t / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          ));
      }
      C.end();
      let J = Hr(r, O, W),
        nr = u ? null : D(r, O, S);
      U(r, O);
      let lr = await V(J);
      if (u) return lr !== void 0 ? { gpuTimeMs: lr } : {};
      let er = await L(nr, Float32Array);
      return lr !== void 0 ? { x: er, gpuTimeMs: lr } : { x: er };
    } finally {
      (!m && A && f(A),
        !u && S && f(S),
        N && f(N),
        M && f(M),
        H && f(H),
        F && f(F),
        K && f(K),
        f(Y));
    }
  }
  async function za(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = n instanceof sr;
    if (
      (z(r),
      Z(r, "sger", { A: n, x: t, y: s }),
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
    let p = t instanceof j,
      c = s instanceof j;
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (p !== c)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (p && !m)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (m && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (m && p && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && c && n._buf === s._buf)
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
      b = null,
      h = null,
      x = null,
      _ = null,
      v = null;
    try {
      ((b = p ? t._buf : y(r, t, "sger-x", !1)),
        (h = c ? s._buf : y(r, s, "sger-y", !1)),
        (x = m ? n._buf : y(r, n, "sger-A", !0)),
        l > 1 && (v = await Gr(r, h, e, l, "sger-y-packed")),
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
      let B = G(r, g.getBindGroupLayout(0), [b, v ? v.buffer : h, x, _]),
        k = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: E, ts: I } = br(r, [
          ...(v ? [v.pass] : []),
          { pipeline: g, bindGroup: B, workgroups: k },
        ]),
        R = m ? null : D(r, E, x);
      U(r, E);
      let A = await V(I);
      if (m) return A !== void 0 ? { gpuTimeMs: A } : {};
      let S = await L(R, Float32Array);
      return A !== void 0 ? { A: S, gpuTimeMs: A } : { A: S };
    } finally {
      (!p && b && f(b),
        !c && h && f(h),
        !m && x && f(x),
        _ && f(_),
        v && f(v.buffer, v.params));
    }
  }
  async function Za(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = n instanceof sr;
    if (
      (z(r),
      Z(r, "dger", { A: n, x: t, y: s }),
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
    let p = t instanceof j,
      c = s instanceof j;
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!c && !(s instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (p && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (c && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (p !== c)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (p && !m)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (m && !p)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (m && p && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && c && n._buf === s._buf)
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
    let b = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dger"],
        "dger_main",
      ),
      { hi: h, lo: x } = X(new Float64Array([a])),
      _ = null,
      v = null,
      B = null,
      k = null,
      E = null,
      I = null,
      R = null,
      A = null,
      S = null,
      N = null,
      M = null;
    try {
      if (p)
        ((_ = t._buf),
          (v = t._loBuf),
          (B = s._buf),
          (k = s._loBuf),
          (E = n._buf),
          (I = n._loBuf));
      else {
        let J = X(t),
          nr = X(s),
          lr = X(n);
        ((_ = y(r, J.hi, "dger-xHi", !1)),
          (v = y(r, J.lo, "dger-xLo", !1)),
          (B = y(r, nr.hi, "dger-yHi", !1)),
          (k = y(r, nr.lo, "dger-yLo", !1)),
          (E = y(r, lr.hi, "dger-AHi", !0)),
          (I = y(r, lr.lo, "dger-ALo", !0)));
      }
      (oe(l, o) &&
        ((A = await Gr(r, B, e, l, "dger-yHi-packed")),
        (S = await Gr(r, k, e, l, "dger-yLo-packed"))),
        (R = T(
          r,
          [
            { value: o, type: "u32" },
            { value: e, type: "u32" },
            { value: h[0], type: "f32" },
            { value: x[0], type: "f32" },
            { value: i, type: "u32" },
            { value: A ? 1 : l, type: "u32" },
            { value: d, type: "u32" },
          ],
          "dger-params",
        )));
      let H = G(r, b.getBindGroupLayout(0), [
          _,
          v,
          A ? A.buffer : B,
          S ? S.buffer : k,
          E,
          I,
          R,
        ]),
        F = Math.min(o, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: K, ts: Y } = br(r, [
          ...(A ? [A.pass, S.pass] : []),
          { pipeline: b, bindGroup: H, workgroups: F },
        ]);
      ((N = m ? null : D(r, K, E)), (M = m ? null : D(r, K, I)), U(r, K));
      let O = await V(Y);
      if (m) return O !== void 0 ? { gpuTimeMs: O } : {};
      let W = await L(N, Float32Array);
      N = null;
      let q = await L(M, Float32Array);
      M = null;
      let C = cr(W, q);
      return O !== void 0 ? { A: C, gpuTimeMs: O } : { A: C };
    } finally {
      (A && f(A.buffer, A.params),
        S && f(S.buffer, S.params),
        !p && _ && f(_),
        !p && v && f(v),
        !c && B && f(B),
        !c && k && f(k),
        !m && E && f(E),
        !m && I && f(I),
        R && f(R),
        N && f(N),
        M && f(M));
    }
  }
  async function Xa(r, o, e, a, t, i, s, l, n = "row-major") {
    let d = t instanceof j,
      u = s instanceof sr;
    if ((z(r), Z(r, "ssyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
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
      p = await P(r, "ssyr"),
      c = null,
      g = null,
      b = null,
      h = null;
    try {
      ((c = d ? t._buf : y(r, t, "ssyr-x", !1)),
        (g = u ? s._buf : y(r, s, "ssyr-A", !0)),
        i > 1 && (h = await Gr(r, c, e, i, "ssyr-x-packed")),
        (b = T(
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
      let x = G(r, p.getBindGroupLayout(0), [h ? h.buffer : c, g, b]),
        _ = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: B } = br(r, [
          ...(h ? [h.pass] : []),
          { pipeline: p, bindGroup: x, workgroups: _ },
        ]),
        k = u ? null : D(r, v, g);
      U(r, v);
      let E = await V(B);
      if (u) return E !== void 0 ? { gpuTimeMs: E } : {};
      let I = await L(k, Float32Array);
      return E !== void 0 ? { A: I, gpuTimeMs: E } : { A: I };
    } finally {
      (!d && c && f(c), !u && g && f(g), b && f(b), h && f(h.buffer, h.params));
    }
  }
  async function Ya(r, o, e, a, t, i, s, l, n = "row-major") {
    let d = t instanceof j,
      u = s instanceof sr;
    if ((z(r), Z(r, "dsyr", { A: s, x: t }), o !== "lower" && o !== "upper"))
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
      c = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr"],
        "dsyr_main",
      ),
      { hi: g, lo: b } = X(new Float64Array([a])),
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      k = null,
      E = null,
      I = null,
      R = null;
    try {
      if (d) ((h = t._buf), (x = t._loBuf), (_ = s._buf), (v = s._loBuf));
      else {
        let O = X(t),
          W = X(s);
        ((h = y(r, O.hi, "dsyr-xHi", !1)),
          (x = y(r, O.lo, "dsyr-xLo", !1)),
          (_ = y(r, W.hi, "dsyr-AHi", !0)),
          (v = y(r, W.lo, "dsyr-ALo", !0)));
      }
      (oe(i, e) &&
        ((k = await Gr(r, h, e, i, "dsyr-xHi-packed")),
        (E = await Gr(r, x, e, i, "dsyr-xLo-packed"))),
        (B = T(
          r,
          [
            { value: e, type: "u32" },
            { value: g[0], type: "f32" },
            { value: b[0], type: "f32" },
            { value: k ? 1 : i, type: "u32" },
            { value: l, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "dsyr-params",
        )));
      let A = G(r, c.getBindGroupLayout(0), [
          k ? k.buffer : h,
          E ? E.buffer : x,
          _,
          v,
          B,
        ]),
        S = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: N, ts: M } = br(r, [
          ...[k, E].filter(Boolean).map((O) => O.pass),
          { pipeline: c, bindGroup: A, workgroups: S },
        ]);
      ((I = u ? null : D(r, N, _)), (R = u ? null : D(r, N, v)), U(r, N));
      let H = await V(M);
      if (u) return H !== void 0 ? { gpuTimeMs: H } : {};
      let F = await L(I, Float32Array);
      I = null;
      let K = await L(R, Float32Array);
      R = null;
      let Y = cr(F, K);
      return H !== void 0 ? { A: Y, gpuTimeMs: H } : { A: Y };
    } finally {
      for (let A of [k, E]) A && f(A.buffer, A.params);
      (!d && h && f(h),
        !d && x && f(x),
        !u && _ && f(_),
        !u && v && f(v),
        B && f(B),
        I && f(I),
        R && f(R));
    }
  }
  async function $a(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = t instanceof j,
      w = s instanceof j,
      p = n instanceof sr;
    if (
      (z(r),
      Z(r, "ssyr2", { A: n, x: t, y: s }),
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
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!m && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (m !== w)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (m && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !m)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && m && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (p && w && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === s._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { A: n };
    if (!p && n.length < (e - 1) * d + e)
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
        (p ? n.layout : u) === "column-major" ? o === "upper" : o === "lower",
      b = await P(r, "ssyr2"),
      h = null,
      x = null,
      _ = null,
      v = null,
      B = null,
      k = null;
    try {
      ((h = m ? t._buf : y(r, t, "ssyr2-x", !1)),
        (x = w ? s._buf : y(r, s, "ssyr2-y", !1)),
        (_ = p ? n._buf : y(r, n, "ssyr2-A", !0)),
        i > 1 && (B = await Gr(r, h, e, i, "ssyr2-x-packed")),
        l > 1 && (k = await Gr(r, x, e, l, "ssyr2-y-packed")),
        (v = T(
          r,
          [
            { value: e, type: "u32" },
            { value: a, type: "f32" },
            { value: B ? 1 : i, type: "u32" },
            { value: k ? 1 : l, type: "u32" },
            { value: d, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let E = G(r, b.getBindGroupLayout(0), [
          B ? B.buffer : h,
          k ? k.buffer : x,
          _,
          v,
        ]),
        I = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: R, ts: A } = br(r, [
          ...(B ? [B.pass] : []),
          ...(k ? [k.pass] : []),
          { pipeline: b, bindGroup: E, workgroups: I },
        ]),
        S = p ? null : D(r, R, _);
      U(r, R);
      let N = await V(A);
      if (p) return N !== void 0 ? { gpuTimeMs: N } : {};
      let M = await L(S, Float32Array);
      return N !== void 0 ? { A: M, gpuTimeMs: N } : { A: M };
    } finally {
      (!m && h && f(h),
        !w && x && f(x),
        !p && _ && f(_),
        v && f(v),
        B && f(B.buffer, B.params),
        k && f(k.buffer, k.params));
    }
  }
  async function Ja(r, o, e, a, t, i, s, l, n, d, u = "row-major") {
    let m = t instanceof j,
      w = s instanceof j,
      p = n instanceof sr;
    if (
      (z(r),
      Z(r, "dsyr2", { A: n, x: t, y: s }),
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
    if (!p && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && n.dtype !== Float64Array)
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
    if (m && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !m)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (p && m && n._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (p && w && n._buf === s._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === s._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (n.rows < e || n.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { A: n };
    if (!p && n.length < (e - 1) * d + e)
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
        (p ? n.layout : u) === "column-major" ? o === "upper" : o === "lower",
      h = await P(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr2"],
        "dsyr2_main",
      ),
      { hi: x, lo: _ } = X(new Float64Array([a])),
      v = null,
      B = null,
      k = null,
      E = null,
      I = null,
      R = null,
      A = null,
      S = null,
      N = null,
      M = null,
      H = null,
      F = null,
      K = null;
    try {
      if (m)
        ((v = t._buf),
          (B = t._loBuf),
          (k = s._buf),
          (E = s._loBuf),
          (I = n._buf),
          (R = n._loBuf));
      else {
        let er = X(t),
          Q = X(s),
          $ = X(n);
        ((v = y(r, er.hi, "dsyr2-xHi", !1)),
          (B = y(r, er.lo, "dsyr2-xLo", !1)),
          (k = y(r, Q.hi, "dsyr2-yHi", !1)),
          (E = y(r, Q.lo, "dsyr2-yLo", !1)),
          (I = y(r, $.hi, "dsyr2-AHi", !0)),
          (R = y(r, $.lo, "dsyr2-ALo", !0)));
      }
      (oe(i, e) &&
        ((S = await Gr(r, v, e, i, "dsyr2-xHi-packed")),
        (N = await Gr(r, B, e, i, "dsyr2-xLo-packed"))),
        oe(l, e) &&
          ((M = await Gr(r, k, e, l, "dsyr2-yHi-packed")),
          (H = await Gr(r, E, e, l, "dsyr2-yLo-packed"))),
        (A = T(
          r,
          [
            { value: e, type: "u32" },
            { value: x[0], type: "f32" },
            { value: _[0], type: "f32" },
            { value: S ? 1 : i, type: "u32" },
            { value: M ? 1 : l, type: "u32" },
            { value: d, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "dsyr2-params",
        )));
      let Y = G(r, h.getBindGroupLayout(0), [
          S ? S.buffer : v,
          N ? N.buffer : B,
          M ? M.buffer : k,
          H ? H.buffer : E,
          I,
          R,
          A,
        ]),
        O = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: W, ts: q } = br(r, [
          ...[S, N, M, H].filter(Boolean).map((er) => er.pass),
          { pipeline: h, bindGroup: Y, workgroups: O },
        ]);
      ((F = p ? null : D(r, W, I)), (K = p ? null : D(r, W, R)), U(r, W));
      let C = await V(q);
      if (p) return C !== void 0 ? { gpuTimeMs: C } : {};
      let J = await L(F, Float32Array);
      F = null;
      let nr = await L(K, Float32Array);
      K = null;
      let lr = cr(J, nr);
      return C !== void 0 ? { A: lr, gpuTimeMs: C } : { A: lr };
    } finally {
      for (let Y of [S, N, M, H]) Y && f(Y.buffer, Y.params);
      (!m && v && f(v),
        !m && B && f(B),
        !w && k && f(k),
        !w && E && f(E),
        !p && I && f(I),
        !p && R && f(R),
        A && f(A),
        F && f(F),
        K && f(K));
    }
  }
  async function Qa(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let p = i instanceof sr,
      c = l instanceof j,
      g = u instanceof j;
    if (
      (z(r),
      Z(r, "dgemv", { A: i, x: l, y: u }),
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
    if (!p && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!c && !(l instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!g && !(u instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (c && l.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (g && u.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (c !== g)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (c && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && l._buf === u._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && g && i._buf === u._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (i.rows < e || i.cols < a))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || a < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || a === 0) return g ? {} : { y: u };
    (p ? i.layout : w) === "column-major" &&
      (([e, a] = [a, e]),
      (o = o === "no-transpose" ? "transpose" : "no-transpose"));
    let h = o === "no-transpose",
      x = h ? a : e,
      _ = h ? e : a;
    if (s < a) throw new Error("lda must be >= n.");
    if (!p && i.length < (e - 1) * s + a)
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
      k = h ? "dgemv_n_main" : "dgemv_t_main",
      E = await P(r, [...v, B], k),
      I = h ? 1 : Math.ceil(e / 64),
      R =
        I > 1
          ? await P(r, [...v, "reduce_partials_f64"], "reduce_partials_f64")
          : null,
      { hi: A, lo: S } = X(new Float64Array([t])),
      { hi: N, lo: M } = X(new Float64Array([d])),
      H = null,
      F = null,
      K = null,
      Y = null,
      O = null,
      W = null,
      q = null,
      C = null,
      J = null,
      nr = null,
      lr = null,
      er = null;
    try {
      if (p) ((H = i._buf), (F = i._loBuf));
      else {
        let gr = X(i);
        ((H = y(r, gr.hi, "dgemv-AHi", !1)),
          (F = y(r, gr.lo, "dgemv-ALo", !1)));
      }
      if (c) ((K = l._buf), (Y = l._loBuf));
      else {
        let gr = X(l);
        ((K = y(r, gr.hi, "dgemv-xHi", !1)),
          (Y = y(r, gr.lo, "dgemv-xLo", !1)));
      }
      if (g) ((O = u._buf), (W = u._loBuf));
      else {
        let gr = X(u);
        ((O = y(r, gr.hi, "dgemv-yHi", !0)),
          (W = y(r, gr.lo, "dgemv-yLo", !0)));
      }
      let Q = [
          { value: e, type: "u32" },
          { value: a, type: "u32" },
          { value: A[0], type: "f32" },
          { value: S[0], type: "f32" },
          { value: N[0], type: "f32" },
          { value: M[0], type: "f32" },
          { value: n, type: "u32" },
          { value: m, type: "u32" },
          { value: s, type: "u32" },
        ],
        $;
      h
        ? ((q = T(r, Q, "dgemv-params")),
          ($ = [
            {
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [H, F, K, Y, O, W, q]),
              workgroups: Math.min(
                e,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ]))
        : (I > 1 &&
            ((C = dr(r, I * a * 4, "dgemv-partialsHi")),
            (J = dr(r, I * a * 4, "dgemv-partialsLo")),
            (nr = T(
              r,
              [
                { value: a, type: "u32" },
                { value: I, type: "u32" },
                { value: m, type: "u32" },
                { value: A[0], type: "f32" },
                { value: S[0], type: "f32" },
                { value: N[0], type: "f32" },
                { value: M[0], type: "f32" },
              ],
              "dgemv-reduce-params",
            ))),
          (q = T(
            r,
            [
              ...Q,
              { value: 64, type: "u32" },
              { value: I > 1 ? 0 : 1, type: "u32" },
            ],
            "dgemv-t-params",
          )),
          ($ = [
            {
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [
                H,
                F,
                K,
                Y,
                C ?? O,
                J ?? W,
                q,
              ]),
              workgroups: {
                x: tr(r, Math.ceil(a / 64), "dgemv", "x"),
                y: tr(r, I, "dgemv", "y"),
              },
            },
          ]),
          I > 1 &&
            $.push({
              pipeline: R,
              bindGroup: G(r, R.getBindGroupLayout(0), [C, J, O, W, nr]),
              workgroups: Math.min(
                Math.ceil(a / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }));
      let { commandEncoder: or, ts: rr } = br(r, $);
      ((lr = g ? null : D(r, or, O)), (er = g ? null : D(r, or, W)), U(r, or));
      let ar = await V(rr);
      if (g) return ar !== void 0 ? { gpuTimeMs: ar } : {};
      let wr = await L(lr, Float32Array);
      lr = null;
      let yr = await L(er, Float32Array);
      er = null;
      let ur = cr(wr, yr);
      return ar !== void 0 ? { y: ur, gpuTimeMs: ar } : { y: ur };
    } finally {
      (!p && H && f(H),
        !p && F && f(F),
        !c && K && f(K),
        !c && Y && f(Y),
        !g && O && f(O),
        !g && W && f(W),
        q && f(q),
        C && f(C),
        J && f(J),
        nr && f(nr),
        lr && f(lr),
        er && f(er));
    }
  }
  var Vs = 256;
  async function ri(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof j,
      p = d instanceof j,
      c = t instanceof sr;
    if (
      (z(r),
      Z(r, "dsymv", { A: t, x: s, y: d }),
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
    if (!c && !(t instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && t.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(s instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && s.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (p && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (w && s._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && p && t._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && i !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { y: d };
    if (!c && t.length < (e - 1) * i + e)
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
    let b =
        (c ? t.layout : m) === "column-major" ? o === "upper" : o === "lower",
      h = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      x = e >= Vs,
      _ = x
        ? await P(r, [...h, "dsymv_tile"], "dsymv_tile_main")
        : await P(r, [...h, "dsymv"], "dsymv_main"),
      v = x
        ? await P(r, [...h, "reduce_partials_f64"], "reduce_partials_f64")
        : null,
      B = Math.ceil(e / 32),
      { hi: k, lo: E } = X(new Float64Array([a])),
      { hi: I, lo: R } = X(new Float64Array([n])),
      A = null,
      S = null,
      N = null,
      M = null,
      H = null,
      F = null,
      K = null,
      Y = null,
      O = null,
      W = null,
      q = null,
      C = null;
    try {
      if (c) ((A = t._buf), (S = t._loBuf));
      else {
        let rr = X(t);
        ((A = y(r, rr.hi, "dsymv-AHi", !1)),
          (S = y(r, rr.lo, "dsymv-ALo", !1)));
      }
      if (w) ((N = s._buf), (M = s._loBuf));
      else {
        let rr = X(s);
        ((N = y(r, rr.hi, "dsymv-xHi", !1)),
          (M = y(r, rr.lo, "dsymv-xLo", !1)));
      }
      if (p) ((H = d._buf), (F = d._loBuf));
      else {
        let rr = X(d);
        ((H = y(r, rr.hi, "dsymv-yHi", !0)),
          (F = y(r, rr.lo, "dsymv-yLo", !0)));
      }
      let J;
      if (!x)
        ((K = T(
          r,
          [
            { value: e, type: "u32" },
            { value: k[0], type: "f32" },
            { value: E[0], type: "f32" },
            { value: I[0], type: "f32" },
            { value: R[0], type: "f32" },
            { value: l, type: "u32" },
            { value: u, type: "u32" },
            { value: i, type: "u32" },
            { value: b ? 0 : 1, type: "u32" },
          ],
          "dsymv-params",
        )),
          (J = [
            {
              pipeline: _,
              bindGroup: G(r, _.getBindGroupLayout(0), [A, S, N, M, H, F, K]),
              workgroups: e,
            },
          ]));
      else {
        ((Y = dr(r, B * e * 4, "dsymv-partialsHi")),
          (O = dr(r, B * e * 4, "dsymv-partialsLo")),
          (K = T(
            r,
            [
              { value: e, type: "u32" },
              { value: i, type: "u32" },
              { value: b ? 0 : 1, type: "u32" },
              { value: B, type: "u32" },
              { value: l, type: "u32" },
            ],
            "dsymv-tile-params",
          )),
          (W = T(
            r,
            [
              { value: e, type: "u32" },
              { value: B, type: "u32" },
              { value: u, type: "u32" },
              { value: k[0], type: "f32" },
              { value: E[0], type: "f32" },
              { value: I[0], type: "f32" },
              { value: R[0], type: "f32" },
            ],
            "dsymv-reduce-params",
          )));
        let rr = (B * (B + 1)) / 2,
          ar = r.limits.maxComputeWorkgroupsPerDimension,
          wr = Math.min(rr, ar),
          yr = tr(r, Math.ceil(rr / wr), "dsymv", "y");
        J = [
          {
            pipeline: _,
            bindGroup: G(r, _.getBindGroupLayout(0), [A, S, N, M, Y, O, K]),
            workgroups: { x: wr, y: yr },
          },
          {
            pipeline: v,
            bindGroup: G(r, v.getBindGroupLayout(0), [Y, O, H, F, W]),
            workgroups: Math.min(Math.ceil(e / 64), ar),
          },
        ];
      }
      let { commandEncoder: nr, ts: lr } = br(r, J);
      ((q = p ? null : D(r, nr, H)), (C = p ? null : D(r, nr, F)), U(r, nr));
      let er = await V(lr);
      if (p) return er !== void 0 ? { gpuTimeMs: er } : {};
      let Q = await L(q, Float32Array);
      q = null;
      let $ = await L(C, Float32Array);
      C = null;
      let or = cr(Q, $);
      return er !== void 0 ? { y: or, gpuTimeMs: er } : { y: or };
    } finally {
      (!c && A && f(A),
        !c && S && f(S),
        !w && N && f(N),
        !w && M && f(M),
        !p && H && f(H),
        !p && F && f(F),
        K && f(K),
        Y && f(Y),
        O && f(O),
        W && f(W),
        q && f(q),
        C && f(C));
    }
  }
  var Us = 512;
  async function ei(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = l instanceof j,
      p = d instanceof j,
      c = i instanceof sr,
      g = a === "unit";
    if (
      (z(r),
      Z(r, "dtrmv", { A: i, x: l, y: d }),
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
    if (!c && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(l instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && l.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (p && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && l._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && p && i._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (i.rows < t || i.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return p ? {} : { y: d };
    if (!c && i.length < (t - 1) * s + t)
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
    let h = (c ? i.layout : m) === "column-major",
      x = h ? o === "upper" : o === "lower",
      _ = h ? e === "transpose" : e === "no-transpose",
      v = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      B = !_ && t >= Us,
      k = B ? Math.ceil(t / 64) : 1,
      E = await P(
        r,
        [...v, B ? "dtrmv_t" : "dtrmv"],
        B ? "dtrmv_t_main" : "dtrmv_main",
      ),
      I =
        k > 1
          ? await P(r, [...v, "reduce_partials_f64"], "reduce_partials_f64")
          : null,
      R = null,
      A = null,
      S = null,
      N = null,
      M = null,
      H = null,
      F = null,
      K = null,
      Y = null,
      O = null,
      W = null,
      q = null,
      C = null,
      J = null;
    try {
      if (c) ((R = i._buf), (A = i._loBuf));
      else {
        let ur = X(i);
        ((R = y(r, ur.hi, "dtrmv-AHi", !1)),
          (A = y(r, ur.lo, "dtrmv-ALo", !1)));
      }
      if (w) ((S = l._buf), (N = l._loBuf));
      else {
        let ur = X(l);
        ((S = y(r, ur.hi, "dtrmv-xHi", !1)),
          (N = y(r, ur.lo, "dtrmv-xLo", !1)));
      }
      if (p) ((M = d._buf), (H = d._loBuf));
      else {
        let ur = X(d);
        ((M = y(r, ur.hi, "dtrmv-yHi", !0)),
          (H = y(r, ur.lo, "dtrmv-yLo", !0)));
      }
      oe(n, t) &&
        ((W = await Gr(r, S, t, n, "dtrmv-xHi-packed")),
        (q = await Gr(r, N, t, n, "dtrmv-xLo-packed")));
      let nr = W ? W.buffer : S,
        lr = q ? q.buffer : N,
        er = W ? 1 : n,
        Q;
      (B
        ? (k > 1 &&
            ((K = dr(r, k * t * 4, "dtrmv-partialsHi")),
            (Y = dr(r, k * t * 4, "dtrmv-partialsLo")),
            (O = T(
              r,
              [
                { value: t, type: "u32" },
                { value: k, type: "u32" },
                { value: u, type: "u32" },
                { value: 1, type: "f32" },
                { value: 0, type: "f32" },
                { value: 0, type: "f32" },
                { value: 0, type: "f32" },
              ],
              "dtrmv-reduce-params",
            ))),
          (F = T(
            r,
            [
              { value: t, type: "u32" },
              { value: er, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
              { value: 64, type: "u32" },
              { value: k > 1 ? 0 : 1, type: "u32" },
            ],
            "dtrmv-t-params",
          )),
          (Q = [
            {
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [
                R,
                A,
                nr,
                lr,
                K ?? M,
                Y ?? H,
                F,
              ]),
              workgroups: {
                x: tr(r, Math.ceil(t / 64), "dtrmv", "x"),
                y: tr(r, k, "dtrmv", "y"),
              },
            },
          ]),
          k > 1 &&
            Q.push({
              pipeline: I,
              bindGroup: G(r, I.getBindGroupLayout(0), [K, Y, M, H, O]),
              workgroups: Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }))
        : ((F = T(
            r,
            [
              { value: t, type: "u32" },
              { value: er, type: "u32" },
              { value: u, type: "u32" },
              { value: s, type: "u32" },
              { value: _ ? 0 : 1, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
            ],
            "dtrmv-params",
          )),
          (Q = [
            {
              pipeline: E,
              bindGroup: G(r, E.getBindGroupLayout(0), [R, A, nr, lr, M, H, F]),
              workgroups: Math.min(
                t,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ])),
        W && Q.unshift(W.pass, q.pass));
      let { commandEncoder: $, ts: or } = br(r, Q);
      ((C = p ? null : D(r, $, M)), (J = p ? null : D(r, $, H)), U(r, $));
      let rr = await V(or);
      if (p) return rr !== void 0 ? { gpuTimeMs: rr } : {};
      let ar = await L(C, Float32Array);
      C = null;
      let wr = await L(J, Float32Array);
      J = null;
      let yr = cr(ar, wr);
      return rr !== void 0 ? { y: yr, gpuTimeMs: rr } : { y: yr };
    } finally {
      (!c && R && f(R),
        !c && A && f(A),
        !w && S && f(S),
        !w && N && f(N),
        !p && M && f(M),
        !p && H && f(H),
        F && f(F),
        K && f(K),
        Y && f(Y),
        O && f(O));
      for (let nr of [W, q]) nr && f(nr.buffer, nr.params);
      (C && f(C), J && f(J));
    }
  }
  function zs(r, o, e) {
    let a = new ArrayBuffer(r * o),
      t = new DataView(a);
    for (let i = 0; i < r; i++) {
      let s = e(i),
        l = i * o;
      s.forEach((n, d) => t.setUint32(l + d * 4, n, !0));
    }
    return a;
  }
  var Zs = 48,
    Xs = 2;
  function ti(r, o, e) {
    let a = r.createBuffer({
      label: e,
      size: o.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(a, 0, o), a);
  }
  async function oi(r, o, e, a, t, i, s, l, n, d = "row-major") {
    let u = l instanceof j,
      m = i instanceof sr,
      w = a === "unit";
    if ((z(r), Z(r, "dtrsv", { A: i, x: l }), o !== "lower" && o !== "upper"))
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
    let c = (m ? i.layout : d) === "column-major",
      g = c ? o === "upper" : o === "lower",
      b = c ? e === "transpose" : e === "no-transpose",
      h = [
        "f64/dekker",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
      ],
      x = await P(r, [...h, "dtrsv_small"], "dtrsv_small_main"),
      _ = await P(r, [...h, "dtrsv_step"], "dtrsv_step_main"),
      v = b === g,
      B = [];
    for (let $ = 0; $ < t; $ += 64) B.push($);
    v || B.reverse();
    let k = B.length,
      E = r.limits.minUniformBufferOffsetAlignment,
      I = k <= Xs,
      R = I ? null : await P(r, "scatter_strided"),
      A = b ? s : 1,
      S = b ? 1 : s,
      N = ($) =>
        zs(k, E, (or) => {
          let rr = or * 64,
            ar = Math.min(rr + 64, t),
            wr = v ? ar : 0,
            yr = v ? t - ar : rr;
          return [n, s, b ? 0 : 1, or, rr, ar, wr, yr, $];
        }),
      M = null,
      H = null,
      F = null,
      K = null,
      Y = null,
      O = null,
      W = null,
      q = null,
      C = null,
      J = null,
      nr = null,
      lr = [],
      er = null,
      Q = null;
    try {
      if (m) ((M = i._buf), (H = i._loBuf));
      else {
        let vr = X(i);
        ((M = y(r, vr.hi, "dtrsv-AHi", !1)),
          (H = y(r, vr.lo, "dtrsv-ALo", !1)));
      }
      if (u) ((F = l._buf), (K = l._loBuf));
      else {
        let vr = X(l);
        ((F = y(r, vr.hi, "dtrsv-xHi", !0)),
          (K = y(r, vr.lo, "dtrsv-xLo", !0)));
      }
      ((W = dr(r, t * 4, "dtrsv-solHi")), (q = dr(r, t * 4, "dtrsv-solLo")));
      let { commandEncoder: $, querySet: or, passDescriptor: rr } = Ur(r),
        ar = $.beginComputePass(rr),
        wr = (vr, Nr, Dr) =>
          G(r, _.getBindGroupLayout(0), [
            M,
            H,
            vr,
            Nr,
            F,
            K,
            W,
            q,
            { buffer: C, offset: Dr * E, size: Zs },
          ]);
      if (I) {
        k > 1 && (C = ti(r, N(1), "dtrsv-step-params"));
        for (let vr of B) {
          let Nr = vr / 64,
            Dr = Math.min(vr + 64, t),
            hr = Dr - vr,
            pr = v ? t - Dr : vr,
            kr = T(
              r,
              [
                { value: hr, type: "u32" },
                { value: vr * (A + S), type: "u32" },
                { value: A, type: "u32" },
                { value: S, type: "u32" },
                { value: vr * n, type: "u32" },
                { value: n, type: "u32" },
                { value: v ? 0 : 1, type: "u32" },
                { value: w ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
                { value: pr > 0 ? 1 : 0, type: "u32" },
              ],
              "dtrsv-solve-params",
            );
          lr.push(kr);
          let Br = (Pr) => ({ buffer: Pr, offset: vr * 4, size: hr * 4 });
          (ar.setPipeline(x),
            ar.setBindGroup(
              0,
              G(r, x.getBindGroupLayout(0), [M, H, F, K, Br(W), Br(q), kr]),
            ),
            ar.dispatchWorkgroups(1),
            pr !== 0 &&
              (ar.setPipeline(_),
              ar.setBindGroup(0, wr(M, H, Nr)),
              ar.dispatchWorkgroups(tr(r, Math.ceil(pr / 64), "dtrsv"))));
        }
      } else {
        ((Y = dr(r, k * 64 * 64 * 4, "dtrsv-AinvHi")),
          (O = dr(r, k * 64 * 64 * 4, "dtrsv-AinvLo")),
          (C = ti(r, N(0), "dtrsv-step-params")),
          (J = T(
            r,
            [
              { value: t, type: "u32" },
              { value: 0, type: "u32" },
              { value: A, type: "u32" },
              { value: S, type: "u32" },
              { value: 0, type: "u32" },
              { value: 1, type: "u32" },
              { value: v ? 0 : 1, type: "u32" },
              { value: w ? 1 : 0, type: "u32" },
              { value: 1, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "dtrsv-invert-params",
          )),
          (nr = T(
            r,
            [
              { value: t, type: "u32" },
              { value: n, type: "u32" },
            ],
            "dtrsv-scatter-params",
          )),
          ar.setPipeline(x),
          ar.setBindGroup(
            0,
            G(r, x.getBindGroupLayout(0), [M, H, Y, O, W, q, J]),
          ),
          ar.dispatchWorkgroups(64 / 4, tr(r, k, "dtrsv", "y")),
          ar.setPipeline(_));
        for (let vr of B) {
          let Nr = vr / 64,
            Dr = Math.min(vr + 64, t),
            hr = v ? t - Dr : vr;
          (ar.setBindGroup(0, wr(Y, O, Nr)),
            ar.dispatchWorkgroups(
              tr(r, Math.max(1, Math.ceil(hr / 64)), "dtrsv"),
            ));
        }
        ar.setPipeline(R);
        for (let [vr, Nr] of [
          [W, F],
          [q, K],
        ])
          (ar.setBindGroup(0, G(r, R.getBindGroupLayout(0), [vr, Nr, nr])),
            ar.dispatchWorkgroups(
              Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            ));
      }
      ar.end();
      let yr = Hr(r, $, or);
      ((er = u ? null : D(r, $, F)), (Q = u ? null : D(r, $, K)), U(r, $));
      let ur = await V(yr);
      if (u) return ur !== void 0 ? { gpuTimeMs: ur } : {};
      let gr = await L(er, Float32Array);
      er = null;
      let Rr = await L(Q, Float32Array);
      Q = null;
      let Tr = cr(gr, Rr);
      return ur !== void 0 ? { x: Tr, gpuTimeMs: ur } : { x: Tr };
    } finally {
      (!m && M && f(M),
        !m && H && f(H),
        !u && F && f(F),
        !u && K && f(K),
        Y && f(Y),
        O && f(O),
        W && f(W),
        q && f(q),
        C && f(C),
        J && f(J),
        nr && f(nr),
        f(lr),
        er && f(er),
        Q && f(Q));
    }
  }
  async function ai(r, o, e, a, t, i, s, l, n, d, u, m, w, p, c = "row-major") {
    let g = l instanceof sr,
      b = d instanceof sr,
      h = w instanceof sr;
    if (
      (z(r),
      Z(r, "dgemm", { A: l, B: d, C: w }),
      o !== "no-transpose" && o !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
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
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(l instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!b && !(d instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!h && !(w instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (g && l.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (b && d.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (h && w.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((g || b) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || u <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || t === 0) return h ? {} : { C: w };
    let x = g ? l.layout : c,
      _ = b ? d.layout : c,
      v = h ? w.layout : c,
      B = x === "column-major" ? i : a,
      k = x === "column-major" ? a : i,
      E = o === "no-transpose" ? B : k,
      I = o === "no-transpose" ? k : B;
    if (n < I)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== l.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [rr, ar] = o === "no-transpose" ? [a, i] : [i, a];
      if (l.rows < rr || l.cols < ar)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (l.length < (E - 1) * n + I)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let R = _ === "column-major" ? t : i,
      A = _ === "column-major" ? i : t,
      S = e === "no-transpose" ? R : A,
      N = e === "no-transpose" ? A : R;
    if (u < N)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (u !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [rr, ar] = e === "no-transpose" ? [i, t] : [t, i];
      if (d.rows < rr || d.cols < ar)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (S - 1) * u + N)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let M = v === "column-major" ? t : a,
      H = v === "column-major" ? a : t;
    if (p < H)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (p !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < a || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (M - 1) * p + H)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([l, d] = [d, l]),
        ([g, b] = [b, g]),
        ([n, u] = [u, n]),
        ([o, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          o === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, t] = [t, a])));
    let F = Math.ceil(t / 64),
      K = Math.ceil(a / 64),
      Y = F * K >= 36,
      W = await P(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          Y ? "dgemm_large" : "dgemm_small",
        ],
        "main",
      ),
      q = null,
      C = null,
      J = null,
      nr = null,
      lr = null,
      er = null,
      Q = null,
      $ = null,
      or = null;
    try {
      if (g) ((q = l._buf), (C = l._loBuf));
      else {
        let Lr = X(l);
        ((q = y(r, Lr.hi, "dgemm-AHi", !1)),
          (C = y(r, Lr.lo, "dgemm-ALo", !1)));
      }
      if (b) ((J = d._buf), (nr = d._loBuf));
      else {
        let Lr = X(d);
        ((J = y(r, Lr.hi, "dgemm-BHi", !1)),
          (nr = y(r, Lr.lo, "dgemm-BLo", !1)));
      }
      if (h) ((lr = w._buf), (er = w._loBuf));
      else {
        let Lr = X(w);
        ((lr = y(r, Lr.hi, "dgemm-CHi", !0)),
          (er = y(r, Lr.lo, "dgemm-CLo", !0)));
      }
      let rr = o === "no-transpose",
        ar = e === "no-transpose",
        wr = rr && Er(q, n, a, i),
        yr = Er(J, u, ar ? i : t, ar ? t : i),
        { hi: ur, lo: gr } = X(new Float64Array([s])),
        { hi: Rr, lo: Tr } = X(new Float64Array([m]));
      Q = T(
        r,
        [
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: ur[0], type: "f32" },
          { value: gr[0], type: "f32" },
          { value: Rr[0], type: "f32" },
          { value: Tr[0], type: "f32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: p, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: wr ? 1 : 0, type: "u32" },
          { value: yr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "dgemm-params",
      );
      let vr = G(r, W.getBindGroupLayout(0), [
          q,
          Ar(r, q),
          C,
          J,
          Ar(r, J),
          nr,
          lr,
          er,
          Q,
        ]),
        Nr = Y
          ? { x: tr(r, F, "dgemm", "x"), y: tr(r, K, "dgemm", "y") }
          : {
              x: tr(r, Math.ceil(t / 32), "dgemm", "x"),
              y: tr(r, Math.ceil(a / 32), "dgemm", "y"),
            },
        { commandEncoder: Dr, ts: hr } = xr(r, W, vr, Nr);
      (($ = h ? null : D(r, Dr, lr)), (or = h ? null : D(r, Dr, er)), U(r, Dr));
      let pr = await V(hr);
      if (h) return pr !== void 0 ? { gpuTimeMs: pr } : {};
      let kr = await L($, Float32Array);
      $ = null;
      let Br = await L(or, Float32Array);
      or = null;
      let Pr = cr(kr, Br);
      return pr !== void 0 ? { C: Pr, gpuTimeMs: pr } : { C: Pr };
    } finally {
      (!g && q && f(q),
        !g && C && f(C),
        !b && J && f(J),
        !b && nr && f(nr),
        !h && lr && f(lr),
        !h && er && f(er),
        Q && f(Q),
        $ && f($),
        or && f(or));
    }
  }
  async function ii(
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
    p,
    c,
    g = "row-major",
  ) {
    let b = n instanceof sr,
      h = u instanceof sr,
      x = p instanceof sr;
    if (
      (z(r),
      Z(r, "dgemmtr", { A: n, B: u, C: p }),
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
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!b && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!h && !(u instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!x && !(p instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (b && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (h && u.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (x && p.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((b || h) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!b || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || i === 0) return x ? {} : { C: p };
    let _ = b ? n.layout : g,
      v = h ? u.layout : g,
      B = x ? p.layout : g,
      k = _ === "column-major" ? s : t,
      E = _ === "column-major" ? t : s,
      I = e === "no-transpose" ? k : E,
      R = e === "no-transpose" ? E : k;
    if (d < R)
      throw new Error(
        `lda must be >= ${_ === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (b) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [ar, wr] = e === "no-transpose" ? [t, s] : [s, t];
      if (n.rows < ar || n.cols < wr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (I - 1) * d + R)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = v === "column-major" ? i : s,
      S = v === "column-major" ? s : i,
      N = a === "no-transpose" ? A : S,
      M = a === "no-transpose" ? S : A;
    if (m < M)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [ar, wr] = a === "no-transpose" ? [s, i] : [i, s];
      if (u.rows < ar || u.cols < wr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (u.length < (N - 1) * m + M)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let H = B === "column-major" ? i : t,
      F = B === "column-major" ? t : i;
    if (c < F)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (c !== p.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (p.rows < t || p.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (p.length < (H - 1) * c + F)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (_ === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (([n, u] = [u, n]),
        ([b, h] = [h, b]),
        ([d, m] = [m, d]),
        ([e, a] = [
          a === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, i] = [i, t]),
        (o = o === "lower" ? "upper" : "lower")));
    let K = Math.ceil(i / 64),
      Y = Math.ceil(t / 64),
      O = K * Y >= 36,
      q = await P(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          O ? "dgemm_large" : "dgemm_small",
        ],
        "main",
      ),
      C = null,
      J = null,
      nr = null,
      lr = null,
      er = null,
      Q = null,
      $ = null,
      or = null,
      rr = null;
    try {
      if (b) ((C = n._buf), (J = n._loBuf));
      else {
        let qr = X(n);
        ((C = y(r, qr.hi, "dgemmtr-AHi", !1)),
          (J = y(r, qr.lo, "dgemmtr-ALo", !1)));
      }
      if (h) ((nr = u._buf), (lr = u._loBuf));
      else {
        let qr = X(u);
        ((nr = y(r, qr.hi, "dgemmtr-BHi", !1)),
          (lr = y(r, qr.lo, "dgemmtr-BLo", !1)));
      }
      if (x) ((er = p._buf), (Q = p._loBuf));
      else {
        let qr = X(p);
        ((er = y(r, qr.hi, "dgemmtr-CHi", !0)),
          (Q = y(r, qr.lo, "dgemmtr-CLo", !0)));
      }
      let ar = e === "no-transpose",
        wr = a === "no-transpose",
        yr = ar && Er(C, d, t, s),
        ur = Er(nr, m, wr ? s : i, wr ? i : s),
        { hi: gr, lo: Rr } = X(new Float64Array([l])),
        { hi: Tr, lo: vr } = X(new Float64Array([w]));
      $ = T(
        r,
        [
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: gr[0], type: "f32" },
          { value: Rr[0], type: "f32" },
          { value: Tr[0], type: "f32" },
          { value: vr[0], type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: c, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: yr ? 1 : 0, type: "u32" },
          { value: ur ? 1 : 0, type: "u32" },
          { value: o === "lower" ? 1 : 2, type: "u32" },
        ],
        "dgemmtr-params",
      );
      let Nr = G(r, q.getBindGroupLayout(0), [
          C,
          Ar(r, C),
          J,
          nr,
          Ar(r, nr),
          lr,
          er,
          Q,
          $,
        ]),
        Dr = O
          ? { x: tr(r, K, "dgemmtr", "x"), y: tr(r, Y, "dgemmtr", "y") }
          : {
              x: tr(r, Math.ceil(i / 32), "dgemmtr", "x"),
              y: tr(r, Math.ceil(t / 32), "dgemmtr", "y"),
            },
        { commandEncoder: hr, ts: pr } = xr(r, q, Nr, Dr);
      ((or = x ? null : D(r, hr, er)), (rr = x ? null : D(r, hr, Q)), U(r, hr));
      let kr = await V(pr);
      if (x) return kr !== void 0 ? { gpuTimeMs: kr } : {};
      let Br = await L(or, Float32Array);
      or = null;
      let Pr = await L(rr, Float32Array);
      rr = null;
      let Lr = cr(Br, Pr);
      return kr !== void 0 ? { C: Lr, gpuTimeMs: kr } : { C: Lr };
    } finally {
      (!b && C && f(C),
        !b && J && f(J),
        !h && nr && f(nr),
        !h && lr && f(lr),
        !x && er && f(er),
        !x && Q && f(Q),
        $ && f($),
        or && f(or),
        rr && f(rr));
    }
  }
  async function si(r, o, e, a, t, i, s, l, n, d, u, m, w, p, c = "row-major") {
    let g = l instanceof sr,
      b = d instanceof sr,
      h = w instanceof sr;
    if (
      (z(r),
      Z(r, "sgemm", { A: l, B: d, C: w }),
      o !== "no-transpose" && o !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
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
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(l instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(d instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!h && !(w instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || b) && !h)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (h && (!g || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || u <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0 || t === 0) return h ? {} : { C: w };
    let x = g ? l.layout : c,
      _ = b ? d.layout : c,
      v = h ? w.layout : c,
      B = x === "column-major" ? i : a,
      k = x === "column-major" ? a : i,
      E = o === "no-transpose" ? B : k,
      I = o === "no-transpose" ? k : B;
    if (n < I)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (n !== l.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [$, or] = o === "no-transpose" ? [a, i] : [i, a];
      if (l.rows < $ || l.cols < or)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (l.length < (E - 1) * n + I)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let R = _ === "column-major" ? t : i,
      A = _ === "column-major" ? i : t,
      S = e === "no-transpose" ? R : A,
      N = e === "no-transpose" ? A : R;
    if (u < N)
      throw new Error(
        `ldb must be >= ${_ === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (u !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [$, or] = e === "no-transpose" ? [i, t] : [t, i];
      if (d.rows < $ || d.cols < or)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (S - 1) * u + N)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let M = v === "column-major" ? t : a,
      H = v === "column-major" ? a : t;
    if (p < H)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (h) {
      if (p !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < a || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (M - 1) * p + H)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      _ === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([l, d] = [d, l]),
        ([g, b] = [b, g]),
        ([n, u] = [u, n]),
        ([o, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          o === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([a, t] = [t, a])));
    let F = Math.ceil(t / 64),
      K = Math.ceil(a / 64),
      Y = F * K >= 36,
      O = await P(r, Y ? "sgemm_large" : "sgemm_small"),
      W = g ? l._buf : y(r, l, "sgemm-A", !1),
      q = b ? d._buf : y(r, d, "sgemm-B", !1),
      C = h ? w._buf : y(r, w, "sgemm-C", !0),
      J = o === "no-transpose",
      nr = e === "no-transpose",
      lr = Er(W, n, J ? a : i, J ? i : a),
      er = Er(q, u, nr ? i : t, nr ? t : i),
      Q = T(
        r,
        [
          { value: a, type: "u32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "f32" },
          { value: m, type: "f32" },
          { value: n, type: "u32" },
          { value: u, type: "u32" },
          { value: p, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: lr ? 1 : 0, type: "u32" },
          { value: er ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let $ = G(r, O.getBindGroupLayout(0), [W, Ar(r, W), q, Ar(r, q), C, Q]),
        or = Y
          ? { x: tr(r, F, "sgemm", "x"), y: tr(r, K, "sgemm", "y") }
          : {
              x: tr(r, Math.ceil(t / 32), "sgemm", "x"),
              y: tr(r, Math.ceil(a / 32), "sgemm", "y"),
            },
        { commandEncoder: rr, ts: ar } = xr(r, O, $, or),
        wr = h ? null : D(r, rr, C);
      U(r, rr);
      let yr = await V(ar);
      if (h) return yr !== void 0 ? { gpuTimeMs: yr } : {};
      let ur = await L(wr, Float32Array);
      return yr !== void 0 ? { C: ur, gpuTimeMs: yr } : { C: ur };
    } finally {
      (g || f(W), b || f(q), h || f(C), f(Q));
    }
  }
  async function ni(
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
    p,
    c,
    g = "row-major",
  ) {
    let b = n instanceof sr,
      h = u instanceof sr,
      x = p instanceof sr;
    if (
      (z(r),
      Z(r, "sgemmtr", { A: n, B: u, C: p }),
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
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!b && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!x && !(p instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((b || h) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!b || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || i < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || i === 0) return x ? {} : { C: p };
    let _ = b ? n.layout : g,
      v = h ? u.layout : g,
      B = x ? p.layout : g,
      k = _ === "column-major" ? s : t,
      E = _ === "column-major" ? t : s,
      I = e === "no-transpose" ? k : E,
      R = e === "no-transpose" ? E : k;
    if (d < R)
      throw new Error(
        `lda must be >= ${_ === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (b) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [or, rr] = e === "no-transpose" ? [t, s] : [s, t];
      if (n.rows < or || n.cols < rr)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (I - 1) * d + R)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = v === "column-major" ? i : s,
      S = v === "column-major" ? s : i,
      N = a === "no-transpose" ? A : S,
      M = a === "no-transpose" ? S : A;
    if (m < M)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [or, rr] = a === "no-transpose" ? [s, i] : [i, s];
      if (u.rows < or || u.cols < rr)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (u.length < (N - 1) * m + M)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let H = B === "column-major" ? i : t,
      F = B === "column-major" ? t : i;
    if (c < F)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (c !== p.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (p.rows < t || p.cols < i)
        throw new Error("C is too small for the given m and n.");
    } else if (p.length < (H - 1) * c + F)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (_ === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (([n, u] = [u, n]),
        ([b, h] = [h, b]),
        ([d, m] = [m, d]),
        ([e, a] = [
          a === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, i] = [i, t]),
        (o = o === "lower" ? "upper" : "lower")));
    let K = Math.ceil(i / 64),
      Y = Math.ceil(t / 64),
      O = K * Y >= 36,
      W = await P(r, O ? "sgemm_large" : "sgemm_small"),
      q = b ? n._buf : y(r, n, "sgemmtr-A", !1),
      C = h ? u._buf : y(r, u, "sgemmtr-B", !1),
      J = x ? p._buf : y(r, p, "sgemmtr-C", !0),
      nr = e === "no-transpose",
      lr = a === "no-transpose",
      er = Er(q, d, nr ? t : s, nr ? s : t),
      Q = Er(C, m, lr ? s : i, lr ? i : s),
      $ = T(
        r,
        [
          { value: t, type: "u32" },
          { value: i, type: "u32" },
          { value: s, type: "u32" },
          { value: l, type: "f32" },
          { value: w, type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: c, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: er ? 1 : 0, type: "u32" },
          { value: Q ? 1 : 0, type: "u32" },
          { value: o === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let or = G(r, W.getBindGroupLayout(0), [q, Ar(r, q), C, Ar(r, C), J, $]),
        rr = O
          ? { x: tr(r, K, "sgemmtr", "x"), y: tr(r, Y, "sgemmtr", "y") }
          : {
              x: tr(r, Math.ceil(i / 32), "sgemmtr", "x"),
              y: tr(r, Math.ceil(t / 32), "sgemmtr", "y"),
            },
        { commandEncoder: ar, ts: wr } = xr(r, W, or, rr),
        yr = x ? null : D(r, ar, J);
      U(r, ar);
      let ur = await V(wr);
      if (x) return ur !== void 0 ? { gpuTimeMs: ur } : {};
      let gr = await L(yr, Float32Array);
      return ur !== void 0 ? { C: gr, gpuTimeMs: ur } : { C: gr };
    } finally {
      (b || f(q), h || f(C), x || f(J), f($));
    }
  }
  async function li(r, o, e, a, t, i, s, l, n, d, u, m = "row-major") {
    let w = s instanceof sr,
      p = d instanceof sr;
    if ((z(r), Z(r, "ssyrk", { A: s, C: d }), o !== "lower" && o !== "upper"))
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
    if (!p && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (w && !p)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (p && !w)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (l <= 0 || u <= 0) throw new Error("lda and ldc must be positive.");
    if (a === 0) return p ? {} : { C: d };
    let c = w ? s.layout : m,
      g = p ? d.layout : m,
      b = c === "column-major" ? t : a,
      h = c === "column-major" ? a : t,
      x = e === "no-transpose" ? b : h,
      _ = e === "no-transpose" ? h : b;
    if (l < _)
      throw new Error(
        `lda must be >= ${c === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [W, q] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < W || s.cols < q)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (x - 1) * l + _)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (u < a) throw new Error("ldc must be >= n.");
    if (p) {
      if (u !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < a || d.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (a - 1) * u + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let v = e;
    c === "column-major" &&
      (v = v === "no-transpose" ? "transpose" : "no-transpose");
    let B = v === "no-transpose" ? "transpose" : "no-transpose",
      k = o;
    g === "column-major" &&
      (([v, B] = [
        B === "no-transpose" ? "transpose" : "no-transpose",
        v === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (k = k === "lower" ? "upper" : "lower"));
    let E = Math.ceil(a / 64),
      I = Math.ceil(a / 64),
      R = E * I >= 36,
      A = await P(r, R ? "sgemm_large" : "sgemm_small"),
      S = w ? s._buf : y(r, s, "ssyrk-A", !1),
      N = p ? d._buf : y(r, d, "ssyrk-C", !0),
      M = w
        ? dr(r, S.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : y(r, s, "ssyrk-B", !1),
      H = v === "no-transpose",
      F = B === "no-transpose",
      K = Er(S, l, H ? a : t, H ? t : a),
      Y = Er(M, l, F ? t : a, F ? a : t),
      O = T(
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
          { value: K ? 1 : 0, type: "u32" },
          { value: Y ? 1 : 0, type: "u32" },
          { value: k === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let W = G(r, A.getBindGroupLayout(0), [S, Ar(r, S), M, Ar(r, M), N, O]),
        q = R
          ? { x: tr(r, E, "ssyrk", "x"), y: tr(r, I, "ssyrk", "y") }
          : {
              x: tr(r, Math.ceil(a / 32), "ssyrk", "x"),
              y: tr(r, Math.ceil(a / 32), "ssyrk", "y"),
            },
        { commandEncoder: C, querySet: J, passDescriptor: nr } = Ur(r);
      (w && C.copyBufferToBuffer(S, 0, M, 0, S.size), Xr(C, A, W, q, nr));
      let lr = Hr(r, C, J),
        er = p ? null : D(r, C, N);
      U(r, C);
      let Q = await V(lr);
      if (p) return Q !== void 0 ? { gpuTimeMs: Q } : {};
      let $ = await L(er, Float32Array);
      return Q !== void 0 ? { C: $, gpuTimeMs: Q } : { C: $ };
    } finally {
      (w || f(S), f(M), p || f(N), f(O));
    }
  }
  async function ui(r, o, e, a, t, i, s, l, n, d, u, m, w, p = "row-major") {
    let c = s instanceof sr,
      g = n instanceof sr,
      b = m instanceof sr;
    if (
      (z(r),
      Z(r, "ssyr2k", { A: s, B: n, C: m }),
      o !== "lower" && o !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
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
    if (!c && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((c || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!c || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (l <= 0 || d <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (a === 0) return b ? {} : { C: m };
    let h = c ? s.layout : p,
      x = g ? n.layout : p,
      _ = b ? m.layout : p,
      v = h === "column-major" ? t : a,
      B = h === "column-major" ? a : t,
      k = e === "no-transpose" ? v : B,
      E = e === "no-transpose" ? B : v;
    if (l < E)
      throw new Error(
        `lda must be >= ${h === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (c) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [$, or] = e === "no-transpose" ? [a, t] : [t, a];
      if (s.rows < $ || s.cols < or)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (s.length < (k - 1) * l + E)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let I = x === "column-major" ? t : a,
      R = x === "column-major" ? a : t,
      A = e === "no-transpose" ? I : R,
      S = e === "no-transpose" ? R : I;
    if (d < S)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [$, or] = e === "no-transpose" ? [a, t] : [t, a];
      if (n.rows < $ || n.cols < or)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (A - 1) * d + S)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (w < a) throw new Error("ldc must be >= n.");
    if (b) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < a || m.cols < a)
        throw new Error("C is too small for the given n.");
    } else if (m.length < (a - 1) * w + a)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let N = e;
    h === "column-major" &&
      (N = N === "no-transpose" ? "transpose" : "no-transpose");
    let M = e;
    x === "column-major" &&
      (M = M === "no-transpose" ? "transpose" : "no-transpose");
    let H = _ === "column-major" ? (o === "lower" ? "upper" : "lower") : o,
      F = ($) => ($ === "no-transpose" ? "transpose" : "no-transpose");
    function K($, or, rr, ar, wr, yr) {
      let ur = $,
        gr = F(ar);
      return _ !== "column-major"
        ? { transX: ur, X: or, ldX: rr, transY: gr, Y: wr, ldY: yr }
        : { transX: F(gr), X: wr, ldX: yr, transY: F(ur), Y: or, ldY: rr };
    }
    let Y = Math.ceil(a / 64),
      O = Math.ceil(a / 64),
      W = Y * O >= 36,
      q = await P(r, W ? "sgemm_large" : "sgemm_small"),
      C = W
        ? { x: tr(r, Y, "ssyr2k", "x"), y: tr(r, O, "ssyr2k", "y") }
        : {
            x: tr(r, Math.ceil(a / 32), "ssyr2k", "x"),
            y: tr(r, Math.ceil(a / 32), "ssyr2k", "y"),
          },
      J = c ? s._buf : y(r, s, "ssyr2k-A", !1),
      nr = g ? n._buf : y(r, n, "ssyr2k-B", !1),
      lr = b ? m._buf : y(r, m, "ssyr2k-C", !0),
      er = null,
      Q = null;
    try {
      let $ = K(N, J, l, M, nr, d),
        or = K(M, nr, d, N, J, l),
        rr = (pr) => {
          let kr = pr.transX === "no-transpose",
            Br = pr.transY === "no-transpose";
          return [
            Er(pr.X, pr.ldX, kr ? a : t, kr ? t : a),
            Er(pr.Y, pr.ldY, Br ? t : a, Br ? a : t),
          ];
        },
        ar = (pr, kr) =>
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
              { value: rr(pr)[0] ? 1 : 0, type: "u32" },
              { value: rr(pr)[1] ? 1 : 0, type: "u32" },
              { value: H === "lower" ? 1 : 2, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((er = ar($, u)), (Q = ar(or, 1)));
      let wr = G(r, q.getBindGroupLayout(0), [
          $.X,
          Ar(r, $.X),
          $.Y,
          Ar(r, $.Y),
          lr,
          er,
        ]),
        yr = G(r, q.getBindGroupLayout(0), [
          or.X,
          Ar(r, or.X),
          or.Y,
          Ar(r, or.Y),
          lr,
          Q,
        ]),
        { commandEncoder: ur, querySet: gr } = Ur(r),
        Rr = gr
          ? { timestampWrites: { querySet: gr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Tr = gr
          ? { timestampWrites: { querySet: gr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Xr(ur, q, wr, C, Rr), Xr(ur, q, yr, C, Tr));
      let vr = Hr(r, ur, gr),
        Nr = b ? null : D(r, ur, lr);
      U(r, ur);
      let Dr = await V(vr);
      if (b) return Dr !== void 0 ? { gpuTimeMs: Dr } : {};
      let hr = await L(Nr, Float32Array);
      return Dr !== void 0 ? { C: hr, gpuTimeMs: Dr } : { C: hr };
    } finally {
      (c || f(J), g || f(nr), b || f(lr), er && f(er), Q && f(Q));
    }
  }
  async function di(r, o, e, a, t, i, s, l, n, d, u, m, w, p = "row-major") {
    let c = s instanceof sr,
      g = n instanceof sr,
      b = m instanceof sr;
    if (
      (z(r), Z(r, "ssymm", { A: s, B: n, C: m }), o !== "left" && o !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (p !== "row-major" && p !== "column-major")
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
    if (!c && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((c || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!c || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (a < 0 || t < 0) throw new Error("m and n must be non-negative.");
    if (a === 0 || t === 0) return b ? {} : { C: m };
    let h = c ? s.layout : p,
      x = g ? n.layout : p,
      _ = b ? m.layout : p,
      v = o === "left" ? a : t;
    if (l < v)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (c) {
      if (l !== s.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (s.rows < v || s.cols < v)
        throw new Error("A is too small for the given m/n and side.");
    } else if (s.length < (v - 1) * l + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let B = x === "column-major" ? t : a,
      k = x === "column-major" ? a : t;
    if (d < k)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < a || n.cols < t)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (B - 1) * d + k)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let E = _ === "column-major" ? t : a,
      I = _ === "column-major" ? a : t;
    if (w < I)
      throw new Error(
        `ldc must be >= ${_ === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < a || m.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (E - 1) * w + I)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let R = h === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      A = x === "column-major" ? "transpose" : "no-transpose",
      S = "no-transpose",
      N = a,
      M = t,
      H = v,
      F = o === "left" ? S : A,
      K = o === "left" ? A : S,
      Y = (yr) => (yr === "no-transpose" ? "transpose" : "no-transpose"),
      O = o === "right";
    _ === "column-major" &&
      (([F, K] = [Y(K), Y(F)]), (O = !O), ([N, M] = [M, N]));
    let W = v,
      q = Math.ceil(M / 64),
      C = Math.ceil(N / 64),
      J = q * C >= 36,
      nr = await P(r, J ? "sgemm_large" : "sgemm_small"),
      lr = await P(r, "symmetrize"),
      er = J
        ? { x: tr(r, q, "ssymm", "x"), y: tr(r, C, "ssymm", "y") }
        : {
            x: tr(r, Math.ceil(M / 32), "ssymm", "x"),
            y: tr(r, Math.ceil(N / 32), "ssymm", "y"),
          },
      Q = c ? s._buf : y(r, s, "ssymm-A", !1),
      $ = g ? n._buf : y(r, n, "ssymm-B", !1),
      or = b ? m._buf : y(r, m, "ssymm-C", !0),
      rr = dr(r, v * W * 4, "ssymm-Adense"),
      ar = null,
      wr = null;
    try {
      ar = T(
        r,
        [
          { value: v, type: "u32" },
          { value: l, type: "u32" },
          { value: W, type: "u32" },
          { value: R === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let yr = G(r, lr.getBindGroupLayout(0), [Q, rr, ar]),
        ur = O ? $ : rr,
        gr = O ? d : W,
        Rr = O ? rr : $,
        Tr = O ? W : d,
        vr = F === "no-transpose",
        Nr = K === "no-transpose",
        Dr = Er(ur, gr, vr ? N : H, vr ? H : N),
        hr = Er(Rr, Tr, Nr ? H : M, Nr ? M : H);
      wr = T(
        r,
        [
          { value: N, type: "u32" },
          { value: M, type: "u32" },
          { value: H, type: "u32" },
          { value: i, type: "f32" },
          { value: u, type: "f32" },
          { value: gr, type: "u32" },
          { value: Tr, type: "u32" },
          { value: w, type: "u32" },
          { value: F === "transpose" ? 1 : 0, type: "u32" },
          { value: K === "transpose" ? 1 : 0, type: "u32" },
          { value: Dr ? 1 : 0, type: "u32" },
          { value: hr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let pr = G(r, nr.getBindGroupLayout(0), [
          ur,
          Ar(r, ur),
          Rr,
          Ar(r, Rr),
          or,
          wr,
        ]),
        { commandEncoder: kr, querySet: Br } = Ur(r),
        Pr = Br
          ? { timestampWrites: { querySet: Br, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Lr = Br
          ? { timestampWrites: { querySet: Br, endOfPassWriteIndex: 1 } }
          : void 0;
      (Xr(kr, lr, yr, { x: Math.ceil(v / 8), y: Math.ceil(v / 8) }, Pr),
        Xr(kr, nr, pr, er, Lr));
      let qr = Hr(r, kr, Br),
        se = b ? null : D(r, kr, or);
      U(r, kr);
      let Yr = await V(qr);
      if (b) return Yr !== void 0 ? { gpuTimeMs: Yr } : {};
      let ne = await L(se, Float32Array);
      return Yr !== void 0 ? { C: ne, gpuTimeMs: Yr } : { C: ne };
    } finally {
      (c || f(Q), g || f($), b || f(or), f(rr), ar && f(ar), wr && f(wr));
    }
  }
  async function fi(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let p = n instanceof sr,
      c = u instanceof sr,
      g = t === "unit";
    if ((z(r), Z(r, "strmm", { A: n, B: u }), o !== "left" && o !== "right"))
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
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (p !== c)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return c ? {} : { B: u };
    let b = p ? n.layout : w,
      h = c ? u.layout : w,
      x = o === "left" ? i : s;
    if (d < x)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (p) {
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
    if (c) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < i || u.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (_ - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      k =
        b === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      E = h === "column-major" ? "transpose" : "no-transpose",
      I = "no-transpose",
      R = i,
      A = s,
      S = x,
      N = o === "left" ? I : E,
      M = o === "left" ? E : I,
      H = (ar) => (ar === "no-transpose" ? "transpose" : "no-transpose"),
      F = o === "right";
    h === "column-major" &&
      (([N, M] = [H(M), H(N)]), (F = !F), ([R, A] = [A, R]));
    let K = x,
      Y = Math.ceil(A / 64),
      O = Math.ceil(R / 64),
      W = Y * O >= 36,
      q = await P(r, W ? "sgemm_large" : "sgemm_small"),
      C = await P(r, "triangularize"),
      J = W
        ? { x: tr(r, Y, "strmm", "x"), y: tr(r, O, "strmm", "y") }
        : {
            x: tr(r, Math.ceil(A / 32), "strmm", "x"),
            y: tr(r, Math.ceil(R / 32), "strmm", "y"),
          },
      nr = null,
      lr = null,
      er = null,
      Q = null,
      $ = null,
      or = null,
      rr = !1;
    try {
      ((nr = p ? n._buf : y(r, n, "strmm-A", !1)),
        (lr = c ? u._buf : y(r, u, "strmm-B", !0)),
        (er = dr(r, x * K * 4, "strmm-Adense")),
        (Q = dr(
          r,
          _ * m * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        ($ = T(
          r,
          [
            { value: x, type: "u32" },
            { value: d, type: "u32" },
            { value: K, type: "u32" },
            { value: B === "upper" ? 1 : 0, type: "u32" },
            { value: k === "transpose" ? 1 : 0, type: "u32" },
            { value: g ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let ar = G(r, C.getBindGroupLayout(0), [nr, er, $]),
        wr = F ? lr : er,
        yr = F ? m : K,
        ur = F ? er : lr,
        gr = F ? K : m,
        Rr = N === "no-transpose",
        Tr = M === "no-transpose",
        vr = Er(wr, yr, Rr ? R : S, Rr ? S : R),
        Nr = Er(ur, gr, Tr ? S : A, Tr ? A : S),
        Dr = (k === "no-transpose") == (B === "lower"),
        hr = !F,
        pr = Dr !== (hr ? !Rr : !Tr);
      or = T(
        r,
        [
          { value: R, type: "u32" },
          { value: A, type: "u32" },
          { value: S, type: "u32" },
          { value: l, type: "f32" },
          { value: 0, type: "f32" },
          { value: yr, type: "u32" },
          { value: gr, type: "u32" },
          { value: m, type: "u32" },
          { value: N === "transpose" ? 1 : 0, type: "u32" },
          { value: M === "transpose" ? 1 : 0, type: "u32" },
          { value: vr ? 1 : 0, type: "u32" },
          { value: Nr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: hr ? (pr ? 1 : 2) : pr ? 3 : 4, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let Br = G(r, q.getBindGroupLayout(0), [
          wr,
          Ar(r, wr),
          ur,
          Ar(r, ur),
          Q,
          or,
        ]),
        { commandEncoder: Pr, querySet: Lr } = Ur(r);
      Pr.copyBufferToBuffer(lr, 0, Q, 0, Math.min(lr.size, Q.size));
      let qr = Lr
          ? { timestampWrites: { querySet: Lr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        se = Lr
          ? { timestampWrites: { querySet: Lr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Xr(Pr, C, ar, { x: Math.ceil(x / 8), y: Math.ceil(x / 8) }, qr),
        Xr(Pr, q, Br, J, se));
      let Yr = Hr(r, Pr, Lr),
        ne = c ? null : D(r, Pr, Q);
      U(r, Pr);
      let xe = await V(Yr);
      if (c)
        return (
          f(u._buf),
          (u._buf = Q),
          (rr = !0),
          xe !== void 0 ? { gpuTimeMs: xe } : {}
        );
      let We = await L(ne, Float32Array);
      return xe !== void 0 ? { B: We, gpuTimeMs: xe } : { B: We };
    } finally {
      (!p && nr && f(nr),
        !c && lr && f(lr),
        er && f(er),
        Q && !rr && f(Q),
        $ && f($),
        or && f(or));
    }
  }
  var $r = (r, o, e, a) => ({ buffer: r, off: o, rs: e, cs: a }),
    ye = (r) => ({ ...r, rs: r.cs, cs: r.rs }),
    le = (r, o, e) => ({ ...r, off: r.off + o * r.rs + e * r.cs });
  function $s(r, o) {
    typeof o == "number"
      ? r.dispatchWorkgroups(o)
      : r.dispatchWorkgroups(o.x, o.y, o.z ?? 1);
  }
  var Js = 8;
  function Qs(r, o, e, a, t, i, s, l, n, d, u, m) {
    s.cs !== 1 && (([t, i, s] = [ye(i), ye(t), ye(s)]), ([l, n] = [n, l]));
    let w = t.cs === 1,
      p = i.cs === 1,
      c = w ? t.rs : t.cs,
      g = p ? i.rs : i.cs,
      b = Er(t.buffer, c, w ? l : d, w ? d : l, t.off),
      h = Er(i.buffer, g, p ? d : n, p ? n : d, i.off),
      x = Math.ceil(n / 64),
      _ = Math.ceil(l / 64),
      v = x * _ >= 36,
      B = v ? e.large : e.small,
      k = a(
        [
          { value: l, type: "u32" },
          { value: n, type: "u32" },
          { value: d, type: "u32" },
          { value: u, type: "f32" },
          { value: m, type: "f32" },
          { value: c, type: "u32" },
          { value: g, type: "u32" },
          { value: s.rs, type: "u32" },
          { value: w ? 0 : 1, type: "u32" },
          { value: p ? 0 : 1, type: "u32" },
          { value: b ? 1 : 0, type: "u32" },
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
        G(r, B.getBindGroupLayout(0), [
          t.buffer,
          Ar(r, t.buffer),
          i.buffer,
          Ar(r, i.buffer),
          s.buffer,
          k,
        ]),
      ),
      o.dispatchWorkgroups(
        tr(r, v ? x : Math.ceil(n / 32), "strsm", "x"),
        tr(r, v ? _ : Math.ceil(l / 32), "strsm", "y"),
      ));
  }
  async function mi(r, o, e, a, t, i, s, l, n, d, u, m, w = "row-major") {
    let p = n instanceof sr,
      c = u instanceof sr,
      g = t === "unit";
    if ((z(r), Z(r, "strsm", { A: n, B: u }), o !== "left" && o !== "right"))
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
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(u instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (p !== c)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (i < 0 || s < 0) throw new Error("m and n must be non-negative.");
    if (i === 0 || s === 0) return c ? {} : { B: u };
    let b = p ? n.layout : w,
      h = c ? u.layout : w,
      x = o === "left" ? i : s;
    if (d < x)
      throw new Error("lda must be >= " + (o === "left" ? "m" : "n") + ".");
    if (p) {
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
    if (c) {
      if (m !== u.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (u.rows < i || u.cols < s)
        throw new Error("B is too small for the given m and n.");
    } else if (u.length < (_ - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let B = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      k =
        b === "column-major"
          ? a === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : a,
      E = o === "left" ? s : i,
      I = o === "left",
      R = (k === "no-transpose") == (B === "lower"),
      A = o === "left" ? R : !R,
      S = [];
    for (let er = 0; er < x; er += 64) S.push(er);
    A || S.reverse();
    let N = S.length,
      M = await P(r, "strsm_small"),
      H = N > Js,
      F = H ? await P(r, "strsv_invert_block") : null,
      K = H ? await P(r, "block_transfer") : null,
      Y = tr(r, Math.ceil(E / 4), "strsm"),
      O = {
        small: await P(r, "sgemm_small"),
        large: await P(r, "sgemm_large"),
      },
      W = null,
      q = null,
      C = null,
      J = null,
      nr = [];
    function lr(er, Q) {
      let $ = T(r, er, Q);
      return (nr.push($), $);
    }
    try {
      ((W = p ? n._buf : y(r, n, "strsm-A", !1)),
        (q = c ? u._buf : y(r, u, "strsm-B", !0)),
        H && (C = dr(r, N * 64 * 64 * 4, "strsm-Ainv")),
        (J = dr(r, (N > 1 ? 64 * E : 4) * 4, "strsm-Xblock")));
      let er = h === "column-major" ? $r(q, 0, 1, m) : $r(q, 0, m, 1),
        Q = o === "left" ? er : ye(er),
        $ = k === "transpose" ? $r(W, 0, 1, d) : $r(W, 0, d, 1),
        or = o === "left" ? $ : ye($),
        rr = $r(J, 0, E, 1),
        { commandEncoder: ar, querySet: wr, passDescriptor: yr } = Ur(r),
        ur = ar.beginComputePass(yr),
        gr = (hr, pr, kr, Br, Pr, Lr, qr, se) =>
          Qs(r, ur, O, lr, hr, pr, kr, Br, Pr, Lr, qr, se),
        Rr = (hr, pr, kr, Br, Pr) => {
          let Lr = lr(
            [
              { value: kr, type: "u32" },
              { value: E, type: "u32" },
              { value: hr.off, type: "u32" },
              { value: hr.rs, type: "u32" },
              { value: hr.cs, type: "u32" },
              { value: pr.off, type: "u32" },
              { value: pr.rs, type: "u32" },
              { value: pr.cs, type: "u32" },
              { value: A ? 0 : 1, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
              { value: Br, type: "f32" },
              { value: Pr, type: "u32" },
            ],
            "strsm-solve-params",
          );
          (ur.setPipeline(M),
            ur.setBindGroup(0, G(r, M.getBindGroupLayout(0), [W, q, Lr, J])),
            ur.dispatchWorkgroups(Y));
        };
      if (l === 0) {
        let hr = $r(J, 0, 1, 1);
        gr(hr, hr, $r(q, 0, m, 1), _, v, 0, 0, 0);
      } else if (N === 1) Rr(or, Q, x, l, 0);
      else {
        if (l !== 1) {
          let hr = $r(J, 0, 1, 1);
          gr(hr, hr, $r(q, 0, m, 1), _, v, 0, 0, l);
        }
        if (H) {
          let hr = lr(
            [
              { value: x, type: "u32" },
              { value: d, type: "u32" },
              { value: k === "transpose" ? 1 : 0, type: "u32" },
              { value: B === "upper" ? 1 : 0, type: "u32" },
              { value: g ? 1 : 0, type: "u32" },
            ],
            "strsm-invert-params",
          );
          (ur.setPipeline(F),
            ur.setBindGroup(0, G(r, F.getBindGroupLayout(0), [W, C, hr])),
            ur.dispatchWorkgroups(N));
          for (let pr of S) {
            let kr = Math.min(pr + 64, x),
              Br = kr - pr,
              Lr = (pr / 64) * 64 * 64,
              qr = o === "left" ? $r(C, Lr, 1, 64) : $r(C, Lr, 64, 1);
            gr(qr, le(Q, pr, 0), rr, Br, E, Br, 1, 0);
            let se = lr(
              [
                { value: pr, type: "u32" },
                { value: Br, type: "u32" },
                { value: 0, type: "u32" },
                { value: E, type: "u32" },
                { value: m, type: "u32" },
                { value: h === "column-major" ? 1 : 0, type: "u32" },
                { value: I ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            );
            (ur.setPipeline(K),
              ur.setBindGroup(0, G(r, K.getBindGroupLayout(0), [J, q, se])),
              $s(ur, ya(r, "strsm", Br, E)));
            let Yr = A ? kr : 0,
              ne = A ? x : pr;
            Yr >= ne ||
              gr(le(or, Yr, pr), rr, le(Q, Yr, 0), ne - Yr, E, Br, -1, 1);
          }
        } else
          for (let hr of S) {
            let pr = Math.min(hr + 64, x),
              kr = pr - hr;
            Rr(le(or, hr, hr), le(Q, hr, 0), kr, 1, E);
            let Br = A ? pr : 0,
              Pr = A ? x : hr;
            Br >= Pr ||
              gr(le(or, Br, hr), rr, le(Q, Br, 0), Pr - Br, E, kr, -1, 1);
          }
      }
      ur.end();
      let Tr = Hr(r, ar, wr),
        vr = c ? null : D(r, ar, q);
      U(r, ar);
      let Nr = await V(Tr);
      if (c) return Nr !== void 0 ? { gpuTimeMs: Nr } : {};
      let Dr = await L(vr, Float32Array);
      return Nr !== void 0 ? { B: Dr, gpuTimeMs: Nr } : { B: Dr };
    } finally {
      (!p && W && f(W), !c && q && f(q), J && f(J), C && f(C), f(nr));
    }
  }
  return bi(rn);
})();
