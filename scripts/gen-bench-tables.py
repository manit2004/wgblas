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
SVG_DIR = ROOT / "assets" / "benchmarks"

# .mjs files always live at benchmarks/bench-result/<gpu>/<routine>.mjs, so the
# relative path back up to the repo root (and into assets/benchmarks/<gpu>/)
# is the same fixed depth for every one of them.
SVG_LINK_PREFIX = "../../../assets/benchmarks"

# Every routine's base benchmark rows are keyed by "n" — except strsm, whose
# blocked triangular solve sweeps matrix "order" instead (see
# benchmarks/strsm/wgblas/strsm.js's own COLS). Without this, every "n" in row
# filter below silently drops all of strsm's rows and produces an empty table.
X_KEY_OVERRIDES = {"strsm": "order"}


def x_key(routine):
    return X_KEY_OVERRIDES.get(routine, "n")


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
        if not wgblas_dir.is_dir():
            continue
        has_bench.update(f.stem for f in wgblas_dir.glob("*.json"))
        # migrated routines nest their results at wgblas/<routine>/<routine>.json
        for sub in wgblas_dir.iterdir():
            if sub.is_dir() and (sub / f"{sub.name}.json").exists():
                has_bench.add(sub.name)
    return sorted(in_src & has_bench)


def already_generated(gpu):
    gpu_out = OUT_DIR / gpu
    if not gpu_out.exists():
        return set()
    return {f.stem for f in gpu_out.glob("*.mjs") if f.stem != "index"}


def fetch_json(gpu, backend, rel_path, local_only=False):
    """rel_path is relative to benchmarks/results/<gpu>/<backend>/, without .json."""
    if not local_only:
        url = f"{BASE_URL}/{gpu}/{backend}/{rel_path}.json"
        try:
            with urllib.request.urlopen(url) as r:
                return json.loads(r.read())
        except Exception:
            pass
    local = RESULTS_DIR / gpu / backend / f"{rel_path}.json"
    if local.exists():
        return json.loads(local.read_text())
    return None


def fetch_main(gpu, backend, routine, local_only=False):
    """Routines migrated to the nested benchmarks/<routine>/wgblas/<routine>.js
    layout store results at <backend>/<routine>/<routine>.json; older ones are
    still flat at <backend>/<routine>.json. Try nested first, fall back to flat."""
    data = fetch_json(gpu, backend, f"{routine}/{routine}", local_only)
    if data is not None:
        return data
    return fetch_json(gpu, backend, routine, local_only)


def fetch_stride(gpu, backend, routine, local_only=False):
    """Stride-sweep companion file — only present for routines with a
    stride.<routine> benchmark alongside the main one. None if absent."""
    return fetch_json(gpu, backend, f"{routine}/stride.{routine}", local_only)


def fetch_trans(gpu, backend, routine, local_only=False):
    """Trans-sweep companion file — only present for routines with a
    trans.<routine> benchmark alongside the main one (currently sgemv,
    strmv). None if absent."""
    return fetch_json(gpu, backend, f"{routine}/trans.{routine}", local_only)


def fetch_uplo(gpu, backend, routine, local_only=False):
    """Uplo-sweep companion file — only present for routines where uplo was
    confirmed to be a real effect (currently ssyr, ssyr2 — not ssymv/strmv,
    where it was scoped and found to be a non-effect). None if absent."""
    return fetch_json(gpu, backend, f"{routine}/uplo.{routine}", local_only)


def fetch_lda(gpu, backend, routine, local_only=False):
    """Lda-sweep companion file — present for routines where lda was
    confirmed to be a real effect (ssymv, ssyr, ssyr2, sger, strmv — not
    sgemv, where it was scoped and found to be a non-effect). For strmv
    specifically this is a combined trans×pad sweep (records carry a
    "trans" key too, since lda only mattered for trans="transpose" there);
    every other routine's records are just {pad, n, ...}. None if absent."""
    return fetch_json(gpu, backend, f"{routine}/lda.{routine}", local_only)


def fetch_ldb(gpu, backend, routine, local_only=False):
    """Ldb-sweep companion file — currently just sgemm, where transA/lda
    were confirmed non-effects but transB/ldb are real (an asymmetry from
    B's tile dimension spanning a full warp where A's doesn't). Records
    carry a "transB" key (combined transB×pad sweep, same shape idea as
    strmv's lda.strmv but keyed transB instead of trans, and named ldb
    rather than lda since that's the parameter that actually matters here).
    None if absent."""
    return fetch_json(gpu, backend, f"{routine}/ldb.{routine}", local_only)


def script_path(routine, backend):
    """Repo-relative path to a routine's benchmark script, preferring the
    migrated benchmarks/<routine>/<backend>/<routine>.{js,c} layout and
    falling back to the older flat benchmark.<routine>.js / benchmark.c."""
    if backend == "wgblas":
        nested = ROOT / "benchmarks" / routine / "wgblas" / f"{routine}.js"
        if nested.exists():
            return f"benchmarks/{routine}/wgblas/{routine}.js"
        return f"benchmarks/{routine}/benchmark.{routine}.js"
    nested = ROOT / "benchmarks" / routine / "cuda" / f"{routine}.c"
    if nested.exists():
        return f"benchmarks/{routine}/cuda/{routine}.c"
    return f"benchmarks/{routine}/cuda/benchmark.c"


