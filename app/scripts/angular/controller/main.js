'use strict';

angular.module('editorApp', []);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http','$location', '$q','$window',
    function($scope, $timeout, $http, $location, $q, $window) {
        
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        EkstepEditor.toolbarManager.setScope($scope);
        EkstepEditor.init(null, $location.absUrl());
        $scope.menus = EkstepEditor.toolbarManager.menuItems;
        $scope.contextMenus = EkstepEditor.toolbarManager.contextMenuItems;
        $scope.stages = EkstepEditor.stageManager.stages;
        $scope.currentStage = EkstepEditor.stageManager.currentStage;
        $scope.fireEvent = function(event) {
            if (event) EkstepEditor.eventManager.dispatchEvent(event.id, event.data);
        };

        $scope.previewContent = function() {
            EkstepEditor.eventManager.dispatchEvent("atpreview:show", {contentBody: EkstepEditor.stageManager.toECML()});
        }

        $scope.saveContent = function() {
            var contentBody = EkstepEditor.stageManager.toECML();
            EkstepEditor.contentService.saveContent("do_10096922", contentBody, function(err, resp) {
                //TODO: call popup service to show success message
            });
        }
        EkstepEditor.contentService.getContent("do_10096922", function(err, response) {            
            if (err) {} // popup failure message
            //else if (_.isUndefined(response.data.result.content.body)) {
                // Instantiate with blank stage
                EkstepEditor.eventManager.dispatchEvent('stage:create', {});
            //}
        });
    }
]);
