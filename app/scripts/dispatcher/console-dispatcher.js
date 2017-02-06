EkstepEditor.consoleDispatcher = new(EkstepEditor.IDispatcher.extend({
		type: "consoleDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        console.log(event);
    }
}));
