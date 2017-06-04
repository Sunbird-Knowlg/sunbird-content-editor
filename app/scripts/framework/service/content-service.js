/**
 * Content service helps to retrieve/save the content, content meta details by making call to learning API.
 * It also helps to download the content.
 *
 * @class org.ekstep.services.contentService
 * @author Sunil A S <sunils@ilimi.in>
 */
org.ekstep.services.contentService = new(org.ekstep.services.iService.extend({
    serviceURL: function() {
        return this.getBaseURL() + this.getAPISlug() + '/content/'
    },
    content: {},
    initService: function() {},
    /**
     *
     * content meta data fields
     *
     * @memberof org.ekstep.services.contentService
     */
    contentFields: "body,editorState,stageIcons,templateId,languageCode,template,gradeLevel,status,concepts,versionKey,name,appIcon,contentType,owner,domain,code,visibility,createdBy,description,language,mediaType,mimeType,osId,languageCode,createdOn,lastUpdatedOn,audience,ageGroup,attributions",
    /**
     *
     * sets content meta for the given content id
     * @param id {string}
     * @param contentMeta {object} content meta object
     * @private
     * @memberof org.ekstep.services.contentService
     */
    _setContentMeta: function(id, contentMeta) {
        /* istanbul ignore else */
        if (id && contentMeta) {
            var meta = {};
            for (k in contentMeta) {
                if (k != 'body' && k != 'stageIcons') {
                    meta[k] = contentMeta[k];
                }
            }
            this.content[id] = meta;
        }
    },
    /**
     *
     * returns content meta details
     * @param id {string} content id
     * @returns {object} if id is "undefined" returns empty object
     *
     * @memberof org.ekstep.services.contentService
     */
    getContentMeta: function(id) {
        return this.content[id] || {};
    },
    /**
     *
     * saves content body by making call to learing API
     * @param contentId {string} content id
     * @param metadata {object} meta data object
     * @param body {object} ECML JSON object of content
     * @param callback {function} callback function
     *
     * @memberof org.ekstep.services.contentService
     */
    saveContent: function(contentId, metadata, body, callback) {
        this._saveContent(contentId, metadata, body, callback);
    },
    /**
     *
     * saves content body by making call to learing API
     * @param contentId {string} content id
     * @param metadata {object} meta data object
     * @param body {object} ECML JSON object of content
     * @param callback {function} callback function
     * @private
     * @memberof org.ekstep.services.contentService
     *
     */
    _saveContent: function(contentId, metadata, body, callback) {

        var instance = this;
        var versionKey = instance.content[contentId] && instance.content[contentId].versionKey;

        if (contentId && versionKey) {
            var update = false;
            var content = {
                versionKey: versionKey,
                lastUpdatedBy: window.context.user.id
            }
            if (metadata) {
                update = true;
                for (k in metadata) {
                    content[k] = metadata[k];
                }
            }
            if (body) {
                content.compatibilityLevel = body.theme.compatibilityVersion;
                content['body'] = JSON.stringify(body);
                update = true;
            }
            if (update) {
                var requestObj = { request: { content: content } };
                instance.patch(this.serviceURL() + 'v3/update/' + contentId, requestObj, this.requestHeaders, function(err, res) {
                    /* istanbul ignore else */
                    if (res && res.data.responseCode == "OK") {
                        instance.content[contentId].versionKey = res.data.result.versionKey;
                        callback(undefined, res);
                    } else {
                        callback(true, err);
                    }
                });
            } else {
                callback('Nothing to save');
            }
        } else {
            callback('Cannot find content id or version key to update content');
        }
    },
    /**
     *
     *
     * retrieves the content and content meta details
     * @param contentId {string} content id
     * @param callback {function} callback function
     *
     * @memberof org.ekstep.services.contentService
     */
    getContent: function(contentId, callback) {
        var instance = this;
        if (contentId) {
            var metaDataFields = "?mode=edit&fields=" + instance.contentFields;
            instance.get(this.serviceURL() + 'v3/read/' + contentId + metaDataFields, this.requestHeaders, function(err, res) {
                /* istanbul ignore else */
                if (err) callback(err, undefined);
                if (!err && res.data && res.data.result && res.data.result.content) {
                    instance._setContentMeta(contentId, res.data.result.content);
                    callback(err, res.data.result.content);
                } else {
                    callback(new Error('no content found!'), undefined)
                }

            });
        } else {
            callback('Content id is required to get content from platform', undefined);
        }
    },
    /**
     *
     *
     * retrieves the versionKey
     * @param contentId {string} content id
     * @param callback {function} callback function
     *
     * @memberof org.ekstep.services.contentService
     */
    getContentVersionKey: function(contentId, callback) {
        var instance = this;
        if (contentId) {
            var metaDataFields = "?mode=edit&fields=" + "versionKey";
            instance.get(this.serviceURL() + 'v3/read/' + contentId + metaDataFields, this.requestHeaders, function(err, res) {
                if (!err && res.data && res.data.result && res.data.result.content) {
                    instance._setContentMeta(contentId, res.data.result.content);
                    callback(err, res.data.result.content);
                } else {
                    callback(new Error('no content found!'), undefined)
                }
            });
        } else {
            callback('Content id is required to get versionKey from platform', undefined);
        }
    },
    /**
     * retrieves template data of selected templateid
     * @param templateId {string} template id
     * @param callback {function} callback function
     * @memberof org.ekstep.services.contentService
     */
    getTemplateData: function(templateId, callback) {
        var instance = this;
        var templateMetaFields = "?taxonomyId=literacy_v2&fields=body,editorState,templateId,languageCode";
        instance.get(this.serviceURL() + 'v3/read/' + templateId + templateMetaFields, this.requestHeaders, function(err, res) {
            callback(err, res)
        });
    },
    /**
     *
     *
     * retrieves downloadable URL link to content
     * @param contentId {string} content id
     * @param fileName {string} "name" parameter of meta data object
     * @param callback {function} callback function
     *
     * @memberof org.ekstep.services.contentService
     */
    downloadContent: function(contentId, fileName, callback) {
        var data = { "request": { "content_identifiers": [contentId], "file_name": fileName } };
        this.postFromService(this.serviceURL() + 'v3/bundle', data, this.requestHeaders, callback);
    }
}));
