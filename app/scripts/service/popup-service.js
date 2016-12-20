EkstepEditor.popupService = new(EkstepEditor.iService.extend({    
    modal: undefined,
    initService: function(modalCallback) {
        this.modal = modalCallback;
    },
    open: function(options, callback) {
        if (options && options.template) {            
            options.data = _.isUndefined(options.data) ? {} : options.data;
            $(".ui.modal").remove();
            EkstepEditor.jQuery('#popuptemplate').append(options.template);
            this.modal && this.modal(options.data, callback);
        }
    }
}));
