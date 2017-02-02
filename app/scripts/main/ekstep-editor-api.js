/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
window.EkstepEditorAPI = {
    jQuery: EkstepEditor.jQuery,
    _: EkstepEditor._,
    globalContext: {
        contentId: undefined,
        useProxyForURL: true
    },
    addEventListener: function(type, callback, scope) {
        EkstepEditor.eventManager.addEventListener(type, callback, scope);
    },
    dispatchEvent: function(type, data, target) {
        EkstepEditor.eventManager.dispatchEvent(type, data, target);
    },
    removeEventListener: function(type, callback, scope) {

    },
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback) {
        EkstepEditor.loadPluginResource(pluginId, pluginVer, src, dataType, callback);
    },
    getService: function(serviceId) {
        switch (serviceId) {
            case 'popup':
                return EkstepEditor.popupService;
                break;
            case 'content':
                return EkstepEditor.contentService;
                break
            case 'assessmentService':
                return EkstepEditor.assessmentService;
                break;
            case 'languageService':
                return EkstepEditor.languageService;
                break;
            case 'telemetry':
                return EkstepEditor.telemetryService;
                break;
        }
    },
    getAngularScope: function() {
        return EkstepEditor.toolbarManager.scope;
    },
    getCanvas: function() {
        return EkstepEditor.stageManager.canvas;
    },
    getCurrentStage: function() {
        return EkstepEditor.stageManager.currentStage;
    },
    getStage: function(stageId) {
        return EkstepEditor.stageManager.getStage(stageId);
    },
    refreshStages: function() {
        EkstepEditor.toolbarManager.scope.safeApply(function() { EkstepEditor.toolbarManager.scope.stages = EkstepEditor.stageManager.stages; });
    },
    getCurrentObject: function() {
        var activeObj = EkstepEditor.stageManager.canvas.getActiveObject();
        if (!activeObj) return false;
        var pluginId = activeObj.id;
        return EkstepEditorAPI.getPluginInstance(pluginId);
    },
    getCurrentGroup: function() {
        var plugins = EkstepEditor.stageManager.canvas.getActiveGroup()._objects;
        var group = [];
        _.forEach(plugins, function(plugins, index) {
            var obj = EkstepEditorAPI.getPluginInstance(plugins.id);
            group.push(obj);
        });
        return group;
    },
    getEditorGroup: function() {
        var group = EkstepEditor.stageManager.canvas.getActiveGroup();
        return group;
    },
    getEditorObject: function() {
        return EkstepEditor.stageManager.canvas.getActiveObject();
    },
    render: function() {
        EkstepEditor.stageManager.canvas.renderAll();
    },
    getPluginInstance: function(pluginId) {
        return EkstepEditor.pluginManager.getPluginInstance(pluginId);
    },
    updateContextMenu: function(menu) {
        EkstepEditor.toolbarManager.updateContextMenu([menu]);
    },
    updateContextMenus: function(menus) {
        EkstepEditor.toolbarManager.updateContextMenu(menus);
    },
    instantiatePlugin: function(id, data, parent, override) {
        return EkstepEditor.pluginManager.invoke(id, data, parent, override);
    },
    addStage: function(stage) {
        EkstepEditor.stageManager.addStage(stage);
    },
    getPlugin: function(id) {
        return EkstepEditor.pluginManager.plugins[id];
    },
    addPluginInstance: function(pluginInstance) {
        EkstepEditor.pluginManager.addPluginInstance(pluginInstance);
    },
    removePluginInstance: function(pluginInstance) {
        EkstepEditor.pluginManager.removePluginInstance(pluginInstance);  
    },
    cloneInstance: function(plugin) {
        var data = plugin.getCopy();
        delete data.id; // delete id not to get duplicate pluginInstances
        if (plugin.parent.id == EkstepEditorAPI.getCurrentStage().id) {
            data.x = data.x + 2;
            data.y = data.y + 2;
        }
        EkstepEditorAPI.instantiatePlugin(plugin.manifest.id, data, EkstepEditorAPI.getCurrentStage());
    },
    getAllStages: function() {
        return EkstepEditor.stageManager.stages;
    },
    getAllPluginInstanceByTypes: function (id, types, includeFlag) {
      var pluginInstances = _.clone(EkstepEditor.stageManager.currentStage.children);
       if (id) {
            EkstepEditorAPI._.remove(pluginInstances, function(pi) {
                return pi.id === id;
            })
        }
      if (types && types.length && includeFlag === true) {
          _.remove(pluginInstances, function (pi) {
            return (_.indexOf(types, pi.manifest.id) === -1)
          });
      }
      if (types && types.length && includeFlag === false) {
           _.remove(pluginInstances, function (pi) {
            return (_.indexOf(types, pi.manifest.id) > -1)
          });
      }
      return pluginInstances;
    },
    getMedia: function(assetId) {
        return EkstepEditor.mediaManager.getMedia(assetId);
    }
}
