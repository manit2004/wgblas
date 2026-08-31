#!/usr/bin/env python3
"""
Roofline and ridge-point analysis over the benchmark results tree.

A roofline places every measured kernel at (arithmetic intensity, achieved
FLOP/s) under two ceilings: a sloped memory roof (AI x peak bandwidth) and a
flat compute roof (peak FLOP/s). Where they meet is the *ridge point* — the
intensity above which a kernel can be compute-bound at all. Below it, no amount
of kernel tuning beats the bandwidth line, which is the single most useful thing
this tells you about a BLAS implementation: Level 1 and 2 live permanently to
the left of the ridge, so their only lever is bandwidth efficiency.

Arithmetic intensity comes straight out of what the benchmarks already record.
Both rates share the same denominator (median gpuTimeMs), so

    AI = compute_GFLOPs / compute_GBs

exactly, with no need to re-derive byte counts. The Level 3 benchmarks record
both rates and are used as-is. Level 1 and most of Level 2 record only
compute_GBs, so this module supplies the FLOP count (see FLOPS below) and
derives GFLOP/s = compute_GBs x AI.

Two caveats are inherent to the method and worth stating plainly, because the
plot will not show them:

  * These are *algorithmic* intensities — FLOPs over compulsory traffic, which
    assumes perfect caching. For Level 1 and 2 (pure streaming, no reuse) that
    is essentially exact. For tiled Level 3 kernels real DRAM traffic is higher
    than the compulsory count, so the true point sits to the LEFT of where it
    is plotted and the plotted AI is an upper bound. Getting actual traffic
    needs hardware counters (ncu --metrics dram__bytes__sum), which WebGPU does
    not expose — the CUDA benchmarks can supply a calibration factor.

  * Nothing is filtered out. Rows that exceed the measured roof are listed
    with how far past it they sit, but they stay in the table and the JSON —
    see above_roof() for why a row lands there.

  * The empirical compute roof is circular if it is taken from the very kernels
    being plotted: sgemm defines the ceiling, so sgemm scores 100% of it. The
    Both roofs therefore come from independent probes —
    benchmarks/roofline/wgblas/fma.js for compute and bandwidth.js for memory —
    which are the only source of ceilings here; nothing is hardcoded per GPU
    and an unprobed device is skipped. Pass --empirical-roof to use the best
    observed rates instead, and read the sgemm row knowing what it means.

Usage:
    python3 scripts/roofline.py                     # table for every GPU found
    python3 scripts/roofline.py --gpu <slug> --svg  # one GPU, plus the chart
"""

import argparse
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
RESULTS_DIR = ROOT / "benchmarks" / "results"
SVG_DIR = ROOT / "assets" / "benchmarks"

# BLAS level drives the colour and, more importantly, the expectation: level 1
# and 2 are memory-bound by construction and level 3 is the only one with reuse.
LEVEL = {}
for _r in ("sasum dasum isamax idamax snrm2 sscal saxpy sdot scopy sswap srot "
           "srotm").split():
    LEVEL[_r] = 1
for _r in "sgemv sger ssymv ssyr ssyr2 strmv strsv".split():
    LEVEL[_r] = 2
for _r in "sgemm sgemmtr ssymm ssyrk ssyr2k strmm strsm".split():
    LEVEL[_r] = 3


def _d(rec, key, *fallbacks):
    """Sweep files key their rows by whatever they vary, so a record may carry
    'n' alone where the main benchmark carried 'm' and 'n'. Fall back through
    the alternatives before giving up, and return None so the caller can skip
    the row rather than crash on a partially-dimensioned sweep."""
    for k in (key, *fallbacks):
        if rec.get(k) is not None:
            return rec[k]
    return None


def _strsm_n(r, nbytes):
    """strsm.js records `order` but not the other extent, which it holds fixed
    at OTHER_LEN. Rather than duplicate that constant here (and silently rot
    when it changes), recover it from the byte count the benchmark did record:
    bytes/4 = order(order+1)/2 + 2*order*n, so n falls straight out."""
    order = _d(r, "order", "m", "n")
    if not order or not nbytes:
        return None
    n = (nbytes / 4 - order * (order + 1) / 2) / (2 * order)
    return n if n > 0 else None


