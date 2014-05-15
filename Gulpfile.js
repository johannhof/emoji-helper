var gulp = require('gulp'),
    fs = require('fs'),
    jade = require('gulp-jade');

var build = "./";

gulp.task('jade', function() {
  fs.readFile('./bookmarklet/bookmarklet.js', function (err, data) {
    if(err) return;
    gulp.src('index.jade')
      .pipe(jade({
        locals: {
          bookmarklet : 'javascript:' + data
        }
      }))
      .pipe(gulp.dest(build));
  });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./index.jade', ['build']);
});

gulp.task('build', ['jade']);

gulp.task('default', ['build', 'watch']);
