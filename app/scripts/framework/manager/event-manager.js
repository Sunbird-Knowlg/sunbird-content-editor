/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.eventManager = new (Class.extend({
	enableEvents: true,
	addEventListener: function (type, callback, scope) {
		EventBus.addEventListener(type, callback, scope)
	},
	dispatchEvent: function (type, data, target) {
		if (this.enableEvents) EventBus.dispatch(type, target, data)
	},
	removeEventListener: function (type, callback, scope) {
		EventBus.removeEventListener(type, callback, scope)
	},
	hasEventListener: function (event) {
		return EventBus.hasEventListener(event)
	}
}))()
