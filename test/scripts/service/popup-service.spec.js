describe('popup service', function () {
	beforeAll(function () {
		org.ekstep.services.popupService.openModal = function () {}
		org.ekstep.services.popupService.loadModules = function () {}
		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}
	})

	it('should open the modal and dispacth telemetry', function () {
		spyOn(org.ekstep.services.popupService, 'openModal')
		spyOn(org.ekstep.contenteditor.api, 'getCurrentStage').and.returnValue({ id: 1234 })
		spyOn(org.ekstep.services.telemetryService, 'interact')
		org.ekstep.services.popupService.open({}, function () {})

		expect(org.ekstep.services.popupService.openModal).toHaveBeenCalledWith({}, jasmine.any(Function))
		expect(org.ekstep.services.telemetryService.interact).toHaveBeenCalledWith({ 'type': 'show', 'subtype': 'open', 'target': 'popup', 'pluginid': '', 'pluginver': '', 'objectid': '', 'stage': 1234 })
	})

	it('should load angular module and template', function () {
		spyOn(org.ekstep.services.popupService, 'loadModules')
		var templatePath = 'https://dev.ekstep.in/content-plugins/org.ekstep.ceheader-1.0/editor/headerApp.js?982'
		var controllerPath = 'https://dev.ekstep.in/content-plugins/org.ekstep.whatsnew-1.0/editor/whatsnew.controller.js?'
		var allowTemplateCache = false
		org.ekstep.services.popupService.loadNgModules(templatePath, controllerPath, allowTemplateCache)
		expect(org.ekstep.services.popupService.loadModules).toHaveBeenCalledWith(templatePath, controllerPath, allowTemplateCache)
	})

	it('should return expected result', function () {
		let expectedResult = org.ekstep.services.popupService.close('test');
		expect(expectedResult).toEqual('test_4_test');
	})

	it('should return "test_4" result', function () {
		let expectedResult = org.ekstep.services.popupService.close();
		expect(expectedResult).toEqual('test_4');
	})
})
