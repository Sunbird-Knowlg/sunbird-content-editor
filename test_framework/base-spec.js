org.ekstep.contenteditor = {}
org.ekstep.contenteditor.config = org.ekstep.contenteditor.config || {}
org.ekstep.contenteditor.config.basURL = 'https://dev.ekstep.in'

org.ekstep.contenteditor.toolbarManager = {
	registerMenu: function () {},
	registerContextMenu: function () {}
}

org.ekstep.contenteditor.sidebarManager = {
	registerSidebarMenu: function () {},
	loadCustomTemplate: function () {}
}

org.ekstep.services.telemetryService = {
	apiCall: function () {}
}

var config = {
	'pluginRepo': 'base/test_framework/data/content-plugins',
	'env': 'editor'
}

window.org.ekstep.pluginframework.initialize(config)

window.context = {
	'content_id': '',
	'sid': 'rctrs9r0748iidtuhh79ust993',
	'user': {
		'id': '390',
		'name': 'Chetan Sachdev',
		'email': 'chetan.sachdev@tarento.com',
		'avtar': 'https://release.ekstep.in/media/com_easysocial/defaults/avatars/user/medium.png',
		'logout': 'https://release.ekstep.in/index.php?option=com_easysocial&view=login&layout=logout'
	},
	'baseURL': 'https://release.ekstep.in/',
	'editMetaLink': '/component/ekcontent/contentform/do_10097535?Itemid=0'
}

org.ekstep.contenteditor.globalContext = window.context

window.ServiceConstants = {
	SEARCH_SERVICE: 'search',
	POPUP_SERVICE: 'popup',
	CONTENT_SERVICE: 'content',
	ASSESSMENT_SERVICE: 'assessment',
	LANGUAGE_SERVICE: 'language',
	META_SERVICE: 'meta',
	ASSET_SERVICE: 'asset',
	TELEMETRY_SERVICE: 'telemetry',
	USER_SERVICE: 'user',
	CONTENT_LOCK_SERVICE: 'lock'
}
