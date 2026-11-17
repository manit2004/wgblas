/**
 * Reads the benchmark results in `benchmarks/results/` — the one source the
 * docs site's results page (`assets/docs/bench.js`) and the docs MCP server's
 * `get_benchmarks` (`mcp/docs-mcp.mjs`) both draw from. Nothing is generated
 * from the results any more; both read the JSON as it is.
 *
 * Runs in browsers and Node: no imports at the top level. The docs build
 * bundles it onto the docs root as a plain script, `results-reader.js`
 * (`window.wgblasResultsReader`; see `scripts/copy-docs-assets.mjs`), and the
 * MCP package ships it as is (see `mcp/package.json`'s prepack).
 *
 * ## Layout it understands
 *
 * ```
 * <gpu>/<backend>/<routine>.json                  base run (older, flat)
 * <gpu>/<backend>/<routine>/<routine>.json        base run
 * <gpu>/<backend>/<routine>/<sweep>.<routine>.json  one parameter sweep
 * <gpu>/wgblas/roofline/fma.json, bandwidth.json  the roofline probes' roofs
 * ```
 * `<backend>` is `wgblas` or `cuda` (cuBLAS, NVIDIA only).
 *
 * ## Configurations
 *
 * A file is a list of rows, one per measurement. Its x-axis is `n` (`order`
 * for strsm's base run). Any other key that takes more than one value at the
 * same x is a configuration dimension (`stride`, `trans` and `pad` together,
 * ...); keys that are constant or follow x (`m`, `k`, `numBlocks`) are
 * carried along as extra columns. So a new sweep needs no code here.
 *
 * @module benchmarks/results-reader
 */

export const REPO = "manit2004/wgblas";
export const BRANCH = "main";
const RESULTS = "benchmarks/results";
// Each routine's BLAS level and FLOP count, for the roofline.
const ROUTINE_PARAMS = "assets/routines/routine_params.json";

/** Row keys that are measurements, never configuration. */
export const MEASUREMENTS = [
  "compute_GBs",
  "compute_GFLOPs",
  "compute_ms",
  "ms_per_block",
];

/** Display names for the metrics a chart can plot. */
export const METRICS = {
  compute_GBs: { label: "GB/s", digits: 2 },
  compute_GFLOPs: { label: "GFLOP/s", digits: 2 },
  compute_ms: { label: "ms", digits: 4 },
};

/** Backends, in display order. */
export const BACKENDS = { wgblas: "wgblas", cuda: "cuBLAS" };

// ── Sources ─────────────────────────────────────────────────────────────────

async function getJson(fetchFn, url) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

/**
 * The results on GitHub: files from raw.githubusercontent.com, listed with two
 * GitHub API calls. The API allows 60 calls an hour per address without a
 * token; when it refuses, `fallbackList` stands in if given (the docs build's
 * list, `results-index.js`), else the error is thrown. `listedFrom` says which
 * the last list() used. routine_params.json comes from `routineParams` if
 * given (the docs build bundles the one its code was built with), else from
 * GitHub.
 * @param {{ repo?: string, branch?: string, fetch?: typeof fetch,
 *   fallbackList?: string[], routineParams?: object }} [options]
 * @returns {{ list: () => Promise<string[]>, read: (path: string) => Promise<any>,
 *   url: (path: string) => string, listedFrom: "github" | "fallback" | null }}
 */
