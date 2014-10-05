var gulp = require('gulp'),
    connect = require('connect'),
    path = require('path'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    imageResize = require('gulp-image-resize'),
    newer = require('gulp-newer'),
    jade = require('gulp-jade');

var emojis = require('../shared/data/sprite.json');

var build = "./build/";

var SERVER_PORT = 8000;

// server for testing the bookmarklet
gulp.task('server', function() {
  connect().use(connect.static(path.resolve(build))).listen(SERVER_PORT);
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
    .pipe(gulp.dest(build));
});

gulp.task('emoji', function () {
    return gulp.src([
      '../shared/img/emoji/clock9.png',
      '../shared/img/emoji/smiley.png',
      '../shared/img/emoji/cherry_blossom.png',
      '../shared/img/emoji/bell.png',
      '../shared/img/emoji/oncoming_automobile.png',
      '../shared/img/emoji/symbols.png',
      '../shared/img/emoji/hatched_chick.png',
      '../shared/img/emoji/snake.png',
      '../shared/img/emoji/heart.png',
      '../shared/img/emoji/heavy_multiplication_x.png'
    ]).pipe(newer(build + 'img/emoji/'))
        .pipe(imageResize({
          width : 30,
          height : 30
        }))
        .pipe(gulp.dest(build + 'img/emoji/'));
});

gulp.task('vendor', function() {
  gulp.src("./vendor.js").pipe(gulp.dest(build + "src/"));
});

gulp.task('bookmarklet', function () {
  gulp.src("./bookmarklet.js")
      .pipe(uglify())
      .pipe(gulp.dest(build));
});

gulp.task('shared', function() {
  gulp.src([
    "../shared/**/*",
    "!../shared/popup.jade",
    "!../shared/img/emoji/*"
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
      .pipe(gulp.dest("../release/latest/bookmarklet/"));
});

gulp.task('build', ['popup', 'shared', 'vendor', 'bookmarklet', 'emoji']);

gulp.task('default', ['build', 'watch']);

gulp.task('dev', ['server', 'build', 'watch']);
