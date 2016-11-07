EkstepEditor.httpService = function() {
    var $http = angular.injector(["ng"]).get("$http");
    return {
        get: function(url, config) {
            if (!config) config = {};
            return $http.get(url, config);
        },
        post: function(url, config) {
            if (!config) config = {};
            return $http.post(url, config);
        },
        patch: function(url, data, config) {
            if (!config) config = {};
            return $http.patch(url, data, config);
        }
    }
}
