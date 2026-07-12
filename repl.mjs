import repl from "node:repl";
import {
  init, cleanup,
  GpuVector,
  sscal, sswap, saxpy, scopy, sdot, sasum, snrm2, isamax, srot, srotm,
} from "wgblas";

const device = await init();

console.log("\nwgblas\n");
const r = repl.start("wgblas> ");
Object.assign(r.context, {
  device,
  GpuVector,
  Float32Array,
  sscal, sswap, saxpy, scopy, sdot, sasum, snrm2, isamax, srot, srotm,
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
  snrm2 (device, n, x, incx)
  isamax(device, n, x, incx)
  srot  (device, n, x, incx, y, incy, c, s)
  srotm (device, n, x, incx, y, incy, param)

  GpuVector.from(Float32Array)  v.read()  v.destroy()

  .exit  .save <file>  .load <file>  .editor
`);
    this.displayPrompt();
  },
});

r.on("exit", () => {
  cleanup();
  process.exit(0);
});
