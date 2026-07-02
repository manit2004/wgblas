.PHONY: bench cuda

bench:
	@for f in benchmarks/*/benchmark.*.js; do node $$f; done

bench-%:
	node benchmarks/$*/benchmark.$*.js

cuda:
	@for d in benchmarks/*/cuda; do $(MAKE) -C $$d clean && $(MAKE) -C $$d && ./$$d/benchmark; done

cuda-%:
	$(MAKE) -C benchmarks/$*/cuda clean
	$(MAKE) -C benchmarks/$*/cuda
	./benchmarks/$*/cuda/benchmark