describe(" framework integration", function() {
    beforeAll(function() {        
        var corePlugins = {
            "org.ekstep.stage": "1.0"
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
    });

    it("should register plugins with plugin manager", function(done) {
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.publishedRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.draftRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.hostRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadResource").and.callThrough();
        spyOn(EkstepEditor.jQuery, "ajax").and.callThrough();
        
        
        EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function() {
           // console.log("count", EkstepEditor.resourceManager.loadResource.calls.count());
            expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
            expect(EkstepEditor.pluginManager.loadPlugin.calls.count()).toEqual(6);
            expect(EkstepEditor.resourceManager.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.discoverManifest.calls.count()).toEqual(6);
            expect(EkstepEditor.publishedRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.publishedRepo.discoverManifest.calls.count()).toEqual(6);
            expect(EkstepEditor.draftRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.draftRepo.discoverManifest.calls.count()).toEqual(3);
            expect(EkstepEditor.hostRepo.discoverManifest).toHaveBeenCalled();
            expect(EkstepEditor.hostRepo.discoverManifest.calls.count()).toEqual(2);
            expect(EkstepEditor.resourceManager.loadResource).toHaveBeenCalled();
            expect(EkstepEditor.resourceManager.loadResource.calls.count()).toEqual(16);
            expect(EkstepEditor.jQuery.ajax).toHaveBeenCalled();
            expect(EkstepEditor.jQuery.ajax.calls.count()).toEqual(17);
            done();
        });
        
    });
});
