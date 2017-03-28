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

window.org = {
    
}

var ekstep_editor = function() {};
ekstep_editor.prototype.jQuery = window.$;
ekstep_editor.prototype._ = window._;
var editor = new ekstep_editor();
window.EkstepEditor = editor;

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

EkstepEditor.init = function(context, config, $scope, $document, callback) {
    EkstepEditorAPI.globalContext = context; // TODO: Deprecate after the April release
    EkstepEditor.globalContext = context;
    EkstepEditor.toolbarManager.setScope($scope);
    EkstepEditor.keyboardManager.initialize($document);
    EkstepEditor._mergeConfig(config);
    EkstepEditor._loadDefaultPlugins(context, callback);
}

EkstepEditor._mergeConfig = function(config) {
    config = config || {};
    EkstepEditor.config = _.assign(EkstepEditor.config, config);
}

EkstepEditor._loadDefaultPlugins = function(context, callback) {
    var startTime = (new Date()).getTime();
    if(EkstepEditor.config.corePluginsPackaged === true) EkstepEditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins.js?" + EkstepEditor.config.build_number + "'>"));
    EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function () {
        EkstepEditor.telemetryService.initialize({
            uid: context.uid,
            sid: context.sid,
            content_id: context.contentId
        }, EkstepEditor.config.dispatcher);
        callback();
        EkstepEditor.telemetryService.startEvent().append("loadtimes", { plugins: ((new Date()).getTime() - startTime) });
    });
}