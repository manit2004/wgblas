import { init, cleanup } from "wgblas";
import { ssymm } from "wgblas/ssymm";

const device = await init();

// C = alpha*A*B + beta*C with A symmetric (only its upper triangle stored).
// Taking B = identity makes C the full symmetric matrix A stands for, so the
// mirrored entries below the diagonal become visible.
const n = 3, lda = n;
const A = new Float32Array([2, 1, 0,
                            0, 2, 1,
                            0, 0, 2]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);
const C = new Float32Array(n * n);

console.log("A (upper triangle stored) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

const { C: result } = await ssymm(device, "left", "upper", n, n, 1, A, lda, B, lda, 0, C, lda);
console.log("C = A*I = the full symmetric A =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[2,1,0],[1,2,1],[0,1,2]]

if (typeof process !== "undefined") cleanup();
