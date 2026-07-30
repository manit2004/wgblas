// Shared plumbing for GPU-resident (gpustorage.*.js) tests. Every routine's
// callGpuResident allocates GpuVector/GpuMatrix handles, runs the routine,
// reads results back, and must destroy() every handle even on failure — that
// part is identical across routines, so it lives here. Each routine still
// supplies its own call signature and return shape.

// Zero-pads A to rows*lda elements — GpuMatrix.from requires the full
// rows*lda buffer, but the Float32Array API's A is only sized to the minimum
// (rows-1)*lda+cols, which is shorter whenever lda > cols. The padding is
// never read by any shader either way.
export function padMatrix(A, rows, lda) {
  const padded = new Float32Array(rows * lda);
  padded.set(A);
  return padded;
}

// Inverse of padMatrix: read() strips lda padding to dense rows*cols, but
// the CPU reference keeps the original strided shape. `original` fills the
// untouched padding gaps.
export function unpadMatrix(dense, original, rows, cols, lda) {
  if (lda === cols) return dense;
  const out = Float32Array.from(original);
  for (let r = 0; r < rows; r++)
    out.set(dense.subarray(r * cols, r * cols + cols), r * lda);
  return out;
}

// Runs body(resources) and destroys every resource afterward, success or
// failure. `resources` is a plain object of GpuVector/GpuMatrix handles.
export async function withGpuResources(resources, body) {
  try {
    return await body(resources);
  } finally {
    for (const r of Object.values(resources)) r.destroy();
  }
}
