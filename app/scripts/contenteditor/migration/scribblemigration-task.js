'use strict'

org.ekstep.contenteditor.migration.scribblemigration_task = new (Class.extend({
	init: function () {
	},
	id: 'org.ekstep.scribblepad',
	migrate: function (contentbody) {
		var instance = this

		_.forEach(contentbody.theme.stage, function (stage, index) {
			if (stage.scribble && (!_.isArray(stage.scribble))) stage.scribble = [stage.scribble]
			if (stage.scribble && stage.scribble.length) {
				stage[instance.id] = stage.scribble
				delete stage.scribble
			}
			org.ekstep.contenteditor.migration.imagemigration_task.removeImage(stage, 'domain_38441_trash')
			instance.removeEraserMedia(contentbody)
		})
	},
	removeEraserMedia: function (contentbody) {
		_.forEach(_.clone(contentbody.theme.manifest.media), function (media, index) {
			if (media.assetId === 'domain_38441_trash') contentbody.theme.manifest.media.splice(index, 1)
		})
	}
}))()
