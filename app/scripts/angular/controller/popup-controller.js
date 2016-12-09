angular.module('editorApp').controller('popupController', ['$scope', '$compile', '$document', '$injector', function($scope, $compile, $document, $injector) {
    var args = [],
        ctrl = this;

    EkstepEditorAPI.dispatchEvent('popupModal:show', semanticModal);

    function semanticModal(data) {
        $compile($document.find('.ui.modal'))($scope);
        $('.ui.modal').modal({
            onShow: function() {
                args = [ctrl, $injector, data];
                EkstepEditorAPI.dispatchEvent('popupservice:controller:load', {
                    controller: args[0],
                    args: args
                });
            },
            dimmerSettings: {
                opacity: 0.4
            }
        }).modal('show');
    };


}]);
