/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

org.ekstep.contenteditor.init = function(context, config, $scope, $document, callback) {
    org.ekstep.contenteditor._mergeConfig(config);
    org.ekstep.contenteditor._initServices();
    org.ekstep.contenteditor.globalContext = context;
    org.ekstep.contenteditor.toolbarManager.setScope($scope);
    org.ekstep.contenteditor._loadDefaultPlugins(context, callback);
    //org.ekstep.contenteditor._backwardCompatibility();
}

org.ekstep.contenteditor._backwardCompatibility = function() {
    /* Deprecated variables */
    EkstepEditorAPI.apislug = org.ekstep.contenteditor.config.apislug;
    EkstepEditorAPI.baseURL = org.ekstep.contenteditor.config.baseURL;
    EkstepEditorAPI.absURL = org.ekstep.contenteditor.config.absURL;
    EkstepEditorAPI.globalContext = org.ekstep.contenteditor.globalContext;
}

org.ekstep.contenteditor._initServices = function() {
    org.ekstep.services.config = {
        baseURL: org.ekstep.contenteditor.config.baseURL,
        apislug: org.ekstep.contenteditor.config.apislug
    }
    org.ekstep.pluginframework.initialize({
        env: 'editor',
        jQuery: org.ekstep.contenteditor.jQuery,
        pluginRepo: org.ekstep.contenteditor.config.pluginRepo,
        build_number: org.ekstep.contenteditor.config.build_number
    });
}

org.ekstep.contenteditor._mergeConfig = function(config) {
    config = config || {};
    org.ekstep.contenteditor.config = _.assign(org.ekstep.contenteditor.config, config);
}

org.ekstep.contenteditor._loadDefaultPlugins = function(context, callback) {
    var startTime = (new Date()).getTime();
    if (org.ekstep.contenteditor.config.corePluginsPackaged === true) org.ekstep.contenteditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins.js?" + org.ekstep.contenteditor.config.build_number + "'>"));
    org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, undefined, function() {
        org.ekstep.services.telemetryService.initialize({
            uid: context.uid,
            sid: context.sid,
            content_id: context.contentId
        }, org.ekstep.contenteditor.config.dispatcher);
        callback();
        org.ekstep.services.telemetryService.startEvent().append("loadtimes", { plugins: ((new Date()).getTime() - startTime) });
    });
}

// Prepare context and config data from url/parentwindow/window
// org.ekstep.contenteditor.window_context = {}
// org.ekstep.contenteditor.window_config = {}
// getWindowContext();
// getWindowConfig();
// 
org.ekstep.contenteditor.getWindowContext = function() {
    var context = org.ekstep.contenteditor.getParameterByName('context') || (window.parent ? window.parent.context : undefined) || window.context;
    org.ekstep.contenteditor.window_context = {
        uid: context.user.id,
        sid: context.sid,
        contentId: context.contentId
    }
    return org.ekstep.contenteditor.window_context;
}

org.ekstep.contenteditor.getWindowConfig = function() {
    var config = org.ekstep.contenteditor.getParameterByName('config') || (window.parent ? window.parent.config : undefined) || window.config;
    org.ekstep.contenteditor.window_config = {};
    if (config) {
        org.ekstep.contenteditor.window_config = {
            baseURL: config.baseURL,
            pluginRepo: config.pluginRepo,
            plugins: config.plugins,
            corePluginsPackaged: config.enableCorePlugin
        }
    }

    return org.ekstep.contenteditor.window_config;
}

org.ekstep.contenteditor.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
