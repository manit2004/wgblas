import { RendererEvent } from 'typedoc';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function walkHtml(dir, cb) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtml(full, cb);
    } else if (extname(entry) === '.html') {
      cb(full);
    }
  }
}

export function load(app) {
  app.renderer.on(RendererEvent.END, (event) => {
    walkHtml(event.outputDirectory, (file) => {
      const src = readFileSync(file, 'utf8');
      if (!src.includes('LINEHASH')) return;
      writeFileSync(file, src.replaceAll('LINEHASH', '#'));
    });
  });
}
