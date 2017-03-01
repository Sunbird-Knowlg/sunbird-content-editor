EkstepEditor.telemetryService = new(EkstepEditor.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    startEvent: undefined,
    startEventData: undefined,
    initialize: function(context, dispatcher) {
        var instance = this;
        this.context = context;
        if(_.isUndefined(this.context.cdata)) {
            this.context.cdata = [];
        }
        if(_.isUndefined(this.context.uid) || _.isUndefined(this.context.sid) || _.isUndefined(this.context.content_id)) {
            console.error('Unable to instantiate telemetry service');
            this.initialized = false;
        }
        if (!_.isUndefined(dispatcher)) this.addDispatcher(dispatcher);

        window.addEventListener('beforeunload', function() {
            instance.end();
        }); 
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
    getDispatcher: function(dispatcherId) {
        switch(dispatcherId) {
            case "local":
                return EkstepEditor.localDispatcher;
                break;
            case "piwik":
                return EkstepEditor.piwikDispatcher;
                break;
            default:
                return EkstepEditor.consoleDispatcher;
        }
    },
    addDispatcher: function(dispatcherId) {
        var dispatcher = this.getDispatcher(dispatcherId);
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
    hasRequiredData: function(data, mandatoryFields) {
        var isValid = true;
        _.forEach(mandatoryFields, function(key) {
            if (!_.has(data, key)) isValid = false;
        });
        return isValid;
    },
    interactRequiredFields: ["type", "subtype", "target", "pluginid", "pluginver", "objectid", "stage"],
    lifecycleRequiredFields: ["type", "pluginid", "pluginver", "objectid", "stage"],
    errorRequiredFields: ["env", "stage", "action", "err", "type", "data", "severity"],
    apiCallRequiredFields: ["path", "method", "request", "response","responseTime", "status", "uip"],
    interact: function(data) {
        if(!this.hasRequiredData(data, this.interactRequiredFields)) {
            console.error('Invalid interact data');    
        }
        this._dispatch(this.getEvent('CE_INTERACT', data))
    },
    end: function() {
        var endEvent = this.getEvent('CE_END', {});
        endEvent.edata.eks.duration = (new Date()).getTime() - this.startEvent.ets;
        this._dispatch(endEvent);
    },
    pluginLifeCycle: function(data) {
        if(!this.hasRequiredData(data, this.lifecycleRequiredFields)) {
            console.error('Invalid plugin lifecycle event data');    
        }
        this._dispatch(this.getEvent('CE_PLUGIN_LIFECYCLE', data))
    },
    error: function(data) {
        if(!this.hasRequiredData(data, this.errorRequiredFields)) {
            console.error('Invalid error data');
        }
        this._dispatch(this.getEvent('CE_ERROR', data))
    },
    start: function() {
        this.startEventData.client = this.detectClient();
        this.startEvent = this.getEvent('CE_START', this.startEventData);
        this._dispatch(this.startEvent);
    },
    apiCall: function(data) {
        if (!this.hasRequiredData(data, this.apiCallRequiredFields)) {
            console.error('Invalid api call data');
        }
        this._dispatch(this.getEvent('CE_API_CALL', data))
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
