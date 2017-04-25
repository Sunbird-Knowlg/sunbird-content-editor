/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.keyboardManager = new (Class.extend({
	registry: {},
	initialize: function($document) {
		this.document = $document;
	},
	registerKeyCombination: function(command, callback) {
		if(command !== undefined && callback !== undefined){
			Mousetrap.bind(command, callback);
		} else {
			throw "The given key combination is invalid.";
		}
	},
	resolveKeyCombination: function(event) {
		// TODO: wrap Mousetrap here..
	}
}));