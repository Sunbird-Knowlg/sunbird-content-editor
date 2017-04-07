org.ekstep.contenteditor.sidebarManager = new(Class.extend({
    configInstance: undefined,
    loadNgModules: undefined,
    angularScope: undefined,
    configControllerRegistered: false,
    customTemplates: [],
    init: function() {
        org.ekstep.pluginframework.eventManager.addEventListener("plugin:load", this.registerCustomTemplate, this);
    },
    initialize: function(config) {
        this.loadNgModules = config.loadNgModules;
        this.angularScope = config.scope;
    },
    registerCustomTemplate: function(event, data) {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(data.plugin);
        var instance = this;
        if (manifest.editor && manifest.editor.config) {
            _.forEach(manifest.editor.config, function(config) {
                if (config.type === "custom") instance.loadSidebar(config, manifest);
            });
        } else if(manifest.editor && manifest.editor.configManifest) {
            _.forEach(manifest.editor.configManifest, function(config) {
               if (config.type == "custom_template") instance.customTemplates.push(config); 
               if (config.controllerURL) {
                    config.controllerURL = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.controllerURL);
                    instance.loadNgModules(undefined, config.controllerURL);
               }

               if(config.templateURL) {
                    var templatePath = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.templateURL);
                    org.ekstep.pluginframework.resourceManager.loadResource(templatePath, 'HTML', function(err, data) {
                        if(err) throw "Invalid path for config template!";
                        if(data) config.template = data;
                    });
               }
            });
        }
    },
    loadSidebar: function(config, manifest) {
        var instance = this;
        if (config.template && !_.isArray(config.template)) config.template = [config.template];
        if (config.controller && !_.isArray(config.controller)) config.controller = [config.controller];
        _.forEach(config.template, function(template) {
            template.path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, template.path);
            instance.loadNgModules(template.path);
            if (template.tab == 'customise') instance.angularScope.customiseTabTemplate.push({ id: template.id });
            if (template.tab == 'events') instance.angularScope.actionsTabTemplate.push({ id: template.id });
            if (template.tab == 'properties') instance.angularScope.propertiesTabTemplate.push({ id: template.id });
            instance.angularScope.$safeApply();
        });

        if (config.controller) {
            _.forEach(config.controller, function(controller) {
                controller.path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, controller.path);
                instance.loadNgModules(undefined, controller.path);
            });
        }
    },
    getCustomTemplates: function() {
        return this.customTemplates;
    }
}));