# Standard BLAS FLOP counts, used only for routines whose benchmarks record
# bytes but not FLOPs. Where a benchmark records compute_GFLOPs itself, that
# value wins — this table never overrides a measurement. Counts follow the
# usual convention: one multiply-add is 2 flops, and index searches (isamax,
# idamax) and pure data movement (scopy, sswap) are 0, which puts them at AI=0,
# correctly pinned to the bandwidth roof.
#
# Each entry takes (record, recovered_bytes); almost none need the second, but
# strsm does. The Level 3 entries exist only for their *sweep* files, which
# record bytes alone — the main benchmarks record FLOPs and are used directly.
# Those sweeps all fix k = n (see e.g. lda.ssyrk.js:37), which is why k falls
# back to n.
FLOPS = {
    "sscal":  lambda r, b: _d(r, "n"),
    "sasum":  lambda r, b: _d(r, "n"),
    "dasum":  lambda r, b: _d(r, "n"),
    "snrm2":  lambda r, b: 2 * _d(r, "n"),
    "sdot":   lambda r, b: 2 * _d(r, "n"),
    "saxpy":  lambda r, b: 2 * _d(r, "n"),
    "scopy":  lambda r, b: 0,
    "sswap":  lambda r, b: 0,
    "isamax": lambda r, b: 0,
    "idamax": lambda r, b: 0,
    "srot":   lambda r, b: 6 * _d(r, "n"),
    "srotm":  lambda r, b: 6 * _d(r, "n"),
    "sgemv":  lambda r, b: 2 * _d(r, "m", "n") * _d(r, "n"),
    "sger":   lambda r, b: 2 * _d(r, "m", "n") * _d(r, "n"),
    "ssymv":  lambda r, b: 2 * _d(r, "n") ** 2,
    "ssyr":   lambda r, b: _d(r, "n") * (_d(r, "n") + 1),
    "ssyr2":  lambda r, b: 2 * _d(r, "n") * (_d(r, "n") + 1),
    "strmv":  lambda r, b: _d(r, "n") ** 2,
    "strsv":  lambda r, b: _d(r, "n") ** 2,
    "ssyrk":  lambda r, b: 2 * _d(r, "n") ** 2 * _d(r, "k", "n") + _d(r, "n") ** 2,
    "ssyr2k": lambda r, b: 4 * _d(r, "n") ** 2 * _d(r, "k", "n") + _d(r, "n") ** 2,
    "strsm":  lambda r, b: (lambda n: _d(r, "order", "m", "n") ** 2 * n if n else None)(
        _strsm_n(r, b)),
}


def above_roof(rec, peak_flops, peak_bw):
    """Whether a row claims more than the probes measured. Reported, never
    dropped: nothing here filters the data.

    A row lands here for two very different reasons and the analysis does not
    presume which. It may be a real measurement the probes failed to match —
    on the integrated GPU several Level 1 routines beat the bandwidth probe by
    a few percent, because a short kernel runs in a turbo power state the
    probe's sustained load does not hold. Or the FLOP/byte count credited to
    the row may not describe the work that ran: alpha.strsm skips the
    triangular solve at alpha=0 but is still charged the full order^2 * n
    FLOPs, which scores 11x the card's peak.

    The ratio separates them in practice — percent-level overshoot is the
    former, order-of-magnitude the latter — but that is a judgement for the
    reader, so both are listed with their numbers.
    """
    return rec["gflops"] > peak_flops or rec["gbs"] > peak_bw


