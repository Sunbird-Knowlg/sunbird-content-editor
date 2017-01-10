'use strict';

EkstepEditor.migration.settagmigration_task = new(Class.extend({
    init: function() {
        console.log('set tag migration-task initialized');
    },
    migrate: function(contentbody) {
        var deferred = EkstepEditor.$q.defer();
        _.forEach(contentbody.theme.stage, function(stage, index) {
            //if stage has set tag, throw fatal error.                       
            if (_.has(stage, 'set')) deferred.reject('error: content has set tag');
            if (contentbody.theme.stage.length === index + 1) deferred.resolve(contentbody);
        });
        return deferred.promise;
    }
}));
