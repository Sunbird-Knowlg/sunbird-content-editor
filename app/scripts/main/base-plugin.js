/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.basePlugin = Class.extend({
    id: undefined,
    parent: undefined,
    children: [],
    manifest: undefined,
    editorObj: undefined,
    editorData: undefined,
    data: undefined,
    attributes: {x: 0, y: 0, w: 0, h: 0, visible: true, editable: true},
    config: undefined,
    events: undefined,
    metadata: [],
    init: function(manifest, data, parent) {
        this.manifest = manifest;
        if (arguments.length == 1) {
            this.registerMenu();
            this.initialize();
            console.log(manifest.id + " plugin initialized");
        } else {
            this.editorObj = undefined;
            this.editorData = data;
            this.children = [];
            this.id = this.editorData.id || UUID();
            this.parent = parent;
            if (this.editorData && this.editorData.props) this.editorData.props.id = this.id;
            this.attributes = { x: 0, y: 0, w: 0, h: 0, visible: true, editable: true };
            this.config = undefined;
            this.metadata = [];
        }
    },
    initPlugin: function() {
        this.newInstance(this.editorData);
        this.registerFabricEvents();
        if(this.editorObj) this.editorObj.set({id: this.id});
        if (this.parent) this.parent.addChild(this);
    },
    registerMenu: function() {
        var instance = this;
        this.manifest.editor.menu = this.manifest.editor.menu || [];
        _.forEach(this.manifest.editor.menu, function(menu) {
            menu.iconImage = menu.iconImage ? instance.relativeURL(menu.iconImage) : menu.iconImage;
            if (menu.submenu) {
                _.forEach(menu.submenu, function(dd) {
                    dd.iconImage = dd.iconImage ? instance.relativeURL(dd.iconImage) : dd.iconImage;
                });
            }
            if (menu.category === 'main') {
                EkstepEditor.toolbarManager.registerMenu(menu);
            } else if (menu.category === 'context') {
                EkstepEditor.toolbarManager.registerContextMenu(menu);
            }
        });
    },
    relativeURL: function(src) {
        return EkstepEditor.relativeURL(this.manifest.id, this.manifest.ver, src);
    },
    getType: function() {
        return this.manifest ? this.manifest.id : '';
    },
    registerFabricEvents: function() {
        if (this.editorObj) {
            this.editorObj.on({
                added: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.added(inst, options, event);
                    if (inst.editorObj) {
                        inst.attributes.x = inst.editorObj.getLeft();
                        inst.attributes.y = inst.editorObj.getTop();
                        inst.attributes.w = inst.editorObj.getWidth();
                        inst.attributes.h = inst.editorObj.getHeight();
                    }
                },
                removed: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.removed(inst, options, event);
                    _.forEach(inst.children, function(child, index) {
                        child.editorObj.remove();
                    });
                    inst.remove();
                },
                selected: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.selected(inst, options, event)
                },
                deselected: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.deselected(inst, options, event)
                },
                modified: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    if (inst.editorObj) {
                        inst.attributes.x = inst.editorObj.getLeft();
                        inst.attributes.y = inst.editorObj.getTop();
                        inst.attributes.w = inst.editorObj.getWidth();
                        inst.attributes.h = inst.editorObj.getHeight();
                    }
                    inst.changed(inst, options, event)
                },
                rotating: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.rotating(inst, options, event)
                },
                scaling: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.scaling(inst, options, event);
                },
                moving: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.moving(inst, options, event)
                },
                skewing: function(options, event) {
                    var inst = EkstepEditorAPI.getPluginInstance(this.id);
                    inst.skewing(inst, options, event)
                }
            });
        }
    },
    loadResource: function(src, dataType, cb) {
        EkstepEditorAPI.loadPluginResource(this.manifest.id, this.manifest.ver, src, dataType, cb);
    },
    remove: function() {
        this.parent.removeChild(this);
        delete EkstepEditor.pluginManager.pluginInstances[this.id];
    },
    create: function(data) {
        EkstepEditor.pluginManager.invoke(this.manifest.id + '@' + this.manifest.ver, data, EkstepEditor.stageManager.currentStage);
    },
    addChild: function(plugin) {
        this.children.push(plugin);
    },
    removeChild: function(plugin) {
        this.children = _.reject(this.children, { id: plugin.id });
    },
    initialize: function(data) {},
    newInstance: function(data) {},
    added: function(instance, options, event) {},
    removed: function(instance, options, event) {},
    selected: function(instance, options, event) {},
    deselected: function(instance, options, event) {},
    changed: function(instance, options, event) {},
    rotating: function(instance, options, event) {},
    scaling: function(instance, options, event) {},
    moving: function(instance, options, event) {},
    skewing: function(instance, options, event) {},
    doCopy: function() {
        return this.editorObj;
    },
    getCopy: function() {
        return this.doCopy();
    },
    doPaste: function(copy) {
        this.editorObj = fabric.util.object.clone(copy);
        this.editorObj.set("id", this.id);
        this.editorObj.set("top", copy.top + 10);
        this.editorObj.set("left", copy.top + 10);
    },
    paste: function(copy) {
        this.parent = EkstepEditorAPI.getCurrentStage();
        this.doPaste(copy);
        if (this.parent) this.parent.addChild(this);
    },
    render: function (canvas) { // Complex plugins and templates should override this if necessary
        canvas.add(this.editorObj);
    },
    getMeta: function () {
        
    },
    transformDimensions: function(obj) {
        obj.x = parseFloat(((obj.x / 720) * 100).toFixed(2));
        obj.y = parseFloat(((obj.y / 405) * 100).toFixed(2));
        obj.w = parseFloat(((obj.w / 720) * 100).toFixed(2));
        obj.h = parseFloat(((obj.h / 405) * 100).toFixed(2));
    },
    reverseTransformDimensions: function (obj) {
        obj.x = obj.x * (720 / 100);
        obj.y = obj.y * (405 / 100);
        obj.w = obj.w * (720 / 100);
        obj.h = obj.h * (405 / 100);
    },
    setConfig: function(data) {
        this.config = data;
    },
    getConfig: function() {
        return this.config;
    },
    setData: function(data) {
        this.data = data;
    },
    getData: function() {
        return this.data;
    },
    setAttributes: function(attr) {
        _.merge(this.attributes, attr);
    },
    getAttributes: function() {         
        return _.omit(this.attributes, ['top', 'left', 'width', 'height']);
    },
    setAttribute: function(key, value) {
        this.attributes[key] = value;
    },
    getAttribute: function(key) {         
        return this.attributes[key];
    },
    addEvent: function(event) {
        if(_.isUndefined(this.events)) this.events = [];
        this.events.push(event);
    },
    getEvents: function() {
        return this.events;
    },
    toECML: function () {
        var attr = _.clone(this.getAttributes()); 
        this.transformDimensions(attr);
        if(!_.isUndefined(this.getData())) {
            attr.data = {
                "__cdata": JSON.stringify(this.getData())
            };
        }
        if(!_.isUndefined(this.getConfig())) {
            attr.config = {
                "__cdata": JSON.stringify(this.getConfig())
            };
        }
        if(!_.isUndefined(this.getEvents())) {
            attr.config = {
                "__cdata": JSON.stringify(this.getEvents())
            };
        }
        return attr;
    },
    fromECML: function(data) {
        this.attributes = data;
        if(!_.isUndefined(this.attributes.data)) {
            this.data = JSON.parse(this.attributes.data.__cdata);
            delete this.attributes.data;
        }
        if(!_.isUndefined(this.attributes.config)) {
            this.config = JSON.parse(this.attributes.config.__cdata);
            delete this.attributes.config;
        }
        if(!_.isUndefined(this.attributes.event)) {
            this.events = JSON.parse(this.attributes.event.__cdata);
            delete this.attributes.event;
        }
        this.reverseTransformDimensions(this.attributes);
        this.render();
    },
    getPluginConfig: function () {
        return this.manifest.editor.config;
    },
    updateContextMenu: function () {
        
    },
    reConfig: function () {
        
    },
    onConfigChange: function () {
        
    }
});
