const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const uglifyEs = require('uglify-es');
const uglifyComposer = require('gulp-uglify/composer');

const jsMinifier = uglifyComposer(uglifyEs, console);

const { pipeline } = require('readable-stream');

gulp.task('clear', async () => {
  await del('./dist');
});

gulp.task('sass', async () => gulp.src('./src/sass/**/*.scss')
  .pipe(sass())
  .pipe(postcss())
  .pipe(gulp.dest('./dist/css')));

gulp.task('js', async () => pipeline(
  gulp.src('src/js/app.js'),
  jsMinifier({}),
  gulp.dest('./dist/js')
));

gulp.task('html', async () => gulp.src('./src/index.html')
  .pipe(gulp.dest('./dist')));

gulp.task('default', gulp.series('clear', 'sass', 'js', 'html'));
