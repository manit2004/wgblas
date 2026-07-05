var wgblas=(()=>{var jr=Object.create;var L=Object.defineProperty;var Qr=Object.getOwnPropertyDescriptor;var Xr=Object.getOwnPropertyNames;var Hr=Object.getPrototypeOf,Kr=Object.prototype.hasOwnProperty;var q=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var M=(t,r,e)=>()=>{if(e)throw e[0];try{return t&&(r=t(t=0)),r}catch(a){throw e=[a],a}};var X=(t,r)=>{for(var e in r)L(t,e,{get:r[e],enumerable:!0})},H=(t,r,e,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of Xr(r))!Kr.call(t,o)&&o!==e&&L(t,o,{get:()=>r[o],enumerable:!(a=Qr(r,o))||a.enumerable});return t};var Y=(t,r,e)=>(e=t!=null?jr(Hr(t)):{},H(r||!t||!t.__esModule?L(e,"default",{value:t,enumerable:!0}):e,t)),Zr=t=>H(L({},"__esModule",{value:!0}),t);var ur,sr=M(()=>{ur=`// amax reduction: collapses 2*WGS (value, index) pairs into one index.
// dispatch: 1 workgroup of WGS threads.
// partials_val and partials_idx must have exactly 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials_val: array<f32>;
@group(0) @binding(1) var<storage, read>       partials_idx: array<u32>;
@group(0) @binding(2) var<storage, read_write> result:       array<u32>;

const WGS: u32 = 64;

var<workgroup> tile_val: array<f32, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn reduce(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a_val = partials_val[i];
  let b_val = partials_val[i + WGS];
  if (b_val > a_val || (b_val == a_val && partials_idx[i + WGS] < partials_idx[i])) {
    tile_val[i] = b_val;
    tile_idx[i] = partials_idx[i + WGS];
  } else {
    tile_val[i] = a_val;
    tile_idx[i] = partials_idx[i];
  }
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) {
      let c_val = tile_val[i];
      let d_val = tile_val[i + s];
      if (d_val > c_val || (d_val == c_val && tile_idx[i + s] < tile_idx[i])) {
        tile_val[i] = d_val;
        tile_idx[i] = tile_idx[i + s];
      }
    }
    workgroupBarrier();
  }

  if (i == 0u) { result[0] = tile_idx[0]; }
}
`});var pr,fr=M(()=>{pr=`// sum reduction: collapses 2*WGS partials into one scalar.
// dispatch: 1 workgroup of WGS threads.
// partials must have exactly 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials: array<f32>;
@group(0) @binding(1) var<storage, read_write> result:   array<f32>;

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn reduce(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  tile[i] = partials[i] + partials[i + WGS];
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (i < s) { tile[i] += tile[i + s]; }
    workgroupBarrier();
  }

  if (i == 0u) { result[0] = tile[0]; }
}
`});var mr,cr=M(()=>{mr=`// sscal: x = alpha * x

@group(0) @binding(0) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  x_inc: u32,
}

@group(0) @binding(1) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    x[id * params.x_inc] = params.alpha * x[id * params.x_inc];
  }
}
`});var dr,lr=M(()=>{dr=`// sswap: x <-> y

@group(0) @binding(0) var<storage, read_write> x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let temp = x[id * params.x_inc];
    x[id * params.x_inc] = y[id * params.y_inc];
    y[id * params.y_inc] = temp;
  }
}
`});var wr,gr=M(()=>{wr=`// saxpy: y = alpha * x + y

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    y[id * params.y_inc] = params.alpha * x[id * params.x_inc] + y[id * params.y_inc];
  }
}
`});var xr,yr=M(()=>{xr=`// scopy: y = x

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    y[id * params.y_inc] = x[id * params.x_inc];
  }
}
`});var vr,br=M(()=>{vr=`// sdot: result = sum(x[i] * y[i])
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read>       y:        array<f32>;
@group(0) @binding(2) var<storage, read_write> partials: array<f32>;
@group(0) @binding(3) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc: f32 = 0.0;
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    acc += x[id * params.x_inc] * y[id * params.y_inc];
  }
  tile[lid.x] = acc;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var _r,hr=M(()=>{_r=`// sasum: result = sum(|x[i]|)
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/abssum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>;
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc: f32 = 0.0;
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    acc += abs(x[id * params.x_inc]);
  }
  tile[lid.x] = acc;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var Gr,Br=M(()=>{Gr=`// snrm2: result = sqrt(sum(x[i] * x[i]))
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/sqsum.wgsl.

@group(0) @binding(0) var<storage, read>       x:        array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<f32>;
@group(0) @binding(2) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc: f32 = 0.0;
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let v = x[id * params.x_inc];
    acc += v * v;
  }
  tile[lid.x] = acc;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) { tile[lid.x] += tile[lid.x + s]; }
    workgroupBarrier();
  }

  if (lid.x == 0u) { partials[wgid.x] = tile[0]; }
}
`});var Pr,Er=M(()=>{Pr=`// srot: x = c*x + s*y,  y = -s*x + c*y

@group(0) @binding(0) var<storage, read_write> x: array<f32>;
@group(0) @binding(1) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  c:     f32,
  s:     f32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let xi = x[id * params.x_inc];
    let yi = y[id * params.y_inc];
    x[id * params.x_inc] =  params.c * xi + params.s * yi;
    y[id * params.y_inc] = -params.s * xi + params.c * yi;
  }
}
`});var kr,Ar=M(()=>{kr=`// srotm: applies modified Givens rotation H to vectors x and y.
// param[0] = flag: -1 (full H), 0 (unit diagonal), 1 (unit off-diagonal)
// param = [ flag, h11, h21, h12, h22 ]
// flag == -2 (identity/no-op) is handled in JS before dispatch reaches here.

@group(0) @binding(0) var<storage, read_write> x:     array<f32>;
@group(0) @binding(1) var<storage, read_write> y:     array<f32>;
@group(0) @binding(2) var<storage, read>       param: array<f32>;

struct Params {
  n:     u32,
  x_inc: u32,
  y_inc: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  let flag = param[0];

  var h11: f32; var h12: f32;
  var h21: f32; var h22: f32;

  if (flag == -1.0) {
    // full 2x2 matrix
    h11 = param[1]; h21 = param[2];
    h12 = param[3]; h22 = param[4];
  } else if (flag == 0.0) {
    // diagonal fixed at 1
    h11 = 1.0;      h21 = param[2];
    h12 = param[3]; h22 = 1.0;
  } else if (flag == 1.0) {
    // flag == 1.0: off-diagonal fixed at +1 / -1
    h11 = param[1]; h21 = -1.0;
    h12 = 1.0;      h22 = param[4];
  }

  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let xi = x[id * params.x_inc];
    let yi = y[id * params.y_inc];
    x[id * params.x_inc] = h11 * xi + h12 * yi;
    y[id * params.y_inc] = h21 * xi + h22 * yi;
  }
}
`});var Fr,Sr=M(()=>{Fr=`// isamax: returns index of element with largest absolute value
// pass 1 dispatches exactly 2 * WGS workgroups; pass 2 uses reduction/argmax.wgsl.

@group(0) @binding(0) var<storage, read>       x:            array<f32>;
@group(0) @binding(1) var<storage, read_write> partials_val: array<f32>;
@group(0) @binding(2) var<storage, read_write> partials_idx: array<u32>;
@group(0) @binding(3) var<uniform>             params:       Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

var<workgroup> tile_val: array<f32, 64>;
var<workgroup> tile_idx: array<u32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  // -1.0 is a safe sentinel: any |x[i]| >= 0 beats it,
  // so workgroups with no elements lose gracefully in the epilogue.
  var best_val: f32 = -1.0;
  var best_idx: u32 = 0u;

  for (var id = gid.x; id < params.n; id += num_wg.x * WGS) {
    let v = abs(x[id * params.x_inc]);
    if (v > best_val) {
      best_val = v;
      best_idx = id;
    }
  }

  tile_val[lid.x] = best_val;
  tile_idx[lid.x] = best_idx;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    if (lid.x < s) {
      let a_val = tile_val[lid.x];
      let b_val = tile_val[lid.x + s];
      if (b_val > a_val || (b_val == a_val && tile_idx[lid.x + s] < tile_idx[lid.x])) {
        tile_val[lid.x] = b_val;
        tile_idx[lid.x] = tile_idx[lid.x + s];
      }
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partials_val[wgid.x] = tile_val[0];
    partials_idx[wgid.x] = tile_idx[0];
  }
}
`});var Rr={};X(Rr,{shaderSources:()=>ce});var ce,Wr=M(()=>{sr();fr();cr();lr();gr();yr();br();hr();Br();Er();Ar();Sr();ce={"reduction/argmax":ur,"reduction/sum":pr,sscal:mr,sswap:dr,saxpy:wr,scopy:xr,sdot:vr,sasum:_r,snrm2:Gr,srot:Pr,srotm:kr,isamax:Fr}});var we={};X(we,{GpuVector:()=>m,cleanup:()=>ar,gpuName:()=>or,init:()=>tr,isamax:()=>qr,randomFloat32Array:()=>ir,randomFloat64Array:()=>nr,sasum:()=>Dr,saxpy:()=>Ur,scopy:()=>Nr,sdot:()=>Cr,snrm2:()=>Lr,srot:()=>Yr,srotm:()=>$r,sscal:()=>Mr,sswap:()=>Tr});function K(t,r){return r?t.features.has("timestamp-query")?{requiredFeatures:["timestamp-query"]}:(console.warn("timestamp-query not supported on this device \u2014 benchmark mode disabled."),{}):{}}function Z(){if(!rr())return{querySet:null,passDescriptor:void 0};let r=F().createQuerySet({type:"timestamp",count:2});return{querySet:r,passDescriptor:{timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}}}function J(t,r){if(!r)return null;let e=F(),a=e.createBuffer({label:"timestamp-resolve",size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC});t.resolveQuerySet(r,0,2,a,0);let o=e.createBuffer({label:"timestamp-readback",size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(a,0,o,0,16),{tsReadBuffer:o,resolveBuffer:a,querySet:r}}async function B(t){if(!t)return;let{tsReadBuffer:r,resolveBuffer:e,querySet:a}=t;await r.mapAsync(GPUMapMode.READ);let o=new BigInt64Array(r.getMappedRange().slice());return r.unmap(),r.destroy(),e.destroy(),a.destroy(),Number(o[1]-o[0])/1e6}var U=null,z=null,er=null,$=!1;async function tr({powerPreference:t="high-performance",benchmark:r=!1}={}){if(U)return U;let e;if(typeof window>"u"){let{create:a,globals:o}=await import("webgpu");Object.assign(globalThis,o),e=a([]),er=e}else e=navigator.gpu;if(!e)throw new Error("WebGPU not supported in this environment.");if(z=await e.requestAdapter({powerPreference:t})??await e.requestAdapter(),!z)throw new Error("No WebGPU adapter found.");return $=r,U=await z.requestDevice(K(z,r)),U.addEventListener("uncapturederror",a=>{console.error("Uncaptured GPU error:",a.error.message)}),U}function ar(){U&&(U.destroy(),U=null),z=null,er=null,$=!1}function or(){if(!z)throw new Error("WebGPU adapter not initialized \u2014 call init() first.");let{device:t,description:r}=z.info;return{description:r||"unknown",device:t||"unknown"}}function rr(){return $}function F(){if(!U)throw new Error("WebGPU device not initialized \u2014 call init() first.");return U}function w(...t){t.flat().forEach(r=>r.destroy())}function x(t,r="blas-input",e=!1){let a=F(),o=a.limits.maxStorageBufferBindingSize,n=t.byteLength;if(n>o)throw new Error(`Buffer size ${n} bytes exceeds device limit of ${o} bytes.`);let s=e?GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.STORAGE,i=a.createBuffer({label:r,size:n,usage:s,mappedAtCreation:!0});return new Float32Array(i.getMappedRange()).set(t),i.unmap(),i}function V(t,r="blas-storage"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE})}function C(t,r="blas-result"){return F().createBuffer({label:r,size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC})}function h(t,r){let a=F().createBuffer({label:"blas-readback",size:r.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});return t.copyBufferToBuffer(r,0,a,0,r.size),a}function R(t,r="blas-params"){let e=F(),a=t.length*4,o=Math.ceil(a/16)*16,n=new ArrayBuffer(o),s=new DataView(n);t.forEach(({value:u,type:f},p)=>{let c=p*4;if(f==="u32")s.setUint32(c,u,!0);else if(f==="i32")s.setInt32(c,u,!0);else if(f==="f32")s.setFloat32(c,u,!0);else throw new Error(`Unknown param type "${f}". Use "f32", "u32", or "i32".`)});let i=e.createBuffer({label:r,size:o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(i,0,n),i}async function _(t,r=Float32Array){await t.mapAsync(GPUMapMode.READ);let e=new r(t.getMappedRange().slice());return t.unmap(),e}var m=class t{constructor(r,e,a=Float32Array){this._buf=r,this.length=e,this.dtype=a}static from(r){if(!(r instanceof Float32Array))throw new Error("GpuVector.from expects a Float32Array.");let e=x(r,"gpu-vector",!0);return new t(e,r.length,r.constructor)}async read(){let r=F(),e=r.createCommandEncoder(),a=h(e,this._buf);return r.queue.submit([e.finish()]),_(a,this.dtype)}destroy(){this._buf.destroy()}};function ir(t,r=-1,e=1){let a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function nr(t,r=-1,e=1){let a=new Float64Array(t);for(let o=0;o<t;o++)a[o]=r+Math.random()*(e-r);return a}function G(t,r,e=null){let a=F(),n=(e?[...r,e]:[...r]).map((s,i)=>({binding:i,resource:{buffer:s}}));return a.createBindGroup({layout:t,entries:n})}function E(t){F().queue.submit([t.finish()])}function P(t,r,e){let a=F(),{querySet:o,passDescriptor:n}=Z(),s=a.createCommandEncoder(),i=s.beginComputePass(n);i.setPipeline(t),i.setBindGroup(0,r),typeof e=="number"?i.dispatchWorkgroups(e):i.dispatchWorkgroups(e.x,e.y),i.end();let u=J(s,o);return s._passEncoder=i,{commandEncoder:s,ts:u}}var de={},j=new WeakMap;async function A(t,r){j.has(t)||j.set(t,new Map);let e=j.get(t);return e.has(r)||e.set(r,await le(r)),e.get(r)}async function me(t){if(typeof window<"u"){let{shaderSources:r}=await Promise.resolve().then(()=>(Wr(),Rr)),e=r[t];if(!e)throw new Error(`Shader "${t}" not found in browser bundle.`);return e}else{let{readFileSync:r}=await import("fs"),{fileURLToPath:e}=await import("url"),{dirname:a,join:o}=await import("path"),n=a(e(de.url));return r(o(n,`../shaders/${t}.wgsl`),"utf8")}}async function le(t){let r=F(),e=await me(t),a=r.createShaderModule({label:t,code:e}),n=(await a.getCompilationInfo()).messages.filter(i=>i.type==="error");if(n.length>0)throw new Error(`Shader "${t}" compilation failed:
${n.map(i=>`  line ${i.lineNum}: ${i.message}`).join(`
`)}`);let s=r.createComputePipeline({label:t,layout:"auto",compute:{module:a}});return s._shaderModule=a,s}var ge=64,Ir=8;function T(t,r){let e=F().limits.maxComputeWorkgroupsPerDimension;return r===void 0?Math.min(Math.ceil(t/ge),e):{x:Math.min(Math.ceil(r/Ir),e),y:Math.min(Math.ceil(t/Ir),e)}}async function Mr(t,r,e,a,o){let n=a instanceof m;if(!Number.isInteger(r)||!Number.isInteger(o))throw new Error("n and incx must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(o<=0)throw new Error("incx must be positive.");if(!(a instanceof Float32Array)&&!(a instanceof m))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return n?{}:a;if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");let s=await A(t,"sscal"),i=n?a._buf:x(a,"sscal-x",!0),u=R([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"}],"sscal-params"),f=G(s.getBindGroupLayout(0),[i,u]),{commandEncoder:p,ts:c}=P(s,f,T(r)),y=n?null:h(p,i);E(p);let l=await B(c);if(n)return w(u),l!==void 0?{gpuTimeMs:l}:{};let k=await _(y,Float32Array);return w(i,u,y),l!==void 0?{result:k,gpuTimeMs:l}:k}async function Tr(t,r,e,a,o,n){let s=e instanceof m,i=o instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!(e instanceof Float32Array)&&!(e instanceof m))throw new Error("x must be a Float32Array or GpuVector.");if(!(o instanceof Float32Array)&&!(o instanceof m))throw new Error("y must be a Float32Array or GpuVector.");if(e.constructor!==o.constructor)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return s?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"sswap"),f=s?e._buf:x(e,"sswap-x",!0),p=i?o._buf:x(o,"sswap-y",!0),c=R([{value:r,type:"u32"},{value:a,type:"u32"},{value:n,type:"u32"}],"sswap-params"),y=G(u.getBindGroupLayout(0),[f,p,c]),{commandEncoder:l,ts:k}=P(u,y,T(r)),v=s?null:h(l,f),S=i?null:h(l,p);E(l);let d=await B(k);if(s&&i)return w(c),d!==void 0?{gpuTimeMs:d}:{};let b=await _(v,Float32Array),g=await _(S,Float32Array);return w(f,v,p,S,c),d!==void 0?{x:b,y:g,gpuTimeMs:d}:{x:b,y:g}}async function Ur(t,r,e,a,o,n,s){let i=a instanceof m,u=n instanceof m;if(!Number.isInteger(r)||!Number.isInteger(o)||!Number.isInteger(s))throw new Error("n, incx, and incy must be integers.");if(isNaN(e))throw new Error("alpha must not be NaN.");if(o<=0||s<=0)throw new Error("incx and incy must be positive.");if(!i&&!(a instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(n instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{y:n};if(a.length<(r-1)*o+1)throw new Error("x does not have enough elements for the given n and incx.");if(n.length<(r-1)*s+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await A(t,"saxpy"),p=i?a._buf:x(a,"saxpy-x",!1),c=u?n._buf:x(n,"saxpy-y",!0),y=R([{value:r,type:"u32"},{value:e,type:"f32"},{value:o,type:"u32"},{value:s,type:"u32"}],"saxpy-params"),l=G(f.getBindGroupLayout(0),[p,c,y]),{commandEncoder:k,ts:v}=P(f,l,T(r)),S=u?null:h(k,c);E(k);let d=await B(v);if(u&&i)return w(y),d!==void 0?{gpuTimeMs:d}:{};let b=await _(S,Float32Array);return w(p,c,y,S),d!==void 0?{y:b,gpuTimeMs:d}:{y:b}}async function Nr(t,r,e,a,o,n){let s=e instanceof m,i=o instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!i&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==i)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return i?{}:{y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"scopy"),f=s?e._buf:x(e,"scopy-x",!1),p=i?o._buf:x(o,"scopy-y",!0),c=R([{value:r,type:"u32"},{value:a,type:"u32"},{value:n,type:"u32"}],"scopy-params"),y=G(u.getBindGroupLayout(0),[f,p,c]),{commandEncoder:l,ts:k}=P(u,y,T(r)),v=i?null:h(l,p);E(l);let S=await B(k);if(i&&s)return w(c),S!==void 0?{gpuTimeMs:S}:{};let d=await _(v,Float32Array);return w(f,p,c,v),S!==void 0?{y:d,gpuTimeMs:S}:{y:d}}var Vr=64;async function Cr(t,r,e,a,o,n){let s=e instanceof m,i=o instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!s&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!i&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(s!==i)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return{dot:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let u=await A(t,"sdot"),f=await A(t,"reduction/sum"),p=s?e._buf:x(e,"sdot-x",!1),c=i?o._buf:x(o,"sdot-y",!1),y=V(2*Vr*4,"sdot-partials"),l=C(4,"sdot-result"),k=R([{value:r,type:"u32"},{value:a,type:"u32"},{value:n,type:"u32"}],"sdot-params"),v=G(u.getBindGroupLayout(0),[p,c,y,k]),{commandEncoder:S,ts:d}=P(u,v,2*Vr);E(S);let b=G(f.getBindGroupLayout(0),[y,l]),{commandEncoder:g,ts:W}=P(f,b,1),I=h(g,l);E(g);let[N,D,O]=await Promise.all([B(d),B(W),_(I,Float32Array)]);return s&&i?(w(y,l,k,I),N!==void 0&&D!==void 0?{dot:O[0],gpuTimeMs:N+D}:{dot:O[0]}):(w(p,c,y,l,k,I),N!==void 0&&D!==void 0?{dot:O[0],gpuTimeMs:N+D}:{dot:O[0]})}var zr=64;async function Dr(t,r,e,a){let o=e instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{asum:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await A(t,"sasum"),s=await A(t,"reduction/sum"),i=o?e._buf:x(e,"sasum-x",!1),u=V(2*zr*4,"sasum-partials"),f=C(4,"sasum-result"),p=R([{value:r,type:"u32"},{value:a,type:"u32"}],"sasum-params"),c=G(n.getBindGroupLayout(0),[i,u,p]),{commandEncoder:y,ts:l}=P(n,c,2*zr);E(y);let k=G(s.getBindGroupLayout(0),[u,f]),{commandEncoder:v,ts:S}=P(s,k,1),d=h(v,f);E(v);let[b,g,W]=await Promise.all([B(l),B(S),_(d,Float32Array)]);return o?(w(u,f,p,d),b!==void 0&&g!==void 0?{asum:W[0],gpuTimeMs:b+g}:{asum:W[0]}):(w(i,u,f,p,d),b!==void 0&&g!==void 0?{asum:W[0],gpuTimeMs:b+g}:{asum:W[0]})}var Or=64;async function Lr(t,r,e,a){let o=e instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{nrm2:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await A(t,"snrm2"),s=await A(t,"reduction/sum"),i=o?e._buf:x(e,"snrm2-x",!1),u=V(2*Or*4,"snrm2-partials"),f=C(4,"snrm2-result"),p=R([{value:r,type:"u32"},{value:a,type:"u32"}],"snrm2-params"),c=G(n.getBindGroupLayout(0),[i,u,p]),{commandEncoder:y,ts:l}=P(n,c,2*Or);E(y);let k=G(s.getBindGroupLayout(0),[u,f]),{commandEncoder:v,ts:S}=P(s,k,1),d=h(v,f);E(v);let[b,g,W]=await Promise.all([B(l),B(S),_(d,Float32Array)]),I=Math.sqrt(W[0]);return o?(w(u,f,p,d),b!==void 0&&g!==void 0?{nrm2:I,gpuTimeMs:b+g}:{nrm2:I}):(w(i,u,f,p,d),b!==void 0&&g!==void 0?{nrm2:I,gpuTimeMs:b+g}:{nrm2:I})}var Q=64;async function qr(t,r,e,a){let o=e instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a))throw new Error("n and incx must be integers.");if(a<=0)throw new Error("incx must be positive.");if(!o&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(r<=0)return{index:0};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");let n=await A(t,"isamax"),s=await A(t,"reduction/argmax"),i=o?e._buf:x(e,"isamax-x",!1),u=V(2*Q*4,"isamax-partials-val"),f=V(2*Q*4,"isamax-partials-idx"),p=C(4,"isamax-result"),c=R([{value:r,type:"u32"},{value:a,type:"u32"}],"isamax-params"),y=G(n.getBindGroupLayout(0),[i,u,f,c]),{commandEncoder:l,ts:k}=P(n,y,2*Q);E(l);let v=G(s.getBindGroupLayout(0),[u,f,p]),{commandEncoder:S,ts:d}=P(s,v,1),b=h(S,p);E(S);let[g,W,I]=await Promise.all([B(k),B(d),_(b,Uint32Array)]),N=I[0];return o?(w(u,f,p,c,b),g!==void 0&&W!==void 0?{index:N,gpuTimeMs:g+W}:{index:N}):(w(i,u,f,p,c,b),g!==void 0&&W!==void 0?{index:N,gpuTimeMs:g+W}:{index:N})}async function Yr(t,r,e,a,o,n,s,i){let u=e instanceof m,f=o instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(isNaN(s)||isNaN(i))throw new Error("c and s must not be NaN.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!u&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!f&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(u!==f)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0)return u?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let p=await A(t,"srot"),c=u?e._buf:x(e,"srot-x",!0),y=f?o._buf:x(o,"srot-y",!0),l=R([{value:r,type:"u32"},{value:s,type:"f32"},{value:i,type:"f32"},{value:a,type:"u32"},{value:n,type:"u32"}],"srot-params"),k=G(p.getBindGroupLayout(0),[c,y,l]),{commandEncoder:v,ts:S}=P(p,k,T(r)),d=u?null:h(v,c),b=f?null:h(v,y);E(v);let g=await B(S);if(u&&f)return w(l),g!==void 0?{gpuTimeMs:g}:{};let[W,I]=await Promise.all([_(d,Float32Array),_(b,Float32Array)]);return w(c,y,l,d,b),g!==void 0?{x:W,y:I,gpuTimeMs:g}:{x:W,y:I}}async function $r(t,r,e,a,o,n,s){let i=e instanceof m,u=o instanceof m;if(!Number.isInteger(r)||!Number.isInteger(a)||!Number.isInteger(n))throw new Error("n, incx, and incy must be integers.");if(!(s instanceof Float32Array)||s.length!==5)throw new Error("param must be a Float32Array of length 5.");if(a<=0||n<=0)throw new Error("incx and incy must be positive.");if(!i&&!(e instanceof Float32Array))throw new Error("x must be a Float32Array or GpuVector.");if(!u&&!(o instanceof Float32Array))throw new Error("y must be a Float32Array or GpuVector.");if(i!==u)throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");if(r<=0||s[0]===-2)return i?{}:{x:e,y:o};if(e.length<(r-1)*a+1)throw new Error("x does not have enough elements for the given n and incx.");if(o.length<(r-1)*n+1)throw new Error("y does not have enough elements for the given n and incy.");let f=await A(t,"srotm"),p=i?e._buf:x(e,"srotm-x",!0),c=u?o._buf:x(o,"srotm-y",!0),y=x(s,"srotm-param",!1),l=R([{value:r,type:"u32"},{value:a,type:"u32"},{value:n,type:"u32"}],"srotm-params"),k=G(f.getBindGroupLayout(0),[p,c,y,l]),{commandEncoder:v,ts:S}=P(f,k,T(r)),d=i?null:h(v,p),b=u?null:h(v,c);E(v);let g=await B(S);if(i&&u)return w(y,l),g!==void 0?{gpuTimeMs:g}:{};let[W,I]=await Promise.all([_(d,Float32Array),_(b,Float32Array)]);return w(p,c,y,l,d,b),g!==void 0?{x:W,y:I,gpuTimeMs:g}:{x:W,y:I}}return Zr(we);})();
