.PHONY: bench cuda

NVCC ?= $(shell which nvcc 2>/dev/null || echo /usr/local/cuda/bin/nvcc)
bench:
	@for f in benchmarks/*/benchmark.*.js; do node $$f $(ARGS); done

bench-%:
	node benchmarks/$*/benchmark.$*.js $(ARGS)

cuda:
	@for d in benchmarks/*/cuda; do $(MAKE) -C $$d clean && $(MAKE) -C $$d CC=$(NVCC) && ./$$d/benchmark; done

cuda-%:
	$(MAKE) -C benchmarks/$*/cuda clean
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC)
	./benchmarks/$*/cuda/benchmark