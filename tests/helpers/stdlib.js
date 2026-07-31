// Central home for every routine's CPU (stdlib) reference. Most BLAS
// routines fall into one of a handful of call shapes — reduce-to-scalar,
// mutate-x-only, mutate-x-and-y, mutate-y-only, matrix-vector — so instead
// of every routine repeating its own slice/call/return boilerplate, each
// shape gets one factory below and every routine just supplies its stdlib
// function (and any extra args the shape doesn't already cover).
//
// strmv has a genuinely unique shape (it solves in place on x, then remaps
// that into y's shape), so it's a standalone export rather than a factory.
import stdlibSscal from "@stdlib/blas-base-sscal";
import stdlibSswap from "@stdlib/blas-base-sswap";
import stdlibSaxpy from "@stdlib/blas-base-saxpy";
import stdlibScopy from "@stdlib/blas-base-scopy";
import stdlibSdot from "@stdlib/blas-base-sdot";
import stdlibSasum from "@stdlib/blas-base-sasum";
import stdlibDasum from "@stdlib/blas-base-dasum";
import stdlibSnrm2 from "@stdlib/blas-base-snrm2";
import stdlibIsamax from "@stdlib/blas-base-isamax";
import stdlibSrot from "@stdlib/blas-base-srot";
import stdlibSrotm from "@stdlib/blas-base-srotm";
import stdlibSgemv from "@stdlib/blas-base-sgemv";
import stdlibSsymv from "@stdlib/blas-base-ssymv";
import stdlibStrmv from "@stdlib/blas-base-strmv";
import stdlibStrsv from "@stdlib/blas-base-strsv";
import stdlibSger from "@stdlib/blas-base-sger";
import stdlibSsyr from "@stdlib/blas-base-ssyr";
import stdlibSsyr2 from "@stdlib/blas-base-ssyr2";

// (n, x, incx) -> scalar, x untouched.
function makeReducerReference(stdlibFn) {
  return (a) => stdlibFn(a.n, a.x.slice(), a.incx);
}

// (n, x, incx, y, incy) -> scalar, x/y untouched.
function makeDotReference(stdlibFn) {
  return (a) => stdlibFn(a.n, a.x.slice(), a.incx, a.y.slice(), a.incy);
}

// (n, x, incx, y, incy, ...extra) mutates x and y in place — slice() both
// first so the reference doesn't mutate shared input, matching how the GPU
// path uses separate buffers. `extra(a)` supplies any trailing args.
function makeXYReference(stdlibFn, extra = () => []) {
  return (a) => {
    const x = a.x.slice();
    const y = a.y.slice();
    stdlibFn(a.n, x, a.incx, y, a.incy, ...extra(a));
    return { x, y };
  };
}

// (n, ...prefix, x, incx, y, incy) mutates only y in place, x untouched.
// `prefix(a)` supplies any leading args (e.g. alpha) before x.
function makeYReference(stdlibFn, prefix = () => []) {
  return (a) => {
    const y = a.y.slice();
    stdlibFn(a.n, ...prefix(a), a.x.slice(), a.incx, y, a.incy);
    return { y };
  };
}

// (order, ...dims, alpha, A, lda, x, incx, beta, y, incy) mutates only y in
// place. `dims(a)` supplies the trans/uplo + size args. `a.layout` (default
// "row-major") is forwarded as-is — stdlib's sgemv/ssymv natively support
// both orders.
function makeMatVecReference(stdlibFn, dims) {
  return (a) => {
    const out = a.y.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.alpha, a.A.slice(), a.lda, a.x.slice(), a.incx, a.beta, out, a.incy);
    return { y: out };
  };
}

// (order, ...dims, A, lda, x, incx) mutates only x in place, no
// alpha/beta/y — strsv's shape (solves op(A)*x=b in place on x). `dims(a)`
// supplies uplo/trans/diag/n. `a.layout` (default "row-major") is forwarded
// as-is — stdlib's strsv natively supports both orders.
function makeMatXReference(stdlibFn, dims) {
  return (a) => {
    const x = a.x.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.A.slice(), a.lda, x, a.incx);
    return { x };
  };
}

