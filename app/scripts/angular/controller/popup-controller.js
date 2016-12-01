angular.module('editorApp').controller('popupController', ['$scope', '$compile', '$document', '$injector', function($scope, $compile, $document, $injector) {
    var args = [this, $injector];

    EkstepEditorAPI.dispatchEvent('popupModal:show', semanticModal);

    function semanticModal(data) {
        $compile($document.find('.ui.modal'))($scope);
        $('.ui.modal').modal({
            onShow: function() {
                args.push(data);
                EkstepEditorAPI.dispatchEvent('popupservice:controller:load', {
                    controller: args[0],
                    args: args
                });
            },
            onHide: function() {

            }
        }).modal('show');
    };


}]);
