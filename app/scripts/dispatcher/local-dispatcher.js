EkstepEditor.localDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    http: angular.injector(["ng"]).get("$http"),
    dispatch: function(event) {        
        this.http.post('telemetry', event, function() {});
    }
}));
