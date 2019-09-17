# Gulp Starter documentation

## Gulp tasks

### Default

```bash
gulp
```

Kicks off this workflow:

- Clean `/build` directory
- Lint
  - Lint CSS (`gulp-stylelint`)
    - Fix?
  - Lint JS (`gulp-standard`)
    - Fix (works?)
- HTML
  - Minify HTML (`gulp-htmlmin`)
  - Copy to `/build`
- CSS
  - Process CSS (`gulp-postcss`)
  - Bundle and copy to `/build/css`
  - Minify CSS (`gulp-postcss`, `cssnano`)
  - Maintain Sourcemaps
- JS
  - Bundle and copy to `/build/js`
  - Minify JS (`uglify`)
  - Maintain Sourcemaps

### Serve

```bash
gulp serve
```

Runs the build workflow (minus cleaning and linting), then serves `/build` and watches for changes

## npm scripts

- `npm start` runs `gulp`
- `npm run build` runs `gulp`
- `npm run serve` runs `gulp serve`