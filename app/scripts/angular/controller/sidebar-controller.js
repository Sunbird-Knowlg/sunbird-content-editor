angular.module('editorApp')
    .controller('sidebarController', ['$scope', function($scope) {                       

        $scope.fireSidebarTelemetry = function(menu, menuType) {
            var pluginId = "", pluginVer = "", objectId = "";
            var pluginObject = org.ekstep.contenteditor.api.getCurrentObject() || org.ekstep.contenteditor.api.getCurrentStage();
            if(pluginObject) {
                pluginId = pluginObject.manifest.id;
                pluginVer = pluginObject.manifest.ver;
                objectId = pluginObject.id;
            }
            $scope.telemetryService.interact({ "type": "modify", "subtype": "sidebar", "target": menuType, "pluginid": pluginId, 'pluginver': pluginVer, "objectid": objectId, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
        };

                       
        $scope.settingsCategory = {};
        $scope.settingsCategory.selected = 'customize';
        $scope.selectedObject = { stage: true };
        $scope.currentObject =  {};
        $scope.currentObjectActions = [];

        $scope.showSettingsTab = function(event, data) {
            switch ($scope.settingsCategory.selected) {
                case 'properties':
                    $scope.showProperties(event, data);
                    break;                
                case 'actions':
                    $scope.showActions(event, data);
                    break;
                default:
                    $scope.showCustomize(event, data);
            }
            $scope.configCategory.selected = 'settings';
        };


        $scope.showActions = function() {
          org.ekstep.contenteditor.api.dispatchEvent('config:show:actions');
        };

        $scope.showCustomize = function(event, data) {
            $scope.settingsCategory.selected = 'customize';
            org.ekstep.contenteditor.api.dispatchEvent('config:show:customise');
        };

        $scope.showProperties = function(event, data) {
            var properties = org.ekstep.contenteditor.api.getCurrentObject() ? org.ekstep.contenteditor.api.getCurrentObject().getProperties() : org.ekstep.contenteditor.api.getCurrentStage().getProperties();
            $scope.pluginProperties = properties;
            $scope.settingsCategory.selected = 'properties';
        };

        $scope.showCommentsTab = function(event, data) {
            $scope.configCategory.selected = 'comments';
        };

        $scope.fireEvent = function(event) {
            org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
        };

        //$scope.$on('ocLazyLoad.fileLoaded', function(e, module) {
        //    $scope.refreshTemplates();
        //});

        org.ekstep.contenteditor.api.addEventListener("content:load:complete", function() {
            $scope.refreshTemplates();
        });

        $scope.enableTemplates = function() {
            $scope.customiseTabLoaded = true;
            $scope.actionsTabLoaded = true;
            $scope.propertiesTabLoaded = true;            
        };

        $scope.disableTemplates = function() {
            $scope.customiseTabLoaded = false;
            $scope.actionsTabLoaded = false;
            $scope.propertiesTabLoaded = false;            
        };

        $scope.refreshTemplates = function() {
           $scope.disableTemplates();
           $scope.enableTemplates();
        };   

        
             
    }]);
