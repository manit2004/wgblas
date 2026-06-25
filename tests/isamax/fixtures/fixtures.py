import json
import numpy as np
from scipy.linalg.blas import isamax as cblas_isamax

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n    = int(rng.integers(100, 1000))
    incx = int(rng.integers(1, 5))
    x    = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)

    expected_index = int(cblas_isamax(x, n=n, incx=incx))

    fixtures.append({
        "n":              n,
        "incx":           incx,
        "x":              x.tolist(),
        "expected_index": expected_index,
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
