org.ekstep.pluginframework.localDispatcher = new(org.ekstep.pluginframework.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {
        org.ekstep.contenteditor.jQuery.ajax({
            type: 'POST',
            url: 'telemetry',
            data: event,
            success: function(res) {}
        });
    }
}));
