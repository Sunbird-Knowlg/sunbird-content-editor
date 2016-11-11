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
            //var contentBody = EkstepEditor.stageManager.toECML();
            EkstepEditor.preview_content();
            // Invoke preview from there. Should be simple call
        }

        $scope.saveContent = function() {
            var contentBody = EkstepEditor.stageManager.toECML();
            console.info(contentBody); // For debugging
        }
        EkstepEditor.contentService.getContent("do_10096674", function(err, content) {
            if(_.isUndefined(content.stage)) {
                // Instantiate with blank stage
                EkstepEditor.eventManager.dispatchEvent('stage:create', {});        
            }
        });
    }
]);
