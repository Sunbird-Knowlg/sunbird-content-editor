EkstepEditor.popupService = EkstepEditor.iService.extend({
    initService: function() {
        this.$uibModal = angular.injector(['ng', 'ui.bootstrap']).get('$uibModal');
    },
    open: function(options) {
        if (options) {
            options.template += _.isUndefined(options.modal_header) ? "" : '<div class=\"modal-header\">' + options.modal_header + '<\/div>';
            options.template += _.isUndefined(options.modal_content) ? "" : '<div class=\"modal-body\">' + options.modal_content + '<\/div>';
            options.template += _.isUndefined(options.modal_footer) ? "" : '<div class=\"modal-footer\">' + options.modal_footer + '<\/div>';
            return this.$uibModal.open(options);
        }
    }
});