org.ekstep.contenteditor.headerManager = new (Class.extend({
	registeredHeaders: [],
	initialize: function (config) {
		this.loadNgModules = config.loadNgModules
		this.scope = config.scope
	},
	register: function (header, manifest) {
		this.registeredHeaders.push({ id: manifest.id, header: header })
		this.load(header, manifest)
	},
	load: function (header, manifest) {
		var instance = this
		if (header.templateURL) {
			header.templateURL = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, header.templateURL)
			instance.loadNgModules(header.templateURL)

			if (header.controllerURL) {
				header.controllerURL = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, header.controllerURL)
				instance.loadNgModules(undefined, header.controllerURL)
					.then(function () {
						instance.scope.addToHeader(header)
					}, function () {
						throw new Error('unable to load controller :' + header.controllerURL)
					})
			} else {
				instance.scope.addToHeader(header)
			}
		};
	}
}))()
