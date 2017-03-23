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
            "app/bower_components/jquery/dist/jquery.js",
            "app/bower_components/async/dist/async.min.js",
            "app/bower_components/angular/angular.js",
            "app/bower_components/fabric/dist/fabric.min.js",
            "app/bower_components/lodash/lodash.js",
            "app/bower_components/x2js/index.js",
            "app/bower_components/eventbus/index.js",
            "app/bower_components/uuid/index.js",
            "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
            "app/bower_components/ng-dialog/js/ngDialog.js",
            "app/bower_components/ngSafeApply/index.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js",
            "app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js",
            "app/bower_components/oclazyload/dist/ocLazyLoad.js",
            "test/baseSpec.js",
            "app/scripts/dev/localhost-ce.js",
            "app/libs/semantic.min.js",
            "app/scripts/main/class.js",
            "app/scripts/main/ekstep-editor.js",
            "app/scripts/main/ekstep-config.js",
            "app/scripts/main/base-plugin.js",
            "app/scripts/manager/resource-manager.js",
            "app/scripts/manager/event-manager.js",
            "app/scripts/manager/plugin-manager.js",
            "app/scripts/manager/stage-manager.js",
            "app/scripts/manager/toolbar-manager.js",
            "app/scripts/manager/media-manager.js",
            "app/scripts/manager/keyboard-manager.js",
            "app/scripts/repo/irepo.js",
            "app/scripts/repo/published-repo.js",
            "app/scripts/repo/draft-repo.js",
            "app/scripts/repo/host-repo.js",
            "app/scripts/main/ekstep-editor-api.js",
            "app/scripts/migration/1_migration-task.js",
            "app/scripts/migration/mediamigration-task.js",
            "app/scripts/migration/stageordermigration-task.js",
            "app/scripts/migration/basestagemigration-task.js",
            "app/scripts/migration/imagemigration-task.js",
            "app/scripts/migration/scribblemigration-task.js",
            "app/scripts/migration/readalongmigration-task.js",
            "app/scripts/migration/assessmentmigration-task.js",
            "app/scripts/migration/eventsmigration-task.js",
            "app/scripts/migration/settagmigration-task.js",
            "app/scripts/dispatcher/idispatcher.js",
            "app/scripts/dispatcher/console-dispatcher.js",
            "app/scripts/dispatcher/local-dispatcher.js",
            "app/scripts/dispatcher/piwik-dispatcher.js",
            "app/scripts/angular/controller/main.js",
            "app/scripts/angular/controller/popup-controller.js",
            "app/scripts/angular/directive/draggable-directive.js",
            "app/scripts/angular/directive/droppable-directive.js",
            "app/scripts/angular/service/api-timestamp-service.js",
            "app/scripts/service/iservice.js",
            "app/scripts/service/content-service.js",
            "app/scripts/service/popup-service.js",
            "app/scripts/service/telemetry-service.js",
            "app/scripts/service/assessment-service.js",
            "app/scripts/service/asset-service.js",
            "app/scripts/service/meta-service.js",
            "app/scripts/service/language-service.js",
            "app/scripts/service/search-service.js",
            'test/**/*.js',
            // fixtures
            { pattern: 'test/**/*.json', watched: true, served: true, included: false },
            { pattern: 'plugins/org.ekstep.stage-1.0/**/*.json', watched: true, served: true, included: false }
        ],

        plugins: [
            'karma-jasmine',
            'karma-jasmine-matchers'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/scripts/**/!(migration|directive|controller)/!(api-timestamp-service)*.js': ['coverage'],
            'plugins/org.ekstep.stage-1.0/**/*.js': ['coverage']
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