def stride_script_path(routine, backend):
    """Repo-relative path to a routine's stride-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/stride.{routine}.{ext}"


def trans_script_path(routine, backend):
    """Repo-relative path to a routine's trans-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/trans.{routine}.{ext}"


def uplo_script_path(routine, backend):
    """Repo-relative path to a routine's uplo-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/uplo.{routine}.{ext}"


def lda_script_path(routine, backend):
    """Repo-relative path to a routine's lda-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/lda.{routine}.{ext}"


def ldb_script_path(routine, backend):
    """Repo-relative path to a routine's ldb-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/ldb.{routine}.{ext}"


def group_by_stride(rows):
    """Groups stride-sweep rows by 'stride', sorting each group's rows by n
    ascending. Returns a dict ordered by ascending stride."""
    groups = {}
    for r in rows:
        groups.setdefault(r["stride"], []).append(r)
    for g in groups.values():
        g.sort(key=lambda r: r["n"])
    return dict(sorted(groups.items()))


def group_by_uplo(rows):
    """Groups uplo-sweep rows by 'uplo', sorting each group's rows by n
    ascending. Returns a dict ordered "lower" then "upper" (alphabetical
    happens to match the desired order)."""
    groups = {}
    for r in rows:
        groups.setdefault(r["uplo"], []).append(r)
    for g in groups.values():
        g.sort(key=lambda r: r["n"])
    return dict(sorted(groups.items()))


def group_by_pad(rows):
    """Groups lda-sweep rows by 'pad', sorting each group's rows by n
    ascending. Returns a dict ordered by ascending pad. Only for routines
    with a plain {pad, n, ...} lda sweep (not strmv's combined trans×pad
    one — see group_by_trans_and_pad)."""
    groups = {}
    for r in rows:
        groups.setdefault(r["pad"], []).append(r)
    for g in groups.values():
        g.sort(key=lambda r: r["n"])
    return dict(sorted(groups.items()))


def group_by_trans_and_pad(rows):
    """Groups a combined trans×pad lda-sweep (currently just strmv) by
    'trans' then by 'pad', sorting each innermost group's rows by n
    ascending. Same shape as group_by_trans_and_m, keyed by pad instead
    of m."""
    groups = {}
    for r in rows:
        groups.setdefault(r["trans"], {}).setdefault(r["pad"], []).append(r)
    for by_pad in groups.values():
        for g in by_pad.values():
            g.sort(key=lambda r: r["n"])
    return {
        trans: dict(sorted(by_pad.items()))
        for trans, by_pad in sorted(groups.items())
    }


def group_by_transB_and_pad(rows):
    """Groups a combined transB×pad ldb-sweep (currently just sgemm) by
    'transB' then by 'pad', sorting each innermost group's rows by n
    ascending. Same shape as group_by_trans_and_pad, keyed by transB
    instead of trans (sgemm's transA/lda were confirmed non-effects, so
    only transB/ldb get a combined sweep)."""
    groups = {}
    for r in rows:
        groups.setdefault(r["transB"], {}).setdefault(r["pad"], []).append(r)
    for by_pad in groups.values():
        for g in by_pad.values():
            g.sort(key=lambda r: r["n"])
    return {
        transB: dict(sorted(by_pad.items()))
        for transB, by_pad in sorted(groups.items())
    }


def group_by_transA_transB(rows):
    """Groups sgemm's trans sweep by 'transA' then by 'transB', sorting each
    innermost group's rows by n ascending. A 2x2 grid of (transA, transB)
    combinations, each with its own n sweep — distinct from sgemv's
    trans×m grid (group_by_trans_and_m) and strmv's single-axis trans
    (group_by_trans)."""
    groups = {}
    for r in rows:
        groups.setdefault(r["transA"], {}).setdefault(r["transB"], []).append(r)
    for by_tb in groups.values():
        for g in by_tb.values():
            g.sort(key=lambda r: r["n"])
    return {
        transA: dict(sorted(by_tb.items()))
        for transA, by_tb in sorted(groups.items())
    }


def group_by_trans(rows):
    """Groups a single-axis trans sweep (currently just strmv, always square
    n×n — no separate m) by 'trans', sorting each group's rows by n
    ascending. Not for sgemv's m×n-grid trans sweep — see
    group_by_trans_and_m for that shape."""
    groups = {}
    for r in rows:
        groups.setdefault(r["trans"], []).append(r)
    for g in groups.values():
        g.sort(key=lambda r: r["n"])
    return dict(sorted(groups.items()))


def group_by_trans_and_m(rows):
    """Groups trans-sweep rows by 'trans' then by 'm', sorting each innermost
    group's rows by n ascending. Returns nested dicts ordered by trans
    ("no-transpose" before "transpose" — alphabetical happens to match) then
    ascending m."""
    groups = {}
    for r in rows:
        groups.setdefault(r["trans"], {}).setdefault(r["m"], []).append(r)
    for by_m in groups.values():
        for g in by_m.values():
            g.sort(key=lambda r: r["n"])
    return {
        trans: dict(sorted(by_m.items()))
        for trans, by_m in sorted(groups.items())
    }


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
                     y_key, y_label, y_fmt_fn, cid, show_legend, xk="n"):
    """Render one SVG panel. xp(n) maps n → x pixel; caller owns filtering.
    xk is the row key plotted on the x-axis — "n" for every routine except
    strsm ("order"), see X_KEY_OVERRIDES."""
    W, H = 600, 260
    ML, MR, MT, MB = 58, 16, 20, 40
    PW = W - ML - MR
    PH = H - MT - MB

    all_y = [r[y_key] for r in wgblas_rows] + [r[y_key] for r in cuda_series]
    step = _tick_step(max(all_y))
    y_max = math.ceil(max(all_y) / step) * step
    if y_max == 0:
        y_max = step
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
        f'role="img" aria-label="{y_label} vs {xk}">',
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
        return " ".join(f"{xp(r[xk]):.1f},{yp(r[y_key]):.1f}" for r in rows)

    out.append(f'<polyline class="ln1" points="{pts(wgblas_rows)}"/>')
    if cuda_series:
        out.append(f'<polyline class="ln2" points="{pts(cuda_series)}"/>')

    for row in wgblas_rows:
        xx, yy = xp(row[xk]), yp(row[y_key])
        out.append(f'<circle class="mk1" cx="{xx:.1f}" cy="{yy:.1f}" r="4"/>')
    for row in cuda_series:
        xx, yy = xp(row[xk]), yp(row[y_key])
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


def write_svg(gpu_slug, routine, metric, config, svg_text):
    """Writes one chart's SVG to assets/benchmarks/<gpu>/<routine>/<metric>-
    <config>.svg (metric is "gbps" or "ms"; config is "default" for the main
    benchmark or a sweep label like "stride4") and returns the markdown image
    link to it, relative to a .mjs file living at
    benchmarks/bench-result/<gpu>/<routine>.mjs — TypeDoc auto-detects
    relative image links in doc comments and copies the target into
    docs/media/, so this needs no typedoc.json changes.

    Note: TypeDoc's media copy flattens every file into one shared
    docs/media/ folder keyed only by basename (see FileRegistry.getName), so
    same-named files (e.g. every routine's "gbps-default.svg") collide there
    and get auto-disambiguated to "gbps-default-2.svg" etc. That's harmless —
    docs/media/ is a regenerated build artifact nobody browses directly, and
    each page's <img> still resolves to its own correct file — but it does
    mean the gpu/routine directories here are purely for keeping this source
    tree organized, not for uniqueness in the published output.
    """
    fname = f"{metric}-{config}.svg"
    path = SVG_DIR / gpu_slug / routine / fname
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg_text)
    return f"{SVG_LINK_PREFIX}/{gpu_slug}/{routine}/{fname}"


# --- scalar sweeps (alpha, cosine, sine) --------------------------------------
#
# These three share a shape the earlier sweeps do not: one scalar key, no
# grouping dimension beyond it, and — unlike stride/trans/uplo/lda — an expected
# result of "no effect". sscal/saxpy/srot's shaders contain no branch at all, so
# no value of alpha/c/s can select a different path; the sweeps exist to hold
# that to measurement rather than to reading. One builder covers all three
# rather than three near-identical ones, keyed by the record field each uses.

SCALAR_SWEEPS = {
    # prefix -> (record key, human label, prose for the section intro)
    "alpha": ("alpha", "alpha", (
        "`alpha` is a plain multiplier here: the kernel applies it "
        "unconditionally, with no branch for any particular value. A flat "
        "sweep is therefore the expected result and is recorded as a measured "
        "null. Levels include `0`, `1` and a denormal-producing `1e-38` "
        "because those are the values a shader *could* special-case if it ever "
        "grew a branch — and `strsm` is the routine where one does."
    )),
    "cosine": ("c", "c", (
        "The cosine half of the plane rotation, swept with `s` held fixed so "
        "the two halves are attributed separately. `srot`'s kernel computes "
        "both outputs unconditionally, so a flat sweep is expected; a step at "
        "`c = 0` or `c = 1` would mean an identity case is being "
        "short-circuited, which BLAS does not promise."
    )),
    "sine": ("s", "s", (
        "The sine half of the plane rotation, swept with `c` held fixed — the "
        "counterpart to the cosine sweep. `s = 0` makes the rotation an "
        "identity in exact arithmetic but is still fully computed and written, "
        "so a step there would indicate a short-circuit rather than a property "
        "of the maths."
    )),
}


def fetch_scalar(gpu, backend, routine, prefix, local_only=False):
    """<prefix>.<routine> companion file for a scalar sweep, or None."""
    return fetch_json(gpu, backend, f"{routine}/{prefix}.{routine}", local_only)


def scalar_script_path(routine, backend, prefix):
    """Repo-relative path to a routine's scalar-sweep benchmark script."""
    ext = "js" if backend == "wgblas" else "c"
    return f"benchmarks/{routine}/{backend}/{prefix}.{routine}.{ext}"


def group_by_scalar(rows, key):
    """Groups scalar-sweep rows by `key`, each group sorted by n ascending.
    Ordered by the scalar's numeric value so the tables read low to high."""
    groups = {}
    for r in rows:
        groups.setdefault(r[key], []).append(r)
    for g in groups.values():
        g.sort(key=lambda r: r["n"])
    return dict(sorted(groups.items(), key=lambda kv: float(kv[0])))


def make_scalar_section(wrows, crows_all, routine, gpu, display, gh, prefix):
    """One table + chart per value of a scalar parameter."""
    key, label, blurb = SCALAR_SWEEPS[prefix]
    groups = group_by_scalar(wrows, key)
    cuda_groups = group_by_scalar(crows_all, key) if crows_all else {}

    parts = [f"## {label} sweep\n", blurb + "\n"]
    for value, rows in groups.items():
        crows = cuda_groups.get(value, [])
        parts.append(f"<details>\n<summary>{display} — {label} = {value}</summary>\n")
        parts.append(
            make_comparison_table(rows, crows, routine) if crows
            else make_wgblas_only_table(rows, routine)
        )
        parts.append("")
        # Value goes in the chart config so each one gets its own file rather
        # than the last group overwriting the rest.
        chart = make_svg_chart(rows, crows, routine, gpu,
                               config=f"{prefix}{str(value).replace('.', 'p').replace('-', 'neg')}")
        if chart:
            parts.append(chart)
        parts.append("")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [{prefix}.{routine}.js]({gh}/{scalar_script_path(routine, 'wgblas', prefix)}) "
        f"— WebGPU {label}-sweep benchmark script"
    )
    if crows_all:
        parts.append(
            f"- [{prefix}.{routine}.c]({gh}/{scalar_script_path(routine, 'cuda', prefix)}) "
            f"— CUDA / cuBLAS {label}-sweep reference script"
        )
    return "\n".join(parts)


