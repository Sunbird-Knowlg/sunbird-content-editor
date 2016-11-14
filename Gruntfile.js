// Generated on 2015-12-14 using generator-angular 0.14.0
'use strict';

module.exports = function(grunt) {

    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['app/scripts/{,*/}*.js', 'app/bower_components/*/index.js', 'plugins/**/{,*/}*.js', 'plugins/**/*.json'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            styles: {
                files: ['app//{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'app/{,*/}*.html',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            css: {
                files: 'app/styles/**/*.scss',
                tasks: ['compass']
            },
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static(appConfig.app),
                            connect().use(
                                '/bower_components',
                                connect.static('./app/bower_components')
                            ),
                            connect().use(
                                '/libs',
                                connect.static('./app/libs')
                            ),
                            connect().use(
                                '/app/styles',
                                connect.static('./app/styles')
                            ),
                            connect().use(
                                '/plugins',
                                connect.static('./plugins')
                            )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        aws_s3: {
            options: {
                accessKeyId: '', // Use the variables
                secretAccessKey: '', // You can also use env variables
                region: 'ap-southeast-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            main: {
                options: {
                    bucket: 'ekstep-public',
                    differential: true, // Only uploads the files that have changed
                    gzipRename: 'ext' // when uploading a gz file, keep the original extension
                },
                files: [
                    { dest: 'preview/dev/', cwd: 'app/preview/', action: 'download' }
                ]
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'ansible/content-editor.zip'
                },
                files: [
                    { src: ['app/**', 'plugins/**', 'server/**', '*', '!node_modules', '!ansible'] }
                ]
            }
        },

        rename: {
            main: {
                files: [
                    { src: ['app'], dest: 'content-editor' },
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-rename');

    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        console.log("from serve", target);
        if (target === 'staging' || target === "production") {
            return grunt.task.run([target]);
        }

        return grunt.task.run(['staging']);
    });

    grunt.registerTask('staging', [
        // Add further deploy related tasks here
        'connect:livereload',
        'watch'
    ]);

};
