import stdlibStrmv from "@stdlib/blas-base-strmv";

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
