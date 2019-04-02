/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
'use strict'

angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).factory('cacheBustInterceptor', ['$templateCache', function ($templateCache) {
	return {
		request: function (config) {
			config.alreadyCached = $templateCache.get(config.url)
			if (!config.alreadyCached) {
				config.url = config.url + '?' + ecEditor.getConfig('build_number')
			}
			return config
		}
	}
}]).config(['$locationProvider', '$httpProvider', function ($locationProvider, $httpProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
	$httpProvider.interceptors.push('cacheBustInterceptor')
}])
angular.module('editorApp').controller('MainCtrl', ['$scope', '$timeout', '$http', '$location', '$q', '$window', '$document', '$ocLazyLoad', '$rootScope',
	function ($scope, $timeout, $http, $location, $q, $window, $document, $ocLazyLoad, $rootScope) {
		var EDITOR_START_TIME = Date.now()
		var EDITOR_LOADED
		// Declare global variables
		$scope.showAppLoadScreen = true
		$scope.contentLoadedFlag = false

		$scope.showGenieControls = true

		$window.context = $window.context || window.parent.context

		$scope.developerMode = $location.search().developerMode

		$scope.appLoadMessage = [
			{ 'id': 1, 'message': 'Getting things ready for you', 'status': false }
		]
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

		// toolbar(sidebar menu)
		$scope.configCategory = { selected: '' }
		$scope.cancelLink = (($window.context && $window.context.cancelLink) ? $window.context.cancelLink : '')

		$scope.context = $window.context
		$scope.contentId = $location.search().contentId
		if (_.isUndefined($scope.contentId)) {
			$scope.contentId = (($window.context && $window.context.content_id) ? $window.context.content_id : undefined)
		}

		// sidebar scope starts
		$scope.registeredCategories = []
		$scope.loadNgModules = function (templatePath, controllerPath) {
			var files = []
			if (templatePath) files.push({ type: 'html', path: templatePath })
			if (controllerPath) files.push({ type: 'js', path: controllerPath + '?' + ecEditor.getConfig('build_number') })
			if (files.length) return $ocLazyLoad.load(files)
		}

		org.ekstep.contenteditor.sidebarManager.initialize({ loadNgModules: $scope.loadNgModules, scope: $scope })

		$scope.fireSidebarTelemetry = function (menu, menuType) {
			var pluginId = ''

			var pluginVer = ''

			var objectId = ''
			var pluginObject = org.ekstep.contenteditor.api.getCurrentObject() || org.ekstep.contenteditor.api.getCurrentStage()
			if (pluginObject) {
				pluginId = pluginObject.manifest.id
				pluginVer = pluginObject.manifest.ver
				objectId = pluginObject.id
			}
			$scope.telemetryService.interact({ 'type': 'modify', 'subtype': 'sidebar', 'target': menuType, 'pluginid': pluginId, 'pluginver': pluginVer, 'objectid': objectId, 'stage': org.ekstep.contenteditor.stageManager.currentStage.id })
		}

		$scope.addToSidebar = function (sidebar) {
			$scope.registeredCategories.push(sidebar)
			$scope.$safeApply()
		}

		$scope.refreshSidebar = function () {
			$scope.$safeApply()
		}
		// sidebar scope ends

		// Header scope starts
		$scope.headers = []

		$scope.addToHeader = function (header) {
			$scope.headers.push(header)
			$scope.$safeApply()
		}

		org.ekstep.contenteditor.headerManager.initialize({ loadNgModules: $scope.loadNgModules, scope: $scope })

		// Header scope ends

		$scope.contentDetails = {
			contentTitle: 'Untitled Content',
			contentImage: '/images/com_ekcontent/default-images/default-content.png',
			contentType: ''
		}

		$scope.showInstructions = true
		$scope.stageAttachments = {}

		// Functions
		$scope.closeLoadScreen = function (flag) {
			$scope.contentLoadedFlag = true
			if (!$scope.migrationFlag || flag) {
				$scope.showAppLoadScreen = false
			}
			$scope.$safeApply()
		}

		function toggleGenieControls () {
			if (!$scope.showGenieControls) {
				// Position the transparent image correctly on top of image
				setTimeout(function () {
					org.ekstep.contenteditor.api.jQuery('#geniecontrols').css({
						'display': 'block'
					})
				}, 500)
			}
			$scope.showGenieControls = !$scope.showGenieControls
		}

		$scope.toggleGenieControl = toggleGenieControls

		$scope.convertToJSON = function (contentBody) {
			try {
				var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false })
				return x2js.xml_str2json(contentBody)
			} catch (e) {

			}
		}

		$scope.parseContentBody = function (contentBody) {
			try {
				contentBody = JSON.parse(contentBody)
			} catch (e) {
				contentBody = $scope.convertToJSON(contentBody)
			}
			if (_.isUndefined(contentBody) || _.isNull(contentBody)) {
				$scope.contentLoadedFlag = true
				$scope.onLoadCustomMessage.show = true
				$scope.onLoadCustomMessage.text = 'Your content has errors! we are unable to read the content!'
				$scope.$safeApply()
				$scope.telemetryService.error({ 'env': 'content', 'stage': '', 'action': 'show error and stop the application', 'err': 'Unable to read the content due to parse error', 'type': 'PORTAL', 'data': '', 'severity': 'fatal' })
			};
			return contentBody
		}

		$scope.onStageDragDrop = function (dragEl, dropEl) {
			org.ekstep.contenteditor.stageManager.onStageDragDrop(org.ekstep.contenteditor.jQuery('#' + dragEl).attr('data-id'), org.ekstep.contenteditor.jQuery('#' + dropEl).attr('data-id'))
			org.ekstep.contenteditor.api.refreshStages()
		}

		$scope.refreshToolbar = function () {
			setTimeout(function () {
				org.ekstep.contenteditor.jQuery('.ui.dropdown').dropdown()
				org.ekstep.contenteditor.jQuery('.popup-item').popup()
				$scope.$safeApply()
			}, 500)
		}

		/**
         * Content Editor Initialization
         */
		// Get context from url or window or parentwindow
		// Set the context
		var context = org.ekstep.contenteditor.getWindowContext()
		context.contentId = context.contentId || $scope.contentId
		context.uid = context.user ? context.user.id : context.uid
		context.etags = context.etags || {}
		context.etags.app = context.app || context.etags.app || []
		context.etags.partner = context.partner || context.etags.partner || []
		context.etags.dims = context.dims || context.etags.dims || []

		// Get config from url or window or parentwindow
		// Add the absURL as below
		// Config to override
		var config = org.ekstep.contenteditor.getWindowConfig()
		config.absURL = $location.protocol() + '://' + $location.host() + ':' + $location.port() // Required
		$scope.showHelpBtn = config.showHelp || true
		/**
         * Load Content - Invoked once the content editor has loaded
         */
		$scope.loadContent = function () {
			EDITOR_LOADED = Date.now()
			org.ekstep.services.telemetryService.start(Date.now() - EDITOR_START_TIME)
			org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function (err, content) {
				if (err) {
					$scope.contentLoadedFlag = true
					$scope.onLoadCustomMessage.show = true
					$scope.onLoadCustomMessage.text = ':( Unable to fetch the content! Please try again later!'
					$scope.telemetryService.error({ 'env': 'content', 'stage': '', 'action': 'show error and stop the application', 'err': 'Unable to fetch content from remote', 'type': 'API', 'data': err.message, 'severity': 'fatal' })
				}
				if (!(content && content.body) && !err) {
					org.ekstep.contenteditor.stageManager.onContentLoad((new Date()).getTime())
					$scope.closeLoadScreen(true)
				} else if (content && content.body) {
					$scope.oldContentBody = angular.copy(content.body)
					var parsedBody = $scope.parseContentBody(content.body)
					if (parsedBody) org.ekstep.contenteditor.api.dispatchEvent('content:migration:start', { body: parsedBody, stageIcons: content.stageIcons })
				}
				if (content) {
					// Adding eventListener only after getting a successful response
					ecEditor.addEventListener('content:load:complete', function () {
						// subtype should be "content_load_time"
						$scope.telemetryService.interact({ id: 'screen', type: 'click', subtype: 'content_load_time', duration: (Date.now() - EDITOR_LOADED).toString() })
					})
					$scope.contentDetails = {
						contentTitle: content.name,
						contentImage: content.appIcon
					}
					content.contentType ? ($scope.contentDetails.contentType = '| ' + content.contentType) : ($scope.contentDetails.contentType = '')
					$scope.setTitleBarText($scope.contentDetails.contentTitle)
				}
			})
		}
		/**
             * Initialize the ekstep editor
             * @param  {object} context The context for the editor to load
             * @param  {object} config The config for the editor to override/set
             * @param  {function} $scope Scope of the controller
             * @param  {function} callback Function to be invoked once the editor is loaded
             */
		org.ekstep.contenteditor.init(context, config, $scope, $document, function () {

			var obj = _.find($scope.appLoadMessage, { 'id': 1 })
			if (_.isObject(obj)) {
				obj.message = 'Getting things ready for you'
				obj.status = true
			}
			$scope.contentService = org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE)
			$scope.popupService = org.ekstep.contenteditor.api.getService(ServiceConstants.POPUP_SERVICE)
			$scope.telemetryService = org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE)
			$scope.menus = org.ekstep.contenteditor.toolbarManager.menuItems
			$scope.contextMenus = org.ekstep.contenteditor.toolbarManager.contextMenuItems
			$scope.stages = org.ekstep.contenteditor.api.getAllStages()
			$scope.currentStage = org.ekstep.contenteditor.api.getCurrentStage()
			$scope.sidebarMenus = org.ekstep.contenteditor.sidebarManager.getSidebarMenu()
			$scope.configCategory.selected = $scope.sidebarMenus[0].id
			$scope.loadContent()

			/* KeyDown event to show ECML */
			$document.on('keydown', function (event) {
				if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.keyCode === 69) { /* ctrl+shift+e or command+shift+e */
					event.preventDefault()
					org.ekstep.contenteditor.api.dispatchEvent('org.ekstep.viewecml:show', {})
				}
			})
		})

		$scope.fireEvent = function (event) {
			if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data)
		}

		$scope.setTitleBarText = function (text) {
			if (text) document.title = text
		}

		$scope.fireToolbarTelemetry = function (menu, menuType) {
			$scope.telemetryService.interact({ 'type': 'click', 'subtype': 'menu', 'target': menuType, 'pluginid': menu.pluginId, 'pluginver': menu.pluginVer, 'objectid': menu.id, 'stage': org.ekstep.contenteditor.stageManager.currentStage.id })
		}

	}
])
