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
            if(!_.isArray(plugins)) plugins = [plugins];
            _.forEach(plugins, function(plugin) {
                if(!_.isArray(plugin)) plugin = [plugin];
                _.forEach(plugin, function(pi) {
                    if (pi.event || pi.events) {
                        var event = pi.event || pi.events;
                        var events = _.clone(event, true);
                        delete pi.event;
                        delete pi.events;
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

                    }
                })
            })
            if(contentbody.theme.stage.length === index + 1) deferred.resolve(contentbody);
        });        
        return deferred.promise;
    },
    addEvent: function(pi, event) {
        if (_.isUndefined(pi.event)) pi.event = [];
        pi.event.push(event);
    }
}))
