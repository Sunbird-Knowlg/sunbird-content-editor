/**
 * Search service provides capability to search user and content collaborators
 *
 * @class org.ekstep.services.userService
 * @author Vivek Kasture
 */
org.ekstep.services.userService = new (org.ekstep.services.iService.extend({
	initService: function () { },
	/**
     * @member {string} searchURL
     * @memberof org.ekstep.services.userService
     */
	searchURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('userSearchEndPoint', '/user/v1/search?fields=orgName')
	},
	/**
     * Search method helps to get the users
     * @param  {object}   request  request object will take all request parameters of search API
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.userService
     */
	search: function (request, callback) {
		this.postFromService(this.searchURL(), request, this.requestHeaders, callback)
	},
	/**
     * updateCollaborators method helps to update the collaborators
     * @param  {object}  request  request object will take all request parameters of updateCollaborators API
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.userService
     */
	updateCollaborators: function (contentID, request, callback) {
		this.patch(this.getBaseURL() + this.getAPISlug() + this.getConfig('collaborationUrl', '/content/v1/collaborator/update/') + contentID, request, this.requestHeaders, callback)
	}
}))()
