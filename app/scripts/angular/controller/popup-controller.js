angular.module('editorApp').controller('popupController', ['ngDialog', '$ocLazyLoad', function(ngDialog, $ocLazyLoad) {
    function loadNgModules(templatePath, controllerPath) {
        $ocLazyLoad.load([
            { type: 'html', path: templatePath },
            { type: 'js', path: controllerPath }
        ]);
    };

    function openModal(config, callback) {
        if (config && callback) config.preCloseCallback = callback;
        if (config) ngDialog.open(config);
    };

    org.ekstep.contenteditor.api.getService('popup').initService(loadNgModules, openModal);

}]);
