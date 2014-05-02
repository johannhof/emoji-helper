var gulp = require('gulp'),
    connect = require('connect'),
    path = require('path'),
    rename = require("gulp-rename"),
    jade = require('gulp-jade');

var emojis = require('../shared/emojis.json');

var SERVER_PORT = 8000;

// server for testing the bookmarklet
gulp.task('server', function() {
  connect().use(connect.static(path.resolve("./build/"))).listen(SERVER_PORT);
  console.log("Server running on http://localhost:" + SERVER_PORT);
});

gulp.task('popup', function() {
  gulp.src('../shared/popup.jade')
    .pipe(jade({
      locals: {
        emojis: emojis,
        browser: "Bookmarklet"
      }
    }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest("./build/"));
});

gulp.task('vendor', function() {
  gulp.src("./vendor.js").pipe(gulp.dest("./build/src/"));
});

gulp.task('shared', function() {
  gulp.src([
    "../shared/**/*",
    "!../shared/popup.jade"
  ]).pipe(gulp.dest("./build/"));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('../shared/popup.jade', ['build']);
  gulp.watch('../shared/src/*.js', ['build']);
  gulp.watch('../shared/style/*.css', ['build']);
  gulp.watch('./vendor.js', ['build']);
});

gulp.task('build', ['popup', 'shared', 'vendor']);

gulp.task('default', ['build', 'watch']);

gulp.task('dev', ['server', 'build', 'watch']);
