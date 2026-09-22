"""
wgblas GPU test kernel — runs the full test suite on Kaggle's free GPU via WebGPU (Dawn → Vulkan).

Steps:
  1. Install Node.js 22 and Vulkan loader
  2. Verify Vulkan can see the GPU
  3. Clone the wgblas repo and install npm deps
  4. Run the test suite under c8, producing an lcov report — exits non-zero if
     any test fails (Kaggle marks kernel as error)
  5. Save test output and the lcov report to /kaggle/working/ for download
"""

import subprocess  # nosec B404 -- orchestrates hardcoded, non-interpolated OS commands below
import shutil
import sys
from pathlib import Path

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

# ── 4. Run tests under coverage ───────────────────────────────────────────────
# Same test.*.js scope `make test` runs, wrapped in c8 so this kernel — the
# only place tests actually run against a real GPU — can also produce the
# lcov report the coverage badge/CI upload needs. gpustorage.*.js isn't
# included here, matching what this kernel has always run; `npm run
# coverage` locally covers both and is the source of truth for local runs.
# CalledProcessError propagates if any test fails → kernel exits non-zero → Kaggle status = error.

LOG = "/kaggle/working/test-output.txt"
COVERAGE_DIR = "/kaggle/working/coverage"

print(f"\nRunning tests under coverage — output saved to {LOG}\n")

npx = shutil.which("npx")
if not npx:
    sys.exit("npx not found on PATH")

test_files = sorted(str(p) for p in Path(WORKDIR, "tests").rglob("test.*.js"))
if not test_files:
    sys.exit("no test.*.js files found under tests/")

with open(LOG, "w") as f:
    result = subprocess.run(  # nosec B603
        [npx, "c8", "--reporter=text", "--reporter=lcov", "node", "--test",
         "--test-reporter=spec", *test_files],
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

lcov_src = Path(WORKDIR, "coverage", "lcov.info")
if lcov_src.exists():
    Path(COVERAGE_DIR).mkdir(parents=True, exist_ok=True)
    shutil.copy(lcov_src, Path(COVERAGE_DIR, "lcov.info"))
    print(f"\nCoverage report copied to {COVERAGE_DIR}/lcov.info")
else:
    print("\nWARNING: no coverage/lcov.info produced by c8", file=sys.stderr)

print("\nAll tests passed.")
