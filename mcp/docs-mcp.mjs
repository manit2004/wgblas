#!/usr/bin/env node
// wgblas-docs-mcp: an MCP server for the wgblas API reference and developer
// docs. Serves TypeDoc's JSON output (api.json) to MCP clients (Claude Code,
// Claude Desktop, Cursor, …) as three tools, over stdio:
//
//   search_docs(query, limit?)            — symbols whose path or summary matches
//   get_doc(name)                         — full docs for a symbol path or bare name
//   list_modules()                        — the module tree, with summaries
//   get_benchmarks(routine, gpu?, sweep?) — one routine's benchmark tables, or
//                                           routine "roofline" for each GPU's
//                                           roofline table
//
// Where the docs come from, by WGBLAS_DOCS_JSON:
//   unset         serve the copy bundled with this package right away, and
//                 fetch the live one from the wgblas docs site in the
//                 background — swapped in when it arrives (it's a few MB, and
//                 MCP clients expect a server to start within seconds)
//   a URL         the same, from that URL instead of the docs site
//   a file path   that file only, no network (the repo's scripts/docs-mcp.mjs
//                 uses this to serve a fresh `npm run docs` build)
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SITE_JSON = "https://manit2004.github.io/wgblas/api.json";
const BUNDLED_JSON = new URL("./api.json", import.meta.url);
const FETCH_TIMEOUT_MS = 120_000;

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

// stdout is the MCP channel — every diagnostic goes to stderr.
const log = (msg) => console.error(`wgblas-docs-mcp: ${msg}`);

// TypeDoc ReflectionKind values that appear in api.json.
const KIND = {
  2: "module",
  4: "namespace",
  32: "variable",
  64: "function",
  128: "class",
  256: "interface",
  512: "constructor",
  1024: "property",
  2048: "method",
  4194304: "type alias",
};

// The docs in use: TypeDoc's project tree, flattened into { path, node }
// entries — path is the module path plus the symbol, e.g. "docs/sgemm".
let docs = null;

function useDocs(api, from) {
  if (!Array.isArray(api?.children))
    throw new Error("not a TypeDoc JSON project (no children)");
  const entries = [];
  (function walk(node, prefix) {
    for (const child of node.children ?? []) {
      const path = prefix ? `${prefix}/${child.name}` : child.name;
      entries.push({ path, node: child });
      // A documented options-object property (`@param options.x`) lives on
      // its parameter's inline type, not as a symbol of its own — index it
      // too, as e.g. "docs/init.options.dumpShaders", so search_docs finds
      // it and get_doc accepts its path. Overloads repeat them: once each.
      const seen = new Set();
      for (const sig of child.signatures ?? [])
        for (const param of sig.parameters ?? [])
          for (const opt of param.type?.declaration?.children ?? []) {
            const optPath = `${path}.${param.name}.${opt.name}`;
            if (!opt.comment || seen.has(optPath)) continue;
            seen.add(optPath);
            entries.push({
              path: optPath,
              node: opt,
              label: `option of ${child.name}()`,
            });
          }
      walk(child, path);
    }
  })(api, "");
  docs = { api, entries };
  log(`serving ${entries.length} symbols from ${from}`);
}

const readJsonFile = (path) => JSON.parse(readFileSync(path, "utf8"));

async function fetchJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const source = process.env.WGBLAS_DOCS_JSON;
if (source && !/^https?:\/\//.test(source)) {
  // A local file: serve it and nothing else.
  try {
    useDocs(readJsonFile(source), source);
  } catch (err) {
    log(`can't read ${source} (${err.message}) — run \`npm run docs\` first.`);
    process.exit(1);
  }
} else {
  const url = source ?? SITE_JSON;
  try {
    useDocs(readJsonFile(BUNDLED_JSON), `the bundled copy (v${pkg.version})`);
  } catch (err) {
    log(`no bundled docs (${err.message}); waiting for ${url}`);
  }
  // In the background: the live docs replace the bundled copy if they arrive.
  fetchJson(url)
    .then((api) => useDocs(api, url))
    .catch((err) =>
      log(
        `couldn't fetch ${url} (${err.message})${docs ? "; keeping the bundled copy" : ""}`,
      ),
    );
}

const text = (parts = []) => parts.map((p) => p.text).join("");
const firstComment = (n) => n.comment ?? n.signatures?.[0]?.comment;
const summary = (n) => text(firstComment(n)?.summary).trim();
const firstLine = (s) => s.split("\n").find((l) => l.trim()) ?? "";

