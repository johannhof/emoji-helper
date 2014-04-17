var gulp = require('gulp');

var jade = require('gulp-jade');

var emojis = require('../shared/emojis.json');

gulp.task('popup', function() {
  gulp.src('../shared/popup.jade')
    .pipe(jade({
      locals: {
        emojis: emojis
      }
    }))
    .pipe(gulp.dest("./build/"));
});

gulp.task('manifest', function() {
  gulp.src("./manifest.json").pipe(gulp.dest("./build/"));
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
});

gulp.task('build', ['popup', 'shared', 'manifest']);

gulp.task('default', ['build', 'watch']);
