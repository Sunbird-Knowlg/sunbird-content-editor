// Karma configuration
// Generated on Wed Oct 26 2016 15:56:48 GMT+0530 (IST)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'node_modules/jquery/dist/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.js',
            'app/bower_components/fabric/dist/fabric.min.js',
            'app/bower_components/x2js/index.js',
            'app/bower_components/eventbus/index.js',
            'app/bower_components/font-awesome/css/font-awesome.min.css',
            'app/bower_components/async/dist/async.min.js',
            'app/bower_components/lodash/dist/lodash.min.js',
            'app/bower_components/uuid/index.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            // endbower
            'app/scripts/main/class.js',
            'app/scripts/main/ekstep-editor.js',
            'app/scripts/main/base-plugin.js',
            'app/scripts/main/ekstep-editor-api.js',
            'app/scripts/manager/event-manager.js',
            'app/scripts/manager/plugin-manager.js',
            'app/scripts/manager/stage-manager.js',
            'app/scripts/manager/toolbar-manager.js',
            'app/scripts/main/ekstep-editor-api.js',
            'app/scripts/service/iservice.js',
            'app/scripts/service/content-service.js',
            'app/scripts/service/base-http-service.js',
            'app/scripts/service/base-configURL-service.js',
            'app/scripts/main/preview-content.js',
            'app/scripts/angular/controller/main.js',
            'app/scripts/service/iservice.js',
            'app/scripts/service/content-service.js',
            'app/test/**/*.js',
            // fixtures
            {pattern: 'app/test/**/*.json', watched: true, served: true, included: false}
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            "PhantomJS"
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' }
            ],
        }
    })
}
