'use strict'

org.ekstep.contenteditor.migration.assessmentmigration_task = new (Class.extend({
	init: function () {
	},
	contentbody: undefined,
	template: [],
	id: 'org.ekstep.quiz',
	quiz: { x: 0, y: 0, w: 0, h: 0, visible: true, editable: true, 'z-index': 0, data: { __cdata: { questionnaire: {}, template: [] } }, config: { __cdata: { 'type': 'items', 'var': 'item' } } },
	migrate: function (contentbody) {
		var instance = this
		this.contentbody = contentbody

		_.forEach(contentbody.theme.stage, function (stage, index) {
			if (!_.isUndefined(stage.g) && !_.isArray(stage.g)) stage.g = [stage.g]
			if (!_.isUndefined(stage.iterate) && (_.has(stage, 'embed') || _.find(stage.g, function (g) { return _.has(g, 'embed') }))) {
				instance.transformToQuiz(stage)
				instance.removeObsoleteTag(stage)
			}
		})
	},
	getController: function (controllerId) {
		return _.find(this.contentbody.theme.controller, function (ctrl) {
			return ctrl.id === controllerId
		})
	},
	getTemplate: function (templateId) {
		return _.find(this.contentbody.theme.template, function (template) {
			return template.id === templateId
		})
	},
	transformToQuiz: function (stage) {
		var instance = this

		var questionnaire

		var quiz

		var controllerData

		var ctrl

		var tmplt

		quiz = _.cloneDeep(instance.quiz)
		ctrl = instance.getController(stage.iterate)
		_.isUndefined(ctrl) ? org.ekstep.contenteditor.migration.migrationErrors.push('controller not found for assessment on stage: ' + stage.id) : (controllerData = ctrl.__cdata)
		if (typeof controllerData === 'string') controllerData = JSON.parse(controllerData)
		questionnaire = quiz.data.__cdata.questionnaire = controllerData
		if (questionnaire) {
			_.forEach(questionnaire.item_sets, function (itemset, index) {
				_.forEach(questionnaire.items[itemset.id], function (items) {
					if (items.template) {
						tmplt = instance.getTemplate(items.template)
						_.isUndefined(tmplt) ? org.ekstep.contenteditor.migration.migrationErrors.push('Template not found for assessment on stage: ' + stage.id) : quiz.data.__cdata.template.push(tmplt)
						// instance.removeObsoleteTemplate(items.template);
					}
				})

				if (questionnaire.item_sets.length === index + 1) {
					stage[instance.id] = quiz
					instance.stringifycdata(stage)
				};
			})
		}
	},
	removeObsoleteTag: function (stage) {
		if (_.has(stage, 'embed')) delete stage.embed
		if (_.has(stage, 'g')) _.remove(stage.g, function (g) { return _.has(g, 'embed') })
		if (_.has(stage, 'appEvents')) delete stage.appEvents
		delete stage.iterate
	},
	removeObsoleteTemplate: function (templateId) {
		return _.remove(this.contentbody.theme.template, function (template) {
			return template.id === templateId
		})
	},
	stringifycdata: function (stage) {
		stage[this.id].data.__cdata = JSON.stringify(stage[this.id].data.__cdata)
		stage[this.id].config.__cdata = JSON.stringify(stage[this.id].config.__cdata)
	}
}))()
