/**
 * 
 * Language service helps to get languages and wordnet data.
 * @class EkstepEditor.languageService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 * 
 */
EkstepEditor.languageService = new(EkstepEditor.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof EkstepEditor.languageService
     */
    learningURL: EkstepEditor.config.baseURL + '/api/learning/',
    /** 
     * @member {string} languageURL
     * @memberof EkstepEditor.languageService
     */
    languageURL: EkstepEditor.config.baseURL + '/api/language/',
    /** 
     * @member {object} requestHeaders
     * @memberof EkstepEditor.languageService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    /** 
     * @member {object} wordHeaders
     * @memberof EkstepEditor.languageService
     */
    wordHeaders: {
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5OGNlN2RmNmNkOTk0YWQ5YjZlYTRjNDJlNmVjYjY5MCJ9.rtr4188EwDYZywtP7S9uuv1LsivoucFxOvJFDCWvq0Y"
            }
    },
    /**
     * Get all list of languages
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getLanguages: function(callback) {
        this.getFromService(this.learningURL + 'v1/language', this.requestHeaders, callback);
    },
    /**
     * Get all list of vowel available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getVowel: function(language,callback) {
        this.getFromService(this.languageURL + 'v1/language/dictionary/varna/Vowel/list/' + language, this.requestHeaders, callback);
    },
    /**
     * Get all list of consonant available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getConsonant: function(language,callback) {
        this.getFromService(this.languageURL + 'v1/language/dictionary/varna/Consonant/list/' + language, this.requestHeaders, callback);
    },
    /**
     * Get all avalible words in given content
     * @param  {object}   data     request object contains filters, objectType, exists etc
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getWords: function(data, callback) {
        this.postFromService(this.languageURL + 'v2/language/search', data, this.wordHeaders, callback);
    },
    /**
     * Get types of word. eg. Nouns, verbs etc 
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getWordDefinition: function(callback){
        this.getFromService(this.learningURL + 'taxonomy/en/definition/Word', this.requestHeaders, callback);
    },
    /**
     * Get all avalible keywords in given content
     * @param  {object}   data     request object
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getKeyWords: function(data, callback) {
        this.postFromService(this.languageURL + 'v1/language/parser', data, this.requestHeaders, callback);
    },
    /**
     * Utility function which is used to call http get request
     * @param  {string}   url      API url
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    getFromService: function(url, headers, callback) {
        var instance = this;
        instance.http.get(url, headers, function(err, res) {
            callback(err, res);
        });
    },
    /**
     * Utility function which is used to call http post request
     * @param  {string}   url      API url
     * @param  {object}   data     APT request data
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.languageService
     */
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }

}));
