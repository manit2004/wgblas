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

import json
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


def fetch_json(gpu, backend, routine):
    url = f"{BASE_URL}/{gpu}/{backend}/{routine}.json"
    try:
        with urllib.request.urlopen(url) as r:
            return json.loads(r.read())
    except Exception:
        pass
    # fallback: read from local disk
    local = RESULTS_DIR / gpu / backend / f"{routine}.json"
    if local.exists():
        return json.loads(local.read_text())
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
        to_generate = [r for r in routines if r not in already_generated(gpu)]

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
            wgblas = fetch_json(gpu, "wgblas", routine)
            if wgblas is None:
                print(f"  skip {routine} (no wgblas data)")
                continue

            cuda = fetch_json(gpu, "cuda", routine) if has_cuda else None

            wgblas_link = f"{gh}/benchmarks/{routine}/benchmark.{routine}.js"

            if cuda:
                table = make_comparison_table(wgblas, cuda)
                cuda_link = f"{gh}/benchmarks/{routine}/cuda/benchmark.c"
                body = (
                    f"## {display} — wgblas vs cuBLAS\n\n"
                    + table
                    + "\n\n> Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. "
                    "Higher means wgblas is closer to cuBLAS throughput.\n\n"
                    "## See also\n\n"
                    f"- [benchmark.{routine}.js]({wgblas_link}) — WebGPU benchmark script\n"
                    f"- [benchmark.c]({cuda_link}) — CUDA / cuBLAS reference script"
                )
            else:
                table = make_wgblas_only_table(wgblas)
                body = (
                    f"## {display}\n\n"
                    + table
                    + "\n\n## See also\n\n"
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
