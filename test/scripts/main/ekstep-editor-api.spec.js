describe('Ekstep editor test', function () {
	beforeAll(function (done) {
		org.ekstep.pluginframework.pluginManager.cleanUp()
		org.ekstep.contenteditor.stageManager.cleanUp()
		org.ekstep.contenteditor.toolbarManager.cleanUp()

		var corePlugins = [
			{ 'id': 'org.ekstep.stage', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.utils', 'ver': '1.0', 'type': 'plugin' }
		]

		// test plugins
		org.ekstep.contenteditor.config.plugins = [
			{ 'id': 'org.ekstep.test1', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.test2', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.test3', 'ver': '1.0', 'type': 'plugin' }
		]

		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}

		org.ekstep.pluginframework.initialize({
			env: 'editor',
			pluginRepo: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins',
			build_number: undefined
		})

		org.ekstep.pluginframework.pluginManager.loadAllPlugins(corePlugins, undefined, function () {
			org.ekstep.pluginframework.config.pluginRepo = 'base/test/data/published'
			done()
		})

		org.ekstep.contenteditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: '#FFFFFF', preserveObjectStacking: true, width: 720, height: 405 })
		org.ekstep.contenteditor.stageManager.registerEvents()
	})

	afterAll(function () {
		org.ekstep.pluginframework.pluginManager.cleanUp()
		org.ekstep.contenteditor.stageManager.cleanUp()
	})

	it('should load plugin', function () {
		spyOn(org.ekstep.pluginframework.pluginManager, 'loadPluginWithDependencies').and.callThrough()
		org.ekstep.contenteditor.api.loadPlugin('org.ekstep.test1', '1.0', function () {})
		expect(org.ekstep.pluginframework.pluginManager.loadPluginWithDependencies).toHaveBeenCalledWith('org.ekstep.test1', '1.0', 'plugin', undefined, ['org.ekstep.test1'], jasmine.any(Function))
	})

	it('should get plugin repo', function () {
		spyOn(org.ekstep.contenteditor.api, 'getPluginRepo').and.callThrough()
		var returnValue = org.ekstep.contenteditor.api.getPluginRepo()
		expect(returnValue).toBe(org.ekstep.contenteditor.config.pluginRepo)
		expect(org.ekstep.contenteditor.api.getPluginRepo).toHaveBeenCalled()
	})

	xit('should call loadAndInitPlugin', function () {
		spyOn(org.ekstep.contenteditor.api, 'loadAndInitPlugin').and.callThrough()
		spyOn(org.ekstep.pluginframework.pluginManager, 'loadAndInitPlugin').and.callThrough()
		org.ekstep.contenteditor.api.loadAndInitPlugin('org.ekstep.test1', '1.0')
		var returnValue = org.ekstep.pluginframework.pluginManager.loadAndInitPlugin('rg.ekstep.test1-1.0')
		expect(returnValue).toBe(1)
		expect(org.ekstep.contenteditor.api.loadAndInitPlugin).toHaveBeenCalled()
		expect(org.ekstep.pluginframework.pluginManager.loadAndInitPlugin).toHaveBeenCalled()
	})

	it('should load help for plugin', function (done) {
		spyOn(org.ekstep.contenteditor.api, 'loadPluginResource').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.contenteditor.api.loadPluginResource('org.ekstep.test2', '1.0', 'editor/help.md', 'text', function (err, res) {
			done()
		})
	})

	it('should return canvas for rendering on the editor', function () {
		spyOn(org.ekstep.contenteditor.api, 'getCanvas').and.callThrough()
		var returnValue = org.ekstep.contenteditor.api.getCanvas()
		expect(org.ekstep.contenteditor.api.getCanvas).toHaveBeenCalled()
		expect(returnValue).toBeDefined()
	})

	it('should return respective services', function () {
		spyOn(org.ekstep.contenteditor.api, 'getService').and.callThrough()
		expect(org.ekstep.contenteditor.api.getService('popup')).toBe(org.ekstep.services.popupService)
		expect(org.ekstep.contenteditor.api.getService('content')).toBe(org.ekstep.services.contentService)
		expect(org.ekstep.contenteditor.api.getService('assessment')).toBe(org.ekstep.services.assessmentService)
		expect(org.ekstep.contenteditor.api.getService('language')).toBe(org.ekstep.services.languageService)
		expect(org.ekstep.contenteditor.api.getService('search')).toBe(org.ekstep.services.searchService)
		expect(org.ekstep.contenteditor.api.getService('meta')).toBe(org.ekstep.services.metaService)
		expect(org.ekstep.contenteditor.api.getService('asset')).toBe(org.ekstep.services.assetService)
		expect(org.ekstep.contenteditor.api.getService('telemetry')).toBe(org.ekstep.services.telemetryService)
	})

	it('should call updateContextMenu', function () {
		spyOn(org.ekstep.contenteditor.api, 'updateContextMenus').and.callThrough()
		org.ekstep.contenteditor.api.updateContextMenus([{ id: 'paste', state: 'SHOW', data: {} }])
		expect(org.ekstep.contenteditor.api.updateContextMenus).toHaveBeenCalled()
		expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems.length).toEqual(5)
		expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems[0].id).toBe('copy')
	})

	it('should set contentid in config ', function () {
		spyOn(org.ekstep.contenteditor.api, 'setConfig').and.callThrough()
		org.ekstep.contenteditor.api.setConfig('contentId', 'do_1122069161408757761139')
		expect(org.ekstep.contenteditor.api.setConfig).toHaveBeenCalled()
	})

	it('should return all config values', function () {
		spyOn(org.ekstep.contenteditor.api, 'getAllConfig').and.callThrough()
		org.ekstep.contenteditor.api.setConfig('contentId', 'do_1122069161408757761139')
		var returnValue = org.ekstep.contenteditor.api.getAllConfig()
		expect(org.ekstep.contenteditor.api.getAllConfig).toHaveBeenCalled()
		expect(returnValue.contentId).toEqual('do_1122069161408757761139')
	})

	it('should return all global context values', function () {
		spyOn(org.ekstep.contenteditor.api, 'getAllContext').and.callThrough()
		org.ekstep.contenteditor.api.setContext('contentId', 'do_1122069161408757761139')
		var returnValue = org.ekstep.contenteditor.api.getAllContext()
		expect(org.ekstep.contenteditor.api.getAllContext).toHaveBeenCalled()
		expect(returnValue.contentId).toEqual('do_1122069161408757761139')
	})

	it('should remove event listener', function () {
		spyOn(org.ekstep.contenteditor.api, 'addEventListener').and.callThrough()
		spyOn(org.ekstep.contenteditor.api, 'removeEventListener').and.callThrough()
		org.ekstep.contenteditor.api.addEventListener('stage:delete', function () {}, undefined)
		org.ekstep.contenteditor.api.removeEventListener('stage:delete', function () {}, undefined)
		expect(org.ekstep.contenteditor.api.removeEventListener).toHaveBeenCalled()
		expect(org.ekstep.contenteditor.api.addEventListener).toHaveBeenCalled()
	})
})
