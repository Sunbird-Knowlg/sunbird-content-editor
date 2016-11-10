EkstepEditor.contentService = EkstepEditor.iService.extend({
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
    getContent: function() {
        var contentExist = !_.isUndefined(this.content[this.config.contentId].data);        
        if (contentExist) return JSON.parse(this.content[this.config.contentId].data);
    }
});
