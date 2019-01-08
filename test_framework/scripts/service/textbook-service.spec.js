describe('textbook service test case specs', function () {
	it('should trigger a callback with response on upload toc', function (done) {
		// eslint-disable-next-line
        var uploadResponse = {"id":"api.textbook.toc.upload","ver":"v1","ts":"2019-01-03 04:31:55:253+0000","params":{"resmsgid":null,"msgid":"549f8b9f-d781-4dcd-8368-fd8e7c1295a3","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"content_id":"do_1126688431799009281592","identifiers":{"2813b8a287b132f60b98293d87c1c46c":"do_1126688453853347841594","bb9eda172cdc75f93fb3d59d1f6313fd":"do_1126688453853429761595","55b90cefc672f001814a6e4a242b3e63":"do_1126688453853511681596","076f2ae41ac7494013b61de51c359e40":"do_1126688453853839361597","595f125bd3aaeb999a390b9e48eb59b8":"do_1126688453853921281598"},"versionKey":"1546489915210"}}
		// eslint-disable-next-line
        org.ekstep.services.textbookService.postFromService = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: uploadResponse
			})
		})
		var contentId = 'do_1126688431799009281592'
		// eslint-disable-next-line
        var fileUrl = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/hierarchy/do_1126688431799009281592/validfilewithvaliddata.csv'
		// eslint-disable-next-line
        org.ekstep.services.textbookService.uploadFile(contentId, fileUrl, function(err,res){
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
	it('should trigger a callback with response on download toc', function (done) {
		// eslint-disable-next-line
        var downloadResponse = {"id":"api.textbook.toc.download","ver":"v1","ts":"2019-01-03 04:33:10:522+0000","params":{"resmsgid":null,"msgid":"17454862-5a14-432e-a9cd-0b5065f6c316","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"textbook":{"tocUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_1126688431799009281592_test-log-book_1546489915210.csv","ttl":"86400"}}}
		// eslint-disable-next-line
        org.ekstep.services.textbookService.getFromService = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, {
				data: downloadResponse
			})
		})
		var contentId = 'do_1126688431799009281592'

		org.ekstep.services.textbookService.downloadFile(contentId, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(res.data.responseCode).toEqual('OK')
			done()
		})
	})
})
