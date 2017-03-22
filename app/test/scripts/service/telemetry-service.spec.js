'use strict';

describe('telemetry service', function() {
    var uid, service = EkstepEditor.telemetryService;

    beforeAll(function() {
        service.dispatchers = [];
        uid = "346";
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
        EkstepEditor.toolbarManager.cleanUp();
    });

    it('should initialize the service', function() {
        var dispatcher = "local";
        spyOn(window, 'addEventListener');

        service.initialize({
            uid: uid,
            sid: "",
            content_id: EkstepEditorAPI.globalContext.contentId
        }, dispatcher);

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
        expect(service.getDispatcher("local")).toBe(EkstepEditor.localDispatcher);
        expect(service.getDispatcher("piwik")).toBe(EkstepEditor.piwikDispatcher);
        expect(service.getDispatcher()).toBe(EkstepEditor.consoleDispatcher);
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
        expect(empty_event.context).toEqual({ "sid": "", "content_id": EkstepEditorAPI.globalContext.contentId });
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
});
