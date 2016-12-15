/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
'use strict';

angular.module('editorApp', ['ui.bootstrap']);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$q', '$window',
    function($scope, $timeout, $http, $location, $q, $window) {        
        EkstepEditorAPI.globalContext.contentId = $location.search().contentId;
        $scope.contentId = EkstepEditorAPI.globalContext.contentId;
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
        EkstepEditor.init(null, $location.protocol() + '://' + $location.host() + ':' + $location.port());
        $scope.menus = EkstepEditor.toolbarManager.menuItems;
        $scope.contextMenus = EkstepEditor.toolbarManager.contextMenuItems;
        $scope.stages = EkstepEditor.stageManager.stages;
        $scope.currentStage = EkstepEditor.stageManager.currentStage;
        $scope.fireEvent = function(event) {
            if (event) EkstepEditor.eventManager.dispatchEvent(event.id, event.data);
        };

        $scope.previewContent = function() {
            EkstepEditor.eventManager.dispatchEvent("atpreview:show", { contentBody: EkstepEditor.stageManager.toECML() });
            $http.post('ecml', {data: EkstepEditor.stageManager.toECML()}).then(function(resp) {
                console.info('ECML', resp.data);
            });
        };

        $scope.saveContent = function(){
            var contentBody = EkstepEditor.stageManager.toECML();
            EkstepEditor.contentService.saveContent(EkstepEditorAPI.globalContext.contentId, contentBody, function(err, resp) {
                if (resp) {
                    alert('Content saved successfully');
                }
            });
        }    

        $scope.loadAndInitPlugin = function() {
            if(_.isString($scope.pluginId)) {
                var loaded = EkstepEditor.pluginManager.loadAndInitPlugin($scope.pluginId);
                if(loaded === 1) {
                    alert($scope.pluginId + ' not found');
                }
            }
        }    
        
        EkstepEditor.contentService.getContent(EkstepEditorAPI.globalContext.contentId, function(err, contentBody) {
            if (err) {
                console.error('Unable to get content');
            }
            if(_.isUndefined(contentBody)) {
                EkstepEditor.eventManager.dispatchEvent('stage:create', {"position": "beginning"});
            } else {
                EkstepEditor.stageManager.fromECML(JSON.parse(contentBody));
            }
            EkstepEditor.stageManager.registerEvents();
        });        
    }
]);