/*globals define, describe */
'use strict';

describe('Base plugin', function() {
    var basePlugin;
    var manifest;
    manifest ={
        "id": "org.ekstep.hotspot",
        "ver": "1.0",
        "author": "Santhosh Vasabhaktula",
        "title": "Hotspot Plugin",
        "description": "",
        "publishedDate": "",
        "editor": {
            "main": "editor/plugin.js",
            "dependencies": [
                { "type": "plugin", "plugin": "org.ekstep.colorpicker", "ver": "1.0" }
            ],
            "menu": [{
                "id": "hotspot",
                "category": "main",
                "type": "image",
                "toolTip": "Add Hotspot",
                "title": "Hotspot",
                "iconImage": "assets/hotspot.png",
                "onclick": {
                    "id": "hotspot:create",
                    "data": {
                        "left": 100,
                        "top": 100,
                        "fill": "rgb(255,0,0)",
                        "width": 100,
                        "height": 100,
                        "opacity": 0.4
                    }
                }
            }],
            "config": [{
                "id": "colorpicker",
                "category": "context",
                "type": "icon",
                "toolTip": "Change Color",
                "title": "Color",
                "iconClass": "jscolor",
                "iconStyle": "display: block; width:16px; height:16px; margin: auto; margin-top: 0px; margin-bottom: 6px",
                "state": "HIDE",
                "onclick": {
                    "id": "colorpicker:show",
                    "data": {}
                }
            }]
        },
        "initdata": {
            "props": {
                "left": 200,
                "top": 200
            }
        }
    };
    beforeEach(function(){
       console.log(this.Class);
        console.log("this is: " + this);

    });
    beforeEach(function() {
       basePlugin = new EkstepEditor.basePlugin(manifest, manifest.editor.menu[0].onclick.data, {});

    });

    describe('init method with only manifest argument', function() {

        it('should have been called with manifest', function(){
            spyOn(EkstepEditor.basePlugin.prototype, 'initialize');
            spyOn(EkstepEditor.basePlugin.prototype, 'init');
            spyOn(EkstepEditor.basePlugin.prototype, 'registerMenu');
            basePlugin = new EkstepEditor.basePlugin(manifest);
            //expect(EkstepEditor.basePlugin.prototype.initialize).toHaveBeenCalled();
            expect(EkstepEditor.basePlugin.prototype.init).toHaveBeenCalled();
            //expect(EkstepEditor.basePlugin.prototype.registerMenu).toHaveBeenCalled();
            //expect(basePlugin.initialize).toHaveBeenCalledWith(manifest);
        });
        xit('should equal to manifest', function(){
               // expect(basePlugin.manifest).toEqual(manifest);
        });
        xit('should call registerMenu and initialize method', function() {


        });

    });
});
