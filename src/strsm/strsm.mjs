import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
  vec4ViewBinding,
  vec4Usable,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import {
  requireWorkgroupCount,
  requireWorkgroups,
} from "../util/workgroup.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import {
  BM_SMALL,
  BN_SMALL,
  BM_LARGE,
  BN_LARGE,
  LARGE_TILE_WORKGROUP_THRESHOLD,
} from "../util/constants.mjs";
import { BLOCK_SIZE, STRSM_SMALL_RHS_PER_WG } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// A strided 2-D view of a buffer: element (r, c) lives at off + r*rs + c*cs,
// with rs or cs equal to 1 (row- or column-addressed). strsm's gemms read
// and write B and A in place through these instead of gathering every block
// into packed scratch and scattering it back.
const view = (buffer, off, rs, cs) => ({ buffer, off, rs, cs });
const transposed = (v) => ({ ...v, rs: v.cs, cs: v.rs });
const at = (v, r, c) => ({ ...v, off: v.off + r * v.rs + c * v.cs });

function dispatch(pass, wg) {
  if (typeof wg === "number") pass.dispatchWorkgroups(wg);
  else pass.dispatchWorkgroups(wg.x, wg.y, wg.z ?? 1);
}

// Above this many blocks, inverting every diagonal block up front (one
// parallel dispatch) and applying the inverses beats solving each block by
// substitution on the critical path — measured crossover on a GTX 1650 sits
// between 8 blocks (n=512, substitution ahead) and 16 (n=1024, ~8% behind).
const SUBSTITUTION_MAX_BLOCKS = 8;

// Encodes C := alpha*X*Y + beta*C (X mg×kg, Y kg×ng, C mg×ng views) as one
// sgemm dispatch on `pass`. sgemm writes C row-addressed, so a column-
// addressed C runs as C^T = Y^T * X^T instead — sgemm's own layout trick.
function encodeGemm(
  device,
  pass,
  pipelines,
  params,
  X,
  Y,
  C,
  mg,
  ng,
  kg,
  alpha,
  beta,
) {
  if (C.cs !== 1) {
    [X, Y, C] = [transposed(Y), transposed(X), transposed(C)];
    [mg, ng] = [ng, mg];
  }
  const xNot = X.cs === 1;
  const yNot = Y.cs === 1;
  const ldX = xNot ? X.rs : X.cs;
  const ldY = yNot ? Y.rs : Y.cs;
  // Same vec4 rules as sgemm.mjs, plus the view's own offset alignment.
  const useVecA = vec4Usable(
    X.buffer,
    ldX,
    xNot ? mg : kg,
    xNot ? kg : mg,
    X.off,
  );
  const useVecB = vec4Usable(
    Y.buffer,
    ldY,
    yNot ? kg : ng,
    yNot ? ng : kg,
    Y.off,
  );
  const largeWgX = Math.ceil(ng / BN_LARGE);
  const largeWgY = Math.ceil(mg / BM_LARGE);
  const useLarge = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = useLarge ? pipelines.large : pipelines.small;
  const gemmParams = params(
    [
      { value: mg, type: "u32" },
      { value: ng, type: "u32" },
      { value: kg, type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta, type: "f32" },
      { value: ldX, type: "u32" },
      { value: ldY, type: "u32" },
      { value: C.rs, type: "u32" }, // ldc
      { value: xNot ? 0 : 1, type: "u32" },
      { value: yNot ? 0 : 1, type: "u32" },
      { value: useVecA ? 1 : 0, type: "u32" },
      { value: useVecB ? 1 : 0, type: "u32" },
      { value: 0, type: "u32" }, // uplo: full C
      { value: X.off, type: "u32" },
      { value: Y.off, type: "u32" },
      { value: C.off, type: "u32" },
      { value: 0, type: "u32" }, // kTri: dense operands
    ],
    "strsm-gemm-params",
  );
  pass.setPipeline(pipeline);
  pass.setBindGroup(
    0,
    createBindGroup(device, pipeline.getBindGroupLayout(0), [
      X.buffer,
      vec4ViewBinding(device, X.buffer),
      Y.buffer,
      vec4ViewBinding(device, Y.buffer),
      C.buffer,
      gemmParams,
    ]),
  );
  pass.dispatchWorkgroups(
    requireWorkgroupCount(
      device,
      useLarge ? largeWgX : Math.ceil(ng / BN_SMALL),
      "strsm",
      "x",
    ),
    requireWorkgroupCount(
      device,
      useLarge ? largeWgY : Math.ceil(mg / BM_SMALL),
      "strsm",
      "y",
    ),
  );
}

