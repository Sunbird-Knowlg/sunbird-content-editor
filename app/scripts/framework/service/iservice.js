/* istanbul ignore next */
org.ekstep.services.iService = Class.extend({
    getBaseURL: function() {
        return org.ekstep.services.config.baseURL;
    },
    getAPISlug: function() {
        return org.ekstep.services.config.apislug;
    },
    init: function(config) {
        this.initService(config);
    },
    initService: function(config) {},                
    _dispatchTelemetry: function(data) {
        var status = data.res.responseCode || data.res.statusText;
        org.ekstep.services.telemetryService.apiCall({ "path": data.url, "method": data.method, "request": data.request, "response": "", "responseTime": data.res.responseTime, "status": status, "uip": "" });
    },
    get: function(url, config, cb) {
        var requestTimestamp, instance = this;
        config = config || {};
        config.headers = config.headers || {};
        if (typeof cb !== 'function') throw "iservice expects callback to be function";
        org.ekstep.contenteditor.jQuery.ajax({
            type: "GET",
            url: url,
            headers: config.headers,
            beforeSend: function(xhrObject, settings) {
                requestTimestamp = (new Date()).getTime();
            },
            success: function(res) {
                res.responseTime = (new Date()).getTime() - requestTimestamp;
                instance._dispatchTelemetry({url: url, method: "GET", request: "", res: res }); 
                res = { data: res };
                cb(null, res);                
            },
            error: function(err) {
                err.responseTime = (new Date()).getTime() - requestTimestamp;
                cb(err, null);
                instance._dispatchTelemetry({url: url, method: "GET", request: "", res: err });
            }
        });
    },
    post: function(url, data, config, cb) {
        var requestTimestamp, instance = this;
        data = data || {};
        config = config || {};
        config.headers = config.headers || {};
        if (typeof cb !== 'function') throw "iservice expects callback to be function";
        if (typeof data === 'object') data = JSON.stringify(data);
        org.ekstep.contenteditor.jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            headers: config.headers,
            beforeSend: function(xhrObject, settings) {
                requestTimestamp = (new Date()).getTime();
            },
            success: function(res) {
                res.responseTime = (new Date()).getTime() - requestTimestamp;
                instance._dispatchTelemetry({url: url, method: "POST", request: data, res: res }); 
                res = { data: res };
                cb(null, res);                
            },
            error: function(err) {
                err.responseTime = (new Date()).getTime() - requestTimestamp;
                cb(err, null);
                instance._dispatchTelemetry({url: url, method: "POST", request: data, res: err });
            }
        });
    },
    patch: function(url, data, config, cb) {
        var requestTimestamp, instance = this;
        data = data || {};
        config = config || {};
        config.headers = config.headers || {};
        if (typeof cb !== 'function') throw "iservice expects callback to be function";
        if (typeof data === 'object') data = JSON.stringify(data);
        org.ekstep.contenteditor.jQuery.ajax({
            type: "PATCH",
            url: url,
            data: data,
            headers: config.headers,
            beforeSend: function(xhrObject, settings) {
                requestTimestamp = (new Date()).getTime();
            },
            success: function(res) {
                res.responseTime = (new Date()).getTime() - requestTimestamp;
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: res });
                res = { data: res };
                cb(null, res);                
            },
            error: function(err) {
                err.responseTime = (new Date()).getTime() - requestTimestamp;
                cb(err, null);
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: err });
            }
        });
    },
    /**
     * Utility function which is used to call http post request
     * @param  {string}   url      API url
     * @param  {object}   data     APT request data
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
    postFromService: function(url, data, headers, callback) {
        this.post(url, JSON.stringify(data), headers, function(err, res) {
            callback(err, res)
        });
    },
    /**
     * Utility function which is used to call http get request
     * @param  {string}   url      API url
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
    getFromService: function(url, headers, callback) {
        this.get(url, headers, function(err, res) {
            callback(err, res);
        });
    }

});
