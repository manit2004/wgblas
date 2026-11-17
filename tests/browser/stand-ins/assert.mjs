// node:assert/strict in the browser: the "assert" npm package, a port of
// Node's assert. Its strict mode agrees with Node's on the cases these tests
// lean on: -0 vs 0, NaN, typed arrays. ("assert/", with the slash, names the
// package; plain "assert" would be Node's built-in.)
import assert from "assert/";

export default assert.strict;
