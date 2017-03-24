'use strict';

describe('piwik dispatcher', function() {

	it('should log data to piwik end point when the event is json', function() {
		spyOn(EkstepEditorAPI.jQuery, 'post');

		EkstepEditor.piwikDispatcher.dispatch({});
		expect(EkstepEditorAPI.jQuery.post).toHaveBeenCalled();
	});

	it('should log data to piwik end point when the event is string', function() {
		spyOn(EkstepEditorAPI.jQuery, 'post');

		EkstepEditor.piwikDispatcher.dispatch("{}");
		expect(EkstepEditorAPI.jQuery.post).toHaveBeenCalled();
	});

	it('should log not call piwik end point when the event is undefined', function() {
		spyOn(EkstepEditorAPI.jQuery, 'post');

		EkstepEditor.piwikDispatcher.dispatch(undefined);
		expect(EkstepEditorAPI.jQuery.post).not.toHaveBeenCalled();
	});
});