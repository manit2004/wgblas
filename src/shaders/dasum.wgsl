// dasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sum.wgsl.
// Same structure as sasum.wgsl — every value is now a [main, aux] pair
// (see src/util/f64pack.mjs) and every `+`/`+=` is computeSum via addPair
// instead of plain f32 addition. Concatenated after f64add.wgsl by
// getPipeline (WGSL has no #include), reusing its decode/encode/computeSum
// — so bindings here start at 2 (f64add.wgsl already has 0/1) and the entry
// point is `dasum_main` (f64add.wgsl already has `fn main`).

@group(0) @binding(2) var<storage, read>       xMain:        array<f32>;
@group(0) @binding(3) var<storage, read>       xAux:         array<f32>;
@group(0) @binding(4) var<storage, read_write> partialsMain: array<f32>;
@group(0) @binding(5) var<storage, read_write> partialsAux:  array<f32>;
@group(0) @binding(6) var<uniform>             params:       Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<vec2<f32>, 64>;

// a + b, where a/b are [main, aux] pairs — computeSum takes decoded Fields.
fn addPair(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
  return computeSum(decode(bitcast<u32>(a.x), bitcast<u32>(a.y)), decode(bitcast<u32>(b.x), bitcast<u32>(b.y)));
}

// |x| for a packed double is abs(main) with aux untouched — only main's
// sign bit carries the double's sign (see fieldsToPacked() in f64pack.mjs).
fn absPair(idx: u32) -> vec2<f32> {
  return vec2<f32>(abs(xMain[idx]), xAux[idx]);
}

@compute @workgroup_size(64)
fn dasum_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: vec2<f32> = vec2<f32>(0.0, 0.0);
  var acc1: vec2<f32> = vec2<f32>(0.0, 0.0);
  var acc2: vec2<f32> = vec2<f32>(0.0, 0.0);
  var acc3: vec2<f32> = vec2<f32>(0.0, 0.0);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = addPair(acc0, absPair( id                * params.x_inc));
    acc1 = addPair(acc1, absPair((id +      stride) * params.x_inc));
    acc2 = addPair(acc2, absPair((id + 2u * stride) * params.x_inc));
    acc3 = addPair(acc3, absPair((id + 3u * stride) * params.x_inc));
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = addPair(acc0, absPair(id * params.x_inc));
  }

  tile[lid.x] = addPair(addPair(acc0, acc1), addPair(acc2, acc3));
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] = addPair(tile[lid.x], tile[lid.x + s]); }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsMain[wgid.x] = tile[0].x;
    partialsAux[wgid.x] = tile[0].y;
  }
}