def load_records(gpu, backend="wgblas"):
    """Walks benchmarks/results/<gpu>/<backend>/ and returns one entry per
    measured configuration, annotated with routine, sweep file, AI, and rates."""
    base = RESULTS_DIR / gpu / backend
    if not base.is_dir():
        return [], []
    out, skipped = [], []
    for path in sorted(base.rglob("*.json")):
        routine = path.parent.name if path.parent != base else path.stem
        if routine == "roofline":
            continue  # the FMA probe's own results — a ceiling, not a data point
        if routine not in LEVEL:
            skipped.append((path.name, "routine not in the BLAS level map"))
            continue
        try:
            rows = json.loads(path.read_text())
        except (json.JSONDecodeError, OSError) as exc:
            skipped.append((path.name, f"unreadable: {exc}"))
            continue
        for rec in rows:
            gbs = rec.get("compute_GBs")
            if not gbs:
                continue
            gf = rec.get("compute_GFLOPs")
            if gf:
                ai = gf / gbs
            else:
                # Derive from the standard FLOP count and the recorded byte
                # rate; both rates share the median-time denominator, so
                # bytes = GBs * 1e9 * ms/1e3 recovers the exact byte count.
                fn = FLOPS.get(routine)
                ms = rec.get("compute_ms")
                if fn is None or not ms:
                    skipped.append((path.name, "no FLOP count available"))
                    continue
                nbytes = gbs * 1e9 * ms / 1e3
                try:
                    flops = fn(rec, nbytes)
                except TypeError:
                    skipped.append((path.name, "sweep row lacks the dimensions"))
                    continue
                if flops is None:
                    skipped.append((path.name, "sweep row lacks the dimensions"))
                    continue
                ai = flops / nbytes if nbytes else 0.0
                gf = gbs * ai
            out.append({
                "routine": routine,
                "level": LEVEL[routine],
                "file": path.name,
                "config": path.stem,
                "size": _d(rec, "n", "order", "m") or 0,
                "ai": ai,
                "gflops": gf,
                "gbs": gbs,
                "ms": rec.get("compute_ms"),
                "measured_flops": bool(rec.get("compute_GFLOPs")),
            })
    return out, skipped


def _probe_max(gpu, name, key):
    """Best value a roofline probe recorded, or 0 if it has not been run."""
    path = RESULTS_DIR / gpu / "wgblas" / "roofline" / f"{name}.json"
    if not path.exists():
        return 0.0
    try:
        return max(r.get(key, 0) for r in json.loads(path.read_text()))
    except (json.JSONDecodeError, OSError, ValueError):
        return 0.0


def ceilings(gpu, records, empirical=False, override_flops=None, override_bw=None):
    """Returns (peak_flops, peak_bw, source_label). Spec by default because an
    empirical compute roof taken from these same records is self-referential."""
    obs_bw = max((r["gbs"] for r in records), default=0.0)
    obs_fl = max((r["gflops"] for r in records), default=0.0)

    # Both roofs come from the probes in benchmarks/roofline/. They are
    # independent kernels — an FMA chain out of registers, and a pure stream —
    # so unlike the observed maxima they are not taken from the routines being
    # measured against them, and unlike a datasheet figure they are what this
    # device actually delivers. Nothing here is hardcoded per GPU: a device is
    # either probed or skipped.
    probe_fl = _probe_max(gpu, "fma", "compute_GFLOPs")
    probe_bw = _probe_max(gpu, "bandwidth", "compute_GBs")
    if override_flops and override_bw:
        return override_flops, override_bw, "user-supplied"
    if empirical:
        return (override_flops or obs_fl, override_bw or obs_bw, "observed maxima")
    pf = override_flops or probe_fl
    pb = override_bw or probe_bw
    if not pf or not pb:
        return (obs_fl, obs_bw, "observed maxima (probes not run for this GPU)")
    return pf, pb, "measured (fma.js + bandwidth.js)"


def attainable(ai, peak_flops, peak_bw):
    """The roof itself: bandwidth-limited on the slope, FLOP-limited on the flat."""
    return min(peak_flops, ai * peak_bw)


def pct_of_roof(rec, peak_flops, peak_bw):
    """How much of the attainable roof this configuration reached.

    On the memory-bound slope this is gflops/(ai*peak_bw), which reduces
    exactly to gbs/peak_bw — and the reduced form stays defined at AI=0, where
    the routine does no arithmetic at all (scopy, sswap, isamax, idamax) and
    the sloped roof is zero. Using it for the whole slope keeps one formula."""
    if rec["ai"] < peak_flops / peak_bw:
        return rec["gbs"] / peak_bw * 100 if peak_bw else 0.0
    return rec["gflops"] / peak_flops * 100 if peak_flops else 0.0


def summary_rows(records):
    """One row per routine: its largest configuration from the main benchmark,
    which is where a kernel is closest to its asymptotic behaviour."""
    best = {}
    for r in records:
        if r["config"] != r["routine"]:
            continue
        cur = best.get(r["routine"])
        if cur is None or r["size"] > cur["size"]:
            best[r["routine"]] = r
    return best or {r["routine"]: r for r in records}


