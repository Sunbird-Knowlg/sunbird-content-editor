EkstepEditor.contentService = new(EkstepEditor.iService.extend({
    content: {},
    initService: function() {},
    setContentMeta: function(id, versionKey) {
        if (id) {
            this.content[id] = _.isUndefined(this.content[id]) ? {} : this.content[id];
            this.content[id].versionKey = _.isUndefined(versionKey) ? this.content[id].versionKey : versionKey;
        }
    },
    getContentMeta: function(id) {
        return this.content[id];
    },
    saveContent: function(dataType, contentId, body, callback) {
        var instance = this,
            ECMLBuilder = new window.ECMLBuilder(),
            contentBody = (dataType === 'xml') ? body : false || (dataType === 'json') ? ECMLBuilder.buildECML(EkstepEditor.stageManager.toECML()) : false,
            versionKey = instance.content[contentId].versionKey;

        if (contentId && versionKey && contentBody) {
            var requestObj = {
                request: {
                    content: {
                        body: contentBody,
                        versionKey: instance.content[contentId].versionKey
                    }
                }
            };

            console.log("save content: ", contentBody);

            instance.http.patch(EkstepEditor.configService.learningServiceBaseUrl + 'v2/content/' + contentId, requestObj)
                .then(function success(response) {
                    console.log("success response", response);
                    callback(null, response);
                    instance.setContentMeta(contentId, response.data.result.versionKey);
                }, function error(response) {
                    callback(response, null);
                });
        }
    },
    getContent: function(contentId, callback) {
        var instance = this;
        if (contentId) {
            var metaDataFields = "body,editorState,templateId,languageCode,template,gradeLevel,status,concepts,versionKey";
            instance.http.get(EkstepEditor.configService.learningServiceBaseUrl + 'v2/content/' + contentId + "?fields=" + metaDataFields)
                .then(function success(response) {
                    instance.setContentMeta(contentId, response.data.result.content.versionKey);
                    callback(null, response);
                }, function error(response) {
                    callback(response, null);
                });
        }
    }
}));
