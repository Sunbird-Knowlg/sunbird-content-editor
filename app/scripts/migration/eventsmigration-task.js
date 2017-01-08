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
            _.forEach(plugins, function(plugin) {
                _.forEach(plugin, function(pi) {
                    if (pi.event || pi.events) {
                        var event = pi.event || pi.events;
                        var events = _.clone(event, true);
                        delete pi.event;
                        delete pi.events;
                        if (_.isArray(events)) {

                            _forEach(events, function(event) {
                                if (event.action && _.isArray(event.action)) {
                                    _forEach(event.action, function(action) {
                                        instance.addEvent(pi, { 'type': 'click', 'action': [action] });
                                    })
                                } else if (event.action && _.isObject(event.action)) {
                                    instance.addEvent(pi, { 'type': 'click', 'action': [event.action] });
                                }
                            })

                        } else if (_.isObject(events)) {
                            if (events.action && _.isArray(events.action)) {
                                _forEach(events.action, function(action) {
                                    instance.addEvent(pi, { 'type': 'click', 'action': [action] });
                                })
                            } else if (events.action && _.isObject(events.action)) {
                                instance.addEvent(pi, { 'type': 'click', 'action': [events.action] });
                            }
                        }

                    }
                })
            })
        });
        deferred.resolve(contentbody);
        return deferred.promise;
    },
    addEvent: function(pi, event) {
        if (_.isUndefined(pi.event)) pi.event = [];
        pi.event.push(event);
    }
}))
