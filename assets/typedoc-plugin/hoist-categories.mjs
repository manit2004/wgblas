import { RendererEvent } from 'typedoc';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { inflateSync, deflateSync } from 'zlib';

// Hoists the children of the single module entry (kind 2 = Module) up to the
// top level of the navigation tree, removing the module wrapper itself.
// This makes BLAS Level 1, Core, Utilities, Classes appear as siblings of
// project document groups (e.g. Benchmarks) rather than nested inside "index".
export function load(app) {
  app.renderer.on(RendererEvent.END, (event) => {
    const navFile = join(event.outputDirectory, 'assets', 'navigation.js');
    let content;
    try {
      content = readFileSync(navFile, 'utf8');
    } catch {
      return;
    }

    const match = content.match(/window\.navigationData = "([^"]+)"/);
    if (!match) return;

    const nav = JSON.parse(inflateSync(Buffer.from(match[1], 'base64')).toString('utf8'));

    const result = [];
    for (const entry of nav) {
      if (entry.kind === 2 && entry.children) {
        result.push(...entry.children);
      } else {
        result.push(entry);
      }
    }

    const recompressed = deflateSync(Buffer.from(JSON.stringify(result), 'utf8')).toString('base64');
    writeFileSync(navFile, `window.navigationData = "${recompressed}"`);
  });
}
