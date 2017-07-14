/**
 * 
 * Language service helps to get languages and wordnet data.
 * @class org.ekstep.services.languageService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 * 
 */
org.ekstep.services.languageService = new(org.ekstep.services.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof org.ekstep.services.languageService
     */
    learningURL: function() {
        return this.getBaseURL() + this.getAPISlug() + '/learning/'
    },
    /** 
     * @member {string} languageURL
     * @memberof org.ekstep.services.languageService
     */
    languageURL: function() { 
        return this.getBaseURL() + this.getAPISlug() + '/language/'
    },
    /** 
     * @member {object} wordHeaders
     * @memberof org.ekstep.services.languageService
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
     * @memberof org.ekstep.services.languageService
     */
    getLanguages: function(callback) {
        this.getFromService(this.languageURL() + 'v3/list', this.requestHeaders, callback);
    },
    /**
     * Get all list of vowel available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
    getVowel: function(language, callback) {
        this.getFromService(this.languageURL() + 'v1/language/dictionary/varna/Vowel/list/' + language, this.requestHeaders, callback);
    },
    /**
     * Get all list of consonant available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
    getConsonant: function(language, callback) {
        this.getFromService(this.languageURL() + 'v1/language/dictionary/varna/Consonant/list/' + language, this.requestHeaders, callback);
    },
    /**
     * Get all avalible words in given content
     * @param  {object}   data     request object contains filters, objectType, exists etc
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
    getWords: function(data, callback) {
        this.postFromService(this.languageURL() + 'v3/search', data, this.wordHeaders, callback);
    },
    /**
     * Get types of word. eg. Nouns, verbs etc 
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
    getWordDefinition: function(callback) {
        this.getFromService(this.learningURL() + 'taxonomy/en/definition/Word', this.requestHeaders, callback);
    },
    /**
     * Get all avalible keywords in given content
     * @param  {object}   data     request object
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
    getKeyWords: function(data, callback) {
        this.postFromService(this.languageURL() + 'v3/tools/parser', data, this.requestHeaders, callback);
    },
    /**
    * Transliterates english text to specified language and invokes a callback
    * @param {Object} data - object containing english text and array of languages
    * @param {Function} callback - Callback when api call returns
    * @return {void}
    */
    getTransliteration: function(data, callback) {
        this.postFromService(this.languageURL() + "v3/tools/transliterate?lemma=" + data.text + "&languages="+ data.languages.toString() , {"request": {}}, this.requestHeaders, callback);
    },
    /**
     * Translates word in provided languages
     * @param {Object} req contain requested data
     * @param {Function} callback, callback function
     */
    getTranslation:  function(data, callback) {
        this.postFromService(this.languageURL() + "v3/tools/translate?language_id="+ data.wordLang + '&lemma=' + data.word + '&languages=' + data.languages, {"request": {}}, this.requestHeaders, callback);
    }
}));
