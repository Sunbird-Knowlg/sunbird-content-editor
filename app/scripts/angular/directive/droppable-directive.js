angular.module('editorApp').directive('lvlDropTarget', ['$rootScope', function ($rootScope) {
	return {
		restrict: 'A',
		scope: {
			onDrop: '&'
		},
		link: function (scope, el, attrs, controller) {
			var id = angular.element(el).attr('id')
			if (!id) {
				id = window.UUID()
				angular.element(el).attr('id', id)
			}

			el.bind('dragover', function (e) {
				if (e.preventDefault) {
					e.preventDefault() // Necessary. Allows us to drop.
				}

				e.originalEvent.dataTransfer.dropEffect = 'move' // See the section on the DataTransfer object.
				return false
			})

			el.bind('dragenter', function (e) {
				// this / e.target is the current hover target.
				angular.element(e.target).addClass('lvl-over')
			})

			el.bind('dragleave', function (e) {
				angular.element(e.target).removeClass('lvl-over') // this / e.target is previous target element.
			})

			el.bind('drop', function (e) {
				if (e.preventDefault) {
					e.preventDefault() // Necessary. Allows us to drop.
				}

				if (e.stopPropagation) {
					e.stopPropagation() // Necessary. Allows us to drop.
				}
				var data = e.originalEvent.dataTransfer.getData('text')
				// eslint-disable-next-line
				var dest = document.getElementById(id)
				// eslint-disable-next-line
				var src = document.getElementById(data)

				scope.onDrop({dragEl: data, dropEl: id})
			})

			$rootScope.$on('LVL-DRAG-START', function () {
				var el = document.getElementById(id)
				angular.element(el).addClass('lvl-target')
			})

			$rootScope.$on('LVL-DRAG-END', function () {
				var el = document.getElementById(id)
				angular.element(el).removeClass('lvl-target')
				angular.element(el).removeClass('lvl-over')
			})
		}
	}
}])
