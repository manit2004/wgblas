// MCP server over wgblas's TypeDoc JSON (docs/api.json, written by
// `npm run docs`): lets an MCP client (Claude Code, Claude Desktop, Cursor, …)
// search and read the API docs as structured data instead of scraping the
// HTML site. Speaks MCP over stdio.
//
//   claude mcp add wgblas-docs -- node scripts/docs-mcp.mjs
//
// Tools:
//   search_docs(query, limit?) — symbols whose path or summary matches
//   get_doc(name)              — full docs for a symbol path or bare name
//   list_modules()             — the module tree's top level, with summaries
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_JSON = new URL("../docs/api.json", import.meta.url);

let api;
try {
  api = JSON.parse(readFileSync(API_JSON, "utf8"));
} catch (err) {
  // stdout is the MCP channel — diagnostics go to stderr.
  console.error(
    `docs-mcp: can't read ${API_JSON.pathname} (${err.message}) — run \`npm run docs\` first.`,
  );
  process.exit(1);
}

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

// Flatten the reflection tree into { path, node } entries — path is the
// TypeDoc module path plus the symbol, e.g. "docs/sgemm".
const entries = [];
(function walk(node, prefix) {
  for (const child of node.children ?? []) {
    const path = prefix ? `${prefix}/${child.name}` : child.name;
    entries.push({ path, node: child });
    walk(child, path);
  }
})(api, "");

const text = (parts = []) => parts.map((p) => p.text).join("");
const firstComment = (n) => n.comment ?? n.signatures?.[0]?.comment;
const summary = (n) => text(firstComment(n)?.summary).trim();
const firstLine = (s) => s.split("\n").find((l) => l.trim()) ?? "";

// A readable rendering of a TypeDoc type node — enough for signatures.
function typeStr(t) {
  if (!t) return "unknown";
  switch (t.type) {
    case "intrinsic":
    case "reference":
      return t.typeArguments?.length
        ? `${t.name}<${t.typeArguments.map(typeStr).join(", ")}>`
        : t.name;
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
        (c) => `${c.name}: ${typeStr(c.type)}`,
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
  const out = [`${name}(${params.join(", ")}): ${typeStr(sig.type)}`];
  if (sig.comment) {
    const s = text(sig.comment.summary).trim();
    if (s) out.push("", s);
  }
  const paramDocs = (sig.parameters ?? []).filter((p) => p.comment);
  if (paramDocs.length) {
    out.push("", "Parameters:");
    for (const p of paramDocs)
      out.push(`- ${p.name}: ${text(p.comment.summary).trim()}`);
  }
  for (const tag of sig.comment?.blockTags ?? [])
    out.push(
      "",
      `${tag.tag}${tag.name ? ` ${tag.name}` : ""} ${text(tag.content).trim()}`,
    );
  return out.join("\n");
}

function render({ path, node }) {
  const out = [`# ${path} (${KIND[node.kind] ?? `kind ${node.kind}`})`];
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

const reply = (s) => ({ content: [{ type: "text", text: s }] });

const server = new McpServer({
  name: "wgblas-docs",
  version: api.packageVersion ?? "0.0.0",
});

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
    const q = query.toLowerCase();
    const scored = [];
    for (const e of entries) {
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
          `${e.path} (${KIND[e.node.kind] ?? e.node.kind}) — ${firstLine(summary(e.node)) || "(no summary)"}`,
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
    const exact = entries.filter((e) => e.path === name);
    const found = exact.length
      ? exact
      : entries.filter((e) => e.node.name === name);
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
    // benchmarks/<gpu>/<routine> result modules: ~100 near-identical lines, so
    // one line per GPU instead — search_docs reaches the individual ones.
    const perGpu = new Map();
    const lines = [];
    for (const m of api.children ?? []) {
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
        `benchmarks/${gpu}/* (${count} routine result modules) — per-routine benchmark results on this GPU`,
      );
    return reply(lines.join("\n"));
  },
);

await server.connect(new StdioServerTransport());
