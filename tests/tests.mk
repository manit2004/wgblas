.PHONY: test fixtures

test:
	node --test --test-reporter=spec tests/**/test.*.js

test-%:
	node --test tests/$*/test.$*.js

fixtures:
	@for f in tests/*/fixtures/fixtures.py; do python -c "import os,runpy; os.chdir(os.path.dirname('$$f')); runpy.run_path(os.path.basename('$$f'))"; done

fixtures-%:
	cd tests/$*/fixtures && python fixtures.py