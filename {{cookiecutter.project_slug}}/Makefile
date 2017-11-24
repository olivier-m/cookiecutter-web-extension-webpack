#!/usr/bin/make

# Note: we have to unset some vars because web-ext is too stupid to not
# discard unneeded vars regarding commands.

ADDON := ./addon
SRC := ./src
FIREFOX_PROFILE := ./profile.firefox
CHROME_PROFILE := ./profile.chrome
START_URL := about:blank

NPM_CMD := $(shell command -v yarn || command -v npm)
NPM_BIN := $(shell $(NPM_CMD) bin)
CHROME_CMD := $(shell command -v chrome || command -v chromium)

ESLINT  := $(NPM_BIN)/eslint
WEB_EXT := $(NPM_BIN)/web-ext
WEBPACK := $(NPM_BIN)/webpack

.PHONY: default
default: init source-lint source-build

init:
	$(NPM_CMD) install

source-lint:
	$(ESLINT) src

source-build:
	$(WEBPACK) --progress

source-clean:
	rm -f ./$(ADDON)/manifest.json
	rm -rf ./$(ADDON)/resources/dist

source-watch:
	$(WEBPACK) --watch --progress

webext-run-firefox:
	test -d $(FIREFOX_PROFILE) || mkdir $(FIREFOX_PROFILE)
	unset WEB_EXT_API_KEY WEB_EXT_API_SECRET ;\
	$(WEB_EXT) run -s $(ADDON) -p $(FIREFOX_PROFILE) \
		--keep-profile-changes \
		--browser-console \
		--url $(START_URL)

webext-run-chrome:
	test -d $(CHROME_PROFILE) || mkdir $(CHROME_PROFILE)
	$(CHROME_CMD) \
		--user-data-dir=$(CHROME_PROFILE) \
		--load-extension=$(ADDON) \
		$(START_URL)

moz-run: source-build
	${MAKE} -j2 source-watch webext-run-firefox

moz-lint:
	unset WEB_EXT_FIREFOX_BINARY WEB_EXT_API_KEY WEB_EXT_API_SECRET ;\
	$(WEB_EXT) lint -s $(ADDON) --self-hosted

moz-pack: source-lint source-build moz-lint
	unset WEB_EXT_FIREFOX_BINARY ;\
	$(WEB_EXT) sign -s $(ADDON)

chrome-run: source-build
	${MAKE} -j2 source-watch webext-run-chrome

chrome-pack: source-lint source-build
	test -d web-ext-artifacts || mkdir web-ext-artifacts
	set -e ;\
	dest=$$(cat addon/manifest.json | jq -r '.applications.gecko.id + "-" + .version') ;\
	(cd $(ADDON) && zip -qr -9 -X ../web-ext-artifacts/$$dest.zip .) ;\
	echo "web-ext-artifacts/$$dest.zip writen"


lint: source-lint source-build moz-lint

clean: source-clean
