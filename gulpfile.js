const { src, dest, series, parallel } = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')

const defaults = {
  html: {
    src: './src/*.html',
    dest: './build'
  },
  css: {
    src: './src/css/*.css',
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

  return del([
    'build/'
  ])
}

function htmlBundle () {
  return src(defaults.html.src)
    .pipe(dest(defaults.html.dest))
}

function cssLint () {
  const gulpStylelint = require('gulp-stylelint')

  return src(defaults.css.src)
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

  return src(defaults.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-easy-import'), // Concatenate
      require('precss'), // Transpile Sass
      require('postcss-preset-env'), // Use modern CSS
      require('autoprefixer') // Add vendor prefixes
    ]))
    .pipe(sourcemaps.write())
    .pipe(dest(defaults.css.dest))
    .pipe(postcss([
      require('cssnano') // Minify
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(dest(defaults.css.dest))
}

function jsLint () {
  var standard = require('gulp-standard')

  return src([defaults.js.src, defaults.js.root])
    .pipe(standard({ fix: true }))
    .pipe(standard.reporter('default'))
}

function jsBundle () {
  const concat = require('gulp-concat')
  const uglify = require('gulp-uglify')

  return src(defaults.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate
    .pipe(sourcemaps.write())
    .pipe(dest(defaults.js.dest))
    .pipe(uglify()) // Minify
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(dest(defaults.js.dest))
}

exports.build = series(
  clean,
  parallel(htmlBundle, cssLint, jsLint),
  parallel(cssBundle, jsBundle)
)
