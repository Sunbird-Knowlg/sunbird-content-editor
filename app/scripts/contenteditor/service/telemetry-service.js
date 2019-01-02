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
org.ekstep.services.telemetryService = new (org.ekstep.services.iService.extend({
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
	initialize: function (context, dispatcher) {
		var instance = this
		this.context = context
		/* istanbul ignore else */
		if (this.context.cdata === undefined) {
			this.context.cdata = []
		}
		if ((this.context.uid === undefined) || (this.context.sid === undefined) || (this.context.content_id === undefined)) {
			console.error('Unable to instantiate telemetry service')
			this.initialized = false
		}
		this.addDispatcher(dispatcher)

		window.addEventListener('unload', /* istanbul ignore next */ function () {
			instance.end()
		})
		this.startEventData = { defaultPlugins: Object.keys(org.ekstep.pluginframework.pluginManager.plugins), loadtimes: {}, client: {} }
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
	startEvent: function (autopublish) {
		var instance = this
		return {
			duration: function (time) {
				instance.contentLoadTime += parseInt(time)
				if (autopublish) instance.start()
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
	getDispatcher: function (dispatcherId) {
		switch (dispatcherId) {
		case 'local':
			return org.ekstep.contenteditor.localDispatcher
		case 'piwik':
			return org.ekstep.contenteditor.piwikDispatcher
		default:
			return org.ekstep.contenteditor.consoleDispatcher
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
	addDispatcher: function (dispatcherId) {
		var dispatcher = this.getDispatcher(dispatcherId)
		var dispatcherExist = this.dispatchers.find(function (obj) {
			return obj.type === dispatcher.type
		})
		if (!dispatcherExist) this.dispatchers.push(dispatcher)
	},
	/**
     *
     * dispatch event to all registered dipatchers
     * @private
     * @param message {event} structured event
     * @memberof org.ekstep.services.telemetryService
     *
     */
	_dispatch: function (message) {
		if (this.initialized) {
			message.mid = 'CE:' + CryptoJS.MD5(JSON.stringify(message)).toString()
			_.forEach(this.dispatchers, function (dispatcher) {
				dispatcher.dispatch(message)
			})
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
	getEvent: function (eventId, data) {
		return {
			'eid': eventId,
			'mid': '',
			'ets': (new Date()).getTime(),
			'channel': this.context.channel,
			'ver': '2.1',
			'pdata': this.context.pdata,
			'cdata': this.context.cdata,
			'uid': this.context.uid, // uuid of the requester
			'context': { 'sid': this.context.sid, 'content_id': this.context.content_id },
			'rid': '', // Leave blank.
			'edata': { 'eks': data },
			'etags': this.context.etags

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
	hasRequiredData: function (data, mandatoryFields) {
		var isValid = true
		mandatoryFields.forEach(function (key) {
			if (!data.hasOwnProperty(key)) isValid = false
		})
		return isValid
	},
	interactRequiredFields: ['type', 'subtype', 'target', 'pluginid', 'pluginver', 'objectid', 'stage'],
	lifecycleRequiredFields: ['type', 'pluginid', 'pluginver', 'objectid', 'stage'],
	errorRequiredFields: ['env', 'stage', 'action', 'err', 'type', 'data', 'severity', 'objectid', 'objecttype'],
	apiCallRequiredFields: ['path', 'method', 'request', 'response', 'responseTime', 'status', 'uip'],
	/**
     *
     * dispatches interact event (CE_INTERACT)
     * @param data {object} interact event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	interact: function (data) {
		if (!(data.hasOwnProperty('type') && (data.hasOwnProperty('objectid') || data.hasOwnProperty('id')))) {
			console.error('Invalid interact data')
			return
		}
		var eventData = {
			'type': data.type,
			'id': data.id || data.objectid
		}
		// for V3 implementation
		if (data.extra) { eventData.extra = data.extra }
		if (data.subtype) { eventData.subtype = data.subtype }
		if (data.pageid || data.stage) { eventData.pageid = data.pageid || data.stage }
		// converting plugin, tareget for v3 from v2 data
		eventData.plugin = data.plugin ? data.plugin : { 'id': data.pluginid, 'ver': data.pluginver }
		if (data.target && _.isObject(data.target)) {
			eventData.target = data.target
		} else {
			// converting target for v3 from v2 data
			eventData.target = {
				'id': data.target || data.stage || '',
				'ver': '',
				'type': ''
			}
		}
		ecEditor.dispatchEvent('org.ekstep.editor:keepalive')
		EkTelemetry.interact(eventData)
	},
	/**
     *
     * dispatches impression event (CE_IMPRESSION)
     * @param data {object} impression event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	impression: function (data) {
		if (!(data.hasOwnProperty('type') && data.hasOwnProperty('pageid') && data.hasOwnProperty('uri'))) {
			console.error('Invalid impression data')
			return
		}
		var eventData = {
			'type': data.type,
			'pageid': data.pageid,
			'uri': data.uri
		}
		if (data.subtype) { eventData.subtype = data.subtype }
		if (data.visits) { eventData.visits = data.visits }
		ecEditor.dispatchEvent('org.ekstep.editor:keepalive')
		EkTelemetry.impression(eventData)
	},
	/**
     *
     * dispatches end event (CE_END)
     * @memberof org.ekstep.services.telemetryService
     *
     */
	end: function () {
		var editorConfig = _.get(ecEditor.getConfig('editorConfig'), 'mode')
		var mode = (editorConfig && (editorConfig.toLowerCase() === 'read' ? 'view' : editorConfig)) || 'edit'
		EkTelemetry.end({
			'type': ecEditor.getConfig('editorType') || 'content',
			'mode': mode.toLowerCase(),
			'pageid': 'main-page'
		})
	},
	/**
     *
     * dispatches plugin lifecycle event (CE_PLUGIN_LIFECYCLE)
     * @param data {object} plugin lifecycle event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	pluginLifeCycle: function (data) {
		if (!(data.hasOwnProperty('type') && (data.hasOwnProperty('objectid') || data.hasOwnProperty('id')))) {
			console.error('Invalid plugin lifecycle event data')
			return
		}
		this.interact(data)
	},
	/**
     *
     * dispatches error event (CE_ERROR)
     * @param data {object} error event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	error: function (data) {
		if (!(data.hasOwnProperty('err') && (data.hasOwnProperty('type') || data.hasOwnProperty('errtype')) && (data.hasOwnProperty('data') || data.hasOwnProperty('stacktrace')))) {
			console.error('Invalid error data')
			return
		}
		var eventData = {
			'err': data.err && data.err.toString(),
			'errtype': data.type || data.errtype,
			'stacktrace': data.data || data.stacktrace
		}
		// for V3 implementation
		if (data.pageid || data.stage) { eventData.pageid = data.stage || data.pageid }
		if (data.plugin) { eventData.plugin = data.plugin }
		if (data.object) {
			eventData.object = data.object
		} else {
			if (data.objectid && data.objecttype) {
				eventData.object = { 'id': data.objectid, 'type': data.objecttype }
			}
		}
		ecEditor.dispatchEvent('org.ekstep.editor:keepalive')
		EkTelemetry.error(eventData)
	},
	/**
     *
     * dispatches start event (CE_START)
     * @memberof org.ekstep.services.telemetryService
     *
     */
	start: function (durartion) {
		var instance = this
		var fp = new Fingerprint2()
		var pdata = ecEditor.getContext('pdata') ? ecEditor.getContext('pdata') : {id: 'in.ekstep', ver: '1.0'}
		var env = ecEditor.getContext('env') || 'contenteditor'
		if (env) {
			switch (env) {
			case 'genericeditor':
			case 'contenteditor':
				// eslint-disable-next-line
				env = env
				break
			default:
				env = 'collectioneditor'
				break
			}
		}
		pdata.pid = pdata.pid ? pdata.pid + '.' + env : env
		ecEditor.setContext('pdata', pdata)
		var pkgVersion = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId')).pkgVersion
		var config = {
			uid: ecEditor.getContext('uid'),
			sid: ecEditor.getContext('sid'),
			channel: ecEditor.getContext('channel') || 'in.ekstep',
			pdata: pdata,
			env: ecEditor.getContext('env') || 'contenteditor',
			dispatcer: org.ekstep.contenteditor.config.dispatcher,
			object: {
				id: ecEditor.getContext('contentId'),
				type: 'Content',
				ver: !_.isUndefined(pkgVersion) ? pkgVersion.toString() : '0'
			},
			dispatcher: instance.getDispatcher(org.ekstep.contenteditor.config.dispatcher),
			rollup: ecEditor.getContext('rollup') || {},
			enableValidation: ecEditor.getConfig('enableTelemetryValidation')
		}

		if (ecEditor.getContext('tags')) {
			config.tags = ecEditor.getContext('tags')
		} else {
			config.tags = _.flattenDeep(_.values(ecEditor.getContext('etags')))
		}
		if (ecEditor.getContext('did')) {
			config.did = ecEditor.getContext('did')
			instance.logStartAndImpression(config, durartion)
		} else {
			fp.get(function (result) {
				config.did = result.toString()
				instance.logStartAndImpression(config, durartion)
			})
		}
		window.addEventListener('unload', /* istanbul ignore next */ function () {
			instance.end()
		})
	},
	logStartAndImpression: function (config, duration) {
		var instance = this
		var editorConfig = _.get(ecEditor.getConfig('editorConfig'), 'mode')
		var mode = (editorConfig && (editorConfig.toLowerCase() === 'read' ? 'view' : editorConfig)) || 'edit'
		EkTelemetry.start(config, org.ekstep.contenteditor.api.getContext('contentId'), '', {
			'uaspec': instance.detectClient(),
			'type': ecEditor.getConfig('editorType') || 'content',
			'mode': mode.toLowerCase(),
			'duration': (duration * 0.001), // Converting miliseconds to seconds.
			'pageid': 'main-page'
		})
		EkTelemetry.impression({
			type: mode,
			pageid: ecEditor.getContext('env') || 'contenteditor',
			uri: encodeURIComponent(location.href)
		})
	},
	/**
     *
     * dispatches api call event (CE_API_CALL)
     * @param data {object} api call event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	apiCall: function (data) {
		if (!this.hasRequiredData(data, this.apiCallRequiredFields)) {
			console.error('Invalid api call data')
			return
		}
		if (!data.level) {
			if (data.status === 'error') {
				data.level = 'ERROR'
				data.message = 'Unable to fetch!'
			} else {
				data.level = 'INFO'
				data.message = ''
			}
		}
		var eventData = {
			'type': 'api_call',
			'level': data.level,
			'message': data.message,
			'params': [data],
			'pageid': data.stage || data.pageid || ecEditor.getContext('env') || ''
		}
		EkTelemetry.log(eventData)
	},
	/**
     *
     * dispatches log event
     * @param data {object} log event data
     * @memberof org.ekstep.services.telemetryService
     *
     */
	log: function (data) {
		if (!this.hasRequiredData(data, ['type', 'level', 'message'])) {
			console.error('Invalid log data')
			return
		}
		var eventData = {
			'type': data.type,
			'level': data.level,
			'message': data.message
		}
		// for V3 implementation
		if (data.pageid || data.stage) { eventData.pageid = data.stage || data.pageid }
		if (data.params) { eventData.params = data.params }
		ecEditor.dispatchEvent('org.ekstep.editor:keepalive')
		EkTelemetry.log(eventData)
	},
	/**
     *
     * returns client machine info such as OS, browser, browser version
     * @memberof org.ekstep.services.telemetryService
     *
     */
	detectClient: function () {
		var nAgt = navigator.userAgent
		var browserName = navigator.appName
		var fullVersion = '' + parseFloat(navigator.appVersion)
		var verOffset, ix

		// In Opera
		/* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
		if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
			browserName = 'opera'
			fullVersion = nAgt.substring(verOffset + 6)
			if ((verOffset = nAgt.indexOf('Version')) !== -1) { fullVersion = nAgt.substring(verOffset + 8) }
		} else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) { // In MSIE
			browserName = 'IE'
			fullVersion = nAgt.substring(verOffset + 5)
		} else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) { // In Chrome
			browserName = 'chrome'
			fullVersion = nAgt.substring(verOffset + 7)
		} else if ((verOffset = nAgt.indexOf('Safari')) !== -1) { // In Safari
			browserName = 'safari'
			fullVersion = nAgt.substring(verOffset + 7)
			if ((verOffset = nAgt.indexOf('Version')) !== -1) { fullVersion = nAgt.substring(verOffset + 8) }
		} else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) { // In Firefox
			browserName = 'firefox'
			fullVersion = nAgt.substring(verOffset + 8)
		}

		// trim the fullVersion string at semicolon/space if present
		/* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
		if ((ix = fullVersion.indexOf(';')) !== -1) { fullVersion = fullVersion.substring(0, ix) }
		/* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
		if ((ix = fullVersion.indexOf(' ')) !== -1) { fullVersion = fullVersion.substring(0, ix) }

		return {agent: browserName, ver: fullVersion, system: navigator.platform, platform: '', raw: navigator.userAgent}
	}
}))()
