'use strict';

describe('piwik dispatcher', function() {

	it('should log data to piwik endPoint', function() {
		spyOn(EkstepEditorAPI.jQuery, 'post');

		EkstepEditor.piwikDispatcher.dispatch({});

		expect(EkstepEditorAPI.jQuery.post).toHaveBeenCalled();
	});
});