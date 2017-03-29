/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.keyboardManager = new (Class.extend({
	document: undefined,
	registry: {},
	initialize: function($document) {
		this.document = $document;
		var instance = this;
		$document.on("keydown", function(event) {
            instance.resolveKeyCombination(event);
        });
	},
	registerKeyCombination: function(command, callback) {
		commands = _.map(command.toUpperCase().split('+'), function(key) {
			return key.trim();
		});
		if(commands.length > 4) {
			throw "Cannot register a command with more than 3 keys";
		}
		var registryKey = ((_.indexOf(commands, 'CTRL') != -1 || _.indexOf(commands, 'CMD') != -1)  ? 'ctrl' : '') + (_.indexOf(commands, 'SHIFT') != -1 ? 'shift' : '') + (_.indexOf(commands, 'ALT') != -1 ? 'alt' : '');
		commands = _.filter(commands, function(key) {
			return _.indexOf(["CTRL", "CMD", "ALT", "SHIFT"], key) == -1
		});
		if(commands.length == 0) {
			throw "Cannot register a command only with modifier keys. Need one key character";
		}
		if(commands.length != 1) {
			throw "Cannot register a command with multiple key characters";
		}
		registryKey += (commands[0] === 'DEL') ? 8 : commands[0].charCodeAt(0);
		if(this.registry[registryKey]) throw "The given key combination is already registered. Please provide a different combination";
		this.registry[registryKey] = callback;
	},
	resolveKeyCombination: function(event) {
		var registryKey = ((event.metaKey || event.ctrlKey) ? 'ctrl' : '') + (event.shiftKey ? 'shift': '') + (event.altKey ? 'alt' : '') + event.keyCode;
		if(this.registry[registryKey]) {
			event.preventDefault();
			this.registry[registryKey]();
		}
	}
}));