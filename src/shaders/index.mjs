/**
 * ## Structure
 *
 * `shaders/*.wgsl` — one WGSL compute shader per BLAS routine (sscal, saxpy, sdot, …).
 *
 * `routineShaders` below is the single source of truth: routine name → the WGSL source(s)
 * its `getPipeline()` calls actually reference, verified against every `src/<routine>/<routine>.mjs`
 * rather than inferred from naming convention (see its doc comment for the exceptions). Each
 * shader is imported right above the line that adds it — the import *is* the mapping entry, no
 * separate block to cross-reference. `shaderSources`, the flat name → source registry the
 * browser bundle's runtime lookup needs, is *derived* from `routineShaders` rather than
 * hand-duplicated, so the two can never drift apart. In Node.js neither is read — shaders are
 * `readFileSync` from disk directly; `scripts/build-browser.mjs` inlines this module into the
 * browser's IIFE bundle via esbuild instead.
 *
 * ## Cross-shader patterns
 *
 * **Fixed workgroup size of 64.** Every shader declares `const WGS: u32 = 64` and
 * `@workgroup_size(64)`. 64 is the minimum `maxComputeInvocationsPerWorkgroup` guaranteed across
 * all WebGPU devices, so this works everywhere without querying device limits.
 *
 * **Single bind group.** All bindings use `@group(0)`. This means the JS side always calls
 * `pipeline.getBindGroupLayout(0)` — no secondary groups to track.
 *
 * The `@binding` indices must match the position of each resource in the array passed to
 * `createBindGroup` — it assigns `binding: 0, 1, 2 …` sequentially, with `resultBuffer` appended last.
 *
 * **All counts and strides are `u32`.** `n`, `x_inc`, `y_inc`, and any other index fields in the
 * `Params` uniform struct are unsigned. This avoids implicit sign-extension when they appear in
 * index expressions like `id * params.x_inc`.
 *
 * @module devdocs/shaders
 */

/**
 * Routine name → the WGSL source(s) its `getPipeline()` calls reference. Keys are the exact
 * shader names `getPipeline(device, name)` is called with — most routines have one, some pick
 * one of several conditionally (e.g. sgemv's `sgemv_n`/`sgemv_t`, by `trans`), and some have no
 * dedicated shader at all:
 *
 * - `sgemmtr`/`ssyrk`/`ssyr2k` all dispatch through `sgemmtr_small`/`sgemmtr_large`.
 * - `strsm` reuses `strsv_invert_block` and `sscal`, plus its own `block_transfer` and the
 *   shared `sgemm_small`/`sgemm_large`.
 * - `dasum`/`idamax` concatenate several f64 utility shaders with their own — see
 *   `getPipeline`'s `shaderName: string[]` behaviour.
 * - `random` has no entry — CPU-only, no `getPipeline()` call.
 *
 * Built up entry by entry so each import sits next to the mapping entry that uses it.
 * @public
 */
export const routineShaders = {};

import sscal from "./sscal.wgsl";
routineShaders.sscal = { sscal };

import sswap from "./sswap.wgsl";
routineShaders.sswap = { sswap };

import saxpy from "./saxpy.wgsl";
routineShaders.saxpy = { saxpy };

import scopy from "./scopy.wgsl";
routineShaders.scopy = { scopy };

import sdot from "./sdot.wgsl";
import sum from "./reduction/sum.wgsl";
routineShaders.sdot = { sdot, "reduction/sum": sum };

import sasum from "./sasum.wgsl";
routineShaders.sasum = { sasum, "reduction/sum": sum };

import snrm2 from "./snrm2.wgsl";
routineShaders.snrm2 = { snrm2, "reduction/sum": sum };

import isamax from "./isamax.wgsl";
import argmax from "./reduction/argmax.wgsl";
routineShaders.isamax = { isamax, "reduction/argmax": argmax };

import dekker from "./f64/dekker.wgsl";
import ddAbs from "./f64/utils/abs.wgsl";
import ddAddUtil from "./f64/utils/add.wgsl";
import dasum from "./dasum.wgsl";
import sumF64 from "./reduction/sumF64.wgsl";
routineShaders.dasum = {
  "f64/dekker": dekker,
  "f64/utils/abs": ddAbs,
  "f64/utils/add": ddAddUtil,
  dasum,
  "reduction/sumF64": sumF64,
};

import ddGreater from "./f64/utils/greater.wgsl";
import ddEqual from "./f64/utils/equal.wgsl";
import idamax from "./idamax.wgsl";
import argmaxF64 from "./reduction/argmaxF64.wgsl";
routineShaders.idamax = {
  "f64/dekker": dekker,
  "f64/utils/abs": ddAbs,
  "f64/utils/greater": ddGreater,
  "f64/utils/equal": ddEqual,
  idamax,
  "reduction/argmaxF64": argmaxF64,
};

import srot from "./srot.wgsl";
routineShaders.srot = { srot };

import srotm from "./srotm.wgsl";
routineShaders.srotm = { srotm };

import sgemv_n from "./sgemv_n.wgsl";
import sgemv_t from "./sgemv_t.wgsl";
routineShaders.sgemv = { sgemv_n, sgemv_t }; // one or the other, picked by trans

import ssymv from "./ssymv.wgsl";
routineShaders.ssymv = { ssymv };

import strmv from "./strmv.wgsl";
routineShaders.strmv = { strmv };

import strsv_invert_block from "./strsv_invert_block.wgsl";
import strsv_apply_inverse from "./strsv_apply_inverse.wgsl";
import strsv_update from "./strsv_update.wgsl";
routineShaders.strsv = { strsv_invert_block, strsv_apply_inverse, strsv_update };

import sger from "./sger.wgsl";
routineShaders.sger = { sger };

import ssyr from "./ssyr.wgsl";
routineShaders.ssyr = { ssyr };

import ssyr2 from "./ssyr2.wgsl";
routineShaders.ssyr2 = { ssyr2 };

import sgemm_small from "./sgemm_small.wgsl";
import sgemm_large from "./sgemm_large.wgsl";
routineShaders.sgemm = { sgemm_small, sgemm_large }; // one or the other, picked by a tile-size threshold

import sgemmtr_small from "./sgemmtr_small.wgsl";
import sgemmtr_large from "./sgemmtr_large.wgsl";
routineShaders.sgemmtr = { sgemmtr_small, sgemmtr_large };

routineShaders.ssyrk = { sgemmtr_small, sgemmtr_large }; // no shader of its own — rides on sgemmtr's
routineShaders.ssyr2k = { sgemmtr_small, sgemmtr_large }; // no shader of its own — rides on sgemmtr's

import symmetrize from "./symmetrize.wgsl";
routineShaders.ssymm = { sgemm_small, sgemm_large, symmetrize };

import triangularize from "./triangularize.wgsl";
routineShaders.strmm = { sgemm_small, sgemm_large, triangularize };

import blockTransfer from "./block_transfer.wgsl";
routineShaders.strsm = {
  strsv_invert_block,
  block_transfer: blockTransfer,
  sscal,
  sgemm_small,
  sgemm_large,
};

/**
 * Flat shader-name → WGSL source-string registry — what `getPipeline()`/`loadShader()` (see
 * `util/pipeline.mjs`) actually look shaders up in, in the browser. Derived from
 * `routineShaders` by merging every routine's shaders together; shared shaders (e.g.
 * `"reduction/sum"`, used by three different routines above) collapse harmlessly here since
 * every routine's copy is the same imported string, never independently authored text.
 * @public
 */
export const shaderSources = Object.assign({}, ...Object.values(routineShaders));
