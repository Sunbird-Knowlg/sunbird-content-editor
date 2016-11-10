EkstepEditor.iService = Class.extend({
    init: function(config) {
        this.initService(config);
    },
    initService: function(config) {},
    http: {
        $http: angular.injector(["ng"]).get("$http"),
        get: function(url, config) {
            if (!config) config = {};
            return this.$http.get(url, config);
        },
        post: function(url, data, config) {
            if (!config) config = {};
            return this.$http.post(url, data, config);
        },
        patch: function(url, data, config) {
            if (!config) config = {};
            return this.$http.patch(url, data, config);
        }
    }
});
