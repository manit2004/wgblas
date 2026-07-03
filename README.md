# wgblas

`wgblas` is an initiative to implement all the standard level 1, 2, 3 BLAS functions on the top of webgpu.

## Available Functions

- [sscal](https://manit2004.github.io/wgblas/functions/sscal.html)
- [sswap](https://manit2004.github.io/wgblas/functions/sswap.html)
- [saxpy](https://manit2004.github.io/wgblas/functions/saxpy.html)
- [scopy](https://manit2004.github.io/wgblas/functions/scopy.html)
- [sdot](https://manit2004.github.io/wgblas/functions/sdot.html)
- [sasum](https://manit2004.github.io/wgblas/functions/sasum.html)
- [snrm2](https://manit2004.github.io/wgblas/functions/snrm2.html)
- [isamax](https://manit2004.github.io/wgblas/functions/isamax.html)
- [srot](https://manit2004.github.io/wgblas/functions/srot.html)
- [srotm](https://manit2004.github.io/wgblas/functions/srotm.html)

## Browser Support

wgblas runs in any browser with WebGPU enabled. Check if it's working in your browser at [webgpureport.org](https://webgpureport.org).

### Chrome (recommended)

For full WebGPU control, enable all three flags at `chrome://flags` and relaunch:

| Flag | What it does |
|------|--------------|
| `#enable-unsafe-webgpu` | Enables WebGPU |
| `#force-enable-webgpu-interop` | Uses the real GPU via Vulkan (Linux) — without this Chrome may fall back to SwiftShader, a CPU-based software renderer |
| `#enable-webgpu-developer-features` | Unlocks additional GPU features |

You can verify which GPU is being used at [webgpureport.org](https://webgpureport.org) — if the adapter name shows **SwiftShader**, the real GPU is not being used.

### Firefox

WebGPU must be enabled manually via `about:config`. Search for each preference and set it:

| Preference | Value | What it does |
|------------|-------|--------------|
| `dom.webgpu.enabled` | `true` | Enables WebGPU |
| `dom.webgpu.wgpu-backend` | `vulkan` | Forces the real GPU via Vulkan — without this Firefox may use a software renderer |
| `gfx.webgpu.ignore-blocklist` | `true` | Bypasses the GPU blocklist |

Note: `dom.webgpu.wgpu-backend` is a **string** preference — click the pencil icon to edit it and type `vulkan`.

Restart Firefox after making changes.

> **Note:** Firefox's WebGPU implementation is incomplete and some routines may not work correctly. Chrome is recommended.
>
> **Multi-GPU:** Firefox only exposes one WebGPU adapter (the display GPU, typically integrated) even on dual-GPU systems — verified via `about:support` → Graphics → WebGPU Default Adapter. Chrome picks the discrete GPU via `powerPreference: "high-performance"`; Firefox does not.

## Requirements

- Node.js 18+

## Example usage

This package is not yet published to npm. Clone the repo and install it locally in your project:

```sh
git clone https://github.com/manit2004/wgblas.git
cd your-project
npm install /path/to/wgblas
```

### Example Code Snippet

```js
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { randomFloat32Array } from "wgblas/util/random";

const device = await init();

const n = 10;
const alpha = 2.0;
const x = randomFloat32Array(n, -10, 10);

console.log("before:", x);
const result = await sscal(device, n, alpha, x, 1);
console.log("after: ", result);
cleanup();
```

### Benchmark Mode

Pass `{ benchmark: true }` to `init()` to enable GPU timestamp queries — BLAS functions will then return `{ result, gpuTimeMs }` instead of just the result.

**Note:** Here `gpuTimeMs` is only the gpu compute time which doesn't include device to host and host to device transfer time duration.

```js
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";

const device = await init({ benchmark: true });

const n = 5;
const alpha = 2.0;
const x = new Float32Array([1, 2, 3, 4, 5]);

const { result, gpuTimeMs } = await sscal(device, n, alpha, x, 1);
console.log(result);                              // Float32Array [2, 4, 6, 8, 10]
console.log(`compute time: ${gpuTimeMs.toFixed(4)} ms`);

cleanup();
```

### `GpuVector` usage

`GpuVector` keeps data resident on the GPU between operations — upload once, chain any number of operations, read back once. This eliminates the redundant uploads and readbacks between steps, which are often more expensive than the compute itself.

```js
import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/util/random";

const device = await init();

const n = 10;
const alpha = 2;
const scale = 0.5;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:      ", x);
console.log("y:      ", y);

// results stay in the GPU.
await saxpy(device, n, alpha, xGpu, 1, yGpu, 1);
await sscal(device, n, scale, yGpu, 1);

// single readback
const result = await yGpu.read();
console.log("result: ", result);

xGpu.destroy();
yGpu.destroy();

cleanup();
```
