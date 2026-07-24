// sum reduction (f64): collapses 2*WGS partial [main, aux] pairs into one,
// using computeSum instead of plain f32 `+` (see reduction/sum.wgsl for the
// f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsMain/partialsAux must have
// exactly 2*WGS entries each.
//
// Concatenated after f64add.wgsl by getPipeline (WGSL has no #include),
// reusing its decode/encode/computeSum — bindings here start at 2
// (f64add.wgsl already has 0/1) and the entry point is `reduce_f64`
// (f64add.wgsl already has `fn main`).

@group(0) @binding(2) var<storage, read>       partialsMain: array<f32>;
@group(0) @binding(3) var<storage, read>       partialsAux:  array<f32>;
@group(0) @binding(4) var<storage, read_write> result:       array<f32, 2>; // [main, aux]

const WGS: u32 = 64;

var<workgroup> tile: array<vec2<f32>, 64>;

fn addPair(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
  return computeSum(decode(bitcast<u32>(a.x), bitcast<u32>(a.y)), decode(bitcast<u32>(b.x), bitcast<u32>(b.y)));
}

@compute @workgroup_size(64)
fn reduce_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = vec2<f32>(partialsMain[i], partialsAux[i]);
  let b = vec2<f32>(partialsMain[i + WGS], partialsAux[i + WGS]);
  tile[i] = addPair(a, b);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) { tile[i] = addPair(tile[i], tile[i + s]); }
    workgroupBarrier();
  }

  if (i == 0u) {
    result[0] = tile[0].x;
    result[1] = tile[0].y;
  }
}
