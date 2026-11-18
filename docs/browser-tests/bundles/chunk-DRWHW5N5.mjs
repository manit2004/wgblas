import { hasNonFinite, triangleHasNonFinite } from "./chunk-AIAZUKYM.mjs";
import {
  calcWorkgroups,
  requireWorkgroupCount,
  requireWorkgroups,
} from "./chunk-UIYSXR5Q.mjs";
import {
  Complex32,
  Complex32Array,
  Complex64Array,
  interleaveComplex32,
  mergeComplex64,
  splitComplex64,
} from "./chunk-3HAMCUKM.mjs";
import {
  BLOCK_SIZE,
  BM_LARGE,
  BM_SMALL,
  BN_LARGE,
  BN_SMALL,
  DNRM2_PARTIAL_LEN,
  LARGE_TILE_WORKGROUP_THRESHOLD,
  SPLITK_CHUNK_ROWS,
  SPLITK_CHUNK_ROWS_DD,
  SSYMV_TILE,
  STRSM_SMALL_RHS_PER_WG,
  STRSV_TILE_ROWS,
  TILE_WG_2D,
  WGS,
} from "./chunk-2ZD6UYXN.mjs";
import {
  mergeDoubleDouble,
  mergeDoubleDoubleExact,
  splitDoubleDouble,
} from "./chunk-XFYS3TNK.mjs";

// src/util/benchmark.mjs
function benchmarkMode(adapter, enabled) {
  if (!enabled) return {};
  if (adapter.features.has("timestamp-query"))
    return { requiredFeatures: ["timestamp-query"] };
  console.warn(
    "timestamp-query not supported on this device \u2014 benchmark mode disabled.",
  );
  return {};
}
function beginTimestamp(device) {
  if (!isBenchmarkEnabled(device))
    return { querySet: null, passDescriptor: void 0 };
  const querySet = device.createQuerySet({ type: "timestamp", count: 2 });
  const passDescriptor = {
    timestampWrites: {
      querySet,
      beginningOfPassWriteIndex: 0,
      endOfPassWriteIndex: 1,
    },
  };
  return { querySet, passDescriptor };
}
function resolveTimestamp(device, commandEncoder, querySet) {
  if (!querySet) return null;
  const resolveBuffer = device.createBuffer({
    label: "timestamp-resolve",
    size: 16,
    // 2 × BigInt64 (8 bytes each)
    usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
  });
  commandEncoder.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
  const tsReadBuffer = device.createBuffer({
    label: "timestamp-readback",
    size: 16,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  commandEncoder.copyBufferToBuffer(
    resolveBuffer,
    0,
    // src, srcOffset
    tsReadBuffer,
    0,
    // dst, dstOffset
    16,
    // full 16 bytes (both timestamps)
  );
  return { tsReadBuffer, resolveBuffer, querySet };
}
async function extractTimestamp(ts) {
  if (!ts) return void 0;
  const { tsReadBuffer, resolveBuffer, querySet } = ts;
  await tsReadBuffer.mapAsync(GPUMapMode.READ);
  const timestamps = new BigInt64Array(tsReadBuffer.getMappedRange().slice());
  tsReadBuffer.unmap();
  tsReadBuffer.destroy();
  resolveBuffer.destroy();
  querySet.destroy();
  return Math.max(0, Number(timestamps[1] - timestamps[0])) / 1e6;
}

// src/util/buffer.mjs
function destroyBuffers(...buffers) {
  buffers.flat().forEach((b) => b.destroy());
}
function requireStorageSize(device, byteSize, label) {
  const maxSize = device.limits.maxStorageBufferBindingSize;
  if (byteSize > maxSize) {
    throw new Error(
      `Buffer "${label}" needs ${byteSize} bytes, exceeding this device's maxStorageBufferBindingSize (${maxSize} bytes). The operands are too large for this device.`,
    );
  }
}
function uploadBuffer(device, data, label = "blas-input", readback = false) {
  const byteSize = data.byteLength;
  requireStorageSize(device, byteSize, label);
  const usage = readback
    ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
  const buffer = device.createBuffer({ label, size: byteSize, usage });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}
function createStorageBuffer(
  device,
  size,
  label = "blas-storage",
  extraUsage = 0,
) {
  requireStorageSize(device, size, label);
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE | extraUsage,
  });
}
function createResultBuffer(device, size, label = "blas-result") {
  requireStorageSize(device, size, label);
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
}
var READBACK_POOL_MAX_PER_SIZE = 4;
var READBACK_POOL_MAX_BUFFER_BYTES = 4 * 1024 * 1024;
var READBACK_POOL_MAX_TOTAL_BYTES = 32 * 1024 * 1024;
var _readbackPools = /* @__PURE__ */ new Map();
var _readbackOwner = /* @__PURE__ */ new WeakMap();
function readbackPool(device) {
  let pool = _readbackPools.get(device);
  if (!pool) {
    pool = { bySize: /* @__PURE__ */ new Map(), bytes: 0 };
    _readbackPools.set(device, pool);
  }
  return pool;
}
function stageReadback(device, commandEncoder, sourceBuffer) {
  const size = sourceBuffer.size;
  const pool = readbackPool(device);
  let readBuffer = pool.bySize.get(size)?.pop();
  if (readBuffer) {
    pool.bytes -= size;
  } else {
    readBuffer = device.createBuffer({
      label: "blas-readback",
      size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    _readbackOwner.set(readBuffer, device);
  }
  commandEncoder.copyBufferToBuffer(
    sourceBuffer,
    0,
    // src, srcOffset
    readBuffer,
    0,
    // dst, dstOffset
    size,
    // full copy, no partial reads
  );
  return readBuffer;
}
function releaseReadback(readBuffer) {
  const device = _readbackOwner.get(readBuffer);
  const pool = device && _readbackPools.get(device);
  const size = readBuffer.size;
  const list = pool?.bySize.get(size) ?? [];
  if (
    !pool ||
    size > READBACK_POOL_MAX_BUFFER_BYTES ||
    list.length >= READBACK_POOL_MAX_PER_SIZE ||
    pool.bytes + size > READBACK_POOL_MAX_TOTAL_BYTES
  ) {
    readBuffer.destroy();
    return;
  }
  list.push(readBuffer);
  pool.bySize.set(size, list);
  pool.bytes += size;
}
function clearReadbackPool(device) {
  const devices = device === void 0 ? [..._readbackPools.keys()] : [device];
  for (const d of devices) {
    const pool = _readbackPools.get(d);
    if (!pool) continue;
    for (const list of pool.bySize.values()) list.forEach((b) => b.destroy());
    _readbackPools.delete(d);
  }
}
var VEC4_ELEM_BYTES = 16;
var _vec4Fallbacks = /* @__PURE__ */ new WeakMap();
function vec4FallbackBuffer(device) {
  let b = _vec4Fallbacks.get(device);
  if (!b) {
    b = device.createBuffer({
      label: "blas-vec4-fallback",
      size: VEC4_ELEM_BYTES,
      usage: GPUBufferUsage.STORAGE,
    });
    _vec4Fallbacks.set(device, b);
  }
  return b;
}
function vec4ViewBinding(device, entry) {
  const buffer = entry instanceof GPUBuffer ? entry : entry.buffer;
  const offset = entry instanceof GPUBuffer ? 0 : (entry.offset ?? 0);
  const avail =
    entry instanceof GPUBuffer
      ? entry.size
      : (entry.size ?? buffer.size - offset);
  const size = Math.floor(avail / VEC4_ELEM_BYTES) * VEC4_ELEM_BYTES;
  if (size < VEC4_ELEM_BYTES) {
    return {
      buffer: vec4FallbackBuffer(device),
      offset: 0,
      size: VEC4_ELEM_BYTES,
    };
  }
  return { buffer, offset, size };
}
function vec4Usable(entry, stride, outerCount, innerCount, elemOffset = 0) {
  if (stride % 4 !== 0 || elemOffset % 4 !== 0) return false;
  const buffer = entry instanceof GPUBuffer ? entry : entry.buffer;
  const offset = entry instanceof GPUBuffer ? 0 : (entry.offset ?? 0);
  const avail =
    entry instanceof GPUBuffer
      ? buffer.size
      : (entry.size ?? buffer.size - offset);
  const viewFloats = Math.floor(avail / VEC4_ELEM_BYTES) * 4;
  if (viewFloats <= 0) return false;
  const maxFlat =
    elemOffset +
    (Math.max(outerCount, 1) - 1) * stride +
    (Math.max(innerCount, 1) - 1);
  return Math.floor(maxFlat / 4) * 4 + 4 <= viewFloats;
}
function createParamsBuffer(device, params, label = "blas-params") {
  const rawSize = params.length * 4;
  const size = Math.ceil(rawSize / 16) * 16;
  const arrayBuffer = new ArrayBuffer(size);
  const view2 = new DataView(arrayBuffer);
  params.forEach(({ value, type }, i) => {
    const offset = i * 4;
    if (type === "u32") {
      view2.setUint32(offset, value, true);
    } else if (type === "i32") {
      view2.setInt32(offset, value, true);
    } else if (type === "f32") {
      view2.setFloat32(offset, value, true);
    } else {
      throw new Error(
        `Unknown param type "${type}". Use "f32", "u32", or "i32".`,
      );
    }
  });
  const buffer = device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, arrayBuffer);
  return buffer;
}

// src/init.mjs
var _gpu = null;
var _onDawn = false;
var _dumpShaders = false;
var _devices = /* @__PURE__ */ new Map();
var _meta = /* @__PURE__ */ new WeakMap();
var _primary = null;
var optionsKey = ({ powerPreference, benchmark }) =>
  `${powerPreference}::${benchmark}`;
async function init({
  powerPreference = "high-performance",
  benchmark = false,
  dumpShaders = false,
} = {}) {
  const options = { powerPreference, benchmark, dumpShaders };
  const key = optionsKey(options);
  const cached = _devices.get(key);
  if (cached) return cached;
  if (!_gpu) {
    if (typeof window === "undefined" && !globalThis.navigator?.gpu) {
      const { create, globals } = await import("./chunk-SQAYPR2G.mjs");
      Object.assign(globalThis, globals);
      const toggles = dumpShaders
        ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
        : [];
      _gpu = create(toggles);
      _onDawn = true;
      _dumpShaders = dumpShaders;
    } else {
      if (dumpShaders)
        console.warn(
          "dumpShaders has no effect in the browser or Deno \u2014 see init()'s docs.",
        );
      _gpu = navigator.gpu;
    }
  } else if (_onDawn && dumpShaders !== _dumpShaders) {
    console.warn(
      `dumpShaders: ${dumpShaders} was requested, but the WebGPU instance was already created with dumpShaders: ${_dumpShaders}. The first init() call fixes this for the process.`,
    );
  }
  if (!_gpu) {
    throw new Error("WebGPU not supported in this environment.");
  }
  const adapter =
    (await _gpu.requestAdapter({ powerPreference })) ??
    (await _gpu.requestAdapter());
  if (!adapter) {
    throw new Error("No WebGPU adapter found.");
  }
  const bmConfig = benchmarkMode(adapter, benchmark);
  const features = [...(bmConfig.requiredFeatures ?? [])];
  const device = await adapter.requestDevice({ requiredFeatures: features });
  device.addEventListener("uncapturederror", (e) => {
    console.error("Uncaptured GPU error:", e.error.message);
  });
  const benchmarkGranted = features.includes("timestamp-query");
  _meta.set(device, { adapter, benchmark: benchmarkGranted, options });
  _devices.set(key, device);
  if (!_primary) _primary = device;
  return device;
}
function cleanup(device) {
  if (device === void 0) {
    clearReadbackPool();
    for (const d of _devices.values()) d.destroy();
    _devices.clear();
    _primary = null;
    return;
  }
  const meta = _meta.get(device);
  if (!meta) return;
  _devices.delete(optionsKey(meta.options));
  _meta.delete(device);
  clearReadbackPool(device);
  device.destroy();
  if (_primary === device) _primary = _devices.values().next().value ?? null;
}
function gpuName(device = _primary) {
  const meta = device && _meta.get(device);
  if (!meta) {
    throw new Error("WebGPU adapter not initialized \u2014 call init() first.");
  }
  const { device: deviceName, description } = meta.adapter.info;
  return {
    description: description || "unknown",
    device: deviceName || "unknown",
  };
}
function isBenchmarkEnabled(device = _primary) {
  return _meta.get(device)?.benchmark ?? false;
}
function getDevice() {
  if (!_primary) {
    throw new Error("WebGPU device not initialized \u2014 call init() first.");
  }
  return _primary;
}
function getAdapter(device = _primary) {
  const meta = device && _meta.get(device);
  if (!meta) {
    throw new Error("WebGPU adapter not initialized \u2014 call init() first.");
  }
  return meta.adapter;
}

// src/util/result.mjs
async function extractResult(readBuffer, readbackType = Float32Array) {
  let unmapped = false;
  try {
    await readBuffer.mapAsync(GPUMapMode.READ);
    const result = new readbackType(readBuffer.getMappedRange().slice());
    readBuffer.unmap();
    unmapped = true;
    return result;
  } finally {
    if (unmapped) releaseReadback(readBuffer);
    else readBuffer.destroy();
  }
}

// src/classes/GpuVector.mjs
var GpuVector = class _GpuVector {
  constructor(
    buffer,
    length,
    dtype = Float32Array,
    loBuffer = null,
    device = null,
  ) {
    this._buf = buffer;
    this._loBuf = loBuffer;
    this.length = length;
    this.dtype = dtype;
    this.device = device ?? getDevice();
  }
  /**
   * Uploads a vector to GPU memory.
   *
   * Pass the target `GPUDevice` first — matching every routine's own
   * `(device, ...)` convention. Omitting it falls back to the device from the
   * last `init()`, which is the historical form and only works single-device.
   *
   * @param {GPUDevice|Float32Array|Float64Array} deviceOrData
   */
  static from(deviceOrData, maybeData) {
    const explicit = deviceOrData instanceof GPUDevice;
    const device = explicit ? deviceOrData : getDevice();
    const data = explicit ? maybeData : deviceOrData;
    if (data instanceof Float64Array) {
      const { hi, lo } = splitDoubleDouble(data);
      const hiBuf = uploadBuffer(device, hi, "gpu-vector-f64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-vector-f64-lo", true);
      return new _GpuVector(hiBuf, data.length, Float64Array, loBuf, device);
    }
    if (data instanceof Complex32Array) {
      const buf2 = uploadBuffer(
        device,
        interleaveComplex32(data),
        "gpu-vector-complex32",
        true,
      );
      return new _GpuVector(buf2, data.length, Complex32Array, null, device);
    }
    if (data instanceof Complex64Array) {
      const { hi, lo } = splitComplex64(data);
      const hiBuf = uploadBuffer(device, hi, "gpu-vector-complex64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-vector-complex64-lo", true);
      return new _GpuVector(hiBuf, data.length, Complex64Array, loBuf, device);
    }
    if (!(data instanceof Float32Array)) {
      throw new Error(
        "GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
      );
    }
    const buf = uploadBuffer(device, data, "gpu-vector", true);
    return new _GpuVector(buf, data.length, data.constructor, null, device);
  }
  async read() {
    const device = this.device;
    const enc = device.createCommandEncoder();
    const rb = stageReadback(device, enc, this._buf);
    device.queue.submit([enc.finish()]);
    if (this.dtype === Complex32Array) {
      return new Complex32Array(await extractResult(rb, Float32Array));
    }
    if (!this._loBuf) return extractResult(rb, this.dtype);
    const encLo = device.createCommandEncoder();
    const rbLo = stageReadback(device, encLo, this._loBuf);
    device.queue.submit([encLo.finish()]);
    const [hi, lo] = await Promise.all([
      extractResult(rb, Float32Array),
      extractResult(rbLo, Float32Array),
    ]);
    if (this.dtype === Complex64Array) return mergeComplex64(hi, lo);
    return mergeDoubleDouble(hi, lo);
  }
  destroy() {
    this._buf.destroy();
    if (this._loBuf) this._loBuf.destroy();
  }
};

// src/classes/GpuMatrix.mjs
var GpuMatrix = class _GpuMatrix {
  constructor(
    buffer,
    rows,
    cols,
    lda,
    loBuffer = null,
    layout = "row-major",
    device = null,
    dtype = Float32Array,
  ) {
    this._buf = buffer;
    this._loBuf = loBuffer;
    this.rows = rows;
    this.cols = cols;
    this.lda = lda;
    this.layout = layout;
    this.dtype = dtype;
    this.device = device ?? getDevice();
  }
  /**
   * Uploads a Float32Array or Float64Array matrix to GPU memory, row-major or
   * column-major. `rows`/`cols` always describe the logical shape regardless
   * of layout. `lda` is the stride between consecutive rows (row-major) or
   * columns (column-major) — defaults to `cols`/`rows` respectively (dense,
   * no padding). `data` must have at least `rows * lda` (row-major) or
   * `cols * lda` (column-major) elements.
   */
  static from(deviceOrData, ...rest) {
    const explicit = deviceOrData instanceof GPUDevice;
    const device = explicit ? deviceOrData : getDevice();
    const data = explicit ? rest.shift() : deviceOrData;
    let [rows, cols, lda, layout = "row-major"] = rest;
    if (layout !== "row-major" && layout !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    const isRowMajor = layout === "row-major";
    if (lda === void 0) lda = isRowMajor ? cols : rows;
    if (
      !(data instanceof Float32Array) &&
      !(data instanceof Float64Array) &&
      !(data instanceof Complex32Array) &&
      !(data instanceof Complex64Array)
    )
      throw new Error(
        "GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.",
      );
    if (!Number.isInteger(rows) || rows <= 0)
      throw new Error("rows must be a positive integer.");
    if (!Number.isInteger(cols) || cols <= 0)
      throw new Error("cols must be a positive integer.");
    const minLda = isRowMajor ? cols : rows;
    if (!Number.isInteger(lda) || lda < minLda)
      throw new Error(
        `lda must be an integer >= ${isRowMajor ? "cols" : "rows"}.`,
      );
    const outerCount = isRowMajor ? rows : cols;
    if (data.length < outerCount * lda)
      throw new Error(
        "data does not have enough elements for the given rows, cols, and lda.",
      );
    if (data instanceof Float64Array) {
      const n = outerCount * lda;
      const { hi, lo } = splitDoubleDouble(data.subarray(0, n));
      const hiBuf = uploadBuffer(device, hi, "gpu-matrix-f64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-matrix-f64-lo", true);
      return new _GpuMatrix(
        hiBuf,
        rows,
        cols,
        lda,
        loBuf,
        layout,
        device,
        Float64Array,
      );
    }
    if (data instanceof Complex32Array) {
      const buf2 = uploadBuffer(
        device,
        interleaveComplex32(data, outerCount * lda),
        "gpu-matrix-complex32",
        true,
      );
      return new _GpuMatrix(
        buf2,
        rows,
        cols,
        lda,
        null,
        layout,
        device,
        Complex32Array,
      );
    }
    if (data instanceof Complex64Array) {
      const { hi, lo } = splitComplex64(data, outerCount * lda);
      const hiBuf = uploadBuffer(device, hi, "gpu-matrix-complex64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-matrix-complex64-lo", true);
      return new _GpuMatrix(
        hiBuf,
        rows,
        cols,
        lda,
        loBuf,
        layout,
        device,
        Complex64Array,
      );
    }
    const buf = uploadBuffer(
      device,
      data.subarray(0, outerCount * lda),
      "gpu-matrix",
      true,
    );
    return new _GpuMatrix(buf, rows, cols, lda, null, layout, device);
  }
  async read() {
    const device = this.device;
    const enc = device.createCommandEncoder();
    const rb = stageReadback(device, enc, this._buf);
    device.queue.submit([enc.finish()]);
    const isRowMajor = this.layout !== "column-major";
    const outerCount = isRowMajor ? this.rows : this.cols;
    const innerLen = isRowMajor ? this.cols : this.rows;
    if (this.dtype === Complex32Array) {
      const raw2 = new Complex32Array(await extractResult(rb, Float32Array));
      if (this.lda === innerLen) return raw2;
      const out2 = new Complex32Array(outerCount * innerLen);
      for (let r = 0; r < outerCount; r++)
        for (let c = 0; c < innerLen; c++)
          out2[r * innerLen + c] = raw2[r * this.lda + c];
      return out2;
    }
    if (this._loBuf) {
      const encLo = device.createCommandEncoder();
      const rbLo = stageReadback(device, encLo, this._loBuf);
      device.queue.submit([encLo.finish()]);
      const [hi, lo] = await Promise.all([
        extractResult(rb, Float32Array),
        extractResult(rbLo, Float32Array),
      ]);
      if (this.dtype === Complex64Array) {
        const raw3 = mergeComplex64(hi, lo);
        if (this.lda === innerLen) return raw3;
        const out3 = new Complex64Array(outerCount * innerLen);
        for (let r = 0; r < outerCount; r++)
          for (let c = 0; c < innerLen; c++)
            out3[r * innerLen + c] = raw3[r * this.lda + c];
        return out3;
      }
      const raw2 = mergeDoubleDouble(hi, lo);
      if (this.lda === innerLen) return raw2;
      const out2 = new Float64Array(outerCount * innerLen);
      for (let r = 0; r < outerCount; r++)
        out2.set(
          raw2.subarray(r * this.lda, r * this.lda + innerLen),
          r * innerLen,
        );
      return out2;
    }
    const raw = await extractResult(rb, Float32Array);
    if (this.lda === innerLen) return raw;
    const out = new Float32Array(outerCount * innerLen);
    for (let r = 0; r < outerCount; r++)
      out.set(
        raw.subarray(r * this.lda, r * this.lda + innerLen),
        r * innerLen,
      );
    return out;
  }
  destroy() {
    this._buf.destroy();
    if (this._loBuf) this._loBuf.destroy();
  }
};

// src/util/bindgroup.mjs
function createBindGroup(device, layout, buffers, startBinding = 0) {
  const entries = buffers.map((buffer, i) => ({
    binding: startBinding + i,
    resource: buffer instanceof GPUBuffer ? { buffer } : buffer,
  }));
  return device.createBindGroup({ layout, entries });
}

// src/util/compute.mjs
function submit(device, commandEncoder) {
  device.queue.submit([commandEncoder.finish()]);
}
function beginTimedEncoder(device) {
  const { querySet, passDescriptor } = beginTimestamp(device);
  const commandEncoder = device.createCommandEncoder();
  return { commandEncoder, querySet, passDescriptor };
}
function encodePass(
  commandEncoder,
  pipeline,
  bindGroup,
  workgroups,
  passDescriptor,
) {
  const passEncoder = commandEncoder.beginComputePass(passDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    passEncoder.dispatchWorkgroups(
      workgroups.x,
      workgroups.y,
      workgroups.z ?? 1,
    );
  }
  passEncoder.end();
}
function runComputePasses(device, passes) {
  if (passes.length === 1) {
    const [p] = passes;
    return runComputePass(device, p.pipeline, p.bindGroup, p.workgroups);
  }
  const { commandEncoder, querySet } = beginTimedEncoder(device);
  passes.forEach((p, i) => {
    let desc;
    if (querySet && i === 0)
      desc = { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } };
    else if (querySet && i === passes.length - 1)
      desc = { timestampWrites: { querySet, endOfPassWriteIndex: 1 } };
    encodePass(commandEncoder, p.pipeline, p.bindGroup, p.workgroups, desc);
  });
  const ts = resolveTimestamp(device, commandEncoder, querySet);
  return { commandEncoder, ts };
}
function runComputePass(device, pipeline, bindGroup, workgroups) {
  const { commandEncoder, querySet, passDescriptor } =
    beginTimedEncoder(device);
  encodePass(commandEncoder, pipeline, bindGroup, workgroups, passDescriptor);
  const ts = resolveTimestamp(device, commandEncoder, querySet);
  return { commandEncoder, ts };
}

// src/util/pipeline.mjs
var _pipelines = /* @__PURE__ */ new WeakMap();
async function getPipeline(device, shaderName, entryPoint = "main") {
  if (!_pipelines.has(device)) {
    _pipelines.set(device, /* @__PURE__ */ new Map());
  }
  const byName = _pipelines.get(device);
  const names = Array.isArray(shaderName) ? shaderName : [shaderName];
  const key = `${names.join("+")}::${entryPoint}`;
  if (!byName.has(key)) {
    const pending = loadShader(device, names, entryPoint).catch((err) => {
      byName.delete(key);
      throw err;
    });
    byName.set(key, pending);
  }
  return byName.get(key);
}
async function loadCode(shaderName) {
  if (typeof process === "undefined" || !process.versions?.node) {
    const { shaderSources } = await import("./chunk-WUGXP6HQ.mjs");
    const src = shaderSources[shaderName];
    if (!src)
      throw new Error(`Shader "${shaderName}" not found in browser bundle.`);
    return src;
  } else {
    const { readFileSync } = await import("./chunk-TBTWCYKS.mjs");
    const { fileURLToPath } = await import("./chunk-B6M3S2Z7.mjs");
    const { dirname, join } = await import("./chunk-ACGLJZKM.mjs");
    const dir = dirname(fileURLToPath(import.meta.url));
    return readFileSync(join(dir, `../shaders/${shaderName}.wgsl`), "utf8");
  }
}
async function loadShader(device, shaderNames, entryPoint = "main") {
  const label = shaderNames.join("+");
  const codes = await Promise.all(shaderNames.map(loadCode));
  let offset = 0;
  const ranges = codes.map((c, i) => {
    const lineCount = c.split("\n").length;
    const range = {
      name: shaderNames[i],
      startLine: offset + 1,
      endLine: offset + lineCount,
    };
    offset += lineCount;
    return range;
  });
  const locate = (lineNum) => {
    const range =
      lineNum &&
      ranges.find((r) => lineNum >= r.startLine && lineNum <= r.endLine);
    return range
      ? `${range.name}.wgsl:${lineNum - range.startLine + 1}`
      : `line ${lineNum}`;
  };
  const code = codes.join("\n");
  const shaderModule = device.createShaderModule({ label, code });
  const info = await shaderModule.getCompilationInfo();
  const errors = info.messages.filter((m) => m.type === "error");
  if (errors.length > 0) {
    throw new Error(
      `Shader "${label}" compilation failed:
${errors.map((m) => `  ${locate(m.lineNum)}: ${m.message}`).join("\n")}`,
    );
  }
  const compute =
    entryPoint === "main"
      ? { module: shaderModule }
      : { module: shaderModule, entryPoint };
  const pipeline = device.createComputePipeline({
    label,
    layout: "auto",
    compute,
  });
  pipeline._shaderModule = shaderModule;
  return pipeline;
}

// src/util/device.mjs
function requireGpuDevice(device) {
  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
}
function requireSameDevice(device, routine, operands) {
  for (const [name, value] of Object.entries(operands)) {
    if (!(value instanceof GpuVector) && !(value instanceof GpuMatrix))
      continue;
    if (value.device !== device) {
      throw new Error(
        `${routine}: ${name} belongs to a different GPUDevice than the one passed in. GPU buffers cannot be shared across devices \u2014 recreate the operand on this device, or call the routine with the device that owns it.`,
      );
    }
  }
}

// src/sscal/sscal.mjs
async function sscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "sscal", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!(x instanceof Float32Array) && !(x instanceof GpuVector))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (alpha === 1) return xIsGpu ? {} : { x };
  const pipeline = await getPipeline(device, "sscal");
  let xBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sscal-x", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx, type: "u32" },
      ],
      "sscal-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    readBuffer = null;
    if (gpuTimeMs !== void 0) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/cscal/cscal.mjs
