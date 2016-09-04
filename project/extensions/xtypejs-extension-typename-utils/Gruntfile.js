module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        "Gruntfile.js",
        "dist/xtypejs-extension-typename-utils.js",
        "test/**/*-spec.js"
      ],
      options: {
        jshintrc: 'test/.jshintrc',
        reporter: require('jshint-html-reporter'),
        reporterOutput: 'build/jslint-report.html'
      }
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js'
      },
      source_lib: {
        files: [
          { src: ['build/shared/test/test-util.js', 'build/shared/xtype.js', 'dist/xtypejs-extension-typename-utils.js', 'test/**/*-spec.js'] }
        ],
        reporters: ['progress', 'spec', 'coverage', 'html'],
        htmlReporter: {
          outputDir: 'build/test-reports-source-lib',
          focusOnFailures: true,
          namedFiles: true,
          pageTitle: 'xtypejs-extension-typename-utils - Source Lib Test Report',
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
          'dist/xtypejs-extension-typename-utils.js': ['coverage']
        }
      },
      minified_lib: {
        files: [
          { src: ['build/shared/test/test-util.js', 'build/shared/xtype.js', 'dist/**/*.min.js', 'test/**/*-spec.js'] }
        ],
        reporters: ['progress', 'spec', 'html'],
        htmlReporter: {
          outputDir: 'build/test-reports-minified-lib',
          focusOnFailures: true,
          namedFiles: true,
          pageTitle: 'xtypejs-extension-typename-utils - Minified Lib Test Report',
          urlFriendlyName: true,
          preserveDescribeNesting: true,
          foldAll: true
        }
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
          sourceMapName: 'dist/xtypejs-extension-typename-utils.js.map',
          preserveComments: 'some'
        },
        files: {
          'dist/xtypejs-extension-typename-utils.min.js': ['dist/xtypejs-extension-typename-utils.js']
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
            src: ['xtypejs-extension-typename-utils.js'],
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
      copy_shared_test_files: {
        command: [
          'rm -rf build',
          'mkdir build',
          'mkdir build/shared',
          'cp -rp ../../xtypejs/dist/xtype.js ./build/shared',
          'cp -rp --remove-destination ../../../shared/test/ ./build/shared'
        ].join('&&')
      },
      jasmine_node_test: {
        command: './node_modules/jasmine/bin/jasmine.js test/xtypejs-extension-typename-utils-spec.js JASMINE_CONFIG_PATH=test/jasmine.json'
      }
    },
    'string-replace': {
      version: {
        files: {
          'dist/': ['dist/xtypejs-extension-typename-utils.js']
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
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-string-replace');
  
  grunt.registerTask('test-node', ['shell:jasmine_node_test']);
  grunt.registerTask('test', ['jshint', 'shell:copy_shared_test_files', 'test-node', 'karma']);
  grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'uglify']);
  grunt.registerTask('default', ['build', 'test']);
};
