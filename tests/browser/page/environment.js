// Where the tests ran, as text for the top of the test page's "Copy report":
// the browser, the OS, the CPU, and the WebGPU adapter in full (its info,
// features and limits), so a report from someone else's device says what a
// failure needs to be reproduced.

const BROWSERS = [
  [/Edg\/([\d.]+)/, "Edge"],
  [/FxiOS\/([\d.]+)/, "Firefox (iOS)"],
  [/Firefox\/([\d.]+)/, "Firefox"],
  [/CriOS\/([\d.]+)/, "Chrome (iOS)"],
  [/Chrome\/([\d.]+)/, "Chrome"],
  [/Version\/([\d.]+).*Safari/, "Safari"],
];

/** The browser's name and version, from its user agent: "Chrome 157.0". */
export function browserName() {
  const ua = navigator.userAgent;
  for (const [pattern, name] of BROWSERS) {
    const match = ua.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return ua;
}

// The OS as the user agent names it. macOS's version there is frozen at
// 10.15.7 by Chrome and Safari alike, and an iPad names itself a Mac.
const SYSTEMS = [
  [/Windows NT ([\d.]+)/, (v) => `Windows NT ${v}`],
  [/CrOS \S+ ([\d.]+)/, (v) => `ChromeOS ${v}`],
  [/Android ([\d.]+)/, (v) => `Android ${v}`],
  [/(?:iPhone|iPad|CPU) OS ([\d_]+)/, (v) => `iOS ${v.replace(/_/g, ".")}`],
  [
    /Mac OS X ([\d_.]+)/,
    (v) =>
      `macOS ${v.replace(/_/g, ".")} (as the user agent says, which ` +
      `browsers freeze at 10.15.7; an iPad says it too)`,
  ],
  [/Linux/, () => "Linux"],
];

function systemFromUserAgent() {
  for (const [pattern, name] of SYSTEMS) {
    const match = navigator.userAgent.match(pattern);
    if (match) return name(match[1]);
  }
  return "unknown";
}

// Chromium's client hints: the OS's real version, the CPU architecture, the
// browser's full version. Other browsers have none.
async function clientHints() {
  try {
    return await navigator.userAgentData?.getHighEntropyValues([
      "platform",
      "platformVersion",
      "architecture",
      "bitness",
      "model",
      "fullVersionList",
    ]);
  } catch {
    return undefined;
  }
}

function systemFromHints(h) {
  // No version on Linux.
  let name = [h.platform, h.platformVersion].filter(Boolean).join(" ");
  // Windows 11 reports platform version 13 and later; 10, 1 to 10.
  if (h.platform === "Windows") {
    const major = Number(h.platformVersion.split(".")[0]);
    if (major >= 13) name += " (Windows 11)";
    else if (major > 0) name += " (Windows 10)";
  }
  const cpu = [h.architecture, h.bitness && `${h.bitness}-bit`]
    .filter(Boolean)
    .join(" ");
  return [name, cpu, h.model].filter(Boolean).join(", ");
}

// Every limit's value, by name: GPUSupportedLimits has them as attributes,
// which for…in walks.
function limitsOf(adapter) {
  const names = [];
  for (const name in adapter.limits) names.push(name);
  return names.sort().map((name) => `    ${name}: ${adapter.limits[name]}`);
}

function adapterLines(adapter) {
  const info = adapter.info ?? {};
  const fallback = info.isFallbackAdapter ?? adapter.isFallbackAdapter;
  const lines = ["WebGPU adapter:"];
  for (const key of ["vendor", "architecture", "device", "description"])
    lines.push(`  ${key}: ${info[key] || "(not given)"}`);
  if (fallback !== undefined) lines.push(`  fallback adapter: ${fallback}`);
  if (info.subgroupMinSize !== undefined)
    lines.push(
      `  subgroup size: ${info.subgroupMinSize} to ${info.subgroupMaxSize}`,
    );
  lines.push(
    `  features: ${[...adapter.features].sort().join(", ") || "none"}`,
  );
  const wgsl = navigator.gpu.wgslLanguageFeatures;
  if (wgsl)
    lines.push(`  WGSL language features: ${[...wgsl].sort().join(", ")}`);
  lines.push("  limits:", ...limitsOf(adapter));
  return lines;
}

/**
 * The environment, as lines of text.
 * @param {GPUAdapter | undefined} adapter - the adapter the page found
 * @param {string} missing - how there's none, if there isn't
 */
export async function describeEnvironment(adapter, missing) {
  const hints = await clientHints();
  const fullVersions = hints?.fullVersionList
    ?.filter((b) => !/not.a.brand/i.test(b.brand))
    .map((b) => `${b.brand} ${b.version}`)
    .join(", ");
  const memory = navigator.deviceMemory;
  return [
    // The full version from client hints: the user agent's is cut to
    // 157.0.0.0 in Chromium.
    `Browser: ${fullVersions || browserName()}`,
    `User agent: ${navigator.userAgent}`,
    `OS: ${hints?.platform ? systemFromHints(hints) : systemFromUserAgent()}`,
    `CPU threads: ${navigator.hardwareConcurrency ?? "unknown"}` +
      (memory ? `; memory: about ${memory} GB` : ""),
    ...(adapter ? adapterLines(adapter) : [`WebGPU adapter: none: ${missing}`]),
  ];
}
