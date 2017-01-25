EkstepEditor.activityService = new(EkstepEditor.iService.extend({
    searchURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug + '/search/',
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    initService: function() {},
    getActivities: function(data, callback) {
        this.postFromService(this.searchURL + 'v2/search', data, this.requestHeaders, callback);
    },
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }
}));
