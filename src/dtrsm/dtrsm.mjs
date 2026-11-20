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
import { splitDoubleDouble, mergeDoubleDoubleExact } from "../util/f64.mjs";
import {
  BLOCK_SIZE,
  BM_SMALL,
  BN_SMALL,
  STRSM_SMALL_RHS_PER_WG,
} from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// A strided 2-D view of a buffer pair: element (r, c) lives at
// off + r*rs + c*cs, with rs or cs equal to 1 (row- or column-addressed) —
// strsm.mjs's views, over the Hi and Lo halves at once.
const view = (hi, lo, off, rs, cs) => ({ hi, lo, off, rs, cs });
const transposed = (v) => ({ ...v, rs: v.cs, cs: v.rs });
const at = (v, r, c) => ({ ...v, off: v.off + r * v.rs + c * v.cs });

// dtrsm: B := alpha*op(A)^-1*B (side='left') or alpha*B*op(A)^-1
// (side='right'), A triangular — double-double (Dekker) f64 emulation of
// strsm's substitution path. Blocked over 64-row diagonal blocks, one compute
// pass: dtrsm_small.wgsl solves each diagonal block in place on B (a single
// dispatch when the order fits one block), then the trailing update
// subtracts the block's contribution from the rows still to solve. That
// update is dgemm_small on packed copies — block_transfer.wgsl gathers the
// panel of op(A) and the remaining rows of B (Hi and Lo halves alike: moving
// values is exact) and scatters the rows back — since dgemm_small, unlike
// sgemm, can't address operands at an offset. No explicit block inverses
// (strsm's large-size path): substitution is the more accurate, and the
// update gemm dominates at the sizes where the inverse would pay off.
export async function dtrsm(
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
  requireSameDevice(device, "dtrsm", { A, B });
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

  const otherLen = side === "left" ? n : m;

  // Forward iff op(A) is lower (side='left') — side='right' flips this,
  // since it solves via columns instead of rows.
  const opIsLower = (transEffA === "no-transpose") === (uploEffA === "lower");
  const forward = side === "left" ? opIsLower : !opIsLower;

  const blockStarts = [];
  for (let s = 0; s < aOrder; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;
  // The longest trailing update: every row but the first block's — and
  // solving backward, the first block is the last one, possibly short, so
  // its update can cover all but a few rows. (Sizing for "all but 64 rows"
  // lost the update's tail: WebGPU drops out-of-bounds writes silently.)
  const maxRest =
    aOrder - (Math.min(blockStarts[0] + BLOCK_SIZE, aOrder) - blockStarts[0]);

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const solvePipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/divide", "dtrsm_small"],
    "main",
  );
  // Always dgemm_small — dgemm_large measured ~2x slower (see dgemm.mjs).
  const gemmPipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  const transferPipeline =
    numBlocks > 1 ? await getPipeline(device, "block_transfer") : null;
  const solveGroups = requireWorkgroupCount(
    device,
    Math.ceil(otherLen / STRSM_SMALL_RHS_PER_WG),
    "dtrsm",
  );

  // Null-init here and allocate inside the try below, so a throw partway
  // through the sequence still reaches finally with every handle visible.
  let AHi = null;
  let ALo = null;
  let BHi = null;
  let BLo = null;
  // The block just solved, packed (blockLen x otherLen), for the update.
  let XHi = null;
  let XLo = null;
  // The update's packed operands: the panel of op(A) (rest x blockLen) and
  // the remaining rows of B (rest x otherLen).
  let LpHi = null;
  let LpLo = null;
  let CpHi = null;
  let CpLo = null;
  let readHi = null;
  let readLo = null;

  const paramsBuffers = [];
  function params(entries, label) {
    const buf = createParamsBuffer(device, entries, label);
    paramsBuffers.push(buf);
    return buf;
  }

  try {
    if (AIsGpu) {
      AHi = A._buf;
      ALo = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHi = uploadBuffer(device, ASplit.hi, "dtrsm-AHi", false);
      ALo = uploadBuffer(device, ASplit.lo, "dtrsm-ALo", false);
    }
    if (BIsGpu) {
      BHi = B._buf;
      BLo = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHi = uploadBuffer(device, BSplit.hi, "dtrsm-BHi", true);
      BLo = uploadBuffer(device, BSplit.lo, "dtrsm-BLo", true);
    }
    // At least 4 floats each: the alpha = 0 write binds X as dgemm_small's
    // (unread) operands, whose vec4 views need one vec4.
    const floats = (count) => Math.max(count, 4) * 4;
    const xFloats = numBlocks > 1 ? BLOCK_SIZE * otherLen : 0;
    XHi = createStorageBuffer(device, floats(xFloats), "dtrsm-XHi");
    XLo = createStorageBuffer(device, floats(xFloats), "dtrsm-XLo");
    if (numBlocks > 1) {
      LpHi = createStorageBuffer(
        device,
        floats(maxRest * BLOCK_SIZE),
        "dtrsm-LpHi",
      );
      LpLo = createStorageBuffer(
        device,
        floats(maxRest * BLOCK_SIZE),
        "dtrsm-LpLo",
      );
      CpHi = createStorageBuffer(
        device,
        floats(maxRest * otherLen),
        "dtrsm-CpHi",
      );
      CpLo = createStorageBuffer(
        device,
        floats(maxRest * otherLen),
        "dtrsm-CpLo",
      );
    }

    // Views in the solve frame: Bt(b, o) is B with the blocked axis first
    // (B itself for side='left', B^T for 'right'), and Lt(i, j) the op(A)
    // entry coupling unknown j into equation i there (op(A)^T for 'right',
    // since X*op(A) = B is op(A)^T * X^T = B^T).
    const Bv =
      effLayoutB === "column-major"
        ? view(BHi, BLo, 0, 1, ldb)
        : view(BHi, BLo, 0, ldb, 1);
    const Bt = side === "left" ? Bv : transposed(Bv);
    const opA =
      transEffA === "transpose"
        ? view(AHi, ALo, 0, 1, lda)
        : view(AHi, ALo, 0, lda, 1);
    const Lt = side === "left" ? opA : transposed(opA);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );

    // Every dispatch goes in ONE compute pass, as in strsm: each dispatch is
    // still its own synchronization scope (WebGPU orders them and makes each
    // one's storage writes visible to the next), but a pass per dispatch
    // added a fixed cost that dominated the long chain of small steps.
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);

    // C := alpha*X*Y + beta*C (X mg×kg, Y kg×ng, C mg×ng), all packed
    // row-major with the given leading dimensions — one dgemm_small dispatch.
    // alpha and beta are { hi, lo } doubles.
    const gemm = (X, Y, C, mg, ng, kg, ldx, ldy, ldc, a, b) => {
      const gemmParams = params(
        [
          { value: mg, type: "u32" },
          { value: ng, type: "u32" },
          { value: kg, type: "u32" },
          { value: a.hi, type: "f32" },
          { value: a.lo, type: "f32" },
          { value: b.hi, type: "f32" },
          { value: b.lo, type: "f32" },
          { value: ldx, type: "u32" },
          { value: ldy, type: "u32" },
          { value: ldc, type: "u32" },
          { value: 0, type: "u32" }, // transA
          { value: 0, type: "u32" }, // transB
          {
            value: kg > 0 && vec4Usable(X.hi, ldx, mg, kg) ? 1 : 0,
            type: "u32",
          },
          {
            value: kg > 0 && vec4Usable(Y.hi, ldy, kg, ng) ? 1 : 0,
            type: "u32",
          },
          { value: 0, type: "u32" }, // uplo: full C
        ],
        "dtrsm-gemm-params",
      );
      pass.setPipeline(gemmPipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, gemmPipeline.getBindGroupLayout(0), [
          X.hi,
          vec4ViewBinding(device, X.hi),
          X.lo,
          Y.hi,
          vec4ViewBinding(device, Y.hi),
          Y.lo,
          C.hi,
          C.lo,
          gemmParams,
        ]),
      );
      pass.dispatchWorkgroups(
        requireWorkgroupCount(device, Math.ceil(ng / BN_SMALL), "dtrsm", "x"),
        requireWorkgroupCount(device, Math.ceil(mg / BM_SMALL), "dtrsm", "y"),
      );
    };

    // Substitution solve of one diagonal block, in place on B through views
    // (see dtrsm_small.wgsl); xLd > 0 also leaves a packed copy in X.
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
          { value: alphaS.hi, type: "f32" }, // applied as B is read in
          { value: alphaS.lo, type: "f32" },
          { value: xLd, type: "u32" },
        ],
        "dtrsm-solve-params",
      );
      pass.setPipeline(solvePipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, solvePipeline.getBindGroupLayout(0), [
          AHi,
          ALo,
          BHi,
          BLo,
          XHi,
          XLo,
          solveParams,
        ]),
      );
      pass.dispatchWorkgroups(solveGroups);
    };

    // Rows [start, start+len) x columns [otherStart, otherStart+otherCount)
    // of the strided view v, between v's buffers and the packed pair
    // `packed` (len x otherCount, row-major): mode 2 gathers into `packed`,
    // mode 0 scatters back out of it. Hi and Lo move alike.
    const transfer = (v, packed, start, len, otherStart, otherCount, mode) => {
      // A view with rs = 1 is column-addressed: element (r, c) at c*cs + r.
      const colAddressed = v.rs === 1 && v.cs !== 1;
      const ld = colAddressed ? v.cs : v.rs;
      const transferParams = params(
        [
          { value: start, type: "u32" },
          { value: len, type: "u32" },
          { value: otherStart, type: "u32" },
          { value: otherCount, type: "u32" },
          { value: ld, type: "u32" },
          { value: colAddressed ? 1 : 0, type: "u32" },
          { value: 1, type: "u32" }, // blockIsRow: start indexes v's rows
          { value: mode, type: "u32" },
        ],
        "dtrsm-transfer-params",
      );
      pass.setPipeline(transferPipeline);
      for (const [block, strided] of [
        [packed.hi, v.hi],
        [packed.lo, v.lo],
      ]) {
        pass.setBindGroup(
          0,
          createBindGroup(device, transferPipeline.getBindGroupLayout(0), [
            block,
            strided,
            transferParams,
          ]),
        );
        const wg = requireWorkgroups(device, "dtrsm", len, otherCount);
        pass.dispatchWorkgroups(wg.x, wg.y, wg.z ?? 1);
      }
    };

    const ONE = { hi: 1, lo: 0 };
    const MINUS_ONE = { hi: -1, lo: 0 };
    const ALPHA = { hi: alphaHi[0], lo: alphaLo[0] };

    if (alpha === 0) {
      // BLAS: alpha=0 means B must become a literal zero, not 0*B (which
      // leaks NaN/Inf). dgemm_small with k=0 never reads its operands (X is
      // a safe dummy for both) and with alpha = beta = 0 writes exact zeros
      // over just the m x n matrix, leaving stride padding alone.
      const dummy = { hi: XHi, lo: XLo };
      gemm(
        dummy,
        dummy,
        { hi: BHi, lo: BLo },
        bOuter,
        bInner,
        0,
        4,
        4,
        ldb,
        { hi: 0, lo: 0 },
        { hi: 0, lo: 0 },
      );
    } else if (numBlocks === 1) {
      // One block: the whole solve is a single dispatch, alpha on read-in.
      solve(Lt, Bt, aOrder, ALPHA, 0);
    } else {
      const packedL = { hi: LpHi, lo: LpLo };
      const packedC = { hi: CpHi, lo: CpLo };
      const packedX = { hi: XHi, lo: XLo };
      blockStarts.forEach((blockStart, index) => {
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, aOrder);
        const blockLen = blockEnd - blockStart;
        // alpha goes in once: on read-in for the first block's own rows,
        // and as the first update's beta for every other row (that update
        // covers all of them). Later blocks see B already scaled.
        const first = index === 0;

        // 1) solve the diagonal block in place, packed copy to X.
        solve(
          at(Lt, blockStart, blockStart),
          at(Bt, blockStart, 0),
          blockLen,
          first ? ALPHA : ONE,
          otherLen,
        );

        // 2) trailing update: Bt[rest] := beta*Bt[rest] - Lt[rest, block]*X.
        const rangeStart = forward ? blockEnd : 0;
        const rangeEnd = forward ? aOrder : blockStart;
        const rest = rangeEnd - rangeStart;
        if (rest === 0) return;
        transfer(Lt, packedL, rangeStart, rest, blockStart, blockLen, 2);
        transfer(Bt, packedC, rangeStart, rest, 0, otherLen, 2);
        gemm(
          packedL,
          packedX,
          packedC,
          rest,
          otherLen,
          blockLen,
          blockLen,
          otherLen,
          otherLen,
          MINUS_ONE,
          first ? ALPHA : ONE,
        );
        transfer(Bt, packedC, rangeStart, rest, 0, otherLen, 0);
      });
    }
    pass.end();

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHi = BIsGpu ? null : stageReadback(device, commandEncoder, BHi);
    readLo = BIsGpu ? null : stageReadback(device, commandEncoder, BLo);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (BIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHi, Float32Array);
    readHi = null;
    const lo = await extractResult(readLo, Float32Array);
    readLo = null;
    const result = mergeDoubleDoubleExact(hi, lo, B);
    if (gpuTimeMs !== undefined) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu) destroyBuffers(...[AHi, ALo].filter(Boolean));
    if (!BIsGpu) destroyBuffers(...[BHi, BLo].filter(Boolean));
    destroyBuffers(
      ...[XHi, XLo, LpHi, LpLo, CpHi, CpLo, readHi, readLo].filter(Boolean),
    );
    destroyBuffers(paramsBuffers);
  }
}
