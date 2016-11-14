'use strict';

describe('EkstepEditor ', function() {
   beforeEach(function(){
       jasmine.getJSONFixtures().fixturesPath='test/config';
       EkstepEditor.config = {
           defaultSettings: 'base/app/test/config/editorSettings.json',
           pluginRepo: 'base/app/test/plugins',
       };
   });

    describe("init method", function(){
       it("should load the testplugin", function(){
           console.log("location is... ->" + window.location);
           spyOn(EkstepEditor.pluginManager, 'loadPlugin');
            EkstepEditor.init();

           expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();

       }) ;
    });
});