/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.mediaManager = new (Class.extend({
	mediaMap: {},
	addMedia: function(media) {
		if(_.isObject(media) && _.isString(media.id)) {
			this.mediaMap[media.id] = media;
		}
	},
	getMedia: function(asset) {
		return this.mediaMap[asset];
	},    
	getMediaOriginURL: function(src) {
		var url = EkstepEditor.serviceURL;
    return src.replace(url.aws_s3, url.baseURL + url.assetReverseProxyUrl);
  }
}));