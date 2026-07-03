import { getDevice } from "../init.mjs";

const _pipelines = new WeakMap();

export async function getPipeline(device, shaderName) {
  if (!_pipelines.has(device)) {
    _pipelines.set(device, new Map());
  }
  const byName = _pipelines.get(device);
  if (!byName.has(shaderName)) {
    byName.set(shaderName, await loadShader(shaderName));
  }
  return byName.get(shaderName);
}

async function loadCode(shaderName) {
  if (typeof window !== "undefined") {
    const response = await fetch(`/src/shaders/${shaderName}.wgsl`);
    return response.text();
  } else {
    const { readFileSync } = await import("fs");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");
    const dir = dirname(fileURLToPath(import.meta.url));
    return readFileSync(join(dir, `../shaders/${shaderName}.wgsl`), "utf8");
  }
}

export async function loadShader(shaderName) {
  const device = getDevice();
  const code = await loadCode(shaderName);

  const shaderModule = device.createShaderModule({ label: shaderName, code });

  const info = await shaderModule.getCompilationInfo();
  const errors = info.messages.filter((m) => m.type === "error");
  if (errors.length > 0) {
    throw new Error(
      `Shader "${shaderName}" compilation failed:\n${errors.map((m) => `  line ${m.lineNum}: ${m.message}`).join("\n")}`,
    );
  }

  const pipeline = device.createComputePipeline({
    label: shaderName,
    layout: "auto",
    compute: { module: shaderModule },
  });

  pipeline._shaderModule = shaderModule; // anchor — GC'd shaderModule crashes native pipeline

  return pipeline;
}
