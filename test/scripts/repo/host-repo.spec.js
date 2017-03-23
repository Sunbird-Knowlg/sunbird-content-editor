describe("Host Repo Test cases", function() {

    it("should ", function() {
        spyOn(EkstepEditor.hostRepo, "checkConnection").and.callFake(function(cb){
            cb(undefined,"success");
        });
        EkstepEditor.hostRepo.init();
        expect(EkstepEditor.hostRepo.connected).toBe(true);
    });

});