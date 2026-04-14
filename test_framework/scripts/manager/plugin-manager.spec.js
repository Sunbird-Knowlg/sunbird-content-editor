describe('plugin manager unit test cases', function () {
	var pm = org.ekstep.pluginframework.pluginManager
	var em = org.ekstep.pluginframework.eventManager
	var rm = org.ekstep.pluginframework.resourceManager
	var publishedRepo = org.ekstep.pluginframework.publishedRepo
	var tm = org.ekstep.services.telemetryService

	beforeEach(function () {
		pm.cleanUp()
	})

	it('registerPlugin method: should call _register method', function () {
		spyOn(pm, '_registerPlugin')
		var testManifest = { id: 'org.ekstep.one', 'ver': '1.0' }
		pm.registerPlugin(testManifest, {}, publishedRepo)
		expect(pm._registerPlugin).toHaveBeenCalledWith(testManifest.id, testManifest.ver, jasmine.any(Object), testManifest, publishedRepo)
	})

	it('_registerPlugin method: should register and dispatch plugin load event', function (done) {
		var pluginManifest
		var testPlugin = { id: 'org.ekstep.one', ver: '1.0' }

		spyOn(pm, '_registerNameSpace')
		spyOn(em, 'dispatchEvent')
		// eslint-disable-next-line
		rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
			pluginManifest = data.manifest
			// eslint-disable-next-line
			rm.getResource(pluginManifest.id, pluginManifest.ver, pluginManifest[org.ekstep.pluginframework.env].main, 'text', publishedRepo, function (err, data) {
				// eslint-disable-next-line
				var plugin = eval(data)
				pm._registerPlugin(testPlugin.id, testPlugin.ver, plugin, pluginManifest, publishedRepo)

				expect(pm.plugins[testPlugin.id]).toEqual({ p: plugin, m: pluginManifest, repo: publishedRepo })
				expect(pm._registerNameSpace).toHaveBeenCalled()
				expect(pm.pluginManifests[testPlugin.id].m).toEqual(pluginManifest)
				expect(pm.pluginObjs[testPlugin.id]).toBeDefined()
				expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:load', { plugin: testPlugin.id, version: testPlugin.ver })
				expect(em.dispatchEvent).toHaveBeenCalledWith(testPlugin.id + ':load')
				done()
			})
		})
	})

	describe('loadCustomPlugin method', function () {
		afterAll(function () {
			pm.cleanUp()
		})

		it('should load and register custom plugin', function (done) {
			spyOn(pm, '_registerPlugin')
			spyOn(rm, 'loadResource').and.callThrough()

			var dependency = {
				id: 'org.ekstep.two',
				ver: '1.0',
				src: 'base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/two.js'
			}

			pm.loadCustomPlugin(dependency, function () {
				expect(pm._registerPlugin).toHaveBeenCalled()
				expect(rm.loadResource).toHaveBeenCalled()
				done()
			}, undefined)
		})

		it('should not load custom plugin for invalid path', function (done) {
			spyOn(pm, '_registerPlugin')
			spyOn(rm, 'loadResource').and.callThrough()
			spyOn(tm, 'error').and.callThrough()
			

			var dependency = {
				id: 'org.ekstep.two',
				ver: '1.0',
				src: 'base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/plugin_123.js' // invalid path
			}

			pm.loadCustomPlugin(dependency, function () {
				expect(pm._registerPlugin).not.toHaveBeenCalled()
				expect(rm.loadResource).toHaveBeenCalled()
				expect(tm.error).toHaveBeenCalled()
				done()
			}, undefined)
		})

		it('should not load custom plugin, if plugin has compilation error', function (done) {
			spyOn(pm, '_registerPlugin')
			spyOn(rm, 'loadResource').and.callThrough()
			spyOn(tm,'error')

			var dependency = {
				id: 'org.ekstep.two-invalid',
				ver: '1.0',
				src: 'base/test_framework/data/content-plugins/org.ekstep.two-invalid-1.0/renderer/two.js'
			}

			pm.loadCustomPlugin(dependency, function () {
				expect(pm._registerPlugin).not.toHaveBeenCalled()
				expect(rm.loadResource).toHaveBeenCalled()
				expect(tm.error).toHaveBeenCalled()
				done()
			}, undefined)
		})

		it('should not load custom plugin, if plugin is already loaded and registered', function (done) {
			pm.plugins['org.ekstep.two'] = true // plugin registered!

			spyOn(pm, '_registerPlugin')
			spyOn(rm, 'loadResource').and.callThrough()

			var dependency = {
				id: 'org.ekstep.two',
				ver: '1.0',
				src: 'base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/two.js'
			}

			pm.loadCustomPlugin(dependency, function () {
				expect(pm._registerPlugin).not.toHaveBeenCalled()
				expect(rm.loadResource).toHaveBeenCalled()
				done()
			}, undefined)
		})
	})

	describe('loadPluginByManifest method', function () {
		afterAll(function () {
			pm.cleanUp()
		})

		it('should load and register plugin by manifest', function (done) {
			var pluginManifest
			var testPlugin = { id: 'org.ekstep.one', ver: '1.0' }
			var spy = spyOn(tm, 'error').and.callThrough()

			
			spyOn(pm, 'registerPlugin')
			spyOn(rm, 'getResource').and.callThrough()
			
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pluginManifest = data.manifest
				pm.loadPluginByManifest(pluginManifest, publishedRepo, 'plugin', undefined)
				expect(tm).toBeDefined();
				expect(spy);
				expect(pm.registerPlugin).toHaveBeenCalled()
				expect(rm.getResource).toHaveBeenCalled()
				done()
			})
		})

		it('should not load plugin, if plugin has compilation error', function (done) {
			var pluginManifest
			var testPlugin = { id: 'org.ekstep.two-invalid', ver: '1.0' }

			spyOn(pm, 'registerPlugin')
			spyOn(rm, 'getResource').and.callThrough()
			spyOn(tm,'error')
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pluginManifest = data.manifest
				pm.loadPluginByManifest(pluginManifest, publishedRepo, 'plugin', undefined)
				expect(pm.registerPlugin).not.toHaveBeenCalled()
				expect(rm.getResource).toHaveBeenCalled()
				expect(tm.error).toHaveBeenCalled()
				done()
			})
		})

		it('should not load plugin, if plugin is already loaded and registered', function (done) {
			var pluginManifest
			var testPlugin = { id: 'org.ekstep.two', ver: '1.0' }
			pm.plugins['org.ekstep.two'] = true // plugin registered!

			spyOn(pm, 'registerPlugin')
			spyOn(rm, 'getResource').and.callThrough()
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pluginManifest = data.manifest
				pm.loadPluginByManifest(pluginManifest, publishedRepo, 'plugin', undefined)
				expect(pm.registerPlugin).not.toHaveBeenCalled()
				expect(rm.getResource).toHaveBeenCalled()
				done()
			})
		})

		it('should load plugin type "library"', function (done) {
			var pluginManifest
			var testPlugin = { id: 'org.ekstep.two', ver: '1.0' }
			pm.plugins['org.ekstep.two'] = true // plugin registered!

			spyOn(pm, 'registerPlugin')
			spyOn(rm, 'getResource').and.callThrough()
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pluginManifest = data.manifest
				pm.loadPluginByManifest(pluginManifest, publishedRepo, 'library', undefined)
				expect(pm.registerPlugin).not.toHaveBeenCalled()
				expect(rm.getResource).toHaveBeenCalled()
				done()
			})
		})
	})

	describe('_registerNameSpace method', function () {
		afterAll(function () {
			pm.cleanUp()
		})

		var clazz = Class.extend({
			id: 'org.ekstep.external_plugin.audio_editor',
			init: function () {}
		})

		it('should register plugin namespace', function () {
			pm._registerNameSpace('org.ekstep.external_plugin.audio_editor', clazz)
			expect(window.org.ekstep.external_plugin.audio_editor).toBeDefined()
		})

		it('should be extendable by other plugins', function () {
			var extendedPlugin = clazz.extend({
				init: function () {}
			})
			// eslint-disable-next-line
			extendedPlugin = new extendedPlugin()

			pm._registerNameSpace('com.editor.plugin', extendedPlugin)
			expect(window.com.editor.plugin).toBeDefined()
			expect(extendedPlugin.id).toBe('org.ekstep.external_plugin.audio_editor')
		})

		it('should register namespace to window object, when namespace not defined', function () {
			pm._registerNameSpace('someBadPlugin', clazz)
			expect(window.someBadPlugin).toBeDefined()
		})
	})

	describe('loadAndInitPlugin method', function () {
		afterAll(function () {
			pm.cleanUp()
		})

		it('should instantiate the plugin instance, if plugin is loaded', function () {
			spyOn(pm, 'loadPluginWithDependencies')
			spyOn(pm, 'invoke')
			spyOn(pm, 'getPluginManifest').and.returnValue({ type: 'widget', 'editor': '', 'renderer': '' })
			spyOn(pm, 'isPluginDefined').and.returnValue(true)
			spyOn(pm, 'loadAndInitPlugin')
			pm.loadAndInitPlugin('org.ekstep.two', '1.0', undefined, {})
			expect(pm.isPluginDefined('org.ekstep.two')).toBe(true)
		})

		it('should not instantiate when plugin is not loaded', function () {
			spyOn(pm, 'loadPluginWithDependencies')
			spyOn(pm, 'invoke')
			spyOn(pm, 'getPluginManifest').and.returnValue({ type: 'plugin', 'editor': '', 'renderer': '' })
			spyOn(pm, 'isPluginDefined').and.returnValue(false)
			spyOn(pm, 'loadAndInitPlugin')
			pm.loadAndInitPlugin('org.ekstep.two', '1.0', undefined, {})
			expect(pm.isPluginDefined('org.ekstep.two')).toBe(false)
			expect(pm.invoke).not.toHaveBeenCalled()
		})

		xit("should only load plugin with type 'widget'", function () {
			spyOn(pm, 'loadPluginWithDependencies')
			spyOn(pm, 'invoke')
			spyOn(pm, 'getPluginManifest').and.returnValue({ type: 'widget', 'editor': '', 'renderer': '' }) // type: plugin
			spyOn(pm, 'isPluginDefined').and.returnValue(true)
			spyOn(pm, 'loadAndInitPlugin')
			pm.loadAndInitPlugin('org.ekstep.two', '1.0', undefined, {})
			expect(pm.isPluginDefined('org.ekstep.two')).toBe(true)
			expect(pm.invoke).toHaveBeenCalled()
		})
	})

	describe('loadPluginWithDependencies method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should discover the plugin manifest and load the plugin', function (done) {
			var spy = spyOn(tm, 'error').and.callThrough()
			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			

			pm.loadPluginWithDependencies('org.ekstep.six', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies).toHaveBeenCalled()
				expect(tm).toBeDefined();
				expect(spy)
				expect(pm.loadPluginByManifest).toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(1)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				done()
			})
		})

		it('should load plugin manifest dependencies', function (done) {
			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			spyOn(pm, 'queueDependencies').and.callThrough()

			pm.loadPluginWithDependencies('org.ekstep.five', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(3)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(3)
				expect(pm.loadManifestDependencies).toHaveBeenCalled()
				expect(pm.loadPluginByManifest).toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(3)
				expect(pm.queueDependencies).toHaveBeenCalled()
				expect(pm.queueDependencies.calls.count()).toEqual(3)
				expect(pm.isPluginDefined('org.ekstep.five')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				done()
			})
		})

		it('should load other dependencies like js, css', function (done) {
			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			spyOn(pm, 'queueDependencies').and.callThrough()

			pm.loadPluginWithDependencies('org.ekstep.seven', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies).toHaveBeenCalled()
				expect(pm.loadPluginByManifest).toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(1)
				expect(pm.queueDependencies).toHaveBeenCalled()
				expect(pm.queueDependencies.calls.count()).toEqual(1)
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				done()
			})
		})

		it('should call the callback when plugin is already loaded', function (done) {
			pm.plugins['org.ekstep.seven'] = true // plugin loaded;

			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			spyOn(pm, 'queueDependencies').and.callThrough()

			pm.loadPluginWithDependencies('org.ekstep.seven', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).not.toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(0)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(0)
				expect(pm.loadManifestDependencies).not.toHaveBeenCalled()
				expect(pm.loadPluginByManifest).not.toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(0)
				expect(pm.queueDependencies).not.toHaveBeenCalled()
				expect(pm.queueDependencies.calls.count()).toEqual(0)
				done()
			})
		})

		it('should break the recurrsive loop and call callback when the same plugin is trying to load itself (cyclic dependency)', function (done) {
			// plugin org.ekstep.one depends --> org.ekstep.two
			// plugin org.ekstep.two depends --> org.ekstep.one
			// cyclic dependency

			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()

			pm.loadPluginWithDependencies('org.ekstep.one', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(2)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(2)
				expect(pm.loadManifestDependencies).toHaveBeenCalled()
				expect(pm.loadPluginByManifest).toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(2)
				expect(pm.isPluginDefined('org.ekstep.one')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.two')).toBe(true)
				done()
			})
		})

		it('should call the callback when plugin has no other dependencies like js, css', function (done) {
			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			spyOn(pm, 'queueDependencies').and.callThrough()

			pm.loadPluginWithDependencies('org.ekstep.six', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies).toHaveBeenCalled()
				expect(pm.loadPluginByManifest).toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(1)
				expect(pm.queueDependencies).toHaveBeenCalled()
				expect(pm.queueDependencies.calls.count()).toEqual(1)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				done()
			})
		})

		it('should call the callback when plugin is not discoverable in any repo', function (done) {
			spyOn(rm, 'discoverManifest').and.callThrough()
			spyOn(pm, 'loadManifestDependencies').and.callThrough()
			spyOn(pm, 'loadPluginByManifest').and.callThrough()
			spyOn(tm, 'error')

			pm.loadPluginWithDependencies('org.ekstep.invalidPlugin', '1.0', 'plugin', undefined, [], function () {
				expect(rm.discoverManifest).toHaveBeenCalled()
				expect(rm.discoverManifest.calls.count()).toEqual(1)
				expect(pm.loadManifestDependencies.calls.count()).toEqual(0)
				expect(pm.loadManifestDependencies).not.toHaveBeenCalled()
				expect(pm.loadPluginByManifest).not.toHaveBeenCalled()
				expect(pm.loadPluginByManifest.calls.count()).toEqual(0)
				expect(pm.isPluginDefined('org.ekstep.invalidPlugin')).toBe(false)
				expect(tm.error).toHaveBeenCalled()
				done()
			})
		})
	})

	describe('queueDependencies method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should queue the dependencies to load from manifest editor/renderer dependencies', function (done) {
			// eslint-disable-next-line
			rm.discoverManifest('org.ekstep.seven', '1.0', function (err, data) {
				spyOn(rm, 'loadExternalPluginResource').and.callThrough()
				spyOn(pm, 'loadPluginWithDependencies')
				spyOn(pm, 'loadCustomPlugin')

				var queueLength = pm.queueDependencies(data.manifest, publishedRepo, 'plugin', undefined, []).length()

				setTimeout(function () {
					expect(queueLength).toBe(2)
					expect(rm.loadExternalPluginResource).toHaveBeenCalled()
					expect(rm.loadExternalPluginResource.calls.count()).toEqual(2)
					expect(pm.loadCustomPlugin).not.toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled()
					done()
				}, 400)
			})
		})

		it('should not queue the dependencies if there is no dependencies', function (done) {
			// eslint-disable-next-line
			rm.discoverManifest('org.ekstep.six', '1.0', function (err, data) {
				spyOn(rm, 'loadExternalPluginResource').and.callThrough()
				spyOn(pm, 'loadPluginWithDependencies')
				spyOn(pm, 'loadCustomPlugin')

				var queueLength = pm.queueDependencies(data.manifest, publishedRepo, 'plugin', undefined, []).length()

				setTimeout(function () {
					expect(queueLength).toBe(0)
					expect(rm.loadExternalPluginResource).not.toHaveBeenCalled()
					expect(pm.loadCustomPlugin).not.toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled()
					done()
				}, 400)
			})
		})

		it('should load dependencies type: plugin for editor', function (done) {
			// eslint-disable-next-line
			rm.discoverManifest('org.ekstep.five', '1.0', function (err, data) {
				spyOn(rm, 'loadExternalPluginResource').and.callThrough()
				spyOn(pm, 'loadPluginWithDependencies')
				spyOn(pm, 'loadCustomPlugin')

				var queueLength = pm.queueDependencies(data.manifest, publishedRepo, 'plugin', undefined, []).length()

				setTimeout(function () {
					expect(queueLength).toBe(1)
					expect(rm.loadExternalPluginResource).not.toHaveBeenCalled()
					expect(pm.loadCustomPlugin).not.toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies.calls.count()).toBe(1)
					done()
				}, 400)
			})
		})

		it('should load dependencies type: plugin for renderer', function (done) {
			org.ekstep.pluginframework.env = 'renderer'
			// eslint-disable-next-line
			rm.discoverManifest('org.ekstep.five', '1.0', function (err, data) {
				spyOn(rm, 'loadExternalPluginResource').and.callThrough()
				spyOn(pm, 'loadPluginWithDependencies')
				spyOn(pm, 'loadCustomPlugin')

				var queueLength = pm.queueDependencies(data.manifest, publishedRepo, 'plugin', undefined, []).length()

				setTimeout(function () {
					expect(queueLength).toBe(1)
					expect(rm.loadExternalPluginResource).not.toHaveBeenCalled()
					expect(pm.loadCustomPlugin).toHaveBeenCalled()
					expect(pm.loadCustomPlugin.calls.count()).toBe(1)
					expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled()
					org.ekstep.pluginframework.env = 'editor'
					done()
				}, 400)
			})
		})
	})

	describe('loadManifestDependencies method', function () {
		afterEach(function () {
			pm.cleanUp()
			org.ekstep.pluginframework.env = 'editor'
		})

		var testPlugin = { 'id': 'org.ekstep.three', 'ver': '1.0' }

		it("env: renderer, should load dependencies with scope: 'renderer' & 'all' declared in manifest", function (done) {
			org.ekstep.pluginframework.env = 'renderer'

			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pm.loadManifestDependencies(data.manifest.dependencies, undefined, [], function () {
					expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies.calls.count()).toBe(2)
					done()
				})
			})
		})

		it("env: editor, should load dependencies with scope: 'editor', 'renderer' & 'all' declared in manifest", function (done) {
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pm.loadManifestDependencies(data.manifest.dependencies, undefined, [], function () {
					expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies.calls.count()).toBe(3)
					done()
				})
			})
		})

		it("env: renderer, should not load dependency with scope: 'editor' ", function (done) {
			org.ekstep.pluginframework.env = 'renderer'
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()
			// eslint-disable-next-line
			rm.discoverManifest(testPlugin.id, testPlugin.ver, function (err, data) {
				pm.loadManifestDependencies(data.manifest.dependencies, undefined, [], function () {
					expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
					expect(pm.loadPluginWithDependencies.calls.count()).toBe(2)
					done()
				})
			})
		})

		it('should call the callback when dependencies are empty', function (done) {
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()
			pm.loadManifestDependencies([], undefined, [], function () {
				expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled()
				done()
			})
		})
	})

	describe('loadAllPlugins method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		var plugins = [
			{ 'id': 'org.ekstep.seven', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.six', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.five', 'ver': '1.0', 'type': 'plugin' }
		]

		var otherDependencies = [
			{ 'id': 'org.ekstep.four', 'type': 'plugin', 'plugin': 'org.ekstep.four', 'ver': '1.0', 'src': 'base/test_framework/data/content-plugins/org.ekstep.four-1.0/renderer/four.js' },
			{ 'id': 'org.ekstep.external', 'type': 'js', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.js' },
			{ 'id': 'org.ekstep.external', 'type': 'css', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.css' }
		]

		it('should load only plugins', function (done) {
			spyOn(pm, '_loadPlugins').and.callThrough()
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm.loadAllPlugins(plugins, undefined, function () {
				expect(pm._loadPlugins.calls.count()).toBe(1)
				expect(pm.loadOtherDependencies).toHaveBeenCalled()
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.five')).toBe(true)
				expect(pm.loadPlugin).not.toHaveBeenCalled()
				done()
			})
		})

		it('should load only other dependencies', function (done) {
			spyOn(pm, '_loadPlugins').and.callThrough()
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm.loadAllPlugins(undefined, otherDependencies, function () {
				expect(pm._loadPlugins).not.toHaveBeenCalled()
				expect(pm.loadOtherDependencies.calls.count()).toBe(1)
				expect(pm.isPluginDefined('org.ekstep.four')).toBe(true)
				expect(pm.loadPlugin).not.toHaveBeenCalled()
				done()
			})
		})

		it('should load plugins and other dependencies', function (done) {
			spyOn(pm, '_loadPlugins').and.callThrough()
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm.loadAllPlugins(plugins, otherDependencies, function () {
				expect(pm._loadPlugins.calls.count()).toBe(1)
				expect(pm.loadOtherDependencies).toHaveBeenCalled()
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.five')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.four')).toBe(true)
				expect(pm.loadPlugin).not.toHaveBeenCalled()
				done()
			})
		})

		it('should load plugin with `preload=true` before other plugins are loaded', function (done) {
			plugins.push({ 'id': 'org.ekstep.four', 'ver': '1.0', 'type': 'plugin', 'preload': true })
			spyOn(pm, '_loadPlugins').and.callThrough()
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm.loadAllPlugins(plugins, undefined, function () {
				expect(pm._loadPlugins).toHaveBeenCalled()
				expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
				expect(pm.loadPlugin).toHaveBeenCalled()
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				done()
			})
		})

		it('should call the callback when no plugins and no other dependencies found', function (done) {
			spyOn(pm, '_loadPlugins').and.callThrough()
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm.loadAllPlugins([], [], function () {
				expect(pm._loadPlugins).not.toHaveBeenCalled()
				expect(pm.loadOtherDependencies).not.toHaveBeenCalled()
				expect(pm.loadPlugin).not.toHaveBeenCalled()
				done()
			})
		})
	})

	describe('_loadPlugins method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		var plugins = [
			{ 'id': 'org.ekstep.seven', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.six', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.five', 'ver': '1.0', 'type': 'plugin' }
		]

		var otherDependencies = [
			{ 'id': 'org.ekstep.four', 'type': 'plugin', 'plugin': 'org.ekstep.four', 'ver': '1.0', 'src': 'base/test_framework/data/content-plugins/org.ekstep.four-1.0/renderer/four.js' },
			{ 'id': 'org.ekstep.external', 'type': 'js', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.js' },
			{ 'id': 'org.ekstep.external', 'type': 'css', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.css' }
		]

		it('should load only plugins', function (done) {
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()

			pm._loadPlugins(plugins, undefined, function () {
				expect(pm.loadOtherDependencies).toHaveBeenCalled()
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.five')).toBe(true)
				expect(pm.loadPluginWithDependencies).toHaveBeenCalled()
				done()
			})
		})

		it('should not load only other dependencies', function () {
			var spyFn = jasmine.createSpy()
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPluginWithDependencies').and.callThrough()

			pm._loadPlugins([], otherDependencies, spyFn)
			expect(spyFn).not.toHaveBeenCalled()
			expect(pm.loadOtherDependencies).not.toHaveBeenCalled()
			expect(pm.isPluginDefined('org.ekstep.four')).toBe(false)
			expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled()
		})

		it('should load plugins and other dependencies', function (done) {
			spyOn(pm, 'loadOtherDependencies').and.callThrough()
			spyOn(pm, 'loadPlugin').and.callThrough()

			pm._loadPlugins(plugins, otherDependencies, function () {
				expect(pm.loadOtherDependencies).toHaveBeenCalled()
				expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.six')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.five')).toBe(true)
				expect(pm.isPluginDefined('org.ekstep.four')).toBe(true)
				expect(pm.loadPlugin).not.toHaveBeenCalled()
				done()
			})
		})
	})

	describe('loadOtherDependencies method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		var otherDependencies = [
			{ 'id': 'org.ekstep.four', 'type': 'plugin', 'plugin': 'org.ekstep.four', 'ver': '1.0', 'src': 'base/test_framework/data/content-plugins/org.ekstep.four-1.0/renderer/four.js' },
			{ 'id': 'org.ekstep.external', 'type': 'js', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.js' },
			{ 'id': 'org.ekstep.external', 'type': 'css', 'src': 'base/test_framework/data/content-plugins/org.ekstep.seven-1.0/renderer/libs/spectrum.css' }
		]

		it('should load dependencies type: plugin, js, css ', function (done) {
			spyOn(rm, 'loadExternalResource').and.callThrough()
			spyOn(pm, 'loadCustomPlugin').and.callThrough()

			pm.loadOtherDependencies(otherDependencies, function () {
				expect(rm.loadExternalResource.calls.count()).toBe(2)
				expect(pm.loadCustomPlugin.calls.count()).toBe(1)
				done()
			})
		})

		it('should call the callback when dependencies is empty', function (done) {
			spyOn(rm, 'loadExternalResource').and.callThrough()
			spyOn(pm, 'loadCustomPlugin').and.callThrough()

			pm.loadOtherDependencies([], function () {
				expect(rm.loadExternalResource.calls.count()).toBe(0)
				expect(pm.loadCustomPlugin.calls.count()).toBe(0)
				done()
			})
		})
	})

	describe('invoke method', function () {
		var plugin = { id: 'org.ekstep.test', version: '1.0' }
		var testPlugin = Class.extend({
			init: function () {},
			initPlugin: function () {}
		})

		afterEach(function () {
			pm.cleanUp()
		})

		it('should create new instance for registered plugin', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, testPlugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var instance = pm.invoke(plugin.id, {}, {}, undefined)
			expect(instance).toBeDefined()
			expect(pm.addPluginInstance).toHaveBeenCalled()
			expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should not create plugin instance when there is an error', function () {
			var instance; var __plugin = Class.extend({
				init: function () {},
				initPlugin: function () {
					throw new Error('') // added purposefully to fail.
				}
			})
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			spyOn(tm,'error')
			pm._registerPlugin(plugin.id, plugin.version, __plugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var throwableFn = function () {
				instance = pm.invoke(plugin.id, {}, {}, undefined)
			}
			expect(throwableFn).toThrow('Error: when instantiating plugin: ' + plugin.id)
			expect(pm.addPluginInstance).toHaveBeenCalled()
			expect(tm.error).toHaveBeenCalled()
			expect(instance).not.toBeDefined()
			expect(em.dispatchEvent).not.toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).not.toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should not create new instance for un-registered plugin', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			spyOn(tm,'error')
			var instance = pm.invoke(plugin.id, {}, {}, undefined)
			expect(instance).not.toBeDefined()
			expect(pm.addPluginInstance).not.toHaveBeenCalled()
			expect(tm.error).toHaveBeenCalled()
			expect(em.dispatchEvent).not.toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).not.toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should create multiple instance if data is Array', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, testPlugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var instance = pm.invoke(plugin.id, [{}, {}], {}, undefined)
			expect(instance).toBeDefined()
			expect(pm.addPluginInstance.calls.count()).toBe(2)
			expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should extend the overridden class when instantiating', function () {
			var __plugin = new (Class.extend({
				init: function () {},
				initPlugin: function () {},
				getType: function () {
					return 'overriding base method'
				}
			}))()
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, testPlugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var instance = pm.invoke(plugin.id, {}, {}, __plugin)
			expect(instance).toBeDefined()
			expect(instance.getType()).toEqual('overriding base method')
			expect(pm.addPluginInstance).toHaveBeenCalled()
			expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).toHaveBeenCalledWith(plugin.id + ':add')
		})
	})

	describe('invokeRenderer method', function () {
		var plugin = { id: 'org.ekstep.test', version: '1.0' }
		var testPlugin = Class.extend({
			init: function () {},
			initPlugin: function () {}
		})

		afterEach(function () {
			pm.cleanUp()
		})

		it('should create new instance for registered plugin', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, testPlugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var instance = pm.invokeRenderer(plugin.id, {}, {}, {}, {})
			expect(instance).toBeDefined()
			expect(pm.addPluginInstance).toHaveBeenCalled()
			expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).toHaveBeenCalledWith(plugin.id + ':add')
		})

		xit('should not create plugin instance when there is an error', function () { // can't be tested
			var instance; var __plugin = Class.extend({
				init: function () {}
			})
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, __plugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var throwableFn = function () {
				instance = pm.invokeRenderer(plugin.id, {}, {}, {}, {})
			}
			expect(throwableFn).toThrow('Error: when instantiating plugin: ' + plugin.id)
			expect(pm.addPluginInstance).toHaveBeenCalled()
			expect(instance).not.toBeDefined()
			expect(em.dispatchEvent).not.toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).not.toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should not create new instance for un-registered plugin', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			spyOn(tm, 'error')
			var instance = pm.invokeRenderer(plugin.id, {}, {}, {}, {})
			expect(instance).not.toBeDefined()
			expect(pm.addPluginInstance).not.toHaveBeenCalled()
			expect(tm.error).toHaveBeenCalled()
			expect(em.dispatchEvent).not.toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).not.toHaveBeenCalledWith(plugin.id + ':add')
		})

		it('should create multiple instance if data is Array', function () {
			spyOn(pm, 'addPluginInstance')
			spyOn(em, 'dispatchEvent')
			pm._registerPlugin(plugin.id, plugin.version, testPlugin, { id: plugin.id, ver: plugin.version }, publishedRepo)
			var instance = pm.invokeRenderer(plugin.id, [{}, {}], {}, {}, {})
			expect(instance).toBeDefined()
			expect(pm.addPluginInstance.calls.count()).toBe(2)
			expect(em.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: plugin.id, version: plugin.version }))
			expect(em.dispatchEvent).toHaveBeenCalledWith(plugin.id + ':add')
		})
	})

	describe('addPluginInstance method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should add plugin instance', function () {
			var plugin = { id: 'org.ekstep.test123' }
			pm.addPluginInstance(plugin)
			expect(pm.pluginInstances[plugin.id]).toBeDefined()
		})
	})

	describe('removePluginInstance method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should remove plugin instance', function () {
			var spyFn = jasmine.createSpy()
			var plugin = { id: 'org.ekstep.test123', remove: spyFn }
			pm.removePluginInstance(plugin)
			expect(spyFn).toHaveBeenCalled()
		})
	})

	describe('getPluginInstance method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should get single plugin instance', function () {
			pm.pluginInstances['org.ekstep.testPlugin'] = {}
			expect(pm.getPluginInstance('org.ekstep.testPlugin')).toBeDefined()
		})
	})

	describe('getPluginInstances method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return all plugin instance', function () {
			pm.pluginInstances['org.ekstep.testPlugin'] = {}
			pm.pluginInstances['org.ekstep.testPlugin1'] = {}
			expect(pm.getPluginInstances()).toEqual(jasmine.objectContaining({ 'org.ekstep.testPlugin': {}, 'org.ekstep.testPlugin1': {} }))
		})
	})

	describe('getPluginManifest method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return plugin manifest', function () {
			pm.plugins['org.ekstep.tester'] = { p: {}, m: { id: 'org.ekstep.tester' } }
			expect(pm.getPluginManifest('org.ekstep.tester').id).toBe('org.ekstep.tester')
		})

		it('should not return plugin manifest, if id is undefined', function () {
			expect(pm.getPluginManifest()).not.toBeDefined()
		})
	})

	describe('getErrors method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return error array', function () {
			pm.errors = ['error text']
			expect(pm.getErrors()).toEqual(['error text'])
		})
	})

	describe('getErrors method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return error array', function () {
			pm.errors = ['error text']
			expect(pm.getErrors()).toEqual(['error text'])
		})
	})

	describe('getPlugins method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return list of plugins registered', function () {
			pm.plugins = { 'org.ekstep.p1': {}, 'org.ekstep.p2': {} }
			expect(pm.getPlugins()).toEqual(['org.ekstep.p1', 'org.ekstep.p2'])
		})
	})

	describe('getPluginType method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return plugin type (manifest id) for given plugin instance ID', function () {
			var spyFn = jasmine.createSpy()
			pm.pluginInstances['123124-123123-123-123'] = { getType: spyFn }
			pm.getPluginType('123124-123123-123-123')
			expect(spyFn).toHaveBeenCalled()
		})

		it('should return empth string if plugin instance ID is undefined', function () {
			expect(pm.getPluginType()).toBe('')
		})
	})

	describe('loadPluginResource method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should load plugin is it not registered', function () {
			spyOn(rm, 'getResource')
			pm.plugins['org.ekstep.a1'] = { repo: publishedRepo }
			pm.loadPluginResource('org.ekstep.a1', '1.0', 'path/to/plugin', 'plugin', function () {})
			expect(rm.getResource).toHaveBeenCalledWith('org.ekstep.a1', '1.0', 'path/to/plugin', 'plugin', publishedRepo, jasmine.any(Function))
		})

		it('should not load plugin if it is not registered', function () {
			var spyFn = jasmine.createSpy()
			spyOn(rm, 'getResource')
			pm.loadPluginResource('org.ekstep.a1', '1.0', 'path/to/plugin', 'plugin', spyFn)
			expect(rm.getResource).not.toHaveBeenCalledWith('org.ekstep.a1', '1.0', 'path/to/plugin', 'plugin', publishedRepo, jasmine.any(Function))
			expect(spyFn).toHaveBeenCalledWith(new Error('unable load plugin resource path/to/plugin'), undefined)
		})
	})

	describe('getPluginVersion method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return plugin version', function () {
			var spyFn = jasmine.createSpy()
			pm.pluginInstances['123124-123123-123-123'] = { getVersion: spyFn }
			pm.getPluginVersion('123124-123123-123-123')
			expect(spyFn).toHaveBeenCalled()
		})

		it('should not return plugin version, if plugin ID is undefined', function () {
			expect(pm.getPluginVersion()).toBe('')
		})
	})

	describe('resolvePluginResource method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return absolute path of plugin', function () {
			pm._registerPlugin('org.ekstep.seven', '1.0', Class.extend({ init: function () {} }), {}, publishedRepo)
			expect(pm.resolvePluginResource('org.ekstep.seven', '1.0', 'editor/libs/spectrum.js')).toContain('test_framework/data/content-plugins/org.ekstep.seven-1.0/editor/libs/spectrum.js')
		})

		it('should return false for un-registered plugins', function () {
			expect(pm.resolvePluginResource('org.ekstep.p5', '1.0', 'editor/libs/spectrum.js')).toBe(false)
		})
	})

	describe('isManifestDefined method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return true if manifest is defined for registered plugin', function () {
			pm._registerPlugin('org.ekstep.seven', '1.0', Class.extend({ init: function () {} }), { id: 'org.ekstep.seven' }, publishedRepo)
			expect(pm.isManifestDefined('org.ekstep.seven')).toBe(true)
		})

		it('should return false for un-registered plugin', function () {
			expect(pm.isManifestDefined('org.ekstep.seven')).toBe(false)
		})
	})

	describe('isPluginDefined method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should return true if plugin is defined for registered plugin', function () {
			pm._registerPlugin('org.ekstep.seven', '1.0', Class.extend({ init: function () {} }), { id: 'org.ekstep.seven' }, publishedRepo)
			expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
		})

		it('should return false for un-registered plugin', function () {
			expect(pm.isPluginDefined('org.ekstep.seven')).toBe(false)
		})
	})

	describe('loadAndInitPlugin method', function () {
		afterEach(function () {
			pm.cleanUp()
		})

		it('should load the plugin', function () {
			pm.loadAndInitPlugin('org.ekstep.seven', '1.0', '', '')
			expect(pm.isPluginDefined('org.ekstep.seven')).toBe(false)
			pm._registerPlugin('org.ekstep.seven', '1.0', Class.extend({ init: function () {} }), { id: 'org.ekstep.seven' }, publishedRepo)
			pm.loadAndInitPlugin('org.ekstep.seven', '1.0', '', '')
			expect(pm.isPluginDefined('org.ekstep.seven')).toBe(true)
		})
	})
})
