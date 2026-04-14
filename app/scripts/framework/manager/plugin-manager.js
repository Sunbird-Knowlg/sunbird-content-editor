/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.pluginManager = new (Class.extend({
	pluginManifests: {},
	plugins: {},
	pluginObjs: {},
	pluginInstances: {},
	errors: [],
	init: function () {
		console.log('Plugin manager initialized')
	},
	_registerPlugin: function (pluginId, pluginVer, plugin, manifest, repo) {
		this.plugins[pluginId] = { p: plugin, m: manifest, repo: repo }
		this._registerNameSpace(pluginId, plugin)
		if (manifest) this.pluginManifests[manifest.id] = { m: manifest, repo: repo }
		org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:load', { plugin: pluginId, version: pluginVer })
		org.ekstep.pluginframework.eventManager.dispatchEvent(pluginId + ':load')
		// eslint-disable-next-line
		var p = new plugin(manifest)
		if (manifest) this.pluginObjs[manifest.id] = p
	},
	registerPlugin: function (manifest, plugin, repo) {
		repo = repo || org.ekstep.pluginframework.publishedRepo
		this._registerPlugin(manifest.id, manifest.ver, plugin, manifest, repo)
	},
	loadCustomPlugin: function (dependency, callback, publishedTime) {
		var instance = this;
		org.ekstep.pluginframework.resourceManager.loadResource(dependency.src, 'text', function (err, data) {
			if (err) {
				org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: dependency.id, version: dependency.ver, action: 'load', err: err })
				instance.addError({ error: 'Fails to load Customplugin', plugin: dependency.id, version: dependency.ver, action: 'load', stackTrace: err })
				console.error('Unable to load editor plugin', 'plugin:' + dependency.id + '-' + dependency.ver, 'resource:', 'Error:', err)
			} else {
				try {
					if (!instance.isPluginDefined(dependency.id)) {
						// eslint-disable-next-line
						data = eval(data)
						instance._registerPlugin(dependency.id, undefined, data, undefined, undefined)
					} else {
						console.info('Plugin is already registered: ', dependency.id)
					}
				} catch (e) {
					org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: dependency.id, version: dependency.ver, action: 'load', err: e })
					instance.addError({ error: 'Fails to load Customplugin', plugin: dependency.id, version: dependency.ver, action: 'load', stackTrace: e })
					console.error('Error while loading plugin', 'plugin:' + dependency.id + '-' + dependency.ver, 'Error:', e)
				}
			}
			callback && callback()
		}, publishedTime)
	},
	loadPluginByManifest: function (manifest, repo, pluginType, publishedTime) {
		var instance = this
		var scope = org.ekstep.pluginframework.env
		if (manifest[scope] && manifest[scope].main) {
			org.ekstep.pluginframework.resourceManager.getResource(manifest.id, manifest.ver, manifest[scope].main, 'text', repo, function (err, data) {
				if (err) {
					org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: manifest.id, version: manifest.ver, action: 'load', err: err })
					// eslint-disable-next-line
					instance.addError({ error: 'Fails to load plugin!', plugin: manifest.id, version: manifest.ver, action: 'load', stackTrace: err })
					console.error('Unable to load editor plugin', 'plugin:' + manifest.id + '-' + manifest.ver, 'resource:' + manifest[scope].main, 'Error:', err)
				} else {
					try {
						if (!instance.isPluginDefined(manifest.id)) {
							if (pluginType === 'library') {
								org.ekstep.pluginframework.jQuery.globalEval(data)
							} else {
								// eslint-disable-next-line
								if (data) instance.registerPlugin(manifest, eval(data), repo)
							}
						} else {
							console.info('Plugin is already registered: ', manifest.id)
						}
					} catch (e) {
						org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: manifest.id, version: manifest.ver, action: 'load', err: e })
						instance.addError({ error: 'Fails to load plugin!', plugin: manifest.id, version: manifest.ver, action: 'load', stackTrace: e })
						console.error('Error while loading plugin', 'plugin:' + manifest.id + '-' + manifest.ver, 'Error:', e)
					}
				}
			}, publishedTime)
		} 
	},
	_registerNameSpace: function (pluginId, clazz) {
		var names = pluginId.split('.')
		var baseNameSpace = names[0]
		var lastKey = names[names.length - 1]
		names.splice(0, 1)

		var pluginClazz = (org.ekstep.pluginframework.env === 'editor') ? Class.extend({
			init: function (data, parent, override) {
				org.ekstep.pluginframework.pluginManager.invoke(pluginId, data, parent, override)
			}
		}) : Class.extend({
			init: function (data, parent, stage, theme) {
				org.ekstep.pluginframework.pluginManager.invokeRenderer(pluginId, data, parent, stage, theme)
			}
		})
		pluginClazz.extend = function (subClazz) {
			return clazz.extend(subClazz)
		}

		if (names.length > 0) {
			if (!window[baseNameSpace]) {
				window[baseNameSpace] = {}
			}
			names.reduce(function (o, s) {
				var val = ((s === lastKey) ? pluginClazz : {})
				// eslint-disable-next-line
				return (o[s] === undefined) ? o[s] = val : o[s]
			}, window[baseNameSpace])
		} else {
			if (window[baseNameSpace] === undefined) window[baseNameSpace] = pluginClazz
		}
	},
	loadAndInitPlugin: function (pluginId, version, publishedTime, parent) {
		var self = this
		if (this.isPluginDefined(pluginId)) {
			var pluginManifest = this.getPluginManifest(pluginId)
			if (pluginManifest.type && (pluginManifest.type.toLowerCase() === 'widget')) {
				this.invoke(pluginId, JSON.parse(JSON.stringify(pluginManifest[org.ekstep.pluginframework.env]['init-data'] || {})), parent)
			}
		} else {
			this.loadPluginWithDependencies(pluginId, version, undefined, publishedTime, [], function () {
				if (self.isPluginDefined(pluginId)) {
					var pluginManifest = self.getPluginManifest(pluginId)
					if (pluginManifest.type && (pluginManifest.type.toLowerCase() === 'widget')) {
						self.invoke(pluginId, JSON.parse(JSON.stringify(pluginManifest[org.ekstep.pluginframework.env]['init-data'] || {})), parent)
					}
				}
			})
		}
	},
	loadPluginWithDependencies: function (pluginId, pluginVer, pluginType, publishedTime, parents, callback) {
		var instance = this
		if (this.plugins[pluginId]) {
			console.info('A plugin with id "' + pluginId + '" and ver "' + pluginVer + '" is already loaded')
			callback && callback()
			return
		}

		if (parents.indexOf(pluginId) !== -1) {
			console.warn('Detected a cyclic dependency with the plugin: "' + pluginId + '". Breaking the chain...')
			callback && callback()
			return
		}

		parents.push(pluginId)
		org.ekstep.pluginframework.resourceManager.discoverManifest(pluginId, pluginVer, function (err, data) {
			if (err || (data === undefined)) {
				org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: pluginId, version: pluginVer, action: 'load', err: err })
				instance.addError({ error: 'Manifest not found!', plugin: pluginId, version: pluginVer, action: 'discoverManifest', stackTrace: err })
				console.error('Unable to load plugin manifest', 'plugin:' + pluginId + '-' + pluginVer, 'Error:', err)
				callback && callback()
			} else {
				instance.loadManifestDependencies(data.manifest.dependencies, publishedTime, parents, function () {
					if (!data.manifest.editor || Object.keys(data.manifest.editor).length === 0) {
						instance.pluginManifests[data.manifest.id] = { m: data.manifest, repo: data.repo }
					}
					var queue = instance.queueDependencies(data.manifest, data.repo, publishedTime, parents)
					if (queue.length() > 0) {
						queue.drain = function () {
							instance.loadPluginByManifest(data.manifest, data.repo, pluginType, publishedTime)
							callback && callback()
						}
					} else {
						instance.loadPluginByManifest(data.manifest, data.repo, pluginType, publishedTime)
						callback && callback()
					}
				})
			}
		}, publishedTime)
	},
	queueDependencies: function (manifest, repo, publishedTime, parents) {
		var scope = org.ekstep.pluginframework.env
		var queue = org.ekstep.pluginframework.async.queue(function (task, callback) {
			if (task.type === 'plugin') {
				if (org.ekstep.pluginframework.env === 'renderer') {
					instance.loadCustomPlugin({id: task.plugin, src: task.repo.resolveResource(task.id, task.ver, task.src)}, callback, undefined)
				} else {
					instance.loadPluginWithDependencies(task.plugin, task.ver, task.type, publishedTime, parents, callback)
				}
			} else {
				org.ekstep.pluginframework.resourceManager.loadExternalPluginResource(task.type, task.id, task.ver, task.src, task.repo, task.publishedTime, callback)
			}
		}, 1)
		var instance = this
		if (manifest[scope] && Array.isArray(manifest[scope].dependencies)) {
			manifest[scope].dependencies.forEach(function (dependency) {
				if (dependency.type === 'plugin') {
					if (org.ekstep.pluginframework.env === 'renderer') {
						queue.push({
							type: dependency.type,
							id: manifest.id,
							ver: manifest.ver,
							src: dependency.src,
							repo: repo,
							plugin: dependency.id
						}, function () {})
					} else {
						queue.push(dependency, function () {})
					}
				} else if (dependency.type === 'js' || dependency.type === 'css') {
					queue.push({
						type: dependency.type,
						id: manifest.id,
						ver: manifest.ver,
						src: dependency.src,
						repo: repo,
						publishedTime: publishedTime
					}, function () {})
				}
			})
		}
		return queue
	},
	loadManifestDependencies: function (dependencies, publishedTime, parents, callback) {
		var instance = this
		if (Array.isArray(dependencies) && dependencies.length > 0) {
			var queue = org.ekstep.pluginframework.async.queue(function (plugin, pluginCallback) {
				instance.loadPluginWithDependencies(plugin.id, plugin.ver, plugin.type, plugin.pt, parents, pluginCallback)
			}, 1)
			dependencies.forEach(function (dep) {
				if (org.ekstep.pluginframework.env === 'renderer') {
					if (dep.scope === org.ekstep.pluginframework.env || dep.scope === 'all') {
						// eslint-disable-next-line
						queue.push({ 'id': dep.plugin, 'ver': dep.ver, 'type': dep.type, 'pt': publishedTime }, function (err) {})
					}
				} else {
					// eslint-disable-next-line
					queue.push({ 'id': dep.plugin, 'ver': dep.ver, 'type': dep.type, 'pt': publishedTime }, function (err) {})
				}
			})
			if (queue.length() > 0) {
				queue.drain = function () {
					callback && callback()
				}
			} else {
				callback && callback()
			}
		} else {
			callback && callback()
		}
	},
	isManifestDefined: function (id) {
		if (this.pluginManifests[id]) {
			return true
		} else {
			return false
		}
	},
	isPluginDefined: function (id) {
		if (this.plugins[id]) {
			return true
		} else {
			return false
		}
	},
	loadPlugin: function (pluginId, pluginVer, callback) {
		this.loadPluginWithDependencies(pluginId, pluginVer, 'plugin', undefined, [], function () {
			callback && callback()
		})
	},
	loadAllPlugins: function (plugins, otherDependencies, callback) {
		var instance = this
		if (Array.isArray(plugins) && plugins.length) {
			var preloadPlugin = plugins.find(function (plugin) {
				return (plugin.preload === true || plugin.preload === 'true')
			})
			if (preloadPlugin) {
				instance.loadPlugin(preloadPlugin.id, preloadPlugin.ver, function () {
					instance._loadPlugins(plugins, otherDependencies, callback)
				})
			} else {
				instance._loadPlugins(plugins, otherDependencies, callback)
			}
		} else if (Array.isArray(otherDependencies) && otherDependencies.length) {
			instance.loadOtherDependencies(otherDependencies, callback)
		} else {
			callback && callback()
		}
	},
	_loadPlugins: function (plugins, otherDependencies, callback) {
		var instance = this
		var q = org.ekstep.pluginframework.async.queue(function (plugin, pluginCallback) {
			instance.loadPluginWithDependencies(plugin.id, plugin.ver, plugin.type, plugin.pt, [], pluginCallback)
		}, 6)
		q.drain = function () {
			instance.loadOtherDependencies(otherDependencies, callback)
		}
		plugins.forEach(function (plugin) {
			// eslint-disable-next-line
			q.push({ 'id': plugin.id, 'ver': plugin.ver, 'type': plugin.type, 'pt': undefined }, function (err) {})
		})
	},
	loadOtherDependencies: function (otherDependencies, callback) {
		var instance = this
		if (Array.isArray(otherDependencies) && otherDependencies.length) {
			var queue = org.ekstep.pluginframework.async.queue(function (dependency, cb) {
				if (dependency.type === 'plugin') {
					instance.loadCustomPlugin(dependency, cb)
				} else {
					org.ekstep.pluginframework.resourceManager.loadExternalResource(dependency.src, dependency.type, undefined, cb)
				}
			}, 1)
			otherDependencies.forEach(function (dep) {
				// eslint-disable-next-line
				queue.push(dep, function (err) {})
			})
			if (queue.length() > 0) {
				queue.drain = function () {
					callback && callback()
				}
			} else {
				callback && callback()
			}
		} else {
			callback && callback()
		}
	},
	invoke: function (id, data, parent, override) {
		var instance = this
		// eslint-disable-next-line
		var p = undefined
		var plugin = this.plugins[id]
		if (!plugin) {
			this.addError({ error: 'Plugin not found!', plugin: id, version: ' ', stackTrace: ' '})
		} else {
			var pluginClass = override ? plugin.p.extend(override) : plugin.p
			var pluginManifest = plugin.m
			try {
				if (Array.isArray(data)) {
					data.forEach(function (d) {
						// eslint-disable-next-line
						p = new pluginClass(pluginManifest, d, parent)
						instance.addPluginInstance(p)
						p.initPlugin()
						org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id })
						org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add')
					})
				} else {
					// eslint-disable-next-line
					p = new pluginClass(pluginManifest, data, parent)
					instance.addPluginInstance(p)
					p.initPlugin()
					org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id })
					org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add')
				}
			} catch (e) {
				org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: pluginManifest.id, version: pluginManifest.ver, action: 'invoke', err: e })
				instance.addError({ error: 'Fails to invoke!', plugin: pluginManifest.id, version: pluginManifest.ver, action: 'invoke', stackTrace: e })
				if (p) delete instance.pluginInstances[p.id]
				// eslint-disable-next-line
				throw 'Error: when instantiating plugin: ' + id
			}
		}
		return p
	},
	invokeRenderer: function (id, data, parent, stage, theme) {
		var instance = this
		// eslint-disable-next-line
		var p = undefined
		var plugin = this.plugins[id]
		if (!plugin) {
			this.addError({ error: 'Plugin not found!', plugin: id, version: ' ', stackTrace: ' '})
		} else {
			try {
				var pluginClass = plugin.p
				var pluginManifest = plugin.m || { id: id, ver: undefined }
				if (Array.isArray(data)) {
					data.forEach(function (d) {
						// eslint-disable-next-line
						p = new pluginClass(d, parent, stage, theme)
						instance.addPluginInstance(p)
						org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id })
						org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add')
					})
				} else {
					// eslint-disable-next-line
					p = new pluginClass(data, parent, stage, theme)
					instance.addPluginInstance(p)
					org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id })
					org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add')
				}
			} catch (e) {
				org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:error', { plugin: pluginManifest.id, version: pluginManifest.ver, action: 'invoke', err: e })
				instance.addError({ error: 'Fails to invoke!', plugin: pluginManifest.id, version: pluginManifest.ver, action: 'invoke', stackTrace: e })
				if (p) delete instance.pluginInstances[p.id]
				// eslint-disable-next-line
				throw 'Error: when instantiating plugin: ' + id
			}
		}
		return p
	},
	addPluginInstance: function (pluginObj) {
		this.pluginInstances[pluginObj.id] = pluginObj
	},
	removePluginInstance: function (pluginObj) {
		if (pluginObj) pluginObj.remove()
	},
	getPluginInstance: function (id) {
		return this.pluginInstances[id]
	},
	getPluginInstances: function () {
		return this.pluginInstances
	},
	getPluginManifest: function (id) {
		var plugin = this.plugins[id] || this.pluginManifests[id]
		if (plugin) {
			return plugin.m
		} else {
			return undefined
		}
	},
	addError: function (error) {
		org.ekstep.services.telemetryService.error({ 'err': error.error, 'errtype': 'CONTENT', 'stacktrace': error.stackTrace, 'plugin': { 'id': error.plugin,'ver': error.version }});		
		this.errors.push(error)
	},
	getErrors: function () {
		return this.errors
	},
	cleanUp: function () {
		this.pluginInstances = {}
		this.pluginManifests = {}
		this.plugins = {}
		this.errors = []
	},
	getPlugins: function () {
		return Object.keys(this.plugins)
	},
	getPluginType: function (id) {
		if (this.pluginInstances[id]) {
			return this.pluginInstances[id].getType()
		} else {
			return ''
		}
	},
	loadPluginResource: function (pluginId, pluginVer, src, dataType, callback) {
		if (this.plugins[pluginId]) {
			org.ekstep.pluginframework.resourceManager.getResource(pluginId, pluginVer, src, dataType, this.plugins[pluginId]['repo'], callback)
		} else {
			callback(new Error('unable load plugin resource ' + src), undefined)
		}
	},
	getPluginVersion: function (id) {
		if (this.pluginInstances[id]) {
			return this.pluginInstances[id].getVersion()
		} else {
			return ''
		}
	},
	resolvePluginResource: function (id, ver, resource) {
		if (this.plugins[id] && this.plugins[id]['repo']) {
			return this.plugins[id]['repo'].resolveResource(id, ver, resource)
		} else if (this.pluginManifests[id] && this.pluginManifests[id]['repo']) {
			return this.pluginManifests[id]['repo'].resolveResource(id, ver, resource)
		} else {
			return false
		}
	}
}))()
