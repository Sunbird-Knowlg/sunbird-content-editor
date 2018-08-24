'use strict'

org.ekstep.contenteditor.migration.basestage_task = new (Class.extend({
	init: function () {
	},
	baseStage: undefined,
	contentbody: undefined,
	migrate: function (contentbody) {
		var instance = this

		var baseStageArray = []

		instance.contentbody = contentbody
		if (!_.isArray(instance.contentbody.theme.stage)) instance.contentbody.theme.stage = [instance.contentbody.theme.stage]
		_.forEach(instance.contentbody.theme.stage, function (stage, index) {
			var mergedObject = {}
			if (stage.extends) {
				instance.baseStage = _.find(contentbody.theme.stage, function (o) { return o.id === stage.extends })
				// merge stage with basestage
				for (var attr in instance.baseStage) { mergedObject[attr] = instance.baseStage[attr] }
				for (var attribute in stage) { mergedObject[attribute] = stage[attribute] }
				stage = mergedObject
				delete instance.contentbody.theme.stage[index].extends
				baseStageArray.push(instance.baseStage.id)
			}
			if (contentbody.theme.stage.length === index + 1) {
				if (baseStageArray.length) {
					_.forEach(baseStageArray, function (bs, index) {
						instance.removeBaseStage(bs)
					})
				}
			}
		})
	},
	removeBaseStage: function (baseStage) {
		var instance = this
		if (baseStage) {
			_.remove(instance.contentbody.theme.stage, function (s) {
				return s.id === baseStage
			})
		}
	}
}))()
