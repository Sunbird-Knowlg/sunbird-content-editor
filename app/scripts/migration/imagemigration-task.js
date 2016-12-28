'use strict';

EkstepEditor.imagemigration_task = new(Class.extend({
    init: function() {
        console.log('image migration initialized');
    },
    id: 'org.ekstep.image',
    migrate: function(contentbody) {
    	var deferred = EkstepEditor.$q.defer();
        var instance = this;
        _.forEach(contentbody.theme.stage, function(stage, index) {
            if (stage.image && stage.image.length) stage[instance.id] = stage.image;            
            if (stage.image) delete stage.image;
            if (contentbody.theme.stage.length === index + 1) deferred.resolve(contentbody);
        });
        return deferred.promise;
    },
    removeImage: function(stage, id) {
        var image = _.isUndefined(stage.image) ? this.id : 'image';
        _.remove(stage[image], function(image) {
            return image.asset === id;
        });
    }
}));
