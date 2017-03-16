/**
 *
 * 
 * @class EkstepEditor.metaService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.metaService = new(EkstepEditor.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof EkstepEditor.metaService
     */
    learningURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug + '/learning/',
    /** 
     * @member {string} configURL
     * @memberof EkstepEditor.metaService
     */
    configURL: EkstepEditor.config.baseURL + '/api/config/',
    /** 
     * @member {object} requestHeaders
     * @memberof EkstepEditor.metaService
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
     * @memberof EkstepEditor.metaService
     */
    getDefinitions: function(objectType, callback) {
        this.getFromService(this.learningURL + 'taxonomy/domain/definition/'+ objectType, this.requestHeaders, callback);
    },
    /**
     * 
     * @param  {string}   languageCode  eg. en, hi etc.
     * @param  {Function} callback      returns error and response as arguments
     * @memberof EkstepEditor.metaService
     */
    getResourceBundles: function(languageCode ,callback) {
        this.getFromService(this.configURL + 'v2/config/resourcebundles/'+ languageCode, this.requestHeaders, callback);
    },
    /**
     * Utility function which is used to call http get request
     * @param  {string}   url      API url
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.metaService
     */
    getFromService: function(url, headers, callback) {
        var instance = this;
        instance.http.get(url, headers, function(err, res) {
            callback(err, res);
        });
    }
}));
