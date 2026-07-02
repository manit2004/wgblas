include tests/tests.mk
include benchmarks/bench.mk
include examples/examples.mk

.PHONY: check protect-results help

# ── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Type checking"
	@echo "  check                 Verify public API types are aligned (tsc --noEmit)"
	@echo ""
	@echo "Tests"
	@echo "  test                  Run all tests"
	@echo "  test-<name>           Run tests for a specific function (e.g. test-sscal)"
	@echo "  fixtures              Regenerate all test fixtures"
	@echo "  fixtures-<name>       Regenerate fixtures for a specific function (e.g. fixtures-sscal)"
	@echo ""
	@echo "Benchmarks (WebGPU)"
	@echo "  bench                 Run all WebGPU benchmarks"
	@echo "  bench-<name>          Run a specific WebGPU benchmark (e.g. bench-sscal)"
	@echo ""
	@echo "Benchmarks (CUDA)"
	@echo "  cuda                  Build and run all CUDA benchmarks"
	@echo "  cuda-<name>           Build and run a specific CUDA benchmark (e.g. cuda-sscal)"
	@echo ""
	@echo "Results"
	@echo "  protect-results       Prevent benchmark re-runs from dirtying git status (run once after clone)"
	@echo ""
	@echo "Examples"
	@echo "  example                      Run all Node examples"
	@echo "  example-gpuvec               Run all GpuVector Node examples"
	@echo "  example-<name>               Run a specific Node example (e.g. example-sscal)"
	@echo "  example-<name>-web           Open a specific example in the browser (e.g. example-sscal-web)"
	@echo "  example-gpuvec-<name>        Run a GpuVector Node example (e.g. example-gpuvec-saxpy)"
	@echo "  example-gpuvec-<name>-web    Open a GpuVector example in the browser (e.g. example-gpuvec-saxpy-web)"

# ── Type check ───────────────────────────────────────────────────────────────

check:
	npx tsc --noEmit

# ── Results ──────────────────────────────────────────────────────────────────

protect-results:
	git ls-files benchmarks/results/ | xargs git update-index --skip-worktree
