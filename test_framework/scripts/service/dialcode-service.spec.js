describe('dial code service test case specs', function () {
	it('should reserve dialcode and trigger callback if contentId is present', function (done) {
		var dialcodeResponse = {'id': 'api.v1.reserve', 'ver': '1.0', 'ts': '2019-01-04T03:38:48.451Z', 'params': {'resmsgid': '3ee8e530-0fd2-11e9-aff9-a58d010e9e94', 'msgid': '3e675920-0fd2-11e9-af28-d334879a91f5', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 2, 'reservedDialcodes': ['A5Q5TE', '76JXMF'], 'node_id': 'do_112669526770884608117', 'versionKey': '1546573128386', 'processId': '43f9b9aa-6158-4e59-abf3-6f7cf93b85f2'}} // eslint-disable-line
		org.ekstep.services.dialcodeService.postFromService = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: dialcodeResponse
			})
		})
		var reqObj = {'request': {'dialcodes': {'count': 2, 'qrCodeSpec': {'errorCorrectionLevel': 'H'}}}}
		var channel = 'b00bc992ef25f1a9a8d63291e20efc8d'
		var contentId = 'do_112669526770884608117'
		org.ekstep.services.dialcodeService.reserveDialCode(channel, reqObj, contentId, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
	it('should trigger callback with error if contentId is not provided', function (done) {
		var reqObj = {'request': {'dialcodes': {'count': 2, 'qrCodeSpec': {'errorCorrectionLevel': 'H'}}}}
		var channel = 'b00bc992ef25f1a9a8d63291e20efc8d'
		org.ekstep.services.dialcodeService.reserveDialCode(channel, reqObj, undefined, function (err, res) {
			expect(err).toBeDefined()
			expect(err).toEqual('contentId id is required to reserve dialCodes')
			done()
		})
	})
	it('should return dialcode download url in response if processId is present', function (done) {
		var dialcodeDownloadResponse = {'id': 'api.process.status', 'ver': '1.0', 'ts': '2019-01-04T03:49:12.903Z', 'params': {'resmsgid': 'b31cb570-0fd3-11e9-aff9-a58d010e9e94', 'msgid': 'b31a9290-0fd3-11e9-af28-d334879a91f5', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'status': 'completed', 'url': 'https://sunbirddev.blob.core.windows.net/dial/b00bc992ef25f1a9a8d63291e20efc8d/do_112669526770884608117_1546573128270.zip?sv=2017-04-17&se=2019-01-11T03%3A38%3A49Z&sr=b&sp=r&sig=JYlOs4BSTDWHGytw7T/CIjUfmgO/7f27AcpW7W9nbKM%3D'}} // eslint-disable-line
		org.ekstep.services.dialcodeService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, {
				data: dialcodeDownloadResponse
			})
		})

		var channel = 'b00bc992ef25f1a9a8d63291e20efc8d'
		var processId = '43f9b9aa-6158-4e59-abf3-6f7cf93b85f2'
		org.ekstep.services.dialcodeService.downloadQRCode(channel, processId, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
	it('should return trigger callback with error if processId is not present', function (done) {
		var channel = 'b00bc992ef25f1a9a8d63291e20efc8d'
		org.ekstep.services.dialcodeService.downloadQRCode(channel, undefined, function (err, res) {
			expect(err).toBeDefined()
			expect(err).toEqual('Process id is required to get QR codes')
			done()
		})
	})
})
