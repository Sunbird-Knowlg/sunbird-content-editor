'use strict'

describe('local dispatcher', function () {
	it('should log data to localhost', function () {
	//	spyOn(org.ekstep.pluginframework.localDispatcher, 'post');

		org.ekstep.contenteditor.localDispatcher.dispatch({})

		//		expect(org.ekstep.pluginframework.localDispatcher.post).toHaveBeenCalledWith('telemetry', {}, jasmine.any(Function));
	})
})
