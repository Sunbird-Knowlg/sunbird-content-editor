const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


const bower_components = [
    "./app/bower_components/jquery/dist/jquery.js",
    "./app/bower_components/async/dist/async.min.js",
    "./app/libs/semantic.min.js",
    "./app/libs/mousetrap.min.js",
    "./app/libs/telemetry-lib-v3.min.js",
    "./app/libs/webfont.js",
    "./app/bower_components/angular/angular.js",
    "./app/bower_components/fabric/dist/fabric.min.js",
    "./app/bower_components/lodash/lodash.js",
    "./app/bower_components/x2js/index.js",
    "./app/bower_components/eventbus/index.js",
    "./app/bower_components/uuid/index.js",
    "./app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "./app/bower_components/ng-dialog/js/ngDialog.js",
    "./app/bower_components/ngSafeApply/index.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js",
    "./app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js",
    "./app/bower_components/oclazyload/dist/ocLazyLoad.js",
    "./app/scripts/contenteditor/md5.js",
    "./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js",
    "./app/libs/ng-tags-input.js"
];

const contentEditorApp = [
    "./app/scripts/angular/controller/main.js",
    "./app/scripts/angular/controller/popup-controller.js",
    "./app/scripts/angular/directive/draggable-directive.js",
    "./app/scripts/angular/directive/droppable-directive.js",
    "./app/scripts/angular/directive/template-compiler-directive.js",
    "./app/scripts/contenteditor/migration/1_migration-task.js",
    "./app/scripts/contenteditor/migration/mediamigration-task.js",
    "./app/scripts/contenteditor/migration/stageordermigration-task.js",
    "./app/scripts/contenteditor/migration/basestagemigration-task.js",
    "./app/scripts/contenteditor/migration/imagemigration-task.js",
    "./app/scripts/contenteditor/migration/scribblemigration-task.js",
    "./app/scripts/contenteditor/migration/readalongmigration-task.js",
    "./app/scripts/contenteditor/migration/assessmentmigration-task.js",
    "./app/scripts/contenteditor/migration/eventsmigration-task.js",
    "./app/scripts/contenteditor/migration/settagmigration-task.js",
    "./app/scripts/contenteditor/manager/stage-manager.js"
];
const editorFramework = [
    "./app/libs/fontfaceobserver.min.js",
    "./app/libs/telemetry-lib-v3.min.js",
    "./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js",
    "./app/scripts/contenteditor/bootstrap-editor.js",
    "./app/scripts/contenteditor/ce-config.js",
    "./app/scripts/contenteditor/content-editor.js",
    "./app/scripts/contenteditor/content-editor-api.js",
    "./app/scripts/contenteditor/base-plugin.js",
    "./app/scripts/contenteditor/manager/toolbar-manager.js",
    "./app/scripts/contenteditor/manager/media-manager.js",
    "./app/scripts/contenteditor/manager/sidebar-manager.js",
    "./app/scripts/contenteditor/manager/header-manager.js",
    "./app/scripts/contenteditor/service/popup-service.js",
    "./app/scripts/contenteditor/service/manifest-generator.js",
    "./app/scripts/contenteditor/service/telemetry-service.js",
    "./app/scripts/contenteditor/dispatcher/idispatcher.js",
    "./app/scripts/contenteditor/dispatcher/console-dispatcher.js",
    "./app/scripts/contenteditor/dispatcher/local-dispatcher.js",
    "./app/scripts/contenteditor/dispatcher/piwik-dispatcher.js"
]

const pluginFramework = [
    "./app/scripts/framework/libs/ES5Polyfill.js",
    "./app/scripts/framework/class.js",
    "./app/scripts/framework/libs/eventbus.min.js",
    "./app/scripts/framework/libs/mousetrap.min.js",
    "./app/scripts/framework/bootstrap-framework.js",
    "./app/scripts/framework/manager/resource-manager.js",
    "./app/scripts/framework/manager/event-manager.js",
    "./app/scripts/framework/manager/plugin-manager.js",
    "./app/scripts/framework/manager/keyboard-manager.js",
    "./app/scripts/framework/service/iservice.js",
    "./app/scripts/framework/service/content-service.js",
    //"./app/scripts/framework/service/telemetry-service.js",
    "./app/scripts/framework/service/assessment-service.js",
    "./app/scripts/framework/service/asset-service.js",
    "./app/scripts/framework/service/meta-service.js",
    "./app/scripts/framework/service/language-service.js",
    "./app/scripts/framework/service/search-service.js",
    "./app/scripts/framework/service/dialcode-service.js",
    "./app/scripts/framework/repo/irepo.js",
    "./app/scripts/framework/repo/published-repo.js",
    //"./app/scripts/framework/repo/draft-repo.js",
    // "./app/scripts/framework/repo/host-repo.js"
];

module.exports = {
    entry: pluginFramework,
    output: {
        filename: 'pluginframework.min.js',
        path: path.resolve(__dirname, 'dist')

    },
    mode: "development",
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
            }
        }),
        new HtmlWebpackPlugin({
            inlineSource: '.(js|css)$' // embed all javascript and css inline
        }),
        new HtmlWebpackInlineSourcePlugin()
    ]
};