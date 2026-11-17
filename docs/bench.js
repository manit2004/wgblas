// The docs site's benchmark viewer, drawing straight from
// benchmarks/results/*.json on GitHub with Vega-Lite. runner.js (the site's
// customJs) loads this from the docs root on a page with either placeholder:
//   [data-wgblas-bench]     benchmarks/results: per routine and sweep, wgblas
//                           against cuBLAS, with a table of wgblas as a % of
//                           cuBLAS
//   [data-wgblas-roofline]  benchmarks/roofline: each GPU's roofline
// benchmarks/results-reader.mjs does the listing and reading; the docs build
// puts it beside this file as a plain script, results-reader.js, since a page
// opened from disk (file://) can't load modules. The docs MCP server uses the
// same module, so the two always agree.
(function () {
  "use strict";

  var ROOT = document.currentScript.src.replace(/[^/]+$/, "");
  var LIBS = [
    "https://cdn.jsdelivr.net/npm/vega@5.30.0/build/vega.min.js",
    "https://cdn.jsdelivr.net/npm/vega-lite@5.21.0/build/vega-lite.min.js",
    "https://cdn.jsdelivr.net/npm/vega-embed@6.26.0/build/vega-embed.min.js",
  ];
  // The charts' existing colours: wgblas blue, cuBLAS green, and the
  // roofline's one colour per BLAS level.
  var SERIES = {
    light: {
      wgblas: "#2a78d6",
      cuda: "#008300",
      1: "#2a78d6",
      2: "#eb6834",
      3: "#1baf7a",
    },
    dark: {
      wgblas: "#3987e5",
      cuda: "#1f9a1f",
      1: "#3987e5",
      2: "#d95926",
      3: "#199e70",
    },
  };
  var LIST_CACHE_KEY = "wgblas-bench-list-v1";
  var PREFERRED_GPU = "nvidia-geforce-gtx-1650";
  var PREFERRED_ROUTINE = "sgemm";

  // ── Loading ───────────────────────────────────────────────────────────────

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error("couldn't load " + src));
      };
      document.head.appendChild(s);
    });
  }

  async function loadReader() {
    if (!window.wgblasResultsReader)
      await loadScript(ROOT + "results-reader.js");
    // The docs build's list of result files, for when GitHub's API won't list
    // them. Optional: without it, a refused listing is an error.
    if (!window.wgblasResultsIndex)
      await loadScript(ROOT + "results-index.js").catch(function () {});
    // The roofline's levels and FLOP counts, as of this build. Optional:
    // without it they come from GitHub.
    if (!window.wgblasRoutineParams)
      await loadScript(ROOT + "routine-params.js").catch(function () {});
  }

  async function loadLibs() {
    if (window.vegaEmbed) return;
    for (var i = 0; i < LIBS.length; i++) await loadScript(LIBS[i]); // in order: each needs the last
  }

  // The file list, once per browser session: listing costs GitHub API calls,
  // which are rate-limited; the files themselves aren't. A list from the docs
  // build's fallback isn't kept, so the next page load tries GitHub again.
  // Returns { paths, fromFallback }.
  async function listResults(source) {
    try {
      var cached = sessionStorage.getItem(LIST_CACHE_KEY);
      if (cached) return { paths: JSON.parse(cached), fromFallback: false };
    } catch {
      /* storage unavailable: list every time */
    }
    var paths = await source.list();
    var fromFallback = source.listedFrom === "fallback";
    if (!fromFallback)
      try {
        sessionStorage.setItem(LIST_CACHE_KEY, JSON.stringify(paths));
      } catch {
        /* ignore */
      }
    return { paths: paths, fromFallback: fromFallback };
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  function theme() {
    var css = getComputedStyle(document.documentElement);
    var v = function (name, fallback) {
      return css.getPropertyValue(name).trim() || fallback;
    };
    var bg = v("--color-background", "#ffffff");
    var dark = luminance(bg) < 0.5;
    return {
      bg: bg,
      text: v("--color-text", dark ? "#f5f5f5" : "#222"),
      aside: v("--color-text-aside", dark ? "#999" : "#666"),
      line: v("--color-background-secondary", dark ? "#333" : "#eee"),
      series: dark ? SERIES.dark : SERIES.light,
    };
  }

  function luminance(color) {
    var probe = document.createElement("span");
    probe.style.color = color;
    document.body.appendChild(probe);
    var rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [
      255, 255, 255,
    ];
    probe.remove();
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  function vegaConfig(t) {
    return {
      background: null,
      view: { stroke: null },
      font: "inherit",
      axis: {
        domainColor: t.aside,
        tickColor: t.aside,
        gridColor: t.line,
        labelColor: t.aside,
        titleColor: t.aside,
        labelFontSize: 11,
        titleFontSize: 11,
        titleFontWeight: "normal",
      },
      legend: { labelColor: t.text, titleColor: t.aside, labelFontSize: 12 },
      // Long configuration names ("transA = …, transB = …") are cut to the
      // panel's width; the tooltip has them whole.
      header: {
        labelColor: t.text,
        labelFontSize: 11,
        labelLimit: 200,
        title: null,
      },
    };
  }

  // ── Formatting ────────────────────────────────────────────────────────────

  // 4096 → "4.1K", 16777216 → "16.8M", as the old charts labelled sizes.
  var SIZE_LABEL =
    "datum.value >= 1e6 ? format(datum.value / 1e6, '.1f') + 'M' : " +
    "datum.value >= 1e3 ? format(datum.value / 1e3, '.1f') + 'K' : datum.value";

  function sizeTicks(xs) {
    var unique = Array.from(new Set(xs)).sort(function (a, b) {
      return a - b;
    });
    var step = Math.ceil(unique.length / 9);
    return unique.filter(function (_, i) {
      return i % step === 0 || i === unique.length - 1;
    });
  }

  function num(v, digits) {
    if (typeof v !== "number") return "–";
    return v.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ── Chart specs ───────────────────────────────────────────────────────────

  function encodings(t, info, values, metricLabel) {
    return {
      x: {
        field: "x",
        type: "quantitative",
        title: info.x,
        scale: { type: "log", base: 2 },
        axis: {
          values: sizeTicks(
            values.map(function (d) {
              return d.x;
            }),
          ),
          labelExpr: SIZE_LABEL,
          grid: false,
        },
      },
      y: {
        field: "v",
        type: "quantitative",
        title: metricLabel,
        scale: { zero: true },
        axis: { tickCount: 5 },
      },
      color: {
        field: "impl",
        type: "nominal",
        title: null,
        scale: {
          domain: ["wgblas", "cuBLAS"],
          range: [t.series.wgblas, t.series.cuda],
        },
        legend: { orient: "top", direction: "horizontal" },
      },
    };
  }

  function chartValues(config, metric) {
    var out = [];
    config.rows.forEach(function (r) {
      if (r.wgblas && typeof r.wgblas[metric] === "number")
        out.push({
          impl: "wgblas",
          x: r.x,
          v: r.wgblas[metric],
          label: config.label,
        });
      if (r.cuda && typeof r.cuda[metric] === "number")
        out.push({
          impl: "cuBLAS",
          x: r.x,
          v: r.cuda[metric],
          label: config.label,
        });
    });
    return out;
  }

  function singleSpec(t, info, config, metric, metricLabel, digits) {
    var values = chartValues(config, metric);
    var enc = encodings(t, info, values, metricLabel);
    var fmt = "," + "." + digits + "f";
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 280,
      autosize: { type: "fit-x", contains: "padding" },
      data: { values: values },
      config: vegaConfig(t),
      layer: [
        {
          mark: {
            type: "line",
            strokeWidth: 2,
            strokeCap: "round",
            strokeJoin: "round",
          },
          encoding: { x: enc.x, y: enc.y, color: enc.color },
        },
        {
          mark: {
            type: "point",
            filled: true,
            size: 44,
            stroke: t.bg,
            strokeWidth: 2,
            opacity: 1,
          },
          encoding: {
            x: enc.x,
            y: enc.y,
            color: Object.assign({}, enc.color, { legend: null }),
          },
        },
        {
          // Hover: a rule at the nearest size, both libraries' values on it.
          transform: [{ pivot: "impl", value: "v", groupby: ["x"] }],
          params: [
            {
              name: "hover",
              select: {
                type: "point",
                fields: ["x"],
                nearest: true,
                on: "pointerover",
                clear: "pointerout",
              },
            },
          ],
          mark: { type: "rule", color: t.aside },
          encoding: {
            x: enc.x,
            opacity: {
              condition: { param: "hover", empty: false, value: 0.6 },
              value: 0,
            },
            tooltip: [
              { field: "x", type: "quantitative", title: info.x, format: "," },
              {
                field: "wgblas",
                type: "quantitative",
                title: "wgblas " + metricLabel,
                format: fmt,
              },
              {
                field: "cuBLAS",
                type: "quantitative",
                title: "cuBLAS " + metricLabel,
                format: fmt,
              },
            ],
          },
        },
      ],
    };
  }

  function multiplesSpec(t, info, configs, metric, metricLabel) {
    var values = [].concat.apply(
      [],
      configs.map(function (c) {
        return chartValues(c, metric);
      }),
    );
    var enc = encodings(t, info, values, metricLabel);
    var n = configs.length;
    var noTitle = function (e) {
      return Object.assign({}, e, { title: null });
    };
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: { values: values },
      config: vegaConfig(t),
      // Columns that fill every row, so no empty cell gets axes of its own.
      columns: n <= 3 ? n : n % 3 === 0 ? 3 : 2,
      facet: {
        field: "label",
        type: "ordinal",
        sort: configs.map(function (c) {
          return c.label;
        }),
        title: null,
      },
      spec: {
        width: 210,
        height: 120,
        layer: [
          {
            mark: { type: "line", strokeWidth: 1.6 },
            encoding: {
              x: noTitle(enc.x),
              y: noTitle(enc.y),
              color: enc.color,
            },
          },
          {
            mark: { type: "point", filled: true, size: 16 },
            encoding: {
              x: noTitle(enc.x),
              y: noTitle(enc.y),
              color: Object.assign({}, enc.color, { legend: null }),
              tooltip: [
                { field: "label", title: "configuration" },
                { field: "impl", title: "library" },
                {
                  field: "x",
                  type: "quantitative",
                  title: info.x,
                  format: ",",
                },
                {
                  field: "v",
                  type: "quantitative",
                  title: metricLabel,
                  format: ",.2f",
                },
              ],
            },
          },
        ],
      },
    };
  }

  function rooflineSpec(t, roof) {
    var pts = roof.routines.filter(function (r) {
      return r.arithmetic_intensity > 0 && r.compute_GFLOPs > 0;
    });
    var ais = pts
      .map(function (r) {
        return r.arithmetic_intensity;
      })
      .concat([roof.ridge_FLOP_per_byte]);
    var lo = Math.pow(10, Math.floor(Math.log10(Math.min.apply(null, ais))));
    var hi = Math.pow(10, Math.ceil(Math.log10(Math.max.apply(null, ais))));
    var roofLine = [];
    for (var i = 0; i <= 120; i++) {
      var ai = lo * Math.pow(hi / lo, i / 120);
      roofLine.push({
        ai: ai,
        g: Math.min(roof.peak_GFLOPs, ai * roof.peak_GBs),
      });
    }
    var x = {
      field: "ai",
      type: "quantitative",
      title: "arithmetic intensity (FLOP/byte)",
      scale: { type: "log", domain: [lo, hi] },
    };
    var y = {
      field: "g",
      type: "quantitative",
      title: "GFLOP/s",
      scale: { type: "log" },
    };
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 340,
      autosize: { type: "fit-x", contains: "padding" },
      config: vegaConfig(t),
      layer: [
        {
          data: { values: roofLine },
          mark: { type: "line", color: t.text, strokeWidth: 2 },
          encoding: { x: x, y: y },
        },
        {
          data: {
            values: [
              {
                ai: roof.ridge_FLOP_per_byte,
                label: "ridge " + roof.ridge_FLOP_per_byte.toFixed(1),
              },
            ],
          },
          layer: [
            {
              mark: { type: "rule", color: t.aside, strokeDash: [4, 3] },
              encoding: { x: x },
            },
            {
              mark: {
                type: "text",
                align: "left",
                dx: 4,
                dy: -6,
                color: t.aside,
                fontSize: 11,
              },
              encoding: {
                x: x,
                y: {
                  datum: roof.peak_GFLOPs,
                  type: "quantitative",
                  scale: { type: "log" },
                },
                text: { field: "label" },
              },
            },
          ],
        },
        {
          data: {
            values: pts.map(function (r) {
              return {
                ai: r.arithmetic_intensity,
                g: r.compute_GFLOPs,
                routine: r.routine,
                level: "Level " + r.level,
                gbs: r.compute_GBs,
                pct: r.pct_of_roof,
                bound: r.bound,
              };
            }),
          },
          mark: {
            type: "point",
            filled: true,
            size: 70,
            stroke: t.bg,
            strokeWidth: 1.5,
            opacity: 1,
          },
          encoding: {
            x: x,
            y: y,
            color: {
              field: "level",
              type: "nominal",
              title: null,
              scale: {
                domain: ["Level 1", "Level 2", "Level 3"],
                range: [t.series[1], t.series[2], t.series[3]],
              },
              legend: { orient: "top", direction: "horizontal" },
            },
            tooltip: [
              { field: "routine" },
              { field: "level" },
              { field: "ai", title: "FLOP/byte", format: ".3f" },
              { field: "g", title: "GFLOP/s", format: ",.1f" },
              { field: "gbs", title: "GB/s", format: ",.1f" },
              { field: "pct", title: "% of roof", format: ".0f" },
              { field: "bound" },
            ],
          },
        },
      ],
    };
  }

  // ── Tables ────────────────────────────────────────────────────────────────

  // One row per size: for each library the rate being charted (GB/s or
  // GFLOP/s; GB/s when the chart shows time) and its time, then wgblas as a %
  // of cuBLAS.
  function resultsTable(reader, info, config, hasCuda, metric) {
    var rate =
      metric !== "compute_ms"
        ? metric
        : info.metrics.find(function (m) {
            return m !== "compute_ms";
          });
    var cols = [rate, "compute_ms"].filter(function (m) {
      return m && info.metrics.indexOf(m) >= 0;
    });
    var otherKeys = info.otherKeys.filter(function (k) {
      return config.rows.some(function (r) {
        return k in r.other;
      });
    });
    var backends = [["wgblas", "wgblas"]].concat(
      hasCuda ? [["cuda", "cuBLAS"]] : [],
    );
    var head =
      "<tr><th>" +
      escapeHtml(info.x) +
      "</th>" +
      otherKeys
        .map(function (k) {
          return "<th>" + escapeHtml(k) + "</th>";
        })
        .join("");
    backends.forEach(function (b) {
      cols.forEach(function (m) {
        head += "<th>" + b[1] + " " + reader.METRICS[m].label + "</th>";
      });
    });
    if (hasCuda)
      head +=
        '<th title="wgblas GB/s as a percentage of cuBLAS GB/s; above 100% means wgblas is faster">% of cuBLAS</th>';
    head += "</tr>";
    var body = config.rows
      .map(function (r) {
        var cells =
          "<td>" +
          num(r.x, 0) +
          "</td>" +
          otherKeys
            .map(function (k) {
              return "<td>" + escapeHtml(r.other[k] ?? "–") + "</td>";
            })
            .join("");
        backends.forEach(function (b) {
          cols.forEach(function (m) {
            cells +=
              "<td>" +
              num(r[b[0]] && r[b[0]][m], reader.METRICS[m].digits) +
              "</td>";
          });
        });
        if (hasCuda) {
          var cls = r.pct !== null && r.pct >= 100 ? ' class="wgb-ahead"' : "";
          cells +=
            "<td" +
            cls +
            ">" +
            (r.pct === null ? "–" : r.pct.toFixed(1) + "%") +
            "</td>";
        }
        return "<tr>" + cells + "</tr>";
      })
      .join("");
    return "<table>" + head + body + "</table>";
  }

  function rooflineTable(roof) {
    var head =
      "<tr><th>routine</th><th>level</th><th>size</th><th>FLOP/byte</th><th>GFLOP/s</th><th>GB/s</th><th>% of roof</th><th>bound</th></tr>";
    var body = roof.routines
      .map(function (r) {
        return (
          "<tr><td>" +
          escapeHtml(r.routine) +
          (r.flops_measured ? "" : " *") +
          "</td><td>" +
          r.level +
          "</td><td>" +
          num(r.size, 0) +
          "</td><td>" +
          num(r.arithmetic_intensity, 3) +
          "</td><td>" +
          num(r.compute_GFLOPs, 1) +
          "</td><td>" +
          num(r.compute_GBs, 1) +
          "</td><td>" +
          Math.round(r.pct_of_roof) +
          "%</td><td>" +
          escapeHtml(r.bound) +
          "</td></tr>"
        );
      })
      .join("");
    return "<table>" + head + body + "</table>";
  }

  // ── Page ──────────────────────────────────────────────────────────────────

  var STYLE = [
    // minmax(0, 1fr): a grid track otherwise grows to its widest child (the
    // small multiples, a wide table) and the whole panel overflows a phone.
    ".wgb { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; margin: 1rem 0 2rem; }",
    ".wgb-controls { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: end; }",
    ".wgb-control { display: grid; gap: .25rem; font-size: .8rem; color: var(--color-text-aside); min-width: 0; max-width: 100%; }",
    ".wgb select { max-width: 100%; }",
    ".wgb select, .wgb-seg button { font: inherit; font-size: .9rem; color: var(--color-text); background: var(--color-background-secondary);",
    "  border: 1px solid var(--color-accent); border-radius: .4rem; padding: .3rem .55rem; }",
    ".wgb-seg { display: inline-flex; }",
    ".wgb-seg button { border-radius: 0; cursor: pointer; }",
    ".wgb-seg button:first-child { border-radius: .4rem 0 0 .4rem; }",
    ".wgb-seg button:last-child { border-radius: 0 .4rem .4rem 0; }",
    ".wgb-seg button + button { border-left: none; }",
    ".wgb-seg button[aria-pressed='true'] { background: var(--color-text); color: var(--color-background); }",
    ".wgb select:focus-visible, .wgb-seg button:focus-visible { outline: 2px solid var(--color-focus-outline); outline-offset: 2px; }",
    ".wgb-chart { width: 100%; min-width: 0; }",
    ".wgb-scroll { overflow-x: auto; }",
    ".wgb-note { color: var(--color-text-aside); font-size: .85rem; margin: 0; }",
    ".wgb h3 { margin: .5rem 0 0; }",
    ".wgb table { font-variant-numeric: tabular-nums; }",
    ".wgb td.wgb-ahead { font-weight: 600; }",
  ].join("\n");

  function injectStyle() {
    if (document.getElementById("wgb-style")) return;
    var s = document.createElement("style");
    s.id = "wgb-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function select(id, label, options, value) {
    return (
      '<label class="wgb-control" for="' +
      id +
      '">' +
      label +
      '<select id="' +
      id +
      '">' +
      options
        .map(function (o) {
          return (
            '<option value="' +
            escapeHtml(o[0]) +
            '"' +
            (o[0] === value ? " selected" : "") +
            ">" +
            escapeHtml(o[1]) +
            "</option>"
          );
        })
        .join("") +
      "</select></label>"
    );
  }

  function blobUrl(reader, path) {
    return (
      "https://github.com/" +
      reader.REPO +
      "/blob/" +
      reader.BRANCH +
      "/benchmarks/results/" +
      path
    );
  }

  // ── Shared by both pages ──────────────────────────────────────────────────

  // The reader, the chart libraries and the list of result files: loaded once
  // per page, whichever panels it has.
  var loading = null;
  function loadCatalog() {
    if (!loading)
      loading = (async function () {
        await Promise.all([loadReader(), loadLibs()]);
        var reader = window.wgblasResultsReader;
        var source = reader.githubSource({
          fallbackList: window.wgblasResultsIndex,
          routineParams: window.wgblasRoutineParams,
        });
        var listed = await listResults(source);
        var cat = reader.catalog(listed.paths);
        if (!cat.size) throw new Error("no results found");
        return {
          source: source,
          reader: reader,
          cat: cat,
          // Shown above each panel when GitHub wouldn't list the results.
          note: listed.fromFallback
            ? '<p class="wgb-note">GitHub\'s API limit for your address was reached, so the list of ' +
              "results is the one from when these docs were built: anything committed since is " +
              "missing until the limit resets (within the hour). The numbers shown are current.</p>"
            : "",
        };
      })();
    return loading;
  }

  // Starts a panel: the loading note, then the catalog, or a note on failure.
  async function startPanel(el) {
    injectStyle();
    el.classList.add("wgb");
    el.innerHTML =
      '<p class="wgb-note">Loading the benchmark results from GitHub…</p>';
    try {
      return await loadCatalog();
    } catch (err) {
      el.innerHTML =
        '<p class="wgb-note">Couldn\'t load the benchmark results (' +
        escapeHtml(err.message) +
        '). They are also on GitHub, in <a href="https://github.com/manit2004/wgblas/tree/main/benchmarks/results">benchmarks/results</a>.</p>';
      return null;
    }
  }

  function pick(value, options, preferred) {
    if (options.indexOf(value) >= 0) return value;
    if (options.indexOf(preferred) >= 0) return preferred;
    return options[0];
  }

  // The panel's choices, read from and kept in the page's query string, so a
  // view can be linked.
  function readState(keys) {
    var params = new URLSearchParams(location.search);
    var state = {};
    keys.forEach(function (k) {
      state[k] = params.get(k);
    });
    return state;
  }

  function saveState(state) {
    var p = new URLSearchParams(location.search);
    Object.keys(state).forEach(function (k) {
      if (state[k]) p.set(k, state[k]);
      else p.delete(k);
    });
    history.replaceState(
      null,
      "",
      location.pathname + "?" + p.toString() + location.hash,
    );
  }

  // A panel is rebuilt on every change; these keep keyboard focus where it was.
  function focusedKey(el) {
    var f = el.contains(document.activeElement) ? document.activeElement : null;
    return f && (f.id || (f.dataset && f.dataset.metric));
  }

  function refocus(el, key) {
    if (!key) return;
    var again =
      el.querySelector("#" + key) ||
      el.querySelector('[data-metric="' + key + '"]');
    if (again) again.focus();
  }

  // Redraw in the other theme's colours when the site's theme changes.
  function onThemeChange(fn) {
    new MutationObserver(fn).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", fn);
  }

  // ── Results page: [data-wgblas-bench] ─────────────────────────────────────

  async function mountResults(el) {
    var loaded = await startPanel(el);
    if (!loaded) return;
    var reader = loaded.reader;
    var cat = loaded.cat;
    var sweepCache = new Map();
    var state = readState(["gpu", "routine", "sweep", "config", "metric"]);
    var renderId = 0;

    async function sweepData(files) {
      var key = (files.wgblas || "") + "|" + (files.cuda || "");
      if (!sweepCache.has(key))
        sweepCache.set(key, reader.readSweep(loaded.source, files));
      return sweepCache.get(key);
    }

    async function render() {
      var id = ++renderId;
      var t = theme();
      var focusKey = focusedKey(el);

      var gpus = Array.from(cat.keys());
      state.gpu = pick(state.gpu, gpus, PREFERRED_GPU);
      var gpu = cat.get(state.gpu);
      var routines = Array.from(gpu.routines.keys());
      state.routine = pick(state.routine, routines, PREFERRED_ROUTINE);
      var sweeps = gpu.routines.get(state.routine);
      var sweepNames = Array.from(sweeps.keys());
      state.sweep = pick(state.sweep, sweepNames, "base");
      var files = sweeps.get(state.sweep);

      var data;
      try {
        data = await sweepData(files);
      } catch (err) {
        if (id !== renderId) return;
        el.innerHTML =
          '<p class="wgb-note">Couldn\'t load ' +
          escapeHtml(state.routine) +
          " (" +
          escapeHtml(err.message) +
          ").</p>";
        return;
      }
      if (id !== renderId) return;

      var labels = data.configs.map(function (c) {
        return c.label;
      });
      state.config = pick(state.config, labels, labels[0]);
      var config = data.configs[labels.indexOf(state.config)];
      state.metric = pick(state.metric, data.info.metrics, "compute_GBs");
      var metric = reader.METRICS[state.metric];
      var hasCuda = data.configs.some(function (c) {
        return c.rows.some(function (r) {
          return r.cuda;
        });
      });
      saveState(state);

      var sources = Object.keys(reader.BACKENDS)
        .filter(function (b) {
          return files[b];
        })
        .map(function (b) {
          return (
            '<a href="' +
            blobUrl(reader, files[b]) +
            '">' +
            reader.BACKENDS[b] +
            "</a>"
          );
        })
        .join(" · ");

      el.innerHTML =
        loaded.note +
        '<div class="wgb-controls" role="group" aria-label="Benchmark results">' +
        select(
          "wgb-gpu",
          "GPU",
          gpus.map(function (g) {
            return [g, cat.get(g).name];
          }),
          state.gpu,
        ) +
        select(
          "wgb-routine",
          "Routine",
          routines.map(function (r) {
            return [r, r];
          }),
          state.routine,
        ) +
        select(
          "wgb-sweep",
          "Sweep",
          sweepNames.map(function (s) {
            return [s, s === "base" ? "base run" : s];
          }),
          state.sweep,
        ) +
        select(
          "wgb-config",
          "Configuration",
          labels.map(function (l) {
            return [l, l];
          }),
          state.config,
        ) +
        '<div class="wgb-control">Metric<div class="wgb-seg" role="group" aria-label="Metric">' +
        data.info.metrics
          .map(function (m) {
            return (
              '<button type="button" data-metric="' +
              m +
              '" aria-pressed="' +
              (m === state.metric) +
              '">' +
              reader.METRICS[m].label +
              "</button>"
            );
          })
          .join("") +
        "</div></div></div>" +
        '<div class="wgb-chart" id="wgb-live"></div>' +
        '<p class="wgb-note">' +
        (hasCuda ? "" : "No cuBLAS results for this sweep. ") +
        "Source data: " +
        sources +
        ". Hover the chart for exact values.</p>" +
        (data.configs.length > 1
          ? "<h3>Every configuration (" +
            data.configs.length +
            ')</h3><div class="wgb-scroll" id="wgb-multi"></div>'
          : "") +
        "<h3>" +
        escapeHtml(state.routine) +
        ", " +
        escapeHtml(state.config) +
        "</h3>" +
        (hasCuda
          ? '<p class="wgb-note">% of cuBLAS is wgblas GB/s over cuBLAS GB/s; above 100% (in bold) wgblas is faster.</p>'
          : "") +
        '<div class="wgb-scroll">' +
        resultsTable(reader, data.info, config, hasCuda, state.metric) +
        "</div>";

      el.querySelector("#wgb-gpu").addEventListener("change", function (e) {
        state.gpu = e.target.value;
        render();
      });
      el.querySelector("#wgb-routine").addEventListener("change", function (e) {
        state.routine = e.target.value;
        state.sweep = null;
        state.config = null;
        render();
      });
      el.querySelector("#wgb-sweep").addEventListener("change", function (e) {
        state.sweep = e.target.value;
        state.config = null;
        render();
      });
      el.querySelector("#wgb-config").addEventListener("change", function (e) {
        state.config = e.target.value;
        render();
      });
      el.querySelector("#wgb-config").disabled = labels.length < 2;
      el.querySelectorAll(".wgb-seg button").forEach(function (b) {
        b.addEventListener("click", function () {
          state.metric = b.dataset.metric;
          render();
        });
      });
      refocus(el, focusKey);

      var opts = { actions: false, renderer: "svg" };
      window.vegaEmbed(
        el.querySelector("#wgb-live"),
        singleSpec(
          t,
          data.info,
          config,
          state.metric,
          metric.label,
          metric.digits,
        ),
        opts,
      );
      if (data.configs.length > 1)
        window.vegaEmbed(
          el.querySelector("#wgb-multi"),
          multiplesSpec(t, data.info, data.configs, state.metric, metric.label),
          opts,
        );
    }

    onThemeChange(render);
    render();
  }

  // ── Roofline page: [data-wgblas-roofline] ─────────────────────────────────

  async function mountRoofline(el) {
    var loaded = await startPanel(el);
    if (!loaded) return;
    var reader = loaded.reader;
    var cat = loaded.cat;
    var roofCache = new Map();
    var state = readState(["gpu"]);
    var renderId = 0;

    // Only GPUs with both roofline probes' results: the roofs come from them.
    var gpus = Array.from(cat.keys()).filter(function (g) {
      return reader.hasRoofline(cat.get(g));
    });
    if (!gpus.length) {
      el.innerHTML =
        '<p class="wgb-note">No GPU has a roofline yet: it needs the roofline probes ' +
        "run on it (<code>make bench-roofline</code>).</p>";
      return;
    }

    async function render() {
      var id = ++renderId;
      var t = theme();
      var focusKey = focusedKey(el);
      state.gpu = pick(state.gpu, gpus, PREFERRED_GPU);
      var gpu = cat.get(state.gpu);

      var roof;
      try {
        // Computed from the probes, the routines' base runs and
        // routine_params.json's FLOP counts: about 30 small files.
        if (!roofCache.has(state.gpu))
          roofCache.set(state.gpu, reader.readRoofline(loaded.source, gpu));
        roof = await roofCache.get(state.gpu);
      } catch (err) {
        if (id !== renderId) return;
        el.innerHTML =
          '<p class="wgb-note">Couldn\'t load the roofline (' +
          escapeHtml(err.message) +
          ").</p>";
        return;
      }
      if (id !== renderId) return;
      saveState(state);

      var derived = roof.routines.some(function (r) {
        return !r.flops_measured;
      });
      var others = Array.from(cat.keys()).filter(function (g) {
        return gpus.indexOf(g) < 0;
      });
      el.innerHTML =
        loaded.note +
        '<div class="wgb-controls" role="group" aria-label="Roofline">' +
        select(
          "wgb-roof-gpu",
          "GPU",
          gpus.map(function (g) {
            return [g, cat.get(g).name];
          }),
          state.gpu,
        ) +
        "</div>" +
        '<p class="wgb-note">Memory roof ' +
        num(roof.peak_GBs, 1) +
        " GB/s, compute roof " +
        num(roof.peak_GFLOPs, 0) +
        " GFLOP/s (" +
        escapeHtml(roof.roof_source) +
        "), meeting at the ridge, " +
        roof.ridge_FLOP_per_byte.toFixed(2) +
        " FLOP/byte. Source data: the probes' " +
        '<a href="' +
        blobUrl(reader, gpu.probes.fma) +
        '">fma.json</a> and <a href="' +
        blobUrl(reader, gpu.probes.bandwidth) +
        "\">bandwidth.json</a>, and each routine's base run. Hover a point for its routine.</p>" +
        '<div class="wgb-chart" id="wgb-roof-chart"></div>' +
        '<div class="wgb-scroll">' +
        rooflineTable(roof) +
        "</div>" +
        '<p class="wgb-note">Each row is the routine\'s largest size in its base run. Intensity assumes perfect caching: ' +
        "exact for Level 1 and 2, an upper bound for tiled Level 3. Routines that move data without arithmetic " +
        "(intensity 0) are in the table only." +
        (derived
          ? " * FLOP count from assets/routines/routine_params.json: these benchmarks record bytes only."
          : "") +
        (others.length
          ? " No roofline yet for: " +
            others
              .map(function (g) {
                return escapeHtml(cat.get(g).name);
              })
              .join(", ") +
            "."
          : "") +
        "</p>";

      el.querySelector("#wgb-roof-gpu").addEventListener(
        "change",
        function (e) {
          state.gpu = e.target.value;
          render();
        },
      );
      el.querySelector("#wgb-roof-gpu").disabled = gpus.length < 2;
      refocus(el, focusKey);

      window.vegaEmbed(
        el.querySelector("#wgb-roof-chart"),
        rooflineSpec(t, roof),
        { actions: false, renderer: "svg" },
      );
    }

    onThemeChange(render);
    render();
  }

  document.querySelectorAll("[data-wgblas-bench]").forEach(mountResults);
  document.querySelectorAll("[data-wgblas-roofline]").forEach(mountRoofline);
})();
