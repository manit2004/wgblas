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
import stdlibIdamax from "@stdlib/blas-base-idamax";
import stdlibSrot from "@stdlib/blas-base-srot";
import stdlibSrotm from "@stdlib/blas-base-srotm";
import stdlibSgemv from "@stdlib/blas-base-sgemv";
import stdlibSsymv from "@stdlib/blas-base-ssymv";
import stdlibStrmv from "@stdlib/blas-base-strmv";
import stdlibStrsv from "@stdlib/blas-base-strsv";
import stdlibSger from "@stdlib/blas-base-sger";
import stdlibSsyr from "@stdlib/blas-base-ssyr";
import stdlibSsyr2 from "@stdlib/blas-base-ssyr2";
import stdlibSgemm from "@stdlib/blas-base-sgemm";

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

// (n, ...prefix, x, incx) mutates only x in place — no y at all.
// `prefix(a)` supplies any leading args (e.g. alpha) before x.
function makeXReference(stdlibFn, prefix = () => []) {
  return (a) => {
    const x = a.x.slice();
    stdlibFn(a.n, ...prefix(a), x, a.incx);
    return { x };
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

// (order, ...dims, alpha, A, lda, B, ldb, beta, C, ldc) mutates only C in
// place — the general Level 3 "gemm" shape (matrix-matrix product, A/B
// read-only), shared by every future Level 3 routine with this call shape
// the same way makeMatVecReference covers every L2 matrix-vector one.
// `dims(a)` supplies the trans flags + m/n/k. `a.layout` (default
// "row-major") is forwarded as-is.
function makeMatMatReference(stdlibFn, dims) {
  return (a) => {
    const C = a.C.slice();
    stdlibFn(a.layout ?? "row-major", ...dims(a), a.alpha, a.A.slice(), a.lda, a.B.slice(), a.ldb, a.beta, C, a.ldc);
    return { C };
  };
}

// Wraps a full "gemm"-shaped reference (e.g. sgemmReference) to keep only
// the `a.uplo`-selected triangle of C, leaving the rest untouched — for
// Level 3 routines with no CPU oracle package.
function makeMatMatTriangularReference(matMatFn) {
  return (a) => {
    const { C: full } = matMatFn(a);
    const isCM = (a.layout ?? "row-major") === "column-major";
    const out = a.C.slice();
    const isLower = a.uplo === "lower";
    const m = a.m ?? a.n; // square-C routines (ssyrk) have no separate m
    for (let i = 0; i < m; i++) {
      const jStart = isLower ? 0 : i;
      const jEnd = isLower ? Math.min(i + 1, a.n) : a.n;
      for (let j = jStart; j < jEnd; j++) {
        const idx = isCM ? j * a.ldc + i : i * a.ldc + j;
        out[idx] = full[idx];
      }
    }
    return { C: out };
  };
}

export const sscalReference = makeXReference(stdlibSscal, (a) => [a.alpha]);

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
export const idamaxReference = makeReducerReference(stdlibIdamax);

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

export const sgemmReference = makeMatMatReference(stdlibSgemm, (a) => [a.transA, a.transB, a.m, a.n, a.k]);

export const sgemmtrReference = makeMatMatTriangularReference(sgemmReference);

// ssyrk: C := uplo(alpha*op(A)*op(A)^T + beta*C) — reuses sgemmReference with
// B := A (same mapping ssyrk.mjs itself uses: transB is the opposite of
// trans, m := n since C is always square), then masks to the uplo triangle.
export const ssyrkReference = makeMatMatTriangularReference((a) => {
  const transB = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  return sgemmReference({
    transA: a.trans, transB, m: a.n, n: a.n, k: a.k,
    alpha: a.alpha, A: a.A, lda: a.lda, B: a.A, ldb: a.lda,
    beta: a.beta, C: a.C, ldc: a.ldc, layout: a.layout,
  });
});

// ssyr2k: C := uplo(alpha*op(A)*op(B)^T + alpha*op(B)*op(A)^T + beta*C) —
// same mapping ssyr2k.mjs itself uses: two sgemmReference calls, term 2
// accumulating onto term 1's full result with beta=1, then masks to the
// uplo triangle.
export const ssyr2kReference = makeMatMatTriangularReference((a) => {
  const transOther = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  const { C: afterTerm1 } = sgemmReference({
    transA: a.trans, transB: transOther, m: a.n, n: a.n, k: a.k,
    alpha: a.alpha, A: a.A, lda: a.lda, B: a.B, ldb: a.ldb,
    beta: a.beta, C: a.C, ldc: a.ldc, layout: a.layout,
  });
  return sgemmReference({
    transA: a.trans, transB: transOther, m: a.n, n: a.n, k: a.k,
    alpha: a.alpha, A: a.B, lda: a.ldb, B: a.A, ldb: a.lda,
    beta: 1.0, C: afterTerm1, ldc: a.ldc, layout: a.layout,
  });
});

// Mirror-expands a symmetric matrix's `uplo` triangle into a full order×order
// dense array, tightly packed row-major. Since the result is symmetric and
// square with ld === order, that same flat array is *also* valid
// column-major storage of the same matrix (A[i,j]===A[j,i] means the
// row-major and column-major index formulas agree) — so, unlike sgemm's own
// operands, this dense copy needs no layout-specific handling downstream.
function denseSymmetric(A, lda, order, uplo, layout) {
  const isCM = (layout ?? "row-major") === "column-major";
  const out = new Float32Array(order * order);
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      const isStored = uplo === "lower" ? j <= i : j >= i;
      const sr = isStored ? i : j;
      const sc = isStored ? j : i;
      out[i * order + j] = isCM ? A[sc * lda + sr] : A[sr * lda + sc];
    }
  }
  return out;
}

