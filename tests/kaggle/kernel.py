"""
wgblas GPU test kernel — runs the full test suite on Kaggle's free GPU via WebGPU (Dawn → Vulkan).

Steps:
  1. Install Node.js 22 and Vulkan loader
  2. Verify Vulkan can see the GPU
  3. Clone the wgblas repo and install npm deps
  4. Run `make test` — exits non-zero if any test fails (Kaggle marks kernel as error)
  5. Save test output to /kaggle/working/ for download
"""

import subprocess
import sys
import os

def run(cmd, **kwargs):
    print(f"\n$ {cmd if isinstance(cmd, str) else ' '.join(cmd)}")
    subprocess.run(cmd, check=True, shell=isinstance(cmd, str), **kwargs)

# ── 1. System deps ──────────────────────────────────────────────────────────

run("apt-get update -qq")
run("apt-get install -y -qq libvulkan1 vulkan-tools")
run("curl -fsSL https://deb.nodesource.com/setup_22.x | bash -")
run("apt-get install -y -qq nodejs")

print("\nNode:", subprocess.check_output(["node", "--version"]).decode().strip())
print("npm: ", subprocess.check_output(["npm",  "--version"]).decode().strip())

# ── 2. Verify Vulkan ────────────────────────────────────────────────────────

try:
    run(["vulkaninfo", "--summary"])
except subprocess.CalledProcessError:
    print("vulkaninfo failed — GPU may not have Vulkan support", file=sys.stderr)
    sys.exit(1)

# ── 3. Clone repo ───────────────────────────────────────────────────────────

REPO    = "https://github.com/manit2004/wgblas.git"
WORKDIR = "/kaggle/working/wgblas"

run(["git", "clone", "--depth=1", REPO, WORKDIR])
run(["npm", "ci"], cwd=WORKDIR)

# ── 4. Run tests ─────────────────────────────────────────────────────────────
# `make test` uses `node --test --test-reporter=spec tests/**/test.*.js`.
# CalledProcessError propagates if any test fails → kernel exits non-zero → Kaggle status = error.

LOG = "/kaggle/working/test-output.txt"

print(f"\nRunning tests — output saved to {LOG}\n")

with open(LOG, "w") as f:
    result = subprocess.run(
        ["make", "test"],
        cwd=WORKDIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    f.write(result.stdout)
    print(result.stdout)

if result.returncode != 0:
    print(f"\nTests FAILED (exit {result.returncode})", file=sys.stderr)
    sys.exit(result.returncode)

print("\nAll tests passed.")
