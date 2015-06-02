module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        "Gruntfile.js",
        "dist/xtype.js",
        "test/**/*-spec.js"
      ],
      options: {
        jshintrc: 'test/config/.jshintrc',
        reporter: require('jshint-html-reporter'),
        reporterOutput: 'build/jslint-report.html'
      }
    },
    karma: {
      options: {
        configFile: 'test/config/karma.conf.js'
      },
      source_lib: {
        files: [
          { src: ['dist/xtype.js', 'test/**/*-spec.js'] }
        ],
        reporters: ['progress', 'spec', 'coverage', 'html'],
        htmlReporter: {
          outputDir: 'build/test-reports-source-lib',
          focusOnFailures: true,
          namedFiles: true,
          pageTitle: 'xtypejs - Source Lib Test Report',
          urlFriendlyName: true,
          preserveDescribeNesting: true,
          foldAll: true
        },
        coverageReporter: {
          type: 'html',
          dir: 'build/coverage-reports',
          subdir: function(browser) {
            return browser.toLowerCase().split(/[ /-]/)[0] + '-coverage-report';
          }
        },
        preprocessors: {
          'dist/xtype.js': ['coverage']
        }
      },
      minified_lib: {
        files: [
          { src: ['dist/**/*.min.js', 'test/**/*-spec.js'] }
        ],
        reporters: ['progress', 'spec', 'html'],
        htmlReporter: {
          outputDir: 'build/test-reports-minified-lib',
          focusOnFailures: true,
          namedFiles: true,
          pageTitle: 'xtypejs - Minified Lib Test Report',
          urlFriendlyName: true,
          preserveDescribeNesting: true,
          foldAll: true
        }
      }
    },
    uglify: {
      options: {
        compress: {
          global_defs: {
            "$XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$": true
          },
          dead_code: true
        }
      },
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/xtype.js.map',
          preserveComments: 'some'
        },
        files: {
          'dist/xtype.min.js': ['dist/xtype.js']
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
            src: ['xtype.js'],
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
      jasmine_node_test_source_lib: {
        command: './node_modules/jasmine/bin/jasmine.js test/typejs-spec-node-source.js JASMINE_CONFIG_PATH=test/config/jasmine.json'
      },
      jasmine_node_test_minified_lib: {
        command: './node_modules/jasmine/bin/jasmine.js test/typejs-spec-node-minified.js JASMINE_CONFIG_PATH=test/config/jasmine.json'
      }
    },
    'string-replace': {
      version: {
        files: {
          'dist/': ['dist/xtype.js']
        },
        options: {
          replacements: [
            {
              pattern: /{{\s*VERSION\s*}}/g,
              replacement: '<%= pkg.version %>'
            }
          ]
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-string-replace');
  
  grunt.registerTask('test-node', ['shell:jasmine_node_test_source_lib', 'shell:jasmine_node_test_minified_lib']);
  grunt.registerTask('test', ['jshint', 'test-node', 'karma']);
  grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'uglify']);
  grunt.registerTask('default', ['build', 'test']);
};
