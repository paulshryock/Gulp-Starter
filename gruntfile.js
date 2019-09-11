module.exports = function(grunt) {

  var defaults = {
    js: [
      './src/js/index.js',
      './src/js/more.js'
    ]
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Lint .js files with jshint
    jshint: {
      files: ['gruntfile.js', '<%= concat.dist.src %>'],
      option: {
        globals: {
          console: true,
          module: true
        }
      }
    },

    // Concatenate .js files
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [defaults.js],
        dest: 'dist/js/bundle.js'
      }
    },

    // Minify .js bundle with uglify
    uglify: {
      dist: {
        files: {
          './dist/js/bundle.min.js': '<%= concat.dist.dest %>'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};