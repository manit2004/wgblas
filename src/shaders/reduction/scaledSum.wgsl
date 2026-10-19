// scaledSum reduction: collapses snrm2.wgsl's 2*WGS (big, medium, small)
// partials into the final norm. The partials merge by plain addition (their
// scales are fixed powers of two — see snrm2.wgsl), then the three sums are
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
const SBIG_SQ_EXP: i32 = -152; // log2(SBIG²)

// NaN test on the bit pattern: `v != v` can be folded away by a shader
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
      // Medium in big's units is amed·SBIG² = amed·2^-152 — one exact ldexp.
      // Never as (amed·SBIG)·SBIG: a compiler may fold that into
      // amed·(SBIG·SBIG), and the constant 2^-152 underflows f32 to 0 (it
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