def save_report(gpu, records, peak_flops, peak_bw, source):
    """Writes the per-device analysis alongside that device's own results, so
    the table survives the terminal and can be diffed between runs. The roof
    and its provenance are stored with it — a number like "79% of roof" means
    nothing without knowing which roof, and whether it was measured or typed
    in from a datasheet."""
    best = summary_rows(records)
    ridge = peak_flops / peak_bw
    out = {
        "gpu": gpu,
        "peak_GFLOPs": peak_flops,
        "peak_GBs": peak_bw,
        "roof_source": source,
        "ridge_FLOP_per_byte": ridge,
        "routines": [
            {
                "routine": r["routine"],
                "level": r["level"],
                "size": r["size"],
                "arithmetic_intensity": r["ai"],
                "compute_GFLOPs": r["gflops"],
                "compute_GBs": r["gbs"],
                "roof_GFLOPs": attainable(r["ai"], peak_flops, peak_bw),
                "pct_of_roof": pct_of_roof(r, peak_flops, peak_bw),
                "bound": "compute" if r["ai"] >= ridge else "memory",
                "flops_measured": r["measured_flops"],
            }
            for _, r in sorted(best.items(), key=lambda kv: (LEVEL[kv[0]], kv[0]))
        ],
    }
    path = RESULTS_DIR / gpu / "wgblas" / "roofline" / "roofline.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, indent=2) + "\n")
    return path


def print_report(gpu, records, skipped, peak_flops, peak_bw, source, verbose=False):
    ridge = peak_flops / peak_bw
    print(f"\n{'=' * 86}")
    print(f"{gpu}   roof: {peak_flops:,.0f} GFLOP/s  x  {peak_bw:,.1f} GB/s   ({source})")
    print(f"ridge point: {ridge:.2f} FLOP/byte — below this, a kernel cannot be compute-bound")
    if "observed" in source:
        print("WARNING: the roof comes from these same measurements, so whichever kernel")
        print("         defines it scores 100% by construction, and the ridge point is only")
        print("         as high as the best kernel present. Run `make bench-roofline`.")
    print("=" * 86)

    if not records:
        print("  no usable records")
        return

    best = summary_rows(records)

    hdr = f"{'routine':10}{'level':>6}{'size':>9}{'AI':>10}{'GFLOP/s':>10}{'GB/s':>8}{'roof':>10}{'% roof':>8}  bound"
    print(hdr)
    print("-" * len(hdr))
    for routine in sorted(best, key=lambda k: (LEVEL[k], k)):
        r = best[routine]
        roof = attainable(r["ai"], peak_flops, peak_bw)
        pct = pct_of_roof(r, peak_flops, peak_bw)
        bound = "compute" if r["ai"] >= ridge else "memory"
        star = "" if r["measured_flops"] else "*"
        print(f"{routine + star:10}{r['level']:>6}{r['size']:>9}{r['ai']:>10.3f}"
              f"{r['gflops']:>10.1f}{r['gbs']:>8.1f}{roof:>10.1f}{pct:>7.0f}%  {bound}")
    print("\n* FLOP count supplied by scripts/roofline.py; the benchmark records bytes only.")

    mem = [r for r in best.values() if r["ai"] < ridge]
    com = [r for r in best.values() if r["ai"] >= ridge]
    if mem:
        worst = min(mem, key=lambda r: pct_of_roof(r, peak_flops, peak_bw))
        print(f"  memory-bound: {len(mem)} routines; furthest from its roof is "
              f"{worst['routine']} at {pct_of_roof(worst, peak_flops, peak_bw):.0f}%")
    if com:
        worst = min(com, key=lambda r: r["gflops"])
        print(f"  compute-bound: {len(com)} routines; lowest is {worst['routine']} at "
              f"{worst['gflops'] / peak_flops * 100:.0f}% of peak")

    if skipped:
        counts = {}
        for _, why in skipped:
            counts[why] = counts.get(why, 0) + 1
        print("\n  excluded rows:")
        for why, n in sorted(counts.items(), key=lambda kv: -kv[1]):
            print(f"    {n:5}  {why}")
        if verbose:
            for name, why in skipped:
                print(f"      {name}: {why}")


