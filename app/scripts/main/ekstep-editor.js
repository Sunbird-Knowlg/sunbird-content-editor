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

EkstepEditor.loadResource = function(url, dataType, callback) {
    EkstepEditor.jQuery.ajax({
        async: false,
        url: url + "?"+ EkstepEditor.config.build_number,
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
            EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + url + "?" + EkstepEditor.config.build_number + ">"));
            break;
        case 'css':
            EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "?" + EkstepEditor.config.build_number + "'>");
            break;
        default:
    }
}

EkstepEditor.init = function(userSettings, absURL, callback) {
    var startTime = (new Date()).getTime();
    EkstepEditor.config.absURL = EkstepEditorAPI.absURL = absURL;
    /*
    var q = async.queue(function(plugin, callback) {
        EkstepEditor.pluginManager.loadPlugin(plugin.key, plugin.value);
        callback();
    }, 4);

    // assign a callback
    q.drain = function() {
        callback();
        EkstepEditor.telemetryService.startEvent().append("loadtimes", {plugins: ((new Date()).getTime() - startTime)});
    };

    _.forIn(EkstepEditor.config.plugins, function(value, key) {
        q.push({"key": key, "value" : value}, function(err) {});
    });*/
    EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='styles/coreplugins.css?" + EkstepEditor.config.build_number + "'>");
    EkstepEditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins.js?" + EkstepEditor.config.build_number + "'>"));
    EkstepEditor.jQuery("body").append($("<script type='text/javascript' src='scripts/coreplugins-dependencies.js?" + EkstepEditor.config.build_number + "'>"));
    callback();
}

EkstepEditor.loadBaseConfigManifest = function (cb) {
    EkstepEditor.loadResource(EkstepEditor.config.baseConfigManifest, 'json', function(err, data) {
        EkstepEditor.baseConfigManifest = [];
        if (err) {
            console.log('Unable to load baseConfigManifest');
        } else {
            EkstepEditor.baseConfigManifest = data;
        }
        cb(EkstepEditor.baseConfigManifest)
    });
}
