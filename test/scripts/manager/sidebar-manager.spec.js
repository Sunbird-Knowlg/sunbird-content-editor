'use strict';

describe('sidebar manager', function() {
    beforeAll(function() {
        org.ekstep.contenteditor.sidebarManager.initialize({ loadNgModules: function() {} });
        org.ekstep.pluginframework.pluginManager.loadPlugin('org.ekstep.test_config', '1.0');
        org.ekstep.pluginframework.pluginManager.loadPlugin('org.ekstep.test_config_2', '1.0');
        org.ekstep.contenteditor.sidebarManager.sidebarMenu = [];
    });

    it('should load and register sidebar template and controller', function() {
        spyOn(org.ekstep.contenteditor.sidebarManager, 'loadNgModules');
        spyOn(org.ekstep.contenteditor.sidebarManager, 'loadCustomTemplates');
        org.ekstep.contenteditor.sidebarManager.loadAndRegister({}, { plugin: 'org.ekstep.test_config' });
        expect(org.ekstep.contenteditor.sidebarManager.getSidebarMenu().length).toBe(1);
        expect(org.ekstep.contenteditor.sidebarManager.getSidebarMenu()).toEqual([{ category: 'settings', template: 'base/test/data/published/org.ekstep.test_config-1.0/editor/partials/sidebarSettingTemplate.html' }]);
        expect(org.ekstep.contenteditor.sidebarManager.loadCustomTemplates).toHaveBeenCalled();
        expect(org.ekstep.contenteditor.sidebarManager.loadNgModules.calls.count()).toEqual(2);
    });

    it('should load custom templates for sidebar category', function() {
        var config = {
            type: 'custom_template',
            templateURL: "editor/partials/sidebarSettingTemplate.html",
            controllerURL: "editor/sidebar-settings-controller.js"
        };
        spyOn(org.ekstep.contenteditor.sidebarManager, 'loadNgModules');
        org.ekstep.contenteditor.sidebarManager.loadCustomTemplates(config, { id: 'org.ekstep.test_config', ver: '1.0' });
        expect(config.template).toBeDefined();
        expect(org.ekstep.contenteditor.sidebarManager.loadNgModules.calls.count()).toEqual(1);
    });

    it('should not load custom template for invalid path', function() {
        var config = {
            type: 'custom_template',
            templateURL: "editor/path/sidebarSettingTemplate.html", //inavlid path
            controllerURL: "editor/path/someController.js" //invalid path
        };
        spyOn(org.ekstep.contenteditor.sidebarManager, 'loadNgModules');
        var testFn = function() {
            org.ekstep.contenteditor.sidebarManager.loadCustomTemplates(config, { id: 'org.ekstep.test_config', ver: '1.0' });
        };
        expect(config.template).toBeUndefined();
        expect(testFn).toThrow("unable to load custom template");
    });
});
