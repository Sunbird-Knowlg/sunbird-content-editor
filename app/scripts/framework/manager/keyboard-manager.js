/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.keyboardManager = new (Class.extend({
	registry: {},
	init: function() {		
		var instance = this;
		document.addEventListener("keydown", function(event) {
            instance.resolveKeyCombination(event);
        });
	},
	registerKeyCombination: function(command, callback) {
		commands = command.toUpperCase().split('+').map(function(value) {
			return value.trim();
		});
		if(commands.length > 4) {
			throw "Cannot register a command with more than 3 keys";
		}
		var registryKey = ((commands.indexOf('CTRL') != -1 || commands.indexOf('CMD') != -1)  ? 'ctrl' : '') + (commands.indexOf('SHIFT') != -1 ? 'shift' : '') + (commands.indexOf('ALT') != -1 ? 'alt' : '');
		commands = commands.filter(function(value) {
			return ["CTRL", "CMD", "ALT", "SHIFT"].indexOf(value) == -1
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
			this.registry[registryKey]();
		}
	}
}));