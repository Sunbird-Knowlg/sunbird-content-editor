describe("Ekstep editor test", function() {
    beforeAll(function() {
        var corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.copypaste": "1.0"
        };

        // test plugins
        org.ekstep.contenteditor.config.plugins = {
            "org.ekstep.test1": "1.0",
            "org.ekstep.test2": "1.0",
            "org.ekstep.test3": "1.0",
            "org.ekstep.test4": "1.0",
            "org.ekstep.test5": "1.0",
            "org.ekstep.test6": "1.0"
        };

        //load core plugins from s3
        org.ekstep.contenteditor.api.setConfig('pluginRepo', "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins");
        _.forIn(corePlugins, function(value, key) {
            org.ekstep.pluginframework.pluginManager.loadPlugin(key, value);
        });

        org.ekstep.pluginframework.publishedRepo.basePath = "base/test/data/published";
        org.ekstep.contenteditor.api.setConfig('pluginRepo', "base/test/data/published");
        org.ekstep.pluginframework.hostRepo.basePath = "base/test/data/hosted";
        org.ekstep.pluginframework.draftRepo.basePath = "base/test/data/draft";
        org.ekstep.pluginframework.hostRepo.connected = true;

        org.ekstep.contenteditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: "#FFFFFF", preserveObjectStacking: true, width: 720, height: 405 });
        org.ekstep.contenteditor.stageManager.registerEvents();
    });

    afterAll(function() {
        org.ekstep.pluginframework.pluginManager.cleanUp();
        org.ekstep.contenteditor.stageManager.cleanUp();
    });

    it('should load plugin', function() {
        spyOn(org.ekstep.contenteditor.api, "loadPlugin").and.callThrough();
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPlugin").and.callThrough();
        org.ekstep.contenteditor.api.loadPlugin("org.ekstep.test1", "1.0");
        expect(org.ekstep.contenteditor.api.loadPlugin).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.test1", "1.0");
    });

    it('should get plugin repo', function() {
        spyOn(org.ekstep.contenteditor.api, "getPluginRepo").and.callThrough();
        var returnValue = org.ekstep.contenteditor.api.getPluginRepo();
        expect(returnValue).toBe(org.ekstep.contenteditor.config.pluginRepo);
        expect(org.ekstep.contenteditor.api.getPluginRepo).toHaveBeenCalled();
    });

    it('should call loadAndInitPlugin', function() {
        spyOn(org.ekstep.contenteditor.api, "loadAndInitPlugin").and.callThrough();
        spyOn(org.ekstep.pluginframework.pluginManager, "loadAndInitPlugin").and.callThrough();
        org.ekstep.contenteditor.api.loadAndInitPlugin("org.ekstep.test1", "1.0");
        var returnValue = org.ekstep.pluginframework.pluginManager.loadAndInitPlugin("rg.ekstep.test1-1.0");
        expect(returnValue).toBe(1);
        expect(org.ekstep.contenteditor.api.loadAndInitPlugin).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.pluginManager.loadAndInitPlugin).toHaveBeenCalled();
    });

    it("should load help for plugin", function(done) {
        spyOn(org.ekstep.contenteditor.api, "loadPluginResource").and.callThrough();
        org.ekstep.contenteditor.api.loadPluginResource("org.ekstep.test2", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it('should return canvas for rendering on the editor', function() {
        spyOn(org.ekstep.contenteditor.api, "getCanvas").and.callThrough();
        var returnValue = org.ekstep.contenteditor.api.getCanvas();
        expect(org.ekstep.contenteditor.api.getCanvas).toHaveBeenCalled();
        expect(returnValue).toBeDefined();
    });

    it('should return respective services', function() {
        spyOn(org.ekstep.contenteditor.api, "getService").and.callThrough();
        expect(org.ekstep.contenteditor.api.getService("popup")).toBe(org.ekstep.services.popupService);
        expect(org.ekstep.contenteditor.api.getService("content")).toBe(org.ekstep.services.contentService);
        expect(org.ekstep.contenteditor.api.getService("assessment")).toBe(org.ekstep.services.assessmentService);
        expect(org.ekstep.contenteditor.api.getService("language")).toBe(org.ekstep.services.languageService);
        expect(org.ekstep.contenteditor.api.getService("search")).toBe(org.ekstep.services.searchService);
        expect(org.ekstep.contenteditor.api.getService("meta")).toBe(org.ekstep.services.metaService);
        expect(org.ekstep.contenteditor.api.getService("asset")).toBe(org.ekstep.services.assetService);
        expect(org.ekstep.contenteditor.api.getService("telemetry")).toBe(org.ekstep.services.telemetryService);
    });

    it('should call updateContextMenu', function() {
        spyOn(org.ekstep.contenteditor.api, "updateContextMenus").and.callThrough();
        org.ekstep.contenteditor.api.updateContextMenus([{ id: 'paste', state: 'SHOW', data: {} }]);
        expect(org.ekstep.contenteditor.api.updateContextMenus).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems.length).toEqual(3);
        expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems[0].id).toBe("copy");
    });

    it('should set contentid in config ', function() {
        spyOn(org.ekstep.contenteditor.api, "setConfig").and.callThrough();
        org.ekstep.contenteditor.api.setConfig('contentId', 'do_1122069161408757761139');
        expect(org.ekstep.contenteditor.api.setConfig).toHaveBeenCalled();
    });

    it('should return all config values', function() {
        spyOn(org.ekstep.contenteditor.api, "getAllConfig").and.callThrough();
        org.ekstep.contenteditor.api.setConfig('contentId', 'do_1122069161408757761139');
        var returnValue = org.ekstep.contenteditor.api.getAllConfig();
        expect(org.ekstep.contenteditor.api.getAllConfig).toHaveBeenCalled();
        expect(returnValue.contentId).toEqual('do_1122069161408757761139');
    });

    it('should return all global context values', function() {
        spyOn(org.ekstep.contenteditor.api, "getAllContext").and.callThrough();
        org.ekstep.contenteditor.api.setContext('contentId', 'do_1122069161408757761139');
        var returnValue = org.ekstep.contenteditor.api.getAllContext();
        expect(org.ekstep.contenteditor.api.getAllContext).toHaveBeenCalled();
        expect(returnValue.contentId).toEqual('do_1122069161408757761139');
    });

    it('should remove event listener', function() {
        spyOn(org.ekstep.contenteditor.api, "addEventListener").and.callThrough();
        spyOn(org.ekstep.contenteditor.api, "removeEventListener").and.callThrough();
        org.ekstep.contenteditor.api.addEventListener("stage:delete", function(){}, undefined);
        org.ekstep.contenteditor.api.removeEventListener("stage:delete", function(){}, undefined);
        expect(org.ekstep.contenteditor.api.removeEventListener).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.api.addEventListener).toHaveBeenCalled();
    });

    describe('when stage plugin instantiated', function() {
        var stagePlugin = 'org.ekstep.stage',
            test1Plugin = 'org.ekstep.test1',
            stageInstance,
            test1pluginInstance,
            stageECML,
            test1ECML;
        var callbackInvoked = false;

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
            stageInstance = org.ekstep.contenteditor.api.instantiatePlugin(stagePlugin, stageECML);
            stageInstance.setCanvas(canvas);
            spyOn(org.ekstep.contenteditor.api, 'getAngularScope').and.returnValue({ enableSave: function() {}, $safeApply: function() {} });
            spyOn(org.ekstep.contenteditor.api, 'dispatchEvent');

            test1pluginInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, test1ECML, stageInstance, {
                added: function(instance, options, event) {
                    callbackInvoked = true;
                }
            }); 
        });

        afterAll(function() {
            org.ekstep.pluginframework.pluginManager.cleanUp();
            org.ekstep.contenteditor.stageManager.cleanUp();
        });

        it('should retrns the current stage', function() {
            spyOn(org.ekstep.contenteditor.api, "getCurrentStage").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getCurrentStage();
            expect(org.ekstep.contenteditor.api.getCurrentStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should retrns the specified stage', function() {
            spyOn(org.ekstep.contenteditor.api, "getStage").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getStage(stageInstance.id);
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should return currently selected active object on the canvas', function() {
            spyOn(org.ekstep.contenteditor.api, "getCurrentObject").and.callThrough();
            spyOn(org.ekstep.contenteditor.api, "getPluginInstance").and.callThrough();
            var currentObject = org.ekstep.contenteditor.api.getCurrentObject();
            var currentObject = org.ekstep.contenteditor.api.getPluginInstance(currentObject.id);
            expect(org.ekstep.contenteditor.api.getCurrentObject).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.api.getPluginInstance).toHaveBeenCalled();
            expect(currentObject).toBeDefined();
        });

        it('should return false there is no selected object on the canvas', function() {
            spyOn(org.ekstep.contenteditor.api, "getCurrentObject").and.callThrough();
            org.ekstep.contenteditor.stageManager.canvas.deactivateAll().renderAll();
            var currentObject = org.ekstep.contenteditor.api.getCurrentObject();
            expect(org.ekstep.contenteditor.api.getCurrentObject).toHaveBeenCalled();
        });

        it('should retrns current group', function() {
            spyOn(org.ekstep.contenteditor.api, "getEditorGroup").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getEditorGroup();
            expect(org.ekstep.contenteditor.api.getEditorGroup).toHaveBeenCalled();
            expect(returnValue).toBe(null);
        });

        it('should retrns current object on the fabric canvas', function() {
            spyOn(org.ekstep.contenteditor.api, "getEditorObject").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getEditorObject();
            expect(org.ekstep.contenteditor.api.getEditorObject).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should refresh the canvas', function() {
            spyOn(org.ekstep.contenteditor.api, "render").and.callThrough();
            org.ekstep.contenteditor.api.render();
            expect(org.ekstep.contenteditor.api.render).toHaveBeenCalled();
        });

        it('should return plugin instance', function() {
            spyOn(org.ekstep.contenteditor.api, "getPlugin").and.callThrough();
            var pluginid = org.ekstep.contenteditor.api.getPlugin("org.ekstep.test1");
            expect(org.ekstep.contenteditor.api.getPlugin).toHaveBeenCalled();
            expect(pluginid).toBeDefined();
        });

        it('should adds a plugin instance to the manager', function() {
            spyOn(org.ekstep.contenteditor.api, "addPluginInstance").and.callThrough();
            org.ekstep.contenteditor.api.addPluginInstance(test1pluginInstance);
            expect(org.ekstep.contenteditor.api.addPluginInstance).toHaveBeenCalled();
            expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).toEqual(2);
        });

        it("should remove plugin instance by calling removePluginInstance", function() {
            var PIlength = Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length;
            var lastPI = org.ekstep.pluginframework.pluginManager.pluginInstances[Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances)[0]];
            spyOn(org.ekstep.contenteditor.api, "removePluginInstance").and.callThrough();
            org.ekstep.contenteditor.api.removePluginInstance(lastPI);
            expect(org.ekstep.contenteditor.api.removePluginInstance).toHaveBeenCalled();
            expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).not.toEqual(PIlength);
        });

        it('should get all stages', function() {
            spyOn(org.ekstep.contenteditor.api, "getAllStages").and.callThrough();
            org.ekstep.contenteditor.api.getAllStages();
            expect(org.ekstep.contenteditor.api.getAllStages).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.stageManager.stages.length).toEqual(1);
        });

        it('should copy of the given plugin object', function() {
            spyOn(org.ekstep.contenteditor.api, "cloneInstance").and.callThrough();
            spyOn(org.ekstep.contenteditor.api, "instantiatePlugin").and.callThrough();
            org.ekstep.contenteditor.api.cloneInstance(test1pluginInstance);
            expect(org.ekstep.contenteditor.api.cloneInstance).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.api.instantiatePlugin).toHaveBeenCalled();
            expect(test1pluginInstance.parent.id).toEqual(org.ekstep.contenteditor.api.getCurrentStage().id);
        });

        it('should call getStagePluginInstances without includeTypes', function() {
            spyOn(org.ekstep.contenteditor.api, "getStagePluginInstances").and.callThrough();
            spyOn(org.ekstep.contenteditor.api, "getStage").and.callThrough()
            var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, null, ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id]);
            expect(returnValue.length).toBeGreaterThan(0);
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id);
        });

        it('should call getStagePluginInstances with includeTypes', function() {
            spyOn(org.ekstep.contenteditor.api, "getStagePluginInstances").and.callThrough();
            spyOn(org.ekstep.contenteditor.api, "getStage").and.callThrough()
            var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, ['org.ekstep.test2'], ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id]);
            expect(returnValue.length).toBe(0);
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id);
        });

        it('should call getStagePluginInstances without excludeTypes and excludeIds', function() {
            spyOn(org.ekstep.contenteditor.api, "getStagePluginInstances").and.callThrough();
            spyOn(org.ekstep.contenteditor.api, "getStage").and.callThrough()
            var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, ['org.ekstep.test2']);
            expect(returnValue.length).toBe(0);
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id);
        });

        it('should call getPluginInstances without includeTypes', function() {
            spyOn(org.ekstep.contenteditor.api, "getPluginInstances").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getPluginInstances(null, ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id]);
            expect(returnValue.length).toBeGreaterThan(0);
        });

        it('should call getPluginInstances without includeTypes', function() {
            spyOn(org.ekstep.contenteditor.api, "getPluginInstances").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getPluginInstances(['org.ekstep.test1'], ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id]);
            expect(returnValue.length).toBe(1);
        });

        it('should call getPluginInstances without excludeTypes and excludeIds', function() {
            spyOn(org.ekstep.contenteditor.api, "getPluginInstances").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getPluginInstances(['org.ekstep.test1']);
            expect(returnValue.length).toBeGreaterThan(0);
        });

        it("should return help.md path by calling resolvePluginResource", function() {
            spyOn(org.ekstep.contenteditor.api, "resolvePluginResource").and.callThrough();
            spyOn(org.ekstep.pluginframework.pluginManager, "resolvePluginResource").and.callThrough();
            var src = org.ekstep.contenteditor.api.resolvePluginResource("org.ekstep.test2", "1.0", "editor/help.md");
            expect(org.ekstep.pluginframework.pluginManager.resolvePluginResource).toHaveBeenCalled();
            expect(src).toBe("base/test/data/published/org.ekstep.test2-1.0/editor/help.md");
        });

        it("should return media object", function() {
            var audio = '{"asset" : "do_10095959","assetMedia" : {"id" : "do_10095959", "name" : "test ","preload" : "true","src : https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/1475505176audio_1475505049712.mp3","type" : "audio"}}';
            org.ekstep.contenteditor.mediaManager.mediaMap["do_10095959"] = audio;
            spyOn(org.ekstep.contenteditor.api, "getMedia").and.callThrough();
            var returnValue = org.ekstep.contenteditor.api.getMedia("do_10095959");
            expect(org.ekstep.contenteditor.api.getMedia).toHaveBeenCalled();
            expect(returnValue).toEqual(audio);
        });

        it("should return the plugins group array", function() {
            var canvas = org.ekstep.contenteditor.stageManager.canvas,
                group = new fabric.Group();
            group.add(org.ekstep.contenteditor.stageManager.canvas.getObjects()[0]);
            group.add(org.ekstep.contenteditor.stageManager.canvas.getObjects()[1]);
            canvas.setActiveGroup(group);
            canvas.add(group);
            spyOn(org.ekstep.contenteditor.api, "getCurrentGroup").and.callThrough();
            expect(org.ekstep.contenteditor.api.getCurrentGroup().length).toEqual(2);
        });

        it('should override functions dynamically while instantiating a plugin', function() {
            test1pluginInstance.added();
            expect(callbackInvoked).toBe(true);
        })
    });


});
