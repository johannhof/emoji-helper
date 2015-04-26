var gulp = require("gulp"),
    common = require("../gulp-common"),
    rename = require("gulp-rename"),
    jade = require("gulp-jade");

var emojis = require("../shared/data/sprite.json");

var build = "./build/emoji.safariextension/";

gulp.task("popup", function() {
  gulp.src("../shared/popup.jade")
    .pipe(jade({
      locals: {
        emojis: emojis,
        browser: "Safari"
      }
    }))
    .pipe(gulp.dest(build));
});

gulp.task("manifest", function() {
  gulp.src("./Info.plist").pipe(gulp.dest(build));
});

gulp.task("vendor", function() {
  gulp.src("./vendor.js").pipe(gulp.dest(build + "src/"));
});

gulp.task("emoji", function () {
    return gulp.src(common.emoji).pipe(gulp.dest(build + "img/emoji/"));
});

gulp.task("shared", function() {
  gulp.src([
    "../shared/**/*",
    "!../shared/popup.jade",
    "!../shared/img/emoji/*"
  ]).pipe(gulp.dest(build));
  gulp.src("../shared/icons/icon_alpha.png").pipe(gulp.dest(build));
  gulp.src("../shared/icons/icon64.png").pipe(rename("icon.png")).pipe(gulp.dest(build));
});

// Rerun the task when a file changes
gulp.task("watch", function() {
  gulp.watch("../shared/popup.jade", ["build"]);
  gulp.watch("../shared/src/*.js", ["build"]);
  gulp.watch("../shared/style/*.css", ["build"]);
  gulp.watch("./vendor.js", ["build"]);
});

gulp.task("release", function () {
  gulp.src([build + "**/*"])
      .pipe(gulp.dest("../release/latest/safari/emoji.safariextension/"));
});

gulp.task("build", ["popup", "shared", "manifest", "vendor", "emoji"]);

gulp.task("default", ["build", "watch"]);
