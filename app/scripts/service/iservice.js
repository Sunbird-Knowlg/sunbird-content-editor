EkstepEditor.iService = Class.extend({
    init: function(config) {
        this.initService(config);
    },
    initService: function(config) {},
    http: {
        $http: angular.injector(["ng", "editorApp"]).get("$http"),
        get: function(url, config, cb) {
            var instance = this;
            if (!config) config = {};
            return this.$http.get(url, config).then(function(res) {
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
            return this.$http.post(url, data, config).then(function(res) { 
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
            return this.$http.patch(url, data, config).then(function(res) {
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: res}); 
                cb(null, res) 
            }, function(res) { 
                instance._dispatchTelemetry({url: url, method: "PATCH", request: data, res: res}); 
                cb(res, null) 
            });
        },
        _dispatchTelemetry: function (data) {
            var responseTime = (data.res.config.responseTimestamp - data.res.config.requestTimestamp);
            EkstepEditor.telemetryService.apiCall({ "path": data.url, "method": data.method, "request": data.request, "response": "","responseTime": responseTime, "status": data.res.status, "uip": "" }); 
        }
    }
});