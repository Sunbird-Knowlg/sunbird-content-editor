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
        return this.getBaseURL() + this.getAPISlug() + '/learning/'
    },
    /** 
     * @member {string} configURL
     * @memberof org.ekstep.services.metaService
     */
    configURL: function() {
        return this.baseURL + '/api/config/'
    },
    /** 
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.metaService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    /**
     * 
     * @param  {string}   objectType  eg.AssessmentItem, Language etc.
     * @param  {Function} callback    returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getDefinitions: function(objectType, callback) {
        this.getFromService(this.learningURL() + 'taxonomy/domain/definition/'+ objectType, this.requestHeaders, callback);
    },
    /**
     * 
     * @param  {string}   languageCode  eg. en, hi etc.
     * @param  {Function} callback      returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getResourceBundles: function(languageCode ,callback) {
        this.getFromService(this.configURL() + 'v2/config/resourcebundles/'+ languageCode, this.requestHeaders, callback);
    }
}));