# Categorical slots 1-3 (blue / orange / aqua), light and dark steps, from the
# data-viz reference palette. A roofline is a scatter, so every pair is on
# screen at once and the all-pairs gate applies — which caps the palette at
# three slots. That is exactly the three BLAS levels, so nothing folds to
# "Other". Validated with scripts/validate_palette.js --pairs all: worst CVD
# dE 9.2 light / 9.4 dark, worst normal-vision dE 24.0 / 20.9. Aqua sits at
# 2.74:1 on the light surface, below the 3:1 contrast gate, so the relief rule
# applies and every point carries a visible direct label (and the CLI prints
# the same data as a table). The roof and ridge are reference geometry, not
# series, so they wear muted ink rather than a categorical hue.
SERIES = {
    1: ("#2a78d6", "#3987e5", "Level 1"),
    2: ("#eb6834", "#d95926", "Level 2"),
    3: ("#1baf7a", "#199e70", "Level 3"),
}


def _log_ticks(lo, hi):
    """Decade ticks spanning [lo, hi], both already log10."""
    return list(range(math.floor(lo), math.ceil(hi) + 1))



def _cluster(pts, xp, yp, radius=11):
    """Groups markers whose pixel positions are within `radius`, by single-link
    with transitive closure. Several routines share an arithmetic intensity
    exactly — AI is a rational number out of the FLOP/byte formula, so sasum,
    sdot and sger all sit at exactly 0.250 — and where their achieved rates
    also agree the markers genuinely coincide. Rather than hide one under
    another or nudge a point off its true coordinates, the cluster keeps every
    marker and carries a single label naming all of them."""
    groups = []
    for r in pts:
        x, y = xp(r["ai"]), yp(r["gflops"])
        for g in groups:
            if any(math.hypot(x - xp(o["ai"]), y - yp(o["gflops"])) < radius for o in g):
                g.append(r)
                break
        else:
            groups.append([r])
    merged = True
    while merged:
        merged = False
        for i in range(len(groups)):
            for j in range(i + 1, len(groups)):
                if any(math.hypot(xp(a["ai"]) - xp(b["ai"]),
                                  yp(a["gflops"]) - yp(b["gflops"])) < radius
                       for a in groups[i] for b in groups[j]):
                    groups[i] += groups.pop(j)
                    merged = True
                    break
            if merged:
                break
    return groups


def _fmt_pow(e):
    if e < 0:
        return f"{10.0 ** e:g}"
    if e <= 4:
        return f"{10 ** e:,}"
    return f"1e{e}"


