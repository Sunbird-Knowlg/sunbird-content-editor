'use strict';

describe('local dispatcher', function() {

	it('should log data to localhost', function() {
		spyOn(EkstepEditor.localDispatcher.http, 'post');

		EkstepEditor.localDispatcher.dispatch({});

		expect(EkstepEditor.localDispatcher.http.post).toHaveBeenCalledWith('telemetry', {}, jasmine.any(Function));
	});
});