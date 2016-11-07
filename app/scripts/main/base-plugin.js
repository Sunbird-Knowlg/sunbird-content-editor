EkstepEditor.basePlugin = Class.extend({
    id: undefined,
    parent: undefined,
    children: [],
    manifest: undefined,
    editorObj: undefined,
    data: undefined,
    attributes: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        scaleX: 1,
        scaleY: 1,
        visible: true,
        editable: true
    },
    config: undefined,
    metadata: [],
    init: function(manifest, data, parent) {
        this.manifest = manifest;
        if (arguments.length == 1) {
            this.registerMenu();
            this.initialize();
            console.log(manifest.id + " plugin initialized");
        } else {
            this.editorObj = undefined;
            this.data = data;
            this.children = [];
            this.id = this.data.id || UUID();
            this.parent = parent;
            if (this.data && this.data.props) this.data.props.id = this.id;
            this.attributes = { x: 0, y: 0, w: 0, h: 0, scaleX: 1, scaleY: 1,visible: true, editable: true};
            this.config = undefined;
            this.metadata = [];
        }
    },
    initPlugin: function() {
        this.newInstance(this.data);
        this.registerFabricEvents();
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
                    _.forEach(inst.children, function(child) {
                        EkstepEditorAPI.getCanvas().add(child.editorObj);
                    });
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
    render: function () {
        
    },
    getMeta: function () {
        
    },
    transformDimensions: function(obj) {
        obj.x = parseFloat(((obj.x / 720) * 100).toFixed(2));
        obj.y = parseFloat(((obj.y / 405) * 100).toFixed(2));
        obj.w = parseFloat((((obj.w * obj.scaleX) / 720) * 100).toFixed(2));
        obj.h = parseFloat((((obj.h * obj.scaleY) / 405) * 100).toFixed(2));
    },
    reverseTransformDimensions: function (obj) {
        obj.x = obj.x * (720 / 100);
        obj.y = obj.y * (405 / 100);
        obj.w = obj.w * (720 / 100);
        obj.h = obj.h * (405 / 100);
    },
    toECML: function () {
        this.updateAttributes()
        var attr = _.clone(this.attributes); 
        this.transformDimensions(attr);
        if(this.data) {
            attr.data = {
                "__cdata": JSON.stringify(this.data)
            };
        }
        if(this.config) {
            attr.config = {
                "__cdata": JSON.stringify(this.config)
            };
        }
        if(this.children) {
            attr.children = [];
            _.forEach(this.children, function (child) {
                attr[child.type] = attr[child.type] || []; 
                attr[child.type].push(child.toECML());
            });
        }
        return attr;
    },
    fromECML: function(data) {
        this.attributes = data;
        reverseTransformDimensions(this.attributes);
        if(this.attributes.data) {
            this.data = JSON.parse(this.attributes.data.__cdata);
            delete this.attributes.data;
        }
        if(this.attributes.config) {
            this.config = JSON.parse(this.attributes.config.__cdata);
            delete this.attributes.config;
        }
        this.render();
    },
    updateAttributes: function () {
    },
    getPluginConfig: function () {
        return this.manifest.config;
    },
    updateContextMenu: function () {
        
    }
});
