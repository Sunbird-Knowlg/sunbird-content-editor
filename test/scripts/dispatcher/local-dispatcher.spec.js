'use strict';

describe('local dispatcher', function() {

	it('should log data to localhost', function() {
		spyOn(org.ekstep.pluginframework.localDispatcher.http, 'post');

		org.ekstep.pluginframework.localDispatcher.dispatch({});

		expect(org.ekstep.pluginframework.localDispatcher.http.post).toHaveBeenCalledWith('telemetry', {}, jasmine.any(Function));
	});
});