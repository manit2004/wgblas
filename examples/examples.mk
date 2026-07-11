.PHONY: example example-gpuvec example-web

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
		xdg-open "http://localhost:5173/examples/$$r/web/$$r.html"; \
	done; \
	wait $$VPID

example-gpuvec:
	@for d in examples/*/; do node $${d}gpuvec.$$(basename $$d).js; done

example-gpuvec-%:
	node examples/$*/gpuvec.$*.js