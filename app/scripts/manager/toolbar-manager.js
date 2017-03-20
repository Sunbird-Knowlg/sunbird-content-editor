/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.toolbarManager = new(Class.extend({
    menuItems: [],
    contextMenuItems: [],
    configMenuItems: [],
    scope: undefined,
    setScope: function(scope) {
        this.scope = scope;
    },
    registerMenu: function(menu) {
        if (!_.isObject(_.find(this.menuItems, { id: menu.id }))) {
            this.menuItems.push(menu);
        }
        //TODO: should be moved if possible
        EkstepEditor.jQuery(document).ready(function() {
            setTimeout(function() {
                EkstepEditor.jQuery(".ui.dropdown").dropdown();
                EkstepEditor.jQuery(".popup-item").popup();
            }, 500)
        });
    },
    registerContextMenu: function(menu) {
        if (!_.isObject(_.find(this.contextMenuItems, { id: menu.id }))) {
            this.contextMenuItems.push(menu);
        }
    },
    registerConfigMenu: function(menu) {
        if (!_.isObject(_.find(this.configMenuItems, { id: menu.id }))) {
            this.configMenuItems.push(menu);
        }
    },
    resetContextMenu: function() {
        _.forEach(this.contextMenuItems, function(cmenu) {
            cmenu.state = 'HIDE';
            cmenu.selected = false;
        });
    },
    updateContextMenu: function(menus) {
        var instance = this;
        _.forEach(menus, function(cmenu) {
            instance._updateContextMenu(cmenu.id, cmenu);
        });
        EkstepEditorAPI.ngSafeApply(this.scope, function() {
            instance.scope.contextMenus = instance.contextMenuItems;
        });
        EkstepEditor.jQuery(document).ready(function() {
            EkstepEditor.jQuery(".ui.dropdown").dropdown();
            EkstepEditor.jQuery(".popup-item").popup();
        });

    },
    _updateContextMenu: function(menuId, props) {
        //console.log('menu', menuId, 'props', props);
        var menu = _.find(this.contextMenuItems, { id: menuId });
        _.forIn(props, function(value, key) {
            if (key != 'data') {
                menu[key] = value;
                EkstepEditor.eventManager.dispatchEvent(menuId + ':' + key, props.data);
            }
        });
    }
}));
