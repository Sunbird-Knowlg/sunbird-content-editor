EkstepEditor.telemetryService = new(EkstepEditor.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    startEvent: undefined,
    start: function(context, data) {
        this.context = context;
        if(_.isUndefined(this.context.cdata)) {
            this.context.cdata = [];
        }
        if(_.isUndefined(this.context.uid) || _.isUndefined(this.context.sid) || _.isUndefined(this.context.content_id)) {
            console.error('Unable to instantiate telemetry service');
            this.initialized = false;
        }
        //TODO: Need to pass in default-plugins and load time.
        //Break up the load time between - loading plugins, loading content and migration
        this.startEvent = this.getEvent('CE_START', data)
        this._dispatch(this.startEvent);
    },
    addDispatcher: function(dispatcher) {
        // TODO: Do not add duplicate dispatchers
        this.dispatchers.push(dispatcher);
    },
    _dispatch: function(message) {
        if (this.initialized) {
            _.forEach(this.dispatchers, function(dispatcher) {
                dispatcher.dispatch(message);
            })
        }
    },
    getEvent: function(eventId, data) {
        return {
            "eid": eventId,
            "ets": (new Date()).getTime(), //TODO: Verify this once
            "ver": "1.0",
            "pdata": {"id": "ATTool","pid": "ContentEditor","ver": "2.0"},
            "cdata": this.context.cdata, //TODO: No correlation data as of now. Needs to be sent by portal in context
            "uid": this.context.uid, // uuid of the requester
            "context": {"sid": this.context.sid,"content_id": this.context.content_id},
            "rid": "", // Leave blank.
            "edata": { "eks": data},
            "tags":[]
        }
    },
    isValidInteract: function(data) {
        //TODO: Add code to check whether required attributes are present.
        return true;
    },
    interact: function(data) {
        if(!this.isValidInteract(data)) {
            console.error('Invalid interact data');    
        }
        this._dispatch(this.getEvent('CE_INTERACT', data))
    },
    end: function() {
        var endEvent = this.getEvent('CE_END', {});
        endEvent.edata.eks.duration = (new Date()).getTime() - this.startEvent.ets;
        this._dispatch(endEvent);
    },
    isValidPluginLifeCycle: function(data) {
        //TODO: Add code to check whether required attributes are present.
        return true;
    },
    pluginLifeCycle: function(data) {
        if(!this.isValidPluginLifeCycle(data)) {
            console.error('Invalid plugin lifecycle event data');    
        }
        this._dispatch(this.getEvent('CE_PLUGIN_LIFECYCLE', data))
    },
    isValidError: function() {
        //TODO: Add code to check whether required attributes are present.
        return true;
    },
    error: function(data) {
        if (!this.isValidError(data)) {
            console.error('Invalid error data');
        }
        this._dispatch(this.getEvent('CE_ERROR', data))
    }
}));
