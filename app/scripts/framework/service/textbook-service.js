/**
 * Textbook service helps to upload and download TOC
 *
 * @class org.ekstep.services.textbookService
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */
org.ekstep.services.textbookService = new (org.ekstep.services.iService.extend({
	serviceURL: function () {
		return this.getBaseURL() + this.getAPISlug() + this.getConfig('textbookEndPoint', '/textbook')
	},
	uploadFile: function (contentId, fileUrl, callback) {
		this.postFromService(this.serviceURL() + this.getConfig('uploadTocURL', '/v1/toc/upload/') + contentId + '?fileUrl=' + fileUrl, {}, this.requestHeaders, callback)
	},
	downloadFile: function (contentId, callback) {
		var headersObj = _.cloneDeep(this.requestHeaders)
		headersObj.headers['content-type'] = 'application/x-download'
		this.getFromService(this.serviceURL() + this.getConfig('donwnloadTocUrl', '/v1/toc/download/') + contentId, headersObj, callback)
	}
}))()