def make_svg_chart(wgblas_rows, cuda_rows, routine, gpu_slug, config="default"):
    """Writes two chart SVGs (GB/s then ms) to
    assets/benchmarks/<gpu>/<routine>/ and returns markdown linking both,
    stacked. `config` identifies which benchmark configuration is plotted —
    "default" for the main (unswept) benchmark, or a sweep label like
    "stride4" / "uplo-lower" for sweep subsections.

    Filters out rows with null compute_GBs or compute_ms before charting.
    """
    slug = gpu_slug.replace("-", "_")
    chart_id = f"{routine}-{config}"
    xk = x_key(routine)

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

    all_ns = sorted(r[xk] for r in wgblas_rows if xk in r)
    if not all_ns:
        return ""

    cuda_by_n = {r[xk]: r for r in cuda_rows if xk in r}
    cuda_series = [cuda_by_n[r[xk]] for r in wgblas_rows if r[xk] in cuda_by_n]

    lx_min = math.log10(all_ns[0])
    lx_max = math.log10(all_ns[-1])
    if lx_max == lx_min:
        lx_max = lx_min + 1
    W, ML, MR = 600, 58, 16
    PW = W - ML - MR

    def xp(n):
        return ML + (math.log10(n) - lx_min) / (lx_max - lx_min) * PW

    gbs_svg = _build_chart_svg(
        wgblas_rows, cuda_series, all_ns, xp,
        "compute_GBs", "GB/s", _fmt_axis_gbs,
        f"bc-{chart_id}-{slug}-gbs", show_legend=True, xk=xk,
    )
    ms_svg = _build_chart_svg(
        wgblas_rows, cuda_series, all_ns, xp,
        "compute_ms", "ms", _fmt_axis_ms,
        f"bc-{chart_id}-{slug}-ms", show_legend=False, xk=xk,
    )

    gbs_link = write_svg(gpu_slug, routine, "gbps", config, gbs_svg)
    ms_link = write_svg(gpu_slug, routine, "ms", config, ms_svg)

    return (
        f"![{chart_id} GB/s chart]({gbs_link})\n\n"
        f"![{chart_id} ms chart]({ms_link})"
    )


