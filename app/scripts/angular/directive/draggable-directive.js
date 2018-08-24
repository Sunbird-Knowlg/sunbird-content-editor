angular.module('editorApp').directive('lvlDraggable', ['$rootScope', function ($rootScope) {
	return {
		restrict: 'A',
		link: function (scope, el, attrs, controller) {
			angular.element(el).attr('draggable', 'true')

			var id = angular.element(el).attr('id')

			if (!id) {
				id = window.UUID()
				angular.element(el).attr('id', id)
			}

			el.bind('dragstart', function (e) {
				e.originalEvent.dataTransfer.setData('text', id)
				$rootScope.$emit('LVL-DRAG-START')
			})

			el.bind('dragend', function (e) {
				$rootScope.$emit('LVL-DRAG-END')
			})
		}
	}
}])
