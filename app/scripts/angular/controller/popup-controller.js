angular.module('editorApp').controller('popupController', ['$scope', '$sce', '$compile', '$document', function($scope, $sce, $compile, $document) {
    var $ctrl = this,
        args;

    args = [$ctrl, $scope];
    EkstepEditorAPI.dispatchEvent('popupModal:show', semanticModal);

    function semanticModal(data) {
        $compile($document.find('.ui.modal'))($scope);
        $('.ui.modal').modal({
            onShow: function() {
                args.push(data);
                EkstepEditorAPI.dispatchEvent('popupservice:controller:load', {
                    controller: $ctrl,
                    args: args
                });
            },
            onHide: function() {

            }
        }).modal('show');
    };


}]);
