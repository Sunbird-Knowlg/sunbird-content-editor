EkstepEditor.iService = Class.extend({
    init: function(config) {
        this.initService(config);
    },
    initService: function(config) {},
    http: {
        $http: angular.injector(["ng"]).get("$http"),
        get: function(url, config, cb) {
            if (!config) config = {};
            return this.$http.get(url, config).then(function(res) { cb(null, res) }, function(res) { cb(res, null) });
        },
        post: function(url, data, config, cb) {
            if (!config) config = {};
            return this.$http.post(url, data, config).then(function(res) { cb(null, res) }, function(res) { cb(res, null) });
        },
        patch: function(url, data, config, cb) {
            if (!config) config = {};
            return this.$http.patch(url, data, config).then(function(res) { cb(null, res) }, function(res) { cb(res, null) });
        }
    }
});