describe('Ekstep Editor', function() {
    it('should init editor', function() {
        var context = { contentId: "do_123123123123", uid: 346 };
        var config = { apislug: true, baseURL: true, absURL: true };
        var $scope = {};
        var $document = {};
        spyOn(EkstepEditor.toolbarManager, 'setScope');
        spyOn(EkstepEditor.keyboardManager, 'initialize');
        spyOn(EkstepEditor, '_mergeConfig');
        spyOn(EkstepEditor, '_loadDefaultPlugins');

        EkstepEditor.init(context, config, $scope, $document, function() {});

        expect(EkstepEditorAPI.globalContext).toEqual(context);
        expect(EkstepEditor.globalContext).toEqual(context);
        expect(EkstepEditor.toolbarManager.setScope).toHaveBeenCalledWith($scope);
        expect(EkstepEditor.keyboardManager.initialize).toHaveBeenCalledWith($document);
        expect(EkstepEditor._mergeConfig).toHaveBeenCalledWith(config);
        expect(EkstepEditor._loadDefaultPlugins).toHaveBeenCalledWith(context, jasmine.any(Function));
    });

    it('should load default plugins', function() {
    	var context = { contentId: "do_123123123123", uid: 346 };
    	spyOn(EkstepEditor.pluginManager, 'loadAllPlugins');

    	EkstepEditor._loadDefaultPlugins(context, function(){});

    	expect(EkstepEditor.pluginManager.loadAllPlugins).toHaveBeenCalledWith(EkstepEditor.config.plugins, jasmine.any(Function));
    });
});
