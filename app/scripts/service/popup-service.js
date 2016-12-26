EkstepEditor.popupService = new(EkstepEditor.iService.extend({    
    initService: function(loadNgModules, openModal) {        
        this.loadNgModules = loadNgModules;
        this.openModal = openModal;
    },
    loadNgModules: function(templatePath, controllerPath) {
        this.loadNgModules && this.loadNgModules(templatePath, controllerPath);
    },
    open: function(config, callback){
        this.openModal && this.openModal(config, callback);
    }
}));
