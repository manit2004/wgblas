include tests/tests.mk
include benchmarks/bench.mk
include examples/examples.mk

.PHONY: typecheck protect-results check-links install-tools install-naga install-deno install-shader-tools publish-docs repl help

repl:
	node repl.mjs

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  repl                  Start interactive REPL with all BLAS functions pre-bound"
	@echo "  typecheck             Verify public API types are aligned (tsc --noEmit)"
	@echo "  protect-results       Prevent benchmark re-runs from dirtying git status (run once after clone)"
	@echo "  check-links           Check all markdown and docs HTML links with lychee"
	@echo "  publish-docs          Enforce correct order: guard uncommitted changes → build docs → commit → push"
	@echo "  install-tools         Install dev tools (lychee, naga, deno, shader validators)"
	@echo "  install-naga          Install naga, wgpu's WGSL compiler, for tests/shaders (needs Rust)"
	@echo "  install-shader-tools  Install spirv-val, glslangValidator and dxc for tests/shaders/src/test.backends.js"
	@echo "  install-deno          Install Deno, whose WebGPU (wgpu) runs make test-wgpu"


publish-docs:
	@git diff --quiet && git diff --cached --quiet || { echo "Error: commit your source changes before building docs"; exit 1; }
	npm run docs
	git add docs/
	git diff --cached --quiet || git commit -m "rebuild docs"
	git push

typecheck:
	npx tsc --noEmit

# The result JSON only: benchmarks/results/index.mjs is the docs page, whose
# edits should show.
protect-results:
	git ls-files 'benchmarks/results/*.json' | xargs git update-index --skip-worktree

check-links:
	lychee --exclude-path node_modules "**/*.md" "docs/**/*.html"

install-tools: install-naga install-deno install-shader-tools
	curl -sSL https://github.com/lycheeverse/lychee/releases/download/lychee-v0.24.2/lychee-x86_64-unknown-linux-gnu.tar.gz | tar xz -C /tmp
	sudo mv /tmp/lychee-x86_64-unknown-linux-gnu/lychee /usr/local/bin/lychee

# Version pinned in .cargo/config.toml (the install-naga cargo alias).
install-naga:
	@command -v cargo >/dev/null || { echo "Error: cargo not found, install Rust from https://rustup.rs"; exit 1; }
	cargo install-naga

# spirv-val and glslangValidator from the system package manager (sudo); dxc,
# which no distro packages, from Microsoft's Linux release into
# ~/.local/share/dxc, where test.backends.js looks for it. Its bin/dxc finds
# its libs via an $ORIGIN rpath, so it runs from there as is.
DXC_RELEASE = https://github.com/microsoft/DirectXShaderCompiler/releases/download/v1.9.2609/linux_dxc_2026_09_28.x86_x64.tar.gz
DXC_DIR = $(HOME)/.local/share/dxc

install-shader-tools:
	@if command -v dnf >/dev/null; then sudo dnf install -y spirv-tools glslang; \
	elif command -v apt-get >/dev/null; then sudo apt-get install -y spirv-tools glslang-tools; \
	else echo "Install spirv-tools and glslang with your package manager"; fi
	rm -rf $(DXC_DIR) && mkdir -p $(DXC_DIR)
	curl -fsSL $(DXC_RELEASE) | tar xz -C $(DXC_DIR)
	$(DXC_DIR)/bin/dxc --version

# Into ~/.deno/bin without touching shell rc files; tests/wgpu/run.mjs looks
# there as well as on PATH.
install-deno:
	curl -fsSL https://deno.land/install.sh | sh -s -- -y --no-modify-path
