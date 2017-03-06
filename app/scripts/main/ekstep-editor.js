/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
window.fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return window.fabric.util.object.extend(toObject.call(this), {
            meta: this.meta
        });
    };
})(window.fabric.Object.prototype.toObject);

var ekstep_editor = function() {};
ekstep_editor.prototype.jQuery = window.$;
ekstep_editor.prototype._ = window._;
var editor = new ekstep_editor();
window.EkstepEditor = editor;

EkstepEditor.relativeURL = function(pluginId, pluginVer, src) {
    return EkstepEditor.config.pluginRepo + '/' + pluginId + '-' + pluginVer + '/' + src;
}

EkstepEditor.init = function(userSettings, absURL, callback) {
    var startTime = (new Date()).getTime();
    EkstepEditor.config.absURL = EkstepEditorAPI.absURL = absURL;
    EkstepEditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins.js?" + EkstepEditor.config.build_number + "'>"));
    EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function () {
        callback();
        EkstepEditor.telemetryService.startEvent().append("loadtimes", { plugins: ((new Date()).getTime() - startTime) });
    });
}

EkstepEditor.loadBaseConfigManifest = function (cb) {
    EkstepEditor.resourceManager.loadResource(EkstepEditor.config.baseConfigManifest, 'json', function(err, data) {
        EkstepEditor.baseConfigManifest = [];
        if (err) {
            console.log('Unable to load baseConfigManifest');
        } else {
            EkstepEditor.baseConfigManifest = data;
        }
        cb(EkstepEditor.baseConfigManifest)
    });
}