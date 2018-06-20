const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const expose = require('expose-loader');
const BowerResolvePlugin = require("bower-resolve-webpack-plugin");
var UglifyJS = require("uglify-es");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const runningMode = process.env.NODE_ENV || 'production';
const glob = require('glob-all');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');





const vendor = [
    // "./app/bower_components/jquery/dist/jquery.js",
    // './app/bower_components/semantic/dist/semantic.js',
    "./app/bower_components/async/dist/async.min.js",
    "./app/scripts/framework/libs/eventbus.min.js",
    "./app/libs/mousetrap.min.js",
    "./app/libs/telemetry-lib-v3.min.js",
    // "./app/libs/webfont.js",
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


const app = [
    "./app/scripts/framework/libs/ES5Polyfill.js",
    "./app/scripts/framework/class.js",
    "./app/scripts/framework/libs/mousetrap.min.js",
    "./app/scripts/framework/bootstrap-framework.js",
    "./app/scripts/framework/manager/resource-manager.js",
    "./app/scripts/framework/manager/event-manager.js",
    "./app/scripts/framework/manager/plugin-manager.js",
    "./app/scripts/framework/manager/keyboard-manager.js",
    "./app/scripts/framework/service/iservice.js",
    "./app/scripts/framework/service/content-service.js",
    "./app/scripts/framework/service/assessment-service.js",
    "./app/scripts/framework/service/asset-service.js",
    "./app/scripts/framework/service/meta-service.js",
    "./app/scripts/framework/service/language-service.js",
    "./app/scripts/framework/service/search-service.js",
    "./app/scripts/framework/service/dialcode-service.js",
    "./app/scripts/framework/repo/irepo.js",
    "./app/scripts/framework/repo/published-repo.js",
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
    "./app/scripts/contenteditor/dispatcher/piwik-dispatcher.js",
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

]
const app_css = [
    "./app/bower_components/font-awesome/css/font-awesome.css",
    "./app/bower_components/ng-dialog/css/ngDialog.min.css",
    "./app/bower_components/ng-dialog/css/ngDialog-theme-plain.min.css",
    "./app/bower_components/ng-dialog/css/ngDialog-theme-default.min.css",
    "./app/libs/ng-tags-input.css",
    './app/styles/semantic.min.css',
    './app/styles/MyFontsWebfontsKit.css',
    './app/styles/iconfont.css',
    './app/styles/icomoon/style.css',
    './app/styles/commonStyles.css',
    './app/styles/content-editor.css',
];
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            },
        }
    },
    entry: {
        'coreplugin': './app/scripts/coreplugins.js',
        'vendor': vendor,
        'app': app,
        'styles': app_css
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')

    },
    resolve: {
        alias: {
            'angular': path.resolve('./app/bower_components/angular/angular.js')
        }
    },
    module: {
        rules: [{
                test: require.resolve('async'),
                use: [{
                    loader: 'expose-loader',
                    options: 'async'
                }]

            }, {
                test: require.resolve('./app/libs/telemetry-lib-v3.min.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'EkTelemetry'
                }]
            }, {
                test: require.resolve('./app/bower_components/eventbus/index.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'EventBus'
                }]

            }, {
                test: require.resolve('./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'Fingerprint2'
                }]

            }, {
                test: require.resolve('./app/bower_components/uuid/index.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'UUID'
                }]

            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: require.resolve("./node_modules/ajv/lib/ajv.js"),
                use: "imports-loader?this=>window"
            },
            { test: /\.woff(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2" },
            { test: /\.ttf(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?.*)?$/, loader: "file-loader?prefix=fonts/&name=[path][name].[ext]" },
            { test: /\.svg(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml" },
            { test: /\.png(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/png+xml" },
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            cache: false,
            parallel: true,
            uglifyOptions: {
                compress: {
                    dead_code: true,
                    drop_console: true,
                    global_defs: {
                        DEBUG: true
                    },
                    passes: 3,
                },
                ecma: 6,
                mangle: true
            },
            sourceMap: false
        }),
        new webpack.ProvidePlugin({
            _: 'lodash',
            async: 'async'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        })
    ],
};