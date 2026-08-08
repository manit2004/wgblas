.PHONY: test

test:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec $$(find tests -name 'test.*.js' -o -name 'gpustorage.*.js')

test-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/test.$*.js

gpustorage-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/gpustorage.$*.js
