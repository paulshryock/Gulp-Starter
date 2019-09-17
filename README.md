# Gulp Starter

Gulp configured for the following workflow:

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
- Serve `/build` and watch for changes

## Quick Start

### Requirements

1. Node
  - Check if Node is installed: `node --version`
  - If you see a version number, such as `v11.6.0`, proceed to [Get Started](#get-started)
  - If Node isn't installed, [download][node-download] and install it, then proceed to [Get Started](#get-started)
2. Ruby
  - Check if Ruby is installed: `ruby --version`
  - If you see a version number, such as `ruby 2.2.3`, proceed to [Get Started](#get-started)
  - If Ruby isn't installed, [download][ruby-download] and install it, then proceed to [Get Started](#get-started)

### Get Started

Fork or clone this repo, install dev dependencies, and start:

```bash
git clone https://github.com/paulshryock/Gulp-Starter.git
cd Gulp-Starter
npm i
npm start
```

## Documentation

[Project documentation][docs] files are in the `_docs` directory.

## Contributing

If you'd like to contribute, please read the [Code of Conduct][code-of-conduct] and [Contributing instructions][contributing], then fork the repository and use a feature branch. Pull requests are welcome.

[node-download]: https://nodejs.org/en/download/
[ruby-download]: https://www.ruby-lang.org/en/downloads/
[docs]: _docs/
[code-of-conduct]: CODE_OF_CONDUCT.md
[contributing]: CONTRIBUTING.md