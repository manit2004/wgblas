import { init, cleanup, gpuName } from "wgblas";

await init({ powerPreference: "low-power" });
const { description, device } = gpuName();
console.log("description:", description, "device:", device);
if (typeof process !== "undefined") cleanup();
