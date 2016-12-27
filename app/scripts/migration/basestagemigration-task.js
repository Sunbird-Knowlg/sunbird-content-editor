'use strict';

EkstepEditor.basestage_task = new(Class.extend({
    init: function() {
        console.log('basestage_task initialized');
    },
    baseStage: undefined,        
    migrate: function(contentbody) {
    	console.log('migrating base stage');
    	var deferred = EkstepEditor.$q.defer(),
    			instance = this;
        _.forEach(contentbody.theme.stage, function(stage, index) {
            if (stage.extends) {
                instance.baseStage = _.find(contentbody.theme.stage, function(o) {return o.id === stage.extends });
                stage = _.assignIn(instance.basestage, stage); //merge stage with basestage
                delete stage.extends;
            }
            if (contentbody.theme.stage.length === index + 1) { 
            	instance.removeBaseStage(contentbody);  
            	deferred.resolve(contentbody);
            }
        });
        return deferred.promise;
    },
    removeBaseStage: function(contentbody) {
        if (this.baseStage) {
           _.remove(contentbody.theme.stage, function(stage) {return stage.id === instance.baseStage.id; });
        }        
    }
}));
