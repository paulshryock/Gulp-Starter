const gulp = require('gulp')
const gulpif = require('gulp-if')
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
    dest: './build/css'
  },
  js: {
    src: './src/_assets/js/**/*.js',
    dest: './build/js',
    root: './*.js'

  }
}

function clean () {
  const del = require('del')
  const clean = del([defaults.html.dest])

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
      require('postcss-easy-import'), // Concatenate
      require('precss'), // Transpile Sass
      require('postcss-preset-env'), // Use modern CSS
      require('autoprefixer') // Add vendor prefixes
    ]))
    .pipe(sourcemaps.write()) // Maintain Sourcemaps
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
  const concat = require('gulp-concat')
  const uglify = require('gulp-uglify')
  const bundle = gulp.src(defaults.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate
    .pipe(sourcemaps.write()) // Maintain Sourcemaps
    .pipe(gulp.dest(defaults.js.dest))
    .pipe(gulpif(isProduction, uglify(), beautify({ indent_size: 2 }))) // Minify or Beautify
    .pipe(gulpif(isProduction, rename({ suffix: '.min' })))
    .pipe(gulpif(isProduction, sourcemaps.write())) // Maintain Sourcemaps
    .pipe(gulp.dest(defaults.js.dest))
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
  gulp.watch([defaults.html.src], gulp.series('htmlBundle'))
  gulp.watch([defaults.css.src], gulp.series('cssBundle'))
  gulp.watch([defaults.js.src, defaults.js.root], gulp.series('jsBundle'))
}

exports.htmlBundle = htmlBundle
exports.cssBundle = cssBundle
exports.jsBundle = jsBundle

exports.build = gulp.series(
  clean,
  gulp.parallel(cssLint, jsLint),
  gulp.parallel(htmlBundle, cssBundle, jsBundle)
)

exports.serve = gulp.series(
  clean,
  gulp.parallel(cssLint, jsLint),
  gulp.parallel(htmlBundle, cssBundle, jsBundle),
  gulp.parallel(serve, watch)
)
