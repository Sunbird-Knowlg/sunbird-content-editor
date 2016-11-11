EkstepEditor.contentService = new (EkstepEditor.iService.extend({
    content: {},
    config: undefined,
    initService: function(config) {
        if (config) {
            this.content[config.contentId] = {};
            this.config = config;
        }
    },
    saveContent: function(data, versionKey) {
        var id = this.config.contentId;
        this.content[id].data = _.isUndefined(data) ? this.content[id].data : JSON.stringify(data);
        this.content[id].versionKey = _.isUndefined(versionKey) ? this.content[id].versionKey : versionKey;
    },
    getContent: function(contentId, cb) {
        // TODO: Fetch content from server and invoke the callback
        cb(null, {});
    }
}));