//TODO: Remove the unused constants
const path = require('path');
const PLUGIN_PATH = process.env.CE_COREPLUGINS || './plugins';
const webpack = require('webpack');
const glob = require('glob');
var uglifyjs = require('uglify-js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const expose = require('expose-loader');
const BowerResolvePlugin = require("bower-resolve-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const FontminPlugin = require('fontmin-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const _ = require('lodash');
const entryPlus = require('webpack-entry-plus');
// const StringReplacePlugin = require("string-replace-webpack-plugin");
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');




var corePlugins = [
    "org.ekstep.assessmentbrowser-1.0",
    "org.ekstep.assetbrowser-1.2",
    "org.ekstep.colorpicker-1.0",
    "org.ekstep.conceptselector-1.1",
    // "org.ekstep.config-1.0",
    "org.ekstep.stage-1.0",
    // "org.ekstep.text-1.1",
    "org.ekstep.shape-1.0",
    "org.ekstep.image-1.1",
    "org.ekstep.audio-1.1",
    "org.ekstep.hotspot-1.0",
    "org.ekstep.scribblepad-1.0",
    "org.ekstep.readalongbrowser-1.0",
    "org.ekstep.stageconfig-1.0",
    "org.ekstep.telemetry-1.0",
    "org.ekstep.preview-1.1",
    "org.ekstep.activitybrowser-1.2",
    "org.ekstep.collaborator-1.1",
    "org.ekstep.download-1.0",
    "org.ekstep.unsupported-1.0",
    "org.ekstep.wordinfobrowser-1.0",
    "org.ekstep.viewecml-1.0",
    "org.ekstep.utils-1.0",
    "org.ekstep.help-1.0",
    "org.ekstep.video-1.0",
    "org.ekstep.editorstate-1.0",
    "org.ekstep.contenteditorfunctions-1.2",
    "org.ekstep.keyboardshortcuts-1.0",
    "org.ekstep.richtext-1.0",
    "org.ekstep.iterator-1.0",
    "org.ekstep.navigation-1.0"
];

let entryFiles = []

function recursiveTask() {
    entryFiles = [{
            entryFiles: packagePlugins(),
            outputName: 'package-coreplugins.js',
        },
        // {
        //     entryFiles: getVendorJS(),
        //     outputName: 'vendor.js',
        // },
        // {
        //     entryFiles: getVendorCSS(),
        //     outputName: 'vendor.css',
        // },
    ];
    return entryPlus(entryFiles);
}


function packagePlugins() {
    var pluginPackageArr = [];
    corePlugins.forEach(function(plugin) {

        var dependenciesArr = [];
        var packagedDepArr = [];
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        var manifestURL = './plugins/' + plugin + '/manifest.json';
        var pluginContent = fs.readFileSync('plugins/' + plugin + '/editor/plugin.js', 'utf8');
        if (fs.existsSync('plugins/' + plugin + '/editor/plugin.dist.js')) {
            fs.unlinkSync('plugins/' + plugin + '/editor/plugin.dist.js');
        }
        if (manifest.editor.dependencies) {
            var controllerPath, templatePath;
            manifest.editor.dependencies.forEach(function(obj, index) {
                if (obj.type == "js" && !obj.bundle) {
                    dependenciesArr[index] = fs.readFileSync('./plugins/' + plugin + '/' + obj.src, 'utf8');
                    packagedDepArr[index] = dependenciesArr[index];
                }
                if (obj.type == "ctrl" && obj.bundle) controllerPath = 'require("' + obj.src + '")' || undefined;
                if (obj.type == "template" && obj.bundle) templatePath = 'require("' + obj.src + '")' || undefined;
            })
            if (pluginContent) {
                pluginContent = uglifyjs.minify(pluginContent.replace('.loadNgModules(templatePath, controllerPath)', '.loadNgModules(' + templatePath + ', ' + controllerPath + ', true)'))
            } else {
                pluginContent = uglifyjs.minify(pluginContent);
            }

            packagedDepArr.push('org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',' + pluginContent.code.replace(/;\s*$/, "") + ')')

            fs.appendFile('plugins/' + plugin + '/editor/plugin.dist.js', [...packagedDepArr].join("\n"))
            pluginPackageArr.push('./plugins/' + plugin + '/editor/plugin.dist.js')
        } else if (!manifest.editor.hasOwnProperty('dependencies')) {
            pluginContent = uglifyjs.minify(pluginContent);
            packagedDepArr.push('org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',' + pluginContent.code.replace(/;\s*$/, "") + ')')
            fs.appendFile('plugins/' + plugin + '/editor/plugin.dist.js', [...packagedDepArr].join("\n"))
            pluginPackageArr.push('./plugins/' + plugin + '/editor/plugin.dist.js')

        }
    })

    console.log(pluginPackageArr)
        // return CORE_PLUGINS
    return './dummy.js';
}

function getManifest() {
    var manifestURLs = [];
    if (fs.existsSync('./app/scripts/coreplugins-dummy.js')) {
        fs.unlinkSync('./app/scripts/coreplugins-dummy.js');
    }
    corePlugins.forEach(function(plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        var plugin = uglifyjs.minify(fs.readFileSync('plugins/' + plugin + '/editor/plugin.js', 'utf8'));
        fs.appendFile('app/scripts/coreplugins-dummy.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.code + '\'))' + '\n');
    })
    return './app/scripts/coreplugins-dummy.js';
}

function getVendorJS() {
    var jsDependencies = [];
    corePlugins.forEach(function(plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function(dep) {
                if (dep.type == "js") {
                    jsDependencies.push('./plugins/' + plugin + '/' + dep.src)
                }
            })
        };
    })
    return jsDependencies;
}

