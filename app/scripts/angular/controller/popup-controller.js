angular.module('editorApp').controller('popupController', ['$scope','$uibModalInstance', 'data', function($scope, $uibModalInstance, data) {
    var $ctrl = this,
        args = Array.prototype.slice.call(arguments);

    args.unshift($ctrl);
    EkstepEditorAPI.addEventListener('popupservice:fire', function(events, callback) {
        callback.apply($ctrl, args);
    }, $ctrl);
}]);
