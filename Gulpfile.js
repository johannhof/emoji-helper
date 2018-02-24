var gulp = require("gulp");
var buffer = require('vinyl-buffer');
var imageminPngquant = require('imagemin-pngquant');
var imageResize = require("gulp-image-resize");
var zip = require("gulp-zip");
var jade = require("gulp-jade");
var spritesmith = require("gulp.spritesmith");
var request = require("request-promise-native");
var fs = require("fs-extra");

const BUILD_DIR = "./build/";
const VERSION = "2.1.0";

var static = [
  "./data/emoji/clock9.png",
  "./data/emoji/smiley.png",
  "./data/emoji/cherry_blossom.png",
  "./data/emoji/bell.png",
  "./data/emoji/oncoming_automobile.png",
  "./data/emoji/symbols.png",
  "./data/emoji/hatched_chick.png",
  "./data/emoji/squid.png",
  "./data/emoji/heart.png",
  "./data/emoji/mag.png",
];

gulp.task("emoji", function() {
  return gulp.src(static).pipe(gulp.dest(BUILD_DIR + "./img/emoji/"));
});

gulp.task("sources", function() {
  gulp.src([
    "./src/**/*",
    "!./src/popup.jade",

    "./data/emoji.json",
    "./data/sprite.png",

    "./manifest.json",

    "./icons/icon32.png",
    "./icons/icon48.png",
    "./icons/icon128.png",
  ]).pipe(gulp.dest(BUILD_DIR));
});

gulp.task("popup", function() {
  let sprite = require("./data/emoji.json");

  gulp.src("./src/popup.jade")
    .pipe(jade({
      locals: { version: VERSION, emojis: sprite }
    }))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task("fetch-images", function() {
  return request({
    url: "https://api.github.com/emojis",
    headers: { "User-Agent": ":unicorn:" },
    json: true,
  }).then(function(emojis) {
    let downloads = [];
    for (let id of Object.keys(emojis)) {
      downloads.push(request({
        url: emojis[id],
        headers: { "User-Agent": ":unicorn:" },
        encoding: null,
      }).then(function(data) {
        return fs.writeFile(`data/emoji/${id}.png`, data);
      }));
    }
    return Promise.all(downloads);
  });
});

gulp.task("sprite", function () {
  return request({
    url: "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json",
    headers: { "User-Agent": ":unicorn:" },
    json: true,
  }).then(function(emojis) {
    let categories = {
      "People": [],
      "Nature": [],
      "Foods": [],
      "Activity": [],
      "Places": [],
      "Objects": [],
      "Symbols": [],
      "Flags": [],
    };
    for (let emoji of emojis) {
      if (emoji.category) {
        categories[emoji.category].push({
          name: emoji.aliases[0],
          unicode: emoji.emoji,
          tags: emoji.tags,
        });
      }
    }

    return {
      "recent": [],
      "people": categories.People,
      "nature": categories.Nature.concat(categories.Foods),
      "objects": categories.Activity.concat(categories.Objects),
      "places": categories.Places.concat(categories.Flags),
      "symbols": categories.Symbols,
    };
  }).then(function(emojis) {
    var spriteData = gulp.src("./data/emoji/*")
      .pipe(imageResize({
        width: 46,
        height: 46
    })).pipe(spritesmith({
      imgName: "sprite.png",
      cssFormat: "json",
      cssTemplate: function (params) {
        var coll = params.items.reduce(function (c, item) {
          c[item.name] = {
            x: item.x,
            y: item.y
          };
          return c;
        }, {});

        for (let category of Object.keys(emojis)) {
          for (let emoji of emojis[category]) {
            emoji.x = coll[emoji.name].x;
            emoji.y = coll[emoji.name].y;
          }
        }

        return JSON.stringify(emojis);
      },
      algorithm: "binary-tree",
      cssName: "emoji.json"
    }));
    spriteData.css.pipe(gulp.dest("./data"));
    return spriteData.img
      .pipe(buffer())
      .pipe(imageminPngquant({quality: '0-100', speed: 1})())
      .pipe(gulp.dest("./data/"));
  });
});

// Rerun the task when a file changes
gulp.task("watch", function() {
  gulp.watch("./src/*", ["build"]);
});

gulp.task("release", ["build"], function() {
  return gulp.src([BUILD_DIR + "**/*"])
    .pipe(zip("emoji-helper.zip"))
    .pipe(gulp.dest("./release/latest/"))
    .pipe(gulp.dest(`./release/${VERSION}/`));
});

gulp.task("clean", function() {
  return Promise.all([
    fs.remove(BUILD_DIR),
    fs.remove("./release/latest/"),
    fs.remove(`./release/${VERSION}/`),
  ]);
});

gulp.task("build", ["sources", "popup", "emoji"]);

gulp.task("default", ["build", "watch"]);
