org.ekstep.pluginframework.consoleDispatcher = new(org.ekstep.pluginframework.IDispatcher.extend({
    type: "consoleDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        console.log(event);
    }
}));
