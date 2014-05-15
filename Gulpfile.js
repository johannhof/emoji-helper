var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade');

var build = "./";

gulp.task('jade', function() {
  gulp.src('index.jade')
    .pipe(jade({
      locals: { }
    }))
    .pipe(gulp.dest(build));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./index.jade', ['build']);
});

gulp.task('build', ['jade']);

gulp.task('default', ['build', 'watch']);
