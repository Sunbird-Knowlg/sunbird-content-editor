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

EkstepEditor.config = {
    baseURL: 'https://dev.ekstep.in',
    apislug: '/api',
    defaultSettings: 'config/editorSettings.json',
    pluginRepo: '/plugins',
    aws_s3_urls: ["https://s3.ap-southeast-1.amazonaws.com/ekstep-public/", "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/"],
    corePlugins: ["text", "audio", "div", "hotspot", "image", "shape", "scribble", "htext"],
    corePluginMapping: {
        "text": "org.ekstep.text", 
        "image": "org.ekstep.image", 
        "shape": "org.ekstep.shape",
        "stage": "org.ekstep.stage",
        "hotspot": "org.ekstep.hotspot",
        "scribble": "org.ekstep.scribblepad",
        "htext": "org.ekstep.htext",
        "audio": "org.ekstep.audio"
    },
    baseConfigManifest: "config/baseConfigManifest.json"
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
            EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + url + ">"));
            break;
        case 'css':
            EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            break;
        default:
    }
}

EkstepEditor.init = function(userSettings, absURL, callback) {
    EkstepEditor.config.absURL = absURL;
    EkstepEditor.loadResource(EkstepEditor.config.defaultSettings, 'json', function(err, data) {
        if (err) {
            alert('Unable to load editor - could not load editor settings');
        } else {
            var q = async.queue(function(plugin, callback) {
                EkstepEditor.pluginManager.loadPlugin(plugin.key, plugin.value);
                callback();
            }, 4);

            // assign a callback
            q.drain = function() {
                callback();
            };

            _.forIn(data.plugins, function(value, key) {
                q.push({"key": key, "value" : value}, function(err) {});
            });
        }
    });
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
