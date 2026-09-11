import { init, cleanup, gpuName } from "wgblas";

await init();
console.log("GPU:", gpuName().description);
if (typeof process !== "undefined") cleanup(); // Node.js only — browser cleanup is automatic
