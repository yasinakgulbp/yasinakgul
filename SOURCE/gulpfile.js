const
  gulp = require('gulp'),
  autoPrefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  noop = require('gulp-noop'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass')(require('sass')),
  server = require('browser-sync').create(),
  sourcemaps = require('gulp-sourcemaps'),
  terser = require('gulp-terser'),
  wrapper = require('gulp-wrapper'),
  cleanCSS = require('gulp-clean-css');

/* ======================================================================== */
/* SETUP */
/* ======================================================================== */
const
  compilation = {
    src: '.', // source dir (current)
    dist: '../HTML', // compilation dir
    minify: true
  };

/* ======================================================================== */
/* PATHS TO RESOURCES */
/* ======================================================================== */
const
  path = {
    vendor: {
      styles: [
        compilation.src + '/static/sass/libraries/*.css',
        compilation.src + '/static/sass/libraries/*.sass',
      ],
      scripts: [
        compilation.src + '/static/js/framework/*.js',
        compilation.src + '/static/js/libraries/*.js',
        compilation.src + '/static/js/plugins/*.js'
      ]
    },
    components: {
      styles: [
        compilation.src + '/static/sass/helpers/*.sass',
        compilation.src + '/static/sass/mixins.sass',
        compilation.src + '/static/sass/vars.sass',
        compilation.src + '/static/sass/*.sass',
        compilation.src + '/components/**/*.sass',
      ],
      scripts: [
        compilation.src + '/static/js/common.js',
        compilation.src + '/components/_base/*.js',
        compilation.src + '/components/{**,!_base}/*.js'
      ]
    },
    watch: [
      compilation.dist + '/**/*.*', // watch for all files changes in compilation dir
      '!' + compilation.dist + '/**/*.+(js|css|map)', // don't watch for files that are complied (those are handled by browser-sync)
    ]
  };

/* ======================================================================== */
/* VENDOR RESOURCES */
/* ======================================================================== */
function vendorCSS() {
  return gulp.src(path.vendor.styles)
    .pipe(plumber())
    .pipe(sass({
      allowEmpty: true
    }).on('error', sass.logError))
    .pipe(concat('vendor.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(compilation.dist + '/css'))
    .pipe(server.reload({
      stream: true
    }));
}

function vendorJS() {
  return gulp.src(path.vendor.scripts)
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(compilation.dist + '/js'))
    .pipe(server.reload({
      stream: true
    }));
}

/* ======================================================================== */
/* COMPONENTS RESOURCES */
/* ======================================================================== */
function componentsCSS() {
  return gulp.src(path.components.styles)
    .pipe(plumber())
    .pipe(compilation.minify ? noop() : sourcemaps.init())
    .pipe(concat('main.sass'))
    .pipe(sass({
      allowEmpty: true,
      outputStyle: compilation.minify ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(autoPrefixer())
    .pipe(compilation.minify ? noop() : sourcemaps.write('/'))
    .pipe(gulp.dest(compilation.dist + '/css'))
    .pipe(server.reload({
      stream: true
    }));
}

function componentsJS() {
  return gulp.src(path.components.scripts)
    .pipe(plumber())
    .pipe(compilation.minify ? noop() : sourcemaps.init())
    .pipe(concat('components.js'))
    .pipe(wrapper({
      header: '(function ($) {\n\n\'use strict\';\n\n',
      footer: '\n\n})(jQuery);\n'
    }))
    .pipe(compilation.minify ? noop() : sourcemaps.write('/'))
    .pipe(compilation.minify ? terser() : noop())
    .pipe(gulp.dest(compilation.dist + '/js'))
    .pipe(server.reload({
      stream: true
    }));
}

/* ======================================================================== */
/* BROWSER SYNC */
/* ======================================================================== */
function browserSync(done) {
  server.init({
    server: compilation.dist,
    cors: true
  });

  done();
}

function browserSyncReload(done) {
  server.reload();
  done();
}

/* ======================================================================== */
/* WATCHER */
/* ======================================================================== */
function watcher() {
  gulp.watch(path.vendor.styles, vendorCSS);
  gulp.watch(path.vendor.scripts, vendorJS);
  gulp.watch(path.components.styles, componentsCSS);
  gulp.watch(path.components.scripts, componentsJS);
  gulp.watch(path.watch, browserSyncReload);
}

exports.default = gulp.series(
  gulp.parallel(vendorCSS, vendorJS, componentsCSS, componentsJS),
  browserSync,
  watcher
);
