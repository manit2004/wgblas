// A local HTTP server for the test page. Pages need an origin to import
// modules from, and WebGPU needs a secure context, which http://127.0.0.1 and
// http://localhost are (a LAN address is not: a phone or another machine
// reaches it through a tunnel to its own localhost, such as `adb reverse`).
//
// It serves the files of one directory and of its bundles/ subdirectory —
// the page (page/ copied in), its manifest, the bundled test files — with
// index.html at /, and takes the page's events at POST /report.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

// A file directly in the directory or in bundles/: no other subdirectories,
// no way out of it.
const SERVABLE = /^(bundles\/)?[\w-][\w.-]*$/;

async function serveFile(dir, req, res) {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const name = path === "/" ? "index.html" : path.slice(1);
  if (!SERVABLE.test(name)) {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(join(dir, name));
    res
      .writeHead(200, {
        "content-type": TYPES[extname(name)] ?? "application/octet-stream",
        // Each run is a fresh build; a reloaded page must not reuse the last.
        "cache-control": "no-store",
      })
      .end(body);
  } catch {
    res.writeHead(404).end();
  }
}

async function takeReport(req, res, onReport) {
  let body = "";
  for await (const chunk of req) body += chunk;
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    res.writeHead(400).end();
    return;
  }
  res.writeHead(204).end();
  onReport(event);
}

/**
 * Serves `dir` on a free port of 127.0.0.1.
 * @param {string} dir
 * @param {(event: object) => void} onReport - called with each event the page
 *   POSTs to /report, in the order it sent them (it sends one at a time)
 * @returns {Promise<{ url: string, close: () => void }>} the base URL, ending
 *   in "/", and a close() that also drops the pages' keep-alive connections,
 *   which would otherwise keep Node running
 */
export function serveDirectory(dir, onReport) {
  const server = createServer((req, res) => {
    if (req.method === "POST" && req.url === "/report")
      takeReport(req, res, onReport);
    else if (req.method === "GET") serveFile(dir, req, res);
    else res.writeHead(405).end();
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}/`,
        close() {
          server.closeAllConnections();
          server.close();
        },
      }),
    );
  });
}
