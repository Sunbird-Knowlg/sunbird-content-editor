'use strict'

org.ekstep.contenteditor.migration.readalongmigration_task = new (Class.extend({
	init: function () {
	},
	// check 'isReadAlongAutoPlay' attribute in htext and convert to 'autoplay'
	migrate: function (contentbody) {
		console.log('migrating readalong')
		_.forEach(contentbody.theme.stage, function (stage, index) {
			if (stage.htext && (!_.isArray(stage.htext))) stage.htext = [stage.htext]
			if (stage.htext && stage.htext.length) {
				_.forEach(stage.htext, function (htext) {
					if (!_.isUndefined(htext.isReadAlongAutoPlay)) {
						htext.autoplay = htext.isReadAlongAutoPlay
						delete htext.isReadAlongAutoPlay
					}
				})
			}
		})
	}
}))()
