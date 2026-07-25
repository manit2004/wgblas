// Central home for every routine's CPU (stdlib) reference. Most BLAS
// routines fall into one of a handful of call shapes — reduce-to-scalar,
// mutate-x-only, mutate-x-and-y, mutate-y-only, matrix-vector — so instead
// of every routine repeating its own slice/call/return boilerplate, each
// shape gets one factory below and every routine just supplies its stdlib
// function (and any extra args the shape doesn't already cover).
//
// strmv is the one routine with a genuinely unique shape (it solves in
// place on x, then remaps that into y's shape) — its reference stays next
// to its forwardFactor in tests/strmv/helpers.js instead of living here.
import stdlibSscal from "@stdlib/blas-base-sscal";
import stdlibSswap from "@stdlib/blas-base-sswap";
import stdlibSaxpy from "@stdlib/blas-base-saxpy";
import stdlibScopy from "@stdlib/blas-base-scopy";
import stdlibSdot from "@stdlib/blas-base-sdot";
import stdlibSasum from "@stdlib/blas-base-sasum";
import stdlibSnrm2 from "@stdlib/blas-base-snrm2";
import stdlibIsamax from "@stdlib/blas-base-isamax";
import stdlibSrot from "@stdlib/blas-base-srot";
import stdlibSrotm from "@stdlib/blas-base-srotm";
import stdlibSgemv from "@stdlib/blas-base-sgemv";
import stdlibSsymv from "@stdlib/blas-base-ssymv";
import stdlibStrsv from "@stdlib/blas-base-strsv";

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

// ("row-major", ...dims, alpha, A, lda, x, incx, beta, y, incy) mutates only
// y in place. `dims(a)` supplies the trans/uplo + size args.
function makeMatVecReference(stdlibFn, dims) {
  return (a) => {
    const out = a.y.slice();
    stdlibFn("row-major", ...dims(a), a.alpha, a.A.slice(), a.lda, a.x.slice(), a.incx, a.beta, out, a.incy);
    return { y: out };
  };
}

// ("row-major", ...dims, A, lda, x, incx) mutates only x in place, no
// alpha/beta/y — strsv's shape (solves op(A)*x=b in place on x). `dims(a)`
// supplies uplo/trans/diag/n.
function makeMatXReference(stdlibFn, dims) {
  return (a) => {
    const x = a.x.slice();
    stdlibFn("row-major", ...dims(a), a.A.slice(), a.lda, x, a.incx);
    return { x };
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
export const snrm2Reference = makeReducerReference(stdlibSnrm2);
export const isamaxReference = makeReducerReference(stdlibIsamax);

export const sgemvReference = makeMatVecReference(stdlibSgemv, (a) => [a.trans, a.m, a.n]);
export const ssymvReference = makeMatVecReference(stdlibSsymv, (a) => [a.uplo, a.n]);

export const strsvReference = makeMatXReference(stdlibStrsv, (a) => [a.uplo, a.trans, a.diag, a.n]);
