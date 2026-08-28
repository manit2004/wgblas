import { init, cleanup } from "wgblas";
import { ssyrk } from "wgblas/ssyrk";

const device = await init();

// C = uplo(alpha*A*A^T + beta*C). Entry (i,j) is the dot product of rows i
// and j of A, and only the upper triangle is written.
const n = 3, k = 2;
const A = new Float32Array([1, 0,
                            0, 1,
                            1, 1]);
const C = new Float32Array(n * n);

console.log("A =");
console.table([A.slice(0, 2),
               A.slice(2, 4),
               A.slice(4, 6)]);

const { C: result } = await ssyrk(device, "upper", "no-transpose", n, k, 1, A, k, 0, C, n);
console.log("C = upper(A*A^T) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);
// row dot products: [[1·1, 1·0, 1·1], [-, 1·1, 1·1], [-, -, 2]] = [[1,0,1],[0,1,1],[0,0,2]]

if (typeof process !== "undefined") cleanup();
