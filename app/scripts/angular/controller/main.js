/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
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
            $http.post('ecml', {data: EkstepEditor.stageManager.toECML()}).then(function(resp) {
                console.info('ECML', resp.data);
            });
        }

        $scope.saveContent = function() {
            var contentBody = EkstepEditor.stageManager.toECML();
            EkstepEditor.contentService.saveContent("do_10096922", contentBody, function(err, resp) {
                //TODO: call popup service to show success message
            });
        }
        /*
        EkstepEditor.contentService.getContent("do_10096922", function(err, contentBody) {   
            if (err) {
                console.error('Unable to get content');
            } 
            if(_.isUndefined(contentBody)) {
                EkstepEditor.eventManager.dispatchEvent('stage:create', {});
            } else {
                EkstepEditor.stageManager.fromECML(contentBody);
            }          
            EkstepEditor.stageManager.registerEvents();
        });*/
        EkstepEditor.stageManager.registerEvents();
        EkstepEditor.eventManager.dispatchEvent('stage:create', {});
        /*
        $http.get('test.ecml').then(function(response) {
            var x2js = new X2JS({attributePrefix: 'none'});
            var data = x2js.xml_str2json(response.data);
            EkstepEditor.stageManager.fromECML(data);
            EkstepEditor.stageManager.registerEvents();
        });
        */
    }
]);
