# wgblas

[![Tests](https://github.com/manit2004/wgblas/actions/workflows/test-gpu.yml/badge.svg)](https://github.com/manit2004/wgblas/actions/workflows/test-gpu.yml)

`wgblas` implements all the standard single-precision level 1, 2, and 3 BLAS routines on top of WebGPU. Next up: double-precision routines, and single- and double-precision complex routines.

## Requirements

- Node.js 22+

## Installation

```sh
npm install wgblas
```

## Example usage

### Example Code Snippet

```js
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";

const device = await init();

const n = 5;
const alpha = 3;
const x = new Float32Array([1, 2, 3, 4, 5]);

console.log("before:", x);
const { x: result } = await sscal(device, n, alpha, x, 1);
console.log("after: ", result); // [3, 6, 9, 12, 15]
cleanup();
```

### Browser (standalone HTML)

No bundler needed. Load the pre-built browser bundle from the CDN and use `window.wgblas` directly:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>sscal — wgblas browser example</title>
    <script src="https://unpkg.com/wgblas/dist/wgblas.browser.js"></script>
  </head>
  <body>
    <pre id="out">Running…</pre>
    <script>
      const { init, sscal, cleanup } = window.wgblas;

      (async () => {
        const device = await init();

        const n = 5;
        const alpha = 3;
        const x = new Float32Array([1, 2, 3, 4, 5]);

        const xBefore = Array.from(x).map(v => v.toFixed(4)).join(", ");

        const { x: result } = await sscal(device, n, alpha, x, 1);

        document.getElementById("out").textContent =
          "before: " + xBefore +
          "\nafter:  " + Array.from(result).map(v => v.toFixed(4)).join(", ");

        cleanup();
      })();
    </script>
  </body>
</html>
```

### `GpuVector` usage

`GpuVector` keeps data resident on the GPU between operations — upload once, chain any number of operations, read back once. This eliminates the redundant uploads and readbacks between steps, which are often more expensive than the compute itself.

```js
import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const alpha = 2;
const scale = 0.5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:      ", x);
console.log("y:      ", y);

// results stay in the GPU.
await saxpy(device, n, alpha, xGpu, 1, yGpu, 1); // y = 2x + y = [12, 24, 36, 48, 60]
await sscal(device, n, scale, yGpu, 1);          // y = 0.5y = [6, 12, 18, 24, 30]

// single readback
const result = await yGpu.read();
console.log("result: ", result); // [6, 12, 18, 24, 30]

xGpu.destroy();
yGpu.destroy();

cleanup();
```

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
