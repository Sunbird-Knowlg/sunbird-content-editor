describe("I Repo Test cases", function() {

    it("Should call call discoverManifest", function() {
        spyOn(EkstepEditor.iRepo.prototype, "discoverManifest").and.callThrough();
        EkstepEditor.iRepo.prototype.discoverManifest("org.ekstep.test2", "1.0", function(err, res){
            expect(err).not.toBeDefined();
            expect(res).not.toBeDefined();
        });

    });
    it("sholud call resolveResource method", function() {
       spyOn(EkstepEditor.iRepo.prototype, "resolveResource").and.callThrough(); 
       var urlPath = EkstepEditor.iRepo.prototype.resolveResource("org.ekstep.test2", "1.0", "editor/help.md");
       expect(urlPath).not.toBeDefined();
    });

});