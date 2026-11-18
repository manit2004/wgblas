// validation-params:validation-params
var validation_params_default = {
  "A.json": `{
  "_note": "A is the input matrix \u2014 a Float32Array in row-major order with at least (m-1)*lda+n elements. Divides-by-diagonal routines (e.g. strsv) should add 'triangular: true' \u2014 see triangularDiagonalArb in fixtures.js.",
  "type": "float32array",
  "dependsOn": ["m", "n", "lda"],
  "range": { "elementMin": -10.0, "elementMax": 10.0 },
  "invalid": [
    { "special": "null",      "error": "A must be a Float32Array or GpuMatrix", "label": "null" },
    { "special": "undefined", "error": "A must be a Float32Array or GpuMatrix", "label": "undefined" },
    { "special": "array",     "error": "A must be a Float32Array or GpuMatrix", "label": "plain Array []" },
    { "special": "object",    "error": "A must be a Float32Array or GpuMatrix", "label": "plain object {}" },
    { "special": "number",    "error": "A must be a Float32Array or GpuMatrix", "label": "number" },
    { "scenario": "tooShort", "error": "A does not have enough elements", "label": "(m-1)*lda+n-1 elements \u2014 one short" }
  ],
  "edge": [
    { "scenario": "minimal", "label": "exactly (m-1)*lda+n elements \u2014 minimum valid" }
  ],
  "level-3": {
    "_note": "Level 3 override (loadParam('A')['level-3'])",
    "dependsOn": ["m", "k", "lda", "transA"],
    "invalid": [
      { "special": "null",      "error": "A must be a Float32Array or GpuMatrix", "label": "null" },
      { "special": "undefined", "error": "A must be a Float32Array or GpuMatrix", "label": "undefined" },
      { "special": "array",     "error": "A must be a Float32Array or GpuMatrix", "label": "plain Array []" },
      { "special": "object",    "error": "A must be a Float32Array or GpuMatrix", "label": "plain object {}" },
      { "special": "number",    "error": "A must be a Float32Array or GpuMatrix", "label": "number" },
      { "scenario": "tooShort", "error": "A does not have enough elements", "label": "one short of the required minimum" }
    ],
    "edge": [
      { "scenario": "minimal", "label": "exactly the required minimum \u2014 no padding" }
    ]
  }
}
`,
  "B.json":
    '{\n  "_note": "Matrix B",\n  "type": "float32array",\n  "baseline": [1, 0, 0, 1, 0, 0],\n  "dependsOn": ["k", "n", "ldb", "transB"],\n  "range": { "elementMin": -10.0, "elementMax": 10.0 },\n  "invalid": [\n    { "special": "null",      "error": "B must be a Float32Array or GpuMatrix", "label": "null" },\n    { "special": "undefined", "error": "B must be a Float32Array or GpuMatrix", "label": "undefined" },\n    { "special": "array",     "error": "B must be a Float32Array or GpuMatrix", "label": "plain Array []" },\n    { "special": "object",    "error": "B must be a Float32Array or GpuMatrix", "label": "plain object {}" },\n    { "special": "number",    "error": "B must be a Float32Array or GpuMatrix", "label": "number" },\n    { "value": [1, 0, 0],     "error": "B does not have enough elements", "label": "3 of 4 required elements (baseline k=n=2, ldb=2) \u2014 one short" }\n  ],\n  "edge": [\n    { "value": [1, 0, 0, 1], "label": "exactly 4 elements \u2014 minimum valid at k=n=2, ldb=2" }\n  ]\n}\n',
  "C.json":
    '{\n  "_note": "Matrix C",\n  "type": "float32array",\n  "baseline": [0, 0, 0, 0, 0, 0],\n  "dependsOn": ["m", "n", "ldc"],\n  "range": { "elementMin": -10.0, "elementMax": 10.0 },\n  "invalid": [\n    { "special": "null",      "error": "C must be a Float32Array or GpuMatrix", "label": "null" },\n    { "special": "undefined", "error": "C must be a Float32Array or GpuMatrix", "label": "undefined" },\n    { "special": "array",     "error": "C must be a Float32Array or GpuMatrix", "label": "plain Array []" },\n    { "special": "object",    "error": "C must be a Float32Array or GpuMatrix", "label": "plain object {}" },\n    { "special": "number",    "error": "C must be a Float32Array or GpuMatrix", "label": "number" },\n    { "value": [0, 0, 0],     "error": "C does not have enough elements", "label": "3 of 4 required elements (baseline m=n=2, ldc=2) \u2014 one short" }\n  ],\n  "edge": [\n    { "value": [0, 0, 0, 0], "label": "exactly 4 elements \u2014 minimum valid at m=n=2, ldc=2" }\n  ]\n}\n',
  "alpha.json":
    '{\n  "_note": "alpha is the scalar multiplier.",\n  "type": "float",\n  "baseline": 1.0,\n  "range": { "min": -10.0, "max": 10.0 },\n  "invalid": [\n    { "special": "NaN",        "error": "alpha must not be NaN",    "label": "NaN" },\n    { "special": "Infinity",   "error": "alpha must be finite",     "label": "Infinity" },\n    { "special": "-Infinity",  "error": "alpha must be finite",     "label": "-Infinity" }\n  ],\n  "edge": [\n    { "value": 0,   "label": "alpha=0 zeros the contribution" },\n    { "value": 1,   "label": "alpha=1 identity" },\n    { "value": -1,  "label": "alpha=-1 negation" },\n    { "value": 0.5, "label": "alpha=0.5 fractional scale" }\n  ]\n}\n',
  "alphaComplex.json": `{
  "_note": "alpha as a Complex32 scalar (re/im) \u2014 the complex analogue of alpha.json, for routines like cscal. Loaded explicitly by name as 'alphaComplex' (not via the '64'-suffix derive mechanism \u2014 this is a hand-written sibling, not derived from the real-valued spec).",
  "type": "complex32",
  "baseline": { "re": 2.0, "im": 3.0 },
  "range": { "min": -10.0, "max": 10.0 },
  "invalid": [
    { "special": "number",    "error": "alpha must be a Complex32", "label": "plain number" },
    { "special": "object",    "error": "alpha must be a Complex32", "label": "plain object {}" },
    { "special": "array",     "error": "alpha must be a Complex32", "label": "plain Array []" },
    { "special": "null",      "error": "alpha must be a Complex32", "label": "null" },
    { "special": "undefined", "error": "alpha must be a Complex32", "label": "undefined" },
    { "scenario": "nanRe",    "error": "alpha must not be NaN",     "label": "re component is NaN" },
    { "scenario": "nanIm",    "error": "alpha must not be NaN",     "label": "im component is NaN" },
    { "scenario": "infRe",    "error": "alpha must be finite",      "label": "re component is Infinity" },
    { "scenario": "infIm",    "error": "alpha must be finite",      "label": "im component is Infinity" }
  ],
  "edge": [
    { "value": { "re": 0, "im": 0 }, "label": "alpha=0+0i zeros the contribution" },
    { "value": { "re": 1, "im": 0 }, "label": "alpha=1+0i identity" },
    { "value": { "re": 0, "im": 1 }, "label": "alpha=i \u2014 pure rotation" }
  ]
}
`,
  "beta.json":
    '{\n  "_note": "beta is the scalar multiplier for y.",\n  "type": "float",\n  "baseline": 0,\n  "range": { "min": -10.0, "max": 10.0 },\n  "invalid": [\n    { "special": "NaN",       "error": "beta must not be NaN",  "label": "NaN" },\n    { "special": "Infinity",  "error": "beta must be finite",   "label": "Infinity" },\n    { "special": "-Infinity", "error": "beta must be finite",   "label": "-Infinity" }\n  ],\n  "edge": [\n    { "value": 0,  "label": "beta=0 clears y contribution" },\n    { "value": 1,  "label": "beta=1 accumulates onto y" },\n    { "value": -1, "label": "beta=-1 subtracts y" }\n  ]\n}\n',
  "cosine.json":
    '{\n  "_note": "c is the cosine of the rotation angle.",\n  "type": "float",\n  "baseline": 1.0,\n  "range": { "min": -1.0, "max": 1.0 },\n  "invalid": [\n    { "special": "NaN",       "error": "c and s must not be NaN", "label": "NaN" },\n    { "special": "Infinity",  "error": "c must be finite",        "label": "Infinity" },\n    { "special": "-Infinity", "error": "c must be finite",        "label": "-Infinity" }\n  ],\n  "edge": [\n    { "value": 0,  "label": "c=0 (90 degree rotation)" },\n    { "value": 1,  "label": "c=1 identity rotation" },\n    { "value": -1, "label": "c=-1 (180 degree rotation)" }\n  ]\n}\n',
  "device.json":
    '{\n  "_note": "device is the GPUDevice returned by init().",\n  "invalid": [\n    { "special": "null",      "error": "device must be a GPUDevice", "label": "null" },\n    { "special": "undefined", "error": "device must be a GPUDevice", "label": "undefined" },\n    { "special": "object",    "error": "device must be a GPUDevice", "label": "plain object {}" },\n    { "special": "string",    "error": "device must be a GPUDevice", "label": "string" },\n    { "special": "number",    "error": "device must be a GPUDevice", "label": "number" }\n  ]\n}\n',
  "diag.json": `{
  "_note": "diag specifies whether A's diagonal is unit (assumed 1, not read) or non-unit (read from A).",
  "type": "string",
  "values": ["unit", "non-unit"],
  "baseline": "non-unit",
  "invalid": [
    { "value": "U",                  "error": "diag must be 'unit' or 'non-unit'", "label": "shorthand 'U'" },
    { "value": "unit-triangular",    "error": "diag must be 'unit' or 'non-unit'", "label": "expanded string" },
    { "special": "null",             "error": "diag must be 'unit' or 'non-unit'", "label": "null" },
    { "special": "undefined",        "error": "diag must be 'unit' or 'non-unit'", "label": "undefined" },
    { "special": "number",           "error": "diag must be 'unit' or 'non-unit'", "label": "number 42" }
  ],
  "edge": [
    { "value": "unit",     "label": "unit diagonal" },
    { "value": "non-unit", "label": "non-unit diagonal" }
  ]
}
`,
  "incx.json": `{
  "_note": "incx is the stride for x.",
  "type": "integer",
  "baseline": 1,
  "range": { "min": 1, "max": 4 },
  "invalid": [
    { "value": 0,            "error": "must be positive", "label": "zero" },
    { "value": -1,           "error": "must be positive", "label": "negative" },
    { "value": 1.5,          "error": "must be integers", "label": "fractional" },
    { "special": "NaN",      "error": "must be integers", "label": "NaN" },
    { "special": "Infinity", "error": "must be integers", "label": "Infinity" },
    { "special": "string",   "error": "must be integers", "label": "string '1'" },
    { "special": "null",     "error": "must be integers", "label": "null" }
  ],
  "edge": [
    { "value": 1, "label": "incx=1 contiguous access (most common)" },
    { "value": 2, "label": "incx=2 strided \u2014 exercises non-unit stride shader path" },
    { "value": 4, "label": "incx=4 large stride" }
  ]
}
`,
  "incy.json": `{
  "_note": "incy is the stride for y.",
  "type": "integer",
  "baseline": 1,
  "range": { "min": 1, "max": 4 },
  "invalid": [
    { "value": 0,            "error": "must be positive", "label": "zero" },
    { "value": -1,           "error": "must be positive", "label": "negative" },
    { "value": 1.5,          "error": "must be integers", "label": "fractional" },
    { "special": "NaN",      "error": "must be integers", "label": "NaN" },
    { "special": "Infinity", "error": "must be integers", "label": "Infinity" },
    { "special": "string",   "error": "must be integers", "label": "string '1'" },
    { "special": "null",     "error": "must be integers", "label": "null" }
  ],
  "edge": [
    { "value": 1, "label": "incy=1 contiguous access (most common)" },
    { "value": 2, "label": "incy=2 strided" },
    { "value": 4, "label": "incy=4 large stride" }
  ]
}
`,
  "k.json": `{
  "_note": "k is sgemm's shared inner dimension \u2014 columns of op(A), rows of op(B).",
  "type": "integer",
  "baseline": 2,
  "range": { "min": 1, "max": 200 },
  "invalid": [
    { "value": 1.5,           "error": "must be integers", "label": "fractional" },
    { "special": "NaN",       "error": "must be integers", "label": "NaN" },
    { "special": "Infinity",  "error": "must be integers", "label": "Infinity" },
    { "special": "string",    "error": "must be integers", "label": "string '100'" },
    { "special": "null",      "error": "must be integers", "label": "null" },
    { "value": -1,            "error": "must be non-negative", "label": "negative" }
  ],
  "edge": [
    { "value": 1, "label": "k=1 single accumulation term" }
  ]
}
`,
  "layout.json": `{
  "_note": "layout describes how A is stored in memory: 'row-major' (default) or 'column-major'.",
  "type": "string",
  "baseline": "row-major",
  "values": ["row-major", "column-major"],
  "invalid": [
    { "value": "row",      "error": "layout must be", "label": "shorthand 'row'" },
    { "value": "col",      "error": "layout must be", "label": "shorthand 'col'" },
    { "special": "number", "error": "layout must be", "label": "number" },
    { "special": "null",   "error": "layout must be", "label": "null" }
  ],
  "edge": [
    { "value": "row-major",    "label": "row-major storage" },
    { "value": "column-major", "label": "column-major storage" }
  ]
}
`,
  "ld.json":
    '{\n  "_note": "Generic Level 3 leading-dimension check",\n  "type": "integer",\n  "baseline": 2,\n  "range": { "min": 2, "max": 4 },\n  "invalid": [\n    { "value": 1,             "error": "must be >=",      "label": "below required minimum (baseline 2)" },\n    { "value": 1.5,           "error": "must be integers", "label": "fractional" },\n    { "special": "NaN",       "error": "must be integers", "label": "NaN" },\n    { "special": "Infinity",  "error": "must be integers", "label": "Infinity" },\n    { "special": "null",      "error": "must be integers", "label": "null" }\n  ],\n  "edge": [\n    { "value": 2, "label": "dense, no padding" },\n    { "value": 4, "label": "padded" }\n  ]\n}\n',
  "lda.json":
    '{\n  "_note": "lda is the leading dimension of A \u2014 stride between row starts, must be >= n.",\n  "type": "integer",\n  "baseline": 4,\n  "dependsOn": ["n"],\n  "range": { "min": 4, "max": 8 },\n  "invalid": [\n    { "value": 3,             "error": "lda must be >= n", "label": "lda < n (baseline n=4)" },\n    { "value": 1.5,           "error": "must be integers", "label": "fractional" },\n    { "special": "NaN",       "error": "must be integers", "label": "NaN" },\n    { "special": "Infinity",  "error": "must be integers", "label": "Infinity" },\n    { "special": "null",      "error": "must be integers", "label": "null" }\n  ],\n  "edge": [\n    { "value": 4, "label": "lda=n dense, no padding" },\n    { "value": 6, "label": "lda=n+2 padded rows" }\n  ]\n}\n',
  "m.json": `{
  "_note": "m is the number of rows in A.",
  "type": "integer",
  "baseline": 3,
  "range": { "min": 1, "max": 200 },
  "invalid": [
    { "value": 1.5,           "error": "must be integers", "label": "fractional" },
    { "special": "NaN",       "error": "must be integers", "label": "NaN" },
    { "special": "Infinity",  "error": "must be integers", "label": "Infinity" },
    { "special": "string",    "error": "must be integers", "label": "string '100'" },
    { "special": "null",      "error": "must be integers", "label": "null" },
    { "value": -1,            "error": "must be non-negative", "label": "negative" }
  ],
  "edge": [
    { "value": 0, "label": "m=0 returns early without error", "behavior": "noop" },
    { "value": 1, "label": "m=1 single row" }
  ]
}
`,
  "n.json": `{
  "_note": "n is the number of elements (L1) or matrix columns (L2).",
  "type": "integer",
  "baseline": 4,
  "range": { "min": 1, "max": 1000 },
  "invalid": [
    { "value": 1.5,             "error": "must be integers", "label": "fractional" },
    { "special": "NaN",         "error": "must be integers", "label": "NaN" },
    { "special": "Infinity",    "error": "must be integers", "label": "Infinity" },
    { "special": "string",      "error": "must be integers", "label": "string '100'" },
    { "special": "null",        "error": "must be integers", "label": "null" },
    { "special": "undefined",   "error": "must be integers", "label": "undefined" }
  ],
  "edge": [
    { "value": 0,  "label": "n=0 returns early without error",     "behavior": "noop" },
    { "value": -1, "label": "n<0 treated same as n=0 (BLAS spec)", "behavior": "noop" },
    { "value": 1,  "label": "n=1 minimum real operation" }
  ]
}
`,
  "param.json":
    '{\n  "_note": "param is the 5-element modified Givens descriptor [flag, h11, h21, h12, h22]",\n  "type": "srotm_param",\n  "baseline": [0, 1, 0, 0, 1],\n  "range": {\n    "flags": [-1, 0, 1],\n    "coeff": { "min": -2.0, "max": 2.0 }\n  },\n  "invalid": [\n    { "special": "null",      "error": "param must be a Float32Array of length 5", "label": "null" },\n    { "special": "undefined", "error": "param must be a Float32Array of length 5", "label": "undefined" },\n    { "special": "array",     "error": "param must be a Float32Array of length 5", "label": "plain Array []" },\n    { "special": "object",    "error": "param must be a Float32Array of length 5", "label": "plain object {}" },\n    { "special": "number",    "error": "param must be a Float32Array of length 5", "label": "number" },\n    { "scenario": "tooShort", "error": "param must be a Float32Array of length 5", "label": "Float32Array length 4" },\n    { "scenario": "tooLong",  "error": "param must be a Float32Array of length 5", "label": "Float32Array length 6" }\n  ],\n  "edge": [\n    { "scenario": "identity",    "label": "flag=-2 (identity, noop \u2014 returns x and y unchanged)" },\n    { "scenario": "fullMatrix",  "label": "flag=-1 (full 2x2 h matrix)" },\n    { "scenario": "diagOne",     "label": "flag=0  (h11=h22=1, off-diagonal vary)" },\n    { "scenario": "offDiagOne",  "label": "flag=1  (h12=1, h21=-1, diagonal vary)" }\n  ]\n}',
  "s.json":
    '{\n  "_note": "s is the sine of the rotation angle.",\n  "type": "float",\n  "baseline": 0.0,\n  "range": { "min": -1.0, "max": 1.0 },\n  "invalid": [\n    { "special": "NaN",       "error": "c and s must not be NaN", "label": "NaN" },\n    { "special": "Infinity",  "error": "s must be finite",        "label": "Infinity" },\n    { "special": "-Infinity", "error": "s must be finite",        "label": "-Infinity" }\n  ],\n  "edge": [\n    { "value": 0,  "label": "s=0 identity rotation" },\n    { "value": 1,  "label": "s=1 (90 degree rotation)" },\n    { "value": -1, "label": "s=-1 negative rotation" }\n  ]\n}\n',
  "side.json": `{
  "_note": "side selects whether the symmetric operand premultiplies ('left') or postmultiplies ('right').",
  "type": "string",
  "values": ["left", "right"],
  "baseline": "left",
  "invalid": [
    { "value": "L",                  "error": "side must be 'left' or 'right'", "label": "shorthand 'L'" },
    { "value": "leftside",           "error": "side must be 'left' or 'right'", "label": "expanded string" },
    { "special": "null",             "error": "side must be 'left' or 'right'", "label": "null" },
    { "special": "undefined",        "error": "side must be 'left' or 'right'", "label": "undefined" },
    { "special": "number",           "error": "side must be 'left' or 'right'", "label": "number 42" }
  ],
  "edge": [
    { "value": "left",  "label": "A premultiplies B" },
    { "value": "right", "label": "A postmultiplies B" }
  ]
}
`,
  "trans.json": `{
  "_note": "trans selects the matrix operation: 'no-transpose' for A, 'transpose' for A^T. Also reused for transA/transB.",
  "type": "string",
  "baseline": "no-transpose",
  "values": ["no-transpose", "transpose"],
  "invalid": [
    { "value": "N",           "error": "must be", "label": "legacy 'N' string" },
    { "value": "T",           "error": "must be", "label": "legacy 'T' string" },
    { "special": "number",    "error": "must be", "label": "number" },
    { "special": "null",      "error": "must be", "label": "null" },
    { "special": "undefined", "error": "must be", "label": "undefined" }
  ],
  "edge": [
    { "value": "no-transpose", "label": "no-transpose" },
    { "value": "transpose",    "label": "transpose" }
  ]
}
`,
  "uplo.json": `{
  "_note": "uplo selects which triangle is read/written: 'lower' or 'upper'.",
  "type": "string",
  "values": ["lower", "upper"],
  "baseline": "lower",
  "invalid": [
    { "value": "L",                  "error": "uplo must be 'lower' or 'upper'", "label": "shorthand 'L'" },
    { "value": "upper-triangular",   "error": "uplo must be 'lower' or 'upper'", "label": "expanded string" },
    { "special": "null",             "error": "uplo must be 'lower' or 'upper'", "label": "null" },
    { "special": "undefined",        "error": "uplo must be 'lower' or 'upper'", "label": "undefined" },
    { "special": "number",           "error": "uplo must be 'lower' or 'upper'", "label": "number 42" }
  ],
  "edge": [
    { "value": "lower", "label": "lower triangular storage" },
    { "value": "upper", "label": "upper triangular storage" }
  ]
}`,
  "x.json":
    '{\n  "_note": "x is the input vector.",\n  "type": "float32array",\n  "dependsOn": ["trans", "m", "n", "incx"],\n  "range": { "elementMin": -10.0, "elementMax": 10.0 },\n  "invalid": [\n    { "special": "null",      "error": "x must be a Float32Array or GpuVector", "label": "null" },\n    { "special": "undefined", "error": "x must be a Float32Array or GpuVector", "label": "undefined" },\n    { "special": "array",     "error": "x must be a Float32Array or GpuVector", "label": "plain Array []" },\n    { "special": "object",    "error": "x must be a Float32Array or GpuVector", "label": "plain object {}" },\n    { "special": "number",    "error": "x must be a Float32Array or GpuVector", "label": "number" },\n    { "scenario": "tooShort", "error": "x does not have enough elements", "label": "one element short for the active vector length" }\n  ],\n  "edge": [\n    { "scenario": "minimal", "label": "exactly the minimum valid length \u2014 must not throw" }\n  ]\n}\n',
  "xComplex.json": `{
  "_note": "x as a Complex32Array \u2014 the complex analogue of x.json, for routines like cscal. Loaded explicitly by name as 'xComplex', a hand-written sibling of the real-valued spec, not derived from it.",
  "type": "complex32array",
  "dependsOn": ["n", "incx"],
  "range": { "elementMin": -10.0, "elementMax": 10.0 },
  "invalid": [
    { "special": "null",      "error": "x must be a Complex32Array or GpuVector", "label": "null" },
    { "special": "undefined", "error": "x must be a Complex32Array or GpuVector", "label": "undefined" },
    { "special": "array",     "error": "x must be a Complex32Array or GpuVector", "label": "plain Array []" },
    { "special": "object",    "error": "x must be a Complex32Array or GpuVector", "label": "plain object {}" },
    { "special": "number",    "error": "x must be a Complex32Array or GpuVector", "label": "number" },
    { "scenario": "tooShort", "error": "x does not have enough elements", "label": "one complex element short for the active vector length" },
    { "scenario": "wrongDtypeGpuVector", "error": "x must be a Complex32Array-backed GpuVector", "label": "GpuVector backed by the wrong dtype (Float32Array)" }
  ],
  "edge": [
    { "scenario": "minimal", "label": "exactly the minimum valid length \u2014 must not throw" }
  ]
}
`,
  "y.json":
    '{\n  "_note": "y is the input/output vector.",\n  "type": "float32array",\n  "dependsOn": ["trans", "m", "n", "incy"],\n  "range": { "elementMin": -10.0, "elementMax": 10.0 },\n  "invalid": [\n    { "special": "null",      "error": "y must be a Float32Array or GpuVector", "label": "null" },\n    { "special": "undefined", "error": "y must be a Float32Array or GpuVector", "label": "undefined" },\n    { "special": "array",     "error": "y must be a Float32Array or GpuVector", "label": "plain Array []" },\n    { "special": "object",    "error": "y must be a Float32Array or GpuVector", "label": "plain object {}" },\n    { "special": "number",    "error": "y must be a Float32Array or GpuVector", "label": "number" },\n    { "scenario": "tooShort", "error": "y does not have enough elements", "label": "one element short for the active vector length" }\n  ],\n  "edge": [\n    { "scenario": "minimal", "label": "exactly the minimum valid length \u2014 must not throw" }\n  ]\n}\n',
};

// tests/browser/stand-ins/fs.mjs
function readFileSync(path) {
  const name = String(path).split(/[\\/]/).pop();
  if (Object.hasOwn(validation_params_default, name))
    return validation_params_default[name];
  throw new Error(`fs.readFileSync(${path}): not available in the browser`);
}

export { readFileSync };
