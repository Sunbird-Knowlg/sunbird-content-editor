'use strict'

org.ekstep.contenteditor.migration.settagmigration_task = new (Class.extend({
	init: function () {
	},
	migrate: function (contentbody) {
		_.forEach(contentbody.theme.stage, function (stage, index) {
			// if stage has set tag, throw fatal error.
			if (_.has(stage, 'set')) org.ekstep.contenteditor.migration.migrationErrors.push('Content has set tag on stage: ' + stage.id)
		})
	}
}))()
