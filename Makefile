V=0.4.4

release: build
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

clean:
	rm -rf ./bookmarklet/build/
	rm -rf ./chrome/build/
	rm -rf ./firefox/build/
	rm -rf ./safari/build/
	rm -rf release/latest/

.PHONY: release build clean
