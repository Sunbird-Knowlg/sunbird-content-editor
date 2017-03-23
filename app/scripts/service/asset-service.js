/**
 * Asset service provides access to the content API to save assets.
 * @class EkstepEditor.assetService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.assetService = new(EkstepEditor.iService.extend({
     /** 
     * @member {string} searchURL
     * @memberof EkstepEditor.assetService
     */
    learningURL: EkstepEditor.config.baseURL + EkstepEditorAPI.getConfig('apislug') + '/learning/',
    asset: {},
     /** 
     * @member {object} requestHeaders
     * @memberof EkstepEditor.assetService
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
     * @memberof EkstepEditor.assetService
     */
    setAssetMeta: function(id, assetMeta) {
        if (id) {
            this.asset[id] = _.isUndefined(this.asset[id]) ? {} : this.asset[id];
            this.asset[id].assetMeta = _.isUndefined(assetMeta) ? this.asset[id].assetMeta : assetMeta;
        }
    },
    /**
     * get asset object
     * @param  {string} id 
     * @memberof EkstepEditor.assetService
     */
    getAssetMeta: function(id) {
        return this.asset[id] || {};
    },
    /**
     * This method is used to save assets(audio & image)
     * @param  {string}   assetId
     * @param  {string}   content
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.assetService
     */
    saveAsset: function(assetId, content, callback) {
        var instance = this;

        var requestObj = {
            request: {
                content: content
            }
        };
        if (assetId) {
            instance.http.patch(this.learningURL + 'v2/content/', requestObj, this.requestHeaders, function(err, res) {
                callback(err, res)
            });
        } else {
            instance.http.post(this.learningURL + 'v2/content', requestObj, this.requestHeaders, function(err, res) {
                callback(err, res)
            });
        }
    }
}));
