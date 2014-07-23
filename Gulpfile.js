var gulp = require('gulp'),
    clean = require('gulp-clean'),
    imageResize = require('gulp-image-resize'),
    spritesmith = require('gulp.spritesmith');

var emojis = require('./shared/emojis.json');

gulp.task('emoji', function () {
    return gulp.src('./shared/img/emoji/*')
        .pipe(imageResize({
          width : 46,
          height : 46
        }))
        .pipe(gulp.dest("./tmp/"));
});

gulp.task('sprite', ['emoji'], function () {
  var spriteData = gulp.src("./tmp/*.png").pipe(spritesmith({
    imgName: 'sprite.png',
    cssFormat : 'json',
    cssTemplate : function (params) {
      var coll = params.items.reduce(function (coll, item) {
        coll[item.name] = {
          name : item.name,
          x : item.x,
          y : item.y
        };
        return coll;
      }, {});

      Object.keys(emojis).forEach(function (k) {
        Object.keys(emojis[k]).forEach(function(emoji){
          emojis[k][emoji] = coll[emoji];
        });
      });

      return JSON.stringify(emojis);
    },
    algorithm : 'binary-tree',
    cssName: 'sprite.json'
  }));
  spriteData.img.pipe(gulp.dest("./shared/sprite/"));
  return spriteData.css.pipe(gulp.dest("./shared/sprite"));
});

gulp.task('clean', ['emoji', 'sprite'], function () {
    return gulp.src('./tmp', {read: false}).pipe(clean());
});

gulp.task('generate-sprite', ['emoji', 'sprite', 'clean']);
