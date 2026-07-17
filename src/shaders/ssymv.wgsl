// ssymv: y = alpha * A * x + beta * y
// A is n×n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
//
// Tiled: TILE=16 rows and cols per tile, WGS=256.
// Shared memory: smem_A (row contribs), smem_B (column contribs via transposed read).
// smem_B uses padded stride TPAD=17 so transposed reads avoid bank conflicts.
// Split loop: pure-lower tiles load smem_A only, diagonal tile loads both,
// pure-upper tiles load smem_B only. ~halves A reads vs monolithic tiling.
// Reduction: horizontal per-row, 4-level barrier tree within each row.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
}

@group(0) @binding(3) var<uniform> params: Params;

const TILE: u32 = 16u;
const WGS:  u32 = 256u;
const TPAD: u32 = 17u;

var<workgroup> smem_A:  array<f32, 256>;
var<workgroup> smem_B:  array<f32, 272>;
var<workgroup> smem_x:  array<f32, 16>;
var<workgroup> scratch: array<f32, 256>;

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  let lr = lid.x >> 4u;   // row within tile  [0, TILE)
  let lc = lid.x & 15u;   // col within tile  [0, TILE)

  for (var r0 = wgid.x * TILE; r0 < params.n; r0 += nwg.x * TILE) {
    let global_row = r0 + lr;
    var acc = 0.0f;

    let c0_diag = r0;

    if params.uplo == 0u {
      // ── lower stored ─────────────────────────────────────────────────────

      // Pure lower tiles: c0 ∈ [0, c0_diag).
      for (var c0 = 0u; c0 < c0_diag; c0 += TILE) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               global_row < params.n);
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Diagonal tile: c0 = c0_diag.
      {
        let col   = c0_diag + lc;
        let B_row = c0_diag + lr;
        let B_col = r0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        smem_B[lr * TPAD + lc] = select(0.0f, A[B_row * params.lda + B_col],
                                        (B_row < params.n) & (B_col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          if col <= global_row {
            acc += smem_A[lid.x] * smem_x[lc];
          } else {
            acc += smem_B[lc * TPAD + lr] * smem_x[lc];
          }
        }
        workgroupBarrier();
      }

      // Pure upper tiles: c0 ∈ [c0_diag+TILE, n).
      for (var c0 = c0_diag + TILE; c0 < params.n; c0 += TILE) {
        let col = c0 + lc;
        smem_B[lr * TPAD + lc] = select(0.0f, A[(c0 + lr) * params.lda + r0 + lc],
                                        ((c0 + lr) < params.n) & ((r0 + lc) < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          acc += smem_B[lc * TPAD + lr] * smem_x[lc];
        }
        workgroupBarrier();
      }

    } else {
      // ── upper stored ─────────────────────────────────────────────────────

      // Pure lower tiles.
      for (var c0 = 0u; c0 < c0_diag; c0 += TILE) {
        let col = c0 + lc;
        smem_B[lr * TPAD + lc] = select(0.0f, A[(c0 + lr) * params.lda + r0 + lc],
                                        ((c0 + lr) < params.n) & ((r0 + lc) < params.n));
        if lr == 0u { smem_x[lc] = x[col * params.incx]; }
        workgroupBarrier();
        if global_row < params.n { acc += smem_B[lc * TPAD + lr] * smem_x[lc]; }
        workgroupBarrier();
      }

      // Diagonal tile.
      {
        let col   = c0_diag + lc;
        let B_row = c0_diag + lr;
        let B_col = r0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        smem_B[lr * TPAD + lc] = select(0.0f, A[B_row * params.lda + B_col],
                                        (B_row < params.n) & (B_col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) {
          if col >= global_row {
            acc += smem_A[lid.x] * smem_x[lc];
          } else {
            acc += smem_B[lc * TPAD + lr] * smem_x[lc];
          }
        }
        workgroupBarrier();
      }

      // Pure upper tiles.
      for (var c0 = c0_diag + TILE; c0 < params.n; c0 += TILE) {
        let col = c0 + lc;
        smem_A[lid.x] = select(0.0f, A[global_row * params.lda + col],
                               (global_row < params.n) & (col < params.n));
        if lr == 0u { smem_x[lc] = select(0.0f, x[col * params.incx], col < params.n); }
        workgroupBarrier();
        if (global_row < params.n) & (col < params.n) { acc += smem_A[lid.x] * smem_x[lc]; }
        workgroupBarrier();
      }
    }

    // ── horizontal reduction within each row ─────────────────────────────────────
    // Each row has 16 threads (lc in [0, 16)), sum horizontally to thread lc=0.
    scratch[lid.x] = acc;
    workgroupBarrier();

    // Level 1: threads (lr, 0-7) += (lr, 8-15)
    if lc < 8u { scratch[lid.x] += scratch[lr * 16u + (lc + 8u)]; }
    workgroupBarrier();

    // Level 2: threads (lr, 0-3) += (lr, 4-7)
    if lc < 4u { scratch[lid.x] += scratch[lr * 16u + (lc + 4u)]; }
    workgroupBarrier();

    // Level 3: threads (lr, 0-1) += (lr, 2-3)
    if lc < 2u { scratch[lid.x] += scratch[lr * 16u + (lc + 2u)]; }
    workgroupBarrier();

    // Level 4: thread (lr, 0) += (lr, 1)
    if lc < 1u { scratch[lid.x] += scratch[lr * 16u + 1u]; }
    workgroupBarrier();

    // Write result: thread (lr, 0) for each row writes y[r0+lr].
    if (lc == 0u) & (global_row < params.n) {
      let yi = global_row * params.incy;
      let A_contrib = select(0.0f, params.alpha * scratch[lid.x], params.alpha != 0.0f);
      let B_contrib = select(0.0f, params.beta * y[yi], params.beta != 0.0f);
      y[yi] = A_contrib + B_contrib;
    }
  }
}
