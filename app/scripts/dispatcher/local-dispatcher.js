EkstepEditor.localDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        var http = angular.injector(["ng"]).get("$http");
        http.post('telemetry', event, function() {});
    }
}));
