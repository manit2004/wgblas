.PHONY: example example-gpu example-web

example:
	@for d in examples/*/; do r=$$(basename $$d); [ -f "$${d}$${r}.js" ] && node "$${d}$${r}.js" || true; done

example-%:
	node examples/$*/$*.js

example-%-web:
	npx vite --open /examples/$*/web/$*.html

example-web:
	@npx vite --port 5173 & \
	VPID=$$!; \
	sleep 1 && \
	for d in examples/*/; do \
		r=$$(basename $$d); \
		[ -f "examples/$$r/web/$$r.html" ] && xdg-open "http://localhost:5173/examples/$$r/web/$$r.html" || true; \
	done; \
	wait $$VPID

example-gpu:
	@for d in examples/*/; do r=$$(basename $$d); [ -f "$${d}gpu.$${r}.js" ] && node "$${d}gpu.$${r}.js" || true; done

example-gpu-%:
	node examples/$*/gpu.$*.js
