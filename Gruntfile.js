'use strict';

module.exports = function(grunt) {

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
            dest: 'dist'
        },
        bower: {
            dev: {
                dest: '<%= dirs.dest %>/dependencies'
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
            }
        },
        bowerInstall: {
            install: {}
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['src/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        jasmine: {
            coverage: {
                src: [
                    'src/moduleLoader/moduleSystem.js',
                    'src/eventBus/eventBus.js',
                    'src/eventBus/Events.js',
                ],
                options: {
                    vendor: [
                        '<%= dirs.dest %>/dependencies/jquery.js',
                        '<%= dirs.dest %>/dependencies/jasmine-jquery.js',
                    ],
                    specs: [
                        'spec/**/*Spec.js'
                    ],
                    junit: {
                        path: 'report/jasmineTestResults',
                        consolidate: false
                    }

                }
            }
        }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.loadNpmTasks('grunt-bower-task');

    grunt.renameTask("bower", "bowerInstall");

    grunt.loadNpmTasks('grunt-bower');

    // Default task.
    grunt.registerTask('default', ['build']);

    // Build task.
    grunt.registerTask('build', ['bowerInstall', 'bower', 'concat', 'uglify']);

    grunt.registerTask('test', ['jasmine']);

    grunt.registerTask('createSpecRunner', [
        'jasmine:coverage:build'
    ]);
};