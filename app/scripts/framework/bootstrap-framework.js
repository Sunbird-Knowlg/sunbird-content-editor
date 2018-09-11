/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

// Declare Namespace
window.org = { ekstep: {} }
// eslint-disable-next-line
var plugin_framework = function () {}
plugin_framework.prototype.initialize = function (config) {
	config = config || {}
	// eslint-disable-next-line
	org.ekstep.pluginframework.config = org.ekstep.pluginframework.config || {}
	// eslint-disable-next-line
	if (!config.env) throw 'Framework should be initialized with environment!'
	org.ekstep.pluginframework.env = config.env
	org.ekstep.pluginframework.jQuery = config.jQuery || window.$
	org.ekstep.pluginframework.async = config.async || window.async
	org.ekstep.pluginframework.config.build_number = config.build_number || 'BUILD_NUMBER'
	org.ekstep.pluginframework.config.pluginRepo = config.pluginRepo || '/content-plugins'
}
// eslint-disable-next-line
window.org.ekstep.pluginframework = new plugin_framework()
// eslint-disable-next-line
plugin_framework = undefined
// eslint-disable-next-line
var services_framework = function () {}
// eslint-disable-next-line
window.org.ekstep.services = new services_framework()
// eslint-disable-next-line
services_framework = undefined
