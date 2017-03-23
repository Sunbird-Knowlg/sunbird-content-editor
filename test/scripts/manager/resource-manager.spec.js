describe("Resource Manager test cases", function() {
    var pluginManifest = '{ "id": "org.ekstep.config", "ver": "1.0", "author": "Santhosh Vasabhaktula", "title": "Config Plugin", "description": "", "publishedDate": "", "editor": { "main": "editor/plugin.js", "dependencies": [ {"type": "js", "src": "editor/libs/jquery-ui.min.js"}, {"type": "js", "src": "editor/libs/micromarkdown.min.js"}, {"type": "css", "src": "editor/config.css"} ], "menu": [{ "id": "settings", "category": "config", "type": "icon", "toolTip": "Settings", "title": "Settings", "iconClass": "settings icon", "onclick": { "id": "config:settings:show" } },{ "id": "help", "category": "config", "type": "icon", "toolTip": "Help", "title": "Help", "iconClass": "help icon", "onclick": { "id": "config:help:show" } },{ "id": "comments", "category": "config", "type": "icon", "toolTip": "Comments", "title": "Comments", "iconClass": "comments icon", "onclick": { "id": "config:comments:show" } }] } } ';
    beforeAll(function(done) {
        spyOn(EkstepEditor.resourceManager, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "getResource").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadExternalResource").and.callThrough();
        done();
    });

    it("should discover Manifest from host repo", function() {
        spyOn(EkstepEditor.hostRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadResource").and.callFake(function(url, dataType, callback, publishedTime) {
            if (url.indexOf("manifest.json")) {
                callback(undefined, pluginManifest)
            }
        });
        EkstepEditor.resourceManager.discoverManifest("org.ekstep.config", "1.0", function(err, res) {}, new Date().toString());
        expect(EkstepEditor.hostRepo.discoverManifest).toHaveBeenCalled();
        expect(EkstepEditor.hostRepo.discoverManifest.calls.count()).toEqual(1);
    });
    it("should discover Manifest from all repos and throw error", function() {
        spyOn(EkstepEditor.publishedRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.draftRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.hostRepo, "discoverManifest").and.callThrough();
        spyOn(EkstepEditor.resourceManager, "loadResource").and.callFake(function(url, dataType, callback, publishedTime) {
            if (url.indexOf("manifest.json")) {
                callback("manifest not found", undefined)
            }
        });
        EkstepEditor.resourceManager.discoverManifest("org.ekstep.hajsgdj", "1.0", function(err, res) {}); 
        expect(EkstepEditor.publishedRepo.discoverManifest).toHaveBeenCalled();
        expect(EkstepEditor.publishedRepo.discoverManifest.calls.count()).toEqual(1);
        expect(EkstepEditor.draftRepo.discoverManifest).toHaveBeenCalled();
        expect(EkstepEditor.draftRepo.discoverManifest.calls.count()).toEqual(1);
        expect(EkstepEditor.hostRepo.discoverManifest).toHaveBeenCalled();
        expect(EkstepEditor.hostRepo.discoverManifest.calls.count()).toEqual(1);
    });
   

});
