.PHONY: test test-gpu test-utils

test:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec $$(find tests -name 'test.*.js')

test-gpu:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec $$(find tests -name 'gpustorage.*.js')

# Utility tests live flat in tests/utils/, one file per src/util/ module —
# a more specific pattern than test-% below, so it wins for `test-util-*`.
test-utils:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test --test-reporter=spec tests/utils/test.*.js

test-util-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/utils/test.$*.js

test-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/test.$*.js

test-gpu-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/gpustorage.$*.js
