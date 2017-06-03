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
    metaURL: function() {
        return this.getBaseURL() + this.getAPISlug() + '/meta/'
    },
    /** 
     * @member {string} configURL
     * @memberof org.ekstep.services.metaService
     */
    configURL: function() {
        return this.getBaseURL() + this.getAPISlug() + '/config/'
    },
    /**
     * Returns the schema of the specified object. The schema will contain all the properties details (name, code, datatype, identifier etc,.).
     * @param  {string}   objectType  eg.AssessmentItem, Language etc.
     * @param  {Function} callback    returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getDefinitions: function(objectType, callback) {
        this.getFromService(this.getBaseURL() + this.getAPISlug() + '/learning/' + 'taxonomy/domain/definition/'+ objectType, {"headers": {"content-type": "application/json","user-id": "content-editor"}}, callback);
    },
    /**
     * Returns all property values in the specified language.
     * @param  {string}   languageCode  eg. en, hi etc.
     * @param  {Function} callback      returns error and response as arguments
     * @memberof org.ekstep.services.metaService
     */
    getResourceBundles: function(languageCode ,callback) {
        this.getFromService(this.metaURL() + 'v3/resourcebundles/read/'+ languageCode, this.requestHeaders, callback);
    }
}));
