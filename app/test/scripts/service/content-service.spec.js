'use strict';

describe('content-service', function() {
    var contentService,
        data,
        config;

    beforeEach(function() {
        data = {
            "theme": {
                "manifest": {
                    "media": [{
                        "id": "domain_793",
                        "type": "image",
                        "src": "https://dev.ekstep.in/assets/public/content/carpenter_1454918523295.png",
                        "assetId": "domain_793"
                    }]
                },
                "id": "theme",
            },
            "stages": [{
                "id": "Stage",
                "params": [{
                    "name": "instructions",
                    "value": "Hello carpenter"
                }],
                "events": {
                    "event": []
                },
                "objects": [{
                    "type": "image",
                    "left": 145,
                    "top": 126,
                    "width": 260,
                    "height": 258,
                    "scaleX": 0.94,
                    "scaleY": 0.94,
                    "meta": {
                        "asset": "domain_793"
                    },
                    "src": "https://dev.ekstep.in/assets/public/content/carpenter_1454918523295.png",
                }, {
                    "type": "rect",
                    "left": 434,
                    "top": 160,
                    "width": 100,
                    "height": 100,
                    "scaleX": 1,
                    "scaleY": 1,
                    "meta": {
                        "event": {
                            "action": {
                                "type": "command",
                                "command": "togglePlay",
                                "asset": "domain_664"
                            },
                            "type": "click"
                        }
                    }
                }, {
                    "type": "rect",
                    "left": 20,
                    "top": 230,
                    "width": 100,
                    "height": 100,
                    "scaleX": 1,
                    "scaleY": 1,
                    "meta": {
                        "event": {
                            "action": {
                                "type": "command",
                                "command": "togglePlay",
                                "asset": "domain_665"
                            },
                            "type": "click"
                        }
                    }
                }],
                "audios": [{
                    "asset": "domain_664",
                    "name": "dog",
                    "url": "https://dev.ekstep.in/assets/public/content/dog-barking_1454410236812.mp3",
                    "type": "audio",
                    "category": "objectSound",
                    "meta": {
                        "asset": "domain_664"
                    },
                    "events": []
                }, {
                    "asset": "domain_665",
                    "name": "man",
                    "url": "https://dev.ekstep.in/assets/public/content/man-talking_1454410236812.mp3",
                    "type": "voice",
                    "category": "objectSound",
                    "meta": {
                        "asset": "domain_664"
                    },
                    "events": []
                }]
            }]
        };

        config = { contentId: "do_123456" };
        contentService = new EkstepEditor.contentService(config);
    });

    it('should save content', function() {
        contentService.saveContent(data, "6869918723981");
        expect(contentService.content["do_123456"].data).toEqual(JSON.stringify(data));
        expect(contentService.content["do_123456"].versionKey).toBe("6869918723981");
    });

    it('should retreive content', function() {
        contentService.saveContent(data, "6869918723981");
        var content = contentService.getContent();
        expect(content).toEqual(data);
        expect(data === content).toBe(false);
    });

});