// (order, m, n, alpha, x, incx, y, incy, A, lda) mutates only A in place —
// sger's shape (rank-1 update, x/y are read-only). `dims(a)` supplies m/n.
// `a.layout` (default "row-major") is forwarded as-is — stdlib's sger
// natively supports both orders.
function makeMatrixReference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.alpha, a.x.slice(), a.incx, a.y.slice(), a.incy, A, a.lda);
    return { A };
  };
}

// (order, uplo, n, alpha, x, incx, A, lda) mutates only A in place — ssyr's
// shape (symmetric rank-1 update, x is read-only). `dims(a)` supplies uplo/n.
// `a.layout` (default "row-major") is forwarded as-is — stdlib's ssyr
// natively supports both orders.
function makeSymMatrixReference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.alpha, a.x.slice(), a.incx, A, a.lda);
    return { A };
  };
}

// (order, uplo, n, alpha, x, incx, y, incy, A, lda) mutates only A in place —
// ssyr2's shape (symmetric rank-2 update, x/y are read-only). `dims(a)`
// supplies uplo/n. `a.layout` (default "row-major") is forwarded as-is.
function makeSymMatrix2Reference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.alpha, a.x.slice(), a.incx, a.y.slice(), a.incy, A, a.lda);
    return { A };
  };
}

// sscal mutates x in place (with a leading alpha) and returns x directly,
// not wrapped — the one mutate-only-x shape, distinct from the others above.
export const sscalReference = (a) => {
  const x = a.x.slice();
  stdlibSscal(a.n, a.alpha, x, a.incx);
  return x;
};

export const sswapReference = makeXYReference(stdlibSswap);
export const srotReference = makeXYReference(stdlibSrot, (a) => [a.c, a.s]);
export const srotmReference = makeXYReference(stdlibSrotm, (a) => [a.param]);

export const saxpyReference = makeYReference(stdlibSaxpy, (a) => [a.alpha]);
export const scopyReference = makeYReference(stdlibScopy);

export const sdotReference = makeDotReference(stdlibSdot);
export const sasumReference = makeReducerReference(stdlibSasum);
export const dasumReference = makeReducerReference(stdlibDasum);
export const snrm2Reference = makeReducerReference(stdlibSnrm2);
export const isamaxReference = makeReducerReference(stdlibIsamax);

export const sgemvReference = makeMatVecReference(stdlibSgemv, (a) => [a.trans, a.m, a.n]);
export const ssymvReference = makeMatVecReference(stdlibSsymv, (a) => [a.uplo, a.n]);

// stdlib's strmv solves in place on x (no separate y, no incy) — this remaps
// its result into the shape wgblas's API returns: a y-sized array where only
// y[i*incy] for i in [0,n) is overwritten, everything else stays as it was in a.y.
// `a.layout` (default "row-major") is forwarded as-is — stdlib's strmv
// natively supports both orders.
export function strmvReference(a) {
  const xCopy = a.x.slice();
  stdlibStrmv(a.layout ?? "row-major", a.uplo, a.trans, a.diag, a.n, a.A.slice(), a.lda, xCopy, a.incx);
  const out = new Float32Array(a.y);
  for (let i = 0; i < a.n; i++) out[i * a.incy] = xCopy[i * a.incx];
  return { y: out };
}

export const strsvReference = makeMatXReference(stdlibStrsv, (a) => [a.uplo, a.trans, a.diag, a.n]);

export const sgerReference = makeMatrixReference(stdlibSger, (a) => [a.m, a.n]);

export const ssyrReference = makeSymMatrixReference(stdlibSsyr, (a) => [a.uplo, a.n]);

export const ssyr2Reference = makeSymMatrix2Reference(stdlibSsyr2, (a) => [a.uplo, a.n]);
