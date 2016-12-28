'use strict';

EkstepEditor.migration.orderstage_task = new(Class.extend({
    init: function() {
        console.log('orderstage-task initialized');
    },    
    migrate: function(contentbody) {
    	console.log('migrating stage order');
        var deferred = EkstepEditor.$q.defer(),        
        		nextStage = {},
            stage,
            contentstages = [],
            instance = this,
            unorderedStages = [];

        if (contentbody) nextStage.value = contentbody.theme.startStage;
        _.forEach(contentbody.theme.stage, function(value, index) {
                if (nextStage) {
                    stage = _.find(contentbody.theme.stage, function(stage) { return stage.id === nextStage.value; });
                    stage && contentstages.push(stage);
                } else { //keep the unordered stages at bottom
                    unorderedStages.push(stage);
                };

                nextStage = _.find(stage.param, function(param) { return param.name === 'next' });
                if (contentbody.theme.stage.length === index + 1) {
                    contentbody.theme.stage = contentstages.concat(unorderedStages);
                		deferred.resolve(contentbody);
            		}
        });
    return deferred.promise;
		}
}));
