import { init, cleanup, gpuName, sscal } from "wgblas";
import { GpuVector } from "wgblas/classes/GpuVector";

const dGpu = await init({ powerPreference: "high-performance" });
const iGpu = await init({ powerPreference: "low-power" });
console.log(gpuName(dGpu).description, "and", gpuName(iGpu).description);

// A GpuVector is bound to whichever device created it — pass one explicitly
// to keep each vector resident on its own GPU.
const dVec = GpuVector.from(dGpu, new Float32Array([1, 2, 3, 4]));
const iVec = GpuVector.from(iGpu, new Float32Array([1, 2, 3, 4]));

await Promise.all([sscal(dGpu, 4, 2, dVec, 1), sscal(iGpu, 4, 5, iVec, 1)]);

const [a, b] = await Promise.all([dVec.read(), iVec.read()]);
console.log("dGpu result:", a);
console.log("iGpu result:", b);

dVec.destroy();
iVec.destroy();
if (typeof process !== "undefined") cleanup(); // releases both
