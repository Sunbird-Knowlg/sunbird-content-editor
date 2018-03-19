/**
 * Service to get DIAL & Link codes
 * 
 * @class org.ekstep.services.dialcodeService
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */
org.ekstep.services.dialcodeService = new(org.ekstep.services.iService.extend({
    /** 
     * @member {string} learningURL
     * @memberof org.ekstep.services.dialcodeService
     */
    dialcodeURL: function() {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('dialcodeEndPoint', '/dialcode');
    },
    /**
     * Get all DIAL codes
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.dialcodeService
     */
    getAllDialCodes: function(data, callback){
        this.postFromService(this.dialcodeURL() + this.getConfig('getAllDialcodes','/v3/search'), data, this.requestHeaders, callback);
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
    dialcodeLink: function(data, callback){
        this.postFromService(this.dialcodeURL() + this.getConfig('dialcodeLink','/link'), data, this.requestHeaders, callback);
    }
}));