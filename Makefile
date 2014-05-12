V=0.4.1

release:
	gulp release --cwd bookmarklet/
	gulp release --cwd chrome/
	gulp release --cwd firefox/
	gulp release --cwd safari/
	cp -r release/latest/ release/$V

build:
	gulp build --cwd bookmarklet/
	gulp build --cwd chrome/
	gulp build --cwd firefox/
	gulp build --cwd safari/

.PHONY: release build
