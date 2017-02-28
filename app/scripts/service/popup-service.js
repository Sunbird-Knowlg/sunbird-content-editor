EkstepEditor.popupService = new(EkstepEditor.iService.extend({
    loadModules: undefined,
    openModal: undefined,
    initService: function(loadModuleFn, openModalFn) {
        this.loadModules = loadModuleFn;
        this.openModal = openModalFn;
    },
    loadNgModules: function(templatePath, controllerPath) {
        this.loadModules && this.loadModules(templatePath, controllerPath);
    },
    open: function(config, callback){
        if(this.openModal) {
            this.openModal(config, callback);
            EkstepEditor.telemetryService.interact({ "type": "click", "subtype": "open", "target": "popup", "pluginid": "", "pluginver": '', "objectid": "", "stage": EkstepEditorAPI.getCurrentStage().id });
        }
    }
}));
