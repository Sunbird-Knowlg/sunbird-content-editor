/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

org.ekstep.contenteditor.init = function (context, config, $scope, $document, callback) {
	org.ekstep.contenteditor._mergeConfig(config)
	org.ekstep.contenteditor._initServices()
	org.ekstep.contenteditor.globalContext = context
	org.ekstep.contenteditor.toolbarManager.setScope($scope)
	org.ekstep.contenteditor._loadDefaultPlugins(context, callback)
	// org.ekstep.contenteditor._backwardCompatibility();
}

org.ekstep.contenteditor._backwardCompatibility = function () {
	/* Deprecated variables */
	EkstepEditorAPI.apislug = org.ekstep.contenteditor.config.apislug
	EkstepEditorAPI.baseURL = org.ekstep.contenteditor.config.baseURL
	EkstepEditorAPI.absURL = org.ekstep.contenteditor.config.absURL
	EkstepEditorAPI.globalContext = org.ekstep.contenteditor.globalContext
}

org.ekstep.contenteditor._initServices = function () {
	org.ekstep.services.config = {
		baseURL: org.ekstep.contenteditor.config.baseURL,
		apislug: org.ekstep.contenteditor.config.apislug,
		searchCriteria: org.ekstep.contenteditor.config.searchCriteria || {}
	}
	org.ekstep.pluginframework.initialize({
		env: 'editor',
		jQuery: org.ekstep.contenteditor.jQuery,
		pluginRepo: org.ekstep.contenteditor.config.pluginRepo,
		build_number: org.ekstep.contenteditor.config.build_number
	})
}

org.ekstep.contenteditor._mergeConfig = function (config) {
	config = config || {}
	// Override default config
	org.ekstep.contenteditor.config = _.assign(org.ekstep.contenteditor.config, config)
	// Set non overridable config
	org.ekstep.contenteditor.config = _.assign(org.ekstep.contenteditor.config, org.ekstep.contenteditor.extendedConfig)
}

org.ekstep.contenteditor._loadDefaultPlugins = function (context, callback) {
	if (org.ekstep.contenteditor.config.corePluginsPackaged === true) org.ekstep.contenteditor.jQuery('body').append($("<script type='text/javascript' src='scripts/coreplugins.js?" + org.ekstep.contenteditor.config.build_number + "'>"))
	org.ekstep.pluginframework.eventManager.enableEvents = false
	org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, undefined, function () {
		org.ekstep.pluginframework.eventManager.enableEvents = true
		callback()
	})
}

// Prepare context and config data from url/parentwindow/window
// org.ekstep.contenteditor.window_context = {}
// org.ekstep.contenteditor.window_config = {}
// getWindowContext();
// getWindowConfig();
//
org.ekstep.contenteditor.getWindowContext = function () {
	return org.ekstep.contenteditor.getParameterByName('context') || (window.parent ? window.parent.context : undefined) || window.context || {}
}

org.ekstep.contenteditor.getWindowConfig = function () {
	return org.ekstep.contenteditor.getParameterByName('config') || (window.parent ? window.parent.config : undefined) || window.config || {}
}

org.ekstep.contenteditor.getParameterByName = function (name, url) {
	if (!url) url = window.location.href
	// eslint-disable-next-line
	name = name.replace(/[\[\]]/g, '\\$&')
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

	var results = regex.exec(url)
	if (!results) return undefined
	if (!results[2]) return undefined
	var value = decodeURIComponent(results[2].replace(/\+/g, ' '))
	return JSON.parse(value)
}
