angular.module('editorApp').controller('popupController', ['$scope', '$compile', '$document', '$injector', function($scope, $compile, $document, $injector) {
    var ctrl = this; 

    function semanticModal(data, callback) {        
        $compile($document.find('.ui.modal'))($scope);
        $('.ui.modal').modal({
            onShow: function() {                
                callback.apply(ctrl, [ctrl, $injector, data]);
            },
            dimmerSettings: {
                opacity: 0.4
            }
        }).modal('show');
    };

    EkstepEditor.popupService.initService(semanticModal);

}]);
