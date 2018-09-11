describe('Keyboard manager unit test case', function () {
	var km = org.ekstep.pluginframework.keyboardManager
	describe('registerKeyCombination method', function () {
		it('should register key combinations with callback', function () {
			spyOn(Mousetrap, 'bind')
			km.registerKeyCombination('ctrl+c', function () {})
			expect(Mousetrap.bind).toHaveBeenCalledWith('ctrl+c', jasmine.any(Function))
		})

		it('should throw error if no arguments passed', function () {
			spyOn(Mousetrap, 'bind')
			var throwableFn = function () {
				km.registerKeyCombination()
			}
			expect(throwableFn).toThrow('The given key combination is invalid.')
			expect(Mousetrap.bind).not.toHaveBeenCalledWith()
		})

		it('should throw error if callback is not passed', function () {
			spyOn(Mousetrap, 'bind')
			var throwableFn = function () {
				km.registerKeyCombination('ctrl+c')
			}
			expect(throwableFn).toThrow('The given key combination is invalid.')
			expect(Mousetrap.bind).not.toHaveBeenCalledWith()
		})

		it('should throw error if Key combination is not passed', function () {
			spyOn(Mousetrap, 'bind')
			var throwableFn = function () {
				km.registerKeyCombination(undefined, function () {})
			}
			expect(throwableFn).toThrow('The given key combination is invalid.')
			expect(Mousetrap.bind).not.toHaveBeenCalledWith()
		})
	})
})
