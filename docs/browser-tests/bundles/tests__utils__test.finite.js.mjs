import { hasNonFinite, triangleHasNonFinite } from "./chunk-AIAZUKYM.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.finite.js
test("hasNonFinite finds \xB1Infinity and NaN on the stride only", () => {
  const x = new Float64Array([1, NaN, 2, 3, 4]);
  assert_default.equal(hasNonFinite(x, 5), true);
  assert_default.equal(hasNonFinite(x, 3, 2), false, "x[1] is a stride gap");
  assert_default.equal(hasNonFinite(new Float32Array([1, -Infinity]), 2), true);
  assert_default.equal(hasNonFinite(new Float32Array([1, 2, 3]), 3), false);
});
test("triangleHasNonFinite reads only the stored triangle", () => {
  const A = new Float64Array([1, Infinity, 0, NaN, 2, 3, 0, NaN, 4, 5, 6, NaN]);
  assert_default.equal(triangleHasNonFinite(A, 3, 4, true, false), false);
  assert_default.equal(triangleHasNonFinite(A, 3, 4, false, false), true);
});
test("triangleHasNonFinite skips the diagonal when it's unit", () => {
  const A = new Float32Array([NaN, 0, 1, Infinity]);
  assert_default.equal(triangleHasNonFinite(A, 2, 2, true, true), false);
  assert_default.equal(triangleHasNonFinite(A, 2, 2, true, false), true);
  assert_default.equal(triangleHasNonFinite(A, 2, 2, false, true), false);
  A[1] = -Infinity;
  assert_default.equal(triangleHasNonFinite(A, 2, 2, false, true), true);
});
test("a double beyond f32's range counts as non-finite (the GPU sees \xB1Infinity)", () => {
  assert_default.equal(hasNonFinite(new Float64Array([1, 1e300]), 2), true);
  assert_default.equal(
    hasNonFinite(new Float64Array([1, 1e-300]), 2),
    false,
    "underflow is 0, finite",
  );
  const A = new Float64Array([1, 0, -1e39, 2]);
  assert_default.equal(triangleHasNonFinite(A, 2, 2, true, false), true);
  assert_default.equal(triangleHasNonFinite(A, 2, 2, false, false), false);
});
