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
            EkstepEditor.telemetryService.interact({ "type": "popupInteract", "subtype": "popup:open", "target": "window", "targetid": "", "objectid": "", "stage": EkstepEditorAPI.getCurrentStage().id });
        }
    }
}));
