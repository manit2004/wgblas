import { init, cleanup } from "wgblas";
import { sgemmtr } from "wgblas/sgemmtr";

const device = await init();

// Same product as sgemm, but only the `uplo` triangle of C is written.
// A is all ones and B is the identity, so A*B is all ones — which makes the
// masking obvious: the lower triangle stays zero.
const n = 3, lda = n;
const A = new Float32Array([1, 1, 1,
                            1, 1, 1,
                            1, 1, 1]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);
const C = new Float32Array(n * n);

console.log("A = all ones, B = identity, so A*B is all ones");

const { C: result } = await sgemmtr(device, "upper", "no-transpose", "no-transpose", n, n, n, 1, A, lda, B, lda, 0, C, lda);
console.log("C = upper(A*B) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[1,1,1],[0,1,1],[0,0,1]]

if (typeof process !== "undefined") cleanup();
