'use strict'

describe('telemetry service', function () {
	var uid; var service = org.ekstep.services.telemetryService

	beforeAll(function () {
		service.dispatchers = []
		uid = '346'
		org.ekstep.pluginframework.pluginManager.cleanUp()
		org.ekstep.contenteditor.stageManager.cleanUp()
		org.ekstep.contenteditor.toolbarManager.cleanUp()
		spyOn(window, 'Date').and.returnValue({getTime: function () { return 100 }})
	})

	it('should initialize the service', function () {
		// spyOn(window, 'addEventListener').and.callThrough(); //addEventListener not called from PhantomJS
		service.addDispatcher() // console
		service.initialize({
			uid: uid,
			sid: '',
			content_id: org.ekstep.contenteditor.api.getContext('contentId'),
			etags: {},
			channel: '',
			pdata: {}
		})

		expect(service.initialized).toBe(true)
		expect(service.dispatchers.length).toBe(1)
		// expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
		// expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: {}, client: {} });
	})

	it('should add dispatcher', function () {
		service.dispatchers = []
		service.addDispatcher('piwik')
		expect(service.dispatchers.pop().type).toBe('piwikDispatcher')
	})

	it('should get dispatcher', function () {
		expect(service.getDispatcher('local')).toBe(org.ekstep.contenteditor.localDispatcher)
		expect(service.getDispatcher('piwik')).toBe(org.ekstep.contenteditor.piwikDispatcher)
		expect(service.getDispatcher()).toBe(org.ekstep.contenteditor.consoleDispatcher)
	})

	it('should append plugin and content load time to startEvent', function () {
		spyOn(service, 'start')
		service.startEvent().duration(100)
		service.startEvent(true).duration(100)
		// expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: { plugins: 100, contentLoad: 100 }, client: {} });
		expect(service.start).toHaveBeenCalled()
	})

	it('should get event template', function () {
		var emptyEvent = service.getEvent('CE_TEST', {})
		console.log('emptyEvent', emptyEvent)
		expect(emptyEvent.eid).toBe('CE_TEST')
		expect(emptyEvent.ets).toBeDefined()
		expect(emptyEvent.ver).toBe('2.1')
		expect(emptyEvent.pdata).toEqual({})
		expect(emptyEvent.cdata).toEqual([])
		expect(emptyEvent.context).toEqual({ 'sid': '', 'content_id': org.ekstep.contenteditor.api.getContext('contentId') })
		expect(emptyEvent.rid).toBe('')
		expect(emptyEvent.edata).toEqual({ 'eks': {} })
		expect(emptyEvent.etags).toEqual({})
	})

	xit('should dispatch START event', function () {
		spyOn(EkTelemetry, 'start')

		service.start()
		expect(EkTelemetry.start).toHaveBeenCalled()
	})

	it('should dispatch END event', function () {
		spyOn(EkTelemetry, 'end')

		service.end()
		expect(EkTelemetry.end).toHaveBeenCalled()
	})

	it('should dispatch PLUGIN_LIFECYCLE/INTERACT event', function () {
		spyOn(service, 'interact')

		var data = { 'type': 'add', 'pluginid': 'org.ekstep.image', 'pluginver': '1.0', 'objectid': 'c10732bd-e548-4195-a7d5-4dc921a5599b', 'stage': '4d0657d8-27ba-4e2c-b4a6-795202e4d754', 'containerid': '', 'containerplugin': '' }
		service.pluginLifeCycle(data)
		expect(service.interact).toHaveBeenCalled()
	})

	it('should dispatch INTERACT event', function () {
		spyOn(EkTelemetry, 'interact')
		// V2 data
		var data = { 'type': 'select', 'subtype': '', 'target': 'plugin', 'pluginid': 'org.ekstep.image', 'pluginver': '1.0', 'objectid': 'c10732bd-e548-4195-a7d5-4dc921a5599b', 'stage': '4d0657d8-27ba-4e2c-b4a6-795202e4d754' }
		service.interact(data)
		// V3 data
		var dataObj = {
			'type': 'CLICK',
			'subtype': 'select',
			'id': 'plugin',
			'pageid': '55740973-d2c0-453a-9b35-abd732a71db2',
			'target': {
				'id': '0ab7d536-e8c6-40e3-a9e4-ce6b78655615',
				'type': 'plugin'
			},
			'plugin': {
				'id': 'org.ekstep.stage',
				'ver': '1.0'
			},
			'extra': {}
		}
		service.interact(dataObj)
		expect(EkTelemetry.interact).toHaveBeenCalled()
	})

	it('should dispatch IMPRESSION event', function () {
		spyOn(EkTelemetry, 'impression')
		// V2 data
		var data = {'eks': {'stageid': 'stage1', 'stageto': 'stage2', 'type': '', 'itype': ''}}
		service.impression(data)
		// V3 data
		var dataObj = {
			'type': 'view',
			'subtype': 'scroll',
			'pageid': '55740973-d2c0-453a-9b35-abd732a71db2',
			'uri': 'https://qa.ekstep.in/',
			'visits': [{'objid': 'obj', 'objtype': 'type'}]
		}
		service.impression(dataObj)
		expect(EkTelemetry.impression).toHaveBeenCalled()
	})

	it('should dispatch ERROR event', function () {
		spyOn(EkTelemetry, 'error')

		var data = { 'env': 'content', 'stage': '55740973-d2c0-453a-9b35-abd732a71db2', 'action': 'migration', 'objectid': '', 'objecttype': '', 'err': 'migration has errors', 'type': 'PORTAL', 'data': 'migration has errors', 'severity': 'error' }
		service.error(data)

		var dataObj = {
			'err': 'migration has errors',
			'errtype': 'PORTAL',
			'stacktrace': 'migration has errors',
			'pageid': '55740973-d2c0-453a-9b35-abd732a71db2',
			'plugin': {
				'id': 'org.ekstep.stage',
				'ver': '1.0'
			},
			'object': {
				'id': '55740973-d2c0-453a-9b35-abd732a71db2',
				'type': 'plugin',
				'ver': '1.0'
			}
		}
		service.error(dataObj)
		expect(EkTelemetry.error).toHaveBeenCalled()
	})

	it('should dispatch LOG event', function () {
		spyOn(EkTelemetry, 'log')

		var dataObj = {
			'type': 'api_access',
			'level': 'INFO',
			'message': 'API access',
			'pageid': '55740973-d2c0-453a-9b35-abd732a71db2',
			'params': {
				'id': 'org.ekstep.stage',
				'ver': '1.0'
			}
		}
		service.log(dataObj)
		expect(EkTelemetry.log).toHaveBeenCalled()
	})

	it('should dispatch API_CALL/LOG event', function () {
		spyOn(EkTelemetry, 'log')

		var data = { 'path': 'https://dev.ekstep.in/api/search/v2/search', 'method': 'POST', 'request': '{"request":{"filters":{"objectType":["Concept"]},"offset":315,"limit":200}}', 'response': '', 'responseTime': 601, 'status': 200, 'uip': '' }

		service.apiCall(data)
		expect(EkTelemetry.log).toHaveBeenCalled()
	})

	it('should fail to initialize the service', function () {
		// spyOn(window, 'addEventListener').and.callThrough();
		service.addDispatcher() // console
		service.initialize({
			uid: uid,
			sid: undefined,
			content_id: org.ekstep.contenteditor.api.getContext('contentId')
		})

		expect(service.initialized).toBe(false)
		expect(service.dispatchers.length).toBe(1)
		// expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
		// expect(service.startEvent().getData()).toEqual({ defaultPlugins: [], loadtimes: {}, client: {} });

		service.addDispatcher()
		expect(service.dispatchers.length).toBe(1)
		service.end()
	})

	it('test all validations for the telemetry events', function () {
		spyOn(service, '_dispatch')
		spyOn(console, 'error').and.callThrough()
		var data = { 'env': 'migration', 'action': 'log the error', 'err': 'migration has errors' }
		service.error(data)
		expect(service._dispatch).not.toHaveBeenCalledWith()
		expect(console.error).toHaveBeenCalledWith('Invalid error data')

		var apiDataObj = { 'path': 'https://dev.ekstep.in/api/search/v2/search', 'method': 'POST', 'request': '{"request":{"filters":{"objectType":["Concept"]},"offset":315,"limit":200}}', 'response': '', 'responseTime': 601, 'status': 200 }
		service.apiCall(apiDataObj)
		expect(service._dispatch).not.toHaveBeenCalledWith()
		expect(console.error).toHaveBeenCalledWith('Invalid api call data')

		var interactData = { 'type': 'select', 'subtype': '', 'target': 'plugin', 'pluginid': 'org.ekstep.image', 'pluginver': '1.0', 'stage': '4d0657d8-27ba-4e2c-b4a6-795202e4d754' }
		service.interact(interactData)
		expect(service._dispatch).not.toHaveBeenCalledWith()
		expect(console.error).toHaveBeenCalledWith('Invalid interact data')

		var lifeCycleData = { 'type': 'add', 'pluginid': 'org.ekstep.image', 'pluginver': '1.0', 'stage': '4d0657d8-27ba-4e2c-b4a6-795202e4d754', 'containerid': '', 'containerplugin': '' }
		service.pluginLifeCycle(lifeCycleData)
		expect(service._dispatch).not.toHaveBeenCalledWith()
		expect(console.error).toHaveBeenCalledWith('Invalid plugin lifecycle event data')

		var logData = { 'type': 'add', 'pluginid': 'org.ekstep.image', 'pluginver': '1.0', 'stage': '4d0657d8-27ba-4e2c-b4a6-795202e4d754', 'containerid': '', 'containerplugin': '' }
		service.log(logData)
		expect(service._dispatch).not.toHaveBeenCalledWith()
		expect(console.error).toHaveBeenCalledWith('Invalid log data')
	})
})
