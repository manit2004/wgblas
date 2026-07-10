"""
wgblas GPU benchmark kernel — runs on Kaggle's free GPU via WebGPU (Dawn → Vulkan).

Steps:
  1. Install Node.js 22 and Vulkan loader
  2. Verify Vulkan can see the GPU
  3. Clone the wgblas repo and install npm deps
  4. Run `make bench` — saves JSON results under benchmarks/results/
  5. Copy results to /kaggle/working/results/ for download by the CI workflow
"""

import subprocess
import shutil
import sys
import os

def run(cmd, **kwargs):
    print(f"\n$ {cmd if isinstance(cmd, str) else ' '.join(cmd)}")
    subprocess.run(cmd, check=True, shell=isinstance(cmd, str), **kwargs)

# ── 1. System deps ──────────────────────────────────────────────────────────

run("apt-get update -qq")

# Vulkan loader — NVIDIA drivers ship the ICD but not the loader
run("apt-get install -y -qq libvulkan1 vulkan-tools")

# Node.js 22 via NodeSource (matches .nvmrc)
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

# ── 4. Install Node dependencies ────────────────────────────────────────────
# The "webgpu" package (dawn-node) downloads a pre-built Dawn binary for linux-x64.
# It uses the system Vulkan loader installed in step 1.

run(["npm", "ci"], cwd=WORKDIR)

# ── 5. Run benchmarks ───────────────────────────────────────────────────────
# `make bench` runs all benchmarks/<routine>/benchmark.<routine>.js files.
# Each script saves its results to benchmarks/results/<gpu-slug>/wgblas/<routine>.json.

run(["make", "bench"], cwd=WORKDIR)

# ── 6. Copy results to Kaggle output dir ────────────────────────────────────
# Kaggle exposes /kaggle/working/ as the downloadable kernel output.

src = os.path.join(WORKDIR, "benchmarks", "results")
dst = "/kaggle/working/results"

if not os.path.exists(src):
    print("ERROR: no results written — benchmark may have failed", file=sys.stderr)
    sys.exit(1)

shutil.copytree(src, dst)
print(f"\nResults saved to {dst}:")
for root, _, files in os.walk(dst):
    for f in files:
        print(" ", os.path.relpath(os.path.join(root, f), dst))
