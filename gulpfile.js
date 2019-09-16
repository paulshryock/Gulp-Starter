const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const connect = require('gulp-connect')

const defaults = {
  html: {
    src: './src/*.html',
    dest: './build'
  },
  css: {
    src: './src/css/**/*.css',
    dest: './build/css'
  },
  js: {
    src: './src/js/**/*.js',
    dest: './build/js',
    root: './*.js'

  }
}

function clean () {
  const del = require('del')

  return del([defaults.html.dest])
}

function htmlBundle () {
  return gulp.src(defaults.html.src)
    .pipe(gulp.dest(defaults.html.dest))
    .pipe(connect.reload())
}

function cssLint () {
  const gulpStylelint = require('gulp-stylelint')

  return gulp.src(defaults.css.src)
    .pipe(gulpStylelint({
      config: {
        extends: ['stylelint-config-standard']
      },
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
}

function cssBundle () {
  const postcss = require('gulp-postcss')

  return gulp.src(defaults.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-easy-import'), // Concatenate
      require('precss'), // Transpile Sass
      require('postcss-preset-env'), // Use modern CSS
      require('autoprefixer') // Add vendor prefixes
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(defaults.css.dest))
    .pipe(postcss([
      require('cssnano') // Minify
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(defaults.css.dest))
    .pipe(connect.reload())
}

function jsLint () {
  const standard = require('gulp-standard')

  return gulp.src([defaults.js.src, defaults.js.root])
    .pipe(standard({ fix: true }))
    .pipe(standard.reporter('default'))
}

function jsBundle () {
  const concat = require('gulp-concat')
  const uglify = require('gulp-uglify')

  return gulp.src(defaults.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(defaults.js.dest))
    .pipe(uglify()) // Minify
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(defaults.js.dest))
    .pipe(connect.reload())
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
  gulp.parallel(htmlBundle, cssLint, jsLint),
  gulp.parallel(cssBundle, jsBundle)
)

exports.serve = gulp.series(
  clean,
  gulp.parallel(serve, watch)
)
