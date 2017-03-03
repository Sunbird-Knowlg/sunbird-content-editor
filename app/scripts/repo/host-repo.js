/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.hostRepo = new(EkstepEditor.iRepo.extend({
    id: "host",
    basePath: "https://localhost:8081",
    connected: false,
    init: function() {
        var instance = this;
        this.checkConnection(function(err, res) {
            if(!err) {
                instance.connected = true;
            }
        });
    },
    checkConnection: function(cb) {
        var instance = this;
        EkstepEditor.resourceManager.loadResource(this.basePath + "/list", "json", cb);
    },
    discoverManifest: function(pluginId, pluginVer, callback) {
        if(this.connected) {
            var instance = this;
            EkstepEditor.resourceManager.loadResource(this.resolveResource(pluginId, pluginVer, "manifest.json"), "json", function(err, response) {
                callback(undefined, { "manifest": response, "repo": instance });
            });
        } else {
            callback(undefined, { "manifest": undefined, "repo": undefined });
        }
    },
    resolveResource: function(pluginId, pluginVer, resource) {
        return this.basePath + "/" + pluginId + "-" + pluginVer + "/" + resource;
    }
}));
