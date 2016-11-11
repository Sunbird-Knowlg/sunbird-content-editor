window.fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return window.fabric.util.object.extend(toObject.call(this), {
            meta: this.meta
        });
    };
})(window.fabric.Object.prototype.toObject);

var ekstep_editor = function() {};
ekstep_editor.prototype.jQuery = function() {
    return window.$;
}();
var editor = new ekstep_editor();
window.EkstepEditor = editor;

EkstepEditor.config = {
    defaultSettings: 'config/editorSettings.json',
    pluginRepo: '/plugins',
    corePlugins: ["text", "audio", "div", "hotspot", "image", "shape", "scribble", "htext"]
}

EkstepEditor.loadResource = function(url, dataType, callback) {
    EkstepEditor.jQuery.ajax({
        async: false,
        url: url,
        dataType: dataType
    }).fail(function(err) {
        callback(err)
    }).done(function(data) {
        callback(null, data);
    });
}

EkstepEditor.loadPluginResource = function(pluginId, pluginVer, src, dataType, callback) {
    // TODO: Enhance to use plugin version too
    EkstepEditor.loadResource(EkstepEditor.config.pluginRepo + '/' + pluginId + '-' + pluginVer + '/' + src, dataType, callback);
}

EkstepEditor.relativeURL = function(pluginId, pluginVer, src) {
    return EkstepEditor.config.pluginRepo + '/' + pluginId + '-' + pluginVer + '/' + src;
}

EkstepEditor.loadExternalResource = function(type, pluginId, pluginVer, src) {
    var url = EkstepEditor.config.pluginRepo + '/' + pluginId + '-' + pluginVer + '/' + src;
    switch (type) {
        case 'js':
            EkstepEditor.jQuery("head").append($("<script type='text/javascript' src=" + url + ">"));
            break;
        case 'css':
            EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            break;
        default:
    }
}

EkstepEditor.init = function(userSettings, absURL) {
    EkstepEditor.config.absURL = absURL;
    EkstepEditor.loadResource(EkstepEditor.config.defaultSettings, 'json', function(err, data) {
        if (err) {
            alert('Unable to load editor - could not load editor settings');
        } else {
            _.forIn(data.plugins, function(value, key) {
                EkstepEditor.pluginManager.loadPlugin(key, value);
            });
        }
    });
}
