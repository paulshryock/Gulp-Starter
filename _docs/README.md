# Gulp Starter documentation

## Gulp tasks

### Default

```bash
gulp build
```

Kicks off this workflow:

- Clean `/build` directory
- Lint
  - Lint CSS (`gulp-stylelint`)
    - Fix?
  - Lint JS (`gulp-standard`)
    - Fix (works?)
- HTML
  - Minify or Beautify HTML (`gulp-htmlmin`, `beautify`)
  - Copy to `/build`
- CSS
  - Process CSS (`gulp-postcss`)
    - @import files (`postcss-easy-import`)
    - Transpile Sass-like syntax (`precss`)
    - Polyfill modern CSS (`postcss-preset-env`)
    - Add vendor prefixes (`autoprefixer`)
  - Bundle and copy to `/build/css/bundle.css`
  - Minify or Beautify CSS (`gulp-postcss`, `cssnano`, `beautify`)
  - Maintain Sourcemaps
- JS
  - Compile ECMAScript 2015+ into a backwards compatible version of JavaScript (`babel`)
  - Bundle and copy to `/build/js/bundle.js`
  - Minify or Beautify JS (`uglify`, `beautify`)
  - Maintain Sourcemaps
- Fonts
  - Copy to `/build/fonts`
- Images
  - Copy to `/build/img`
- Favicons
  - Copy to `/build`
- Clean unminified CSS and JS bundle files

### Develop

```bash
gulp develop
```

Sets `NODE_ENV` to `'development'` and runs the build workflow without cleaning CSS and JS bundles.

### Serve

```bash
gulp serve
```

Sets `NODE_ENV` to `'development'` and runs the build workflow without cleaning CSS and JS bundles, serves `/build`, and watches for changes.

## npm scripts

- `npm start` runs `gulp build`
- `npm run build` runs `gulp build`
- `npm run develop` runs `gulp develop`
- `npm run serve` runs `gulp serve`