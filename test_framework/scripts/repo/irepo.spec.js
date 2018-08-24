describe('IRepo unit test case', function () {
	describe('discoverManifest method', function () {
		it('Should call callback with undefined', function () {
			org.ekstep.pluginframework.iRepo.prototype.discoverManifest('org.ekstep.one', '1.0', function (err, res) {
				expect(err).not.toBeDefined()
				expect(res).not.toBeDefined()
			})
		})
	})
})
