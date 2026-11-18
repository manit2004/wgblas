import { init_path, path_exports } from "./chunk-MPINAVL4.mjs";
import {
  Complex32,
  Complex32Array,
  interleaveComplex32,
} from "./chunk-3HAMCUKM.mjs";
import {
  __commonJS,
  __require,
  __toCommonJS,
  __toESM,
} from "./chunk-WQXBGQU4.mjs";

// node_modules/@stdlib/utils-define-property/lib/define_property.js
var require_define_property = __commonJS({
  "node_modules/@stdlib/utils-define-property/lib/define_property.js"(
    exports,
    module,
  ) {
    "use strict";
    var main =
      typeof Object.defineProperty === "function"
        ? Object.defineProperty
        : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-define-property/lib/has_define_property_support.js
var require_has_define_property_support = __commonJS({
  "node_modules/@stdlib/utils-define-property/lib/has_define_property_support.js"(
    exports,
    module,
  ) {
    "use strict";
    var defineProperty = require_define_property();
    function hasDefinePropertySupport() {
      try {
        defineProperty({}, "x", {});
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = hasDefinePropertySupport;
  },
});

// node_modules/@stdlib/utils-define-property/lib/builtin.js
var require_builtin = __commonJS({
  "node_modules/@stdlib/utils-define-property/lib/builtin.js"(exports, module) {
    "use strict";
    var defineProperty = Object.defineProperty;
    module.exports = defineProperty;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/is_number.js
var require_is_number = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/is_number.js"(
    exports,
    module,
  ) {
    "use strict";
    function isNumber(value) {
      return typeof value === "number";
    }
    module.exports = isNumber;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/zero_pad.js
var require_zero_pad = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/zero_pad.js"(
    exports,
    module,
  ) {
    "use strict";
    function startsWithMinus(str) {
      return str[0] === "-";
    }
    function zeros(n) {
      var out = "";
      var i;
      for (i = 0; i < n; i++) {
        out += "0";
      }
      return out;
    }
    function zeroPad(str, width, right) {
      var negative = false;
      var pad = width - str.length;
      if (pad < 0) {
        return str;
      }
      if (startsWithMinus(str)) {
        negative = true;
        str = str.substr(1);
      }
      str = right ? str + zeros(pad) : zeros(pad) + str;
      if (negative) {
        str = "-" + str;
      }
      return str;
    }
    module.exports = zeroPad;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/format_integer.js
var require_format_integer = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/format_integer.js"(
    exports,
    module,
  ) {
    "use strict";
    var isNumber = require_is_number();
    var zeroPad = require_zero_pad();
    var lowercase = String.prototype.toLowerCase;
    var uppercase = String.prototype.toUpperCase;
    function formatInteger(token) {
      var base;
      var out;
      var i;
      switch (token.specifier) {
        case "b":
          base = 2;
          break;
        case "o":
          base = 8;
          break;
        case "x":
        case "X":
          base = 16;
          break;
        case "d":
        case "i":
        case "u":
        default:
          base = 10;
          break;
      }
      out = token.arg;
      i = parseInt(out, 10);
      if (!isFinite(i)) {
        if (!isNumber(out)) {
          throw new Error("invalid integer. Value: " + out);
        }
        i = 0;
      }
      if (i < 0 && (token.specifier === "u" || base !== 10)) {
        i = 4294967295 + i + 1;
      }
      if (i < 0) {
        out = (-i).toString(base);
        if (token.precision) {
          out = zeroPad(out, token.precision, token.padRight);
        }
        out = "-" + out;
      } else {
        out = i.toString(base);
        if (!i && !token.precision) {
          out = "";
        } else if (token.precision) {
          out = zeroPad(out, token.precision, token.padRight);
        }
        if (token.sign) {
          out = token.sign + out;
        }
      }
      if (base === 16) {
        if (token.alternate) {
          out = "0x" + out;
        }
        out =
          token.specifier === uppercase.call(token.specifier)
            ? uppercase.call(out)
            : lowercase.call(out);
      }
      if (base === 8) {
        if (token.alternate && out.charAt(0) !== "0") {
          out = "0" + out;
        }
      }
      return out;
    }
    module.exports = formatInteger;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/is_string.js
var require_is_string = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/is_string.js"(
    exports,
    module,
  ) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/format_double.js
var require_format_double = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/format_double.js"(
    exports,
    module,
  ) {
    "use strict";
    var abs = Math.abs;
    var lowercase = String.prototype.toLowerCase;
    var uppercase = String.prototype.toUpperCase;
    var replace = String.prototype.replace;
    var RE_EXP_POS_DIGITS = /e\+(\d)$/;
    var RE_EXP_NEG_DIGITS = /e-(\d)$/;
    var RE_ONLY_DIGITS = /^(\d+)$/;
    var RE_DIGITS_BEFORE_EXP = /^(\d+)e/;
    var RE_TRAILING_PERIOD_ZERO = /\.0$/;
    var RE_PERIOD_ZERO_EXP = /\.0*e/;
    var RE_ZERO_BEFORE_EXP = /(\..*[^0])0*e/;
    function formatDouble(f, token) {
      var digits;
      var out;
      switch (token.specifier) {
        case "e":
        case "E":
          out = f.toExponential(token.precision);
          break;
        case "f":
        case "F":
          out = f.toFixed(token.precision);
          break;
        case "g":
        case "G":
          if (abs(f) < 1e-4) {
            digits = token.precision;
            if (digits > 0) {
              digits -= 1;
            }
            out = f.toExponential(digits);
          } else {
            out = f.toPrecision(token.precision);
          }
          if (!token.alternate) {
            out = replace.call(out, RE_ZERO_BEFORE_EXP, "$1e");
            out = replace.call(out, RE_PERIOD_ZERO_EXP, "e");
            out = replace.call(out, RE_TRAILING_PERIOD_ZERO, "");
          }
          break;
        default:
          throw new Error("invalid double notation. Value: " + token.specifier);
      }
      out = replace.call(out, RE_EXP_POS_DIGITS, "e+0$1");
      out = replace.call(out, RE_EXP_NEG_DIGITS, "e-0$1");
      if (token.alternate) {
        out = replace.call(out, RE_ONLY_DIGITS, "$1.");
        out = replace.call(out, RE_DIGITS_BEFORE_EXP, "$1.e");
      }
      if (f >= 0 && token.sign) {
        out = token.sign + out;
      }
      out =
        token.specifier === uppercase.call(token.specifier)
          ? uppercase.call(out)
          : lowercase.call(out);
      return out;
    }
    module.exports = formatDouble;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/space_pad.js
var require_space_pad = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/space_pad.js"(
    exports,
    module,
  ) {
    "use strict";
    function spaces(n) {
      var out = "";
      var i;
      for (i = 0; i < n; i++) {
        out += " ";
      }
      return out;
    }
    function spacePad(str, width, right) {
      var pad = width - str.length;
      if (pad < 0) {
        return str;
      }
      str = right ? str + spaces(pad) : spaces(pad) + str;
      return str;
    }
    module.exports = spacePad;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/main.js
var require_main = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var formatInteger = require_format_integer();
    var isString = require_is_string();
    var isNumber = require_is_number();
    var formatDouble = require_format_double();
    var spacePad = require_space_pad();
    var zeroPad = require_zero_pad();
    var fromCharCode = String.fromCharCode;
    var isArray = Array.isArray;
    function isnan(value) {
      return value !== value;
    }
    function initialize(token) {
      var out = {};
      out.specifier = token.specifier;
      out.precision = token.precision === void 0 ? 1 : token.precision;
      out.width = token.width;
      out.flags = token.flags || "";
      out.mapping = token.mapping;
      return out;
    }
    function formatInterpolate(tokens) {
      var hasPeriod;
      var flags;
      var token;
      var flag;
      var num;
      var out;
      var pos;
      var f;
      var i;
      var j;
      if (!isArray(tokens)) {
        throw new TypeError(
          "invalid argument. First argument must be an array. Value: `" +
            tokens +
            "`.",
        );
      }
      out = "";
      pos = 1;
      for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (isString(token)) {
          out += token;
        } else {
          hasPeriod = token.precision !== void 0;
          token = initialize(token);
          if (!token.specifier) {
            throw new TypeError(
              "invalid argument. Token is missing `specifier` property. Index: `" +
                i +
                "`. Value: `" +
                token +
                "`.",
            );
          }
          if (token.mapping) {
            pos = token.mapping;
          }
          flags = token.flags;
          for (j = 0; j < flags.length; j++) {
            flag = flags.charAt(j);
            switch (flag) {
              case " ":
                token.sign = " ";
                break;
              case "+":
                token.sign = "+";
                break;
              case "-":
                token.padRight = true;
                token.padZeros = false;
                break;
              case "0":
                token.padZeros = flags.indexOf("-") < 0;
                break;
              case "#":
                token.alternate = true;
                break;
              default:
                throw new Error("invalid flag: " + flag);
            }
          }
          if (token.width === "*") {
            token.width = parseInt(arguments[pos], 10);
            pos += 1;
            if (isnan(token.width)) {
              throw new TypeError(
                "the argument for * width at position " +
                  pos +
                  " is not a number. Value: `" +
                  token.width +
                  "`.",
              );
            }
            if (token.width < 0) {
              token.padRight = true;
              token.width = -token.width;
            }
          }
          if (hasPeriod) {
            if (token.precision === "*") {
              token.precision = parseInt(arguments[pos], 10);
              pos += 1;
              if (isnan(token.precision)) {
                throw new TypeError(
                  "the argument for * precision at position " +
                    pos +
                    " is not a number. Value: `" +
                    token.precision +
                    "`.",
                );
              }
              if (token.precision < 0) {
                token.precision = 1;
                hasPeriod = false;
              }
            }
          }
          token.arg = arguments[pos];
          switch (token.specifier) {
            case "b":
            case "o":
            case "x":
            case "X":
            case "d":
            case "i":
            case "u":
              if (hasPeriod) {
                token.padZeros = false;
              }
              token.arg = formatInteger(token);
              break;
            case "s":
              token.maxWidth = hasPeriod ? token.precision : -1;
              token.arg = String(token.arg);
              break;
            case "c":
              if (!isnan(token.arg)) {
                num = parseInt(token.arg, 10);
                if (num < 0 || num > 127) {
                  throw new Error(
                    "invalid character code. Value: " + token.arg,
                  );
                }
                token.arg = isnan(num) ? String(token.arg) : fromCharCode(num);
              }
              break;
            case "e":
            case "E":
            case "f":
            case "F":
            case "g":
            case "G":
              if (!hasPeriod) {
                token.precision = 6;
              }
              f = parseFloat(token.arg);
              if (!isFinite(f)) {
                if (!isNumber(token.arg)) {
                  throw new Error(
                    "invalid floating-point number. Value: " + out,
                  );
                }
                f = token.arg;
                token.padZeros = false;
              }
              token.arg = formatDouble(f, token);
              break;
            default:
              throw new Error("invalid specifier: " + token.specifier);
          }
          if (token.maxWidth >= 0 && token.arg.length > token.maxWidth) {
            token.arg = token.arg.substring(0, token.maxWidth);
          }
          if (token.padZeros) {
            token.arg = zeroPad(
              token.arg,
              token.width || token.precision,
              token.padRight,
            );
          } else if (token.width) {
            token.arg = spacePad(token.arg, token.width, token.padRight);
          }
          out += token.arg || "";
          pos += 1;
        }
      }
      return out;
    }
    module.exports = formatInterpolate;
  },
});

// node_modules/@stdlib/string-base-format-interpolate/lib/index.js
var require_lib = __commonJS({
  "node_modules/@stdlib/string-base-format-interpolate/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main();
    module.exports = main;
  },
});

// node_modules/@stdlib/string-base-format-tokenize/lib/main.js
var require_main2 = __commonJS({
  "node_modules/@stdlib/string-base-format-tokenize/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var RE =
      /%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;
    function parse(match) {
      var token = {
        mapping: match[1] ? parseInt(match[1], 10) : void 0,
        flags: match[2],
        width: match[3],
        precision: match[5],
        specifier: match[6],
      };
      if (match[4] === "." && match[5] === void 0) {
        token.precision = "1";
      }
      return token;
    }
    function formatTokenize(str) {
      var content;
      var tokens;
      var match;
      var prev;
      tokens = [];
      prev = 0;
      match = RE.exec(str);
      while (match) {
        content = str.slice(prev, RE.lastIndex - match[0].length);
        if (content.length) {
          tokens.push(content);
        }
        if (match[6] === "%") {
          tokens.push("%");
        } else {
          tokens.push(parse(match));
        }
        prev = RE.lastIndex;
        match = RE.exec(str);
      }
      content = str.slice(prev);
      if (content.length) {
        tokens.push(content);
      }
      return tokens;
    }
    module.exports = formatTokenize;
  },
});

// node_modules/@stdlib/string-base-format-tokenize/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@stdlib/string-base-format-tokenize/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main2();
    module.exports = main;
  },
});

// node_modules/@stdlib/string-format/lib/is_string.js
var require_is_string2 = __commonJS({
  "node_modules/@stdlib/string-format/lib/is_string.js"(exports, module) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  },
});

// node_modules/@stdlib/string-format/lib/main.js
var require_main3 = __commonJS({
  "node_modules/@stdlib/string-format/lib/main.js"(exports, module) {
    "use strict";
    var interpolate = require_lib();
    var tokenize = require_lib2();
    var isString = require_is_string2();
    function format(str) {
      var args;
      var i;
      if (!isString(str)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a string. Value: `%s`.",
            str,
          ),
        );
      }
      args = [tokenize(str)];
      for (i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return interpolate.apply(null, args);
    }
    module.exports = format;
  },
});

// node_modules/@stdlib/string-format/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@stdlib/string-format/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main3();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-define-property/lib/polyfill.js
var require_polyfill = __commonJS({
  "node_modules/@stdlib/utils-define-property/lib/polyfill.js"(
    exports,
    module,
  ) {
    "use strict";
    var format = require_lib3();
    var objectProtoype = Object.prototype;
    var toStr = objectProtoype.toString;
    var defineGetter = objectProtoype.__defineGetter__;
    var defineSetter = objectProtoype.__defineSetter__;
    var lookupGetter = objectProtoype.__lookupGetter__;
    var lookupSetter = objectProtoype.__lookupSetter__;
    function defineProperty(obj, prop, descriptor) {
      var prototype;
      var hasValue;
      var hasGet;
      var hasSet;
      if (
        typeof obj !== "object" ||
        obj === null ||
        toStr.call(obj) === "[object Array]"
      ) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be an object. Value: `%s`.",
            obj,
          ),
        );
      }
      if (
        typeof descriptor !== "object" ||
        descriptor === null ||
        toStr.call(descriptor) === "[object Array]"
      ) {
        throw new TypeError(
          format(
            "invalid argument. Property descriptor must be an object. Value: `%s`.",
            descriptor,
          ),
        );
      }
      hasValue = "value" in descriptor;
      if (hasValue) {
        if (lookupGetter.call(obj, prop) || lookupSetter.call(obj, prop)) {
          prototype = obj.__proto__;
          obj.__proto__ = objectProtoype;
          delete obj[prop];
          obj[prop] = descriptor.value;
          obj.__proto__ = prototype;
        } else {
          obj[prop] = descriptor.value;
        }
      }
      hasGet = "get" in descriptor;
      hasSet = "set" in descriptor;
      if (hasValue && (hasGet || hasSet)) {
        throw new Error(
          "invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.",
        );
      }
      if (hasGet && defineGetter) {
        defineGetter.call(obj, prop, descriptor.get);
      }
      if (hasSet && defineSetter) {
        defineSetter.call(obj, prop, descriptor.set);
      }
      return obj;
    }
    module.exports = defineProperty;
  },
});

// node_modules/@stdlib/utils-define-property/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/@stdlib/utils-define-property/lib/index.js"(exports, module) {
    "use strict";
    var hasDefinePropertySupport = require_has_define_property_support();
    var builtin = require_builtin();
    var polyfill = require_polyfill();
    var defineProperty;
    if (hasDefinePropertySupport()) {
      defineProperty = builtin;
    } else {
      defineProperty = polyfill;
    }
    module.exports = defineProperty;
  },
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/main.js
var require_main4 = __commonJS({
  "node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var defineProperty = require_lib4();
    function setNonEnumerableReadOnly(obj, prop, value) {
      defineProperty(obj, prop, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: value,
      });
    }
    module.exports = setNonEnumerableReadOnly;
  },
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/index.js
var require_lib5 = __commonJS({
  "node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main4();
    module.exports = main;
  },
});

// node_modules/@stdlib/strided-base-stride2offset/lib/main.js
var require_main5 = __commonJS({
  "node_modules/@stdlib/strided-base-stride2offset/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    function stride2offset(N, stride) {
      if (stride > 0) {
        return 0;
      }
      return (1 - N) * stride;
    }
    module.exports = stride2offset;
  },
});

// node_modules/@stdlib/strided-base-stride2offset/lib/index.js
var require_lib6 = __commonJS({
  "node_modules/@stdlib/strided-base-stride2offset/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var stride2offset = require_main5();
    module.exports = stride2offset;
  },
});

// node_modules/@stdlib/blas-base-sscal/lib/ndarray.js
var require_ndarray = __commonJS({
  "node_modules/@stdlib/blas-base-sscal/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 5;
    function sscal(N, alpha, x, stride, offset) {
      var ix;
      var m;
      var i;
      if (N <= 0 || alpha === 1) {
        return x;
      }
      ix = offset;
      if (stride === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            x[ix] *= alpha;
            ix += stride;
          }
        }
        if (N < M) {
          return x;
        }
        for (i = m; i < N; i += M) {
          x[ix] *= alpha;
          x[ix + 1] *= alpha;
          x[ix + 2] *= alpha;
          x[ix + 3] *= alpha;
          x[ix + 4] *= alpha;
          ix += M;
        }
        return x;
      }
      for (i = 0; i < N; i++) {
        x[ix] *= alpha;
        ix += stride;
      }
      return x;
    }
    module.exports = sscal;
  },
});

// node_modules/@stdlib/blas-base-sscal/lib/sscal.js
var require_sscal = __commonJS({
  "node_modules/@stdlib/blas-base-sscal/lib/sscal.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray();
    function sscal(N, alpha, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, alpha, x, stride, ox);
    }
    module.exports = sscal;
  },
});

// node_modules/@stdlib/blas-base-sscal/lib/main.js
var require_main6 = __commonJS({
  "node_modules/@stdlib/blas-base-sscal/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sscal = require_sscal();
    var ndarray = require_ndarray();
    setReadOnly(sscal, "ndarray", ndarray);
    module.exports = sscal;
  },
});

// node_modules/@stdlib/blas-base-sswap/lib/ndarray.js
var require_ndarray2 = __commonJS({
  "node_modules/@stdlib/blas-base-sswap/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 3;
    function sswap(N, x, strideX, offsetX, y, strideY, offsetY) {
      var tmp;
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            tmp = x[ix];
            x[ix] = y[iy];
            y[iy] = tmp;
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          tmp = x[ix];
          x[ix] = y[iy];
          y[iy] = tmp;
          tmp = x[ix + 1];
          x[ix + 1] = y[iy + 1];
          y[iy + 1] = tmp;
          tmp = x[ix + 2];
          x[ix + 2] = y[iy + 2];
          y[iy + 2] = tmp;
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        tmp = x[ix];
        x[ix] = y[iy];
        y[iy] = tmp;
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = sswap;
  },
});

// node_modules/@stdlib/blas-base-sswap/lib/sswap.js
var require_sswap = __commonJS({
  "node_modules/@stdlib/blas-base-sswap/lib/sswap.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray2();
    function sswap(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = sswap;
  },
});

// node_modules/@stdlib/blas-base-sswap/lib/main.js
var require_main7 = __commonJS({
  "node_modules/@stdlib/blas-base-sswap/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sswap = require_sswap();
    var ndarray = require_ndarray2();
    setReadOnly(sswap, "ndarray", ndarray);
    module.exports = sswap;
  },
});

// node_modules/@stdlib/blas-base-dswap/lib/ndarray.js
var require_ndarray3 = __commonJS({
  "node_modules/@stdlib/blas-base-dswap/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 3;
    function dswap(N, x, strideX, offsetX, y, strideY, offsetY) {
      var tmp;
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            tmp = x[ix];
            x[ix] = y[iy];
            y[iy] = tmp;
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          tmp = x[ix];
          x[ix] = y[iy];
          y[iy] = tmp;
          tmp = x[ix + 1];
          x[ix + 1] = y[iy + 1];
          y[iy + 1] = tmp;
          tmp = x[ix + 2];
          x[ix + 2] = y[iy + 2];
          y[iy + 2] = tmp;
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        tmp = x[ix];
        x[ix] = y[iy];
        y[iy] = tmp;
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = dswap;
  },
});

// node_modules/@stdlib/blas-base-dswap/lib/dswap.js
var require_dswap = __commonJS({
  "node_modules/@stdlib/blas-base-dswap/lib/dswap.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray3();
    function dswap(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = dswap;
  },
});

// node_modules/@stdlib/blas-base-dswap/lib/main.js
var require_main8 = __commonJS({
  "node_modules/@stdlib/blas-base-dswap/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dswap = require_dswap();
    var ndarray = require_ndarray3();
    setReadOnly(dswap, "ndarray", ndarray);
    module.exports = dswap;
  },
});

// node_modules/@stdlib/number-float64-base-to-float32/lib/main.js
var require_main9 = __commonJS({
  "node_modules/@stdlib/number-float64-base-to-float32/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var fround = typeof Math.fround === "function" ? Math.fround : null;
    module.exports = fround;
  },
});

// node_modules/@stdlib/assert-has-symbol-support/lib/main.js
var require_main10 = __commonJS({
  "node_modules/@stdlib/assert-has-symbol-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    function hasSymbolSupport() {
      return (
        typeof Symbol === "function" &&
        typeof (/* @__PURE__ */ Symbol("foo")) === "symbol"
      );
    }
    module.exports = hasSymbolSupport;
  },
});

// node_modules/@stdlib/assert-has-symbol-support/lib/index.js
var require_lib7 = __commonJS({
  "node_modules/@stdlib/assert-has-symbol-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main10();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-tostringtag-support/lib/main.js
var require_main11 = __commonJS({
  "node_modules/@stdlib/assert-has-tostringtag-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasSymbols = require_lib7();
    var FLG = hasSymbols();
    function hasToStringTagSupport() {
      return FLG && typeof Symbol.toStringTag === "symbol";
    }
    module.exports = hasToStringTagSupport;
  },
});

// node_modules/@stdlib/assert-has-tostringtag-support/lib/index.js
var require_lib8 = __commonJS({
  "node_modules/@stdlib/assert-has-tostringtag-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main11();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-native-class/lib/tostring.js
var require_tostring = __commonJS({
  "node_modules/@stdlib/utils-native-class/lib/tostring.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    module.exports = toStr;
  },
});

// node_modules/@stdlib/utils-native-class/lib/main.js
var require_main12 = __commonJS({
  "node_modules/@stdlib/utils-native-class/lib/main.js"(exports, module) {
    "use strict";
    var toStr = require_tostring();
    function nativeClass(v) {
      return toStr.call(v);
    }
    module.exports = nativeClass;
  },
});

// node_modules/@stdlib/assert-has-own-property/lib/main.js
var require_main13 = __commonJS({
  "node_modules/@stdlib/assert-has-own-property/lib/main.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    function hasOwnProp(value, property) {
      if (value === void 0 || value === null) {
        return false;
      }
      return has.call(value, property);
    }
    module.exports = hasOwnProp;
  },
});

// node_modules/@stdlib/assert-has-own-property/lib/index.js
var require_lib9 = __commonJS({
  "node_modules/@stdlib/assert-has-own-property/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main13();
    module.exports = main;
  },
});

// node_modules/@stdlib/symbol-ctor/lib/main.js
var require_main14 = __commonJS({
  "node_modules/@stdlib/symbol-ctor/lib/main.js"(exports, module) {
    "use strict";
    var Sym = typeof Symbol === "function" ? Symbol : void 0;
    module.exports = Sym;
  },
});

// node_modules/@stdlib/symbol-ctor/lib/index.js
var require_lib10 = __commonJS({
  "node_modules/@stdlib/symbol-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main14();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-native-class/lib/tostringtag.js
var require_tostringtag = __commonJS({
  "node_modules/@stdlib/utils-native-class/lib/tostringtag.js"(
    exports,
    module,
  ) {
    "use strict";
    var Symbol2 = require_lib10();
    var toStrTag = typeof Symbol2 === "function" ? Symbol2.toStringTag : "";
    module.exports = toStrTag;
  },
});

// node_modules/@stdlib/utils-native-class/lib/polyfill.js
var require_polyfill2 = __commonJS({
  "node_modules/@stdlib/utils-native-class/lib/polyfill.js"(exports, module) {
    "use strict";
    var hasOwnProp = require_lib9();
    var toStringTag = require_tostringtag();
    var toStr = require_tostring();
    function nativeClass(v) {
      var isOwn;
      var tag;
      var out;
      if (v === null || v === void 0) {
        return toStr.call(v);
      }
      tag = v[toStringTag];
      isOwn = hasOwnProp(v, toStringTag);
      try {
        v[toStringTag] = void 0;
      } catch (err) {
        return toStr.call(v);
      }
      out = toStr.call(v);
      if (isOwn) {
        v[toStringTag] = tag;
      } else {
        delete v[toStringTag];
      }
      return out;
    }
    module.exports = nativeClass;
  },
});

// node_modules/@stdlib/utils-native-class/lib/index.js
var require_lib11 = __commonJS({
  "node_modules/@stdlib/utils-native-class/lib/index.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib8();
    var builtin = require_main12();
    var polyfill = require_polyfill2();
    var main;
    if (hasToStringTag()) {
      main = polyfill;
    } else {
      main = builtin;
    }
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-float32array/lib/main.js
var require_main15 = __commonJS({
  "node_modules/@stdlib/assert-is-float32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasFloat32Array = typeof Float32Array === "function";
    function isFloat32Array(value) {
      return (
        (hasFloat32Array && value instanceof Float32Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Float32Array]"
      );
    }
    module.exports = isFloat32Array;
  },
});

// node_modules/@stdlib/assert-is-float32array/lib/index.js
var require_lib12 = __commonJS({
  "node_modules/@stdlib/assert-is-float32array/lib/index.js"(exports, module) {
    "use strict";
    var isFloat32Array = require_main15();
    module.exports = isFloat32Array;
  },
});

// node_modules/@stdlib/constants-float64-pinf/lib/index.js
var require_lib13 = __commonJS({
  "node_modules/@stdlib/constants-float64-pinf/lib/index.js"(exports, module) {
    "use strict";
    var FLOAT64_PINF = Number.POSITIVE_INFINITY;
    module.exports = FLOAT64_PINF;
  },
});

// node_modules/@stdlib/assert-has-float32array-support/lib/float32array.js
var require_float32array = __commonJS({
  "node_modules/@stdlib/assert-has-float32array-support/lib/float32array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Float32Array === "function" ? Float32Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-float32array-support/lib/main.js
var require_main16 = __commonJS({
  "node_modules/@stdlib/assert-has-float32array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isFloat32Array = require_lib12();
    var PINF = require_lib13();
    var GlobalFloat32Array = require_float32array();
    function hasFloat32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalFloat32Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalFloat32Array([1, 3.14, -3.14, 5e40]);
        bool =
          isFloat32Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3.140000104904175 &&
          arr[2] === -3.140000104904175 &&
          arr[3] === PINF;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasFloat32ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-float32array-support/lib/index.js
var require_lib14 = __commonJS({
  "node_modules/@stdlib/assert-has-float32array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasFloat32ArraySupport = require_main16();
    module.exports = hasFloat32ArraySupport;
  },
});

// node_modules/@stdlib/array-float32/lib/main.js
var require_main17 = __commonJS({
  "node_modules/@stdlib/array-float32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Float32Array === "function" ? Float32Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-float32/lib/polyfill.js
var require_polyfill3 = __commonJS({
  "node_modules/@stdlib/array-float32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-float32/lib/index.js
var require_lib15 = __commonJS({
  "node_modules/@stdlib/array-float32/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat32ArraySupport = require_lib14();
    var builtin = require_main17();
    var polyfill = require_polyfill3();
    var ctor;
    if (hasFloat32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/number-float64-base-to-float32/lib/polyfill.js
var require_polyfill4 = __commonJS({
  "node_modules/@stdlib/number-float64-base-to-float32/lib/polyfill.js"(
    exports,
    module,
  ) {
    "use strict";
    var Float32Array2 = require_lib15();
    var FLOAT32_VIEW = new Float32Array2(1);
    function float64ToFloat32(x) {
      FLOAT32_VIEW[0] = x;
      return FLOAT32_VIEW[0];
    }
    module.exports = float64ToFloat32;
  },
});

// node_modules/@stdlib/number-float64-base-to-float32/lib/index.js
var require_lib16 = __commonJS({
  "node_modules/@stdlib/number-float64-base-to-float32/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var builtin = require_main9();
    var polyfill = require_polyfill4();
    var float64ToFloat32;
    if (typeof builtin === "function") {
      float64ToFloat32 = builtin;
    } else {
      float64ToFloat32 = polyfill;
    }
    module.exports = float64ToFloat32;
  },
});

// node_modules/@stdlib/blas-base-saxpy/lib/ndarray.js
var require_ndarray4 = __commonJS({
  "node_modules/@stdlib/blas-base-saxpy/lib/ndarray.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    var M = 4;
    function saxpy(N, alpha, x, strideX, offsetX, y, strideY, offsetY) {
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0 || alpha === 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            y[iy] += f32(alpha * x[ix]);
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          y[iy] += f32(alpha * x[ix]);
          y[iy + 1] += f32(alpha * x[ix + 1]);
          y[iy + 2] += f32(alpha * x[ix + 2]);
          y[iy + 3] += f32(alpha * x[ix + 3]);
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        y[iy] += f32(alpha * x[ix]);
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = saxpy;
  },
});

// node_modules/@stdlib/blas-base-saxpy/lib/saxpy.js
var require_saxpy = __commonJS({
  "node_modules/@stdlib/blas-base-saxpy/lib/saxpy.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray4();
    function saxpy(N, alpha, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0 || alpha === 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, alpha, x, strideX, ix, y, strideY, iy);
    }
    module.exports = saxpy;
  },
});

// node_modules/@stdlib/blas-base-saxpy/lib/main.js
var require_main18 = __commonJS({
  "node_modules/@stdlib/blas-base-saxpy/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var saxpy = require_saxpy();
    var ndarray = require_ndarray4();
    setReadOnly(saxpy, "ndarray", ndarray);
    module.exports = saxpy;
  },
});

// node_modules/@stdlib/blas-base-scopy/lib/ndarray.js
var require_ndarray5 = __commonJS({
  "node_modules/@stdlib/blas-base-scopy/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 8;
    function scopy(N, x, strideX, offsetX, y, strideY, offsetY) {
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            y[iy] = x[ix];
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          y[iy] = x[ix];
          y[iy + 1] = x[ix + 1];
          y[iy + 2] = x[ix + 2];
          y[iy + 3] = x[ix + 3];
          y[iy + 4] = x[ix + 4];
          y[iy + 5] = x[ix + 5];
          y[iy + 6] = x[ix + 6];
          y[iy + 7] = x[ix + 7];
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        y[iy] = x[ix];
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = scopy;
  },
});

// node_modules/@stdlib/blas-base-scopy/lib/scopy.js
var require_scopy = __commonJS({
  "node_modules/@stdlib/blas-base-scopy/lib/scopy.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray5();
    function scopy(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = scopy;
  },
});

// node_modules/@stdlib/blas-base-scopy/lib/main.js
var require_main19 = __commonJS({
  "node_modules/@stdlib/blas-base-scopy/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var scopy = require_scopy();
    var ndarray = require_ndarray5();
    setReadOnly(scopy, "ndarray", ndarray);
    module.exports = scopy;
  },
});

// node_modules/@stdlib/blas-base-dcopy/lib/ndarray.js
var require_ndarray6 = __commonJS({
  "node_modules/@stdlib/blas-base-dcopy/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 8;
    function dcopy(N, x, strideX, offsetX, y, strideY, offsetY) {
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            y[iy] = x[ix];
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          y[iy] = x[ix];
          y[iy + 1] = x[ix + 1];
          y[iy + 2] = x[ix + 2];
          y[iy + 3] = x[ix + 3];
          y[iy + 4] = x[ix + 4];
          y[iy + 5] = x[ix + 5];
          y[iy + 6] = x[ix + 6];
          y[iy + 7] = x[ix + 7];
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        y[iy] = x[ix];
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = dcopy;
  },
});

// node_modules/@stdlib/blas-base-dcopy/lib/dcopy.js
var require_dcopy = __commonJS({
  "node_modules/@stdlib/blas-base-dcopy/lib/dcopy.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray6();
    function dcopy(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = dcopy;
  },
});

// node_modules/@stdlib/blas-base-dcopy/lib/main.js
var require_main20 = __commonJS({
  "node_modules/@stdlib/blas-base-dcopy/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dcopy = require_dcopy();
    var ndarray = require_ndarray6();
    setReadOnly(dcopy, "ndarray", ndarray);
    module.exports = dcopy;
  },
});

// node_modules/@stdlib/blas-base-sdot/lib/ndarray.js
var require_ndarray7 = __commonJS({
  "node_modules/@stdlib/blas-base-sdot/lib/ndarray.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    function sdot(N, x, strideX, offsetX, y, strideY, offsetY) {
      var dot;
      var ix;
      var iy;
      var i;
      dot = 0;
      if (N <= 0) {
        return dot;
      }
      ix = offsetX;
      iy = offsetY;
      for (i = 0; i < N; i++) {
        dot = f32(dot + f32(x[ix] * y[iy]));
        ix += strideX;
        iy += strideY;
      }
      return dot;
    }
    module.exports = sdot;
  },
});

// node_modules/@stdlib/blas-base-sdot/lib/sdot.js
var require_sdot = __commonJS({
  "node_modules/@stdlib/blas-base-sdot/lib/sdot.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray7();
    function sdot(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return 0;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = sdot;
  },
});

// node_modules/@stdlib/blas-base-sdot/lib/main.js
var require_main21 = __commonJS({
  "node_modules/@stdlib/blas-base-sdot/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sdot = require_sdot();
    var ndarray = require_ndarray7();
    setReadOnly(sdot, "ndarray", ndarray);
    module.exports = sdot;
  },
});

// node_modules/@stdlib/math-base-special-absf/lib/main.js
var require_main22 = __commonJS({
  "node_modules/@stdlib/math-base-special-absf/lib/main.js"(exports, module) {
    "use strict";
    function absf(x) {
      return Math.abs(x);
    }
    module.exports = absf;
  },
});

// node_modules/@stdlib/math-base-special-absf/lib/index.js
var require_lib17 = __commonJS({
  "node_modules/@stdlib/math-base-special-absf/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main22();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-sasum/lib/ndarray.js
var require_ndarray8 = __commonJS({
  "node_modules/@stdlib/blas-base-sasum/lib/ndarray.js"(exports, module) {
    "use strict";
    var absf = require_lib17();
    var f32 = require_lib16();
    function sasum(N, x, stride, offset) {
      var sum;
      var ix;
      var i;
      sum = 0;
      if (N <= 0) {
        return sum;
      }
      ix = offset;
      for (i = 0; i < N; i++) {
        sum = f32(sum + absf(x[ix]));
        ix += stride;
      }
      return sum;
    }
    module.exports = sasum;
  },
});

// node_modules/@stdlib/blas-base-sasum/lib/sasum.js
var require_sasum = __commonJS({
  "node_modules/@stdlib/blas-base-sasum/lib/sasum.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray8();
    function sasum(N, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, x, stride, ox);
    }
    module.exports = sasum;
  },
});

// node_modules/@stdlib/blas-base-sasum/lib/main.js
var require_main23 = __commonJS({
  "node_modules/@stdlib/blas-base-sasum/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sasum = require_sasum();
    var ndarray = require_ndarray8();
    setReadOnly(sasum, "ndarray", ndarray);
    module.exports = sasum;
  },
});

// node_modules/@stdlib/math-base-special-abs/lib/main.js
var require_main24 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs/lib/main.js"(exports, module) {
    "use strict";
    function abs(x) {
      return Math.abs(x);
    }
    module.exports = abs;
  },
});

// node_modules/@stdlib/math-base-special-abs/lib/index.js
var require_lib18 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main24();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-dasum/lib/ndarray.js
var require_ndarray9 = __commonJS({
  "node_modules/@stdlib/blas-base-dasum/lib/ndarray.js"(exports, module) {
    "use strict";
    var abs = require_lib18();
    function dasum(N, x, stride, offset) {
      var sum;
      var ix;
      var i;
      sum = 0;
      if (N <= 0) {
        return sum;
      }
      ix = offset;
      for (i = 0; i < N; i++) {
        sum += abs(x[ix]);
        ix += stride;
      }
      return sum;
    }
    module.exports = dasum;
  },
});

// node_modules/@stdlib/blas-base-dasum/lib/dasum.js
var require_dasum = __commonJS({
  "node_modules/@stdlib/blas-base-dasum/lib/dasum.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray9();
    function dasum(N, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, x, stride, ox);
    }
    module.exports = dasum;
  },
});

// node_modules/@stdlib/blas-base-dasum/lib/main.js
var require_main25 = __commonJS({
  "node_modules/@stdlib/blas-base-dasum/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dasum = require_dasum();
    var ndarray = require_ndarray9();
    setReadOnly(dasum, "ndarray", ndarray);
    module.exports = dasum;
  },
});

// node_modules/@stdlib/blas-base-ddot/lib/ndarray.js
var require_ndarray10 = __commonJS({
  "node_modules/@stdlib/blas-base-ddot/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 5;
    function ddot(N, x, strideX, offsetX, y, strideY, offsetY) {
      var dot;
      var ix;
      var iy;
      var m;
      var i;
      dot = 0;
      if (N <= 0) {
        return dot;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            dot += x[ix] * y[iy];
            ix += 1;
            iy += 1;
          }
        }
        if (N < M) {
          return dot;
        }
        for (i = m; i < N; i += M) {
          dot +=
            x[ix] * y[iy] +
            x[ix + 1] * y[iy + 1] +
            x[ix + 2] * y[iy + 2] +
            x[ix + 3] * y[iy + 3] +
            x[ix + 4] * y[iy + 4];
          ix += M;
          iy += M;
        }
        return dot;
      }
      for (i = 0; i < N; i++) {
        dot += x[ix] * y[iy];
        ix += strideX;
        iy += strideY;
      }
      return dot;
    }
    module.exports = ddot;
  },
});

// node_modules/@stdlib/blas-base-ddot/lib/ddot.js
var require_ddot = __commonJS({
  "node_modules/@stdlib/blas-base-ddot/lib/ddot.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray10();
    function ddot(N, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0) {
        return 0;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy);
    }
    module.exports = ddot;
  },
});

// node_modules/@stdlib/blas-base-ddot/lib/main.js
var require_main26 = __commonJS({
  "node_modules/@stdlib/blas-base-ddot/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var ddot = require_ddot();
    var ndarray = require_ndarray10();
    setReadOnly(ddot, "ndarray", ndarray);
    module.exports = ddot;
  },
});

// node_modules/@stdlib/constants-float32-max/lib/index.js
var require_lib19 = __commonJS({
  "node_modules/@stdlib/constants-float32-max/lib/index.js"(exports, module) {
    "use strict";
    var FLOAT32_MAX = 34028234663852886e22;
    module.exports = FLOAT32_MAX;
  },
});

// node_modules/@stdlib/math-base-special-abs2f/lib/main.js
var require_main27 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs2f/lib/main.js"(exports, module) {
    "use strict";
    var float64ToFloat32 = require_lib16();
    function abs2f(x) {
      return float64ToFloat32(float64ToFloat32(x) * float64ToFloat32(x));
    }
    module.exports = abs2f;
  },
});

// node_modules/@stdlib/math-base-special-abs2f/lib/index.js
var require_lib20 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs2f/lib/index.js"(exports, module) {
    "use strict";
    var abs2f = require_main27();
    module.exports = abs2f;
  },
});

// node_modules/@stdlib/math-base-special-sqrt/lib/main.js
var require_main28 = __commonJS({
  "node_modules/@stdlib/math-base-special-sqrt/lib/main.js"(exports, module) {
    "use strict";
    var sqrt = Math.sqrt;
    module.exports = sqrt;
  },
});

// node_modules/@stdlib/math-base-special-sqrt/lib/index.js
var require_lib21 = __commonJS({
  "node_modules/@stdlib/math-base-special-sqrt/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main28();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-special-sqrtf/lib/main.js
var require_main29 = __commonJS({
  "node_modules/@stdlib/math-base-special-sqrtf/lib/main.js"(exports, module) {
    "use strict";
    var float64ToFloat32 = require_lib16();
    var sqrt = require_lib21();
    function sqrtf(x) {
      return float64ToFloat32(sqrt(float64ToFloat32(x)));
    }
    module.exports = sqrtf;
  },
});

// node_modules/@stdlib/math-base-special-sqrtf/lib/index.js
var require_lib22 = __commonJS({
  "node_modules/@stdlib/math-base-special-sqrtf/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main29();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-snrm2/lib/ndarray.js
var require_ndarray11 = __commonJS({
  "node_modules/@stdlib/blas-base-snrm2/lib/ndarray.js"(exports, module) {
    "use strict";
    var FLOAT32_MAX = require_lib19();
    var f32 = require_lib16();
    var absf = require_lib17();
    var abs2f = require_lib20();
    var sqrtf = require_lib22();
    var tsml = 108420217e-27;
    var tbig = 450359963e7;
    var ssml = 377789319e14;
    var sbig = 132348898e-31;
    function snrm2(N, x, stride, offset) {
      var notbig;
      var sumsq;
      var abig;
      var amed;
      var asml;
      var ymax;
      var ymin;
      var scl;
      var ax;
      var ix;
      var i;
      if (N <= 0) {
        return 0;
      }
      ix = offset;
      notbig = true;
      sumsq = 0;
      abig = 0;
      amed = 0;
      asml = 0;
      scl = 1;
      for (i = 0; i < N; i++) {
        ax = absf(x[ix]);
        if (ax > tbig) {
          abig = f32(abig + abs2f(ax * sbig));
          notbig = false;
        } else if (ax < tsml) {
          if (notbig) {
            asml = f32(asml + abs2f(ax * ssml));
          }
        } else {
          amed = f32(amed + f32(ax * ax));
        }
        ix += stride;
      }
      if (abig > 0) {
        if (amed > 0 || amed > FLOAT32_MAX || amed !== amed) {
          abig = f32(abig + f32(f32(amed * sbig) * sbig));
        }
        scl = f32(1 / sbig);
        sumsq = abig;
      } else if (asml > 0) {
        if (amed > 0 || amed > FLOAT32_MAX || amed !== amed) {
          amed = sqrtf(amed);
          asml = f32(sqrtf(asml) / ssml);
          if (asml > amed) {
            ymin = amed;
            ymax = asml;
          } else {
            ymin = asml;
            ymax = amed;
          }
          scl = 1;
          sumsq = f32(f32(ymax * ymax) * f32(1 + abs2f(ymin / ymax)));
        } else {
          scl = f32(1 / ssml);
          sumsq = asml;
        }
      } else {
        scl = 1;
        sumsq = amed;
      }
      return f32(sqrtf(sumsq) * scl);
    }
    module.exports = snrm2;
  },
});

// node_modules/@stdlib/blas-base-snrm2/lib/snrm2.js
var require_snrm2 = __commonJS({
  "node_modules/@stdlib/blas-base-snrm2/lib/snrm2.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray11();
    function snrm2(N, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, x, stride, ox);
    }
    module.exports = snrm2;
  },
});

// node_modules/@stdlib/blas-base-snrm2/lib/main.js
var require_main30 = __commonJS({
  "node_modules/@stdlib/blas-base-snrm2/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var snrm2 = require_snrm2();
    var ndarray = require_ndarray11();
    setReadOnly(snrm2, "ndarray", ndarray);
    module.exports = snrm2;
  },
});

// node_modules/@stdlib/constants-float64-max/lib/index.js
var require_lib23 = __commonJS({
  "node_modules/@stdlib/constants-float64-max/lib/index.js"(exports, module) {
    "use strict";
    var FLOAT64_MAX = 17976931348623157e292;
    module.exports = FLOAT64_MAX;
  },
});

// node_modules/@stdlib/math-base-special-abs2/lib/main.js
var require_main31 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs2/lib/main.js"(exports, module) {
    "use strict";
    function abs2(x) {
      return x * x;
    }
    module.exports = abs2;
  },
});

// node_modules/@stdlib/math-base-special-abs2/lib/index.js
var require_lib24 = __commonJS({
  "node_modules/@stdlib/math-base-special-abs2/lib/index.js"(exports, module) {
    "use strict";
    var abs2 = require_main31();
    module.exports = abs2;
  },
});

// node_modules/@stdlib/blas-base-dnrm2/lib/ndarray.js
var require_ndarray12 = __commonJS({
  "node_modules/@stdlib/blas-base-dnrm2/lib/ndarray.js"(exports, module) {
    "use strict";
    var FLOAT64_MAX = require_lib23();
    var abs = require_lib18();
    var abs2 = require_lib24();
    var sqrt = require_lib21();
    var tsml = 14916681462400413e-170;
    var tbig = 1997919072202235e131;
    var ssml = 44989137945431964e145;
    var sbig = 11113793747425387e-178;
    function dnrm2(N, x, stride, offset) {
      var notbig;
      var sumsq;
      var abig;
      var amed;
      var asml;
      var ymax;
      var ymin;
      var scl;
      var ax;
      var ix;
      var i;
      if (N <= 0) {
        return 0;
      }
      ix = offset;
      notbig = true;
      sumsq = 0;
      abig = 0;
      amed = 0;
      asml = 0;
      scl = 1;
      for (i = 0; i < N; i++) {
        ax = abs(x[ix]);
        if (ax > tbig) {
          abig += abs2(ax * sbig);
          notbig = false;
        } else if (ax < tsml) {
          if (notbig) {
            asml += abs2(ax * ssml);
          }
        } else {
          amed += ax * ax;
        }
        ix += stride;
      }
      if (abig > 0) {
        if (amed > 0 || amed > FLOAT64_MAX || amed !== amed) {
          abig += amed * sbig * sbig;
        }
        scl = 1 / sbig;
        sumsq = abig;
      } else if (asml > 0) {
        if (amed > 0 || amed > FLOAT64_MAX || amed !== amed) {
          amed = sqrt(amed);
          asml = sqrt(asml) / ssml;
          if (asml > amed) {
            ymin = amed;
            ymax = asml;
          } else {
            ymin = asml;
            ymax = amed;
          }
          scl = 1;
          sumsq = ymax * ymax * (1 + abs2(ymin / ymax));
        } else {
          scl = 1 / ssml;
          sumsq = asml;
        }
      } else {
        scl = 1;
        sumsq = amed;
      }
      return sqrt(sumsq) * scl;
    }
    module.exports = dnrm2;
  },
});

// node_modules/@stdlib/blas-base-dnrm2/lib/dnrm2.js
var require_dnrm2 = __commonJS({
  "node_modules/@stdlib/blas-base-dnrm2/lib/dnrm2.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray12();
    function dnrm2(N, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, x, stride, ox);
    }
    module.exports = dnrm2;
  },
});

// node_modules/@stdlib/blas-base-dnrm2/lib/main.js
var require_main32 = __commonJS({
  "node_modules/@stdlib/blas-base-dnrm2/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dnrm2 = require_dnrm2();
    var ndarray = require_ndarray12();
    setReadOnly(dnrm2, "ndarray", ndarray);
    module.exports = dnrm2;
  },
});

// node_modules/@stdlib/blas-base-isamax/lib/ndarray.js
var require_ndarray13 = __commonJS({
  "node_modules/@stdlib/blas-base-isamax/lib/ndarray.js"(exports, module) {
    "use strict";
    var absf = require_lib17();
    function isamax(N, x, strideX, offsetX) {
      var smax;
      var idx;
      var ix;
      var v;
      var i;
      if (N < 1) {
        return -1;
      }
      idx = 0;
      if (N === 1) {
        return idx;
      }
      smax = absf(x[offsetX]);
      ix = offsetX + strideX;
      for (i = 1; i < N; i++) {
        v = absf(x[ix]);
        if (v > smax) {
          idx = i;
          smax = v;
        }
        ix += strideX;
      }
      return idx;
    }
    module.exports = isamax;
  },
});

// node_modules/@stdlib/blas-base-isamax/lib/isamax.js
var require_isamax = __commonJS({
  "node_modules/@stdlib/blas-base-isamax/lib/isamax.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray13();
    function isamax(N, x, strideX) {
      var ox = stride2offset(N, strideX);
      return ndarray(N, x, strideX, ox);
    }
    module.exports = isamax;
  },
});

// node_modules/@stdlib/blas-base-isamax/lib/main.js
var require_main33 = __commonJS({
  "node_modules/@stdlib/blas-base-isamax/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var isamax = require_isamax();
    var ndarray = require_ndarray13();
    setReadOnly(isamax, "ndarray", ndarray);
    module.exports = isamax;
  },
});

// node_modules/@stdlib/blas-base-idamax/lib/ndarray.js
var require_ndarray14 = __commonJS({
  "node_modules/@stdlib/blas-base-idamax/lib/ndarray.js"(exports, module) {
    "use strict";
    var abs = require_lib18();
    function idamax(N, x, strideX, offsetX) {
      var dmax;
      var idx;
      var ix;
      var v;
      var i;
      if (N < 1) {
        return -1;
      }
      idx = 0;
      if (N === 1) {
        return idx;
      }
      dmax = abs(x[offsetX]);
      ix = offsetX + strideX;
      for (i = 1; i < N; i++) {
        v = abs(x[ix]);
        if (v > dmax) {
          idx = i;
          dmax = v;
        }
        ix += strideX;
      }
      return idx;
    }
    module.exports = idamax;
  },
});

// node_modules/@stdlib/blas-base-idamax/lib/idamax.js
var require_idamax = __commonJS({
  "node_modules/@stdlib/blas-base-idamax/lib/idamax.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray14();
    function idamax(N, x, strideX) {
      var ox = stride2offset(N, strideX);
      return ndarray(N, x, strideX, ox);
    }
    module.exports = idamax;
  },
});

// node_modules/@stdlib/blas-base-idamax/lib/main.js
var require_main34 = __commonJS({
  "node_modules/@stdlib/blas-base-idamax/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var idamax = require_idamax();
    var ndarray = require_ndarray14();
    setReadOnly(idamax, "ndarray", ndarray);
    module.exports = idamax;
  },
});

// node_modules/@stdlib/blas-base-srot/lib/ndarray.js
var require_ndarray15 = __commonJS({
  "node_modules/@stdlib/blas-base-srot/lib/ndarray.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    function srot(N, x, strideX, offsetX, y, strideY, offsetY, c, s) {
      var tmp;
      var ix;
      var iy;
      var i;
      if (N <= 0) {
        return y;
      }
      c = f32(c);
      s = f32(s);
      ix = offsetX;
      iy = offsetY;
      for (i = 0; i < N; i++) {
        tmp = f32(c * x[ix]) + f32(s * y[iy]);
        y[iy] = f32(c * y[iy]) - f32(s * x[ix]);
        x[ix] = tmp;
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = srot;
  },
});

// node_modules/@stdlib/blas-base-srot/lib/srot.js
var require_srot = __commonJS({
  "node_modules/@stdlib/blas-base-srot/lib/srot.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray15();
    function srot(N, x, strideX, y, strideY, c, s) {
      var ix = stride2offset(N, strideX);
      var iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy, c, s);
    }
    module.exports = srot;
  },
});

// node_modules/@stdlib/blas-base-srot/lib/main.js
var require_main35 = __commonJS({
  "node_modules/@stdlib/blas-base-srot/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var srot = require_srot();
    var ndarray = require_ndarray15();
    setReadOnly(srot, "ndarray", ndarray);
    module.exports = srot;
  },
});

// node_modules/@stdlib/blas-base-drot/lib/ndarray.js
var require_ndarray16 = __commonJS({
  "node_modules/@stdlib/blas-base-drot/lib/ndarray.js"(exports, module) {
    "use strict";
    function drot(N, x, strideX, offsetX, y, strideY, offsetY, c, s) {
      var tmp;
      var ix;
      var iy;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      for (i = 0; i < N; i++) {
        tmp = c * x[ix] + s * y[iy];
        y[iy] = c * y[iy] - s * x[ix];
        x[ix] = tmp;
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = drot;
  },
});

// node_modules/@stdlib/blas-base-drot/lib/drot.js
var require_drot = __commonJS({
  "node_modules/@stdlib/blas-base-drot/lib/drot.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray16();
    function drot(N, x, strideX, y, strideY, c, s) {
      var ix;
      var iy;
      if (N <= 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy, c, s);
    }
    module.exports = drot;
  },
});

// node_modules/@stdlib/blas-base-drot/lib/main.js
var require_main36 = __commonJS({
  "node_modules/@stdlib/blas-base-drot/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var drot = require_drot();
    var ndarray = require_ndarray16();
    setReadOnly(drot, "ndarray", ndarray);
    module.exports = drot;
  },
});

// node_modules/@stdlib/blas-base-srotm/lib/ndarray.js
var require_ndarray17 = __commonJS({
  "node_modules/@stdlib/blas-base-srotm/lib/ndarray.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    function srotm(N, x, strideX, offsetX, y, strideY, offsetY, param) {
      var sflag;
      var sh11;
      var sh12;
      var sh21;
      var sh22;
      var ix;
      var iy;
      var i;
      var w;
      var z;
      sflag = param[0];
      if (N <= 0 || sflag === -2) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === strideY && strideX > 0) {
        if (sflag < 0) {
          sh11 = param[1];
          sh12 = param[3];
          sh21 = param[2];
          sh22 = param[4];
          for (i = 0; i < N; i++) {
            w = x[ix];
            z = y[ix];
            x[ix] = f32(f32(w * sh11) + f32(z * sh12));
            y[ix] = f32(f32(w * sh21) + f32(z * sh22));
            ix += strideX;
          }
          return y;
        }
        if (sflag === 0) {
          sh12 = param[3];
          sh21 = param[2];
          for (i = 0; i < N; i++) {
            w = x[ix];
            z = y[ix];
            x[ix] = f32(w + f32(z * sh12));
            y[ix] = f32(f32(w * sh21) + z);
            ix += strideX;
          }
          return y;
        }
        sh11 = param[1];
        sh22 = param[4];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[ix];
          x[ix] = f32(f32(w * sh11) + z);
          y[ix] = f32(-w + f32(z * sh22));
          ix += strideX;
        }
        return y;
      }
      if (sflag < 0) {
        sh11 = param[1];
        sh12 = param[3];
        sh21 = param[2];
        sh22 = param[4];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[iy];
          x[ix] = f32(f32(w * sh11) + f32(z * sh12));
          y[iy] = f32(f32(w * sh21) + f32(z * sh22));
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      if (sflag === 0) {
        sh12 = param[3];
        sh21 = param[2];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[iy];
          x[ix] = f32(w + f32(z * sh12));
          y[iy] = f32(f32(w * sh21) + z);
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      sh11 = param[1];
      sh22 = param[4];
      for (i = 0; i < N; i++) {
        w = x[ix];
        z = y[iy];
        x[ix] = f32(f32(w * sh11) + z);
        y[iy] = f32(-w + f32(z * sh22));
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = srotm;
  },
});

// node_modules/@stdlib/blas-base-srotm/lib/srotm.js
var require_srotm = __commonJS({
  "node_modules/@stdlib/blas-base-srotm/lib/srotm.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray17();
    function srotm(N, x, strideX, y, strideY, param) {
      var ix = stride2offset(N, strideX);
      var iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy, param);
    }
    module.exports = srotm;
  },
});

// node_modules/@stdlib/blas-base-srotm/lib/main.js
var require_main37 = __commonJS({
  "node_modules/@stdlib/blas-base-srotm/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var srotm = require_srotm();
    var ndarray = require_ndarray17();
    setReadOnly(srotm, "ndarray", ndarray);
    module.exports = srotm;
  },
});

// node_modules/@stdlib/blas-base-drotm/lib/ndarray.js
var require_ndarray18 = __commonJS({
  "node_modules/@stdlib/blas-base-drotm/lib/ndarray.js"(exports, module) {
    "use strict";
    function drotm(N, x, strideX, offsetX, y, strideY, offsetY, param) {
      var dflag;
      var dh11;
      var dh12;
      var dh21;
      var dh22;
      var ix;
      var iy;
      var i;
      var w;
      var z;
      dflag = param[0];
      if (N <= 0 || dflag === -2) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === strideY && strideX > 0) {
        if (dflag < 0) {
          dh11 = param[1];
          dh12 = param[3];
          dh21 = param[2];
          dh22 = param[4];
          for (i = 0; i < N; i++) {
            w = x[ix];
            z = y[ix];
            x[ix] = w * dh11 + z * dh12;
            y[ix] = w * dh21 + z * dh22;
            ix += strideX;
          }
          return y;
        }
        if (dflag === 0) {
          dh12 = param[3];
          dh21 = param[2];
          for (i = 0; i < N; i++) {
            w = x[ix];
            z = y[ix];
            x[ix] = w + z * dh12;
            y[ix] = w * dh21 + z;
            ix += strideX;
          }
          return y;
        }
        dh11 = param[1];
        dh22 = param[4];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[ix];
          x[ix] = w * dh11 + z;
          y[ix] = -w + z * dh22;
          ix += strideX;
        }
        return y;
      }
      if (dflag < 0) {
        dh11 = param[1];
        dh12 = param[3];
        dh21 = param[2];
        dh22 = param[4];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[iy];
          x[ix] = w * dh11 + z * dh12;
          y[iy] = w * dh21 + z * dh22;
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      if (dflag === 0) {
        dh12 = param[3];
        dh21 = param[2];
        for (i = 0; i < N; i++) {
          w = x[ix];
          z = y[iy];
          x[ix] = w + z * dh12;
          y[iy] = w * dh21 + z;
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      dh11 = param[1];
      dh22 = param[4];
      for (i = 0; i < N; i++) {
        w = x[ix];
        z = y[iy];
        x[ix] = w * dh11 + z;
        y[iy] = -w + z * dh22;
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = drotm;
  },
});

// node_modules/@stdlib/blas-base-drotm/lib/drotm.js
var require_drotm = __commonJS({
  "node_modules/@stdlib/blas-base-drotm/lib/drotm.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray18();
    function drotm(N, x, strideX, y, strideY, param) {
      var ix = stride2offset(N, strideX);
      var iy = stride2offset(N, strideY);
      return ndarray(N, x, strideX, ix, y, strideY, iy, param);
    }
    module.exports = drotm;
  },
});

// node_modules/@stdlib/blas-base-drotm/lib/main.js
var require_main38 = __commonJS({
  "node_modules/@stdlib/blas-base-drotm/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var drotm = require_drotm();
    var ndarray = require_ndarray18();
    setReadOnly(drotm, "ndarray", ndarray);
    module.exports = drotm;
  },
});

// node_modules/@stdlib/array-base-assert-is-accessor-array/lib/main.js
var require_main39 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-accessor-array/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var TYPE = "function";
    function isAccessorArray(value) {
      return typeof value.get === TYPE && typeof value.set === TYPE;
    }
    module.exports = isAccessorArray;
  },
});

// node_modules/@stdlib/array-base-assert-is-accessor-array/lib/index.js
var require_lib25 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-accessor-array/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main39();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-base-accessor-getter/lib/main.js
var require_main40 = __commonJS({
  "node_modules/@stdlib/array-base-accessor-getter/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var GETTERS = {
      complex128: getComplex128,
      complex64: getComplex64,
      default: getArrayLike,
    };
    function getComplex128(arr, idx) {
      return arr.get(idx);
    }
    function getComplex64(arr, idx) {
      return arr.get(idx);
    }
    function getArrayLike(arr, idx) {
      return arr.get(idx);
    }
    function getter(dtype) {
      var f = GETTERS[dtype];
      if (typeof f === "function") {
        return f;
      }
      return GETTERS.default;
    }
    module.exports = getter;
  },
});

// node_modules/@stdlib/array-base-accessor-getter/lib/index.js
var require_lib26 = __commonJS({
  "node_modules/@stdlib/array-base-accessor-getter/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main40();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-base-getter/lib/main.js
var require_main41 = __commonJS({
  "node_modules/@stdlib/array-base-getter/lib/main.js"(exports, module) {
    "use strict";
    var GETTERS = {
      float64: getFloat64,
      float32: getFloat32,
      int32: getInt32,
      int16: getInt16,
      int8: getInt8,
      uint32: getUint32,
      uint16: getUint16,
      uint8: getUint8,
      uint8c: getUint8c,
      generic: getGeneric,
      default: getArrayLike,
    };
    function getFloat64(arr, idx) {
      return arr[idx];
    }
    function getFloat32(arr, idx) {
      return arr[idx];
    }
    function getInt32(arr, idx) {
      return arr[idx];
    }
    function getInt16(arr, idx) {
      return arr[idx];
    }
    function getInt8(arr, idx) {
      return arr[idx];
    }
    function getUint32(arr, idx) {
      return arr[idx];
    }
    function getUint16(arr, idx) {
      return arr[idx];
    }
    function getUint8(arr, idx) {
      return arr[idx];
    }
    function getUint8c(arr, idx) {
      return arr[idx];
    }
    function getGeneric(arr, idx) {
      return arr[idx];
    }
    function getArrayLike(arr, idx) {
      return arr[idx];
    }
    function getter(dtype) {
      var f = GETTERS[dtype];
      if (typeof f === "function") {
        return f;
      }
      return GETTERS.default;
    }
    module.exports = getter;
  },
});

// node_modules/@stdlib/array-base-getter/lib/index.js
var require_lib27 = __commonJS({
  "node_modules/@stdlib/array-base-getter/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main41();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-array/lib/main.js
var require_main42 = __commonJS({
  "node_modules/@stdlib/assert-is-array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var f;
    function isArray(value) {
      return nativeClass(value) === "[object Array]";
    }
    if (Array.isArray) {
      f = Array.isArray;
    } else {
      f = isArray;
    }
    module.exports = f;
  },
});

// node_modules/@stdlib/assert-is-array/lib/index.js
var require_lib28 = __commonJS({
  "node_modules/@stdlib/assert-is-array/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main42();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-tools-array-function/lib/main.js
var require_main43 = __commonJS({
  "node_modules/@stdlib/assert-tools-array-function/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isArray = require_lib28();
    var format = require_lib3();
    function arrayfcn(predicate) {
      if (typeof predicate !== "function") {
        throw new TypeError(
          format(
            "invalid argument. Must provide a function. Value: `%s`.",
            predicate,
          ),
        );
      }
      return every;
      function every(value) {
        var len;
        var i;
        if (!isArray(value)) {
          return false;
        }
        len = value.length;
        if (len === 0) {
          return false;
        }
        for (i = 0; i < len; i++) {
          if (predicate(value[i]) === false) {
            return false;
          }
        }
        return true;
      }
    }
    module.exports = arrayfcn;
  },
});

// node_modules/@stdlib/assert-tools-array-function/lib/index.js
var require_lib29 = __commonJS({
  "node_modules/@stdlib/assert-tools-array-function/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main43();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-object-like/lib/main.js
var require_main44 = __commonJS({
  "node_modules/@stdlib/assert-is-object-like/lib/main.js"(exports, module) {
    "use strict";
    function isObjectLike(value) {
      return value !== null && typeof value === "object";
    }
    module.exports = isObjectLike;
  },
});

// node_modules/@stdlib/assert-is-object-like/lib/index.js
var require_lib30 = __commonJS({
  "node_modules/@stdlib/assert-is-object-like/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var arrayfun = require_lib29();
    var main = require_main44();
    var isObjectLikeArray = arrayfun(main);
    setReadOnly(main, "isObjectLikeArray", isObjectLikeArray);
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-buffer/lib/main.js
var require_main45 = __commonJS({
  "node_modules/@stdlib/assert-is-buffer/lib/main.js"(exports, module) {
    "use strict";
    var isObjectLike = require_lib30();
    function isBuffer(value) {
      return (
        isObjectLike(value) && // eslint-disable-next-line no-underscore-dangle
        (value._isBuffer || // for envs missing Object.prototype.constructor (e.g., Safari 5-7)
          (value.constructor && // WARNING: `typeof` is not a foolproof check, as certain envs consider RegExp and NodeList instances to be functions
            typeof value.constructor.isBuffer === "function" &&
            value.constructor.isBuffer(value)))
      );
    }
    module.exports = isBuffer;
  },
});

// node_modules/@stdlib/assert-is-buffer/lib/index.js
var require_lib31 = __commonJS({
  "node_modules/@stdlib/assert-is-buffer/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main45();
    module.exports = main;
  },
});

// node_modules/@stdlib/regexp-function-name/lib/main.js
var require_main46 = __commonJS({
  "node_modules/@stdlib/regexp-function-name/lib/main.js"(exports, module) {
    "use strict";
    function reFunctionName() {
      return /^\s*function\s*([^(]*)/i;
    }
    module.exports = reFunctionName;
  },
});

// node_modules/@stdlib/regexp-function-name/lib/regexp.js
var require_regexp = __commonJS({
  "node_modules/@stdlib/regexp-function-name/lib/regexp.js"(exports, module) {
    "use strict";
    var reFunctionName = require_main46();
    var RE_FUNCTION_NAME = reFunctionName();
    module.exports = RE_FUNCTION_NAME;
  },
});

// node_modules/@stdlib/regexp-function-name/lib/index.js
var require_lib32 = __commonJS({
  "node_modules/@stdlib/regexp-function-name/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main46();
    var REGEXP = require_regexp();
    setReadOnly(main, "REGEXP", REGEXP);
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-constructor-name/lib/main.js
var require_main47 = __commonJS({
  "node_modules/@stdlib/utils-constructor-name/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var RE = require_lib32().REGEXP;
    var isBuffer = require_lib31();
    function constructorName(v) {
      var match;
      var name;
      var ctor;
      name = nativeClass(v).slice(8, -1);
      if ((name === "Object" || name === "Error") && v.constructor) {
        ctor = v.constructor;
        if (typeof ctor.name === "string") {
          return ctor.name;
        }
        match = RE.exec(ctor.toString());
        if (match) {
          return match[1];
        }
      }
      if (isBuffer(v)) {
        return "Buffer";
      }
      return name;
    }
    module.exports = constructorName;
  },
});

// node_modules/@stdlib/utils-constructor-name/lib/index.js
var require_lib33 = __commonJS({
  "node_modules/@stdlib/utils-constructor-name/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main47();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-dtype/lib/ctor2dtype.js
var require_ctor2dtype = __commonJS({
  "node_modules/@stdlib/array-dtype/lib/ctor2dtype.js"(exports, module) {
    "use strict";
    var ctor2dtypes = {
      Float32Array: "float32",
      Float64Array: "float64",
      Array: "generic",
      Int16Array: "int16",
      Int32Array: "int32",
      Int8Array: "int8",
      Uint16Array: "uint16",
      Uint32Array: "uint32",
      Uint8Array: "uint8",
      Uint8ClampedArray: "uint8c",
      Complex64Array: "complex64",
      Complex128Array: "complex128",
      BooleanArray: "bool",
    };
    module.exports = ctor2dtypes;
  },
});

// node_modules/@stdlib/assert-is-float64array/lib/main.js
var require_main48 = __commonJS({
  "node_modules/@stdlib/assert-is-float64array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasFloat64Array = typeof Float64Array === "function";
    function isFloat64Array(value) {
      return (
        (hasFloat64Array && value instanceof Float64Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Float64Array]"
      );
    }
    module.exports = isFloat64Array;
  },
});

// node_modules/@stdlib/assert-is-float64array/lib/index.js
var require_lib34 = __commonJS({
  "node_modules/@stdlib/assert-is-float64array/lib/index.js"(exports, module) {
    "use strict";
    var isFloat64Array = require_main48();
    module.exports = isFloat64Array;
  },
});

// node_modules/@stdlib/assert-has-float64array-support/lib/float64array.js
var require_float64array = __commonJS({
  "node_modules/@stdlib/assert-has-float64array-support/lib/float64array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Float64Array === "function" ? Float64Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-float64array-support/lib/main.js
var require_main49 = __commonJS({
  "node_modules/@stdlib/assert-has-float64array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isFloat64Array = require_lib34();
    var GlobalFloat64Array = require_float64array();
    function hasFloat64ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalFloat64Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalFloat64Array([1, 3.14, -3.14, NaN]);
        bool =
          isFloat64Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3.14 &&
          arr[2] === -3.14 &&
          arr[3] !== arr[3];
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasFloat64ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-float64array-support/lib/index.js
var require_lib35 = __commonJS({
  "node_modules/@stdlib/assert-has-float64array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasFloat64ArraySupport = require_main49();
    module.exports = hasFloat64ArraySupport;
  },
});

// node_modules/@stdlib/array-float64/lib/main.js
var require_main50 = __commonJS({
  "node_modules/@stdlib/array-float64/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Float64Array === "function" ? Float64Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-float64/lib/polyfill.js
var require_polyfill5 = __commonJS({
  "node_modules/@stdlib/array-float64/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-float64/lib/index.js
var require_lib36 = __commonJS({
  "node_modules/@stdlib/array-float64/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat64ArraySupport = require_lib35();
    var builtin = require_main50();
    var polyfill = require_polyfill5();
    var ctor;
    if (hasFloat64ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-uint32array/lib/main.js
var require_main51 = __commonJS({
  "node_modules/@stdlib/assert-is-uint32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasUint32Array = typeof Uint32Array === "function";
    function isUint32Array(value) {
      return (
        (hasUint32Array && value instanceof Uint32Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Uint32Array]"
      );
    }
    module.exports = isUint32Array;
  },
});

// node_modules/@stdlib/assert-is-uint32array/lib/index.js
var require_lib37 = __commonJS({
  "node_modules/@stdlib/assert-is-uint32array/lib/index.js"(exports, module) {
    "use strict";
    var isUint32Array = require_main51();
    module.exports = isUint32Array;
  },
});

// node_modules/@stdlib/constants-uint32-max/lib/index.js
var require_lib38 = __commonJS({
  "node_modules/@stdlib/constants-uint32-max/lib/index.js"(exports, module) {
    "use strict";
    var UINT32_MAX = 4294967295;
    module.exports = UINT32_MAX;
  },
});

// node_modules/@stdlib/assert-has-uint32array-support/lib/uint32array.js
var require_uint32array = __commonJS({
  "node_modules/@stdlib/assert-has-uint32array-support/lib/uint32array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Uint32Array === "function" ? Uint32Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-uint32array-support/lib/main.js
var require_main52 = __commonJS({
  "node_modules/@stdlib/assert-has-uint32array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isUint32Array = require_lib37();
    var UINT32_MAX = require_lib38();
    var GlobalUint32Array = require_uint32array();
    function hasUint32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint32Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT32_MAX + 1, UINT32_MAX + 2];
        arr = new GlobalUint32Array(arr);
        bool =
          isUint32Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === UINT32_MAX - 2 && // truncation and wrap around
          arr[3] === 0 && // wrap around
          arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint32ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-uint32array-support/lib/index.js
var require_lib39 = __commonJS({
  "node_modules/@stdlib/assert-has-uint32array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasUint32ArraySupport = require_main52();
    module.exports = hasUint32ArraySupport;
  },
});

// node_modules/@stdlib/array-uint32/lib/main.js
var require_main53 = __commonJS({
  "node_modules/@stdlib/array-uint32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint32Array === "function" ? Uint32Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-uint32/lib/polyfill.js
var require_polyfill6 = __commonJS({
  "node_modules/@stdlib/array-uint32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-uint32/lib/index.js
var require_lib40 = __commonJS({
  "node_modules/@stdlib/array-uint32/lib/index.js"(exports, module) {
    "use strict";
    var hasUint32ArraySupport = require_lib39();
    var builtin = require_main53();
    var polyfill = require_polyfill6();
    var ctor;
    if (hasUint32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-int32array/lib/main.js
var require_main54 = __commonJS({
  "node_modules/@stdlib/assert-is-int32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasInt32Array = typeof Int32Array === "function";
    function isInt32Array(value) {
      return (
        (hasInt32Array && value instanceof Int32Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Int32Array]"
      );
    }
    module.exports = isInt32Array;
  },
});

// node_modules/@stdlib/assert-is-int32array/lib/index.js
var require_lib41 = __commonJS({
  "node_modules/@stdlib/assert-is-int32array/lib/index.js"(exports, module) {
    "use strict";
    var isInt32Array = require_main54();
    module.exports = isInt32Array;
  },
});

// node_modules/@stdlib/constants-int32-max/lib/index.js
var require_lib42 = __commonJS({
  "node_modules/@stdlib/constants-int32-max/lib/index.js"(exports, module) {
    "use strict";
    var INT32_MAX = 2147483647 | 0;
    module.exports = INT32_MAX;
  },
});

// node_modules/@stdlib/constants-int32-min/lib/index.js
var require_lib43 = __commonJS({
  "node_modules/@stdlib/constants-int32-min/lib/index.js"(exports, module) {
    "use strict";
    var INT32_MIN = -2147483648 | 0;
    module.exports = INT32_MIN;
  },
});

// node_modules/@stdlib/assert-has-int32array-support/lib/int32array.js
var require_int32array = __commonJS({
  "node_modules/@stdlib/assert-has-int32array-support/lib/int32array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Int32Array === "function" ? Int32Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-int32array-support/lib/main.js
var require_main55 = __commonJS({
  "node_modules/@stdlib/assert-has-int32array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInt32Array = require_lib41();
    var INT32_MAX = require_lib42();
    var INT32_MIN = require_lib43();
    var GlobalInt32Array = require_int32array();
    function hasInt32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt32Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt32Array([1, 3.14, -3.14, INT32_MAX + 1]);
        bool =
          isInt32Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === -3 && // truncation
          arr[3] === INT32_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt32ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-int32array-support/lib/index.js
var require_lib44 = __commonJS({
  "node_modules/@stdlib/assert-has-int32array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasInt32ArraySupport = require_main55();
    module.exports = hasInt32ArraySupport;
  },
});

// node_modules/@stdlib/array-int32/lib/main.js
var require_main56 = __commonJS({
  "node_modules/@stdlib/array-int32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int32Array === "function" ? Int32Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-int32/lib/polyfill.js
var require_polyfill7 = __commonJS({
  "node_modules/@stdlib/array-int32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-int32/lib/index.js
var require_lib45 = __commonJS({
  "node_modules/@stdlib/array-int32/lib/index.js"(exports, module) {
    "use strict";
    var hasInt32ArraySupport = require_lib44();
    var builtin = require_main56();
    var polyfill = require_polyfill7();
    var ctor;
    if (hasInt32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-uint16array/lib/main.js
var require_main57 = __commonJS({
  "node_modules/@stdlib/assert-is-uint16array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasUint16Array = typeof Uint16Array === "function";
    function isUint16Array(value) {
      return (
        (hasUint16Array && value instanceof Uint16Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Uint16Array]"
      );
    }
    module.exports = isUint16Array;
  },
});

// node_modules/@stdlib/assert-is-uint16array/lib/index.js
var require_lib46 = __commonJS({
  "node_modules/@stdlib/assert-is-uint16array/lib/index.js"(exports, module) {
    "use strict";
    var isUint16Array = require_main57();
    module.exports = isUint16Array;
  },
});

// node_modules/@stdlib/constants-uint16-max/lib/index.js
var require_lib47 = __commonJS({
  "node_modules/@stdlib/constants-uint16-max/lib/index.js"(exports, module) {
    "use strict";
    var UINT16_MAX = 65535 | 0;
    module.exports = UINT16_MAX;
  },
});

// node_modules/@stdlib/assert-has-uint16array-support/lib/uint16array.js
var require_uint16array = __commonJS({
  "node_modules/@stdlib/assert-has-uint16array-support/lib/uint16array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Uint16Array === "function" ? Uint16Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-uint16array-support/lib/main.js
var require_main58 = __commonJS({
  "node_modules/@stdlib/assert-has-uint16array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isUint16Array = require_lib46();
    var UINT16_MAX = require_lib47();
    var GlobalUint16Array = require_uint16array();
    function hasUint16ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint16Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT16_MAX + 1, UINT16_MAX + 2];
        arr = new GlobalUint16Array(arr);
        bool =
          isUint16Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === UINT16_MAX - 2 && // truncation and wrap around
          arr[3] === 0 && // wrap around
          arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint16ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-uint16array-support/lib/index.js
var require_lib48 = __commonJS({
  "node_modules/@stdlib/assert-has-uint16array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasUint16ArraySupport = require_main58();
    module.exports = hasUint16ArraySupport;
  },
});

// node_modules/@stdlib/array-uint16/lib/main.js
var require_main59 = __commonJS({
  "node_modules/@stdlib/array-uint16/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint16Array === "function" ? Uint16Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-uint16/lib/polyfill.js
var require_polyfill8 = __commonJS({
  "node_modules/@stdlib/array-uint16/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-uint16/lib/index.js
var require_lib49 = __commonJS({
  "node_modules/@stdlib/array-uint16/lib/index.js"(exports, module) {
    "use strict";
    var hasUint16ArraySupport = require_lib48();
    var builtin = require_main59();
    var polyfill = require_polyfill8();
    var ctor;
    if (hasUint16ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-int16array/lib/main.js
var require_main60 = __commonJS({
  "node_modules/@stdlib/assert-is-int16array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasInt16Array = typeof Int16Array === "function";
    function isInt16Array(value) {
      return (
        (hasInt16Array && value instanceof Int16Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Int16Array]"
      );
    }
    module.exports = isInt16Array;
  },
});

// node_modules/@stdlib/assert-is-int16array/lib/index.js
var require_lib50 = __commonJS({
  "node_modules/@stdlib/assert-is-int16array/lib/index.js"(exports, module) {
    "use strict";
    var isInt16Array = require_main60();
    module.exports = isInt16Array;
  },
});

// node_modules/@stdlib/constants-int16-max/lib/index.js
var require_lib51 = __commonJS({
  "node_modules/@stdlib/constants-int16-max/lib/index.js"(exports, module) {
    "use strict";
    var INT16_MAX = 32767 | 0;
    module.exports = INT16_MAX;
  },
});

// node_modules/@stdlib/constants-int16-min/lib/index.js
var require_lib52 = __commonJS({
  "node_modules/@stdlib/constants-int16-min/lib/index.js"(exports, module) {
    "use strict";
    var INT16_MIN = -32768 | 0;
    module.exports = INT16_MIN;
  },
});

// node_modules/@stdlib/assert-has-int16array-support/lib/int16array.js
var require_int16array = __commonJS({
  "node_modules/@stdlib/assert-has-int16array-support/lib/int16array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Int16Array === "function" ? Int16Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-int16array-support/lib/main.js
var require_main61 = __commonJS({
  "node_modules/@stdlib/assert-has-int16array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInt16Array = require_lib50();
    var INT16_MAX = require_lib51();
    var INT16_MIN = require_lib52();
    var GlobalInt16Array = require_int16array();
    function hasInt16ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt16Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt16Array([1, 3.14, -3.14, INT16_MAX + 1]);
        bool =
          isInt16Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === -3 && // truncation
          arr[3] === INT16_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt16ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-int16array-support/lib/index.js
var require_lib53 = __commonJS({
  "node_modules/@stdlib/assert-has-int16array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasInt16ArraySupport = require_main61();
    module.exports = hasInt16ArraySupport;
  },
});

// node_modules/@stdlib/array-int16/lib/main.js
var require_main62 = __commonJS({
  "node_modules/@stdlib/array-int16/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int16Array === "function" ? Int16Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-int16/lib/polyfill.js
var require_polyfill9 = __commonJS({
  "node_modules/@stdlib/array-int16/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-int16/lib/index.js
var require_lib54 = __commonJS({
  "node_modules/@stdlib/array-int16/lib/index.js"(exports, module) {
    "use strict";
    var hasInt16ArraySupport = require_lib53();
    var builtin = require_main62();
    var polyfill = require_polyfill9();
    var ctor;
    if (hasInt16ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-uint8array/lib/main.js
var require_main63 = __commonJS({
  "node_modules/@stdlib/assert-is-uint8array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasUint8Array = typeof Uint8Array === "function";
    function isUint8Array(value) {
      return (
        (hasUint8Array && value instanceof Uint8Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Uint8Array]"
      );
    }
    module.exports = isUint8Array;
  },
});

// node_modules/@stdlib/assert-is-uint8array/lib/index.js
var require_lib55 = __commonJS({
  "node_modules/@stdlib/assert-is-uint8array/lib/index.js"(exports, module) {
    "use strict";
    var isUint8Array = require_main63();
    module.exports = isUint8Array;
  },
});

// node_modules/@stdlib/constants-uint8-max/lib/index.js
var require_lib56 = __commonJS({
  "node_modules/@stdlib/constants-uint8-max/lib/index.js"(exports, module) {
    "use strict";
    var UINT8_MAX = 255 | 0;
    module.exports = UINT8_MAX;
  },
});

// node_modules/@stdlib/assert-has-uint8array-support/lib/uint8array.js
var require_uint8array = __commonJS({
  "node_modules/@stdlib/assert-has-uint8array-support/lib/uint8array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Uint8Array === "function" ? Uint8Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-uint8array-support/lib/main.js
var require_main64 = __commonJS({
  "node_modules/@stdlib/assert-has-uint8array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isUint8Array = require_lib55();
    var UINT8_MAX = require_lib56();
    var GlobalUint8Array = require_uint8array();
    function hasUint8ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint8Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT8_MAX + 1, UINT8_MAX + 2];
        arr = new GlobalUint8Array(arr);
        bool =
          isUint8Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === UINT8_MAX - 2 && // truncation and wrap around
          arr[3] === 0 && // wrap around
          arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint8ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-uint8array-support/lib/index.js
var require_lib57 = __commonJS({
  "node_modules/@stdlib/assert-has-uint8array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasUint8ArraySupport = require_main64();
    module.exports = hasUint8ArraySupport;
  },
});

// node_modules/@stdlib/array-uint8/lib/main.js
var require_main65 = __commonJS({
  "node_modules/@stdlib/array-uint8/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint8Array === "function" ? Uint8Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-uint8/lib/polyfill.js
var require_polyfill10 = __commonJS({
  "node_modules/@stdlib/array-uint8/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-uint8/lib/index.js
var require_lib58 = __commonJS({
  "node_modules/@stdlib/array-uint8/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ArraySupport = require_lib57();
    var builtin = require_main65();
    var polyfill = require_polyfill10();
    var ctor;
    if (hasUint8ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-uint8clampedarray/lib/main.js
var require_main66 = __commonJS({
  "node_modules/@stdlib/assert-is-uint8clampedarray/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var nativeClass = require_lib11();
    var hasUint8ClampedArray = typeof Uint8ClampedArray === "function";
    function isUint8ClampedArray(value) {
      return (
        (hasUint8ClampedArray && value instanceof Uint8ClampedArray) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Uint8ClampedArray]"
      );
    }
    module.exports = isUint8ClampedArray;
  },
});

// node_modules/@stdlib/assert-is-uint8clampedarray/lib/index.js
var require_lib59 = __commonJS({
  "node_modules/@stdlib/assert-is-uint8clampedarray/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var isUint8ClampedArray = require_main66();
    module.exports = isUint8ClampedArray;
  },
});

// node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/uint8clampedarray.js
var require_uint8clampedarray = __commonJS({
  "node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/uint8clampedarray.js"(
    exports,
    module,
  ) {
    "use strict";
    var main =
      typeof Uint8ClampedArray === "function" ? Uint8ClampedArray : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/main.js
var require_main67 = __commonJS({
  "node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isUint8ClampedArray = require_lib59();
    var GlobalUint8ClampedArray = require_uint8clampedarray();
    function hasUint8ClampedArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint8ClampedArray !== "function") {
        return false;
      }
      try {
        arr = new GlobalUint8ClampedArray([-1, 0, 1, 3.14, 4.99, 255, 256]);
        bool =
          isUint8ClampedArray(arr) &&
          arr[0] === 0 && // clamped
          arr[1] === 0 &&
          arr[2] === 1 &&
          arr[3] === 3 && // round to nearest
          arr[4] === 5 && // round to nearest
          arr[5] === 255 &&
          arr[6] === 255;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint8ClampedArraySupport;
  },
});

// node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/index.js
var require_lib60 = __commonJS({
  "node_modules/@stdlib/assert-has-uint8clampedarray-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasUint8ClampedArraySupport = require_main67();
    module.exports = hasUint8ClampedArraySupport;
  },
});

// node_modules/@stdlib/array-uint8c/lib/main.js
var require_main68 = __commonJS({
  "node_modules/@stdlib/array-uint8c/lib/main.js"(exports, module) {
    "use strict";
    var ctor =
      typeof Uint8ClampedArray === "function" ? Uint8ClampedArray : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-uint8c/lib/polyfill.js
var require_polyfill11 = __commonJS({
  "node_modules/@stdlib/array-uint8c/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-uint8c/lib/index.js
var require_lib61 = __commonJS({
  "node_modules/@stdlib/array-uint8c/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ClampedArraySupport = require_lib60();
    var builtin = require_main68();
    var polyfill = require_polyfill11();
    var ctor;
    if (hasUint8ClampedArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-int8array/lib/main.js
var require_main69 = __commonJS({
  "node_modules/@stdlib/assert-is-int8array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasInt8Array = typeof Int8Array === "function";
    function isInt8Array(value) {
      return (
        (hasInt8Array && value instanceof Int8Array) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object Int8Array]"
      );
    }
    module.exports = isInt8Array;
  },
});

// node_modules/@stdlib/assert-is-int8array/lib/index.js
var require_lib62 = __commonJS({
  "node_modules/@stdlib/assert-is-int8array/lib/index.js"(exports, module) {
    "use strict";
    var isInt8Array = require_main69();
    module.exports = isInt8Array;
  },
});

// node_modules/@stdlib/constants-int8-max/lib/index.js
var require_lib63 = __commonJS({
  "node_modules/@stdlib/constants-int8-max/lib/index.js"(exports, module) {
    "use strict";
    var INT8_MAX = 127 | 0;
    module.exports = INT8_MAX;
  },
});

// node_modules/@stdlib/constants-int8-min/lib/index.js
var require_lib64 = __commonJS({
  "node_modules/@stdlib/constants-int8-min/lib/index.js"(exports, module) {
    "use strict";
    var INT8_MIN = -128 | 0;
    module.exports = INT8_MIN;
  },
});

// node_modules/@stdlib/assert-has-int8array-support/lib/int8array.js
var require_int8array = __commonJS({
  "node_modules/@stdlib/assert-has-int8array-support/lib/int8array.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = typeof Int8Array === "function" ? Int8Array : null;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-int8array-support/lib/main.js
var require_main70 = __commonJS({
  "node_modules/@stdlib/assert-has-int8array-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInt8Array = require_lib62();
    var INT8_MAX = require_lib63();
    var INT8_MIN = require_lib64();
    var GlobalInt8Array = require_int8array();
    function hasInt8ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt8Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt8Array([1, 3.14, -3.14, INT8_MAX + 1]);
        bool =
          isInt8Array(arr) &&
          arr[0] === 1 &&
          arr[1] === 3 && // truncation
          arr[2] === -3 && // truncation
          arr[3] === INT8_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt8ArraySupport;
  },
});

// node_modules/@stdlib/assert-has-int8array-support/lib/index.js
var require_lib65 = __commonJS({
  "node_modules/@stdlib/assert-has-int8array-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasInt8ArraySupport = require_main70();
    module.exports = hasInt8ArraySupport;
  },
});

// node_modules/@stdlib/array-int8/lib/main.js
var require_main71 = __commonJS({
  "node_modules/@stdlib/array-int8/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int8Array === "function" ? Int8Array : void 0;
    module.exports = ctor;
  },
});

// node_modules/@stdlib/array-int8/lib/polyfill.js
var require_polyfill12 = __commonJS({
  "node_modules/@stdlib/array-int8/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  },
});

// node_modules/@stdlib/array-int8/lib/index.js
var require_lib66 = __commonJS({
  "node_modules/@stdlib/array-int8/lib/index.js"(exports, module) {
    "use strict";
    var hasInt8ArraySupport = require_lib65();
    var builtin = require_main71();
    var polyfill = require_polyfill12();
    var ctor;
    if (hasInt8ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  },
});

// node_modules/@stdlib/assert-is-number/lib/primitive.js
var require_primitive = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/primitive.js"(exports, module) {
    "use strict";
    function isNumber(value) {
      return typeof value === "number";
    }
    module.exports = isNumber;
  },
});

// node_modules/@stdlib/number-ctor/lib/main.js
var require_main72 = __commonJS({
  "node_modules/@stdlib/number-ctor/lib/main.js"(exports, module) {
    "use strict";
    module.exports = Number;
  },
});

// node_modules/@stdlib/number-ctor/lib/index.js
var require_lib67 = __commonJS({
  "node_modules/@stdlib/number-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main72();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-number/lib/tostring.js
var require_tostring2 = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/tostring.js"(exports, module) {
    "use strict";
    var Number2 = require_lib67();
    var toString = Number2.prototype.toString;
    module.exports = toString;
  },
});

// node_modules/@stdlib/assert-is-number/lib/try2serialize.js
var require_try2serialize = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/try2serialize.js"(
    exports,
    module,
  ) {
    "use strict";
    var toString = require_tostring2();
    function test(value) {
      try {
        toString.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  },
});

// node_modules/@stdlib/assert-is-number/lib/object.js
var require_object = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib8();
    var nativeClass = require_lib11();
    var Number2 = require_lib67();
    var test = require_try2serialize();
    var FLG = hasToStringTag();
    function isNumber(value) {
      if (typeof value === "object") {
        if (value instanceof Number2) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object Number]";
      }
      return false;
    }
    module.exports = isNumber;
  },
});

// node_modules/@stdlib/assert-is-number/lib/main.js
var require_main73 = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive();
    var isObject = require_object();
    function isNumber(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isNumber;
  },
});

// node_modules/@stdlib/assert-is-number/lib/index.js
var require_lib68 = __commonJS({
  "node_modules/@stdlib/assert-is-number/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main73();
    var isPrimitive = require_primitive();
    var isObject = require_object();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/constants-float64-ninf/lib/index.js
var require_lib69 = __commonJS({
  "node_modules/@stdlib/constants-float64-ninf/lib/index.js"(exports, module) {
    "use strict";
    var Number2 = require_lib67();
    var FLOAT64_NINF = Number2.NEGATIVE_INFINITY;
    module.exports = FLOAT64_NINF;
  },
});

// node_modules/@stdlib/math-base-special-floor/lib/main.js
var require_main74 = __commonJS({
  "node_modules/@stdlib/math-base-special-floor/lib/main.js"(exports, module) {
    "use strict";
    var floor = Math.floor;
    module.exports = floor;
  },
});

// node_modules/@stdlib/math-base-special-floor/lib/index.js
var require_lib70 = __commonJS({
  "node_modules/@stdlib/math-base-special-floor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main74();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-assert-is-integer/lib/main.js
var require_main75 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-integer/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var floor = require_lib70();
    function isInteger(x) {
      return floor(x) === x;
    }
    module.exports = isInteger;
  },
});

// node_modules/@stdlib/math-base-assert-is-integer/lib/index.js
var require_lib71 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-integer/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main75();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-integer/lib/integer.js
var require_integer = __commonJS({
  "node_modules/@stdlib/assert-is-integer/lib/integer.js"(exports, module) {
    "use strict";
    var PINF = require_lib13();
    var NINF = require_lib69();
    var isInt = require_lib71();
    function isInteger(value) {
      return value < PINF && value > NINF && isInt(value);
    }
    module.exports = isInteger;
  },
});

// node_modules/@stdlib/assert-is-integer/lib/primitive.js
var require_primitive2 = __commonJS({
  "node_modules/@stdlib/assert-is-integer/lib/primitive.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isPrimitive;
    var isInt = require_integer();
    function isInteger(value) {
      return isNumber(value) && isInt(value);
    }
    module.exports = isInteger;
  },
});

// node_modules/@stdlib/assert-is-integer/lib/object.js
var require_object2 = __commonJS({
  "node_modules/@stdlib/assert-is-integer/lib/object.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isObject;
    var isInt = require_integer();
    function isInteger(value) {
      return isNumber(value) && isInt(value.valueOf());
    }
    module.exports = isInteger;
  },
});

// node_modules/@stdlib/assert-is-integer/lib/main.js
var require_main76 = __commonJS({
  "node_modules/@stdlib/assert-is-integer/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive2();
    var isObject = require_object2();
    function isInteger(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isInteger;
  },
});

// node_modules/@stdlib/assert-is-integer/lib/index.js
var require_lib72 = __commonJS({
  "node_modules/@stdlib/assert-is-integer/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main76();
    var isPrimitive = require_primitive2();
    var isObject = require_object2();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-nonnegative-integer/lib/primitive.js
var require_primitive3 = __commonJS({
  "node_modules/@stdlib/assert-is-nonnegative-integer/lib/primitive.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInteger = require_lib72().isPrimitive;
    function isNonNegativeInteger(value) {
      return isInteger(value) && value >= 0;
    }
    module.exports = isNonNegativeInteger;
  },
});

// node_modules/@stdlib/assert-is-nonnegative-integer/lib/object.js
var require_object3 = __commonJS({
  "node_modules/@stdlib/assert-is-nonnegative-integer/lib/object.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInteger = require_lib72().isObject;
    function isNonNegativeInteger(value) {
      return isInteger(value) && value.valueOf() >= 0;
    }
    module.exports = isNonNegativeInteger;
  },
});

// node_modules/@stdlib/assert-is-nonnegative-integer/lib/main.js
var require_main77 = __commonJS({
  "node_modules/@stdlib/assert-is-nonnegative-integer/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isPrimitive = require_primitive3();
    var isObject = require_object3();
    function isNonNegativeInteger(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isNonNegativeInteger;
  },
});

// node_modules/@stdlib/assert-is-nonnegative-integer/lib/index.js
var require_lib73 = __commonJS({
  "node_modules/@stdlib/assert-is-nonnegative-integer/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main77();
    var isPrimitive = require_primitive3();
    var isObject = require_object3();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/constants-array-max-array-length/lib/index.js
var require_lib74 = __commonJS({
  "node_modules/@stdlib/constants-array-max-array-length/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var MAX_ARRAY_LENGTH = 4294967295 >>> 0;
    module.exports = MAX_ARRAY_LENGTH;
  },
});

// node_modules/@stdlib/assert-is-array-like-object/lib/main.js
var require_main78 = __commonJS({
  "node_modules/@stdlib/assert-is-array-like-object/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInteger = require_lib71();
    var MAX_LENGTH = require_lib74();
    function isArrayLikeObject(value) {
      return (
        typeof value === "object" &&
        value !== null &&
        typeof value.length === "number" &&
        isInteger(value.length) &&
        value.length >= 0 &&
        value.length <= MAX_LENGTH
      );
    }
    module.exports = isArrayLikeObject;
  },
});

// node_modules/@stdlib/assert-is-array-like-object/lib/index.js
var require_lib75 = __commonJS({
  "node_modules/@stdlib/assert-is-array-like-object/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main78();
    module.exports = main;
  },
});

// node_modules/@stdlib/constants-array-max-typed-array-length/lib/index.js
var require_lib76 = __commonJS({
  "node_modules/@stdlib/constants-array-max-typed-array-length/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var MAX_TYPED_ARRAY_LENGTH = 9007199254740991;
    module.exports = MAX_TYPED_ARRAY_LENGTH;
  },
});

// node_modules/@stdlib/assert-is-collection/lib/main.js
var require_main79 = __commonJS({
  "node_modules/@stdlib/assert-is-collection/lib/main.js"(exports, module) {
    "use strict";
    var isInteger = require_lib71();
    var MAX_LENGTH = require_lib76();
    function isCollection(value) {
      return (
        typeof value === "object" &&
        value !== null &&
        typeof value.length === "number" &&
        isInteger(value.length) &&
        value.length >= 0 &&
        value.length <= MAX_LENGTH
      );
    }
    module.exports = isCollection;
  },
});

// node_modules/@stdlib/assert-is-collection/lib/index.js
var require_lib77 = __commonJS({
  "node_modules/@stdlib/assert-is-collection/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main79();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-arraybuffer/lib/main.js
var require_main80 = __commonJS({
  "node_modules/@stdlib/assert-is-arraybuffer/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    var hasArrayBuffer = typeof ArrayBuffer === "function";
    function isArrayBuffer(value) {
      return (
        (hasArrayBuffer && value instanceof ArrayBuffer) || // eslint-disable-line stdlib/require-globals
        nativeClass(value) === "[object ArrayBuffer]"
      );
    }
    module.exports = isArrayBuffer;
  },
});

// node_modules/@stdlib/assert-is-arraybuffer/lib/index.js
var require_lib78 = __commonJS({
  "node_modules/@stdlib/assert-is-arraybuffer/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main80();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-object/lib/main.js
var require_main81 = __commonJS({
  "node_modules/@stdlib/assert-is-object/lib/main.js"(exports, module) {
    "use strict";
    var isArray = require_lib28();
    function isObject(value) {
      return typeof value === "object" && value !== null && !isArray(value);
    }
    module.exports = isObject;
  },
});

// node_modules/@stdlib/assert-is-object/lib/index.js
var require_lib79 = __commonJS({
  "node_modules/@stdlib/assert-is-object/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main81();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-string/lib/primitive.js
var require_primitive4 = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/primitive.js"(exports, module) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  },
});

// node_modules/@stdlib/assert-is-string/lib/valueof.js
var require_valueof = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/valueof.js"(exports, module) {
    "use strict";
    var valueOf = String.prototype.valueOf;
    module.exports = valueOf;
  },
});

// node_modules/@stdlib/assert-is-string/lib/try2valueof.js
var require_try2valueof = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/try2valueof.js"(exports, module) {
    "use strict";
    var valueOf = require_valueof();
    function test(value) {
      try {
        valueOf.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  },
});

// node_modules/@stdlib/assert-is-string/lib/object.js
var require_object4 = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib8();
    var nativeClass = require_lib11();
    var test = require_try2valueof();
    var FLG = hasToStringTag();
    function isString(value) {
      if (typeof value === "object") {
        if (value instanceof String) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object String]";
      }
      return false;
    }
    module.exports = isString;
  },
});

// node_modules/@stdlib/assert-is-string/lib/main.js
var require_main82 = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive4();
    var isObject = require_object4();
    function isString(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isString;
  },
});

// node_modules/@stdlib/assert-is-string/lib/index.js
var require_lib80 = __commonJS({
  "node_modules/@stdlib/assert-is-string/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main82();
    var isPrimitive = require_primitive4();
    var isObject = require_object4();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-string-array/lib/index.js
var require_lib81 = __commonJS({
  "node_modules/@stdlib/assert-is-string-array/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var arrayfun = require_lib29();
    var isString = require_lib80();
    var isPrimitiveArray = arrayfun(isString.isPrimitive);
    var isObjectArray = arrayfun(isString.isObject);
    var isStringArray = arrayfun(isString);
    setReadOnly(isStringArray, "primitives", isPrimitiveArray);
    setReadOnly(isStringArray, "objects", isObjectArray);
    module.exports = isStringArray;
  },
});

// node_modules/@stdlib/utils-type-of/lib/fixtures/re.js
var require_re = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/fixtures/re.js"(exports, module) {
    "use strict";
    var RE = /./;
    module.exports = RE;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/primitive.js
var require_primitive5 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/primitive.js"(exports, module) {
    "use strict";
    function isBoolean(value) {
      return typeof value === "boolean";
    }
    module.exports = isBoolean;
  },
});

// node_modules/@stdlib/boolean-ctor/lib/main.js
var require_main83 = __commonJS({
  "node_modules/@stdlib/boolean-ctor/lib/main.js"(exports, module) {
    "use strict";
    var Bool = Boolean;
    module.exports = Bool;
  },
});

// node_modules/@stdlib/boolean-ctor/lib/index.js
var require_lib82 = __commonJS({
  "node_modules/@stdlib/boolean-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main83();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/tostring.js
var require_tostring3 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/tostring.js"(exports, module) {
    "use strict";
    var toString = Boolean.prototype.toString;
    module.exports = toString;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/try2serialize.js
var require_try2serialize2 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/try2serialize.js"(
    exports,
    module,
  ) {
    "use strict";
    var toString = require_tostring3();
    function test(value) {
      try {
        toString.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/object.js
var require_object5 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib8();
    var nativeClass = require_lib11();
    var Boolean2 = require_lib82();
    var test = require_try2serialize2();
    var FLG = hasToStringTag();
    function isBoolean(value) {
      if (typeof value === "object") {
        if (value instanceof Boolean2) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object Boolean]";
      }
      return false;
    }
    module.exports = isBoolean;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/main.js
var require_main84 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive5();
    var isObject = require_object5();
    function isBoolean(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isBoolean;
  },
});

// node_modules/@stdlib/assert-is-boolean/lib/index.js
var require_lib83 = __commonJS({
  "node_modules/@stdlib/assert-is-boolean/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main84();
    var isPrimitive = require_primitive5();
    var isObject = require_object5();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-global/lib/codegen.js
var require_codegen = __commonJS({
  "node_modules/@stdlib/utils-global/lib/codegen.js"(exports, module) {
    "use strict";
    function getGlobal() {
      return new Function("return this;")();
    }
    module.exports = getGlobal;
  },
});

// node_modules/@stdlib/utils-global/lib/self.js
var require_self = __commonJS({
  "node_modules/@stdlib/utils-global/lib/self.js"(exports, module) {
    "use strict";
    var obj = typeof self === "object" ? self : null;
    module.exports = obj;
  },
});

// node_modules/@stdlib/utils-global/lib/window.js
var require_window = __commonJS({
  "node_modules/@stdlib/utils-global/lib/window.js"(exports, module) {
    "use strict";
    var obj = typeof window === "object" ? window : null;
    module.exports = obj;
  },
});

// node_modules/@stdlib/utils-global/lib/global_this.js
var require_global_this = __commonJS({
  "node_modules/@stdlib/utils-global/lib/global_this.js"(exports, module) {
    "use strict";
    var obj = typeof globalThis === "object" ? globalThis : null;
    module.exports = obj;
  },
});

// node_modules/@stdlib/utils-global/lib/browser.js
var require_browser = __commonJS({
  "node_modules/@stdlib/utils-global/lib/browser.js"(exports, module) {
    "use strict";
    var isBoolean = require_lib83().isPrimitive;
    var format = require_lib3();
    var getThis = require_codegen();
    var Self = require_self();
    var Win = require_window();
    var GlobalThis = require_global_this();
    function getGlobal(codegen) {
      if (arguments.length) {
        if (!isBoolean(codegen)) {
          throw new TypeError(
            format(
              "invalid argument. Must provide a boolean. Value: `%s`.",
              codegen,
            ),
          );
        }
        if (codegen) {
          return getThis();
        }
      }
      if (GlobalThis) {
        return GlobalThis;
      }
      if (Self) {
        return Self;
      }
      if (Win) {
        return Win;
      }
      throw new Error("unexpected error. Unable to resolve global object.");
    }
    module.exports = getGlobal;
  },
});

// node_modules/@stdlib/utils-type-of/lib/fixtures/nodelist.js
var require_nodelist = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/fixtures/nodelist.js"(
    exports,
    module,
  ) {
    "use strict";
    var getGlobal = require_browser();
    var root = getGlobal();
    var nodeList = root.document && root.document.childNodes;
    module.exports = nodeList;
  },
});

// node_modules/@stdlib/utils-type-of/lib/fixtures/typedarray.js
var require_typedarray = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/fixtures/typedarray.js"(
    exports,
    module,
  ) {
    "use strict";
    var typedarray = Int8Array;
    module.exports = typedarray;
  },
});

// node_modules/@stdlib/utils-type-of/lib/check.js
var require_check = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/check.js"(exports, module) {
    "use strict";
    var RE = require_re();
    var nodeList = require_nodelist();
    var typedarray = require_typedarray();
    function check() {
      if (
        // Chrome 1-12 returns 'function' for regular expression instances (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof):
        typeof RE === "function" || // Safari 8 returns 'object' for typed array and weak map constructors (underscore #1929):
        typeof typedarray === "object" || // PhantomJS 1.9 returns 'function' for `NodeList` instances (underscore #2236):
        typeof nodeList === "function"
      ) {
        return true;
      }
      return false;
    }
    module.exports = check;
  },
});

// node_modules/@stdlib/utils-type-of/lib/main.js
var require_main85 = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/main.js"(exports, module) {
    "use strict";
    var ctorName = require_lib33();
    function typeOf(v) {
      var type;
      if (v === null) {
        return "null";
      }
      type = typeof v;
      if (type === "object") {
        return ctorName(v).toLowerCase();
      }
      return type;
    }
    module.exports = typeOf;
  },
});

// node_modules/@stdlib/utils-type-of/lib/polyfill.js
var require_polyfill13 = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/polyfill.js"(exports, module) {
    "use strict";
    var ctorName = require_lib33();
    function typeOf(v) {
      return ctorName(v).toLowerCase();
    }
    module.exports = typeOf;
  },
});

// node_modules/@stdlib/utils-type-of/lib/index.js
var require_lib84 = __commonJS({
  "node_modules/@stdlib/utils-type-of/lib/index.js"(exports, module) {
    "use strict";
    var usePolyfill = require_check();
    var builtin = require_main85();
    var polyfill = require_polyfill13();
    var main = usePolyfill() ? polyfill : builtin;
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-function/lib/main.js
var require_main86 = __commonJS({
  "node_modules/@stdlib/assert-is-function/lib/main.js"(exports, module) {
    "use strict";
    var typeOf = require_lib84();
    function isFunction(value) {
      return typeOf(value) === "function";
    }
    module.exports = isFunction;
  },
});

// node_modules/@stdlib/assert-is-function/lib/index.js
var require_lib85 = __commonJS({
  "node_modules/@stdlib/assert-is-function/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main86();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-define-read-only-property/lib/main.js
var require_main87 = __commonJS({
  "node_modules/@stdlib/utils-define-read-only-property/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var defineProperty = require_lib4();
    function setReadOnly(obj, prop, value) {
      defineProperty(obj, prop, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: value,
      });
    }
    module.exports = setReadOnly;
  },
});

// node_modules/@stdlib/utils-define-read-only-property/lib/index.js
var require_lib86 = __commonJS({
  "node_modules/@stdlib/utils-define-read-only-property/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main87();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float64-ctor/lib/tostring.js
var require_tostring4 = __commonJS({
  "node_modules/@stdlib/complex-float64-ctor/lib/tostring.js"(exports, module) {
    "use strict";
    function toString() {
      var str = "" + this.re;
      if (this.im < 0) {
        str += " - " + -this.im;
      } else {
        str += " + " + this.im;
      }
      str += "i";
      return str;
    }
    module.exports = toString;
  },
});

// node_modules/@stdlib/complex-float64-ctor/lib/tojson.js
var require_tojson = __commonJS({
  "node_modules/@stdlib/complex-float64-ctor/lib/tojson.js"(exports, module) {
    "use strict";
    function toJSON() {
      var out = {};
      out.type = "Complex128";
      out.re = this.re;
      out.im = this.im;
      return out;
    }
    module.exports = toJSON;
  },
});

// node_modules/@stdlib/complex-float64-ctor/lib/main.js
var require_main88 = __commonJS({
  "node_modules/@stdlib/complex-float64-ctor/lib/main.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isPrimitive;
    var setEnumerableReadOnly = require_lib86();
    var setReadOnly = require_lib5();
    var format = require_lib3();
    var toStr = require_tostring4();
    var toJSON = require_tojson();
    function Complex128(real, imag) {
      if (!(this instanceof Complex128)) {
        throw new TypeError(
          "invalid invocation. Constructor must be called with the `new` keyword.",
        );
      }
      if (!isNumber(real)) {
        throw new TypeError(
          format(
            "invalid argument. Real component must be a number. Value: `%s`.",
            real,
          ),
        );
      }
      if (!isNumber(imag)) {
        throw new TypeError(
          format(
            "invalid argument. Imaginary component must be a number. Value: `%s`.",
            imag,
          ),
        );
      }
      setEnumerableReadOnly(this, "re", real);
      setEnumerableReadOnly(this, "im", imag);
      return this;
    }
    setReadOnly(Complex128, "name", "Complex128");
    setReadOnly(Complex128, "BYTES_PER_ELEMENT", 8);
    setReadOnly(Complex128.prototype, "BYTES_PER_ELEMENT", 8);
    setReadOnly(Complex128.prototype, "byteLength", 16);
    setReadOnly(Complex128.prototype, "toString", toStr);
    setReadOnly(Complex128.prototype, "toJSON", toJSON);
    module.exports = Complex128;
  },
});

// node_modules/@stdlib/complex-float64-ctor/lib/index.js
var require_lib87 = __commonJS({
  "node_modules/@stdlib/complex-float64-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main88();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float32-ctor/lib/tostring.js
var require_tostring5 = __commonJS({
  "node_modules/@stdlib/complex-float32-ctor/lib/tostring.js"(exports, module) {
    "use strict";
    function toString() {
      var str = "" + this.re;
      if (this.im < 0) {
        str += " - " + -this.im;
      } else {
        str += " + " + this.im;
      }
      str += "i";
      return str;
    }
    module.exports = toString;
  },
});

// node_modules/@stdlib/complex-float32-ctor/lib/tojson.js
var require_tojson2 = __commonJS({
  "node_modules/@stdlib/complex-float32-ctor/lib/tojson.js"(exports, module) {
    "use strict";
    function toJSON() {
      var out = {};
      out.type = "Complex64";
      out.re = this.re;
      out.im = this.im;
      return out;
    }
    module.exports = toJSON;
  },
});

// node_modules/@stdlib/complex-float32-ctor/lib/main.js
var require_main89 = __commonJS({
  "node_modules/@stdlib/complex-float32-ctor/lib/main.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isPrimitive;
    var setEnumerableReadOnly = require_lib86();
    var setReadOnly = require_lib5();
    var float64ToFloat32 = require_lib16();
    var format = require_lib3();
    var toStr = require_tostring5();
    var toJSON = require_tojson2();
    function Complex64(real, imag) {
      if (!(this instanceof Complex64)) {
        throw new TypeError(
          "invalid invocation. Constructor must be called with the `new` keyword.",
        );
      }
      if (!isNumber(real)) {
        throw new TypeError(
          format(
            "invalid argument. Real component must be a number. Value: `%s`.",
            real,
          ),
        );
      }
      if (!isNumber(imag)) {
        throw new TypeError(
          format(
            "invalid argument. Imaginary component must be a number. Value: `%s`.",
            imag,
          ),
        );
      }
      setEnumerableReadOnly(this, "re", float64ToFloat32(real));
      setEnumerableReadOnly(this, "im", float64ToFloat32(imag));
      return this;
    }
    setReadOnly(Complex64, "name", "Complex64");
    setReadOnly(Complex64, "BYTES_PER_ELEMENT", 4);
    setReadOnly(Complex64.prototype, "BYTES_PER_ELEMENT", 4);
    setReadOnly(Complex64.prototype, "byteLength", 8);
    setReadOnly(Complex64.prototype, "toString", toStr);
    setReadOnly(Complex64.prototype, "toJSON", toJSON);
    module.exports = Complex64;
  },
});

// node_modules/@stdlib/complex-float32-ctor/lib/index.js
var require_lib88 = __commonJS({
  "node_modules/@stdlib/complex-float32-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main89();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-complex-like/lib/main.js
var require_main90 = __commonJS({
  "node_modules/@stdlib/assert-is-complex-like/lib/main.js"(exports, module) {
    "use strict";
    var Complex128 = require_lib87();
    var Complex64 = require_lib88();
    function isComplexLike(value) {
      if (value instanceof Complex128 || value instanceof Complex64) {
        return true;
      }
      return (
        typeof value === "object" &&
        value !== null &&
        typeof value.re === "number" &&
        typeof value.im === "number"
      );
    }
    module.exports = isComplexLike;
  },
});

// node_modules/@stdlib/assert-is-complex-like/lib/index.js
var require_lib89 = __commonJS({
  "node_modules/@stdlib/assert-is-complex-like/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main90();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-assert-is-even/lib/main.js
var require_main91 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-even/lib/main.js"(exports, module) {
    "use strict";
    var isInteger = require_lib71();
    function isEven(x) {
      return isInteger(x / 2);
    }
    module.exports = isEven;
  },
});

// node_modules/@stdlib/math-base-assert-is-even/lib/index.js
var require_lib90 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-even/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main91();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-base-assert-is-complex64array/lib/main.js
var require_main92 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-complex64array/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var BYTES_PER_ELEMENT = 8;
    function isComplex64Array(value) {
      return (
        typeof value === "object" &&
        value !== null &&
        value.constructor.name === "Complex64Array" &&
        value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
      );
    }
    module.exports = isComplex64Array;
  },
});

// node_modules/@stdlib/array-base-assert-is-complex64array/lib/index.js
var require_lib91 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-complex64array/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main92();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-base-assert-is-complex128array/lib/main.js
var require_main93 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-complex128array/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var BYTES_PER_ELEMENT = 16;
    function isComplex128Array(value) {
      return (
        typeof value === "object" &&
        value !== null &&
        value.constructor.name === "Complex128Array" &&
        value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
      );
    }
    module.exports = isComplex128Array;
  },
});

// node_modules/@stdlib/array-base-assert-is-complex128array/lib/index.js
var require_lib92 = __commonJS({
  "node_modules/@stdlib/array-base-assert-is-complex128array/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main93();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-has-iterator-symbol-support/lib/main.js
var require_main94 = __commonJS({
  "node_modules/@stdlib/assert-has-iterator-symbol-support/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasOwnProp = require_lib9();
    var Symbol2 = require_lib10();
    function hasIteratorSymbolSupport() {
      return (
        typeof Symbol2 === "function" &&
        typeof Symbol2("foo") === "symbol" &&
        hasOwnProp(Symbol2, "iterator") &&
        typeof Symbol2.iterator === "symbol"
      );
    }
    module.exports = hasIteratorSymbolSupport;
  },
});

// node_modules/@stdlib/assert-has-iterator-symbol-support/lib/index.js
var require_lib93 = __commonJS({
  "node_modules/@stdlib/assert-has-iterator-symbol-support/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main94();
    module.exports = main;
  },
});

// node_modules/@stdlib/symbol-iterator/lib/main.js
var require_main95 = __commonJS({
  "node_modules/@stdlib/symbol-iterator/lib/main.js"(exports, module) {
    "use strict";
    var hasIteratorSymbolSupport = require_lib93();
    var IteratorSymbol = hasIteratorSymbolSupport() ? Symbol.iterator : null;
    module.exports = IteratorSymbol;
  },
});

// node_modules/@stdlib/symbol-iterator/lib/index.js
var require_lib94 = __commonJS({
  "node_modules/@stdlib/symbol-iterator/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main95();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-accessor/lib/main.js
var require_main96 = __commonJS({
  "node_modules/@stdlib/utils-define-nonenumerable-read-only-accessor/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var defineProperty = require_lib4();
    function setNonEnumerableReadOnlyAccessor(obj, prop, getter) {
      defineProperty(obj, prop, {
        configurable: false,
        enumerable: false,
        get: getter,
      });
    }
    module.exports = setNonEnumerableReadOnlyAccessor;
  },
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-accessor/lib/index.js
var require_lib95 = __commonJS({
  "node_modules/@stdlib/utils-define-nonenumerable-read-only-accessor/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main96();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float32-real/lib/main.js
var require_main97 = __commonJS({
  "node_modules/@stdlib/complex-float32-real/lib/main.js"(exports, module) {
    "use strict";
    function real(z) {
      return z.re;
    }
    module.exports = real;
  },
});

// node_modules/@stdlib/complex-float32-real/lib/index.js
var require_lib96 = __commonJS({
  "node_modules/@stdlib/complex-float32-real/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main97();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float32-imag/lib/main.js
var require_main98 = __commonJS({
  "node_modules/@stdlib/complex-float32-imag/lib/main.js"(exports, module) {
    "use strict";
    function imag(z) {
      return z.im;
    }
    module.exports = imag;
  },
});

// node_modules/@stdlib/complex-float32-imag/lib/index.js
var require_lib97 = __commonJS({
  "node_modules/@stdlib/complex-float32-imag/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main98();
    module.exports = main;
  },
});

// node_modules/@stdlib/strided-base-reinterpret-complex64/lib/main.js
var require_main99 = __commonJS({
  "node_modules/@stdlib/strided-base-reinterpret-complex64/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var Float32Array2 = require_lib15();
    function reinterpret(x, offset) {
      return new Float32Array2(
        x.buffer,
        x.byteOffset + x.BYTES_PER_ELEMENT * offset,
        2 * (x.length - offset),
      );
    }
    module.exports = reinterpret;
  },
});

// node_modules/@stdlib/strided-base-reinterpret-complex64/lib/index.js
var require_lib98 = __commonJS({
  "node_modules/@stdlib/strided-base-reinterpret-complex64/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main99();
    module.exports = main;
  },
});

// node_modules/@stdlib/strided-base-reinterpret-complex128/lib/main.js
var require_main100 = __commonJS({
  "node_modules/@stdlib/strided-base-reinterpret-complex128/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var Float64Array2 = require_lib36();
    function reinterpret(x, offset) {
      return new Float64Array2(
        x.buffer,
        x.byteOffset + x.BYTES_PER_ELEMENT * offset,
        2 * (x.length - offset),
      );
    }
    module.exports = reinterpret;
  },
});

// node_modules/@stdlib/strided-base-reinterpret-complex128/lib/index.js
var require_lib99 = __commonJS({
  "node_modules/@stdlib/strided-base-reinterpret-complex128/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main100();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-complex64/lib/from_iterator.js
var require_from_iterator = __commonJS({
  "node_modules/@stdlib/array-complex64/lib/from_iterator.js"(exports, module) {
    "use strict";
    var isArrayLikeObject = require_lib75();
    var isComplexLike = require_lib89();
    var realf = require_lib96();
    var imagf = require_lib97();
    var format = require_lib3();
    function fromIterator(it) {
      var out;
      var v;
      var z;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        z = v.value;
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(realf(z), imagf(z));
        } else {
          return new TypeError(
            format(
              "invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              z,
            ),
          );
        }
      }
      return out;
    }
    module.exports = fromIterator;
  },
});

// node_modules/@stdlib/array-complex64/lib/from_iterator_map.js
var require_from_iterator_map = __commonJS({
  "node_modules/@stdlib/array-complex64/lib/from_iterator_map.js"(
    exports,
    module,
  ) {
    "use strict";
    var isArrayLikeObject = require_lib75();
    var isComplexLike = require_lib89();
    var realf = require_lib96();
    var imagf = require_lib97();
    var format = require_lib3();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var z;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        z = clbk.call(thisArg, v.value, i);
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(realf(z), imagf(z));
        } else {
          return new TypeError(
            format(
              "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              z,
            ),
          );
        }
      }
      return out;
    }
    module.exports = fromIteratorMap;
  },
});

// node_modules/@stdlib/array-complex64/lib/from_array.js
var require_from_array = __commonJS({
  "node_modules/@stdlib/array-complex64/lib/from_array.js"(exports, module) {
    "use strict";
    var isComplexLike = require_lib89();
    var realf = require_lib96();
    var imagf = require_lib97();
    function fromArray(buf, arr) {
      var len;
      var v;
      var i;
      var j;
      len = arr.length;
      j = 0;
      for (i = 0; i < len; i++) {
        v = arr[i];
        if (!isComplexLike(v)) {
          return null;
        }
        buf[j] = realf(v);
        buf[j + 1] = imagf(v);
        j += 2;
      }
      return buf;
    }
    module.exports = fromArray;
  },
});

// node_modules/@stdlib/array-complex64/lib/main.js
var require_main101 = __commonJS({
  "node_modules/@stdlib/array-complex64/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib73().isPrimitive;
    var isArrayLikeObject = require_lib75();
    var isCollection = require_lib77();
    var isArrayBuffer = require_lib78();
    var isObject = require_lib79();
    var isArray = require_lib28();
    var isStringArray = require_lib81().primitives;
    var isString = require_lib80().isPrimitive;
    var isFunction = require_lib85();
    var isComplexLike = require_lib89();
    var isEven = require_lib90();
    var isInteger = require_lib71();
    var isComplex64Array = require_lib91();
    var isComplex128Array = require_lib92();
    var hasIteratorSymbolSupport = require_lib93();
    var ITERATOR_SYMBOL = require_lib94();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib95();
    var Float32Array2 = require_lib15();
    var Complex64 = require_lib88();
    var format = require_lib3();
    var realf = require_lib96();
    var imagf = require_lib97();
    var floor = require_lib70();
    var reinterpret64 = require_lib98();
    var reinterpret128 = require_lib99();
    var getter = require_lib27();
    var accessorGetter = require_lib26();
    var fromIterator = require_from_iterator();
    var fromIteratorMap = require_from_iterator_map();
    var fromArray = require_from_array();
    var BYTES_PER_ELEMENT = Float32Array2.BYTES_PER_ELEMENT * 2;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isComplexArray(value) {
      return (
        value instanceof Complex64Array ||
        (typeof value === "object" &&
          value !== null &&
          (value.constructor.name === "Complex64Array" ||
            value.constructor.name === "Complex128Array") &&
          typeof value._length === "number" && // eslint-disable-line no-underscore-dangle
          // NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
          typeof value._buffer === "object")
      );
    }
    function isComplexArrayConstructor(value) {
      return (
        value === Complex64Array || // NOTE: weaker test in order to avoid a circular dependency with Complex128Array...
        value.name === "Complex128Array"
      );
    }
    function getComplex64(buf, idx) {
      idx *= 2;
      return new Complex64(buf[idx], buf[idx + 1]);
    }
    function Complex64Array() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      nargs = arguments.length;
      if (!(this instanceof Complex64Array)) {
        if (nargs === 0) {
          return new Complex64Array();
        }
        if (nargs === 1) {
          return new Complex64Array(arguments[0]);
        }
        if (nargs === 2) {
          return new Complex64Array(arguments[0], arguments[1]);
        }
        return new Complex64Array(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Float32Array2(0);
      } else if (nargs === 1) {
        if (isNonNegativeInteger(arguments[0])) {
          buf = new Float32Array2(arguments[0] * 2);
        } else if (isCollection(arguments[0])) {
          buf = arguments[0];
          len = buf.length;
          if (len && isArray(buf) && isComplexLike(buf[0])) {
            buf = fromArray(new Float32Array2(len * 2), buf);
            if (buf === null) {
              if (!isEven(len)) {
                throw new RangeError(
                  format(
                    "invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.",
                    len,
                  ),
                );
              }
              buf = new Float32Array2(arguments[0]);
            }
          } else {
            if (isComplex64Array(buf)) {
              buf = reinterpret64(buf, 0);
            } else if (isComplex128Array(buf)) {
              buf = reinterpret128(buf, 0);
            } else if (!isEven(len)) {
              throw new RangeError(
                format(
                  "invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.",
                  len,
                ),
              );
            }
            buf = new Float32Array2(buf);
          }
        } else if (isArrayBuffer(arguments[0])) {
          buf = arguments[0];
          if (!isInteger(buf.byteLength / BYTES_PER_ELEMENT)) {
            throw new RangeError(
              format(
                "invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.",
                BYTES_PER_ELEMENT,
                buf.byteLength,
              ),
            );
          }
          buf = new Float32Array2(buf);
        } else if (isObject(arguments[0])) {
          buf = arguments[0];
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(
              format(
                "invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.",
                buf,
              ),
            );
          }
          if (!isFunction(buf[ITERATOR_SYMBOL])) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                buf,
              ),
            );
          }
          buf = buf[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                buf,
              ),
            );
          }
          buf = fromIterator(buf);
          if (buf instanceof Error) {
            throw buf;
          }
          buf = new Float32Array2(buf);
        } else {
          throw new TypeError(
            format(
              "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
              arguments[0],
            ),
          );
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an ArrayBuffer. Value: `%s`.",
              buf,
            ),
          );
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(
            format(
              "invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.",
              byteOffset,
            ),
          );
        }
        if (!isInteger(byteOffset / BYTES_PER_ELEMENT)) {
          throw new RangeError(
            format(
              "invalid argument. Byte offset must be a multiple of %u. Value: `%u`.",
              BYTES_PER_ELEMENT,
              byteOffset,
            ),
          );
        }
        if (nargs === 2) {
          len = buf.byteLength - byteOffset;
          if (!isInteger(len / BYTES_PER_ELEMENT)) {
            throw new RangeError(
              format(
                "invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.",
                BYTES_PER_ELEMENT,
                len,
              ),
            );
          }
          buf = new Float32Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(
              format(
                "invalid argument. Length must be a nonnegative integer. Value: `%s`.",
                len,
              ),
            );
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(
              format(
                "invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.",
                len * BYTES_PER_ELEMENT,
              ),
            );
          }
          buf = new Float32Array2(buf, byteOffset, len * 2);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length / 2);
      return this;
    }
    setReadOnly(Complex64Array, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(Complex64Array, "name", "Complex64Array");
    setReadOnly(Complex64Array, "from", function from(src) {
      var thisArg;
      var nargs;
      var clbk;
      var out;
      var buf;
      var tmp;
      var get;
      var len;
      var flg;
      var v;
      var i;
      var j;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a function. Value: `%s`.",
              clbk,
            ),
          );
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isComplexArray(src)) {
        len = src.length;
        if (clbk) {
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, src.get(i), i);
            if (isComplexLike(v)) {
              buf[j] = realf(v);
              buf[j + 1] = imagf(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(
                format(
                  "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
                  v,
                ),
              );
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          for (i = 0; i < len; i++) {
            if (!isComplexLike(get(src, i))) {
              flg = true;
              break;
            }
          }
          if (flg) {
            if (!isEven(len)) {
              throw new RangeError(
                format(
                  "invalid argument. First argument must have a length which is a multiple of %u. Length: `%u`.",
                  2,
                  len,
                ),
              );
            }
            out = new this(len / 2);
            buf = out._buffer;
            for (i = 0; i < len; i++) {
              buf[i] = clbk.call(thisArg, get(src, i), i);
            }
            return out;
          }
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, get(src, i), i);
            if (isComplexLike(v)) {
              buf[j] = realf(v);
              buf[j + 1] = imagf(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(
                format(
                  "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
                  v,
                ),
              );
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (
        isObject(src) &&
        HAS_ITERATOR_SYMBOL &&
        isFunction(src[ITERATOR_SYMBOL])
      ) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
              src,
            ),
          );
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        if (tmp instanceof Error) {
          throw tmp;
        }
        len = tmp.length / 2;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(
        format(
          "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
          src,
        ),
      );
    });
    setReadOnly(Complex64Array, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(Complex64Array.prototype, "at", function at(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide an integer. Value: `%s`.",
            idx,
          ),
        );
      }
      if (idx < 0) {
        idx += this._length;
      }
      if (idx < 0 || idx >= this._length) {
        return;
      }
      return getComplex64(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex64Array.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(Complex64Array.prototype, "byteLength", function get() {
      return this._buffer.byteLength;
    });
    setReadOnlyAccessor(Complex64Array.prototype, "byteOffset", function get() {
      return this._buffer.byteOffset;
    });
    setReadOnly(
      Complex64Array.prototype,
      "BYTES_PER_ELEMENT",
      Complex64Array.BYTES_PER_ELEMENT,
    );
    setReadOnly(
      Complex64Array.prototype,
      "copyWithin",
      function copyWithin(target, start) {
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (arguments.length === 2) {
          this._buffer.copyWithin(target * 2, start * 2);
        } else {
          this._buffer.copyWithin(target * 2, start * 2, arguments[2] * 2);
        }
        return this;
      },
    );
    setReadOnly(Complex64Array.prototype, "entries", function entries() {
      var self2;
      var iter;
      var len;
      var buf;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: [i, getComplex64(buf, i)],
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(
      Complex64Array.prototype,
      "every",
      function every(predicate, thisArg) {
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (!predicate.call(thisArg, getComplex64(buf, i), i, this)) {
            return false;
          }
        }
        return true;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "fill",
      function fill(value, start, end) {
        var buf;
        var len;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(value)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              value,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          if (!isInteger(start)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                start,
              ),
            );
          }
          if (start < 0) {
            start += len;
            if (start < 0) {
              start = 0;
            }
          }
          if (arguments.length > 2) {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Third argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            }
            if (end > len) {
              end = len;
            }
          } else {
            end = len;
          }
        } else {
          start = 0;
          end = len;
        }
        re = realf(value);
        im = imagf(value);
        for (i = start; i < end; i++) {
          idx = 2 * i;
          buf[idx] = re;
          buf[idx + 1] = im;
        }
        return this;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "filter",
      function filter(predicate, thisArg) {
        var buf;
        var out;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          z = getComplex64(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            out.push(z);
          }
        }
        return new this.constructor(out);
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "find",
      function find(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex64(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return z;
          }
        }
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "findIndex",
      function findIndex(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex64(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "findLast",
      function findLast(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          z = getComplex64(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return z;
          }
        }
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "findLastIndex",
      function findLastIndex(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          z = getComplex64(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "forEach",
      function forEach(fcn, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(fcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              fcn,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex64(buf, i);
          fcn.call(thisArg, z, i, this);
        }
      },
    );
    setReadOnly(Complex64Array.prototype, "get", function get(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide a nonnegative integer. Value: `%s`.",
            idx,
          ),
        );
      }
      if (idx >= this._length) {
        return;
      }
      return getComplex64(this._buffer, idx);
    });
    setReadOnly(
      Complex64Array.prototype,
      "includes",
      function includes(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        re = realf(searchElement);
        im = imagf(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "indexOf",
      function indexOf(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        re = realf(searchElement);
        im = imagf(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(Complex64Array.prototype, "join", function join(separator) {
      var out;
      var buf;
      var sep;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (arguments.length === 0) {
        sep = ",";
      } else if (isString(separator)) {
        sep = separator;
      } else {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a string. Value: `%s`.",
            separator,
          ),
        );
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex64(buf, i).toString());
      }
      return out.join(sep);
    });
    setReadOnly(Complex64Array.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: i,
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(
      Complex64Array.prototype,
      "lastIndexOf",
      function lastIndexOf(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex >= this._length) {
            fromIndex = this._length - 1;
          } else if (fromIndex < 0) {
            fromIndex += this._length;
          }
        } else {
          fromIndex = this._length - 1;
        }
        re = realf(searchElement);
        im = imagf(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i >= 0; i--) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnlyAccessor(Complex64Array.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(Complex64Array.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var buf;
      var out;
      var i;
      var v;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isFunction(fcn)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a function. Value: `%s`.",
            fcn,
          ),
        );
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        v = fcn.call(thisArg, getComplex64(buf, i), i, this);
        if (isComplexLike(v)) {
          outbuf[2 * i] = realf(v);
          outbuf[2 * i + 1] = imagf(v);
        } else if (isArrayLikeObject(v) && v.length === 2) {
          outbuf[2 * i] = v[0];
          outbuf[2 * i + 1] = v[1];
        } else {
          throw new TypeError(
            format(
              "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              v,
            ),
          );
        }
      }
      return out;
    });
    setReadOnly(
      Complex64Array.prototype,
      "reduce",
      function reduce(reducer, initialValue) {
        var buf;
        var acc;
        var len;
        var v;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = 0;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = getComplex64(buf, 0);
          i = 1;
        }
        for (; i < len; i++) {
          v = getComplex64(buf, i);
          acc = reducer(acc, v, i, this);
        }
        return acc;
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "reduceRight",
      function reduceRight(reducer, initialValue) {
        var buf;
        var acc;
        var len;
        var v;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = len - 1;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = getComplex64(buf, len - 1);
          i = len - 2;
        }
        for (; i >= 0; i--) {
          v = getComplex64(buf, i);
          acc = reducer(acc, v, i, this);
        }
        return acc;
      },
    );
    setReadOnly(Complex64Array.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      len = this._length;
      buf = this._buffer;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[2 * i];
        buf[2 * i] = buf[2 * j];
        buf[2 * j] = tmp;
        tmp = buf[2 * i + 1];
        buf[2 * i + 1] = buf[2 * j + 1];
        buf[2 * j + 1] = tmp;
      }
      return this;
    });
    setReadOnly(Complex64Array.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var flg;
      var N;
      var v;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(
            format(
              "invalid argument. Index argument must be a nonnegative integer. Value: `%s`.",
              idx,
            ),
          );
        }
      } else {
        idx = 0;
      }
      if (isComplexLike(value)) {
        if (idx >= this._length) {
          throw new RangeError(
            format(
              "invalid argument. Index argument is out-of-bounds. Value: `%u`.",
              idx,
            ),
          );
        }
        idx *= 2;
        buf[idx] = realf(value);
        buf[idx + 1] = imagf(value);
        return;
      }
      if (isComplexArray(value)) {
        N = value._length;
        if (idx + N > this._length) {
          throw new RangeError(
            "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
          );
        }
        sbuf = value._buffer;
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (
          sbuf.buffer === buf.buffer &&
          sbuf.byteOffset < j &&
          sbuf.byteOffset + sbuf.byteLength > j
        ) {
          tmp = new Float32Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        idx *= 2;
        j = 0;
        for (i = 0; i < N; i++) {
          buf[idx] = sbuf[j];
          buf[idx + 1] = sbuf[j + 1];
          idx += 2;
          j += 2;
        }
        return;
      }
      if (isCollection(value)) {
        N = value.length;
        for (i = 0; i < N; i++) {
          if (!isComplexLike(value[i])) {
            flg = true;
            break;
          }
        }
        if (flg) {
          if (!isEven(N)) {
            throw new RangeError(
              format(
                "invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.",
                N,
              ),
            );
          }
          if (idx + N / 2 > this._length) {
            throw new RangeError(
              "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
            );
          }
          sbuf = value;
          j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
          if (
            sbuf.buffer === buf.buffer &&
            sbuf.byteOffset < j &&
            sbuf.byteOffset + sbuf.byteLength > j
          ) {
            tmp = new Float32Array2(N);
            for (i = 0; i < N; i++) {
              tmp[i] = sbuf[i];
            }
            sbuf = tmp;
          }
          idx *= 2;
          N /= 2;
          j = 0;
          for (i = 0; i < N; i++) {
            buf[idx] = sbuf[j];
            buf[idx + 1] = sbuf[j + 1];
            idx += 2;
            j += 2;
          }
          return;
        }
        if (idx + N > this._length) {
          throw new RangeError(
            "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
          );
        }
        idx *= 2;
        for (i = 0; i < N; i++) {
          v = value[i];
          buf[idx] = realf(v);
          buf[idx + 1] = imagf(v);
          idx += 2;
        }
        return;
      }
      throw new TypeError(
        format(
          "invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.",
          value,
        ),
      );
    });
    setReadOnly(Complex64Array.prototype, "slice", function slice(start, end) {
      var outlen;
      var outbuf;
      var out;
      var idx;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        start = 0;
        end = len;
      } else {
        if (!isInteger(start)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              start,
            ),
          );
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                end,
              ),
            );
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (start < end) {
        outlen = end - start;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        idx = 2 * (i + start);
        outbuf[2 * i] = buf[idx];
        outbuf[2 * i + 1] = buf[idx + 1];
      }
      return out;
    });
    setReadOnly(
      Complex64Array.prototype,
      "some",
      function some(predicate, thisArg) {
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (predicate.call(thisArg, getComplex64(buf, i), i, this)) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(Complex64Array.prototype, "sort", function sort(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a function. Value: `%s`.",
            compareFcn,
          ),
        );
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex64(buf, i));
      }
      tmp.sort(compareFcn);
      for (i = 0; i < len; i++) {
        j = 2 * i;
        buf[j] = realf(tmp[i]);
        buf[j + 1] = imagf(tmp[i]);
      }
      return this;
    });
    setReadOnly(
      Complex64Array.prototype,
      "subarray",
      function subarray(begin, end) {
        var offset;
        var buf;
        var len;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length === 0) {
          begin = 0;
          end = len;
        } else {
          if (!isInteger(begin)) {
            throw new TypeError(
              format(
                "invalid argument. First argument must be an integer. Value: `%s`.",
                begin,
              ),
            );
          }
          if (begin < 0) {
            begin += len;
            if (begin < 0) {
              begin = 0;
            }
          }
          if (arguments.length === 1) {
            end = len;
          } else {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Second argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            } else if (end > len) {
              end = len;
            }
          }
        }
        if (begin >= len) {
          len = 0;
          offset = buf.byteLength;
        } else if (begin >= end) {
          len = 0;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        } else {
          len = end - begin;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        }
        return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
      },
    );
    setReadOnly(
      Complex64Array.prototype,
      "toLocaleString",
      function toLocaleString(locales, options) {
        var opts;
        var loc;
        var out;
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (arguments.length === 0) {
          loc = [];
        } else if (isString(locales) || isStringArray(locales)) {
          loc = locales;
        } else {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a string or an array of strings. Value: `%s`.",
              locales,
            ),
          );
        }
        if (arguments.length < 2) {
          opts = {};
        } else if (isObject(options)) {
          opts = options;
        } else {
          throw new TypeError(
            format(
              "invalid argument. Options argument must be an object. Value: `%s`.",
              options,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          out.push(getComplex64(buf, i).toLocaleString(loc, opts));
        }
        return out.join(",");
      },
    );
    setReadOnly(Complex64Array.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        j = len - i - 1;
        outbuf[2 * i] = buf[2 * j];
        outbuf[2 * i + 1] = buf[2 * j + 1];
      }
      return out;
    });
    setReadOnly(
      Complex64Array.prototype,
      "toSorted",
      function toSorted(compareFcn) {
        var tmp;
        var buf;
        var len;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(compareFcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              compareFcn,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        tmp = [];
        for (i = 0; i < len; i++) {
          tmp.push(getComplex64(buf, i));
        }
        tmp.sort(compareFcn);
        return new Complex64Array(tmp);
      },
    );
    setReadOnly(Complex64Array.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex64(buf, i).toString());
      }
      return out.join(",");
    });
    setReadOnly(Complex64Array.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: getComplex64(buf, i),
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(
      Complex64Array.prototype,
      "with",
      function copyWith(index, value) {
        var buf;
        var out;
        var len;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isInteger(index)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              index,
            ),
          );
        }
        len = this._length;
        if (index < 0) {
          index += len;
        }
        if (index < 0 || index >= len) {
          throw new RangeError(
            format(
              "invalid argument. Index argument is out-of-bounds. Value: `%s`.",
              index,
            ),
          );
        }
        if (!isComplexLike(value)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a complex number. Value: `%s`.",
              value,
            ),
          );
        }
        out = new this.constructor(this._buffer);
        buf = out._buffer;
        buf[2 * index] = realf(value);
        buf[2 * index + 1] = imagf(value);
        return out;
      },
    );
    module.exports = Complex64Array;
  },
});

// node_modules/@stdlib/array-complex64/lib/index.js
var require_lib100 = __commonJS({
  "node_modules/@stdlib/array-complex64/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main101();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float64-real/lib/main.js
var require_main102 = __commonJS({
  "node_modules/@stdlib/complex-float64-real/lib/main.js"(exports, module) {
    "use strict";
    function real(z) {
      return z.re;
    }
    module.exports = real;
  },
});

// node_modules/@stdlib/complex-float64-real/lib/index.js
var require_lib101 = __commonJS({
  "node_modules/@stdlib/complex-float64-real/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main102();
    module.exports = main;
  },
});

// node_modules/@stdlib/complex-float64-imag/lib/main.js
var require_main103 = __commonJS({
  "node_modules/@stdlib/complex-float64-imag/lib/main.js"(exports, module) {
    "use strict";
    function imag(z) {
      return z.im;
    }
    module.exports = imag;
  },
});

// node_modules/@stdlib/complex-float64-imag/lib/index.js
var require_lib102 = __commonJS({
  "node_modules/@stdlib/complex-float64-imag/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main103();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-complex128/lib/from_iterator.js
var require_from_iterator2 = __commonJS({
  "node_modules/@stdlib/array-complex128/lib/from_iterator.js"(
    exports,
    module,
  ) {
    "use strict";
    var isArrayLikeObject = require_lib75();
    var isComplexLike = require_lib89();
    var format = require_lib3();
    var real = require_lib101();
    var imag = require_lib102();
    function fromIterator(it) {
      var out;
      var v;
      var z;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        z = v.value;
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(real(z), imag(z));
        } else {
          return new TypeError(
            format(
              "invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              z,
            ),
          );
        }
      }
      return out;
    }
    module.exports = fromIterator;
  },
});

// node_modules/@stdlib/array-complex128/lib/from_iterator_map.js
var require_from_iterator_map2 = __commonJS({
  "node_modules/@stdlib/array-complex128/lib/from_iterator_map.js"(
    exports,
    module,
  ) {
    "use strict";
    var isArrayLikeObject = require_lib75();
    var isComplexLike = require_lib89();
    var format = require_lib3();
    var real = require_lib101();
    var imag = require_lib102();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var z;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        z = clbk.call(thisArg, v.value, i);
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(real(z), imag(z));
        } else {
          return new TypeError(
            format(
              "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              z,
            ),
          );
        }
      }
      return out;
    }
    module.exports = fromIteratorMap;
  },
});

// node_modules/@stdlib/array-complex128/lib/from_array.js
var require_from_array2 = __commonJS({
  "node_modules/@stdlib/array-complex128/lib/from_array.js"(exports, module) {
    "use strict";
    var isComplexLike = require_lib89();
    var real = require_lib101();
    var imag = require_lib102();
    function fromArray(buf, arr) {
      var len;
      var v;
      var i;
      var j;
      len = arr.length;
      j = 0;
      for (i = 0; i < len; i++) {
        v = arr[i];
        if (!isComplexLike(v)) {
          return null;
        }
        buf[j] = real(v);
        buf[j + 1] = imag(v);
        j += 2;
      }
      return buf;
    }
    module.exports = fromArray;
  },
});

// node_modules/@stdlib/array-complex128/lib/main.js
var require_main104 = __commonJS({
  "node_modules/@stdlib/array-complex128/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib73().isPrimitive;
    var isArrayLikeObject = require_lib75();
    var isCollection = require_lib77();
    var isArrayBuffer = require_lib78();
    var isObject = require_lib79();
    var isArray = require_lib28();
    var isStringArray = require_lib81().primitives;
    var isString = require_lib80();
    var isFunction = require_lib85();
    var isComplexLike = require_lib89();
    var isEven = require_lib90();
    var isInteger = require_lib71();
    var isComplex64Array = require_lib91();
    var isComplex128Array = require_lib92();
    var hasIteratorSymbolSupport = require_lib93();
    var ITERATOR_SYMBOL = require_lib94();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib95();
    var Float64Array2 = require_lib36();
    var Complex128 = require_lib87();
    var real = require_lib101();
    var imag = require_lib102();
    var floor = require_lib70();
    var reinterpret64 = require_lib98();
    var reinterpret128 = require_lib99();
    var getter = require_lib27();
    var accessorGetter = require_lib26();
    var format = require_lib3();
    var fromIterator = require_from_iterator2();
    var fromIteratorMap = require_from_iterator_map2();
    var fromArray = require_from_array2();
    var BYTES_PER_ELEMENT = Float64Array2.BYTES_PER_ELEMENT * 2;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isComplexArray(value) {
      return (
        value instanceof Complex128Array ||
        (typeof value === "object" &&
          value !== null &&
          (value.constructor.name === "Complex64Array" ||
            value.constructor.name === "Complex128Array") &&
          typeof value._length === "number" && // eslint-disable-line no-underscore-dangle
          // NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
          typeof value._buffer === "object")
      );
    }
    function isComplexArrayConstructor(value) {
      return (
        value === Complex128Array || // NOTE: weaker test in order to avoid a circular dependency with Complex64Array...
        value.name === "Complex64Array"
      );
    }
    function getComplex128(buf, idx) {
      idx *= 2;
      return new Complex128(buf[idx], buf[idx + 1]);
    }
    function Complex128Array() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      nargs = arguments.length;
      if (!(this instanceof Complex128Array)) {
        if (nargs === 0) {
          return new Complex128Array();
        }
        if (nargs === 1) {
          return new Complex128Array(arguments[0]);
        }
        if (nargs === 2) {
          return new Complex128Array(arguments[0], arguments[1]);
        }
        return new Complex128Array(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Float64Array2(0);
      } else if (nargs === 1) {
        if (isNonNegativeInteger(arguments[0])) {
          buf = new Float64Array2(arguments[0] * 2);
        } else if (isCollection(arguments[0])) {
          buf = arguments[0];
          len = buf.length;
          if (len && isArray(buf) && isComplexLike(buf[0])) {
            buf = fromArray(new Float64Array2(len * 2), buf);
            if (buf === null) {
              if (!isEven(len)) {
                throw new RangeError(
                  format(
                    "invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.",
                    len,
                  ),
                );
              }
              buf = new Float64Array2(arguments[0]);
            }
          } else {
            if (isComplex64Array(buf)) {
              buf = reinterpret64(buf, 0);
            } else if (isComplex128Array(buf)) {
              buf = reinterpret128(buf, 0);
            } else if (!isEven(len)) {
              throw new RangeError(
                format(
                  "invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.",
                  len,
                ),
              );
            }
            buf = new Float64Array2(buf);
          }
        } else if (isArrayBuffer(arguments[0])) {
          buf = arguments[0];
          if (!isInteger(buf.byteLength / BYTES_PER_ELEMENT)) {
            throw new RangeError(
              format(
                "invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.",
                BYTES_PER_ELEMENT,
                buf.byteLength,
              ),
            );
          }
          buf = new Float64Array2(buf);
        } else if (isObject(arguments[0])) {
          buf = arguments[0];
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(
              format(
                "invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.",
                buf,
              ),
            );
          }
          if (!isFunction(buf[ITERATOR_SYMBOL])) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                buf,
              ),
            );
          }
          buf = buf[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                buf,
              ),
            );
          }
          buf = fromIterator(buf);
          if (buf instanceof Error) {
            throw buf;
          }
          buf = new Float64Array2(buf);
        } else {
          throw new TypeError(
            format(
              "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
              arguments[0],
            ),
          );
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an ArrayBuffer. Value: `%s`.",
              buf,
            ),
          );
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(
            format(
              "invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.",
              byteOffset,
            ),
          );
        }
        if (!isInteger(byteOffset / BYTES_PER_ELEMENT)) {
          throw new RangeError(
            format(
              "invalid argument. Byte offset must be a multiple of %u. Value: `%u`.",
              BYTES_PER_ELEMENT,
              byteOffset,
            ),
          );
        }
        if (nargs === 2) {
          len = buf.byteLength - byteOffset;
          if (!isInteger(len / BYTES_PER_ELEMENT)) {
            throw new RangeError(
              format(
                "invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.",
                BYTES_PER_ELEMENT,
                len,
              ),
            );
          }
          buf = new Float64Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(
              format(
                "invalid argument. Length must be a nonnegative integer. Value: `%s`.",
                len,
              ),
            );
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(
              format(
                "invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.",
                len * BYTES_PER_ELEMENT,
              ),
            );
          }
          buf = new Float64Array2(buf, byteOffset, len * 2);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length / 2);
      return this;
    }
    setReadOnly(Complex128Array, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(Complex128Array, "name", "Complex128Array");
    setReadOnly(Complex128Array, "from", function from(src) {
      var thisArg;
      var nargs;
      var clbk;
      var out;
      var buf;
      var tmp;
      var get;
      var len;
      var flg;
      var v;
      var i;
      var j;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a function. Value: `%s`.",
              clbk,
            ),
          );
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isComplexArray(src)) {
        len = src.length;
        if (clbk) {
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, src.get(i), i);
            if (isComplexLike(v)) {
              buf[j] = real(v);
              buf[j + 1] = imag(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(
                format(
                  "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
                  v,
                ),
              );
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          for (i = 0; i < len; i++) {
            if (!isComplexLike(get(src, i))) {
              flg = true;
              break;
            }
          }
          if (flg) {
            if (!isEven(len)) {
              throw new RangeError(
                format(
                  "invalid argument. First argument must have a length which is a multiple of two. Length: `%u`.",
                  len,
                ),
              );
            }
            out = new this(len / 2);
            buf = out._buffer;
            for (i = 0; i < len; i++) {
              buf[i] = clbk.call(thisArg, get(src, i), i);
            }
            return out;
          }
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, get(src, i), i);
            if (isComplexLike(v)) {
              buf[j] = real(v);
              buf[j + 1] = imag(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(
                format(
                  "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
                  v,
                ),
              );
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (
        isObject(src) &&
        HAS_ITERATOR_SYMBOL &&
        isFunction(src[ITERATOR_SYMBOL])
      ) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
              src,
            ),
          );
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        if (tmp instanceof Error) {
          throw tmp;
        }
        len = tmp.length / 2;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(
        format(
          "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
          src,
        ),
      );
    });
    setReadOnly(Complex128Array, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(Complex128Array.prototype, "at", function at(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide an integer. Value: `%s`.",
            idx,
          ),
        );
      }
      if (idx < 0) {
        idx += this._length;
      }
      if (idx < 0 || idx >= this._length) {
        return;
      }
      return getComplex128(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex128Array.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(
      Complex128Array.prototype,
      "byteLength",
      function get() {
        return this._buffer.byteLength;
      },
    );
    setReadOnlyAccessor(
      Complex128Array.prototype,
      "byteOffset",
      function get() {
        return this._buffer.byteOffset;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "BYTES_PER_ELEMENT",
      Complex128Array.BYTES_PER_ELEMENT,
    );
    setReadOnly(
      Complex128Array.prototype,
      "copyWithin",
      function copyWithin(target, start) {
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (arguments.length === 2) {
          this._buffer.copyWithin(target * 2, start * 2);
        } else {
          this._buffer.copyWithin(target * 2, start * 2, arguments[2] * 2);
        }
        return this;
      },
    );
    setReadOnly(Complex128Array.prototype, "entries", function entries() {
      var buffer;
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      buffer = this._buffer;
      len = this._length;
      i = -1;
      j = -2;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        var z;
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        j += 2;
        z = new Complex128(buffer[j], buffer[j + 1]);
        return {
          value: [i, z],
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(
      Complex128Array.prototype,
      "every",
      function every(predicate, thisArg) {
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (!predicate.call(thisArg, getComplex128(buf, i), i, this)) {
            return false;
          }
        }
        return true;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "fill",
      function fill(value, start, end) {
        var buf;
        var len;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(value)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              value,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          if (!isInteger(start)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                start,
              ),
            );
          }
          if (start < 0) {
            start += len;
            if (start < 0) {
              start = 0;
            }
          }
          if (arguments.length > 2) {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Third argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            }
            if (end > len) {
              end = len;
            }
          } else {
            end = len;
          }
        } else {
          start = 0;
          end = len;
        }
        re = real(value);
        im = imag(value);
        for (i = start; i < end; i++) {
          idx = 2 * i;
          buf[idx] = re;
          buf[idx + 1] = im;
        }
        return this;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "filter",
      function filter(predicate, thisArg) {
        var buf;
        var out;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          z = getComplex128(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            out.push(z);
          }
        }
        return new this.constructor(out);
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "find",
      function find(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex128(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return z;
          }
        }
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "findIndex",
      function findIndex(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex128(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "findLast",
      function findLast(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          z = getComplex128(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return z;
          }
        }
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "findLastIndex",
      function findLastIndex(predicate, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          z = getComplex128(buf, i);
          if (predicate.call(thisArg, z, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "forEach",
      function forEach(fcn, thisArg) {
        var buf;
        var i;
        var z;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(fcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              fcn,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          z = getComplex128(buf, i);
          fcn.call(thisArg, z, i, this);
        }
      },
    );
    setReadOnly(Complex128Array.prototype, "get", function get(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide a nonnegative integer. Value: `%s`.",
            idx,
          ),
        );
      }
      if (idx >= this._length) {
        return;
      }
      return getComplex128(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex128Array.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(
      Complex128Array.prototype,
      "includes",
      function includes(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        re = real(searchElement);
        im = imag(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "indexOf",
      function indexOf(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        re = real(searchElement);
        im = imag(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(Complex128Array.prototype, "join", function join(separator) {
      var out;
      var buf;
      var sep;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (arguments.length === 0) {
        sep = ",";
      } else if (isString(separator)) {
        sep = separator;
      } else {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a string. Value: `%s`.",
            separator,
          ),
        );
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex128(buf, i).toString());
      }
      return out.join(sep);
    });
    setReadOnly(Complex128Array.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: i,
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(
      Complex128Array.prototype,
      "lastIndexOf",
      function lastIndexOf(searchElement, fromIndex) {
        var buf;
        var idx;
        var re;
        var im;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isComplexLike(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a complex number. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex >= this._length) {
            fromIndex = this._length - 1;
          } else if (fromIndex < 0) {
            fromIndex += this._length;
          }
        } else {
          fromIndex = this._length - 1;
        }
        re = real(searchElement);
        im = imag(searchElement);
        buf = this._buffer;
        for (i = fromIndex; i >= 0; i--) {
          idx = 2 * i;
          if (re === buf[idx] && im === buf[idx + 1]) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(Complex128Array.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var buf;
      var out;
      var i;
      var v;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isFunction(fcn)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a function. Value: `%s`.",
            fcn,
          ),
        );
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        v = fcn.call(thisArg, getComplex128(buf, i), i, this);
        if (isComplexLike(v)) {
          outbuf[2 * i] = real(v);
          outbuf[2 * i + 1] = imag(v);
        } else if (isArrayLikeObject(v) && v.length === 2) {
          outbuf[2 * i] = v[0];
          outbuf[2 * i + 1] = v[1];
        } else {
          throw new TypeError(
            format(
              "invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.",
              v,
            ),
          );
        }
      }
      return out;
    });
    setReadOnly(
      Complex128Array.prototype,
      "reduce",
      function reduce(reducer, initialValue) {
        var buf;
        var acc;
        var len;
        var v;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = 0;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = getComplex128(buf, 0);
          i = 1;
        }
        for (; i < len; i++) {
          v = getComplex128(buf, i);
          acc = reducer(acc, v, i, this);
        }
        return acc;
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "reduceRight",
      function reduceRight(reducer, initialValue) {
        var buf;
        var acc;
        var len;
        var v;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = len - 1;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = getComplex128(buf, len - 1);
          i = len - 2;
        }
        for (; i >= 0; i--) {
          v = getComplex128(buf, i);
          acc = reducer(acc, v, i, this);
        }
        return acc;
      },
    );
    setReadOnly(Complex128Array.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      len = this._length;
      buf = this._buffer;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[2 * i];
        buf[2 * i] = buf[2 * j];
        buf[2 * j] = tmp;
        tmp = buf[2 * i + 1];
        buf[2 * i + 1] = buf[2 * j + 1];
        buf[2 * j + 1] = tmp;
      }
      return this;
    });
    setReadOnly(Complex128Array.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var flg;
      var N;
      var v;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(
            format(
              "invalid argument. Index argument must be a nonnegative integer. Value: `%s`.",
              idx,
            ),
          );
        }
      } else {
        idx = 0;
      }
      if (isComplexLike(value)) {
        if (idx >= this._length) {
          throw new RangeError(
            format(
              "invalid argument. Index argument is out-of-bounds. Value: `%u`.",
              idx,
            ),
          );
        }
        idx *= 2;
        buf[idx] = real(value);
        buf[idx + 1] = imag(value);
        return;
      }
      if (isComplexArray(value)) {
        N = value._length;
        if (idx + N > this._length) {
          throw new RangeError(
            "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
          );
        }
        sbuf = value._buffer;
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (
          sbuf.buffer === buf.buffer &&
          sbuf.byteOffset < j &&
          sbuf.byteOffset + sbuf.byteLength > j
        ) {
          tmp = new Float64Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        idx *= 2;
        j = 0;
        for (i = 0; i < N; i++) {
          buf[idx] = sbuf[j];
          buf[idx + 1] = sbuf[j + 1];
          idx += 2;
          j += 2;
        }
        return;
      }
      if (isCollection(value)) {
        N = value.length;
        for (i = 0; i < N; i++) {
          if (!isComplexLike(value[i])) {
            flg = true;
            break;
          }
        }
        if (flg) {
          if (!isEven(N)) {
            throw new RangeError(
              format(
                "invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.",
                N,
              ),
            );
          }
          if (idx + N / 2 > this._length) {
            throw new RangeError(
              "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
            );
          }
          sbuf = value;
          j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
          if (
            sbuf.buffer === buf.buffer &&
            sbuf.byteOffset < j &&
            sbuf.byteOffset + sbuf.byteLength > j
          ) {
            tmp = new Float64Array2(N);
            for (i = 0; i < N; i++) {
              tmp[i] = sbuf[i];
            }
            sbuf = tmp;
          }
          idx *= 2;
          N /= 2;
          j = 0;
          for (i = 0; i < N; i++) {
            buf[idx] = sbuf[j];
            buf[idx + 1] = sbuf[j + 1];
            idx += 2;
            j += 2;
          }
          return;
        }
        if (idx + N > this._length) {
          throw new RangeError(
            "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
          );
        }
        idx *= 2;
        for (i = 0; i < N; i++) {
          v = value[i];
          buf[idx] = real(v);
          buf[idx + 1] = imag(v);
          idx += 2;
        }
        return;
      }
      throw new TypeError(
        format(
          "invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.",
          value,
        ),
      );
    });
    setReadOnly(Complex128Array.prototype, "slice", function slice(start, end) {
      var outlen;
      var outbuf;
      var out;
      var idx;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        start = 0;
        end = len;
      } else {
        if (!isInteger(start)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              start,
            ),
          );
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                end,
              ),
            );
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (start < end) {
        outlen = end - start;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        idx = 2 * (i + start);
        outbuf[2 * i] = buf[idx];
        outbuf[2 * i + 1] = buf[idx + 1];
      }
      return out;
    });
    setReadOnly(
      Complex128Array.prototype,
      "some",
      function some(predicate, thisArg) {
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (predicate.call(thisArg, getComplex128(buf, i), i, this)) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(Complex128Array.prototype, "sort", function sort(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a function. Value: `%s`.",
            compareFcn,
          ),
        );
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex128(buf, i));
      }
      tmp.sort(compareFcn);
      for (i = 0; i < len; i++) {
        j = 2 * i;
        buf[j] = real(tmp[i]);
        buf[j + 1] = imag(tmp[i]);
      }
      return this;
    });
    setReadOnly(
      Complex128Array.prototype,
      "subarray",
      function subarray(begin, end) {
        var offset;
        var buf;
        var len;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length === 0) {
          begin = 0;
          end = len;
        } else {
          if (!isInteger(begin)) {
            throw new TypeError(
              format(
                "invalid argument. First argument must be an integer. Value: `%s`.",
                begin,
              ),
            );
          }
          if (begin < 0) {
            begin += len;
            if (begin < 0) {
              begin = 0;
            }
          }
          if (arguments.length === 1) {
            end = len;
          } else {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Second argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            } else if (end > len) {
              end = len;
            }
          }
        }
        if (begin >= len) {
          len = 0;
          offset = buf.byteLength;
        } else if (begin >= end) {
          len = 0;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        } else {
          len = end - begin;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        }
        return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
      },
    );
    setReadOnly(
      Complex128Array.prototype,
      "toLocaleString",
      function toLocaleString(locales, options) {
        var opts;
        var loc;
        var out;
        var buf;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (arguments.length === 0) {
          loc = [];
        } else if (isString(locales) || isStringArray(locales)) {
          loc = locales;
        } else {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a string or an array of strings. Value: `%s`.",
              locales,
            ),
          );
        }
        if (arguments.length < 2) {
          opts = {};
        } else if (isObject(options)) {
          opts = options;
        } else {
          throw new TypeError(
            format(
              "invalid argument. Options argument must be an object. Value: `%s`.",
              options,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          out.push(getComplex128(buf, i).toLocaleString(loc, opts));
        }
        return out.join(",");
      },
    );
    setReadOnly(Complex128Array.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        j = len - i - 1;
        outbuf[2 * i] = buf[2 * j];
        outbuf[2 * i + 1] = buf[2 * j + 1];
      }
      return out;
    });
    setReadOnly(
      Complex128Array.prototype,
      "toSorted",
      function toSorted(compareFcn) {
        var tmp;
        var buf;
        var len;
        var i;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isFunction(compareFcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              compareFcn,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        tmp = [];
        for (i = 0; i < len; i++) {
          tmp.push(getComplex128(buf, i));
        }
        tmp.sort(compareFcn);
        return new Complex128Array(tmp);
      },
    );
    setReadOnly(Complex128Array.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex128(buf, i).toString());
      }
      return out.join(",");
    });
    setReadOnly(Complex128Array.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a complex number array.",
        );
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: getComplex128(buf, i),
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(
      Complex128Array.prototype,
      "with",
      function copyWith(index, value) {
        var buf;
        var out;
        var len;
        if (!isComplexArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a complex number array.",
          );
        }
        if (!isInteger(index)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              index,
            ),
          );
        }
        len = this._length;
        if (index < 0) {
          index += len;
        }
        if (index < 0 || index >= len) {
          throw new RangeError(
            format(
              "invalid argument. Index argument is out-of-bounds. Value: `%s`.",
              index,
            ),
          );
        }
        if (!isComplexLike(value)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a complex number. Value: `%s`.",
              value,
            ),
          );
        }
        out = new this.constructor(this._buffer);
        buf = out._buffer;
        buf[2 * index] = real(value);
        buf[2 * index + 1] = imag(value);
        return out;
      },
    );
    module.exports = Complex128Array;
  },
});

// node_modules/@stdlib/array-complex128/lib/index.js
var require_lib103 = __commonJS({
  "node_modules/@stdlib/array-complex128/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main104();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-bool/lib/from_iterator.js
var require_from_iterator3 = __commonJS({
  "node_modules/@stdlib/array-bool/lib/from_iterator.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib82();
    function fromIterator(it) {
      var out;
      var v;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        out.push(Boolean2(v.value));
      }
      return out;
    }
    module.exports = fromIterator;
  },
});

// node_modules/@stdlib/array-bool/lib/from_iterator_map.js
var require_from_iterator_map3 = __commonJS({
  "node_modules/@stdlib/array-bool/lib/from_iterator_map.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib82();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        out.push(Boolean2(clbk.call(thisArg, v.value, i)));
      }
      return out;
    }
    module.exports = fromIteratorMap;
  },
});

// node_modules/@stdlib/array-bool/lib/from_array.js
var require_from_array3 = __commonJS({
  "node_modules/@stdlib/array-bool/lib/from_array.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib82();
    function fromArray(buf, arr) {
      var len;
      var i;
      len = arr.length;
      for (i = 0; i < len; i++) {
        buf[i] = Boolean2(arr[i]);
      }
      return buf;
    }
    module.exports = fromArray;
  },
});

// node_modules/@stdlib/array-bool/lib/main.js
var require_main105 = __commonJS({
  "node_modules/@stdlib/array-bool/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib73().isPrimitive;
    var isCollection = require_lib77();
    var isArrayBuffer = require_lib78();
    var isObject = require_lib79();
    var isFunction = require_lib85();
    var isBoolean = require_lib83().isPrimitive;
    var isInteger = require_lib72().isPrimitive;
    var isString = require_lib80().isPrimitive;
    var isStringArray = require_lib81().primitives;
    var hasIteratorSymbolSupport = require_lib93();
    var ITERATOR_SYMBOL = require_lib94();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib95();
    var Uint8Array2 = require_lib58();
    var Boolean2 = require_lib82();
    var getter = require_lib27();
    var floor = require_lib70();
    var accessorGetter = require_lib26();
    var format = require_lib3();
    var fromIterator = require_from_iterator3();
    var fromIteratorMap = require_from_iterator_map3();
    var fromArray = require_from_array3();
    var BYTES_PER_ELEMENT = Uint8Array2.BYTES_PER_ELEMENT;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isBooleanArray(value) {
      return (
        typeof value === "object" &&
        value !== null &&
        value.constructor.name === "BooleanArray" &&
        value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
      );
    }
    function isBooleanArrayConstructor(value) {
      return value === BooleanArray;
    }
    function BooleanArray() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      var arg;
      nargs = arguments.length;
      if (!(this instanceof BooleanArray)) {
        if (nargs === 0) {
          return new BooleanArray();
        }
        if (nargs === 1) {
          return new BooleanArray(arguments[0]);
        }
        if (nargs === 2) {
          return new BooleanArray(arguments[0], arguments[1]);
        }
        return new BooleanArray(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Uint8Array2(0);
      } else if (nargs === 1) {
        arg = arguments[0];
        if (isNonNegativeInteger(arg)) {
          buf = new Uint8Array2(arg);
        } else if (isCollection(arg)) {
          buf = fromArray(new Uint8Array2(arg.length), arg);
        } else if (isArrayBuffer(arg)) {
          buf = new Uint8Array2(arg);
        } else if (isObject(arg)) {
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(
              format(
                "invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.",
                arg,
              ),
            );
          }
          if (!isFunction(arg[ITERATOR_SYMBOL])) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                arg,
              ),
            );
          }
          buf = arg[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(
              format(
                "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
                arg,
              ),
            );
          }
          buf = new Uint8Array2(fromIterator(buf));
        } else {
          throw new TypeError(
            format(
              "invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.",
              arg,
            ),
          );
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an ArrayBuffer. Value: `%s`.",
              buf,
            ),
          );
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(
            format(
              "invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.",
              byteOffset,
            ),
          );
        }
        if (nargs === 2) {
          buf = new Uint8Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(
              format(
                "invalid argument. Length must be a nonnegative integer. Value: `%s`.",
                len,
              ),
            );
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(
              format(
                "invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.",
                len * BYTES_PER_ELEMENT,
              ),
            );
          }
          buf = new Uint8Array2(buf, byteOffset, len);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length);
      return this;
    }
    setReadOnly(BooleanArray, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(BooleanArray, "name", "BooleanArray");
    setReadOnly(BooleanArray, "from", function from(src) {
      var thisArg;
      var nargs;
      var clbk;
      var out;
      var buf;
      var tmp;
      var get;
      var len;
      var i;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isBooleanArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a function. Value: `%s`.",
              clbk,
            ),
          );
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          out = new this(len);
          buf = out._buffer;
          for (i = 0; i < len; i++) {
            buf[i] = Boolean2(clbk.call(thisArg, get(src, i), i));
          }
          return out;
        }
        return new this(src);
      }
      if (
        isObject(src) &&
        HAS_ITERATOR_SYMBOL &&
        isFunction(src[ITERATOR_SYMBOL])
      ) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
              src,
            ),
          );
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        len = tmp.length;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(
        format(
          "invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.",
          src,
        ),
      );
    });
    setReadOnly(BooleanArray, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError(
          "invalid invocation. `this` context must be a constructor.",
        );
      }
      if (!isBooleanArrayConstructor(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(BooleanArray.prototype, "at", function at(idx) {
      var buf;
      var len;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      if (!isInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide an integer. Value: `%s`.",
            idx,
          ),
        );
      }
      len = this._length;
      buf = this._buffer;
      if (idx < 0) {
        idx += len;
      }
      if (idx < 0 || idx >= len) {
        return;
      }
      return Boolean2(buf[idx]);
    });
    setReadOnlyAccessor(BooleanArray.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(BooleanArray.prototype, "byteLength", function get() {
      return this._buffer.byteLength;
    });
    setReadOnlyAccessor(BooleanArray.prototype, "byteOffset", function get() {
      return this._buffer.byteOffset;
    });
    setReadOnly(
      BooleanArray.prototype,
      "BYTES_PER_ELEMENT",
      BooleanArray.BYTES_PER_ELEMENT,
    );
    setReadOnly(
      BooleanArray.prototype,
      "copyWithin",
      function copyWithin(target, start) {
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (arguments.length === 2) {
          this._buffer.copyWithin(target, start);
        } else {
          this._buffer.copyWithin(target, start, arguments[2]);
        }
        return this;
      },
    );
    setReadOnly(BooleanArray.prototype, "entries", function entries() {
      var self2;
      var iter;
      var len;
      var buf;
      var FLG;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: [i, Boolean2(buf[i])],
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(
      BooleanArray.prototype,
      "every",
      function every(predicate, thisArg) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (!predicate.call(thisArg, Boolean2(buf[i]), i, this)) {
            return false;
          }
        }
        return true;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "fill",
      function fill(value, start, end) {
        var buf;
        var len;
        var val;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isBoolean(value)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a boolean. Value: `%s`.",
              value,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          if (!isInteger(start)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                start,
              ),
            );
          }
          if (start < 0) {
            start += len;
            if (start < 0) {
              start = 0;
            }
          }
          if (arguments.length > 2) {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Third argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            }
            if (end > len) {
              end = len;
            }
          } else {
            end = len;
          }
        } else {
          start = 0;
          end = len;
        }
        if (value) {
          val = 1;
        } else {
          val = 0;
        }
        for (i = start; i < end; i++) {
          buf[i] = val;
        }
        return this;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "filter",
      function filter(predicate, thisArg) {
        var buf;
        var out;
        var i;
        var v;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          v = Boolean2(buf[i]);
          if (predicate.call(thisArg, v, i, this)) {
            out.push(v);
          }
        }
        return new this.constructor(out);
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "find",
      function find(predicate, thisArg) {
        var buf;
        var v;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          v = Boolean2(buf[i]);
          if (predicate.call(thisArg, v, i, this)) {
            return v;
          }
        }
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "findIndex",
      function findIndex(predicate, thisArg) {
        var buf;
        var v;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          v = Boolean2(buf[i]);
          if (predicate.call(thisArg, v, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "findLast",
      function findLast(predicate, thisArg) {
        var buf;
        var v;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          v = Boolean2(buf[i]);
          if (predicate.call(thisArg, v, i, this)) {
            return v;
          }
        }
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "findLastIndex",
      function findLastIndex(predicate, thisArg) {
        var buf;
        var v;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = this._length - 1; i >= 0; i--) {
          v = Boolean2(buf[i]);
          if (predicate.call(thisArg, v, i, this)) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "forEach",
      function forEach(fcn, thisArg) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(fcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              fcn,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          fcn.call(thisArg, Boolean2(buf[i]), i, this);
        }
      },
    );
    setReadOnly(BooleanArray.prototype, "get", function get(idx) {
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide a nonnegative integer. Value: `%s`.",
            idx,
          ),
        );
      }
      if (idx >= this._length) {
        return;
      }
      return Boolean2(this._buffer[idx]);
    });
    setReadOnly(
      BooleanArray.prototype,
      "includes",
      function includes(searchElement, fromIndex) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isBoolean(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a boolean. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          if (searchElement === Boolean2(buf[i])) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "indexOf",
      function indexOf(searchElement, fromIndex) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isBoolean(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a boolean. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex < 0) {
            fromIndex += this._length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }
        } else {
          fromIndex = 0;
        }
        buf = this._buffer;
        for (i = fromIndex; i < this._length; i++) {
          if (searchElement === Boolean2(buf[i])) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnly(BooleanArray.prototype, "join", function join(separator) {
      var buf;
      var out;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      if (arguments.length > 0) {
        if (!isString(separator)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a string. Value: `%s`.",
              separator,
            ),
          );
        }
      } else {
        separator = ",";
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        if (buf[i]) {
          out.push("true");
        } else {
          out.push("false");
        }
      }
      return out.join(separator);
    });
    setReadOnly(BooleanArray.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: i,
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(
      BooleanArray.prototype,
      "lastIndexOf",
      function lastIndexOf(searchElement, fromIndex) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isBoolean(searchElement)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a boolean. Value: `%s`.",
              searchElement,
            ),
          );
        }
        if (arguments.length > 1) {
          if (!isInteger(fromIndex)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                fromIndex,
              ),
            );
          }
          if (fromIndex >= this._length) {
            fromIndex = this._length - 1;
          } else if (fromIndex < 0) {
            fromIndex += this._length;
          }
        } else {
          fromIndex = this._length - 1;
        }
        buf = this._buffer;
        for (i = fromIndex; i >= 0; i--) {
          if (searchElement === Boolean2(buf[i])) {
            return i;
          }
        }
        return -1;
      },
    );
    setReadOnlyAccessor(BooleanArray.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(BooleanArray.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var out;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      if (!isFunction(fcn)) {
        throw new TypeError(
          "invalid argument. First argument must be a function. Value: `%s`.",
          fcn,
        );
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        outbuf[i] = Boolean2(fcn.call(thisArg, Boolean2(buf[i]), i, this));
      }
      return out;
    });
    setReadOnly(
      BooleanArray.prototype,
      "reduce",
      function reduce(reducer, initialValue) {
        var buf;
        var len;
        var acc;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = 0;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = Boolean2(buf[0]);
          i = 1;
        }
        for (; i < len; i++) {
          acc = reducer(acc, Boolean2(buf[i]), i, this);
        }
        return acc;
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "reduceRight",
      function reduceRight(reducer, initialValue) {
        var buf;
        var len;
        var acc;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(reducer)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              reducer,
            ),
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length > 1) {
          acc = initialValue;
          i = len - 1;
        } else {
          if (len === 0) {
            throw new Error(
              "invalid operation. If not provided an initial value, an array must contain at least one element.",
            );
          }
          acc = Boolean2(buf[len - 1]);
          i = len - 2;
        }
        for (; i >= 0; i--) {
          acc = reducer(acc, Boolean2(buf[i]), i, this);
        }
        return acc;
      },
    );
    setReadOnly(BooleanArray.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      buf = this._buffer;
      len = this._length;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[i];
        buf[i] = buf[j];
        buf[j] = tmp;
      }
      return this;
    });
    setReadOnly(BooleanArray.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var N;
      var i;
      var j;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(
            format(
              "invalid argument. Index argument must be a nonnegative integer. Value: `%s`.",
              idx,
            ),
          );
        }
      } else {
        idx = 0;
      }
      if (isCollection(value)) {
        N = value.length;
        if (idx + N > this._length) {
          throw new RangeError(
            "invalid arguments. Target array lacks sufficient storage to accommodate source values.",
          );
        }
        if (isBooleanArray(value)) {
          sbuf = value._buffer;
        } else {
          sbuf = value;
        }
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (
          sbuf.buffer === buf.buffer &&
          sbuf.byteOffset < j &&
          sbuf.byteOffset + sbuf.byteLength > j
        ) {
          tmp = new Uint8Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        for (i = 0; i < N; idx++, i++) {
          buf[idx] = sbuf[i] ? 1 : 0;
        }
        return;
      }
      if (idx >= this._length) {
        throw new RangeError(
          format(
            "invalid argument. Index argument is out-of-bounds. Value: `%u`.",
            idx,
          ),
        );
      }
      buf[idx] = value ? 1 : 0;
    });
    setReadOnly(BooleanArray.prototype, "slice", function slice(begin, end) {
      var outlen;
      var outbuf;
      var out;
      var buf;
      var len;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        begin = 0;
        end = len;
      } else {
        if (!isInteger(begin)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              begin,
            ),
          );
        }
        if (begin < 0) {
          begin += len;
          if (begin < 0) {
            begin = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(
              format(
                "invalid argument. Second argument must be an integer. Value: `%s`.",
                end,
              ),
            );
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (begin < end) {
        outlen = end - begin;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        outbuf[i] = buf[i + begin];
      }
      return out;
    });
    setReadOnly(
      BooleanArray.prototype,
      "some",
      function some(predicate, thisArg) {
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isFunction(predicate)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              predicate,
            ),
          );
        }
        buf = this._buffer;
        for (i = 0; i < this._length; i++) {
          if (predicate.call(thisArg, Boolean2(buf[i]), i, this)) {
            return true;
          }
        }
        return false;
      },
    );
    setReadOnly(BooleanArray.prototype, "sort", function sort(compareFcn) {
      var buf;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      buf = this._buffer;
      if (arguments.length === 0) {
        buf.sort();
        return this;
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a function. Value: `%s`.",
            compareFcn,
          ),
        );
      }
      buf.sort(compare);
      return this;
      function compare(a, b) {
        return compareFcn(Boolean2(a), Boolean2(b));
      }
    });
    setReadOnly(
      BooleanArray.prototype,
      "subarray",
      function subarray(begin, end) {
        var offset;
        var buf;
        var len;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        buf = this._buffer;
        len = this._length;
        if (arguments.length === 0) {
          begin = 0;
          end = len;
        } else {
          if (!isInteger(begin)) {
            throw new TypeError(
              format(
                "invalid argument. First argument must be an integer. Value: `%s`.",
                begin,
              ),
            );
          }
          if (begin < 0) {
            begin += len;
            if (begin < 0) {
              begin = 0;
            }
          }
          if (arguments.length === 1) {
            end = len;
          } else {
            if (!isInteger(end)) {
              throw new TypeError(
                format(
                  "invalid argument. Second argument must be an integer. Value: `%s`.",
                  end,
                ),
              );
            }
            if (end < 0) {
              end += len;
              if (end < 0) {
                end = 0;
              }
            } else if (end > len) {
              end = len;
            }
          }
        }
        if (begin >= len) {
          len = 0;
          offset = buf.byteLength;
        } else if (begin >= end) {
          len = 0;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        } else {
          len = end - begin;
          offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
        }
        return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
      },
    );
    setReadOnly(
      BooleanArray.prototype,
      "toLocaleString",
      function toLocaleString(locales, options) {
        var opts;
        var loc;
        var out;
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (arguments.length === 0) {
          loc = [];
        } else if (isString(locales) || isStringArray(locales)) {
          loc = locales;
        } else {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a string or an array of strings. Value: `%s`.",
              locales,
            ),
          );
        }
        if (arguments.length < 2) {
          opts = {};
        } else if (isObject(options)) {
          opts = options;
        } else {
          throw new TypeError(
            format(
              "invalid argument. Options argument must be an object. Value: `%s`.",
              options,
            ),
          );
        }
        buf = this._buffer;
        out = [];
        for (i = 0; i < this._length; i++) {
          out.push(Boolean2(buf[i]).toLocaleString(loc, opts));
        }
        return out.join(",");
      },
    );
    setReadOnly(BooleanArray.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        outbuf[i] = buf[len - i - 1];
      }
      return out;
    });
    setReadOnly(
      BooleanArray.prototype,
      "toSorted",
      function toSorted(compareFcn) {
        var outbuf;
        var out;
        var len;
        var buf;
        var i;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        len = this._length;
        out = new this.constructor(len);
        buf = this._buffer;
        outbuf = out._buffer;
        for (i = 0; i < len; i++) {
          outbuf[i] = buf[i];
        }
        if (arguments.length === 0) {
          outbuf.sort();
          return out;
        }
        if (!isFunction(compareFcn)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be a function. Value: `%s`.",
              compareFcn,
            ),
          );
        }
        outbuf.sort(compare);
        return out;
        function compare(a, b) {
          return compareFcn(Boolean2(a), Boolean2(b));
        }
      },
    );
    setReadOnly(BooleanArray.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (buf[i]) {
          out.push("true");
        } else {
          out.push("false");
        }
      }
      return out.join(",");
    });
    setReadOnly(BooleanArray.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError(
          "invalid invocation. `this` is not a boolean array.",
        );
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            done: true,
          };
        }
        return {
          value: Boolean2(buf[i]),
          done: false,
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            value: value,
            done: true,
          };
        }
        return {
          done: true,
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(
      BooleanArray.prototype,
      "with",
      function copyWith(index, value) {
        var buf;
        var out;
        var len;
        if (!isBooleanArray(this)) {
          throw new TypeError(
            "invalid invocation. `this` is not a boolean array.",
          );
        }
        if (!isInteger(index)) {
          throw new TypeError(
            format(
              "invalid argument. First argument must be an integer. Value: `%s`.",
              index,
            ),
          );
        }
        len = this._length;
        if (index < 0) {
          index += len;
        }
        if (index < 0 || index >= len) {
          throw new RangeError(
            format(
              "invalid argument. Index argument is out-of-bounds. Value: `%s`.",
              index,
            ),
          );
        }
        if (!isBoolean(value)) {
          throw new TypeError(
            format(
              "invalid argument. Second argument must be a boolean. Value: `%s`.",
              value,
            ),
          );
        }
        out = new this.constructor(this._buffer);
        buf = out._buffer;
        if (value) {
          buf[index] = 1;
        } else {
          buf[index] = 0;
        }
        return out;
      },
    );
    module.exports = BooleanArray;
  },
});

// node_modules/@stdlib/array-bool/lib/index.js
var require_lib104 = __commonJS({
  "node_modules/@stdlib/array-bool/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main105();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-dtype/lib/ctors.js
var require_ctors = __commonJS({
  "node_modules/@stdlib/array-dtype/lib/ctors.js"(exports, module) {
    "use strict";
    var Float64Array2 = require_lib36();
    var Float32Array2 = require_lib15();
    var Uint32Array2 = require_lib40();
    var Int32Array2 = require_lib45();
    var Uint16Array2 = require_lib49();
    var Int16Array2 = require_lib54();
    var Uint8Array2 = require_lib58();
    var Uint8ClampedArray2 = require_lib61();
    var Int8Array2 = require_lib66();
    var Complex64Array = require_lib100();
    var Complex128Array = require_lib103();
    var BooleanArray = require_lib104();
    var CTORS = [
      Float64Array2,
      Float32Array2,
      Int32Array2,
      Uint32Array2,
      Int16Array2,
      Uint16Array2,
      Int8Array2,
      Uint8Array2,
      Uint8ClampedArray2,
      Complex64Array,
      Complex128Array,
      BooleanArray,
    ];
    module.exports = CTORS;
  },
});

// node_modules/@stdlib/array-dtype/lib/dtypes.js
var require_dtypes = __commonJS({
  "node_modules/@stdlib/array-dtype/lib/dtypes.js"(exports, module) {
    "use strict";
    var DTYPES = [
      "float64",
      "float32",
      "int32",
      "uint32",
      "int16",
      "uint16",
      "int8",
      "uint8",
      "uint8c",
      "complex64",
      "complex128",
      "bool",
    ];
    module.exports = DTYPES;
  },
});

// node_modules/@stdlib/array-dtype/lib/main.js
var require_main106 = __commonJS({
  "node_modules/@stdlib/array-dtype/lib/main.js"(exports, module) {
    "use strict";
    var isBuffer = require_lib31();
    var isArray = require_lib28();
    var constructorName = require_lib33();
    var ctor2dtype = require_ctor2dtype();
    var CTORS = require_ctors();
    var DTYPES = require_dtypes();
    var NTYPES = DTYPES.length;
    function dtype(value) {
      var i;
      if (isArray(value)) {
        return "generic";
      }
      if (isBuffer(value)) {
        return null;
      }
      for (i = 0; i < NTYPES; i++) {
        if (value instanceof CTORS[i]) {
          return DTYPES[i];
        }
      }
      return ctor2dtype[constructorName(value)] || null;
    }
    module.exports = dtype;
  },
});

// node_modules/@stdlib/array-dtype/lib/index.js
var require_lib105 = __commonJS({
  "node_modules/@stdlib/array-dtype/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main106();
    module.exports = main;
  },
});

// node_modules/@stdlib/array-base-assert-contains/lib/main.js
var require_main107 = __commonJS({
  "node_modules/@stdlib/array-base-assert-contains/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isAccessorArray = require_lib25();
    var accessorGetter = require_lib26();
    var getter = require_lib27();
    var dtype = require_lib105();
    function contains(x, value) {
      var len;
      var get;
      var dt;
      var i;
      dt = dtype(x);
      if (isAccessorArray(x)) {
        get = accessorGetter(dt);
      } else {
        get = getter(dt);
      }
      len = x.length;
      for (i = 0; i < len; i++) {
        if (get(x, i) === value) {
          return true;
        }
      }
      return false;
    }
    module.exports = contains;
  },
});

// node_modules/@stdlib/array-base-assert-contains/lib/factory.js
var require_factory = __commonJS({
  "node_modules/@stdlib/array-base-assert-contains/lib/factory.js"(
    exports,
    module,
  ) {
    "use strict";
    var isCollection = require_lib77();
    var isAccessorArray = require_lib25();
    var accessorGetter = require_lib26();
    var dtype = require_lib105();
    var format = require_lib3();
    function factory(x) {
      var get;
      var len;
      var dt;
      if (!isCollection(x)) {
        throw new TypeError(
          format(
            "invalid argument. Must provide an array-like object. Value: `%s`.",
            x,
          ),
        );
      }
      dt = dtype(x);
      if (isAccessorArray(x)) {
        get = accessorGetter(dt);
      }
      len = x.length;
      return get === void 0 ? contains : accessors;
      function contains(value) {
        var i;
        for (i = 0; i < len; i++) {
          if (x[i] === value) {
            return true;
          }
        }
        return false;
      }
      function accessors(value) {
        var i;
        for (i = 0; i < len; i++) {
          if (get(x, i) === value) {
            return true;
          }
        }
        return false;
      }
    }
    module.exports = factory;
  },
});

// node_modules/@stdlib/array-base-assert-contains/lib/index.js
var require_lib106 = __commonJS({
  "node_modules/@stdlib/array-base-assert-contains/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main107();
    var factory = require_factory();
    setReadOnly(main, "factory", factory);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-layouts/lib/data.json
var require_data = __commonJS({
  "node_modules/@stdlib/blas-base-layouts/lib/data.json"(exports, module) {
    module.exports = ["row-major", "column-major"];
  },
});

// node_modules/@stdlib/blas-base-layouts/lib/main.js
var require_main108 = __commonJS({
  "node_modules/@stdlib/blas-base-layouts/lib/main.js"(exports, module) {
    "use strict";
    var DATA = require_data();
    function layouts() {
      return DATA.slice();
    }
    module.exports = layouts;
  },
});

// node_modules/@stdlib/blas-base-layouts/lib/enum.js
var require_enum = __commonJS({
  "node_modules/@stdlib/blas-base-layouts/lib/enum.js"(exports, module) {
    "use strict";
    function enumerated() {
      return {
        // Row-major (C-style):
        "row-major": 101,
        // Column-major (Fortran-style):
        "column-major": 102,
      };
    }
    module.exports = enumerated;
  },
});

// node_modules/@stdlib/blas-base-layouts/lib/index.js
var require_lib107 = __commonJS({
  "node_modules/@stdlib/blas-base-layouts/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main108();
    var enumeration = require_enum();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-assert-is-layout/lib/main.js
var require_main109 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-layout/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var contains = require_lib106().factory;
    var layouts = require_lib107();
    var isLayout = contains(layouts());
    module.exports = isLayout;
  },
});

// node_modules/@stdlib/blas-base-assert-is-layout/lib/index.js
var require_lib108 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-layout/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main109();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-transpose-operations/lib/data.json
var require_data2 = __commonJS({
  "node_modules/@stdlib/blas-base-transpose-operations/lib/data.json"(
    exports,
    module,
  ) {
    module.exports = ["no-transpose", "transpose", "conjugate-transpose"];
  },
});

// node_modules/@stdlib/blas-base-transpose-operations/lib/main.js
var require_main110 = __commonJS({
  "node_modules/@stdlib/blas-base-transpose-operations/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var DATA = require_data2();
    function layouts() {
      return DATA.slice();
    }
    module.exports = layouts;
  },
});

// node_modules/@stdlib/blas-base-transpose-operations/lib/enum.js
var require_enum2 = __commonJS({
  "node_modules/@stdlib/blas-base-transpose-operations/lib/enum.js"(
    exports,
    module,
  ) {
    "use strict";
    function enumerated() {
      return {
        // No transposition:
        "no-transpose": 111,
        // Transposition:
        transpose: 112,
        // Conjugate transposition:
        "conjugate-transpose": 113,
      };
    }
    module.exports = enumerated;
  },
});

// node_modules/@stdlib/blas-base-transpose-operations/lib/index.js
var require_lib109 = __commonJS({
  "node_modules/@stdlib/blas-base-transpose-operations/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main110();
    var enumeration = require_enum2();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-assert-is-transpose-operation/lib/main.js
var require_main111 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-transpose-operation/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var contains = require_lib106().factory;
    var ops = require_lib109();
    var isTransposeOperation = contains(ops());
    module.exports = isTransposeOperation;
  },
});

// node_modules/@stdlib/blas-base-assert-is-transpose-operation/lib/index.js
var require_lib110 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-transpose-operation/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main111();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-column-major-string/lib/main.js
var require_main112 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-column-major-string/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    function isColumnMajorString(v) {
      return v === "column-major";
    }
    module.exports = isColumnMajorString;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-column-major-string/lib/index.js
var require_lib111 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-column-major-string/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main112();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-special-fast-max/lib/main.js
var require_main113 = __commonJS({
  "node_modules/@stdlib/math-base-special-fast-max/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    function max(x, y) {
      if (x > y) {
        return x;
      }
      return y;
    }
    module.exports = max;
  },
});

// node_modules/@stdlib/math-base-special-fast-max/lib/index.js
var require_lib112 = __commonJS({
  "node_modules/@stdlib/math-base-special-fast-max/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var max = require_main113();
    module.exports = max;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-row-major/lib/main.js
var require_main114 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-row-major/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var abs = require_lib18();
    function isRowMajor(strides) {
      var ndims;
      var s1;
      var s2;
      var i;
      ndims = strides.length;
      if (ndims === 0) {
        return false;
      }
      s1 = abs(strides[0]);
      for (i = 1; i < ndims; i++) {
        s2 = abs(strides[i]);
        if (s2 > s1) {
          return false;
        }
        s1 = s2;
      }
      return true;
    }
    module.exports = isRowMajor;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-row-major/lib/index.js
var require_lib113 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-row-major/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main114();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-ext-base-sfill/lib/ndarray.js
var require_ndarray19 = __commonJS({
  "node_modules/@stdlib/blas-ext-base-sfill/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 8;
    function sfill(N, alpha, x, strideX, offsetX) {
      var ix;
      var m;
      var i;
      if (N <= 0) {
        return x;
      }
      ix = offsetX;
      if (strideX === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            x[ix] = alpha;
            ix += strideX;
          }
        }
        if (N < M) {
          return x;
        }
        for (i = m; i < N; i += M) {
          x[ix] = alpha;
          x[ix + 1] = alpha;
          x[ix + 2] = alpha;
          x[ix + 3] = alpha;
          x[ix + 4] = alpha;
          x[ix + 5] = alpha;
          x[ix + 6] = alpha;
          x[ix + 7] = alpha;
          ix += M;
        }
        return x;
      }
      for (i = 0; i < N; i++) {
        x[ix] = alpha;
        ix += strideX;
      }
      return x;
    }
    module.exports = sfill;
  },
});

// node_modules/@stdlib/blas-ext-base-sfill/lib/sfill.js
var require_sfill = __commonJS({
  "node_modules/@stdlib/blas-ext-base-sfill/lib/sfill.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray19();
    function sfill(N, alpha, x, strideX) {
      return ndarray(N, alpha, x, strideX, stride2offset(N, strideX));
    }
    module.exports = sfill;
  },
});

// node_modules/@stdlib/blas-ext-base-sfill/lib/main.js
var require_main115 = __commonJS({
  "node_modules/@stdlib/blas-ext-base-sfill/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sfill = require_sfill();
    var ndarray = require_ndarray19();
    setReadOnly(sfill, "ndarray", ndarray);
    module.exports = sfill;
  },
});

// node_modules/@stdlib/blas-base-sgemv/lib/base.js
var require_base = __commonJS({
  "node_modules/@stdlib/blas-base-sgemv/lib/base.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    var isRowMajor = require_lib113();
    var sfill = require_main115().ndarray;
    var sscal = require_main6().ndarray;
    function isTransposed(str) {
      return str !== "no-transpose";
    }
    function sgemv(
      trans,
      M,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      var isrm;
      var xlen;
      var ylen;
      var tmp;
      var da0;
      var da1;
      var ix;
      var iy;
      var ia;
      var i1;
      var i0;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isTransposed(trans)) {
        xlen = M;
        ylen = N;
      } else {
        xlen = N;
        ylen = M;
      }
      if (beta === 0) {
        sfill(ylen, 0, y, strideY, offsetY);
      } else if (beta !== 1) {
        sscal(ylen, beta, y, strideY, offsetY);
      }
      if (alpha === 0) {
        return y;
      }
      if ((!isrm && !isTransposed(trans)) || (isrm && isTransposed(trans))) {
        if (isrm) {
          da0 = strideA2;
          da1 = strideA1 - ylen * strideA2;
        } else {
          da0 = strideA1;
          da1 = strideA2 - ylen * strideA1;
        }
        ia = offsetA;
        ix = offsetX;
        for (i1 = 0; i1 < xlen; i1++) {
          tmp = f32(alpha * x[ix]);
          if (tmp === 0) {
            ia += da0 * ylen;
          } else {
            iy = offsetY;
            for (i0 = 0; i0 < ylen; i0++) {
              y[iy] += f32(A[ia] * tmp);
              iy += strideY;
              ia += da0;
            }
          }
          ix += strideX;
          ia += da1;
        }
        return y;
      }
      if (isrm) {
        da0 = strideA2;
        da1 = strideA1 - xlen * strideA2;
      } else {
        da0 = strideA1;
        da1 = strideA2 - xlen * strideA1;
      }
      ia = offsetA;
      iy = offsetY;
      for (i1 = 0; i1 < ylen; i1++) {
        tmp = 0;
        ix = offsetX;
        for (i0 = 0; i0 < xlen; i0++) {
          tmp += f32(A[ia] * x[ix]);
          ix += strideX;
          ia += da0;
        }
        y[iy] += f32(alpha * tmp);
        iy += strideY;
        ia += da1;
      }
      return y;
    }
    module.exports = sgemv;
  },
});

// node_modules/@stdlib/blas-base-sgemv/lib/sgemv.js
var require_sgemv = __commonJS({
  "node_modules/@stdlib/blas-base-sgemv/lib/sgemv.js"(exports, module) {
    "use strict";
    var isLayout = require_lib108();
    var isMatrixTranspose = require_lib110();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base();
    function sgemv(
      order,
      trans,
      M,
      N,
      alpha,
      A,
      LDA,
      x,
      strideX,
      beta,
      y,
      strideY,
    ) {
      var iscm;
      var vala;
      var xlen;
      var ylen;
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTranspose(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      iscm = isColumnMajor(order);
      if (iscm) {
        vala = M;
      } else {
        vala = N;
      }
      if (LDA < max(1, vala)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            vala,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Twelfth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      if (trans === "no-transpose") {
        xlen = N;
        ylen = M;
      } else {
        xlen = M;
        ylen = N;
      }
      ox = stride2offset(xlen, strideX);
      oy = stride2offset(ylen, strideY);
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      return base(
        trans,
        M,
        N,
        alpha,
        A,
        sa1,
        sa2,
        0,
        x,
        strideX,
        ox,
        beta,
        y,
        strideY,
        oy,
      );
    }
    module.exports = sgemv;
  },
});

// node_modules/@stdlib/blas-base-sgemv/lib/ndarray.js
var require_ndarray20 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTranspose = require_lib110();
    var format = require_lib3();
    var base = require_base();
    function sgemv(
      trans,
      M,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      if (!isMatrixTranspose(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourteenth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      return base(
        trans,
        M,
        N,
        alpha,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
        beta,
        y,
        strideY,
        offsetY,
      );
    }
    module.exports = sgemv;
  },
});

// node_modules/@stdlib/blas-base-sgemv/lib/main.js
var require_main116 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sgemv = require_sgemv();
    var ndarray = require_ndarray20();
    setReadOnly(sgemv, "ndarray", ndarray);
    module.exports = sgemv;
  },
});

// node_modules/@stdlib/blas-ext-base-dfill/lib/ndarray.js
var require_ndarray21 = __commonJS({
  "node_modules/@stdlib/blas-ext-base-dfill/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 8;
    function dfill(N, alpha, x, strideX, offsetX) {
      var ix;
      var m;
      var i;
      if (N <= 0) {
        return x;
      }
      ix = offsetX;
      if (strideX === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            x[ix] = alpha;
            ix += strideX;
          }
        }
        if (N < M) {
          return x;
        }
        for (i = m; i < N; i += M) {
          x[ix] = alpha;
          x[ix + 1] = alpha;
          x[ix + 2] = alpha;
          x[ix + 3] = alpha;
          x[ix + 4] = alpha;
          x[ix + 5] = alpha;
          x[ix + 6] = alpha;
          x[ix + 7] = alpha;
          ix += M;
        }
        return x;
      }
      for (i = 0; i < N; i++) {
        x[ix] = alpha;
        ix += strideX;
      }
      return x;
    }
    module.exports = dfill;
  },
});

// node_modules/@stdlib/blas-ext-base-dfill/lib/dfill.js
var require_dfill = __commonJS({
  "node_modules/@stdlib/blas-ext-base-dfill/lib/dfill.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray21();
    function dfill(N, alpha, x, strideX) {
      return ndarray(N, alpha, x, strideX, stride2offset(N, strideX));
    }
    module.exports = dfill;
  },
});

// node_modules/@stdlib/blas-ext-base-dfill/lib/main.js
var require_main117 = __commonJS({
  "node_modules/@stdlib/blas-ext-base-dfill/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dfill = require_dfill();
    var ndarray = require_ndarray21();
    setReadOnly(dfill, "ndarray", ndarray);
    module.exports = dfill;
  },
});

// node_modules/@stdlib/blas-base-dscal/lib/ndarray.js
var require_ndarray22 = __commonJS({
  "node_modules/@stdlib/blas-base-dscal/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 5;
    function dscal(N, alpha, x, stride, offset) {
      var ix;
      var m;
      var i;
      if (N <= 0 || alpha === 1) {
        return x;
      }
      ix = offset;
      if (stride === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            x[ix] *= alpha;
            ix += stride;
          }
        }
        if (N < M) {
          return x;
        }
        for (i = m; i < N; i += M) {
          x[ix] *= alpha;
          x[ix + 1] *= alpha;
          x[ix + 2] *= alpha;
          x[ix + 3] *= alpha;
          x[ix + 4] *= alpha;
          ix += M;
        }
        return x;
      }
      for (i = 0; i < N; i++) {
        x[ix] *= alpha;
        ix += stride;
      }
      return x;
    }
    module.exports = dscal;
  },
});

// node_modules/@stdlib/blas-base-dscal/lib/dscal.js
var require_dscal = __commonJS({
  "node_modules/@stdlib/blas-base-dscal/lib/dscal.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray22();
    function dscal(N, alpha, x, stride) {
      var ox = stride2offset(N, stride);
      return ndarray(N, alpha, x, stride, ox);
    }
    module.exports = dscal;
  },
});

// node_modules/@stdlib/blas-base-dscal/lib/main.js
var require_main118 = __commonJS({
  "node_modules/@stdlib/blas-base-dscal/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dscal = require_dscal();
    var ndarray = require_ndarray22();
    setReadOnly(dscal, "ndarray", ndarray);
    module.exports = dscal;
  },
});

// node_modules/@stdlib/blas-base-dgemv/lib/base.js
var require_base2 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var dfill = require_main117().ndarray;
    var dscal = require_main118().ndarray;
    function isTransposed(str) {
      return str !== "no-transpose";
    }
    function dgemv(
      trans,
      M,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      var isrm;
      var xlen;
      var ylen;
      var tmp;
      var da0;
      var da1;
      var ix;
      var iy;
      var ia;
      var i1;
      var i0;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isTransposed(trans)) {
        xlen = M;
        ylen = N;
      } else {
        xlen = N;
        ylen = M;
      }
      if (beta === 0) {
        dfill(ylen, 0, y, strideY, offsetY);
      } else if (beta !== 1) {
        dscal(ylen, beta, y, strideY, offsetY);
      }
      if (alpha === 0) {
        return y;
      }
      if ((!isrm && !isTransposed(trans)) || (isrm && isTransposed(trans))) {
        if (isrm) {
          da0 = strideA2;
          da1 = strideA1 - ylen * strideA2;
        } else {
          da0 = strideA1;
          da1 = strideA2 - ylen * strideA1;
        }
        ia = offsetA;
        ix = offsetX;
        for (i1 = 0; i1 < xlen; i1++) {
          tmp = alpha * x[ix];
          if (tmp === 0) {
            ia += da0 * ylen;
          } else {
            iy = offsetY;
            for (i0 = 0; i0 < ylen; i0++) {
              y[iy] += A[ia] * tmp;
              iy += strideY;
              ia += da0;
            }
          }
          ix += strideX;
          ia += da1;
        }
        return y;
      }
      if (isrm) {
        da0 = strideA2;
        da1 = strideA1 - xlen * strideA2;
      } else {
        da0 = strideA1;
        da1 = strideA2 - xlen * strideA1;
      }
      ia = offsetA;
      iy = offsetY;
      for (i1 = 0; i1 < ylen; i1++) {
        tmp = 0;
        ix = offsetX;
        for (i0 = 0; i0 < xlen; i0++) {
          tmp += A[ia] * x[ix];
          ix += strideX;
          ia += da0;
        }
        y[iy] += alpha * tmp;
        iy += strideY;
        ia += da1;
      }
      return y;
    }
    module.exports = dgemv;
  },
});

// node_modules/@stdlib/blas-base-dgemv/lib/dgemv.js
var require_dgemv = __commonJS({
  "node_modules/@stdlib/blas-base-dgemv/lib/dgemv.js"(exports, module) {
    "use strict";
    var isLayout = require_lib108();
    var isMatrixTranspose = require_lib110();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base2();
    function dgemv(
      order,
      trans,
      M,
      N,
      alpha,
      A,
      LDA,
      x,
      strideX,
      beta,
      y,
      strideY,
    ) {
      var iscm;
      var vala;
      var xlen;
      var ylen;
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTranspose(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      iscm = isColumnMajor(order);
      if (iscm) {
        vala = M;
      } else {
        vala = N;
      }
      if (LDA < max(1, vala)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            vala,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Twelfth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      if (trans === "no-transpose") {
        xlen = N;
        ylen = M;
      } else {
        xlen = M;
        ylen = N;
      }
      ox = stride2offset(xlen, strideX);
      oy = stride2offset(ylen, strideY);
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      return base(
        trans,
        M,
        N,
        alpha,
        A,
        sa1,
        sa2,
        0,
        x,
        strideX,
        ox,
        beta,
        y,
        strideY,
        oy,
      );
    }
    module.exports = dgemv;
  },
});

// node_modules/@stdlib/blas-base-dgemv/lib/ndarray.js
var require_ndarray23 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTranspose = require_lib110();
    var format = require_lib3();
    var base = require_base2();
    function dgemv(
      trans,
      M,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      if (!isMatrixTranspose(trans)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourteenth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      return base(
        trans,
        M,
        N,
        alpha,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
        beta,
        y,
        strideY,
        offsetY,
      );
    }
    module.exports = dgemv;
  },
});

// node_modules/@stdlib/blas-base-dgemv/lib/main.js
var require_main119 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dgemv = require_dgemv();
    var ndarray = require_ndarray23();
    setReadOnly(dgemv, "ndarray", ndarray);
    module.exports = dgemv;
  },
});

// node_modules/@stdlib/object-ctor/lib/main.js
var require_main120 = __commonJS({
  "node_modules/@stdlib/object-ctor/lib/main.js"(exports, module) {
    "use strict";
    var Obj = Object;
    module.exports = Obj;
  },
});

// node_modules/@stdlib/object-ctor/lib/index.js
var require_lib114 = __commonJS({
  "node_modules/@stdlib/object-ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main120();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/native.js
var require_native = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/native.js"(exports, module) {
    "use strict";
    var getProto = Object.getPrototypeOf;
    module.exports = getProto;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/proto.js
var require_proto = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/proto.js"(exports, module) {
    "use strict";
    function getProto(obj) {
      return obj.__proto__;
    }
    module.exports = getProto;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/polyfill.js
var require_polyfill14 = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/polyfill.js"(
    exports,
    module,
  ) {
    "use strict";
    var nativeClass = require_lib11();
    var Object2 = require_lib114();
    var getProto = require_proto();
    function getPrototypeOf(obj) {
      var proto = getProto(obj);
      if (proto || proto === null) {
        return proto;
      }
      if (nativeClass(obj.constructor) === "[object Function]") {
        return obj.constructor.prototype;
      }
      if (obj instanceof Object2) {
        return Object2.prototype;
      }
      return null;
    }
    module.exports = getPrototypeOf;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/detect.js
var require_detect = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/detect.js"(exports, module) {
    "use strict";
    var isFunction = require_lib85();
    var builtin = require_native();
    var polyfill = require_polyfill14();
    var getProto;
    if (isFunction(Object.getPrototypeOf)) {
      getProto = builtin;
    } else {
      getProto = polyfill;
    }
    module.exports = getProto;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/main.js
var require_main121 = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/main.js"(exports, module) {
    "use strict";
    var Object2 = require_lib114();
    var getProto = require_detect();
    function getPrototypeOf(value) {
      if (value === null || value === void 0) {
        return null;
      }
      value = Object2(value);
      return getProto(value);
    }
    module.exports = getPrototypeOf;
  },
});

// node_modules/@stdlib/utils-get-prototype-of/lib/index.js
var require_lib115 = __commonJS({
  "node_modules/@stdlib/utils-get-prototype-of/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main121();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-error/lib/main.js
var require_main122 = __commonJS({
  "node_modules/@stdlib/assert-is-error/lib/main.js"(exports, module) {
    "use strict";
    var getPrototypeOf = require_lib115();
    var nativeClass = require_lib11();
    function isError(value) {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      if (value instanceof Error) {
        return true;
      }
      while (value) {
        if (nativeClass(value) === "[object Error]") {
          return true;
        }
        value = getPrototypeOf(value);
      }
      return false;
    }
    module.exports = isError;
  },
});

// node_modules/@stdlib/assert-is-error/lib/index.js
var require_lib116 = __commonJS({
  "node_modules/@stdlib/assert-is-error/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main122();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-try-require/lib/main.js
var require_main123 = __commonJS({
  "node_modules/@stdlib/utils-try-require/lib/main.js"(exports, module) {
    "use strict";
    var isError = require_lib116();
    function tryRequire(id) {
      try {
        return __require(id);
      } catch (error) {
        if (isError(error)) {
          return error;
        }
        if (typeof error === "object") {
          return new Error(JSON.stringify(error));
        }
        return new Error(error.toString());
      }
    }
    module.exports = tryRequire;
  },
});

// node_modules/@stdlib/utils-try-require/lib/index.js
var require_lib117 = __commonJS({
  "node_modules/@stdlib/utils-try-require/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main123();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-assert-is-positive-zero/lib/main.js
var require_main124 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-positive-zero/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var PINF = require_lib13();
    function isPositiveZero(x) {
      return x === 0 && 1 / x === PINF;
    }
    module.exports = isPositiveZero;
  },
});

// node_modules/@stdlib/math-base-assert-is-positive-zero/lib/index.js
var require_lib118 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-positive-zero/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main124();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-assert-is-nan/lib/main.js
var require_main125 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-nan/lib/main.js"(exports, module) {
    "use strict";
    function isnan(x) {
      return x !== x;
    }
    module.exports = isnan;
  },
});

// node_modules/@stdlib/math-base-assert-is-nan/lib/index.js
var require_lib119 = __commonJS({
  "node_modules/@stdlib/math-base-assert-is-nan/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main125();
    module.exports = main;
  },
});

// node_modules/@stdlib/math-base-special-max/lib/main.js
var require_main126 = __commonJS({
  "node_modules/@stdlib/math-base-special-max/lib/main.js"(exports, module) {
    "use strict";
    var isPositiveZero = require_lib118();
    var isnan = require_lib119();
    var PINF = require_lib13();
    function max(x, y) {
      if (isnan(x) || isnan(y)) {
        return NaN;
      }
      if (x === PINF || y === PINF) {
        return PINF;
      }
      if (x === y && x === 0) {
        if (isPositiveZero(x)) {
          return x;
        }
        return y;
      }
      if (x > y) {
        return x;
      }
      return y;
    }
    module.exports = max;
  },
});

// node_modules/@stdlib/math-base-special-max/lib/index.js
var require_lib120 = __commonJS({
  "node_modules/@stdlib/math-base-special-max/lib/index.js"(exports, module) {
    "use strict";
    var max = require_main126();
    module.exports = max;
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/data.json
var require_data3 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/data.json"(
    exports,
    module,
  ) {
    module.exports = ["upper", "lower"];
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/main.js
var require_main127 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var DATA = require_data3();
    function matrixTriangles() {
      return DATA.slice();
    }
    module.exports = matrixTriangles;
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/enum.js
var require_enum3 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/enum.js"(
    exports,
    module,
  ) {
    "use strict";
    function enumerated() {
      return {
        // Upper triangular part of a matrix:
        upper: 121,
        // Lower triangular part of a matrix:
        lower: 122,
      };
    }
    module.exports = enumerated;
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/index.js
var require_lib121 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/node_modules/@stdlib/blas-base-matrix-triangles/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main127();
    var enumeration = require_enum3();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/lib/main.js
var require_main128 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var contains = require_lib106().factory;
    var matrixTriangles = require_lib121();
    var isMatrixTriangle = contains(matrixTriangles());
    module.exports = isMatrixTriangle;
  },
});

// node_modules/@stdlib/blas-base-assert-is-matrix-triangle/lib/index.js
var require_lib122 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-matrix-triangle/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main128();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-ssymv/lib/base.js
var require_base3 = __commonJS({
  "node_modules/@stdlib/blas-base-ssymv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var sfill = require_main115().ndarray;
    var sscal = require_main6().ndarray;
    var f32 = require_lib16();
    function ssymv(
      uplo,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      var isrm;
      var tmp1;
      var tmp2;
      var ix0;
      var iy0;
      var ix1;
      var iy1;
      var sa0;
      var sa1;
      var i1;
      var i0;
      var ia;
      if (beta !== 1) {
        if (beta === 0) {
          sfill(N, 0, y, strideY, offsetY);
        } else {
          sscal(N, beta, y, strideY, offsetY);
        }
      }
      if (alpha === 0) {
        return y;
      }
      isrm = isRowMajor([strideA1, strideA2]);
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      if ((!isrm && uplo === "upper") || (isrm && uplo === "lower")) {
        ix1 = offsetX;
        iy1 = offsetY;
        for (i1 = 0; i1 < N; i1++) {
          tmp1 = f32(alpha * x[ix1]);
          tmp2 = f32(0);
          ix0 = offsetX;
          iy0 = offsetY;
          ia = offsetA + sa1 * i1;
          for (i0 = 0; i0 < i1; i0++) {
            y[iy0] += f32(tmp1 * A[ia]);
            tmp2 = f32(tmp2 + f32(A[ia] * x[ix0]));
            ix0 += strideX;
            iy0 += strideY;
            ia += sa0;
          }
          y[iy1] += f32(f32(tmp1 * A[ia]) + f32(alpha * tmp2));
          ix1 += strideX;
          iy1 += strideY;
        }
        return y;
      }
      ix1 = offsetX;
      iy1 = offsetY;
      for (i1 = 0; i1 < N; i1++) {
        tmp1 = f32(alpha * x[ix1]);
        tmp2 = f32(0);
        ia = offsetA + sa1 * i1 + sa0 * i1;
        y[iy1] += f32(tmp1 * A[ia]);
        ix0 = ix1;
        iy0 = iy1;
        for (i0 = i1 + 1; i0 < N; i0++) {
          ix0 += strideX;
          iy0 += strideY;
          ia += sa0;
          y[iy0] += f32(tmp1 * A[ia]);
          tmp2 = f32(tmp2 + f32(A[ia] * x[ix0]));
        }
        y[iy1] += f32(alpha * tmp2);
        ix1 += strideX;
        iy1 += strideY;
      }
      return y;
    }
    module.exports = ssymv;
  },
});

// node_modules/@stdlib/blas-base-ssymv/lib/ssymv.js
var require_ssymv = __commonJS({
  "node_modules/@stdlib/blas-base-ssymv/lib/ssymv.js"(exports, module) {
    "use strict";
    var max = require_lib120();
    var stride2offset = require_lib6();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base3();
    function ssymv(
      order,
      uplo,
      N,
      alpha,
      A,
      LDA,
      x,
      strideX,
      beta,
      y,
      strideY,
    ) {
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eleventh argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      ox = stride2offset(N, strideX);
      oy = stride2offset(N, strideY);
      if (order === "column-major") {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      return base(
        uplo,
        N,
        alpha,
        A,
        sa1,
        sa2,
        0,
        x,
        strideX,
        ox,
        beta,
        y,
        strideY,
        oy,
      );
    }
    module.exports = ssymv;
  },
});

// node_modules/@stdlib/blas-base-ssymv/lib/ndarray.js
var require_ndarray24 = __commonJS({
  "node_modules/@stdlib/blas-base-ssymv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base3();
    function ssymv(
      uplo,
      N,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Thirteenth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      return base(
        uplo,
        N,
        alpha,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
        beta,
        y,
        strideY,
        offsetY,
      );
    }
    module.exports = ssymv;
  },
});

// node_modules/@stdlib/blas-base-ssymv/lib/main.js
var require_main129 = __commonJS({
  "node_modules/@stdlib/blas-base-ssymv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var ssymv = require_ssymv();
    var ndarray = require_ndarray24();
    setReadOnly(ssymv, "ndarray", ndarray);
    module.exports = ssymv;
  },
});

// node_modules/@stdlib/blas-base-ssymv/lib/index.js
var require_lib123 = __commonJS({
  "node_modules/@stdlib/blas-base-ssymv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main129();
    var ssymv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      ssymv = main;
    } else {
      ssymv = tmp;
    }
    module.exports = ssymv;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-row-major-string/lib/main.js
var require_main130 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-row-major-string/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    function isRowMajorString(v) {
      return v === "row-major";
    }
    module.exports = isRowMajorString;
  },
});

// node_modules/@stdlib/ndarray-base-assert-is-row-major-string/lib/index.js
var require_lib124 = __commonJS({
  "node_modules/@stdlib/ndarray-base-assert-is-row-major-string/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main130();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-dsymv/lib/dsymv.js
var require_dsymv = __commonJS({
  "node_modules/@stdlib/blas-base-dsymv/lib/dsymv.js"(exports, module) {
    "use strict";
    var dfill = require_main117();
    var dscal = require_main118();
    var max = require_lib120();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isRowMajor = require_lib124();
    var isColumnMajor = require_lib111();
    function dsymv(
      order,
      uplo,
      N,
      alpha,
      A,
      LDA,
      x,
      strideX,
      beta,
      y,
      strideY,
    ) {
      var temp1;
      var temp2;
      var jmin;
      var jmax;
      var ix;
      var iy;
      var jx;
      var jy;
      var ox;
      var oy;
      var sy;
      var i;
      var j;
      var k;
      if (!isLayout(order)) {
        throw new TypeError(
          "invalid argument. First argument must be a valid order. Value: `%s`.",
          order,
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
          uplo,
        );
      }
      if (N < 0) {
        throw new RangeError(
          "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
          N,
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          "invalid argument. Sixth argument must be greater than or equal to max(1,%d). Value: `%d`.",
          N,
          LDA,
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
          strideX,
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          "invalid argument. Eleventh argument must be non-zero. Value: `%d`.",
          strideY,
        );
      }
      if (N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      sy = strideY;
      if (beta !== 1) {
        if (beta === 0) {
          dfill(N, 0, y, strideY);
        } else {
          if (sy < 0) {
            sy = -sy;
          }
          dscal(N, beta, y, sy);
        }
      }
      if (alpha === 0) {
        return y;
      }
      if (strideX > 0) {
        ox = 0;
      } else {
        ox = (1 - N) * strideX;
      }
      if (strideY > 0) {
        oy = 0;
      } else {
        oy = (1 - N) * strideY;
      }
      if (
        (isRowMajor(order) && uplo === "upper") ||
        (isColumnMajor(order) && uplo === "lower")
      ) {
        ix = ox;
        iy = oy;
        for (i = 0; i < N; i++) {
          temp1 = alpha * x[ix];
          temp2 = 0;
          jmin = i + 1;
          jmax = N;
          jx = ox + jmin * strideX;
          jy = oy + jmin * strideY;
          y[iy] += temp1 * A[LDA * i + i];
          for (j = jmin; j < jmax; j++) {
            k = LDA * i + j;
            y[jy] += temp1 * A[k];
            temp2 += x[jx] * A[k];
            jx += strideX;
            jy += strideY;
          }
          y[iy] += alpha * temp2;
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      ix = ox + (N - 1) * strideX;
      iy = oy + (N - 1) * strideY;
      for (i = N - 1; i >= 0; i--) {
        temp1 = alpha * x[ix];
        temp2 = 0;
        jmin = 0;
        jmax = i;
        jx = ox + jmin * strideX;
        jy = oy + jmin * strideY;
        y[iy] += temp1 * A[LDA * i + i];
        for (j = jmin; j < jmax; j++) {
          k = LDA * i + j;
          y[jy] += temp1 * A[k];
          temp2 += x[jx] * A[k];
          jx += strideX;
          jy += strideY;
        }
        y[iy] += alpha * temp2;
        ix -= strideX;
        iy -= strideY;
      }
      return y;
    }
    module.exports = dsymv;
  },
});

// node_modules/@stdlib/blas-base-dsymv/lib/ndarray.js
var require_ndarray25 = __commonJS({
  "node_modules/@stdlib/blas-base-dsymv/lib/ndarray.js"(exports, module) {
    "use strict";
    var dfill = require_main117().ndarray;
    var dscal = require_main118().ndarray;
    var max = require_lib120();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isRowMajor = require_lib124();
    var isColumnMajor = require_lib111();
    function dsymv(
      order,
      uplo,
      N,
      alpha,
      A,
      LDA,
      x,
      strideX,
      offsetX,
      beta,
      y,
      strideY,
      offsetY,
    ) {
      var temp1;
      var temp2;
      var jmin;
      var jmax;
      var ix;
      var iy;
      var jx;
      var jy;
      var ox;
      var oy;
      var i;
      var j;
      var k;
      if (!isLayout(order)) {
        throw new TypeError(
          "invalid argument. First argument must be a valid order. Value: `%s`.",
          order,
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
          uplo,
        );
      }
      if (N < 0) {
        throw new RangeError(
          "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
          N,
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          "invalid argument. Sixth argument must be greater than or equal to max(1,%d). Value: `%d`.",
          N,
          LDA,
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
          strideX,
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          "invalid argument. Twelfth argument must be non-zero. Value: `%d`.",
          strideY,
        );
      }
      if (N === 0 || (alpha === 0 && beta === 1)) {
        return y;
      }
      if (beta !== 1) {
        if (beta === 0) {
          dfill(N, 0, y, strideY, offsetY);
        } else {
          dscal(N, beta, y, strideY, offsetY);
        }
      }
      if (alpha === 0) {
        return y;
      }
      ox = offsetX;
      oy = offsetY;
      if (
        (isRowMajor(order) && uplo === "upper") ||
        (isColumnMajor(order) && uplo === "lower")
      ) {
        ix = ox;
        iy = oy;
        for (i = 0; i < N; i++) {
          temp1 = alpha * x[ix];
          temp2 = 0;
          jmin = i + 1;
          jmax = N;
          jx = ox + jmin * strideX;
          jy = oy + jmin * strideY;
          y[iy] += temp1 * A[LDA * i + i];
          for (j = jmin; j < jmax; j++) {
            k = LDA * i + j;
            y[jy] += temp1 * A[k];
            temp2 += x[jx] * A[k];
            jx += strideX;
            jy += strideY;
          }
          y[iy] += alpha * temp2;
          ix += strideX;
          iy += strideY;
        }
        return y;
      }
      ix = ox + (N - 1) * strideX;
      iy = oy + (N - 1) * strideY;
      for (i = N - 1; i >= 0; i--) {
        temp1 = alpha * x[ix];
        temp2 = 0;
        jmin = 0;
        jmax = i;
        jx = ox + jmin * strideX;
        jy = oy + jmin * strideY;
        y[iy] += temp1 * A[LDA * i + i];
        for (j = jmin; j < jmax; j++) {
          k = LDA * i + j;
          y[jy] += temp1 * A[k];
          temp2 += x[jx] * A[k];
          jx += strideX;
          jy += strideY;
        }
        y[iy] += alpha * temp2;
        ix -= strideX;
        iy -= strideY;
      }
      return y;
    }
    module.exports = dsymv;
  },
});

// node_modules/@stdlib/blas-base-dsymv/lib/main.js
var require_main131 = __commonJS({
  "node_modules/@stdlib/blas-base-dsymv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dsymv = require_dsymv();
    var ndarray = require_ndarray25();
    setReadOnly(dsymv, "ndarray", ndarray);
    module.exports = dsymv;
  },
});

// node_modules/@stdlib/blas-base-dsymv/lib/index.js
var require_lib125 = __commonJS({
  "node_modules/@stdlib/blas-base-dsymv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main131();
    var dsymv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dsymv = main;
    } else {
      dsymv = tmp;
    }
    module.exports = dsymv;
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/data.json
var require_data4 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/data.json"(
    exports,
    module,
  ) {
    module.exports = ["non-unit", "unit"];
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/main.js
var require_main132 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var DATA = require_data4();
    function diagonalTypes() {
      return DATA.slice();
    }
    module.exports = diagonalTypes;
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/enum.js
var require_enum4 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/enum.js"(
    exports,
    module,
  ) {
    "use strict";
    function enumerated() {
      return {
        // Elements along a diagonal are not all equal to one:
        "non-unit": 131,
        // Elements along a diagonal are all equal to one:
        unit: 132,
      };
    }
    module.exports = enumerated;
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/index.js
var require_lib126 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/node_modules/@stdlib/blas-base-diagonal-types/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main132();
    var enumeration = require_enum4();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/lib/main.js
var require_main133 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var contains = require_lib106().factory;
    var diagonalTypes = require_lib126();
    var isDiagonalType = contains(diagonalTypes());
    module.exports = isDiagonalType;
  },
});

// node_modules/@stdlib/blas-base-assert-is-diagonal-type/lib/index.js
var require_lib127 = __commonJS({
  "node_modules/@stdlib/blas-base-assert-is-diagonal-type/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main133();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-strmv/lib/base.js
var require_base4 = __commonJS({
  "node_modules/@stdlib/blas-base-strmv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var f32 = require_lib16();
    function strmv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      var nonunit;
      var isrm;
      var tmp;
      var sa0;
      var sa1;
      var ix0;
      var ix1;
      var i0;
      var i1;
      var oa;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      nonunit = diag === "non-unit";
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if (
        (!isrm && trans === "no-transpose" && uplo === "upper") ||
        (isrm && trans !== "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            tmp = x[ix1];
            oa = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = 0; i0 < i1; i0++) {
              x[ix0] = f32(x[ix0] + f32(tmp * A[oa + sa0 * i0]));
              ix0 += strideX;
            }
            if (nonunit) {
              x[ix1] = f32(x[ix1] * A[oa + sa0 * i1]);
            }
          }
          ix1 += strideX;
        }
        return x;
      }
      if (
        (!isrm && trans === "no-transpose" && uplo === "lower") ||
        (isrm && trans !== "no-transpose" && uplo === "upper")
      ) {
        ox += (N - 1) * strideX;
        ix1 = ox;
        for (i1 = N - 1; i1 >= 0; i1--) {
          if (x[ix1] !== 0) {
            tmp = x[ix1];
            oa = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = N - 1; i0 > i1; i0--) {
              x[ix0] = f32(x[ix0] + f32(tmp * A[oa + sa0 * i0]));
              ix0 -= strideX;
            }
            if (nonunit) {
              x[ix1] = f32(x[ix1] * A[oa + sa0 * i1]);
            }
          }
          ix1 -= strideX;
        }
        return x;
      }
      if (
        (!isrm && trans !== "no-transpose" && uplo === "upper") ||
        (isrm && trans === "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox + (N - 1) * strideX;
        for (i1 = N - 1; i1 >= 0; i1--) {
          tmp = x[ix1];
          oa = offsetA + sa1 * i1;
          ix0 = ix1;
          if (nonunit) {
            tmp = f32(tmp * A[oa + sa0 * i1]);
          }
          for (i0 = i1 - 1; i0 >= 0; i0--) {
            ix0 -= strideX;
            tmp = f32(tmp + f32(x[ix0] * A[oa + sa0 * i0]));
          }
          x[ix1] = tmp;
          ix1 -= strideX;
        }
        return x;
      }
      ix1 = ox;
      for (i1 = 0; i1 < N; i1++) {
        tmp = x[ix1];
        oa = offsetA + sa1 * i1;
        ix0 = ix1;
        if (nonunit) {
          tmp = f32(tmp * A[oa + sa0 * i1]);
        }
        for (i0 = i1 + 1; i0 < N; i0++) {
          ix0 += strideX;
          tmp = f32(tmp + f32(x[ix0] * A[oa + sa0 * i0]));
        }
        x[ix1] = tmp;
        ix1 += strideX;
      }
      return x;
    }
    module.exports = strmv;
  },
});

// node_modules/@stdlib/blas-base-strmv/lib/strmv.js
var require_strmv = __commonJS({
  "node_modules/@stdlib/blas-base-strmv/lib/strmv.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var format = require_lib3();
    var base = require_base4();
    function strmv(order, uplo, trans, diag, N, A, LDA, x, strideX) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Fourth argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, trans, diag, N, A, sa1, sa2, 0, x, strideX, ox);
    }
    module.exports = strmv;
  },
});

// node_modules/@stdlib/blas-base-strmv/lib/ndarray.js
var require_ndarray26 = __commonJS({
  "node_modules/@stdlib/blas-base-strmv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var format = require_lib3();
    var base = require_base4();
    function strmv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      return base(
        uplo,
        trans,
        diag,
        N,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
      );
    }
    module.exports = strmv;
  },
});

// node_modules/@stdlib/blas-base-strmv/lib/main.js
var require_main134 = __commonJS({
  "node_modules/@stdlib/blas-base-strmv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var strmv = require_strmv();
    var ndarray = require_ndarray26();
    setReadOnly(strmv, "ndarray", ndarray);
    module.exports = strmv;
  },
});

// node_modules/@stdlib/blas-base-strmv/lib/index.js
var require_lib128 = __commonJS({
  "node_modules/@stdlib/blas-base-strmv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main134();
    var strmv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      strmv = main;
    } else {
      strmv = tmp;
    }
    module.exports = strmv;
  },
});

// node_modules/@stdlib/blas-base-dtrmv/lib/base.js
var require_base5 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrmv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function dtrmv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      var nonunit;
      var isrm;
      var tmp;
      var sa0;
      var sa1;
      var ix0;
      var ix1;
      var i0;
      var i1;
      var oa;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      nonunit = diag === "non-unit";
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if (
        (!isrm && trans === "no-transpose" && uplo === "upper") ||
        (isrm && trans !== "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            tmp = x[ix1];
            oa = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = 0; i0 < i1; i0++) {
              x[ix0] += tmp * A[oa + sa0 * i0];
              ix0 += strideX;
            }
            if (nonunit) {
              x[ix1] *= A[oa + sa0 * i1];
            }
          }
          ix1 += strideX;
        }
        return x;
      }
      if (
        (!isrm && trans === "no-transpose" && uplo === "lower") ||
        (isrm && trans !== "no-transpose" && uplo === "upper")
      ) {
        ox += (N - 1) * strideX;
        ix1 = ox;
        for (i1 = N - 1; i1 >= 0; i1--) {
          if (x[ix1] !== 0) {
            tmp = x[ix1];
            oa = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = N - 1; i0 > i1; i0--) {
              x[ix0] += tmp * A[oa + sa0 * i0];
              ix0 -= strideX;
            }
            if (nonunit) {
              x[ix1] *= A[oa + sa0 * i1];
            }
          }
          ix1 -= strideX;
        }
        return x;
      }
      if (
        (!isrm && trans !== "no-transpose" && uplo === "upper") ||
        (isrm && trans === "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox + (N - 1) * strideX;
        for (i1 = N - 1; i1 >= 0; i1--) {
          tmp = x[ix1];
          oa = offsetA + sa1 * i1;
          ix0 = ix1;
          if (nonunit) {
            tmp *= A[oa + sa0 * i1];
          }
          for (i0 = i1 - 1; i0 >= 0; i0--) {
            ix0 -= strideX;
            tmp += x[ix0] * A[oa + sa0 * i0];
          }
          x[ix1] = tmp;
          ix1 -= strideX;
        }
        return x;
      }
      ix1 = ox;
      for (i1 = 0; i1 < N; i1++) {
        tmp = x[ix1];
        oa = offsetA + sa1 * i1;
        ix0 = ix1;
        if (nonunit) {
          tmp *= A[oa + sa0 * i1];
        }
        for (i0 = i1 + 1; i0 < N; i0++) {
          ix0 += strideX;
          tmp += x[ix0] * A[oa + sa0 * i0];
        }
        x[ix1] = tmp;
        ix1 += strideX;
      }
      return x;
    }
    module.exports = dtrmv;
  },
});

// node_modules/@stdlib/blas-base-dtrmv/lib/dtrmv.js
var require_dtrmv = __commonJS({
  "node_modules/@stdlib/blas-base-dtrmv/lib/dtrmv.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var format = require_lib3();
    var base = require_base5();
    function dtrmv(order, uplo, trans, diag, N, A, LDA, x, strideX) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Fourth argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, trans, diag, N, A, sa1, sa2, 0, x, strideX, ox);
    }
    module.exports = dtrmv;
  },
});

// node_modules/@stdlib/blas-base-dtrmv/lib/ndarray.js
var require_ndarray27 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrmv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var format = require_lib3();
    var base = require_base5();
    function dtrmv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      return base(
        uplo,
        trans,
        diag,
        N,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
      );
    }
    module.exports = dtrmv;
  },
});

// node_modules/@stdlib/blas-base-dtrmv/lib/main.js
var require_main135 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrmv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dtrmv = require_dtrmv();
    var ndarray = require_ndarray27();
    setReadOnly(dtrmv, "ndarray", ndarray);
    module.exports = dtrmv;
  },
});

// node_modules/@stdlib/blas-base-dtrmv/lib/index.js
var require_lib129 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrmv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main135();
    var dtrmv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dtrmv = main;
    } else {
      dtrmv = tmp;
    }
    module.exports = dtrmv;
  },
});

// node_modules/@stdlib/blas-base-strsv/lib/base.js
var require_base6 = __commonJS({
  "node_modules/@stdlib/blas-base-strsv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var f32 = require_lib16();
    function strsv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      var nonunit;
      var isrm;
      var tmp;
      var sa0;
      var sa1;
      var ix0;
      var ix1;
      var i0;
      var i1;
      var oa;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      nonunit = diag === "non-unit";
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if (
        (!isrm && trans === "no-transpose" && uplo === "upper") ||
        (isrm && trans !== "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox + (N - 1) * strideX;
        for (i1 = N - 1; i1 >= 0; i1--) {
          if (x[ix1] !== 0) {
            oa = offsetA + sa1 * i1;
            if (nonunit) {
              x[ix1] = f32(x[ix1] / A[oa + sa0 * i1]);
            }
            tmp = x[ix1];
            ix0 = ix1;
            for (i0 = i1 - 1; i0 >= 0; i0--) {
              ix0 -= strideX;
              x[ix0] = f32(x[ix0] - f32(tmp * A[oa + sa0 * i0]));
            }
          }
          ix1 -= strideX;
        }
        return x;
      }
      if (
        (!isrm && trans === "no-transpose" && uplo === "lower") ||
        (isrm && trans !== "no-transpose" && uplo === "upper")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            oa = offsetA + sa1 * i1;
            if (nonunit) {
              x[ix1] = f32(x[ix1] / A[oa + sa0 * i1]);
            }
            tmp = x[ix1];
            ix0 = ix1;
            for (i0 = i1 + 1; i0 < N; i0++) {
              ix0 += strideX;
              x[ix0] = f32(x[ix0] - f32(tmp * A[oa + sa0 * i0]));
            }
          }
          ix1 += strideX;
        }
        return x;
      }
      if (
        (!isrm && trans !== "no-transpose" && uplo === "upper") ||
        (isrm && trans === "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          tmp = x[ix1];
          oa = offsetA + sa1 * i1;
          ix0 = ox;
          for (i0 = 0; i0 <= i1 - 1; i0++) {
            tmp = f32(tmp - f32(x[ix0] * A[oa + sa0 * i0]));
            ix0 += strideX;
          }
          if (nonunit) {
            tmp = f32(tmp / A[oa + sa0 * i1]);
          }
          x[ix1] = tmp;
          ix1 += strideX;
        }
        return x;
      }
      ox += (N - 1) * strideX;
      ix1 = ox;
      for (i1 = N - 1; i1 >= 0; i1--) {
        tmp = x[ix1];
        oa = offsetA + sa1 * i1;
        ix0 = ox;
        for (i0 = N - 1; i0 > i1; i0--) {
          tmp = f32(tmp - f32(x[ix0] * A[oa + sa0 * i0]));
          ix0 -= strideX;
        }
        if (nonunit) {
          tmp = f32(tmp / A[oa + sa0 * i1]);
        }
        x[ix1] = tmp;
        ix1 -= strideX;
      }
      return x;
    }
    module.exports = strsv;
  },
});

// node_modules/@stdlib/blas-base-strsv/lib/strsv.js
var require_strsv = __commonJS({
  "node_modules/@stdlib/blas-base-strsv/lib/strsv.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var format = require_lib3();
    var base = require_base6();
    function strsv(order, uplo, trans, diag, N, A, LDA, x, strideX) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Fourth argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, trans, diag, N, A, sa1, sa2, 0, x, strideX, ox);
    }
    module.exports = strsv;
  },
});

// node_modules/@stdlib/blas-base-strsv/lib/ndarray.js
var require_ndarray28 = __commonJS({
  "node_modules/@stdlib/blas-base-strsv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var format = require_lib3();
    var base = require_base6();
    function strsv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      return base(
        uplo,
        trans,
        diag,
        N,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
      );
    }
    module.exports = strsv;
  },
});

// node_modules/@stdlib/blas-base-strsv/lib/main.js
var require_main136 = __commonJS({
  "node_modules/@stdlib/blas-base-strsv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var strsv = require_strsv();
    var ndarray = require_ndarray28();
    setReadOnly(strsv, "ndarray", ndarray);
    module.exports = strsv;
  },
});

// node_modules/@stdlib/blas-base-strsv/lib/index.js
var require_lib130 = __commonJS({
  "node_modules/@stdlib/blas-base-strsv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main136();
    var strsv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      strsv = main;
    } else {
      strsv = tmp;
    }
    module.exports = strsv;
  },
});

// node_modules/@stdlib/blas-base-dtrsv/lib/base.js
var require_base7 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrsv/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function dtrsv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      var nonunit;
      var isrm;
      var tmp;
      var sa0;
      var sa1;
      var ix0;
      var ix1;
      var i0;
      var i1;
      var oa;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      nonunit = diag === "non-unit";
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if (
        (!isrm && trans === "no-transpose" && uplo === "upper") ||
        (isrm && trans !== "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox + (N - 1) * strideX;
        for (i1 = N - 1; i1 >= 0; i1--) {
          if (x[ix1] !== 0) {
            oa = offsetA + sa1 * i1;
            if (nonunit) {
              x[ix1] /= A[oa + sa0 * i1];
            }
            tmp = x[ix1];
            ix0 = ix1;
            for (i0 = i1 - 1; i0 >= 0; i0--) {
              ix0 -= strideX;
              x[ix0] -= tmp * A[oa + sa0 * i0];
            }
          }
          ix1 -= strideX;
        }
        return x;
      }
      if (
        (!isrm && trans === "no-transpose" && uplo === "lower") ||
        (isrm && trans !== "no-transpose" && uplo === "upper")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            oa = offsetA + sa1 * i1;
            if (nonunit) {
              x[ix1] /= A[oa + sa0 * i1];
            }
            tmp = x[ix1];
            ix0 = ix1;
            for (i0 = i1 + 1; i0 < N; i0++) {
              ix0 += strideX;
              x[ix0] -= tmp * A[oa + sa0 * i0];
            }
          }
          ix1 += strideX;
        }
        return x;
      }
      if (
        (!isrm && trans !== "no-transpose" && uplo === "upper") ||
        (isrm && trans === "no-transpose" && uplo === "lower")
      ) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          tmp = x[ix1];
          oa = offsetA + sa1 * i1;
          ix0 = ox;
          for (i0 = 0; i0 <= i1 - 1; i0++) {
            tmp -= x[ix0] * A[oa + sa0 * i0];
            ix0 += strideX;
          }
          if (nonunit) {
            tmp /= A[oa + sa0 * i1];
          }
          x[ix1] = tmp;
          ix1 += strideX;
        }
        return x;
      }
      ox += (N - 1) * strideX;
      ix1 = ox;
      for (i1 = N - 1; i1 >= 0; i1--) {
        tmp = x[ix1];
        oa = offsetA + sa1 * i1;
        ix0 = ox;
        for (i0 = N - 1; i0 > i1; i0--) {
          tmp -= x[ix0] * A[oa + sa0 * i0];
          ix0 -= strideX;
        }
        if (nonunit) {
          tmp /= A[oa + sa0 * i1];
        }
        x[ix1] = tmp;
        ix1 -= strideX;
      }
      return x;
    }
    module.exports = dtrsv;
  },
});

// node_modules/@stdlib/blas-base-dtrsv/lib/dtrsv.js
var require_dtrsv = __commonJS({
  "node_modules/@stdlib/blas-base-dtrsv/lib/dtrsv.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var format = require_lib3();
    var base = require_base7();
    function dtrsv(order, uplo, trans, diag, N, A, LDA, x, strideX) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Fourth argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, trans, diag, N, A, sa1, sa2, 0, x, strideX, ox);
    }
    module.exports = dtrsv;
  },
});

// node_modules/@stdlib/blas-base-dtrsv/lib/ndarray.js
var require_ndarray29 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrsv/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var isTransposeOperation = require_lib110();
    var isDiagonal = require_lib127();
    var format = require_lib3();
    var base = require_base7();
    function dtrsv(
      uplo,
      trans,
      diag,
      N,
      A,
      strideA1,
      strideA2,
      offsetA,
      x,
      strideX,
      offsetX,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether the lower or upper triangular matrix is supplied. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (!isTransposeOperation(trans)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            trans,
          ),
        );
      }
      if (!isDiagonal(diag)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid diagonal type. Value: `%s`.",
            diag,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventh argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (N === 0) {
        return x;
      }
      return base(
        uplo,
        trans,
        diag,
        N,
        A,
        strideA1,
        strideA2,
        offsetA,
        x,
        strideX,
        offsetX,
      );
    }
    module.exports = dtrsv;
  },
});

// node_modules/@stdlib/blas-base-dtrsv/lib/main.js
var require_main137 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrsv/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dtrsv = require_dtrsv();
    var ndarray = require_ndarray29();
    setReadOnly(dtrsv, "ndarray", ndarray);
    module.exports = dtrsv;
  },
});

// node_modules/@stdlib/blas-base-dtrsv/lib/index.js
var require_lib131 = __commonJS({
  "node_modules/@stdlib/blas-base-dtrsv/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main137();
    var dtrsv;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dtrsv = main;
    } else {
      dtrsv = tmp;
    }
    module.exports = dtrsv;
  },
});

// node_modules/@stdlib/blas-base-sger/lib/base.js
var require_base8 = __commonJS({
  "node_modules/@stdlib/blas-base-sger/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function sger(
      M,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var tmp;
      var da0;
      var da1;
      var S0;
      var S1;
      var sx;
      var sy;
      var ia;
      var ix;
      var iy;
      var i0;
      var i1;
      if (isRowMajor([strideA1, strideA2])) {
        S0 = N;
        S1 = M;
        da0 = strideA2;
        da1 = strideA1 - S0 * strideA2;
        tmp = x;
        x = y;
        y = tmp;
        tmp = strideX;
        strideX = strideY;
        strideY = tmp;
        tmp = offsetX;
        offsetX = offsetY;
        offsetY = tmp;
      } else {
        S0 = M;
        S1 = N;
        da0 = strideA1;
        da1 = strideA2 - S0 * strideA1;
      }
      sx = strideX;
      sy = strideY;
      ix = offsetX;
      iy = offsetY;
      ia = offsetA;
      for (i1 = 0; i1 < S1; i1++) {
        if (y[iy] === 0) {
          ia += da0 * S0;
        } else {
          tmp = alpha * y[iy];
          ix = offsetX;
          for (i0 = 0; i0 < S0; i0++) {
            A[ia] += x[ix] * tmp;
            ix += sx;
            ia += da0;
          }
        }
        iy += sy;
        ia += da1;
      }
      return A;
    }
    module.exports = sger;
  },
});

// node_modules/@stdlib/blas-base-sger/lib/sger.js
var require_sger = __commonJS({
  "node_modules/@stdlib/blas-base-sger/lib/sger.js"(exports, module) {
    "use strict";
    var isColumnMajor = require_lib111();
    var isLayout = require_lib108();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base8();
    function sger(order, M, N, alpha, x, strideX, y, strideY, A, LDA) {
      var iscm;
      var vala;
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      iscm = isColumnMajor(order);
      if (iscm) {
        vala = M;
      } else {
        vala = N;
      }
      if (LDA < max(1, vala)) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            vala,
            LDA,
          ),
        );
      }
      if (M === 0 || N === 0 || alpha === 0) {
        return A;
      }
      ox = stride2offset(M, strideX);
      oy = stride2offset(N, strideY);
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      return base(M, N, alpha, x, strideX, ox, y, strideY, oy, A, sa1, sa2, 0);
    }
    module.exports = sger;
  },
});

// node_modules/@stdlib/blas-base-sger/lib/ndarray.js
var require_ndarray30 = __commonJS({
  "node_modules/@stdlib/blas-base-sger/lib/ndarray.js"(exports, module) {
    "use strict";
    var format = require_lib3();
    var base = require_base8();
    function sger(
      M,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. First argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || alpha === 0) {
        return A;
      }
      return base(
        M,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        y,
        strideY,
        offsetY,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = sger;
  },
});

// node_modules/@stdlib/blas-base-sger/lib/main.js
var require_main138 = __commonJS({
  "node_modules/@stdlib/blas-base-sger/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sger = require_sger();
    var ndarray = require_ndarray30();
    setReadOnly(sger, "ndarray", ndarray);
    module.exports = sger;
  },
});

// node_modules/@stdlib/blas-base-dger/lib/base.js
var require_base9 = __commonJS({
  "node_modules/@stdlib/blas-base-dger/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function dger(
      M,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var tmp;
      var da0;
      var da1;
      var S0;
      var S1;
      var sx;
      var sy;
      var ia;
      var ix;
      var iy;
      var i0;
      var i1;
      if (isRowMajor([strideA1, strideA2])) {
        S0 = N;
        S1 = M;
        da0 = strideA2;
        da1 = strideA1 - S0 * strideA2;
        tmp = x;
        x = y;
        y = tmp;
        tmp = strideX;
        strideX = strideY;
        strideY = tmp;
        tmp = offsetX;
        offsetX = offsetY;
        offsetY = tmp;
      } else {
        S0 = M;
        S1 = N;
        da0 = strideA1;
        da1 = strideA2 - S0 * strideA1;
      }
      sx = strideX;
      sy = strideY;
      ix = offsetX;
      iy = offsetY;
      ia = offsetA;
      for (i1 = 0; i1 < S1; i1++) {
        if (y[iy] === 0) {
          ia += da0 * S0;
        } else {
          tmp = alpha * y[iy];
          ix = offsetX;
          for (i0 = 0; i0 < S0; i0++) {
            A[ia] += x[ix] * tmp;
            ix += sx;
            ia += da0;
          }
        }
        iy += sy;
        ia += da1;
      }
      return A;
    }
    module.exports = dger;
  },
});

// node_modules/@stdlib/blas-base-dger/lib/dger.js
var require_dger = __commonJS({
  "node_modules/@stdlib/blas-base-dger/lib/dger.js"(exports, module) {
    "use strict";
    var isColumnMajor = require_lib111();
    var isLayout = require_lib108();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base9();
    function dger(order, M, N, alpha, x, strideX, y, strideY, A, LDA) {
      var iscm;
      var vala;
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      iscm = isColumnMajor(order);
      if (iscm) {
        vala = M;
      } else {
        vala = N;
      }
      if (LDA < max(1, vala)) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            vala,
            LDA,
          ),
        );
      }
      if (M === 0 || N === 0 || alpha === 0) {
        return A;
      }
      ox = stride2offset(M, strideX);
      oy = stride2offset(N, strideY);
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      return base(M, N, alpha, x, strideX, ox, y, strideY, oy, A, sa1, sa2, 0);
    }
    module.exports = dger;
  },
});

// node_modules/@stdlib/blas-base-dger/lib/ndarray.js
var require_ndarray31 = __commonJS({
  "node_modules/@stdlib/blas-base-dger/lib/ndarray.js"(exports, module) {
    "use strict";
    var format = require_lib3();
    var base = require_base9();
    function dger(
      M,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. First argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (M === 0 || N === 0 || alpha === 0) {
        return A;
      }
      return base(
        M,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        y,
        strideY,
        offsetY,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = dger;
  },
});

// node_modules/@stdlib/blas-base-dger/lib/main.js
var require_main139 = __commonJS({
  "node_modules/@stdlib/blas-base-dger/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dger = require_dger();
    var ndarray = require_ndarray31();
    setReadOnly(dger, "ndarray", ndarray);
    module.exports = dger;
  },
});

// node_modules/@stdlib/blas-base-ssyr/lib/base.js
var require_base10 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function ssyr(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var isrm;
      var tmp;
      var ix0;
      var ix1;
      var sa0;
      var sa1;
      var i0;
      var i1;
      var ia;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if ((!isrm && uplo === "upper") || (isrm && uplo === "lower")) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            tmp = alpha * x[ix1];
            ia = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = 0; i0 <= i1; i0++) {
              A[ia] += x[ix0] * tmp;
              ix0 += strideX;
              ia += sa0;
            }
          }
          ix1 += strideX;
        }
        return A;
      }
      ix1 = ox;
      for (i1 = 0; i1 < N; i1++) {
        if (x[ix1] !== 0) {
          tmp = alpha * x[ix1];
          ia = offsetA + sa1 * i1 + sa0 * i1;
          ix0 = ix1;
          for (i0 = i1; i0 < N; i0++) {
            A[ia] += x[ix0] * tmp;
            ix0 += strideX;
            ia += sa0;
          }
        }
        ix1 += strideX;
      }
      return A;
    }
    module.exports = ssyr;
  },
});

// node_modules/@stdlib/blas-base-ssyr/lib/ssyr.js
var require_ssyr = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr/lib/ssyr.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var format = require_lib3();
    var base = require_base10();
    function ssyr(order, uplo, N, alpha, x, strideX, A, LDA) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, N, alpha, x, strideX, ox, A, sa1, sa2, 0);
    }
    module.exports = ssyr;
  },
});

// node_modules/@stdlib/blas-base-ssyr/lib/ndarray.js
var require_ndarray32 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base10();
    function ssyr(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = ssyr;
  },
});

// node_modules/@stdlib/blas-base-ssyr/lib/main.js
var require_main140 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var ssyr = require_ssyr();
    var ndarray = require_ndarray32();
    setReadOnly(ssyr, "ndarray", ndarray);
    module.exports = ssyr;
  },
});

// node_modules/@stdlib/blas-base-dsyr/lib/base.js
var require_base11 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function dsyr(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var isrm;
      var tmp;
      var ix0;
      var ix1;
      var sa0;
      var sa1;
      var i0;
      var i1;
      var ia;
      var ox;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      if ((!isrm && uplo === "upper") || (isrm && uplo === "lower")) {
        ix1 = ox;
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0) {
            tmp = alpha * x[ix1];
            ia = offsetA + sa1 * i1;
            ix0 = ox;
            for (i0 = 0; i0 <= i1; i0++) {
              A[ia] += x[ix0] * tmp;
              ix0 += strideX;
              ia += sa0;
            }
          }
          ix1 += strideX;
        }
        return A;
      }
      ix1 = ox;
      for (i1 = 0; i1 < N; i1++) {
        if (x[ix1] !== 0) {
          tmp = alpha * x[ix1];
          ia = offsetA + sa1 * i1 + sa0 * i1;
          ix0 = ix1;
          for (i0 = i1; i0 < N; i0++) {
            A[ia] += x[ix0] * tmp;
            ix0 += strideX;
            ia += sa0;
          }
        }
        ix1 += strideX;
      }
      return A;
    }
    module.exports = dsyr;
  },
});

// node_modules/@stdlib/blas-base-dsyr/lib/dsyr.js
var require_dsyr = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr/lib/dsyr.js"(exports, module) {
    "use strict";
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base11();
    function dsyr(order, uplo, N, alpha, x, strideX, A, LDA) {
      var sa1;
      var sa2;
      var ox;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      return base(uplo, N, alpha, x, strideX, ox, A, sa1, sa2, 0);
    }
    module.exports = dsyr;
  },
});

// node_modules/@stdlib/blas-base-dsyr/lib/ndarray.js
var require_ndarray33 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base11();
    function dsyr(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = dsyr;
  },
});

// node_modules/@stdlib/blas-base-dsyr/lib/main.js
var require_main141 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dsyr = require_dsyr();
    var ndarray = require_ndarray33();
    setReadOnly(dsyr, "ndarray", ndarray);
    module.exports = dsyr;
  },
});

// node_modules/@stdlib/blas-base-dsyr/lib/index.js
var require_lib132 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main141();
    var dsyr;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dsyr = main;
    } else {
      dsyr = tmp;
    }
    module.exports = dsyr;
  },
});

// node_modules/@stdlib/blas-base-ssyr2/lib/base.js
var require_base12 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr2/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var f32 = require_lib16();
    function ssyr2(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var tmp1;
      var tmp2;
      var isrm;
      var ix0;
      var ix1;
      var iy0;
      var iy1;
      var sa0;
      var sa1;
      var i0;
      var i1;
      var ia;
      var ox;
      var oy;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      oy = offsetY;
      ix1 = ox;
      iy1 = oy;
      if ((isrm && uplo === "lower") || (!isrm && uplo === "upper")) {
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0 || y[iy1] !== 0) {
            tmp1 = f32(alpha * y[iy1]);
            tmp2 = f32(alpha * x[ix1]);
            ia = offsetA + sa1 * i1;
            ix0 = ox;
            iy0 = oy;
            for (i0 = 0; i0 <= i1; i0++) {
              A[ia] += f32(f32(x[ix0] * tmp1) + f32(y[iy0] * tmp2));
              ix0 += strideX;
              iy0 += strideY;
              ia += sa0;
            }
          }
          ix1 += strideX;
          iy1 += strideY;
        }
        return A;
      }
      for (i1 = 0; i1 < N; i1++) {
        if (x[ix1] !== 0 || y[iy1] !== 0) {
          tmp1 = f32(alpha * y[iy1]);
          tmp2 = f32(alpha * x[ix1]);
          ia = offsetA + sa1 * i1 + sa0 * i1;
          ix0 = ix1;
          iy0 = iy1;
          for (i0 = i1; i0 < N; i0++) {
            A[ia] += f32(f32(x[ix0] * tmp1) + f32(y[iy0] * tmp2));
            ix0 += strideX;
            iy0 += strideY;
            ia += sa0;
          }
        }
        ix1 += strideX;
        iy1 += strideY;
      }
      return A;
    }
    module.exports = ssyr2;
  },
});

// node_modules/@stdlib/blas-base-ssyr2/lib/ssyr2.js
var require_ssyr2 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr2/lib/ssyr2.js"(exports, module) {
    "use strict";
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var isColumnMajor = require_lib111();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base12();
    function ssyr2(order, uplo, N, alpha, x, strideX, y, strideY, A, LDA) {
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      oy = stride2offset(N, strideY);
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        ox,
        y,
        strideY,
        oy,
        A,
        sa1,
        sa2,
        0,
      );
    }
    module.exports = ssyr2;
  },
});

// node_modules/@stdlib/blas-base-ssyr2/lib/ndarray.js
var require_ndarray34 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr2/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base12();
    function ssyr2(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eleventh argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Twelfth argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        y,
        strideY,
        offsetY,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = ssyr2;
  },
});

// node_modules/@stdlib/blas-base-ssyr2/lib/main.js
var require_main142 = __commonJS({
  "node_modules/@stdlib/blas-base-ssyr2/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var ssyr2 = require_ssyr2();
    var ndarray = require_ndarray34();
    setReadOnly(ssyr2, "ndarray", ndarray);
    module.exports = ssyr2;
  },
});

// node_modules/@stdlib/blas-base-dsyr2/lib/base.js
var require_base13 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr2/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    function dsyr2(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      var tmp1;
      var tmp2;
      var isrm;
      var ix0;
      var ix1;
      var iy0;
      var iy1;
      var sa0;
      var sa1;
      var i0;
      var i1;
      var ia;
      var ox;
      var oy;
      isrm = isRowMajor([strideA1, strideA2]);
      if (isrm) {
        sa0 = strideA2;
        sa1 = strideA1;
      } else {
        sa0 = strideA1;
        sa1 = strideA2;
      }
      ox = offsetX;
      oy = offsetY;
      ix1 = ox;
      iy1 = oy;
      if ((isrm && uplo === "lower") || (!isrm && uplo === "upper")) {
        for (i1 = 0; i1 < N; i1++) {
          if (x[ix1] !== 0 || y[iy1] !== 0) {
            tmp1 = alpha * y[iy1];
            tmp2 = alpha * x[ix1];
            ia = offsetA + sa1 * i1;
            ix0 = ox;
            iy0 = oy;
            for (i0 = 0; i0 <= i1; i0++) {
              A[ia] += x[ix0] * tmp1 + y[iy0] * tmp2;
              ix0 += strideX;
              iy0 += strideY;
              ia += sa0;
            }
          }
          ix1 += strideX;
          iy1 += strideY;
        }
        return A;
      }
      for (i1 = 0; i1 < N; i1++) {
        if (x[ix1] !== 0 || y[iy1] !== 0) {
          tmp1 = alpha * y[iy1];
          tmp2 = alpha * x[ix1];
          ia = offsetA + sa1 * i1 + sa0 * i1;
          ix0 = ix1;
          iy0 = iy1;
          for (i0 = i1; i0 < N; i0++) {
            A[ia] += x[ix0] * tmp1 + y[iy0] * tmp2;
            ix0 += strideX;
            iy0 += strideY;
            ia += sa0;
          }
        }
        ix1 += strideX;
        iy1 += strideY;
      }
      return A;
    }
    module.exports = dsyr2;
  },
});

// node_modules/@stdlib/blas-base-dsyr2/lib/dsyr2.js
var require_dsyr2 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr2/lib/dsyr2.js"(exports, module) {
    "use strict";
    var isColumnMajor = require_lib111();
    var isLayout = require_lib108();
    var isMatrixTriangle = require_lib122();
    var stride2offset = require_lib6();
    var max = require_lib112();
    var format = require_lib3();
    var base = require_base13();
    function dsyr2(order, uplo, N, alpha, x, strideX, y, strideY, A, LDA) {
      var sa1;
      var sa2;
      var ox;
      var oy;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (LDA < max(1, N)) {
        throw new RangeError(
          format(
            "invalid argument. Tenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            N,
            LDA,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      if (isColumnMajor(order)) {
        sa1 = 1;
        sa2 = LDA;
      } else {
        sa1 = LDA;
        sa2 = 1;
      }
      ox = stride2offset(N, strideX);
      oy = stride2offset(N, strideY);
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        ox,
        y,
        strideY,
        oy,
        A,
        sa1,
        sa2,
        0,
      );
    }
    module.exports = dsyr2;
  },
});

// node_modules/@stdlib/blas-base-dsyr2/lib/ndarray.js
var require_ndarray35 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr2/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTriangle = require_lib122();
    var format = require_lib3();
    var base = require_base13();
    function dsyr2(
      uplo,
      N,
      alpha,
      x,
      strideX,
      offsetX,
      y,
      strideY,
      offsetY,
      A,
      strideA1,
      strideA2,
      offsetA,
    ) {
      if (!isMatrixTriangle(uplo)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must specify whether to reference the lower or upper triangular matrix. Value: `%s`.",
            uplo,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Second argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (strideX === 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be non-zero. Value: `%d`.",
            strideX,
          ),
        );
      }
      if (strideY === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighth argument must be non-zero. Value: `%d`.",
            strideY,
          ),
        );
      }
      if (strideA1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eleventh argument must be non-zero. Value: `%d`.",
            strideA1,
          ),
        );
      }
      if (strideA2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Twelfth argument must be non-zero. Value: `%d`.",
            strideA2,
          ),
        );
      }
      if (N === 0 || alpha === 0) {
        return A;
      }
      return base(
        uplo,
        N,
        alpha,
        x,
        strideX,
        offsetX,
        y,
        strideY,
        offsetY,
        A,
        strideA1,
        strideA2,
        offsetA,
      );
    }
    module.exports = dsyr2;
  },
});

// node_modules/@stdlib/blas-base-dsyr2/lib/main.js
var require_main143 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr2/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dsyr2 = require_dsyr2();
    var ndarray = require_ndarray35();
    setReadOnly(dsyr2, "ndarray", ndarray);
    module.exports = dsyr2;
  },
});

// node_modules/@stdlib/blas-base-dsyr2/lib/index.js
var require_lib133 = __commonJS({
  "node_modules/@stdlib/blas-base-dsyr2/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main143();
    var dsyr2;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dsyr2 = main;
    } else {
      dsyr2 = tmp;
    }
    module.exports = dsyr2;
  },
});

// node_modules/@stdlib/assert-is-positive-integer/lib/primitive.js
var require_primitive6 = __commonJS({
  "node_modules/@stdlib/assert-is-positive-integer/lib/primitive.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInteger = require_lib72().isPrimitive;
    function isPositiveInteger(value) {
      return isInteger(value) && value > 0;
    }
    module.exports = isPositiveInteger;
  },
});

// node_modules/@stdlib/assert-is-positive-integer/lib/object.js
var require_object6 = __commonJS({
  "node_modules/@stdlib/assert-is-positive-integer/lib/object.js"(
    exports,
    module,
  ) {
    "use strict";
    var isInteger = require_lib72().isObject;
    function isPositiveInteger(value) {
      return isInteger(value) && value.valueOf() > 0;
    }
    module.exports = isPositiveInteger;
  },
});

// node_modules/@stdlib/assert-is-positive-integer/lib/main.js
var require_main144 = __commonJS({
  "node_modules/@stdlib/assert-is-positive-integer/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isPrimitive = require_primitive6();
    var isObject = require_object6();
    function isPositiveInteger(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isPositiveInteger;
  },
});

// node_modules/@stdlib/assert-is-positive-integer/lib/index.js
var require_lib134 = __commonJS({
  "node_modules/@stdlib/assert-is-positive-integer/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main144();
    var isPrimitive = require_primitive6();
    var isObject = require_object6();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-keys/lib/builtin.js
var require_builtin2 = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/builtin.js"(exports, module) {
    "use strict";
    function keys(value) {
      return Object.keys(Object(value));
    }
    module.exports = keys;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_arguments_bug.js
var require_has_arguments_bug = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_arguments_bug.js"(exports, module) {
    "use strict";
    var keys = require_builtin2();
    function test() {
      return (keys(arguments) || "").length !== 2;
    }
    function check() {
      return test(1, 2);
    }
    module.exports = check;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_builtin.js
var require_has_builtin = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_builtin.js"(exports, module) {
    "use strict";
    var bool = typeof Object.keys !== "undefined";
    module.exports = bool;
  },
});

// node_modules/@stdlib/assert-is-arguments/lib/main.js
var require_main145 = __commonJS({
  "node_modules/@stdlib/assert-is-arguments/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib11();
    function isArguments(value) {
      return nativeClass(value) === "[object Arguments]";
    }
    module.exports = isArguments;
  },
});

// node_modules/@stdlib/assert-is-arguments/lib/detect.js
var require_detect2 = __commonJS({
  "node_modules/@stdlib/assert-is-arguments/lib/detect.js"(exports, module) {
    "use strict";
    var isArguments = require_main145();
    var bool;
    function detect() {
      return isArguments(arguments);
    }
    bool = detect();
    module.exports = bool;
  },
});

// node_modules/@stdlib/assert-is-nan/lib/primitive.js
var require_primitive7 = __commonJS({
  "node_modules/@stdlib/assert-is-nan/lib/primitive.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isPrimitive;
    var isNan = require_lib119();
    function isnan(value) {
      return isNumber(value) && isNan(value);
    }
    module.exports = isnan;
  },
});

// node_modules/@stdlib/assert-is-nan/lib/object.js
var require_object7 = __commonJS({
  "node_modules/@stdlib/assert-is-nan/lib/object.js"(exports, module) {
    "use strict";
    var isNumber = require_lib68().isObject;
    var isNan = require_lib119();
    function isnan(value) {
      return isNumber(value) && isNan(value.valueOf());
    }
    module.exports = isnan;
  },
});

// node_modules/@stdlib/assert-is-nan/lib/main.js
var require_main146 = __commonJS({
  "node_modules/@stdlib/assert-is-nan/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive7();
    var isObject = require_object7();
    function isnan(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isnan;
  },
});

// node_modules/@stdlib/assert-is-nan/lib/index.js
var require_lib135 = __commonJS({
  "node_modules/@stdlib/assert-is-nan/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main146();
    var isPrimitive = require_primitive7();
    var isObject = require_object7();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-enumerable-property/lib/native.js
var require_native2 = __commonJS({
  "node_modules/@stdlib/assert-is-enumerable-property/lib/native.js"(
    exports,
    module,
  ) {
    "use strict";
    var isEnumerableProperty = Object.prototype.propertyIsEnumerable;
    module.exports = isEnumerableProperty;
  },
});

// node_modules/@stdlib/assert-is-enumerable-property/lib/has_string_enumerability_bug.js
var require_has_string_enumerability_bug = __commonJS({
  "node_modules/@stdlib/assert-is-enumerable-property/lib/has_string_enumerability_bug.js"(
    exports,
    module,
  ) {
    "use strict";
    var isEnum = require_native2();
    var bool;
    function detect() {
      return !isEnum.call("beep", "0");
    }
    bool = detect();
    module.exports = bool;
  },
});

// node_modules/@stdlib/assert-is-enumerable-property/lib/main.js
var require_main147 = __commonJS({
  "node_modules/@stdlib/assert-is-enumerable-property/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isString = require_lib80();
    var isnan = require_lib135().isPrimitive;
    var isInteger = require_lib72().isPrimitive;
    var isEnum = require_native2();
    var hasStringEnumBug = require_has_string_enumerability_bug();
    function isEnumerableProperty(value, property) {
      var bool;
      if (value === void 0 || value === null) {
        return false;
      }
      bool = isEnum.call(value, property);
      if (!bool && hasStringEnumBug && isString(value)) {
        property = +property;
        return (
          !isnan(property) &&
          isInteger(property) &&
          property >= 0 &&
          property < value.length
        );
      }
      return bool;
    }
    module.exports = isEnumerableProperty;
  },
});

// node_modules/@stdlib/assert-is-enumerable-property/lib/index.js
var require_lib136 = __commonJS({
  "node_modules/@stdlib/assert-is-enumerable-property/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main147();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-arguments/lib/polyfill.js
var require_polyfill15 = __commonJS({
  "node_modules/@stdlib/assert-is-arguments/lib/polyfill.js"(exports, module) {
    "use strict";
    var hasOwnProp = require_lib9();
    var isEnumerableProperty = require_lib136();
    var isArray = require_lib28();
    var isInteger = require_lib71();
    var MAX_LENGTH = require_lib38();
    function isArguments(value) {
      return (
        value !== null &&
        typeof value === "object" &&
        !isArray(value) &&
        typeof value.length === "number" &&
        isInteger(value.length) &&
        value.length >= 0 &&
        value.length <= MAX_LENGTH &&
        hasOwnProp(value, "callee") &&
        !isEnumerableProperty(value, "callee")
      );
    }
    module.exports = isArguments;
  },
});

// node_modules/@stdlib/assert-is-arguments/lib/index.js
var require_lib137 = __commonJS({
  "node_modules/@stdlib/assert-is-arguments/lib/index.js"(exports, module) {
    "use strict";
    var hasArgumentsClass = require_detect2();
    var main = require_main145();
    var polyfill = require_polyfill15();
    var isArguments;
    if (hasArgumentsClass) {
      isArguments = main;
    } else {
      isArguments = polyfill;
    }
    module.exports = isArguments;
  },
});

// node_modules/@stdlib/utils-keys/lib/builtin_wrapper.js
var require_builtin_wrapper = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/builtin_wrapper.js"(exports, module) {
    "use strict";
    var isArguments = require_lib137();
    var builtin = require_builtin2();
    var slice = Array.prototype.slice;
    function keys(value) {
      if (isArguments(value)) {
        return builtin(slice.call(value));
      }
      return builtin(value);
    }
    module.exports = keys;
  },
});

// node_modules/@stdlib/utils-noop/lib/main.js
var require_main148 = __commonJS({
  "node_modules/@stdlib/utils-noop/lib/main.js"(exports, module) {
    "use strict";
    function noop() {}
    module.exports = noop;
  },
});

// node_modules/@stdlib/utils-noop/lib/index.js
var require_lib138 = __commonJS({
  "node_modules/@stdlib/utils-noop/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main148();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_enumerable_prototype_bug.js
var require_has_enumerable_prototype_bug = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_enumerable_prototype_bug.js"(
    exports,
    module,
  ) {
    "use strict";
    var isEnumerableProperty = require_lib136();
    var noop = require_lib138();
    var bool = isEnumerableProperty(noop, "prototype");
    module.exports = bool;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_non_enumerable_properties_bug.js
var require_has_non_enumerable_properties_bug = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_non_enumerable_properties_bug.js"(
    exports,
    module,
  ) {
    "use strict";
    var isEnumerableProperty = require_lib136();
    var obj = {
      toString: null,
    };
    var bool = !isEnumerableProperty(obj, "toString");
    module.exports = bool;
  },
});

// node_modules/@stdlib/utils-index-of/lib/main.js
var require_main149 = __commonJS({
  "node_modules/@stdlib/utils-index-of/lib/main.js"(exports, module) {
    "use strict";
    var isnan = require_lib135();
    var isCollection = require_lib77();
    var isString = require_lib80().isPrimitive;
    var isInteger = require_lib72().isPrimitive;
    var format = require_lib3();
    function indexOf(arr, searchElement, fromIndex) {
      var len;
      var i;
      if (!isCollection(arr) && !isString(arr)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be an array-like object. Value: `%s`.",
            arr,
          ),
        );
      }
      len = arr.length;
      if (len === 0) {
        return -1;
      }
      if (arguments.length === 3) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(
            format(
              "invalid argument. Third argument must be an integer. Value: `%s`.",
              fromIndex,
            ),
          );
        }
        if (fromIndex >= 0) {
          if (fromIndex >= len) {
            return -1;
          }
          i = fromIndex;
        } else {
          i = len + fromIndex;
          if (i < 0) {
            i = 0;
          }
        }
      } else {
        i = 0;
      }
      if (isnan(searchElement)) {
        for (; i < len; i++) {
          if (isnan(arr[i])) {
            return i;
          }
        }
      } else {
        for (; i < len; i++) {
          if (arr[i] === searchElement) {
            return i;
          }
        }
      }
      return -1;
    }
    module.exports = indexOf;
  },
});

// node_modules/@stdlib/utils-index-of/lib/index.js
var require_lib139 = __commonJS({
  "node_modules/@stdlib/utils-index-of/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main149();
    module.exports = main;
  },
});

// node_modules/@stdlib/utils-keys/lib/is_constructor_prototype.js
var require_is_constructor_prototype = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/is_constructor_prototype.js"(
    exports,
    module,
  ) {
    "use strict";
    function isConstructorPrototype(value) {
      return value.constructor && value.constructor.prototype === value;
    }
    module.exports = isConstructorPrototype;
  },
});

// node_modules/@stdlib/utils-keys/lib/excluded_keys.json
var require_excluded_keys = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/excluded_keys.json"(exports, module) {
    module.exports = [
      "console",
      "external",
      "frame",
      "frameElement",
      "frames",
      "innerHeight",
      "innerWidth",
      "outerHeight",
      "outerWidth",
      "pageXOffset",
      "pageYOffset",
      "parent",
      "scrollLeft",
      "scrollTop",
      "scrollX",
      "scrollY",
      "self",
      "webkitIndexedDB",
      "webkitStorageInfo",
      "window",
    ];
  },
});

// node_modules/@stdlib/utils-keys/lib/window.js
var require_window2 = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/window.js"(exports, module) {
    "use strict";
    var w = typeof window === "undefined" ? void 0 : window;
    module.exports = w;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_automation_equality_bug.js
var require_has_automation_equality_bug = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_automation_equality_bug.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasOwnProp = require_lib9();
    var indexOf = require_lib139();
    var typeOf = require_lib84();
    var isConstructorPrototype = require_is_constructor_prototype();
    var EXCLUDED_KEYS = require_excluded_keys();
    var win = require_window2();
    var bool;
    function check() {
      var k;
      if (typeOf(win) === "undefined") {
        return false;
      }
      for (k in win) {
        try {
          if (
            indexOf(EXCLUDED_KEYS, k) === -1 &&
            hasOwnProp(win, k) &&
            win[k] !== null &&
            typeOf(win[k]) === "object"
          ) {
            isConstructorPrototype(win[k]);
          }
        } catch (err) {
          return true;
        }
      }
      return false;
    }
    bool = check();
    module.exports = bool;
  },
});

// node_modules/@stdlib/utils-keys/lib/has_window.js
var require_has_window = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/has_window.js"(exports, module) {
    "use strict";
    var bool = typeof window !== "undefined";
    module.exports = bool;
  },
});

// node_modules/@stdlib/utils-keys/lib/is_constructor_prototype_wrapper.js
var require_is_constructor_prototype_wrapper = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/is_constructor_prototype_wrapper.js"(
    exports,
    module,
  ) {
    "use strict";
    var hasAutomationEqualityBug = require_has_automation_equality_bug();
    var isConstructorPrototype = require_is_constructor_prototype();
    var HAS_WINDOW = require_has_window();
    function wrapper(value) {
      if (HAS_WINDOW === false && !hasAutomationEqualityBug) {
        return isConstructorPrototype(value);
      }
      try {
        return isConstructorPrototype(value);
      } catch (error) {
        return false;
      }
    }
    module.exports = wrapper;
  },
});

// node_modules/@stdlib/utils-keys/lib/non_enumerable.json
var require_non_enumerable = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/non_enumerable.json"(exports, module) {
    module.exports = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor",
    ];
  },
});

// node_modules/@stdlib/utils-keys/lib/polyfill.js
var require_polyfill16 = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/polyfill.js"(exports, module) {
    "use strict";
    var isObjectLike = require_lib30();
    var hasOwnProp = require_lib9();
    var isArguments = require_lib137();
    var HAS_ENUM_PROTO_BUG = require_has_enumerable_prototype_bug();
    var HAS_NON_ENUM_PROPS_BUG = require_has_non_enumerable_properties_bug();
    var isConstructorPrototype = require_is_constructor_prototype_wrapper();
    var NON_ENUMERABLE = require_non_enumerable();
    function keys(value) {
      var skipConstructor;
      var skipPrototype;
      var isFcn;
      var out;
      var k;
      var p;
      var i;
      out = [];
      if (isArguments(value)) {
        for (i = 0; i < value.length; i++) {
          out.push(i.toString());
        }
        return out;
      }
      if (typeof value === "string") {
        if (value.length > 0 && !hasOwnProp(value, "0")) {
          for (i = 0; i < value.length; i++) {
            out.push(i.toString());
          }
        }
      } else {
        isFcn = typeof value === "function";
        if (isFcn === false && !isObjectLike(value)) {
          return out;
        }
        skipPrototype = HAS_ENUM_PROTO_BUG && isFcn;
      }
      for (k in value) {
        if (!(skipPrototype && k === "prototype") && hasOwnProp(value, k)) {
          out.push(String(k));
        }
      }
      if (HAS_NON_ENUM_PROPS_BUG) {
        skipConstructor = isConstructorPrototype(value);
        for (i = 0; i < NON_ENUMERABLE.length; i++) {
          p = NON_ENUMERABLE[i];
          if (
            !(skipConstructor && p === "constructor") &&
            hasOwnProp(value, p)
          ) {
            out.push(String(p));
          }
        }
      }
      return out;
    }
    module.exports = keys;
  },
});

// node_modules/@stdlib/utils-keys/lib/main.js
var require_main150 = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/main.js"(exports, module) {
    "use strict";
    var hasArgumentsBug = require_has_arguments_bug();
    var HAS_BUILTIN = require_has_builtin();
    var builtin = require_builtin2();
    var wrapper = require_builtin_wrapper();
    var polyfill = require_polyfill16();
    var keys;
    if (HAS_BUILTIN) {
      if (hasArgumentsBug()) {
        keys = wrapper;
      } else {
        keys = builtin;
      }
    } else {
      keys = polyfill;
    }
    module.exports = keys;
  },
});

// node_modules/@stdlib/utils-keys/lib/index.js
var require_lib140 = __commonJS({
  "node_modules/@stdlib/utils-keys/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main150();
    module.exports = main;
  },
});

// node_modules/@stdlib/assert-is-plain-object/lib/main.js
var require_main151 = __commonJS({
  "node_modules/@stdlib/assert-is-plain-object/lib/main.js"(exports, module) {
    "use strict";
    var isObject = require_lib79();
    var isFunction = require_lib85();
    var getPrototypeOf = require_lib115();
    var hasOwnProp = require_lib9();
    var nativeClass = require_lib11();
    var objectPrototype = Object.prototype;
    function ownProps(obj) {
      var key;
      for (key in obj) {
        if (!hasOwnProp(obj, key)) {
          return false;
        }
      }
      return true;
    }
    function isPlainObject(value) {
      var proto;
      if (!isObject(value)) {
        return false;
      }
      proto = getPrototypeOf(value);
      if (!proto) {
        return true;
      }
      return (
        // Cannot have own `constructor` property:
        !hasOwnProp(value, "constructor") && // Prototype `constructor` property must be a function (see also https://bugs.jquery.com/ticket/9897 and http://stackoverflow.com/questions/18531624/isplainobject-thing):
        hasOwnProp(proto, "constructor") &&
        isFunction(proto.constructor) &&
        nativeClass(proto.constructor) === "[object Function]" && // Test for object-specific method:
        hasOwnProp(proto, "isPrototypeOf") &&
        isFunction(proto.isPrototypeOf) && // Test if the prototype matches the global `Object` prototype (same realm):
        (proto === objectPrototype || // Test that all properties are own properties (cross-realm; *most* likely a plain object):
          ownProps(value))
      );
    }
    module.exports = isPlainObject;
  },
});

// node_modules/@stdlib/assert-is-plain-object/lib/index.js
var require_lib141 = __commonJS({
  "node_modules/@stdlib/assert-is-plain-object/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main151();
    module.exports = main;
  },
});

// node_modules/@stdlib/object-inverse/lib/main.js
var require_main152 = __commonJS({
  "node_modules/@stdlib/object-inverse/lib/main.js"(exports, module) {
    "use strict";
    var objectKeys = require_lib140();
    var isArray = require_lib28();
    var isObject = require_lib141();
    var isObjectLike = require_lib30();
    var isBoolean = require_lib83().isPrimitive;
    var hasOwnProp = require_lib9();
    var format = require_lib3();
    function invert(obj, opts) {
      var allowDupes = true;
      var keys;
      var len;
      var key;
      var val;
      var out;
      var v;
      var i;
      if (!isObjectLike(obj)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be an object (except null). Value: `%s`.",
            obj,
          ),
        );
      }
      if (arguments.length > 1) {
        if (!isObject(opts)) {
          throw new TypeError(
            format(
              "invalid argument. Options argument must be an object. Value: `%s`.",
              opts,
            ),
          );
        }
        if (hasOwnProp(opts, "duplicates")) {
          allowDupes = opts.duplicates;
          if (!isBoolean(allowDupes)) {
            throw new TypeError(
              format(
                "invalid option. `%s` option must be a boolean. Option: `%s`.",
                "duplicates",
                allowDupes,
              ),
            );
          }
        }
      }
      keys = objectKeys(obj);
      len = keys.length;
      out = {};
      if (allowDupes) {
        for (i = 0; i < len; i++) {
          key = keys[i];
          val = obj[key];
          if (!hasOwnProp(out, val)) {
            out[val] = key;
            continue;
          }
          v = out[val];
          if (isArray(v)) {
            out[val].push(key);
          } else {
            out[val] = [v, key];
          }
        }
      } else {
        for (i = 0; i < len; i++) {
          key = keys[i];
          out[obj[key]] = key;
        }
      }
      return out;
    }
    module.exports = invert;
  },
});

// node_modules/@stdlib/object-inverse/lib/index.js
var require_lib142 = __commonJS({
  "node_modules/@stdlib/object-inverse/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main152();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-dtype-enums/lib/main.js
var require_main153 = __commonJS({
  "node_modules/@stdlib/ndarray-base-dtype-enums/lib/main.js"(exports, module) {
    "use strict";
    function dtypeEnums() {
      return {
        // Boolean data types:
        bool: 0,
        // Integer data types:
        int8: 1,
        uint8: 2,
        uint8c: 3,
        int16: 4,
        uint16: 5,
        int32: 6,
        uint32: 7,
        int64: 8,
        uint64: 9,
        // 'int128': 10, // uncomment once supported
        // 'uint128': 11,
        // 'int256': 12,
        // 'uint256': 13,
        // Floating-point data types:
        float16: 10,
        // 'bfloat16': 15,
        float32: 11,
        float64: 12,
        // 'float128': 18, // uncomment once supported
        // Complex floating-point number data types:
        complex32: 13,
        complex64: 14,
        complex128: 15,
        // Data type for "binary" data (i.e., data stored in a Node.js `Buffer` object):
        binary: 16,
        // Data type for "generic" JavaScript values (objects):
        generic: 17,
        // Define a signaling value which is guaranteed not to be a valid type enumeration value:
        notype: 18,
        // Indicate the start of user defined type numbers (leaving room for type growth above):
        userdefined_type: 256,
      };
    }
    module.exports = dtypeEnums;
  },
});

// node_modules/@stdlib/ndarray-base-dtype-enums/lib/index.js
var require_lib143 = __commonJS({
  "node_modules/@stdlib/ndarray-base-dtype-enums/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main153();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-dtype-enum2str/lib/main.js
var require_main154 = __commonJS({
  "node_modules/@stdlib/ndarray-base-dtype-enum2str/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isString = require_lib80().isPrimitive;
    var objectInverse = require_lib142();
    var dtypeEnums = require_lib143();
    var hash = objectInverse(dtypeEnums(), {
      duplicates: false,
    });
    function enum2str(dtype) {
      var v = hash[dtype];
      return isString(v) ? v : null;
    }
    module.exports = enum2str;
  },
});

// node_modules/@stdlib/ndarray-base-dtype-enum2str/lib/index.js
var require_lib144 = __commonJS({
  "node_modules/@stdlib/ndarray-base-dtype-enum2str/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main154();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-bytes-per-element/lib/bytes_per_element.json
var require_bytes_per_element = __commonJS({
  "node_modules/@stdlib/ndarray-base-bytes-per-element/lib/bytes_per_element.json"(
    exports,
    module,
  ) {
    module.exports = {
      binary: 1,
      bool: 1,
      complex64: 8,
      complex128: 16,
      float16: 2,
      bfloat16: 2,
      float32: 4,
      float64: 8,
      float128: 16,
      generic: null,
      int8: 1,
      int16: 2,
      int32: 4,
      int64: 8,
      int128: 16,
      int256: 32,
      uint8: 1,
      uint8c: 1,
      uint16: 2,
      uint32: 4,
      uint64: 8,
      uint128: 16,
      uint256: 32,
    };
  },
});

// node_modules/@stdlib/ndarray-base-bytes-per-element/lib/main.js
var require_main155 = __commonJS({
  "node_modules/@stdlib/ndarray-base-bytes-per-element/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var isString = require_lib80().isPrimitive;
    var isNumber = require_lib68().isPrimitive;
    var isPositiveInteger = require_lib134().isPrimitive;
    var enum2str = require_lib144();
    var BYTES_PER_ELEMENT = require_bytes_per_element();
    function bytesPerElement(dtype) {
      var v;
      if (isString(dtype)) {
        return BYTES_PER_ELEMENT[dtype] || null;
      }
      if (isNumber(dtype)) {
        return BYTES_PER_ELEMENT[enum2str(dtype)] || null;
      }
      if (dtype) {
        v = dtype.byteLength;
        if (isPositiveInteger(v)) {
          return v;
        }
      }
      return null;
    }
    module.exports = bytesPerElement;
  },
});

// node_modules/@stdlib/ndarray-base-bytes-per-element/lib/index.js
var require_lib145 = __commonJS({
  "node_modules/@stdlib/ndarray-base-bytes-per-element/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main155();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-tiling-block-size/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/@stdlib/ndarray-base-tiling-block-size/lib/defaults.js"(
    exports,
    module,
  ) {
    "use strict";
    var defaults = {
      // Define a default block size (in bytes):
      BLOCK_SIZE_IN_BYTES: 64 | 0,
      // 64b is a common cache line size. How applicable the common cache line size is here is debatable, given that, depending on the associated stride(s), the innermost loop may not iterate over adjacent elements. The primary goal is to have a block size in which all data within a block can always fit in (L1) cache, regardless of cache size (i.e., cache-oblivious). For reference, a common L1 cache size is 32kB per core. For best performance, block sizes should be tuned based on system hardware; however, such tuning is not readily available to us here. Without obvious better alternatives, 64b has some theoretical (and practical) underpinning, and it should be good enough for most inputs, especially for ndarrays with near contiguity.
      // Define a default block size (in elements):
      BLOCK_SIZE_IN_ELEMENTS: 8 | 0,
      // 64 bytes / 8 bytes per element (i.e., default element size is same as a double)
    };
    module.exports = defaults;
  },
});

// node_modules/@stdlib/ndarray-base-tiling-block-size/lib/main.js
var require_main156 = __commonJS({
  "node_modules/@stdlib/ndarray-base-tiling-block-size/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var bytesPerElement = require_lib145();
    var defaults = require_defaults();
    function blockSize(dtypes) {
      var max;
      var len;
      var nb;
      var i;
      len = dtypes.length;
      if (len <= 0) {
        return defaults.BLOCK_SIZE_IN_ELEMENTS;
      }
      max = bytesPerElement(dtypes[0]);
      if (max === null) {
        return defaults.BLOCK_SIZE_IN_ELEMENTS;
      }
      for (i = 1; i < len; i++) {
        nb = bytesPerElement(dtypes[i]);
        if (nb === null) {
          return defaults.BLOCK_SIZE_IN_ELEMENTS;
        }
        if (nb > max) {
          max = nb;
        }
      }
      nb = (defaults.BLOCK_SIZE_IN_BYTES / max) | 0;
      return nb > 0 ? nb : 1 | 0;
    }
    module.exports = blockSize;
  },
});

// node_modules/@stdlib/ndarray-base-tiling-block-size/lib/index.js
var require_lib146 = __commonJS({
  "node_modules/@stdlib/ndarray-base-tiling-block-size/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main156();
    module.exports = main;
  },
});

// node_modules/@stdlib/ndarray-base-unary-tiling-block-size/lib/main.js
var require_main157 = __commonJS({
  "node_modules/@stdlib/ndarray-base-unary-tiling-block-size/lib/main.js"(
    exports,
    module,
  ) {
    "use strict";
    var blockSize = require_lib146();
    function unaryBlockSize(dtypeX, dtypeY) {
      return blockSize([dtypeX, dtypeY]);
    }
    module.exports = unaryBlockSize;
  },
});

// node_modules/@stdlib/ndarray-base-unary-tiling-block-size/lib/index.js
var require_lib147 = __commonJS({
  "node_modules/@stdlib/ndarray-base-unary-tiling-block-size/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var main = require_main157();
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-sgemm/lib/base.js
var require_base14 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemm/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var sdot = require_main21().ndarray;
    var blockSize = require_lib147();
    var f32 = require_lib16();
    var bsize = blockSize("float32", "float32");
    function isTransposed(str) {
      return str !== "no-transpose";
    }
    function zeros(M, N, X, strideX1, strideX2, offsetX) {
      var dx0;
      var dx1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ix;
      if (isRowMajor([strideX1, strideX2])) {
        S0 = N;
        S1 = M;
        dx0 = strideX2;
        dx1 = strideX1 - S0 * strideX2;
      } else {
        S0 = M;
        S1 = N;
        dx0 = strideX1;
        dx1 = strideX2 - S0 * strideX1;
      }
      ix = offsetX;
      for (i1 = 0; i1 < S1; i1++) {
        for (i0 = 0; i0 < S0; i0++) {
          X[ix] = 0;
          ix += dx0;
        }
        ix += dx1;
      }
      return X;
    }
    function scal(M, N, beta, X, strideX1, strideX2, offsetX) {
      var dx0;
      var dx1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ix;
      if (isRowMajor([strideX1, strideX2])) {
        S0 = N;
        S1 = M;
        dx0 = strideX2;
        dx1 = strideX1 - S0 * strideX2;
      } else {
        S0 = M;
        S1 = N;
        dx0 = strideX1;
        dx1 = strideX2 - S0 * strideX1;
      }
      ix = offsetX;
      for (i1 = 0; i1 < S1; i1++) {
        for (i0 = 0; i0 < S0; i0++) {
          X[ix] *= beta;
          ix += dx0;
        }
        ix += dx1;
      }
      return X;
    }
    function naive(
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var da0;
      var db0;
      var dc0;
      var dc1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ia;
      var ib;
      var ic;
      S0 = N;
      S1 = M;
      da0 = strideA2;
      db0 = strideB1;
      dc0 = strideC2;
      dc1 = strideC1 - S0 * strideC2;
      ic = offsetC;
      for (i1 = 0; i1 < S1; i1++) {
        ia = offsetA + i1 * strideA1;
        for (i0 = 0; i0 < S0; i0++) {
          ib = offsetB + i0 * strideB2;
          C[ic] += f32(alpha * sdot(K, A, da0, ia, B, db0, ib));
          ic += dc0;
        }
        ic += dc1;
      }
      return C;
    }
    function blocked(
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var da0;
      var db0;
      var dc0;
      var dc1;
      var oa1;
      var ob0;
      var oc0;
      var oc1;
      var S0;
      var S1;
      var s0;
      var s1;
      var sk;
      var i0;
      var i1;
      var j0;
      var j1;
      var ia;
      var ib;
      var ic;
      var oa;
      var ob;
      var k;
      S0 = N;
      S1 = M;
      da0 = strideA2;
      db0 = strideB1;
      dc0 = strideC2;
      for (j1 = S1; j1 > 0;) {
        if (j1 < bsize) {
          s1 = j1;
          j1 = 0;
        } else {
          s1 = bsize;
          j1 -= bsize;
        }
        oa1 = offsetA + j1 * strideA1;
        oc1 = offsetC + j1 * strideC1;
        for (j0 = S0; j0 > 0;) {
          if (j0 < bsize) {
            s0 = j0;
            j0 = 0;
          } else {
            s0 = bsize;
            j0 -= bsize;
          }
          ob0 = offsetB + j0 * strideB2;
          oc0 = oc1 + j0 * strideC2;
          dc1 = strideC1 - s0 * strideC2;
          for (k = K; k > 0;) {
            if (k < bsize) {
              sk = k;
              k = 0;
            } else {
              sk = bsize;
              k -= bsize;
            }
            oa = oa1 + k * strideA2;
            ob = ob0 + k * strideB1;
            ic = oc0;
            for (i1 = 0; i1 < s1; i1++) {
              ia = oa + i1 * strideA1;
              for (i0 = 0; i0 < s0; i0++) {
                ib = ob + i0 * strideB2;
                C[ic] += f32(alpha * sdot(sk, A, da0, ia, B, db0, ib));
                ic += dc0;
              }
              ic += dc1;
            }
          }
        }
      }
      return C;
    }
    function sgemm(
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      beta,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var isrma;
      var isrmb;
      var sa1;
      var sa2;
      var sb1;
      var sb2;
      if (M === 0 || N === 0 || (beta === 1 && (alpha === 0 || K === 0))) {
        return C;
      }
      if (beta === 0) {
        C = zeros(M, N, C, strideC1, strideC2, offsetC);
      } else if (beta !== 1) {
        C = scal(M, N, beta, C, strideC1, strideC2, offsetC);
      }
      if (alpha === 0) {
        return C;
      }
      isrma = isRowMajor([strideA1, strideA2]);
      isrmb = isRowMajor([strideB1, strideB2]);
      if (isrma) {
        if (!isTransposed(transA)) {
          if (!isrmb && !isTransposed(transB)) {
            return naive(
              M,
              N,
              K,
              alpha,
              A,
              strideA1,
              strideA2,
              offsetA,
              B,
              strideB1,
              strideB2,
              offsetB,
              C,
              strideC1,
              strideC2,
              offsetC,
            );
          }
          if (isrmb && isTransposed(transB)) {
            return naive(
              M,
              N,
              K,
              alpha,
              A,
              strideA1,
              strideA2,
              offsetA,
              B,
              strideB2,
              strideB1,
              offsetB,
              C,
              strideC1,
              strideC2,
              offsetC,
            );
          }
        }
      } else if (isTransposed(transA)) {
        if (isrmb && isTransposed(transB)) {
          return naive(
            M,
            N,
            K,
            alpha,
            A,
            strideA2,
            strideA1,
            offsetA,
            B,
            strideB2,
            strideB1,
            offsetB,
            C,
            strideC1,
            strideC2,
            offsetC,
          );
        }
        if (!isrmb && !isTransposed(transB)) {
          return naive(
            M,
            N,
            K,
            alpha,
            A,
            strideA2,
            strideA1,
            offsetA,
            B,
            strideB1,
            strideB2,
            offsetB,
            C,
            strideC1,
            strideC2,
            offsetC,
          );
        }
      }
      if (isTransposed(transA)) {
        sa1 = strideA2;
        sa2 = strideA1;
      } else {
        sa1 = strideA1;
        sa2 = strideA2;
      }
      if (isTransposed(transB)) {
        sb1 = strideB2;
        sb2 = strideB1;
      } else {
        sb1 = strideB1;
        sb2 = strideB2;
      }
      return blocked(
        M,
        N,
        K,
        alpha,
        A,
        sa1,
        sa2,
        offsetA,
        B,
        sb1,
        sb2,
        offsetB,
        C,
        strideC1,
        strideC2,
        offsetC,
      );
    }
    module.exports = sgemm;
  },
});

// node_modules/@stdlib/blas-base-sgemm/lib/sgemm.js
var require_sgemm = __commonJS({
  "node_modules/@stdlib/blas-base-sgemm/lib/sgemm.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTranspose = require_lib110();
    var isRowMajor = require_lib124();
    var isColumnMajor = require_lib111();
    var format = require_lib3();
    var base = require_base14();
    function sgemm(
      order,
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      LDA,
      B,
      LDB,
      beta,
      C,
      LDC,
    ) {
      var nrowsa;
      var nrowsb;
      var valc;
      var isrm;
      var iscm;
      var sa1;
      var sa2;
      var sb1;
      var sb2;
      var sc1;
      var sc2;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTranspose(transA)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            transA,
          ),
        );
      }
      if (!isMatrixTranspose(transB)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            transB,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (K < 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be a nonnegative integer. Value: `%d`.",
            K,
          ),
        );
      }
      isrm = isRowMajor(order);
      iscm = isColumnMajor(order);
      if (
        (isrm && transA === "no-transpose") ||
        (iscm && transA === "transpose")
      ) {
        nrowsa = K;
      } else {
        nrowsa = M;
      }
      if (
        (isrm && transB === "no-transpose") ||
        (iscm && transB === "transpose")
      ) {
        nrowsb = N;
      } else {
        nrowsb = K;
      }
      if (LDA < max(1, nrowsa)) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            nrowsa,
            LDA,
          ),
        );
      }
      if (LDB < max(1, nrowsb)) {
        throw new RangeError(
          format(
            "invalid argument. Eleventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            nrowsb,
            LDB,
          ),
        );
      }
      if (isrm) {
        valc = N;
      } else {
        valc = M;
      }
      if (LDC < max(1, valc)) {
        throw new RangeError(
          format(
            "invalid argument. Fourteenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            valc,
            LDC,
          ),
        );
      }
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
        sb1 = 1;
        sb2 = LDB;
        sc1 = 1;
        sc2 = LDC;
      } else {
        sa1 = LDA;
        sa2 = 1;
        sb1 = LDB;
        sb2 = 1;
        sc1 = LDC;
        sc2 = 1;
      }
      return base(
        transA,
        transB,
        M,
        N,
        K,
        alpha,
        A,
        sa1,
        sa2,
        0,
        B,
        sb1,
        sb2,
        0,
        beta,
        C,
        sc1,
        sc2,
        0,
      );
    }
    module.exports = sgemm;
  },
});

// node_modules/@stdlib/blas-base-sgemm/lib/ndarray.js
var require_ndarray36 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemm/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTranspose = require_lib110();
    var format = require_lib3();
    var base = require_base14();
    function sgemm(
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      beta,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      if (!isMatrixTranspose(transA)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid transpose operation. Value: `%s`.",
            transA,
          ),
        );
      }
      if (!isMatrixTranspose(transB)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            transB,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            N,
          ),
        );
      }
      if (K < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            K,
          ),
        );
      }
      if (strideC1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventeenth argument must be non-zero. Value: `%d`.",
            strideC1,
          ),
        );
      }
      if (strideC2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighteenth argument must be non-zero. Value: `%d`.",
            strideC2,
          ),
        );
      }
      return base(
        transA,
        transB,
        M,
        N,
        K,
        alpha,
        A,
        strideA1,
        strideA2,
        offsetA,
        B,
        strideB1,
        strideB2,
        offsetB,
        beta,
        C,
        strideC1,
        strideC2,
        offsetC,
      );
    }
    module.exports = sgemm;
  },
});

// node_modules/@stdlib/blas-base-sgemm/lib/main.js
var require_main158 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemm/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var sgemm = require_sgemm();
    var ndarray = require_ndarray36();
    setReadOnly(sgemm, "ndarray", ndarray);
    module.exports = sgemm;
  },
});

// node_modules/@stdlib/blas-base-sgemm/lib/index.js
var require_lib148 = __commonJS({
  "node_modules/@stdlib/blas-base-sgemm/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main158();
    var sgemm;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      sgemm = main;
    } else {
      sgemm = tmp;
    }
    module.exports = sgemm;
  },
});

// node_modules/@stdlib/blas-base-dgemm/lib/base.js
var require_base15 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemm/lib/base.js"(exports, module) {
    "use strict";
    var isRowMajor = require_lib113();
    var ddot = require_main26().ndarray;
    var blockSize = require_lib147();
    var bsize = blockSize("float64", "float64");
    function isTransposed(str) {
      return str !== "no-transpose";
    }
    function zeros(M, N, X, strideX1, strideX2, offsetX) {
      var dx0;
      var dx1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ix;
      if (isRowMajor([strideX1, strideX2])) {
        S0 = N;
        S1 = M;
        dx0 = strideX2;
        dx1 = strideX1 - S0 * strideX2;
      } else {
        S0 = M;
        S1 = N;
        dx0 = strideX1;
        dx1 = strideX2 - S0 * strideX1;
      }
      ix = offsetX;
      for (i1 = 0; i1 < S1; i1++) {
        for (i0 = 0; i0 < S0; i0++) {
          X[ix] = 0;
          ix += dx0;
        }
        ix += dx1;
      }
      return X;
    }
    function scal(M, N, beta, X, strideX1, strideX2, offsetX) {
      var dx0;
      var dx1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ix;
      if (isRowMajor([strideX1, strideX2])) {
        S0 = N;
        S1 = M;
        dx0 = strideX2;
        dx1 = strideX1 - S0 * strideX2;
      } else {
        S0 = M;
        S1 = N;
        dx0 = strideX1;
        dx1 = strideX2 - S0 * strideX1;
      }
      ix = offsetX;
      for (i1 = 0; i1 < S1; i1++) {
        for (i0 = 0; i0 < S0; i0++) {
          X[ix] *= beta;
          ix += dx0;
        }
        ix += dx1;
      }
      return X;
    }
    function naive(
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var da0;
      var db0;
      var dc0;
      var dc1;
      var S0;
      var S1;
      var i0;
      var i1;
      var ia;
      var ib;
      var ic;
      S0 = N;
      S1 = M;
      da0 = strideA2;
      db0 = strideB1;
      dc0 = strideC2;
      dc1 = strideC1 - S0 * strideC2;
      ic = offsetC;
      for (i1 = 0; i1 < S1; i1++) {
        ia = offsetA + i1 * strideA1;
        for (i0 = 0; i0 < S0; i0++) {
          ib = offsetB + i0 * strideB2;
          C[ic] += alpha * ddot(K, A, da0, ia, B, db0, ib);
          ic += dc0;
        }
        ic += dc1;
      }
      return C;
    }
    function blocked(
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var da0;
      var db0;
      var dc0;
      var dc1;
      var oa1;
      var ob0;
      var oc0;
      var oc1;
      var S0;
      var S1;
      var s0;
      var s1;
      var sk;
      var i0;
      var i1;
      var j0;
      var j1;
      var ia;
      var ib;
      var ic;
      var oa;
      var ob;
      var k;
      S0 = N;
      S1 = M;
      da0 = strideA2;
      db0 = strideB1;
      dc0 = strideC2;
      for (j1 = S1; j1 > 0;) {
        if (j1 < bsize) {
          s1 = j1;
          j1 = 0;
        } else {
          s1 = bsize;
          j1 -= bsize;
        }
        oa1 = offsetA + j1 * strideA1;
        oc1 = offsetC + j1 * strideC1;
        for (j0 = S0; j0 > 0;) {
          if (j0 < bsize) {
            s0 = j0;
            j0 = 0;
          } else {
            s0 = bsize;
            j0 -= bsize;
          }
          ob0 = offsetB + j0 * strideB2;
          oc0 = oc1 + j0 * strideC2;
          dc1 = strideC1 - s0 * strideC2;
          for (k = K; k > 0;) {
            if (k < bsize) {
              sk = k;
              k = 0;
            } else {
              sk = bsize;
              k -= bsize;
            }
            oa = oa1 + k * strideA2;
            ob = ob0 + k * strideB1;
            ic = oc0;
            for (i1 = 0; i1 < s1; i1++) {
              ia = oa + i1 * strideA1;
              for (i0 = 0; i0 < s0; i0++) {
                ib = ob + i0 * strideB2;
                C[ic] += alpha * ddot(sk, A, da0, ia, B, db0, ib);
                ic += dc0;
              }
              ic += dc1;
            }
          }
        }
      }
      return C;
    }
    function dgemm(
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      beta,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      var isrma;
      var isrmb;
      var sa1;
      var sa2;
      var sb1;
      var sb2;
      if (M === 0 || N === 0 || (beta === 1 && (alpha === 0 || K === 0))) {
        return C;
      }
      if (beta === 0) {
        C = zeros(M, N, C, strideC1, strideC2, offsetC);
      } else if (beta !== 1) {
        C = scal(M, N, beta, C, strideC1, strideC2, offsetC);
      }
      if (alpha === 0) {
        return C;
      }
      isrma = isRowMajor([strideA1, strideA2]);
      isrmb = isRowMajor([strideB1, strideB2]);
      if (isrma) {
        if (!isTransposed(transA)) {
          if (!isrmb && !isTransposed(transB)) {
            return naive(
              M,
              N,
              K,
              alpha,
              A,
              strideA1,
              strideA2,
              offsetA,
              B,
              strideB1,
              strideB2,
              offsetB,
              C,
              strideC1,
              strideC2,
              offsetC,
            );
          }
          if (isrmb && isTransposed(transB)) {
            return naive(
              M,
              N,
              K,
              alpha,
              A,
              strideA1,
              strideA2,
              offsetA,
              B,
              strideB2,
              strideB1,
              offsetB,
              C,
              strideC1,
              strideC2,
              offsetC,
            );
          }
        }
      } else if (isTransposed(transA)) {
        if (isrmb && isTransposed(transB)) {
          return naive(
            M,
            N,
            K,
            alpha,
            A,
            strideA2,
            strideA1,
            offsetA,
            B,
            strideB2,
            strideB1,
            offsetB,
            C,
            strideC1,
            strideC2,
            offsetC,
          );
        }
        if (!isrmb && !isTransposed(transB)) {
          return naive(
            M,
            N,
            K,
            alpha,
            A,
            strideA2,
            strideA1,
            offsetA,
            B,
            strideB1,
            strideB2,
            offsetB,
            C,
            strideC1,
            strideC2,
            offsetC,
          );
        }
      }
      if (isTransposed(transA)) {
        sa1 = strideA2;
        sa2 = strideA1;
      } else {
        sa1 = strideA1;
        sa2 = strideA2;
      }
      if (isTransposed(transB)) {
        sb1 = strideB2;
        sb2 = strideB1;
      } else {
        sb1 = strideB1;
        sb2 = strideB2;
      }
      return blocked(
        M,
        N,
        K,
        alpha,
        A,
        sa1,
        sa2,
        offsetA,
        B,
        sb1,
        sb2,
        offsetB,
        C,
        strideC1,
        strideC2,
        offsetC,
      );
    }
    module.exports = dgemm;
  },
});

// node_modules/@stdlib/blas-base-dgemm/lib/dgemm.js
var require_dgemm = __commonJS({
  "node_modules/@stdlib/blas-base-dgemm/lib/dgemm.js"(exports, module) {
    "use strict";
    var max = require_lib112();
    var isLayout = require_lib108();
    var isMatrixTranspose = require_lib110();
    var isRowMajor = require_lib124();
    var isColumnMajor = require_lib111();
    var format = require_lib3();
    var base = require_base15();
    function dgemm(
      order,
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      LDA,
      B,
      LDB,
      beta,
      C,
      LDC,
    ) {
      var nrowsa;
      var nrowsb;
      var valc;
      var isrm;
      var iscm;
      var sa1;
      var sa2;
      var sb1;
      var sb2;
      var sc1;
      var sc2;
      if (!isLayout(order)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid order. Value: `%s`.",
            order,
          ),
        );
      }
      if (!isMatrixTranspose(transA)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            transA,
          ),
        );
      }
      if (!isMatrixTranspose(transB)) {
        throw new TypeError(
          format(
            "invalid argument. Third argument must be a valid transpose operation. Value: `%s`.",
            transB,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (K < 0) {
        throw new RangeError(
          format(
            "invalid argument. Sixth argument must be a nonnegative integer. Value: `%d`.",
            K,
          ),
        );
      }
      isrm = isRowMajor(order);
      iscm = isColumnMajor(order);
      if (
        (isrm && transA === "no-transpose") ||
        (iscm && transA === "transpose")
      ) {
        nrowsa = K;
      } else {
        nrowsa = M;
      }
      if (
        (isrm && transB === "no-transpose") ||
        (iscm && transB === "transpose")
      ) {
        nrowsb = N;
      } else {
        nrowsb = K;
      }
      if (LDA < max(1, nrowsa)) {
        throw new RangeError(
          format(
            "invalid argument. Ninth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            nrowsa,
            LDA,
          ),
        );
      }
      if (LDB < max(1, nrowsb)) {
        throw new RangeError(
          format(
            "invalid argument. Eleventh argument must be greater than or equal to max(1,%d). Value: `%d`.",
            nrowsb,
            LDB,
          ),
        );
      }
      if (isrm) {
        valc = N;
      } else {
        valc = M;
      }
      if (LDC < max(1, valc)) {
        throw new RangeError(
          format(
            "invalid argument. Fourteenth argument must be greater than or equal to max(1,%d). Value: `%d`.",
            valc,
            LDC,
          ),
        );
      }
      if (iscm) {
        sa1 = 1;
        sa2 = LDA;
        sb1 = 1;
        sb2 = LDB;
        sc1 = 1;
        sc2 = LDC;
      } else {
        sa1 = LDA;
        sa2 = 1;
        sb1 = LDB;
        sb2 = 1;
        sc1 = LDC;
        sc2 = 1;
      }
      return base(
        transA,
        transB,
        M,
        N,
        K,
        alpha,
        A,
        sa1,
        sa2,
        0,
        B,
        sb1,
        sb2,
        0,
        beta,
        C,
        sc1,
        sc2,
        0,
      );
    }
    module.exports = dgemm;
  },
});

// node_modules/@stdlib/blas-base-dgemm/lib/ndarray.js
var require_ndarray37 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemm/lib/ndarray.js"(exports, module) {
    "use strict";
    var isMatrixTranspose = require_lib110();
    var format = require_lib3();
    var base = require_base15();
    function dgemm(
      transA,
      transB,
      M,
      N,
      K,
      alpha,
      A,
      strideA1,
      strideA2,
      offsetA,
      B,
      strideB1,
      strideB2,
      offsetB,
      beta,
      C,
      strideC1,
      strideC2,
      offsetC,
    ) {
      if (!isMatrixTranspose(transA)) {
        throw new TypeError(
          format(
            "invalid argument. First argument must be a valid transpose operation. Value: `%s`.",
            transA,
          ),
        );
      }
      if (!isMatrixTranspose(transB)) {
        throw new TypeError(
          format(
            "invalid argument. Second argument must be a valid transpose operation. Value: `%s`.",
            transB,
          ),
        );
      }
      if (M < 0) {
        throw new RangeError(
          format(
            "invalid argument. Third argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (N < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.",
            M,
          ),
        );
      }
      if (K < 0) {
        throw new RangeError(
          format(
            "invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.",
            K,
          ),
        );
      }
      if (strideC1 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Seventeenth argument must be non-zero. Value: `%d`.",
            strideC1,
          ),
        );
      }
      if (strideC2 === 0) {
        throw new RangeError(
          format(
            "invalid argument. Eighteenth argument must be non-zero. Value: `%d`.",
            strideC2,
          ),
        );
      }
      return base(
        transA,
        transB,
        M,
        N,
        K,
        alpha,
        A,
        strideA1,
        strideA2,
        offsetA,
        B,
        strideB1,
        strideB2,
        offsetB,
        beta,
        C,
        strideC1,
        strideC2,
        offsetC,
      );
    }
    module.exports = dgemm;
  },
});

// node_modules/@stdlib/blas-base-dgemm/lib/main.js
var require_main159 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemm/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var dgemm = require_dgemm();
    var ndarray = require_ndarray37();
    setReadOnly(dgemm, "ndarray", ndarray);
    module.exports = dgemm;
  },
});

// node_modules/@stdlib/blas-base-dgemm/lib/index.js
var require_lib149 = __commonJS({
  "node_modules/@stdlib/blas-base-dgemm/lib/index.js"(exports, module) {
    "use strict";
    var join = (init_path(), __toCommonJS(path_exports)).join;
    var tryRequire = require_lib117();
    var isError = require_lib116();
    var main = require_main159();
    var dgemm;
    var tmp = tryRequire(join("/", "./native.js"));
    if (isError(tmp)) {
      dgemm = main;
    } else {
      dgemm = tmp;
    }
    module.exports = dgemm;
  },
});

// node_modules/@stdlib/blas-base-daxpy/lib/ndarray.js
var require_ndarray38 = __commonJS({
  "node_modules/@stdlib/blas-base-daxpy/lib/ndarray.js"(exports, module) {
    "use strict";
    var M = 4;
    function daxpy(N, alpha, x, strideX, offsetX, y, strideY, offsetY) {
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0 || alpha === 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            y[iy] += alpha * x[ix];
            ix += strideX;
            iy += strideY;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          y[iy] += alpha * x[ix];
          y[iy + 1] += alpha * x[ix + 1];
          y[iy + 2] += alpha * x[ix + 2];
          y[iy + 3] += alpha * x[ix + 3];
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        y[iy] += alpha * x[ix];
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = daxpy;
  },
});

// node_modules/@stdlib/blas-base-daxpy/lib/daxpy.js
var require_daxpy = __commonJS({
  "node_modules/@stdlib/blas-base-daxpy/lib/daxpy.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray38();
    function daxpy(N, alpha, x, strideX, y, strideY) {
      var ix;
      var iy;
      if (N <= 0 || alpha === 0) {
        return y;
      }
      ix = stride2offset(N, strideX);
      iy = stride2offset(N, strideY);
      return ndarray(N, alpha, x, strideX, ix, y, strideY, iy);
    }
    module.exports = daxpy;
  },
});

// node_modules/@stdlib/blas-base-daxpy/lib/main.js
var require_main160 = __commonJS({
  "node_modules/@stdlib/blas-base-daxpy/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var daxpy = require_daxpy();
    var ndarray = require_ndarray38();
    setReadOnly(daxpy, "ndarray", ndarray);
    module.exports = daxpy;
  },
});

// node_modules/@stdlib/complex-float32-base-mul/lib/main.js
var require_main161 = __commonJS({
  "node_modules/@stdlib/complex-float32-base-mul/lib/main.js"(exports, module) {
    "use strict";
    var f32 = require_lib16();
    var Complex64 = require_lib88();
    var realf = require_lib96();
    var imagf = require_lib97();
    function mul(z1, z2) {
      var re1 = realf(z1);
      var re2 = realf(z2);
      var im1 = imagf(z1);
      var im2 = imagf(z2);
      var re = f32(re1 * re2) - f32(im1 * im2);
      var im = f32(re1 * im2) + f32(im1 * re2);
      return new Complex64(f32(re), f32(im));
    }
    module.exports = mul;
  },
});

// node_modules/@stdlib/complex-float32-base-mul/lib/assign.js
var require_assign = __commonJS({
  "node_modules/@stdlib/complex-float32-base-mul/lib/assign.js"(
    exports,
    module,
  ) {
    "use strict";
    var f32 = require_lib16();
    function assign(re1, im1, re2, im2, out, strideOut, offsetOut) {
      out[offsetOut] = f32(re1 * re2) - f32(im1 * im2);
      out[offsetOut + strideOut] = f32(re1 * im2) + f32(im1 * re2);
      return out;
    }
    module.exports = assign;
  },
});

// node_modules/@stdlib/complex-float32-base-mul/lib/strided.js
var require_strided = __commonJS({
  "node_modules/@stdlib/complex-float32-base-mul/lib/strided.js"(
    exports,
    module,
  ) {
    "use strict";
    var f32 = require_lib16();
    function strided(
      z1,
      strideZ1,
      offsetZ1,
      z2,
      strideZ2,
      offsetZ2,
      out,
      strideOut,
      offsetOut,
    ) {
      var re1 = z1[offsetZ1];
      var im1 = z1[offsetZ1 + strideZ1];
      var re2 = z2[offsetZ2];
      var im2 = z2[offsetZ2 + strideZ2];
      out[offsetOut] = f32(re1 * re2) - f32(im1 * im2);
      out[offsetOut + strideOut] = f32(re1 * im2) + f32(im1 * re2);
      return out;
    }
    module.exports = strided;
  },
});

// node_modules/@stdlib/complex-float32-base-mul/lib/index.js
var require_lib150 = __commonJS({
  "node_modules/@stdlib/complex-float32-base-mul/lib/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main161();
    var assign = require_assign();
    var strided = require_strided();
    setReadOnly(main, "assign", assign);
    setReadOnly(main, "strided", strided);
    module.exports = main;
  },
});

// node_modules/@stdlib/blas-base-cscal/lib/ndarray.js
var require_ndarray39 = __commonJS({
  "node_modules/@stdlib/blas-base-cscal/lib/ndarray.js"(exports, module) {
    "use strict";
    var cmulf = require_lib150();
    function cscal(N, alpha, x, strideX, offsetX) {
      var ix;
      var i;
      if (N <= 0) {
        return x;
      }
      ix = offsetX;
      for (i = 0; i < N; i++) {
        x.set(cmulf(alpha, x.get(ix)), ix);
        ix += strideX;
      }
      return x;
    }
    module.exports = cscal;
  },
});

// node_modules/@stdlib/blas-base-cscal/lib/cscal.js
var require_cscal = __commonJS({
  "node_modules/@stdlib/blas-base-cscal/lib/cscal.js"(exports, module) {
    "use strict";
    var stride2offset = require_lib6();
    var ndarray = require_ndarray39();
    function cscal(N, alpha, x, strideX) {
      var ox = stride2offset(N, strideX);
      return ndarray(N, alpha, x, strideX, ox);
    }
    module.exports = cscal;
  },
});

// node_modules/@stdlib/blas-base-cscal/lib/main.js
var require_main162 = __commonJS({
  "node_modules/@stdlib/blas-base-cscal/lib/main.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var cscal = require_cscal();
    var ndarray = require_ndarray39();
    setReadOnly(cscal, "ndarray", ndarray);
    module.exports = cscal;
  },
});

// tests/helpers/stdlib.js
var import_blas_base_sscal = __toESM(require_main6(), 1);
var import_blas_base_sswap = __toESM(require_main7(), 1);
var import_blas_base_dswap = __toESM(require_main8(), 1);
var import_blas_base_saxpy = __toESM(require_main18(), 1);
var import_blas_base_scopy = __toESM(require_main19(), 1);
var import_blas_base_dcopy = __toESM(require_main20(), 1);
var import_blas_base_sdot = __toESM(require_main21(), 1);
var import_blas_base_sasum = __toESM(require_main23(), 1);
var import_blas_base_dasum = __toESM(require_main25(), 1);
var import_blas_base_ddot = __toESM(require_main26(), 1);
var import_blas_base_snrm2 = __toESM(require_main30(), 1);
var import_blas_base_dnrm2 = __toESM(require_main32(), 1);
var import_blas_base_isamax = __toESM(require_main33(), 1);
var import_blas_base_idamax = __toESM(require_main34(), 1);
var import_blas_base_srot = __toESM(require_main35(), 1);
var import_blas_base_drot = __toESM(require_main36(), 1);
var import_blas_base_srotm = __toESM(require_main37(), 1);
var import_blas_base_drotm = __toESM(require_main38(), 1);
var import_blas_base_sgemv = __toESM(require_main116(), 1);
var import_blas_base_dgemv = __toESM(require_main119(), 1);
var import_blas_base_ssymv = __toESM(require_lib123(), 1);
var import_blas_base_dsymv = __toESM(require_lib125(), 1);
var import_blas_base_strmv = __toESM(require_lib128(), 1);
var import_blas_base_dtrmv = __toESM(require_lib129(), 1);
var import_blas_base_strsv = __toESM(require_lib130(), 1);
var import_blas_base_dtrsv = __toESM(require_lib131(), 1);
var import_blas_base_sger = __toESM(require_main138(), 1);
var import_blas_base_dger = __toESM(require_main139(), 1);
var import_blas_base_ssyr = __toESM(require_main140(), 1);
var import_blas_base_dsyr = __toESM(require_lib132(), 1);
var import_blas_base_ssyr2 = __toESM(require_main142(), 1);
var import_blas_base_dsyr2 = __toESM(require_lib133(), 1);
var import_blas_base_sgemm = __toESM(require_lib148(), 1);
var import_blas_base_dgemm = __toESM(require_lib149(), 1);
var import_blas_base_dscal = __toESM(require_main118(), 1);
var import_blas_base_daxpy = __toESM(require_main160(), 1);
var import_blas_base_cscal = __toESM(require_main162(), 1);
var import_complex_float32_ctor = __toESM(require_lib88(), 1);
var import_array_complex64 = __toESM(require_lib100(), 1);
function makeReducerReference(stdlibFn) {
  return (a) => stdlibFn(a.n, a.x.slice(), a.incx);
}
function makeDotReference(stdlibFn) {
  return (a) => stdlibFn(a.n, a.x.slice(), a.incx, a.y.slice(), a.incy);
}
function makeXYReference(stdlibFn, extra = () => []) {
  return (a) => {
    const x = a.x.slice();
    const y = a.y.slice();
    stdlibFn(a.n, x, a.incx, y, a.incy, ...extra(a));
    return { x, y };
  };
}
function makeYReference(stdlibFn, prefix = () => []) {
  return (a) => {
    const y = a.y.slice();
    stdlibFn(a.n, ...prefix(a), a.x.slice(), a.incx, y, a.incy);
    return { y };
  };
}
function makeXReference(
  stdlibFn,
  prefix = () => [],
  toX = (x) => x.slice(),
  fromX = (x) => x,
) {
  return (a) => {
    const x = toX(a.x);
    stdlibFn(a.n, ...prefix(a), x, a.incx);
    return { x: fromX(x) };
  };
}
function makeMatVecReference(stdlibFn, dims) {
  return (a) => {
    const out = a.y.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.alpha,
      a.A.slice(),
      a.lda,
      a.x.slice(),
      a.incx,
      a.beta,
      out,
      a.incy,
    );
    return { y: out };
  };
}
function makeMatXReference(stdlibFn, dims) {
  return (a) => {
    const x = a.x.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.A.slice(),
      a.lda,
      x,
      a.incx,
    );
    return { x };
  };
}
function makeMatrixReference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.alpha,
      a.x.slice(),
      a.incx,
      a.y.slice(),
      a.incy,
      A,
      a.lda,
    );
    return { A };
  };
}
function makeSymMatrixReference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.alpha,
      a.x.slice(),
      a.incx,
      A,
      a.lda,
    );
    return { A };
  };
}
function makeSymMatrix2Reference(stdlibFn, dims) {
  return (a) => {
    const A = a.A.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.alpha,
      a.x.slice(),
      a.incx,
      a.y.slice(),
      a.incy,
      A,
      a.lda,
    );
    return { A };
  };
}
function makeMatMatReference(stdlibFn, dims) {
  return (a) => {
    const C = a.C.slice();
    stdlibFn(
      a.layout ?? "row-major",
      ...dims(a),
      a.alpha,
      a.A.slice(),
      a.lda,
      a.B.slice(),
      a.ldb,
      a.beta,
      C,
      a.ldc,
    );
    return { C };
  };
}
function makeMatMatTriangularReference(matMatFn) {
  return (a) => {
    const { C: full } = matMatFn(a);
    const isCM = (a.layout ?? "row-major") === "column-major";
    const out = a.C.slice();
    const isLower = a.uplo === "lower";
    const m = a.m ?? a.n;
    for (let i = 0; i < m; i++) {
      const jStart = isLower ? 0 : i;
      const jEnd = isLower ? Math.min(i + 1, a.n) : a.n;
      for (let j = jStart; j < jEnd; j++) {
        const idx = isCM ? j * a.ldc + i : i * a.ldc + j;
        out[idx] = full[idx];
      }
    }
    return { C: out };
  };
}
var sscalReference = makeXReference(import_blas_base_sscal.default, (a) => [
  a.alpha,
]);
var dscalReference = makeXReference(import_blas_base_dscal.default, (a) => [
  a.alpha,
]);
var cscalReference = makeXReference(
  import_blas_base_cscal.default,
  (a) => [new import_complex_float32_ctor.default(a.alpha.re, a.alpha.im)],
  (x) => new import_array_complex64.default(interleaveComplex32(x)),
  (x) => {
    const out = new Complex32Array(x.length);
    for (let i = 0; i < x.length; i++) {
      const z = x.get(i);
      out[i] = new Complex32(z.re, z.im);
    }
    return out;
  },
);
var sswapReference = makeXYReference(import_blas_base_sswap.default);
var dswapReference = makeXYReference(import_blas_base_dswap.default);
var srotReference = makeXYReference(import_blas_base_srot.default, (a) => [
  a.c,
  a.s,
]);
var drotReference = makeXYReference(import_blas_base_drot.default, (a) => [
  a.c,
  a.s,
]);
var srotmReference = makeXYReference(import_blas_base_srotm.default, (a) => [
  a.param,
]);
var drotmReference = makeXYReference(import_blas_base_drotm.default, (a) => [
  a.param,
]);
var saxpyReference = makeYReference(import_blas_base_saxpy.default, (a) => [
  a.alpha,
]);
var daxpyReference = makeYReference(import_blas_base_daxpy.default, (a) => [
  a.alpha,
]);
var scopyReference = makeYReference(import_blas_base_scopy.default);
var dcopyReference = makeYReference(import_blas_base_dcopy.default);
var sdotReference = makeDotReference(import_blas_base_sdot.default);
var ddotReference = makeDotReference(import_blas_base_ddot.default);
var sasumReference = makeReducerReference(import_blas_base_sasum.default);
var dasumReference = makeReducerReference(import_blas_base_dasum.default);
var snrm2Reference = makeReducerReference(import_blas_base_snrm2.default);
var dnrm2Reference = makeReducerReference(import_blas_base_dnrm2.default);
var isamaxReference = makeReducerReference(import_blas_base_isamax.default);
var idamaxReference = makeReducerReference(import_blas_base_idamax.default);
var sgemvReference = makeMatVecReference(
  import_blas_base_sgemv.default,
  (a) => [a.trans, a.m, a.n],
);
var dgemvReference = makeMatVecReference(
  import_blas_base_dgemv.default,
  (a) => [a.trans, a.m, a.n],
);
var ssymvReference = makeMatVecReference(
  import_blas_base_ssymv.default,
  (a) => [a.uplo, a.n],
);
var dsymvReference = makeMatVecReference(
  import_blas_base_dsymv.default,
  (a) => [a.uplo, a.n],
);
function strmvReference(a) {
  const xCopy = a.x.slice();
  (0, import_blas_base_strmv.default)(
    a.layout ?? "row-major",
    a.uplo,
    a.trans,
    a.diag,
    a.n,
    a.A.slice(),
    a.lda,
    xCopy,
    a.incx,
  );
  const out = new Float32Array(a.y);
  for (let i = 0; i < a.n; i++) out[i * a.incy] = xCopy[i * a.incx];
  return { y: out };
}
function dtrmvReference(a) {
  const xCopy = a.x.slice();
  (0, import_blas_base_dtrmv.default)(
    a.layout ?? "row-major",
    a.uplo,
    a.trans,
    a.diag,
    a.n,
    a.A.slice(),
    a.lda,
    xCopy,
    a.incx,
  );
  const out = new Float64Array(a.y);
  for (let i = 0; i < a.n; i++) out[i * a.incy] = xCopy[i * a.incx];
  return { y: out };
}
var strsvReference = makeMatXReference(import_blas_base_strsv.default, (a) => [
  a.uplo,
  a.trans,
  a.diag,
  a.n,
]);
var dtrsvReference = makeMatXReference(import_blas_base_dtrsv.default, (a) => [
  a.uplo,
  a.trans,
  a.diag,
  a.n,
]);
var sgerReference = makeMatrixReference(import_blas_base_sger.default, (a) => [
  a.m,
  a.n,
]);
var dgerReference = makeMatrixReference(import_blas_base_dger.default, (a) => [
  a.m,
  a.n,
]);
var ssyrReference = makeSymMatrixReference(
  import_blas_base_ssyr.default,
  (a) => [a.uplo, a.n],
);
var dsyrReference = makeSymMatrixReference(
  import_blas_base_dsyr.default,
  (a) => [a.uplo, a.n],
);
var ssyr2Reference = makeSymMatrix2Reference(
  import_blas_base_ssyr2.default,
  (a) => [a.uplo, a.n],
);
var dsyr2Reference = makeSymMatrix2Reference(
  import_blas_base_dsyr2.default,
  (a) => [a.uplo, a.n],
);
var sgemmReference = makeMatMatReference(
  import_blas_base_sgemm.default,
  (a) => [a.transA, a.transB, a.m, a.n, a.k],
);
var dgemmReference = makeMatMatReference(
  import_blas_base_dgemm.default,
  (a) => [a.transA, a.transB, a.m, a.n, a.k],
);
var sgemmtrReference = makeMatMatTriangularReference(sgemmReference);
var dgemmtrReference = makeMatMatTriangularReference(dgemmReference);
var ssyrkReference = makeMatMatTriangularReference((a) => {
  const transB = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  return sgemmReference({
    transA: a.trans,
    transB,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.A,
    lda: a.lda,
    B: a.A,
    ldb: a.lda,
    beta: a.beta,
    C: a.C,
    ldc: a.ldc,
    layout: a.layout,
  });
});
var dsyrkReference = makeMatMatTriangularReference((a) => {
  const transB = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  return dgemmReference({
    transA: a.trans,
    transB,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.A,
    lda: a.lda,
    B: a.A,
    ldb: a.lda,
    beta: a.beta,
    C: a.C,
    ldc: a.ldc,
    layout: a.layout,
  });
});
var ssyr2kReference = makeMatMatTriangularReference((a) => {
  const transOther = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  const { C: afterTerm1 } = sgemmReference({
    transA: a.trans,
    transB: transOther,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.A,
    lda: a.lda,
    B: a.B,
    ldb: a.ldb,
    beta: a.beta,
    C: a.C,
    ldc: a.ldc,
    layout: a.layout,
  });
  return sgemmReference({
    transA: a.trans,
    transB: transOther,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.B,
    lda: a.ldb,
    B: a.A,
    ldb: a.lda,
    beta: 1,
    C: afterTerm1,
    ldc: a.ldc,
    layout: a.layout,
  });
});
var dsyr2kReference = makeMatMatTriangularReference((a) => {
  const transOther = a.trans === "no-transpose" ? "transpose" : "no-transpose";
  const { C: afterTerm1 } = dgemmReference({
    transA: a.trans,
    transB: transOther,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.A,
    lda: a.lda,
    B: a.B,
    ldb: a.ldb,
    beta: a.beta,
    C: a.C,
    ldc: a.ldc,
    layout: a.layout,
  });
  return dgemmReference({
    transA: a.trans,
    transB: transOther,
    m: a.n,
    n: a.n,
    k: a.k,
    alpha: a.alpha,
    A: a.B,
    lda: a.ldb,
    B: a.A,
    ldb: a.lda,
    beta: 1,
    C: afterTerm1,
    ldc: a.ldc,
    layout: a.layout,
  });
});
function denseSymmetric(A, lda, order, uplo, layout) {
  const isCM = (layout ?? "row-major") === "column-major";
  const out = new A.constructor(order * order);
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      const isStored = uplo === "lower" ? j <= i : j >= i;
      const sr = isStored ? i : j;
      const sc = isStored ? j : i;
      out[i * order + j] = isCM ? A[sc * lda + sr] : A[sr * lda + sc];
    }
  }
  return out;
}
var makeSymmReference = (gemmReference) => (a) => {
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseSymmetric(a.A, a.lda, aOrder, a.uplo, a.layout);
  const [matA, ldA, matB, ldB] =
    a.side === "left"
      ? [denseA, aOrder, a.B, a.ldb]
      : [a.B, a.ldb, denseA, aOrder];
  return gemmReference({
    transA: "no-transpose",
    transB: "no-transpose",
    m: a.m,
    n: a.n,
    k: aOrder,
    alpha: a.alpha,
    A: matA,
    lda: ldA,
    B: matB,
    ldb: ldB,
    beta: a.beta,
    C: a.C,
    ldc: a.ldc,
    layout: a.layout,
  });
};
var ssymmReference = makeSymmReference(sgemmReference);
var dsymmReference = makeSymmReference(dgemmReference);
function denseTriangular(A, lda, order, uplo, transA, diag, layout) {
  const isCM = (layout ?? "row-major") === "column-major";
  const readA = (row, col) => (isCM ? A[col * lda + row] : A[row * lda + col]);
  const out = new A.constructor(order * order);
  const writeOut = (row, col, v) => {
    out[isCM ? col * order + row : row * order + col] = v;
  };
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      if (i === j) {
        writeOut(i, j, diag === "unit" ? 1 : readA(i, i));
        continue;
      }
      const meaningful =
        transA === "no-transpose"
          ? uplo === "lower"
            ? j <= i
            : j >= i
          : uplo === "lower"
            ? j >= i
            : j <= i;
      writeOut(
        i,
        j,
        meaningful
          ? readA(
              transA === "no-transpose" ? i : j,
              transA === "no-transpose" ? j : i,
            )
          : 0,
      );
    }
  }
  return out;
}
var makeTrmmReference = (gemmReference) => (a) => {
  const layout = a.layout ?? "row-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseTriangular(
    a.A,
    a.lda,
    aOrder,
    a.uplo,
    a.transA,
    a.diag,
    layout,
  );
  const [matA, ldA, matB, ldB] =
    a.side === "left"
      ? [denseA, aOrder, a.B, a.ldb]
      : [a.B, a.ldb, denseA, aOrder];
  const { C } = gemmReference({
    transA: "no-transpose",
    transB: "no-transpose",
    m: a.m,
    n: a.n,
    k: aOrder,
    alpha: a.alpha,
    A: matA,
    lda: ldA,
    B: matB,
    ldb: ldB,
    beta: 0,
    C: a.B,
    ldc: a.ldb,
    layout,
  });
  return { B: C };
};
var strmmReference = makeTrmmReference(sgemmReference);
var dtrmmReference = makeTrmmReference(dgemmReference);
function solveTriangular(
  denseA,
  aOrder,
  B,
  ldb,
  layout,
  m,
  n,
  side,
  alpha,
  opIsLower,
) {
  const isCM = layout === "column-major";
  const aElem = (row, col) =>
    isCM ? denseA[col * aOrder + row] : denseA[row * aOrder + col];
  const idxOf = (row, col) => (isCM ? col * ldb + row : row * ldb + col);
  const out = Float32Array.from(B);
  if (side === "left") {
    for (let step = 0; step < aOrder; step++) {
      const i = opIsLower ? step : aOrder - 1 - step;
      for (let j = 0; j < n; j++) {
        let acc = alpha * B[idxOf(i, j)];
        if (opIsLower) {
          for (let k = 0; k < i; k++) acc -= aElem(i, k) * out[idxOf(k, j)];
        } else {
          for (let k = i + 1; k < aOrder; k++)
            acc -= aElem(i, k) * out[idxOf(k, j)];
        }
        out[idxOf(i, j)] = acc / aElem(i, i);
      }
    }
  } else {
    for (let step = 0; step < aOrder; step++) {
      const j = opIsLower ? aOrder - 1 - step : step;
      for (let i = 0; i < m; i++) {
        let acc = alpha * B[idxOf(i, j)];
        if (opIsLower) {
          for (let k = j + 1; k < aOrder; k++)
            acc -= out[idxOf(i, k)] * aElem(k, j);
        } else {
          for (let k = 0; k < j; k++) acc -= out[idxOf(i, k)] * aElem(k, j);
        }
        out[idxOf(i, j)] = acc / aElem(j, j);
      }
    }
  }
  return out;
}
var strsmReference = (a) => {
  if (a.alpha === 0) return { B: new Float32Array(a.B.length) };
  const layout = a.layout ?? "row-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const denseA = denseTriangular(
    a.A,
    a.lda,
    aOrder,
    a.uplo,
    a.transA,
    a.diag,
    layout,
  );
  const opIsLower = (a.transA === "no-transpose") === (a.uplo === "lower");
  const B = solveTriangular(
    denseA,
    aOrder,
    a.B,
    a.ldb,
    layout,
    a.m,
    a.n,
    a.side,
    a.alpha,
    opIsLower,
  );
  return { B };
};

export {
  sscalReference,
  dscalReference,
  cscalReference,
  sswapReference,
  dswapReference,
  srotReference,
  drotReference,
  srotmReference,
  drotmReference,
  saxpyReference,
  daxpyReference,
  scopyReference,
  dcopyReference,
  sdotReference,
  ddotReference,
  sasumReference,
  dasumReference,
  snrm2Reference,
  dnrm2Reference,
  isamaxReference,
  idamaxReference,
  sgemvReference,
  dgemvReference,
  ssymvReference,
  dsymvReference,
  strmvReference,
  dtrmvReference,
  strsvReference,
  dtrsvReference,
  sgerReference,
  dgerReference,
  ssyrReference,
  dsyrReference,
  ssyr2Reference,
  dsyr2Reference,
  sgemmReference,
  dgemmReference,
  sgemmtrReference,
  dgemmtrReference,
  ssyrkReference,
  dsyrkReference,
  ssyr2kReference,
  dsyr2kReference,
  ssymmReference,
  dsymmReference,
  strmmReference,
  dtrmmReference,
  strsmReference,
};
/*! Bundled license information:

@stdlib/utils-define-property/lib/define_property.js:
@stdlib/utils-define-property/lib/has_define_property_support.js:
@stdlib/math-base-special-absf/lib/main.js:
@stdlib/math-base-special-abs/lib/main.js:
@stdlib/regexp-function-name/lib/main.js:
@stdlib/regexp-function-name/lib/index.js:
@stdlib/complex-float32-real/lib/main.js:
@stdlib/complex-float32-real/lib/index.js:
@stdlib/complex-float32-imag/lib/main.js:
@stdlib/complex-float32-imag/lib/index.js:
@stdlib/strided-base-reinterpret-complex64/lib/main.js:
@stdlib/strided-base-reinterpret-complex64/lib/index.js:
@stdlib/strided-base-reinterpret-complex128/lib/main.js:
@stdlib/strided-base-reinterpret-complex128/lib/index.js:
@stdlib/ndarray-base-dtype-enum2str/lib/main.js:
@stdlib/ndarray-base-dtype-enum2str/lib/index.js:
@stdlib/complex-float32-base-mul/lib/main.js:
@stdlib/complex-float32-base-mul/lib/index.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2021 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/utils-define-property/lib/builtin.js:
@stdlib/utils-define-property/lib/polyfill.js:
@stdlib/utils-define-property/lib/index.js:
@stdlib/utils-define-nonenumerable-read-only-property/lib/main.js:
@stdlib/utils-define-nonenumerable-read-only-property/lib/index.js:
@stdlib/number-float64-base-to-float32/lib/main.js:
@stdlib/assert-has-symbol-support/lib/main.js:
@stdlib/assert-has-symbol-support/lib/index.js:
@stdlib/assert-has-tostringtag-support/lib/main.js:
@stdlib/assert-has-tostringtag-support/lib/index.js:
@stdlib/utils-native-class/lib/tostring.js:
@stdlib/utils-native-class/lib/main.js:
@stdlib/assert-has-own-property/lib/main.js:
@stdlib/assert-has-own-property/lib/index.js:
@stdlib/symbol-ctor/lib/main.js:
@stdlib/symbol-ctor/lib/index.js:
@stdlib/utils-native-class/lib/tostringtag.js:
@stdlib/utils-native-class/lib/polyfill.js:
@stdlib/utils-native-class/lib/index.js:
@stdlib/assert-is-float32array/lib/main.js:
@stdlib/assert-is-float32array/lib/index.js:
@stdlib/constants-float64-pinf/lib/index.js:
@stdlib/assert-has-float32array-support/lib/float32array.js:
@stdlib/assert-has-float32array-support/lib/main.js:
@stdlib/assert-has-float32array-support/lib/index.js:
@stdlib/array-float32/lib/main.js:
@stdlib/array-float32/lib/polyfill.js:
@stdlib/array-float32/lib/index.js:
@stdlib/number-float64-base-to-float32/lib/polyfill.js:
@stdlib/number-float64-base-to-float32/lib/index.js:
@stdlib/blas-base-saxpy/lib/ndarray.js:
@stdlib/blas-base-saxpy/lib/saxpy.js:
@stdlib/blas-base-saxpy/lib/main.js:
@stdlib/blas-base-scopy/lib/main.js:
@stdlib/blas-base-dcopy/lib/main.js:
@stdlib/blas-base-sasum/lib/ndarray.js:
@stdlib/blas-base-sasum/lib/sasum.js:
@stdlib/blas-base-sasum/lib/main.js:
@stdlib/math-base-special-abs/lib/index.js:
@stdlib/blas-base-dasum/lib/ndarray.js:
@stdlib/blas-base-dasum/lib/dasum.js:
@stdlib/blas-base-dasum/lib/main.js:
@stdlib/constants-float32-max/lib/index.js:
@stdlib/math-base-special-sqrt/lib/main.js:
@stdlib/math-base-special-sqrt/lib/index.js:
@stdlib/constants-float64-max/lib/index.js:
@stdlib/math-base-special-abs2/lib/main.js:
@stdlib/math-base-special-abs2/lib/index.js:
@stdlib/assert-is-array/lib/main.js:
@stdlib/assert-is-array/lib/index.js:
@stdlib/assert-tools-array-function/lib/main.js:
@stdlib/assert-tools-array-function/lib/index.js:
@stdlib/assert-is-object-like/lib/main.js:
@stdlib/assert-is-object-like/lib/index.js:
@stdlib/assert-is-buffer/lib/main.js:
@stdlib/assert-is-buffer/lib/index.js:
@stdlib/regexp-function-name/lib/regexp.js:
@stdlib/utils-constructor-name/lib/main.js:
@stdlib/utils-constructor-name/lib/index.js:
@stdlib/assert-is-float64array/lib/main.js:
@stdlib/assert-is-float64array/lib/index.js:
@stdlib/assert-has-float64array-support/lib/float64array.js:
@stdlib/assert-has-float64array-support/lib/main.js:
@stdlib/assert-has-float64array-support/lib/index.js:
@stdlib/array-float64/lib/main.js:
@stdlib/array-float64/lib/polyfill.js:
@stdlib/array-float64/lib/index.js:
@stdlib/assert-is-uint32array/lib/main.js:
@stdlib/assert-is-uint32array/lib/index.js:
@stdlib/constants-uint32-max/lib/index.js:
@stdlib/assert-has-uint32array-support/lib/uint32array.js:
@stdlib/assert-has-uint32array-support/lib/main.js:
@stdlib/assert-has-uint32array-support/lib/index.js:
@stdlib/array-uint32/lib/main.js:
@stdlib/array-uint32/lib/polyfill.js:
@stdlib/array-uint32/lib/index.js:
@stdlib/assert-is-int32array/lib/main.js:
@stdlib/assert-is-int32array/lib/index.js:
@stdlib/constants-int32-max/lib/index.js:
@stdlib/constants-int32-min/lib/index.js:
@stdlib/assert-has-int32array-support/lib/int32array.js:
@stdlib/assert-has-int32array-support/lib/main.js:
@stdlib/assert-has-int32array-support/lib/index.js:
@stdlib/array-int32/lib/main.js:
@stdlib/array-int32/lib/polyfill.js:
@stdlib/array-int32/lib/index.js:
@stdlib/assert-is-uint16array/lib/main.js:
@stdlib/assert-is-uint16array/lib/index.js:
@stdlib/constants-uint16-max/lib/index.js:
@stdlib/assert-has-uint16array-support/lib/uint16array.js:
@stdlib/assert-has-uint16array-support/lib/main.js:
@stdlib/assert-has-uint16array-support/lib/index.js:
@stdlib/array-uint16/lib/main.js:
@stdlib/array-uint16/lib/polyfill.js:
@stdlib/array-uint16/lib/index.js:
@stdlib/assert-is-int16array/lib/main.js:
@stdlib/assert-is-int16array/lib/index.js:
@stdlib/constants-int16-max/lib/index.js:
@stdlib/constants-int16-min/lib/index.js:
@stdlib/assert-has-int16array-support/lib/int16array.js:
@stdlib/assert-has-int16array-support/lib/main.js:
@stdlib/assert-has-int16array-support/lib/index.js:
@stdlib/array-int16/lib/main.js:
@stdlib/array-int16/lib/polyfill.js:
@stdlib/array-int16/lib/index.js:
@stdlib/assert-is-uint8array/lib/main.js:
@stdlib/assert-is-uint8array/lib/index.js:
@stdlib/constants-uint8-max/lib/index.js:
@stdlib/assert-has-uint8array-support/lib/uint8array.js:
@stdlib/assert-has-uint8array-support/lib/main.js:
@stdlib/assert-has-uint8array-support/lib/index.js:
@stdlib/array-uint8/lib/main.js:
@stdlib/array-uint8/lib/polyfill.js:
@stdlib/array-uint8/lib/index.js:
@stdlib/assert-is-uint8clampedarray/lib/main.js:
@stdlib/assert-is-uint8clampedarray/lib/index.js:
@stdlib/assert-has-uint8clampedarray-support/lib/uint8clampedarray.js:
@stdlib/assert-has-uint8clampedarray-support/lib/main.js:
@stdlib/assert-has-uint8clampedarray-support/lib/index.js:
@stdlib/array-uint8c/lib/main.js:
@stdlib/array-uint8c/lib/polyfill.js:
@stdlib/array-uint8c/lib/index.js:
@stdlib/assert-is-int8array/lib/main.js:
@stdlib/assert-is-int8array/lib/index.js:
@stdlib/constants-int8-max/lib/index.js:
@stdlib/constants-int8-min/lib/index.js:
@stdlib/assert-has-int8array-support/lib/int8array.js:
@stdlib/assert-has-int8array-support/lib/main.js:
@stdlib/assert-has-int8array-support/lib/index.js:
@stdlib/array-int8/lib/main.js:
@stdlib/array-int8/lib/polyfill.js:
@stdlib/array-int8/lib/index.js:
@stdlib/assert-is-number/lib/primitive.js:
@stdlib/number-ctor/lib/main.js:
@stdlib/number-ctor/lib/index.js:
@stdlib/assert-is-number/lib/tostring.js:
@stdlib/assert-is-number/lib/try2serialize.js:
@stdlib/assert-is-number/lib/object.js:
@stdlib/assert-is-number/lib/main.js:
@stdlib/assert-is-number/lib/index.js:
@stdlib/constants-float64-ninf/lib/index.js:
@stdlib/math-base-special-floor/lib/main.js:
@stdlib/math-base-special-floor/lib/index.js:
@stdlib/math-base-assert-is-integer/lib/main.js:
@stdlib/math-base-assert-is-integer/lib/index.js:
@stdlib/assert-is-integer/lib/integer.js:
@stdlib/assert-is-integer/lib/primitive.js:
@stdlib/assert-is-integer/lib/object.js:
@stdlib/assert-is-integer/lib/main.js:
@stdlib/assert-is-integer/lib/index.js:
@stdlib/assert-is-nonnegative-integer/lib/primitive.js:
@stdlib/assert-is-nonnegative-integer/lib/object.js:
@stdlib/assert-is-nonnegative-integer/lib/main.js:
@stdlib/assert-is-nonnegative-integer/lib/index.js:
@stdlib/constants-array-max-array-length/lib/index.js:
@stdlib/assert-is-array-like-object/lib/main.js:
@stdlib/assert-is-array-like-object/lib/index.js:
@stdlib/constants-array-max-typed-array-length/lib/index.js:
@stdlib/assert-is-collection/lib/main.js:
@stdlib/assert-is-collection/lib/index.js:
@stdlib/assert-is-arraybuffer/lib/main.js:
@stdlib/assert-is-arraybuffer/lib/index.js:
@stdlib/assert-is-object/lib/main.js:
@stdlib/assert-is-object/lib/index.js:
@stdlib/assert-is-string/lib/primitive.js:
@stdlib/assert-is-string/lib/valueof.js:
@stdlib/assert-is-string/lib/try2valueof.js:
@stdlib/assert-is-string/lib/object.js:
@stdlib/assert-is-string/lib/main.js:
@stdlib/assert-is-string/lib/index.js:
@stdlib/assert-is-string-array/lib/index.js:
@stdlib/utils-type-of/lib/fixtures/re.js:
@stdlib/assert-is-boolean/lib/primitive.js:
@stdlib/assert-is-boolean/lib/tostring.js:
@stdlib/assert-is-boolean/lib/try2serialize.js:
@stdlib/assert-is-boolean/lib/object.js:
@stdlib/assert-is-boolean/lib/main.js:
@stdlib/assert-is-boolean/lib/index.js:
@stdlib/utils-global/lib/codegen.js:
@stdlib/utils-global/lib/self.js:
@stdlib/utils-global/lib/window.js:
@stdlib/utils-type-of/lib/fixtures/nodelist.js:
@stdlib/utils-type-of/lib/fixtures/typedarray.js:
@stdlib/utils-type-of/lib/check.js:
@stdlib/utils-type-of/lib/main.js:
@stdlib/utils-type-of/lib/polyfill.js:
@stdlib/utils-type-of/lib/index.js:
@stdlib/assert-is-function/lib/main.js:
@stdlib/assert-is-function/lib/index.js:
@stdlib/utils-define-read-only-property/lib/main.js:
@stdlib/utils-define-read-only-property/lib/index.js:
@stdlib/complex-float64-ctor/lib/tostring.js:
@stdlib/complex-float64-ctor/lib/tojson.js:
@stdlib/complex-float64-ctor/lib/main.js:
@stdlib/complex-float64-ctor/lib/index.js:
@stdlib/complex-float32-ctor/lib/tostring.js:
@stdlib/complex-float32-ctor/lib/tojson.js:
@stdlib/complex-float32-ctor/lib/main.js:
@stdlib/complex-float32-ctor/lib/index.js:
@stdlib/assert-is-complex-like/lib/main.js:
@stdlib/assert-is-complex-like/lib/index.js:
@stdlib/math-base-assert-is-even/lib/main.js:
@stdlib/math-base-assert-is-even/lib/index.js:
@stdlib/assert-has-iterator-symbol-support/lib/main.js:
@stdlib/assert-has-iterator-symbol-support/lib/index.js:
@stdlib/symbol-iterator/lib/main.js:
@stdlib/symbol-iterator/lib/index.js:
@stdlib/utils-define-nonenumerable-read-only-accessor/lib/main.js:
@stdlib/utils-define-nonenumerable-read-only-accessor/lib/index.js:
@stdlib/array-complex64/lib/from_iterator.js:
@stdlib/array-complex64/lib/from_iterator_map.js:
@stdlib/array-complex64/lib/from_array.js:
@stdlib/array-complex64/lib/main.js:
@stdlib/array-complex64/lib/index.js:
@stdlib/complex-float64-real/lib/main.js:
@stdlib/complex-float64-real/lib/index.js:
@stdlib/complex-float64-imag/lib/main.js:
@stdlib/complex-float64-imag/lib/index.js:
@stdlib/array-complex128/lib/from_iterator.js:
@stdlib/array-complex128/lib/from_iterator_map.js:
@stdlib/array-complex128/lib/from_array.js:
@stdlib/array-complex128/lib/index.js:
@stdlib/array-dtype/lib/main.js:
@stdlib/array-dtype/lib/index.js:
@stdlib/math-base-special-fast-max/lib/main.js:
@stdlib/math-base-special-fast-max/lib/index.js:
@stdlib/ndarray-base-assert-is-row-major/lib/main.js:
@stdlib/ndarray-base-assert-is-row-major/lib/index.js:
@stdlib/utils-get-prototype-of/lib/native.js:
@stdlib/utils-get-prototype-of/lib/proto.js:
@stdlib/utils-get-prototype-of/lib/polyfill.js:
@stdlib/utils-get-prototype-of/lib/detect.js:
@stdlib/utils-get-prototype-of/lib/main.js:
@stdlib/utils-get-prototype-of/lib/index.js:
@stdlib/assert-is-error/lib/main.js:
@stdlib/assert-is-error/lib/index.js:
@stdlib/utils-try-require/lib/main.js:
@stdlib/utils-try-require/lib/index.js:
@stdlib/math-base-assert-is-positive-zero/lib/main.js:
@stdlib/math-base-assert-is-positive-zero/lib/index.js:
@stdlib/math-base-assert-is-nan/lib/main.js:
@stdlib/math-base-assert-is-nan/lib/index.js:
@stdlib/math-base-special-max/lib/main.js:
@stdlib/math-base-special-max/lib/index.js:
@stdlib/assert-is-positive-integer/lib/primitive.js:
@stdlib/assert-is-positive-integer/lib/object.js:
@stdlib/assert-is-positive-integer/lib/main.js:
@stdlib/assert-is-positive-integer/lib/index.js:
@stdlib/utils-keys/lib/builtin.js:
@stdlib/utils-keys/lib/has_arguments_bug.js:
@stdlib/utils-keys/lib/has_builtin.js:
@stdlib/assert-is-arguments/lib/main.js:
@stdlib/assert-is-arguments/lib/detect.js:
@stdlib/assert-is-nan/lib/primitive.js:
@stdlib/assert-is-nan/lib/object.js:
@stdlib/assert-is-nan/lib/main.js:
@stdlib/assert-is-nan/lib/index.js:
@stdlib/assert-is-enumerable-property/lib/native.js:
@stdlib/assert-is-enumerable-property/lib/has_string_enumerability_bug.js:
@stdlib/assert-is-enumerable-property/lib/main.js:
@stdlib/assert-is-enumerable-property/lib/index.js:
@stdlib/assert-is-arguments/lib/polyfill.js:
@stdlib/assert-is-arguments/lib/index.js:
@stdlib/utils-keys/lib/builtin_wrapper.js:
@stdlib/utils-noop/lib/main.js:
@stdlib/utils-noop/lib/index.js:
@stdlib/utils-keys/lib/has_enumerable_prototype_bug.js:
@stdlib/utils-keys/lib/has_non_enumerable_properties_bug.js:
@stdlib/utils-index-of/lib/main.js:
@stdlib/utils-index-of/lib/index.js:
@stdlib/utils-keys/lib/is_constructor_prototype.js:
@stdlib/utils-keys/lib/window.js:
@stdlib/utils-keys/lib/has_automation_equality_bug.js:
@stdlib/utils-keys/lib/has_window.js:
@stdlib/utils-keys/lib/is_constructor_prototype_wrapper.js:
@stdlib/utils-keys/lib/polyfill.js:
@stdlib/utils-keys/lib/main.js:
@stdlib/utils-keys/lib/index.js:
@stdlib/assert-is-plain-object/lib/main.js:
@stdlib/assert-is-plain-object/lib/index.js:
@stdlib/object-inverse/lib/main.js:
@stdlib/object-inverse/lib/index.js:
@stdlib/ndarray-base-bytes-per-element/lib/main.js:
@stdlib/ndarray-base-bytes-per-element/lib/index.js:
@stdlib/blas-base-daxpy/lib/ndarray.js:
@stdlib/blas-base-daxpy/lib/daxpy.js:
@stdlib/blas-base-daxpy/lib/main.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2018 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/string-base-format-interpolate/lib/is_number.js:
@stdlib/string-base-format-interpolate/lib/zero_pad.js:
@stdlib/string-base-format-interpolate/lib/format_integer.js:
@stdlib/string-base-format-interpolate/lib/is_string.js:
@stdlib/string-base-format-interpolate/lib/format_double.js:
@stdlib/string-base-format-interpolate/lib/space_pad.js:
@stdlib/string-base-format-interpolate/lib/main.js:
@stdlib/string-base-format-interpolate/lib/index.js:
@stdlib/string-base-format-tokenize/lib/main.js:
@stdlib/string-base-format-tokenize/lib/index.js:
@stdlib/string-format/lib/is_string.js:
@stdlib/string-format/lib/main.js:
@stdlib/string-format/lib/index.js:
@stdlib/array-base-assert-is-accessor-array/lib/main.js:
@stdlib/array-base-assert-is-accessor-array/lib/index.js:
@stdlib/array-base-accessor-getter/lib/main.js:
@stdlib/array-base-accessor-getter/lib/index.js:
@stdlib/array-base-getter/lib/main.js:
@stdlib/array-base-getter/lib/index.js:
@stdlib/boolean-ctor/lib/main.js:
@stdlib/boolean-ctor/lib/index.js:
@stdlib/utils-global/lib/global_this.js:
@stdlib/utils-global/lib/browser.js:
@stdlib/object-ctor/lib/main.js:
@stdlib/object-ctor/lib/index.js:
@stdlib/ndarray-base-unary-tiling-block-size/lib/main.js:
@stdlib/ndarray-base-unary-tiling-block-size/lib/index.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2022 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/strided-base-stride2offset/lib/main.js:
@stdlib/strided-base-stride2offset/lib/index.js:
@stdlib/blas-base-sscal/lib/ndarray.js:
@stdlib/blas-base-sscal/lib/sscal.js:
@stdlib/blas-base-isamax/lib/ndarray.js:
@stdlib/blas-base-isamax/lib/isamax.js:
@stdlib/blas-base-idamax/lib/ndarray.js:
@stdlib/blas-base-idamax/lib/idamax.js:
@stdlib/blas-base-idamax/lib/main.js:
@stdlib/blas-base-srot/lib/ndarray.js:
@stdlib/blas-base-srot/lib/srot.js:
@stdlib/blas-base-srot/lib/main.js:
@stdlib/blas-base-drot/lib/ndarray.js:
@stdlib/blas-base-drot/lib/drot.js:
@stdlib/blas-base-drot/lib/main.js:
@stdlib/blas-base-srotm/lib/ndarray.js:
@stdlib/blas-base-srotm/lib/srotm.js:
@stdlib/blas-base-srotm/lib/main.js:
@stdlib/blas-base-drotm/lib/ndarray.js:
@stdlib/blas-base-drotm/lib/drotm.js:
@stdlib/blas-base-drotm/lib/main.js:
@stdlib/array-dtype/lib/ctor2dtype.js:
@stdlib/array-base-assert-is-complex64array/lib/main.js:
@stdlib/array-base-assert-is-complex64array/lib/index.js:
@stdlib/array-base-assert-is-complex128array/lib/main.js:
@stdlib/array-base-assert-is-complex128array/lib/index.js:
@stdlib/array-complex128/lib/main.js:
@stdlib/array-bool/lib/from_iterator.js:
@stdlib/array-bool/lib/from_iterator_map.js:
@stdlib/array-bool/lib/from_array.js:
@stdlib/array-bool/lib/main.js:
@stdlib/array-bool/lib/index.js:
@stdlib/array-dtype/lib/ctors.js:
@stdlib/array-dtype/lib/dtypes.js:
@stdlib/blas-base-layouts/lib/main.js:
@stdlib/blas-base-layouts/lib/enum.js:
@stdlib/blas-base-layouts/lib/index.js:
@stdlib/blas-base-assert-is-layout/lib/main.js:
@stdlib/blas-base-assert-is-layout/lib/index.js:
@stdlib/blas-base-transpose-operations/lib/main.js:
@stdlib/blas-base-transpose-operations/lib/enum.js:
@stdlib/blas-base-transpose-operations/lib/index.js:
@stdlib/blas-base-assert-is-transpose-operation/lib/main.js:
@stdlib/blas-base-assert-is-transpose-operation/lib/index.js:
@stdlib/blas-base-sgemv/lib/base.js:
@stdlib/blas-base-sgemv/lib/sgemv.js:
@stdlib/blas-base-sgemv/lib/ndarray.js:
@stdlib/blas-base-sgemv/lib/main.js:
@stdlib/blas-base-dgemv/lib/base.js:
@stdlib/blas-base-dgemv/lib/dgemv.js:
@stdlib/blas-base-dgemv/lib/ndarray.js:
@stdlib/blas-base-dgemv/lib/main.js:
@stdlib/blas-base-matrix-triangles/lib/main.js:
@stdlib/blas-base-matrix-triangles/lib/enum.js:
@stdlib/blas-base-matrix-triangles/lib/index.js:
@stdlib/blas-base-assert-is-matrix-triangle/lib/main.js:
@stdlib/blas-base-assert-is-matrix-triangle/lib/index.js:
@stdlib/blas-base-ssymv/lib/ssymv.js:
@stdlib/blas-base-ssymv/lib/ndarray.js:
@stdlib/blas-base-ssymv/lib/main.js:
@stdlib/blas-base-ssymv/lib/index.js:
@stdlib/blas-base-dsymv/lib/dsymv.js:
@stdlib/blas-base-dsymv/lib/ndarray.js:
@stdlib/blas-base-dsymv/lib/main.js:
@stdlib/blas-base-dsymv/lib/index.js:
@stdlib/blas-base-diagonal-types/lib/main.js:
@stdlib/blas-base-diagonal-types/lib/enum.js:
@stdlib/blas-base-diagonal-types/lib/index.js:
@stdlib/blas-base-assert-is-diagonal-type/lib/main.js:
@stdlib/blas-base-assert-is-diagonal-type/lib/index.js:
@stdlib/blas-base-strmv/lib/base.js:
@stdlib/blas-base-strmv/lib/strmv.js:
@stdlib/blas-base-strmv/lib/ndarray.js:
@stdlib/blas-base-strmv/lib/main.js:
@stdlib/blas-base-strmv/lib/index.js:
@stdlib/blas-base-dtrmv/lib/base.js:
@stdlib/blas-base-dtrmv/lib/dtrmv.js:
@stdlib/blas-base-dtrmv/lib/ndarray.js:
@stdlib/blas-base-dtrmv/lib/main.js:
@stdlib/blas-base-dtrmv/lib/index.js:
@stdlib/blas-base-strsv/lib/base.js:
@stdlib/blas-base-strsv/lib/strsv.js:
@stdlib/blas-base-strsv/lib/ndarray.js:
@stdlib/blas-base-strsv/lib/main.js:
@stdlib/blas-base-strsv/lib/index.js:
@stdlib/blas-base-dtrsv/lib/base.js:
@stdlib/blas-base-dtrsv/lib/dtrsv.js:
@stdlib/blas-base-dtrsv/lib/ndarray.js:
@stdlib/blas-base-dtrsv/lib/main.js:
@stdlib/blas-base-dtrsv/lib/index.js:
@stdlib/blas-base-dger/lib/dger.js:
@stdlib/blas-base-dger/lib/ndarray.js:
@stdlib/blas-base-dger/lib/main.js:
@stdlib/blas-base-ssyr/lib/base.js:
@stdlib/blas-base-ssyr/lib/ssyr.js:
@stdlib/blas-base-ssyr/lib/ndarray.js:
@stdlib/blas-base-ssyr/lib/main.js:
@stdlib/blas-base-dsyr/lib/base.js:
@stdlib/blas-base-dsyr/lib/dsyr.js:
@stdlib/blas-base-dsyr/lib/ndarray.js:
@stdlib/blas-base-dsyr/lib/main.js:
@stdlib/blas-base-dsyr/lib/index.js:
@stdlib/blas-base-ssyr2/lib/base.js:
@stdlib/blas-base-ssyr2/lib/ssyr2.js:
@stdlib/blas-base-ssyr2/lib/ndarray.js:
@stdlib/blas-base-ssyr2/lib/main.js:
@stdlib/blas-base-dsyr2/lib/base.js:
@stdlib/blas-base-dsyr2/lib/dsyr2.js:
@stdlib/blas-base-dsyr2/lib/ndarray.js:
@stdlib/blas-base-dsyr2/lib/main.js:
@stdlib/blas-base-dsyr2/lib/index.js:
@stdlib/blas-base-sgemm/lib/base.js:
@stdlib/blas-base-sgemm/lib/sgemm.js:
@stdlib/blas-base-sgemm/lib/ndarray.js:
@stdlib/blas-base-sgemm/lib/main.js:
@stdlib/blas-base-sgemm/lib/index.js:
@stdlib/blas-base-dgemm/lib/base.js:
@stdlib/blas-base-dgemm/lib/dgemm.js:
@stdlib/blas-base-dgemm/lib/ndarray.js:
@stdlib/blas-base-dgemm/lib/main.js:
@stdlib/blas-base-dgemm/lib/index.js:
@stdlib/blas-base-cscal/lib/ndarray.js:
@stdlib/blas-base-cscal/lib/cscal.js:
@stdlib/blas-base-cscal/lib/main.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2024 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/blas-base-sscal/lib/main.js:
@stdlib/blas-base-sdot/lib/main.js:
@stdlib/blas-base-ddot/lib/ndarray.js:
@stdlib/blas-base-ddot/lib/ddot.js:
@stdlib/blas-base-ddot/lib/main.js:
@stdlib/blas-base-isamax/lib/main.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2019 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/blas-base-sswap/lib/ndarray.js:
@stdlib/blas-base-sswap/lib/main.js:
@stdlib/blas-base-dswap/lib/main.js:
@stdlib/math-base-special-absf/lib/index.js:
@stdlib/math-base-special-abs2f/lib/main.js:
@stdlib/math-base-special-abs2f/lib/index.js:
@stdlib/math-base-special-sqrtf/lib/main.js:
@stdlib/math-base-special-sqrtf/lib/index.js:
@stdlib/blas-base-snrm2/lib/main.js:
@stdlib/blas-base-dnrm2/lib/dnrm2.js:
@stdlib/blas-base-dnrm2/lib/main.js:
@stdlib/blas-ext-base-sfill/lib/ndarray.js:
@stdlib/blas-ext-base-sfill/lib/sfill.js:
@stdlib/blas-ext-base-sfill/lib/main.js:
@stdlib/blas-ext-base-dfill/lib/ndarray.js:
@stdlib/blas-ext-base-dfill/lib/dfill.js:
@stdlib/blas-ext-base-dfill/lib/main.js:
@stdlib/blas-base-dscal/lib/ndarray.js:
@stdlib/blas-base-dscal/lib/dscal.js:
@stdlib/blas-base-dscal/lib/main.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2020 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/blas-base-sswap/lib/sswap.js:
@stdlib/blas-base-dswap/lib/ndarray.js:
@stdlib/blas-base-dswap/lib/dswap.js:
@stdlib/blas-base-scopy/lib/ndarray.js:
@stdlib/blas-base-scopy/lib/scopy.js:
@stdlib/blas-base-dcopy/lib/ndarray.js:
@stdlib/blas-base-dcopy/lib/dcopy.js:
@stdlib/blas-base-sdot/lib/ndarray.js:
@stdlib/blas-base-sdot/lib/sdot.js:
@stdlib/blas-base-snrm2/lib/ndarray.js:
@stdlib/blas-base-snrm2/lib/snrm2.js:
@stdlib/blas-base-dnrm2/lib/ndarray.js:
@stdlib/array-base-assert-contains/lib/main.js:
@stdlib/array-base-assert-contains/lib/factory.js:
@stdlib/array-base-assert-contains/lib/index.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2023 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/ndarray-base-assert-is-column-major-string/lib/main.js:
@stdlib/ndarray-base-assert-is-column-major-string/lib/index.js:
@stdlib/blas-base-ssymv/lib/base.js:
@stdlib/ndarray-base-assert-is-row-major-string/lib/main.js:
@stdlib/ndarray-base-assert-is-row-major-string/lib/index.js:
@stdlib/blas-base-sger/lib/base.js:
@stdlib/blas-base-sger/lib/sger.js:
@stdlib/blas-base-sger/lib/ndarray.js:
@stdlib/blas-base-sger/lib/main.js:
@stdlib/blas-base-dger/lib/base.js:
@stdlib/ndarray-base-dtype-enums/lib/main.js:
@stdlib/ndarray-base-dtype-enums/lib/index.js:
@stdlib/complex-float32-base-mul/lib/assign.js:
@stdlib/complex-float32-base-mul/lib/strided.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2025 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@stdlib/ndarray-base-tiling-block-size/lib/defaults.js:
@stdlib/ndarray-base-tiling-block-size/lib/main.js:
@stdlib/ndarray-base-tiling-block-size/lib/index.js:
  (**
  * @license Apache-2.0
  *
  * Copyright (c) 2026 The Stdlib Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *    http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
*/
