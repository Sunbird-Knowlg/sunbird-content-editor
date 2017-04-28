describe(" framework integration", function() {
    var cleanUp = function() {
        org.ekstep.pluginframework.pluginManager.cleanUp();
        org.ekstep.contenteditor.stageManager.cleanUp();
        org.ekstep.contenteditor.toolbarManager.cleanUp();
    };

    beforeAll(function(done) {
        cleanUp();
        var corePlugins = [
            { "id": "org.ekstep.stage", "ver": "1.0", "type": "plugin" },
            { "id": "org.ekstep.utils", "ver": "1.0", "type": "plugin" }
        ];

        // test plugins
        org.ekstep.contenteditor.config.plugins = [
            { "id": "org.ekstep.test1", "ver": "1.0", "type": "plugin" },
            { "id": "org.ekstep.test2", "ver": "1.0", "type": "plugin" },
            { "id": "org.ekstep.test3", "ver": "1.0", "type": "plugin" }
        ];

        org.ekstep.services.config = {
            baseURL: org.ekstep.contenteditor.config.baseURL,
            apislug: org.ekstep.contenteditor.config.apislug
        }       

        org.ekstep.pluginframework.initialize({
            env: 'editor',
            pluginRepo: "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins",
            build_number: undefined
        });

        //load core plugins from s3
        org.ekstep.pluginframework.pluginManager.loadAllPlugins(corePlugins, undefined, function() {
            org.ekstep.pluginframework.config.pluginRepo = "base/test/data/published";
            done();
        });        
    });

    afterAll(function() {
        cleanUp();
    });

    it("should register plugins with plugin manager", function(done) {
        spyOn(org.ekstep.pluginframework.resourceManager, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.publishedRepo, "discoverManifest").and.callThrough();                
        spyOn(org.ekstep.pluginframework.resourceManager, "loadExternalResource").and.callThrough();        
        
        org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, undefined, function() {
            expect(org.ekstep.pluginframework.resourceManager.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.discoverManifest.calls.count()).toEqual(3);
            expect(org.ekstep.pluginframework.publishedRepo.discoverManifest).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.publishedRepo.discoverManifest.calls.count()).toEqual(3);
            expect(org.ekstep.pluginframework.resourceManager.loadExternalResource).toHaveBeenCalled();
            expect(org.ekstep.pluginframework.resourceManager.loadExternalResource.calls.count()).toEqual(2);  
            expect(org.ekstep.pluginframework.pluginManager.plugins).not.toBe({});            
            expect(Object.keys(org.ekstep.pluginframework.pluginManager.plugins).length).toEqual(5);
            done();
        });

    });

    it("should register menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.test1");
        spyOn(org.ekstep.contenteditor.toolbarManager, "registerMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.registerMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.registerMenu).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.menuItems.length).toEqual(3);
    });

    it("should register context menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.utils");
        spyOn(org.ekstep.contenteditor.toolbarManager, "registerContextMenu").and.callThrough();
        org.ekstep.contenteditor.toolbarManager.registerContextMenu(manifest.editor.menu);
        expect(org.ekstep.contenteditor.toolbarManager.registerContextMenu).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems.length).toEqual(5);                
    });

    it("should update context menu", function() {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.utils");
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
