/**
 * Asset service provides access to the content API to save assets.
 * @class org.ekstep.services.assetService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.services.assetService = new (org.ekstep.services.iService.extend({
	/**
     * @member {string} searchURL
     * @memberof org.ekstep.services.assetService
     */
	contentURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('contentEndPoint', '/content')
	},
	asset: {},
	initService: function () {},
	/**
     * Set asset object
     * @param {string} id
     * @param {object} assetMeta
     * @memberof org.ekstep.services.assetService
     */
	setAssetMeta: function (id, assetMeta) {
		if (id && assetMeta) {
			if (this.asset[id] === undefined) this.asset[id] = {}
			this.asset[id].assetMeta = assetMeta
		}
	},
	/**
     * get asset object
     * @param  {string} id
     * @memberof org.ekstep.services.assetService
     */
	getAssetMeta: function (id) {
		return this.asset[id] || {}
	},
	/**
     * This method is used to save assets(audio & image)
     * @param  {string}   assetId
     * @param  {string}   content
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assetService
     */
	saveAsset: function (assetId, content, callback) {
		var instance = this

		var requestObj = {
			request: {
				content: content
			}
		}
		if (assetId) {
			instance.patch(this.contentURL() + this.getConfig('contentUpdateUrl', '/v3/update/'), requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		} else {
			instance.post(this.contentURL() + this.getConfig('contentCreateUrl', '/v3/create'), requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		}
	}
}))()
