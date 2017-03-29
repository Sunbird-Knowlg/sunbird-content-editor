'use strict';

describe('telemetry service', function() {
    var uid, service = org.ekstep.services.telemetryService;

    beforeAll(function() {
        service.dispatchers = [];
        uid = "346";
        org.ekstep.pluginframework.pluginManager.cleanUp();
        org.ekstep.contenteditor.stageManager.cleanUp();
        org.ekstep.contenteditor.toolbarManager.cleanUp();
        spyOn(window,'Date').and.returnValue({ getTime: function() { return 100 }});
    });

    it('should initialize the service', function() {
        spyOn(window, 'addEventListener');
        service.addDispatcher(); //console
        service.initialize({
            uid: uid,
            sid: "",
            content_id: org.ekstep.contenteditor.api.getContext('contentId')
        });

        expect(service.initialized).toBe(true);
        expect(service.dispatchers.length).toBe(1);
        expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
        expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: {}, client: {} });
    });

    it('should add dispatcher', function() {
        service.dispatchers = [];
        service.addDispatcher("piwik");
        expect(service.dispatchers.pop().type).toBe("piwikDispatcher");
    });

    it('should get dispatcher', function() {
        expect(service.getDispatcher("local")).toBe(org.ekstep.pluginframework.localDispatcher);
        expect(service.getDispatcher("piwik")).toBe(org.ekstep.pluginframework.piwikDispatcher);
        expect(service.getDispatcher()).toBe(org.ekstep.pluginframework.consoleDispatcher);
    });

    it('should append plugin and content load time to startEvent', function() {
        spyOn(service, 'start');
        service.startEvent().append('loadtimes', { plugins: 100 });
        service.startEvent(true).append('loadtimes', { contentLoad: 100 });
        expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: { plugins: 100, contentLoad: 100 }, client: {} });
        expect(service.start).toHaveBeenCalled();
    });

    it('should get event template', function() {
        var empty_event = service.getEvent("CE_TEST", {});
        expect(empty_event.eid).toBe("CE_TEST");
        expect(empty_event.ets).toBeDefined();
        expect(empty_event.ver).toBe("1.0");
        expect(empty_event.pdata).toEqual({ "id": "ATTool", "pid": "ContentEditor", "ver": "2.0" });
        expect(empty_event.cdata).toEqual([]);
        expect(empty_event.context).toEqual({ "sid": "", "content_id": org.ekstep.contenteditor.api.getContext('contentId') });
        expect(empty_event.rid).toBe("");
        expect(empty_event.edata).toEqual({ "eks": {} });
        expect(empty_event.tags).toEqual([]);
    });

    it('should dispatch CE_START event', function() {
        spyOn(service, '_dispatch');

        service.start();
        var data = service.getEvent("CE_START", { defaultPlugins: [], loadtimes: { plugins: 100, contentLoad: 100 }, client: service.detectClient() });

        expect(service._dispatch).toHaveBeenCalledWith(data);
    });

    it('should dispatch CE_END event', function() {
        spyOn(service, '_dispatch');

        service.end();
        var data = service.getEvent("CE_END", {});
        data.edata.eks.duration = (new Date()).getTime() - service.start_event.ets;

        expect(service._dispatch).toHaveBeenCalledWith(data);
    });

    it('should dispatch CE_PLUGIN_LIFECYCLE event', function() {
        spyOn(service, '_dispatch');

        var data = { "type": "add", "pluginid": "org.ekstep.image", "pluginver": "1.0", "objectid": "c10732bd-e548-4195-a7d5-4dc921a5599b", "stage": "4d0657d8-27ba-4e2c-b4a6-795202e4d754", "containerid": "", "containerplugin": "" };
        var testEvent = service.getEvent("CE_PLUGIN_LIFECYCLE", data);

        service.pluginLifeCycle(data);
        expect(service._dispatch).toHaveBeenCalledWith(testEvent);
    });

    it('should dispatch CE_INTERACT event', function() {
        spyOn(service, '_dispatch');

        var data = { "type": "select", "subtype": "", "target": "plugin", "pluginid": "org.ekstep.image", "pluginver": "1.0", "objectid": "c10732bd-e548-4195-a7d5-4dc921a5599b", "stage": "4d0657d8-27ba-4e2c-b4a6-795202e4d754" };
        var testEvent = service.getEvent("CE_INTERACT", data);

        service.interact(data);
        expect(service._dispatch).toHaveBeenCalledWith(testEvent);
    });

    it('should dispatch CE_ERROR event', function() {
        spyOn(service, '_dispatch');

        var data = { "env": "migration", "stage": "", "action": "log the error", "err": "migration has errors", "type": "PORTAL", "data": "", "severity": "warn" };
        var testEvent = service.getEvent("CE_ERROR", data);

        service.error(data);
        expect(service._dispatch).toHaveBeenCalledWith(testEvent);
    });

    it('should dispatch CE_API_CALL event', function() {
        spyOn(service, '_dispatch');

        var data = { "path": "https://dev.ekstep.in/api/search/v2/search", "method": "POST", "request": "{\"request\":{\"filters\":{\"objectType\":[\"Concept\"]},\"offset\":315,\"limit\":200}}", "response": "", "responseTime": 601, "status": 200, "uip": "" }
        var testEvent = service.getEvent("CE_API_CALL", data);

        service.apiCall(data);
        expect(service._dispatch).toHaveBeenCalledWith(testEvent);
    });

    it('should fail to initialize the service', function() {
        spyOn(window, 'addEventListener');
        service.addDispatcher(); //console
        service.initialize({
            uid: uid,
            sid: undefined,
            content_id: org.ekstep.contenteditor.api.getContext('contentId')
        });

        expect(service.initialized).toBe(false);
        expect(service.dispatchers.length).toBe(1);
        expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
        expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: {}, client: {} });

        service.addDispatcher();
        expect(service.dispatchers.length).toBe(1);
        service.end();
    });

    it('test all validations for the telemetry events', function() {

        spyOn(service, '_dispatch');
        spyOn(console, "error").and.callThrough();
        var data = { "env": "migration", "action": "log the error", "err": "migration has errors", "type": "PORTAL", "data": "", "severity": "warn" };
        service.error(service.getEvent("CE_ERROR", data));
        expect(service._dispatch).not.toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Invalid error data');

        var data = { "path": "https://dev.ekstep.in/api/search/v2/search", "method": "POST", "request": "{\"request\":{\"filters\":{\"objectType\":[\"Concept\"]},\"offset\":315,\"limit\":200}}", "response": "", "responseTime": 601, "status": 200, "uip": "" }
        service.apiCall(service.getEvent("CE_API_CALL", data));
        expect(service._dispatch).not.toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Invalid api call data');

        var data = { "type": "select", "subtype": "", "target": "plugin", "pluginid": "org.ekstep.image", "pluginver": "1.0", "objectid": "c10732bd-e548-4195-a7d5-4dc921a5599b", "stage": "4d0657d8-27ba-4e2c-b4a6-795202e4d754" };
        service.interact(service.getEvent("CE_INTERACT", data));
        expect(service._dispatch).not.toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Invalid interact data');

        var data = { "type": "add", "pluginid": "org.ekstep.image", "pluginver": "1.0", "objectid": "c10732bd-e548-4195-a7d5-4dc921a5599b", "stage": "4d0657d8-27ba-4e2c-b4a6-795202e4d754", "containerid": "", "containerplugin": "" };
        service.pluginLifeCycle(service.getEvent("CE_PLUGIN_LIFECYCLE", data));
        expect(service._dispatch).not.toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Invalid plugin lifecycle event data');

        var data = { "type": "add", "pluginid": "org.ekstep.image", "pluginver": "1.0", "objectid": "c10732bd-e548-4195-a7d5-4dc921a5599b", "stage": "4d0657d8-27ba-4e2c-b4a6-795202e4d754", "containerid": "", "containerplugin": "" };
        service.pluginLifeCycle(service.getEvent("CE_PLUGIN_LIFECYCLE", data));
        expect(service._dispatch).not.toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Invalid interact data');
    });        
});
