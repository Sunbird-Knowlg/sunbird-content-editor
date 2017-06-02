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
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$q', '$window', '$document', '$ocLazyLoad',
    function($scope, $timeout, $http, $location, $q, $window, $document, $ocLazyLoad) {

        // Declare global variables
        $scope.showAppLoadScreen = true;
        $scope.contentLoadedFlag = false;
        $scope.showGenieControls = false;
        $scope.editorState = undefined;

        $scope.developerMode = $location.search().developerMode;
        
        $scope.appLoadMessage = [
            { 'id': 1, 'message': 'Getting things ready for you', 'status': false }
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
            show: false,
            text: undefined
        }

        //toolbar(sidebar menu)
        $scope.configCategory = { selected: '' };        
        $scope.cancelLink = (($window.context && $window.context.cancelLink) ? $window.context.cancelLink : "");
        $scope.reportIssueLink = (($window.context && $window.context.reportIssueLink) ? $window.context.reportIssueLink : "");

        $scope.context = $window.context;
        $scope.contentId = $location.search().contentId;
        if (_.isUndefined($scope.contentId)) {
            $scope.contentId = (($window.context && $window.context.content_id) ? $window.context.content_id : undefined)
        }

        //sidebar scope starts
        $scope.registeredCategories = [];
        $scope.loadNgModules = function(templatePath, controllerPath) {
            var files = [];
            if (templatePath) files.push({ type: 'html', path: templatePath });
            if (controllerPath) files.push({ type: 'js', path: controllerPath });
            if (files.length) return $ocLazyLoad.load(files)           
        };  

        org.ekstep.contenteditor.sidebarManager.initialize({ loadNgModules: $scope.loadNgModules, scope: $scope });

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

        $scope.addToSidebar = function(sidebar) {
            $scope.registeredCategories.push(sidebar);                                                            
            $scope.$safeApply();
        };

        $scope.refreshSidebar = function() {
            $scope.$safeApply();
        };
        //sidebar scope ends


        $scope.contentDetails = {
            contentTitle: "Untitled Content",
            contentImage: "/images/com_ekcontent/default-images/default-content.png",
            contentConcepts: "No concepts selected",
            contentType: ""
        };
        $scope.userDetails = !_.isUndefined(window.context) ? window.context.user : undefined;
        $scope.showInstructions = true;
        $scope.stageAttachments = {};

        // TODO: Figure out what the below code does
        org.ekstep.contenteditor.api.jQuery('.browse.item.at').popup({ on: 'click', setFluidWidth: false, position: 'bottom right' });

        // Functions
        $scope.closeLoadScreen = function(flag) {
            $scope.contentLoadedFlag = true;
            if (!$scope.migrationFlag || flag) {
                $scope.showAppLoadScreen = false;
            }
            $scope.$safeApply();
        }

        $scope.previewContent = function(fromBeginning) {            
            var currentStage = _.isUndefined(fromBeginning) ? true : false;
            org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: org.ekstep.contenteditor.stageManager.toECML(), 'currentStage': currentStage });            
        };

        $scope.saveContent = function() {
            if ($scope.saveBtnEnabled) {
                $scope.saveBtnEnabled = false;
                org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
                // TODO: Show saving dialog
                var contentBody = org.ekstep.contenteditor.stageManager.toECML();
                $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()), editorState: JSON.stringify($scope.editorState) }, contentBody, function(err, res) {
                    if (err) {
                        if(res && !ecEditor._.isUndefined(res.responseJSON)){
                            // This could be converted to switch..case to handle different error codes
                            if (res.responseJSON.params.err == "ERR_STALE_VERSION_KEY")
                            $scope.showConflictDialog();
                        } else {
                            $scope.saveNotification('error'); 
                        }
                    }else if(res && res.data.responseCode == "OK"){
                        $scope.saveNotification('success');
                    }
                    
                    $scope.saveBtnEnabled = true;                                                           
                });
            }
        }

        $scope.saveBrowserContent = function() {
            // Fetch latest versionKey and then save the content from browser
            $scope.fetchPlatformContentVersionKey(function(platformContentVersionKey){
                //Invoke save function here...
                $scope.saveContent();
            });
        }

        $scope.refreshContent = function() {
            // Refresh the browser as user want to fetch the version from platform
            location.reload();
        }

        $scope.previewPlatformContent = function(){
            // Fetch latest content body from Platform and then show preview
            $scope.fetchPlatformContentBody(function(platformContentBody){
                org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: platformContentBody, 'currentStage': true }); 
            });
        };

        $scope.fetchPlatformContentBody = function(cb) {
            // Get the latest VersionKey and then save content
            org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
                if (err) {
                    alert("Failed to get updated content. Please report an issue.");
                }
                if (content && content.body) {
                    try {
                        var contentBody = JSON.parse(content.body);
                        cb(contentBody);
                    } catch (e) {
                        alert("Failed to parse body from platform. Please report an issue.");
                        //contentBody = $scope.convertToJSON(content.body);
                    }
                }
            });
        };

        $scope.fetchPlatformContentVersionKey = function(cb) {
            // Get the latest VersionKey and then save content
            org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContentVersionKey(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
                if (err) {
                    alert("Failed to get updated version key. Please report an issue.");
                }
                // if versionKey is available, pass success and save
                if (content.versionKey) {
                    cb(content);
                }
            });
        };



        

        $scope.patchContent = function(metadata, body, cb) {
            if ($scope.migrationFlag) {
                if (!metadata) metadata = {};
                metadata.oldContentBody = $scope.oldContentBody;
                var migrationPopupCb = function() {
                    $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
                }
                $scope.showMigratedContentSaveDialog(migrationPopupCb);
            } else {
                $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
            }
        }

        $scope.toggleGenieControl = function() {
            if (!$scope.showGenieControls) {
                //Position the transparent image correctly on top of image
                var canvasOffset = org.ekstep.contenteditor.api.jQuery('#canvas').offset();
                setTimeout(function() {
                    org.ekstep.contenteditor.api.jQuery('#geniecontrols').offset({
                        "top": canvasOffset.top,
                        "left": canvasOffset.left,
                    });

                    org.ekstep.contenteditor.api.jQuery('#geniecontrols').css({
                        "display": 'block'
                    });
                }, 500);

            }
            $scope.showGenieControls = !$scope.showGenieControls;
        }

        $scope.convertToJSON = function(contentBody) {
            try {
                var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false });
                return x2js.xml_str2json(contentBody);
            } catch (e) {
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
                $scope.telemetryService.error({ "env": "content", "stage": "", "action": "show error and stop the application", "err": "Unable to read the content due to parse error", "type": "PORTAL", "data": "", "severity": "fatal" });
            };
            return contentBody;
        }

        $scope.onStageDragDrop = function(dragEl, dropEl) {
            org.ekstep.contenteditor.stageManager.onStageDragDrop(org.ekstep.contenteditor.jQuery('#' + dragEl).attr('data-id'), org.ekstep.contenteditor.jQuery('#' + dropEl).attr('data-id'));
            org.ekstep.contenteditor.api.refreshStages();
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

            org.ekstep.contenteditor.api.getService('popup').open(config);
        }

        $scope.routeToContentMeta = function(save) {
            if (save) {
                var contentBody = org.ekstep.contenteditor.stageManager.toECML();
                $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
                    if (res) {
                        $scope.saveNotification('success');
                        $window.location.assign(window.context.editMetaLink);                    
                    }
                    if (err) $scope.saveNotification('error');
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
            $scope.popupService.open(config);
        };

        $scope.showConflictDialog = function(){
            var instance = $scope;
            $scope.popupService.open({
                template: 'conflictDialog.html',
                controller: ['$scope', function($scope) {
                    //Platform copy
                    $scope.previewPlatformContent = function(){
                        instance.previewPlatformContent();
                    };
                    $scope.saveBrowserContent = function(){
                        instance.saveBrowserContent();
                        $scope.closeThisDialog();
                    };
                    //Existing copy
                    $scope.previewContent = function(){
                        instance.previewContent();
                    };
                    $scope.refreshContent = function(){
                        instance.refreshContent();
                    };
                    $scope.firetelemetry = function(menu, menuType){
                        instance.telemetryService.interact({ "type": "click", "subtype": "popup", "target": menuType, "pluginid": '', 'pluginver': '', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
                    };
                    $scope.showAdvancedOption = false;
                }],
                className: 'ngdialog-theme-plain',
                showClose: false,
                closeByDocument: true,
                closeByEscape: true
            });
        };

        $scope.showMigratedContentSaveDialog = function(callback) {
            var instance = $scope;
            $scope.popupService.open({
                template: 'migratedContentSaveMsg.html',
                controller: ['$scope', function($scope) {
                    $scope.saveContent = function() {
                        instance.migrationFlag = false;
                        callback();
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
        $scope.refreshToolbar = function() {
            setTimeout(function() {
                org.ekstep.contenteditor.jQuery(".ui.dropdown").dropdown();
                org.ekstep.contenteditor.jQuery(".popup-item").popup();
                $scope.$safeApply();                
            }, 500);
        }

        /** 
         * Content Editor Initialization
         */
        // Set the context
        var context = {
            uid: $window.context.user.id,
            sid: $window.context.sid,
            contentId: $scope.contentId
        }
        // Config to override
        var config = {
            absURL: $location.protocol() + '://' + $location.host() + ':' + $location.port() // Required
        }

        /**
         * Load Content - Invoked once the content editor has loaded
         */
        $scope.loadContent = function() {
            org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
                if (err) {
                    $scope.contentLoadedFlag = true;
                    $scope.onLoadCustomMessage.show = true;
                    $scope.onLoadCustomMessage.text = ":( Unable to fetch the content! Please try again later!";
                    $scope.telemetryService.error({ "env": "content", "stage": "", "action": "show error and stop the application", "err": "Unable to fetch content from remote", "type": "API", "data": err, "severity": "fatal" });
                }
                if (!(content && content.body) && !err) {
                    org.ekstep.contenteditor.stageManager.onContentLoad((new Date()).getTime());
                    $scope.closeLoadScreen(true);
                } else if (content && content.body) {
                    $scope.oldContentBody = angular.copy(content.body);
                    var parsedBody = $scope.parseContentBody(content.body);
                    if (parsedBody) org.ekstep.contenteditor.api.dispatchEvent("content:migration:start", { body: parsedBody, stageIcons: content.stageIcons });
                }
                if (content) {
                    var concepts = "";
                    if (!_.isUndefined(content.concepts)) {
                        concepts = _.size(content.concepts) <= 1 ? content.concepts[0].name : content.concepts[0].name + ' & ' + (_.size(content.concepts) - 1) + ' more';
                    }
                    $scope.contentDetails = {
                        contentTitle: content.name,
                        contentImage: content.appIcon,
                        contentType: '| ' + content.contentType,
                        contentConcepts: concepts
                    };
                    $scope.setTitleBarText($scope.contentDetails.contentTitle);
                }
            });
        }
        /**
         * Initialize the ekstep editor
         * @param  {object} context The context for the editor to load
         * @param  {object} config The config for the editor to override/set
         * @param  {function} $scope Scope of the controller
         * @param  {function} callback Function to be invoked once the editor is loaded
         */
        org.ekstep.contenteditor.init(context, config, $scope, $document, function() {
            var obj = _.find($scope.appLoadMessage, { 'id': 1 });
            if (_.isObject(obj)) {
                obj.message = "Getting things ready for you";
                obj.status = true;
            }
            $scope.contentService = org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE);
            $scope.popupService = org.ekstep.contenteditor.api.getService(ServiceConstants.POPUP_SERVICE);
            $scope.telemetryService = org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE);
            $scope.menus = org.ekstep.contenteditor.toolbarManager.menuItems;
            $scope.contextMenus = org.ekstep.contenteditor.toolbarManager.contextMenuItems;
            $scope.stages = org.ekstep.contenteditor.api.getAllStages();
            $scope.currentStage = org.ekstep.contenteditor.api.getCurrentStage();
            $scope.sidebarMenus = org.ekstep.contenteditor.sidebarManager.getSidebarMenu();
            $scope.configCategory.selected = $scope.sidebarMenus[0].id;

            $scope.loadContent();
            /* KeyDown event to show ECML */
            $document.on("keydown", function(event) {
                if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.keyCode == 69) { /*ctrl+shift+e or command+shift+e*/
                    event.preventDefault();
                    org.ekstep.contenteditor.api.dispatchEvent("org.ekstep.viewecml:show", {});
                }
            });
        });

        $scope.fireEvent = function(event) {
            if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
        };

        $scope.setTitleBarText = function(text) {
            if (text) document.title = text;
        };

        $scope.fireToolbarTelemetry = function(menu, menuType) {
            $scope.telemetryService.interact({ "type": "click", "subtype": "menu", "target": menuType, "pluginid": '', 'pluginver': '', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
        };

        $scope.setEditorState = function(event, data) {            
            if (data) $scope.editorState = data;
        };

        org.ekstep.pluginframework.eventManager.addEventListener('org.ekstep.editorstate:state', $scope.setEditorState, $scope);

    }
]);

org.ekstep.contenteditor.jQuery(document).ready(function() {
    var newheight = $(window).innerHeight() - 114;  
    org.ekstep.contenteditor.jQuery('.scrollable-slides').css("height",newheight + "px");  
});
