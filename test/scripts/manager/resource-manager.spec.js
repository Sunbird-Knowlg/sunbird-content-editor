describe("Resource Manager test cases", function() {
    var pluginManifest = '{ "id": "org.ekstep.config", "ver": "1.0", "author": "Santhosh Vasabhaktula", "title": "Config Plugin", "description": "", "publishedDate": "", "editor": { "main": "editor/plugin.js", "dependencies": [ {"type": "js", "src": "editor/libs/jquery-ui.min.js"}, {"type": "js", "src": "editor/libs/micromarkdown.min.js"}, {"type": "css", "src": "editor/config.css"} ], "menu": [{ "id": "settings", "category": "config", "type": "icon", "toolTip": "Settings", "title": "Settings", "iconClass": "settings icon", "onclick": { "id": "config:settings:show" } },{ "id": "help", "category": "config", "type": "icon", "toolTip": "Help", "title": "Help", "iconClass": "help icon", "onclick": { "id": "config:help:show" } },{ "id": "comments", "category": "config", "type": "icon", "toolTip": "Comments", "title": "Comments", "iconClass": "comments icon", "onclick": { "id": "config:comments:show" } }] } } ';
    beforeAll(function(done) {
        spyOn(org.ekstep.pluginframework.resourceManager, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "getResource").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "loadExternalResource").and.callThrough();
        done();
    });

    it("should discover Manifest from host repo", function() {
        spyOn(org.ekstep.pluginframework.hostRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "loadResource").and.callFake(function(url, dataType, callback, publishedTime) {
            if (url.indexOf("manifest.json")) {
                callback(undefined, pluginManifest)
            }
        });
        org.ekstep.pluginframework.resourceManager.discoverManifest("org.ekstep.config", "1.0", function(err, res) {}, new Date().toString());
        expect(org.ekstep.pluginframework.hostRepo.discoverManifest).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.hostRepo.discoverManifest.calls.count()).toEqual(1);
    });
    it("should discover Manifest from all repos and throw error", function() {
        spyOn(org.ekstep.pluginframework.publishedRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.draftRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.hostRepo, "discoverManifest").and.callThrough();
        spyOn(org.ekstep.pluginframework.resourceManager, "loadResource").and.callFake(function(url, dataType, callback, publishedTime) {
            if (url.indexOf("manifest.json")) {
                callback("manifest not found", undefined)
            }
        });
        org.ekstep.pluginframework.resourceManager.discoverManifest("org.ekstep.hajsgdj", "1.0", function(err, res) {}); 
        expect(org.ekstep.pluginframework.publishedRepo.discoverManifest).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.publishedRepo.discoverManifest.calls.count()).toEqual(1);
        expect(org.ekstep.pluginframework.draftRepo.discoverManifest).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.draftRepo.discoverManifest.calls.count()).toEqual(1);
        expect(org.ekstep.pluginframework.hostRepo.discoverManifest).toHaveBeenCalled();
        expect(org.ekstep.pluginframework.hostRepo.discoverManifest.calls.count()).toEqual(1);
    });
   

});
