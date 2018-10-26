/**
 *
 * Language service helps to get languages and wordnet data.
 * @class org.ekstep.services.languageService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 *
 */
org.ekstep.services.languageService = new (org.ekstep.services.iService.extend({
	/**
     * @member {string} learningURL
     * @memberof org.ekstep.services.languageService
     */
	learningURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('learningEndPoint', '/learning')
	},
	/**
     * @member {string} languageURL
     * @memberof org.ekstep.services.languageService
     */
	languageURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('languageEndPoint', '/language')
	},
	/**
     * Get all list of languages
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getLanguages: function (callback) {
		this.getFromService(this.languageURL() + this.getConfig('languageListUrl', '/v3/list'), this.requestHeaders, callback)
	},
	/**
     * Get all list of vowel available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getVowel: function (language, callback) {
		this.getFromService(this.languageURL() + this.getConfig('vowelGetUrl', '/v3/varnas/vowels/list') + '?language_id=' + language, this.requestHeaders, callback)
	},
	/**
     * Get all list of consonant available in selected language
     * @param  {string}   language eg. en, hi etc.
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getConsonant: function (language, callback) {
		this.getFromService(this.languageURL() + this.getConfig('consonantListUrl', '/v3/varnas/consonants/list') + '?language_id=' + language, this.requestHeaders, callback)
	},
	/**
     * Get all avalible words in given content
     * @param  {object}   data     request object contains filters, objectType, exists etc
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getWords: function (data, callback) {
		this.postFromService(this.languageURL() + this.getConfig('wordsGetUrl', '/v3/search'), data, this.requestHeaders, callback)
	},
	/**
     * Get types of word. eg. Nouns, verbs etc
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getWordDefinition: function (callback) {
		this.getFromService(this.languageURL() + this.getConfig('word_definition_url', '/definition/v3/read/Word') + '?language_id=en', this.requestHeaders, callback)
	},
	/**
     * Get types of word. eg. Nouns, verbs etc
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getWordDefinitionByLanguage: function (data, callback) {
		this.getFromService(this.languageURL() + this.getConfig('word_definition_url', '/definition/v3/read/Word') + '?language_id=' + data.languageId, this.requestHeaders, callback)
	},
	/**
     * Get all avalible keywords in given content
     * @param  {object}   data     request object
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.languageService
     */
	getKeyWords: function (data, callback) {
		this.postFromService(this.languageURL() + this.getConfig('keywordsGetUrl', '/v3/tools/parser'), data, this.requestHeaders, callback)
	},
	/**
    * Transliterates english text to specified language and invokes a callback
    * @param {Object} data - object containing english text and array of languages
    * @param {Function} callback - Callback when api call returns
    * @return {void}
    */
	getTransliteration: function (data, callback) {
		this.postFromService(this.languageURL() + this.getConfig('transliterateGetUrl', '/v3/tools/transliterate') + '?lemma=' + data.text + '&languages=' + data.languages.toString(), {'request': {}}, this.requestHeaders, callback)
	},
	/**
     * Translates word in provided languages
     * @param {Object} req contain requested data
     * @param {Function} callback, callback function
     */
	getTranslation: function (data, callback) {
		this.postFromService(this.languageURL() + this.getConfig('translateGetUrl', '/v3/tools/translate') + '?language_id=' + data.wordLang + '&lemma=' + data.word + '&languages=' + data.languages, {'request': {}}, this.requestHeaders, callback)
	},
	/**
     * GetSyllables split word into letters
     * @param {Object} req contain requested data
     * @param {Function} callback, callback function
     */
	getSyllables: function (data, callback) {
		this.postFromService(this.languageURL() + '/v3/varnas/syllables/list', data, this.requestHeaders, callback)
	}
}))()
