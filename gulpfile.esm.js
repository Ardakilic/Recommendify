const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const terser = require('gulp-terser');

// @ts-ignore
const { pipeline } = require('readable-stream');

gulp.task('clear', async () => {
  await del('./dist');
});

gulp.task('sass', async () => gulp.src('./src/assets/sass/**/*.scss')
  .pipe(sass())
  .pipe(postcss())
  .pipe(gulp.dest('./dist/css')));

gulp.task('js', async () => pipeline(
  gulp.src('src/assets/js/app.js')
    .pipe(terser()),
  gulp.dest('./dist/js'),
));

gulp.task('html', async () => gulp.src('./src/assets/index.html')
  .pipe(gulp.dest('./dist')));

gulp.task('default', gulp.series('clear', gulp.parallel('sass', 'js', 'html')));
