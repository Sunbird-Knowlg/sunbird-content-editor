/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.draftRepo = new(Class.extend({
    id: "draft",
    url: "/content/snapshot/",
    getManifest: function(pluginId, pluginVer, callback) {
        var instance = this;
        EkstepEditor.resourceManager.getResource(pluginId, pluginVer, "manifest.json", "json", this, function(err, response) {
            callback(undefined, { "manifest": response, "repo": instance });
        });
    }
}));
