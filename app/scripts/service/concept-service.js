EkstepEditor.conceptService = new(EkstepEditor.iService.extend({
    learningURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug + '/learning/',
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
        var data = { "request": { "filters": { "objectType": ["Dimension", "Domain"] } } };
        this.postFromService(this.searchURL + 'v2/search', data, this.requestHeaders, callback);
    },
    getConcepts: function(offset, limit, callback) {
        offset = offset || 0;
        limit = limit || 200;
        var data = { "request": { "filters": { "objectType": ["Concept"] }, "offset": offset, "limit": limit } };
        this.postFromService(this.searchURL + 'v2/search', data, this.requestHeaders, callback);
    },
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }
}));