async function cscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "cscal", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (!(alpha instanceof Complex32))
    throw new Error("alpha must be a Complex32.");
  if (Number.isNaN(alpha.re) || Number.isNaN(alpha.im))
    throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha.re) || !Number.isFinite(alpha.im))
    throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!(x instanceof Complex32Array) && !xIsGpu)
    throw new Error("x must be a Complex32Array or GpuVector.");
  if (xIsGpu && x.dtype !== Complex32Array)
    throw new Error("x must be a Complex32Array-backed GpuVector.");
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const pipeline = await getPipeline(device, "cscal");
  let xBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu
      ? x._buf
      : uploadBuffer(device, interleaveComplex32(x), "cscal-x", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alpha.re, type: "f32" },
        { value: alpha.im, type: "f32" },
        { value: incx, type: "u32" },
      ],
      "cscal-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const flat = await extractResult(readBuffer, Float32Array);
    readBuffer = null;
    const result = new Complex32Array(flat);
    if (gpuTimeMs !== void 0) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/dscal/dscal.mjs
async function dscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (incx <= 0) throw new Error("incx must be positive.");
  requireSameDevice(device, "dscal", { x });
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (alpha === 1) return xIsGpu ? {} : { x };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "dscal"]);
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi: hi2, lo: lo2 } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi2, "dscal-xHi", true);
      xLoBuffer = uploadBuffer(device, lo2, "dscal-xLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: incx, type: "u32" },
      ],
      "dscal-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    readLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, x);
    if (gpuTimeMs !== void 0) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/sswap/sswap.mjs
async function sswap(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "sswap", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float32Array) && !(x instanceof GpuVector))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!(y instanceof Float32Array) && !(y instanceof GpuVector))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (x.constructor !== y.constructor)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "sswap");
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let xReadBuffer = null;
  let yReadBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sswap-x", true);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "sswap-y", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "sswap-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    xReadBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xBuffer);
    yReadBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const resultX = await extractResult(xReadBuffer, Float32Array);
    xReadBuffer = null;
    const resultY = await extractResult(yReadBuffer, Float32Array);
    yReadBuffer = null;
    if (gpuTimeMs !== void 0) return { x: resultX, y: resultY, gpuTimeMs };
    return { x: resultX, y: resultY };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xReadBuffer) destroyBuffers(xReadBuffer);
    if (yReadBuffer) destroyBuffers(yReadBuffer);
  }
}

// src/dswap/dswap.mjs
async function dswap(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "dswap", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "dswap");
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let xReadHiBuffer = null;
  let xReadLoBuffer = null;
  let yReadHiBuffer = null;
  let yReadLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dswap-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dswap-xLo", true);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dswap-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dswap-yLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "dswap-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    xReadHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    xReadLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    yReadHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    yReadLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const xHi = await extractResult(xReadHiBuffer, Float32Array);
    xReadHiBuffer = null;
    const xLo = await extractResult(xReadLoBuffer, Float32Array);
    xReadLoBuffer = null;
    const yHi = await extractResult(yReadHiBuffer, Float32Array);
    yReadHiBuffer = null;
    const yLo = await extractResult(yReadLoBuffer, Float32Array);
    yReadLoBuffer = null;
    const xBefore = Float64Array.from(x);
    const yBefore = Float64Array.from(y);
    for (let i = 0; i < n; i++) {
      xBefore[i * incx] = y[i * incy];
      yBefore[i * incy] = x[i * incx];
    }
    const resultX = mergeDoubleDoubleExact(xHi, xLo, xBefore);
    const resultY = mergeDoubleDoubleExact(yHi, yLo, yBefore);
    if (gpuTimeMs !== void 0) return { x: resultX, y: resultY, gpuTimeMs };
    return { x: resultX, y: resultY };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xReadHiBuffer) destroyBuffers(xReadHiBuffer);
    if (xReadLoBuffer) destroyBuffers(xReadLoBuffer);
    if (yReadHiBuffer) destroyBuffers(yReadHiBuffer);
    if (yReadLoBuffer) destroyBuffers(yReadLoBuffer);
  }
}

