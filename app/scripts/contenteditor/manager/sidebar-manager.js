org.ekstep.contenteditor.sidebarManager = new(Class.extend({
    loadNgModules: undefined,
    angularScope: undefined,
    sidebarMenu: [],
    init: function() {
        org.ekstep.pluginframework.eventManager.addEventListener("plugin:load", this.loadAndRegister, this);
    },
    initialize: function(config) {
        this.loadNgModules = config.loadNgModules;
        this.angularScope = config.scope;
    },
    loadAndRegister: function(event, data) {
        var instance = this;
        var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(data.plugin);
        if (manifest.editor && manifest.editor.sidebar) {
            _.forEach(manifest.editor.sidebar, function(config) {
                if(config.templateURL) {
                    var path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.templateURL);
                    instance.loadNgModules(path);
                    instance.sidebarMenu.push({ category: config.id, template: path });
                };

                if(config.controllerURL) instance.loadNgModules(undefined, org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.controllerURL));
            });
        }

        if (manifest.editor && manifest.editor.configManifest) {
            _.forEach(manifest.editor.configManifest, function(config) {
                if (config.type == "custom_template") instance.loadCustomTemplates(config, manifest);
            });
        }
    },
    loadCustomTemplates: function(config, manifest) {
        var instance = this;
        if(config.controllerURL) {
            var path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.controllerURL);
            instance.loadNgModules(undefined, path);
        }

        if(config.templateURL) {
            var path = org.ekstep.contenteditor.api.resolvePluginResource(manifest.id, manifest.ver, config.templateURL);
            org.ekstep.pluginframework.resourceManager.loadResource(path, 'HTML', function(err, data) {
               if (data) config.template = data; 
            });
        }
    },
    getSidebarMenu: function() {
        return this.sidebarMenu;
    }
}));
