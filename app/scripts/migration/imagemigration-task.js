'use strict';

EkstepEditor.migration.imagemigration_task = new(Class.extend({
    init: function() {
        console.log('image migration initialized');
    },
    migrate: function(contentbody) {},
    removeImage: function(stage, id) {
        _.remove(stage.image, function(image) {
            return image.asset === id;
        });
    }
}));
