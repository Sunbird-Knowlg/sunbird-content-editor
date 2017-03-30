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
    http: {
        $http: angular.injector(["ng", "editorApp"]).get("$http"),
        get: function(url, config, cb) {
            var instance = this;
            if (!config) config = {};
            
            this.$http.get(url, config).then(function(res) {
                instance._dispatchTelemetry({url: url, method: "GET", request: "", res: res});
                cb(null, res) 
            }, function(res) {
                instance._dispatchTelemetry({url: url, method: "GET", request: "", res: res});                
                cb(res, null) 
            });
        },
        post: function(url, data, config, cb) {
            var instance = this;
            if (!config) config = {};
            this.$http.post(url, data, config).then(function(res) { 
                instance._dispatchTelemetry({url: url, method: "POST", request: data, res: res});
                cb(null, res) 
            }, function(res) { 
                instance._dispatchTelemetry({url: url, method: "POST", request: data, res: res});
                cb(res, null) 
            });
        },
        patch: function(url, data, config, cb) {
            var instance = this;
            if (!config) config = {};
            this.$http.patch(url, data, config).then(function(res) {
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: res}); 
                cb(null, res) 
            }, function(res) { 
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: res}); 
                cb(res, null) 
            });
        },
        _dispatchTelemetry: function (data) {
            var responseTime = (data.res.config.responseTimestamp - data.res.config.requestTimestamp);
            org.ekstep.services.telemetryService.apiCall({ "path": data.url, "method": data.method, "request": data.request, "response": "","responseTime": responseTime, "status": data.res.status, "uip": "" }); 
        }
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
        this.http.post(url, JSON.stringify(data), headers, function(err, res) {
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
        this.http.get(url, headers, function(err, res) {
            callback(err, res);
        });
    }

});