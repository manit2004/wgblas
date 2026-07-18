.PHONY: test

test:
	node --test --test-reporter=spec $$(find tests -name 'test.*.js' -o -name 'gpustorage.*.js')

# TODO: once every routine moves to the src/ layout (only strmv so far), drop the flat-layout fallback below.
test-%:
	node --test $$(test -f tests/$*/src/test.$*.js && echo tests/$*/src/test.$*.js || echo tests/$*/test.$*.js)

gpustorage-%:
	node --test tests/$*/src/gpustorage.$*.js