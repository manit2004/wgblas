/** @module devdocs/utility-functions/f64pack */

// Scratch buffers reused across calls for bit-pattern <-> float reinterpretation.
// dv8 is read/written exclusively through explicit big-endian DataView calls
// (never via Float64Array, whose byte order follows host endianness) so hi/lo
// word extraction is deterministic regardless of host architecture.
const buf8 = new ArrayBuffer(8);
const dv8 = new DataView(buf8);

const buf4 = new ArrayBuffer(4);
const u32View = new Uint32Array(buf4);
const f32View = new Float32Array(buf4);

function u32ToF32(bits) {
  u32View[0] = bits >>> 0;
  return f32View[0];
}

function f32ToU32(f) {
  f32View[0] = f;
  return u32View[0];
}

// Shared bit-scramble between an f64's raw fields (sign, 11-bit exponent,
// mantissa split as a 20-bit hi word + 32-bit lo word) and a [main, aux] f32
// pair. f64 has exactly 3 more exponent bits and 29 more mantissa bits than
// f32 — 3 + 29 = 32, i.e. exactly one f32's worth of bits, all of which fit
// in `aux`:
//   aux.sign + aux.exponent[7:6]  (3 bits) = f64's low 3 exponent bits
//   aux.exponent[5:0]             (6 bits) = top 6 of f64's low 29 mantissa bits
//   aux.mantissa                  (23 bits) = bottom 23 of f64's low 29 mantissa bits
function fieldsToPacked(sign, rawExp, mantissaHi, lo) {
  const expMain = rawExp >>> 3; // top 8 bits -> main's exponent
  const expExtra = rawExp & 0x7; // bottom 3 bits -> stashed in aux

  const mantTop3 = lo >>> 29; // top 3 bits of the low mantissa word
  const mantMain = (mantissaHi << 3) | mantTop3; // 20 + 3 = 23 bits -> main's mantissa
  const mantExtra29 = lo & 0x1fffffff; // bottom 29 bits -> stashed in aux

  const mainBits = (sign << 31) | (expMain << 23) | mantMain;

  const auxSign = (expExtra >>> 2) & 0x1;
  const auxExpTop2 = expExtra & 0x3;
  const auxExpBot6 = mantExtra29 >>> 23; // top 6 of the 29
  const auxMant23 = mantExtra29 & 0x7fffff; // bottom 23 of the 29
  const auxExp8 = (auxExpTop2 << 6) | auxExpBot6;

  const auxBits = (auxSign << 31) | (auxExp8 << 23) | auxMant23;

  return [u32ToF32(mainBits), u32ToF32(auxBits)];
}

function packedToFields(main, aux) {
  const mainBits = f32ToU32(main);
  const auxBits = f32ToU32(aux);

  const sign = mainBits >>> 31;
  const expMain = (mainBits >>> 23) & 0xff;
  const mantMain = mainBits & 0x7fffff; // 23 bits

  const auxSign = auxBits >>> 31;
  const auxExp8 = (auxBits >>> 23) & 0xff;
  const auxMant23 = auxBits & 0x7fffff;

  const expExtra = (auxSign << 2) | (auxExp8 >>> 6); // 3 bits
  const mantExtra29 = ((auxExp8 & 0x3f) << 23) | auxMant23; // 29 bits

  const rawExp = (expMain << 3) | expExtra; // 11 bits
  const mantissaHi = mantMain >>> 3; // top 20 bits
  const mantTop3 = mantMain & 0x7; // bottom 3 bits of mantMain

  const lo = ((mantTop3 << 29) | mantExtra29) >>> 0;

  return { sign, rawExp, mantissaHi, lo };
}

/**
 * Packs a double into two float32 bit-patterns for storage/transfer where only
 * f32 is available (e.g. WGSL, which has no f64 type). This is a raw bit
 * repacking, not a value-preserving numeric split — `aux` is not a meaningful
 * float on its own; only `unpackF64(main, aux)` reconstructs the original value.
 * @param {number} value
 * @returns {[number, number]} [main, aux] — two float32 values
 */
export function packF64(value) {
  dv8.setFloat64(0, value, false);
  const hi = dv8.getUint32(0, false); // sign(1) + exponent(11) + mantissa_hi(20)
  const lo = dv8.getUint32(4, false); // mantissa_lo(32)

  const sign = hi >>> 31;
  const rawExp = (hi >>> 20) & 0x7ff; // 11 bits
  const mantissaHi = hi & 0xfffff; // 20 bits

  return fieldsToPacked(sign, rawExp, mantissaHi, lo);
}

/**
 * Reconstructs the original double from the [main, aux] pair produced by
 * `packF64`. Bit-exact inverse.
 * @param {number} main
 * @param {number} aux
 * @returns {number}
 */
export function unpackF64(main, aux) {
  const { sign, rawExp, mantissaHi, lo } = packedToFields(main, aux);
  const hi = ((sign << 31) | (rawExp << 20) | mantissaHi) >>> 0;

  dv8.setUint32(0, hi, false);
  dv8.setUint32(4, lo, false);
  return dv8.getFloat64(0, false);
}
