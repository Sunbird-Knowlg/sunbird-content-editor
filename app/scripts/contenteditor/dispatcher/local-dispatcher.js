org.ekstep.contenteditor.localDispatcher = new(org.ekstep.contenteditor.IDispatcher.extend({
    type: "localDispatcher",
    initDispatcher: function() {},
    dispatch: function(event) {        
        event = (typeof event === "string") ? event : JSON.stringify(event);
        org.ekstep.contenteditor.jQuery.ajax({
            type: 'POST',
            url: 'telemetry',
            data: {event: event},
            success: function(res) {}
        });
    }
}));
