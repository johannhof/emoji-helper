var gulp = require('gulp');

var jade = require('gulp-jade');

var emojis = require('./emojis.json');

gulp.task('popup', function() {
  gulp.src('./popup.jade')
    .pipe(jade({
      locals: {
        emojis: emojis
      }
    }))
    .pipe(gulp.dest('./'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./popup.jade', ['popup']);
});

// The default task (called when you run 0 from cli)
gulp.task('default', ['watch', 'popup']);
