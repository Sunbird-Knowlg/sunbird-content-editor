EkstepEditor.localDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        (new EkstepEditor.iService).http.post('telemetry', event, {}, function() {});
    }
}));
