var gulp = require('gulp')
var umd = require('gulp-umd')
var ts = require('gulp-typescript')
var del = require('del')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var banner = require('gulp-banner')
var babel = require('gulp-babel')
var pkg = require('./package.json')

var tsProject = ts.createProject('tsconfig.json')
var comment = '/*!\n' +
' * <%= pkg.name %> <%= pkg.version %>\n' +
' * <%= pkg.description %>\n' +
' * Copyright 2017, <%= pkg.author %>\n' +
' * Released under the <%= pkg.license %> license.\n' +
'*/\n\n'

gulp.task('clean', function (cb) {
  del([
    'dist/**/*'
  ]).then(function (paths) {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'))
    cb()
  })
})

gulp.task('tsc', ['clean'], function () {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(rename('pea.js'))
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('umd', ['tsc'], function () {
  return gulp.src('dist/*.js')
    .pipe(umd({
      exports: function (file) {
        return 'Pea'
      },
      namespace: function (file) {
        return 'Pea'
      }
    }))
    .pipe(banner(comment, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(banner(comment, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  gulp.watch('index.ts', ['umd'])
})

gulp.task('default', function () {
})
