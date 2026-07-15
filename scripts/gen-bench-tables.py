#!/usr/bin/env python3
"""
Fetches benchmark JSONs from GitHub and generates TypeDoc module entry points
at benchmarks/bench-result/<gpu>/index.mjs and <routine>.mjs, with comparison
tables embedded in JSDoc so TypeDoc nests them under the 'benchmarks' module:

  M benchmarks
    └── <gpu-slug>
        ├── isamax
        ├── saxpy
        └── ...

Reads GPU folder names from local benchmarks/results/ to know what to fetch,
but always pulls JSON content from GitHub (not local disk) so that
skip-worktree'd local files are not used. Falls back to local disk if the
fetch fails (e.g. when results have not been pushed yet).
"""

import argparse
import json
import math
import sys
import urllib.request
from pathlib import Path

REPO = "manit2004/wgblas"
BRANCH = "main"
BASE_URL = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/benchmarks/results"

ROOT = Path(__file__).parent.parent
RESULTS_DIR = ROOT / "benchmarks" / "results"
OUT_DIR = ROOT / "benchmarks" / "bench-result"


def discover_routines():
    src_dir = ROOT / "src"
    in_src = {
        d.name for d in src_dir.iterdir()
        if d.is_dir() and (d / f"{d.name}.mjs").exists()
    }
    has_bench = set()
    for gpu_dir in RESULTS_DIR.iterdir():
        if not gpu_dir.is_dir():
            continue
        wgblas_dir = gpu_dir / "wgblas"
        if wgblas_dir.is_dir():
            has_bench.update(f.stem for f in wgblas_dir.glob("*.json"))
    return sorted(in_src & has_bench)


def already_generated(gpu):
    gpu_out = OUT_DIR / gpu
    if not gpu_out.exists():
        return set()
    return {f.stem for f in gpu_out.glob("*.mjs") if f.stem != "index"}


def fetch_json(gpu, backend, routine, local_only=False):
    if not local_only:
        url = f"{BASE_URL}/{gpu}/{backend}/{routine}.json"
        try:
            with urllib.request.urlopen(url) as r:
                return json.loads(r.read())
        except Exception:
            pass
    local = RESULTS_DIR / gpu / backend / f"{routine}.json"
    if local.exists():
        return json.loads(local.read_text())
    return None


def _tick_step(y_max):
    for step in [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 25, 50, 100, 200]:
        if y_max / step <= 6:
            return step
    return math.ceil(y_max / 5)


def _fmt_n(n):
    if n >= 1_000_000:
        v = n / 1_000_000
        return f"{v:.0f}M" if v >= 10 else f"{v:.1f}M"
    if n >= 10_000:
        return f"{n // 1_000}K"
    if n >= 1_000:
        v = n / 1_000
        return f"{v:.1f}K"
    return str(n)


def _fmt_axis_gbs(v):
    if v == 0:
        return "0"
    if v >= 10:
        return f"{v:.0f}"
    if v >= 1:
        return f"{v:.1f}"
    return f"{v:.2f}"


def _fmt_axis_ms(v):
    if v == 0:
        return "0"
    if v >= 1:
        return f"{v:.2f}"
    if v >= 0.1:
        return f"{v:.3f}"
    return f"{v:.4f}"


