/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.toolbarManager = new(Class.extend({
    menuItems: [],
    contextMenuItems: [],
    scope: undefined,
    setScope: function(scope) {
        this.scope = scope;
    },
    registerMenu: function(menu) {
        if (!_.isObject(_.find(this.menuItems, { id: menu.id }))) {
            this.menuItems.push(menu);
        }
        //TODO: should be moved if possible
        $(document).ready(function() {
            setTimeout(function() {
                $(".ui.dropdown").dropdown();
                $(".popup-item").popup();
            }, 500)
        });
    },
    registerContextMenu: function(menu) {
        if (!_.isObject(_.find(this.contextMenuItems, { id: menu.id }))) {
            this.contextMenuItems.push(menu);
        }
    },
    resetContextMenu: function() {
        _.forEach(this.contextMenuItems, function(cmenu) {
            cm.state = 'HIDE';
            cm.selected = false;
        });
    },
    updateContextMenu: function(menus) {
        var instance = this;
        _.forEach(menus, function(cmenu) {
            instance._updateContextMenu(cmenu.id, cmenu);
        });
        this.scope.safeApply(function() {
            instance.scope.contextMenus = instance.contextMenuItems;
            // EkstepEditor.jQuery(document).ready(function() {
            //     _.forEach(instance.scope.menus, function(value) {
            //         EkstepEditor.jQuery("#" + value.id).parent().tooltip();
            //     });
            //     _.forEach(instance.scope.contextMenus, function(value) {
            //         EkstepEditor.jQuery("#" + value.id).parent().tooltip();
            //     });
            // })
        });
        $(document).ready(function() {
            $(".ui.dropdown").dropdown();
            $(".popup-item").popup();
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
