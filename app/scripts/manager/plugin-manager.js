/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.pluginManager = new(Class.extend({
    plugins: {},
    pluginObjs: {},
    pluginInstances: {},
    errors: [],
    init: function() {
        console.log("Plugin manager initialized");
    },
    registerPlugin: function(manifest, plugin, repo) {
        repo = repo || EkstepEditor.publishedRepo;
        this.plugins[manifest.id] = { p: plugin, m: manifest, 'repo': repo };
        var p = new plugin(manifest); // Initialize plugin
        this.pluginObjs[manifest.id] = p;
        EkstepEditorAPI.dispatchEvent('plugin:load', { plugin: manifest.id, version: manifest.ver });
        EkstepEditorAPI.dispatchEvent(manifest.id + ':load');
    },
    loadAndInitPlugin: function(pluginId, version, publishedTime) {
        this.loadPlugin(pluginId, version, publishedTime);
        if(this.isDefined(pluginId)) {
            var pluginManifest = this.getPluginManifest(pluginId);
            if (pluginManifest.type && EkstepEditorAPI._.lowerCase(pluginManifest.type) === "widget") {
                this.invoke(pluginId, _.cloneDeep(pluginManifest.editor['init-data'] || {}), EkstepEditorAPI.getCurrentStage());    
            }
            return 0;
        } else {
            return 1;
        }
    },
    loadPlugin: function(pluginId, pluginVer, publishedTime) {
        var instance = this;
        if (this.plugins[pluginId]) {
            console.log('A plugin with id "' + pluginId + '" and ver "' + pluginVer + '" is already loaded');
        } else {
            EkstepEditor.resourceManager.discoverManifest(pluginId, pluginVer, function(err, data) {
                if (err) {
                    console.error('Unable to find plugin ' + pluginId);
                } else {
                    instance.loadPluginByManifest(data.manifest, data.repo, publishedTime);
                }
            }, publishedTime);
        }
    },
    loadPluginByManifest: function(manifest, repo, publishedTime) {
        var instance = this;
        EkstepEditor.resourceManager.getResource(manifest.id, manifest.ver, manifest.editor.main, 'text', repo, function(err, data) {
            if (err) {
                console.error('Unable to load plugin js', manifest.editor.main);
            } else {
                instance.loadDependencies(manifest, repo, publishedTime);
                try {
                    instance.registerPlugin(manifest, eval(data), repo);
                    if (manifest.type && EkstepEditorAPI._.lowerCase(manifest.type) === "widget") {
                        instance.invoke(manifest.id, _.cloneDeep(manifest.editor['init-data'] || {}), EkstepEditorAPI.getCurrentStage());
                    }
                    EkstepEditorAPI.dispatchEvent('plugin:load', { plugin: manifest.id, version: manifest.ver });
                } catch (e) {
                    console.error("error while loading plugin:" + manifest.id, e);
                }
            }
        }, publishedTime);
    },
    loadDependencies: function(manifest, repo, publishedTime) {
        var instance = this;
        if (_.isArray(manifest.editor.dependencies)) {
            _.forEach(manifest.editor.dependencies, function(dependency) {
                if (dependency.type == 'plugin') {
                    instance.loadPlugin(dependency.plugin, dependency.ver, publishedTime);
                } else {
                    EkstepEditor.resourceManager.loadExternalResource(dependency.type, manifest.id, manifest.ver, dependency.src, repo, publishedTime);
                }
            });
        }
    },
    isDefined: function(id) {
        if (this.plugins[id]) {
            return true;
        } else {
            return false;
        }
    },
    invoke: function(id, data, parent, override) {
        var instance = this;
        var p = undefined;
        var plugin = this.plugins[id];
        if (!plugin) {
            this.addError('No plugin found for - ' + id);
        } else {
            var pluginClass = override ? plugin.p.extend(override) : plugin.p;
            var pluginManifest = plugin.m;
            try {
                if (_.isArray(data)) {
                    data.forEach(function(d) {
                        p = new pluginClass(pluginManifest, d, parent);
                        instance.addPluginInstance(p);
                        p.initPlugin();
                        EkstepEditorAPI.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                        EkstepEditorAPI.dispatchEvent(pluginManifest.id + ':add');
                    })
                } else {
                    p = new pluginClass(pluginManifest, data, parent);
                    instance.addPluginInstance(p);
                    p.initPlugin();
                    EkstepEditorAPI.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                    EkstepEditorAPI.dispatchEvent(pluginManifest.id + ':add');                    
                }
            } catch(e) {
                throw new Error(e);
            }
        }
        return p;
    },
    addPluginInstance: function(pluginObj) {
        this.pluginInstances[pluginObj.id] = pluginObj;
    },
    removePluginInstance: function(pluginObj) {
        if (pluginObj) pluginObj.remove();
    },
    getPluginInstance: function(id) {
        return this.pluginInstances[id];
    },
    getPluginManifest: function(id) {
        var plugin = this.plugins[id];
        if (plugin) {
            return plugin.m;
        } else {
            return undefined;
        }
    },
    addError: function(error) {
        this.errors.push(error);
    },
    getErrors: function() {
        return this.errors;
    },
    cleanUp: function() {
        this.pluginInstances = {};
        this.plugins = {};
        this.errors = [];
    },
    getPlugins: function() {
        return Object.keys(this.plugins);
    },
    getPluginType: function(id) {
        if (this.pluginInstances[id]) {
            return this.pluginInstances[id].getType();
        } else {
            return '';
        }
    },
    loadAllPlugins: function(plugins, callback) {
        if (_.isEmpty(plugins)) {
            callback();
        }
        var instance = this;
        var q = async.queue(function(plugin, pluginCallback) {
            instance.loadPlugin(plugin.key, plugin.value);
            pluginCallback();
        }, 6);
        q.drain = function() {
            callback();
        };
        _.forIn(plugins, function(value, key) {
            q.push({ "key": key, "value": value }, function(err) {});
        });
    },
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback) {
        if (this.plugins[pluginId]) {
            EkstepEditor.resourceManager.getResource(pluginId, pluginVer, src, dataType, this.plugins[pluginId]['repo'], callback)
        } else {
            callback(new Error("unable load plugin resource " + src), undefined)
        }
    },
    getPluginVersion: function(id) {
        if (this.pluginInstances[id]) {
            return this.pluginInstances[id].getVersion();
        } else {
            return '';

        }
    },
    resolvePluginResource: function (id, ver, resource) {
        if (this.plugins[id] && this.plugins[id]["repo"]) {
            return this.plugins[id]["repo"].resolveResource(id, ver, resource);
        } else{
            return false;
        }
    }
}));
