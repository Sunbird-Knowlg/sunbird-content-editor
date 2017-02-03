EkstepEditor.consoleDispatcher = new(EkstepEditor.IDispatcher.extend({
    initDispatcher: function() {},
    dispatch: function(event) {
        console.log(event);
    }
}));
