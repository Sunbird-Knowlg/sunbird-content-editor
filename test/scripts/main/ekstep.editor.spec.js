describe('Ekstep Editor', function () {
	it('should init editor', function () {
		var context = { contentId: 'do_123123123123', uid: 346 }
		var config = { apislug: true, baseURL: true, absURL: true }
		var $scope = {}
		spyOn(org.ekstep.contenteditor.toolbarManager, 'setScope')
		spyOn(org.ekstep.contenteditor, '_mergeConfig')
		spyOn(org.ekstep.contenteditor, '_loadDefaultPlugins')

		org.ekstep.contenteditor.init(context, config, $scope, undefined, function () {})

		expect(org.ekstep.contenteditor.globalContext).toEqual(context)
		expect(org.ekstep.contenteditor.globalContext).toEqual(context)
		expect(org.ekstep.contenteditor.toolbarManager.setScope).toHaveBeenCalledWith($scope)
		expect(org.ekstep.contenteditor._mergeConfig).toHaveBeenCalledWith(config)
		expect(org.ekstep.contenteditor._loadDefaultPlugins).toHaveBeenCalledWith(context, jasmine.any(Function))
	})

	it('should load default plugins', function () {
		var context = {contentId: 'do_123123123123', uid: 346}
		spyOn(org.ekstep.pluginframework.pluginManager, 'loadAllPlugins')
		org.ekstep.contenteditor._loadDefaultPlugins(context, function () {})
		expect(org.ekstep.pluginframework.pluginManager.loadAllPlugins).toHaveBeenCalledWith(org.ekstep.contenteditor.config.plugins, undefined, jasmine.any(Function))
	})
})