// src/saxpy/saxpy.mjs
async function saxpy(device, n, alpha, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "saxpy", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return yIsGpu ? {} : { y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  if (alpha === 0) return yIsGpu ? {} : { y };
  const pipeline = await getPipeline(device, "saxpy");
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "saxpy-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "saxpy-y", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "saxpy-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    readBuffer = null;
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/daxpy/daxpy.mjs
async function daxpy(device, n, alpha, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  requireSameDevice(device, "daxpy", { x, y });
  if (n <= 0) return yIsGpu ? {} : { y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  if (alpha === 0) return yIsGpu ? {} : { y };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "daxpy"]);
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "daxpy-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "daxpy-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "daxpy-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "daxpy-yLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "daxpy-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, y);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/scopy/scopy.mjs
async function scopy(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "scopy", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return yIsGpu ? {} : { y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "scopy");
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "scopy-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "scopy-y", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "scopy-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    readBuffer = null;
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/dcopy/dcopy.mjs
async function dcopy(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "dcopy", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0) return yIsGpu ? {} : { y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "dcopy");
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dcopy-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dcopy-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dcopy-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dcopy-yLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "dcopy-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const yBefore = Float64Array.from(y);
    for (let i = 0; i < n; i++) yBefore[i * incy] = x[i * incx];
    const result = mergeDoubleDoubleExact(hi, lo, yBefore);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/sdot/sdot.mjs
async function sdot(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "sdot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return { dot: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipelineMain = await getPipeline(device, "sdot");
  const pipelineReduce = await getPipeline(device, "reduction/sum");
  let xBuffer = null;
  let yBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sdot-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "sdot-y", false);
    partialsBuffer = createStorageBuffer(device, 2 * WGS * 4, "sdot-partials");
    resultBuffer = createResultBuffer(device, 4, "sdot-result");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "sdot-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsBuffer, resultBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);
    submit(device, encoder);
    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null;
    const [gpuTimeMs, dotArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);
    if (gpuTimeMs !== void 0) return { dot: dotArr[0], gpuTimeMs };
    return { dot: dotArr[0] };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/sasum/sasum.mjs
async function sasum(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "sasum", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return { asum: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const pipelineMain = await getPipeline(device, "sasum");
  const pipelineReduce = await getPipeline(device, "reduction/sum");
  let xBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sasum-x", false);
    partialsBuffer = createStorageBuffer(device, 2 * WGS * 4, "sasum-partials");
    resultBuffer = createResultBuffer(device, 4, "sasum-result");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "sasum-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsBuffer, resultBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);
    submit(device, encoder);
    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null;
    const [gpuTimeMs, asumArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);
    if (gpuTimeMs !== void 0) return { asum: asumArr[0], gpuTimeMs };
    return { asum: asumArr[0] };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/dasum/dasum.mjs
async function dasum(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "dasum", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { asum: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const f64Deps = ["f64/dekker", "f64/utils/abs", "f64/utils/add"];
  const pipelineMain = await getPipeline(device, [...f64Deps, "dasum"]);
  const pipelineReduce = await getPipeline(device, [
    ...f64Deps,
    "reduction/sumF64",
  ]);
  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsHiBuffer = null;
  let partialsLoBuffer = null;
  let resultHiBuffer = null;
  let resultLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x.map(Math.abs));
      xHiBuffer = uploadBuffer(device, hi, "dasum-xHi", false);
      xLoBuffer = uploadBuffer(device, lo, "dasum-xLo", false);
    }
    partialsHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dasum-partialsHi",
    );
    partialsLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dasum-partialsLo",
    );
    resultHiBuffer = createResultBuffer(device, 4, "dasum-result-hi");
    resultLoBuffer = createResultBuffer(device, 4, "dasum-result-lo");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "dasum-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      partialsHiBuffer,
      partialsLoBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsHiBuffer, partialsLoBuffer, resultHiBuffer, resultLoBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readHiBuffer = stageReadback(device, encoder, resultHiBuffer);
    readLoBuffer = stageReadback(device, encoder, resultLoBuffer);
    submit(device, encoder);
    const hiPromise = extractResult(readHiBuffer, Float32Array);
    const loPromise = extractResult(readLoBuffer, Float32Array);
    readHiBuffer = null;
    readLoBuffer = null;
    const [gpuTimeMs, hiArr, loArr] = await Promise.all([
      extractTimestamp(ts),
      hiPromise,
      loPromise,
    ]);
    const asum = mergeDoubleDouble(hiArr, loArr)[0];
    if (gpuTimeMs !== void 0) return { asum, gpuTimeMs };
    return { asum };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsHiBuffer) destroyBuffers(partialsHiBuffer);
    if (partialsLoBuffer) destroyBuffers(partialsLoBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/ddot/ddot.mjs
async function ddot(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "ddot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0) return { dot: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const ddCore = ["f64/dekker", "f64/utils/add"];
  const pipelineMain = await getPipeline(device, [
    ...ddCore,
    "f64/utils/multiply",
    "ddot",
  ]);
  const pipelineReduce = await getPipeline(device, [
    ...ddCore,
    "reduction/sumF64",
  ]);
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let partialsHiBuffer = null;
  let partialsLoBuffer = null;
  let resultHiBuffer = null;
  let resultLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "ddot-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "ddot-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "ddot-yHi", false);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "ddot-yLo", false);
    }
    partialsHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "ddot-partialsHi",
    );
    partialsLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "ddot-partialsLo",
    );
    resultHiBuffer = createResultBuffer(device, 4, "ddot-result-hi");
    resultLoBuffer = createResultBuffer(device, 4, "ddot-result-lo");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "ddot-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      partialsHiBuffer,
      partialsLoBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsHiBuffer, partialsLoBuffer, resultHiBuffer, resultLoBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readHiBuffer = stageReadback(device, encoder, resultHiBuffer);
    readLoBuffer = stageReadback(device, encoder, resultLoBuffer);
    submit(device, encoder);
    const hiPromise = extractResult(readHiBuffer, Float32Array);
    const loPromise = extractResult(readLoBuffer, Float32Array);
    readHiBuffer = null;
    readLoBuffer = null;
    const [gpuTimeMs, hiArr, loArr] = await Promise.all([
      extractTimestamp(ts),
      hiPromise,
      loPromise,
    ]);
    const dot = mergeDoubleDouble(hiArr, loArr)[0];
    if (gpuTimeMs !== void 0) return { dot, gpuTimeMs };
    return { dot };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (partialsHiBuffer) destroyBuffers(partialsHiBuffer);
    if (partialsLoBuffer) destroyBuffers(partialsLoBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/snrm2/snrm2.mjs
async function snrm2(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "snrm2", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return { nrm2: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const pipelineMain = await getPipeline(device, "snrm2");
  const pipelineReduce = await getPipeline(device, "reduction/scaledSum");
  let xBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "snrm2-x", false);
    partialsBuffer = createStorageBuffer(
      device,
      2 * WGS * 3 * 4,
      "snrm2-partials",
    );
    resultBuffer = createResultBuffer(device, 4, "snrm2-result");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "snrm2-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsBuffer, resultBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);
    submit(device, encoder);
    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null;
    const [gpuTimeMs, resultArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);
    const nrm2 = resultArr[0];
    if (gpuTimeMs !== void 0) return { nrm2, gpuTimeMs };
    return { nrm2 };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/dnrm2/dnrm2.mjs
async function dnrm2(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "dnrm2", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { nrm2: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const f64Deps = [
    "f64/dekker",
    "f64/utils/abs",
    "f64/utils/greater",
    "f64/utils/add",
    "f64/utils/multiply",
    "f64/utils/divide",
    "f64/utils/sqrt",
  ];
  const pipelineMain = await getPipeline(device, [...f64Deps, "dnrm2"]);
  const pipelineReduce = await getPipeline(device, [
    ...f64Deps,
    "reduction/scaledSumF64",
  ]);
  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsBuffer = null;
  let resultHiBuffer = null;
  let resultLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi, "dnrm2-xHi", false);
      xLoBuffer = uploadBuffer(device, lo, "dnrm2-xLo", false);
    }
    partialsBuffer = createStorageBuffer(
      device,
      2 * WGS * DNRM2_PARTIAL_LEN * 4,
      "dnrm2-partials",
    );
    resultHiBuffer = createResultBuffer(device, 4, "dnrm2-result-hi");
    resultLoBuffer = createResultBuffer(device, 4, "dnrm2-result-lo");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "dnrm2-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsBuffer, resultHiBuffer, resultLoBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readHiBuffer = stageReadback(device, encoder, resultHiBuffer);
    readLoBuffer = stageReadback(device, encoder, resultLoBuffer);
    submit(device, encoder);
    const hiPromise = extractResult(readHiBuffer, Float32Array);
    const loPromise = extractResult(readLoBuffer, Float32Array);
    readHiBuffer = null;
    readLoBuffer = null;
    const [gpuTimeMs, hiArr, loArr] = await Promise.all([
      extractTimestamp(ts),
      hiPromise,
      loPromise,
    ]);
    const nrm2 = mergeDoubleDouble(hiArr, loArr)[0];
    if (gpuTimeMs !== void 0) return { nrm2, gpuTimeMs };
    return { nrm2 };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/isamax/isamax.mjs
async function isamax(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "isamax", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return { index: -1 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const pipelineMain = await getPipeline(device, "isamax");
  const pipelineReduce = await getPipeline(device, "reduction/argmax");
  let xBuffer = null;
  let partialsValBuffer = null;
  let partialsIdxBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "isamax-x", false);
    partialsValBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "isamax-partials-val",
    );
    partialsIdxBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "isamax-partials-idx",
    );
    resultBuffer = createResultBuffer(device, 4, "isamax-result");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "isamax-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsValBuffer,
      partialsIdxBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsValBuffer, partialsIdxBuffer, resultBuffer],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);
    submit(device, encoder);
    const resultPromise = extractResult(readBuffer, Uint32Array);
    readBuffer = null;
    const [gpuTimeMs, idxArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);
    const index = idxArr[0];
    if (gpuTimeMs !== void 0) return { index, gpuTimeMs };
    return { index };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsValBuffer) destroyBuffers(partialsValBuffer);
    if (partialsIdxBuffer) destroyBuffers(partialsIdxBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/idamax/idamax.mjs
async function idamax(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "idamax", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { index: -1 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const f64Deps = [
    "f64/dekker",
    "f64/utils/abs",
    "f64/utils/greater",
    "f64/utils/equal",
  ];
  const pipelineMain = await getPipeline(
    device,
    [...f64Deps, "idamax"],
    "idamax_main",
  );
  const pipelineReduce = await getPipeline(
    device,
    [...f64Deps, "reduction/argmaxF64"],
    "reduce_f64",
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsValHiBuffer = null;
  let partialsValLoBuffer = null;
  let partialsIdxBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi, "idamax-xHi", false);
      xLoBuffer = uploadBuffer(device, lo, "idamax-xLo", false);
    }
    partialsValHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "idamax-partials-val-hi",
    );
    partialsValLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "idamax-partials-val-lo",
    );
    partialsIdxBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "idamax-partials-idx",
    );
    resultBuffer = createResultBuffer(device, 4, "idamax-result");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "idamax-params",
    );
    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      partialsValHiBuffer,
      partialsValLoBuffer,
      partialsIdxBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [
        partialsValHiBuffer,
        partialsValLoBuffer,
        partialsIdxBuffer,
        resultBuffer,
      ],
    );
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);
    submit(device, encoder);
    const resultPromise = extractResult(readBuffer, Uint32Array);
    readBuffer = null;
    const [gpuTimeMs, idxArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);
    const index = idxArr[0];
    if (gpuTimeMs !== void 0) return { index, gpuTimeMs };
    return { index };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsValHiBuffer) destroyBuffers(partialsValHiBuffer);
    if (partialsValLoBuffer) destroyBuffers(partialsValLoBuffer);
    if (partialsIdxBuffer) destroyBuffers(partialsIdxBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readBuffer) destroyBuffers(readBuffer);
  }
}

// src/srot/srot.mjs
async function srot(device, n, x, incx, y, incy, c, s) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "srot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof c !== "number") throw new Error("c must be a number.");
  if (typeof s !== "number") throw new Error("s must be a number.");
  if (Number.isNaN(c) || Number.isNaN(s))
    throw new Error("c and s must not be NaN.");
  if (!Number.isFinite(c)) throw new Error("c must be finite.");
  if (!Number.isFinite(s)) throw new Error("s must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "srot");
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readX = null;
  let readY = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "srot-x", true);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "srot-y", true);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: c, type: "f32" },
        { value: s, type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "srot-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readX = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);
    readY = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const xPromise = extractResult(readX, Float32Array);
    const yPromise = extractResult(readY, Float32Array);
    readX = null;
    readY = null;
    const [xResult, yResult] = await Promise.all([xPromise, yPromise]);
    if (gpuTimeMs !== void 0) return { x: xResult, y: yResult, gpuTimeMs };
    return { x: xResult, y: yResult };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readX) destroyBuffers(readX);
    if (readY) destroyBuffers(readY);
  }
}

// src/drot/drot.mjs
async function drot(device, n, x, incx, y, incy, c, s) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "drot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof c !== "number") throw new Error("c must be a number.");
  if (typeof s !== "number") throw new Error("s must be a number.");
  if (Number.isNaN(c) || Number.isNaN(s))
    throw new Error("c and s must not be NaN.");
  if (!Number.isFinite(c)) throw new Error("c must be finite.");
  if (!Number.isFinite(s)) throw new Error("s must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "drot"]);
  const { hi: cHi, lo: cLo } = splitDoubleDouble(new Float64Array([c]));
  const { hi: sHi, lo: sLo } = splitDoubleDouble(new Float64Array([s]));
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let xReadHiBuffer = null;
  let xReadLoBuffer = null;
  let yReadHiBuffer = null;
  let yReadLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "drot-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "drot-xLo", true);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "drot-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "drot-yLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: cHi[0], type: "f32" },
        { value: cLo[0], type: "f32" },
        { value: sHi[0], type: "f32" },
        { value: sLo[0], type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "drot-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    xReadHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    xReadLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    yReadHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    yReadLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const xHi = await extractResult(xReadHiBuffer, Float32Array);
    xReadHiBuffer = null;
    const xLo = await extractResult(xReadLoBuffer, Float32Array);
    xReadLoBuffer = null;
    const yHi = await extractResult(yReadHiBuffer, Float32Array);
    yReadHiBuffer = null;
    const yLo = await extractResult(yReadLoBuffer, Float32Array);
    yReadLoBuffer = null;
    const resultX = mergeDoubleDoubleExact(xHi, xLo, x);
    const resultY = mergeDoubleDoubleExact(yHi, yLo, y);
    if (gpuTimeMs !== void 0) return { x: resultX, y: resultY, gpuTimeMs };
    return { x: resultX, y: resultY };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xReadHiBuffer) destroyBuffers(xReadHiBuffer);
    if (xReadLoBuffer) destroyBuffers(xReadLoBuffer);
    if (yReadHiBuffer) destroyBuffers(yReadHiBuffer);
    if (yReadLoBuffer) destroyBuffers(yReadLoBuffer);
  }
}

// src/srotm/srotm.mjs
async function srotm(device, n, x, incx, y, incy, param) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "srotm", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (!(param instanceof Float32Array) || param.length !== 5)
    throw new Error("param must be a Float32Array of length 5.");
  if (param[0] !== -2 && param[0] !== -1 && param[0] !== 0 && param[0] !== 1)
    throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0 || param[0] === -2) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const pipeline = await getPipeline(device, "srotm");
  let xBuffer = null;
  let yBuffer = null;
  let paramBuffer = null;
  let paramsBuffer = null;
  let readX = null;
  let readY = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "srotm-x", true);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "srotm-y", true);
    paramBuffer = uploadBuffer(device, param, "srotm-param", false);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "srotm-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readX = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);
    readY = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const xPromise = extractResult(readX, Float32Array);
    const yPromise = extractResult(readY, Float32Array);
    readX = null;
    readY = null;
    const [xResult, yResult] = await Promise.all([xPromise, yPromise]);
    if (gpuTimeMs !== void 0) return { x: xResult, y: yResult, gpuTimeMs };
    return { x: xResult, y: yResult };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramBuffer) destroyBuffers(paramBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readX) destroyBuffers(readX);
    if (readY) destroyBuffers(readY);
  }
}

// src/drotm/drotm.mjs
async function drotm(device, n, x, incx, y, incy, param) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "drotm", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (!(param instanceof Float64Array) || param.length !== 5)
    throw new Error("param must be a Float64Array of length 5.");
  if (param[0] !== -2 && param[0] !== -1 && param[0] !== 0 && param[0] !== 1)
    throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0 || param[0] === -2) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "drotm"]);
  const { hi: paramHi, lo: paramLo } = splitDoubleDouble(param);
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramHiBuffer = null;
  let paramLoBuffer = null;
  let paramsBuffer = null;
  let xReadHiBuffer = null;
  let xReadLoBuffer = null;
  let yReadHiBuffer = null;
  let yReadLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "drotm-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "drotm-xLo", true);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "drotm-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "drotm-yLo", true);
    }
    paramHiBuffer = uploadBuffer(device, paramHi, "drotm-paramHi", false);
    paramLoBuffer = uploadBuffer(device, paramLo, "drotm-paramLo", false);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "drotm-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramHiBuffer,
      paramLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    xReadHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    xReadLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    yReadHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    yReadLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const xHi = await extractResult(xReadHiBuffer, Float32Array);
    xReadHiBuffer = null;
    const xLo = await extractResult(xReadLoBuffer, Float32Array);
    xReadLoBuffer = null;
    const yHi = await extractResult(yReadHiBuffer, Float32Array);
    yReadHiBuffer = null;
    const yLo = await extractResult(yReadLoBuffer, Float32Array);
    yReadLoBuffer = null;
    const resultX = mergeDoubleDoubleExact(xHi, xLo, x);
    const resultY = mergeDoubleDoubleExact(yHi, yLo, y);
    if (gpuTimeMs !== void 0) return { x: resultX, y: resultY, gpuTimeMs };
    return { x: resultX, y: resultY };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramHiBuffer) destroyBuffers(paramHiBuffer);
    if (paramLoBuffer) destroyBuffers(paramLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xReadHiBuffer) destroyBuffers(xReadHiBuffer);
    if (xReadLoBuffer) destroyBuffers(xReadLoBuffer);
    if (yReadHiBuffer) destroyBuffers(yReadHiBuffer);
    if (yReadLoBuffer) destroyBuffers(yReadLoBuffer);
  }
}

