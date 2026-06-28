import json
import numpy as np
from scipy.linalg.blas import srot as cblas_srot

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n    = int(rng.integers(100, 1000))
    incx = int(rng.integers(1, 5))
    incy = int(rng.integers(1, 5))
    x    = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)
    y    = rng.uniform(-10, 10, (n - 1) * incy + 1).astype(np.float32)

    angle = float(rng.uniform(0, 2 * np.pi))
    c     = float(np.float32(np.cos(angle)))
    s     = float(np.float32(np.sin(angle)))

    x_out, y_out = cblas_srot(x, y, c, s, n=n, incx=incx, incy=incy)

    fixtures.append({
        "n":          n,
        "incx":       incx,
        "incy":       incy,
        "x":          x.tolist(),
        "y":          y.tolist(),
        "c":          c,
        "s":          s,
        "expected_x": x_out.tolist(),
        "expected_y": y_out.tolist(),
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
