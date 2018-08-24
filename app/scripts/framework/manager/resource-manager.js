/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
org.ekstep.pluginframework.resourceManager = new (Class.extend({
	init: function () {},
	buildNumber: undefined,
	registeredRepos: [],
	discoverManifest: function (pluginId, pluginVer, cb, publishedTime) {
		var ayncTasks = []

		if (typeof pluginVer === 'number') pluginVer = pluginVer.toFixed(1)

		this.registeredRepos.forEach(function (repo, index) {
			var Fns = function () {
				if (index === 0) {
					return function (callback) {
						repo.discoverManifest(pluginId, pluginVer, callback, publishedTime)
					}
				} else {
					return function (data, callback) {
						if (data.manifest === undefined) {
							repo.discoverManifest(pluginId, pluginVer, callback, publishedTime)
						} else {
							callback(null, data)
						}
					}
				}
			}

			ayncTasks.push(Fns())
		})
		// eslint-disable-next-line
		org.ekstep.pluginframework.async.waterfall(ayncTasks, function (err, result) {
			// eslint-disable-next-line
			if (result && result.manifest !== undefined) { cb(undefined, result) } else { cb('Plugin not found in any repo or manifest', undefined) }
		})
	},
	addRepo: function (repo, position) {
		var repoFound = this.registeredRepos.find(function (rp) {
			return rp.id === repo.id
		})

		if (!repoFound) {
			if (typeof position === 'number') this.registeredRepos.splice(position, 0, repo)
			else this.registeredRepos.push(repo)
		} else {
			console.error(repo.id + ': Repo already registered!')
		}
	},
	getResource: function (pluginId, pluginVer, src, dataType, repo, callback, publishedTime) {
		var resource = repo.resolveResource(pluginId, pluginVer, src)
		this.loadResource(resource, dataType, callback, publishedTime)
	},
	loadExternalPluginResource: function (type, pluginId, pluginVer, src, repo, publishedTime, callback) {
		var resource = repo.resolveResource(pluginId, pluginVer, src)
		this.loadExternalResource(resource, type, publishedTime, callback)
	},
	loadExternalResource: function (resource, type, publishedTime, callback) {
		switch (type) {
		case 'js':
			if (callback) { this.loadResource(resource, 'script', callback, publishedTime) } else {
				resource = resource + '?' + (org.ekstep.pluginframework.config ? org.ekstep.pluginframework.config.build_number : '')
				if (publishedTime) resource = resource + '&' + publishedTime
				org.ekstep.pluginframework.jQuery('body').append($("<script type='text/javascript' src='" + resource + "'>"))
			}
			break
		case 'css':
			resource = resource + '?' + (org.ekstep.pluginframework.config ? org.ekstep.pluginframework.config.build_number : '')
			if (publishedTime) resource = resource + '&' + publishedTime
			org.ekstep.pluginframework.jQuery('head').append("<link rel='stylesheet' type='text/css' href='" + resource + "'>")
			if (callback) callback()
			break
		default:
			if (callback) callback()
		}
	},
	loadResource: function (url, dataType, callback, publishedTime) {
		url = url + '?' + (org.ekstep.pluginframework.config ? org.ekstep.pluginframework.config.build_number : '')
		if (publishedTime) {
			url = url + '&' + publishedTime
		}
		org.ekstep.pluginframework.jQuery.ajax({
			async: false,
			url: url,
			dataType: dataType,
			cache: true
		}).done(function (data) {
			callback(null, data)
		}).fail(function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.statusText === 'OK') {
				console.log('Unable to load resource:', url, 'error:', errorThrown)
			}
			callback(errorThrown)
		})
	}
}))()
