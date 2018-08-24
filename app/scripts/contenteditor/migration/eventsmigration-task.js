'use strict'

org.ekstep.contenteditor.migration.eventsmigration_task = new (Class.extend({
	init: function () {
	},
	migrate: function (contentbody) {
		console.log('migrating events')
		var instance = this
		_.forEach(contentbody.theme.stage, function (stage, index) {
			var plugins = _.pickBy(stage, _.isObject)
			if (!_.isArray(plugins)) plugins = [plugins]
			_.forEach(plugins, function (pluginTypes) {
				if (!_.isArray(pluginTypes)) pluginTypes = [pluginTypes]
				_.forEach(pluginTypes, function (plugin) {
					_.forEach(plugin, function (pluginInstances) {
						if (_.isArray(pluginInstances)) {
							_.forEach(pluginInstances, function (pi) {
								if (pi && (pi.event || pi.events)) {
									if (pi.event) {
										var event = _.clone(pi.event, true)
										delete pi.event
										instance.migrateEvents(event, pi)
									}
									if (pi.events && pi.events.event) {
										var events = _.clone(pi.events.event, true)
										delete pi.events
										instance.migrateEvents(events, pi)
									}
								}
							})
						} else {
							if (pluginInstances && (pluginInstances.event || pluginInstances.events)) {
								if (pluginInstances.event) {
									var event = _.clone(pluginInstances.event, true)
									delete pluginInstances.event
									instance.migrateEvents(event, pluginInstances)
								}
								if (pluginInstances.events && pluginInstances.events.event) {
									var events = _.clone(pluginInstances.events.event, true)
									delete pluginInstances.events
									instance.migrateEvents(events, pluginInstances)
								}
							}
						}
					})
				})
			})
			if (stage.event || stage.events) {
				if (stage.event) {
					var stageEvent = _.clone(stage.event, true)
					delete stage.event
					instance.migrateStageEvents(stageEvent, stage)
				}
				if (stage.events && stage.events.event) {
					var stageEvents = _.clone(stage.events.event, true)
					delete stage.events
					instance.migrateStageEvents(stageEvents, stage)
				}
			}
		})
	},
	migrateStageEvents: function (events, pi) {
		var instance = this
		if (_.isArray(events)) {
			_.forEach(events, function (event) {
				if (event.action && _.isArray(event.action)) {
					_.forEach(event.action, function (action) {
						instance.addEvent(pi, { 'type': event.type, 'action': [action] })
					})
				} else if (event.action && _.isObject(event.action)) {
					instance.addEvent(pi, { 'type': event.type, 'action': [event.action] })
				}
			})
		} else if (_.isObject(events)) {
			if (events.action && _.isArray(events.action)) {
				_.forEach(events.action, function (action) {
					var eventObj = { 'type': events.type, 'action': [action] }
					if (!_.isUndefined(events.type)) {
						eventObj.type = events.type
					}
					instance.addEvent(pi, eventObj)
				})
			} else if (events.action && _.isObject(events.action)) {
				var eventObj = { 'type': events.type, 'action': [events.action] }
				if (!_.isUndefined(events.type)) {
					eventObj.type = events.type
				}
				instance.addEvent(pi, eventObj)
			}
		}
	},
	migrateEvents: function (events, pi) {
		var instance = this
		if (_.isArray(events)) {
			_.forEach(events, function (event) {
				if (event.action && _.isArray(event.action)) {
					_.forEach(event.action, function (action) {
						instance.addEvent(pi, { 'type': event.type, 'action': [action] })
					})
				} else if (event.action && _.isObject(event.action)) {
					instance.addEvent(pi, { 'type': event.type, 'action': [event.action] })
				}
			})
		} else if (_.isObject(events)) {
			if (events.action && _.isArray(events.action)) {
				_.forEach(events.action, function (action) {
					instance.addEvent(pi, { 'type': events.type, 'action': [action] })
				})
			} else if (events.action && _.isObject(events.action)) {
				instance.addEvent(pi, { 'type': events.type, 'action': [events.action] })
			}
		}
	},
	addEvent: function (pi, event) {
		if (_.isUndefined(pi.event)) pi.event = []
		pi.event.push(event)
	}
}))()
