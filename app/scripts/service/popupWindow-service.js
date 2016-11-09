EkstepEditor.popupService = EkstepEditor.iService.extend({
    initService: function(options) {
        this.config = options;
        this.$uibModal = angular.injector(['ng','ui.bootstrap']).get('$uibModal');                
    },
    open: function() {
        return this.$uibModal.open(this.config);
    }
});
