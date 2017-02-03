EkstepEditor.piwikDispatcher = new(EkstepEditor.IDispatcher.extend({
    initDispatcher: function() {},
    dispatch: function(event) {
        EkstepEditor.iservice.http.post('/app/telemetry', event, {}, function() {});
    }
}));
