angular.module('editorApp').controller('popupController', ['$scope', 'ngDialog', '$ocLazyLoad', '$templateCache', function ($scope, ngDialog, $ocLazyLoad, $templateCache) {
	function loadNgModules (templatePath, controllerPath, allowTemplateCache) {
		if (!allowTemplateCache) {
			return $ocLazyLoad.load([
				{ type: 'html', path: templatePath },
				{ type: 'js', path: controllerPath + '?' + ecEditor.getConfig('build_number') }
			])
		} else {
			if (angular.isString(templatePath) && templatePath.length > 0) {
				angular.forEach(angular.element(templatePath), function (node) {
					if (node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
						$templateCache.put(node.id, node.innerHTML)
					}
				})
			}
		}
	};

	function openModal (config, callback) {
		if (config && callback) config.preCloseCallback = callback
		if (config) ngDialog.open(config)
	};

	function init () {
		$scope.$on('ngDialog.closing', function () {
			org.ekstep.services.telemetryService.interact({ 'type': 'hide', 'subtype': 'close', 'target': 'popup', 'pluginid': '', 'pluginver': '', 'objectid': '', 'stage': ecEditor.getCurrentStage().id })
		})
	};

	init()

	org.ekstep.contenteditor.api.getService('popup').initService(loadNgModules, openModal)
}])
