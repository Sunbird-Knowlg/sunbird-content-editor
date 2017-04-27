describe('Content service test cases', function() {
    var contentBody = '{"theme":{"id":"theme","version":"1.0","startStage":"25a34c61-c657-447b-bb35-71e51861c964","stage":[{"x":0,"y":0,"w":100,"h":100,"id":"25a34c61-c657-447b-bb35-71e51861c964","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"genieControls\":true,\"instructions\":\"\"}"},"audio":[{"asset":"do_1121989226483793921313","x":0,"y":0,"w":0,"h":0,"rotate":null,"id":"6ed844cb-b944-4b73-8c05-19800e7287ee","z-index":1,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true}"}}],"shape":[{"type":"ellipse","x":15,"y":15,"fill":"#00FF00","w":18,"h":32,"stroke":"rgba(255, 255, 255, 0)","strokeWidth":1,"opacity":1,"rotate":0,"r":64.8,"z-index":0,"id":"86310859-8b81-4bc7-9127-b6d02a3419aa","config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#00FF00\",\"radius\":64.8}"}}]}],"manifest":{"media":[{"name":"hello","id":"do_1121989226483793921313","src":"https://dev.ekstep.in/assets/public/content/do_1121989226483793921313/artifact/audio_1489126292296_1489126299966.mp3","type":"audio"}]}}}';
    var contentId = "do_112188493884006400173";
    var metaData = 'stageIcons: "{"25a34c61-c657-447b-bb35-71e51861c964":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAGVAtADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC7RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRSEgdTQAtFMMijvSeavvSuhcyJKKZ5q+tKGU9CKLoLodRRRTGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTWcL160ySTsv51DUSnbYzlO2w9pWPTimdaKKzbbMm29wooopCCiiigByuy9DUqyg8Hg1BRVKTRSk0W6KrpIV68ipwQRkVopXNoyTFoooqigooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKilf+EfjTpG2r71XqJy6Gc5W0QUUUVkYhRRRQAUUUUAFFFFABRRRQAU9H2n2plFNOwJ2LQORkUtQwt/Cfwqatk7o6Yu6uFFFFMYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRTWOFJoAhlbc3sKZRRWDdzmbu7hRRRSEFFFFABRRRQAUUUUAFFFFABRRRQAoODmrKncoNVamhPBFXB6mlN62JaKKK1NgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACo5j8lSVFP90fWlLYmWxDRRRWBzhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABUkJ+eo6fF/rBTjuOO5Yooorc6QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACo5vuj61JTJRlDSlsTLYr0UUVgc4UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU+L74plSwjkmqjuVHcmooorY6AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkPIpaKAKrDBIpKlmX+IVFWDVmc0lZhRRRSEFFFFABRRRQAUUUUAFFFFABRRRQAVYiGE+tQou5sVZrSC6mtNdQooorQ1CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEIyMGq7qVOKs01lDDBqZRuRKNytRSspU4NJWJgFFFFABRRRQAUUUUAFFFFABRRU8ce3k9aaVyoxuLGm1fen0UVulY3SsFFFFAwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooARlDDBqB4yvTkVYoqXFMmUUypRVlkVu1RmE9jUODMnBoiop5jYdqTY3oamzJsxtFO8tvSnCJj14osw5WR05VLdBUqxKOvNP6Vah3LVPuNSML7mn0UVaVjVKwUUUUxhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//Z"}"';
    var content = '{"do_112188493884006400173":{"template":"","owner":"Harish Kumar Gangula","identifier":"do_112188493884006400173","code":"org.ekstep.literacy.story.3225","visibility":"Default","portalOwner":"392","description":"Test","language":["English"],"mediaType":"content","mimeType":"application/vnd.ekstep.ecml-archive","osId":"org.ekstep.quiz.app","languageCode":"en","createdOn":"2017-02-23T12:34:17.325+0000","versionKey":"1490164805870","gradeLevel":["Grade 1"],"appIcon":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1121919482793820161196/artifact/9e2455c99e60231ac5fe6b4c96148c21_1488274936761.jpeg","concepts":[{"identifier":"LO17","name":"Memory For Sound Strings","objectType":"Concept","relation":"associatedTo","description":"Memory For Sound Strings","index":null}],"domain":["literacy"],"name":"Test","lastUpdatedOn":"2017-03-22T06:39:45.222+0000","contentType":"Story","status":"Draft"}}';
    var contentRes = {"data": { "result":content}};
    var downloadContentRes = '{"id":"ekstep.content.archive","ver":"2.0","ts":"2017-03-22T07:35:09ZZ","params":{"resmsgid":"75e4c7df-a7bf-4867-96b2-09d1b823c166","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"ECAR_URL":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112188493884006400173/bundle1490168109620/test.ecar"}}';
    beforeAll(function(){
        org.ekstep.services.config = {
            baseURL: org.ekstep.contenteditor.config.baseURL,
            apislug: org.ekstep.contenteditor.config.apislug
        };
        org.ekstep.services.contentService.content = JSON.parse(content);
        org.ekstep.services.contentService.patch = jasmine.createSpy().and.callFake(function(url, requestObj, headers, cb) {
            cb(undefined, contentRes);
        });
        spyOn(org.ekstep.services.contentService, "saveContent").and.callThrough();
        spyOn(org.ekstep.services.contentService, "getContentMeta").and.callThrough();
        spyOn(org.ekstep.services.contentService, "getContent").and.callThrough();
    })
    
    it("should return content meta on getContent Meta call", function() {
        
        var meta = org.ekstep.services.contentService.getContentMeta(contentId);
        var contentParsed = JSON.parse(content)[contentId];
        expect(meta).toEqual(contentParsed);
    });

    it("should call save content method", function() {
        spyOn(org.ekstep.services.contentService,"_saveContent").and.callThrough();
        org.ekstep.services.contentService.saveContent(contentId, metaData, contentBody, function(err, res){
            expect(res).toBe(contentRes);
            expect(org.ekstep.services.contentService._saveContent).toHaveBeenCalled();
            expect(org.ekstep.services.contentService._saveContent.calls.count()).toBe(1);
        });
    });

    it("should call download content method", function() {
        org.ekstep.services.contentService.post = jasmine.createSpy().and.callFake(function(url, data, headers, cb) {
            cb(undefined, downloadContentRes);
        });
        spyOn(org.ekstep.services.contentService, "downloadContent").and.callThrough();
        spyOn(org.ekstep.services.contentService, "postFromService").and.callThrough()
        org.ekstep.services.contentService.downloadContent(contentId, "test", function(err, res){
            expect(res).toBe(downloadContentRes);
            expect(org.ekstep.services.contentService.postFromService).toHaveBeenCalled();
            expect(org.ekstep.services.contentService.postFromService.calls.count()).toBe(1);
        });
    });

    it("should call save content method return error for version key", function() {
        org.ekstep.services.contentService.content  = {};
        org.ekstep.services.contentService.saveContent(contentId, metaData, contentBody, function(err, res){            
            expect(err).toBe("Cannot find content id or version key to update content");
        });
    });

    it("should return error on getContent method call without contentId", function() {
        org.ekstep.services.contentService.getContent(undefined, function(err, res){
            expect(err).toBe("Content id is required to get content from platform");
        })
    });

    it("should return error on getContent method call", function() {
        org.ekstep.services.contentService.get = jasmine.createSpy().and.callFake(function(url, object, cb) {
            cb("Error: no content found!", undefined);
        });
        org.ekstep.services.contentService.getContent(contentId, function(err, res){
            expect(err).toBeDefined();
        });
    });

    it("should set content meta once the API call is successful", function() {
        org.ekstep.services.contentService.get = jasmine.createSpy().and.callFake(function(url, object, cb) {
            cb(undefined, {data: contentResponse});
        });
        org.ekstep.services.contentService.getContent('do_112206722833612800186', function(err, res){
            expect(res).toBeDefined();
            expect(res.identifier).toEqual('do_112206722833612800186');
        });

        org.ekstep.services.contentService._setContentMeta('do_112206722833612800186', JSON.parse(content)['do_112188493884006400173']);
        
        var contentMeta = org.ekstep.services.contentService.getContentMeta('do_112206722833612800186');
        expect(contentMeta.identifier).toEqual('do_112188493884006400173');
        expect(contentMeta.languageCode).toEqual('en');
        expect(contentMeta.concepts).toBeDefined();

        expect(org.ekstep.services.contentService.getContentMeta('xyz')).toEqual({});

        org.ekstep.services.contentService.saveContent('do_112206722833612800186', undefined, undefined, function(err, res) {
            expect(err).toEqual('Nothing to save');
        });
    });
});