// sum reduction (f64, double-double): collapses 2*WGS partial (hi, lo) pairs
// into one, using ddAddProtected instead of plain f32 `+` (see
// reduction/sum.wgsl for the f32 original this mirrors).
// dispatch: 1 workgroup of WGS threads. partialsHi/partialsLo must have
// exactly 2*WGS entries each. Concatenated after f64/dekker.wgsl for
// DD/ddAddProtected (see it for why plain ddAdd isn't safe).

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
