describe("I Repo Test cases", function() {

    it("Should call call discoverManifest", function() {
        spyOn(org.ekstep.pluginframework.iRepo.prototype, "discoverManifest").and.callThrough();
        org.ekstep.pluginframework.iRepo.prototype.discoverManifest("org.ekstep.test2", "1.0", function(err, res){
            expect(err).not.toBeDefined();
            expect(res).not.toBeDefined();
        });

    });
    it("sholud call resolveResource method", function() {
       spyOn(org.ekstep.pluginframework.iRepo.prototype, "resolveResource").and.callThrough(); 
       var urlPath = org.ekstep.pluginframework.iRepo.prototype.resolveResource("org.ekstep.test2", "1.0", "editor/help.md");
       expect(urlPath).not.toBeDefined();
    });

});