module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: [
        'public/js/**/*.js'
      ]
    },
    sass: {
      expanded: {
        options: { outputStyle: 'expanded' },
        files: { 'css/style.css': 'public/scss/style.scss' }
      },
      compressed: {
        options: { outputStyle: 'compressed' },
        files: { 'css/style.min.css': 'public/scss/style.scss' }
      }
    },
    concat: {
      dist: {
        src: [
          'public/js/app.js',
          'public/js/**/*.js'
        ],
        dest: 'js/app.js'
      }
    },
    uglify: {
      'js/app.min.js': 'js/app.js'
    },
    watch: {
      configFiles: {
        files: ['Gruntfile.js', 'package.json'],
        options: { reload: true }
      },
      scss: {
        files: ['public/scss/**/*.scss'],
        tasks: ['sass'],
        options: { livereload: true }
      },
      js: {
        files: ['public/js/**/*.js'],
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

  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify', 'watch']);
};
