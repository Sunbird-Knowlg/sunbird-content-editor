EkstepEditor.contentService = new(EkstepEditor.iService.extend({
    serviceURL: EkstepEditor.config.baseURL + '/api/learning/',
    content: {},
    initService: function() {},
    setContentMeta: function(id, contentMeta) {
        if (id) {
            this.content[id] = _.isUndefined(this.content[id]) ? {} : this.content[id];
            this.content[id].contentMeta = _.isUndefined(contentMeta) ? this.content[id].contentMeta : contentMeta;
        }
    },
    getContentMeta: function(id) {
        return this.content[id];
    },
    saveContent: function(contentId, body, callback) {
        var instance = this,
            versionKey = instance.content[contentId].contentMeta.versionKey;

        if (contentId && versionKey && body) {
            var requestObj = {
                request: {
                    content: {
                        body: body,
                        versionKey: versionKey
                    }
                }
            };
            console.log("save content: ", requestObj);

            instance.http.patch(this.serviceURL + 'v2/content/' + contentId, requestObj, {}, serviceCallback);

            function serviceCallback(err, res) {                
                if (res) {
                    instance.content[contentId].contentMeta.versionKey=res.data.result.versionKey;                    
                }
                callback(err, res);
            }
        }
    },
    getContent: function(contentId, callback) {
        var instance = this;        
        if (contentId) {            
            instance.http.get(this.serviceURL + 'v2/content/' + contentId, {}, serviceCallback);
            function serviceCallback(err, res) {                
                if (res) {
                    instance.setContentMeta(contentId, res.data.result.content);                    
                }
                callback(err, res.data.result.content.body);
            };
                
        }
    }
}));