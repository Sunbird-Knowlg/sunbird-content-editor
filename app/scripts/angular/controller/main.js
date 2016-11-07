'use strict';

angular.module('editorApp', []);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$window',
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
        EkstepEditor.init();
        $scope.menus = EkstepEditor.toolbarManager.menuItems;
        $scope.contextMenus = EkstepEditor.toolbarManager.contextMenuItems;
        $scope.stages = EkstepEditor.stageManager.stages;
        $scope.currentStage = EkstepEditor.stageManager.currentStage;
        $scope.fireEvent = function(event) {
            if (event) EkstepEditor.eventManager.dispatchEvent(event.id, event.data);
        };

        EkstepEditor.contentId ="do_10096674"; //$location.search().contentId || $window.contentId;
        EkstepEditorAPI.contentService = new EkstepEditor.contentService({ contentId: EkstepEditor.contentId});
        // Instantiate with blank stage
        EkstepEditor.eventManager.dispatchEvent('stage:create', {});
    }
]);
