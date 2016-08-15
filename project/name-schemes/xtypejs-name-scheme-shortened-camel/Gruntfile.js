module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        "Gruntfile.js",
        "dist/xtypejs-name-scheme-shortened-camel.js",
        "test/**/*-spec.js"
      ],
      options: {
        jshintrc: 'test/.jshintrc',
        reporter: require('jshint-html-reporter'),
        reporterOutput: 'build/jslint-report.html'
      }
    },
    uglify: {
      options: {
        compress: {
          global_defs: {},
          dead_code: true
        }
      },
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/xtypejs-name-scheme-shortened-camel.js.map',
          preserveComments: 'some'
        },
        files: {
          'dist/xtypejs-name-scheme-shortened-camel.min.js': ['dist/xtypejs-name-scheme-shortened-camel.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['LICENSE'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            src: ['xtypejs-name-scheme-shortened-camel.js'],
            flatten: true,
            dest: 'dist/',
            filter: 'isFile'
          }
        ],
      },
    },
    clean: {
        build: ['build', 'dist']
    },
    shell: {
      jasmine_node_test: {
        command: './node_modules/jasmine/bin/jasmine.js test/xtypejs-name-scheme-shortened-camel-spec.js JASMINE_CONFIG_PATH=test/jasmine.json'
      }
    },
    'string-replace': {
      version: {
        files: {
          'dist/': ['dist/xtypejs-name-scheme-shortened-camel.js']
        },
        options: {
          replacements: [
            {
              pattern: /{{\s*LIB_VERSION\s*}}/g,
              replacement: '<%= pkg.version %>'
            }
          ]
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-string-replace');
  
  grunt.registerTask('test-node', ['shell:jasmine_node_test']);
  grunt.registerTask('test', ['jshint', 'test-node']);
  grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'uglify']);
  grunt.registerTask('default', ['build', 'test']);
};
