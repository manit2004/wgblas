.PHONY: test test-gpu

test:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec $$(find tests -name 'test.*.js')

test-gpu:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec $$(find tests -name 'gpustorage.*.js')

test-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/test.$*.js

test-gpu-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/gpustorage.$*.js
