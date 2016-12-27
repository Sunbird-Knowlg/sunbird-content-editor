'use strict';

EkstepEditor.migrationTask = new(Class.extend({
    init: function() {
        console.log('migration task initialized');
        EkstepEditor.$q = angular.injector(['ng']).get('$q'); //promise
        EkstepEditorAPI.addEventListener('migrationTask:start', this.execute, this);
    },    
    tasks: ['orderstage_task', 'basestage_task', 'scribblemigration_task', 'imagemigration_task'],
    execute: function(event, contentbody) {
        console.log('contentbody', contentbody);
        var instance = this;
        if (!this.versionCompatible(contentbody.theme.version || contentbody.theme.ver)) {
            this.setNewVersion(contentbody);            
            EkstepEditor[instance.tasks[0]].migrate(contentbody)
            .then(function(content){return EkstepEditor[instance.tasks[1]].migrate(content)})
            .then(function(content){return EkstepEditor[instance.tasks[2]].migrate(content)})
            .then(function(content){return EkstepEditor[instance.tasks[3]].migrate(content)})
            .then(function(content){EkstepEditor.stageManager.fromECML(content)});            
        }
    },
    versionCompatible: function(version) {
        if (version < 1) return false;
        return true;
    },
    setNewVersion: function(contentbody) {
        (_.isUndefined(contentbody.theme.ver)) ? (contentbody.theme.version = 1): delete contentbody.theme.ver;
    }
}));
