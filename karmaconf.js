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
			'app/bower_components/angular/angular.js',
			'app/bower_components/fabric/dist/fabric.min.js',
			'app/libs/alignment-guidelines.js',
			'app/bower_components/lodash/lodash.js',
			'app/bower_components/x2js/index.js',
			'app/bower_components/eventbus/index.js',
			'app/bower_components/uuid/index.js',
			'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'app/bower_components/ng-dialog/js/ngDialog.js',
			'app/bower_components/ngSafeApply/index.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js',
			'app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js',
			'app/bower_components/oclazyload/dist/ocLazyLoad.js',
			'app/bower_components/fingerprintjs2/dist/fingerprint2.min.js',
			'test/baseSpec.js',
			'test/data/ECMLcontent.fixture.js',
			'app/scripts/dev/localhost-ce.js',
			'app/libs/semantic.min.js',
			'app/libs/mousetrap.min.js',
			'app/libs/fontfaceobserver.min.js',
			'app/libs/telemetry-lib-v3.min.js',
			'app/libs/webfont.js',
			'app/scripts/framework/class.js',
			'app/scripts/framework/libs/ES5Polyfill.js',
			'app/scripts/framework/bootstrap-framework.js',
			'app/scripts/framework/repo/irepo.js',
			'app/scripts/framework/manager/resource-manager.js',
			'app/scripts/framework/repo/published-repo.js',
			'app/scripts/framework/manager/event-manager.js',
			'app/scripts/framework/manager/plugin-manager.js',
			'app/scripts/framework/manager/keyboard-manager.js',
			'app/scripts/framework/service/iservice.js',
			'app/scripts/framework/service/content-service.js',
			'app/scripts/framework/service/assessment-service.js',
			'app/scripts/framework/service/asset-service.js',
			'app/scripts/framework/service/meta-service.js',
			'app/scripts/framework/service/language-service.js',
			'app/scripts/framework/service/search-service.js',
			'app/scripts/framework/service/textbook-service.js',
			'app/scripts/framework/service/lock-service.js',
			'app/scripts/framework/service/user-service.js',
			'app/scripts/contenteditor/bootstrap-editor.js',
			'app/scripts/contenteditor/ce-config.js',
			'app/scripts/contenteditor/content-editor.js',
			'app/scripts/contenteditor/content-editor-api.js',
			'app/scripts/contenteditor/base-plugin.js',
			'app/scripts/contenteditor/manager/stage-manager.js',
			'app/scripts/contenteditor/manager/toolbar-manager.js',
			'app/scripts/contenteditor/manager/media-manager.js',
			'app/scripts/contenteditor/manager/sidebar-manager.js',
			'app/scripts/contenteditor/service/popup-service.js',
			'app/scripts/contenteditor/migration/1_migration-task.js',
			'app/scripts/contenteditor/migration/mediamigration-task.js',
			'app/scripts/contenteditor/migration/stageordermigration-task.js',
			'app/scripts/contenteditor/migration/basestagemigration-task.js',
			'app/scripts/contenteditor/migration/imagemigration-task.js',
			'app/scripts/contenteditor/migration/scribblemigration-task.js',
			'app/scripts/contenteditor/migration/readalongmigration-task.js',
			'app/scripts/contenteditor/migration/assessmentmigration-task.js',
			'app/scripts/contenteditor/migration/eventsmigration-task.js',
			'app/scripts/contenteditor/migration/settagmigration-task.js',
			'app/scripts/contenteditor/service/telemetry-service.js',
			'app/scripts/contenteditor/service/manifest-generator.js',
			'app/scripts/contenteditor/dispatcher/idispatcher.js',
			'app/scripts/contenteditor/dispatcher/console-dispatcher.js',
			'app/scripts/contenteditor/dispatcher/local-dispatcher.js',
			'app/scripts/contenteditor/dispatcher/piwik-dispatcher.js',
			'app/scripts/contenteditor/md5.js',
			'app/scripts/angular/controller/main.js',
			'app/scripts/angular/controller/popup-controller.js',
			'app/scripts/angular/directive/draggable-directive.js',
			'app/scripts/angular/directive/droppable-directive.js',
			'app/scripts/contenteditor/backward-compatibility.js',
			'test/**/*.js',
			// fixtures
			{ pattern: 'test/**/*.json', watched: true, served: true, included: false },
			{ pattern: 'plugins/org.ekstep.stage-1.0/**/*.json', watched: true, served: true, included: false },
			{ pattern: 'test/data/**/*.html', watched: true, served: true, included: false }
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
			'app/scripts/!(*framework)/!(migration|directive|controller|libs)/*.js': ['coverage'],
			'plugins/org.ekstep.stage-1.0/**/*.js': ['coverage']
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
				{ type: 'html', dir: 'coverage/' },
				{ type: 'text-summary' },
				{ type: 'cobertura' }
			]
		}
	})
}
