var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var cssmin = require('gulp-cssmin')
var uglify = require('gulp-uglify')
var del = require('del')
var rename = require('gulp-rename')

function yshtml(done) {
  gulp
    .src('src/index.html')

    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )

    .pipe(gulp.dest('./dist'))
  done()
}

function yscss(done) {
  gulp
    .src('src/css/index.css')

    .pipe(cssmin())

    .pipe(
      rename(function (path) {
        path.basename += '.min'
      })
    )

    .pipe(gulp.dest('./dist/css'))
  done()
}

function ysjs(done) {
  gulp
    .src('src/js/**/*.js')

    .pipe(
      uglify({
        mangle: true
      })
    )

    .pipe(
      rename(path => {
        path.basename += '.min'
      })
    )

    .pipe(gulp.dest('./dist/js'))
  done()
}

function clean(done) {
  del('dist/**/*')
  done()
}

gulp.task('build', gulp.series(clean, gulp.parallel(yshtml, yscss, ysjs)))