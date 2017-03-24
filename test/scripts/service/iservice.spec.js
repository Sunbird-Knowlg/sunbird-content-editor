'use strict';

describe('iservice', function() {
    it('should serve GET request', function() {
        var callbackInvoked = false;
        var iservice = new EkstepEditor.iService({});
        console.log('IService', iservice.prototype);
        spyOn(iservice.http.$http, 'get').and.returnValue({
            then: function(fn1, fn2) {
                fn1();
            }
        });
        iservice.http.get("http://dev.ekstep.in/api/v2/content/do_1231238198372", {}, function() {
            callbackInvoked = true;
        });

        expect(callbackInvoked).toBe(true);
    });
});
