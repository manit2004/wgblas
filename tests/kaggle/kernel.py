"""
wgblas GPU test kernel — runs the full test suite on Kaggle's free GPU via WebGPU (Dawn → Vulkan).

Steps:
  1. Install Node.js 22 and Vulkan loader
  2. Install the NVIDIA Vulkan driver libraries and verify Vulkan sees the GPU
     (not just llvmpipe, Mesa's CPU fallback)
  3. Clone the wgblas repo and install npm deps — outside /kaggle/working
  4. Check Dawn's own adapter pick is the GPU too
  5. Run the test suite under c8, producing an lcov report — exits non-zero if
     any test fails (Kaggle marks kernel as error)
  6. Save test output and the lcov report to /kaggle/working/ for download

Only those two files go in /kaggle/working: Kaggle saves everything there as
the run's output, and a clone plus node_modules (~20k files, ~340 MB) there
made the run end in error after the tests had passed.
"""

import json
import os
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
# libx11-6/libxext6: libGLX_nvidia (the NVIDIA Vulkan ICD) links against them
# even headless. libegl1: glvnd's libEGL dispatcher, which the ICD loads at
# startup (it hands off to libEGL_nvidia, see section 2).
run(["apt-get", "install", "-y", "-qq", "libvulkan1", "vulkan-tools", "libx11-6", "libxext6", "libegl1"])
run_shell("curl -fsSL https://deb.nodesource.com/setup_22.x | bash -")
run(["apt-get", "install", "-y", "-qq", "nodejs"])

node = shutil.which("node")
npm = shutil.which("npm")
if not (node and npm):
    sys.exit("node/npm not found on PATH after install")

print("\nNode:", subprocess.check_output([node, "--version"]).decode().strip())  # nosec B603
print("npm: ", subprocess.check_output([npm, "--version"]).decode().strip())  # nosec B603

# ── 2. NVIDIA Vulkan driver ─────────────────────────────────────────────────
# Kaggle's container gets the NVIDIA driver's compute libraries (CUDA) but not
# its graphics ones, so the Vulkan loader finds no working NVIDIA ICD and Dawn
# falls back to llvmpipe — the suite then runs on the CPU. The fix is the
# user-space Vulkan libraries from the installer of the *exact* driver
# version the host runs (they must match the kernel module), extracted —
# not installed — and handed to the loader through VK_ICD_FILENAMES. Every
# later subprocess inherits the environment set here.

# The driver's Vulkan ICD and the libraries it loads (linked or dlopen'd) —
# found by tracing a Dawn device init with LD_DEBUG=libs, and strace in a
# plain ubuntu:22.04 container with only the GPU device nodes passed through
# (which reproduces Kaggle's failure). The EGL pair is needed because the ICD
# opens libEGL.so.1 while it initializes and, finding no NVIDIA EGL vendor,
# returns no vkCreateInstance ("Could not get 'vkCreateInstance' via
# 'vk_icdGetInstanceProcAddr'").
NV_VULKAN_LIBS = [
    "libGLX_nvidia", "libnvidia-glcore", "libnvidia-glsi", "libnvidia-tls",
    "libnvidia-glvkspirv", "libnvidia-gpucomp", "libnvidia-allocator",
    "libEGL_nvidia", "libnvidia-eglcore",
]
NV_URLS = [
    "https://us.download.nvidia.com/tesla/{v}/NVIDIA-Linux-x86_64-{v}.run",
    "https://download.nvidia.com/XFree86/Linux-x86_64/{v}/NVIDIA-Linux-x86_64-{v}.run",
]

