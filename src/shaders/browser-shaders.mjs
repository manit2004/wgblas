import argmax from "./reduction/argmax.wgsl";
import sum from "./reduction/sum.wgsl";
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

export const shaderSources = {
  "reduction/argmax": argmax,
  "reduction/sum": sum,
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
};
