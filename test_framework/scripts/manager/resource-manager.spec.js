describe("resource manager unit test case", function() {
    var rm = org.ekstep.pluginframework.resourceManager;
    beforeEach(function() {
        rm.registeredRepos = [];
    });

    describe("addRepo method", function() {
        beforeEach(function() {
            rm.registeredRepos = [];
        });

        it("should add repo with specified position", function() {
            rm.addRepo(org.ekstep.pluginframework.draftRepo, 0);
            rm.addRepo(org.ekstep.pluginframework.publishedRepo, 0);
            expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.publishedRepo);
            expect(rm.registeredRepos[1]).toEqual(org.ekstep.pluginframework.draftRepo);
        });

        it("should add repo and push to bottom of repos when position is not specified", function() {
            rm.addRepo(org.ekstep.pluginframework.draftRepo); //adds first
            rm.addRepo(org.ekstep.pluginframework.publishedRepo); // adds second        	
            expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.draftRepo);
            expect(rm.registeredRepos[1]).toEqual(org.ekstep.pluginframework.publishedRepo);
        });

        it("should not add repo if it already added", function() {
            spyOn(console, "error").and.callThrough();
            rm.addRepo(org.ekstep.pluginframework.publishedRepo);
            rm.addRepo(org.ekstep.pluginframework.publishedRepo);
            expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.publishedRepo);
            expect(console.error).toHaveBeenCalledWith("published: Repo already registered!");
        });
    });

    describe("discoverManifest method", function() {
        beforeEach(function() {
            rm.registeredRepos = [];
        });

        it("should discover manifest from registered repos", function() {
            var spyFn = jasmine.createSpy();
            rm.addRepo(org.ekstep.pluginframework.draftRepo, 0);
            rm.addRepo(org.ekstep.pluginframework.publishedRepo, 0);
            rm.discoverManifest("org.ekstep.seven", "1.0", spyFn, undefined);
            expect(spyFn).toHaveBeenCalledWith(undefined, jasmine.any(Object));
        });

        it("should call callback when no repos are registered", function() {
            var spyFn = jasmine.createSpy();
            rm.discoverManifest("org.ekstep.seven", "1.0", spyFn, undefined);
            expect(spyFn).toHaveBeenCalledWith("Plugin not found in any repo or manifest", undefined);
        });
    });
});
