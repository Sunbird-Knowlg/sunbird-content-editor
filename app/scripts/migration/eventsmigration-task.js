'use strict';

EkstepEditor.migration.eventsmigration_task = new(Class.extend({
    init: function() {
        console.log('events migration task initialized');
    },
    migrate: function(contentbody) {
        console.log('migrating events');
        var deferred = EkstepEditor.$q.defer(),
            instance = this;
        _.forEach(contentbody.theme.stage, function(stage, index) {
            var plugins = _.pickBy(stage, _.isObject);
            if (!_.isArray(plugins)) plugins = [plugins];
            _.forEach(plugins, function(pluginTypes) {
                if (!_.isArray(pluginTypes)) pluginTypes = [pluginTypes];
                _.forEach(pluginTypes, function(plugin) {
                    _.forEach(plugin, function(pluginInstances) {
                        if (_.isArray(pluginInstances)) {
                            _.forEach(pluginInstances, function(pi) {
                                if (pi && (pi.event || pi.events)) {
                                    var event = pi.event || pi.events;
                                    var events = _.clone(event, true);
                                    delete pi.event;
                                    delete pi.events;
                                    instance.migrateEvents(events, pi)
                                }
                            })
                        } else {
                            if (pluginInstances.event || pluginInstances.events) {
                                var events = pluginInstances.event || pluginInstances.events;
                                var event = pluginInstances.event || pluginInstances.events;
                                var events = _.clone(event, true);
                                delete pluginInstances.event;
                                delete pluginInstances.events;
                                instance.migrateEvents(events, pluginInstances)
                            }
                        }
                    })
                })
            })
            if (stage.event || stage.events) {
                var stageEventsCopy = stage.event || stage.events;
                var stageEvents = _.clone(stageEventsCopy, true);
                delete stage.event;
                delete stage.events;
                instance.migrateStageEvents(stageEvents, stage);
            }
            if (contentbody.theme.stage.length === index + 1) deferred.resolve(contentbody);
        });
        return deferred.promise;
    },
    migrateStageEvents: function(events, pi) {
        var instance = this;
        if (_.isArray(events)) {
            _.forEach(events, function(event) {
                if (event.action && _.isArray(event.action)) {
                    _.forEach(event.action, function(action) {
                        var eventObj = { 'type': 'click', 'action': [action] };
                        if (!_.isUndefined(event.type)) {
                            eventObj.type = event.type;
                        }
                        instance.addEvent(pi, eventObj);
                    })
                } else if (event.action && _.isObject(event.action)) {
                    var eventObj = { 'type': 'click', 'action': [event.action] };
                    if (!_.isUndefined(event.type)) {
                        eventObj.type = event.type;
                    }
                    instance.addEvent(pi, eventObj);
                }
            })
        } else if (_.isObject(events)) {
            if (events.action && _.isArray(events.action)) {
                _.forEach(events.action, function(action) {
                    var eventObj = { 'type': 'click', 'action': [action] };
                    if (!_.isUndefined(events.type)) {
                        eventObj.type = events.type;
                    }
                    instance.addEvent(pi, eventObj);
                })
            } else if (events.action && _.isObject(events.action)) {
                var eventObj = { 'type': 'click', 'action': [events.action] };
                if (!_.isUndefined(events.type)) {
                    eventObj.type = events.type;
                }
                instance.addEvent(pi, eventObj);
            }
        }
    },
    migrateEvents: function(events, pi) {
        var instance = this;
        if (_.isArray(events)) {
            _.forEach(events, function(event) {
                if (event.action && _.isArray(event.action)) {
                    _.forEach(event.action, function(action) {
                        instance.addEvent(pi, { 'type': 'click', 'action': [action] });
                    })
                } else if (event.action && _.isObject(event.action)) {
                    instance.addEvent(pi, { 'type': 'click', 'action': [event.action] });
                }
            })
        } else if (_.isObject(events)) {
            if (events.action && _.isArray(events.action)) {
                _.forEach(events.action, function(action) {
                    instance.addEvent(pi, { 'type': 'click', 'action': [action] });
                })
            } else if (events.action && _.isObject(events.action)) {
                instance.addEvent(pi, { 'type': 'click', 'action': [events.action] });
            }
        }
    },
    addEvent: function(pi, event) {
        if (_.isUndefined(pi.event)) pi.event = [];
        pi.event.push(event);
    }
}))
