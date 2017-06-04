/* istanbul ignore next */
org.ekstep.services.iService = Class.extend({
    /** 
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.iService
     */
    requestHeaders: {
        "headers": {
            "content-type": "application/json",
            "user-id": "content-editor"
            ,"authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWYyYzg1OWIxMDg0NzhkYjMyNmYwZDQxNjMwZWMzMSJ9.YZjU6kKNg9F5BvS7JrXTfrxyTEULjR49v7wRD-CT9sg"
        }
    },
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
        org.ekstep.services.telemetryService.apiCall({ "path": encodeURIComponent(data.url), "method": data.method, "request": data.request, "response": "", "responseTime": data.res.responseTime, "status": status, "uip": "" });
    },
    get: function(url, config, cb) {
        var requestTimestamp, instance = this;
        config = config || {};
        config.headers = config.headers || {};
        if (typeof cb !== 'function') throw "iservice expects callback to be function";
        org.ekstep.pluginframework.jQuery.ajax({
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
        org.ekstep.pluginframework.jQuery.ajax({
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
        org.ekstep.pluginframework.jQuery.ajax({
            type: "PATCH",
            url: url,
            data: data,
            headers: config.headers,
            beforeSend: function(xhrObject, settings) {
                requestTimestamp = (new Date()).getTime();
            },
            success: function(res) {
                res.responseTime = (new Date()).getTime() - requestTimestamp;
                instance._dispatchTelemetry({url: url, method: "PATCH", request: "", res: res });
                res = { data: res };
                cb(null, res);                
            },
            error: function(xhr, status, error) {
                xhr.responseTime = (new Date()).getTime() - requestTimestamp;
                cb(xhr, null);
                instance._dispatchTelemetry({url: url, method: "PATCH", request: "", res: xhr });
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
