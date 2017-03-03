/**
 * The EkStep Editor API is the core interface of the plugins with the rest of the editor framework. It allows the plugins
 * to access the framework resources, launch popups, and handle events raised by the framework. Plugins should not call any
 * other framework classes directly.
 * 
 * @class EkstepEditorAPI
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
window.EkstepEditorAPI = {
    jQuery: EkstepEditor.jQuery,
    _: EkstepEditor._,
    globalContext: {
        contentId: undefined,
        useProxyForURL: true
    },

    baseURL: EkstepEditor.config.baseURL,
    absURL: undefined,
    apislug: EkstepEditor.config.apislug,
    /**
     * Register an event listener callback function for the events raised by the framework.
     * @param type {string} name of the event (e.g. org.ekstep.quickstart:configure)
     * @param callback {function} callback function
     * @param scope {object} the scope of the callback (use this)
     * @memberof EkstepEditorAPI
     */
    addEventListener: function(type, callback, scope) {
        EkstepEditor.eventManager.addEventListener(type, callback, scope);
    },

    /**
     * Fires an event to the framework, allowing other plugins who may have registered to receive the callback notification. All
     * communication between the framework and other plugins is via the events.
     * @param type {string} name of the event to fire (e.g. org.ekstep.quickstart:configure)
     * @param data {object} event data to carry along with the notification
     * @param target {object} the scope of the event (use this)
     * @memberof EkstepEditorAPI
     */
    dispatchEvent: function(type, data, target) {
        EkstepEditor.eventManager.dispatchEvent(type, data, target);
    },

    /**
     * Remove an event listener to an event. Plugins should cleanup when they are removed.
     * @param type {string} name of the event registered with (e.g. org.ekstep.quickstart:configure)
     * @param callback {function} remove the callback function
     * @param scope {object} the scope of the event (use this)
     * @memberof EkstepEditorAPI
     */
    removeEventListener: function(type, callback, scope) {

    },

    /**
     * Framework support to load plugin resources. When the resources are loaded, the callback is fired.
     * @param pluginId {string} id of the plugin requesting resource to be loaded
     * @param pluginVer {string} version of the plugin that is requesting the resource to be loaded
     * @param src {string} URL of the resource to be loaded
     * @param dataType {object} dataType of the resource (image, or audio)
     * @param callback {function} callback function whent he resource is available
     * @memberof EkstepEditorAPI
     */
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback) {
        EkstepEditor.pluginManager.loadPluginResource(pluginId, pluginVer, src, dataType, callback);
    },

    /**
     * Returns the handle to the Angular services. The services can be used by plugisn to achieve
     * the functional calls or render custom views. Valid services are:
     *     popup - UI service to render popup
     *     content - Provides access to the content API (for loading templates and assets)
     *     assessmentService - Provides access to the assessment API (for loading questions)
     *     languageService - Provides access to the wordnet API (for loading words and aksharas)
     *
     * @param serviceId {string} id of the service to return. Returns undefined if the id is invalid
     * @memberof EkstepEditorAPI
     */
    getService: function(serviceId) {
        switch (serviceId) {
            case 'popup':
                return EkstepEditor.popupService;
                break;
            case 'content':
                return EkstepEditor.contentService;
                break;
            case 'assessmentService':
                return EkstepEditor.assessmentService;
                break;
            case 'languageService':
                return EkstepEditor.languageService;
                break;
            case 'searchService':
                return EkstepEditor.searchService;
                break;
            case 'telemetry':
                return EkstepEditor.telemetryService;
                break;
        }
    },

    /**
     * Returns the angular scope object for the plugins that need angular framework to render. The editor
     * uses Angular 2 and plugins must use this to access the scope instead of instantiating Angular by
     * themselves.
     * @memberof EkstepEditorAPI
     */
    getAngularScope: function() {
        return EkstepEditor.toolbarManager.scope;
    },

    /**
     * Returns the HTML5 canvas for rendering on the editor. By default, the editor uses Fabric.js and recommends
     * the plugins to also use Fabric.js for rendering the WYSIWYG components on the editor canvas. However,
     * this method provides access to the underlying native HTML5 canvas if needed. For example, if your plugin
     * uses some other third-party graphics library for rendering.
     * @memberof EkstepEditorAPI
     */
    getCanvas: function() {
        return EkstepEditor.stageManager.canvas;
    },

    /**
     * Retrns the current stage object to the plugin. Plugins might use this to query other objects on the
     * canvas or access other stage context.
     * @memberof EkstepEditorAPI
     */
    getCurrentStage: function() {
        return EkstepEditor.stageManager.currentStage;
    },

    /**
     * Retrns the specified stage to the plugin. This can be used to build scenarios where a plugin might be
     * linking multiple stages together (e.g. when building navigation plugins).
     * @memberof EkstepEditorAPI
     */
    getStage: function(stageId) {
        return EkstepEditor.stageManager.getStage(stageId);
    },

    /**
     * Refreshes the rendering of stages - plugins can request the stages to be refreshed if any change
     * has been made.
     * @memberof EkstepEditorAPI
     */
    refreshStages: function() {
        //EkstepEditor.toolbarManager.scope.safeApply(function() { EkstepEditor.toolbarManager.scope.stages = EkstepEditor.stageManager.stages; });
        EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope(), function() { EkstepEditor.toolbarManager.scope.stages = EkstepEditor.stageManager.stages; });
    },

    /**
     * Returns the currently selected active object on the canvas. This can be used by plugins to provide
     * contextual support - e.g. show words for a given text object when the text is selected.
     * @memberof EkstepEditorAPI
     */
    getCurrentObject: function() {
        var activeObj = EkstepEditor.stageManager.canvas.getActiveObject();
        if (!activeObj) return false;
        var pluginId = activeObj.id;
        return EkstepEditorAPI.getPluginInstance(pluginId);
    },

    /**
     * Returns the current group of selected objects. This is possible when a user does multi-select by
     * clicking on multiple objects or by panning on the canvas.
     * @memberof EkstepEditorAPI
     */
    getCurrentGroup: function() {
        var plugins = EkstepEditor.stageManager.canvas.getActiveGroup()._objects;
        var group = [];
        _.forEach(plugins, function(plugins, index) {
            var obj = EkstepEditorAPI.getPluginInstance(plugins.id);
            group.push(obj);
        });
        return group;
    },

    /**
     * Retrns the current group on the fabric canvas. This provides access to the fabric object. If you
     * want to access the plugin instance that is currently selected, use getCurrentGroup() instead.
     * @memberof EkstepEditorAPI
     */
    getEditorGroup: function() {
        var group = EkstepEditor.stageManager.canvas.getActiveGroup();
        return group;
    },

    /**
     * Retrns the current object on the fabric canvas. This provides access to the fabric object. If you
     * want to access the plugin instance that is currently selected, use getCurrentObject() instead.
     * @memberof EkstepEditorAPI
     */
    getEditorObject: function() {
        return EkstepEditor.stageManager.canvas.getActiveObject();
    },

    /**
     * Notifies the framework to render the canvas once again. This can be done by the plugin when
     * its config or state is modified via the config views.
     * @memberof EkstepEditorAPI
     */
    render: function() {
        EkstepEditor.stageManager.canvas.renderAll();
    },

    /**
     * Returns a plugin instance for the given plugin ID. Plugins can use this work with dependencies
     * or build plugins that enhance the behavior of other plugins.
     * @memberof EkstepEditorAPI
     */
    getPluginInstance: function(pluginId) {
        return EkstepEditor.pluginManager.getPluginInstance(pluginId);
    },

    /**
     * Allows the plugins to request an update to the context menu when one or more objects are selected.
     * This can be used by a plugin to add more actions to the context menu - e.g. when a text is selected,
     * a word parser plugin can add context menu for spell check, or for adding word definition popups.
     * @param menu {object} Menu item to add - see the manifest for the structre of the menu item
     * @memberof EkstepEditorAPI
     */
    updateContextMenu: function(menu) {
        EkstepEditor.toolbarManager.updateContextMenu([menu]);
    },

    /**
     * Allows the plugins to request an update to the context menu by supplying multiple menu items.
     * This can be used by a plugin to add more actions to the context menu - e.g. when a text is selected,
     * a word parser plugin can add context menu for spell check, or for adding word definition popups.
     * @param menu {array} Array of menu items to add - see the manifest for the structre of the menu item
     * @memberof EkstepEditorAPI
     */
    updateContextMenus: function(menus) {
        EkstepEditor.toolbarManager.updateContextMenu(menus);
    },

    /**
     * Allows the plugins to request loading and instantiating another plugin. This is useful when
     * a plugin depends upon other plugins - e.g. a wordpicker might dependend upon an asset picker.
     * @param id {string} Fully qualified plugin id to load and instantiate
     * @param data {object} Data to be passed during instantiation (initial state)
     * @param parent {object} Parent scope - use this
     * @param override {object} Any function overrides - e.g. you can override the handlers of the plugin
     * @see org.ekstep.composite-text-image-shape plugin for a sample of leveraging this.
     * @memberof EkstepEditorAPI
     */
    instantiatePlugin: function(id, data, parent, override) {
        return EkstepEditor.pluginManager.invoke(id, data, parent, override);
    },

    /**
     * Plugins can instantiate a stage and add it to the content. This can be done by special plugins that
     * work at a stage level or cause multiple stages to be added based on the configuration.
     * @param stage {object} Stage to add to the content
     * @memberof EkstepEditorAPI
     */
    addStage: function(stage) {
        EkstepEditor.stageManager.addStage(stage);
    },

    /**
     * Lookup for another plugin in the current plugin manager scope.
     * @param id {string} Plugin id to return. Undefined if the plugin has not been loaded.
     * @memberof EkstepEditorAPI
     */
    getPlugin: function(id) {
        return EkstepEditor.pluginManager.plugins[id];
    },

    /**
     * Adds a plugin instance to the manager. This may be used when a plugin instantiates other plugins. The
     * newly instantiated plugins are added to the framework's registry, making them discoverable by others.
     * Useful for scenarios where plugins depend on others, or composite plugins.
     * @param pluginInstance {object} Plugin object instantiated by this plugin.
     * @memberof EkstepEditorAPI
     */
    addPluginInstance: function(pluginInstance) {
        EkstepEditor.pluginManager.addPluginInstance(pluginInstance);
    },

    /**
     * Removes a plugin instance from the manager. Do this only if you instantiated the plugin using addPluginInstance()
     * @param pluginInstance {object} Plugin object instantiated by this plugin.
     * @memberof EkstepEditorAPI
     */
    removePluginInstance: function(pluginInstance) {
        EkstepEditor.pluginManager.removePluginInstance(pluginInstance);
    },

    /**
     * Creates a deep copy of the given plugin object with an offset x and y position. This is useful when
     * you are building plugins that enable copy paste type functionality for example.
     * @param pluginInstance {object} Plugin object instantiated by this plugin.
     * @memberof EkstepEditorAPI
     */
    cloneInstance: function(plugin) {
        var data = plugin.getCopy();
        data = _.omit(data, ["id", "event"]);
        if (plugin.parent.id == EkstepEditorAPI.getCurrentStage().id) {
            data.x = data.x + 2;
            data.y = data.y + 2;
        }
        EkstepEditorAPI.instantiatePlugin(plugin.manifest.id, data, EkstepEditorAPI.getCurrentStage());
    },

    /**
     * Returns all stages in the current document. This could be useful when plugins work across stages
     * such as timers that work across stages or page number plugins. Using this, a plugin can get access to all
     * stages, and instantiate plugins on each stage.
     * @memberof EkstepEditorAPI
     */
    getAllStages: function() {
        return EkstepEditor.stageManager.stages;
    },

    /**
     * Selector for plugins of a given type in the document. This can be used by plugins to discover other
     * instances of the same plugin, or other plugins that are compatible with this plugin. E.g. a wordnet
     * plugin might use this to discover all other text plugins in the content.
     * @param id {string} ID of the plugin to look for
     * @param types {array} Include or exclude specified plugins
     * @param includeFlag {boolean} Whether to include or exclude the types
     * @memberof EkstepEditorAPI
     */
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

    /**
     * Allows plugins to load a media object that they may depend upon.
     * @param assetId {string} ID of the media asset to load
     * @memberof EkstepEditorAPI
     */
    getMedia: function(assetId) {
        return EkstepEditor.mediaManager.getMedia(assetId);
    },
    loadPlugin: function (pluginId, pluginVersion) {
      EkstepEditor.pluginManager.loadPlugin(pluginId, pluginVersion);
    },
    getPluginRepo: function () {
      return EkstepEditor.config.pluginRepo;
    },
    updatePluginDimensions: function(inst) {
        inst.attributes.x = inst.editorObj.getLeft();
        inst.attributes.y = inst.editorObj.getTop();
        inst.attributes.w = inst.editorObj.getWidth() - inst.editorObj.getStrokeWidth();
        inst.attributes.h = inst.editorObj.getHeight() - inst.editorObj.getStrokeWidth();
        inst.attributes.r = inst.editorObj.getAngle();
        if (_.isFunction(inst.editorObj.getRx))
            inst.attributes.r = inst.editorObj.getRx();
    },
    ngSafeApply: function(scope, fn) {
        if(scope) scope.$safeApply(fn);
    },
    loadAndInitPlugin: function (pluginId, pluginVersion) {
      EkstepEditor.pluginManager.loadAndInitPlugin(pluginId+"-"+pluginVersion);
    }
}
