org.ekstep.contenteditor.IDispatcher = Class.extend({
	init: function () {
		this.initDispatcher()
	},
	// eslint-disable-next-line
	initDispatcher: function () { throw 'Subclass should implement initDispatcher' },
	// eslint-disable-next-line
	dispatch: function (event) { throw 'Subclass should implement dispatch' }
})
