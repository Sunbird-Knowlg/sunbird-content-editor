'use strict'

org.ekstep.contenteditor.migration.imagemigration_task = new (Class.extend({
	init: function () {
	},
	migrate: function (contentbody) {},
	removeImage: function (stage, id) {
		_.remove(stage.image, function (image) {
			return image.asset === id
		})
	}
}))()
