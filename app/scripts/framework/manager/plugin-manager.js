/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
org.ekstep.pluginframework.pluginManager = new(Class.extend({
    pluginManifests: {},
    plugins: {},
    pluginObjs: {},
    pluginInstances: {},
    pluginVisited: {},
    errors: [],
    init: function() {
        console.log("Plugin manager initialized");
    },
    _registerPlugin: function(pluginId, pluginVer, plugin, manifest, repo) {
        this.plugins[pluginId] = { p: plugin, m: manifest, repo: repo };
        this._registerNameSpace(pluginId, plugin);
        if (manifest) this.pluginManifests[manifest.id] =  manifest;
        org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:load', { plugin: pluginId, version: pluginVer });
        org.ekstep.pluginframework.eventManager.dispatchEvent(pluginId + ':load');
    },
    registerPlugin: function(manifest, plugin, repo) {
        repo = repo || org.ekstep.pluginframework.publishedRepo;
        this._registerPlugin(manifest.id, manifest.ver, plugin, manifest, repo);
        var p = new plugin(manifest); // Initialize Global instance of the plugin
        this.pluginObjs[manifest.id] = p;
    },
    loadCustomPlugin: function(dependency, callback, publishedTime) {
        var instance = this;
        org.ekstep.pluginframework.resourceManager.loadResource(dependency.src, 'script', function(err, data) {
            if (err) {
                console.error('Unable to load editor plugin', 'plugin:' + dependency.id + '-' + dependency.ver, 'resource:', 'Error:', err);
            } else {
                try {
                    if (!instance.isPluginDefined(dependency.id)) {
                        data = eval(data);
                        instance._registerPlugin(dependency.id, undefined, data, undefined, undefined);
                    } else {
                        console.info("Plugin is already registered: ", dependency.id);
                    }
                } catch (e) {
                    console.error("Error while loading plugin", 'plugin:' + dependency.id + '-' + dependency.ver, 'Error:', e);
                }
            }
        }, publishedTime);
        callback && callback();
    },
    loadPluginByManifest: function(manifest, repo, pluginType, publishedTime) {
        var instance = this;
        var scope = org.ekstep.pluginframework.env;
        org.ekstep.pluginframework.resourceManager.getResource(manifest.id, manifest.ver, manifest[scope].main, 'text', repo, function(err, data) {
            if (err) {
                console.error('Unable to load editor plugin', 'plugin:' + manifest.id + '-' + manifest.ver, 'resource:' + manifest[scope].main, 'Error:', err);
            } else {
                try {
                    if (!instance.isPluginDefined(manifest.id)) {
                        if (pluginType == 'library') {
                            org.ekstep.pluginframework.jQuery.globalEval(data);
                        } else {
                            if (data) instance.registerPlugin(manifest, eval(data), repo);
                        }
                    } else {
                        console.info("Plugin is already registered: ", manifest.id);
                    }
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
        if (!window[baseNameSpace]) {
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
        this.loadPluginWithDependencies(pluginId, version, undefined, publishedTime, function() {});
        if (this.isPluginDefined(pluginId)) {
            var pluginManifest = this.getPluginManifest(pluginId);
            if (pluginManifest.type && (pluginManifest.type.toLowerCase() === "widget")) {
                this.invoke(pluginId, JSON.parse(JSON.stringify(pluginManifest[org.ekstep.pluginframework.env]['init-data'] || {})), parent);
            }
            return 0;
        } else {
            return 1;
        }
    },
    loadPluginWithDependencies: function(pluginId, pluginVer, pluginType, publishedTime, callback) {
        var instance = this;
        if (this.plugins[pluginId] || this.pluginVisited[pluginId]) {
            console.log('A plugin with id "' + pluginId + '" and ver "' + pluginVer + '" is already loaded');
            callback();
        } else {
            org.ekstep.pluginframework.resourceManager.discoverManifest(pluginId, pluginVer, function(err, data) {
                if (err || (data == undefined)) {
                    console.error('Unable to load plugin manifest', 'plugin:' + pluginId + '-' + pluginVer, 'Error:', err);
                    callback(); // TODO: probably pass the error
                } else {
                    instance.pluginVisited[pluginId] = true;                                      
                    instance.loadManifestDependencies(data.manifest.dependencies, publishedTime, function() {
                        if (pluginType === 'renderer') {
                            callback();
                        } else {
                            var queue = instance.queueDependencies(data.manifest, data.repo, publishedTime);
                            if (queue.length() > 0) {
                                queue.drain = function() {
                                    instance.loadPluginByManifest(data.manifest, data.repo, pluginType, publishedTime);
                                    callback();
                                };
                            } else {
                                instance.loadPluginByManifest(data.manifest, data.repo, pluginType, publishedTime);
                                callback();
                            }
                        }
                    });
                }
            }, publishedTime);
        }
    },
    queueDependencies: function(manifest, repo, publishedTime) {
        var scope = org.ekstep.pluginframework.env;
        var queue = org.ekstep.pluginframework.async.queue(function(task, callback) {
            org.ekstep.pluginframework.resourceManager.loadExternalPluginResource(task.type, task.id, task.ver, task.src, task.repo, task.publishedTime, callback);
        }, 1);
        var instance = this;
        if (Array.isArray(manifest[scope].dependencies)) {
            manifest[scope].dependencies.forEach(function(dependency) {
                if (dependency.type == 'plugin') {
                    instance.loadPluginWithDependencies(dependency.plugin, dependency.ver, dependency.type, publishedTime, function() {});
                } else {
                    queue.push({
                        type: dependency.type,
                        id: manifest.id,
                        ver: manifest.ver,
                        src: dependency.src,
                        repo: repo,
                        publishedTime: publishedTime
                    }, function() {});
                }
            });
        }
        return queue;
    },
    loadManifestDependencies: function(dependencies, publishedTime, callback) {
        var instance = this;
        if (Array.isArray(dependencies) && dependencies.length > 0) {
            var queue = org.ekstep.pluginframework.async.queue(function(plugin, pluginCallback) {
                instance.loadPluginWithDependencies(plugin.id, plugin.ver, plugin.type, plugin.pt, pluginCallback);
            }, 6);
            dependencies.forEach(function(dep) {
                if (org.ekstep.pluginframework.env == 'renderer') {
                    if (dep.scope == org.ekstep.pluginframework.env || dep.scope == 'all') {
                        queue.push({ 'id': dep.plugin, 'ver': dep.ver, 'type': dep.type, 'pt': publishedTime }, function(err) {});
                    }
                } else {
                    queue.push({ 'id': dep.plugin, 'ver': dep.ver, 'type': dep.type, 'pt': publishedTime }, function(err) {});
                }
            });
            if (queue.length() > 0) {
                queue.drain = function() {
                    callback();
                };
            } else {
                callback();
            }
        } else {
            callback();
        }
    },
    isManifestDefined: function(id) {
        if (this.pluginManifests[id]) {
            return true;
        } else {
            return false;
        }
    },
    isPluginDefined: function(id) {
        if (this.plugins[id]) {
            return true;
        } else {
            return false;
        }
    },
    loadPlugin: function(pluginId, pluginVer, callback) {
        this.loadPluginWithDependencies(pluginId, pluginVer, "plugin", undefined, function() {
           console.log('Plugin loaded: ', pluginId); 
           callback && callback();
        });
    },
    loadAllPlugins: function(plugins, otherDependencies, callback) {
        var instance = this;
        if (Array.isArray(plugins) && plugins.length) {            
            var q = org.ekstep.pluginframework.async.queue(function(plugin, pluginCallback) {
                instance.loadPluginWithDependencies(plugin.id, plugin.ver, plugin.type, plugin.pt, pluginCallback);
            }, 6);
            q.drain = function() {
                instance.loadOtherDependencies(otherDependencies, callback);
            };
            plugins.forEach(function(plugin) {
                q.push({ 'id': plugin.id, 'ver': plugin.ver, 'type': plugin.type, 'pt': undefined }, function(err) {});
            });
        } else if (Array.isArray(otherDependencies) && otherDependencies.length) {
            instance.loadOtherDependencies(otherDependencies, callback);
        } else {
            callback();
        }
    },
    loadOtherDependencies: function(otherDependencies, callback) {
        var instance = this;
        if (Array.isArray(otherDependencies) && otherDependencies.length) {
            var queue = org.ekstep.pluginframework.async.queue(function(dependency, cb) {
                if (dependency.type == 'plugin') {
                    instance.loadCustomPlugin(dependency, cb);
                } else {
                    org.ekstep.pluginframework.resourceManager.loadExternalResource(dependency.src, dependency.type, undefined, cb);
                }
            }, 1);
            otherDependencies.forEach(function(dep) {
                if (!dep.plugin || !instance.isPluginDefined(dep.plugin)) {
                    queue.push(dep, function(err) {});
                }
            });
            if (queue.length() > 0) {
                queue.drain = function() {
                    callback && callback();
                };
            } else {
                callback && callback();
            }
        } else {
            callback && callback();
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
            } catch (e) {
                delete instance.pluginInstances[p.id];
                throw e;
            }
        }
        return p;
    },
    invokeRenderer: function(id, data, parent, stage, theme) {
        var instance = this;
        var p = undefined;
        var plugin = this.plugins[id];
        if (!plugin) {
            this.addError('No plugin found for - ' + id);
        } else {
            try {
                var pluginClass = plugin.p;
                var pluginManifest = plugin.m || { id: id, ver: undefined };
                if (Array.isArray(data)) {
                    data.forEach(function(d) {
                        p = new pluginClass(d, parent, stage, theme);
                        instance.addPluginInstance(p);
                        org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                        org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add');
                    })
                } else {
                    p = new pluginClass(data, parent, stage, theme);
                    instance.addPluginInstance(p);
                    org.ekstep.pluginframework.eventManager.dispatchEvent('plugin:add', { plugin: pluginManifest.id, version: pluginManifest.ver, instanceId: p.id });
                    org.ekstep.pluginframework.eventManager.dispatchEvent(pluginManifest.id + ':add');
                }
            } catch (e) {
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
        this.pluginManifests = {};
        this.pluginVisited = {};
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
    resolvePluginResource: function(id, ver, resource) {
        if (this.plugins[id] && this.plugins[id]["repo"]) {
            return this.plugins[id]["repo"].resolveResource(id, ver, resource);
        } else {
            return false;
        }
    }
}));
