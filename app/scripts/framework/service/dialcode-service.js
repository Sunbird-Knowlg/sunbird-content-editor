/**
 * Service to get DIAL & Link codes
 * 
 * @class org.ekstep.services.dialcodeService
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */
org.ekstep.services.dialcodeService = new(org.ekstep.services.iService.extend({
    /** 
     * @member {string} dialcodeURL
     * @memberof org.ekstep.services.dialcodeService
     */
    dialcodeURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('dialcodeEndPoint', '/dialcode');
    },
    /** 
     * @member {string} contentURL
     * @memberof org.ekstep.services.dialcodeService
     */
    dialcodelinkURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('dialcodeEndPoint', '/content/v3/dialcode');
    },
    /**
     * Get all DIAL codes
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.dialcodeService
     */
    getAllDialCodes: function(channel, request, callback){
        this.requestHeaders.headers['X-Channel-Id'] = channel;
        this.postFromService(this.dialcodeURL() + this.getConfig('getAllDialcodes','/v3/search'), request, this.requestHeaders, callback);
    },
    /**
     * retrieves the DIAL code
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.dialcodeService
     */
    getlDialCode: function(dialCode, callback) {
        if (dialCode) {
            this.get(this.dialcodeURL() + this.getConfig('dialCodeReadUrl', '/v3/read/') + dialCode , this.requestHeaders, callback);
        } else {
            callback('dialCode id is required to get dialCode details', undefined);
        }
    },
     /**
     * link dial code to content
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.dialcodeService
     */
    dialcodeLink: function(request, callback){
        this.postFromService(this.dialcodelinkURL() + this.getConfig('dialcodeLink','/link'), request, this.requestHeaders, callback);
    }
}));