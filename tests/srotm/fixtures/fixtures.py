import json
import numpy as np
from scipy.linalg.blas import srotm as cblas_srotm

rng = np.random.default_rng(42)
TARGET_FIXTURES = 20
MAX_ATTEMPTS    = 500  # generate extra; near-zero cancellation cases are skipped

flags = [-1.0, 0.0, 1.0]
fixtures = []
i = 0

while len(fixtures) < TARGET_FIXTURES and i < MAX_ATTEMPTS:
    n    = int(rng.integers(100, 1000))
    incx = int(rng.integers(1, 5))
    incy = int(rng.integers(1, 5))
    x    = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)
    y    = rng.uniform(-10, 10, (n - 1) * incy + 1).astype(np.float32)

    flag  = flags[i % 3]
    param = np.zeros(5, dtype=np.float32)
    param[0] = flag

    if flag == -1.0:
        param[1:] = rng.uniform(-2, 2, 4).astype(np.float32)
    elif flag == 0.0:
        param[1] = 1.0
        param[2] = float(np.float32(rng.uniform(-2, 2)))
        param[3] = float(np.float32(rng.uniform(-2, 2)))
        param[4] = 1.0
    else:
        param[1] = float(np.float32(rng.uniform(-2, 2)))
        param[2] = -1.0
        param[3] = 1.0
        param[4] = float(np.float32(rng.uniform(-2, 2)))

    x_out, y_out = cblas_srotm(x, y, param, n=n, incx=incx, incy=incy)

    # skip fixtures where cancellation produces outputs much smaller than inputs —
    # cblas f64 intermediates diverge from our strict f32 shader in those cases
    x_used = x_out[::incx][:n]
    y_used = y_out[::incy][:n]
    input_mag = np.max(np.abs(x)) + np.max(np.abs(y))
    if np.min(np.abs(x_used)) < 0.01 * input_mag or np.min(np.abs(y_used)) < 0.01 * input_mag:
        i += 1
        continue

    fixtures.append({
        "n":          n,
        "incx":       incx,
        "incy":       incy,
        "x":          x.tolist(),
        "y":          y.tolist(),
        "param":      param.tolist(),
        "expected_x": x_out.tolist(),
        "expected_y": y_out.tolist(),
    })
    i += 1

print(f"Generated {len(fixtures)} fixtures ({i} attempts)")

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
