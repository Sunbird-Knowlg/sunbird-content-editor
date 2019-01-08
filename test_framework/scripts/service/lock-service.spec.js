describe('lock service test case specs', function () {
	it('should trigger a callback with response on create lock', function (done) {
        var createResponse = {"id":"api.lock.create","ver":"1.0","ts":"2019-01-02T10:23:04.694Z","params":{"resmsgid":"63ee5960-0e78-11e9-a415-63ad28cb6028","msgid":"63d8d590-0e78-11e9-a6b7-0f5e854cdf1a","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"lockKey":"ac94d6e8-9e29-4d67-8127-b8a85db55fb8","expiresAt":"2019-01-02T10:25:04.566Z","expiresIn":2}} // eslint-disable-line
		org.ekstep.services.lockService.postFromService = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: createResponse
			})
		})
        var reqObj = {"request":{"resourceId":"do_112658388373561344146","resourceType":"Content","resourceInfo":"{}","createdBy":"6d4da241-a31b-4041-bbdb-dd3a898b3f85","creatorInfo":"{\"name\" : \"Content Creator\",\"id\" : \"6d4da241-a31b-4041-bbdb-dd3a898b3f85\"}"}} // eslint-disable-line
		org.ekstep.services.lockService.createLock(reqObj, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
	it('should trigger a callback with response on refresh lock', function (done) {
        var refreshResponse = {"id":"api.v1.refresh","ver":"1.0","ts":"2019-01-02T12:11:37.486Z","params":{"resmsgid":"8ddb8ae0-0e87-11e9-b9f1-a53b73aa5a33","msgid":"8dd71e10-0e87-11e9-94ad-e1d093567ef2","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"lockKey":"bf4655a4-4c22-495e-96cf-3ed578d12d71","expiresAt":"2019-01-02T13:11:37.458Z","expiresIn":60}} // eslint-disable-line
		org.ekstep.services.lockService.patch = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: refreshResponse
			})
		})
        var reqObj = {"request":{"resourceId":"do_112658388373561344146","resourceType":"Content","lockId":"85c914b9-d5d7-4121-8390-aeab873aa60a"}} // eslint-disable-line
		org.ekstep.services.lockService.refreshLock(reqObj, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
	it('should trigger a callback with response on retire lock', function (done) {
        var retireResponse = {"id":"api.lock.retire","ver":"1.0","ts":"2019-01-02T12:11:37.486Z","params":{"resmsgid":"8ddb8ae0-0e87-11e9-b9f1-a53b73aa5a33","msgid":"8dd71e10-0e87-11e9-94ad-e1d093567ef2","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{}} // eslint-disable-line
		org.ekstep.services.lockService.delete = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: retireResponse
			})
		})
		var reqObj = {'request': {'resourceId': 'do_112658388373561344146', 'resourceType': 'Content'}}
		org.ekstep.services.lockService.deleteLock(reqObj, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
})
