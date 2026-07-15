# wgblas

`wgblas` is an initiative to implement all the standard level 1, 2, 3 BLAS functions on the top of webgpu.

## Available Functions

- [sscal](https://manit2004.github.io/wgblas/functions/docs.sscal.html)
- [sswap](https://manit2004.github.io/wgblas/functions/docs.sswap.html)
- [saxpy](https://manit2004.github.io/wgblas/functions/docs.saxpy.html)
- [scopy](https://manit2004.github.io/wgblas/functions/docs.scopy.html)
- [sdot](https://manit2004.github.io/wgblas/functions/docs.sdot.html)
- [sasum](https://manit2004.github.io/wgblas/functions/docs.sasum.html)
- [snrm2](https://manit2004.github.io/wgblas/functions/docs.snrm2.html)
- [isamax](https://manit2004.github.io/wgblas/functions/docs.isamax.html)
- [srot](https://manit2004.github.io/wgblas/functions/docs.srot.html)
- [srotm](https://manit2004.github.io/wgblas/functions/docs.srotm.html)
- [sgenmv](https://manit2004.github.io/wgblas/functions/docs.sgemv.html)

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

- Node.js 22+

## Installation

```sh
npm install wgblas
```

## Example usage

### Example Code Snippet

```js
import { init, cleanup, randomFloat32Array } from "wgblas";
import { sscal } from "wgblas/sscal";

const device = await init();

const n = 10;
const alpha = 2.0;
const x = randomFloat32Array(n, -10, 10);

console.log("before:", x);
const result = await sscal(device, n, alpha, x, 1);
console.log("after: ", result);
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
      const { init, sscal, randomFloat32Array, cleanup } = window.wgblas;

      (async () => {
        const device = await init();

        const n = 10;
        const alpha = 2.0;
        const x = randomFloat32Array(n, -10, 10);

        const xBefore = Array.from(x).map(v => v.toFixed(4)).join(", ");

        const result = await sscal(device, n, alpha, x, 1);

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
import { init, cleanup, randomFloat32Array } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

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
