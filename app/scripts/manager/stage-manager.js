/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.stageManager = new(Class.extend({
    stages: [],
    thumbnails: {},
    currentStage: undefined,
    canvas: undefined,
    contentLoading: false,
    init: function() {
        var instance = this;
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.lockScalingFlip = true;
        fabric.Object.prototype.hasRotatingPoint = false;
        fabric.Object.prototype.cornerSize = 6;
        fabric.Object.prototype.padding = 2;
        fabric.Object.prototype.borderColor = "#1A98FA";
        fabric.Object.prototype.cornerColor = "#1A98FA";
        //fabric.Object.prototype.rotatingPointOffset = 18; //TODO need to add rotation in bas class
        this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#FFFFFF', preserveObjectStacking: true, perPixelTargetFind: false });
        console.log("Stage manager initialized");
        EkstepEditor.eventManager.addEventListener("stage:delete", this.deleteConfirmationDialog, this);
        EkstepEditor.eventManager.addEventListener("stage:duplicate", this.duplicateStage, this);
    },
    clearCanvas: function(canvas) {
        canvas.clear();
        canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));
    },
    registerEvents: function() {
        var instance = this;        
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
        this.canvas.on("object:moving", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('moving', options, event);
        });
        this.canvas.on("object:scaling", function(options, event) {
            EkstepEditor.stageManager.dispatchObjectEvent('scaling', options, event);
        });
        EkstepEditor.eventManager.addEventListener("stage:select", this.selectStage, this);
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
            this.currentStage.setCanvas(this.canvas);
            this.currentStage.render(this.canvas);
        } else {
            this.currentStage.isSelected = false;
            EkstepEditor.eventManager.dispatchEvent('stage:unselect', { stageId: this.currentStage.id });
            this.clearCanvas(this.canvas);
            this.currentStage = _.find(this.stages, { id: data.stageId });
            this.currentStage.isSelected = true;
            this.canvas.off("object:added");
            this.currentStage.setCanvas(this.canvas);
            this.currentStage.render(this.canvas);
            this.canvas.on("object:added", function(options, event) {
                EkstepEditor.stageManager.dispatchObjectEvent('added', options, event);
            });
        }
        EkstepEditorAPI.dispatchEvent('config:showSettingsTab', {id: this.currentStage.id});        
    },
    addStage: function(stage) {
        var prevStageId = _.isUndefined(this.currentStage) ? undefined : this.currentStage.id;
        this.addStageAt(stage, stage.attributes.position);
        this.selectStage(null, { stageId: stage.id });
        EkstepEditorAPI.dispatchEvent('stage:add', { stageId: stage.id, prevStageId: prevStageId});
        this.enableSave();
    },
    deleteStage: function(event, data) {
        var currentStage = _.find(this.stages, { id: data.stageId });
        this.deleteStageInstances(currentStage);
        var currentStageIndex = this.getStageIndex(currentStage);
        this.stages.splice(currentStageIndex, 1);
        if (this.stages.length === 0) EkstepEditorAPI.dispatchEvent('stage:create', { "position": "next" });
        else if (currentStageIndex === this.stages.length) this.selectStage(null, { stageId: this.stages[currentStageIndex - 1].id });
        else this.selectStage(null, { stageId: this.stages[currentStageIndex].id });
        EkstepEditorAPI.dispatchEvent('stage:removed', { stageId: data.stageId});
        this.enableSave();
    },
    deleteStageInstances: function(stage) {
        _.forEach(_.clone(stage.canvas.getObjects()), function(obj) {
            stage.canvas.remove(obj);
        });
    },
    getStageIndex: function(stage) {
        return EkstepEditorAPI.getAllStages().findIndex(function(obj) {
            return obj.id === stage.id
        });
    },
    getStage: function(stageId) {
        return _.find(this.stages, { id: stageId });
    },
    duplicateStage: function(event, data) {
        var currentStage = _.find(this.stages, { id: data.stageId }), instance = this, plugins = [];
        var stage = this.stages[this.getStageIndex(currentStage)];
        EkstepEditorAPI.dispatchEvent('stage:create', { "position": "afterCurrent" });        
        EkstepEditor.eventManager.enableEvents = false;
        _.forEach(stage.children, function(plugin) {
            plugins.push({'z-index': plugin.attributes['z-index'], data: plugin });
        });
        _.forEach(_.sortBy(plugins, 'z-index'), function(plugin) {            
            EkstepEditorAPI.cloneInstance(plugin.data);
        });
        this.currentStage.destroyOnLoad(stage.children.length, this.canvas, function(){
            EkstepEditor.eventManager.enableEvents = true;
        });
        EkstepEditorAPI.dispatchEvent('stage:select', { stageId: this.currentStage.id });      

        this.enableSave();        
    },
    getObjectMeta: function(options) {
        var pluginId = (options && options.target) ? options.target.id : '';
        return {
            'id': pluginId,
            'type': EkstepEditor.pluginManager.getPluginType(pluginId),
            'ver': EkstepEditor.pluginManager.getPluginVersion(pluginId)
        }
    },
    addStageAt: function(stage, position) {
        var currentIndex;
        switch (position) {
            case "beginning":
                this.stages.unshift(stage);
                break;
            case "end":
            case "next":
                this.stages.push(stage);
                break;
            case "afterCurrent":
            case "beforeCurrent":
                currentIndex = this.getStageIndex(EkstepEditorAPI.getCurrentStage());
                if (position === "afterCurrent" && currentIndex >= 0) this.stages.splice(currentIndex + 1, 0, stage);
                if (position === "beforeCurrent" && currentIndex >= 0) this.stages.splice(currentIndex, 0, stage);
                break;
            default:
                this.stages.push(stage)
                break;
        };
    },
    onStageDragDrop: function(srcStageId, destStageId) {
        var srcIdx = this.getStageIndexById(srcStageId);
        var destIdx = this.getStageIndexById(destStageId);
        if (srcIdx < destIdx) {
            var src = this.stages[srcIdx];
            for (var i = srcIdx; i <= destIdx; i++) {
                this.stages[i] = this.stages[i + 1];
                if (i === destIdx) this.stages[destIdx] = src;
            }
        }
        if (srcIdx > destIdx) {
            var src = this.stages[srcIdx];
            for (var i = srcIdx; i >= destIdx; i--) {
                this.stages[i] = this.stages[i - 1];
                if (i === destIdx) this.stages[destIdx] = src;
            }
        }

        EkstepEditorAPI.dispatchEvent('stage:reorder', { stageId: srcStageId, fromIndex: srcIdx, toIndex: destIdx });
    },
    getStageIndexById: function(stageId) {
        return _.findIndex(this.stages, function(stage) {
            return stage.id == stageId;
        });
    },
    enableSave: function() { // on stage operation, enable the save button
        EkstepEditorAPI.getAngularScope().enableSave();
    },
    deleteConfirmationDialog: function(event, data) {
        var instance = this;
        EkstepEditorAPI.getService('popup').open({
            template: 'deleteStageDialog.html',
            controller: ['$scope', function($scope) {
                $scope.delete = function() {
                    $scope.closeThisDialog();
                    instance.deleteStage(event, data);
                }
            }],
            showClose: false
        });
    },
    showLoadScreenMessage: function() {
        var obj = _.find(EkstepEditorAPI.getAngularScope().appLoadMessage, { 'id': 3});
        if (_.isObject(obj)) {
            obj.message = "Loading your lesson";
            obj.status = true;
        }
        EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
        setTimeout(function() {
            EkstepEditorAPI.getAngularScope().closeLoadScreen(); // added 2 sec set timeout to show the content load message           
        }, 2000)
    },
    getStageIcons: function() {
        return this.thumbnails;
    },
    toECML: function() {
        var instance = this;
        var content = { theme: { id: "theme", version: "1.0", startStage: this.stages[0].id, stage: [], manifest: { media: [] } } };
        this.setNavigationalParams();
        var mediaMap = {};
        _.forEach(this.stages, function(stage, index) {
            instance.thumbnails[stage.id] = stage.thumbnail;
            var stageBody = stage.toECML();
            _.forEach(stage.children, function(child) {
                var id = child.getManifestId();
                if (_.isUndefined(stageBody[id])) stageBody[id] = [];
                stageBody[id].push(child.toECML());
                instance.updateContentManifest(content, id, child.manifest);
                instance.addMediaToMediaMap(mediaMap, child.getMedia(), child.manifest);
            });
            content.theme.stage.push(stageBody);
        });        
        if(!_.isEmpty(EkstepEditor.mediaManager.migratedMediaMap)) {            
            instance.mergeMediaMap(mediaMap);
            content.theme["migration-media"] = {};
            content.theme["migration-media"].media =  _.values(EkstepEditor.mediaManager.migratedMediaMap);
        }
        content.theme.manifest.media = _.uniqBy(_.concat(content.theme.manifest.media, _.values(mediaMap)), 'id');
        return _.cloneDeep(content);
    },
    mergeMediaMap: function(mediaMap) {
        _.forIn(EkstepEditor.mediaManager.migratedMediaMap, function(value, key) {
            if (_.isUndefined(mediaMap[key])) {
                mediaMap[key] = value;
                value.src = EkstepEditor.mediaManager.getMediaOriginURL(value.src);
            }
        });
    },
    addMediaToMediaMap: function(mediaMap, media, manifest) {
        var pluginType = ['plugin', 'css'];
        if (_.isObject(media)) {
            _.forIn(media, function(value, key) {
                if(!mediaMap[key]) {
                    mediaMap[key] = value;
                    value.src = EkstepEditor.mediaManager.getMediaOriginURL(value.src);
                    _.forEach(pluginType, function(type) {
                        if (mediaMap[key].type === type) {
                            mediaMap[key].plugin = manifest.id;
                            mediaMap[key].ver = manifest.ver;
                        }
                    });
                } else if (value.preload) {
                    mediaMap[key].preload = value.preload;
                }
                
            });
        }
    },
    setNavigationalParams: function() {
        var instance = this;
        var size = this.stages.length;
        _.forEach(this.stages, function(stage, index) {
            if (index === 0) {
                stage.deleteParam('previous'); // first stage should not have previous param.
            }
            if (index !== 0) {
                stage.addParam('previous', instance.stages[index - 1].id);
            }
            if (index < (size - 1)) {
                stage.addParam('next', instance.stages[index + 1].id);
            }
            if (size === index + 1) {
                stage.deleteParam('next'); // last stage should not have next param.
            }
        });
    },
    updateContentManifest: function(content, id, pluginManifest) {
        if (_.indexOf(EkstepEditor.config.corePlugins, id) == 1) {
            return;
        }
        if (_.isUndefined(pluginManifest.renderer) || _.isUndefined(pluginManifest.renderer.main)) {
            return;
        }
        var manifestEntry = _.find(content.theme.manifest.media, { id: id });
        if (_.isUndefined(manifestEntry)) {
            //Add renderer dependencies first 
             if(!_.isUndefined(pluginManifest.renderer.dependencies) && pluginManifest.renderer.dependencies.length > 0) {
                _.forEach(pluginManifest.renderer.dependencies, function(dependency) {
                    content.theme.manifest.media.push({
                        id: dependency.id,
                        type: dependency.type,
                        plugin: dependency.id,
                        ver: pluginManifest.ver,
                        src: EkstepEditor.config.absURL + EkstepEditor.relativeURL(pluginManifest.id, pluginManifest.ver, dependency.src)
                    });
                });
            }
            //then push the main renderer file
            content.theme.manifest.media.push({
                id: id,
                plugin: id,
                ver: pluginManifest.ver,
                src: EkstepEditor.config.absURL + EkstepEditor.relativeURL(pluginManifest.id, pluginManifest.ver, pluginManifest.renderer.main),
                type: "plugin"
            });
           
        }
    },
    fromECML: function(contentBody, stageIcons) {
        var instance = this;
        var startTime = (new Date()).getTime();
        EkstepEditorAPI.getAngularScope().appLoadMessage.push({ 'id': 3, 'message': 'Loading your lesson', 'status': false });
        EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
        EkstepEditor.stageManager.contentLoading = true;
        EkstepEditor.eventManager.enableEvents = false;
        this._loadMedia(contentBody);
        this._loadPlugins(contentBody, function(err, res) {
            if(!err) {
                var stages = _.isArray(contentBody.theme.stage) ? contentBody.theme.stage : [contentBody.theme.stage];
                instance._loadStages(stages, stageIcons);
            }
        });
    },
    _loadMedia: function(contentBody) {
        _.forEach(contentBody.theme.manifest.media, function(media) {
            if (media.type == 'plugin' && EkstepEditor.pluginManager.isDefined(media.id)) {} else {
                EkstepEditor.mediaManager.addMedia(media);
            }
        });
        //if migratedMedia present inside theme, add to migrated media
        if (contentBody.theme["migration-media"]) {
            _.forEach(contentBody.theme["migration-media"].media, function(media){
                EkstepEditor.mediaManager.addToMigratedMedia(media);
            });
        }
    },
    _loadPlugins: function(contentBody, cb) {
        var instance = this;
        contentBody.theme.manifest.media = _.isArray(contentBody.theme.manifest.media) ? contentBody.theme.manifest.media : [contentBody.theme.manifest.media];
        var plugins = _.filter(contentBody.theme.manifest.media, { type: 'plugin' });
        var pluginMap = {}
        _.forEach(plugins, function(plugin) {
            pluginMap[plugin.id] = plugin.ver;
        });
        EkstepEditor.pluginManager.loadAllPlugins(pluginMap, cb);
    },
    _loadStages: function(stages, stageIcons, startTime) {
        var instance = this;
        stageIcons = stageIcons || '{}';
        var thumbnails = JSON.parse(stageIcons);
        var tasks = [];
        _.forEach(stages, function(stage, index) {
            tasks.push(function(callback) {
                instance._loadStage(stage, index, stages.length, thumbnails[stage.id], callback);
            });
        });
        if(tasks.length == 0) {
            instance.onContentLoad(startTime);
        } else {
            async.parallel(tasks, function(err, data) {
                instance.onContentLoad(startTime)
            });
        }
    },
    _loadStage: function(stage, index, size, thumbnail, callback) {
        var instance = this;
        var stageEvents = _.clone(stage.events) || {};
        var canvas = undefined;
        if(thumbnail) {
            canvas = {
                toDataURL: function() {
                    return thumbnail;
                },
                add: function() {},
                setActiveObject: function() {},
                clear: function() {},
                renderAll: function() {},
                setBackgroundColor: function() {}
            }
        } else {
            // Some extremely complex logic is happening here. Read at your own risk
            // Instantiate a canvas to create thumbnail.
            if(index == 0) {
                canvas = this.canvas;
            } else {
                $('<canvas>').attr({ id: stage.id }).css({ width: '720px', height: '405px' }).appendTo('#thumbnailCanvasContainer');
                canvas = new fabric.Canvas(stage.id, { backgroundColor: "#FFFFFF", preserveObjectStacking: true, width: 720, height: 405 });
            }
        }
        
        var stageInstance = EkstepEditorAPI.instantiatePlugin(EkstepEditor.config.corePluginMapping['stage'], stage);
        stageInstance.setCanvas(canvas);
        var pluginCount = 0;
        var props = _.pickBy(stage, _.isObject);
        var plugins = [];
        _.forIn(props, function(values, key) {
            values = _.isArray(values) ? values : [values];
            _.forEach(values, function(value) {
                plugins.push({ id: key, 'z-index': value['z-index'], data: value });
            });
            delete stage[key];
        })

        _.forIn(_.sortBy(plugins, 'z-index'), function(plugin) {
            var pluginId = EkstepEditor.config.corePluginMapping[plugin.id] || plugin.id;
            var pluginInstance;
            try {
                pluginInstance = EkstepEditorAPI.instantiatePlugin(pluginId, plugin.data, stageInstance);
                if (_.isUndefined(pluginInstance)) {
                    console.log('Unable to instantiate', plugin.id); // TODO: Add telemetry that plugin is not found
                    EkstepEditorAPI.dispatchEvent("org.ekstep.unsupported:create", { data: plugin });
                }
                pluginCount++;
            } catch(e) { 
                console.warn('error when instantiating plugin:', pluginId, plugin.data, stageInstance.id, e);                   
                EkstepEditorAPI.dispatchEvent('ce:plugin:error', {error: 'unable to instantiate plugin', 'pluginId': pluginId, pluginData: plugin.data, stageId: stageInstance.id });
            }                
        });
        if (stageEvents) {
            _.forEach(stageEvents, function(event) {
                _.forEach(event, function(e) {
                    stageInstance.addEvent(e);
                })
            })
        }
        stageInstance.destroyOnLoad(pluginCount, canvas, callback);
    },
    onContentLoad: function(startTime) {
        EkstepEditorAPI.jQuery('#thumbnailCanvasContainer').empty();
        EkstepEditorAPI.getAngularScope().toggleGenieControl();
        EkstepEditor.eventManager.enableEvents = true;
        EkstepEditor.stageManager.registerEvents();
        this.showLoadScreenMessage();
        EkstepEditor.stageManager.contentLoading = false;
        EkstepEditor.telemetryService.startEvent(true).append("loadtimes", {"contentLoad": ((new Date()).getTime() - startTime)});
        EkstepEditorAPI.dispatchEvent('content:onload');
        if(EkstepEditorAPI._.isEmpty(this.stages)) {
            EkstepEditor.eventManager.dispatchEvent('stage:create', { "position": "beginning" });
        } else {
            EkstepEditor.eventManager.dispatchEvent('stage:select', { stageId: this.stages[0].id });
        }
    }
}));
