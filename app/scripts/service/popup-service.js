EkstepEditor.popupService = new(EkstepEditor.iService.extend({
    $uibModal: undefined,
    callback: undefined,
    initService: function(instance) {
        this.$uibModal = instance;
        var thisObj = this;
        EkstepEditorAPI.addEventListener('popupservice:controller:load', function(event, data) {
            thisObj.callback.apply(data.controller, data.args);
        }, this);
    },
    open: function(options, callback) {
        if (options && options.template) {
            this.callback = callback;
            options.controller = options.controller ? options.controller : 'popupController';
            options.controllerAs = options.controllerAs ? options.controllerAs : '$ctrl';
            options.resolve = options.resolve ? options.resolve : { data: {} };
            var popuptemplateHolder = "<script type=\"text\/ng-template\" id=\"popuptemplate\">" + options.template + "<\/script>";
            EkstepEditor.jQuery('#popuptemplate').remove();
            EkstepEditor.jQuery('#editorContainer').append(popuptemplateHolder);
            this.$uibModal.open(options);
        }
    }
}));