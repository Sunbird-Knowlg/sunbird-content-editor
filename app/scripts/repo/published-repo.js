/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.publishedRepo = new(Class.extend({
    id: "published",
    url: EkstepEditor.config.pluginRepo,
    getManifest: function(pluginId, pluginVer, callback) {
        var instance = this;
        EkstepEditor.resourceManager.getResource(pluginId, pluginVer, "manifest.json", "json", this, function(err, response) {
            callback(undefined, { "manifest": response, "repo": instance });
        });
    }
}));
