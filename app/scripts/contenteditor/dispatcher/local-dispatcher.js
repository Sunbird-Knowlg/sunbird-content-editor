org.ekstep.contenteditor.localDispatcher = new (org.ekstep.contenteditor.IDispatcher.extend({
	type: 'localDispatcher',
	initDispatcher: function () {},
	dispatch: function (event) {
		event = (typeof event === 'string') ? event : JSON.stringify(event)
		org.ekstep.contenteditor.jQuery.ajax({
			type: 'POST',
			url: org.ekstep.contenteditor.config.localDispatcherEndpoint,
			data: {event: event},
			success: function (res) {}
		})
	}
}))()
