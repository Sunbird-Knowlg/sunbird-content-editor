/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
/* istanbul ignore next. Fabric extension - cannot be tested */
if (window.fabric) {
	window.fabric.Object.prototype.toObject = (function (toObject) {
		return function () {
			return window.fabric.util.object.extend(toObject.call(this), {
				meta: this.meta
			})
		}
	})(window.fabric.Object.prototype.toObject)
}
// eslint-disable-next-line
var content_editor = function () {}
content_editor.prototype.jQuery = window.$
content_editor.prototype._ = window._
// eslint-disable-next-line
window.org.ekstep.contenteditor = new content_editor()
// eslint-disable-next-line
content_editor = undefined

window.ServiceConstants = {
	SEARCH_SERVICE: 'search',
	POPUP_SERVICE: 'popup',
	CONTENT_SERVICE: 'content',
	ASSESSMENT_SERVICE: 'assessment',
	LANGUAGE_SERVICE: 'language',
	META_SERVICE: 'meta',
	ASSET_SERVICE: 'asset',
	TELEMETRY_SERVICE: 'telemetry',
	DIALCODE_SERVICE: 'dialcode',
	TEXTBOOK_SERVICE: 'textbook',
	CONTENT_LOCK_SERVICE: 'lock',
	USER_SERVICE: 'user'
}

window.ManagerConstants = {
	EVENT_MANAGER: 'event',
	MEDIA_MANAGER: 'media',
	PLUGIN_MANAGER: 'plugin',
	RESOURCE_MANAGER: 'resource',
	STAGE_MANAGER: 'stage',
	TOOLBAR_MANAGER: 'toolbar'
}

// webfonts loader configuration
WebFontConfig = {
	custom: {
		families: ['NotoSansDevanagari', 'NotoSansTelugu', 'NotoSansKannada', 'NotoSansOriya', 'NotoSansBengali', 'NotoSansMalayalam', 'NotoNastaliqUrdu', 'NotoSansGurmukhi', 'NotoSansTamil', 'NotoSans', 'NotoSansGujarati'],
		urls: ['styles/noto.css']
	}
}