function getVendorCSS() {
    var cssDependencies = [];
    corePlugins.forEach(function(plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function(dep) {
                if (dep.type == "css") {
                    cssDependencies.push('./plugins/' + plugin + '/' + dep.src)
                }
            })
        };
    })
    return cssDependencies;
}



module.exports = {

    entry: recursiveTask(),

    output: {
        filename: '[name]',
        //path: path.resolve(__dirname, './app/scripts'),
    },
    resolve: {
        alias: {
            'jquery': path.resolve('./node_modules/jquery/dist/jquery.js'),
            'angular': path.resolve('./app/bower_components/angular/angular.js'),
            'clipboard': path.resolve('./node_modules/clipboard/dist/clipboard.min.js'),
        }
    },
    module: {
        rules: [{
                test: require.resolve(PLUGIN_PATH + '/org.ekstep.viewecml-1.0/editor/libs/dist/E2EConverter.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'E2EConverter'
                }]
            },
            // {
            //     test: /\.json$/,
            //     loader: 'string-replace-loader',
            //     options: {
            //         multiple: [{
            //                 search: /^{/,
            //                 replace: 'org.ekstep.pluginframework.pluginManager.registerPlugin(',
            //                 flags: 'i'
            //             },
            //             {
            //                 search: '}$',
            //                 replace: ')',
            //                 flags: 'i'
            //             },
            //         ],
            //         strict: true
            //     }
            // },
            // { 
            //     test: /\.json$/,
            //     loader: StringReplacePlugin.replace({
            //         replacements: [
            //             {
            //                 pattern: /<!-- @secret (\w*?) -->/ig,
            //                 replacement: function (match, p1, offset, string) {
            //                     return secrets.web[p1];
            //                 }
            //             }
            //         ]})
            //     },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
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
            }, {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 50, //it's important
                            outputPath: './images/assets',
                            name: '[name].[ext]',
                        }
                    },
                ],
            },
            // {
            //     test: /\.json$/,
            //     // loader: 'json-loader'
            //     loader: 'raw-loader'

            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['plugin-dist']),
        new MiniCssExtractPlugin({
            filename: "[name].min.css",
        }),
        // new MergeIntoSingleFilePlugin({
        //     "coreplugin.js": getManifest()
        // }),
        // new StringReplacePlugin()
        // new UglifyJsPlugin({
        //     cache: false,
        //     parallel: true,
        //     uglifyOptions: {
        //         compress: {
        //             dead_code: true,
        //             drop_console: true,
        //             global_defs: {
        //                 DEBUG: true
        //             },
        //             passes: 1,
        //         },
        //         ecma: 6,
        //         mangle: true
        //     },
        //     sourceMap: false
        // }),
    ],
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
        }
    }
};