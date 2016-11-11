'use strict';

describe('EkstepEditor ', function() {
   beforeEach(function(){
       EkstepEditor.config = {
           defaultSettings: '../../config/editorSettings.json',
           pluginRepo: '../../plugins',
       }
   });

    describe("init method", function(){
       it("should load the testplugin", function(){
            EkstepEditor.init();
       }) ;
    });
});