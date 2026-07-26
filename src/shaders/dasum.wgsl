// dasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sumF64.wgsl.
// Same structure as sasum.wgsl — every value is now a [main, aux] pair
// (see src/util/f64pack.mjs) and every `+`/`+=` is computeSum via addPair
// instead of plain f32 addition. Concatenated after f64add.wgsl by
// getPipeline (WGSL has no #include), reusing its decode/encode/computeSum/
// addFields and Packed struct — f64add.wgsl declares no bindings and no entry
// point of its own (just helper functions), so bindings here start at 0 and
// the entry point is simply `dasum_main`.
//
// xAux/partialsAux are array<u32>, not array<f32> — aux's bits must never
// pass through an f32-typed storage slot (NaN-bit-pattern corruption risk,
// see f64pack.mjs and the Packed struct comment above decode()/encode() in
// f64add.wgsl); Packed (from f64add.wgsl) keeps aux as u32 in registers/
// workgroup memory too.
//
// Per-thread accumulation (acc0..acc3) stays in DECODED Fields form for the
// entire strided loop below, via addFields — not re-encoded to Packed and
// re-decoded on every single element like a naive version would. Only the
// freshly-loaded x[idx] needs decoding each iteration (unavoidable, it's new
// data every time); the running total never leaves Fields form until the
// four accumulators are combined and encoded exactly once, right before
// writing into workgroup-shared `tile`. The cross-thread reduction tree
// after that still goes through Packed per level (unavoidable — each level
// combines values that live in different threads' registers via shared
// memory), but that's a fixed 6 levels regardless of n, unlike the strided
// loop above whose iteration count scales with n.

@group(0) @binding(0) var<storage, read>       xMain:        array<f32>;
@group(0) @binding(1) var<storage, read>       xAux:         array<u32>;
@group(0) @binding(2) var<storage, read_write> partialsMain: array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsAux:  array<u32>;
@group(0) @binding(4) var<uniform>             params:       Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<Packed, 64>;

// a + b, where a/b are [main, aux] pairs — computeSum takes decoded Fields.
// Only used for the cross-thread reduction tree below; the per-thread
// strided loop uses addFields directly instead (see module comment).
fn addPair(a: Packed, b: Packed) -> Packed {
  return computeSum(decode(bitcast<u32>(a.main), a.aux), decode(bitcast<u32>(b.main), b.aux));
}

// |x| for a packed double is abs(main) with aux untouched — only main's
// sign bit carries the double's sign (see fieldsToPacked() in f64pack.mjs).
// Returns decoded Fields directly (not Packed) for the per-thread loop.
fn absFields(idx: u32) -> Fields {
  return decode(bitcast<u32>(abs(xMain[idx])), xAux[idx]);
}

@compute @workgroup_size(64)
fn dasum_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0: Fields = Fields(0u, 0u, 0u, 0u);
  var acc1: Fields = Fields(0u, 0u, 0u, 0u);
  var acc2: Fields = Fields(0u, 0u, 0u, 0u);
  var acc3: Fields = Fields(0u, 0u, 0u, 0u);

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  for (var id = gid.x; id < n4_floor; id += 4u * stride) {
    acc0 = addFields(acc0, absFields( id                * params.x_inc));
    acc1 = addFields(acc1, absFields((id +      stride) * params.x_inc));
    acc2 = addFields(acc2, absFields((id + 2u * stride) * params.x_inc));
    acc3 = addFields(acc3, absFields((id + 3u * stride) * params.x_inc));
  }
  for (var id = n4_floor + gid.x; id < params.n; id += stride) {
    acc0 = addFields(acc0, absFields(id * params.x_inc));
  }

  // Combine the 4 per-thread accumulators in Fields form too — still no
  // encode/decode needed, since none of them have touched Packed yet.
  let combined = addFields(addFields(acc0, acc1), addFields(acc2, acc3));
  tile[lid.x] = encode(combined.sign, combined.rawExp, combined.mantissaHi, combined.lo);
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] = addPair(tile[lid.x], tile[lid.x + s]); }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsMain[wgid.x] = tile[0].main;
    partialsAux[wgid.x] = tile[0].aux;
  }
}
