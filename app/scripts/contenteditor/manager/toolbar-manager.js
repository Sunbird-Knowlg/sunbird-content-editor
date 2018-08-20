/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.contenteditor.toolbarManager = new (Class.extend({
	menuItems: [],
	contextMenuItems: [],
	configMenuItems: [],
	scope: undefined,
	setScope: function (scope) {
		this.scope = scope
	},
	registerMenu: function (menu, manifest) {
		if (!_.isObject(_.find(this.menuItems, { id: menu.id }))) {
			var menuCloneObj = _.cloneDeep(menu)
			menuCloneObj.pluginId = manifest.id
			menuCloneObj.pluginVer = manifest.ver
			this.menuItems.push(menuCloneObj)
		}
		if (this.scope) this.scope.refreshToolbar()
	},
	registerContextMenu: function (menu, manifest) {
		if (!_.isObject(_.find(this.contextMenuItems, { id: menu.id }))) {
			var menuCloneObj = _.cloneDeep(menu)
			menuCloneObj.pluginId = manifest.id
			menuCloneObj.pluginVer = manifest.ver
			this.contextMenuItems.push(menuCloneObj)
		}
		if (this.scope) this.scope.refreshToolbar()
	},
	resetContextMenu: function () {
		_.forEach(this.contextMenuItems, function (cmenu) {
			cmenu.state = 'HIDE'
			cmenu.selected = false
		})
	},
	updateContextMenu: function (menus) {
		var instance = this
		_.forEach(menus, function (cmenu) {
			instance._updateContextMenu(cmenu.id, cmenu)
		})
		/* istanbul ignore next. Angular functions cannot be tested now */
		org.ekstep.contenteditor.api.ngSafeApply(this.scope, function () {
			instance.scope.contextMenus = instance.contextMenuItems
		})
		org.ekstep.contenteditor.jQuery(document).ready(function () {
			org.ekstep.contenteditor.jQuery('.ui.dropdown').dropdown()
			org.ekstep.contenteditor.jQuery('.popup-item').popup()
		})
	},
	_updateContextMenu: function (menuId, props) {
		// console.log('menu', menuId, 'props', props);
		var menu = _.find(this.contextMenuItems, { id: menuId })
		_.forIn(props, function (value, key) {
			if (key !== 'data') {
				menu[key] = value
				org.ekstep.pluginframework.eventManager.dispatchEvent(menuId + ':' + key, props.data)
			}
		})
	},
	getRegisterConfigMenu: function () {
		return this.configMenuItems
	},
	cleanUp: function () {
		this.menuItems = []
		this.contextMenus = []
	}
}))()
