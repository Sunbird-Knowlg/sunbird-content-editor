/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.hostRepo = new(Class.extend({
    id: "host",
    url: "https://localhost:8081/",
    getManifest: function(pluginId, pluginVer, callback) {
        var instance = this;
        EkstepEditor.resourceManager.getResource(pluginId, pluginVer, "manifest.json", "json", this, function(err, response) {
            callback(undefined, { "manifest": response, "repo": instance });
        });
    }
}));
