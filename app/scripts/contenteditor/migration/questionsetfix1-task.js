'use strict'

org.ekstep.contenteditor.migration.patch_1 = new (Class.extend({
	init: function () {
	},
	id: 'patch_1',
	_startTime: undefined,
	contentbody: undefined,
	assetHostPaths: [
		'https://ntpproductionall.blob.core.windows.net/ntp-content-production/',
		'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/',
		'https://preprodall.blob.core.windows.net/ntp-content-preprod/',
		'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/',
		'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/',
		'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/',
		'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
		'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
		'https://s3.ap-south-1.amazonaws.com/ekstep-public-preprod/',
		'https://ekstep-public-preprod.s3-ap-south-1.amazonaws.com/',
		'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/',
		'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/'
	],
	migrate: function (contentbody) {
		var instance = this
		this._startTime = (new Date()).getTime()
		this.contentbody = contentbody
		_.forEach(contentbody.theme.stage, function (stage) {
			if (stage['org.ekstep.questionset']) {
				if (_.isArray(stage['org.ekstep.questionset'])) {
					_.forEach(stage['org.ekstep.questionset'], function (qSet, index) {
						_.forEach(qSet['org.ekstep.question'], function (question, qindex) {
							if (question.pluginId === 'org.ekstep.questionset.quiz') {
								return
							}
							var fixedQuestion = instance.updateQuestionMedia(question)
							qSet['org.ekstep.question'][qindex] = fixedQuestion
							instance.contentbody.theme.manifest.media = instance.updateContentManifestMedia(instance.contentbody.theme.manifest.media, fixedQuestion)
						})
					})
				} else if (_.isObject(stage['org.ekstep.questionset'])) {
					var question = stage['org.ekstep.questionset']['org.ekstep.question']
					if (question.pluginId === 'org.ekstep.questionset.quiz') {
						return
					}
					var fixedQuestion = instance.updateQuestionMedia(question)
					stage['org.ekstep.questionset']['org.ekstep.question'] = fixedQuestion
					instance.contentbody.theme.manifest.media = instance.updateContentManifestMedia(instance.contentbody.theme.manifest.media, fixedQuestion)
				}
			}
		})
		org.ekstep.contenteditor.migration.patch.push(instance.id)
		org.ekstep.services.telemetryService.log({
			type: 'process',
			level: 'TRACE',
			message: 'questionsetfix_1 migration complted',
			params: [{
				// eslint-disable-next-line
				duration: (new Date()).getTime() - instance._startTime
			}]
		})
	},
	updateContentManifestMedia: function (contentMedia, question) {
		var questionMedia = JSON.parse(question.data.__cdata).media
		_.each(questionMedia, function (media) {
			if (_.isUndefined(_.find(contentMedia, { 'src': media.src }))) {
				contentMedia.push(media)
				org.ekstep.contenteditor.mediaManager.addToMigratedMedia(media)
			}
		})
		return contentMedia
	},
	updateQuestionMedia: function (question) {
		var instance = this
		var questionData = JSON.parse(question.data.__cdata)
		var quesAssets = []

		// For Question Title
		if (questionData.question) {
			instance.addAssets(questionData.question, quesAssets)
		}

		// For Question Options
		if (questionData.options) {
			// For MCQ
			_.each(questionData.options, function (o) {
				instance.addAssets(o, quesAssets)
			})
		}

		if (questionData.option) {
			// For MTF
			if (questionData.option.optionsLHS) {
				_.each(questionData.option.optionsLHS, function (o) {
					instance.addAssets(o, quesAssets)
				})
			}
			if (questionData.option.optionsRHS) {
				_.each(questionData.option.optionsRHS, function (o) {
					instance.addAssets(o, quesAssets)
				})
			}
		}

		_.each(questionData.media, function (media) {
			if(media.src){
				media.src = instance.getRelativeURL(media.src)
			}
		})
		_.each(quesAssets, function (quesAsset) {
			// quesAsset.url = getRelativeURL(quesAsset.url);
			var mediaExist = _.find(questionData.media, function (m) {
				return m.src === quesAsset.src
			})
			if (!mediaExist) {
				questionData.media.push(instance.getMediaObj(quesAsset.src, quesAsset.type))
			}
		})
		question.data['__cdata'] = JSON.stringify(questionData)
		return question
	},
	addAssets: function (obj, targetArray) {
		var instance = this
		if (obj.image) {
			obj.image = instance.getRelativeURL(obj.image)
			targetArray.push({ 'type': 'image', 'src': obj.image })
		}
		if (obj.audio) {
			obj.audio = instance.getRelativeURL(obj.audio)
			targetArray.push({ 'type': 'audio', 'src': obj.audio })
		}
	},
	getRelativeURL: function (src) {
		var instance = this
		var relativeURLPrefix = '/assets/public/'
		_.forEach(instance.assetHostPaths, function (url) {
			if (src.indexOf(url) !== -1) {
				src = src.replace(url, relativeURLPrefix)
			}
		})
		return src
	},
	getMediaObj: function (src, type) {
		var mediaId = Math.floor(Math.random() * 1000000000)
		return {
			'id': mediaId + '-1',
			'src': src,
			'assetId': mediaId,
			'type': type,
			'preload': false
		}
	}
}))()
