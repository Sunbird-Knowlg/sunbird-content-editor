describe('editorApp', function () {
    var $scope;

    beforeEach(function(){
        jasmine.getJSONFixtures().fixturesPath='test';

        EkstepEditor.config = {
            defaultSettings: 'base/app/test/config/editorSettings.json',
            pluginRepo: 'http://localhost:9876/base/plugins',
            //corePlugins: ["testplugin"]
        }
    });
    // Include Modules
    beforeEach(module('editorApp'));

    beforeEach(inject(function(_$controller_){
        $scope = {};
        _$controller_('MainCtrl', { $scope : $scope});
    }));

    // Suite for testing an individual piece of our feature.
    describe('load the controller', function () {

        it("should call the fire event", function(){
            spyOn($scope,"fireEvent").and.callThrough();
            var eventMock = {
                id:"testplugin:create",
                data:{
                  "left": 100,
                  "top": 100,
                  "fill": "rgb(255,0,0)",
                  "width": 100,
                  "height": 100,
                  "opacity": 0.4 
              }
          }
          $scope.fireEvent(eventMock);
          expect($scope.fireEvent).toHaveBeenCalled();
      })

    });
});