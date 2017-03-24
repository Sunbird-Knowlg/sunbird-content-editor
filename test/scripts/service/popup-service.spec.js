describe('popup service', function() {
    beforeAll(function() {
        EkstepEditor.popupService.openModal = function() {}
        EkstepEditor.popupService.loadModules = function() {}
    });

    it('should open the modal and dispacth telemetry', function() {
        spyOn(EkstepEditor.popupService, 'openModal');
        spyOn(EkstepEditorAPI, 'getCurrentStage').and.returnValue({ id: 1234 });
        spyOn(EkstepEditor.telemetryService, 'interact');
        EkstepEditor.popupService.open({}, function() {})

        expect(EkstepEditor.popupService.openModal).toHaveBeenCalledWith({}, jasmine.any(Function));
        expect(EkstepEditor.telemetryService.interact).toHaveBeenCalledWith({ "type": "click", "subtype": "open", "target": "popup", "pluginid": "", "pluginver": '', "objectid": "", "stage": 1234 })
    });

    it('should load angular module and template', function() {
        spyOn(EkstepEditor.popupService, 'loadModules');

        EkstepEditor.popupService.loadNgModules("path_to_template", "path_to_controller");

        expect(EkstepEditor.popupService.loadModules).toHaveBeenCalledWith("path_to_template", "path_to_controller");
    });
});
