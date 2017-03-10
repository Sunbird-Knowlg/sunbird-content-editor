'use strict';

EkstepEditor.migration.settagmigration_task = new(Class.extend({
    init: function() {
        console.log('set tag migration-task initialized');
    },
    migrate: function(contentbody) {
        _.forEach(contentbody.theme.stage, function(stage, index) {
            //if stage has set tag, throw fatal error.                       
            if (_.has(stage, 'set')) EkstepEditor.migration.migrationErrors.push('Content has set tag on stage: '+ stage.id);
        });
    }
}));