def fmt_ms(v):
    return f"{v:.4f}" if v is not None else "—"


def fmt_gbs(v):
    return f"{v:.4f}" if v is not None else "—"


def fmt_pct(v):
    return f"{v:.1f}%" if v is not None else "—"


def make_comparison_table(wgblas_rows, cuda_rows, routine=None):
    xk = x_key(routine)
    cuda_by_x = {r[xk]: r for r in cuda_rows if xk in r}
    lines = [
        f"| {xk} | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |",
        "|---|-----------|-------------|-----------|-------------|------------|",
    ]
    for row in wgblas_rows:
        if xk not in row:
            continue
        n = row[xk]
        wms = row["compute_ms"]
        wgbs = row["compute_GBs"]
        c = cuda_by_x.get(n)
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


def make_wgblas_only_table(wgblas_rows, routine=None):
    xk = x_key(routine)
    lines = [
        f"| {xk} | compute ms | GB/s |",
        "|---|------------|------|",
    ]
    for row in wgblas_rows:
        lines.append(
            f"| {row[xk]} | {fmt_ms(row['compute_ms'])} | {fmt_gbs(row['compute_GBs'])} |"
        )
    return "\n".join(lines)


def make_stride_section(wgblas_stride, cuda_stride, routine, gpu, display, gh):
    """Builds the stride-sweep subsection: one table + chart per stride value,
    stride groups in ascending order, each group's rows sorted n ascending.
    """
    groups = group_by_stride(wgblas_stride)
    cuda_groups = group_by_stride(cuda_stride) if cuda_stride else {}

    parts = [
        "## Stride sweep\n",
        f"Unless noted otherwise, every result above uses unit stride "
        f"(`incx = incy = 1`) — the normal case, and the coalesced, "
        f"best-case GPU access pattern. Real usage sometimes passes a "
        f"non-unit stride (e.g. operating on a row or column of a larger "
        f"matrix, where `incx = lda`), which breaks memory coalescing and "
        f"costs measurably more. This section sweeps a few representative "
        f"strides to characterize that cost separately, collapsed below by "
        f"default — expand a stride to see its table and chart.\n",
    ]
    for stride, wrows in groups.items():
        crows = cuda_groups.get(stride, [])
        parts.append(f"<details>\n<summary>{display} — stride = {stride}</summary>\n")
        parts.append(
            make_comparison_table(wrows, crows, routine) if crows
            else make_wgblas_only_table(wrows, routine)
        )
        parts.append("")
        chart = make_svg_chart(wrows, crows, routine, gpu, config=f"stride{stride}")
        if chart:
            parts.append(chart)
        parts.append("")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [stride.{routine}.js]({gh}/{stride_script_path(routine, 'wgblas')}) "
        "— WebGPU stride-sweep benchmark script"
    )
    if cuda_stride:
        parts.append(
            f"- [stride.{routine}.c]({gh}/{stride_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS stride-sweep reference script"
        )
    return "\n".join(parts)


