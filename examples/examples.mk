.PHONY: example example-gpuvec

example:
	@for d in examples/*/; do node $${d}$$(basename $$d).js; done

example-%:
	node examples/$*/$*.js

example-%-web:
	npx vite --open /examples/$*/web/$*.html

example-gpuvec:
	@for d in examples/*/; do node $${d}gpuvec.$$(basename $$d).js; done

example-gpuvec-%:
	node examples/$*/gpuvec.$*.js

example-gpuvec-%-web:
	npx vite --open /examples/$*/web/gpuvec.$*.html