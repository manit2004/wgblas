import stdlibStrmv from "@stdlib/blas-base-strmv";
import { GpuMatrix, GpuVector } from "wgblas";
import { strmv } from "wgblas/strmv";
import { loadParam } from "../helpers/validation.js";

// Shared param specs — used by both test.strmv.js (Float32Array API) and
// gpustorage.strmv.js (GpuMatrix/GpuVector API) so the two stay in lockstep.
const nSpec = loadParam("n");
export const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  trans:  loadParam("trans"),
  diag:   loadParam("diag"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
};

export const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

// Builds a correctly-sized y buffer for an edge case from n/incy alone, filled
// with a sentinel (99) at every position — strmv only ever writes y[i*incy]
// for i in [0,n), so a distinctive fill value makes both "the right positions
// got overwritten with real values" and "the gap positions were left alone" observable.
export function makeY(n, incy) {
  return new Float32Array((n - 1) * incy + 1).fill(99);
}

// GPU-resident adapter — A/x/y stay on the GPU across the call, result read back
// once at the end. GpuMatrix.from requires the full n*lda elements; a's A is only
// sized to the Float32Array API's minimum (n-1)*lda+n, which is shorter whenever
// lda > n, so zero-pad first (the extra padding columns are never read by the
// shader either way).
export async function callGpuResident(dev, a) {
  const paddedA = new Float32Array(a.n * a.lda);
  paddedA.set(a.A);
  const AGpu = GpuMatrix.from(paddedA, a.n, a.n, a.lda);
  const xGpu = GpuVector.from(a.x);
  const yGpu = GpuVector.from(a.y);
  try {
    await strmv(dev, a.uplo, a.trans, a.diag, a.n, AGpu, a.lda, xGpu, a.incx, yGpu, a.incy);
    const y = await yGpu.read();
    return { y };
  } finally {
    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();
  }
}

// Forward error bound for strmv
const eps = 2 ** -23;

// stdlib's strmv solves in place on x (no separate y, no incy) — this remaps
// its result into the shape wgblas's API returns: a y-sized array where only
// y[i*incy] for i in [0,n) is overwritten, everything else stays as it was in a.y.
export function stdlibReference(a) {
  const xCopy = a.x.slice();
  stdlibStrmv("row-major", a.uplo, a.trans, a.diag, a.n, a.A.slice(), a.lda, xCopy, a.incx);
  const out = new Float32Array(a.y);
  for (let i = 0; i < a.n; i++) out[i * a.incy] = xCopy[i * a.incx];
  return { y: out };
}

export function forwardFactor(gpu, ref, a) {
  const { uplo, trans, diag, n, A, lda, x, incx, incy } = a;
  const isLower = uplo === "lower";
  const isNoTrans = trans === "no-transpose";
  const isUnit = diag === "unit";
  const elem = (r, c) => (isUnit && r === c ? 1 : A[r * lda + c]);

  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;

    if (isNoTrans) {
      // y[i] = Σ_j A[i,j] * x[j]
      if (isLower) {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      }
    } else {
      // y[i] = Σ_j A[j,i] * x[j]
      if (isLower) {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      }
    }

    const bound = eps * (n + 1) * dotBound;
    if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
    else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
