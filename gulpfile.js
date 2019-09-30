const gulp = require('gulp')
const del = require('del')
const gulpif = require('gulp-if')
const concat = require('gulp-concat')
const beautify = require('gulp-beautify')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const isProduction = process.env.NODE_ENV === 'production'

const defaults = {
  html: {
    src: './src/*.html',
    dest: './build'
  },
  css: {
    src: './src/_assets/css/style.css',
    dest: './build/css',
    bundle: './build/css/bundle.css'
  },
  js: {
    root: './*.js',
    src: './src/_assets/js/**/*.js',
    dest: './build/js',
    bundle: './build/js/bundle.js'
  },
  fonts: {
    src: './src/_assets/fonts/**/*',
    dest: './build/fonts'
  },
  images: {
    src: './src/_assets/img/**/*',
    dest: './build/img'
  },
  favicon: {
    src: './src/_assets/favicon/**/*',
    dest: './build'
  }
}

function cleanBuild () {
  const clean = del([defaults.html.dest])

  return clean
}

function cleanBundles (asset) {
  const clean = del([defaults.css.bundle, defaults.js.bundle])

  return clean
}

function htmlBundle () {
  const htmlmin = require('gulp-htmlmin')
  const bundle = gulp.src(defaults.html.src)
    .pipe(gulpif(isProduction, htmlmin({ collapseWhitespace: true }), beautify.html({ indent_size: 2 })))
    .pipe(gulp.dest(defaults.html.dest))
    .pipe(connect.reload())

  return bundle
}

function cssLint () {
  const gulpStylelint = require('gulp-stylelint')
  const lint = gulp.src(defaults.css.src)
    .pipe(gulpStylelint({
      config: {
        extends: ['stylelint-config-standard']
      },
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))

  return lint
}

function cssBundle () {
  const postcss = require('gulp-postcss')
  const bundle = gulp.src(defaults.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-easy-import'), // @import files
      require('precss'), // Transpile Sass-like syntax
      require('postcss-preset-env'), // Polyfill modern CSS
      require('autoprefixer') // Vendor prefixes
    ]))
    .pipe(sourcemaps.write()) // Maintain Sourcemaps
    .pipe(concat('bundle.css')) // Concatenate and rename
    .pipe(gulp.dest(defaults.css.dest))
    .pipe(gulpif(isProduction, postcss([
      require('cssnano')
    ]), beautify.css({ indent_size: 2 }))) // Minify or Beautify
    .pipe(gulpif(isProduction, rename({ suffix: '.min' })))
    .pipe(gulpif(isProduction, sourcemaps.write())) // Maintain Sourcemaps
    .pipe(gulp.dest(defaults.css.dest))
    .pipe(connect.reload())

  return bundle
}

function jsLint () {
  const standard = require('gulp-standard')
  const lint = gulp.src([defaults.js.src, defaults.js.root])
    .pipe(standard({ fix: true }))
    .pipe(standard.reporter('default'))

  return lint
}

function jsBundle () {
  const uglify = require('gulp-uglify')
  const bundle = gulp.src(defaults.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate and rename
    .pipe(sourcemaps.write()) // Maintain Sourcemaps
    .pipe(gulp.dest(defaults.js.dest))
    .pipe(gulpif(isProduction, uglify(), beautify({ indent_size: 2 }))) // Minify or Beautify
    .pipe(gulpif(isProduction, rename({ suffix: '.min' })))
    .pipe(gulpif(isProduction, sourcemaps.write())) // Maintain Sourcemaps
    .pipe(gulp.dest(defaults.js.dest))
    .pipe(connect.reload())

  return bundle
}

function fontsBundle () {
  const bundle = gulp.src(defaults.fonts.src)
    .pipe(gulp.dest(defaults.fonts.dest))
    .pipe(connect.reload())

  return bundle
}

function imagesBundle () {
  const bundle = gulp.src(defaults.images.src)
    .pipe(gulp.dest(defaults.images.dest))
    .pipe(connect.reload())

  return bundle
}

function faviconBundle () {
  const bundle = gulp.src(defaults.favicon.src)
    .pipe(gulp.dest(defaults.favicon.dest))
    .pipe(connect.reload())

  return bundle
}

function serve () {
  connect.server({
    root: defaults.html.dest,
    livereload: true
  })
}

function watch () {
  gulp.watch([defaults.html.src], htmlBundle)
  gulp.watch([defaults.css.src], cssBundle)
  gulp.watch([defaults.js.src, defaults.js.root], jsBundle)
}

/**
 * Gulp tasks
 */

exports.build = gulp.series(
  cleanBuild,
  gulp.parallel(cssLint, jsLint),
  gulp.parallel(htmlBundle, cssBundle, jsBundle, fontsBundle, imagesBundle, faviconBundle),
  cleanBundles
)

exports.develop = gulp.series(
  cleanBuild,
  gulp.parallel(cssLint, jsLint),
  gulp.parallel(htmlBundle, cssBundle, jsBundle, fontsBundle, imagesBundle, faviconBundle)
)

exports.serve = gulp.series(
  cleanBuild,
  gulp.parallel(cssLint, jsLint),
  gulp.parallel(htmlBundle, cssBundle, jsBundle, fontsBundle, imagesBundle, faviconBundle),
  gulp.parallel(serve, watch)
)
