describe("Plugin Manager test cases", function() {
    
    beforeAll(function() {
        var corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.copypaste": "1.0"
        };

        //load core plugins from s3
        EkstepEditorAPI.setConfig('pluginRepo', "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins");
        _.forIn(corePlugins, function(value, key) {
            EkstepEditor.pluginManager.loadPlugin(key, value);
        });
        
        EkstepEditorAPI.setConfig('pluginRepo', "base/test/data/published");
        EkstepEditor.hostRepo.basePath = "base/test/data/hosted";
        EkstepEditor.draftRepo.basePath = "base/test/data/draft";
        EkstepEditor.hostRepo.connected = true;
    });

    afterAll(function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
    });
    it("should load and init plugin", function() {
        spyOn(EkstepEditor.pluginManager, "loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "isDefined").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "getPluginManifest").and.callThrough();

        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("org.ekstep.test2", "1.0");
        expect(returnValue).toBe(0);
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.test2", "1.0", undefined);
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalledWith("org.ekstep.test2");
        expect(EkstepEditor.pluginManager.invoke).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).toHaveBeenCalledWith("org.ekstep.test2");
    });

    it("should not load and init plugin", function() {
        spyOn(EkstepEditor.pluginManager, "loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "isDefined").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "getPluginManifest").and.callThrough();
        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("org.ekstep.jsdklghfksjd","1.0");
        expect(returnValue).toBe(1);
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.jsdklghfksjd", "1.0", undefined);
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalledWith("org.ekstep.jsdklghfksjd");
        expect(EkstepEditor.pluginManager.invoke).not.toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).not.toHaveBeenCalled();
    });

    it("get plugins should return plugins array", function() {
        spyOn(EkstepEditor.pluginManager, "getPlugins").and.callThrough();
        expect(EkstepEditor.pluginManager.getPlugins().length).toEqual(3);
    });

    it("should load help for plugin", function(done) {
        spyOn(EkstepEditor.pluginManager, "loadPluginResource").and.callThrough();
        EkstepEditor.pluginManager.loadPluginResource("org.ekstep.test2", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it("should not load help for plugin", function(done) {
        spyOn(EkstepEditor.pluginManager, "loadPluginResource").and.callThrough();
        EkstepEditor.pluginManager.loadPluginResource("org.ekstep.sdfsdfsd", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it("should resolve resource path", function() {
        spyOn(EkstepEditor.pluginManager, "resolvePluginResource").and.callThrough();
        spyOn(EkstepEditor.publishedRepo, "resolveResource").and.callThrough();
        var path = EkstepEditor.pluginManager.resolvePluginResource("org.ekstep.test2", "1.0", "editor/help.md");
        expect(path).toBe("base/test/data/published/org.ekstep.test2-1.0/editor/help.md");
        expect(EkstepEditor.publishedRepo.resolveResource).toHaveBeenCalled();
        expect(EkstepEditor.publishedRepo.resolveResource.calls.count()).toEqual(1);
        expect(EkstepEditor.publishedRepo.resolveResource).toHaveBeenCalledWith("org.ekstep.test2", "1.0", "editor/help.md");
    });

    it("should not resolve resource path", function() {
        spyOn(EkstepEditor.pluginManager, "resolvePluginResource").and.callThrough();
        spyOn(EkstepEditor.publishedRepo, "resolveResource").and.callThrough();
        var path = EkstepEditor.pluginManager.resolvePluginResource("org.ekstep.dskjhfgk", "1.0", "editor/help.md");
        expect(path).toBe(false);
        expect(EkstepEditor.publishedRepo.resolveResource).not.toHaveBeenCalled();
        expect(EkstepEditor.publishedRepo.resolveResource.calls.count()).not.toEqual(1);
        expect(EkstepEditor.publishedRepo.resolveResource).not.toHaveBeenCalledWith("org.ekstep.test2", "1.0", "editor/help.md");
    });

    it("should call load plugins with empty object and should call callback method", function() {
        spyOn(EkstepEditor.pluginManager, "loadAllPlugins").and.callThrough();
        EkstepEditor.pluginManager.loadAllPlugins({}, function() {
            expect(Object.keys(EkstepEditor.pluginManager.plugins).length).toEqual(3);
        })
    });

    it("should call invoke and addError", function() {
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "addError").and.callThrough();
        EkstepEditor.pluginManager.invoke("org.test.test");
        expect(EkstepEditor.pluginManager.addError).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.addError).toHaveBeenCalledWith("No plugin found for - org.test.test");
        expect(EkstepEditor.pluginManager.errors.length).toEqual(1);
        expect(EkstepEditor.pluginManager.getErrors()).toEqual(["No plugin found for - org.test.test"]);
    });

    it("should load array of plugins with invoke", function() {
        var data = [{
            "type": "rect",
            "x": 10,
            "y": 20,
            "fill": "#FFFF00",
            "w": 14,
            "h": 25,
            "stroke": "rgba(255, 255, 255, 0)",
            "strokeWidth": 1,
            "opacity": 1
        }, {
            "type": "rect",
            "x": 10,
            "y": 20,
            "fill": "#FFFFF0",
            "w": 14,
            "h": 25,
            "stroke": "rgba(255, 255, 0, 0)",
            "strokeWidth": 1,
            "opacity": 1
        }];
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        EkstepEditor.pluginManager.invoke("org.ekstep.test2", data);

    });

    xit("should call invoke and throw error", function() {
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        expect(EkstepEditor.pluginManager.invoke("org.ekstep.test2", undefined)).toThrowError();
    });

    it("get manifest should return undefined", function() {
        spyOn(EkstepEditor.pluginManager, "getPluginManifest").and.callThrough();
        var value = EkstepEditor.pluginManager.getPluginManifest("org.ksjdhf.sdjhfg");
        expect(value).toBe(undefined);
    });

    it("should remove plugin instance by calling removePluginInstance", function() {
        var PIlength = Object.keys(EkstepEditor.pluginManager.pluginInstances).length;
        var lastPI = EkstepEditor.pluginManager.pluginInstances[Object.keys(EkstepEditor.pluginManager.pluginInstances)[0]];
        spyOn(EkstepEditor.pluginManager, "removePluginInstance").and.callThrough();
        EkstepEditor.pluginManager.removePluginInstance(lastPI);
        expect(Object.keys(EkstepEditor.pluginManager.pluginInstances).length).not.toEqual(PIlength);
    });

    it("should not load plugin js file", function() {
        var defectManifest = JSON.parse('{ "id": "org.ekstep.test2", "ver": "1.0", "shortId": "shape", "author": "Santhosh Vasabhaktula", "title": "Shape Plugin", "type": "widget", "description": "", "publishedDate": "", "editor": { "main": "plugin.js", "dependencies": [], "menu": [{ "id": "shape", "category": "main", "type": "icon", "toolTip": "Add Shapes", "title": "Shapes", "iconClass": "icon-shape icon", "submenu": [{ "id": "rectangle", "type": "icon", "toolTip": "Add Rectangle", "title": "Rectangle", "iconClass": "icon-rectangle icon", "onclick": { "id": "org.ekstep.test2:create", "data": { "type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 } } }] }], "behaviour": { "rotatable": true }, "configManifest": [{ "propertyName": "color", "title": "Fill Color", "description": "Choose a color from the color picker", "dataType": "colorpicker", "required": true, "defaultValue": "#000000" }], "help": { "src": "editor/help.md", "dataType": "text" }, "init-data": { "type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25 } } } ');
        spyOn(EkstepEditor.pluginManager, "loadPluginByManifest").and.callThrough();
        spyOn(console, "error").and.callThrough();
        EkstepEditor.pluginManager.loadPluginByManifest(defectManifest, EkstepEditor.publishedRepo);
        expect(console.error).toHaveBeenCalled();
        expect(console.error.calls.count()).toEqual(1);
        //expect(console.error).objectContaining('Unable to load editor plugin');        
    });

    it("should load packaged core plugin invoking register function directly", function() {
        spyOn(EkstepEditor.pluginManager, "registerPlugin").and.callThrough();
        EkstepEditor.pluginManager.registerPlugin({"id":"org.ekstep.delete","ver":"1.0","author":"Santhosh Vasabhaktula","title":"Delete Plugin","description":"","publishedDate":"","editor":{"main":"editor/plugin.js","menu":[{"id":"delete","category":"context","type":"icon","toolTip":"Delete","title":"Delete","iconClass":"trash outline icon","state":"HIDE","onclick":{"id":"delete:invoke","data":{}}}]}},eval('EkstepEditor.basePlugin.extend({type:"delete",picker:void 0,initialize:function(){var e=this;EkstepEditorAPI.addEventListener("delete:invoke",this.deleteObject,this),EkstepEditorAPI.addEventListener("object:selected",this.objectSelected,this),EkstepEditorAPI.addEventListener("object:unselected",this.objectUnSelected,this),EkstepEditorAPI.registerKeyboardCommand("del",function(){e.deleteObject()})},deleteObject:function(e,t){var d=EkstepEditorAPI.getEditorGroup(),i=EkstepEditorAPI.getEditorObject(),o=this;i?o.remove(i):d&&(EkstepEditorAPI.getCanvas().discardActiveGroup(),d.getObjects().forEach(function(e){o.remove(e)}))},remove:function(e){EkstepEditorAPI.dispatchEvent("delete:invoked",{editorObj:EkstepEditorAPI.getPluginInstance(e.id).attributes}),EkstepEditorAPI.getCanvas().remove(e),EkstepEditorAPI.dispatchEvent("stage:modified",{id:e.id})},objectSelected:function(e,t){EkstepEditorAPI.updateContextMenu({id:"delete",state:"SHOW",data:{}})},objectUnSelected:function(e,t){EkstepEditorAPI.updateContextMenu({id:"delete",state:"HIDE",data:{}})}});'))
        expect(EkstepEditor.pluginManager.registerPlugin).toHaveBeenCalled();
    });

    it('should handle plugin instance failures gracefully', function() {
        
        var pluginsCount = _.keys(EkstepEditor.pluginManager.pluginObjs).length;
        EkstepEditor.pluginManager.loadPlugin("org.ekstep.test7", "1.0");
        var newCount = _.keys(EkstepEditor.pluginManager.pluginObjs).length;
        expect(newCount).toBe(pluginsCount + 1);

        spyOn(EkstepEditorAPI, "dispatchEvent").and.callThrough();
        var pluginInstancesCount = _.keys(EkstepEditor.pluginManager.pluginInstances).length;
        var error = undefined;
        try {
            EkstepEditor.pluginManager.invoke('org.ekstep.test7', {}, undefined, undefined);
        } catch(e) {
            console.log('Error:', e);
            error = e;
        }
        var newPluginInstancesCount = _.keys(EkstepEditor.pluginManager.pluginInstances).length;
        expect(error).toBe('Unable to create a new instance');
        expect(pluginInstancesCount).toBe(newPluginInstancesCount);
        expect(EkstepEditorAPI.dispatchEvent).not.toHaveBeenCalled();
    })

    xit('should not load plugin js file', function() {
        spyOn(EkstepEditor.pluginManager, "loadPluginByManifest").and.callThrough();
        spyOn(console, "error").and.callThrough();
        EkstepEditor.pluginManager.loadPlugin("org.ekstep.defecttest","1.0");
    });
});
