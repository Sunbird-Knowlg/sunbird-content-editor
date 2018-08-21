describe('event manager unit test case', function () {
	var em = org.ekstep.pluginframework.eventManager
	it('should add event listener with callback', function () {
		spyOn(EventBus, 'addEventListener')
		em.addEventListener('test_event', function () {}, {})
		expect(EventBus.addEventListener).toHaveBeenCalledWith('test_event', jasmine.any(Function), jasmine.any(Object))
	})

	it('should dispatch event if events are enabled', function () {
		spyOn(EventBus, 'dispatch')
		em.dispatchEvent('test_event', {})
		expect(EventBus.dispatch).toHaveBeenCalledWith('test_event', undefined, jasmine.any(Object))
	})

	it('should not dispatch event if events are not enabled', function () {
		em.enableEvents = false
		spyOn(EventBus, 'dispatch')
		em.dispatchEvent('test_event', {})
		expect(EventBus.dispatch).not.toHaveBeenCalled()
		em.enableEvents = true
	})

	it('should allow to remove event listener', function () {
		spyOn(EventBus, 'removeEventListener')
		em.removeEventListener('test_event', function () {}, {})
		expect(EventBus.removeEventListener).toHaveBeenCalledWith('test_event', jasmine.any(Function), jasmine.any(Object))
	})
})
