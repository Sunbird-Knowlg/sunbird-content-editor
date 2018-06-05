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
    currentVersion: undefined,
    /**
     * Contains fonts which doesn't support default baseline config for WYSIWYG.
     */
    middleBaselineFonts: ["NotoSans", "NotoSansKannada", "NotoNastaliqUrdu"],
    /**
     * The events are registred which are used to add or remove text migrate events
     */
    init: function () {
        console.log('text migration-task initialized');
        org.ekstep.contenteditor.api.addEventListener(this.pluginName + ':migrate', this.migrateText, this);
    },
    /**
     * Method to migrate the old text to new text plugin
     */
    migrateText: function () {
        var textPlugin = org.ekstep.pluginframework.pluginManager.pluginObjs[this.pluginName];
        this.currentVersion = textPlugin.manifest.ver;
        var instance = this;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function (stage, index) {
            _.forEach(stage.children, function (plugin) {
                if (plugin.manifest.id != instance.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance.currentVersion) {
                    plugin.attributes.version = instance.currentVersion;
                    if (plugin.attributes.fontFamily == "NotoNastaliqUrdu") {
                        plugin.attributes.offsetY = plugin.attributes.fontSize * 0.02;
                        plugin.config.lineHeight = 1.13 * 2 * plugin.attributes.fontSize; // Defaults to 1 for other fonts and 2 for urdu
                    } else {
                        plugin.attributes.textBaseline = "alphabetic";
                        plugin.attributes.offsetY = plugin.attributes.fontSize * 0.2;
                    }
                    if (plugin.attributes.fontFamily == "NotoSans" || plugin.attributes.fontFamily == "NotoNastaliqUrdu") {
                        plugin.attributes.textBaseline = "middle";
                    }
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
    }
}));

//# sourceURL=textMigration.js