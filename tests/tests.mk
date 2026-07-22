.PHONY: test

test:
	node --test --test-reporter=spec $$(find tests -name 'test.*.js' -o -name 'gpustorage.*.js')

test-%:
	node --test tests/$*/src/test.$*.js

gpustorage-%:
	node --test tests/$*/src/gpustorage.$*.js
