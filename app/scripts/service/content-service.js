EkstepEditor.contentService = EkstepEditor.iService.extend({
    content: {},
    initService: function(config) {
        if (config) this.content[config.contentId] = {};
    },
    saveContent: function(data, contentId, versionKey) {        
        this.content[contentId] = _.isUndefined(this.content[contentId]) ? {} : this.content[contentId];
        this.content[contentId].data = _.isUndefined(data) ? this.content[contentId].data : JSON.stringify(data);
        this.content[contentId].versionKey = _.isUndefined(versionKey) ? this.content[contentId].versionKey : versionKey;
    },
    getContent: function() {        
        return JSON.parse(this.content[contentId].data);
    }
});
