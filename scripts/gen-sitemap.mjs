// Generates docs/sitemap.xml and docs/robots.txt. Run after `npx typedoc`
// (see the "docs" npm script) — typedoc wipes its output directory on every
// build, so anything under docs/ that isn't part of its own output (like
// robots.txt) has to be (re)written after it runs, not just once. The
// sitemap walks every .html page TypeDoc just built, so Google (and other
// crawlers) can discover the whole doc tree in one fetch instead of relying
// purely on following in-page links.
import { readdirSync, statSync, writeFileSync, copyFileSync } from "fs";
import { join, relative } from "path";

const SITE_URL = "https://manit2004.github.io/wgblas";
const DOCS_DIR = "docs";

// Static files that must be served from docs/ root but aren't typedoc
// output — e.g. search-engine ownership verification files (Google's
// google<hash>.html, Bing's BingSiteAuth.xml). Source of truth lives in
// assets/docs/ (untouched by typedoc's output-directory wipe); add new
// verification files there and list them here.
const STATIC_ROOT_FILES = ["google53e32ad8e8c1b544.html"];
for (const name of STATIC_ROOT_FILES) {
  copyFileSync(join("assets/docs", name), join(DOCS_DIR, name));
  console.log(`Copied docs/${name}.`);
}

function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectHtmlFiles(full));
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const urls = collectHtmlFiles(DOCS_DIR)
  .map((file) => relative(DOCS_DIR, file).split("\\").join("/"))
  .filter((path) => !STATIC_ROOT_FILES.includes(path))
  .sort()
  .map((path) => {
    const loc = path === "index.html" ? `${SITE_URL}/` : `${SITE_URL}/${path}`;
    return `  <url><loc>${loc}</loc></url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(DOCS_DIR, "sitemap.xml"), sitemap);
console.log(`Wrote docs/sitemap.xml (${urls.split("\n").length} URLs).`);

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
writeFileSync(join(DOCS_DIR, "robots.txt"), robotsTxt);
console.log("Wrote docs/robots.txt.");
