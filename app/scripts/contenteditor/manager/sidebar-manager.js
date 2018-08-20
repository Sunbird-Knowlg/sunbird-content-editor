org.ekstep.contenteditor.sidebarManager = new (Class.extend({
	loadNgModules: undefined,
	sidebarMenu: [],
	init: function () {
		this.setSidebarHeight()
	},
	initialize: function (config) {
		this.loadNgModules = config.loadNgModules
		this.scope = config.scope
	},
	registerSidebarMenu: function (menu, manifest) {
		var instance = this
		if (!_.isObject(_.find(this.sidebarMenu, { id: 'sidebar:' + menu.id }))) {
			menu.onclick = menu.onclick || { id: 'sidebar:' + menu.id }
			this.sidebarMenu.push(menu)
			this.loadSidebar(menu, manifest)
			ecEditor.addEventListener('sidebar:' + menu.id, function (event, data) {
				instance.showSidebarMenu(event.type.substring(event.type.indexOf(':') + 1))
			}, instance)
		}
	},
	loadSidebar: function (menu, manifest) {
		var instance = this
		menu.state = menu.state || 'SHOW'
		if (menu.templateURL) {
			menu.templateURL = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, menu.templateURL)
			instance.loadNgModules(menu.templateURL)

			if (menu.controllerURL) {
				menu.controllerURL = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, menu.controllerURL)
				instance.loadNgModules(undefined, menu.controllerURL)
					.then(function () {
						instance.scope.addToSidebar(menu)
					}, function () {
						throw new Error('unable to load controller :' + menu.controllerURL)
					})
			} else {
				instance.scope.addToSidebar(menu)
			}
		};
	},
	loadCustomTemplate: function (pluginId) {
		var instance = this
		var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(pluginId)
		manifest.editor.configManifest = manifest.editor.configManifest || []
		_.forEach(manifest.editor.configManifest, function (config) {
			if (config.type === 'custom_template') {
				if (config.controllerURL) {
					instance.loadNgModules(undefined, org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.controllerURL))
				}

				if (config.templateURL) {
					var path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.templateURL)
					org.ekstep.pluginframework.resourceManager.loadResource(path, 'HTML', function (err, data) {
						if (err) throw new Error('unable to load custom template')
						if (data) config.template = data
					})
				}
			}
		})
	},
	updateSidebarMenu: function (menu) {
		var menuObject = _.find(this.sidebarMenu, { id: menu.id })
		_.forIn(menu, function (value, key) {
			if (key !== 'id') menuObject[key] = value
		})
		this.scope.refreshSidebar()
	},
	getSidebarMenu: function () {
		return this.sidebarMenu
	},
	setSidebarHeight: function () {
		var newheight = $(window).innerHeight() - 212
		$('.sidebar-holder').css('height', newheight + 'px')
	},
	getCurrentMenu: function () {
		return this.scope.configCategory.selected
	},
	showSidebarMenu: function (sidebarMenuId) {
		if (sidebarMenuId) {
			var menu = _.find(this.sidebarMenu, function (menu) {
				return menu.id === sidebarMenuId
			})
			if (menu.state !== 'HIDE') this.scope.configCategory.selected = sidebarMenuId
			this.scope.refreshSidebar()
		}
	}
}))()
