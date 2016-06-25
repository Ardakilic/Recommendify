'use strict'

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    nano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    del = require('del')


gulp.task('clear', function () {
    del('./dist')
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
