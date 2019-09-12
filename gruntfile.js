module.exports = function (grunt) {
  var defaults = {
    js: [
      './src/js/index.js',
      './src/js/more.js'
    ]
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Lint .js files with jshint
    // jshint: {
    //   files: ['gruntfile.js', '<%= concat.dist.src %>'],
    //   option: {
    //     globals: {
    //       console: true,
    //       module: true
    //     }
    //   }
    // },

    // Lint .js files with standard
    standard: {
      options: {
        fix: true
      },
      app: {
        src: [
          '{,src/js/}*.js'
        ]
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

  })

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  // grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['lint', 'concatenate', 'minify'])
  // grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('lint', ['standard'])
  grunt.registerTask('concatenate', ['concat'])
  grunt.registerTask('minify', ['uglify'])
}
