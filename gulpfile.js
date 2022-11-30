import gulp from 'gulp';
const { src, dest, task, watch, series, parallel } = gulp;

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// const sas = require('gulp-sass')(require('sass'));

import browserSync from 'browser-sync'
// const browserSync = require('browser-sync').create();

import cssnano from 'cssnano'
// const cssnano = require('cssnano');

import rename from 'gulp-rename'
// const rename = require('gulp-rename');

import postcss from 'gulp-postcss'
// const postcss = require('gulp-postcss');

import csscomb from 'gulp-csscomb';
// const csscomb = require('gulp-csscomb');

import autoprefixer from 'autoprefixer';
// const autoprefixer = require('autoprefixer');

import mqpacker from 'css-mqpacker';
// const mqpacker = require('css-mqpacker');

import sortCSSmq from 'sort-css-media-queries';
// const sortCSSmq = require('sort-css-media-queries');

import terser from 'gulp-terser';
// const terser = require('gulp-terser');

import concat from 'gulp-concat';
// const concat = require('gulp-concat');

import * as del from 'del';
// const del = require('del');


const PATH = {
  scssFile: './assets/scss/style.scss',
  scssFiles: './assets/scss/**/*.scss',
  scssFolder: './assets/scss',
  cssMinFiles: './assets/css/**/*.min.css',
  cssFolder: './assets/css',
  htmlFiles: './*.html',
  jsFiles: [
    './assets/js/**/*.js',
    '!./assets/js/**/*.min.js',
  ],
  jsMinFiles: './assets/js/**/*.min.js',
  jsFolder: './assets/js',
  jsBundleName: 'bundle.js',
  buildFolder: 'dist'
};

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions', '> 1%']
  }),
  mqpacker({ sort: sortCSSmq })
];

function scss() {
  return src(PATH.scssFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(csscomb())
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
};

function scssDev() {
  return src(PATH.scssFile, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
    .pipe(browserSync.stream());
};

function scssMin() {
  const pluginsExtended = [...PLUGINS, cssnano({ preset: 'default' })]

  return src(PATH.scssFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(csscomb())
    .pipe(postcss(pluginsExtended))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder))
};

function comb() {
  return src(PATH.scssFiles)
    .pipe(csscomb())
    .pipe(dest(PATH.scssFolder))
};

function syncInit() {
  browserSync.init({
    server: './'
  });
};

async function sync() {
  browserSync.reload()
};

function watchFiles() {
  syncInit();
  watch(PATH.scssFiles, series(scss, scssMin));
  watch(PATH.htmlFiles, sync);
  watch(PATH.jsFiles, sync);
};

function uglifyJS() {
  return src(PATH.jsFiles)
    .pipe(terser({
      toplevel: true,
      output: { quote_style: 3 }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.jsFolder))
};

function concatJS() {
  return src(PATH.jsFiles)
    .pipe(concat(PATH.jsBundleName))
    .pipe(dest(PATH.jsFolder))
};

function buildJS() {
  return src(PATH.jsMinFiles)
    .pipe(dest(PATH.buildFolder + '/js'))
};

function buildHTML() {
  return src(PATH.htmlFiles)
    .pipe(dest(PATH.buildFolder + '/templates'))
};

function buildCSS() {
  return src(PATH.cssMinFiles)
    .pipe(dest(PATH.buildFolder + '/css'))
}

async function clearFolder() {
  await del(PATH.buildFolder, { force: true })
  return true
};

task('scss', series(scss, scssMin));
task('min', scssMin);
task('dev', scssDev);
task('comb', comb);
task('watch', watchFiles);

task('uglify', uglifyJS);
task('concat', concatJS);

task('build', series(clearFolder, parallel(buildJS, buildHTML, buildCSS)));