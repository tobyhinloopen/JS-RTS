JS_SRC = $(shell ls src/*.js src/**/*.js vendor/*.js)
SCSS_SRC = $(shell ls src/*.scss)
TEST_SRC = $(shell ls src/*_test.js src/**/*_test.js)
NODE_PATH = src:vendor

default: dist/application.js dist/application.css

clean:
	rm -rf dist/application.js dist/application.css node.profiler.json reports

test:
	NODE_PATH=$(NODE_PATH):support node_modules/.bin/mocha -s 4 --no-timeouts $(TEST_SRC)

watch:
	NODE_PATH=$(NODE_PATH):support node_modules/.bin/mocha -s 4 --watch --reporter min $(TEST_SRC)

profile:
	NODE_PATH=$(NODE_PATH):support node_modules/.bin/node.profiler profile.js includeThirdParty=true safeAsyncDetection=false

bench:
	NODE_PATH=$(NODE_PATH):support node bench.js

dist/application.js: $(JS_SRC)
	NODE_PATH=$(NODE_PATH) browserify src/application.js -o dist/application.js

dist/application.css: $(SCSS_SRC)
	sass src/application.scss -Isrc dist/application.css

.PHONY: test watch clean profile bench
