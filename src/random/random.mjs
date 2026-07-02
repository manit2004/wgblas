export function randomFloat32Array(n, low = -1, high = 1) {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = low + Math.random() * (high - low);
  return x;
}

export function randomFloat64Array(n, low = -1, high = 1) {
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = low + Math.random() * (high - low);
  return x;
}
