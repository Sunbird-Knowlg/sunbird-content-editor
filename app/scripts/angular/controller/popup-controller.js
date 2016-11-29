angular.module('editorApp').controller('popupController', ['$scope','$uibModalInstance', 'data', '$sce', function($scope, $uibModalInstance, data, $sce) {
    var $ctrl = this,
        args = Array.prototype.slice.call(arguments);
    args.unshift($ctrl);
    $uibModalInstance.rendered.then(function() {
        EkstepEditorAPI.dispatchEvent('popupservice:controller:load', {
            controller: $ctrl,
            args: args
        });
    });
}]);