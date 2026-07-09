.PHONY: test

test:
	node --test --test-reporter=spec tests/**/test.*.js

test-%:
	node --test tests/$*/test.$*.js