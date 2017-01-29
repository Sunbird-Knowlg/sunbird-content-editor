/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.mediaManager = new(Class.extend({
    mediaMap: {},
    migratedMediaMap: {},
    addMedia: function(media) {
        if (_.isObject(media) && _.isString(media.id)) {
            this.mediaMap[media.id] = media;
        }
    },
    getMedia: function(asset) {
        return this.mediaMap[asset];
    },
    getMediaOriginURL: function(src) {
        var assetReverseProxyUrl = "/assets/public/";
        var aws_s3 = "";
        _.forEach(EkstepEditor.config.aws_s3_urls, function(url){
            if(src.indexOf(url) !== -1){
                aws_s3 = url;
            }
        });
        if (EkstepEditorAPI.globalContext.useProxyForURL && aws_s3 !== "") return src.replace(aws_s3, EkstepEditor.config.baseURL + assetReverseProxyUrl);
        if (!EkstepEditorAPI.globalContext.useProxyForURL && aws_s3 !== "") return src.replace(aws_s3, EkstepEditor.config.absURL + assetReverseProxyUrl);
    },
    addToMigratedMedia: function(media) {
        if (_.isObject(media) && _.isString(media.id)) {
            this.migratedMediaMap[media.id] = media;
        }
    }
}));
