# wgblas-mcp

An [MCP](https://modelcontextprotocol.io) server for the
[wgblas](https://github.com/manit2004/wgblas) docs — the API reference and the
developer docs — so an AI assistant can search and read them while it helps
you write wgblas code.

## Install

**Claude Code**

```bash
claude mcp add wgblas-docs -- npx -y wgblas-mcp
```

**Claude Desktop, Cursor, VS Code, or any MCP client** — add to its MCP config:

```json
{
  "mcpServers": {
    "wgblas-docs": {
      "command": "npx",
      "args": ["-y", "wgblas-mcp"]
    }
  }
}
```

Requires Node.js 18 or later.

## Tools

| Tool | What it does |
|---|---|
| `search_docs(query, limit?)` | Finds symbols by name, module path, or summary text — e.g. `sgemm`, `triangular solve`. |
| `get_doc(name)` | Full docs for one symbol: every signature with parameter types, parameter descriptions, `@returns`/`@throws`/`@see`/`@example`, members, and a link to the source. |
| `list_modules()` | The docs' module tree: `docs` (the public API), `devdocs` (how wgblas is built), tests, benchmarks, examples. |
| `get_benchmarks(routine, gpu?, sweep?)` | A routine's benchmark tables — wgblas vs cuBLAS time, GB/s and wgblas as a % of cuBLAS per size — on every GPU with results, or one (`gpu: "1650"`). Gives the base-run table and lists the parameter sweeps; pass `sweep` (e.g. `alpha`, `trans`) for that sweep's tables. `routine: "roofline"` gives each GPU's roofline table instead: roofs, ridge point, and every routine's intensity, GFLOP/s, GB/s and % of roof. Reads the result JSON from the wgblas repo on GitHub; set `WGBLAS_RESULTS_DIR` to a local `benchmarks/results` to read it from disk instead. |

## License

Apache-2.0
