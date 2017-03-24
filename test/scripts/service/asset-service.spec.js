describe('Asset service test cases', function() {
    var postResponse = '{"data":{"id":"ekstep.content.save","ver":"2.0","ts":"2017-03-21T13:14:27ZZ","params":{"resmsgid":"f53d9c93-9ee1-473d-968a-b5ef00f53901","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"node_id":"do_1122069161408757761139","versionKey":"1490102067978"}},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"headers":{"content-type":"application/json","user-id":"content-editor","Accept":"application/json, text/plain, */*"},"url":"/action/learning/v2/content","data":{"request":{"content":{"body":"","name":"B","status":"Draft","portalOwner":"392","code":"org.ekstep0.5357591197568159","mimeType":"audio/mp3","mediaType":"voice","contentType":"Asset","osId":"org.ekstep.quiz.app","language":["English"]}}},"requestTimestamp":1490102063922,"responseTimestamp":1490102064458},"statusText":"OK"}';
    var patchResponse = '{"data":{"id":"ekstep.content.save","ver":"2.0","ts":"2017-03-21T13:14:27ZZ","params":{"resmsgid":"f53d9c93-9ee1-473d-968a-b5ef00f53901","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"node_id":"do_1122069161408757761139","versionKey":"1490102067978"}},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"headers":{"content-type":"application/json","user-id":"content-editor","Accept":"application/json, text/plain, */*"},"url":"/action/learning/v2/content","data":{"request":{"content":{"body":"","name":"B","status":"Draft","portalOwner":"392","code":"org.ekstep0.5357591197568159","mimeType":"audio/mp3","mediaType":"voice","contentType":"Asset","osId":"org.ekstep.quiz.app","language":["English"]}}},"requestTimestamp":1490102063922,"responseTimestamp":1490102064458},"statusText":"OK"}';
    var assetId = "do_1122069161408757761139";
    beforeAll(function() {
        spyOn(EkstepEditor.assetService.http, "post").and.callFake(function(url, data, headers, cb) {
            cb(undefined, postResponse);
        });
        spyOn(EkstepEditor.assetService.http, "patch").and.callFake(function(url, data, headers, cb) {
            cb(undefined, patchResponse);
        });
    });
    it("should call saveAsset without assetId and http post ", function() {
        var content = '{"body":"","name":"B","status":"Draft","portalOwner":"392","code":"org.ekstep0.5357591197568159","mimeType":"audio/mp3","mediaType":"voice","contentType":"Asset","osId":"org.ekstep.quiz.app","language":["English"]}';
        spyOn(EkstepEditor.assetService, "saveAsset").and.callThrough();

        EkstepEditor.assetService.saveAsset(undefined, content, function(err, res){
            expect(res).toBe(postResponse);
            expect(EkstepEditor.assetService.http.patch).not.toHaveBeenCalled();
            expect(EkstepEditor.assetService.http.post).toHaveBeenCalled();
        });
    });

    it("should call saveAsset with assetId and http patch ", function() {
        var content = '{"body":"","name":"B","status":"Draft","portalOwner":"392","code":"org.ekstep0.5357591197568159","mimeType":"audio/mp3","mediaType":"voice","contentType":"Asset","osId":"org.ekstep.quiz.app","language":["English"]}';
        spyOn(EkstepEditor.assetService, "saveAsset").and.callThrough();
        EkstepEditor.assetService.saveAsset(assetId, content, function(err, res){
            expect(res).toBe(patchResponse);
            expect(EkstepEditor.assetService.http.patch).toHaveBeenCalled();
        });
    });

    it("should set assetMeta data to empty Object ", function() {
        spyOn(EkstepEditor.assetService, "setAssetMeta").and.callThrough();
        spyOn(EkstepEditor.assetService, "getAssetMeta").and.callThrough();
        EkstepEditor.assetService.setAssetMeta(assetId, {"test": "123"});
        expect(EkstepEditor.assetService.getAssetMeta(assetId)).toBeDefined();
        expect(EkstepEditor.assetService.getAssetMeta(assetId)).toEqual({ 'assetMeta': {"test": "123"}});
        EkstepEditor.assetService.setAssetMeta(undefined, {"test": "123"});
        expect(_.keys(EkstepEditor.assetService.asset).length).toBe(1);
        expect(EkstepEditor.assetService.getAssetMeta(undefined)).toEqual({});

        EkstepEditor.assetService.setAssetMeta(assetId, {"test": "456"});
        expect(EkstepEditor.assetService.getAssetMeta(assetId)).toEqual({ 'assetMeta': {"test": "456"}});
    });
});