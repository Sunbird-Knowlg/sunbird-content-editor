const ENVIRONMENT = process.env.NODE_ENV;
const BUILD_NUMBER = process.env.build_number;
const EDITOR_VER = process.env.editor_version_number;
const PLUGIN_FRAMEWORK_VER = process.env.framework_version_number;

const ZIP_FILE_NAME = 'content-editor.zip';
const NPM_BUILD_FOLDER_NAME = 'content-editor'

// Dependency files
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const expose = require('expose-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob-all');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OnBuildSuccess = require('on-build-webpack');
const extract = require('extract-zip');
const cpy = require('cpy');

const VENDOR = [
    "./app/bower_components/jquery/dist/jquery.js", // Need to check both semantic and jquery
    './app/bower_components/semantic/dist/semantic.min.js', // "./node_modules/ajv/dist/ajv.bundle.js",
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
    "./app/libs/ng-tags-input.js",
    "./app/libs/alignment-guidelines.js"
];

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
    "./app/scripts/framework/service/lock-service.js",
    "./app/scripts/framework/service/user-service.js",
    "./app/scripts/framework/service/textbook-service.js",
    "./app/scripts/framework/repo/irepo.js",
    "./app/scripts/framework/repo/published-repo.js",
];
var EDITOR_FRAMEWORK = [
    "./app/libs/fontfaceobserver.min.js",
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
    "./app/scripts/contenteditor/migration/textmigration-task.js",
    "./app/scripts/contenteditor/migration/eventsmigration-task.js",
    "./app/scripts/contenteditor/migration/settagmigration-task.js",
    "./app/scripts/contenteditor/migration/textmigration-task.js",
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
    './app/styles/noto.css',
    './content-editor/scripts/plugin-vendor.min.css' // Plugin css files
];

// removing the duplicate files
const APP_SCRIPT = [...new Set([...VENDOR, ...PLUGIN_FRAMEWORK, ...EDITOR_FRAMEWORK, ...EDITOR_APP])]

if (!BUILD_NUMBER && !EDITOR_VER && !PLUGIN_FRAMEWORK_VER) {
    console.error('Error!!! Cannot find framework_version_number, editor_version_number and build_number env variables');
    return process.exit(1)
}

const VERSION = EDITOR_VER + '.' + BUILD_NUMBER;


module.exports = (env, argv) => {
    return {
        entry: {
            'script': APP_SCRIPT,
            'style': APP_STYLE
        },
        output: {
            filename: `[name].min.${VERSION}.js`,
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            alias: {
                'jquery': path.resolve('./node_modules/jquery/dist/jquery.js'),
                'angular': path.resolve('./app/bower_components/angular/angular.js'),
                'Fingerprint2': path.resolve('./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js'),
                'clipboard': path.resolve('./node_modules/clipboard/dist/clipboard.min.js'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            { search: '/plugins', replace: '/content-plugins' },
                            { search: "/api", replace: '/action' },
                            { search: 'https://dev.ekstep.in', replace: '' },
                            { search: 'dispatcher: "local"', replace: 'dispatcher: "console"' }
                        ],
                        strict: true
                    }
                },

                {
                    test: require.resolve('./app/libs/telemetry-lib-v3.min.js'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'EkTelemetry'
                    }]
                },
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
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
                    test: require.resolve('./app/bower_components/fingerprintjs2/dist/fingerprint2.min.js'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'Fingerprint2'
                    }]
                },
                {
                    test: /\.(s*)css$/,
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
                            outputPath: './fonts/',
                            limit: 10000,
                            fallback: 'responsive-loader'
                        }
                    }]
                },
                {
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attrs: [':data-src']
                        }
                    }
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                uglifyOptions: {
                    compress: {
                        dead_code: true,
                        drop_console: false,
                        global_defs: {
                            DEBUG: true
                        },
                        passes: 1,
                    },
                    ecma: 5,
                    mangle: true
                },
                sourceMap: true
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
                },
                {
                    from: './content-editor/scripts/*.js',
                    to: './',
                    flatten: true
                },
                {
                    from: './app/styles/noto.css',
                    to: './'
                },
                {
                    from: './deploy/gulpfile.js',
                    to: './'
                },
                {
                    from: './deploy/package.json',
                    to: './'
                },

            ]),
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                name: '[name].[ext]',
                outputPath: './images',
                pngquant: {
                    quality: '65-70'
                }
            }),
            new MiniCssExtractPlugin({
                filename: `[name].min.${VERSION}.css`,
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": 'jquery',
                "window.$": 'jquery',
                Fingerprint2: 'Fingerprint2',
                WebFont: 'webfontloader',
                Ajv: 'ajv',

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
            new ZipPlugin({
                path: path.join(__dirname, '.'),
                filename: ZIP_FILE_NAME,
                fileOptions: {
                    mtime: new Date(),
                    compress: true,
                    forceZip64Format: false,
                },
                pathMapper: function(assetPath) {
                    console.log("AssesPath", assetPath)
                    if (assetPath.startsWith('gulpfile')) {
                        return path.join('.', path.basename(assetPath));
                    }
                    if (assetPath.endsWith('.js'))
                        return path.join(path.dirname(assetPath), 'scripts', path.basename(assetPath));
                    if (assetPath.endsWith('.css'))
                        return path.join(path.dirname(assetPath), 'styles', path.basename(assetPath));
                    if (assetPath.startsWith('fonts')) {
                        return path.join('styles', 'fonts', path.basename(assetPath));
                    };
                    return assetPath;
                },
                exclude: [`style.min.${VERSION}.js`],
                zipOptions: {
                    forceZip64Format: false,
                },
            }),
            new OnBuildSuccess(function(stats) {
                if (env && env.channel.toUpperCase() === 'NPM_PACKAGE') {
                    build_npm_package();
                }
            }),
        ],
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
        }
    }
};


function build_npm_package() {
    extract(ZIP_FILE_NAME, { dir: path.resolve(__dirname, NPM_BUILD_FOLDER_NAME) }, function(err, res) {
        if (err) {
            console.error("Fails to extract", err)
            return
        } else {
            console.log("success", res);
            cpy(['./package.json', './README.md'], path.resolve(__dirname, NPM_BUILD_FOLDER_NAME));
            console.log(`NPM ${NPM_BUILD_FOLDER_NAME} package is Ready!!!, Please wait we are updating index.html file`);
        }
    })
}
