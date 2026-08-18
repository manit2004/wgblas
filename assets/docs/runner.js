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

  // CodeMirror 5 (classic <script>-tag build, no bundler needed) turns each
  // runnable example into an in-place editor. Loaded once, lazily, the first
  // time a runnable block is found on the page.
  var CM_VERSION = "5.65.21";
  var cmCallbacks = null;

  function loadCodeMirror(cb) {
    if (window.CodeMirror) { cb(); return; }
    if (cmCallbacks) { cmCallbacks.push(cb); return; }
    cmCallbacks = [cb];

    var base = "https://unpkg.com/codemirror@" + CM_VERSION + "/";
    [base + "lib/codemirror.css", base + "theme/material-darker.css"].forEach(function (href) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    });

    var style = document.createElement("style");
    // TypeDoc's built-in "Copy" button sits at `top:10px;right:10px` on every
    // <pre>. Once a block is tall enough for CodeMirror's own scrollbar to
    // show, the two visually overlap — nudge Copy left, only on blocks that
    // actually have an editor in them.
    style.textContent =
      ".CodeMirror{height:auto;border-radius:4px;font-family:inherit;font-size:13px;}" +
      ".CodeMirror-scroll{max-height:400px;}" +
      "pre:has(.CodeMirror) > button{right:28px;}";
    document.head.appendChild(style);

    function chain(scripts, done) {
      if (!scripts.length) { done(); return; }
      var s = document.createElement("script");
      s.src = scripts[0];
      s.onload = function () { chain(scripts.slice(1), done); };
      s.onerror = function () {
        console.error("[wgblas] Failed to load " + scripts[0]);
        chain(scripts.slice(1), done);
      };
      document.head.appendChild(s);
    }

    chain(
      [
        base + "lib/codemirror.js",
        base + "mode/xml/xml.js",
        base + "mode/javascript/javascript.js",
        base + "mode/css/css.js",
        base + "mode/htmlmixed/htmlmixed.js",
      ],
      function () {
        var cbs = cmCallbacks;
        cmCallbacks = null;
        cbs.forEach(function (fn) { fn(); });
      },
    );
  }

  // Replaces the static, syntax-highlighted `code` block with an editable
  // CodeMirror instance once the library has loaded. Until then (and if it
  // fails to load), `getter.getValue()` falls back to the original static
  // text, so the Run button works immediately either way.
  function makeEditor(code, mode, getter) {
    loadCodeMirror(function () {
      var textarea = document.createElement("textarea");
      textarea.value = code.innerText;
      code.insertAdjacentElement("afterend", textarea);

      var cm = CodeMirror.fromTextArea(textarea, {
        mode: mode,
        lineNumbers: true,
        theme: previewIsDark() ? "material-darker" : "default",
        viewportMargin: Infinity,
        tabSize: 2,
        indentUnit: 2,
      });
      code.style.display = "none";
      getter.getValue = function () { return cm.getValue(); };

      // Keep the editor's theme in sync if the reader flips the site theme.
      new MutationObserver(function () {
        cm.setOption("theme", previewIsDark() ? "material-darker" : "default");
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    });
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

    // Falls back to the static text until makeEditor() swaps this in below.
    var getter = { getValue: function () { return code.innerText; } };

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
        var transformed = transformCode(getter.getValue());
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

    makeEditor(code, "javascript", getter);
  }

  // TypeDoc's own theme toggle stores "light" | "dark" | "os" and reflects the
  // resolved choice onto <html data-theme>; "os" leaves the attribute unset and
  // falls back to the OS/browser preference — mirror that here so the iframe's
  // separate document (which doesn't inherit the parent's CSS) matches it.
  function previewIsDark() {
    var t = document.documentElement.dataset.theme;
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function withPreviewTheme(html) {
    var style = previewIsDark()
      ? "<style>html,body{background:#1e1e1e;color:#e6e6e6;color-scheme:dark;}</style>"
      : "<style>html,body{background:#ffffff;color:#1b1b1b;color-scheme:light;}</style>";
    return /<head[^>]*>/i.test(html)
      ? html.replace(/<head[^>]*>/i, function (m) { return m + style; })
      : style + html;
  }

  function addHtmlPreview(pre) {
    if (pre.dataset.htmlPreviewAdded) return;
    var code = pre.querySelector("code.html");
    if (!code) return;
    if (!/^\s*<!doctype html>/i.test(code.innerText)) return;

    pre.dataset.htmlPreviewAdded = "1";

    // Falls back to the static text until makeEditor() swaps this in below.
    var getter = { getValue: function () { return code.innerText; } };

    var btn = document.createElement("button");
    btn.textContent = "▶ Run";
    btn.setAttribute("style",
      "position:absolute;top:10px;left:10px;right:auto;padding:2px 10px;" +
      "background:var(--color-link);color:var(--color-background);border:none;border-radius:4px;" +
      "font-size:12px;cursor:pointer;font-weight:600;line-height:1.5;"
    );

    var frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("title", "Live preview");
    frame.setAttribute("style",
      "display:none;width:100%;height:180px;margin:4px 0 8px;" +
      "background:var(--color-background);border-radius:4px;border:1px solid var(--color-accent);"
    );

    btn.addEventListener("click", function () {
      frame.style.display = "block";
      // Reassigning srcdoc reloads the iframe, re-running the example fresh each click.
      frame.srcdoc = withPreviewTheme(getter.getValue());
      btn.textContent = "↻ Re-run";
    });

    pre.insertAdjacentElement("afterend", frame);
    pre.appendChild(btn);

    makeEditor(code, "htmlmixed", getter);
  }

  function init() {
    document.querySelectorAll("pre").forEach(addRunButton);
    document.querySelectorAll("pre").forEach(addHtmlPreview);
  }

  init();
  setTimeout(init, 600);
  setTimeout(init, 1200);
})();
