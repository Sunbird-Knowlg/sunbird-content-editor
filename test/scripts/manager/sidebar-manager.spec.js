'use strict'

describe('sidebar manager', function () {
	beforeAll(function (done) {
		org.ekstep.pluginframework.config.pluginRepo = 'base/test/data/published'
		org.ekstep.contenteditor.sidebarManager.sidebarMenu = []
		org.ekstep.contenteditor.sidebarManager.initialize({ loadNgModules: function () {}, scope: { refreshSidebar: function () {}, addToSidebar: function () {} } })
		spyOn(org.ekstep.contenteditor.sidebarManager, 'registerSidebarMenu').and.callThrough()
		spyOn(org.ekstep.contenteditor.sidebarManager, 'loadSidebar').and.callThrough()
		spyOn(org.ekstep.contenteditor.sidebarManager, 'loadCustomTemplate').and.callThrough()
		spyOn(org.ekstep.contenteditor.sidebarManager, 'loadNgModules').and.returnValue({ then: function (cb1, cb2) {} })
		org.ekstep.pluginframework.pluginManager.loadPlugin('org.ekstep.test_config', '1.0', function () {
			done()
		})
	})

	it('should register the sidebar menu', function () {
		expect(org.ekstep.contenteditor.sidebarManager.registerSidebarMenu.calls.count()).toEqual(1)
		expect(org.ekstep.contenteditor.sidebarManager.loadSidebar.calls.count()).toEqual(1)
		expect(org.ekstep.contenteditor.sidebarManager.sidebarMenu.length).toEqual(1)
		expect(EventBus.hasEventListener('sidebar:settings')).toBe(true)
	})

	it('should load custom template', function () {
		var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.test_config')
		_.forEach(manifest.editor.configManifest, function (config) {
			if (config.type === 'custom_template') {
				expect(config.template).toBeDefined()
			}
		})
		expect(org.ekstep.contenteditor.sidebarManager.loadNgModules.calls.count()).toEqual(3)
	})

	it('should update the sidebar menu', function () {
		org.ekstep.contenteditor.sidebarManager.updateSidebarMenu({ id: 'settings', 'state': 'HIDDEN' })
		expect(org.ekstep.contenteditor.sidebarManager.getSidebarMenu()[0].state).toBe('HIDDEN')
	})
})
