EkstepEditor.localDispatcher = new(EkstepEditor.IDispatcher.extend({
    initDispatcher: function() {},
    dispatch: function(event) {
        (new EkstepEditor.iService).http.post('telemetry', event, {}, function() {});
    }
}));
