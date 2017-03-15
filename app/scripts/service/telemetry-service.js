/**
 *
 * Telemetry service helps to log telemetry events. Telemetry service generates below listed events
 * and logs to registered dispatchers.
 * <ol>
 *  <li>CE_START
 *  <li>CE_API_CALL
 *  <li>CE_INTERACT
 *  <li>CE_PLUGIN_LIFECYCLE
 *  <li>CE_ERROR
 *  <li>CE_END
 * </ol>
 *
 * @class EkstepEditor.telemetryService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.telemetryService = new(EkstepEditor.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    startEvent: undefined,
    startEventData: undefined,
    /**
    * 
    * Initialize the service with context and dispatcher.     
    * @param context {object} context object can have uid, sid, context_id. 
    * context should have content id, otherwise telemetry service cannot be initialized.
    * @param dispatcher {string} There are 3 types of dispatcher available, anyone of dispatcher 
    * is allowed and same dispatcher is used throughout the editor session. 
    * <ol>
    *   <li>Local dispatcher - dev environment only, logs to file (telemetry.log) - value: "local"
    *   <li>piwik dispatcher - logs to piwik endpoint - value: "piwik"
    *   <li>console dispatcher - logs to client console, default dispatcher - value: undefined
    * </ol>
    * 
    * @memberof EkstepEditor.telemetryService
    *
    */
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

        this.startEventData = { defaultPlugins: Object.keys(EkstepEditor.pluginManager.plugins), loadtimes: {}, client: {} };
    },
    /**
    *
    * to populate data for start event (CE_START)  
    * @param autoplublish {boolean} if "true" logs the events through dispatcher. 
    * @returns {object} returns method chain. 
    * <ol>
    *   <li> <pre>getData()</pre>: return start event data
    *   <li> <pre>append(param, dataObj)</pre>: appends only "loadtimes" param of CE_START with dataObj(type: object). 
    * <ol> 
    * @memberof EkstepEditor.telemetryService
    *
    */
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
    /**
    *
    * returns dispatcher instance
    * @param dispatcherId {string}     
    * <ol>
    *   <li>Local dispatcher: value: "local"
    *   <li>piwik dispatcher: value: "piwik"
    *   <li>(default) console dispatcher: value: undefined 
    * </ol>
    * @returns dispatcher {object}
    * @memberof EkstepEditor.telemetryService
    *
    */
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
    /**
    * 
    * To add a dispatcher to the dispatcher registry
    * @param dispatcherId {string}
    * <ol>
    *   <li>Local dispatcher: value: "local"
    *   <li>piwik dispatcher: value: "piwik"
    *   <li>(default) console dispatcher: value: undefined 
    * </ol>
    * @memberof EkstepEditor.telemetryService
    *
    */
    addDispatcher: function(dispatcherId) {
        var dispatcher = this.getDispatcher(dispatcherId);
        var dispatcherExist = _.find(this.dispatchers, function(obj){
           return  obj.type === dispatcher.type;
        });
        if(!dispatcherExist) this.dispatchers.push(dispatcher);
    },
    /**
     *
     * dispatch event to all registered dipatchers
     * @private
     * @param message {event} structured event
     * @memberof EkstepEditor.telemetryService
     *
     */
    _dispatch: function(message) {
        if (this.initialized) {
            _.forEach(this.dispatchers, function(dispatcher) {
                dispatcher.dispatch(message);
            })
        }
    },
    /**
    *
    * returns structured telemetry event for the given data
    * @param eventId {string} 
    * <ol>
    *  <li>CE_START
    *  <li>CE_API_CALL
    *  <li>CE_INTERACT
    *  <li>CE_PLUGIN_LIFECYCLE
    *  <li>CE_ERROR
    *  <li>CE_END
    * </ol>
    * @param data {object} telemetry data object specified for each telemetry event.
    * @memberof EkstepEditor.telemetryService
    *
    */
    getEvent: function(eventId, data) {
        return {
            "eid": eventId,
            "ets": (new Date()).getTime(), 
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
    /**
    *
    * validates telemetry data with mandatory fields
    * @param data {object} telemetry data
    * @param mandatoryFields {array} required fields for the specific telemetry to validate
    * @memberof EkstepEditor.telemetryService
    *
    */
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
    /**
    *
    * dispatches interact event (CE_INTERACT)
    * @param data {object} interact event data
    * @memberof EkstepEditor.telemetryService
    *
    */
    interact: function(data) {
        if(!this.hasRequiredData(data, this.interactRequiredFields)) {
            console.error('Invalid interact data');    
        }
        this._dispatch(this.getEvent('CE_INTERACT', data))
    },
    /**
    *
    * dispatches end event (CE_END)
    * @memberof EkstepEditor.telemetryService
    *
    */
    end: function() {
        var endEvent = this.getEvent('CE_END', {});
        endEvent.edata.eks.duration = (new Date()).getTime() - this.startEvent.ets;
        this._dispatch(endEvent);
    },
    /**
    *
    * dispatches plugin lifecycle event (CE_PLUGIN_LIFECYCLE)
    * @param data {object} plugin lifecycle event data
    * @memberof EkstepEditor.telemetryService
    *
    */
    pluginLifeCycle: function(data) {
        if(!this.hasRequiredData(data, this.lifecycleRequiredFields)) {
            console.error('Invalid plugin lifecycle event data');    
        }
        this._dispatch(this.getEvent('CE_PLUGIN_LIFECYCLE', data))
    },
    /**
    *
    * dispatches error event (CE_ERROR)
    * @param data {object} error event data
    * @memberof EkstepEditor.telemetryService
    *
    */
    error: function(data) {
        if(!this.hasRequiredData(data, this.errorRequiredFields)) {
            console.error('Invalid error data');
        }
        this._dispatch(this.getEvent('CE_ERROR', data))
    },
    /**
    *
    * dispatches start event (CE_START)
    * @memberof EkstepEditor.telemetryService
    *
    */
    start: function() {
        this.startEventData.client = this.detectClient();
        this.startEvent = this.getEvent('CE_START', this.startEventData);
        this._dispatch(this.startEvent);
    },
    /**
    *
    * dispatches api call event (CE_API_CALL)
    * @param data {object} api call event data
    * @memberof EkstepEditor.telemetryService
    *
    */
    apiCall: function(data) {
        if (!this.hasRequiredData(data, this.apiCallRequiredFields)) {
            console.error('Invalid api call data');
        }
        this._dispatch(this.getEvent('CE_API_CALL', data))
    },
    /**
    *
    * returns client machine info such as OS, browser, browser version
    * @memberof EkstepEditor.telemetryService
    *
    */
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
