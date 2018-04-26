describe('popup service', function() {
    beforeAll(function() {
        org.ekstep.services.popupService.openModal = function() {}
        org.ekstep.services.popupService.loadModules = function() {}
        org.ekstep.services.config = {
            baseURL: org.ekstep.contenteditor.config.baseURL,
            apislug: org.ekstep.contenteditor.config.apislug
        };
    });

    it('should open the modal and dispacth telemetry', function() {
        spyOn(org.ekstep.services.popupService, 'openModal');
        spyOn(org.ekstep.contenteditor.api, 'getCurrentStage').and.returnValue({ id: 1234 });
        spyOn(org.ekstep.services.telemetryService, 'interact');
        org.ekstep.services.popupService.open({}, function() {})

        expect(org.ekstep.services.popupService.openModal).toHaveBeenCalledWith({}, jasmine.any(Function));
        expect(org.ekstep.services.telemetryService.interact).toHaveBeenCalledWith({ "type": "show", "subtype": "open", "target": "popup", "pluginid": "", "pluginver": '', "objectid": "", "stage": 1234 })
    });

    it('should load angular module and template', function() {
        spyOn(org.ekstep.services.popupService, 'loadModules');

        org.ekstep.services.popupService.loadNgModules("path_to_template", "path_to_controller");

        expect(org.ekstep.services.popupService.loadModules).toHaveBeenCalledWith("path_to_template"+"?"+ecEditor.getContext('build_number'), "path_to_controller"+"?"+ecEditor.getContext('build_number'));
    });
});
