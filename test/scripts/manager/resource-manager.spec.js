describe('Resource Manager test cases', function () {
	beforeAll(function (done) {
		spyOn(org.ekstep.pluginframework.resourceManager, 'discoverManifest').and.callThrough()
		spyOn(org.ekstep.pluginframework.resourceManager, 'getResource').and.callThrough()
		spyOn(org.ekstep.pluginframework.resourceManager, 'loadExternalResource').and.callThrough()
		done()
	})

	it('should discover Manifest from registered repos and throw error', function () {
		spyOn(org.ekstep.pluginframework.publishedRepo, 'discoverManifest').and.callThrough()
		spyOn(org.ekstep.pluginframework.resourceManager, 'loadResource').and.callFake(function (url, dataType, callback, publishedTime) {
			if (url.indexOf('manifest.json')) {
				// eslint-disable-next-line
				callback('manifest not found', undefined)
			}
		})
		// eslint-disable-next-line
		org.ekstep.pluginframework.resourceManager.discoverManifest('org.ekstep.hajsgdj', '1.0', function (err, res) {})
		expect(org.ekstep.pluginframework.publishedRepo.discoverManifest).toHaveBeenCalled()
		expect(org.ekstep.pluginframework.publishedRepo.discoverManifest.calls.count()).toEqual(1)
	})
})
