describe("Plugin Manager test cases", function() {
    var unregisterPlugin = function(id) {
        delete org.ekstep.pluginframework.pluginManager.plugins[id];
        delete org.ekstep.pluginframework.pluginManager.pluginObjs[id];
        delete org.ekstep.pluginframework.pluginManager.pluginManifests[id];
        delete org.ekstep.pluginframework.pluginManager.pluginVisited[id];
    };

    beforeAll(function(done) {                
        org.ekstep.pluginframework.pluginManager.cleanUp();

        var corePlugins = [
            { "id": "org.ekstep.test1", "ver": "1.0", "type": "plugin" }
        ];

        org.ekstep.services.config = {
            baseURL: org.ekstep.contenteditor.config.baseURL,
            apislug: org.ekstep.contenteditor.config.apislug
        }        
        
        org.ekstep.pluginframework.initialize({
            env: 'editor',
            pluginRepo: "base/test/data/published",
            build_number: undefined
        });

        org.ekstep.pluginframework.pluginManager.loadAllPlugins(corePlugins, undefined, function() {            
            done();
        }); 

    });

    afterAll(function() {
        org.ekstep.pluginframework.pluginManager.cleanUp();
        org.ekstep.contenteditor.stageManager.cleanUp();
    });

    it("should load and init plugin", function() {
        unregisterPlugin("org.ekstep.test3");
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPluginWithDependencies").and.callThrough();
        spyOn(org.ekstep.pluginframework.pluginManager, "isPluginDefined").and.callThrough();
        var returnValue = org.ekstep.pluginframework.pluginManager.loadAndInitPlugin("org.ekstep.test3", "1.0");
        expect(returnValue).toBe(1);
        expect(org.ekstep.pluginframework.pluginManager.loadPluginWithDependencies).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.loadPluginWithDependencies).toHaveBeenCalledWith("org.ekstep.test3", "1.0", undefined, undefined, jasmine.any(Function));
        expect(org.ekstep.pluginframework.pluginManager.isPluginDefined).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.isPluginDefined).toHaveBeenCalledWith("org.ekstep.test3");
    });

    it("get plugins should return plugins array", function() {        
        expect(org.ekstep.pluginframework.pluginManager.getPlugins().length > 0).toBe(true);
    });

    it("should load help for plugin", function(done) {
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPluginResource").and.callThrough();
        org.ekstep.pluginframework.pluginManager.loadPluginResource("org.ekstep.test1", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it("should not load help for plugin", function(done) {
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPluginResource").and.callThrough();
        org.ekstep.pluginframework.pluginManager.loadPluginResource("org.ekstep.sdfsdfsd", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it("should resolve resource path", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "resolvePluginResource").and.callThrough();
        spyOn(org.ekstep.pluginframework.publishedRepo, "resolveResource").and.callThrough();
        var path = org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.test1", "1.0", "editor/help.md");
        expect(path).toBe("base/test/data/published/org.ekstep.test1-1.0/editor/help.md");
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource.calls.count()).toEqual(1);
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource).toHaveBeenCalledWith("org.ekstep.test1", "1.0", "editor/help.md");
    });

    it("should not resolve resource path", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "resolvePluginResource").and.callThrough();
        spyOn(org.ekstep.pluginframework.publishedRepo, "resolveResource").and.callThrough();
        var path = org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.dskjhfgk", "1.0", "editor/help.md");
        expect(path).toBe(false);
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource).not.toHaveBeenCalled();
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource.calls.count()).not.toEqual(1);
        expect(org.ekstep.pluginframework.publishedRepo.resolveResource).not.toHaveBeenCalledWith("org.ekstep.test1", "1.0", "editor/help.md");
    });

    it("should call load plugins with empty object and should call callback method", function() {
        var loadAllPluginCb = jasmine.createSpy('loadAllPluginCb');
        org.ekstep.pluginframework.pluginManager.loadAllPlugins([], undefined, loadAllPluginCb);
        expect(loadAllPluginCb).toHaveBeenCalled();
    });

    it("should call invoke and addError", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "invoke").and.callThrough();
        spyOn(org.ekstep.pluginframework.pluginManager, "addError").and.callThrough();
        org.ekstep.pluginframework.pluginManager.invoke("org.test.test");
        expect(org.ekstep.pluginframework.pluginManager.addError).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.addError).toHaveBeenCalledWith("No plugin found for - org.test.test");
        expect(org.ekstep.pluginframework.pluginManager.errors.length).toEqual(1);
        expect(org.ekstep.pluginframework.pluginManager.getErrors()).toEqual(["No plugin found for - org.test.test"]);
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
        spyOn(org.ekstep.pluginframework.pluginManager, "invoke").and.callThrough();
        org.ekstep.pluginframework.pluginManager.invoke("org.ekstep.test1", data);

    });

    xit("should call invoke and throw error", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "invoke").and.callThrough();
        expect(org.ekstep.pluginframework.pluginManager.invoke("org.ekstep.test1", undefined)).toThrowError();
    });

    it("get manifest should return undefined", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "getPluginManifest").and.callThrough();
        var value = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ksjdhf.sdjhfg");
        expect(value).toBe(undefined);
    });

    it("should remove plugin instance by calling removePluginInstance", function() {
        var PIlength = Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length;
        var lastPI = org.ekstep.pluginframework.pluginManager.pluginInstances[Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances)[0]];
        spyOn(org.ekstep.pluginframework.pluginManager, "removePluginInstance").and.callThrough();
        org.ekstep.pluginframework.pluginManager.removePluginInstance(lastPI);
        expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).not.toEqual(PIlength);
    });

    it("should not load plugin js file", function() {
        var defectManifest = JSON.parse('{ "id": "org.ekstep.test1", "ver": "1.0", "shortId": "shape", "author": "Santhosh Vasabhaktula", "title": "Shape Plugin", "type": "widget", "description": "", "publishedDate": "", "editor": { "main": "plugin.js", "dependencies": [], "menu": [{ "id": "shape", "category": "main", "type": "icon", "toolTip": "Add Shapes", "title": "Shapes", "iconClass": "icon-shape icon", "submenu": [{ "id": "rectangle", "type": "icon", "toolTip": "Add Rectangle", "title": "Rectangle", "iconClass": "icon-rectangle icon", "onclick": { "id": "org.ekstep.test1:create", "data": { "type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 } } }] }], "behaviour": { "rotatable": true }, "configManifest": [{ "propertyName": "color", "title": "Fill Color", "description": "Choose a color from the color picker", "dataType": "colorpicker", "required": true, "defaultValue": "#000000" }], "help": { "src": "editor/help.md", "dataType": "text" }, "init-data": { "type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25 } } } ');
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPluginByManifest").and.callThrough();
        spyOn(console, "error").and.callThrough();
        org.ekstep.pluginframework.pluginManager.loadPluginByManifest(defectManifest, org.ekstep.pluginframework.publishedRepo);
        expect(console.error).toHaveBeenCalled();
        expect(console.error.calls.count()).toEqual(1);
        //expect(console.error).objectContaining('Unable to load editor plugin');        
    });

    it("should load packaged core plugin invoking register function directly", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "registerPlugin").and.callThrough();
        org.ekstep.pluginframework.pluginManager.registerPlugin({"id":"org.ekstep.delete","ver":"1.0","author":"Santhosh Vasabhaktula","title":"Delete Plugin","description":"","publishedDate":"","editor":{"main":"editor/plugin.js","menu":[{"id":"delete","category":"context","type":"icon","toolTip":"Delete","title":"Delete","iconClass":"trash outline icon","state":"HIDE","onclick":{"id":"delete:invoke","data":{}}}]}},eval('EkstepEditor.basePlugin.extend({type:"delete",picker:void 0,initialize:function(){var e=this;EkstepEditorAPI.addEventListener("delete:invoke",this.deleteObject,this),EkstepEditorAPI.addEventListener("object:selected",this.objectSelected,this),EkstepEditorAPI.addEventListener("object:unselected",this.objectUnSelected,this),EkstepEditorAPI.registerKeyboardCommand("del",function(){e.deleteObject()})},deleteObject:function(e,t){var d=EkstepEditorAPI.getEditorGroup(),i=EkstepEditorAPI.getEditorObject(),o=this;i?o.remove(i):d&&(EkstepEditorAPI.getCanvas().discardActiveGroup(),d.getObjects().forEach(function(e){o.remove(e)}))},remove:function(e){EkstepEditorAPI.dispatchEvent("delete:invoked",{editorObj:EkstepEditorAPI.getPluginInstance(e.id).attributes}),EkstepEditorAPI.getCanvas().remove(e),EkstepEditorAPI.dispatchEvent("stage:modified",{id:e.id})},objectSelected:function(e,t){EkstepEditorAPI.updateContextMenu({id:"delete",state:"SHOW",data:{}})},objectUnSelected:function(e,t){EkstepEditorAPI.updateContextMenu({id:"delete",state:"HIDE",data:{}})}});'))
        expect(org.ekstep.pluginframework.pluginManager.registerPlugin).toHaveBeenCalled();
    });

    it('should handle plugin instance failures gracefully', function() {
        unregisterPlugin("org.ekstep.test2");
        var pluginsCount = _.keys(org.ekstep.pluginframework.pluginManager.pluginObjs).length;
        org.ekstep.pluginframework.pluginManager.loadPlugin("org.ekstep.test2", "1.0", function() {
            var newCount = _.keys(org.ekstep.pluginframework.pluginManager.pluginObjs).length;
            expect(newCount).toBe(pluginsCount + 1);    
        });        
        
        org.ekstep.pluginframework.pluginManager.loadPlugin("org.ekstep.test7", "1.0", function() {
            spyOn(org.ekstep.pluginframework.eventManager, "dispatchEvent").and.callThrough();
            var pluginInstancesCount = _.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length;
            var error = undefined;
            try {
                org.ekstep.pluginframework.pluginManager.invoke('org.ekstep.test7', {}, undefined, undefined);
            } catch(e) {
                console.log('Error:', e);
                error = e;
            }
            var newPluginInstancesCount = _.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length;
            expect(error).toBe('Unable to create a new instance');
            expect(pluginInstancesCount).toBe(newPluginInstancesCount);
            expect(org.ekstep.pluginframework.eventManager.dispatchEvent).not.toHaveBeenCalled();
        });
    })

    xit('should not load plugin js file', function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPluginByManifest").and.callThrough();
        spyOn(console, "error").and.callThrough();
        org.ekstep.pluginframework.pluginManager.loadPlugin("org.ekstep.defecttest","1.0");
    });
});
