import repl from "node:repl";
import {
  init, cleanup,
  GpuVector, GpuMatrix,
  Complex32, Complex32Array, Complex64, Complex64Array,
  sscal, cscal, sswap, saxpy, scopy, sdot, ddot, sasum, dasum, snrm2, isamax, idamax, srot, srotm, sgemv, ssymv, strsv, sger, ssyr, ssyr2, sgemm, sgemmtr, ssyrk, ssyr2k, ssymm, strmm, strsm,
} from "wgblas";

const device = await init();

console.log("\nwgblas\n");
const r = repl.start("wgblas> ");
Object.assign(r.context, {
  device,
  GpuVector, GpuMatrix,
  Complex32, Complex32Array, Complex64, Complex64Array,
  Float32Array, Float64Array,
  sscal, cscal, sswap, saxpy, scopy, sdot, ddot, sasum, dasum, snrm2, isamax, idamax, srot, srotm, sgemv, ssymv, strsv, sger, ssyr, ssyr2, sgemm, sgemmtr, ssyrk, ssyr2k, ssymm, strmm, strsm,
});

r.defineCommand("help", {
  help: "Show BLAS function signatures",
  action() {
    this.clearBufferedCommand();
    console.log(`
  sscal (device, n, alpha, x, incx)
  cscal (device, n, alpha, x, incx)                        (alpha: Complex32, x: Complex32Array or GpuVector)
  sswap (device, n, x, incx, y, incy)
  saxpy (device, n, alpha, x, incx, y, incy)
  scopy (device, n, x, incx, y, incy)
  sdot  (device, n, x, incx, y, incy)
  sasum (device, n, x, incx)
  ddot  (device, n, x, incx, y, incy)
  dasum (device, n, x, incx)
  snrm2 (device, n, x, incx)
  isamax(device, n, x, incx)
  idamax(device, n, x, incx)
  srot  (device, n, x, incx, y, incy, c, s)
  srotm (device, n, x, incx, y, incy, param)
  sgemv (device, trans, m, n, alpha, A, lda, x, incx, beta, y, incy)
  ssymv (device, uplo, n, alpha, A, lda, x, incx, beta, y, incy)
  strsv (device, uplo, trans, diag, n, A, lda, x, incx)
  sger  (device, m, n, alpha, x, incx, y, incy, A, lda)
  ssyr  (device, uplo, n, alpha, x, incx, A, lda)
  ssyr2 (device, uplo, n, alpha, x, incx, y, incy, A, lda)
  sgemm (device, transA, transB, m, n, k, alpha, A, lda, B, ldb, beta, C, ldc)
  sgemmtr(device, uplo, transA, transB, m, n, k, alpha, A, lda, B, ldb, beta, C, ldc)
  ssyrk (device, uplo, trans, n, k, alpha, A, lda, beta, C, ldc)
  ssyr2k(device, uplo, trans, n, k, alpha, A, lda, B, ldb, beta, C, ldc)
  ssymm (device, side, uplo, m, n, alpha, A, lda, B, ldb, beta, C, ldc)
  strmm (device, side, uplo, transA, diag, m, n, alpha, A, lda, B, ldb)
  strsm (device, side, uplo, transA, diag, m, n, alpha, A, lda, B, ldb)

  GpuVector.from(Float32Array)   v.read()  v.destroy()
  GpuVector.from(Float64Array)   v.read()  v.destroy()  (for ddot, dasum)
  GpuVector.from(Complex32Array) v.read()  v.destroy()  (for cscal)
  GpuMatrix.from(Float32Array, rows, cols[, lda])  mat.destroy()

  new Complex32(re, im)   new Complex32Array([re, im, ...])
  new Complex64(re, im)   new Complex64Array([re, im, ...])

  .exit  .save <file>  .load <file>  .editor
`);
    this.displayPrompt();
  },
});

r.on("exit", () => {
  cleanup();
  process.exit(0);
});
