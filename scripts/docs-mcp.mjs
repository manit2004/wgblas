// The wgblas-docs MCP server (mcp/docs-mcp.mjs — published to npm as
// wgblas-docs-mcp), run from the repo against this checkout's own docs: it
// serves docs/api.json as `npm run docs` last wrote it, with no network
// access, so local doc changes show up before they're deployed.
//
//   claude mcp add wgblas-docs -- node scripts/docs-mcp.mjs
import { fileURLToPath } from "node:url";

process.env.WGBLAS_DOCS_JSON ??= fileURLToPath(
  new URL("../docs/api.json", import.meta.url),
);
await import("../mcp/docs-mcp.mjs");
