'use strict'

org.ekstep.contenteditor.migration.orderstage_task = new (Class.extend({
	init: function () {
	},
	migrate: function (contentbody) {
		var nextStage = {}

		var stage

		var contentstages = []

		nextStage.value = (!_.isUndefined(contentbody)) ? contentbody.theme.startStage : undefined
		var stages = _.clone(contentbody.theme.stage)
		for (var i = 0; i < contentbody.theme.stage.length; i++) {
			if (!_.isUndefined(nextStage.value)) {
				stage = _.find(stages, function (st) {
					return st.id === nextStage.value
				})
				if (!_.isUndefined(stage)) {
					contentstages.push(stage)
					var index = _.findIndex(stages, function (s) {
						return s.id === nextStage.value
					})
					stages.splice(index, 1)
					if (_.isArray(stage.param) && !_.isUndefined(stage.param)) {
						_.forEach(stage.param, function (param) {
							if (param.name === 'next') { nextStage.value = param.value }
						})
					} else if (!_.isUndefined(stage.param) && stage.param.name === 'next') {
						nextStage.value = stage.param.value
					} else {
						nextStage.value = undefined
					}
				}
			}
			if (contentbody.theme.stage.length === i + 1) {
				contentbody.theme.stage = contentstages.concat(stages)
			}
		}
	}
}))()
