'use strict';

org.ekstep.contenteditor.migration.textmigration_task = new (Class.extend({
    /**
     * Name of migration plugin
     * @member {String} pluginName
     */
    pluginName: 'org.ekstep.text',
    /**
     * Current version of plugin loaded
     * Assigned at the time of migrating text plugin
     * @member {String} currentVersion
     */
    currentVersion: 1.2,
    /**
     * The events are registred which are used to add or remove text migrate events
     */
    init: function () {
        console.log('text migration-task initialized');
        org.ekstep.contenteditor.api.addEventListener(this.pluginName + ':migrateAll', this.migrateAllText, this);
        org.ekstep.contenteditor.api.addEventListener(this.pluginName + ':migrate', this.migrateText, this);
    },
    /**
     * Method to migrate all the old text to new text plugin
     */
    migrateAllText: function () {
        // var textPlugin = org.ekstep.pluginframework.pluginManager.pluginObjs[this.pluginName];
        // this.currentVersion = textPlugin.manifest.ver;
        var instance = this;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function (stage, index) {
            _.forEach(stage.children, function (plugin) {
                if (plugin.manifest.id != instance.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance.currentVersion) {
                    plugin.attributes.version = instance.currentVersion;
                    TextWYSIWYG.setProperties(plugin);
                    TextWYSIWYG.resetFont(plugin);
                }
            })
        });
    },
    /**
    * Method to check if old text plugin available in content or not
    */
    isOldPluginAvailable: function() {
        var instance = this;
        var oldPluginAvailable = false;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function (stage) {
            _.forEach(stage.children, function (plugin) {
                if (plugin.manifest.id != instance.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance.currentVersion) {
                    oldPluginAvailable = true;
                    return;
                }
            })
        })
        return oldPluginAvailable;
    },
    /**
    * Migrate a single text
    */
    migrateText: function(event, plugin) {
        if (plugin.manifest.id != this.pluginName) return;
        if (!plugin.attributes.version || plugin.attributes.version < this.currentVersion) {
            plugin.attributes.version = this.currentVersion;
            TextWYSIWYG.setProperties(plugin);
            TextWYSIWYG.resetFont(plugin);
        }
    }

}));

//# sourceURL=textMigration.js