/* istanbul ignore next */
org.ekstep.services.iService = Class.extend({
	/**
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.iService
     */
	requestHeaders: {
		'headers': {
			'content-type': 'application/json',
			'user-id': 'content-editor'
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