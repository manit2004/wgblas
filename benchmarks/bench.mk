.PHONY: bench cuda

NVCC ?= $(shell command -v nvcc 2>/dev/null || echo /usr/local/cuda/bin/nvcc)
bench:
	@for f in benchmarks/*/benchmark.*.js benchmarks/*/wgblas/*.js; do node $$f $(ARGS); done

bench-stride-%:
	node benchmarks/$*/wgblas/stride.$*.js $(ARGS)

bench-trans-%:
	node benchmarks/$*/wgblas/trans.$*.js $(ARGS)

bench-lda-%:
	node benchmarks/$*/wgblas/lda.$*.js $(ARGS)

bench-uplo-%:
	node benchmarks/$*/wgblas/uplo.$*.js $(ARGS)

bench-ldb-%:
	node benchmarks/$*/wgblas/ldb.$*.js $(ARGS)

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

cuda-trans-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/trans.$*
	./benchmarks/$*/cuda/bin/trans.$*

cuda-lda-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/lda.$*
	./benchmarks/$*/cuda/bin/lda.$*

cuda-uplo-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/uplo.$*
	./benchmarks/$*/cuda/bin/uplo.$*

cuda-ldb-%:
	$(MAKE) -C benchmarks/$*/cuda CC=$(NVCC) bin/ldb.$*
	./benchmarks/$*/cuda/bin/ldb.$*