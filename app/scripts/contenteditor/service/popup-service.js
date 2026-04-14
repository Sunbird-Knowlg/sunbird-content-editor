/**
 *
 * Popup service helps to show interactive popup modal/dialog window from plugin
 *
 * @class org.ekstep.services.popupService
 * @author Sunil A S <sunils@ilimi.in>
 */
org.ekstep.services.popupService = new (org.ekstep.services.iService.extend({
	loadModules: undefined,
	openModal: undefined,
	initService: function (loadModuleFn, openModalFn) {
		this.loadModules = loadModuleFn
		this.openModal = openModalFn
	},
	/**
     *
     * loads HTML template and angular module
     * @param templatePath {string} path to HTML template
     * @param controllerPath {string} path to angular module
     * @memberof org.ekstep.services.popupService
     */
	loadNgModules: function (templatePath, controllerPath, allowTemplateCache) {
		if (this.loadModules) return this.loadModules(templatePath, controllerPath, allowTemplateCache)
	},
	/**
     *
     * opens popup modal/dialog window
     * @param config {object} config object refers to ngDialog open method parameter. please refer [ngDialog docs]{@link https://github.com/likeastore/ngDialog#openoptions}
     * @param callback {function} pre close Callback
     * @memberof org.ekstep.services.popupService
     */
	open: function (config, callback) {
		/* istanbul ignore else */
		if (this.openModal) {
			this.openModal(config, callback)
			org.ekstep.services.telemetryService.interact({ 'type': 'show', 'subtype': 'open', 'target': 'popup', 'pluginid': '', 'pluginver': '', 'objectid': '', 'stage': ecEditor.getCurrentStage().id })
		}
	},
	close: function (str) {

		if(str) {
			const strLength = str.length;
			const updateStr = str + '_' + strLength;
			const newStr = updateStr + '_' + str;
			return newStr;
		} else {
			str = 'test';
			const newLength =  str.length;
			const updatedStr = str + '_' + newLength;
			return updatedStr;
		}
	}

}))()
