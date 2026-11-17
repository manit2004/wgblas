var wgblasResultsReader = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) =>
    typeof require !== "undefined"
      ? require
      : typeof Proxy !== "undefined"
        ? new Proxy(x, {
            get: (a, b) => (typeof require !== "undefined" ? require : a)[b],
          })
        : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable:
              !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (
    (target = mod != null ? __create(__getProtoOf(mod)) : {}),
    __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule
        ? __defProp(target, "default", { value: mod, enumerable: true })
        : target,
      mod,
    )
  );
  var __toCommonJS = (mod) =>
    __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // benchmarks/results-reader.mjs
  var results_reader_exports = {};
  __export(results_reader_exports, {
    BACKENDS: () => BACKENDS,
    BRANCH: () => BRANCH,
    MEASUREMENTS: () => MEASUREMENTS,
    METRICS: () => METRICS,
    REPO: () => REPO,
    analyse: () => analyse,
    catalog: () => catalog,
    compare: () => compare,
    configLabel: () => configLabel,
    evaluateFormula: () => evaluateFormula,
    githubSource: () => githubSource,
    gpuName: () => gpuName,
    hasRoofline: () => hasRoofline,
    localSource: () => localSource,
    readRoofline: () => readRoofline,
    readSweep: () => readSweep,
    rooflinePoint: () => rooflinePoint,
  });
  var REPO = "manit2004/wgblas";
  var BRANCH = "main";
  var RESULTS = "benchmarks/results";
  var ROUTINE_PARAMS = "assets/routines/routine_params.json";
  var MEASUREMENTS = [
    "compute_GBs",
    "compute_GFLOPs",
    "compute_ms",
    "ms_per_block",
  ];
  var METRICS = {
    compute_GBs: { label: "GB/s", digits: 2 },
    compute_GFLOPs: { label: "GFLOP/s", digits: 2 },
    compute_ms: { label: "ms", digits: 4 },
  };
  var BACKENDS = { wgblas: "wgblas", cuda: "cuBLAS" };
  async function getJson(fetchFn, url) {
    const res = await fetchFn(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  }
  function githubSource({
    repo = REPO,
    branch = BRANCH,
    fetch: fetchFn = globalThis.fetch,
    fallbackList,
    routineParams,
  } = {}) {
    const url = (path) =>
      `https://raw.githubusercontent.com/${repo}/${branch}/${RESULTS}/${path}`;
    async function listViaApi() {
      const api = `https://api.github.com/repos/${repo}`;
      const parent = await getJson(
        fetchFn,
        `${api}/contents/benchmarks?ref=${branch}`,
      );
      const dir = parent.find((e) => e.name === "results" && e.type === "dir");
      if (!dir) throw new Error(`${RESULTS} not found on ${branch}`);
      const tree = await getJson(
        fetchFn,
        `${api}/git/trees/${dir.sha}?recursive=1`,
      );
      return tree.tree.filter((e) => e.type === "blob").map((e) => e.path);
    }
    let params = routineParams && Promise.resolve(routineParams);
    const source = {
      url,
      listedFrom: null,
      // assets/routines/routine_params.json, read once.
      params: () =>
        (params ??= getJson(
          fetchFn,
          `https://raw.githubusercontent.com/${repo}/${branch}/${ROUTINE_PARAMS}`,
        )),
      async list() {
        try {
          const paths = (await listViaApi()).filter((p) => p.endsWith(".json"));
          source.listedFrom = "github";
          return paths;
        } catch (err) {
          if (!fallbackList?.length) throw err;
          source.listedFrom = "fallback";
          return fallbackList.filter((p) => p.endsWith(".json"));
        }
      },
      read: (path) => getJson(fetchFn, url(path)),
    };
    return source;
  }
  function localSource(
    dir,
    { params = `${dir}/../../${ROUTINE_PARAMS}` } = {},
  ) {
    const io = (async () => ({
      fs: await import("node:fs/promises"),
      path: await import("node:path"),
    }))();
    let routineParams;
    return {
      // assets/routines/routine_params.json beside a checkout's results, read once.
      async params() {
        const { fs } = await io;
        return (routineParams ??= JSON.parse(
          await fs.readFile(params, "utf8"),
        ));
      },
      url: (p) => `${dir}/${p}`,
      async list() {
        const { fs, path } = await io;
        const out = [];
        async function walk(rel) {
          for (const e of await fs.readdir(path.join(dir, rel), {
            withFileTypes: true,
          })) {
            const r = rel ? `${rel}/${e.name}` : e.name;
            if (e.isDirectory()) await walk(r);
            else if (e.name.endsWith(".json")) out.push(r);
          }
        }
        await walk("");
        return out;
      },
      async read(p) {
        const { fs, path } = await io;
        return JSON.parse(await fs.readFile(path.join(dir, p), "utf8"));
      },
    };
  }
  var WORDS = {
    nvidia: "NVIDIA",
    geforce: "GeForce",
    gtx: "GTX",
    rtx: "RTX",
    amd: "AMD",
    gpu: "GPU",
    radv: "RADV",
    tgl: "TGL",
    gt2: "GT2",
    xe: "Xe",
    r: "(R)",
  };
  function gpuName(slug) {
    return slug
      .split("-")
      .map(
        (w) =>
          WORDS[w] ??
          (/^\d+m$/.test(w)
            ? w.toUpperCase()
            : w[0].toUpperCase() + w.slice(1)),
      )
      .join(" ")
      .replace(/ \(R\)/g, "(R)");
  }
  function catalog(paths) {
    const gpus = /* @__PURE__ */ new Map();
    for (const p of paths) {
      const parts = p.split("/");
      const [gpu, backend] = parts;
      if (!(backend in BACKENDS)) continue;
      if (!gpus.has(gpu))
        gpus.set(gpu, {
          name: gpuName(gpu),
          probes: {},
          routines: /* @__PURE__ */ new Map(),
        });
      const g = gpus.get(gpu);
      let routine;
      let sweep;
      if (parts.length === 3) {
        routine = parts[2].replace(/\.json$/, "");
        sweep = "base";
      } else if (parts.length === 4) {
        routine = parts[2];
        if (routine === "roofline") {
          const probe = parts[3].replace(/\.json$/, "");
          if (probe === "fma" || probe === "bandwidth") g.probes[probe] = p;
          continue;
        }
        const file = parts[3].replace(/\.json$/, "");
        sweep =
          file === routine
            ? "base"
            : file.replace(new RegExp(`\\.${routine}$`), "");
      } else continue;
      if (!g.routines.has(routine))
        g.routines.set(routine, /* @__PURE__ */ new Map());
      const sweeps = g.routines.get(routine);
      if (!sweeps.has(sweep)) sweeps.set(sweep, {});
      const files = sweeps.get(sweep);
      if (!(parts.length === 3 && files[backend]?.split("/").length === 4))
        files[backend] = p;
    }
    for (const g of gpus.values()) {
      g.routines = new Map(
        [...g.routines].sort(([a], [b]) => a.localeCompare(b)),
      );
      for (const [r, sweeps] of g.routines)
        g.routines.set(
          r,
          new Map(
            [...sweeps].sort(([a], [b]) =>
              a === "base" ? -1 : b === "base" ? 1 : a.localeCompare(b),
            ),
          ),
        );
    }
    return new Map([...gpus].sort(([a], [b]) => a.localeCompare(b)));
  }
  function analyse(rows) {
    const first = rows[0] ?? {};
    const x =
      "n" in first ? "n" : "order" in first ? "order" : Object.keys(first)[0];
    const keys = [...new Set(rows.flatMap(Object.keys))].filter(
      (k) => k !== x && !MEASUREMENTS.includes(k),
    );
    const varies = (k) => {
      const seen = /* @__PURE__ */ new Map();
      for (const r of rows) {
        if (!(k in r)) continue;
        const at = seen.get(r[x]) ?? /* @__PURE__ */ new Set();
        at.add(JSON.stringify(r[k]));
        seen.set(r[x], at);
      }
      return [...seen.values()].some((s) => s.size > 1);
    };
    const configKeys = keys.filter(varies);
    return {
      x,
      configKeys,
      otherKeys: keys.filter((k) => !configKeys.includes(k)),
      metrics: Object.keys(METRICS).filter((m) =>
        rows.some((r) => typeof r[m] === "number"),
      ),
    };
  }
  function configLabel(row, configKeys) {
    return configKeys.length
      ? configKeys.map((k) => `${k} = ${row[k]}`).join(", ")
      : "default";
  }
  function compare(wgblas, cuda) {
    const info = analyse([...wgblas, ...cuda]);
    const { x, configKeys, otherKeys } = info;
    const configs = /* @__PURE__ */ new Map();
    const add = (rows, backend) => {
      for (const r of rows) {
        const label = configLabel(r, configKeys);
        if (!configs.has(label)) configs.set(label, /* @__PURE__ */ new Map());
        const byX = configs.get(label);
        const entry = byX.get(r[x]) ?? { x: r[x], other: {} };
        entry[backend] = r;
        for (const k of otherKeys) if (k in r) entry.other[k] = r[k];
        byX.set(r[x], entry);
      }
    };
    add(wgblas, "wgblas");
    add(cuda, "cuda");
    const pct = ({ wgblas: w, cuda: c }) => {
      if (!w || !c) return null;
      if (w.compute_GBs > 0 && c.compute_GBs > 0)
        return (w.compute_GBs / c.compute_GBs) * 100;
      if (w.compute_ms > 0 && c.compute_ms > 0)
        return (c.compute_ms / w.compute_ms) * 100;
      return null;
    };
    return {
      info,
      configs: [...configs].map(([label, byX]) => ({
        label,
        rows: [...byX.values()]
          .sort((a, b) => a.x - b.x)
          .map((e) => ({ ...e, pct: pct(e) })),
      })),
    };
  }
  async function readSweep(source, files) {
    const [wgblas, cuda] = await Promise.all(
      ["wgblas", "cuda"].map((b) => (files[b] ? source.read(files[b]) : [])),
    );
    return compare(wgblas, cuda);
  }
  function evaluateFormula(formula, lookup) {
    const tokens = formula.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/^()]/g) ?? [];
    if (tokens.join("") !== formula.replace(/\s+/g, ""))
      throw new Error(`not a formula: ${formula}`);
    let i = 0;
    const fail = () => {
      throw new Error(`not a formula: ${formula}`);
    };
    const primary = () => {
      const t = tokens[i++];
      if (t === "(") {
        const v2 = sum();
        if (tokens[i++] !== ")") fail();
        return v2;
      }
      if (/^\d/.test(t ?? "")) return Number(t);
      if (/^[A-Za-z_]/.test(t ?? "")) return lookup(t);
      return fail();
    };
    const power = () => {
      const base = primary();
      if (tokens[i] !== "^") return base;
      i++;
      return base ** unary();
    };
    const unary = () => {
      if (tokens[i] !== "-") return power();
      i++;
      return -unary();
    };
    const product = () => {
      let v2 = unary();
      while (tokens[i] === "*" || tokens[i] === "/")
        v2 = tokens[i++] === "*" ? v2 * unary() : v2 / unary();
      return v2;
    };
    const sum = () => {
      let v2 = product();
      while (tokens[i] === "+" || tokens[i] === "-")
        v2 = tokens[i++] === "+" ? v2 + product() : v2 - product();
      return v2;
    };
    const v = sum();
    if (i !== tokens.length) fail();
    return v;
  }
  var rowValue = (rec, extra) => (name) =>
    name in extra ? extra[name] : (rec[name] ?? rec.n ?? NaN);
  function rooflinePoint(info, routine, sweep, rec) {
    const gbs = rec.compute_GBs;
    if (!gbs) return null;
    let gflops = rec.compute_GFLOPs;
    let ai;
    if (gflops != null) ai = gflops / gbs;
    else {
      const ms = rec.compute_ms;
      if (!info.flops || !ms) return { skip: "no FLOP count available" };
      const bytes = (gbs * 1e9 * ms) / 1e3;
      const flops = evaluateFormula(info.flops, rowValue(rec, { bytes }));
      if (!Number.isFinite(flops) || flops < 0)
        return { skip: "row lacks the dimensions" };
      ai = bytes ? flops / bytes : 0;
      gflops = gbs * ai;
    }
    return {
      routine,
      level: info.level,
      sweep,
      size: rec.n ?? rec.order ?? rec.m ?? 0,
      ai,
      gflops,
      gbs,
      flopsMeasured: Boolean(rec.compute_GFLOPs),
    };
  }
  function hasRoofline(gpu) {
    return Boolean(gpu.probes.fma && gpu.probes.bandwidth);
  }
  async function readRoofline(source, gpu, { allSweeps = false } = {}) {
    const best = (rows2, key) => Math.max(0, ...rows2.map((r) => r[key] || 0));
    const [params, fma, bandwidth] = await Promise.all([
      source.params(),
      source.read(gpu.probes.fma),
      source.read(gpu.probes.bandwidth),
    ]);
    const peakFlops = best(fma, "compute_GFLOPs");
    const peakBw = best(bandwidth, "compute_GBs");
    const ridge = peakFlops / peakBw;
    const onRoofline = (r) => r !== "$comment" && params[r]?.level != null;
    const files = [];
    const skipped = [];
    for (const [routine, sweeps] of gpu.routines)
      for (const [sweep, f] of sweeps) {
        if (!f.wgblas || (!allSweeps && sweep !== "base")) continue;
        if (onRoofline(routine)) files.push({ routine, sweep, path: f.wgblas });
        else if (allSweeps)
          skipped.push({ file: f.wgblas, why: "not a roofline routine" });
      }
    const rows = await Promise.all(files.map((f) => source.read(f.path)));
    const points = [];
    files.forEach((f, i) => {
      for (const rec of rows[i]) {
        const p = rooflinePoint(params[f.routine], f.routine, f.sweep, rec);
        if (!p) continue;
        if (p.skip) skipped.push({ file: f.path, why: p.skip });
        else points.push(p);
      }
    });
    const largest = /* @__PURE__ */ new Map();
    for (const p of points) {
      if (p.sweep !== "base") continue;
      const cur = largest.get(p.routine);
      if (!cur || p.size > cur.size) largest.set(p.routine, p);
    }
    const attainable = (ai) => Math.min(peakFlops, ai * peakBw);
    const pctOfRoof = (p) =>
      p.ai < ridge
        ? peakBw
          ? (p.gbs / peakBw) * 100
          : 0
        : peakFlops
          ? (p.gflops / peakFlops) * 100
          : 0;
    return {
      peak_GFLOPs: peakFlops,
      peak_GBs: peakBw,
      roof_source: "measured (fma.js + bandwidth.js)",
      ridge_FLOP_per_byte: ridge,
      routines: [...largest.values()]
        .sort(
          (a, b) =>
            a.level - b.level ||
            (a.routine < b.routine ? -1 : a.routine > b.routine ? 1 : 0),
        )
        .map((p) => ({
          routine: p.routine,
          level: p.level,
          size: p.size,
          arithmetic_intensity: p.ai,
          compute_GFLOPs: p.gflops,
          compute_GBs: p.gbs,
          roof_GFLOPs: attainable(p.ai),
          pct_of_roof: pctOfRoof(p),
          bound: p.ai >= ridge ? "compute" : "memory",
          flops_measured: p.flopsMeasured,
        })),
      points,
      skipped,
    };
  }
  return __toCommonJS(results_reader_exports);
})();
