'use strict';

angular.module('editorApp').factory('apiTimeStamp', [function() {  
    var timeTaken = {
        request: function(config) {
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function(response) {
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timeTaken;
}]);