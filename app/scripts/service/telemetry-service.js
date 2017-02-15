EkstepEditor.telemetryService = new(EkstepEditor.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    startEvent: undefined,
    startEventData: undefined,
    initialize: function(context, dispatcher) {
        this.context = context;
        if(_.isUndefined(this.context.cdata)) {
            this.context.cdata = [];
        }
        if(_.isUndefined(this.context.uid) || _.isUndefined(this.context.sid) || _.isUndefined(this.context.content_id)) {
            console.error('Unable to instantiate telemetry service');
            this.initialized = false;
        }
        if (!_.isUndefined(dispatcher)) this.addDispatcher(dispatcher);
        //TODO: Need to pass in default-plugins and load time.
        //Break up the load time between - loading plugins, loading content and migration
        //this.startEvent = this.getEvent('CE_START', data)
        //this._dispatch(this.startEvent);
        this.startEventData = { defaultPlugins: Object.keys(EkstepEditor.pluginManager.plugins), loadtimes: {}, client: {} };
    },
    startEvent: function(autopublish) {
        var instance = this;
        return {
            getData: function() {
                return this.startEventData;
            },
            append: function(param, dataObj) {
                _.forIn(dataObj, function(value, key) {
                    instance.startEventData[param][key] = value;
                });
                if (autopublish) instance.start();
            }
        }
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
            mandatoryFields = ["defaultPlugins", "loadtimes", "client"],
            subMandatoryFields = ["plugins", "contentLoad"];

        _.forEach(mandatoryFields, function(key) {
            if (!data[key]) isValid = false;
        });

        _.forEach(subMandatoryFields, function(key) {
            if (isValid && (!data.loadtimes[key])) isValid = false;
        });
        return isValid;
    },
    start: function() {
        this.startEventData.client = this.detectClient();
        if (this.isValidStart(this.startEventData)) {            
            this.startEvent = this.getEvent('CE_START', this.startEventData);
            this._dispatch(this.startEvent);
        }
    },
    detectClient: function() {        
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset, verOffset, ix;

        // In Opera
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "IE";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        return { browser: browserName, browserver: fullVersion, os: navigator.platform };
    }
}));
