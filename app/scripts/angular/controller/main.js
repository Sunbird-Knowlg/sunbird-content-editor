/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
'use strict';

angular.module('editorApp', ['ngDialog', 'oc.lazyLoad']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$q', '$window',
    function($scope, $timeout, $http, $location, $q, $window) {
        $scope.progressBarShow = true;
        $scope.progressMessage = ['Loading App!'];        

        $('.ui.progress')
            .progress({
                total: 6,
                onSuccess: function(){
                    $scope.progressMessage.push('App is Ready!');
                    setTimeout(function(){$scope.progressBarShow = false; $scope.safeApply();},1000);
                }
            });

        $scope.progressBar = function(increment, message) {
            if (!increment) increment = 1;
            for (var i = 0; i < increment; i++) { 
                $('.ui.progress').progress('increment');
                if(message) $scope.progressMessage.push(message);
                $scope.safeApply();
            };
        };

        $scope.context = $window.context;
        EkstepEditorAPI.globalContext.contentId = $location.search().contentId;
        if (_.isUndefined(EkstepEditorAPI.globalContext.contentId)) {
            EkstepEditorAPI.globalContext.contentId = (($window.context && $window.context.content_id) ? $window.context.content_id : undefined)
        }
        $scope.contentId = EkstepEditorAPI.globalContext.contentId;
        $scope.contentDetails = {
            contentTitle: "Untitled Content",
            contentImage: "/images/com_ekcontent/default-images/default-content.png",
            contentConcepts: "No concepts selected",
            contentType: ""
        };
        $scope.userDetails = !EkstepEditorAPI._.isUndefined(window.context)? window.context.user : undefined;
        // EkstepEditorAPI.jQuery('.browse.item.at')
        //  .popup({
        //  on: 'click',setFluidWidth:false,
        //  position   : 'bottom right'
        // });
        $scope.showGenieControls = false;
        $scope.stageAttachments = {};
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

        $scope.toggleGenieControl = function(){
            if(!$scope.showGenieControls){
                //Position the transparent image correctly on top of image
                var canvasOffset = EkstepEditorAPI.jQuery('#canvas').offset();
                setTimeout(function(){
                    EkstepEditorAPI.jQuery('#geniecontrols').offset({
                        "top": canvasOffset.top,
                        "left": canvasOffset.left,
                    });

                    EkstepEditorAPI.jQuery('#geniecontrols').css({
                        "display": 'block'
                    });
                }, 500);
                
            }
            $scope.showGenieControls = !$scope.showGenieControls;
        }    
        
        EkstepEditor.contentService.getContent(EkstepEditorAPI.globalContext.contentId, function(err, contentBody) {
            if (err) {
                console.error('Unable to get content');
            }
            if(_.isUndefined(contentBody)) {
                EkstepEditor.eventManager.dispatchEvent('stage:create', {"position": "beginning"});
                EkstepEditor.stageManager.registerEvents();
                $scope.progressBar(6);
                $scope.safeApply();
            } else {                
                var parsedBody = $scope.parseContentBody(contentBody);                
                if(parsedBody) EkstepEditorAPI.dispatchEvent("migrationTask:start",parsedBody);
                console.log('contentBody', parsedBody);
            }
        });

        $scope.convertToJSON = function(contentBody) {
            var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false });
            return x2js.xml_str2json(contentBody);
        }

        $scope.parseContentBody = function(contentBody){
            try{
                contentBody = JSON.parse(contentBody);                
            }catch(e){
                contentBody = $scope.convertToJSON(contentBody);                
            }
            return contentBody;
        }

        $scope.onStageDragDrop = function(dragEl, dropEl) {
            EkstepEditor.stageManager.onStageDragDrop(EkstepEditor.jQuery('#' + dragEl).attr('data-id'), EkstepEditor.jQuery('#' + dropEl).attr('data-id'));
            EkstepEditorAPI.refreshStages();
        }
    }
]);