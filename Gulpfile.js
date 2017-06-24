var gulp = require("gulp"),
    buffer = require('vinyl-buffer'),
    clean = require("gulp-clean"),
    imageminPngquant = require('imagemin-pngquant'),
    imageResize = require("gulp-image-resize"),
    zip = require("gulp-zip"),
    jade = require("gulp-jade"),
    spritesmith = require("gulp.spritesmith");

var build = "./build/";

var sprite = require("./data/sprite.json");
var emojis = require("./data/emojis.json");
var unicode = require("./data/unicode.json");

var static = [
  "./img/emoji/clock9.png",
  "./img/emoji/smiley.png",
  "./img/emoji/cherry_blossom.png",
  "./img/emoji/bell.png",
  "./img/emoji/oncoming_automobile.png",
  "./img/emoji/symbols.png",
  "./img/emoji/hatched_chick.png",
  "./img/emoji/octopus.png",
  "./img/emoji/heart.png"
];

gulp.task("manifest", function() {
  gulp.src("./manifest.json").pipe(gulp.dest(build));
});

gulp.task("emoji", function () {
  return gulp.src(static).pipe(gulp.dest(build + "img/emoji/"));
});

gulp.task("release", function () {
  gulp.src([build + "**/*"])
    .pipe(zip("emoji-helper.zip"))
    .pipe(gulp.dest("./release/latest/"));
});

gulp.task("sources", function() {
  gulp.src([
    "./src/**/*",
    "!./src/popup.jade",

    "./img/emoji-help.png",
    "./img/sprite.png",

    "./icons/icon32.png",
    "./icons/icon48.png",
    "./icons/icon128.png",
  ]).pipe(gulp.dest(build));
});

gulp.task("popup", function() {
  gulp.src("./src/popup.jade")
    .pipe(jade({
      locals: { emojis: sprite }
    }))
    .pipe(gulp.dest(build));
});

gulp.task("resize", function () {
  return gulp.src("./img/emoji/*")
    .pipe(imageResize({
      width: 46,
      height: 46
    }))
    .pipe(gulp.dest("./tmp/"));
});

gulp.task("sprite", ["resize"], function () {
  var spriteData = gulp.src("./tmp/*.png").pipe(spritesmith({
    imgName: "sprite.png",
    cssFormat: "json",
    cssTemplate: function (params) {
      var coll = params.items.reduce(function (c, item) {
        c[item.name] = {
          name: item.name,
          x: item.x,
          y: item.y
        };
        return c;
      }, {});

      Object.keys(emojis).forEach(function (k) {
        Object.keys(emojis[k]).forEach(function(emoji){
          coll[emoji].unicode = unicode[emoji];
          emojis[k][emoji] = coll[emoji];
        });
      });

      return JSON.stringify(emojis);
    },
    algorithm: "binary-tree",
    cssName: "sprite.json"
  }));
  spriteData.css.pipe(gulp.dest("./data"));
  return spriteData.img
    .pipe(buffer())
    .pipe(imageminPngquant({quality: '0-100', speed: 1})())
    .pipe(gulp.dest("./img/"));
});

// Rerun the task when a file changes
gulp.task("watch", function() {
  gulp.watch("./src/*", ["build"]);
});

gulp.task("clean", ["resize", "sprite"], function () {
  return gulp.src("./tmp", {read: false}).pipe(clean());
});

gulp.task("generate-sprite", ["resize", "sprite", "clean"]);

gulp.task("build", ["sources", "manifest", "popup", "emoji"]);

gulp.task("default", ["build", "watch"]);
