/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.pluginManager = new(Class.extend({
    plugins: {},
    pluginObjs: {},
    pluginInstances: {},
    errors: [],
    init: function() {
        console.log("Plugin manager initialized");
    },
    registerPlugin: function(manifest, plugin, repo) {
        repo = repo || org.ekstep.pluginframework.publishedRepo;
        this._registerNameSpace(manifest.id, plugin);
        this.plugins[manifest.id] = { p: plugin, m: manifest, 'repo': repo };
        var p = new plugin(manifest); // Initialize plugin
        this.pluginObjs[manifest.id] = p;
        org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:load', { plugin: manifest.id, version: manifest.ver });
        org.ekstep.pluginframework.eventManager.dispatchEvent(manifest.id + ':load');
    },
    loadPlugin: function(pluginId, pluginVer, publishedTime) {
        var instance = this;
        if (this.plugins[pluginId]) {
            console.log('A plugin with id "' + pluginId + '" and ver "' + pluginVer + '" is already loaded');
        } else {
            org.ekstep.pluginframework.resourceManager.discoverManifest(pluginId, pluginVer, function(err, data) {
                if (err || (data == undefined)) {
                    console.error('Unable to load plugin manifest', 'plugin:' + pluginId + '-' + pluginVer, 'Error:', err);
                } else {
                    instance.loadDependencies(data.manifest, data.repo, publishedTime);
                    instance.loadPluginByManifest(data.manifest, data.repo, publishedTime);
                }
            }, publishedTime);
        }
    },
    loadDependencies: function(manifest, repo, publishedTime) {
        var instance = this;
        if (Array.isArray(manifest[org.ekstep.pluginframework.env].dependencies)) {
            manifest[org.ekstep.pluginframework.env].dependencies.forEach(function(dependency) {
                if (dependency.type == 'plugin') {
                    instance.loadPlugin(dependency.plugin, dependency.ver, publishedTime);
                } else {
                    org.ekstep.pluginframework.resourceManager.loadExternalResource(dependency.type, manifest.id, manifest.ver, dependency.src, repo, publishedTime);
                }
            });
        }
    },
    loadPluginByManifest: function(manifest, repo, publishedTime) {
        var instance = this;
        org.ekstep.pluginframework.resourceManager.getResource(manifest.id, manifest.ver, manifest[org.ekstep.pluginframework.env].main, 'text', repo, function(err, data) {
            if (err) {
                console.error('Unable to load editor plugin', 'plugin:' + manifest.id + '-' + manifest.ver, 'resource:' + manifest[org.ekstep.pluginframework.env].main, 'Error:', err);
            } else {
                try {
                    instance.registerPlugin(manifest, eval(data), repo);
                } catch (e) {
                    console.error("Error while loading plugin", 'plugin:' + manifest.id + '-' + manifest.ver, 'Error:', e);
                }
            }
        }, publishedTime);
    },
    _registerNameSpace: function(pluginId, clazz) {
        var names = pluginId.split('.')
        var baseNameSpace = names[0];
        names.splice(0, 1);
        names = names.join('.')
        if(!window[baseNameSpace]) {
            window[baseNameSpace] = {};
        }
        var pluginClazz = Class.extend({
            init: function(data, parent, override) {
                org.ekstep.pluginframework.pluginManager.invoke(pluginId, data, parent, override);
            }
        });
        pluginClazz.extend = function(subClazz) {
            return clazz.extend(subClazz);
        }
        window[baseNameSpace] = window[baseNameSpace] || {};
        window[baseNameSpace].names = pluginClazz;
    },
    loadAndInitPlugin: function(pluginId, version, publishedTime, parent) {
        this.loadPluginWithDependencies(pluginId, version, publishedTime);
        if(this.isDefined(pluginId)) {
            var pluginManifest = this.getPluginManifest(pluginId);
            if (pluginManifest.type && (pluginManifest.type.toLowerCase() === "widget")) {
                this.invoke(pluginId, JSON.parse(JSON.stringify(pluginManifest[org.ekstep.pluginframework.env]['init-data'] || {})), parent);
            }
            return 0;
        } else {
            return 1;
        }
    },
    loadPluginWithDependencies: function(pluginId, pluginVer, publishedTime) {
        var instance = this;
        if (this.plugins[pluginId]) {
            console.log('A plugin with id "' + pluginId + '" and ver "' + pluginVer + '" is already loaded');
        } else {
            org.ekstep.pluginframework.resourceManager.discoverManifest(pluginId, pluginVer, function(err, data) {
                if (err || (data == undefined)) {
                    console.error('Unable to load plugin manifest', 'plugin:' + pluginId + '-' + pluginVer, 'Error:', err);
                } else {
                    var queue = instance.queueDependencies(data.manifest, data.repo, publishedTime);
                    if(queue.length() > 0) {
                        queue.drain = function() {
                            instance.loadPluginByManifest(data.manifest, data.repo, publishedTime);
                        };
                    } else {
                        instance.loadPluginByManifest(data.manifest, data.repo, publishedTime);
                    }
                }
            }, publishedTime);
        }
    },
    queueDependencies: function(manifest, repo, publishedTime) {

        var queue = org.ekstep.pluginframework.async.queue(function (task, callback) {
            org.ekstep.pluginframework.resourceManager.loadExternalResource(task.type, task.id, task.ver, task.src, task.repo, task.publishedTime, callback);
        }, 1);
        var instance = this;
        if (Array.isArray(manifest[org.ekstep.pluginframework.env].dependencies)) {
            manifest[org.ekstep.pluginframework.env].dependencies.forEach(function(dependency) {
                if (dependency.type == 'plugin') {
                    instance.loadPluginWithDependencies(dependency.plugin, dependency.ver, publishedTime);
                } else {
                    queue.push({
                        type: dependency.type, id: manifest.id, ver: manifest.ver, src: dependency.src, repo: repo, publishedTime: publishedTime
                    }, function() {});
                }
            });
        }
        return queue;
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
                if (Array.isArray(data)) {
                    data.forEach(function(d) {
                        p = new pluginClass(pluginManifest, d, parent);
                        instance.addPluginInstance(p);
                        p.initPlugin();
                        org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                        org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add');
                    })
                } else {
                    p = new pluginClass(pluginManifest, data, parent);
                    instance.addPluginInstance(p);
                    p.initPlugin();
                    org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                    org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add');                    
                }
            } catch(e) {
                delete instance.pluginInstances[p.id];
                throw e;
            }
        }
        return p;
    },
    addPluginInstance: function(pluginObj) {
        this.pluginInstances[pluginObj.id] = pluginObj;
    },
    removePluginInstance: function(pluginObj) {
        /* istanbul ignore else */
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
        if (org.ekstep.pluginframework.jQuery.isEmptyObject(plugins)) {
            callback();
        }
        var instance = this;
        var q = org.ekstep.pluginframework.async.queue(function(plugin, pluginCallback) {
            instance.loadPlugin(plugin.key, plugin.value);
            pluginCallback();
        }, 6);
        q.drain = function() {
            callback();
        };
        for (var pluginsKey in plugins) {
            q.push({ "key": pluginsKey, "value": plugins[pluginsKey] }, function(err) {});
        }
    },
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback) {
        if (this.plugins[pluginId]) {
            org.ekstep.pluginframework.resourceManager.getResource(pluginId, pluginVer, src, dataType, this.plugins[pluginId]['repo'], callback)
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
