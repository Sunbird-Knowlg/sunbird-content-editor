'use strict';

EkstepEditor.migration = new(Class.extend({
    init: function() {
        console.log('migration task initialized');
        EkstepEditor.$q = angular.injector(['ng']).get('$q'); //promise
        EkstepEditorAPI.addEventListener('migrationTask:start', this.execute, this);
    },
    tasks: ['basestage_task', 'orderstage_task', 'scribblemigration_task', 'imagemigration_task', 'readalongmigration_task', 'assessmentmigration_task', 'eventsmigration_task', 'settagmigration_task'],
    migrationErrors: [],
    execute: function(event, contentbody) {
        var instance = this,
            scope = EkstepEditorAPI.getAngularScope(),
            errorcb;

        errorcb = function(err) {
            if(err) instance.migrationErrors.push(err);
            return EkstepEditor.$q.reject(err);
        };

        if (!_.has(contentbody, 'theme.stage')) instance.throwErrorOnScreen();
        if (!this.versionCompatible(contentbody.theme.version || contentbody.theme.ver)) {
            //show migration message on load screen
            scope.appLoadMessage.push({message: 'Migrating Content..', status: false});
            scope.migrationFlag = true;
            EkstepEditor.migration[instance.tasks[0]].migrate(contentbody)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[1]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[2]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[3]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[4]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[5]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[6]].migrate(content)}, errorcb)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[7]].migrate(content)}, errorcb)
                .then(function(content) {                                                                        
                        scope.migration.showPostMigrationMsg = true;                       
                        scope.migration.showMigrationSuccess = true;
                        scope.appLoadMessage[2].status = true;
                        scope.safeApply();
                        console.info('Migration task completed!');
                        instance.setNewVersion(content);
                        console.log('after migration content:', _.cloneDeep(content));                        
                        EkstepEditor.stageManager.fromECML(content);
                    },
                    function(err){
                        if (err) instance.migrationErrors.push(err);
                        if (instance.migrationErrors.length) instance.throwErrorOnScreen();
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
        if (_.has(contentbody,'theme.ver')) delete contentbody.theme.ver;
        contentbody.theme.version = "1.0";
    },
    throwErrorOnScreen: function() {
        var scope = EkstepEditorAPI.getAngularScope();
        scope.migration.showPostMigrationMsg = true;
        scope.migration.showMigrationError = true;
        scope.contentLoadedFlag = true;
        scope.safeApply();
    }
}));
