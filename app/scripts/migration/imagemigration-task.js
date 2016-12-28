'use strict';

EkstepEditor.migration.imagemigration_task = new(Class.extend({
    init: function() {
        console.log('image migration initialized');
    },
    migrate: function(contentbody) {
        var deferred = EkstepEditor.$q.defer();
        deferred.resolve(contentbody);
        return deferred.promise;
    },
    removeImage: function(stage, id) {
        _.remove(stage.image, function(image) {
            return image.asset === id;
        });
    }
}));