// src/sgemv/sgemv.mjs
async function sgemv(
  device,
  trans,
  m,
  n,
  alpha,
  A,
  lda,
  x,
  incx,
  beta,
  y,
  incy,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "sgemv", { A, x, y });
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return yIsGpu ? {} : { y };
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    trans = trans === "no-transpose" ? "transpose" : "no-transpose";
  }
  const isNoTrans = trans === "no-transpose";
  const xLen = isNoTrans ? n : m;
  const yLen = isNoTrans ? m : n;
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (xLen - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given dimensions and incx.",
    );
  if (y.length < (yLen - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given dimensions and incy.",
    );
  const shaderName = isNoTrans ? "sgemv_n" : "sgemv_t";
  const pipeline = await getPipeline(device, shaderName);
  const numChunks = isNoTrans ? 1 : Math.ceil(m / SPLITK_CHUNK_ROWS);
  const reducePipeline =
    numChunks > 1 ? await getPipeline(device, "reduce_partials") : null;
  let ABuffer = null;
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let partialBuffer = null;
  let reduceParams = null;
  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "sgemv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sgemv-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "sgemv-y", true);
    let passes;
    if (isNoTrans) {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: m, type: "u32" },
          { value: n, type: "u32" },
          { value: alpha, type: "f32" },
          { value: beta, type: "f32" },
          { value: incx, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
        ],
        "sgemv-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            ABuffer,
            xBuffer,
            yBuffer,
            paramsBuffer,
          ]),
          workgroups: Math.min(
            m,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    } else {
      if (numChunks > 1) {
        partialBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "sgemv-partials",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: alpha, type: "f32" },
            { value: beta, type: "f32" },
          ],
          "sgemv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: m, type: "u32" },
          { value: n, type: "u32" },
          { value: alpha, type: "f32" },
          { value: beta, type: "f32" },
          { value: incx, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: SPLITK_CHUNK_ROWS, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "sgemv-t-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            ABuffer,
            xBuffer,
            partialBuffer ?? yBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "sgemv", "x"),
            y: requireWorkgroupCount(device, numChunks, "sgemv", "y"),
          },
        },
      ];
      if (numChunks > 1)
        passes.push({
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [partialBuffer, yBuffer, reduceParams],
          ),
          workgroups: Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        });
    }
    const { commandEncoder, ts } = runComputePasses(device, passes);
    const readBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialBuffer) destroyBuffers(partialBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
  }
}

// src/util/strided.mjs
async function gatherStridedPass(device, src, n, inc, label) {
  const pipeline = await getPipeline(device, "gather_strided");
  const buffer = createStorageBuffer(device, n * 4, label);
  const params = createParamsBuffer(
    device,
    [
      { value: n, type: "u32" },
      { value: inc, type: "u32" },
    ],
    `${label}-params`,
  );
  const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
    src,
    buffer,
    params,
  ]);
  const workgroups = Math.min(
    Math.ceil(n / WGS),
    device.limits.maxComputeWorkgroupsPerDimension,
  );
  return { buffer, params, pass: { pipeline, bindGroup, workgroups } };
}
function worthPackingDD(inc, rereads) {
  return inc > 1 && (rereads >= 2048 || (rereads >= 1024 && inc >= 8));
}

// src/ssymv/ssymv.mjs
async function ssymv(
  device,
  uplo,
  n,
  alpha,
  A,
  lda,
  x,
  incx,
  beta,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssymv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  const pipeline = await getPipeline(device, "ssymv");
  const reducePipeline = await getPipeline(device, "reduce_partials");
  const numBlocks = Math.ceil(n / SSYMV_TILE);
  let ABuffer = null;
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let partialBuffer = null;
  let reduceParams = null;
  let xPacked = null;
  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssymv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "ssymv-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "ssymv-y", true);
    if (incx > 1)
      xPacked = await gatherStridedPass(
        device,
        xBuffer,
        n,
        incx,
        "ssymv-x-packed",
      );
    partialBuffer = createStorageBuffer(
      device,
      numBlocks * n * 4,
      "ssymv-partials",
    );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
        { value: numBlocks, type: "u32" },
      ],
      "ssymv-params",
    );
    reduceParams = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: numBlocks, type: "u32" },
        { value: incy, type: "u32" },
        { value: alpha, type: "f32" },
        { value: beta, type: "f32" },
      ],
      "ssymv-reduce-params",
    );
    const numTiles = (numBlocks * (numBlocks + 1)) / 2;
    const maxWg = device.limits.maxComputeWorkgroupsPerDimension;
    const tilesX = Math.min(numTiles, maxWg);
    const tilesY = requireWorkgroupCount(
      device,
      Math.ceil(numTiles / tilesX),
      "ssymv",
      "y",
    );
    const passes = [
      ...(xPacked ? [xPacked.pass] : []),
      {
        pipeline,
        bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
          ABuffer,
          xPacked ? xPacked.buffer : xBuffer,
          partialBuffer,
          paramsBuffer,
        ]),
        workgroups: { x: tilesX, y: tilesY },
      },
      {
        pipeline: reducePipeline,
        bindGroup: createBindGroup(
          device,
          reducePipeline.getBindGroupLayout(0),
          [partialBuffer, yBuffer, reduceParams],
        ),
        workgroups: Math.min(
          Math.ceil(n / WGS),
          device.limits.maxComputeWorkgroupsPerDimension,
        ),
      },
    ];
    const { commandEncoder, ts } = runComputePasses(device, passes);
    const readBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialBuffer) destroyBuffers(partialBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    if (xPacked) destroyBuffers(xPacked.buffer, xPacked.params);
  }
}

// src/strmv/strmv.mjs
async function strmv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";
  requireGpuDevice(device);
  requireSameDevice(device, "strmv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";
  const useColumnKernel = !isNoTrans;
  const numChunks = useColumnKernel ? Math.ceil(n / SPLITK_CHUNK_ROWS) : 1;
  const pipeline = await getPipeline(
    device,
    useColumnKernel ? "strmv_t" : "strmv",
  );
  const reducePipeline =
    numChunks > 1 ? await getPipeline(device, "reduce_partials") : null;
  let ABuffer = null;
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let partialBuffer = null;
  let reduceParams = null;
  let xPacked = null;
  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "strmv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "strmv-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "strmv-y", true);
    if (incx > 1)
      xPacked = await gatherStridedPass(
        device,
        xBuffer,
        n,
        incx,
        "strmv-x-packed",
      );
    const xSrc = xPacked ? xPacked.buffer : xBuffer;
    const xInc = xPacked ? 1 : incx;
    let passes;
    if (useColumnKernel) {
      if (numChunks > 1) {
        partialBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "strmv-partials",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: 1, type: "f32" },
            { value: 0, type: "f32" },
          ],
          "strmv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: SPLITK_CHUNK_ROWS, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "strmv-t-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            ABuffer,
            xSrc,
            partialBuffer ?? yBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "strmv", "x"),
            y: requireWorkgroupCount(device, numChunks, "strmv", "y"),
          },
        },
      ];
      if (numChunks > 1)
        passes.push({
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [partialBuffer, yBuffer, reduceParams],
          ),
          workgroups: Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        });
    } else {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: 0, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
        ],
        "strmv-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            ABuffer,
            xSrc,
            yBuffer,
            paramsBuffer,
          ]),
          workgroups: Math.min(
            n,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    }
    if (xPacked) passes.unshift(xPacked.pass);
    const { commandEncoder, ts } = runComputePasses(device, passes);
    const readBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialBuffer) destroyBuffers(partialBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    if (xPacked) destroyBuffers(xPacked.buffer, xPacked.params);
  }
}

// src/strsv/strsv.mjs
function packBlockParams(numBlocks, stride, fieldsPerBlock) {
  const data = new ArrayBuffer(numBlocks * stride);
  const view2 = new DataView(data);
  for (let blockIndex = 0; blockIndex < numBlocks; blockIndex++) {
    const fields = fieldsPerBlock(blockIndex);
    const base = blockIndex * stride;
    fields.forEach((value, i) => view2.setUint32(base + i * 4, value, true));
  }
  return data;
}
var STEP_PARAMS_BYTES = 48;
var SUBSTITUTION_MAX_BLOCKS = 2;
function createSharedParamsBuffer(device, data, label) {
  const buffer = device.createBuffer({
    label,
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}
async function strsv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";
  requireGpuDevice(device);
  requireSameDevice(device, "strsv", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return xIsGpu ? {} : { x };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";
  const invertPipeline = await getPipeline(device, "strsv_invert_block");
  const stepPipeline = await getPipeline(device, "strsv_step");
  const scatterPipeline = await getPipeline(device, "scatter_strided");
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;
  const stride = device.limits.minUniformBufferOffsetAlignment;
  const nonFinite =
    numBlocks > SUBSTITUTION_MAX_BLOCKS &&
    !xIsGpu &&
    (hasNonFinite(x, n, incx) ||
      triangleHasNonFinite(A, n, lda, isLower, isUnit));
  const useSubstitution = numBlocks <= SUBSTITUTION_MAX_BLOCKS || nonFinite;
  const stepParamsData = (presolved) =>
    packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const rangeStart = forward ? blockEnd : 0;
      const rowCount = forward ? n - blockEnd : blockStart;
      return [
        incx,
        lda,
        isNoTrans ? 0 : 1,
        blockIndex,
        blockStart,
        blockEnd,
        rangeStart,
        rowCount,
        presolved,
      ];
    });
  let ABuffer = null;
  let xBuffer = null;
  let AinvBuffer = null;
  let solBuffer = null;
  let stepParamsBuffer = null;
  let invertParams = null;
  let scatterParams = null;
  const solveParamsList = [];
  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "strsv-x", true);
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);
    if (useSubstitution) {
      const smallPipeline = await getPipeline(device, "strsm_small");
      solBuffer = createStorageBuffer(device, n * 4, "strsv-sol");
      if (numBlocks > 1) {
        stepParamsBuffer = createSharedParamsBuffer(
          device,
          stepParamsData(1),
          "strsv-step-params",
        );
      }
      const aRs = isNoTrans ? lda : 1;
      const aCs = isNoTrans ? 1 : lda;
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const blockLen = blockEnd - blockStart;
        const rowCount = forward ? n - blockEnd : blockStart;
        const solveParams = createParamsBuffer(
          device,
          [
            { value: blockLen, type: "u32" },
            { value: 1, type: "u32" },
            // nrhs
            { value: blockStart * (aRs + aCs), type: "u32" },
            // A view
            { value: aRs, type: "u32" },
            { value: aCs, type: "u32" },
            { value: blockStart * incx, type: "u32" },
            // x view
            { value: incx, type: "u32" },
            { value: 0, type: "u32" },
            { value: forward ? 0 : 1, type: "u32" },
            { value: isUnit ? 1 : 0, type: "u32" },
            { value: 1, type: "f32" },
            // alpha
            { value: rowCount > 0 ? 1 : 0, type: "u32" },
            // xLd: packed copy for the update
            { value: isNoTrans ? 0 : 1, type: "u32" },
            // skipZero: BLAS's column form
          ],
          "strsv-solve-params",
        );
        solveParamsList.push(solveParams);
        pass.setPipeline(smallPipeline);
        pass.setBindGroup(
          0,
          createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
            ABuffer,
            xBuffer,
            solveParams,
            // Block starts are multiples of 64 floats, so the offset meets
            // the 256-byte storage-binding alignment.
            { buffer: solBuffer, offset: blockStart * 4, size: blockLen * 4 },
          ]),
        );
        pass.dispatchWorkgroups(1);
        if (rowCount === 0) continue;
        pass.setPipeline(stepPipeline);
        pass.setBindGroup(
          0,
          createBindGroup(device, stepPipeline.getBindGroupLayout(0), [
            ABuffer,
            ABuffer,
            // Ainv slot, unread when presolved
            xBuffer,
            solBuffer,
            {
              buffer: stepParamsBuffer,
              offset: blockIndex * stride,
              size: STEP_PARAMS_BYTES,
            },
          ]),
        );
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.ceil(rowCount / STRSV_TILE_ROWS),
            "strsv",
          ),
        );
      }
    } else {
      AinvBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "strsv-Ainv",
      );
      solBuffer = createStorageBuffer(device, n * 4, "strsv-sol");
      stepParamsBuffer = createSharedParamsBuffer(
        device,
        stepParamsData(0),
        "strsv-step-params",
      );
      invertParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: lda, type: "u32" },
          { value: isNoTrans ? 0 : 1, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
        ],
        "strsv-invert-params",
      );
      scatterParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: incx, type: "u32" },
        ],
        "strsv-scatter-params",
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
      pass.setPipeline(stepPipeline);
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const rowCount = forward ? n - blockEnd : blockStart;
        pass.setBindGroup(
          0,
          createBindGroup(device, stepPipeline.getBindGroupLayout(0), [
            ABuffer,
            AinvBuffer,
            xBuffer,
            solBuffer,
            {
              buffer: stepParamsBuffer,
              offset: blockIndex * stride,
              size: STEP_PARAMS_BYTES,
            },
          ]),
        );
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.max(1, Math.ceil(rowCount / STRSV_TILE_ROWS)),
            "strsv",
          ),
        );
      }
      pass.setPipeline(scatterPipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, scatterPipeline.getBindGroupLayout(0), [
          solBuffer,
          xBuffer,
          scatterParams,
        ]),
      );
      pass.dispatchWorkgroups(
        Math.min(
          Math.ceil(n / WGS),
          device.limits.maxComputeWorkgroupsPerDimension,
        ),
      );
    }
    pass.end();
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    if (solBuffer) destroyBuffers(solBuffer);
    if (stepParamsBuffer) destroyBuffers(stepParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
    if (scatterParams) destroyBuffers(scatterParams);
    destroyBuffers(solveParamsList);
  }
}

// src/sger/sger.mjs
async function sger(
  device,
  m,
  n,
  alpha,
  x,
  incx,
  y,
  incy,
  A,
  lda,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "sger", { A, x, y });
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    [x, y] = [y, x];
    [incx, incy] = [incy, incx];
  }
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  if (lda < n) throw new Error("lda must be >= n.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (m - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given m and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  if (alpha === 0) return AIsGpu ? {} : { A };
  const pipeline = await getPipeline(device, "sger");
  let xBuffer = null;
  let yBuffer = null;
  let ABuffer = null;
  let paramsBuffer = null;
  let yPacked = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sger-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "sger-y", false);
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "sger-A", true);
    if (incy > 1)
      yPacked = await gatherStridedPass(
        device,
        yBuffer,
        n,
        incy,
        "sger-y-packed",
      );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: m, type: "u32" },
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx, type: "u32" },
        { value: yPacked ? 1 : incy, type: "u32" },
        { value: lda, type: "u32" },
      ],
      "sger-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yPacked ? yPacked.buffer : yBuffer,
      ABuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(m, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...(yPacked ? [yPacked.pass] : []),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    const readBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ABuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (yPacked) destroyBuffers(yPacked.buffer, yPacked.params);
  }
}

