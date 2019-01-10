const path = require('path')
// eslint-disable-next-line
const PLUGIN_PATH = process.env.CE_COREPLUGINS || './plugins'
const webpack = require('webpack')
// eslint-disable-next-line
const glob = require('glob')
const uglifyjs = require('uglify-js')
// eslint-disable-next-line
const expose = require('expose-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs')
const entryPlus = require('webpack-entry-plus')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var corePlugins = [
	'org.ekstep.assessmentbrowser-1.1',
	'org.ekstep.assetbrowser-1.2',
	'org.ekstep.colorpicker-1.0',
	'org.ekstep.conceptselector-1.1',
	'org.ekstep.stage-1.0',
	'org.ekstep.text-1.2',
	'org.ekstep.shape-1.0',
	'org.ekstep.image-1.1',
	'org.ekstep.audio-1.1',
	'org.ekstep.hotspot-1.0',
	'org.ekstep.scribblepad-1.0',
	'org.ekstep.stageconfig-1.0',
	'org.ekstep.telemetry-1.0',
	'org.ekstep.preview-1.2',
	'org.ekstep.activitybrowser-1.3',
	'org.ekstep.collaborator-1.2',
	'org.ekstep.download-1.0',
	'org.ekstep.unsupported-1.0',
	'org.ekstep.wordinfobrowser-1.0',
	'org.ekstep.viewecml-1.0',
	'org.ekstep.utils-1.0',
	'org.ekstep.help-1.0',
	'org.ekstep.editorstate-1.0',
	'org.ekstep.contenteditorfunctions-1.2',
	'org.ekstep.keyboardshortcuts-1.0',
	'org.ekstep.richtext-1.0',
	'org.ekstep.iterator-1.0',
	'org.ekstep.navigation-1.0'
]

let entryFiles = []

function getEntryFiles () {
	entryFiles = [{
		entryFiles: packagePlugins(),
		outputName: 'coreplugins.js'
	},
	{
		entryFiles: getVendorCSS(),
		outputName: 'plugin-vendor'
	}
	]
	return entryPlus(entryFiles)
}

function packagePlugins () {
	var pluginPackageArr = [] // Default coreplugin
	pluginPackageArr.push('./content-editor/scripts/coreplugins.js')
	corePlugins.forEach(function (plugin) {
		var dependenciesArr = []
		var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'))
		var pluginContent = fs.readFileSync('plugins/' + plugin + '/editor/plugin.js', 'utf8')
		if (fs.existsSync('plugins/' + plugin + '/editor/plugin.dist.js')) {
			fs.unlinkSync('plugins/' + plugin + '/editor/plugin.dist.js')
		}
		if (manifest.editor.views && pluginContent) {
			var controllerPathArr = []
			var templatePathArr = []
			manifest.editor.views.forEach(function (obj, i) {
				controllerPathArr[i] = (obj.controller) ? 'require("' + obj.controller + '")' : undefined
				templatePathArr[i] = (obj.template) ? 'require("' + obj.template + '")' : undefined
			})
			var count = 0
			var len = (pluginContent.replace(/\b(loadNgModules)\b.*\)/g) || []).length

			pluginContent = uglifyjs.minify(pluginContent.replace(/\b(loadNgModules)\b.*\)/g, function ($0) {
				if (count === len) count = 0
				var dash
				dash = 'loadNgModules(' + templatePathArr[count] + ' , ' + controllerPathArr[count] + ', true)'
				count++
				return dash
			}))
		} else {
			pluginContent = uglifyjs.minify(pluginContent)
		}

		if (manifest.editor.dependencies) {
			manifest.editor.dependencies.forEach(function (obj, i) {
				if (obj.type === 'js') {
					dependenciesArr[i] = fs.readFileSync('./plugins/' + plugin + '/' + obj.src, 'utf8')
				}
			})
		}
		dependenciesArr.push('org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',' + pluginContent.code.replace(/;\s*$/, '') + ')')
		fs.appendFile('plugins/' + plugin + '/editor/plugin.dist.js', [...dependenciesArr].join('\n'))
		pluginPackageArr.push('./plugins/' + plugin + '/editor/plugin.dist.js')
	})

	return pluginPackageArr
}

function getVendorCSS () {
	var cssDependencies = []
	corePlugins.forEach(function (plugin) {
		var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'))
		if (manifest.editor.dependencies) {
			manifest.editor.dependencies.forEach(function (dep) {
				if (dep.type === 'css') {
					cssDependencies.push('./plugins/' + plugin + '/' + dep.src)
				}
			})
		};
	})
	return cssDependencies
}

module.exports = {

	entry: getEntryFiles(),

	output: {
		filename: '[name]',
		path: path.resolve(__dirname, './content-editor/scripts')
	},
	resolve: {
		alias: {
			'jquery': path.resolve('./node_modules/jquery/dist/jquery.js'),
			'angular': path.resolve('./app/bower_components/angular/angular.js'),
			'clipboard': path.resolve('./node_modules/clipboard/dist/clipboard.min.js'),
			'E2EConverter': path.resolve('./plugins/org.ekstep.viewecml-1.0/editor/libs/src/converter.js'),
			'xmlbuilder': path.resolve('./node_modules/xmlbuilder/lib/index.js'),
			'X2JS': path.resolve('./plugins/org.ekstep.assessmentbrowser-1.1/editor/libs/xml2json.js')
		}
	},
	module: {
		rules: [{
			test: require.resolve('./plugins/org.ekstep.viewecml-1.0/editor/libs/src/converter.js'),
			use: [{
				loader: 'expose-loader',
				options: 'E2EConverter'
			}]
		}, {
			test: require.resolve('./plugins/org.ekstep.assessmentbrowser-1.1/editor/libs/xml2json.js'),
			use: [{
				loader: 'expose-loader',
				options: 'X2JS'
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
		{
			test: /\.(s*)css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						sourceMap: false,
						minimize: true,
						'preset': 'advanced',
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
						'preset': 'advanced',
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
						limit: 50, // it's important
						outputPath: './images/assets',
						name: '[name].[ext]'
					}
				}
			]
		}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].min.css'
		}),
		new webpack.ProvidePlugin({
			E2EConverter: 'E2EConverter'
		}),
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
					passes: 1
				},
				ecma: 5,
				mangle: true
			},
			sourceMap: true
		})
	],
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~'
		}
	}
}
