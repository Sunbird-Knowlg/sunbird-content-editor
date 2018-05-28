'use strict';

org.ekstep.contenteditor.migration.textmigration_task = new(Class.extend({
    pluginName: 'org.ekstep.text',
    currentVersion: 1.2,
    init: function() {
        console.log('text migration-task initialized');
        org.ekstep.contenteditor.api.addEventListener(this.pluginName + ':migrate', this.migrateText, this);
    },
    migrateText: function() {
        var instance = this;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function(stage, index) {
            _.forEach(stage.children, function(plugin){
                if (plugin.manifest.id != instance.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance.currentVersion) {
                    plugin.onConfigChange("fontfamily", "NotoSansRegular");
                    plugin.attributes.version = instance.currentVersion;
                }
            })
        });
    },
    isOldPluginAvailable: function() {
        var instance = this;
        var oldPluginAvailable = false;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function(stage) {
            _.forEach(stage.children, function(plugin) {
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