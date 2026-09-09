// Random array generators used by fixtures and benchmarks. Pure JS, no GPU
// device needed — these never touch WebGPU.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  randomFloat32Array,
  randomFloat64Array,
  randomTriangularFloat32Array,
} from "../../src/random/random.mjs";

test("randomFloat32Array returns n values within [low, high)", () => {
  const x = randomFloat32Array(200, -3, 5);
  assert.ok(x instanceof Float32Array);
  assert.equal(x.length, 200);
  for (const v of x) {
    assert.ok(v >= -3 && v < 5, `${v} out of [-3, 5)`);
  }
});

test("randomFloat32Array defaults to [-1, 1)", () => {
  const x = randomFloat32Array(200);
  for (const v of x) assert.ok(v >= -1 && v < 1);
});

test("randomFloat64Array returns n values within [low, high)", () => {
  const x = randomFloat64Array(200, 10, 20);
  assert.ok(x instanceof Float64Array);
  assert.equal(x.length, 200);
  for (const v of x) assert.ok(v >= 10 && v < 20);
});

test("randomTriangularFloat32Array rejects an invalid uplo", () => {
  assert.throws(
    () => randomTriangularFloat32Array(4, 4, "diagonal"),
    /uplo must be 'lower' or 'upper'/,
  );
});

test("randomTriangularFloat32Array rejects an invalid layout", () => {
  assert.throws(
    () => randomTriangularFloat32Array(4, 4, "lower", -1, 1, 5, 15, "diag"),
    /layout must be 'row-major' or 'column-major'/,
  );
});

test("randomTriangularFloat32Array rejects lda < n", () => {
  assert.throws(() => randomTriangularFloat32Array(4, 3), /lda must be >= n/);
});

// Shared shape check: the populated triangle holds off-diagonal values in
// [low, high), the opposite triangle stays zero (never written), and the
// diagonal holds [diagLow, diagHigh) — for both row-major and column-major
// storage, addressed with each layout's own flat-index formula.
function assertTriangle(A, n, lda, uplo, layout, low, high, diagLow, diagHigh) {
  const isColMajor = layout === "column-major";
  const idx = (i, j) => (isColMajor ? j * lda + i : i * lda + j);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = A[idx(i, j)];
      if (i === j) {
        assert.ok(
          v >= diagLow && v < diagHigh,
          `diagonal (${i},${i})=${v} out of [${diagLow}, ${diagHigh})`,
        );
      } else if (uplo === "lower" ? j < i : j > i) {
        assert.ok(
          v >= low && v < high,
          `(${i},${j})=${v} out of [${low}, ${high})`,
        );
      } else {
        assert.equal(
          v,
          0,
          `(${i},${j}) outside the ${uplo} triangle must be 0`,
        );
      }
    }
  }
}

test("randomTriangularFloat32Array: lower, row-major", () => {
  const n = 6,
    lda = 8;
  const A = randomTriangularFloat32Array(n, lda, "lower", -2, 2, 5, 15);
  assert.equal(A.length, n * lda);
  assertTriangle(A, n, lda, "lower", "row-major", -2, 2, 5, 15);
});

test("randomTriangularFloat32Array: upper, row-major", () => {
  const n = 6,
    lda = 6;
  const A = randomTriangularFloat32Array(n, lda, "upper", -2, 2, 5, 15);
  assertTriangle(A, n, lda, "upper", "row-major", -2, 2, 5, 15);
});

test("randomTriangularFloat32Array: lower, column-major", () => {
  const n = 6,
    lda = 8;
  const A = randomTriangularFloat32Array(
    n,
    lda,
    "lower",
    -2,
    2,
    5,
    15,
    "column-major",
  );
  assert.equal(A.length, n * lda);
  assertTriangle(A, n, lda, "lower", "column-major", -2, 2, 5, 15);
});

test("randomTriangularFloat32Array: upper, column-major", () => {
  const n = 6,
    lda = 6;
  const A = randomTriangularFloat32Array(
    n,
    lda,
    "upper",
    -2,
    2,
    5,
    15,
    "column-major",
  );
  assertTriangle(A, n, lda, "upper", "column-major", -2, 2, 5, 15);
});

test("randomTriangularFloat32Array: row-major and column-major store the transpose of each other", () => {
  // Fixed diagLow===diagHigh and low===high pins every value deterministically,
  // so the two layouts' outputs must be exact transposes, byte for byte.
  const n = 5,
    lda = 5;
  const rowMajor = randomTriangularFloat32Array(n, lda, "lower", 1, 1, 9, 9);
  const colMajor = randomTriangularFloat32Array(
    n,
    lda,
    "lower",
    1,
    1,
    9,
    9,
    "column-major",
  );
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      assert.equal(
        colMajor[j * lda + i],
        rowMajor[i * lda + j],
        `(${i},${j}) should match under the transpose mapping`,
      );
});