// src/dger/dger.mjs
async function dger(
  device,
  m,
  n,
  alpha,
  x,
  incx,
  y,
  incy,
  A,
  lda,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dger", { A, x, y });
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    [x, y] = [y, x];
    [incx, incy] = [incy, incx];
  }
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  if (lda < n) throw new Error("lda must be >= n.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (m - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given m and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  if (alpha === 0) return AIsGpu ? {} : { A };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "dger"], "dger_main");
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let paramsBuffer = null;
  let yHiPacked = null;
  let yLoPacked = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      const ASplit = splitDoubleDouble(A);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dger-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dger-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dger-yHi", false);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dger-yLo", false);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dger-AHi", true);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dger-ALo", true);
    }
    if (worthPackingDD(incy, m)) {
      yHiPacked = await gatherStridedPass(
        device,
        yHiBuffer,
        n,
        incy,
        "dger-yHi-packed",
      );
      yLoPacked = await gatherStridedPass(
        device,
        yLoBuffer,
        n,
        incy,
        "dger-yLo-packed",
      );
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: m, type: "u32" },
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: incx, type: "u32" },
        { value: yHiPacked ? 1 : incy, type: "u32" },
        { value: lda, type: "u32" },
      ],
      "dger-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiPacked ? yHiPacked.buffer : yHiBuffer,
      yLoPacked ? yLoPacked.buffer : yLoBuffer,
      AHiBuffer,
      ALoBuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(m, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...(yHiPacked ? [yHiPacked.pass, yLoPacked.pass] : []),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    readHiBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, AHiBuffer);
    readLoBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ALoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, A);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (yHiPacked) destroyBuffers(yHiPacked.buffer, yHiPacked.params);
    if (yLoPacked) destroyBuffers(yLoPacked.buffer, yLoPacked.params);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/ssyr/ssyr.mjs
async function ssyr(
  device,
  uplo,
  n,
  alpha,
  x,
  incx,
  A,
  lda,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssyr", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  if (alpha === 0) return AIsGpu ? {} : { A };
  const pipeline = await getPipeline(device, "ssyr");
  let xBuffer = null;
  let ABuffer = null;
  let paramsBuffer = null;
  let xPacked = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "ssyr-x", false);
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssyr-A", true);
    if (incx > 1)
      xPacked = await gatherStridedPass(
        device,
        xBuffer,
        n,
        incx,
        "ssyr-x-packed",
      );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: xPacked ? 1 : incx, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "ssyr-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xPacked ? xPacked.buffer : xBuffer,
      ABuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...(xPacked ? [xPacked.pass] : []),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    const readBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ABuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xPacked) destroyBuffers(xPacked.buffer, xPacked.params);
  }
}

// src/dsyr/dsyr.mjs
async function dsyr(
  device,
  uplo,
  n,
  alpha,
  x,
  incx,
  A,
  lda,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsyr", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  if (alpha === 0) return AIsGpu ? {} : { A };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "dsyr"], "dsyr_main");
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let paramsBuffer = null;
  let xHiPacked = null;
  let xLoPacked = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ASplit = splitDoubleDouble(A);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dsyr-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dsyr-xLo", false);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyr-AHi", true);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyr-ALo", true);
    }
    if (worthPackingDD(incx, n)) {
      xHiPacked = await gatherStridedPass(
        device,
        xHiBuffer,
        n,
        incx,
        "dsyr-xHi-packed",
      );
      xLoPacked = await gatherStridedPass(
        device,
        xLoBuffer,
        n,
        incx,
        "dsyr-xLo-packed",
      );
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: xHiPacked ? 1 : incx, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "dsyr-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiPacked ? xHiPacked.buffer : xHiBuffer,
      xLoPacked ? xLoPacked.buffer : xLoBuffer,
      AHiBuffer,
      ALoBuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...[xHiPacked, xLoPacked].filter(Boolean).map((p) => p.pass),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    readHiBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, AHiBuffer);
    readLoBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ALoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, A);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    for (const p of [xHiPacked, xLoPacked])
      if (p) destroyBuffers(p.buffer, p.params);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/ssyr2/ssyr2.mjs
async function ssyr2(
  device,
  uplo,
  n,
  alpha,
  x,
  incx,
  y,
  incy,
  A,
  lda,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssyr2", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  if (alpha === 0) return AIsGpu ? {} : { A };
  const pipeline = await getPipeline(device, "ssyr2");
  let xBuffer = null;
  let yBuffer = null;
  let ABuffer = null;
  let paramsBuffer = null;
  let xPacked = null;
  let yPacked = null;
  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "ssyr2-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "ssyr2-y", false);
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssyr2-A", true);
    if (incx > 1)
      xPacked = await gatherStridedPass(
        device,
        xBuffer,
        n,
        incx,
        "ssyr2-x-packed",
      );
    if (incy > 1)
      yPacked = await gatherStridedPass(
        device,
        yBuffer,
        n,
        incy,
        "ssyr2-y-packed",
      );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: xPacked ? 1 : incx, type: "u32" },
        { value: yPacked ? 1 : incy, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "ssyr2-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xPacked ? xPacked.buffer : xBuffer,
      yPacked ? yPacked.buffer : yBuffer,
      ABuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...(xPacked ? [xPacked.pass] : []),
      ...(yPacked ? [yPacked.pass] : []),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    const readBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ABuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (xPacked) destroyBuffers(xPacked.buffer, xPacked.params);
    if (yPacked) destroyBuffers(yPacked.buffer, yPacked.params);
  }
}

// src/dsyr2/dsyr2.mjs
async function dsyr2(
  device,
  uplo,
  n,
  alpha,
  x,
  incx,
  y,
  incy,
  A,
  lda,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsyr2", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return AIsGpu ? {} : { A };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  if (alpha === 0) return AIsGpu ? {} : { A };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dsyr2"],
    "dsyr2_main",
  );
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let paramsBuffer = null;
  let xHiPacked = null;
  let xLoPacked = null;
  let yHiPacked = null;
  let yLoPacked = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      const ASplit = splitDoubleDouble(A);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dsyr2-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dsyr2-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dsyr2-yHi", false);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dsyr2-yLo", false);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyr2-AHi", true);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyr2-ALo", true);
    }
    if (worthPackingDD(incx, n)) {
      xHiPacked = await gatherStridedPass(
        device,
        xHiBuffer,
        n,
        incx,
        "dsyr2-xHi-packed",
      );
      xLoPacked = await gatherStridedPass(
        device,
        xLoBuffer,
        n,
        incx,
        "dsyr2-xLo-packed",
      );
    }
    if (worthPackingDD(incy, n)) {
      yHiPacked = await gatherStridedPass(
        device,
        yHiBuffer,
        n,
        incy,
        "dsyr2-yHi-packed",
      );
      yLoPacked = await gatherStridedPass(
        device,
        yLoBuffer,
        n,
        incy,
        "dsyr2-yLo-packed",
      );
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: xHiPacked ? 1 : incx, type: "u32" },
        { value: yHiPacked ? 1 : incy, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "dsyr2-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiPacked ? xHiPacked.buffer : xHiBuffer,
      xLoPacked ? xLoPacked.buffer : xLoBuffer,
      yHiPacked ? yHiPacked.buffer : yHiBuffer,
      yLoPacked ? yLoPacked.buffer : yLoBuffer,
      AHiBuffer,
      ALoBuffer,
      paramsBuffer,
    ]);
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePasses(device, [
      ...[xHiPacked, xLoPacked, yHiPacked, yLoPacked]
        .filter(Boolean)
        .map((p) => p.pass),
      { pipeline, bindGroup, workgroups: wgCount },
    ]);
    readHiBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, AHiBuffer);
    readLoBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ALoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (AIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, A);
    if (gpuTimeMs !== void 0) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    for (const p of [xHiPacked, xLoPacked, yHiPacked, yLoPacked])
      if (p) destroyBuffers(p.buffer, p.params);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dgemv/dgemv.mjs
