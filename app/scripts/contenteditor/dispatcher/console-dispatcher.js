org.ekstep.contenteditor.consoleDispatcher = new (org.ekstep.contenteditor.IDispatcher.extend({
	type: 'consoleDispatcher',
	initDispatcher: function () {},
	dispatch: function (event) {
		console.log(event)
	}
}))()
