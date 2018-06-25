//TODO: Remove the unused constants
const ENVIRONMENT = process.env.NODE_ENV || 'dev';
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const expose = require('expose-loader');
const BowerResolvePlugin = require("bower-resolve-webpack-plugin");
const UglifyJS = require("uglify-es");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob-all');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FontminPlugin = require('fontmin-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');

/** 
 *  Core plugins file path, Refer minified file which is already created form the gulp.
 */
const CORE_PLUGINS = './app/scripts/coreplugins.js';

/**
 * External files 
 */
const VENDOR = [
    "./app/bower_components/jquery/dist/jquery.js", // Need to check both semantic and jquery
    './app/bower_components/semantic/dist/semantic.js',
    "./app/bower_components/async/dist/async.min.js",
    "./app/scripts/framework/libs/eventbus.min.js",
    "./app/libs/mousetrap.min.js",
    "./app/libs/telemetry-lib-v3.min.js",
    "./app/libs/webfont.js",
    "./app/bower_components/angular/angular.js",
    "./app/bower_components/fabric/dist/fabric.min.js",
    "./app/bower_components/lodash/lodash.js",
    "./app/bower_components/x2js/index.js",
    "./app/bower_components/uuid/index.js",
    "./app/bower_components/ng-dialog/js/ngDialog.js",
    "./app/bower_components/ngSafeApply/index.js",
    "./app/bower_components/oclazyload/dist/ocLazyLoad.min.js",
    "./app/scripts/contenteditor/md5.js",
    "./app/libs/ng-tags-input.js"
];
// Should have Plugin framework files

var PLUGIN_FRAMEWORK = [
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
    "./app/scripts/framework/service/assessment-service.js",
    "./app/scripts/framework/service/asset-service.js",
    "./app/scripts/framework/service/meta-service.js",
    "./app/scripts/framework/service/language-service.js",
    "./app/scripts/framework/service/search-service.js",
    "./app/scripts/framework/service/dialcode-service.js",
    "./app/scripts/framework/repo/irepo.js",
    "./app/scripts/framework/repo/published-repo.js",
];
var EDITOR_FRAMEWORK = [
    "./app/libs/fontfaceobserver.min.js",
    "./app/libs/telemetry-lib-v3.min.js",
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
var EDITOR_APP = [
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
const APP_STYLE = [
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
    './app/styles/noto.css'
];

// removing the duplicate files
const APP_SCRIPT = [...new Set([...VENDOR, ...PLUGIN_FRAMEWORK, ...EDITOR_FRAMEWORK, ...EDITOR_APP])];

let pathsToClean = [
'dist'
]

module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                styles: {
                    name: 'style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: false
                }
            },
        }
    },

    entry: {
        'coreplugins': CORE_PLUGINS,
        'plugin-framework': PLUGIN_FRAMEWORK,
        'script': APP_SCRIPT,
        'style': APP_STYLE
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist')

    },
    resolve: {
        alias: {
            'angular': path.resolve('./app/bower_components/angular/angular.js'),
            'Fingerprint2': path.resolve('./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js'),
        }
    },
    module: {
        rules: [{
                test: require.resolve('./app/libs/telemetry-lib-v3.min.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'EkTelemetry'
                }]
            },
            {
                test: require.resolve('./app/bower_components/async/dist/async.min.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'async'
                }]
            },
            {
                test: require.resolve('./app/scripts/framework/libs/eventbus.min.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'EventBus'
                }]
            },
            {
                test: require.resolve('./node_modules/webfontloader/webfontloader.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'WebFont'
                }]
            },
            {
                test: require.resolve('./app/bower_components/uuid/index.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'UUID'
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            minimize: true,
                            "preset": "advanced",
                            discardComments: {
                                removeAll: true
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            minimize: true,
                            "preset": "advanced",
                            discardComments: {
                                removeAll: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'styles/fonts/',
                        limit: 10000,
                        fallback: 'responsive-loader'
                    }
                }]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: true,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ],
            },

        ]
    },
    plugins: [
        new CleanWebpackPlugin(pathsToClean),
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
                    passes: 1,
                },
                ecma: 6,
                mangle: true
            },
            sourceMap: false
        }),
        // copy the index.html and templated to eidtor filder
        new CopyWebpackPlugin([{
                from: './app/templates',
                to: './templates'
            },
            {
                from: './app/index.html',
                to: './[name].[ext]',
                toType: 'template'
            },
            {
                from: './app/images/geniecontrols.png',
                to: './images'
            }
        ]),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '65-70'
            }
        }),
        // new HtmlWebpackPlugin({
        //     title: 'Generated Index',
        //     inject: false,
        //     template: './app/build.html',
        //     filename: './index.html'
        // }),
        new MiniCssExtractPlugin({
            filename: "[name].min.css",
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'jQuery': 'jquery',
            '$': 'jquery',
            'jquery': 'jquery',
            'Ajv': 'ajv',
            Fingerprint2: 'Fingerprint2',
            WebFont: 'webfontloader',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                safe: true,
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new BrotliGzipPlugin({
            asset: '[path].br[query]',
            algorithm: 'brotli',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new BrotliGzipPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new ZipPlugin({
            filename: 'content_editor.zip',
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },
            exclude: ['style.min.js', 'plugin-framework.min.js'],
            zipOptions: {
                forceZip64Format: false,
            },
        })
    ],
};


// function CORE_PLUGINS(){
//     if (fs.existsSync('content-editor/scripts/coreplugins.js')) {
//         fs.unlinkSync('content-editor/scripts/coreplugins.js');
//     }
//     corePluginsArray.forEach(function(plugin){
//         var manifest = JSON.parse(fs.readFileSync(__dirname+'/plugins/'+plugin+'/manifest.json'));
//         if(manifest.editor.dependencies){
//             manifest.editor.dependencies.forEach(function(dependency){
//                 var resource = './plugins/' + plugin + '/' + dependency.src;
//                 if (dependency.type == 'js') {
//                     fs.appendFile('content-editor/scripts/coreplugins.js', 'org.ekstep.contenteditor.jQuery("body").append($("<script type=\'text/javascript\' src=\'' + resource + '\'>"))' + '\n');
//                 } else if (dependency.type == 'css') {
//                     fs.appendFile('content-editor/scripts/coreplugins.js', 'org.ekstep.contenteditor.jQuery("head").append("<link rel=\'stylesheet\' type=\'text/css\' href=\'' + resource + '\'>")' + '\n');
//                 }
//             });
//         }
//         var plugin = fs.readFileSync(__dirname+'/plugins/' + plugin + '/editor/plugin.js', 'utf8');
//         fs.appendFile('content-editor/scripts/coreplugins.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.replace(/'/g, "\\'") + '\'))' + '\n');
//     });
//     return corePluginsArray;
// }
