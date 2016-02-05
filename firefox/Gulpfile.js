var gulp = require("gulp"),
    xpi = require("jpm/lib/xpi"),
    post = require("jpm/lib/post"),
    path = require("path"),
    fs = require("fs-promise"),
    common = require("../gulp-common"),
    rename = require("gulp-rename"),
    jade = require("gulp-jade");

var emojis = require("../shared/data/sprite.json");
var pkg = require('../package.json');

var build = "./build/";

gulp.task("popup", function() {
  gulp.src("../shared/popup.jade")
    .pipe(jade({
      pretty: true,
      locals: {
        emojis: emojis,
        browser: "Firefox"
      }
    }))
    .pipe(gulp.dest(build + "data/"));
});

gulp.task("js", function() {
  gulp.src("./vendor.js").pipe(gulp.dest(build + "data/src/"));
  gulp.src("./main.js").pipe(gulp.dest(build + "lib/"));
  gulp.src("./helper.js").pipe(gulp.dest(build + "data/"));
});

gulp.task("emoji", function () {
    return gulp.src(common.emoji).pipe(gulp.dest(build + "data/img/emoji/"));
});

gulp.task("shared", function() {
  gulp.src([
    "../shared/**/*",
    "!../shared/icons/",
    "!../shared/popup.jade",
    "!../shared/img/emoji/*"
  ]).pipe(gulp.dest(build + "data/"));
  gulp.src("../package.json").pipe(gulp.dest(build));
  gulp.src("../shared/icons/icon48.png").pipe(rename("icon.png")).pipe(gulp.dest(build));
  gulp.src("../shared/icons/icon_alt.png").pipe(rename("icon64.png")).pipe(gulp.dest(build));
});

// Rerun the task when a file changes
gulp.task("watch", ["build", "post"], function() {
  gulp.watch("../shared/popup.jade", ["popup", "post"]);
  gulp.watch("../shared/src/*.js", ["shared", "post"]);
  gulp.watch("../shared/style/*.css", ["shared", "post"]);
  gulp.watch("./*.js", ["js", "post"]);
});

gulp.task("build", ["popup", "shared", "js", "emoji"]);

gulp.task("post", function() {
  var options = {
    postUrl: 'http://localhost:8888/',
    addonDir: path.resolve("./build/")
  };

  return post(pkg, options);
});

gulp.task("release", ["build"], function() {
  var options = {
    addonDir: path.resolve("./build/"),
    xpiPath: path.resolve("../release/latest/firefox/")
  };

  return fs.mkdirs("../release/latest/firefox/").then(function(){
    return xpi(pkg, options);
  }).then(function(){
    return fs.rename(`../release/latest/firefox/jid1-Xo5SuA6qc1DFpw@jetpack-${pkg.version}.xpi`, "../release/latest/firefox/emoji-helper.xpi");
   });
});

gulp.task("default", ["build", "watch"]);