def _build_chart_svg(wgblas_rows, cuda_series, all_ns, xp,
                     y_key, y_label, y_fmt_fn, cid, show_legend):
    """Render one SVG panel. xp(n) maps n → x pixel; caller owns filtering."""
    W, H = 600, 260
    ML, MR, MT, MB = 58, 16, 20, 40
    PW = W - ML - MR
    PH = H - MT - MB

    all_y = [r[y_key] for r in wgblas_rows] + [r[y_key] for r in cuda_series]
    step = _tick_step(max(all_y))
    y_max = math.ceil(max(all_y) / step) * step
    yticks = [step * i for i in range(int(round(y_max / step)) + 1)]

    def yp(v):
        return MT + PH * (1.0 - v / y_max)

    stride = max(1, len(all_ns) // 7)
    x_label_ns = all_ns[::stride]
    if all_ns[-1] not in x_label_ns:
        x_label_ns.append(all_ns[-1])

    # Palette slots 1 (blue) and 2 (green) — pre-validated adjacent pair,
    # CVD ΔE 9.1 light / 8.4 dark (OKLab ×100, ≥8 target). palette.md §Categorical.
    css = "".join([
        f"#{cid} .bg{{fill:#fcfcfb}}",
        f"#{cid} .gr{{stroke:#e1e0d9;stroke-width:1;fill:none}}",
        f"#{cid} .ax{{stroke:#c3c2b7;stroke-width:1;fill:none}}",
        f"#{cid} .at{{fill:#898781;font:11px/1 system-ui,sans-serif}}",
        f"#{cid} .lt{{fill:#52514e;font:11px/1 system-ui,sans-serif}}",
        f"#{cid} .ln1{{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}}",
        f"#{cid} .mk1{{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}}",
        f"#{cid} .ln2{{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}}",
        f"#{cid} .mk2{{fill:#008300;stroke:#fcfcfb;stroke-width:2}}",
        "@media(prefers-color-scheme:dark){",
        f"#{cid} .bg{{fill:#1a1a19}}",
        f"#{cid} .gr{{stroke:#2c2c2a}}",
        f"#{cid} .ax{{stroke:#383835}}",
        f"#{cid} .at{{fill:#898781}}",
        f"#{cid} .lt{{fill:#c3c2b7}}",
        f"#{cid} .ln1{{stroke:#3987e5}}",
        f"#{cid} .mk1{{fill:#3987e5;stroke:#1a1a19}}",
        f"#{cid} .ln2{{stroke:#008300}}",
        f"#{cid} .mk2{{fill:#008300;stroke:#1a1a19}}",
        "}",
        f":root[data-theme=dark] #{cid} .bg{{fill:#1a1a19}}",
        f":root[data-theme=dark] #{cid} .gr{{stroke:#2c2c2a}}",
        f":root[data-theme=dark] #{cid} .ax{{stroke:#383835}}",
        f":root[data-theme=dark] #{cid} .lt{{fill:#c3c2b7}}",
        f":root[data-theme=dark] #{cid} .ln1{{stroke:#3987e5}}",
        f":root[data-theme=dark] #{cid} .mk1{{fill:#3987e5;stroke:#1a1a19}}",
        f":root[data-theme=dark] #{cid} .mk2{{stroke:#1a1a19}}",
    ])

    out = [
        f'<svg id="{cid}" xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'role="img" aria-label="{y_label} vs n">',
        f'<style>{css}</style>',
        f'<rect class="bg" width="{W}" height="{H}"/>',
    ]

    for y in yticks:
        yy = yp(y)
        out.append(f'<line class="gr" x1="{ML}" y1="{yy:.1f}" x2="{ML+PW}" y2="{yy:.1f}"/>')

    out.append(f'<line class="ax" x1="{ML}" y1="{MT}" x2="{ML}" y2="{MT+PH}"/>')
    out.append(f'<line class="ax" x1="{ML}" y1="{MT+PH}" x2="{ML+PW}" y2="{MT+PH}"/>')

    for y in yticks:
        yy = yp(y)
        out.append(
            f'<text class="at" x="{ML-6}" y="{yy+4:.1f}" text-anchor="end">'
            f'{y_fmt_fn(y)}</text>'
        )
    cy = MT + PH / 2
    out.append(
        f'<text class="lt" x="12" y="{cy:.1f}" text-anchor="middle" '
        f'transform="rotate(-90 12 {cy:.1f})">{y_label}</text>'
    )

    for n in x_label_ns:
        xx = xp(n)
        out.append(
            f'<text class="at" x="{xx:.1f}" y="{MT+PH+16}" text-anchor="middle">'
            f'{_fmt_n(n)}</text>'
        )

    def pts(rows):
        return " ".join(f"{xp(r['n']):.1f},{yp(r[y_key]):.1f}" for r in rows)

    out.append(f'<polyline class="ln1" points="{pts(wgblas_rows)}"/>')
    if cuda_series:
        out.append(f'<polyline class="ln2" points="{pts(cuda_series)}"/>')

    for row in wgblas_rows:
        xx, yy = xp(row["n"]), yp(row[y_key])
        out.append(f'<circle class="mk1" cx="{xx:.1f}" cy="{yy:.1f}" r="4"/>')
    for row in cuda_series:
        xx, yy = xp(row["n"]), yp(row[y_key])
        out.append(f'<circle class="mk2" cx="{xx:.1f}" cy="{yy:.1f}" r="4"/>')

    if show_legend and cuda_series:
        leg_y = MT + PH + 32
        out.append(f'<line class="ln1" x1="{ML}" y1="{leg_y}" x2="{ML+16}" y2="{leg_y}"/>')
        out.append(f'<circle class="mk1" cx="{ML+8}" cy="{leg_y}" r="4"/>')
        out.append(f'<text class="lt" x="{ML+22}" y="{leg_y+4}">wgblas</text>')
        out.append(f'<line class="ln2" x1="{ML+74}" y1="{leg_y}" x2="{ML+90}" y2="{leg_y}"/>')
        out.append(f'<circle class="mk2" cx="{ML+82}" cy="{leg_y}" r="4"/>')
        out.append(f'<text class="lt" x="{ML+96}" y="{leg_y+4}">cuBLAS</text>')

    out.append("</svg>")
    return "\n".join(out)


def make_svg_chart(wgblas_rows, cuda_rows, routine, gpu_slug):
    """Return two stacked SVG charts (GB/s then ms) separated by a spacer.

    Filters out rows with null compute_GBs or compute_ms before charting.
    """
    slug = gpu_slug.replace("-", "_")

    # Filter rows that have valid values for both metrics so both charts share
    # the same x-axis points
    wgblas_rows = [
        r for r in wgblas_rows
        if r.get("compute_GBs") is not None and r.get("compute_ms") not in (None, 0)
    ]
    cuda_rows = [
        r for r in cuda_rows
        if r.get("compute_GBs") is not None and r.get("compute_ms") not in (None, 0)
    ] if cuda_rows else []

    all_ns = sorted(r["n"] for r in wgblas_rows)
    if not all_ns:
        return ""

    cuda_by_n = {r["n"]: r for r in cuda_rows}
    cuda_series = [cuda_by_n[r["n"]] for r in wgblas_rows if r["n"] in cuda_by_n]

    lx_min = math.log10(all_ns[0])
    lx_max = math.log10(all_ns[-1])
    W, ML, MR = 600, 58, 16
    PW = W - ML - MR

    def xp(n):
        return ML + (math.log10(n) - lx_min) / (lx_max - lx_min) * PW

    gbs_svg = _build_chart_svg(
        wgblas_rows, cuda_series, all_ns, xp,
        "compute_GBs", "GB/s", _fmt_axis_gbs,
        f"bc-{routine}-{slug}-gbs", show_legend=True,
    )
    ms_svg = _build_chart_svg(
        wgblas_rows, cuda_series, all_ns, xp,
        "compute_ms", "ms", _fmt_axis_ms,
        f"bc-{routine}-{slug}-ms", show_legend=False,
    )

    return gbs_svg + "\n\n<br>\n\n" + ms_svg


def fmt_ms(v):
    return f"{v:.4f}" if v is not None else "—"


def fmt_gbs(v):
    return f"{v:.4f}" if v is not None else "—"


def fmt_pct(v):
    return f"{v:.1f}%" if v is not None else "—"


def make_comparison_table(wgblas_rows, cuda_rows):
    cuda_by_n = {r["n"]: r for r in cuda_rows}
    lines = [
        "| n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |",
        "|---|-----------|-------------|-----------|-------------|------------|",
    ]
    for row in wgblas_rows:
        n = row["n"]
        wms = row["compute_ms"]
        wgbs = row["compute_GBs"]
        c = cuda_by_n.get(n)
        if c:
            cms = c["compute_ms"]
            cgbs = c["compute_GBs"]
            eff = (wgbs / cgbs * 100) if (cgbs and wgbs) else None
            lines.append(
                f"| {n} | {fmt_ms(wms)} | {fmt_gbs(wgbs)} "
                f"| {fmt_ms(cms)} | {fmt_gbs(cgbs)} | {fmt_pct(eff)} |"
            )
        else:
            lines.append(
                f"| {n} | {fmt_ms(wms)} | {fmt_gbs(wgbs)} | — | — | — |"
            )
    return "\n".join(lines)


def make_wgblas_only_table(wgblas_rows):
    lines = [
        "| n | compute ms | GB/s |",
        "|---|------------|------|",
    ]
    for row in wgblas_rows:
        lines.append(
            f"| {row['n']} | {fmt_ms(row['compute_ms'])} | {fmt_gbs(row['compute_GBs'])} |"
        )
    return "\n".join(lines)


def gpu_display_name(folder):
    return folder.replace("-", " ").title()


def write_mjs(out_file, module_name, description, body):
    """Write a TypeDoc .mjs module: description first, @module last."""
    jsdoc_lines = ["/**", f" * {description}"]
    if body:
        jsdoc_lines.append(" *")
        for line in body.split("\n"):
            jsdoc_lines.append(f" * {line}" if line else " *")
    jsdoc_lines.append(" *")
    jsdoc_lines.append(f" * @module {module_name}")
    jsdoc_lines.append(" */")
    out_file.write_text("\n".join(jsdoc_lines) + "\n")


def main():
    parser = argparse.ArgumentParser(description="Generate bench-result .mjs files.")
    parser.add_argument("--local", action="store_true",
                        help="Read JSON from local disk instead of GitHub")
    parser.add_argument("--force", action="store_true",
                        help="Regenerate .mjs files even if they already exist")
    parser.add_argument("--routine", metavar="NAME",
                        help="Only regenerate this routine (implies --force for that routine)")
    args = parser.parse_args()

    gpu_folders = sorted(p.name for p in RESULTS_DIR.iterdir() if p.is_dir())
    if not gpu_folders:
        print("No GPU folders found in benchmarks/results/", file=sys.stderr)
        sys.exit(1)

    routines = discover_routines()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    gh = f"https://github.com/{REPO}/blob/{BRANCH}"

    for gpu in gpu_folders:
        local_gpu = RESULTS_DIR / gpu
        has_cuda = (local_gpu / "cuda").is_dir()
        has_wgblas = (local_gpu / "wgblas").is_dir()

        if not has_wgblas:
            continue

        out_gpu_dir = OUT_DIR / gpu
        out_gpu_dir.mkdir(parents=True, exist_ok=True)

        display = gpu_display_name(gpu)
        if args.routine:
            if args.routine not in routines:
                parser.error(f"Unknown routine '{args.routine}'. Known routines: {', '.join(routines)}")
            to_generate = [args.routine]
        else:
            skip = set() if args.force else already_generated(gpu)
            to_generate = [r for r in routines if r not in skip]

        # always (re)write the GPU index if any routines are being generated
        if to_generate:
            index_file = out_gpu_dir / "index.mjs"
            write_mjs(
                index_file,
                f"benchmarks/{gpu}",
                f"Benchmark results for all routines on {display}.",
                f"Run `make bench` to generate wgblas results"
                + (", or `make cuda` for cuBLAS results." if has_cuda else "."),
            )
            print(f"  wrote {index_file.relative_to(ROOT)}")
        else:
            print(f"GPU: {display} — up to date, skipping")
            continue

        print(f"GPU: {display}")

        for routine in to_generate:
            wgblas = fetch_json(gpu, "wgblas", routine, local_only=args.local)
            if wgblas is None:
                print(f"  skip {routine} (no wgblas data)")
                continue

            cuda = fetch_json(gpu, "cuda", routine, local_only=args.local) if has_cuda else None

            wgblas_link = f"{gh}/benchmarks/{routine}/benchmark.{routine}.js"

            if cuda:
                table = make_comparison_table(wgblas, cuda)
                cuda_link = f"{gh}/benchmarks/{routine}/cuda/benchmark.c"
                body = (
                    f"## {display} — wgblas vs cuBLAS\n\n"
                    + table
                    + "\n\n> Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. "
                    "Higher means wgblas is closer to cuBLAS throughput.\n\n"
                    + make_svg_chart(wgblas, cuda, routine, gpu) + "\n\n"
                    "## See also\n\n"
                    f"- [benchmark.{routine}.js]({wgblas_link}) — WebGPU benchmark script\n"
                    f"- [benchmark.c]({cuda_link}) — CUDA / cuBLAS reference script"
                )
            else:
                table = make_wgblas_only_table(wgblas)
                body = (
                    f"## {display}\n\n"
                    + table
                    + "\n\n"
                    + make_svg_chart(wgblas, None, routine, gpu) + "\n\n"
                    "## See also\n\n"
                    f"- [benchmark.{routine}.js]({wgblas_link}) — WebGPU benchmark script"
                )

            out_file = out_gpu_dir / f"{routine}.mjs"
            write_mjs(
                out_file,
                f"benchmarks/{gpu}/{routine}",
                f"Benchmark results for {routine} on {display}.",
                body,
            )
            print(f"  wrote {out_file.relative_to(ROOT)}")

    print("Done.")


if __name__ == "__main__":
    main()
