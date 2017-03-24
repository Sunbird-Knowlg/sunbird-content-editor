describe("plugin framework integration test: ", function() {
    var corePlugins,
        canvas,
        cleanUp;

    cleanUp = function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
        EkstepEditor.toolbarManager.cleanUp();
    }

    beforeAll(function() {
        cleanUp();

        //EkstepEditor.init();
        EkstepEditor.globalContext = {};
        corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.shape": "1.0",
            "org.ekstep.image": "1.0",
            "org.ekstep.audio": "1.0"
        };

        // test plugins
        EkstepEditor.config = {
            plugins: {
                "org.ekstep.test1": "1.0",
                "org.ekstep.test2": "1.0",
                "org.ekstep.test3": "1.0",
                "org.ekstep.test4": "1.0",
                "org.ekstep.test5": "1.0"
            },
            corePlugins: ["text", "audio", "div", "hotspot", "image", "shape", "scribble", "htext"],
            corePluginMapping: {
                "text": "org.ekstep.text",
                "image": "org.ekstep.image",
                "shape": "org.ekstep.shape",
                "stage": "org.ekstep.stage",
                "hotspot": "org.ekstep.hotspot",
                "scribble": "org.ekstep.scribblepad",
                "htext": "org.ekstep.text",
                "audio": "org.ekstep.audio"
            }
        };

        EkstepEditor.config.useProxyForURL = false;

        //load core plugins from s3
        EkstepEditor.publishedRepo.basePath = "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins";
        _.forIn(corePlugins, function(value, key) {
            EkstepEditor.pluginManager.loadPlugin(key, value);
        });

        EkstepEditor.publishedRepo.basePath = "base/test/data/published";
        EkstepEditor.hostRepo.basePath = "base/test/data/hosted";
        EkstepEditor.draftRepo.basePath = "base/test/data/draft";
        EkstepEditor.hostRepo.connected = true;

        EkstepEditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: "#FFFFFF", preserveObjectStacking: true, width: 720, height: 405 });
        EkstepEditor.stageManager.registerEvents();
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

        it('on "stage:select" event, it should call stage manager selectStage method', function() {
            spyOn(EkstepEditorAPI, 'dispatchEvent').and.callThrough();
            EkstepEditorAPI.dispatchEvent("stage:select", { stageId: stageInstance.id });
            expect(EkstepEditor.stageManager.currentStage.id).toBe(stageInstance.id);
            expect(EkstepEditor.stageManager.currentStage.isSelected).toBe(true);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('config:showSettingsTab', { id: EkstepEditor.stageManager.currentStage.id });
        });

        it('should dispatch "stage:add" event on Stage add', function() {
            spyOn(EkstepEditorAPI, 'dispatchEvent').and.callThrough();
            var newStageInstance = EkstepEditorAPI.instantiatePlugin(stagePlugin, stageECML);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith("stage:add", { stageId: newStageInstance.id, prevStageId: stageInstance.id });
        });

        it('on "stage:duplicate" event, it should call stage manager duplicateStage method', function() {
            spyOn(EkstepEditor.stageManager, 'getStageIndex').and.returnValue(0);
            spyOn(EkstepEditorAPI, 'dispatchEvent').and.callThrough();
            EkstepEditorAPI.dispatchEvent("stage:duplicate", { stageId: stageInstance.id });
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('stage:create', jasmine.objectContaining({ "position": "afterCurrent" }));
            expect(EkstepEditor.stageManager.currentStage.isSelected).toBe(true);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('config:showSettingsTab', { id: EkstepEditor.stageManager.currentStage.id });
        });

        it('on stage delete, it should dispatch event: "stage:removed"', function() {
            spyOn(EkstepEditorAPI, 'dispatchEvent').and.callThrough();
            spyOn(EkstepEditor.stageManager, 'getStageIndex').and.returnValue(0);
            var noOfstages = EkstepEditorAPI.getAllStages().length;
            EkstepEditor.stageManager.deleteStage({}, { stageId: stageInstance.id });
            expect(EkstepEditor.stageManager.stages.length).toBe(noOfstages - 1);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('stage:removed', { stageId: stageInstance.id });
        });

        it('on stage drag/drop it should dispacth event: "stage:reorder"', function() {
            spyOn(EkstepEditorAPI, 'dispatchEvent').and.callThrough();
            var firstStage = EkstepEditorAPI.getAllStages()[0];
            var secondStage = EkstepEditorAPI.getAllStages()[1];
            EkstepEditor.stageManager.onStageDragDrop(secondStage.id, firstStage.id);
            expect(EkstepEditorAPI.getAllStages()[0].id).toBe(secondStage.id);
            expect(EkstepEditorAPI.getAllStages()[1].id).toBe(firstStage.id);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('stage:reorder', { stageId: secondStage.id, fromIndex: 1, toIndex: 0 });
        });
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
            spyOn(EkstepEditor.basePlugin.prototype, 'added').and.callThrough();
            spyOn(EkstepEditor.basePlugin.prototype, 'selected').and.callThrough();
            test1pluginInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
        });

        afterAll(function() {
            EkstepEditor.stageManager.canvas.clear();
        });

        it('instance properties should be defined', function() {
            expect(test1pluginInstance.id).toBeDefined();
            expect(test1pluginInstance.manifest).toBeDefined();
            expect(test1pluginInstance.getAttributes()).toBeDefined(jasmine.objectContaining({ type: 'rect', x: 72, y: 81, fill: '#FFFF00', w: 100.8, h: 101.25, stroke: 'rgba(255, 255, 255, 0)', strokeWidth: '1', opacity: '1', rotate: '0', "z-index": '0', id: test1pluginInstance.id }));
            expect(test1pluginInstance.getConfig()).toEqual({ "opacity": 100, "strokeWidth": 1, "stroke": "rgba(255, 255, 255, 0)", "autoplay": false, "visible": true, "color": "#FFFF00" });
        });

        it('should call added method', function() {
            expect(test1pluginInstance.added).toHaveBeenCalled();
        });

        it('should call selected method', function() {
            expect(test1pluginInstance.selected).toHaveBeenCalled();
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
            var pluginEcml = {
                "type": "rect",
                "x": 10,
                "y": 20,
                "fill": "#FFFF00",
                "w": 13.86,
                "h": 24.75,
                "stroke": "rgba(255, 255, 255, 0)",
                "strokeWidth": "1",
                "opacity": "1",
                "rotate": 0,
                "z-index": "0",
                "id": test1pluginInstance.id,
                "config": {
                    "__cdata": '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"color":"#FFFF00"}',
                }
            };

            var ecml = test1pluginInstance.toECML();
            expect(ecml).toEqual(pluginEcml);
        });

        it('on copy/paste should create new instance', function() {
            spyOn(test1pluginInstance, 'getCopy');
            spyOn(EkstepEditorAPI, 'instantiatePlugin');

            EkstepEditorAPI.cloneInstance(test1pluginInstance);

            expect(test1pluginInstance.getCopy).toHaveBeenCalled();
            expect(EkstepEditorAPI.instantiatePlugin).toHaveBeenCalled();
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith(test1pluginInstance.manifest.id + ':add');
        });

        it('on plugin instance delete, it should remove that instance', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            var numberOfPluginInstance = Object.keys(EkstepEditor.pluginManager.pluginInstances).length;

            newInstance.remove();

            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('stage:modified', { id: newInstance.id });
            expect(EkstepEditor.pluginManager.getPluginInstance(newInstance.id)).toBeUndefined();
        });

        it('on editorObj delete, removed method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'remove').and.callThrough();

            EkstepEditorAPI.getCanvas().remove(newInstance.editorObj);

            expect(newInstance.remove).toHaveBeenCalled();
        });

        it('on editorObj modified, modified method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'changed').and.callThrough();

            newInstance.editorObj.trigger("modified");

            expect(newInstance.changed).toHaveBeenCalled();
        });

        it('on editorObj rotating, rotating method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'rotating').and.callThrough();

            newInstance.editorObj.trigger("rotating");

            expect(newInstance.rotating).toHaveBeenCalled();
        });

        it('on editorObj scaling, scaling method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'scaling').and.callThrough();

            newInstance.editorObj.trigger("scaling");

            expect(newInstance.scaling).toHaveBeenCalled();
        });

        it('on editorObj moving, moving method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'moving').and.callThrough();

            newInstance.editorObj.trigger("moving");

            expect(newInstance.moving).toHaveBeenCalled();
        });

        it('on editorObj skewing, skewing method should be called', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            spyOn(newInstance, 'skewing').and.callThrough();

            newInstance.editorObj.trigger("skewing");

            expect(newInstance.skewing).toHaveBeenCalled();
        });

        it('instance can set its config', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance.setConfig({ supertext: true });

            expect(newInstance.config).toEqual({ supertext: true });
        });

        it('instance can set its data', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance.setData({ textStyle: 'bold', font: 'verdana' });

            expect(newInstance.data).toEqual({ textStyle: 'bold', font: 'verdana' });
        });

        it('instance can add events', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance.addEvent({ action: 'play' });

            expect(newInstance.event[0]).toEqual({ action: 'play' });
        });

        it('instance can set its attribute', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance.setAttribute("animate", false);

            expect(_.has(newInstance.attributes, 'animate')).toBe(true);
        });

        it('on config changes, instance config properties should be set', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance._onConfigChange('opacity', 0.3);
            newInstance._onConfigChange('strokeWidth', 2);
            newInstance._onConfigChange('stroke', 1);
            newInstance._onConfigChange('autoplay', true);
            newInstance._onConfigChange('visible', false);

            expect(newInstance.config.opacity).toBe(0.3);
            expect(newInstance.config.strokeWidth).toBe(2);
            expect(newInstance.config.stroke).toBe(1);
            expect(newInstance.config.autoplay).toBe(true);
            expect(newInstance.config.visible).toBe(false);
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith("object:modified", { target: newInstance.editorObj });
        });

        xit('instance can get its own help text', function(done) {
            var helpText;
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            newInstance.getHelp(function(text) {
                helpText = text;
                done();
            });

            expect(helpText).toBeDefined();
        });

        it('instance can get its own config manifest data', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            expect(newInstance.getConfigManifest()).toEqual([{ "propertyName": "color", "title": "Fill Color", "description": "Choose a color from the color picker", "dataType": "colorpicker", "required": true, "defaultValue": "#000000" }]);
        });

        it('instance can get relative URL of its own resource', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            
            expect(newInstance.relativeURL("editor/help.md")).toBe("base/test/data/published/org.ekstep.test1-1.0/editor/help.md");
        });

        it('instance copy should retutn its editorObj', function() {
            var newInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance);
            expect(newInstance.doCopy()).toEqual(newInstance.editorObj);
        });
    });

    describe('when new ECML content is loaded to framework', function() {
        var getPluginCount;

        beforeAll(function(done) {
            console.log('-------STAGE MANAGER ECML TEST STARTS----- ');
            EkstepEditor.pluginManager.pluginInstances = {};
            EkstepEditor.stageManager.stages = [];

            getPluginCount = function(plugin) {
                var pluginsCount;
                pluginsCount = { //update the count based on the content: content can be found in ECMLContent.fixture.js
                    "shape": 3,
                    "media": 2,
                    "total": 0,
                    "stage": 3,
                    "image": 1,
                    "audio": 1,
                    "text": 0
                };

                _.forIn(_.omit(pluginsCount, ['total', 'media']), function(value, key) {
                    pluginsCount.total += value;
                });

                return pluginsCount[plugin];
            };

            EkstepEditorAPI.setContext('contentId', "do_112206722833612800186");

            spyOn(EkstepEditorAPI, 'getAngularScope').and.returnValue({ toggleGenieControl: function() {}, enableSave: function() {}, appLoadMessage: [], $safeApply: function() {} });
            spyOn(EkstepEditor.stageManager, 'showLoadScreenMessage').and.returnValue(true);
            spyOn(EkstepEditorAPI, 'dispatchEvent');
            spyOn(EkstepEditorAPI, 'instantiatePlugin').and.callThrough();
            spyOn(EkstepEditor.stageManager, 'onContentLoad').and.callThrough();
            spyOn(EkstepEditor.eventManager, 'dispatchEvent');
            spyOn(EkstepEditor.stageManager, 'registerEvents').and.callThrough();
            spyOn(EkstepEditor.telemetryService, 'start').and.callThrough();

            EkstepEditor.stageManager.fromECML(JSON.parse(contentResponse.result.content.body), contentResponse.result.content.stageIcons);

            setTimeout(function() { // let stage load all its plugins
                done();
            }, 2000);

            (function initTelemetry() {
                EkstepEditor.telemetryService.initialize({
                    uid: "346",
                    sid: "",
                    content_id: EkstepEditorAPI.getContext('contentId')
                }, "console");
            })();
        });

        afterAll(function() {
            EkstepEditor.stageManager.canvas.clear();
            console.log('-------STAGE MANAGER ECML TEST ENDS----- ');
        });

        it('should call instantiate stage and plugin', function() {
            expect(EkstepEditorAPI.instantiatePlugin).toHaveBeenCalled();
            expect(EkstepEditorAPI.instantiatePlugin.calls.count()).toEqual(getPluginCount('total'));
        });

        it('should dispatch telemetry "CE_START" event', function() {
            expect(EkstepEditor.telemetryService.start).toHaveBeenCalled();
            expect(EkstepEditor.telemetryService.start.calls.count()).toBe(1);
        });

        it('stage manager should have stage defined', function() {
            expect(EkstepEditor.stageManager.stages.length).toBe(getPluginCount('stage'));
        });

        it('plugin manager should have plugin instances', function() {
            expect(Object.keys(EkstepEditor.pluginManager.pluginInstances).length).toBe(getPluginCount('total'));
        });

        it('should call stage manager onContentLoad method', function() {
            expect(EkstepEditor.stageManager.onContentLoad).toHaveBeenCalled();
        });

        it('should register stage manager events', function() {
            expect(EkstepEditor.stageManager.registerEvents).toHaveBeenCalled();
        });

        it('after content load: should enable the event bus', function() {
            expect(EkstepEditor.eventManager.enableEvents).toBe(true);
        });

        it('after content load: should fire "content:load:complete" event', function() {
            expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith("content:load:complete");
        });

        it('after content load: should fire select stage event', function() {
            expect(EkstepEditor.eventManager.dispatchEvent).toHaveBeenCalledWith('stage:select', { stageId: EkstepEditor.stageManager.stages[0].id });
        });

        it('should give back the ECML', function() {
            var getEcmlPluginCount, ecml = EkstepEditor.stageManager.toECML();

            getEcmlPluginCount = function(plugin) {
                var count = 0;
                _.forEach(ecml.theme.stage, function(stage) {
                    if (stage[plugin] && stage[plugin].length) count += stage[plugin].length;
                });
                return count;
            };

            expect(ecml.theme.version).toBe("1.0");
            expect(ecml.theme.startStage).toBeDefined();
            expect(ecml.theme.stage.length).toBe(getPluginCount('stage'));
            expect(ecml.theme.manifest.media.length).toBe(getPluginCount('media'));
            expect(getEcmlPluginCount('shape')).toBe(getPluginCount('shape'));
            expect(getEcmlPluginCount('image')).toBe(getPluginCount('image'));
            expect(getEcmlPluginCount('audio')).toBe(getPluginCount('audio'));

            var stage1 = _.find(ecml.theme.stage, { id: '4d0657d8-27ba-4e2c-b4a6-795202e4d754' });
            expect(stage1.manifest).toBeDefined();
            expect(stage1.manifest.media).toBeDefined();
            expect(stage1.manifest.media.length).toBe(0);

            var stage2 = _.find(ecml.theme.stage, { id: '9701579a-029a-4466-818c-630321926a3e' });
            expect(stage2.manifest).toBeDefined();
            expect(stage2.manifest.media).toBeDefined();
            expect(stage2.manifest.media.length).toBe(1);
            expect(stage2.manifest.media[0].assetId).toBe('do_112193622951706624125');

            var stage3 = _.find(ecml.theme.stage, { id: '5d075bd1-d1c9-499b-87e9-d2bcdbb51786' });
            expect(stage3.manifest).toBeDefined();
            expect(stage3.manifest.media).toBeDefined();
            expect(stage3.manifest.media.length).toBe(1);
            expect(stage3.manifest.media[0].assetId).toBe('do_1121989168199106561309');

            // TODO: Enhance the stage manifest test cases to add more test cases for 
            // 1. Duplicate assets within a stage
            // 2. Plugin, js and css should also be in the manifest
            // 3. Enhance the test data to also contain quiz plugin
        });

        it('should generate stageIcons when toECML', function() {
            expect(Object.keys(EkstepEditor.stageManager.getStageIcons()).length).toBe(getPluginCount('stage'));
        });
    });
});
