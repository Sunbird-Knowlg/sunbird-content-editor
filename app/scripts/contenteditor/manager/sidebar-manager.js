org.ekstep.contenteditor.sidebarManager = new(Class.extend({
    configInstance: undefined,
    loadNgModules: undefined,
    angularScope: undefined,
    configControllerRegistered: false,
    init: function() {
        org.ekstep.pluginframework.eventManager.addEventListener("plugin:load", this.register, this);
    },
    initialize: function(config) {
        this.loadNgModules = config.loadNgModules;
        this.angularScope = config.scope;
    },
    register: function(event, data) {
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(data.plugin);
        var instance = this;
        if (manifest && manifest.editor && manifest.editor.config) {
            _.forEach(manifest.editor.config, function(config) {
                if (config.type === "custom") instance.load(config, manifest);
            });
        }
    },
    load: function(modules, manifest) {
        var instance = this;
        if (!modules.template) throw "Template object is undefined for the config! :plugin: " + manifest.id;

        if (modules.template && !_.isArray(modules.template)) modules.template = [modules.template];
        if (modules.controller && !_.isArray(modules.controller)) modules.controller = [modules.controller];
        _.forEach(modules.template, function(template) {
            template.path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, template.path);
            instance.loadNgModules(template.path);
            if (template.tab == 'customise') instance.angularScope.customiseTabTemplate.push({ id: template.id });
            if (template.tab == 'events') instance.angularScope.actionsTabTemplate.push({ id: template.id });
            if (template.tab == 'properties') instance.angularScope.propertiesTabTemplate.push({ id: template.id });
            instance.angularScope.$safeApply();
        });

        if (modules.controller) {
            _.forEach(modules.controller, function(controller) {
                controller.path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, controller.path);
                instance.loadNgModules(undefined, controller.path);
            });
        }
    }
}));
