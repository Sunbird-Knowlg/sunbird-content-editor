'use strict';

org.ekstep.contenteditor.migration.mediamigration_task = new(Class.extend({
    init: function() {
        console.log('media migration task initialized');
    },
    migrate: function(contentbody) {
        _.forEach(contentbody.theme.manifest.media, function(media){
           org.ekstep.contenteditor.mediaManager.addToMigratedMedia(media); 
        });
    }
}));
