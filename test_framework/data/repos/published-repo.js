/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
org.ekstep.pluginframework.publishedRepo = new (org.ekstep.pluginframework.iRepo.extend({
	id: 'published',
	discoverManifest: function (pluginId, pluginVer, callback, publishedTime) {
		var instance = this
		// eslint-disable-next-line
		org.ekstep.pluginframework.resourceManager.loadResource(this.resolveResource(pluginId, pluginVer, 'manifest.json'), 'json', function (err, response) {
			callback(undefined, { 'manifest': response, 'repo': instance })
		}, publishedTime)
	},
	resolveResource: function (id, ver, resource) {
		return org.ekstep.pluginframework.config.pluginRepo + '/' + id + '-' + ver + '/' + resource
	}
}))()
// org.ekstep.pluginframework.resourceManager.addRepo(org.ekstep.pluginframework.publishedRepo);
