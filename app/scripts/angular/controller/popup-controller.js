angular.module('editorApp').controller('popupController', ['$scope','ngDialog', '$ocLazyLoad', function($scope, ngDialog, $ocLazyLoad) {
    function loadNgModules(templatePath, controllerPath) {
        return $ocLazyLoad.load([
            { type: 'html', path: templatePath },
            { type: 'js', path: controllerPath }
        ]);
    };

    function openModal(config, callback) {
        if (config && callback) config.preCloseCallback = callback;
        if (config) ngDialog.open(config);
    };

    function init() {
        $scope.$on('ngDialog.closing', function() {
            org.ekstep.services.telemetryService.interact({"type": "hide", "subtype": "close", "target": "popup", "pluginid": "", "pluginver": '', "objectid": "", "stage": ecEditor.getCurrentStage().id });
        });
    };

    init();

    org.ekstep.contenteditor.api.getService('popup').initService(loadNgModules, openModal);

}]);
