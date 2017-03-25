/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    init: function() {},
    discoverManifest: function(pluginId, pluginVer, cb, publishedTime) {
        async.waterfall([
            function(callback) {
                    EkstepEditor.hostRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime); 
            },
            function(data, callback) {
                if (_.isUndefined(data.manifest)) {
                    EkstepEditor.draftRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime);
                } else {
                    callback(null, data);
                }
            },
            function(data, callback) {
                if (_.isUndefined(data.manifest)) {
                    EkstepEditor.publishedRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime); 
                } else {
                    callback(null, data);
                }
            }
        ], function(err, result) {
            if (result.manifest !== undefined)
                cb(undefined, result);
            else
                cb('Plugin not found in any repo or manifest', undefined);
        });

    },
    getResource: function(pluginId, pluginVer, src, dataType, repo, callback, publishedTime) {
        var resource = repo.resolveResource(pluginId, pluginVer, src);
        this.loadResource(resource, dataType, callback, publishedTime);
    },
    loadExternalResource: function(type, pluginId, pluginVer, src, repo, publishedTime) {
        var resource = repo.resolveResource(pluginId, pluginVer, src) + "?" + (publishedTime || "");
        switch (type) {
            case 'js':
                EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + resource + ">"));
                break;
            case 'css':
                EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + resource + "'>");
                break;
        }
    },
    loadResource: function(url, dataType, callback, publishedTime) {
        url = url + "?" + EkstepEditor.config.build_number
        if (publishedTime) {
            url = url + "&" + publishedTime;
        }
        EkstepEditor.jQuery.ajax({
            async: false,
            url: url ,
            dataType: dataType
        }).fail(function(err) {
            callback(err)
        }).done(function(data) {
            callback(null, data);
        });
    }
}));
