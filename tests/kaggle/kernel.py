"""
wgblas GPU test kernel — runs the full test suite on Kaggle's free GPU via WebGPU (Dawn → Vulkan).

Steps:
  1. Install Node.js 22 and Vulkan loader
  2. Verify Vulkan can see the GPU
  3. Clone the wgblas repo and install npm deps
  4. Run `make test` — exits non-zero if any test fails (Kaggle marks kernel as error)
  5. Save test output to /kaggle/working/ for download
"""

import subprocess  # nosec B404 -- orchestrates hardcoded, non-interpolated OS commands below
import shutil
import sys

def run(cmd, **kwargs):
    # Every call site below passes a hardcoded literal list, never
    # externally-controlled input.
    print(f"\n$ {' '.join(cmd)}")
    subprocess.run(cmd, check=True, **kwargs)  # nosec B603

def run_shell(cmd, **kwargs):
    # Only for the one command below that needs shell features (a pipe).
    # `cmd` is always a hardcoded literal, never built from external input.
    print(f"\n$ {cmd}")
    subprocess.run(cmd, check=True, shell=True, **kwargs)  # nosec B602

# ── 1. System deps ──────────────────────────────────────────────────────────

run(["apt-get", "update", "-qq"])
run(["apt-get", "install", "-y", "-qq", "libvulkan1", "vulkan-tools"])
run_shell("curl -fsSL https://deb.nodesource.com/setup_22.x | bash -")
run(["apt-get", "install", "-y", "-qq", "nodejs"])

node = shutil.which("node")
npm = shutil.which("npm")
if not (node and npm):
    sys.exit("node/npm not found on PATH after install")

print("\nNode:", subprocess.check_output([node, "--version"]).decode().strip())  # nosec B603
print("npm: ", subprocess.check_output([npm, "--version"]).decode().strip())  # nosec B603

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

make = shutil.which("make")
if not make:
    sys.exit("make not found on PATH")

with open(LOG, "w") as f:
    result = subprocess.run(  # nosec B603
        [make, "test"],
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
