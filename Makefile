MOCHA_OPTS= --check-leaks
REPORTER = dot

check: test

test: test-unit
test-debug: test-unit-debug
test-unit:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--reporter $(REPORTER) \
				$(MOCHA_OPTS)

test-unit-debug:
		@NODE_ENV=test ./node_modules/.bin/mocha debug \
				--reporter $(REPORTER) \
				$(MOCHA_OPTS)

test-cov: lib-cov
	@LIBRE_USER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

clean:
	rm -f coverage.html
	rm -rf lib-cov

.PHONY:
	check test test-unit test-cov clean

