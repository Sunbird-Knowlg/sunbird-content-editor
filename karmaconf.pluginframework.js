// Karma configuration
// Generated on Wed Oct 26 2016 15:56:48 GMT+0530 (IST)

module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'jasmine-matchers'],

		// list of files / patterns to load in the browser
		files: [
			// bower:js
			'app/bower_components/jquery/dist/jquery.js',
			'app/bower_components/async/dist/async.min.js',
			'app/bower_components/lodash/dist/lodash.min.js',
			'app/bower_components/fingerprintjs2/dist/fingerprint2.min.js',
			'app/scripts/framework/libs/ES5Polyfill.js',
			'app/scripts/framework/libs/eventbus.min.js',
			'app/scripts/framework/libs/mousetrap.min.js',
			'app/scripts/framework/class.js',
			'app/scripts/framework/bootstrap-framework.js',
			'app/scripts/framework/manager/resource-manager.js',
			'app/scripts/framework/manager/event-manager.js',
			'app/scripts/framework/manager/plugin-manager.js',
			'app/scripts/framework/manager/keyboard-manager.js',
			'app/scripts/framework/service/iservice.js',
			'app/scripts/framework/service/lock-service.js',
			'app/scripts/framework/service/dialcode-service.js',
			'app/scripts/framework/service/textbook-service.js',
			'app/scripts/framework/service/content-service.js',
			'app/scripts/framework/service/assessment-service.js',
			'app/scripts/framework/service/asset-service.js',
			'app/scripts/framework/service/meta-service.js',
			'app/scripts/framework/service/language-service.js',
			'app/scripts/framework/service/search-service.js',
			'app/scripts/framework/repo/irepo.js',
			'app/scripts/framework/repo/published-repo.js',
			'test_framework/data/ECMLcontent.fixture.js',
			'test_framework/base-spec.js',
			'test_framework/dependency-scripts/**/*.js',
			'test_framework/data/repos/*.js',
			'test_framework/**/*.spec.js',
			'app/scripts/framework/service/user-service.js',
			// fixtures
			{ pattern: 'test_framework/data/**/*.json', watched: true, served: true, included: false },
			{ pattern: 'test_framework/data/**/*.js', watched: true, served: true, included: false },
			{ pattern: 'test_framework/data/**/*.css', watched: true, served: true, included: false }
		],

		plugins: [
			'karma-jasmine',
			'karma-jasmine-matchers',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-coverage-istanbul-reporter',
			'karma-mocha-reporter'
		],

		// list of files to exclude
		exclude: [],

		client: {
			captureConsole: false
		},

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'app/scripts/framework/!(libs)/**/*.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		// reporters: ['dots', 'coverage'],

		// reporters configuration
		reporters: ['mocha', 'coverage'],

		// reporter options
		mochaReporter: {
			colors: {
				success: 'green',
				info: 'bgYellow',
				warning: 'cyan',
				error: 'bgRed'
			},
			symbols: {
				success: '✔',
				info: '#',
				warning: '!',
				error: 'x'
			}
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			'ChromeHeadless'
		],
		browserNoActivityTimeout: 300000,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,
		coverageReporter: {
			reporters: [
				{ type: 'html', dir: 'coverage_framework/' },
				{ type: 'text-summary' },
				{ type: 'cobertura' }
			]
		}
	})
}
