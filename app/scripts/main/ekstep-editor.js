/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
/* istanbul ignore next. Fabric extension - cannot be tested */
window.fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return window.fabric.util.object.extend(toObject.call(this), {
            meta: this.meta
        });
    };
})(window.fabric.Object.prototype.toObject);

// Declare Namespace
window.org = {
    ekstep: {
    }
}

var content_editor = function() {};
content_editor.prototype.jQuery = window.$;
content_editor.prototype._ = window._;
window.org.ekstep.contenteditor = new content_editor();
content_editor = undefined;

var plugin_framework = function() {};
window.org.ekstep.pluginframework = new plugin_framework();
plugin_framework = undefined;

window.ServiceConstants = {
    SEARCH_SERVICE: "search",
    POPUP_SERVICE: "popup",
    CONTENT_SERVICE: "content",
    ASSESSMENT_SERVICE: "assessment",
    LANGUAGE_SERVICE: "language",
    META_SERVICE: "meta",
    ASSET_SERVICE: "asset",
    TELEMETRY_SERVICE: "telemetry"
}

window.ManagerConstants = {
    EVENT_MANAGER: "event",
    MEDIA_MANAGER: "media",
    PLUGIN_MANAGER: "plugin",
    RESOURCE_MANAGER: "resource",
    STAGE_MANAGER: "stage",
    TOOLBAR_MANAGER: "toolbar"
}

org.ekstep.contenteditor.init = function(context, config, $scope, $document, callback) {
    org.ekstep.contenteditor.api.globalContext = context; // TODO: Deprecate after the April release
    org.ekstep.contenteditor.globalContext = context;
    org.ekstep.contenteditor.toolbarManager.setScope($scope);
    org.ekstep.pluginframework.keyboardManager.initialize($document);
    org.ekstep.contenteditor._mergeConfig(config);
    org.ekstep.contenteditor._loadDefaultPlugins(context, callback);
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