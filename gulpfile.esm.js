import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const terser = require('gulp-terser');
const postcss = require('gulp-postcss');

const sass = gulpSass(dartSass);
const {
  series, parallel, src, dest,
} = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

async function clean() {
  return del('./dist');
}

async function scss() {
  return src('./src/assets/sass/*.scss').pipe(sass()).pipe(postcss()).pipe(dest('./dist/css'));
}

async function html() {
  return src('./src/assets/index.html').pipe(dest('./dist'));
}

async function js() {
  return src('./src/assets/js/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/js/'));
}

export {
  clean, scss, js, html,
};
export default series(clean, parallel(scss, html, js));
