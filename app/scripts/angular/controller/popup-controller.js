angular.module('editorApp').controller('popupController', ['ngDialog', '$ocLazyLoad', function(ngDialog, $ocLazyLoad) {
    function loadNgModules(templatePath, controllerPath) {
        $ocLazyLoad.load([
            { type: 'html', path: templatePath },
            { type: 'js', path: controllerPath }
        ]);
    };

    function openModal(config) {
        if (config) ngDialog.open(config);
    };

    EkstepEditorAPI.getService('popup').initService(loadNgModules, openModal);

}]);
