/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    repos: ["https://localhost:8081/", "/content/snapshot/", EkstepEditor.config.pluginRepo],
    loadManifest: function(pluginId, pluginVer, callback, reposLength) {
        var instance = this;
        if (_.isUndefined(reposLength)) {
            reposLength = this.repos.length-1;    
        }
        this.loadPluginResource(pluginId, pluginVer, "manifest.json", "json", function(err, response) {
            var result = {"manifest": response, "url": instance.repos[reposLength]}
            if (!err) {
                callback(err, result);
            } else if (err && reposLength > 0) {
                instance.loadManifest(pluginId, pluginVer, callback, --reposLength);
            } else if (err && reposLength <= 0) {
                callback(err, result);
            }
        }, this.repos[reposLength]);
    },
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback, resourceUrl) {
        // TODO: Enhance to use plugin version too
        var url = resourceUrl;
        if (!url) {
            url = EkstepEditor.config.pluginRepo;
        }
        EkstepEditor.loadResource(url + '/' + pluginId + '-' + pluginVer + '/' + src, dataType, callback);
    },
    loadExternalResource: function(type, pluginId, pluginVer, src, resourceUrl) {
        var url = resourceUrl;
        if (!url) {
            url = EkstepEditor.config.pluginRepo 
        }
        url = url+ '/' + pluginId + '-' + pluginVer + '/' + src;
        switch (type) {
            case 'js':
                EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + url + "?" + new Date().getTime() + ">"));
                break;
            case 'css':
                EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "?" + new Date().getTime() + "'>");
                break;
            default:
        }
    }
}));
