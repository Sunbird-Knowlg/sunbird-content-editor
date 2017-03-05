/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.draftRepo = new(EkstepEditor.iRepo.extend({
    id: "draft",
    basePath: EkstepEditor.config.pluginRepo,
    discoverManifest: function(pluginId, pluginVer, callback, publishedTime) {
        var instance = this;
        EkstepEditor.resourceManager.loadResource(this.resolveResource(pluginId, pluginVer, "manifest.json"), "json", function(err, response) {
            callback(undefined, { "manifest": response, "repo": instance });
        }, publishedTime);
    },
    resolveResource: function(id, ver, resource) {
    	return this.basePath + "/" + id + "-snapshot" + "/" + resource;
    }
}));
