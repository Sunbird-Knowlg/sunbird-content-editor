/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
'use strict';

angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$q', '$window', '$document',
    function($scope, $timeout, $http, $location, $q, $window, $document) {

        // Global functions to be instantiated first
        
        $scope.fireEvent = function(event) {
            if (event) EkstepEditor.eventManager.dispatchEvent(event.id, event.data);
        };

        // Declare global variables
        $scope.showAppLoadScreen = true;
        $scope.contentLoadedFlag = false;
        $scope.appLoadMessage = [
            { 'message': 'Loading Editor...', 'status': true },
            { 'message': 'Loading Plugins...', 'status': true }
        ];
        $scope.migrationFlag = false;
        $scope.saveBtnEnabled = true;
        $scope.model = {
            teacherInstructions: undefined
        }
        $scope.migration = {
            showMigrationError: false,
            showPostMigrationMsg: false,
            showMigrationSuccess: false
        }

        $scope.onLoadCustomMessage = {
            show : false,
            text: undefined
        }
        $scope.cancelLink = (($window.context && $window.context.cancelLink) ? $window.context.cancelLink : "");
        $scope.reportIssueLink = (($window.context && $window.context.reportIssueLink) ? $window.context.reportIssueLink : "");

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
        $scope.userDetails = !EkstepEditorAPI._.isUndefined(window.context) ? window.context.user : undefined;
        $scope.showGenieControls = false;
        $scope.stageAttachments = {};

        // TODO: Figure out what the below code does
        EkstepEditorAPI.jQuery('.browse.item.at').popup({ on: 'click', setFluidWidth: false, position: 'bottom right' });

        // Functions
        $scope.closeLoadScreen = function(flag) {
            $scope.contentLoadedFlag = true;
            if (!$scope.migrationFlag || flag) {
                $scope.showAppLoadScreen = false;
            }
            $scope.$safeApply();
        }

        $scope.enableSave = function() {
            //$scope.saveBtnEnabled = true;
            //$scope.$safeApply();
        }

        $scope.previewContent = function(fromBeginning) {
            EkstepEditorAPI.getCanvas().deactivateAll().renderAll();
            var currentStage = _.isUndefined(fromBeginning) ? true : false;
            EkstepEditor.eventManager.dispatchEvent("atpreview:show", { contentBody: EkstepEditor.stageManager.toECML(), 'currentStage': currentStage });
            $http.post('ecml', { data: EkstepEditor.stageManager.toECML() }).then(function(resp) {
                console.info('ECML', resp.data);
            });
        };

        $scope.saveContent = function(cb) {
            if ($scope.saveBtnEnabled) {
                $scope.saveBtnEnabled = false;
                if ($scope.migrationFlag) {
                    $scope.showMigratedContentSaveDialog();
                } else {
                    var contentBody = EkstepEditor.stageManager.toECML();
                    EkstepEditor.contentService.saveContent(EkstepEditorAPI.globalContext.contentId, contentBody, function(err, resp) {
                        if (resp) {
                            //$scope.saveBtnEnabled = false;
                            $scope.$safeApply();
                            $scope.saveNotification('success');
                        } else {
                            //$scope.saveBtnEnabled = true;
                            $scope.$safeApply();
                            $scope.saveNotification('error');
                        }
                        $scope.saveBtnEnabled = true;
                        if (cb) cb(err, resp);                        
                    });
                }
            }
        }

        $scope.saveMigratedContent = function(cb) {
            console.log("Saving content with old body");
            var contentBody = EkstepEditor.stageManager.toECML();
            EkstepEditor.contentService.saveMigratedContent(EkstepEditorAPI.globalContext.contentId, contentBody, $scope.oldContentBody, function(err, resp) {
                if (resp) {
                    //$scope.saveBtnEnabled = false;
                    $scope.$safeApply();
                    $scope.saveNotification('success');
                } else {
                    //$scope.saveBtnEnabled = true;
                    $scope.$safeApply();
                    $scope.saveNotification('error');
                }
                $scope.saveBtnEnabled = true;
                if (cb) cb(err, resp);
            });
        }

        $scope.loadAndInitPlugin = function() {
            if (_.isString($scope.pluginId)) {
                var loaded = EkstepEditor.pluginManager.loadAndInitPlugin($scope.pluginId);
                if (loaded === 1) {
                    alert($scope.pluginId + ' not found');
                }
            }
        }

        $scope.toggleGenieControl = function() {
            if (!$scope.showGenieControls) {
                //Position the transparent image correctly on top of image
                var canvasOffset = EkstepEditorAPI.jQuery('#canvas').offset();
                setTimeout(function() {
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

        $scope.loadContent = function() {
            EkstepEditor.contentService.getContent(EkstepEditorAPI.globalContext.contentId, function(err, content) {
                if (err) {                    
                    $scope.contentLoadedFlag = true;
                    $scope.onLoadCustomMessage.show = true;
                    $scope.onLoadCustomMessage.text = ":( Unable to fetch the content! Please try again later!";
                }
                if (!(content && content.body) && !err) {
                    EkstepEditor.stageManager.registerEvents();
                    EkstepEditor.eventManager.dispatchEvent('stage:create', { "position": "beginning" });
                    $scope.closeLoadScreen(true);
                } else if (content && content.body) {
                    $scope.oldContentBody = angular.copy(content.body);
                    var parsedBody = $scope.parseContentBody(content.body);
                    if (parsedBody) EkstepEditorAPI.dispatchEvent("content:migration:start", parsedBody);
                    console.log('contentBody', parsedBody);                    
                }
                if (content) {
                    var concepts = "";
                    if (!EkstepEditorAPI._.isUndefined(content.concepts)) {
                        concepts = EkstepEditorAPI._.size(content.concepts) <= 1 ? content.concepts[0].name : content.concepts[0].name+' & '+ (EkstepEditorAPI._.size(content.concepts) - 1 )+' more';
                    }
                    $scope.contentDetails = {
                        contentTitle: content.name,
                        contentImage: content.appIcon,
                        contentType: '| '+content.contentType,
                        contentConcepts: concepts
                    };
                    $scope.setTitleBarText($scope.contentDetails.contentTitle);
                }
            });
        }

        $scope.convertToJSON = function(contentBody) {
            try {            
                var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false });
                return x2js.xml_str2json(contentBody);            
            } catch(e) {
                return;
            }
        }

        $scope.parseContentBody = function(contentBody) {
            try {
                contentBody = JSON.parse(contentBody);
            } catch (e) {
                contentBody = $scope.convertToJSON(contentBody);
            }
            if (_.isUndefined(contentBody) || _.isNull(contentBody)) {
                $scope.contentLoadedFlag = true;
                $scope.onLoadCustomMessage.show = true;
                $scope.onLoadCustomMessage.text = "Your content has errors! we are unable to read the content!";
                $scope.$safeApply();
            };
            return contentBody;
        }

        $scope.onStageDragDrop = function(dragEl, dropEl) {
            EkstepEditor.stageManager.onStageDragDrop(EkstepEditor.jQuery('#' + dragEl).attr('data-id'), EkstepEditor.jQuery('#' + dropEl).attr('data-id'));
            EkstepEditorAPI.refreshStages();
        }

        $scope.editContentMeta = function() {
            var config = {
                template: 'editContentMetaDialog',
                controller: ['$scope', 'mainCtrlScope', function($scope, mainCtrlScope) {
                    $scope.routeToContentMeta = function(save) {
                        $scope.closeThisDialog();
                        mainCtrlScope.routeToContentMeta(save);
                    }
                }],
                resolve: {
                    mainCtrlScope: function() {
                        return $scope;
                    }
                },
                showClose: false
            };

            EkstepEditorAPI.getService('popup').open(config);
        }

        $scope.routeToContentMeta = function(save) {
            $scope.enableSave();
            if (save) {
                $scope.saveContent(function(err, resp) {
                    if (resp) $window.location.assign(window.context.editMetaLink);
                });
            } else {
                $window.location.assign(window.context.editMetaLink);
            }
        };

        $scope.saveNotification = function(message) {
            message = (message === 'success') ? 'saveSuccessMessage.html' : 'saveErrorMessage.html';
            var config = {
                template: message,
                showClose: false
            }
            EkstepEditorAPI.getService('popup').open(config);
        };
        $scope.showMigratedContentSaveDialog = function() {
            var instance = $scope;
            EkstepEditorAPI.getService('popup').open({
                template: 'migratedContentSaveMsg.html',
                controller: ['$scope', function($scope) {
                    $scope.saveContent = function() { 
                        instance.migrationFlag = false;
                        instance.saveMigratedContent(); 
                    }

                    $scope.enableSaveBtn = function() {
                        instance.saveBtnEnabled = true;
                    }
                }],
                showClose: false,
                closeByDocument: false,
                closeByEscape: false
            });
        }

        $scope.updateTeacherInstructionsOnKeyPress = function() {
            EkstepEditorAPI.getCurrentStage().addParam('instructions', $scope.model.teacherInstructions);
        }

        $scope.resetTeacherInstructions = function(event, data) {
            $scope.$safeApply(function() {
                $scope.model.teacherInstructions = '';
                $scope.model.teacherInstructions = EkstepEditorAPI.getStage(data.stageId).getParam('instructions');
            });
        }

        $scope.initTelemetry = function() {
            /*EkstepEditor.telemetryService.start({
                uid: $window.context.user.id,
                sid: $window.context.sid,
                content_id: EkstepEditorAPI.globalContext.contentId
            }, {
                defaultPlugins: [], // TODO: Get the default plugins loaded by the editor
                loadtimes: { // TODO: capture these at all places
                    plugins: 0,
                    migration: 0,
                    contentLoad: 0
                }
            });*/
        }

        EkstepEditor.toolbarManager.setScope($scope);
        EkstepEditor.init(null, $location.protocol() + '://' + $location.host() + ':' + $location.port(), function() {
            $scope.initEditor();
        });

        $scope.initEditor = function() {

            $scope.menus = EkstepEditor.toolbarManager.menuItems;
            $scope.contextMenus = EkstepEditor.toolbarManager.contextMenuItems;
            $scope.stages = EkstepEditor.stageManager.stages;
            $scope.currentStage = EkstepEditor.stageManager.currentStage;
            EkstepEditor.eventManager.addEventListener("stage:select", $scope.resetTeacherInstructions, this);
            EkstepEditor.eventManager.addEventListener("stage:add", $scope.resetTeacherInstructions, this);
            $scope.loadContent();
            $scope.initTelemetry();
            /* KeyDown event to show ECML */
            $document.on("keydown", function(event) {
                if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.keyCode == 69) { /*ctrl+shift+e or command+shift+e*/
                    event.preventDefault();
                    EkstepEditor.eventManager.dispatchEvent("org.ekstep.viewecml:show", {});
                }
            });
        }

        $scope.setTitleBarText = function(text) {
            if(text) document.title = text;
        };
    }
]);
