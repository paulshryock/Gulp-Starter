const { src, dest, series, parallel } = require('gulp');

function clean() {
  const del = require('del');

  return del([
    'build/'
  ]);
}

function cssLint() {
  const gulpStylelint = require('gulp-stylelint');

  return src('src/css/*.css')
    .pipe(gulpStylelint({
      config: {
        extends: ['stylelint-config-standard'],
      },
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
}

function css() {
  const postcss    = require('gulp-postcss')
  const sourcemaps = require('gulp-sourcemaps')

  return src('src/css/*.css')
    .pipe( sourcemaps.init() )
    .pipe( postcss([
      require('postcss-easy-import'), // Inline @import rules content with extra features
      require('precss'), // Use Sass-like markup in your CSS
      require('postcss-node-sass'), // Parse styles with node-sass
      require('postcss-preset-env'), // Convert modern CSS into something browsers understand
      require('autoprefixer'), // Add vendor prefixes
      require('cssnano') // Modern CSS compression
      ]) )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('./build/css') )
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(
    series(cssLint, css),
    series(jsTranspile, jsBundle, jsMinify)
  ),
  publish
);