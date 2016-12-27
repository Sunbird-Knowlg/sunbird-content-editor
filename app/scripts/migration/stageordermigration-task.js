'use strict';

EkstepEditor.orderstage_task = new(Class.extend({
    init: function() {
        console.log('orderstage-task initialized');
    },
    nextTask: 'basestage_task',
    migrate: function(contentbody) {
    	var deferred = EkstepEditor.$q.defer();
        console.log('migrating stage order');
        var nextStage = {},
            stage,
            contentstages = [],
            instance = this;

        if (contentbody) nextStage.value = contentbody.theme.startStage;
        _.forEach(contentbody.theme.stage, function(value, index) {
            if (nextStage) {
                stage = _.find(contentbody.theme.stage, function(stage) {return stage.id === nextStage.value; });
                stage && contentstages.push(stage);
            }
            nextStage = _.find(stage.param, function(param) { return param.name === 'next' });
            if (contentbody.theme.stage.length === index + 1)(contentbody.theme.stage = contentstages) && deferred.resolve(contentbody);
        });
        return deferred.promise;
    }
}));
