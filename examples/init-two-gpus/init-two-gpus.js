import { init, cleanup, gpuName, sscal } from "wgblas";

const dGpu = await init({ powerPreference: "high-performance" });
const iGpu = await init({ powerPreference: "low-power" });
console.log(gpuName(dGpu).description, "and", gpuName(iGpu).description);
const [a, b] = await Promise.all([
  sscal(dGpu, 4, 2, new Float32Array([1, 2, 3, 4]), 1),
  sscal(iGpu, 4, 5, new Float32Array([1, 2, 3, 4]), 1),
]);
console.log("dGpu result:", a.x);
console.log("iGpu result:", b.x);
if (typeof process !== "undefined") cleanup(); // releases both
