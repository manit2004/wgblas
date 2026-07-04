#!/usr/bin/env python3
"""
Fetches benchmark JSONs from GitHub and generates per-GPU per-routine
markdown comparison tables into assets/bench-result/Benchmarks/<gpu>/<routine>.md.

Reads GPU folder names from local benchmarks/results/ to know what to fetch,
but always pulls JSON content from GitHub (not local disk) so that
skip-worktree'd local files are not used.

Routines are discovered from the JSON files that exist in any GPU's wgblas/
subfolder. OUT_DIR is derived by finding Benchmarks.md
in the assets/ tree and using its sibling Benchmarks/ folder.
"""

import json
import sys
import urllib.request
from pathlib import Path

REPO = "manit2004/wgblas"
BRANCH = "main"
BASE_URL = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/benchmarks/results"

ROOT = Path(__file__).parent.parent
RESULTS_DIR = ROOT / "benchmarks" / "results"
OUT_DIR = ROOT / "assets" / "bench-result" / "Benchmarks"


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
    return {f.stem for f in gpu_out.glob("*.md")}


def fetch_json(gpu, backend, routine):
    url = f"{BASE_URL}/{gpu}/{backend}/{routine}.json"
    try:
        with urllib.request.urlopen(url) as r:
            return json.loads(r.read())
    except Exception:
        return None


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


def main():
    gpu_folders = sorted(p.name for p in RESULTS_DIR.iterdir() if p.is_dir())
    if not gpu_folders:
        print("No GPU folders found in benchmarks/results/", file=sys.stderr)
        sys.exit(1)

    routines = discover_routines()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for gpu in gpu_folders:
        local_gpu = RESULTS_DIR / gpu
        has_cuda = (local_gpu / "cuda").is_dir()
        has_wgblas = (local_gpu / "wgblas").is_dir()

        if not has_wgblas:
            continue

        out_gpu_dir = OUT_DIR / gpu
        out_gpu_dir.mkdir(parents=True, exist_ok=True)

        display = gpu_display_name(gpu)
        to_generate = [r for r in routines if r not in already_generated(gpu)]
        if not to_generate:
            print(f"GPU: {display} — up to date, skipping")
            continue
        print(f"GPU: {display}")

        for routine in to_generate:
            wgblas = fetch_json(gpu, "wgblas", routine)
            if wgblas is None:
                print(f"  skip {routine} (no wgblas data on GitHub)")
                continue

            if has_cuda:
                cuda = fetch_json(gpu, "cuda", routine)
            else:
                cuda = None

            gh = f"https://github.com/{REPO}/blob/{BRANCH}"
            wgblas_link = f"{gh}/benchmarks/{routine}/benchmark.{routine}.js"

            if cuda:
                table = make_comparison_table(wgblas, cuda)
                header = f"## {display} — wgblas vs cuBLAS\n\n"
                note = (
                    "\n\n> Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. "
                    "Higher means wgblas is closer to cuBLAS throughput."
                )
                cuda_link = f"{gh}/benchmarks/{routine}/cuda/benchmark.c"
                see_also = (
                    f"\n\n## See also\n\n"
                    f"- [benchmark.{routine}.js]({wgblas_link}) — WebGPU benchmark script\n"
                    f"- [benchmark.c]({cuda_link}) — CUDA / cuBLAS reference script"
                )
            else:
                table = make_wgblas_only_table(wgblas)
                header = f"## {display}\n\n"
                note = ""
                see_also = (
                    f"\n\n## See also\n\n"
                    f"- [benchmark.{routine}.js]({wgblas_link}) — WebGPU benchmark script"
                )

            content = f"# {routine}\n\n" + header + table + note + see_also + "\n"
            out_file = out_gpu_dir / f"{routine}.md"
            out_file.write_text(content)
            print(f"  wrote {out_file.relative_to(ROOT)}")

    print("Done.")


if __name__ == "__main__":
    main()
