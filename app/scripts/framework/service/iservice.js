/* istanbul ignore next */
org.ekstep.services.iService = Class.extend({
	/**
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.iService
     */
	requestHeaders: {
		'headers': {
			'content-type': 'application/json',
			'user-id': 'content-editor',
			'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2NWU2MTUxNzdkODY0MGJkYWNmMWE4MWEwM2Y5MmNjYSJ9.yST4a-kA0K-r-86m0gx45IMTTZP0ujQnjFDEjv2wU0A',
			'x-authenticated-user-token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiJmNjEzZGRhOC1iNGI1LTQ3MWUtYTBkNi03YzA2OWQ0OWU5NWMiLCJleHAiOjE1NDExNzMxMzUsIm5iZiI6MCwiaWF0IjoxNTQxMTU1MTM1LCJpc3MiOiJodHRwczovL2Rldi5vcGVuLXN1bmJpcmQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiI4NzRlZDhhNS03ODJlLTRmNmMtOGYzNi1lMDI4ODQ1NTkwMWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3YjU3OTllMC02ZDEwLTRjMjAtOTA2MC1lOTIyODIzNDBlMmMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnt9LCJuYW1lIjoiQ3JldGF0aW9uIFVzZXIgTmV3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibnRwdGVzdDEwMiIsImdpdmVuX25hbWUiOiJDcmV0YXRpb24iLCJmYW1pbHlfbmFtZSI6IlVzZXIgTmV3IiwiZW1haWwiOiJ1c2VydGVzdDEyQHRlc3Rzcy5jb20ifQ.GGCrNcRlVqqRH8HGefZ79aieI3m1vb21fW07zZkrVYUm0S4PQD7tj86lww_j8THXlfif5O-lx-vuggk9ngR1gV3UCls3EGYpGIYxXxVD0LhvQCSvWMytXcIEuRcCU2f5s93WDZE48DwXDb-J-22l2Fq7v4m24Jaj9tt6hPyV0QJsJYikM4G75hsoWADKsFyi5dFQ5rPxpyumxeqrp_nYLsDWmD0EIvd2AP-UKXvMncdrxyEufzX21TPKCTxwaq0SXCXTwqXTI0g67EHu6DA4QKMZzBDUVgjMEb643FN4Cad2fBmpNr-9WtrcRH3jzrAbauLFDr8G_impw3S5qANnDQ'
		}
	},
	getBaseURL: function () {
		return org.ekstep.services.config.baseURL
	},
	getAPISlug: function () {
		return org.ekstep.services.config.apislug
	},
	getConfig: function (configKey, _default) {
		return org.ekstep.services.config[configKey] || _default
	},
	init: function (config) {
		this.initService(config)
	},
	initService: function (config) {},
	_dispatchTelemetry: function (data) {
		var status = data.res.responseCode || data.res.statusText
		org.ekstep.services.telemetryService.apiCall({ 'path': encodeURIComponent(data.url), 'method': data.method, 'request': data.request, 'response': '', 'responseTime': data.res.responseTime, 'status': status, 'uip': '' })
	},
	_call: function (ajaxSettings, config, cb) {
		var requestTimestamp; var instance = this
		config = config || {}
		ajaxSettings.headers = config.headers || {}
		ajaxSettings.beforeSend = function (xhrObject, settings) {
			requestTimestamp = (new Date()).getTime()
		}
		ajaxSettings.success = function (res) {
			res.responseTime = (new Date()).getTime() - requestTimestamp
			var request = ajaxSettings.type === 'POST' ? ajaxSettings.data : {}
			instance._dispatchTelemetry({ url: ajaxSettings.url, method: ajaxSettings.type, request: request, res: res })
			res = { data: res }
			cb(null, res)
		}
		ajaxSettings.error = function (err) {
			err.responseTime = (new Date()).getTime() - requestTimestamp
			cb(err, null)
			var request = ajaxSettings.type === 'POST' ? ajaxSettings.data : {}
			instance._dispatchTelemetry({ url: ajaxSettings.url, method: ajaxSettings.type, request: request, res: err })
		}

		if (!_.isUndefined(config.contentType)) ajaxSettings.contentType = config.contentType
		if (!_.isUndefined(config.cache)) ajaxSettings.cache = config.cache
		if (!_.isUndefined(config.processData)) ajaxSettings.processData = config.processData
		if (!_.isUndefined(config.enctype)) ajaxSettings.enctype = config.enctype

		org.ekstep.pluginframework.jQuery.ajax(ajaxSettings)
	},
	get: function (url, config, cb) {
		this._call({ type: 'GET', url: url }, config, cb)
	},
	put: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'PUT', url: url, data: data }, config, cb)
	},
	post: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'POST', url: url, data: data }, config, cb)
	},
	patch: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'PATCH', url: url, data: data }, config, cb)
	},
	delete: function (url, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		this._call({ type: 'DELETE', url: url }, config, cb)
	},
	/**
     * Utility function which is used to call http post request
     * @param  {string}   url      API url
     * @param  {object}   data     APT request data
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
	postFromService: function (url, data, headers, callback) {
		this.post(url, data, headers, function (err, res) {
			callback(err, res)
		})
	},
	/**
     * Utility function which is used to call http get request
     * @param  {string}   url      API url
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
	getFromService: function (url, headers, callback) {
		this.get(url, headers, function (err, res) {
			callback(err, res)
		})
	}

})
