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
    });

    it("should register plugins with plugin manager", function() {
        EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function() {});
        //assert plugin registry
    });
});
