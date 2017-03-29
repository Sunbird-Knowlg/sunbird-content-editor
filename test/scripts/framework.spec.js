describe(" framework integration", function() {
    var cleanUp = function() {
        org.ekstep.pluginframework.pluginManager.cleanUp();
        org.ekstep.contenteditor.stageManager.cleanUp();
        org.ekstep.contenteditor.toolbarManager.cleanUp();
    };

    beforeAll(function() {
        cleanUp();
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

        org.ekstep.contenteditor.api.setConfig('pluginRepo', "base/test/data/published");
        org.ekstep.pluginframework.hostRepo.basePath = "base/test/data/hosted";
        org.ekstep.pluginframework.config.draftRepo = "base/test/data/draft";
        org.ekstep.pluginframework.hostRepo.connected = true;        
    });

    afterAll(function() {
        cleanUp();
    });

    it("should register plugins with plugin manager", function(done) {
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPlugin").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.publishedRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.draftRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.hostRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "loadResource").and.callThrough();
        spyOn(org.ekstep.contenteditor.jQuery, "ajax").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "loadExternalResource").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "getResource").and.callThrough();
        
        org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, function() {
            expect(org.ekstep.pluginframework.pluginManager.loadPlugin).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.pluginManager.loadPlugin.calls.count()).toEqual(7);
            expect(org.ekstep.pluginframework.resourceManager.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.discoverManifest.calls.count()).toEqual(6);
            expect(org.ekstep.pluginframework.publishedRepo.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.publishedRepo.discoverManifest.calls.count()).toEqual(4);
            expect(org.ekstep.pluginframework.draftRepo.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.draftRepo.discoverManifest.calls.count()).toEqual(5);
            expect(org.ekstep.pluginframework.hostRepo.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.hostRepo.discoverManifest.calls.count()).toEqual(6);
            expect(org.ekstep.pluginframework.resourceManager.loadResource).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.loadResource.calls.count()).toEqual(20);
            expect(org.ekstep.contenteditor.jQuery.ajax).toHaveBeenCalled();
            expect(org.ekstep.contenteditor.jQuery.ajax.calls.count()).toEqual(21);
            expect(org.ekstep.pluginframework.resourceManager.loadExternalResource).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.loadExternalResource.calls.count()).toEqual(2);
            expect(org.ekstep.pluginframework.resourceManager.getResource).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.getResource.calls.count()).toEqual(5);  
            expect(org.ekstep.pluginframework.pluginManager.plugins).not.toBe({});
            expect(Object.keys(org.ekstep.pluginframework.pluginManager.plugins).length).toEqual(7);
            done();
        });

    });

    it("should try to load plugin from hosted and fail", function() {
        spyOn(org.ekstep.pluginframework.pluginManager, "loadPlugin").and.callThrough();
        org.ekstep.pluginframework.hostRepo.connected = false;
        org.ekstep.pluginframework.hostRepo.init();
        org.ekstep.pluginframework.pluginManager.loadPlugin("org.ekstep.testexample","1.0", new Date().toString());
        expect(org.ekstep.pluginframework.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(Object.keys(org.ekstep.pluginframework.pluginManager.plugins).length).toEqual(7);
        org.ekstep.pluginframework.hostRepo.connected = true;
    });

    it("should register menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.test1");
        spyOn(org.ekstep.contenteditor.toolbarManager, "registerMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.registerMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.registerMenu).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.menuItems.length).toEqual(3);
    });

    it("should register config menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.test1");
        spyOn(org.ekstep.contenteditor.toolbarManager, "registerConfigMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.registerConfigMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.registerConfigMenu).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.configMenuItems.length).toEqual(1);
    });

    it("should register context menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.copypaste");
        spyOn(org.ekstep.contenteditor.toolbarManager, "registerContextMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.registerContextMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.registerContextMenu).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems.length).toEqual(3);                
    });

    it("should update context menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.copypaste");
        spyOn(org.ekstep.contenteditor.toolbarManager, "updateContextMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.updateContextMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.updateContextMenu).toHaveBeenCalled();
    });

    it("should reset context menu", function() {
        spyOn(org.ekstep.contenteditor.toolbarManager, "resetContextMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.resetContextMenu();
        expect(org.ekstep.contenteditor.toolbarManager.resetContextMenu).toHaveBeenCalled();
    });

    it("should setscope", function() {
        spyOn(org.ekstep.contenteditor.toolbarManager, "setScope").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.setScope(org.ekstep.contenteditor.api.getAngularScope());
        expect(org.ekstep.contenteditor.toolbarManager.setScope).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.scope).toBe(org.ekstep.contenteditor.api.getAngularScope());
    });
});
