describe('content editor integration test: ', function () {
	var originalTimeout
	jasmine.getEnv().defaultTimeoutInterval = 15000
	var corePlugins,
		canvas,
		cleanUp

	cleanUp = function () {
		org.ekstep.pluginframework.pluginManager.cleanUp()
		org.ekstep.contenteditor.stageManager.cleanUp()
		org.ekstep.contenteditor.toolbarManager.cleanUp()
	}

	beforeEach(function () {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
	})

	afterEach(function () {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
	})

	afterAll(function () {
		cleanUp()
	})

	beforeAll(function (done) {
		cleanUp()
		// org.ekstep.contenteditor.init();
		org.ekstep.contenteditor.globalContext = {}
		corePlugins = [
			{ 'id': 'org.ekstep.stage', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.shape', 'ver': '1.0', 'type': 'plugin' },
			{ 'id': 'org.ekstep.utils', 'ver': '1.0', 'type': 'plugin' }
		]

		// test plugins
		org.ekstep.contenteditor.config = {
			plugins: [
				{ 'id': 'org.ekstep.test1', 'ver': '1.0', 'type': 'plugin' },
				{ 'id': 'org.ekstep.test2', 'ver': '1.0', 'type': 'plugin' },
				{ 'id': 'org.ekstep.test3', 'ver': '1.0', 'type': 'plugin' }
			],
			corePlugins: ['text', 'audio', 'div', 'hotspot', 'image', 'shape', 'scribble', 'htext'],
			corePluginMapping: {
				'text': 'org.ekstep.text',
				'image': 'org.ekstep.image',
				'shape': 'org.ekstep.shape',
				'stage': 'org.ekstep.stage',
				'hotspot': 'org.ekstep.hotspot',
				'scribble': 'org.ekstep.scribblepad',
				'htext': 'org.ekstep.text',
				'audio': 'org.ekstep.audio'
			}
		}

		org.ekstep.contenteditor.config.useProxyForURL = false

		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}

		org.ekstep.services.telemetryService.initialize({
			uid: '346',
			sid: '',
			content_id: 'do_1121989168199106561309'
		}, 'console')

		org.ekstep.pluginframework.initialize({
			env: 'editor',
			pluginRepo: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins',
			build_number: undefined
		})

		// load core plugins from s3
		org.ekstep.pluginframework.pluginManager.loadAllPlugins(corePlugins, undefined, function () {
			org.ekstep.pluginframework.config.pluginRepo = 'base/test/data/published'
			done()
		})

		org.ekstep.contenteditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: '#FFFFFF', preserveObjectStacking: true, width: 720, height: 405 })
		org.ekstep.contenteditor.stageManager.registerEvents()
	})

	it('should register plugins with plugin manager', function (done) {
		spyOn(org.ekstep.pluginframework.resourceManager, 'discoverManifest').and.callThrough()
		spyOn(org.ekstep.pluginframework.publishedRepo, 'discoverManifest').and.callThrough()
		spyOn(org.ekstep.pluginframework.resourceManager, 'loadExternalResource').and.callThrough()

		org.ekstep.pluginframework.pluginManager.loadAllPlugins(org.ekstep.contenteditor.config.plugins, undefined, function () {
			expect(org.ekstep.pluginframework.resourceManager.discoverManifest).toHaveBeenCalled()
			expect(org.ekstep.pluginframework.resourceManager.discoverManifest.calls.count()).toEqual(3)
			expect(org.ekstep.pluginframework.publishedRepo.discoverManifest).toHaveBeenCalled()
			expect(org.ekstep.pluginframework.publishedRepo.discoverManifest.calls.count()).toEqual(3)
			expect(org.ekstep.pluginframework.resourceManager.loadExternalResource).toHaveBeenCalled()
			expect(org.ekstep.pluginframework.resourceManager.loadExternalResource.calls.count()).toEqual(2)
			expect(org.ekstep.pluginframework.pluginManager.plugins).not.toBe({})
			expect(Object.keys(org.ekstep.pluginframework.pluginManager.plugins).length).toEqual(7)
			_.forEach(org.ekstep.contenteditor.config.plugins, function (plugin) {
				expect(org.ekstep.pluginframework.pluginManager.isPluginDefined(plugin.id)).toBe(true)
				expect(org.ekstep.pluginframework.pluginManager.getPluginManifest(plugin.id)).toBeDefined()
			})
			done()
		})
	})

	it('should register menu', function () {
		var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.test1')
		spyOn(org.ekstep.contenteditor.toolbarManager, 'registerMenu').and.callThrough()
		org.ekstep.contenteditor.toolbarManager.registerMenu(manifest.editor.menu, manifest)
		expect(org.ekstep.contenteditor.toolbarManager.registerMenu).toHaveBeenCalled()
		expect(org.ekstep.contenteditor.toolbarManager.menuItems.length).toEqual(3)
	})

	it('should register context menu', function () {
		var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.utils')
		spyOn(org.ekstep.contenteditor.toolbarManager, 'registerContextMenu').and.callThrough()
		org.ekstep.contenteditor.toolbarManager.registerContextMenu(manifest.editor.menu, manifest)
		expect(org.ekstep.contenteditor.toolbarManager.registerContextMenu).toHaveBeenCalled()
		expect(org.ekstep.contenteditor.toolbarManager.contextMenuItems.length).toEqual(5)
	})

	it('should update context menu', function () {
		var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.utils')
		spyOn(org.ekstep.contenteditor.toolbarManager, 'updateContextMenu').and.callThrough()
		org.ekstep.contenteditor.toolbarManager.updateContextMenu(manifest.editor.menu)
		expect(org.ekstep.contenteditor.toolbarManager.updateContextMenu).toHaveBeenCalled()
	})

	it('should reset context menu', function () {
		spyOn(org.ekstep.contenteditor.toolbarManager, 'resetContextMenu').and.callThrough()
		org.ekstep.contenteditor.toolbarManager.resetContextMenu()
		expect(org.ekstep.contenteditor.toolbarManager.resetContextMenu).toHaveBeenCalled()
	})

	it('should setscope', function () {
		spyOn(org.ekstep.contenteditor.toolbarManager, 'setScope').and.callThrough()
		org.ekstep.contenteditor.toolbarManager.setScope(org.ekstep.contenteditor.api.getAngularScope())
		expect(org.ekstep.contenteditor.toolbarManager.setScope).toHaveBeenCalled()
		expect(org.ekstep.contenteditor.toolbarManager.scope).toBe(org.ekstep.contenteditor.api.getAngularScope())
	})

	describe('when stage plugin instantiated', function () {
		var stagePlugin = 'org.ekstep.stage'

		var stageInstance

		var stageECML

		var themeObjectWithSummaryPlugin

		var themeObjectWithoutSummaryPlugin

		var summaryTemplate

		beforeAll(function () {
			stageECML = {
				'config': {
					'__cdata': '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"genieControls":true,"instructions":""}'
				},
				'param': {
					'name': 'next',
					'value': 'splash'
				},
				'x': '0',
				'y': '0',
				'w': '100',
				'h': '100',
				'id': 'd2646852-8114-483b-b5e1-29e604b69cac',
				'rotate': ''
			}
			stageInstance = org.ekstep.contenteditor.api.instantiatePlugin(stagePlugin, _.cloneDeep(stageECML))

			themeObjectWithSummaryPlugin =  {'theme':{'compatibilityVersion':2,'id':'theme','manifest':{'media':[{'id':'org.ekstep.summary_template_js','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/summary-template.js','type':'js','ver':'1.0'},{'id':'org.ekstep.summary_template_css','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/style.css','type':'css','ver':'1.0'},{'id':'org.ekstep.summary','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/plugin.js','type':'plugin','ver':'1.0'},{'id':'org.ekstep.summary_manifest','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/manifest.json','type':'json','ver':'1.0'},{'assetId':'summaryImage','id':'summaryImage','preload':true,'src':'/content-plugins/org.ekstep.summary-1.0/assets/summary-icon.jpg','type':'image'}]},'plugin-manifest':{'depends':'','id':'org.ekstep.summary','type':'plugin','ver':'1.0'},'stage':{'config':{'__cdata':'{\'opacity\':100,\'strokeWidth\':1,\'stroke\':\'rgba(255, 255, 255, 0)\',\'autoplay\':false,\'visible\':true,\'color\':\'#FFFFFF\',\'genieControls\':false,\'instructions\':\'\'}'},'h':100,'id':'summary_stage_id','manifest':{'media':[{'assetId':'summaryImage'}]},'org.ekstep.summary':[{'config':{'__cdata':'{\'opacity\':100,\'strokeWidth\':1,\'stroke\':\'rgba(255, 255, 255, 0)\',\'autoplay\':false,\'visible\':true}'},'h':125.53,'id':'9aa63c0a-095a-4d67-991d-97c92b7e815a','rotate':0,'w':77.45,'x':6.69,'y':-27.9,'z-index':0}],'rotate':null,'w':100,'x':0,'y':0}}}
			themeObjectWithoutSummaryPlugin = {"theme":{"compatibilityVersion":2,"id":"theme","manifest":{"media":[]},"plugin-manifest":{"depends":"","id":"org.ekstep.summary","type":"plugin","ver":"1.0","plugin":[]},"stage":[]}}
			summaryTemplate = {'manifest':{'media':[{'id':'org.ekstep.summary_template_js','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/summary-template.js','type':'js','ver':'1.0'},{'id':'org.ekstep.summary_template_css','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/style.css','type':'css','ver':'1.0'},{'id':'org.ekstep.summary','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/renderer/plugin.js','type':'plugin','ver':'1.0'},{'id':'org.ekstep.summary_manifest','plugin':'org.ekstep.summary','src':'/content-plugins/org.ekstep.summary-1.0/manifest.json','type':'json','ver':'1.0'},{'assetId':'summaryImage','id':'org.ekstep.summary_summaryImage','preload':true,'src':'/content-plugins/org.ekstep.summary-1.0/assets/summary-icon.jpg','type':'image'}]},'pluginManifest':{'depends':'','id':'org.ekstep.summary','type':'plugin','ver':'1.0'},'stage':{'config':{'__cdata':'{\'opacity\':100,\'strokeWidth\':1,\'stroke\':\'rgba(255, 255, 255, 0)\',\'autoplay\':false,\'visible\':true,\'color\':\'#FFFFFF\',\'genieControls\':false,\'instructions\':\'\'}'},'h':100,'id':'summary_stage_id','manifest':{'media':[{'assetId':'summaryImage'}]},'org.ekstep.summary':[{'config':{'__cdata':'{\'opacity\':100,\'strokeWidth\':1,\'stroke\':\'rgba(255, 255, 255, 0)\',\'autoplay\':false,\'visible\':true}'},'h':125.53,'id':'9aa63c0a-095a-4d67-991d-97c92b7e815a','rotate':0,'w':77.45,'x':6.69,'y':-27.9,'z-index':0}],'rotate':null,'w':100,'x':0,'y':0}}
		})

		it('should add stage to theme', function () {
			var noOfStages = themeObjectWithoutSummaryPlugin.theme.stage.length
			var updatedThemeObj = org.ekstep.contenteditor.stageManager._appendPluginStage(themeObjectWithoutSummaryPlugin, summaryTemplate)
			expect(updatedThemeObj.theme.stage.length).toBe(noOfStages + 1)
			expect(updatedThemeObj.theme.stage[0]['org.ekstep.summary']).toBeDefined()
		})

		it('should remove stage from theme object', function () {
			var updatedThemeObj = org.ekstep.contenteditor.stageManager._removePluginStage(themeObjectWithSummaryPlugin, 'org.ekstep.summary')
			expect(updatedThemeObj.theme.stage[0]).not.toContain('org.ekstep.summary')
		})

		it('instance properties should be defined', function () {
			expect(stageInstance.id).toBeDefined()
			expect(stageInstance.manifest).toBeDefined()
			expect(stageInstance.attributes).toEqual(jasmine.objectContaining({ x: 0, y: 0, w: 720, h: 405, id: stageInstance.id }))
			expect(stageInstance.config).toEqual(jasmine.objectContaining({ 'opacity': 100, 'strokeWidth': 1, 'stroke': 'rgba(255, 255, 255, 0)', 'autoplay': false, 'visible': true, 'genieControls': true, 'instructions': '' }))
		})

		it('instance should not have children and parent', function () {
			expect(stageInstance.parent).toBeUndefined()
			expect(stageInstance.children.length).toBe(0)
		})

		it('should register stage event listeners', function () {
			expect(EventBus.hasEventListener('stage:create')).toBe(true)
			expect(EventBus.hasEventListener('object:modified')).toBe(true)
			expect(EventBus.hasEventListener('stage:modified')).toBe(true)
			expect(EventBus.hasEventListener('object:selected')).toBe(true)
			expect(EventBus.hasEventListener('object:removed')).toBe(true)
			expect(EventBus.hasEventListener('stage:select')).toBe(true)
			expect(stageInstance.onclick).toEqual({ id: 'stage:select', data: { stageId: stageInstance.id } })
			expect(stageInstance.ondelete).toEqual({ id: 'stage:delete', data: { stageId: stageInstance.id } })
			expect(stageInstance.duplicate).toEqual({ id: 'stage:duplicate', data: { stageId: stageInstance.id } })
		})

		it('on "stage:select" event, it should call stage manager selectStage method', function () {
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			org.ekstep.contenteditor.api.dispatchEvent('stage:select', { stageId: stageInstance.id })
			expect(org.ekstep.contenteditor.stageManager.currentStage.id).toBe(stageInstance.id)
			expect(org.ekstep.contenteditor.stageManager.currentStage.isSelected).toBe(true)
		})

		it('should dispatch "stage:add" event on Stage add', function () {
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			var newStageInstance = org.ekstep.contenteditor.api.instantiatePlugin(stagePlugin, _.cloneDeep(stageECML))
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:add', { stageId: newStageInstance.id, prevStageId: stageInstance.id })
		})

		it('on "stage:duplicate" event, it should call stage manager duplicateStage method', function () {
			spyOn(org.ekstep.contenteditor.stageManager, 'getStageIndex').and.returnValue(0)
			spyOn(org.ekstep.contenteditor.stageManager.stages[0], 'toECML').and.returnValue(_.cloneDeep(stageECML))
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			org.ekstep.contenteditor.api.dispatchEvent('stage:duplicate', { stageId: stageInstance.id })
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:create', jasmine.objectContaining({'position': 'afterCurrent', stageECML: jasmine.any(Object)}))
			expect(org.ekstep.contenteditor.stageManager.currentStage.isSelected).toBe(true)
		})

		it('on stage delete, it should dispatch event: "stage:removed"', function () {
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			spyOn(org.ekstep.contenteditor.stageManager, 'getStageIndex').and.returnValue(0)
			var noOfstages = org.ekstep.contenteditor.api.getAllStages().length
			org.ekstep.contenteditor.stageManager.deleteStage({}, { stageId: stageInstance.id })
			expect(org.ekstep.contenteditor.stageManager.stages.length).toBe(noOfstages - 1)
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:removed', { stageId: stageInstance.id })
		})

		it('on stage drag/drop it should dispacth event: "stage:reorder"', function () {
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			var firstStage = org.ekstep.contenteditor.api.getAllStages()[0]
			var secondStage = org.ekstep.contenteditor.api.getAllStages()[1]
			org.ekstep.contenteditor.stageManager.onStageDragDrop(secondStage.id, firstStage.id)
			expect(org.ekstep.contenteditor.api.getAllStages()[0].id).toBe(secondStage.id)
			expect(org.ekstep.contenteditor.api.getAllStages()[1].id).toBe(firstStage.id)
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:reorder', { stageId: secondStage.id, fromIndex: 1, toIndex: 0 })
		})

		it('addStageAt should return undefined', function () {
			spyOn(org.ekstep.contenteditor.stageManager, 'addStageAt').and.callThrough()
			var returnBeginningData = org.ekstep.contenteditor.stageManager.addStageAt([], 'beginning')
			expect(returnBeginningData).toBeUndefined()
			var returnNextData = org.ekstep.contenteditor.stageManager.addStageAt([], 'next')
			expect(returnNextData).toBeUndefined()
		})

		it('should return "" on _resolveManifestMediaPath method call', function () {
			spyOn(org.ekstep.contenteditor.stageManager, '_resolveManifestMediaPath').and.callThrough()
			spyOn(org.ekstep.pluginframework.pluginManager, 'resolvePluginResource').and.returnValue('dev.ekstep.in')
			var returnData = org.ekstep.contenteditor.stageManager._resolveManifestMediaPath()
			expect(returnData).toBeString()
		})

		it('on "stage:delete" event, it should call stage manager deleteConfirmationDialog method', function () {
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			spyOn(org.ekstep.contenteditor.stageManager, 'deleteConfirmationDialog').and.callThrough()
			org.ekstep.contenteditor.api.dispatchEvent('stage:delete')
			expect(org.ekstep.contenteditor.stageManager.currentStage.isSelected).toBe(true)
		})

		it('on mergeMediaMap method call', function () {
			spyOn(org.ekstep.contenteditor.stageManager, 'mergeMediaMap').and.callThrough()
			spyOn(org.ekstep.contenteditor.mediaManager, 'migratedMediaMap').and.returnValue([])
			org.ekstep.contenteditor.stageManager.mergeMediaMap([])
			expect(org.ekstep.contenteditor.stageManager.mergeMediaMap).toHaveBeenCalledTimes(1)
		})

		it('on mergeMediaMap method call', function () {
			spyOn(org.ekstep.contenteditor.stageManager, 'mergeMediaMap').and.callThrough()
			spyOn(org.ekstep.contenteditor.mediaManager, 'migratedMediaMap').and.returnValue([])
			org.ekstep.contenteditor.stageManager.mergeMediaMap([])
			expect(org.ekstep.contenteditor.stageManager.mergeMediaMap).toHaveBeenCalledTimes(1)
		})

		it('on addMediaToMediaMap method call', function () {
			spyOn(org.ekstep.contenteditor.stageManager, 'addMediaToMediaMap').and.callThrough()
			org.ekstep.contenteditor.stageManager.addMediaToMediaMap({'plugin': {'type': 'plugin'}}, {'plugin': 'plugin'})
			// expect(org.ekstep.contenteditor.stageManager.mergeMediaMap).toHaveBeenCalledTimes(1);
		})

		
	})

	describe('when test1 plugin instantiated', function () {
		var stagePlugin = 'org.ekstep.stage'

		var test1Plugin = 'org.ekstep.test1'

		var stageInstance

		var test1pluginInstance

		var stageECML

		var test1ECML

		beforeAll(function () {
			stageECML = {
				'config': {
					'__cdata': '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"genieControls":true,"instructions":""}'
				},
				'param': {
					'name': 'next',
					'value': 'splash'
				},
				'x': '0',
				'y': '0',
				'w': '100',
				'h': '100',
				'id': 'd2646852-8114-483b-b5e1-29e604b69cac',
				'rotate': ''
			}

			test1ECML = {
				'config': {
					'__cdata': '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"color":"#FFFF00"}'
				},
				'type': 'rect',
				'x': '10',
				'y': '20',
				'fill': '#FFFF00',
				'w': '14',
				'h': '25',
				'stroke': 'rgba(255, 255, 255, 0)',
				'strokeWidth': '1',
				'opacity': '1',
				'rotate': '0',
				'z-index': '0',
				'id': '2113ee4e-b090-458e-a0b0-5ee6668cb6dc'
			}
			stageInstance = org.ekstep.contenteditor.api.instantiatePlugin(stagePlugin, stageECML)
			stageInstance.setCanvas(canvas)
			spyOn(org.ekstep.contenteditor.api, 'getAngularScope').and.returnValue({ $safeApply: function () {}, toggleGenieControl: function () {} })
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent').and.callThrough()
			spyOn(org.ekstep.pluginframework.eventManager, 'dispatchEvent').and.callThrough()

			spyOn(org.ekstep.contenteditor.basePlugin.prototype, 'added').and.callThrough()
			spyOn(org.ekstep.contenteditor.basePlugin.prototype, 'selected').and.callThrough()
			test1pluginInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
		})

		afterAll(function () {
			org.ekstep.contenteditor.stageManager.canvas.clear()
		})

		it('instance properties should be defined', function () {
			expect(test1pluginInstance.id).toBeDefined()
			expect(test1pluginInstance.manifest).toBeDefined()
			expect(test1pluginInstance.getAttributes()).toBeDefined(jasmine.objectContaining({ type: 'rect', x: 72, y: 81, fill: '#FFFF00', w: 100.8, h: 101.25, stroke: 'rgba(255, 255, 255, 0)', strokeWidth: '1', opacity: '1', rotate: '0', 'z-index': '0', id: test1pluginInstance.id }))
			expect(test1pluginInstance.getConfig()).toEqual({ 'opacity': 100, 'strokeWidth': 1, 'stroke': 'rgba(255, 255, 255, 0)', 'autoplay': false, 'visible': true, 'color': '#FFFF00' })
		})

		it('should call added method', function () {
			expect(test1pluginInstance.added).toHaveBeenCalled()
		})

		it('should call selected method', function () {
			expect(test1pluginInstance.selected).toHaveBeenCalled()
		})

		it('instance should be added to plugin registery', function () {
			expect(org.ekstep.pluginframework.pluginManager.getPluginInstance(test1pluginInstance.id)).toBeDefined()
		})

		it('should fire plugin lifecycle event', function () {
			var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(test1Plugin)
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.objectContaining({ plugin: manifest.id, version: manifest.ver, instanceId: test1pluginInstance.id }))
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith(manifest.id + ':add')
		})

		it('instance editor object should be defined', function () {
			expect(test1pluginInstance.editorObj).toBeDefined()
		})

		it('stage instance should have test1 plugin instance as its children', function () {
			expect(stageInstance.children.length).toBe(1)
		})

		it('should fire stage modified event', function () {
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:modified', jasmine.objectContaining({ id: test1pluginInstance.id }))
		})

		it('should add menu to the toolbar', function () {
			var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest(test1Plugin)
			var getMenuIndex = _.findIndex(org.ekstep.contenteditor.toolbarManager.menuItems, function (menu) {
				return menu.id === manifest.editor.menu[0].id
			})
			expect(org.ekstep.contenteditor.toolbarManager.menuItems[getMenuIndex].id).toBe(manifest.editor.menu[0].id)
		})

		it('instance should give the ECML', function () {
			var pluginEcml = {
				'type': 'rect',
				'x': 10,
				'y': 20,
				'fill': '#FFFF00',
				'w': 13.86,
				'h': 24.75,
				'stroke': 'rgba(255, 255, 255, 0)',
				'strokeWidth': '1',
				'opacity': '1',
				'rotate': 0,
				'z-index': '0',
				'id': test1pluginInstance.id,
				'config': {
					'__cdata': '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"color":"#FFFF00"}'
				}
			}

			var ecml = test1pluginInstance.toECML()
			expect(ecml).toEqual(pluginEcml)
		})

		it('on copy/paste should create new instance', function () {
			spyOn(test1pluginInstance, 'getCopy')
			spyOn(org.ekstep.contenteditor.api, 'instantiatePlugin')

			org.ekstep.contenteditor.api.cloneInstance(test1pluginInstance)

			expect(test1pluginInstance.getCopy).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.instantiatePlugin).toHaveBeenCalled()
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith(test1pluginInstance.manifest.id + ':add')
		})

		it('on plugin instance delete, it should remove that instance', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var numberOfPluginInstance = Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length

			newInstance.remove()

			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('stage:modified', { id: newInstance.id })
			expect(org.ekstep.pluginframework.pluginManager.getPluginInstance(newInstance.id)).toBeUndefined()
			expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).toBe(numberOfPluginInstance - 1)
		})

		it('on editorObj delete, removed method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'remove').and.callThrough()

			org.ekstep.contenteditor.api.getCanvas().remove(newInstance.editorObj)

			expect(newInstance.remove).toHaveBeenCalled()
		})

		it('on editorObj modified, modified method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'changed').and.callThrough()

			newInstance.editorObj.trigger('modified')

			expect(newInstance.changed).toHaveBeenCalled()
		})

		it('on editorObj rotating, rotating method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'rotating').and.callThrough()

			newInstance.editorObj.trigger('rotating')

			expect(newInstance.rotating).toHaveBeenCalled()
		})

		it('on editorObj scaling, scaling method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'scaling').and.callThrough()

			newInstance.editorObj.trigger('scaling')

			expect(newInstance.scaling).toHaveBeenCalled()
		})

		it('on editorObj moving, moving method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'moving').and.callThrough()

			newInstance.editorObj.trigger('moving')

			expect(newInstance.moving).toHaveBeenCalled()
		})

		it('on editorObj skewing, skewing method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'skewing').and.callThrough()

			newInstance.editorObj.trigger('skewing')

			expect(newInstance.skewing).toHaveBeenCalled()
		})

		it('on editorObj remove, remove method should be called', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			spyOn(newInstance, 'remove').and.callThrough()

			newInstance.editorObj.trigger('removed')

			expect(newInstance.remove).toHaveBeenCalled()
		})

		it('instance can set its config', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance.setConfig({ supertext: true })

			expect(newInstance.config).toEqual({ supertext: true })
		})

		it('instance can set its data', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance.setData({ textStyle: 'bold', font: 'verdana' })

			expect(newInstance.data).toEqual({ textStyle: 'bold', font: 'verdana' })
		})

		it('instance can add events', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance.addEvent({ action: 'play' })
			expect(newInstance.getEvents()).toEqual([{ action: 'play' }])
		})

		it('instance can set its attribute', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance.setAttribute('animate', false)

			expect(_.has(newInstance.attributes, 'animate')).toBe(true)
		})

		it('on config changes, instance config properties should be set', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance._onConfigChange('opacity', 0.3)
			newInstance._onConfigChange('strokeWidth', 2)
			newInstance._onConfigChange('stroke', 1)
			newInstance._onConfigChange('autoplay', true)
			newInstance._onConfigChange('visible', false)

			expect(newInstance.config.opacity).toBe(0.3)
			expect(newInstance.config.strokeWidth).toBe(2)
			expect(newInstance.config.stroke).toBe(1)
			expect(newInstance.config.autoplay).toBe(true)
			expect(newInstance.config.visible).toBe(false)
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('object:modified', { target: newInstance.editorObj })
		})

		xit('instance can get its own help text', function (done) {
			var helpText
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			newInstance.getHelp(function (data) {
				helpText = data
				done()
			})

			expect(helpText).toBeDefined()
		})
		it('instance can get its displayName', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var displayName = newInstance.getDisplayName()
			expect(displayName).toEqual('Shape')
		})
		it('instance can get its own config manifest data', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var pluginManifest = newInstance.getConfigManifest()
			expect(pluginManifest.length).toEqual(3)
			var colorManifest = _.find(pluginManifest, {propertyName: 'color'})
			expect(colorManifest.dataType).toBe('colorpicker')

			var visibleManifest = _.find(pluginManifest, {propertyName: 'visible'})
			expect(visibleManifest.dataType).toBe('boolean')
		})

		it('instance can get relative URL of its own resource', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)

			expect(newInstance.relativeURL('editor/help.md')).toBe('base/test/data/published/org.ekstep.test1-1.0/editor/help.md')
		})

		it('instance copy should retutn its editorObj', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			expect(newInstance.doCopy()).toEqual(newInstance.editorObj)
		})

		it('instance can add its own children', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var child = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), newInstance)
			spyOn(newInstance, 'addChild').and.callThrough()
			newInstance.addChild(child)
			expect(newInstance.addChild).toHaveBeenCalled()
			expect(newInstance.children[0]).toEqual(child)
		})

		it('should create instance through an event "<PLUGIN-ID>:create"', function () {
			org.ekstep.contenteditor.stageManager.currentStage = stageInstance
			spyOn(org.ekstep.contenteditor.api, 'instantiatePlugin').and.callThrough()

			org.ekstep.contenteditor.api.dispatchEvent('org.ekstep.test1:create', _.cloneDeep(test1ECML))
			expect(org.ekstep.contenteditor.api.instantiatePlugin).toHaveBeenCalled()
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith('plugin:add', jasmine.any(Object))
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith('org.ekstep.test1:add')
		})

		it('instance can get its own properties', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var prop = newInstance.getProperties()
			// eslint-disable-next-line
			expect(prop.id).toBeDefined
			// eslint-disable-next-line
			expect(prop.x).toBeDefined
			// eslint-disable-next-line
			expect(prop.y).toBeDefined
			// eslint-disable-next-line
			expect(prop.w).toBeDefined
			// eslint-disable-next-line
			expect(prop.h).toBeDefined
			// eslint-disable-next-line
			expect(prop['z-index']).toBeDefined
			// eslint-disable-next-line
			expect(prop.rotate).toBeDefined
			// eslint-disable-next-line
			expect(prop.type).toBeDefined
		})

		it('instance can get renderer dimension in percentage', function () {
			var newInstance = org.ekstep.contenteditor.api.instantiatePlugin(test1Plugin, _.cloneDeep(test1ECML), stageInstance)
			var dims = newInstance.getRendererDimensions()
			expect(dims.x.toString()).toBe(test1ECML.x)
			expect(dims.y.toString()).toBe(test1ECML.y)
			// expect(dims.h.toString()).toBe(test1ECML.h); //pixel to percent rounding off issue
			// expect(dims.w.toString()).toBe(test1ECML.w);
			expect(dims.rotate.toString()).toBe(test1ECML.rotate)
		})

		// API test case starts

		it('should retrns the current stage', function () {
			spyOn(org.ekstep.contenteditor.api, 'getCurrentStage').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getCurrentStage()
			expect(org.ekstep.contenteditor.api.getCurrentStage).toHaveBeenCalled()
			expect(returnValue).toBeDefined()
		})

		it('should retrns the specified stage', function () {
			spyOn(org.ekstep.contenteditor.api, 'getStage').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getStage(stageInstance.id)
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled()
			expect(returnValue).toBeDefined()
		})

		it('should return currently selected active object on the canvas', function () {
			spyOn(org.ekstep.contenteditor.api, 'getCurrentObject').and.callThrough()
			spyOn(org.ekstep.contenteditor.api, 'getPluginInstance').and.callThrough()
			var currentObject = org.ekstep.contenteditor.api.getCurrentObject()
			var currentPluginObject = org.ekstep.contenteditor.api.getPluginInstance(currentObject.id)
			expect(org.ekstep.contenteditor.api.getCurrentObject).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.getPluginInstance).toHaveBeenCalled()
			expect(currentPluginObject).toBeDefined()
		})

		it('should return false there is no selected object on the canvas', function () {
			spyOn(org.ekstep.contenteditor.api, 'getCurrentObject').and.callThrough()
			org.ekstep.contenteditor.stageManager.canvas.deactivateAll().renderAll()
			org.ekstep.contenteditor.api.getCurrentObject()
			expect(org.ekstep.contenteditor.api.getCurrentObject).toHaveBeenCalled()
		})

		it('should retrns current group', function () {
			spyOn(org.ekstep.contenteditor.api, 'getEditorGroup').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getEditorGroup()
			expect(org.ekstep.contenteditor.api.getEditorGroup).toHaveBeenCalled()
			expect(returnValue).toBe(null)
		})

		it('should retrns current object on the fabric canvas', function () {
			spyOn(org.ekstep.contenteditor.api, 'getEditorObject').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getEditorObject()
			expect(org.ekstep.contenteditor.api.getEditorObject).toHaveBeenCalled()
			expect(returnValue).toBeDefined()
		})

		it('should refresh the canvas', function () {
			spyOn(org.ekstep.contenteditor.api, 'render').and.callThrough()
			org.ekstep.contenteditor.api.render()
			expect(org.ekstep.contenteditor.api.render).toHaveBeenCalled()
		})

		it('should return plugin instance', function () {
			spyOn(org.ekstep.contenteditor.api, 'getPlugin').and.callThrough()
			var pluginid = org.ekstep.contenteditor.api.getPlugin('org.ekstep.test1')
			expect(org.ekstep.contenteditor.api.getPlugin).toHaveBeenCalled()
			expect(pluginid).toBeDefined()
		})

		it('should adds a plugin instance to the manager', function () {
			spyOn(org.ekstep.pluginframework.pluginManager, 'addPluginInstance').and.callThrough()
			org.ekstep.contenteditor.api.addPluginInstance(test1pluginInstance)
			expect(org.ekstep.pluginframework.pluginManager.addPluginInstance).toHaveBeenCalledWith(test1pluginInstance)
		})

		it('should remove plugin instance by calling removePluginInstance', function () {
			var PIlength = Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length
			var lastPI = org.ekstep.pluginframework.pluginManager.pluginInstances[Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances)[0]]
			spyOn(org.ekstep.contenteditor.api, 'removePluginInstance').and.callThrough()
			org.ekstep.contenteditor.api.removePluginInstance(lastPI)
			expect(org.ekstep.contenteditor.api.removePluginInstance).toHaveBeenCalled()
			expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).not.toEqual(PIlength)
		})

		it('should get all stages', function () {
			var length = org.ekstep.contenteditor.stageManager.stages.length
			expect(org.ekstep.contenteditor.api.getAllStages().length).toEqual(length)
		})

		it('should copy of the given plugin object', function () {
			spyOn(org.ekstep.contenteditor.api, 'cloneInstance').and.callThrough()
			spyOn(org.ekstep.contenteditor.api, 'instantiatePlugin').and.callThrough()
			org.ekstep.contenteditor.api.cloneInstance(test1pluginInstance)
			expect(org.ekstep.contenteditor.api.cloneInstance).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.instantiatePlugin).toHaveBeenCalled()
			expect(test1pluginInstance.parent.id).toEqual(org.ekstep.contenteditor.api.getCurrentStage().id)
		})

		it('should call getStagePluginInstances without includeTypes (a)', function () {
			spyOn(org.ekstep.contenteditor.api, 'getStagePluginInstances').and.callThrough()
			spyOn(org.ekstep.contenteditor.api, 'getStage').and.returnValue(stageInstance)
			var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(stageInstance.id, null, ['org.ekstep.audio'], undefined)
			expect(returnValue.length).toBeGreaterThan(0)
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id)
		})

		it('should call getStagePluginInstances with includeTypes', function () {
			spyOn(org.ekstep.contenteditor.api, 'getStagePluginInstances').and.callThrough()
			spyOn(org.ekstep.contenteditor.api, 'getStage').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, ['org.ekstep.test2'], ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id])
			expect(returnValue.length).toBe(0)
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id)
		})

		it('should call getStagePluginInstances without excludeTypes and excludeIds', function () {
			spyOn(org.ekstep.contenteditor.api, 'getStagePluginInstances').and.callThrough()
			spyOn(org.ekstep.contenteditor.api, 'getStage').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, ['org.ekstep.test2'])
			expect(returnValue.length).toBe(0)
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.getStage).toHaveBeenCalledWith(org.ekstep.contenteditor.api.getCurrentStage().id)
		})

		it('should call getPluginInstances without includeTypes (b)', function () {
			spyOn(org.ekstep.contenteditor.api, 'getPluginInstances').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getPluginInstances(null, ['org.ekstep.shape'], [org.ekstep.contenteditor.api.getCurrentObject().id])
			expect(returnValue.length).toBeGreaterThan(0)
		})

		it('should call getPluginInstances without includeTypes (c)', function () {
			spyOn(org.ekstep.contenteditor.api, 'getPluginInstances').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getPluginInstances(['org.ekstep.test1'], ['org.ekstep.shape'], [org.ekstep.contenteditor.api.getCurrentObject().id])
			expect(returnValue.length).toBe(1)
		})

		it('should call getPluginInstances without excludeTypes and excludeIds', function () {
			spyOn(org.ekstep.contenteditor.api, 'getPluginInstances').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getPluginInstances(['org.ekstep.test1'])
			expect(returnValue.length).toBeGreaterThan(0)
		})

		it('should return help.md path by calling resolvePluginResource', function () {
			spyOn(org.ekstep.contenteditor.api, 'resolvePluginResource').and.callThrough()
			spyOn(org.ekstep.pluginframework.pluginManager, 'resolvePluginResource').and.callThrough()
			var src = org.ekstep.contenteditor.api.resolvePluginResource('org.ekstep.test2', '1.0', 'editor/help.md')
			expect(org.ekstep.pluginframework.pluginManager.resolvePluginResource).toHaveBeenCalled()
			expect(src).toBe('base/test/data/published/org.ekstep.test2-1.0/editor/help.md')
		})

		it('should return media object', function () {
			var audio = '{"asset" : "do_10095959","assetMedia" : {"id" : "do_10095959", "name" : "test ","preload" : "true","src : https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/1475505176audio_1475505049712.mp3","type" : "audio"}}'
			org.ekstep.contenteditor.mediaManager.mediaMap['do_10095959'] = audio
			spyOn(org.ekstep.contenteditor.api, 'getMedia').and.callThrough()
			var returnValue = org.ekstep.contenteditor.api.getMedia('do_10095959')
			expect(org.ekstep.contenteditor.api.getMedia).toHaveBeenCalled()
			expect(returnValue).toEqual(audio)
		})

		it('should return the plugins group array', function () {
			var canvas = org.ekstep.contenteditor.stageManager.canvas

			var group = new fabric.Group()
			group.add(org.ekstep.contenteditor.stageManager.canvas.getObjects()[0])
			group.add(org.ekstep.contenteditor.stageManager.canvas.getObjects()[1])
			canvas.setActiveGroup(group)
			canvas.add(group)
			spyOn(org.ekstep.contenteditor.api, 'getCurrentGroup').and.callThrough()
			expect(org.ekstep.contenteditor.api.getCurrentGroup().length).toEqual(2)
		})
		// API test case ends
	})

	describe('when new ECML content is loaded to framework', function () {
		var getPluginCount

		beforeAll(function (done) {
			console.log('-------STAGE MANAGER ECML TEST STARTS----- ')
			org.ekstep.pluginframework.pluginManager.pluginInstances = {}
			org.ekstep.contenteditor.stageManager.stages = []

			getPluginCount = function (plugin) {
				var pluginsCount
				pluginsCount = { // update the count based on the content: content can be found in ECMLContent.fixture.js
					'shape': 3,
					'media': 0,
					'total': 0,
					'stage': 3,
					'image': 0,
					'audio': 0,
					'text': 0
				}

				_.forIn(_.omit(pluginsCount, ['total', 'media']), function (value, key) {
					pluginsCount.total += value
				})

				return pluginsCount[plugin]
			}

			org.ekstep.contenteditor.api.setContext('contentId', 'do_112206722833612800186')

			spyOn(org.ekstep.contenteditor.api, 'getAngularScope').and.returnValue({ toggleGenieControl: function () {}, enableSave: function () {}, appLoadMessage: [], $safeApply: function () {} })
			spyOn(org.ekstep.contenteditor.stageManager, 'showLoadScreenMessage').and.returnValue(true)
			spyOn(org.ekstep.contenteditor.api, 'dispatchEvent')
			spyOn(org.ekstep.contenteditor.api, 'instantiatePlugin').and.callThrough()
			spyOn(org.ekstep.contenteditor.api._, 'isEmpty').and.returnValue(true)
			spyOn(org.ekstep.contenteditor.stageManager, 'onContentLoad').and.callThrough()
			spyOn(org.ekstep.pluginframework.eventManager, 'dispatchEvent')
			spyOn(org.ekstep.contenteditor.stageManager, 'registerEvents').and.callThrough()
			spyOn(org.ekstep.services.telemetryService, 'start').and.callThrough()

			setTimeout(function () {
				done()
			}, 3000)
			// eslint-disable-next-line
			org.ekstep.contenteditor.stageManager.fromECML(JSON.parse(contentResponse.result.content.body), contentResponse.result.content.stageIcons);

			(function initTelemetry () {
				org.ekstep.services.telemetryService.initialize({
					uid: '346',
					sid: '',
					content_id: org.ekstep.contenteditor.api.getContext('contentId')
				}, 'console')
			})()
		})

		afterAll(function () {
			org.ekstep.contenteditor.stageManager.canvas.clear()
			console.log('-------STAGE MANAGER ECML TEST ENDS----- ')
		})

		it('should call instantiate stage and plugin', function () {
			expect(org.ekstep.contenteditor.api.instantiatePlugin).toHaveBeenCalled()
			expect(org.ekstep.contenteditor.api.instantiatePlugin.calls.count()).toEqual(getPluginCount('total'))
		})

		xit('should dispatch telemetry "CE_START" event', function () {
			expect(org.ekstep.services.telemetryService.start).toHaveBeenCalled()
			expect(org.ekstep.services.telemetryService.start.calls.count()).toBe(1)
		})

		it('stage manager should have stage defined', function () {
			expect(org.ekstep.contenteditor.stageManager.stages.length).toBe(getPluginCount('stage'))
		})

		it('plugin manager should have plugin instances', function () {
			expect(Object.keys(org.ekstep.pluginframework.pluginManager.pluginInstances).length).toBe(getPluginCount('total'))
		})

		it('should call stage manager onContentLoad method', function () {
			expect(org.ekstep.contenteditor.stageManager.onContentLoad).toHaveBeenCalled()
		})

		it('should register stage manager events', function () {
			expect(org.ekstep.contenteditor.stageManager.registerEvents).toHaveBeenCalled()
		})

		it('after content load: should enable the event bus', function () {
			expect(org.ekstep.pluginframework.eventManager.enableEvents).toBe(true)
		})

		it('after content load: should fire "content:load:complete" event', function () {
			expect(org.ekstep.contenteditor.api.dispatchEvent).toHaveBeenCalledWith('content:load:complete')
		})

		// moved this logic to editor state plugin
		xit('after content load: should fire select stage event', function () {
			expect(org.ekstep.pluginframework.eventManager.dispatchEvent).toHaveBeenCalledWith('stage:select', { stageId: org.ekstep.contenteditor.stageManager.stages[0].id })
		})

		it('should give back the ECML', function () {
			org.ekstep.contenteditor.stageManager.thumbnails = {};
			var getEcmlPluginCount; var ecml = org.ekstep.contenteditor.stageManager.toECML()

			getEcmlPluginCount = function (plugin) {
				var count = 0
				_.forEach(ecml.theme.stage, function (stage) {
					if (stage[plugin] && stage[plugin].length) count += stage[plugin].length
				})
				return count
			}

			expect(ecml.theme.version).toBe('1.0')
			expect(ecml.theme.startStage).toBeDefined()
			expect(ecml.theme.stage.length).toBe(getPluginCount('stage'))
			expect(ecml.theme.manifest.media.length).toBe(getPluginCount('media'))
			expect(getEcmlPluginCount('shape')).toBe(getPluginCount('shape'))
			// expect(getEcmlPluginCount('image')).toBe(getPluginCount('image'));
			// expect(getEcmlPluginCount('audio')).toBe(getPluginCount('audio'));

			var stage1 = _.find(ecml.theme.stage, { id: '4d0657d8-27ba-4e2c-b4a6-795202e4d754' })
			expect(stage1.manifest).toBeDefined()
			expect(stage1.manifest.media).toBeDefined()
			expect(stage1.manifest.media.length).toBe(0)

			var stage2 = _.find(ecml.theme.stage, { id: '9701579a-029a-4466-818c-630321926a3e' })
			expect(stage2.manifest).toBeDefined()
			expect(stage2.manifest.media).toBeDefined()
			expect(stage2.manifest.media.length).toBe(0)
			// expect(stage2.manifest.media[0].assetId).toBe('do_112193622951706624125');

			var stage3 = _.find(ecml.theme.stage, { id: '5d075bd1-d1c9-499b-87e9-d2bcdbb51786' })
			expect(stage3.manifest).toBeDefined()
			expect(stage3.manifest.media).toBeDefined()
			expect(stage3.manifest.media.length).toBe(0)
			// expect(stage3.manifest.media[0].assetId).toBe('do_1121989168199106561309');

			// 1. Duplicate assets within a stage
			// 2. Plugin, js and css should also be in the manifest
			// 3. Enhance the test data to also contain quiz plugin
		})

		it('should generate stageIcons when toECML', function () {
			expect(Object.keys(org.ekstep.contenteditor.stageManager.getStageIcons()).length).toBe(getPluginCount('stage'))
		})
	})
})
