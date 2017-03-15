/**
 *
 * Assessment service helps to get questions(items)
 * @class EkstepEditor.assessmentService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.assessmentService = new(EkstepEditor.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof EkstepEditor.assessmentService
     */
    learningURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug + '/learning/',
     /** 
     * @member {object} requestHeaders
     * @memberof EkstepEditor.assessmentService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
        }
    },
    /**
     * Get Questions from search API
     * @param  {object}   data     search filter data
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.assessmentService
     */
    getQuestions: function(data, callback) {
        EkstepEditorAPI.getService('search').search(data, callback);
    },
    /**
     * Get selected Question(assessmentitem)
     * @param  {string}   itemId   selected question(assessmentitem) id
     * @param  {Function} callback returns error and response as arguments
     * @memberof EkstepEditor.assessmentService
     */
    getItem: function(itemId, callback) {
        this.getFromService(this.learningURL + 'v1/assessmentitem/' + itemId, this.requestHeaders, callback);
    },
    /**
     * Get temaplte data of selected question from content_service API
     * @param  {string}   templateId selected question(assessmentitem) template id
     * @param  {Function} callback   returns error and response as arguments
     * @memberof EkstepEditor.assessmentService
     */
    getTemplate: function(templateId, callback) {
        EkstepEditorAPI.getService('content').getTemaplteData(templateId, callback);
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