// A readable rendering of a TypeDoc type node — enough for signatures.
function typeStr(t) {
  if (!t) return "unknown";
  switch (t.type) {
    case "intrinsic":
    case "reference": {
      // Typed arrays carry TypeScript's default <ArrayBufferLike> argument —
      // noise in a signature, so it's dropped.
      const args = (t.typeArguments ?? []).filter(
        (a) => a.name !== "ArrayBufferLike",
      );
      return args.length
        ? `${t.name}<${args.map(typeStr).join(", ")}>`
        : t.name;
    }
    case "literal":
      return JSON.stringify(t.value);
    case "union":
      return t.types.map(typeStr).join(" | ");
    case "intersection":
      return t.types.map(typeStr).join(" & ");
    case "array":
      return `${typeStr(t.elementType)}[]`;
    case "tuple":
      return `[${(t.elements ?? []).map(typeStr).join(", ")}]`;
    case "reflection": {
      const d = t.declaration;
      if (d?.signatures?.length) return "(…) => …";
      const props = (d?.children ?? []).map(
        (c) => `${c.name}${c.flags?.isOptional ? "?" : ""}: ${typeStr(c.type)}`,
      );
      return `{ ${props.join("; ")} }`;
    }
    default:
      return t.name ?? t.type;
  }
}

function renderSignature(name, sig) {
  const params = (sig.parameters ?? []).map(
    (p) =>
      `${p.name}${p.flags?.isOptional || p.defaultValue ? "?" : ""}: ${typeStr(p.type)}`,
  );
  // Generic signatures: <T extends …> so a parameter typed `T` reads as
  // something.
  const typeParams = (sig.typeParameters ?? []).map(
    (t) => `${t.name}${t.type ? ` extends ${typeStr(t.type)}` : ""}`,
  );
  const generics = typeParams.length ? `<${typeParams.join(", ")}>` : "";
  const out = [
    `${name}${generics}(${params.join(", ")}): ${typeStr(sig.type)}`,
  ];
  if (sig.comment) {
    const s = text(sig.comment.summary).trim();
    if (s) out.push("", s);
  }
  // Each parameter's own doc, then its options-object properties' docs
  // (`@param options.x` lands on the property, not on `options`).
  const paramLines = [];
  for (const p of sig.parameters ?? []) {
    if (p.comment)
      paramLines.push(`- ${p.name}: ${text(p.comment.summary).trim()}`);
    for (const opt of p.type?.declaration?.children ?? [])
      if (opt.comment)
        paramLines.push(
          `- ${p.name}.${opt.name}${opt.flags?.isOptional ? "?" : ""}: ${typeStr(opt.type)} — ${text(opt.comment.summary).trim()}`,
        );
  }
  if (paramLines.length) out.push("", "Parameters:", ...paramLines);
  // A tag with no text (e.g. a bare `@returns {void}`) says nothing the
  // signature line doesn't.
  for (const tag of sig.comment?.blockTags ?? []) {
    const body = text(tag.content).trim();
    if (body)
      out.push("", `${tag.tag}${tag.name ? ` ${tag.name}` : ""} ${body}`);
  }
  return out.join("\n");
}

const kindLabel = ({ node, label }) =>
  label ?? KIND[node.kind] ?? `kind ${node.kind}`;

function render(entry) {
  const { path, node } = entry;
  const out = [`# ${path} (${kindLabel(entry)})`];
  if (node.signatures?.length) {
    node.signatures.forEach((sig, i) => {
      if (node.signatures.length > 1) out.push("", `## Overload ${i + 1}`);
      out.push("", renderSignature(node.name, sig));
    });
  } else {
    if (node.type) out.push("", `type: ${typeStr(node.type)}`);
    const s = summary(node);
    if (s) out.push("", s);
    for (const tag of node.comment?.blockTags ?? [])
      out.push("", `${tag.tag} ${text(tag.content).trim()}`);
  }
  if (node.children?.length)
    out.push("", `Members: ${node.children.map((c) => c.name).join(", ")}`);
  const src = node.sources?.[0];
  if (src) out.push("", `Source: ${src.url ?? `${src.fileName}:${src.line}`}`);
  return out.join("\n");
}

