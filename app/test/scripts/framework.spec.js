describe("Framework test cases", function() {
    EkstepEditor.config.plugins = {
        "org.ekstep.test1": "1.0",
        "org.ekstep.test2": "1.0",
        "org.ekstep.test3": "1.0",
        "org.ekstep.test4": "1.0",
        "org.ekstep.test5": "1.0"
    };    
    EkstepEditor.publishedRepo.basePath = "base/app/test/data/published";
    EkstepEditor.hostRepo.basePath = "base/app/test/data/hosted";
    EkstepEditor.draftRepo.basePath = "base/app/test/data/draft";
    EkstepEditor.hostRepo.connected = true;

    EkstepEditor.pluginManager.loadAllPlugins(EkstepEditor.config.plugins, function(){});

});
