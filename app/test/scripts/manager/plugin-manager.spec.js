describe("Plugin Manager test cases", function() {

    beforeAll(function(){
        var corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.copypaste": "1.0"
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

    afterAll(function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
    });
    it("should load and init plugin", function() {
        spyOn(EkstepEditor.pluginManager,"loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"isDefined").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"getPluginManifest").and.callThrough();
        
        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("org.ekstep.test2-1.0");
        expect(returnValue).toBe(0);
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.test2","1.0",undefined);
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalledWith("org.ekstep.test2");
        expect(EkstepEditor.pluginManager.invoke).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).toHaveBeenCalledWith("org.ekstep.test2");
    });

    it("should not load and init plugin", function() {
        spyOn(EkstepEditor.pluginManager,"loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"isDefined").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager,"getPluginManifest").and.callThrough();
        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("org.ekstep.jsdklghfksjd-1.0");
        expect(returnValue).toBe(1);
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.jsdklghfksjd","1.0",undefined);
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.isDefined).toHaveBeenCalledWith("org.ekstep.jsdklghfksjd");
        expect(EkstepEditor.pluginManager.invoke).not.toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.getPluginManifest).not.toHaveBeenCalled();
    });

    it("get plugins should return plugins array", function() {
        spyOn(EkstepEditor.pluginManager,"getPlugins").and.callThrough();
        expect(EkstepEditor.pluginManager.getPlugins().length).toEqual(3);
    });

    it("should load help for plugin", function(done) {
        spyOn(EkstepEditor.pluginManager,"loadPluginResource").and.callThrough();
        EkstepEditor.pluginManager.loadPluginResource("org.ekstep.test2", "1.0", "editor/help.md", "text", function(err, res){
            done();
        })
    });

    it("should not load help for plugin", function(done) {
        spyOn(EkstepEditor.pluginManager,"loadPluginResource").and.callThrough();
        EkstepEditor.pluginManager.loadPluginResource("org.ekstep.sdfsdfsd", "1.0", "editor/help.md", "text", function(err, res){
            done();
        })
    });

    it("should resolve resource path", function() {
        spyOn(EkstepEditor.pluginManager,"resolvePluginResource").and.callThrough();
        spyOn(EkstepEditor.publishedRepo,"resolveResource").and.callThrough();
        var path = EkstepEditor.pluginManager.resolvePluginResource("org.ekstep.test2", "1.0", "editor/help.md");
        expect(path).toBe("base/app/test/data/published/org.ekstep.test2-1.0/editor/help.md");
        expect(EkstepEditor.publishedRepo.resolveResource).toHaveBeenCalled();
        expect(EkstepEditor.publishedRepo.resolveResource.calls.count()).toEqual(1);
        expect(EkstepEditor.publishedRepo.resolveResource).toHaveBeenCalledWith("org.ekstep.test2", "1.0", "editor/help.md");
    });

    it("should not resolve resource path", function() {
        spyOn(EkstepEditor.pluginManager,"resolvePluginResource").and.callThrough();
        spyOn(EkstepEditor.publishedRepo,"resolveResource").and.callThrough();
        var path = EkstepEditor.pluginManager.resolvePluginResource("org.ekstep.dskjhfgk", "1.0", "editor/help.md");
        expect(path).toBe(false);
        expect(EkstepEditor.publishedRepo.resolveResource).not.toHaveBeenCalled();
        expect(EkstepEditor.publishedRepo.resolveResource.calls.count()).not.toEqual(1);
        expect(EkstepEditor.publishedRepo.resolveResource).not.toHaveBeenCalledWith("org.ekstep.test2", "1.0", "editor/help.md");
    });

    it("should call load plugins with empty object and should call callback method", function() {
        spyOn(EkstepEditor.pluginManager, "loadAllPlugins").and.callThrough();
        EkstepEditor.pluginManager.loadAllPlugins({}, function(){
            expect(Object.keys(EkstepEditor.pluginManager.plugins).length).toEqual(3);
        })
    });

    it("should call invoke and addError", function() {
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "addError").and.callThrough();
        EkstepEditor.pluginManager.invoke("org.test.test");
        expect(EkstepEditor.pluginManager.addError).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.addError).toHaveBeenCalledWith("No plugin found for - org.test.test");
        expect(EkstepEditor.pluginManager.errors.length).toEqual(1);
        expect(EkstepEditor.pluginManager.getErrors()).toEqual(["No plugin found for - org.test.test"]);
    });

    it("should load array of plugins with invoke", function(){
        var data = [{
                        "type": "rect",
                        "x": 10,
                        "y": 20,
                        "fill": "#FFFF00",
                        "w": 14,
                        "h": 25,
                        "stroke": "rgba(255, 255, 255, 0)",
                        "strokeWidth": 1,
                        "opacity": 1
                    },{
                        "type": "rect",
                        "x": 10,
                        "y": 20,
                        "fill": "#FFFFF0",
                        "w": 14,
                        "h": 25,
                        "stroke": "rgba(255, 255, 0, 0)",
                        "strokeWidth": 1,
                        "opacity": 1
                    }];
        spyOn(EkstepEditor.pluginManager, "invoke").and.callThrough();
        EkstepEditor.pluginManager.invoke("org.ekstep.test2", data);

    })
});