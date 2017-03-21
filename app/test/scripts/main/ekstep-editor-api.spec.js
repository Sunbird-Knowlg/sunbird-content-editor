describe("Ekstep editor test", function() {
    beforeAll(function() {
        var corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.copypaste": "1.0"
        };

        // test plugins
        EkstepEditor.config.plugins = {
            "org.ekstep.test1": "1.0",
            "org.ekstep.test2": "1.0",
            "org.ekstep.test3": "1.0",
            "org.ekstep.test4": "1.0",
            "org.ekstep.test5": "1.0",
            "org.ekstep.test6": "1.0"
        };

        //load core plugins from s3
        EkstepEditor.publishedRepo.basePath = "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins";
        _.forIn(corePlugins, function(value, key) {
            EkstepEditor.pluginManager.loadPlugin(key, value);
        });

        EkstepEditor.publishedRepo.basePath = "base/app/test/data/published";
        EkstepEditor.hostRepo.basePath = "base/app/test/data/hosted";
        EkstepEditor.draftRepo.basePath = "base/app/test/data/draft";
        EkstepEditor.hostRepo.connected = true;

        EkstepEditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: "#FFFFFF", preserveObjectStacking: true, width: 720, height: 405 });
        EkstepEditor.stageManager.registerEvents();
    });

    afterAll(function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
    });

    it('should load plugin', function(){
        spyOn(EkstepEditorAPI, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        EkstepEditorAPI.loadPlugin("org.ekstep.test1","1.0");
        expect(EkstepEditorAPI.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.test1","1.0");
    });

    it('should get plugin repo', function(){
        spyOn(EkstepEditorAPI, "getPluginRepo").and.callThrough();
        var returnValue = EkstepEditorAPI.getPluginRepo();
        expect(returnValue).toBe('/plugins');
        expect(EkstepEditorAPI.getPluginRepo).toHaveBeenCalled();
    });

    it('should call loadAndInitPlugin', function(){
        spyOn(EkstepEditorAPI, "loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"loadAndInitPlugin").and.callThrough();
        EkstepEditorAPI.loadAndInitPlugin("org.ekstep.test1","1.0");
        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("rg.ekstep.test1-1.0");
        expect(returnValue).toBe(1);
        expect(EkstepEditorAPI.loadAndInitPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadAndInitPlugin).toHaveBeenCalled();
    });

    it("should load help for plugin", function(done) {
        spyOn(EkstepEditorAPI,"loadPluginResource").and.callThrough();
        EkstepEditorAPI.loadPluginResource("org.ekstep.test2", "1.0", "editor/help.md", "text", function(err, res){
            done();
        })
    });

    it('should return canvas for rendering on the editor', function(){
        spyOn(EkstepEditorAPI, "getCanvas").and.callThrough();
        var returnValue = EkstepEditorAPI.getCanvas();
        expect(EkstepEditorAPI.getCanvas).toHaveBeenCalled();
        expect(returnValue).toBeDefined();
    });

    describe('when stage plugin instantiated', function() {
        var stagePlugin = 'org.ekstep.stage',
            test1Plugin = 'org.ekstep.test1',
            stageInstance,
            test1pluginInstance,
            stageECML,
            test1ECML;

        beforeAll(function() {
            stageECML = {
                "config": {
                    "__cdata": '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"genieControls":true,"instructions":""}'
                },
                "param": {
                    "name": "next",
                    "value": "splash"
                },
                "x": "0",
                "y": "0",
                "w": "100",
                "h": "100",
                "id": "d2646852-8114-483b-b5e1-29e604b69cac",
                "rotate": ""
            };
            test1ECML = {
                "config": {
                    "__cdata": '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"color":"#FFFF00"}',
                },
                "type": "rect",
                "x": "10",
                "y": "20",
                "fill": "#FFFF00",
                "w": "14",
                "h": "25",
                "stroke": "rgba(255, 255, 255, 0)",
                "strokeWidth": "1",
                "opacity": "1",
                "rotate": "0",
                "z-index": "0",
                "id": "2113ee4e-b090-458e-a0b0-5ee6668cb6dc"
            };
            stageInstance = EkstepEditorAPI.instantiatePlugin(stagePlugin, stageECML);
            stageInstance.setCanvas(canvas);
            spyOn(EkstepEditorAPI, 'getAngularScope').and.returnValue({ enableSave: function() {}, $safeApply: function() {} });
            spyOn(EkstepEditorAPI, 'dispatchEvent');
            test1pluginInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
        });

        afterAll(function() {
            EkstepEditor.pluginManager.cleanUp();
            EkstepEditor.stageManager.cleanUp();
        });

        it('should retrns the current stage', function(){
            spyOn(EkstepEditorAPI, "getCurrentStage").and.callThrough();
            var returnValue = EkstepEditorAPI.getCurrentStage();
            expect(EkstepEditorAPI.getCurrentStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should retrns the specified stage', function(){
            spyOn(EkstepEditorAPI, "getStage").and.callThrough();
            var returnValue = EkstepEditorAPI.getStage(stageInstance.id);
            expect(EkstepEditorAPI.getStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should return currently selected active object on the canvas', function(){
            spyOn(EkstepEditorAPI, "getCurrentObject").and.callThrough();
            spyOn(EkstepEditorAPI, "getPluginInstance").and.callThrough();
            var currentObject = EkstepEditorAPI.getCurrentObject();
            var currentObject = EkstepEditorAPI.getPluginInstance(currentObject.id);
            expect(EkstepEditorAPI.getCurrentObject).toHaveBeenCalled();
            expect(EkstepEditorAPI.getPluginInstance).toHaveBeenCalled();
            expect(currentObject).toBeDefined();
        });

        xit('should retrns current group of selected objects', function(){
            spyOn(EkstepEditorAPI, "getCurrentGroup").and.callThrough();
            var returnValue = EkstepEditorAPI.getCurrentGroup();
            expect(EkstepEditorAPI.getCurrentGroup).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should retrns current object on the fabric canvas', function(){
            spyOn(EkstepEditorAPI, "getEditorObject").and.callThrough();
            var returnValue = EkstepEditorAPI.getEditorObject();
            expect(EkstepEditorAPI.getEditorObject).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should refresh the canvas', function(){
            spyOn(EkstepEditorAPI, "render").and.callThrough();
            EkstepEditorAPI.render();
            expect(EkstepEditorAPI.render).toHaveBeenCalled();
        });

        it('should return plugin instance', function(){
            spyOn(EkstepEditorAPI, "getPlugin").and.callThrough();
            var pluginid = EkstepEditorAPI.getPlugin("org.ekstep.test1");
            expect(EkstepEditorAPI.getPlugin).toHaveBeenCalled();
            expect(pluginid).toBeDefined();
        });
    });
});
