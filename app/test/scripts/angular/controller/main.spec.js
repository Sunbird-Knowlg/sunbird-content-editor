describe('editorApp', function () {
    var $scope;

    beforeEach(function(){
        jasmine.getJSONFixtures().fixturesPath='test';

        EkstepEditor.config = {
            defaultSettings: 'base/app/test/config/editorSettings.json',
            pluginRepo: '/base/app/test/plugins',
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
        it("should load the app", function(){
            console.log("MainCtrl spec");
        })

    });
});