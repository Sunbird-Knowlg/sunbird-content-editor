/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

// Declare Namespace
window.org = { ekstep: {} }

var plugin_framework = function() {};
plugin_framework.prototype.initialize = function(config) {
    config = config || {};
    org.ekstep.pluginframework.config = org.ekstep.pluginframework.config || {};
    if (!config.env) throw "Framework should be initialized with environment!";
    org.ekstep.pluginframework.env = config.env;
    org.ekstep.pluginframework.jQuery = config.jQuery || window.$;
    org.ekstep.pluginframework.async = config.async || window.async;
    org.ekstep.pluginframework.config.build_number = config.build_number || 'BUILD_NUMBER';
    org.ekstep.pluginframework.config.pluginRepo = config.pluginRepo || '/content-plugins';
};

window.org.ekstep.pluginframework = new plugin_framework();
plugin_framework = undefined;

var services_framework = function() {};
window.org.ekstep.services = new services_framework();
services_framework = undefined;