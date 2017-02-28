/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    init: function() {
        this.repos =  [EkstepEditor.hostRepo, EkstepEditor.draftRepo, EkstepEditor.publishedRepo];
    },
    discoverManifest: function(pluginId, pluginVer, callback) {
        this._findManifestFromRepos(pluginId, pluginVer, function (err, data) {
            callback(err, data);
        });
    },
    _findManifestFromRepos: function (pluginId,pluginVer,callback, reposLength) {
        var instance = this;
        if (_.isUndefined(reposLength)) {
            reposLength = this.repos.length - 1;
        }
        this.getResource(pluginId, pluginVer, "manifest.json", "json", this.repos[reposLength], function(err, response) {
            var result = { "manifest": response, "repo": instance.repos[reposLength] }
            if (!err) {
                callback(err, result);
            } else if (err && reposLength > 0) {
                instance._findManifestFromRepos(pluginId, pluginVer, callback, --reposLength);
            } else if (err && reposLength <= 0) {
                callback(err, result);
            }
        });
    },
    getResource: function(pluginId, pluginVer, src, dataType, repo, callback) {
        this.loadResource(repo.url + '/' + pluginId + '-' + pluginVer + '/' + src, dataType, callback);
    },
    loadExternalResource: function(type, pluginId, pluginVer, src, repo) {
        
        url = repo.url + '/' + pluginId + '-' + pluginVer + '/' + src;
        switch (type) {
            case 'js':
                EkstepEditor.jQuery("body").append($("<script type='text/javascript' src=" + url + "?" + new Date().getTime() + ">"));
                break;
            case 'css':
                EkstepEditor.jQuery("head").append("<link rel='stylesheet' type='text/css' href='" + url + "?" + new Date().getTime() + "'>");
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