// ssymm: C := alpha*A*B + beta*C (side='left') or alpha*B*A + beta*C
// (side='right'), A symmetric — same composition ssymm.mjs itself uses:
// mirror-expand A to a dense operand, then a plain gemm. No triangular
// masking afterward: unlike ssyrk/ssyr2k, ssymm's C is a general dense
// matrix, not itself symmetric.
export const ssymmReference = (a) => {
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseSymmetric(a.A, a.lda, aOrder, a.uplo, a.layout);
  const [matA, ldA, matB, ldB] = a.side === "left"
    ? [denseA, aOrder, a.B, a.ldb]
    : [a.B, a.ldb, denseA, aOrder];
  return sgemmReference({
    transA: "no-transpose", transB: "no-transpose", m: a.m, n: a.n, k: aOrder,
    alpha: a.alpha, A: matA, lda: ldA, B: matB, ldb: ldB,
    beta: a.beta, C: a.C, ldc: a.ldc, layout: a.layout,
  });
};

// Zero-fills a triangular matrix's unstored triangle into a full order×order
// dense array representing op(A) directly (unlike denseSymmetric, this is
// NOT layout-invariant — A isn't symmetric — so it's written out in the same
// layout as `layout` so the result can share that layout with B/C downstream).
function denseTriangular(A, lda, order, uplo, transA, diag, layout) {
  const isCM = (layout ?? "row-major") === "column-major";
  const readA = (row, col) => (isCM ? A[col * lda + row] : A[row * lda + col]);
  const out = new Float32Array(order * order);
  const writeOut = (row, col, v) => { out[isCM ? col * order + row : row * order + col] = v; };
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      if (i === j) { writeOut(i, j, diag === "unit" ? 1 : readA(i, i)); continue; }
      const meaningful = transA === "no-transpose"
        ? (uplo === "lower" ? j <= i : j >= i)
        : (uplo === "lower" ? j >= i : j <= i);
      writeOut(i, j, meaningful ? readA(transA === "no-transpose" ? i : j, transA === "no-transpose" ? j : i) : 0);
    }
  }
  return out;
}

// strmm: B := alpha*op(A)*B (side='left') or alpha*B*op(A) (side='right'), A
// triangular — same composition strmm.mjs itself uses: zero-fill op(A) to a
// dense operand, then a plain gemm with beta=0 (no C term). Seeds the gemm's
// "C" with B itself (not a fresh zero array) so stride-padding gaps — never
// touched by gemm's tight m x n write — keep B's own original bytes,
// matching strmm.mjs's actual in-place-mutation behavior.
export const strmmReference = (a) => {
  const layout = a.layout ?? "row-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseTriangular(a.A, a.lda, aOrder, a.uplo, a.transA, a.diag, layout);
  const [matA, ldA, matB, ldB] = a.side === "left"
    ? [denseA, aOrder, a.B, a.ldb]
    : [a.B, a.ldb, denseA, aOrder];
  const { C } = sgemmReference({
    transA: "no-transpose", transB: "no-transpose", m: a.m, n: a.n, k: aOrder,
    alpha: a.alpha, A: matA, lda: ldA, B: matB, ldb: ldB,
    beta: 0.0, C: a.B, ldc: a.ldb, layout,
  });
  return { B: C };
};

// Solves denseA@X=alpha*B (side='left') or X@denseA=alpha*B (side='right')
// via direct forward/backward substitution on the already zero-filled
// op(A) — simple and independent of strsm.mjs's own block-inversion
// technique, so it's a genuine cross-check, not just a restatement.
function solveTriangular(denseA, aOrder, B, ldb, layout, m, n, side, alpha, opIsLower) {
  const isCM = layout === "column-major";
  const aElem = (row, col) => (isCM ? denseA[col * aOrder + row] : denseA[row * aOrder + col]);
  const idxOf = (row, col) => (isCM ? col * ldb + row : row * ldb + col);
  const out = Float32Array.from(B);

  if (side === "left") {
    for (let step = 0; step < aOrder; step++) {
      const i = opIsLower ? step : aOrder - 1 - step;
      for (let j = 0; j < n; j++) {
        let acc = alpha * B[idxOf(i, j)];
        if (opIsLower) { for (let k = 0; k < i; k++) acc -= aElem(i, k) * out[idxOf(k, j)]; }
        else { for (let k = i + 1; k < aOrder; k++) acc -= aElem(i, k) * out[idxOf(k, j)]; }
        out[idxOf(i, j)] = acc / aElem(i, i);
      }
    }
  } else {
    for (let step = 0; step < aOrder; step++) {
      const j = opIsLower ? aOrder - 1 - step : step;
      for (let i = 0; i < m; i++) {
        let acc = alpha * B[idxOf(i, j)];
        if (opIsLower) { for (let k = j + 1; k < aOrder; k++) acc -= out[idxOf(i, k)] * aElem(k, j); }
        else { for (let k = 0; k < j; k++) acc -= out[idxOf(i, k)] * aElem(k, j); }
        out[idxOf(i, j)] = acc / aElem(j, j);
      }
    }
  }
  return out;
}

// strsm: solves op(A)*X=alpha*B (side='left') or X*op(A)=alpha*B
// (side='right') for X, overwriting B. A triangular.
export const strsmReference = (a) => {
  const layout = a.layout ?? "row-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseTriangular(a.A, a.lda, aOrder, a.uplo, a.transA, a.diag, layout);
  const opIsLower = (a.transA === "no-transpose") === (a.uplo === "lower");
  const B = solveTriangular(denseA, aOrder, a.B, a.ldb, layout, a.m, a.n, a.side, a.alpha, opIsLower);
  return { B };
};
