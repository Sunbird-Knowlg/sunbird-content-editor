/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    repos: [EkstepEditor.hostRepo, EkstepEditor.draftRepo, EkstepEditor.publishedRepo,],
    loadPlugin: function(pluginId, pluginVer, callback) {
        var instance = this;
        var reposLength = this.repos.length-1;
        this.loadManifest(pluginId, pluginVer, function (err, response) {
            if (err) {
                console.error("Unable to loadPlugin ",pluginId);
            } else {
                instance.loadPluginByManifest(response);
            }
        }, reposLength);
    },
    loadManifest: function (pluginId, pluginVer, callback, reposLength) {
        var instance = this;
        this.loadPluginResource(pluginId, pluginVer, "manifest.json", "json", function(err, response) {            
            if (!err) {
                callback(err, response);
            } else if (err && reposLength >= 0) {
                instance.loadManifest(pluginId, pluginVer,callback, --reposLength);
            } else if (err && reposLength <= 0) {
                callback(err, response);
            }
        }, this.repos[reposLength].url);
    },
    loadPluginResource: function(pluginId, pluginVer, src, dataType, callback, resourceUrl) {
        // TODO: Enhance to use plugin version too
        var url = resourceUrl;
        if (!url) {
            url = EkstepEditor.config.pluginRepo;
        }
        EkstepEditor.loadResource(url+'/' + pluginId + '-' + pluginVer + '/' + src, dataType, callback);
    },
    loadExternalResource: function(type, pluginId, pluginVer, src, resourceUrl) {
        var url = resourceUrl;
        if (!url) {
            url = EkstepEditor.config.pluginRepo + '/' + pluginId + '-' + pluginVer + '/' + src;
        }
        switch (type) {
            case 'js':
                EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + url + "?" + EkstepEditor.config.build_number + ">"));
                break;
            case 'css':
                EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "?" + EkstepEditor.config.build_number + "'>");
                break;
            default:
        }
    },
    loadPluginByManifest: function(manifest) {
        var instance = this;
        instance.loadPluginResource(manifest.id, manifest.ver, manifest.editor.main, 'text', function(err, data) {
            if (err) {
                console.error('Unable to load plugin js', manifest.editor.main);
            } else {
                instance.loadDependencies(manifest);
                try {
                    EkstepEditor.pluginManager.registerPlugin(manifest, eval(data));
                } catch (e) {
                    console.error("error while loading plugin:" + manifest.id, e);
                }
            }
        });
    },
    loadDependencies: function(manifest) {
        var instance = this;
        if (_.isArray(manifest.editor.dependencies)) {
            _.forEach(manifest.editor.dependencies, function(dependency) {
                if (dependency.type == 'plugin') {
                    instance.loadPlugin(dependency.plugin, dependency.ver, function(err, res) {
                        if (err) {
                            console.error("unable to load dependent plugin : " + dependency.plugin);
                        }
                    });
                } else {
                    instance.loadExternalResource(dependency.type, manifest.id, manifest.ver, dependency.src);
                }
            });
        }
    }

}));
