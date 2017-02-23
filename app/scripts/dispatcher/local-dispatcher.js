EkstepEditor.localDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        EkstepEditorAPI.jQuery.post('telemetry', event, function() {});
    }
}));