async function dgemv(
  device,
  trans,
  m,
  n,
  alpha,
  A,
  lda,
  x,
  incx,
  beta,
  y,
  incy,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  requireGpuDevice(device);
  requireSameDevice(device, "dgemv", { A, x, y });
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return yIsGpu ? {} : { y };
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    trans = trans === "no-transpose" ? "transpose" : "no-transpose";
  }
  const isNoTrans = trans === "no-transpose";
  const xLen = isNoTrans ? n : m;
  const yLen = isNoTrans ? m : n;
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (xLen - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given dimensions and incx.",
    );
  if (y.length < (yLen - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given dimensions and incy.",
    );
  if (alpha === 0 && beta === 1) return yIsGpu ? {} : { y };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const batchDeps = ["f64/utils/batch"];
  const shaderName = isNoTrans ? "dgemv_n" : "dgemv_t";
  const entryPoint = isNoTrans ? "dgemv_n_main" : "dgemv_t_main";
  const pipeline = await getPipeline(
    device,
    [...f64Deps, ...batchDeps, shaderName],
    entryPoint,
  );
  const numChunks = isNoTrans ? 1 : Math.ceil(m / SPLITK_CHUNK_ROWS_DD);
  const reducePipeline =
    numChunks > 1
      ? await getPipeline(
          device,
          [...f64Deps, "reduce_partials_f64"],
          "reduce_partials_f64",
        )
      : null;
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
    new Float64Array([beta]),
  );
  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let partialHiBuffer = null;
  let partialLoBuffer = null;
  let reduceParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dgemv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dgemv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dgemv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dgemv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dgemv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dgemv-yLo", true);
    }
    const commonParams = [
      { value: m, type: "u32" },
      { value: n, type: "u32" },
      { value: alphaHi[0], type: "f32" },
      { value: alphaLo[0], type: "f32" },
      { value: betaHi[0], type: "f32" },
      { value: betaLo[0], type: "f32" },
      { value: incx, type: "u32" },
      { value: incy, type: "u32" },
      { value: lda, type: "u32" },
    ];
    let passes;
    if (isNoTrans) {
      paramsBuffer = createParamsBuffer(device, commonParams, "dgemv-params");
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            yHiBuffer,
            yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: Math.min(
            m,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    } else {
      if (numChunks > 1) {
        partialHiBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dgemv-partialsHi",
        );
        partialLoBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dgemv-partialsLo",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: alphaHi[0], type: "f32" },
            { value: alphaLo[0], type: "f32" },
            { value: betaHi[0], type: "f32" },
            { value: betaLo[0], type: "f32" },
          ],
          "dgemv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          ...commonParams,
          { value: SPLITK_CHUNK_ROWS_DD, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "dgemv-t-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            partialHiBuffer ?? yHiBuffer,
            partialLoBuffer ?? yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "dgemv", "x"),
            y: requireWorkgroupCount(device, numChunks, "dgemv", "y"),
          },
        },
      ];
      if (numChunks > 1)
        passes.push({
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [
              partialHiBuffer,
              partialLoBuffer,
              yHiBuffer,
              yLoBuffer,
              reduceParams,
            ],
          ),
          workgroups: Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        });
    }
    const { commandEncoder, ts } = runComputePasses(device, passes);
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, y);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialHiBuffer) destroyBuffers(partialHiBuffer);
    if (partialLoBuffer) destroyBuffers(partialLoBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dsymv/dsymv.mjs
var TILE_KERNEL_MIN_N = 256;
async function dsymv(
  device,
  uplo,
  n,
  alpha,
  A,
  lda,
  x,
  incx,
  beta,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsymv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";
  if (alpha === 0 && beta === 1) return yIsGpu ? {} : { y };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const useTiles = n >= TILE_KERNEL_MIN_N;
  const pipeline = useTiles
    ? await getPipeline(
        device,
        [...f64Deps, "f64/utils/batch", "dsymv_tile"],
        "dsymv_tile_main",
      )
    : await getPipeline(device, [...f64Deps, "dsymv"], "dsymv_main");
  const reducePipeline = useTiles
    ? await getPipeline(
        device,
        [...f64Deps, "reduce_partials_f64"],
        "reduce_partials_f64",
      )
    : null;
  const numBlocks = Math.ceil(n / SSYMV_TILE);
  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
    new Float64Array([beta]),
  );
  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let partialHiBuffer = null;
  let partialLoBuffer = null;
  let reduceParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsymv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsymv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dsymv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dsymv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dsymv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dsymv-yLo", true);
    }
    let passes;
    if (!useTiles) {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
          { value: incx, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
        ],
        "dsymv-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            yHiBuffer,
            yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: n,
        },
      ];
    } else {
      partialHiBuffer = createStorageBuffer(
        device,
        numBlocks * n * 4,
        "dsymv-partialsHi",
      );
      partialLoBuffer = createStorageBuffer(
        device,
        numBlocks * n * 4,
        "dsymv-partialsLo",
      );
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: numBlocks, type: "u32" },
          { value: incx, type: "u32" },
        ],
        "dsymv-tile-params",
      );
      reduceParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: numBlocks, type: "u32" },
          { value: incy, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
        ],
        "dsymv-reduce-params",
      );
      const numTiles = (numBlocks * (numBlocks + 1)) / 2;
      const maxWg = device.limits.maxComputeWorkgroupsPerDimension;
      const tilesX = Math.min(numTiles, maxWg);
      const tilesY = requireWorkgroupCount(
        device,
        Math.ceil(numTiles / tilesX),
        "dsymv",
        "y",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            partialHiBuffer,
            partialLoBuffer,
            paramsBuffer,
          ]),
          workgroups: { x: tilesX, y: tilesY },
        },
        {
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [
              partialHiBuffer,
              partialLoBuffer,
              yHiBuffer,
              yLoBuffer,
              reduceParams,
            ],
          ),
          workgroups: Math.min(Math.ceil(n / WGS), maxWg),
        },
      ];
    }
    const { commandEncoder, ts } = runComputePasses(device, passes);
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, y);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialHiBuffer) destroyBuffers(partialHiBuffer);
    if (partialLoBuffer) destroyBuffers(partialLoBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dtrmv/dtrmv.mjs
var COLUMN_KERNEL_MIN_N = 512;
async function dtrmv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";
  requireGpuDevice(device);
  requireSameDevice(device, "dtrmv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const useColumnKernel = !isNoTrans && n >= COLUMN_KERNEL_MIN_N;
  const numChunks = useColumnKernel ? Math.ceil(n / SPLITK_CHUNK_ROWS_DD) : 1;
  const pipeline = await getPipeline(
    device,
    [...f64Deps, useColumnKernel ? "dtrmv_t" : "dtrmv"],
    useColumnKernel ? "dtrmv_t_main" : "dtrmv_main",
  );
  const reducePipeline =
    numChunks > 1
      ? await getPipeline(
          device,
          [...f64Deps, "reduce_partials_f64"],
          "reduce_partials_f64",
        )
      : null;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let partialHiBuffer = null;
  let partialLoBuffer = null;
  let reduceParams = null;
  let xHiPacked = null;
  let xLoPacked = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrmv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrmv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dtrmv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dtrmv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dtrmv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dtrmv-yLo", true);
    }
    if (worthPackingDD(incx, n)) {
      xHiPacked = await gatherStridedPass(
        device,
        xHiBuffer,
        n,
        incx,
        "dtrmv-xHi-packed",
      );
      xLoPacked = await gatherStridedPass(
        device,
        xLoBuffer,
        n,
        incx,
        "dtrmv-xLo-packed",
      );
    }
    const xHiSrc = xHiPacked ? xHiPacked.buffer : xHiBuffer;
    const xLoSrc = xLoPacked ? xLoPacked.buffer : xLoBuffer;
    const xInc = xHiPacked ? 1 : incx;
    let passes;
    if (useColumnKernel) {
      if (numChunks > 1) {
        partialHiBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dtrmv-partialsHi",
        );
        partialLoBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dtrmv-partialsLo",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: 1, type: "f32" },
            { value: 0, type: "f32" },
            { value: 0, type: "f32" },
            { value: 0, type: "f32" },
          ],
          "dtrmv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: SPLITK_CHUNK_ROWS_DD, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "dtrmv-t-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiSrc,
            xLoSrc,
            partialHiBuffer ?? yHiBuffer,
            partialLoBuffer ?? yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "dtrmv", "x"),
            y: requireWorkgroupCount(device, numChunks, "dtrmv", "y"),
          },
        },
      ];
      if (numChunks > 1)
        passes.push({
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [
              partialHiBuffer,
              partialLoBuffer,
              yHiBuffer,
              yLoBuffer,
              reduceParams,
            ],
          ),
          workgroups: Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        });
    } else {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isNoTrans ? 0 : 1, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
        ],
        "dtrmv-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiSrc,
            xLoSrc,
            yHiBuffer,
            yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: Math.min(
            n,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    }
    if (xHiPacked) passes.unshift(xHiPacked.pass, xLoPacked.pass);
    const { commandEncoder, ts } = runComputePasses(device, passes);
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (yIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, y);
    if (gpuTimeMs !== void 0) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialHiBuffer) destroyBuffers(partialHiBuffer);
    if (partialLoBuffer) destroyBuffers(partialLoBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    for (const p of [xHiPacked, xLoPacked])
      if (p) destroyBuffers(p.buffer, p.params);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dtrsv/dtrsv.mjs
function packBlockParams2(numBlocks, stride, fieldsPerBlock) {
  const data = new ArrayBuffer(numBlocks * stride);
  const view2 = new DataView(data);
  for (let blockIndex = 0; blockIndex < numBlocks; blockIndex++) {
    const fields = fieldsPerBlock(blockIndex);
    const base = blockIndex * stride;
    fields.forEach((value, i) => view2.setUint32(base + i * 4, value, true));
  }
  return data;
}
var STEP_PARAMS_BYTES2 = 48;
var SUBSTITUTION_MAX_BLOCKS2 = 2;
function createSharedParamsBuffer2(device, data, label) {
  const buffer = device.createBuffer({
    label,
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}
async function dtrsv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";
  requireGpuDevice(device);
  requireSameDevice(device, "dtrsv", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return xIsGpu ? {} : { x };
  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";
  const f64Deps = [
    "f64/dekker",
    "f64/utils/add",
    "f64/utils/multiply",
    "f64/utils/divide",
  ];
  const smallPipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_small"],
    "dtrsv_small_main",
  );
  const stepPipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dtrsv_step"],
    "dtrsv_step_main",
  );
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;
  const stride = device.limits.minUniformBufferOffsetAlignment;
  const nonFinite =
    numBlocks > SUBSTITUTION_MAX_BLOCKS2 &&
    !xIsGpu &&
    (hasNonFinite(x, n, incx) ||
      triangleHasNonFinite(A, n, lda, isLower, isUnit));
  const useSubstitution = numBlocks <= SUBSTITUTION_MAX_BLOCKS2 || nonFinite;
  const scatterPipeline = useSubstitution
    ? null
    : await getPipeline(device, "scatter_strided");
  const aRs = isNoTrans ? lda : 1;
  const aCs = isNoTrans ? 1 : lda;
  const stepParamsData = (presolved) =>
    packBlockParams2(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const rangeStart = forward ? blockEnd : 0;
      const rowCount = forward ? n - blockEnd : blockStart;
      return [
        incx,
        lda,
        isNoTrans ? 0 : 1,
        blockIndex,
        blockStart,
        blockEnd,
        rangeStart,
        rowCount,
        presolved,
      ];
    });
  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let AinvHiBuffer = null;
  let AinvLoBuffer = null;
  let solHiBuffer = null;
  let solLoBuffer = null;
  let stepParamsBuffer = null;
  let invertParams = null;
  let scatterParams = null;
  const solveParamsList = [];
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrsv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrsv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dtrsv-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dtrsv-xLo", true);
    }
    solHiBuffer = createStorageBuffer(device, n * 4, "dtrsv-solHi");
    solLoBuffer = createStorageBuffer(device, n * 4, "dtrsv-solLo");
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);
    const stepBindGroup = (AinvHi, AinvLo, blockIndex) =>
      createBindGroup(device, stepPipeline.getBindGroupLayout(0), [
        AHiBuffer,
        ALoBuffer,
        AinvHi,
        AinvLo,
        xHiBuffer,
        xLoBuffer,
        solHiBuffer,
        solLoBuffer,
        {
          buffer: stepParamsBuffer,
          offset: blockIndex * stride,
          size: STEP_PARAMS_BYTES2,
        },
      ]);
    if (useSubstitution) {
      if (numBlocks > 1) {
        stepParamsBuffer = createSharedParamsBuffer2(
          device,
          stepParamsData(1),
          "dtrsv-step-params",
        );
      }
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const blockLen = blockEnd - blockStart;
        const rowCount = forward ? n - blockEnd : blockStart;
        const solveParams = createParamsBuffer(
          device,
          [
            { value: blockLen, type: "u32" },
            { value: blockStart * (aRs + aCs), type: "u32" },
            // A view
            { value: aRs, type: "u32" },
            { value: aCs, type: "u32" },
            { value: blockStart * incx, type: "u32" },
            // x view
            { value: incx, type: "u32" },
            { value: forward ? 0 : 1, type: "u32" },
            { value: isUnit ? 1 : 0, type: "u32" },
            { value: 0, type: "u32" },
            // solve, not invert
            { value: rowCount > 0 ? 1 : 0, type: "u32" },
            // packed copy for the update
            { value: isNoTrans ? 0 : 1, type: "u32" },
            // skipZero: BLAS's column form
          ],
          "dtrsv-solve-params",
        );
        solveParamsList.push(solveParams);
        const solView = (buffer) => ({
          buffer,
          offset: blockStart * 4,
          size: blockLen * 4,
        });
        pass.setPipeline(smallPipeline);
        pass.setBindGroup(
          0,
          createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            solView(solHiBuffer),
            solView(solLoBuffer),
            solveParams,
          ]),
        );
        pass.dispatchWorkgroups(1);
        if (rowCount === 0) continue;
        pass.setPipeline(stepPipeline);
        pass.setBindGroup(0, stepBindGroup(AHiBuffer, ALoBuffer, blockIndex));
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.ceil(rowCount / STRSV_TILE_ROWS),
            "dtrsv",
          ),
        );
      }
    } else {
      AinvHiBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "dtrsv-AinvHi",
      );
      AinvLoBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "dtrsv-AinvLo",
      );
      stepParamsBuffer = createSharedParamsBuffer2(
        device,
        stepParamsData(0),
        "dtrsv-step-params",
      );
      invertParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: 0, type: "u32" },
          { value: aRs, type: "u32" },
          { value: aCs, type: "u32" },
          { value: 0, type: "u32" },
          { value: 1, type: "u32" },
          { value: forward ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: 1, type: "u32" },
          // invert
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          // skipZero: solve mode only
        ],
        "dtrsv-invert-params",
      );
      scatterParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: incx, type: "u32" },
        ],
        "dtrsv-scatter-params",
      );
      pass.setPipeline(smallPipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
          AHiBuffer,
          ALoBuffer,
          AinvHiBuffer,
          AinvLoBuffer,
          solHiBuffer,
          // unused when inverting
          solLoBuffer,
          invertParams,
        ]),
      );
      pass.dispatchWorkgroups(
        BLOCK_SIZE / 4,
        requireWorkgroupCount(device, numBlocks, "dtrsv", "y"),
      );
      pass.setPipeline(stepPipeline);
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const rowCount = forward ? n - blockEnd : blockStart;
        pass.setBindGroup(
          0,
          stepBindGroup(AinvHiBuffer, AinvLoBuffer, blockIndex),
        );
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.max(1, Math.ceil(rowCount / STRSV_TILE_ROWS)),
            "dtrsv",
          ),
        );
      }
      pass.setPipeline(scatterPipeline);
      for (const [src, dst] of [
        [solHiBuffer, xHiBuffer],
        [solLoBuffer, xLoBuffer],
      ]) {
        pass.setBindGroup(
          0,
          createBindGroup(device, scatterPipeline.getBindGroupLayout(0), [
            src,
            dst,
            scatterParams,
          ]),
        );
        pass.dispatchWorkgroups(
          Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        );
      }
    }
    pass.end();
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    readLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (xIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, x);
    if (gpuTimeMs !== void 0) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (AinvHiBuffer) destroyBuffers(AinvHiBuffer);
    if (AinvLoBuffer) destroyBuffers(AinvLoBuffer);
    if (solHiBuffer) destroyBuffers(solHiBuffer);
    if (solLoBuffer) destroyBuffers(solLoBuffer);
    if (stepParamsBuffer) destroyBuffers(stepParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
    if (scatterParams) destroyBuffers(scatterParams);
    destroyBuffers(solveParamsList);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dgemm/dgemm.mjs
async function dgemm(
  device,
  transA,
  transB,
  m,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dgemm", { A, B, C });
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (m < 0 || n < 0 || k < 0)
    throw new Error("m, n, and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : m;
  const aCols = effLayoutA === "column-major" ? m : k;
  const aOuter = transA === "no-transpose" ? aRows : aCols;
  const aInner = transA === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutB === "column-major")
    transB = transB === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutC === "column-major") {
    [A, B] = [B, A];
    [AIsGpu, BIsGpu] = [BIsGpu, AIsGpu];
    [lda, ldb] = [ldb, lda];
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    [m, n] = [n, m];
  }
  if ((alpha === 0 || k === 0) && beta === 1) return CIsGpu ? {} : { C };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dgemm-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dgemm-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dgemm-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dgemm-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dgemm-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dgemm-CLo", true);
    }
    const aNot = transA === "no-transpose";
    const bNot = transB === "no-transpose";
    const useVecA = aNot && vec4Usable(AHiBuffer, lda, m, k);
    const useVecB = vec4Usable(BHiBuffer, ldb, bNot ? k : n, bNot ? n : k);
    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: m, type: "u32" },
        { value: n, type: "u32" },
        { value: k, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: lda, type: "u32" },
        { value: ldb, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transA === "transpose" ? 1 : 0, type: "u32" },
        { value: transB === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" },
        // uplo: full C (dgemmtr passes 1/2)
      ],
      "dgemm-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      AHiBuffer,
      vec4ViewBinding(device, AHiBuffer),
      ALoBuffer,
      BHiBuffer,
      vec4ViewBinding(device, BHiBuffer),
      BLoBuffer,
      CHiBuffer,
      CLoBuffer,
      paramsBuffer,
    ]);
    const wgCount = {
      x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dgemm", "x"),
      y: requireWorkgroupCount(device, Math.ceil(m / BM_SMALL), "dgemm", "y"),
    };
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dgemmtr/dgemmtr.mjs
async function dgemmtr(
  device,
  uplo,
  transA,
  transB,
  m,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dgemmtr", { A, B, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (m < 0 || n < 0 || k < 0)
    throw new Error("m, n, and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : m;
  const aCols = effLayoutA === "column-major" ? m : k;
  const aOuter = transA === "no-transpose" ? aRows : aCols;
  const aInner = transA === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutB === "column-major")
    transB = transB === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutC === "column-major") {
    [A, B] = [B, A];
    [AIsGpu, BIsGpu] = [BIsGpu, AIsGpu];
    [lda, ldb] = [ldb, lda];
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    [m, n] = [n, m];
    uplo = uplo === "lower" ? "upper" : "lower";
  }
  if ((alpha === 0 || k === 0) && beta === 1) return CIsGpu ? {} : { C };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dgemmtr-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dgemmtr-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dgemmtr-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dgemmtr-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dgemmtr-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dgemmtr-CLo", true);
    }
    const aNot = transA === "no-transpose";
    const bNot = transB === "no-transpose";
    const useVecA = aNot && vec4Usable(AHiBuffer, lda, m, k);
    const useVecB = vec4Usable(BHiBuffer, ldb, bNot ? k : n, bNot ? n : k);
    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: m, type: "u32" },
        { value: n, type: "u32" },
        { value: k, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: lda, type: "u32" },
        { value: ldb, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transA === "transpose" ? 1 : 0, type: "u32" },
        { value: transB === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: uplo === "lower" ? 1 : 2, type: "u32" },
        // the kernels' mask: 1 = lower, 2 = upper
      ],
      "dgemmtr-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      AHiBuffer,
      vec4ViewBinding(device, AHiBuffer),
      ALoBuffer,
      BHiBuffer,
      vec4ViewBinding(device, BHiBuffer),
      BLoBuffer,
      CHiBuffer,
      CLoBuffer,
      paramsBuffer,
    ]);
    const wgCount = {
      x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dgemmtr", "x"),
      y: requireWorkgroupCount(device, Math.ceil(m / BM_SMALL), "dgemmtr", "y"),
    };
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dsyrk/dsyrk.mjs
async function dsyrk(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsyrk", { A, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if (AIsGpu && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
  if (CIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldc <= 0) throw new Error("lda and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n)
      throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  let transA = trans;
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  let transB = transA === "no-transpose" ? "transpose" : "no-transpose";
  let uploEff = uplo;
  if (effLayoutC === "column-major") {
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    uploEff = uploEff === "lower" ? "upper" : "lower";
  }
  if ((alpha === 0 || k === 0) && beta === 1) return CIsGpu ? {} : { C };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
      BHiBuffer = createStorageBuffer(
        device,
        AHiBuffer.size,
        "dsyrk-BHi",
        GPUBufferUsage.COPY_DST,
      );
      BLoBuffer = createStorageBuffer(
        device,
        ALoBuffer.size,
        "dsyrk-BLo",
        GPUBufferUsage.COPY_DST,
      );
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyrk-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyrk-ALo", false);
      BHiBuffer = uploadBuffer(device, ASplit.hi, "dsyrk-BHi", false);
      BLoBuffer = uploadBuffer(device, ASplit.lo, "dsyrk-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsyrk-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsyrk-CLo", true);
    }
    const aNot = transA === "no-transpose";
    const bNot = transB === "no-transpose";
    const useVecA = aNot && vec4Usable(AHiBuffer, lda, n, k);
    const useVecB = vec4Usable(BHiBuffer, lda, bNot ? k : n, bNot ? n : k);
    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        // gemmtr's m
        { value: n, type: "u32" },
        // gemmtr's n
        { value: k, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: lda, type: "u32" },
        // gemmtr's lda
        { value: lda, type: "u32" },
        // gemmtr's ldb — B := A, same lda
        { value: ldc, type: "u32" },
        { value: transA === "transpose" ? 1 : 0, type: "u32" },
        { value: transB === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: uploEff === "lower" ? 1 : 2, type: "u32" },
        // the kernels' mask: 1 = lower, 2 = upper
      ],
      "dsyrk-params",
    );
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      AHiBuffer,
      vec4ViewBinding(device, AHiBuffer),
      ALoBuffer,
      BHiBuffer,
      vec4ViewBinding(device, BHiBuffer),
      BLoBuffer,
      CHiBuffer,
      CLoBuffer,
      paramsBuffer,
    ]);
    const wgCount = {
      x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dsyrk", "x"),
      y: requireWorkgroupCount(device, Math.ceil(n / BM_SMALL), "dsyrk", "y"),
    };
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    if (AIsGpu) {
      commandEncoder.copyBufferToBuffer(
        AHiBuffer,
        0,
        BHiBuffer,
        0,
        AHiBuffer.size,
      );
      commandEncoder.copyBufferToBuffer(
        ALoBuffer,
        0,
        BLoBuffer,
        0,
        ALoBuffer.size,
      );
    }
    encodePass(commandEncoder, pipeline, bindGroup, wgCount, passDescriptor);
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (BHiBuffer) destroyBuffers(BHiBuffer);
    if (BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dsyr2k/dsyr2k.mjs
async function dsyr2k(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsyr2k", { A, B, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? k : n;
  const bCols = effLayoutB === "column-major" ? n : k;
  const bOuter = trans === "no-transpose" ? bRows : bCols;
  const bInner = trans === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and trans.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n)
      throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  const effTransA = effLayoutA === "column-major" ? flip(trans) : trans;
  const effTransB = effLayoutB === "column-major" ? flip(trans) : trans;
  const uploEff =
    effLayoutC === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;
  function passShape(transOwnX, X, transOwnY, Y) {
    const transX = transOwnX;
    const transY = flip(transOwnY);
    if (effLayoutC !== "column-major") return { transX, X, transY, Y };
    return { transX: flip(transY), X: Y, transY: flip(transX), Y: X };
  }
  if ((alpha === 0 || k === 0) && beta === 1) return CIsGpu ? {} : { C };
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  const wgCount = {
    x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dsyr2k", "x"),
    y: requireWorkgroupCount(device, Math.ceil(n / BM_SMALL), "dsyr2k", "y"),
  };
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer1 = null;
  let paramsBuffer2 = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyr2k-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyr2k-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dsyr2k-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dsyr2k-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsyr2k-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsyr2k-CLo", true);
    }
    const opA = { hi: AHiBuffer, lo: ALoBuffer, ld: lda };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const pass1 = passShape(effTransA, opA, effTransB, opB);
    const pass2 = passShape(effTransB, opB, effTransA, opA);
    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const makeParams = (p, betaVal, label) => {
      const xNot = p.transX === "no-transpose";
      const yNot = p.transY === "no-transpose";
      const useVecX = xNot && vec4Usable(p.X.hi, p.X.ld, n, k);
      const useVecY = vec4Usable(p.Y.hi, p.Y.ld, yNot ? k : n, yNot ? n : k);
      const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
        new Float64Array([betaVal]),
      );
      return createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          // gemmtr's m
          { value: n, type: "u32" },
          // gemmtr's n
          { value: k, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
          { value: p.X.ld, type: "u32" },
          { value: p.Y.ld, type: "u32" },
          { value: ldc, type: "u32" },
          { value: p.transX === "transpose" ? 1 : 0, type: "u32" },
          { value: p.transY === "transpose" ? 1 : 0, type: "u32" },
          { value: useVecX ? 1 : 0, type: "u32" },
          { value: useVecY ? 1 : 0, type: "u32" },
          { value: uploEff === "lower" ? 1 : 2, type: "u32" },
          // the kernels' mask: 1 = lower, 2 = upper
        ],
        label,
      );
    };
    paramsBuffer1 = makeParams(pass1, beta, "dsyr2k-params1");
    paramsBuffer2 = makeParams(pass2, 1, "dsyr2k-params2");
    const makeBindGroup = (p, paramsBuffer) =>
      createBindGroup(device, pipeline.getBindGroupLayout(0), [
        p.X.hi,
        vec4ViewBinding(device, p.X.hi),
        p.X.lo,
        p.Y.hi,
        vec4ViewBinding(device, p.Y.hi),
        p.Y.lo,
        CHiBuffer,
        CLoBuffer,
        paramsBuffer,
      ]);
    const bindGroup1 = makeBindGroup(pass1, paramsBuffer1);
    const bindGroup2 = makeBindGroup(pass2, paramsBuffer2);
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const desc1 = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const desc2 = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
    encodePass(commandEncoder, pipeline, bindGroup1, wgCount, desc1);
    encodePass(commandEncoder, pipeline, bindGroup2, wgCount, desc2);
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer1) destroyBuffers(paramsBuffer1);
    if (paramsBuffer2) destroyBuffers(paramsBuffer2);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dsymm/dsymm.mjs
