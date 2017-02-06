'use strict';

EkstepEditor.migration = new(Class.extend({
    init: function() {
        console.log('migration task initialized');
        EkstepEditor.$q = angular.injector(['ng']).get('$q'); //promise
        EkstepEditorAPI.addEventListener('content:migration:start', this.execute, this);
    },
    tasks: ['mediamigration_task', 'basestage_task', 'orderstage_task', 'scribblemigration_task', 'imagemigration_task', 'readalongmigration_task', 'assessmentmigration_task', 'eventsmigration_task', 'settagmigration_task'],
    migrationErrors: [],
    execute: function(event, contentbody) {
        var instance = this,
            scope = EkstepEditorAPI.getAngularScope();
            
        if (!_.has(contentbody, 'theme.stage')) EkstepEditor.migration.migrationErrors.push('Content has no stage defined!');
        if (!this.versionCompatible(contentbody.theme.version || contentbody.theme.ver)) {
            //show migration message on load screen
            scope.appLoadMessage.push({'id': 2, 'message': 'Migrating Content', 'status': false});
            scope.migrationFlag = true;
            EkstepEditor.migration[instance.tasks[0]].migrate(contentbody)
                .then(function(content) {return EkstepEditor.migration[instance.tasks[1]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[2]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[3]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[4]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[5]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[6]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[7]].migrate(content)})
                .then(function(content) {return EkstepEditor.migration[instance.tasks[8]].migrate(content)})
                .then(function(content) {                                                                        
                        scope.migration.showPostMigrationMsg = true;                       
                        scope.migration.showMigrationSuccess = true;
                        var obj = _.find(EkstepEditorAPI.getAngularScope().appLoadMessage, { 'id': 2});
                        if (_.isObject(obj)) {
                            obj.message = "Content migrated";
                            obj.status = true;
                        }
                        EkstepEditorAPI.ngSafeApply(scope);
                        console.info('Migration task completed!');
                        instance.setNewVersion(content);
                        console.log('after migration content:', _.cloneDeep(content));
                        if(instance.migrationErrors.length) {
                            console.info('Migration has errors: ', instance.migrationErrors); 
                            EkstepEditorAPI.dispatchEvent('content:migration:end', {'logs': {'error': instance.migrationErrors}, 'status': 'FAIL'});                      
                        } else {
                            EkstepEditorAPI.dispatchEvent('content:migration:end', {'logs': {'error': undefined}, 'status': 'PASS'});                      
                        }

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
        if (_.has(contentbody,'theme.ver')) delete contentbody.theme.ver;
        contentbody.theme.version = "1.0";
    }
}));
