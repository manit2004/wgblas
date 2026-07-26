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
// mantissa split as a 20-bit hi word + 32-bit lo word) and a [main, aux]
// pair. f64 has exactly 3 more exponent bits and 29 more mantissa bits than
// f32 — 3 + 29 = 32, i.e. exactly one f32's worth of bits, all of which fit
// in `aux`:
//   aux.sign + aux.exponent[7:6]  (3 bits) = f64's low 3 exponent bits
//   aux.exponent[5:0]             (6 bits) = top 6 of f64's low 29 mantissa bits
//   aux.mantissa                  (23 bits) = bottom 23 of f64's low 29 mantissa bits
//
// `aux` is deliberately kept as a raw u32 integer, never converted to an
// actual float32 value (unlike `main`, which genuinely is a float32 for
// reuse in float-typed math like abs()). Any combination of the source bits
// above can land on aux.exponent === 0xff — i.e. aux's bit pattern reads as
// a NaN or Infinity if it's ever treated as a real float — and this can
// happen not just for unusual inputs but for the RESULT of an ordinary
// addition (see f64add.wgsl's computeSum), so it can't be filtered out at
// the input boundary. A JS engine or GPU canonicalizes a NaN bit pattern
// (sets its mantissa's quiet bit) the moment it passes through an actual
// Float32Array or f32-typed GPU buffer/register as a VALUE — silently
// corrupting the payload. Since aux never needs float semantics anywhere
// (WGSL only ever bitcasts it back to u32 for decode()), storing/uploading/
// reading it exclusively as Uint32Array bits (see GpuVector, buffer.mjs)
// sidesteps the whole class of corruption rather than working around it.
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

  const auxBits = ((auxSign << 31) | (auxExp8 << 23) | auxMant23) >>> 0;

  return [u32ToF32(mainBits), auxBits];
}

function packedToFields(main, auxBits) {
  const mainBits = f32ToU32(main);
  auxBits = auxBits >>> 0;

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

// main (unlike aux) genuinely is a float32 value — it gets reinterpreted with
// real float ops (e.g. abs() in dasum.wgsl), so it can't be transported as
// raw u32 the way aux is. That leaves a narrow residual gap: main.exponent is
// `rawExp >>> 3`, which hits 0xff (main's own NaN/Infinity pattern) whenever
// the f64's raw exponent is >= 2040 — i.e. |value| >= ~1.4e306, plus actual
// ±Infinity/NaN (rawExp === 2047). Any real Float32Array/GPU round-trip of
// such a main would get silently NaN-canonicalized, the same corruption class
// aux was fixed for. Since main can't take that fix, reject the range instead
// of silently corrupting it.
const MIN_UNSAFE_RAW_EXP = 2040;

/**
 * Packs a double into a [main, aux] pair for storage/transfer where only f32
 * is available (e.g. WGSL, which has no f64 type). This is a raw bit
 * repacking, not a value-preserving numeric split — neither half is a
 * meaningful float on its own; only `unpackF64(main, aux)` reconstructs the
 * original value.
 * @param {number} value - finite double with |value| < ~1.4e306 (see
 *   MIN_UNSAFE_RAW_EXP above); larger magnitudes, ±Infinity, and NaN would
 *   produce a `main` whose bit pattern is itself NaN/Infinity-shaped, which
 *   silently corrupts on any real float32 round-trip, so they're rejected.
 * @returns {[number, number]} `[main, aux]` — main is a float32 value, aux is
 *   a raw uint32 bit pattern (0 to 2^32-1). Store/transport aux exclusively
 *   via Uint32Array/`array<u32>` — never as an actual float value — see the
 *   comment above `fieldsToPacked`.
 */
export function packF64(value) {
  dv8.setFloat64(0, value, false);
  const hi = dv8.getUint32(0, false); // sign(1) + exponent(11) + mantissa_hi(20)
  const lo = dv8.getUint32(4, false); // mantissa_lo(32)

  const sign = hi >>> 31;
  const rawExp = (hi >>> 20) & 0x7ff; // 11 bits
  const mantissaHi = hi & 0xfffff; // 20 bits

  if (rawExp >= MIN_UNSAFE_RAW_EXP) {
    throw new RangeError(
      `packF64: |${value}| is too large to pack safely (must be finite with ` +
        `magnitude below ~1.4e306); main's bit pattern would itself be NaN/` +
        `Infinity-shaped and get silently corrupted by any real float32 round-trip`,
    );
  }

  return fieldsToPacked(sign, rawExp, mantissaHi, lo);
}

/**
 * Reconstructs the original double from the [main, aux] pair produced by
 * `packF64`. Bit-exact inverse.
 * @param {number} main - float32 value
 * @param {number} aux - raw uint32 bit pattern (as read from a Uint32Array/`array<u32>`)
 * @returns {number}
 */
export function unpackF64(main, aux) {
  const { sign, rawExp, mantissaHi, lo } = packedToFields(main, aux);
  const hi = ((sign << 31) | (rawExp << 20) | mantissaHi) >>> 0;

  dv8.setUint32(0, hi, false);
  dv8.setUint32(4, lo, false);
  return dv8.getFloat64(0, false);
}
