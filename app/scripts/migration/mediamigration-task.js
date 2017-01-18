'use strict';

EkstepEditor.migration.mediamigration_task = new(Class.extend({
    init: function() {
        console.log('media migration task initialized');
    },
    migrate: function(contentbody) {
        var deferred = EkstepEditor.$q.defer();
        _.forEach(contentbody.theme.manifest.media, function(media){
           EkstepEditor.mediaManager.addToMigratedMedia(media); 
        });
        deferred.resolve(contentbody);
        return deferred.promise;
    }
}));
