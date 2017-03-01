EkstepEditor.piwikDispatcher = new(EkstepEditor.IDispatcher.extend({
    type: "piwikDispatcher",
    piwikEndPoint: EkstepEditor.config.baseURL + "/piwik/piwik.php",
    idsite: 1,
    initDispatcher: function() {},
    dispatch: function(event) {
        if (!event) return;

        try {
            event = (typeof event === "string") ? event : JSON.stringify(event);
            EkstepEditorAPI.jQuery.post(this.piwikEndPoint + '?idsite=' + this.idsite + '&url=' + EkstepEditor.config.absURL+ location.pathname + '&e_c=ContentEditor&e_a=' + event + '&rec=1', function() {
                    //console.log('piwik event dispatched');
                })
                .fail(function() {
                    console.log("error: while piwik dispatch");
                });
        } catch (e) {
            console.log('error: piwik event cannot be stringify', e);
        }
    }
}));
