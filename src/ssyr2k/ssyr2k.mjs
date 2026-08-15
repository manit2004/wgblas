import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

const BM_SMALL = 32, BN_SMALL = 32; // sgemmtr_small.wgsl's block tile
const BM_LARGE = 64, BN_LARGE = 64; // sgemmtr_large.wgsl's block tile
const LARGE_TILE_WORKGROUP_THRESHOLD = 36; // same threshold sgemm/sgemmtr/ssyrk use

// ssyr2k: C := uplo(alpha*op(A)*op(B)^T + alpha*op(B)*op(A)^T + beta*C). No
// dedicated shader — two sgemmtr passes on one encoder, second with beta=1.
export async function ssyr2k(
  device, uplo, trans, n, k, alpha, A, lda, B, ldb, beta, C, ldc, layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
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
    !Number.isInteger(n) || !Number.isInteger(k) ||
    !Number.isInteger(lda) || !Number.isInteger(ldb) || !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, ldb, and ldc must be integers.");
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
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (n === 0) return CIsGpu ? {} : { C };

  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;

  // A: op(A) is n x k; A itself is n x k or k x n depending on trans.
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(`lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`);
  if (AIsGpu) {
    if (lda !== A.lda) throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error("A does not have enough elements for the given dimensions and lda.");
  }

  // B: same shape rule as A — netlib's syr2k shares one trans across both operands.
  const bRows = effLayoutB === "column-major" ? k : n;
  const bCols = effLayoutB === "column-major" ? n : k;
  const bOuter = trans === "no-transpose" ? bRows : bCols;
  const bInner = trans === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(`ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`);
  if (BIsGpu) {
    if (ldb !== B.lda) throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and trans.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error("B does not have enough elements for the given dimensions and ldb.");
  }

  // C: always n x n symmetric — layout only affects storage order, not size.
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda) throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n) throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error("C does not have enough elements for the given dimensions and ldc.");
  }

  // Column-major A/B reinterpreted row-major is A^T/B^T — flip trans per operand.
  let effTransA = trans;
  if (effLayoutA === "column-major")
    effTransA = effTransA === "no-transpose" ? "transpose" : "no-transpose";
  let effTransB = trans;
  if (effLayoutB === "column-major")
    effTransB = effTransB === "no-transpose" ? "transpose" : "no-transpose";

  const uploEff = effLayoutC === "column-major"
    ? (uplo === "lower" ? "upper" : "lower")
    : uplo;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");

  // One pass: op(X) as-is, op(Y) transposed. transOwnY is explicit, not inferred.
  function passShape(transOwnX, X, ldX, transOwnY, Y, ldY) {
    const transX = transOwnX;
    const transY = flip(transOwnY);
    if (effLayoutC !== "column-major") return { transX, X, ldX, transY, Y, ldY };
    return { transX: flip(transY), X: Y, ldX: ldY, transY: flip(transX), Y: X, ldY: ldX };
  }

  // Shape-based auto-select — see sgemmtr_small.wgsl/sgemmtr_large.wgsl. m=n=n here (square C).
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(n / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = await getPipeline(device, useLargeTile ? "sgemmtr_large" : "sgemmtr_small");
  const wgCount = useLargeTile
    ? {
      x: Math.min(largeWgX, device.limits.maxComputeWorkgroupsPerDimension),
      y: Math.min(largeWgY, device.limits.maxComputeWorkgroupsPerDimension),
    }
    : {
      x: Math.min(Math.ceil(n / BN_SMALL), device.limits.maxComputeWorkgroupsPerDimension),
      y: Math.min(Math.ceil(n / BM_SMALL), device.limits.maxComputeWorkgroupsPerDimension),
    };

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "ssyr2k-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(B, "ssyr2k-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(C, "ssyr2k-C", true);
  let paramsBuffer1 = null, paramsBuffer2 = null;

  try {
    const pass1 = passShape(effTransA, ABuffer, lda, effTransB, BBuffer, ldb);
    const pass2 = passShape(effTransB, BBuffer, ldb, effTransA, ABuffer, lda);

    const makeParams = (p, betaVal) => createParamsBuffer(
      [
        { value: n,   type: "u32" },
        { value: n,   type: "u32" },
        { value: k,   type: "u32" },
        { value: alpha, type: "f32" },
        { value: betaVal, type: "f32" },
        { value: p.ldX, type: "u32" },
        { value: p.ldY, type: "u32" },
        { value: ldc, type: "u32" },
        { value: p.transX === "transpose" ? 1 : 0, type: "u32" },
        { value: p.transY === "transpose" ? 1 : 0, type: "u32" },
        { value: uploEff === "upper" ? 1 : 0, type: "u32" },
      ],
      "ssyr2k-params",
    );
    paramsBuffer1 = makeParams(pass1, beta);
    paramsBuffer2 = makeParams(pass2, 1.0);

    const bindGroup1 = createBindGroup(pipeline.getBindGroupLayout(0), [pass1.X, pass1.Y, CBuffer, paramsBuffer1]);
    const bindGroup2 = createBindGroup(pipeline.getBindGroupLayout(0), [pass2.X, pass2.Y, CBuffer, paramsBuffer2]);

    const { commandEncoder, querySet } = beginTimedEncoder();
    const desc1 = querySet ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } } : undefined;
    const desc2 = querySet ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } } : undefined;
    encodePass(commandEncoder, pipeline, bindGroup1, wgCount, desc1);
    encodePass(commandEncoder, pipeline, bindGroup2, wgCount, desc2);

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
    if (paramsBuffer1) destroyBuffers(paramsBuffer1);
    if (paramsBuffer2) destroyBuffers(paramsBuffer2);
  }
}