def make_trans_section(wgblas_trans, cuda_trans, routine, gpu, display, gh):
    """Builds the trans-sweep subsection: one table + chart per (trans, m)
    pair, sweeping n ascending within each — trans groups in "no-transpose"
    then "transpose" order, m ascending within each trans.
    """
    groups = group_by_trans_and_m(wgblas_trans)
    cuda_groups = group_by_trans_and_m(cuda_trans) if cuda_trans else {}

    parts = [
        "## Transpose sweep\n",
        f"Unless noted otherwise, every result above uses `trans = "
        f"\"no-transpose\"`. `trans = \"transpose\"`'s parallelism is bounded "
        f"by `n` (one workgroup per output-column tile) rather than `m`, so "
        f"it's slower at matched square shapes and substantially slower on "
        f"tall-narrow shapes — this section sweeps every `(m, n)` pair for "
        f"both `trans` values to characterize that shape sensitivity, not "
        f"just a single square-shape A/B. Collapsed by default since it's "
        f"{sum(len(by_m) for by_m in groups.values())} shape combinations — "
        f"expand a `trans` value, then a shape, to see its table and chart.\n",
    ]
    for trans, by_m in groups.items():
        cuda_by_m = cuda_groups.get(trans, {})
        parts.append(f"<details>\n<summary>{display} — trans = {trans} ({len(by_m)} shapes)</summary>\n")
        for m, wrows in by_m.items():
            crows = cuda_by_m.get(m, [])
            parts.append(f"<details>\n<summary>m = {m}</summary>\n")
            parts.append(
                make_comparison_table(wrows, crows, routine) if crows
                else make_wgblas_only_table(wrows, routine)
            )
            parts.append("")
            chart = make_svg_chart(wrows, crows, routine, gpu, config=f"trans-{trans}-m{m}")
            if chart:
                parts.append(chart)
            parts.append("")
            parts.append("</details>\n")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [trans.{routine}.js]({gh}/{trans_script_path(routine, 'wgblas')}) "
        "— WebGPU trans-sweep benchmark script"
    )
    if cuda_trans:
        parts.append(
            f"- [trans.{routine}.c]({gh}/{trans_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS trans-sweep reference script"
        )
    return "\n".join(parts)


def make_trans_simple_section(wgblas_trans, cuda_trans, routine, gpu, display, gh):
    """Like make_trans_section, but for a single-axis trans sweep (currently
    just strmv, always square n×n — no m×n grid to group by). "trans" then
    n ascending, same shape as make_stride_section/make_uplo_section.
    """
    groups = group_by_trans(wgblas_trans)
    cuda_groups = group_by_trans(cuda_trans) if cuda_trans else {}

    parts = [
        "## Transpose sweep\n",
        f"Unless noted otherwise, every result above uses `trans = "
        f"\"no-transpose\"`. `trans = \"transpose\"` reads A with a "
        f"cross-thread `lda`-strided mirror pattern instead of a coalesced "
        f"one, and the gap grows with `n` — collapsed below by default, "
        f"expand a `trans` value to see its table and chart.\n",
    ]
    for trans, wrows in groups.items():
        crows = cuda_groups.get(trans, [])
        parts.append(f"<details>\n<summary>{display} — trans = {trans}</summary>\n")
        parts.append(
            make_comparison_table(wrows, crows, routine) if crows
            else make_wgblas_only_table(wrows, routine)
        )
        parts.append("")
        chart = make_svg_chart(wrows, crows, routine, gpu, config=f"trans{trans}")
        if chart:
            parts.append(chart)
        parts.append("")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [trans.{routine}.js]({gh}/{trans_script_path(routine, 'wgblas')}) "
        "— WebGPU trans-sweep benchmark script"
    )
    if cuda_trans:
        parts.append(
            f"- [trans.{routine}.c]({gh}/{trans_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS trans-sweep reference script"
        )
    return "\n".join(parts)


