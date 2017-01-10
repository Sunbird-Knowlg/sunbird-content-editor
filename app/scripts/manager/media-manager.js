/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.mediaManager = new(Class.extend({
    mediaMap: {},
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
        var aws_s3 = "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/";
        if (EkstepEditorAPI.globalContext.useProxyForURL) return src.replace(aws_s3, EkstepEditor.config.baseURL + assetReverseProxyUrl);
        if (!EkstepEditorAPI.globalContext.useProxyForURL) return src.replace(aws_s3, EkstepEditor.config.absURL + assetReverseProxyUrl);
    }
}));
