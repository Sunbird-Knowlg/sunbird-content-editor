'use strict';

EkstepEditor.migration.basestage_task = new(Class.extend({
    init: function() {
        console.log('basestage_task initialized');
    },
    baseStage: undefined,
    contentbody: undefined,    
    migrate: function(contentbody) {
        console.log('migrating base stage');
        var deferred = EkstepEditor.$q.defer(),
            instance = this,
            stageId,
            baseStageArray = [];

            instance.contentbody = contentbody;
        _.forEach(instance.contentbody.theme.stage, function(stage, index) {
            var mergedObject = {}
            if (stage.extends) {
                instance.baseStage = _.find(contentbody.theme.stage, function(o) { return o.id === stage.extends });
                //merge stage with basestage                
                for (var attr in instance.baseStage) { mergedObject[attr] = instance.baseStage[attr] }
                for (var attr in stage) { mergedObject[attr] = stage[attr] }                
                stage = mergedObject;                 
                delete instance.contentbody.theme.stage[index].extends;
                baseStageArray.push(instance.baseStage.id);
            }
            if (contentbody.theme.stage.length === index + 1) {
                if (baseStageArray.length) {
                    _.forEach(baseStageArray, function(bs, index){ 
                        instance.removeBaseStage(bs);
                        if(baseStageArray.length === index + 1) deferred.resolve(instance.contentbody);
                    });
                } else {
                    deferred.resolve(instance.contentbody);    
                }
                
            }
        });
        return deferred.promise;
    },
    removeBaseStage: function(baseStage) {
        var instance = this;
        if (baseStage) {
            _.remove(instance.contentbody.theme.stage, function(s) {
                return s.id === baseStage;
            });
        }
    }
}));