def make_transab_section(wgblas_trans, cuda_trans, routine, gpu, display, gh):
    """Builds sgemm's trans sweep: a 2x2 (transA, transB) grid, transA outer
    then transB, each with its own n sweep. Distinct from sgemv's trans×m
    grid and strmv's single-axis trans — sgemm has two independent trans
    flags, and they're asymmetric (transB dominates, transA is small/mixed)
    because of a tile-dimension mismatch (B's BN=64 spans a full warp in
    the no-transpose case, A's BK=8 never does).
    """
    groups = group_by_transA_transB(wgblas_trans)
    cuda_groups = group_by_transA_transB(cuda_trans) if cuda_trans else {}

    total = sum(len(by_tb) for by_tb in groups.values())
    parts = [
        "## Transpose sweep\n",
        f"Unless noted otherwise, every result above uses `transA = transB "
        f"= \"no-transpose\"`. Both shaders load A/B into shared memory "
        f"with a transpose-dependent index that scatters what would "
        f"otherwise be a coalesced load — but it's asymmetric: `transB` "
        f"dominates (measured +22-57% at n=1024) while `transA` is small "
        f"and can even be *faster* than no-transpose, because B's tile "
        f"dimension spans a full warp in the coalesced case (so transpose "
        f"scatters every warp) while A's never gets a full-warp-coalesced "
        f"load to begin with. All 4 `(transA, transB)` combinations are "
        f"swept — collapsed below by default, expand a `transA` value, "
        f"then a `transB`, to see its table and chart ({total} "
        f"combinations total).\n",
    ]
    for transA, by_tb in groups.items():
        cuda_by_tb = cuda_groups.get(transA, {})
        parts.append(f"<details>\n<summary>{display} — transA = {transA} ({len(by_tb)} transB values)</summary>\n")
        for transB, wrows in by_tb.items():
            crows = cuda_by_tb.get(transB, [])
            parts.append(f"<details>\n<summary>transB = {transB}</summary>\n")
            parts.append(
                make_comparison_table(wrows, crows, routine) if crows
                else make_wgblas_only_table(wrows, routine)
            )
            parts.append("")
            chart = make_svg_chart(wrows, crows, routine, gpu, config=f"trans-{transA}-{transB}")
            if chart:
                parts.append(chart)
            parts.append("")
            parts.append("</details>\n")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [trans.{routine}.js]({gh}/{trans_script_path(routine, 'wgblas')}) "
        "— WebGPU trans-sweep benchmark script"
    )
    if cuda_trans:
        parts.append(
            f"- [trans.{routine}.c]({gh}/{trans_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS trans-sweep reference script"
        )
    return "\n".join(parts)


def make_ldb_section(wgblas_ldb, cuda_ldb, routine, gpu, display, gh):
    """Builds sgemm's ldb sweep: a combined transB×pad sweep (transA/lda
    were confirmed non-effects, so only transB/ldb get one). Same nesting
    shape as make_lda_trans_section, keyed transB instead of trans and
    titled "Ldb sweep" since ldb — not lda — is the parameter that matters.
    """
    groups = group_by_transB_and_pad(wgblas_ldb)
    cuda_groups = group_by_transB_and_pad(cuda_ldb) if cuda_ldb else {}

    parts = [
        "## Ldb sweep\n",
        f"Unless noted otherwise, every result above uses a tight `lda`/"
        f"`ldb`/`ldc` (no padding). `lda` and `ldc` were scoped and found "
        f"to be non-effects; padding `ldb` only matters for `transB = "
        f"\"transpose\"` here (swept at both `transB` values below so "
        f"that's visible in the data). Collapsed below by default — "
        f"expand a `transB` value, then a `pad`, to see its table and "
        f"chart.\n",
    ]
    for transB, by_pad in groups.items():
        cuda_by_pad = cuda_groups.get(transB, {})
        parts.append(f"<details>\n<summary>{display} — transB = {transB} ({len(by_pad)} pads)</summary>\n")
        for pad, wrows in by_pad.items():
            crows = cuda_by_pad.get(pad, [])
            parts.append(f"<details>\n<summary>pad = {pad}</summary>\n")
            parts.append(
                make_comparison_table(wrows, crows, routine) if crows
                else make_wgblas_only_table(wrows, routine)
            )
            parts.append("")
            chart = make_svg_chart(wrows, crows, routine, gpu, config=f"ldb-{transB}-pad{pad}")
            if chart:
                parts.append(chart)
            parts.append("")
            parts.append("</details>\n")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [ldb.{routine}.js]({gh}/{ldb_script_path(routine, 'wgblas')}) "
        "— WebGPU ldb-sweep benchmark script"
    )
    if cuda_ldb:
        parts.append(
            f"- [ldb.{routine}.c]({gh}/{ldb_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS ldb-sweep reference script"
        )
    return "\n".join(parts)


