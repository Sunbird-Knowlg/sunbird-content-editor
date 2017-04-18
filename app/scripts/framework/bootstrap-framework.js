/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

// Declare Namespace
window.org = { ekstep: {} }

var plugin_framework = function() {};
plugin_framework.prototype.initialize = function(config) {
    config = config || {};
    org.ekstep.pluginframework.config = org.ekstep.pluginframework.config || {};
    org.ekstep.pluginframework.jQuery = config.jQuery || window.$;
    if (config.pluginRepo) org.ekstep.pluginframework.config.pluginRepo = config.pluginRepo;
    if (config.draftRepo) org.ekstep.pluginframework.config.draftRepo = config.draftRepo;
    if (config.build_number) org.ekstep.pluginframework.config.build_number = config.build_number;
    if (config.repos) {
    	config.repos.forEach(function(repo, index) {
    		org.ekstep.pluginframework.resourceManager.addRepo(repo, index);
    	});
    }
};

window.org.ekstep.pluginframework = new plugin_framework();
plugin_framework = undefined;

var services_framework = function() {};
window.org.ekstep.services = new services_framework();
services_framework = undefined;
