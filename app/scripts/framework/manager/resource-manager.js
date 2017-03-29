/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
org.ekstep.pluginframework.resourceManager = new(Class.extend({
    init: function() {},
    jQuery: undefined,
    buildNumber: undefined,
    initialize: function(jQuery) {
        this.jQuery = jQuery;
    },
    discoverManifest: function(pluginId, pluginVer, cb, publishedTime) {
        async.waterfall([
            function(callback) {
                org.ekstep.pluginframework.hostRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime); 
            },
            function(data, callback) {
                if (_.isUndefined(data.manifest)) {
                    org.ekstep.pluginframework.draftRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime);
                } else {
                    callback(null, data);
                }
            },
            function(data, callback) {
                if (_.isUndefined(data.manifest)) {
                    org.ekstep.pluginframework.publishedRepo.discoverManifest(pluginId, pluginVer, callback, publishedTime); 
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
                this.jQuery("body").append($("<script type='text/javascript' src=" + resource + ">"));
                break;
            case 'css':
                this.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + resource + "'>");
                break;
        }
    },
    loadResource: function(url, dataType, callback, publishedTime) {
        url = url + "?" + (org.ekstep.pluginframework.config ? org.ekstep.pluginframework.config.build_number : '');
        if (publishedTime) {
            url = url + "&" + publishedTime;
        }
        this.jQuery.ajax({
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