def make_uplo_section(wgblas_uplo, cuda_uplo, routine, gpu, display, gh):
    """Builds the uplo-sweep subsection: one table + chart per uplo value,
    "lower" then "upper", each group's rows sorted n ascending. Only built
    for routines where uplo was confirmed to be a real effect (ssyr,
    ssyr2) — dispatch-order workload imbalance, ~1.7-1.8x slower for upper.
    """
    groups = group_by_uplo(wgblas_uplo)
    cuda_groups = group_by_uplo(cuda_uplo) if cuda_uplo else {}

    parts = [
        "## Uplo sweep\n",
        f"Unless noted otherwise, every result above uses `uplo = "
        f"\"lower\"`. Real workgroups dispatch in increasing index order, "
        f"so `uplo = \"upper\"` front-loads the heaviest rows first "
        f"(worse — long-running heavy workgroups have nothing to overlap "
        f"with) while `lower` back-loads them (better — light rows clear "
        f"fast, the heavy tail gets full GPU to itself) — collapsed below "
        f"by default, expand a `uplo` value to see its table and chart.\n",
    ]
    for uplo, wrows in groups.items():
        crows = cuda_groups.get(uplo, [])
        parts.append(f"<details>\n<summary>{display} — uplo = {uplo}</summary>\n")
        parts.append(
            make_comparison_table(wrows, crows, routine) if crows
            else make_wgblas_only_table(wrows, routine)
        )
        parts.append("")
        chart = make_svg_chart(wrows, crows, routine, gpu, config=f"uplo{uplo}")
        if chart:
            parts.append(chart)
        parts.append("")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [uplo.{routine}.js]({gh}/{uplo_script_path(routine, 'wgblas')}) "
        "— WebGPU uplo-sweep benchmark script"
    )
    if cuda_uplo:
        parts.append(
            f"- [uplo.{routine}.c]({gh}/{uplo_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS uplo-sweep reference script"
        )
    return "\n".join(parts)


def make_lda_section(wgblas_lda, cuda_lda, routine, gpu, display, gh):
    """Builds the lda-sweep subsection: one table + chart per pad value,
    ascending pad, rows sorted n ascending. Each routine's lda-sensitivity
    mechanism was confirmed empirically and differs, so the
    intro text is routine-specific rather than a single generic blurb.
    """
    groups = group_by_pad(wgblas_lda)
    cuda_groups = group_by_pad(cuda_lda) if cuda_lda else {}

    parts = [
        "## Lda sweep\n",
        f"Unless noted otherwise, every result above uses a tight `lda` "
        f"(no padding). Padding the row stride changes throughput here — "
        f"the exact mechanism and shape of that effect is routine-specific "
        f"— collapsed below by default, expand a `pad` value to see its "
        f"table and chart.\n",
    ]
    for pad, wrows in groups.items():
        crows = cuda_groups.get(pad, [])
        parts.append(f"<details>\n<summary>{display} — pad = {pad}</summary>\n")
        parts.append(
            make_comparison_table(wrows, crows, routine) if crows
            else make_wgblas_only_table(wrows, routine)
        )
        parts.append("")
        chart = make_svg_chart(wrows, crows, routine, gpu, config=f"pad{pad}")
        if chart:
            parts.append(chart)
        parts.append("")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [lda.{routine}.js]({gh}/{lda_script_path(routine, 'wgblas')}) "
        "— WebGPU lda-sweep benchmark script"
    )
    if cuda_lda:
        parts.append(
            f"- [lda.{routine}.c]({gh}/{lda_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS lda-sweep reference script"
        )
    return "\n".join(parts)


