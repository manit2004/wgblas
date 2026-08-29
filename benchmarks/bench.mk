.PHONY: bench cuda

NVCC ?= $(shell command -v nvcc 2>/dev/null || echo /usr/local/cuda/bin/nvcc)

# Every wgblas benchmark, every routine.
bench:
	@for f in benchmarks/*/wgblas/*.js; do node $$f $(ARGS); done

# One routine, every benchmark it has. The set is whatever is on disk, so a new
# sweep file needs no target of its own.
bench-%:
	@dir=benchmarks/$*/wgblas; \
	if [ ! -d "$$dir" ]; then echo "no such routine: $* (expected $$dir)" >&2; exit 1; fi; \
	files=$$(ls $$dir/*.js 2>/dev/null); \
	if [ -z "$$files" ]; then echo "no benchmarks in $$dir" >&2; exit 1; fi; \
	for f in $$files; do \
		echo; echo "=== $$f ==="; \
		node $$f $(ARGS) || exit $$?; \
	done

# Every CUDA reference benchmark, every routine.
cuda:
	@for d in benchmarks/*/cuda; do \
		$(MAKE) -C $$d clean && $(MAKE) -C $$d CC=$(NVCC) && \
		for f in $$d/*.c; do b=$$(basename $$f .c); ./$$d/bin/$$b; done; \
	done

# One routine's CUDA reference benchmarks — the counterpart to bench-%.
cuda-%:
	@d=benchmarks/$*/cuda; \
	if [ ! -d "$$d" ]; then echo "no CUDA benchmarks for routine: $*" >&2; exit 1; fi; \
	$(MAKE) -C $$d clean && $(MAKE) -C $$d CC=$(NVCC) || exit $$?; \
	for f in $$d/*.c; do \
		b=$$(basename $$f .c); \
		echo; echo "=== $$f ==="; \
		./$$d/bin/$$b || exit $$?; \
	done
