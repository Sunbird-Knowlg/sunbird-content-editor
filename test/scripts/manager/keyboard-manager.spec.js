'use strict';


describe('Keyboard manager', function() {

    beforeEach(function() {
        EkstepEditor.keyboardManager.registry = {};
    });

    it('should register the key combination with callback', function() {

        EkstepEditor.keyboardManager.registerKeyCombination("ctrl+h", function() {});

        expect(Object.keys(EkstepEditor.keyboardManager.registry).length).toBe(1);
        expect(Object.keys(EkstepEditor.keyboardManager.registry)[0]).toBe("ctrl72");
    });

    it('should invoke the callback on key combination keydown event', function() {

        var $document = {
            cb: undefined,
            on: function(action, cb) {
                this.cb = cb;
            },
            invoke: function(event) {
                this.cb(event);
            }
        };
        EkstepEditor.keyboardManager.initialize($document);
        var callbackInvoked = false;
        EkstepEditor.keyboardManager.registerKeyCombination("ctrl+x", function() {
            callbackInvoked = true;
        });
        $document.invoke({ ctrlKey: true, keyCode: 88, preventDefault: function() {} })
        expect(callbackInvoked).toBe(true);

        callbackInvoked = false;
        EkstepEditor.keyboardManager.registerKeyCombination("cmd + shift + alt + 5", function() {
            callbackInvoked = true;
        });
        $document.invoke({ metaKey: true, shiftKey: true, altKey: true, keyCode: 53, preventDefault: function() {} })
        expect(callbackInvoked).toBe(true);

        callbackInvoked = false;
        EkstepEditor.keyboardManager.registerKeyCombination("alt + del", function() {
            callbackInvoked = true;
        });
        $document.invoke({ metaKey: false, shiftKey: false, altKey: true, keyCode: 8, preventDefault: function() {} })
        expect(callbackInvoked).toBe(true);

        callbackInvoked = false;
        $document.invoke({ metaKey: true, shiftKey: false, altKey: true, keyCode: 8, preventDefault: function() {} })
        expect(callbackInvoked).toBe(false);
    });

    it('should throw error on multiple register of same key combination', function() {
        EkstepEditor.keyboardManager.registerKeyCombination("ctrl+x", function() {});
        var testFn = function() {
            EkstepEditor.keyboardManager.registerKeyCombination("ctrl+x", function() {});
        };
        expect(testFn).toThrow("The given key combination is already registered. Please provide a different combination");
    });

    it('should throw error when register command with only modifier key', function() {
        var testFn = function() {
            EkstepEditor.keyboardManager.registerKeyCombination("ctrl", function() {});
        };
        expect(testFn).toThrow("Cannot register a command only with modifier keys. Need one key character");
    });

    it('should throw error when register command with multiple key', function() {
        var testFn = function() {
            EkstepEditor.keyboardManager.registerKeyCombination("ctrl+x+h", function() {});
        };
        expect(testFn).toThrow("Cannot register a command with multiple key characters");
    });

    it('should throw error when register command with more than 4 key combination', function() {
        var testFn = function() {
            EkstepEditor.keyboardManager.registerKeyCombination("ctrl+x+h+j+K", function() {});
        };
        expect(testFn).toThrow("Cannot register a command with more than 3 keys");
    });

});
