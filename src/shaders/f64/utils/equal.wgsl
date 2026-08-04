// Requires f64/dekker.wgsl concatenated first for the DD struct.

// a == b for double-double pairs — exact field equality, no rounding
// involved, so (like ddGreater) this needs no protection.
fn ddEqual(a: DD, b: DD) -> bool {
  return a.hi == b.hi && a.lo == b.lo;
}
