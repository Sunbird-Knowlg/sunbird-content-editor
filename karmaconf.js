// Karma configuration
// Generated on Wed Oct 26 2016 15:56:48 GMT+0530 (IST)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'jasmine-matchers'],


        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'dist/external.min.js',
            'test/baseSpec.js',
            'test/data/ECMLcontent.fixture.js',
            'dist/script.min.js',
            'app/scripts/dev/localhost-ce.js',
            'test/**/*.js',
            // fixtures
            { pattern: 'test/**/*.json', watched: true, served: true, included: false },
            { pattern: 'plugins/org.ekstep.stage-1.0/**/*.json', watched: true, served: true, included: false }
        ],

        plugins: [
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-coverage',
            'karma-phantomjs-launcher'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'dist/script.min.js': ['coverage'],
            'plugins/org.ekstep.stage-1.0/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


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
                { type: 'text-summary' },
                { type: 'cobertura' }
            ],
        }
    })
}
