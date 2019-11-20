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
            'x-authenticated-user-token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiJjODZhNWFmNC1hZDI2LTQxNjMtOTY5ZC02Yjc3N2M3YzAyZmQiLCJleHAiOjE1NzE2NjIwNzIsIm5iZiI6MCwiaWF0IjoxNTcxNjQ3NjcyLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiJmOjVhOGEzZjJiLTM0MDktNDJlMC05MDAxLWY5MTNiYzBmZGUzMTo4NzRlZDhhNS03ODJlLTRmNmMtOGYzNi1lMDI4ODQ1NTkwMWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJhOTI1MzMzZS0yOThlLTRkOGEtYjU3NS1kMTZmMmMwODBjZWMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnt9LCJuYW1lIjoiQ3JlYXRpb24iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJudHB0ZXN0MTAyIiwiZ2l2ZW5fbmFtZSI6IkNyZWF0aW9uIiwiZmFtaWx5X25hbWUiOiIiLCJlbWFpbCI6InRlc3RydW5uZXIxQHlvcG1haWwuY29tIn0.KcnULwHzixlPSG8Nvq3_wp1oNZS3HgwbPMPkiB6hffAU0aYLrTBMdnJ24xUhviJ7RXQ9mz9QGx4vxr9T9btwyQQ8EzrEx1VO8tVTrGsTf37M_DEK4W1kqk1LNPTpYcwZeSB4u0Im6T-WtjCVCTljW4OgE7I90-sI44Qu0QMxWnUR1E1aqxiUogyk4GaSCReH0z0qIJiyfq8Z0o0UF4jSqb_gciOmY3Er_UenIF9LUftnpXJOh4kYXv521HivlqtXG5NU9UjlTQUTBtVdODoAnrjbOQhfr9fwPCC0w8Lt7GMvYFPmmEwPvem4RwiJgfxQZy7FDhaTSt4IVQfsllQm_g'
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
			if(err && err.status === 401 && err.statusText === "Unauthorized") {
				ecEditor.dispatchEvent("org.ekstep.contenteditor:Unauthorized");
			} else {
				cb(err, null);
			}
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