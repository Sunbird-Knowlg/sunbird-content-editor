/**
 * Service to get Lock, Unlock & RefreshLock
 *
 * @class org.ekstep.services.lockService
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */
org.ekstep.services.lockService = new (org.ekstep.services.iService.extend({
    /**
     * @member {string} lockURL
     * @memberof org.ekstep.services.lockService
     */
    lockURL: function () {
        return this.getBaseURL() + this.getAPISlug() + this.getConfig('lockEndPoint', '/lock')
    },
    /**
    * This method is used to create lock
    * @param  {object}   requestObj
    * @param  {Function} callback returns error and response as arguments
    * @memberof org.ekstep.services.lockService
    */
    createLock: function (request, callback) {
        this.postFromService(this.lockURL() + this.getConfig('createLockUrl', '/v1/create'), request, this.setDeviceIdInHeader(), callback)
    },
    /**
     * This method is used to refresh lock
     * @param  {object}   requestObj
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.lockService
     */
    refreshLock: function (request, callback) {
        this.patch(this.lockURL() + this.getConfig('refreshLockUrl', '/v1/refresh'), request, {'X-device-Id': '12345'} , callback)
    },
    /**
     * This method is used to delete lock
     * @param  {object}   requestObj
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.lockService
     */
    deleteLock: function (request, callback) {
        this.delete(this.lockURL() + this.getConfig('deleteLockUrl', '/v1/retire'), request, this.setDeviceIdInHeader(), callback)
    },
    /**
     * set device id in requestHeaders
     * @memberof org.ekstep.services.lockService
     */
    setDeviceIdInHeader: function () {
        var fp = new Fingerprint2()
        fp.get(function (result) {
            var headersObj = _.cloneDeep(this.requestHeaders || {})
            headersObj['X-device-Id'] = result.toString()
            return headersObj
        })
    }
}))()