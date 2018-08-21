/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.keyboardManager = new (Class.extend({
	registry: {},
	registerKeyCombination: function (command, callback) {
		if (command !== undefined && callback !== undefined) {
			Mousetrap.bind(command, callback)
		} else {
			// eslint-disable-next-line
			throw 'The given key combination is invalid.'
		}
	}
}))()
