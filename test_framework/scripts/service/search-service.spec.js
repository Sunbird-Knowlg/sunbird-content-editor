describe('Search service test cases', function () {
	// eslint-disable-next-line
	var activities = '{ "id": "ekstep.composite-search.search", "ver": "2.0", "ts": "2017-03-21T10:44:30ZZ", "params": { "resmsgid": "c385eb72-3439-4d36-9f16-b4c5bb057d6c", "msgid": null, "err": null, "status": "successful", "errmsg": null }, "responseCode": "OK", "result": { "count": 18, "content": [ { "code": "org.ekstep.funtoot.spnib", "description": "org.ekstep.funtoot.spnib", "language": [ "English" ], "mimeType": "application/vnd.ekstep.plugin-archive", "idealScreenSize": "normal", "createdOn": "2017-03-17T07:05:33.638+0000", "objectType": "Content", "gradeLevel": [ "Grade 1" ], "lastUpdatedOn": "2017-03-17T08:15:19.936+0000", "contentType": "Plugin", "owner": "funtoot", "lastUpdatedBy": "452", "identifier": "org.ekstep.funtoot.spnib", "os": [ "All" ], "visibility": "Default", "createdBy": "449", "mediaType": "content", "osId": "org.ekstep.quiz.app", "ageGroup": [ "5-6" ], "graph_id": "domain", "nodeType": "DATA_NODE", "versionKey": "1489739224203", "idealScreenDensity": "hdpi", "compatibilityLevel": 1, "domain": [ "numeracy" ], "name": "org.ekstep.funtoot.spnib", "testCSVImportField": 1, "status": "Live", "node_id": 98692, "concepts": [ "C6" ], "semanticVersion": "1.0", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/org.ekstep.funtoot.spnib/artifact/org.ekstep.funtoot.spnib-1.0_449_1489738438_1489738512663.zip", "lastPublishedBy": "452", "size": 342813, "lastPublishedOn": "2017-03-17T08:27:03.603+0000", "downloadUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/org.ekstep.funtoot.spnib/org.ekstep.funtoot.spnib_1489739223603_org.ekstep.funtoot.spnib_2.0.ecar", "variants": "{\"spine\":{\"ecarUrl\":\"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/org.ekstep.funtoot.spnib/org.ekstep.funtoot.spnib_1489739223785_org.ekstep.funtoot.spnib_2.0_spine.ecar\",\"size\":259410.0}}", "pkgVersion": 2, "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/org.ekstep.funtoot.spnib/artifact/0669012aa9b13e1825692d28b476c766_1488545887467.thumb.jpeg", "posterImage": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112194167909982208121/artifact/0669012aa9b13e1825692d28b476c766_1488545887467.jpeg", "es_metadata_id": "org.ekstep.funtoot.spnib" } ] } }'
	beforeAll(function () {
		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}
		org.ekstep.services.searchService.post = jasmine.createSpy().and
			.callFake(function (url, data, headers, cb) {
				cb(undefined, activities)
			})
	})

	it('should return activities on search method call', function () {
		// eslint-disable-next-line
		var request = '{ "request": { "query": "", "filters":{ "contentType": ["Plugin"], "status": ["Live"], "category": [] }, "sort_by": { "lastUpdatedOn": "desc" }, "limit": 1 } }' 
		spyOn(org.ekstep.services.searchService, 'search').and.callThrough()
		spyOn(org.ekstep.services.searchService, 'postFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.searchService.search(request, function (err, res) {
			expect(err).toBeUndefined()
			expect(res).toBe(activities)
			expect(org.ekstep.services.searchService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.searchService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on search method call', function () {
		org.ekstep.services.searchService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		// eslint-disable-next-line
		var request = '{ "request": { "query": "", "filters":{ "contentType": ["Plugin"], "status": ["Live"], "category": [] }, "sort_by": { "lastUpdatedOn": "desc" }, "limit": 1 } }'
		spyOn(org.ekstep.services.searchService, 'search').and.callThrough()
		spyOn(org.ekstep.services.searchService, 'postFromService').and.callThrough()
		org.ekstep.services.searchService.search(request, function (err, res) {
			expect(err).toBe('no data found')
			expect(res).toBeUndefined()
			expect(org.ekstep.services.searchService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.searchService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should search for plugin content types if url is provided', function (done) {
		// eslint-disable-next-line
		var pluginResult = {"id":"api.plugins.search","ver":"1.0","ts":"2019-01-03T10:02:29.863Z","params":{"resmsgid":"ae53d770-0f3e-11e9-b9f1-a53b73aa5a33","msgid":"ae472d40-0f3e-11e9-94ad-e1d093567ef2","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"count":6,"content":[{"code":"LP_NFT_PLUGIN_TEST_7","keywords":["Content","Story"],"downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_7/test_3_1510051202508_lp_nft_plugin_test_7_132.0.ecar","channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_7/test_3_1510051202635_lp_nft_plugin_test_7_132.0_spine.ecar","size":904}},"idealScreenSize":"normal","createdOn":"2017-11-02T06:29:04.127+0000","objectType":"Content","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_plugin_test_7/artifact/archive_1509604147722.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-11-02T06:29:08.217+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2017-11-07T10:40:02.723+0000","contentType":"Plugin","lastUpdatedBy":"Test","identifier":"LP_NFT_PLUGIN_TEST_7","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"Test","graph_id":"domain","nodeType":"DATA_NODE","pkgVersion":132,"versionKey":"1510051202723","idealScreenDensity":"hdpi","s3Key":"ecar_files/LP_NFT_PLUGIN_TEST_7/test_3_1510051202508_lp_nft_plugin_test_7_132.0.ecar","size":7940,"lastPublishedOn":"2017-11-07T10:40:02.508+0000","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":5723},{"code":"LP_NFT_PLUGIN_TEST_2","keywords":["Content","Story"],"downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_2/test_3_1509994921786_lp_nft_plugin_test_2_16.0.ecar","channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_2/test_3_1509994921854_lp_nft_plugin_test_2_16.0_spine.ecar","size":905}},"idealScreenSize":"normal","createdOn":"2017-10-27T07:34:13.602+0000","objectType":"Content","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_plugin_test_2/artifact/archive_1509089653600.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-27T07:34:40.173+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2017-11-06T19:02:01.962+0000","contentType":"Plugin","lastUpdatedBy":"Test","identifier":"LP_NFT_PLUGIN_TEST_2","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"Test","graph_id":"domain","nodeType":"DATA_NODE","pkgVersion":16,"versionKey":"1509994921962","idealScreenDensity":"hdpi","s3Key":"ecar_files/LP_NFT_PLUGIN_TEST_2/test_3_1509994921786_lp_nft_plugin_test_2_16.0.ecar","size":7938,"lastPublishedOn":"2017-11-06T19:02:01.786+0000","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":51744},{"code":"LP_NFT_PLUGIN_TEST_5","keywords":["Content","Story"],"downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_5/test_3_1509995100316_lp_nft_plugin_test_5_8.0.ecar","channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_5/test_3_1509995100477_lp_nft_plugin_test_5_8.0_spine.ecar","size":908}},"idealScreenSize":"normal","createdOn":"2017-10-29T06:54:25.744+0000","objectType":"Content","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_plugin_test_5/artifact/archive_1509260084120.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-29T06:54:47.928+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2017-11-06T19:05:00.610+0000","contentType":"Plugin","lastUpdatedBy":"Test","identifier":"LP_NFT_PLUGIN_TEST_5","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"Test","graph_id":"domain","nodeType":"DATA_NODE","pkgVersion":8,"versionKey":"1509995100610","idealScreenDensity":"hdpi","s3Key":"ecar_files/LP_NFT_PLUGIN_TEST_5/test_3_1509995100316_lp_nft_plugin_test_5_8.0.ecar","size":7942,"lastPublishedOn":"2017-11-06T19:05:00.316+0000","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":61351},{"code":"org.ekstep.plugins.test_03","keywords":["Content","Story"],"channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","idealScreenSize":"normal","createdOn":"2017-10-10T12:09:56.053+0000","objectType":"Content","appId":"ekstep_portal","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/org.ekstep.plugins.test_03/artifact/test_03_1507637442547.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-10T12:11:17.763+0000","contentType":"Plugin","identifier":"org.ekstep.plugins.test_03","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","graph_id":"domain","nodeType":"DATA_NODE","versionKey":"1507637477763","idealScreenDensity":"hdpi","s3Key":"content/org.ekstep.plugins.test_03/artifact/test_03_1507637442547.zip","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":125895},{"code":"LP_NFT_PLUGIN_TEST_4","keywords":["Content","Story"],"downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_4/test_3_1509995100071_lp_nft_plugin_test_4_8.0.ecar","channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_4/test_3_1509995100178_lp_nft_plugin_test_4_8.0_spine.ecar","size":910}},"idealScreenSize":"normal","createdOn":"2017-10-29T06:47:03.806+0000","objectType":"Content","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_plugin_test_4/artifact/archive_1509259643073.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-29T06:47:33.678+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2017-11-06T19:05:00.291+0000","contentType":"Plugin","lastUpdatedBy":"Test","identifier":"LP_NFT_PLUGIN_TEST_4","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"Test","graph_id":"domain","nodeType":"DATA_NODE","pkgVersion":8,"versionKey":"1509995100291","idealScreenDensity":"hdpi","s3Key":"ecar_files/LP_NFT_PLUGIN_TEST_4/test_3_1509995100071_lp_nft_plugin_test_4_8.0.ecar","size":7944,"lastPublishedOn":"2017-11-06T19:05:00.071+0000","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":61332},{"code":"LP_NFT_PLUGIN_TEST_6","keywords":["Content","Story"],"downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_6/test_3_1509995100636_lp_nft_plugin_test_6_8.0.ecar","channel":"in.ekstep","description":"Test","language":["English"],"mimeType":"application/vnd.ekstep.plugin-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_PLUGIN_TEST_6/test_3_1509995100769_lp_nft_plugin_test_6_8.0_spine.ecar","size":914}},"idealScreenSize":"normal","createdOn":"2017-10-29T07:05:08.965+0000","objectType":"Content","contentDisposition":"inline","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_plugin_test_6/artifact/archive_1509260295650_1509260708989.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-29T07:05:09.460+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2017-11-06T19:05:00.857+0000","contentType":"Plugin","lastUpdatedBy":"Test","identifier":"LP_NFT_PLUGIN_TEST_6","audience":["Learner"],"visibility":"Default","os":["All"],"consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"Test","graph_id":"domain","nodeType":"DATA_NODE","pkgVersion":8,"versionKey":"1509995100857","idealScreenDensity":"hdpi","s3Key":"ecar_files/LP_NFT_PLUGIN_TEST_6/test_3_1509995100636_lp_nft_plugin_test_6_8.0.ecar","size":8519,"lastPublishedOn":"2017-11-06T19:05:00.636+0000","compatibilityLevel":1,"semanticVersion":"1.0","name":"Test_3","status":"Live","node_id":61366}]}}
		// eslint-disable-next-line
		var pluginSearchRequest = {"request":{"query":"test_3","filters":{"objectType":["Content"],"contentType":["plugin"],"status":["live"],"concepts":{},"category":[]},"sort_by":{"lastUpdatedOn":"desc"},"limit":200}}
		var url = '/plugins/v1/search'

		org.ekstep.services.searchService.postFromService = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: pluginResult
			})
		})
		// eslint-disable-next-line
		org.ekstep.services.searchService.pluginsSearch(url,pluginSearchRequest, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(org.ekstep.services.searchService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.searchService.postFromService.calls.count()).toBe(1)
			done()
		})
	})

	it('should do composite search if url is not provided', function (done) {
		// eslint-disable-next-line
		var pluginResult = {"id":"ekstep.composite-search.search","ver":"3.0","ts":"2019-01-03T10:04:22ZZ","params":{"resmsgid":"6956def5-e552-4237-a15b-a8d1889f33fc","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"count":0}}
		// eslint-disable-next-line
		var pluginSearchRequest = {"request":{"query":"test_3","filters":{"objectType":["Content"],"contentType":["plugin"],"status":["live"],"concepts":{},"category":[]},"sort_by":{"lastUpdatedOn":"desc"},"limit":200}}
		org.ekstep.services.searchService.postFromService = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, {
				data: pluginResult
			})
		})

		spyOn(org.ekstep.services.searchService, 'pluginsSearch').and.callThrough()
		spyOn(org.ekstep.services.searchService, 'search').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.searchService.pluginsSearch(undefined,pluginSearchRequest, function (err, res) {
			expect(err).toBeUndefined()
			expect(res.data).toBeDefined()
			expect(org.ekstep.services.searchService.search).toHaveBeenCalled()
			expect(org.ekstep.services.searchService.search.calls.count()).toBe(1)
			done()
		})
	})
})
