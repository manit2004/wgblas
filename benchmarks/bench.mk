.PHONY: bench cuda

NVCC ?= $(shell command -v nvcc 2>/dev/null || echo /usr/local/cuda/bin/nvcc)
bench:
	@for f in benchmarks/*/benchmark.*.js benchmarks/*/wgblas/*.js; do node $$f $(ARGS); done

bench-stride-%:
	node benchmarks/$*/wgblas/stride.$*.js $(ARGS)

bench-%:
	node benchmarks/$*/wgblas/$*.js $(ARGS)

cuda:
	@for d in benchmarks/*/cuda; do r=$$(basename $$(dirname $$d)); $(MAKE) -C $$d clean && $(MAKE) -C $$d CC=$(NVCC) && ./$$d/bin/$$r; done

cuda-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/$*
	./benchmarks/$*/cuda/bin/$*

cuda-stride-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/stride.$*
	./benchmarks/$*/cuda/bin/stride.$*