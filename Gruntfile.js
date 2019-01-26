module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'app/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-html-reporter'),
        reporterOutput: 'build/jslint-report.html'
      }
    },
    uglify: {
      main: {
        files: {
          'site/app-bundle.min.js': [
            'vendor/js/**/*.js',
            'lib/xtype.js',
            'lib/xtypejs-extension-introspection.js',
            'lib/xtypejs-name-scheme-compact.js',
            'app/assets/**/*.js',
            'app/components/**/*.js',
            'app/screens/**/*.js'
          ]
        }
      }
    },
    concat: {
      json: {
        options: {
          banner: '{\n',
          separator: ',\n',
          footer: '\n}',
          process: function (src, filepath) {
            var screenName = filepath.split(/\//).slice(-2, -1)[0];
            return '"' + screenName + '" : ' + src.trim();
          }
        },
        files: {
          'site/app-bundle.screens.json': [ 'app/screens/**/*.json' ]
        }
      },
      css: {
        options: {
          process: function (src, filepath) {
            return '/* --- File: ' + filepath + '---*/ \n\n' + src.trim();
          }
        },
        files: {
          'site/app-bundle.min.css' : [
            'vendor/css/**/*.css',
            'app/**/*.css'
          ]
        }
      },
      html: {
        options: {
          banner: '<div>',
          footer: '</div>',
          process: function (src, filepath) {
            return '\n\n <!-- File: ' + filepath + ' --> \n\n' + src.trim();
          }
        },
        src: [
          'app/screens/**/*.html',
          'app/components/**/*.html'
        ],
        dest: 'site/app-bundle.screens.html'
      }
    },
    copy: {
      main: {
        files: [
          {
            cwd: 'app',
            src: ['**/*'],
            dest: 'site/',
            expand: true
          }
        ],
      },
    },
    clean: {
      build: ['./build', './site']
    },
    watch: {
      files: [
        'app/**/*',
        'lib/**/*',
        'vendor/**/*'
      ],
      tasks: ['build'],
      options: {
        event: ['all'],
        spawn: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['clean', 'jshint', 'uglify', 'concat', 'copy']);
};
