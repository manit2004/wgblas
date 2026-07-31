(function () {
  "use strict";

  var _self = document.currentScript;

  var bundleLoaded = false;
  var bundleLoading = false;
  var loadCallbacks = [];

  function getDocsRoot() {
    if (_self && _self.src) {
      return _self.src.replace(/assets\/[^/]+$/, "");
    }
    var loc = window.location.href;
    return loc.substring(0, loc.lastIndexOf("/") + 1).replace(/[^/]+\/$/, "");
  }

  function loadBundle(cb) {
    if (bundleLoaded) { cb(); return; }
    loadCallbacks.push(cb);
    if (bundleLoading) return;
    bundleLoading = true;
    var s = document.createElement("script");
    s.src = getDocsRoot() + "wgblas.browser.js";
    s.onload = function () {
      bundleLoaded = true;
      loadCallbacks.forEach(function (fn) { fn(); });
      loadCallbacks = [];
    };
    s.onerror = function () {
      console.error("[wgblas] Failed to load bundle: " + s.src);
    };
    document.head.appendChild(s);
  }

  function transformCode(code) {
    var imports = [];
    var transformed = code.replace(
      /import\s*\{([^}]+)\}\s*from\s*["']wgblas(?:\/[^"']*)?["'];?\n?/g,
      function (_, names) {
        names.split(",").forEach(function (n) {
          var t = n.trim();
          if (t) imports.push(t);
        });
        return "";
      },
    );
    var unique = imports.filter(function (v, i, a) { return a.indexOf(v) === i; });
    return (unique.length > 0 ? "const { " + unique.join(", ") + " } = window.wgblas;\n" : "") + transformed;
  }

  function formatArg(a) {
    if (a instanceof Float32Array || a instanceof Float64Array) {
      return a.constructor.name + " [" + Array.from(a).map(function (v) { return v.toFixed(4); }).join(", ") + "]";
    }
    if (typeof a === "object" && a !== null) return JSON.stringify(a);
    return String(a);
  }

  // Plain-text grid for console.table (array of arrays or array of objects) —
  // the page's output is a <pre>, not a live DevTools table, so this renders
  // a space-padded grid instead. Falls back to formatArg for non-tabular data.
  function formatTable(data) {
    if (!Array.isArray(data)) return formatArg(data);
    var rows = data.map(function (row) {
      if (Array.isArray(row)) return row.map(formatArg);
      if (typeof row === "object" && row !== null)
        return Object.keys(row).map(function (k) { return formatArg(row[k]); });
      return [formatArg(row)];
    });
    var cols = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
    var widths = [];
    for (var c = 0; c < cols; c++) {
      widths[c] = rows.reduce(function (m, r) { return Math.max(m, (r[c] || "").length); }, 0);
    }
    return rows.map(function (r) {
      return r.map(function (cell, c) {
        return (cell || "").padStart(widths[c]);
      }).join("  ");
    }).join("\n");
  }

  function addRunButton(pre) {
    if (pre.dataset.runAdded) return;
    var code = pre.querySelector("code");
    if (!code) return;
    if (!code.innerText.includes("import")) return;

    pre.dataset.runAdded = "1";

    var btn = document.createElement("button");
    btn.textContent = "▶ Run";
    btn.setAttribute("style",
      "position:absolute;top:10px;left:10px;right:auto;padding:2px 10px;" +
      "background:var(--color-link);color:var(--color-background);border:none;border-radius:4px;" +
      "font-size:12px;cursor:pointer;font-weight:600;line-height:1.5;"
    );

    var output = document.createElement("pre");
    output.setAttribute("style",
      "display:none;margin:4px 0 8px;padding:10px 14px;" +
      "background:var(--color-background-secondary);color:var(--color-text);border-radius:4px;" +
      "font-size:12px;line-height:1.6;white-space:pre-wrap;" +
      "max-height:240px;overflow:auto;border:1px solid var(--color-accent);"
    );

    btn.addEventListener("click", function () {
      if (!navigator.gpu) {
        output.style.display = "block";
        output.textContent = "⚠ WebGPU is not supported in this browser.";
        return;
      }
      btn.disabled = true;
      btn.textContent = "⏳ Running…";
      output.style.display = "block";
      output.textContent = "";
      loadBundle(function () {
        var transformed = transformCode(code.innerText);
        var logs = [];
        var origLog = console.log;
        var origWarn = console.warn;
        var origError = console.error;
        var origTable = console.table;
        function capture(prefix) {
          return function () {
            var line = prefix + Array.prototype.slice.call(arguments).map(formatArg).join(" ");
            logs.push(line);
            origLog.apply(console, arguments);
          };
        }
        console.log = capture("");
        console.warn = capture("⚠ ");
        console.error = capture("❌ ");
        console.table = function (data) {
          logs.push(formatTable(data));
          if (origTable) origTable.apply(console, arguments);
        };
        (async function () {
          try {
            await eval("(async () => { " + transformed + " })()");
            output.textContent = logs.length ? logs.join("\n") : "(no output)";
          } catch (e) {
            output.textContent = "❌ " + e.message;
          } finally {
            console.log = origLog;
            console.warn = origWarn;
            console.error = origError;
            console.table = origTable;
            try { if (window.wgblas && window.wgblas.cleanup) window.wgblas.cleanup(); } catch (e) { void e; }
            btn.disabled = false;
            btn.textContent = "▶ Run";
          }
        })();
      });
    });

    pre.insertAdjacentElement("afterend", output);
    pre.appendChild(btn);
  }

  function init() {
    document.querySelectorAll("pre").forEach(addRunButton);
  }

  init();
  setTimeout(init, 600);
  setTimeout(init, 1200);
})();
