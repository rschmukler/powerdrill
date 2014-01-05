test:
	./node_modules/mocha/bin/mocha -w --reporter spec

test-debug:
	./node_modules/mocha/bin/mocha debug --reporter spec

.PHONY: test