async function dsymm(
  device,
  side,
  uplo,
  m,
  n,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "dsymm", { A, B, C });
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
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
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  if (alpha === 0 && beta === 1) return CIsGpu ? {} : { C };
  const uploEffA =
    effLayoutA === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;
  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose";
  let mg = m,
    ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right";
  if (effLayoutC === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const gemmPipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  const symPipeline = await getPipeline(device, "symmetrize");
  const gemmWgCount = {
    x: requireWorkgroupCount(device, Math.ceil(ng / BN_SMALL), "dsymm", "x"),
    y: requireWorkgroupCount(device, Math.ceil(mg / BM_SMALL), "dsymm", "y"),
  };
  const symWgCount = {
    x: Math.ceil(aOrder / TILE_WG_2D),
    y: Math.ceil(aOrder / TILE_WG_2D),
  };
  const ldDense = aOrder;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let AdenseHiBuffer = null;
  let AdenseLoBuffer = null;
  let symParams = null;
  let gemmParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;
  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsymm-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsymm-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dsymm-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dsymm-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsymm-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsymm-CLo", true);
    }
    AdenseHiBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dsymm-AdenseHi",
    );
    AdenseLoBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dsymm-AdenseLo",
    );
    symParams = createParamsBuffer(
      device,
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
      ],
      "dsymm-sym-params",
    );
    const symLayout = symPipeline.getBindGroupLayout(0);
    const symHiBindGroup = createBindGroup(device, symLayout, [
      AHiBuffer,
      AdenseHiBuffer,
      symParams,
    ]);
    const symLoBindGroup = createBindGroup(device, symLayout, [
      ALoBuffer,
      AdenseLoBuffer,
      symParams,
    ]);
    const dense = { hi: AdenseHiBuffer, lo: AdenseLoBuffer, ld: ldDense };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const X = swapXY ? opB : dense;
    const Y = swapXY ? dense : opB;
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecX = xNot && vec4Usable(X.hi, X.ld, mg, kg);
    const useVecY = vec4Usable(Y.hi, Y.ld, yNot ? kg : ng, yNot ? ng : kg);
    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );
    gemmParams = createParamsBuffer(
      device,
      [
        { value: mg, type: "u32" },
        { value: ng, type: "u32" },
        { value: kg, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: X.ld, type: "u32" },
        { value: Y.ld, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecX ? 1 : 0, type: "u32" },
        { value: useVecY ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" },
        // uplo: full C
      ],
      "dsymm-gemm-params",
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
        CHiBuffer,
        CLoBuffer,
        gemmParams,
      ],
    );
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const symDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
    encodePass(
      commandEncoder,
      symPipeline,
      symHiBindGroup,
      symWgCount,
      symDesc,
    );
    encodePass(commandEncoder, symPipeline, symLoBindGroup, symWgCount);
    encodePass(
      commandEncoder,
      gemmPipeline,
      gemmBindGroup,
      gemmWgCount,
      gemmDesc,
    );
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (AdenseHiBuffer) destroyBuffers(AdenseHiBuffer);
    if (AdenseLoBuffer) destroyBuffers(AdenseLoBuffer);
    if (symParams) destroyBuffers(symParams);
    if (gemmParams) destroyBuffers(gemmParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}

// src/dtrmm/dtrmm.mjs
async function dtrmm(
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
  const transDense = "no-transpose";
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
  const ldDense = aOrder;
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
  let outAdopted = false;
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
    const dense = { hi: AdenseHiBuffer, lo: AdenseLoBuffer, ld: ldDense };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const X = swapXY ? opB : dense;
    const Y = swapXY ? dense : opB;
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecX = xNot && vec4Usable(X.hi, X.ld, mg, kg);
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
        { value: 0, type: "f32" },
        // beta — dtrmm has no C accumulation term
        { value: 0, type: "f32" },
        { value: X.ld, type: "u32" },
        { value: Y.ld, type: "u32" },
        { value: ldb, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecX ? 1 : 0, type: "u32" },
        { value: useVecY ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" },
        // uplo: full C
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
    const triDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
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
      destroyBuffers(B._buf, B._loBuf);
      B._buf = outHiBuffer;
      B._loBuf = outLoBuffer;
      outAdopted = true;
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDoubleExact(hi, lo, B);
    if (gpuTimeMs !== void 0) return { B: result, gpuTimeMs };
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

// src/sgemm/sgemm.mjs
async function sgemm(
  device,
  transA,
  transB,
  m,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "sgemm", { A, B, C });
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
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
  if (m < 0 || n < 0 || k < 0)
    throw new Error("m, n, and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : m;
  const aCols = effLayoutA === "column-major" ? m : k;
  const aOuter = transA === "no-transpose" ? aRows : aCols;
  const aInner = transA === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutB === "column-major")
    transB = transB === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutC === "column-major") {
    [A, B] = [B, A];
    [AIsGpu, BIsGpu] = [BIsGpu, AIsGpu];
    [lda, ldb] = [ldb, lda];
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    [m, n] = [n, m];
  }
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(m / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "sgemm-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "sgemm-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "sgemm-C", true);
  const aNot = transA === "no-transpose";
  const bNot = transB === "no-transpose";
  const useVecA = vec4Usable(ABuffer, lda, aNot ? m : k, aNot ? k : m);
  const useVecB = vec4Usable(BBuffer, ldb, bNot ? k : n, bNot ? n : k);
  const paramsBuffer = createParamsBuffer(
    device,
    [
      { value: m, type: "u32" },
      { value: n, type: "u32" },
      { value: k, type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta, type: "f32" },
      { value: lda, type: "u32" },
      { value: ldb, type: "u32" },
      { value: ldc, type: "u32" },
      { value: transA === "transpose" ? 1 : 0, type: "u32" },
      { value: transB === "transpose" ? 1 : 0, type: "u32" },
      { value: useVecA ? 1 : 0, type: "u32" },
      { value: useVecB ? 1 : 0, type: "u32" },
      { value: 0, type: "u32" },
      // uplo: full C (gemmtr masks are for sgemmtr/ssyrk/ssyr2k)
      { value: 0, type: "u32" },
      // offA/offB/offC: whole buffers
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      // kTri: dense operands
    ],
    "sgemm-params",
  );
  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      ABuffer,
      vec4ViewBinding(device, ABuffer),
      BBuffer,
      vec4ViewBinding(device, BBuffer),
      CBuffer,
      paramsBuffer,
    ]);
    const wgCount = useLargeTile
      ? {
          x: requireWorkgroupCount(device, largeWgX, "sgemm", "x"),
          y: requireWorkgroupCount(device, largeWgY, "sgemm", "y"),
        }
      : {
          x: requireWorkgroupCount(
            device,
            Math.ceil(n / BN_SMALL),
            "sgemm",
            "x",
          ),
          y: requireWorkgroupCount(
            device,
            Math.ceil(m / BM_SMALL),
            "sgemm",
            "y",
          ),
        };
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
    const readBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(paramsBuffer);
  }
}

// src/sgemmtr/sgemmtr.mjs
async function sgemmtr(
  device,
  uplo,
  transA,
  transB,
  m,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "sgemmtr", { A, B, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
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
  if (m < 0 || n < 0 || k < 0)
    throw new Error("m, n, and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : m;
  const aCols = effLayoutA === "column-major" ? m : k;
  const aOuter = transA === "no-transpose" ? aRows : aCols;
  const aInner = transA === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutB === "column-major")
    transB = transB === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutC === "column-major") {
    [A, B] = [B, A];
    [AIsGpu, BIsGpu] = [BIsGpu, AIsGpu];
    [lda, ldb] = [ldb, lda];
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    [m, n] = [n, m];
    uplo = uplo === "lower" ? "upper" : "lower";
  }
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(m / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "sgemmtr-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "sgemmtr-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "sgemmtr-C", true);
  const aNot = transA === "no-transpose";
  const bNot = transB === "no-transpose";
  const useVecA = vec4Usable(ABuffer, lda, aNot ? m : k, aNot ? k : m);
  const useVecB = vec4Usable(BBuffer, ldb, bNot ? k : n, bNot ? n : k);
  const paramsBuffer = createParamsBuffer(
    device,
    [
      { value: m, type: "u32" },
      { value: n, type: "u32" },
      { value: k, type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta, type: "f32" },
      { value: lda, type: "u32" },
      { value: ldb, type: "u32" },
      { value: ldc, type: "u32" },
      { value: transA === "transpose" ? 1 : 0, type: "u32" },
      { value: transB === "transpose" ? 1 : 0, type: "u32" },
      { value: useVecA ? 1 : 0, type: "u32" },
      { value: useVecB ? 1 : 0, type: "u32" },
      { value: uplo === "lower" ? 1 : 2, type: "u32" },
      // sgemm's mask: 1 = lower, 2 = upper
      { value: 0, type: "u32" },
      // offA/offB/offC: whole buffers
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      // kTri: dense operands
    ],
    "sgemmtr-params",
  );
  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      ABuffer,
      vec4ViewBinding(device, ABuffer),
      BBuffer,
      vec4ViewBinding(device, BBuffer),
      CBuffer,
      paramsBuffer,
    ]);
    const wgCount = useLargeTile
      ? {
          x: requireWorkgroupCount(device, largeWgX, "sgemmtr", "x"),
          y: requireWorkgroupCount(device, largeWgY, "sgemmtr", "y"),
        }
      : {
          x: requireWorkgroupCount(
            device,
            Math.ceil(n / BN_SMALL),
            "sgemmtr",
            "x",
          ),
          y: requireWorkgroupCount(
            device,
            Math.ceil(m / BM_SMALL),
            "sgemmtr",
            "y",
          ),
        };
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
    const readBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(paramsBuffer);
  }
}

// src/ssyrk/ssyrk.mjs
async function ssyrk(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssyrk", { A, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float32Array))
    throw new Error("C must be a Float32Array or GpuMatrix.");
  if (AIsGpu && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
  if (CIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldc <= 0) throw new Error("lda and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n)
      throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  let transA = trans;
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  let transB = transA === "no-transpose" ? "transpose" : "no-transpose";
  let uploEff = uplo;
  if (effLayoutC === "column-major") {
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    uploEff = uploEff === "lower" ? "upper" : "lower";
  }
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(n / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssyrk-A", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "ssyrk-C", true);
  const BBuffer = AIsGpu
    ? createStorageBuffer(
        device,
        ABuffer.size,
        "ssyrk-B",
        GPUBufferUsage.COPY_DST,
      )
    : uploadBuffer(device, A, "ssyrk-B", false);
  const aNot = transA === "no-transpose";
  const bNot = transB === "no-transpose";
  const useVecA = vec4Usable(ABuffer, lda, aNot ? n : k, aNot ? k : n);
  const useVecB = vec4Usable(BBuffer, lda, bNot ? k : n, bNot ? n : k);
  const paramsBuffer = createParamsBuffer(
    device,
    [
      { value: n, type: "u32" },
      // gemmtr's m
      { value: n, type: "u32" },
      // gemmtr's n
      { value: k, type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta, type: "f32" },
      { value: lda, type: "u32" },
      // gemmtr's lda
      { value: lda, type: "u32" },
      // gemmtr's ldb — B := A, same lda
      { value: ldc, type: "u32" },
      { value: transA === "transpose" ? 1 : 0, type: "u32" },
      { value: transB === "transpose" ? 1 : 0, type: "u32" },
      { value: useVecA ? 1 : 0, type: "u32" },
      { value: useVecB ? 1 : 0, type: "u32" },
      { value: uploEff === "lower" ? 1 : 2, type: "u32" },
      // sgemm's mask: 1 = lower, 2 = upper
      { value: 0, type: "u32" },
      // offA/offB/offC: whole buffers
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      { value: 0, type: "u32" },
      // kTri: dense operands
    ],
    "ssyrk-params",
  );
  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      ABuffer,
      vec4ViewBinding(device, ABuffer),
      BBuffer,
      vec4ViewBinding(device, BBuffer),
      CBuffer,
      paramsBuffer,
    ]);
    const wgCount = useLargeTile
      ? {
          x: requireWorkgroupCount(device, largeWgX, "ssyrk", "x"),
          y: requireWorkgroupCount(device, largeWgY, "ssyrk", "y"),
        }
      : {
          x: requireWorkgroupCount(
            device,
            Math.ceil(n / BN_SMALL),
            "ssyrk",
            "x",
          ),
          y: requireWorkgroupCount(
            device,
            Math.ceil(n / BM_SMALL),
            "ssyrk",
            "y",
          ),
        };
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    if (AIsGpu)
      commandEncoder.copyBufferToBuffer(ABuffer, 0, BBuffer, 0, ABuffer.size);
    encodePass(commandEncoder, pipeline, bindGroup, wgCount, passDescriptor);
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(paramsBuffer);
  }
}

