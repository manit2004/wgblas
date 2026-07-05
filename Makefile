include tests/tests.mk
include benchmarks/bench.mk
include examples/examples.mk

.PHONY: typecheck protect-results bench-tables check-links install-tools publish-docs help

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  typecheck             Verify public API types are aligned (tsc --noEmit)"
	@echo "  bench-tables          Fetch benchmark JSONs from GitHub and regenerate assets/bench-result/**/*.md"
	@echo "  protect-results       Prevent benchmark re-runs from dirtying git status (run once after clone)"
	@echo "  check-links           Check all markdown and docs HTML links with lychee"
	@echo "  publish-docs          Enforce correct order: guard uncommitted changes → build docs → commit → push"
	@echo "  install-tools         Install dev tools (lychee)"


publish-docs:
	@git diff --quiet && git diff --cached --quiet || { echo "Error: commit your source changes before building docs"; exit 1; }
	npx typedoc
	git add docs/
	git diff --cached --quiet || git commit -m "rebuild docs"
	git push

typecheck:
	npx tsc --noEmit

bench-tables:
	python3 scripts/gen-bench-tables.py

protect-results:
	git ls-files benchmarks/results/ | xargs git update-index --skip-worktree

check-links:
	lychee --exclude-path node_modules "**/*.md" "docs/**/*.html"

install-tools:
	curl -sSL https://github.com/lycheeverse/lychee/releases/download/lychee-v0.24.2/lychee-x86_64-unknown-linux-gnu.tar.gz | tar xz -C /tmp
	sudo mv /tmp/lychee-x86_64-unknown-linux-gnu/lychee /usr/local/bin/lychee
