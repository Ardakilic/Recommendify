'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const nano = require('gulp-cssnano')
const uglify = require('gulp-uglify')
const del = require('del')


gulp.task('clear', function () {
    del('./dist');
})

gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .pipe(nano())
        .pipe(gulp.dest('./dist/css'))
})


gulp.task('js', function () {
    return gulp.src('src/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
})


gulp.task('default', ['clear', 'sass', 'js'])