// src/ssyr2k/ssyr2k.mjs
async function ssyr2k(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssyr2k", { A, B, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
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
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }
  const bRows = effLayoutB === "column-major" ? k : n;
  const bCols = effLayoutB === "column-major" ? n : k;
  const bOuter = trans === "no-transpose" ? bRows : bCols;
  const bInner = trans === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and trans.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n)
      throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  let effTransA = trans;
  if (effLayoutA === "column-major")
    effTransA = effTransA === "no-transpose" ? "transpose" : "no-transpose";
  let effTransB = trans;
  if (effLayoutB === "column-major")
    effTransB = effTransB === "no-transpose" ? "transpose" : "no-transpose";
  const uploEff =
    effLayoutC === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  function passShape(transOwnX, X, ldX, transOwnY, Y, ldY) {
    const transX = transOwnX;
    const transY = flip(transOwnY);
    if (effLayoutC !== "column-major")
      return { transX, X, ldX, transY, Y, ldY };
    return {
      transX: flip(transY),
      X: Y,
      ldX: ldY,
      transY: flip(transX),
      Y: X,
      ldY: ldX,
    };
  }
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(n / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const pipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const wgCount = useLargeTile
    ? {
        x: requireWorkgroupCount(device, largeWgX, "ssyr2k", "x"),
        y: requireWorkgroupCount(device, largeWgY, "ssyr2k", "y"),
      }
    : {
        x: requireWorkgroupCount(
          device,
          Math.ceil(n / BN_SMALL),
          "ssyr2k",
          "x",
        ),
        y: requireWorkgroupCount(
          device,
          Math.ceil(n / BM_SMALL),
          "ssyr2k",
          "y",
        ),
      };
  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssyr2k-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "ssyr2k-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "ssyr2k-C", true);
  let paramsBuffer1 = null,
    paramsBuffer2 = null;
  try {
    const pass1 = passShape(effTransA, ABuffer, lda, effTransB, BBuffer, ldb);
    const pass2 = passShape(effTransB, BBuffer, ldb, effTransA, ABuffer, lda);
    const vecFlags = (p) => {
      const xNot = p.transX === "no-transpose";
      const yNot = p.transY === "no-transpose";
      return [
        vec4Usable(p.X, p.ldX, xNot ? n : k, xNot ? k : n),
        vec4Usable(p.Y, p.ldY, yNot ? k : n, yNot ? n : k),
      ];
    };
    const makeParams = (p, betaVal) =>
      createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: n, type: "u32" },
          { value: k, type: "u32" },
          { value: alpha, type: "f32" },
          { value: betaVal, type: "f32" },
          { value: p.ldX, type: "u32" },
          { value: p.ldY, type: "u32" },
          { value: ldc, type: "u32" },
          { value: p.transX === "transpose" ? 1 : 0, type: "u32" },
          { value: p.transY === "transpose" ? 1 : 0, type: "u32" },
          { value: vecFlags(p)[0] ? 1 : 0, type: "u32" },
          { value: vecFlags(p)[1] ? 1 : 0, type: "u32" },
          { value: uploEff === "lower" ? 1 : 2, type: "u32" },
          // sgemm's mask: 1 = lower, 2 = upper
          { value: 0, type: "u32" },
          // offA/offB/offC: whole buffers
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          { value: 0, type: "u32" },
          // kTri: dense operands
        ],
        "ssyr2k-params",
      );
    paramsBuffer1 = makeParams(pass1, beta);
    paramsBuffer2 = makeParams(pass2, 1);
    const bindGroup1 = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      pass1.X,
      vec4ViewBinding(device, pass1.X),
      pass1.Y,
      vec4ViewBinding(device, pass1.Y),
      CBuffer,
      paramsBuffer1,
    ]);
    const bindGroup2 = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      pass2.X,
      vec4ViewBinding(device, pass2.X),
      pass2.Y,
      vec4ViewBinding(device, pass2.Y),
      CBuffer,
      paramsBuffer2,
    ]);
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const desc1 = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const desc2 = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
    encodePass(commandEncoder, pipeline, bindGroup1, wgCount, desc1);
    encodePass(commandEncoder, pipeline, bindGroup2, wgCount, desc2);
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    if (paramsBuffer1) destroyBuffers(paramsBuffer1);
    if (paramsBuffer2) destroyBuffers(paramsBuffer2);
  }
}

// src/ssymm/ssymm.mjs
async function ssymm(
  device,
  side,
  uplo,
  m,
  n,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;
  requireGpuDevice(device);
  requireSameDevice(device, "ssymm", { A, B, C });
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
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
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }
  const uploEffA =
    effLayoutA === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;
  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose";
  let mg = m,
    ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right";
  if (effLayoutC === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }
  const ldDense = aOrder;
  const largeWgX = Math.ceil(ng / BN_LARGE);
  const largeWgY = Math.ceil(mg / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const gemmPipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const symPipeline = await getPipeline(device, "symmetrize");
  const gemmWgCount = useLargeTile
    ? {
        x: requireWorkgroupCount(device, largeWgX, "ssymm", "x"),
        y: requireWorkgroupCount(device, largeWgY, "ssymm", "y"),
      }
    : {
        x: requireWorkgroupCount(
          device,
          Math.ceil(ng / BN_SMALL),
          "ssymm",
          "x",
        ),
        y: requireWorkgroupCount(
          device,
          Math.ceil(mg / BM_SMALL),
          "ssymm",
          "y",
        ),
      };
  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssymm-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "ssymm-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "ssymm-C", true);
  const AdenseBuffer = createStorageBuffer(
    device,
    aOrder * ldDense * 4,
    "ssymm-Adense",
  );
  let symParams = null,
    gemmParams = null;
  try {
    symParams = createParamsBuffer(
      device,
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
      ],
      "ssymm-sym-params",
    );
    const symBindGroup = createBindGroup(
      device,
      symPipeline.getBindGroupLayout(0),
      [ABuffer, AdenseBuffer, symParams],
    );
    const XBuffer = swapXY ? BBuffer : AdenseBuffer;
    const ldX = swapXY ? ldb : ldDense;
    const YBuffer = swapXY ? AdenseBuffer : BBuffer;
    const ldY = swapXY ? ldDense : ldb;
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecA = vec4Usable(XBuffer, ldX, xNot ? mg : kg, xNot ? kg : mg);
    const useVecB = vec4Usable(YBuffer, ldY, yNot ? kg : ng, yNot ? ng : kg);
    gemmParams = createParamsBuffer(
      device,
      [
        { value: mg, type: "u32" },
        { value: ng, type: "u32" },
        { value: kg, type: "u32" },
        { value: alpha, type: "f32" },
        { value: beta, type: "f32" },
        { value: ldX, type: "u32" },
        { value: ldY, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" },
        // uplo: full C
        { value: 0, type: "u32" },
        // offA/offB/offC: whole buffers
        { value: 0, type: "u32" },
        { value: 0, type: "u32" },
        { value: 0, type: "u32" },
        // kTri: Adense is fully dense
      ],
      "ssymm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(
      device,
      gemmPipeline.getBindGroupLayout(0),
      [
        XBuffer,
        vec4ViewBinding(device, XBuffer),
        YBuffer,
        vec4ViewBinding(device, YBuffer),
        CBuffer,
        gemmParams,
      ],
    );
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const symDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
    encodePass(
      commandEncoder,
      symPipeline,
      symBindGroup,
      { x: Math.ceil(aOrder / TILE_WG_2D), y: Math.ceil(aOrder / TILE_WG_2D) },
      symDesc,
    );
    encodePass(
      commandEncoder,
      gemmPipeline,
      gemmBindGroup,
      gemmWgCount,
      gemmDesc,
    );
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (CIsGpu) {
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { C: result, gpuTimeMs };
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

// src/strmm/strmm.mjs
async function strmm(
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
  requireSameDevice(device, "strmm", { A, B });
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
  const transDense = "no-transpose";
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
  const ldDense = aOrder;
  const largeWgX = Math.ceil(ng / BN_LARGE);
  const largeWgY = Math.ceil(mg / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const gemmPipeline = await getPipeline(
    device,
    useLargeTile ? "sgemm_large" : "sgemm_small",
  );
  const triPipeline = await getPipeline(device, "triangularize");
  const gemmWgCount = useLargeTile
    ? {
        x: requireWorkgroupCount(device, largeWgX, "strmm", "x"),
        y: requireWorkgroupCount(device, largeWgY, "strmm", "y"),
      }
    : {
        x: requireWorkgroupCount(
          device,
          Math.ceil(ng / BN_SMALL),
          "strmm",
          "x",
        ),
        y: requireWorkgroupCount(
          device,
          Math.ceil(mg / BM_SMALL),
          "strmm",
          "y",
        ),
      };
  let ABuffer = null,
    BBuffer = null;
  let AdenseBuffer = null,
    outBuffer = null;
  let triParams = null,
    gemmParams = null;
  let outBufferAdopted = false;
  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "strmm-A", false);
    BBuffer = BIsGpu ? B._buf : uploadBuffer(device, B, "strmm-B", true);
    AdenseBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "strmm-Adense",
    );
    outBuffer = createStorageBuffer(
      device,
      bOuter * ldb * 4,
      "strmm-out",
      GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    );
    triParams = createParamsBuffer(
      device,
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
        { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
        { value: isUnit ? 1 : 0, type: "u32" },
      ],
      "strmm-tri-params",
    );
    const triBindGroup = createBindGroup(
      device,
      triPipeline.getBindGroupLayout(0),
      [ABuffer, AdenseBuffer, triParams],
    );
    const XBuffer = swapXY ? BBuffer : AdenseBuffer;
    const ldX = swapXY ? ldb : ldDense;
    const YBuffer = swapXY ? AdenseBuffer : BBuffer;
    const ldY = swapXY ? ldDense : ldb;
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecA = vec4Usable(XBuffer, ldX, xNot ? mg : kg, xNot ? kg : mg);
    const useVecB = vec4Usable(YBuffer, ldY, yNot ? kg : ng, yNot ? ng : kg);
    const opLower = (transEffA === "no-transpose") === (uploEffA === "lower");
    const denseIsX = !swapXY;
    const denseLower = opLower !== (denseIsX ? !xNot : !yNot);
    const kTri = denseIsX ? (denseLower ? 1 : 2) : denseLower ? 3 : 4;
    gemmParams = createParamsBuffer(
      device,
      [
        { value: mg, type: "u32" },
        { value: ng, type: "u32" },
        { value: kg, type: "u32" },
        { value: alpha, type: "f32" },
        { value: 0, type: "f32" },
        // beta — strmm has no C accumulation term
        { value: ldX, type: "u32" },
        { value: ldY, type: "u32" },
        { value: ldb, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" },
        // uplo: full C
        { value: 0, type: "u32" },
        // offA/offB/offC: whole buffers
        { value: 0, type: "u32" },
        { value: 0, type: "u32" },
        { value: kTri, type: "u32" },
        // k band of the triangular operand
      ],
      "strmm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(
      device,
      gemmPipeline.getBindGroupLayout(0),
      [
        XBuffer,
        vec4ViewBinding(device, XBuffer),
        YBuffer,
        vec4ViewBinding(device, YBuffer),
        outBuffer,
        gemmParams,
      ],
    );
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    commandEncoder.copyBufferToBuffer(
      BBuffer,
      0,
      outBuffer,
      0,
      Math.min(BBuffer.size, outBuffer.size),
    );
    const triDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : void 0;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : void 0;
    encodePass(
      commandEncoder,
      triPipeline,
      triBindGroup,
      { x: Math.ceil(aOrder / TILE_WG_2D), y: Math.ceil(aOrder / TILE_WG_2D) },
      triDesc,
    );
    encodePass(
      commandEncoder,
      gemmPipeline,
      gemmBindGroup,
      gemmWgCount,
      gemmDesc,
    );
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = BIsGpu
      ? null
      : stageReadback(device, commandEncoder, outBuffer);
    submit(device, commandEncoder);
    const gpuTimeMs = await extractTimestamp(ts);
    if (BIsGpu) {
      destroyBuffers(B._buf);
      B._buf = outBuffer;
      outBufferAdopted = true;
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!BIsGpu && BBuffer) destroyBuffers(BBuffer);
    if (AdenseBuffer) destroyBuffers(AdenseBuffer);
    if (outBuffer && !outBufferAdopted) destroyBuffers(outBuffer);
    if (triParams) destroyBuffers(triParams);
    if (gemmParams) destroyBuffers(gemmParams);
  }
}

// src/strsm/strsm.mjs
var view = (buffer, off, rs, cs) => ({ buffer, off, rs, cs });
var transposed = (v) => ({ ...v, rs: v.cs, cs: v.rs });
var at = (v, r, c) => ({ ...v, off: v.off + r * v.rs + c * v.cs });
function dispatch(pass, wg) {
  if (typeof wg === "number") pass.dispatchWorkgroups(wg);
  else pass.dispatchWorkgroups(wg.x, wg.y, wg.z ?? 1);
}
var SUBSTITUTION_MAX_BLOCKS3 = 8;
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
  kTri = 0,
) {
  if (kTri !== 0 && C.cs !== 1)
    throw new Error("strsm: an element-triangular gemm needs a row-major C.");
  if (C.cs !== 1) {
    [X, Y, C] = [transposed(Y), transposed(X), transposed(C)];
    [mg, ng] = [ng, mg];
  }
  const xNot = X.cs === 1;
  const yNot = Y.cs === 1;
  const ldX = xNot ? X.rs : X.cs;
  const ldY = yNot ? Y.rs : Y.cs;
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
      { value: C.rs, type: "u32" },
      // ldc
      { value: xNot ? 0 : 1, type: "u32" },
      { value: yNot ? 0 : 1, type: "u32" },
      { value: useVecA ? 1 : 0, type: "u32" },
      { value: useVecB ? 1 : 0, type: "u32" },
      { value: 0, type: "u32" },
      // uplo: full C
      { value: X.off, type: "u32" },
      { value: Y.off, type: "u32" },
      { value: C.off, type: "u32" },
      { value: kTri, type: "u32" },
      // 0 dense; 5/6 op(X) lower/upper by element
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
async function strsm(
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
  const opIsLower = (transEffA === "no-transpose") === (uploEffA === "lower");
  const forward = side === "left" ? opIsLower : !opIsLower;
  const blockStarts = [];
  for (let s = 0; s < aOrder; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;
  const smallPipeline = await getPipeline(device, "strsm_small");
  const nonFinite =
    numBlocks > SUBSTITUTION_MAX_BLOCKS3 &&
    !BIsGpu &&
    (hasNonFinite(B, B.length) ||
      triangleHasNonFinite(A, aOrder, lda, uploEffA === "lower", isUnit));
  const useInverse = numBlocks > SUBSTITUTION_MAX_BLOCKS3 && !nonFinite;
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
    Xblock = createStorageBuffer(
      device,
      (numBlocks > 1 ? BLOCK_SIZE * otherLen : 4) * 4,
      "strsm-Xblock",
    );
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
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);
    const gemm = (X, Y, C, mg, ng, kg, alphaG, betaG, kTri = 0) =>
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
        kTri,
      );
    const solve = (Av, Bv2, order, alphaS, xLd) => {
      const solveParams = params(
        [
          { value: order, type: "u32" },
          { value: otherLen, type: "u32" },
          // nrhs
          { value: Av.off, type: "u32" },
          { value: Av.rs, type: "u32" },
          { value: Av.cs, type: "u32" },
          { value: Bv2.off, type: "u32" },
          { value: Bv2.rs, type: "u32" },
          { value: Bv2.cs, type: "u32" },
          { value: forward ? 0 : 1, type: "u32" },
          // backward
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: alphaS, type: "f32" },
          // applied as B is read in
          { value: xLd, type: "u32" },
          { value: 0, type: "u32" },
          // skipZero: strsv's only
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
      const dummy = view(Xblock, 0, 1, 1);
      gemm(dummy, dummy, view(BBuffer, 0, ldb, 1), bOuter, bInner, 0, 0, 0);
    } else if (numBlocks === 1) {
      solve(Lt, Bt, aOrder, alpha, 0);
    } else {
      if (alpha !== 1) {
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
          solve(
            at(Lt, blockStart, blockStart),
            at(Bt, blockStart, 0),
            blockLen,
            1,
            otherLen,
          );
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
            forward ? 5 : 6,
          );
          const scatterParams = params(
            [
              { value: blockStart, type: "u32" },
              { value: blockLen, type: "u32" },
              { value: 0, type: "u32" },
              { value: otherLen, type: "u32" },
              { value: ldb, type: "u32" },
              { value: effLayoutB === "column-major" ? 1 : 0, type: "u32" },
              { value: blockIsRow ? 1 : 0, type: "u32" },
              { value: 0, type: "u32" },
              // overwrite
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
      if (gpuTimeMs !== void 0) return { gpuTimeMs };
      return {};
    }
    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== void 0) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!BIsGpu && BBuffer) destroyBuffers(BBuffer);
    if (Xblock) destroyBuffers(Xblock);
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    destroyBuffers(paramsBuffers);
  }
}

export {
  benchmarkMode,
  beginTimestamp,
  resolveTimestamp,
  extractTimestamp,
  destroyBuffers,
  uploadBuffer,
  createStorageBuffer,
  createResultBuffer,
  stageReadback,
  clearReadbackPool,
  createParamsBuffer,
  init,
  cleanup,
  gpuName,
  isBenchmarkEnabled,
  getDevice,
  getAdapter,
  extractResult,
  GpuVector,
  GpuMatrix,
  createBindGroup,
  submit,
  beginTimedEncoder,
  encodePass,
  runComputePass,
  getPipeline,
  loadShader,
  sscal,
  cscal,
  dscal,
  sswap,
  dswap,
  saxpy,
  daxpy,
  scopy,
  dcopy,
  sdot,
  sasum,
  dasum,
  ddot,
  snrm2,
  dnrm2,
  isamax,
  idamax,
  srot,
  drot,
  srotm,
  drotm,
  sgemv,
  ssymv,
  strmv,
  strsv,
  sger,
  dger,
  ssyr,
  dsyr,
  ssyr2,
  dsyr2,
  dgemv,
  dsymv,
  dtrmv,
  dtrsv,
  dgemm,
  dgemmtr,
  dsyrk,
  dsyr2k,
  dsymm,
  dtrmm,
  sgemm,
  sgemmtr,
  ssyrk,
  ssyr2k,
  ssymm,
  strmm,
  strsm,
};