def setup_nvidia_vulkan(lib_dir="/tmp/nvidia-vulkan"):
    try:
        version = subprocess.check_output(  # nosec B603 B607
            ["nvidia-smi", "--query-gpu=driver_version", "--format=csv,noheader"],
            text=True,
        ).split()[0]
    except (OSError, subprocess.CalledProcessError, IndexError):
        sys.exit("nvidia-smi failed — is the GPU accelerator enabled for this kernel?")
    print(f"\nNVIDIA driver {version}")

    installer = Path("/tmp/nvidia.run")
    for url in NV_URLS:
        url = url.format(v=version)
        print(f"\n$ curl {url}")
        if subprocess.run(["curl", "-fsSL", "-o", str(installer), url]).returncode == 0:  # nosec B603 B607
            break
    else:
        sys.exit(f"no NVIDIA installer found for driver {version}")

    extract = Path("/tmp/nvidia-extract")
    shutil.rmtree(extract, ignore_errors=True)
    run(["sh", str(installer), "--extract-only", "--target", str(extract)],
        stdout=subprocess.DEVNULL)
    installer.unlink()

    out = Path(lib_dir)
    out.mkdir(parents=True, exist_ok=True)
    for name in NV_VULKAN_LIBS:
        src = extract / f"{name}.so.{version}"
        if src.exists():  # libnvidia-gpucomp only exists from ~530 on
            shutil.copy(src, out / src.name)
    # Soname links (libGLX_nvidia.so.0 and libEGL_nvidia.so.0, which the
    # manifests name, and libnvidia-allocator.so.1); the rest are linked by
    # full version.
    run([shutil.which("ldconfig") or "/sbin/ldconfig", "-n", str(out)])

    manifest = json.loads((extract / "nvidia_icd.json").read_text())
    manifest["ICD"]["library_path"] = str(out / "libGLX_nvidia.so.0")
    icd = out / "nvidia_icd.json"
    icd.write_text(json.dumps(manifest, indent=2))
    egl_vendor = out / "10_nvidia.json"
    egl_vendor.write_text(json.dumps({
        "file_format_version": "1.0.0",
        "ICD": {"library_path": str(out / "libEGL_nvidia.so.0")},
    }, indent=2))
    shutil.rmtree(extract)

    # NVIDIA only: llvmpipe stays out of the loader's list entirely, so Dawn
    # can't quietly pick it.
    os.environ["VK_ICD_FILENAMES"] = str(icd)
    os.environ["VK_DRIVER_FILES"] = str(icd)  # the newer loaders' name for it
    # glvnd's EGL dispatcher otherwise only finds Mesa's vendor file.
    os.environ["__EGL_VENDOR_LIBRARY_FILENAMES"] = str(egl_vendor)
    os.environ["LD_LIBRARY_PATH"] = ":".join(
        p for p in (str(out), os.environ.get("LD_LIBRARY_PATH")) if p)

def verify_vulkan_gpu():
    print("\n$ vulkaninfo --summary")
    info = subprocess.run(["vulkaninfo", "--summary"], capture_output=True, text=True)  # nosec B603 B607
    print(info.stdout)
    print(info.stderr, file=sys.stderr)
    if info.returncode != 0 or "PHYSICAL_DEVICE_TYPE_DISCRETE_GPU" not in info.stdout:
        sys.exit("Vulkan sees no discrete GPU — the tests would run on a CPU "
                 "fallback (llvmpipe), so they're not run at all.")

setup_nvidia_vulkan()
verify_vulkan_gpu()

# ── 3. Clone repo ───────────────────────────────────────────────────────────

REPO    = "https://github.com/manit2004/wgblas.git"
# Outside /kaggle/working — see the header.
WORKDIR = "/tmp/wgblas"

run(["git", "clone", "--depth=1", REPO, WORKDIR])
run(["npm", "ci"], cwd=WORKDIR)

# ── 4. Check Dawn picks the GPU ─────────────────────────────────────────────
# What the tests will actually get: wgblas's own init(), whose adapter choice
# is Dawn's, not vulkaninfo's.

print("\n$ node -e <print wgblas adapter>")
adapter = subprocess.check_output(  # nosec B603
    [node, "--input-type=module", "-e",
     "import { init, gpuName, cleanup } from 'wgblas';"
     "await init({ powerPreference: 'high-performance' });"
     "console.log(JSON.stringify(gpuName())); cleanup();"],
    cwd=WORKDIR, text=True,
).strip().splitlines()[-1]  # Dawn prints warnings first
print(f"wgblas adapter: {adapter}")
if any(cpu in adapter.lower() for cpu in ("llvmpipe", "swiftshader", "lavapipe")):
    sys.exit(f"Dawn picked a CPU fallback ({adapter}) — not running the tests on it.")

# ── 5. Run tests under coverage ───────────────────────────────────────────────
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
