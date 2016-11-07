EkstepEditor.contentService = EkstepEditor.iService.extend({
    content: {},
    initService: function(config) {
        if (config) this.content[config.contentId] = {};
    },
    saveContent: function(data, contentId, versionKey) {
        console.log("content saved", data);
        contentId = _.isUndefined(contentId) ? EkstepEditor.contentId : contentId;
        this.content[contentId] = _.isUndefined(this.content[contentId]) ? {} : this.content[contentId];
        this.content[contentId].data = _.isUndefined(data) ? this.content[contentId].data : data;
        this.content[contentId].versionKey = _.isUndefined(versionKey) ? this.content[contentId].versionKey : versionKey;

    },
    getContent: function(contentId) {
        contentId = contentId ? contentId : EkstepEditor.contentId;
        return _.cloneDeep(this.content[contentId]);
    }
});
