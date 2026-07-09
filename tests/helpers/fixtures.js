import fc from "fast-check";
import { ulpDiff, maxUlp } from "./ulp.js";

export { ulpDiff, maxUlp };

// WGSL may flush subnormals to zero (FTZ): "To flush to zero is to replace a subnormal value
// for a floating point type with a zero value of that type."
// https://www.w3.org/TR/WGSL/#floating-point-evaluation §15.7.2
// Filtering inputs for subnormals is not enough — products of two small-but-normal values can
// still land in the subnormal range (e.g. F32_MIN_NORMAL * 5.96e-8 ≈ 7e-46). Using 1e-3 as
// the minimum magnitude ensures any pairwise product stays far above F32_MIN_NORMAL
// (1e-3 * 1e-3 = 1e-6 >> 1.175e-38).
const FLOAT_MIN_MAGNITUDE = 1e-3;
const isUsable = (v) => v === 0.0 || Math.abs(v) >= FLOAT_MIN_MAGNITUDE;

export function floatArb(min, max) {
  return fc.float({ min, max, noNaN: true, noDefaultInfinity: true }).filter(isUsable);
}

function scalarArb(spec) {
  const { min, max } = spec.range;
  if (spec.type === "integer") return fc.integer({ min, max });
  return floatArb(min, max);
}

function vectorArb(spec, len) {
  const { elementMin: min, elementMax: max } = spec.range;
  return fc
    .array(floatArb(min, max), { minLength: len, maxLength: len })
    .map((a) => new Float32Array(a));
}

// Builds a fast-check arbitrary that produces a complete args object.
// Scalar params (n, incx, incy, alpha, c, s) are generated first; vectors
// x and y are then sized from (n-1)*inc+1 so lengths are always consistent.
// extras: { name: fc.Arbitrary } for routine-specific args not in the param JSONs.
function buildArb(specs, extras = {}) {
  const scalarOrder = ["n", "incx", "incy", "alpha", "c", "s"];
  const present = scalarOrder.filter((k) => specs[k]);

  const scalarRec = fc.record(
    Object.fromEntries(present.map((k) => [k, scalarArb(specs[k])]))
  );

  return scalarRec.chain((s) => {
    const fields = Object.fromEntries(present.map((k) => [k, fc.constant(s[k])]));

    if (specs.x) {
      const len = (s.n - 1) * (s.incx ?? 1) + 1;
      fields.x = vectorArb(specs.x, len);
    }
    if (specs.y) {
      const len = (s.n - 1) * (s.incy ?? s.incx ?? 1) + 1;
      fields.y = vectorArb(specs.y, len);
    }

    for (const [k, arb] of Object.entries(extras)) fields[k] = arb;

    return fc.record(fields);
  });
}

export async function runFixtures(
  t,
  routineName,
  device,
  numRuns,
  threshold,
  specs,
  callGpu,
  callRef,
  computeUlp,
  extras = {}
) {
  let maxObserved = 0;

  await fc.assert(
    fc.asyncProperty(buildArb(specs, extras), async (args) => {
      const gpuResult = await callGpu(device, args);
      const refResult = callRef(args);
      const diff = computeUlp(gpuResult, refResult, args);
      if (diff > maxObserved) maxObserved = diff;
return diff <= threshold;
    }),
    { numRuns, verbose: true }
  );

  t.diagnostic(
    `${routineName} max ULP: ${maxObserved} / threshold ${threshold} (${numRuns} runs)`
  );
}