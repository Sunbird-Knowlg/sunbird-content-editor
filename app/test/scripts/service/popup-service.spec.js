'use strict';

describe('service:popup-service', function() {
    var $scope,
        service,
        $uibModal,
        MainCtrl;

    beforeEach(angular.mock.module('editorApp'));

    beforeEach(inject(function(_$uibModal_) {
        $uibModal = _$uibModal_;
        service = EkstepEditor.popupService;        
    }));

    it('should open the popup window', function() {
        var config = {
            template: '<h1>testingTemplate<\/h1>'
        };
        var callback = function() {};
        spyOn(EkstepEditorAPI, "dispatchEvent");
        spyOn(service.$uibModal, 'open').and.callFake(function(config) {
            return {
                rendered: {
                    then: function() {
                    	EkstepEditorAPI.dispatchEvent('popupservice:fire', callback);
                    }
                }
            };
        });
        
        service.open(config, callback);
        expect(EkstepEditorAPI.dispatchEvent).toHaveBeenCalledWith('popupservice:fire', callback);        
    });
});
