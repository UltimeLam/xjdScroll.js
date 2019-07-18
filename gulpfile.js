const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const uglify = require('gulp-uglify')
const del = require('del')
const rename = require('gulp-rename')

function minhtml(done) {
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

function mincss(done) {
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

function minjs(done) {
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

gulp.task('build', gulp.series(clean, gulp.parallel(minhtml, mincss, minjs)))