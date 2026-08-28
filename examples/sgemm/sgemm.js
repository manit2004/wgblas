import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";

const device = await init();

// C = alpha*A*B + beta*C, with A 2x3 and B 3x2, so C is 2x2.
const m = 2, n = 2, k = 3;
const A = new Float32Array([1, 2, 3,
                            4, 5, 6]);
const B = new Float32Array([1, 0,
                            0, 1,
                            1, 1]);
const C = new Float32Array(m * n);

console.log("A =");
console.table([A.slice(0, 3),
               A.slice(3, 6)]);
console.log("B =");
console.table([B.slice(0, 2),
               B.slice(2, 4),
               B.slice(4, 6)]);

const { C: result } = await sgemm(device, "no-transpose", "no-transpose", m, n, k, 1, A, 3, B, 2, 0, C, 2);
console.log("C = A*B =");
console.table([result.slice(0, 2),
               result.slice(2, 4)]);
// B's columns pick out [a0+a2, a1+a2]: [[1+3, 2+3], [4+6, 5+6]] = [[4,5],[10,11]]

if (typeof process !== "undefined") cleanup();
