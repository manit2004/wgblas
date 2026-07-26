// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
// using computeSum instead of plain f32 `+` (see reduction/sum.wgsl for the
// f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsMain/partialsAux must have
// exactly 2*WGS entries each.
//
// Concatenated after f64add.wgsl by getPipeline (WGSL has no #include),
// reusing its decode/encode/computeSum and Packed struct — bindings here
// start at 4 (f64add.wgsl already has 0-3) and the entry point is
// `reduce_f64` (f64add.wgsl already has `fn main`).
//
// partialsAux/result's aux slot are array<u32>, not array<f32> — aux's bits
// must never pass through an f32-typed storage slot (NaN-bit-pattern
// corruption risk, see f64pack.mjs and f64add.wgsl's binding comment).

@group(0) @binding(4) var<storage, read>       partialsMain: array<f32>;
@group(0) @binding(5) var<storage, read>       partialsAux:  array<u32>;
@group(0) @binding(6) var<storage, read_write> resultMain:   array<f32, 1>;
@group(0) @binding(7) var<storage, read_write> resultAux:    array<u32, 1>;

const WGS: u32 = 64;

var<workgroup> tile: array<Packed, 64>;

fn addPair(a: Packed, b: Packed) -> Packed {
  return computeSum(decode(bitcast<u32>(a.main), a.aux), decode(bitcast<u32>(b.main), b.aux));
}

@compute @workgroup_size(64)
fn reduce_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = Packed(partialsMain[i], partialsAux[i]);
  let b = Packed(partialsMain[i + WGS], partialsAux[i + WGS]);
  tile[i] = addPair(a, b);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) { tile[i] = addPair(tile[i], tile[i + s]); }
    workgroupBarrier();
  }

  if (i == 0u) {
    resultMain[0] = tile[0].main;
    resultAux[0] = tile[0].aux;
  }
}
