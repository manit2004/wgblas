import { init, cleanup, gpuName } from "wgblas";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const dGpu = await init({ powerPreference: "high-performance" });
const iGpu = await init({ powerPreference: "low-power" });
console.log(gpuName(dGpu).description, "and", gpuName(iGpu).description);

// A GpuMatrix is bound to whichever device created it — pass one explicitly
// to keep each matrix resident on its own GPU.
const dMat = GpuMatrix.from(dGpu, new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);
const iMat = GpuMatrix.from(iGpu, new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);

const [a, b] = await Promise.all([dMat.read(), iMat.read()]);
console.log("dGpu matrix:", a);
console.log("iGpu matrix:", b);

dMat.destroy();
iMat.destroy();
if (typeof process !== "undefined") cleanup(); // releases both
