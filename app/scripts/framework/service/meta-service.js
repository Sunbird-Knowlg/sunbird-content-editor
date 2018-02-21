/**
 * Service to get meta information from platform
 * 
 * @class org.ekstep.services.metaService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.services.metaService = new(org.ekstep.services.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof org.ekstep.services.metaService
     */
    learningURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('learningEndPoint', '/learning')
    },
    /** 
     * @member {string} learningURL
     * @memberof org.ekstep.services.metaService
     */
    metaURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('metaEndPoint', '/meta')
    },
    /** 
     * @member {string} configURL
     * @memberof org.ekstep.services.metaService
     */
    configURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('configEndPoint', '/domain')
    },
    /** 
     * @member {string} domainURL
     * @memberof org.ekstep.services.metaService
     */
    domainURL: function(){
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('domainEndPoint', '/domain')
    },
    /** 
     * @member {string} frameworkURL
     * @memberof org.ekstep.services.metaService
     */
    frameworkURL: function(){
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('frameworkEndPoint', '/framework')
    },
    /** 
     * @member {string} vocabularyURL
     * @memberof org.ekstep.services.metaService
     */
    vocabularyURL: function(){
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('vocabularyEndPoint','/vocabulary')
    },

    /** 
     * @member {string} pageAssembleUrl
     * @memberof org.ekstep.services.metaService
     */
    pageAssembleUrl: function(){
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('pageAssembleEndPoint','/data')
    },


    /**
     * Returns the schema of the specified object. The schema will contain all the properties details (name, code, datatype, identifier etc,.).
     * @param  {string}   objectType  eg.AssessmentItem, Language etc.
     * @param  {Function} callback    returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getDefinitions: function(objectType, callback) {
        this.getFromService(this.learningURL() + this.getConfig('definitionsGetUrl', '/taxonomy/domain/definition/') + objectType, { "headers": { "content-type": "application/json", "user-id": "content-editor" } }, callback);
    },
    /**
     * Returns all property values in the specified language.
     * @param  {string}   languageCode  eg. en, hi etc.
     * @param  {Function} callback      returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getResourceBundles: function(languageCode, callback) {
        this.getFromService(this.metaURL() + this.getConfig('resourceBundleUrl', '/v3/resourcebundles/read/') + languageCode, this.requestHeaders, callback);
    },
    /**
     * Get config items from learning api terms list
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.configService
     */
    getLearningConfig: function(callback) {
        this.getFromService(this.domainURL() + this.getConfig('termsListUrl', '/v3/terms/list'), this.requestHeaders, callback);
    },
    /**
     * Get config items from config api ordinals
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.configService
     */
    getConfigOrdinals: function(callback) {
        this.getFromService(this.metaURL() + this.getConfig('ordinalsGetUrl', '/v3/ordinals/list'), this.requestHeaders, callback);
    },

    /**
     * Get config items from vocabulary api 
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    suggestVocabulary: function(data, callback){
        this.postFromService(this.vocabularyURL() + this.getConfig('suggestVocabularyUrl','/v3/term/suggest'),data, this.requestHeaders, callback); 
    },

    /**
     * Get config items from vocabulary api 
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    createVocabulary: function(data, callback){
        this.postFromService(this.vocabularyURL() + this.getConfig('createVocabularUrl','/v3/term/create'),data, this.requestHeaders, callback);
    },
    /**
     * Get Categorys based on framework
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getCategorys: function(framework, callback){
        this.getFromService(this.frameworkURL() + this.getConfig('getCategorysUrl','/v3/read/') + framework, this.requestHeaders, callback);
    },

    /**
     * Get config items from pageAssemble api 
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getPageAssemble: function(data, callback){
        this.postFromService(this.pageAssembleUrl() + this.getConfig('pageAssembleUrl','/v1/page/assemble'), data, this.requestHeaders, callback);
    }

}));
