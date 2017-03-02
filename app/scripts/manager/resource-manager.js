/**
 * @author Harish kumar Gangula<harishg@ilimi.in>
 */
EkstepEditor.resourceManager = new(Class.extend({
    init: function() {
        this.repos = [EkstepEditor.hostRepo, EkstepEditor.draftRepo, EkstepEditor.publishedRepo];
    },
    discoverManifest: function(pluginId, pluginVer, cb) {
        async.parallel({
            published: function(callback) {
                EkstepEditor.publishedRepo.getManifest(pluginId, pluginVer, callback); // callback(err, manifest)
            },
            draft: function(callback) {
                EkstepEditor.draftRepo.getManifest(pluginId, pluginVer, callback); // callback(err, manifest)
            },
            hosted: function(callback) {
                EkstepEditor.hostRepo.getManifest(pluginId, pluginVer, callback); // callback(err, manifest)
            }
        }, function(err, result) {
            console.log(result);
            if (result.published.manifest !== undefined)
                cb(undefined, result.published);
            else if (result.draft.manifest !== undefined)
                cb(undefined, result.draft);
            else if (result.hosted.manifest !== undefined)
                cb(undefined, result.hosted);
            else
                cb('Plugin not found in any repo', undefined);
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
