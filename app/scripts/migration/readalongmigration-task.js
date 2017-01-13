'use strict';

EkstepEditor.migration.readalongmigration_task = new(Class.extend({
    init: function() {
        console.log('read along migration task initialized');
    },
    // check 'isReadAlongAutoPlay' attribute in htext and convert to 'autoplay'
    migrate: function(contentbody) {
    		console.log('migrating readalong');
        var deferred = EkstepEditor.$q.defer();
        _.forEach(contentbody.theme.stage, function(stage, index) {
            if (stage.htext && (!_.isArray(stage.htext))) stage.htext = [stage.htext];
            if (stage.htext && stage.htext.length) {
                _.forEach(stage.htext, function(htext) {
                    if(!_.isUndefined(htext.isReadAlongAutoPlay)) {
                        htext.autoplay = htext.isReadAlongAutoPlay;
                        delete htext.isReadAlongAutoPlay;
                    }
                });
            }
            if(contentbody.theme.stage.length === index + 1)  deferred.resolve(contentbody);                    	
        });
        return deferred.promise;
    }
}));
