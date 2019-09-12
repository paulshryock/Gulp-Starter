module.exports = function (grunt) {
  var defaults = {
    html: './src/index.html',
    sass: './src/sass/style.scss',
    js: [
      './src/js/index.js',
      './src/js/more.js'
    ]
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Compile Sass files
    sass: {
      dist: {
        files: {
          'dist/css/style.css': defaults.sass
        }
      }
    },

    // ES5: Lint .js files with jshint
    jshint: {
      files: ['gruntfile.js', '<%= concat.dist.src %>'],
      option: {
        globals: {
          console: true,
          module: true
        }
      }
    },

    // ES6: Lint .js files with standard
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
    },

    // Run tasks whenever watched files change
    watch: {
      html: {
        files: [defaults.html]
      },
      sass: {
        files: [defaults.sass],
        tasks: ['sass']
      },
      js: {
        files: ['gruntfile.js', '<%= concat.dist.src %>'],
        tasks: ['standard', 'concat', 'uglify']
      },
      options: {
        livereload: {
          host: 'localhost',
          post: 8000,
          reload: true
        }
      }
    },

    // Serve files and live reload
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          livereload: true,
          keepalive: true
        }
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')

  grunt.registerTask('default', ['sass', 'standard', 'concat', 'uglify'])
}
