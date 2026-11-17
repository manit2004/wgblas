.PHONY: test test-gpu test-utils test-wgpu test-browser

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
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test $$(find tests/$*/src -name 'test.*.js')

test-gpu-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node --test tests/$*/src/gpustorage.$*.js

# The same test files on wgpu (Firefox's WebGPU engine) instead of Dawn, run
# by Deno (make install-deno) — see tests/wgpu/run.mjs. A more specific
# pattern than test-% above, so it wins for `test-wgpu-*`.
test-wgpu:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node tests/wgpu/run.mjs

test-wgpu-%:
	WGBLAS_POWER_PREFERENCE=$(ARGS) node tests/wgpu/run.mjs $$(find tests/$*/src -name 'test.*.js' -o -name 'gpustorage.*.js')

# The same test files in a real browser (Chrome, driven by Playwright) instead
# of Node's WebGPU; see tests/browser/run.mjs. Headless Chrome renders on
# SwiftShader, its CPU renderer; WGBLAS_BROWSER_HEADED=1 uses the GPU.
test-browser:
	node tests/browser/run.mjs

test-browser-%:
	node tests/browser/run.mjs $$(find tests/$*/src -name 'test.*.js' -o -name 'gpustorage.*.js')
