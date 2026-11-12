// Non-finite input checks (src/util/finite.mjs). Pure CPU — no GPU needed.
//
// strsv/dtrsv/strsm take the substitution path for host arrays holding
// ±Infinity or NaN, so these must see exactly the elements a routine reads:
// the strided vector elements, and the stored triangle (without the diagonal
// when it's implicitly unit).
import { test } from "node:test";
import assert from "node:assert/strict";
import { hasNonFinite, triangleHasNonFinite } from "../../src/util/finite.mjs";

test("hasNonFinite finds ±Infinity and NaN on the stride only", () => {
  const x = new Float64Array([1, NaN, 2, 3, 4]);
  assert.equal(hasNonFinite(x, 5), true);
  assert.equal(hasNonFinite(x, 3, 2), false, "x[1] is a stride gap");
  assert.equal(hasNonFinite(new Float32Array([1, -Infinity]), 2), true);
  assert.equal(hasNonFinite(new Float32Array([1, 2, 3]), 3), false);
});

test("triangleHasNonFinite reads only the stored triangle", () => {
  // 3×3 at ld 4 (one padding column), row-major: Infinity above the diagonal,
  // NaN in the padding.
  const A = new Float64Array([1, Infinity, 0, NaN, 2, 3, 0, NaN, 4, 5, 6, NaN]);
  assert.equal(triangleHasNonFinite(A, 3, 4, true, false), false);
  assert.equal(triangleHasNonFinite(A, 3, 4, false, false), true);
});

test("triangleHasNonFinite skips the diagonal when it's unit", () => {
  const A = new Float32Array([NaN, 0, 1, Infinity]);
  assert.equal(triangleHasNonFinite(A, 2, 2, true, true), false);
  assert.equal(triangleHasNonFinite(A, 2, 2, true, false), true);
  assert.equal(triangleHasNonFinite(A, 2, 2, false, true), false);
  A[1] = -Infinity;
  assert.equal(triangleHasNonFinite(A, 2, 2, false, true), true);
});

test("a double beyond f32's range counts as non-finite (the GPU sees ±Infinity)", () => {
  assert.equal(hasNonFinite(new Float64Array([1, 1e300]), 2), true);
  assert.equal(
    hasNonFinite(new Float64Array([1, 1e-300]), 2),
    false,
    "underflow is 0, finite",
  );
  const A = new Float64Array([1, 0, -1e39, 2]);
  assert.equal(triangleHasNonFinite(A, 2, 2, true, false), true);
  assert.equal(triangleHasNonFinite(A, 2, 2, false, false), false);
});
