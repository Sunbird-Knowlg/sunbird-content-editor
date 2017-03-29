/**
 * Asset service provides access to the content API to save assets.
 * @class org.ekstep.services.assetService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.services.assetService = new(org.ekstep.services.iService.extend({
     /** 
     * @member {string} searchURL
     * @memberof org.ekstep.services.assetService
     */
    learningURL: function() {
        return this.getBaseURL() + this.getAPISlug() + '/learning/'
    },
    asset: {},
     /** 
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.assetService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    initService: function() {},
    /**
     * Set asset object
     * @param {string} id        
     * @param {object} assetMeta 
     * @memberof org.ekstep.services.assetService
     */
    setAssetMeta: function(id, assetMeta) {
        if (id && assetMeta) {
            if(_.isUndefined(this.asset[id])) this.asset[id] = {};
            this.asset[id].assetMeta = assetMeta;
        }
    },
    /**
     * get asset object
     * @param  {string} id 
     * @memberof org.ekstep.services.assetService
     */
    getAssetMeta: function(id) {
        return this.asset[id] || {};
    },
    /**
     * This method is used to save assets(audio & image)
     * @param  {string}   assetId
     * @param  {string}   content
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assetService
     */
    saveAsset: function(assetId, content, callback) {
        var instance = this;

        var requestObj = {
            request: {
                content: content
            }
        };
        if (assetId) {
            instance.http.patch(this.learningURL() + 'v2/content/', requestObj, this.requestHeaders, function(err, res) {
                callback(err, res)
            });
        } else {
            instance.http.post(this.learningURL() + 'v2/content', requestObj, this.requestHeaders, function(err, res) {
                callback(err, res)
            });
        }
    }
}));
