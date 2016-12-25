EkstepEditor.assessmentService = new(EkstepEditor.iService.extend({
    learningURL: EkstepEditor.config.baseURL + '/learning/',
    searchURL: EkstepEditor.config.baseURL + '/search/',
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
    getLanguages: function(callback) {
        this.getFromService(this.learningURL + 'v1/language', this.requestHeaders, callback);
    },
    getDefinations: function(callback) {
        this.getFromService(this.learningURL + 'taxonomy/domain/definition/AssessmentItem', this.requestHeaders, callback);
    },
    getResourceBundles: function(callback) {
        this.getFromService(this.learningURL + 'v2/config/resourcebundles/en', this.requestHeaders, callback);
    },
    getQuestions: function(data, callback) {
        this.postFromService(this.searchURL + 'v2/search', data, this.requestHeaders, callback);
    },
    getItem: function(itemId, callback) {
        this.getFromService(this.learningURL + 'v1/assessmentitem/' + itemId, this.templateHeaders, callback);
    },
    getTemplate: function(templateId, callback) {
        this.getFromService(this.learningURL + 'v2/content/' + templateId + "?taxonomyId=literacy_v2&fields=body,editorState,templateId,languageCode", this.templateHeaders, callback);
    },
    getFromService: function(url, headers, callback) {
        var instance = this;
        instance.http.get(url, headers, function(err, res) {
            callback(err, res);
        });
    },
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }
}));
