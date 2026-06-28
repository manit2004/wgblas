# wgblas
`wgblas` is an initiative to implement all the standard level 1, 2, 3 BLAS functions on the top of webgpu. 

## Available Functions
- [x] sscal
- [x] sswap
- [x] saxpy
- [x] scopy
- [x] sdot
- [x] sasum
- [x] snrm2
- [x] isamax
- [x] srot
- [x] srotm

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

await init();

const n = 10;
const alpha = 2.0;
const x = randomFloat32Array(n, -10, 10);

console.log("before:", x);
const result = await sscal(n, alpha, x, 1);
console.log("after: ", result);
cleanup();
```

### Benchmark Mode

Pass `{ benchmark: true }` to `init()` to enable GPU timestamp queries — BLAS functions will then return `{ result, gpuTimeMs }` instead of just the result.

**Note:** Here `gpuTimeMs` is only the gpu compute time which doesn't include device to host and host to device transfer time duration.

```js
await init({ benchmark: true });
// ...
const { result, gpuTimeMs } = await sscal(n, alpha, x, 1);
console.log(`compute time: ${gpuTimeMs.toFixed(4)} ms`);
```

### ```GpuVector``` usage 

`GpuVector` keeps data resident on the GPU between operations — upload once, chain any number of operations, read back once. This eliminates the redundant uploads and readbacks between steps, which are often more expensive than the compute itself.

```js
import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/util/random";

await init();

const n     = 10;
const alpha = 2;
const scale = 0.5;
const x     = randomFloat32Array(n, -10, 10);
const y     = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:      ", x);
console.log("y:      ", y);

// results stay in the GPU.
await saxpy(n, alpha, xGpu, 1, yGpu, 1);
await sscal(n, scale, yGpu, 1);

// single readback
const result = await yGpu.read();
console.log("result: ", result);

xGpu.destroy();
yGpu.destroy();

cleanup();

```