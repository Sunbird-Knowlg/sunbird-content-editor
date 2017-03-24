'use strict';

xdescribe('iservice', function() {
    it('should serve GET request', function() {
        var callbackInvoked = false;
        spyOn(EkstepEditor.iService.prototype.http, '$http').and.returnValue({
            get: function() {
                return {
                    then: function(fn1, fn2) {
                        fn1();
                    }
                }
            },
        });

        EkstepEditor.iService.prototype.http.get("http://dev.ekstep.in/api/v2/content/do_1231238198372", {}, function() {
            callbackInvoked = true;
        });

        expect(callbackInvoked).toBe(true);
    });
});
