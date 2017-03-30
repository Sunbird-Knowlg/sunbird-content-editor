org.ekstep.pluginframework.localDispatcher = new(org.ekstep.pluginframework.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    http: angular.injector(["ng"]).get("$http"),
    dispatch: function(event) {        
        this.http.post('telemetry', event, /* istanbul ignore next. Difficult to write a test case */ function() {});
    }
}));
