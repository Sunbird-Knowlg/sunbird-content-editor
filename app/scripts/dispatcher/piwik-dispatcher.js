EkstepEditor.piwikDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "piwikDispatcher",
    piwikEndPoint: EkstepEditor.config.baseURL + "/piwik/piwik.php",
    idsite: 1,
    initDispatcher: function() {},
    dispatch: function(event) {
        if (!event) return;

        try {
            event = (typeof event === "string") ? event : JSON.stringify(event);
            /* istanbul ignore next. Cannot test jquery post */
            EkstepEditorAPI.jQuery.post(this.piwikEndPoint + '?idsite=' + this.idsite + '&url=' + EkstepEditor.config.absURL + location.pathname + '&e_c=ContentEditor&e_a=' + event + '&rec=1', function() {
            })
            .fail(function() {
                console.log("error: while piwik dispatch");
            });
        } catch (e) {
            console.log('error: piwik event cannot be stringify', e);
        }
    }
}));
