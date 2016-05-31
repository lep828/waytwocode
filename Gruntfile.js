module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: [
        'js/**/*.js',
        '!js/_bower.js'
      ]
    },
    bower_concat: {
      all: {
        dest: {
          'js': 'js/_bower.js',
          'css': 'scss/_bower.scss'
        },
        mainFiles: {
          codemirror: [
            'lib/codemirror.js',
            'lib/codemirror.css',
            'theme/monokai.css'
          ]
        },
        dependencies: {
          jstree: ["jquery"]
        }
      }
    },
    sass: {
      expanded: {
        options: { outputStyle: 'expanded' },
        files: { 'public/css/style.css': 'scss/build.scss' }
      },
      compressed: {
        options: { outputStyle: 'compressed' },
        files: { 'public/css/style.min.css': 'scss/build.scss' }
      },
      dist: {
        files: [{
          cwd: 'styles',
          expand: true,
          src: ['scss/*.scss'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },
    concat: {
      jsDist: {
        src: [
          'js/_bower.js',
          'bower_components/codemirror/mode/ruby/ruby.js',
          'bower_components/codemirror/mode/javascript/javascript.js',
          'bower_components/codemirror/mode/css/css.js',
          'bower_components/codemirror/mode/markdown/markdown.js',
          'bower_components/codemirror/mode/php/php.js',
          'bower_components/codemirror/mode/sass/sass.js',
          'bower_components/codemirror/mode/scss/scss.js',
          'bower_components/codemirror/mode/htmlembedded/htmlembedded.js',
          'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
          'js/angular/app.js',
          'js/**/*.js'
        ],
        dest: 'public/js/app.js'
      },
      scssDist: {
        src: [
          'scss/_bower.scss',
          'scss/style.scss'
        ],
        dest: 'scss/build.scss'
      }
    },
    uglify: {
      'public/js/app.min.js': 'public/js/app.js'
    },
    watch: {
      configFiles: {
        files: ['Gruntfile.js', 'package.json'],
        options: { reload: true }
      },
      scss: {
        files: ['scss/**/*.scss'],
        tasks: ['sass'],
        options: { livereload: true }
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: { livereload: true }
      },
      index: {
        files: ['index.html'],
        options: { livereload: true }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint', 'bower_concat', 'concat', 'sass', 'uglify', 'watch']);
};
