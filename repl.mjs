import repl from "node:repl";
import {
  init, cleanup,
  GpuVector, GpuMatrix,
  sscal, sswap, saxpy, scopy, sdot, sasum, dasum, snrm2, isamax, srot, srotm, sgemv, ssymv, strsv,
} from "wgblas";

const device = await init();

console.log("\nwgblas\n");
const r = repl.start("wgblas> ");
Object.assign(r.context, {
  device,
  GpuVector, GpuMatrix,
  Float32Array, Float64Array,
  sscal, sswap, saxpy, scopy, sdot, sasum, dasum, snrm2, isamax, srot, srotm, sgemv, ssymv, strsv,
});

r.defineCommand("help", {
  help: "Show BLAS function signatures",
  action() {
    this.clearBufferedCommand();
    console.log(`
  sscal (device, n, alpha, x, incx)
  sswap (device, n, x, incx, y, incy)
  saxpy (device, n, alpha, x, incx, y, incy)
  scopy (device, n, x, incx, y, incy)
  sdot  (device, n, x, incx, y, incy)
  sasum (device, n, x, incx)
  dasum (device, n, x, incx)
  snrm2 (device, n, x, incx)
  isamax(device, n, x, incx)
  srot  (device, n, x, incx, y, incy, c, s)
  srotm (device, n, x, incx, y, incy, param)
  sgemv (device, trans, m, n, alpha, A, lda, x, incx, beta, y, incy)
  ssymv (device, uplo, n, alpha, A, lda, x, incx, beta, y, incy)
  strsv (device, uplo, trans, diag, n, A, lda, x, incx)

  GpuVector.from(Float32Array)   v.read()  v.destroy()
  GpuVector.from(Float64Array)   v.read()  v.destroy()  (for dasum)
  GpuMatrix.from(Float32Array, rows, cols[, lda])  mat.destroy()

  .exit  .save <file>  .load <file>  .editor
`);
    this.displayPrompt();
  },
});

r.on("exit", () => {
  cleanup();
  process.exit(0);
});
