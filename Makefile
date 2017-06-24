V=1.2.0

release: build
	rm -rf release/latest
	rm -rf release/$V
	./node_modules/gulp/bin/gulp.js release
	cp -r release/latest/ release/$V

build:
	./node_modules/gulp/bin/gulp.js build

clean:
	rm -rf ./build/
	rm -rf release/latest/

.PHONY: release build clean
