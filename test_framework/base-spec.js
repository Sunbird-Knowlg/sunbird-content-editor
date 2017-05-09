org.ekstep.contenteditor = {}; 
org.ekstep.contenteditor.toolbarManager = {
	registerMenu: function() {},
	registerContextMenu: function() {}
};

org.ekstep.contenteditor.sidebarManager = {
	registerSidebarMenu: function() {},
	loadCustomTemplate: function() {}
};

var config = {
	"pluginRepo": "base/test_framework/data/content-plugins",
	"env": "editor"
};

window.org.ekstep.pluginframework.initialize(config);