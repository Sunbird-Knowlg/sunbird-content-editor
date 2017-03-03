/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.publishedRepo = new(EkstepEditor.iRepo.extend({
    id: "published",
    basePath: EkstepEditor.config.pluginRepo,
    discoverManifest: function(pluginId, pluginVer, callback) {
        var instance = this;
        EkstepEditor.resourceManager.loadResource(this.resolveResource(pluginId, pluginVer, "manifest.json"), "json", function(err, response) {
            callback(undefined, { "manifest": response, "repo": instance });
        });
    },
    resolveResource: function(id, ver, resource) {
        return this.basePath + "/" + id + "-" + ver + "/" + resource;
    }
}));
