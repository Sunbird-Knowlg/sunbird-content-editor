/*EkstepEditor.telemetryService = new(EkstepEditor.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    startEvent: undefined,
    startEventData: undefined,
    initialize: function(context) {
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
        //this.startEvent = this.getEvent('CE_START', data)
        //this._dispatch(this.startEvent);
        this.startEventData = { defaultPlugins: Object.keys(EkstepEditor.pluginManager.plugins), loadtimes: {} };
    },
    updateStartEvent: function(key, value) {                
        this.startEventData && (this.startEventData.loadtimes[key] = value);
    },
    addDispatcher: function(dispatcher) {
        var dispatcherExist = _.find(this.dispatchers, function(obj){
           return  obj.type === dispatcher.type;
        });
        if(!dispatcherExist) this.dispatchers.push(dispatcher);
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
        var isValid = true,
            mandatoryFields = ["type", "subtype", "target", "targetid", "objectid", "stage"];

        _.forEach(mandatoryFields, function(key) {
            if (!_.has(data, key)) isValid = false;
        });
        return isValid;
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
        var isValid = true,
            mandatoryFields = ["type", "pluginid", "pluginver", "objectid", "stage", "containerid", "containerplugin"];

        _.forEach(mandatoryFields, function(key) {
            if (!_.has(data, key)) isValid = false;
        });
        return isValid;
    },
    pluginLifeCycle: function(data) {
        if(!this.isValidPluginLifeCycle(data)) {
            console.error('Invalid plugin lifecycle event data');    
        }
        this._dispatch(this.getEvent('CE_PLUGIN_LIFECYCLE', data))
    },
    isValidError: function(data) {
        var isValid = true,
            mandatoryFields = ["env", "stage", "action", "err", "type", "data", "severity"];

        _.forEach(mandatoryFields, function(key) {
            if (!_.has(data, key)) isValid = false;
        });
        return isValid;
    },
    error: function(data) {
        if (!this.isValidError(data)) {
            console.error('Invalid error data');
        }
        this._dispatch(this.getEvent('CE_ERROR', data))
    },
    isValidStart: function(data) {
        var isValid = true,
            mandatoryFields = ["defaultPlugins", "loadtimes"],
            subMandatoryFields = ["plugins", "migration", "contentLoad"];

        _.forEach(mandatoryFields, function(key) {
            if (!data[key]) isValid = false;
        });

        _.forEach(subMandatoryFields, function(key) {
            if (isValid && (!data.loadtimes[key])) isValid = false;
        });
        return isValid;
    },
    start: function() {
        if (this.isValidStart(this.startEventData)) {   
            this.startEvent = this.getEvent('CE_START', this.startEventData);         
            this._dispatch(this.startEvent);
        }
    }
}));
*/
