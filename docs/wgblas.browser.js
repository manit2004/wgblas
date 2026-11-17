var wgblas = (() => {
  var js = Object.create;
  var Te = Object.defineProperty;
  var Hs = Object.getOwnPropertyDescriptor;
  var Fs = Object.getOwnPropertyNames;
  var Cs = Object.getPrototypeOf,
    Ws = Object.prototype.hasOwnProperty;
  var je = ((r) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
        ? new Proxy(r, {
            get: (a, e) => (typeof require < "u" ? require : a)[e],
          })
        : r)(function (r) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + r + '" is not supported');
  });
  var ur = (r, a, e) => () => {
    if (e) throw e[0];
    try {
      return (r && (a = r((r = 0))), a);
    } catch (o) {
      throw ((e = [o]), o);
    }
  };
  var ot = (r, a) => {
      for (var e in a) Te(r, e, { get: a[e], enumerable: !0 });
    },
    at = (r, a, e, o) => {
      if ((a && typeof a == "object") || typeof a == "function")
        for (let t of Fs(a))
          !Ws.call(r, t) &&
            t !== e &&
            Te(r, t, {
              get: () => a[t],
              enumerable: !(o = Hs(a, t)) || o.enumerable,
            });
      return r;
    };
  var He = (r, a, e) => (
      (e = r != null ? js(Cs(r)) : {}),
      at(
        a || !r || !r.__esModule
          ? Te(e, "default", { value: r, enumerable: !0 })
          : e,
        r,
      )
    ),
    Os = (r) => at(Te({}, "__esModule", { value: !0 }), r);
  var kt,
    vt = ur(() => {
      kt = `// sscal: x = alpha * x

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
  var _t,
    Bt = ur(() => {
      _t = `// cscal: x := alpha * x, complex. x is one interleaved f32 array
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
  var Et,
    At = ur(() => {
      Et = `// sswap: x <-> y

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
  var St,
    Lt = ur(() => {
      St = `// dswap: x <-> y, double-double (Dekker) f64 emulation of sswap. A swap is
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
  var Gt,
    Dt = ur(() => {
      Gt = `// saxpy: y = alpha * x + y

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
  var It,
    Nt = ur(() => {
      It = `// scopy: y = x

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
  var Mt,
    Pt = ur(() => {
      Mt = `// dcopy: y = x, double-double (Dekker) f64 emulation of scopy. A copy is
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
  var Tt,
    Rt = ur(() => {
      Tt = `// sdot: result = sum(x[i] * y[i])
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
  var Ze,
    jt = ur(() => {
      Ze = `// sum reduction: collapses 2*WGS partials into one scalar.
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
  var Ft,
    Ht = ur(() => {
      Ft = `// sasum: result = sum(|x[i]|)
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
  var Wt,
    Ct = ur(() => {
      Wt = `// snrm2: result = sqrt(sum(x[i] * x[i])), overflow- and underflow-safe via
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
  var Kt,
    Ot = ur(() => {
      Kt = `// scaledSum reduction: collapses snrm2.wgsl's 2*WGS (big, medium, small)
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

// v \xB7 2^e by editing the exponent bits: exact, and nothing for a compiler to
// fold. Not ldexp(): HLSL has no exact one \u2014 it's defined as v * 2^e, and
// 2^-152 is below f32's range, so the product can come out 0 (snrm2/dnrm2
// dropped their medium sums that way on D3D12 WARP). Zero and results below
// f32's normal range give a signed 0, overflow a signed Inf; Inf and NaN pass
// through.
fn ldexpBits(v: f32, e: i32) -> f32 {
  let bits = bitcast<u32>(v);
  let sign = bits & 0x80000000u;
  let ev = i32((bits >> 23u) & 0xffu);
  if (ev == 255) { return v; }
  let en = ev + e;
  if (ev == 0 || en <= 0) { return bitcast<f32>(sign); }
  if (en >= 255) { return bitcast<f32>(sign | 0x7f800000u); }
  return bitcast<f32>((bits & 0x807fffffu) | (u32(en) << 23u));
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
      // Medium in big's units is amed\xB7SBIG\xB2 = amed\xB72^-152 \u2014 one exact
      // exponent shift (ldexpBits). Never as (amed\xB7SBIG)\xB7SBIG: a compiler may
      // fold that into amed\xB7(SBIG\xB7SBIG), and the constant 2^-152 underflows
      // f32 to 0 (it did, on NVIDIA/Vulkan). If the scaled value underflows,
      // medium was below big's rounding anyway (big's smallest square is
      // 2^-52).
      if (medLive) { abig = abig + ldexpBits(amed, SBIG_SQ_EXP); }
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
  var zt,
    qt = ur(() => {
      zt = `// isamax: returns index of element with largest absolute value
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
  var Ut,
    Vt = ur(() => {
      Ut = `// amax reduction: collapses 2*WGS (value, index) pairs into one index.
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
  var zr,
    Zt = ur(() => {
      zr = `// Double-double arithmetic via Dekker's algorithm \u2014 an alternative to
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
  var We,
    Xt = ur(() => {
      We = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var Zr,
    Yt = ur(() => {
      Zr = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// \u2500\u2500 A real compiler bug \u2014 read before touching anything below \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
//
// twoSum/fastTwoSum's error term \`e\` should be nonzero (that's the point \u2014
// \`s\` is rounded). A front-end-optimizer bug zeros it anyway, on both NVIDIA
// and Mesa (ANV + llvmpipe), via two different mechanisms needing two fixes:
// bitcast-based subtraction (\`fsub\`/\`negf\`, fixes NVIDIA) and materializing
// the sum through workgroup memory + workgroupBarrier() (fixes Mesa). Metal
// needs a third, hide() (see the protected variants below). Use the protected
// ops, which apply all three \u2014 the plain twoSum/fastTwoSum/ddAdd below are
// reference-only, not safe to use.
fn negf(x: f32) -> f32 {
  return bitcast<f32>(bitcast<u32>(x) ^ 0x80000000u);
}
fn fsub(a: f32, b: f32) -> f32 {
  return a + negf(b);
}

// IEEE special values: once a rounded result is \xB1Inf or NaN, the error-free
// transformations' error term is meaningless (Inf - Inf = NaN) \u2014 the value
// alone is the answer, so its error is 0. Without this an Inf turns into NaN
// at the next DD op, where f32 (and real f64) would carry the Inf through.
fn isFiniteF(x: f32) -> bool {
  return (bitcast<u32>(x) & 0x7f800000u) != 0x7f800000u;
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
// Bitcast subtraction + workgroup-barrier materialization (verified on
// NVIDIA, Mesa ANV and llvmpipe) + hide() for Metal. Costs a real barrier:
// fine for O(1)-per-thread or O(log n) reduction use, not a long
// per-element loop. A
// workgroupBarrier() requires uniform control flow, so:
//   - \`threadSlot\` must be unique per concurrent caller (e.g. local_invocation_index).
//   - Every thread in the workgroup must call this the same number of times
//     \u2014 including ones whose result gets discarded. Compute unconditionally;
//     only the write-back should be conditional.
// Sized for the largest DD workgroup (dgemm_small, 256 threads), plus
// DEKKER_ZERO_SLOT, which nothing writes (see hide() below).
const DEKKER_ZERO_SLOT: u32 = 256u;
var<workgroup> dekkerScratch: array<f32, 257>;

// \u2500\u2500 Metal: relaxed math \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
//
// Dawn compiles every Metal shader under \`#pragma METAL fp math_mode(relaxed)\`
// (strict math is a native-only Dawn option WebGPU doesn't expose), which
// lets the compiler reassociate and simplify float algebra. That folds the
// error terms away by algebra alone, whatever \`s\` is: \`a - (s - (s - a))\`
// is \`a - a\` = 0. Materializing \`s\` can't stop it; the formula itself has to
// be opaque. hide() makes a value opaque: an XOR with a zero the compiler
// can't prove is zero (DEKKER_ZERO_SLOT \u2014 WebGPU zero-initializes workgroup
// memory, and the runtime-indexed stores into the same array keep the
// compiler from knowing that slot's contents). Every input and intermediate
// of an error-free transformation goes through it, so each float op stands
// alone and rounds exactly as written: nothing to reassociate or fuse.
fn dekkerZero() -> u32 {
  return bitcast<u32>(dekkerScratch[DEKKER_ZERO_SLOT]);
}
fn hide(x: f32, zero: u32) -> f32 {
  return bitcast<f32>(bitcast<u32>(x) ^ zero);
}

fn twoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  let z = dekkerZero();
  let ha = hide(a, z);
  let hb = hide(b, z);
  dekkerScratch[threadSlot] = ha + hb;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let v = hide(fsub(s, ha), z);
  let e = hide(fsub(ha, hide(fsub(s, v), z)), z) + hide(fsub(hb, v), z);
  return DD(s, select(0.0, e, isFiniteF(s)));
}

fn fastTwoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  let z = dekkerZero();
  let ha = hide(a, z);
  let hb = hide(b, z);
  dekkerScratch[threadSlot] = ha + hb;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let e = fsub(hb, hide(fsub(s, ha), z));
  return DD(s, select(0.0, e, isFiniteF(s)));
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
  var Jt,
    $t = ur(() => {
      Jt = `// dasum: sum(|x[i]|), double-double (Dekker). Same ILP=4 shape as sasum.wgsl;
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
  var Xe,
    Qt = ur(() => {
      Xe = `// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
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
    ro = ur(() => {
      $r = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
// f64/utils/add.wgsl for fsub/negf (bitcast-based subtraction/negation),
// hide/dekkerZero (Metal's relaxed math) and, for ddMulProtected at the
// bottom, fastTwoSumProtected.
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

fn bitSplit(a: f32, zero: u32) -> DD {
  let bits = bitcast<u32>(a);
  // Top 11 mantissa bits, so hi carries 12 significant bits with the implicit
  // leading 1 \u2014 the halves are multiplied pairwise and f32 holds 24, so a
  // wider split rounds those products and the "exact" error term goes wrong.
  // Matches SPLIT_CONST = 2^12+1 used by the Veltkamp path below.
  let hiBits = bits & 0xFFFFF000u;
  let hi = bitcast<f32>(hiBits);
  let lo = hide(fsub(a, hi), zero); // exact by Sterbenz's lemma (hi, a share an exponent, are close)
  return DD(hi, lo);
}

// Every input, product and partial difference goes through hide() (add.wgsl)
// so Metal's relaxed math can't reassociate the chain or fuse a product into
// the subtraction after it \u2014 the error term is only exact as written.
fn twoProdBit(a: f32, b: f32) -> DD {
  let z = dekkerZero();
  let ha = hide(a, z);
  let hb = hide(b, z);
  let s = hide(ha * hb, z);
  let aSplit = bitSplit(ha, z);
  let bSplit = bitSplit(hb, z);
  let e1 = hide(fsub(s, hide(aSplit.hi * bSplit.hi, z)), z);
  let e2 = hide(fsub(e1, hide(aSplit.lo * bSplit.hi, z)), z);
  let e3 = hide(fsub(e2, hide(aSplit.hi * bSplit.lo, z)), z);
  let e = fsub(e3, hide(aSplit.lo * bSplit.lo, z));
  // Inf/NaN product: no error term (see isFiniteF in add.wgsl).
  return DD(s, select(0.0, negf(e), isFiniteF(s)));
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
  // Inf/NaN product: the cross terms would add Inf*0 = NaN (see isFiniteF).
  let crossAndLo = select(0.0, pLo + (a.hi * b.lo + a.lo * b.hi), isFiniteF(p.hi));
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
  var Ae,
    eo = ur(() => {
      Ae = `// Requires f64/dekker.wgsl concatenated first for the DD struct.
//
// Batched protected double-double ops: four independent operations per
// workgroupBarrier() instead of one. Same algorithms and the same compiler-bug
// protections as add.wgsl/multiply.wgsl \u2014 bitcast subtraction (NVIDIA) and
// values materialized through workgroup memory + a barrier (Mesa) \u2014 applied
// lane-wise to vec4s. The barrier only has to separate a thread's store from
// its own load, so one barrier serves all four lanes. ddMulProtected costs 3
// barriers and ddAddProtected 2; ddMul4Protected/ddAdd4Protected cost the
// same for four results. Inf/NaN results carry a 0 error term, as in the
// scalar ops (isFiniteF in add.wgsl).
//
// Same uniformity contract as the scalar ops: \`threadSlot\` unique per thread
// (local_invocation_index), every thread calls each op the same number of
// times, only write-backs conditional. Sized for 256-thread workgroups, plus
// DEKKER4_ZERO_SLOT for hide4() \u2014 add.wgsl's hide() lane-wise, which keeps
// Metal's relaxed math from reassociating the error terms (see add.wgsl).

struct DD4 {
  hi: vec4<f32>,
  lo: vec4<f32>,
}

const DEKKER4_ZERO_SLOT: u32 = 256u;
var<workgroup> dekkerScratch4: array<vec4<f32>, 257>;

// A zero the compiler can't prove: a slot nothing writes (see add.wgsl).
fn dekkerZero4() -> vec4<u32> {
  return bitcast<vec4<u32>>(dekkerScratch4[DEKKER4_ZERO_SLOT]);
}
fn hide4(x: vec4<f32>, zero: vec4<u32>) -> vec4<f32> {
  return bitcast<vec4<f32>>(bitcast<vec4<u32>>(x) ^ zero);
}

fn negf4(x: vec4<f32>) -> vec4<f32> {
  return bitcast<vec4<f32>>(bitcast<vec4<u32>>(x) ^ vec4<u32>(0x80000000u));
}
fn fsub4(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
  return a + negf4(b);
}

// Lane-wise isFiniteF: false for \xB1Inf and NaN, whose error terms are 0.
fn isFinite4(x: vec4<f32>) -> vec4<bool> {
  return (bitcast<vec4<u32>>(x) & vec4<u32>(0x7f800000u)) != vec4<u32>(0x7f800000u);
}

// Rounds v to stored f32s the compiler can't re-derive or re-fuse.
fn materialize4(v: vec4<f32>, threadSlot: u32) -> vec4<f32> {
  dekkerScratch4[threadSlot] = v;
  workgroupBarrier();
  return dekkerScratch4[threadSlot];
}

fn twoSum4Protected(a: vec4<f32>, b: vec4<f32>, threadSlot: u32) -> DD4 {
  let z = dekkerZero4();
  let ha = hide4(a, z);
  let hb = hide4(b, z);
  let s = materialize4(ha + hb, threadSlot);
  let v = hide4(fsub4(s, ha), z);
  let e = hide4(fsub4(ha, hide4(fsub4(s, v), z)), z) + hide4(fsub4(hb, v), z);
  return DD4(s, select(vec4<f32>(0.0), e, isFinite4(s)));
}

fn fastTwoSum4Protected(a: vec4<f32>, b: vec4<f32>, threadSlot: u32) -> DD4 {
  let z = dekkerZero4();
  let ha = hide4(a, z);
  let hb = hide4(b, z);
  let s = materialize4(ha + hb, threadSlot);
  let e = fsub4(hb, hide4(fsub4(s, ha), z));
  return DD4(s, select(vec4<f32>(0.0), e, isFinite4(s)));
}

// Four ddAddProtected at once.
fn ddAdd4Protected(a: DD4, b: DD4, threadSlot: u32) -> DD4 {
  let s = twoSum4Protected(a.hi, b.hi, threadSlot);
  let loSum = a.lo + b.lo;
  return fastTwoSum4Protected(s.hi, s.lo + loSum, threadSlot);
}

// multiply.wgsl's bitSplit/twoProdBit, lane-wise.
fn bitSplit4(a: vec4<f32>, zero: vec4<u32>) -> DD4 {
  let hi = bitcast<vec4<f32>>(bitcast<vec4<u32>>(a) & vec4<u32>(0xFFFFF000u));
  return DD4(hi, hide4(fsub4(a, hi), zero));
}

fn twoProdBit4(a: vec4<f32>, b: vec4<f32>) -> DD4 {
  let z = dekkerZero4();
  let ha = hide4(a, z);
  let hb = hide4(b, z);
  let s = hide4(ha * hb, z);
  let as_ = bitSplit4(ha, z);
  let bs = bitSplit4(hb, z);
  let e1 = hide4(fsub4(s, hide4(as_.hi * bs.hi, z)), z);
  let e2 = hide4(fsub4(e1, hide4(as_.lo * bs.hi, z)), z);
  let e3 = hide4(fsub4(e2, hide4(as_.hi * bs.lo, z)), z);
  let e = fsub4(e3, hide4(as_.lo * bs.lo, z));
  return DD4(s, select(vec4<f32>(0.0), negf4(e), isFinite4(s)));
}

// Four ddMulProtected at once: p.lo materialized before it feeds the cross
// terms, p.hi before the final fastTwoSum \u2014 the two values ddMulRaw and
// ddMulProtected each force through memory.
fn ddMul4Protected(a: DD4, b: DD4, threadSlot: u32) -> DD4 {
  let p = twoProdBit4(a.hi, b.hi);
  let pLo = materialize4(p.lo, threadSlot);
  let crossAndLo = select(vec4<f32>(0.0), pLo + (a.hi * b.lo + a.lo * b.hi), isFinite4(p.hi));
  let rawHi = materialize4(p.hi, threadSlot);
  return fastTwoSum4Protected(rawHi, crossAndLo, threadSlot);
}

// A DD4 with every lane set to d.
fn dd4Splat(d: DD) -> DD4 {
  return DD4(vec4<f32>(d.hi), vec4<f32>(d.lo));
}

// Lane i of v, for an i known only at runtime: a chain of selects, never
// v[i]. Under D3D (FXC, measured on WARP) a runtime-indexed vector read came
// back NaN in every lane as soon as any lane held Inf or NaN \u2014 the indexing
// mixes all four lanes arithmetically, and Inf * 0 is NaN. Selects only
// copy, so a lane gets exactly its own value.
fn lane4(v: vec4<f32>, i: u32) -> f32 {
  return select(select(select(v.x, v.y, i == 1u), v.z, i == 2u), v.w, i == 3u);
}

// Lane i of a DD4 as a DD.
fn dd4Lane(v: DD4, i: u32) -> DD {
  return DD(lane4(v.hi, i), lane4(v.lo, i));
}

// Four DDs as the lanes of a DD4.
fn dd4Of(a: DD, b: DD, c: DD, d: DD) -> DD4 {
  return DD4(vec4<f32>(a.hi, b.hi, c.hi, d.hi), vec4<f32>(a.lo, b.lo, c.lo, d.lo));
}

// v's four lanes summed, (x+z) + (y+w): two batched adds, four barriers.
fn dd4Sum(v: DD4, threadSlot: u32) -> DD {
  let z = vec4<f32>(0.0);
  let half = ddAdd4Protected(
    DD4(vec4<f32>(v.hi.xy, 0.0, 0.0), vec4<f32>(v.lo.xy, 0.0, 0.0)),
    DD4(vec4<f32>(v.hi.zw, 0.0, 0.0), vec4<f32>(v.lo.zw, 0.0, 0.0)),
    threadSlot,
  );
  let s = ddAdd4Protected(
    DD4(vec4<f32>(half.hi.x, z.yzw), vec4<f32>(half.lo.x, z.yzw)),
    DD4(vec4<f32>(half.hi.y, z.yzw), vec4<f32>(half.lo.y, z.yzw)),
    threadSlot,
  );
  return dd4Lane(s, 0u);
}
`;
    });
  var oo,
    to = ur(() => {
      oo = `// ddot: sum(x[i] * y[i]), double-double (Dekker). Same ILP=4 shape as
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
  var so,
    ao = ur(() => {
      so = `// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
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
  var no,
    io = ur(() => {
      no = `// daxpy: y := alpha * x + y, double-double (Dekker) f64 emulation of saxpy.
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
  var Ye,
    lo = ur(() => {
      Ye = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

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
  var fo,
    uo = ur(() => {
      fo = `// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs \u2014 exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
`;
    });
  var po,
    mo = ur(() => {
      po = `// idamax: returns index of element with largest absolute value (f64, double-double)
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
  var wo,
    co = ur(() => {
      wo = `// amax reduction (f64, double-double): collapses 2*WGS (value, index) pairs
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
  var go,
    ho = ur(() => {
      go = `// srot: x = c*x + s*y,  y = -s*x + c*y

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
  var yo,
    bo = ur(() => {
      yo = `// drot: x = c*x + s*y, y = -s*x + c*y \u2014 double-double (Dekker) f64 emulation
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
  var vo,
    xo = ur(() => {
      vo = `// srotm: applies modified Givens rotation H to vectors x and y.
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
  var Bo,
    ko = ur(() => {
      Bo = `// drotm: applies a modified Givens rotation H to vectors x and y \u2014 double-
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
  var $e,
    _o = ur(() => {
      $e = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  // q1 alone where the refinement would go through Inf - Inf or 0 * Inf: a
  // zero divisor, an infinite or NaN quotient, or an infinite divisor (whose
  // quotient is exactly 0 or NaN) \u2014 the IEEE f32 result is already exact.
  let direct = bIsZero || !isFiniteF(q1) || !isFiniteF(b.hi);
  return DD(select(refined.hi, q1, direct), select(refined.lo, 0.0, direct));
}
`;
    });
  var Eo,
    Ao = ur(() => {
      Eo = `// Requires f64/dekker.wgsl concatenated first for the DD struct, and
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
  // sqrt(+Inf) = +Inf and sqrt(NaN or negative) = NaN are exact as x0 \u2014
  // refining them would go through Inf - Inf.
  let direct = isZero || !isFiniteF(x0);
  return DD(select(result.hi, x0, direct), select(result.lo, 0.0, direct));
}
`;
    });
  var So,
    Lo = ur(() => {
      So = `// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
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
  var Go,
    Do = ur(() => {
      Go = `// scaledSumF64 reduction: collapses dnrm2.wgsl's 2*WGS (big, medium, small,
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

// v \xB7 2^e by editing the exponent bits: exact, and nothing for a compiler to
// fold. Not ldexp(): HLSL has no exact one \u2014 it's defined as v * 2^e, and
// 2^-152 is below f32's range, so the product can come out 0 (snrm2/dnrm2
// dropped their medium sums that way on D3D12 WARP). Zero and results below
// f32's normal range give a signed 0, overflow a signed Inf; Inf and NaN pass
// through. Same as reduction/scaledSum.wgsl's.
fn ldexpBits(v: f32, e: i32) -> f32 {
  let bits = bitcast<u32>(v);
  let sign = bits & 0x80000000u;
  let ev = i32((bits >> 23u) & 0xffu);
  if (ev == 255) { return v; }
  let en = ev + e;
  if (ev == 0 || en <= 0) { return bitcast<f32>(sign); }
  if (en >= 255) { return bitcast<f32>(sign | 0x7f800000u); }
  return bitcast<f32>((bits & 0x807fffffu) | (u32(en) << 23u));
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
  // exponent shift (ldexpBits). Never as (amed\xB7SBIG)\xB7SBIG: a compiler may fold that into
  // amed\xB7(SBIG\xB7SBIG), and the constant 2^-152 underflows f32 to 0 (it did,
  // on NVIDIA/Vulkan). Not via sqrt(amed) squared either: the DD sqrt is
  // markedly less accurate on some backends. If the scaled value underflows,
  // medium was below big's rounding anyway (big's smallest square is 2^-52).
  let medInBig = DD(ldexpBits(t.med.hi, SBIG_SQ_EXP), ldexpBits(t.med.lo, SBIG_SQ_EXP));
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
  var Oe,
    No = ur(() => {
      Oe = `// reduce_partials: y[i] = alpha * \u03A3_c partial[c*n + i] + beta * y[i]
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
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let acc = select(params.alpha * s, 0.0, params.alpha == 0.0);
    y[yi] = select(acc, acc + params.beta * y[yi], params.beta != 0.0);
  }
}
`;
    });
  var Po,
    Io = ur(() => {
      Po = `// sgemv_n: y = alpha * A * x + beta * y  (A is m\xD7n row-major, no-transpose)
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
      // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
      // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
      let acc = select(params.alpha * scratch[0], 0.0, params.alpha == 0.0);
      y[yi] = select(acc, acc + params.beta * y[yi], params.beta != 0.0);
    }
    // All 64 threads must agree before the next row reuses scratch[].
    workgroupBarrier();
  }
}
`;
    });
  var Ro,
    Mo = ur(() => {
      Ro = `// sgemv_t: y = alpha * A^T * x + beta * y  (A is m\xD7n row-major, transposed)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

// Reference BLAS (and stdlib) runs this transposed product column by column
// and skips a column whose x entry is 0, so 0 \xB7 Infinity or 0 \xB7 NaN in that
// column of A never happens: a term with x = \xB10 is exactly 0 here.
// A is zeroed where x is (not the product selected away \u2014 measured 2x slower
// in strmv_t), making the term 0 \xB7 0.
fn term(a: f32, xv: f32) -> f32 {
  return select(a, 0.0, isZeroBits(xv)) * xv;
}

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
    acc0 += term(A[ j       * params.lda + col], x[ j       * params.incx]);
    acc1 += term(A[(j + 1u) * params.lda + col], x[(j + 1u) * params.incx]);
    acc2 += term(A[(j + 2u) * params.lda + col], x[(j + 2u) * params.incx]);
    acc3 += term(A[(j + 3u) * params.lda + col], x[(j + 3u) * params.incx]);
    j += 4u;
  }
  while (j < jEnd) {
    acc0 += term(A[j * params.lda + col], x[j * params.incx]);
    j += 1u;
  }
  let sum = (acc0 + acc1) + (acc2 + acc3);

  if (params.direct == 1u) {
    let yi = col * params.incy;
    // BLAS beta==0 semantics: y is written, not accumulated \u2014 must not read y.
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let acc = select(params.alpha * sum, 0.0, params.alpha == 0.0);
    out[yi] = select(acc, acc + params.beta * out[yi], params.beta != 0.0);
  } else {
    out[wid.y * params.n + col] = sum;
  }
}
`;
    });
  var le,
    To = ur(() => {
      le = `// gather_strided: dst[i] = src[i * inc], i < n
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
  var Ho,
    jo = ur(() => {
      Ho = `// ssymv (pass 1 of 2): y = alpha * A * x + beta * y, A n\xD7n symmetric with only
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
  var Co,
    Fo = ur(() => {
      Co = `// strmv: y = A * x \u2014 strmv's no-transpose path (transpose runs strmv_t.wgsl).
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
  var Oo,
    Wo = ur(() => {
      Oo = `// strmv_t: y = A^T * x for triangular A \u2014 strmv's transpose path, in the
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

fn term(j: u32, i: u32, ic: u32, iOK: bool) -> f32 {
  let inRange = select(j <= i, j >= i, params.uplo == 0u);
  var a = A[j * params.lda + ic];
  if (params.diag == 1u && j == i) { a = 1.0; }
  let xv = x[j * params.incx];
  // Reference BLAS (and stdlib) runs this transposed product column by column
  // and skips a column whose x entry is 0, so 0 \xB7 Infinity or 0 \xB7 NaN in that
  // column of A never happens: A is zeroed where x is, making the term 0 \xB7 0
  // (selecting the product away instead measured ~2x slower).
  a = select(a, 0.0, isZeroBits(xv));
  return select(0.0, a * xv, inRange && iOK);
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
  var Je,
    Ko = ur(() => {
      Je = `// strsv_invert_block: computes the explicit inverse of every BLOCK_SIZE \xD7
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
  var zo,
    qo = ur(() => {
      zo = `// strsv_step: one block of the blocked triangular solve, in a single
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

// xr[c] as row r's term of Ainv \xB7 xr, or 0 at the inverse's structural zeros
// (c > r for a lower-triangular inverse, c < r for upper): those must add
// exactly 0, where 0 \xB7 Inf or 0 \xB7 NaN from an Infinity or NaN in x would
// otherwise reach rows the true solve never touches.
fn solveTerm(r: u32, c: u32, lowerInv: bool) -> f32 {
  return select(0.0, xr[c], select(c >= r, c <= r, lowerInv));
}

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

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
    // Forward solves update the rows after the block, so their inverse is
    // lower triangular; backward ones (rangeStart = 0) upper.
    let lowerInv = params.rangeStart == params.blockEnd;
    for (var u = 0u; u < SPAN; u += 4u) {
      let c = q * SPAN + u;
      a0 += Ainv[ainvBase + c * BLOCK_SIZE + r]        * solveTerm(r, c, lowerInv);
      a1 += Ainv[ainvBase + (c + 1u) * BLOCK_SIZE + r] * solveTerm(r, c + 1u, lowerInv);
      a2 += Ainv[ainvBase + (c + 2u) * BLOCK_SIZE + r] * solveTerm(r, c + 2u, lowerInv);
      a3 += Ainv[ainvBase + (c + 3u) * BLOCK_SIZE + r] * solveTerm(r, c + 3u, lowerInv);
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
  // Transposed update: reference BLAS (and stdlib) skips the column of a
  // solved unknown that is 0, so 0 \xB7 Infinity or 0 \xB7 NaN never happens \u2014 A
  // is zeroed where xs is, making the term 0 \xB7 0.
  if (params.trans != 0u) {
    // A[j,i]: rows fastest across lanes, so at each j consecutive lanes read
    // consecutive i \u2014 coalesced.
    let r = tid % TILE_ROWS;
    let q = tid / TILE_ROWS;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let col = params.blockStart * params.lda + i;
    for (var u = 0u; u < SPAN; u += 4u) {
      let j = q * SPAN + u;
      a0 += select(0.0, A[col + min(j, blockLen - 1u) * params.lda], j < blockLen && !isZeroBits(xs[j])) * xs[j];
      a1 += select(0.0, A[col + min(j + 1u, blockLen - 1u) * params.lda], j + 1u < blockLen && !isZeroBits(xs[j + 1u])) * xs[j + 1u];
      a2 += select(0.0, A[col + min(j + 2u, blockLen - 1u) * params.lda], j + 2u < blockLen && !isZeroBits(xs[j + 2u])) * xs[j + 2u];
      a3 += select(0.0, A[col + min(j + 3u, blockLen - 1u) * params.lda], j + 3u < blockLen && !isZeroBits(xs[j + 3u])) * xs[j + 3u];
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
  var Qe,
    Vo = ur(() => {
      Qe = `// scatter_strided: dst[i * inc] = src[i], i < n \u2014 the inverse of
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
  var rt,
    Uo = ur(() => {
      rt = `// strsm_small: the whole triangular solve in one dispatch when the order
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
  skipZero: u32, // 1 = reference BLAS's zero-unknown skip (strsv; see solveDiv)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

// skipZero (strsv, when the solve is transposed in the row-major frame \u2014
// the column-by-column form of reference BLAS and stdlib): an unknown whose
// value is 0 before the division stays 0 (no division, so a 0 or NaN diagonal
// can't reach it), and its column's updates are skipped, so 0 \xB7 Infinity or
// 0 \xB7 NaN there never happens.
fn solveDiv(v: f32, d: f32) -> f32 {
  return select(v / d, 0.0, isZeroBits(v));
}
fn mulSkip(l: f32, x: f32) -> f32 {
  return select(l, 0.0, isZeroBits(x)) * x; // l zeroed where x is: 0 \xB7 0
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
    // skipZero is uniform, so the checked arithmetic is a separate branch:
    // per-operation selects cost strsv up to 15% at small n (and strsm, which
    // never skips, too).
    var x0: f32;
    var x1: f32;
    var x2: f32;
    var x3: f32;
    if (params.skipZero == 1u) {
      x0 = solveDiv(chunkVals[slot], L[c0]);
      x1 = solveDiv(chunkVals[slot + 1u] - mulSkip(L[c0 + 1u], x0), L[c1]);
      x2 = solveDiv(chunkVals[slot + 2u] - mulSkip(L[c0 + 2u], x0) - mulSkip(L[c1 + 1u], x1), L[c2]);
      x3 = solveDiv(chunkVals[slot + 3u] - mulSkip(L[c0 + 3u], x0) - mulSkip(L[c1 + 2u], x1) - mulSkip(L[c2 + 1u], x2), L[c3]);
    } else {
      x0 = chunkVals[slot] / L[c0];
      x1 = (chunkVals[slot + 1u] - L[c0 + 1u] * x0) / L[c1];
      x2 = (chunkVals[slot + 2u] - L[c0 + 2u] * x0 - L[c1 + 1u] * x1) / L[c2];
      x3 = (chunkVals[slot + 3u] - L[c0 + 3u] * x0 - L[c1 + 2u] * x1 - L[c2 + 1u] * x2) / L[c3];
    }
    if (i >= j && i < j + CHUNK) {
      xi = select(select(x3, x2, i == j + 2u), select(x1, x0, i == j), i < j + 2u);
    } else if (i >= j + CHUNK) {
      let d = i - j;
      if (params.skipZero == 1u) {
        b = b - mulSkip(L[c0 + d], x0) - mulSkip(L[c1 + d - 1u], x1) - mulSkip(L[c2 + d - 2u], x2) - mulSkip(L[c3 + d - 3u], x3);
      } else {
        b = b - L[c0 + d] * x0 - L[c1 + d - 1u] * x1 - L[c2 + d - 2u] * x2 - L[c3 + d - 3u] * x3;
      }
    }
  }

  if (live) {
    B[bIdx] = xi;
    if (params.xLd != 0u) { X[orig(i) * params.xLd + rhs] = xi; }
  }
}
`;
    });
  var Xo,
    Zo = ur(() => {
      Xo = `// sger: A := alpha * x * y^T + A  (rank-1 update, A is m\xD7n general/dense)

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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    // Reference BLAS (and stdlib) skips a row whose x entry is 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (ger) or reads the
    // transpose (syr, syr2), which is the column BLAS skips there.
    if (isZeroBits(x[row * params.incx])) { continue; }
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
  var $o,
    Yo = ur(() => {
      $o = `// dger: A := alpha * x * y^T + A, double-double (Dekker) f64 emulation of
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN (seen on NVIDIA/Mesa
// in the double-double kernels) \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

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
    // Reference BLAS (and stdlib) skips a row whose x entry is 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (dger) or reads the
    // transpose (dsyr, dsyr2), which is the column BLAS skips there.
    // The arithmetic still runs (its barriers stay uniform); only the
    // writes are skipped.
    let keep = !(isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]));

    for (var iter = 0u; iter < mainIters; iter++) {
      let col = lid.x + iter * WGS;
      let idx = row_base + col;
      let iy = col * params.y_inc;
      let prod = ddMulProtected(xi, DD(yHi[iy], yLo[iy]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      if (keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = n_floor + lid.x;
      let valid = col < params.n;
      let idx = select(0u, row_base + col, valid);
      let iy = select(0u, col * params.y_inc, valid);
      let prod = ddMulProtected(xi, DD(yHi[iy], yLo[iy]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid && keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var Qo,
    Jo = ur(() => {
      Qo = `// ssyr: A := alpha * x * x^T + A  (symmetric rank-1 update)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    // Reference BLAS (and stdlib) skips a row whose x entry is 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (ger) or reads the
    // transpose (syr, syr2), which is the column BLAS skips there.
    if (isZeroBits(x[row * params.incx])) { continue; }
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
  var ea,
    ra = ur(() => {
      ea = `// dsyr: A := alpha * x * x^T + A, double-double (Dekker) f64 emulation of
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN (seen on NVIDIA/Mesa
// in the double-double kernels) \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

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
    // Reference BLAS (and stdlib) skips a row whose x entry is 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (dger) or reads the
    // transpose (dsyr, dsyr2), which is the column BLAS skips there.
    // The arithmetic still runs (its barriers stay uniform); only the
    // writes are skipped.
    let keep = !(isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]));

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
      if (keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let col = range_floor + lid.x;
      let valid = col < colEnd;
      let idx = select(0u, row_base + col, valid);
      let ic = select(0u, col * params.incx, valid);
      let prod = ddMulProtected(xi, DD(xHi[ic], xLo[ic]), lid.x);
      let result = ddAddProtected(prod, DD(AHi[idx], ALo[idx]), lid.x);
      if (valid && keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var oa,
    ta = ur(() => {
      oa = `// ssyr2: A := alpha * x * y^T + alpha * y * x^T + A  (symmetric rank-2 update)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
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
    // Reference BLAS (and stdlib) skips a row whose x and y entries are both 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (ger) or reads the
    // transpose (syr, syr2), which is the column BLAS skips there.
    if (isZeroBits(x[row * params.incx]) && isZeroBits(y[row * params.incy])) { continue; }
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
  var sa,
    aa = ur(() => {
      sa = `// dsyr2: A := alpha * x * y^T + alpha * y * x^T + A, double-double (Dekker)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v != 0.0\` can come out false for NaN (seen on NVIDIA/Mesa
// in the double-double kernels) \u2014 and a NaN entry must not skip its row.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

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
    // Reference BLAS (and stdlib) skips a row whose x and y entries are both 0 \u2014 leaving A's
    // row as it is, even where the other vector holds \xB1Infinity or NaN that
    // Infinity \xB7 0 would turn into NaN. Row here is the row-major frame's row:
    // for column-major A the routine swaps the vectors (dger) or reads the
    // transpose (dsyr, dsyr2), which is the column BLAS skips there.
    // The arithmetic still runs (its barriers stay uniform); only the
    // writes are skipped.
    let keep = !(isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]) && isZeroBits(yHi[iy]) && isZeroBits(yLo[iy]));

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

    // Four column strides per batched op (f64/utils/batch.wgsl): lane l
    // takes iteration 4g + l \u2014 10 barriers per four elements, not one.
    for (var g = 0u; g < mainIters / 4u; g++) {
      let col = colStart + lid.x + g * 4u * WGS;
      let idx = row_base + col;
      let jx = col * params.incx;
      let jy = col * params.incy;
      let sx = WGS * params.incx;
      let sy = WGS * params.incy;
      let yv = dd4Of(
        DD(yHi[jy], yLo[jy]),
        DD(yHi[jy + sy], yLo[jy + sy]),
        DD(yHi[jy + 2u * sy], yLo[jy + 2u * sy]),
        DD(yHi[jy + 3u * sy], yLo[jy + 3u * sy]),
      );
      let xv = dd4Of(
        DD(xHi[jx], xLo[jx]),
        DD(xHi[jx + sx], xLo[jx + sx]),
        DD(xHi[jx + 2u * sx], xLo[jx + 2u * sx]),
        DD(xHi[jx + 3u * sx], xLo[jx + 3u * sx]),
      );
      let av = dd4Of(
        DD(AHi[idx], ALo[idx]),
        DD(AHi[idx + WGS], ALo[idx + WGS]),
        DD(AHi[idx + 2u * WGS], ALo[idx + 2u * WGS]),
        DD(AHi[idx + 3u * WGS], ALo[idx + 3u * WGS]),
      );
      let prod1 = ddMul4Protected(dd4Splat(xi), yv, lid.x);
      let prod2 = ddMul4Protected(dd4Splat(yi), xv, lid.x);
      let result = ddAdd4Protected(ddAdd4Protected(prod1, prod2, lid.x), av, lid.x);
      if (keep) {
        AHi[idx] = result.hi.x;
        ALo[idx] = result.lo.x;
        AHi[idx + WGS] = result.hi.y;
        ALo[idx + WGS] = result.lo.y;
        AHi[idx + 2u * WGS] = result.hi.z;
        ALo[idx + 2u * WGS] = result.lo.z;
        AHi[idx + 3u * WGS] = result.hi.w;
        ALo[idx + 3u * WGS] = result.lo.w;
      }
    }

    // The last mainIters % 4 full iterations, one at a time.
    for (var iter = mainIters / 4u * 4u; iter < mainIters; iter++) {
      let col = colStart + lid.x + iter * WGS;
      let idx = row_base + col;
      let jc_x = col * params.incx;
      let jc_y = col * params.incy;
      let prod1 = ddMulProtected(xi, DD(yHi[jc_y], yLo[jc_y]), lid.x);
      let prod2 = ddMulProtected(yi, DD(xHi[jc_x], xLo[jc_x]), lid.x);
      let sum1 = ddAddProtected(prod1, prod2, lid.x);
      let result = ddAddProtected(sum1, DD(AHi[idx], ALo[idx]), lid.x);
      if (keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
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
      if (valid && keep) {
        AHi[idx] = result.hi;
        ALo[idx] = result.lo;
      }
    }
  }
}
`;
    });
  var na,
    ia = ur(() => {
      na = `// dgemv_n: y := alpha * A * x + beta * y, double-double (Dekker) f64
// emulation of sgemv_n (matrix-vector product, no transpose). A, x, y,
// alpha, and beta are each split into an f32 (hi, lo) pair; WGSL has no f64
// type. Same one-workgroup-per-output-row shape as sgemv_n.wgsl (grid-stride
// over rows), but the per-row dot product is reduced via a full
// within-workgroup DD tree reduction \u2014 the same reduction ddot.wgsl uses to
// combine 64 lanes down to one. The column loop runs four strides per
// batched op (ddMul4Protected/ddAdd4Protected), since the protected ops'
// barriers, not memory, bound it. Since each row is handled by exactly one
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
    // Four column strides per batched op (f64/utils/batch.wgsl): lane l
    // takes iteration 4g + l, one barrier per four products.
    var acc4 = DD4(vec4<f32>(0.0), vec4<f32>(0.0));
    for (var g = 0u; g < mainIters / 4u; g++) {
      let j = lid.x + g * 4u * WGS;
      let ia = row_base + j;
      let ix = j * params.incx;
      let xs = WGS * params.incx;
      let a = dd4Of(
        DD(AHi[ia], ALo[ia]),
        DD(AHi[ia + WGS], ALo[ia + WGS]),
        DD(AHi[ia + 2u * WGS], ALo[ia + 2u * WGS]),
        DD(AHi[ia + 3u * WGS], ALo[ia + 3u * WGS]),
      );
      let xv = dd4Of(
        DD(xHi[ix], xLo[ix]),
        DD(xHi[ix + xs], xLo[ix + xs]),
        DD(xHi[ix + 2u * xs], xLo[ix + 2u * xs]),
        DD(xHi[ix + 3u * xs], xLo[ix + 3u * xs]),
      );
      acc4 = ddAdd4Protected(acc4, ddMul4Protected(a, xv, lid.x), lid.x);
    }
    var acc = DD(0.0, 0.0);
    // Uniform (params only), so the barriers inside stay legal; skipped
    // when there was no batch, where it would only add barriers.
    if (mainIters >= 4u) { acc = dd4Sum(acc4, lid.x); }

    // The last mainIters % 4 full iterations, one at a time.
    for (var iter = mainIters / 4u * 4u; iter < mainIters; iter++) {
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
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, dot, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));
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
  var ua,
    la = ur(() => {
      ua = `// dgemv_t: y := alpha * A^T * x + beta * y, double-double (Dekker) f64
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

fn isZero4(v: vec4<f32>) -> vec4<bool> {
  return (bitcast<vec4<u32>>(v) & vec4<u32>(0x7fffffffu)) == vec4<u32>(0u);
}

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

  // Four rows per batched op (f64/utils/batch.wgsl): lane l sums rows
  // j \u2261 l (mod 4) of each tile, one barrier per four products.
  var acc4 = DD4(vec4<f32>(0.0), vec4<f32>(0.0));

  let tiles = (jEnd - jStart) / WGS;
  for (var t = 0u; t < tiles; t++) {
    let base = jStart + t * WGS;
    // Cooperative load: all 64 threads fill xTile with x[base..base+WGS),
    // independent of col \u2014 safe regardless of whether this thread's column
    // is in range.
    let ix = (base + lid.x) * params.incx;
    xTile[lid.x] = DD(xHi[ix], xLo[ix]);
    workgroupBarrier();

    for (var j = 0u; j < WGS; j += 4u) {
      let ia = (base + j) * params.lda + safeCol;
      let a = dd4Of(
        DD(AHi[ia], ALo[ia]),
        DD(AHi[ia + params.lda], ALo[ia + params.lda]),
        DD(AHi[ia + 2u * params.lda], ALo[ia + 2u * params.lda]),
        DD(AHi[ia + 3u * params.lda], ALo[ia + 3u * params.lda]),
      );
      let xv = dd4Of(xTile[j], xTile[j + 1u], xTile[j + 2u], xTile[j + 3u]);
      // Reference BLAS (and stdlib) runs this transposed product column by column
      // and skips a column whose x entry is 0, so 0 \xB7 Infinity or 0 \xB7 NaN in that
      // column of A never happens: a term with x = \xB10 is exactly 0 here.
      // A is zeroed where x is, so the product is 0 \xB7 0.
      let xZero = isZero4(xv.hi) & isZero4(xv.lo);
      let aKept = DD4(select(a.hi, vec4<f32>(0.0), xZero), select(a.lo, vec4<f32>(0.0), xZero));
      acc4 = ddAdd4Protected(acc4, ddMul4Protected(aKept, xv, lid.x), lid.x);
    }
    workgroupBarrier();
  }
  var acc = dd4Sum(acc4, lid.x);

  // Remainder rows (only the last chunk, when m isn't a multiple of WGS):
  // the count is the same for every thread regardless of col, so this loop
  // is already barrier-safe without a second tiling pass.
  for (var row = jStart + tiles * WGS; row < jEnd; row++) {
    let ia  = row * params.lda + safeCol;
    let ix  = row * params.incx;
    let xZero = isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]); // see the tiled loop
    let a = DD(select(AHi[ia], 0.0, xZero), select(ALo[ia], 0.0, xZero));
    let prod = ddMulProtected(a, DD(xHi[ix], xLo[ix]), lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  // \`direct\` is uniform, but the protected ops still run on both paths (a
  // barrier under a uniform branch is legal; this keeps the write the only
  // divergent part).
  if (params.direct == 1u) {
    let alpha = DD(params.alphaHi, params.alphaLo);
    let beta  = DD(params.betaHi, params.betaLo);
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, acc, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));

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
  var Ke,
    fa = ur(() => {
      Ke = `// reduce_partials_f64: y[i] = alpha * \u03A3_c partial[c*n + i] + beta * y[i],
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
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, s, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));
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
  var ma,
    da = ur(() => {
      ma = `// dsymv: y := alpha * A * x + beta * y, double-double (Dekker) f64 emulation
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
    // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
    // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
    let scaledRaw = ddMulProtected(alpha, dot, lid.x);
    let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
    let scaled = DD(select(scaledRaw.hi, 0.0, alphaIsZero), select(scaledRaw.lo, 0.0, alphaIsZero));
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
  var ca,
    pa = ur(() => {
      ca = `// dsymv_tile (pass 1 of 2): y = alpha * A * x + beta * y, double-double
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
// of dekkerScratch4): out-of-range and off-triangle elements are masked to
// 0, and every reduction step runs on every thread, with only the writes
// conditional. Each thread's four elements go through the batched ops
// (f64/utils/batch.wgsl), one barrier per four results \u2014 ~22 barriers a
// tile against ~46 with the scalar ops.

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
const LD: u32 = TILE + 1u;       // rowRed row stride (padded)

var<workgroup> xr: array<DD, 32>; // x over the tile's rows; reused for row sums
var<workgroup> xc: array<DD, 32>; // x over the tile's columns; reused for column sums
// TILE x (TILE+1): per-element row products, then (in place) the 8-way row
// and column partials \u2014 see partialIdx.
var<workgroup> rowRed: array<DD, 1056>;

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

fn xAt(i: u32) -> DD {
  let n = params.n;
  let ix = min(i, n - 1u) * params.incx;
  return ddMask(DD(xHi[ix], xLo[ix]), i < n);
}

struct Elem {
  stored: DD, // feeds its own row
  strict: DD, // also feeds its mirror (column)
}

// Tile element (r, tx), masked: out of range \u2192 0; on a diagonal tile only the
// stored triangle is stored, only its strict part strict.
fn loadElem(r0: u32, c0: u32, r: u32, tx: u32, diag: bool, lower: bool) -> Elem {
  let n = params.n;
  let gr = r0 + r;
  let gc = c0 + tx;
  let ia = min(gr, n - 1u) * params.lda + min(gc, n - 1u);
  let a = ddMask(DD(AHi[ia], ALo[ia]), gr < n && gc < n);
  return Elem(
    ddMask(a, !diag || select(tx >= r, tx <= r, lower)),
    ddMask(a, !diag || select(tx > r, tx < r, lower)),
  );
}

// Thread t's row partial goes to the first of the four rowRed slots it summed,
// its column partial to the second \u2014 both read only by the tree.
fn partialIdx(t: u32) -> u32 {
  return (t / 8u) * LD + (t % 8u) * 4u;
}

// Partial s of group g: row g's segment s (g < 32), or column g-32's from
// row-group s, i.e. thread s*32 + (g-32).
fn groupPart(g: u32, s: u32) -> DD {
  let colIdx = partialIdx(s * 32u + max(g, 32u) - 32u) + 1u;
  return rowRed[select(colIdx, g * LD + s * 4u, g < 32u)];
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
  let e0 = loadElem(r0, c0, ty, tx, diag, lower);
  let e1 = loadElem(r0, c0, ty + 8u, tx, diag, lower);
  let e2 = loadElem(r0, c0, ty + 16u, tx, diag, lower);
  let e3 = loadElem(r0, c0, ty + 24u, tx, diag, lower);
  let rowProd = ddMul4Protected(dd4Of(e0.stored, e1.stored, e2.stored, e3.stored), dd4Splat(xc[tx]), tid); // tile \xB7 x
  let colProd = ddMul4Protected(
    dd4Of(e0.strict, e1.strict, e2.strict, e3.strict),
    dd4Of(xr[ty], xr[ty + 8u], xr[ty + 16u], xr[ty + 24u]),
    tid,
  ); // tile\u1D40 \xB7 x
  rowRed[ty * LD + tx] = dd4Lane(rowProd, 0u);
  rowRed[(ty + 8u) * LD + tx] = dd4Lane(rowProd, 1u);
  rowRed[(ty + 16u) * LD + tx] = dd4Lane(rowProd, 2u);
  rowRed[(ty + 24u) * LD + tx] = dd4Lane(rowProd, 3u);
  workgroupBarrier();

  // Row partials (8 lanes per row, 4 columns each) and this thread's column
  // partial (its 4 rows), summed side by side: [r0+r1, r2+r3, c0+c1, c2+c3],
  // then [row, col].
  let base = partialIdx(tid);
  let pairs = ddAdd4Protected(
    dd4Of(rowRed[base], rowRed[base + 2u], dd4Lane(colProd, 0u), dd4Lane(colProd, 2u)),
    dd4Of(rowRed[base + 1u], rowRed[base + 3u], dd4Lane(colProd, 1u), dd4Lane(colProd, 3u)),
    tid,
  );
  let zero = DD(0.0, 0.0);
  let parts = ddAdd4Protected(
    dd4Of(dd4Lane(pairs, 0u), dd4Lane(pairs, 2u), zero, zero),
    dd4Of(dd4Lane(pairs, 1u), dd4Lane(pairs, 3u), zero, zero),
    tid,
  );
  // Every rowRed read above came before the adds' barriers, so the slots
  // can be overwritten now.
  rowRed[base] = dd4Lane(parts, 0u);      // row tid/8, segment tid%8
  rowRed[base + 1u] = dd4Lane(parts, 1u); // column tx, rows ty+8k
  workgroupBarrier();

  // Threads 0..31 sum row tid's 8 partials, 32..63 column (tid-32)'s 8 (one
  // per ty, i.e. from thread ty*32 + column); the rest add a throwaway group.
  let g = min(tid, 63u);
  let l1 = ddAdd4Protected(
    dd4Of(groupPart(g, 0u), groupPart(g, 1u), groupPart(g, 2u), groupPart(g, 3u)),
    dd4Of(groupPart(g, 4u), groupPart(g, 5u), groupPart(g, 6u), groupPart(g, 7u)),
    tid,
  );
  let l2 = ddAdd4Protected(
    dd4Of(dd4Lane(l1, 0u), dd4Lane(l1, 1u), zero, zero),
    dd4Of(dd4Lane(l1, 2u), dd4Lane(l1, 3u), zero, zero),
    tid,
  );
  let l3 = ddAdd4Protected(
    dd4Of(dd4Lane(l2, 0u), zero, zero, zero),
    dd4Of(dd4Lane(l2, 1u), zero, zero, zero),
    tid,
  );
  // xr/xc were last read before the first multiply's barrier.
  if (tid < 32u) { xr[tid] = dd4Lane(l3, 0u); }
  else if (tid < 64u) { xc[tid - 32u] = dd4Lane(l3, 0u); }
  workgroupBarrier();

  // Lanes tx of row ty == 0 write row tx's and column tx's sums.
  let rs = xr[tx];
  let cs = xc[tx];
  let both = dd4Lane(ddAdd4Protected(dd4Splat(rs), dd4Splat(cs), tid), 0u);
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
  var ha,
    wa = ur(() => {
      ha = `// dtrmv: y := op(A) * x, double-double (Dekker) f64 emulation of strmv
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

// Transposed products (params.trans = 1, in this row-major frame) are the ones
// reference BLAS (and stdlib) runs column by column, skipping a column whose x
// entry is 0 \u2014 so 0 \xB7 Infinity or 0 \xB7 NaN there never happens. A is zeroed
// where x is, making the term 0 \xB7 0.
fn skipZeroColumn(a: DD, ix: u32) -> DD {
  let skip = params.trans != 0u && isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]);
  return DD(select(a.hi, 0.0, skip), select(a.lo, 0.0, skip));
}

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
      let prod = ddMulProtected(skipZeroColumn(aVal, ix), DD(xHi[ix], xLo[ix]), lid.x);
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
      let prod = ddMulProtected(skipZeroColumn(aVal, ix), DD(xHi[ix], xLo[ix]), lid.x);
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
  var ba,
    ga = ur(() => {
      ba = `// dtrmv_t: y = A^T * x for triangular A, double-double (Dekker) f64
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

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
    // Reference BLAS (and stdlib) runs this transposed product column by column
    // and skips a column whose x entry is 0, so 0 \xB7 Infinity or 0 \xB7 NaN in that
    // column of A never happens: a term with x = \xB10 is exactly 0 here.
    let keep = inRange && !(isZeroBits(xHi[ix]) && isZeroBits(xLo[ix]));
    let term = DD(select(0.0, prod.hi, keep), select(0.0, prod.lo, keep));
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
  var xa,
    ya = ur(() => {
      xa = `// dtrsv_small: substitution over one 64-row diagonal block, double-double
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
// would add protected ops, not save barriers. (The per-column inversion
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
  skipZero: u32, // solve: 1 = reference BLAS's zero-unknown skip (see below)
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

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
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

  // L_ij for the next step is loaded at the end of this one, after \`a\`'s last
  // use, so its latency overlaps the step boundary. Not loaded a step ahead at
  // the top (\`let a = aNext; aNext = load(j + 1)\`, both alive at once): D3D12's
  // WARP ran DXC's code for that with \`a\` already holding the next step's
  // value \u2014 every n > 1 solved wrongly in Chrome on Windows, optimizer on or
  // off, while FXC's code was right (tests/browser/diagnostics/dd-loop.diag.js
  // isolates it). Loading in-step instead was ~13% slower for n <= 128.
  let jStart = select(0u, c0, inv);
  var aCur = loadA(rowBase + select(jStart, len - 1u - jStart, back) * params.aCs);
  for (var j = jStart; j < len; j++) {
    let a = aCur;

    // skipZero (dtrsv/strsv, when the solve is transposed in the row-major frame \u2014
    // the column-by-column form of reference BLAS and stdlib): an unknown whose
    // value is 0 before the division stays 0 (no division, so a 0 or NaN diagonal
    // can't reach it), and its column's updates are skipped, so 0 \xB7 Infinity or
    // 0 \xB7 NaN there never happens.
    let skip = params.skipZero == 1u;
    let candRaw = ddMulProtected(b, rinv, tid);
    let cand = ddSelect(candRaw, DD(0.0, 0.0), skip && isZeroBits(b.hi) && isZeroBits(b.lo));
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
    let aj = ddSelect(a, DD(0.0, 0.0), skip && isZeroBits(xj.hi) && isZeroBits(xj.lo));
    let nb = ddSubProtected(b, ddMulProtected(aj, xj, tid), tid);
    b = ddSelect(b, nb, i > j);
    let jn = min(j + 1u, len - 1u); // the last step reloads its own; unused
    aCur = loadA(rowBase + select(jn, len - 1u - jn, back) * params.aCs);
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
  var ka,
    va = ur(() => {
      ka = `// dtrsv_step: one block of the blocked triangular solve in a single
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

// xr[c] as row r's term of Ainv \xB7 xr, or 0 at the inverse's structural zeros
// (c > r for a lower-triangular inverse, c < r for upper): those must add
// exactly 0, where 0 \xB7 Inf or 0 \xB7 NaN from an Infinity or NaN in x would
// otherwise reach rows the true solve never touches.
fn solveTerm(r: u32, c: u32, lowerInv: bool) -> DD {
  return ddMask(xr[c], select(c >= r, c <= r, lowerInv));
}

// Row r's four quarter sums, every thread (the protected adds need it).
fn sumParts(r: u32, tid: u32) -> DD {
  return dd4Sum(
    dd4Of(part[r], part[BLOCK_SIZE + r], part[2u * BLOCK_SIZE + r], part[3u * BLOCK_SIZE + r]),
    tid,
  );
}

// \xB10 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like \`v == 0.0\` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
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
    let xb = q * SPAN;
    // Forward solves update the rows after the block, so their inverse is
    // lower triangular; backward ones (rangeStart = 0) upper.
    let lowerInv = params.rangeStart == params.blockEnd;
    var acc = ddMul4Protected(dd4Of(av[0], av[1], av[2], av[3]), dd4Of(solveTerm(r, xb, lowerInv), solveTerm(r, xb + 1u, lowerInv), solveTerm(r, xb + 2u, lowerInv), solveTerm(r, xb + 3u, lowerInv)), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[4], av[5], av[6], av[7]), dd4Of(solveTerm(r, xb + 4u, lowerInv), solveTerm(r, xb + 5u, lowerInv), solveTerm(r, xb + 6u, lowerInv), solveTerm(r, xb + 7u, lowerInv)), tid), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[8], av[9], av[10], av[11]), dd4Of(solveTerm(r, xb + 8u, lowerInv), solveTerm(r, xb + 9u, lowerInv), solveTerm(r, xb + 10u, lowerInv), solveTerm(r, xb + 11u, lowerInv)), tid), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[12], av[13], av[14], av[15]), dd4Of(solveTerm(r, xb + 12u, lowerInv), solveTerm(r, xb + 13u, lowerInv), solveTerm(r, xb + 14u, lowerInv), solveTerm(r, xb + 15u, lowerInv)), tid), tid);
    part[q * BLOCK_SIZE + r] = dd4Sum(acc, tid);
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
      // Reference BLAS (and stdlib) skips the column of a solved unknown that
      // is 0 in this transposed form, so 0 \xB7 Infinity or 0 \xB7 NaN never
      // happens: A is zeroed where xs is, making the term 0 \xB7 0.
      let xj = xs[min(j, BLOCK_SIZE - 1u)];
      av[u] = ddMask(DD(AHi[ia], ALo[ia]), j < blockLen && !(isZeroBits(xj.hi) && isZeroBits(xj.lo)));
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
  // xs index of term u: q + 4u (interleaved) or q\xB716 + u (blocked).
  let tr = params.trans != 0u;
  let x0 = select(q, q * SPAN, tr);
  let xd = select(SPLIT, 1u, tr);
  var acc = ddMul4Protected(dd4Of(av[0], av[1], av[2], av[3]), dd4Of(xs[x0], xs[x0 + xd], xs[x0 + 2u * xd], xs[x0 + 3u * xd]), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[4], av[5], av[6], av[7]), dd4Of(xs[x0 + 4u * xd], xs[x0 + 5u * xd], xs[x0 + 6u * xd], xs[x0 + 7u * xd]), tid), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[8], av[9], av[10], av[11]), dd4Of(xs[x0 + 8u * xd], xs[x0 + 9u * xd], xs[x0 + 10u * xd], xs[x0 + 11u * xd]), tid), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[12], av[13], av[14], av[15]), dd4Of(xs[x0 + 12u * xd], xs[x0 + 13u * xd], xs[x0 + 14u * xd], xs[x0 + 15u * xd]), tid), tid);
  part[q * TILE_ROWS + r] = dd4Sum(acc, tid);
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
  var _a,
    Ba = ur(() => {
      _a = `// dgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 double-double (Dekker)
// f64 emulation of sgemm_small.wgsl, same tile config and structure:
// BM=BN=32, BK=8, TM=TN=2, 256 threads. Used at every size \u2014 unlike sgemm,
// there is no large-tile tier (dgemm_large.wgsl measured ~2x slower; see dgemm.mjs).
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
const TN: u32 = 2u; // TM\xD7TN = 4: one DD4 of results per thread \u2014 the batched loop assumes it
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

  // The thread's TM\xD7TN = 2\xD72 results as one four-lane value, lane
  // resIdxM*TN + resIdxN, so each k-step is one batched multiply-add
  // (f64/utils/batch.wgsl): 5 barriers for the four products, not 20.
  var acc = DD4(vec4<f32>(0.0), vec4<f32>(0.0));

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
      let ia = threadRow * TM * BK + dotIdx;
      let ib = dotIdx * BN + threadCol * TN;
      let m0 = DD(AsHi[ia], AsLo[ia]);
      let m1 = DD(AsHi[ia + BK], AsLo[ia + BK]);
      let n0 = DD(BsHi[ib], BsLo[ib]);
      let n1 = DD(BsHi[ib + 1u], BsLo[ib + 1u]);
      acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(m0, m0, m1, m1), dd4Of(n0, n1, n0, n1), tid), tid);
    }

    workgroupBarrier();
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta = DD(params.betaHi, params.betaLo);
  let betaIsZero = params.betaHi == 0.0 && params.betaLo == 0.0;

  // C's four elements, lane resIdxM*TN + resIdxN (clamped in range).
  var cIdx: array<u32, 4>;
  for (var l = 0u; l < 4u; l++) {
    let row = blockRow + threadRow * TM + l / TN;
    let col = blockCol + threadCol * TN + l % TN;
    cIdx[l] = min(row, params.m - 1u) * params.ldc + min(col, params.n - 1u);
  }
  let cOld = dd4Of(
    DD(CHi[cIdx[0]], CLo[cIdx[0]]),
    DD(CHi[cIdx[1]], CLo[cIdx[1]]),
    DD(CHi[cIdx[2]], CLo[cIdx[2]]),
    DD(CHi[cIdx[3]], CLo[cIdx[3]]),
  );
  // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
  // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
  let scaledRaw = ddMul4Protected(dd4Splat(alpha), acc, tid);
  let alphaIsZero = params.alphaHi == 0.0 && params.alphaLo == 0.0;
  let scaled = DD4(select(scaledRaw.hi, vec4<f32>(0.0), alphaIsZero), select(scaledRaw.lo, vec4<f32>(0.0), alphaIsZero));
  // BLAS beta==0 semantics: C is written, not accumulated \u2014 select rather
  // than multiply so stale NaN/Inf in C can't survive as 0 * NaN.
  let betaTerm = ddMul4Protected(dd4Splat(beta), cOld, tid);
  let withBeta = ddAdd4Protected(scaled, betaTerm, tid);

  for (var l = 0u; l < 4u; l++) {
    let row = blockRow + threadRow * TM + l / TN;
    let col = blockCol + threadCol * TN + l % TN;
    // dgemmtr: tiles straddling the diagonal write only their triangle.
    // Gates the store only \u2014 the protected ops above ran for every thread,
    // keeping their barrier counts uniform.
    let inTriangle = params.uplo == 0u
      || (params.uplo == 1u && col <= row)
      || (params.uplo == 2u && col >= row);
    if (row < params.m && col < params.n && inTriangle) {
      // lane4, not withBeta.hi[l]: see batch.wgsl (an Inf/NaN in one lane
      // would otherwise turn the others NaN under D3D/FXC).
      CHi[cIdx[l]] = select(lane4(withBeta.hi, l), lane4(scaled.hi, l), betaIsZero);
      CLo[cIdx[l]] = select(lane4(withBeta.lo, l), lane4(scaled.lo, l), betaIsZero);
    }
  }
}
`;
    });
  var we,
    Aa = ur(() => {
      we = `// sgemm_small: C = alpha * op(A) * op(B) + beta * C \u2014 small-tile half of
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
  kTri:    u32, // strmm: 0 = dense; 1/2 = op(A) lower/upper, 3/4 = op(B) lower/upper; strsm: 5/6 = op(A) lower/upper by element (termOf)
}

@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

// kTri 5/6 (strsm's block inverses): op(A) is lower/upper triangular element
// by element, and a product past its diagonal (k > row for lower, k < row
// for upper) adds exactly 0 \u2014 the structural zero there times an Infinity or
// NaN in op(B) would otherwise be NaN, in rows the solve never touches.
// Only the kTri >= 5 copy of the dot loop calls it; every other mode runs
// the plain loop.
fn termOf(p: f32, k: u32, row: u32) -> f32 {
  return select(0.0, p, select(k >= row, k <= row, params.kTri == 5u));
}

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
  if (params.kTri == 1u || params.kTri == 5u) { kHi = min(kHi, blockRow + BM); }
  if (params.kTri == 2u || params.kTri == 6u) { kLo = blockRow; }
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
      if (params.kTri < 5u) {
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
        // kTri 5/6: the same loop, structural zeros masked (termOf) \u2014
        // kept apart so the plain loop has no per-product test.
        for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
          for (var i = 0u; i < TM; i++) {
            regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
          }
          for (var i = 0u; i < TN; i++) {
            regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
          }
          for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
            for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
              threadResults[resIdxM * TN + resIdxN] += termOf(regM[resIdxM] * regN[resIdxN], t * BK + dotIdx, blockRow + threadRow * TM + resIdxM);
            }
          }
        }
      }
    } else {
      if (params.kTri < 5u) {
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
      } else {
        // kTri 5/6: the same loop, structural zeros masked (termOf) \u2014
        // kept apart so the plain loop has no per-product test.
        for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
          for (var i = 0u; i < TM; i++) {
            regM[i] = As[dotIdx * BM + threadRow * TM + i];
          }
          for (var i = 0u; i < TN; i++) {
            regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
          }
          for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
            for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
              threadResults[resIdxM * TN + resIdxN] += termOf(regM[resIdxM] * regN[resIdxN], t * BK + dotIdx, blockRow + threadRow * TM + resIdxM);
            }
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
          // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
          // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
          let acc = select(params.alpha * threadResults[resIdxM * TN + resIdxN], 0.0, params.alpha == 0.0);
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`;
    });
  var he,
    Ea = ur(() => {
      he = `// sgemm_large: C = alpha * op(A) * op(B) + beta * C \u2014 large-tile half of
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
  kTri:    u32, // strmm: 0 = dense; 1/2 = op(A) lower/upper, 3/4 = op(B) lower/upper; strsm: 5/6 = op(A) lower/upper by element (termOf)
}

@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

// kTri 5/6 (strsm's block inverses): op(A) is lower/upper triangular element
// by element, and a product past its diagonal (k > row for lower, k < row
// for upper) adds exactly 0 \u2014 the structural zero there times an Infinity or
// NaN in op(B) would otherwise be NaN, in rows the solve never touches.
// Only the kTri >= 5 copy of the dot loop calls it; every other mode runs
// the plain loop.
fn termOf(p: f32, k: u32, row: u32) -> f32 {
  return select(0.0, p, select(k >= row, k <= row, params.kTri == 5u));
}

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
  if (params.kTri == 1u || params.kTri == 5u) { kHi = min(kHi, blockRow + BM); }
  if (params.kTri == 2u || params.kTri == 6u) { kLo = blockRow; }
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
      if (params.kTri < 5u) {
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
        // kTri 5/6: the same loop, structural zeros masked (termOf) \u2014
        // kept apart so the plain loop has no per-product test.
        for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
          for (var i = 0u; i < TM; i++) {
            regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
          }
          for (var i = 0u; i < TN; i++) {
            regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
          }
          for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
            for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
              threadResults[resIdxM * TN + resIdxN] += termOf(regM[resIdxM] * regN[resIdxN], t * BK + dotIdx, blockRow + threadRow * TM + resIdxM);
            }
          }
        }
      }
    } else {
      if (params.kTri < 5u) {
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
      } else {
        // kTri 5/6: the same loop, structural zeros masked (termOf) \u2014
        // kept apart so the plain loop has no per-product test.
        for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
          for (var i = 0u; i < TM; i++) {
            regM[i] = As[dotIdx * BM + threadRow * TM + i];
          }
          for (var i = 0u; i < TN; i++) {
            regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
          }
          for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
            for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
              threadResults[resIdxM * TN + resIdxN] += termOf(regM[resIdxM] * regN[resIdxN], t * BK + dotIdx, blockRow + threadRow * TM + resIdxM);
            }
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
          // alpha = 0: the product term is exactly 0, as reference BLAS never reads the
          // operands then \u2014 so NaN or \xB1Infinity in them can't reach the result.
          let acc = select(params.alpha * threadResults[resIdxM * TN + resIdxN], 0.0, params.alpha == 0.0);
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`;
    });
  var Sa,
    La = ur(() => {
      Sa = `// symmetrize: Adense := full dense expansion of a symmetric matrix stored
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
  var Ga,
    Da = ur(() => {
      Ga = `// triangularize: Adense := dense expansion of op(A) (A or A^T per \`trans\`),
// zero-filling the unstored triangle (exact for a matmul) so strmm can reuse
// sgemm's kernel unchanged. \`diag=1\` substitutes 1.0 on the diagonal; \`diag=2\`
// substitutes 0.0 \u2014 dtrmm's Lo half, where unit diagonal 1.0 = (1.0, 0.0).

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> Adense: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  ldd:   u32, // leading dimension of Adense
  uplo:  u32, // 0 = lower, 1 = upper
  trans: u32, // 0 = no-transpose (op(A) = A), 1 = transpose (op(A) = A^T)
  diag:  u32, // 0 = non-unit, 1 = unit (1.0), 2 = unit, Lo half (0.0)
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
    Adense[row * params.ldd + col] = select(A[row * params.lda + row], select(0.0, 1.0, params.diag == 1u), params.diag != 0u);
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
  var Ia,
    Na = ur(() => {
      Ia = `// block_transfer: gather/scatter/scatter-subtract between a tight (blockLen
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
  var Pa = {};
  ot(Pa, { routineShaders: () => br, shaderSources: () => fn });
  var br,
    fn,
    Ma = ur(() => {
      vt();
      Bt();
      At();
      Lt();
      Dt();
      Nt();
      Pt();
      Rt();
      jt();
      Ht();
      Ct();
      Ot();
      qt();
      Vt();
      Zt();
      Xt();
      Yt();
      $t();
      Qt();
      ro();
      eo();
      to();
      ao();
      io();
      lo();
      uo();
      mo();
      co();
      ho();
      bo();
      xo();
      ko();
      _o();
      Ao();
      Lo();
      Do();
      No();
      Io();
      Mo();
      To();
      jo();
      Fo();
      Wo();
      Ko();
      qo();
      Vo();
      Uo();
      Zo();
      Yo();
      Jo();
      ra();
      ta();
      aa();
      ia();
      la();
      fa();
      da();
      pa();
      wa();
      ga();
      ya();
      va();
      Ba();
      Aa();
      Ea();
      La();
      Da();
      Na();
      br = {};
      br.sscal = { sscal: kt };
      br.cscal = { cscal: _t };
      br.sswap = { sswap: Et };
      br.dswap = { dswap: St };
      br.saxpy = { saxpy: Gt };
      br.scopy = { scopy: It };
      br.dcopy = { dcopy: Mt };
      br.sdot = { sdot: Tt, "reduction/sum": Ze };
      br.sasum = { sasum: Ft, "reduction/sum": Ze };
      br.snrm2 = { snrm2: Wt, "reduction/scaledSum": Kt };
      br.isamax = { isamax: zt, "reduction/argmax": Ut };
      br.dasum = {
        "f64/dekker": zr,
        "f64/utils/abs": We,
        "f64/utils/add": Zr,
        dasum: Jt,
        "reduction/sumF64": Xe,
      };
      br.ddot = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        ddot: oo,
        "reduction/sumF64": Xe,
      };
      br.dscal = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        dscal: so,
      };
      br.daxpy = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        daxpy: no,
      };
      br.idamax = {
        "f64/dekker": zr,
        "f64/utils/abs": We,
        "f64/utils/greater": Ye,
        "f64/utils/equal": fo,
        idamax: po,
        "reduction/argmaxF64": wo,
      };
      br.srot = { srot: go };
      br.drot = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        drot: yo,
      };
      br.srotm = { srotm: vo };
      br.drotm = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        drotm: Bo,
      };
      br.dnrm2 = {
        "f64/dekker": zr,
        "f64/utils/abs": We,
        "f64/utils/greater": Ye,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/divide": $e,
        "f64/utils/sqrt": Eo,
        dnrm2: So,
        "reduction/scaledSumF64": Go,
      };
      br.sgemv = { sgemv_n: Po, sgemv_t: Ro, reduce_partials: Oe };
      br.ssymv = { ssymv: Ho, reduce_partials: Oe, gather_strided: le };
      br.strmv = {
        strmv: Co,
        strmv_t: Oo,
        reduce_partials: Oe,
        gather_strided: le,
      };
      br.strsv = {
        strsv_invert_block: Je,
        strsv_step: zo,
        scatter_strided: Qe,
        strsm_small: rt,
      };
      br.sger = { sger: Xo, gather_strided: le };
      br.dger = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        dger: $o,
        gather_strided: le,
      };
      br.ssyr = { ssyr: Qo, gather_strided: le };
      br.dsyr = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        dsyr: ea,
        gather_strided: le,
      };
      br.ssyr2 = { ssyr2: oa, gather_strided: le };
      br.dsyr2 = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/batch": Ae,
        dsyr2: sa,
        gather_strided: le,
      };
      br.dgemv = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/batch": Ae,
        dgemv_n: na,
        dgemv_t: ua,
        reduce_partials_f64: Ke,
      };
      br.dsymv = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/batch": Ae,
        dsymv: ma,
        dsymv_tile: ca,
        reduce_partials_f64: Ke,
      };
      br.dtrmv = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        dtrmv: ha,
        dtrmv_t: ba,
        reduce_partials_f64: Ke,
        gather_strided: le,
      };
      br.dtrsv = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/divide": $e,
        "f64/utils/batch": Ae,
        dtrsv_small: xa,
        dtrsv_step: ka,
        scatter_strided: Qe,
      };
      br.dgemm = {
        "f64/dekker": zr,
        "f64/utils/add": Zr,
        "f64/utils/multiply": $r,
        "f64/utils/batch": Ae,
        dgemm_small: _a,
      };
      br.dgemmtr = br.dgemm;
      br.dsyrk = br.dgemm;
      br.dsyr2k = br.dgemm;
      br.sgemm = { sgemm_small: we, sgemm_large: he };
      br.sgemmtr = { sgemm_small: we, sgemm_large: he };
      br.ssyrk = { sgemm_small: we, sgemm_large: he };
      br.ssyr2k = { sgemm_small: we, sgemm_large: he };
      br.ssymm = { sgemm_small: we, sgemm_large: he, symmetrize: Sa };
      br.strmm = { sgemm_small: we, sgemm_large: he, triangularize: Ga };
      br.strsm = {
        strsv_invert_block: Je,
        strsm_small: rt,
        block_transfer: Ia,
        sgemm_small: we,
        sgemm_large: he,
      };
      fn = Object.assign({}, ...Object.values(br));
    });
  var Bn = {};
  ot(Bn, {
    Complex32: () => ne,
    Complex32Array: () => Wr,
    Complex64: () => ie,
    Complex64Array: () => Ur,
    GpuMatrix: () => ir,
    GpuVector: () => Z,
    cleanup: () => ct,
    cscal: () => ja,
    dasum: () => Ua,
    daxpy: () => Oa,
    dcopy: () => qa,
    ddot: () => Za,
    dgemm: () => Bs,
    dgemmtr: () => _s,
    dgemv: () => gs,
    dger: () => ms,
    dnrm2: () => Ya,
    drot: () => rs,
    drotm: () => ts,
    dscal: () => Ha,
    dswap: () => Ca,
    dsymm: () => Ls,
    dsymv: () => bs,
    dsyr: () => cs,
    dsyr2: () => hs,
    dsyr2k: () => Es,
    dsyrk: () => As,
    dtrmm: () => Ss,
    dtrmv: () => ys,
    dtrsv: () => ks,
    gpuName: () => wt,
    idamax: () => Ja,
    init: () => pt,
    isamax: () => $a,
    randomFloat32Array: () => bt,
    randomFloat64Array: () => yt,
    randomTriangularFloat32Array: () => xt,
    sasum: () => Va,
    saxpy: () => Wa,
    scopy: () => Ka,
    sdot: () => za,
    sgemm: () => Ds,
    sgemmtr: () => Gs,
    sgemv: () => os,
    sger: () => ds,
    snrm2: () => Xa,
    srot: () => Qa,
    srotm: () => es,
    sscal: () => Ta,
    sswap: () => Fa,
    ssymm: () => Ps,
    ssymv: () => as,
    ssyr: () => ps,
    ssyr2: () => ws,
    ssyr2k: () => Is,
    ssyrk: () => Ns,
    strmm: () => Ms,
    strmv: () => ss,
    strsm: () => Ts,
    strsv: () => fs,
  });
  function st(r, a) {
    return a
      ? r.features.has("timestamp-query")
        ? { requiredFeatures: ["timestamp-query"] }
        : (console.warn(
            "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
          ),
          {})
      : {};
  }
  function it(r) {
    if (!nt(r)) return { querySet: null, passDescriptor: void 0 };
    let a = r.createQuerySet({ type: "timestamp", count: 2 });
    return {
      querySet: a,
      passDescriptor: {
        timestampWrites: {
          querySet: a,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      },
    };
  }
  function Tr(r, a, e) {
    if (!e) return null;
    let o = r.createBuffer({
      label: "timestamp-resolve",
      size: 16,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    a.resolveQuerySet(e, 0, 2, o, 0);
    let t = r.createBuffer({
      label: "timestamp-readback",
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    return (
      a.copyBufferToBuffer(o, 0, t, 0, 16),
      { tsReadBuffer: t, resolveBuffer: o, querySet: e }
    );
  }
  async function Y(r) {
    if (!r) return;
    let { tsReadBuffer: a, resolveBuffer: e, querySet: o } = r;
    await a.mapAsync(GPUMapMode.READ);
    let t = new BigInt64Array(a.getMappedRange().slice());
    return (
      a.unmap(),
      a.destroy(),
      e.destroy(),
      o.destroy(),
      Math.max(0, Number(t[1] - t[0])) / 1e6
    );
  }
  function f(...r) {
    r.flat().forEach((a) => a.destroy());
  }
  function ze(r, a, e) {
    let o = r.limits.maxStorageBufferBindingSize;
    if (a > o)
      throw new Error(
        `Buffer "${e}" needs ${a} bytes, exceeding this device's maxStorageBufferBindingSize (${o} bytes). The operands are too large for this device.`,
      );
  }
  function y(r, a, e = "blas-input", o = !1) {
    let t = a.byteLength;
    ze(r, t, e);
    let s = o
        ? GPUBufferUsage.STORAGE |
          GPUBufferUsage.COPY_DST |
          GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      i = r.createBuffer({ label: e, size: t, usage: s });
    return (r.queue.writeBuffer(i, 0, a), i);
  }
  function dr(r, a, e = "blas-storage", o = 0) {
    return (
      ze(r, a, e),
      r.createBuffer({ label: e, size: a, usage: GPUBufferUsage.STORAGE | o })
    );
  }
  function Or(r, a, e = "blas-result") {
    return (
      ze(r, a, e),
      r.createBuffer({
        label: e,
        size: a,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      })
    );
  }
  var Ks = 4,
    qs = 4 * 1024 * 1024,
    zs = 32 * 1024 * 1024,
    xe = new Map(),
    ut = new WeakMap();
  function Vs(r) {
    let a = xe.get(r);
    return (a || ((a = { bySize: new Map(), bytes: 0 }), xe.set(r, a)), a);
  }
  function I(r, a, e) {
    let o = e.size,
      t = Vs(r),
      s = t.bySize.get(o)?.pop();
    return (
      s
        ? (t.bytes -= o)
        : ((s = r.createBuffer({
            label: "blas-readback",
            size: o,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
          })),
          ut.set(s, r)),
      a.copyBufferToBuffer(e, 0, s, 0, o),
      s
    );
  }
  function ft(r) {
    let a = ut.get(r),
      e = a && xe.get(a),
      o = r.size,
      t = e?.bySize.get(o) ?? [];
    if (!e || o > qs || t.length >= Ks || e.bytes + o > zs) {
      r.destroy();
      return;
    }
    (t.push(r), e.bySize.set(o, t), (e.bytes += o));
  }
  function Ve(r) {
    let a = r === void 0 ? [...xe.keys()] : [r];
    for (let e of a) {
      let o = xe.get(e);
      if (o) {
        for (let t of o.bySize.values()) t.forEach((s) => s.destroy());
        xe.delete(e);
      }
    }
  }
  var ye = 16,
    lt = new WeakMap();
  function Us(r) {
    let a = lt.get(r);
    return (
      a ||
        ((a = r.createBuffer({
          label: "blas-vec4-fallback",
          size: ye,
          usage: GPUBufferUsage.STORAGE,
        })),
        lt.set(r, a)),
      a
    );
  }
  function Br(r, a) {
    let e = a instanceof GPUBuffer ? a : a.buffer,
      o = a instanceof GPUBuffer ? 0 : (a.offset ?? 0),
      t = a instanceof GPUBuffer ? a.size : (a.size ?? e.size - o),
      s = Math.floor(t / ye) * ye;
    return s < ye
      ? { buffer: Us(r), offset: 0, size: ye }
      : { buffer: e, offset: o, size: s };
  }
  function Er(r, a, e, o, t = 0) {
    if (a % 4 !== 0 || t % 4 !== 0) return !1;
    let s = r instanceof GPUBuffer ? r : r.buffer,
      i = r instanceof GPUBuffer ? 0 : (r.offset ?? 0),
      u = r instanceof GPUBuffer ? s.size : (r.size ?? s.size - i),
      n = Math.floor(u / ye) * 4;
    if (n <= 0) return !1;
    let d = t + (Math.max(e, 1) - 1) * a + (Math.max(o, 1) - 1);
    return Math.floor(d / 4) * 4 + 4 <= n;
  }
  function j(r, a, e = "blas-params") {
    let o = a.length * 4,
      t = Math.ceil(o / 16) * 16,
      s = new ArrayBuffer(t),
      i = new DataView(s);
    a.forEach(({ value: n, type: d }, l) => {
      let m = l * 4;
      if (d === "u32") i.setUint32(m, n, !0);
      else if (d === "i32") i.setInt32(m, n, !0);
      else if (d === "f32") i.setFloat32(m, n, !0);
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
    return (r.queue.writeBuffer(u, 0, s), u);
  }
  var ve = null,
    dt = !1,
    Ue = !1,
    ke = new Map(),
    Ge = new WeakMap(),
    fe = null,
    mt = ({ powerPreference: r, benchmark: a }) => `${r}::${a}`;
  async function pt({
    powerPreference: r = "high-performance",
    benchmark: a = !1,
    dumpShaders: e = !1,
  } = {}) {
    let o = { powerPreference: r, benchmark: a, dumpShaders: e },
      t = mt(o),
      s = ke.get(t);
    if (s) return s;
    if (ve)
      dt &&
        e !== Ue &&
        console.warn(
          `dumpShaders: ${e} was requested, but the WebGPU instance was already created with dumpShaders: ${Ue}. The first init() call fixes this for the process.`,
        );
    else if (typeof window > "u" && !globalThis.navigator?.gpu) {
      let { create: m, globals: w } = await import("webgpu");
      (Object.assign(globalThis, w),
        (ve = m(
          e
            ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
            : [],
        )),
        (dt = !0),
        (Ue = e));
    } else
      (e &&
        console.warn(
          "dumpShaders has no effect in the browser or Deno \u2014 see init()'s docs.",
        ),
        (ve = navigator.gpu));
    if (!ve) throw new Error("WebGPU not supported in this environment.");
    let i =
      (await ve.requestAdapter({ powerPreference: r })) ??
      (await ve.requestAdapter());
    if (!i) throw new Error("No WebGPU adapter found.");
    let n = [...(st(i, a).requiredFeatures ?? [])],
      d = await i.requestDevice({ requiredFeatures: n });
    d.addEventListener("uncapturederror", (m) => {
      console.error("Uncaptured GPU error:", m.error.message);
    });
    let l = n.includes("timestamp-query");
    return (
      Ge.set(d, { adapter: i, benchmark: l, options: o }),
      ke.set(t, d),
      fe || (fe = d),
      d
    );
  }
  function ct(r) {
    if (r === void 0) {
      Ve();
      for (let e of ke.values()) e.destroy();
      (ke.clear(), (fe = null));
      return;
    }
    let a = Ge.get(r);
    a &&
      (ke.delete(mt(a.options)),
      Ge.delete(r),
      Ve(r),
      r.destroy(),
      fe === r && (fe = ke.values().next().value ?? null));
  }
  function wt(r = fe) {
    let a = r && Ge.get(r);
    if (!a)
      throw new Error(
        "WebGPU adapter not initialized \u2014 call init() first.",
      );
    let { device: e, description: o } = a.adapter.info;
    return { description: o || "unknown", device: e || "unknown" };
  }
  function nt(r = fe) {
    return Ge.get(r)?.benchmark ?? !1;
  }
  function Be() {
    if (!fe)
      throw new Error(
        "WebGPU device not initialized \u2014 call init() first.",
      );
    return fe;
  }
  async function G(r, a = Float32Array) {
    let e = !1;
    try {
      await r.mapAsync(GPUMapMode.READ);
      let o = new a(r.getMappedRange().slice());
      return (r.unmap(), (e = !0), o);
    } finally {
      e ? ft(r) : r.destroy();
    }
  }
  var ht = (r, a) => (Number.isFinite(a) ? Math.fround(r - a) : 0),
    Zs = (r, a, e) =>
      Number.isFinite(r)
        ? Math.abs(a + e - r) <= Math.abs(r) * 9094947017729282e-28
        : Object.is(a, r);
  function V(r) {
    let a = r.length,
      e = new Float32Array(a),
      o = new Float32Array(a);
    for (let t = 0; t < a; t++) {
      let s = Math.fround(r[t]);
      ((e[t] = s), (o[t] = ht(r[t], s)));
    }
    return { hi: e, lo: o };
  }
  function Jr(r, a) {
    let e = r.length,
      o = new Float64Array(e);
    for (let t = 0; t < e; t++) o[t] = r[t] + a[t];
    return o;
  }
  function _r(r, a, e) {
    let o = Jr(r, a),
      t = Math.min(o.length, e.length);
    for (let s = 0; s < t; s++) {
      let i = e[s],
        u = Math.fround(i),
        n = ht(i, u);
      Object.is(r[s], u) && Object.is(a[s], n) && Zs(i, u, n) && (o[s] = i);
    }
    return o;
  }
  var ie = class {
      constructor(a, e) {
        ((this.re = a), (this.im = e));
      }
    },
    Ur = class extends Array {
      constructor(a) {
        if (a === void 0) {
          super();
          return;
        }
        if (typeof a == "number") {
          super(a);
          for (let o = 0; o < a; o++) this[o] = new ie(0, 0);
          return;
        }
        let e = Array.from(a);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof ie) {
            for (let o of e) {
              if (!(o instanceof ie))
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
            this.push(new ie(e[o], e[o + 1]));
          }
        }
      }
    };
  function _e(r, a = r.length) {
    let e = new Float32Array(a * 2);
    for (let o = 0; o < a; o++)
      ((e[o * 2] = r[o].re), (e[o * 2 + 1] = r[o].im));
    return e;
  }
  function Fe(r, a = r.length) {
    let e = new Float64Array(a),
      o = new Float64Array(a);
    for (let l = 0; l < a; l++) ((e[l] = r[l].re), (o[l] = r[l].im));
    let { hi: t, lo: s } = V(e),
      { hi: i, lo: u } = V(o),
      n = new Float32Array(a * 2),
      d = new Float32Array(a * 2);
    for (let l = 0; l < a; l++)
      ((n[l * 2] = t[l]),
        (n[l * 2 + 1] = i[l]),
        (d[l * 2] = s[l]),
        (d[l * 2 + 1] = u[l]));
    return { hi: n, lo: d };
  }
  function Ce(r, a) {
    let e = r.length / 2,
      o = new Float32Array(e),
      t = new Float32Array(e),
      s = new Float32Array(e),
      i = new Float32Array(e);
    for (let l = 0; l < e; l++)
      ((o[l] = r[l * 2]),
        (s[l] = r[l * 2 + 1]),
        (t[l] = a[l * 2]),
        (i[l] = a[l * 2 + 1]));
    let u = Jr(o, t),
      n = Jr(s, i),
      d = new Ur(e);
    for (let l = 0; l < e; l++) d[l] = new ie(u[l], n[l]);
    return d;
  }
  var ne = class {
      constructor(a, e) {
        ((this.re = Math.fround(a)), (this.im = Math.fround(e)));
      }
    },
    Wr = class extends Array {
      constructor(a) {
        if (a === void 0) {
          super();
          return;
        }
        if (typeof a == "number") {
          super(a);
          for (let o = 0; o < a; o++) this[o] = new ne(0, 0);
          return;
        }
        let e = Array.from(a);
        if ((super(), e.length !== 0)) {
          if (e[0] instanceof ne) {
            for (let o of e) {
              if (!(o instanceof ne))
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
            this.push(new ne(e[o], e[o + 1]));
          }
        }
      }
    };
  var Z = class r {
    constructor(a, e, o = Float32Array, t = null, s = null) {
      ((this._buf = a),
        (this._loBuf = t),
        (this.length = e),
        (this.dtype = o),
        (this.device = s ?? Be()));
    }
    static from(a, e) {
      let o = a instanceof GPUDevice,
        t = o ? a : Be(),
        s = o ? e : a;
      if (s instanceof Float64Array) {
        let { hi: u, lo: n } = V(s),
          d = y(t, u, "gpu-vector-f64-hi", !0),
          l = y(t, n, "gpu-vector-f64-lo", !0);
        return new r(d, s.length, Float64Array, l, t);
      }
      if (s instanceof Wr) {
        let u = y(t, _e(s), "gpu-vector-complex32", !0);
        return new r(u, s.length, Wr, null, t);
      }
      if (s instanceof Ur) {
        let { hi: u, lo: n } = Fe(s),
          d = y(t, u, "gpu-vector-complex64-hi", !0),
          l = y(t, n, "gpu-vector-complex64-lo", !0);
        return new r(d, s.length, Ur, l, t);
      }
      if (!(s instanceof Float32Array))
        throw new Error(
          "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      let i = y(t, s, "gpu-vector", !0);
      return new r(i, s.length, s.constructor, null, t);
    }
    async read() {
      let a = this.device,
        e = a.createCommandEncoder(),
        o = I(a, e, this._buf);
      if ((a.queue.submit([e.finish()]), this.dtype === Wr))
        return new Wr(await G(o, Float32Array));
      if (!this._loBuf) return G(o, this.dtype);
      let t = a.createCommandEncoder(),
        s = I(a, t, this._loBuf);
      a.queue.submit([t.finish()]);
      let [i, u] = await Promise.all([G(o, Float32Array), G(s, Float32Array)]);
      return this.dtype === Ur ? Ce(i, u) : Jr(i, u);
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  var ir = class r {
    constructor(
      a,
      e,
      o,
      t,
      s = null,
      i = "row-major",
      u = null,
      n = Float32Array,
    ) {
      ((this._buf = a),
        (this._loBuf = s),
        (this.rows = e),
        (this.cols = o),
        (this.lda = t),
        (this.layout = i),
        (this.dtype = n),
        (this.device = u ?? Be()));
    }
    static from(a, ...e) {
      let o = a instanceof GPUDevice,
        t = o ? a : Be(),
        s = o ? e.shift() : a,
        [i, u, n, d = "row-major"] = e;
      if (d !== "row-major" && d !== "column-major")
        throw new Error("layout must be 'row-major' or 'column-major'.");
      let l = d === "row-major";
      if (
        (n === void 0 && (n = l ? u : i),
        !(s instanceof Float32Array) &&
          !(s instanceof Float64Array) &&
          !(s instanceof Wr) &&
          !(s instanceof Ur))
      )
        throw new Error(
          "GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
        );
      if (!Number.isInteger(i) || i <= 0)
        throw new Error("rows must be a positive integer.");
      if (!Number.isInteger(u) || u <= 0)
        throw new Error("cols must be a positive integer.");
      let m = l ? u : i;
      if (!Number.isInteger(n) || n < m)
        throw new Error(`lda must be an integer >= ${l ? "cols" : "rows"}.`);
      let w = l ? i : u;
      if (s.length < w * n)
        throw new Error(
          "data does not have enough elements for the given rows, cols, and lda.",
        );
      if (s instanceof Float64Array) {
        let c = w * n,
          { hi: h, lo: g } = V(s.subarray(0, c)),
          b = y(t, h, "gpu-matrix-f64-hi", !0),
          x = y(t, g, "gpu-matrix-f64-lo", !0);
        return new r(b, i, u, n, x, d, t, Float64Array);
      }
      if (s instanceof Wr) {
        let c = y(t, _e(s, w * n), "gpu-matrix-complex32", !0);
        return new r(c, i, u, n, null, d, t, Wr);
      }
      if (s instanceof Ur) {
        let { hi: c, lo: h } = Fe(s, w * n),
          g = y(t, c, "gpu-matrix-complex64-hi", !0),
          b = y(t, h, "gpu-matrix-complex64-lo", !0);
        return new r(g, i, u, n, b, d, t, Ur);
      }
      let p = y(t, s.subarray(0, w * n), "gpu-matrix", !0);
      return new r(p, i, u, n, null, d, t);
    }
    async read() {
      let a = this.device,
        e = a.createCommandEncoder(),
        o = I(a, e, this._buf);
      a.queue.submit([e.finish()]);
      let t = this.layout !== "column-major",
        s = t ? this.rows : this.cols,
        i = t ? this.cols : this.rows;
      if (this.dtype === Wr) {
        let d = new Wr(await G(o, Float32Array));
        if (this.lda === i) return d;
        let l = new Wr(s * i);
        for (let m = 0; m < s; m++)
          for (let w = 0; w < i; w++) l[m * i + w] = d[m * this.lda + w];
        return l;
      }
      if (this._loBuf) {
        let d = a.createCommandEncoder(),
          l = I(a, d, this._loBuf);
        a.queue.submit([d.finish()]);
        let [m, w] = await Promise.all([
          G(o, Float32Array),
          G(l, Float32Array),
        ]);
        if (this.dtype === Ur) {
          let h = Ce(m, w);
          if (this.lda === i) return h;
          let g = new Ur(s * i);
          for (let b = 0; b < s; b++)
            for (let x = 0; x < i; x++) g[b * i + x] = h[b * this.lda + x];
          return g;
        }
        let p = Jr(m, w);
        if (this.lda === i) return p;
        let c = new Float64Array(s * i);
        for (let h = 0; h < s; h++)
          c.set(p.subarray(h * this.lda, h * this.lda + i), h * i);
        return c;
      }
      let u = await G(o, Float32Array);
      if (this.lda === i) return u;
      let n = new Float32Array(s * i);
      for (let d = 0; d < s; d++)
        n.set(u.subarray(d * this.lda, d * this.lda + i), d * i);
      return n;
    }
    destroy() {
      (this._buf.destroy(), this._loBuf && this._loBuf.destroy());
    }
  };
  function gt(r) {
    let a = r >>> 0;
    return function () {
      a = (a + 1831565813) | 0;
      let e = Math.imul(a ^ (a >>> 15), 1 | a);
      return (
        (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
        ((e ^ (e >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function bt(r, a = -1, e = 1, o) {
    let t = new Float32Array(r),
      s = o === void 0 ? Math.random : gt(o);
    for (let i = 0; i < r; i++) t[i] = a + s() * (e - a);
    return t;
  }
  function yt(r, a = -1, e = 1, o) {
    let t = new Float64Array(r),
      s = o === void 0 ? Math.random : gt(o);
    for (let i = 0; i < r; i++) t[i] = a + s() * (e - a);
    return t;
  }
  function xt(
    r,
    a,
    e = "lower",
    o = -1,
    t = 1,
    s = 5,
    i = 15,
    u = "row-major",
  ) {
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (u !== "row-major" && u !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (a < r) throw new Error("lda must be >= n.");
    let n = u === "column-major",
      d = (m, w) => (n ? w * a + m : m * a + w),
      l = new Float32Array(r * a);
    for (let m = 0; m < r; m++) {
      for (let w = 0; w < r; w++) {
        if (m === w) continue;
        (e === "lower" ? w < m : w > m) &&
          (l[d(m, w)] = o + Math.random() * (t - o));
      }
      l[d(m, m)] = s + Math.random() * (i - s);
    }
    return l;
  }
  function N(r, a, e, o = 0) {
    let t = e.map((s, i) => ({
      binding: o + i,
      resource: s instanceof GPUBuffer ? { buffer: s } : s,
    }));
    return r.createBindGroup({ layout: a, entries: t });
  }
  function $(r, a) {
    r.queue.submit([a.finish()]);
  }
  function Cr(r) {
    let { querySet: a, passDescriptor: e } = it(r);
    return {
      commandEncoder: r.createCommandEncoder(),
      querySet: a,
      passDescriptor: e,
    };
  }
  function Mr(r, a, e, o, t) {
    let s = r.beginComputePass(t);
    (s.setPipeline(a),
      s.setBindGroup(0, e),
      typeof o == "number"
        ? s.dispatchWorkgroups(o)
        : s.dispatchWorkgroups(o.x, o.y, o.z ?? 1),
      s.end());
  }
  function Ar(r, a) {
    if (a.length === 1) {
      let [s] = a;
      return Sr(r, s.pipeline, s.bindGroup, s.workgroups);
    }
    let { commandEncoder: e, querySet: o } = Cr(r);
    a.forEach((s, i) => {
      let u;
      (o && i === 0
        ? (u = {
            timestampWrites: { querySet: o, beginningOfPassWriteIndex: 0 },
          })
        : o &&
          i === a.length - 1 &&
          (u = { timestampWrites: { querySet: o, endOfPassWriteIndex: 1 } }),
        Mr(e, s.pipeline, s.bindGroup, s.workgroups, u));
    });
    let t = Tr(r, e, o);
    return { commandEncoder: e, ts: t };
  }
  function Sr(r, a, e, o) {
    let { commandEncoder: t, querySet: s, passDescriptor: i } = Cr(r);
    Mr(t, a, e, o, i);
    let u = Tr(r, t, s);
    return { commandEncoder: t, ts: u };
  }
  var pn = {},
    et = new WeakMap();
  async function R(r, a, e = "main") {
    et.has(r) || et.set(r, new Map());
    let o = et.get(r),
      t = Array.isArray(a) ? a : [a],
      s = `${t.join("+")}::${e}`;
    if (!o.has(s)) {
      let i = mn(r, t, e).catch((u) => {
        throw (o.delete(s), u);
      });
      o.set(s, i);
    }
    return o.get(s);
  }
  async function dn(r) {
    if (typeof process > "u" || !process.versions?.node) {
      let { shaderSources: a } = await Promise.resolve().then(() => (Ma(), Pa)),
        e = a[r];
      if (!e) throw new Error(`Shader "${r}" not found in browser bundle.`);
      return e;
    } else {
      let { readFileSync: a } = await import("fs"),
        { fileURLToPath: e } = await import("url"),
        { dirname: o, join: t } = await import("path"),
        s = o(e(pn.url));
      return a(t(s, `../shaders/${r}.wgsl`), "utf8");
    }
  }
  async function mn(r, a, e = "main") {
    let o = a.join("+"),
      t = await Promise.all(a.map(dn)),
      s = 0,
      i = t.map((c, h) => {
        let g = c.split(`
`).length,
          b = { name: a[h], startLine: s + 1, endLine: s + g };
        return ((s += g), b);
      }),
      u = (c) => {
        let h = c && i.find((g) => c >= g.startLine && c <= g.endLine);
        return h ? `${h.name}.wgsl:${c - h.startLine + 1}` : `line ${c}`;
      },
      n = t.join(`
`),
      d = r.createShaderModule({ label: o, code: n }),
      m = (await d.getCompilationInfo()).messages.filter(
        (c) => c.type === "error",
      );
    if (m.length > 0)
      throw new Error(`Shader "${o}" compilation failed:
${m.map((c) => `  ${u(c.lineNum)}: ${c.message}`).join(`
`)}`);
    let w = e === "main" ? { module: d } : { module: d, entryPoint: e },
      p = r.createComputePipeline({ label: o, layout: "auto", compute: w });
    return ((p._shaderModule = d), p);
  }
  function Rr(r, a, e) {
    let o = r.limits.maxComputeWorkgroupsPerDimension;
    return e === void 0
      ? Math.min(Math.ceil(a / 64), o)
      : { x: Math.min(Math.ceil(e / 8), o), y: Math.min(Math.ceil(a / 8), o) };
  }
  function nr(r, a, e, o = "x") {
    let t = r.limits.maxComputeWorkgroupsPerDimension;
    if (a > t)
      throw new Error(
        `${e}: this problem needs ${a} workgroups in ${o}, but the device allows ${t} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
      );
    return a;
  }
  function Ra(r, a, e, o) {
    return o === void 0
      ? nr(r, Math.ceil(e / 64), a)
      : {
          x: nr(r, Math.ceil(o / 8), a, "x"),
          y: nr(r, Math.ceil(e / 8), a, "y"),
        };
  }
  function J(r) {
    if (!(r instanceof GPUDevice))
      throw new Error("device must be a GPUDevice.");
  }
  function Q(r, a, e) {
    for (let [o, t] of Object.entries(e))
      if (!(!(t instanceof Z) && !(t instanceof ir)) && t.device !== r)
        throw new Error(
          `${a}: ${o} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
        );
  }
  async function Ta(r, a, e, o, t) {
    let s = o instanceof Z;
    if (
      (J(r),
      Q(r, "sscal", { x: o }),
      !Number.isInteger(a) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof Float32Array) && !(o instanceof Z))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (a <= 0) return s ? {} : { x: o };
    if (o.length < (a - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (e === 1) return s ? {} : { x: o };
    let i = await R(r, "sscal"),
      u = null,
      n = null,
      d = null;
    try {
      ((u = s ? o._buf : y(r, o, "sscal-x", !0)),
        (n = j(
          r,
          [
            { value: a, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
          ],
          "sscal-params",
        )));
      let l = N(r, i.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: w } = Sr(r, i, l, Rr(r, a));
      ((d = s ? null : I(r, m, u)), $(r, m));
      let p = await Y(w);
      if (s) return p !== void 0 ? { gpuTimeMs: p } : {};
      let c = await G(d, Float32Array);
      return ((d = null), p !== void 0 ? { x: c, gpuTimeMs: p } : { x: c });
    } finally {
      (!s && u && f(u), n && f(n), d && f(d));
    }
  }
  async function ja(r, a, e, o, t) {
    let s = o instanceof Z;
    if (
      (J(r),
      Q(r, "cscal", { x: o }),
      !Number.isInteger(a) || !Number.isInteger(t))
    )
      throw new Error("n and incx must be integers.");
    if (!(e instanceof ne)) throw new Error("alpha must be a Complex32.");
    if (Number.isNaN(e.re) || Number.isNaN(e.im))
      throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e.re) || !Number.isFinite(e.im))
      throw new Error("alpha must be finite.");
    if (t <= 0) throw new Error("incx must be positive.");
    if (!(o instanceof Wr) && !s)
      throw new Error("x must be a Complex32Array or GpuVector.");
    if (s && o.dtype !== Wr)
      throw new Error("x must be a Complex32Array-backed GpuVector.");
    if (a <= 0) return s ? {} : { x: o };
    if (o.length < (a - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let i = await R(r, "cscal"),
      u = null,
      n = null,
      d = null;
    try {
      ((u = s ? o._buf : y(r, _e(o), "cscal-x", !0)),
        (n = j(
          r,
          [
            { value: a, type: "u32" },
            { value: e.re, type: "f32" },
            { value: e.im, type: "f32" },
            { value: t, type: "u32" },
          ],
          "cscal-params",
        )));
      let l = N(r, i.getBindGroupLayout(0), [u, n]),
        { commandEncoder: m, ts: w } = Sr(r, i, l, Rr(r, a));
      ((d = s ? null : I(r, m, u)), $(r, m));
      let p = await Y(w);
      if (s) return p !== void 0 ? { gpuTimeMs: p } : {};
      let c = await G(d, Float32Array);
      d = null;
      let h = new Wr(c);
      return p !== void 0 ? { x: h, gpuTimeMs: p } : { x: h };
    } finally {
      (!s && u && f(u), n && f(n), d && f(d));
    }
  }
  async function Ha(r, a, e, o, t) {
    let s = o instanceof Z;
    if ((J(r), !Number.isInteger(a) || !Number.isInteger(t)))
      throw new Error("n and incx must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !s)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (s && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (t <= 0) throw new Error("incx must be positive.");
    if ((Q(r, "dscal", { x: o }), a <= 0)) return s ? {} : { x: o };
    if (o.length < (a - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (e === 1) return s ? {} : { x: o };
    let u = await R(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "dscal",
      ]),
      { hi: n, lo: d } = V(new Float64Array([e])),
      l = null,
      m = null,
      w = null,
      p = null,
      c = null;
    try {
      if (s) ((l = o._buf), (m = o._loBuf));
      else {
        let { hi: _, lo: S } = V(o);
        ((l = y(r, _, "dscal-xHi", !0)), (m = y(r, S, "dscal-xLo", !0)));
      }
      w = j(
        r,
        [
          { value: a, type: "u32" },
          { value: n[0], type: "f32" },
          { value: d[0], type: "f32" },
          { value: t, type: "u32" },
        ],
        "dscal-params",
      );
      let h = N(r, u.getBindGroupLayout(0), [l, m, w]),
        { commandEncoder: g, ts: b } = Sr(r, u, h, Rr(r, a));
      ((p = s ? null : I(r, g, l)), (c = s ? null : I(r, g, m)), $(r, g));
      let x = await Y(b);
      if (s) return x !== void 0 ? { gpuTimeMs: x } : {};
      let B = await G(p, Float32Array);
      p = null;
      let v = await G(c, Float32Array);
      c = null;
      let k = _r(B, v, o);
      return x !== void 0 ? { x: k, gpuTimeMs: x } : { x: k };
    } finally {
      (!s && l && f(l), !s && m && f(m), w && f(w), p && f(p), c && f(c));
    }
  }
  async function Fa(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "sswap", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float32Array) && !(e instanceof Z))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!(t instanceof Float32Array) && !(t instanceof Z))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (e.constructor !== t.constructor)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0) return i ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await R(r, "sswap"),
      d = null,
      l = null,
      m = null,
      w = null,
      p = null;
    try {
      ((d = i ? e._buf : y(r, e, "sswap-x", !0)),
        (l = u ? t._buf : y(r, t, "sswap-y", !0)),
        (m = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sswap-params",
        )));
      let c = N(r, n.getBindGroupLayout(0), [d, l, m]),
        { commandEncoder: h, ts: g } = Sr(r, n, c, Rr(r, a));
      ((w = i ? null : I(r, h, d)), (p = u ? null : I(r, h, l)), $(r, h));
      let b = await Y(g);
      if (i) return b !== void 0 ? { gpuTimeMs: b } : {};
      let x = await G(w, Float32Array);
      w = null;
      let B = await G(p, Float32Array);
      return (
        (p = null),
        b !== void 0 ? { x, y: B, gpuTimeMs: b } : { x, y: B }
      );
    } finally {
      (!i && d && f(d), !u && l && f(l), m && f(m), w && f(w), p && f(p));
    }
  }
  async function Ca(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "dswap", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (i && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (i !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (a <= 0) return i ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await R(r, "dswap"),
      d = null,
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null,
      g = null,
      b = null;
    try {
      if (i) ((d = e._buf), (l = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let P = V(e),
          H = V(t);
        ((d = y(r, P.hi, "dswap-xHi", !0)),
          (l = y(r, P.lo, "dswap-xLo", !0)),
          (m = y(r, H.hi, "dswap-yHi", !0)),
          (w = y(r, H.lo, "dswap-yLo", !0)));
      }
      p = j(
        r,
        [
          { value: a, type: "u32" },
          { value: o, type: "u32" },
          { value: s, type: "u32" },
        ],
        "dswap-params",
      );
      let x = N(r, n.getBindGroupLayout(0), [d, l, m, w, p]),
        { commandEncoder: B, ts: v } = Sr(r, n, x, Rr(r, a));
      ((c = i ? null : I(r, B, d)),
        (h = i ? null : I(r, B, l)),
        (g = u ? null : I(r, B, m)),
        (b = u ? null : I(r, B, w)),
        $(r, B));
      let k = await Y(v);
      if (i) return k !== void 0 ? { gpuTimeMs: k } : {};
      let _ = await G(c, Float32Array);
      c = null;
      let S = await G(h, Float32Array);
      h = null;
      let T = await G(g, Float32Array);
      g = null;
      let D = await G(b, Float32Array);
      b = null;
      let A = Float64Array.from(e),
        L = Float64Array.from(t);
      for (let P = 0; P < a; P++)
        ((A[P * o] = t[P * s]), (L[P * s] = e[P * o]));
      let E = _r(_, S, A),
        M = _r(T, D, L);
      return k !== void 0 ? { x: E, y: M, gpuTimeMs: k } : { x: E, y: M };
    } finally {
      (!i && d && f(d),
        !i && l && f(l),
        !u && m && f(m),
        !u && w && f(w),
        p && f(p),
        c && f(c),
        h && f(h),
        g && f(g),
        b && f(b));
    }
  }
  async function Wa(r, a, e, o, t, s, i) {
    let u = o instanceof Z,
      n = s instanceof Z;
    if (
      (J(r),
      Q(r, "saxpy", { x: o, y: s }),
      !Number.isInteger(a) || !Number.isInteger(t) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (t <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(o instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(s instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0) return n ? {} : { y: s };
    if (o.length < (a - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (a - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    if (e === 0) return n ? {} : { y: s };
    let d = await R(r, "saxpy"),
      l = null,
      m = null,
      w = null,
      p = null;
    try {
      ((l = u ? o._buf : y(r, o, "saxpy-x", !1)),
        (m = n ? s._buf : y(r, s, "saxpy-y", !0)),
        (w = j(
          r,
          [
            { value: a, type: "u32" },
            { value: e, type: "f32" },
            { value: t, type: "u32" },
            { value: i, type: "u32" },
          ],
          "saxpy-params",
        )));
      let c = N(r, d.getBindGroupLayout(0), [l, m, w]),
        { commandEncoder: h, ts: g } = Sr(r, d, c, Rr(r, a));
      ((p = n ? null : I(r, h, m)), $(r, h));
      let b = await Y(g);
      if (n) return b !== void 0 ? { gpuTimeMs: b } : {};
      let x = await G(p, Float32Array);
      return ((p = null), b !== void 0 ? { y: x, gpuTimeMs: b } : { y: x });
    } finally {
      (!u && l && f(l), !n && m && f(m), w && f(w), p && f(p));
    }
  }
  async function Oa(r, a, e, o, t, s, i) {
    let u = o instanceof Z,
      n = s instanceof Z;
    if (
      (J(r),
      !Number.isInteger(a) || !Number.isInteger(t) || !Number.isInteger(i))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof e != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(e)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(e)) throw new Error("alpha must be finite.");
    if (!(o instanceof Float64Array) && !u)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(s instanceof Float64Array) && !n)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (u && o.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (n && s.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (t <= 0 || i <= 0) throw new Error("incx and incy must be positive.");
    if ((Q(r, "daxpy", { x: o, y: s }), a <= 0)) return n ? {} : { y: s };
    if (o.length < (a - 1) * t + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (s.length < (a - 1) * i + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    if (e === 0) return n ? {} : { y: s };
    let l = await R(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "daxpy",
      ]),
      { hi: m, lo: w } = V(new Float64Array([e])),
      p = null,
      c = null,
      h = null,
      g = null,
      b = null,
      x = null,
      B = null;
    try {
      if (u) ((p = o._buf), (c = o._loBuf), (h = s._buf), (g = s._loBuf));
      else {
        let L = V(o),
          E = V(s);
        ((p = y(r, L.hi, "daxpy-xHi", !1)),
          (c = y(r, L.lo, "daxpy-xLo", !1)),
          (h = y(r, E.hi, "daxpy-yHi", !0)),
          (g = y(r, E.lo, "daxpy-yLo", !0)));
      }
      b = j(
        r,
        [
          { value: a, type: "u32" },
          { value: m[0], type: "f32" },
          { value: w[0], type: "f32" },
          { value: t, type: "u32" },
          { value: i, type: "u32" },
        ],
        "daxpy-params",
      );
      let v = N(r, l.getBindGroupLayout(0), [p, c, h, g, b]),
        { commandEncoder: k, ts: _ } = Sr(r, l, v, Rr(r, a));
      ((x = n ? null : I(r, k, h)), (B = n ? null : I(r, k, g)), $(r, k));
      let S = await Y(_);
      if (n) return S !== void 0 ? { gpuTimeMs: S } : {};
      let T = await G(x, Float32Array);
      x = null;
      let D = await G(B, Float32Array);
      B = null;
      let A = _r(T, D, s);
      return S !== void 0 ? { y: A, gpuTimeMs: S } : { y: A };
    } finally {
      (!u && p && f(p),
        !u && c && f(c),
        !n && h && f(h),
        !n && g && f(g),
        b && f(b),
        x && f(x),
        B && f(B));
    }
  }
  async function Ka(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "scopy", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (i !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0) return u ? {} : { y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await R(r, "scopy"),
      d = null,
      l = null,
      m = null,
      w = null;
    try {
      ((d = i ? e._buf : y(r, e, "scopy-x", !1)),
        (l = u ? t._buf : y(r, t, "scopy-y", !0)),
        (m = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "scopy-params",
        )));
      let p = N(r, n.getBindGroupLayout(0), [d, l, m]),
        { commandEncoder: c, ts: h } = Sr(r, n, p, Rr(r, a));
      ((w = u ? null : I(r, c, l)), $(r, c));
      let g = await Y(h);
      if (u) return g !== void 0 ? { gpuTimeMs: g } : {};
      let b = await G(w, Float32Array);
      return ((w = null), g !== void 0 ? { y: b, gpuTimeMs: g } : { y: b });
    } finally {
      (!i && d && f(d), !u && l && f(l), m && f(m), w && f(w));
    }
  }
  async function qa(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "dcopy", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!(e instanceof Float64Array) && !i)
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!(t instanceof Float64Array) && !u)
      throw new Error("y must be a Float64Array or GpuVector.");
    if (i && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (i !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (a <= 0) return u ? {} : { y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await R(r, "dcopy"),
      d = null,
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      if (i) ((d = e._buf), (l = e._loBuf), (m = t._buf), (w = t._loBuf));
      else {
        let T = V(e),
          D = V(t);
        ((d = y(r, T.hi, "dcopy-xHi", !1)),
          (l = y(r, T.lo, "dcopy-xLo", !1)),
          (m = y(r, D.hi, "dcopy-yHi", !0)),
          (w = y(r, D.lo, "dcopy-yLo", !0)));
      }
      p = j(
        r,
        [
          { value: a, type: "u32" },
          { value: o, type: "u32" },
          { value: s, type: "u32" },
        ],
        "dcopy-params",
      );
      let g = N(r, n.getBindGroupLayout(0), [d, l, m, w, p]),
        { commandEncoder: b, ts: x } = Sr(r, n, g, Rr(r, a));
      ((c = u ? null : I(r, b, m)), (h = u ? null : I(r, b, w)), $(r, b));
      let B = await Y(x);
      if (u) return B !== void 0 ? { gpuTimeMs: B } : {};
      let v = await G(c, Float32Array);
      c = null;
      let k = await G(h, Float32Array);
      h = null;
      let _ = Float64Array.from(t);
      for (let T = 0; T < a; T++) _[T * s] = e[T * o];
      let S = _r(v, k, _);
      return B !== void 0 ? { y: S, gpuTimeMs: B } : { y: S };
    } finally {
      (!i && d && f(d),
        !i && l && f(l),
        !u && m && f(m),
        !u && w && f(w),
        p && f(p),
        c && f(c),
        h && f(h));
    }
  }
  async function za(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "sdot", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!u && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (i !== u)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0) return { dot: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = await R(r, "sdot"),
      d = await R(r, "reduction/sum"),
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      ((l = i ? e._buf : y(r, e, "sdot-x", !1)),
        (m = u ? t._buf : y(r, t, "sdot-y", !1)),
        (w = dr(r, 512, "sdot-partials")),
        (p = Or(r, 4, "sdot-result")),
        (c = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "sdot-params",
        )));
      let g = N(r, n.getBindGroupLayout(0), [l, m, w, c]),
        b = N(r, d.getBindGroupLayout(0), [w, p]),
        { commandEncoder: x, ts: B } = Ar(r, [
          { pipeline: n, bindGroup: g, workgroups: 128 },
          { pipeline: d, bindGroup: b, workgroups: 1 },
        ]);
      ((h = I(r, x, p)), $(r, x));
      let v = G(h, Float32Array);
      h = null;
      let [k, _] = await Promise.all([Y(B), v]);
      return k !== void 0 ? { dot: _[0], gpuTimeMs: k } : { dot: _[0] };
    } finally {
      (!i && l && f(l),
        !u && m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        h && f(h));
    }
  }
  async function Va(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "sasum", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (a <= 0) return { asum: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await R(r, "sasum"),
      i = await R(r, "reduction/sum"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null;
    try {
      ((u = t ? e._buf : y(r, e, "sasum-x", !1)),
        (n = dr(r, 512, "sasum-partials")),
        (d = Or(r, 4, "sasum-result")),
        (l = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "sasum-params",
        )));
      let w = N(r, s.getBindGroupLayout(0), [u, n, l]),
        p = N(r, i.getBindGroupLayout(0), [n, d]),
        { commandEncoder: c, ts: h } = Ar(r, [
          { pipeline: s, bindGroup: w, workgroups: 128 },
          { pipeline: i, bindGroup: p, workgroups: 1 },
        ]);
      ((m = I(r, c, d)), $(r, c));
      let g = G(m, Float32Array);
      m = null;
      let [b, x] = await Promise.all([Y(h), g]);
      return b !== void 0 ? { asum: x[0], gpuTimeMs: b } : { asum: x[0] };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m));
    }
  }
  async function Ua(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "dasum", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (a <= 0) return { asum: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = ["f64/dekker", "f64/utils/abs", "f64/utils/add"],
      i = await R(r, [...s, "dasum"]),
      u = await R(r, [...s, "reduction/sumF64"]),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null,
      g = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: L, lo: E } = V(e.map(Math.abs));
        ((n = y(r, L, "dasum-xHi", !1)), (d = y(r, E, "dasum-xLo", !1)));
      }
      ((l = dr(r, 512, "dasum-partialsHi")),
        (m = dr(r, 512, "dasum-partialsLo")),
        (w = Or(r, 4, "dasum-result-hi")),
        (p = Or(r, 4, "dasum-result-lo")),
        (c = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "dasum-params",
        )));
      let b = N(r, i.getBindGroupLayout(0), [n, d, l, m, c]),
        x = N(r, u.getBindGroupLayout(0), [l, m, w, p]),
        { commandEncoder: B, ts: v } = Ar(r, [
          { pipeline: i, bindGroup: b, workgroups: 128 },
          { pipeline: u, bindGroup: x, workgroups: 1 },
        ]);
      ((h = I(r, B, w)), (g = I(r, B, p)), $(r, B));
      let k = G(h, Float32Array),
        _ = G(g, Float32Array);
      ((h = null), (g = null));
      let [S, T, D] = await Promise.all([Y(v), k, _]),
        A = Jr(T, D)[0];
      return S !== void 0 ? { asum: A, gpuTimeMs: S } : { asum: A };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        h && f(h),
        g && f(g));
    }
  }
  async function Za(r, a, e, o, t, s) {
    let i = e instanceof Z,
      u = t instanceof Z;
    if (
      (J(r),
      Q(r, "ddot", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!i && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!u && !(t instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (i && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (u && t.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (i !== u)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (a <= 0) return { dot: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let n = ["f64/dekker", "f64/utils/add"],
      d = await R(r, [...n, "f64/utils/multiply", "ddot"]),
      l = await R(r, [...n, "reduction/sumF64"]),
      m = null,
      w = null,
      p = null,
      c = null,
      h = null,
      g = null,
      b = null,
      x = null,
      B = null,
      v = null,
      k = null;
    try {
      if (i) ((m = e._buf), (w = e._loBuf), (p = t._buf), (c = t._loBuf));
      else {
        let z = V(e),
          O = V(t);
        ((m = y(r, z.hi, "ddot-xHi", !1)),
          (w = y(r, z.lo, "ddot-xLo", !1)),
          (p = y(r, O.hi, "ddot-yHi", !1)),
          (c = y(r, O.lo, "ddot-yLo", !1)));
      }
      ((h = dr(r, 512, "ddot-partialsHi")),
        (g = dr(r, 512, "ddot-partialsLo")),
        (b = Or(r, 4, "ddot-result-hi")),
        (x = Or(r, 4, "ddot-result-lo")),
        (B = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "ddot-params",
        )));
      let _ = N(r, d.getBindGroupLayout(0), [m, w, p, c, h, g, B]),
        S = N(r, l.getBindGroupLayout(0), [h, g, b, x]),
        { commandEncoder: T, ts: D } = Ar(r, [
          { pipeline: d, bindGroup: _, workgroups: 128 },
          { pipeline: l, bindGroup: S, workgroups: 1 },
        ]);
      ((v = I(r, T, b)), (k = I(r, T, x)), $(r, T));
      let A = G(v, Float32Array),
        L = G(k, Float32Array);
      ((v = null), (k = null));
      let [E, M, P] = await Promise.all([Y(D), A, L]),
        H = Jr(M, P)[0];
      return E !== void 0 ? { dot: H, gpuTimeMs: E } : { dot: H };
    } finally {
      (!i && m && f(m),
        !i && w && f(w),
        !u && p && f(p),
        !u && c && f(c),
        h && f(h),
        g && f(g),
        b && f(b),
        x && f(x),
        B && f(B),
        v && f(v),
        k && f(k));
    }
  }
  async function Xa(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "snrm2", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (a <= 0) return { nrm2: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await R(r, "snrm2"),
      i = await R(r, "reduction/scaledSum"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null;
    try {
      ((u = t ? e._buf : y(r, e, "snrm2-x", !1)),
        (n = dr(r, 384 * 4, "snrm2-partials")),
        (d = Or(r, 4, "snrm2-result")),
        (l = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "snrm2-params",
        )));
      let w = N(r, s.getBindGroupLayout(0), [u, n, l]),
        p = N(r, i.getBindGroupLayout(0), [n, d]),
        { commandEncoder: c, ts: h } = Ar(r, [
          { pipeline: s, bindGroup: w, workgroups: 128 },
          { pipeline: i, bindGroup: p, workgroups: 1 },
        ]);
      ((m = I(r, c, d)), $(r, c));
      let g = G(m, Float32Array);
      m = null;
      let [b, x] = await Promise.all([Y(h), g]),
        B = x[0];
      return b !== void 0 ? { nrm2: B, gpuTimeMs: b } : { nrm2: B };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m));
    }
  }
  async function Ya(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "dnrm2", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (a <= 0) return { nrm2: 0 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
        "f64/utils/sqrt",
      ],
      i = await R(r, [...s, "dnrm2"]),
      u = await R(r, [...s, "reduction/scaledSumF64"]),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: A, lo: L } = V(e);
        ((n = y(r, A, "dnrm2-xHi", !1)), (d = y(r, L, "dnrm2-xLo", !1)));
      }
      ((l = dr(r, 896 * 4, "dnrm2-partials")),
        (m = Or(r, 4, "dnrm2-result-hi")),
        (w = Or(r, 4, "dnrm2-result-lo")),
        (p = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "dnrm2-params",
        )));
      let g = N(r, i.getBindGroupLayout(0), [n, d, l, p]),
        b = N(r, u.getBindGroupLayout(0), [l, m, w]),
        { commandEncoder: x, ts: B } = Ar(r, [
          { pipeline: i, bindGroup: g, workgroups: 128 },
          { pipeline: u, bindGroup: b, workgroups: 1 },
        ]);
      ((c = I(r, x, m)), (h = I(r, x, w)), $(r, x));
      let v = G(c, Float32Array),
        k = G(h, Float32Array);
      ((c = null), (h = null));
      let [_, S, T] = await Promise.all([Y(B), v, k]),
        D = Jr(S, T)[0];
      return _ !== void 0 ? { nrm2: D, gpuTimeMs: _ } : { nrm2: D };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        h && f(h));
    }
  }
  async function $a(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "isamax", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (a <= 0) return { index: -1 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = await R(r, "isamax"),
      i = await R(r, "reduction/argmax"),
      u = null,
      n = null,
      d = null,
      l = null,
      m = null,
      w = null;
    try {
      ((u = t ? e._buf : y(r, e, "isamax-x", !1)),
        (n = dr(r, 512, "isamax-partials-val")),
        (d = dr(r, 512, "isamax-partials-idx")),
        (l = Or(r, 4, "isamax-result")),
        (m = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "isamax-params",
        )));
      let p = N(r, s.getBindGroupLayout(0), [u, n, d, m]),
        c = N(r, i.getBindGroupLayout(0), [n, d, l]),
        { commandEncoder: h, ts: g } = Ar(r, [
          { pipeline: s, bindGroup: p, workgroups: 128 },
          { pipeline: i, bindGroup: c, workgroups: 1 },
        ]);
      ((w = I(r, h, l)), $(r, h));
      let b = G(w, Uint32Array);
      w = null;
      let [x, B] = await Promise.all([Y(g), b]),
        v = B[0];
      return x !== void 0 ? { index: v, gpuTimeMs: x } : { index: v };
    } finally {
      (!t && u && f(u), n && f(n), d && f(d), l && f(l), m && f(m), w && f(w));
    }
  }
  async function Ja(r, a, e, o) {
    let t = e instanceof Z;
    if (
      (J(r),
      Q(r, "idamax", { x: e }),
      !Number.isInteger(a) || !Number.isInteger(o))
    )
      throw new Error("n and incx must be integers.");
    if (o <= 0) throw new Error("incx must be positive.");
    if (!t && !(e instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (t && e.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (a <= 0) return { index: -1 };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let s = [
        "f64/dekker",
        "f64/utils/abs",
        "f64/utils/greater",
        "f64/utils/equal",
      ],
      i = await R(r, [...s, "idamax"], "idamax_main"),
      u = await R(r, [...s, "reduction/argmaxF64"], "reduce_f64"),
      n = null,
      d = null,
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      if (t) ((n = e._buf), (d = e._loBuf));
      else {
        let { hi: T, lo: D } = V(e);
        ((n = y(r, T, "idamax-xHi", !1)), (d = y(r, D, "idamax-xLo", !1)));
      }
      ((l = dr(r, 512, "idamax-partials-val-hi")),
        (m = dr(r, 512, "idamax-partials-val-lo")),
        (w = dr(r, 512, "idamax-partials-idx")),
        (p = Or(r, 4, "idamax-result")),
        (c = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
          ],
          "idamax-params",
        )));
      let g = N(r, i.getBindGroupLayout(0), [n, d, l, m, w, c]),
        b = N(r, u.getBindGroupLayout(0), [l, m, w, p]),
        { commandEncoder: x, ts: B } = Ar(r, [
          { pipeline: i, bindGroup: g, workgroups: 128 },
          { pipeline: u, bindGroup: b, workgroups: 1 },
        ]);
      ((h = I(r, x, p)), $(r, x));
      let v = G(h, Uint32Array);
      h = null;
      let [k, _] = await Promise.all([Y(B), v]),
        S = _[0];
      return k !== void 0 ? { index: S, gpuTimeMs: k } : { index: S };
    } finally {
      (!t && n && f(n),
        !t && d && f(d),
        l && f(l),
        m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        h && f(h));
    }
  }
  async function Qa(r, a, e, o, t, s, i, u) {
    let n = e instanceof Z,
      d = t instanceof Z;
    if (
      (J(r),
      Q(r, "srot", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof i != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(i) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!n && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!d && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (n !== d)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0) return n ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await R(r, "srot"),
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      ((m = n ? e._buf : y(r, e, "srot-x", !0)),
        (w = d ? t._buf : y(r, t, "srot-y", !0)),
        (p = j(
          r,
          [
            { value: a, type: "u32" },
            { value: i, type: "f32" },
            { value: u, type: "f32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "srot-params",
        )));
      let g = N(r, l.getBindGroupLayout(0), [m, w, p]),
        { commandEncoder: b, ts: x } = Sr(r, l, g, Rr(r, a));
      ((c = n ? null : I(r, b, m)), (h = d ? null : I(r, b, w)), $(r, b));
      let B = await Y(x);
      if (n) return B !== void 0 ? { gpuTimeMs: B } : {};
      let v = G(c, Float32Array),
        k = G(h, Float32Array);
      ((c = null), (h = null));
      let [_, S] = await Promise.all([v, k]);
      return B !== void 0 ? { x: _, y: S, gpuTimeMs: B } : { x: _, y: S };
    } finally {
      (!n && m && f(m), !d && w && f(w), p && f(p), c && f(c), h && f(h));
    }
  }
  async function rs(r, a, e, o, t, s, i, u) {
    let n = e instanceof Z,
      d = t instanceof Z;
    if (
      (J(r),
      Q(r, "drot", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (typeof i != "number") throw new Error("c must be a number.");
    if (typeof u != "number") throw new Error("s must be a number.");
    if (Number.isNaN(i) || Number.isNaN(u))
      throw new Error("c and s must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("c must be finite.");
    if (!Number.isFinite(u)) throw new Error("s must be finite.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
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
    if (a <= 0) return n ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let m = await R(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drot",
      ]),
      { hi: w, lo: p } = V(new Float64Array([i])),
      { hi: c, lo: h } = V(new Float64Array([u])),
      g = null,
      b = null,
      x = null,
      B = null,
      v = null,
      k = null,
      _ = null,
      S = null,
      T = null;
    try {
      if (n) ((g = e._buf), (b = e._loBuf), (x = t._buf), (B = t._loBuf));
      else {
        let F = V(e),
          K = V(t);
        ((g = y(r, F.hi, "drot-xHi", !0)),
          (b = y(r, F.lo, "drot-xLo", !0)),
          (x = y(r, K.hi, "drot-yHi", !0)),
          (B = y(r, K.lo, "drot-yLo", !0)));
      }
      v = j(
        r,
        [
          { value: a, type: "u32" },
          { value: w[0], type: "f32" },
          { value: p[0], type: "f32" },
          { value: c[0], type: "f32" },
          { value: h[0], type: "f32" },
          { value: o, type: "u32" },
          { value: s, type: "u32" },
        ],
        "drot-params",
      );
      let D = N(r, m.getBindGroupLayout(0), [g, b, x, B, v]),
        { commandEncoder: A, ts: L } = Sr(r, m, D, Rr(r, a));
      ((k = n ? null : I(r, A, g)),
        (_ = n ? null : I(r, A, b)),
        (S = d ? null : I(r, A, x)),
        (T = d ? null : I(r, A, B)),
        $(r, A));
      let E = await Y(L);
      if (n) return E !== void 0 ? { gpuTimeMs: E } : {};
      let M = await G(k, Float32Array);
      k = null;
      let P = await G(_, Float32Array);
      _ = null;
      let H = await G(S, Float32Array);
      S = null;
      let z = await G(T, Float32Array);
      T = null;
      let O = _r(M, P, e),
        W = _r(H, z, t);
      return E !== void 0 ? { x: O, y: W, gpuTimeMs: E } : { x: O, y: W };
    } finally {
      (!n && g && f(g),
        !n && b && f(b),
        !d && x && f(x),
        !d && B && f(B),
        v && f(v),
        k && f(k),
        _ && f(_),
        S && f(S),
        T && f(T));
    }
  }
  async function es(r, a, e, o, t, s, i) {
    let u = e instanceof Z,
      n = t instanceof Z;
    if (
      (J(r),
      Q(r, "srotm", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(i instanceof Float32Array) || i.length !== 5)
      throw new Error("param must be a Float32Array of length 5.");
    if (i[0] !== -2 && i[0] !== -1 && i[0] !== 0 && i[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
    if (!u && !(e instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!n && !(t instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (u !== n)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (a <= 0 || i[0] === -2) return u ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let d = await R(r, "srotm"),
      l = null,
      m = null,
      w = null,
      p = null,
      c = null,
      h = null;
    try {
      ((l = u ? e._buf : y(r, e, "srotm-x", !0)),
        (m = n ? t._buf : y(r, t, "srotm-y", !0)),
        (w = y(r, i, "srotm-param", !1)),
        (p = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "srotm-params",
        )));
      let g = N(r, d.getBindGroupLayout(0), [l, m, w, p]),
        { commandEncoder: b, ts: x } = Sr(r, d, g, Rr(r, a));
      ((c = u ? null : I(r, b, l)), (h = n ? null : I(r, b, m)), $(r, b));
      let B = await Y(x);
      if (u) return B !== void 0 ? { gpuTimeMs: B } : {};
      let v = G(c, Float32Array),
        k = G(h, Float32Array);
      ((c = null), (h = null));
      let [_, S] = await Promise.all([v, k]);
      return B !== void 0 ? { x: _, y: S, gpuTimeMs: B } : { x: _, y: S };
    } finally {
      (!u && l && f(l),
        !n && m && f(m),
        w && f(w),
        p && f(p),
        c && f(c),
        h && f(h));
    }
  }
  async function ts(r, a, e, o, t, s, i) {
    let u = e instanceof Z,
      n = t instanceof Z;
    if (
      (J(r),
      Q(r, "drotm", { x: e, y: t }),
      !Number.isInteger(a) || !Number.isInteger(o) || !Number.isInteger(s))
    )
      throw new Error("n, incx, and incy must be integers.");
    if (!(i instanceof Float64Array) || i.length !== 5)
      throw new Error("param must be a Float64Array of length 5.");
    if (i[0] !== -2 && i[0] !== -1 && i[0] !== 0 && i[0] !== 1)
      throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
    if (o <= 0 || s <= 0) throw new Error("incx and incy must be positive.");
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
    if (a <= 0 || i[0] === -2) return u ? {} : { x: e, y: t };
    if (e.length < (a - 1) * o + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let l = await R(r, [
        ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
        "drotm",
      ]),
      { hi: m, lo: w } = V(i),
      p = null,
      c = null,
      h = null,
      g = null,
      b = null,
      x = null,
      B = null,
      v = null,
      k = null,
      _ = null,
      S = null;
    try {
      if (u) ((p = e._buf), (c = e._loBuf), (h = t._buf), (g = t._loBuf));
      else {
        let W = V(e),
          F = V(t);
        ((p = y(r, W.hi, "drotm-xHi", !0)),
          (c = y(r, W.lo, "drotm-xLo", !0)),
          (h = y(r, F.hi, "drotm-yHi", !0)),
          (g = y(r, F.lo, "drotm-yLo", !0)));
      }
      ((b = y(r, m, "drotm-paramHi", !1)),
        (x = y(r, w, "drotm-paramLo", !1)),
        (B = j(
          r,
          [
            { value: a, type: "u32" },
            { value: o, type: "u32" },
            { value: s, type: "u32" },
          ],
          "drotm-params",
        )));
      let T = N(r, l.getBindGroupLayout(0), [p, c, h, g, b, x, B]),
        { commandEncoder: D, ts: A } = Sr(r, l, T, Rr(r, a));
      ((v = u ? null : I(r, D, p)),
        (k = u ? null : I(r, D, c)),
        (_ = n ? null : I(r, D, h)),
        (S = n ? null : I(r, D, g)),
        $(r, D));
      let L = await Y(A);
      if (u) return L !== void 0 ? { gpuTimeMs: L } : {};
      let E = await G(v, Float32Array);
      v = null;
      let M = await G(k, Float32Array);
      k = null;
      let P = await G(_, Float32Array);
      _ = null;
      let H = await G(S, Float32Array);
      S = null;
      let z = _r(E, M, e),
        O = _r(P, H, t);
      return L !== void 0 ? { x: z, y: O, gpuTimeMs: L } : { x: z, y: O };
    } finally {
      (!u && p && f(p),
        !u && c && f(c),
        !n && h && f(h),
        !n && g && f(g),
        b && f(b),
        x && f(x),
        B && f(B),
        v && f(v),
        k && f(k),
        _ && f(_),
        S && f(S));
    }
  }
  async function os(r, a, e, o, t, s, i, u, n, d, l, m, w = "row-major") {
    let p = s instanceof ir,
      c = u instanceof Z,
      h = l instanceof Z;
    if (
      (J(r),
      Q(r, "sgemv", { A: s, x: u, y: l }),
      a !== "no-transpose" && a !== "transpose")
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
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      !Number.isInteger(m) ||
      !Number.isInteger(i)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!p && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!h && !(l instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (c !== h)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (c && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && u._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && h && s._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (s.rows < e || s.cols < o))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || o < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || o === 0) return h ? {} : { y: l };
    (p ? s.layout : w) === "column-major" &&
      (([e, o] = [o, e]),
      (a = a === "no-transpose" ? "transpose" : "no-transpose"));
    let b = a === "no-transpose",
      x = b ? o : e,
      B = b ? e : o;
    if (i < o) throw new Error("lda must be >= n.");
    if (!p && s.length < (e - 1) * i + o)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (B - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    let k = await R(r, b ? "sgemv_n" : "sgemv_t"),
      _ = b ? 1 : Math.ceil(e / 256),
      S = _ > 1 ? await R(r, "reduce_partials") : null,
      T = null,
      D = null,
      A = null,
      L = null,
      E = null,
      M = null;
    try {
      ((T = p ? s._buf : y(r, s, "sgemv-A", !1)),
        (D = c ? u._buf : y(r, u, "sgemv-x", !1)),
        (A = h ? l._buf : y(r, l, "sgemv-y", !0)));
      let P;
      b
        ? ((L = j(
            r,
            [
              { value: e, type: "u32" },
              { value: o, type: "u32" },
              { value: t, type: "f32" },
              { value: d, type: "f32" },
              { value: n, type: "u32" },
              { value: m, type: "u32" },
              { value: i, type: "u32" },
            ],
            "sgemv-params",
          )),
          (P = [
            {
              pipeline: k,
              bindGroup: N(r, k.getBindGroupLayout(0), [T, D, A, L]),
              workgroups: Math.min(
                e,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ]))
        : (_ > 1 &&
            ((E = dr(r, _ * o * 4, "sgemv-partials")),
            (M = j(
              r,
              [
                { value: o, type: "u32" },
                { value: _, type: "u32" },
                { value: m, type: "u32" },
                { value: t, type: "f32" },
                { value: d, type: "f32" },
              ],
              "sgemv-reduce-params",
            ))),
          (L = j(
            r,
            [
              { value: e, type: "u32" },
              { value: o, type: "u32" },
              { value: t, type: "f32" },
              { value: d, type: "f32" },
              { value: n, type: "u32" },
              { value: m, type: "u32" },
              { value: i, type: "u32" },
              { value: 256, type: "u32" },
              { value: _ > 1 ? 0 : 1, type: "u32" },
            ],
            "sgemv-t-params",
          )),
          (P = [
            {
              pipeline: k,
              bindGroup: N(r, k.getBindGroupLayout(0), [T, D, E ?? A, L]),
              workgroups: {
                x: nr(r, Math.ceil(o / 64), "sgemv", "x"),
                y: nr(r, _, "sgemv", "y"),
              },
            },
          ]),
          _ > 1 &&
            P.push({
              pipeline: S,
              bindGroup: N(r, S.getBindGroupLayout(0), [E, A, M]),
              workgroups: Math.min(
                Math.ceil(o / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }));
      let { commandEncoder: H, ts: z } = Ar(r, P),
        O = h ? null : I(r, H, A);
      $(r, H);
      let W = await Y(z);
      if (h) return W !== void 0 ? { gpuTimeMs: W } : {};
      let F = await G(O, Float32Array);
      return W !== void 0 ? { y: F, gpuTimeMs: W } : { y: F };
    } finally {
      (!p && T && f(T),
        !c && D && f(D),
        !h && A && f(A),
        L && f(L),
        E && f(E),
        M && f(M));
    }
  }
  async function jr(r, a, e, o, t) {
    let s = await R(r, "gather_strided"),
      i = dr(r, e * 4, t),
      u = j(
        r,
        [
          { value: e, type: "u32" },
          { value: o, type: "u32" },
        ],
        `${t}-params`,
      ),
      n = N(r, s.getBindGroupLayout(0), [a, i, u]),
      d = Math.min(
        Math.ceil(e / 64),
        r.limits.maxComputeWorkgroupsPerDimension,
      );
    return {
      buffer: i,
      params: u,
      pass: { pipeline: s, bindGroup: n, workgroups: d },
    };
  }
  function de(r, a) {
    return r > 1 && (a >= 2048 || (a >= 1024 && r >= 8));
  }
  async function as(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = i instanceof Z,
      p = d instanceof Z,
      c = t instanceof ir;
    if (
      (J(r),
      Q(r, "ssymv", { A: t, x: i, y: d }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (u <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < e) throw new Error("lda must be >= n.");
    if (!c && !(t instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(i instanceof Float32Array))
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
    if (w && i._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && s !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { y: d };
    if (!c && t.length < (e - 1) * s + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
        (c ? t.layout : m) === "column-major" ? a === "upper" : a === "lower",
      b = await R(r, "ssymv"),
      x = await R(r, "reduce_partials"),
      B = Math.ceil(e / 32),
      v = null,
      k = null,
      _ = null,
      S = null,
      T = null,
      D = null,
      A = null;
    try {
      ((v = c ? t._buf : y(r, t, "ssymv-A", !1)),
        (k = w ? i._buf : y(r, i, "ssymv-x", !1)),
        (_ = p ? d._buf : y(r, d, "ssymv-y", !0)),
        u > 1 && (A = await jr(r, k, e, u, "ssymv-x-packed")),
        (T = dr(r, B * e * 4, "ssymv-partials")),
        (S = j(
          r,
          [
            { value: e, type: "u32" },
            { value: s, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
            { value: B, type: "u32" },
          ],
          "ssymv-params",
        )),
        (D = j(
          r,
          [
            { value: e, type: "u32" },
            { value: B, type: "u32" },
            { value: l, type: "u32" },
            { value: o, type: "f32" },
            { value: n, type: "f32" },
          ],
          "ssymv-reduce-params",
        )));
      let L = (B * (B + 1)) / 2,
        E = r.limits.maxComputeWorkgroupsPerDimension,
        M = Math.min(L, E),
        P = nr(r, Math.ceil(L / M), "ssymv", "y"),
        H = [
          ...(A ? [A.pass] : []),
          {
            pipeline: b,
            bindGroup: N(r, b.getBindGroupLayout(0), [
              v,
              A ? A.buffer : k,
              T,
              S,
            ]),
            workgroups: { x: M, y: P },
          },
          {
            pipeline: x,
            bindGroup: N(r, x.getBindGroupLayout(0), [T, _, D]),
            workgroups: Math.min(
              Math.ceil(e / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          },
        ],
        { commandEncoder: z, ts: O } = Ar(r, H),
        W = p ? null : I(r, z, _);
      $(r, z);
      let F = await Y(O);
      if (p) return F !== void 0 ? { gpuTimeMs: F } : {};
      let K = await G(W, Float32Array);
      return F !== void 0 ? { y: K, gpuTimeMs: F } : { y: K };
    } finally {
      (!c && v && f(v),
        !w && k && f(k),
        !p && _ && f(_),
        S && f(S),
        T && f(T),
        D && f(D),
        A && f(A.buffer, A.params));
    }
  }
  async function ss(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = u instanceof Z,
      p = d instanceof Z,
      c = s instanceof ir,
      h = o === "unit";
    if (
      (J(r),
      Q(r, "strmv", { A: s, x: u, y: d }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!h && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (i < t) throw new Error("lda must be >= n.");
    if (!c && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!w && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!p && !(d instanceof Float32Array))
      throw new Error("y must be a Float32Array or GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float32Array or both GpuVector).",
      );
    if (w && u._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && p && s._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (s.rows < t || s.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return p ? {} : { y: d };
    if (!c && s.length < (t - 1) * i + t)
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
    let b = (c ? s.layout : m) === "column-major",
      x = b ? a === "upper" : a === "lower",
      v = !(b ? e === "transpose" : e === "no-transpose"),
      k = v ? Math.ceil(t / 256) : 1,
      _ = await R(r, v ? "strmv_t" : "strmv"),
      S = k > 1 ? await R(r, "reduce_partials") : null,
      T = null,
      D = null,
      A = null,
      L = null,
      E = null,
      M = null,
      P = null;
    try {
      ((T = c ? s._buf : y(r, s, "strmv-A", !1)),
        (D = w ? u._buf : y(r, u, "strmv-x", !1)),
        (A = p ? d._buf : y(r, d, "strmv-y", !0)),
        n > 1 && (P = await jr(r, D, t, n, "strmv-x-packed")));
      let H = P ? P.buffer : D,
        z = P ? 1 : n,
        O;
      (v
        ? (k > 1 &&
            ((E = dr(r, k * t * 4, "strmv-partials")),
            (M = j(
              r,
              [
                { value: t, type: "u32" },
                { value: k, type: "u32" },
                { value: l, type: "u32" },
                { value: 1, type: "f32" },
                { value: 0, type: "f32" },
              ],
              "strmv-reduce-params",
            ))),
          (L = j(
            r,
            [
              { value: t, type: "u32" },
              { value: z, type: "u32" },
              { value: l, type: "u32" },
              { value: i, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
              { value: 256, type: "u32" },
              { value: k > 1 ? 0 : 1, type: "u32" },
            ],
            "strmv-t-params",
          )),
          (O = [
            {
              pipeline: _,
              bindGroup: N(r, _.getBindGroupLayout(0), [T, H, E ?? A, L]),
              workgroups: {
                x: nr(r, Math.ceil(t / 64), "strmv", "x"),
                y: nr(r, k, "strmv", "y"),
              },
            },
          ]),
          k > 1 &&
            O.push({
              pipeline: S,
              bindGroup: N(r, S.getBindGroupLayout(0), [E, A, M]),
              workgroups: Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }))
        : ((L = j(
            r,
            [
              { value: t, type: "u32" },
              { value: z, type: "u32" },
              { value: l, type: "u32" },
              { value: i, type: "u32" },
              { value: 0, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
            ],
            "strmv-params",
          )),
          (O = [
            {
              pipeline: _,
              bindGroup: N(r, _.getBindGroupLayout(0), [T, H, A, L]),
              workgroups: Math.min(
                t,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ])),
        P && O.unshift(P.pass));
      let { commandEncoder: W, ts: F } = Ar(r, O),
        K = p ? null : I(r, W, A);
      $(r, W);
      let C = await Y(F);
      if (p) return C !== void 0 ? { gpuTimeMs: C } : {};
      let q = await G(K, Float32Array);
      return C !== void 0 ? { y: q, gpuTimeMs: C } : { y: q };
    } finally {
      (!c && T && f(T),
        !w && D && f(D),
        !p && A && f(A),
        L && f(L),
        E && f(E),
        M && f(M),
        P && f(P.buffer, P.params));
    }
  }
  var is = (r) => !Number.isFinite(Math.fround(r));
  function Ee(r, a, e = 1) {
    for (let o = 0; o < a; o++) if (is(r[o * e])) return !0;
    return !1;
  }
  function Le(r, a, e, o, t) {
    let s = t ? 1 : 0;
    for (let i = 0; i < a; i++) {
      let u = i * e + (o ? 0 : i + s),
        n = i * e + (o ? i + 1 - s : a);
      for (let d = u; d < n; d++) if (is(r[d])) return !0;
    }
    return !1;
  }
  function wn(r, a, e) {
    let o = new ArrayBuffer(r * a),
      t = new DataView(o);
    for (let s = 0; s < r; s++) {
      let i = e(s),
        u = s * a;
      i.forEach((n, d) => t.setUint32(u + d * 4, n, !0));
    }
    return o;
  }
  var ns = 48,
    ls = 2;
  function us(r, a, e) {
    let o = r.createBuffer({
      label: e,
      size: a.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(o, 0, a), o);
  }
  async function fs(r, a, e, o, t, s, i, u, n, d = "row-major") {
    let l = u instanceof Z,
      m = s instanceof ir,
      w = o === "unit";
    if ((J(r), Q(r, "strsv", { A: s, x: u }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(t) || !Number.isInteger(n) || !Number.isInteger(i))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (i < t) throw new Error("lda must be >= n.");
    if (!m && !(s instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!l && !(u instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (l && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && l && s._buf === u._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (s.rows < t || s.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return l ? {} : { x: u };
    if (!m && s.length < (t - 1) * i + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let c = (m ? s.layout : d) === "column-major",
      h = c ? a === "upper" : a === "lower",
      g = c ? e === "transpose" : e === "no-transpose",
      b = await R(r, "strsv_invert_block"),
      x = await R(r, "strsv_step"),
      B = await R(r, "scatter_strided"),
      v = g === h,
      k = [];
    for (let F = 0; F < t; F += 64) k.push(F);
    v || k.reverse();
    let _ = k.length,
      S = r.limits.minUniformBufferOffsetAlignment,
      T = _ > ls && !l && (Ee(u, t, n) || Le(s, t, i, h, w)),
      D = _ <= ls || T,
      A = (F) =>
        wn(_, S, (K) => {
          let C = K * 64,
            q = Math.min(C + 64, t),
            er = v ? q : 0,
            ar = v ? t - q : C;
          return [n, i, g ? 0 : 1, K, C, q, er, ar, F];
        }),
      L = null,
      E = null,
      M = null,
      P = null,
      H = null,
      z = null,
      O = null,
      W = [];
    try {
      ((L = m ? s._buf : y(r, s, "strsv-A", !1)),
        (E = l ? u._buf : y(r, u, "strsv-x", !0)));
      let { commandEncoder: F, querySet: K, passDescriptor: C } = Cr(r),
        q = F.beginComputePass(C);
      if (D) {
        let X = await R(r, "strsm_small");
        ((P = dr(r, t * 4, "strsv-sol")),
          _ > 1 && (H = us(r, A(1), "strsv-step-params")));
        let U = g ? i : 1,
          or = g ? 1 : i;
        for (let lr of k) {
          let sr = lr / 64,
            cr = Math.min(lr + 64, t),
            fr = cr - lr,
            mr = v ? t - cr : lr,
            gr = j(
              r,
              [
                { value: fr, type: "u32" },
                { value: 1, type: "u32" },
                { value: lr * (U + or), type: "u32" },
                { value: U, type: "u32" },
                { value: or, type: "u32" },
                { value: lr * n, type: "u32" },
                { value: n, type: "u32" },
                { value: 0, type: "u32" },
                { value: v ? 0 : 1, type: "u32" },
                { value: w ? 1 : 0, type: "u32" },
                { value: 1, type: "f32" },
                { value: mr > 0 ? 1 : 0, type: "u32" },
                { value: g ? 0 : 1, type: "u32" },
              ],
              "strsv-solve-params",
            );
          (W.push(gr),
            q.setPipeline(X),
            q.setBindGroup(
              0,
              N(r, X.getBindGroupLayout(0), [
                L,
                E,
                gr,
                { buffer: P, offset: lr * 4, size: fr * 4 },
              ]),
            ),
            q.dispatchWorkgroups(1),
            mr !== 0 &&
              (q.setPipeline(x),
              q.setBindGroup(
                0,
                N(r, x.getBindGroupLayout(0), [
                  L,
                  L,
                  E,
                  P,
                  { buffer: H, offset: sr * S, size: ns },
                ]),
              ),
              q.dispatchWorkgroups(nr(r, Math.ceil(mr / 64), "strsv"))));
        }
      } else {
        ((M = dr(r, _ * 64 * 64 * 4, "strsv-Ainv")),
          (P = dr(r, t * 4, "strsv-sol")),
          (H = us(r, A(0), "strsv-step-params")),
          (z = j(
            r,
            [
              { value: t, type: "u32" },
              { value: i, type: "u32" },
              { value: g ? 0 : 1, type: "u32" },
              { value: h ? 0 : 1, type: "u32" },
              { value: w ? 1 : 0, type: "u32" },
            ],
            "strsv-invert-params",
          )),
          (O = j(
            r,
            [
              { value: t, type: "u32" },
              { value: n, type: "u32" },
            ],
            "strsv-scatter-params",
          )),
          q.setPipeline(b),
          q.setBindGroup(0, N(r, b.getBindGroupLayout(0), [L, M, z])),
          q.dispatchWorkgroups(_),
          q.setPipeline(x));
        for (let X of k) {
          let U = X / 64,
            or = Math.min(X + 64, t),
            lr = v ? t - or : X;
          (q.setBindGroup(
            0,
            N(r, x.getBindGroupLayout(0), [
              L,
              M,
              E,
              P,
              { buffer: H, offset: U * S, size: ns },
            ]),
          ),
            q.dispatchWorkgroups(
              nr(r, Math.max(1, Math.ceil(lr / 64)), "strsv"),
            ));
        }
        (q.setPipeline(B),
          q.setBindGroup(0, N(r, B.getBindGroupLayout(0), [P, E, O])),
          q.dispatchWorkgroups(
            Math.min(
              Math.ceil(t / 64),
              r.limits.maxComputeWorkgroupsPerDimension,
            ),
          ));
      }
      q.end();
      let er = Tr(r, F, K),
        ar = l ? null : I(r, F, E);
      $(r, F);
      let tr = await Y(er);
      if (l) return tr !== void 0 ? { gpuTimeMs: tr } : {};
      let rr = await G(ar, Float32Array);
      return tr !== void 0 ? { x: rr, gpuTimeMs: tr } : { x: rr };
    } finally {
      (!m && L && f(L),
        !l && E && f(E),
        M && f(M),
        P && f(P),
        H && f(H),
        z && f(z),
        O && f(O),
        f(W));
    }
  }
  async function ds(r, a, e, o, t, s, i, u, n, d, l = "row-major") {
    let m = n instanceof ir;
    if (
      (J(r),
      Q(r, "sger", { A: n, x: t, y: i }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (s <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < a || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : l) === "column-major" &&
      (([a, e] = [e, a]), ([t, i] = [i, t]), ([s, u] = [u, s]));
    let p = t instanceof Z,
      c = i instanceof Z;
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!c && !(i instanceof Float32Array))
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
    if (m && c && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (a < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (a === 0 || e === 0) return m ? {} : { A: n };
    if (!m && n.length < (a - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    if (o === 0) return m ? {} : { A: n };
    let h = await R(r, "sger"),
      g = null,
      b = null,
      x = null,
      B = null,
      v = null;
    try {
      ((g = p ? t._buf : y(r, t, "sger-x", !1)),
        (b = c ? i._buf : y(r, i, "sger-y", !1)),
        (x = m ? n._buf : y(r, n, "sger-A", !0)),
        u > 1 && (v = await jr(r, b, e, u, "sger-y-packed")),
        (B = j(
          r,
          [
            { value: a, type: "u32" },
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: s, type: "u32" },
            { value: v ? 1 : u, type: "u32" },
            { value: d, type: "u32" },
          ],
          "sger-params",
        )));
      let k = N(r, h.getBindGroupLayout(0), [g, v ? v.buffer : b, x, B]),
        _ = Math.min(a, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: S, ts: T } = Ar(r, [
          ...(v ? [v.pass] : []),
          { pipeline: h, bindGroup: k, workgroups: _ },
        ]),
        D = m ? null : I(r, S, x);
      $(r, S);
      let A = await Y(T);
      if (m) return A !== void 0 ? { gpuTimeMs: A } : {};
      let L = await G(D, Float32Array);
      return A !== void 0 ? { A: L, gpuTimeMs: A } : { A: L };
    } finally {
      (!p && g && f(g),
        !c && b && f(b),
        !m && x && f(x),
        B && f(B),
        v && f(v.buffer, v.params));
    }
  }
  async function ms(r, a, e, o, t, s, i, u, n, d, l = "row-major") {
    let m = n instanceof ir;
    if (
      (J(r),
      Q(r, "dger", { A: n, x: t, y: i }),
      l !== "row-major" && l !== "column-major")
    )
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (s <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (!m && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (m && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (m && d !== n.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (n.rows < a || n.cols < e))
      throw new Error("A is too small for the given m and n.");
    (m ? n.layout : l) === "column-major" &&
      (([a, e] = [e, a]), ([t, i] = [i, t]), ([s, u] = [u, s]));
    let p = t instanceof Z,
      c = i instanceof Z;
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!c && !(i instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (p && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (c && i.dtype !== Float64Array)
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
    if (m && c && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (a < 0 || e < 0) throw new Error("m and n must be non-negative.");
    if (a === 0 || e === 0) return m ? {} : { A: n };
    if (!m && n.length < (a - 1) * d + e)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (t.length < (a - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given m and incx.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    if (o === 0) return m ? {} : { A: n };
    let g = await R(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dger"],
        "dger_main",
      ),
      { hi: b, lo: x } = V(new Float64Array([o])),
      B = null,
      v = null,
      k = null,
      _ = null,
      S = null,
      T = null,
      D = null,
      A = null,
      L = null,
      E = null,
      M = null;
    try {
      if (p)
        ((B = t._buf),
          (v = t._loBuf),
          (k = i._buf),
          (_ = i._loBuf),
          (S = n._buf),
          (T = n._loBuf));
      else {
        let q = V(t),
          er = V(i),
          ar = V(n);
        ((B = y(r, q.hi, "dger-xHi", !1)),
          (v = y(r, q.lo, "dger-xLo", !1)),
          (k = y(r, er.hi, "dger-yHi", !1)),
          (_ = y(r, er.lo, "dger-yLo", !1)),
          (S = y(r, ar.hi, "dger-AHi", !0)),
          (T = y(r, ar.lo, "dger-ALo", !0)));
      }
      (de(u, a) &&
        ((A = await jr(r, k, e, u, "dger-yHi-packed")),
        (L = await jr(r, _, e, u, "dger-yLo-packed"))),
        (D = j(
          r,
          [
            { value: a, type: "u32" },
            { value: e, type: "u32" },
            { value: b[0], type: "f32" },
            { value: x[0], type: "f32" },
            { value: s, type: "u32" },
            { value: A ? 1 : u, type: "u32" },
            { value: d, type: "u32" },
          ],
          "dger-params",
        )));
      let P = N(r, g.getBindGroupLayout(0), [
          B,
          v,
          A ? A.buffer : k,
          L ? L.buffer : _,
          S,
          T,
          D,
        ]),
        H = Math.min(a, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: z, ts: O } = Ar(r, [
          ...(A ? [A.pass, L.pass] : []),
          { pipeline: g, bindGroup: P, workgroups: H },
        ]);
      ((E = m ? null : I(r, z, S)), (M = m ? null : I(r, z, T)), $(r, z));
      let W = await Y(O);
      if (m) return W !== void 0 ? { gpuTimeMs: W } : {};
      let F = await G(E, Float32Array);
      E = null;
      let K = await G(M, Float32Array);
      M = null;
      let C = _r(F, K, n);
      return W !== void 0 ? { A: C, gpuTimeMs: W } : { A: C };
    } finally {
      (A && f(A.buffer, A.params),
        L && f(L.buffer, L.params),
        !p && B && f(B),
        !p && v && f(v),
        !c && k && f(k),
        !c && _ && f(_),
        !m && S && f(S),
        !m && T && f(T),
        D && f(D),
        E && f(E),
        M && f(M));
    }
  }
  async function ps(r, a, e, o, t, s, i, u, n = "row-major") {
    let d = t instanceof Z,
      l = i instanceof ir;
    if ((J(r), Q(r, "ssyr", { A: i, x: t }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(s) || !Number.isInteger(u))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0) throw new Error("incx must be positive.");
    if (u < e) throw new Error("lda must be >= n.");
    if (!l && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!d && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (d && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && d && i._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (l && u !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (l && (i.rows < e || i.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return l ? {} : { A: i };
    if (!l && i.length < (e - 1) * u + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
      (l ? i.layout : n) === "column-major" ? a === "upper" : a === "lower";
    if (o === 0) return l ? {} : { A: i };
    let p = await R(r, "ssyr"),
      c = null,
      h = null,
      g = null,
      b = null;
    try {
      ((c = d ? t._buf : y(r, t, "ssyr-x", !1)),
        (h = l ? i._buf : y(r, i, "ssyr-A", !0)),
        s > 1 && (b = await jr(r, c, e, s, "ssyr-x-packed")),
        (g = j(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: b ? 1 : s, type: "u32" },
            { value: u, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "ssyr-params",
        )));
      let x = N(r, p.getBindGroupLayout(0), [b ? b.buffer : c, h, g]),
        B = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: v, ts: k } = Ar(r, [
          ...(b ? [b.pass] : []),
          { pipeline: p, bindGroup: x, workgroups: B },
        ]),
        _ = l ? null : I(r, v, h);
      $(r, v);
      let S = await Y(k);
      if (l) return S !== void 0 ? { gpuTimeMs: S } : {};
      let T = await G(_, Float32Array);
      return S !== void 0 ? { A: T, gpuTimeMs: S } : { A: T };
    } finally {
      (!d && c && f(c), !l && h && f(h), g && f(g), b && f(b.buffer, b.params));
    }
  }
  async function cs(r, a, e, o, t, s, i, u, n = "row-major") {
    let d = t instanceof Z,
      l = i instanceof ir;
    if ((J(r), Q(r, "dsyr", { A: i, x: t }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (n !== "row-major" && n !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(e) || !Number.isInteger(s) || !Number.isInteger(u))
      throw new Error("n, incx, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0) throw new Error("incx must be positive.");
    if (u < e) throw new Error("lda must be >= n.");
    if (!l && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (l && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!d && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (d && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (d && !l)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (l && !d)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (l && d && i._buf === t._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (l && u !== i.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (l && (i.rows < e || i.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return l ? {} : { A: i };
    if (!l && i.length < (e - 1) * u + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (t.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let w =
      (l ? i.layout : n) === "column-major" ? a === "upper" : a === "lower";
    if (o === 0) return l ? {} : { A: i };
    let c = await R(
        r,
        [...["f64/dekker", "f64/utils/add", "f64/utils/multiply"], "dsyr"],
        "dsyr_main",
      ),
      { hi: h, lo: g } = V(new Float64Array([o])),
      b = null,
      x = null,
      B = null,
      v = null,
      k = null,
      _ = null,
      S = null,
      T = null,
      D = null;
    try {
      if (d) ((b = t._buf), (x = t._loBuf), (B = i._buf), (v = i._loBuf));
      else {
        let W = V(t),
          F = V(i);
        ((b = y(r, W.hi, "dsyr-xHi", !1)),
          (x = y(r, W.lo, "dsyr-xLo", !1)),
          (B = y(r, F.hi, "dsyr-AHi", !0)),
          (v = y(r, F.lo, "dsyr-ALo", !0)));
      }
      (de(s, e) &&
        ((_ = await jr(r, b, e, s, "dsyr-xHi-packed")),
        (S = await jr(r, x, e, s, "dsyr-xLo-packed"))),
        (k = j(
          r,
          [
            { value: e, type: "u32" },
            { value: h[0], type: "f32" },
            { value: g[0], type: "f32" },
            { value: _ ? 1 : s, type: "u32" },
            { value: u, type: "u32" },
            { value: w ? 0 : 1, type: "u32" },
          ],
          "dsyr-params",
        )));
      let A = N(r, c.getBindGroupLayout(0), [
          _ ? _.buffer : b,
          S ? S.buffer : x,
          B,
          v,
          k,
        ]),
        L = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: E, ts: M } = Ar(r, [
          ...[_, S].filter(Boolean).map((W) => W.pass),
          { pipeline: c, bindGroup: A, workgroups: L },
        ]);
      ((T = l ? null : I(r, E, B)), (D = l ? null : I(r, E, v)), $(r, E));
      let P = await Y(M);
      if (l) return P !== void 0 ? { gpuTimeMs: P } : {};
      let H = await G(T, Float32Array);
      T = null;
      let z = await G(D, Float32Array);
      D = null;
      let O = _r(H, z, i);
      return P !== void 0 ? { A: O, gpuTimeMs: P } : { A: O };
    } finally {
      for (let A of [_, S]) A && f(A.buffer, A.params);
      (!d && b && f(b),
        !d && x && f(x),
        !l && B && f(B),
        !l && v && f(v),
        k && f(k),
        T && f(T),
        D && f(D));
    }
  }
  async function ws(r, a, e, o, t, s, i, u, n, d, l = "row-major") {
    let m = t instanceof Z,
      w = i instanceof Z,
      p = n instanceof ir;
    if (
      (J(r),
      Q(r, "ssyr2", { A: n, x: t, y: i }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!m && !(t instanceof Float32Array))
      throw new Error("x must be a Float32Array or GpuVector.");
    if (!w && !(i instanceof Float32Array))
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
    if (p && w && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === i._buf)
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
    if (t.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h =
      (p ? n.layout : l) === "column-major" ? a === "upper" : a === "lower";
    if (o === 0) return p ? {} : { A: n };
    let g = await R(r, "ssyr2"),
      b = null,
      x = null,
      B = null,
      v = null,
      k = null,
      _ = null;
    try {
      ((b = m ? t._buf : y(r, t, "ssyr2-x", !1)),
        (x = w ? i._buf : y(r, i, "ssyr2-y", !1)),
        (B = p ? n._buf : y(r, n, "ssyr2-A", !0)),
        s > 1 && (k = await jr(r, b, e, s, "ssyr2-x-packed")),
        u > 1 && (_ = await jr(r, x, e, u, "ssyr2-y-packed")),
        (v = j(
          r,
          [
            { value: e, type: "u32" },
            { value: o, type: "f32" },
            { value: k ? 1 : s, type: "u32" },
            { value: _ ? 1 : u, type: "u32" },
            { value: d, type: "u32" },
            { value: h ? 0 : 1, type: "u32" },
          ],
          "ssyr2-params",
        )));
      let S = N(r, g.getBindGroupLayout(0), [
          k ? k.buffer : b,
          _ ? _.buffer : x,
          B,
          v,
        ]),
        T = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: D, ts: A } = Ar(r, [
          ...(k ? [k.pass] : []),
          ...(_ ? [_.pass] : []),
          { pipeline: g, bindGroup: S, workgroups: T },
        ]),
        L = p ? null : I(r, D, B);
      $(r, D);
      let E = await Y(A);
      if (p) return E !== void 0 ? { gpuTimeMs: E } : {};
      let M = await G(L, Float32Array);
      return E !== void 0 ? { A: M, gpuTimeMs: E } : { A: M };
    } finally {
      (!m && b && f(b),
        !w && x && f(x),
        !p && B && f(B),
        v && f(v),
        k && f(k.buffer, k.params),
        _ && f(_.buffer, _.params));
    }
  }
  async function hs(r, a, e, o, t, s, i, u, n, d, l = "row-major") {
    let m = t instanceof Z,
      w = i instanceof Z,
      p = n instanceof ir;
    if (
      (J(r),
      Q(r, "dsyr2", { A: n, x: t, y: i }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (l !== "row-major" && l !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(s) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (s <= 0 || u <= 0) throw new Error("incx and incy must be positive.");
    if (d < e) throw new Error("lda must be >= n.");
    if (!p && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!m && !(t instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!w && !(i instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (m && t.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (w && i.dtype !== Float64Array)
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
    if (p && w && n._buf === i._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (m && t._buf === i._buf)
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
    if (t.length < (e - 1) * s + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let h =
      (p ? n.layout : l) === "column-major" ? a === "upper" : a === "lower";
    if (o === 0) return p ? {} : { A: n };
    let b = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dsyr2",
        ],
        "dsyr2_main",
      ),
      { hi: x, lo: B } = V(new Float64Array([o])),
      v = null,
      k = null,
      _ = null,
      S = null,
      T = null,
      D = null,
      A = null,
      L = null,
      E = null,
      M = null,
      P = null,
      H = null,
      z = null;
    try {
      if (m)
        ((v = t._buf),
          (k = t._loBuf),
          (_ = i._buf),
          (S = i._loBuf),
          (T = n._buf),
          (D = n._loBuf));
      else {
        let tr = V(t),
          rr = V(i),
          X = V(n);
        ((v = y(r, tr.hi, "dsyr2-xHi", !1)),
          (k = y(r, tr.lo, "dsyr2-xLo", !1)),
          (_ = y(r, rr.hi, "dsyr2-yHi", !1)),
          (S = y(r, rr.lo, "dsyr2-yLo", !1)),
          (T = y(r, X.hi, "dsyr2-AHi", !0)),
          (D = y(r, X.lo, "dsyr2-ALo", !0)));
      }
      (de(s, e) &&
        ((L = await jr(r, v, e, s, "dsyr2-xHi-packed")),
        (E = await jr(r, k, e, s, "dsyr2-xLo-packed"))),
        de(u, e) &&
          ((M = await jr(r, _, e, u, "dsyr2-yHi-packed")),
          (P = await jr(r, S, e, u, "dsyr2-yLo-packed"))),
        (A = j(
          r,
          [
            { value: e, type: "u32" },
            { value: x[0], type: "f32" },
            { value: B[0], type: "f32" },
            { value: L ? 1 : s, type: "u32" },
            { value: M ? 1 : u, type: "u32" },
            { value: d, type: "u32" },
            { value: h ? 0 : 1, type: "u32" },
          ],
          "dsyr2-params",
        )));
      let O = N(r, b.getBindGroupLayout(0), [
          L ? L.buffer : v,
          E ? E.buffer : k,
          M ? M.buffer : _,
          P ? P.buffer : S,
          T,
          D,
          A,
        ]),
        W = Math.min(e, r.limits.maxComputeWorkgroupsPerDimension),
        { commandEncoder: F, ts: K } = Ar(r, [
          ...[L, E, M, P].filter(Boolean).map((tr) => tr.pass),
          { pipeline: b, bindGroup: O, workgroups: W },
        ]);
      ((H = p ? null : I(r, F, T)), (z = p ? null : I(r, F, D)), $(r, F));
      let C = await Y(K);
      if (p) return C !== void 0 ? { gpuTimeMs: C } : {};
      let q = await G(H, Float32Array);
      H = null;
      let er = await G(z, Float32Array);
      z = null;
      let ar = _r(q, er, n);
      return C !== void 0 ? { A: ar, gpuTimeMs: C } : { A: ar };
    } finally {
      for (let O of [L, E, M, P]) O && f(O.buffer, O.params);
      (!m && v && f(v),
        !m && k && f(k),
        !w && _ && f(_),
        !w && S && f(S),
        !p && T && f(T),
        !p && D && f(D),
        A && f(A),
        H && f(H),
        z && f(z));
    }
  }
  async function gs(r, a, e, o, t, s, i, u, n, d, l, m, w = "row-major") {
    let p = s instanceof ir,
      c = u instanceof Z,
      h = l instanceof Z;
    if (
      (J(r),
      Q(r, "dgemv", { A: s, x: u, y: l }),
      a !== "no-transpose" && a !== "transpose")
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
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      !Number.isInteger(m) ||
      !Number.isInteger(i)
    )
      throw new Error("m, n, incx, incy, and lda must be integers.");
    if (n <= 0 || m <= 0) throw new Error("incx and incy must be positive.");
    if (!p && !(s instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (p && s.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!c && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!h && !(l instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (c && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (h && l.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (c !== h)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (c && !p)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (p && !c)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && u._buf === l._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (p && h && s._buf === l._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (p && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (p && (s.rows < e || s.cols < o))
      throw new Error("A is too small for the given m and n.");
    if (e < 0 || o < 0) throw new Error("m and n must be non-negative.");
    if (e === 0 || o === 0) return h ? {} : { y: l };
    (p ? s.layout : w) === "column-major" &&
      (([e, o] = [o, e]),
      (a = a === "no-transpose" ? "transpose" : "no-transpose"));
    let b = a === "no-transpose",
      x = b ? o : e,
      B = b ? e : o;
    if (i < o) throw new Error("lda must be >= n.");
    if (!p && s.length < (e - 1) * i + o)
      throw new Error(
        "A does not have enough elements for the given m, n, and lda.",
      );
    if (u.length < (x - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given dimensions and incx.",
      );
    if (l.length < (B - 1) * m + 1)
      throw new Error(
        "y does not have enough elements for the given dimensions and incy.",
      );
    if (t === 0 && d === 1) return h ? {} : { y: l };
    let v = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      k = ["f64/utils/batch"],
      _ = b ? "dgemv_n" : "dgemv_t",
      S = b ? "dgemv_n_main" : "dgemv_t_main",
      T = await R(r, [...v, ...k, _], S),
      D = b ? 1 : Math.ceil(e / 64),
      A =
        D > 1
          ? await R(r, [...v, "reduce_partials_f64"], "reduce_partials_f64")
          : null,
      { hi: L, lo: E } = V(new Float64Array([t])),
      { hi: M, lo: P } = V(new Float64Array([d])),
      H = null,
      z = null,
      O = null,
      W = null,
      F = null,
      K = null,
      C = null,
      q = null,
      er = null,
      ar = null,
      tr = null,
      rr = null;
    try {
      if (p) ((H = s._buf), (z = s._loBuf));
      else {
        let gr = V(s);
        ((H = y(r, gr.hi, "dgemv-AHi", !1)),
          (z = y(r, gr.lo, "dgemv-ALo", !1)));
      }
      if (c) ((O = u._buf), (W = u._loBuf));
      else {
        let gr = V(u);
        ((O = y(r, gr.hi, "dgemv-xHi", !1)),
          (W = y(r, gr.lo, "dgemv-xLo", !1)));
      }
      if (h) ((F = l._buf), (K = l._loBuf));
      else {
        let gr = V(l);
        ((F = y(r, gr.hi, "dgemv-yHi", !0)),
          (K = y(r, gr.lo, "dgemv-yLo", !0)));
      }
      let X = [
          { value: e, type: "u32" },
          { value: o, type: "u32" },
          { value: L[0], type: "f32" },
          { value: E[0], type: "f32" },
          { value: M[0], type: "f32" },
          { value: P[0], type: "f32" },
          { value: n, type: "u32" },
          { value: m, type: "u32" },
          { value: i, type: "u32" },
        ],
        U;
      b
        ? ((C = j(r, X, "dgemv-params")),
          (U = [
            {
              pipeline: T,
              bindGroup: N(r, T.getBindGroupLayout(0), [H, z, O, W, F, K, C]),
              workgroups: Math.min(
                e,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ]))
        : (D > 1 &&
            ((q = dr(r, D * o * 4, "dgemv-partialsHi")),
            (er = dr(r, D * o * 4, "dgemv-partialsLo")),
            (ar = j(
              r,
              [
                { value: o, type: "u32" },
                { value: D, type: "u32" },
                { value: m, type: "u32" },
                { value: L[0], type: "f32" },
                { value: E[0], type: "f32" },
                { value: M[0], type: "f32" },
                { value: P[0], type: "f32" },
              ],
              "dgemv-reduce-params",
            ))),
          (C = j(
            r,
            [
              ...X,
              { value: 64, type: "u32" },
              { value: D > 1 ? 0 : 1, type: "u32" },
            ],
            "dgemv-t-params",
          )),
          (U = [
            {
              pipeline: T,
              bindGroup: N(r, T.getBindGroupLayout(0), [
                H,
                z,
                O,
                W,
                q ?? F,
                er ?? K,
                C,
              ]),
              workgroups: {
                x: nr(r, Math.ceil(o / 64), "dgemv", "x"),
                y: nr(r, D, "dgemv", "y"),
              },
            },
          ]),
          D > 1 &&
            U.push({
              pipeline: A,
              bindGroup: N(r, A.getBindGroupLayout(0), [q, er, F, K, ar]),
              workgroups: Math.min(
                Math.ceil(o / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }));
      let { commandEncoder: or, ts: lr } = Ar(r, U);
      ((tr = h ? null : I(r, or, F)), (rr = h ? null : I(r, or, K)), $(r, or));
      let sr = await Y(lr);
      if (h) return sr !== void 0 ? { gpuTimeMs: sr } : {};
      let cr = await G(tr, Float32Array);
      tr = null;
      let fr = await G(rr, Float32Array);
      rr = null;
      let mr = _r(cr, fr, l);
      return sr !== void 0 ? { y: mr, gpuTimeMs: sr } : { y: mr };
    } finally {
      (!p && H && f(H),
        !p && z && f(z),
        !c && O && f(O),
        !c && W && f(W),
        !h && F && f(F),
        !h && K && f(K),
        C && f(C),
        q && f(q),
        er && f(er),
        ar && f(ar),
        tr && f(tr),
        rr && f(rr));
    }
  }
  var hn = 256;
  async function bs(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = i instanceof Z,
      p = d instanceof Z,
      c = t instanceof ir;
    if (
      (J(r),
      Q(r, "dsymv", { A: t, x: i, y: d }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l) ||
      !Number.isInteger(s)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (typeof o != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(o)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(o)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (u <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (s < e) throw new Error("lda must be >= n.");
    if (!c && !(t instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && t.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(i instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && i.dtype !== Float64Array)
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
    if (w && i._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (c && p && t._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && s !== t.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (t.rows < e || t.cols < e))
      throw new Error("A is too small for the given n.");
    if (e < 0) throw new Error("n must be non-negative.");
    if (e === 0) return p ? {} : { y: d };
    if (!c && t.length < (e - 1) * s + e)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (i.length < (e - 1) * u + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    if (d.length < (e - 1) * l + 1)
      throw new Error(
        "y does not have enough elements for the given n and incy.",
      );
    let g =
      (c ? t.layout : m) === "column-major" ? a === "upper" : a === "lower";
    if (o === 0 && n === 1) return p ? {} : { y: d };
    let b = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      x = e >= hn,
      B = x
        ? await R(r, [...b, "f64/utils/batch", "dsymv_tile"], "dsymv_tile_main")
        : await R(r, [...b, "dsymv"], "dsymv_main"),
      v = x
        ? await R(r, [...b, "reduce_partials_f64"], "reduce_partials_f64")
        : null,
      k = Math.ceil(e / 32),
      { hi: _, lo: S } = V(new Float64Array([o])),
      { hi: T, lo: D } = V(new Float64Array([n])),
      A = null,
      L = null,
      E = null,
      M = null,
      P = null,
      H = null,
      z = null,
      O = null,
      W = null,
      F = null,
      K = null,
      C = null;
    try {
      if (c) ((A = t._buf), (L = t._loBuf));
      else {
        let or = V(t);
        ((A = y(r, or.hi, "dsymv-AHi", !1)),
          (L = y(r, or.lo, "dsymv-ALo", !1)));
      }
      if (w) ((E = i._buf), (M = i._loBuf));
      else {
        let or = V(i);
        ((E = y(r, or.hi, "dsymv-xHi", !1)),
          (M = y(r, or.lo, "dsymv-xLo", !1)));
      }
      if (p) ((P = d._buf), (H = d._loBuf));
      else {
        let or = V(d);
        ((P = y(r, or.hi, "dsymv-yHi", !0)),
          (H = y(r, or.lo, "dsymv-yLo", !0)));
      }
      let q;
      if (!x)
        ((z = j(
          r,
          [
            { value: e, type: "u32" },
            { value: _[0], type: "f32" },
            { value: S[0], type: "f32" },
            { value: T[0], type: "f32" },
            { value: D[0], type: "f32" },
            { value: u, type: "u32" },
            { value: l, type: "u32" },
            { value: s, type: "u32" },
            { value: g ? 0 : 1, type: "u32" },
          ],
          "dsymv-params",
        )),
          (q = [
            {
              pipeline: B,
              bindGroup: N(r, B.getBindGroupLayout(0), [A, L, E, M, P, H, z]),
              workgroups: e,
            },
          ]));
      else {
        ((O = dr(r, k * e * 4, "dsymv-partialsHi")),
          (W = dr(r, k * e * 4, "dsymv-partialsLo")),
          (z = j(
            r,
            [
              { value: e, type: "u32" },
              { value: s, type: "u32" },
              { value: g ? 0 : 1, type: "u32" },
              { value: k, type: "u32" },
              { value: u, type: "u32" },
            ],
            "dsymv-tile-params",
          )),
          (F = j(
            r,
            [
              { value: e, type: "u32" },
              { value: k, type: "u32" },
              { value: l, type: "u32" },
              { value: _[0], type: "f32" },
              { value: S[0], type: "f32" },
              { value: T[0], type: "f32" },
              { value: D[0], type: "f32" },
            ],
            "dsymv-reduce-params",
          )));
        let or = (k * (k + 1)) / 2,
          lr = r.limits.maxComputeWorkgroupsPerDimension,
          sr = Math.min(or, lr),
          cr = nr(r, Math.ceil(or / sr), "dsymv", "y");
        q = [
          {
            pipeline: B,
            bindGroup: N(r, B.getBindGroupLayout(0), [A, L, E, M, O, W, z]),
            workgroups: { x: sr, y: cr },
          },
          {
            pipeline: v,
            bindGroup: N(r, v.getBindGroupLayout(0), [O, W, P, H, F]),
            workgroups: Math.min(Math.ceil(e / 64), lr),
          },
        ];
      }
      let { commandEncoder: er, ts: ar } = Ar(r, q);
      ((K = p ? null : I(r, er, P)), (C = p ? null : I(r, er, H)), $(r, er));
      let tr = await Y(ar);
      if (p) return tr !== void 0 ? { gpuTimeMs: tr } : {};
      let rr = await G(K, Float32Array);
      K = null;
      let X = await G(C, Float32Array);
      C = null;
      let U = _r(rr, X, d);
      return tr !== void 0 ? { y: U, gpuTimeMs: tr } : { y: U };
    } finally {
      (!c && A && f(A),
        !c && L && f(L),
        !w && E && f(E),
        !w && M && f(M),
        !p && P && f(P),
        !p && H && f(H),
        z && f(z),
        O && f(O),
        W && f(W),
        F && f(F),
        K && f(K),
        C && f(C));
    }
  }
  var gn = 512;
  async function ys(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = u instanceof Z,
      p = d instanceof Z,
      c = s instanceof ir,
      h = o === "unit";
    if (
      (J(r),
      Q(r, "dtrmv", { A: s, x: u, y: d }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!h && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(i)
    )
      throw new Error("n, incx, incy, and lda must be integers.");
    if (n <= 0 || l <= 0) throw new Error("incx and incy must be positive.");
    if (i < t) throw new Error("lda must be >= n.");
    if (!c && !(s instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (c && s.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!w && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (!p && !(d instanceof Float64Array))
      throw new Error("y must be a Float64Array or GpuVector.");
    if (w && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (p && d.dtype !== Float64Array)
      throw new Error("y must be a Float64Array-backed GpuVector.");
    if (w !== p)
      throw new Error(
        "x and y must be the same type (both Float64Array or both GpuVector).",
      );
    if (w && u._buf === d._buf)
      throw new Error(
        "x and y must not reference the same GPU buffer when both are GpuVectors.",
      );
    if (w && !c)
      throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
    if (c && !w)
      throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
    if (c && p && s._buf === d._buf)
      throw new Error("A and y must not reference the same GPU buffer.");
    if (c && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (c && (s.rows < t || s.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return p ? {} : { y: d };
    if (!c && s.length < (t - 1) * i + t)
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
    let b = (c ? s.layout : m) === "column-major",
      x = b ? a === "upper" : a === "lower",
      B = b ? e === "transpose" : e === "no-transpose",
      v = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
      k = !B && t >= gn,
      _ = k ? Math.ceil(t / 64) : 1,
      S = await R(
        r,
        [...v, k ? "dtrmv_t" : "dtrmv"],
        k ? "dtrmv_t_main" : "dtrmv_main",
      ),
      T =
        _ > 1
          ? await R(r, [...v, "reduce_partials_f64"], "reduce_partials_f64")
          : null,
      D = null,
      A = null,
      L = null,
      E = null,
      M = null,
      P = null,
      H = null,
      z = null,
      O = null,
      W = null,
      F = null,
      K = null,
      C = null,
      q = null;
    try {
      if (c) ((D = s._buf), (A = s._loBuf));
      else {
        let fr = V(s);
        ((D = y(r, fr.hi, "dtrmv-AHi", !1)),
          (A = y(r, fr.lo, "dtrmv-ALo", !1)));
      }
      if (w) ((L = u._buf), (E = u._loBuf));
      else {
        let fr = V(u);
        ((L = y(r, fr.hi, "dtrmv-xHi", !1)),
          (E = y(r, fr.lo, "dtrmv-xLo", !1)));
      }
      if (p) ((M = d._buf), (P = d._loBuf));
      else {
        let fr = V(d);
        ((M = y(r, fr.hi, "dtrmv-yHi", !0)),
          (P = y(r, fr.lo, "dtrmv-yLo", !0)));
      }
      de(n, t) &&
        ((F = await jr(r, L, t, n, "dtrmv-xHi-packed")),
        (K = await jr(r, E, t, n, "dtrmv-xLo-packed")));
      let er = F ? F.buffer : L,
        ar = K ? K.buffer : E,
        tr = F ? 1 : n,
        rr;
      (k
        ? (_ > 1 &&
            ((z = dr(r, _ * t * 4, "dtrmv-partialsHi")),
            (O = dr(r, _ * t * 4, "dtrmv-partialsLo")),
            (W = j(
              r,
              [
                { value: t, type: "u32" },
                { value: _, type: "u32" },
                { value: l, type: "u32" },
                { value: 1, type: "f32" },
                { value: 0, type: "f32" },
                { value: 0, type: "f32" },
                { value: 0, type: "f32" },
              ],
              "dtrmv-reduce-params",
            ))),
          (H = j(
            r,
            [
              { value: t, type: "u32" },
              { value: tr, type: "u32" },
              { value: l, type: "u32" },
              { value: i, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
              { value: 64, type: "u32" },
              { value: _ > 1 ? 0 : 1, type: "u32" },
            ],
            "dtrmv-t-params",
          )),
          (rr = [
            {
              pipeline: S,
              bindGroup: N(r, S.getBindGroupLayout(0), [
                D,
                A,
                er,
                ar,
                z ?? M,
                O ?? P,
                H,
              ]),
              workgroups: {
                x: nr(r, Math.ceil(t / 64), "dtrmv", "x"),
                y: nr(r, _, "dtrmv", "y"),
              },
            },
          ]),
          _ > 1 &&
            rr.push({
              pipeline: T,
              bindGroup: N(r, T.getBindGroupLayout(0), [z, O, M, P, W]),
              workgroups: Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            }))
        : ((H = j(
            r,
            [
              { value: t, type: "u32" },
              { value: tr, type: "u32" },
              { value: l, type: "u32" },
              { value: i, type: "u32" },
              { value: B ? 0 : 1, type: "u32" },
              { value: x ? 0 : 1, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
            ],
            "dtrmv-params",
          )),
          (rr = [
            {
              pipeline: S,
              bindGroup: N(r, S.getBindGroupLayout(0), [D, A, er, ar, M, P, H]),
              workgroups: Math.min(
                t,
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            },
          ])),
        F && rr.unshift(F.pass, K.pass));
      let { commandEncoder: X, ts: U } = Ar(r, rr);
      ((C = p ? null : I(r, X, M)), (q = p ? null : I(r, X, P)), $(r, X));
      let or = await Y(U);
      if (p) return or !== void 0 ? { gpuTimeMs: or } : {};
      let lr = await G(C, Float32Array);
      C = null;
      let sr = await G(q, Float32Array);
      q = null;
      let cr = _r(lr, sr, d);
      return or !== void 0 ? { y: cr, gpuTimeMs: or } : { y: cr };
    } finally {
      (!c && D && f(D),
        !c && A && f(A),
        !w && L && f(L),
        !w && E && f(E),
        !p && M && f(M),
        !p && P && f(P),
        H && f(H),
        z && f(z),
        O && f(O),
        W && f(W));
      for (let er of [F, K]) er && f(er.buffer, er.params);
      (C && f(C), q && f(q));
    }
  }
  function bn(r, a, e) {
    let o = new ArrayBuffer(r * a),
      t = new DataView(o);
    for (let s = 0; s < r; s++) {
      let i = e(s),
        u = s * a;
      i.forEach((n, d) => t.setUint32(u + d * 4, n, !0));
    }
    return o;
  }
  var yn = 48,
    xs = 2;
  function vs(r, a, e) {
    let o = r.createBuffer({
      label: e,
      size: a.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return (r.queue.writeBuffer(o, 0, a), o);
  }
  async function ks(r, a, e, o, t, s, i, u, n, d = "row-major") {
    let l = u instanceof Z,
      m = s instanceof ir,
      w = o === "unit";
    if ((J(r), Q(r, "dtrsv", { A: s, x: u }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (!w && o !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (d !== "row-major" && d !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (!Number.isInteger(t) || !Number.isInteger(n) || !Number.isInteger(i))
      throw new Error("n, incx, and lda must be integers.");
    if (n <= 0) throw new Error("incx must be positive.");
    if (i < t) throw new Error("lda must be >= n.");
    if (!m && !(s instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (m && s.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (!l && !(u instanceof Float64Array))
      throw new Error("x must be a Float64Array or GpuVector.");
    if (l && u.dtype !== Float64Array)
      throw new Error("x must be a Float64Array-backed GpuVector.");
    if (l && !m)
      throw new Error("A must be a GpuMatrix when x is a GpuVector.");
    if (m && !l)
      throw new Error("x must be a GpuVector when A is a GpuMatrix.");
    if (m && l && s._buf === u._buf)
      throw new Error("A and x must not reference the same GPU buffer.");
    if (m && i !== s.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (m && (s.rows < t || s.cols < t))
      throw new Error("A is too small for the given n.");
    if (t < 0) throw new Error("n must be non-negative.");
    if (t === 0) return l ? {} : { x: u };
    if (!m && s.length < (t - 1) * i + t)
      throw new Error(
        "A does not have enough elements for the given n and lda.",
      );
    if (u.length < (t - 1) * n + 1)
      throw new Error(
        "x does not have enough elements for the given n and incx.",
      );
    let c = (m ? s.layout : d) === "column-major",
      h = c ? a === "upper" : a === "lower",
      g = c ? e === "transpose" : e === "no-transpose",
      b = [
        "f64/dekker",
        "f64/utils/add",
        "f64/utils/multiply",
        "f64/utils/divide",
      ],
      x = await R(r, [...b, "dtrsv_small"], "dtrsv_small_main"),
      B = await R(
        r,
        [...b, "f64/utils/batch", "dtrsv_step"],
        "dtrsv_step_main",
      ),
      v = g === h,
      k = [];
    for (let U = 0; U < t; U += 64) k.push(U);
    v || k.reverse();
    let _ = k.length,
      S = r.limits.minUniformBufferOffsetAlignment,
      T = _ > xs && !l && (Ee(u, t, n) || Le(s, t, i, h, w)),
      D = _ <= xs || T,
      A = D ? null : await R(r, "scatter_strided"),
      L = g ? i : 1,
      E = g ? 1 : i,
      M = (U) =>
        bn(_, S, (or) => {
          let lr = or * 64,
            sr = Math.min(lr + 64, t),
            cr = v ? sr : 0,
            fr = v ? t - sr : lr;
          return [n, i, g ? 0 : 1, or, lr, sr, cr, fr, U];
        }),
      P = null,
      H = null,
      z = null,
      O = null,
      W = null,
      F = null,
      K = null,
      C = null,
      q = null,
      er = null,
      ar = null,
      tr = [],
      rr = null,
      X = null;
    try {
      if (m) ((P = s._buf), (H = s._loBuf));
      else {
        let xr = V(s);
        ((P = y(r, xr.hi, "dtrsv-AHi", !1)),
          (H = y(r, xr.lo, "dtrsv-ALo", !1)));
      }
      if (l) ((z = u._buf), (O = u._loBuf));
      else {
        let xr = V(u);
        ((z = y(r, xr.hi, "dtrsv-xHi", !0)),
          (O = y(r, xr.lo, "dtrsv-xLo", !0)));
      }
      ((K = dr(r, t * 4, "dtrsv-solHi")), (C = dr(r, t * 4, "dtrsv-solLo")));
      let { commandEncoder: U, querySet: or, passDescriptor: lr } = Cr(r),
        sr = U.beginComputePass(lr),
        cr = (xr, Dr, Nr) =>
          N(r, B.getBindGroupLayout(0), [
            P,
            H,
            xr,
            Dr,
            z,
            O,
            K,
            C,
            { buffer: q, offset: Nr * S, size: yn },
          ]);
      if (D) {
        _ > 1 && (q = vs(r, M(1), "dtrsv-step-params"));
        for (let xr of k) {
          let Dr = xr / 64,
            Nr = Math.min(xr + 64, t),
            pr = Nr - xr,
            wr = v ? t - Nr : xr,
            yr = j(
              r,
              [
                { value: pr, type: "u32" },
                { value: xr * (L + E), type: "u32" },
                { value: L, type: "u32" },
                { value: E, type: "u32" },
                { value: xr * n, type: "u32" },
                { value: n, type: "u32" },
                { value: v ? 0 : 1, type: "u32" },
                { value: w ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
                { value: wr > 0 ? 1 : 0, type: "u32" },
                { value: g ? 0 : 1, type: "u32" },
              ],
              "dtrsv-solve-params",
            );
          tr.push(yr);
          let Lr = (Pr) => ({ buffer: Pr, offset: xr * 4, size: pr * 4 });
          (sr.setPipeline(x),
            sr.setBindGroup(
              0,
              N(r, x.getBindGroupLayout(0), [P, H, z, O, Lr(K), Lr(C), yr]),
            ),
            sr.dispatchWorkgroups(1),
            wr !== 0 &&
              (sr.setPipeline(B),
              sr.setBindGroup(0, cr(P, H, Dr)),
              sr.dispatchWorkgroups(nr(r, Math.ceil(wr / 64), "dtrsv"))));
        }
      } else {
        ((W = dr(r, _ * 64 * 64 * 4, "dtrsv-AinvHi")),
          (F = dr(r, _ * 64 * 64 * 4, "dtrsv-AinvLo")),
          (q = vs(r, M(0), "dtrsv-step-params")),
          (er = j(
            r,
            [
              { value: t, type: "u32" },
              { value: 0, type: "u32" },
              { value: L, type: "u32" },
              { value: E, type: "u32" },
              { value: 0, type: "u32" },
              { value: 1, type: "u32" },
              { value: v ? 0 : 1, type: "u32" },
              { value: w ? 1 : 0, type: "u32" },
              { value: 1, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "dtrsv-invert-params",
          )),
          (ar = j(
            r,
            [
              { value: t, type: "u32" },
              { value: n, type: "u32" },
            ],
            "dtrsv-scatter-params",
          )),
          sr.setPipeline(x),
          sr.setBindGroup(
            0,
            N(r, x.getBindGroupLayout(0), [P, H, W, F, K, C, er]),
          ),
          sr.dispatchWorkgroups(64 / 4, nr(r, _, "dtrsv", "y")),
          sr.setPipeline(B));
        for (let xr of k) {
          let Dr = xr / 64,
            Nr = Math.min(xr + 64, t),
            pr = v ? t - Nr : xr;
          (sr.setBindGroup(0, cr(W, F, Dr)),
            sr.dispatchWorkgroups(
              nr(r, Math.max(1, Math.ceil(pr / 64)), "dtrsv"),
            ));
        }
        sr.setPipeline(A);
        for (let [xr, Dr] of [
          [K, z],
          [C, O],
        ])
          (sr.setBindGroup(0, N(r, A.getBindGroupLayout(0), [xr, Dr, ar])),
            sr.dispatchWorkgroups(
              Math.min(
                Math.ceil(t / 64),
                r.limits.maxComputeWorkgroupsPerDimension,
              ),
            ));
      }
      sr.end();
      let fr = Tr(r, U, or);
      ((rr = l ? null : I(r, U, z)), (X = l ? null : I(r, U, O)), $(r, U));
      let mr = await Y(fr);
      if (l) return mr !== void 0 ? { gpuTimeMs: mr } : {};
      let gr = await G(rr, Float32Array);
      rr = null;
      let kr = await G(X, Float32Array);
      X = null;
      let Ir = _r(gr, kr, u);
      return mr !== void 0 ? { x: Ir, gpuTimeMs: mr } : { x: Ir };
    } finally {
      (!m && P && f(P),
        !m && H && f(H),
        !l && z && f(z),
        !l && O && f(O),
        W && f(W),
        F && f(F),
        K && f(K),
        C && f(C),
        q && f(q),
        er && f(er),
        ar && f(ar),
        f(tr),
        rr && f(rr),
        X && f(X));
    }
  }
  async function Bs(r, a, e, o, t, s, i, u, n, d, l, m, w, p, c = "row-major") {
    let h = u instanceof ir,
      g = d instanceof ir,
      b = w instanceof ir;
    if (
      (J(r),
      Q(r, "dgemm", { A: u, B: d, C: w }),
      a !== "no-transpose" && a !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof m != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(m)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(s) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!h && !(u instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!g && !(d instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!b && !(w instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (h && u.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (g && d.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (b && w.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((h || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!h || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || l <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0 || t === 0) return b ? {} : { C: w };
    let x = h ? u.layout : c,
      B = g ? d.layout : c,
      v = b ? w.layout : c,
      k = x === "column-major" ? s : o,
      _ = x === "column-major" ? o : s,
      S = a === "no-transpose" ? k : _,
      T = a === "no-transpose" ? _ : k;
    if (n < T)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (h) {
      if (n !== u.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [rr, X] = a === "no-transpose" ? [o, s] : [s, o];
      if (u.rows < rr || u.cols < X)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (u.length < (S - 1) * n + T)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let D = B === "column-major" ? t : s,
      A = B === "column-major" ? s : t,
      L = e === "no-transpose" ? D : A,
      E = e === "no-transpose" ? A : D;
    if (l < E)
      throw new Error(
        `ldb must be >= ${B === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (l !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [rr, X] = e === "no-transpose" ? [s, t] : [t, s];
      if (d.rows < rr || d.cols < X)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (L - 1) * l + E)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let M = v === "column-major" ? t : o,
      P = v === "column-major" ? o : t;
    if (p < P)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (p !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < o || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (M - 1) * p + P)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    if (
      (x === "column-major" &&
        (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([u, d] = [d, u]),
        ([h, g] = [g, h]),
        ([n, l] = [l, n]),
        ([a, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          a === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([o, t] = [t, o])),
      (i === 0 || s === 0) && m === 1)
    )
      return b ? {} : { C: w };
    let z = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      O = null,
      W = null,
      F = null,
      K = null,
      C = null,
      q = null,
      er = null,
      ar = null,
      tr = null;
    try {
      if (h) ((O = u._buf), (W = u._loBuf));
      else {
        let wr = V(u);
        ((O = y(r, wr.hi, "dgemm-AHi", !1)),
          (W = y(r, wr.lo, "dgemm-ALo", !1)));
      }
      if (g) ((F = d._buf), (K = d._loBuf));
      else {
        let wr = V(d);
        ((F = y(r, wr.hi, "dgemm-BHi", !1)),
          (K = y(r, wr.lo, "dgemm-BLo", !1)));
      }
      if (b) ((C = w._buf), (q = w._loBuf));
      else {
        let wr = V(w);
        ((C = y(r, wr.hi, "dgemm-CHi", !0)),
          (q = y(r, wr.lo, "dgemm-CLo", !0)));
      }
      let rr = a === "no-transpose",
        X = e === "no-transpose",
        U = rr && Er(O, n, o, s),
        or = Er(F, l, X ? s : t, X ? t : s),
        { hi: lr, lo: sr } = V(new Float64Array([i])),
        { hi: cr, lo: fr } = V(new Float64Array([m]));
      er = j(
        r,
        [
          { value: o, type: "u32" },
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: lr[0], type: "f32" },
          { value: sr[0], type: "f32" },
          { value: cr[0], type: "f32" },
          { value: fr[0], type: "f32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: p, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: U ? 1 : 0, type: "u32" },
          { value: or ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "dgemm-params",
      );
      let mr = N(r, z.getBindGroupLayout(0), [
          O,
          Br(r, O),
          W,
          F,
          Br(r, F),
          K,
          C,
          q,
          er,
        ]),
        gr = {
          x: nr(r, Math.ceil(t / 32), "dgemm", "x"),
          y: nr(r, Math.ceil(o / 32), "dgemm", "y"),
        },
        { commandEncoder: kr, ts: Ir } = Sr(r, z, mr, gr);
      ((ar = b ? null : I(r, kr, C)), (tr = b ? null : I(r, kr, q)), $(r, kr));
      let xr = await Y(Ir);
      if (b) return xr !== void 0 ? { gpuTimeMs: xr } : {};
      let Dr = await G(ar, Float32Array);
      ar = null;
      let Nr = await G(tr, Float32Array);
      tr = null;
      let pr = _r(Dr, Nr, w);
      return xr !== void 0 ? { C: pr, gpuTimeMs: xr } : { C: pr };
    } finally {
      (!h && O && f(O),
        !h && W && f(W),
        !g && F && f(F),
        !g && K && f(K),
        !b && C && f(C),
        !b && q && f(q),
        er && f(er),
        ar && f(ar),
        tr && f(tr));
    }
  }
  async function _s(
    r,
    a,
    e,
    o,
    t,
    s,
    i,
    u,
    n,
    d,
    l,
    m,
    w,
    p,
    c,
    h = "row-major",
  ) {
    let g = n instanceof ir,
      b = l instanceof ir,
      x = p instanceof ir;
    if (
      (J(r),
      Q(r, "dgemmtr", { A: n, B: l, C: p }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (h !== "row-major" && h !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (typeof w != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(w)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(w)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!b && !(l instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!x && !(p instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (g && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (b && l.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (x && p.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((g || b) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!g || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || s < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || s === 0) return x ? {} : { C: p };
    let B = g ? n.layout : h,
      v = b ? l.layout : h,
      k = x ? p.layout : h,
      _ = B === "column-major" ? i : t,
      S = B === "column-major" ? t : i,
      T = e === "no-transpose" ? _ : S,
      D = e === "no-transpose" ? S : _;
    if (d < D)
      throw new Error(
        `lda must be >= ${B === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [X, U] = e === "no-transpose" ? [t, i] : [i, t];
      if (n.rows < X || n.cols < U)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (T - 1) * d + D)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = v === "column-major" ? s : i,
      L = v === "column-major" ? i : s,
      E = o === "no-transpose" ? A : L,
      M = o === "no-transpose" ? L : A;
    if (m < M)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [X, U] = o === "no-transpose" ? [i, s] : [s, i];
      if (l.rows < X || l.cols < U)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (E - 1) * m + M)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let P = k === "column-major" ? s : t,
      H = k === "column-major" ? t : s;
    if (c < H)
      throw new Error(
        `ldc must be >= ${k === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (c !== p.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (p.rows < t || p.cols < s)
        throw new Error("C is too small for the given m and n.");
    } else if (p.length < (P - 1) * c + H)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    if (
      (B === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      k === "column-major" &&
        (([n, l] = [l, n]),
        ([g, b] = [b, g]),
        ([d, m] = [m, d]),
        ([e, o] = [
          o === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, s] = [s, t]),
        (a = a === "lower" ? "upper" : "lower")),
      (u === 0 || i === 0) && w === 1)
    )
      return x ? {} : { C: p };
    let O = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      W = null,
      F = null,
      K = null,
      C = null,
      q = null,
      er = null,
      ar = null,
      tr = null,
      rr = null;
    try {
      if (g) ((W = n._buf), (F = n._loBuf));
      else {
        let yr = V(n);
        ((W = y(r, yr.hi, "dgemmtr-AHi", !1)),
          (F = y(r, yr.lo, "dgemmtr-ALo", !1)));
      }
      if (b) ((K = l._buf), (C = l._loBuf));
      else {
        let yr = V(l);
        ((K = y(r, yr.hi, "dgemmtr-BHi", !1)),
          (C = y(r, yr.lo, "dgemmtr-BLo", !1)));
      }
      if (x) ((q = p._buf), (er = p._loBuf));
      else {
        let yr = V(p);
        ((q = y(r, yr.hi, "dgemmtr-CHi", !0)),
          (er = y(r, yr.lo, "dgemmtr-CLo", !0)));
      }
      let X = e === "no-transpose",
        U = o === "no-transpose",
        or = X && Er(W, d, t, i),
        lr = Er(K, m, U ? i : s, U ? s : i),
        { hi: sr, lo: cr } = V(new Float64Array([u])),
        { hi: fr, lo: mr } = V(new Float64Array([w]));
      ar = j(
        r,
        [
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: i, type: "u32" },
          { value: sr[0], type: "f32" },
          { value: cr[0], type: "f32" },
          { value: fr[0], type: "f32" },
          { value: mr[0], type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: c, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: or ? 1 : 0, type: "u32" },
          { value: lr ? 1 : 0, type: "u32" },
          { value: a === "lower" ? 1 : 2, type: "u32" },
        ],
        "dgemmtr-params",
      );
      let gr = N(r, O.getBindGroupLayout(0), [
          W,
          Br(r, W),
          F,
          K,
          Br(r, K),
          C,
          q,
          er,
          ar,
        ]),
        kr = {
          x: nr(r, Math.ceil(s / 32), "dgemmtr", "x"),
          y: nr(r, Math.ceil(t / 32), "dgemmtr", "y"),
        },
        { commandEncoder: Ir, ts: xr } = Sr(r, O, gr, kr);
      ((tr = x ? null : I(r, Ir, q)), (rr = x ? null : I(r, Ir, er)), $(r, Ir));
      let Dr = await Y(xr);
      if (x) return Dr !== void 0 ? { gpuTimeMs: Dr } : {};
      let Nr = await G(tr, Float32Array);
      tr = null;
      let pr = await G(rr, Float32Array);
      rr = null;
      let wr = _r(Nr, pr, p);
      return Dr !== void 0 ? { C: wr, gpuTimeMs: Dr } : { C: wr };
    } finally {
      (!g && W && f(W),
        !g && F && f(F),
        !b && K && f(K),
        !b && C && f(C),
        !x && q && f(q),
        !x && er && f(er),
        ar && f(ar),
        tr && f(tr),
        rr && f(rr));
    }
  }
  async function As(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = i instanceof ir,
      p = d instanceof ir;
    if ((J(r), Q(r, "dsyrk", { A: i, C: d }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!w && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!p && !(d instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (w && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (p && d.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if (w && !p)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (p && !w)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || l <= 0) throw new Error("lda and ldc must be positive.");
    if (o === 0) return p ? {} : { C: d };
    let c = w ? i.layout : m,
      h = p ? d.layout : m,
      g = c === "column-major" ? t : o,
      b = c === "column-major" ? o : t,
      x = e === "no-transpose" ? g : b,
      B = e === "no-transpose" ? b : g;
    if (u < B)
      throw new Error(
        `lda must be >= ${c === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [W, F] = e === "no-transpose" ? [o, t] : [t, o];
      if (i.rows < W || i.cols < F)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (x - 1) * u + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (l < o) throw new Error("ldc must be >= n.");
    if (p) {
      if (l !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < o || d.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (o - 1) * l + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let v = e;
    c === "column-major" &&
      (v = v === "no-transpose" ? "transpose" : "no-transpose");
    let k = v === "no-transpose" ? "transpose" : "no-transpose",
      _ = a;
    if (
      (h === "column-major" &&
        (([v, k] = [
          k === "no-transpose" ? "transpose" : "no-transpose",
          v === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        (_ = _ === "lower" ? "upper" : "lower")),
      (s === 0 || t === 0) && n === 1)
    )
      return p ? {} : { C: d };
    let T = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      D = null,
      A = null,
      L = null,
      E = null,
      M = null,
      P = null,
      H = null,
      z = null,
      O = null;
    try {
      if (w)
        ((D = i._buf),
          (A = i._loBuf),
          (L = dr(r, D.size, "dsyrk-BHi", GPUBufferUsage.COPY_DST)),
          (E = dr(r, A.size, "dsyrk-BLo", GPUBufferUsage.COPY_DST)));
      else {
        let kr = V(i);
        ((D = y(r, kr.hi, "dsyrk-AHi", !1)),
          (A = y(r, kr.lo, "dsyrk-ALo", !1)),
          (L = y(r, kr.hi, "dsyrk-BHi", !1)),
          (E = y(r, kr.lo, "dsyrk-BLo", !1)));
      }
      if (p) ((M = d._buf), (P = d._loBuf));
      else {
        let kr = V(d);
        ((M = y(r, kr.hi, "dsyrk-CHi", !0)),
          (P = y(r, kr.lo, "dsyrk-CLo", !0)));
      }
      let W = v === "no-transpose",
        F = k === "no-transpose",
        K = W && Er(D, u, o, t),
        C = Er(L, u, F ? t : o, F ? o : t),
        { hi: q, lo: er } = V(new Float64Array([s])),
        { hi: ar, lo: tr } = V(new Float64Array([n]));
      H = j(
        r,
        [
          { value: o, type: "u32" },
          { value: o, type: "u32" },
          { value: t, type: "u32" },
          { value: q[0], type: "f32" },
          { value: er[0], type: "f32" },
          { value: ar[0], type: "f32" },
          { value: tr[0], type: "f32" },
          { value: u, type: "u32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: v === "transpose" ? 1 : 0, type: "u32" },
          { value: k === "transpose" ? 1 : 0, type: "u32" },
          { value: K ? 1 : 0, type: "u32" },
          { value: C ? 1 : 0, type: "u32" },
          { value: _ === "lower" ? 1 : 2, type: "u32" },
        ],
        "dsyrk-params",
      );
      let rr = N(r, T.getBindGroupLayout(0), [
          D,
          Br(r, D),
          A,
          L,
          Br(r, L),
          E,
          M,
          P,
          H,
        ]),
        X = {
          x: nr(r, Math.ceil(o / 32), "dsyrk", "x"),
          y: nr(r, Math.ceil(o / 32), "dsyrk", "y"),
        },
        { commandEncoder: U, querySet: or, passDescriptor: lr } = Cr(r);
      (w &&
        (U.copyBufferToBuffer(D, 0, L, 0, D.size),
        U.copyBufferToBuffer(A, 0, E, 0, A.size)),
        Mr(U, T, rr, X, lr));
      let sr = Tr(r, U, or);
      ((z = p ? null : I(r, U, M)), (O = p ? null : I(r, U, P)), $(r, U));
      let cr = await Y(sr);
      if (p) return cr !== void 0 ? { gpuTimeMs: cr } : {};
      let fr = await G(z, Float32Array);
      z = null;
      let mr = await G(O, Float32Array);
      O = null;
      let gr = _r(fr, mr, d);
      return cr !== void 0 ? { C: gr, gpuTimeMs: cr } : { C: gr };
    } finally {
      (!w && D && f(D),
        !w && A && f(A),
        L && f(L),
        E && f(E),
        !p && M && f(M),
        !p && P && f(P),
        H && f(H),
        z && f(z),
        O && f(O));
    }
  }
  async function Es(r, a, e, o, t, s, i, u, n, d, l, m, w, p = "row-major") {
    let c = i instanceof ir,
      h = n instanceof ir,
      g = m instanceof ir;
    if (
      (J(r),
      Q(r, "dsyr2k", { A: i, B: n, C: m }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!c && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!h && !(n instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!g && !(m instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (c && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (h && n.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (g && m.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((c || h) && !g)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (g && (!c || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || d <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0) return g ? {} : { C: m };
    let b = c ? i.layout : p,
      x = h ? n.layout : p,
      B = g ? m.layout : p,
      v = b === "column-major" ? t : o,
      k = b === "column-major" ? o : t,
      _ = e === "no-transpose" ? v : k,
      S = e === "no-transpose" ? k : v;
    if (u < S)
      throw new Error(
        `lda must be >= ${b === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (c) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [lr, sr] = e === "no-transpose" ? [o, t] : [t, o];
      if (i.rows < lr || i.cols < sr)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (_ - 1) * u + S)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let T = x === "column-major" ? t : o,
      D = x === "column-major" ? o : t,
      A = e === "no-transpose" ? T : D,
      L = e === "no-transpose" ? D : T;
    if (d < L)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [lr, sr] = e === "no-transpose" ? [o, t] : [t, o];
      if (n.rows < lr || n.cols < sr)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (A - 1) * d + L)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (w < o) throw new Error("ldc must be >= n.");
    if (g) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (m.length < (o - 1) * w + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let E = (lr) => (lr === "no-transpose" ? "transpose" : "no-transpose"),
      M = b === "column-major" ? E(e) : e,
      P = x === "column-major" ? E(e) : e,
      H = B === "column-major" ? (a === "lower" ? "upper" : "lower") : a;
    function z(lr, sr, cr, fr) {
      let mr = lr,
        gr = E(cr);
      return B !== "column-major"
        ? { transX: mr, X: sr, transY: gr, Y: fr }
        : { transX: E(gr), X: fr, transY: E(mr), Y: sr };
    }
    if ((s === 0 || t === 0) && l === 1) return g ? {} : { C: m };
    let W = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      F = {
        x: nr(r, Math.ceil(o / 32), "dsyr2k", "x"),
        y: nr(r, Math.ceil(o / 32), "dsyr2k", "y"),
      },
      K = null,
      C = null,
      q = null,
      er = null,
      ar = null,
      tr = null,
      rr = null,
      X = null,
      U = null,
      or = null;
    try {
      if (c) ((K = i._buf), (C = i._loBuf));
      else {
        let vr = V(i);
        ((K = y(r, vr.hi, "dsyr2k-AHi", !1)),
          (C = y(r, vr.lo, "dsyr2k-ALo", !1)));
      }
      if (h) ((q = n._buf), (er = n._loBuf));
      else {
        let vr = V(n);
        ((q = y(r, vr.hi, "dsyr2k-BHi", !1)),
          (er = y(r, vr.lo, "dsyr2k-BLo", !1)));
      }
      if (g) ((ar = m._buf), (tr = m._loBuf));
      else {
        let vr = V(m);
        ((ar = y(r, vr.hi, "dsyr2k-CHi", !0)),
          (tr = y(r, vr.lo, "dsyr2k-CLo", !0)));
      }
      let lr = { hi: K, lo: C, ld: u },
        sr = { hi: q, lo: er, ld: d },
        cr = z(M, lr, P, sr),
        fr = z(P, sr, M, lr),
        { hi: mr, lo: gr } = V(new Float64Array([s])),
        kr = (vr, Yr, me) => {
          let re = vr.transX === "no-transpose",
            Vr = vr.transY === "no-transpose",
            ue = re && Er(vr.X.hi, vr.X.ld, o, t),
            Se = Er(vr.Y.hi, vr.Y.ld, Vr ? t : o, Vr ? o : t),
            { hi: De, lo: pe } = V(new Float64Array([Yr]));
          return j(
            r,
            [
              { value: o, type: "u32" },
              { value: o, type: "u32" },
              { value: t, type: "u32" },
              { value: mr[0], type: "f32" },
              { value: gr[0], type: "f32" },
              { value: De[0], type: "f32" },
              { value: pe[0], type: "f32" },
              { value: vr.X.ld, type: "u32" },
              { value: vr.Y.ld, type: "u32" },
              { value: w, type: "u32" },
              { value: vr.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: vr.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: ue ? 1 : 0, type: "u32" },
              { value: Se ? 1 : 0, type: "u32" },
              { value: H === "lower" ? 1 : 2, type: "u32" },
            ],
            me,
          );
        };
      ((rr = kr(cr, l, "dsyr2k-params1")), (X = kr(fr, 1, "dsyr2k-params2")));
      let Ir = (vr, Yr) =>
          N(r, W.getBindGroupLayout(0), [
            vr.X.hi,
            Br(r, vr.X.hi),
            vr.X.lo,
            vr.Y.hi,
            Br(r, vr.Y.hi),
            vr.Y.lo,
            ar,
            tr,
            Yr,
          ]),
        xr = Ir(cr, rr),
        Dr = Ir(fr, X),
        { commandEncoder: Nr, querySet: pr } = Cr(r),
        wr = pr
          ? { timestampWrites: { querySet: pr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        yr = pr
          ? { timestampWrites: { querySet: pr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(Nr, W, xr, F, wr), Mr(Nr, W, Dr, F, yr));
      let Lr = Tr(r, Nr, pr);
      ((U = g ? null : I(r, Nr, ar)), (or = g ? null : I(r, Nr, tr)), $(r, Nr));
      let Pr = await Y(Lr);
      if (g) return Pr !== void 0 ? { gpuTimeMs: Pr } : {};
      let Kr = await G(U, Float32Array);
      U = null;
      let Qr = await G(or, Float32Array);
      or = null;
      let qr = _r(Kr, Qr, m);
      return Pr !== void 0 ? { C: qr, gpuTimeMs: Pr } : { C: qr };
    } finally {
      (!c && K && f(K),
        !c && C && f(C),
        !h && q && f(q),
        !h && er && f(er),
        !g && ar && f(ar),
        !g && tr && f(tr),
        rr && f(rr),
        X && f(X),
        U && f(U),
        or && f(or));
    }
  }
  async function Ls(r, a, e, o, t, s, i, u, n, d, l, m, w, p = "row-major") {
    let c = i instanceof ir,
      h = n instanceof ir,
      g = m instanceof ir;
    if (
      (J(r), Q(r, "dsymm", { A: i, B: n, C: m }), a !== "left" && a !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!c && !(i instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!h && !(n instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (!g && !(m instanceof Float64Array))
      throw new Error("C must be a Float64Array or GpuMatrix.");
    if (c && i.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (h && n.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (g && m.dtype !== Float64Array)
      throw new Error("C must be a Float64Array-backed GpuMatrix.");
    if ((c || h) && !g)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (g && (!c || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || t === 0) return g ? {} : { C: m };
    let b = c ? i.layout : p,
      x = h ? n.layout : p,
      B = g ? m.layout : p,
      v = a === "left" ? o : t;
    if (u < v)
      throw new Error("lda must be >= " + (a === "left" ? "m" : "n") + ".");
    if (c) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (i.rows < v || i.cols < v)
        throw new Error("A is too small for the given m/n and side.");
    } else if (i.length < (v - 1) * u + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let k = x === "column-major" ? t : o,
      _ = x === "column-major" ? o : t;
    if (d < _)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < o || n.cols < t)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (k - 1) * d + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let S = B === "column-major" ? t : o,
      T = B === "column-major" ? o : t;
    if (w < T)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (g) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (S - 1) * w + T)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    if (s === 0 && l === 1) return g ? {} : { C: m };
    let D = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      A = x === "column-major" ? "transpose" : "no-transpose",
      L = "no-transpose",
      E = o,
      M = t,
      P = v,
      H = a === "left" ? L : A,
      z = a === "left" ? A : L,
      O = (Ir) => (Ir === "no-transpose" ? "transpose" : "no-transpose"),
      W = a === "right";
    B === "column-major" &&
      (([H, z] = [O(z), O(H)]), (W = !W), ([E, M] = [M, E]));
    let K = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      C = await R(r, "symmetrize"),
      q = {
        x: nr(r, Math.ceil(M / 32), "dsymm", "x"),
        y: nr(r, Math.ceil(E / 32), "dsymm", "y"),
      },
      er = { x: Math.ceil(v / 8), y: Math.ceil(v / 8) },
      ar = v,
      tr = null,
      rr = null,
      X = null,
      U = null,
      or = null,
      lr = null,
      sr = null,
      cr = null,
      fr = null,
      mr = null,
      gr = null,
      kr = null;
    try {
      if (c) ((tr = i._buf), (rr = i._loBuf));
      else {
        let ce = V(i);
        ((tr = y(r, ce.hi, "dsymm-AHi", !1)),
          (rr = y(r, ce.lo, "dsymm-ALo", !1)));
      }
      if (h) ((X = n._buf), (U = n._loBuf));
      else {
        let ce = V(n);
        ((X = y(r, ce.hi, "dsymm-BHi", !1)),
          (U = y(r, ce.lo, "dsymm-BLo", !1)));
      }
      if (g) ((or = m._buf), (lr = m._loBuf));
      else {
        let ce = V(m);
        ((or = y(r, ce.hi, "dsymm-CHi", !0)),
          (lr = y(r, ce.lo, "dsymm-CLo", !0)));
      }
      ((sr = dr(r, v * ar * 4, "dsymm-AdenseHi")),
        (cr = dr(r, v * ar * 4, "dsymm-AdenseLo")),
        (fr = j(
          r,
          [
            { value: v, type: "u32" },
            { value: u, type: "u32" },
            { value: ar, type: "u32" },
            { value: D === "upper" ? 1 : 0, type: "u32" },
          ],
          "dsymm-sym-params",
        )));
      let Ir = C.getBindGroupLayout(0),
        xr = N(r, Ir, [tr, sr, fr]),
        Dr = N(r, Ir, [rr, cr, fr]),
        Nr = { hi: sr, lo: cr, ld: ar },
        pr = { hi: X, lo: U, ld: d },
        wr = W ? pr : Nr,
        yr = W ? Nr : pr,
        Lr = H === "no-transpose",
        Pr = z === "no-transpose",
        Kr = Lr && Er(wr.hi, wr.ld, E, P),
        Qr = Er(yr.hi, yr.ld, Pr ? P : M, Pr ? M : P),
        { hi: qr, lo: vr } = V(new Float64Array([s])),
        { hi: Yr, lo: me } = V(new Float64Array([l]));
      mr = j(
        r,
        [
          { value: E, type: "u32" },
          { value: M, type: "u32" },
          { value: P, type: "u32" },
          { value: qr[0], type: "f32" },
          { value: vr[0], type: "f32" },
          { value: Yr[0], type: "f32" },
          { value: me[0], type: "f32" },
          { value: wr.ld, type: "u32" },
          { value: yr.ld, type: "u32" },
          { value: w, type: "u32" },
          { value: H === "transpose" ? 1 : 0, type: "u32" },
          { value: z === "transpose" ? 1 : 0, type: "u32" },
          { value: Kr ? 1 : 0, type: "u32" },
          { value: Qr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "dsymm-gemm-params",
      );
      let re = N(r, K.getBindGroupLayout(0), [
          wr.hi,
          Br(r, wr.hi),
          wr.lo,
          yr.hi,
          Br(r, yr.hi),
          yr.lo,
          or,
          lr,
          mr,
        ]),
        { commandEncoder: Vr, querySet: ue } = Cr(r),
        Se = ue
          ? { timestampWrites: { querySet: ue, beginningOfPassWriteIndex: 0 } }
          : void 0,
        De = ue
          ? { timestampWrites: { querySet: ue, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(Vr, C, xr, er, Se), Mr(Vr, C, Dr, er), Mr(Vr, K, re, q, De));
      let pe = Tr(r, Vr, ue);
      ((gr = g ? null : I(r, Vr, or)),
        (kr = g ? null : I(r, Vr, lr)),
        $(r, Vr));
      let be = await Y(pe);
      if (g) return be !== void 0 ? { gpuTimeMs: be } : {};
      let qe = await G(gr, Float32Array);
      gr = null;
      let Re = await G(kr, Float32Array);
      kr = null;
      let se = _r(qe, Re, m);
      return be !== void 0 ? { C: se, gpuTimeMs: be } : { C: se };
    } finally {
      (!c && tr && f(tr),
        !c && rr && f(rr),
        !h && X && f(X),
        !h && U && f(U),
        !g && or && f(or),
        !g && lr && f(lr),
        sr && f(sr),
        cr && f(cr),
        fr && f(fr),
        mr && f(mr),
        gr && f(gr),
        kr && f(kr));
    }
  }
  async function Ss(r, a, e, o, t, s, i, u, n, d, l, m, w = "row-major") {
    let p = n instanceof ir,
      c = l instanceof ir,
      h = t === "unit";
    if ((J(r), Q(r, "dtrmm", { A: n, B: l }), a !== "left" && a !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!h && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!p && !(n instanceof Float64Array))
      throw new Error("A must be a Float64Array or GpuMatrix.");
    if (!c && !(l instanceof Float64Array))
      throw new Error("B must be a Float64Array or GpuMatrix.");
    if (p && n.dtype !== Float64Array)
      throw new Error("A must be a Float64Array-backed GpuMatrix.");
    if (c && l.dtype !== Float64Array)
      throw new Error("B must be a Float64Array-backed GpuMatrix.");
    if (p !== c)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float64Array.",
      );
    if (s < 0 || i < 0) throw new Error("m and n must be non-negative.");
    if (s === 0 || i === 0) return c ? {} : { B: l };
    let g = p ? n.layout : w,
      b = c ? l.layout : w,
      x = a === "left" ? s : i;
    if (d < x)
      throw new Error("lda must be >= " + (a === "left" ? "m" : "n") + ".");
    if (p) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * d + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let B = b === "column-major" ? i : s,
      v = b === "column-major" ? s : i;
    if (m < v)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (c) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < s || l.cols < i)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (B - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let k = g === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      _ =
        g === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      S = b === "column-major" ? "transpose" : "no-transpose",
      T = "no-transpose",
      D = s,
      A = i,
      L = x,
      E = a === "left" ? T : S,
      M = a === "left" ? S : T,
      P = (kr) => (kr === "no-transpose" ? "transpose" : "no-transpose"),
      H = a === "right";
    b === "column-major" &&
      (([E, M] = [P(M), P(E)]), (H = !H), ([D, A] = [A, D]));
    let O = await R(
        r,
        [
          ...["f64/dekker", "f64/utils/add", "f64/utils/multiply"],
          "f64/utils/batch",
          "dgemm_small",
        ],
        "main",
      ),
      W = await R(r, "triangularize"),
      F = {
        x: nr(r, Math.ceil(A / 32), "dtrmm", "x"),
        y: nr(r, Math.ceil(D / 32), "dtrmm", "y"),
      },
      K = { x: Math.ceil(x / 8), y: Math.ceil(x / 8) },
      C = x,
      q = null,
      er = null,
      ar = null,
      tr = null,
      rr = null,
      X = null,
      U = null,
      or = null,
      lr = null,
      sr = null,
      cr = null,
      fr = null,
      mr = null,
      gr = !1;
    try {
      if (p) ((q = n._buf), (er = n._loBuf));
      else {
        let se = V(n);
        ((q = y(r, se.hi, "dtrmm-AHi", !1)),
          (er = y(r, se.lo, "dtrmm-ALo", !1)));
      }
      if (c) ((ar = l._buf), (tr = l._loBuf));
      else {
        let se = V(l);
        ((ar = y(r, se.hi, "dtrmm-BHi", !0)),
          (tr = y(r, se.lo, "dtrmm-BLo", !0)));
      }
      ((rr = dr(r, x * C * 4, "dtrmm-AdenseHi")),
        (X = dr(r, x * C * 4, "dtrmm-AdenseLo")));
      let kr = GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
      ((U = dr(r, ar.size, "dtrmm-outHi", kr)),
        (or = dr(r, tr.size, "dtrmm-outLo", kr)));
      let Ir = (se) => [
        { value: x, type: "u32" },
        { value: d, type: "u32" },
        { value: C, type: "u32" },
        { value: k === "upper" ? 1 : 0, type: "u32" },
        { value: _ === "transpose" ? 1 : 0, type: "u32" },
        { value: se, type: "u32" },
      ];
      ((lr = j(r, Ir(h ? 1 : 0), "dtrmm-tri-hi-params")),
        (sr = j(r, Ir(h ? 2 : 0), "dtrmm-tri-lo-params")));
      let xr = W.getBindGroupLayout(0),
        Dr = N(r, xr, [q, rr, lr]),
        Nr = N(r, xr, [er, X, sr]),
        pr = { hi: rr, lo: X, ld: C },
        wr = { hi: ar, lo: tr, ld: m },
        yr = H ? wr : pr,
        Lr = H ? pr : wr,
        Pr = E === "no-transpose",
        Kr = M === "no-transpose",
        Qr = Pr && Er(yr.hi, yr.ld, D, L),
        qr = Er(Lr.hi, Lr.ld, Kr ? L : A, Kr ? A : L),
        { hi: vr, lo: Yr } = V(new Float64Array([u]));
      cr = j(
        r,
        [
          { value: D, type: "u32" },
          { value: A, type: "u32" },
          { value: L, type: "u32" },
          { value: vr[0], type: "f32" },
          { value: Yr[0], type: "f32" },
          { value: 0, type: "f32" },
          { value: 0, type: "f32" },
          { value: yr.ld, type: "u32" },
          { value: Lr.ld, type: "u32" },
          { value: m, type: "u32" },
          { value: E === "transpose" ? 1 : 0, type: "u32" },
          { value: M === "transpose" ? 1 : 0, type: "u32" },
          { value: Qr ? 1 : 0, type: "u32" },
          { value: qr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "dtrmm-gemm-params",
      );
      let me = N(r, O.getBindGroupLayout(0), [
          yr.hi,
          Br(r, yr.hi),
          yr.lo,
          Lr.hi,
          Br(r, Lr.hi),
          Lr.lo,
          U,
          or,
          cr,
        ]),
        { commandEncoder: re, querySet: Vr } = Cr(r);
      (re.copyBufferToBuffer(ar, 0, U, 0, ar.size),
        re.copyBufferToBuffer(tr, 0, or, 0, tr.size));
      let ue = Vr
          ? { timestampWrites: { querySet: Vr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Se = Vr
          ? { timestampWrites: { querySet: Vr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(re, W, Dr, K, ue), Mr(re, W, Nr, K), Mr(re, O, me, F, Se));
      let De = Tr(r, re, Vr);
      ((fr = c ? null : I(r, re, U)), (mr = c ? null : I(r, re, or)), $(r, re));
      let pe = await Y(De);
      if (c)
        return (
          f(l._buf, l._loBuf),
          (l._buf = U),
          (l._loBuf = or),
          (gr = !0),
          pe !== void 0 ? { gpuTimeMs: pe } : {}
        );
      let be = await G(fr, Float32Array);
      fr = null;
      let qe = await G(mr, Float32Array);
      mr = null;
      let Re = _r(be, qe, l);
      return pe !== void 0 ? { B: Re, gpuTimeMs: pe } : { B: Re };
    } finally {
      (!p && q && f(q),
        !p && er && f(er),
        !c && ar && f(ar),
        !c && tr && f(tr),
        rr && f(rr),
        X && f(X),
        U && !gr && f(U),
        or && !gr && f(or),
        lr && f(lr),
        sr && f(sr),
        cr && f(cr),
        fr && f(fr),
        mr && f(mr));
    }
  }
  async function Ds(r, a, e, o, t, s, i, u, n, d, l, m, w, p, c = "row-major") {
    let h = u instanceof ir,
      g = d instanceof ir,
      b = w instanceof ir;
    if (
      (J(r),
      Q(r, "sgemm", { A: u, B: d, C: w }),
      a !== "no-transpose" && a !== "transpose")
    )
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (c !== "row-major" && c !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof i != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(i)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(i)) throw new Error("alpha must be finite.");
    if (typeof m != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(m)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(m)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(s) ||
      !Number.isInteger(n) ||
      !Number.isInteger(l) ||
      !Number.isInteger(p)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!h && !(u instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!g && !(d instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!b && !(w instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((h || g) && !b)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (b && (!h || !g))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0 || s < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (n <= 0 || l <= 0 || p <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0 || t === 0) return b ? {} : { C: w };
    let x = h ? u.layout : c,
      B = g ? d.layout : c,
      v = b ? w.layout : c,
      k = x === "column-major" ? s : o,
      _ = x === "column-major" ? o : s,
      S = a === "no-transpose" ? k : _,
      T = a === "no-transpose" ? _ : k;
    if (n < T)
      throw new Error(
        `lda must be >= ${x === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (h) {
      if (n !== u.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [X, U] = a === "no-transpose" ? [o, s] : [s, o];
      if (u.rows < X || u.cols < U)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (u.length < (S - 1) * n + T)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let D = B === "column-major" ? t : s,
      A = B === "column-major" ? s : t,
      L = e === "no-transpose" ? D : A,
      E = e === "no-transpose" ? A : D;
    if (l < E)
      throw new Error(
        `ldb must be >= ${B === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (g) {
      if (l !== d.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [X, U] = e === "no-transpose" ? [s, t] : [t, s];
      if (d.rows < X || d.cols < U)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (d.length < (L - 1) * l + E)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let M = v === "column-major" ? t : o,
      P = v === "column-major" ? o : t;
    if (p < P)
      throw new Error(
        `ldc must be >= ${v === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (b) {
      if (p !== w.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (w.rows < o || w.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (w.length < (M - 1) * p + P)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (x === "column-major" &&
      (a = a === "no-transpose" ? "transpose" : "no-transpose"),
      B === "column-major" &&
        (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (([u, d] = [d, u]),
        ([h, g] = [g, h]),
        ([n, l] = [l, n]),
        ([a, e] = [
          e === "no-transpose" ? "transpose" : "no-transpose",
          a === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([o, t] = [t, o])));
    let H = Math.ceil(t / 64),
      z = Math.ceil(o / 64),
      O = H * z >= 36,
      W = await R(r, O ? "sgemm_large" : "sgemm_small"),
      F = h ? u._buf : y(r, u, "sgemm-A", !1),
      K = g ? d._buf : y(r, d, "sgemm-B", !1),
      C = b ? w._buf : y(r, w, "sgemm-C", !0),
      q = a === "no-transpose",
      er = e === "no-transpose",
      ar = Er(F, n, q ? o : s, q ? s : o),
      tr = Er(K, l, er ? s : t, er ? t : s),
      rr = j(
        r,
        [
          { value: o, type: "u32" },
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: i, type: "f32" },
          { value: m, type: "f32" },
          { value: n, type: "u32" },
          { value: l, type: "u32" },
          { value: p, type: "u32" },
          { value: a === "transpose" ? 1 : 0, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: ar ? 1 : 0, type: "u32" },
          { value: tr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemm-params",
      );
    try {
      let X = N(r, W.getBindGroupLayout(0), [F, Br(r, F), K, Br(r, K), C, rr]),
        U = O
          ? { x: nr(r, H, "sgemm", "x"), y: nr(r, z, "sgemm", "y") }
          : {
              x: nr(r, Math.ceil(t / 32), "sgemm", "x"),
              y: nr(r, Math.ceil(o / 32), "sgemm", "y"),
            },
        { commandEncoder: or, ts: lr } = Sr(r, W, X, U),
        sr = b ? null : I(r, or, C);
      $(r, or);
      let cr = await Y(lr);
      if (b) return cr !== void 0 ? { gpuTimeMs: cr } : {};
      let fr = await G(sr, Float32Array);
      return cr !== void 0 ? { C: fr, gpuTimeMs: cr } : { C: fr };
    } finally {
      (h || f(F), g || f(K), b || f(C), f(rr));
    }
  }
  async function Gs(
    r,
    a,
    e,
    o,
    t,
    s,
    i,
    u,
    n,
    d,
    l,
    m,
    w,
    p,
    c,
    h = "row-major",
  ) {
    let g = n instanceof ir,
      b = l instanceof ir,
      x = p instanceof ir;
    if (
      (J(r),
      Q(r, "sgemmtr", { A: n, B: l, C: p }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transB must be 'no-transpose' or 'transpose'.");
    if (h !== "row-major" && h !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (typeof w != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(w)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(w)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(t) ||
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m) ||
      !Number.isInteger(c)
    )
      throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
    if (!g && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!b && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!x && !(p instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((g || b) && !x)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (x && (!g || !b))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (t < 0 || s < 0 || i < 0)
      throw new Error("m, n, and k must be non-negative.");
    if (d <= 0 || m <= 0 || c <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (t === 0 || s === 0) return x ? {} : { C: p };
    let B = g ? n.layout : h,
      v = b ? l.layout : h,
      k = x ? p.layout : h,
      _ = B === "column-major" ? i : t,
      S = B === "column-major" ? t : i,
      T = e === "no-transpose" ? _ : S,
      D = e === "no-transpose" ? S : _;
    if (d < D)
      throw new Error(
        `lda must be >= ${B === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (g) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [U, or] = e === "no-transpose" ? [t, i] : [i, t];
      if (n.rows < U || n.cols < or)
        throw new Error("A is too small for the given m, k, and transA.");
    } else if (n.length < (T - 1) * d + D)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let A = v === "column-major" ? s : i,
      L = v === "column-major" ? i : s,
      E = o === "no-transpose" ? A : L,
      M = o === "no-transpose" ? L : A;
    if (m < M)
      throw new Error(
        `ldb must be >= ${v === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (b) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [U, or] = o === "no-transpose" ? [i, s] : [s, i];
      if (l.rows < U || l.cols < or)
        throw new Error("B is too small for the given n, k, and transB.");
    } else if (l.length < (E - 1) * m + M)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let P = k === "column-major" ? s : t,
      H = k === "column-major" ? t : s;
    if (c < H)
      throw new Error(
        `ldc must be >= ${k === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (x) {
      if (c !== p.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (p.rows < t || p.cols < s)
        throw new Error("C is too small for the given m and n.");
    } else if (p.length < (P - 1) * c + H)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    (B === "column-major" &&
      (e = e === "no-transpose" ? "transpose" : "no-transpose"),
      v === "column-major" &&
        (o = o === "no-transpose" ? "transpose" : "no-transpose"),
      k === "column-major" &&
        (([n, l] = [l, n]),
        ([g, b] = [b, g]),
        ([d, m] = [m, d]),
        ([e, o] = [
          o === "no-transpose" ? "transpose" : "no-transpose",
          e === "no-transpose" ? "transpose" : "no-transpose",
        ]),
        ([t, s] = [s, t]),
        (a = a === "lower" ? "upper" : "lower")));
    let z = Math.ceil(s / 64),
      O = Math.ceil(t / 64),
      W = z * O >= 36,
      F = await R(r, W ? "sgemm_large" : "sgemm_small"),
      K = g ? n._buf : y(r, n, "sgemmtr-A", !1),
      C = b ? l._buf : y(r, l, "sgemmtr-B", !1),
      q = x ? p._buf : y(r, p, "sgemmtr-C", !0),
      er = e === "no-transpose",
      ar = o === "no-transpose",
      tr = Er(K, d, er ? t : i, er ? i : t),
      rr = Er(C, m, ar ? i : s, ar ? s : i),
      X = j(
        r,
        [
          { value: t, type: "u32" },
          { value: s, type: "u32" },
          { value: i, type: "u32" },
          { value: u, type: "f32" },
          { value: w, type: "f32" },
          { value: d, type: "u32" },
          { value: m, type: "u32" },
          { value: c, type: "u32" },
          { value: e === "transpose" ? 1 : 0, type: "u32" },
          { value: o === "transpose" ? 1 : 0, type: "u32" },
          { value: tr ? 1 : 0, type: "u32" },
          { value: rr ? 1 : 0, type: "u32" },
          { value: a === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "sgemmtr-params",
      );
    try {
      let U = N(r, F.getBindGroupLayout(0), [K, Br(r, K), C, Br(r, C), q, X]),
        or = W
          ? { x: nr(r, z, "sgemmtr", "x"), y: nr(r, O, "sgemmtr", "y") }
          : {
              x: nr(r, Math.ceil(s / 32), "sgemmtr", "x"),
              y: nr(r, Math.ceil(t / 32), "sgemmtr", "y"),
            },
        { commandEncoder: lr, ts: sr } = Sr(r, F, U, or),
        cr = x ? null : I(r, lr, q);
      $(r, lr);
      let fr = await Y(sr);
      if (x) return fr !== void 0 ? { gpuTimeMs: fr } : {};
      let mr = await G(cr, Float32Array);
      return fr !== void 0 ? { C: mr, gpuTimeMs: fr } : { C: mr };
    } finally {
      (g || f(K), b || f(C), x || f(q), f(X));
    }
  }
  async function Ns(r, a, e, o, t, s, i, u, n, d, l, m = "row-major") {
    let w = i instanceof ir,
      p = d instanceof ir;
    if ((J(r), Q(r, "ssyrk", { A: i, C: d }), a !== "lower" && a !== "upper"))
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (m !== "row-major" && m !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof n != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(n)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(n)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(l)
    )
      throw new Error("n, k, lda, and ldc must be integers.");
    if (!w && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!p && !(d instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if (w && !p)
      throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
    if (p && !w)
      throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || l <= 0) throw new Error("lda and ldc must be positive.");
    if (o === 0) return p ? {} : { C: d };
    let c = w ? i.layout : m,
      h = p ? d.layout : m,
      g = c === "column-major" ? t : o,
      b = c === "column-major" ? o : t,
      x = e === "no-transpose" ? g : b,
      B = e === "no-transpose" ? b : g;
    if (u < B)
      throw new Error(
        `lda must be >= ${c === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (w) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [F, K] = e === "no-transpose" ? [o, t] : [t, o];
      if (i.rows < F || i.cols < K)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (x - 1) * u + B)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    if (l < o) throw new Error("ldc must be >= n.");
    if (p) {
      if (l !== d.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (d.rows < o || d.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (d.length < (o - 1) * l + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let v = e;
    c === "column-major" &&
      (v = v === "no-transpose" ? "transpose" : "no-transpose");
    let k = v === "no-transpose" ? "transpose" : "no-transpose",
      _ = a;
    h === "column-major" &&
      (([v, k] = [
        k === "no-transpose" ? "transpose" : "no-transpose",
        v === "no-transpose" ? "transpose" : "no-transpose",
      ]),
      (_ = _ === "lower" ? "upper" : "lower"));
    let S = Math.ceil(o / 64),
      T = Math.ceil(o / 64),
      D = S * T >= 36,
      A = await R(r, D ? "sgemm_large" : "sgemm_small"),
      L = w ? i._buf : y(r, i, "ssyrk-A", !1),
      E = p ? d._buf : y(r, d, "ssyrk-C", !0),
      M = w
        ? dr(r, L.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
        : y(r, i, "ssyrk-B", !1),
      P = v === "no-transpose",
      H = k === "no-transpose",
      z = Er(L, u, P ? o : t, P ? t : o),
      O = Er(M, u, H ? t : o, H ? o : t),
      W = j(
        r,
        [
          { value: o, type: "u32" },
          { value: o, type: "u32" },
          { value: t, type: "u32" },
          { value: s, type: "f32" },
          { value: n, type: "f32" },
          { value: u, type: "u32" },
          { value: u, type: "u32" },
          { value: l, type: "u32" },
          { value: v === "transpose" ? 1 : 0, type: "u32" },
          { value: k === "transpose" ? 1 : 0, type: "u32" },
          { value: z ? 1 : 0, type: "u32" },
          { value: O ? 1 : 0, type: "u32" },
          { value: _ === "lower" ? 1 : 2, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssyrk-params",
      );
    try {
      let F = N(r, A.getBindGroupLayout(0), [L, Br(r, L), M, Br(r, M), E, W]),
        K = D
          ? { x: nr(r, S, "ssyrk", "x"), y: nr(r, T, "ssyrk", "y") }
          : {
              x: nr(r, Math.ceil(o / 32), "ssyrk", "x"),
              y: nr(r, Math.ceil(o / 32), "ssyrk", "y"),
            },
        { commandEncoder: C, querySet: q, passDescriptor: er } = Cr(r);
      (w && C.copyBufferToBuffer(L, 0, M, 0, L.size), Mr(C, A, F, K, er));
      let ar = Tr(r, C, q),
        tr = p ? null : I(r, C, E);
      $(r, C);
      let rr = await Y(ar);
      if (p) return rr !== void 0 ? { gpuTimeMs: rr } : {};
      let X = await G(tr, Float32Array);
      return rr !== void 0 ? { C: X, gpuTimeMs: rr } : { C: X };
    } finally {
      (w || f(L), f(M), p || f(E), f(W));
    }
  }
  async function Is(r, a, e, o, t, s, i, u, n, d, l, m, w, p = "row-major") {
    let c = i instanceof ir,
      h = n instanceof ir,
      g = m instanceof ir;
    if (
      (J(r),
      Q(r, "ssyr2k", { A: i, B: n, C: m }),
      a !== "lower" && a !== "upper")
    )
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (e !== "no-transpose" && e !== "transpose")
      throw new Error("trans must be 'no-transpose' or 'transpose'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("n, k, lda, ldb, and ldc must be integers.");
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!g && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((c || h) && !g)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (g && (!c || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("n and k must be non-negative.");
    if (u <= 0 || d <= 0 || w <= 0)
      throw new Error("lda, ldb, and ldc must be positive.");
    if (o === 0) return g ? {} : { C: m };
    let b = c ? i.layout : p,
      x = h ? n.layout : p,
      B = g ? m.layout : p,
      v = b === "column-major" ? t : o,
      k = b === "column-major" ? o : t,
      _ = e === "no-transpose" ? v : k,
      S = e === "no-transpose" ? k : v;
    if (u < S)
      throw new Error(
        `lda must be >= ${b === "column-major" ? "rows" : "cols"} of A as stored.`,
      );
    if (c) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      let [X, U] = e === "no-transpose" ? [o, t] : [t, o];
      if (i.rows < X || i.cols < U)
        throw new Error("A is too small for the given n, k, and trans.");
    } else if (i.length < (_ - 1) * u + S)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let T = x === "column-major" ? t : o,
      D = x === "column-major" ? o : t,
      A = e === "no-transpose" ? T : D,
      L = e === "no-transpose" ? D : T;
    if (d < L)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      let [X, U] = e === "no-transpose" ? [o, t] : [t, o];
      if (n.rows < X || n.cols < U)
        throw new Error("B is too small for the given n, k, and trans.");
    } else if (n.length < (A - 1) * d + L)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    if (w < o) throw new Error("ldc must be >= n.");
    if (g) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < o)
        throw new Error("C is too small for the given n.");
    } else if (m.length < (o - 1) * w + o)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let E = e;
    b === "column-major" &&
      (E = E === "no-transpose" ? "transpose" : "no-transpose");
    let M = e;
    x === "column-major" &&
      (M = M === "no-transpose" ? "transpose" : "no-transpose");
    let P = B === "column-major" ? (a === "lower" ? "upper" : "lower") : a,
      H = (X) => (X === "no-transpose" ? "transpose" : "no-transpose");
    function z(X, U, or, lr, sr, cr) {
      let fr = X,
        mr = H(lr);
      return B !== "column-major"
        ? { transX: fr, X: U, ldX: or, transY: mr, Y: sr, ldY: cr }
        : { transX: H(mr), X: sr, ldX: cr, transY: H(fr), Y: U, ldY: or };
    }
    let O = Math.ceil(o / 64),
      W = Math.ceil(o / 64),
      F = O * W >= 36,
      K = await R(r, F ? "sgemm_large" : "sgemm_small"),
      C = F
        ? { x: nr(r, O, "ssyr2k", "x"), y: nr(r, W, "ssyr2k", "y") }
        : {
            x: nr(r, Math.ceil(o / 32), "ssyr2k", "x"),
            y: nr(r, Math.ceil(o / 32), "ssyr2k", "y"),
          },
      q = c ? i._buf : y(r, i, "ssyr2k-A", !1),
      er = h ? n._buf : y(r, n, "ssyr2k-B", !1),
      ar = g ? m._buf : y(r, m, "ssyr2k-C", !0),
      tr = null,
      rr = null;
    try {
      let X = z(E, q, u, M, er, d),
        U = z(M, er, d, E, q, u),
        or = (pr) => {
          let wr = pr.transX === "no-transpose",
            yr = pr.transY === "no-transpose";
          return [
            Er(pr.X, pr.ldX, wr ? o : t, wr ? t : o),
            Er(pr.Y, pr.ldY, yr ? t : o, yr ? o : t),
          ];
        },
        lr = (pr, wr) =>
          j(
            r,
            [
              { value: o, type: "u32" },
              { value: o, type: "u32" },
              { value: t, type: "u32" },
              { value: s, type: "f32" },
              { value: wr, type: "f32" },
              { value: pr.ldX, type: "u32" },
              { value: pr.ldY, type: "u32" },
              { value: w, type: "u32" },
              { value: pr.transX === "transpose" ? 1 : 0, type: "u32" },
              { value: pr.transY === "transpose" ? 1 : 0, type: "u32" },
              { value: or(pr)[0] ? 1 : 0, type: "u32" },
              { value: or(pr)[1] ? 1 : 0, type: "u32" },
              { value: P === "lower" ? 1 : 2, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "ssyr2k-params",
          );
      ((tr = lr(X, l)), (rr = lr(U, 1)));
      let sr = N(r, K.getBindGroupLayout(0), [
          X.X,
          Br(r, X.X),
          X.Y,
          Br(r, X.Y),
          ar,
          tr,
        ]),
        cr = N(r, K.getBindGroupLayout(0), [
          U.X,
          Br(r, U.X),
          U.Y,
          Br(r, U.Y),
          ar,
          rr,
        ]),
        { commandEncoder: fr, querySet: mr } = Cr(r),
        gr = mr
          ? { timestampWrites: { querySet: mr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        kr = mr
          ? { timestampWrites: { querySet: mr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(fr, K, sr, C, gr), Mr(fr, K, cr, C, kr));
      let Ir = Tr(r, fr, mr),
        xr = g ? null : I(r, fr, ar);
      $(r, fr);
      let Dr = await Y(Ir);
      if (g) return Dr !== void 0 ? { gpuTimeMs: Dr } : {};
      let Nr = await G(xr, Float32Array);
      return Dr !== void 0 ? { C: Nr, gpuTimeMs: Dr } : { C: Nr };
    } finally {
      (c || f(q), h || f(er), g || f(ar), tr && f(tr), rr && f(rr));
    }
  }
  async function Ps(r, a, e, o, t, s, i, u, n, d, l, m, w, p = "row-major") {
    let c = i instanceof ir,
      h = n instanceof ir,
      g = m instanceof ir;
    if (
      (J(r), Q(r, "ssymm", { A: i, B: n, C: m }), a !== "left" && a !== "right")
    )
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (p !== "row-major" && p !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof s != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(s)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(s)) throw new Error("alpha must be finite.");
    if (typeof l != "number") throw new Error("beta must be a number.");
    if (Number.isNaN(l)) throw new Error("beta must not be NaN.");
    if (!Number.isFinite(l)) throw new Error("beta must be finite.");
    if (
      !Number.isInteger(o) ||
      !Number.isInteger(t) ||
      !Number.isInteger(u) ||
      !Number.isInteger(d) ||
      !Number.isInteger(w)
    )
      throw new Error("m, n, lda, ldb, and ldc must be integers.");
    if (!c && !(i instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!h && !(n instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (!g && !(m instanceof Float32Array))
      throw new Error("C must be a Float32Array or GpuMatrix.");
    if ((c || h) && !g)
      throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
    if (g && (!c || !h))
      throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
    if (o < 0 || t < 0) throw new Error("m and n must be non-negative.");
    if (o === 0 || t === 0) return g ? {} : { C: m };
    let b = c ? i.layout : p,
      x = h ? n.layout : p,
      B = g ? m.layout : p,
      v = a === "left" ? o : t;
    if (u < v)
      throw new Error("lda must be >= " + (a === "left" ? "m" : "n") + ".");
    if (c) {
      if (u !== i.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (i.rows < v || i.cols < v)
        throw new Error("A is too small for the given m/n and side.");
    } else if (i.length < (v - 1) * u + v)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let k = x === "column-major" ? t : o,
      _ = x === "column-major" ? o : t;
    if (d < _)
      throw new Error(
        `ldb must be >= ${x === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (h) {
      if (d !== n.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (n.rows < o || n.cols < t)
        throw new Error("B is too small for the given m and n.");
    } else if (n.length < (k - 1) * d + _)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let S = B === "column-major" ? t : o,
      T = B === "column-major" ? o : t;
    if (w < T)
      throw new Error(
        `ldc must be >= ${B === "column-major" ? "rows" : "cols"} of C as stored.`,
      );
    if (g) {
      if (w !== m.lda)
        throw new Error("ldc must match C.lda when C is a GpuMatrix.");
      if (m.rows < o || m.cols < t)
        throw new Error("C is too small for the given m and n.");
    } else if (m.length < (S - 1) * w + T)
      throw new Error(
        "C does not have enough elements for the given dimensions and ldc.",
      );
    let D = b === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      A = x === "column-major" ? "transpose" : "no-transpose",
      L = "no-transpose",
      E = o,
      M = t,
      P = v,
      H = a === "left" ? L : A,
      z = a === "left" ? A : L,
      O = (cr) => (cr === "no-transpose" ? "transpose" : "no-transpose"),
      W = a === "right";
    B === "column-major" &&
      (([H, z] = [O(z), O(H)]), (W = !W), ([E, M] = [M, E]));
    let F = v,
      K = Math.ceil(M / 64),
      C = Math.ceil(E / 64),
      q = K * C >= 36,
      er = await R(r, q ? "sgemm_large" : "sgemm_small"),
      ar = await R(r, "symmetrize"),
      tr = q
        ? { x: nr(r, K, "ssymm", "x"), y: nr(r, C, "ssymm", "y") }
        : {
            x: nr(r, Math.ceil(M / 32), "ssymm", "x"),
            y: nr(r, Math.ceil(E / 32), "ssymm", "y"),
          },
      rr = c ? i._buf : y(r, i, "ssymm-A", !1),
      X = h ? n._buf : y(r, n, "ssymm-B", !1),
      U = g ? m._buf : y(r, m, "ssymm-C", !0),
      or = dr(r, v * F * 4, "ssymm-Adense"),
      lr = null,
      sr = null;
    try {
      lr = j(
        r,
        [
          { value: v, type: "u32" },
          { value: u, type: "u32" },
          { value: F, type: "u32" },
          { value: D === "upper" ? 1 : 0, type: "u32" },
        ],
        "ssymm-sym-params",
      );
      let cr = N(r, ar.getBindGroupLayout(0), [rr, or, lr]),
        fr = W ? X : or,
        mr = W ? d : F,
        gr = W ? or : X,
        kr = W ? F : d,
        Ir = H === "no-transpose",
        xr = z === "no-transpose",
        Dr = Er(fr, mr, Ir ? E : P, Ir ? P : E),
        Nr = Er(gr, kr, xr ? P : M, xr ? M : P);
      sr = j(
        r,
        [
          { value: E, type: "u32" },
          { value: M, type: "u32" },
          { value: P, type: "u32" },
          { value: s, type: "f32" },
          { value: l, type: "f32" },
          { value: mr, type: "u32" },
          { value: kr, type: "u32" },
          { value: w, type: "u32" },
          { value: H === "transpose" ? 1 : 0, type: "u32" },
          { value: z === "transpose" ? 1 : 0, type: "u32" },
          { value: Dr ? 1 : 0, type: "u32" },
          { value: Nr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
        ],
        "ssymm-gemm-params",
      );
      let pr = N(r, er.getBindGroupLayout(0), [
          fr,
          Br(r, fr),
          gr,
          Br(r, gr),
          U,
          sr,
        ]),
        { commandEncoder: wr, querySet: yr } = Cr(r),
        Lr = yr
          ? { timestampWrites: { querySet: yr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Pr = yr
          ? { timestampWrites: { querySet: yr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(wr, ar, cr, { x: Math.ceil(v / 8), y: Math.ceil(v / 8) }, Lr),
        Mr(wr, er, pr, tr, Pr));
      let Kr = Tr(r, wr, yr),
        Qr = g ? null : I(r, wr, U);
      $(r, wr);
      let qr = await Y(Kr);
      if (g) return qr !== void 0 ? { gpuTimeMs: qr } : {};
      let vr = await G(Qr, Float32Array);
      return qr !== void 0 ? { C: vr, gpuTimeMs: qr } : { C: vr };
    } finally {
      (c || f(rr), h || f(X), g || f(U), f(or), lr && f(lr), sr && f(sr));
    }
  }
  async function Ms(r, a, e, o, t, s, i, u, n, d, l, m, w = "row-major") {
    let p = n instanceof ir,
      c = l instanceof ir,
      h = t === "unit";
    if ((J(r), Q(r, "strmm", { A: n, B: l }), a !== "left" && a !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!h && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (p !== c)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (s < 0 || i < 0) throw new Error("m and n must be non-negative.");
    if (s === 0 || i === 0) return c ? {} : { B: l };
    let g = p ? n.layout : w,
      b = c ? l.layout : w,
      x = a === "left" ? s : i;
    if (d < x)
      throw new Error("lda must be >= " + (a === "left" ? "m" : "n") + ".");
    if (p) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * d + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let B = b === "column-major" ? i : s,
      v = b === "column-major" ? s : i;
    if (m < v)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (c) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < s || l.cols < i)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (B - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let k = g === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      _ =
        g === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      S = b === "column-major" ? "transpose" : "no-transpose",
      T = "no-transpose",
      D = s,
      A = i,
      L = x,
      E = a === "left" ? T : S,
      M = a === "left" ? S : T,
      P = (lr) => (lr === "no-transpose" ? "transpose" : "no-transpose"),
      H = a === "right";
    b === "column-major" &&
      (([E, M] = [P(M), P(E)]), (H = !H), ([D, A] = [A, D]));
    let z = x,
      O = Math.ceil(A / 64),
      W = Math.ceil(D / 64),
      F = O * W >= 36,
      K = await R(r, F ? "sgemm_large" : "sgemm_small"),
      C = await R(r, "triangularize"),
      q = F
        ? { x: nr(r, O, "strmm", "x"), y: nr(r, W, "strmm", "y") }
        : {
            x: nr(r, Math.ceil(A / 32), "strmm", "x"),
            y: nr(r, Math.ceil(D / 32), "strmm", "y"),
          },
      er = null,
      ar = null,
      tr = null,
      rr = null,
      X = null,
      U = null,
      or = !1;
    try {
      ((er = p ? n._buf : y(r, n, "strmm-A", !1)),
        (ar = c ? l._buf : y(r, l, "strmm-B", !0)),
        (tr = dr(r, x * z * 4, "strmm-Adense")),
        (rr = dr(
          r,
          B * m * 4,
          "strmm-out",
          GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        )),
        (X = j(
          r,
          [
            { value: x, type: "u32" },
            { value: d, type: "u32" },
            { value: z, type: "u32" },
            { value: k === "upper" ? 1 : 0, type: "u32" },
            { value: _ === "transpose" ? 1 : 0, type: "u32" },
            { value: h ? 1 : 0, type: "u32" },
          ],
          "strmm-tri-params",
        )));
      let lr = N(r, C.getBindGroupLayout(0), [er, tr, X]),
        sr = H ? ar : tr,
        cr = H ? m : z,
        fr = H ? tr : ar,
        mr = H ? z : m,
        gr = E === "no-transpose",
        kr = M === "no-transpose",
        Ir = Er(sr, cr, gr ? D : L, gr ? L : D),
        xr = Er(fr, mr, kr ? L : A, kr ? A : L),
        Dr = (_ === "no-transpose") == (k === "lower"),
        Nr = !H,
        pr = Dr !== (Nr ? !gr : !kr);
      U = j(
        r,
        [
          { value: D, type: "u32" },
          { value: A, type: "u32" },
          { value: L, type: "u32" },
          { value: u, type: "f32" },
          { value: 0, type: "f32" },
          { value: cr, type: "u32" },
          { value: mr, type: "u32" },
          { value: m, type: "u32" },
          { value: E === "transpose" ? 1 : 0, type: "u32" },
          { value: M === "transpose" ? 1 : 0, type: "u32" },
          { value: Ir ? 1 : 0, type: "u32" },
          { value: xr ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: Nr ? (pr ? 1 : 2) : pr ? 3 : 4, type: "u32" },
        ],
        "strmm-gemm-params",
      );
      let yr = N(r, K.getBindGroupLayout(0), [
          sr,
          Br(r, sr),
          fr,
          Br(r, fr),
          rr,
          U,
        ]),
        { commandEncoder: Lr, querySet: Pr } = Cr(r);
      Lr.copyBufferToBuffer(ar, 0, rr, 0, Math.min(ar.size, rr.size));
      let Kr = Pr
          ? { timestampWrites: { querySet: Pr, beginningOfPassWriteIndex: 0 } }
          : void 0,
        Qr = Pr
          ? { timestampWrites: { querySet: Pr, endOfPassWriteIndex: 1 } }
          : void 0;
      (Mr(Lr, C, lr, { x: Math.ceil(x / 8), y: Math.ceil(x / 8) }, Kr),
        Mr(Lr, K, yr, q, Qr));
      let qr = Tr(r, Lr, Pr),
        vr = c ? null : I(r, Lr, rr);
      $(r, Lr);
      let Yr = await Y(qr);
      if (c)
        return (
          f(l._buf),
          (l._buf = rr),
          (or = !0),
          Yr !== void 0 ? { gpuTimeMs: Yr } : {}
        );
      let me = await G(vr, Float32Array);
      return Yr !== void 0 ? { B: me, gpuTimeMs: Yr } : { B: me };
    } finally {
      (!p && er && f(er),
        !c && ar && f(ar),
        tr && f(tr),
        rr && !or && f(rr),
        X && f(X),
        U && f(U));
    }
  }
  var ae = (r, a, e, o) => ({ buffer: r, off: a, rs: e, cs: o }),
    Me = (r) => ({ ...r, rs: r.cs, cs: r.rs }),
    ge = (r, a, e) => ({ ...r, off: r.off + a * r.rs + e * r.cs });
  function vn(r, a) {
    typeof a == "number"
      ? r.dispatchWorkgroups(a)
      : r.dispatchWorkgroups(a.x, a.y, a.z ?? 1);
  }
  var Rs = 8;
  function kn(r, a, e, o, t, s, i, u, n, d, l, m, w = 0) {
    if (w !== 0 && i.cs !== 1)
      throw new Error("strsm: an element-triangular gemm needs a row-major C.");
    i.cs !== 1 && (([t, s, i] = [Me(s), Me(t), Me(i)]), ([u, n] = [n, u]));
    let p = t.cs === 1,
      c = s.cs === 1,
      h = p ? t.rs : t.cs,
      g = c ? s.rs : s.cs,
      b = Er(t.buffer, h, p ? u : d, p ? d : u, t.off),
      x = Er(s.buffer, g, c ? d : n, c ? n : d, s.off),
      B = Math.ceil(n / 64),
      v = Math.ceil(u / 64),
      k = B * v >= 36,
      _ = k ? e.large : e.small,
      S = o(
        [
          { value: u, type: "u32" },
          { value: n, type: "u32" },
          { value: d, type: "u32" },
          { value: l, type: "f32" },
          { value: m, type: "f32" },
          { value: h, type: "u32" },
          { value: g, type: "u32" },
          { value: i.rs, type: "u32" },
          { value: p ? 0 : 1, type: "u32" },
          { value: c ? 0 : 1, type: "u32" },
          { value: b ? 1 : 0, type: "u32" },
          { value: x ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: t.off, type: "u32" },
          { value: s.off, type: "u32" },
          { value: i.off, type: "u32" },
          { value: w, type: "u32" },
        ],
        "strsm-gemm-params",
      );
    (a.setPipeline(_),
      a.setBindGroup(
        0,
        N(r, _.getBindGroupLayout(0), [
          t.buffer,
          Br(r, t.buffer),
          s.buffer,
          Br(r, s.buffer),
          i.buffer,
          S,
        ]),
      ),
      a.dispatchWorkgroups(
        nr(r, k ? B : Math.ceil(n / 32), "strsm", "x"),
        nr(r, k ? v : Math.ceil(u / 32), "strsm", "y"),
      ));
  }
  async function Ts(r, a, e, o, t, s, i, u, n, d, l, m, w = "row-major") {
    let p = n instanceof ir,
      c = l instanceof ir,
      h = t === "unit";
    if ((J(r), Q(r, "strsm", { A: n, B: l }), a !== "left" && a !== "right"))
      throw new Error("side must be 'left' or 'right'.");
    if (e !== "lower" && e !== "upper")
      throw new Error("uplo must be 'lower' or 'upper'.");
    if (o !== "no-transpose" && o !== "transpose")
      throw new Error("transA must be 'no-transpose' or 'transpose'.");
    if (!h && t !== "non-unit")
      throw new Error("diag must be 'unit' or 'non-unit'.");
    if (w !== "row-major" && w !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    if (typeof u != "number") throw new Error("alpha must be a number.");
    if (Number.isNaN(u)) throw new Error("alpha must not be NaN.");
    if (!Number.isFinite(u)) throw new Error("alpha must be finite.");
    if (
      !Number.isInteger(s) ||
      !Number.isInteger(i) ||
      !Number.isInteger(d) ||
      !Number.isInteger(m)
    )
      throw new Error("m, n, lda, and ldb must be integers.");
    if (!p && !(n instanceof Float32Array))
      throw new Error("A must be a Float32Array or GpuMatrix.");
    if (!c && !(l instanceof Float32Array))
      throw new Error("B must be a Float32Array or GpuMatrix.");
    if (p !== c)
      throw new Error(
        "A and B must both be GpuMatrix or both be Float32Array.",
      );
    if (s < 0 || i < 0) throw new Error("m and n must be non-negative.");
    if (s === 0 || i === 0) return c ? {} : { B: l };
    let g = p ? n.layout : w,
      b = c ? l.layout : w,
      x = a === "left" ? s : i;
    if (d < x)
      throw new Error("lda must be >= " + (a === "left" ? "m" : "n") + ".");
    if (p) {
      if (d !== n.lda)
        throw new Error("lda must match A.lda when A is a GpuMatrix.");
      if (n.rows < x || n.cols < x)
        throw new Error("A is too small for the given m/n and side.");
    } else if (n.length < (x - 1) * d + x)
      throw new Error(
        "A does not have enough elements for the given dimensions and lda.",
      );
    let B = b === "column-major" ? i : s,
      v = b === "column-major" ? s : i;
    if (m < v)
      throw new Error(
        `ldb must be >= ${b === "column-major" ? "rows" : "cols"} of B as stored.`,
      );
    if (c) {
      if (m !== l.lda)
        throw new Error("ldb must match B.lda when B is a GpuMatrix.");
      if (l.rows < s || l.cols < i)
        throw new Error("B is too small for the given m and n.");
    } else if (l.length < (B - 1) * m + v)
      throw new Error(
        "B does not have enough elements for the given dimensions and ldb.",
      );
    let k = g === "column-major" ? (e === "lower" ? "upper" : "lower") : e,
      _ =
        g === "column-major"
          ? o === "no-transpose"
            ? "transpose"
            : "no-transpose"
          : o,
      S = a === "left" ? i : s,
      T = a === "left",
      D = (_ === "no-transpose") == (k === "lower"),
      A = a === "left" ? D : !D,
      L = [];
    for (let rr = 0; rr < x; rr += 64) L.push(rr);
    A || L.reverse();
    let E = L.length,
      M = await R(r, "strsm_small"),
      P = E > Rs && !c && (Ee(l, l.length) || Le(n, x, d, k === "lower", h)),
      H = E > Rs && !P,
      z = H ? await R(r, "strsv_invert_block") : null,
      O = H ? await R(r, "block_transfer") : null,
      W = nr(r, Math.ceil(S / 4), "strsm"),
      F = {
        small: await R(r, "sgemm_small"),
        large: await R(r, "sgemm_large"),
      },
      K = null,
      C = null,
      q = null,
      er = null,
      ar = [];
    function tr(rr, X) {
      let U = j(r, rr, X);
      return (ar.push(U), U);
    }
    try {
      ((K = p ? n._buf : y(r, n, "strsm-A", !1)),
        (C = c ? l._buf : y(r, l, "strsm-B", !0)),
        H && (q = dr(r, E * 64 * 64 * 4, "strsm-Ainv")),
        (er = dr(r, (E > 1 ? 64 * S : 4) * 4, "strsm-Xblock")));
      let rr = b === "column-major" ? ae(C, 0, 1, m) : ae(C, 0, m, 1),
        X = a === "left" ? rr : Me(rr),
        U = _ === "transpose" ? ae(K, 0, 1, d) : ae(K, 0, d, 1),
        or = a === "left" ? U : Me(U),
        lr = ae(er, 0, S, 1),
        { commandEncoder: sr, querySet: cr, passDescriptor: fr } = Cr(r),
        mr = sr.beginComputePass(fr),
        gr = (pr, wr, yr, Lr, Pr, Kr, Qr, qr, vr = 0) =>
          kn(r, mr, F, tr, pr, wr, yr, Lr, Pr, Kr, Qr, qr, vr),
        kr = (pr, wr, yr, Lr, Pr) => {
          let Kr = tr(
            [
              { value: yr, type: "u32" },
              { value: S, type: "u32" },
              { value: pr.off, type: "u32" },
              { value: pr.rs, type: "u32" },
              { value: pr.cs, type: "u32" },
              { value: wr.off, type: "u32" },
              { value: wr.rs, type: "u32" },
              { value: wr.cs, type: "u32" },
              { value: A ? 0 : 1, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
              { value: Lr, type: "f32" },
              { value: Pr, type: "u32" },
              { value: 0, type: "u32" },
            ],
            "strsm-solve-params",
          );
          (mr.setPipeline(M),
            mr.setBindGroup(0, N(r, M.getBindGroupLayout(0), [K, C, Kr, er])),
            mr.dispatchWorkgroups(W));
        };
      if (u === 0) {
        let pr = ae(er, 0, 1, 1);
        gr(pr, pr, ae(C, 0, m, 1), B, v, 0, 0, 0);
      } else if (E === 1) kr(or, X, x, u, 0);
      else {
        if (u !== 1) {
          let pr = ae(er, 0, 1, 1);
          gr(pr, pr, ae(C, 0, m, 1), B, v, 0, 0, u);
        }
        if (H) {
          let pr = tr(
            [
              { value: x, type: "u32" },
              { value: d, type: "u32" },
              { value: _ === "transpose" ? 1 : 0, type: "u32" },
              { value: k === "upper" ? 1 : 0, type: "u32" },
              { value: h ? 1 : 0, type: "u32" },
            ],
            "strsm-invert-params",
          );
          (mr.setPipeline(z),
            mr.setBindGroup(0, N(r, z.getBindGroupLayout(0), [K, q, pr])),
            mr.dispatchWorkgroups(E));
          for (let wr of L) {
            let yr = Math.min(wr + 64, x),
              Lr = yr - wr,
              Kr = (wr / 64) * 64 * 64,
              Qr = a === "left" ? ae(q, Kr, 1, 64) : ae(q, Kr, 64, 1);
            gr(Qr, ge(X, wr, 0), lr, Lr, S, Lr, 1, 0, A ? 5 : 6);
            let qr = tr(
              [
                { value: wr, type: "u32" },
                { value: Lr, type: "u32" },
                { value: 0, type: "u32" },
                { value: S, type: "u32" },
                { value: m, type: "u32" },
                { value: b === "column-major" ? 1 : 0, type: "u32" },
                { value: T ? 1 : 0, type: "u32" },
                { value: 0, type: "u32" },
              ],
              "strsm-scatter-params",
            );
            (mr.setPipeline(O),
              mr.setBindGroup(0, N(r, O.getBindGroupLayout(0), [er, C, qr])),
              vn(mr, Ra(r, "strsm", Lr, S)));
            let vr = A ? yr : 0,
              Yr = A ? x : wr;
            vr >= Yr ||
              gr(ge(or, vr, wr), lr, ge(X, vr, 0), Yr - vr, S, Lr, -1, 1);
          }
        } else
          for (let pr of L) {
            let wr = Math.min(pr + 64, x),
              yr = wr - pr;
            kr(ge(or, pr, pr), ge(X, pr, 0), yr, 1, S);
            let Lr = A ? wr : 0,
              Pr = A ? x : pr;
            Lr >= Pr ||
              gr(ge(or, Lr, pr), lr, ge(X, Lr, 0), Pr - Lr, S, yr, -1, 1);
          }
      }
      mr.end();
      let Ir = Tr(r, sr, cr),
        xr = c ? null : I(r, sr, C);
      $(r, sr);
      let Dr = await Y(Ir);
      if (c) return Dr !== void 0 ? { gpuTimeMs: Dr } : {};
      let Nr = await G(xr, Float32Array);
      return Dr !== void 0 ? { B: Nr, gpuTimeMs: Dr } : { B: Nr };
    } finally {
      (!p && K && f(K), !c && C && f(C), er && f(er), q && f(q), f(ar));
    }
  }
  return Os(Bn);
})();
