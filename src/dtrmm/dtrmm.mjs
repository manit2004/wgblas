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
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { splitDoubleDouble, mergeDoubleDoubleExact } from "../util/f64.mjs";
import { BM_SMALL, BN_SMALL, TILE_WG_2D } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dtrmm: B := alpha*op(A)*B (side='left') or alpha*B*op(A) (side='right'), A
// triangular — double-double f64 emulation of strmm. No dedicated shader:
// triangularize.wgsl expands op(A) into a dense copy (run once on the Hi half
// and once on the Lo half — it only moves values, so the copy is exact; a unit
// diagonal is 1.0 on Hi and 0.0 on Lo), then dgemm_small, all on one encoder.
// B is both input and output, so gemm writes to fresh Hi/Lo buffers (no
// aliasing race), adopted by B (GpuMatrix) or read back (Float64Array).
export async function dtrmm(
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
  requireSameDevice(device, "dtrmm", { A, B });
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
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (AIsGpu !== BIsGpu)
    throw new Error("A and B must both be GpuMatrix or both be Float64Array.");
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

  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose"; // Adense already embodies op(A)

  // X*Y (X=Adense,Y=B for side='left', swapped for 'right'). Column-major
  // output: compute (B_out)^T instead — dgemm's own trick, same as dsymm's.
  let mg = m,
    ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right";
  if (effLayoutB === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }

  // Always dgemm_small — dgemm_large measured ~2x slower (see dgemm.mjs).
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const gemmPipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  const triPipeline = await getPipeline(device, "triangularize");
  const gemmWgCount = {
    x: requireWorkgroupCount(device, Math.ceil(ng / BN_SMALL), "dtrmm", "x"),
    y: requireWorkgroupCount(device, Math.ceil(mg / BM_SMALL), "dtrmm", "y"),
  };
  const triWgCount = {
    x: Math.ceil(aOrder / TILE_WG_2D),
    y: Math.ceil(aOrder / TILE_WG_2D),
  };

  // Null-init here and allocate inside the try below, so a throw partway
  // through the sequence still reaches finally with every handle visible.
  const ldDense = aOrder; // Adense is tightly packed, row-major
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let AdenseHiBuffer = null;
  let AdenseLoBuffer = null;
  let outHiBuffer = null;
  let outLoBuffer = null;
  let triHiParams = null;
  let triLoParams = null;
  let gemmParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  let outAdopted = false; // true once B._buf/_loBuf point at outHi/outLo

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrmm-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrmm-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      // readback=true (COPY_SRC): B's halves also seed outHi/outLo below.
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dtrmm-BHi", true);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dtrmm-BLo", true);
    }
    AdenseHiBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dtrmm-AdenseHi",
    );
    AdenseLoBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dtrmm-AdenseLo",
    );
    // Sized to B's own storage (not bOuter*ldb), so the result keeps B's exact
    // length. COPY_DST: seeded from B; COPY_SRC: read back / adopted by B.
    const outUsage = GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
    outHiBuffer = createStorageBuffer(
      device,
      BHiBuffer.size,
      "dtrmm-outHi",
      outUsage,
    );
    outLoBuffer = createStorageBuffer(
      device,
      BLoBuffer.size,
      "dtrmm-outLo",
      outUsage,
    );

    // Unit diagonal 1.0 splits as (1.0, 0.0): Hi substitutes 1.0 (diag=1),
    // Lo substitutes 0.0 (diag=2).
    const triFields = (diagMode) => [
      { value: aOrder, type: "u32" },
      { value: lda, type: "u32" },
      { value: ldDense, type: "u32" },
      { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
      { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
      { value: diagMode, type: "u32" },
    ];
    triHiParams = createParamsBuffer(
      device,
      triFields(isUnit ? 1 : 0),
      "dtrmm-tri-hi-params",
    );
    triLoParams = createParamsBuffer(
      device,
      triFields(isUnit ? 2 : 0),
      "dtrmm-tri-lo-params",
    );
    const triLayout = triPipeline.getBindGroupLayout(0);
    const triHiBindGroup = createBindGroup(device, triLayout, [
      AHiBuffer,
      AdenseHiBuffer,
      triHiParams,
    ]);
    const triLoBindGroup = createBindGroup(device, triLayout, [
      ALoBuffer,
      AdenseLoBuffer,
      triLoParams,
    ]);

    // X/Y operands ({ hi, lo, ld }), matching swapXY above.
    const dense = { hi: AdenseHiBuffer, lo: AdenseLoBuffer, ld: ldDense };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const X = swapXY ? opB : dense;
    const Y = swapXY ? dense : opB;
    // Vectorized-load enablement — same rules as dgemm.mjs, checked against
    // the Hi buffers (the only ones with vec4 views).
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecX = xNot && vec4Usable(X.hi, X.ld, mg, kg); // transposed-A vec stores bank-conflict smem — measured slower than scalar for sgemm
    const useVecY = vec4Usable(Y.hi, Y.ld, yNot ? kg : ng, yNot ? ng : kg);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    gemmParams = createParamsBuffer(
      device,
      [
        { value: mg, type: "u32" },
        { value: ng, type: "u32" },
        { value: kg, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: 0.0, type: "f32" }, // beta — dtrmm has no C accumulation term
        { value: 0.0, type: "f32" },
        { value: X.ld, type: "u32" },
        { value: Y.ld, type: "u32" },
        { value: ldb, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecX ? 1 : 0, type: "u32" },
        { value: useVecY ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" }, // uplo: full C
      ],
      "dtrmm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(
      device,
      gemmPipeline.getBindGroupLayout(0),
      [
        X.hi,
        vec4ViewBinding(device, X.hi),
        X.lo,
        Y.hi,
        vec4ViewBinding(device, Y.hi),
        Y.lo,
        outHiBuffer,
        outLoBuffer,
        gemmParams,
      ],
    );

    const { commandEncoder, querySet } = beginTimedEncoder(device);
    // Seed outHi/outLo with B's own halves first, so gemm's tight m x n write
    // leaves stride-padding gaps holding B's original content, not zero.
    commandEncoder.copyBufferToBuffer(
      BHiBuffer,
      0,
      outHiBuffer,
      0,
      BHiBuffer.size,
    );
    commandEncoder.copyBufferToBuffer(
      BLoBuffer,
      0,
      outLoBuffer,
      0,
      BLoBuffer.size,
    );
    // Three passes; the timestamp brackets them (begin on the first
    // triangularize, end on the gemm), as in dsymm.
    const triDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : undefined;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : undefined;
    encodePass(
      commandEncoder,
      triPipeline,
      triHiBindGroup,
      triWgCount,
      triDesc,
    );
    encodePass(commandEncoder, triPipeline, triLoBindGroup, triWgCount);
    encodePass(
      commandEncoder,
      gemmPipeline,
      gemmBindGroup,
      gemmWgCount,
      gemmDesc,
    );

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = BIsGpu
      ? null
      : stageReadback(device, commandEncoder, outHiBuffer);
    readLoBuffer = BIsGpu
      ? null
      : stageReadback(device, commandEncoder, outLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (BIsGpu) {
      // Adopt outHi/outLo as B's own backing buffers instead of copying into
      // the old ones (B's buffers have no COPY_DST usage) — as strmm does.
      destroyBuffers(B._buf, B._loBuf);
      B._buf = outHiBuffer;
      B._loBuf = outLoBuffer;
      outAdopted = true;
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, B);
    if (gpuTimeMs !== undefined) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (AdenseHiBuffer) destroyBuffers(AdenseHiBuffer);
    if (AdenseLoBuffer) destroyBuffers(AdenseLoBuffer);
    if (outHiBuffer && !outAdopted) destroyBuffers(outHiBuffer);
    if (outLoBuffer && !outAdopted) destroyBuffers(outLoBuffer);
    if (triHiParams) destroyBuffers(triHiParams);
    if (triLoParams) destroyBuffers(triLoParams);
    if (gemmParams) destroyBuffers(gemmParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
