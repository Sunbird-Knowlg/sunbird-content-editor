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
            $http.post('ecml', {data: contentBody}).then(function(resp) {
                console.info(resp.data);
            });
        }
        EkstepEditor.contentService.getContent("do_10096674", function(err, content) {
            if(_.isUndefined(content.stage)) {
                // Instantiate with blank stage
                EkstepEditor.eventManager.dispatchEvent('stage:create', {});        
            }
        });
    }
]);
