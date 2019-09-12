# Grunt Starter documentation

## Grunt tasks

### Default

Compile Sass files, Lint, Concatenate, and Minify JavaScript files, and watch for changes, serve, and reload files:

```bash
grunt
```

### Individual tasks

- Compile Sass files: `grunt sass`
- Lint JavaScript files with JShint (ES5): `grunt jshint`
- Lint JavaScript files with Standard (ES6): `grunt standard`
- Concatenate JavaScript files: `grunt concat`
- Minify JavaScript files: `grunt uglify`
- Run tasks whenever watched files change: `grunt watch`
- Serve files and live reload: `grunt connect`

## npm scripts

- `npm start` runs `grunt`
- `npm watch` runs `grunt watch`
- `npm serve` runs `grunt connect`