// A benchmarks/<gpu>/<routine> module's summary is its whole results page, as
// markdown: the default-size table, a "See also" list, then one "## <param>
// sweep" section per swept parameter, its tables in <details> blocks. Split it
// into those sections, minus the chart images (relative links into the docs
// site), with each <details> block's <summary> turned into a heading one level
// below the block it's nested in.
function benchSections(node) {
  let depth = 0;
  const lines = [];
  for (const l of text(node.comment?.summary).split("\n")) {
    if (l === "<details>") depth++;
    else if (l === "</details>") depth--;
    else if (!l.startsWith("![")) {
      const summary = l.match(/^<summary>(.*)<\/summary>$/)?.[1];
      lines.push(summary ? `${"#".repeat(2 + depth)} ${summary}` : l);
    }
  }
  const md = lines.join("\n").replace(/\n{3,}/g, "\n\n");
  const sections = [];
  for (const chunk of md.split(/^(?=## )/m)) {
    const heading = chunk.match(/^## (.*)/)?.[1];
    if (heading && heading !== "See also")
      sections.push({ heading, body: chunk.trim() });
  }
  return sections;
}

const reply = (s) => ({ content: [{ type: "text", text: s }] });

// Every tool answers this until some docs have loaded (only possible with no
// bundled copy, while the first fetch is still running).
const notLoaded = () =>
  reply(
    "The wgblas docs are still loading — try again in a few seconds. " +
      "(Set WGBLAS_DOCS_JSON to a local api.json to skip the download.)",
  );

const server = new McpServer({ name: "wgblas-docs", version: pkg.version });

server.registerTool(
  "search_docs",
  {
    description:
      "Search the wgblas API docs by symbol name, module path, or summary text (case-insensitive). " +
      "Returns matching symbol paths with one-line summaries; pass a path to get_doc for the full docs.",
    inputSchema: {
      query: z
        .string()
        .min(1)
        .describe(
          "Name or words to look for, e.g. 'sgemm' or 'triangular solve'",
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Maximum results (default 15)"),
    },
  },
  async ({ query, limit = 15 }) => {
    if (!docs) return notLoaded();
    const q = query.toLowerCase();
    const scored = [];
    for (const e of docs.entries) {
      const name = e.node.name.toLowerCase();
      const score =
        name === q
          ? 4
          : name.startsWith(q)
            ? 3
            : e.path.toLowerCase().includes(q)
              ? 2
              : summary(e.node).toLowerCase().includes(q)
                ? 1
                : 0;
      if (score) scored.push({ e, score });
    }
    scored.sort(
      (a, b) => b.score - a.score || a.e.path.length - b.e.path.length,
    );
    const lines = scored
      .slice(0, limit)
      .map(
        ({ e }) =>
          `${e.path} (${kindLabel(e)}) — ${firstLine(summary(e.node)) || "(no summary)"}`,
      );
    return reply(
      lines.length
        ? `${scored.length} match${scored.length === 1 ? "" : "es"}${scored.length > limit ? `, showing ${limit}` : ""}:\n${lines.join("\n")}`
        : `No matches for "${query}".`,
    );
  },
);

server.registerTool(
  "get_doc",
  {
    description:
      "Full docs for one wgblas symbol: signatures with parameter types, parameter docs, " +
      "tags (@returns, @throws, @see, @example), members, and a GitHub source link. " +
      "Accepts a path from search_docs (e.g. 'docs/sgemm') or a bare name (returns every symbol with that name).",
    inputSchema: {
      name: z.string().min(1).describe("Symbol path or bare name"),
    },
  },
  async ({ name }) => {
    if (!docs) return notLoaded();
    const exact = docs.entries.filter((e) => e.path === name);
    const found = exact.length
      ? exact
      : docs.entries.filter((e) => e.node.name === name);
    return reply(
      found.length
        ? found.map(render).join("\n\n---\n\n")
        : `No symbol "${name}". Try search_docs to find its path.`,
    );
  },
);

server.registerTool(
  "list_modules",
  {
    description:
      "List the modules of the wgblas docs with their summaries and member counts " +
      "('docs' is the public API). Per-GPU benchmark-result modules are collapsed to one line per GPU.",
    inputSchema: {},
  },
  async () => {
    if (!docs) return notLoaded();
    // benchmarks/<gpu>/<routine> result modules: ~100 near-identical lines, so
    // one line per GPU instead — search_docs reaches the individual ones.
    const perGpu = new Map();
    const lines = [];
    for (const m of docs.api.children ?? []) {
      const gpu = m.name.match(/^benchmarks\/([^/]+)\//)?.[1];
      if (gpu) {
        perGpu.set(gpu, (perGpu.get(gpu) ?? 0) + 1);
        continue;
      }
      const members = m.children?.length
        ? `${m.children.length} members`
        : "docs page";
      lines.push(
        `${m.name} (${members}) — ${firstLine(summary(m)) || "(no summary)"}`,
      );
    }
    for (const [gpu, count] of perGpu)
      lines.push(
        `benchmarks/${gpu}/* (${count} routine result modules) — per-routine benchmark results on this GPU; read them with get_benchmarks (routine "roofline" for the GPU's roofline)`,
      );
    return reply(lines.join("\n"));
  },
);

server.registerTool(
  "get_benchmarks",
  {
    description:
      "Benchmark results for one wgblas routine: wgblas vs cuBLAS time (ms), throughput (GB/s) and efficiency " +
      "per problem size, on each GPU with results. Without sweep, returns the default-size table per GPU and " +
      "names the parameter sweeps available; with sweep, returns that sweep's tables instead. " +
      "routine 'roofline' returns each GPU's roofline instead: its memory and compute roofs, ridge point, and " +
      "every routine's arithmetic intensity, achieved GFLOP/s and GB/s, and % of roof.",
    inputSchema: {
      routine: z
        .string()
        .min(1)
        .describe(
          "Routine name, e.g. 'sgemm' or 'dtrsv', or 'roofline' for the roofline table",
        ),
      gpu: z
        .string()
        .optional()
        .describe(
          "Only GPUs whose name contains this, case-insensitive, e.g. '1650' or 'intel' (default: every GPU)",
        ),
      sweep: z
        .string()
        .optional()
        .describe(
          "A parameter sweep to return instead of the default table, e.g. 'alpha', 'transpose', 'ldb'",
        ),
    },
  },
  async ({ routine, gpu, sweep }) => {
    if (!docs) return notLoaded();
    const r = routine.toLowerCase();
    // The roofline isn't a routine: it's the "## Roofline" section of each
    // GPU's own benchmarks/<gpu> page.
    const roofline = r === "roofline";
    const all = [];
    for (const m of docs.api.children ?? []) {
      if (roofline) {
        const g = m.name.match(/^benchmarks\/([^/]+)$/)?.[1];
        const section =
          g && benchSections(m).find((s) => s.heading === "Roofline");
        if (section) all.push({ gpu: g, section });
        continue;
      }
      const [, g, name] = m.name.match(/^benchmarks\/([^/]+)\/([^/]+)$/) ?? [];
      if (g && name.toLowerCase() === r) all.push({ gpu: g, node: m });
    }
    if (!all.length)
      return reply(
        `No benchmark results for "${routine}". Try search_docs to find the routine's name.`,
      );
    const gpus = gpu
      ? all.filter((b) =>
          b.gpu.includes(gpu.toLowerCase().trim().replace(/\s+/g, "-")),
        )
      : all;
    if (!gpus.length)
      return reply(
        `No GPU matching "${gpu}" has ${routine} results. GPUs with results: ${all.map((b) => b.gpu).join(", ")}.`,
      );
    const out = gpus.map(({ gpu: g, node, section }) => {
      // Minus the note on zooming the chart, which isn't here.
      if (roofline)
        return `# roofline on ${g}\n\n${section.body.replace(/^> .*chart zooms.*\n\n/m, "")}`;
      const [main, ...sweeps] = benchSections(node);
      const names = sweeps.map((s) => s.heading.replace(/ sweep$/i, ""));
      const head = `# ${r} on ${g}`;
      if (!sweep)
        return [
          head,
          main?.body ?? "(no results table)",
          names.length
            ? `Sweeps: ${names.join(", ")} — pass sweep to get one.`
            : "No parameter sweeps.",
        ].join("\n\n");
      const want = sweep.toLowerCase().replace(/ sweep$/, "");
      const hit = sweeps.filter((s, i) => names[i].toLowerCase() === want);
      return hit.length
        ? [head, ...hit.map((s) => s.body)].join("\n\n")
        : `${head}\n\nNo ${sweep} sweep. Sweeps: ${names.join(", ") || "none"}.`;
    });
    return reply(out.join("\n\n---\n\n"));
  },
);

await server.connect(new StdioServerTransport());
