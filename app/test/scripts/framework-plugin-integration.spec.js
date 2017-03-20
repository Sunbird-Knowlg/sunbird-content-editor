describe("framework integration test: ", function() {
    var corePlugins,
        canvas;
    beforeAll(function() {
        corePlugins = {
            "org.ekstep.stage": "1.0"
        };

        // test plugins
        EkstepEditor.config.plugins = {
            "org.ekstep.test1": "1.0",
            "org.ekstep.test2": "1.0",
            "org.ekstep.test3": "1.0",
            "org.ekstep.test4": "1.0",
            "org.ekstep.test5": "1.0"
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

    describe('when plugin load and register', function() {
        it("should register plugins with plugin manager", function(done) {
            EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function() {
                _.forIn(EkstepEditor.config.plugins, function(value, key) {
                    expect(EkstepEditor.pluginManager.isDefined(key)).toBe(true);
                    expect(EkstepEditor.pluginManager.getPluginManifest(key)).toBeDefined();
                });
                done();
            });
        });

    });

    describe('when stage plugin instantiated', function() {
        var stagePlugin = 'org.ekstep.stage',
            stageInstance,
            stageECML;

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
            stageInstance = EkstepEditorAPI.instantiatePlugin(stagePlugin, stageECML);
        });

        it('instance properties should be defined', function() {
            expect(stageInstance.id).toBeDefined();
            expect(stageInstance.manifest).toBeDefined();
            expect(stageInstance.attributes).toEqual(jasmine.objectContaining({ x: 0, y: 0, w: 720, h: 405, id: stageInstance.id }));
            expect(stageInstance.config).toEqual(jasmine.objectContaining({ "opacity": 100, "strokeWidth": 1, "stroke": "rgba(255, 255, 255, 0)", "autoplay": false, "visible": true, "genieControls": true, "instructions": "" }));
        });

        it('instance should not have children and parent', function() {
            expect(stageInstance.parent).toBeUndefined();
            expect(stageInstance.children.length).toBe(0);
        });

        it('should register stage event listeners', function() {
            expect(EventBus.hasEventListener("stage:create")).toBe(true);
            expect(EventBus.hasEventListener("object:modified")).toBe(true);
            expect(EventBus.hasEventListener("stage:modified")).toBe(true);
            expect(EventBus.hasEventListener("object:selected")).toBe(true);
            expect(EventBus.hasEventListener("object:removed")).toBe(true);
            expect(EventBus.hasEventListener("stage:select")).toBe(true);
            expect(stageInstance.onclick).toEqual({ id: 'stage:select', data: { stageId: stageInstance.id } });
            expect(stageInstance.ondelete).toEqual({ id: 'stage:delete', data: { stageId: stageInstance.id } });
            expect(stageInstance.duplicate).toEqual({ id: 'stage:duplicate', data: { stageId: stageInstance.id } });
        });

        xit('on "stage:select" event, it should call stage manager selectStage method', function() {
            spyOn(EkstepEditor.stageManager, 'selectStage');
            EkstepEditor.eventManager.dispatchEvent("stage:select", { stageId: stageInstance.id });
            expect(EkstepEditor.stageManager.selectStage).toHaveBeenCalled();
        });


        //TODO: assert stage events are registered and stage manager functions are called.

    });


    describe('when test1 plugin instantiated', function() {
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

        it('instance properties should be defined', function() {
            expect(test1pluginInstance.id).toBeDefined();
            expect(test1pluginInstance.manifest).toBeDefined();
            expect(test1pluginInstance.getAttributes()).toBeDefined(jasmine.objectContaining({ type: 'rect', x: 72, y: 81, fill: '#FFFF00', w: 100.8, h: 101.25, stroke: 'rgba(255, 255, 255, 0)', strokeWidth: '1', opacity: '1', rotate: '0', "z-index": '0', id: test1pluginInstance.id }));
            expect(test1pluginInstance.getConfig()).toEqual({ "opacity": 100, "strokeWidth": 1, "stroke": "rgba(255, 255, 255, 0)", "autoplay": false, "visible": true, "color": "#FFFF00" });
        });

        it('instance should be added to plugin registery', function() {
            expect(EkstepEditor.pluginManager.getPluginInstance(test1pluginInstance.id)).toBeDefined();
        });

        it('should fire plugin lifecycle event', function() {
            var manifest = EkstepEditor.pluginManager.getPluginManifest(test1Plugin);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: manifest.id, version: manifest.ver, instanceId: test1pluginInstance.id }));
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith(manifest.id + ':add');
        });

        it('instance editor object should be defined', function() {
            expect(test1pluginInstance.editorObj).toBeDefined();
        });

        it('stage instance should have test1 plugin instance as its children', function() {
            expect(stageInstance.children.length).toBe(1);
        });

        it('should fire stage modified event', function() {
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('stage:modified', jasmine.objectContaining({ id: test1pluginInstance.id }));
        });

        it('should add menu to the toolbar', function() {
            var manifest = EkstepEditor.pluginManager.getPluginManifest(test1Plugin);
            var getMenuIndex = _.findIndex(EkstepEditor.toolbarManager.menuItems, function(menu) {
                return menu.id === manifest.editor.menu[0].id;
            });
            expect(EkstepEditor.toolbarManager.menuItems[getMenuIndex].id).toBe(manifest.editor.menu[0].id);
        });

        it('instance should give the ECML', function() {
            var ecml = test1pluginInstance.toECML();
            //TODO: assert ECML;
        });
    });
});