def build_svg(records, peak_flops, peak_bw, gpu, cid="roofline"):
    """Log-log roofline: AI on x, achieved GFLOP/s on y, the two ceilings drawn
    as one polyline, and the ridge marked where they meet. Points with AI=0
    (pure data movement — scopy, sswap, and the index searches) have no place
    on a log axis and are omitted; the table still lists them.

    The axes span four decades each to cover both Level 1 and Level 3, which
    puts the memory-bound routines close together — the docs page makes the
    chart zoomable rather than shipping a second cropped panel."""
    ridge = peak_flops / peak_bw
    pts = [r for r in records if r["ai"] > 0 and r["gflops"] > 0]
    if not pts:
        return None, 0
    W, H = 720, 420
    ML, MR, MT, MB = 62, 112, 26, 52
    PW, PH = W - ML - MR, H - MT - MB

    ais = [r["ai"] for r in pts] + [ridge]
    gfs = [r["gflops"] for r in pts] + [peak_flops]
    lx0, lx1 = math.floor(math.log10(min(ais))), math.ceil(math.log10(max(ais)))
    ly0, ly1 = math.floor(math.log10(min(gfs))), math.ceil(math.log10(max(gfs)))
    lx1 = max(lx1, lx0 + 1)
    ly1 = max(ly1, ly0 + 1)

    def xp(ai):
        return ML + PW * (math.log10(ai) - lx0) / (lx1 - lx0)

    def yp(gf):
        return MT + PH * (1.0 - (math.log10(gf) - ly0) / (ly1 - ly0))

    css = "".join([
        f"#{cid} .bg{{fill:#fcfcfb}}",
        f"#{cid} .gr{{stroke:#e1e0d9;stroke-width:1;fill:none}}",
        f"#{cid} .ax{{stroke:#c3c2b7;stroke-width:1;fill:none}}",
        f"#{cid} .at{{fill:#898781;font:11px/1 system-ui,sans-serif}}",
        f"#{cid} .lt{{fill:#52514e;font:11px/1 system-ui,sans-serif}}",
        f"#{cid} .dl{{fill:#52514e;font:10px/1 system-ui,sans-serif}}",
        f"#{cid} .roof{{stroke:#52514e;stroke-width:2;fill:none;stroke-linejoin:round}}",
        f"#{cid} .ridge{{stroke:#898781;stroke-width:1;stroke-dasharray:4 3;fill:none}}",
        *[f"#{cid} .s{lv}{{fill:{lo};stroke:#fcfcfb;stroke-width:2}}"
          for lv, (lo, _, _) in SERIES.items()],
        "@media(prefers-color-scheme:dark){",
        f"#{cid} .bg{{fill:#1a1a19}}",
        f"#{cid} .gr{{stroke:#2c2c2a}}",
        f"#{cid} .ax{{stroke:#383835}}",
        f"#{cid} .lt,#{cid} .dl{{fill:#c3c2b7}}",
        f"#{cid} .roof{{stroke:#c3c2b7}}",
        *[f"#{cid} .s{lv}{{fill:{dk};stroke:#1a1a19}}"
          for lv, (_, dk, _) in SERIES.items()],
        "}",
        f":root[data-theme=dark] #{cid} .bg{{fill:#1a1a19}}",
        f":root[data-theme=dark] #{cid} .gr{{stroke:#2c2c2a}}",
        f":root[data-theme=dark] #{cid} .ax{{stroke:#383835}}",
        f":root[data-theme=dark] #{cid} .lt,:root[data-theme=dark] #{cid} .dl{{fill:#c3c2b7}}",
        f":root[data-theme=dark] #{cid} .roof{{stroke:#c3c2b7}}",
        *[f":root[data-theme=dark] #{cid} .s{lv}{{fill:{dk};stroke:#1a1a19}}"
          for lv, (_, dk, _) in SERIES.items()],
    ])

    o = [
        f'<svg id="{cid}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}" role="img" '
        f'aria-label="Roofline for {gpu}: achieved GFLOP/s against arithmetic '
        f'intensity, under a {peak_bw:.0f} GB/s memory roof and a {peak_flops:.0f} '
        f'GFLOP/s compute roof meeting at {ridge:.1f} FLOP per byte">',
        f"<style>{css}</style>",
        f'<rect class="bg" width="{W}" height="{H}"/>',
    ]

    yticks = [(e, _fmt_pow(e)) for e in _log_ticks(ly0, ly1)]
    xticks = [(e, _fmt_pow(e)) for e in _log_ticks(lx0, lx1)]
    for v, lab in yticks:
        y = yp(10.0 ** v)
        o.append(f'<line class="gr" x1="{ML}" y1="{y:.1f}" x2="{ML + PW}" y2="{y:.1f}"/>')
        o.append(f'<text class="at" x="{ML - 6}" y="{y + 4:.1f}" text-anchor="end">{lab}</text>')
    for v, lab in xticks:
        x = xp(10.0 ** v)
        o.append(f'<line class="gr" x1="{x:.1f}" y1="{MT}" x2="{x:.1f}" y2="{MT + PH}"/>')
        o.append(f'<text class="at" x="{x:.1f}" y="{MT + PH + 16}" text-anchor="middle">{lab}</text>')

    o.append(f'<line class="ax" x1="{ML}" y1="{MT}" x2="{ML}" y2="{MT + PH}"/>')
    o.append(f'<line class="ax" x1="{ML}" y1="{MT + PH}" x2="{ML + PW}" y2="{MT + PH}"/>')

    # The roof: sloped while bandwidth-limited, flat once FLOP-limited.
    roof = []
    for i in range(121):
        ai = 10.0 ** (lx0 + (lx1 - lx0) * i / 120)
        roof.append(f"{xp(ai):.1f},{yp(max(attainable(ai, peak_flops, peak_bw), 10.0 ** ly0)):.1f}")
    o.append(f'<polyline class="roof" points="{" ".join(roof)}"/>')

    if lx0 <= math.log10(ridge) <= lx1:
        rx = xp(ridge)
        o.append(f'<line class="ridge" x1="{rx:.1f}" y1="{MT}" x2="{rx:.1f}" y2="{MT + PH}"/>')
        o.append(f'<text class="dl" x="{rx + 4:.1f}" y="{MT + 10}">ridge {ridge:.1f}</text>')

    # Direct labels on every point: identity is never colour-alone, and the
    # light-mode aqua slot sits below the 3:1 contrast gate, so the relief rule
    # obliges a visible label. The Level 1 routines all land within a decade of
    # each other on both axes, so fixed offsets overlap badly — place each
    # label at the first candidate offset whose box clears every box and marker
    # already placed, and drop it only if nothing fits.
    placed = [(xp(r["ai"]) - 6, yp(r["gflops"]) - 6,
               xp(r["ai"]) + 6, yp(r["gflops"]) + 6) for r in pts]

    def free(box):
        x0, y0, x1, y1 = box
        if x0 < 2 or x1 > ML + PW + MR - 4 or y0 < MT - 4 or y1 > MT + PH + 4:
            return False
        return not any(x0 < b[2] and b[0] < x1 and y0 < b[3] and b[1] < y1
                       for b in placed)

    # Kept deliberately short: a label more than ~20px from its marker reads as
    # belonging to a different point, which is worse than no label. Points are
    # placed highest-intensity first, so the Level 3 markers — the ones the
    # contrast relief rule actually obliges — claim their slots before the
    # crowded Level 1 cluster, and anything that cannot be placed cleanly goes
    # unlabelled. The legend and the CLI table still carry identity.
    CAND = [(8, 4), (8, -8), (8, 15), (-8, 4), (-8, -8), (-8, 15),
            (8, -19), (8, 26), (-8, -19), (-8, 26)]

    for r in pts:
        o.append(f'<circle class="s{r["level"]}" cx="{xp(r["ai"]):.1f}" '
                 f'cy="{yp(r["gflops"]):.1f}" r="5"/>')

    # One label per cluster, so coincident routines are all named rather than
    # one of them silently winning the spot. Highest-intensity first, which
    # lets the Level 3 markers — the ones the contrast relief rule obliges —
    # claim their slots before the crowded low-intensity end.
    for g in sorted(_cluster(pts, xp, yp), key=lambda g: -max(r["ai"] for r in g)):
        x = sum(xp(r["ai"]) for r in g) / len(g)
        y = sum(yp(r["gflops"]) for r in g) / len(g)
        text = " · ".join(sorted(r["routine"] for r in g))
        w = len(text) * 5.6 + 2
        for ox, oy in CAND:
            anchor = "start" if ox > 0 else "end"
            bx0 = x + ox if anchor == "start" else x + ox - w
            box = (bx0, y + oy - 9, bx0 + w, y + oy + 2)
            if free(box):
                placed.append(box)
                o.append(f'<text class="dl" x="{x + ox:.1f}" y="{y + oy:.1f}" '
                         f'text-anchor="{anchor}">{text}</text>')
                break

    o.append(f'<text class="lt" x="{ML + PW / 2:.1f}" y="{H - 22}" text-anchor="middle">'
             f'arithmetic intensity (FLOP/byte)</text>')
    cy = MT + PH / 2
    o.append(f'<text class="lt" x="14" y="{cy:.1f}" text-anchor="middle" '
             f'transform="rotate(-90 14 {cy:.1f})">achieved GFLOP/s</text>')

    # Only the levels actually drawn, so the legend never promises a series
    # that has no marker on the chart.
    lx = ML + PW + 14
    present = [lv for lv in SERIES if any(r["level"] == lv for r in pts)]
    for j, lv in enumerate(present):
        ly = MT + 8 + j * 18
        o.append(f'<circle class="s{lv}" cx="{lx + 5}" cy="{ly}" r="5"/>')
        o.append(f'<text class="lt" x="{lx + 16}" y="{ly + 4}">{SERIES[lv][2]}</text>')
    cap = MT + 8 + len(present) * 18 + 10
    o.append(f'<text class="dl" x="{lx}" y="{cap}">roof</text>')
    o.append(f'<text class="dl" x="{lx}" y="{cap + 14}">{peak_bw:.0f} GB/s</text>')
    o.append(f'<text class="dl" x="{lx}" y="{cap + 28}">{peak_flops:,.0f} GF/s</text>')

    o.append("</svg>")
    return "\n".join(o), len(records) - len(pts)


