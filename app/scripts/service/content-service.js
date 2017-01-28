EkstepEditor.contentService = new(EkstepEditor.iService.extend({
    serviceURL: EkstepEditor.config.baseURL + EkstepEditor.config.apislug +'/learning/',
    content: {},
    initService: function() {},
    setContentMeta: function(id, contentMeta) {
        if (id) {
            this.content[id] = _.isUndefined(this.content[id]) ? {} : this.content[id];
            this.content[id].contentMeta = _.isUndefined(contentMeta) ? this.content[id].contentMeta : contentMeta;
        }
    },
    getContentMeta: function(id) {
        return this.content[id] || {};
    },
    saveContent: function(contentId, body, callback) {
        this._saveContent(contentId, body, undefined, callback);
    },
    saveMigratedContent: function(contentId, body, oldBody, callback) {
        console.log("Saving oldBody in the content.")
        this._saveContent(contentId, body, oldBody, callback);
    },
    _saveContent: function(contentId, body, oldBody, callback) {
        var instance = this,
            versionKey = instance.content[contentId] && instance.content[contentId].contentMeta.versionKey;

        if (contentId && versionKey && body) {
            var requestObj = {
                request: {
                    content: {
                        body: JSON.stringify(body),
                        versionKey: versionKey
                    }
                }
            };

            if(!_.isUndefined(oldBody)) {
                requestObj.request.content.oldBody = JSON.stringify(oldBody);
            }

            var headers = {
                "headers": {
                    "content-type": "application/json",
                    "user-id": "ATTool"
                }
            }

            instance.http.patch(this.serviceURL + 'v2/content/' + contentId, requestObj, headers, serviceCallback);

            function serviceCallback(err, res) {
                if (res) {
                    instance.content[contentId].contentMeta.versionKey = res.data.result.versionKey;
                }
                callback(err, res);
            }
        }
    },
    getContent: function(contentId, callback) {
        var instance = this;
        if (contentId) {
            var metaDataFields = "?fields=body,editorState,templateId,languageCode,template,gradeLevel,status,concepts,versionKey,name,appIcon,contentType";
            instance.http.get(this.serviceURL + 'v2/content/' + contentId + metaDataFields, {}, function(err,res){
                if (err) callback(err, undefined);
                if (!err && res.statusText == "OK") {
                    callback(err, res.data.result.content);
                }
                
            });
            //get content meta for preview
            instance.http.get(this.serviceURL + 'v2/content/' + contentId, {}, function(err, res){
                if(res) instance.setContentMeta(contentId, res.data.result.content);
            });
        } else {
            callback(null, undefined);
        }
    }
}));
