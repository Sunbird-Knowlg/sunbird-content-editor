describe(" framework integration", function() {
    var cleanUp = function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
        EkstepEditor.toolbarManager.cleanUp();
    };

    beforeAll(function() {
        cleanUp();
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

        EkstepEditor.publishedRepo.basePath = "base/test/data/published";
        EkstepEditor.hostRepo.basePath = "base/test/data/hosted";
        EkstepEditor.draftRepo.basePath = "base/test/data/draft";
        EkstepEditor.hostRepo.connected = true;
    });

    afterAll(function() {
        cleanUp();
    });

    it("should register plugins with plugin manager", function(done) {
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.publishedRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.draftRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.hostRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadResource").and.callThrough();
        spyOn(EkstepEditor.jQuery, "ajax").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadExternalResource").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "getResource").and.callThrough();
        
        EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function() {
            expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
            expect(EkstepEditor.pluginManager.loadPlugin.calls.count()).toEqual(7);
            expect(EkstepEditor.resourceManager.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.discoverManifest.calls.count()).toEqual(6);
            expect(EkstepEditor.publishedRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.publishedRepo.discoverManifest.calls.count()).toEqual(4);
            expect(EkstepEditor.draftRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.draftRepo.discoverManifest.calls.count()).toEqual(5);
            expect(EkstepEditor.hostRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.hostRepo.discoverManifest.calls.count()).toEqual(6);
            expect(EkstepEditor.resourceManager.loadResource).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.loadResource.calls.count()).toEqual(20);
            expect(EkstepEditor.jQuery.ajax).toHaveBeenCalled();
            expect(EkstepEditor.jQuery.ajax.calls.count()).toEqual(21);
            expect(EkstepEditor.resourceManager.loadExternalResource).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.loadExternalResource.calls.count()).toEqual(2);
            expect(EkstepEditor.resourceManager.getResource).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.getResource.calls.count()).toEqual(5);  
            expect(EkstepEditor.pluginManager.plugins).not.toBe({});
            expect(Object.keys(EkstepEditor.pluginManager.plugins).length).toEqual(7);
            done();
        });

    });

    it("should try to load plugin from hosted and fail", function() {
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        EkstepEditor.hostRepo.connected = false;
        EkstepEditor.hostRepo.init();
        EkstepEditor.pluginManager.loadPlugin("org.ekstep.testexample","1.0", new Date().toString());
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(Object.keys(EkstepEditor.pluginManager.plugins).length).toEqual(7);
        EkstepEditor.hostRepo.connected = true;
    });

    it("should register menu", function() {
        var manifest = EkstepEditor.pluginManager.getPluginManifest("org.ekstep.test1");
        spyOn(EkstepEditor.toolbarManager, "registerMenu").and.callThrough();
        EkstepEditor.toolbarManager.registerMenu(manifest.editor.menu);
        expect(EkstepEditor.toolbarManager.registerMenu).toHaveBeenCalled();
        expect(EkstepEditor.toolbarManager.menuItems.length).toEqual(3);
    });

    it("should register config menu", function() {
        var manifest = EkstepEditor.pluginManager.getPluginManifest("org.ekstep.test1");
        spyOn(EkstepEditor.toolbarManager, "registerConfigMenu").and.callThrough();
        EkstepEditor.toolbarManager.registerConfigMenu(manifest.editor.menu);
        expect(EkstepEditor.toolbarManager.registerConfigMenu).toHaveBeenCalled();
        expect(EkstepEditor.toolbarManager.configMenuItems.length).toEqual(1);
    });

    it("should register context menu", function() {
        var manifest = EkstepEditor.pluginManager.getPluginManifest("org.ekstep.copypaste");
        spyOn(EkstepEditor.toolbarManager, "registerContextMenu").and.callThrough();
        EkstepEditor.toolbarManager.registerContextMenu(manifest.editor.menu);
        expect(EkstepEditor.toolbarManager.registerContextMenu).toHaveBeenCalled();
        expect(EkstepEditor.toolbarManager.contextMenuItems.length).toEqual(3);                
    });

    it("should update context menu", function() {
        var manifest = EkstepEditor.pluginManager.getPluginManifest("org.ekstep.copypaste");
        spyOn(EkstepEditor.toolbarManager, "updateContextMenu").and.callThrough();
        EkstepEditor.toolbarManager.updateContextMenu(manifest.editor.menu);
        expect(EkstepEditor.toolbarManager.updateContextMenu).toHaveBeenCalled();
    });

    it("should reset context menu", function() {
        spyOn(EkstepEditor.toolbarManager, "resetContextMenu").and.callThrough();
        EkstepEditor.toolbarManager.resetContextMenu();
        expect(EkstepEditor.toolbarManager.resetContextMenu).toHaveBeenCalled();
    });

    it("should setscope", function() {
        spyOn(EkstepEditor.toolbarManager, "setScope").and.callThrough();
        EkstepEditor.toolbarManager.setScope(EkstepEditorAPI.getAngularScope());
        expect(EkstepEditor.toolbarManager.setScope).toHaveBeenCalled();
        expect(EkstepEditor.toolbarManager.scope).toBe(EkstepEditorAPI.getAngularScope());
    });
});
