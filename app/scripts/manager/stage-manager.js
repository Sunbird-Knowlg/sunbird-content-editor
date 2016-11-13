EkstepEditor.stageManager = new (Class.extend({
    stages: [],
    currentStage: undefined,
    canvas: undefined,
    init: function() {
        var instance = this;
        fabric.Object.prototype.transparentCorners = true;
        fabric.Object.prototype.lockScalingFlip = true;
        fabric.Object.prototype.hasRotatingPoint = false;
        this.canvas = new fabric.Canvas('canvas', { backgroundColor: "#FFFFFF", preserveObjectStacking: true });
        this.registerEvents();
        console.log("Stage manager initialized");
    },
    registerEvents: function() {
        var instance = this;
        EkstepEditor.eventManager.addEventListener("stage:select", this.selectStage, this);
        this.canvas.on("object:modified", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('modified', options, event);
        });
        this.canvas.on("object:selected", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('selected', options, event);
        });
        this.canvas.on("selection:cleared", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('unselected', options, event);
        });
        this.canvas.on("object:added", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('added', options, event);
        });
        this.canvas.on("object:removed", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('removed', options, event);
        });
    },
    dispatchObjectEvent: function(eventType, options, event) {
        var meta = EkstepEditor.stageManager.getObjectMeta(options);
        EkstepEditor.eventManager.dispatchEvent('object:' + eventType, meta);
        if (meta.type != '') {
            EkstepEditor.eventManager.dispatchEvent(meta.type + ':' + eventType, meta);
        }
    },
    selectStage: function(event, data) {
        if (_.isUndefined(this.currentStage)) {
            this.currentStage = _.find(this.stages, { id: data.stageId });
            this.currentStage.isSelected = true;
            this.currentStage.render(this.canvas);
        } else {
            this.currentStage.isSelected = false;
            EkstepEditor.eventManager.dispatchEvent('stage:unselect', { stageId: this.currentStage.id });
            this.canvas.clear();
            this.currentStage = _.find(this.stages, { id: data.stageId });
            this.currentStage.isSelected = true;
            this.canvas.off("object:added");
            this.currentStage.render(this.canvas);
            this.canvas.on("object:added", function(options, event) {
                EkstepEditor.stageManager.dispatchObjectEvent('added', options, event);
            });
        }
    },
    addStage: function(stage) {
        this.stages.push(stage);
        EkstepEditor.eventManager.dispatchEvent('stage:select', { stageId: stage.id });
    },
    deleteStage: function(stageId) {

    },
    duplicateStage: function(stageId) {

    },
    getObjectMeta: function(options) {
        var pluginId = (options && options.target) ? options.target.id : '';
        var pluginType = EkstepEditor.pluginManager.getPluginType(pluginId);
        return {
            'id': pluginId,
            'type': pluginType
        }
    },
    toECML: function() {
        var content = { theme: { id: "theme", version: 0.2, startStage: this.stages[0].id, stage: [], manifest: {media: []}}};
        _.forEach(this.stages, function(stage) {
            var stageBody = stage.toECML();
            _.forEach(stage.children, function(child) {
                var id = child.manifest.shortId || child.manifest.id;
                if(_.isUndefined(stageBody[id])) stageBody[id] = [];
                stageBody[id].push(child.toECML());
                if(_.indexOf(EkstepEditor.config.corePlugins, id) != 1) {
                    if(!_.isUndefined(child.manifest.renderer) && !_.isUndefined(child.manifest.renderer.main)) {
                        content.theme.manifest.media.push({
                            id: id, 
                            src: EkstepEditor.config.absURL + EkstepEditor.relativeURL(child.manifest.id, child.manifest.ver, child.manifest.renderer.main),
                            type: "plugin"
                        });
                    }
                }
            });
            content.theme.stage.push(stageBody);
        })
        return content;
    },
    fromECML: function(contentBody) {

    }
}));
