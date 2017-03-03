/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    init: function() {
        this.repos = [EkstepEditor.hostRepo, EkstepEditor.draftRepo, EkstepEditor.publishedRepo];
    },
    discoverManifest: function(pluginId, pluginVer, cb) {
        async.waterfall([
            function(callback) {
                EkstepEditor.publishedRepo.discoverManifest(pluginId, pluginVer, callback); // callback(err, manifest)
            },
            function(data, callback) {
                if(_.isUndefined(data.manifest)) {
                    EkstepEditor.draftRepo.discoverManifest(pluginId, pluginVer, callback); // callback(err, manifest)    
                } else {
                    callback(null, data);
                }
            },
            function(data, callback) {
                if(_.isUndefined(data.manifest)) {
                    EkstepEditor.hostRepo.discoverManifest(pluginId, pluginVer, callback); // callback(err, manifest)
                } else {
                    callback(null, data);
                }
            }
        ], function(err, result) {
            if (result.manifest !== undefined)
                cb(undefined, result);
            else
                cb('Plugin not found in any repo', undefined);
        });

    },
    getResource: function(pluginId, pluginVer, src, dataType, repo, callback) {
        var resource = repo.resolveResource(pluginId, pluginVer, src);
        this.loadResource(resource, dataType, callback);
    },
    loadExternalResource: function(type, pluginId, pluginVer, src, repo) {
        var resource = repo.resolveResource(pluginId, pluginVer, src);
        switch (type) {
            case 'js':
                EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + resource + "?" + new Date().getTime() + ">"));
                break;
            case 'css':
                EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + resource + "?" + new Date().getTime() + "'>");
                break;
            default:
        }
    },
    loadResource: function(url, dataType, callback) {
        EkstepEditor.jQuery.ajax({
            async: false,
            url: url + "?" + EkstepEditor.config.build_number,
            dataType: dataType
        }).fail(function(err) {
            callback(err)
        }).done(function(data) {
            callback(null, data);
        });
    }
}));