// strsm: B := alpha*op(A)^-1*B (side='left') or alpha*B*op(A)^-1 (side='right'),
// A triangular. Blocked over 64-row diagonal blocks, one compute pass. Up to
// SUBSTITUTION_MAX_BLOCKS blocks: strsm_small solves each block in place on
// B, then a gemm does the trailing update (two dispatches per block). More:
// strsv_invert_block inverts every block up front, then apply gemm, scatter
// (block_transfer.wgsl) and update gemm per block. The gemms address B and A
// in place through element offsets.
export async function strsm(
  device,
  side,
  uplo,
  transA,
  diag,
  m,
  n,
  alpha,
  A,
  lda,
  B,
  ldb,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const isUnit = diag === "unit";

  requireGpuDevice(device);
  requireSameDevice(device, "strsm", { A, B });
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb)
  )
    throw new Error("m, n, lda, and ldb must be integers.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float32Array))
    throw new Error("B must be a Float32Array or GpuMatrix.");
  if (AIsGpu !== BIsGpu)
    throw new Error("A and B must both be GpuMatrix or both be Float32Array.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return BIsGpu ? {} : { B };

  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;

  // A: triangular, order = m (side='left') or n (side='right').
  const aOrder = side === "left" ? m : n;
  if (lda < aOrder)
    throw new Error("lda must be >= " + (side === "left" ? "m" : "n") + ".");
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (A.rows < aOrder || A.cols < aOrder)
      throw new Error("A is too small for the given m/n and side.");
  } else if (A.length < (aOrder - 1) * lda + aOrder) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }

  // B: always m x n, overwritten in place with the same ldb.
  const bOuter = effLayoutB === "column-major" ? n : m;
  const bInner = effLayoutB === "column-major" ? m : n;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    if (B.rows < m || B.cols < n)
      throw new Error("B is too small for the given m and n.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }

  // A isn't symmetric: column-major = genuine transpose, so flip transA;
  // transposing also swaps which triangle looks stored, so flip uplo too.
  const uploEffA =
    effLayoutA === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;
  const transEffA =
    effLayoutA === "column-major"
      ? transA === "no-transpose"
        ? "transpose"
        : "no-transpose"
      : transA;

  const otherLen = side === "left" ? n : m;
  const blockIsRow = side === "left";

  // Forward iff op(A) is lower (side='left') — side='right' flips this,
  // since it solves via columns instead of rows.
  const opIsLower = (transEffA === "no-transpose") === (uploEffA === "lower");
  const forward = side === "left" ? opIsLower : !opIsLower;

  const blockStarts = [];
  for (let s = 0; s < aOrder; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const smallPipeline = await getPipeline(device, "strsm_small");
  const useInverse = numBlocks > SUBSTITUTION_MAX_BLOCKS;
  const invertPipeline = useInverse
    ? await getPipeline(device, "strsv_invert_block")
    : null;
  const transferPipeline = useInverse
    ? await getPipeline(device, "block_transfer")
    : null;
  const smallGroups = requireWorkgroupCount(
    device,
    Math.ceil(otherLen / STRSM_SMALL_RHS_PER_WG),
    "strsm",
  );
  const gemmPipelines = {
    small: await getPipeline(device, "sgemm_small"),
    large: await getPipeline(device, "sgemm_large"),
  };

  // Null-init here and allocate inside the try below, so a throw partway
  // through the sequence still reaches finally with every handle visible
  // (strsv.mjs is the reference for this pattern).
  let ABuffer = null;
  let BBuffer = null;
  let AinvBuffer = null;
  let Xblock = null;

  const paramsBuffers = [];
  function params(entries, label) {
    const buf = createParamsBuffer(device, entries, label);
    paramsBuffers.push(buf);
    return buf;
  }

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "strsm-A", false);
    BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "strsm-B", true);
    if (useInverse)
      AinvBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "strsm-Ainv",
      );
    // The block just solved, packed, for the trailing update (which can't
    // bind B read-only while it writes B). Unused for one block.
    Xblock = createStorageBuffer(
      device,
      (numBlocks > 1 ? BLOCK_SIZE * otherLen : 4) * 4,
      "strsm-Xblock",
    );

    // Views in the solve frame: Bt(b, o) is B with the blocked axis first
    // (B itself for side='left', B^T for 'right'), and Lt(i, j) the op(A)
    // entry coupling unknown j into equation i there (op(A)^T for 'right',
    // since X*op(A) = B is op(A)^T * X^T = B^T).
    const Bv =
      effLayoutB === "column-major"
        ? view(BBuffer, 0, 1, ldb)
        : view(BBuffer, 0, ldb, 1);
    const Bt = side === "left" ? Bv : transposed(Bv);
    const opA =
      transEffA === "transpose"
        ? view(ABuffer, 0, 1, lda)
        : view(ABuffer, 0, lda, 1);
    const Lt = side === "left" ? opA : transposed(opA);
    const Xt = view(Xblock, 0, otherLen, 1);

    // Every dispatch goes in ONE compute pass, as in strsv: each dispatch is
    // still its own synchronization scope (WebGPU orders them and makes each
    // one's storage writes visible to the next), but a pass per dispatch
    // added a fixed cost that dominated the long chain of small steps.
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);
    const gemm = (X, Y, C, mg, ng, kg, alphaG, betaG) =>
      encodeGemm(
        device,
        pass,
        gemmPipelines,
        params,
        X,
        Y,
        C,
        mg,
        ng,
        kg,
        alphaG,
        betaG,
      );

    // Substitution solve of one diagonal block, in place on B through views
    // (see strsm_small.wgsl); xLd > 0 also leaves a packed copy in Xblock.
    const solve = (Av, Bv2, order, alphaS, xLd) => {
      const solveParams = params(
        [
          { value: order, type: "u32" },
          { value: otherLen, type: "u32" }, // nrhs
          { value: Av.off, type: "u32" },
          { value: Av.rs, type: "u32" },
          { value: Av.cs, type: "u32" },
          { value: Bv2.off, type: "u32" },
          { value: Bv2.rs, type: "u32" },
          { value: Bv2.cs, type: "u32" },
          { value: forward ? 0 : 1, type: "u32" }, // backward
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: alphaS, type: "f32" }, // applied as B is read in
          { value: xLd, type: "u32" },
        ],
        "strsm-solve-params",
      );
      pass.setPipeline(smallPipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
          ABuffer,
          BBuffer,
          solveParams,
          Xblock,
        ]),
      );
      pass.dispatchWorkgroups(smallGroups);
    };

    if (alpha === 0) {
      // BLAS: alpha=0 means B must become a literal zero, not 0*B (which
      // leaks NaN/Inf). sgemm with k=0 (X/Y never read, so Xblock is a safe
      // dummy for both) and beta=0 writes it without reading B.
      const dummy = view(Xblock, 0, 1, 1);
      gemm(dummy, dummy, view(BBuffer, 0, ldb, 1), bOuter, bInner, 0, 0, 0);
    } else if (numBlocks === 1) {
      // One block: the whole solve is a single dispatch, alpha on read-in.
      solve(Lt, Bt, aOrder, alpha, 0);
    } else {
      // Pre-scale B by alpha once (no per-block alpha handling), as sgemm
      // with k=0 and beta=alpha: C := 0 + alpha*C over just the m×n matrix,
      // leaving stride padding alone (a flat sscal over B scaled it too).
      // alpha=0 never gets here — see the literal zero-write above.
      if (alpha !== 1.0) {
        const dummy = view(Xblock, 0, 1, 1);
        gemm(
          dummy,
          dummy,
          view(BBuffer, 0, ldb, 1),
          bOuter,
          bInner,
          0,
          0,
          alpha,
        );
      }

      if (!useInverse) {
        for (const blockStart of blockStarts) {
          const blockEnd = Math.min(blockStart + BLOCK_SIZE, aOrder);
          const blockLen = blockEnd - blockStart;

          // 1) solve the diagonal block in place (B already holds alpha*B
          // minus every earlier block's contribution), packed copy to Xblock.
          solve(
            at(Lt, blockStart, blockStart),
            at(Bt, blockStart, 0),
            blockLen,
            1,
            otherLen,
          );

          // 2) trailing update, in place: Bt[rest] -= Lt[rest, block] * Xt.
          const rangeStart = forward ? blockEnd : 0;
          const rangeEnd = forward ? aOrder : blockStart;
          if (rangeStart >= rangeEnd) continue;
          gemm(
            at(Lt, rangeStart, blockStart),
            Xt,
            at(Bt, rangeStart, 0),
            rangeEnd - rangeStart,
            otherLen,
            blockLen,
            -1,
            1,
          );
        }
      } else {
        // Every diagonal block's inverse, fully parallel, one workgroup per block.
        const invertParams = params(
          [
            { value: aOrder, type: "u32" },
            { value: lda, type: "u32" },
            { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
            { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
            { value: isUnit ? 1 : 0, type: "u32" },
          ],
          "strsm-invert-params",
        );
        pass.setPipeline(invertPipeline);
        pass.setBindGroup(
          0,
          createBindGroup(device, invertPipeline.getBindGroupLayout(0), [
            ABuffer,
            AinvBuffer,
            invertParams,
          ]),
        );
        pass.dispatchWorkgroups(numBlocks);

        for (const blockStart of blockStarts) {
          const blockEnd = Math.min(blockStart + BLOCK_SIZE, aOrder);
          const blockLen = blockEnd - blockStart;
          const blockIndex = blockStart / BLOCK_SIZE;

          // 1) apply: Xt := Lt_block^-1 * Bt[block], read straight out of B.
          // Lt's diagonal block inverts to Ainv's block (side='left') or its
          // transpose (side='right'); Ainv blocks are stored column-major.
          const ainvOff = blockIndex * BLOCK_SIZE * BLOCK_SIZE;
          const Minv =
            side === "left"
              ? view(AinvBuffer, ainvOff, 1, BLOCK_SIZE)
              : view(AinvBuffer, ainvOff, BLOCK_SIZE, 1);
          gemm(
            Minv,
            at(Bt, blockStart, 0),
            Xt,
            blockLen,
            otherLen,
            blockLen,
            1,
            0,
          );

          // 2) scatter the solved block back into B.
          const scatterParams = params(
            [
              { value: blockStart, type: "u32" },
              { value: blockLen, type: "u32" },
              { value: 0, type: "u32" },
              { value: otherLen, type: "u32" },
              { value: ldb, type: "u32" },
              { value: effLayoutB === "column-major" ? 1 : 0, type: "u32" },
              { value: blockIsRow ? 1 : 0, type: "u32" },
              { value: 0, type: "u32" }, // overwrite
            ],
            "strsm-scatter-params",
          );
          pass.setPipeline(transferPipeline);
          pass.setBindGroup(
            0,
            createBindGroup(device, transferPipeline.getBindGroupLayout(0), [
              Xblock,
              BBuffer,
              scatterParams,
            ]),
          );
          dispatch(
            pass,
            requireWorkgroups(device, "strsm", blockLen, otherLen),
          );

          // 3) trailing update, in place: Bt[rest] -= Lt[rest, block] * Xt.
          const rangeStart = forward ? blockEnd : 0;
          const rangeEnd = forward ? aOrder : blockStart;
          if (rangeStart >= rangeEnd) continue;
          gemm(
            at(Lt, rangeStart, blockStart),
            Xt,
            at(Bt, rangeStart, 0),
            rangeEnd - rangeStart,
            otherLen,
            blockLen,
            -1,
            1,
          );
        }
      }
    }
    pass.end();
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = BIsGpu
      ? null
      : stageReadback(device, commandEncoder, BBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (BIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!BIsGpu && BBuffer) destroyBuffers(BBuffer);
    if (Xblock) destroyBuffers(Xblock);
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    destroyBuffers(paramsBuffers);
  }
}
