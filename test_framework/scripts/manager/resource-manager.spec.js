describe('resource manager unit test case', function () {
	var rm = org.ekstep.pluginframework.resourceManager
	beforeEach(function () {
		rm.registeredRepos = []
	})

	describe('addRepo method', function () {
		beforeEach(function () {
			rm.registeredRepos = []
		})

		it('should add repo with specified position', function () {
			rm.addRepo(org.ekstep.pluginframework.draftRepo, 0)
			rm.addRepo(org.ekstep.pluginframework.publishedRepo, 0)
			expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.publishedRepo)
			expect(rm.registeredRepos[1]).toEqual(org.ekstep.pluginframework.draftRepo)
		})

		it('should add repo and push to bottom of repos when position is not specified', function () {
			rm.addRepo(org.ekstep.pluginframework.draftRepo) // adds first
			rm.addRepo(org.ekstep.pluginframework.publishedRepo) // adds second
			expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.draftRepo)
			expect(rm.registeredRepos[1]).toEqual(org.ekstep.pluginframework.publishedRepo)
		})

		it('should not add repo if it already added', function () {
			spyOn(console, 'error').and.callThrough()
			rm.addRepo(org.ekstep.pluginframework.publishedRepo)
			rm.addRepo(org.ekstep.pluginframework.publishedRepo)
			expect(rm.registeredRepos[0]).toEqual(org.ekstep.pluginframework.publishedRepo)
			expect(console.error).toHaveBeenCalledWith('published: Repo already registered!')
		})
	})

	describe('discoverManifest method', function () {
		beforeEach(function () {
			rm.registeredRepos = []
		})

		it('should discover manifest from registered repos', function () {
			var spyFn = jasmine.createSpy()
			rm.addRepo(org.ekstep.pluginframework.draftRepo, 0)
			rm.addRepo(org.ekstep.pluginframework.publishedRepo, 0)
			rm.discoverManifest('org.ekstep.seven', '1.0', spyFn, undefined)
			expect(spyFn).toHaveBeenCalledWith(undefined, jasmine.any(Object))
		})

		it('should call callback when no repos are registered', function () {
			var spyFn = jasmine.createSpy()
			rm.discoverManifest('org.ekstep.seven', '1.0', spyFn, undefined)
			expect(spyFn).toHaveBeenCalledWith('Plugin not found in any repo or manifest', undefined)
		})
	})

	describe('loadExternalResource method', function () {
		it('should add external script to the HTML body when callback is undefined', function () {
			spyOn(org.ekstep.pluginframework, 'jQuery').and.returnValue({ append: function () {} })
			rm.loadExternalResource('somescript.js', 'js', undefined, undefined)
			expect(org.ekstep.pluginframework.jQuery).toHaveBeenCalledWith('body')
		})

		it('should add external stylesheet to the HTML head', function () {
			var spyFn = jasmine.createSpy()
			spyOn(org.ekstep.pluginframework, 'jQuery').and.returnValue({ append: function () {} })
			rm.loadExternalResource('somestylesheet.css', 'css', undefined, spyFn)
			expect(org.ekstep.pluginframework.jQuery).toHaveBeenCalledWith('head')
			expect(spyFn).toHaveBeenCalled()
		})

		it('should call loadResource method when callback is defined for script type', function () {
			spyOn(org.ekstep.pluginframework, 'jQuery').and.returnValue({ append: function () {} })
			spyOn(rm, 'loadResource')
			rm.loadExternalResource('somescript.js', 'js', undefined, function () {})
			expect(rm.loadResource).toHaveBeenCalledWith('somescript.js', 'script', jasmine.any(Function), undefined)
			expect(org.ekstep.pluginframework.jQuery).not.toHaveBeenCalled()
		})

		it('should call the callback when script type not matched', function () {
			var spyFn = jasmine.createSpy()
			rm.loadExternalResource('somefile.xml', 'xml', undefined, spyFn)
			expect(spyFn).toHaveBeenCalled()
		})
	})
})
