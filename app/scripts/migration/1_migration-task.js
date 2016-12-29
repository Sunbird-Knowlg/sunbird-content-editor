'use strict';

EkstepEditor.migration = new(Class.extend({
    init: function() {
        console.log('migration task initialized');
        EkstepEditor.$q = angular.injector(['ng']).get('$q'); //promise
        EkstepEditorAPI.addEventListener('migrationTask:start', this.execute, this);
    },
    tasks: ['basestage_task', 'orderstage_task', 'scribblemigration_task', 'imagemigration_task','readalongmigration_task', 'assessmentmigration_task'],
    execute: function(event, contentbody) {
        var instance = this;
        if (!this.versionCompatible(contentbody.theme.version || contentbody.theme.ver)) {
            EkstepEditor.migration[instance.tasks[0]].migrate(contentbody)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[1]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[2]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[3]].migrate(content)})                
                .then(function(content) {return EkstepEditor.migration[instance.tasks[4]].migrate(content)})                
                .then(function(content) {return EkstepEditor.migration[instance.tasks[5]].migrate(content)})                
                .then(function(content) {
                    console.info('Migration task completed!');
                    instance.setNewVersion(content);
                    console.log('after migration content:', _.cloneDeep(content));
                    EkstepEditor.stageManager.fromECML(content);
                });
        } else {
        	console.info('no need for migration');
        	EkstepEditor.stageManager.fromECML(contentbody);
        }
    },
    versionCompatible: function(version) {
        if (version !== "1.0") return false;
        return true;
    },
    setNewVersion: function(contentbody) {
        if (!_.isUndefined(contentbody.theme.ver)) delete contentbody.theme.ver;
        contentbody.theme.version = "1.0";
    }
}));
