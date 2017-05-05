org.ekstep.contenteditor.piwikDispatcher = new(org.ekstep.contenteditor.IDispatcher.extend({
    type: "piwikDispatcher",
    piwikEndPoint: function() {
        return org.ekstep.contenteditor.config.baseURL + "/piwik";
    },
    idsite: 1,
    initDispatcher: function() {},
    dispatch: function(event) {
        if (!event) return;

        try {
            event = (typeof event === "string") ? event : JSON.stringify(event);
            /* istanbul ignore next. Cannot test jquery post */
            org.ekstep.contenteditor.jQuery.post(this.piwikEndPoint(), '?idsite=' + this.idsite + '&url=' + org.ekstep.services.config.absURL + location.pathname + '&e_c=ContentEditor&e_a=' + event + '&rec=1', function() {
            })
            .fail(function() {
                console.log("error: while piwik dispatch");
            });
        } catch (e) {
            console.log('error: piwik event cannot be stringify', e);
        }
    }
}));