export function githubSource({
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

/**
 * The results on local disk (Node only).
 * @param {string} dir - path to benchmarks/results
 * @param {{ params?: string }} [options] - path to routine_params.json
 *   (default: the checkout's assets/routines/routine_params.json)
 */
export function localSource(
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
      return (routineParams ??= JSON.parse(await fs.readFile(params, "utf8")));
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

// ── Catalog ─────────────────────────────────────────────────────────────────

const WORDS = {
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

/** A GPU folder's slug as a readable name: "nvidia-geforce-gtx-1650" → "NVIDIA GeForce GTX 1650". */
export function gpuName(slug) {
  return slug
    .split("-")
    .map(
      (w) =>
        WORDS[w] ??
        (/^\d+m$/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)),
    )
    .join(" ")
    .replace(/ \(R\)/g, "(R)");
}

/**
 * Sorts result paths into GPU → routine → sweep → backend → path.
 * @param {string[]} paths - relative to benchmarks/results
 * @returns {Map<string, { name: string, probes: { fma?: string, bandwidth?: string },
 *   routines: Map<string, Map<string, { wgblas?: string, cuda?: string }>> }>}
 *   sweeps keyed by name, "base" for the base run, base first; probes, the
 *   roofline probes' result files (both are needed for a roofline)
 */
export function catalog(paths) {
  const gpus = new Map();
  for (const p of paths) {
    const parts = p.split("/");
    const [gpu, backend] = parts;
    if (!(backend in BACKENDS)) continue;
    if (!gpus.has(gpu))
      gpus.set(gpu, { name: gpuName(gpu), probes: {}, routines: new Map() });
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
    if (!g.routines.has(routine)) g.routines.set(routine, new Map());
    const sweeps = g.routines.get(routine);
    if (!sweeps.has(sweep)) sweeps.set(sweep, {});
    const files = sweeps.get(sweep);
    // Some GPUs have a base run in both layouts, the flat file older: the
    // nested one wins, whichever is listed first.
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

// ── One sweep ───────────────────────────────────────────────────────────────

/**
 * What a sweep's rows hold.
 * @param {object[]} rows - every backend's rows for one sweep
 * @returns {{ x: string, configKeys: string[], otherKeys: string[], metrics: string[] }}
 */
export function analyse(rows) {
  const first = rows[0] ?? {};
  const x =
    "n" in first ? "n" : "order" in first ? "order" : Object.keys(first)[0];
  const keys = [...new Set(rows.flatMap(Object.keys))].filter(
    (k) => k !== x && !MEASUREMENTS.includes(k),
  );
  // A key one backend lacks (cuBLAS has no numBlocks) doesn't vary by that.
  const varies = (k) => {
    const seen = new Map();
    for (const r of rows) {
      if (!(k in r)) continue;
      const at = seen.get(r[x]) ?? new Set();
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

/** A row's configuration as a label: "trans = transpose, pad = 8", or "default". */
export function configLabel(row, configKeys) {
  return configKeys.length
    ? configKeys.map((k) => `${k} = ${row[k]}`).join(", ")
    : "default";
}

/**
 * wgblas against cuBLAS, per configuration and x, with wgblas as a percentage
 * of cuBLAS: by GB/s (the old tables' "efficiency"), or by time where a row
 * has no GB/s. Above 100% means wgblas is faster.
 * @param {object[]} wgblas - wgblas rows (may be empty)
 * @param {object[]} cuda - cuBLAS rows (may be empty)
 * @returns {{ info: ReturnType<typeof analyse>, configs: { label: string,
 *   rows: { x: number, other: object, wgblas?: object, cuda?: object, pct: number | null }[] }[] }}
 */
export function compare(wgblas, cuda) {
  const info = analyse([...wgblas, ...cuda]);
  const { x, configKeys, otherKeys } = info;
  const configs = new Map();
  const add = (rows, backend) => {
    for (const r of rows) {
      const label = configLabel(r, configKeys);
      if (!configs.has(label)) configs.set(label, new Map());
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

/**
 * Reads one sweep's files.
 * @param {{ read: (path: string) => Promise<any> }} source
 * @param {{ wgblas?: string, cuda?: string }} files
 */
export async function readSweep(source, files) {
  const [wgblas, cuda] = await Promise.all(
    ["wgblas", "cuda"].map((b) => (files[b] ? source.read(files[b]) : [])),
  );
  return compare(wgblas, cuda);
}

// ── Roofline ────────────────────────────────────────────────────────────────
//
// Every routine at its arithmetic intensity (FLOPs per byte of compulsory
// traffic) against what it achieved, under two roofs from the probes in
// benchmarks/roofline/: compute (fma.js, the best GFLOP/s) and memory
// (bandwidth.js, the best GB/s). Computed from the results each time, never
// stored. The routines are those in assets/routines/routine_params.json: the
// single-precision ones (plus dasum and idamax). The roofs are FP32 probes, and
// the double-double routines' emulated f64 work can't be counted against them.
//
// Both rates a benchmark records share one denominator (the median time), so
// intensity = GFLOP/s / GB/s exactly. The Level 3 benchmarks record both;
// Level 1 and most of Level 2 record GB/s alone, and get their FLOP count from
// routine_params.json's `flops` formula. Intensity is algorithmic (compulsory
// traffic, perfect caching): exact for streaming Level 1 and 2, an upper bound
// for tiled Level 3, whose real DRAM traffic is higher.

/**
 * Evaluates an arithmetic formula (numbers, names, + − * / ^ and parentheses)
 * without eval, since routine_params.json can come over the network.
 * @param {string} formula - e.g. "2 * n * (n + 1) * k"
 * @param {(name: string) => number} lookup - a name's value
 * @returns {number}
 * @throws if the formula isn't one
 */
export function evaluateFormula(formula, lookup) {
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
      const v = sum();
      if (tokens[i++] !== ")") fail();
      return v;
    }
    if (/^\d/.test(t ?? "")) return Number(t);
    if (/^[A-Za-z_]/.test(t ?? "")) return lookup(t);
    return fail();
  };
  // ^ binds tighter than a leading minus: -2^2 is -4.
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
    let v = unary();
    while (tokens[i] === "*" || tokens[i] === "/")
      v = tokens[i++] === "*" ? v * unary() : v / unary();
    return v;
  };
  const sum = () => {
    let v = product();
    while (tokens[i] === "+" || tokens[i] === "-")
      v = tokens[i++] === "+" ? v + product() : v - product();
    return v;
  };
  const v = sum();
  if (i !== tokens.length) fail();
  return v;
}

// A formula name's value in a row: the row's own, else n (sweep files record n
// alone where the base run had m, k or order, and those equal n there), else
// NaN, which carries through so a row lacking a size is skipped, not counted
// as zero work.
const rowValue = (rec, extra) => (name) =>
  name in extra ? extra[name] : (rec[name] ?? rec.n ?? NaN);

/**
 * One result row as a roofline point, or why it can't be one. Rows with no
 * GB/s are no point and no reason (null).
 * @param {{ level: number, flops?: string }} info - the routine's entry in
 *   routine_params.json
 * @param {string} routine
 * @param {string} sweep - the row's sweep ("base" for the base run)
 * @param {object} rec - the row
 * @returns {{ routine: string, level: number, sweep: string, size: number,
 *   ai: number, gflops: number, gbs: number, flopsMeasured: boolean }
 *   | { skip: string } | null}
 */
export function rooflinePoint(info, routine, sweep, rec) {
  const gbs = rec.compute_GBs;
  if (!gbs) return null;
  let gflops = rec.compute_GFLOPs;
  let ai;
  // A recorded 0 is a measurement (no floating-point work ran, e.g. strsm at
  // alpha = 0), not a missing value to re-derive.
  if (gflops != null) ai = gflops / gbs;
  else {
    const ms = rec.compute_ms;
    if (!info.flops || !ms) return { skip: "no FLOP count available" };
    // Both rates share the median time, so this is the exact byte count.
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

/** Whether a GPU has both probes' results, which a roofline needs. */
export function hasRoofline(gpu) {
  return Boolean(gpu.probes.fma && gpu.probes.bandwidth);
}

/**
 * A GPU's roofline, from its probes, its results and routine_params.json.
 * @param {{ read: (path: string) => Promise<any>, params: () => Promise<object> }} source
 * @param {object} gpu - a catalog entry with both probes (see hasRoofline)
 * @param {{ allSweeps?: boolean }} [options] - allSweeps: also read every
 *   sweep, for `points` and `skipped` (scripts/roofline.mjs's checks); the
 *   summary uses the base runs alone either way
 * @returns {Promise<{ peak_GFLOPs: number, peak_GBs: number, roof_source: string,
 *   ridge_FLOP_per_byte: number, routines: object[], points: object[],
 *   skipped: { file: string, why: string }[] }>} routines: one row per
 *   routine, its largest base-run size, by level then name; points: every
 *   row read, as rooflinePoint gives it
 */
export async function readRoofline(source, gpu, { allSweeps = false } = {}) {
  const best = (rows, key) => Math.max(0, ...rows.map((r) => r[key] || 0));
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

  // Per routine, its largest base-run size: where a kernel is closest to its
  // asymptotic behaviour.
  const largest = new Map();
  for (const p of points) {
    if (p.sweep !== "base") continue;
    const cur = largest.get(p.routine);
    if (!cur || p.size > cur.size) largest.set(p.routine, p);
  }

  const attainable = (ai) => Math.min(peakFlops, ai * peakBw);
  // Left of the ridge, % of the sloped roof reduces to GB/s over the memory
  // roof, which also holds at intensity 0 (no arithmetic at all).
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
