org.ekstep.contenteditor.IDispatcher = Class.extend({
    init: function() {
        this.initDispatcher();
    },
    initDispatcher: function() {throw 'Subclass should implement initDispatcher'},
    dispatch: function(event) {throw 'Subclass should implement dispatch'}
});