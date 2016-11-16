/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.eventManager = new (Class.extend({
	addEventListener: function(type, callback, scope) {
		EventBus.addEventListener(type, callback, scope)
	},
	dispatchEvent: function(type, data, target) {
		EventBus.dispatch(type, target, data);
	},
	removeEventListener: function(type, callback, scope) {

	}
}));
