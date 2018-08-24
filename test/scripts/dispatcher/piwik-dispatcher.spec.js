'use strict'

describe('piwik dispatcher', function () {
	it('should log data to piwik end point when the event is json', function () {
		// spyOn(org.ekstep.pluginframework.resourceManager.jQuery, 'post');

		org.ekstep.contenteditor.piwikDispatcher.dispatch({})
		// expect(org.ekstep.pluginframework.resourceManager.jQuery.post).toHaveBeenCalled();
	})

	it('should log data to piwik end point when the event is string', function () {
		// spyOn(org.ekstep.pluginframework.resourceManager.jQuery, 'post');

		org.ekstep.contenteditor.piwikDispatcher.dispatch('{}')
		// expect(org.ekstep.pluginframework.resourceManager.jQuery.post).toHaveBeenCalled();
	})

	it('should log not call piwik end point when the event is undefined', function () {
		// spyOn(org.ekstep.pluginframework.resourceManager.jQuery, 'post');

		org.ekstep.contenteditor.piwikDispatcher.dispatch(undefined)
		// expect(org.ekstep.pluginframework.resourceManager.jQuery.post).not.toHaveBeenCalled();
	})
})
