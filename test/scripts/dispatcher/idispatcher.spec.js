describe('idispatcher', function() {	
	var dispatcher = EkstepEditor.IDispatcher.extend({});

	it('should throw error when tried to invoke abstract methods', function() {
		var testFn1 = function() {
			dispatcher.prototype.initDispatcher();
		}

		var testFn2 = function() {
			dispatcher.prototype.dispatch();
		}
		expect(testFn1).toThrow("Subclass should implement initDispatcher");
		expect(testFn2).toThrow("Subclass should implement dispatch");
	});
});