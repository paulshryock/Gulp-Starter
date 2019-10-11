const gulp = require('gulp')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const gulpStylelint = require('gulp-stylelint')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const standard = require('gulp-standard')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const beautify = require('gulp-beautify')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const connect = require('gulp-connect')

const paths = {
  html: {
    src: './src/*.html',
    dest: './build',
    output: './build/**/*.html'
  },
  css: {
    src: './src/_assets/css/style.css',
    dest: './build/css',
    output: './build/css/bundle.css'
  },
  js: {
    root: './*.js',
    src: './src/_assets/js/**/*.js',
    dest: './build/js',
    output: './build/js/bundle.js'
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

function startTimer (cb) {
  console.time('Build process')

  return cb()
}

function endTimer (cb) {
  console.timeEnd('Build process')

  return cb()
}

function clean (cb) {
  del([paths.html.dest])

  return cb()
}

function buildHtml (cb) {
  gulp.src(paths.html.src)
    .pipe(beautify.html({ indent_size: 2 })) // Beautify
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())

  return cb()
}

function minifyHtml (cb) {
  gulp.src(paths.html.output)
    .pipe(htmlmin({ collapseWhitespace: true })) // Minify
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())

  return cb()
}

function lintCss (cb) {
  const settings = {
    config: {
      extends: ['stylelint-config-standard']
    },
    fix: true,
    reporters: [
      { formatter: 'string', console: true }
    ]
  }

  gulp.src(paths.css.src)
    .pipe(gulpStylelint(settings)) // Lint

  return cb()
}

function buildCss (cb) {
  const plugins = [
    require('postcss-easy-import'), // @import files
    require('precss'), // Transpile Sass-like syntax
    require('postcss-preset-env'), // Polyfill modern CSS
    require('autoprefixer'), // Add vendor prefixes
    require('pixrem')() // Add fallbacks for rem units
  ]

  gulp.src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins)) // Process CSS
    .pipe(concat('bundle.css')) // Concatenate and rename
    .pipe(beautify.css({ indent_size: 2 })) // Beautify
    .pipe(sourcemaps.write('.')) // Maintain Sourcemaps
    .pipe(gulp.dest(paths.css.dest))
    .pipe(connect.reload())

  return cb()
}

function minifyCss (cb) {
  gulp.src(paths.css.output)
    .pipe(sourcemaps.init())
    .pipe(postcss([require('cssnano')])) // Minify
    .pipe(rename({ suffix: '.min' })) // Rename
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(connect.reload())

  del([paths.css.output, `${paths.css.output}.map`])

  return cb()
}

function lintJs () {
  const lint = gulp.src([paths.js.src, paths.js.root])
    .pipe(standard({ fix: true })) // Lint
    .pipe(standard.reporter('default'))

  return lint
}

function buildJs (cb) {
  gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate and rename
    .pipe(babel()) // Compile ECMAScript 2015+ into a backwards compatible version of JavaScript
    .pipe(beautify({ indent_size: 2 })) // Beautify
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(connect.reload())

  return cb()
}

function minifyJs (cb) {
  gulp.src(paths.js.output)
    .pipe(sourcemaps.init())
    .pipe(uglify()) // Minify
    .pipe(rename({ suffix: '.min' })) // Rename
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(connect.reload())

  del([paths.js.output, `${paths.js.output}.map`])

  return cb()
}

function fontsBundle () {
  const bundle = gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest)) // Copy fonts
    .pipe(connect.reload())

  return bundle
}

function imagesBundle () {
  const bundle = gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest)) // Copy images
    .pipe(connect.reload())

  return bundle
}

function faviconBundle () {
  const bundle = gulp.src(paths.favicon.src)
    .pipe(gulp.dest(paths.favicon.dest)) // Copy favicons
    .pipe(connect.reload())

  return bundle
}

function serve () {
  connect.server({
    root: paths.html.dest,
    livereload: true
  })
}

function watch () {
  gulp.watch([paths.html.src], buildHtml)
  gulp.watch([paths.css.src], buildCss)
  gulp.watch([paths.js.src, paths.js.root], buildJs)
}

/**
 * Gulp tasks
 */

exports.default = gulp.series(
  startTimer,
  clean,
  gulp.parallel(lintCss, lintJs),
  gulp.parallel(buildHtml, buildCss, buildJs, fontsBundle, imagesBundle, faviconBundle),
  gulp.parallel(minifyHtml, minifyCss, minifyJs),
  endTimer
)

exports.build = gulp.series(
  startTimer,
  clean,
  gulp.parallel(lintCss, lintJs),
  gulp.parallel(buildHtml, buildCss, buildJs, fontsBundle, imagesBundle, faviconBundle),
  gulp.parallel(minifyHtml, minifyCss, minifyJs),
  endTimer
)

exports.develop = gulp.series(
  startTimer,
  clean,
  gulp.parallel(lintCss, lintJs),
  gulp.parallel(buildHtml, buildCss, buildJs, fontsBundle, imagesBundle, faviconBundle),
  endTimer
)

exports.serve = gulp.series(
  startTimer,
  clean,
  gulp.parallel(lintCss, lintJs),
  gulp.parallel(buildHtml, buildCss, buildJs, fontsBundle, imagesBundle, faviconBundle),
  endTimer,
  gulp.parallel(serve, watch)
)
