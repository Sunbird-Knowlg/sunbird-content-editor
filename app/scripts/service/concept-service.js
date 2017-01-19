EkstepEditor.conceptService = new(EkstepEditor.iService.extend({
    learningURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug +'/learning/',
    searchURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug + '/search/',
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    templateHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    initService: function() {},
    getConceptsTree: function(callback) {
        var data = {"request": { "filters":{ "objectType": ["Dimension","Domain","Concept"]}, "limit": 500}};
        this.postFromService(this.searchURL + 'v2/search',data, this.requestHeaders, callback);
    },
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }
}));
