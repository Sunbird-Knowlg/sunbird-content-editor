describe('Search service test cases', function() {
    var activities = '{ "id": "ekstep.composite-search.search", "ver": "2.0", "ts": "2017-03-21T10:44:30ZZ", "params": { "resmsgid": "c385eb72-3439-4d36-9f16-b4c5bb057d6c", "msgid": null, "err": null, "status": "successful", "errmsg": null }, "responseCode": "OK", "result": { "count": 18, "content": [ { "code": "org.ekstep.funtoot.spnib", "description": "org.ekstep.funtoot.spnib", "language": [ "English" ], "mimeType": "application/vnd.ekstep.plugin-archive", "idealScreenSize": "normal", "createdOn": "2017-03-17T07:05:33.638+0000", "objectType": "Content", "gradeLevel": [ "Grade 1" ], "lastUpdatedOn": "2017-03-17T08:15:19.936+0000", "contentType": "Plugin", "owner": "funtoot", "lastUpdatedBy": "452", "identifier": "org.ekstep.funtoot.spnib", "os": [ "All" ], "visibility": "Default", "portalOwner": "449", "mediaType": "content", "osId": "org.ekstep.quiz.app", "ageGroup": [ "5-6" ], "graph_id": "domain", "nodeType": "DATA_NODE", "versionKey": "1489739224203", "idealScreenDensity": "hdpi", "compatibilityLevel": 1, "domain": [ "numeracy" ], "name": "org.ekstep.funtoot.spnib", "testCSVImportField": 1, "status": "Live", "node_id": 98692, "concepts": [ "C6" ], "semanticVersion": "1.0", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/org.ekstep.funtoot.spnib/artifact/org.ekstep.funtoot.spnib-1.0_449_1489738438_1489738512663.zip", "lastPublishedBy": "452", "size": 342813, "lastPublishedOn": "2017-03-17T08:27:03.603+0000", "downloadUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/org.ekstep.funtoot.spnib/org.ekstep.funtoot.spnib_1489739223603_org.ekstep.funtoot.spnib_2.0.ecar", "variants": "{\"spine\":{\"ecarUrl\":\"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/org.ekstep.funtoot.spnib/org.ekstep.funtoot.spnib_1489739223785_org.ekstep.funtoot.spnib_2.0_spine.ecar\",\"size\":259410.0}}", "pkgVersion": 2, "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/org.ekstep.funtoot.spnib/artifact/0669012aa9b13e1825692d28b476c766_1488545887467.thumb.jpeg", "posterImage": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112194167909982208121/artifact/0669012aa9b13e1825692d28b476c766_1488545887467.jpeg", "es_metadata_id": "org.ekstep.funtoot.spnib" } ] } }';
    beforeAll(function() {
        org.ekstep.services.config = {
            baseURL: org.ekstep.contenteditor.config.baseURL,
            apislug: org.ekstep.contenteditor.config.apislug
        };
        org.ekstep.services.searchService.post = jasmine.createSpy().and.callFake(function(url, data, headers, cb) {
            cb(undefined, activities);
        })
    });

    it("should return activities on search method call", function() {
        var request = '{ "request": { "query": "", "filters":{ "contentType": ["Plugin"], "status": ["Live"], "category": [] }, "sort_by": { "lastUpdatedOn": "desc" }, "limit": 1 } }';
        spyOn(org.ekstep.services.searchService, "search").and.callThrough();
        spyOn(org.ekstep.services.searchService, "postFromService").and.callThrough();
        org.ekstep.services.searchService.search(request, function(err, res) {
            expect(res).toBe(activities);
            expect(org.ekstep.services.searchService.postFromService).toHaveBeenCalled();
            expect(org.ekstep.services.searchService.postFromService.calls.count()).toBe(1);
        })
    });

    it("should return error on search method call", function() {
        org.ekstep.services.searchService.post = jasmine.createSpy().and.callFake(function(url, data, headers, cb) {
            cb("no data found", undefined);
        })
        var request = '{ "request": { "query": "", "filters":{ "contentType": ["Plugin"], "status": ["Live"], "category": [] }, "sort_by": { "lastUpdatedOn": "desc" }, "limit": 1 } }';
        spyOn(org.ekstep.services.searchService, "search").and.callThrough();
        spyOn(org.ekstep.services.searchService, "postFromService").and.callThrough();
        org.ekstep.services.searchService.search(request, function(err, res) {
            expect(err).toBe("no data found");
            expect(org.ekstep.services.searchService.postFromService).toHaveBeenCalled();
            expect(org.ekstep.services.searchService.postFromService.calls.count()).toBe(1);
        })
    });
});
