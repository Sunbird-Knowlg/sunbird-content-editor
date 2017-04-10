/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */

org.ekstep.contenteditor.init = function(context, config, $scope, $document, callback) {
    org.ekstep.contenteditor._mergeConfig(config);
    org.ekstep.contenteditor._initServices();
    org.ekstep.contenteditor.globalContext = context;
    org.ekstep.contenteditor.toolbarManager.setScope($scope);
    org.ekstep.pluginframework.keyboardManager.initialize($document);
    org.ekstep.contenteditor._loadDefaultPlugins(context, callback);
    org.ekstep.contenteditor._backwardCompatibility();
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
    org.ekstep.pluginframework.config = {
        pluginRepo: org.ekstep.contenteditor.config.pluginRepo,
        draftRepo: org.ekstep.contenteditor.config.pluginRepo,
        build_number: org.ekstep.contenteditor.config.build_number
    }
    org.ekstep.pluginframework.resourceManager.initialize(org.ekstep.contenteditor.jQuery);
    org.ekstep.pluginframework.hostRepo.checkConnection();
}

org.ekstep.contenteditor._mergeConfig = function(config) {
    config = config || {};
    org.ekstep.contenteditor.config = _.assign(org.ekstep.contenteditor.config, config);
}

org.ekstep.contenteditor._loadDefaultPlugins = function(context, callback) {
    var startTime = (new Date()).getTime();
    if(org.ekstep.contenteditor.config.corePluginsPackaged === true) org.ekstep.contenteditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins.js?" + org.ekstep.contenteditor.config.build_number + "'>"));
    org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, function () {
        org.ekstep.services.telemetryService.initialize({
            uid: context.uid,
            sid: context.sid,
            content_id: context.contentId
        }, org.ekstep.contenteditor.config.dispatcher);
        callback();
        org.ekstep.services.telemetryService.startEvent().append("loadtimes", { plugins: ((new Date()).getTime() - startTime) });
    });
}