def main():
    ap = argparse.ArgumentParser(description="Roofline / ridge-point analysis of the benchmark results.")
    ap.add_argument("--gpu", help="GPU slug under benchmarks/results (default: every one found)")
    ap.add_argument("--empirical-roof", action="store_true",
                    help="use the best observed rates as the ceilings instead of the probes "
                         "(self-referential for whichever kernel defines the roof)")
    ap.add_argument("--peak-flops", type=float, help="override the compute roof, GFLOP/s")
    ap.add_argument("--peak-bw", type=float, help="override the memory roof, GB/s")
    ap.add_argument("--svg", action="store_true",
                    help="also write assets/benchmarks/<gpu>/roofline/roofline.svg")
    ap.add_argument("-v", "--verbose", action="store_true", help="list every excluded row")
    args = ap.parse_args()

    if not RESULTS_DIR.is_dir():
        sys.exit(f"no results tree at {RESULTS_DIR}")
    gpus = [args.gpu] if args.gpu else sorted(
        d.name for d in RESULTS_DIR.iterdir() if d.is_dir())
    if not gpus:
        sys.exit("no GPU result folders found")

    for gpu in gpus:
        records, skipped = load_records(gpu)
        if not records:
            print(f"\n{gpu}: no usable records", file=sys.stderr)
            continue
        # A roof that came from the measurements themselves makes every "% of
        # roof" meaningless, so a GPU with no verified ceiling is skipped
        # outright rather than reported with a self-referential one.
        probes = RESULTS_DIR / gpu / "wgblas" / "roofline"
        if not (args.peak_flops and args.peak_bw) and not (
                (probes / "fma.json").exists() and (probes / "bandwidth.json").exists()):
            print(f"\n{gpu}: skipped — no measured roof. Run "
                  f"`make bench-roofline` on that device (both fma.js and\n  "
                  f"bandwidth.js), or pass --peak-flops/--peak-bw.", file=sys.stderr)
            continue
        pf, pb, source = ceilings(gpu, records, args.empirical_roof,
                                  args.peak_flops, args.peak_bw)

        # Reported, never removed — every measured row stays in the table and
        # the JSON. The "x roof" column is what distinguishes a routine
        # that genuinely beat the probes from a row whose FLOP count is wrong.
        over = [r for r in records if above_roof(r, pf, pb)]
        if over:
            print(f"\n{gpu}: {len(over)} row(s) above the measured roof (kept — see "
                  f"above_roof()):", file=sys.stderr)
            for r in sorted(over, key=lambda r: -max(r["gflops"] / pf, r["gbs"] / pb))[:8]:
                ratio = max(r["gflops"] / pf, r["gbs"] / pb)
                print(f"    {r['file']:22} size={r['size']:<8} {r['gflops']:9.1f} GF/s  "
                      f"{r['gbs']:7.1f} GB/s   {ratio:5.2f}x roof", file=sys.stderr)
            if len(over) > 8:
                print(f"    ... and {len(over) - 8} more", file=sys.stderr)
        print_report(gpu, records, skipped, pf, pb, source, args.verbose)
        print(f"\n  wrote {save_report(gpu, records, pf, pb, source).relative_to(ROOT)}")


        if args.svg:
            # One point per routine at its largest main-benchmark size, matching
            # the table — plotting every sweep row would bury the shape.
            svg, dropped = build_svg(list(summary_rows(records).values()), pf, pb, gpu)
            if svg:
                path = SVG_DIR / gpu / "roofline" / "roofline.svg"
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(svg)
                note = f" ({dropped} AI=0 points omitted)" if dropped else ""
                print(f"\n  wrote {path.relative_to(ROOT)}{note}")



if __name__ == "__main__":
    main()
