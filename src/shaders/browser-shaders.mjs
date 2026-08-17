import argmax from "./reduction/argmax.wgsl";
import argmaxF64 from "./reduction/argmaxF64.wgsl";
import sum from "./reduction/sum.wgsl";
import sumF64 from "./reduction/sumF64.wgsl";
import sscal from "./sscal.wgsl";
import sswap from "./sswap.wgsl";
import saxpy from "./saxpy.wgsl";
import scopy from "./scopy.wgsl";
import sdot from "./sdot.wgsl";
import sasum from "./sasum.wgsl";
import snrm2 from "./snrm2.wgsl";
import srot from "./srot.wgsl";
import srotm from "./srotm.wgsl";
import isamax from "./isamax.wgsl";
import sgemv_n from "./sgemv_n.wgsl";
import sgemv_t from "./sgemv_t.wgsl";
import ssymv from "./ssymv.wgsl";
import strmv from "./strmv.wgsl";
import sger from "./sger.wgsl";
import ssyr from "./ssyr.wgsl";
import ssyr2 from "./ssyr2.wgsl";
import f64add from "./f64add.wgsl";
import dekker from "./f64/dekker.wgsl";
import ddAbs from "./f64/utils/abs.wgsl";
import ddAddUtil from "./f64/utils/add.wgsl";
import ddGreater from "./f64/utils/greater.wgsl";
import ddEqual from "./f64/utils/equal.wgsl";
import dasum from "./dasum.wgsl";
import idamax from "./idamax.wgsl";
import strsv_invert_block from "./strsv_invert_block.wgsl";
import strsv_apply_inverse from "./strsv_apply_inverse.wgsl";
import strsv_update from "./strsv_update.wgsl";
import sgemm_small from "./sgemm_small.wgsl";
import sgemm_large from "./sgemm_large.wgsl";
import sgemmtr_small from "./sgemmtr_small.wgsl";
import sgemmtr_large from "./sgemmtr_large.wgsl";
import symmetrize from "./symmetrize.wgsl";
import triangularize from "./triangularize.wgsl";

export const shaderSources = {
  "reduction/argmax": argmax,
  "reduction/argmaxF64": argmaxF64,
  "reduction/sum": sum,
  "reduction/sumF64": sumF64,
  sscal,
  sswap,
  saxpy,
  scopy,
  sdot,
  sasum,
  snrm2,
  srot,
  srotm,
  isamax,
  sgemv_n,
  sgemv_t,
  ssymv,
  strmv,
  sger,
  ssyr,
  ssyr2,
  f64add,
  "f64/dekker": dekker,
  "f64/utils/abs": ddAbs,
  "f64/utils/add": ddAddUtil,
  "f64/utils/greater": ddGreater,
  "f64/utils/equal": ddEqual,
  dasum,
  idamax,
  strsv_invert_block,
  strsv_apply_inverse,
  strsv_update,
  sgemm_small,
  sgemm_large,
  sgemmtr_small,
  sgemmtr_large,
  symmetrize,
  triangularize,
};
