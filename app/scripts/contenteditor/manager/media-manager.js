/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.contenteditor.mediaManager = new (Class.extend({
	mediaMap: {},
	migratedMediaMap: {},
	addMedia: function (media) {
		if (_.isObject(media) && _.isString(media.id)) {
			this.mediaMap[media.id] = media
		}
	},
	getMedia: function (asset) {
		return this.mediaMap[asset]
	},
	getMediaOriginURL: function (src) {
		var assetReverseProxyUrl = '/assets/public/'
		var replaceText = org.ekstep.contenteditor.config.baseURL + assetReverseProxyUrl

		_.forEach(org.ekstep.contenteditor.config.aws_s3_urls, function (url) {
			if (src.indexOf(url) !== -1) {
				src = src.replace(url, replaceText)
			}
		})
		return src
	},
	addToMigratedMedia: function (media) {
		if (_.isObject(media) && _.isString(media.id)) {
			this.migratedMediaMap[media.id] = media
		}
	}
}))()