def make_lda_trans_section(wgblas_lda, cuda_lda, routine, gpu, display, gh):
    """Like make_lda_section, but for a combined trans×pad lda sweep
    (currently just strmv, where lda only mattered for trans="transpose").
    trans groups in "no-transpose" then "transpose" order, pad ascending
    within each.
    """
    groups = group_by_trans_and_pad(wgblas_lda)
    cuda_groups = group_by_trans_and_pad(cuda_lda) if cuda_lda else {}

    parts = [
        "## Lda sweep\n",
        f"Unless noted otherwise, every result above uses a tight `lda` "
        f"(no padding). Padding the row stride only matters for `trans = "
        f"\"transpose\"` here (swept at both `trans` values below so "
        f"that's visible in the data, not just claimed). Collapsed below "
        f"by default — expand a `trans` value, then a `pad`, to see its "
        f"table and chart.\n",
    ]
    for trans, by_pad in groups.items():
        cuda_by_pad = cuda_groups.get(trans, {})
        parts.append(f"<details>\n<summary>{display} — trans = {trans} ({len(by_pad)} pads)</summary>\n")
        for pad, wrows in by_pad.items():
            crows = cuda_by_pad.get(pad, [])
            parts.append(f"<details>\n<summary>pad = {pad}</summary>\n")
            parts.append(
                make_comparison_table(wrows, crows, routine) if crows
                else make_wgblas_only_table(wrows, routine)
            )
            parts.append("")
            chart = make_svg_chart(wrows, crows, routine, gpu, config=f"lda-{trans}-pad{pad}")
            if chart:
                parts.append(chart)
            parts.append("")
            parts.append("</details>\n")
        parts.append("</details>\n")

    parts.append("**See also:**\n")
    parts.append(
        f"- [lda.{routine}.js]({gh}/{lda_script_path(routine, 'wgblas')}) "
        "— WebGPU lda-sweep benchmark script"
    )
    if cuda_lda:
        parts.append(
            f"- [lda.{routine}.c]({gh}/{lda_script_path(routine, 'cuda')}) "
            "— CUDA / cuBLAS lda-sweep reference script"
        )
    return "\n".join(parts)


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
            wgblas = fetch_main(gpu, "wgblas", routine, local_only=args.local)
            if wgblas is None:
                print(f"  skip {routine} (no wgblas data)")
                continue

            cuda = fetch_main(gpu, "cuda", routine, local_only=args.local) if has_cuda else None
            wgblas_stride = fetch_stride(gpu, "wgblas", routine, local_only=args.local)
            cuda_stride = fetch_stride(gpu, "cuda", routine, local_only=args.local) if has_cuda else None
            wgblas_trans = fetch_trans(gpu, "wgblas", routine, local_only=args.local)
            cuda_trans = fetch_trans(gpu, "cuda", routine, local_only=args.local) if has_cuda else None
            wgblas_uplo = fetch_uplo(gpu, "wgblas", routine, local_only=args.local)
            cuda_uplo = fetch_uplo(gpu, "cuda", routine, local_only=args.local) if has_cuda else None
            wgblas_lda = fetch_lda(gpu, "wgblas", routine, local_only=args.local)
            cuda_lda = fetch_lda(gpu, "cuda", routine, local_only=args.local) if has_cuda else None
            wgblas_ldb = fetch_ldb(gpu, "wgblas", routine, local_only=args.local)
            cuda_ldb = fetch_ldb(gpu, "cuda", routine, local_only=args.local) if has_cuda else None

            wgblas_link = f"{gh}/{script_path(routine, 'wgblas')}"
            wgblas_script_name = script_path(routine, "wgblas").rsplit("/", 1)[-1]

            if cuda:
                table = make_comparison_table(wgblas, cuda, routine)
                cuda_link = f"{gh}/{script_path(routine, 'cuda')}"
                cuda_script_name = script_path(routine, "cuda").rsplit("/", 1)[-1]
                body = (
                    f"## {display} — wgblas vs cuBLAS\n\n"
                    + table
                    + "\n\n> Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. "
                    "100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.\n\n"
                    + make_svg_chart(wgblas, cuda, routine, gpu) + "\n\n"
                    "## See also\n\n"
                    f"- [{wgblas_script_name}]({wgblas_link}) — WebGPU benchmark script\n"
                    f"- [{cuda_script_name}]({cuda_link}) — CUDA / cuBLAS reference script"
                )
            else:
                table = make_wgblas_only_table(wgblas, routine)
                body = (
                    f"## {display}\n\n"
                    + table
                    + "\n\n"
                    + make_svg_chart(wgblas, None, routine, gpu) + "\n\n"
                    "## See also\n\n"
                    f"- [{wgblas_script_name}]({wgblas_link}) — WebGPU benchmark script"
                )

            if wgblas_stride:
                body += "\n\n" + make_stride_section(
                    wgblas_stride, cuda_stride, routine, gpu, display, gh
                )

            if wgblas_trans:
                # sgemv's trans sweep is a full m×n grid (records carry an
                # "m" key); sgemm's is a transA×transB grid (records carry a
                # "transA" key); strmv's is a single n-axis (always square,
                # no separate m, just "trans") — dispatch to the matching
                # section builder.
                if "m" in wgblas_trans[0]:
                    body += "\n\n" + make_trans_section(
                        wgblas_trans, cuda_trans, routine, gpu, display, gh
                    )
                elif "transA" in wgblas_trans[0]:
                    body += "\n\n" + make_transab_section(
                        wgblas_trans, cuda_trans, routine, gpu, display, gh
                    )
                else:
                    body += "\n\n" + make_trans_simple_section(
                        wgblas_trans, cuda_trans, routine, gpu, display, gh
                    )

            if wgblas_uplo:
                body += "\n\n" + make_uplo_section(
                    wgblas_uplo, cuda_uplo, routine, gpu, display, gh
                )

            if wgblas_lda:
                # strmv's lda sweep is a combined trans×pad one (records
                # carry a "trans" key); every other routine's is plain
                # {pad, n, ...} — dispatch to the matching section builder.
                if "trans" in wgblas_lda[0]:
                    body += "\n\n" + make_lda_trans_section(
                        wgblas_lda, cuda_lda, routine, gpu, display, gh
                    )
                else:
                    body += "\n\n" + make_lda_section(
                        wgblas_lda, cuda_lda, routine, gpu, display, gh
                    )

            if wgblas_ldb:
                body += "\n\n" + make_ldb_section(
                    wgblas_ldb, cuda_ldb, routine, gpu, display, gh
                )

            # Scalar sweeps are optional per routine: alpha exists for sscal
            # and saxpy, cosine/sine only for srot.
            for prefix in SCALAR_SWEEPS:
                wrows = fetch_scalar(gpu, "wgblas", routine, prefix, local_only=args.local)
                if not wrows:
                    continue
                crows = (fetch_scalar(gpu, "cuda", routine, prefix, local_only=args.local)
                         if has_cuda else None)
                body += "\n\n" + make_scalar_section(
                    wrows, crows, routine, gpu, display, gh, prefix
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
