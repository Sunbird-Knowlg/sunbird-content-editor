angular.module('editorApp')
    .controller('sidebarController', ['$scope', function($scope) {

        $scope.fireSidebarTelemetry = function(menu, menuType) {
            var pluginId = "",
                pluginVer = "",
                objectId = "";
            var pluginObject = org.ekstep.contenteditor.api.getCurrentObject() || org.ekstep.contenteditor.api.getCurrentStage();
            if (pluginObject) {
                pluginId = pluginObject.manifest.id;
                pluginVer = pluginObject.manifest.ver;
                objectId = pluginObject.id;
            }
            $scope.telemetryService.interact({ "type": "modify", "subtype": "sidebar", "target": menuType, "pluginid": pluginId, 'pluginver': pluginVer, "objectid": objectId, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
        };

        $scope.registeredCategories = [];

        $scope.showSidebar = function(event, data) {
            if (data) $scope.configCategory.selected = data.sidebarId;
            $scope.$safeApply();
        };

        $scope.register = function() {
            $scope.registeredCategories = org.ekstep.contenteditor.sidebarManager.getSidebarMenu();
            $scope.configCategory.selected = 'settings';
            var configMenus = org.ekstep.contenteditor.toolbarManager.getRegisterConfigMenu();
            _.forEach(configMenus, function(menu) {
                    org.ekstep.contenteditor.api.addEventListener(menu.onclick.id, $scope.showSidebar, $scope);
            });            
        };

        org.ekstep.contenteditor.api.addEventListener("content:load:complete", function() {
            $scope.register();
        });
    }]);
