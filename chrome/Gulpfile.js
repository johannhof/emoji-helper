var gulp = require('gulp'),
    zip = require('gulp-zip'),
    jade = require('gulp-jade');

var emojis = require('../shared/sprite/sprite.json');

var build = "./build/";

gulp.task('popup', function() {
  gulp.src('../shared/popup.jade')
    .pipe(jade({
      locals: {
        emojis: emojis,
        browser: "Chrome"
      }
    }))
    .pipe(gulp.dest(build));
});

gulp.task('manifest', function() {
  gulp.src("./manifest.json").pipe(gulp.dest(build));
});

gulp.task('vendor', function() {
  gulp.src("./vendor.js").pipe(gulp.dest(build + "src/"));
});

gulp.task('shared', function() {
  gulp.src([
    "../shared/**/*",
    "!../shared/popup.jade"
  ]).pipe(gulp.dest(build));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('../shared/popup.jade', ['build']);
  gulp.watch('../shared/src/*.js', ['build']);
  gulp.watch('../shared/style/*.css', ['build']);
  gulp.watch('./vendor.js', ['build']);
});

gulp.task('release', function () {
  gulp.src([build + '**/*'])
      .pipe(zip('emoji-helper.zip'))
      .pipe(gulp.dest("../release/latest/chrome/"));
});

gulp.task('build', ['shared', 'manifest', 'vendor', 'popup']);

gulp.task('default', ['build', 'watch']);
