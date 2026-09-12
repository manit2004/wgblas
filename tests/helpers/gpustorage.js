// Shared plumbing for GPU-resident (gpustorage.*.js) tests. Every routine's
// callGpuResident allocates GpuVector/GpuMatrix handles, runs the routine,
// reads results back, and must destroy() every handle even on failure — that
// part is identical across routines, so it lives here. Each routine still
// supplies its own call signature and return shape.

// Zero-pads A to outerCount*lda elements — GpuMatrix.from requires the full
// outerCount*lda buffer (outerCount is rows for row-major, cols for
// column-major), but the Float32Array API's A is only sized to the minimum
// (outerCount-1)*lda+innerCount, which is shorter whenever lda > innerCount.
// The padding is never read by any shader either way.
export function padMatrix(A, outerCount, lda) {
  const padded = new Float32Array(outerCount * lda);
  padded.set(A);
  return padded;
}

// Inverse of padMatrix: read() strips lda padding to dense rows*cols
// (row-major) or cols*rows (column-major), but the CPU reference keeps the
// original strided shape. `original` fills the untouched padding gaps.
export function unpadMatrix(
  dense,
  original,
  rows,
  cols,
  lda,
  layout = "row-major",
) {
  const isRowMajor = layout !== "column-major";
  const outer = isRowMajor ? rows : cols;
  const inner = isRowMajor ? cols : rows;
  if (lda === inner) return dense;
  const out = Float32Array.from(original);
  for (let i = 0; i < outer; i++)
    out.set(dense.subarray(i * inner, i * inner + inner), i * lda);
  return out;
}

// Runs body(resources) and destroys every resource afterward, success or
// failure. `factories` is a plain object of zero-arg functions, each
// returning one GpuVector/GpuMatrix handle (e.g. `{ x: () => GpuVector.from(a.x) }`)
// — not the handles themselves, which would all get constructed before this
// function even runs, leaking any handle built before a later one throws.
// Building them one at a time inside the try means the finally only ever
// needs to destroy what actually got created.
export async function withGpuResources(factories, body) {
  const resources = {};
  try {
    for (const [key, factory] of Object.entries(factories)) {
      resources[key] = factory();
    }
    return await body(resources);
  } finally {
    for (const r of Object.values(resources)) r.destroy();
  }
}
