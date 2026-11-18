// tests/helpers/gpustorage.js
function padMatrix(A, outerCount, lda) {
  const padded = new A.constructor(outerCount * lda);
  padded.set(A);
  return padded;
}
function unpadMatrix(dense, original, rows, cols, lda, layout = "row-major") {
  const isRowMajor = layout !== "column-major";
  const outer = isRowMajor ? rows : cols;
  const inner = isRowMajor ? cols : rows;
  if (lda === inner) return dense;
  const out = original.constructor.from(original);
  for (let i = 0; i < outer; i++)
    out.set(dense.subarray(i * inner, i * inner + inner), i * lda);
  return out;
}
async function withGpuResources(factories, body) {
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

export { padMatrix, unpadMatrix, withGpuResources };
