import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
  vec4ViewBinding,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { BM_SMALL, BN_SMALL, BM_LARGE, BN_LARGE, LARGE_TILE_WORKGROUP_THRESHOLD } from "../util/constants.mjs";
import { TILE_WG_2D } from "../util/constants.mjs";


// ssymm: C := alpha*A*B + beta*C (side='left') or alpha*B*A + beta*C
// (side='right'), A symmetric. No fused kernel — symmetrize then sgemm,
// both on one command encoder. See symmetrize.wgsl.
export async function ssymm(
  device, side, uplo, m, n, alpha, A, lda, B, ldb, beta, C, ldc, layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number")
    throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) || !Number.isInteger(n) ||
    !Number.isInteger(lda) || !Number.isInteger(ldb) || !Number.isInteger(ldc)
  )
    throw new Error("m, n, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float32Array))
    throw new Error("B must be a Float32Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float32Array))
    throw new Error("C must be a Float32Array or GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };

  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;

  // A: symmetric, order = m (side='left') or n (side='right').
  const aOrder = side === "left" ? m : n;
  if (lda < aOrder) throw new Error("lda must be >= " + (side === "left" ? "m" : "n") + ".");
  if (AIsGpu) {
    if (lda !== A.lda) throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (A.rows < aOrder || A.cols < aOrder) throw new Error("A is too small for the given m/n and side.");
  } else if (A.length < (aOrder - 1) * lda + aOrder) {
    throw new Error("A does not have enough elements for the given dimensions and lda.");
  }

  // B: always m x n, no trans flag — same shape rule as sgemm's C.
  const bOuter = effLayoutB === "column-major" ? n : m;
  const bInner = effLayoutB === "column-major" ? m : n;
  if (ldb < bInner)
    throw new Error(`ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`);
  if (BIsGpu) {
    if (ldb !== B.lda) throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    if (B.rows < m || B.cols < n) throw new Error("B is too small for the given m and n.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error("B does not have enough elements for the given dimensions and ldb.");
  }

  // C: always m x n.
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(`ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`);
  if (CIsGpu) {
    if (ldc !== C.lda) throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n) throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error("C does not have enough elements for the given dimensions and ldc.");
  }

  // A = A^T, so column-major storage is still A, but the populated
  // triangle swaps — uplo flips (same reasoning ssyr/ssyrk use).
  const uploEffA = effLayoutA === "column-major" ? (uplo === "lower" ? "upper" : "lower") : uplo;

  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose"; // Adense is always row-major

  // X*Y (X=Adense,Y=B for side='left', swapped for 'right'). Column-major
  // C: compute C^T instead (swap X/Y, flip trans, swap m_g/n_g) — sgemm's own trick.
  let mg = m, ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right"; // which JS buffer plays "X" vs "Y" below
  if (effLayoutC === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }

  const ldDense = aOrder; // Adense is tightly packed, row-major
  const largeWgX = Math.ceil(ng / BN_LARGE);
  const largeWgY = Math.ceil(mg / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const gemmPipeline = await getPipeline(device, useLargeTile ? "sgemm_large" : "sgemm_small");
  const symPipeline = await getPipeline(device, "symmetrize");
  const gemmWgCount = useLargeTile
    ? {
      x: requireWorkgroupCount(largeWgX, "ssymm", "x"),
      y: requireWorkgroupCount(largeWgY, "ssymm", "y"),
    }
    : {
      x: requireWorkgroupCount(Math.ceil(ng / BN_SMALL), "ssymm", "x"),
      y: requireWorkgroupCount(Math.ceil(mg / BM_SMALL), "ssymm", "y"),
    };

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "ssymm-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(B, "ssymm-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(C, "ssymm-C", true);
  const AdenseBuffer = createStorageBuffer(aOrder * ldDense * 4, "ssymm-Adense");
  let symParams = null, gemmParams = null;

  try {
    symParams = createParamsBuffer(
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
      ],
      "ssymm-sym-params",
    );
    const symBindGroup = createBindGroup(symPipeline.getBindGroupLayout(0), [ABuffer, AdenseBuffer, symParams]);

    // X/Y buffers and their own ld, matching swapXY above.
    const XBuffer = swapXY ? BBuffer : AdenseBuffer;
    const ldX = swapXY ? ldb : ldDense;
    const YBuffer = swapXY ? AdenseBuffer : BBuffer;
    const ldY = swapXY ? ldDense : ldb;

    gemmParams = createParamsBuffer(
      [
        { value: mg,  type: "u32" },
        { value: ng,  type: "u32" },
        { value: kg,  type: "u32" },
        { value: alpha, type: "f32" },
        { value: beta,  type: "f32" },
        { value: ldX, type: "u32" },
        { value: ldY, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
      ],
      "ssymm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(gemmPipeline.getBindGroupLayout(0), [
      XBuffer,
      vec4ViewBinding(XBuffer),
      YBuffer,
      vec4ViewBinding(YBuffer),
      CBuffer,
      gemmParams,
    ]);

    const { commandEncoder, querySet } = beginTimedEncoder();
    const symDesc = querySet ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } } : undefined;
    const gemmDesc = querySet ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } } : undefined;
    encodePass(commandEncoder, symPipeline, symBindGroup, { x: Math.ceil(aOrder / TILE_WG_2D), y: Math.ceil(aOrder / TILE_WG_2D) }, symDesc);
    encodePass(commandEncoder, gemmPipeline, gemmBindGroup, gemmWgCount, gemmDesc);

    const ts = resolveTimestamp(commandEncoder, querySet);
    const readBuffer = CIsGpu ? null : stageReadback(commandEncoder, CBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (CIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(AdenseBuffer);
    if (symParams) destroyBuffers(symParams);
    if (gemmParams) destroyBuffers(gemmParams);
  }
}
