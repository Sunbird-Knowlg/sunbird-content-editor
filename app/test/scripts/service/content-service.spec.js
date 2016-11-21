'use strict';

describe('service:Content-service', function() {
    var service,
        saveCallback,
        contentId,
        ecmlbody,
        key,
        contentMeta;

    beforeEach(function() {
        contentId = 'do_798798';
        ecmlbody = { theme: { stages: [] } };
        key = '5768768726876';
        contentMeta = { versionKey: key };
        service = EkstepEditor.contentService;
        service.setContentMeta(contentId, contentMeta);
    });

    it('should save content', function() {
        spyOn(service.http, 'patch');
        service.saveContent(contentId, ecmlbody, function(){});        
        expect(service.http.patch).toHaveBeenCalledTimes(1);
    });

    it('should get content from remote', function(){           
        spyOn(service.http,'get');
        spyOn(service,'setContentMeta');
        service.getContent(contentId, function(){});
        //get call for content and get call for contentMeta
        expect(service.http.get).toHaveBeenCalledTimes(2);
        expect(service.getContentMeta(contentId).contentMeta.versionKey).toBe(key);       
    });

    it('should set content Meta', function(){
        spyOn(service, 'setContentMeta');
        service.setContentMeta(contentId, contentMeta);
        var meta = service.getContentMeta(contentId).contentMeta;
        expect(meta).toEqual(contentMeta);
    });
});
