EkstepEditor.assetService = new(EkstepEditor.iService.extend({
    serviceURL: EkstepEditor.config.baseURL + '/learning/',
    asset: {},
    initService: function() {},
    setAssetMeta: function(id, assetMeta) {
        if (id) {
            this.asset[id] = _.isUndefined(this.asset[id]) ? {} : this.asset[id];
            this.asset[id].assetMeta = _.isUndefined(assetMeta) ? this.asset[id].assetMeta : assetMeta;
        }
    },
    getAssetMeta: function(id) {
        return this.asset[id] || {};
    },
    saveAsset: function(assetId, content, callback) {
        var instance = this;

		var requestObj = {
			request: {
				content: content
			}
		};

		var headers = {
			"headers": {
				"content-type": "application/json",
				"user-id": "ATTool"
			}
		}

		if (assetId) {
			instance.http.patch(this.serviceURL + 'v2/content/', requestObj, headers, serviceCallback);
		}
		else {
			instance.http.post(this.serviceURL + 'v2/content', requestObj, headers, serviceCallback);
		}

		function serviceCallback(err, res) {
			if (res) {
			}
			callback(err, res);
		}
    },
}));
