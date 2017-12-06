/**
 *
 * Telemetry service helps to log telemetry events. Telemetry service generates below listed events
 * and logs to registered dispatchers.
 * <ol>
 *  <li> V2 =>  V3
 *  <li>CE_START => START
 *  <li>CE_API_CALL => LOG
 *  <li>CE_INTERACT => INTERACT
 *  <li>CE_PLUGIN_LIFECYCLE => INTERACT
 *  <li>CE_ERROR => ERROR
 *  <li>CE_END => END
 * </ol>
 *
 * @class org.ekstep.services.telemetryService
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.services.telemetryService = new(org.ekstep.services.iService.extend({
    context: {},
    dispatchers: [],
    initialized: true,
    start_event: undefined,
    startEventData: undefined,
    contentLoadTime: 0,
    /**
     * Deperecated: V3 telemetry implementation
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
     * @memberof org.ekstep.services.telemetryService
     */
    initialize: function(context, dispatcher) {
        var instance = this;
        this.context = context;
        /* istanbul ignore else */
        if (this.context.cdata == undefined) {
            this.context.cdata = [];
        }
        if ((this.context.uid == undefined) || (this.context.sid == undefined) || (this.context.content_id == undefined)) {
            console.error('Unable to instantiate telemetry service');
            this.initialized = false;
        }
        this.addDispatcher(dispatcher);

        window.addEventListener('unload', /* istanbul ignore next */ function() {
            instance.end();
        });
        this.startEventData = { defaultPlugins: Object.keys(org.ekstep.pluginframework.pluginManager.plugins), loadtimes: {}, client: {} };
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
     * @memberof org.ekstep.services.telemetryService
     *
     */
    startEvent: function(autopublish) {
        var instance = this;
        return {
            duration: function(time){
                instance.contentLoadTime += parseInt(time);
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
     * @memberof org.ekstep.services.telemetryService
     *
     */
    getDispatcher: function(dispatcherId) {
        switch (dispatcherId) {
            case "local":
                return org.ekstep.contenteditor.localDispatcher;
            case "piwik":
                return org.ekstep.contenteditor.piwikDispatcher;
            default:
                return org.ekstep.contenteditor.consoleDispatcher;
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
     * @memberof org.ekstep.services.telemetryService
     *
     */
    addDispatcher: function(dispatcherId) {
        var dispatcher = this.getDispatcher(dispatcherId);
        var dispatcherExist = this.dispatchers.find(function(obj) {
            return obj.type === dispatcher.type;
        });
        if (!dispatcherExist) this.dispatchers.push(dispatcher);
    },
    /**
     *
     * dispatch event to all registered dipatchers
     * @private
     * @param message {event} structured event
     * @memberof org.ekstep.services.telemetryService
     *
     */
    _dispatch: function(message) {
        if (this.initialized) {
            message.mid = 'CE:' + CryptoJS.MD5(JSON.stringify(message)).toString();
            _.forEach(this.dispatchers, function(dispatcher) {
                dispatcher.dispatch(message);
            });
        }
    },
    /**
     * Deperecated: V3 telemetry implementation
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
     * @memberof org.ekstep.services.telemetryService
     *
     */
    getEvent: function(eventId, data) {
        return {
            "eid": eventId,
            "mid": "",
            "ets": (new Date()).getTime(),
            "channel": this.context.channel,
            "ver": "2.1",
            "pdata": this.context.pdata,
            "cdata": this.context.cdata, //TODO: No correlation data as of now. Needs to be sent by portal in context
            "uid": this.context.uid, // uuid of the requester
            "context": { "sid": this.context.sid, "content_id": this.context.content_id },
            "rid": "", // Leave blank.
            "edata": { "eks": data },
            "etags": this.context.etags

        }
    },
    /**
     *
     * validates telemetry data with mandatory fields
     * @param data {object} telemetry data
     * @param mandatoryFields {array} required fields for the specific telemetry to validate
     * @memberof org.ekstep.services.telemetryService
     *
     */
    hasRequiredData: function(data, mandatoryFields) {
        var isValid = true;
        mandatoryFields.forEach(function(key) {
            if (!data.hasOwnProperty(key)) isValid = false;
        });
        return isValid;
    },
    interactRequiredFields: ["type", "subtype", "target", "pluginid", "pluginver", "objectid", "stage"],
    lifecycleRequiredFields: ["type", "pluginid", "pluginver", "objectid", "stage"],
    errorRequiredFields: ["env", "stage", "action", "err", "type", "data", "severity", "objectid", "objecttype"],
    apiCallRequiredFields: ["path", "method", "request", "response", "responseTime", "status", "uip"],
    /**
     *
     * dispatches interact event (CE_INTERACT)
     * @param data {object} interact event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
    interact: function(data) {
        if(!(data.hasOwnProperty('type') && (data.hasOwnProperty('objectid') || data.hasOwnProperty('id')))){
            console.error('Invalid interact data');
            return;
        }
        var eventData = {
            "type": data.type,
            "id": data.id || data.objectid
        };
        // for V3 implementation
        if(data.extra)
            eventData.extra = data.extra;
        if(data.subtype)
            eventData.subtype = data.subtype;
        if(data.pageid || data.stage)
            eventData.pageid = data.pageid || data.stage;
        // converting plugin, tareget for v3 from v2 data 
        eventData.plugin = data.plugin ? data.plugin : { "id": data.pluginid, "ver": data.pluginver }
        if(data.target && _.isObject(data.target)){
            eventData.target = data.target;
        }else{
            // converting target for v3 from v2 data
            eventData.target = {
                "id": data.target,
                "ver": "",
                "type": ""
            }
        }
        EkTelemetry.interact(eventData);
    },
    /**
     *
     * dispatches end event (CE_END)
     * @memberof org.ekstep.services.telemetryService
     *
     */
    end: function() {
        EkTelemetry.end({
            "type": "editor",
            "mode": ecEditor.getConfig('editorType') || "content"
        });
    },
    /**
     *
     * dispatches plugin lifecycle event (CE_PLUGIN_LIFECYCLE)
     * @param data {object} plugin lifecycle event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
    pluginLifeCycle: function(data) {
        if(!(data.hasOwnProperty('type') && (data.hasOwnProperty('objectid') || data.hasOwnProperty('id')))){
            console.error('Invalid plugin lifecycle event data');
            return;
        }
        this.interact(data);
    },
    /**
     *
     * dispatches error event (CE_ERROR)
     * @param data {object} error event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
    error: function(data) {
        if(!(data.hasOwnProperty('err') && (data.hasOwnProperty('type') || data.hasOwnProperty('errtype')) && (data.hasOwnProperty('data') || data.hasOwnProperty('stacktrace')))){
            console.error('Invalid error data');
            return;
        }
        var eventData = {
            "err": data.err,
            "errtype": data.type || data.errtype,
            "stacktrace": data.data || data.stacktrace
        }
        // for V3 implementation
        if(data.pageid || data.stage)
            eventData.pageid = data.stage || data.pageid;
        if(data.plugin)
            eventData.plugin = data.plugin;
        eventData.object = data.object ? data.object : { "id": data.objectid, "type": data.objecttype };
        EkTelemetry.error(eventData);
    },
    /**
     *
     * dispatches start event (CE_START)
     * @memberof org.ekstep.services.telemetryService
     *
     */
    start: function() {
        var instance = this;
        var config = {
            uid: ecEditor.getContext('uid'),
            sid: ecEditor.getContext('sid'),
            tags: ecEditor.getContext('etags') || ecEditor.getContext('tags'),
            channel: ecEditor.getContext('channel') || "in.ekstep",
            pdata: ecEditor.getContext('pdata') || {id: "in.ekstep", pid: "ekstep_portal", ver: "1.0"},
            env: ecEditor.getContext('env') || "contenteditor",
            dispatcer: org.ekstep.contenteditor.config.dispatcher,
            object: {
                id: ecEditor.getContext('contentId'),
                type: "Content",
                ver: ""
            },
            dispatcher: instance.getDispatcher(org.ekstep.contenteditor.config.dispatcher),
            rollup: ecEditor.getContext('rollup') || {}
        };
        EkTelemetry.start(config, org.ekstep.contenteditor.api.getContext('contentId'), "", { 
            "uaspec": instance.detectClient(),
            "type": "editor",
            "mode": ecEditor.getConfig('editorType') || "content",
            "duration": instance.contentLoadTime
        });

        EkTelemetry.impression({
            type: "edit",
            pageid: "contenteditor",
            uri: encodeURIComponent(location.href)
        });
    },
    /**
     *
     * dispatches api call event (CE_API_CALL)
     * @param data {object} api call event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
    apiCall: function(data) {
        if (!this.hasRequiredData(data, this.apiCallRequiredFields)) {
            console.error('Invalid api call data');
            return;
        }
        var eventData = {
            "type": "api_call",
            "level": "INFO",
            "message": "",
            "params": [data]
        }
        console.log('eventData ', eventData)
        EkTelemetry.log(eventData);
    },
    /**
     *
     * dispatches log event
     * @param data {object} log event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
    log: function(data){
        if (!this.hasRequiredData(data, ["type", "level", "message"])) {
            console.error('Invalid log data');
            return;
        }
        var eventData = {
            "type": data.type,
            "level": data.level,
            "message": data.message
        }
        // for V3 implementation
        if(data.pageid || data.stage)
            eventData.pageid = data.stage || data.pageid;
        if(data.params)
            eventData.params = data.params;
        EkTelemetry.log(eventData);
    },
    /**
     *
     * returns client machine info such as OS, browser, browser version
     * @memberof org.ekstep.services.telemetryService
     *
     */
    detectClient: function() {

        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset, verOffset, ix;

        // In Opera
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
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
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        
        return { agent: browserName, ver: fullVersion, system: navigator.platform, platform: "", raw:  navigator.userAgent};
    }
}));
