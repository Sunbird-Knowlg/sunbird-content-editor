/**
 *
 * Assessment service helps to get questions(items)
 * @class org.ekstep.services.assessmentService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.services.assessmentService = new (org.ekstep.services.iService.extend({
	/**
     * @member {string} learningURL
     * @memberof org.ekstep.services.assessmentService
     */
	assessmentURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('assessmentEndPoint', '/assessment')
	},
	/**
     * Get Questions from search API
     * @param  {object}   data     search filter data
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	getQuestions: function (data, callback) {
		org.ekstep.services.searchService.search(data, callback)
	},
	/**
     * Get selected Question(assessmentitem)
     * @param  {string}   itemId   selected question(assessmentitem) id
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	getItem: function (itemId, callback) {
		this.getFromService(this.assessmentURL() + this.getConfig('itemReadUrl', '/v3/items/read/') + itemId, this.requestHeaders, callback)
	},
	/**
     * Get template data of selected question from content service API
     * @param  {string}   templateId selected question(assessmentitem) template id
     * @param  {Function} callback   returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	getTemplate: function (templateId, callback) {
		org.ekstep.services.contentService.getTemplateData(templateId, callback)
	},
	/**
     * This method is used to save question
     * @param  {string}   assessmentId
     * @param  {object}   requestObj
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	saveQuestion: function (assessmentId, requestObj, callback) {
		var instance = this
		/* If assessment Id exists then update the question else create */
		if (assessmentId) {
			instance.patch(this.assessmentURL() + 'assessmentitems/update/' + assessmentId, requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		} else {
			instance.post(this.assessmentURL() + 'assessmentitems/create', requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		}
	},
	/**
     * Get Questions from search assesmentItems
     * @param  {object}   data     search filter data
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	getQuestionItems: function (data, callback) {
		this.postFromService(this.assessmentURL() + '/v3/items/search', data, this.requestHeaders, callback)
	},
	/**
     * This method is used to save v3 question
     * @param  {string}   assessmentId
     * @param  {object}   requestObj
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	saveQuestionV3: function (assessmentId, requestObj, callback) {
		var instance = this
		/* If assessment Id exists then update the question else create */
		if (assessmentId) {
			instance.patch(this.assessmentURL() + '/v3/items/update/' + assessmentId, requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		} else {
			instance.post(this.assessmentURL() + '/v3/items/create', requestObj, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		}
	},
	/**
     * This method is used to delete question
     * @param  {string}   assessmentId
     * @param  {object}   requestObj
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.assessmentService
     */
	deleteQuestion: function (assessmentId, callback) {
		var instance = this
		/* If assessment Id exists then delete the question */
		if (assessmentId) {
			instance.delete(this.assessmentURL() + '/v3/itemsets/retire/' + assessmentId, this.requestHeaders, function (err, res) {
				callback(err, res)
			})
		}
	}

}))()
