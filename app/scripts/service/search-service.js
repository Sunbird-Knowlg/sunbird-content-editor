/**
 *
 * Search service provides capability to search content(activities, question etc.) from  composite search API.
 * @class EkstepEditor.searchService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.searchService = new(EkstepEditor.iService.extend({
    /** 
     * @member {string} searchURL
     * @memberof EkstepEditor.searchService
     */
    searchURL: EkstepEditor.config.baseURL + EkstepEditorAPI.getConfig('apislug') + '/search/',
    /** 
     * @member {object} requestHeaders
     * @memberof EkstepEditor.searchService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    initService: function() {},
    /**
     * Search method helps to get the content from search API
     * @param  {object}   request  request object will take all request parameters of search API
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.searchService
     */
    search: function(request, callback) {
        this.postFromService(this.searchURL + 'v2/search', request, this.requestHeaders, callback);
    },
    /**
     * Utility function which is used to call http post request
     * @param  {string}   url      API url
     * @param  {object}   data     APT request data
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.searchService
     */
    postFromService: function(url, data, headers, callback) {
        var instance = this;
        instance.http.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    }
}));
