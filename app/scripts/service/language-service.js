EkstepEditor.languageService = new(EkstepEditor.iService.extend({
    learningURL: EkstepEditor.config.baseURL + '/api/learning/',
    languageURL: EkstepEditor.config.baseURL + '/api/language/',
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "rayuluv"
        }
    },
    wordHeaders: {
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5OGNlN2RmNmNkOTk0YWQ5YjZlYTRjNDJlNmVjYjY5MCJ9.rtr4188EwDYZywtP7S9uuv1LsivoucFxOvJFDCWvq0Y"
            }
    },
    initService: function() {},
    getLanguages: function(callback) {
        this.getFromService(this.learningURL + 'v1/language', this.requestHeaders, callback);
    },
    getVowel: function(language,callback) {
        this.getFromService(this.languageURL + 'v1/language/dictionary/varna/Vowel/list/' + language, this.requestHeaders, callback);
    },
    getConsonant: function(language,callback) {
        this.getFromService(this.languageURL + 'v1/language/dictionary/varna/Consonant/list/' + language, this.requestHeaders, callback);
    },
    getWords: function(data, callback) {
        this.postFromService(this.languageURL + 'v2/language/search', data, this.wordHeaders, callback);
    },
    getWordDefinition: function(callback){
        this.getFromService(this.learningURL + 'taxonomy/en/definition/Word', this.requestHeaders, callback);
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
