// A local HTTP server for the bundled tests. Pages need an origin to import
// modules from, and WebGPU needs a secure context, which http://127.0.0.1 is.
// It serves an empty page at / and the files directly inside one directory as
// JavaScript; nothing else.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const EMPTY_PAGE = "<!doctype html><title>wgblas tests</title>";

async function respond(dir, req, res) {
  const name = decodeURIComponent(new URL(req.url, "http://x").pathname).slice(
    1,
  );
  if (name === "") {
    res.writeHead(200, { "content-type": "text/html" }).end(EMPTY_PAGE);
    return;
  }
  // Only files directly in dir: no subdirectories, no way out of it.
  if (/[/\\]|\.\./.test(name)) {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(join(dir, name));
    res.writeHead(200, { "content-type": "text/javascript" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}

/**
 * Serves `dir` on a free port of 127.0.0.1.
 * @param {string} dir
 * @returns {Promise<{ url: string, close: () => void }>} the base URL, ending
 *   in "/", and a close() that also drops the pages' keep-alive connections,
 *   which would otherwise keep Node running
 */
export function serveDirectory(dir) {
  const server = createServer((req, res) => respond(dir, req, res));
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
