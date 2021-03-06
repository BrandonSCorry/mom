/* global module: true */
module.exports = function (grunt) {
   'use strict';
   var SAUCE_USERNAME;
   var SAUCE_ACCESS_KEY;
   setSauceLabsKeys();


   require('load-grunt-tasks')(grunt);
   require('time-grunt')(grunt);

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
         banner: [
                '/**',
                ' * <%= pkg.name %>',
                ' * <%= pkg.description %>',
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
                ' * @link <%= pkg.homepage %>',
                ' * @author <%= pkg.author %>',
                ' * @license MIT License, http://www.opensource.org/licenses/MIT',
                ' */'
            ].join('\n')
      },
      dirs: {
         dest: 'dist',
         dep: 'bower_components',
         source: 'src',
         test: 'test'
      },
      files: {
         src: [
               '<%= dirs.source %>/utils/settingsUtils.js',
               '<%= dirs.source %>/utils/arrayUtils.js',
               '<%= dirs.source %>/utils/logUtils.js',
               '<%= dirs.source %>/utils/objectUtils.js',
               '<%= dirs.source %>/utils/functionUtils.js',
               '<%= dirs.source %>/utils/stringUtils.js',
               '<%= dirs.source %>/utils/htmlElementUtils.js',
               '<%= dirs.source %>/moduleSystem/constants.js',
               '<%= dirs.source %>/moduleSystem/descriptorCreators.js',
               '<%= dirs.source %>/moduleSystem/settings.js',
               '<%= dirs.source %>/moduleSystem/modules/moduleLoader.js',
               '<%= dirs.source %>/moduleSystem/modules/moduleBuilder.js',
               '<%= dirs.source %>/moduleSystem/modules/loadedModulesContainer.js',
               '<%= dirs.source %>/moduleSystem/modules/modules.js',
               '<%= dirs.source %>/moduleSystem/modules/domEventListener.js',
               '<%= dirs.source %>/moduleSystem/parts/partBuilder.js',
               '<%= dirs.source %>/moduleSystem/parts/parts.js',
               '<%= dirs.source %>/eventBus/eventBus.js',
               '<%= dirs.source %>/moduleSystem/moduleSystem.js']
      },
      concat: {
         options: {
            banner: '<%= meta.banner %>'
         },
         dist: {
            src: [
               '<%= dirs.source %>/intro.js',
               '<%= files.src %>',
               '<%= dirs.source %>/outro.js'
            ],
            dest: '<%= dirs.dest %>/<%= pkg.name %>.<%= pkg.version %>.js'
         }
      },
      bower: {
         install: {},
         options: {
            copy: false
         }
      },
      uglify: {
         options: {
            banner: '<%= meta.banner %>'
         },
         dist: {
            src: ['<%= concat.dist.dest %>'],
            dest: '<%= dirs.dest %>/<%= pkg.name %>.<%= pkg.version %>.min.js'
         }
      },
      jshint: {
         files: ['<%= dirs.source %>/**/*.js'],
         options: {
            jshintrc: true
         }
      },
      jasmine: {
         options: {
            vendor: [
               '<%= dirs.dep %>/jquery/dist/jquery.js',
               '<%= dirs.dep %>/jasmine-jsreporter-real/jasmine-jsreporter.js',
               '<%= dirs.dep %>/jasmine-jquery/lib/jasmine-jquery.js'
            ],
            helpers: ['<%= dirs.test %>/helpers/**/*.js'],
            specs: [
               '<%= dirs.test %>/specs/**/*Spec.js'
            ]
         },
         test: {
            src: '<%= files.src %>',
            options: '<%= jasmine.options %>'
         },
         coverage: {
            src: '<%= jasmine.test.src %>',
            options: {
               vendor: [
                  '<%= dirs.dep %>/jquery/dist/jquery.js',
                  '<%= dirs.dep %>/jasmine-jsreporter-real/jasmine-jsreporter.js',
                  '<%= dirs.dep %>/jasmine-jquery/lib/jasmine-jquery.js'
               ],
               helpers: ['<%= dirs.test %>/helpers/**/*.js'],
               specs: [
                  '<%= dirs.test %>/specs/**/*Spec.js'
               ],
               template : require('grunt-template-jasmine-istanbul'),
			      templateOptions: {
                  coverage: 'reports/coverage.json',
                  report: [
						   {
							   type: 'html',
							   options: {
								   dir: 'reports/html'
							   }
						   },
						   {
							   type: 'lcov',
							   options: {
								   dir: 'reports/lcov'
							   }
						   },
					   ]
				   }
            }
         },
         prod: {
            src: '<%= concat.dist.dest %>',
            options: '<%= jasmine.options %>'
         },
         prodMin: {
            src: '<%= uglify.dist.dest %>',
            options: '<%= jasmine.options %>'
         }
      },
      coveralls: {
         options: {
            force: true
         },
         run: {
            src: 'reports/lcov/lcov.info'
         }
      },
      copy: {
         release: {
            src: '<%= concat.dist.dest %>',
            dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
         },
         releaseMin: {
            src: '<%= uglify.dist.dest %>',
            dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
         }
      },
      'saucelabs-jasmine': {
         all: {
            options: {
               username: SAUCE_USERNAME,
               key: SAUCE_ACCESS_KEY,
               urls: ['http://127.0.0.1:<%= connect.server.options.port %>/_SpecRunner.html'],
               build: (process.env.TRAVIS_BUILD_NUMBER) ? process.env.TRAVIS_BUILD_NUMBER : undefined,
               testname: (process.env.TRAVIS_BRANCH) ? process.env.TRAVIS_BRANCH : 'manual test',
               browsers: [{
                  browserName: 'chrome'
               }, {
                  browserName: 'firefox',
                  platform: 'linux'
               }, {
                  browserName: 'safari',
                  version: '8'
               }, {
                  browserName: 'safari',
                  version: '7'
               }, {
                  browserName: 'safari',
                  version: '6'
               }, {
                  browserName: 'safari',
                  version: '5'
               }, {
                  browserName: 'internet explorer',
                  version: '11'
               }, {
                  browserName: 'internet explorer',
                  version: '10'
               }, {
                  browserName: 'internet explorer',
                  version: '9'
               }, {
                  browserName: 'internet explorer',
                  version: '8'
               }]
            }
         }
      },
      connect: {
         server: {
            options: {
               port: '8080',
               base: '.'
            }
         }
      }

   });

   // Default task.
   grunt.registerTask('default', ['build']);


   // Build task.
   grunt.registerTask('build', ['bower', 'jshint', 'test', 'concat', 'uglify', 'testProd', 'copy']);

   var testJobs = ['jasmine:coverage'];
   if (SAUCE_ACCESS_KEY && SAUCE_USERNAME) {
      testJobs.push('sauce');
   }

   grunt.registerTask('test', testJobs);


   grunt.registerTask('testProd', ['jasmine:prod', 'jasmine:prodMin']);

   grunt.registerTask('sauce', ['createSpecRunner', 'connect', 'saucelabs-jasmine']);

   grunt.registerTask('createSpecRunner', [
      'jasmine:test:build'
   ]);

   function setSauceLabsKeys() {
      if(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
         SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
         SAUCE_USERNAME = process.env.SAUCE_USERNAME;
      } else if(process.env.TRAVIS_BRANCH === 'master' &&
                process.env.SAUCE_USERNAME_MASTER && process.env.SAUCE_ACCESS_KEY_MASTER) {
         SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY_MASTER;
         SAUCE_USERNAME = process.env.SAUCE_USERNAME_MASTER;
      } else if(process.env.SAUCE_USERNAME_DEVELOP && process.env.SAUCE_ACCESS_KEY_DEVELOP) {
         SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY_DEVELOP;
         SAUCE_USERNAME = process.env.SAUCE_USERNAME_DEVELOP;
      }

   }
};
